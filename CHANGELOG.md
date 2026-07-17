# Changelog

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
