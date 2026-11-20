import { getOptimizedImageUrl } from '@/config/characterImages';
import type {
  MCUCharacter,
  MCUMovie,
  MCUTimelineGroup,
  MCUTimelineEntry,
  MCUTVShow,
  MCUPaginatedResponse,
} from '@/types/mcu.types';
import { api } from './api';

const CHARACTER_PAGE_SIZE = 100;
const CHARACTER_COLUMNS =
  'id,name,alias,description,image_url,played_by,continuity,multiverse_designation,variant_of';

export interface TimelineTitleDetails {
  title: MCUMovie | MCUTVShow;
  characters: MCUCharacter[];
}

export async function getCharacters(): Promise<MCUCharacter[]> {
  const firstPage = await api.get<MCUPaginatedResponse<MCUCharacter>>(
    `/characters?limit=${CHARACTER_PAGE_SIZE}&page=1&columns=${CHARACTER_COLUMNS}`,
  );
  if (!Array.isArray(firstPage.data) || typeof firstPage.total !== 'number') {
    throw new Error('The temporal archive returned an unreadable character index.');
  }

  const pageCount = Math.ceil(firstPage.total / CHARACTER_PAGE_SIZE);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      api.get<MCUPaginatedResponse<MCUCharacter>>(
        `/characters?limit=${CHARACTER_PAGE_SIZE}&page=${index + 2}&columns=${CHARACTER_COLUMNS}`,
      ),
    ),
  );
  const pages = [firstPage, ...remainingPages];
  if (pages.some((page) => !Array.isArray(page.data))) {
    throw new Error('The temporal archive returned an incomplete character index.');
  }

  return pages.flatMap((page) => page.data);
}

export async function getTimeline(): Promise<MCUTimelineGroup[]> {
  const groups = await api.get<MCUTimelineGroup[]>('/timeline');
  if (!Array.isArray(groups) || groups.some((group) => !Array.isArray(group.entries))) {
    throw new Error('The temporal chronology record is unreadable.');
  }
  return groups;
}

export async function getTimelineTitleDetails(
  entry: MCUTimelineEntry,
): Promise<TimelineTitleDetails> {
  const resource = entry.type === 'movie' ? 'movies' : 'tvshows';
  const characterResource = entry.type === 'movie' ? 'movie' : 'tvshow';
  const [title, characters] = await Promise.all([
    api.get<MCUMovie | MCUTVShow>(`/${resource}/${entry.id}`),
    api.get<MCUCharacter[]>(`/characters/${characterResource}/${entry.id}`),
  ]);

  if (!Array.isArray(characters)) {
    throw new Error(`The cast record for ${entry.title} is incomplete.`);
  }

  return {
    title,
    characters: characters.map((character) => ({
      ...character,
      image_url:
        getOptimizedImageUrl(character.image_url, 'w185') ??
        character.image_url,
    })),
  };
}
