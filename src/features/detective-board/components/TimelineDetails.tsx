import { AlertTriangle, Clock3, Film, Fingerprint, Tv, X } from 'lucide-react';
import { getLocalCharacterImage } from '@/config/characterImages';
import type { TimelineTitleDetails } from '@/services/mcuService';
import type { MCUTimelineEntry } from '@/types/mcu.types';

interface TimelineDetailsProps {
  entry: MCUTimelineEntry | null;
  details: TimelineTitleDetails | null;
  isLoading: boolean;
  error: string | null;
  groupName?: string;
  onClose: () => void;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'DATE NOT ANNOUNCED';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export default function TimelineDetails({
  entry,
  details,
  isLoading,
  error,
  groupName,
  onClose,
}: TimelineDetailsProps) {
  if (!entry) {
    return (
      <aside className="details-panel timeline-details timeline-details--empty">
        <div className="empty-dossier">
          <div className="empty-dossier__icon"><Clock3 size={27} /></div>
          <span className="eyebrow-label">TEMPORAL RECORDS</span>
          <h2>Select a title<br />to inspect its file.</h2>
          <p>Choose any entry on the timeline to view its record and associated persons.</p>
        </div>
        <div className="panel-footnote">
          <span>TVA ARCHIVES</span>
          <p>Each universe follows its own chronology.</p>
        </div>
      </aside>
    );
  }

  const title = details?.title;
  const isMovie = entry.type === 'movie';
  const Icon = isMovie ? Film : Tv;
  const characters = details?.characters ?? [];
  const season =
    !isMovie && title && 'season' in title && typeof title.season === 'number'
      ? title.season
      : null;

  return (
    <aside className="details-panel timeline-details">
      <div className="dossier-heading">
        <div>
          <span className="eyebrow-label">TEMPORAL FILE</span>
          <span className="dossier-heading__id">ORDER #{entry.chronology_order || '—'}</span>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close title file">
          <X size={17} />
        </button>
      </div>

      {isLoading ? (
        <div className="timeline-detail-loading" aria-live="polite">
          <div className="loader-seal"><span /></div>
          <span className="eyebrow-label">RETRIEVING TEMPORAL RECORD</span>
        </div>
      ) : error ? (
        <div className="timeline-detail-error" role="alert">
          <AlertTriangle size={23} />
          <span className="eyebrow-label">RECORD UNAVAILABLE</span>
          <p>{error}</p>
        </div>
      ) : (
        <>
          {title?.cover_url ? (
            <div className="timeline-poster">
              <img src={title.cover_url} alt="" loading="lazy" decoding="async" />
              <span className="portrait-stamp">ARCHIVE<br />RECORD</span>
            </div>
          ) : (
            <div className="timeline-poster timeline-poster--missing"><Icon size={34} /></div>
          )}

          <div className="timeline-dossier-title">
            <span className="timeline-type-label"><Icon size={13} /> {isMovie ? 'FEATURE FILM' : 'TELEVISION'}</span>
            <h2>{title?.title ?? entry.title}</h2>
            <span className="timeline-group-label">{groupName || 'Unknown continuity'}</span>
          </div>

          <div className="dossier-meta timeline-meta">
            <div>
              <span>CHRONOLOGY ORDER</span>
              <b>{entry.chronology_order > 0 ? `#${entry.chronology_order}` : 'UNPLACED'}</b>
            </div>
            <div>
              <span>RELEASE DATE</span>
              <b>{formatDate(title?.release_date)}</b>
            </div>
            {title?.phase != null && (
              <div>
                <span>MCU PHASE</span>
                <b>PHASE {title.phase}</b>
              </div>
            )}
            {season !== null && (
              <div>
                <span>SEASON</span>
                <b>{season}</b>
              </div>
            )}
          </div>

          <section className="dossier-section">
            <h3><Icon size={14} /> RECORD SUMMARY</h3>
            <p className="dossier-description">
              {title?.overview || 'No synopsis is available for this timeline entry.'}
            </p>
          </section>

          <section className="dossier-section timeline-cast">
            <h3><Fingerprint size={14} /> ASSOCIATED PERSONS <span>{characters.length}</span></h3>
            {characters.length > 0 ? (
              <ul className="timeline-cast-list">
                {characters.slice(0, 10).map((character) => {
                  const portraitUrl = getLocalCharacterImage(
                    character.name,
                    character.alias,
                    [character.multiverse_designation, character.continuity].filter(Boolean).join(' '),
                  );

                  return (
                    <li key={character.id}>
                      {portraitUrl ? (
                        <img src={portraitUrl} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <span className="timeline-cast-avatar">{character.name.slice(0, 1)}</span>
                      )}
                      <span>
                        <b>{character.name}</b>
                        <small>{character.alias || character.played_by || 'Identity details unavailable'}</small>
                      </span>
                    </li>
                  );
                })}
                {characters.length > 10 && (
                  <li className="timeline-cast-more">+ {characters.length - 10} more archived</li>
                )}
              </ul>
            ) : (
              <p className="muted-copy">No associated persons recorded.</p>
            )}
          </section>
        </>
      )}
      <div className="panel-footnote"><span>TVA // CLASSIFIED</span><span>{entry.type.toUpperCase()} RECORD</span></div>
    </aside>
  );
}
