import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as R from "recharts";
import Seo from "../../components/Seo";
import ResearchFooter from "../../components/ResearchFooter";

const CSS = ".cf-root{\n  --bg:#16140f; --surface:#1d1b16; --card:#25221c; --line:#38332b;\n  --text:#efe9de; --dim:#c4bbab; --muted:#8e8576;\n  --gold:#d6a64a; --teal:#74b8a9; --red:#d36d52;\n  --display:'Playfair Display',Georgia,'Times New Roman',serif;\n  --serif:'Source Serif 4',Georgia,serif;\n  --mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;\n  --sans:'Outfit',system-ui,-apple-system,sans-serif;\n  --text-heading:var(--text);--text-muted:var(--muted);--border:var(--line);--accent:var(--gold);--font-mono:var(--mono);--font-sans:var(--sans);--font-serif:var(--display);background:var(--bg);color:var(--text);font-family:var(--serif);-webkit-font-smoothing:antialiased;min-height:100vh}\n.cf-root *{box-sizing:border-box}\n.cf-root a{color:inherit}\n@media (prefers-color-scheme: light){.cf-root{\n  --bg:#f3f1ec; --surface:#e9e5dd; --card:#fbfaf7; --line:#d6cfc3;\n  --text:#1e1a14; --dim:#463f34; --muted:#776d5f;\n  --gold:#946512; --teal:#2b7a6c; --red:#ad452c; color-scheme:light;}}\n.cf-root .navback{display:inline-flex;align-items:center;padding:12px 12px 12px 4px;margin-right:4px;color:var(--muted);text-decoration:none;font-family:var(--mono);font-size:15px;border-right:1px solid var(--line);flex:none}\n.cf-root .navback:hover{color:var(--gold)}\n.cf-root .navwrap{max-width:760px;margin:0 auto;display:flex;align-items:center;padding:0 8px}\n.cf-root .navin{flex:1;min-width:0;max-width:none;margin:0}\n.cf-root .byline{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);text-align:center;margin:56px auto 8px}\n.cf-root :focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:2px}\n.cf-root .wrap{max-width:760px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0 96px}\n.cf-root .wrap>*{max-width:680px;margin-left:auto;margin-right:auto}\n.cf-root /* hero */\n.hero{padding-block:56px 40px}\n.cf-root .kicker{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-family:var(--sans);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}\n.cf-root h1{font-family:var(--display);font-weight:800;font-size:clamp(40px,8.4vw,72px);line-height:1.02;letter-spacing:-.02em;margin:18px 0 18px;text-wrap:balance}\n.cf-root .dek{font-size:clamp(18px,2.6vw,21px);line-height:1.6;color:var(--dim);margin:0 0 30px;max-width:58ch}\n.cf-root .board{background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:18px 16px 14px;display:grid;gap:12px}\n.cf-root .boardrow{display:grid;gap:6px}\n.cf-root .boardlbl{font-family:var(--sans);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}\n.cf-root .boardlbl.accent{color:var(--gold)}\n.cf-root .flaprow{display:flex;gap:3px;flex-wrap:nowrap;overflow:hidden}\n.cf-root .flap{flex:1 1 0;max-width:38px;min-width:0;aspect-ratio:.72;display:grid;place-items:center;background:var(--bg);border:1px solid var(--line);border-radius:3px;font-family:var(--mono);font-weight:600;font-size:clamp(13px,3.6vw,24px);color:var(--text);position:relative;font-variant-numeric:tabular-nums}\n.cf-root .flap::after{content:\"\";position:absolute;left:0;right:0;top:50%;height:1px;background:var(--line)}\n.cf-root .flap.sp{background:transparent;border-color:transparent}\n.cf-root .flap.sp::after{display:none}\n.cf-root .boardrow:nth-child(2) .flap:not(.sp){color:var(--gold)}\n.cf-root .boardfoot{font-family:var(--mono);font-size:11px;color:var(--muted);border-top:1px dashed var(--line);padding-top:10px;line-height:1.5}\n.cf-root .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:6px;overflow:hidden;margin-top:22px}\n.cf-root .stat{background:var(--bg);padding:14px 12px;min-width:0}\n.cf-root .statv{font-family:var(--mono);font-weight:600;font-size:24px;color:var(--text);font-variant-numeric:tabular-nums;height:32px}\n.cf-root .statl{font-family:var(--sans);font-size:12px;color:var(--muted);line-height:1.35;margin-top:4px}\n@media (max-width:560px){.cf-root .stats{grid-template-columns:repeat(2,1fr)}}\n.cf-root /* nav */\n.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--line);transition:transform .35s cubic-bezier(0.16,1,0.3,1);padding-top:env(safe-area-inset-top,0px);padding-left:env(safe-area-inset-left,0px);padding-right:env(safe-area-inset-right,0px)}\n.cf-root .navin{max-width:760px;margin:0 auto;display:flex;overflow-x:auto;scrollbar-width:none;padding:0 8px}\n.cf-root .navin::-webkit-scrollbar{display:none}\n.cf-root .navlink{display:flex;gap:6px;align-items:baseline;padding:14px 11px 12px;font-family:var(--sans);font-size:12.5px;font-weight:500;white-space:nowrap;color:var(--muted);text-decoration:none;border-bottom:2px solid transparent;transition:color .15s,border-color .15s}\n.cf-root .navlink:hover{color:var(--text)}\n.cf-root .navlink.on{color:var(--gold);border-bottom-color:var(--gold);font-weight:600}\n.cf-root .navnum{font-family:var(--mono);font-size:10.5px;opacity:.75}\n.cf-root /* chapters */\n.chhead{padding-block:64px 6px;border-top:1px solid var(--line);margin-top:40px;scroll-margin-top:64px}\n.cf-root .chnum{display:flex;justify-content:space-between;gap:12px;font-family:var(--mono);font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--gold)}\n.cf-root .chnum span{color:var(--muted)}\n.cf-root .chhead h2{font-family:var(--display);font-weight:700;font-size:clamp(28px,5vw,40px);line-height:1.12;letter-spacing:-.01em;margin:14px 0 22px;text-wrap:balance}\n.cf-root .body{font-size:18.5px;line-height:1.78;color:var(--dim);margin:0 0 24px}\n.cf-root .ed{font-family:var(--serif);font-style:italic;font-size:18px;line-height:1.78;color:var(--text);margin:8px 0 30px;padding-left:20px;border-left:2px solid color-mix(in srgb,var(--gold) 55%,transparent)}\n.cf-root .rf{color:var(--gold);font-family:var(--mono);font-size:9.5px;font-weight:600;cursor:pointer;margin-left:1px;opacity:.85;font-style:normal}\n.cf-root .rf:hover{opacity:1;text-decoration:underline}\n.cf-root .quote{margin:34px 0 36px;padding:0}\n.cf-root .quote blockquote{margin:0;font-family:var(--display);font-style:italic;font-weight:500;font-size:clamp(24px,4.4vw,32px);line-height:1.3;color:var(--text);text-wrap:balance}\n.cf-root .quote figcaption{margin-top:12px;font-family:var(--sans);font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}\n.cf-root .closer{font-family:var(--display);font-style:italic;font-size:clamp(22px,4vw,28px);line-height:1.35;color:var(--gold);margin:8px auto 0;text-wrap:balance}\n.cf-root /* figures */\n.fig{background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:18px 16px 16px;margin:34px 0 36px;min-width:0}\n.cf-root .figlabel{font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}\n.cf-root .figtitle{font-family:var(--sans);font-weight:600;font-size:16px;color:var(--text);margin:6px 0 14px}\n.cf-root .fignote{font-family:var(--sans);font-size:12.5px;line-height:1.5;color:var(--muted);margin-top:12px}\n.cf-root .figsrc{font-family:var(--sans);font-size:11px;color:var(--muted);text-align:right}\n.cf-root .chartbox{width:100%;min-width:0}\n.cf-root .tip{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:10px 12px;font-family:var(--sans);font-size:12.5px;max-width:240px;box-shadow:0 10px 30px rgba(0,0,0,.35)}\n.cf-root .tiplbl{font-family:var(--mono);font-size:11px;color:var(--muted);margin-bottom:4px}\n.cf-root .tipnote{color:var(--dim);margin-top:4px;line-height:1.4}\n.cf-root .vs{display:grid;grid-template-columns:1fr 1fr;gap:10px}\n.cf-root .vsc{border:1px solid var(--line);border-radius:4px;padding:14px;background:var(--bg)}\n.cf-root .vsc.hi{border-color:var(--gold)}\n.cf-root .vsl{font-family:var(--sans);font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}\n.cf-root .vsv{font-family:var(--mono);font-weight:600;font-size:clamp(26px,6vw,36px);margin:6px 0 2px;color:var(--text)}\n.cf-root .vsc.hi .vsv{color:var(--gold)}\n.cf-root .vss{font-family:var(--sans);font-size:12.5px;color:var(--dim)}\n.cf-root .blocks{display:flex;flex-wrap:wrap;gap:6px}\n.cf-root .blk{min-width:120px;min-height:110px;border:1px solid;border-radius:4px;padding:12px 12px 14px;position:relative;overflow:hidden;background:var(--bg);transition:opacity .2s}\n.cf-root .blkbar{position:absolute;left:0;right:0;bottom:0;height:3px}\n.cf-root .blkname{font-family:var(--sans);font-weight:600;font-size:13.5px;color:var(--text)}\n.cf-root .blkv{font-family:var(--mono);font-weight:600;font-size:22px;margin:4px 0}\n.cf-root .blksub{font-family:var(--sans);font-size:11.5px;color:var(--muted);line-height:1.35}\n.cf-root /* calculator */\n.calc{display:grid;gap:10px}\n.cf-root .calclbl{font-family:var(--sans);font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em}\n.cf-root .calcbig{height:46px;display:flex;align-items:baseline;font-family:var(--mono);font-weight:600;font-size:36px;color:var(--text);font-variant-numeric:tabular-nums}\n.cf-root input[type=range]{width:100%;accent-color:var(--gold);height:28px}\n.cf-root .calcscale{display:flex;justify-content:space-between;font-family:var(--mono);font-size:10.5px;color:var(--muted)}\n.cf-root .calcgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:6px}\n.cf-root .cc{height:96px;display:flex;flex-direction:column;justify-content:center;border:1px solid var(--line);border-radius:4px;padding:10px;background:var(--bg);min-width:0}\n.cf-root .cc.on{border-color:var(--gold)}\n.cf-root .cclbl{font-family:var(--sans);font-size:11px;color:var(--muted);line-height:1.3}\n.cf-root .ccv{font-family:var(--mono);font-weight:600;font-size:21px;color:var(--text);margin:4px 0 2px;font-variant-numeric:tabular-nums}\n.cf-root .cc.on .ccv{color:var(--gold)}\n.cf-root .ccsub{font-family:var(--sans);font-size:11px;color:var(--dim)}\n.cf-root .calcmeter{display:grid;gap:6px;margin-top:6px}\n.cf-root .meterrow{display:grid;grid-template-columns:56px 1fr;gap:10px;align-items:center;font-family:var(--mono);font-size:11px;color:var(--muted)}\n.cf-root .meter{height:8px;background:var(--line);border-radius:4px;overflow:hidden}\n.cf-root .meter>div{height:100%}\n@media (max-width:520px){.cf-root .calcgrid{grid-template-columns:1fr}\n.cf-root .cc{height:76px}}\n.cf-root /* timeline */\n.tlfilters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}\n.cf-root .chip{font-family:var(--sans);font-size:12.5px;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--dim);cursor:pointer;transition:background .15s,color .15s}\n.cf-root .chip:hover{color:var(--text)}\n.cf-root .chip.on{background:var(--text);color:var(--bg);border-color:var(--text)}\n.cf-root .tl{position:relative;padding-left:26px}\n.cf-root .tlline{position:absolute;left:8px;top:6px;bottom:6px;width:1.5px;background:linear-gradient(to bottom,var(--muted),var(--gold) 30%,var(--teal) 55%,var(--red) 70%,var(--teal) 85%,var(--muted));border-radius:1px}\n.cf-root .tlitem{position:relative;display:grid;grid-template-columns:52px 1fr;gap:10px;padding:9px 6px;border-radius:4px;transition:opacity .2s,background .15s}\n.cf-root .tlitem:hover{background:var(--card)}\n.cf-root .tldot{position:absolute;left:-23px;top:15px;width:9px;height:9px;border-radius:50%;border:2px solid var(--surface)}\n.cf-root .tly{font-family:var(--mono);font-weight:600;font-size:13px;color:var(--text)}\n.cf-root .tlt{font-family:var(--sans);font-size:14px;line-height:1.5;color:var(--dim);min-width:0}\n.cf-root /* lessons */\n.lessons{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:26px auto 10px}\n.cf-root .lesson{height:100%;border:1px solid var(--line);border-radius:6px;padding:16px;background:var(--surface);transition:border-color .2s}\n.cf-root .lesson:hover{border-color:var(--gold)}\n.cf-root .lessonhd{display:flex;justify-content:space-between;align-items:center;color:var(--gold)}\n.cf-root .lessonn{font-family:var(--mono);font-size:12px;font-weight:600}\n.cf-root .lesson h3{font-family:var(--display);font-weight:700;font-size:20px;line-height:1.2;margin:10px 0 8px;color:var(--text);text-wrap:balance}\n.cf-root .lesson p{font-family:var(--serif);font-size:15.5px;line-height:1.6;color:var(--dim);margin:0}\n@media (max-width:600px){.cf-root .lessons{grid-template-columns:1fr}}\n.cf-root /* sources */\n.sources{border-top:1px solid var(--line);margin-top:64px;padding-top:40px;scroll-margin-top:64px}\n.cf-root .sources h2{font-family:var(--display);font-size:30px;margin:0 0 18px}\n.cf-root .sources h3{font-family:var(--sans);font-weight:600;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin:34px 0 12px}\n.cf-root .srclist{list-style:none;padding:0;margin:0;display:grid;gap:2px}\n.cf-root .srclist li{display:grid;grid-template-columns:40px 1fr;gap:6px;font-family:var(--sans);font-size:13.5px;line-height:1.45;padding:6px 4px;border-radius:3px;scroll-margin-top:80px}\n.cf-root .srclist li:target,.cf-root .srclist li:hover{background:var(--card)}\n.cf-root .srcn{font-family:var(--mono);font-size:11.5px;color:var(--gold);padding-top:2px}\n.cf-root .srclist a{color:var(--dim);text-decoration:underline;text-decoration-color:var(--line);text-underline-offset:3px;overflow-wrap:anywhere}\n.cf-root .srclist a:hover{color:var(--text);text-decoration-color:var(--gold)}\n.cf-root .corr{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);border-radius:4px;overflow:hidden}\n.cf-root .corrrow{display:grid;grid-template-columns:170px 1fr;gap:12px;background:var(--bg);padding:10px 12px}\n.cf-root .corrk{font-family:var(--sans);font-weight:600;font-size:13px;color:var(--text)}\n.cf-root .corrv{font-family:var(--sans);font-size:13px;line-height:1.5;color:var(--dim);min-width:0}\n@media (max-width:520px){.cf-root .corrrow{grid-template-columns:1fr;gap:4px}}\n.cf-root .unv{font-family:var(--sans);font-size:13.5px;line-height:1.55;color:var(--dim);padding-left:18px;margin:0;display:grid;gap:6px}\n.cf-root .method{font-family:var(--sans);font-size:13.5px;line-height:1.65;color:var(--dim);margin:0}\n.cf-root .loading{padding:80px 16px;text-align:center;font-family:var(--mono);font-size:12px;color:var(--muted)}\n@media (prefers-reduced-motion: reduce){.cf-root *{transition:none!important;scroll-behavior:auto!important}}\n";

