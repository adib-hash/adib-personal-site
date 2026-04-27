import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine
} from "recharts";

// ==================== DATA ====================

const chapters = [
  { id: "ch0", num: "00", short: "Breakdown", title: "How GE Broke" },
  { id: "ch1", num: "01", short: "Wreckage", title: "The Wreckage" },
  { id: "ch2", num: "02", short: "Triage",   title: "Triage" },
  { id: "ch3", num: "03", short: "Breakup",  title: "The Breakup" },
  { id: "ch4", num: "04", short: "Machine",  title: "The Machine" },
  { id: "ch5", num: "05", short: "Payoff",   title: "The Payoff" },
  { id: "ch6", num: "06", short: "Comp",     title: "The $300M Question" },
  { id: "ch7", num: "07", short: "Playbook", title: "The Playbook" },
  { id: "ge-sources", num: "",   short: "Sources",  title: "Sources" }
];

const finData = [
  { year: "2019", revenue: 21.3, fcf: 2.3 },
  { year: "2020", revenue: 18.0, fcf: 0.6 },
  { year: "2021", revenue: 21.3, fcf: 5.1 },
  { year: "2022", revenue: 26.1, fcf: 4.8 },
  { year: "2023", revenue: 32.0, fcf: 4.7 },
  { year: "2024", revenue: 35.1, fcf: 6.2 },
  { year: "2025", revenue: 42.3, fcf: 7.7 }
];

const debtD = [
  { year: "'17", debt: 134.6 },
  { year: "'18", debt: 109.9 },
  { year: "'19", debt: 90.9 },
  { year: "'20", debt: 74.3 },
  { year: "'21", debt: 40 },
  { year: "'22", debt: 28 },
  { year: "'23", debt: 22 },
  { year: "'24", debt: 21 },
  { year: "'25", debt: 20.5 }
];

const stockD = [
  { y: "2000", ge: 60,  sp: 100 },
  { y: "2004", ge: 37,  sp: 96  },
  { y: "2007", ge: 42,  sp: 130 },
  { y: "2009", ge: 10,  sp: 80  },
  { y: "2013", ge: 28,  sp: 160 },
  { y: "2016", ge: 32,  sp: 195 },
  { y: "2017", ge: 18,  sp: 225 },
  { y: "2018", ge: 8,   sp: 230 },
  { y: "2019", ge: 11,  sp: 275 },
  { y: "2020", ge: 9,   sp: 310 },
  { y: "2021", ge: 76,  sp: 395 },
  { y: "2022", ge: 67,  sp: 340 },
  { y: "2023", ge: 131, sp: 410 },
  { y: "2024", ge: 175, sp: 490 },
  { y: "2025", ge: 280, sp: 520 }
];

const compTimeline = [
  { y: "2018", comp: 0,    stock: 8,   event: "Hired Oct 1" },
  { y: "2019", comp: 23.6, stock: 11,  event: "" },
  { y: "2020", comp: 73.2, stock: 9,   event: "Grant reset" },
  { y: "2021", comp: 22.7, stock: 76,  event: "SOP fails 42%" },
  { y: "2022", comp: 8.2,  stock: 67,  event: "Equity cut to $5M" },
  { y: "2023", comp: 13.7, stock: 131, event: "SOP recovers 94%" },
  { y: "2024", comp: 87.6, stock: 175, event: "#2 S&P 500 CEO" },
  { y: "2025", comp: 0,    stock: 280, event: "$584M ownership" }
];

const empireData = [
  { name: "Aviation",     v2000: 24, v2024: 42, status: "kept" },
  { name: "Power",        v2000: 18, v2024: 0,  status: "spun" },
  { name: "Healthcare",   v2000: 14, v2024: 0,  status: "spun" },
  { name: "Capital",      v2000: 65, v2024: 0,  status: "sold" },
  { name: "NBC/Media",    v2000: 13, v2024: 0,  status: "sold" },
  { name: "Plastics",     v2000: 7,  v2024: 0,  status: "sold" },
  { name: "Other Ind.",   v2000: 15, v2024: 0,  status: "sold" }
];

const timelineEvents = [
  { yr: "2018", d: "Jun 26", text: "Removed from DJIA",               phase: "crisis" },
  { yr: "2018", d: "Oct 1",  text: "Culp appointed CEO",              phase: "pivot"  },
  { yr: "2018", d: "Oct 2",  text: "S&P downgrades to BBB+",          phase: "crisis" },
  { yr: "2018", d: "Oct 30", text: "Dividend slashed 92%; $22B writedown", phase: "pivot" },
  { yr: "2019", d: "Feb",    text: "BioPharma sale announced ($21.4B)", phase: "deal"   },
  { yr: "2019", d: "Dec",    text: "FCF turns positive: $2.3B",       phase: "win"    },
  { yr: "2020", d: "Mar",    text: "COVID: Aviation cuts begin",      phase: "crisis" },
  { yr: "2020", d: "Dec",    text: "$0.6B FCF; $4.4B in Q4 alone",    phase: "win"    },
  { yr: "2021", d: "Mar",    text: "GECAS sold to AerCap ($30B+)",    phase: "deal"   },
  { yr: "2021", d: "Nov 9",  text: "Three-way breakup announced",     phase: "pivot"  },
  { yr: "2023", d: "Jan 4",  text: "GE HealthCare begins trading",    phase: "deal"   },
  { yr: "2024", d: "Apr 2",  text: "GE Vernova spins off",            phase: "deal"   },
  { yr: "2025", d: "Feb",    text: "Moody's upgrades to A3",          phase: "win"    },
  { yr: "2025", d: "Mar",    text: "S&P upgrades to A-",              phase: "win"    },
  { yr: "2025", d: "Dec",    text: "FY25: $7.7B FCF, $190B backlog",  phase: "win"    },
  { yr: "2026", d: "Feb",    text: "Moody's upgrades to A2",          phase: "win"    }
];

const fdResults = [
  { site: "On Wing Support",    metric: "LEAP capacity",         from: "base", to: "+170%", ref: 27 },
  { site: "Celma, Brazil",      metric: "CFM56 fan cell TAT",    from: "68d",  to: "46d",   ref: 28 },
  { site: "Celma, Brazil",      metric: "LPT blade repair",      from: "base", to: "-58%",  ref: 28 },
  { site: "Pomigliano, Italy",  metric: "Issues cleared",        from: "---",  to: "2,000+", ref: 29 },
  { site: "Terre Haute, IN",    metric: "On-time delivery",      from: "20%",  to: "up*",   ref: 30 }
];

const playbookLessons = [
  {
    n: "01",
    title: "Sequence matters more than speed",
    body: "Culp didn't try to do everything at once. He triaged first (dividend cut, asset sales, cash preservation), restructured second with the three-way breakup, and only then layered FLIGHT DECK on top at scale. Each phase made the next one possible. Try to roll out lean while the balance sheet is on fire and you fail. Sell assets without a plan for what remains and you destroy value. The order was the whole strategy."
  },
  {
    n: "02",
    title: "Kill the conglomerate discount",
    body: "GE's three businesses had different capital needs, different cycles, and different investor bases. Stapling them together produced a discount that cost shareholders tens of billions. Apart, GE Aerospace, GE Vernova, and GE HealthCare are worth over $600B combined. If your conglomerate structure isn't creating value, it's quietly destroying it, and no amount of synergy talk on an investor day will change the math."
  },
  {
    n: "03",
    title: "Operating systems beat heroics",
    body: "GE's Six Sigma culture was tool-centric and expert-driven. It produced quarter-end heroics: last-minute scrambles to hit the number. FLIGHT DECK replaced that with small daily improvements by everyone. The most important word in lean is everyone. If only the Black Belts do the improving, you get a portfolio of projects. If the whole factory does it, you get a culture. Breaking GE Aerospace into 30 P&Ls is what made that possible: real accountability and real visibility at every level."
  },
  {
    n: "04",
    title: "Pay for transformation, but expect scrutiny",
    body: "Culp's comp was designed to pay generationally if he produced a generational outcome. It did, and he was. But the 2020 baseline reset is the part that still bothers me. Even a well-designed plan can blow up its own optics when the board moves the goalposts mid-game. The 2021 say-on-pay defeat forced real governance changes. The takeaway for boards: design incentives that hold up under scrutiny, not just ones that pay out when the numbers come in."
  },
  {
    n: "05",
    title: "The best turnaround CEO is a builder, not a cutter",
    body: "Culp cut the dividend, cut the workforce, sold assets, paid down debt. None of that was the turnaround. Those were prerequisites. The turnaround was FLIGHT DECK: teaching people to improve their own processes, letting factory workers actually solve problems, plowing a billion a year back into the MRO network, building a $190B backlog. The good turnaround CEOs don't just shrink a company into profitability. They leave behind operating capabilities the next decade can grow into."
  }
];

