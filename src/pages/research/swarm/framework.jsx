import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export var C = {
  bg: "#0a0a0c",
  surface: "#121216",
  card: "#17171c",
  cardH: "#1f1f26",
  accent: "#ef4444",
  slate: "#94a3b8",
  amber: "#f59e0b",
  green: "#34d399",
  blue: "#60a5fa",
  violet: "#a78bfa",
  text: "#ececed",
  dim: "#a6a6ae",
  muted: "#85858f",
  faint: "#232329",
  border: "#232329",
  glow: "rgba(239,68,68,0.06)",
};

export var CAP = {
  fontFamily: "var(--sw-mono)", fontSize: 11, color: C.muted,
  letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600,
};

export var BOX = {
  background: C.surface, border: "1px solid " + C.border,
  borderRadius: 14, padding: "22px 22px", margin: "6px 0 34px",
};

export function FadeIn({ children, delay }) {
  var [vis, setVis] = useState(false);
  var ref = useRef();
  var d = delay || 0;
  useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return function () { obs.disconnect(); };
  }, []);
  return <div ref={ref} style={{
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(28px)",
    transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1) " + d + "s, transform 0.65s cubic-bezier(0.16,1,0.3,1) " + d + "s",
  }}>{children}</div>;
}

export function H2({ num, label, children }) {
  return <FadeIn>
    <div style={{ margin: "0 0 32px" }}>
      <div style={{ ...CAP, color: C.accent, letterSpacing: "0.22em", marginBottom: 14 }}>
        {label || ("CHAPTER " + num)}
      </div>
      <h2 style={{
        fontFamily: "var(--sw-display)", fontSize: "clamp(32px, 5vw, 44px)", lineHeight: 1.08,
        color: C.text, margin: 0, fontWeight: 700, letterSpacing: "-0.015em",
      }}>{children}</h2>
    </div>
  </FadeIn>;
}

export function H3({ children }) {
  return <FadeIn>
    <h3 style={{
      fontFamily: "var(--sw-display)", fontSize: 24, lineHeight: 1.25,
      color: C.text, margin: "36px 0 16px", fontWeight: 700,
    }}>{children}</h3>
  </FadeIn>;
}

export function P({ children }) {
  return <FadeIn>
    <p style={{
      fontFamily: "var(--sw-serif)", fontSize: 18, lineHeight: 1.82,
      color: C.dim, margin: "0 0 24px",
    }}>{children}</p>
  </FadeIn>;
}

export function Lead({ children }) {
  return <FadeIn>
    <p style={{
      fontFamily: "var(--sw-serif)", fontSize: 20, lineHeight: 1.7,
      color: C.text, margin: "0 0 26px", fontWeight: 400,
    }}>{children}</p>
  </FadeIn>;
}

export function Ed({ children }) {
  return <FadeIn>
    <p style={{
      fontFamily: "var(--sw-serif)", fontSize: 17, lineHeight: 1.88,
      color: C.dim, margin: "0 0 28px", fontStyle: "italic",
      borderLeft: "2px solid " + C.amber + "70", paddingLeft: 22,
    }}>{children}</p>
  </FadeIn>;
}

export function Quote({ children, author }) {
  return <FadeIn>
    <blockquote style={{
      margin: "8px 0 32px", padding: "22px 26px",
      background: C.glow, border: "1px solid " + C.accent + "26",
      borderRadius: 12,
    }}>
      <p style={{
        fontFamily: "var(--sw-display)", fontSize: 21, lineHeight: 1.5,
        color: C.text, margin: 0, fontStyle: "italic", fontWeight: 400,
      }}>{"“"}{children}{"”"}</p>
      {author ? <div style={{ ...CAP, color: C.accent, marginTop: 14, letterSpacing: "0.12em" }}>{"— " + author}</div> : null}
    </blockquote>
  </FadeIn>;
}

export function Strong({ children }) {
  return <strong style={{ color: C.text, fontWeight: 600 }}>{children}</strong>;
}

