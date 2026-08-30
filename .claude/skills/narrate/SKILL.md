---
name: narrate
description: >-
  Turn a research article on adib.ihsan.build into a chapter-delineated audio
  narration (Gemini 3.1 Flash TTS, voice "Charon") and deploy it with a
  scrubbable player. Use when the user wants to add a "listen to this piece"
  option to a research page, narrate an article, generate audio for a piece, or
  regenerate narration after editing an article. Runs extraction and generation
  straight through, then STOPS on localhost for sign-off before the public deploy.
---

# Narrate a research piece

Converts one of the research articles under `src/pages/research/*.jsx` into a
spoken-audio version and ships it with the `ListenBar` player: play/pause, a
scrubbable bar with per-chapter ticks, ±15s skip, a playback-speed menu
(0.7×–1.5× in 0.1 steps, persisted to localStorage — 0.5× and 2× proved
impractical to actually listen at), a bar that docks to the bottom on scroll,
and iOS lock-screen controls.

## The one idea that makes this cheap and robust

The prose is static, so **the audio is pre-generated offline and committed as a
plain MP3.** There is no TTS call at runtime — no API keys in the browser or in
Vercel, no per-listen cost, and real HTTP range-request seeking on iOS. The TTS
provider is therefore a *build-time* concern only. That is what makes the whole
thing swappable and safe to ship.

## Before you start

- **A registered piece.** The article must exist as a research page with an entry
  in `src/data/research.js` (it has a `slug` and a `component: lazy(() => import(...))`).
  The extractor reads the component path and title from that registry.
- **A Gemini API key** in `.env.local` as `GEMINI_API_KEY`. Get one at
  https://aistudio.google.com/apikey. The key starts with `AQ.` or `AIza`.
  **The Google AI Pro subscription does not, by itself, change the key's tier.**
  A key inherits its project's billing tier, and a free-tier project is capped at
  **10 TTS requests per day** — a 10-chapter piece (each long chapter is two
  requests) will not finish in one day. Since January 2026, AI Pro *does* include
  ~$10/month of Google Cloud credit that can pay for Gemini API usage, but it only
  applies once the key's project has Cloud Billing enabled (AI Studio → project →
  "Set up billing", prepay minimum $10) and the credit is activated from the
  subscription page; it is not automatic. Do that once and the wrapper finishes a
  full piece in a single sitting for well under a dollar.
- **ffmpeg** on PATH (`brew install ffmpeg`). Used for normalise/concat/probe.
- Keys live only in `.env.local` (gitignored). Never commit them, never add them
  to Vercel.

## Defaults (what the user settled on)

- Provider **gemini**, model **gemini-3.1-flash-tts-preview**, voice **Charon**.
  These are the adapter defaults in `scripts/tts/providers/gemini.mjs`.
- Chosen by ear in a blind A/B against ElevenLabs and Gemini 2.5. To try another
  voice: `--voice <Name>` (Gemini has ~30). To try another model:
  `GEMINI_TTS_MODEL=<id> node ...`. **Switching voice re-synthesizes all chunks**
  (the cache is keyed on voice+model), so only switch deliberately.

---

## Workflow

Autonomy: **run steps 1–4 straight through; STOP at step 5** (localhost review)
and wait for the user before the public deploy in step 6.

### 1. Configure extraction for this piece

Each research page is bespoke — different prose components, different hero markup.
Open the target `src/pages/research/<Component>.jsx` and check:

- **Which components carry prose?** The default set is `["P","Quote","Ed","Lead"]`.
  Some pages add `Epigraph`, `PullQuote`, `StatBand`, etc. Include the ones a
  narrator should read; **exclude** decorative/duplicative ones (a `PullQuote` is
  usually a repeat of body text — narrating it double-reads).
