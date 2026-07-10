import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, ComposedChart, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine
} from "recharts";
import Seo from "../../components/Seo";
import ResearchFooter from "../../components/ResearchFooter";

// ==================== DATA ====================

const chapters = [
  { id: "ch0", num: "00", short: "Before", title: "The Slow Burn" },
  { id: "ch1", num: "01", short: "Inside", title: "The Inside Job" },
  { id: "ch2", num: "02", short: "Number", title: "Thirteen Sixty-Five" },
  { id: "ch3", num: "03", short: "Icahn", title: "The Activist Arrives" },
  { id: "ch4", num: "04", short: "Close", title: "The Bump and the Close" },
  { id: "ch5", num: "05", short: "Quiet", title: "The Quiet Years" },
  { id: "ch6", num: "06", short: "EMC", title: "The Megadeal" },
  { id: "ch7", num: "07", short: "Return", title: "The Round Trip" },
  { id: "ch8", num: "08", short: "Harvest", title: "The Harvest" },
  { id: "ch9", num: "09", short: "Math", title: "What It Actually Made" },
  { id: "ch10", num: "10", short: "Playbook", title: "The Playbook" }
];

const stockPath = [
  { m: "Jan '12", p: 18.36 },
  { m: "Apr '12", p: 16.25 },
  { m: "Jul '12", p: 11.84 },
  { m: "Oct '12", p: 9.35 },
  { m: "Jan '13", p: 10.88, label: "Pre-leak" },
  { m: "Feb '13", p: 13.79, label: "Deal announced" },
  { m: "May '13", p: 13.40 },
  { m: "Aug '13", p: 13.85, label: "Icahn fight" },
  { m: "Oct '13", p: 13.88, label: "Close: $13.75 + $0.13" }
];

const lboFinancing = [
  { src: "Senior secured debt (BofA, Barclays, CS, RBC)", val: 13.75, color: "#1f5d4c" },
  { src: "Michael Dell rollover + new equity", val: 4.25, color: "#16a085" },
  { src: "MSD Capital co-invest", val: 0.75, color: "#2dbf9b" },
  { src: "Silver Lake equity", val: 1.40, color: "#c9a574" },
  { src: "Microsoft subordinated loan", val: 2.00, color: "#5b8fb0" },
  { src: "Dell cash on balance sheet", val: 2.25, color: "#3e6e6a" }
];

const emcFinancing = [
  { src: "New term loans & bridge debt", val: 39.5, color: "#1f5d4c" },
  { src: "VMware tracking stock (DVMT)", val: 17.2, color: "#5b8fb0" },
  { src: "Cash on hand (Dell + EMC)", val: 7.5, color: "#3e6e6a" },
  { src: "Existing EMC debt assumed", val: 5.5, color: "#9b7fc4" },
  { src: "New equity from MSD + Silver Lake", val: 4.25, color: "#c9a574" }
];

const valueTimeline = [
  { yr: "2013", v: 1.4, label: "Take-private equity" },
  { yr: "2016", v: 5.7, label: "Post-EMC paper mark" },
  { yr: "2018", v: 7.4, label: "DVMT exchange, Dell re-IPO" },
  { yr: "2019", v: 11.2, label: "DELL trades up" },
  { yr: "2021", v: 13.8, label: "VMware spin-off" },
  { yr: "2023", v: 18.6, label: "Broadcom-VMware cash" },
  { yr: "2024", v: 22.0, label: "Residual DELL stake + cash" }
];

const events = [
  { date: "Aug 2012", phase: "setup", title: "Michael Dell goes to the board", body: "The founder approaches the Dell board about taking the company private. Wall Street has priced the PC business for death; he hasn't." },
  { date: "Feb 5, 2013", phase: "setup", title: "Deal announced at $13.65", body: "Dell, Silver Lake, and Microsoft sign a $24.4B take-private. A 25% premium to the undisturbed January 11 close of $10.88." },
  { date: "Mar 2013", phase: "fight", title: "Icahn and Southeastern attack", body: "Carl Icahn pairs with Mason Hawkins' Southeastern (Dell's largest outside holder) and calls the price 'a giveaway' to the founder." },
  { date: "May 2013", phase: "fight", title: "Icahn proposes a recap", body: "Icahn offers a $14 leveraged recapitalization keeping Dell public, with $5.2B of debt committed by Jefferies. The Special Committee passes." },
  { date: "Jul 2013", phase: "fight", title: "The vote that didn't happen", body: "The shareholder vote is adjourned three times. Dell and Silver Lake don't have it. They threaten to walk." },
  { date: "Aug 2, 2013", phase: "win", title: "The bump", body: "Final offer: $13.75 plus a $0.13 special dividend, plus a regular $0.08 dividend. In exchange, the Special Committee changes the voting rule: abstentions no longer count as 'no'." },
  { date: "Sep 12, 2013", phase: "win", title: "Stockholders approve", body: "Roughly 65% of unaffiliated shares vote yes. Icahn drops his proxy fight." },
  { date: "Oct 29, 2013", phase: "win", title: "Take-private closes", body: "Dell exits the NASDAQ at $24.9B enterprise value. Silver Lake puts in about $1.4B of equity; Michael Dell, around $4.2B; Microsoft, a $2B subordinated loan." },
  { date: "Oct 2015", phase: "build", title: "Dell announces EMC bid", body: "A $67B agreement, the largest tech deal in history. Funded with $49B of new debt and a VMware tracking stock called DVMT." },
  { date: "Sep 7, 2016", phase: "build", title: "EMC closes", body: "Dell Technologies is born. Net debt jumps to roughly $57B. Dell + Silver Lake control 81% of VMware as part of the package." },
  { date: "Dec 28, 2018", phase: "build", title: "Back to public, no IPO", body: "Dell buys in DVMT for a mix of $14B cash and Class C Dell stock. The company relists on the NYSE at a roughly $24B implied equity value, no underwriter, no roadshow." },
  { date: "Nov 1, 2021", phase: "harvest", title: "VMware spun off", body: "Dell distributes its 81% VMware stake to shareholders. VMware pays an $11.5B special cash dividend; Dell receives $9.3B and pays down debt to investment grade." },
  { date: "Nov 22, 2023", phase: "harvest", title: "Broadcom buys VMware", body: "$69B all-in. Silver Lake and Michael Dell, having held VMware through the spin, cash out at $142.50 per share." }
];

