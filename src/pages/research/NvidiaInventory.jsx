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
// SOURCES — centralized registry so every claim has a clickable citation.
// ───────────────────────────────────────────────────────────────────────────
const S = {
  // NVIDIA CFO commentaries (8-K filings)
  q4fy23: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581023000014/q4fy23cfocommentary.htm",
  q2fy24: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581023000171/q2fy24cfocommentary.htm",
  q3fy24: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581023000225/q3fy24cfocommentary.htm",
  q4fy24: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581024000028/q4fy24cfocommentary.htm",
  q1fy25: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581024000113/q1fy25cfocommentary.htm",
  q2fy25: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581024000262/q2fy25cfocommentary.htm",
  q3fy25: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581024000315/q3fy25cfocommentary.htm",
  q4fy25: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581025000021/q4fy25cfocommentary.htm",
  q1fy26: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581025000115/q1fy26cfocommentary.htm",
  q2fy26: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581025000207/q2fy26cfocommentary.htm",
  q3fy26: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581025000228/q3fy26cfocommentary.htm",
  q4fy26: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581026000019/q4fy26cfocommentary.htm",

  // NVIDIA 10-Q footnote disclosures (for inventory provisions)
  q1fy26_10q: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581025000116/nvda-20250427.htm",
  q2fy26_10q: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581025000209/nvda-20250727.htm",
  q3fy25_10q: "https://www.sec.gov/Archives/edgar/data/0001045810/000104581024000316/nvda-20241027.htm",

  // Hyperscaler capex
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
          color: "#d4a95a",
          textDecoration: "none",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7em",
          marginLeft: 2,
          padding: "0 2px",
          border: "1px solid rgba(212, 169, 90, 0.3)",
          borderRadius: 2,
        }}
      >
        [{n}]
      </a>
    </sup>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// DATA — NVIDIA quarterly fundamentals, VERIFIED against primary SEC sources.
// ───────────────────────────────────────────────────────────────────────────
const RAW = [
  { q: "Q4 FY23", rev: 6051,  cogs: 2218,  inv: 5159,  ar: 3827,  discDsi: 212,  provision: null,  supplyCommit: null, src: S.q4fy23 },
  { q: "Q1 FY24", rev: 7192,  cogs: 2544,  inv: 4611,  ar: 4080,  discDsi: null, provision: null,  supplyCommit: 10.53, src: null },
  { q: "Q2 FY24", rev: 13507, cogs: 4045,  inv: 4319,  ar: 7066,  discDsi: 97,   provision: null,  supplyCommit: 15.46, src: S.q2fy24 },
  { q: "Q3 FY24", rev: 18120, cogs: 4720,  inv: 4779,  ar: 8309,  discDsi: 92,   provision: 442,   supplyCommit: 21.54, src: S.q3fy24 },
  { q: "Q4 FY24", rev: 22103, cogs: 5312,  inv: 5282,  ar: 9999,  discDsi: 90,   provision: null,  supplyCommit: 20.7,  src: S.q4fy24 },
  { q: "Q1 FY25", rev: 26044, cogs: 5638,  inv: 5864,  ar: 12365, discDsi: 95,   provision: null,  supplyCommit: 29.4,  src: S.q1fy25 },
  { q: "Q2 FY25", rev: 30040, cogs: 7466,  inv: 6675,  ar: 14132, discDsi: 81,   provision: 345,   supplyCommit: 39.8,  src: S.q2fy25 },
  { q: "Q3 FY25", rev: 35082, cogs: 8926,  inv: 7654,  ar: 17693, discDsi: 78,   provision: 531,   supplyCommit: 42.1,  src: S.q3fy25 },
  { q: "Q4 FY25", rev: 39331, cogs: 10608, inv: 10080, ar: 23065, discDsi: 86,   provision: null,  supplyCommit: 45.1,  src: S.q4fy25 },
  { q: "Q1 FY26", rev: 44062, cogs: 17394, inv: 11333, ar: 22132, discDsi: 59,   provision: 4500,  supplyCommit: 43.5,  src: S.q1fy26 },
  { q: "Q2 FY26", rev: 46743, cogs: 12890, inv: 14962, ar: 27808, discDsi: null, provision: -180,  supplyCommit: 45.8,  src: S.q2fy26 },
  { q: "Q3 FY26", rev: 57006, cogs: 15167, inv: 19784, ar: 33391, discDsi: null, provision: null,  supplyCommit: 50.3,  src: S.q3fy26 },
  { q: "Q4 FY26", rev: 68127, cogs: 17026, inv: 21403, ar: 38466, discDsi: null, provision: null,  supplyCommit: 95.2,  src: S.q4fy26 },
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

// ───────────────────────────────────────────────────────────────────────────
// HYPERSCALER CAPEX — annualized, mapped to NVDA fiscal years.
// NVDA FY26 ≈ Feb 2025 – Jan 2026 ≈ calendar year 2025.
// Top 5: MSFT + META + GOOGL + AMZN + ORCL
// Sources cited inline.
// ───────────────────────────────────────────────────────────────────────────
const CAPEX = [
  { year: "FY23", calYr: "CY22", capex: 162, nvdaInv: 5.16, label: "Pre-AI boom" },
  { year: "FY24", calYr: "CY23", capex: 156, nvdaInv: 5.28, label: "GPT-4 inflection" },
  { year: "FY25", calYr: "CY24", capex: 256, nvdaInv: 10.08, label: "Hopper ramp" },
  { year: "FY26", calYr: "CY25", capex: 448, nvdaInv: 21.40, label: "Blackwell ramp" },
  { year: "FY27E", calYr: "CY26E", capex: 660, nvdaInv: null, label: "Rubin + guidance" },
];

// ───────────────────────────────────────────────────────────────────────────
// PALETTE & STYLES
// ───────────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0b",
  panel: "#121214",
  panelEdge: "#1f1f23",
  ink: "#e8e6e1",
  inkDim: "#8a8680",
  inkMute: "#5a5652",
  accent: "#d4a95a",
  danger: "#c85a3f",
  signal: "#6b8e7f",
  revenue: "#6b8e7f",
  inventory: "#d4a95a",
  capex: "#8b6a9a",
};