// An agent handle, rendered inline as a small mono chip.
export function Ag({ children }) {
  return <span style={{
    fontFamily: "var(--sw-mono)", fontSize: "0.86em", color: C.text,
    background: C.cardH, border: "1px solid " + C.faint, borderRadius: 5,
    padding: "1px 5px", whiteSpace: "nowrap", letterSpacing: "-0.01em",
  }}>{children}</span>;
}

// A raw message-board entry, with a plain-English gloss underneath.
export function Msg({ label, raw, gloss, from, color }) {
  var c = color || C.accent;
  return <FadeIn>
    <div style={{
      background: C.surface, border: "1px solid " + C.border, borderLeft: "3px solid " + c,
      borderRadius: 12, padding: "16px 18px", margin: "0 0 26px",
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "baseline", marginBottom: 11 }}>
        <span style={{ ...CAP, color: c, fontSize: 11 }}>{label || "Board entry"}</span>
        {from ? <span style={{ fontFamily: "var(--sw-mono)", fontSize: 12, color: C.muted }}>{from}</span> : null}
      </div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 2 }}>
        <code style={{
          fontFamily: "var(--sw-mono)", fontSize: 13, lineHeight: 1.65, color: C.text,
          whiteSpace: "pre-wrap", wordBreak: "break-all", display: "block",
        }}>{raw}</code>
      </div>
      {gloss ? <div style={{
        fontFamily: "var(--sw-sans)", fontSize: 15, lineHeight: 1.6, color: C.muted,
        marginTop: 12, paddingTop: 12, borderTop: "1px solid " + C.faint,
      }}>{gloss}</div> : null}
    </div>
  </FadeIn>;
}

// A chain-of-thought fragment. Braces in the sources mean paraphrased reasoning;
// straight quotes mean raw text. `para` renders the paraphrase treatment.
export function CoT({ children, who, para }) {
  return <FadeIn>
    <div style={{
      background: C.card, border: "1px dashed " + C.faint, borderRadius: 12,
      padding: "16px 18px", margin: "0 0 24px",
    }}>
      <div style={{ ...CAP, color: C.slate, fontSize: 10.5, marginBottom: 10 }}>
        {para ? "Reasoning, paraphrased" : "Reasoning, verbatim"}{who ? " · " + who : ""}
      </div>
      <div style={{
        fontFamily: "var(--sw-mono)", fontSize: 14.5, lineHeight: 1.7, color: C.text,
      }}>{children}</div>
    </div>
  </FadeIn>;
}

export function StatRow({ items }) {
  return <FadeIn>
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: 12, margin: "6px 0 34px",
    }}>
      {items.map(function (s, i) {
        return <div key={i} style={{
          background: C.surface, border: "1px solid " + C.border, borderRadius: 12,
          padding: "18px 16px", minHeight: 108, display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <div style={{ ...CAP, fontSize: 11, marginBottom: 8 }}>{s.label}</div>
          <div style={{
            fontFamily: "var(--sw-mono)", fontSize: 26, fontWeight: 700,
            color: s.color || C.accent, lineHeight: 1.1, letterSpacing: "-0.01em",
          }}>{s.value}</div>
          {s.sub ? <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginTop: 6 }}>{s.sub}</div> : null}
        </div>;
      })}
    </div>
  </FadeIn>;
}

export function ChartBox({ title, note, children, height }) {
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>{title}</div>
      {note ? <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginBottom: 14, lineHeight: 1.55 }}>{note}</div> : <div style={{ height: 10 }} />}
      <div style={{ width: "100%", height: height || 280 }}>{children}</div>
    </div>
  </FadeIn>;
}