const lessons = [
  { n: "01", title: "Mispriced complexity is the deepest moat in public markets", body: "Dell looked like a dying PC company. Inside, it was a misunderstood services and storage business buried under a hardware multiple. Public markets are good at pricing simple stories; complicated ones get a discount that patient capital can arbitrage for a decade." },
  { n: "02", title: "Insider buyouts are a structural arbitrage, not a fairness problem", body: "The founder always knows more than the market. The proper response is process, not prohibition. Dell's Special Committee survived a Delaware appraisal challenge, a $1B settlement, and a Chancellor who called the price low, because the process held. The number can be wrong and the deal can still be legal." },
  { n: "03", title: "Strategic LPs are leverage that doesn't show up in the cap table", body: "Microsoft's $2B subordinated loan in 2013 wasn't a financing line. It was a vote of confidence that gave debt syndicators cover. Years later it would also seed a partnership that made Dell the preferred Windows hardware partner. Strategic capital is a press release that prices itself." },
  { n: "04", title: "The right leverage is whatever finishes the platform", body: "Dell took on roughly $49B of new debt for EMC. Critics said it was suicidal. It was. It was also the only way to assemble end-to-end enterprise infrastructure inside one balance sheet before the cloud locked the door. The optionality on VMware alone covered the interest bill twice over." },
  { n: "05", title: "Tracking stock is a financing instrument disguised as a security", body: "DVMT let Dell sell exposure to VMware without selling VMware. When Dell wanted to come public again, it bought DVMT back at a wide discount to its underlying value. The instrument that financed the EMC deal also delivered the re-IPO. Same trick, four years apart." },
  { n: "06", title: "A re-IPO without an IPO is a feature, not a workaround", body: "December 2018: no roadshow, no banker fees on a primary, no first-day pop given away to allocators. Dell came back public by force-converting a tracking stock it already controlled. The cleanest public-market reentry in the modern LBO era." },
  { n: "07", title: "Spin, dividend, deleverage, repeat", body: "VMware's 2021 spin-off was not a divestiture. It was a synchronized triple-play: a special dividend that paid down Dell's debt to investment grade, a clean stock for the parent, and a holding-company position in VMware for Michael Dell and Silver Lake that Broadcom would cash out 24 months later for tens of billions." },
  { n: "08", title: "The fund return is downstream of the exit window", body: "Silver Lake reported a 7.3x return for its 2013 fund on the Dell positions and roughly 3.1x for a 2018 vehicle that bought in late. Same company, two funds, very different multiples, because entry price and timing decide the answer, not the operating story. PE is a market-timing business with an operating story stapled on." }
];

const sources = [
  { n: 1, title: "Dell Enters into Agreement to Be Acquired by Michael Dell and Silver Lake", pub: "Business Wire, Feb 5, 2013", url: "https://www.businesswire.com/news/home/20130205006211/en/Dell-Enters-into-Agreement-to-Be-Acquired-by-Michael-Dell-and-Silver-Lake" },
  { n: 2, title: "Dell Completes Go-Private Transaction", pub: "Silver Lake, Oct 2013", url: "https://www.silverlake.com/dell-completes-go-private-transaction/" },
  { n: 3, title: "2013 Deals of the Year: Dell Privatization Gets Personal", pub: "Institutional Investor", url: "https://www.institutionalinvestor.com/article/2bstx3yryqhzc39vch91c/portfolio/2013-deals-of-the-year-dell-privatization-gets-personal" },
  { n: 4, title: "Dell Reaches Deal to Be Taken Private by Founder, Silver Lake", pub: "CNBC, Feb 5, 2013", url: "https://www.cnbc.com/2013/02/05/dell-reaches-deal-to-be-taken-private-by-founder-silver-lake.html" },
  { n: 5, title: "Vintage Private Equity Deals — The Saga of Silver Lake and Dell", pub: "Bocconi Students Investment Club", url: "https://bsic.it/vintage-private-equity-deals-the-saga-of-silver-lake-dell/" },
  { n: 6, title: "Icahn and Southeastern: Open Letter to Dell Stockholders and Special Committee", pub: "PR Newswire, 2013", url: "https://www.prnewswire.com/news-releases/carl-c-icahn-and-southeastern-asset-management-issue-open-letter-to-stockholders-of-dell-and-dell-special-committee-217813101.html" },
  { n: 7, title: "Dell Special Committee Letter to Icahn and Southeastern", pub: "Business Wire, May 2013", url: "https://www.businesswire.com/news/home/20130520005535/en/Dell-Special-Committee-Sends-Letter-To-Carl-Icahn-and-Southeastern-Asset-Management" },
  { n: 8, title: "$67 billion Dell-EMC deal closes today", pub: "TechCrunch, Sep 7, 2016", url: "https://techcrunch.com/2016/09/07/67-billion-dell-emc-deal-becomes-official-today/" },
  { n: 9, title: "Historic Dell and EMC Merger Complete", pub: "Dell Press Release, Sep 7, 2016", url: "https://www.dell.com/en-us/dt/corporate/newsroom/announcements/2016/09/20160907-01.htm" },
  { n: 10, title: "Making Sense of Dell + EMC + VMware", pub: "Andreessen Horowitz", url: "https://a16z.com/making-sense-of-dell-emc-vmware/" },
  { n: 11, title: "The Gamblers Behind Tech's Biggest Deal Ever", pub: "Fortune Longform", url: "https://fortune.com/longform/dell-emc-merger-tech-biggest-deal/" },
  { n: 12, title: "Dell Concludes Strategic Review, Agrees to Exchange DVMT", pub: "Dell, Jul 2, 2018", url: "https://www.dell.com/en-us/dt/corporate/newsroom/announcements/detailpage.press-releases~usa~2018~07~dell-technologies-concludes-strategic-review-and-reaches-agreement-to-exchange-class-v-tracking-stock-for-equity-or-cash-election-option.htm" },
  { n: 13, title: "Silver Lake's Dell Set to Go Public Again in Unique $21.7B Deal", pub: "PitchBook, 2018", url: "https://pitchbook.com/news/articles/silver-lakes-dell-set-to-go-public-again-in-unique-217b-deal" },
  { n: 14, title: "Dell Technologies Announces Completion of VMware Spin-Off", pub: "Dell, Nov 1, 2021", url: "https://www.dell.com/en-us/dt/corporate/newsroom/announcements/detailpage.press-releases~usa~2021~11~20211101-dell-technologies-announces-completion-of-vmware-spin-off.htm" },
  { n: 15, title: "VMware and Dell Reach Agreement Regarding Spin-Off", pub: "Business Wire, Apr 14, 2021", url: "https://www.businesswire.com/news/home/20210414005849/en/VMware-and-Dell-Technologies-Reach-Agreement-Regarding-Spin-Off" },
  { n: 16, title: "Broadcom Completes $69 Billion Acquisition of VMware", pub: "Caproasia, Nov 25, 2023", url: "https://www.caproasia.com/2023/11/25/broadcom-completes-69-billion-acquisition-of-vmware-on-22nd-november-2023-after-china-approval-61-billion-in-cash-8-billion-in-debt-michael-dell-to-receive-20-billion/" },
  { n: 17, title: "Broadcom to Acquire VMware for Approximately $61 Billion", pub: "Broadcom IR, May 2022", url: "https://investors.broadcom.com/news-releases/news-release-details/broadcom-acquire-vmware-approximately-61-billion-cash-and-stock" },
  { n: 18, title: "Investor Spotlight: How Silver Lake's 'Four Amigos' Built a Tech Buyout Behemoth", pub: "PitchBook", url: "https://pitchbook.com/news/articles/investor-spotlight-how-silver-lakes-four-amigos-built-a-tech-buyout-behemoth" },
  { n: 19, title: "Dell to pay $1B to settle DVMT shareholder claim", pub: "The Register, Nov 16, 2022", url: "https://www.theregister.com/2022/11/16/dell_inc/" },
  { n: 20, title: "The Standard of Review for Dell's IPO", pub: "Harvard Law Corporate Governance Forum", url: "https://corpgov.law.harvard.edu/2018/11/19/the-standard-of-review-for-dells-ipo/" }
];

