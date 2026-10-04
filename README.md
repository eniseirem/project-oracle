# PROJECT ORACLE — MVP

A mobile-first web app for running a live murder-mystery birthday party. Dark,
techno-noir, "secret behavioral experiment" vibe. Built with Next.js 14 (App
Router) + TypeScript + Tailwind CSS, no external database — everything runs
from one Node.js process so it's easy to run from a laptop at the bar.

This is explicitly an **MVP with placeholder story content**, built to test
the UX and the Game Master controls before the real murder mystery is
written. Nothing here is the final solution.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000, auto-reloads on change
```

For the actual party, run a production build instead (faster, more stable):

```bash
npm run build
npm run start -- -p 3000
```

Then on the host's laptop/phone, open:

- `http://<host-device-ip>:3000/` — landing screen
- `/host` — Game Master dashboard (access code below)
- `/display` — put this on a TV/projector if you have one

Guests on the same wifi open `http://<host-device-ip>:3000/join` on their own
phones. If you don't have a domain, tools like `ngrok` or `cloudflared` can
tunnel port 3000 to a public URL for the night without any deployment.

### Game Master access code

Default is `ORACLE-GM-1`. Change it by setting an environment variable
before starting the server:

```bash
ORACLE_HOST_CODE="whatever-you-want" npm run start
```

## How state works (read this before the party)

There is no database. Game state (players, phase, evidence, messages, votes)
lives in memory in the Node.js process, and is also mirrored to
`.data/state.json` on disk as a safety net if the server restarts mid-party.

This means:

- **One server process must stay running for the whole party.** If you
  deploy to a serverless platform (Vercel, etc.) rather than a normal
  always-on Node process, state will NOT persist reliably between requests —
  serverless functions don't share memory and typically can't write to disk.
  For the party, run this from a laptop, a small VPS, or any host that runs
  `npm start` as one continuous process (Railway, Render, Fly.io, a spare
  laptop on the bar's wifi, etc.).
- All phones poll the server every few seconds (not websockets) — simple,
  robust on bad bar wifi, no special infrastructure needed.
- To wipe and restart the game from scratch, stop the server, delete the
  `.data/` folder, and start it again.

## Replacing the placeholder story

Everything story-specific lives under `lib/data/` and nowhere else:

- `lib/data/characters.ts` — currently 6 placeholders (3 CORE, 2 EXTENDED, 1
  OPTIONAL). Replace with the real 12 CORE + 8 EXTENDED + 10 OPTIONAL cast,
  keeping the `Character` shape from `lib/types.ts`. Character assignment
  (`lib/characterAssignment.ts`) hands out CORE characters first in array
  order, then EXTENDED, then OPTIONAL — so once the real 30 are in place, the
  12 → 13-20 → 21-30 scaling in the brief happens automatically, with no
  other code changes.
- `lib/data/evidence.ts` — the 5 placeholder evidence items. Add more freely;
  the Game Master dashboard's evidence panel and the `/evidence` page both
  just map over whatever is in this array.
- `lib/data/oracleMessages.ts` — the 8 placeholder ORACLE messages. These are
  seed data only; the Game Master can send unlimited new ones live from
  `/host` during the party.
- `lib/data/factions.ts` — the two placeholder factions used for FACTION-type
  messages and relationship grouping.
- `lib/data/presets.ts` — the six quick-send message presets shown as
  buttons in the message composer.
- `lib/data/phases.ts` — the 11 fixed phases (0–10). This one is structural
  and shouldn't need to change.

None of the real killer, mastermind, or final timeline is written anywhere
in this codebase yet — that's intentional for this MVP.

## What's implemented

- **Player routes**: `/`, `/join`, `/game`, `/character`, `/objectives`,
  `/people`, `/evidence`, `/oracle`, `/vote` — all mobile-first, dark,
  short pages with expandable sections, "NEW" badges on evidence/ORACLE,
  and a fullscreen takeover for major ORACLE alerts (the murder, etc).
- **`/host`** — the Game Master dashboard: phase control with confirmation,
  live player roster with per-player actions (view character, private
  message, reassign, mark absent), a message composer with recipient
  targeting (everyone / one player / a faction) and 6 presets, full evidence
  control (release / send to a specific player / lock), the 6 story-trigger
  buttons, and an Emergency section (pause, skip phase, unlock phase content,
  move a clue between players, remove an absent player, reopen voting).
  Gated by the access code above.
- **`/display`** — public TV/projector view. Shows the current phase
  normally, and the same fullscreen alert as players get during major
  events. Never shows anything private.
- Character tier-based auto-assignment (CORE → EXTENDED → OPTIONAL, in join
  order), scaling to any headcount from 12 to 30 once the real cast is in.
- Phase-gated content: character "classified" reveals, relationships, and
  evidence all unlock automatically as the Game Master advances
  `currentPhase` — nothing needs to be manually unlocked per item unless you
  want to override it (which the evidence LOCK/RELEASE buttons and the
  "unlock current phase content" emergency action let you do).
- A full voting flow: players pick a killer + optional reason + who they
  think controls ORACLE, can change their answer freely, until the Game
  Master locks voting from `/host`.

## What's intentionally NOT here yet

- The real 30-character cast, the real clue/evidence set, the real timeline,
  and the actual killer/mastermind/victim-of-record. All placeholder.
- Any kind of accounts/login beyond the single shared GM access code.
- A real database — see the state section above before deploying anywhere
  that isn't one continuous server process.
