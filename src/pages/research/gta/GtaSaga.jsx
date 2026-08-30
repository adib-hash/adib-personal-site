import { C, CAP, FadeIn, H2, H3, P, Ed, Quote, Strong, StatRow, Timeline, Lesson, makeRef, NavBar, useChapterScroll, Counter } from "./framework.jsx";
import { sources } from "./sources.js";
import { Link } from "react-router-dom";
import Seo from "../../../components/Seo";
import ResearchFooter from "../../../components/ResearchFooter";
import { TitleChart, GtaVChart, TakeTwoChart, InvestCalc, LaunchCalc, AttentionChart, daysToLaunch } from "./interactives.jsx";

var R = makeRef(sources);
var W = 880;

var chapters = [
  { id: "ch0", num: "00", short: "Dundee" },
  { id: "ch1", num: "01", short: "The Bug" },
  { id: "ch2", num: "02", short: "Liberty City" },
  { id: "ch3", num: "03", short: "Hot Coffee" },
  { id: "ch4", num: "04", short: "The Boardroom" },
  { id: "ch5", num: "05", short: "Los Santos" },
  { id: "ch6", num: "06", short: "The Tail" },
  { id: "ch7", num: "07", short: "The Silence" },
  { id: "ch8", num: "08", short: "November 19" },
  { id: "ch9", num: "09", short: "Playbook" },
  { id: "sources", num: "", short: "Sources" },
];

var SEC = { maxWidth: W, margin: "0 auto", padding: "72px 24px 40px" };

function Section({ id, children }) {
  return <section id={id} style={SEC}>{children}</section>;
}

function Divider() {
  return <div style={{ maxWidth: W, margin: "0 auto", padding: "0 24px" }}>
    <div style={{ height: 1, background: "linear-gradient(to right, transparent, " + C.border + ", transparent)" }} />
  </div>;
}

var hotCoffee = [
  { date: "June 9, 2005", title: "The 'Hot Coffee' mod is released", body: "A Dutch modder unlocks a dormant sex minigame hidden in San Andreas's PC code. More than a million downloads follow within four weeks.", color: C.teal },
  { date: "July 14, 2005", title: "Senator Hillary Clinton asks the FTC to investigate", body: "The story jumps from gaming forums to cable news.", color: C.gold },
  { date: "July 20, 2005", title: "ESRB re-rates the game Adults Only", body: "The first retroactive re-rating of a major retail release. Walmart, Target and Best Buy pull it from shelves.", color: C.red },
  { date: "December 2005", title: "Family Entertainment Protection Act introduced", body: "Clinton, Lieberman and Bayh propose $5,000 fines for selling M-rated games to minors. It dies in committee.", color: C.gold },
  { date: "June 8, 2006", title: "FTC settlement", body: "Take-Two and Rockstar agree to disclose rating-relevant content, with fines of up to $11,000 per future violation.", color: C.orange },
  { date: "September 2009", title: "$20.1M securities settlement", body: "Investors who sued over Hot Coffee losses (and option backdating) settle; insurers cover $15M of it.", color: C.accent },
];

var roadToVI = [
  { date: "2014", title: "Work begins on the next GTA", body: "Bloomberg later reports the project started 'in some form' in 2014, with an original plan for multiple cities across the Americas that was scoped down to one.", color: C.teal },
  { date: "Feb 4, 2022", title: "'Active development is well underway'", body: "The first official acknowledgement, buried in a Newswire post about GTA V's PS5 release.", color: C.teal },
  { date: "Sept 18, 2022", title: "The hack", body: "Ninety clips of early footage and some source code hit GTAForums. The 17-year-old responsible was on bail in a Travelodge, working from a hotel TV and an Amazon Fire Stick.", color: C.red },
  { date: "Dec 4, 2023", title: "Trailer 1, released a day early after another leak", body: "Vice City. Lucia and Jason. Ninety million YouTube views in 24 hours. Window: '2025.'", color: C.accent },
  { date: "May 2, 2025", title: "Delay #1: May 26, 2026", body: "'We are very sorry that this is later than you expected.' Take-Two shares fall more than 5%.", color: C.gold },
  { date: "May 6, 2025", title: "Trailer 2", body: "Captured on a base PS5. Rockstar claims 475 million views across platforms in a day.", color: C.accent },
  { date: "Oct–Nov 2025", title: "Rockstar fires 31–34 unionizing staff in the UK and Canada", body: "The company says 'gross misconduct' over leaked confidential information; the union says the 'public forum' was a private Discord.", color: C.red },
  { date: "Nov 6, 2025", title: "Delay #2: November 19, 2026", body: "'These extra months will allow us to finish the game with the level of polish you have come to expect.' Shares close down 8%.", color: C.gold },
  { date: "June 25, 2026", title: "Pre-orders open: $79.99 / $99.99", body: "No disc at launch. Single-player at launch. Pre-load November 12.", color: C.green },
  { date: "Aug 27, 2026", title: "'An Extended Look' premieres on Netflix", body: "Twenty-six minutes of gameplay, nine days after a fresh wave of leaks. Rockstar's note: 'nearly there!'", color: C.accent },
];

