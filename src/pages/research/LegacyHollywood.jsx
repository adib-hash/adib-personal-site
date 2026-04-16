import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine
} from "recharts";

// ==================== DATA ====================

const chapters = [
  { id: "ch0", num: "00", short: "Before", title: "Before the Before" },
  { id: "ch1", num: "01", short: "Skydance", title: "The Son Rises" },
  { id: "ch2", num: "02", short: "Closing", title: "The Long Closing" },
  { id: "ch3", num: "03", short: "100 Days", title: "First Hundred Days" },
  { id: "ch4", num: "04", short: "Auction", title: "Three Bidders, One Prize" },
  { id: "ch5", num: "05", short: "Hostile", title: "The Hostile Turn" },
  { id: "ch6", num: "06", short: "Superior", title: "The Superior Proposal" },
  { id: "ch7", num: "07", short: "Empire", title: "What They Bought" },
  { id: "ch8", num: "08", short: "Outlook", title: "The Next Act" },
  { id: "ch9", num: "09", short: "Playbook", title: "The Playbook" }
];

const bidData = [
  { stage: "Sep '25", price: 19.00, bidder: "Paramount", label: "$19" },
  { stage: "Sep '25", price: 22.00, bidder: "Paramount", label: "$22" },
  { stage: "Oct '25", price: 23.50, bidder: "Paramount", label: "$23.50" },
  { stage: "Nov '25", price: 25.50, bidder: "Paramount", label: "$25.50" },
  { stage: "Dec 1", price: 26.50, bidder: "Paramount", label: "$26.50" },
  { stage: "Dec 4", price: 27.75, bidder: "Netflix", label: "$27.75" },
  { stage: "Dec 8", price: 30.00, bidder: "Paramount", label: "$30" },
  { stage: "Feb 24", price: 31.00, bidder: "Paramount", label: "$31" }
];

const timelineEvents = [
  { date: "Jan 2024", phase: "setup", title: "Skydance eyes Paramount", body: "David Ellison floats a $2.5B all-cash bid. Paramount is drifting; Shari Redstone is quietly shopping her family's NAI stake." },
  { date: "Apr 2, 2024", phase: "setup", title: "Exclusive window opens", body: "Paramount's special committee grants Skydance an exclusive negotiating window. Sony and Apollo circle from the outside." },
  { date: "May 2024", phase: "setup", title: "Apollo and Sony counter", body: "A $26B non-binding proposal from Apollo Global and Sony lands on Redstone's desk. Skydance's exclusive window lapses." },
  { date: "Jul 2, 2024", phase: "setup", title: "Skydance wins Paramount", body: "Three-part deal: $2.4B for NAI, $4.5B for shareholders, $1.5B primary. Combined value ~$28B." },
  { date: "Jul 2, 2025", phase: "pivot", title: "CBS pays Trump $16M", body: "Paramount settles the 60 Minutes suit a week before the FCC greenlight. Colbert is cancelled 16 days later." },
  { date: "Aug 7, 2025", phase: "pivot", title: "Day One of a new Paramount", body: "Deal closes. Ellison: Chairman & CEO. Shell: President. Redstone exits the board. Oracle wires the streaming backend." },
  { date: "Sep 10, 2025", phase: "pivot", title: "The undisturbed price", body: "WBD closes at $12.54. Days later Ellison proposes $19/share. Rejected." },
  { date: "Dec 4, 2025", phase: "war", title: "Netflix wins the auction", body: "WBD signs an $82.7B deal with Netflix. Studios and HBO Max go to Los Gatos; cable networks get spun off." },
  { date: "Dec 8, 2025", phase: "war", title: "Hostile tender launched", body: "Paramount drops a $30 all-cash offer for the entire company. Implied value: $108B. Larry Ellison is the backstop." },
  { date: "Feb 26, 2026", phase: "win", title: "Superior proposal", body: "WBD's board declares Paramount's $31/share offer superior to the Netflix agreement. 147% premium to undisturbed." },
  { date: "Feb 27, 2026", phase: "win", title: "Netflix walks away", body: "Sarandos and Peters decline to match: 'The deal is no longer financially attractive.' $110.9B agreement signed." }
];

const boxOffice2025 = [
  { name: "Disney", value: 28, color: "#5b9fd4" },
  { name: "Warner Bros", value: 21, color: "#c8934c" },
  { name: "Universal", value: 20, color: "#3db87e" },
  { name: "Sony", value: 13, color: "#9b7fc4" },
  { name: "Paramount", value: 6, color: "#ddb870" },
  { name: "Other", value: 12, color: "#6b6060" }
];

const financingData = [
  { source: "Bank debt (18-bank syndicate)", value: 49, color: "#b83030", note: "BofA, Citi, Apollo + 15. Restructured from $54B bridge." },
  { source: "Ellison family + RedBird", value: 22, color: "#c8934c", note: "100% of voting shares. The backstop that beat Netflix." },
  { source: "Assumed WBD net debt", value: 15, color: "#9b7fc4", note: "Existing WBD leverage inherited at close." },
  { source: "Saudi Arabia — PIF", value: 10, color: "#5b9fd4", note: "Largest Gulf stake. Non-voting." },
  { source: "Qatar — QIA TMT Holding", value: 7, color: "#4a8fc4", note: "Non-voting co-investor." },
  { source: "Abu Dhabi — L'imad SPV", value: 7, color: "#3a7fb4", note: "Non-voting. Dodges CFIUS." },
  { source: "LionTree + others", value: 1, color: "#ddb870", note: "Minority equity syndicate." }
];

const streamingLineup = [
  { name: "Netflix", subs: 325, rev: 45.2, color: "#b83030" },
  { name: "Paramount+WBD", subs: 207, rev: 70.0, color: "#c8934c" },
  { name: "Amazon", subs: 200, rev: 0, color: "#5b9fd4" },
  { name: "Disney+", subs: 175, rev: 0, color: "#3db87e" }
];

const empireSegments = [
  { name: "HBO Max + Paramount+", value: 24, color: "#c8934c", detail: "~207M combined subscribers" },
  { name: "Warner Bros Studio", value: 16, color: "#ddb870", detail: "21% of 2025 US box office" },
  { name: "Paramount Pictures", value: 8, color: "#e8d49a", detail: "6% box office, strong IP" },
  { name: "Cable Networks", value: 12, color: "#9b7fc4", detail: "CNN, HBO, TNT, MTV, Nickelodeon, Discovery, Food, HGTV" },
  { name: "CBS", value: 7, color: "#5b9fd4", detail: "News, sports, NFL rights" },
  { name: "Pluto TV + BET+", value: 3, color: "#3db87e", detail: "FAST + niche streaming" }
];

