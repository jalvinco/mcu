import { AlertTriangle, FileText, Fingerprint, X } from 'lucide-react';
import { useState } from 'react';
import { getLocalCharacterImage } from '@/config/characterImages';
import type { IncursionCaseSubject } from '@/types/board.types';

interface IncursionDossierProps {
  subject: IncursionCaseSubject | null;
  onClose: () => void;
}

export default function IncursionDossier({ subject, onClose }: IncursionDossierProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!subject) {
    return (
      <aside className="details-panel details-panel--empty">
        <div className="empty-dossier">
          <div className="empty-dossier__icon"><Fingerprint size={28} /></div>
          <span className="eyebrow-label">AWAITING SELECTION</span>
          <h2>Choose a suspect<br />or evidence link.</h2>
          <p>Open a pinned file to read the event, the proposed connection, and what is confirmed versus theory.</p>
          <div className="empty-dossier__hint"><span className="hint-thread" /> Solid lines mark on-screen events; dashed lines mark theories.</div>
        </div>
        <div className="panel-footnote">
          <span>FIELD NOTES</span>
          <p>Drag files to arrange the board. Scroll to move across the evidence wall.</p>
        </div>
      </aside>
    );
  }

  const { character } = subject;
  const portraitUrl = getLocalCharacterImage(character.name, character.alias, subject.location);
  const categoryLabel = subject.category === 'confirmed' ? 'ON-SCREEN RECORD' : 'THEORY / INDIRECT LINK';

  return (
    <aside className="details-panel incursion-dossier">
      <div className="dossier-heading">
        <div>
          <span className="eyebrow-label">SUBJECT DOSSIER</span>
          <span className="dossier-heading__id">
            {subject.apiAvailable ? `ARCHIVE FILE #${String(character.id).padStart(3, '0')}` : 'SUPPLEMENTAL DOSSIER'}
          </span>
        </div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Close subject dossier">
          <X size={17} />
        </button>
      </div>

      <div className="dossier-portrait">
        {portraitUrl && !imageFailed ? (
          <img
            src={portraitUrl}
            alt={character.name}
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="dossier-portrait__missing"><Fingerprint size={42} /></div>
        )}
        <span className="portrait-stamp">ARCHIVE<br />VERIFIED</span>
        <span className="portrait-corner portrait-corner--tl" />
        <span className="portrait-corner portrait-corner--br" />
      </div>

      <div className="dossier-name">
        <h2>{character.alias || character.name}</h2>
        <span>{character.name}{character.alias ? ` · ${character.alias}` : ''}</span>
      </div>

      <div className="dossier-meta">
        <div><span>FILE STATUS</span><b>{categoryLabel}</b></div>
        <div><span>UNIVERSE / BRANCH</span><b>{subject.location}</b></div>
      </div>

      {!subject.apiAvailable && (
        <div className="dossier-archive-note">
          <AlertTriangle size={13} />
          <span>No archive record found. This dossier was assembled from field intelligence.</span>
        </div>
      )}

      <section className="dossier-section">
        <h3><FileText size={14} /> {subject.heading}</h3>
        <p className="dossier-description">{subject.action}</p>
      </section>

      <section className="dossier-section dossier-section--evidence">
        <h3><span className={`evidence-mark evidence-mark--${subject.category}`} /> CASE ASSESSMENT</h3>
        <p className="dossier-description">{subject.rationale}</p>
      </section>
      <div className="panel-footnote"><span>END OF FILE</span><span>EARTH-616 // CLASSIFIED</span></div>
    </aside>
  );
}