- **What marks a chapter?** Default is `<H2 num="00">…`. Confirm the tag and that
  the number lives in a `num` attribute. **Watch for the number baked into the
  visible title** (e.g. `<H2>00 — The Slow Burn</H2>` speaks as "Chapter Zero.
  Zero dash…"). If so, the page needs a title cleanup or a config note.
- **The standfirst / dek** — the italic intro line under the headline. Copy its
  exact text; it becomes the spoken intro.

If anything differs from the defaults, write `src/data/audio/<slug>.narrate.json`:

```json
{
  "dek": "The standfirst sentence, verbatim.",
  "narratable": ["P", "Quote", "Ed", "Lead"],
  "chapterTag": "H2",
  "quoteTags": ["Quote"]
}
```

All fields are optional; omit what matches the defaults. `componentFile` and
`title` are read from the registry but can be overridden here.

### 2. Extract and eyeball the script

```bash
node scripts/tts/extract-script.mjs --slug <slug>
node scripts/tts/preview-script.mjs <slug>   # prints exactly what will be spoken
```

Read the preview. Confirm: no leaked markup or citation numbers, chapter headings
read cleanly ("Chapter Zero. …"), quotes get a sensible spoken attribution
(`"{author}, {role}: …"`), and there are no tokens that will mispronounce
(unusual entities throw by design; odd acronyms/initialisms are the thing to
catch by eye). The committed `<slug>.script.json` is the source of truth the
audio must match.

### 3. Generate the full narration

```bash
scripts/tts/generate-until-done.sh <slug>
```

This wraps `generate.mjs --full` in a retry loop. Two things make it survive
Gemini's flaky free tier:

- **Per-chunk content-hash cache** (`.tts-cache/`) — a retry only redoes missing
  chunks, never re-bills a good one.
- **Plausibility guard** — a chunk whose speaking rate falls outside 6–40 chars/s
  is rejected and re-synthesized (Gemini's preview TTS occasionally loops, once
  emitting 655s of audio for a 1,182-char chunk).
- **Long-chapter sub-chunking** — any chapter over `MAX_SYNTH_CHARS` (3,000) is
  split at paragraph breaks, each piece synthesized separately and stitched back
  with a short pause. Gemini *rushes* long single outputs: before this, a
  4,784-char final chapter read ~17% faster than the rest (and accelerated toward
  its end). Keeping every synthesis call short holds the pace steady. **The goal
  is a consistent chars/s and wpm rate through the whole piece.**

**Free-tier reality:** the daily request quota is small (≈10/day on 2.5 Flash TTS;
higher but still capped on 3.1). A 14-chunk piece may not fit one window, so the
wrapper waits and resumes; the guaranteed backstop is the **midnight-Pacific
reset**. To finish in one sitting, enable billing on the key's project (~$0.40 for a
~22k-char piece; the AI Pro monthly Cloud credit covers it once activated) — then
the wrapper completes on the first attempt.

Chunks are synthesized **four at a time** (`TTS_CONCURRENCY`, default 4). Synthesis
runs at roughly 2x realtime and is spent almost entirely waiting on the provider, so
a pool turns a ~22-minute run into ~6-8. Chapters are written to indexed slots and
stitched in input order, never completion order. Lower the value if the provider
starts returning 429s faster than its backoff clears them; set it to 1 for the old
serial behaviour.

Run it in the background and watch the log at `/tmp/narrate-<slug>.log`.

### 4. Verify

```bash
node scripts/tts/extract-script.mjs --slug <slug> --check   # audio == page prose
node scripts/tts/rate-check.mjs <slug>                       # pace is even across chapters
```

`rate-check` reports each chapter's chars/s and wpm against the median and flags
any chapter more than ~12% off. A **FAST** flag almost always means an over-long
chunk Gemini rushed — lower `MAX_SYNTH_CHARS` in `generate.mjs` so it sub-chunks,
delete that chapter's cached `.wav`, and regenerate (only that chapter re-bills).
Don't ship until every chapter is in-band — an even pace is a hard requirement.

Then confirm from `src/data/audio/<slug>.json`: chapters are contiguous, the last
chapter ends at the file duration, and the file seeks near the end
(`ffmpeg -v error -ss <near-end> -i public/audio/<slug>.mp3 -t 5 -f null -`).
The generator already asserts offsets sum to the real duration.

