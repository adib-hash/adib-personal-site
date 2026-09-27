import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo";
import ResearchFooter from "../../components/ResearchFooter";

// "The reading app only I would build": an essay on building Kitab with AI.
// Recordings are the real app running on a demo library (placeholder covers,
// public-domain highlights); GIFs live in public/demo-gifs/kitab-build/.

const MEDIA = "/demo-gifs/kitab-build";

const SHELF = [
  "dune", "meditations", "the-count-of-monte-cristo", "piranesi", "project-hail-mary",
  "the-muqaddimah", "walden", "the-brothers-karamazov", "middlemarch",
];

const CHAPTERS = [
  { id: "kb-feet-wet", num: "I", title: "Getting my feet wet" },
  { id: "kb-why", num: "II", title: "Why a reading app" },
  { id: "kb-v1", num: "III", title: "Version one" },
  { id: "kb-llm", num: "IV", title: "Letting the LLM in" },
  { id: "kb-opinionated", num: "V", title: "Opinionated software" },
  { id: "kb-native", num: "VI", title: "Going native" },
  { id: "kb-bakeoffs", num: "VII", title: "Choosing tools by running bake-offs" },
  { id: "kb-taught", num: "VIII", title: "What building it taught me" },
  { id: "kb-today", num: "IX", title: "Where it is today" },
];

