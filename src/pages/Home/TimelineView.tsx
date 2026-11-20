import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, Film, RotateCcw, Tv } from 'lucide-react';
import Header from '@/components/layout/Header/Header';
import ReleaseCountdown from '@/components/layout/ReleaseCountdown/ReleaseCountdown';
import ViewNavigation, { type AppView } from '@/components/layout/ViewNavigation/ViewNavigation';
import TimelineDetails from '@/features/detective-board/components/TimelineDetails';
import { useTimelineData } from '@/features/detective-board/hooks/useTimelineData';
import type { MCUTimelineEntry } from '@/types/mcu.types';

type TitleTypeFilter = 'all' | 'movie' | 'tvshow';

interface TimelineViewProps {
  onViewChange: (view: AppView) => void;
}

interface VisibleTimelineGroup {
  continuity: string;
  multiverseDesignation: string;
  entries: MCUTimelineEntry[];
}

function sortTimelineEntries(entries: MCUTimelineEntry[]): MCUTimelineEntry[] {
  return entries
    .map((entry, originalIndex) => ({ entry, originalIndex }))
    .sort((a, b) => {
      const aOrder = a.entry.chronology_order > 0 ? a.entry.chronology_order : Number.MAX_SAFE_INTEGER;
      const bOrder = b.entry.chronology_order > 0 ? b.entry.chronology_order : Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder || a.originalIndex - b.originalIndex;
    })
    .map(({ entry }) => entry);
}

