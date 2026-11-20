import { useCallback, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { getCharacters } from '@/services/mcuService';
import type { MCUCharacter } from '@/types/mcu.types';
import type { IncursionCaseSubject } from '@/types/board.types';
import { incursionCaseDefinitions } from '../data/incursionCases';

function createLocalDarBenn(): MCUCharacter {
  return {
    id: -1,
    name: 'Dar-Benn',
    alias: 'Accuser',
    description: 'Kree Accuser who wielded the Quantum Bands.',
    image_url: null,
    played_by: 'Zawe Ashton',
    continuity: 'MCU',
    multiverse_designation: 'Kree',
    variant_of: null,
    first_appearance_movie_id: null,
    first_appearance_tvshow_id: null,
  };
}

export function useIncursionBoard() {
  const [subjects, setSubjects] = useState<IncursionCaseSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadId, setReloadId] = useState(0);

  const reload = useCallback(() => {
    api.clearCache();
    setIsLoading(true);
    setError(null);
    setReloadId((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;

    getCharacters()
      .then((characters) => {
        const byId = new Map(characters.map((character) => [character.id, character]));
        const nextSubjects = incursionCaseDefinitions.map((definition) => {
          const character =
            definition.characterId === -1
              ? createLocalDarBenn()
              : byId.get(definition.characterId);
          if (!character) {
            throw new Error(`The temporal archive has no record for subject ${definition.characterId}.`);
          }
          return {
            ...definition,
            apiAvailable: definition.apiAvailable !== false,
            character,
          };
        });
        if (active) setSubjects(nextSubjects);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Unable to load the case files.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadId]);

  return { subjects, isLoading, error, reload };
}