// Reading progress (0-1) and the chapter currently under the top bar.
function useReading() {
  const [state, setState] = useState({ progress: 0, active: null });
  useEffect(() => {
    let frame = 0;
    function measure() {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      let active = null;
      for (const ch of CHAPTERS) {
        const el = document.getElementById(ch.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) active = ch.id;
      }
      setState((s) => (s.active === active && Math.abs(s.progress - progress) < 0.002 ? s : { progress, active }));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return state;
}

function Phone({ gif, alt }) {
  return (
    <div className="kb-phone">
      <img src={`${MEDIA}/${gif}.gif`} alt={alt} width="390" height="844" loading="lazy" decoding="async" />
    </div>
  );
}

function Caption({ n, title, children }) {
  return (
    <figcaption>
      <span className="kb-fig-n">Fig. {n}</span>
      <span className="kb-fig-title">{title}</span>
      <span className="kb-fig-text">{children}</span>
    </figcaption>
  );
}

// One recording with its caption beside it (below it on phones).
function Figure({ n, gif, alt, title, children }) {
  return (
    <figure className="kb-stage kb-stage-single">
      <Phone gif={gif} alt={alt} />
      <Caption n={n} title={title}>{children}</Caption>
    </figure>
  );
}

// Two recordings side by side, each captioned underneath.
function FigurePair({ items }) {
  return (
    <div className="kb-stage kb-stage-pair">
      {items.map((it) => (
        <figure key={it.gif}>
          <Phone gif={it.gif} alt={it.alt} />
          <Caption n={it.n} title={it.title}>{it.text}</Caption>
        </figure>
      ))}
    </div>
  );
}

function Chapter({ ch, children }) {
  return (
    <section className="kb-chapter" id={ch.id} aria-labelledby={`${ch.id}-h`}>
      <div className="kb-measure">
        <p className="kb-eyebrow">Chapter {ch.num}</p>
        <h2 id={`${ch.id}-h`}>{ch.title}</h2>
      </div>
      {children}
    </section>
  );
}

const M = ({ children }) => <div className="kb-measure">{children}</div>;

const CSS = `
.kb-root {
  color-scheme: light;
  --bg: #FAF7F2;
  --stage: #F1EADF;
  --stage-edge: #E4D9CB;
  --rule: #E3D8CA;
  --ink: #1C1917;
  --text: #2A2521;
  --ink-soft: #57534E;
  --muted: #7A736C;
  --accent: #0F766E;
  --bezel: #16120F;
  --bezel-ring: #3A332D;
  --phone-shadow: 0 1px 2px rgba(28,25,23,.10), 0 24px 48px -24px rgba(28,25,23,.45);
  --display: 'Playfair Display', 'Iowan Old Style', Georgia, serif;
  --body: 'EB Garamond', 'Iowan Old Style', Palatino, Georgia, serif;
  --ui: 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --bar-h: 52px;
  /* variables ResearchFooter reads */
  --text-heading: var(--ink);
  --text-muted: var(--muted);
  --border: var(--rule);
  --font-mono: var(--ui);
  --font-sans: var(--ui);
  --font-serif: var(--display);

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--body);
  font-size: 1.3125rem;
  line-height: 1.58;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-kerning: normal;
}
@media (prefers-color-scheme: dark) {
  .kb-root {
    color-scheme: dark;
    --bg: #161311;
    --stage: #201C19;
    --stage-edge: #2E2824;
    --rule: #2F2925;
    --ink: #F5EFE6;
    --text: #E4DDD3;
    --ink-soft: #C9C1B7;
    --muted: #9C948B;
    --accent: #3CCFBC;
    --bezel: #050404;
    --bezel-ring: #4A423B;
    --phone-shadow: 0 1px 2px rgba(0,0,0,.5), 0 24px 48px -20px rgba(0,0,0,.85);
  }
}
.kb-root *, .kb-root *::before, .kb-root *::after { box-sizing: border-box; }
.kb-root ::selection { background: color-mix(in srgb, var(--accent) 30%, transparent); }

/* ---------- top bar with reading progress ---------- */
.kb-bar {
  position: sticky; top: 0; z-index: 50;
  height: calc(var(--bar-h) + env(safe-area-inset-top, 0px));
  padding: env(safe-area-inset-top, 0px) 20px 0;
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 16px;
  background: var(--bg);
  border-bottom: 1px solid var(--rule);
  font-family: var(--ui); font-size: 13px;
}
.kb-bar a.kb-backlink {
  display: inline-flex; align-items: center; gap: 6px; color: var(--ink-soft); text-decoration: none;
  font-weight: 500; padding: 6px 10px 6px 6px; margin-left: -6px; border-radius: 8px;
}
.kb-bar a.kb-backlink:hover, .kb-bar a.kb-backlink:focus-visible { color: var(--accent); }
.kb-bar-title { text-align: center; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.kb-bar-title b { color: var(--ink); font-weight: 600; }
.kb-bar-part { color: var(--muted); letter-spacing: .12em; text-transform: uppercase; font-size: 11px; font-weight: 600; }
.kb-progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: transparent; }
.kb-progress span { display: block; height: 100%; background: var(--accent); transform-origin: left; }

/* ---------- chapter rail (wide screens) ---------- */
.kb-rail { display: none; }
@media (min-width: 1320px) {
  .kb-rail {
    display: block; position: fixed; top: calc(var(--bar-h) + 56px);
    left: max(32px, calc(50vw - 22rem - 260px)); width: 200px;
    font-family: var(--ui); font-size: 13px; line-height: 1.35;
  }
  .kb-rail p { margin: 0 0 12px; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); font-weight: 600; }
  .kb-rail ol { list-style: none; margin: 0; padding: 0; border-left: 1px solid var(--rule); }
  .kb-rail a {
    display: grid; grid-template-columns: 30px 1fr; padding: 6px 0 6px 14px; margin-left: -1px;
    border-left: 2px solid transparent; color: var(--muted); text-decoration: none; transition: color .2s, border-color .2s;
  }
  .kb-rail a span:first-child { font-variant-numeric: tabular-nums; opacity: .8; }
  .kb-rail a:hover { color: var(--ink); }
  .kb-rail a[aria-current="true"] { color: var(--ink); border-left-color: var(--accent); }
}

/* ---------- column ---------- */
.kb-page { padding: 0 20px; }
.kb-measure { max-width: 35rem; margin-inline: auto; }
.kb-article { padding-bottom: 32px; }

/* ---------- hero ---------- */
.kb-hero { padding-top: 64px; }
.kb-kicker { font-family: var(--ui); font-size: 12px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); margin: 0 0 18px; }
.kb-root h1 {
  font-family: var(--display); font-weight: 700; color: var(--ink);
  font-size: clamp(2.5rem, 6.2vw, 4rem); line-height: 1.03; letter-spacing: -.02em;
  margin: 0 0 18px; text-wrap: balance;
}
.kb-dek { font-family: var(--body); font-style: italic; font-size: 1.5rem; line-height: 1.35; color: var(--ink-soft); margin: 0 0 22px; text-wrap: balance; }
.kb-byline { font-family: var(--ui); font-size: 14px; color: var(--muted); display: flex; flex-wrap: wrap; gap: 4px 0; margin: 0; }
.kb-byline span:not(:last-child)::after { content: "·"; margin: 0 10px; opacity: .7; }

.kb-shelf { margin: 44px 0 0; }
.kb-shelf-row { display: flex; align-items: flex-end; gap: 5px; padding: 0 6px; }
.kb-shelf-row img {
  flex: 1 1 0; min-width: 0; aspect-ratio: 2 / 3; height: auto; object-fit: cover;
  border-radius: 2px 3px 3px 2px; box-shadow: 1px 2px 6px rgba(0,0,0,.22), inset 2px 0 0 rgba(255,255,255,.12);
}
.kb-shelf-row img:nth-child(3n+2) { flex-grow: .9; }
.kb-shelf-row img:nth-child(4n) { flex-grow: 1.1; }
.kb-shelf-ledge { height: 8px; border-radius: 2px; background: linear-gradient(var(--stage-edge), var(--stage)); box-shadow: 0 6px 14px -8px rgba(0,0,0,.35); }
.kb-demo-note { font-family: var(--ui); font-size: 13px; line-height: 1.55; color: var(--muted); margin: 18px 0 0; }

/* ---------- prose ---------- */
.kb-root p { margin: 0 0 1.05em; }
.kb-root strong { font-weight: 600; color: var(--ink); }
.kb-root code { font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: .78em; background: var(--stage); border: 1px solid var(--stage-edge); padding: 1px 5px; border-radius: 5px; }
.kb-root .kb-lede { font-family: var(--display); font-style: italic; font-weight: 500; color: var(--ink); font-size: 1.65rem; line-height: 1.3; margin: 56px 0 24px; text-wrap: balance; }
.kb-chapter { margin-top: 88px; scroll-margin-top: calc(var(--bar-h) + 24px); }
.kb-root .kb-eyebrow { font-family: var(--ui); font-size: 12px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); margin: 0 0 10px; }
.kb-root h2 { font-family: var(--display); font-weight: 600; color: var(--ink); font-size: clamp(1.8rem, 3.6vw, 2.35rem); line-height: 1.12; letter-spacing: -.01em; margin: 0 0 24px; text-wrap: balance; }

.kb-list { list-style: none; padding: 0; margin: 0 0 1.2em; display: grid; gap: 14px; }
.kb-list li { padding-left: 24px; position: relative; }
.kb-list li::before { content: ""; position: absolute; left: 3px; top: .66em; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }

.kb-pull { margin: 56px auto; max-width: 35rem; padding: 4px 0 4px 24px; border-left: 3px solid var(--accent); }
.kb-root .kb-pull p { font-family: var(--display); font-style: italic; font-weight: 500; color: var(--ink); font-size: clamp(1.45rem, 3vw, 1.85rem); line-height: 1.28; margin: 0; text-wrap: balance; }

/* ---------- figures ---------- */
.kb-stage {
  max-width: 46rem; margin: 48px auto 52px; padding: 40px;
  background: var(--stage); border: 1px solid var(--stage-edge); border-radius: 24px;
}
.kb-stage figure { margin: 0; }
.kb-stage-single { display: grid; grid-template-columns: 250px 1fr; gap: 44px; align-items: center; }
.kb-stage-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.kb-stage-pair figure { display: grid; gap: 22px; align-content: start; justify-items: center; }
.kb-stage-pair figcaption { max-width: 17.5rem; }
.kb-phone {
  width: 100%; max-width: 250px; background: var(--bezel); border-radius: 40px; padding: 9px;
  box-shadow: var(--phone-shadow), inset 0 0 0 1.5px var(--bezel-ring);
}
.kb-phone img { display: block; width: 100%; height: auto; aspect-ratio: 390 / 844; object-fit: cover; border-radius: 31px; background: #1c1917; }
.kb-root figcaption { font-family: var(--ui); font-size: 15px; line-height: 1.55; color: var(--ink-soft); display: grid; gap: 6px; }
.kb-fig-n { font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
.kb-fig-title { font-family: var(--display); font-size: 1.3rem; font-weight: 600; color: var(--ink); line-height: 1.2; }

/* ---------- numbers ---------- */
.kb-nums { display: grid; grid-template-columns: repeat(3, 1fr); margin: 32px 0 36px; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
.kb-nums > div { padding: 20px 18px 18px 0; }
.kb-nums > div + div { padding-left: 18px; border-left: 1px solid var(--rule); }
.kb-num { font-family: var(--display); font-weight: 600; color: var(--ink); font-size: 2.1rem; line-height: 1; font-variant-numeric: lining-nums tabular-nums; }
.kb-num-lbl { font-family: var(--ui); font-size: 13px; line-height: 1.45; color: var(--muted); margin-top: 10px; }
.kb-colophon { margin-top: 64px; }
.kb-colophon h3 { font-family: var(--ui); font-size: 12px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); margin: 0; }
.kb-colophon .kb-nums { grid-template-columns: repeat(4, 1fr); margin-top: 14px; }
.kb-colophon .kb-num { color: var(--accent); }

.kb-root .research-footer { max-width: 46rem; margin: 80px auto 0; padding-bottom: 72px; }

/* ---------- tablet ---------- */
@media (max-width: 820px) {
  .kb-stage { padding: 32px 28px; }
  .kb-stage-single { grid-template-columns: 220px 1fr; gap: 32px; }
  .kb-stage-pair { gap: 28px; }
}

/* ---------- phone ---------- */
@media (max-width: 640px) {
  .kb-root { font-size: 1.1875rem; line-height: 1.6; }
  .kb-page { padding: 0 18px; }
  .kb-bar { padding-inline: 14px; grid-template-columns: auto 1fr; }
  .kb-bar-part { display: none; }
  .kb-bar-title { text-align: right; font-size: 12px; }
  .kb-hero { padding-top: 40px; }
  .kb-dek { font-size: 1.3rem; }
  .kb-byline { font-size: 13px; }
  .kb-shelf { margin-top: 32px; }
  .kb-shelf-row { gap: 3px; padding: 0 4px; }
  .kb-root .kb-lede { font-size: 1.45rem; margin-top: 44px; }
  .kb-chapter { margin-top: 68px; }
  .kb-stage { margin: 36px -4px 40px; padding: 28px 20px 26px; border-radius: 20px; }
  .kb-stage-single, .kb-stage-pair { grid-template-columns: 1fr; gap: 22px; justify-items: center; }
  .kb-stage-pair { gap: 40px; }
  .kb-stage-pair figure + figure { padding-top: 36px; border-top: 1px solid var(--stage-edge); width: 100%; }
  .kb-phone { max-width: 236px; border-radius: 38px; }
  .kb-phone img { border-radius: 29px; }
  .kb-root figcaption { font-size: 14.5px; max-width: 21rem; text-align: left; justify-self: stretch; }
  .kb-fig-title { font-size: 1.2rem; }
  .kb-nums { grid-template-columns: 1fr; }
  .kb-nums > div { padding: 16px 0; }
  .kb-nums > div + div { padding-left: 0; border-left: 0; border-top: 1px solid var(--rule); }
  .kb-colophon .kb-nums { grid-template-columns: 1fr 1fr; }
  .kb-colophon .kb-nums > div { padding: 16px 12px 16px 0; border-top: 0; }
  .kb-colophon .kb-nums > div:nth-child(even) { padding-left: 16px; border-left: 1px solid var(--rule); }
  .kb-colophon .kb-nums > div:nth-child(n+3) { border-top: 1px solid var(--rule); }
  .kb-pull { margin: 44px auto; padding-left: 18px; }
  .kb-root .research-footer { margin-top: 64px; }
}

@media (prefers-reduced-motion: reduce) {
  .kb-rail a { transition: none; }
}
`;

export default function KitabBuild() {
  const { progress, active } = useReading();
  const activeCh = CHAPTERS.find((c) => c.id === active);

  return (
    <div className="kb-root">
      <Seo
        title="The Reading App Only I Would Build — Adib Choudhury"
        description="Part one of building Kitab, my personal reading app, with AI: from a frog Pong game to a native iOS app with Kindle sync, Elo rankings and LLM recommendations."
      />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      <style>{CSS}</style>

      <header className="kb-bar">
        <Link to="/research" className="kb-backlink">
          <span aria-hidden="true">&larr;</span> Research
        </Link>
        <div className="kb-bar-title">
          {activeCh ? <><b>{activeCh.num}.</b> {activeCh.title}</> : <b>The reading app only I would build</b>}
        </div>
        <span className="kb-bar-part">Part one</span>
        <div className="kb-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      <nav className="kb-rail" aria-label="Chapters">
        <p>Chapters</p>
        <ol>
          {CHAPTERS.map((ch) => (
            <li key={ch.id}>
              <a href={`#${ch.id}`} aria-current={active === ch.id ? "true" : undefined}
                onClick={(e) => { e.preventDefault(); document.getElementById(ch.id)?.scrollIntoView({ behavior: "smooth" }); }}>
                <span>{ch.num}</span><span>{ch.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <main className="kb-page">
        <article className="kb-article">
          <header className="kb-hero kb-measure">
            <p className="kb-kicker">Kitab · Building with AI</p>
            <h1>The reading app only I would build</h1>
            <p className="kb-dek">Part one of what I've learned building Kitab with AI</p>
            <p className="kb-byline"><span>Adib Choudhury</span><span>September 2026</span><span>12 min read</span></p>
            <div className="kb-shelf" aria-hidden="true">
              <div className="kb-shelf-row">
                {SHELF.map((s) => <img key={s} src={`${MEDIA}/cover-${s}.jpg`} alt="" width="150" height="225" />)}
              </div>
              <div className="kb-shelf-ledge" />
            </div>
            <p className="kb-demo-note">The screen recordings in this post are the real app running on a demo library with placeholder covers, so you can see how it moves without seeing my actual shelves.</p>
          </header>

          <M>
            <p className="kb-lede">The moment it clicked for me involved two frogs and a fly.</p>
            <p>Sometime in the back half of 2025, I was a casual, daily user of ChatGPT and Gemini. I'd throw a CSV at them for some basic analysis, test how smart the newest model had gotten, play with image generation when it came out. Useful, fun, and not especially productive. I hadn't built anything.</p>
            <p>Then, mostly for kicks, I asked one of Gemini's new Flash models to build me a video game: Pong, but with a frog at each end and a fly for the ball. It built it almost instantly. It was playable, it had a menu, it had music, and it ran right there in the browser window. I was floored. A year earlier these tools were a conversational toy that hallucinated half the time, and now one had written a working interactive app from a single sentence.</p>
            <p>This post is about what happened after that, told through one app: <strong>Kitab</strong>, the reading tracker I've been building and using every day for the last six months.</p>
          </M>

          <Chapter ch={CHAPTERS[0]}>
            <M>
              <p>The frog game sent me down a path. I used Gemini to build a personal website, something I'd always wanted as a home base for projects and a domain of my own. Along the way I learned how GitHub works, how to put something on the internet, and how to buy and point a domain.</p>
              <p>As the models improved, a static HTML and CSS site started to feel small. I was also getting frustrated that most of what I built lived inside Gemini's interface as an artifact I couldn't really use anywhere else. By February 2026 I decided to go all in and learn to do this properly.</p>
            </M>
          </Chapter>

          <Chapter ch={CHAPTERS[1]}>
            <M>
              <p>The timing lined up with something else going on in my life. I'd been trying to read a lot more. Books are my antidote to an attention span that social media, the internet and life as an operator in a PE-backed business have been steadily shortening. I needed to get out of my inbox and out of my feed and into long-form writing. A few years ago I read only a handful of books a year. Then I got to a book a month, then nearly two, and I kept raising the goal.</p>
              <p>The obvious tool for tracking all this is Goodreads, and I didn't like it. The community features weren't for me. Not to be derogatory, but it always felt like it was built for Tumblr users, which is not my demographic. The reviews weren't useful to me, it felt locked into Amazon in annoying ways, and the interface didn't fit how I actually work: building lists, sorting a queue, tracking what I've read.</p>
              <p>So I had three things at once: an opinion about how this should work, a real need, and suddenly the means, because these models had gotten pretty freaking smart. Around this time Claude was pulling ahead of OpenAI and Gemini at the frontier, so I made an account and started building with it.</p>
            </M>
          </Chapter>

          <Chapter ch={CHAPTERS[2]}>
            <M>
              <p>The first version came together in something close to a one-shot. I started with a clean interface for tracking books I'd read, and it grew quickly from there. By the time I called it v1.0 in March, Kitab had:</p>
              <ul className="kb-list">
                <li>a <strong>To Be Read</strong> list with drag-to-reorder, so my queue is always in the order I actually want to read it</li>
                <li><strong>custom tags</strong> for genres, subgenres or anything else, with filters across the whole library</li>
                <li>a <strong>statistics</strong> page: books per year, pages read, average pages per book, genre breakdowns, rating distribution, reading pace</li>
                <li><strong>Rank</strong>, borrowed from a silly movie app I'd built that pits two movies against each other. Kitab does the same with books, keeps an Elo score for each, and eventually hands you a definitive list of your favorites</li>
                <li>a <strong>Goodreads import</strong>, so I could take all my data out of Goodreads for good and drop it into Kitab</li>
              </ul>
            </M>

            <FigurePair items={[
              { n: 1, gif: "tbr", title: "The TBR queue", alt: "Screen recording: a book in the To Be Read list is held and dragged to the top of the queue.", text: "Hold a book's handle and drag it up the list. The order is the order I'll read them in." },
              { n: 2, gif: "rank", title: "Rank", alt: "Screen recording: Rank shows two books side by side, one is tapped as the winner, then the ranked list appears.", text: "Pick the better of two books, again and again. Every pick moves both Elo scores, and the leaderboard sorts itself." },
            ]} />

            <M>
              <p>It was a web app, but I could save it to my iPhone's home screen and it felt like a native app most of the time. That solved the presentation and interaction problems I had with Goodreads. It also gave me a surface to experiment on.</p>
            </M>

            <Figure n={3} gif="stats" title="Statistics" alt="Screen recording: the Statistics page scrolls through books read, pages read, average rating, a books-per-month chart and a tag breakdown, then switches to 2025.">
              Books and pages per year, average rating and length, books per month, and a tag breakdown, so I can see how much fantasy crept into a year. The year pills switch the whole page.
            </Figure>
          </Chapter>

          <Chapter ch={CHAPTERS[3]}>
            <M>
              <p>With all my data in one place (Supabase on the back end), the next experiment was obvious: ask a model what I should read next. I loaded $5 of credit onto the Claude API and wired up a recommendations feature. You can ask for something specific ("a slow-burn literary thriller set outside the US") or tell it to surprise you, and it reads your highest-rated books along with their tags and snippets of your reviews before it answers.</p>
              <p>It was one of the most fun things I'd built. The recommendations felt personal in a way search results haven't in years, maybe because nobody has SEO'd their way into my own reading history.</p>
            </M>

            <Figure n={4} gif="discover" title="Discover" alt="Screen recording: on Discover, the request 'Something like Piranesi, but longer' is typed, eight recommendations appear, and one opens to show why it was picked.">
              Type what you're in the mood for and get eight picks back. Each comes with a reason written for you specifically, plus one-tap Check Libby and Add to TBR.
            </Figure>

            <M>
              <p>Every feature I've added since has quietly made that feature better, because each one gives the model more context about me. Tags tell it what shelves I keep, and my reviews tell it what I noticed and cared about in each book. The Rank scores and my Kindle highlights (more on those below) are next in line. Soon the model should know whether I keep underlining passages about loyalty, family or faith.</p>
            </M>
          </Chapter>

          <Chapter ch={CHAPTERS[4]}>
            <M>
              <p>The biggest lesson from Kitab is that the best part of building your own software is getting to be opinionated. Kitab is built around my workflow, and plenty of people would find it strange. A few features show that better than anything else.</p>
              <p><strong>The Libby button.</strong> I add a book to my TBR the moment I hear about it: from a friend, a podcast, a post online. Weeks later, when I'm ready for it, every book page has a <strong>Check Libby</strong> button that opens the Libby app already searching my local library for that title. I borrow it, and it lands on my Kindle. Kitab has become the front door for getting books onto my Kindle, and that alone has changed how much I read. (There's an Amazon link too, for the books I want to own.)</p>
              <p><strong>Kindle highlights.</strong> I bought a Kindle and started highlighting constantly. Readwise does a great job of collecting Kindle highlights, but it's a paid product, and after the free trial I didn't want another subscription for one feature. Fortunately, this turned out to be a very vibe-codable feature. The first version imported the <code>My Clippings.txt</code> file off the Kindle. The version I use today is more ambitious: Amazon has no API for highlights, so Kitab drives a logged-in Kindle web reader in an invisible browser window, pulls in anything new, and does it on its own every night in the background. Every book I read on Kindle now has its highlights waiting on its page in Kitab.</p>
            </M>

            <Figure n={5} gif="journal" title="A book page" alt="Screen recording: the Middlemarch book page scrolls past reading progress, the Amazon, Wikipedia and Check Libby links, and into the journal of notes and Kindle highlights.">
              Progress, tags, the Amazon, Wikipedia and Check Libby links, then the journal: my notes and the Kindle highlights that synced overnight, with a note attached to one of them.
            </Figure>

            <M>
              <p><strong>The commonplace book.</strong> Highlights led to the biggest release so far. Every book page now has a journal: my notes, passages I've highlighted on Kindle, passages I've typed in from paper books (iPhone's Live Text can lift them straight off a printed page), notes attached to specific highlights, and my review, all in one timeline. The Highlights tab reads like a book: warm paper, the passage set in a proper book typeface, and a swipe or tap on the edge to turn the page, like an e-reader. It's a way to sit with everything I've found worth keeping.</p>
            </M>

            <Figure n={6} gif="highlights" title="Highlights" alt="Screen recording: the Highlights tab shows today's highlight, then pages of highlights are swiped like an e-reader, then the shelf is filtered to Meditations.">
              Today's passage up top, then every highlight as a page. Swipe to turn it, or tap a cover on the shelf to read one book in order.
            </Figure>

            <blockquote className="kb-pull">
              <p>Kitab has become the front door for getting books onto my Kindle.</p>
            </blockquote>
          </Chapter>

          <Chapter ch={CHAPTERS[5]}>
            <M>
              <p>The next step was to turn the web app into something that felt like a real iOS app. A tool called Capacitor wraps a web app in a native iOS shell, so I got an Apple developer account, downloaded Xcode and learned to maintain the web app and the iOS app side by side with nearly full feature parity. The iOS app does things the web can't:</p>
              <ul className="kb-list">
                <li><strong>A home screen widget</strong> that shows one of my Kindle highlights each day, changing at midnight. The same quote appears on the app's home page and in a morning notification.</li>
                <li><strong>A share sheet extension.</strong> When I'm looking at a book in the Amazon or Goodreads app, I can share it to Kitab and get a ready-made book card with one tap to add.</li>
                <li><strong>A barcode scanner</strong> for bookstores and libraries: tap add, point the camera at the ISBN, and the book goes straight onto my TBR. The first version didn't work on my phone at all. Recent Pro iPhones can't focus the main camera closer than about 20 cm, so a book held at a normal distance never scanned. The fix was a native scanner that uses the lens iOS switches to for macro shots. You don't learn that from a tutorial.</li>
                <li><strong>Haptics</strong>, the small vibration when you long-press a book to change its status or tags, which makes the whole thing feel physical.</li>
              </ul>
            </M>

            <FigurePair items={[
              { n: 7, gif: "library", title: "Long-press anything", alt: "Screen recording: a book cover in the Library is long-pressed, a sheet slides up, and its status is changed to Currently Reading.", text: "Hold a cover and a sheet slides up for status, tags, review and rating. On the phone, this is where the haptic tap lands." },
              { n: 8, gif: "addbook", title: "One-tap add", alt: "Screen recording: Add a Book opens, 'station eleven' is typed, and tapping the first result adds it to the To Be Read list.", text: "Search, tap the book, and it's on the TBR. The barcode icon in the search box opens the native scanner." },
            ]} />

            <M>
              <p>I can share the app through TestFlight, but so far it's just for me. Part of that is cost: I run everything on free tiers to keep it cheap, and those come with storage limits I'd hit quickly with more users.</p>
            </M>
          </Chapter>

          <Chapter ch={CHAPTERS[6]}>
            <M>
              <p>One habit I picked up along the way is running bake-offs instead of trusting my gut.</p>
              <p>Book data was the first. Kitab started on Google Books for covers and metadata, and it was fine until it wasn't: wrong editions, missing covers, junk results, and it was especially bad for Islamic and Arabic titles. So I had Claude build a benchmark that ran 138 books from my own library, plus a set of tricky edge cases, through Google Books, Open Library and Hardcover side by side. Hardcover won clearly: junk in 13% of top results against Google's 23%, and covers for 96% of books. Kitab now searches Hardcover first and falls back to Google.</p>
              <div className="kb-nums" role="group" aria-label="Book data bake-off results">
                <div><div className="kb-num">138</div><div className="kb-num-lbl">books from my own library in the test set</div></div>
                <div><div className="kb-num">13%</div><div className="kb-num-lbl">junk top results on Hardcover, against 23% on Google Books</div></div>
                <div><div className="kb-num">96%</div><div className="kb-num-lbl">of books with a cover on Hardcover</div></div>
              </div>
              <p>The recommendation model got the same treatment. I ran the same prompt against my live library on four models. Claude Haiku, which I'd started with, came out weakest: it misattributed authors, invented a book that doesn't exist, and recommended books I'd already read. Gemini 3.5 Flash made none of those mistakes, answered in about three seconds instead of six, and was free. So recommendations run on Gemini now, with Haiku as an automatic backup if Gemini is overloaded. As models keep improving, I can rerun the bake-off and switch again. My personal reading app has something like an eval pipeline, and I find that hilarious and very useful.</p>
            </M>
          </Chapter>

          <Chapter ch={CHAPTERS[7]}>
            <M>
              <p>I'm not an engineer, and Kitab has been an education in everything that goes into real software beyond the code.</p>
              <p><strong>The back end.</strong> I learned what it takes to handle sign-in (Kitab uses Google sign-in through Supabase) and to make sure each user can only ever see their own data, which is simple for one user and gets dodgy as soon as there's a second. I learned that anything you put behind a URL is public. For a while, anyone who found the recommendations endpoint could have run prompts on my API keys, and now it checks that you're signed in first. I also learned about dates. Kitab stores the month you finished a book, and a perfectly normal line of JavaScript turned every book finished in January into one finished in December of the year before, for anyone in a US time zone. My yearly stats were wrong until we caught it.</p>
              <p><strong>Design.</strong> I have a new appreciation for how much work goes into making an app feel good. Colors, type, spacing, modals that don't overlap, readable text in both light and dark mode, consistency from one screen to the next, animation that's quick and smooth. A few examples from the last month alone:</p>
              <ul className="kb-list">
                <li>The same status was called "Finished" in one place and "Read" in another, and To Be Read was blue on the book cards but amber on the status pills. Now there's one name and one color for each status, everywhere.</li>
                <li>I made all the small text bigger for readability across 137 places in the app. On the phone it made everything feel oversized, so I reversed it.</li>
                <li>Modals opened at different heights depending on how much content they had. I measured nine of them with top edges anywhere from 72 to 287 pixels down the screen. Now they all start at 72.</li>
                <li>I swapped bouncy spring animations for short, iOS-style ones and removed the background blur, the most expensive visual effect in an iOS web view and one you could barely see.</li>
              </ul>
            </M>

            <Figure n={9} gif="home" title="Home, in both themes" alt="Screen recording: the Home screen shuffles the highlight of the day, scrolls through the reading goal, currently reading and year-at-a-glance stats, then switches to light mode.">
              Reading goal, the highlight of the day, what I'm reading now and the year at a glance. Every screen has to hold up in light mode and dark mode.
            </Figure>

            <M>
              <p>None of those shows up on a feature list, and all of them are the difference between an app you tolerate and one you're proud of. The job is to keep critiquing your own work, find the imperfections and hold a high bar. It has given me real respect for the product and design side of building software, beyond just the engineering.</p>
            </M>
          </Chapter>

          <Chapter ch={CHAPTERS[8]}>
            <M>
              <p>Six months in, Kitab is about 14,000 lines of code across roughly 90 releases, including about 1,800 lines of Swift for the native iPhone features. I use it every day, and it fits my workflow exactly: the Kindle sync, the one-tap Libby link, the Amazon link, the stats I like to track through the year, and a growing record of everything I've read and thought about it.</p>
              <p>The part that still surprises me most is how I build it now. A lot of the changes now happen from my phone. I open the Claude Code app, describe the next feature, the bug I just hit or the UI tweak I want, and it does the work. Shortly after, the change is live on the web.</p>
              <p>There's plenty on the roadmap, much of it about doing more with the model now that tokens are cheap. The one I'm most excited about is a year-in-review page: a one-shot look back at everything I read in a year, drawing on my reviews, ratings, rankings and highlights, polished enough to share. After that, I'd like to be able to ask my own library questions ("what have I read about grief?") and get answers made of my own highlights and notes.</p>
              <p>Every one of these features has taught me something about how smart the models are getting, where their limits are, and what it takes to turn a working prototype into something you want to use every day. This is part one. There's a lot more to say about bake-offs, about working with Claude Code, and about where Kitab goes next.</p>

              <div className="kb-colophon">
                <h3>Kitab at six months</h3>
                <div className="kb-nums">
                  <div><div className="kb-num">~14k</div><div className="kb-num-lbl">lines of code</div></div>
                  <div><div className="kb-num">~90</div><div className="kb-num-lbl">releases since March</div></div>
                  <div><div className="kb-num">1.8k</div><div className="kb-num-lbl">lines of Swift for iOS</div></div>
                  <div><div className="kb-num">$5</div><div className="kb-num-lbl">of API credit to start</div></div>
                </div>
              </div>
            </M>
          </Chapter>
        </article>

        <ResearchFooter currentSlug="kitab" />
      </main>
    </div>
  );
}
