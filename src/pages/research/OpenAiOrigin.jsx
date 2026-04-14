import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const C = {
  bg: "#060810",
  surface: "#0d1019",
  card: "#141921",
  cardH: "#1a2030",
  accent: "#34d399",
  gold: "#f59e0b",
  red: "#ef4444",
  blue: "#60a5fa",
  purple: "#a78bfa",
  text: "#e8edf5",
  dim: "#94a3b8",
  muted: "#64748b",
  faint: "#1e293b",
  border: "#1e293b",
  glow: "rgba(52,211,153,0.06)",
};

const SEC = { maxWidth: 920, margin: "0 auto", padding: "80px 24px 80px" };
const BOX = {
  background: C.surface, border: "1px solid " + C.border,
  borderRadius: 14, padding: "22px 22px", margin: "6px 0 34px",
};
const CAP = {
  fontFamily: "var(--mono)", fontSize: 10, color: C.muted,
  letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600,
};

const chapters = [
  { id: "ch0", num: "00", short: "Demon" },
  { id: "ch1", num: "01", short: "Founding" },
  { id: "ch2", num: "02", short: "Exit" },
  { id: "ch3", num: "03", short: "Pivot" },
  { id: "ch4", num: "04", short: "Scale" },
  { id: "ch5", num: "05", short: "Gold Rush" },
  { id: "ch6", num: "06", short: "106 Hours" },
  { id: "ch7", num: "07", short: "Playbook" },
];

function FadeIn({ children, delay }) {
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

function H2({ num, label, children }) {
  return <FadeIn>
    <div style={{ maxWidth: 720, margin: "0 0 32px" }}>
      <div style={{ ...CAP, color: C.accent, letterSpacing: "0.22em", marginBottom: 14 }}>
        {label || ("CHAPTER " + num)}
      </div>
      <h2 style={{
        fontFamily: "var(--display)", fontSize: 42, lineHeight: 1.08,
        color: C.text, margin: 0, fontWeight: 700, letterSpacing: "-0.015em",
      }}>{children}</h2>
    </div>
  </FadeIn>;
}

function P({ children }) {
  return <FadeIn>
    <p style={{
      fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.82,
      color: C.dim, margin: "0 0 24px", maxWidth: 720,
    }}>{children}</p>
  </FadeIn>;
}

function Ed({ children }) {
  return <FadeIn>
    <p style={{
      fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.88,
      color: C.dim, margin: "0 0 28px", fontStyle: "italic",
      borderLeft: "2px solid " + C.gold + "70", paddingLeft: 22,
      maxWidth: 720,
    }}>{children}</p>
  </FadeIn>;
}

function Quote({ children, by }) {
  return <FadeIn>
    <blockquote style={{
      fontFamily: "var(--display)", fontSize: 23, lineHeight: 1.4,
      color: C.text, margin: "6px 0 32px", padding: "20px 26px",
      background: C.glow, borderLeft: "3px solid " + C.accent,
      borderRadius: "2px 10px 10px 2px", fontStyle: "italic",
      maxWidth: 720, fontWeight: 500,
    }}>
      <div>{"“" + children + "”"}</div>
      {by ? <div style={{
        fontFamily: "var(--mono)", fontSize: 11, color: C.muted,
        fontStyle: "normal", marginTop: 14, letterSpacing: "0.12em", fontWeight: 600,
      }}>{"— " + by.toUpperCase()}</div> : null}
    </blockquote>
  </FadeIn>;
}

function Rf({ n }) {
  return <sup style={{
    color: C.accent, fontSize: 9, cursor: "pointer",
    fontFamily: "var(--mono)", fontWeight: 600, opacity: 0.75, padding: "0 1px",
  }} onClick={function () {
    var el = document.getElementById("sources");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }}>{"[" + n + "]"}</sup>;
}

function Tip(props) {
  if (!props.active || !props.payload || !props.payload.length) return null;
  return <div style={{
    background: C.card, border: "1px solid " + C.border,
    borderRadius: 10, padding: "10px 14px",
    boxShadow: "0 12px 40px rgba(0,0,0,.7)",
  }}>
    <div style={{ color: C.muted, fontSize: 10, fontFamily: "var(--mono)", marginBottom: 6 }}>{props.label}</div>
    {props.payload.map(function (p, i) {
      return <div key={i} style={{ color: p.color, fontSize: 12, fontFamily: "var(--mono)" }}>
        {p.name}: <strong>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</strong>
      </div>;
    })}
  </div>;
}

function NavBar({ active, show }) {
  var navRef = useRef();
  useEffect(function () {
    if (!navRef.current || !active) return;
    var el = navRef.current.querySelector('[data-ch="' + active + '"]');
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return <nav style={{
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: C.bg + "e8", backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid " + C.faint,
    transform: show ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
  }}>
    <div style={{
      maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center",
      paddingLeft: 10, paddingRight: 12,
    }}>
      <Link to="/projects" aria-label="Back to projects" style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "13px 12px 13px 8px", marginRight: 8,
        color: C.dim, fontFamily: "var(--mono)", fontSize: 13,
        textDecoration: "none", flexShrink: 0,
        borderRight: "1px solid " + C.faint,
        transition: "color 0.15s",
      }} onMouseEnter={function (e) { e.currentTarget.style.color = C.accent; }}
        onMouseLeave={function (e) { e.currentTarget.style.color = C.dim; }}>
        <span style={{ fontSize: 15, lineHeight: 1 }}>{"\u2190"}</span>
      </Link>
      <div ref={navRef} style={{
        flex: 1, minWidth: 0, display: "flex",
        overflowX: "auto", scrollbarWidth: "none",
      }}>
      {chapters.map(function (ch) {
        var isA = active === ch.id;
        return <a key={ch.id} data-ch={ch.id} href={"#" + ch.id}
          onClick={function (e) {
            e.preventDefault();
            var el = document.getElementById(ch.id);
            if (el) window.scrollTo({
              top: el.getBoundingClientRect().top + window.scrollY - 54,
              behavior: "smooth",
            });
          }}
          style={{
            padding: "14px 11px", fontSize: 11,
            fontWeight: isA ? 700 : 500, whiteSpace: "nowrap",
            color: isA ? C.accent : C.muted,
            borderBottom: "2px solid " + (isA ? C.accent : "transparent"),
            textDecoration: "none", fontFamily: "var(--sans)",
            transition: "color 0.15s, border-color 0.15s",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
          {ch.num + " " + ch.short}
        </a>;
      })}
      </div>
    </div>
  </nav>;
}

function HeroStat({ label, value, sub }) {
  return <div style={{
    background: C.surface, border: "1px solid " + C.border,
    borderRadius: 12, padding: "18px 16px",
  }}>
    <div style={{ ...CAP, fontSize: 9, letterSpacing: "0.12em", marginBottom: 8 }}>{label}</div>
    <div style={{
      fontFamily: "var(--display)", fontSize: 38, color: C.accent,
      fontWeight: 800, lineHeight: 1, marginBottom: 6,
    }}>{value}</div>
    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.dim }}>{sub}</div>
  </div>;
}

function Hero() {
  return <section style={{
    minHeight: "100vh", display: "flex", alignItems: "center",
    padding: "60px 24px", position: "relative",
    maxWidth: 920, margin: "0 auto",
  }}>
    <div style={{
      position: "absolute", top: "18%", left: "50%",
      transform: "translateX(-50%)", width: "90%", maxWidth: 900, height: 420,
      background: "radial-gradient(circle, " + C.accent + "12, transparent 70%)",
      pointerEvents: "none",
    }} />
    <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
      <div style={{ ...CAP, color: C.accent, letterSpacing: "0.32em", marginBottom: 24 }}>
        A NARRATIVE · 2015 — 2023
      </div>
      <h1 style={{
        fontFamily: "var(--display)", fontSize: "clamp(42px, 8vw, 82px)",
        lineHeight: 1.04, color: C.text, margin: "0 0 30px",
        fontWeight: 800, letterSpacing: "-0.025em", maxWidth: 860,
      }}>
        The most valuable <span style={{ fontStyle: "italic", color: C.accent }}>non-profit</span> in history was founded to prevent itself from being built.
      </h1>
      <p style={{
        fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.56,
        color: C.dim, margin: "0 0 44px", maxWidth: 680,
      }}>
        The story of OpenAI — from a dinner in Menlo Park in 2015 to the weekend in November 2023 when 738 of 770 employees threatened to quit unless the board reinstated the CEO it had just fired. Eight years. One contradiction. Thirteen billion dollars to hold it together.
      </p>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
        maxWidth: 720, marginBottom: 46,
      }}>
        <HeroStat label="Days of chaos" value="106" sub="Fri Nov 17 → Tue Nov 21" />
        <HeroStat label="Staff who threatened to quit" value="738" sub="of 770" />
        <HeroStat label="Microsoft commitment" value="$13B" sub="2019 → 2023" />
      </div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 11, color: C.muted, letterSpacing: "0.18em",
      }}>↓ SCROLL</div>
    </div>
  </section>;
}

