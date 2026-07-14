import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo";
import ResearchFooter from "../../components/ResearchFooter";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, BarChart
} from "recharts";

// ==================== DATA ====================

const chapters = [
  { id: "ch0",  num: "00", short: "Prelude",      title: "The Ambition Declared" },
  { id: "ch1",  num: "01", short: "Architects",   title: "The Architects" },
  { id: "ch2",  num: "02", short: "Opening Act",  title: "November First" },
  { id: "ch3",  num: "03", short: "Ecosystem",    title: "The Ecosystem Play" },
  { id: "ch4",  num: "04", short: "Ted Lasso",    title: "The Breakout" },
  { id: "ch5",  num: "05", short: "Oscar",        title: "The Trophy" },
  { id: "ch6",  num: "06", short: "Sci-Fi",       title: "The Niche" },
  { id: "ch7",  num: "07", short: "Severance",    title: "The Franchise" },
  { id: "ch8",  num: "08", short: "Records",      title: "The Record Books" },
  { id: "ch9",  num: "09", short: "Ledger",       title: "The Ledger" },
  { id: "ch10", num: "10", short: "Long Game",    title: "The Long Game" },
];

const stats = [
  { v: "81",      k: "Emmy nominations, 2025" },
  { v: "620+",    k: "Total award wins, all shows" },
  { v: "$20B+",   k: "Total content investment since launch" },
  { v: "~45M",    k: "Estimated paying subscribers, 2025" },
];

const emmyData = [
  { year: "2021", noms: 35,  wins: 11, note: "Ted Lasso — freshman record (20 noms)" },
  { year: "2022", noms: 52,  wins: 20, note: "Ted Lasso back-to-back OCS" },
  { year: "2023", noms: 54,  wins: 8,  note: "Severance, The Morning Show" },
  { year: "2024", noms: 72,  wins: 17, note: "Record; Slow Horses, Lessons in Chemistry" },
  { year: "2025", noms: 81,  wins: 22, note: "The Studio 13 wins; Severance 8 wins" },
];

const scifiShows = [
  {
    title: "For All Mankind",
    years: "2019 — Present",
    creator: "Ronald D. Moore",
    logline: "The Soviets land on the moon first. An alternate history that keeps getting better each decade it jumps.",
    rt: 90,
    seasons: "5 seasons + spinoff 'Star City'",
    tag: "Alternate History"
  },
  {
    title: "Severance",
    years: "2022 — Present",
    creator: "Dan Erickson",
    logline: "Corporate paranoia dressed as science fiction. Season 2 became Apple's most-watched series ever.",
    rt: 97,
    seasons: "2 seasons; renewed",
    tag: "Corporate Sci-Fi"
  },
  {
    title: "Foundation",
    years: "2021 — Present",
    creator: "David S. Goyer",
    logline: "Isaac Asimov's unfilmable thousand-year epic — finally filmed, at a scale only Apple would fund.",
    rt: 87,
    seasons: "3 seasons",
    tag: "Epic Sci-Fi"
  },
  {
    title: "Silo",
    years: "2023 — Present",
    creator: "Graham Yost",
    logline: "Ten thousand people live underground. Nobody knows why. Season 2 earned 96% on Rotten Tomatoes.",
    rt: 92,
    seasons: "2 seasons; renewed",
    tag: "Post-Apocalyptic"
  },
  {
    title: "Invasion",
    years: "2021 — Present",
    creator: "Simon Kinberg & David Weil",
    logline: "A slow-burn global alien arrival seen through five different civilian lenses simultaneously.",
    rt: 72,
    seasons: "3 seasons",
    tag: "Alien Invasion"
  },
  {
    title: "Constellation",
    years: "2024",
    creator: "Peter Harness",
    logline: "An astronaut returns from the ISS to find her life has been quietly replaced. Psychological and precise.",
    rt: 80,
    seasons: "1 season",
    tag: "Psychological"
  },
];

const priceHistory = [
  { year: "Nov 2019", price: 4.99,  label: "Launch — cheapest major streamer" },
  { year: "Oct 2022", price: 6.99,  label: "+$2/mo — first increase" },
  { year: "Oct 2023", price: 9.99,  label: "+$3/mo — 100% premium vs. launch" },
  { year: "2025",     price: 10.99, label: "+$1/mo — incremental" },
];

const contentSpendData = [
  { year: "2020", spend: 2.0 },
  { year: "2021", spend: 3.5 },
  { year: "2022", spend: 5.0 },
  { year: "2023", spend: 5.2 },
  { year: "2024", spend: 4.5 },
];

const appleTimeline = [
  { yr: "2016", t: "Tim Cook: 'Of Intense Interest'", d: "Apple's CEO publicly declares TV the company's next frontier. Negotiations with cable networks stall." },
  { yr: "Jun 2017", t: "Van Amburg & Erlicht Hired", d: "Sony Pictures Television's co-presidents — the architects of Breaking Bad and Better Call Saul — join Apple, reporting to Eddy Cue." },
  { yr: "Nov 2019", t: "Apple TV+ Launches", d: "$4.99/month. One year free with any new Apple device. The Morning Show, For All Mankind, See, Dickinson." },
  { yr: "Aug 2020", t: "Ted Lasso Premieres", d: "A football-ignorant American coach inherits an English soccer team. Critics give it 90%. The sleeper hit nobody predicted." },
  { yr: "Sep 2021", t: "First Emmys: 11 Wins", d: "Ted Lasso wins Outstanding Comedy Series and six more. 20 nominations — the most ever for a freshman comedy in Emmy history." },
  { yr: "Mar 2022", t: "CODA Wins Best Picture", d: "Apple becomes the first streaming service to win the Academy Award for Best Picture — beating Netflix to the punch." },
  { yr: "Jan 2022", t: "Severance Premieres", d: "The Lumon Industries saga begins. A disorienting, brilliant corporate horror show. Season 1 earns 97% on Rotten Tomatoes." },
  { yr: "Sep 2022", t: "Ted Lasso: Back-to-Back", d: "Wins Outstanding Comedy Series for the second consecutive year. Apple scores 52 Emmy nominations total." },
  { yr: "Aug 2023", t: "Silo Premieres", d: "Graham Yost adapts Hugh Howey's sci-fi novels. Rebecca Ferguson carries it to become a global streaming hit." },
  { yr: "Sep 2024", t: "Record 72 Emmy Noms", d: "Apple sets a new nominations record across 15 titles. Cumulative award wins pass 499 across all major ceremonies." },
  { yr: "Jan 2025", t: "Severance S2 Breaks Records", d: "Season 2 posts a 218% increase in minutes watched vs. Season 1's first 12-week run. Becomes Apple TV+'s #1 series ever." },
  { yr: "Mar 2025", t: "The Studio Premieres", d: "Seth Rogen's Hollywood satire. 23 Emmy nominations — shattering the freshman comedy record Ted Lasso set in 2021." },
  { yr: "Jun 2025", t: "F1: The Movie — $631.5M", d: "Brad Pitt's racing drama becomes the highest-grossing sports film in history. Apple's biggest theatrical win." },
  { yr: "Sep 2025", t: "Record 22 Emmy Wins", d: "81 nominations, 22 wins. The Studio wins 13 (most-winning series of the year; most-winning freshman comedy in Emmy history)." },
  { yr: "Oct 2025", t: "Exclusive F1 Streaming Deal", d: "Apple signs a 5-year, ~$750M deal for exclusive US Formula 1 streaming rights starting in 2026." },
];

const ledger = [
  { k: "Launch date",                           v: "November 1, 2019" },
  { k: "Launch price",                          v: "$4.99 / month" },
  { k: "Current price (2025)",                  v: "$10.99 / month" },
  { k: "Estimated subscribers (2025)",          v: "~45 million" },
  { k: "Annual content spend (2024)",           v: "~$4.5 billion" },
  { k: "Total content investment since launch", v: "$20 billion+" },
  { k: "Annual losses (2025 est.)",             v: "$1 billion+" },
  { k: "Emmy nominations — 2025",               v: "81 (record)" },
  { k: "Emmy wins — 2025",                      v: "22 (record)" },
  { k: "Total Emmy wins (Primetime)",           v: "~61" },
  { k: "Total award wins, all shows",           v: "620+" },
  { k: "Academy Awards — Best Picture",         v: "1 (CODA, 2022) — first for any streamer" },
  { k: "F1: The Movie worldwide gross",         v: "$631.5 million" },
  { k: "F1 US streaming deal (5-year)",         v: "~$750 million" },
];

