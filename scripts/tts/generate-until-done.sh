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

  # Decide whether waiting can actually help.
  #
  # A persistent 400 INVALID_ARGUMENT is worth sleeping on, but NOT because it
  # means quota — that reading is wrong, and it cost an evening to disprove.
  # Gemini's preview TTS fails a fraction of requests outright, with the failure
  # probability scaling with payload size, and what clears it is a longer gap
  # before the retry. Measured 2026-08-30 on a warm, unthrottled key: a 1,455-char
  # piece failed 6/6 at 1.5s spacing but returned 400-then-200 at 20s spacing,
  # while a 2,900-char payload succeeded first try at 70s spacing. providers/_http.mjs
  # now backs off progressively for exactly this reason and should absorb it, so a
  # 400 reaching this wrapper means even that ladder was not patient enough — in
  # which case a long sleep is the right next move. The content-hash cache means
  # the retry only re-bills what is still missing.
  #
  # A bad key or a plausibility-guard failure will fail identically in 30
  # minutes, so those exit immediately rather than hiding behind hours of silence.
  if tail -40 "$log" | grep -qE "API key|API_KEY_INVALID|PERMISSION_DENIED|UNAUTHENTICATED|401|403"; then
    echo "auth failure — waiting will not help. See $log" | tee -a "$log"
    exit 1
  elif tail -40 "$log" | grep -qE "plausibility guard"; then
    echo "provider kept looping/garbling — lower MAX_SYNTH_CHARS. See $log" | tee -a "$log"
    exit 1
  elif tail -40 "$log" | grep -qE "429|RESOURCE_EXHAUSTED|rate.?limit|quota|400 Bad Request|INVALID_ARGUMENT"; then
    echo "quota/window closed; waiting $((wait_s/60)) min before next attempt..." | tee -a "$log"
    sleep "$wait_s"
  else
    echo "unrecognised failure — not retryable by waiting. See $log" | tee -a "$log"
    exit 1
  fi
done
echo "GAVE UP after $max attempts — see $log" | tee -a "$log"
exit 1