function Ch0() {
  return <section id="ch0" style={{ ...SEC, padding: "120px 24px 70px" }}>
    <H2 num="00">Before the dinner, the demon.</H2>

    <P>
      On October 24, 2014, Elon Musk walked onstage at MIT's Aeronautics and Astronautics Centennial Symposium and — in front of a room of engineers who had come to hear about Mars — said this about artificial intelligence<Rf n={1} />:
    </P>

    <Quote by="Elon Musk, MIT, 2014">
      With artificial intelligence, we are summoning the demon. You know all those stories where there's the guy with the pentagram and the holy water and he's like, yeah, he's sure he can control the demon? Doesn't work out.
    </Quote>

    <P>
      He called AI humanity's "biggest existential threat" in the same speech. The line became a headline; the fear underneath it did not.
    </P>

    <P>
      Here is the fear. In January 2014, Google had acquired DeepMind, a London AI lab run by Demis Hassabis, for roughly half a billion dollars<Rf n={2} />. Musk had personally tried to convince Hassabis not to sell. He had failed. The company in the world most likely to build artificial general intelligence was now a subsidiary of the company with the most data and the most compute. The path to AGI ran through one corporation, one board, one city.
    </P>

    <P>
      Then, at Musk's birthday in Napa Valley in 2015, the argument with Larry Page happened. Page, Google's co-founder, had been defending AI development for years. When Musk pressed him on the risk — what if the thing you build does not want what we want? — Page reportedly called Musk a "specie-ist": a bigot who preferred carbon-based humans to the next stage of evolution<Rf n={3} />. Musk has said that argument ended the friendship.
    </P>

    <Ed>
      The relevant fact here is not who was right. It is that by the summer of 2015, one man with a hundred billion dollars of net worth had concluded that the people building AGI did not share his priors — and that the only way to fix that was to build a competitor.
    </Ed>

    <P>
      He needed a partner. In the summer of 2015, he found one.
    </P>
  </section>;
}

function PledgeGap() {
  var data = [
    { name: "Pledged (2015)", value: 1000, fill: C.accent },
    { name: "Delivered by 2019", value: 130, fill: C.gold },
  ];
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, marginBottom: 6 }}>The Headline vs the Bank Account</div>
      <div style={{
        fontFamily: "var(--serif)", fontSize: 13, color: C.dim,
        fontStyle: "italic", marginBottom: 16,
      }}>OpenAI pledged contributions vs actual delivered funding (USD millions)</div>
      <div style={{ height: 180 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 46, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
            <XAxis type="number" stroke={C.muted} fontSize={11} tickFormatter={function (v) { return "$" + v + "M"; }} />
            <YAxis type="category" dataKey="name" stroke={C.muted} fontSize={11} width={130} />
            <Tooltip content={<Tip />} cursor={{ fill: C.cardH }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map(function (d, i) { return <Cell key={i} fill={d.fill} />; })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 10, color: C.muted,
        marginTop: 10, letterSpacing: "0.04em", lineHeight: 1.6,
      }}>OpenAI March 2024 disclosures. Musk personally delivered less than $45M of the pledged total.</div>
    </div>
  </FadeIn>;
}

function Ch1() {
  return <section id="ch1" style={SEC}>
    <H2 num="01">A dinner, a billion dollars, a manifesto.</H2>

    <P>
      Sam Altman was running Y Combinator. He had been thinking about AI safety for years, partly as an intellectual fascination, partly because so many of the smartest people walking into his YC office wanted to talk about it. In the summer of 2015 he organized a dinner at the Rosewood Sand Hill, a low-slung luxury hotel across the road from Sand Hill Road's venture capital offices<Rf n={4} />.
    </P>

    <P>
      Around the table: Musk, Altman, Greg Brockman (then CTO of Stripe, soon to leave), Ilya Sutskever (a 29-year-old Google Brain researcher who had co-created AlexNet and written the sequence-to-sequence paper), and a handful of other researchers. The question was blunt: could a non-profit founded explicitly as a counterweight to Google's AI dominance actually matter?
    </P>

    <P>
      By the end of the dinner, the answer had become yes. By the fall, Brockman was running recruiting. John Schulman agreed to come over. That broke the dam — Andrej Karpathy followed, then Wojciech Zaremba, then the rest. Sutskever walking away from Google Brain was the signal that convinced most of them this was real<Rf n={5} />.
    </P>

    <P>
      On December 11, 2015, the organization announced itself<Rf n={6} />:
    </P>

    <Quote by="OpenAI launch post, December 11, 2015">
      OpenAI is a non-profit artificial intelligence research company. Our goal is to advance digital intelligence in the way that is most likely to benefit humanity as a whole, unconstrained by a need to generate financial return.
    </Quote>

    <P>
      The structure was a 501(c)(3). The mission was AGI for humanity. The funding number in the press release was <strong style={{ color: C.text }}>one billion dollars</strong>, pledged across Musk, Altman, Brockman, Reid Hoffman, Peter Thiel, Jessica Livingston, YC Research, AWS, and Infosys. It was the biggest opening statement in the history of AI research.
    </P>

    <Ed>
      It was also, it turned out later, more aspirational than literal. By the time OpenAI's funding crisis broke in early 2019, the organization had raised approximately $130 million in actual contributions — about thirteen percent of the headline pledge<Rf n={7} />. Musk's share, disclosed years later in a lawsuit response, was less than $45 million<Rf n={8} />.
    </Ed>

    <PledgeGap />

    <P>
      None of that mattered in December 2015. What mattered was that a small lab of roughly ten researchers had announced it was going to build AGI for the benefit of humanity, and had collected enough capital to be taken seriously. The mission was simple. The math, as the next four years would reveal, was not.
    </P>
  </section>;
}

