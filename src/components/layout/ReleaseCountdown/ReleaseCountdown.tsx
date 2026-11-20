import { useEffect, useMemo, useState } from 'react';
import idleAnimation from '@/assets/Idle-transparent.webp';
import { getViewerCountryCode, isTimeZoneForCountry } from '@/utils/viewerCountry';

interface ReleaseMarket {
  releaseDay: number;
  timeZone: string;
  previewDay?: number;
}

interface ZonedDateTime {
  year: number;
  month: number;
  day: number;
  hour: number;
}

const releaseMarkets: Record<string, ReleaseMarket> = {
  PH: { releaseDay: 16, timeZone: 'Asia/Manila' },
  GB: { releaseDay: 16, timeZone: 'Europe/London' },
  CN: { releaseDay: 16, timeZone: 'Asia/Shanghai' },
  KR: { releaseDay: 16, timeZone: 'Asia/Seoul' },
  HK: { releaseDay: 16, timeZone: 'Asia/Hong_Kong' },
  DE: { releaseDay: 16, timeZone: 'Europe/Berlin' },
  IT: { releaseDay: 16, timeZone: 'Europe/Rome' },
  SE: { releaseDay: 16, timeZone: 'Europe/Stockholm' },
  NO: { releaseDay: 16, timeZone: 'Europe/Oslo' },
  FI: { releaseDay: 16, timeZone: 'Europe/Helsinki' },
  BR: { releaseDay: 16, timeZone: 'America/Sao_Paulo' },
  CO: { releaseDay: 16, timeZone: 'America/Bogota' },
  AU: { releaseDay: 17, timeZone: 'Australia/Sydney' },
  IN: { releaseDay: 17, timeZone: 'Asia/Kolkata' },
  MX: { releaseDay: 17, timeZone: 'America/Mexico_City' },
  AR: { releaseDay: 17, timeZone: 'America/Argentina/Buenos_Aires' },
  IL: { releaseDay: 17, timeZone: 'Asia/Jerusalem' },
  HU: { releaseDay: 17, timeZone: 'Europe/Budapest' },
  KZ: { releaseDay: 17, timeZone: 'Asia/Almaty' },
  US: { releaseDay: 18, previewDay: 17, timeZone: 'America/New_York' },
  CA: { releaseDay: 18, previewDay: 17, timeZone: 'America/Toronto' },
  JP: { releaseDay: 18, timeZone: 'Asia/Tokyo' },
  RO: { releaseDay: 18, timeZone: 'Europe/Bucharest' },
  TR: { releaseDay: 18, timeZone: 'Europe/Istanbul' },
};

const fallbackMarket: ReleaseMarket = {
  releaseDay: 18,
  timeZone: 'UTC',
};

function resolveMarket(): { market: ReleaseMarket; timeZone: string } {
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const countryCode = getViewerCountryCode();
  const market = countryCode ? releaseMarkets[countryCode] : undefined;

  if (!countryCode || !market) {
    return {
      market: fallbackMarket,
      timeZone: browserTimeZone,
    };
  }

  const matchedTimeZone = isTimeZoneForCountry(browserTimeZone, countryCode);

  return {
    market,
    timeZone: matchedTimeZone ? browserTimeZone : market.timeZone,
  };
}

function getZonedDateTime({ year, month, day, hour }: ZonedDateTime, timeZone: string): Date {
  const targetAsUtc = Date.UTC(year, month - 1, day, hour);
  let timestamp = targetAsUtc;
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(timestamp)).map(({ type, value }) => [type, value]),
    );
    const localAsUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    const adjustment = targetAsUtc - localAsUtc;
    timestamp += adjustment;
    if (adjustment === 0) break;
  }

  return new Date(timestamp);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

interface ReleaseCountdownProps {
  showAnimation?: boolean;
}

export default function ReleaseCountdown({ showAnimation = false }: ReleaseCountdownProps) {
  const [{ market, timeZone }] = useState(resolveMarket);
  const [now, setNow] = useState(() => Date.now());
  const countdownTarget = useMemo(
    () => getZonedDateTime(
      {
        year: 2026,
        month: 12,
        day: market.previewDay ?? market.releaseDay,
        hour: market.previewDay ? 13 : 0,
      },
      timeZone,
    ),
    [market, timeZone],
  );
  const formattedTargetDate = useMemo(
    () => new Intl.DateTimeFormat('en-US', {
      timeZone,
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
    }).format(countdownTarget),
    [countdownTarget, timeZone],
  ).replace(/\//g, '.');
  const remainingSeconds = Math.max(0, Math.floor((countdownTarget.getTime() - now) / 1000));
  const doomsdayIsHere = remainingSeconds === 0;
  const displayedSeconds = doomsdayIsHere ? 0 : remainingSeconds;
  const days = Math.floor(displayedSeconds / 86_400);
  const hours = Math.floor((displayedSeconds % 86_400) / 3_600);
  const minutes = Math.floor((displayedSeconds % 3_600) / 60);
  const seconds = displayedSeconds % 60;

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div className="release-countdown">
      <h1 className="release-countdown__kicker">
        {doomsdayIsHere ? (
          <>DOOMSDAY IS <span className="release-countdown__here">HERE</span></>
        ) : (
          <>{formattedTargetDate}  &nbsp; IS   &nbsp; <span> DOOMSDAY</span></>
        )}
      </h1>
      {/* <button
        type="button"
        className="release-countdown__test-toggle"
        onClick={() => setTestReachedOverride((current) => !(current ?? remainingSeconds === 0))}
        aria-label={`Test countdown state: show ${doomsdayIsHere ? 'coming' : 'here'}`}
      >
        TEST: SWITCH TO {doomsdayIsHere ? 'COMING' : 'HERE'}
      </button> */}
      <div
        className="release-countdown__clock"
        role="timer"
        aria-live="off"
        aria-label={`${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds`}
      >
        <span className="release-countdown__unit"><b>{days}</b><small>DAYS</small></span>
        <span className="release-countdown__separator" aria-hidden="true">:</span>
        <span className="release-countdown__unit"><b>{pad(hours)}</b><small>HOURS</small></span>
        <span className="release-countdown__separator" aria-hidden="true">:</span>
        <span className="release-countdown__unit"><b>{pad(minutes)}</b><small>MINUTES</small></span>
        <span className="release-countdown__separator" aria-hidden="true">:</span>
        <span className="release-countdown__unit"><b>{pad(seconds)}</b><small>SECONDS</small></span>
      </div>
      {showAnimation && (
        <img
          className="release-countdown__animation"
          src={idleAnimation}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
      )}
    </div>
  );
}
