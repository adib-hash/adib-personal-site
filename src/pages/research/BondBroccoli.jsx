import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// ==================== DATA ====================

const chapters = [
  { id: "ch0", num: "00", short: "Cold Open", title: "The Longest Lease in Hollywood" },
  { id: "ch1", num: "01", short: "The Option", title: "An Option, A Partnership, A Company" },
  { id: "ch2", num: "02", short: "Danjaq", title: "The Machine Behind the Gun Barrel" },
  { id: "ch3", num: "03", short: "Other Media", title: "007 Beyond the Screen" },
  { id: "ch4", num: "04", short: "Battle", title: "The Battle of the Bonds" },
  { id: "ch5", num: "05", short: "Succession", title: "Passing the Reins" },
  { id: "ch6", num: "06", short: "Blond Bond", title: "The Most Hated Casting in Franchise History" },
  { id: "ch7", num: "07", short: "Reinvention", title: "Reinventing 007 By Force of Will" },
  { id: "ch8", num: "08", short: "Friction", title: "What the Sony Hack Showed the World" },
  { id: "ch9", num: "09", short: "The Sale", title: "Craig's Exit, Amazon's Entrance" },
  { id: "ch10", num: "10", short: "Handover", title: "Skyfall, For Real This Time" },
  { id: "ch11", num: "11", short: "Faceoff", title: "Bond vs. the Multiverse" },
  { id: "ch12", num: "12", short: "Villeneuve", title: "The Villeneuve Mission" },
];

const controlEvents = [
  { year: "1961", phase: "founding", title: "An option becomes a company", body: "Harry Saltzman buys a six-month option on the Bond novels from Ian Fleming. Unable to finance a film alone, he partners with producer Albert “Cubby” Broccoli. Eon Productions is formed that June." },
  { year: "1961", phase: "founding", title: "United Artists cedes the pen", body: "UA's Arthur Krim agrees to finance and distribute, but lets Broccoli and Saltzman run the productions — an unusual concession for a studio bankrolling an unproven spy picture." },
  { year: "1962", phase: "founding", title: "Danjaq is born", body: "Broccoli and Saltzman set up Danjaq S.A. as the holding company that owns the Bond film copyrights and licenses them to Eon for production, keeping ownership inside the family." },
  { year: "1962", phase: "founding", title: "Dr. No, and Connery", body: "The first film releases. Dana Broccoli's advocacy for a then little-known Scottish actor over the studio's preferred, more polished leading men becomes franchise legend." },
  { year: "1975", phase: "friction", title: "Saltzman sells out", body: "Bad investments outside the franchise force Harry Saltzman to sell his 50% of Danjaq to United Artists. Broccoli is now the only producer left standing." },
  { year: "1981", phase: "friction", title: "MGM buys United Artists", body: "UA's Bond stake passes to MGM, which becomes the financing and distribution partner without gaining a say over casting or story." },
  { year: "1983", phase: "friction", title: "Battle of the Bonds", body: "Kevin McClory, exploiting a decades-old rights loophole, releases Never Say Never Again with Sean Connery — the only Bond film in 64 years made entirely outside Eon's control." },
  { year: "1986", phase: "founding", title: "Full family control", body: "Albert and Dana Broccoli buy out MGM/UA's 50% of Danjaq. For the first time, the Broccolis own the company outright." },
  { year: "1995", phase: "succession", title: "The next generation", body: "As Cubby's health declines, daughter Barbara Broccoli and stepson Michael G. Wilson take over as producers with GoldenEye, Pierce Brosnan's debut." },
  { year: "1996", phase: "succession", title: "Cubby Broccoli dies", body: "The founder passes at 87. Barbara and Michael are already running the franchise; nothing about creative control changes hands outside the family." },
  { year: "2005", phase: "craig", title: "The blond Bond", body: "Barbara Broccoli and Michael Wilson cast Daniel Craig over ferocious tabloid and fan backlash, betting the franchise's future on a reinvention nobody asked for." },
  { year: "2010", phase: "friction", title: "MGM goes bankrupt", body: "MGM files Chapter 11. Bond 23 is suspended for the better part of a year, screenwriter Peter Morgan walks, and the release date slides to 2012." },
  { year: "2014", phase: "friction", title: "The Sony hack", body: "Leaked emails show MGM pressuring Barbara Broccoli over Spectre's budget and a shaky third act — the family's authority tested in public for the first time." },
  { year: "2021", phase: "craig", title: "No Time to Die", body: "Daniel Craig's fifth and final film closes the reboot era he almost refused to start a second time." },
  { year: "2022", phase: "amazon", title: "Amazon buys MGM", body: "$8.45 billion for the studio and its library. Amazon gains Bond's distribution rights but, by its own account, remains a passive partner on anything creative." },
  { year: "2025", phase: "amazon", title: "Creative control changes hands", body: "A new joint venture hands Amazon MGM Studios creative control of Bond. Barbara Broccoli and Michael Wilson step back after a combined 88 years inside the family business." },
  { year: "2025", phase: "villeneuve", title: "Villeneuve is named director", body: "Amazon MGM announces Denis Villeneuve will direct the next Bond film — on a single-picture deal, without final cut, the first Bond director hired by a corporate studio rather than the Broccolis." },
];

const actorData = [
  { name: "Sean Connery", start: 1962, end: 1967, color: "#c9a227", eon: true, note: "Dr. No through You Only Live Twice — the character invented on screen." },
  { name: "George Lazenby", start: 1969, end: 1969.9, color: "#4a7ba6", eon: true, note: "One film, On Her Majesty's Secret Service, then he quit before it even opened." },
  { name: "Sean Connery", start: 1971, end: 1971.9, color: "#c9a227", eon: true, note: "Lured back for Diamonds Are Forever with a then-record fee for an actor." },
  { name: "Sean Connery — outside Eon", start: 1983, end: 1983.9, color: "#a11d1d", eon: false, note: "Never Say Never Again — produced by Kevin McClory's Taliafilm, not Eon. The one gap in the family's chain of custody." },
  { name: "Roger Moore", start: 1973, end: 1985, color: "#e8c766", eon: true, note: "Seven films across twelve years — the longest tenure of any Bond." },
  { name: "Timothy Dalton", start: 1987, end: 1989, color: "#6b8e6b", eon: true, note: "Two films before a rights dispute with MGM froze the franchise for six years." },
  { name: "Pierce Brosnan", start: 1995, end: 2002, color: "#4a7ba6", eon: true, note: "GoldenEye relaunches Eon after the six-year legal freeze." },
  { name: "Daniel Craig", start: 2006, end: 2021, color: "#a11d1d", eon: true, note: "Casino Royale to No Time to Die — cast over a public backlash, the reboot that defined the era." },
  { name: "TBD — Villeneuve's search", start: 2027, end: 2027.9, color: "#847f74", eon: true, dashed: true, note: "Casting underway in 2026 for a film expected to begin shooting in 2027 — the first Bond chosen without a Broccoli in the room." },
];

const mediaRows = [
  { medium: "Video games", licensor: "Danjaq, LLC", color: "#c9a227", detail: "Licensed and gatekept directly by Danjaq. Latest release: 007 First Light (IO Interactive, 2026). Danjaq can, and has, blocked a finished game from shipping." },
  { medium: "Continuation novels", licensor: "Ian Fleming Publications", color: "#4a7ba6", detail: "Roughly 50 novels since 1968, from Kingsley Amis's Colonel Sun to Anthony Horowitz's recent trilogy. None of it runs through Danjaq or Eon." },
  { medium: "Comics", licensor: "Ian Fleming Publications, via Dynamite Entertainment", color: "#4a7ba6", detail: "Licensed straight from the Fleming estate's company since 2015 — the same arrangement as the novels, bypassing the film side entirely." },
];

const assetRows = [
  { label: "Trademarks", tag: "Full ownership", detail: "The “James Bond 007” wordmark and the gun-barrel logo, registered worldwide and held by Danjaq outright." },
  { label: "Film copyrights", tag: "Co-owned with the studio", detail: "The 20 classic titles plus No Time to Die are confirmed co-owned with the studio partner — first UA, then MGM, now Amazon MGM. The split on the four Casino Royale-era titles isn't itemized in any public filing we found." },
  { label: "Worldwide merchandising", tag: "Full control", detail: "Toys, apparel, and tie-in licensing of every kind, controlled entirely by Danjaq." },
  { label: "Video game licensing", tag: "Full control, used as a veto", detail: "Exercised in practice: a finished GoldenEye Xbox Live Arcade remaster was shelved after Danjaq and Eon wouldn't sign off on terms." },
  { label: "Estimated value", tag: "~£450M before 2025", detail: "The Broccoli/Wilson combined fortune per the Sunday Times Rich List, before a reported additional ~$1B for creative control that year. Estimates from different outlets vary widely." },
  { label: "Outside their reach", tag: "Literary novels & comics", detail: "Held entirely by Ian Fleming Publications, a company controlled by the Fleming estate and never part of the Broccoli/Danjaq structure." },
];