function Ch2() {
  return <section id="ch2" style={SEC}>
    <H2 num="02">The co-chair who wanted to be CEO.</H2>

    <P>
      For the first two years, OpenAI was a research lab doing research-lab things. OpenAI Gym, a toolkit for reinforcement learning, launched in April 2016 and became the default benchmark everyone in the field trained against<Rf n={9} />. OpenAI Five, a team of neural networks, beat the reigning Dota 2 world champions at a live event in San Francisco<Rf n={10} />. A robotic hand called Dactyl eventually solved a Rubik's cube.
    </P>

    <P>
      The language work, which would eventually eat everything else, started quietly. In June 2018, Alec Radford, Ilya Sutskever, and two colleagues posted a paper called "Improving Language Understanding by Generative Pre-Training"<Rf n={11} />. It had 117 million parameters. It was trained on books. Its name, abbreviated, was GPT.
    </P>

    <P>
      But the real drama of 2016 through 2018 was not in the papers. It was inside the building.
    </P>

    <Ed>
      According to emails OpenAI itself later disclosed in a March 2024 response to Elon Musk's lawsuit, by late 2017 Musk had concluded the only way OpenAI could compete with Google was to raise far more capital than any non-profit could plausibly collect. His proposed solution: attach OpenAI to Tesla as "its cash cow," take a majority equity stake, take board control, and become CEO<Rf n={12} />. Altman, Brockman, and the rest of the team said no. Musk withheld funding during the negotiation, then walked.
    </Ed>

    <P>
      On February 21, 2018, OpenAI announced Musk was stepping down from the board to "eliminate a potential future conflict of interest," as Tesla's autonomous-driving work pulled from the same pool of researchers<Rf n={13} />. Publicly, it was collegial. Privately, per Semafor's later reporting, Musk told the team OpenAI's probability of success under Altman was "zero" and that he would build a competing effort inside Tesla<Rf n={14} />. His remaining pledged contributions stopped arriving. The non-profit was suddenly very alone.
    </P>

    <P>
      Six weeks later, on April 9, 2018, OpenAI published its Charter<Rf n={15} />. Four commitments: broadly distributed benefits, long-term safety, technical leadership, cooperative orientation. The most consequential sentence was buried in the safety section. The document called it the "merge and assist" clause:
    </P>

    <Quote>
      If a value-aligned, safety-conscious project comes close to building AGI before we do, we commit to stop competing with and start assisting this project.
    </Quote>

    <P>
      It was meant as a pledge to the field. Five and a half years later, it would turn out to be a loaded gun OpenAI had pointed at itself.
    </P>
  </section>;
}

function Structure() {
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, marginBottom: 22 }}>OpenAI's Capped-Profit Structure · March 2019</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          padding: "18px 20px", background: C.glow,
          border: "1px solid " + C.accent + "60", borderRadius: 10,
        }}>
          <div style={{ ...CAP, fontSize: 9, color: C.accent, letterSpacing: "0.16em", marginBottom: 6 }}>
            PARENT · 501(c)(3) NONPROFIT
          </div>
          <div style={{ fontFamily: "var(--display)", fontSize: 22, color: C.text, fontWeight: 700 }}>OpenAI, Inc.</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 13, color: C.dim, marginTop: 5, lineHeight: 1.55 }}>
            Board of directors. Ultimate control over strategy and mission. No shareholders.
          </div>
        </div>

        <div style={{
          textAlign: "center", fontFamily: "var(--mono)", fontSize: 11,
          color: C.muted, letterSpacing: "0.12em", padding: "2px 0",
        }}>↓ CONTROLS ↓</div>

        <div style={{
          padding: "18px 20px", background: C.card,
          border: "1px solid " + C.border, borderRadius: 10,
        }}>
          <div style={{ ...CAP, fontSize: 9, color: C.gold, letterSpacing: "0.16em", marginBottom: 6 }}>
            SUBSIDIARY · CAPPED-PROFIT LP
          </div>
          <div style={{ fontFamily: "var(--display)", fontSize: 22, color: C.text, fontWeight: 700 }}>OpenAI LP</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 13, color: C.dim, marginTop: 5, lineHeight: 1.55 }}>
            Investor returns capped at <strong style={{ color: C.gold }}>100×</strong>. Any upside above the cap flows back to the non-profit. Accepts conventional equity investment.
          </div>
        </div>
      </div>
    </div>
  </FadeIn>;
}

function Ch3() {
  return <section id="ch3" style={SEC}>
    <H2 num="03">The non-profit takes out a billion-dollar loan.</H2>

    <P>
      By early 2019, two things had become clear. First: the way to make neural networks better was to make them bigger, and the way to make them bigger was to spend an enormous amount of money on compute. In January 2020, Jared Kaplan and a group of OpenAI researchers would formalize this intuition in a paper called "Scaling Laws for Neural Language Models" — model loss was a power-law function of parameters, data, and compute, across seven orders of magnitude<Rf n={16} />. You could, in principle, just buy intelligence.
    </P>

    <P>
      Second: OpenAI could not afford to buy it. A 501(c)(3) built on donations had delivered about $130 million in four years against a billion-dollar pledge. Training runs for frontier models were already costing tens of millions each. The math did not work.
    </P>

    <P>
      On March 11, 2019, Brockman and Sutskever published a blog post titled "OpenAI LP"<Rf n={17} />. Inside was a new corporate structure designed to reconcile an impossible set of constraints: keep the non-profit mission, keep the nonprofit board in ultimate control, but make it possible to raise billions of dollars of equity capital from investors who would actually want a return.
    </P>

    <Structure />

    <P>
      The compromise was this. OpenAI, Inc. (the 501(c)(3)) would remain the parent. Underneath it would sit OpenAI LP, a for-profit whose investors' returns were capped at <strong style={{ color: C.text }}>one hundred times</strong> their investment. Any value above the cap flowed up to the non-profit. Any control over direction flowed down from the non-profit. The founders described it to investors in one line: if AGI worked, it would produce "value equivalent to 100 Microsofts or more" — and at that level, the overage belonged to humanity.
    </P>

    <P>
      Three days earlier, Sam Altman had resigned as president of Y Combinator to become CEO of OpenAI LP<Rf n={18} />. Four months later, on July 22, 2019, Microsoft announced a $1 billion investment — roughly half of it in Azure compute credits — and the company became OpenAI's exclusive cloud provider<Rf n={19} />. Satya Nadella would later admit that Bill Gates had told him at the time: "Yeah, you're going to burn this billion dollars"<Rf n={20} />.
    </P>

    <Quote by="Satya Nadella, Microsoft CEO, July 22, 2019">
      By bringing together OpenAI's breakthrough technology with new Azure AI supercomputing technologies, our ambition is to democratize AI — while always keeping AI safety front and center — so everyone can benefit.
    </Quote>

    <P>
      The contradiction at the center of OpenAI was now structural. A non-profit whose mission was to prevent dangerous concentrations of AI power now controlled a for-profit that had just accepted its single largest investment from the second-largest technology company on earth in exchange for exclusive cloud rights. Inside the company, Karen Hao would write a year later, there was already "a misalignment between what the company publicly espouses and how it operates behind closed doors"<Rf n={21} />. The people who would later leave had already started noticing.
    </P>
  </section>;
}

function AnthropicTable() {
  var people = [
    { name: "Dario Amodei", at: "VP Research", paper: "GPT-3 · Scaling Laws" },
    { name: "Daniela Amodei", at: "VP Safety & Policy", paper: "—" },
    { name: "Tom Brown", at: "Research Scientist", paper: "GPT-3 (1st author)" },
    { name: "Sam McCandlish", at: "Research Scientist", paper: "Scaling Laws" },
    { name: "Jared Kaplan", at: "Research Scientist", paper: "Scaling Laws (1st)" },
    { name: "Jack Clark", at: "Policy Director", paper: "—" },
    { name: "Chris Olah", at: "Interpretability", paper: "—" },
    { name: "Ben Mann", at: "Researcher", paper: "GPT-3" },
  ];
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, marginBottom: 6 }}>The Anthropic Exodus · Late 2020 — Early 2021</div>
      <div style={{
        fontFamily: "var(--serif)", fontSize: 13, color: C.dim,
        fontStyle: "italic", marginBottom: 16,
      }}>Key OpenAI departures who founded Anthropic, and their cited paper contributions</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {people.map(function (p) {
          return <div key={p.name} style={{
            display: "grid", gridTemplateColumns: "1.35fr 1fr 1.25fr", gap: 10,
            padding: "12px 14px", background: C.card, borderRadius: 8,
            borderLeft: "2px solid " + C.purple + "90",
          }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.text, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.muted }}>{p.at}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: C.purple, textAlign: "right" }}>{p.paper}</div>
          </div>;
        })}
      </div>
    </div>
  </FadeIn>;
}