const sources = [
  { n: 1,  title: "GE Q3 2018 Earnings",               pub: "Div cut, $22B writedown",       url: "https://www.ge.com/news/press-releases/ge-announces-third-quarter-2018-results" },
  { n: 2,  title: "GE 8-K: LTC Shortfall",             pub: "$15B plan, $9.5B charge",       url: "https://www.sec.gov/Archives/edgar/data/0000040545/000004054518000003/ge8-k011618.htm" },
  { n: 3,  title: "GE Removed from DJIA",              pub: "CNBC, Jun 2018",                url: "https://www.cnbc.com/2018/06/19/walgreens-replacing-ge-on-the-dow.html" },
  { n: 4,  title: "BioPharma Sale ($21.4B)",           pub: "GE Press, Feb 2019",            url: "https://www.ge.com/news/press-releases/ge-sell-biopharma-business-danaher-214-billion" },
  { n: 5,  title: "GE 2020 10-K",                      pub: "FCF data 2019-2020",            url: "https://www.sec.gov/Archives/edgar/data/0000040545/000004054521000011/ge-20201231.htm" },
  { n: 6,  title: "COVID Cuts",                        pub: "Washington Post, Mar 2020",     url: "https://www.washingtonpost.com/business/2020/03/23/ge-aviation-coronavirus-layoffs/" },
  { n: 7,  title: "Cuts Expand",                       pub: "CNN, May 2020",                 url: "https://www.cnn.com/2020/05/04/business/ge-aviation-job-cuts/index.html" },
  { n: 8,  title: "GECAS/AerCap Close",                pub: "BusinessWire",                  url: "https://www.businesswire.com/news/home/20211101005451/en/" },
  { n: 9,  title: "Breakup Announced",                 pub: "CNBC, Nov 2021",                url: "https://www.cnbc.com/2021/11/09/ge-to-break-up-into-3-companies-focusing-on-aviation-healthcare-and-energy.html" },
  { n: 10, title: "Q4 2021 Earnings",                  pub: "FCF $5.1B",                     url: "https://www.sec.gov/Archives/edgar/data/40545/000004054522000002/ge4q2021earningsrelease.htm" },
  { n: 11, title: "Q4 2022 Earnings",                  pub: "FCF $4.8B",                     url: "https://www.sec.gov/Archives/edgar/data/40545/000004054523000019/ge4q2022earningsrelease.htm" },
  { n: 12, title: "GEHC Spinoff",                      pub: "GE Press, Jan 2023",            url: "https://www.ge.com/news/press-releases/ge-completes-separation-of-ge-healthcare" },
  { n: 13, title: "GEV Spinoff",                       pub: "GEV Press, Apr 2024",           url: "https://www.gevernova.com/news/press-releases/ge-vernova-completes-spin-off-begins-trading-new-york-stock-exchange" },
  { n: 14, title: "Q4 2024 Earnings",                  pub: "Op profit $7.3B",               url: "https://www.sec.gov/Archives/edgar/data/0000040545/000004054525000009/ge4q2024earningsrelease.htm" },
  { n: 15, title: "Q4 2025 Earnings",                  pub: "Rev $42.3B, FCF $7.7B",         url: "https://www.sec.gov/Archives/edgar/data/0000040545/000004054526000005/ge4q2025earningsrelease.htm" },
  { n: 16, title: "Culp Initial Comp",                 pub: "CNBC, Oct 2018",                url: "https://www.cnbc.com/2018/10/05/new-ge-ceo-larry-culp-inks-stock-heavy-contract-worth-up-to-300-million-if-shares-soar.html" },
  { n: 17, title: "Comp Modification 8-K",             pub: "Baseline $6.67",                url: "https://www.sec.gov/Archives/edgar/data/0000040545/000095014220002072/eh2001095_8k.htm" },
  { n: 18, title: "Say-on-Pay (2021)",                 pub: "42.0% in favor",                url: "https://www.sec.gov/Archives/edgar/data/0000040545/000004054521000030/ge-20210504.htm" },
  { n: 19, title: "ISS / Glass Lewis",                 pub: "Bloomberg",                     url: "https://www.bloomberg.com/news/articles/2021-04-16/ge-ceo-s-232-million-pay-deal-draws-fire-from-glass-lewis-iss" },
  { n: 20, title: "Extension 8-K",                     pub: "Through Dec 2027",              url: "https://www.sec.gov/Archives/edgar/data/40545/000095014224001825/eh240502380_8k.htm" },
  { n: 21, title: "DEF 14A Proxy",                     pub: "FY2024 comp $87.6M",            url: "https://www.sec.gov/Archives/edgar/data/0000040545/000130817925000114/ge4356871-def14a.htm" },
  { n: 22, title: "2025 Meeting Results",              pub: "SOP 70.9%",                     url: "https://www.geaerospace.com/sites/default/files/2025-geaerospace-annual-meeting-results.pdf" },
  { n: 23, title: "Moody's A3",                        pub: "Feb 2025",                      url: "https://cbonds.com/news/3270281/" },
  { n: 24, title: "S&P A-",                            pub: "Mar 2025",                      url: "https://cbonds.com/news/3328439/" },
  { n: 25, title: "Moody's A2",                        pub: "Feb 2026",                      url: "https://www.investing.com/news/stock-market-news/moodys-upgrades-ge-aerospace-senior-unsecured-ratings-to-a2-93CH-4479497" },
  { n: 26, title: "Culp AME Speech",                   pub: "Shingijutsu, kaizen",           url: "https://www.leanblog.org/2022/11/insights-ge-ceo-larry-culp-speech-ame-dallas/" },
  { n: 27, title: "OWS FLIGHT DECK",                   pub: "+170% capacity",                url: "https://www.geaerospace.com/news/articles/move-fast-and-fix-things-how-ge-aerospaces-wing-support-team-using-flight-deck-repair-cfm" },
  { n: 28, title: "Celma Brazil",                      pub: "CFM56 TAT 68 to 46d",           url: "https://www.geaerospace.com/news/articles/turnaround-story-overhaul-and-repair-shop-brazil-flight-deck-driving-cultural" },
  { n: 29, title: "Pomigliano Italy",                  pub: "2,000+ issues",                 url: "https://www.geaerospace.com/news/articles/people-product/smooth-running-machine-lean-techniques-help-ge-aerospace-plant-italy-find" },
  { n: 30, title: "Culp 2025 Letter",                  pub: "FLIGHT DECK",                   url: "https://www.leanblog.org/2026/02/larry-culp-ge-aerospace-lean-leadership/" },
  { n: 31, title: "Fortune Profile",                   pub: "Culp, Jan 2024",                url: "https://fortune.com/2024/01/26/ge-ceo-larry-culp-turnaround-stock-performance-outlook/" },
  { n: 32, title: "S&P Downgrade",                     pub: "CNBC, Oct 2018",                url: "https://www.cnbc.com/2018/10/02/ge-credit-rating-under-review-for-possible-downgrade-moodys.html" },
  { n: 34, title: "Flannery Div Cut",                  pub: "Nov 2017",                      url: "https://www.ge.com/news/press-releases/ge-plans-reduce-quarterly-dividend-conjunction-revised-capital-allocation-framework" }
];

// ==================== DESIGN SYSTEM ====================

const C = {
  bg:       "#0a0d11",   // cool graphite, near-black with slight blue tint
  surface:  "#0d1117",
  card:     "#101419",
  cardH:    "#161c24",
  accent:   "#6aa8c9",   // HUD blue-cyan — cockpit instrument glow
  accent2:  "#9cc9e0",   // brighter HUD highlight
  gold:     "#9cc9e0",   // (was site gold — remapped to HUD highlight)
  pos:      "#7ec8a9",   // cool sage green for positive data
  neg:      "#d97060",   // muted red for negative data
  blue:     "#8a9ab0",   // cool steel neutral
  slate:    "#8892a0",
  text:     "#e8ecf2",
  dim:      "#97a1ae",
  muted:    "#8892a0",
  faint:    "#1a2029",
  border:   "#1d2530",
  glow:     "rgba(106,168,201,0.07)"
};

// ==================== GLOBAL COMPONENTS ====================

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
      background: "linear-gradient(90deg, " + C.accent + " 0%, " + C.accent2 + " 100%)",
      transition: "width 0.1s linear",
      pointerEvents: "none"
    }} />
  );
}

// Brushed-metal-ish grain: lower baseFrequency, gentle, feels like machined surface
function MetalGrain() {
  return (
    <div aria-hidden="true" style={{
      position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none",
      opacity: 0.05,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='280' height='280' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      backgroundRepeat: "repeat",
      mixBlendMode: "overlay"
    }} />
  );
}

// ==================== PRIMITIVES ====================

function FadeIn({ children, delay, threshold }) {
  var [vis, setVis] = useState(false);
  var ref = useRef();
  useEffect(function() {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(
      function(entries) {
        if (entries[0].isIntersecting) { setVis(true); obs.disconnect(); }
      },
      { threshold: threshold || 0.08 }
    );
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);
  var d = delay || 0;
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(22px)",
      transition: "opacity 0.72s cubic-bezier(0.16,1,0.3,1) " + d + "s, transform 0.72s cubic-bezier(0.16,1,0.3,1) " + d + "s"
    }}>
      {children}
    </div>
  );
}

function HeroReveal({ children, delay }) {
  var [vis, setVis] = useState(false);
  useEffect(function() {
    var t = setTimeout(function() { setVis(true); }, delay || 0);
    return function() { clearTimeout(t); };
  }, [delay]);
  return (
    <div style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1)"
    }}>
      {children}
    </div>
  );
}

// Body paragraph
function P({ children }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--ge-serif)", fontSize: 18,
        lineHeight: 1.84, color: C.dim, margin: "0 0 26px"
      }}>
        {children}
      </p>
    </FadeIn>
  );
}