const sources = [
  {
    group: "Origin Story & Key Executives",
    items: [
      { num: 1,  t: "Apple Taps Sony TV's Zack Van Amburg & Jamie Erlicht As Heads Of Programming", p: "Deadline", url: "https://deadline.com/2017/06/apple-jamie-erlicht-zack-van-amburg-as-heads-of-programming-sony-tv-1202114604/" },
      { num: 2,  t: "Zack Van Amburg & Jamie Erlicht Drive Apple TV+ To Top Of The Streaming Heap", p: "Deadline Disruptors", url: "https://deadline.com/2022/05/jamie-erlicht-zack-van-amburg-apple-tv-plus-coda1235025078-1235025078/" },
      { num: 3,  t: "Apple TV Plus Chiefs Jamie Erlicht, Zack Van Amburg on Their Strategy", p: "Variety", url: "https://variety.com/2019/tv/news/apple-tv-plus-jamie-erlicht-zack-van-amburg-interview-1203386227/" },
      { num: 4,  t: "Apple hires Sony's Jamie Erlicht and Zack Van Amburg in original content push", p: "TechCrunch", url: "https://techcrunch.com/2017/06/16/apple-hires-sonys-jamie-erlicht-and-zack-van-amburg-in-original-content-push/" },
      { num: 5,  t: "Eddy Cue", p: "Wikipedia", url: "https://en.wikipedia.org/wiki/Eddy_Cue" },
      { num: 6,  t: "We needed to build this ourselves — Eddy Cue, Van Amburg and Erlicht on the F1 Emmys", p: "Screen Daily", url: "https://www.screendaily.com/features/apple-content-team-on-f1-emmys-success-and-launching-a-platform/5210477.article" },
    ]
  },
  {
    group: "Launch & Subscriber Growth",
    items: [
      { num: 7,  t: "Apple TV+ to launch November 1 for $4.99/month, one year free with Apple devices", p: "TechCrunch", url: "https://techcrunch.com/2019/09/10/apple-tv-to-launch-november-1-for-4-99-month-one-year-free-comes-with-select-apple-devices/" },
      { num: 8,  t: "Apple TV+ is now available", p: "Apple Newsroom", url: "https://www.apple.com/newsroom/2019/11/apple-tv-plus-is-now-available/" },
      { num: 9,  t: "Apple Is Losing Over $1 Billion per Year on Streaming Service, Has 45 Million Apple TV+ Subscribers (Report)", p: "Variety", url: "https://variety.com/2025/digital/news/apple-tv-plus-streaming-losses-1-billion-per-year-1236344052/" },
      { num: 10, t: "Apple TV+ raises monthly subscription price to $9.99", p: "CNBC", url: "https://www.cnbc.com/2023/10/25/apple-raises-price-of-apple-tv-to-9point99-a-month.html" },
    ]
  },
  {
    group: "Content Spend & Financial Performance",
    items: [
      { num: 11, t: "Apple reportedly reducing TV+ spend after $20 billion content investment", p: "MobileSyrup", url: "https://mobilesyrup.com/2024/07/22/apple-tv-plus-less-spending-report/" },
      { num: 12, t: "Apple TV+ budgets targeted as Apple trims video costs", p: "AppleInsider", url: "https://appleinsider.com/articles/24/07/22/partys-over-apple-tries-to-shrink-costs-of-apple-tv-productions" },
      { num: 13, t: "Report: Executives Scrutinize Apple TV+ Costs Amid $1 Billion Annual Losses", p: "PYMNTS", url: "https://www.pymnts.com/apple/2025/report-executives-scrutinize-apple-tv-costs-amid-1-billion-annual-losses/" },
    ]
  },
  {
    group: "Ted Lasso",
    items: [
      { num: 14, t: "Apple's Ted Lasso scores history-making win for Outstanding Comedy Series", p: "Apple Newsroom", url: "https://www.apple.com/newsroom/2021/09/apples-global-hit-comedy-series-ted-lasso-sweeps-the-2021-primetime-emmy-awards-scoring-history-making-win-for-outstanding-comedy-series/" },
      { num: 15, t: "Apple's Ted Lasso wins back-to-back Emmy Awards for Outstanding Comedy Series", p: "Apple Newsroom", url: "https://www.apple.com/newsroom/2022/09/apples-ted-lasso-wins-back-to-back-emmy-awards-for-outstanding-comedy-series/" },
      { num: 16, t: "Ted Lasso Jumps To No. 1 Most Watched Program On Apple TV+ Following Record Emmy Nominations", p: "Deadline", url: "https://deadline.com/2021/07/ted-lasso-ratings-apple-tv-plus-emmy-nominations-schmigadoon-physical-1234797724/" },
    ]
  },
  {
    group: "CODA & Oscar Win",
    items: [
      { num: 17, t: "CODA wins Best Picture: Apple becomes first streaming service to get Oscars top prize", p: "9to5Mac", url: "https://9to5mac.com/2022/03/28/coda-apple-tv-oscar-best-picture/" },
      { num: 18, t: "Apple's CODA wins historic Oscar for Best Picture at the Academy Awards", p: "Apple Newsroom", url: "https://www.apple.com/newsroom/2022/03/apples-coda-wins-historic-oscar-for-best-picture-at-the-academy-awards/" },
      { num: 19, t: "Apple First Streamer to Win Best Picture Oscar for CODA", p: "Variety", url: "https://variety.com/2022/film/news/apple-best-picture-oscar-coda-1235213717/" },
    ]
  },
  {
    group: "Severance",
    items: [
      { num: 20, t: "Severance Surpasses Ted Lasso To Become Apple TV+'s Most Watched Series With Season 2 Launch", p: "Deadline", url: "https://deadline.com/2025/02/severance-ratings-season-2-apple-most-watched-series-1236294760/" },
      { num: 21, t: "Severance Surge Resets Bar for Second-Season Audience Growth", p: "Luminate", url: "https://luminatedata.com/blog/severance-surge-resets-bar-for-second-season-audience-growth/" },
      { num: 22, t: "Apple TV+ Viewership Is Surging — Is It the Severance Halo?", p: "Variety", url: "https://variety.com/vip/severance-season-2-apple-tv-plus-viewership-1236315842/" },
      { num: 23, t: "Apple Acquires 'Severance', Eyes Season 3 Start & Season 4", p: "Deadline", url: "https://deadline.com/2026/02/apple-acquires-severance-more-seasons-1236695148/" },
    ]
  },
  {
    group: "The Studio & 2025 Emmy Records",
    items: [
      { num: 24, t: "Apple lands record-breaking 81 Emmy Award nominations with Severance leading", p: "Apple Newsroom", url: "https://www.apple.com/newsroom/2025/07/apple-lands-record-breaking-81-emmy-award-nominations-with-severance-leading/" },
      { num: 25, t: "Apple TV+ scores a record-breaking 22 wins at the 77th Primetime Emmy Awards", p: "FilmInk", url: "https://www.filmink.com.au/public-notice/apple-tv-scores-a-record-breaking-22-wins-at-the-77th-primetime-emmy-awards/" },
      { num: 26, t: "Apple's The Studio sweeps as the most-winning freshman comedy in Emmy history", p: "Apple Newsroom", url: "https://www.apple.com/newsroom/2025/09/apples-the-studio-sweeps-as-the-most-winning-freshman-comedy-in-emmy-history/" },
      { num: 27, t: "Seth Rogen's The Studio Dominates 2025 Emmys With 13 Wins", p: "LA Mag", url: "https://lamag.com/arts-and-entertainment/primetime-emmy-awards-2025-winners-list/" },
      { num: 28, t: "The Studio Makes Emmys History as the Most Awarded Comedy Ever", p: "Variety", url: "https://variety.com/2025/tv/awards/the-studio-emmy-record-1236510814/" },
    ]
  },
  {
    group: "Sci-Fi Strategy",
    items: [
      { num: 29, t: "Apple TV+ Is Quietly Building a Sci-Fi Empire", p: "WebProNews", url: "https://www.webpronews.com/apple-tv-is-quietly-building-a-sci-fi-empire-and-the-rest-of-hollywood-should-be-paying-attention/" },
      { num: 30, t: "Apple TV Officially Confirms It's the King of Sci-Fi This Week", p: "MovieWeb", url: "https://movieweb.com/star-city-for-all-mankind-spinoff/" },
      { num: 31, t: "For All Mankind renewed for Season 5 and new spinoff Star City", p: "Apple TV Press", url: "https://www.apple.com/tv-pr/news/2024/04/apple-renews-globally-acclaimed-hit-space-drama-for-all-mankind-for-season-five-and-announces-new-spinoff-series-star-city/" },
      { num: 32, t: "Silo Season 2 streaming success on Apple TV+", p: "Collider", url: "https://collider.com/silo-apple-tv-streaming-success-2025/" },
    ]
  },
  {
    group: "Sports & The F1 Play",
    items: [
      { num: 33, t: "Apple becomes broadcast partner for Formula 1 in the United States", p: "Formula 1", url: "https://www.formula1.com/en/latest/article/apple-becomes-broadcast-partner-for-formula-1-in-the-united-states.gtHt80hxS64ZMYxi36wAB" },
      { num: 34, t: "Apple TV, Formula 1 US Streaming Deal Estimated Worth $750 Million", p: "Variety", url: "https://variety.com/2025/tv/news/apple-tv-formula-one-five-year-us-streaming-deal-1236554733/" },
      { num: 35, t: "Apple's F1 Movie tops $600M at worldwide box office", p: "9to5Mac", url: "https://9to5mac.com/2025/08/25/apples-f1-movie-tops-600m-at-worldwide-box-office-surpassing-all-expectations/" },
      { num: 36, t: "Apple's F1 Movie Becomes Highest-Grossing Original of 2025", p: "Fortress of Solitude", url: "https://www.fortressofsolitude.co.za/apples-f1-movie-highest-grossing-original-2025-brad-pitt-biggest-global-gross/" },
    ]
  },
  {
    group: "Martin Scorsese & Talent Deals",
    items: [
      { num: 37, t: "Martin Scorsese Apple First-Look Film TV Deal For His Sikelia Banner", p: "Deadline", url: "https://deadline.com/2020/08/martin-scorsese-apple-first-look-deal-sikelia-productions-killers-of-the-flower-moon-1203010010/" },
      { num: 38, t: "Vince Gilligan Next Series Starring Rhea Seehorn Lands At Apple TV+", p: "Deadline", url: "https://deadline.com/2022/09/vince-gilligan-next-series-rhea-seehorn-star-apple-tv-plus-two-season-order-1235124488/" },
    ]
  },
];

