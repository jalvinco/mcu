import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Header from '@/components/layout/Header/Header';
import ReleaseCountdown from '@/components/layout/ReleaseCountdown/ReleaseCountdown';
import ViewNavigation, { type AppView } from '@/components/layout/ViewNavigation/ViewNavigation';
import DetectiveBoard from './DetectiveBoard';
import IncursionDossier from './IncursionDossier';
import { useIncursionBoard } from '../hooks/useIncursionBoard';
import { incursionCaseConnections } from '../data/incursionCases';
import type { IncursionEvidenceCategory } from '@/types/board.types';

type EvidenceFilter = 'all' | IncursionEvidenceCategory;

interface CaseBoardViewProps {
  onViewChange: (view: AppView) => void;
}

export default function CaseBoardView({ onViewChange }: CaseBoardViewProps) {
  const { subjects, isLoading, error, reload } = useIncursionBoard();
  const [searchQuery, setSearchQuery] = useState('');
  const [evidenceFilter, setEvidenceFilter] = useState<EvidenceFilter>('all');
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('[aria-label="Search suspects and evidence"]')?.focus();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const visibleSubjects = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return subjects.filter((subject) => {
      const matchesCategory = evidenceFilter === 'all' || subject.category === evidenceFilter;
      const matchesSearch =
        !query ||
        [
          subject.character.name,
          subject.character.alias,
          subject.location,
          subject.heading,
          subject.action,
          subject.rationale,
        ]
          .filter(Boolean)
          .some((value) => value?.toLocaleLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [evidenceFilter, searchQuery, subjects]);

  const visibleConnections = useMemo(() => {
    const visibleIds = new Set(visibleSubjects.map((subject) => subject.character.id));
    return incursionCaseConnections.filter(
      (connection) =>
        visibleIds.has(connection.sourceId) && visibleIds.has(connection.targetId),
    );
  },
    [visibleSubjects],
  );
  const selectedSubject =
    visibleSubjects.find((subject) => subject.character.id === selectedCharacterId) ?? null;
  const connectedCount = visibleConnections.length;

  return (
    <>
      <Header
        view="board"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        titleCount={subjects.length}
        timelineCount={incursionCaseConnections.length}
        onRefresh={reload}
        isLoading={isLoading}
      />

      <ViewNavigation activeView="board" onViewChange={onViewChange} />

      <main className="case-workspace">
        <div className="workspace-heading">
          <div className="workspace-title">
            <span className="eyebrow-label countdown-quote">All of you have lived stolen lives, but now you must give them back</span>
            <ReleaseCountdown />
          </div>
          <div className="workspace-note">
            <span className="note-pin" />
            <p>Which choices opened a path between worlds?<br />Follow the people and the evidence.</p>
            <span className="note-signature">— TVA TEMPORAL ARCHIVES</span>
          </div>
        </div>

        <div className="board-toolbar case-board-toolbar">
          <div className="board-toolbar__label">
            <span className="timeline-toolbar__marker" aria-hidden="true" />
            <span>EVIDENCE GROUP</span>
          </div>
          <div className="case-filter-tabs" role="group" aria-label="Filter case evidence">
            <button
              type="button"
              className={evidenceFilter === 'confirmed' ? 'case-filter-tab case-filter-tab--active' : 'case-filter-tab'}
              onClick={() => setEvidenceFilter('confirmed')}
              aria-pressed={evidenceFilter === 'confirmed'}
            >
              ON-SCREEN EVENTS
            </button>
            <button
              type="button"
              className={evidenceFilter === 'theory' ? 'case-filter-tab case-filter-tab--active' : 'case-filter-tab'}
              onClick={() => setEvidenceFilter('theory')}
              aria-pressed={evidenceFilter === 'theory'}
            >
              THEORIES / INDIRECT
            </button>
            <button
              type="button"
              className={evidenceFilter === 'all' ? 'case-filter-tab case-filter-tab--active' : 'case-filter-tab'}
              onClick={() => setEvidenceFilter('all')}
              aria-pressed={evidenceFilter === 'all'}
            >
              ALL FILES
            </button>
          </div>
          {(searchQuery || evidenceFilter !== 'all') && (
            <button
              type="button"
              className="filter-reset"
              onClick={() => {
                setSearchQuery('');
                setEvidenceFilter('all');
                setSelectedCharacterId(null);
              }}
            >
              <RotateCcw size={12} /> RESET VIEW
            </button>
          )}
          <div className="filter-results"><b>{visibleSubjects.length}</b> FILES IN VIEW</div>
        </div>

        <div className="case-evidence-note">
          <span className="evidence-mark evidence-mark--confirmed" />
          <span>Solid threads = on-screen events</span>
          <span className="evidence-mark evidence-mark--theory" />
          <span>Dashed threads = theories or indirect links</span>
          <span className="case-evidence-note__caveat">Not every event is confirmed to have caused an Incursion.</span>
        </div>

        {error ? (
          <section className="load-state load-state--error" role="alert">
            <AlertTriangle size={25} />
            <span className="eyebrow-label">ARCHIVE CONNECTION FAILED</span>
            <h2>Couldn’t load the case files.</h2>
            <p>{error}</p>
            <button type="button" className="primary-button" onClick={reload}>RETRY CONNECTION</button>
          </section>
        ) : isLoading ? (
          <section className="load-state" aria-live="polite">
            <div className="loader-seal"><span /></div>
            <span className="eyebrow-label">FETCHING SUBJECT RECORDS</span>
            <h2>Opening the case files...</h2>
            <p>Cross-referencing identities and portraits across the temporal archive.</p>
          </section>
        ) : (
          <div className="workspace-grid">
            <section className="board-section">
              <div className="board-caption">
                <div>
                  <span className="board-caption__dot" /> INCURSION CASE BOARD
                  <span className="board-caption__divider">/</span>
                  <span className="board-caption__sub">
                    {evidenceFilter === 'confirmed'
                      ? 'ON-SCREEN EVENTS'
                      : evidenceFilter === 'theory'
                        ? 'THEORIES & INDIRECT LINKS'
                        : 'ALL EVIDENCE'}
                  </span>
                </div>
                <span className="board-caption__coords">{connectedCount} <i>·</i> THREADS</span>
              </div>
              <DetectiveBoard
                key={visibleSubjects.map((subject) => subject.character.id).join(',')}
                subjects={visibleSubjects}
                connections={visibleConnections}
                selectedCharacterId={selectedCharacterId}
                compactGroups={evidenceFilter === 'all'}
                onSelectCharacter={setSelectedCharacterId}
              />
              <div className="board-legend">
                <span><i className="legend-thread" /> ON-SCREEN RECORD</span>
                <span><i className="legend-thread legend-thread--variant" /> THEORY / INDIRECT LINK</span>
                <span className="board-legend__zoom">DRAG TO ARRANGE <i>·</i> SCROLL TO PAN</span>
              </div>
            </section>
            <IncursionDossier
              key={selectedSubject?.character.id ?? 'empty'}
              subject={selectedSubject}
              onClose={() => setSelectedCharacterId(null)}
            />
          </div>
        )}
      </main>
    </>
  );
}
