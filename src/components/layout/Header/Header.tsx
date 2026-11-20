import { RefreshCw, Search, Shield } from 'lucide-react';
import BackgroundAudio from '@/components/layout/BackgroundAudio/BackgroundAudio';

type HeaderView = 'board' | 'timeline' | 'characters';

interface HeaderProps {
  view: HeaderView;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  titleCount: number;
  timelineCount: number;
  onRefresh?: () => void;
  isLoading: boolean;
}

export default function Header({
  view,
  searchQuery,
  onSearchChange,
  titleCount,
  timelineCount,
  onRefresh,
  isLoading,
}: HeaderProps) {
  return (
    <header className="app-header">
      <a className="brand-lockup" href="/" aria-label="TVA Incursion Case Files home">
        <span className="brand-mark" aria-hidden="true">
          <Shield size={22} strokeWidth={1.7} />
        </span>
        <span className="brand-copy">
          <span className="brand-title">TVA<span>FILE</span></span>
          <span className="brand-subtitle">MULTIVERSE INCIDENT UNIT</span>
        </span>
      </a>

      <div className="header-case">
        <span className="eyebrow-label">
          {view === 'board' ? 'INVESTIGATION BOARD' : view === 'timeline' ? 'TEMPORAL ARCHIVE' : 'DOOMSDAY ROSTER'}
        </span>
        <span className="header-case__id">
          CASE No. 616 <i>•</i> {view === 'board' ? 'INCURSION INVESTIGATION' : view === 'timeline' ? 'MULTIVERSE TIMELINE' : 'CHARACTER DOSSIERS'}
        </span>
      </div>

      <label className="search-field">
        <Search size={16} aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={
            view === 'board'
              ? 'Search suspects, evidence...'
              : view === 'timeline'
                ? 'Search titles, timelines...'
                : 'Search Doomsday characters...'
          }
          aria-label={
            view === 'board'
              ? 'Search suspects and evidence'
              : view === 'timeline'
                ? 'Search titles and timelines'
                : 'Search Doomsday characters'
          }
        />
        <kbd>⌘ K</kbd>
      </label>

      <div className="header-audio" aria-label="Clock sound controls">
        <BackgroundAudio />
      </div>
      <div className="header-counts" aria-label="View totals">
        <span><b>{titleCount}</b> {view === 'board' ? 'SUBJECTS' : view === 'timeline' ? 'TITLES' : 'CHARACTERS'}</span>
        <span><b>{timelineCount}</b> {view === 'board' ? 'THREADS' : view === 'timeline' ? 'TIMELINES' : 'PORTRAITS'}</span>
      </div>
      {onRefresh && (
        <button
          type="button"
          className="icon-button header-refresh"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh MCU data"
          title="Refresh data"
        >
          <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
        </button>
      )}
    </header>
  );
}
