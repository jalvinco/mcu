import { useEffect, useMemo, useRef, useState } from 'react';
import characters from '@/store/characters.json';
import Header from '@/components/layout/Header/Header';
import ReleaseCountdown from '@/components/layout/ReleaseCountdown/ReleaseCountdown';
import ViewNavigation, { type AppView } from '@/components/layout/ViewNavigation/ViewNavigation';
import { getLocalCharacterImage } from '@/config/characterImages';

interface DoomsdayCharactersViewProps {
  onViewChange: (view: AppView) => void;
}

const cardBatchSize = 12;

export default function DoomsdayCharactersView({ onViewChange }: DoomsdayCharactersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(cardBatchSize);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const portraitCount = characters.filter((character) => getLocalCharacterImage(character.name)).length;
  const visibleCharacters = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    return characters.filter((character) =>
      !query
      || character.name.toLocaleLowerCase().includes(query)
      || character.description.toLocaleLowerCase().includes(query),
    );
  }, [searchQuery]);
  const loadedCharacters = visibleCharacters.slice(0, visibleCount);
  const hasMoreCharacters = loadedCharacters.length < visibleCharacters.length;

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMoreCharacters) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) => Math.min(current + cardBatchSize, visibleCharacters.length));
        }
      },
      { rootMargin: '500px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMoreCharacters, visibleCharacters.length, visibleCount]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(cardBatchSize);
  };

  return (
    <>
      <Header
        view="characters"
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        titleCount={characters.length}
        timelineCount={portraitCount}
        isLoading={false}
      />
      <ViewNavigation activeView="doomsday" onViewChange={onViewChange} />

      <main className="case-workspace">
        <div className="workspace-heading">
          <div className="workspace-title">
            <span className="eyebrow-label countdown-quote">All of you have lived stolen lives, but now you must give them back</span>
            <ReleaseCountdown showAnimation />
          </div>
          <div className="workspace-note">
            <span className="note-pin" />
            <p>Every name is a thread in the coming crisis.<br />Read the files before the timelines collide.</p>
            <span className="note-signature">— TVA TEMPORAL ARCHIVES</span>
          </div>
        </div>

        <div className="board-toolbar doomsday-roster-toolbar">
          <div className="board-toolbar__label">
            <span className="timeline-toolbar__marker" aria-hidden="true" />
            <span>DOOMSDAY CHARACTER FILES</span>
          </div>
          <div className="filter-results">
            <b>{loadedCharacters.length}</b> OF {visibleCharacters.length} FILES LOADED
          </div>
        </div>

        {visibleCharacters.length ? (
          <>
            <section className="doomsday-character-grid" aria-label="Doomsday characters">
              {loadedCharacters.map((character, index) => {
                const portraitUrl = getLocalCharacterImage(character.name);

                return (
                  <article
                    className="doomsday-character-card doomsday-character-card--materializing"
                    key={character.name}
                    style={{ animationDelay: `${(index % cardBatchSize) * 45}ms` }}
                  >
                    <div className="doomsday-character-card__portrait">
                      {portraitUrl ? (
                        <img src={portraitUrl} alt={character.name} loading="lazy" decoding="async" />
                      ) : (
                        <div className="doomsday-character-card__placeholder" aria-hidden="true">
                          {character.name.slice(0, 1)}
                        </div>
                      )}
                      <span className="doomsday-character-card__file-number">
                        FILE {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="doomsday-character-card__content">
                      <h2>{character.name}</h2>
                      <p>{character.description}</p>
                    </div>
                  </article>
                );
              })}
            </section>
            {hasMoreCharacters && (
              <div className="doomsday-load-more" ref={loadMoreRef}>
                <button
                  type="button"
                  onClick={() => setVisibleCount((current) => Math.min(current + cardBatchSize, visibleCharacters.length))}
                >
                  LOAD NEXT FILES
                </button>
                <span>SCROLL TO REVEAL MORE</span>
              </div>
            )}
          </>
        ) : (
          <div className="board-empty doomsday-roster-empty">
            <span className="board-empty__stamp">NO MATCHING FILES</span>
            <p>Try another name or detail from the roster.</p>
          </div>
        )}
      </main>
    </>
  );
}
