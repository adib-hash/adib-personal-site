import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ==================== DATA ====================

const chapters = [
  { id: "ch0",  num: "00", short: "Banner",     title: "The Banner" },
  { id: "ch1",  num: "01", short: "Return",     title: "The Return" },
  { id: "ch2",  num: "02", short: "Owner",      title: "The Owner" },
  { id: "ch3",  num: "03", short: "Architect",  title: "The Architect" },
  { id: "ch4",  num: "04", short: "Sidewalks",  title: "Different Sidewalks" },
  { id: "ch5",  num: "05", short: "Ego",        title: "Gotten Over Themselves" },
  { id: "ch6",  num: "06", short: "Money",      title: "Money on the Table" },
  { id: "ch7",  num: "07", short: "Dinners",    title: "The Long Dinners" },
  { id: "ch8",  num: "08", short: "High Tide",  title: "The High Tide" },
  { id: "ch9",  num: "09", short: "Silence",    title: "The Silence" },
  { id: "ch10", num: "10", short: "Rock",       title: "The Rock, Again" },
  { id: "ch11", num: "11", short: "Diaspora",   title: "The Diaspora" },
  { id: "ch12", num: "12", short: "Transmit",   title: "The Transmission" },
  { id: "ch13", num: "13", short: "Long Game",  title: "The Long Game" }
];

const stats = [
  { v: "1,390", k: "Wins credited to Popovich" },
  { v: "5", k: "Championship banners" },
  { v: "22", k: "Straight playoff seasons" },
  { v: "62", k: "Win rebuild around Wembanyama" }
];

const draftPicks = [
  { name: "Tim Duncan",   slot: 1,  yr: "1997", note: "No. 1 overall. The obvious one." },
  { name: "Tony Parker",  slot: 28, yr: "2001", note: "Pop didn't want him. Buford cut a second tape." },
  { name: "Manu Ginobili", slot: 57, yr: "1999", note: "Second-to-last pick. Thorn couldn't pronounce it." }
];

const eras = [
  {
    range: "1989 - 2014",
    name: "The Long Build",
    accent: "gold",
    note: "Twenty-two straight playoff years. Fifty-plus wins in nineteen of Pop's first twenty-two full seasons. Five banners, ending in the 2014 Beautiful Game."
  },
  {
    range: "2016 - 2022",
    name: "The Long Quiet",
    accent: "steel",
    note: "Duncan, Ginobili, Parker gone; Leonard gone. Six straight seasons without a playoff series win, four straight losing campaigns."
  },
  {
    range: "2023 - 2026",
    name: "The Rock, Again",
    accent: "silver",
    note: "Lottery night to Wembanyama. Castle, Harper, Fox. A 62-win team and a 3-1 season series over a 64-18 Thunder."
  }
];

const tree = [
  {
    label: "Head coaches off his Spurs staff",
    accent: "gold",
    people: [
      "Mike Budenholzer - 2021 title, Milwaukee",
      "Mike Brown - twice Coach of the Year",
      "Ime Udoka - 2022 Celtics, NBA Finals",
      "Brett Brown - Sixers rebuild",
      "James Borrego - Hornets",
      "Will Hardy - Jazz",
      "P.J. Carlesimo, Jacque Vaughn, Jim Boylen, Joe Prunty, Mitch Johnson"
    ]
  },
  {
    label: "Former players turned head coach",
    accent: "silver",
    people: ["Steve Kerr", "Doc Rivers", "Monty Williams", "Avery Johnson", "Vinny Del Negro"]
  },
  {
    label: "Front-office diaspora",
    accent: "steel",
    people: [
      "Sam Presti - Thunder",
      "Sean Marks - Nets",
      "Dennis Lindsey - Jazz",
      "Rob Hennigan - Magic",
      "Kevin Pritchard - Pacers",
      "Danny Ferry, then Landry Fields - Hawks"
    ]
  },
  {
    label: "A category of one",
    accent: "wine",
    people: [
      "Becky Hammon - first full-time female assistant in major American sport (2014); two WNBA titles, Las Vegas Aces"
    ]
  }
];

const timeline = [
  { yr: "1987", t: "David Robinson", d: "The franchise's first No. 1 overall pick. The Admiral." },
  { yr: "1993", t: "Holt buys in", d: "Peter M. Holt leads 22 local investors; $75M from Red McCombs. The Spurs stay in San Antonio." },
  { yr: "1994", t: "Popovich + Buford", d: "Pop hired as general manager; Buford rehired to run scouting." },
  { yr: "1996", t: "Pop takes the bench", d: "Fires Bob Hill, coaches himself to 17-47. Robinson breaks his foot." },
  { yr: "1997", t: "The ping-pong ball", d: "The Spurs win the lottery and draft Tim Duncan." },
  { yr: "1999", t: "First banner", d: "A lockout-season title, 15-2 in the playoffs. Ginobili taken 57th." },
  { yr: "2001", t: "Parker at 28", d: "The French point guard Pop did not initially want." },
  { yr: "2002", t: "The arena opens", d: "Built through a 1999 ballot measure." },
  { yr: "2003", t: "Robinson's exit", d: "A title and a final game: 13 points, 17 rebounds." },
  { yr: "2011", t: "Kawhi arrives", d: "George Hill traded to Indiana for his draft rights." },
  { yr: "2014", t: "The Beautiful Game", d: "The Heat dismantled in five; Leonard, 22, wins Finals MVP. Hammon hired." },
  { yr: "2016", t: "The handoffs begin", d: "Duncan retires; Peter M. Holt retires, hands the team to Julianna." },
  { yr: "2018", t: "The Long Quiet", d: "Ginobili retires, Parker leaves for Charlotte, Leonard traded to Toronto." },
  { yr: "2019", t: "New stewards", d: "Buford promoted to CEO; Brian Wright takes basketball operations." },
  { yr: "2023", t: "The rock cracks again", d: "May 16 lottery win, then Victor Wembanyama." },
  { yr: "2024", t: "November 2", d: "Popovich suffers a stroke at the arena before tip-off." },
  { yr: "2025", t: "El Jefe", d: "Mitch Johnson made permanent head coach; Pop becomes President of Basketball Operations." },
  { yr: "2026", t: "Game 1, Oklahoma City", d: "A 62-win team, one series from the Conference Finals." }
];

const ledger = [
  { k: "Purchase, 1993", v: "$75M, 22 investors" },
  { k: "Consecutive playoff seasons (1989-90 to 2018-19)", v: "22" },
  { k: "50-win seasons, Pop's first 22 full years", v: "19" },
  { k: "No. 1, ESPN Ultimate Standings", v: "4x (2004, 2006, 2014, 2015)" },
  { k: "1999 playoff run", v: "15-2" },
  { k: "2014 Finals shooting vs. the Heat", v: "52.8% FG, 25.4 ast/g" },
  { k: "Big Three draft slots (Duncan / Parker / Ginobili)", v: "1 / 28 / 57" },
  { k: "NBA head coaches off his Spurs staff", v: "11" },
  { k: "2025-26 season series vs. OKC (64-18)", v: "3-1" }
];

// ==================== DESIGN SYSTEM ====================

const C = {
  bg:      "#0b0c0e",
  surface: "#121317",
  card:    "#16181d",
  cardH:   "#1e2128",
  silver:  "#cfd4da",
  steel:   "#8a93a0",
  wine:    "#9c5560",
  gold:    "#bd9a5f",
  goldH:   "#d6b378",
  text:    "#e9ecf0",
  dim:     "#b7bdc6",
  muted:   "#79828f",
  faint:   "#1b1e25",
  border:  "#24272f"
};

