import { Link } from "react-router-dom";
import Seo from "../../components/Seo";
import ResearchFooter from "../../components/ResearchFooter";

// "The reading app only I would build": an essay on building Kitab with AI.
// Recordings are the real app running on a demo library (placeholder covers,
// public-domain highlights); GIFs live in public/demo-gifs/kitab-build/.

const SHELF = [
  "dune", "meditations", "the-count-of-monte-cristo", "piranesi", "project-hail-mary",
  "the-muqaddimah", "walden", "the-brothers-karamazov", "middlemarch",
];

const CSS = `
  .kb-root {
    color-scheme: light;
    --text-heading: var(--ink);
    --text-muted: var(--muted);
    --border: var(--rule);
    --font-mono: var(--ui);
    --font-sans: var(--ui);
    --font-serif: var(--display);
    --bg: #FAF7F2;
    --surface: #F3EDE3;
    --rule: #E3D8CA;
    --ink: #1C1917;
    --ink-soft: #44403C;
    --muted: #78716C;
    --accent: #0F766E;
    --accent-soft: #CCFBF1;
    --amber: #B45309;
    --bezel: #141110;
    --bezel-edge: #3a3430;
    --shadow: 0 1px 2px rgba(28,25,23,.08), 0 18px 40px -18px rgba(28,25,23,.35);
    --display: 'Playfair Display', 'Iowan Old Style', Georgia, serif;
    --body: 'EB Garamond', 'Iowan Old Style', Palatino, Georgia, serif;
    --ui: 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  }
  @media (prefers-color-scheme: dark) {
    .kb-root {
      color-scheme: dark;
      --bg: #171412;
      --surface: #221E1B;
      --rule: #342E2A;
      --ink: #F3EDE3;
      --ink-soft: #D6D3D1;
      --muted: #A8A29E;
      --accent: #2DD4BF;
      --accent-soft: #134E4A;
      --amber: #FBBF24;
      --bezel: #050404;
      --bezel-edge: #3f3833;
      --shadow: 0 1px 2px rgba(0,0,0,.4), 0 18px 40px -18px rgba(0,0,0,.8);
    }
  }

  .kb-root, .kb-root * { box-sizing: border-box; }
  .kb-root {
    min-height: 100vh;
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: var(--body);
    font-size: 1.25rem;
    line-height: 1.6;
    padding-inline: 20px;
    -webkit-font-smoothing: antialiased;
  }
  .kb-root .page { max-width: 46rem; margin: 0 auto; padding-block: 88px 64px; }
  .kb-root .measure { max-width: 34rem; margin-inline: auto; }

  /* Running head, like the top of a book page */
  .kb-root .running-head {
    display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
    font-family: var(--ui); font-size: .75rem; letter-spacing: .14em; text-transform: uppercase;
    color: var(--muted); border-bottom: 1px solid var(--rule); padding-bottom: 12px; margin-bottom: 48px;
  }
  .kb-root .running-head b { color: var(--accent); font-weight: 600; }

  .kb-root header.hero { text-align: left; }
  .kb-root h1 {
    font-family: var(--display); font-weight: 700; font-size: clamp(2.4rem, 7vw, 3.9rem);
    line-height: 1.04; letter-spacing: -.015em; margin: 0 0 16px; text-wrap: balance;
  }
  .kb-root .dek { font-style: italic; font-size: 1.4rem; line-height: 1.4; color: var(--ink-soft); margin: 0 0 20px; text-wrap: balance; }
  .kb-root .byline { font-family: var(--ui); font-size: .875rem; color: var(--muted); display: flex; gap: 10px; flex-wrap: wrap; }
  .kb-root .byline span + span::before { content: "·"; margin-right: 10px; }

  /* A shelf of covers under the title */
  .kb-root .shelf { display: flex; align-items: flex-end; gap: 6px; margin: 40px 0 8px; padding-bottom: 10px; border-bottom: 6px solid var(--rule); overflow: hidden; }
  .kb-root .shelf img { width: calc((100% - 8 * 6px) / 9); aspect-ratio: 2 / 3; object-fit: cover; border-radius: 2px 4px 4px 2px; box-shadow: 2px 3px 8px rgba(28,25,23,.18); }
  .kb-root .shelf img:nth-child(3n+2) { transform: translateY(-4px); }
  .kb-root .shelf img:nth-child(4n) { width: calc((100% - 8 * 6px) / 9 * .92); }
  .kb-root .demo-note { font-family: var(--ui); font-size: .8125rem; line-height: 1.5; color: var(--muted); margin: 0 0 40px; }

  .kb-root .lede { font-family: var(--display); font-style: italic; font-size: 1.6rem; line-height: 1.35; margin-bottom: .9em; }

  .kb-root p { margin: 0 0 1.1em; }
  .kb-root strong { font-weight: 600; }
  .kb-root a { color: var(--accent); text-underline-offset: 3px; }
  .kb-root code { font-family: ui-monospace, 'SF Mono', Menlo, monospace; font-size: .8em; background: var(--surface); padding: 1px 5px; border-radius: 4px; }

  .kb-root section { margin-top: 64px; }
  .kb-root .chapter { font-family: var(--ui); font-size: .75rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); margin: 0 0 6px; }
  .kb-root h2 { font-family: var(--display); font-weight: 600; font-size: clamp(1.75rem, 4.4vw, 2.2rem); line-height: 1.15; margin: 0 0 20px; text-wrap: balance; }

  .kb-root ul.features { list-style: none; padding: 0; margin: 0 0 1.2em; display: grid; gap: 12px; }
  .kb-root ul.features li { padding-left: 22px; position: relative; }
  .kb-root ul.features li::before { content: ""; position: absolute; left: 2px; top: .62em; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }

  .kb-root blockquote.pull {
    margin: 36px 0; padding: 0; border: 0;
    font-family: var(--display); font-style: italic; font-weight: 500; font-size: clamp(1.5rem, 3.6vw, 1.9rem); line-height: 1.3;
    color: var(--ink); text-wrap: balance;
  }
  .kb-root blockquote.pull::before { content: "\\201C"; display: block; font-size: 3.4rem; line-height: .6; color: var(--accent); margin-bottom: 6px; }

  /* Phone figures */
  .kb-root figure { margin: 44px 0; }
  .kb-root .phone {
    width: 100%; max-width: 280px; margin: 0 auto; background: var(--bezel); border-radius: 44px; padding: 10px;
    box-shadow: var(--shadow), inset 0 0 0 1.5px var(--bezel-edge);
  }
  .kb-root .phone img { display: block; width: 100%; aspect-ratio: 390 / 844; object-fit: cover; border-radius: 34px; background: #1c1917; }
  .kb-root figcaption { font-family: var(--ui); font-size: .9rem; line-height: 1.55; color: var(--muted); }
  .kb-root figcaption b { display: block; font-family: var(--display); font-size: 1.15rem; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
  .kb-root .fig-single { display: grid; grid-template-columns: 280px 1fr; gap: 36px; align-items: center; }
  .kb-root .fig-single figcaption { max-width: 20rem; }
  .kb-root .fig-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
  .kb-root .fig-pair > div { display: grid; gap: 16px; align-content: start; }
  .kb-root .fig-pair figcaption { max-width: 17rem; margin-inline: auto; text-align: center; }
  @media (max-width: 680px) {
    .kb-root .fig-single { grid-template-columns: 1fr; gap: 16px; }
    .kb-root .fig-single figcaption { text-align: center; margin-inline: auto; }
    .kb-root .fig-pair { grid-template-columns: 1fr; gap: 40px; }
    .kb-root .phone { max-width: 260px; }
  }

  /* Bake-off numbers */
  .kb-root .bakeoff { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); border-radius: 12px; overflow: hidden; margin: 28px 0 32px; }
  .kb-root .bakeoff div { background: var(--bg); padding: 16px 18px; }
  .kb-root .bakeoff .num { font-family: var(--display); font-weight: 600; font-size: 2rem; line-height: 1; font-variant-numeric: tabular-nums; }
  .kb-root .bakeoff .lbl { font-family: var(--ui); font-size: .8125rem; line-height: 1.4; color: var(--muted); margin-top: 8px; }
  @media (max-width: 520px) { .bakeoff { grid-template-columns: 1fr; } }

  /* Colophon */
  .kb-root .colophon { margin-top: 72px; padding-top: 28px; border-top: 1px solid var(--rule); }
  .kb-root .colophon h3 { font-family: var(--ui); font-size: .75rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); margin: 0 0 18px; }
  .kb-root .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .kb-root .stats .num { font-family: var(--display); font-weight: 700; font-size: 2.1rem; line-height: 1; font-variant-numeric: tabular-nums; color: var(--accent); }
  .kb-root .stats .lbl { font-family: var(--ui); font-size: .8125rem; color: var(--muted); margin-top: 6px; line-height: 1.4; }
  @media (max-width: 600px) { .stats { grid-template-columns: 1fr 1fr; } }
  .kb-root .signoff { font-style: italic; color: var(--ink-soft); margin-top: 40px; }

  @media (max-width: 480px) {
    .kb-root { font-size: 1.15rem; padding-inline: 16px; }
    .kb-root .page { padding-block: 72px 48px; }
  }

  .kb-root .kb-back {
    position: fixed; top: max(14px, env(safe-area-inset-top)); left: 14px; z-index: 200;
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px;
    background: var(--bg); border: 1px solid var(--rule); border-radius: 999px;
    color: var(--muted); font-family: var(--ui); font-size: 11px; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase; text-decoration: none;
    box-shadow: 0 4px 16px rgba(28,25,23,.12); transition: color .2s, border-color .2s;
  }
  .kb-root .kb-back:hover, .kb-root .kb-back:focus-visible { color: var(--accent); border-color: var(--accent); }
  .kb-root .kb-back-label::after { content: ""; }
  @media (min-width: 1024px) {
    .kb-root .kb-back { top: 24px; left: 24px; padding: 10px 16px; font-size: 12px; }
    .kb-root .kb-back-label::after { content: " to research"; }
  }
  .kb-root .research-footer { max-width: 46rem; margin-inline: auto; margin-bottom: 0; padding-bottom: 64px; }
`;