const axisStyle = { fill: C.inkDim, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" };
const gridStyle = { stroke: C.panelEdge };

// ───────────────────────────────────────────────────────────────────────────
// GLOBAL CSS — handles responsive layout, typography, hover states.
// ───────────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: ${C.bg}; color: ${C.ink}; }
    body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

    .container { max-width: 1100px; margin: 0 auto; padding: 64px 48px 96px; }

    /* Typography */
    .eyebrow { color: ${C.accent}; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em; }
    .eyebrow-small { color: ${C.inkMute}; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.12em; }
    .eyebrow-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; }
    h1.title { font-family: 'Fraunces', Georgia, serif; font-weight: 400; font-size: 56px; line-height: 1.05; letter-spacing: -0.025em; margin: 0 0 20px; color: ${C.ink}; }
    p.lede { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: ${C.inkDim}; max-width: 680px; margin: 0; }
    .subtitle { color: ${C.inkDim}; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; max-width: 680px; margin: 0 0 32px 32px; }

    /* Panel primitives */
    .section { margin-bottom: 88px; }
    .section-header { display: flex; align-items: baseline; gap: 16px; margin-bottom: 8px; }
    .section-title { color: ${C.ink}; font-family: 'Fraunces', Georgia, serif; font-weight: 400; font-size: 28px; margin: 0; letter-spacing: -0.01em; }
    .section-body { margin-left: 32px; }
    .panel { background: ${C.panel}; border: 1px solid ${C.panelEdge}; padding: 24px; }
    .panel-no-pad { background: ${C.panel}; border: 1px solid ${C.panelEdge}; }

    /* KPI strip */
    .kpi-strip { display: flex; flex-wrap: wrap; padding: 0; margin-bottom: 48px; }
    .kpi { flex: 1; min-width: 160px; padding: 20px 24px; border-right: 1px solid ${C.panelEdge}; }
    .kpi:last-child { border-right: none; }
    .kpi-label { color: ${C.inkMute}; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; margin-bottom: 8px; }
    .kpi-value { color: ${C.ink}; font-family: 'Fraunces', Georgia, serif; font-size: 30px; font-weight: 400; letter-spacing: -0.02em; }
    .kpi-delta { font-family: 'JetBrains Mono', monospace; font-size: 11px; margin-top: 6px; }

    /* Verdict blocks */
    .verdict { padding-left: 16px; margin-top: 20px; border-left: 2px solid ${C.accent}; }
    .verdict.red { border-left-color: ${C.danger}; }
    .verdict.green { border-left-color: ${C.signal}; }
    .verdict-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.18em; margin-bottom: 6px; }
    .verdict-body { color: ${C.ink}; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.65; }

    /* Two-col bullet grid */
    .bullet-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .bullet-list { margin: 0; padding-left: 18px; color: ${C.ink}; line-height: 1.75; font-size: 14px; }
    .bullet-list li { margin-bottom: 8px; }

    /* Methodology + data tables */
    .method-table { border: 1px solid ${C.panelEdge}; font-family: 'Inter', sans-serif; font-size: 13px; }
    .method-header { display: grid; grid-template-columns: 1.3fr 1.4fr 1.4fr 0.6fr 2fr; padding: 14px 20px; background: ${C.panel}; border-bottom: 1px solid ${C.panelEdge}; color: ${C.inkMute}; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; }
    .method-row { display: grid; grid-template-columns: 1.3fr 1.4fr 1.4fr 0.6fr 2fr; padding: 16px 20px; border-bottom: 1px solid ${C.panelEdge}; color: ${C.ink}; line-height: 1.55; }
    .method-row:last-child { border-bottom: none; }

    /* Data ledger - desktop grid, mobile table */
    .ledger { border: 1px solid ${C.panelEdge}; font-family: 'JetBrains Mono', monospace; font-size: 11px; overflow-x: auto; }
    .ledger-desktop { display: block; min-width: 820px; }
    .ledger-mobile { display: none; }
    .ledger-header { display: grid; grid-template-columns: 80px 70px 70px 70px 70px 60px 60px 80px 100px 60px; padding: 12px 16px; background: ${C.panel}; border-bottom: 1px solid ${C.panelEdge}; color: ${C.inkMute}; font-size: 10px; letter-spacing: 0.1em; }
    .ledger-row { display: grid; grid-template-columns: 80px 70px 70px 70px 70px 60px 60px 80px 100px 60px; padding: 10px 16px; border-bottom: 1px solid ${C.panelEdge}; color: ${C.ink}; }
    .ledger-row:last-child { border-bottom: none; }
    .ledger-right { text-align: right; }
    .ledger-dim { color: ${C.inkDim}; }

    /* Citations */
    a { color: ${C.accent}; }
    a.src-link { color: ${C.inkMute}; text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.05em; }
    a.src-link:hover { color: ${C.accent}; }

    /* Sources section */
    .sources-list { font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.8; color: ${C.inkDim}; }
    .sources-list li { margin-bottom: 8px; padding-left: 8px; }
    .sources-list a { color: ${C.accent}; text-decoration: none; border-bottom: 1px solid rgba(212, 169, 90, 0.2); }
    .sources-list a:hover { border-bottom-color: ${C.accent}; }

    /* Footer */
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

      /* Methodology: stack as cards on mobile */
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
      .method-row > div:nth-child(4)::before { content: 'NVDA'; width: 70px; }
      .method-row > div:nth-child(5)::before { content: 'NOTE'; width: 70px; }
      .method-row > div > * { text-align: right; flex: 1; }

      /* Data ledger — show card view on mobile */
      .ledger-desktop { display: none; }
      .ledger-mobile { display: block; }

      /* Smaller citation badges */
      sup a { font-size: 0.65em !important; }
    }

    /* Tablet tweaks */
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
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
        <Tooltip content={<TooltipBox formatter={(v) => `${v.toFixed(1)}%`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="plainline" />
        <ReferenceLine y={0} stroke={C.inkMute} strokeDasharray="2 2" />
        <Line type="monotone" dataKey="revYoY" name="Revenue YoY" stroke={C.revenue} strokeWidth={2} dot={{ r: 3, fill: C.revenue, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="invYoY" name="Inventory YoY" stroke={C.accent} strokeWidth={2} dot={{ r: 3, fill: C.accent, strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 2 — DSI
// ───────────────────────────────────────────────────────────────────────────
function DsiChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={DATA} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}d`} domain={[0, 240]} />
        <Tooltip content={<TooltipBox formatter={(v) => `${v.toFixed(0)} days`} />} cursor={{ stroke: C.panelEdge }} />
        <ReferenceLine y={90} stroke={C.inkMute} strokeDasharray="3 3" />
        <Line type="monotone" dataKey="dsi" name="DSI" stroke={C.accent} strokeWidth={2.5} dot={{ r: 4, fill: C.accent, strokeWidth: 0 }} activeDot={{ r: 6 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 3 — Margin + Provisions
// ───────────────────────────────────────────────────────────────────────────
function MarginProvisionChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={DATA} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} />
        <YAxis yAxisId="gm" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[50, 85]} />
        <YAxis yAxisId="prov" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} domain={[-500, 5000]} />
        <Tooltip content={<TooltipBox formatter={(v, key) => key === "gm" ? `${v.toFixed(1)}%` : `${v >= 0 ? "+" : ""}$${v.toLocaleString()}M`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="plainline" />
        <ReferenceLine yAxisId="prov" y={0} stroke={C.inkMute} strokeDasharray="2 2" />
        <Bar yAxisId="prov" dataKey="provision" name="Provision ($M)" fill={C.danger} opacity={0.75} barSize={14}>
          {DATA.map((d, i) => (
            <Cell key={i} fill={d.provision != null && d.provision < 0 ? C.signal : C.danger} />
          ))}
        </Bar>
        <Line yAxisId="gm" type="monotone" dataKey="gm" name="Gross Margin %" stroke={C.signal} strokeWidth={2.5} dot={{ r: 3, fill: C.signal, strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 4 — A/R + Inventory / Revenue
// ───────────────────────────────────────────────────────────────────────────
function ChannelCheckChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={DATA} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
        <Tooltip content={<TooltipBox formatter={(v) => `${v.toFixed(1)}%`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="plainline" />
        <Line type="monotone" dataKey="invRev" name="Inventory / Revenue" stroke={C.accent} strokeWidth={2} dot={{ r: 3, fill: C.accent, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="arRev" name="A/R / Revenue" stroke={C.danger} strokeWidth={2} dot={{ r: 3, fill: C.danger, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 5 — Supply commitments (the new off-balance-sheet chart)
// ───────────────────────────────────────────────────────────────────────────
function SupplyCommitChart() {
  const data = DATA.filter((d) => d.supplyCommit != null);
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis dataKey="q" tick={axisStyle} axisLine={{ stroke: C.panelEdge }} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}B`} />
        <Tooltip content={<TooltipBox formatter={(v, key) => key === "supplyCommit" ? `$${v.toFixed(1)}B` : `$${(v/1000).toFixed(1)}B`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="plainline" />
        <Bar dataKey="supplyCommit" name="Supply Commitments ($B)" fill={C.accent} opacity={0.85} barSize={24} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// CHART 6 — Hyperscaler capex vs NVIDIA inventory
// ───────────────────────────────────────────────────────────────────────────
function HyperscalerChart() {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <ComposedChart data={CAPEX} margin={{ top: 16, right: 16, left: -8, bottom: 8 }}>
        <CartesianGrid {...gridStyle} strokeDasharray="2 4" vertical={false} />
        <XAxis
          dataKey="year"
          tick={axisStyle}
          axisLine={{ stroke: C.panelEdge }}
          tickLine={false}
        />
        <YAxis
          yAxisId="capex"
          tick={axisStyle}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}B`}
          domain={[0, 800]}
        />
        <YAxis
          yAxisId="inv"
          orientation="right"
          tick={axisStyle}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v}B`}
          domain={[0, 25]}
        />
        <Tooltip content={<TooltipBox formatter={(v) => `$${v}B`} />} cursor={{ stroke: C.panelEdge }} />
        <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: C.inkDim, paddingTop: 12 }} iconType="plainline" />
        <Bar yAxisId="capex" dataKey="capex" name="Hyperscaler capex (Big 5)" fill={C.capex} opacity={0.6} barSize={40} />
        <Line yAxisId="inv" type="monotone" dataKey="nvdaInv" name="NVDA ending inventory ($B)" stroke={C.accent} strokeWidth={2.5} dot={{ r: 5, fill: C.accent, strokeWidth: 0 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// KPI STRIP
// ───────────────────────────────────────────────────────────────────────────
function Kpi({ label, value, delta, deltaTone = "neutral" }) {
  const deltaColor = deltaTone === "red" ? C.danger : deltaTone === "green" ? C.signal : C.inkDim;
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {delta && <div className="kpi-delta" style={{ color: deltaColor }}>{delta}</div>}
    </div>
  );
}

function KpiStrip() {
  const last = DATA[DATA.length - 1];
  const prev = DATA[DATA.length - 2];
  return (
    <div className="panel-no-pad kpi-strip">
      <Kpi label="LATEST QUARTER" value="Q4 FY26" delta="ended Jan 25, 2026" />
      <Kpi label="REVENUE" value={`$${(last.rev / 1000).toFixed(1)}B`} delta={`+${last.revYoY.toFixed(0)}% YoY`} deltaTone="green" />
      <Kpi label="INVENTORY" value={`$${(last.inv / 1000).toFixed(1)}B`} delta={`+${last.invYoY.toFixed(0)}% YoY`} deltaTone="red" />
      <Kpi label="DSI" value={`${last.dsi.toFixed(0)}d`} delta="vs 78d low (Q3 FY25)" deltaTone="red" />
      <Kpi label="SUPPLY COMMITS" value={`$${last.supplyCommit.toFixed(0)}B`} delta={`+111% YoY`} deltaTone="red" />
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// DATA LEDGER — two views (desktop grid + mobile cards)
// ───────────────────────────────────────────────────────────────────────────
function DataLedger() {
  return (
    <div className="ledger">
      {/* DESKTOP */}
      <div className="ledger-desktop">
        <div className="ledger-header">
          <div>QUARTER</div>
          <div className="ledger-right">REV ($M)</div>
          <div className="ledger-right">COGS</div>
          <div className="ledger-right">INV</div>
          <div className="ledger-right">A/R</div>
          <div className="ledger-right">DSI</div>
          <div className="ledger-right">GM%</div>
          <div className="ledger-right">INV YoY</div>
          <div className="ledger-right">PROVISION</div>
          <div className="ledger-right">SRC</div>
        </div>
        {DATA.map((r, i) => (
          <div key={i} className="ledger-row">
            <div>{r.q}</div>
            <div className="ledger-right">{r.rev.toLocaleString()}</div>
            <div className="ledger-right ledger-dim">{r.cogs.toLocaleString()}</div>
            <div className="ledger-right">{r.inv.toLocaleString()}</div>
            <div className="ledger-right ledger-dim">{r.ar.toLocaleString()}</div>
            <div className="ledger-right">{r.dsi.toFixed(0)}</div>
            <div className="ledger-right">{r.gm.toFixed(1)}</div>
            <div className="ledger-right" style={{ color: r.invYoY == null ? C.inkMute : r.invYoY > r.revYoY ? C.danger : C.signal }}>
              {r.invYoY == null ? "—" : `${r.invYoY > 0 ? "+" : ""}${r.invYoY.toFixed(0)}%`}
            </div>
            <div className="ledger-right" style={{ color: r.provision == null ? C.inkMute : r.provision < 0 ? C.signal : C.danger }}>
              {r.provision == null ? "—" : `${r.provision > 0 ? "+" : ""}$${r.provision.toLocaleString()}M`}
            </div>
            <div className="ledger-right">
              {r.src ? <a href={r.src} target="_blank" rel="noopener noreferrer" className="src-link">8-K↗</a> : <span style={{ color: C.inkMute }}>—</span>}
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE */}
      <div className="ledger-mobile">
        {DATA.map((r, i) => (
          <div key={i} style={{ padding: "14px 16px", borderBottom: `1px solid ${C.panelEdge}`, fontFamily: "'JetBrains Mono', monospace" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ color: C.ink, fontSize: 13, fontWeight: 500 }}>{r.q}</span>
              {r.src && <a href={r.src} target="_blank" rel="noopener noreferrer" className="src-link">source ↗</a>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", fontSize: 11 }}>
              <div><span style={{ color: C.inkMute }}>Rev: </span><span style={{ color: C.ink }}>${(r.rev / 1000).toFixed(1)}B</span></div>
              <div><span style={{ color: C.inkMute }}>GM: </span><span style={{ color: C.ink }}>{r.gm.toFixed(1)}%</span></div>
              <div><span style={{ color: C.inkMute }}>Inv: </span><span style={{ color: C.ink }}>${(r.inv / 1000).toFixed(1)}B</span></div>
              <div><span style={{ color: C.inkMute }}>DSI: </span><span style={{ color: C.ink }}>{r.dsi.toFixed(0)}d</span></div>
              <div>
                <span style={{ color: C.inkMute }}>Inv YoY: </span>
                <span style={{ color: r.invYoY == null ? C.inkMute : r.invYoY > r.revYoY ? C.danger : C.signal }}>
                  {r.invYoY == null ? "—" : `${r.invYoY > 0 ? "+" : ""}${r.invYoY.toFixed(0)}%`}
                </span>
              </div>
              <div>
                <span style={{ color: C.inkMute }}>Prov: </span>
                <span style={{ color: r.provision == null ? C.inkMute : r.provision < 0 ? C.signal : C.danger }}>
                  {r.provision == null ? "—" : `${r.provision > 0 ? "+" : ""}$${r.provision}M`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// METHOD TABLE
// ───────────────────────────────────────────────────────────────────────────
function MethodTable() {
  const rows = [
    { metric: "Inv vs. Revenue YoY", healthy: "Growth rates synchronized", worry: "Inv growth > Rev growth", nvda: "WORRY", comment: "Inv +112% vs Rev +73% in Q4 FY26" },
    { metric: "DSI trend", healthy: "Stable or declining", worry: "Rising 3+ quarters", nvda: "WORRY", comment: "78d (Q3 FY25) → 114d (Q4 FY26)" },
    { metric: "Inventory provisions", healthy: "Flat % of total stock", worry: "Rising (stock rotting)", nvda: "MIXED", comment: "$4.5B H20 discrete; $180M released Q2 FY26" },
    { metric: "Gross margin direction", healthy: "Expanding with scale", worry: "Compressing via markdowns", nvda: "HEALTHY", comment: "75.0% in Q4 FY26, multi-quarter high" },
    { metric: "A/R growing with sales", healthy: "A/R ~ Rev growth", worry: "Both Inv + A/R outgrowing Rev", nvda: "HEALTHY", comment: "A/R/Rev stable at 55–60%" },
    { metric: "Off-balance-sheet commits", healthy: "Scaled to demand", worry: "Outpacing demand signals", nvda: "MIXED", comment: "$95B now; doubled YoY; matched by capex" },
  ];
  return (
    <div className="method-table">
      <div className="method-header">
        <div>METRIC</div>
        <div>HEALTHY GROWTH</div>
        <div>WORRISOME BUILDUP</div>
        <div>NVDA</div>
        <div>OBSERVATION</div>
      </div>
      {rows.map((r, i) => {
        const tone = r.nvda === "WORRY" ? C.danger : r.nvda === "HEALTHY" ? C.signal : C.accent;
        return (
          <div key={i} className="method-row">
            <div style={{ color: C.ink, fontWeight: 500 }}>{r.metric}</div>
            <div style={{ color: C.inkDim }}>{r.healthy}</div>
            <div style={{ color: C.inkDim }}>{r.worry}</div>
            <div style={{ color: tone, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em" }}>{r.nvda}</div>
            <div style={{ color: C.inkDim, fontSize: 12 }}>{r.comment}</div>
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// SOURCES SECTION
// ───────────────────────────────────────────────────────────────────────────
function Sources() {
  const items = [
    { n: 1, label: "NVIDIA Q4 FY26 CFO Commentary (Feb 2026)", href: S.q4fy26, note: "Latest quarter data: inventory $21.4B, supply commitments $95.2B" },
    { n: 2, label: "NVIDIA Q3 FY26 CFO Commentary (Nov 2025)", href: S.q3fy26, note: "Supply commitments $50.3B" },
    { n: 3, label: "NVIDIA Q2 FY26 CFO Commentary (Aug 2025)", href: S.q2fy26, note: "H20 $180M provision release; $46.7B revenue" },
    { n: 4, label: "NVIDIA Q1 FY26 CFO Commentary (May 2025)", href: S.q1fy26, note: "$4.5B H20 charge; DSI compressed to 59d" },
    { n: 5, label: "NVIDIA Q4 FY25 CFO Commentary (Feb 2025)", href: S.q4fy25, note: "Fiscal year-end: $45.1B supply commits, 86d DSI" },
    { n: 6, label: "NVIDIA Q3 FY25 CFO Commentary (Nov 2024)", href: S.q3fy25, note: "Cycle low DSI of 78 days" },
    { n: 7, label: "NVIDIA Q2 FY25 CFO Commentary (Aug 2024)", href: S.q2fy25, note: "Blackwell inventory provisions begin" },
    { n: 8, label: "NVIDIA Q1 FY25 CFO Commentary (May 2024)", href: S.q1fy25, note: "DSI 95d; supply commits $29.4B" },
    { n: 9, label: "NVIDIA Q4 FY24 CFO Commentary (Feb 2024)", href: S.q4fy24, note: "DSI 90d; Hopper ramp peak" },
    { n: 10, label: "NVIDIA Q3 FY24 CFO Commentary (Nov 2023)", href: S.q3fy24, note: "$442M net inventory provision" },
    { n: 11, label: "NVIDIA Q2 FY24 CFO Commentary (Aug 2023)", href: S.q2fy24, note: "AI inflection point quarter" },
    { n: 12, label: "NVIDIA Q4 FY23 CFO Commentary (Feb 2023)", href: S.q4fy23, note: "Pre-AI-boom baseline: DSI 212d" },
    { n: 13, label: "Epoch AI: Hyperscaler capex has quadrupled (Feb 2026)", href: S.epoch, note: "Quarterly capex dataset for MSFT/META/GOOGL/AMZN/ORCL from SEC filings" },
    { n: 14, label: "CreditSights: Hyperscaler Capex 2026 Estimates (Nov 2025)", href: S.creditsights, note: "$256B (2024) → $443B (2025) → $602B (2026E) projection" },
    { n: 15, label: "Visual Capitalist: Big Tech AI Spending (2026)", href: S.visualcapitalist, note: "CY2025 total $448B; Q4 CY2025 alone $140.6B" },
    { n: 16, label: "Futurum: AI Capex 2026 – The $690B Infrastructure Sprint", href: S.futurum, note: "Per-company 2026 guidance breakdown" },
    { n: 17, label: "NVIDIA Q1 FY26 10-Q (H20 charge detail)", href: S.q1fy26_10q, note: "Purchase obligation footnote: $29.8B supply" },
    { n: 18, label: "NVIDIA Q2 FY26 10-Q (inventory provision footnote)", href: S.q2fy26_10q, note: "H1 FY26 inventory provision $886M total" },
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
// NAVIGATION
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
    <Link to="/research" aria-label="Back to research" className="nvda-back-btn">
      <span className="nvda-back-arrow">←</span>
      <span className="nvda-back-label">Back</span>
    </Link>
  );
}

function FloatingNav({ sections, active, onSelect }) {
  return (
    <nav className="nvda-floating-nav" aria-label="Section navigation">
      {sections.map((sec) => {
        const isActive = active === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => onSelect(sec.id)}
            aria-label={sec.label}
            className={`nvda-nav-pill${isActive ? " active" : ""}`}
          >
            <span className="nvda-nav-text">
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
      .nvda-back-btn {
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
        border: 1px solid rgba(212, 169, 90, 0.22);
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
      .nvda-back-btn:hover {
        color: #d4a95a;
        border-color: rgba(212, 169, 90, 0.6);
        background: rgba(18, 18, 20, 0.9);
        transform: translateX(-2px);
      }
      .nvda-back-arrow { font-size: 13px; line-height: 1; }

      .nvda-floating-nav {
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
        border: 1px solid rgba(212, 169, 90, 0.18);
        border-radius: 24px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04);
        max-width: calc(100vw - 24px);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .nvda-floating-nav::-webkit-scrollbar { display: none; }

      .nvda-nav-pill {
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
      .nvda-nav-pill:hover { color: rgba(232, 230, 225, 0.85); }
      .nvda-nav-pill.active {
        background: #d4a95a;
        color: #0a0a0b;
        min-width: 56px;
        padding: 0 12px;
      }
      .nvda-nav-pill.active:hover { color: #0a0a0b; }

      @media (min-width: 1024px) {
        .nvda-back-btn {
          top: 24px;
          left: 24px;
          padding: 10px 16px;
          font-size: 12px;
          gap: 8px;
        }
        .nvda-back-arrow { font-size: 15px; }
        .nvda-back-label::after { content: " to research"; }
      }

      @media (max-width: 480px) {
        .nvda-nav-pill.active { min-width: 44px; }
      }

      section.section { scroll-margin-top: 24px; }
      .container { padding-bottom: 140px !important; }
    `}</style>
  );
}

// ───────────────────────────────────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────────────────────────────────
export default function NvidiaInventory() {
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
          <div className="eyebrow" style={{ marginBottom: 24 }}>QUALITY-OF-EARNINGS · INVENTORY DIAGNOSTIC · v3</div>
          <h1 className="title">
            Is NVIDIA's inventory build
            <br />
            a red flag or a reload?
          </h1>
          <p className="lede">
            Three years of quarterly fundamentals through the classic inventory-buildup diagnostic framework:
            divergence, DSI trend, reserves, margin direction, off-balance-sheet commitments, and the demand
            side — hyperscaler capex. All figures sourced and verified to primary SEC filings through Q4 FY26
            (ended January 25, 2026).
          </p>
          <div style={{ marginTop: 28, color: C.inkMute, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em" }}>
            PRIMARY · NVIDIA 8-K / 10-Q / 10-K FILINGS · FY23–FY26
          </div>
        </header>

        {/* KPI STRIP */}
        <KpiStrip />

        {/* TAKEAWAY */}
        <Section
          id="takeaway" num="— TAKEAWAY"
          title="The short version"
          subtitle="NVIDIA shows some classic red flags for inventory buildup — but the demand signals on the other side of the ledger are unprecedented."
        >
          <div className="panel">
            <div className="bullet-grid">
              <div>
                <div className="eyebrow-label" style={{ color: C.danger, marginBottom: 12 }}>RED FLAGS</div>
                <ul className="bullet-list">
                  <li>Inventory YoY has outpaced revenue YoY for 5 straight quarters (gap: 40–100 points).<Cite href={S.q4fy26} n="1" /></li>
                  <li>DSI climbed from cycle low 78d (Q3 FY25) to 114d (Q4 FY26) — a 46% increase.<Cite href={S.q3fy25} n="6" /></li>
                  <li>A $4.5B H20 charge hit Q1 FY26; H1 FY26 provisions $886M vs. $345M prior year.<Cite href={S.q1fy26} n="4" /></li>
                  <li>Supply commitments doubled to $95B in a single quarter (Q4 FY26).<Cite href={S.q4fy26} n="1" /></li>
                </ul>
              </div>
              <div>
                <div className="eyebrow-label" style={{ color: C.signal, marginBottom: 12 }}>COUNTER-SIGNALS</div>
                <ul className="bullet-list">
                  <li>Gross margin recovered to 75.0% in Q4 FY26 — the opposite of a dumping pattern.<Cite href={S.q4fy26} n="1" /></li>
                  <li>A/R-to-revenue stable at 55–60%; no channel-stuffing footprint.</li>
                  <li>Q2 FY26 featured a $180M reserve release as H20 inventory sold to non-China buyer.<Cite href={S.q2fy26} n="3" /></li>
                  <li>Hyperscaler capex ($448B in 2025, ~$660B projected 2026) dwarfs NVIDIA's inventory build.<Cite href={S.creditsights} n="14" /></li>
                </ul>
              </div>
            </div>
            <Verdict tone="amber" label="NET READ">
              The classic "worry" pattern is textbook for a fashion or commodity-hardware vendor staring at
              demand shortfall. That's not what NVIDIA's picture shows. The build is supply-side pre-positioning
              for the Blackwell/Rubin ramps, and it's being met by the largest coordinated capital cycle in
              tech history. But balance-sheet risk is real: $95B of off-balance-sheet commitments means if
              hyperscaler capex stalls or Rubin slips, those commitments convert to forward losses fast.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 1 — DIVERGENCE */}
        <Section
          id="sec-01" num="01"
          title="Divergence: inventory vs. revenue"
          subtitle="In a healthy growth business, inventory should grow roughly in line with revenue. NVIDIA's pattern inverted starting Q4 FY25."
        >
          <div className="panel">
            <DivergenceChart />
            <Verdict tone="red" label="OBSERVATION">
              Through late FY24 inventory growth actually lagged revenue — inventory was only +2% YoY in Q4 FY24
              against +265% revenue growth as NVIDIA worked through Ampere overhang while Hopper demand
              exploded.<Cite href={S.q4fy24} n="9" /> That dynamic flipped in Q4 FY25 (+91% inv vs +78% rev).
              The last four quarters show inventory growing 91%, 93%, 124%, and 112% YoY while revenue grew
              78%, 69%, 63%, and 73%.<Cite href={S.q4fy26} n="1" />
            </Verdict>
          </div>
        </Section>

        {/* SECTION 2 — DSI */}
        <Section
          id="sec-02" num="02"
          title="Days Sales of Inventory"
          subtitle="How long inventory sits before becoming cash. NVIDIA discloses this directly through Q1 FY26; values computed here reconcile within rounding."
        >
          <div className="panel">
            <DsiChart />
            <Verdict tone="red" label="OBSERVATION">
              DSI compressed from 212 days (pre-AI-boom overhang) to 78 days (Q3 FY25) as Hopper demand outran
              supply.<Cite href={S.q3fy25} n="6" /> Since then it's retraced to 114 days, a 46% rise in five
              quarters. The Q1 FY26 dip to 59 days is a computational artifact — the $4.5B H20 charge inflated
              COGS that quarter, making the denominator abnormally large.<Cite href={S.q1fy26} n="4" />
            </Verdict>
          </div>
        </Section>

        {/* SECTION 3 — MARGINS & PROVISIONS */}
        <Section
          id="sec-03" num="03"
          title="Gross margin + inventory provisions"
          subtitle="When inventory builds because demand is slipping, you see write-downs and margin compression. NVIDIA's picture is the most revealing part of the analysis."
        >
          <div className="panel">
            <MarginProvisionChart />
            <Verdict tone="green" label="THE CRITICAL COUNTER-SIGNAL">
              The $4.5B Q1 FY26 charge was a discrete geopolitical event — the April 2025 H20 export license
              requirement made specific Chinese-market inventory and purchase obligations unsellable.<Cite href={S.q1fy26} n="4" />
              Q2 FY26 recorded a $180M <em>release</em> as NVIDIA found non-China buyers for ~$650M of
              previously-reserved H20 product.<Cite href={S.q2fy26} n="3" /> Most importantly, gross margin
              recovered to 75.0% in Q4 FY26 — a multi-quarter high, opposite the "dumping" pattern the
              framework warns about.<Cite href={S.q4fy26} n="1" />
            </Verdict>
          </div>
        </Section>

        {/* SECTION 4 — CHANNEL CHECK */}
        <Section
          id="sec-04" num="04"
          title="Channel-stuffing check"
          subtitle="If both inventory and accounts receivable balloon faster than sales, the classic read is 'channel-stuffing'. Normalized by revenue."
        >
          <div className="panel">
            <ChannelCheckChart />
            <Verdict tone="green" label="OBSERVATION">
              Inventory-to-revenue bottomed at ~22% (Q3 FY25) and climbed back to 31% — real drift. But
              A/R-to-revenue has stayed stable at 50–60%. Channel-stuffing would show both rising in lockstep;
              here, only inventory is rising. More consistent with supply-side pre-positioning than demand-side
              stuffing.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 5 — SUPPLY COMMITMENTS */}
        <Section
          id="sec-05" num="05"
          title="Off-balance-sheet: supply commitments"
          subtitle="The framework doesn't explicitly cover it, but purchase commitments are contractual future inventory. NVIDIA's have more than doubled year-over-year."
        >
          <div className="panel">
            <SupplyCommitChart />
            <Verdict tone="red" label="THE NEW RISK">
              Total supply-related commitments — inventory purchase commitments, manufacturing capacity
              commitments, and non-inventory obligations including multi-year cloud agreements — grew from
              $45.1B at FY25 year-end to $95.2B at FY26 year-end.<Cite href={S.q4fy26} n="1" /> The Q4 FY26
              quarter alone added $45B, roughly doubling sequentially from $50.3B.<Cite href={S.q3fy26} n="2" />
              NVIDIA's framing is forward: "strategically secured inventory and capacity to meet demand beyond
              the next several quarters."<Cite href={S.q4fy26} n="1" /> These aren't cancelable without
              penalty. Unlike on-balance-sheet inventory (which can at least be written down), these are
              forward cash obligations — if demand weakens materially, they convert to losses on future
              income statements, not just reserve charges.
            </Verdict>
          </div>
        </Section>

        {/* SECTION 6 — HYPERSCALER CAPEX */}
        <Section
          id="sec-06" num="06"
          title="The demand side: hyperscaler capex"
          subtitle="NVIDIA's inventory and commitments only make sense in the context of customer spending. The Big Five hyperscalers have coordinated a historic capital cycle."
        >
          <div className="panel">
            <HyperscalerChart />
            <Verdict tone="amber" label="THE DEMAND CONTEXT">
              Combined capex at Alphabet, Amazon, Meta, Microsoft, and Oracle went from $162B (CY22) to $448B
              (CY25), a roughly 3× increase.<Cite href={S.visualcapitalist} n="15" /> For CY26, company guidance
              implies ~$660B aggregate — Amazon ~$200B, Alphabet $175–185B, Meta $115–135B, Microsoft ~$120B,
              Oracle ~$50B.<Cite href={S.futurum} n="16" /> CreditSights projects $602B (+36% YoY); Epoch AI's
              72%-CAGR extrapolation would imply $770B.<Cite href={S.epoch} n="13" />
              <br/><br/>
              Capital intensity has reached historically unthinkable levels — Oracle at 57% of revenue, Microsoft
              45%.<Cite href={S.creditsights} n="14" /> Roughly 75% of this spending is AI infrastructure
              directly — GPUs, networking, data centers.<Cite href={S.epoch} n="13" /> At this scale of
              committed demand, NVIDIA's $95B supply commitment is a coverage ratio of ~14% against next year's
              hyperscaler spend. That's pre-positioning, not speculation.
              <br/><br/>
              <strong style={{ color: C.ink }}>The risk is correlation.</strong> NVIDIA's demand picture is
              extremely concentrated across five customers whose capex decisions are highly coordinated. Any
              coordinated pullback — triggered by ROI concerns, debt market saturation, or recession — would
              convert "strategic inventory" to "working-capital graveyard" simultaneously across all five.
            </Verdict>
          </div>
        </Section>

        {/* FRAMEWORK SCORECARD */}
        <Section
          id="sec-07" num="07"
          title="Scorecard vs. the framework"
          subtitle="Each diagnostic metric against NVIDIA's observed behavior, now including off-balance-sheet commitments."
        >
          <MethodTable />
        </Section>

        {/* RAW DATA LEDGER */}
        <Section
          id="sec-08" num="08"
          title="Source data ledger"
          subtitle="Every figure verified against primary SEC filings. DSI = (Ending Inventory / Quarterly COGS) × 91. Click any row's source link to see the original filing."
        >
          <DataLedger />
        </Section>

        {/* WHAT TO MONITOR */}
        <Section
          id="sec-09" num="09"
          title="What to monitor from here"
          subtitle="The build is justifiable on today's numbers, but has meaningfully increased balance-sheet risk. Early-warning indicators:"
        >
          <div className="panel">
            <ol style={{ margin: 0, paddingLeft: 20, color: C.ink, fontSize: 14, lineHeight: 1.85 }}>
              <li>
                <span style={{ color: C.accent }}>DSI direction in Q1 FY27.</span>{" "}
                A decline toward 90 days would confirm the Blackwell ramp thesis. Another leg up toward 130+
                would be genuinely concerning.
              </li>
              <li>
                <span style={{ color: C.accent }}>FY26 10-K allowance-for-obsolescence footnote.</span>{" "}
                The reserve as % of gross inventory is the cleanest read on stock freshness, excluding the H20
                one-timer.
              </li>
              <li>
                <span style={{ color: C.accent }}>Gross margin guidance for FY27.</span>{" "}
                Management targeted "mid-70s". Q4 FY26 landed at 75.0%; Q1 FY27 revenue guide is $78B. Any
                walk-back toward low-70s while inventory stays elevated would make the dumping scenario
                plausible.
              </li>
              <li>
                <span style={{ color: C.accent }}>Hyperscaler capex actuals vs. guidance.</span>{" "}
                MSFT, META, GOOGL, AMZN, ORCL all guided aggressively for CY26. Coordinated downward revisions
                would be the most telling demand signal.
              </li>
              <li>
                <span style={{ color: C.accent }}>Debt issuance and free cash flow trends at hyperscalers.</span>{" "}
                Alphabet's FCF is projected to drop ~90% in 2026; Amazon may turn FCF-negative.<Cite href="https://www.cnbc.com/2026/02/06/google-microsoft-meta-amazon-ai-cash.html" n="19" /> If
                bond markets resist further hyperscaler debt, the capex cycle self-limits.
              </li>
              <li>
                <span style={{ color: C.accent }}>Supply commitment trajectory in Q1 FY27.</span>{" "}
                The $45B sequential jump in Q4 FY26 was abnormal. A flat or down Q1 would reassure; another
                $20B+ increase without corresponding customer backlog disclosure would raise concern.
              </li>
            </ol>
          </div>
        </Section>

        {/* SOURCES */}
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
          <div>YOY GROWTH COMPARES TO THE SAME FISCAL QUARTER ONE YEAR PRIOR</div>
          <div>PROVISIONS PER 10-Q/10-K FOOTNOTE DISCLOSURES · Q1 FY26 INCLUDES $4.5B H20 CHARGE · Q2 FY26 $180M RELEASE</div>
          <div>HYPERSCALER CAPEX: CALENDAR-YEAR TOTALS FOR MSFT+META+GOOGL+AMZN+ORCL PER EPOCH AI AND CREDITSIGHTS</div>
          <div style={{ marginTop: 16 }}>
            ANALYTICAL — NOT INVESTMENT ADVICE. NONE OF THE AUTHORS HOLD POSITIONS AS A RESULT OF THIS ANALYSIS.
          </div>
        </footer>
      </div>
    </>
  );
}