// ==================== GLOBAL ====================

function ProgressBar() {
  var [pct, setPct] = useState(0);
  useEffect(function() {
    var raf = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function() {
        raf = null;
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, zIndex: 300,
      height: 2, width: pct + "%",
      background: "linear-gradient(90deg, " + C.steel + " 0%, " + C.gold + " 100%)",
      pointerEvents: "none"
    }} />
  );
}

function FadeIn({ children, delay }) {
  var [vis, setVis] = useState(false);
  var ref = useRef();
  useEffect(function() {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.06 });
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);
  var d = delay || 0;
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) " + d + "ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) " + d + "ms"
    }}>{children}</div>
  );
}

// ==================== TYPOGRAPHY ====================

function H2({ children, id }) {
  return (
    <FadeIn>
      <h2 id={id} style={{
        fontFamily: "var(--ds-display)",
        fontSize: "clamp(27px, 4.4vw, 38px)",
        lineHeight: 1.16,
        letterSpacing: "-0.012em",
        color: C.text,
        margin: "62px 0 8px",
        fontWeight: 500,
        scrollMarginTop: 70
      }}>{children}</h2>
    </FadeIn>
  );
}

function ChapterRule({ num }) {
  return (
    <FadeIn>
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        margin: "0 0 28px"
      }}>
        <span style={{
          fontFamily: "var(--ds-mono)", fontSize: 11, color: C.gold,
          letterSpacing: "0.28em"
        }}>{num}</span>
        <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, " + C.gold + "55, transparent)" }} />
      </div>
    </FadeIn>
  );
}

function P({ children, first }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--ds-serif)",
        fontSize: 18,
        lineHeight: 1.78,
        color: C.dim,
        margin: "0 0 24px"
      }}>
        {first ? (
          <span style={{
            float: "left",
            fontFamily: "var(--ds-display)",
            fontSize: 62,
            lineHeight: 0.86,
            color: C.silver,
            fontWeight: 500,
            margin: "6px 14px 0 0"
          }}>{first}</span>
        ) : null}
        {children}
      </p>
    </FadeIn>
  );
}

function Lead({ children }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--ds-serif)",
        fontSize: 20,
        lineHeight: 1.64,
        color: C.text,
        margin: "0 0 28px",
        fontStyle: "italic",
        borderLeft: "2px solid " + C.gold,
        paddingLeft: 18
      }}>{children}</p>
    </FadeIn>
  );
}

function Epigraph({ children, cite }) {
  return (
    <FadeIn>
      <figure style={{
        margin: "30px 0",
        padding: "28px 30px",
        background: C.card,
        border: "1px solid " + C.border,
        borderLeft: "3px solid " + C.gold,
        borderRadius: 4
      }}>
        <blockquote style={{
          fontFamily: "var(--ds-display)",
          fontSize: 20,
          lineHeight: 1.6,
          color: C.text,
          fontStyle: "italic",
          margin: 0
        }}>{children}</blockquote>
        {cite ? (
          <figcaption style={{
            fontFamily: "var(--ds-mono)", fontSize: 11, color: C.gold,
            letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 16
          }}>{cite}</figcaption>
        ) : null}
      </figure>
    </FadeIn>
  );
}

function PullQuote({ children }) {
  return (
    <FadeIn>
      <div style={{
        margin: "44px 0",
        textAlign: "center",
        padding: "0 6px"
      }}>
        <div style={{
          display: "inline-block",
          width: 40, height: 1,
          background: C.gold + "88",
          marginBottom: 22
        }} />
        <div style={{
          fontFamily: "var(--ds-display)",
          fontSize: "clamp(22px, 3.4vw, 30px)",
          lineHeight: 1.4,
          color: C.silver,
          fontStyle: "italic",
          fontWeight: 500,
          maxWidth: 720,
          margin: "0 auto"
        }}>{children}</div>
        <div style={{
          display: "inline-block",
          width: 40, height: 1,
          background: C.gold + "88",
          marginTop: 22
        }} />
      </div>
    </FadeIn>
  );
}

