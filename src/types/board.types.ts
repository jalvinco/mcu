import type { MCUCharacter, MCUMovie } from './mcu.types';

export type StringColor = 'red' | 'yellow' | 'white' | 'blue' | 'black';

export interface ConnectionRelation {
  sourceId: number;
  targetId: number;
  sharedMovies: MCUMovie[];
  connectionType: 'team' | 'shared_movie' | 'first_appearance' | 'variant' | 'ally';
  strength: number;
}

export type IncursionEvidenceCategory = 'confirmed' | 'theory';

export interface IncursionCaseSubject {
  character: MCUCharacter;
  category: IncursionEvidenceCategory;
  location: string;
  heading: string;
  action: string;
  rationale: string;
  apiAvailable: boolean;
}

export interface IncursionCaseLink {
  sourceId: number;
  targetId: number;
  label: string;
  category: IncursionEvidenceCategory;
  strength: number;
}

export interface BoardNodeData extends Record<string, unknown> {
  character: MCUCharacter;
  movieCount: number;
  movies: MCUMovie[];
  isSelected: boolean;
  caseSubject: IncursionCaseSubject;
  pinColor?: 'red' | 'gold' | 'silver' | 'green' | 'blue';
  notes?: string;
  isClueHighlighted?: boolean;
}

export type LayoutMode = 'd3-force' | 'grid' | 'circle' | 'timeline';

export interface BoardFilterState {
  searchQuery: string;
  selectedPhase: number | 'all';
  selectedMovieId: number | 'all';
  minConnections: number;
  selectedContinuity: string | 'all';
  stringColor: StringColor;
  layoutMode: LayoutMode;
  showOnlyConnected: boolean;
}