/* ---------- theme tokens for Recharts (SVG attributes cannot read CSS vars reliably) ---------- */
function readTokens() {
  var el = document.querySelector(".cf-root") || document.documentElement;
  var s = getComputedStyle(el);
  function g(n) { return s.getPropertyValue(n).trim(); }
  return { text: g("--text"), dim: g("--dim"), muted: g("--muted"), line: g("--line"), card: g("--card"), gold: g("--gold"), teal: g("--teal"), red: g("--red"), bg: g("--bg") };
}
function useTokens() {
  var st = useState(readTokens), t = st[0], setT = st[1];
  useEffect(function () {
    function upd() { setT(readTokens()); }
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", upd);
    upd();
    return function () { if (mq.removeEventListener) mq.removeEventListener("change", upd); };
  }, []);
  return t;
}

var chapters = [
  { id: "ch0", num: "00", short: "Elizabeth" },
  { id: "ch1", num: "01", short: "The Fleet" },
  { id: "ch2", num: "02", short: "Honolulu" },
  { id: "ch3", num: "03", short: "Bermuda" },
  { id: "ch4", num: "04", short: "Unmasked" },
  { id: "ch5", num: "05", short: "Spend-down" },
  { id: "ch6", num: "06", short: "Zero" },
  { id: "ch7", num: "07", short: "Playbook" },
  { id: "sources", num: "", short: "Sources" }
];