// Editorial callout — HUD blue tint, no left stripe, full width
function Ed({ children }) {
  return (
    <FadeIn>
      <div style={{
        margin: "0 0 28px",
        padding: "20px 26px",
        background: "rgba(106,168,201,0.075)",
        borderRadius: 10,
        border: "1px solid rgba(106,168,201,0.18)",
        fontFamily: "var(--ge-serif)",
        fontSize: 17,
        lineHeight: 1.92,
        color: C.dim,
        fontStyle: "italic"
      }}>
        {children}
      </div>
    </FadeIn>
  );
}

// Reference superscript — scrolls to sources
function Rf({ n }) {
  return (
    <sup
      style={{
        color: C.accent, fontSize: 9, cursor: "pointer",
        fontFamily: "var(--ge-mono)", fontWeight: 600, opacity: 0.7, marginLeft: 2
      }}
      onClick={function() {
        var el = document.getElementById("ge-sources");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }}
    >{"[" + n + "]"}</sup>
  );
}

// Inline emphasis colors
function B({ children }) { return <span style={{ color: C.text, fontWeight: 600 }}>{children}</span>; }
function A({ children }) { return <span style={{ color: C.accent, fontWeight: 600 }}>{children}</span>; }
function G({ children }) { return <span style={{ color: C.gold, fontWeight: 600 }}>{children}</span>; }
function Rd({ children }) { return <span style={{ color: C.neg, fontWeight: 600 }}>{children}</span>; }
function Gn({ children }) { return <span style={{ color: C.pos, fontWeight: 600 }}>{children}</span>; }

// Chapter heading with ghost number depth
function H2({ children, num, sub }) {
  return (
    <FadeIn>
      <div style={{ margin: "96px 0 36px", position: "relative" }}>
        <div style={{
          position: "absolute", top: -58, left: -14,
          fontFamily: "var(--ge-display)",
          fontSize: 160, fontWeight: 900,
          color: "rgba(106,168,201,0.055)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
          letterSpacing: "-0.04em"
        }}>{num}</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent,
            letterSpacing: "0.32em", marginBottom: 14,
            textTransform: "uppercase", fontWeight: 500
          }}>{"Chapter " + num}</div>
          <h2 style={{
            fontFamily: "var(--ge-display)", fontSize: "clamp(30px, 4.2vw, 44px)",
            fontWeight: 600, color: C.text, margin: 0,
            lineHeight: 1.1, letterSpacing: "-0.015em",
            fontVariationSettings: "'opsz' 144, 'SOFT' 25"
          }}>{children}</h2>
          {sub && (
            <p style={{
              fontFamily: "var(--ge-serif)", fontSize: 15, color: C.muted,
              margin: "12px 0 0", fontStyle: "italic", maxWidth: 640
            }}>{sub}</p>
          )}
          <div style={{ width: 44, height: 1, background: C.accent + "aa", marginTop: 22 }} />
        </div>
      </div>
    </FadeIn>
  );
}

// Recharts tooltip
function Tip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: C.card, border: "1px solid " + C.border,
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 16px 48px rgba(0,0,0,.75)"
    }}>
      <div style={{ color: C.muted, fontSize: 10, fontFamily: "var(--ge-mono)", marginBottom: 6, letterSpacing: "0.08em" }}>{label}</div>
      {payload.map(function(p, i) {
        var v = p.value;
        var fmt = typeof v === "number" ? (v < 10 ? v.toFixed(2) : v.toFixed(1)) : v;
        return (
          <div key={i} style={{ color: p.color || C.text, fontSize: 12, fontFamily: "var(--ge-sans)", fontWeight: 500 }}>
            {p.name}: <strong>{fmt}</strong>
          </div>
        );
      })}
    </div>
  );
}

