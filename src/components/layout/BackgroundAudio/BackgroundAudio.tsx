import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import clockSound from '@/assets/clock.mp3';

type PlaybackStatus = 'starting' | 'playing' | 'paused' | 'blocked' | 'error';

export default function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMountedRef = useRef(false);
  const removeGestureListenersRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>('starting');
  const [isMuted, setIsMuted] = useState(false);

  const attemptPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      if (!isMountedRef.current) return;
      setStatus('playing');
      removeGestureListenersRef.current?.();
      removeGestureListenersRef.current = null;
    } catch (error) {
      if (!isMountedRef.current) return;
      if (error instanceof DOMException && error.name === 'AbortError') return;
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setStatus('blocked');
        return;
      }

      console.error('Unable to play the ambient clock sound.', error);
      setStatus('error');
      removeGestureListenersRef.current?.();
      removeGestureListenersRef.current = null;
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    isMountedRef.current = true;
    audio.volume = 0.45;

    const retryOnGesture = () => {
      void attemptPlayback();
    };
    document.addEventListener('pointerdown', retryOnGesture);
    document.addEventListener('keydown', retryOnGesture);
    removeGestureListenersRef.current = () => {
      document.removeEventListener('pointerdown', retryOnGesture);
      document.removeEventListener('keydown', retryOnGesture);
    };

    void attemptPlayback();

    return () => {
      isMountedRef.current = false;
      removeGestureListenersRef.current?.();
      removeGestureListenersRef.current = null;
      audio.pause();
    };
  }, [attemptPlayback]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void attemptPlayback();
    } else {
      audio.pause();
      setStatus('paused');
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const muted = !audio.muted;
    audio.muted = muted;
    setIsMuted(muted);
  };

  const isPlaying = status === 'playing';
  const muteLabel = isMuted ? 'Unmute clock sound' : 'Mute clock sound';
  const label = isPlaying
    ? 'Pause clock sound'
    : status === 'blocked'
      ? 'Enable clock sound'
      : status === 'error'
        ? 'Retry clock sound'
        : 'Play clock sound';

  return (
    <div className="ambient-audio">
      <audio ref={audioRef} className="ambient-audio__element" src={clockSound} autoPlay loop preload="auto" />
      <button
        type="button"
        className="ambient-audio__button"
        onClick={togglePlayback}
        aria-label={label}
        aria-pressed={isPlaying}
        title={label}
      >
        {isPlaying ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
        <span className="ambient-audio__label">
          {isPlaying ? 'CLOCK SOUND ON' : status === 'blocked' ? 'ENABLE CLOCK SOUND' : 'CLOCK SOUND OFF'}
        </span>
      </button>
      <button
        type="button"
        className="ambient-audio__mute-button"
        onClick={toggleMute}
        aria-label={muteLabel}
        aria-pressed={isMuted}
        title={muteLabel}
      >
        {isMuted ? <VolumeX size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
      </button>
    </div>
  );
}