export default function GtaSaga() {
  var nav = useChapterScroll(chapters);
  var days = daysToLaunch();

  return <div className="gta-root" style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden", fontFamily: "var(--gta-serif)" }}>
    <Seo title="The Rockstar Saga — Adib Choudhury" description="How a bug in a Scottish racing game became the most profitable entertainment product ever made, why Rockstar spent thirteen years not making a sequel, and how big GTA VI is expected to be." />
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');"}</style>
    <style>{".gta-root{--gta-display:'Playfair Display',Georgia,serif;--gta-serif:'Source Serif 4',Georgia,serif;--gta-sans:'Outfit',system-ui,sans-serif;--gta-mono:'IBM Plex Mono',Menlo,monospace}.gta-root input[type=range]{-webkit-appearance:none;appearance:none;background:transparent}.navscroll::-webkit-scrollbar{display:none}@keyframes tip-in{from{opacity:0}to{opacity:1}}@keyframes pulse{0%,100%{opacity:.55}50%{opacity:1}}input[type=range]::-webkit-slider-runnable-track{height:4px;background:#231f31;border-radius:2px}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#f472b6;margin-top:-9px;border:2px solid #08070d;box-shadow:0 0 0 1px #f472b6}input[type=range]::-moz-range-track{height:4px;background:#231f31;border-radius:2px}input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#f472b6;border:2px solid #08070d}.gta-root ::selection{background:#f472b640}@media (max-width:768px){.gta-root nav a[aria-label='Back to research']{padding:15px 16px 15px 12px!important}}@media (min-width:1024px){.gta-root a.gta-back-pill{top:22px!important;left:22px!important;padding:10px 16px!important;font-size:12px!important}.gta-root .gta-back-label::after{content:' to research'}}"}</style>

    <NavBar chapters={chapters} active={nav.active} show={nav.showNav} width={W} />
    <Link to="/research" aria-label="Back to research" className="gta-back-pill" style={{
      position: "fixed", top: "max(14px, env(safe-area-inset-top))", left: 14, zIndex: 200,
      opacity: nav.showNav ? 0 : 1, pointerEvents: nav.showNav ? "none" : "auto",
      transform: nav.showNav ? "translateY(-8px)" : "translateY(0)",
      display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 14px",
      background: "rgba(8,7,13,0.82)", backdropFilter: "blur(14px) saturate(1.6)", WebkitBackdropFilter: "blur(14px) saturate(1.6)",
      border: "1px solid " + C.faint, borderRadius: 999, color: C.dim,
      fontFamily: "var(--gta-mono)", fontSize: 12, fontWeight: 500, textDecoration: "none", letterSpacing: "0.03em",
      transition: "color 0.2s, border-color 0.2s, opacity 0.3s, transform 0.3s", boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
    }}
      onMouseEnter={function (e) { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent + "80"; }}
      onMouseLeave={function (e) { e.currentTarget.style.color = C.dim; e.currentTarget.style.borderColor = C.faint; }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>&larr;</span>
      <span className="gta-back-label">Back</span>
    </Link>

    {/* ---------------- HERO ---------------- */}
    <header style={{ position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(244,114,182,0.16), transparent 60%), radial-gradient(ellipse 45% 40% at 85% 70%, rgba(45,212,191,0.10), transparent 60%), radial-gradient(ellipse 40% 35% at 10% 80%, rgba(251,191,36,0.08), transparent 60%)",
      }} />
      <div style={{ maxWidth: W, margin: "0 auto", padding: "clamp(88px, 14vh, 150px) 24px 64px", position: "relative" }}>
        <div style={{ ...CAP, color: C.accent, marginBottom: 22, letterSpacing: "0.24em" }}>An interactive history &middot; Updated August 29, 2026</div>
        <h1 style={{
          fontFamily: "var(--gta-display)", fontSize: "clamp(50px, 9vw, 104px)", lineHeight: 0.98,
          margin: "0 0 28px", fontWeight: 800, letterSpacing: "-0.03em", color: C.text,
        }}>The Rockstar<br />Saga</h1>
        <p style={{
          fontFamily: "var(--gta-serif)", fontSize: "clamp(18px, 2.4vw, 22px)", lineHeight: 1.6,
          color: C.dim, margin: "0 0 44px", maxWidth: 720,
        }}>
          How a bug in a Scottish racing game became the most profitable entertainment product ever made, why the company that owns it spent thirteen years <em>not</em> making a sequel, and why the entire industry is clearing the road for November 19.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
          {[
            { k: "GTA franchise units", v: <Counter to={475} suffix="M" />, s: "as of Aug 2026" },
            { k: "GTA V alone", v: <Counter to={230} suffix="M" color={C.text} />, s: "still selling, 13 years on" },
            { k: "GTA V to $1 billion", v: <Counter to={3} suffix=" days" color={C.green} />, s: "faster than any film" },
            { k: "GTA VI launches in", v: <Counter to={days} suffix=" days" color={C.gold} />, s: "November 19, 2026" },
          ].map(function (s, i) {
            return <div key={i} style={{ background: C.surface + "cc", border: "1px solid " + C.border, borderRadius: 12, padding: "16px 16px", minHeight: 100, display: "flex", flexDirection: "column", justifyContent: "center", backdropFilter: "blur(8px)" }}>
              <div style={{ ...CAP, fontSize: 11, marginBottom: 8 }}>{s.k}</div>
              <div style={{ fontFamily: "var(--gta-mono)", fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>{s.v}</div>
              <div style={{ fontFamily: "var(--gta-sans)", fontSize: 13.5, color: C.muted, marginTop: 6 }}>{s.s}</div>
            </div>;
          })}
        </div>
      </div>
    </header>

    {/* ---------------- INTRO ---------------- */}
    <section style={{ ...SEC, paddingTop: 24 }}>
      <P>Here is a number that should not exist. One video game, released in September 2013 for consoles that are now two generations obsolete, has sold more than 230 million copies and, by the estimate of the analysts who track it, has grossed more money than any film, album or book in history.<R n={44} /><R n={41} /> Its publisher's revenue has risen more than fivefold since it came out.<R n={56} /> And its sequel, which arrives in <Strong>{days} days</Strong>, is priced at $79.99, has no disc, has no multiplayer at launch, and is nonetheless the subject of the strongest pre-order campaign anyone has ever measured.<R n={85} /><R n={89} /></P>
      <P>The company behind it employs a few thousand people, is headquartered above a Manhattan street, and has released exactly two new games in the last eight years. It fired unionizing staff last autumn, is fighting a tribunal case that runs right up to launch, and has spent the summer issuing takedown notices against leaked footage of its own product.<R n={83} /><R n={84} /><R n={97} /> It is also, by any commercial measure, the most successful studio in the medium.</P>
      <Ed>This is a story about a very specific kind of company: one that decided early that it would rather be a record label than a software firm, that treated controversy as a distribution channel until the day a US Senator got involved, and that discovered, almost by accident, a business model that turned a one-time purchase into a thirteen-year annuity. To understand why the whole games industry is holding its breath for November, you have to start in a factory town on the east coast of Scotland.</Ed>
    </section>

    <Divider />

    {/* ---------------- CH 00 ---------------- */}
    <Section id="ch0">
      <H2 num="00" label="Chapter 00 · Before the before">A redundancy cheque in Dundee</H2>
      <P>In 1987, Timex laid off an apprentice named David Jones from its factory in Dundee. The plant had once built Sinclair ZX81s, which is part of why Jones was there in the first place ("I got my dream job, actually," he said years later). He spent the severance on an Amiga 1000.<R n={1} /><R n={4} /> Within a year he and three friends, Russell Kay, Steve Hammond and Mike Dailly, had a company. They named it after a line in the Amiga hardware manual: DMA, for direct memory access. "Yeah, it was a boring name," Jones admitted.<R n={4} /></P>
      <P>DMA's first game, a shooter called <em>Menace</em>, sold 15,000 copies and made Jones £20,000, which he spent on a car.<R n={1} /> Its third changed the company's life. <em>Lemmings</em>, released on Valentine's Day 1991 and published by Psygnosis in Liverpool, sold 55,000 copies on its first day on the Amiga and went on to sell somewhere north of 15 million across every platform that existed.<R n={3} /> Jones remembers the publisher calling through the day: "It's up to 50,000. It's up to 60,000."<R n={4} /></P>
      <P><em>Lemmings</em> matters to this story for two reasons. It gave a studio in a city with no games industry the money and the reputation to try something ambitious. And it was, at heart, a game about watching a crowd of small, stupid, autonomous creatures walk into danger, and finding that delightful. Hold that thought.</P>
      <Ed>The through-line of Rockstar's entire history is emergent behaviour: systems that produce stories nobody scripted. It is there in <em>Lemmings</em>, it is there in the bug that made <em>Grand Theft Auto</em> work, and it is the whole business model of GTA Online. DMA got it right the first time and then spent a decade learning how to sell it.</Ed>
    </Section>

    <Divider />

    {/* ---------------- CH 01 ---------------- */}
    <Section id="ch1">
      <H2 num="01">The bug they kept</H2>
      <P>The design document is dated March 22, 1995. It is titled <em>Race'n'Chase</em>, and it describes a top-down driving game in which the player could be either a cop or a criminal in a living city. Development started two weeks later.<R n={8} /> By most accounts it went badly. Gary Penn, DMA's creative director, has been blunt about it: "It was a real mess for years... It was almost canned. The publisher, BMG Interactive, wanted to can it."<R n={7} /></P>
      <P>What saved it was a bug. The police cars' pathfinding was broken; instead of pursuing the player, they tried to drive straight through him, ramming him over and over. Testers loved it. "Then one day, I think it was a bug, the police suddenly became mental and aggressive," Penn said. "That was awesome, so it stayed in. It was tweaked a little bit, but that stayed in because that was great fun."<R n={7} /> The cop side of the game was quietly dropped. "It wasn't that much fun playing cops," Jones said. "It felt like the game was working against you. When you switched places, it just felt so much better."<R n={6} /></P>
      <Quote by="Gary Penn, DMA Design, on the pitch for the game">The game as it stands now is basically Elite in a city.</Quote>
      <P>The game shipped as <em>Grand Theft Auto</em> on November 28, 1997, on PC in Europe, with a PlayStation version two weeks later.<R n={5} /> It looked primitive even then: a top-down view, tiny cars, blocky pedestrians. What it had was a city that behaved like a place. Mike Dailly, who built the original engine, put the philosophy in one line: "Sandboxes are very simple. Put some toys in a world then leave it alone!"<R n={6} /></P>
      <H3>The publicist</H3>
      <P>What it also had was Max Clifford. BMG Interactive hired Britain's most notorious tabloid publicist, and Jones was candid in later interviews that the outrage which greeted the game was manufactured: "He designed all the outcry, which pretty much guaranteed MPs would get involved... He told us how he would play it out, who he would target, what those people targeted would say."<R n={1} /><R n={9} /> Questions were raised in the House of Lords. Dailly's summary: "Max Clifford was the real genius here. He made it all happen." And, of the politicians: "Calling it a murder simulator just showed how ignorant they were, and we knew it."<R n={9} /><R n={6} /></P>
      <P>It worked. <em>Grand Theft Auto</em> shipped a million copies within a year and six million by early 2001.<R n={5} /> The playbook that Rockstar would run for the next decade, in which moral panic is a marketing line item, was written by a PR man in 1997.</P>
      <H3>Two brothers in a post room</H3>
      <P>The people who signed the game at BMG Interactive were Sam and Dan Houser. Sam, born in 1971, had joined Bertelsmann's music group in 1990 in the post room and worked his way to head of development at its new games division by 1996; Dan, two years younger, read geography at Oxford and started at BMG part-time in 1995 testing CD-ROMs.<R n={10} /><R n={11} /> Their mother, Geraldine Moffat, was an actress best known for <em>Get Carter</em>; their father, Walter, was a solicitor and jazz saxophonist who served as lawyer to Ronnie Scott's club in Soho.<R n={10} /><R n={11} /></P>
      <P>That upbringing shows. The Housers never thought of themselves as software people. "We admired record labels, obviously, and clothing companies," Dan said in 2003, "which were obsessed with details and with an integrity between design, product, and marketing."<R n={19} /> They wanted to build a label. What they needed was someone to buy them one.</P>
    </Section>

    <Divider />

    {/* ---------------- CH 02 ---------------- */}
    <Section id="ch2">
      <H2 num="02">A label in New York</H2>
      <P>Take-Two Interactive was founded in September 1993 by Ryan Brant, the 21-year-old son of a publishing magnate, with $1.5 million from family and private investors. It went public on NASDAQ in April 1997 at $5.50 a share.<R n={12} /> Eleven months later, in March 1998, it bought substantially all of BMG Interactive's assets, including the worldwide rights to <em>Grand Theft Auto</em>, for 1.85 million shares, a deal valued at roughly $14 million.<R n={13} /><R n={12} /></P>
      <P>Fourteen million dollars. For the franchise. Hold on to that number too.</P>
      <P>The Housers moved to New York with three colleagues, Terry Donovan, Jamie King and Gary Foreman, and in December 1998 founded Rockstar Games as Take-Two's premium label.<R n={14} /> The following September, Take-Two bought DMA Design itself, by then owned by the French publisher Infogrames, for about $11 million in cash plus assumed debt.<R n={15} /> David Jones, unhappy with the new owners, left in early 2000 to found Realtime Worlds.<R n={1} /> The studio he built was renamed Rockstar North in 2002, run from Edinburgh by a producer named Leslie Benzies.<R n={2} /></P>
      <Ed>Notice what Take-Two had assembled by the end of 1999, for less than $30 million all-in: the IP, the team that made it, and two brothers who understood that the product was a brand, not a program. Almost every dollar Take-Two has earned since traces back to those two transactions.</Ed>
      <H3>Three weeks after September 11</H3>
      <P>The bet was <em>Grand Theft Auto III</em>. DMA's core team of around 23 people rebuilt the series in full 3D on Criterion's RenderWare engine, and put a camera behind the player's shoulder for the first time.<R n={16} /> Art director Aaron Garbut's ambition was that other games "were a thing you played," while Liberty City should be "a place you lived in."<R n={16} /> Sony, worried about Microsoft's incoming Xbox, offered Take-Two a royalty discount to keep the next three games PlayStation-exclusive for two years each.<R n={17} /></P>
      <P>It was scheduled for early October 2001. After the attacks on New York, Rockstar pushed the release three weeks to October 22 and made what it called about one percent of changes: police cars repainted from NYPD blue-and-white to black-and-white, a plane's flight path altered so it no longer appeared to fly into skyscrapers, a terrorism-themed mission cut.<R n={16} /> Dan Houser has said that, until it shipped, "no one outside of our company was very excited by it," and that the company was "very much running out of money at the time."<R n={18} /></P>
      <P>It became the best-selling game of 2001 in the United States, earned over $250 million in its first year, and eventually sold 14.5 million copies.<R n={16} /> <em>Vice City</em> followed twelve months later on a budget of about $5 million, sold 1.4 million copies in two days and 17.5 million overall.<R n={20} /> <em>San Andreas</em>, two years after that, became the best-selling PlayStation 2 game ever made, at 17.33 million on that console alone and 27.5 million across all platforms.<R n={21} /></P>
      <TitleChart />
      <Quote by="Sam Houser, 2002">The problem with other games is that when you hit a point that's frustrating, you can't get past it. In Grand Theft Auto, when you hit a point that's tough, just go do something else.</Quote>
      <P>Three games in three years, each bigger than the last, each made for a fraction of what a Hollywood film cost, each with a licensed radio soundtrack and a celebrity cast (Ray Liotta as Tommy Vercetti, Samuel L. Jackson as a crooked cop) that made it feel like a record label had wandered into software.<R n={20} /><R n={21} /> Rockstar was, for a moment, the coolest company in entertainment. Which is exactly when the trouble started.</P>
    </Section>

    <Divider />

    {/* ---------------- CH 03 ---------------- */}
    <Section id="ch3">
      <H2 num="03">Hot Coffee</H2>
      <P>Somewhere in the code of <em>San Andreas</em>, disabled but not deleted, was a sex minigame. On June 9, 2005, a Dutch modder named Patrick Wildenborg released a patch that switched it back on. It was downloaded more than a million times in a month.<R n={22} /> The Max Clifford playbook had always relied on outrage coming from people who had not played the game. This time the outrage had a screenshot.</P>
      <Timeline events={hotCoffee} />
      <P>The direct cost to Take-Two was $24.5 million in returns and re-rating, disclosed in its filings.<R n={22} /> The FTC's Lydia Parnes summarised the regulator's position in a sentence: "Parents have the right to rely on the accuracy of the entertainment rating system."<R n={23} /> A House resolution to investigate whether Rockstar had deceived the ratings board passed 355 to 21.<R n={22} /> Four years later, a securities class action over the episode settled for $20.1 million.<R n={24} /></P>
      <H3>The lawyer</H3>
      <P>Then there was Jack Thompson. The Florida attorney had spent years suing over violent games; in 2006 he tried to block <em>Bully</em> under the state's public-nuisance law, and lost when a judge reviewed the game and found nothing "not already on late night television."<R n={25} /> In March 2007 Take-Two sued him pre-emptively to stop him doing the same to <em>Manhunt 2</em> and <em>GTA IV</em>. They settled in April: Thompson could criticise but agreed never to sue over a Take-Two game again.<R n={25} /> In September 2008 the Florida Supreme Court permanently disbarred him.<R n={26} /></P>
      <Quote by="Sam Houser, Develop magazine, August 2008">Most of the people who hate us are people it is truly an honor to be hated by: reactionary creeps with strange agendas, and the Daily Mail.</Quote>
      <Ed>The lesson Rockstar took from 2005 was not "tone it down." <em>GTA IV</em> and <em>V</em> are, if anything, more pointed. The lesson was operational: the company became obsessive about control of its own content, its own leaks and its own message. Every decision that baffles people about Rockstar today, from the near-total press silence to the code-in-a-box physical edition of GTA VI, has its roots in the summer a hidden minigame cost them $24.5 million and a Senate hearing.</Ed>
    </Section>

    <Divider />

    {/* ---------------- CH 04 ---------------- */}
    <Section id="ch4">
      <H2 num="04">The boardroom, and the $2 billion they turned down</H2>
      <P>While Rockstar was fighting the culture war, its parent was falling apart. Ryan Brant had already stepped down as CEO in 2001. In February 2007 the SEC found that Take-Two had backdated stock-option grants on more than a hundred occasions between 1997 and 2003; Brant pleaded guilty in Manhattan, becoming the first chief executive convicted over backdating, paid about $7.3 million, and was barred from running a public company.<R n={28} /> Take-Two had lost $163 million in 2006.<R n={12} /></P>
      <P>On March 29, 2007, a group of shareholders controlling about 46% of the stock, including Oppenheimer, D.E. Shaw, Tudor and SAC, voted out the board at the annual meeting. The man they installed as chairman was Strauss Zelnick, a former head of BMG Entertainment and 20th Century Fox whose firm, ZelnickMedia, would run the company under a management contract.<R n={29} /> Zelnick has never played the games. "I don't think being consumer-in-chief really helps a CEO be effective in this business," he told Fortune this year.<R n={100} /> He has run Take-Two for nineteen years.</P>
      <H3>The EA bid</H3>
      <P>Eleven months into Zelnick's tenure, in February 2008, Electronic Arts offered $26 a share, roughly $2 billion, for the whole company, and when the board refused, went hostile with a tender offer in March.<R n={30} /> Zelnick's response was that the bid "provides insufficient value to our shareholders and comes at absolutely the wrong time."<R n={30} /> The timing he meant was <em>GTA IV</em>, six weeks away. EA let its offer expire that September.<R n={31} /></P>
      <StatRow items={[
        { label: "EA's offer, Feb 2008", value: "$2.0B", color: C.red, sub: "$26 per share, rejected" },
        { label: "Take-Two today", value: "$44B", color: C.green, sub: "market cap, Aug 28, 2026" },
        { label: "TTWO share price", value: "$234", color: C.text, sub: "vs. $5.50 at the 1997 IPO" },
      ]} />
      <H3>Building the engine</H3>
      <P><em>GTA IV</em> arrived on April 29, 2008, six months late (the delay had knocked Take-Two's stock down 12% the previous August).<R n={32} /> Its technology story is one of the least-told and most important in this saga. In 2004 EA had bought Criterion, the maker of the RenderWare engine that powered <em>III</em>, <em>Vice City</em> and <em>San Andreas</em>, and pulled it from the market.<R n={34} /> Rockstar's answer was to build its own: RAGE, the Rockstar Advanced Game Engine, developed at Rockstar San Diego, paired with NaturalMotion's Euphoria system, which generated character animation procedurally instead of playing back canned clips.<R n={32} /><R n={102} /> Pedestrians in <em>GTA IV</em> stumbled, grabbed for railings and shielded their faces because a physics model told them to, not because an animator had drawn it.</P>
      <P>More than a thousand people worked on it. Leslie Benzies put the budget at over $100 million, a record at the time.<R n={32} /> It took $310 million on its first day and roughly $500 million in its first week, which Guinness certified as the largest 24-hour launch of any entertainment product, ahead of any film or album; Metacritic scored it 98.<R n={33} /><R n={32} /> It went on to sell 25 million copies.<R n={35} /></P>
      <Ed>Owning the engine is the decision that compounds. Every Rockstar game since, including GTA VI, runs on RAGE. The company controls its rendering, its physics, its streaming of enormous open worlds and, crucially, its own release schedule. When a competitor bought the tool your business ran on, Rockstar treated it as a reason to become a technology company. Most studios would have licensed Unreal.</Ed>
    </Section>

    <Divider />

    {/* ---------------- CH 05 ---------------- */}
    <Section id="ch5">
      <H2 num="05">Los Santos</H2>
      <P>Work on <em>GTA V</em> began, Benzies said, "almost five years ago as GTA IV was wrapping up," which puts it in 2008. Asked whether a thousand people had worked on it, he replied: "It's probably more. Much more."<R n={36} /> The Scotsman estimated development and marketing at £170 million, about $265 million, which would have made it the most expensive game ever made; Rockstar has never confirmed a figure.<R n={37} /> The map, Rockstar claimed, was larger than the worlds of <em>Red Dead Redemption</em>, <em>San Andreas</em> and <em>GTA IV</em> combined.<R n={108} /></P>
      <P>Its structural innovation was three protagonists: Michael, a retired bank robber in witness protection; Franklin, a repo man from South Los Santos; and Trevor, a meth-dealing psychopath who is, in Dan Houser's framing, the only one of the three who is not a hypocrite.<R n={107} /> The player could switch between them at almost any moment, and the game would find the absent characters somewhere in the world, mid-life: Trevor waking up on a beach in a dress, Michael arguing with his therapist.</P>
      <StatRow items={[
        { label: "First day", value: "$800M+", color: C.green, sub: "Sept 17, 2013" },
        { label: "To $1 billion", value: "3 days", sub: "previous record: 15 days" },
        { label: "Units in 24 hours", value: "11.21M", color: C.text, sub: "Guinness" },
        { label: "Metacritic", value: "97", color: C.gold, sub: "PS3 / Xbox 360" },
      ]} />
      <P>It launched on September 17, 2013, on the PlayStation 3 and Xbox 360, consoles that were already seven years old. Take-Two filed an 8-K the next morning: retail sell-through above $800 million in a day.<R n={38} /> Two days later, another: $1 billion in three days, "faster than any other entertainment property in history." The previous record holder, <em>Call of Duty: Black Ops II</em>, had taken fifteen.<R n={39} /> Guinness certified seven records that October, including 11.21 million units in 24 hours and the largest single-day entertainment gross ever recorded, at $815.7 million.<R n={40} /></P>
      <GtaVChart />
      <P>Then the strange part began. Games have tails; blockbusters usually sell most of what they will ever sell in the first year. <em>GTA V</em> did not stop. It was re-released on the PlayStation 4 and Xbox One in November 2014 and sold another twelve million copies in the following twelve months. The PC version came in April 2015.<R n={107} /><R n={43} /> When Epic gave it away free for a week in May 2020, demand took the Epic Games Store offline for eight hours.<R n={45} /> In March 2022 it launched on a third generation of consoles.<R n={107} /> As of August 2026, Take-Two reports 230 million copies sold and calls it the best-selling title of the past decade by units and dollars.<R n={44} /></P>
      <Quote by="Doug Creutz, Cowen, April 2018">Another GTA V isn't likely. Michael Jackson had a lot of hit albums but he only had one Thriller.</Quote>
      <P>In April 2018, with sales at about 90 million, Creutz estimated that the game had grossed around $6 billion, which was more than any film ever made, including <em>Gone with the Wind</em> and <em>Avatar</em> adjusted for inflation.<R n={41} /><R n={42} /> He called it "a wild outlier." Eight years and 140 million copies later, no one has produced a serious estimate that puts it below that.</P>
      <H3>The satire</H3>
      <P>It is worth pausing on what the thing actually is, because the numbers make it sound like a spreadsheet. <em>GTA V</em> is a savage, funny, three-way character study wrapped around a parody of Southern California: Lifeinvader for Facebook, Weazel News for Fox, a conservative talk station and a liberal one, fifteen music stations of licensed songs, a fake internet and a fake stock market that reacts to what you do.<R n={107} /> Its torture scene drew condemnation from human-rights groups.<R n={105} /> Lindsay Lohan sued over a character she believed was her; New York's highest court dismissed the case 6 to 0, ruling that the depiction was "nothing more than cultural comment."<R n={46} /> Australia's two biggest retailers pulled it from shelves after a petition over violence against women.<R n={107} /></P>
      <Ed>The Clifford playbook, twenty years on. The difference is that by 2013 Rockstar no longer needed a publicist to generate the arguments; the work generated them by itself, and the company had learned to say nothing. Rockstar has not given a conventional press interview about a GTA game in more than a decade. It has not needed to.</Ed>
    </Section>

    <Divider />

    {/* ---------------- CH 06 ---------------- */}
    <Section id="ch6">
      <H2 num="06">The gift that keeps on giving</H2>
      <P>Two weeks after <em>GTA V</em>, on October 1, 2013, Rockstar switched on <em>GTA Online</em>: the same Los Santos, shared with up to thirty strangers, with its own economy. The launch was a disaster. Servers buckled, saves corrupted, characters vanished. Rockstar apologised by depositing GTA$500,000 of in-game money into every player's account.<R n={47} /> Imran Sarwar, a Rockstar design director, would say later: "It's one of our biggest regrets that we lost millions of players in that first year that have never experienced how much we have improved."<R n={59} /></P>
      <P>Alongside the free money were the paid kind. Shark Cards let players buy in-game dollars with real ones, from a few dollars to a hundred. There was no pay-to-win mechanic and no loot box; there was simply a very large city full of very expensive things, and a grind that could be skipped for cash.</P>
      <P>By April 2014 Zelnick had seen enough to explain what had changed. Just over 70% of connected <em>GTA V</em> players had tried Online, he told Fox Business, and then: "Just a few years ago when we put out a product, no matter how big, when we put out a hit we collected our money, we went onto the next... Now what we're finding is we're creating recurrent consumer spending and we have the gift that keeps on giving."<R n={48} /></P>
      <H3>The annuity</H3>
      <P>"Recurrent consumer spending" became the most important line in Take-Two's financial reporting. It was 32% of net bookings in fiscal 2017 and 48% a year later.<R n={49} /><R n={50} /> It crossed half in fiscal 2020, reached 63% in the pandemic year, and hit 78% after the Zynga acquisition folded in a mobile business built entirely on the same idea.<R n={51} /><R n={52} /> In the quarter that ended this June, it was 84%.<R n={55} /> Take-Two, once a company that sold boxes, now makes five of every six dollars from people who already own the box.</P>
      <TakeTwoChart />
      <P>The chart hides a second shift. In fiscal 2018, GTA products were nearly 40% of Take-Two's revenue.<R n={50} /> Since then NBA 2K has copied the model (an annual game with a virtual-currency economy inside it), Zynga arrived for $12.7 billion in 2022, and <em>Red Dead Redemption 2</em> took a record $725 million in its opening weekend in 2018 and has since sold 87 million copies.<R n={67} /><R n={66} /><R n={44} /> The company diversified. But it diversified into more versions of the thing <em>GTA Online</em> taught it.</P>
      <P>How much has <em>GTA Online</em> itself made? Take-Two has never said. SuperData estimated $1.09 billion by mid-2017 and about $595 million in digital revenue in 2019 alone.<R n={57} /> This April, hackers who breached a Rockstar analytics vendor published figures suggesting roughly $9.6 million a week, over $5 billion in Shark Card sales across 2014 to 2024, and, tellingly, that only about 4% of active players ever paid.<R n={58} /> Rockstar has not confirmed the numbers and this site treats them as unverified. But they are consistent with everything the company has disclosed.</P>
      <InvestCalc />
      <H3>What it did to everyone else</H3>
      <P>The games industry watched a single-player studio build a money machine out of a multiplayer mode and drew the obvious conclusion. The years after 2013 were the era of "games as a service": <em>Evolve</em>, <em>Battleborn</em>, <em>Paragon</em>, <em>Anthem</em>, a graveyard of live-service games that assumed players would show up because the store was open.<R n={60} /> Inside Rockstar, the planned single-player expansions for <em>GTA V</em> were quietly abandoned; everything went into Online.<R n={60} /><R n={59} /> Heists arrived in 2015, a casino in 2019, an island heist in 2020, and a $5.99-a-month subscription called GTA+ in 2022.<R n={107} /></P>
      <Ed>The honest reading is that GTA Online is both the best and worst thing that happened to the medium in the 2010s. It proved that a story-driven blockbuster and a live economy could coexist. It also convinced a generation of executives that the economy was the point, and most of them did not have a Los Santos to put it in.</Ed>
      <H3>The players who built their own game</H3>
      <P>Then the players did something Rockstar had not planned. Using a third-party mod framework called FiveM, communities built "roleplay" servers, in which every character was played by a person: cops, criminals, shopkeepers, lawyers, with rules and consequences. In February 2021 a server called NoPixel took <em>GTA V</em> to a record 438,000 concurrent viewers on Twitch; the game was Twitch's most-watched of 2021, and then again in 2024, at eleven years old.<R n={62} /><R n={63} /> In August 2023 Rockstar simply bought the FiveM team, Cfx.re, and rewrote its mod policy to bless what they had done.<R n={61} /></P>
      <P>Dailly's line from 1997 turned out to be the whole strategy. Put some toys in a world, then leave it alone.</P>
    </Section>

    <Divider />

    {/* ---------------- CH 07 ---------------- */}
    <Section id="ch7">
      <H2 num="07">The long silence</H2>
      <P>Here is the question every analyst asked for a decade: if <em>GTA V</em> made that much money, why on earth did it take thirteen years to make another one?</P>
      <P>Part of the answer is that the money was the reason. As long as Online kept growing, a sequel was as much a threat to the annuity as an opportunity. Part is that Zelnick meant what he said about pacing. "We're not a cadence-driven company," he told a TD Cowen conference this May. Annualising, he said, would "burn off our intellectual property, because you're in market too often and you can't possibly deliver the quality you need to deliver."<R n={73} /></P>
      <P>And part of it is that the years between were harder inside Rockstar than the revenue suggests.</P>
      <H3>The departures</H3>
      <P>Leslie Benzies, who had run Rockstar North through every GTA since <em>III</em>, went on sabbatical in September 2014 and never came back. In 2016 he sued for $150 million in unpaid royalties, claiming a 2009 plan had made him, Sam and Dan Houser "a privileged, connected, and financially equal group of three"; the case settled confidentially in 2019.<R n={70} /> His own studio's first game, <em>MindsEye</em>, shipped in June 2025 to a Metacritic score of 39, the worst-reviewed major release of the year.<R n={71} /></P>
      <P>In October 2018, three weeks before <em>Red Dead Redemption 2</em>, Dan Houser told New York magazine that "we were working 100-hour weeks," and then spent the next month clarifying that he had meant a four-person writing team over a few weeks.<R n={68} /> It reopened a wound from 2010, when the anonymous "Rockstar Spouse" letter had accused Rockstar San Diego of grinding staff through the first <em>Red Dead</em>.<R n={101} /> Bloomberg later reported that the company converted contractors to staff, added producers, and deliberately slowed development to avoid another RDR2.<R n={74} /> Dan Houser himself left in March 2020, after an extended break.<R n={69} /> Of the five founders, only Sam remains.</P>
      <P>In November 2021 the company outsourced remasters of the PS2 trilogy to a small studio and shipped them broken; Metacritic user scores fell to 0.4, and Rockstar apologised that the games "did not launch in a state that meets our own standards of quality."<R n={72} /> It was the first time in twenty years that a Rockstar logo had gone on something the company was ashamed of.</P>
      <H3>The road to VI</H3>
      <Timeline events={roadToVI} />
      <P>The hack deserves its own paragraph. In September 2022, ninety clips of an early build hit the internet. The person responsible was Arion Kurtaj, a 17-year-old member of the Lapsus$ group who was, at the time, on bail and under police protection in a Travelodge for a previous hack; he did it with an Amazon Fire Stick, the hotel television and a phone. Judged unfit to stand trial, he was given an indefinite hospital order in December 2023, with a psychiatric report noting he was "highly motivated" to return to cybercrime.<R n={75} /><R n={76} /> This July he was moved to prison, deemed fit, and given a retrial date: November 2026, the month the game ships.<R n={103} /></P>
      <P>Rockstar's response to the leak was to say almost nothing for fifteen months, then release Trailer 1 on December 4, 2023, a day early, because it had leaked too. Guinness audited 90.4 million YouTube views in 24 hours, a record for anything that was not a music video.<R n={77} /> The Tom Petty B-side under it, "Love Is a Long Road," saw Spotify streams rise 36,979% in a week.<R n={78} /></P>
      <AttentionChart />
      <P>The window said 2025. In May 2025 it became May 26, 2026; in November 2025 it became November 19, 2026, and Take-Two's shares closed down 8% that day.<R n={79} /><R n={80} /><R n={81} /> The same autumn, Rockstar dismissed somewhere between 31 and 34 employees in the UK and Canada who had been organising with the IWGB union, saying they had shared confidential information "in a public forum"; the union says the forum was a private Discord. A tribunal denied the workers interim relief in January, refused Rockstar's bid to strike out the claims in June, and has scheduled the full hearing for September 10 to October 15, 2026.<R n={83} /><R n={84} /> The company that was once hated by "reactionary creeps and the Daily Mail" is, for the first time, in a fight with its own staff on the eve of its biggest launch.</P>
    </Section>

    <Divider />

    {/* ---------------- CH 08 ---------------- */}
    <Section id="ch8">
      <H2 num="08">November 19</H2>
      <P>Pre-orders opened on June 25, 2026. Standard edition, $79.99. Ultimate, $99.99. No disc: boxed copies contain a download code. No multiplayer: the launch product is, in Rockstar's words, "a single player experience," with Online to follow. Pre-loading begins November 12.<R n={85} /> Within weeks, Newzoo called it "the strongest pre-order campaign on record," estimated $260 million in digital pre-orders globally in the first week alone, and projected a first week of 37 to 51 million units and $3.25 to $5.2 billion in sales.<R n={89} /> (It also called viral claims that the game had already banked $1 billion or $3 billion in pre-orders "absurd.")<R n={89} /></P>
      <P>Take-Two, characteristically, will not give a number. Pre-orders are "unprecedented and astonishing," Zelnick said on the August earnings call, before adding: "We haven't sold one unit yet. You can cancel a preorder. We're allergic to victory laps."<R n={91} /> What he will say is that the Ultimate edition is outselling the Standard, and that $80 is "an incredible bargain."<R n={86} /> Ben Thompson of Stratechery went further: "They should be charging like $200 for this."<R n={99} /></P>
      <LaunchCalc />
      <H3>What the forecasters think</H3>
      <P>DFC Intelligence projects roughly 40 million units and $3.2 billion in the first year.<R n={88} /> Morgan Stanley models 40 million units by the end of March, four months after launch; Wolfe Research reads Take-Two's own guidance as implying 31 to 35 million.<R n={90} /> Wedbush's Michael Pachter, who has covered the company since the Brant era, estimates development cost above $1.5 billion and lifetime revenue of $10 billion, plus another $500 million a year from Online once it arrives.<R n={87} /> Take-Two's guidance for the fiscal year is $8.0 to $8.2 billion in net bookings, against $6.7 billion last year, and the stock fell 4% when it was issued because Wall Street had expected more.<R n={54} /><R n={90} /></P>
      <P>Nobody outside Rockstar knows what the game cost. The figures in circulation, $1 billion to $2 billion, are all estimates.<R n={87} /> What is documented is scale: Take-Two now employs around 13,000 people; Rockstar told Dazed it has "doubled in size" since <em>RDR2</em>, that its Los Angeles studio works almost entirely on pedestrians, and that it hired race-car drivers to tune vehicle handling and fifty street artists to paint the walls of Leonida.<R n={91} /><R n={98} /> A Rockstar job listing last autumn described the project, without qualification, as "the largest game launch in history."<R n={104} /></P>
      <StatRow items={[
        { label: "Standard / Ultimate", value: "$80 / $100", color: C.text, sub: "Ultimate outselling" },
        { label: "Newzoo week-one range", value: "37–51M", sub: "units; $3.25–5.2B" },
        { label: "FY2027 bookings guide", value: "$8.0–8.2B", color: C.green, sub: "vs. $6.72B in FY2026" },
        { label: "Est. dev cost", value: "$1–2B", color: C.gold, sub: "unconfirmed" },
      ]} />
      <H3>Everyone else gets out of the way</H3>
      <P>Circana's Mat Piscatella projects US game spending of $62.8 billion this year and says the projection "relies heavily on GTA 6."<R n={92} /> When the game slipped out of 2025, Ampere Analysis cut its console forecasts by 700,000 hardware units and 21 million software units, a $2.7 billion hole in a single year's industry.<R n={93} /> Sony has told investors it secured enough memory, in the middle of a global RAM shortage, to build the PlayStation 5s it expects to sell around the launch, and is forecasting a record year for its games division.<R n={91} /> And publishers have simply moved. The day before this was written, Star Citizen's Chris Roberts pushed <em>Squadron 42</em> into 2027: "There is no way I want to launch... into the buzzsaw of GTA6."<R n={94} /></P>
      <H3>The last nine days</H3>
      <P>On August 18, a leaker calling themselves CyberLeek began posting clips of what appears to be a working build: Jason driving, a basketball court, combat, and, by the 26th, the first footage of Lucia. Rockstar issued takedowns and, on the 26th, an unusually human statement: the leaks were "heartbreaking for our team," and "we are very sorry that everything has taken as long as it has, from getting the game finished (nearly there!) to sharing more details and official gameplay."<R n={97} /></P>
      <P>The next evening, the company put a 26-minute gameplay presentation, "An Extended Look," on Netflix, exclusively, at 3 PM Eastern. Netflix briefly fell over. The special topped the service's US film chart and, by Sensor Tower's count, lifted Netflix's web traffic 125% in a day.<R n={95} /><R n={96} /> Zelnick's explanation for the venue: the goal is "to be on every social media channel on earth."<R n={91} /> Alongside it came the first developer interviews in years: NPCs who notice and comment on how you behave; characters whose bodies change with diet, exercise and sleep; seamless switching between Jason and Lucia mid-mission; a "Bonnie and Clyde" story at the centre.<R n={98} /></P>
      <Ed>Step back and look at the shape of the last three years. A hack, a leak, a trailer released early because of a leak, two delays, a labour dispute, another leak, an apology, and a Netflix premiere. Rockstar's control of its own message, the thing it built after Hot Coffee, has been tested harder in this cycle than at any point in its history, and the pre-order data suggests it did not matter. That is either the strongest brand in entertainment or the most patient audience. Probably both.</Ed>
    </Section>

    <Divider />

    {/* ---------------- CH 09 ---------------- */}
    <Section id="ch9">
      <H2 num="09" label="Chapter 09 · The playbook">What the rest of us can take from it</H2>
      <P>Rockstar is a strange company to learn from, because most of what it does is unrepeatable. Nobody else has a Los Santos. But the decisions underneath the games are ordinary enough to steal.</P>
      <Lesson n="01" title="Keep the bug.">The most valuable feature in a $475-million-unit franchise was a pathfinding error that testers refused to let anyone fix. The discipline is not "ship bugs"; it is noticing when the system is producing more fun than the design, and reorganising the design around it. Rockstar has done this at every scale since, up to and including buying the modders who built roleplay servers on top of its game.</Lesson>
      <Lesson n="02" title="Outrage is a channel, until it is a subpoena.">Max Clifford's campaign in 1997 was free marketing. Hot Coffee in 2005 cost $24.5 million and a Senate hearing. The line between them was not the content; it was the moment a critic could point to something the company had not disclosed. Provocation works when you control the facts.</Lesson>
      <Lesson n="03" title="Own the thing your business runs on.">When EA bought Criterion and took RenderWare off the market, Rockstar built RAGE instead of licensing a replacement. Twenty years later it still owns its engine, its physics, its tools and its schedule. The short-term cost was a six-month delay on GTA IV. The long-term return is every game since.</Lesson>
      <Lesson n="04" title="Scarcity is a strategy, not an accident.">Two new games in eight years is not a failure of throughput. "We're not a cadence-driven company," Zelnick says, and the pre-order data proves the market believes him. The pattern is more Pixar than Ubisoft: a small number of releases, each treated as an event, each expected to sell for a decade.</Lesson>
      <Lesson n="05" title="The tail is the business.">Take-Two earned 84% of its bookings last quarter from spending inside games people already owned. The launch is the customer-acquisition cost; the annuity is the product. Any business with a one-time purchase and a reason for the customer to come back has the same option, and most never take it.</Lesson>
      <Lesson n="06" title="Say less.">Rockstar has not run a conventional press cycle in fifteen years. It communicates through trailers, terse Newswire posts and, this month, a Netflix special. Every word it publishes is scarce, so every word is news. Silence, at sufficient scale, is a media strategy.</Lesson>
      <Lesson n="07" title="Hype has a bill, and it comes due inside the company.">Crunch letters in 2010 and 2018, a $150 million royalty suit, four of five founders gone, and a union tribunal that runs to mid-October. The external story is a triumph. The internal one is the cost of building the largest entertainment product in history with people, and it is not finished being paid.</Lesson>
      <P>In 1998 Take-Two paid about $14 million for the rights to <em>Grand Theft Auto</em>. In {days} days, its sixth numbered sequel will go on sale at $80, to a public that has already, by the most conservative external estimate, committed hundreds of millions of dollars to it sight unseen. Somewhere in Edinburgh, a team that has doubled in size since 2018 is finishing a city.<R n={98} /></P>
      <P>Whether it is worth the wait is the next chapter. And it has not been written yet.</P>
    </Section>

    <Divider />

    {/* ---------------- SOURCES ---------------- */}
    <Section id="sources">
      <H2 label="Sources &amp; method">Sources</H2>
      <P>Every figure in this narrative carries a bracketed reference. Hover a marker to see the source; click it to jump here. Fiscal years are Take-Two's, ending March 31. Sales figures are company-reported units at the last disclosed date unless labelled as estimates.</P>
      <FadeIn>
        <div style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 14, padding: "10px 22px", margin: "0 0 34px" }}>
          {sources.map(function (s) {
            return <div key={s.n} id={"src-" + s.n} style={{ display: "flex", gap: 14, padding: "11px 0", borderBottom: "1px solid " + C.faint, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--gta-mono)", fontSize: 12, color: C.accent, minWidth: 34, fontWeight: 600 }}>{"[" + s.n + "]"}</span>
              <span style={{ fontFamily: "var(--gta-sans)", fontSize: 15, lineHeight: 1.45 }}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.text, textDecoration: "none", borderBottom: "1px solid " + C.border }}>{s.title}</a>
                <span style={{ color: C.muted, fontSize: 13.5, marginLeft: 8 }}>{s.pub}</span>
              </span>
            </div>;
          })}
        </div>
      </FadeIn>
      <H3>Corrections applied during fact-checking</H3>
      <P>Several widely repeated claims were adjusted before publication. The Housers' father is often described as the owner of Ronnie Scott's jazz club; he was its lawyer.<R n={11} /> The phrase "an interactive world, not a game level" is commonly attributed to the Housers; no primary source supports it, so the equivalent idea is attributed here to art director Aaron Garbut, who is on the record.<R n={16} /> GTA VI Trailer 1 is routinely cited at 93 million views in 24 hours; the Guinness-audited figure is 90.4 million, used here.<R n={77} /> Trailer 2's 475 million is Rockstar's own cross-platform count and is labelled as such.<R n={82} /> The number of unionising staff dismissed in 2025 is reported as 31 by the union and 34 by Bloomberg; the narrative gives the range.<R n={83} /><R n={84} /> GTA V's $265 million budget and GTA VI's $1–2 billion budget are press and analyst estimates, never confirmed by the company, and are labelled as estimates.<R n={37} /><R n={87} /> The April 2026 GTA Online revenue figures come from a data breach and are unverified.<R n={58} /> Viral claims of $1 billion or $3 billion in GTA VI pre-orders were excluded; Take-Two has disclosed no figure.<R n={89} /></P>
      <H3>Method</H3>
      <P>Claims were checked against Take-Two's SEC filings and investor releases where they exist (sales records, revenue, recurrent-spending shares, guidance), against Guinness World Records for certified records, and against contemporaneous reporting from at least two outlets for everything else. Where a primary page could not be retrieved, the citation points to the most authoritative secondary source that quotes it. Anything that could not be confirmed was either cut or explicitly labelled as an estimate or a leak. Market data is as of the close on August 28, 2026.</P>
      <div style={{ ...CAP, marginTop: 48, textAlign: "center", color: C.muted, fontSize: 11 }}>Built August 29, 2026 &middot; {days} days to Leonida</div>
    </Section>
    <div style={{ maxWidth: W, margin: "0 auto", padding: "0 24px 48px" }}>
      <ResearchFooter currentSlug="gta" />
    </div>
    <div style={{ height: "max(24px, env(safe-area-inset-bottom))" }} />
  </div>;
}
