import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Play, Pause, RotateCcw, RotateCw, Headphones, AlertCircle } from "lucide-react";

const SKIP = 15;

function fmt(s) {
  const t = Number.isFinite(s) && s > 0 ? s : 0;
  return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
}

function Track({ compact, C, chapters, duration, pct, scrubProps }) {
  return (
    <div className="lb-track" style={{ marginTop: compact ? 0 : 4 }}>
      <div className="lb-rail" style={{ background: C.border }} />
      <div className="lb-fill" style={{ width: `${pct}%`, background: C.accent }} />
      {!compact && duration > 0 && chapters.map((c) => (
        <span
          key={c.id}
          className="lb-tick"
          title={`Chapter ${c.num} — ${c.title}`}
          style={{ left: `${(c.start / duration) * 100}%`, background: C.muted }}
        />
      ))}
      <input {...scrubProps} />
    </div>
  );
}

function PlayButton({ size, C, playing, buffering, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pause narration" : "Play narration"}
      className="lb-play"
      style={{ width: size, height: size, background: C.accent, color: C.bg, opacity: buffering ? 0.75 : 1 }}
    >
      {buffering
        ? <span className="lb-spinner" style={{ borderTopColor: C.bg }} />
        : playing
          ? <Pause size={size * 0.4} strokeWidth={2.5} fill="currentColor" />
          : <Play size={size * 0.4} strokeWidth={2.5} fill="currentColor" style={{ marginLeft: 2 }} />}
    </button>
  );
}

function Skip({ dir, size = 20, C, onSkip }) {
  return (
    <button
      type="button"
      className="lb-skip"
      style={{ color: C.dim }}
      aria-label={dir < 0 ? `Back ${SKIP} seconds` : `Forward ${SKIP} seconds`}
      onClick={() => onSkip(dir)}
    >
      {dir < 0 ? <RotateCcw size={size} /> : <RotateCw size={size} />}
      <span className="lb-skip-n" style={{ fontFamily: "var(--jb-mono)" }}>{SKIP}</span>
    </button>
  );
}

/**
 * Audio narration player for a research piece.
 *
 * Reads a manifest produced by scripts/tts/generate.mjs. Renders an inline card
 * under the hero that docks to a sticky bar once you scroll past it mid-listen.
 *
 * `controlsRef` is handed back to the article so the chapter nav can seek the
 * audio while it's playing.
 */
