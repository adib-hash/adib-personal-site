import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

// ───────────────────────────────────────────────────────────────────────────
// SOURCES — primary SEC filings + external hyperscaler-capex context.
// ───────────────────────────────────────────────────────────────────────────
const S = {
  q1fy23: "https://ir.amd.com/news-events/press-releases/detail/1128/amd-reports-first-quarter-2023-financial-results",
  q2fy23: "https://ir.amd.com/news-events/press-releases/detail/1146/amd-reports-second-quarter-2023-financial-results",
  q3fy23: "https://ir.amd.com/news-events/press-releases/detail/1163/amd-reports-third-quarter-2023-financial-results",
  q4fy23: "https://ir.amd.com/financial-information/sec-filings/content/0000002488-24-000012/0000002488-24-000012.pdf",
  q1fy24: "https://ir.amd.com/news-events/press-releases/detail/1192/amd-reports-first-quarter-2024-financial-results",
  q2fy24: "https://ir.amd.com/news-events/press-releases/detail/1209/amd-reports-second-quarter-2024-financial-results",
  q3fy24: "https://ir.amd.com/news-events/press-releases/detail/1224/amd-reports-third-quarter-2024-financial-results",
  q4fy24: "https://ir.amd.com/news-events/press-releases/detail/1236/amd-reports-fourth-quarter-and-full-year-2024-financial-results",
  q1fy25: "https://ir.amd.com/news-events/press-releases/detail/1247/amd-reports-first-quarter-2025-financial-results",
  q2fy25: "https://ir.amd.com/news-events/press-releases/detail/1257/amd-reports-second-quarter-2025-financial-results",
  q3fy25: "https://ir.amd.com/news-events/press-releases/detail/1265/amd-reports-third-quarter-2025-financial-results",
  q4fy25: "https://ir.amd.com/news-events/press-releases/detail/1276/amd-reports-fourth-quarter-and-full-year-2025-financial-results",

  fy23_10k: "https://ir.amd.com/financial-information/sec-filings/content/0000002488-24-000012/0000002488-24-000012.pdf",
  fy24_10k: "https://ir.amd.com/financial-information/sec-filings/content/0000002488-25-000012/amd-20241228.htm",
  fy25_10ka: "https://ir.amd.com/financial-information/sec-filings/content/0000002488-26-000021/amd-20251227.htm",
  q1fy25_10q: "https://ir.amd.com/financial-information/sec-filings/content/0000002488-25-000047/amd-20250329.htm",
  q2fy25_10q: "https://ir.amd.com/financial-information/sec-filings/content/0000002488-25-000108/amd-20250628.htm",
  q3fy25_10q: "https://ir.amd.com/financial-information/sec-filings/content/0000002488-25-000166/amd-20250927.htm",

  epoch: "https://epoch.ai/data-insights/hyperscaler-capex-trend",
  creditsights: "https://know.creditsights.com/insights/technology-hyperscaler-capex-2026-estimates/",
  visualcapitalist: "https://www.visualcapitalist.com/visualized-big-tech-ai-spending/",
  futurum: "https://futurumgroup.com/insights/ai-capex-2026-the-690b-infrastructure-sprint/",
};

// Little superscript citation component
function Cite({ href, n }) {
  return (
    <sup>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#c83c4a",
          textDecoration: "none",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7em",
          marginLeft: 2,
          padding: "0 2px",
          border: "1px solid rgba(200, 60, 74, 0.35)",
          borderRadius: 2,
        }}
      >
        [{n}]
      </a>
    </sup>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// DATA — AMD quarterly fundamentals, verified against primary SEC filings.
// Fiscal year = calendar year. COGS = "cost of sales" line (excludes
// amortization of acquired intangibles; AMD's GAAP GM runs 2–4 pts lower).
// ───────────────────────────────────────────────────────────────────────────
const RAW = [
  { q: "Q1 FY23", rev:  5353, cogs: 2689, inv: 4235, ar: 4040, supplyCommit: null,  provision: null,  src: S.q1fy23 },
  { q: "Q2 FY23", rev:  5359, cogs: 2704, inv: 4567, ar: 4312, supplyCommit: null,  provision: null,  src: S.q2fy23 },
  { q: "Q3 FY23", rev:  5800, cogs: 2843, inv: 4445, ar: 5054, supplyCommit: null,  provision: null,  src: S.q3fy23 },
  { q: "Q4 FY23", rev:  6168, cogs: 3042, inv: 4351, ar: 4323, supplyCommit: 4.59,  provision: null,  src: S.q4fy23 },
  { q: "Q1 FY24", rev:  5473, cogs: 2683, inv: 4652, ar: 5038, supplyCommit: 4.00,  provision: 65,    src: S.q1fy24 },
  { q: "Q2 FY24", rev:  5835, cogs: 2740, inv: 4991, ar: 5749, supplyCommit: 3.90,  provision: null,  src: S.q2fy24 },
  { q: "Q3 FY24", rev:  6819, cogs: 3167, inv: 5374, ar: 7241, supplyCommit: 4.30,  provision: null,  src: S.q3fy24 },
  { q: "Q4 FY24", rev:  7658, cogs: 3524, inv: 5734, ar: 6192, supplyCommit: 4.97,  provision: null,  src: S.q4fy24 },
  { q: "Q1 FY25", rev:  7438, cogs: 3451, inv: 6416, ar: 5443, supplyCommit: 8.20,  provision: null,  src: S.q1fy25 },
  { q: "Q2 FY25", rev:  7685, cogs: 4366, inv: 6677, ar: 5115, supplyCommit: 9.44,  provision: 800,   src: S.q2fy25 },
  { q: "Q3 FY25", rev:  9246, cogs: 4206, inv: 7313, ar: 6201, supplyCommit: 12.12, provision: null,  src: S.q3fy25 },
  { q: "Q4 FY25", rev: 10270, cogs: 4433, inv: 7920, ar: 6315, supplyCommit: 12.20, provision: -360,  src: S.q4fy25 },
];

const DATA = RAW.map((row, i) => {
  const dsi = (row.inv / row.cogs) * 91;
  const gm = ((row.rev - row.cogs) / row.rev) * 100;
  const invRev = (row.inv / row.rev) * 100;
  const arRev = (row.ar / row.rev) * 100;
  const prior = RAW[i - 4];
  const revYoY = prior ? (row.rev / prior.rev - 1) * 100 : null;
  const invYoY = prior ? (row.inv / prior.inv - 1) * 100 : null;
  return { ...row, dsi, gm, invRev, arRev, revYoY, invYoY };
});

