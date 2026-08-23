# Changelog

## 0.5.1 — 2026-07-20

### Changed
- **"The AI Capital Graph" refreshed to July 20, 2026.** Updated every public
  market cap and private valuation (NVIDIA ~$4.9T, Alphabet ~$4.3T, Microsoft
  and Oracle down, Anthropic to $965B, SpaceX now public ~$2.1T) and added the
  major deals since April: Anthropic's $65B Series H, its ~$45B SpaceX compute
  deal and early Meta talks, SpaceX's IPO, and SpaceX's $60B Cursor acquisition.
- **Expanded the map beyond the original roster.** New China cluster (DeepSeek,
  Moonshot/Kimi, Zhipu, MiniMax, Alibaba, Tencent) with its own grouped color,
  new US frontier labs (Safe Superintelligence, Thinking Machines, Perplexity,
  Cursor), chip challengers (Groq, Cerebras), and sovereign operator HUMAIN — 66
  deals / 43 companies / ~$2.7T committed, up from 48 / 28 / ~$1.9T. Added an
  "IP license / acquihire" deal type for the NVIDIA–Groq deal. The research card
  is now dated July 2026 and leads the list.

## 0.5.0 — 2026-07-19

### Added
- **Audio narration for "The New York Times Turnaround."** A ~25-minute spoken
  version (Gemini 3.1 Flash TTS, voice "Charon") with the ListenBar player:
  play/pause, ±15s skip, a scrubbable bar with per-chapter ticks (9 chapters), a
  playback-speed menu, a bar that docks to the bottom on scroll, and iOS
  lock-screen controls. Tapping a chapter in the nav seeks the audio while it
  plays. Pre-generated and shipped as a plain MP3 — no runtime TTS, no keys.

### Changed
- **Playback speed is now 0.7×–1.5× in 0.1 steps** (was 0.25×–2×). The extremes
  proved impractical to actually listen at.
- **Narration pace stays even across a piece.** The generator sub-chunks any
  chapter over ~3,000 characters at paragraph breaks — Gemini rushes long single
  outputs — and a new `rate-check` reports each chapter's chars/s against the
  median so pace drift is caught before shipping. The spoken-form pass also
  expands ampersands, "N×" multiples, "#" tags, and slashes ("EV/Revenue").

### Fixed
- **TTS generation survives Gemini's flaky free tier.** Transient
  `400 INVALID_ARGUMENT` responses — which succeed verbatim on the next try — are
  retried instead of aborting the run.
- **The NYT player uses its correct colors.** The ListenBar reads
  `card`/`surface`/`border`/`accent`, which this page names `paper`/`faint`/`red`;
  the mismatch had left the speed menu transparent. Mapped at the boundary.

## 0.4.0 — 2026-07-18

### Added
- **Audio narration for "GE Aerospace: Inside the Turnaround."** A ~14-minute
  spoken version (Gemini 3.1 Flash TTS, voice "Charon") with the ListenBar player:
  play/pause, ±15s skip, a scrubbable bar with per-chapter ticks (8 chapters), the
  playback-speed menu, a bar that docks to the bottom on scroll, and iOS lock-screen
  controls. Tapping a chapter in the nav seeks the audio while it plays. The audio is
  pre-generated and shipped as a plain MP3 — no runtime TTS, no keys.

### Changed
- **Narration handles figure-dense prose.** Added a spoken-form pass to the TTS
  renderer that expands magnitude suffixes ("$190B" → "$190 billion"), tildes
  ("~$59" → "around $59"), and per-unit slashes ("$0.01/share" → "$0.01 a share")
  at synthesis time only — the page text and the drift-check hash are untouched, so
  figure-heavy pieces like GE stop mis-speaking. No effect on existing narrations.

## 0.3.0 — 2026-07-17

### Added
- **Audio narration for "Apple TV+: The Prestige Play."** A ~22-minute spoken
  version (Gemini 3.1 Flash TTS, voice "Charon") with the ListenBar player:
  play/pause, ±15s skip, a scrubbable bar with per-chapter ticks, the playback-speed
  menu, a bar that docks to the bottom on scroll, and iOS lock-screen controls. The
  audio is pre-generated and shipped as a plain MP3 — no runtime TTS, no keys.

### Fixed
- **Apple TV+ page typography.** The page referenced the `--ds-*` font variables
  but never defined them, so the whole piece was falling back to the sans body font.
  Added the font block the other research pieces use (Fraunces display, Source Serif 4
  body), restoring the intended serif editorial look.
- **Drop-cap narration.** The script extractor dropped the first letter of each
  chapter's drop-cap paragraph ("It was" → "t was"); it now restores the letter
  carried in the `first` prop.

## 0.2.0 — 2026-07-17

### Added
- **Playback speed on the audio player.** A speed chip on both the inline card
  and the docked bar opens a tap-to-pick menu with 0.25×, 0.5×, 1×, 1.5×, and 2×.
  The choice persists across visits (localStorage) and is re-applied if the audio
  element reloads.

## 0.1.1 — 2026-07-17

### Changed
- **Editorial pass on six research pieces** — ran the AI-ism elimination pass over
  Apple TV+, the NYT turnaround, the OpenAI origin, Legacy Hollywood, GE Aerospace,
  and the Spurs. Removed machine tells (contrast-frame "not X, it's Y" constructions,
  a couple of movie-trailer fragment cascades, one lazy concluding pivot) without
  changing any facts, figures, quotes, or the authorial voice. The Spurs piece was
  already clean and left untouched.


## 0.1.0 — 2026-07-17

First tracked version. The site had no changelog and sat at `0.0.0`; the version
now shows in the sidebar footer and moves with every release.

### Added
- **Listen to this piece** — audio narration for research articles. A play button
  with a scrubbable bar, ±15s skip, and chapter markers. The card sits under the
  hero and docks to a sticky bottom bar once you scroll past it mid-listen.
  Built for iPhone Safari: lock-screen playback via the Media Session API, and
  the scrub bar knows its length before a byte of audio is fetched.
- **Swappable TTS pipeline** (`scripts/tts/`) — narration is pre-generated
  offline and shipped as a static MP3, so there is no TTS API at runtime, no keys
  in the browser, and no per-listen cost. Four interchangeable providers:
  ElevenLabs, OpenAI, Gemini, and Google Cloud Chirp 3 HD. The Bond piece
  ships with Gemini 3.1 Flash TTS (voice "Charon"), chosen by ear in a blind
  A/B against ElevenLabs and Gemini 2.5.
- **`/audio-lab`** — a dev-only blind A/B/C/D bake-off for choosing a voice.

### Fixed
- Reconciled a diverged `main`. The deployed site had the Bond and Apple TV+
  narratives but not the registry-based routing; the local branch had the routing
  but neither article. Merging them left both new articles without the
  `component` field the router requires, which would have crashed both routes at
  runtime — now repaired, with `Seo` and `ResearchFooter` added to match the
  other eleven pages.