function ChatGPTChart() {
  var data = [
    { day: "Nov 30", users: 0 },
    { day: "Dec 5", users: 1 },
    { day: "Dec 15", users: 5 },
    { day: "Dec 31", users: 20 },
    { day: "Jan 15", users: 55 },
    { day: "Jan 31", users: 100 },
  ];
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, marginBottom: 6 }}>ChatGPT User Growth · Nov 30, 2022 → Jan 31, 2023</div>
      <div style={{
        fontFamily: "var(--serif)", fontSize: 13, color: C.dim,
        fontStyle: "italic", marginBottom: 16,
      }}>Estimated monthly active users, in millions (UBS / SimilarWeb estimates)</div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 12, right: 14, left: 0, bottom: 6 }}>
            <defs>
              <linearGradient id="gptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.accent} stopOpacity={0.55} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="day" stroke={C.muted} fontSize={11} />
            <YAxis stroke={C.muted} fontSize={11} tickFormatter={function (v) { return v + "M"; }} />
            <Tooltip content={<Tip />} />
            <Area type="monotone" dataKey="users" name="MAU" stroke={C.accent} strokeWidth={2.5} fill="url(#gptGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 10, color: C.muted,
        marginTop: 10, letterSpacing: "0.04em", lineHeight: 1.6,
      }}>TikTok took about 9 months to reach 100M MAU. Instagram took about 2.5 years.</div>
    </div>
  </FadeIn>;
}

function Ch4() {
  return <section id="ch4" style={SEC}>
    <H2 num="04">The people who wrote the scaling laws leave the company that had to follow them.</H2>

    <P>
      In May 2020, OpenAI posted a paper called "Language Models are Few-Shot Learners"<Rf n={22} />. The model it described — 175 billion parameters, trained on roughly 300 billion tokens from the web, books, and Wikipedia — became known as GPT-3. It had thirty-one authors. It could write reasonable English prose from a prompt. It could, sometimes, do arithmetic. Its training run cost an estimated $4 to $12 million, depending on whose numbers you trusted<Rf n={23} />. The API went into private beta on June 11, 2020. In September, Microsoft acquired an exclusive license to the underlying model<Rf n={24} />.
    </P>

    <P>
      And then, over the course of late 2020 and early 2021, the people who had written the scaling laws paper started leaving.
    </P>

    <AnthropicTable />

    <P>
      Dario Amodei, OpenAI's VP of Research and lead on the GPT-3 effort, departed in late 2020. His sister Daniela, VP of Safety and Policy, left with him. So did Tom Brown (first author on GPT-3), Sam McCandlish and Jared Kaplan (lead authors on the scaling laws paper itself), Jack Clark (policy), Chris Olah (interpretability), and Ben Mann. By early 2021 they had founded a new company called Anthropic<Rf n={25} />. In May 2021, Anthropic raised a $124 million Series A led by Jaan Tallinn. A year later, it raised another $580 million — led by Sam Bankman-Fried<Rf n={26} />.
    </P>

    <Ed>
      This is the cleanest structural irony in the OpenAI story. The researchers whose work made it rational to spend billions on ever-larger training runs were the ones who became most alarmed by what that same work implied about safety. They did not leave because scaling did not work. They left because it did.
    </Ed>

    <P>
      On November 30, 2022, OpenAI quietly posted a page called chat.openai.com and a blog post titled "Introducing ChatGPT"<Rf n={27} />. The framing, repeated throughout the announcement, was "research preview." Senior staff later said expectations were so low that several of them worried the release would be ignored. Sam Altman tweeted the link and went to bed.
    </P>

    <P>
      Five days later, Altman tweeted a follow-up: one million users. By the end of January, an analyst report from UBS estimated ChatGPT had crossed one hundred million monthly active users — the fastest consumer-product ramp the internet had ever seen<Rf n={28} />.
    </P>

    <ChatGPTChart />

    <P>
      Everything that happened in the next eleven months — the Microsoft follow-on, GPT-4, the pause letter, the world tour, the firing — happened against the backdrop of this chart. An organization that in the spring of 2022 was still recognizably a research lab found itself, by the summer of 2023, running the fastest-growing consumer software product in history.
    </P>
  </section>;
}

function MicrosoftInvestment() {
  var data = [
    { year: "2019", cash: 1 },
    { year: "2021", cash: 2 },
    { year: "2023", cash: 10 },
  ];
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, marginBottom: 6 }}>Microsoft's OpenAI Commitment · 2019 → 2023</div>
      <div style={{
        fontFamily: "var(--serif)", fontSize: 13, color: C.dim,
        fontStyle: "italic", marginBottom: 16,
      }}>Reported tranche size, in billions of dollars (mix of cash and Azure credits)</div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 14, right: 14, left: 0, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="year" stroke={C.muted} fontSize={11} />
            <YAxis stroke={C.muted} fontSize={11} tickFormatter={function (v) { return "$" + v + "B"; }} />
            <Tooltip content={<Tip />} cursor={{ fill: C.cardH }} />
            <Bar dataKey="cash" name="Commitment" radius={[6, 6, 0, 0]}>
              {data.map(function (d, i) {
                return <Cell key={i} fill={i === 2 ? C.accent : C.blue} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 10, color: C.muted,
        marginTop: 10, letterSpacing: "0.04em", lineHeight: 1.6,
      }}>Cumulative: approximately $13B. Microsoft has never broken out cash vs. compute credits in its filings.</div>
    </div>
  </FadeIn>;
}

function Ch5() {
  return <section id="ch5" style={SEC}>
    <H2 num="05">Everyone wants in. Everyone is worried.</H2>

    <P>
      On January 23, 2023, Microsoft announced a "multiyear, multibillion dollar" extension of its OpenAI partnership<Rf n={29} />. Microsoft did not disclose a number, but Semafor reporting two weeks earlier put the figure at $10 billion — bringing Microsoft's cumulative commitment across three tranches (2019, 2021, 2023) to roughly $13 billion<Rf n={30} />. The structure, per the same reporting: Microsoft would receive 75% of OpenAI's profits until recoupment, after which the equity split would flip to roughly 49% Microsoft, 49% other investors, and 2% to the non-profit parent.
    </P>

    <MicrosoftInvestment />

    <P>
      Seven weeks later, on March 14, 2023, OpenAI released GPT-4<Rf n={31} />. It was multimodal, it scored in the 90th percentile on the Uniform Bar Exam, and it prompted a group of researchers inside Microsoft itself to start using the phrase "sparks of artificial general intelligence" in formal papers<Rf n={32} />.
    </P>

    <P>
      Eight days later, the Future of Life Institute published an open letter calling for a six-month pause on training "AI systems more powerful than GPT-4"<Rf n={33} />. Elon Musk signed it. Steve Wozniak signed it. Yoshua Bengio signed it. Stuart Russell signed it. Sam Altman did not.
    </P>

    <Ed>
      Altman's public posture throughout 2023 was the opposite of a pause. Between May and June, he toured roughly twenty-two countries on what OpenAI called its "world tour," meeting with Rishi Sunak, Emmanuel Macron, Olaf Scholz, Narendra Modi, and most of the rest of the G20<Rf n={34} />. He testified to the U.S. Senate and asked for regulation. On July 5, OpenAI announced a "Superalignment" team, co-led by Ilya Sutskever and Jan Leike, and committed 20% of its secured compute to it<Rf n={35} />.
    </Ed>

    <P>
      Behind the scenes, the board was not happy. In October, Helen Toner — one of the four independent directors, and strategy director at Georgetown's Center for Security and Emerging Technology — co-published a CSET paper titled "Decoding Intentions"<Rf n={36} />. It praised Anthropic's safety posture. It called GPT-4's release "fuel to the fire." Altman, per later reporting by the New York Times and The Information, was furious. He began contacting other board members to argue the paper was dangerous to OpenAI at a moment when the FTC was already investigating the company. Toner would later go public with her account on the TED AI Show:
    </P>

    <Quote by="Helen Toner, TED AI Show, May 2024">
      After the paper came out, Sam started lying to other board members in order to try and push me off the board.
    </Quote>

    <P>
      On November 6, at OpenAI's first developer conference, Altman unveiled GPT-4 Turbo, a custom-GPT builder, and a GPT Store. Ten days later, at the APEC CEO Summit in San Francisco on November 16, he told a panel he had just witnessed the kind of breakthrough he had been hoping for his entire career:
    </P>

    <Quote by="Sam Altman, APEC CEO Summit, November 16, 2023">
      Four times now in the history of OpenAI — the most recent time was just in the last couple of weeks — I've gotten to be in the room when we sort of push the veil of ignorance back and the frontier of discovery forward, and getting to do that is the professional honor of a lifetime.
    </Quote>

    <P>
      The next morning, he flew to Las Vegas for the Formula 1 Grand Prix. On Friday at noon Pacific time, Ilya Sutskever sent him a Google Meet link.
    </P>
  </section>;
}

