"""
Synthesizes one chunk of narration with Kokoro-82M (MLX) and writes a WAV.

    echo "text" | .tts-venv/bin/python scripts/tts/kokoro/synth.py --voice am_michael --out x.wav

Called by scripts/tts/providers/kokoro.mjs, once per chunk. Text arrives on
stdin; paragraphs are separated by blank lines, as render.mjs emits them.

Kokoro generates sentence by sentence, so unlike Gemini there is no long
autoregressive run to drift: the last minute of a chunk sounds like the first.
It also has no notion of a paragraph, so the beat a human narrator takes at
each paragraph break is inserted here as silence.
"""
import argparse, os, sys, warnings

warnings.filterwarnings("ignore")
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")

# espeak-ng (Kokoro's fallback for words outside its lexicon) must come from
# Homebrew: espeakng-loader's bundled data path is baked to its CI machine.
# misaki reads these two functions at import time, so patch them first.
import espeakng_loader
for prefix in (os.environ.get("ESPEAK_NG_PREFIX"), "/opt/homebrew/opt/espeak-ng", "/usr/local/opt/espeak-ng"):
    if prefix and os.path.exists(f"{prefix}/share/espeak-ng-data/phontab"):
        espeakng_loader.get_library_path = lambda p=prefix: f"{p}/lib/libespeak-ng.dylib"
        espeakng_loader.get_data_path = lambda p=prefix: f"{p}/share/espeak-ng-data"
        break
else:
    sys.exit("espeak-ng not found: brew install espeak-ng (or set ESPEAK_NG_PREFIX)")

import numpy as np
import soundfile as sf
from mlx_audio.tts.utils import load_model

MODEL = "mlx-community/Kokoro-82M-bf16"
SR = 24000

ap = argparse.ArgumentParser()
ap.add_argument("--voice", default="am_michael")
ap.add_argument("--out", required=True)
ap.add_argument("--speed", type=float, default=float(os.environ.get("KOKORO_SPEED", "1.0")))
ap.add_argument("--para-pause", type=float, default=0.6)
a = ap.parse_args()

paras = [p.strip() for p in sys.stdin.read().split("\n\n") if p.strip()]
if not paras:
    sys.exit("no text on stdin")

model = load_model(MODEL)
gap = np.zeros(int(SR * a.para_pause), dtype=np.float32)
out = []
for i, para in enumerate(paras):
    # Single newlines inside a paragraph would make Kokoro split mid-thought.
    text = " ".join(para.split())
    for r in model.generate(text=text, voice=a.voice, lang_code=a.voice[0], speed=a.speed):
        out.append(np.asarray(r.audio, dtype=np.float32).reshape(-1))
    if i < len(paras) - 1:
        out.append(gap)

sf.write(a.out, np.concatenate(out), SR, subtype="PCM_16")