/* ---------- icons ---------- */
function SvgIcon(p) {
  return <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none" }}>{p.paths}</svg>;
}
function PlaneIcon(p) { return <SvgIcon {...p} paths={<path d="M10.5 13.5 3 11l1.5-1.5 7 1L16 6c1-1 3-1.5 3.5-1s0 2.5-1 3.5L14 13l1 7-1.5 1.5-2.5-7.5L8 17v2.5L6.5 21l-1-3.5L2 16.5 3.5 15H6z" />} />; }
function LockIcon(p) { return <SvgIcon {...p} paths={<g><rect x="5" y="11" width="14" height="10" rx="1.5" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></g>} />; }
function EyeIcon(p) { return <SvgIcon {...p} paths={<g><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></g>} />; }
function LeverIcon(p) { return <SvgIcon {...p} paths={<g><path d="M3 18h18" /><path d="M5 14 19 7" /><path d="m10 18 2-5 2 5" /></g>} />; }
function HourglassIcon(p) { return <SvgIcon {...p} paths={<g><path d="M6 3h12M6 21h12" /><path d="M7 3c0 5 10 5 10 9s-10 4-10 9" /><path d="M17 3c0 5-10 5-10 9s10 4 10 9" /></g>} />; }
function BuildingIcon(p) { return <SvgIcon {...p} paths={<g><path d="M4 21V9l8-5 8 5v12" /><path d="M9 21v-6h6v6" /><path d="M3 21h18" /></g>} />; }
function CompassIcon(p) { return <SvgIcon {...p} paths={<g><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></g>} />; }

/* ---------- primitives ---------- */
function FadeIn(props) {
  var st = useState(true), vis = st[0], setVis = st[1];
  var ref = useRef();
  useEffect(function () {
    var el = ref.current;
    if (!el || !window.IntersectionObserver) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight) return;
    setVis(false);
    var obs = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return function () { obs.disconnect(); };
  }, []);
  return <div ref={ref} style={{
    opacity: vis ? 1 : 0.55,
    transform: vis ? "translateY(0)" : "translateY(22px)",
    transition: "opacity .65s cubic-bezier(0.16,1,0.3,1) " + (props.delay || 0) + "s, transform .65s cubic-bezier(0.16,1,0.3,1) " + (props.delay || 0) + "s"
  }}>{props.children}</div>;
}
function P(props) { return <FadeIn><p className="body">{props.children}</p></FadeIn>; }
function Ed(props) { return <FadeIn><p className="ed">{props.children}</p></FadeIn>; }
function Rf(props) {
  return <sup className="rf" role="link" tabIndex={0} onClick={function () {
    var el = document.getElementById("src-" + props.n) || document.getElementById("sources");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }}>{"[" + props.n + "]"}</sup>;
}
function Quote(props) {
  return <FadeIn><figure className="quote"><blockquote>{props.children}</blockquote><figcaption>{props.who}</figcaption></figure></FadeIn>;
}
function ChapterHead(props) {
  return <header className="chhead" id={props.id}>
    <div className="chnum">{props.num ? "Chapter " + props.num : ""}<span>{props.years}</span></div>
    <h2>{props.title}</h2>
  </header>;
}
function Figure(props) {
  return <FadeIn><div className="fig"><div className="figlabel">{props.label}</div>{props.title ? <div className="figtitle">{props.title}</div> : null}{props.children}{props.note ? <div className="fignote">{props.note}</div> : null}</div></FadeIn>;
}

/* ---------- Animated counter ---------- */
function Counter(props) {
  var st = useState(props.to), v = st[0], setV = st[1];
  var ref = useRef(), done = useRef(false);
  useEffect(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var el = ref.current;
    var obs = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting || done.current) return;
      done.current = true; obs.disconnect();
      var t0 = performance.now();
      function step(t) {
        var k = Math.min(1, (t - t0) / 1400);
        var e = 1 - Math.pow(1 - k, 3);
        setV(props.to * e);
        if (k < 1) requestAnimationFrame(step); else setV(props.to);
      }
      setV(0); requestAnimationFrame(step);
    }, { threshold: 0.4 });
    obs.observe(el);
    return function () { obs.disconnect(); };
  }, []);
  var shown = props.dec ? v.toFixed(props.dec) : Math.round(v).toLocaleString("en-US");
  return <span ref={ref}>{(props.pre || "") + shown + (props.suf || "")}</span>;
}

/* ---------- Hero split-flap board ---------- */
var CH = "0123456789$,<";
function Flap(props) {
  var target = props.text;
  var st = useState(target), cur = st[0], setCur = st[1];
  useEffect(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var n = 0, id;
    function tick() {
      n++;
      var out = "";
      for (var i = 0; i < target.length; i++) {
        var settleAt = 6 + i * 2 + (props.lag || 0);
        if (n >= settleAt || target[i] === " ") out += target[i];
        else out += CH[Math.floor(Math.random() * 10)];
      }
      setCur(out);
      if (out !== target) id = setTimeout(tick, 55); else setCur(target);
    }
    id = setTimeout(tick, 300 + (props.lag || 0) * 40);
    return function () { clearTimeout(id); };
  }, []);
  return <div className="flaprow" aria-label={target}>
    {cur.split("").map(function (c, i) { return <span key={i} className={"flap" + (c === " " ? " sp" : "")} aria-hidden="true">{c}</span>; })}
  </div>;
}
function Hero() {
  return <section className="hero">
    <div className="kicker"><PlaneIcon size={15} /> Duty Free Shoppers · The Atlantic Philanthropies · 1931–2023</div>
    <h1>Chuck Feeney’s Last Check</h1>
    <p className="dek">In 1988 Forbes ranked him the 23rd richest American.<Rf n={19} /> He had already given the money away, secretly, four years earlier.<Rf n={1} /></p>
    <div className="board">
      <div className="boardrow"><div className="boardlbl">Forbes, 1988</div><Flap text="$1,300,000,000" /></div>
      <div className="boardrow"><div className="boardlbl accent">What he owned</div><Flap text="  <$5,000,000" lag={8} /></div>
      <div className="boardfoot">Departure: the entire fortune · Destination: five continents · Status: on time, 2020</div>
    </div>
    <div className="stats">
      <div className="stat"><div className="statv"><Counter pre="$" to={8} suf="B" /></div><div className="statl">granted over 38 years<Rf n={14} /></div></div>
      <div className="stat"><div className="statv"><Counter to={6500} /></div><div className="statl">grants made<Rf n={13} /></div></div>
      <div className="stat"><div className="statv"><Counter to={0} /></div><div className="statl">buildings with his name, of ~200 funded<Rf n={25} /></div></div>
      <div className="stat"><div className="statv"><Counter pre="$" to={2} suf="M" /></div><div className="statl">kept for retirement<Rf n={18} /></div></div>
    </div>
  </section>;
}