function StatBand() {
  return (
    <FadeIn>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 12,
        margin: "10px 0 8px"
      }}>
        {stats.map(function(s, i) {
          return (
            <div key={i} style={{
              background: C.card,
              border: "1px solid " + C.border,
              borderRadius: 10,
              padding: "20px 18px 16px",
              textAlign: "center"
            }}>
              <div style={{
                fontFamily: "var(--ds-display)",
                fontSize: 32,
                fontWeight: 500,
                color: C.silver,
                lineHeight: 1
              }}>{s.v}</div>
              <div style={{
                fontFamily: "var(--ds-mono)",
                fontSize: 10.5,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.muted,
                marginTop: 12,
                lineHeight: 1.5
              }}>{s.k}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== NAV ====================

function NavBar({ active, show }) {
  var navRef = useRef();
  useEffect(function() {
    if (!navRef.current || !active) return;
    var el = navRef.current.querySelector('[data-ch="' + active + '"]');
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: C.bg + "f0",
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      borderBottom: "1px solid " + C.faint,
      transform: show ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.36s cubic-bezier(0.16,1,0.3,1)"
    }}>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, " + C.gold + "88, transparent)" }} />
      <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", paddingLeft: 10, paddingRight: 14 }}>
        <Link to="/research"
          aria-label="Back to research"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "12px 12px 12px 8px", marginRight: 8,
            color: C.muted, fontFamily: "var(--ds-mono)", fontSize: 14,
            textDecoration: "none", flexShrink: 0,
            borderRight: "1px solid " + C.faint,
            transition: "color 0.15s"
          }}
          onMouseEnter={function(e) { e.currentTarget.style.color = C.gold; }}
          onMouseLeave={function(e) { e.currentTarget.style.color = C.muted; }}
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>&larr;</span>
        </Link>
        <div ref={navRef} style={{ flex: 1, minWidth: 0, display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
          {chapters.map(function(ch) {
            var isA = active === ch.id;
            return (
              <a key={ch.id} data-ch={ch.id} href={"#" + ch.id}
                onClick={function(e) {
                  e.preventDefault();
                  var el = document.getElementById(ch.id);
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" });
                }}
                style={{
                  padding: "12px 13px",
                  fontSize: 11, fontWeight: isA ? 600 : 400,
                  whiteSpace: "nowrap",
                  color: isA ? C.gold : C.muted,
                  borderBottom: "2px solid " + (isA ? C.gold : "transparent"),
                  textDecoration: "none",
                  fontFamily: "var(--ds-sans)",
                  transition: "color 0.2s, border-color 0.2s",
                  letterSpacing: "0.05em"
                }}>{ch.num + " — " + ch.short}</a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function BackPill({ show }) {
  return (
    <Link to="/research"
      aria-label="Back to research"
      style={{
        position: "fixed",
        top: 18,
        left: 18,
        zIndex: 99,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        background: C.surface + "e6",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid " + C.border,
        borderRadius: 999,
        color: C.dim,
        fontFamily: "var(--ds-mono)",
        fontSize: 12,
        letterSpacing: "0.06em",
        textDecoration: "none",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
        transform: show ? "translateY(0)" : "translateY(-6px)",
        transition: "opacity 0.3s ease, transform 0.3s ease, color 0.2s"
      }}
      onMouseEnter={function(e) { e.currentTarget.style.color = C.gold; }}
      onMouseLeave={function(e) { e.currentTarget.style.color = C.dim; }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>&larr;</span>
      <span>Research</span>
    </Link>
  );
}

// ==================== GRAPHICS ====================

function accentOf(key) {
  if (key === "gold") return C.gold;
  if (key === "silver") return C.silver;
  if (key === "steel") return C.steel;
  if (key === "wine") return C.wine;
  return C.gold;
}

function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: "var(--ds-mono)", fontSize: 10, color: C.gold,
      letterSpacing: "0.24em", textTransform: "uppercase",
      marginBottom: 18, display: "flex", alignItems: "center", gap: 12
    }}>
      <span style={{ display: "inline-block", width: 22, height: 1, background: C.gold + "88" }} />
      {children}
    </div>
  );
}

function Panel({ children }) {
  return (
    <FadeIn>
      <div style={{
        background: C.surface,
        border: "1px solid " + C.border,
        borderRadius: 12,
        padding: "26px 24px",
        margin: "38px 0 44px"
      }}>{children}</div>
    </FadeIn>
  );
}

function DraftSlots() {
  var [hov, setHov] = useState(0);
  var pad = 7;
  return (
    <Panel>
      <Eyebrow>The Scouting Story &mdash; where they were found</Eyebrow>
      <div style={{ position: "relative", height: 78, margin: "26px 4px 22px" }}>
        <div style={{
          position: "absolute", left: pad + "%", right: pad + "%", top: 54, height: 2,
          background: "linear-gradient(90deg, " + C.gold + "aa, " + C.border + ")"
        }} />
        {[1, 15, 30, 45, 60].map(function(t) {
          var lf = pad + ((t - 1) / 59) * (100 - 2 * pad);
          return (
            <div key={t} style={{ position: "absolute", left: lf + "%", top: 60, transform: "translateX(-50%)",
              fontFamily: "var(--ds-mono)", fontSize: 9, color: C.muted }}>{t}</div>
          );
        })}
        {draftPicks.map(function(p, i) {
          var lf = pad + ((p.slot - 1) / 59) * (100 - 2 * pad);
          var on = hov === i;
          return (
            <div key={p.name}
              onMouseEnter={function() { setHov(i); }}
              style={{ position: "absolute", left: lf + "%", top: 0, transform: "translateX(-50%)",
                textAlign: "center", cursor: "default" }}>
              <div style={{
                fontFamily: "var(--ds-mono)", fontSize: 11,
                color: on ? C.gold : C.steel, marginBottom: 6, whiteSpace: "nowrap",
                transition: "color 0.2s"
              }}>#{p.slot}</div>
              <div style={{
                width: on ? 15 : 11, height: on ? 15 : 11, borderRadius: "50%",
                background: on ? C.gold : C.silver, margin: "0 auto",
                boxShadow: on ? "0 0 0 5px " + C.gold + "22" : "none",
                transition: "all 0.2s"
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        {draftPicks.map(function(p, i) {
          var on = hov === i;
          return (
            <div key={p.name}
              onMouseEnter={function() { setHov(i); }}
              style={{
                background: on ? C.cardH : C.card,
                border: "1px solid " + (on ? C.gold + "66" : C.border),
                borderRadius: 9, padding: "14px 15px",
                transition: "background 0.2s, border-color 0.2s"
              }}>
              <div style={{ fontFamily: "var(--ds-display)", fontSize: 18, color: C.text, fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: C.gold, margin: "5px 0 8px", letterSpacing: "0.06em" }}>{p.yr} &middot; Pick {p.slot}</div>
              <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.55 }}>{p.note}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function EraRibbon() {
  return (
    <Panel>
      <Eyebrow>The Arc &mdash; three movements</Eyebrow>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {eras.map(function(e) {
          var col = accentOf(e.accent);
          return (
            <div key={e.name} style={{
              flex: "1 1 200px",
              background: C.card,
              borderTop: "3px solid " + col,
              border: "1px solid " + C.border,
              borderTopColor: col,
              borderRadius: "3px 3px 9px 9px",
              padding: "16px 16px 18px"
            }}>
              <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: col, letterSpacing: "0.1em" }}>{e.range}</div>
              <div style={{ fontFamily: "var(--ds-display)", fontSize: 21, color: C.text, fontWeight: 500, margin: "8px 0 10px" }}>{e.name}</div>
              <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.62 }}>{e.note}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function CoachingTree() {
  var [open, setOpen] = useState(0);
  return (
    <Panel>
      <Eyebrow>The Diaspora &mdash; the tree, by branch</Eyebrow>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <span style={{
          display: "inline-block",
          fontFamily: "var(--ds-display)", fontSize: 20, fontWeight: 500, color: C.text,
          padding: "10px 22px", background: C.card,
          border: "1px solid " + C.gold + "55", borderRadius: 999
        }}>
          Gregg Popovich <span style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: C.gold, letterSpacing: "0.14em" }}>EL JEFE</span>
        </span>
      </div>
      <div style={{ width: 1, height: 22, background: C.gold + "66", margin: "0 auto 4px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {tree.map(function(b, i) {
          var col = accentOf(b.accent);
          var isOpen = open === i;
          return (
            <div key={b.label} style={{
              background: C.card, border: "1px solid " + C.border,
              borderTop: "2px solid " + col, borderTopColor: col,
              borderRadius: "2px 2px 9px 9px", overflow: "hidden"
            }}>
              <button
                onClick={function() { setOpen(isOpen ? -1 : i); }}
                aria-expanded={isOpen}
                style={{
                  width: "100%", textAlign: "left", cursor: "pointer",
                  background: "transparent", border: "none",
                  padding: "14px 15px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10
                }}>
                <span style={{
                  fontFamily: "var(--ds-mono)", fontSize: 10.5, color: col,
                  letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.4
                }}>{b.label}</span>
                <span style={{
                  color: col, fontFamily: "var(--ds-mono)", fontSize: 14,
                  transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s"
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? 460 : 0,
                opacity: isOpen ? 1 : 0,
                transition: "max-height 0.36s cubic-bezier(0.16,1,0.3,1), opacity 0.3s",
                padding: isOpen ? "0 15px 15px" : "0 15px"
              }}>
                {b.people.map(function(name) {
                  return (
                    <div key={name} style={{
                      fontFamily: "var(--ds-serif)", fontSize: 13.5, color: C.dim,
                      lineHeight: 1.5, padding: "6px 0",
                      borderTop: "1px solid " + C.faint
                    }}>{name}</div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.1em", textAlign: "center", marginTop: 16 }}>
        TAP A BRANCH TO OPEN IT
      </div>
    </Panel>
  );
}

function FranchiseTimeline() {
  var [active, setActive] = useState("2026");
  return (
    <Panel>
      <Eyebrow>Franchise Timeline &mdash; 1987 to 2026</Eyebrow>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 70, top: 8, bottom: 8, width: 1,
          background: "linear-gradient(180deg, " + C.gold + "55, " + C.border + ", " + C.gold + "55)" }} />
        {timeline.map(function(it) {
          var on = active === it.yr;
          return (
            <div key={it.yr}
              onClick={function() { setActive(it.yr); }}
              style={{ display: "flex", gap: 18, cursor: "pointer", padding: "9px 0" }}>
              <div style={{
                width: 54, textAlign: "right", flexShrink: 0,
                fontFamily: "var(--ds-mono)", fontSize: on ? 14 : 12,
                color: on ? C.gold : C.steel, paddingTop: 2,
                transition: "color 0.2s, font-size 0.2s", fontWeight: on ? 600 : 400
              }}>{it.yr}</div>
              <div style={{ width: 32, position: "relative", flexShrink: 0, display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: on ? 13 : 9, height: on ? 13 : 9, borderRadius: "50%",
                  background: on ? C.gold : C.silver, marginTop: 5,
                  boxShadow: on ? "0 0 0 5px " + C.gold + "22" : "none",
                  transition: "all 0.2s", zIndex: 1
                }} />
              </div>
              <div style={{
                flex: 1,
                background: on ? C.cardH : C.card,
                border: "1px solid " + (on ? C.gold + "55" : C.border),
                borderRadius: 9, padding: "11px 15px",
                transition: "background 0.2s, border-color 0.2s"
              }}>
                <div style={{ fontFamily: "var(--ds-display)", fontSize: 16, color: C.text, fontWeight: 500 }}>{it.t}</div>
                <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.55, marginTop: 3 }}>{it.d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Ledger() {
  return (
    <Panel>
      <Eyebrow>By the Numbers</Eyebrow>
      <div>
        {ledger.map(function(row, i) {
          return (
            <div key={row.k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              gap: 18, padding: "12px 2px",
              borderTop: i === 0 ? "none" : "1px solid " + C.faint
            }}>
              <span style={{ fontFamily: "var(--ds-serif)", fontSize: 14.5, color: C.dim, lineHeight: 1.45 }}>{row.k}</span>
              <span style={{ fontFamily: "var(--ds-mono)", fontSize: 13, color: C.silver, textAlign: "right", whiteSpace: "nowrap", flexShrink: 0 }}>{row.v}</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Capstone() {
  return (
    <FadeIn>
      <div style={{
        margin: "70px 0 6px",
        textAlign: "center"
      }}>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.gold, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 14 }}>Appendix</div>
        <div style={{ fontFamily: "var(--ds-display)", fontSize: "clamp(26px, 4.4vw, 38px)", color: C.text, fontWeight: 500, letterSpacing: "-0.012em" }}>
          The Long Build, in Time
        </div>
        <div style={{ width: 46, height: 1, background: C.gold + "88", margin: "20px auto 0" }} />
      </div>
    </FadeIn>
  );
}

// ==================== MAIN ====================

export default function SpursLongQuiet() {
  var [activeChapter, setActiveChapter] = useState("ch0");
  var [showNav, setShowNav] = useState(function() { return typeof window !== "undefined" && window.innerWidth <= 768; });
  var rafRef = useRef(null);
  var lastRef = useRef("ch0");

  useEffect(function() { window.scrollTo(0, 0); }, []);

  useEffect(function() {
    var onScroll = function() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(function() {
        rafRef.current = null;
        setShowNav(window.innerWidth <= 768 || window.scrollY > window.innerHeight * 0.7);
        var found = chapters[0].id;
        for (var i = chapters.length - 1; i >= 0; i--) {
          var el = document.getElementById(chapters[i].id);
          if (el && el.getBoundingClientRect().top < 160) { found = chapters[i].id; break; }
        }
        if (found !== lastRef.current) { lastRef.current = found; setActiveChapter(found); }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="ds-root" style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "var(--ds-serif)" }}>

      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Source+Serif+4:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        .ds-root {
          --ds-display: 'Fraunces', Georgia, serif;
          --ds-serif:   'Source Serif 4', Georgia, serif;
          --ds-sans:    'Inter', system-ui, sans-serif;
          --ds-mono:    'JetBrains Mono', Menlo, monospace;
        }
        .ds-root *::selection { background: ${C.gold}55; color: ${C.text}; }
        .ds-root nav div::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .ds-root nav a[aria-label="Back to research"] { padding: 15px 18px 15px 14px !important; }
        }
      `}</style>

      <ProgressBar />
      <BackPill show={!showNav} />
      <NavBar active={activeChapter} show={showNav} />

      {/* ================= HERO ================= */}
      <section style={{ minHeight: "94vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          position: "absolute", top: "24%", left: "50%", transform: "translateX(-50%)",
          width: 640, height: 540,
          background: "radial-gradient(ellipse, rgba(189,154,95,0.10) 0%, transparent 68%)",
          pointerEvents: "none", filter: "blur(60px)"
        }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 920, margin: "0 auto", padding: "14vh 24px 8vh", width: "100%" }}>
          <FadeIn>
            <div style={{
              fontFamily: "var(--ds-mono)", fontSize: 10, color: C.gold,
              letterSpacing: "0.32em", marginBottom: 36, textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 14
            }}>
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.gold + "88" }} />
              A Basketball Narrative
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.gold + "44" }} />
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <h1 style={{
              fontFamily: "var(--ds-display)",
              fontSize: "clamp(42px, 7.4vw, 80px)",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              color: C.text,
              margin: "0 0 24px",
              fontWeight: 500
            }}>
              The Long Quiet<br />
              <span style={{ color: C.gold, fontStyle: "italic" }}>Inside the Spurs, Still</span>
            </h1>
          </FadeIn>
          <FadeIn delay={220}>
            <p style={{
              fontFamily: "var(--ds-serif)",
              fontSize: 20,
              lineHeight: 1.62,
              color: C.dim,
              maxWidth: 660,
              margin: "0 0 32px"
            }}>
              A banner goes up without a ceremony. A franchise rebuilds a contender so fast its
              imitators get copied back. The story of an organization that has spent thirty years
              pounding the same rock — and what happens now that the man with the hammer has put it down.
            </p>
          </FadeIn>
          <FadeIn delay={320}>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontFamily: "var(--ds-mono)", fontSize: 11, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <span>Fourteen chapters</span>
              <span style={{ color: C.faint }}>&bull;</span>
              <span>San Antonio</span>
              <span style={{ color: C.faint }}>&bull;</span>
              <span>May 2026</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 100px" }}>

        {/* CHAPTER 00 */}
        <H2 id="ch0">The Banner</H2>
        <ChapterRule num="00" />
        <P first="T">he banner went up in late October without a press release, without a ceremony, almost in apology. High in the rafters of Frost Bank Center, beside the retired jerseys of Tim Duncan and Manu Ginobili and Tony Parker, a small flag now reads &ldquo;POP 1,390&rdquo; — the win total the NBA chose to credit Gregg Popovich after his thirty-year run, the five stars stitched across the top for the five championships. The Spurs raised it on a quiet weeknight, the way they have always raised everything — without theater, without a leak, without anyone seeing the rope until the work was done. By morning, fans walking the concourse looked up and there it was, as though it had been there the entire time.</P>
        <P>This is how it has always worked in San Antonio. The work comes first, and the recognition arrives, if at all, late and embarrassed. &ldquo;Pounding the rock,&rdquo; they call it, and they have called it that for so long now that the phrase has acquired the weight of liturgy, the same Jacob Riis stonecutter quote translated into French and Spanish and Lithuanian and tacked to lockers as players come and go.</P>
        <Epigraph cite="Jacob Riis, by way of a San Antonio locker room">
          When nothing seems to help, I go and look at a stonecutter hammering away at his rock perhaps a hundred times without as much as a crack showing in it. Yet at the hundred and first blow it will split in two, and I know it was not that blow that did it, but all that had gone before.
        </Epigraph>
        <P>This was the line Popovich found, somewhere around 1995, and printed on the walls. It was about poverty and immigrants in Lower Manhattan when Riis wrote it; in San Antonio it became about everything — about the second-round pick who turns out to be Manu Ginobili, the assistant coach who turns into Mike Budenholzer, the franchise that wakes up on a May morning in 2026 one win from a Western Conference Finals against a Thunder team that finished 64&ndash;18, owners of the NBA&rsquo;s best regular-season record, all of it accruing slowly, almost invisibly, until the rock cracks.</P>

        <StatBand />

        <PullQuote>The work comes first, and the recognition arrives, if at all, late and embarrassed.</PullQuote>

        {/* CHAPTER 01 */}
        <H2 id="ch1">The Return</H2>
        <ChapterRule num="01" />
        <Lead>The Spurs are home again. The question is how they ever left.</Lead>
        <P first="T">onight, in Oklahoma City, the rock is being struck again. Game 1 of the conference finals tips off in a few hours. The Spurs have done what almost no one believed possible eighteen months ago: built a 62-win team around a twenty-two-year-old Frenchman, won the season series 3&ndash;1 against a Thunder team that lost only eighteen games all year, and rebuilt a contender so fast that Sam Presti&rsquo;s blueprint in Oklahoma City — the one everybody was supposed to be copying — now appears to have been quietly mimicked back by the team Presti grew up inside.</P>

        {/* CHAPTER 02 */}
        <H2 id="ch2">The Owner</H2>
        <ChapterRule num="02" />
        <P first="T">o answer that you have to start, as so much about this organization starts, in 1993, when a Caterpillar dealer from Corpus Christi named Peter M. Holt walked into a meeting and bought the team for what would become, in retrospect, an act of municipal charity. He led a group of 22 local investors who purchased the franchise from Red McCombs for $75 million. The Spurs were threatening to leave San Antonio — the same way the Astros and the Rockets once threatened to leave Houston, the way half the NBA&rsquo;s smaller franchises seemed to threaten everything in the nineties. Holt was a Vietnam veteran (Silver Star, three Bronze Stars, Purple Heart, thirteen months as an infantryman through the Tet Offensive), the great-grandson of Benjamin Holt, who in 1904 had developed the first practical track-type tractor — a family that built the equipment that built America&rsquo;s roads. He had not come to San Antonio to be a sports baron. He had come, in his telling, because the team meant something to the city, and the city meant something to his family. He led the campaign that built the AT&amp;T Center through a 1999 ballot measure; the arena opened in 2002 and immediately became the cornerstone of a 250-employee operation that would, over the next two decades, win five NBA titles and be voted No. 1 in ESPN The Magazine&rsquo;s Ultimate Standings four times — in 2004, 2006, 2014, and 2015 — the only franchise to rank in the Top 10 every year since the list debuted in 2003.</P>
        <P>What Holt did with the team, having bought it, was the most radical thing an owner can do in American sport: he stayed out of the way. He hired Gregg Popovich as general manager in 1994 — Popovich, a small-college coach from Pomona-Pitzer with a master&rsquo;s in physical education and five years in the Air Force, who had bounced through Don Nelson&rsquo;s Golden State staff and somehow charmed his way into a chance to run the Spurs front office — and when Popovich fired Bob Hill and hired himself off the bench in 1996, Holt did not blink. When Popovich went 17&ndash;47 in his first season as coach, Holt did not blink. When the Spurs lucked into Tim Duncan in the 1997 lottery and the entire trajectory of the franchise pivoted on a single ping-pong ball, Holt did what good owners do, which is celebrate quietly and write checks. He stayed for twenty-three years. He retired in 2016 and handed the reins to his wife, Julianna. She handed them, in turn, to their son Peter J. Holt — at thirty-six, then the youngest controlling owner in the NBA — and he has spoken since about carrying a small replica golden key as a reminder of a credo his father gave him: <em style={{ color: C.silver }}>do the next right thing</em>. &ldquo;If I do the next right thing,&rdquo; he said in an interview last year, &ldquo;what our organization will get will be so much more than my wildest dreams.&rdquo;</P>
        <P>There is something almost embarrassing, in the modern NBA, about that kind of sentence. In an era of meddling tech billionaires and Twitter-active owners and franchises that turn over front offices the way other businesses turn over inventory, the Holts have been a kind of mute scaffolding. They have empowered basketball operations to make basketball decisions. They have spent into the luxury tax when it made sense and stayed beneath it when it didn&rsquo;t. They have kept the same general manager and the same coach in place for so long that the entire NBA has cycled through its leadership at least twice while San Antonio kept clocking in. When R. C. Buford was finally named Executive of the Year in 2014 — twelve seasons into his run as GM, four titles into the dynasty — he joked that he had only won because he had finally placed enough former staffers in GM jobs around the league to stuff the ballot box.</P>

        {/* CHAPTER 03 */}
        <H2 id="ch3">The Architect</H2>
        <ChapterRule num="03" />
        <P first="B">uford has been the franchise&rsquo;s quietest architect, the man behind the man behind the man. He came to San Antonio in 1988 as an assistant under Larry Brown, left for an assistant job at Florida under Lon Kruger, and was rehired by Popovich in 1994 to run scouting. By 1997, he had become director of scouting; by 1999, assistant GM; by 2002, GM. He won the same Executive of the Year award again in 2016. In 2019 he was promoted to CEO, and a forty-year-old former Pistons executive named Brian Wright took over the basketball operations. Above them now — though only in title, because no one really thinks of him as above anyone — sits Popovich, who at seventy-seven has stepped off the bench and assumed the role of President of Basketball Operations. At his introductory press conference in May 2025, two days after he stepped down following a stroke he suffered in the Frost Bank Center hours before tip-off against the Timberwolves on November 2, 2024, Popovich unzipped his jacket to reveal a shirt that read, simply, &ldquo;El Jefe.&rdquo; &ldquo;I&rsquo;m no longer coach,&rdquo; he said. &ldquo;I&rsquo;m El Jefe.&rdquo; It was meant to be a joke. It was also accurate.</P>

        {/* CHAPTER 04 */}
        <H2 id="ch4">Different Sidewalks</H2>
        <ChapterRule num="04" />
        <P first="W">hat the Holts and Buford and now Wright have built together is the longest stretch of competence in modern American team sports. Between 1989-90 and the 2018-19 season, the Spurs made the playoffs twenty-two consecutive years. They won at least fifty games in nineteen of Popovich&rsquo;s first twenty-two full seasons — a stretch nothing in any of the four major American leagues can match. They have had a winning record against every other franchise in the NBA. And nearly all of it has been built not through the top of the draft but through the second round, the late first, the scouting trip nobody else wanted to take, the international showcase nobody else cared about.</P>
        <P>This is where R. C. Buford&rsquo;s particular genius needs explaining, because in many ways the Spurs are a scouting story before they are anything else. Buford&rsquo;s eye for talent was always international and always unfashionable. He saw Tim Duncan early; that one was obvious. The next two were the trick. In 1999, with the 57th pick — the second-to-last selection in the draft — the Spurs called Manu Gin&oacute;bili&rsquo;s name, and Rod Thorn didn&rsquo;t know how to pronounce it. ESPN gave the Spurs a D for the night, noting cheerfully that they couldn&rsquo;t really evaluate the foreign picks because &ldquo;the boss won&rsquo;t spring for scouting trips to Europe.&rdquo; Two years later, in 2001, the Spurs took Tony Parker — a 6-foot-2 French point guard whom Popovich had not initially wanted — with the 28th pick. Buford had to make Popovich a second tape of Parker&rsquo;s best plays to convince him. &ldquo;Once Pop saw that Tony could do all the things he thought he couldn&rsquo;t do,&rdquo; Buford has said, &ldquo;he opened his eyes a little bit. The second time Tony worked with us, five minutes into training he pulled everyone aside and said, &lsquo;this guy is going to start the season with us.&rsquo;&rdquo; Parker started by the fifth game of his rookie year. Manu and Tony, the 28th and 57th picks, would become the second- and third-most important draft selections of an entire NBA era.</P>
        <DraftSlots />
        <P>The pattern compounded. Tiago Splitter at 28. George Hill at 26. Boris Diaw signed off the Charlotte Bobcats scrap heap in 2012. Patty Mills picked up after he was waived in Portland. Marco Belinelli, Nando de Colo, Aron Baynes, Cory Joseph — by the 2013-14 season, the Spurs entered training camp with ten international players on the roster, an NBA record. They were, in essence, a team that played a different game from the rest of the league because they had been built on different sidewalks. Pop&rsquo;s first language at home, when he wanted, was Serbian; he had toured Eastern Europe and the Soviet Union with the U.S. Armed Forces Basketball Team in the seventies. Buford had cut his teeth scouting overseas before anyone else cared. They had been spending in markets the NBA had abandoned, and the dividends were enormous.</P>

        {/* CHAPTER 05 */}
        <H2 id="ch5">Gotten Over Themselves</H2>
        <ChapterRule num="05" />
        <P first="T">he Spurs Way of personnel — and they would never call it that themselves, would in fact roll their eyes at the phrase — was built around something Popovich said in his blunt way to anyone who asked. &ldquo;We draft guys who have gotten over themselves.&rdquo; It was a flat sentence that contained an entire philosophy. The Spurs wanted players whose ego had been beaten out of them, by upbringing or by foreign leagues or by sliding to the second round of the draft. They wanted prospects whose competitive vanity had been replaced by something quieter and more durable. Tim Duncan, the No. 1 pick out of Wake Forest, was the platonic ideal of this — a man so famously unassuming that he asked David Robinson, the incumbent star, where he should park his car on the first day of training camp. Ginobili had been a 57th pick playing in Argentina and then in Italy. Parker had been a teenager nobody in America had seen play. By the time the Spurs got around to acquiring Kawhi Leonard, on draft night 2011, trading George Hill to Indiana for his rights, the model had become almost reflexive: take the player nobody else fully understands; let him learn under the men who learned before him.</P>
        <P>Robinson, the Naval Academy graduate who had served two years as a civil engineering officer before joining the league, was the first cornerstone — the Admiral, the franchise&rsquo;s first No. 1 overall pick in 1987, the MVP, the man who had broken his foot in 1996 in a season that had collapsed and delivered the lottery odds that produced Duncan. The thing about Robinson and Duncan was that they were never about handoff so much as about overlap. &ldquo;His skill set complemented mine perfectly,&rdquo; Robinson said years later. &ldquo;I saw it as an opportunity for us to really complement one another.&rdquo; When Duncan dominated him in early practices, Avery Johnson would later recall, Robinson &ldquo;snickered to himself,&rdquo; because the rookie was the help he had been waiting for. The Twin Towers won the title in 1999 in the lockout-shortened season, going 15-2 in the playoffs. They won again in 2003, with Robinson, thirty-seven and aching, going out on the last game of his career with thirteen points and seventeen rebounds and a championship trophy in his hands.</P>

        <PullQuote>We draft guys who have gotten over themselves.</PullQuote>

        {/* CHAPTER 06 */}
        <H2 id="ch6">Money on the Table</H2>
        <ChapterRule num="06" />
        <P first="T">he handoff to Duncan was the moment the franchise&rsquo;s character calcified. Duncan had no interest in being a star in the way the league understood stardom. He hated cameras. He wore baggy T-shirts to press conferences. He spoke in the slow, careful Caribbean cadence of his St. Croix youth and almost never said anything that produced a headline. He also, and this is the part the Spurs talk about more than anything else when they talk about culture, repeatedly left money on the table so the franchise could keep its rotation together. In 2012, he took an $11.5 million pay cut from his previous year&rsquo;s $21.16 million, signing a three-year, $30 million deal that dropped him from the third-highest-paid player in the league to the fourth-highest-paid player on his own team. The move kept the Spurs below the luxury tax, allowed them to re-sign Boris Diaw, Danny Green and Patty Mills, and add Nando De Colo. In 2015, he took another $5 million cut to help bring LaMarcus Aldridge to San Antonio. &ldquo;I took a little bit less money at certain points so that we could stay competitive,&rdquo; Duncan said years later. &ldquo;I don&rsquo;t care who was making what. The honest truth is I didn&rsquo;t really know from year to year what people were making.&rdquo;</P>
        <P>Steve Kerr, watching from afar as he tried to build his own Warriors dynasty, would later use Duncan&rsquo;s selflessness as the explicit template he asked Kevin Durant to follow. The pay cuts mattered, but they were a symptom, not a cause. The cause was a clubhouse environment Popovich had spent two decades cultivating, anchored by a Big Three who treated their salaries the way they treated their stat lines — as numbers that existed to serve a larger thing. Ginobili, perhaps the most creative offensive player of his generation, willingly came off the bench for years, won the 2007-08 Sixth Man of the Year award, and never, in the strict sense, became a full-time NBA starter. Parker organized the offense around whoever needed touches. They all bought into a system that asked them to be smaller than they were.</P>

        {/* CHAPTER 07 */}
        <H2 id="ch7">The Long Dinners</H2>
        <ChapterRule num="07" />
        <P first="W">hat lubricated all of this — and it sounds absurd when you write it down, but it is true — was food and wine. Popovich is one of the great American oenophiles. &ldquo;I have a hard time keeping my collection at fewer than 3,000 bottles,&rdquo; he once told <em>Wine Spectator</em>, describing the 240-square-foot stone structure behind his San Antonio home where he keeps the cellar. By the time Tony Parker arrived as a teenager, Pop was reading wine magazines on the team plane, and Parker, the son of a French father, was instantly conscripted into the team&rsquo;s gustatory life. The Spurs do not eat the way the rest of the NBA eats. They have a roving roster of restaurants — Spago in Beverly Hills, Il Gabbiano in Miami, Carbone in New York, the French Laundry in Yountville, August in New Orleans — where the entire team and coaching staff and front office descend for long, structured, multi-hour dinners that bear less resemblance to a postgame meal than to a wedding banquet. In Sacramento once, Jeremy Threat, the 29-year-old general manager and wine director of Spataro Restaurant &amp; Bar, &ldquo;called a nearby friend who possesses a deep cellar&rdquo; and hauled in about 120 bottles worth roughly $50,000 in total, building a 54-wine list in a single afternoon after hearing Pop might come by. Pop bounded around the room pouring for everyone and bought ten bottles to go.</P>
        <P>Even after the Spurs lost Game 6 of the 2013 Finals — Ray Allen&rsquo;s corner three, Manu&rsquo;s missed free throws, Tim&rsquo;s heartbreak — the entire organization went out to Il Gabbiano. &ldquo;We just have to keep pounding the rock,&rdquo; Matt Bonner told a reporter that night. They ate. They drank. The next year, they came back and dismantled the Heat in five games, shooting 52.8% from the field and averaging 25.4 assists per game in what came to be called the Beautiful Game — the apotheosis of the share-the-ball, .5-second offense Popovich had designed late in his career, an offense in which players were instructed to shoot, pass, or attack within half a second of catching the ball, and which Kawhi Leonard, then twenty-two, ran to a Finals MVP. The 2014 Spurs are the team players in their forties still talk about wistfully: Diaw and Mills and Splitter and Green and Belinelli, sharing the ball with such crisp economy that you could hear the gym breathe.</P>

        {/* CHAPTER 08 */}
        <H2 id="ch8">The High Tide</H2>
        <ChapterRule num="08" />
        <P first="T">hat was, in retrospect, the high tide. What came after has been the part of the story the franchise prefers not to dwell on, the part that complicates any easy hagiography. Duncan retired in 2016. Ginobili in 2018. Parker, in a contract dispute the Spurs declined to fight, left for Charlotte in 2018 — a quiet end to a Hall of Fame career that no one in San Antonio quite knew how to commemorate. And in between, in the painful summer of 2018, the Spurs lost Kawhi Leonard.</P>

        {/* CHAPTER 09 */}
        <H2 id="ch9">The Silence</H2>
        <ChapterRule num="09" />
        <P first="T">he Leonard breakup is the one thing the Spurs have never satisfactorily explained, and they will not, because the version they would tell would be uncharitable, and they do not do uncharitable. The bones of it are these: Leonard had been the perfect Spurs heir — quiet, low-maintenance, defensively obsessed, willing to be coached. In the 2017 Western Conference Finals he had stepped on Zaza Pachulia&rsquo;s foot and turned an ankle that would, depending on whom you believe, become either a serious quadriceps injury or a degenerative knee condition or both. He played nine games the entire 2017-18 season. The team&rsquo;s medical staff thought he could play. He did not trust the team&rsquo;s medical staff. His uncle Dennis Robertson — &ldquo;Uncle Dennis&rdquo; — eventually told Yahoo Sports that the relationship between Leonard&rsquo;s camp and the franchise &ldquo;couldn&rsquo;t recover.&rdquo; The breaking point, in the version Stephen Jackson and Danny Green and LaMarcus Aldridge later told on the <em>All The Smoke</em> podcast, was a national TV interview in which Tony Parker compared his own quad injury favorably to Leonard&rsquo;s. &ldquo;That pushed him right out the door,&rdquo; Jackson said. By July 2018, Leonard was a Raptor; by June 2019, he was a champion in Toronto with Finals MVP No. 2, and the Spurs were a team in slow decline.</P>
        <P>David Robinson, who has watched it all from the same seats in the building he helped open, has been one of the few to speak about it openly. &ldquo;If you want to be a top two or three player in the league, you got to be a leader,&rdquo; Robinson said. &ldquo;LeBron doesn&rsquo;t sit around and talk for him.&rdquo; It was, by Spurs standards, a stinging assessment. The thing about Leonard was not that he wanted to leave, but that he left the Spurs Way — by withdrawing, by silence, by refusing the franchise&rsquo;s expectation that you communicate, that you sit in the room, that you talk it out over wine. The franchise that had survived everything had not survived the absence of language.</P>
        <P>What followed was the longest stretch of basketball mediocrity the organization had known since the early nineties: six consecutive seasons without a playoff series win, four straight losing campaigns, the slow accumulation of veterans (DeRozan, Aldridge) who never quite fit and could never quite be moved for value. Popovich, who had built his career on a particular blend of structure and improvisation, found himself coaching teams that could not execute. &ldquo;Inexcusable. Youth&rsquo;s got nothing to do with it,&rdquo; he snapped after a 2023 loss. &ldquo;We have no one on the basketball team who sets the example for anyone else on the defensive end.&rdquo; It was a rare admission, almost cruel, and it told you how much the rock had stopped cracking.</P>

        <EraRibbon />

        {/* CHAPTER 10 */}
        <H2 id="ch10">The Rock, Again</H2>
        <ChapterRule num="10" />
        <P first="A">nd yet — and this is the part that begins to feel like myth — the franchise that has spent two decades preaching the gospel of patience was rewarded for its own patience, exactly the way Jacob Riis would have liked. On May 16, 2023, the Spurs won the draft lottery, beating the field at 14% odds tied identically with the Detroit Pistons and Houston Rockets — all three teams having finished with the NBA&rsquo;s worst records — and a few weeks later they took a 7-foot-4 Frenchman named Victor Wembanyama who had been one of the most anticipated prospects in NBA history. The next year, Wembanyama won Rookie of the Year. The year after that, with the No. 4 pick, the Spurs took a UConn guard named Stephon Castle, who promptly won Rookie of the Year himself. This past June, with the No. 2 pick, they took Dylan Harper out of Rutgers — the son of NBA champion Ron Harper, a 6-foot-6 do-it-all guard — and three months later they extended the gambit by trading for De&rsquo;Aaron Fox, the All-Star point guard who, watching the Sacramento Kings dynamic disintegrate from his hotel room in Minneapolis in February 2025, had told his agent the Spurs were the only team on his list.</P>
        <P>If you tilt your head and squint, what you see in the room at San Antonio&rsquo;s practice facility right now is the entire history of the franchise compressed into a single hallway. Wembanyama, at twenty-two, has the locker that once belonged to Duncan; he occasionally bumps into Duncan himself, who still keeps a space at the building and shows up most days. Manu Ginobili, officially listed as a special adviser to basketball operations, walks the corridors and sometimes pulls Harper, a fellow lefty, into a side gym to work on counters. Bruce Bowen eats lunch with Sean Elliott. David Robinson sits in Peter J. Holt&rsquo;s box at home games in a Spurs T-shirt and a baseball cap, half-incognito. Chris Paul, in what amounts to a one-year residency as the team&rsquo;s veteran point guard, has spent the season tutoring Castle and Fox in the small mechanical things — how to read screens, how to pull the rope on defensive rotations, how to lose a game without losing the locker room — and the young players have absorbed it like seminarians.</P>
        <P>And Popovich, who used to be unable to sit through a film session without yelling, now floats through the building like a benevolent specter. Mitch Johnson, the new head coach — a thirty-nine-year-old former Stanford point guard who never made an NBA roster and who was promoted from the Austin G-League affiliate to the Spurs bench in 2019, then to interim head coach in November 2024 when Pop collapsed before tipoff, and then to permanent head coach on May 2, 2025 — has the daily authority now. But Pop is on the phone with Carter Bryant, the rookie wing, three times a week. He texts Keldon Johnson every day. Devin Vassell goes looking for him after shootaround. When the Spurs returned home from Minneapolis after Wembanyama elbowed Naz Reid and was ejected in Game 4 of the second-round series, Pop was waiting on the tarmac in a black Nike sweatsuit, arms behind his back, talking quietly to Wembanyama on the runway. Wembanyama listened the way the entire franchise has always listened. &ldquo;When he speaks,&rdquo; he said afterward, &ldquo;everybody listens.&rdquo;</P>

        {/* CHAPTER 11 */}
        <H2 id="ch11">The Diaspora</H2>
        <ChapterRule num="11" />
        <P first="T">his is the secret of the Spurs that no one quite captures when they try to write the team into a management book: the franchise has always run on relationships, and relationships are slow. Popovich&rsquo;s coaching tree is, by now, almost laughably extensive — eleven NBA head coaches have served on his Spurs staff alone, with Mike Budenholzer (Hawks, Bucks, Suns) winning the 2021 title in Milwaukee, Mike Brown (Cavs, Lakers, Kings) twice winning Coach of the Year, Ime Udoka taking the 2022 Celtics to the Finals, Brett Brown rebuilding the Sixers, James Borrego getting the Hornets above water, Will Hardy now running the Jazz rebuild, and P.J. Carlesimo, Jacque Vaughn, Jim Boylen, Joe Prunty and now Johnson all sitting in chairs they would never have reached without Popovich. Pop&rsquo;s former players — Steve Kerr, Doc Rivers, Monty Williams, Avery Johnson, Vinny Del Negro — have produced their own coaching tree on top of that. Becky Hammon, whom Popovich hired in 2014 as the first full-time female assistant coach in any major American sport, has now won two WNBA championships with the Las Vegas Aces. Sam Presti, who started in the Spurs video room, runs the Thunder team the Spurs play tonight, in what amounts to an Oedipal grudge match between a son and a father who would deny the parentage. Sean Marks runs the Nets. Dennis Lindsey ran the Jazz. Rob Hennigan ran the Magic. Kevin Pritchard runs the Pacers. Danny Ferry ran the Hawks. Landry Fields runs the Hawks now. The diaspora is dizzying. There are NBA front offices and coaching staffs in 2026 that consist, almost entirely, of people who once organized scouting reports for Pop in a windowless room in a San Antonio practice facility.</P>
        <CoachingTree />
        <P>What is the through line? Why do Popovich&rsquo;s people, again and again, succeed in the league at rates that no other coaching tree can match? The answer is partly tactical — they all run versions of the same motion-heavy, .5-second offense and the same drop-coverage defense — but it is mostly cultural. Popovich does not micromanage his assistants. He gives them entire practices to run. He puts them in charge of player development. He sends them into the locker room to deliver bad news. &ldquo;He&rsquo;s a giver,&rdquo; Rick Carlisle said last year. &ldquo;He understood at that time that was something that would lift me up.&rdquo; The assistants, when they get their head jobs, already know how to be the boss because they have been the boss in pieces for years. They have also been forced to argue with Popovich, who according to Udoka &ldquo;wants conflict, wants different ideas.&rdquo; When Becky Hammon was an assistant, Udoka said, she would &ldquo;state her opinion, and stick firm to it.&rdquo; That was the requirement. Everyone on the bench, by the time they leave, has internalized the idea that the coach&rsquo;s first job is to be honest. &ldquo;For us, the thing that works best,&rdquo; Popovich has said many times, &ldquo;is total, brutal, between-the-eyes honesty. I never try to trick a player or manipulate them, tell them something that I&rsquo;m going to have to change next week.&rdquo;</P>
        <P>The brutality is real. Ask anyone who has played for him. Richard Jefferson once said that &ldquo;Pop didn&rsquo;t care if you averaged 20 points a game. If you went under a screen that you weren&rsquo;t supposed to, he was calling a timeout, cussing you out, and probably sitting you down.&rdquo; Tony Parker has said that in his first few weeks with the Spurs he thought Pop hated him. Tim Duncan was screamed at like a backup. But the brutality is paired with something else, something rarer, which is that Popovich actually pays attention. He asks players about their families. He learns the names of their parents. He picks restaurants based on what he has heard a player ate growing up. Michael Mina, the Michelin-starred chef, has said that the first time he watched Pop work with his team at his San Francisco restaurant, he expected a drill sergeant, and instead saw &ldquo;how gentle he was, and how it was about educating in a much different way.&rdquo; Ettore Messina, who left a celebrated career in Europe to become a Spurs assistant, called it &ldquo;his demanding nature with the most sincere care for everyone within the organization.&rdquo; Pop&rsquo;s own description has the gloss of self-parody: &ldquo;Our method is usually tough love. Give them a clear picture of what&rsquo;s demanded and needed, and then show the care and concern after that. And if that doesn&rsquo;t get through, get rid of them.&rdquo;</P>

        {/* CHAPTER 12 */}
        <H2 id="ch12">The Transmission</H2>
        <ChapterRule num="12" />
        <P first="I">t is this combination — the truth-telling and the wine cellar and the family questions and the public dressing-down — that makes the Spurs Way more than a slogan. It is a way of being inside a building. And it is the thing the franchise is now, with great care and obvious risk, trying to transmit to Wembanyama and Castle and Harper without the man who built it standing on the sideline.</P>
        <P>You can see them trying. Brian Wright, the GM, has said in interviews that the team is not chasing a specific timeline. &ldquo;We want to be a team that wins a title,&rdquo; he told a French sports outlet last summer. &ldquo;We&rsquo;ve done it before, we know what it looks like, the work that requires. If we keep going this way, results will come.&rdquo; When the Spurs traded for Fox, they did so without surrendering Castle, without surrendering Harper, without surrendering the picks they would later use on Carter Bryant; they let Sacramento and Chicago do most of the bleeding. When the trade deadline came in February of this year, they made no move at all, even as Wembanyama and Harper and Castle and Fox were lighting up the league and contenders were calling. &ldquo;Just his poise, the sense of urgency he brings to the game, the level of attention to detail,&rdquo; Julian Champagnie said of Fox in Wright&rsquo;s quietest acquisition. &ldquo;As young players, we all need that. We look at him, we&rsquo;re like, &lsquo;Alright, what do we do?&rsquo;&rdquo;</P>
        <P>The risks are real, of course. The post-Duncan years showed that the franchise can rust, that the muscles of a winning culture atrophy when winning stops. The Leonard departure showed that the language the Spurs use does not always reach the players they need it to reach. The 2024-25 season, in which Popovich coached only five games before his stroke, exposed how fully the organization had been arranged around one man&rsquo;s nervous system. And there is still the unresolved question of what happens when Pop is no longer in the building at all — when his phone calls to Carter Bryant stop, when his texts to Keldon Johnson stop, when David Robinson and Tim Duncan are no longer young enough to swing by practice and ask after the kids. The Spurs have always insisted that the culture is bigger than any individual. They have never, in fact, been tested on that proposition.</P>

        {/* CHAPTER 13 */}
        <H2 id="ch13">The Long Game</H2>
        <ChapterRule num="13" />
        <P first="B">ut tonight, in Oklahoma City, the test is the one the franchise has been preparing for since 1996. The Thunder are the defending champions, deeper than the Spurs, more experienced, with the reigning MVP in Shai Gilgeous-Alexander and the best supporting cast in the league. They lost only four games to one team all year, and that team was the Spurs. Wembanyama, the Defensive Player of the Year, will spend the series being switched onto and away from in every conceivable scheme; the Thunder will throw Chet Holmgren and Lu Dort and Jalen Williams and Alex Caruso at him in waves. De&rsquo;Aaron Fox, the veteran fulcrum, is questionable for Game 1 with ankle soreness. Whatever happens in the series, it will be a generational handoff in real time, a kind of basketball anthropology: the Thunder built in the Spurs&rsquo; image, playing against the Spurs themselves, both teams now constructed around defense and ball movement and patient development and the absolute primacy of the long game.</P>
        <P>Up in the rafters of Frost Bank Center, the new banner reads POP 1,390. Out in the practice gym, Ginobili shows Harper a left-handed counter. In the executive suite, Peter J. Holt fingers his replica golden key and tries to do the next right thing. In the front office, Brian Wright stares at the picks he hoarded and the picks he traded and the picks he kept in reserve. And somewhere on the team plane, in the seat he has occupied for thirty years, a seventy-seven-year-old man with the title of El Jefe and the freight of an entire institution is reading a wine magazine, the way he was reading one the first time Tony Parker flew with him. The work goes on. The rock does not crack on any one blow. It cracks, eventually, because someone has been hammering for a very long time, and someone else has been hammering, and someone else, and the men with the hammers all know what the rock looks like, and what the hammer is for, and what to do when the hundred and first blow finally falls.</P>

        <Capstone />
        <FranchiseTimeline />
        <Ledger />

        <PullQuote>The rock does not crack on any one blow.</PullQuote>

        <FadeIn>
          <div style={{
            fontFamily: "var(--ds-display)",
            fontSize: 22,
            lineHeight: 1.45,
            color: C.muted,
            fontStyle: "italic",
            textAlign: "center",
            margin: "30px 0 0",
            padding: "34px 0 10px",
            borderTop: "1px solid " + C.faint
          }}>
            They raised it on a quiet weeknight.<br />
            <span style={{ color: C.gold }}>By morning it had always been there.</span>
          </div>
        </FadeIn>

      </main>
    </div>
  );
}