### 5. Wire the player — then STOP for review

Edit `src/pages/research/<Component>.jsx`, following how Bond does it
(`BondBroccoli.jsx` is the reference):

- Import: `ListenBar` from `../../components/ListenBar` and the manifest from
  `../../data/audio/<slug>.json`.
- Add a `useRef` for the audio controls; pass it to `<NavBar audio={ref}>` so
  tapping a chapter seeks the audio while it plays.
- Insert `<ListenBar manifest={...} palette={C} controlsRef={ref} />` in a
  `maxWidth: 920` wrapper right after the hero, before the first chapter section.

Then:

```bash
npm run build
npm run preview -- --host
```

Browser-test at iPhone width: duration shows before play, chapter ticks present,
play/seek/dock work, the speed chip opens its menu and the chosen rate actually
changes playback (and survives a reload), no console errors (the `/_vercel/insights`
404 is expected locally). **Give the user the `localhost` and LAN URLs and stop.** Deploying is
outward-facing — wait for explicit sign-off.

### 6. Deploy (only after sign-off)

- Update `CHANGELOG.md` and the version in `package.json` (they move together;
  the sidebar shows it via `__APP_VERSION__`).
- Stage precisely — the audio, manifest, config, the page, any script changes.
  **Never stage `public/audio/samples/` (gitignored throwaways) or `.env.local`.**
  Confirm with `git diff --cached --name-only | grep -i sample` (should be empty).
- Commit (conventional message, attribute any of the user's own in-flight prose
  edits), push to `main`, Vercel auto-deploys.
- Verify live: the audio serves 200 with `content-type: audio/mpeg`, an
  `immutable` cache header, and **HTTP 206 on a Range request** (iOS seeking);
  then load the page and confirm the player plays from `adib.ihsan.build`.

---

## Hard-won gotchas

- **Google AI Pro ≠ API access.** The $19.99/mo consumer plan grants no Gemini API
  quota. The free AI Studio key is separate.
- **Chunk-per-chapter is deliberate**, not incidental: it yields exact chapter
  offsets for the scrub bar from any provider, and avoids Gemini's documented
  quality drift on long single outputs. Over-long chapters are sub-chunked
  further (`MAX_SYNTH_CHARS`) for the same reason — always run `rate-check.mjs`
  to confirm the pace stayed even.
- **The drift guard is the safety net.** If the user edits the article after the
  audio exists, `--check` fails and the audio must be regenerated for the changed
  chapters (the cache makes that cheap — only changed chunks re-synthesize).
- **TTS models are `-preview`.** Google can revise/retire `gemini-3.1-flash-tts-preview`.
  If it disappears, the script + cache are committed infrastructure — re-voicing
  is one command against whatever replaces it.
- **Other providers exist** behind the same interface (`scripts/tts/providers/`):
  ElevenLabs (best delivery, but its free tier bars commercial use and needs
  attribution; ~$5 for a full run), OpenAI (~$0.35, natural, no strings), Google
  Cloud Chirp 3 HD (free, flatter). Swap with `--provider <name>`.

## Files

- `scripts/tts/extract-script.mjs` — prose → `<slug>.script.json` (+ `--check` drift guard)
- `scripts/tts/render.mjs` — script → the exact spoken text (shared by all providers)
- `scripts/tts/preview-script.mjs` — print the spoken text for review
- `scripts/tts/rate-check.mjs` — per-chapter speaking rate; flags pace drift
- `scripts/tts/generate.mjs` — synthesize + concat + manifest (guard + cache)
- `scripts/tts/generate-until-done.sh` — retry wrapper for the free-tier quota
- `scripts/tts/providers/*.mjs` — one adapter per TTS provider
- `src/components/ListenBar.jsx` — the player (generic; reads a manifest)
- `src/data/audio/<slug>.narrate.json` — optional per-piece extraction config
- `src/data/audio/<slug>.{script,}.json` — the narration script and player manifest
- `public/audio/<slug>.mp3` — the shipped audio