const playbookLessons = [
  { n: "01", title: "Patient capital beats smart capital", body: "The Ellisons outlasted every financial bidder, every board, every news cycle. When your horizon is twenty years and your backer is the third-richest man alive, you just have to outlast anyone who isn't." },
  { n: "02", title: "Political access is strategic infrastructure", body: "Before launching the Warner bid, Paramount had already settled a presidential lawsuit, cancelled a late-night host, installed a Trump-friendly CBS News editor, and scrapped DEI. That is not PR; that is a regulatory moat." },
  { n: "03", title: "Sovereign wealth is the new LBO fund", body: "Saudi, UAE, and Qatar committed $24B and took zero board seats to dodge CFIUS. The Gulf is no longer a limited partner in American media; it is a senior underwriter." },
  { n: "04", title: "Scale is not a moat; the lack of scale is a death sentence", body: "Paramount-Warner controls ~27% of US box office, ~200M streaming subs, and the largest cable portfolio left. That doesn't guarantee victory against Netflix. It guarantees survival." },
  { n: "05", title: "In hostile auctions, the highest bidder is the most committed bidder", body: "Netflix had the larger cap, better balance sheet, ratings advantage. Paramount had something more expensive than money: a buyer who didn't care about near-term EPS. When the numbers got uncomfortable, Netflix walked. That was the point of the pressure." },
  { n: "06", title: "The acquirer's balance sheet is the real constraint", body: "Paramount closes with ~$79B net debt — five turns of EBITDA on day one. Every dollar of synergy and every job cut for five years is pre-committed to lenders. The Ellisons didn't buy freedom; they bought obligation." }
];

const sources = [
  { n: 1, title: "Proposed acquisition of Warner Bros. Discovery by Paramount Skydance", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Proposed_acquisition_of_Warner_Bros._Discovery" },
  { n: 2, title: "Merger of Skydance Media and Paramount Global", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Merger_of_Skydance_Media_and_Paramount_Global" },
  { n: 3, title: "Skydance Closes $8 Billion Paramount Acquisition", pub: "Variety, Aug 2025", url: "https://variety.com/2025/tv/news/paramount-skydance-deal-closes-1236477281/" },
  { n: 4, title: "Paramount Skydance Merger Finally Closes", pub: "Deadline, Aug 2025", url: "https://deadline.com/2025/08/paramount-skydance-merger-closes-david-ellison-1236481065/" },
  { n: 5, title: "Netflix drops $83 billion bid for Warner Bros. Discovery", pub: "CBS News, Feb 2026", url: "https://www.cbsnews.com/news/netflix-warner-paramount-skydance-deal/" },
  { n: 6, title: "Warner Bros. officially deems Paramount's bid 'superior'", pub: "Fortune, Feb 2026", url: "https://fortune.com/2026/02/26/warner-bros-officially-deems-paramounts-bid-superior-to-netflixs/" },
  { n: 7, title: "Netflix ditches deal... Paramount's offer deemed superior", pub: "CNBC, Feb 2026", url: "https://www.cnbc.com/2026/02/26/warner-bros-discovery-paramount-skydance-deal-superior-netflix.html" },
  { n: 8, title: "Paramount Skydance Wins WBD After Netflix Drops Out", pub: "Britannica Money, 2026", url: "https://www.britannica.com/money/netflix-paramount-skydance-battle-for-warner-bros" },
  { n: 9, title: "Netflix declines to raise bid for Warner Bros. Discovery", pub: "Variety, Feb 2026", url: "https://variety.com/2026/tv/news/netflix-declines-raise-bid-warner-bros-discovery-1236674149/" },
  { n: 10, title: "Paramount Skydance Secures $24B From Saudi Arabia, Qatar, Abu Dhabi", pub: "Variety, 2026", url: "https://variety.com/2026/tv/news/paramount-skydance-funding-saudi-arabia-qatar-abu-dhabi-funds-warner-bros-deal-1236709251/" },
  { n: 11, title: "David Ellison on Cost Savings, Growth, AI as WBD Merger", pub: "Deadline, Mar 2026", url: "https://deadline.com/2026/03/david-ellison-warner-bros-discovery-cost-savings-growth-1236769564/" },
  { n: 12, title: "The 20-Year David Ellison Plan, AI Intrigue", pub: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/business/business-news/david-ellison-ai-questions-paramount-media-1236340756/" },
  { n: 13, title: "What the Paramount-Warner Bros. Merger Means for Streaming", pub: "Yale Insights", url: "https://insights.som.yale.edu/insights/what-the-paramount-warner-bros-merger-means-for-streaming" },
  { n: 14, title: "The End of the Blockbuster", pub: "Scott Galloway, Medium", url: "https://medium.com/@profgalloway/the-end-of-the-blockbuster-86cd896f6f60" },
  { n: 15, title: "Paramount Won't Sell Cable Networks After WBD Merger", pub: "Deadline, Mar 2026", url: "https://deadline.com/2026/03/paramount-keeping-cable-networks-after-warner-merger-1236741346/" },
  { n: 16, title: "HBO Max and Paramount+ to combine streaming services", pub: "CNBC, Mar 2026", url: "https://www.cnbc.com/2026/03/02/hbo-max-paramount-plus-streaming-services-merge.html" },
  { n: 17, title: "Paramount commits to 30 theatrical releases/year", pub: "Variety, 2026", url: "https://variety.com/2026/film/news/paramount-warner-bros-movies-theaters-david-ellison-1236676663/" },
  { n: 18, title: "Democratic lawmakers push back on Paramount takeover", pub: "NBC News, 2026", url: "https://www.nbcnews.com/business/media/warner-bros-discovery-paramount-democratic-lawmakers-rcna260947" },
  { n: 19, title: "CNN editorial independence 'will be maintained' — Ellison", pub: "CNN, Mar 2026", url: "https://www.cnn.com/2026/03/05/media/cnn-david-ellison-paramount-wbd-merger" },
  { n: 20, title: "Regulatory scrutiny of Paramount's deal is not over", pub: "Deadline, Feb 2026", url: "https://deadline.com/2026/02/paramount-warner-bros-deal-regulatory-scrutiny-1236738029/" },
  { n: 21, title: "Netflix crosses 325M subs, Q4 2025 earnings", pub: "Variety, Jan 2026", url: "https://variety.com/2026/tv/news/netflix-q4-2025-financial-earnings-subscribers-1236635615/" },
  { n: 22, title: "Paramount hostile takeover bid valued at $108B", pub: "Variety, Dec 2025", url: "https://variety.com/2025/tv/news/paramount-hostile-takeover-bid-warner-bros-discovery-1236603175/" },
  { n: 23, title: "WBD signs merger agreement with Paramount Skydance", pub: "NBC News, Feb 2026", url: "https://www.nbcnews.com/business/media/warner-bros-discovery-signs-merger-agreement-paramount-skydance-rcna261035" },
  { n: 24, title: "Teamsters demand DOJ block merger absent worker protections", pub: "Variety, 2026", url: "https://variety.com/2026/film/news/teamsters-doj-must-block-paramount-warner-bros-merger-1236686522/" },
  { n: 25, title: "Paramount Skydance restructures debt financing for WBD deal", pub: "Variety, Apr 2026", url: "https://variety.com/2026/biz/news/paramount-debt-financing-warner-bros-discovery-deal-1236712406/" }
];

// ==================== DESIGN SYSTEM ====================

const C = {
  bg:      "#0c0907",
  surface: "#141009",
  card:    "#1c150d",
  cardH:   "#251d13",
  accent:  "#c8934c",   // Champagne gold
  accent2: "#ddb870",
  gold:    "#e8d49a",
  red:     "#b83030",
  green:   "#3db87e",
  blue:    "#5b9fd4",
  purple:  "#9b7fc4",
  text:    "#f0e8d8",
  dim:     "#c8bfb0",
  muted:   "#8a8074",
  faint:   "#221a10",
  border:  "#2d2218",
  glow:    "rgba(200,147,76,0.07)",
};

// ==================== GLOBAL COMPONENTS ====================

function ProgressBar() {
  var [pct, setPct] = useState(0);
  useEffect(function() {
    function onScroll() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() { window.removeEventListener("scroll", onScroll); };
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

function FilmGrain() {
  return (
    <div aria-hidden="true" style={{
      position: "fixed", inset: 0, zIndex: 9998, pointerEvents: "none",
      opacity: 0.028,
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      backgroundRepeat: "repeat",
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
      { threshold: threshold || 0.06 }
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
      transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)"
    }}>
      {children}
    </div>
  );
}

// Editorial callout — warm tint background, no border-left stripe
function Ed({ children }) {
  return (
    <FadeIn>
      <div style={{
        margin: "0 0 28px",
        padding: "20px 26px",
        background: "rgba(200,147,76,0.065)",
        borderRadius: 10,
        fontFamily: "var(--lh-serif)",
        fontSize: 17,
        lineHeight: 1.92,
        color: C.dim,
        fontStyle: "italic",
      }}>
        {children}
      </div>
    </FadeIn>
  );
}

function Rf({ n }) {
  return (
    <sup
      style={{
        color: C.accent, fontSize: 9, cursor: "pointer",
        fontFamily: "var(--lh-mono)", fontWeight: 600, opacity: 0.65, marginLeft: 2
      }}
      onClick={function() {
        var el = document.getElementById("lh-sources");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }}
    >{"[" + n + "]"}</sup>
  );
}

function P({ children }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--lh-serif)", fontSize: 18,
        lineHeight: 1.84, color: C.dim, margin: "0 0 26px"
      }}>
        {children}
      </p>
    </FadeIn>
  );
}

// Chapter heading with ghost number depth
function H2({ children, num }) {
  return (
    <FadeIn>
      <div style={{ margin: "92px 0 36px", position: "relative" }}>
        <div style={{
          position: "absolute", top: -52, left: -18,
          fontFamily: "var(--lh-display)",
          fontSize: 148, fontWeight: 900,
          color: "rgba(200,147,76,0.055)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}>{num}</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent,
            letterSpacing: "0.28em", marginBottom: 14,
            textTransform: "uppercase", fontWeight: 500
          }}>{"Chapter " + num}</div>
          <h2 style={{
            fontFamily: "var(--lh-display)", fontSize: "clamp(30px, 4vw, 42px)",
            fontWeight: 700, color: C.text, margin: 0,
            lineHeight: 1.1, letterSpacing: "-0.02em"
          }}>{children}</h2>
          <div style={{ width: 40, height: 1, background: C.accent + "99", marginTop: 18 }} />
        </div>
      </div>
    </FadeIn>
  );
}

function Tip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: C.card, border: "1px solid " + C.border,
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 16px 48px rgba(0,0,0,.8)"
    }}>
      <div style={{ color: C.muted, fontSize: 10, fontFamily: "var(--lh-mono)", marginBottom: 6, letterSpacing: "0.06em" }}>{label}</div>
      {payload.map(function(p, i) {
        return (
          <div key={i} style={{ color: p.color || C.text, fontSize: 12, fontFamily: "var(--lh-sans)", fontWeight: 500 }}>
            {p.name}: <strong>{"$" + (typeof p.value === "number" ? p.value.toFixed(2) : p.value)}</strong>
          </div>
        );
      })}
    </div>
  );
}

