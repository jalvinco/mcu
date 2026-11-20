import { lazy, Suspense, useState } from 'react';
import ChatangoChat from '@/components/layout/ChatangoChat/ChatangoChat';
import type { AppView } from '@/components/layout/ViewNavigation/ViewNavigation';
import CaseBoardView from '@/features/detective-board/components/CaseBoardView';

const TimelineView = lazy(() => import('./TimelineView'));
const DoomsdayCharactersView = lazy(() => import('./DoomsdayCharactersView'));

export default function Home() {
  const [activeView, setActiveView] = useState<AppView>('board');
  const [boardVisit, setBoardVisit] = useState(0);

  const navigateToView = (view: AppView) => {
    setActiveView(view);
    if (view === 'board') setBoardVisit((current) => current + 1);
  };

  return (
    <div className="app-shell">
      <div className="app-main-layout">
        <div className="app-page">
          {activeView === 'board' ? (
            <CaseBoardView key={boardVisit} onViewChange={navigateToView} />
          ) : (
            <Suspense
              fallback={
                <section className="load-state" aria-live="polite">
                  <div className="loader-seal"><span /></div>
                  <span className="eyebrow-label">OPENING TVA RECORDS</span>
                  <h2>Loading case files...</h2>
                </section>
              }
            >
              {activeView === 'timeline' ? (
                <TimelineView onViewChange={navigateToView} />
              ) : (
                <DoomsdayCharactersView onViewChange={navigateToView} />
              )}
            </Suspense>
          )}
          <footer className="app-footer">
            <span>© TVA TEMPORAL ARCHIVES <i>·</i> MULTIVERSE RECORDS</span>
            <span>ARCHIVE SOURCE <a href="https://github.com/augustomarcelo/mcuapi" target="_blank" rel="noreferrer">TEMPORAL RECORDS <span aria-hidden="true">↗</span></a></span>
          </footer>
        </div>
      </div>
      <ChatangoChat />
    </div>
  );
}
