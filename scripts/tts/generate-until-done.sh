#!/usr/bin/env bash
# Generate the full narration, retrying until Gemini's free-tier quota window
# opens. Gemini's TTS free tier is stingy (a handful of requests/day on 2.5, more
# on 3.1) and a 14-chunk piece won't always fit in one window. The generator
# caches each chunk by content hash, so every retry only redoes what's missing —
# nothing already synthesized is lost or re-billed.
#
#   scripts/tts/generate-until-done.sh <slug> [provider] [wait-seconds] [max-attempts]
#
# Runs to completion in one go if quota allows; otherwise waits and resumes.
# The free-tier daily quota resets at midnight Pacific — that's the guaranteed
# backstop. To finish immediately instead, enable billing on the Gemini API key.
set -uo pipefail
cd "$(dirname "$0")/../.."

slug="${1:?usage: generate-until-done.sh <slug> [provider] [wait-seconds] [max-attempts]}"
provider="${2:-gemini}"
wait_s="${3:-1800}"
max="${4:-24}"
log="/tmp/narrate-${slug}.log"
: > "$log"

for attempt in $(seq 1 "$max"); do
  echo "[attempt $attempt/$max] $(date)" | tee -a "$log"
  if node scripts/tts/generate.mjs --slug "$slug" --provider "$provider" --full >> "$log" 2>&1; then
    grep -E "manifest ->|audio    ->" "$log" | tail -2
    echo "COMPLETE on attempt $attempt" | tee -a "$log"
    exit 0
  fi
  tail -3 "$log" | sed 's/^/  /'
  echo "quota/window closed; waiting $((wait_s/60)) min before next attempt..." | tee -a "$log"
  sleep "$wait_s"
done
echo "GAVE UP after $max attempts — see $log" | tee -a "$log"
exit 1
