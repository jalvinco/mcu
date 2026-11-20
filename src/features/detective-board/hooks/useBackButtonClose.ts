import { useCallback, useEffect, useRef } from 'react';

export default function useBackButtonClose(isOpen: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  const hasHistoryEntry = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    window.history.pushState(window.history.state, '');
    hasHistoryEntry.current = true;

    const handlePopState = () => {
      if (!hasHistoryEntry.current) return;
      hasHistoryEntry.current = false;
      onCloseRef.current();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (hasHistoryEntry.current) {
        hasHistoryEntry.current = false;
        window.history.back();
      }
    };
  }, [isOpen]);

  return useCallback(() => {
    if (hasHistoryEntry.current) {
      window.history.back();
      return;
    }

    onCloseRef.current();
  }, []);
}
