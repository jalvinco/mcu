import { useCallback, useEffect, useState } from 'react';
import { api } from '@/services/api';
import {
  getTimeline,
  getTimelineTitleDetails,
  type TimelineTitleDetails,
} from '@/services/mcuService';
import type { MCUTimelineEntry, MCUTimelineGroup } from '@/types/mcu.types';

interface DetailState {
  key: string;
  data?: TimelineTitleDetails;
  error?: string;
}

function getEntryKey(entry: MCUTimelineEntry): string {
  return `${entry.type}:${entry.id}`;
}

export function useTimelineData() {
  const [groups, setGroups] = useState<MCUTimelineGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadId, setReloadId] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<MCUTimelineEntry | null>(null);
  const [detailState, setDetailState] = useState<DetailState | null>(null);

  const reload = useCallback(() => {
    api.clearCache();
    setSelectedEntry(null);
    setIsLoading(true);
    setError(null);
    setReloadId((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;
    getTimeline()
      .then((result) => {
        if (active) setGroups(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Unable to access the temporal archive.');
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadId]);

  useEffect(() => {
    if (!selectedEntry) return undefined;
    let active = true;
    const key = getEntryKey(selectedEntry);

    getTimelineTitleDetails(selectedEntry)
      .then((data) => {
        if (active) setDetailState({ key, data });
      })
      .catch((cause: unknown) => {
        if (active) {
          setDetailState({
            key,
            error:
              cause instanceof Error ? cause.message : `Unable to load ${selectedEntry.title}.`,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [selectedEntry]);

  const selectedKey = selectedEntry ? getEntryKey(selectedEntry) : null;
  const selectedDetail =
    selectedKey && detailState?.key === selectedKey ? detailState : null;

  return {
    groups,
    isLoading,
    error,
    reload,
    selectedEntry,
    setSelectedEntry,
    selectedDetails: selectedDetail?.data ?? null,
    isDetailLoading: Boolean(selectedEntry && !selectedDetail),
    detailError: selectedDetail?.error ?? null,
  };
}
