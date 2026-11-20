import { memo, useState } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { getLocalCharacterImage } from '@/config/characterImages';
import type { BoardNodeData } from '@/types/board.types';

export type CharacterFlowNode = Node<BoardNodeData, 'character'>;

function CharacterCardNode({ data, selected }: NodeProps<CharacterFlowNode>) {
  const [imageFailed, setImageFailed] = useState(false);
  const { character, movieCount, caseSubject } = data;
  const initials = character.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  const portraitUrl = getLocalCharacterImage(character.name, character.alias, caseSubject.location);

  return (
    <article className={`character-card${selected ? ' character-card--selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="character-card__handle" />
      <span className="character-card__pin" aria-hidden="true" />
      <div className="character-card__portrait">
        {portraitUrl && !imageFailed ? (
          <img
            src={portraitUrl}
            alt={character.name}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>
      <div className="character-card__copy">
        <span className={`character-card__eyebrow character-card__eyebrow--${caseSubject.category}`}>
          {caseSubject.category === 'confirmed' ? 'ON-SCREEN EVENT' : 'THEORY / INDIRECT'}
        </span>
        <strong className="character-card__name">{character.alias || character.name}</strong>
        <span className="character-card__alias">{caseSubject.location}</span>
        <span className="character-card__credits">
          <span aria-hidden="true">●</span> {movieCount} {movieCount === 1 ? 'LINK' : 'LINKS'}
        </span>
      </div>
      <Handle type="source" position={Position.Right} className="character-card__handle" />
    </article>
  );
}

export default memo(CharacterCardNode);