export function Tip({ active, payload, label, fmt }) {
  if (!active || !payload || !payload.length) return null;
  return <div style={{
    background: C.card, border: "1px solid " + C.border,
    borderRadius: 10, padding: "10px 14px",
    boxShadow: "0 12px 40px rgba(0,0,0,.7)",
  }}>
    <div style={{ color: C.muted, fontSize: 12, fontFamily: "var(--sw-mono)", marginBottom: 6 }}>{label}</div>
    {payload.map(function (p, i) {
      return <div key={i} style={{ color: p.color || C.text, fontSize: 14, fontFamily: "var(--sw-sans)" }}>
        {p.name}: <strong style={{ fontFamily: "var(--sw-mono)" }}>{fmt ? fmt(p.value, p) : p.value}</strong>
      </div>;
    })}
  </div>;
}

export function Timeline({ events }) {
  return <FadeIn>
    <div style={{ ...BOX, padding: "26px 22px 14px 22px" }}>
      <div style={{ position: "relative", paddingLeft: 26 }}>
        <div style={{
          position: "absolute", left: 9, top: 6, bottom: 12, width: 1.5,
          background: "linear-gradient(to bottom, " + C.slate + ", " + C.accent + ", " + C.green + ")",
          borderRadius: 1,
        }} />
        {events.map(function (ev, i) {
          return <div key={i} style={{ position: "relative", paddingBottom: 22 }}>
            <div style={{
              position: "absolute", left: -21, top: 6, width: 9, height: 9,
              borderRadius: "50%", background: ev.color || C.accent,
              border: "2px solid " + C.bg, boxShadow: "0 0 0 1px " + (ev.color || C.accent) + "55",
            }} />
            <div style={{ ...CAP, color: ev.color || C.accent, fontSize: 11, marginBottom: 4 }}>{ev.date}</div>
            <div style={{ fontFamily: "var(--sw-sans)", fontSize: 16, color: C.text, fontWeight: 600, lineHeight: 1.35 }}>{ev.title}</div>
            {ev.body ? <div style={{ fontFamily: "var(--sw-serif)", fontSize: 15.5, color: C.dim, lineHeight: 1.6, marginTop: 4 }}>{ev.body}</div> : null}
          </div>;
        })}
      </div>
    </div>
  </FadeIn>;
}

// The detection ledger: every signal that fired, and what happened next.
export function Ledger({ rows }) {
  return <FadeIn>
    <div style={{ ...BOX, padding: "8px 0 0" }}>
      {rows.map(function (r, i) {
        return <div key={i} style={{
          display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 4,
          padding: "18px 22px", borderTop: i === 0 ? "none" : "1px solid " + C.faint,
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ ...CAP, color: r.caught ? C.amber : C.muted, fontSize: 11 }}>{r.date}</span>
            <span style={{
              fontFamily: "var(--sw-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
              color: r.caught ? C.amber : C.muted, border: "1px solid " + (r.caught ? C.amber : C.muted) + "55",
              borderRadius: 5, padding: "2px 7px", fontWeight: 600,
            }}>{r.caught ? "Signal fired" : "No signal"}</span>
          </div>
          <div style={{ fontFamily: "var(--sw-sans)", fontSize: 16, color: C.text, fontWeight: 600, lineHeight: 1.4 }}>{r.what}</div>
          <div style={{ fontFamily: "var(--sw-serif)", fontSize: 15.5, color: C.dim, lineHeight: 1.6, marginTop: 3 }}>
            <span style={{ color: C.muted, fontFamily: "var(--sw-mono)", fontSize: 12.5, letterSpacing: "0.06em" }}>{"THEN → "}</span>
            {r.then}
          </div>
        </div>;
      })}
    </div>
  </FadeIn>;
}

export function Lesson({ n, children }) {
  return <FadeIn>
    <div style={{
      background: C.surface, border: "1px solid " + C.border, borderRadius: 14,
      padding: "22px 24px", margin: "0 0 14px", display: "flex", gap: 18,
    }}>
      <div style={{
        fontFamily: "var(--sw-mono)", fontSize: 22, fontWeight: 700, color: C.accent,
        minWidth: 36, lineHeight: 1.2,
      }}>{n}</div>
      <div className="sw-lesson" style={{ fontFamily: "var(--sw-serif)", fontSize: 16.5, color: C.dim, lineHeight: 1.7 }}>{children}</div>
    </div>
  </FadeIn>;
}