/* ---------- NavBar ---------- */
function NavBar(props) {
  var navRef = useRef();
  useEffect(function () {
    if (!navRef.current || !props.active) return;
    var el = navRef.current.querySelector('[data-ch="' + props.active + '"]');
    if (el) {
      var box = navRef.current;
      var L = el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2; if (box.scrollTo) box.scrollTo({ left: L, behavior: "smooth" }); else box.scrollLeft = L;
    }
  }, [props.active]);
  return <nav className="nav" style={{ transform: props.show ? "translateY(0)" : "translateY(-110%)" }} aria-label="Chapters">
    <div className="navwrap"><Link to="/research" className="navback" aria-label="Back to research">&larr;</Link>
    <div ref={navRef} className="navin">
      {chapters.map(function (ch) {
        var a = props.active === ch.id;
        return <a key={ch.id} data-ch={ch.id} href={"#" + ch.id} className={"navlink" + (a ? " on" : "")}
          onClick={function (e) {
            e.preventDefault();
            var el = document.getElementById(ch.id);
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 60, behavior: "smooth" });
          }}>{ch.num ? <span className="navnum">{ch.num}</span> : null}{ch.short}</a>;
      })}
    </div></div>
  </nav>;
}

/* ---------- Charts ---------- */
function Tip(props) {
  if (!props.active || !props.payload || !props.payload.length) return null;
  var d = props.payload[0].payload;
  return <div className="tip"><div className="tiplbl">{props.fmtLabel ? props.fmtLabel(props.label, d) : props.label}</div>
    {props.payload.map(function (p, i) { return <div key={i} style={{ color: p.color || p.fill }}>{p.name}: <strong>{props.fmt ? props.fmt(p.value) : p.value}</strong></div>; })}
    {d.note ? <div className="tipnote">{d.note}</div> : null}
  </div>;
}

var assets = [
  { y: 1984, v: 0.5, note: "Estimated value of the 38.75% DFS stake when transferred" },
  { y: 1997, v: 3.5, note: "Foundation value after the LVMH sale" },
  { y: 2007, v: 4.0, note: "Remaining to spend, at the biography launch" },
  { y: 2010, v: 2.2, note: "Endowment; $5.4B already granted" },
  { y: 2012, v: 1.5, note: "Left when the final five-year push began" },
  { y: 2016, v: 0, note: "Final grant commitment made in December" }
];
function SpendDownChart() {
  var t = useTokens();
  return <div className="chartbox" style={{ height: 290 }}>
    <R.ResponsiveContainer width="100%" height="100%">
      <R.AreaChart data={assets} margin={{ top: 14, right: 18, left: -8, bottom: 4 }}>
        <defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.teal} stopOpacity={0.45} /><stop offset="100%" stopColor={t.teal} stopOpacity={0.02} /></linearGradient></defs>
        <R.CartesianGrid stroke={t.line} strokeDasharray="2 5" vertical={false} />
        <R.XAxis dataKey="y" type="number" domain={[1982, 2020]} ticks={[1984, 1990, 1997, 2004, 2010, 2016, 2020]} tick={{ fill: t.muted, fontSize: 11, fontFamily: "IBM Plex Mono, monospace" }} stroke={t.line} tickLine={false} />
        <R.YAxis domain={[0, 4.5]} ticks={[0, 1, 2, 3, 4]} tickFormatter={function (v) { return "$" + v + "B"; }} tick={{ fill: t.muted, fontSize: 11, fontFamily: "IBM Plex Mono, monospace" }} stroke={t.line} tickLine={false} axisLine={false} />
        <R.Tooltip content={<Tip fmt={function (v) { return "$" + v.toFixed(1) + "B"; }} />} cursor={{ stroke: t.muted, strokeDasharray: "3 3" }} />
        <R.ReferenceLine x={2020} stroke={t.gold} strokeDasharray="4 4" label={{ value: "Closed", position: "insideTopRight", fill: t.gold, fontSize: 11, fontFamily: "IBM Plex Mono, monospace" }} />
        <R.Area type="linear" dataKey="v" name="Assets left to give" stroke={t.teal} strokeWidth={2} fill="url(#gA)" dot={{ r: 3.5, fill: t.teal, stroke: t.bg, strokeWidth: 2 }} activeDot={{ r: 6, fill: t.gold, stroke: t.bg, strokeWidth: 2 }} isAnimationActive={true} />
      </R.AreaChart>
    </R.ResponsiveContainer>
  </div>;
}

var unis = [
  { n: "Trinity College Dublin", s: "TCD", v: 207 },
  { n: "University of Limerick", s: "UL", v: 153 },
  { n: "Dublin City University", s: "DCU", v: 118 },
  { n: "University College Cork", s: "UCC", v: 90 },
  { n: "NUI Galway", s: "NUIG", v: 67 }
];
function UniChart() {
  var t = useTokens();
  return <div className="chartbox" style={{ height: 250 }}>
    <R.ResponsiveContainer width="100%" height="100%">
      <R.BarChart data={unis} layout="vertical" margin={{ top: 4, right: 44, left: 0, bottom: 4 }}>
        <R.CartesianGrid stroke={t.line} strokeDasharray="2 5" horizontal={false} />
        <R.XAxis type="number" domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} tickFormatter={function (v) { return "€" + v + "M"; }} tick={{ fill: t.muted, fontSize: 10, fontFamily: "IBM Plex Mono, monospace" }} stroke={t.line} tickLine={false} />
        <R.YAxis type="category" dataKey="s" width={46} tick={{ fill: t.dim, fontSize: 12, fontFamily: "IBM Plex Mono, monospace" }} stroke={t.line} tickLine={false} />
        <R.Tooltip content={<Tip fmtLabel={function (l, d) { return d.n; }} fmt={function (v) { return "€" + v + "M"; }} />} cursor={{ fill: t.line, fillOpacity: 0.35 }} />
        <R.Bar dataKey="v" name="Atlantic grants" radius={[0, 3, 3, 0]} barSize={22} label={{ position: "right", fill: t.dim, fontSize: 11, fontFamily: "IBM Plex Mono, monospace", formatter: function (v) { return "€" + v + "M"; } }}>
          {unis.map(function (u, i) { return <R.Cell key={i} fill={i === 0 ? t.gold : t.teal} fillOpacity={i === 0 ? 1 : 0.75} />; })}
        </R.Bar>
      </R.BarChart>
    </R.ResponsiveContainer>
  </div>;
}