// Quote block — large decorative mark, no left stripe, centered & narrower
function Quote({ author, role, children }) {
  var [hov, setHov] = useState(false);
  return (
    <FadeIn>
      <div
        onMouseEnter={function() { setHov(true); }}
        onMouseLeave={function() { setHov(false); }}
        style={{
          margin: "40px auto",
          padding: "34px 34px 28px",
          background: hov ? C.cardH : C.card,
          borderRadius: 12,
          border: "1px solid " + (hov ? C.accent + "55" : C.border),
          position: "relative", overflow: "hidden",
          maxWidth: 760,
          transition: "background 0.25s, border-color 0.25s"
        }}
      >
        <div style={{
          position: "absolute", top: -8, left: 22,
          fontFamily: "var(--ge-display)", fontSize: 132, fontWeight: 900,
          color: C.accent + "1c", lineHeight: 1,
          pointerEvents: "none", userSelect: "none", fontStyle: "italic"
        }}>&ldquo;</div>
        <div style={{ position: "relative" }}>
          <div style={{
            fontFamily: "var(--ge-display)", fontSize: 21,
            lineHeight: 1.58, color: C.text, fontStyle: "italic", margin: 0,
            fontVariationSettings: "'opsz' 18"
          }}>{children}</div>
          <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ width: 22, height: 1, background: C.accent + "aa" }} />
            <span style={{ fontFamily: "var(--ge-sans)", fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.05em" }}>{author}</span>
            {role && <span style={{ fontFamily: "var(--ge-sans)", fontSize: 11, color: C.muted }}>{role}</span>}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// Stat card — no left stripe; clean
function StatCard({ value, label, sub, color }) {
  var col = color || C.accent;
  var [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={function() { setHov(true); }}
      onMouseLeave={function() { setHov(false); }}
      style={{
        background: hov ? C.cardH : C.card,
        border: "1px solid " + (hov ? col + "55" : C.border),
        borderRadius: 10, padding: "18px 16px 16px",
        transition: "background 0.2s, border-color 0.2s",
        cursor: "default"
      }}
    >
      <div style={{ fontFamily: "var(--ge-mono)", fontSize: 9, color: C.muted, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "var(--ge-display)", fontSize: 30, fontWeight: 700, color: col, lineHeight: 1, letterSpacing: "-0.02em", fontVariationSettings: "'opsz' 144" }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--ge-sans)", fontSize: 11, color: C.muted, marginTop: 9, lineHeight: 1.4 }}>{sub}</div>}
    </div>
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
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, " + C.accent + "99, transparent)" }} />
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", paddingLeft: 10, paddingRight: 14 }}>
        <Link
          to="/research"
          aria-label="Back to research"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "12px 12px 12px 8px", marginRight: 8,
            color: C.muted, fontFamily: "var(--ge-mono)", fontSize: 14,
            textDecoration: "none", flexShrink: 0,
            borderRight: "1px solid " + C.faint,
            transition: "color 0.15s"
          }}
          onMouseEnter={function(e) { e.currentTarget.style.color = C.accent; }}
          onMouseLeave={function(e) { e.currentTarget.style.color = C.muted; }}
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>&larr;</span>
        </Link>
        <div
          ref={navRef}
          style={{
            flex: 1, minWidth: 0, display: "flex",
            overflowX: "auto", scrollbarWidth: "none"
          }}
        >
          {chapters.map(function(ch) {
            var isA = active === ch.id;
            var lbl = ch.num ? ch.num + " — " + ch.short : ch.short;
            return (
              <a
                key={ch.id}
                data-ch={ch.id}
                href={"#" + ch.id}
                onClick={function(e) {
                  e.preventDefault();
                  var el = document.getElementById(ch.id);
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: "smooth" });
                }}
                style={{
                  padding: "12px 13px",
                  fontSize: 11, fontWeight: isA ? 600 : 400,
                  whiteSpace: "nowrap",
                  color: isA ? C.accent : C.muted,
                  borderBottom: "2px solid " + (isA ? C.accent : "transparent"),
                  textDecoration: "none",
                  fontFamily: "var(--ge-sans)",
                  transition: "color 0.2s, border-color 0.2s",
                  letterSpacing: "0.05em"
                }}
              >{lbl}</a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// ==================== EMPIRE BREAKDOWN ====================

function EmpireBreakdown() {
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 22px 22px", margin: "16px 0 32px" }}>
        <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>The Conglomerate at Its Peak</div>
        <div style={{ fontFamily: "var(--ge-sans)", fontSize: 14, color: C.muted, marginBottom: 22 }}>GE revenue by segment, ~2000, $B. Seven divisions, $156B in revenue.</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          {empireData.map(function(d) {
            var stillOwned = d.status === "kept";
            var col = stillOwned ? C.accent : C.muted;
            return (
              <div key={d.name} style={{
                background: stillOwned ? C.accent + "14" : C.surface,
                border: "1px solid " + (stillOwned ? C.accent + "55" : C.border),
                borderRadius: 10, padding: "14px 14px 13px",
                position: "relative", overflow: "hidden"
              }}>
                <div style={{ fontFamily: "var(--ge-sans)", fontSize: 12.5, color: C.text, fontWeight: 600 }}>{d.name}</div>
                <div style={{ fontFamily: "var(--ge-mono)", fontSize: 22, fontWeight: 700, color: col, marginTop: 4 }}>${d.v2000}B</div>
                <div style={{ fontFamily: "var(--ge-mono)", fontSize: 9, color: C.muted, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 8 }}>
                  {d.status === "kept" ? "Kept as GE Aerospace" : d.status === "spun" ? "Spun off" : "Sold / wound down"}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: "var(--ge-serif)", fontSize: 13, color: C.muted, marginTop: 14, lineHeight: 1.62, fontStyle: "italic" }}>
          By April 2024, Aviation was the only piece left. Healthcare and Power/Renewables had become independent public companies. Capital, NBC, Plastics, Lighting, and Transportation were sold or wound down.
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== TIMELINE ====================

function TimelineBlock() {
  var [hovIdx, setHovIdx] = useState(null);
  var colorOf = function(p) {
    if (p === "crisis") return C.neg;
    if (p === "pivot")  return C.accent;
    if (p === "deal")   return C.blue;
    return C.pos;
  };
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 22px 22px", margin: "16px 0 32px" }}>
        <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>Timeline</div>
        <div style={{ fontFamily: "var(--ge-sans)", fontSize: 14, color: C.muted, marginBottom: 18 }}>Key milestones, 2018 — 2026</div>
        <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
          {[
            { k: "crisis", l: "Crisis" },
            { k: "pivot",  l: "Pivot"  },
            { k: "deal",   l: "Deal"   },
            { k: "win",    l: "Win"    }
          ].map(function(x) {
            return (
              <div key={x.k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: colorOf(x.k) }} />
                <span style={{ color: C.muted, fontSize: 10, fontFamily: "var(--ge-mono)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{x.l}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "relative", paddingLeft: 30 }}>
          <div style={{
            position: "absolute", left: 11, top: 6, bottom: 6, width: 1.5,
            background: "linear-gradient(to bottom, " + C.neg + " 0%, " + C.accent + " 50%, " + C.pos + " 100%)",
            borderRadius: 1, opacity: 0.7
          }} />
          {timelineEvents.map(function(item, i) {
            var dot = colorOf(item.phase);
            var isHov = hovIdx === i;
            return (
              <div
                key={i}
                onMouseEnter={function() { setHovIdx(i); }}
                onMouseLeave={function() { setHovIdx(null); }}
                style={{
                  position: "relative",
                  marginBottom: i === timelineEvents.length - 1 ? 0 : 6,
                  padding: "10px 14px",
                  borderRadius: 9,
                  background: isHov ? dot + "14" : C.surface,
                  border: "1px solid " + (isHov ? dot + "66" : C.border),
                  transition: "background 0.2s, border-color 0.2s"
                }}
              >
                <div style={{
                  position: "absolute", left: -24, top: 14,
                  width: 10, height: 10, borderRadius: "50%",
                  background: dot, border: "2.5px solid " + C.bg,
                  boxShadow: "0 0 0 " + (isHov ? "4px" : "2px") + " " + dot + (isHov ? "55" : "33"),
                  transition: "box-shadow 0.2s"
                }} />
                <span style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.1em", marginRight: 10 }}>
                  {item.d + " " + item.yr}
                </span>
                <span style={{ fontFamily: "var(--ge-sans)", fontSize: 13, color: C.text, fontWeight: 500 }}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== FLIGHT DECK PILLARS ====================

function FlightDeckPillars() {
  var pillars = [
    { title: "Safety",   desc: "Always first. Independent oversight reporting through Chief Engineers, not P&L leaders.", col: C.neg },
    { title: "Quality",  desc: "Root cause over blame. Kaizen events instead of quarter-end heroics.",                  col: C.gold },
    { title: "Delivery", desc: "Flow, pull, single-piece. Over 30 P&Ls, accountability at every level.",                col: C.blue },
    { title: "Cost",     desc: "Falls out of process discipline, not blunt cuts.",                                       col: C.accent }
  ];
  return (
    <FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, margin: "28px 0 32px" }} className="ge-pillars">
        {pillars.map(function(p, i) {
          return (
            <div key={i} style={{
              background: C.card, borderRadius: 12, padding: "20px 18px 18px",
              border: "1px solid " + C.border, position: "relative", overflow: "hidden"
            }}>
              <div style={{
                position: "absolute", right: 12, top: 2,
                fontFamily: "var(--ge-display)", fontSize: 72, fontWeight: 900,
                color: "rgba(106,168,201,0.06)", lineHeight: 1, pointerEvents: "none", userSelect: "none"
              }}>{"0" + (i + 1)}</div>
              <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: p.col, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>{"Pillar 0" + (i + 1)}</div>
              <div style={{ fontFamily: "var(--ge-display)", fontSize: 20, color: C.text, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{p.title}</div>
              <div style={{ fontFamily: "var(--ge-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== FLIGHT DECK RESULTS ====================

function FlightDeckResults() {
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 22px 18px", margin: "16px 0 32px" }}>
        <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>FLIGHT DECK in the shops</div>
        <div style={{ fontFamily: "var(--ge-sans)", fontSize: 14, color: C.muted, marginBottom: 22 }}>Published case studies from GE Aerospace sites worldwide.</div>
        <div>
          {fdResults.map(function(r, i) {
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "1fr 82px 82px", gap: 12, alignItems: "center",
                padding: "14px 4px",
                borderBottom: i < fdResults.length - 1 ? "1px solid " + C.border : "none"
              }} className="ge-fd-row">
                <div>
                  <div style={{ fontFamily: "var(--ge-sans)", fontSize: 13.5, color: C.text, fontWeight: 600 }}>{r.site}<Rf n={r.ref} /></div>
                  <div style={{ fontFamily: "var(--ge-serif)", fontSize: 12.5, color: C.muted, marginTop: 3 }}>{r.metric}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: C.neg, fontSize: 13, fontWeight: 700, fontFamily: "var(--ge-mono)" }}>{r.from}</div>
                  <div style={{ color: C.muted, fontSize: 8, fontFamily: "var(--ge-mono)", marginTop: 3, letterSpacing: "0.14em" }}>BEFORE</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: C.pos, fontSize: 13, fontWeight: 700, fontFamily: "var(--ge-mono)" }}>{r.to}</div>
                  <div style={{ color: C.muted, fontSize: 8, fontFamily: "var(--ge-mono)", marginTop: 3, letterSpacing: "0.14em" }}>AFTER</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 14, color: C.muted, fontSize: 11.5, fontFamily: "var(--ge-serif)", fontStyle: "italic" }}>
          *Terre Haute: 20% start confirmed; endpoint not independently verified.
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== COMP CALCULATOR ====================

function CompCalc() {
  var [price, setPrice] = useState(281);
  var tiers = [
    { label: "Threshold", post: 80,  shares: 580960,  pct: "150%" },
    { label: "Target",    post: 107, shares: 1161919, pct: "200%" },
    { label: "Maximum",   post: 133, shares: 1742878, pct: "250%" }
  ];
  var vested = price < 80 ? 0 : price < 107 ? 580960 : price < 133 ? 1161919 : 1742878;
  var val = vested * price;
  var curve = [];
  for (var i = 0; i <= 40; i++) {
    var p = 50 + i * 10;
    var s = p < 80 ? 0 : p < 107 ? 580960 : p < 133 ? 1161919 : 1742878;
    curve.push({ price: p, value: (s * p) / 1e6 });
  }
  var sliderPct = ((price - 50) / 400) * 100;
  return (
    <FadeIn>
      <div style={{ background: C.surface, borderRadius: 16, padding: "32px 26px 28px", border: "1px solid " + C.border, margin: "44px 0" }}>
        <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.gold, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Interactive</div>
        <h3 style={{ fontFamily: "var(--ge-display)", fontSize: 24, color: C.text, margin: "0 0 8px", fontWeight: 700, letterSpacing: "-0.01em" }}>Equity Comp Calculator</h3>
        <p style={{ fontFamily: "var(--ge-serif)", color: C.muted, fontSize: 13.5, margin: "0 0 26px" }}>
          Baseline $6.67 pre-split ($53.36 post). Per 8-K Aug 20, 2020.<Rf n={17}/>
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14, minHeight: 46 }}>
          <span style={{ color: C.muted, fontSize: 13, fontFamily: "var(--ge-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Stock Price</span>
          <span style={{ fontSize: 38, fontWeight: 700, color: C.gold, fontFamily: "var(--ge-mono)", minWidth: 120 }}>{"$" + price}</span>
        </div>
        <input
          type="range" min={50} max={450} value={price}
          onChange={function(e) { setPrice(Number(e.target.value)); }}
          style={{
            width: "100%", height: 4, appearance: "none", WebkitAppearance: "none",
            outline: "none", cursor: "pointer", borderRadius: 2,
            background: "linear-gradient(90deg," + C.faint + " 0%," + C.gold + " " + sliderPct + "%," + C.faint + " " + sliderPct + "%)"
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, marginBottom: 24 }}>
          <span style={{ color: C.muted, fontSize: 10, fontFamily: "var(--ge-mono)" }}>$50</span>
          <span style={{ color: C.muted, fontSize: 10, fontFamily: "var(--ge-mono)" }}>$450</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 26 }}>
          {[
            { l: "Shares",  v: vested.toLocaleString(),                                        c: C.gold },
            { l: "Value",   v: "$" + (val / 1e6).toFixed(1) + "M",                              c: C.accent },
            { l: "vs Base", v: price > 53.36 ? "+" + ((price / 53.36 - 1) * 100).toFixed(0) + "%" : "—", c: C.blue }
          ].map(function(x, i) {
            return (
              <div key={i} style={{
                background: C.card, borderRadius: 10, padding: "16px 10px",
                textAlign: "center", minHeight: 82, display: "flex", flexDirection: "column",
                justifyContent: "center", border: "1px solid " + C.border
              }}>
                <div style={{ color: C.muted, fontSize: 9, fontFamily: "var(--ge-mono)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>{x.l}</div>
                <div style={{ color: x.c, fontSize: 20, fontWeight: 700, fontFamily: "var(--ge-mono)" }}>{x.v}</div>
              </div>
            );
          })}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={curve} margin={{ top: 4, right: 6, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="ge-cg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.gold} stopOpacity={0.28} />
                <stop offset="95%" stopColor={C.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke={C.faint} vertical={false} />
            <XAxis dataKey="price" stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} tickFormatter={function(v){return "$"+v;}} />
            <YAxis stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} tickFormatter={function(v){return "$"+v+"M";}} width={52} />
            <Tooltip content={<Tip />} cursor={{ stroke: C.accent + "55" }} />
            <Area type="stepAfter" dataKey="value" name="Award ($M)" stroke={C.gold} fill="url(#ge-cg)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 18 }}>
          {tiers.map(function(t, i) {
            var hit = price >= t.post;
            return (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "92px 1fr 92px 92px", gap: 10, alignItems: "center",
                padding: "12px 0",
                borderBottom: i < 2 ? "1px solid " + C.border : "none"
              }}>
                <div style={{
                  background: hit ? C.accent : C.faint,
                  color: hit ? C.bg : C.muted,
                  fontSize: 10, fontWeight: 700, padding: "5px 0",
                  borderRadius: 6, textAlign: "center",
                  fontFamily: "var(--ge-mono)", letterSpacing: "0.12em", textTransform: "uppercase",
                  transition: "all 0.25s"
                }}>{t.label}</div>
                <div style={{ color: C.muted, fontSize: 11.5, fontFamily: "var(--ge-mono)" }}>{"$" + t.post + " (" + t.pct + ")"}</div>
                <div style={{ color: hit ? C.text : C.muted, fontSize: 11.5, fontWeight: 600, textAlign: "right", fontFamily: "var(--ge-mono)" }}>{t.shares.toLocaleString()}</div>
                <div style={{ color: hit ? C.gold : C.muted, fontSize: 12.5, fontWeight: 700, textAlign: "right", fontFamily: "var(--ge-mono)" }}>{"$" + (t.shares * price / 1e6).toFixed(1) + "M"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== PLAYBOOK CARD ====================

function PlaybookCard({ lesson }) {
  var [hov, setHov] = useState(false);
  return (
    <FadeIn>
      <div
        onMouseEnter={function() { setHov(true); }}
        onMouseLeave={function() { setHov(false); }}
        style={{
          background: hov ? C.cardH : C.card,
          border: "1px solid " + (hov ? C.accent + "55" : C.border),
          borderRadius: 14, padding: "24px 28px 22px",
          position: "relative", overflow: "hidden",
          transition: "background 0.22s, border-color 0.22s"
        }}
      >
        <div style={{
          position: "absolute", right: 18, top: 6,
          fontFamily: "var(--ge-display)", fontSize: 104, fontWeight: 900,
          color: "rgba(106,168,201,0.07)", lineHeight: 1,
          pointerEvents: "none", userSelect: "none"
        }}>{lesson.n}</div>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", position: "relative" }}>
          <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.18em", marginTop: 7, minWidth: 24 }}>{lesson.n}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--ge-display)", fontSize: 20, color: C.text, fontWeight: 700, lineHeight: 1.28, marginBottom: 12, letterSpacing: "-0.01em" }}>{lesson.title}</div>
            <div style={{ fontFamily: "var(--ge-serif)", fontSize: 15.5, color: C.dim, lineHeight: 1.72 }}>{lesson.body}</div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== MAIN COMPONENT ====================

export default function GeAerospace() {
  var [activeChapter, setActiveChapter] = useState("ch0");
  var [showNav, setShowNav] = useState(function() { return window.innerWidth <= 768; });
  var rafRef = useRef(null);
  var lastRef = useRef("ch0");

  // Inject Google Fonts once
  useEffect(function() {
    var id = "ge-fonts";
    if (document.getElementById(id)) return;
    var link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..900,25..100;1,9..144,400..900,25..100&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);


  // Scroll to top on mount (fixes browser scroll restoration on mobile)
  useEffect(function() {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="ge-root" style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "var(--ge-serif)" }}>

      {/* Scoped CSS — all vars prefixed with --ge-, all keyframes prefixed with ge- */}
      <style>{`
        .ge-root {
          --ge-display: 'Fraunces', Georgia, serif;
          --ge-serif:   'Source Serif 4', Georgia, serif;
          --ge-sans:    'Space Grotesk', system-ui, sans-serif;
          --ge-mono:    'JetBrains Mono', Menlo, monospace;
        }
        .ge-root * { box-sizing: border-box; }
        .ge-root ::selection { background: ${C.accent}55; }
        .ge-root ::-webkit-scrollbar { width: 6px; height: 6px; }
        .ge-root ::-webkit-scrollbar-thumb { background: ${C.faint}; border-radius: 3px; }
        .ge-root nav div::-webkit-scrollbar { display: none; }
        .ge-root input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: ${C.gold}; cursor: pointer;
          border: 3px solid ${C.bg};
          box-shadow: 0 0 12px ${C.gold}55;
        }
        .ge-root input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: ${C.gold}; cursor: pointer;
          border: 3px solid ${C.bg};
        }

        @keyframes ge-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ge-rotate-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ge-bounce-down {
          0%, 100% { transform: translateY(0);  opacity: 0.6; }
          50%      { transform: translateY(6px); opacity: 1;   }
        }
        @keyframes ge-pulse-glow {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 0.6;  }
        }

        @media (max-width: 768px) {
          .ge-root nav a[aria-label="Back to research"] {
            padding: 15px 18px 15px 14px !important;
          }
        }
        @media (max-width: 720px) {
          .ge-root .ge-pillars { grid-template-columns: repeat(2, 1fr) !important; }
          .ge-root .ge-final-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .ge-root .ge-fd-row { grid-template-columns: 1fr 62px 62px !important; gap: 8px !important; }
          .ge-root .ge-seg-grid { grid-template-columns: 1fr !important; }
          .ge-root .ge-hero-stats { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
        }
      `}</style>

      <ProgressBar />
      <MetalGrain />
      <NavBar active={activeChapter} show={showNav} />

      {/* ========== HERO ========== */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>

        {/* Cool HUD blue radial glow */}
        <div style={{
          position: "absolute", top: "22%", left: "50%", transform: "translateX(-50%)",
          width: 680, height: 540,
          background: "radial-gradient(ellipse, rgba(106,168,201,0.10) 0%, transparent 70%)",
          pointerEvents: "none", filter: "blur(70px)",
          animation: "ge-pulse-glow 9s ease-in-out infinite"
        }} />

        {/* Slow-rotating turbine ring — decorative, engineered motif */}
        <div style={{
          position: "absolute", top: "18%", left: "50%", width: 420, height: 420,
          transform: "translateX(-50%)",
          border: "1px solid " + C.accent + "18",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "ge-rotate-slow 120s linear infinite"
        }}>
          {/* Turbine blade ticks */}
          {Array.from({ length: 18 }).map(function(_, i) {
            var angle = (i / 18) * 360;
            return (
              <div key={i} style={{
                position: "absolute", top: "50%", left: "50%",
                width: 1, height: 14,
                background: C.accent + "40",
                transformOrigin: "center -196px",
                transform: "translate(-50%, -50%) rotate(" + angle + "deg)"
              }} />
            );
          })}
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "14vh 24px 8vh", width: "100%" }}>
          <HeroReveal delay={80}>
            <div style={{
              fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent,
              letterSpacing: "0.34em", marginBottom: 36, textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 14
            }}>
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.accent + "99" }} />
              An Industrial Turnaround Narrative
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.accent + "44" }} />
            </div>
          </HeroReveal>

          <HeroReveal delay={220}>
            <h1 style={{ fontFamily: "var(--ge-display)", margin: "0 0 6px", padding: 0, lineHeight: 1.0, fontVariationSettings: "'opsz' 144, 'SOFT' 20" }}>
              <span style={{
                display: "block", fontSize: "clamp(48px, 8.4vw, 92px)",
                fontWeight: 800, color: C.text, letterSpacing: "-0.028em"
              }}>The Reinvention of</span>
              <span style={{
                display: "block", fontSize: "clamp(44px, 7.6vw, 84px)",
                fontWeight: 400, fontStyle: "italic",
                color: C.accent, letterSpacing: "-0.015em", marginTop: "0.08em",
                fontVariationSettings: "'opsz' 144, 'SOFT' 80"
              }}>General Electric</span>
            </h1>
          </HeroReveal>

          <HeroReveal delay={420}>
            <p style={{
              fontFamily: "var(--ge-serif)", fontSize: 20, lineHeight: 1.58,
              color: C.dim, margin: "32px 0 32px", fontStyle: "italic", maxWidth: 720
            }}>
              The company that more or less invented the modern corporation nearly destroyed itself. Then an outsider CEO, a Japanese manufacturing philosophy, and seven years of brutally focused execution turned $0 in personal GE stock into a $584 million ownership stake, and three failing divisions into three industry leaders worth over $600 billion.
            </p>
          </HeroReveal>

          <HeroReveal delay={560}>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 44,
              fontFamily: "var(--ge-mono)", fontSize: 10, color: C.muted,
              letterSpacing: "0.16em", textTransform: "uppercase", alignItems: "center"
            }}>
              <span>Apr 2026</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>~18 min read</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>34 primary sources</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>80 claims fact-checked</span>
            </div>
          </HeroReveal>

          <HeroReveal delay={720}>
            <div style={{
              background: C.card, borderRadius: 14,
              padding: "28px 28px 26px", border: "1px solid " + C.border,
              marginBottom: 40
            }}>
              <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 18, fontWeight: 500 }}>The Turnaround in Three Numbers</div>
              <p style={{ fontFamily: "var(--ge-display)", fontSize: 22, lineHeight: 1.4, color: C.text, margin: "0 0 24px", fontWeight: 400, letterSpacing: "-0.005em" }}>
                Larry Culp walked into GE in October 2018 with the stock near <strong style={{ color: C.neg, fontWeight: 700 }}>$8</strong>, $115B in debt, and a dividend he'd cut ten weeks later to <strong style={{ color: C.neg, fontWeight: 700 }}>one cent</strong>. Seven years later, what was left of the business was throwing off <strong style={{ color: C.accent, fontWeight: 700 }}>$7.7B</strong> in free cash flow against a <strong style={{ color: C.gold, fontWeight: 700 }}>$190B</strong> backlog.<Rf n={15}/>
              </p>
              <div className="ge-hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, background: C.border, borderRadius: 9, overflow: "hidden" }}>
                {[
                  { val: "$584M", label: "Culp's GE stake",        col: C.accent },
                  { val: "$0.01", label: "Dividend inherited",     col: C.neg    },
                  { val: "$190B", label: "Backlog built",          col: C.gold   }
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{ background: C.card, textAlign: "center", padding: "18px 10px 16px" }}>
                      <div style={{ fontFamily: "var(--ge-display)", fontSize: 28, color: s.col, fontWeight: 700, letterSpacing: "-0.02em", fontVariationSettings: "'opsz' 144" }}>{s.val}</div>
                      <div style={{ fontFamily: "var(--ge-mono)", fontSize: 9, color: C.muted, marginTop: 6, letterSpacing: "0.16em", textTransform: "uppercase" }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </HeroReveal>

          <HeroReveal delay={900}>
            <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.18em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 12 }}>
              <span>Scroll to begin</span>
              <span style={{ display: "inline-block", animation: "ge-bounce-down 1.8s ease-in-out infinite" }}>↓</span>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ========== CH 00 ========== */}
      <section id="ch0" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="00" sub="The 20 years of decisions that created the crisis">How GE Broke</H2>
        <P>To understand what Larry Culp walked into, you first have to understand what GE was at its peak. In August 2000, General Electric was the most valuable company on Earth. Market cap: <G>$594 billion</G>. Jack Welch was on the cover of every business magazine. GE Capital threw off more than 40% of the conglomerate&rsquo;s earnings, making money in aircraft leasing, mortgages, credit cards, and insurance. The stock had compounded at 28% a year for 15 years. The company was treated as proof that professional management could run anything.</P>
        <Ed>Here's the thing. Almost everything that made GE great under Welch, everything investors loved about it, was also what eventually broke the company.</Ed>
        <P>GE Capital was the engine of earnings growth. It was also a <Rd>shadow bank</Rd> hiding inside an industrial company. It borrowed at GE&rsquo;s AAA credit rating, lent at higher rates, and pocketed the spread. When Welch retired in 2001, GE Capital was sitting on <Rd>$370 billion in assets</Rd>, bigger than most actual banks but without any of the regulatory oversight. The long-term care policies written in the 1980s and 1990s, which would later blow a $15 billion hole in reserves, were quietly ticking the whole time. They just didn&rsquo;t detonate for another twenty years.</P>
        <P>Jeff Immelt took over on September 7, 2001, four days before the attacks that would reshape the global economy. Over the next 16 years, he made a string of bets that compounded GE&rsquo;s structural problems. He bought Alstom&rsquo;s power business for <Rd>$10.6 billion</Rd> in 2015, right as the energy market was tilting toward renewables and gas-turbine demand was rolling over. He sold NBC Universal to Comcast for $30 billion in 2011, then used the proceeds to buy back stock at prices that turned out to be wildly inflated, instead of deleveraging. He sold GE Plastics to SABIC for $11 billion. He promised, repeatedly, to shrink GE Capital, and then didn&rsquo;t.</P>
        <P>By the time Immelt was pushed out in 2017, GE&rsquo;s stock was down <Rd>30%</Rd> over his 16 years while the S&amp;P 500 was up 214%. His successor, John Flannery, lasted 14 months before the board replaced him with Culp.</P>

        {/* GE vs S&P */}
        <FadeIn>
          <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 20px 18px", margin: "16px 0 28px" }}>
            <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>Indexed stock performance</div>
            <div style={{ fontFamily: "var(--ge-sans)", fontSize: 14, color: C.text, fontWeight: 600, marginBottom: 20 }}>GE vs S&amp;P 500 (2000 — 2025, approx.)</div>
            <div style={{ height: 270, marginLeft: -18 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockD} margin={{ top: 8, right: 16, left: 10, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.faint} vertical={false} />
                  <XAxis dataKey="y" stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<Tip />} cursor={{ stroke: C.accent + "55" }} />
                  <Line type="monotone" dataKey="sp" name="S&P 500" stroke={C.pos} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ge" name="GE Stock" stroke={C.neg} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 14, paddingTop: 14, borderTop: "1px solid " + C.border, fontFamily: "var(--ge-sans)", fontSize: 11, color: C.muted, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 2, background: C.neg, display: "inline-block" }} /> GE Stock ($)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 2, background: C.pos, display: "inline-block" }} /> S&amp;P 500 (indexed to $100)</div>
              <div style={{ marginLeft: "auto", fontStyle: "italic" }}>Approximate. GE prices reflect reverse-split adjustments.</div>
            </div>
          </div>
        </FadeIn>

        <EmpireBreakdown />
      </section>

      {/* ========== CH 01 ========== */}
      <section id="ch1" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="01" sub="October 2018: what Culp inherited">The Wreckage</H2>
        <P>On October 1, 2018, Culp walked into the wreckage. GE was carrying <Rd>~$115 billion in borrowings</Rd> as of Q3 2018.<Rf n={5}/> GE Capital had a <Rd>$15 billion LTC insurance shortfall</Rd>.<Rf n={2}/> A <Rd>$22 billion goodwill writedown</Rd> had just confirmed how bad Alstom really was.<Rf n={1}/> The day after Culp started, S&amp;P downgraded GE to <Rd>BBB+</Rd>.<Rf n={32}/> Four months earlier, the company had been <Rd>removed from the Dow</Rd>.<Rf n={3}/></P>
        <P>Culp was GE&rsquo;s first outside CEO in 126 years. He'd turned the job down twice<Rf n={31}/> before Nelson Peltz took him to lunch in Boston and told him to stop being a professor. At Danaher, Culp had grown market cap from $8 billion to over $50 billion, with 14% annualized returns against 5.5% for the S&amp;P. His playbook was the Danaher Business System, a lean operating framework derived from Toyota. The open question was whether it could work at a company a hundred times bigger, a hundred times more complicated, and a hundred times more broken.</P>
        <Quote author="Larry Culp" role="Fortune, 2024">I told the board no, twice. I was flattered, but I didn&rsquo;t think this was the right thing for me to do.</Quote>
      </section>

      {/* ========== CH 02 ========== */}
      <section id="ch2" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="02" sub="2018 — 2020: stopping the bleeding">Triage</H2>
        <P>Culp moved at a speed that stunned a company used to deliberation. On <B>October 30, 2018</B>, less than a month in, he cut the dividend to <A>$0.01/share</A>, a 92% cut that preserved $3.9B a year.<Rf n={1}/> Flannery had already trimmed it from $0.24 to $0.12.<Rf n={34}/> Culp's version was faster, deeper, and harder to walk back. It told the organization that nothing was sacred.</P>
        <P>Then the asset sales started, with the urgency of a company fighting for its life. BioPharma went to Danaher for <A>$21.4 billion</A>.<Rf n={4}/> Transportation merged with Wabtec ($2.9B). Selling down Baker Hughes raised over $7B across multiple tranches. By year-end 2019, debt was down to <A>$90.9B</A> and free cash flow was positive at <A>$2.3B</A>.<Rf n={5}/></P>
        <Ed>This is the moment I find hard to read as anything other than partly lucky. The BioPharma cash hit GE's treasury on March 31, 2020, the exact week global air travel collapsed. Was the timing lucky? Yes. But choosing to sell non-core assets for cash, instead of running IPOs that take a year and depend on markets, is the kind of decision luck alone doesn't explain.</Ed>
        <P>By May, <Rd>25% of the ~52,000 global Aviation staff</Rd> were gone, roughly 13,000 people.<Rf n={7}/> Culp gave up his salary.<Rf n={21}/> Even in the worst aviation downturn in history, GE put up <A>$0.6B of positive FCF</A> for 2020, with <A>$4.4B in Q4 alone</A>.<Rf n={5}/> That Q4 number was the first hard evidence that operational improvements, not just asset sales, were doing real work.</P>

        {/* Debt chart */}
        <FadeIn>
          <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 20px 18px", margin: "16px 0 28px" }}>
            <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.neg, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>Total borrowings</div>
            <div style={{ fontFamily: "var(--ge-sans)", fontSize: 14, color: C.text, fontWeight: 600, marginBottom: 20 }}>$134.6B to $20.5B<Rf n={15}/></div>
            <div style={{ height: 260, marginLeft: -18 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={debtD} margin={{ top: 8, right: 16, left: 10, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.faint} vertical={false} />
                  <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} tickFormatter={function(v){return "$"+v+"B";}} width={52} />
                  <Tooltip content={<Tip />} cursor={{ fill: C.accent + "10" }} />
                  <Bar dataKey="debt" name="Debt" radius={[5, 5, 0, 0]}>
                    {debtD.map(function(e, i) { return <Cell key={i} fill={e.debt > 80 ? C.neg : e.debt > 30 ? C.accent2 : C.pos} />; })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 14, paddingTop: 14, borderTop: "1px solid " + C.border, fontFamily: "var(--ge-sans)", fontSize: 11, color: C.muted, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 10, background: C.neg, borderRadius: 2 }} /> {"> $80B"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 10, background: C.accent2, borderRadius: 2 }} /> $30 — 80B</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 10, background: C.pos, borderRadius: 2 }} /> {"< $30B"}</div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ========== CH 03 ========== */}
      <section id="ch3" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="03" sub="2021 — 2024: dismantling the conglomerate">The Breakup</H2>
        <P>GECAS went to AerCap for <A>$30B+</A>: roughly $23B in net cash, 111.5 million AerCap shares, and $1B in notes.<Rf n={8}/> Eight days after the deal closed, on <B>November 9, 2021</B>, Culp announced the <A>three-way breakup</A>.<Rf n={9}/></P>
        <Ed>Sit with how audacious this is for a second. Culp was proposing to dismantle a 131-year-old company that had once been the most valuable on Earth and still carried Thomas Edison's name on the door. He was doing it because he thought the pieces were worth more apart than together. He turned out to be right. Not by a little.</Ed>
        <P><B>GE HealthCare</B> separated on January 4, 2023, at ~$59/share with a ~$27B market cap.<Rf n={12}/> GE kept 19.9% and later monetized it through debt-for-equity exchanges with Morgan Stanley. <B>GE Vernova</B> followed on April 2, 2024.<Rf n={13}/> That day, the 131-year-old conglomerate stopped existing. All three successor companies started life with investment-grade balance sheets. FY2021 FCF hit <A>$5.1B</A>,<Rf n={10}/> and by Q4 2022 cumulative debt reduction was past $100B.<Rf n={11}/></P>

        <TimelineBlock />
      </section>

      {/* ========== CH 04 ========== */}
      <section id="ch4" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="04" sub="FLIGHT DECK: from a junior high coach to the jet engine factory">The Machine</H2>
        <P>Asset sales stabilize balance sheets. They don't change cultures. For that, you need an operating system. Culp's was <A>FLIGHT DECK</A>, and its origin story sounds like a business school case, except this one actually worked in the factories.</P>
        <P>The lineage is literal. In the late 1980s, Danaher brought Japanese lean consultants from <B>Shingijutsu</B>, a firm founded by former Toyota executives who had worked under Taiichi Ohno, straight into American factories.<Rf n={26}/> Culp spent a week building air conditioners at a Japanese factory, being &ldquo;pushed, probably cursed at, in Japanese.&rdquo; He calls it the most formative week of his career.<Rf n={26}/></P>
        <Quote author="Larry Culp" role="Gray Matter podcast, 2025">I had a junior high school coach who said, &lsquo;You either get better or you get worse, but you don&rsquo;t stay the same.&rsquo; When I later learned about kaizen, it was the same idea.</Quote>
        <P>At GE, Culp deliberately didn't copy-paste the Danaher Business System. He built FLIGHT DECK from scratch for aerospace: <Rd>Safety</Rd>, <G>Quality</G>, <span style={{ color: C.blue, fontWeight: 600 }}>Delivery</span>, <A>Cost</A>, always in that order. He broke GE Aerospace into <A>30+ individual P&amp;Ls</A>. He set up an independent flight safety office that reports through Chief Engineers, not P&amp;L leaders, so commercial pressure literally can't override a safety call.</P>
        <Ed>The difference between FLIGHT DECK and the Six Sigma culture it replaced is the part I keep coming back to. Six Sigma was expert-driven: Black Belts parachuted into factories with statistical models. It produced what Culp called &ldquo;quarter-end heroics&rdquo;, the scramble to hit a number, which he found genuinely dysfunctional. FLIGHT DECK runs the other way. It's bottom-up. Every employee does kaizen. The philosophy isn't &ldquo;hire smart people to fix things&rdquo;, it's &ldquo;teach everyone to improve their corner of the shop, every day.&rdquo;</Ed>

        <FlightDeckPillars />

        <P>The results show up in GE Aerospace's own published case studies. At the <B>On Wing Support</B> network, a single June 2023 kaizen event drove a <A>170% increase in LEAP capacity</A>.<Rf n={27}/> At <B>Celma, Brazil</B>, CFM56 fan cell turnaround dropped from 68 days to 46, and LPT blade repair fell 58%. They run kaizens weekly there now.<Rf n={28}/> At <B>Pomigliano, Italy</B>, 15 visual management control centers chewed through 2,000+ supply chain issues over two years.<Rf n={29}/></P>

        <FlightDeckResults />

        <Quote author="Gioacchino Ficano" role="Pomigliano d'Arco plant">These control centers have flipped everything upside down — inverting the pyramid. Previously, I was the customer. Now they&rsquo;re the ones on top.</Quote>
      </section>

      {/* ========== CH 05 ========== */}
      <section id="ch5" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="05" sub="2024 — 2025: the numbers speak">The Payoff</H2>
        <P>FY2024: operating profit <A>$7.3B</A>, 20.7% margins, $6.2B of FCF, $4.60 adjusted EPS.<Rf n={14}/> Then 2025 broke every record on the page: revenue <A>$42.3B</A> (+21%), operating profit <A>$9.1B</A>, FCF <A>$7.7B</A> at 113% conversion, EPS <G>$6.37</G> (+38%). Backlog hit <A>~$190B</A>. Orders of $66.2B were up 32%.<Rf n={15}/></P>
        <P>CES did $33.3B at <A>26.6% margins</A>, the best in the engine OEM peer set. Services account for ~76% of CES revenue, riding on an 80,000-engine installed base. DPT did $10.6B at 12.3% margins with book-to-bill above 1.5x. The rating agencies followed: Moody's to A3,<Rf n={23}/> then A2,<Rf n={25}/> S&amp;P to A-.<Rf n={24}/></P>

        {/* Revenue + FCF area */}
        <FadeIn>
          <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 20px 18px", margin: "16px 0 28px" }}>
            <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>Revenue and free cash flow</div>
            <div style={{ fontFamily: "var(--ge-sans)", fontSize: 14, color: C.text, fontWeight: 600, marginBottom: 20 }}>The climb from the COVID trough</div>
            <div style={{ height: 270, marginLeft: -18 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={finData} margin={{ top: 8, right: 16, left: 10, bottom: 6 }}>
                  <defs>
                    <linearGradient id="ge-gR" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.accent} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ge-gF" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.blue} stopOpacity={0.22} />
                      <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.faint} vertical={false} />
                  <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<Tip />} cursor={{ stroke: C.accent + "55" }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue ($B)" stroke={C.accent} fill="url(#ge-gR)" strokeWidth={2} dot={{ r: 3, fill: C.accent, stroke: C.bg, strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="fcf"     name="FCF ($B)"     stroke={C.blue}   fill="url(#ge-gF)" strokeWidth={2} dot={{ r: 3, fill: C.blue,   stroke: C.bg, strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 14, paddingTop: 14, borderTop: "1px solid " + C.border, fontFamily: "var(--ge-sans)", fontSize: 11, color: C.muted, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 2, background: C.accent }} /> Revenue ($B)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 2, background: C.blue }} /> Free Cash Flow ($B)</div>
            </div>
          </div>
        </FadeIn>

        {/* Segment cards */}
        <FadeIn>
          <div className="ge-seg-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "16px 0 32px" }}>
            {[
              { seg: "Commercial Engines & Services",  rev: "$33.3B", prof: "$8.9B", marg: "26.6%", ord: "$54.4B", col: C.accent },
              { seg: "Defense & Propulsion Tech",      rev: "$10.6B", prof: "$1.3B", marg: "12.3%", ord: "$11.8B", col: C.blue   }
            ].map(function(s, i) {
              return (
                <div key={i} style={{ background: C.card, borderRadius: 12, padding: "20px 20px 16px", border: "1px solid " + C.border, position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", right: 14, top: 2,
                    fontFamily: "var(--ge-display)", fontSize: 88, fontWeight: 900,
                    color: "rgba(106,168,201,0.06)", lineHeight: 1, pointerEvents: "none", userSelect: "none"
                  }}>{"0" + (i + 1)}</div>
                  <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, fontWeight: 600, color: s.col, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>{s.seg}<Rf n={15}/></div>
                  {[["Revenue", s.rev], ["Op Profit", s.prof], ["Margin", s.marg], ["Orders", s.ord]].map(function(row) {
                    return (
                      <div key={row[0]} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid " + C.border }}>
                        <span style={{ color: C.muted, fontSize: 11.5, fontFamily: "var(--ge-sans)" }}>{row[0]}</span>
                        <span style={{ color: C.text, fontSize: 12.5, fontWeight: 600, fontFamily: "var(--ge-mono)" }}>{row[1]}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </FadeIn>
      </section>

      {/* ========== CH 06 ========== */}
      <section id="ch6" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="06" sub="Culp's compensation: the controversy, the structure, the verdict">The $300 Million Question</H2>
        <P>When Culp was hired, his contract offered up to <G>~$317 million</G> if GE stock rose 150% from $12.40.<Rf n={16}/> Nearly 90% of that number was at risk. In <B>August 2020</B>, with the stock near $6, the board <Rd>reset the baseline to $6.67</Rd>.<Rf n={17}/> The first threshold tripped four months later.</P>
        <Ed>This is the part of the story I find hardest to defend. The board cut the stock-price hurdles in half but kept the dollar payout the same. Same money, much less shareholder value created to earn it. ISS called it &ldquo;problematic.&rdquo; Glass Lewis gave GE an F on pay-for-performance. CtW pointed out that the bonus landed in the same year GE laid off more than 10,000 workers.</Ed>
        <P>Only <Rd>42.0% voted in favor</Rd> at the May 2021 annual meeting.<Rf n={18}/> The board responded: 2022 equity cut to $5M, cash bonus to $525K.<Rf n={21}/> Then the stock kept going up. And up. By 2024, total comp was at <G>$87.6M</G>, second-highest in the S&amp;P 500.<Rf n={21}/> Say-on-pay recovered to 94%, then slipped to 70.9% in 2025.<Rf n={22}/> The board extended his contract through December 2027.<Rf n={20}/></P>

        {/* Comp vs stock */}
        <FadeIn>
          <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 20px 18px", margin: "16px 0 28px" }}>
            <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.gold, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>Comp vs stock price</div>
            <div style={{ fontFamily: "var(--ge-sans)", fontSize: 14, color: C.text, fontWeight: 600, marginBottom: 20 }}>The alignment (and the controversy)</div>
            <div style={{ height: 270, marginLeft: -18 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={compTimeline} margin={{ top: 8, right: 16, left: 10, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.faint} vertical={false} />
                  <XAxis dataKey="y" stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left"  stroke={C.gold}   tick={{ fontSize: 10, fontFamily: "var(--ge-mono)", fill: C.gold }}   axisLine={false} tickLine={false} tickFormatter={function(v){return "$"+v+"M";}} width={52} />
                  <YAxis yAxisId="right" orientation="right" stroke={C.accent} tick={{ fontSize: 10, fontFamily: "var(--ge-mono)", fill: C.accent }} axisLine={false} tickLine={false} tickFormatter={function(v){return "$"+v;}}    width={48} />
                  <Tooltip content={<Tip />} cursor={{ fill: C.accent + "10" }} />
                  <Bar yAxisId="left"  dataKey="comp"  name="Total Comp ($M)" fill={C.gold}   radius={[5, 5, 0, 0]} opacity={0.82} />
                  <Line yAxisId="right" type="monotone" dataKey="stock" name="GE Stock ($)" stroke={C.accent} strokeWidth={2} dot={{ r: 3, fill: C.accent, stroke: C.bg, strokeWidth: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ padding: "8px 2px", color: C.muted, fontSize: 11, fontFamily: "var(--ge-sans)", fontStyle: "italic" }}>
              2025 comp not yet disclosed. Stock prices approximate year-end.
            </div>
          </div>
        </FadeIn>

        <CompCalc />
      </section>

      {/* ========== CH 07 PLAYBOOK ========== */}
      <section id="ch7" style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="07" sub="Five lessons from the greatest industrial turnaround of the 21st century">The Playbook</H2>
        <Ed>Every turnaround story eventually gets boiled down to lessons. Here's what I'd pull out of the Culp playbook for an operator, board member, or investor. Most of it travels well beyond jet engines.</Ed>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {playbookLessons.map(function(l) {
            return <PlaybookCard key={l.n} lesson={l} />;
          })}
        </div>

        {/* Final score */}
        <FadeIn>
          <div style={{
            background: "linear-gradient(135deg, " + C.accent + "0d, " + C.surface + ")",
            borderRadius: 16, padding: "36px 32px 32px",
            border: "1px solid " + C.accent + "33", margin: "48px 0 0"
          }}>
            <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.24em", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>The Final Score</div>
            <h3 style={{ fontFamily: "var(--ge-display)", fontSize: 28, fontWeight: 700, color: C.text, marginTop: 0, marginBottom: 22, letterSpacing: "-0.015em", fontVariationSettings: "'opsz' 144" }}>Seven years, measured in cash and capability.</h3>
            <div className="ge-final-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
              <StatCard value="$42.3B"  label="FY25 Revenue"   color={C.accent}  sub="+21% YoY" />
              <StatCard value="$7.7B"   label="FY25 FCF"       color={C.blue}    sub="113% conversion" />
              <StatCard value="21.4%"   label="Operating Margin" color={C.gold}  sub="Best-in-class" />
              <StatCard value="~$190B"  label="Backlog"        color={C.pos}     sub="Services-heavy" />
            </div>
            <p style={{ fontFamily: "var(--ge-serif)", fontSize: 17, color: C.dim, lineHeight: 1.88, margin: 0 }}>
              Larry Culp took a company a lot of serious people thought was headed for bankruptcy and turned it into three industry leaders worth over $600 billion combined. The question is no longer whether the turnaround worked. It's whether ~40x forward earnings leaves any margin of safety, and whether FLIGHT DECK can keep compounding now that the financial restructuring chapter is closed.
            </p>
            <FadeIn>
              <p style={{ fontFamily: "var(--ge-display)", fontSize: 22, fontStyle: "italic", color: C.accent, margin: "28px 0 0", maxWidth: 680, lineHeight: 1.42, fontVariationSettings: "'opsz' 72, 'SOFT' 80" }}>
                That's the next chapter, and nobody has written it yet.
              </p>
            </FadeIn>
          </div>
        </FadeIn>
      </section>

      {/* ========== SOURCES ========== */}
      <section id="ge-sources" style={{ maxWidth: 960, margin: "0 auto", padding: "96px 24px 80px" }}>
        <FadeIn>
          <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.28em", marginBottom: 12, textTransform: "uppercase", fontWeight: 500 }}>Methodology</div>
          <h2 style={{ fontFamily: "var(--ge-display)", fontSize: 36, fontWeight: 700, color: C.text, margin: "0 0 22px", letterSpacing: "-0.02em", fontVariationSettings: "'opsz' 144, 'SOFT' 25" }}>Sources &amp; Corrections</h2>
          <p style={{ fontFamily: "var(--ge-serif)", fontSize: 16, color: C.dim, lineHeight: 1.76, margin: "0 0 28px", maxWidth: 720 }}>
            80 claims audited against SEC filings and primary reporting: 59 confirmed, 12 minor corrections applied, 5 meaningful ones folded back into the piece. Click any bracketed reference in the text to jump here.
          </p>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: "22px 22px 16px", marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.gold, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, marginBottom: 14 }}>Corrections Applied</div>
            <div style={{ fontFamily: "var(--ge-serif)", fontSize: 14.5, color: C.dim, lineHeight: 1.74 }}>
              <div style={{ marginBottom: 10 }}>&bull; <B>Debt:</B> ~$115B at Q3 2018 (not $134.6B, which was year-end 2017).</div>
              <div style={{ marginBottom: 10 }}>&bull; <B>Credit:</B> A/A2 on Oct 1; BBB+/Baa1 came Oct 2 and Oct 31.</div>
              <div style={{ marginBottom: 10 }}>&bull; <B>Workforce:</B> ~13,000 of ~52,000 (not ~10,000 of 40,000).</div>
              <div style={{ marginBottom: 10 }}>&bull; <B>Baker Hughes:</B> Over $7B total across multiple tranches.</div>
              <div>&bull; <B>Terre Haute:</B> 96% endpoint unverified; 20% start confirmed.</div>
            </div>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gap: 7 }}>
          {sources.map(function(s, i) {
            return (
              <FadeIn key={s.n} delay={Math.min(i * 0.012, 0.25)}>
                <a href={s.url} target="_blank" rel="noreferrer" style={{
                  display: "grid", gridTemplateColumns: "42px 1fr", gap: 12,
                  padding: "12px 14px", background: C.surface, border: "1px solid " + C.border,
                  borderRadius: 9, textDecoration: "none", fontFamily: "var(--ge-sans)",
                  transition: "background 0.18s, border-color 0.18s"
                }}
                  onMouseEnter={function(e) { e.currentTarget.style.background = C.card; e.currentTarget.style.borderColor = C.accent + "55"; }}
                  onMouseLeave={function(e) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.border; }}
                >
                  <div style={{ fontFamily: "var(--ge-mono)", fontSize: 10, color: C.accent, fontWeight: 600 }}>{"[" + s.n + "]"}</div>
                  <div>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 500, lineHeight: 1.4 }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{s.pub}</div>
                  </div>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ borderTop: "1px solid " + C.faint, padding: "48px 24px 64px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 420, height: 200,
          background: "radial-gradient(ellipse, rgba(106,168,201,0.07) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{ position: "relative", fontFamily: "var(--ge-display)", fontSize: 20, color: C.accent, fontStyle: "italic", marginBottom: 8, fontVariationSettings: "'opsz' 72, 'SOFT' 80" }}>
          The Reinvention of General Electric
        </div>
        <div style={{ position: "relative", fontFamily: "var(--ge-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.22em", textTransform: "uppercase" }}>
          34 primary sources &middot; 80 claims fact-checked &middot; Not investment advice &middot; April 2026
        </div>
      </footer>

    </div>
  );
}