function Timeline106() {
  var events = [
    { day: "FRI · NOV 17", time: "~12:00 PM PT", color: C.red, title: "Altman fired over Google Meet", body: "Sutskever tells Altman the board has voted him out. Altman is in a Vegas hotel for F1 weekend." },
    { day: "FRI · NOV 17", time: "12:30 PM PT", color: C.red, title: "Public announcement", body: "Blog post cites Altman being \"not consistently candid.\" Mira Murati is named interim CEO. Microsoft gets ~1 minute of notice." },
    { day: "FRI · NOV 17", time: "Evening", color: C.red, title: "Greg Brockman resigns", body: "\"Sam and I are shocked and saddened by what the board did today.\" Three senior researchers quit with him." },
    { day: "SAT · NOV 18", time: "All day", color: C.gold, title: "Altman returns to HQ in a guest badge", body: "Reinstatement talks begin. Investors and Microsoft push the board to reverse. Board demands an independent investigation." },
    { day: "SUN · NOV 19", time: "Late night", color: C.gold, title: "Emmett Shear replaces Murati", body: "Murati had tried to rehire Altman. The board replaces her with Emmett Shear, former CEO of Twitch." },
    { day: "SUN · NOV 19", time: "~11 PM PT", color: C.blue, title: "Nadella announces Altman to Microsoft", body: "\"Sam Altman and Greg Brockman, together with colleagues, will be joining Microsoft to lead a new advanced AI research team.\" Altman replies: \"the mission continues.\"" },
    { day: "MON · NOV 20", time: "5:15 AM PT", color: C.gold, title: "Sutskever: \"I deeply regret\"", body: "The director who executed the firing Friday reverses course: \"I deeply regret my participation in the board's actions.\"" },
    { day: "MON · NOV 20", time: "Morning", color: C.gold, title: "The employee letter", body: "500 signatures become 738 of 770 by day's end. Ilya Sutskever signs it. First two names: Murati and Brad Lightcap." },
    { day: "MON · NOV 20", time: "Afternoon", color: C.blue, title: "Nadella's press blitz", body: "On Bloomberg and CNBC, back to back: \"Surprises are bad. We're never going to get surprised like this, ever again.\"" },
    { day: "TUE · NOV 21", time: "~10 PM PT", color: C.accent, title: "Altman reinstated", body: "New initial board: Bret Taylor (chair), Larry Summers, Adam D'Angelo. Sutskever, Toner, McCauley — gone." },
  ];
  return <FadeIn>
    <div style={{ ...BOX, padding: "28px 22px 30px 22px" }}>
      <div style={{ ...CAP, marginBottom: 24 }}>The 106 Hours · Friday Noon → Tuesday Night</div>
      <div style={{ position: "relative", paddingLeft: 28 }}>
        <div style={{
          position: "absolute", left: 9, top: 8, bottom: 8, width: 1.5,
          background: "linear-gradient(to bottom, " + C.red + ", " + C.gold + ", " + C.accent + ")",
          borderRadius: 1,
        }} />
        {events.map(function (e, i) {
          return <div key={i} style={{
            position: "relative", marginBottom: i === events.length - 1 ? 0 : 22,
          }}>
            <div style={{
              position: "absolute", left: -24, top: 10, width: 10, height: 10,
              borderRadius: "50%", background: e.color,
              border: "2px solid " + C.bg,
              boxShadow: "0 0 0 2px " + e.color + "40",
            }} />
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, color: e.color,
              letterSpacing: "0.1em", fontWeight: 600, marginBottom: 3,
            }}>{e.day + " · " + e.time}</div>
            <div style={{
              fontFamily: "var(--sans)", fontSize: 15, color: C.text,
              fontWeight: 600, marginBottom: 4,
            }}>{e.title}</div>
            <div style={{
              fontFamily: "var(--serif)", fontSize: 14, color: C.dim, lineHeight: 1.58,
            }}>{e.body}</div>
          </div>;
        })}
      </div>
    </div>
  </FadeIn>;
}

function BoardCompare() {
  var before = [
    { name: "Sam Altman", role: "CEO · Director", kept: false },
    { name: "Greg Brockman", role: "President · Chair", kept: false },
    { name: "Ilya Sutskever", role: "Chief Scientist", kept: false },
    { name: "Adam D'Angelo", role: "CEO, Quora", kept: true },
    { name: "Helen Toner", role: "Georgetown CSET", kept: false },
    { name: "Tasha McCauley", role: "RAND", kept: false },
  ];
  var after = [
    { name: "Bret Taylor", role: "Chair · ex-Salesforce co-CEO" },
    { name: "Larry Summers", role: "Former U.S. Treasury Secretary" },
    { name: "Adam D'Angelo", role: "CEO, Quora" },
  ];
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, marginBottom: 18 }}>The OpenAI Board · Before and After</div>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16,
      }}>
        <div>
          <div style={{ ...CAP, fontSize: 10, color: C.red, letterSpacing: "0.13em", marginBottom: 10 }}>
            BEFORE · FRI NOV 17
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {before.map(function (p) {
              return <div key={p.name} style={{
                padding: "10px 12px", background: C.card, borderRadius: 8,
                borderLeft: "2px solid " + (p.kept ? C.accent : C.red) + "a0",
                opacity: p.kept ? 1 : 0.62,
              }}>
                <div style={{
                  fontFamily: "var(--sans)", fontSize: 13, color: C.text, fontWeight: 600,
                  textDecoration: p.kept ? "none" : "line-through",
                  textDecorationColor: C.red + "80",
                }}>{p.name}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.muted }}>{p.role}</div>
              </div>;
            })}
          </div>
        </div>
        <div>
          <div style={{ ...CAP, fontSize: 10, color: C.accent, letterSpacing: "0.13em", marginBottom: 10 }}>
            AFTER · TUE NOV 21
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {after.map(function (p) {
              return <div key={p.name} style={{
                padding: "10px 12px", background: C.card, borderRadius: 8,
                borderLeft: "2px solid " + C.accent + "a0",
              }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.text, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.muted }}>{p.role}</div>
              </div>;
            })}
            <div style={{
              padding: "10px 12px", background: C.blue + "14", borderRadius: 8,
              borderLeft: "2px solid " + C.blue + "a0", marginTop: 4,
            }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: C.text, fontWeight: 600 }}>Microsoft</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: C.muted }}>Non-voting board observer (added Nov 29)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FadeIn>;
}