/* ---------- Where the $8B went (proportional blocks) ---------- */
var blocks = [
  { name: "Everything else", sub: "US causes, South Africa, Australia, Bermuda, Cuba", v: 4.75, c: "--muted", n: 14 },
  { name: "Republic of Ireland", sub: "universities, ageing, children", v: 1.3, c: "--teal", n: 13 },
  { name: "Cornell", sub: "incl. $350M for Cornell Tech", v: 1.0, c: "--gold", n: 15 },
  { name: "Northern Ireland", sub: "peace, integrated schools", v: 0.57, c: "--teal", n: 13 },
  { name: "Vietnam", sub: "1997–2013, health and education", v: 0.38, c: "--red", n: 14 }
];
function Blocks() {
  var st = useState(null), hov = st[0], setHov = st[1];
  return <div>
    <div className="blocks">
      {blocks.map(function (d, i) {
        var col = "var(" + d.c + ")";
        return <div key={d.name} className="blk" onMouseEnter={function () { setHov(i); }} onMouseLeave={function () { setHov(null); }}
          style={{ flex: "1 1 " + Math.max(18, d.v / 8 * 100) + "%", borderColor: col, opacity: hov === null || hov === i ? 1 : 0.55 }}>
          <div className="blkbar" style={{ background: col }} />
          <div className="blkname">{d.name}<Rf n={d.n} /></div>
          <div className="blkv" style={{ color: col }}>{"$" + (d.v < 1 ? Math.round(d.v * 1000) + "M" : d.v.toFixed(2).replace(/0$/, "") + "B")}</div>
          <div className="blksub">{d.sub}</div>
        </div>;
      })}
    </div>
  </div>;
}

/* ---------- Feeney ratio calculator ---------- */
function fmtMoney(x) {
  if (x >= 1e9) return "$" + (x / 1e9).toFixed(x >= 1e10 ? 0 : 1) + "B";
  if (x >= 1e6) return "$" + (x / 1e6).toFixed(x >= 1e7 ? 0 : 1) + "M";
  if (x >= 1e3) return "$" + Math.round(x / 1e3).toLocaleString("en-US") + "K";
  return "$" + Math.round(x).toLocaleString("en-US");
}
function Calculator() {
  var st = useState(50), s = st[0], setS = st[1];
  var worth = Math.pow(10, 7 + (s / 100) * 4); // $10M to $100B
  var feeneyKeep = worth * (2e6 / 8.002e9);
  var pledgeKeep = worth * 0.5;
  var pct = 100 * feeneyKeep / worth;
  return <div className="calc">
    <label htmlFor="fortune" className="calclbl">Pick a fortune</label>
    <div className="calcbig"><span style={{ minWidth: 140, display: "inline-block" }}>{fmtMoney(worth)}</span></div>
    <input id="fortune" type="range" min="0" max="100" step="1" value={s} onChange={function (e) { setS(+e.target.value); }} aria-valuetext={fmtMoney(worth)} />
    <div className="calcscale"><span>$10M</span><span>$100M</span><span>$1B</span><span>$10B</span><span>$100B</span></div>
    <div className="calcgrid">
      <div className="cc"><div className="cclbl">Giving Pledge floor keeps</div><div className="ccv">{fmtMoney(pledgeKeep)}</div><div className="ccsub">at least half given</div></div>
      <div className="cc on"><div className="cclbl">Feeney’s ratio keeps</div><div className="ccv">{fmtMoney(feeneyKeep)}</div><div className="ccsub">{pct.toFixed(3) + "% of the total"}</div></div>
      <div className="cc"><div className="cclbl">Per $100,000 given</div><div className="ccv">$25</div><div className="ccsub">what Feeney held back</div></div>
    </div>
    <div className="calcmeter" aria-hidden="true">
      <div className="meterrow"><span>Pledge</span><div className="meter"><div style={{ width: "50%", background: "var(--muted)" }} /></div></div>
      <div className="meterrow"><span>Feeney</span><div className="meter"><div style={{ width: "0.6%", minWidth: 2, background: "var(--gold)" }} /></div></div>
    </div>
  </div>;
}

/* ---------- Timeline ---------- */
var tl = [
  { y: "1931", k: "life", t: "Born April 23 in Elizabeth, New Jersey, to Leo and Madaline Feeney.", n: 1 },
  { y: "1948", k: "life", t: "Enlists in the Air Force at 17; posted to Japan as a radio operator.", n: 23 },
  { y: "1956", k: "life", t: "Graduates from Cornell’s hotel school on the GI Bill.", n: 15 },
  { y: "1960", k: "biz", t: "November 7: Feeney and Bob Miller found Tourists International in Hong Kong, the company that becomes DFS.", n: 7 },
  { y: "1962", k: "biz", t: "Wins the Honolulu airport concession; DFS now runs airport stores in Hong Kong and Honolulu.", n: 5 },
  { y: "1982", k: "give", t: "Founds Atlantic in Bermuda. First grant creates the Cornell Tradition program.", n: 15 },
  { y: "1984", k: "give", t: "Quietly transfers his entire 38.75% DFS stake to the foundation.", n: 1 },
  { y: "1987", k: "give", t: "Sees the aftermath of the Enniskillen bombing; turns toward Northern Ireland.", n: 3 },
  { y: "1988", k: "rev", t: "Forbes lists him 23rd richest American at $1.3 billion.", n: 19 },
  { y: "1996", k: "biz", t: "December: LVMH buys out Feeney and a partner after years of talks.", n: 8 },
  { y: "1997", k: "rev", t: "January: facing a lawsuit, he tells The New York Times everything.", n: 3 },
  { y: "2011", k: "give", t: "$350M to launch Cornell Tech, Atlantic’s largest grant; signs the Giving Pledge.", n: 15 },
  { y: "2016", k: "give", t: "December: a final $7M grant to Cornell empties the commitment book.", n: 18 },
  { y: "2020", k: "give", t: "September 14: signs the papers dissolving Atlantic Philanthropies.", n: 14 },
  { y: "2023", k: "life", t: "Dies October 9 in San Francisco, aged 92.", n: 1 }
];
var tlColor = { life: "--muted", biz: "--gold", give: "--teal", rev: "--red" };
var tlName = { life: "Life", biz: "Business", give: "Giving", rev: "Exposure" };
function Timeline() {
  var st = useState("all"), f = st[0], setF = st[1];
  return <div>
    <div className="tlfilters" role="group" aria-label="Filter timeline">
      {["all", "life", "biz", "give", "rev"].map(function (k) {
        return <button key={k} className={"chip" + (f === k ? " on" : "")} onClick={function () { setF(k); }}
          style={k !== "all" ? { borderColor: "var(" + tlColor[k] + ")" } : null}>{k === "all" ? "All" : tlName[k]}</button>;
      })}
    </div>
    <div className="tl">
      <div className="tlline" />
      {tl.map(function (e, i) {
        var dim = f !== "all" && f !== e.k;
        return <div key={i} className="tlitem" style={{ opacity: dim ? 0.28 : 1 }}>
          <div className="tldot" style={{ background: "var(" + tlColor[e.k] + ")" }} />
          <div className="tly">{e.y}</div>
          <div className="tlt">{e.t}<Rf n={e.n} /></div>
        </div>;
      })}
    </div>
  </div>;
}

/* ---------- Lessons ---------- */
var lessons = [
  { i: HourglassIcon, h: "Set the end date first", b: "Atlantic decided to spend itself out of existence, and planned every program toward a 2020 close. A deadline turns an endowment into a budget, and a budget forces choices. Perpetual foundations never have to choose." },
  { i: EyeIcon, h: "Anonymity is a governance tool", b: "Without his name on anything, nobody lobbied Feeney for naming rights and no grant was shaped to flatter the donor. Secrecy kept the question narrow: does this work?" },
  { i: LeverIcon, h: "Buy leverage, then walk away", b: "In Ireland, $226M of Atlantic money pulled $1.3B of government money into research universities. The grant was the match that lit the state’s budget." },
  { i: CompassIcon, h: "Go to the grantee", b: "Atlantic didn’t take solicitations. Its staff went looking. Feeney ran philanthropy the way he ran DFS, by finding underpriced demand before anyone else saw it." },
  { i: BuildingIcon, h: "Fund institutions that compound", b: "Buildings, universities, health systems. Cornell Tech and Vietnam’s public health system will keep paying out long after the foundation that funded them stopped existing." },
  { i: LockIcon, h: "Decide before the money gets loud", b: "He moved the stake in 1984, when it was worth about $500M. By the time it was worth $1.6B, the decision had been made for twelve years." }
];