// Quote block — large decorative mark, no border-left stripe
function Quote({ author, role, children }) {
  var [hov, setHov] = useState(false);
  return (
    <FadeIn>
      <div
        onMouseEnter={function() { setHov(true); }}
        onMouseLeave={function() { setHov(false); }}
        style={{
          margin: "40px auto",
          padding: "32px 32px 26px",
          background: hov ? C.cardH : C.card,
          borderRadius: 12,
          border: "1px solid " + (hov ? C.accent + "44" : C.border),
          position: "relative", overflow: "hidden",
          maxWidth: 720,
          transition: "background 0.25s, border-color 0.25s",
        }}
      >
        <div style={{
          position: "absolute", top: -8, left: 22,
          fontFamily: "var(--lh-display)", fontSize: 128, fontWeight: 900,
          color: C.accent + "18", lineHeight: 1,
          pointerEvents: "none", userSelect: "none", fontStyle: "italic",
        }}>&ldquo;</div>
        <div style={{ position: "relative" }}>
          <div style={{
            fontFamily: "var(--lh-display)", fontSize: 20,
            lineHeight: 1.58, color: C.text, fontStyle: "italic", margin: 0,
          }}>{children}</div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 22, height: 1, background: C.accent + "99" }} />
            <span style={{ fontFamily: "var(--lh-sans)", fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.05em" }}>{author}</span>
            <span style={{ fontFamily: "var(--lh-sans)", fontSize: 11, color: C.muted }}>{role}</span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// Stat card — no gradient accent bar
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
        transition: "background 0.2s, border-color 0.2s", cursor: "default",
      }}
    >
      <div style={{ fontFamily: "var(--lh-mono)", fontSize: 9, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "var(--lh-display)", fontSize: 30, fontWeight: 700, color: col, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--lh-sans)", fontSize: 11, color: C.muted, marginTop: 9, lineHeight: 1.4 }}>{sub}</div>}
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
      transition: "transform 0.36s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, " + C.accent + "88, transparent)" }} />
      <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", paddingLeft: 10, paddingRight: 14 }}>
        <Link
          to="/projects"
          aria-label="Back to projects"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "12px 12px 12px 8px", marginRight: 8,
            color: C.muted, fontFamily: "var(--lh-mono)", fontSize: 14,
            textDecoration: "none", flexShrink: 0,
            borderRight: "1px solid " + C.faint,
            transition: "color 0.15s",
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
            overflowX: "auto", scrollbarWidth: "none",
          }}
        >
          {chapters.map(function(ch) {
            var isA = active === ch.id;
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
                  fontFamily: "var(--lh-sans)",
                  transition: "color 0.2s, border-color 0.2s",
                  letterSpacing: "0.05em",
                }}
              >{ch.num + " — " + ch.short}</a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// ==================== TIMELINE ====================

function Timeline() {
  var [hovIdx, setHovIdx] = useState(null);
  return (
    <FadeIn>
      <div style={{ position: "relative", padding: "20px 0 0 40px", margin: "12px 0 44px" }}>
        <div style={{
          position: "absolute", left: 16, top: 16, bottom: 0, width: 1,
          background: "linear-gradient(to bottom, " + C.red + " 0%, " + C.red + "aa 18%, " + C.accent + " 50%, " + C.green + " 100%)",
        }} />
        {timelineEvents.map(function(ev, i) {
          var dotColor = ev.phase === "setup" ? C.red : ev.phase === "pivot" ? C.accent : ev.phase === "war" ? C.accent2 : C.green;
          var isHov = hovIdx === i;
          return (
            <div
              key={i}
              onMouseEnter={function() { setHovIdx(i); }}
              onMouseLeave={function() { setHovIdx(null); }}
              style={{
                position: "relative",
                marginBottom: i === timelineEvents.length - 1 ? 0 : 26,
                padding: "8px 10px 8px 0",
                borderRadius: 8,
                background: isHov ? dotColor + "0f" : "transparent",
                transition: "background 0.2s", cursor: "default",
              }}
            >
              <div style={{
                position: "absolute", left: -30, top: 14,
                width: 12, height: 12, borderRadius: "50%",
                background: dotColor, border: "2.5px solid " + C.bg,
                boxShadow: "0 0 0 " + (isHov ? "4px" : "2px") + " " + dotColor + (isHov ? "55" : "33"),
                transition: "box-shadow 0.2s",
              }} />
              <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: dotColor, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3, fontWeight: 500 }}>{ev.date}</div>
              <div style={{ fontFamily: "var(--lh-sans)", fontSize: 14.5, color: C.text, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
              <div style={{ fontFamily: "var(--lh-serif)", fontSize: 14, color: C.dim, lineHeight: 1.6 }}>{ev.body}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== FINANCING CHART ====================

function FinancingChart() {
  var [hov, setHov] = useState(null);
  var total = 111;
  var positions = [];
  var cum = 0;
  for (var i = 0; i < financingData.length; i++) {
    var d = financingData[i];
    cum += d.value;
    positions.push(((cum - d.value / 2) / total) * 100);
  }

  function enter(i) { return function() { setHov(i); }; }
  function leave() { setHov(null); }
  var h = hov;
  var hd = h !== null ? financingData[h] : null;

  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 22px 22px", margin: "8px 0 32px" }}>
        <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>How the $111B gets paid for</div>
        <div style={{ fontFamily: "var(--lh-sans)", fontSize: 14, color: C.muted, marginBottom: 28 }}>USD billions — hover a segment for detail</div>

        <div style={{ position: "relative", marginBottom: 22 }}>
          <div style={{
            position: "absolute", top: -14,
            left: hd ? positions[h] + "%" : "50%",
            transform: "translate(-50%, -100%)",
            opacity: hd ? 1 : 0,
            transition: "opacity 0.16s, left 0.26s cubic-bezier(0.16,1,0.3,1)",
            pointerEvents: "none",
            background: C.bg, border: "1px solid " + (hd ? hd.color + "88" : C.border),
            borderRadius: 9, padding: "11px 14px",
            minWidth: 200, maxWidth: 280,
            boxShadow: "0 16px 44px rgba(0,0,0,.8)", zIndex: 5,
          }}>
            <div style={{ fontFamily: "var(--lh-sans)", fontSize: 12, color: C.text, fontWeight: 700, marginBottom: 4 }}>{hd ? hd.source : " "}</div>
            <div style={{ fontFamily: "var(--lh-mono)", fontSize: 14, color: hd ? hd.color : C.muted, fontWeight: 700, marginBottom: 6 }}>{hd ? "$" + hd.value + "B  ·  " + Math.round(hd.value / total * 100) + "%" : ""}</div>
            <div style={{ fontFamily: "var(--lh-serif)", fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{hd ? hd.note : ""}</div>
          </div>

          <div style={{ display: "flex", width: "100%", height: 44, borderRadius: 7, overflow: "hidden", border: "1px solid " + C.border }}>
            {financingData.map(function(d, i) {
              var isH = h === i;
              var dim = h !== null && !isH;
              return (
                <div key={d.source} onMouseEnter={enter(i)} onMouseLeave={leave} style={{
                  flex: d.value, background: d.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#0c0907", fontFamily: "var(--lh-mono)", fontSize: 11, fontWeight: 700,
                  borderRight: "1px solid " + C.bg + "50", minWidth: 0,
                  opacity: dim ? 0.3 : 1, transition: "opacity 0.18s", cursor: "pointer",
                }}>{d.value >= 7 ? "$" + d.value + "B" : ""}</div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {financingData.map(function(d, i) {
            var isH = h === i;
            return (
              <div key={d.source} onMouseEnter={enter(i)} onMouseLeave={leave} style={{
                display: "grid", gridTemplateColumns: "12px 1fr 58px", gap: 14, alignItems: "center",
                padding: "10px 12px",
                background: isH ? d.color + "18" : C.surface,
                border: "1px solid " + (isH ? d.color + "99" : C.border),
                borderRadius: 8, transition: "background 0.18s, border-color 0.18s", cursor: "pointer",
              }}>
                <div style={{ width: 10, height: 10, background: d.color, borderRadius: 2 }} />
                <div>
                  <div style={{ fontFamily: "var(--lh-sans)", fontSize: 13, color: C.text, fontWeight: 600 }}>{d.source}</div>
                  <div style={{ fontFamily: "var(--lh-serif)", fontSize: 11.5, color: C.muted, marginTop: 2, lineHeight: 1.45 }}>{d.note}</div>
                </div>
                <div style={{ fontFamily: "var(--lh-mono)", fontSize: 14, color: d.color, fontWeight: 700, textAlign: "right" }}>{"$" + d.value + "B"}</div>
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
          border: "1px solid " + (hov ? C.accent + "44" : C.border),
          borderRadius: 14, padding: "22px 26px 22px",
          position: "relative", overflow: "hidden",
          transition: "background 0.22s, border-color 0.22s",
        }}
      >
        <div style={{
          position: "absolute", right: 16, top: 8,
          fontFamily: "var(--lh-display)", fontSize: 96, fontWeight: 900,
          color: "rgba(200,147,76,0.065)",
          lineHeight: 1, pointerEvents: "none", userSelect: "none",
        }}>{lesson.n}</div>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent, fontWeight: 600, letterSpacing: "0.14em", marginTop: 5, minWidth: 22 }}>{lesson.n}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--lh-display)", fontSize: 19, color: C.text, fontWeight: 700, lineHeight: 1.28, marginBottom: 10 }}>{lesson.title}</div>
            <div style={{ fontFamily: "var(--lh-serif)", fontSize: 15.5, color: C.dim, lineHeight: 1.72 }}>{lesson.body}</div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== MAIN COMPONENT ====================

export default function LegacyHollywood() {
  var [activeChapter, setActiveChapter] = useState("ch0");
  var [showNav, setShowNav] = useState(false);
  var rafRef = useRef(null);
  var lastRef = useRef("ch0");

  useEffect(function() {
    var onScroll = function() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(function() {
        rafRef.current = null;
        setShowNav(window.scrollY > window.innerHeight * 0.7);
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
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "var(--lh-serif)" }}>

      {/* Scoped font imports — prefixed to avoid collision with site globals */}
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Spectral:ital,wght@0,400;0,600;1,400;1,600&family=Jost:wght@300;400;500;600;700&family=Azeret+Mono:wght@400;500;600&display=swap');"}</style>
      <style>{`
        .lh-root {
          --lh-display: 'Bodoni Moda', Georgia, serif;
          --lh-serif:   'Spectral', Georgia, serif;
          --lh-sans:    'Jost', system-ui, sans-serif;
          --lh-mono:    'Azeret Mono', Menlo, monospace;
        }
        :root {
          --lh-display: 'Bodoni Moda', Georgia, serif;
          --lh-serif:   'Spectral', Georgia, serif;
          --lh-sans:    'Jost', system-ui, sans-serif;
          --lh-mono:    'Azeret Mono', Menlo, monospace;
        }
        @keyframes lh-bounceDown {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(6px); opacity: 1; }
        }
      `}</style>

      <ProgressBar />
      <FilmGrain />
      <NavBar active={activeChapter} show={showNav} />

      {/* ========== HERO ========== */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 500,
          background: "radial-gradient(ellipse, rgba(200,147,76,0.09) 0%, transparent 68%)",
          pointerEvents: "none", filter: "blur(60px)",
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 920, margin: "0 auto", padding: "14vh 24px 8vh", width: "100%" }}>
          <HeroReveal delay={80}>
            <div style={{
              fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent,
              letterSpacing: "0.32em", marginBottom: 36, textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.accent + "88" }} />
              A Media M&amp;A Narrative
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.accent + "44" }} />
            </div>
          </HeroReveal>

          <HeroReveal delay={220}>
            <h1 style={{ fontFamily: "var(--lh-display)", margin: "0 0 6px", padding: 0, lineHeight: 1.0 }}>
              <span style={{
                display: "block", fontSize: "clamp(52px, 9vw, 96px)",
                fontWeight: 900, color: C.text, letterSpacing: "-0.03em",
              }}>Legacy Hollywood</span>
              <span style={{
                display: "block", fontSize: "clamp(44px, 7.5vw, 80px)",
                fontWeight: 400, fontStyle: "italic",
                color: C.accent, letterSpacing: "-0.015em", marginTop: "0.08em",
              }}>The Endgame</span>
            </h1>
          </HeroReveal>

          <HeroReveal delay={420}>
            <p style={{
              fontFamily: "var(--lh-serif)", fontSize: 20, lineHeight: 1.58,
              color: C.dim, margin: "32px 0 36px", fontStyle: "italic", maxWidth: 680,
            }}>
              How a thirty-four-day-old company, a Gulf sovereign check, and a twenty-year plan outbid the most valuable streamer on earth for Warner Bros. — and set the terms of whatever media becomes next.
            </p>
          </HeroReveal>

          <HeroReveal delay={560}>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 52,
              fontFamily: "var(--lh-mono)", fontSize: 10, color: C.muted,
              letterSpacing: "0.14em", textTransform: "uppercase", alignItems: "center",
            }}>
              <span>Apr 2026</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>~22 min read</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>25 sources</span>
            </div>
          </HeroReveal>

          <HeroReveal delay={720}>
            <div style={{
              background: C.card, borderRadius: 14,
              padding: "28px 28px 24px", border: "1px solid " + C.border,
              marginBottom: 40,
            }}>
              <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 18, fontWeight: 500 }}>The Paradox In One Chart</div>
              <p style={{ fontFamily: "var(--lh-display)", fontSize: 22, lineHeight: 1.38, color: C.text, margin: "0 0 24px", fontWeight: 400 }}>
                On September 10, 2025, Warner Bros. Discovery traded at{" "}
                <strong style={{ color: C.red, fontWeight: 700 }}>$12.54</strong>. Twenty weeks later it sold for{" "}
                <strong style={{ color: C.accent, fontWeight: 700 }}>$31</strong> a share in cash. The loser walked away because the number got too high.<Rf n={1}/>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, background: C.border, borderRadius: 8, overflow: "hidden" }}>
                {[
                  { val: "$12.54", label: "Undisturbed", col: C.red },
                  { val: "$31.00", label: "Final Offer", col: C.accent },
                  { val: "147%",   label: "Premium",     col: C.gold },
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{ background: C.card, textAlign: "center", padding: "16px 8px 14px" }}>
                      <div style={{ fontFamily: "var(--lh-display)", fontSize: 26, color: s.col, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.val}</div>
                      <div style={{ fontFamily: "var(--lh-mono)", fontSize: 9, color: C.muted, marginTop: 6, letterSpacing: "0.14em", textTransform: "uppercase" }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </HeroReveal>

          <HeroReveal delay={900}>
            <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 12 }}>
              <span>Scroll to begin</span>
              <span style={{ display: "inline-block", animation: "lh-bounceDown 1.8s ease-in-out infinite" }}>↓</span>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ========== CH 00 ========== */}
      <section id="ch0" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="00">Before the Before</H2>
        <P>To understand why Ellison spent 2025 chasing Warner Bros., you have to understand the hole legacy media had dug for itself. In early 2024, Netflix was the only pure streamer ever to turn a sustained profit on content it did not own. Disney had spent half a decade digesting its $71B Fox acquisition. Comcast was spinning its cable networks into a sidecar called Versant. Warner Bros. Discovery, the rubble of a 2022 merger, was trading at a fraction of book value with $37B of debt on its back.<Rf n={13}/></P>
        <P>And Paramount Global — owner of CBS, MTV, Nickelodeon, BET, Pluto TV, and the Paramount lot — was adrift. Shari Redstone had been shopping her family stake for two years. Everyone knew it. The question wasn't whether Paramount would sell; it was to whom, for how much, and on what terms.</P>
        <Ed>The streaming wars had a quiet second act. Phase one was "spend everything to matter." Phase two was "find a partner before your linear business implodes." By 2024, every legacy studio needed a dance card. Four had no one to dance with.</Ed>
        <P>Into that vacuum walked David Ellison, a 39-year-old producer who started Skydance in 2010 on a $350M loan from his father, backed Tom Cruise's biggest films, and now wanted the whole lot.<Rf n={2}/> The son had the ambition. The father had the money. And the father had just spent two decades sitting at the same conference tables as the president of the United States.</P>
      </section>

      {/* ========== CH 01 ========== */}
      <section id="ch1" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="01">The Son Rises</H2>
        <P>In January 2024, Skydance floated an all-cash bid of ~$2.5B for National Amusements, the Redstone holding company. On April 2, Paramount's special committee gave Skydance an exclusive negotiating window. Four weeks later, Sony Pictures and Apollo Global Management walked in with a $26B non-binding proposal for the entire company.<Rf n={2}/></P>
        <P>On April 29, CEO Bob Bakish stepped down after souring on the Skydance talks. On May 3, the exclusive window lapsed. For six weeks three groups circled the wreckage: Skydance, Sony-Apollo, and a rolling cast of PE hopefuls.</P>
        <P>Skydance won by restructuring. The final July 2, 2024 deal was a three-part contraption: $2.4B cash for National Amusements, $4.5B in cash and shares for public Class A/B stockholders, and $1.5B of primary capital injected into the balance sheet. Enterprise value: ~$28B. Headline: $8B.<Rf n={2}/></P>
        <Quote author="David Ellison" role="Chairman &amp; CEO, Paramount Skydance">Today marks day one of a new Paramount — a company built for the next twenty years, not the next two quarters.</Quote>
        <P>The governance trade was the story. Ellison would be chairman and CEO. Jeff Shell, the NBCUniversal veteran Larry Ellison had quietly recruited, would be president. Shari Redstone would walk off the board with $1.75B in her pocket and reportedly some lingering resentment about how thin that check had become.<Rf n={2}/> A $400M breakup fee sat in the contract. None ever did.</P>
      </section>

      {/* ========== CH 02 ========== */}
      <section id="ch2" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="02">The Long Closing</H2>
        <P>Signing the deal was the easy part. What came next was thirteen months of regulatory choreography. The SEC and European Commission waved it through in February 2025.<Rf n={2}/> The FCC was the problem. Trump had returned to the White House with a suit already on file against CBS News, alleging a 60 Minutes edit of a Harris interview constituted &ldquo;election interference.&rdquo; The suit was legally ridiculous. It was also a $16M checkpoint on the way to approval.</P>
        <P>On July 2, 2025, Paramount settled with Trump for $16M.<Rf n={2}/> Twenty-two days later, the FCC approved the merger. Sixteen days after that, the company cancelled <em>The Late Show with Stephen Colbert</em>, whose host had called the settlement &ldquo;a big fat bribe&rdquo; on air. In October, Bari Weiss — founder of The Free Press — was installed as editor-in-chief of CBS News.<Rf n={19}/> The regulatory strategy and the editorial strategy turned out to be the same strategy.</P>
        <Ed>This is the part of the story that unsettles even people who liked the deal. The price of getting Paramount Skydance across the finish line was not just $8B. It was a demonstration to anyone considering the next big media merger: an administration could be paid in editorial concessions. The lesson was learned. It would be applied, twice, to Warner Bros.</Ed>
        <P>On August 7, 2025, the deal closed.<Rf n={3}/> Ellison stood on a soundstage on the Paramount lot and declared it &ldquo;day one of a new Paramount.&rdquo;<Rf n={4}/> Market cap ~$28B. Net debt ~$15B. What nobody in the room mentioned was that Ellison already had another number in mind — one more than three times larger — for what he wanted to buy next.</P>
      </section>

      {/* ========== CH 03 ========== */}
      <section id="ch3" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="03">First Hundred Days</H2>
        <P>Ellison ran Paramount for thirty-four days before his first pass at WBD. The public story was a tech transformation: moving Paramount+, Pluto TV, and BET+ to an Oracle-hosted backend, generative AI across VFX, dubbing, and script work, and a re-up with Tom Cruise for what Ellison called &ldquo;the next twenty years of blockbuster filmmaking.&rdquo;<Rf n={12}/></P>
        <Quote author="David Ellison" role="Hollywood Reporter, October 2025">All of the incentives are aligned for really long, long, long-term success. You make decisions not for two quarters from now, but for five years from now — you make sure that you have something that really stands the test of time for centuries to come.</Quote>
        <P>The private story was an acquisition thesis. WBD was trading at $12.54 on September 10, 2025 — a third of its post-merger price — and David Zaslav was burning credibility every quarter he failed to articulate a streaming plan. Ellison had the cash backing, the tech vision, and a lot to prove. He moved.</P>
        <P>The opening shot, mid-September, was $19/share, roughly 60% cash. Rejected. A week later Ellison came back at $22 with 67% cash and an unusual sweetener: Zaslav would stay on as co-CEO. Rejected. On October 13, $23.50 at 80% cash. Third rejection.<Rf n={1}/> By month-end WBD announced it was formally exploring strategic alternatives. The auction was open.</P>
        <Ed>Three offers in thirty days isn't negotiation. It's a siege. Ellison wasn't finding Zaslav's price; he was flushing other bidders into the open. It worked. Within a month Netflix and Comcast had both put non-binding proposals on the table. Ellison had turned WBD from a sleepy quarterly loser into the most-watched M&amp;A target of the year.</Ed>
      </section>

      {/* ========== CH 04 ========== */}
      <section id="ch4" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="04">Three Bidders, One Prize</H2>
        <P>The auction from November 2025 through February 2026 is — depending on how you count — the most consequential M&amp;A process in American media history. Three buyers, three months, nine bids, a share price that nearly tripled from undisturbed. Here is the ratchet, every move on the board.</P>
        <FadeIn>
          <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 20px 18px", margin: "16px 0 32px" }}>
            <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>WBD offers on the table</div>
            <div style={{ fontFamily: "var(--lh-sans)", fontSize: 15, color: C.text, fontWeight: 600, marginBottom: 20 }}>Per-share price by bid round</div>
            <div style={{ height: 250, marginLeft: -20 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bidData} margin={{ top: 16, right: 20, left: 10, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={C.faint} vertical={false} />
                  <XAxis dataKey="stage" stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--lh-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--lh-mono)" }} axisLine={false} tickLine={false} domain={[0, 34]} tickFormatter={function(v) { return "$" + v; }} />
                  <Tooltip content={<Tip />} cursor={{ fill: C.accent + "10" }} />
                  <ReferenceLine y={12.54} stroke={C.red} strokeDasharray="4 4" label={{ value: "Undisturbed $12.54", position: "insideTopLeft", fill: C.red, fontSize: 10, fontFamily: "var(--lh-mono)" }} />
                  <Bar dataKey="price" radius={[5, 5, 0, 0]} isAnimationActive={true} animationBegin={300} animationDuration={900} animationEasing="ease-out">
                    {bidData.map(function(entry, index) {
                      return <Cell key={"c" + index} fill={entry.bidder === "Netflix" ? C.red : C.accent} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 14, borderTop: "1px solid " + C.border, fontFamily: "var(--lh-sans)", fontSize: 11, color: C.muted }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 10, background: C.accent, borderRadius: 2, display: "inline-block" }} /> Paramount</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ width: 10, height: 10, background: C.red, borderRadius: 2, display: "inline-block" }} /> Netflix</div>
              <div style={{ marginLeft: "auto" }}>Source: WBD filings, Variety, CNBC<Rf n={1}/></div>
            </div>
          </div>
        </FadeIn>
        <P>On November 20, WBD took non-binding first-round bids. Paramount put $25.50/share on the table for the entire company. Netflix bid for studios, HBO, and HBO Max only, leaving linear cable behind. Comcast did the same. On December 1, binding bids were due. Paramount raised to $26.50 all-cash. Netflix and Comcast refined their carve-out proposals.<Rf n={1}/></P>
        <P>On December 4, the WBD board chose Netflix.<Rf n={5}/> $82.7B enterprise value at $27.75/share for the streaming-and-studios company remaining after a linear spin-off. Wells Fargo, HSBC, and BNP Paribas committed $59B in debt financing. Sarandos, who for a decade had branded Netflix a &ldquo;builders, not buyers&rdquo; company, explained why this one was different, and under cinema-operator pressure, pledged a 45-day theatrical window for WBD's biggest releases through 2029.<Rf n={17}/></P>
        <Ed>Here's what everyone missed on December 4: the Netflix deal was a carve-out — crown jewels transferred, cable business spun off into a separate public company. That made sense on a spreadsheet. It also gave Paramount an opening. Because the deal required shareholder approval of <em>both</em> halves, a hostile bidder for the whole company could promise WBD investors something Netflix couldn't: one clean exit price, cash.</Ed>
      </section>

      {/* ========== CH 05 ========== */}
      <section id="ch5" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="05">The Hostile Turn</H2>
        <P>Four days later, on December 8, 2025, Paramount launched an all-cash tender offer for 100% of WBD at $30 a share. The implied enterprise value: about $108B.<Rf n={22}/> The WBD board rejected it inside a week. Ellison&rsquo;s financing partner, Jared Kushner&rsquo;s Affinity Partners, walked. And then, quietly, Larry Ellison stepped in personally to backstop the equity.</P>
        <P>From that point the deal stopped being a normal M&amp;A auction and started being something closer to a multi-front political campaign. Ancora Holdings (a $200M stake) threatened a proxy contest. Pentwater Capital published memos claiming Paramount was &ldquo;economically superior after regulatory risk.&rdquo; Mario Gabelli said GAMCO was &ldquo;highly likely to tender&rdquo; to Paramount. James Cameron warned a Netflix win would gut theatrical. Harris Associates called both bids &ldquo;roughly comparable&rdquo; and sat on its hands.<Rf n={1}/></P>
        <P>On January 13, Netflix converted its offer to all-cash at the same $27.75/share. Nine days later, the Department of Justice issued a Second Request, freezing the clock.<Rf n={1}/> It was the moment the deal died: not because the DOJ objected, but because every WBD shareholder watching the calendar understood Netflix was at least another year from closing. Cash now from Paramount, or paper-maybe later from Netflix.</P>
        <Quote author="David Ellison" role="letter to Senator Cory Booker, February 2026">A Netflix acquisition of Warner Bros. Discovery would harm competition. We are offering shareholders a superior, fully financed, all-cash alternative — and we are offering American consumers a company that is not already a monopsony buyer of talent.</Quote>
        <P>In early February, Paramount filed its 9th offer: still $30 cash, now with a $0.25/share quarterly &ldquo;ticking fee&rdquo; kicking in after Dec 31, 2026, full assumption of the $2.8B Netflix termination fee, and help on WBD financing costs. The bid was designed to make it more expensive for the WBD board to say no than yes.<Rf n={1}/></P>
      </section>

      {/* ========== CH 06 ========== */}
      <section id="ch6" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="06">The Superior Proposal</H2>
        <P>On February 17, the WBD board granted Netflix a seven-day waiver from exclusivity, reopening negotiations with Paramount. On February 19, Paramount's Hart-Scott-Rodino waiting period expired — the only regulatory clock running in parallel with Netflix's DOJ Second Request. Netflix pointed out HSR expiration is not antitrust clearance. Everyone understood what it actually meant: the optics were asymmetric.<Rf n={20}/></P>
        <P>On February 24, Paramount raised to $31/share cash, valuing WBD at ~$110.9B. On February 26, WBD's board formally declared Paramount's bid a &ldquo;superior proposal&rdquo; under the terms of its Netflix merger agreement. Netflix had the contractual right to match. It had exactly twenty-four hours to decide.<Rf n={6}/><Rf n={9}/></P>
        <Quote author="Ted Sarandos &amp; Greg Peters" role="Co-CEOs, Netflix — February 27, 2026">We have always been disciplined, and at the price required to match Paramount Skydance's latest offer, the deal is no longer financially attractive. We are declining to match the Paramount Skydance bid.</Quote>
        <P>It was either the most disciplined capital allocation call Netflix ever made, or the moment it gave up the one chance to own the library of the last great legacy studio. Probably both. Netflix had the cash, the balance sheet, the operating momentum. What it lacked was a backer willing to eat a five-to-seven year integration penalty for a deal no longer obviously accretive at $31. The Ellisons did.</P>
        <Timeline />
        <P>The final agreement was signed on February 27, 2026.<Rf n={23}/> Over the next six weeks Paramount disclosed a financing structure so unusual it deserves its own chart. Roughly $47B in equity commitments — half of it Gulf sovereign — sits alongside $49B in bank debt syndicated across eighteen lenders led by BofA, Citi, and Apollo. The three Gulf investors took non-voting stakes to avoid triggering a CFIUS review. The Ellison family and RedBird keep 100% of the voting shares.<Rf n={10}/><Rf n={25}/></P>
        <FinancingChart />
      </section>

      {/* ========== CH 07 ========== */}
      <section id="ch7" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="07">What They Bought</H2>
        <P>Subject to regulatory approval, here is what Ellison will own when the dust settles. It is the largest media asset in private ownership since AOL Time Warner in 2000. Whether that comparison is flattering or a warning depends on the next five years.<Rf n={13}/></P>
        <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, margin: "12px 0 32px" }}>
            <StatCard value="$111B" label="Deal Value" sub="$31/share, all-cash" color={C.accent} />
            <StatCard value="$70B" label="Combined Revenue" sub="Pro forma" color={C.accent2} />
            <StatCard value="~207M" label="Streaming Subs" sub="HBO Max + Paramount+" color={C.gold} />
            <StatCard value="$16B" label="Adj. EBITDA" sub="Pre-synergy" color={C.blue} />
            <StatCard value="$79B" label="Net Debt" sub="~5× leverage day one" color={C.red} />
            <StatCard value="$6B" label="Synergy Target" sub="Non-labor, per Ellison" color={C.green} />
          </div>
        </FadeIn>
        <P>The combined box office math is where the scale becomes clear. WB alone took roughly 21% of 2025 US domestic box office; Paramount added 6%. Together — if the combined studio holds that share — the new company sits shoulder-to-shoulder with Disney's 28%, leaving Netflix's theatrical presence (essentially zero) as a structural weakness for the first time in a decade.<Rf n={13}/></P>
        <FadeIn>
          <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "22px 20px 18px", margin: "12px 0 32px" }}>
            <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 6, fontWeight: 500 }}>2025 US domestic box office share</div>
            <div style={{ fontFamily: "var(--lh-sans)", fontSize: 14, color: C.muted, marginBottom: 20 }}>Combined Paramount-Warner would overtake Disney.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {boxOffice2025.map(function(d) {
                return (
                  <div key={d.name} style={{
                    flex: "1 1 " + (d.value * 3) + "%", minWidth: 90,
                    background: d.color + "16", border: "1px solid " + d.color + "40",
                    borderRadius: 9, padding: "12px 12px 10px",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: d.color }} />
                    <div style={{ color: C.text, fontSize: 12.5, fontWeight: 600, fontFamily: "var(--lh-sans)" }}>{d.name}</div>
                    <div style={{ color: d.color, fontSize: 22, fontWeight: 700, fontFamily: "var(--lh-mono)", marginTop: 4 }}>{d.value + "%"}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14, padding: "12px 14px", background: C.accent + "11", border: "1px solid " + C.accent + "30", borderRadius: 9, fontFamily: "var(--lh-sans)", fontSize: 13, color: C.text }}>
              <strong style={{ color: C.accent }}>Combined Paramount-Warner:</strong> 27% — a single market point below Disney.<Rf n={13}/>
            </div>
          </div>
        </FadeIn>
        <P>On streaming, Ellison has announced HBO Max and Paramount+ will collapse into a single service.<Rf n={16}/> The headline number is ~207M subs, though roughly 25% of HBO Max subs in the US already pay for Paramount+, so the real post-integration number will be lower. Either way, the combined entity is the second-largest English-language subscription streamer by volume, behind Netflix's 325M, ahead of Amazon and Disney+.<Rf n={21}/></P>
        <P>Unlike Comcast, which spun its cable networks into Versant to shed the linear drag, Ellison has said flatly that Paramount keeps the whole portfolio: HBO, CNN, TNT, TBS, Discovery, Food, HGTV, TLC, Cartoon Network, Adult Swim, Showtime, MTV, Nickelodeon, BET, Comedy Central, Paramount Network, and more.<Rf n={15}/> That is more than forty cable brands under a single corporate roof — the largest linear portfolio left in the private sector.</P>
        <Ed>The strategic bet is simple and contrarian: linear TV is dying slower than anyone thinks, and the cash it throws off in the next five years is worth more than the optionality of selling it today. Every other major media company disagrees. If Ellison is right, Paramount becomes the last great cash-on-cash media compounder. If he&rsquo;s wrong, the debt eats him.</Ed>
      </section>

      {/* ========== CH 08 ========== */}
      <section id="ch8" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="08">The Next Act</H2>
        <P>The auction is over. The regulatory fight is not. HSR lapsed Feb 19 without DOJ action, but the DOJ antitrust chief went on record saying the review would &ldquo;absolutely not&rdquo; be fast-tracked for political reasons.<Rf n={20}/> CA AG Rob Bonta opened a state review the same day. Eight Senate Democrats, led by Cory Booker, demanded documentation of every Paramount contact with the Trump administration. Senator Elizabeth Warren called the deal &ldquo;an antitrust disaster.&rdquo; The International Brotherhood of Teamsters demanded the DOJ block the merger unless Paramount agreed to &ldquo;substantial and enforceable&rdquo; safeguards covering its 15,000 Motion Picture Teamsters.<Rf n={18}/><Rf n={24}/></P>
        <P>Assume the deal closes by mid-2027. What kind of industry does that produce? Nobody — including the Ellisons — knows yet. But the rough shape is legible: four English-language media organizations large enough to matter at global scale — Netflix, Disney, Paramount-Warner, Amazon — with YouTube hovering as the uncategorizable fifth. Comcast/NBCUniversal has voluntarily shrunk into a studio-plus-theme-parks company. Everyone else — AMC Networks, Lionsgate, the mini-studios — is either an acquisition target or a specialist.<Rf n={13}/></P>
        <Quote author="Michael Nathanson" role="Senior media analyst, MoffettNathanson / Yale Insights">For Netflix, Warner Bros. would have been nice to have. Paramount needed it. This is the endgame for the streaming media industry.</Quote>
        <P>Inside Paramount-Warner, three bets get placed at once. First, AI. Oracle will run the streaming backend; generative tools get pushed into VFX, dubbing, de-aging, and pre-viz. Ellison has described a future where you can &ldquo;have a conversation with your favorite character&rdquo; — a product no legacy studio has yet built.<Rf n={11}/> Second, theatrical: 30 releases a year (15 per studio) and the 45-day window preserved. Third, bundling — HBO + Showtime, Discovery + Nickelodeon, CNN + CBS News, a full-stack distribution apparatus that negotiates with YouTube TV and Hulu Live from a position of parity.</P>
        <P>All three bets depend on the one thing Ellison can't buy: time. Linear TV continues its ~6% annual decline. Streaming margins are compressing. Debt service on $79B starts day one. And Netflix, which walked at $31, is sitting on the largest cash pile in media, hunting for content investments that don't require integrating a cable portfolio or a 10,000-person newsroom.<Rf n={14}/> If Ellison can get through the next twenty-four months without a credit downgrade, a creative exodus, or a political realignment that turns the DOJ review hostile, he has a fighting chance. A lot of <em>ifs</em>.</P>
        <Ed>Scott Galloway&rsquo;s prediction, written the week the Netflix deal was signed: Bob Iger and David Zaslav will be out within twelve to twenty-four months. Traditional Hollywood leadership, he argued, is facing an opponent with capital, technology, and political access it cannot match. You don&rsquo;t have to agree with the prediction to notice the second-order implication: if the Ellisons win, Hollywood becomes a two-family business — theirs and the Iger succession at Disney. Everyone else is a vendor.</Ed>
      </section>

      {/* ========== CH 09 PLAYBOOK ========== */}
      <section id="ch9" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="09">The Playbook</H2>
        <P>Whatever you think of the Ellisons, David&rsquo;s path from a Skydance producer credit to a $111B acquisition in twenty months is a master class in offensive M&amp;A. Here are the transferable lessons — not because you&rsquo;ll ever buy a studio, but because the playbook generalizes to any contested auction, any time.</P>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {playbookLessons.map(function(l) {
            return <PlaybookCard key={l.n} lesson={l} />;
          })}
        </div>
        <div style={{ marginTop: 56 }}>
          <P>The auction is done. The hard part starts now. Running a media company is a different sport from buying one, and David Ellison just inherited two of them on top of the one he was still learning. The next chapter is operational: whether a tech-forward, AI-native, politically-connected, Gulf-financed studio-and-cable-and-streaming conglomerate can produce the hits, ratings, margins, and cash flow that $79B of debt demands.</P>
          <FadeIn>
            <p style={{ fontFamily: "var(--lh-display)", fontSize: 22, fontStyle: "italic", color: C.accent, margin: "32px 0 0", maxWidth: 640, lineHeight: 1.42 }}>
              That is the next chapter. And it has not been written yet.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ========== SOURCES ========== */}
      <section id="lh-sources" style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px 80px" }}>
        <FadeIn>
          <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.26em", marginBottom: 12, textTransform: "uppercase", fontWeight: 500 }}>Methodology</div>
          <h2 style={{ fontFamily: "var(--lh-display)", fontSize: 36, fontWeight: 700, color: C.text, margin: "0 0 22px", letterSpacing: "-0.02em" }}>Sources &amp; Corrections</h2>
          <p style={{ fontFamily: "var(--lh-serif)", fontSize: 16, color: C.dim, lineHeight: 1.76, margin: "0 0 32px", maxWidth: 680 }}>Every figure and quote was verified against at least one primary source. Where reporting differed, the WBD press release or Paramount 8-K was used.</p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: "20px 20px 16px", marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, marginBottom: 14 }}>Corrections Applied</div>
            <div style={{ fontFamily: "var(--lh-serif)", fontSize: 14.5, color: C.dim, lineHeight: 1.7 }}>
              <div style={{ marginBottom: 10 }}>&bull; Paramount's Dec 8 hostile tender was first reported at $108B EV; subsequent filings clarified this as $30/share. We use the per-share figure.</div>
              <div style={{ marginBottom: 10 }}>&bull; "$110B" and "$111B" both circulated; the formal value in the Feb 27 agreement is $110.9B. We round to $111B in stat cards.</div>
              <div>&bull; ~207M combined subs is pro forma from Paramount's March 2 integration statement; will shrink once ~25% HBO Max/Paramount+ overlap is netted.<Rf n={16}/></div>
            </div>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gap: 7 }}>
          {sources.map(function(s, i) {
            return (
              <FadeIn key={s.n} delay={i * 0.012}>
                <a href={s.url} target="_blank" rel="noreferrer" style={{
                  display: "grid", gridTemplateColumns: "36px 1fr", gap: 10,
                  padding: "11px 14px", background: C.surface, border: "1px solid " + C.border,
                  borderRadius: 8, textDecoration: "none", fontFamily: "var(--lh-sans)",
                  transition: "background 0.18s, border-color 0.18s",
                }}>
                  <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.accent, fontWeight: 600 }}>{"[" + s.n + "]"}</div>
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
          width: 400, height: 200,
          background: "radial-gradient(ellipse, rgba(200,147,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontFamily: "var(--lh-display)", fontSize: 20, color: C.accent, fontStyle: "italic", marginBottom: 8 }}>Legacy Hollywood: The Endgame</div>
        <div style={{ fontFamily: "var(--lh-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.22em", textTransform: "uppercase" }}>A narrative by Claude &middot; April 2026</div>
      </footer>

    </div>
  );
}