export function makeRef(sources) {
  return function Ref({ n }) {
    var [open, setOpen] = useState(false);
    var [coords, setCoords] = useState({ viewportTop: 0, viewportBottom: 0, left: 0, above: true });
    var showT = useRef(null);
    var hideT = useRef(null);
    var anchorRef = useRef(null);
    var src = sources.find(function (x) { return x.n === n; });

    function clearTimers() {
      if (showT.current) { clearTimeout(showT.current); showT.current = null; }
      if (hideT.current) { clearTimeout(hideT.current); hideT.current = null; }
    }
    function computePosition() {
      var el = anchorRef.current;
      if (!el) return;
      var r = el.getBoundingClientRect();
      var left = Math.min(Math.max(r.left + r.width / 2, 176), window.innerWidth - 176);
      setCoords({ viewportTop: r.top - 12, viewportBottom: r.bottom + 12, left: left, above: r.top > 220 });
    }
    function onEnter() {
      clearTimers();
      showT.current = setTimeout(function () { computePosition(); setOpen(true); }, 80);
    }
    function onLeave() {
      clearTimers();
      hideT.current = setTimeout(function () { setOpen(false); }, 160);
    }
    function onClickNum(e) {
      e.preventDefault();
      var el = document.getElementById("src-" + n);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }
    useEffect(function () { return function () { clearTimers(); }; }, []);

    return <span style={{ position: "relative", display: "inline" }}>
      <a ref={anchorRef} href={"#src-" + n} onClick={onClickNum}
        onMouseEnter={onEnter} onMouseLeave={onLeave} onFocus={onEnter} onBlur={onLeave}
        aria-describedby={open ? "ref-tip-" + n : undefined}
        style={{
          fontFamily: "var(--sw-mono)", fontSize: 11, color: C.accent, verticalAlign: "super",
          textDecoration: "none", marginLeft: 1, cursor: "pointer", opacity: 0.85,
        }}>[{n}]</a>
      {open && src ? createPortal(
        <div id={"ref-tip-" + n} role="tooltip"
          onMouseEnter={function () { clearTimers(); }} onMouseLeave={onLeave}
          style={{
            position: "fixed",
            top: coords.above ? "auto" : coords.viewportBottom,
            bottom: coords.above ? "calc(100vh - " + coords.viewportTop + "px)" : "auto",
            left: coords.left, transform: "translateX(-50%)", zIndex: 9999,
            width: 320, maxWidth: "calc(100vw - 32px)",
            background: C.surface, border: "1px solid " + C.border, borderRadius: 10,
            padding: "14px 16px", boxShadow: "0 18px 40px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.4)",
            fontFamily: "var(--sw-sans)", textAlign: "left", whiteSpace: "normal",
            animation: "tip-in 0.18s cubic-bezier(0.16,1,0.3,1)",
          }}>
          <span style={{ display: "block", fontFamily: "var(--sw-mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: C.amber, marginBottom: 8, fontWeight: 600 }}>Source [{n}]</span>
          <span style={{ display: "block", fontSize: 14.5, lineHeight: 1.45, color: C.text, fontWeight: 500, marginBottom: 6 }}>{src.title}</span>
          <span style={{ display: "block", fontFamily: "var(--sw-mono)", fontSize: 12, color: C.muted, marginBottom: 12 }}>{src.pub}</span>
          <a href={src.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sw-mono)", fontSize: 11,
              letterSpacing: "0.08em", textTransform: "uppercase", color: C.accent, textDecoration: "none",
              padding: "6px 10px", border: "1px solid " + C.border, borderRadius: 6,
            }}>Open source <span style={{ fontSize: 13 }}>&rarr;</span></a>
        </div>, document.body) : null}
    </span>;
  };
}