function Ch6() {
  return <section id="ch6" style={SEC}>
    <H2 num="06">One hundred and six hours that almost unmade OpenAI.</H2>

    <P>
      On Friday, November 17, 2023, at roughly 11:30 AM Pacific time, Sam Altman was in a Las Vegas hotel room when a Google Meet invite arrived from Ilya Sutskever. Half an hour earlier, the four independent directors of the OpenAI non-profit board — Sutskever, Adam D'Angelo (Quora), Helen Toner (Georgetown CSET), and Tasha McCauley (RAND) — had voted. They were a majority of the six-person board. Altman and Greg Brockman had not been told there would be a vote.
    </P>

    <P>
      At 12:00 PM, Sutskever told Altman he was being removed as CEO. At 12:19 PM, Sutskever sent Brockman a Google Meet link; at 12:23 PM he told him he was being removed from the board but could remain at the company. At 12:28 PM, Mira Murati was informed. At 12:30 PM — two minutes later — OpenAI published a blog post called "OpenAI announces leadership transition." Microsoft, the company's largest investor, was given roughly one minute of notice<Rf n={37} />.
    </P>

    <Quote by="OpenAI board statement, November 17, 2023">
      Mr. Altman's departure follows a deliberative review process by the board, which concluded that he was not consistently candid in his communications with the board, hindering its ability to exercise its responsibilities. The board no longer has confidence in his ability to continue leading OpenAI.
    </Quote>

    <P>
      What followed was either the most consequential corporate governance failure in Silicon Valley history, the most consequential corporate governance success, or both — depending on who you ask. What is not disputed is the timeline:
    </P>

    <Timeline106 />

    <Ed>
      Here is the under-appreciated fact. For roughly forty-eight hours, the board's firing held. Emmett Shear, the former CEO of Twitch, was appointed to replace Murati — she had tried to rehire Altman on Saturday, and the board had responded by replacing her too. Satya Nadella was preparing to absorb Altman, Brockman, and anyone else who wanted to come into a new Microsoft AI research subsidiary at full comp. By most reasonable reads of the December 2015 mission statement, the board had done exactly what the non-profit structure was built to let it do. And then, starting on Sunday afternoon, it lost anyway.
    </Ed>

    <P>
      The thing that broke it was the employee letter. On Monday morning, around 500 OpenAI employees — a number that climbed to 738 of roughly 770 by day's end — signed an open letter demanding the board resign and reinstate Altman, or they would follow him to Microsoft. The first two signatures belonged to Mira Murati and Brad Lightcap. Ilya Sutskever, who had personally executed the firing three days earlier, signed too<Rf n={38} />.
    </P>

    <P>
      Sutskever had also tweeted, at 5:15 AM Pacific that morning:
    </P>

    <Quote by="Ilya Sutskever, X, November 20, 2023">
      I deeply regret my participation in the board's actions. I never intended to harm OpenAI. I love everything we've built together and I will do everything I can to reunite the company.
    </Quote>

    <P>
      The Wall Street Journal's Deepa Seetharaman later reported that Sutskever's flip had been catalyzed by a conversation with Anna Brockman — Greg's wife, whose civil ceremony Sutskever had officiated at the OpenAI office in 2019 — who "cried and pleaded" with him to reverse course<Rf n={39} />.
    </P>

    <P>
      Monday afternoon, Nadella went on Bloomberg and then CNBC. The line he hit in every interview was designed for two audiences at once — the board of OpenAI, and the rest of Microsoft's partners:
    </P>

    <Quote by="Satya Nadella, Bloomberg, November 20, 2023">
      Surprises are bad. One thing I'll be very, very clear: we're never going to get back into a situation where we get surprised like this, ever again.
    </Quote>

    <P>
      At approximately 10 PM Pacific on Tuesday, November 21, OpenAI's corporate X account posted:
    </P>

    <Quote>
      We have reached an agreement in principle for Sam Altman to return to OpenAI as CEO with a new initial board of Bret Taylor (Chair), Larry Summers, and Adam D'Angelo.
    </Quote>

    <BoardCompare />

    <P>
      The new board was three seats, not six. Three of the four independent directors who had voted Altman out were gone. Adam D'Angelo, the only director on both sides of the weekend, remained. Bret Taylor, former co-CEO of Salesforce and chair of Twitter's board through the Musk acquisition, took the chair. Larry Summers, former Treasury Secretary and former Harvard president, took the third seat. Eight days later, Microsoft was given a non-voting observer seat<Rf n={40} />.
    </P>

    <P>
      From Sutskever's Google Meet link on Friday noon to the OpenAI tweet on Tuesday night was roughly 106 hours. In that window the board fired the CEO, watched an interim CEO defect, watched a second interim CEO arrive, watched the employees revolt, watched the largest investor prepare a parallel absorption, and watched a member of its own firing majority publicly regret the firing. By the end of the weekend, the board was gone and the CEO was back. The non-profit's formal authority over the for-profit subsidiary was, in every way except the legal one, finished.
    </P>
  </section>;
}

function Lessons() {
  var items = [
    {
      n: "01",
      title: "The structure is the story.",
      body: "A non-profit parent controlling a capped-profit subsidiary sounds like a compromise. In practice it is a gun you have built and handed to yourself. When the two halves disagree, there is no neutral arbitrator — only board votes, employee sentiment, and investor pressure. Design governance like it will be tested.",
    },
    {
      n: "02",
      title: "Mission capital and growth capital are different currencies.",
      body: "OpenAI raised $130M on mission between 2015 and 2019. Then it raised roughly $13B on growth in the four years after. The first kind comes with patience and narrative; the second comes with expectations. You do not get to choose — the work chooses for you.",
    },
    {
      n: "03",
      title: "Scaling laws are a strategy, not a law of nature.",
      body: "The Kaplan paper made it rational to bet the company on bigger models. It also made it rational to leave and build smaller ones more carefully. Both were correct readings of the same evidence. When technical reality forces a fork, the people most committed to the mission end up on both sides of it.",
    },
    {
      n: "04",
      title: "Legal authority is not the same as social authority.",
      body: "The November 2023 board had the votes. It did not have Mira Murati, 738 engineers, or Satya Nadella. Organizations obey the leader employees believe in, not the one the bylaws describe. If you are relying on paper authority to win a fight inside your own company, you have already lost.",
    },
    {
      n: "05",
      title: "Always phone the investor first.",
      body: "Microsoft got roughly one minute of notice before the firing was public. What broke the board's position on Monday was the parallel Microsoft AI team Nadella announced at 11 PM Sunday. If you need the people who write the checks to stay on your side, let them be on your side before the fight is public.",
    },
    {
      n: "06",
      title: "The mission statement does not negotiate with the market.",
      body: "You can commit to build AGI for humanity. You can cap profits at 100×. But once the product is running the fastest-growing consumer ramp in history, the market starts writing its own documents for you — and the question is not whether they arrive, but how many of the originals they replace before you notice.",
    },
  ];
  return <FadeIn>
    <div style={{ display: "grid", gap: 14, margin: "6px 0 34px" }}>
      {items.map(function (it) {
        return <div key={it.n} style={{
          background: C.surface, border: "1px solid " + C.border,
          borderRadius: 12, padding: "20px 22px 22px",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 10 }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11, color: C.accent,
              letterSpacing: "0.12em", fontWeight: 700,
            }}>{it.n}</div>
            <div style={{
              fontFamily: "var(--display)", fontSize: 22, color: C.text,
              fontWeight: 700, lineHeight: 1.22,
            }}>{it.title}</div>
          </div>
          <div style={{
            fontFamily: "var(--serif)", fontSize: 16, color: C.dim,
            lineHeight: 1.72, paddingLeft: 32,
          }}>{it.body}</div>
        </div>;
      })}
    </div>
  </FadeIn>;
}