export default function ListenBar({ manifest, palette: C, controlsRef }) {
  const audioRef = useRef(null);
  const cardRef = useRef(null);

  // The manifest carries the real duration, so the scrub bar is correct before
  // a single byte of audio is fetched. iOS won't preload metadata until the
  // user interacts, and a bar with no length looks broken.
  const duration = manifest?.duration ?? 0;
  const chapters = useMemo(() => manifest?.chapters ?? [], [manifest]);

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(null);
  const [cardVisible, setCardVisible] = useState(true);

  // While a finger is down, the slider must not be yanked around by timeupdate.
  const shown = scrubbing ? scrubTime : time;
  const pct = duration ? Math.min(100, (shown / duration) * 100) : 0;
  const chapter = chapters.find((c) => shown >= c.start && shown < c.end) ?? null;

  const seek = useCallback((t) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const next = Math.max(0, Math.min(duration, t));
    a.currentTime = next;
    setTime(next);
  }, [duration]);

  const skipBy = useCallback((dir) => {
    seek((audioRef.current?.currentTime ?? 0) + dir * SKIP);
  }, [seek]);

  const toggle = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      setError(null);
      if (a.paused) {
        setBuffering(true);
        await a.play();     // must stay inside the user gesture on iOS
      } else {
        a.pause();
      }
    } catch {
      setError("Couldn't play the audio. Check your connection and try again.");
      setBuffering(false);
    }
  }, []);

  // ---- audio element wiring ----
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => { if (!scrubbing) setTime(a.currentTime); };
    const onPlay = () => { setPlaying(true); setBuffering(false); };
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setTime(0); };
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onError = () => {
      setError("The narration failed to load.");
      setBuffering(false);
      setPlaying(false);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("waiting", onWaiting);
    a.addEventListener("playing", onPlaying);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("waiting", onWaiting);
      a.removeEventListener("playing", onPlaying);
      a.removeEventListener("error", onError);
    };
  }, [scrubbing]);

  // ---- lock screen / control centre ----
  useEffect(() => {
    if (!("mediaSession" in navigator) || !manifest) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: manifest.title ?? "Listen",
      artist: "Adib Choudhury",
      album: "Research",
      artwork: [{ src: "/og-default.png", sizes: "1200x630", type: "image/png" }],
    });
    navigator.mediaSession.setActionHandler("play", toggle);
    navigator.mediaSession.setActionHandler("pause", toggle);
    navigator.mediaSession.setActionHandler("seekbackward", () => seek(audioRef.current.currentTime - SKIP));
    navigator.mediaSession.setActionHandler("seekforward", () => seek(audioRef.current.currentTime + SKIP));
    navigator.mediaSession.setActionHandler("seekto", (e) => e.seekTime != null && seek(e.seekTime));
  }, [manifest, toggle, seek]);

  // ---- dock the bar once the card scrolls away mid-listen ----
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCardVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ---- let the article's chapter nav drive the audio ----
  useEffect(() => {
    if (!controlsRef) return;
    controlsRef.current = {
      isPlaying: () => !!audioRef.current && !audioRef.current.paused,
      seekToChapter: (id) => {
        const c = chapters.find((x) => x.id === id);
        if (c) seek(c.start);
      },
    };
  }, [controlsRef, chapters, seek]);

  if (!manifest?.src) return null;

  const narrator = (manifest.providerLabel ?? "").split("·").pop().trim();
  const docked = playing && !cardVisible;

  const scrubProps = {
    type: "range", min: 0, max: duration || 1, step: 0.5,
    value: shown,
    "aria-label": "Seek",
    "aria-valuetext": `${fmt(shown)} of ${fmt(duration)}`,
    className: "lb-range",
    onPointerDown: () => { setScrubTime(time); setScrubbing(true); },
    onInput: (e) => setScrubTime(Number(e.target.value)),
    onPointerUp: () => { seek(scrubTime); setScrubbing(false); },
    onKeyUp: (e) => { seek(Number(e.target.value)); setScrubbing(false); },
    onBlur: () => setScrubbing(false),
  };

  return (
    <div className="lb-root">
      <style>{`
        .lb-root .lb-play {
          border: none; border-radius: 999px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex: none; transition: transform .15s ease;
        }
        .lb-root .lb-play:active { transform: scale(.94); }
        .lb-root .lb-skip {
          position: relative; background: none; border: none; cursor: pointer;
          padding: 8px; display: flex; align-items: center; justify-content: center;
          flex: none; border-radius: 8px;
        }
        .lb-root .lb-skip:active { transform: scale(.94); }
        .lb-root .lb-skip-n {
          position: absolute; inset: 0; display: flex; align-items: center;
          justify-content: center; font-size: 8px; font-weight: 600;
          padding-top: 1px; pointer-events: none;
        }
        .lb-root .lb-track { position: relative; flex: 1; height: 28px; display: flex; align-items: center; }
        .lb-root .lb-rail, .lb-root .lb-fill {
          position: absolute; height: 3px; border-radius: 2px; pointer-events: none;
        }
        .lb-root .lb-rail { left: 0; right: 0; }
        .lb-root .lb-fill { left: 0; }
        .lb-root .lb-tick {
          position: absolute; width: 1px; height: 9px; opacity: .5;
          pointer-events: none; transform: translateX(-.5px);
        }
        .lb-root .lb-range {
          position: absolute; inset: 0; width: 100%; margin: 0;
          -webkit-appearance: none; appearance: none; background: transparent;
          /* Without this, dragging the scrubber steals the page's vertical scroll on iOS. */
          touch-action: none; cursor: pointer;
        }
        .lb-root .lb-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 14px; height: 14px; border-radius: 999px;
          background: ${C.text}; border: none; cursor: grab;
          box-shadow: 0 1px 6px rgba(0,0,0,.5);
        }
        .lb-root .lb-range::-moz-range-thumb {
          width: 14px; height: 14px; border-radius: 999px;
          background: ${C.text}; border: none; cursor: grab;
        }
        .lb-root .lb-range:focus-visible::-webkit-slider-thumb {
          outline: 2px solid ${C.accent}; outline-offset: 2px;
        }
        .lb-root .lb-spinner {
          width: 15px; height: 15px; border-radius: 999px;
          border: 2px solid transparent; animation: lb-spin .7s linear infinite;
        }
        @keyframes lb-spin { to { transform: rotate(360deg); } }
        .lb-root .lb-dock {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 60;
          padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          animation: lb-up .22s ease;
        }
        @keyframes lb-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          .lb-root .lb-dock { animation: none; }
          .lb-root .lb-play { transition: none; }
        }
      `}</style>

      <audio ref={audioRef} src={manifest.src} preload="metadata" />

      {/* ---- inline card ---- */}
      <div
        ref={cardRef}
        style={{
          maxWidth: 760, margin: "0 auto 56px", padding: "22px 24px",
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 9, marginBottom: 18,
          fontFamily: "var(--jb-mono)", fontSize: 10, letterSpacing: "0.22em",
          textTransform: "uppercase", color: C.accent,
        }}>
          <Headphones size={13} strokeWidth={2} />
          <span>Listen</span>
          <span style={{ color: C.muted }}>· {fmt(duration)}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <PlayButton size={52} C={C} playing={playing} buffering={buffering} onToggle={toggle} />
          <Skip dir={-1} C={C} onSkip={skipBy} />
          <Track C={C} chapters={chapters} duration={duration} pct={pct} scrubProps={scrubProps} />
          <Skip dir={1} C={C} onSkip={skipBy} />
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          marginTop: 10, fontFamily: "var(--jb-mono)", fontSize: 11, color: C.muted,
        }}>
          <span>{fmt(shown)} / {fmt(duration)}</span>
          {narrator && <span>AI narration · {narrator}</span>}
        </div>

        {error && (
          <div role="alert" style={{
            display: "flex", alignItems: "center", gap: 8, marginTop: 14,
            fontFamily: "var(--jb-sans)", fontSize: 14, color: "#e2857f",
          }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}
      </div>

      {/* ---- docked bar, once you scroll past the card mid-listen ---- */}
      {docked && (
        <div className="lb-dock" style={{
          background: `${C.surface}f2`, borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <PlayButton size={38} C={C} playing={playing} buffering={buffering} onToggle={toggle} />
            <Skip dir={-1} size={18} C={C} onSkip={skipBy} />
            <Track compact C={C} chapters={chapters} duration={duration} pct={pct} scrubProps={scrubProps} />
            <Skip dir={1} size={18} C={C} onSkip={skipBy} />
            <span style={{
              fontFamily: "var(--jb-mono)", fontSize: 11, color: C.muted,
              whiteSpace: "nowrap", flex: "none",
            }}>
              {fmt(shown)} / {fmt(duration)}
            </span>
          </div>
          {chapter && (
            <div style={{
              maxWidth: 760, margin: "5px auto 0", fontFamily: "var(--jb-sans)",
              fontSize: 12, color: C.muted, whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis",
            }}>
              Chapter {chapter.num} · {chapter.title}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