// ==================== DESIGN SYSTEM ====================

const C = {
  bg:      "#08080d",
  surface: "#0e0e18",
  card:    "#13131f",
  cardH:   "#1a1a2a",
  text:    "#f5f5f7",
  dim:     "#a8a8b8",
  muted:   "#5c5c70",
  faint:   "#161625",
  border:  "#1e1e30",
  // Apple blue accent
  blue:    "#147ce5",
  blueH:   "#3398ff",
  blueDim: "#0a4fa0",
  silver:  "#d1d1d6",
  steel:   "#636375",
};

// ==================== GLOBAL UTILITIES ====================

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
      background: "linear-gradient(90deg, " + C.blueDim + " 0%, " + C.blueH + " 100%)",
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
    }, { threshold: 0.05 });
    obs.observe(el);
    return function() { obs.disconnect(); };
  }, []);
  var d = delay || 0;
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1) " + d + "ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) " + d + "ms"
    }}>{children}</div>
  );
}

// ==================== TYPOGRAPHY ====================

function H2({ children, id }) {
  return (
    <FadeIn>
      <h2 id={id} style={{
        fontFamily: "var(--ds-display)",
        fontSize: "clamp(26px, 4vw, 36px)",
        lineHeight: 1.14,
        letterSpacing: "-0.014em",
        color: C.text,
        margin: "66px 0 8px",
        fontWeight: 500,
        scrollMarginTop: 64
      }}>{children}</h2>
    </FadeIn>
  );
}

function ChapterRule({ num }) {
  return (
    <FadeIn>
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "0 0 28px" }}>
        <span style={{
          fontFamily: "var(--ds-mono)", fontSize: 10.5, color: C.blue,
          letterSpacing: "0.3em", textTransform: "uppercase"
        }}>{num}</span>
        <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, " + C.blue + "55, transparent)" }} />
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
        lineHeight: 1.8,
        color: C.dim,
        margin: "0 0 24px"
      }}>
        {first ? (
          <span style={{
            float: "left",
            fontFamily: "var(--ds-display)",
            fontSize: 64,
            lineHeight: 0.84,
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
        lineHeight: 1.66,
        color: C.text,
        margin: "0 0 28px",
        fontStyle: "italic",
        borderLeft: "2px solid " + C.blue,
        paddingLeft: 18
      }}>{children}</p>
    </FadeIn>
  );
}

function Epigraph({ children, cite }) {
  return (
    <FadeIn>
      <figure style={{
        margin: "32px 0",
        padding: "28px 30px",
        background: C.card,
        border: "1px solid " + C.border,
        borderLeft: "3px solid " + C.blue,
        borderRadius: 4
      }}>
        <blockquote style={{
          fontFamily: "var(--ds-display)",
          fontSize: 20,
          lineHeight: 1.58,
          color: C.text,
          fontStyle: "italic",
          margin: 0
        }}>{children}</blockquote>
        {cite && (
          <figcaption style={{
            fontFamily: "var(--ds-mono)", fontSize: 10.5, color: C.blue,
            letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 16
          }}>{cite}</figcaption>
        )}
      </figure>
    </FadeIn>
  );
}

function PullQuote({ children }) {
  return (
    <FadeIn>
      <div style={{ margin: "48px 0", textAlign: "center", padding: "0 6px" }}>
        <div style={{ display: "inline-block", width: 40, height: 1, background: C.blue + "66", marginBottom: 22 }} />
        <div style={{
          fontFamily: "var(--ds-display)",
          fontSize: "clamp(21px, 3.2vw, 29px)",
          lineHeight: 1.42,
          color: C.silver,
          fontStyle: "italic",
          fontWeight: 500,
          maxWidth: 680,
          margin: "0 auto"
        }}>{children}</div>
        <div style={{ display: "inline-block", width: 40, height: 1, background: C.blue + "66", marginTop: 22 }} />
      </div>
    </FadeIn>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: "var(--ds-mono)", fontSize: 10, color: C.blue,
      letterSpacing: "0.26em", textTransform: "uppercase",
      marginBottom: 20, display: "flex", alignItems: "center", gap: 12
    }}>
      <span style={{ display: "inline-block", width: 20, height: 1, background: C.blue + "77" }} />
      {children}
    </div>
  );
}

function Cite({ num }) {
  return (
    <sup style={{ lineHeight: 0 }}>
      <a href={"#ref-" + num} style={{
        color: C.blue,
        textDecoration: "none",
        fontFamily: "var(--ds-mono)",
        fontSize: 10,
        fontWeight: 600,
        padding: "0 1px"
      }}>[{num}]</a>
    </sup>
  );
}