// Chart height responsive to viewport width — shrinks charts on phones.
function useChartHeight(base = 320, mobile = 260) {
  const [h, setH] = React.useState(() =>
    typeof window !== "undefined" && window.innerWidth < 480 ? mobile : base
  );
  React.useEffect(() => {
    const onResize = () => setH(window.innerWidth < 480 ? mobile : base);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [base, mobile]);
  return h;
}


// Hyperscaler capex (shared with NVIDIA analysis — same customer cohort).
// AMD fiscal year = calendar year, so direct CY mapping.
const CAPEX = [
  { year: "FY23", calYr: "CY23", capex: 156, amdInv: 4.35, label: "GPT-4 inflection; ROCm early" },
  { year: "FY24", calYr: "CY24", capex: 256, amdInv: 5.73, label: "MI300X ramp; Instinct >$5B" },
  { year: "FY25", calYr: "CY25", capex: 448, amdInv: 7.92, label: "MI325X + MI350 launch" },
  { year: "FY26E", calYr: "CY26E", capex: 660, amdInv: null, label: "MI400 series guidance" },
];

// ───────────────────────────────────────────────────────────────────────────
// PALETTE — AMD crimson-forward, otherwise matches NVIDIA piece's rhythm.
// ───────────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0b",
  panel: "#121214",
  panelEdge: "#1f1f23",
  ink: "#ece9e4",
  inkDim: "#8a8680",
  inkMute: "#5a5652",
  accent: "#c83c4a",   // crimson: inventory, primary series
  danger:  "#d97f2b",  // burnt amber: risk / commitments
  signal:  "#5f9585",  // cool sage: revenue, margin, good signals
  revenue: "#5f9585",
  inventory: "#c83c4a",
  capex:   "#6a8fb5",  // muted steel blue: external demand context
  accentDim: "rgba(200, 60, 74, 0.35)",
};