function Ch7() {
  return <section id="ch7" style={SEC}>
    <H2 num="07">The playbook the story left behind.</H2>

    <P>
      What do you take from eight years of OpenAI? A handful of lessons the record is unusually clear about.
    </P>

    <Lessons />

    <P>
      The last thing to say is the one the story itself never quite articulates, because the story is still happening. When the non-profit board fired its CEO in November 2023, it was doing precisely what the 2015 founding documents had built it to do: stop the for-profit if the for-profit moved in a direction the mission could not defend. The board tried to exercise that power. It had the legal authority. It had the votes. And it found out, over 106 hours, that legal authority — without employee loyalty, without investor alignment, without a coherent public explanation — is not the thing it sounds like.
    </P>

    <P>
      After the weekend, OpenAI kept shipping. GPT-4 Turbo. Sora. GPT-4o. The $157 billion valuation. The moves toward a conventional for-profit structure. The December 2015 mission statement is still on the website. Whether it is still load-bearing is a different question. That is the next chapter. And it has not been written yet.
    </P>
  </section>;
}

function Sources() {
  var srcs = [
    { n: 1, t: "Musk at MIT Aeronautics Centennial, Oct 24, 2014", u: "https://www.washingtonpost.com/news/innovations/wp/2014/10/24/elon-musk-with-artificial-intelligence-we-are-summoning-the-demon/" },
    { n: 2, t: "Google acquires DeepMind, Jan 2014", u: "https://en.wikipedia.org/wiki/DeepMind" },
    { n: 3, t: "Isaacson, Elon Musk (2023): the Larry Page argument", u: "https://time.com/6310076/elon-musk-ai-walter-isaacson-biography/" },
    { n: 4, t: "The Rosewood Sand Hill dinner, summer 2015", u: "https://www.semafor.com/article/03/24/2023/the-secret-history-of-elon-musk-sam-altman-and-openai" },
    { n: 5, t: "Greg Brockman, \"#define CTO OpenAI\"", u: "https://blog.gregbrockman.com/define-cto-openai" },
    { n: 6, t: "OpenAI launch announcement, Dec 11, 2015", u: "https://openai.com/index/introducing-openai/" },
    { n: 7, t: "OpenAI LP announcement, Mar 11, 2019", u: "https://techcrunch.com/2019/03/11/openai-shifts-from-nonprofit-to-capped-profit-to-attract-capital/" },
    { n: 8, t: "OpenAI response to Musk lawsuit, Mar 2024", u: "https://techcrunch.com/2024/03/05/openai-response-elon-musk-lawsuit/" },
    { n: 9, t: "OpenAI Gym, Apr 27, 2016", u: "https://openai.com/index/openai-gym-beta/" },
    { n: 10, t: "OpenAI Five defeats Dota 2 world champions, Apr 2019", u: "https://openai.com/index/openai-five-defeats-dota-2-world-champions/" },
    { n: 11, t: "Radford et al., GPT-1 paper, Jun 2018", u: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
    { n: 12, t: "OpenAI: Musk lawsuit emails, disclosed Mar 2024", u: "https://www.cnbc.com/2024/03/06/openai-shares-elon-musk-emails-urging-startup-to-raise-1-billion-see-tesla-as-a-cash-cow.html" },
    { n: 13, t: "Musk departs OpenAI board, Feb 21, 2018", u: "https://www.cnbc.com/2018/02/21/elon-musk-is-leaving-the-board-of-openai.html" },
    { n: 14, t: "Semafor: The secret history of Musk, Altman, and OpenAI", u: "https://www.semafor.com/article/03/24/2023/the-secret-history-of-elon-musk-sam-altman-and-openai" },
    { n: 15, t: "OpenAI Charter, Apr 9, 2018", u: "https://openai.com/charter/" },
    { n: 16, t: "Kaplan et al., Scaling Laws paper, Jan 2020", u: "https://arxiv.org/abs/2001.08361" },
    { n: 17, t: "Brockman and Sutskever, OpenAI LP post, Mar 2019", u: "https://openai.com/index/openai-lp/" },
    { n: 18, t: "Altman steps down as YC president, Mar 2019", u: "https://techcrunch.com/2019/03/08/y-combinator-president-sam-altman-is-stepping-down-amid-a-series-of-changes-at-the-accelerator/" },
    { n: 19, t: "Microsoft invests $1B in OpenAI, Jul 22, 2019", u: "https://news.microsoft.com/source/2019/07/22/openai-forms-exclusive-computing-partnership-with-microsoft-to-build-new-azure-ai-supercomputing-technologies/" },
    { n: 20, t: "Nadella on Gates's reaction to the 2019 deal", u: "https://fortune.com/2025/10/30/microsoft-ceo-satya-nadella-bill-gates-openai-investment-burn-billion-dollars/" },
    { n: 21, t: "Karen Hao, MIT Tech Review, Feb 17, 2020", u: "https://www.technologyreview.com/2020/02/17/844721/ai-openai-moonshot-elon-musk-sam-altman-greg-brockman-messy-secretive-reality/" },
    { n: 22, t: "Brown et al., GPT-3 paper, May 2020", u: "https://arxiv.org/abs/2005.14165" },
    { n: 23, t: "Lambda Labs estimate of GPT-3 training cost", u: "https://lambda.ai/blog/demystifying-gpt-3" },
    { n: 24, t: "Microsoft's exclusive GPT-3 license, Sep 2020", u: "https://blogs.microsoft.com/blog/2020/09/22/microsoft-teams-up-with-openai-to-exclusively-license-gpt-3-language-model/" },
    { n: 25, t: "Anthropic Series A, May 2021", u: "https://www.anthropic.com/news/anthropic-raises-124-million-to-build-more-reliable-general-ai-systems" },
    { n: 26, t: "Anthropic Series B led by SBF, Apr 2022", u: "https://www.anthropic.com/news/anthropic-raises-series-b-to-build-safe-reliable-ai" },
    { n: 27, t: "OpenAI: Introducing ChatGPT, Nov 30, 2022", u: "https://openai.com/index/chatgpt/" },
    { n: 28, t: "UBS: ChatGPT reached 100M MAU, Jan 2023", u: "https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/" },
    { n: 29, t: "Microsoft-OpenAI extension, Jan 23, 2023", u: "https://blogs.microsoft.com/blog/2023/01/23/microsoftandopenaiextendpartnership/" },
    { n: 30, t: "Semafor: $10B Microsoft investment, Jan 9, 2023", u: "https://www.semafor.com/article/01/09/2023/microsoft-eyes-10-billion-bet-on-chatgpt" },
    { n: 31, t: "GPT-4 released, Mar 14, 2023", u: "https://techcrunch.com/2023/03/14/openai-releases-gpt-4-ai-that-it-claims-is-state-of-the-art/" },
    { n: 32, t: "Bubeck et al., Sparks of AGI, MSR, Mar 2023", u: "https://arxiv.org/abs/2303.12712" },
    { n: 33, t: "FLI, Pause Giant AI Experiments, Mar 22, 2023", u: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/" },
    { n: 34, t: "Altman's world tour, May — Jun 2023", u: "https://foreignpolicy.com/2023/06/20/openai-ceo-diplomacy-artificial-intelligence/" },
    { n: 35, t: "OpenAI Superalignment team, Jul 5, 2023", u: "https://openai.com/index/introducing-superalignment/" },
    { n: 36, t: "Toner et al., Decoding Intentions, CSET, Oct 2023", u: "https://cset.georgetown.edu/wp-content/uploads/CSET-Decoding-Intentions.pdf" },
    { n: 37, t: "Brockman's timeline of the firing, X, Nov 17, 2023", u: "https://twitter.com/gdb/status/1725736242137182594" },
    { n: 38, t: "OpenAI employee letter: 738 of 770 signatures", u: "https://www.cnn.com/2023/11/20/tech/openai-employees-quit-mira-murati-sam-altman/index.html" },
    { n: 39, t: "Seetharaman (WSJ): Anna Brockman and Sutskever", u: "https://x.com/dseetharaman/status/1726756503779254673" },
    { n: 40, t: "Microsoft board observer seat, Nov 29, 2023", u: "https://techcrunch.com/2023/11/29/sam-altmans-officially-back-at-openai-and-the-board-gains-a-microsoft-observer/" },
  ];
  return <section id="sources" style={{ ...SEC, padding: "80px 24px 30px" }}>
    <H2 label="APPENDIX">Sources, corrections, methodology.</H2>
    <P>
      Every factual claim carries a superscript reference. Where reports conflicted, we sided with the most recent first-person disclosure — OpenAI's March 2024 posts about Musk, Helen Toner's May 2024 TED AI Show interview, Greg Brockman's real-time X thread on the night of the firing.
    </P>
    <div style={{ ...BOX, padding: "18px 14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {srcs.map(function (s) {
          return <a key={s.n} href={s.u} target="_blank" rel="noreferrer" style={{
            display: "flex", gap: 14, padding: "10px 12px", borderRadius: 6,
            textDecoration: "none", alignItems: "baseline",
            borderLeft: "2px solid " + C.border,
            transition: "border-color 0.18s, background 0.18s",
          }}
            onMouseEnter={function (e) {
              e.currentTarget.style.borderLeftColor = C.accent;
              e.currentTarget.style.background = C.cardH;
            }}
            onMouseLeave={function (e) {
              e.currentTarget.style.borderLeftColor = C.border;
              e.currentTarget.style.background = "transparent";
            }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, color: C.accent,
              fontWeight: 700, minWidth: 28,
            }}>{"[" + s.n + "]"}</div>
            <div style={{
              fontFamily: "var(--serif)", fontSize: 14, color: C.dim,
              lineHeight: 1.55, flex: 1,
            }}>{s.t}</div>
          </a>;
        })}
      </div>
    </div>

    <div style={BOX}>
      <div style={{ ...CAP, color: C.gold, marginBottom: 14 }}>Corrections Applied During Fact-Check</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{
          fontFamily: "var(--serif)", fontSize: 14, color: C.dim,
          lineHeight: 1.68, paddingLeft: 16, borderLeft: "2px solid " + C.gold + "80",
        }}>
          <strong style={{ color: C.text }}>$1 billion pledge vs actual delivered.</strong> Early drafts repeated the $1B founding number without flagging how much of it was ever delivered. OpenAI's March 2024 disclosures put total funding raised pre-LP at roughly $130M, with Musk personally contributing less than $45M. Corrected throughout.
        </div>
        <div style={{
          fontFamily: "var(--serif)", fontSize: 14, color: C.dim,
          lineHeight: 1.68, paddingLeft: 16, borderLeft: "2px solid " + C.gold + "80",
        }}>
          <strong style={{ color: C.text }}>Microsoft profit-sharing terms.</strong> Circulating summaries describe a "49% revenue share." Per Semafor's January 2023 reporting: Microsoft receives 75% of <em>profits</em> (not revenue) until recoupment, after which the equity split flips to roughly 49% / 49% / 2% (Microsoft / other investors / non-profit). Corrected.
        </div>
        <div style={{
          fontFamily: "var(--serif)", fontSize: 14, color: C.dim,
          lineHeight: 1.68, paddingLeft: 16, borderLeft: "2px solid " + C.gold + "80",
        }}>
          <strong style={{ color: C.text }}>"100 million users in two months."</strong> A UBS estimate using SimilarWeb traffic data, not a figure OpenAI has ever officially published. Attributed in the chart caption.
        </div>
      </div>
    </div>

    <div style={{
      fontFamily: "var(--mono)", fontSize: 11, color: C.muted,
      letterSpacing: "0.1em", lineHeight: 1.7, paddingTop: 24,
      borderTop: "1px solid " + C.faint, marginTop: 30, textTransform: "uppercase",
    }}>THE MISSION CONTINUES. · built with react + recharts · fact-checked against primary sources</div>
  </section>;
}