function Panel({ children, style }) {
  return (
    <FadeIn>
      <div style={{
        background: C.surface,
        border: "1px solid " + C.border,
        borderRadius: 14,
        padding: "28px 26px",
        margin: "38px 0 46px",
        ...style
      }}>{children}</div>
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
      background: C.bg + "f2",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid " + C.faint,
      transform: show ? "translateY(0)" : "translateY(-100%)",
      transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1)"
    }}>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, " + C.blue + "55, transparent)" }} />
      <div style={{ maxWidth: 940, margin: "0 auto", display: "flex", alignItems: "center", paddingRight: 14 }}>
        <div ref={navRef} className="ds-navscroll" style={{ flex: 1, minWidth: 0, display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
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
                  fontSize: 10.5, fontWeight: isA ? 600 : 400,
                  whiteSpace: "nowrap",
                  color: isA ? C.blue : C.muted,
                  borderBottom: "2px solid " + (isA ? C.blue : "transparent"),
                  textDecoration: "none",
                  fontFamily: "var(--ds-sans)",
                  transition: "color 0.2s, border-color 0.2s",
                  letterSpacing: "0.06em"
                }}>{ch.num + " — " + ch.short}</a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function BackButton() {
  return (
    <Link to="/research"
      aria-label="Back to research"
      className="ds-back"
      style={{
        position: "fixed",
        bottom: 28,
        left: 24,
        zIndex: 200,
        opacity: 0.88,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "9px 14px",
        background: "rgba(8,8,13,0.84)",
        backdropFilter: "blur(14px) saturate(1.5)",
        WebkitBackdropFilter: "blur(14px) saturate(1.5)",
        border: "1px solid " + C.border,
        borderRadius: 999,
        color: C.dim,
        fontFamily: "var(--ds-mono)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        textDecoration: "none",
        boxShadow: "0 4px 18px rgba(0,0,0,0.5)",
        transition: "color 0.2s, border-color 0.2s"
      }}
      onMouseEnter={function(e) { e.currentTarget.style.color = C.blueH; e.currentTarget.style.borderColor = C.blue + "88"; }}
      onMouseLeave={function(e) { e.currentTarget.style.color = C.dim; e.currentTarget.style.borderColor = C.border; }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>&larr;</span>
      <span className="ds-back-label">Back</span>
    </Link>
  );
}

// ==================== STAT BAND ====================

function StatBand() {
  return (
    <FadeIn>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(148px, 1fr))",
        gap: 10,
        margin: "12px 0 10px"
      }}>
        {stats.map(function(s, i) {
          return (
            <div key={i} style={{
              background: C.card,
              border: "1px solid " + C.border,
              borderTop: "2px solid " + C.blue + "55",
              borderRadius: "2px 2px 12px 12px",
              padding: "22px 18px 18px",
              textAlign: "center"
            }}>
              <div style={{
                fontFamily: "var(--ds-display)",
                fontSize: 30,
                fontWeight: 500,
                color: C.text,
                lineHeight: 1
              }}>{s.v}</div>
              <div style={{
                fontFamily: "var(--ds-mono)",
                fontSize: 10,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: C.muted,
                marginTop: 12,
                lineHeight: 1.55
              }}>{s.k}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== EMMY CHART ====================

function EmmyChart() {
  var [hov, setHov] = useState(null);

  var CustomTooltip = function({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    var row = emmyData.find(function(d) { return d.year === label; });
    return (
      <div style={{
        background: C.card, border: "1px solid " + C.border,
        borderRadius: 10, padding: "14px 18px",
        fontFamily: "var(--ds-mono)", fontSize: 11
      }}>
        <div style={{ color: C.blue, letterSpacing: "0.12em", marginBottom: 8 }}>{label} EMMYS</div>
        {payload.map(function(p) {
          return (
            <div key={p.name} style={{ color: C.dim, margin: "3px 0" }}>
              <span style={{ color: p.color }}>{p.name === "noms" ? "Nominations" : "Wins"}</span>
              {" — "}{p.value}
            </div>
          );
        })}
        {row && <div style={{ color: C.muted, marginTop: 8, lineHeight: 1.5, maxWidth: 200 }}>{row.note}</div>}
      </div>
    );
  };

  return (
    <Panel>
      <Eyebrow>Emmy History — 2021 to 2025</Eyebrow>
      <p style={{ fontFamily: "var(--ds-serif)", fontSize: 14, color: C.muted, margin: "0 0 24px", lineHeight: 1.65 }}>
        Five years from launching with a thin slate to setting all-time records for nominations and wins.
        2023 estimated; Apple does not publish per-ceremony breakdowns.
      </p>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <ComposedChart data={emmyData} margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
            onMouseLeave={function() { setHov(null); }}>
            <CartesianGrid vertical={false} stroke={C.faint} />
            <XAxis dataKey="year" tick={{ fontFamily: "var(--ds-mono)", fontSize: 11, fill: C.steel }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontFamily: "var(--ds-mono)", fontSize: 10, fill: C.steel }} axisLine={false} tickLine={false} width={28} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontFamily: "var(--ds-mono)", fontSize: 10, fill: C.steel }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: C.faint }} />
            <Bar yAxisId="left" dataKey="noms" name="noms" fill={C.blue + "40"} radius={[4, 4, 0, 0]}>
              {emmyData.map(function(entry, index) {
                return (
                  <Cell
                    key={index}
                    fill={hov === index ? C.blue + "88" : C.blue + "40"}
                    onMouseEnter={function() { setHov(index); }}
                  />
                );
              })}
            </Bar>
            <Bar yAxisId="left" dataKey="wins" name="wins" fill={C.blue} radius={[4, 4, 0, 0]}>
              {emmyData.map(function(entry, index) {
                return (
                  <Cell
                    key={index}
                    fill={hov === index ? C.blueH : C.blue}
                    onMouseEnter={function() { setHov(index); }}
                  />
                );
              })}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: C.blue + "40" }} />
          <span style={{ fontFamily: "var(--ds-mono)", fontSize: 10.5, color: C.muted, letterSpacing: "0.08em" }}>NOMINATIONS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: C.blue }} />
          <span style={{ fontFamily: "var(--ds-mono)", fontSize: 10.5, color: C.muted, letterSpacing: "0.08em" }}>WINS</span>
        </div>
      </div>
    </Panel>
  );
}

// ==================== SCI-FI GRID ====================