// ==================== DESIGN SYSTEM ====================

const C = {
  bg:      "#0a0e14",
  surface: "#10141c",
  card:    "#141a24",
  cardH:   "#1a2230",
  accent:  "#16a085",
  accent2: "#2dbf9b",
  copper:  "#c9a574",
  copperH: "#e0bd87",
  red:     "#c45a4a",
  blue:    "#5b8fb0",
  purple:  "#9b7fc4",
  text:    "#e6ebf0",
  dim:     "#b4bcc6",
  muted:   "#7a8492",
  faint:   "#1c2330",
  border:  "#222b3a",
  glow:    "rgba(22,160,133,0.07)"
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
      background: "linear-gradient(90deg, " + C.accent + " 0%, " + C.copper + " 100%)",
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
        fontSize: "clamp(28px, 4.6vw, 40px)",
        lineHeight: 1.15,
        letterSpacing: "-0.012em",
        color: C.text,
        margin: "60px 0 22px",
        fontWeight: 500
      }}>{children}</h2>
    </FadeIn>
  );
}

function P({ children }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--ds-serif)",
        fontSize: 17.5,
        lineHeight: 1.72,
        color: C.dim,
        margin: "0 0 22px"
      }}>{children}</p>
    </FadeIn>
  );
}

function Lead({ children }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--ds-serif)",
        fontSize: 20,
        lineHeight: 1.62,
        color: C.text,
        margin: "0 0 30px",
        fontStyle: "italic",
        borderLeft: "2px solid " + C.accent,
        paddingLeft: 18
      }}>{children}</p>
    </FadeIn>
  );
}

function Ed({ children }) {
  return (
    <FadeIn>
      <div style={{
        fontFamily: "var(--ds-serif)",
        fontSize: 16,
        lineHeight: 1.7,
        color: C.muted,
        fontStyle: "italic",
        margin: "26px 0",
        padding: "14px 18px",
        borderLeft: "1px dashed " + C.copper,
        background: C.surface,
        borderRadius: 4
      }}>
        <span style={{
          fontFamily: "var(--ds-mono)",
          fontSize: 10,
          color: C.copper,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginRight: 10,
          fontStyle: "normal"
        }}>Ed.</span>
        {children}
      </div>
    </FadeIn>
  );
}

function Quote({ who, role, children }) {
  return (
    <FadeIn>
      <div style={{
        margin: "32px 0",
        padding: "22px 26px",
        background: C.card,
        borderLeft: "3px solid " + C.copper,
        borderRadius: 4
      }}>
        <div style={{
          fontFamily: "var(--ds-display)",
          fontSize: 19,
          lineHeight: 1.55,
          color: C.text,
          marginBottom: 12
        }}>"{children}"</div>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: C.copper, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {who} <span style={{ color: C.muted }}>— {role}</span>
        </div>
      </div>
    </FadeIn>
  );
}

function Ref({ n }) {
  var [open, setOpen] = useState(false);
  var [coords, setCoords] = useState({ top: 0, left: 0, above: true });
  var showT = useRef(null);
  var hideT = useRef(null);
  var anchorRef = useRef(null);
  var src = sources.find(function(x) { return x.n === n; });

  function clearTimers() {
    if (showT.current) { clearTimeout(showT.current); showT.current = null; }
    if (hideT.current) { clearTimeout(hideT.current); hideT.current = null; }
  }
  function computePosition() {
    var el = anchorRef.current;
    if (!el) return;
    var r = el.getBoundingClientRect();
    var above = r.top > 200;
    setCoords({
      viewportTop: r.top - 12,
      viewportBottom: r.bottom + 12,
      left: r.left + r.width / 2,
      above: above
    });
  }
  function onEnter() {
    clearTimers();
    showT.current = setTimeout(function() { computePosition(); setOpen(true); }, 80);
  }
  function onLeave() {
    clearTimers();
    hideT.current = setTimeout(function() { setOpen(false); }, 160);
  }
  function onClickNum(e) {
    e.preventDefault();
    var el = document.getElementById("src-" + n);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }
  useEffect(function() { return function() { clearTimers(); }; }, []);

  return (
    <span style={{ position: "relative", display: "inline" }}>
      <a
        ref={anchorRef}
        href={"#src-" + n}
        onClick={onClickNum}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        aria-describedby={open ? "ref-tip-" + n : undefined}
        style={{
          fontFamily: "var(--ds-mono)",
          fontSize: 11,
          color: C.accent,
          verticalAlign: "super",
          textDecoration: "none",
          marginLeft: 1,
          cursor: "pointer"
        }}>[{n}]</a>
      {open && src ? createPortal(
        <div
          id={"ref-tip-" + n}
          role="tooltip"
          onMouseEnter={function() { clearTimers(); }}
          onMouseLeave={onLeave}
          style={{
            position: "fixed",
            top: coords.above ? "auto" : coords.viewportBottom,
            bottom: coords.above ? "calc(100vh - " + coords.viewportTop + "px)" : "auto",
            left: coords.left,
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: 320,
            maxWidth: "calc(100vw - 32px)",
            background: C.surface,
            border: "1px solid " + C.border,
            borderRadius: 10,
            padding: "14px 16px",
            boxShadow: "0 18px 40px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.4)",
            fontFamily: "var(--ds-sans)",
            textAlign: "left",
            whiteSpace: "normal",
            animation: "ds-tip-in 0.18s cubic-bezier(0.16,1,0.3,1)"
          }}>
          <span style={{
            display: "block",
            fontFamily: "var(--ds-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: C.copper,
            marginBottom: 8,
            fontWeight: 600
          }}>Source [{n}]</span>
          <span style={{
            display: "block",
            fontFamily: "var(--ds-sans)",
            fontSize: 13.5,
            lineHeight: 1.45,
            color: C.text,
            fontWeight: 500,
            marginBottom: 6
          }}>{src.title}</span>
          <span style={{
            display: "block",
            fontFamily: "var(--ds-mono)",
            fontSize: 11,
            color: C.muted,
            marginBottom: 12
          }}>{src.pub}</span>
          <a href={src.url} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--ds-mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: C.accent,
              textDecoration: "none",
              padding: "6px 10px",
              border: "1px solid " + C.border,
              borderRadius: 6,
              transition: "background 0.18s, color 0.18s, border-color 0.18s"
            }}
            onMouseEnter={function(e) { e.currentTarget.style.background = C.accent + "18"; e.currentTarget.style.borderColor = C.accent; }}
            onMouseLeave={function(e) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = C.border; }}
          >Open source <span style={{ fontSize: 13 }}>&rarr;</span></a>
        </div>,
        document.body
      ) : null}
    </span>
  );
}

// ==================== STAT CARDS ====================