const ownershipLedgerRows = [
  { label: "Trademarks & character likeness", danjaq: "full", studio: "none" },
  { label: "Film copyrights (most titles)", danjaq: "shared", studio: "shared" },
  { label: "Casting & script approval, 1961–2025", danjaq: "full", studio: "none" },
  { label: "Creative control, 2025–present", danjaq: "none", studio: "full" },
  { label: "Financing & production budget", danjaq: "none", studio: "full" },
  { label: "Theatrical distribution & marketing", danjaq: "none", studio: "full" },
  { label: "Worldwide merchandising licensing", danjaq: "full", studio: "none" },
  { label: "Video game licensing", danjaq: "full", studio: "none" },
  { label: "Literary novels & comics", danjaq: "none", studio: "none", note: "Held by Ian Fleming Publications, outside this deal entirely" },
];

const faceoffRows = [
  {
    aspect: "Who legally controls the character",
    bond: "Danjaq LLC / Eon Productions — wholly owned by the Broccoli family from 1986 until 2025, now a joint venture with Amazon MGM Studios.",
    spidey: "Sony Pictures holds the film and TV rights in perpetuity, via a 1998 deal with a nearly-bankrupt Marvel, so long as it keeps releasing a movie roughly every five years and nine months.",
  },
  {
    aspect: "Actors, and decades on screen",
    bond: "Seven actors (counting Connery's non-Eon return) across 64 years, 1962 to 2026.",
    spidey: "Three leads — Maguire, Garfield, Holland — across 24 years, 2002 to 2026, plus a parallel animated multiverse.",
  },
  {
    aspect: "Reboots vs. recasting",
    bond: "Zero reboots. Eon has never restarted continuity; a new actor is simply the next Bond, full stop, no origin story required.",
    spidey: "Two full continuity reboots — The Amazing Spider-Man in 2012, then a second relaunch folding the character into the MCU in 2016.",
  },
  {
    aspect: "Who decides who wears the mask",
    bond: "One family, then one producing duo, makes the call, and has overruled public and press backlash to do it, as with Craig in 2005.",
    spidey: "Negotiated jointly by two separate studios (Sony and Marvel Studios/Disney) with different, sometimes competing incentives.",
  },
  {
    aspect: "The mechanism of control",
    bond: "Creative control was written into the 1961 United Artists financing deal and never renegotiated away until February 2025: 64 uninterrupted years.",
    spidey: "Split down the middle from day one: Sony owns the film rights outright; Marvel Studios only participates through a revenue-sharing loan-out arrangement it can lose.",
  },
  {
    aspect: "The one interruption",
    bond: "1983's Never Say Never Again — a rival Connery Bond made entirely outside Eon, via a 20-year-old rights loophole no one closed until 2013.",
    spidey: "No outright rival film, but the character has changed creative regimes three separate times since 2002: Sony solo, Sony/Marvel co-production, and back to Sony-led again.",
  },
];

