# Three concepts for adib.ihsan.build

Three standalone HTML mockups, each a different answer to "what is this site?"
Open any of them directly in a browser. They share the same content (research,
projects, roles) pulled from `src/data` and `src/pages/Home.jsx`. Writing and
reading rows are samples, because the live site loads those from Substack and
the reading API at runtime.

| File | Concept | Navigation model | Ground |
|---|---|---|---|
| `01-ledger.html` | The Ledger | One filterable table | Ledger paper, light |
| `02-shelf.html` | The Shelf | Book spines on shelves | Gallery wall, light |
| `03-atlas.html` | The Atlas | A star chart of five constellations | Night sky, dark |

## 01 The Ledger

The site as a working log. Everything you have researched, built, written and
read sits in one table with a date, a type, an entry and a figure (chapters and
narration length for research, completion for projects). A sticky row of
filters narrows it. The red vertical rule and the ruled rows come from
accounting ledger paper; the "In progress" stamp marks unfinished projects.

Type: Instrument Serif for the name and section years, Instrument Sans for
body, JetBrains Mono for dates and figures. Light and dark themes.

Best if you want the site to read as a record of work, dense and scannable, the
way an investor or operator reads a deal log.

## 02 The Shelf

The site as a reading room. Research pieces, side projects and essays are book
spines on three oak shelves. Spine height follows length (chapters for research,
completion for projects), width follows the title. Clicking a spine pulls it
forward and opens it on a reading desk below with a drop cap and a link. The bio
is a library checkout card with your roles stamped down it.

Type: Libre Caslon Text on the spines and desk, Public Sans for the interface.
Light and dark themes.

Best if you want warmth and a physical metaphor that ties Kitab, the reading
list and the long research narratives together.

## 03 The Atlas

The site as a star chart. Every research piece, project, role and board seat is
a star in one of five constellations: AI, Media & Sport, Investing & Operating,
Building, Faith & Family. Your career sits at the centre of the chart. Pointing
at a star opens it in the panel on the right; picking a constellation in the
legend brings it forward and dims the rest. Layout is a small force simulation
on a canvas, with a gentle drift that respects reduced-motion settings.

Type: Spectral for display, Manrope for labels and interface. Deliberately
single-theme (night).

Best if you want the site to feel like a map of interests rather than a list,
and to echo the network graph in "The AI Capital Graph".

## Notes

- Fonts load from Google Fonts. Offline, each page falls back to system faces.
- All three are plain HTML, CSS and vanilla JS with no build step, so whichever
  direction you pick can be ported into the Vite app or kept static.