function StatRow({ items }) {
  return (
    <FadeIn>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 14,
        margin: "20px 0 38px"
      }}>
        {items.map(function(it, i) {
          return (
            <div key={i} style={{
              background: C.card,
              border: "1px solid " + C.border,
              borderRadius: 10,
              padding: "18px 18px 16px"
            }}>
              <div style={{
                fontFamily: "var(--ds-mono)",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.copper,
                marginBottom: 10
              }}>{it.label}</div>
              <div style={{
                fontFamily: "var(--ds-display)",
                fontSize: 28,
                color: C.text,
                fontWeight: 500,
                lineHeight: 1.1,
                marginBottom: 6
              }}>{it.value}</div>
              <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13.5, color: C.muted, lineHeight: 1.5 }}>{it.sub}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}
// ==================== CHARTS ====================

function StockChart() {
  return (
    <FadeIn>
      <div style={{
        background: C.card,
        border: "1px solid " + C.border,
        borderRadius: 12,
        padding: "24px 18px 18px",
        margin: "8px 0 32px"
      }}>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>Dell common stock</div>
        <div style={{ fontFamily: "var(--ds-display)", fontSize: 18, color: C.text, marginBottom: 18 }}>From the panic low to the close</div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stockPath} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dlGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity={0.42} />
                  <stop offset="100%" stopColor={C.accent} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.faint} strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="m" stroke={C.muted} tick={{ fontSize: 11, fontFamily: "var(--ds-mono)" }} axisLine={false} tickLine={false} />
              <YAxis stroke={C.muted} tick={{ fontSize: 11, fontFamily: "var(--ds-mono)" }} axisLine={false} tickLine={false} tickFormatter={function(v){return "$"+v;}} domain={[8, 20]} />
              <Tooltip
                cursor={{ fill: C.faint + "66" }}
                contentStyle={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 8, fontFamily: "var(--ds-mono)", fontSize: 12, color: C.text, padding: "10px 12px", boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
                labelStyle={{ color: C.copper, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}
                itemStyle={{ color: C.text, fontFamily: "var(--ds-mono)", fontSize: 12 }}
                formatter={function(v){return ["$"+v.toFixed(2),"Price"];}}
              />
              <ReferenceLine y={13.65} stroke={C.copper} strokeDasharray="4 4" label={{ value: "$13.65 offer", fill: C.copper, fontSize: 11, fontFamily: "var(--ds-mono)", position: "insideTopRight", offset: 8 }} />
              <Area type="monotone" dataKey="p" stroke={C.accent} strokeWidth={2.5} fill="url(#dlGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13, color: C.muted, marginTop: 12, fontStyle: "italic" }}>
          Source: Dell historical pricing; Bloomberg reconstruction. The 25% premium framing assumes the January 11, 2013 close of $10.88.
        </div>
      </div>
    </FadeIn>
  );
}

function FinancingChart({ data, total, title, kicker }) {
  var [hov, setHov] = useState(null);
  function enter(i) { return function() { setHov(i); }; }
  function leave() { setHov(null); }
  var hd = hov !== null ? data[hov] : null;
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: "24px 20px 22px", margin: "8px 0 32px" }}>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>{kicker}</div>
        <div style={{ fontFamily: "var(--ds-display)", fontSize: 18, color: C.text, marginBottom: 22 }}>{title}</div>
        <div style={{ display: "flex", height: 44, borderRadius: 6, overflow: "hidden", marginBottom: 22 }}>
          {data.map(function(d, i) {
            var w = (d.val / total) * 100;
            return (
              <div
                key={i}
                onMouseEnter={enter(i)}
                onMouseLeave={leave}
                style={{
                  width: w + "%",
                  background: d.color,
                  opacity: hov === null || hov === i ? 1 : 0.4,
                  transition: "opacity 0.18s",
                  cursor: "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--ds-mono)",
                  fontSize: 11,
                  color: "#fff",
                  fontWeight: 600
                }}>
                {w > 10 ? "$" + d.val.toFixed(1) + "B" : ""}
              </div>
            );
          })}
        </div>
        <div style={{
          minHeight: 56,
          padding: "12px 14px",
          background: C.surface,
          borderRadius: 6,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 14
        }}>
          {hd ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14, width: "100%" }}>
              <div style={{ width: 8, height: 40, borderRadius: 2, background: hd.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "var(--ds-sans)", fontSize: 14, color: C.text, fontWeight: 600 }}>{hd.src}</div>
                <div style={{ fontFamily: "var(--ds-mono)", fontSize: 12, color: C.muted, marginTop: 2 }}>${hd.val.toFixed(2)}B &mdash; {Math.round((hd.val/total)*100*10)/10}% of total</div>
              </div>
            </div>
          ) : (
            <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13, color: C.muted, fontStyle: "italic" }}>Hover a segment to see the source.</div>
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
          {data.map(function(d, i) {
            return (
              <div key={i} onMouseEnter={enter(i)} onMouseLeave={leave} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: "var(--ds-sans)", color: hov === null || hov === i ? C.dim : C.muted, cursor: "default" }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>{d.src}</div>
                <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: C.muted }}>${d.val.toFixed(1)}B</div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

function ValueChart() {
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: "24px 18px 18px", margin: "8px 0 32px" }}>
        <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>Silver Lake's Dell position</div>
        <div style={{ fontFamily: "var(--ds-display)", fontSize: 18, color: C.text, marginBottom: 18 }}>Estimated equity value &mdash; $ billions</div>
        <div style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={valueTimeline} margin={{ top: 24, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={C.faint} strokeDasharray="3 4" vertical={false} />
              <XAxis dataKey="yr" stroke={C.muted} tick={{ fontSize: 11, fontFamily: "var(--ds-mono)" }} axisLine={false} tickLine={false} />
              <YAxis stroke={C.muted} tick={{ fontSize: 11, fontFamily: "var(--ds-mono)" }} axisLine={false} tickLine={false} tickFormatter={function(v){return "$"+v+"B";}} />
              <Tooltip
                cursor={{ fill: C.faint + "66" }}
                contentStyle={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 8, fontFamily: "var(--ds-mono)", fontSize: 12, color: C.text, padding: "10px 12px", boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
                labelStyle={{ color: C.copper, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}
                itemStyle={{ color: C.text, fontFamily: "var(--ds-mono)", fontSize: 12 }}
                formatter={function(v,n,p){return ["$"+v+"B", p.payload.label];}}
              />
              <Bar dataKey="v" radius={[6,6,0,0]}>
                {valueTimeline.map(function(d, i) {
                  return <Cell key={i} fill={i === 0 ? C.copper : i === valueTimeline.length - 1 ? C.accent2 : C.accent} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ fontFamily: "var(--ds-serif)", fontSize: 13, color: C.muted, marginTop: 12, fontStyle: "italic" }}>
          Estimate. Silver Lake has not disclosed deal-level returns. Implied values triangulate from the 2018 DVMT exchange, the 2021 spin distribution, and Broadcom's 2023 $142.50 per VMware share takeout, applied to Silver Lake's ~10% holding plus residual Dell exposure.
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== TIMELINE ====================

function Timeline() {
  var [hov, setHov] = useState(null);
  return (
    <FadeIn>
      <div style={{ position: "relative", padding: "16px 0 0 40px", margin: "8px 0 36px" }}>
        <div style={{
          position: "absolute", left: 16, top: 16, bottom: 0, width: 1,
          background: "linear-gradient(to bottom, " + C.copper + " 0%, " + C.copper + "aa 18%, " + C.accent + " 50%, " + C.accent2 + " 100%)"
        }} />
        {events.map(function(ev, i) {
          var dot = ev.phase === "setup" ? C.copper : ev.phase === "fight" ? C.red : ev.phase === "win" ? C.accent : ev.phase === "build" ? C.blue : C.accent2;
          var isH = hov === i;
          return (
            <div key={i}
              onMouseEnter={function() { setHov(i); }}
              onMouseLeave={function() { setHov(null); }}
              style={{
                position: "relative",
                marginBottom: i === events.length - 1 ? 0 : 22,
                padding: "8px 10px 8px 0",
                borderRadius: 8,
                background: isH ? dot + "0e" : "transparent",
                transition: "background 0.2s"
              }}>
              <div style={{
                position: "absolute", left: -30, top: 14,
                width: 12, height: 12, borderRadius: "50%",
                background: dot, border: "2.5px solid " + C.bg,
                boxShadow: "0 0 0 " + (isH ? "4px" : "2px") + " " + dot + (isH ? "55" : "33"),
                transition: "box-shadow 0.2s"
              }} />
              <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: dot, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3, fontWeight: 500 }}>{ev.date}</div>
              <div style={{ fontFamily: "var(--ds-sans)", fontSize: 14.5, color: C.text, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
              <div style={{ fontFamily: "var(--ds-serif)", fontSize: 14, color: C.dim, lineHeight: 1.6 }}>{ev.body}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== PLAYBOOK ====================

function Lesson({ lesson }) {
  return (
    <FadeIn>
      <div style={{
        background: C.card,
        border: "1px solid " + C.border,
        borderRadius: 12,
        padding: "22px 22px",
        margin: "0 0 14px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          right: -6, top: -22,
          fontFamily: "var(--ds-display)",
          fontSize: 110,
          color: C.copper,
          opacity: 0.07,
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none"
        }}>{lesson.n}</div>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.copper, fontWeight: 600, letterSpacing: "0.14em", marginTop: 5, minWidth: 22 }}>{lesson.n}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--ds-display)", fontSize: 19, color: C.text, fontWeight: 600, lineHeight: 1.28, marginBottom: 10 }}>{lesson.title}</div>
            <div style={{ fontFamily: "var(--ds-serif)", fontSize: 15.5, color: C.dim, lineHeight: 1.72 }}>{lesson.body}</div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== NAVBAR ====================

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
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, " + C.accent + "88, transparent)" }} />
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
          onMouseEnter={function(e) { e.currentTarget.style.color = C.accent; }}
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
                  color: isA ? C.accent : C.muted,
                  borderBottom: "2px solid " + (isA ? C.accent : "transparent"),
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

// ==================== BACK BUTTON (floating, top of page) ====================

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
      onMouseEnter={function(e) { e.currentTarget.style.color = C.accent; }}
      onMouseLeave={function(e) { e.currentTarget.style.color = C.dim; }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>&larr;</span>
      <span>Research</span>
    </Link>
  );
}

// ==================== MAIN ====================

export default function DellSilverLake() {
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
      <Seo title="Dell & Silver Lake: A Hall-of-Fame LBO — Adib Choudhury" description="How Silver Lake put $1.4 billion of equity into a misunderstood PC company, kept it private through the largest tech merger ever, brought it back public without an IPO, and harvested it for a decade." />

      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Source+Serif+4:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        .ds-root {
          --ds-display: 'Fraunces', Georgia, serif;
          --ds-serif:   'Source Serif 4', Georgia, serif;
          --ds-sans:    'Inter', system-ui, sans-serif;
          --ds-mono:    'JetBrains Mono', Menlo, monospace;
        }
        .ds-root *::selection { background: ${C.accent}66; color: ${C.text}; }
        .ds-root nav div::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .ds-root nav a[aria-label="Back to research"] { padding: 15px 18px 15px 14px !important; }
        }
        @keyframes ds-tip-in { from { opacity: 0; transform: translateX(-50%) translateY(0); } to { opacity: 1; } }
      `}</style>

      <ProgressBar />
      <BackPill show={!showNav} />
      <NavBar active={activeChapter} show={showNav} />

      {/* ================= HERO ================= */}
      <section style={{ minHeight: "92vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          position: "absolute", top: "26%", left: "50%", transform: "translateX(-50%)",
          width: 620, height: 520,
          background: "radial-gradient(ellipse, rgba(22,160,133,0.10) 0%, transparent 68%)",
          pointerEvents: "none", filter: "blur(60px)"
        }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 920, margin: "0 auto", padding: "14vh 24px 8vh", width: "100%" }}>
          <FadeIn>
            <div style={{
              fontFamily: "var(--ds-mono)", fontSize: 10, color: C.accent,
              letterSpacing: "0.32em", marginBottom: 36, textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 14
            }}>
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.accent + "88" }} />
              A Private Equity Narrative
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.accent + "44" }} />
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <h1 style={{
              fontFamily: "var(--ds-display)",
              fontSize: "clamp(40px, 7vw, 76px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: C.text,
              margin: "0 0 26px",
              fontWeight: 500
            }}>
              A Founder, a Fund,<br />
              <span style={{ color: C.copper, fontStyle: "italic" }}>and a Decade Inside</span>
            </h1>
          </FadeIn>
          <FadeIn delay={220}>
            <p style={{
              fontFamily: "var(--ds-serif)",
              fontSize: 20,
              lineHeight: 1.62,
              color: C.dim,
              maxWidth: 660,
              margin: "0 0 30px"
            }}>
              How Silver Lake put $1.4 billion of equity into a misunderstood PC company, kept it private through the largest tech merger ever, brought it back public without an IPO, and harvested it for a decade. The deal industry has a short list of buyouts that defined an era. Dell sits at the top of it.
            </p>
          </FadeIn>
          <FadeIn delay={320}>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontFamily: "var(--ds-mono)", fontSize: 11, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <span>Eleven chapters</span>
              <span style={{ color: C.faint }}>&bull;</span>
              <span>Twenty sources</span>
              <span style={{ color: C.faint }}>&bull;</span>
              <span>2013 &rarr; 2024</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 100px" }}>

        {/* CHAPTER 00 */}
        <H2 id="ch0">00 &mdash; The Slow Burn</H2>
        <Lead>
          By the second half of 2012, Wall Street had given up on Dell. The stock spent the summer between $9 and $12, a price the company hadn't seen since 1997. The PC market was contracting for the first time in a generation. Apple's iPad was eating the consumer side. HP and Lenovo were grinding margins to nothing in the enterprise. Dell looked like a slow-motion liquidation in a Round Rock office park.
        </Lead>
        <P>
          The numbers told one story. Dell's revenue had peaked at $61.5B in fiscal 2012 and was sliding. Operating margin had compressed from 7.6% in 2011 toward 5%. Analysts assigned the company a forward EV/EBITDA multiple of about 3.5x, the kind of number reserved for distressed legacy hardware.<Ref n={3} />
        </P>
        <P>
          But inside the company, the story was different. Dell had spent five years quietly buying enterprise IT companies: Perot Systems for services, Compellent and EqualLogic for storage, SonicWall and SecureWorks for security, Wyse for thin clients, Boomi for integration. Roughly $13B of deals. By 2012, services, software, and storage were generating about a third of revenue and nearly half of operating income.<Ref n={5} />
        </P>
        <Ed>
          The interesting trade is almost never the obvious one. The obvious trade in 2012 was that PCs were dying and Dell was a PC company. The non-obvious trade was that Dell was already most of the way through transforming into a diversified enterprise platform, but its multiple was anchored to the segment everyone hated. Mispriced complexity is the single most reliable source of return in public equity. Patient capital can extract it. Public shareholders, judged quarter by quarter, generally cannot.
        </Ed>

        <StockChart />

        {/* CHAPTER 01 */}
        <H2 id="ch1">01 &mdash; The Inside Job</H2>
        <P>
          In August 2012, Michael Dell flew to New York and met with two of the largest holders of his namesake company. He suggested, in his quiet Texan way, that the public-market discount on Dell was permanent. The fix, he proposed, was to take it private.<Ref n={3} />
        </P>
        <P>
          He had been working the idea privately with Silver Lake for months. Egon Durban, the Silver Lake partner who had built the firm's reputation on the 2009 Skype carve-out from eBay, had identified Dell as a target as early as 2010. The pitch was simple: Dell's enterprise transformation needed five years of investment that the public market would punish every quarter. Take it private, finish the build, and re-rate the multiple later.<Ref n={18} />
        </P>
        <P>
          The Dell board responded the way any properly-advised board responds to a take-private overture from the founder and CEO: it formed a Special Committee, hired its own bankers (J.P. Morgan) and its own counsel (Debevoise &amp; Plimpton), and barred Michael Dell from the room.<Ref n={5} />
        </P>
        <P>
          The Committee then did three things that turned out to matter. It commissioned independent strategic work from Boston Consulting Group, which concluded Dell's outlook was deteriorating faster than management believed. It ran a private auction, contacting strategic and financial buyers including KKR and TPG (both passed; KKR walked away before the announcement). And it negotiated a "go-shop" period after announcement, letting it actively solicit higher bids for 45 days.<Ref n={3} />
        </P>

        <StatRow items={[
          { label: "PRE-DEAL CLOSE", value: "$10.88", sub: "Jan 11, 2013, the undisturbed price the Committee anchored to." },
          { label: "ANNOUNCED OFFER", value: "$13.65", sub: "25% premium. The number that started the war." },
          { label: "BCG DCF MIDPOINT", value: "~$23", sub: "Strategic DCF later cited by Icahn as evidence of underpricing." }
        ]} />

        {/* CHAPTER 02 */}
        <H2 id="ch2">02 &mdash; Thirteen Sixty-Five</H2>
        <P>
          On February 5, 2013, Dell, Silver Lake, and Michael Dell jointly announced an agreement to take the company private at $13.65 a share in cash. Total enterprise value: $24.4B.<Ref n={1} /> The largest leveraged buyout since the 2008 financial crisis. The financing stack tells you almost everything you need to know about how the deal got done.
        </P>

        <FinancingChart
          data={lboFinancing}
          total={lboFinancing.reduce(function(a,b){return a+b.val;},0)}
          kicker="The 2013 take-private capital stack"
          title="Roughly $24.4B in sources, only $5.7B of new common equity"
        />

        <P>
          Silver Lake wrote a $1.4B equity check. Michael Dell rolled over his existing 16% stake and added new capital, for roughly $4.2B total. MSD Capital, his family office, co-invested. Microsoft, in a move that surprised the industry, provided a $2B subordinated debt facility, signaling that Redmond wanted Dell to survive as a Windows hardware partner.<Ref n={1} /><Ref n={2} />
        </P>
        <P>
          A four-bank syndicate of Bank of America Merrill Lynch, Barclays, Credit Suisse, and RBC Capital Markets committed the senior debt. The rest came off Dell's own balance sheet: about $2.25B of corporate cash applied to the equity purchase price.<Ref n={4} />
        </P>
        <Ed>
          Stop and look at the numbers. The new common equity in the deal was about $5.65B against a $24.4B enterprise value. Most of the purchase was paid for with debt, balance-sheet cash, and a strategic loan from a customer-partner. That is not "Silver Lake bought Dell." That is "Silver Lake organized the financing, took the strategic position, and paid 5.7% of enterprise value to control the upside on the whole stack." The arithmetic of leveraged buyouts is, at its core, a question of capital arrangement, not capital deployment.
        </Ed>

        {/* CHAPTER 03 */}
        <H2 id="ch3">03 &mdash; The Activist Arrives</H2>
        <P>
          Carl Icahn showed up about a month after announcement. He had a position by March, an activist letter by April, and Mason Hawkins' Southeastern Asset Management, Dell's largest outside shareholder, as an ally by May. Their argument was technical and ferocious. Dell, they wrote, was worth at least $22 to $24 per share on a standalone basis. The $13.65 offer was not a premium; it was a discount to intrinsic value laundered through a process that gave the founder informational advantage.<Ref n={6} />
        </P>
        <Quote who="Carl Icahn" role="Open letter to Dell stockholders, May 2013">
          We are extremely upset by your recommendation of the going-private transaction. We have already been able to obtain financing commitments of $5.2 billion. We are continuing to work toward a proposal that we believe will be far superior.
        </Quote>
        <P>
          Icahn's alternative was a leveraged recapitalization: keep Dell public, pay shareholders $14 per share for up to 72% of their stock, and use new debt to fund the buyback. He had Jefferies committed for $5.2B of financing. Southeastern threatened to vote its 8% block against the merger.<Ref n={6} />
        </P>
        <P>
          The Special Committee evaluated the recap and passed. Their argument was procedural: a recap was a financing transaction, not a sale, and didn't trigger the same fiduciary obligations. Their argument was also substantive: a recap left a smaller, more leveraged public Dell still subject to quarterly earnings whiplash, which was the original problem.<Ref n={7} />
        </P>

        {/* CHAPTER 04 */}
        <H2 id="ch4">04 &mdash; The Bump and the Close</H2>
        <P>
          By July 2013, the vote was a coin flip. Dell-Silver Lake didn't have the majority of unaffiliated shares they had committed to win. The stockholder meeting was adjourned three times. Each delay leaked a few more institutional holders toward Icahn. Egon Durban and Michael Dell, in a now-famous July 24 phone call with the Committee chair Alex Mandl, threatened to walk.<Ref n={3} />
        </P>
        <P>
          The compromise came on August 2, 2013. Michael Dell and Silver Lake raised the offer to $13.75 per share plus a special $0.13 cash dividend, and Dell paid out the regular $0.08 quarterly dividend on top. Effective consideration: roughly $13.96 per share, $350M more than the original. In exchange, the Special Committee changed the unaffiliated stockholder vote rule: abstentions would no longer count as "no" votes.<Ref n={3} />
        </P>
        <Ed>
          This is the under-discussed pivot of the entire deal. Changing the vote rule was worth more than the price bump. About 25% of unaffiliated holders had simply not voted. Under the original rule, every non-vote was effectively a vote against. Under the new rule, the deal only had to clear actual votes cast. That single procedural change, more than the eleven cents and the side dividend, is what got the merger over the line.
        </Ed>
        <P>
          On September 12, 2013, roughly 65% of unaffiliated shares voted yes. Icahn dropped his proxy fight. The deal closed on October 29, 2013, at a final enterprise value of $24.9B.<Ref n={2} /> Five years later, a Delaware Chancery court would rule in an appraisal action that the deal price was below fair value, awarding objecting shareholders a small premium. Dell settled a related class action for $1B in 2022.<Ref n={19} />
        </P>

        <Timeline />

        {/* CHAPTER 05 */}
        <H2 id="ch5">05 &mdash; The Quiet Years</H2>
        <P>
          For 24 months after closing, Dell did almost nothing publicly. There were no earnings calls. No quarterly guidance. No analyst days. Inside the company, Michael Dell and his team were running the playbook they had pitched to Silver Lake: pour capital into enterprise R&amp;D, restructure the consumer business, reorient the sales force toward services and storage, and stop optimizing for the dollar of the next quarter.<Ref n={11} />
        </P>
        <P>
          The early returns were mixed. The PC business kept shrinking. Storage growth was slower than the EMC partnership had implied. Microsoft's $2B vote of confidence had bought partnership goodwill but also locked Dell into a Wintel posture as the cloud was beginning to shift the question of where enterprise compute happened.
        </P>
        <P>
          Then, in the spring of 2015, Joe Tucci, the longtime CEO of EMC, ran out of room. EMC's tracking stock for its 81%-owned subsidiary VMware was trading at a discount to the underlying. Elliott Management was loudly demanding a breakup. EMC's options were a hostile defense, a sale to Cisco or HP, or a friendly merger with someone who would keep the parts together. Tucci flew to Austin.<Ref n={11} />
        </P>

        {/* CHAPTER 06 */}
        <H2 id="ch6">06 &mdash; The Megadeal</H2>
        <P>
          On October 12, 2015, Dell announced an agreement to acquire EMC for $67B. The largest technology acquisition in history, by a wide margin. It would close on September 7, 2016, after the longest regulatory review and one of the more imaginative financing structures private equity has ever assembled.<Ref n={8} /><Ref n={9} />
        </P>

        <FinancingChart
          data={emcFinancing}
          total={emcFinancing.reduce(function(a,b){return a+b.val;},0)}
          kicker="The 2016 EMC acquisition stack"
          title="A $67B deal funded with debt, tracking stock, and a balance-sheet pivot"
        />

        <P>
          Three pieces are worth understanding. First, the debt. Dell took on roughly $39.5B of new term loans and bridge facilities. Layered on top of existing EMC debt, the combined company's net debt at close was approximately $57B, the largest enterprise-debt load in technology.<Ref n={8} />
        </P>
        <P>
          Second, the tracking stock. The cash portion of EMC's consideration was $24.05 per share. The remaining ~$9.10 per share came in the form of a new Class V tracking stock (NYSE: DVMT) tied to the value of Dell's newly-acquired 81% stake in VMware. Tracking stock is a financial instrument: it gives the holder economic exposure to a subsidiary's performance without conveying voting rights. It is also, structurally, a piece of paper Dell could buy back later at whatever discount the market was willing to give.<Ref n={10} />
        </P>
        <P>
          Third, the equity. Silver Lake and MSD put in about $4.25B of additional new equity. Their stakes in the combined Dell Technologies were diluted, but they now controlled the largest enterprise infrastructure platform in the world: servers (Dell EMC), storage (EMC), virtualization and cloud management (VMware), data protection (Avamar, NetWorker), security (RSA, SecureWorks), and an array of adjacent software businesses.<Ref n={10} />
        </P>
        <Quote who="Michael Dell" role="At the EMC closing, September 7, 2016">
          We are at the dawn of the next industrial revolution. Our world is becoming more intelligent and more connected by the minute, and ultimately will become intertwined with a vast Internet of Things, paving the way for our customers to do incredible things.
        </Quote>

        {/* CHAPTER 07 */}
        <H2 id="ch7">07 &mdash; The Round Trip</H2>
        <P>
          By late 2017, the DVMT tracking stock was trading at a roughly 35% discount to the underlying VMware shares it referenced. A persistent, structural arbitrage. Dell could either let the discount grind on, or it could collapse the tracking stock and use the moment to come back public.<Ref n={13} />
        </P>
        <P>
          On July 2, 2018, Dell announced its solution. Each DVMT share would be cancelled and converted into the right to receive either 1.3665 newly-issued shares of Dell Technologies Class C common stock (which would list on the NYSE) or $109 in cash, subject to an aggregate cash cap of $9B (later raised to $14B in negotiations with activist holders, led by Carl Icahn again). The implied equity value of Dell at the exchange: about $48B.<Ref n={12} />
        </P>
        <P>
          On December 28, 2018, Dell relisted on the NYSE under the ticker DELL. No IPO. No bookrunners on a primary issuance. No first-day pop given away. The company had come public again through a forced conversion of a tracking stock it already controlled. Of the modern PE re-listings, this remains the most surgical.<Ref n={13} /><Ref n={20} />
        </P>
        <Ed>
          The brilliance of the DVMT structure is that it was a financing instrument the first time and a re-IPO mechanism the second time. In 2016, DVMT raised $17B of effective deal consideration at a discount. In 2018, Dell used the same paper to take the company public at a price set by the buyback negotiation, not the market. Same instrument, two uses, four years apart. This is what a financial inventor looks like in tech.
        </Ed>

        {/* CHAPTER 08 */}
        <H2 id="ch8">08 &mdash; The Harvest</H2>
        <P>
          On April 14, 2021, Dell Technologies announced it would spin off its 81% equity stake in VMware to Dell shareholders. The mechanics: VMware would pay a special cash dividend of roughly $11.5B to all of its shareholders, of which Dell would receive about $9.3B. Dell would then distribute its VMware shares pro-rata to Dell stockholders. Each Dell share would yield approximately 0.44 shares of VMware.<Ref n={14} /><Ref n={15} />
        </P>
        <P>
          The transaction closed on November 1, 2021. Dell used the $9.3B of dividend cash, plus roughly $5B of debt paydown from operating cash flow, to bring its net leverage from above 3.0x to roughly 1.8x. The credit agencies promptly returned Dell to investment grade. Michael Dell, post-spin, held approximately 41% of VMware. Silver Lake held approximately 11%.<Ref n={14} />
        </P>
        <P>
          Six months later, in May 2022, Broadcom announced an offer to acquire VMware for $61B in cash and stock plus the assumption of $8B of net debt. A $69B total. The deal closed on November 22, 2023, after a fifteen-month regulatory marathon ending with Chinese antitrust approval. Cashed-out VMware shareholders received $142.50 per share, or 0.252 Broadcom shares.<Ref n={16} /><Ref n={17} />
        </P>
        <P>
          For Silver Lake's roughly 11% VMware stake, the Broadcom cash component represented in the neighborhood of $6.5B of proceeds. For Michael Dell's 41%, the take was on the order of $20B-$21B in cash and Broadcom stock combined.<Ref n={16} />
        </P>

        <ValueChart />

        {/* CHAPTER 09 */}
        <H2 id="ch9">09 &mdash; What It Actually Made</H2>
        <P>
          Silver Lake has not publicly disclosed the gross return on the Dell deal. They don't have to. But the financial press has, and the firm itself has confirmed enough fund-level multiples to triangulate.
        </P>
        <P>
          PitchBook reports that Silver Lake's third partnership, the 2007 vintage that did the initial Dell take-private, generated a 7.3x gross multiple on the Dell positions. A later vehicle, raised in 2018 specifically to roll forward Silver Lake's Dell and VMware exposure post the public listing, has reported a roughly 3.1x multiple to date.<Ref n={5} /><Ref n={18} />
        </P>
        <P>
          Apply the 7.3x to Silver Lake's initial $1.4B equity and you get roughly $10.2B of gross proceeds attributable to the original 2013 check. Add the second-fund roll-forward, the VMware spin proceeds, the Broadcom cash, and residual Dell equity, and the cumulative value flowing through the Silver Lake balance sheet from this one position is plausibly in the $15B&ndash;$20B range, gross of fees.
        </P>
        <P>
          The Financial Times and Institutional Investor have both reported a combined Michael Dell + Silver Lake aggregate gain of approximately $70B from the position's full lifecycle, counting Dell common share appreciation, VMware spin distributions, and the Broadcom takeout.<Ref n={5} />
        </P>

        <StatRow items={[
          { label: "Silver Lake equity in", value: "$1.4B", sub: "2013 take-private, plus ~$2B of follow-on through subsequent rounds." },
          { label: "Reported fund multiple", value: "7.3x", sub: "PitchBook-cited gross multiple on Silver Lake's 2007-vintage Dell positions." },
          { label: "Combined SL + Dell gain", value: "~$70B", sub: "Aggregate value created over the ten-year hold, across funds and personal account." }
        ]} />

        <Ed>
          The number that should ring loudest is not $70B. It is the ten years. Silver Lake held this position for a full economic cycle, through two major refinancings, one near-existential acquisition, a tracking-stock IPO, a spin-off, and a strategic sale. That holding period is heretical by traditional PE standards. It is also why the return exists. Compressed 5-year holds optimize for IRR. Decade-long holds optimize for multiple. Different metrics. Different deal designs. Different LP conversations. Silver Lake chose the harder one and earned a result that, on absolute dollars, no traditional five-year LBO could have produced.
        </Ed>

        {/* CHAPTER 10 */}
        <H2 id="ch10">10 &mdash; The Playbook</H2>
        <P>
          Eight lessons drawn from the file. Some apply to private equity. Others apply to public-company governance, to founder-led businesses, to anyone trying to underwrite complexity that the market has decided to ignore.
        </P>

        {lessons.map(function(l) { return <Lesson key={l.n} lesson={l} />; })}

        <FadeIn>
          <div style={{
            margin: "60px 0 40px",
            padding: "28px 28px",
            background: C.surface,
            borderLeft: "3px solid " + C.copper,
            borderRadius: 4,
            fontFamily: "var(--ds-display)",
            fontSize: 22,
            lineHeight: 1.45,
            color: C.text,
            fontStyle: "italic"
          }}>
            The Dell-Silver Lake deal is in the hall of fame for the same reason that almost no one will replicate it. It required a founder willing to risk his personal balance sheet, a fund willing to hold for ten years, a strategic partner willing to write a $2B side check, and a public market complacent enough to mistake transformation for decline. Those four conditions came together once. The next great LBO will look nothing like this one. The next great LBO never does.
          </div>
        </FadeIn>

        {/* ================= SOURCES ================= */}
        <H2 id="sources">Sources</H2>
        <FadeIn>
          <div style={{ fontFamily: "var(--ds-serif)", fontSize: 14.5, color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>
            Twenty primary and secondary sources. Press releases for deal terms, regulatory filings for capital structure, longform reporting for color and timing. Click any reference number above to jump to its source here.
          </div>
        </FadeIn>
        <div style={{ marginBottom: 40 }}>
          {sources.map(function(s) {
            return (
              <FadeIn key={s.n}>
                <a id={"src-" + s.n} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "14px 16px",
                    marginBottom: 8,
                    background: C.card,
                    border: "1px solid " + C.border,
                    borderRadius: 8,
                    textDecoration: "none",
                    transition: "border-color 0.2s, background 0.2s"
                  }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.background = C.cardH; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: C.copper, fontWeight: 600, letterSpacing: "0.08em", minWidth: 28, marginTop: 2 }}>[{s.n}]</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--ds-sans)", fontSize: 14, color: C.text, fontWeight: 500, marginBottom: 3 }}>{s.title}</div>
                      <div style={{ fontFamily: "var(--ds-mono)", fontSize: 11, color: C.muted, letterSpacing: "0.04em" }}>{s.pub}</div>
                    </div>
                  </div>
                </a>
              </FadeIn>
            );
          })}
        </div>

        {/* METHODOLOGY */}
        <FadeIn>
          <div style={{
            background: C.surface,
            border: "1px dashed " + C.border,
            borderRadius: 10,
            padding: "22px 22px",
            margin: "8px 0 60px"
          }}>
            <div style={{ fontFamily: "var(--ds-mono)", fontSize: 10, color: C.copper, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 10 }}>Methodology &amp; Corrections</div>
            <div style={{ fontFamily: "var(--ds-serif)", fontSize: 14.5, color: C.dim, lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 12px" }}>
                All deal terms, prices, and dates are sourced to primary press releases or SEC filings where available. Where Silver Lake has not publicly disclosed returns, fund multiples are cited as reported by PitchBook and corroborated by the Bocconi Students Investment Club case study, which builds its estimates from publicly-disclosed VMware ownership data and the Broadcom take-out price of $142.50 per share.
              </p>
              <p style={{ margin: "0 0 12px" }}>
                The "Silver Lake equity in" figure of $1.4B refers to the firm's initial check at the 2013 take-private and excludes subsequent follow-on equity contributed during the EMC transaction. The $70B combined-gain figure is widely cited in financial press and reflects the aggregate value created across Michael Dell's personal stake and Silver Lake's fund positions, including VMware spin distributions and the Broadcom takeout cash.
              </p>
              <p style={{ margin: 0 }}>
                The estimated equity-value trajectory in the bar chart is a triangulation, not a disclosed mark. It should be read as directionally accurate rather than precise. Corrections will be applied here as primary data becomes available.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div style={{
            fontFamily: "var(--ds-display)",
            fontSize: 24,
            lineHeight: 1.4,
            color: C.muted,
            fontStyle: "italic",
            textAlign: "center",
            margin: "20px 0 0",
            padding: "30px 0",
            borderTop: "1px solid " + C.faint
          }}>
            The next great LBO is being underwritten somewhere right now.<br />
            <span style={{ color: C.copper }}>Its press release has not been written yet.</span>
          </div>
        </FadeIn>

      </main>
      <ResearchFooter currentSlug="dell-silver-lake" />
    </div>
  );
}
