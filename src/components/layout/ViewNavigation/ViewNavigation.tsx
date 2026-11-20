import { Clock3, Shield, Users } from 'lucide-react';

export type AppView = 'board' | 'timeline' | 'doomsday';

interface ViewNavigationProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export default function ViewNavigation({ activeView, onViewChange }: ViewNavigationProps) {
  return (
    <nav className="view-nav-bar" aria-label="Case file sections">
      <span className="view-nav-bar__label">CASE FILES</span>
      <div className="view-nav-bar__links">
        <button
          type="button"
          className={`view-nav-button${activeView === 'board' ? ' view-nav-button--active' : ''}`}
          onClick={() => onViewChange('board')}
          aria-current={activeView === 'board' ? 'page' : undefined}
        >
          <Shield size={15} aria-hidden="true" />
          <span>CASE BOARD</span>
        </button>
        <button
          type="button"
          className={`view-nav-button${activeView === 'timeline' ? ' view-nav-button--active' : ''}`}
          onClick={() => onViewChange('timeline')}
          aria-current={activeView === 'timeline' ? 'page' : undefined}
        >
          <Clock3 size={15} aria-hidden="true" />
          <span>TIMELINE</span>
        </button>
        <button
          type="button"
          className={`view-nav-button${activeView === 'doomsday' ? ' view-nav-button--active' : ''}`}
          onClick={() => onViewChange('doomsday')}
          aria-current={activeView === 'doomsday' ? 'page' : undefined}
        >
          <Users size={15} aria-hidden="true" />
          <span>DOOMSDAY CHARACTERS</span>
        </button>
      </div>
    </nav>
  );
}
