#!/usr/bin/env bash
# One-time setup for local Kokoro narration on Apple Silicon.
#
#   scripts/tts/kokoro/setup.sh
#
# Creates .tts-venv/ (gitignored) on Python 3.12 — spaCy, which Kokoro's text
# front end needs, does not build on 3.13+. espeak-ng comes from Homebrew because
# the copy bundled in espeakng-loader points at a path that only exists on the
# machine that built it, and fails on every other Mac.
set -euo pipefail
cd "$(dirname "$0")/../../.."

command -v uv >/dev/null || { echo "needs uv: brew install uv" >&2; exit 1; }
brew list espeak-ng >/dev/null 2>&1 || brew install espeak-ng

uv venv -q -p 3.12 .tts-venv
VIRTUAL_ENV="$PWD/.tts-venv" uv pip install -q -r scripts/tts/kokoro/requirements.txt

# Smoke test; also pulls the ~330 MB model into the Hugging Face cache once.
echo "Kokoro is working." | .tts-venv/bin/python scripts/tts/kokoro/synth.py --voice am_michael --out /tmp/kokoro-smoke.wav
echo "ok: .tts-venv ready (smoke test at /tmp/kokoro-smoke.wav)"