const axisStyle = { fill: C.inkDim, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" };
const gridStyle = { stroke: C.panelEdge };

// ───────────────────────────────────────────────────────────────────────────
// GLOBAL CSS — dimensions mirror the NVIDIA piece exactly.
// ───────────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: ${C.bg}; color: ${C.ink}; }
    body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

    .container { max-width: 1100px; margin: 0 auto; padding: 64px 48px 96px; }

    .eyebrow { color: ${C.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; }
    .eyebrow-small { color: ${C.inkMute}; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.12em; }
    .eyebrow-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; }
    h1.title { font-family: 'Fraunces', Georgia, serif; font-weight: 400; font-size: 56px; line-height: 1.05; letter-spacing: -0.025em; margin: 0 0 20px; color: ${C.ink}; text-wrap: balance; }
    p.lede { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: ${C.inkDim}; max-width: 680px; margin: 0; }
    .subtitle { color: ${C.inkDim}; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; max-width: 680px; margin: 0 0 32px 32px; }

    .section { margin-bottom: 88px; }
    .section-header { display: flex; align-items: baseline; gap: 16px; margin-bottom: 8px; }
    .section-title { color: ${C.ink}; font-family: 'Fraunces', Georgia, serif; font-weight: 400; font-size: 28px; margin: 0; letter-spacing: -0.01em; }
    .section-body { margin-left: 32px; }
    .panel { background: ${C.panel}; border: 1px solid ${C.panelEdge}; padding: 24px; }
    .panel-no-pad { background: ${C.panel}; border: 1px solid ${C.panelEdge}; }

    .kpi-strip { display: flex; flex-wrap: wrap; padding: 0; margin-bottom: 48px; }
    .kpi { flex: 1; min-width: 160px; padding: 20px 24px; border-right: 1px solid ${C.panelEdge}; }
    .kpi:last-child { border-right: none; }
    .kpi-label { color: ${C.inkMute}; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; margin-bottom: 8px; }
    .kpi-value { color: ${C.ink}; font-family: 'Fraunces', Georgia, serif; font-size: 30px; font-weight: 400; letter-spacing: -0.02em; }
    .kpi-delta { font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-top: 6px; }

    .verdict { padding-left: 16px; margin-top: 20px; border-left: 2px solid ${C.accent}; }
    .verdict.red { border-left-color: ${C.danger}; }
    .verdict.green { border-left-color: ${C.signal}; }
    .verdict-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; margin-bottom: 6px; }
    .verdict-body { color: ${C.ink}; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.65; }

    .bullet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .bullet-list { margin: 0; padding-left: 18px; color: ${C.ink}; line-height: 1.75; font-size: 14px; }
    .bullet-list li { margin-bottom: 8px; }

    .method-table { border: 1px solid ${C.panelEdge}; font-family: 'Inter', sans-serif; font-size: 13px; }
    .method-header { display: grid; grid-template-columns: 1.3fr 1.4fr 1.4fr 0.6fr 2fr; padding: 14px 20px; background: ${C.panel}; border-bottom: 1px solid ${C.panelEdge}; color: ${C.inkMute}; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; }
    .method-row { display: grid; grid-template-columns: 1.3fr 1.4fr 1.4fr 0.6fr 2fr; padding: 16px 20px; border-bottom: 1px solid ${C.panelEdge}; color: ${C.ink}; line-height: 1.55; }
    .method-row:last-child { border-bottom: none; }

    .ledger { border: 1px solid ${C.panelEdge}; font-family: 'JetBrains Mono', monospace; font-size: 11px; overflow-x: auto; }
    .ledger-desktop { display: block; min-width: 820px; }
    .ledger-mobile { display: none; }
    .ledger-header { display: grid; grid-template-columns: 80px 70px 70px 70px 70px 60px 60px 80px 100px 60px; padding: 12px 16px; background: ${C.panel}; border-bottom: 1px solid ${C.panelEdge}; color: ${C.inkMute}; font-size: 10px; letter-spacing: 0.1em; }
    .ledger-row { display: grid; grid-template-columns: 80px 70px 70px 70px 70px 60px 60px 80px 100px 60px; padding: 10px 16px; border-bottom: 1px solid ${C.panelEdge}; color: ${C.ink}; }
    .ledger-row:last-child { border-bottom: none; }
    .ledger-right { text-align: right; }
    .ledger-dim { color: ${C.inkDim}; }

    a { color: ${C.accent}; }
    a.src-link { color: ${C.inkMute}; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.05em; }
    a.src-link:hover { color: ${C.accent}; }

    .sources-list { font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.8; color: ${C.inkDim}; }
    .sources-list li { margin-bottom: 8px; padding-left: 8px; }
    .sources-list a { color: ${C.accent}; text-decoration: none; border-bottom: 1px solid ${C.accentDim}; }
    .sources-list a:hover { border-bottom-color: ${C.accent}; }

    .footer { margin-top: 80px; padding-top: 32px; border-top: 1px solid ${C.panelEdge}; color: ${C.inkMute}; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; line-height: 1.7; }

    .recharts-text { font-family: 'JetBrains Mono', monospace; }

    /* ═════════════════════════════════════════════════════════════
       MOBILE — < 768px: stack everything, simplify tables, smaller type
       ═════════════════════════════════════════════════════════════ */
    @media (max-width: 768px) {
      .container { padding: 32px 20px 64px; }

      h1.title { font-size: 36px; line-height: 1.08; }
      .section-title { font-size: 22px; }
      p.lede { font-size: 15px; }
      .subtitle { margin-left: 0; font-size: 13px; }
      .section-body { margin-left: 0; }
      .section { margin-bottom: 56px; }

      .panel { padding: 18px; }

      .kpi-strip { flex-direction: column; }
      .kpi { border-right: none; border-bottom: 1px solid ${C.panelEdge}; padding: 16px 20px; }
      .kpi:last-child { border-bottom: none; }
      .kpi-value { font-size: 26px; }

      .bullet-grid { grid-template-columns: 1fr; gap: 24px; }

      .method-header { display: none; }
      .method-row {
        display: block;
        padding: 16px;
        border-bottom: 1px solid ${C.panelEdge};
      }
      .method-row > div {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        padding: 4px 0;
      }
      .method-row > div::before {
        color: ${C.inkMute};
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
        letter-spacing: 0.12em;
        flex-shrink: 0;
        padding-top: 2px;
      }
      .method-row > div:nth-child(1)::before { content: 'METRIC'; width: 70px; }
      .method-row > div:nth-child(2)::before { content: 'HEALTHY'; width: 70px; }
      .method-row > div:nth-child(3)::before { content: 'WORRY'; width: 70px; }
      .method-row > div:nth-child(4)::before { content: 'AMD'; width: 70px; }
      .method-row > div:nth-child(5)::before { content: 'NOTE'; width: 70px; }
      .method-row > div > * { text-align: right; flex: 1; }

      .ledger-desktop { display: none; }
      .ledger-mobile { display: block; }

      a.src-link { font-size: 12px !important; padding: 4px 6px; display: inline-block; }

      sup a {
        font-size: 0.8em !important;
        padding: 3px 5px !important;
        margin: 0 2px !important;
        display: inline-block;
        min-height: 18px;
        line-height: 1.3;
      }
    }
    @media (max-width: 480px) {
      .kpi-strip { flex-direction: row; flex-wrap: wrap; }
      .kpi {
        flex: 0 0 50%;
        max-width: 50%;
        min-width: 0;
        border-right: 1px solid ${C.panelEdge};
        border-bottom: 1px solid ${C.panelEdge};
        padding: 14px 16px;
      }
      .kpi:nth-child(2n) { border-right: none; }
      .kpi:nth-last-child(-n+1) { border-bottom: none; }
      .kpi-value { font-size: 22px; }
      .kpi-label { font-size: 9px; letter-spacing: 0.12em; }
      .kpi-delta { font-size: 10px; }
      h1.title { font-size: 32px; }
    }


    @media (min-width: 769px) and (max-width: 1024px) {
      .container { padding: 48px 32px 80px; }
      h1.title { font-size: 44px; }
    }
  `}</style>
);

// ───────────────────────────────────────────────────────────────────────────
// TOOLTIP
// ───────────────────────────────────────────────────────────────────────────
function TooltipBox({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "#0a0a0b", border: `1px solid ${C.panelEdge}`, padding: "10px 14px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
      <div style={{ color: C.ink, marginBottom: 6, fontWeight: 500 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <span>{p.name}</span>
          <span>{formatter ? formatter(p.value, p.dataKey) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ───────────────────────────────────────────────────────────────────────────
function Section({ id, num, title, subtitle, children }) {
  return (
    <section id={id} className="section">
      <div className="section-header">
        <span className="eyebrow-small">{num}</span>
        <h2 className="section-title">{title}</h2>
      </div>
      {subtitle && <p className="subtitle">{subtitle}</p>}
      <div className="section-body">{children}</div>
    </section>
  );
}

function Verdict({ tone, label, children }) {
  return (
    <div className={`verdict ${tone === "red" ? "red" : tone === "green" ? "green" : ""}`}>
      <div className="verdict-label" style={{ color: tone === "red" ? C.danger : tone === "green" ? C.signal : C.accent }}>{label}</div>
      <div className="verdict-body">{children}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 1 — Divergence
// ───────────────────────────────────────────────────────────────────────────
function DivergenceChart() {
  const data = DATA.filter((d) => d.revYoY != null);
  const chartH = useChartHeight(320, 260);
  return (
    <ResponsiveContainer width="100%" height={chartH}>
      <LineChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} interval="preserveStartEnd" minTickGap={12} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<TooltipBox formatter={(v) => `${v.toFixed(1)}%`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="plainline" />
        <ReferenceLine y={0} stroke={C.inkMute} strokeDasharray="2 2" />
        <Line type="monotone" dataKey="revYoY" name="Revenue YoY" stroke={C.revenue} strokeWidth={2} dot={{ r: 3, fill: C.revenue, strokeWidth: 0 }} activeDot={{ r: 7 }} />
        <Line type="monotone" dataKey="invYoY" name="Inventory YoY" stroke={C.accent} strokeWidth={2} dot={{ r: 3, fill: C.accent, strokeWidth: 0 }} activeDot={{ r: 7 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 2 — DSI
// ───────────────────────────────────────────────────────────────────────────
function DsiChart() {
  const chartH = useChartHeight(320, 260);
  return (
    <ResponsiveContainer width="100%" height={chartH}>
      <ComposedChart data={DATA} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} interval="preserveStartEnd" minTickGap={12} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}d`} domain={[100, 200]} />
        <Tooltip content={<TooltipBox formatter={(v) => `${v.toFixed(0)} days`} />} cursor={{ stroke: C.panelEdge }} />
        <ReferenceLine y={140} stroke={C.inkMute} strokeDasharray="3 3" />
        <Line type="monotone" dataKey="dsi" name="DSI" stroke={C.accent} strokeWidth={2.5} dot={{ r: 4, fill: C.accent, strokeWidth: 0 }} activeDot={{ r: 8 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 3 — Margin + Provisions
// ───────────────────────────────────────────────────────────────────────────
function MarginProvisionChart() {
  const chartH = useChartHeight(320, 260);
  return (
    <ResponsiveContainer width="100%" height={chartH}>
      <ComposedChart data={DATA} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} interval="preserveStartEnd" minTickGap={12} />
        <YAxis yAxisId="gm" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[35, 65]} />
        <YAxis yAxisId="prov" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} domain={[-500, 1000]} />
        <Tooltip content={<TooltipBox formatter={(v, key) => key === "gm" ? `${v.toFixed(1)}%` : `${v >= 0 ? "+" : ""}$${v.toLocaleString()}M`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="plainline" />
        <ReferenceLine yAxisId="prov" y={0} stroke={C.inkMute} strokeDasharray="2 2" />
        <Bar yAxisId="prov" dataKey="provision" name="Inv charge/release ($M)" fill={C.danger} opacity={0.85} barSize={14}>
          {DATA.map((d, i) => (
            <Cell key={i} fill={d.provision != null && d.provision < 0 ? C.signal : C.danger} />
          ))}
        </Bar>
        <Line yAxisId="gm" type="monotone" dataKey="gm" name="Gross Margin %" stroke={C.signal} strokeWidth={2.5} dot={{ r: 3, fill: C.signal, strokeWidth: 0 }} activeDot={{ r: 7 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 4 — Channel-stuffing check
// ───────────────────────────────────────────────────────────────────────────
function ChannelCheckChart() {
  const chartH = useChartHeight(320, 260);
  return (
    <ResponsiveContainer width="100%" height={chartH}>
      <LineChart data={DATA} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} interval="preserveStartEnd" minTickGap={12} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[40, 120]} />
        <Tooltip content={<TooltipBox formatter={(v) => `${v.toFixed(1)}%`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="plainline" />
        <Line type="monotone" dataKey="invRev" name="Inventory / Revenue" stroke={C.accent} strokeWidth={2} dot={{ r: 3, fill: C.accent, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="arRev" name="A/R / Revenue" stroke={C.danger} strokeWidth={2} dot={{ r: 3, fill: C.danger, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 5 — Supply Commitments
// ───────────────────────────────────────────────────────────────────────────
function SupplyCommitChart() {
  const data = DATA.filter((d) => d.supplyCommit != null);
  const chartH = useChartHeight(320, 260);
  return (
    <ResponsiveContainer width="100%" height={chartH}>
      <ComposedChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} interval="preserveStartEnd" minTickGap={12} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} domain={[0, 14]} />
        <Tooltip content={<TooltipBox formatter={(v) => `$${v.toFixed(2)}B`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="square" />
        <Bar dataKey="supplyCommit" name="Unconditional purchase commitments ($B)" fill={C.danger} opacity={0.85} barSize={24} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 6 — Hyperscaler Capex vs AMD Inventory
// ───────────────────────────────────────────────────────────────────────────
function HyperscalerChart() {
  const chartH = useChartHeight(340, 280);
  return (
    <ResponsiveContainer width="100%" height={chartH}>
      <ComposedChart data={CAPEX} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="year" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} interval="preserveStartEnd" minTickGap={12} />
        <YAxis yAxisId="capex" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} />
        <YAxis yAxisId="inv" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} domain={[0, 10]} />
        <Tooltip content={<TooltipBox formatter={(v) => `$${v}B`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="square" />
        <Bar yAxisId="capex" dataKey="capex" name="Top-5 hyperscaler capex ($B)" fill={C.capex} opacity={0.6} barSize={40} />
        <Line yAxisId="inv" type="monotone" dataKey="amdInv" name="AMD ending inventory ($B)" stroke={C.accent} strokeWidth={2.5} dot={{ r: 5, fill: C.accent, strokeWidth: 0 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// KPI STRIP
// ───────────────────────────────────────────────────────────────────────────
function KpiStrip() {
  const latest = DATA[DATA.length - 1];
  const pct = (v) => `${v >= 0 ? "+" : ""}${v.toFixed(0)}%`;
  return (
    <div className="kpi-strip panel-no-pad" style={{ padding: 0 }}>
      <div className="kpi">
        <div className="kpi-label">LATEST</div>
        <div className="kpi-value">{latest.q}</div>
        <div className="kpi-delta" style={{ color: C.inkMute }}>ENDED DEC 27, 2025</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">REVENUE</div>
        <div className="kpi-value">${(latest.rev / 1000).toFixed(1)}B</div>
        <div className="kpi-delta" style={{ color: C.signal }}>{pct(latest.revYoY)} YoY</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">INVENTORY</div>
        <div className="kpi-value">${(latest.inv / 1000).toFixed(1)}B</div>
        <div className="kpi-delta" style={{ color: C.accent }}>{pct(latest.invYoY)} YoY</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">DSI</div>
        <div className="kpi-value">{latest.dsi.toFixed(0)}d</div>
        <div className="kpi-delta" style={{ color: C.inkMute }}>3-yr range 130–170</div>
      </div>
      <div className="kpi">
        <div className="kpi-label">SUPPLY COMMITS</div>
        <div className="kpi-value">${latest.supplyCommit.toFixed(1)}B</div>
        <div className="kpi-delta" style={{ color: C.danger }}>+166% vs FY23</div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// SCORECARD
// ───────────────────────────────────────────────────────────────────────────
function MethodTable() {
  const rows = [
    { metric: "Inv YoY vs. Rev YoY",   healthy: "Within ±10 pts",      worry: "30+ pt gap, 2Q+",    amd: "HEALTHY", comment: "Max gap +7.6 pts. Inventory tracks revenue closely — unlike NVDA." },
    { metric: "DSI trend",              healthy: "Stable / declining",  worry: "3+Q rise vs history", amd: "MIXED",  comment: "150–170d range; elevated vs Q4'23 cycle low of 130d but within long-run semis baseline." },
    { metric: "Inv provisions",         healthy: "Flat as % of gross",  worry: "Rising reserves",    amd: "MIXED",  comment: "$800M MI308 Q2'25 discrete; $360M released Q4'25. Ongoing obsolescence not disclosed." },
    { metric: "Gross margin direction", healthy: "Stable / expanding",  worry: "3+ pt compression",  amd: "HEALTHY", comment: "50% (FY23) → 57% (Q4'25 ex-MI308). Strongly counter to 'demand weakness'." },
    { metric: "A/R with inventory",     healthy: "A/R/Rev stable",      worry: "Both rising together", amd: "HEALTHY", comment: "A/R/Rev fell 80→62% through 2025 while Inv/Rev flat. No channel-stuff signature." },
    { metric: "Supply commitments",     healthy: "Tracks revenue",      worry: "Outpaces backlog",   amd: "WORRY",  comment: "$4.6B → $12.2B in 24 mo (+166%). Big step-up in Q1'25 alongside ZT + MI350." },
  ];
  return (
    <div className="method-table">
      <div className="method-header">
        <div>METRIC</div><div>HEALTHY</div><div>WORRY</div><div>AMD</div><div>COMMENT</div>
      </div>
      {rows.map((r, i) => {
        const tone = r.amd === "WORRY" ? C.danger : r.amd === "HEALTHY" ? C.signal : C.accent;
        return (
          <div key={i} className="method-row">
            <div style={{ color: C.ink, fontWeight: 500 }}>{r.metric}</div>
            <div style={{ color: C.inkDim }}>{r.healthy}</div>
            <div style={{ color: C.inkDim }}>{r.worry}</div>
            <div style={{ color: tone, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em" }}>{r.amd}</div>
            <div style={{ color: C.inkDim, fontSize: 12 }}>{r.comment}</div>
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// DATA LEDGER
// ───────────────────────────────────────────────────────────────────────────
function DataLedger() {
  const pct = (v) => v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(0)}%`;
  const $m  = (v) => v == null ? "—" : `$${v.toLocaleString()}`;
  return (
    <div className="ledger">
      <div className="ledger-desktop">
        <div className="ledger-header">
          <div>QUARTER</div>
          <div className="ledger-right">REV ($M)</div>
          <div className="ledger-right">COGS ($M)</div>
          <div className="ledger-right">INV ($M)</div>
          <div className="ledger-right">A/R ($M)</div>
          <div className="ledger-right">DSI</div>
          <div className="ledger-right">GM%</div>
          <div className="ledger-right">INV YoY</div>
          <div className="ledger-right">COMMITS ($B)</div>
          <div className="ledger-right">SRC</div>
        </div>
        {DATA.map((d, i) => (
          <div key={i} className="ledger-row">
            <div>{d.q}</div>
            <div className="ledger-right">{$m(d.rev)}</div>
            <div className="ledger-right">{$m(d.cogs)}</div>
            <div className="ledger-right">{$m(d.inv)}</div>
            <div className="ledger-right">{$m(d.ar)}</div>
            <div className="ledger-right">{d.dsi.toFixed(0)}d</div>
            <div className="ledger-right">{d.gm.toFixed(1)}%</div>
            <div className="ledger-right" style={{ color: d.invYoY == null ? C.inkMute : C.ink }}>{pct(d.invYoY)}</div>
            <div className="ledger-right">{d.supplyCommit == null ? "—" : `$${d.supplyCommit.toFixed(2)}`}</div>
            <div className="ledger-right"><a href={d.src} className="src-link" target="_blank" rel="noopener noreferrer">↗</a></div>
          </div>
        ))}
      </div>
      <div className="ledger-mobile">
        {DATA.map((d, i) => (
          <div key={i} style={{ padding: 16, borderBottom: `1px solid ${C.panelEdge}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ color: C.ink, fontSize: 13, fontWeight: 500 }}>{d.q}</span>
              <a href={d.src} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, fontSize: 13, padding: "4px 6px", display: "inline-block" }}>source ↗</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 14px", color: C.inkDim }}>
              <div>Rev: <span style={{ color: C.ink }}>{$m(d.rev)}</span></div>
              <div>COGS: <span style={{ color: C.ink }}>{$m(d.cogs)}</span></div>
              <div>Inv: <span style={{ color: C.ink }}>{$m(d.inv)}</span></div>
              <div>A/R: <span style={{ color: C.ink }}>{$m(d.ar)}</span></div>
              <div>DSI: <span style={{ color: C.ink }}>{d.dsi.toFixed(0)}d</span></div>
              <div>GM: <span style={{ color: C.ink }}>{d.gm.toFixed(1)}%</span></div>
              <div>Inv YoY: <span style={{ color: C.ink }}>{pct(d.invYoY)}</span></div>
              <div>Commits: <span style={{ color: C.ink }}>{d.supplyCommit == null ? "—" : `$${d.supplyCommit.toFixed(2)}B`}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// SOURCES
// ───────────────────────────────────────────────────────────────────────────
function Sources() {
  const items = [
    { n: 1,  label: "AMD Q4 FY25 Earnings Release (Feb 3, 2026)",  href: S.q4fy25,    note: "Latest quarter: Rev $10.27B, Inv $7.92B, MI308 $360M release, GM 54% GAAP" },
    { n: 2,  label: "AMD FY25 10-K/A (Feb 4, 2026)",               href: S.fy25_10ka, note: "$12.2B purchase commitments at Dec 27, 2025; $8.5B in FY26" },
    { n: 3,  label: "AMD Q3 FY25 10-Q (Nov 5, 2025)",              href: S.q3fy25_10q,note: "$12.1B purchase commits; inventory breakdown RM/WIP/FG" },
    { n: 4,  label: "AMD Q3 FY25 Earnings Release (Nov 4, 2025)",  href: S.q3fy25,    note: "Data Center Rev $4.3B record; no MI308 shipments to China" },
    { n: 5,  label: "AMD Q2 FY25 10-Q (Aug 6, 2025)",              href: S.q2fy25_10q,note: "$9.4B purchase commits; $800M MI308 charge" },
    { n: 6,  label: "AMD Q2 FY25 Earnings Release (Aug 5, 2025)",  href: S.q2fy25,    note: "GAAP GM collapsed to 40% from MI308 charge; ex-charge ~54%" },
    { n: 7,  label: "AMD Q1 FY25 10-Q (May 7, 2025)",              href: S.q1fy25_10q,note: "$8.2B purchase commits; ZT Systems closed Mar 31, 2025" },
    { n: 8,  label: "AMD Q1 FY25 Earnings Release (May 6, 2025)",  href: S.q1fy25,    note: "Rev $7.4B +36% YoY; Data Center $3.7B +57%" },
    { n: 9,  label: "AMD FY24 10-K (Feb 5, 2025)",                 href: S.fy24_10k,  note: "$4.97B commits Dec 28, 2024; RM $351, WIP $4,289, FG $1,094" },
    { n: 10, label: "AMD Q4 FY24 Earnings Release (Feb 4, 2025)",  href: S.q4fy24,    note: "Q4 Rev $7.66B +24%; Data Center $3.9B +69%; Instinct >$5B for FY24" },
    { n: 11, label: "AMD Q3 FY24 Earnings Release (Oct 29, 2024)", href: S.q3fy24,    note: "Data Center $3.5B +122% YoY; A/R spike to $7.24B (record)" },
    { n: 12, label: "AMD Q2 FY24 Earnings Release (Jul 30, 2024)", href: S.q2fy24,    note: "GM 49% GAAP; Instinct ramping but still <$1B / quarter" },
    { n: 13, label: "AMD Q1 FY24 Earnings Release (Apr 30, 2024)", href: S.q1fy24,    note: "Rev $5.47B +2%; $65M contract-manufacturer inventory loss" },
    { n: 14, label: "AMD FY23 10-K (Jan 31, 2024)",                href: S.fy23_10k,  note: "$4.59B purchase commits Dec 30, 2023; embedded correction bottoming" },
    { n: 15, label: "AMD Q3 FY23 Earnings Release (Oct 31, 2023)", href: S.q3fy23,    note: "Pre-AI-ramp baseline; Data Center $1.6B flat YoY" },
    { n: 16, label: "AMD Q2 FY23 Earnings Release (Aug 1, 2023)",  href: S.q2fy23,    note: "Revenue trough: $5.36B -18% YoY during PC downcycle" },
    { n: 17, label: "AMD Q1 FY23 Earnings Release (May 2, 2023)",  href: S.q1fy23,    note: "GM 44% GAAP; operating loss $145M at cycle low" },
    { n: 18, label: "Epoch AI — Hyperscaler Capex Quadrupled",     href: S.epoch,     note: "MSFT/META/GOOGL/AMZN/ORCL quarterly capex dataset" },
    { n: 19, label: "CreditSights — Hyperscaler Capex 2026E",      href: S.creditsights, note: "$256B (CY24) → $443B (CY25) → $602B (CY26E) projection" },
    { n: 20, label: "Visual Capitalist — Big Tech AI Spending",    href: S.visualcapitalist, note: "CY25 total $448B; Q4 CY25 alone $140.6B" },
    { n: 21, label: "Futurum — AI Capex 2026: The $690B Sprint",   href: S.futurum,   note: "Per-hyperscaler CY26 guidance breakdown" },
  ];
  return (
    <ol className="sources-list" style={{ margin: 0, paddingLeft: 24 }}>
      {items.map((item) => (
        <li key={item.n}>
          <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
          {" — "}
          <span style={{ color: C.inkMute }}>{item.note}</span>
        </li>
      ))}
    </ol>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// NAVIGATION — mirrors NvidiaInventory; AMD crimson accent.
// ───────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "takeaway", n: "—", label: "Takeaway" },
  { id: "sec-01", n: "01", label: "Divergence" },
  { id: "sec-02", n: "02", label: "DSI" },
  { id: "sec-03", n: "03", label: "Margins" },
  { id: "sec-04", n: "04", label: "Channel" },
  { id: "sec-05", n: "05", label: "Commits" },
  { id: "sec-06", n: "06", label: "Capex" },
  { id: "sec-07", n: "07", label: "Scorecard" },
  { id: "sec-08", n: "08", label: "Ledger" },
  { id: "sec-09", n: "09", label: "Monitor" },
  { id: "sec-10", n: "10", label: "Sources" },
];

function useActiveSection(sections) {
  const [active, setActive] = useState(sections[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.5, 1] }
    );
    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);
  return active;
}

function BackButton() {
  return (
    <Link to="/research" aria-label="Back to research" className="amd-back-btn">
      <span className="amd-back-arrow">←</span>
      <span className="amd-back-label">Back</span>
    </Link>
  );
}

function FloatingNav({ sections, active, onSelect }) {
  return (
    <nav className="amd-floating-nav" aria-label="Section navigation">
      {sections.map((sec) => {
        const isActive = active === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => onSelect(sec.id)}
            aria-label={sec.label}
            className={`amd-nav-pill${isActive ? " active" : ""}`}
          >
            <span className="amd-nav-text">
              {isActive ? sec.label : sec.n}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function NavStyles() {
  return (
    <style>{`
      .amd-back-btn {
        position: fixed;
        top: max(16px, env(safe-area-inset-top));
        left: 16px;
        z-index: 300;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: rgba(18, 18, 20, 0.72);
        backdrop-filter: blur(14px) saturate(1.4);
        -webkit-backdrop-filter: blur(14px) saturate(1.4);
        border: 1px solid rgba(200, 60, 74, 0.25);
        border-radius: 999px;
        color: #8a8680;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 500;
        text-decoration: none;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
      }
      .amd-back-btn:hover {
        color: #c83c4a;
        border-color: rgba(200, 60, 74, 0.65);
        background: rgba(18, 18, 20, 0.9);
        transform: translateX(-2px);
      }
      .amd-back-arrow { font-size: 13px; line-height: 1; }

      .amd-floating-nav {
        position: fixed;
        bottom: max(16px, env(safe-area-inset-bottom));
        left: 50%;
        transform: translateX(-50%);
        z-index: 200;
        display: flex;
        align-items: center;
        gap: 3px;
        padding: 5px;
        background: rgba(10, 10, 11, 0.78);
        backdrop-filter: blur(18px) saturate(1.6);
        -webkit-backdrop-filter: blur(18px) saturate(1.6);
        border: 1px solid rgba(200, 60, 74, 0.2);
        border-radius: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);
        max-width: calc(100vw - 24px);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .amd-floating-nav::-webkit-scrollbar { display: none; }

      .amd-nav-pill {
        height: 28px;
        min-width: 28px;
        padding: 0 9px;
        border: none;
        border-radius: 14px;
        background: transparent;
        color: rgba(232, 230, 225, 0.4);
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.06em;
        cursor: pointer;
        transition: all 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
        flex-shrink: 0;
      }
      .amd-nav-pill:hover { color: rgba(232, 230, 225, 0.85); }
      .amd-nav-pill.active {
        background: #c83c4a;
        color: #0a0a0b;
        min-width: 56px;
        padding: 0 12px;
      }
      .amd-nav-pill.active:hover { color: #0a0a0b; }

      @media (min-width: 1024px) {
        .amd-back-btn {
          top: 24px;
          left: 24px;
          padding: 10px 16px;
          font-size: 12px;
          gap: 8px;
        }
        .amd-back-arrow { font-size: 15px; }
        .amd-back-label::after { content: " to research"; }
      }

      @media (max-width: 480px) {
        .amd-nav-pill.active { min-width: 44px; }
      }
      @media (max-width: 768px) {
        .amd-back-btn {
          padding: 12px 18px;
          font-size: 12px;
          gap: 8px;
        }
        .amd-back-arrow { font-size: 15px; }
        .amd-nav-pill {
          height: 36px;
          min-width: 34px;
          font-size: 11px;
        }
        .amd-nav-pill.active { min-width: 64px; padding: 0 14px; }
      }


      section.section { scroll-margin-top: 72px; }
      .container { padding-bottom: 140px !important; }
    `}</style>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
export default function AMDInventory() {
  const active = useActiveSection(SECTIONS);
  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      <GlobalStyles />
      <NavStyles />
      <BackButton />
      <FloatingNav sections={SECTIONS} active={active} onSelect={scrollTo} />
      <div className="container">
        {/* HEADER */}
        <header style={{ marginBottom: 64, borderBottom: `1px solid ${C.panelEdge}`, paddingBottom: 40 }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>QUALITY-OF-EARNINGS · INVENTORY DIAGNOSTIC · AMD</div>
          <h1 className="title">
            Is AMD's inventory a red flag,
            <br />
            or disciplined supply?
          </h1>
          <p className="lede">
            Three years of AMD's quarterly fundamentals run through the same six-factor inventory framework
            applied to NVIDIA: divergence, DSI, reserves, margin, A/R pairing, and off-balance-sheet
            commitments. All figures trace to AMD's 8-K earnings releases, 10-Qs and 10-Ks through Q4 FY25
            (ended December 27, 2025).
          </p>
          <div style={{ marginTop: 28, color: C.inkMute, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em" }}>
            PRIMARY · AMD 8-K / 10-Q / 10-K FILINGS · FY23–FY25
          </div>
        </header>

        {/* KPI STRIP */}
        <KpiStrip />

        {/* TAKEAWAY */}
        <Section
          id="takeaway" num="— TAKEAWAY"
          title="The short version"
          subtitle="AMD's balance sheet tells a much cleaner story than NVIDIA's: inventory is growing roughly in proportion to revenue, margins are expanding, receivables are well-behaved. The one flag is off-balance-sheet."
        >
          <div className="panel">
            <div className="bullet-grid">
              <div>
                <div className="eyebrow-label" style={{ color: C.danger, marginBottom: 12 }}>RED FLAGS</div>
                <ul className="bullet-list">
                  <li>Unconditional purchase commitments more than doubled, $4.97B (Dec 2024) → $12.20B (Dec 2025).<Cite href={S.fy25_10ka} n="2" /></li>
                  <li>A $3.2B step-up in commits in Q1 FY25 alone, coinciding with ZT Systems closing.<Cite href={S.q1fy25_10q} n="7" /></li>
                  <li>$800M MI308 inventory charge hit Q2 FY25 from the April 2025 US export control on China-market product.<Cite href={S.q2fy25} n="6" /></li>
                  <li>DSI sits at 150–170 days, elevated vs. the Q4 FY23 cycle low of 130 days.</li>
                </ul>
              </div>
              <div>
                <div className="eyebrow-label" style={{ color: C.signal, marginBottom: 12 }}>COUNTER-SIGNALS</div>
                <ul className="bullet-list">
                  <li>Inventory YoY tracks revenue YoY within ±8 points every quarter — no divergence pattern.</li>
                  <li>Gross margin expanded from 50% (FY23) to 57% (Q4 FY25, ex-MI308) — the opposite of a dumping pattern.<Cite href={S.q4fy25} n="1" /></li>
                  <li>A/R-to-revenue <em>fell</em> from 80–106% in 2024 to 60–70% in 2025 while inventory held steady — no channel-stuff signature.</li>
                  <li>$360M of MI308 reserve was released in Q4 FY25 as non-China buyers absorbed the product.<Cite href={S.q4fy25} n="1" /></li>
                </ul>
              </div>
            </div>
            <Verdict tone="green" label="NET READ">
              Three HEALTHY, two MIXED, one WORRY. AMD is <em>not</em> in the classic "worry" quadrant the
              framework is designed to catch — its inventory is growing in proportion to revenue, margins are
              expanding, and the receivables ledger is well-behaved. The one real signal is off-balance-sheet:
              a $7.6B increase in purchase commitments over 12 months, driven by ZT Systems, the MI300/MI325
              ramp, and pre-positioning for MI350/MI400. At ~2% coverage of projected 2026 hyperscaler capex,
              that commitment is considerably more modest than NVIDIA's $95B position. If the AI build-out
              stalls materially, AMD has forward exposure; if it continues, this reads as reload, not red flag.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 1 — DIVERGENCE */}
        <Section
          id="sec-01" num="01"
          title="Divergence: inventory vs. revenue"
          subtitle="In the classic inventory-buildup pattern, inventory growth pulls ahead of revenue growth. AMD shows the opposite: the two lines move together."
        >
          <div className="panel">
            <DivergenceChart />
            <Verdict tone="green" label="OBSERVATION">
              The two lines have been within ±8 points every quarter of the last eight. Inventory grew at
              +30–38% YoY through 2024 and 2025; revenue grew +24–36% YoY over the same stretch.<Cite href={S.q4fy25} n="1" />
              For context: NVIDIA's gap ran +40 to +100 points during its comparable period. AMD's inventory
              build has been proportionate to its revenue acceleration — the divergence signal the framework
              is designed to catch simply isn't firing here.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 2 — DSI */}
        <Section
          id="sec-02" num="02"
          title="Days Sales of Inventory"
          subtitle="AMD is fabless — 'inventory' means work-in-process at TSMC plus finished goods at distributors. Range-bound in the low-semis band."
        >
          <div className="panel">
            <DsiChart />
            <Verdict tone="amber" label="OBSERVATION">
              DSI has oscillated between 130 and 170 days for three years — standard for a fabless
              semiconductor company carrying long-lead-time wafer inventory. The Q4 FY23 low of 130d
              marked the bottom of the post-pandemic embedded/PC inventory correction. Recent levels of
              150–170d are elevated vs. that trough but inside AMD's long-run semis baseline.
              Q2 FY25 (139d) and Q4 FY25 (163d) both contain MI308 distortion — the $800M charge
              <em> inflated</em> Q2 COGS (depressing DSI) while the $360M release <em>reduced</em> Q4 COGS
              (inflating DSI). Normalized, Q2 is ~170d and Q4 is ~150d — so the underlying trajectory is
              flat-to-down, not climbing.<Cite href={S.q4fy25} n="1" />
            </Verdict>
          </div>
        </Section>

        {/* SECTION 3 — MARGINS & PROVISIONS */}
        <Section
          id="sec-03" num="03"
          title="Gross margin + inventory provisions"
          subtitle="If inventory is building because demand is slipping, you see margin compression and rising write-downs. AMD shows the opposite."
        >
          <div className="panel">
            <MarginProvisionChart />
            <Verdict tone="green" label="THE CRITICAL COUNTER-SIGNAL">
              Gross margin (cost-of-sales basis) expanded from 49.8% (Q1 FY23) to 56.8% in Q4 FY25 — a 700
              basis-point improvement over the same period inventory grew 87%.<Cite href={S.q4fy25} n="1" />
              That combination is flat-out inconsistent with the "demand weakness forces discounting" story
              the framework warns about. The $800M Q2 FY25 charge was a specific geopolitical event — the
              April 2025 US requirement for an export license for MI308 product to China/Hong
              Kong/Macau — not general demand weakness.<Cite href={S.q2fy25_10q} n="5" /> AMD booked a $360M
              release in Q4 FY25 when it found non-China buyers for portions of the reserved
              inventory.<Cite href={S.q4fy25} n="1" /> Net annual MI308 impact: ~$440M. Similar in structure
              to NVIDIA's H20, smaller in absolute terms.
              <br/><br/>
              <strong style={{ color: C.ink }}>Disclosure caveat:</strong> unlike some semis, AMD does not
              publish an ongoing allowance-for-obsolescence footnote. The $800M/$360M MI308 figures are
              disclosed because they are material; the underlying quarterly reserve trajectory is not
              separately broken out.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 4 — CHANNEL CHECK */}
        <Section
          id="sec-04" num="04"
          title="Channel-stuffing check"
          subtitle="Classic channel-stuffing: both inventory and A/R balloon faster than sales. AMD's lines are moving in opposite directions."
        >
          <div className="panel">
            <ChannelCheckChart />
            <Verdict tone="green" label="OBSERVATION">
              A/R-to-revenue spiked to 106% in Q3 FY24 (single-quarter artifact of record $3.5B Data Center
              billing timing), but has since <em>declined</em> steadily through 2025 to 62% in Q4 FY25.<Cite href={S.q4fy25} n="1" />
              Inventory-to-revenue, by contrast, has stayed in a narrow 75–87% band throughout.
              If AMD were stuffing the channel, both lines would be rising together. Instead they're
              pointing in different directions — receivables normalizing while inventory tracks demand.
              This is the opposite of a channel-stuff signature.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 5 — SUPPLY COMMITMENTS */}
        <Section
          id="sec-05" num="05"
          title="Off-balance-sheet: supply commitments"
          subtitle="Purchase commitments are contractual future inventory. AMD's have grown 2.7× in 24 months — the only factor flashing 'worry'."
        >
          <div className="panel">
            <SupplyCommitChart />
            <Verdict tone="red" label="THE ONE WORRY">
              Unconditional purchase commitments — primarily wafer and substrate obligations with TSMC and
              packaging partners, plus multi-year cloud and IP license agreements — grew from $4.59B at
              FY23 year-end to $12.20B at FY25 year-end.<Cite href={S.fy23_10k} n="14" /><Cite href={S.fy25_10ka} n="2" />
              The biggest single jump was Q4 FY24 → Q1 FY25, when commitments went from $4.97B to $8.20B — a
              $3.2B step-up coinciding with the ZT Systems acquisition closing and the MI325X/MI350
              ramp.<Cite href={S.q1fy25_10q} n="7" /> Commitments have since held broadly steady at $9.4B
              (Q2), $12.1B (Q3), $12.2B (Q4).
              <br/><br/>
              Of the $12.2B year-end balance, $8.5B is due in fiscal 2026.<Cite href={S.fy25_10ka} n="2" />
              These obligations are generally not cancelable without penalty — if demand softens materially,
              they convert to forward losses, not just on-balance-sheet write-downs.
              <br/><br/>
              <strong style={{ color: C.ink }}>Bounded by context.</strong> At $12.2B of forward exposure
              against ~$34.6B of FY25 revenue, AMD is committing ~35% of annual run-rate revenue to future
              supply. That's meaningful but not reckless — and it pales next to NVIDIA's $95B commitment
              stack, which represents ~70% of FY26 revenue.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 6 — HYPERSCALER CAPEX */}
        <Section
          id="sec-06" num="06"
          title="The demand side: hyperscaler capex"
          subtitle="AMD's Data Center inventory and commitments only make sense in the context of the same concentrated customer base buying NVIDIA's GPUs."
        >
          <div className="panel">
            <HyperscalerChart />
            <Verdict tone="amber" label="THE DEMAND CONTEXT">
              AMD is a secondary beneficiary of the same unprecedented capital cycle lifting NVIDIA. Combined
              capex at MSFT + META + GOOGL + AMZN + ORCL went from $156B (CY23) to $448B (CY25) — a 2.9×
              expansion — and is guided to ~$660B for CY26 based on per-company disclosures.<Cite href={S.visualcapitalist} n="20" /><Cite href={S.futurum} n="21" />
              CreditSights' base case of $602B implies +36% YoY; Epoch AI's 72%-CAGR extrapolation would reach
              $770B.<Cite href={S.epoch} n="18" /><Cite href={S.creditsights} n="19" />
              <br/><br/>
              AMD's Data Center segment generated $4.3B in Q3 FY25, a quarterly record, with Instinct GPU
              revenue passing $5B cumulative for FY24 and continuing to ramp with MI325X, MI350, and
              ROCm maturation.<Cite href={S.q3fy25} n="4" /><Cite href={S.q4fy24} n="10" /> The ZT Systems
              acquisition (closed Mar 31, 2025 for $3.4B cash + equity) was explicitly framed as
              accelerating end-to-end AI infrastructure delivery — AMD wants to offer full rack-scale
              Instinct systems, not just chips.<Cite href={S.q1fy25_10q} n="7" />
              <br/><br/>
              AMD's $12.2B supply commitment is ~1.8% coverage against CY26 projected hyperscaler spend.
              That's modest relative to the demand signal — an entirely different posture than NVIDIA's
              ~14% coverage at a much larger absolute number.
              <br/><br/>
              <strong style={{ color: C.ink }}>The risk is the same as NVIDIA's:</strong> concentration.
              If the top five hyperscalers coordinate a capex pullback — triggered by ROI, financing, or
              recession — AMD's forward commitments lose their demand backstop too. AMD is smaller, less
              exposed in absolute terms, but not independent of the cycle.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 7 — SCORECARD */}
        <Section
          id="sec-07" num="07"
          title="Scorecard vs. the framework"
          subtitle="Each of the six framework factors, mapped to AMD's observed behavior through Q4 FY25."
        >
          <MethodTable />
        </Section>

        {/* SECTION 8 — DATA LEDGER */}
        <Section
          id="sec-08" num="08"
          title="Source data ledger"
          subtitle="Every figure verified against AMD's primary SEC filings. DSI = (Ending Inventory / Quarterly COGS) × 91. Click any row's source link to open the original filing."
        >
          <DataLedger />
        </Section>

        {/* SECTION 9 — WHAT TO MONITOR */}
        <Section
          id="sec-09" num="09"
          title="What to monitor from here"
          subtitle="The current picture is disciplined. Early-warning indicators that would flip the read:"
        >
          <div className="panel">
            <ol style={{ margin: 0, paddingLeft: 20, color: C.ink, fontSize: 14, lineHeight: 1.85 }}>
              <li>
                <span style={{ color: C.accent }}>Inv YoY vs. Rev YoY gap widening past +15 points.</span>{" "}
                Today it runs +0 to +8. A sustained widening gap would be the first quantitative signal
                that the inventory story is diverging from the revenue story.
              </li>
              <li>
                <span style={{ color: C.accent }}>DSI sustained above 175 days.</span>{" "}
                The three-year range has topped out around 170d. A breakout above that would indicate
                genuine accumulation relative to sales velocity.
              </li>
              <li>
                <span style={{ color: C.accent }}>Purchase commitments trajectory in Q1/Q2 FY26.</span>{" "}
                The $3.2B Q1 FY25 step-up and the Q2→Q3 FY25 climb ($9.4B → $12.1B) need to flatten or
                moderate. Another $2B+ increase without corresponding customer backlog disclosure would
                raise concern.
              </li>
              <li>
                <span style={{ color: C.accent }}>Gross margin guidance walk-back.</span>{" "}
                Q4 FY25 GAAP GM was 54% (57% ex-MI308). Guidance for FY26 to the low-50s while inventory
                stays elevated would make the dumping scenario plausible.
              </li>
              <li>
                <span style={{ color: C.accent }}>Instinct-specific revenue disclosure.</span>{" "}
                AMD has been specific about Instinct revenue milestones ($5B for FY24, continuing to
                ramp). A quarter where Instinct revenue stalls or declines would change the demand backstop
                for the wafer commitments.
              </li>
              <li>
                <span style={{ color: C.accent }}>Hyperscaler capex revisions.</span>{" "}
                MSFT, META, GOOGL, AMZN, ORCL all guided to $600B+ aggregate CY26 spend. Coordinated
                downward revisions would be the most telling demand signal — for AMD and NVIDIA both.
              </li>
            </ol>
          </div>
        </Section>

        {/* SECTION 10 — SOURCES */}
        <Section
          id="sec-10" num="10"
          title="Sources"
          subtitle="Every data point in this analysis traces to a primary SEC filing or an independent dataset. Click any source to open."
        >
          <div className="panel">
            <Sources />
          </div>
        </Section>

        {/* FOOTER */}
        <footer className="footer">
          <div>METHODOLOGY · DSI = (ENDING INVENTORY / QUARTERLY COGS) × 91</div>
          <div>COGS = AMD "COST OF SALES" LINE · EXCLUDES AMORTIZATION OF ACQUIRED INTANGIBLES (SHOWN SEPARATELY)</div>
          <div>GAAP GROSS MARGIN AS REPORTED BY AMD RUNS 2–4 PTS LOWER THAN COMPUTED · TREND DIRECTION IDENTICAL</div>
          <div>YOY GROWTH COMPARES TO THE SAME FISCAL QUARTER ONE YEAR PRIOR</div>
          <div>HYPERSCALER CAPEX: CALENDAR-YEAR TOTALS FOR MSFT+META+GOOGL+AMZN+ORCL PER EPOCH AI AND CREDITSIGHTS</div>
          <div style={{ marginTop: 16 }}>
            ANALYTICAL — NOT INVESTMENT ADVICE. NONE OF THE AUTHORS HOLD POSITIONS AS A RESULT OF THIS ANALYSIS.
          </div>
        </footer>
      </div>
    </>
  );
}