/* ---------- Sources ---------- */
var sources = [
  [1, "Boston Globe / NYT: Charles Feeney, who made a fortune and then gave it away, dies at 92 (2023)", "https://www.bostonglobe.com/2023/10/09/metro/charles-feeney-who-made-fortune-then-gave-it-away-dies-92"],
  [2, "Wikipedia: Chuck Feeney", "https://en.wikipedia.org/wiki/Chuck_Feeney"],
  [3, "Irish America via Atlantic Philanthropies: The billionaire who selflessly and quietly gave it all away", "https://www.atlanticphilanthropies.org/news/billionaire-who-selflessly-and-quietly-gave-it-all-away"],
  [4, "Encyclopedia.com: DFS Group Ltd. company history", "https://www.encyclopedia.com/books/politics-and-business-magazines/dfs-group-ltd"],
  [5, "Moodie Davitt Report: DFS prepares to exit Hawaii after 63 years", "https://moodiedavittreport.com/dfs-to-exit-hawaii-downtown-and-airport-operations-after-63-years/"],
  [6, "Moodie Davitt Report: Interview with DFS co-founder Bob Miller", "https://moodiedavittreport.com/the-moodie-interview-passion-and-perseverance-dfs-founder-bob-miller/"],
  [7, "DFS Group: History timeline (May 2023, PDF)", "https://dfs-res.cloudinary.com/image/upload/v1684291888/DFS_History_Timeline_All_May2023.pdf"],
  [8, "Washington Examiner: The Duke of Duty-Free", "https://www.washingtonexaminer.com/magazine/1379402/the-duke-of-duty-free/"],
  [9, "Atlantic Philanthropies archive: A fortunate life to give", "https://atlanticphilanthropies.org/?p=16431"],
  [10, "IrishCentral: Irish America Hall of Fame, Charles Feeney", "https://www.irishcentral.com/IrishAmerica/Irish-America-Hall-of-Fame-Charles-Feeney-117747753.html"],
  [11, "CNN: Charles Feeney, retail entrepreneur who gave $8 billion to charity, dies at 92", "https://abc17news.com/money/cnn-business-consumer/2023/10/09/charles-feeney-retail-entrepreneur-who-gave-8-billion-to-charity-dies-at-92/"],
  [12, "Irish Times: Atlantic quietly closes its doors in Ireland after 30 years", "https://www.irishtimes.com/news/ireland/irish-news/atlantic-quietly-closes-its-doors-in-ireland-after-30-years-of-philanthropy-1.3412071"],
  [13, "Laois Nationalist: Chuck Feeney dies aged 92 (Ireland and Northern Ireland totals)", "https://www.laois-nationalist.ie/irish-american-entrepreneur-and-philanthropist-chuck-feeney-dies-aged-92_arid-1273.html"],
  [14, "Wikipedia: The Atlantic Philanthropies", "https://en.wikipedia.org/wiki/Atlantic_Philanthropies"],
  [15, "Cornell University Library: Exhibition on Cornell’s most generous donor", "https://www.library.cornell.edu/?p=18795"],
  [16, "Inc.: The billionaire who inspired Warren Buffett", "https://www.inc.com/bill-murphy-jr/the-billionaire-who-inspired-warren-buffett-just-died-at-age-92-heres-why-buffett-called-him-his-hero.html"],
  [17, "Business Insider via Yahoo: Feeney has given away his entire $8 billion fortune (2020)", "https://news.yahoo.com/billionaire-chuck-feeney-finally-given-151948442.html"],
  [18, "Forbes (mirrored copy): Charles Feeney fulfills pledge to give all of his billions away", "https://dash.duchenneuk.org/charles-feeney-fulfills-pledge-to-give-all-of-his-billions-away.html"],
  [19, "Trinity College Dublin: Taoiseach launches Feeney biography (2007)", "https://www.tcd.ie/news_events/articles/taoiseach-launches-chuck-feeney-biography-at-trinity-college-dublin/"],
  [20, "IrishCentral, Niall O’Dowd: Chuck Feeney and the peace process", "https://www.irishcentral.com/opinion/niallodowd/chuck-feeney-irish-american.amp"],
  [21, "IrishCentral: The Feeney name, and the man who gave $8 billion away", "https://www.irishcentral.com/roots/genealogy/feeney-irish-last-name"],
  [22, "BBC via Atlantic Philanthropies: Chuck Feeney dies", "https://atlanticphilanthropies.org/?p=83445"],
  [23, "Philanthropy Roundtable: Secret Donor Man (book review)", "https://www.philanthropyroundtable.org/magazine/secret-donor-man/"],
  [24, "Documentary transcript: Secret Billionaire, The Chuck Feeney Story", "https://ceointerviews.ai/interview/979694/"],
  [25, "InvestmentNews: Feeney dies aged 92, with $8B giving-while-living legacy", "https://investmentnews.com/industry-news/philanthropist-chuck-feeney-dies-aged-92-with-8b-giving-while-living-legacy/244344"],
  [26, "Atlantic Philanthropies archive: On its way to spending itself out of existence", "https://atlanticphilanthropies.org/?p=16304"],
  [27, "Atlantic Philanthropies archive: €1bn on Irish projects, wound up quietly", "https://atlanticphilanthropies.org/?p=80686"],
  [28, "RMIT Vietnam: Vale Chuck Feeney", "https://www.rmit.edu.vn/news/all-news/2023/oct/vale-chuck-feeney"],
  [29, "Forbes Colombia: Remembering Chuck Feeney (Spanish edition of Forbes US profile)", "https://forbes.co/2023/10/10/editors-picks/recordando-a-chuck-feeney-el-millonario-que-quebro-al-regalar-su-fortuna/"],
  [30, "The Honorary Unsubscribe: Philanthropic entrepreneur Chuck Feeney", "https://honoraryunsubscribe.com/?p=5265"]
];
var corrections = [
  ["Sale value of the stake", "Reports range from $1.6B (court filings, per the Globe) to $1.63B (Wikipedia) to $2B (an Atlantic-archived profile). The site uses about $1.6B, the figure tied to legal filings."],
  ["Sale year", "One profile dates the LVMH purchase to 1997. The deal closed in December 1996; Feeney’s public disclosure followed in January 1997."],
  ["Forbes 1988 rank", "Described as “top 20” in one source. Trinity College Dublin and Niall O’Dowd both give 23rd; the site uses 23rd at $1.3B."],
  ["Reporter’s name", "One source spells the Times reporter as “David Cay Johnson.” The correct spelling is David Cay Johnston (corrected from general knowledge)."],
  ["Cornell total", "Obituaries say both “more than $1 billion” and “nearly $1 billion.” The site follows Cornell’s own library: nearly $1B."],
  ["Ireland total", "The Irish Times counts €1.1B across 1,030 grants in the Republic; the obituary count of $1.3B (Republic) plus $570M (Northern Ireland) covers the whole island in dollars. Both are used, with scope labeled."]
];
var unverified = [
  "Sixth Fleet scale in 1956 (50 ships, 30,000 sailors) comes from a documentary transcript only [24].",
  "The May 5, 2009 dinner where Feeney reportedly seeded the Giving Pledge idea is reported by Inc. [16]; Buffett has credited him as an inspiration, but the dinner detail is single-sourced.",
  "The $26M distributed to 2,400 long-serving DFS staff at the sale is from one IrishCentral piece [21].",
  "Asset values for 1984 and 2007 are estimates the sources themselves describe as speculative or approximate; the spend-down chart plots reported points only, joined by straight lines."
];

