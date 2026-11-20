import { ENV } from '@/config/env';

const CACHE_PREFIX = 'mcu_api_cache_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class ApiService {
  private cache = new Map<string, unknown>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${ENV.API_BASE_URL}${endpoint}`;
    
    // In-memory cache check
    if (this.cache.has(url)) {
      return this.cache.get(url) as T;
    }

    // LocalStorage persistent cache check
    try {
      const stored = localStorage.getItem(CACHE_PREFIX + url);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          this.cache.set(url, parsed.data);
          return parsed.data as T;
        } else {
          localStorage.removeItem(CACHE_PREFIX + url);
        }
      }
    } catch {
      // Ignore storage errors
    }

    const pendingRequest = this.pendingRequests.get(url);
    if (pendingRequest) {
      return pendingRequest as Promise<T>;
    }

    const request = this.fetchAndCache<T>(url, options);
    this.pendingRequests.set(url, request);
    try {
      return await request;
    } finally {
      if (this.pendingRequests.get(url) === request) {
        this.pendingRequests.delete(url);
      }
    }
  }

  private async fetchAndCache<T>(url: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`The temporal relay returned signal ${response.status}.`);
      }

      const data = await response.json();
      this.cache.set(url, data);

      // Persist to localStorage
      try {
        localStorage.setItem(
          CACHE_PREFIX + url,
          JSON.stringify({ timestamp: Date.now(), data })
        );
      } catch {
        // Ignore quota limits
      }

      return data as T;
    } catch (error) {
      console.warn(`Temporal archive retrieval failed for ${url}:`, error);
      if (error instanceof Error && error.message.startsWith('The temporal relay returned signal ')) {
        throw error;
      }
      throw new Error('The temporal archive connection failed. Check the relay and try again.');
    }
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore storage errors
    }
  }
}

export const api = new ApiService();