const sources = [
  { n: 1, title: "Eon Productions", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Eon_Productions" },
  { n: 2, title: "Albert R. Broccoli", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Albert_R._Broccoli" },
  { n: 3, title: "Harry Saltzman", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Harry_Saltzman" },
  { n: 4, title: "Danjaq", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Danjaq" },
  { n: 5, title: "The family business that owns a share of the $7B James Bond franchise", pub: "The Hustle", url: "https://thehustle.co/the-family-business-that-owns-a-share-of-the-7b-james-bond-franchise" },
  { n: 6, title: "Never Say Never Again", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Never_Say_Never_Again" },
  { n: 7, title: "James Bond Rights Dispute Ends After 50 Years", pub: "Variety, 2013", url: "https://variety.com/2013/biz/news/james-bond-right-dispute-ends-after-50-years-1200837571/" },
  { n: 8, title: "Barbara Broccoli", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Barbara_Broccoli" },
  { n: 9, title: "20 Years Ago, James Bond Fans Hated the Daniel Craig Casting", pub: "Den of Geek", url: "https://www.denofgeek.com/movies/james-bond-fans-hated-daniel-craig-casting/" },
  { n: 10, title: "How Daniel Craig Became the Longest-Reigning James Bond After a Brutal Start", pub: "Variety, 2021", url: "https://variety.com/2021/film/news/daniel-craig-james-bond-casino-royale-no-time-to-die-1235074334/" },
  { n: 11, title: "Skyfall", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Skyfall" },
  { n: 12, title: "MGM Allegedly Battled to Cut James Bond's $300 Million Plus Budget: Sony Hack Latest", pub: "Variety, 2014", url: "https://variety.com/2014/film/global/mgm-allegedly-battled-to-cut-james-bonds-300-million-plus-budget-sony-hack-latest-1201376924/" },
  { n: 13, title: "James Bond 'Spectre' Script Stolen in Sony Hacking Attack", pub: "Deadline, 2014", url: "https://deadline.com/2014/12/james-bond-spectre-script-stolen-sony-eon-productions-1201324726/" },
  { n: 14, title: "Daniel Craig: 'I'd Rather Slash My Wrists' Than Do Another Bond Film", pub: "TIME", url: "https://time.com/4065408/daniel-craig-james-bond-slash-wrists/" },
  { n: 15, title: "No Time to Die", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/No_Time_to_Die" },
  { n: 16, title: "Why Amazon Spent $8.5 Billion to Land MGM, and What's Next for the Studio Behind James Bond", pub: "Variety, 2022", url: "https://variety.com/2022/film/news/amazon-mgm-james-bond-whats-next-1235208070/" },
  { n: 17, title: "James Bond Shocker: Amazon MGM Gains Creative Control of 007 Franchise", pub: "Variety, 2025", url: "https://variety.com/2025/film/global/james-bond-amazon-mgm-gain-creative-control-1236313930/" },
  { n: 18, title: "James Bond Shake-Up: Amazon Takes Creative Control of Franchise From Broccoli Family", pub: "Hollywood Reporter, 2025", url: "https://www.hollywoodreporter.com/movies/movie-news/amazon-mgm-studios-james-bond-franchise-1236141794/" },
  { n: 19, title: "Amazon MGM Studios Announces New Joint Venture with Michael G. Wilson and Barbara Broccoli", pub: "About Amazon", url: "https://www.aboutamazon.com/news/company-news/amazon-mgm-studios-james-bond" },
  { n: 20, title: "Amazon MGM Studios Takes Creative Control of James Bond Franchise", pub: "CNN Business, 2025", url: "https://www.cnn.com/2025/02/20/business/amazon-mgm-james-bond/index.html" },
  { n: 21, title: "No, Amazon Didn't Pay $20 Million For The Rights To James Bond", pub: "Forbes, 2025", url: "https://www.forbes.com/sites/carolinereid/2025/10/22/no-amazon-didnt-pay-20-million-for-the-rights-to-james-bond/" },
  { n: 22, title: "James Bond Producer EON Reports $20M Payment From Amazon MGM Studios For Stake In Spy Franchise", pub: "Deadline, 2025", url: "https://deadline.com/2025/10/amazon-mgm-studios-eon-productions-20m-james-bond-1236594201/" },
  { n: 23, title: "Insider Says Amazon CEO Jeff Bezos Told Amazon MGM To Buy Out Barbara Broccoli's Stake In Bond Franchise", pub: "The Playlist, 2025", url: "https://theplaylist.net/insider-says-amazon-ceo-jeff-bezos-instigated-new-joint-venture-that-cut-barbara-broccoli-out-of-the-bond-franchise-i-dont-care-what-it-costs-get-rid-of-her-20250307/" },
  { n: 24, title: "Jeff Bezos Wanted to Remove Barbara Broccoli After She Called Amazon Execs 'F**king Idiots' — Report", pub: "IndieWire, 2025", url: "https://www.indiewire.com/news/general-news/jeff-bezos-bond-barbara-broccoli-amazon-idiots-1235101692/" },
  { n: 25, title: "Spider-Man in film", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/Spider-Man_in_film" },
  { n: 26, title: "The Contract That Commits Sony To Making 'Spider-Man' Spinoffs", pub: "Forbes, 2025", url: "https://www.forbes.com/sites/carolinereid/2025/01/03/revealed-the-contract-clause-that-commits-sony-to-making-spider-man-spinoffs/" },
  { n: 27, title: "Amazon MGM Studios Sets Denis Villeneuve as Director of Next James Bond Film", pub: "About Amazon", url: "https://www.aboutamazon.com/news/entertainment/amazon-mgm-studios-james-bond-director-denis-villeneuve" },
  { n: 28, title: "Denis Villeneuve to Direct Next James Bond Film", pub: "007.com", url: "https://www.007.com/denis-villeneuve-to-direct-next-james-bond-film/" },
  { n: 29, title: "James Bond: Denis Villeneuve To Cast “Unknown” British Actor", pub: "Deadline, 2025", url: "https://deadline.com/2025/09/james-bond-cast-unknown-british-actor-denis-villeneuve-dune-1236554375/" },
  { n: 30, title: "New James Bond Actor Casting Gets Exciting Major Update In Report", pub: "ScreenRant", url: "https://screenrant.com/james-bond-denis-villeneuve-casting-auditions-august-report/" },
  { n: 31, title: "Bond Casting Shortlist Revealed as Villeneuve Eyes Five 007 Contenders", pub: "3DVF", url: "https://3dvf.com/en/bond-casting-shortlist-revealed-as-villeneuve-eyes-five-007-contenders/" },
  { n: 32, title: "Jacob Elordi or Callum Turner Should Not Be James Bond, Says Ex-007 Casting Director", pub: "Variety, 2026", url: "https://variety.com/2026/film/news/jacob-elordi-callum-turner-james-bond-casting-director-1236798307/" },
  { n: 33, title: "James Bond Franchise Box Office History", pub: "The Numbers", url: "https://www.the-numbers.com/movies/franchise/James-Bond" },
  { n: 34, title: "James Bond in Video Games", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/James_Bond_in_video_games" },
  { n: 35, title: "GoldenEye 007's Cancelled Xbox Remaster Leaks in Entirety", pub: "Video Games Chronicle", url: "https://www.videogameschronicle.com/news/goldeneye-007s-cancelled-xbox-remaster-leaks-in-entirety-via-a-2-hour-video/" },
  { n: 36, title: "007 First Light", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/007_First_Light" },
  { n: 37, title: "List of James Bond Novels and Short Stories", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/List_of_James_Bond_novels_and_short_stories" },
  { n: 38, title: "James Bond (Dynamite Entertainment)", pub: "Wikipedia", url: "https://en.wikipedia.org/wiki/James_Bond_(Dynamite_Entertainment)" },
  { n: 39, title: "Who Owns James Bond? Rights, History, and Amazon's Deal", pub: "LegalClarity", url: "https://legalclarity.org/who-owns-james-bond-rights-history-and-amazons-deal/" },
  { n: 40, title: "Broccoli and Wilson Debut on Sunday Times Rich List", pub: "The James Bond Dossier", url: "https://www.thejamesbonddossier.com/news/broccoli-and-wilson-debut-on-sunday-times-rich-list.htm" },
];

// ==================== DESIGN SYSTEM ====================

const C = {
  bg:      "#0a0a0c",
  surface: "#111114",
  card:    "#17171b",
  cardH:   "#1e1e24",
  accent:  "#c9a227",
  accent2: "#e8c766",
  gold:    "#f0dca0",
  red:     "#a11d1d",
  green:   "#5f8f6e",
  blue:    "#4a7ba6",
  text:    "#f2efe9",
  dim:     "#c9c4ba",
  muted:   "#87827a",
  faint:   "#201f22",
  border:  "#2a2a30",
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

function GunBarrel() {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: 780, height: 780, borderRadius: "50%",
      border: "1px solid " + C.accent + "14",
      pointerEvents: "none",
    }}>
      <div style={{ position: "absolute", inset: 90, borderRadius: "50%", border: "1px solid " + C.accent + "18" }} />
      <div style={{ position: "absolute", inset: 180, borderRadius: "50%", border: "1px solid " + C.accent + "22" }} />
      <div style={{ position: "absolute", inset: 270, borderRadius: "50%", border: "1px solid " + C.accent + "2c" }} />
    </div>
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

function Ed({ children }) {
  return (
    <FadeIn>
      <div style={{
        margin: "0 0 28px",
        padding: "20px 26px",
        background: "rgba(201,162,39,0.07)",
        borderRadius: 10,
        fontFamily: "var(--jb-serif)",
        fontSize: 17,
        lineHeight: 1.9,
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
        fontFamily: "var(--jb-mono)", fontWeight: 600, opacity: 0.65, marginLeft: 2
      }}
      onClick={function() {
        var el = document.getElementById("jb-sources");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }}
    >{"[" + n + "]"}</sup>
  );
}

function P({ children }) {
  return (
    <FadeIn>
      <p style={{
        fontFamily: "var(--jb-serif)", fontSize: 18,
        lineHeight: 1.85, color: C.dim, margin: "0 0 26px"
      }}>
        {children}
      </p>
    </FadeIn>
  );
}

function H2({ children, num }) {
  return (
    <FadeIn>
      <div style={{ margin: "92px 0 36px", position: "relative" }}>
        <div style={{
          position: "absolute", top: -52, left: -18,
          fontFamily: "var(--jb-display)",
          fontSize: 148, fontWeight: 900,
          color: "rgba(201,162,39,0.055)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
          letterSpacing: "-0.04em",
        }}>{num}</div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent,
            letterSpacing: "0.28em", marginBottom: 14,
            textTransform: "uppercase", fontWeight: 500
          }}>{"Chapter " + num}</div>
          <h2 style={{
            fontFamily: "var(--jb-display)", fontSize: "clamp(30px, 4vw, 42px)",
            fontWeight: 700, color: C.text, margin: 0,
            lineHeight: 1.1, letterSpacing: "-0.02em"
          }}>{children}</h2>
          <div style={{ width: 40, height: 1, background: C.accent + "99", marginTop: 18 }} />
        </div>
      </div>
    </FadeIn>
  );
}

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
          fontFamily: "var(--jb-display)", fontSize: 128, fontWeight: 900,
          color: C.accent + "18", lineHeight: 1,
          pointerEvents: "none", userSelect: "none", fontStyle: "italic",
        }}>&ldquo;</div>
        <div style={{ position: "relative" }}>
          <div style={{
            fontFamily: "var(--jb-display)", fontSize: 20,
            lineHeight: 1.58, color: C.text, fontStyle: "italic", margin: 0,
          }}>{children}</div>
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ width: 22, height: 1, background: C.accent + "99" }} />
            <span style={{ fontFamily: "var(--jb-sans)", fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: "0.05em" }}>{author}</span>
            <span style={{ fontFamily: "var(--jb-sans)", fontSize: 11, color: C.muted }}>{role}</span>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

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
      <div style={{ fontFamily: "var(--jb-mono)", fontSize: 9, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
      <div style={{ fontFamily: "var(--jb-display)", fontSize: 28, fontWeight: 700, color: col, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontFamily: "var(--jb-sans)", fontSize: 11, color: C.muted, marginTop: 9, lineHeight: 1.4 }}>{sub}</div>}
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
          to="/research"
          aria-label="Back to research"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "12px 12px 12px 8px", marginRight: 8,
            color: C.muted, fontFamily: "var(--jb-mono)", fontSize: 14,
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
                  fontFamily: "var(--jb-sans)",
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

// ==================== CONTROL TIMELINE ====================

function ControlTimeline() {
  var [hovIdx, setHovIdx] = useState(null);
  function colorFor(phase) {
    if (phase === "friction") return C.red;
    if (phase === "craig") return C.blue;
    if (phase === "succession") return C.green;
    if (phase === "amazon") return C.accent2;
    if (phase === "villeneuve") return C.gold;
    return C.accent;
  }
  return (
    <FadeIn>
      <div style={{ position: "relative", padding: "20px 0 0 40px", margin: "12px 0 44px" }}>
        <div style={{
          position: "absolute", left: 16, top: 16, bottom: 0, width: 1,
          background: "linear-gradient(to bottom, " + C.accent + " 0%, " + C.red + " 38%, " + C.green + " 55%, " + C.blue + " 72%, " + C.accent2 + " 88%, " + C.gold + " 100%)",
        }} />
        {controlEvents.map(function(ev, i) {
          var dotColor = colorFor(ev.phase);
          var isHov = hovIdx === i;
          return (
            <div
              key={i}
              onMouseEnter={function() { setHovIdx(i); }}
              onMouseLeave={function() { setHovIdx(null); }}
              style={{
                position: "relative",
                marginBottom: i === controlEvents.length - 1 ? 0 : 24,
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
              <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: dotColor, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 3, fontWeight: 500 }}>{ev.year}</div>
              <div style={{ fontFamily: "var(--jb-sans)", fontSize: 14.5, color: C.text, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
              <div style={{ fontFamily: "var(--jb-serif)", fontSize: 14, color: C.dim, lineHeight: 1.6 }}>{ev.body}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== ACTOR GANTT ====================

function ActorGantt() {
  var [hov, setHov] = useState(null);
  var minYear = 1962, maxYear = 2028, span = maxYear - minYear;

  function pct(year) { return ((year - minYear) / span) * 100; }

  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "26px 20px 20px", margin: "12px 0 32px" }}>
        <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>64 years, seven actors, one gap</div>
        <div style={{ fontFamily: "var(--jb-sans)", fontSize: 14, color: C.muted, marginBottom: 22 }}>Hover a bar for the story behind it</div>

        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--jb-mono)", fontSize: 9, color: C.muted, marginBottom: 6, paddingLeft: 2 }}>
          <span>1962</span><span>1980</span><span>2000</span><span>2020</span><span>2028</span>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {actorData.map(function(a, i) {
            var isH = hov === i;
            var left = pct(a.start);
            var width = Math.max(pct(a.end) - pct(a.start), 1.3);
            return (
              <div key={i + a.name} style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 12, alignItems: "center" }}>
                <div style={{
                  fontFamily: "var(--jb-sans)", fontSize: 11.5, color: a.eon ? C.text : C.red,
                  fontWeight: a.eon ? 500 : 700, textAlign: "right", lineHeight: 1.25,
                }}>{a.name}</div>
                <div
                  onMouseEnter={function() { setHov(i); }}
                  onMouseLeave={function() { setHov(null); }}
                  style={{ position: "relative", height: 26, background: C.surface, borderRadius: 5, cursor: "pointer" }}
                >
                  <div style={{
                    position: "absolute", left: left + "%", width: width + "%", top: 0, bottom: 0,
                    background: a.dashed ? "repeating-linear-gradient(45deg, " + a.color + "cc, " + a.color + "cc 4px, " + a.color + "55 4px, " + a.color + "55 8px)" : a.color,
                    borderRadius: 4,
                    border: a.eon ? "none" : "1.5px dashed " + C.red,
                    opacity: isH ? 1 : 0.86,
                    boxShadow: isH ? "0 0 0 2px " + a.color + "55" : "none",
                    transition: "opacity 0.15s, box-shadow 0.15s",
                  }} />
                  {isH && (
                    <div style={{
                      position: "absolute", left: Math.min(Math.max(left, 0), 60) + "%", top: 30, zIndex: 5,
                      background: C.bg, border: "1px solid " + a.color + "88",
                      borderRadius: 8, padding: "9px 12px", minWidth: 220, maxWidth: 300,
                      boxShadow: "0 16px 40px rgba(0,0,0,.7)",
                      fontFamily: "var(--jb-serif)", fontSize: 12.5, color: C.dim, lineHeight: 1.5,
                    }}>{a.note}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid " + C.border, fontFamily: "var(--jb-sans)", fontSize: 11, color: C.muted, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 14, height: 10, border: "1.5px dashed " + C.red, borderRadius: 3 }} />
          <span>Red-dashed bar = produced outside Eon Productions</span>
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== MEDIA LEDGER (games / novels / comics) ====================

function MediaLedger() {
  var [hov, setHov] = useState(null);
  return (
    <FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, margin: "16px 0 32px" }}>
        {mediaRows.map(function(row, i) {
          var isH = hov === i;
          return (
            <div
              key={row.medium}
              onMouseEnter={function() { setHov(i); }}
              onMouseLeave={function() { setHov(null); }}
              style={{
                background: isH ? C.cardH : C.card,
                border: "1px solid " + (isH ? row.color + "55" : C.border),
                borderRadius: 12, padding: "18px 18px 16px",
                transition: "background 0.18s, border-color 0.18s",
              }}
            >
              <div style={{ fontFamily: "var(--jb-display)", fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 6 }}>{row.medium}</div>
              <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: row.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{row.licensor}</div>
              <div style={{ fontFamily: "var(--jb-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.6 }}>{row.detail}</div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== ASSET GRID (what Danjaq/Eon actually own) ====================

function AssetGrid() {
  var [hov, setHov] = useState(null);
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "24px 22px 20px", margin: "16px 0 32px" }}>
        <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>What Danjaq and Eon actually own</div>
        <div style={{ fontFamily: "var(--jb-sans)", fontSize: 14, color: C.muted, marginBottom: 20 }}>Best available picture, pieced together from public filings and reporting &mdash; not an official disclosure</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
          {assetRows.map(function(row, i) {
            var isH = hov === i;
            return (
              <div
                key={row.label}
                onMouseEnter={function() { setHov(i); }}
                onMouseLeave={function() { setHov(null); }}
                style={{
                  background: isH ? C.surface : "transparent",
                  border: "1px solid " + (isH ? C.accent + "44" : C.border),
                  borderRadius: 10, padding: "16px 16px 14px",
                  transition: "background 0.18s, border-color 0.18s",
                }}
              >
                <div style={{ fontFamily: "var(--jb-sans)", fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.06em", marginBottom: 10 }}>{row.tag}</div>
                <div style={{ fontFamily: "var(--jb-serif)", fontSize: 13, color: C.dim, lineHeight: 1.55 }}>{row.detail}</div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== OWNERSHIP LEDGER (Danjaq/Eon vs Studio) ====================

function Badge({ state, tone }) {
  if (state === "full") {
    return (
      <span style={{
        display: "inline-block", padding: "3px 10px", borderRadius: 20,
        background: tone, color: C.bg, fontFamily: "var(--jb-mono)", fontSize: 9,
        fontWeight: 700, letterSpacing: "0.08em",
      }}>FULL</span>
    );
  }
  if (state === "shared") {
    return (
      <span style={{
        display: "inline-block", padding: "3px 10px", borderRadius: 20,
        border: "1.5px dashed " + C.accent2, color: C.accent2,
        fontFamily: "var(--jb-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
      }}>SHARED</span>
    );
  }
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      border: "1px solid " + C.border, color: C.muted,
      fontFamily: "var(--jb-mono)", fontSize: 9, fontWeight: 600, letterSpacing: "0.08em",
    }}>NONE</span>
  );
}

function OwnershipLedger() {
  var [hovI, setHovI] = useState(null);
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, overflow: "hidden", margin: "16px 0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 96px 96px", background: C.surface, borderBottom: "1px solid " + C.border }}>
          <div style={{ padding: "14px 16px", fontFamily: "var(--jb-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Who controls it</div>
          <div style={{ padding: "14px 8px", fontFamily: "var(--jb-display)", fontSize: 14, fontWeight: 700, color: C.accent, textAlign: "center" }}>Danjaq / Eon</div>
          <div style={{ padding: "14px 8px", fontFamily: "var(--jb-display)", fontSize: 14, fontWeight: 700, color: C.blue, textAlign: "center", borderLeft: "1px solid " + C.border }}>Studio</div>
        </div>
        {ownershipLedgerRows.map(function(row, i) {
          var isH = hovI === i;
          return (
            <div
              key={row.label}
              onMouseEnter={function() { setHovI(i); }}
              onMouseLeave={function() { setHovI(null); }}
              style={{
                display: "grid", gridTemplateColumns: "1fr 96px 96px", alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid " + C.border,
                background: isH ? C.cardH : "transparent", transition: "background 0.15s",
              }}
            >
              <div style={{ padding: "12px 16px" }}>
                <div style={{ fontFamily: "var(--jb-sans)", fontSize: 13, color: C.text, fontWeight: 500, lineHeight: 1.4 }}>{row.label}</div>
                {row.note && <div style={{ fontFamily: "var(--jb-serif)", fontSize: 11.5, color: C.muted, marginTop: 3, fontStyle: "italic" }}>{row.note}</div>}
              </div>
              <div style={{ textAlign: "center" }}><Badge state={row.danjaq} tone={C.accent} /></div>
              <div style={{ textAlign: "center", borderLeft: "1px solid " + C.border, padding: "8px 0" }}><Badge state={row.studio} tone={C.blue} /></div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== FACEOFF (BOND vs SPIDER-MAN) ====================

function Faceoff() {
  var [hovI, setHovI] = useState(null);
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, overflow: "hidden", margin: "16px 0 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: C.surface, borderBottom: "1px solid " + C.border }}>
          <div style={{ padding: "16px 18px", fontFamily: "var(--jb-display)", fontSize: 18, fontWeight: 700, color: C.accent, textAlign: "center" }}>007</div>
          <div style={{ padding: "16px 18px", fontFamily: "var(--jb-display)", fontSize: 18, fontWeight: 700, color: C.blue, textAlign: "center", borderLeft: "1px solid " + C.border }}>Spider-Man</div>
        </div>
        {faceoffRows.map(function(row, i) {
          var isH = hovI === i;
          return (
            <div
              key={i}
              onMouseEnter={function() { setHovI(i); }}
              onMouseLeave={function() { setHovI(null); }}
              style={{ borderTop: i === 0 ? "none" : "1px solid " + C.border, background: isH ? C.cardH : "transparent", transition: "background 0.15s" }}
            >
              <div style={{ padding: "12px 18px 4px", fontFamily: "var(--jb-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{row.aspect}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                <div style={{ padding: "6px 18px 16px", fontFamily: "var(--jb-serif)", fontSize: 14, color: C.dim, lineHeight: 1.6 }}>{row.bond}</div>
                <div style={{ padding: "6px 18px 16px", fontFamily: "var(--jb-serif)", fontSize: 14, color: C.dim, lineHeight: 1.6, borderLeft: "1px solid " + C.border }}>{row.spidey}</div>
              </div>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}

// ==================== SKYFALL SPLIT (DANJAQ ECONOMICS) ====================

function SkyfallSplit() {
  return (
    <FadeIn>
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 14, padding: "24px 22px 20px", margin: "12px 0 32px" }}>
        <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 4, fontWeight: 500 }}>First-dollar gross, illustrated</div>
        <div style={{ fontFamily: "var(--jb-sans)", fontSize: 14, color: C.muted, marginBottom: 20 }}>Skyfall grossed $1.1B. A leaked MGM memo shows who got paid first.</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "18px 16px" }}>
            <div style={{ fontFamily: "var(--jb-mono)", fontSize: 9, color: C.muted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>MGM (the studio)</div>
            <div style={{ fontFamily: "var(--jb-display)", fontSize: 30, fontWeight: 700, color: C.blue }}>$179M</div>
          </div>
          <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "18px 16px" }}>
            <div style={{ fontFamily: "var(--jb-mono)", fontSize: 9, color: C.muted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>Danjaq (the family)</div>
            <div style={{ fontFamily: "var(--jb-display)", fontSize: 30, fontWeight: 700, color: C.accent }}>$109M</div>
          </div>
        </div>
        <div style={{ marginTop: 14, fontFamily: "var(--jb-serif)", fontSize: 13.5, color: C.dim, lineHeight: 1.6 }}>
          Danjaq's contract entitles it to a slice of the very first dollars in the door, before the studio recoups marketing or production costs. On the biggest hit of the Craig era, the family's production company took in nearly two-thirds of what the studio itself cleared.<Rf n={5}/>
        </div>
      </div>
    </FadeIn>
  );
}

// ==================== EPILOGUE STAT ROW ====================

function StatRow() {
  return (
    <FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8, margin: "12px 0 32px" }}>
        <StatCard value="64 yrs" label="Family Control" sub="1961–2025" color={C.accent} />
        <StatCard value="7" label="Actors" sub="Incl. Connery's return" color={C.accent2} />
        <StatCard value="0" label="Reboots" sub="Never restarted continuity" color={C.green} />
        <StatCard value="$7.8B" label="Lifetime Box Office" sub="25 Eon films" color={C.blue} />
        <StatCard value="$8.45B" label="Amazon's MGM Buy" sub="2022" color={C.gold} />
        <StatCard value="~$1B" label="Reported Buyout" sub="For creative control, 2025" color={C.red} />
      </div>
    </FadeIn>
  );
}

// ==================== MAIN ====================

export default function BondBroccoli() {
  var [activeChapter, setActiveChapter] = useState("ch0");
  var [showNav, setShowNav] = useState(function() { return window.innerWidth <= 768; });
  var rafRef = useRef(null);
  var lastRef = useRef("ch0");

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
    <div className="jb-root" style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "var(--jb-serif)" }}>

      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        .jb-root {
          --jb-display: 'Playfair Display', Georgia, serif;
          --jb-serif:   'Lora', Georgia, serif;
          --jb-sans:    'Barlow', system-ui, sans-serif;
          --jb-mono:    'JetBrains Mono', Menlo, monospace;
        }
        :root {
          --jb-display: 'Playfair Display', Georgia, serif;
          --jb-serif:   'Lora', Georgia, serif;
          --jb-sans:    'Barlow', system-ui, sans-serif;
          --jb-mono:    'JetBrains Mono', Menlo, monospace;
        }
        @media (max-width: 640px) {
          .jb-root .jb-faceoff-grid, .jb-root .jb-split-grid { grid-template-columns: 1fr !important; }
          .jb-root .jb-gantt-label { text-align: left !important; }
        }
        @keyframes jb-bounceDown {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(6px); opacity: 1; }
        }
      `}</style>

      <ProgressBar />
      <NavBar active={activeChapter} show={showNav} />

      {/* ========== HERO ========== */}
      <section style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        <GunBarrel />
        <div style={{
          position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 500,
          background: "radial-gradient(ellipse, rgba(201,162,39,0.09) 0%, transparent 68%)",
          pointerEvents: "none", filter: "blur(60px)",
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 920, margin: "0 auto", padding: "14vh 24px 8vh", width: "100%" }}>
          <HeroReveal delay={80}>
            <div style={{
              fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent,
              letterSpacing: "0.32em", marginBottom: 36, textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.accent + "88" }} />
              An IP Stewardship Narrative
              <span style={{ display: "inline-block", width: 32, height: 1, background: C.accent + "44" }} />
            </div>
          </HeroReveal>

          <HeroReveal delay={220}>
            <h1 style={{ fontFamily: "var(--jb-display)", margin: "0 0 6px", padding: 0, lineHeight: 1.0 }}>
              <span style={{
                display: "block", fontSize: "clamp(48px, 8.5vw, 92px)",
                fontWeight: 900, color: C.text, letterSpacing: "-0.03em",
              }}>The Family</span>
              <span style={{
                display: "block", fontSize: "clamp(44px, 7.5vw, 80px)",
                fontWeight: 400, fontStyle: "italic",
                color: C.accent, letterSpacing: "-0.015em", marginTop: "0.08em",
              }}>Behind the Gun Barrel</span>
            </h1>
          </HeroReveal>

          <HeroReveal delay={420}>
            <p style={{
              fontFamily: "var(--jb-serif)", fontSize: 20, lineHeight: 1.58,
              color: C.dim, margin: "32px 0 36px", fontStyle: "italic", maxWidth: 680,
            }}>
              For 64 years, one family decided who got to be James Bond, and nobody — not a studio, not the press, not the fans — could overrule them. In 2025, that finally changed.
            </p>
          </HeroReveal>

          <HeroReveal delay={560}>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 52,
              fontFamily: "var(--jb-mono)", fontSize: 10, color: C.muted,
              letterSpacing: "0.14em", textTransform: "uppercase", alignItems: "center",
            }}>
              <span>Jul 2026</span>
              <span style={{ opacity: 0.3 }}>&middot;</span>
              <span>~24 min read</span>
              <span style={{ opacity: 0.3 }}>&middot;</span>
              <span>40 sources</span>
            </div>
          </HeroReveal>

          <HeroReveal delay={720}>
            <div style={{
              background: C.card, borderRadius: 14,
              padding: "28px 28px 24px", border: "1px solid " + C.border,
              marginBottom: 40,
            }}>
              <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 18, fontWeight: 500 }}>The Paradox In One Line</div>
              <p style={{ fontFamily: "var(--jb-display)", fontSize: 22, lineHeight: 1.38, color: C.text, margin: "0 0 24px", fontWeight: 400 }}>
                Marvel sold Spider-Man's movie rights for <strong style={{ color: C.blue, fontWeight: 700 }}>$7 million</strong> in 1998 and has been fighting to get them back ever since. The Broccolis never sold Bond at all — Amazon had to pay them roughly <strong style={{ color: C.accent, fontWeight: 700 }}>$1 billion</strong> just to take the wheel.<Rf n={23}/>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, background: C.border, borderRadius: 8, overflow: "hidden" }}>
                {[
                  { val: "1961", label: "Eon Founded", col: C.accent },
                  { val: "2025", label: "Control Sold", col: C.red },
                  { val: "7", label: "Actors, One Family", col: C.gold },
                ].map(function(s, i) {
                  return (
                    <div key={i} style={{ background: C.card, textAlign: "center", padding: "16px 8px 14px" }}>
                      <div style={{ fontFamily: "var(--jb-display)", fontSize: 26, color: s.col, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.val}</div>
                      <div style={{ fontFamily: "var(--jb-mono)", fontSize: 9, color: C.muted, marginTop: 6, letterSpacing: "0.14em", textTransform: "uppercase" }}>{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </HeroReveal>

          <HeroReveal delay={900}>
            <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.16em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 12 }}>
              <span>Scroll to begin</span>
              <span style={{ display: "inline-block", animation: "jb-bounceDown 1.8s ease-in-out infinite" }}>&darr;</span>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ========== CH 00 ========== */}
      <section id="ch0" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="00">The Longest Lease in Hollywood</H2>
        <P>Every big franchise character in film has an owner, and almost every owner is a corporation. Disney owns Marvel. Sony owns Spider-Man's film rights. Universal owns the Dark Universe it keeps trying to relaunch. James Bond is the exception. From 1961 until February 2025, the person who decided who played 007, what the story was, and how much the studio was allowed to spend was, functionally, a single family: first Albert &ldquo;Cubby&rdquo; Broccoli, then his daughter Barbara Broccoli and stepson Michael G. Wilson.</P>
        <P>That's not a metaphor about creative influence. It's a literal, contractual fact, baked into the financing agreement that got the first film made in 1962 and never renegotiated away for 64 years. Six changes of leading man. Three changes of American distributor. One bankruptcy. One hostile rights dispute. One leaked cache of studio emails, showing a Hollywood executive trying, and mostly failing, to tell the Broccolis what to do.</P>
        <Ed>Here's how that arrangement got built, how it survived everything Hollywood threw at it, and why Amazon had to write a check reported at roughly a billion dollars just to get the same creative authority most studios simply assume they already have.</Ed>
        <StatRow />
      </section>

      {/* ========== CH 01 ========== */}
      <section id="ch1" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="01">An Option, A Partnership, A Company</H2>
        <P>In June 1961, producer Harry Saltzman paid Ian Fleming roughly &pound;50,000 for a six-month option on the film rights to most of the Bond novels.<Rf n={3}/> Saltzman couldn't get a studio to finance a picture on his own, so screenwriter Wolf Mankowitz introduced him to Albert &ldquo;Cubby&rdquo; Broccoli, an established producer who had wanted the Bond rights for years. The two formed a partnership, and Eon Productions, that same month.<Rf n={1}/></P>
        <P>What happened next is the hinge the entire franchise swings on. United Artists' Arthur Krim agreed to finance and distribute the first film, and let Broccoli and Saltzman run the productions themselves: UA financed the budget and took distribution economics, not a creative vote. For an unproven spy picture with no stars attached, that was an unusual concession from a studio.<Rf n={1}/></P>
        <P>The following year, Broccoli and Saltzman formalized the arrangement, setting up Danjaq S.A. (the name combines their wives' names, Dana Broccoli and Jacqueline Saltzman) as the holding company that would own the Bond film copyrights outright and license them to Eon for production.<Rf n={4}/> Dr. No released in 1962 with Sean Connery in the lead, reportedly cast in part because Dana Broccoli pushed for him over the studio's preferred, more conventionally polished leading men.<Rf n={2}/></P>
        <Ed>Two decisions, made within about eighteen months of each other, explain why this story runs so differently from every other franchise's: UA agreed to fund without controlling, and Broccoli and Saltzman wrapped ownership in a private holding company instead of selling the rights outright. Everything that follows for the next six decades is a variation on that structure.</Ed>
      </section>

      {/* ========== CH 02 ========== */}
      <section id="ch2" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="02">The Machine Behind the Gun Barrel</H2>
        <P>Danjaq is easy to mistake for a formality. It isn't. It's the mechanism. Danjaq LLC owns the trademarks tied to Bond outright, and co-owns the copyrights to the individual films alongside the studio partner (United Artists, and later its corporate successor MGM).<Rf n={4}/> Whoever controls Danjaq controls whether a Bond film gets made at all, who directs it, who stars in it, and what the story is. The studio's role, historically, has been to write checks and distribute.</P>
        <AssetGrid />
        <P>The ownership of that holding company has changed hands exactly twice in 64 years, and both changes tell you something. Harry Saltzman's outside business ventures collapsed in the mid-1970s, and creditors forced him to sell his 50% of Danjaq to United Artists in 1975, the first and only time a studio held a direct equity stake in the company that controlled Bond.<Rf n={3}/> When MGM acquired United Artists in 1981, that 50% stake came along with it. But in 1986, Albert and Dana Broccoli bought MGM/UA's half back outright, and Danjaq became, for the first time, wholly owned by the family.<Rf n={4}/></P>
        <P>Laid next to the studio's side of the ledger, the asymmetry gets easier to see. Below is our best reconstruction of who held which lever, before and after the 2025 handover.</P>
        <OwnershipLedger />
        <P>The economics reinforced the authority. Danjaq's standard arrangement with its studio partners has reportedly included a share of profits in the 20&ndash;35% range plus, crucially, &ldquo;first-dollar gross&rdquo; participation, meaning the family's production company started collecting before the studio had even recouped its costs.<Rf n={5}/></P>
        <SkyfallSplit />
        <Ed>A studio that has to negotiate around that kind of position on every single film is not in a strong spot to also dictate who wears the tuxedo.</Ed>
      </section>

      {/* ========== CH 03 ========== */}
      <section id="ch3" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="03">007 Beyond the Screen</H2>
        <P>Everything so far has been about film, because film is the one medium the Broccoli family actually controlled. It was never the only medium Bond appeared in, and the edges of the family's authority are easiest to see in the games, novels, and comics that Eon and Danjaq had partial control over, or none at all.</P>
        <P>The first Bond video game, Shaken but Not Stirred, shipped in 1982 and went nowhere.<Rf n={34}/> The one that mattered arrived fifteen years later: Rare's GoldenEye 007 for the Nintendo 64 in 1997, a commercial and cultural landmark that helped define the console shooter as a genre. Electronic Arts held the Bond games license through the early 2000s, then Activision took over in 2006 and lost it in early 2013.<Rf n={34}/></P>
        <P>Unlike novels or comics, games are licensed directly through Danjaq, which gives the family, and now Amazon MGM, real veto power over what gets made. The clearest proof: a fully finished remaster of GoldenEye 007, built for Xbox Live Arcade around 2007 and 2008, never shipped because Rare, Microsoft, Nintendo, and Eon couldn't agree on terms. It leaked online in 2021, fourteen years later, unofficial and unfinished business.<Rf n={35}/></P>
        <P>The newest entry tells a small story about the ownership change itself. IO Interactive first announced the game, then called Project 007, in November 2020, developed in collaboration with MGM and Eon Productions, while the Broccolis still ran the creative side of the company that bears their name. It didn't ship until 2026, as 007 First Light, on PlayStation, Xbox, Switch 2, and PC. By then Eon answered to Amazon MGM, not to Barbara Broccoli. Same credited collaborator on the box, different owner behind it.<Rf n={36}/></P>
        <P>Novels and comics sit outside this picture entirely. Every continuation novel published since Fleming's death in 1964, roughly fifty of them, from Kingsley Amis's Colonel Sun in 1968 through Anthony Horowitz's recent trilogy, has been commissioned and licensed by Ian Fleming Publications, the company controlled by the Fleming estate.<Rf n={37}/> Dynamite Entertainment's Bond comic line, running since 2015, is licensed the same way, straight from Ian Fleming Publications.<Rf n={38}/> Danjaq and Eon are not part of either arrangement.</P>
        <MediaLedger />
        <Ed>Treat this as the fine print on everything else in this piece. The family's leverage over Bond was real and close to absolute, but it was leverage over one specific medium. The character himself was always bigger than the deal they controlled.</Ed>
      </section>

      {/* ========== CH 04 ========== */}
      <section id="ch4" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="04">The Battle of the Bonds</H2>
        <P>There is exactly one hole in this chain of custody, and it's instructive precisely because of how it happened. In 1961, producer Kevin McClory sold Eon the screen rights to Thunderball, based on an original story he had developed with Fleming and writer Jack Whittingham. McClory's deal gave him a producer credit and a share of profits, plus a clause stopping him from making a rival Thunderball film for only ten years.<Rf n={6}/></P>
        <P>A decade later, that clock ran out. In the mid-1970s McClory began developing his own version, working with writer Len Deighton and, eventually, Sean Connery himself. The result, Never Say Never Again, released in 1983 through Jack Schwartzman's independent Taliafilm — not Eon, not Danjaq, not the Broccolis in any capacity — opposite Eon's own Octopussy, starring Roger Moore, that same year. The press dubbed it the &ldquo;Battle of the Bonds.&rdquo;<Rf n={6}/></P>
        <Ed>Two James Bonds, two production companies, one summer. It took twenty years for a decade-old contract clause to produce the only Bond film the Broccolis couldn't stop.</Ed>
        <P>McClory spent the following decades attempting further Bond projects, and the legal fog around his rights wasn't fully resolved until 2013, when MGM and Danjaq settled with the McClory estate and folded the remaining disputed material back under Eon's umbrella for good.<Rf n={7}/> The one time in 64 years that the Broccolis lost creative control of Bond, it happened through a contract clause nobody had bothered to close, not through a studio outbidding them or a corporate parent overruling them.</P>
      </section>

      {/* ========== CH 05 ========== */}
      <section id="ch5" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="05">Passing the Reins</H2>
        <P>Cubby Broccoli produced or co-produced every Eon Bond film from Dr. No through Licence to Kill — Connery, Lazenby, Moore, and the first Dalton pictures — for nearly three decades. As his health declined in the early 1990s, control passed inside the family rather than to an outside successor. His daughter Barbara Broccoli and his stepson (Dana's son) Michael G. Wilson took over as producers, debuting with 1995's GoldenEye and Pierce Brosnan's first turn as 007.<Rf n={8}/></P>
        <P>Cubby died in 1996 at 87. By then the succession had already happened quietly and completely. There was no boardroom fight, no outside bidder, no studio intervention, because Danjaq was privately held and the family simply decided who ran it next. Barbara Broccoli and Michael Wilson would go on to produce every Bond film for the next thirty years, through Brosnan's four films and all five of Daniel Craig's.<Rf n={8}/></P>
        <ControlTimeline />
        <Ed>Compare that to almost any studio-owned franchise, where creative leadership turns over with the executive suite: a new studio chief, a new president of production, a new mandate. Bond changed producers exactly once between 1962 and 2025, and it happened by inheritance, not acquisition.</Ed>
      </section>

      {/* ========== CH 06 ========== */}
      <section id="ch6" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="06">The Most Hated Casting in Franchise History</H2>
        <P>On October 14, 2005, Daniel Craig was unveiled as the sixth Bond, arriving by Royal Navy speedboat on the Thames while wearing a life jacket, flanked by Barbara Broccoli and Michael Wilson. It went badly. Fan sites like craignotbond.com and danielcraigisnotbond.com launched within days. The Daily Mirror ran his photo under the headline &ldquo;The Name's Bland&hellip; James Bland.&rdquo; Tabloids fixated on his blond hair and blue eyes, a supposed betrayal of the Bond &ldquo;type.&rdquo;<Rf n={9}/></P>
        <Quote author="Coverage from the October 2005 announcement" role="as reported by Den of Geek">Reporters were appalled that he chewed gum during the press conference. It somehow became bigger news than the casting itself.</Quote>
        <P>None of it moved Broccoli and Wilson. The decision belonged to the family, full stop, and the family had already made it. Casino Royale released in 2006 to some of the best reviews in the franchise's history, and within a few years Craig's take on the character was widely regarded as the definitive one.<Rf n={9}/><Rf n={10}/></P>
        <Ed>A public relations disaster large enough to spawn multiple protest websites and a national tabloid pile-on produced no public wobble from the two people who controlled the decision. That's what unilateral creative authority actually looks like in practice.</Ed>
      </section>

      {/* ========== CH 07 ========== */}
      <section id="ch7" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="07">Reinventing 007 By Force of Will</H2>
        <P>Casting Craig was only the visible part of a much larger bet. Casino Royale didn't just recast the lead; it discarded two decades of gadget-driven, quip-heavy Bond formula for something closer to a grounded thriller — a reinvention of tone, structure, and the character's emotional register that a studio-run franchise would typically require years of committee process and multiple test screenings to greenlight.</P>
        <P>Broccoli and Wilson made that call themselves, the same way they had made every casting call since 1995. The reinvention worked commercially and critically, and it reset audience expectations for what a Bond film could be, for the next fifteen years, through Quantum of Solace, Skyfall, Spectre, and No Time to Die, all produced under the same two people's unbroken creative authority.<Rf n={10}/></P>
        <P>The real power on display in the last two chapters was never about picking actors. It was the standing authority to bet the direction of a $7.8 billion franchise on instinct, in public, against pushback, and answer to no one for how it turned out.<Rf n={33}/></P>
      </section>

      {/* ========== CH 08 ========== */}
      <section id="ch8" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="08">What the Sony Hack Showed the World</H2>
        <P>The family's authority was tested twice during the Craig years, both times by financial and corporate pressure rather than by any rival claim to creative control. First, in 2010, MGM itself filed for Chapter 11 bankruptcy. Development of Bond 23 was suspended for most of the year, screenwriter Peter Morgan left the project, and the film — eventually Skyfall — didn't get a release date until MGM emerged from bankruptcy that December.<Rf n={11}/></P>
        <P>Second, and more revealing: the November 2014 Sony Pictures hack, which exposed internal emails about Spectre's production. MGM president Jonathan Glickman pushed Barbara Broccoli to cut the budget, which had crept past $300 million, back toward $250 million; Broccoli reportedly held her ground on cost-heavy sequences rather than give in. The leaked emails also showed executives worried the third act didn't work, cycling through rewrites to fix it — an unusually public window into a studio partner trying to influence a Bond film's budget and story, with limited apparent success.<Rf n={12}/><Rf n={13}/></P>
        <Quote author="Jonathan Glickman" role="MGM president, in a leaked 2014 email">I think first 100 pages are fantastic&hellip; [but we're] set up for a let down on climax.</Quote>
        <P>Spectre still released with its budget largely intact and its third act rewritten to the producers' satisfaction, not the studio's original preference.<Rf n={12}/><Rf n={13}/> Both episodes show the limits of what a financing partner could actually do: apply pressure, negotiate, complain in emails that later leaked to the world &mdash; but not overrule.</P>
      </section>

      {/* ========== CH 09 ========== */}
      <section id="ch9" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="09">Craig's Exit, Amazon's Entrance</H2>
        <P>Two days after wrapping Spectre in 2015, an exhausted Daniel Craig was asked whether he'd play Bond again. &ldquo;I'd rather break this glass and slash my wrists,&rdquo; he said. The quote followed him for years; MGM reportedly offered him $100 million for two more films in 2016, which he turned down before eventually agreeing to one more.<Rf n={14}/> Craig was paid a reported $25 million for No Time to Die, released in 2021 as his fifth and final outing.<Rf n={14}/><Rf n={15}/></P>
        <P>The following year brought the deal that would eventually matter far more than any casting decision. In 2022, Amazon acquired MGM outright for $8.45 billion, primarily for its content library, with Bond as the marquee asset.<Rf n={16}/> But the acquisition only bought Amazon distribution rights. Barbara Broccoli and Michael Wilson, through Danjaq and Eon, retained full creative control, just as they had with every studio partner since 1961. Amazon, by most accounts, found itself a passive financier on the one franchise in its new library that it couldn't actually direct.<Rf n={17}/></P>
        <Ed>From here the story stops being about casting and becomes a story about ownership economics colliding with a much bigger, much less patient corporate parent. Amazon didn't spend $8.45 billion to sit quietly on its biggest brand.</Ed>
      </section>

      {/* ========== CH 10 ========== */}
      <section id="ch10" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="10">Skyfall, For Real This Time</H2>
        <P>Reporting since the Amazon acquisition has described a relationship under strain: Amazon MGM executives reportedly wanted more Bond content, streaming spin-offs, and a faster release cadence, while Broccoli and Wilson were protective of theatrical exclusivity and the slower pace the franchise had always kept. A Wall Street Journal report described Barbara Broccoli telling friends, in blunter terms, that Amazon's executives were &ldquo;f**king idiots.&rdquo; According to insiders cited afterward, Jeff Bezos's response on hearing that was direct: &ldquo;I don't care what it costs, get rid of her.&rdquo;<Rf n={23}/><Rf n={24}/></P>
        <P>On February 20, 2025, Amazon MGM Studios, Michael Wilson, and Barbara Broccoli announced a new joint venture to house the Bond intellectual property. All three parties remain co-owners, but creative control passes to Amazon MGM.<Rf n={17}/><Rf n={19}/></P>
        <Quote author="Michael G. Wilson" role="February 2025 statement">With my 007 career spanning nearly 60 incredible years, I am stepping back from producing the James Bond films to focus on art and charitable projects. Therefore, Barbara and I agree, it is time for our trusted partner, Amazon MGM Studios, to lead James Bond into the future.</Quote>
        <Quote author="Barbara Broccoli" role="February 2025 statement">My life has been dedicated to maintaining and building upon the extraordinary legacy that was handed to Michael and me by our father, producer Cubby Broccoli.&hellip; With the conclusion of No Time to Die and Michael retiring from the films, I feel it is time to focus on my other projects.</Quote>
        <P>What Amazon actually paid became its own small controversy. When Eon Productions' UK financial filings surfaced in October 2025 showing a $20 million payment from Amazon MGM, some outlets initially reported that as the full price of creative control — a strikingly small number for ending 64 years of family authority. Reporting since has clarified that the $20 million was only what flowed to Eon specifically; the bulk of the consideration, reported at roughly $1 billion, moved through Danjaq and a new IP holding entity called London Operations, LLC, along with an equity stake in that new venture.<Rf n={21}/><Rf n={22}/></P>
        <Ed>Whatever the precise number, the shape of the deal matters more than the total: for the first time since Arthur Krim shook hands with Broccoli and Saltzman in 1961, the studio holding the checkbook also holds the pen.</Ed>
      </section>

      {/* ========== CH 11 ========== */}
      <section id="ch11" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="11">Bond vs. the Multiverse</H2>
        <P>None of this is how the arrangement usually works for beloved film characters. Take Spider-Man. In 1996, a nearly bankrupt Marvel proposed selling film rights to almost its entire character roster — Iron Man, Thor, Black Panther, dozens more — for a combined $25 million. Sony wasn't interested in the bundle. It wanted only Spider-Man, and got the film and TV rights in 1998 for roughly $7 million.<Rf n={25}/></P>
        <P>That deal effectively split the character in two, permanently. Sony owns the film rights outright, in perpetuity, so long as it keeps releasing a movie every five years and nine months or so, a clause built to force output regardless of creative readiness.<Rf n={26}/> Marvel Studios, meanwhile, only gets to use the character in the MCU through a separate, renegotiated, revenue-sharing arrangement that Sony could in principle end. The character has been rebooted twice on screen since 2002: the Raimi trilogy, then the Amazing Spider-Man relaunch, then folded into the MCU, each time as two studios renegotiated who got what.<Rf n={25}/></P>
        <Faceoff />
        <P>That asymmetry explains why the two franchises behave so differently on screen. Spider-Man's ownership split at the moment of sale and has stayed split for almost thirty years, which is why the character keeps rebooting: every few years, the incentives of two separate corporate owners have to be re-aligned. Bond's ownership was never split at all until 2025. One party held every lever, casting, script, budget, release cadence, for 64 uninterrupted years, which is exactly why the franchise recast its lead seven times without ever needing to &ldquo;reboot&rdquo; anything.</P>
      </section>

      {/* ========== CH 12 ========== */}
      <section id="ch12" style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 64px" }}>
        <H2 num="12">The Villeneuve Mission</H2>
        <P>The new arrangement's first major decision came fast. In June 2025, Amazon MGM Studios announced Denis Villeneuve — the director of Dune, Dune: Part Two, Arrival, and Blade Runner 2049 — would direct the next Bond film. Even Villeneuve signed on a single-picture deal without final cut, the same limit Eon directors have traditionally worked under. This time, though, the studio holds that final say, not the Broccolis.<Rf n={27}/><Rf n={28}/></P>
        <Quote author="Denis Villeneuve" role="June 2025 statement">Some of my earliest movie-going memories are connected to 007. I grew up watching James Bond films with my father, ever since Dr. No with Sean Connery. I'm a die-hard Bond fan.&hellip; I intend to honor the tradition and open the path for many new missions to come. This is a massive responsibility, but also, incredibly exciting for me and a huge honor.</Quote>
        <P>Amy Pascal and David Heyman are producing, Tanya Lapointe is executive producing, and Steven Knight — the writer behind Peaky Blinders — was attached to the screenplay.<Rf n={27}/> Casting director Nina Gold came aboard soon after, and by late 2025 the reported target profile had crystallized: a relatively unknown British actor, likely in his late 20s or early 30s, deliberately ruling out established names like Idris Elba, Henry Cavill, or non-British stars entirely.<Rf n={29}/><Rf n={30}/></P>
        <ActorGantt />
        <P>As of mid-2026, no lead has been confirmed. Villeneuve has reportedly been personally reaching out to shortlisted actors, with a further round of auditions expected over the summer and a final decision targeted before year's end, ahead of a planned 2027 shoot.<Rf n={30}/> Names that have circulated in the press — Aaron Taylor-Johnson, Callum Turner, Jacob Elordi, Harris Dickinson, Damson Idris, Tom Francis — remain unconfirmed rumors rather than announced choices, and Taylor-Johnson's long-standing frontrunner status has reportedly cooled as the stated preference has shifted toward younger, less familiar faces.<Rf n={31}/></P>
        <Quote author="A former 007 franchise casting director" role="quoted in Variety, 2026">We know so much about them&hellip; the actor should be out of the blue.</Quote>
        <P>Whoever is cast will be the first Bond chosen without a single Broccoli in the room, the first casting decision in the character's history made entirely inside a corporate studio's process rather than a family's private judgment. In a narrow sense, it's exactly the kind of decision Amazon paid roughly a billion dollars to be allowed to make.<Rf n={32}/></P>
        <div style={{ marginTop: 56 }}>
          <P>Sixty-four years is a long time for two people to hold a veto over a global franchise. Amazon MGM's scale, technology, and reach may do things for Bond that a small family production company never could. Or the character's whole appeal, stubbornly consistent, resistant to reboot, unbothered by fashion, was a product of exactly the kind of insulated, unaccountable authority that no longer exists.</P>
          <FadeIn>
            <p style={{ fontFamily: "var(--jb-display)", fontSize: 22, fontStyle: "italic", color: C.accent, margin: "32px 0 0", maxWidth: 640, lineHeight: 1.42 }}>
              For the first time since 1961, nobody named Broccoli gets the final word on who James Bond is. The next film will be the test of whether that ever mattered.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ========== SOURCES ========== */}
      <section id="jb-sources" style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px 80px" }}>
        <FadeIn>
          <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent, letterSpacing: "0.26em", marginBottom: 12, textTransform: "uppercase", fontWeight: 500 }}>Methodology</div>
          <h2 style={{ fontFamily: "var(--jb-display)", fontSize: 36, fontWeight: 700, color: C.text, margin: "0 0 22px", letterSpacing: "-0.02em" }}>Sources &amp; Notes</h2>
          <p style={{ fontFamily: "var(--jb-serif)", fontSize: 16, color: C.dim, lineHeight: 1.76, margin: "0 0 32px", maxWidth: 680 }}>Financial figures around the 2025 Amazon MGM deal are contested in the reporting itself — a $20 million filing versus a reported ~$1 billion total consideration — and both numbers are presented here with that discrepancy noted rather than resolved. Insider quotes (the Bezos and Broccoli exchanges) are sourced to entertainment trade reporting citing unnamed sources, not official statements. Net-worth figures for the Broccoli/Wilson family vary considerably by outlet and year; we've used the Sunday Times Rich List estimate as the pre-2025 baseline. The ownership breakdown in Chapter 02 is our best reconstruction from public filings and reporting, not an official disclosure from Danjaq or Amazon MGM.</p>
        </FadeIn>
        <div style={{ display: "grid", gap: 7 }}>
          {sources.map(function(s, i) {
            return (
              <FadeIn key={s.n} delay={i * 0.01}>
                <a href={s.url} target="_blank" rel="noreferrer" style={{
                  display: "grid", gridTemplateColumns: "36px 1fr", gap: 10,
                  padding: "11px 14px", background: C.surface, border: "1px solid " + C.border,
                  borderRadius: 8, textDecoration: "none", fontFamily: "var(--jb-sans)",
                  transition: "background 0.18s, border-color 0.18s",
                }}>
                  <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.accent, fontWeight: 600 }}>{"[" + s.n + "]"}</div>
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
          background: "radial-gradient(ellipse, rgba(201,162,39,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontFamily: "var(--jb-display)", fontSize: 20, color: C.accent, fontStyle: "italic", marginBottom: 8 }}>The Family Behind the Gun Barrel</div>
        <div style={{ fontFamily: "var(--jb-mono)", fontSize: 10, color: C.muted, letterSpacing: "0.22em", textTransform: "uppercase" }}>A narrative by Claude &middot; July 2026</div>
      </footer>

    </div>
  );
}
