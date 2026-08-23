# Motion plan — what to take from ThreeUI

A proposal for adding WebGL/canvas motion to adib.ihsan.build, based on an audit of
[MengTo/threeui](https://github.com/MengTo/threeui) (ThreeUI Community, MIT, v0.3.0).

Status: **draft for review.** Nothing here is built yet.

---

## 1. What ThreeUI actually is

The marketing framing is "50 components, 111 routes, three.js." The source tells a more
useful story. Every component in `src/shaders/` falls into one of four runtimes, and they
are not remotely equivalent for our purposes:

| Runtime | Count | What it means | Verdict |
|---|---|---|---|
| **Sandboxed iframe** (`srcDoc` + full HTML doc) | 15 dirs / 73 HTML files | A complete standalone page injected into an iframe | **Rule out** |
| **DOM / canvas 2D** | 21 dirs | Plain React + 2D canvas, no GPU | Selective use |
| **Raw WebGL** | 7 dirs | One fullscreen quad, hand-written GLSL, zero dependencies | **The good stuff** |
| **three.js** | 6 dirs | Imports `three128` / `three165` | **Rule out** |

### Why the iframe components are out

They are the majority of the catalog and the most visually impressive ones (`AtTheHorizon`,
`SemanticBloom`, `HypnoticLoops`, all the landing pages). They are also unusable here.
Across the 73 HTML documents:

- 46 load Tailwind from `cdn.tailwindcss.com` at runtime
- 36 load Iconify from `code.iconify.design`
- 32 pull scripts from `cdnjs.cloudflare.com` (mostly GSAP + ScrollTrigger)
- 21 fetch images from Supabase buckets that belong to ThreeUI, not to us

So each one is a runtime dependency on four third-party origins we do not control, inside a
`sandbox="allow-scripts"` frame that cannot read our CSS variables, cannot inherit our fonts,
and holds its own WebGL context. A hotlink to someone else's Supabase bucket on a personal
site is a broken image waiting to happen.

Worth knowing: only 14 of the 73 use WebGL at all. `ConstellationField`, the one that looks
most like a shader, is `getContext('2d')`.

### Why three.js is out

Measured in this repo, not guessed. I installed `three`, built a minimal orthographic-camera
+ `PlaneGeometry(2,2)` + `ShaderMaterial` scene (exactly what `DotMatrixBackground` does),
and let Vite tree-shake it:

```
probe.js  607.55 kB │ gzip: 137.69 kB
```

The current home-page shell is **~136 kB gzip** (`index` 15.08 + `vendor` 57.19 +
`router` 14.84 + `framer` 44.11 + CSS 4.74). Adding three.js to draw a single fullscreen
gradient would exactly double the site. The seven raw-WebGL components do the same job in
about 2 kB.

### Licensing

MIT, Copyright (c) 2026 Meng To. Copying and adapting the source is fine. Anything we adapt
carries a one-line attribution comment at the top of the file.

---

## 2. The aesthetic problem

`.impeccable.md` commits to warm editorial dark, gold-tinted neutrals, "restraint on
decoration," and an explicit anti-reference: startup landing page. ThreeUI's house palette is
neon cyan, indigo, and purple, and its house genre is sci-fi HUD. From `ribbonFieldShaders.ts`:

```glsl
vec3 teal   = vec3(0.17, 0.83, 0.75);
vec3 cyan   = vec3(0.22, 0.82, 0.96);
vec3 indigo = vec3(0.39, 0.38, 0.92);
vec3 purple = vec3(0.66, 0.33, 0.98);
```

Dropping any of these in unmodified breaks design principles 1 (warmth over coolness) and 3
(restraint on decoration) on the same commit. The proposal is to take the engine and leave
the art.

ThreeUI's own answer to recoloring is a CSS `filter: hue-rotate()` on the canvas element.
We should not use it: it shifts the near-black base along with the highlights, and it runs a
full-surface filter every frame. Pass a color uniform instead.

One happy exception. `BellFieldBackground` draws an ember layer in
`rgba(231, 193, 101, …)`, which is `#E7C165`. Our `--accent` is `#d4a647`. That component's
particle layer is already on-palette.

---

## 3. Proposal

Five phases, each independently shippable and independently revertable. The review gates
matter more than the code.

### Phase 0 — `/motion-lab`, a dev-only route

Build this first. `App.jsx` already has the pattern:

```jsx
{import.meta.env.DEV && <Route path="/audio-lab" element={<AudioLab />} />}
```

Add `/motion-lab` the same way. It renders every candidate at real hero dimensions, against
the real `--bg` and `--accent`, with live sliders for speed / opacity / density and a 390px
frame toggle. Every judgment call below gets made by looking at it rather than by reading a
description of it.

Effort: ~half a day. Ships nothing to production.

### Phase 1 — `<ShaderField>`, the primitive

One file, roughly 70 lines, no new dependencies. It copies the lifecycle ThreeUI already got
right and fixes what it got wrong.

Inherited from ThreeUI (their `BellField` / `RibbonField` / `StreamConvergence` all do this):

- `IntersectionObserver` cancels the rAF loop when the canvas scrolls out of view
- `document.hidden` check stops the loop on a backgrounded tab
- `ResizeObserver` drives resize, DPR clamped at 2
- Full teardown: `deleteBuffer`, `deleteShader`, `deleteProgram` on unmount

Added by us:

- **`prefers-reduced-motion`.** Five of the seven raw-WebGL components never check it, and
  that includes both `StreamConvergenceBackground` and `BellFieldBackground`, the two we plan
  to adapt. Only `EnergyOrb` and `LaserVariants` handle it. We render exactly one frame and
  never start the loop. The site's existing global rule at `index.css:653` covers CSS
  animation and transitions only, so a rAF loop sails straight past it.
- **A no-WebGL fallback.** If `getContext("webgl")` returns null, ThreeUI's components return
  early and leave an empty div. We fall back to a static CSS gradient so nothing ever renders
  as a blank rectangle.
- **Palette from CSS custom properties.** Read `--accent` and `--bg` off the computed style
  and feed them in as `vec3` uniforms, so the field follows the design tokens instead of
  hard-coding a second source of truth.

Effort: ~half a day. Cost: ~1 kB gzip.

### Phase 2 — Ambient field behind the home hero

Adapt `stream-convergence` (75 lines, raw WebGL, no pointer tracking, pure ambient drift).
It sits behind the `<h1>Adib Choudhury</h1>` and the subhead, above `<IndexLine />`.

Constraints that keep it editorial:

- ~40vh tall, masked with a `linear-gradient` alpha fade to `--bg` at the bottom, so there is
  never a visible edge
- opacity capped around 0.3, recolored to gold: it should read as paper texture behind type
- no pointer parallax on this one. Motion that chases the cursor behind someone's name is the
  startup-landing-page move the brief rules out
- the typography does not change at all

Fallback ladder: reduced motion gets one static frame, no WebGL gets today's flat background.
Neither is a regression.

Effort: ~1 day including recolor. Cost: ~2 kB gzip, one WebGL context, one rAF loop that runs
only while the top of the page is on screen.

**Review gate: is any motion behind your name the right call?** This is the highest-payoff and
highest-risk item in the plan.

### Phase 3 — Ember drift on the Research index

Lift only the canvas-2D ember layer out of `BellFieldBackground`: 58 particles, sine-wave
horizontal drift, twinkle on a per-particle phase, already gold. About 25 lines, no WebGL,
runs on a 2D context.

Place it behind the Research `<PageHeader>` and `<GeometricAccent>`, at low opacity. It gives
the index page a warm, slow field without competing with the card grid below it.

Effort: ~half a day. Cost: ~1 kB gzip.

### Phase 4 — Heading decode on research pieces

Port `articleHeadingDecode.ts` (95 lines, DOM only, and the one ThreeUI file that already
checks `prefers-reduced-motion`). Characters resolve from scramble to final text on a
budget curve, staggered per heading, triggered on scroll-in.

Applied to the research piece `<h1>` and chapter headings. Three changes on the way in:

- Replace the scramble pool. ThreeUI's is `#%&@$/\<>*+=~ABCDEF…`, which reads terminal and
  fights a Newsreader serif heading. Letters only, matched case.
- Shorten `duration` to ~380 ms and drop the stagger on the `<h1>`.
- Run once per heading per page load, never re-fire on scroll back up.

Effort: ~half a day. Cost: ~1 kB gzip, zero GPU.

**Review gate: this is the one where taste decides.** Build it behind a flag, look at it on a
real piece, and be willing to throw it away.

### Phase 5 — Deferred: generated card motifs

`predictive-arc` and `data-pixel-arc` draw data-shaped arcs and pixel columns on a 2D canvas.
There is an interesting version where each research card gets a motif generated from a real
number in the piece, replacing or supplementing the demo GIFs. That is a content pipeline
rather than a component swap, so it belongs in its own plan after Phases 0–4 land.

### Explicitly out of scope

Every button and CTA (`LumenCta`, `ShaderButtons`, `LiquidMetalButton`, `RectangleButtons`,
`CircleButtons`), every landing page (`Kage`, `Sylva`, `CompleteShelf`), every 3D scene
(`TempleNight`, `JapaneseTower`, `Bookshelf`, `LandscapeScene`), plus `CrtBackground` and
`TypographyVortex`. All of them are well made and all of them are the wrong register for a
site whose brief names "typical dev portfolio" as an anti-reference.

---

## 4. Budget and guardrails

| Guardrail | Value |
|---|---|
| Home shell today | ~136 kB gzip |
| Ceiling for everything in this plan | +8 kB gzip |
| Phases 1–4 as specced | ~5 kB gzip |
| New runtime dependencies | zero |
| Third-party origins at runtime | zero |
| Concurrent WebGL contexts | one |

Plus: validate every phase at 390px first, per the mobile-first principle. A fullscreen
fragment shader at DPR 2 on an iPhone is cheap to draw; the real risk is battery drain, which
the IntersectionObserver and `document.hidden` checks already cover.

Each adapted file opens with:

```js
// Adapted from ThreeUI Community (MIT) © 2026 Meng To — https://github.com/MengTo/threeui
```

---

## 5. Sequencing

1. Phase 0 — `/motion-lab` dev route
2. Phase 1 — `<ShaderField>` primitive
3. Phase 2 — home hero field → **review** → ship or cut
4. Phase 3 — Research index embers → **review** → ship or cut
5. Phase 4 — heading decode → **review** → ship or cut

One commit per phase. Phases 2, 3, and 4 do not depend on each other, so any of them can be
cut at its gate without stranding the others.

---

## 6. Open questions

1. **Home hero.** Any motion at all behind your name, or should the home page stay completely
   still and the motion live only on Research?
2. **Recolor.** Gold everywhere, or keep one candidate in its native cyan on `/motion-lab` as
   a control, in case the warm version turns out muddy against a near-black background?
3. **Scope.** Do individual research pieces get their own fields keyed to the piece, or does
   motion stay on the index pages so the pieces themselves stay quiet?