export default function OpenAiOrigin() {
  var [activeChapter, setActiveChapter] = useState("ch0");
  var [showNav, setShowNav] = useState(false);
  var rafRef = useRef(null);
  var lastRef = useRef("ch0");

  useEffect(function () {
    var onScroll = function () {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(function () {
        rafRef.current = null;
        setShowNav(window.scrollY > window.innerHeight * 0.7);

        var found = chapters[0].id;
        for (var i = chapters.length - 1; i >= 0; i--) {
          var el = document.getElementById(chapters[i].id);
          if (el && el.getBoundingClientRect().top < 160) {
            found = chapters[i].id;
            break;
          }
        }
        if (found !== lastRef.current) {
          lastRef.current = found;
          setActiveChapter(found);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return function () {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <div className="research-root-oa" style={{
    background: C.bg, color: C.text, minHeight: "100vh",
    fontFamily: "var(--serif)",
  }}>
    <Link to="/projects" aria-label="Back to projects" style={{
      position: "fixed",
      top: "max(14px, env(safe-area-inset-top))",
      left: 14, zIndex: 200,
      opacity: showNav ? 0 : 1,
      pointerEvents: showNav ? "none" : "auto",
      transform: showNav ? "translateY(-8px)" : "translateY(0)",
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "9px 14px",
      background: "rgba(6,8,16,0.82)",
      backdropFilter: "blur(14px) saturate(1.6)",
      WebkitBackdropFilter: "blur(14px) saturate(1.6)",
      border: "1px solid " + C.faint,
      borderRadius: 999,
      color: C.dim, fontFamily: "var(--mono)", fontSize: 11,
      fontWeight: 500, textDecoration: "none", letterSpacing: "0.03em",
      transition: "color 0.2s, border-color 0.2s, background 0.2s, opacity 0.3s, transform 0.3s",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    }} onMouseEnter={function (e) { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent + "80"; }}
      onMouseLeave={function (e) { e.currentTarget.style.color = C.dim; e.currentTarget.style.borderColor = C.faint; }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>{"\u2190"}</span>
      <span className="back-btn-label">Back</span>
    </Link>
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap');"}</style>
    <style>{":root{--display:'Playfair Display',Georgia,serif;--serif:'Source Serif 4',Georgia,serif;--sans:'Outfit',system-ui,sans-serif;--mono:'IBM Plex Mono',Menlo,monospace}body{margin:0;background:#060810}*{box-sizing:border-box}.research-root-oa ::-webkit-scrollbar{width:10px}.research-root-oa ::-webkit-scrollbar-track{background:" + C.bg + "}.research-root-oa ::-webkit-scrollbar-thumb{background:" + C.faint + ";border-radius:5px}"}</style>
    <style>{"@media (min-width:1024px){.research-root-oa a[aria-label=\"Back to projects\"]{top:22px!important;left:22px!important;padding:10px 16px!important;font-size:12px!important;gap:8px!important}.research-root-oa a[aria-label=\"Back to projects\"] span:first-child{font-size:15px!important}.research-root-oa .back-btn-label::after{content:\" to projects\"}}"}</style>

    <NavBar active={activeChapter} show={showNav} />
    <Hero />
    <Ch0 />
    <Ch1 />
    <Ch2 />
    <Ch3 />
    <Ch4 />
    <Ch5 />
    <Ch6 />
    <Ch7 />
    <Sources />
  </div>;
}
