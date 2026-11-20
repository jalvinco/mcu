import { useEffect, useMemo, useState } from 'react';
import idleAnimation from '@/assets/Idle-transparent.webp';

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

const exactTimeZoneMarkets: Record<string, string> = {
  'Asia/Manila': 'PH',
  'Europe/London': 'GB',
  'Asia/Shanghai': 'CN',
  'Asia/Urumqi': 'CN',
  'Asia/Kashgar': 'CN',
  'Asia/Seoul': 'KR',
  'Asia/Hong_Kong': 'HK',
  'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Helsinki': 'FI',
  'America/Sao_Paulo': 'BR',
  'America/Bogota': 'CO',
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'America/Mexico_City': 'MX',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Buenos_Aires': 'AR',
  'Asia/Jerusalem': 'IL',
  'Europe/Budapest': 'HU',
  'Asia/Almaty': 'KZ',
  'Asia/Aqtau': 'KZ',
  'Asia/Aqtobe': 'KZ',
  'Asia/Atyrau': 'KZ',
  'Asia/Oral': 'KZ',
  'Asia/Qostanay': 'KZ',
  'Asia/Qyzylorda': 'KZ',
  'America/New_York': 'US',
  'America/Detroit': 'US',
  'America/Indiana/Indianapolis': 'US',
  'America/Indiana/Knox': 'US',
  'America/Indiana/Marengo': 'US',
  'America/Indiana/Petersburg': 'US',
  'America/Indiana/Tell_City': 'US',
  'America/Indiana/Vevay': 'US',
  'America/Indiana/Vincennes': 'US',
  'America/Indiana/Winamac': 'US',
  'America/Indianapolis': 'US',
  'America/Knox_IN': 'US',
  'America/Kentucky/Louisville': 'US',
  'America/Kentucky/Monticello': 'US',
  'America/Louisville': 'US',
  'America/Monticello': 'US',
  'America/Chicago': 'US',
  'America/Menominee': 'US',
  'America/Denver': 'US',
  'America/Boise': 'US',
  'America/Phoenix': 'US',
  'America/Los_Angeles': 'US',
  'America/Anchorage': 'US',
  'America/Juneau': 'US',
  'America/Sitka': 'US',
  'America/Metlakatla': 'US',
  'America/Nome': 'US',
  'America/Adak': 'US',
  'Pacific/Honolulu': 'US',
  'Pacific/Guam': 'US',
  'Pacific/Saipan': 'US',
  'America/Puerto_Rico': 'US',
  'America/St_Thomas': 'US',
  'America/Montreal': 'CA',
  'America/St_Johns': 'CA',
  'America/Halifax': 'CA',
  'America/Glace_Bay': 'CA',
  'America/Moncton': 'CA',
  'America/Goose_Bay': 'CA',
  'America/Toronto': 'CA',
  'America/Thunder_Bay': 'CA',
  'America/Nipigon': 'CA',
  'America/Pangnirtung': 'CA',
  'America/Coral_Harbour': 'CA',
  'America/Rainy_River': 'CA',
  'America/Winnipeg': 'CA',
  'America/Regina': 'CA',
  'America/Swift_Current': 'CA',
  'America/Edmonton': 'CA',
  'America/Cambridge_Bay': 'CA',
  'America/Yellowknife': 'CA',
  'America/Inuvik': 'CA',
  'America/Dawson_Creek': 'CA',
  'America/Fort_Nelson': 'CA',
  'America/Whitehorse': 'CA',
  'America/Dawson': 'CA',
  'America/Vancouver': 'CA',
  'America/Atikokan': 'CA',
  'America/Rankin_Inlet': 'CA',
  'America/Resolute': 'CA',
  'America/Blanc-Sablon': 'CA',
  'America/Creston': 'CA',
  'Asia/Tokyo': 'JP',
  'Europe/Bucharest': 'RO',
  'Europe/Istanbul': 'TR',
};

const timeZonePrefixes: Array<[string, string]> = [
  ['Australia/', 'AU'],
  ['America/Argentina/', 'AR'],
  ['America/Indiana/', 'US'],
  ['America/Kentucky/', 'US'],
  ['America/North_Dakota/', 'US'],
  ['US/', 'US'],
  ['Canada/', 'CA'],
  ['Mexico/', 'MX'],
  ['America/Cancun', 'MX'],
  ['America/Matamoros', 'MX'],
  ['America/Mazatlan', 'MX'],
  ['America/Merida', 'MX'],
  ['America/Monterrey', 'MX'],
  ['America/Ojinaga', 'MX'],
  ['America/Tijuana', 'MX'],
  ['America/Chihuahua', 'MX'],
  ['America/Bahia_Banderas', 'MX'],
  ['America/Hermosillo', 'MX'],
  ['America/Belem', 'BR'],
  ['America/Fortaleza', 'BR'],
  ['America/Recife', 'BR'],
  ['America/Bahia', 'BR'],
  ['America/Manaus', 'BR'],
  ['America/Porto_Velho', 'BR'],
  ['America/Boa_Vista', 'BR'],
  ['America/Cuiaba', 'BR'],
  ['America/Campo_Grande', 'BR'],
  ['America/Rio_Branco', 'BR'],
  ['America/Eirunepe', 'BR'],
  ['America/Jacareacanga', 'BR'],
  ['America/Porto_Acre', 'BR'],
  ['America/Noronha', 'BR'],
  ['America/Maceio', 'BR'],
  ['America/Araguaina', 'BR'],
  ['America/Santarem', 'BR'],
];

const fallbackMarket: ReleaseMarket = {
  releaseDay: 18,
  timeZone: 'UTC',
};

function countryFromLocale(): string | undefined {
  const locales = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const locale of locales) {
    const region = locale
      .split('-')
      .slice(1)
      .find((part) => /^[A-Za-z]{2}$/.test(part))
      ?.toUpperCase();
    if (region && releaseMarkets[region]) return region;
  }
}

function resolveMarket(): { market: ReleaseMarket; timeZone: string } {
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const countryCode = exactTimeZoneMarkets[browserTimeZone]
    ?? timeZonePrefixes.find(([prefix]) => browserTimeZone.startsWith(prefix))?.[1]
    ?? countryFromLocale();

  if (!countryCode) {
    return {
      market: fallbackMarket,
      timeZone: browserTimeZone,
    };
  }

  const market = releaseMarkets[countryCode];
  const matchedTimeZone = exactTimeZoneMarkets[browserTimeZone] === countryCode
    || timeZonePrefixes.some(([prefix, code]) => code === countryCode && browserTimeZone.startsWith(prefix));

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
  const [testReachedOverride, setTestReachedOverride] = useState<boolean | null>(null);
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
  const doomsdayIsHere = testReachedOverride ?? remainingSeconds === 0;
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
