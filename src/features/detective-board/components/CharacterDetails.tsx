import { ArrowUpRight, FileText, Film, Fingerprint, X } from 'lucide-react';
import { getLocalCharacterImage } from '@/config/characterImages';
import type { ConnectionRelation } from '@/types/board.types';
import type { MCUCharacter, MCUMovie } from '@/types/mcu.types';

interface CharacterDetailsProps {
  character: MCUCharacter | null;
  credits: MCUMovie[];
  characters: MCUCharacter[];
  connections: ConnectionRelation[];
  onSelectCharacter: (characterId: number | null) => void;
}

export default function CharacterDetails({
  character,
  credits,
  characters,
  connections,
  onSelectCharacter,
}: CharacterDetailsProps) {
  if (!character) {
    return (
      <aside className="details-panel details-panel--empty">
        <div className="empty-dossier">
          <div className="empty-dossier__icon"><Fingerprint size={28} /></div>
          <span className="eyebrow-label">AWAITING SELECTION</span>
          <h2>Choose a person<br />of interest.</h2>
          <p>Select any photograph on the board to open their case file and trace their connections.</p>
          <div className="empty-dossier__hint"><span className="hint-thread" /> Shared appearances connect each file.</div>
        </div>
        <div className="panel-footnote">
          <span>FIELD NOTES</span>
          <p>Drag to rearrange. Scroll to move across the evidence wall.</p>
        </div>
      </aside>
    );
  }

  const related = connections
    .filter((connection) => connection.sourceId === character.id || connection.targetId === character.id)
    .map((connection) => {
      const relatedId = connection.sourceId === character.id ? connection.targetId : connection.sourceId;
      return {
        character: characters.find((candidate) => candidate.id === relatedId),
        sharedMovies: connection.sharedMovies,
      };
    })
    .filter((item): item is { character: MCUCharacter; sharedMovies: MCUMovie[] } => Boolean(item.character))
    .sort((a, b) => b.sharedMovies.length - a.sharedMovies.length);

  const portraitUrl = getLocalCharacterImage(
    character.name,
    character.alias,
    character.multiverse_designation || character.continuity,
  );

  return (
    <aside className="details-panel">
      <div className="dossier-heading">
        <div>
          <span className="eyebrow-label">SUBJECT DOSSIER</span>
          <span className="dossier-heading__id">FILE #{String(character.id).padStart(3, '0')}</span>
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={() => onSelectCharacter(null)}
          aria-label="Close subject dossier"
        >
          <X size={17} />
        </button>
      </div>

      <div className="dossier-portrait">
        {portraitUrl ? (
          <img src={portraitUrl} alt={character.name} />
        ) : (
          <div className="dossier-portrait__missing"><Fingerprint size={42} /></div>
        )}
        <span className="portrait-stamp">ARCHIVE<br />VERIFIED</span>
        <span className="portrait-corner portrait-corner--tl" />
        <span className="portrait-corner portrait-corner--br" />
      </div>

      <div className="dossier-name">
        <h2>{character.name}</h2>
        <span>{character.alias || 'Alias unconfirmed'}</span>
      </div>

      <div className="dossier-meta">
        <div><span>PORTRAYED BY</span><b>{character.played_by || 'Unknown'}</b></div>
        <div><span>CONTINUITY</span><b>{character.multiverse_designation || character.continuity || 'Unknown'}</b></div>
      </div>

      <section className="dossier-section">
        <h3><FileText size={14} /> FIELD REPORT</h3>
        <p className="dossier-description">{character.description || 'No intelligence report is available for this subject.'}</p>
      </section>

      <section className="dossier-section dossier-section--credits">
        <h3><Film size={14} /> APPEARANCES <span>{credits.length}</span></h3>
        {credits.length > 0 ? (
          <ul className="credit-list">
            {credits.slice(0, 6).map((movie) => (
              <li key={movie.id}>
                <span>{movie.title}</span>
                <time>{movie.release_date?.slice(0, 4) || '—'}</time>
              </li>
            ))}
            {credits.length > 6 && <li className="credit-list__more">+ {credits.length - 6} more titles</li>}
          </ul>
        ) : (
          <p className="muted-copy">No movie records found.</p>
        )}
      </section>

      <section className="dossier-section dossier-section--connections">
        <h3><span className="connection-mark" /> KNOWN CONNECTIONS <span>{related.length}</span></h3>
        {related.length > 0 ? (
          <ul className="connection-list">
            {related.slice(0, 5).map(({ character: relatedCharacter, sharedMovies }) => (
              <li key={relatedCharacter.id}>
                <button type="button" onClick={() => onSelectCharacter(relatedCharacter.id)}>
                  <span className="connection-list__name">{relatedCharacter.alias || relatedCharacter.name}</span>
                  <span className="connection-list__evidence">
                    {sharedMovies.length
                      ? sharedMovies.length === 1
                        ? sharedMovies[0].title
                        : `${sharedMovies.length} shared appearances`
                      : 'Variant identity'}
                  </span>
                  <ArrowUpRight size={13} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-copy">No direct links in current records.</p>
        )}
      </section>
      <div className="panel-footnote"><span>END OF FILE</span><span>EARTH-616 // CLASSIFIED</span></div>
    </aside>
  );
}