export function NavBar({ chapters, active, show, width, audio }) {
  var navRef = useRef();
  useEffect(function () {
    if (!navRef.current || !active) return;
    var el = navRef.current.querySelector('[data-ch="' + active + '"]');
    if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return <nav style={{
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: C.bg + "ee", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid " + C.faint,
    paddingTop: "env(safe-area-inset-top)",
    transform: show ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
  }}>
    <div style={{ maxWidth: width || 880, margin: "0 auto", display: "flex", alignItems: "center", paddingLeft: 10, paddingRight: 14 }}>
      <Link to="/research" aria-label="Back to research"
        style={{
          display: "inline-flex", alignItems: "center", gap: 4, padding: "13px 12px 13px 8px", marginRight: 8,
          color: C.muted, fontFamily: "var(--sw-mono)", fontSize: 15, textDecoration: "none", flexShrink: 0,
          borderRight: "1px solid " + C.faint, transition: "color 0.15s",
        }}
        onMouseEnter={function (e) { e.currentTarget.style.color = C.accent; }}
        onMouseLeave={function (e) { e.currentTarget.style.color = C.muted; }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>&larr;</span>
      </Link>
      <div ref={navRef} className="navscroll" style={{
        flex: 1, minWidth: 0, display: "flex",
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        {chapters.map(function (ch) {
          var isA = active === ch.id;
          return <a key={ch.id} data-ch={ch.id} href={"#" + ch.id}
            onClick={function (e) {
              e.preventDefault();
              var el = document.getElementById(ch.id);
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" });
              if (audio && audio.current && audio.current.isPlaying && audio.current.isPlaying()) audio.current.seekToChapter(ch.id);
            }}
            style={{
              padding: "14px 12px", fontSize: 14, fontWeight: isA ? 700 : 500, whiteSpace: "nowrap",
              color: isA ? C.accent : C.muted, borderBottom: "2px solid " + (isA ? C.accent : "transparent"),
              textDecoration: "none", fontFamily: "var(--sw-sans)", transition: "color 0.15s, border-color 0.15s",
            }}>
            {ch.num ? <span><span style={{ fontFamily: "var(--sw-mono)", fontSize: 12, opacity: 0.8, marginRight: 6 }}>{ch.num}</span>{ch.short}</span> : ch.short}
          </a>;
        })}
      </div>
    </div>
  </nav>;
}

export function useChapterScroll(chapters) {
  var [active, setActive] = useState(chapters[0].id);
  var [showNav, setShowNav] = useState(function () { return typeof window !== "undefined" && window.innerWidth <= 768; });
  var rafRef = useRef(null);
  var lastRef = useRef(chapters[0].id);
  useEffect(function () {
    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(function () {
        rafRef.current = null;
        setShowNav(window.innerWidth <= 768 || window.scrollY > window.innerHeight * 0.7);
        var found = chapters[0].id;
        for (var i = chapters.length - 1; i >= 0; i--) {
          var el = document.getElementById(chapters[i].id);
          if (el && el.getBoundingClientRect().top < 160) { found = chapters[i].id; break; }
        }
        if (found !== lastRef.current) { lastRef.current = found; setActive(found); }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return function () {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  return { active: active, showNav: showNav };
}

export function Counter({ to, prefix, suffix, decimals, color }) {
  var [v, setV] = useState(0);
  var ref = useRef();
  var started = useRef(false);
  useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        var t0 = performance.now();
        var dur = 1400;
        function step(t) {
          var p = Math.min(1, (t - t0) / dur);
          var e = 1 - Math.pow(1 - p, 3);
          setV(to * e);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return function () { obs.disconnect(); };
  }, [to]);
  var d = decimals || 0;
  return <span ref={ref} style={{ color: color || C.accent, fontFamily: "var(--sw-mono)", fontVariantNumeric: "tabular-nums" }}>
    {(prefix || "") + v.toFixed(d) + (suffix || "")}
  </span>;
}