function ScifiGrid() {
  var [hov, setHov] = useState(null);
  return (
    <Panel>
      <Eyebrow>The Sci-Fi Portfolio</Eyebrow>
      <p style={{ fontFamily: "var(--ds-serif)", fontSize: 14, color: C.muted, margin: "0 0 22px", lineHeight: 1.65 }}>
        From day one, two of Apple TV+'s three launch shows were science fiction. Six years later, the genre defines the platform.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
        {scifiShows.map(function(show, i) {
          var on = hov === i;
          return (
            <div key={show.title}
              onMouseEnter={function() { setHov(i); }}
              onMouseLeave={function() { setHov(null); }}
              style={{
                background: on ? C.cardH : C.card,
                border: "1px solid " + (on ? C.blue + "55" : C.border),
                borderTop: "2px solid " + (on ? C.blue : C.border),
                borderRadius: "2px 2px 12px 12px",
                padding: "18px 18px 16px",
                transition: "background 0.22s, border-color 0.22s"
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{
                  fontFamily: "var(--ds-mono)", fontSize: 9.5, color: on ? C.blueH : C.blue,
                  letterSpacing: "0.13em", textTransform: "uppercase",
                  padding: "3px 8px", border: "1px solid " + (on ? C.blueH + "55" : C.blue + "44"),
                  borderRadius: 999
                }}>{show.tag}</div>
                <div style={{
                  fontFamily: "var(--ds-mono)", fontSize: 12, color: C.silver, fontWeight: 600
                }}>{show.rt}<span style={{ fontSize: 9, color: C.muted }}>% RT</span></div>
              </div>
              <div style={{ fontFamily: "var(--ds-display)", fontSize: 19, color: C.text, fontWeight: 500, lineHeight: 1.2, marginBottom: 6 }}>{show.title}</div>
              <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10.5, color: C.blue, letterSpacing: "0.07em", marginBottom: 10 }}>{show.years} &middot; {show.creator}</div>
              <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.62, marginBottom: 10 }}>{show.logline}</div>
              <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.06em" }}>{show.seasons}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ==================== PRICE TIMELINE ====================

function PriceTimeline() {
  var maxPrice = 11;
  return (
    <Panel>
      <Eyebrow>Subscription Price History</Eyebrow>
      <p style={{ fontFamily: "var(--ds-serif)", fontSize: 14, color: C.muted, margin: "0 0 22px", lineHeight: 1.65 }}>
        Launched at a loss-leader price to seed the ecosystem. Price has more than doubled, and subscribers still grew.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {priceHistory.map(function(p, i) {
          var pct = (p.price / maxPrice) * 100;
          var isLatest = i === priceHistory.length - 1;
          return (
            <div key={p.year} style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 72, flexShrink: 0, fontFamily: "var(--ds-mono)", fontSize: 11, color: C.steel, textAlign: "right" }}>{p.year}</div>
              <div style={{ flex: 1, position: "relative", height: 36 }}>
                <div style={{
                  position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                  width: pct + "%", height: 8, borderRadius: 999,
                  background: isLatest
                    ? "linear-gradient(90deg, " + C.blueDim + ", " + C.blueH + ")"
                    : "linear-gradient(90deg, " + C.blueDim + ", " + C.blue + ")",
                  transition: "width 0.5s"
                }} />
              </div>
              <div style={{ width: 42, flexShrink: 0, fontFamily: "var(--ds-mono)", fontSize: 13, color: isLatest ? C.blueH : C.silver, fontWeight: 600 }}>${p.price}</div>
              <div style={{ flex: 1, fontFamily: "var(--ds-serif)", fontSize: 13, color: C.muted, lineHeight: 1.4 }}>{p.label}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ==================== CONTENT SPEND CHART ====================

function ContentSpendChart() {
  return (
    <Panel>
      <Eyebrow>Annual Content Spend — Estimated ($B)</Eyebrow>
      <p style={{ fontFamily: "var(--ds-serif)", fontSize: 14, color: C.muted, margin: "0 0 22px", lineHeight: 1.65 }}>
        Apple ramped aggressively through launch, sustained $5B+ for two years, then pulled back in 2024 as it shifted from pure land-grab to ROI discipline. Total invested: $20B+ since launch.
      </p>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <BarChart data={contentSpendData} margin={{ top: 8, right: 10, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} stroke={C.faint} />
            <XAxis dataKey="year" tick={{ fontFamily: "var(--ds-mono)", fontSize: 11, fill: C.steel }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: "var(--ds-mono)", fontSize: 10, fill: C.steel }} axisLine={false} tickLine={false} width={30} tickFormatter={function(v) { return "$" + v + "B"; }} domain={[0, 6]} />
            <Tooltip
              cursor={{ fill: C.faint }}
              contentStyle={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, fontFamily: "var(--ds-mono)", fontSize: 11 }}
              formatter={function(v) { return ["$" + v + "B", "Content Spend"]; }}
              labelStyle={{ color: C.blue, letterSpacing: "0.1em" }}
            />
            <Bar dataKey="spend" radius={[5, 5, 0, 0]}>
              {contentSpendData.map(function(entry, index) {
                var isLast = index === contentSpendData.length - 1;
                return (
                  <Cell key={index} fill={isLast ? C.steel : C.blue} opacity={isLast ? 0.7 : 1} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.1em", textAlign: "center", marginTop: 8 }}>
        ESTIMATED — APPLE DOES NOT DISCLOSE · 2024 SHOWS PULLBACK FROM PEAK
      </div>
    </Panel>
  );
}

// ==================== TIMELINE ====================

function AppleTimeline() {
  var [active, setActive] = useState("Jan 2025");
  return (
    <Panel>
      <Eyebrow>Apple TV+ — Key Milestones</Eyebrow>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: 82, top: 8, bottom: 8, width: 1,
          background: "linear-gradient(180deg, " + C.blue + "44, " + C.border + ", " + C.blue + "44)"
        }} />
        {appleTimeline.map(function(it) {
          var on = active === it.yr;
          return (
            <div key={it.yr}
              onClick={function() { setActive(it.yr); }}
              style={{ display: "flex", gap: 16, cursor: "pointer", padding: "8px 0" }}>
              <div style={{
                width: 68, textAlign: "right", flexShrink: 0,
                fontFamily: "var(--ds-mono)", fontSize: on ? 12 : 10,
                color: on ? C.blueH : C.steel, paddingTop: 3,
                transition: "color 0.2s, font-size 0.2s", fontWeight: on ? 600 : 400,
                lineHeight: 1.3
              }}>{it.yr}</div>
              <div style={{ width: 32, position: "relative", flexShrink: 0, display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: on ? 13 : 8, height: on ? 13 : 8, borderRadius: "50%",
                  background: on ? C.blueH : C.silver + "66",
                  boxShadow: on ? "0 0 0 5px " + C.blue + "22" : "none",
                  marginTop: 5, transition: "all 0.22s", zIndex: 1
                }} />
              </div>
              <div style={{
                flex: 1,
                background: on ? C.cardH : C.card,
                border: "1px solid " + (on ? C.blue + "44" : C.border),
                borderRadius: 10, padding: "11px 15px",
                transition: "background 0.2s, border-color 0.2s"
              }}>
                <div style={{ fontFamily: "var(--ds-display)", fontSize: 15.5, color: C.text, fontWeight: 500 }}>{it.t}</div>
                <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13, color: C.dim, lineHeight: 1.55, marginTop: 4 }}>{it.d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ==================== LEDGER ====================

function Ledger() {
  return (
    <Panel>
      <Eyebrow>By the Numbers</Eyebrow>
      <div>
        {ledger.map(function(row, i) {
          return (
            <div key={row.k} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              gap: 18, padding: "13px 2px",
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

// ==================== SOURCES ====================

function Sources() {
  return (
    <section>
      <FadeIn>
        <div style={{ margin: "80px 0 6px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.blue, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 14 }}>Appendix</div>
          <div style={{ fontFamily: "var(--ds-display)", fontSize: "clamp(24px, 4vw, 36px)", color: C.text, fontWeight: 500, letterSpacing: "-0.012em" }}>
            Sources
          </div>
          <div style={{ width: 44, height: 1, background: C.blue + "77", margin: "20px auto 0" }} />
        </div>
      </FadeIn>
      <FadeIn>
        <p style={{
          fontFamily: "var(--ds-serif)", fontSize: 14.5, color: C.muted,
          lineHeight: 1.7, textAlign: "center", maxWidth: 520,
          margin: "22px auto 40px"
        }}>
          Primary sources, press releases, trade reporting, and industry analysis.
          Financial figures are estimates where Apple has not disclosed, noted where applicable.
          Every link opens in a new tab.
        </p>
      </FadeIn>
      {sources.map(function(grp) {
        return (
          <FadeIn key={grp.group}>
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontFamily: "var(--ds-mono)", fontSize: 10, color: C.blue,
                letterSpacing: "0.2em", textTransform: "uppercase",
                marginBottom: 12, display: "flex", alignItems: "center", gap: 10
              }}>
                <span style={{ display: "inline-block", width: 16, height: 1, background: C.blue + "77" }} />
                {grp.group}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {grp.items.map(function(item) {
                  return (
                    <a id={"ref-" + item.num} key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "baseline", gap: 10,
                      padding: "10px 14px",
                      background: "transparent",
                      border: "1px solid transparent",
                      borderRadius: 8,
                      textDecoration: "none",
                      transition: "background 0.18s, border-color 0.18s"
                    }}
                      onMouseEnter={function(e) { e.currentTarget.style.background = C.faint; e.currentTarget.style.borderColor = C.border; }}
                      onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                      <span style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: C.blue + "99", flexShrink: 0, minWidth: 26 }}>[{item.num}]</span>
                      <span style={{ fontFamily: "var(--ds-serif)", fontSize: 14, color: C.dim, lineHeight: 1.4, flex: 1 }}>{item.t}</span>
                      <span style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.blue, letterSpacing: "0.08em", whiteSpace: "nowrap", flexShrink: 0 }}>{item.p}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        );
      })}
    </section>
  );
}

// ==================== MAIN PAGE ====================

export default function AppleTvPlus() {
  var [navShow, setNavShow] = useState(false);
  var [activeCh, setActiveCh] = useState("ch0");
  var lastY = useRef(0);

  useEffect(function() {
    function onScroll() {
      var y = window.scrollY;
      setNavShow(y > 180 && y < lastY.current ? false : y > 180);
      if (y > 180) setNavShow(true);
      lastY.current = y;

      var found = "ch0";
      chapters.forEach(function(ch) {
        var el = document.getElementById(ch.id);
        if (el && el.getBoundingClientRect().top < 120) found = ch.id;
      });
      setActiveCh(found);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return function() { window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text }}>
      <Seo title="Apple TV+: The Prestige Play — Adib Choudhury" description="How Apple went from failed cable negotiations in 2015 to Best Picture Oscars, Emmy records, and exclusive Formula 1 streaming rights — by hiring two executives from Sony and telling them quality was the only metric." />

      <style>{`
        .ds-navscroll::-webkit-scrollbar { display: none; }
        @media (max-width: 540px) { .ds-back-label { display: none; } }
      `}</style>

      <ProgressBar />
      <NavBar active={activeCh} show={navShow} />
      <BackButton />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 clamp(20px, 5vw, 64px) 120px" }}>

        {/* ── HERO ── */}
        <div id="ch0" style={{ paddingTop: "clamp(80px, 12vw, 120px)", paddingBottom: 16 }}>
          <FadeIn delay={0}>
            <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10.5, color: C.blue, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 22 }}>
              Narrative &middot; June 2026
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 style={{
              fontFamily: "var(--ds-display)",
              fontSize: "clamp(38px, 7.5vw, 70px)",
              lineHeight: 1.04,
              letterSpacing: "-0.022em",
              color: C.text,
              fontWeight: 500,
              margin: "0 0 20px"
            }}>
              Apple TV+:<br />
              <span style={{ color: C.blue }}>The Prestige Play</span>
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p style={{
              fontFamily: "var(--ds-serif)",
              fontSize: "clamp(17px, 2.4vw, 21px)",
              lineHeight: 1.64,
              color: C.dim,
              margin: "0 0 40px",
              maxWidth: 640
            }}>
              How Apple went from stalled TV negotiations to Best Picture Oscars, Emmy records,
              a sci-fi empire, and exclusive Formula 1 streaming rights, by hiring
              two people from Sony and telling them quality was the only metric.
            </p>
          </FadeIn>

          <StatBand />

          <FadeIn delay={200}>
            <div style={{ margin: "44px 0 0", height: 1, background: "linear-gradient(90deg, " + C.blue + "33, " + C.border + ", transparent)" }} />
          </FadeIn>
        </div>

        {/* ── CH 00: PRELUDE ── */}
        <ChapterRule num="00" />
        <H2 id="ch0_body">The Ambition Declared</H2>
        <Lead>
          Apple had been trying to crack television for years. In 2015, the company entered negotiations with
          every major cable network and content owner to build a live-streaming bundle. Every negotiation collapsed.
        </Lead>
        <P first="I">
          t was October 2016 when Tim Cook finally drew the line clearly. Television, he told analysts, was "of intense
          interest" to Apple, "a great opportunity" from both a creation and ownership perspective. Apple, he suggested,
          had "started focusing on some original content." The company that had remade music, phones, and computing
          would try to remake how stories got made and delivered.
        </P>
        <P>
          The cable bundle ambiguity was the first version of the story. Apple had approached every major network
          with little-to-no-wiggle-room terms. Eddy Cue, Apple's SVP of Services, who had built iTunes,
          the App Store, and Apple Music, was the chief negotiator. "Time is on my side," he reportedly told one
          cable executive who pushed back. The deals never closed. The networks wouldn't blink. Apple wouldn't either.
        </P>
        <P>
          By 2017, the calculus had shifted. Netflix was at 100 million subscribers and accelerating. Amazon had
          built a credible originals slate on the back of Prime. HBO remained the gold standard for prestige, but
          its parent company (WarnerMedia) was in merger turmoil. The gap in the market was obvious. Apple, with
          its 1.3 billion active devices and its reputation for taste, had a different angle: not more content,
          but better content. The question was who would build it.
        </P>

        <Epigraph cite="Jamie Erlicht, Apple TV+ Co-Head, 2019">
          "We want to bring to video what Apple has been so successful with in their other services and consumer
          products — unparalleled quality."
        </Epigraph>

        {/* ── CH 01: ARCHITECTS ── */}
        <ChapterRule num="01" />
        <H2 id="ch1">The Architects</H2>
        <Lead>
          In June 2017, Apple hired the two executives who would define everything that followed, poaching
          the co-presidents of Sony Pictures Television.
        </Lead>
        <P first="Z">
          ack Van Amburg and Jamie Erlicht had spent twelve years at Sony Pictures Television, rising to
          co-president.<Cite num={1} /> Their tenure there was, by any measure, remarkable. They developed and sold Breaking Bad,
          the meth-cooking high-school chemistry teacher drama that became arguably the greatest television
          series of the 21st century, then greenlit its prequel Better Call Saul. They understood
          prestige. They knew how to back difficult, uncompromising creative visions and give them room to breathe.
        </P>
        <P>
          Apple's offer was unusual in Hollywood: they would report directly to Eddy Cue, have the financial
          backing of the most cash-rich company on Earth, and face no commercial pressure to fill a library.
          They could be selective. The job was to build something unmistakably excellent: the Apple of television.
        </P>
        <P>
          Eddy Cue's role in the structure was as executive oversight and deal architect. Cue had been at Apple
          since 1989, had helped build the iTunes Store in 2003 and the App Store in 2008.<Cite num={5} /> He understood Apple's
          non-negotiables: aesthetic quality, ecosystem integration, premium positioning. Van Amburg and Erlicht
          would run the creative operation. Cue would make sure it all fit within Apple's broader strategy.
        </P>

        <Panel>
          <Eyebrow>The Three Architects</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {[
              {
                name: "Eddy Cue",
                role: "SVP of Services, Apple",
                bio: "At Apple since 1989. Built the iTunes Store (2003), App Store (2008), Apple Music (2015). Oversees all content deals and negotiations."
              },
              {
                name: "Zack Van Amburg",
                role: "Co-Head of Worldwide Video",
                bio: "12 years at Sony Pictures Television as co-president. Developed Breaking Bad, Better Call Saul. Joined Apple June 2017."
              },
              {
                name: "Jamie Erlicht",
                role: "Co-Head of Worldwide Video",
                bio: "12 years at Sony Pictures Television as co-president. Co-developed Breaking Bad, Better Call Saul, Rescue Me. Joined Apple June 2017."
              }
            ].map(function(p) {
              return (
                <div key={p.name} style={{
                  background: C.card,
                  border: "1px solid " + C.border,
                  borderTop: "2px solid " + C.blue + "55",
                  borderRadius: "2px 2px 10px 10px",
                  padding: "16px 16px 14px"
                }}>
                  <div style={{ fontFamily: "var(--ds-display)", fontSize: 18, color: C.text, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.blue, letterSpacing: "0.1em", textTransform: "uppercase", margin: "7px 0 11px" }}>{p.role}</div>
                  <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.62 }}>{p.bio}</div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* ── CH 02: OPENING ACT ── */}
        <ChapterRule num="02" />
        <H2 id="ch2">November First</H2>
        <Lead>
          Apple TV+ launched on November 1, 2019, almost exactly two years after Van Amburg and Erlicht joined.
          The library was deliberately small. The budgets were not.
        </Lead>
        <P first="T">
          he launch slate was striking in its restraint. While Disney+ launched the same month with a near-century
          of film and television content, Apple came to market with a handful of originals: The Morning Show
          (Jennifer Aniston, Reese Witherspoon, Steve Carell; $15 million per episode, $300 million for two
          seasons); For All Mankind, Ronald D. Moore's alternate-history space race; See, Jason Momoa in a
          post-apocalyptic world; Dickinson; and Helpsters.
        </P>
        <P>
          The pricing was deliberate. At $4.99 per month, half the price of Netflix's standard plan, Apple
          was clearly buying subscribers, not monetizing them.<Cite num={7} /> More aggressively: anyone who bought a new
          iPhone, iPad, Mac, Apple TV, or iPod touch got one year free. The strategy was ecosystem seeding.
          Make the service nearly free to anyone already invested in Apple hardware, let the content quality
          build word-of-mouth, and raise prices later as the library earned the premium.
        </P>

        <PriceTimeline />

        <P>
          The initial critical reception was mixed. The Morning Show received praise for its performances but
          was described as "prestige-adjacent" rather than prestige. See was divisive. Critics were unconvinced
          that Apple had the creative infrastructure to compete with HBO and Netflix. The launch narrative
          was "impressive ambition, thin execution." Then came a show about an American football manager who
          knew nothing about soccer.
        </P>

        {/* ── CH 03: ECOSYSTEM ── */}
        <ChapterRule num="03" />
        <H2 id="ch3">The Ecosystem Play</H2>
        <P first="A">
          pple TV+ was never designed to compete with Netflix on Netflix's terms. Netflix is a media company.
          Apple is a hardware ecosystem building media on the side, and that distinction shapes every decision
          it makes. For Apple, a subscriber who stays on iOS because they love Severance is worth far more
          than the $10.99 monthly fee suggests.
        </P>
        <P>
          Apple sustains $5 billion annually in content spending while losing over $1 billion per year because
          those losses don't register against Apple TV+ revenue in isolation.<Cite num={9} /> They register
          against the value of keeping a customer inside the Apple ecosystem through another iPhone cycle,
          another bundle renewal.
        </P>
        <P>
          Apple One, the bundle combining Apple TV+, Apple Music, Apple Arcade, Apple Fitness+, iCloud+,
          and Apple News+, clarifies the calculus. Apple TV+ is a content layer on top of hardware and
          services, designed to make leaving the Apple ecosystem more costly.
        </P>

        <Epigraph cite="Apple Services Revenue, Q4 2024 Earnings">
          Apple's Services segment revenue reached $26.3 billion for Q4 2024, up 14% year-over-year.
          Apple TV+ is not broken out separately — by design.
        </Epigraph>

        {/* ── CH 04: TED LASSO ── */}
        <ChapterRule num="04" />
        <H2 id="ch4">The Breakout</H2>
        <Lead>
          Nobody predicted Ted Lasso. Not the skeptical critics, not the streaming analysts, not even, reportedly,
          some people at Apple. A show about an American football coach taking over a struggling English soccer
          club turned out to be the thing that made Apple TV+ real.
        </Lead>
        <P first="T">
          ed Lasso premiered August 14, 2020. Based on a series of NBC Sports promos, it starred Jason Sudeikis
          as the relentlessly optimistic, tactically clueless Ted Lasso, dropped into English Premier League
          football. The show was about kindness. It was about leadership through positivity in an industry
          built on cynicism. Critics, already exhausted by the grim-dark prestige television that had
          dominated the decade, found it quietly devastating.
        </P>
        <P>
          The reviews were extraordinary. The show holds a 90% Tomatometer across its run. At the 73rd
          Emmy Awards in September 2021, Ted Lasso received 20 nominations, the most ever for a freshman
          comedy in Emmy history.<Cite num={14} /> It won Outstanding Comedy Series, Outstanding Lead
          Actor in a Comedy Series (Jason Sudeikis), and five other awards. Apple TV+ won 11 Emmys total
          across five programs that night.
        </P>
        <P>
          Then it did it again. At the 74th Emmys in 2022, Apple submitted 52 nominations across 13 titles.
          Ted Lasso won Outstanding Comedy Series for the second consecutive year, only the eighth comedy
          in 74 years of Emmy history to pull off back-to-back wins.<Cite num={15} /> Apple won 20 Emmys total.
          The streamer that critics had written off in 2019 had become the one everyone was watching.
        </P>

        <EmmyChart />

        <PullQuote>
          Twenty Emmy nominations for a freshman comedy. The record Ted Lasso set in 2021 stood for exactly
          four years before The Studio shattered it with 23.
        </PullQuote>

        {/* ── CH 05: OSCAR ── */}
        <ChapterRule num="05" />
        <H2 id="ch5">The Trophy</H2>
        <Lead>
          On March 27, 2022, CODA won the Academy Award for Best Picture. It was the first time in
          94 years of Oscar history that a streaming-native service had claimed Hollywood's most prestigious prize.
        </Lead>
        <P first="N">
          etflix had tried. Roma (2018), The Irishman (2019), The Power of the Dog (2021), Don't Look Up (2021),
          all nominated for Best Picture, all losing to theatrical films or distributor-hybrid releases.
          Apple, in just its third year, did what Netflix couldn't. CODA (Children of Deaf Adults), directed
          by Siân Heder and starring Troy Kotsur and Emilia Jones, won Best Picture, Best Supporting Actor
          (Kotsur, the first deaf male actor to win an Oscar), and Best Adapted Screenplay.<Cite num={17} />
        </P>
        <P>
          Apple had paid $25 million for CODA's distribution rights at Sundance 2021, a record at the time
          for a Sundance acquisition.<Cite num={19} /> They put roughly $10 million into the Oscar campaign. The total investment
          was a rounding error for Apple. The signal value was enormous: Apple Original Films was a legitimate
          player in theatrical prestige cinema.
        </P>
        <P>
          The CODA win did something else. It gave Van Amburg and Erlicht credibility on two fronts
          simultaneously: with the talent community (directors, writers, and actors now knew Apple could
          take them to the Oscars) and with the press (the narrative shifted from "Apple's expensive
          experiment" to "Apple's prestige operation"). That credibility compounds. Martin Scorsese had
          already signed a multi-year first-look deal with Apple in 2020.<Cite num={37} /> Vince Gilligan,
          creator of Breaking Bad and Better Call Saul, signed at Apple in 2022.<Cite num={38} /> The talent followed the trophies.
        </P>

        {/* ── CH 06: SCI-FI ── */}
        <ChapterRule num="06" />
        <H2 id="ch6">The Niche</H2>
        <Lead>
          Two of Apple TV+'s three launch shows were science fiction. Six years later, the genre is
          Apple's clearest competitive identity, and it wasn't accidental.
        </Lead>
        <P first="O">
          f Apple TV+'s first three original series (The Morning Show, For All Mankind, and See), two
          were science fiction. For All Mankind imagines an alternate history in which the Soviets land
          on the moon first and the space race never ends. See is set in a future where humanity has lost
          the ability to see. From day one, Apple was betting on the genre in a way no premium streamer
          had done before.
        </P>
        <P>
          The logic was brand-level. Apple has always positioned itself as a company building the future.
          The same sensibility running through the Mac, the iPhone, the Vision Pro maps directly onto
          prestige science fiction. The genre also attracts exactly the demographic Apple covets: educated,
          affluent, early-adopters who were already buying Apple hardware.
        </P>
        <P>
          Van Amburg and Erlicht also recognized something structural: science fiction had been historically
          underserved by prestige television. Game of Thrones proved fantasy could be prestige. Breaking Bad
          proved crime drama could be prestige. Nobody had given science fiction the same treatment consistently.
          Apple would be first.
        </P>

        <ScifiGrid />

        <P>
          The portfolio ranges across every major sci-fi subgenre. For All Mankind is alternate history,
          now in its fifth season with a Soviet-focused spinoff (Star City) expanding the universe.
          Foundation adapts Isaac Asimov's thousand-year epic, long considered unfilmable, across
          three seasons with David S. Goyer at the helm. Silo, adapted from Hugh Howey's novels, earns
          96% on Rotten Tomatoes in its second season. Constellation plays psychological terror in space.
        </P>
        <P>
          And then there is Severance, which is not technically science fiction so much as corporate paranoia
          set one degree removed from the world we know. But it became Apple's defining show.
        </P>

        {/* ── CH 07: SEVERANCE ── */}
        <ChapterRule num="07" />
        <H2 id="ch7">The Franchise</H2>
        <Lead>
          Severance premiered in February 2022. By January 2025, when its second season returned after
          a nearly three-year wait, it had become the most-watched series in Apple TV+'s history.
        </Lead>
        <P first="S">
          everance follows employees at Lumon Industries who have undergone a surgical procedure to split
          their memories at work from their memories at home. The "innies" at work know nothing of their
          lives outside; the "outies" at home know nothing of what they do at the office. Created by
          Dan Erickson and directed (first season) primarily by Ben Stiller, it earned 97% on Rotten
          Tomatoes in Season 1, one of the highest scores in television history.
        </P>
        <P>
          The wait for Season 2 was nearly three years. When it arrived on January 17, 2025, it came
          with something rare: a perfect 100% on Rotten Tomatoes from early critics (settling to 94%
          as the full run released). The numbers were staggering. The season posted a 218% increase
          in minutes watched versus Season 1's first 12-week run.<Cite num={21} /> The Season 2 finale netted over
          540 million minutes watched in a single week, a 215% increase over the series' previous high.
        </P>
        <P>
          Severance's return fueled a 126% increase in new Apple TV+ subscribers between January 1–19, 2025
          versus December 1–19, 2024.<Cite num={22} /> The show had become what Apple had been building toward: a piece
          of appointment television that drove subscription conversions at scale. At the 77th Emmy Awards,
          Severance won eight trophies, including Outstanding Lead Actress (Britt Lower) and Outstanding
          Supporting Actor (Tramell Tillman), making it the most-winning drama of the year.
        </P>

        <Panel>
          <Eyebrow>Severance by the Numbers</Eyebrow>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {[
              { v: "218%", k: "Increase in minutes watched, S2 vs. S1 first 12 weeks" },
              { v: "540M", k: "Minutes watched, S2 finale — single week" },
              { v: "94%", k: "Rotten Tomatoes, Season 2" },
              { v: "+126%", k: "New subscribers, Jan 1–19 vs. Dec 1–19, 2024" },
              { v: "8", k: "Emmy wins, 2025 — most-winning drama" },
              { v: "#1", k: "Most-watched series in Apple TV+ history" },
            ].map(function(s, i) {
              return (
                <div key={i} style={{
                  background: C.card, border: "1px solid " + C.border,
                  borderRadius: 10, padding: "18px 16px 14px", textAlign: "center"
                }}>
                  <div style={{ fontFamily: "var(--ds-display)", fontSize: 28, fontWeight: 500, color: C.text, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontFamily: "var(--ds-mono)", fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginTop: 10, lineHeight: 1.55 }}>{s.k}</div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* ── CH 08: RECORDS ── */}
        <ChapterRule num="08" />
        <H2 id="ch8">The Record Books</H2>
        <Lead>
          The 77th Emmy Awards, September 2025: Apple TV+ received 81 nominations and won 22 awards.
          Both were all-time records for the platform. The most-winning series of the entire ceremony
          was an Apple original about a fictional Hollywood studio.
        </Lead>
        <P first="T">
          he Studio, Seth Rogen's Hollywood satire in which Rogen plays a film executive trying to
          make serious cinema while the studio demands franchise sequels, premiered in March 2025.<Cite num={26} />
          It received 23 Emmy nominations, shattering the record of 20 that Ted Lasso set for freshman
          comedies in 2021. Then it swept the ceremony with 13 wins total, including Outstanding Comedy
          Series, Outstanding Lead Actor (Seth Rogen), Outstanding Writing, and Outstanding Directing.<Cite num={27} />
          It became the most-winning series of the entire 2025 Emmy ceremony and the most-winning
          freshman comedy in Emmy history.<Cite num={28} />
        </P>
        <P>
          Rogen won four individual Emmy Awards in a single night, as actor, director, executive producer,
          and writer, tying a record held by only a handful of people in Emmy history.<Cite num={25} />
          Combined with Severance's eight wins and Slow Horses' directing award, Apple TV+
          took home 22 Emmys from 81 nominations.<Cite num={24} /> The cumulative totals across Apple TV+'s six years:
          620+ award wins across 2,816+ nominations.
        </P>

        <AppleTimeline />

        {/* ── CH 09: LEDGER ── */}
        <ChapterRule num="09" />
        <H2 id="ch9">The Ledger</H2>
        <Lead>
          Apple TV+ has never turned a profit. It loses over $1 billion a year. It has spent $20 billion
          on content since launch. None of this has made Apple slow down, but it has made them more careful.
        </Lead>
        <P first="T">
          he numbers are unusual by streaming industry standards. Apple has spent an estimated $4.5–5 billion
          annually on original content since 2022, more than HBO's entire annual budget and comparable
          to Netflix's spend on a per-show basis (though Netflix makes far more shows).<Cite num={11} /> Total investment
          since launch is north of $20 billion. The estimated annual losses exceed $1 billion, prompting
          reports as recently as 2025 that internal executives were scrutinizing the business case with
          new intensity.<Cite num={13} />
        </P>
        <P>
          Apple's subscriber count is difficult to pin down, as the company does not disclose it. Estimates
          from industry analysts in 2024–25 place the figure around 45 million paying subscribers,<Cite num={9} />
          making Apple TV+ roughly one-fifth the size of Netflix but larger than Paramount+ and
          approaching Max. The service has a structural advantage: a significant portion of its subscribers
          arrived free (via device bundles) and have simply stayed.
        </P>
        <P>
          The 2024 budget pullback, approximately $500 million below the prior year,<Cite num={12} />
          signals a maturation. Apple is no longer simply trying to establish credibility; it is
          trying to build a sustainable content business. The discipline shows in programming choices:
          fewer mid-tier productions, more concentration on franchises (Severance Seasons 3 and 4
          greenlit, For All Mankind through Season 6, Silo Season 3 already in development).
        </P>

        <ContentSpendChart />
        <Ledger />

        {/* ── CH 10: LONG GAME ── */}
        <ChapterRule num="10" />
        <H2 id="ch10">The Long Game</H2>
        <Lead>
          The F1 movie changed everything. A $631.5 million worldwide gross made it the highest-grossing
          sports film in history and gave Apple a roadmap for what original IP could become when it crossed
          entertainment and sport.
        </Lead>
        <P first="F">
          1: The Movie, directed by Top Gun: Maverick's Joseph Kosinski and starring Brad Pitt as
          a comeback racing driver, was released in June 2025. It was Apple Original Films' largest
          theatrical bet, and it paid off beyond any projection.<Cite num={35} /> The worldwide gross of $631.5 million
          made it the highest-grossing sports film ever, bigger than any boxing, baseball, or soccer
          film. It was Pitt's biggest hit of his career. The logic for the Formula 1 streaming deal
          that followed was self-evident.
        </P>
        <P>
          In October 2025, Apple announced a five-year exclusive deal for US Formula 1 streaming rights
          starting in 2026, valued at approximately $750 million total.<Cite num={34} /> Every race weekend
          (practice sessions, qualifying, sprints, and Grands Prix) would stream on Apple TV+. Selected
          content would be free in the Apple TV app, driving awareness. The deal extended Apple's existing
          sports portfolio: MLS Season Pass (exclusive streaming partner for Major League Soccer) and
          Friday Night Baseball on MLB.
        </P>
        <P>
          Sports is a different product than scripted content. It drives live engagement, weekly appointment
          viewing, and attracts a broader, more casual demographic than Apple TV+'s prestige sci-fi
          fanbase. The combination is deliberate: prestige scripted content (Severance, The Studio, For
          All Mankind) for the core subscriber, sports (F1, MLS, MLB) for the weekend viewer. Apple is
          building layers.
        </P>
        <P>
          The franchise buildout continues on the scripted side. Severance is now owned outright by
          Apple (acquired the IP in 2026),<Cite num={23} /> with Seasons 3 and 4 development underway. For All Mankind
          runs through Season 6 plus the Star City spinoff.<Cite num={31} /> Vince Gilligan's Pluribus landed at Apple
          with a two-season commitment.
          The streamer that launched with a thin slate in 2019 now has some of the most valuable IP
          in television.
        </P>

        <PullQuote>
          The company that failed to close a single cable deal in 2015 now owns the US streaming
          rights to Formula 1, the most-watched sports series in Emmy history, and the only
          Best Picture Oscar ever won by a streaming platform.
        </PullQuote>

        <P>
          What Apple TV+ has built, in six years and $20 billion, is something narrower and more
          deliberate than a Netflix competitor: the prestige tier of streaming, with no real peer.
          Netflix is in the business of volume. Apple is in the business of making things its
          customers are proud to recommend. The difference shows in the output.
        </P>
        <P>
          Van Amburg and Erlicht's mandate from day one, "unparalleled quality," turned out to be
          exactly the right brief for a company with Apple's particular reputation. The Emmys came.
          Then the Oscar. Then Severance, The Studio, and the franchise deals. And now the F1 rights,
          perhaps the most globally valuable recurring sports property outside the Premier League.
        </P>
        <P>
          The long game, it turns out, rewards patience. Apple, in this as in everything else, was willing to wait.
        </P>

        <div style={{ margin: "60px 0 6px", textAlign: "center" }}>
          <FadeIn>
            <div style={{ fontFamily: "var(--ds-mono)", fontSize: 9.5, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 2 }}>
              Built with React + Recharts &middot; Fact-checked against primary sources &middot; June 2026
            </div>
          </FadeIn>
        </div>

        <Sources />

      </div>
      <ResearchFooter currentSlug="apple-tv-plus" />
    </div>
  );
}