/* ---------- App ---------- */
export default function FeeneyLastCheck() {
  var s1 = useState(false), showNav = s1[0], setShowNav = s1[1];
  var s2 = useState("ch0"), active = s2[0], setActive = s2[1];
  var rafRef = useRef(null), lastRef = useRef("ch0");
  useEffect(function () { window.scrollTo(0, 0); }, []);
  useEffect(function () {
    function onScroll() {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(function () {
        rafRef.current = null;
        var sn = window.scrollY > window.innerHeight * 0.6;
        setShowNav(function (p) { return p === sn ? p : sn; });
        var found = chapters[0].id;
        for (var i = chapters.length - 1; i >= 0; i--) {
          var el = document.getElementById(chapters[i].id);
          if (el && el.getBoundingClientRect().top < 160) { found = chapters[i].id; break; }
        }
        if (found !== lastRef.current) { lastRef.current = found; setActive(found); }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return function () { window.removeEventListener("scroll", onScroll); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return <div className="cf-root">
    <Seo title="Chuck Feeney’s Last Check — Adib Choudhury" description="How the co-founder of Duty Free Shoppers secretly gave his entire fortune to The Atlantic Philanthropies, then spent it to zero. Eight chapters with charts, a timeline and 30 sources." />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,800;1,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700&display=swap" />
    <style>{CSS}</style>
    <NavBar active={active} show={showNav} />
    <main className="wrap">
      <Hero />

      <ChapterHead id="ch0" num="00" years="1931–1956" title="A boy from Elizabeth who sold everything twice" />
      <P>Charles Francis Feeney was born on April 23, 1931, in Elizabeth, New Jersey, the son of Irish American parents scraping through the Depression.<Rf n={1} /> As a kid he shoveled snow and sold Christmas cards door to door.<Rf n={30} /> At 17 he enlisted in the Air Force and was sent to Japan with a signals intelligence unit, a posting that taught him two habits he kept for life: a taste for working abroad and a talent for keeping quiet.<Rf n={9} /></P>
      <P>The GI Bill got him into Cornell’s School of Hotel Administration, paid out at $110 a month, which did not stretch far at an Ivy.<Rf n={10} /> So he became the campus “sandwich man,” selling sandwiches to fellow students and fraternity houses.<Rf n={9} /> He graduated in 1956 with four months of benefits left and no plan for the degree.<Rf n={10} /></P>
      <Ed>Pay attention to the GI Bill. A government program paid for the education of a man who would later hand $8 billion to universities, including nearly $1 billion back to the school that took his checks. You will not find a better return on public money in this story, and the story has a few.</Ed>

      <ChapterHead id="ch1" num="01" years="1956–1960" title="Fifty ships and nobody selling to them" />
      <P>Feeney drifted to France to study at Grenoble, and there he met an Englishman trying to sell duty-free goods to American sailors docking at Mediterranean ports.<Rf n={9} /> In Barcelona he ran into Bob Miller, a fellow Cornell hotel-school graduate.<Rf n={10} /> The pitch was simple. Every serviceman leaving port was entitled to buy goods free of tax, and someone had to be standing at the gangway when he did.</P>
      <P>The U.S. Sixth Fleet had about 50 ships in the Mediterranean in 1956, crewed by some 30,000 men.<Rf n={24} /> Feeney and Miller sold them tax-free liquor, then tax-free cars, which sailors paid for well before delivery. The business needed almost no capital and collected cash up front.<Rf n={24} /></P>
      <Ed>Any operator will recognize the shape: negative working capital, a captive customer, a regulatory gap. Feeney found the float before he found the product. Most founders get that order backwards.</Ed>

      <ChapterHead id="ch2" num="02" years="1960–1980s" title="The Japanese tour bus that built a fortune" />
      <P>On November 7, 1960, Miller and Feeney registered Tourists International in Hong Kong and won the duty-free concession at Kai Tak Airport, trading under the name Duty Free Shoppers.<Rf n={7} /> In the spring of 1962, a Cornell friend in Honolulu tipped Miller off to an upcoming tender for the airport store. Miller flew in from Hong Kong and filed just before the deadline. The first full year’s minimum guarantee to the airport was $24,500.<Rf n={5} /></P>
      <P>Honolulu looked like a small bet on a market that barely existed. Japanese travel to Hawaii was in its infancy, and the few visitors who came faced punishing taxes on luxury goods back home.<Rf n={5} /> Feeney is the partner credited with seeing what that meant. He noticed that about 80 percent of Japanese travelers came in package tours, so DFS advertised in Japanese travel magazines and paid tour guides and bus drivers to bring their groups to its stores.<Rf n={4} /> It hired Japanese-speaking staff as the outbound wave built after 1964.<Rf n={7} /></P>
      <P>From there the map filled in: Guam, Saipan, Singapore, Anchorage, Los Angeles, San Francisco.<Rf n={4} /> Two minority partners, Alan Parker and Tony Pilaro, joined in 1966.<Rf n={6} /> By the mid-1990s DFS was distributing as much as $300 million a year to its four owners.<Rf n={2} /></P>
      <Quote who="Feeney, to Irish America">“I did not want money to consume my life.”<Rf n={10} /></Quote>
      <P>By 50, Feeney had homes in New York, London, Paris, Honolulu, San Francisco, Aspen and on the French Riviera.<Rf n={1} /> Then he started dismantling the life those homes implied. He quit the clubs, bought clothes off the rack and switched to economy class.<Rf n={1} /> The famous plastic watch cost about $15.<Rf n={25} /></P>

      <ChapterHead id="ch3" num="03" years="1981–1988" title="How to disappear with half a billion dollars" />
      <P>The trigger was mundane. In 1981, Feeney was thinking through a $700,000 bequest to Cornell.<Rf n={10} /> His advisers told him to set up a foundation to handle all future giving, and he did, in Bermuda, specifically to escape the disclosure rules an American charity would face.<Rf n={3} /> He lived on the island for a year to establish residency, and his lawyers persuaded the Bermuda legislature to pass a law letting the charity operate in secret.<Rf n={8} /></P>
      <P>Atlantic was founded in 1982. Its first grant created the Cornell Tradition, a program for students who work and volunteer their way through school.<Rf n={15} /> Then, in 1984, Feeney transferred his entire 38.75 percent stake in DFS to the foundation.<Rf n={1} /> Since nothing was sold, the stake had no market price. Estimates put it above $500 million.<Rf n={1} /> He never took a tax deduction for any of it.<Rf n={3} /></P>
      <P>In Dublin, Atlantic’s office went by a brass plate that read Tara Consulting.<Rf n={27} /> Grantees received money from a source they could not name, and Atlantic staff were bound by rules that kept it that way.<Rf n={3} /></P>
      <Figure label="Fig. 1 · The hero board, explained" title="What Forbes saw versus what Feeney held">
        <div className="vs">
          <div className="vsc"><div className="vsl">Forbes 400, 1988</div><div className="vsv">$1.3B</div><div className="vss">23rd richest American<Rf n={19} /></div></div>
          <div className="vsc hi"><div className="vsl">Feeney’s actual net worth</div><div className="vsv">&lt;$5M</div><div className="vss">stake already owned by Atlantic<Rf n={21} /></div></div>
        </div>
      </Figure>
      <Ed>Here is the part that should stop any investor. Forbes ran a careful estimate of a private company, got the enterprise right, and got the owner completely wrong. Ownership was the one fact nobody thought to check, because nobody gives away a 38.75 percent stake in a cash machine and then keeps running the machine for free.</Ed>

      <ChapterHead id="ch4" num="04" years="1988–1997" title="The lawsuit that would have outed him, so he outed himself" />
      <P>Feeney wanted out of DFS. He wanted more cash flowing into Atlantic, and he believed the duty-free model had peaked.<Rf n={3} /> Talks with LVMH, the French luxury group, ran for about eight years, partly because two partners resisted selling. In December 1996 it bought out Feeney and one partner and took control of DFS.<Rf n={8} /></P>
      <P>Miller opposed the sale.<Rf n={2} /> A court fight would put the ownership records in front of the public, so Feeney moved first. In January 1997 he called two New York Times reporters, David Cay Johnston and Judith Miller, and told them everything.<Rf n={3} /> The filings put his share at $1.6 billion and showed it belonged to a Bermuda foundation that had been making anonymous gifts for 15 years.<Rf n={1} /> Atlantic emerged worth about $3.5 billion.<Rf n={3} /></P>
      <P>At the sale, Feeney set aside $26 million for some 2,400 of the longest-serving DFS employees.<Rf n={21} /></P>
      <Ed>He kept the secret through 15 years and a Forbes listing, and gave it up only when a lawsuit was about to give it up for him. Even the disclosure was a controlled exit. It was a very signals-intelligence way to go public.</Ed>

      <ChapterHead id="ch5" num="05" years="1987–2016" title="Spend it while you can see it work" />
      <P>Ireland came first emotionally. In November 1987 Feeney saw the aftermath of the IRA bombing at Enniskillen.<Rf n={3} /> His family’s roots ran back to County Fermanagh, the same county.<Rf n={28} /> He joined Americans for a New Irish Agenda, which shuttled between Northern Ireland and the Clinton White House pressing republicans toward negotiation, and he quietly funded loyalist groups working to stop the violence as well.<Rf n={3} /> Niall O’Dowd, who worked alongside him, says his biggest intervention came when Sinn Féin needed $1 million to open a Washington office and the process was on the line.<Rf n={20} /></P>
      <P>The bigger bet was the university system. Before Atlantic, Irish research universities ranked poorly; then Atlantic put €177 million into a national research program between 1999 and 2001 alone.<Rf n={12} /> As of 2014, $226 million in Atlantic grants had drawn $1.3 billion of government money into Irish universities.<Rf n={14} /> In 2012, nine universities on both sides of the border jointly gave him an honorary doctorate, something they had never done before.<Rf n={12} /></P>
      <Figure label="Fig. 2 · Ireland" title="Atlantic grants to five Irish universities" note="Euro totals as reported by The Irish Times at the Dublin office’s closing. Hover or tap a bar for the full name.">
        <UniChart />
        <div className="figsrc">Source<Rf n={12} /></div>
      </Figure>
      <P>Vietnam got $381.5 million between 1997 and 2013, much of it to modernize public and primary health care.<Rf n={14} /> RMIT’s Vietnam campus received more than $39 million to get started.<Rf n={28} /> Then came the AIDS clinics in South Africa, the cleft-palate surgeries through Operation Smile, a UCSF medical campus, earthquake relief in Haiti.<Rf n={1} /> In 2011 Atlantic made its largest single grant: $350 million to build Cornell Tech on Roosevelt Island.<Rf n={15} /></P>
      <Figure label="Fig. 3 · Where $8 billion went" title="Selected destinations, sized to the total" note="Approximate. The large block is the remainder after the four reported totals, and it includes U.S. health, ageing and policy work. Hover a block to isolate it.">
        <Blocks />
      </Figure>
      <P>Somewhere along the way Atlantic decided to spend itself out of existence. The staff did not wait for applications; as one Atlantic president put it, “we always approach them.”<Rf n={26} /> By 2007 there was about $4 billion left to give.<Rf n={19} /> By 2010 the endowment was $2.2 billion, with $5.4 billion already out the door.<Rf n={21} /> In 2012, at 81, Feeney had $1.5 billion left and a five-year runway.<Rf n={18} /></P>
      <Figure label="Fig. 4 · The spend-down" title="Atlantic’s assets left to give, $ billions" note="Reported data points only, joined by straight lines. Values before 1997 are estimates of a stake that was never priced. Hover a point for its context.">
        <SpendDownChart />
      </Figure>
      <Quote who="Feeney, as quoted in Forbes">“I want the last check I write to bounce.”<Rf n={18} /></Quote>

      <ChapterHead id="ch6" num="06" years="2016–2023" title="Zero is the point" />
      <P>The last grant went out in December 2016: $7 million to Cornell, for students doing community service.<Rf n={18} /> That closed the loop with the first grant, 34 years earlier, to the same kind of student at the same school. On September 14, 2020, Feeney and his wife Helga signed the papers dissolving Atlantic Philanthropies in a ceremony held online.<Rf n={14} /></P>
      <P>What he kept was about $2 million, enough for a rented two-bedroom apartment in San Francisco and the economy seats he insisted on.<Rf n={16} /> Bill Gates called him the ultimate example of giving while living. Warren Buffett, presenting him a Forbes 400 lifetime award in 2014, went further: “my hero and Bill Gates’ hero — he should be everybody’s hero.”<Rf n={1} /> Buffett has said Feeney was a cornerstone of the inspiration for the Giving Pledge, which he and Gates launched in 2010.<Rf n={29} /> Feeney signed it himself in 2011.<Rf n={25} /></P>
      <P>He died on October 9, 2023, at 92.<Rf n={1} /> Roughly 200 buildings he paid for stand on five continents. None of them carries his name.<Rf n={25} /></P>
      <Figure label="Fig. 5 · The Feeney ratio" title="What would you keep?" note="Feeney kept about $2M against roughly $8B given, about $25 for every $100,000. The Giving Pledge asks for at least half.">
        <Calculator />
      </Figure>
      <Quote who="Feeney, to Forbes, at Atlantic’s closing">“Try it, you’ll like it.”<Rf n={17} /></Quote>

      <ChapterHead id="ch7" num="07" years="For anyone with capital" title="The playbook" />
      <P>Strip away the Bermuda law and the plastic watch and Feeney left a method, one that works at $8 billion or $80,000. Six pieces of it travel.</P>
      <div className="lessons">
        {lessons.map(function (l, i) {
          var I = l.i;
          return <FadeIn key={i} delay={i * 0.04}><div className="lesson">
            <div className="lessonhd"><span className="lessonn">{"0" + (i + 1)}</span><span className="lessonic"><I size={18} /></span></div>
            <h3>{l.h}</h3><p>{l.b}</p>
          </div></FadeIn>;
        })}
      </div>
      <Figure label="Fig. 6 · The whole life" title="Timeline, 1931–2023" note="Filter by thread. Tap a reference to jump to its source.">
        <Timeline />
      </Figure>
      <P>The money is gone, which was the plan. The real test of Feeney’s idea is whether anyone else with a fortune chooses a closing date while they are still around to see it.</P>
      <p className="closer">That chapter belongs to whoever is reading this, and it has not been written yet.</p>

      <section id="sources" className="sources">
        <h2>Sources</h2>
        <ol className="srclist">
          {sources.map(function (s) {
            return <li key={s[0]} id={"src-" + s[0]}><span className="srcn">{"[" + s[0] + "]"}</span><a href={s[2]} target="_blank" rel="noopener noreferrer">{s[1]}</a></li>;
          })}
        </ol>
        <h3>Corrections applied</h3>
        <div className="corr">
          {corrections.map(function (c, i) { return <div key={i} className="corrrow"><div className="corrk">{c[0]}</div><div className="corrv">{c[1]}</div></div>; })}
        </div>
        <h3>Single-sourced or unverified</h3>
        <ul className="unv">{unverified.map(function (u, i) { return <li key={i}>{u}</li>; })}</ul>
        <h3>Method</h3>
        <p className="method">Each dated event and dollar figure was checked against at least one obituary, institutional record (Cornell University Library, Atlantic Philanthropies’ own archive, DFS’s published timeline) or major newspaper. Where sources disagreed, the figure tied to court filings or the receiving institution was preferred, and the disagreement is listed above. Atlantic did not file U.S. disclosures for much of its life, so its year-by-year balance sheet is incomplete; charts show only reported points. Quotations are kept short and attributed to the source that printed them. Research completed October 16, 2026.</p>
      </section>
      <div className="byline">A narrative by Claude · October 2026</div>
    </main>
    <ResearchFooter currentSlug="feeney" />
  </div>;
}