export default function TimelineView({ onViewChange }: TimelineViewProps) {
  const {
    groups,
    isLoading,
    error,
    reload,
    selectedEntry,
    setSelectedEntry,
    selectedDetails,
    isDetailLoading,
    detailError,
  } = useTimelineData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinuity, setSelectedContinuity] = useState('all');
  const [titleType, setTitleType] = useState<TitleTypeFilter>('all');
  const [selectedEntryContinuity, setSelectedEntryContinuity] = useState<string>();

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('[aria-label="Search titles and timelines"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const continuityOptions = useMemo(
    () => [...new Set(groups.map((group) => group.continuity))].sort((a, b) => a.localeCompare(b)),
    [groups],
  );
  const totalTitles = useMemo(
    () => groups.reduce((count, group) => count + group.entries.length, 0),
    [groups],
  );

  const visibleGroups = useMemo<VisibleTimelineGroup[]>(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return groups
      .filter((group) => selectedContinuity === 'all' || group.continuity === selectedContinuity)
      .map((group) => ({
        continuity: group.continuity,
        multiverseDesignation: group.multiverse_designation,
        entries: sortTimelineEntries(
          group.entries.filter((entry) => {
            const matchesType = titleType === 'all' || entry.type === titleType;
            const matchesSearch =
              !query ||
              entry.title.toLocaleLowerCase().includes(query) ||
              group.continuity.toLocaleLowerCase().includes(query) ||
              group.multiverse_designation.toLocaleLowerCase().includes(query);
            return matchesType && matchesSearch;
          }),
        ),
      }))
      .filter((group) => group.entries.length > 0);
  }, [groups, searchQuery, selectedContinuity, titleType]);

  const visibleTitleCount = visibleGroups.reduce((count, group) => count + group.entries.length, 0);
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedContinuity('all');
    setTitleType('all');
  };
  const selectTimelineEntry = (entry: MCUTimelineEntry, continuity: string) => {
    setSelectedEntry(entry);
    setSelectedEntryContinuity(continuity);
  };
  const closeTimelineEntry = () => {
    setSelectedEntry(null);
    setSelectedEntryContinuity(undefined);
  };
  const hasFilters = searchQuery || selectedContinuity !== 'all' || titleType !== 'all';

  return (
    <>
      <Header
        view="timeline"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        titleCount={totalTitles}
        timelineCount={groups.length}
        onRefresh={reload}
        isLoading={isLoading}
      />

      <ViewNavigation activeView="timeline" onViewChange={onViewChange} />

      <main className="case-workspace">
        <div className="workspace-heading">
          <div className="workspace-title">
            <span className="eyebrow-label">TEMPORAL MONITORING <i> / </i> ACTIVE CASE</span>
            <ReleaseCountdown />
          </div>
          <div className="workspace-note">
            <span className="note-pin" />
            <p>Every universe follows its own timeline.<br />Find where the records cross.</p>
            <span className="note-signature">— TVA TEMPORAL ARCHIVES</span>
          </div>
        </div>

        <div className="board-toolbar timeline-toolbar">
          <div className="board-toolbar__label">
            <span className="timeline-toolbar__marker" aria-hidden="true" />
            <span>CHRONOLOGY FILTERS</span>
          </div>
          <label className="filter-select">
            <span>CONTINUITY</span>
            <select
              value={selectedContinuity}
              onChange={(event) => setSelectedContinuity(event.target.value)}
              aria-label="Filter by continuity"
            >
              <option value="all">All timelines</option>
              {continuityOptions.map((continuity) => (
                <option key={continuity} value={continuity}>{continuity}</option>
              ))}
            </select>
            <ChevronDown size={13} aria-hidden="true" />
          </label>
          <label className="filter-select">
            <span>MEDIA</span>
            <select
              value={titleType}
              onChange={(event) => setTitleType(event.target.value as TitleTypeFilter)}
              aria-label="Filter by media type"
            >
              <option value="all">Movies + shows</option>
              <option value="movie">Movies only</option>
              <option value="tvshow">TV shows only</option>
            </select>
            <ChevronDown size={13} aria-hidden="true" />
          </label>
          {hasFilters && (
            <button type="button" className="filter-reset" onClick={clearFilters}>
              <RotateCcw size={12} /> CLEAR FILTERS
            </button>
          )}
          <div className="filter-results"><b>{visibleTitleCount}</b> TITLES IN VIEW</div>
        </div>

        {error ? (
          <section className="load-state load-state--error" role="alert">
            <AlertTriangle size={25} />
            <span className="eyebrow-label">ARCHIVE CONNECTION FAILED</span>
            <h2>Couldn’t load the timeline.</h2>
            <p>{error}</p>
            <button type="button" className="primary-button" onClick={reload}>RETRY CONNECTION</button>
          </section>
        ) : isLoading ? (
          <section className="load-state" aria-live="polite">
            <div className="loader-seal"><span /></div>
            <span className="eyebrow-label">FETCHING TEMPORAL RECORDS</span>
            <h2>Syncing the timelines...</h2>
            <p>Retrieving chronology records for movies and television across the multiverse.</p>
          </section>
        ) : (
          <div className="workspace-grid timeline-workspace">
            <section className="timeline-section">
              <div className="board-caption">
                <div><span className="board-caption__dot" /> MULTIVERSE CHRONOLOGY <span className="board-caption__divider">/</span> <span className="board-caption__sub">ORDERED BY TVA TIMELINE</span></div>
                <span className="board-caption__coords">{visibleGroups.length} <i>·</i> ACTIVE LANES</span>
              </div>
              <div className="timeline-list">
                {visibleGroups.length === 0 ? (
                  <div className="board-empty timeline-empty">
                    <span className="board-empty__stamp">NO MATCHING RECORDS</span>
                    <p>Adjust your filters or search another title.</p>
                  </div>
                ) : visibleGroups.map((group) => (
                  <section className="timeline-lane" key={`${group.continuity}:${group.multiverseDesignation}`}>
                    <header className="timeline-lane__header">
                      <span className="timeline-lane__seal">TVA</span>
                      <div>
                        <h2>{group.continuity}</h2>
                        <span>{group.multiverseDesignation}</span>
                      </div>
                      <span className="timeline-lane__count">{group.entries.length} RECORDS</span>
                    </header>
                    <ol className="timeline-entries">
                      {group.entries.map((entry) => {
                        const selected = selectedEntry?.id === entry.id && selectedEntry.type === entry.type;
                        const MovieIcon = entry.type === 'movie' ? Film : Tv;
                        return (
                          <li
                            key={`${entry.type}:${entry.id}`}
                            className={`timeline-entry${selected ? ' timeline-entry--selected' : ''}${entry.chronology_order === 0 ? ' timeline-entry--unplaced' : ''}`}
                          >
                            <span className="timeline-entry__axis">
                              <span>{entry.chronology_order > 0 ? String(entry.chronology_order).padStart(2, '0') : '—'}</span>
                            </span>
                            <button
                              type="button"
                              className="timeline-entry__button"
                              onClick={() => selectTimelineEntry(entry, group.continuity)}
                              aria-pressed={selected}
                            >
                              <span className="timeline-entry__type"><MovieIcon size={14} /> {entry.type === 'movie' ? 'FILM' : 'SERIES'}</span>
                              <strong>{entry.title}</strong>
                              <span className="timeline-entry__open">OPEN FILE <span aria-hidden="true">↗</span></span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </section>
                ))}
              </div>
              <div className="board-legend timeline-legend">
                <span><i className="timeline-legend__line" /> TVA TEMPORAL ORDER</span>
                <span><Film size={11} /> FILM</span>
                <span><Tv size={11} /> SERIES</span>
                <span className="board-legend__zoom">LANES REPRESENT DISTINCT CONTINUITIES</span>
              </div>
            </section>
            <TimelineDetails
              entry={selectedEntry}
              details={selectedDetails}
              isLoading={isDetailLoading}
              error={detailError}
              groupName={selectedEntryContinuity}
              onClose={closeTimelineEntry}
            />
          </div>
        )}
      </main>
    </>
  );
}
