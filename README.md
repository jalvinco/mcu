# TVA Case File

A React single-page MCU incursion investigation board. The default view connects selected character files with solid on-screen evidence and dashed indirect theories. Select a subject to read the case note and evidence assessment. The multiverse chronology remains available from the page navigation and uses the MCU API's `/timeline` endpoint.

Character records and the timeline come from the public [MCU API](https://github.com/augustomarcelo/mcuapi). Case assessments are curated in the app; they distinguish events shown on-screen from theories and do not claim that every event caused an Incursion. Dar-Benn is not in the API, so her file is marked as a local case note.

The timeline view is code-split and loaded only when selected. API requests share in-flight responses and cache successful results locally; the character directory requests only the fields used by the board. The visual background is resized and compressed for page loading while the original source image is retained.

The case board uses a compressed, repeating cork tile generated from `src/assets/images/cork.jpg`, yellow notes, and red pins. The tile is about 20 KB, and cards outside the viewport show a pan hint.

The workspace heading includes a live Doomsday countdown that selects a listed release market from the viewer's time zone, with browser locale as a fallback. US and Canadian viewers see a countdown to Thursday preview screenings.

## Getting started

```sh
npm install
npm run dev
```

The app uses `https://mcuapi.up.railway.app/api/v1` by default. To use another compatible API, set `VITE_MCU_API_URL` in a local `.env` file:

```env
VITE_MCU_API_URL=https://mcuapi.up.railway.app/api/v1
```

## Checks

```sh
npm run lint
npm run build
```

## Project layout

- `src/components/` — shared layout and UI components
- `src/features/detective-board/` — incursion case board, subject dossiers, and timeline details
- `src/pages/` — page-level views
- `src/services/` — API client, character directory, and timeline data
- `src/types/` — API and UI types
- `src/styles/` — global and app styles
