# Changelog

## 0.1.0 — 2026-07-13

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
  ElevenLabs, OpenAI, Gemini, and Google Cloud Chirp 3 HD.
- **`/audio-lab`** — a dev-only blind A/B/C/D bake-off for choosing a voice.

### Fixed
- Reconciled a diverged `main`. The deployed site had the Bond and Apple TV+
  narratives but not the registry-based routing; the local branch had the routing
  but neither article. Merging them left both new articles without the
  `component` field the router requires, which would have crashed both routes at
  runtime — now repaired, with `Seo` and `ResearchFooter` added to match the
  other eleven pages.
