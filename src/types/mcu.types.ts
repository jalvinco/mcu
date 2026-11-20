export interface MCUResourceLink {
  href: string;
}

export interface MCUResourceLinks {
  self?: MCUResourceLink;
  movies?: MCUResourceLink;
  tvshows?: MCUResourceLink;
  characters?: MCUResourceLink;
  first_appearance_movie?: MCUResourceLink;
}

export interface MCUCharacter {
  id: number;
  name: string;
  alias: string | null;
  description: string | null;
  image_url: string | null;
  played_by: string | null;
  continuity: string | null;
  multiverse_designation: string | null;
  variant_of: number | null;
  first_appearance_movie_id: number | null;
  first_appearance_tvshow_id: number | null;
  created_at?: string;
  updated_at?: string;
  _links?: MCUResourceLinks;
  // Computed client fields
  movies?: MCUMovie[];
  tvshows?: MCUTVShow[];
}

export interface MCUMovie {
  id: number;
  title: string;
  release_date: string | null;
  box_office: string | null;
  duration: number | null;
  overview: string | null;
  cover_url?: string | null;
  trailer_url?: string | null;
  directed_by?: string | null;
  phase?: number | null;
  saga?: string | null;
  chronology?: number | null;
  timeline_chronology_order?: number | null;
  continuity?: string | null;
  multiverse_designation?: string | null;
  post_credit_scenes_count?: number;
  is_mcu?: boolean;
}

export interface MCUTVShow {
  id: number;
  title: string;
  release_date: string | null;
  number_episodes?: number;
  overview: string | null;
  cover_url?: string | null;
  phase?: number | null;
  saga?: string | null;
  chronology?: number | null;
  timeline_chronology_order?: number | null;
  continuity?: string | null;
  multiverse_designation?: string | null;
  is_mcu?: boolean;
}

export interface MCUTimelineEntry {
  id: number;
  title: string;
  chronology_order: number;
  type: 'movie' | 'tvshow';
  _links?: {
    self?: MCUResourceLink;
  };
}

export interface MCUTimelineGroup {
  continuity: string;
  multiverse_designation: string;
  entries: MCUTimelineEntry[];
}

export interface MCUPaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}