export default function KitabBuild() {
  return (
    <div className="kb-root">
      <Seo
        title="The Reading App Only I Would Build — Adib Choudhury"
        description="Part one of building Kitab, my personal reading app, with AI: from a frog Pong game to a native iOS app with Kindle sync, Elo rankings and LLM recommendations."
      />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      <style>{CSS}</style>

      <Link to="/research" aria-label="Back to research" className="kb-back">
        <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>&larr;</span>
        <span className="kb-back-label">Back</span>
      </Link>

      <main className="page">
        <div className="running-head"><span><b>Kitab</b> · Building with AI</span><span>Part one</span></div>

        <header className="hero measure">
          <h1>The reading app only I would build</h1>
          <p className="dek">Part one of what I've learned building Kitab with AI</p>
          <div className="byline"><span>Adib Choudhury</span><span>September 2026</span><span>12 min read</span></div>
          <div className="shelf" aria-hidden="true">{SHELF.map((s) => <img key={s} src={`/demo-gifs/kitab-build/cover-${s}.jpg`} alt="" loading="lazy" />)}</div>
          <p className="demo-note">The screen recordings in this post are the real app running on a demo library with placeholder covers, so you can see how it moves without seeing my actual shelves.</p>
        </header>

        <article>
          <div className="measure">
            <p className="lede">The moment it clicked for me involved two frogs and a fly.</p>
            <p>Sometime in the back half of 2025, I was a casual, daily user of ChatGPT and Gemini. I'd throw a CSV at them for some basic analysis, test how smart the newest model had gotten, play with image generation when it came out. Useful, fun, and not especially productive. I hadn't built anything.</p>
            <p>Then, mostly for kicks, I asked one of Gemini's new Flash models to build me a video game: Pong, but with a frog at each end and a fly for the ball. It built it almost instantly. It was playable, it had a menu, it had music, and it ran right there in the browser window. I was floored. A year earlier these tools were a conversational toy that hallucinated half the time, and now one had written a working interactive app from a single sentence.</p>
            <p>This post is about what happened after that, told through one app: <strong>Kitab</strong>, the reading tracker I've been building and using every day for the last six months.</p>
          </div>

          <section className="measure">
            <p className="chapter">Chapter I</p>
            <h2>Getting my feet wet</h2>
            <p>The frog game sent me down a path. I used Gemini to build a personal website, something I'd always wanted as a home base for projects and a domain of my own. Along the way I learned how GitHub works, how to put something on the internet, and how to buy and point a domain.</p>
            <p>As the models improved, a static HTML and CSS site started to feel small. I was also getting frustrated that most of what I built lived inside Gemini's interface as an artifact I couldn't really use anywhere else. By February 2026 I decided to go all in and learn to do this properly.</p>
          </section>

          <section className="measure">
            <p className="chapter">Chapter II</p>
            <h2>Why a reading app</h2>
            <p>The timing lined up with something else going on in my life. I'd been trying to read a lot more. Books are my antidote to an attention span that social media, the internet and life as an operator in a PE-backed business have been steadily shortening. I needed to get out of my inbox and out of my feed and into long-form writing. A few years ago I read only a handful of books a year. Then I got to a book a month, then nearly two, and I kept raising the goal.</p>
            <p>The obvious tool for tracking all this is Goodreads, and I didn't like it. The community features weren't for me. Not to be derogatory, but it always felt like it was built for Tumblr users, which is not my demographic. The reviews weren't useful to me, it felt locked into Amazon in annoying ways, and the interface didn't fit how I actually work: building lists, sorting a queue, tracking what I've read.</p>
            <p>So I had three things at once: an opinion about how this should work, a real need, and suddenly the means, because these models had gotten pretty freaking smart. Around this time Claude was pulling ahead of OpenAI and Gemini at the frontier, so I made an account and started building with it.</p>
          </section>

          <section>
            <div className="measure">
              <p className="chapter">Chapter III</p>
              <h2>Version one</h2>
              <p>The first version came together in something close to a one-shot. I started with a clean interface for tracking books I'd read, and it grew quickly from there. By the time I called it v1.0 in March, Kitab had:</p>
              <ul className="features">
                <li>a <strong>To Be Read</strong> list with drag-to-reorder, so my queue is always in the order I actually want to read it</li>
                <li><strong>custom tags</strong> for genres, subgenres or anything else, with filters across the whole library</li>
                <li>a <strong>statistics</strong> page: books per year, pages read, average pages per book, genre breakdowns, rating distribution, reading pace</li>
                <li><strong>Rank</strong>, borrowed from a silly movie app I'd built that pits two movies against each other. Kitab does the same with books, keeps an Elo score for each, and eventually hands you a definitive list of your favorites</li>
                <li>a <strong>Goodreads import</strong>, so I could take all my data out of Goodreads for good and drop it into Kitab</li>
              </ul>
            </div>

            <figure className="fig-pair">
              <div>
                <div className="phone"><img src="/demo-gifs/kitab-build/tbr.gif" alt="Screen recording: a book in the To Be Read list is held and dragged to the top of the queue." loading="lazy" /></div>
                <figcaption><b>The TBR queue</b>Hold a book's handle and drag it up the list. The order is the order I'll read them in.</figcaption>
              </div>
              <div>
                <div className="phone"><img src="/demo-gifs/kitab-build/rank.gif" alt="Screen recording: Rank shows two books side by side, one is tapped as the winner, then the ranked list appears." loading="lazy" /></div>
                <figcaption><b>Rank</b>Pick the better of two books, again and again. Every pick moves both Elo scores, and the leaderboard sorts itself.</figcaption>
              </div>
            </figure>

            <div className="measure">
              <p>It was a web app, but I could save it to my iPhone's home screen and it felt like a native app most of the time. That solved the presentation and interaction problems I had with Goodreads. It also gave me a surface to experiment on.</p>
            </div>

            <figure className="fig-single">
              <div className="phone"><img src="/demo-gifs/kitab-build/stats.gif" alt="Screen recording: the Statistics page scrolls through books read, pages read, average rating, a books-per-month chart and a tag breakdown, then switches to 2025." loading="lazy" /></div>
              <figcaption><b>Statistics</b>Books and pages per year, average rating and length, books per month, and a tag breakdown, so I can see how much fantasy crept into a year. The year pills switch the whole page.</figcaption>
            </figure>
          </section>

          <section>
            <div className="measure">
              <p className="chapter">Chapter IV</p>
              <h2>Letting the LLM in</h2>
              <p>With all my data in one place (Supabase on the back end), the next experiment was obvious: ask a model what I should read next. I loaded $5 of credit onto the Claude API and wired up a recommendations feature. You can ask for something specific ("a slow-burn literary thriller set outside the US") or tell it to surprise you, and it reads your highest-rated books along with their tags and snippets of your reviews before it answers.</p>
              <p>It was one of the most fun things I'd built. The recommendations felt personal in a way search results haven't in years, maybe because nobody has SEO'd their way into my own reading history.</p>
            </div>

            <figure className="fig-single">
              <div className="phone"><img src="/demo-gifs/kitab-build/discover.gif" alt="Screen recording: on Discover, the request 'Something like Piranesi, but longer' is typed, eight recommendations appear, and one opens to show why it was picked." loading="lazy" /></div>
              <figcaption><b>Discover</b>Type what you're in the mood for and get eight picks back. Each one comes with a reason written for you specifically, plus a one-tap Check Libby and Add to TBR.</figcaption>
            </figure>

            <div className="measure">
              <p>Every feature I've added since has quietly made that feature better, because each one gives the model more context about me. Tags tell it what shelves I keep, and my reviews tell it what I noticed and cared about in each book. The Rank scores and my Kindle highlights (more on those below) are next in line. Soon the model should know whether I keep underlining passages about loyalty, family or faith.</p>
            </div>
          </section>

          <section>
            <div className="measure">
              <p className="chapter">Chapter V</p>
              <h2>Opinionated software</h2>
              <p>The biggest lesson from Kitab is that the best part of building your own software is getting to be opinionated. Kitab is built around my workflow, and plenty of people would find it strange. A few features show that better than anything else.</p>
              <p><strong>The Libby button.</strong> I add a book to my TBR the moment I hear about it: from a friend, a podcast, a post online. Weeks later, when I'm ready for it, every book page has a <strong>Check Libby</strong> button that opens the Libby app already searching my local library for that title. I borrow it, and it lands on my Kindle. Kitab has become the front door for getting books onto my Kindle, and that alone has changed how much I read. (There's an Amazon link too, for the books I want to own.)</p>
              <p><strong>Kindle highlights.</strong> I bought a Kindle and started highlighting constantly. Readwise does a great job of collecting Kindle highlights, but it's a paid product, and after the free trial I didn't want another subscription for one feature. Fortunately, this turned out to be a very vibe-codable feature. The first version imported the <code>My Clippings.txt</code> file off the Kindle. The version I use today is more ambitious: Amazon has no API for highlights, so Kitab drives a logged-in Kindle web reader in an invisible browser window, pulls in anything new, and does it on its own every night in the background. Every book I read on Kindle now has its highlights waiting on its page in Kitab.</p>
            </div>

            <figure className="fig-single">
              <div className="phone"><img src="/demo-gifs/kitab-build/journal.gif" alt="Screen recording: the Middlemarch book page scrolls past reading progress, the Amazon, Wikipedia and Check Libby links, and into the journal of notes and Kindle highlights." loading="lazy" /></div>
              <figcaption><b>A book page</b>Progress, tags, the Amazon, Wikipedia and Check Libby links, then the journal: my notes and the Kindle highlights that synced overnight, with a note attached to one of them.</figcaption>
            </figure>

            <div className="measure">
              <p><strong>The commonplace book.</strong> Highlights led to the biggest release so far. Every book page now has a journal: my notes, passages I've highlighted on Kindle, passages I've typed in from paper books (iPhone's Live Text can lift them straight off a printed page), notes attached to specific highlights, and my review, all in one timeline. The Highlights tab reads like a book: warm paper, the passage set in a proper book typeface, and a swipe or tap on the edge to turn the page, like an e-reader. It's a way to sit with everything I've found worth keeping.</p>
            </div>

            <figure className="fig-single">
              <div className="phone"><img src="/demo-gifs/kitab-build/highlights.gif" alt="Screen recording: the Highlights tab shows today's highlight, then pages of highlights are swiped like an e-reader, then the shelf is filtered to Meditations." loading="lazy" /></div>
              <figcaption><b>Highlights</b>Today's passage up top, then every highlight as a page. Swipe to turn it, or tap a cover on the shelf to read one book in order.</figcaption>
            </figure>

            <blockquote className="pull measure">Kitab has become the front door for getting books onto my Kindle.</blockquote>
          </section>

          <section>
            <div className="measure">
              <p className="chapter">Chapter VI</p>
              <h2>Going native</h2>
              <p>The next step was to turn the web app into something that felt like a real iOS app. A tool called Capacitor wraps a web app in a native iOS shell, so I got an Apple developer account, downloaded Xcode and learned to maintain the web app and the iOS app side by side with nearly full feature parity. The iOS app does things the web can't:</p>
              <ul className="features">
                <li><strong>A home screen widget</strong> that shows one of my Kindle highlights each day, changing at midnight. The same quote appears on the app's home page and in a morning notification.</li>
                <li><strong>A share sheet extension.</strong> When I'm looking at a book in the Amazon or Goodreads app, I can share it to Kitab and get a ready-made book card with one tap to add.</li>
                <li><strong>A barcode scanner</strong> for bookstores and libraries: tap add, point the camera at the ISBN, and the book goes straight onto my TBR. The first version didn't work on my phone at all. Recent Pro iPhones can't focus the main camera closer than about 20 cm, so a book held at a normal distance never scanned. The fix was a native scanner that uses the lens iOS switches to for macro shots. You don't learn that from a tutorial.</li>
                <li><strong>Haptics</strong>, the small vibration when you long-press a book to change its status or tags, which makes the whole thing feel physical.</li>
              </ul>
            </div>

            <figure className="fig-pair">
              <div>
                <div className="phone"><img src="/demo-gifs/kitab-build/library.gif" alt="Screen recording: a book cover in the Library is long-pressed, a sheet slides up, and its status is changed to Currently Reading." loading="lazy" /></div>
                <figcaption><b>Long-press anything</b>Hold a cover and a sheet slides up for status, tags, review and rating. On the phone, this is where the haptic tap lands.</figcaption>
              </div>
              <div>
                <div className="phone"><img src="/demo-gifs/kitab-build/addbook.gif" alt="Screen recording: Add a Book opens, 'station eleven' is typed, and tapping the first result adds it to the To Be Read list." loading="lazy" /></div>
                <figcaption><b>One-tap add</b>Search, tap the book, and it's on the TBR. The barcode icon in the search box opens the native scanner.</figcaption>
              </div>
            </figure>

            <div className="measure">
              <p>I can share the app through TestFlight, but so far it's just for me. Part of that is cost: I run everything on free tiers to keep it cheap, and those come with storage limits I'd hit quickly with more users.</p>
            </div>
          </section>

          <section className="measure">
            <p className="chapter">Chapter VII</p>
            <h2>Choosing tools by running bake-offs</h2>
            <p>One habit I picked up along the way is running bake-offs instead of trusting my gut.</p>
            <p>Book data was the first. Kitab started on Google Books for covers and metadata, and it was fine until it wasn't: wrong editions, missing covers, junk results, and it was especially bad for Islamic and Arabic titles. So I had Claude build a benchmark that ran 138 books from my own library, plus a set of tricky edge cases, through Google Books, Open Library and Hardcover side by side. Hardcover won clearly: junk in 13% of top results against Google's 23%, and covers for 96% of books. Kitab now searches Hardcover first and falls back to Google.</p>
            <div className="bakeoff" role="group" aria-label="Book data bake-off results">
              <div><div className="num">138</div><div className="lbl">books from my own library in the test set</div></div>
              <div><div className="num">13%</div><div className="lbl">junk top results on Hardcover, against 23% on Google Books</div></div>
              <div><div className="num">96%</div><div className="lbl">of books with a cover on Hardcover</div></div>
            </div>
            <p>The recommendation model got the same treatment. I ran the same prompt against my live library on four models. Claude Haiku, which I'd started with, came out weakest: it misattributed authors, invented a book that doesn't exist, and recommended books I'd already read. Gemini 3.5 Flash made none of those mistakes, answered in about three seconds instead of six, and was free. So recommendations run on Gemini now, with Haiku as an automatic backup if Gemini is overloaded. As models keep improving, I can rerun the bake-off and switch again. My personal reading app has something like an eval pipeline, and I find that hilarious and very useful.</p>
          </section>

          <section>
            <div className="measure">
              <p className="chapter">Chapter VIII</p>
              <h2>What building it taught me</h2>
              <p>I'm not an engineer, and Kitab has been an education in everything that goes into real software beyond the code.</p>
              <p><strong>The back end.</strong> I learned what it takes to handle sign-in (Kitab uses Google sign-in through Supabase) and to make sure each user can only ever see their own data, which is simple for one user and gets dodgy as soon as there's a second. I learned that anything you put behind a URL is public. For a while, anyone who found the recommendations endpoint could have run prompts on my API keys, and now it checks that you're signed in first. I also learned about dates. Kitab stores the month you finished a book, and a perfectly normal line of JavaScript turned every book finished in January into one finished in December of the year before, for anyone in a US time zone. My yearly stats were wrong until we caught it.</p>
              <p><strong>Design.</strong> I have a new appreciation for how much work goes into making an app feel good. Colors, type, spacing, modals that don't overlap, readable text in both light and dark mode, consistency from one screen to the next, animation that's quick and smooth. A few examples from the last month alone:</p>
              <ul className="features">
                <li>The same status was called "Finished" in one place and "Read" in another, and To Be Read was blue on the book cards but amber on the status pills. Now there's one name and one color for each status, everywhere.</li>
                <li>I made all the small text bigger for readability across 137 places in the app. On the phone it made everything feel oversized, so I reversed it.</li>
                <li>Modals opened at different heights depending on how much content they had. I measured nine of them with top edges anywhere from 72 to 287 pixels down the screen. Now they all start at 72.</li>
                <li>I swapped bouncy spring animations for short, iOS-style ones and removed the background blur, the most expensive visual effect in an iOS web view and one you could barely see.</li>
              </ul>
            </div>

            <figure className="fig-single">
              <div className="phone"><img src="/demo-gifs/kitab-build/home.gif" alt="Screen recording: the Home screen shuffles the highlight of the day, scrolls through the reading goal, currently reading and year-at-a-glance stats, then switches to light mode." loading="lazy" /></div>
              <figcaption><b>Home, in both themes</b>Reading goal, the highlight of the day, what I'm reading now and the year at a glance. Every screen has to hold up in light mode and dark mode.</figcaption>
            </figure>

            <div className="measure">
              <p>None of those shows up on a feature list, and all of them are the difference between an app you tolerate and one you're proud of. The job is to keep critiquing your own work, find the imperfections and hold a high bar. It has given me real respect for the product and design side of building software, beyond just the engineering.</p>
            </div>
          </section>

          <section className="measure">
            <p className="chapter">Chapter IX</p>
            <h2>Where it is today</h2>
            <p>Six months in, Kitab is about 14,000 lines of code across roughly 90 releases, including about 1,800 lines of Swift for the native iPhone features. I use it every day, and it fits my workflow exactly: the Kindle sync, the one-tap Libby link, the Amazon link, the stats I like to track through the year, and a growing record of everything I've read and thought about it.</p>
            <p>The part that still surprises me most is how I build it now. A lot of the changes now happen from my phone. I open the Claude Code app, describe the next feature, the bug I just hit or the UI tweak I want, and it does the work. Shortly after, the change is live on the web.</p>
            <p>There's plenty on the roadmap, much of it about doing more with the model now that tokens are cheap. The one I'm most excited about is a year-in-review page: a one-shot look back at everything I read in a year, drawing on my reviews, ratings, rankings and highlights, polished enough to share. After that, I'd like to be able to ask my own library questions ("what have I read about grief?") and get answers made of my own highlights and notes.</p>
            <p>Every one of these features has taught me something about how smart the models are getting, where their limits are, and what it takes to turn a working prototype into something you want to use every day. This is part one. There's a lot more to say about bake-offs, about working with Claude Code, and about where Kitab goes next.</p>

            <div className="colophon">
              <h3>Kitab at six months</h3>
              <div className="stats">
                <div><div className="num">~14k</div><div className="lbl">lines of code</div></div>
                <div><div className="num">~90</div><div className="lbl">releases since March</div></div>
                <div><div className="num">1.8k</div><div className="lbl">lines of Swift for iOS</div></div>
                <div><div className="num">$5</div><div className="lbl">of API credit to start</div></div>
              </div>
            </div>
          </section>
        </article>
      </main>

      <ResearchFooter currentSlug="kitab" />
    </div>
  );
}
