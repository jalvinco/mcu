const localImageModules = import.meta.glob<string>('../assets/images/*.jpg', {
  eager: true,
  import: 'default',
  query: '?url',
});

const localImages: Record<string, string> = {};

for (const [path, url] of Object.entries(localImageModules)) {
  const filename = path.split('/').pop()?.replace(/\.jpg$/i, '');
  if (filename) localImages[normalizeCharacterName(filename)] = url;
}

const localImageAliases: Record<string, string> = {
  stephenstrange: 'doctorstrange',
  doctordoom: 'drdoom',
  doctorstephenstrange: 'doctorstrange',
  victorvondoom: 'drdoom',
  misterfantastic: 'mrfantastic',
  reedrichards: 'mrfantastic',
  brucebanner: 'hulk',
  scottlang: 'antman',
  tonystark: 'ironman',
  wandamaximoff: 'scarletwitch',
  johnnystorm: 'humantorch',
  suestorm: 'invisiblewoman',
  bengrimm: 'thething',
  monicarambeau: 'photon',
  wadewilson: 'deadpool',
  loganhowlett: 'wolverine',
  godloki: 'loki',
};

function normalizeCharacterName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function resolveImageKey(value: string): string {
  const normalized = normalizeCharacterName(value);
  return localImageAliases[normalized] ?? normalized;
}

/**
 * Optimizes TMDB image size to reduce network payload.
 * e.g., converts /w500/ or original to /w185/ for card thumbnails.
 */
export function getOptimizedImageUrl(imageUrl: string | null | undefined, size: 'w185' | 'w500' = 'w185'): string | null {
  if (!imageUrl) return null;
  return imageUrl.replace(/\/t\/p\/(w\d+|original)\//, `/t/p/${size}/`);
}

export function getLocalCharacterImage(
  characterName: string,
  characterAlias?: string | null,
  location?: string | null,
): string | null {
  const identityKeys = [characterAlias, characterName]
    .filter((name): name is string => Boolean(name))
    .flatMap((name) => name.split(/[/(]/).map((part) => part.replace(/[)]/g, '').trim()))
    .filter(Boolean)
    .map(resolveImageKey);

  if (
    normalizeCharacterName(location ?? '').includes('earth838')
    && identityKeys.includes('scarletwitch')
    && localImages.scarletwitch838
  ) {
    return localImages.scarletwitch838;
  }

  const locationKey = location ? resolveImageKey(location) : '';
  if (locationKey && localImages[locationKey]) return localImages[locationKey];

  return identityKeys.map((key) => localImages[key]).find(Boolean) ?? null;
}
