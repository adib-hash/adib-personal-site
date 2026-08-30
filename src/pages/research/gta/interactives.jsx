import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, ComposedChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import { C, CAP, BOX, FadeIn, ChartBox, Tip } from "./framework.jsx";

var axis = { stroke: C.muted, fontSize: 12, fontFamily: "var(--gta-mono)" };

function fmtM(v) { return v + "M"; }
function fmtB(v) { return "$" + v.toFixed(2) + "B"; }

// ---------- Chart 1: units by title ----------
var titleData = [
  { name: "GTA (1997)", units: 6, color: C.teal },
  { name: "GTA III", units: 14.5, color: C.teal },
  { name: "Vice City", units: 17.5, color: C.teal },
  { name: "San Andreas", units: 27.5, color: C.teal },
  { name: "GTA IV", units: 25, color: C.teal },
  { name: "RDR 2", units: 87, color: C.orange },
  { name: "GTA V", units: 230, color: C.accent },
];

export function TitleChart() {
  return <ChartBox title="Lifetime units by title (millions)" note="Company-reported figures at the last disclosed date for each title. GTA V is still selling; every other GTA number is frozen at the point Take-Two stopped reporting it." height={300}>
    <ResponsiveContainer initialDimension={{ width: 600, height: 280 }}>
      <BarChart data={titleData} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={C.faint} />
        <XAxis type="number" tick={axis} axisLine={false} tickLine={false} tickFormatter={fmtM} />
        <YAxis type="category" dataKey="name" tick={{ ...axis, fill: C.dim }} axisLine={false} tickLine={false} width={96} />
        <Tooltip cursor={{ fill: C.faint + "66" }} content={<Tip fmt={function (v) { return v + "M units"; }} />} />
        <Bar dataKey="units" name="Units" radius={[0, 6, 6, 0]} label={{ position: "right", fill: C.dim, fontSize: 12, fontFamily: "var(--gta-mono)", formatter: fmtM }}>
          {titleData.map(function (d, i) { return <Cell key={i} fill={d.color} />; })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartBox>;
}

// ---------- Chart 2: GTA V cumulative ----------
var vData = [
  { t: "Sep 2013", units: 11.2 },
  { t: "Dec 2013", units: 32.5 },
  { t: "Dec 2014", units: 45 },
  { t: "Jun 2015", units: 54 },
  { t: "Dec 2016", units: 75 },
  { t: "Dec 2017", units: 90 },
  { t: "Sep 2018", units: 100 },
  { t: "Mar 2020", units: 130 },
  { t: "Aug 2021", units: 150 },
  { t: "Feb 2022", units: 160 },
  { t: "May 2024", units: 200 },
  { t: "Feb 2026", units: 225 },
  { t: "Aug 2026", units: 230 },
];

export function GtaVChart() {
  return <ChartBox title="GTA V cumulative units sold (millions)" note="Take-Two disclosures across three console generations. The PS4/Xbox One (Nov 2014), PC (Apr 2015) and PS5/Series X (Mar 2022) re-releases each restarted the curve." height={300}>
    <ResponsiveContainer initialDimension={{ width: 600, height: 280 }}>
      <AreaChart data={vData} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.accent} stopOpacity={0.45} />
            <stop offset="100%" stopColor={C.accent} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={C.faint} />
        <XAxis dataKey="t" tick={axis} axisLine={false} tickLine={false} interval={2} />
        <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={fmtM} />
        <Tooltip content={<Tip fmt={function (v) { return v + "M"; }} />} />
        <ReferenceLine x="Dec 2014" stroke={C.muted} strokeDasharray="3 4" label={{ value: "PS4 / XB1", fill: C.muted, fontSize: 11, position: "insideTopLeft", offset: 8 }} />
        <ReferenceLine x="Feb 2022" stroke={C.muted} strokeDasharray="3 4" label={{ value: "PS5 / XSX", fill: C.muted, fontSize: 11, position: "insideTopLeft", offset: 8 }} />
        <Area type="monotone" dataKey="units" name="Units" stroke={C.accent} strokeWidth={2.5} fill="url(#gv)" dot={{ r: 3, fill: C.accent, stroke: C.bg, strokeWidth: 1.5 }} />
      </AreaChart>
    </ResponsiveContainer>
  </ChartBox>;
}

// ---------- Chart 3: Take-Two revenue + RCS share ----------
var ttData = [
  { fy: "FY13", rev: 1.21, rcs: null },
  { fy: "FY14", rev: 2.35, rcs: null },
  { fy: "FY15", rev: 1.08, rcs: null },
  { fy: "FY16", rev: 1.41, rcs: null },
  { fy: "FY17", rev: 1.78, rcs: 32 },
  { fy: "FY18", rev: 1.79, rcs: 48 },
  { fy: "FY19", rev: 2.67, rcs: null },
  { fy: "FY20", rev: 3.09, rcs: 51 },
  { fy: "FY21", rev: 3.37, rcs: 63 },
  { fy: "FY22", rev: 3.50, rcs: null },
  { fy: "FY23", rev: 5.35, rcs: 78 },
  { fy: "FY24", rev: 5.35, rcs: 78 },
  { fy: "FY25", rev: 5.63, rcs: 80 },
  { fy: "FY26", rev: 6.66, rcs: 78 },
  { fy: "FY27E", rev: 8.0, rcs: null, guide: true },
];

function TTTip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  var d = payload[0].payload;
  return <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: "10px 14px", boxShadow: "0 12px 40px rgba(0,0,0,.7)" }}>
    <div style={{ color: C.muted, fontSize: 12, fontFamily: "var(--gta-mono)", marginBottom: 6 }}>{label}{d.guide ? " (guidance midpoint)" : ""}</div>
    <div style={{ color: C.green, fontSize: 14, fontFamily: "var(--gta-sans)" }}>Revenue: <strong style={{ fontFamily: "var(--gta-mono)" }}>{fmtB(d.rev)}</strong></div>
    {d.rcs !== null ? <div style={{ color: C.accent, fontSize: 14, fontFamily: "var(--gta-sans)" }}>Recurrent spending: <strong style={{ fontFamily: "var(--gta-mono)" }}>{d.rcs + "% of bookings"}</strong></div> : null}
  </div>;
}

export function TakeTwoChart() {
  return <ChartBox title="Take-Two net revenue vs. recurrent consumer spending" note="Bars: GAAP net revenue, fiscal years ending March 31 (FY27 is the guidance midpoint). Line: recurrent consumer spending as a share of net bookings, in the years Take-Two disclosed it." height={320}>
    <ResponsiveContainer initialDimension={{ width: 600, height: 280 }}>
      <ComposedChart data={ttData} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={C.faint} />
        <XAxis dataKey="fy" tick={axis} axisLine={false} tickLine={false} interval={1} />
        <YAxis yAxisId="l" tick={axis} axisLine={false} tickLine={false} tickFormatter={function (v) { return "$" + v + "B"; }} />
        <YAxis yAxisId="r" orientation="right" domain={[0, 100]} tick={axis} axisLine={false} tickLine={false} tickFormatter={function (v) { return v + "%"; }} />
        <Tooltip cursor={{ fill: C.faint + "66" }} content={<TTTip />} />
        <Bar yAxisId="l" dataKey="rev" name="Revenue" radius={[5, 5, 0, 0]}>
          {ttData.map(function (d, i) { return <Cell key={i} fill={d.guide ? C.green + "55" : C.green} stroke={d.guide ? C.green : "none"} strokeDasharray={d.guide ? "4 3" : "0"} />; })}
        </Bar>
        <Line yAxisId="r" type="monotone" dataKey="rcs" name="RCS share" stroke={C.accent} strokeWidth={2.5} connectNulls dot={{ r: 4, fill: C.accent, stroke: C.bg, strokeWidth: 1.5 }} />
      </ComposedChart>
    </ResponsiveContainer>
  </ChartBox>;
}

// ---------- Slider primitive ----------
function Slider({ label, value, min, max, step, onChange, display }) {
  return <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
      <span style={{ ...CAP, fontSize: 11 }}>{label}</span>
      <span style={{ fontFamily: "var(--gta-mono)", fontSize: 16, color: C.text, fontWeight: 600, minWidth: 90, textAlign: "right" }}>{display}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={function (e) { onChange(Number(e.target.value)); }}
      style={{ width: "100%", accentColor: C.accent, cursor: "pointer", height: 24 }} />
  </div>;
}

function Result({ label, value, color, sub }) {
  return <div style={{
    background: C.card, border: "1px solid " + C.border, borderRadius: 12,
    height: 96, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 16px",
  }}>
    <div style={{ ...CAP, fontSize: 11, marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: "var(--gta-mono)", fontSize: 24, fontWeight: 700, color: color || C.accent, lineHeight: 1.1, whiteSpace: "nowrap" }}>{value}</div>
    {sub ? <div style={{ fontFamily: "var(--gta-sans)", fontSize: 13.5, color: C.muted, marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div> : null}
  </div>;
}

// ---------- Calculator 1: TTWO since GTA V ----------
var OPEN_2013 = 17.70;
var PRICE_NOW = 234.29;

export function InvestCalc() {
  var [amt, setAmt] = useState(1000);
  var shares = amt / OPEN_2013;
  var now = shares * PRICE_NOW;
  var mult = PRICE_NOW / OPEN_2013;
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>What GTA V did for Take-Two shareholders</div>
      <div style={{ fontFamily: "var(--gta-sans)", fontSize: 14, color: C.muted, marginBottom: 20 }}>TTWO opened at $17.70 on September 17, 2013. It closed at $234.29 on August 28, 2026. Ignores dividends (Take-Two pays none) and inflation.</div>
      <Slider label="Invested on launch day" value={amt} min={100} max={10000} step={100} onChange={setAmt}
        display={"$" + amt.toLocaleString()} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
        <Result label="Shares bought" value={shares.toFixed(1)} color={C.dim} />
        <Result label="Worth today" value={"$" + Math.round(now).toLocaleString()} color={C.green} />
        <Result label="Multiple" value={mult.toFixed(1) + "x"} sub="over 13 years" />
      </div>
    </div>
  </FadeIn>;
}

// ---------- Calculator 2: GTA VI launch scenarios ----------
var STD = 79.99;
var ULT = 99.99;
var comps = [
  { name: "GTA IV, first week (2008)", v: 0.5 },
  { name: "RDR2, first 3 days (2018)", v: 0.725 },
  { name: "GTA V, first 3 days (2013)", v: 1.0 },
];

export function LaunchCalc() {
  var [units, setUnits] = useState(40);
  var [ult, setUlt] = useState(50);
  var price = STD * (1 - ult / 100) + ULT * (ult / 100);
  var rev = units * price / 1000;
  var rows = comps.concat([{ name: "Your GTA VI scenario", v: rev, me: true }]);
  var max = Math.max(rev, 1.0) * 1.08;
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>Size the launch yourself</div>
      <div style={{ fontFamily: "var(--gta-sans)", fontSize: 14, color: C.muted, marginBottom: 20 }}>Analyst first-week forecasts range from roughly 31M to 51M units. Take-Two has said the Ultimate Edition ($99.99) is outselling the Standard ($79.99). Gross sell-through at list price, before platform fees, taxes and regional pricing.</div>
      <Slider label="Units sold in week one" value={units} min={10} max={60} step={1} onChange={setUnits} display={units + "M"} />
      <Slider label="Ultimate Edition share" value={ult} min={0} max={100} step={5} onChange={setUlt} display={ult + "%"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 22 }}>
        <Result label="Blended price" value={"$" + price.toFixed(2)} color={C.dim} />
        <Result label="Week-one sell-through" value={"$" + rev.toFixed(2) + "B"} color={C.green} />
        <Result label="vs. GTA V's 3-day record" value={rev.toFixed(1) + "x"} sub="GTA V: $1.0B" />
      </div>
      <div style={{ display: "grid", gap: 9 }}>
        {rows.map(function (r, i) {
          var w = Math.max(2, r.v / max * 100);
          return <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 190px) 1fr 76px", alignItems: "center", gap: 10 }}>
            <div style={{ fontFamily: "var(--gta-sans)", fontSize: 13.5, color: r.me ? C.text : C.dim, fontWeight: r.me ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
            <div style={{ height: 14, background: C.faint, borderRadius: 7, overflow: "hidden" }}>
              <div style={{ width: w + "%", height: "100%", background: r.me ? C.accent : C.teal, borderRadius: 7, transition: "width 0.3s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
            <div style={{ fontFamily: "var(--gta-mono)", fontSize: 13, color: r.me ? C.accent : C.dim, textAlign: "right" }}>{"$" + r.v.toFixed(2) + "B"}</div>
          </div>;
        })}
      </div>
    </div>
  </FadeIn>;
}

// ---------- Trailer / attention comparison ----------
var attn = [
  { name: "GTA V trailer 1 (2011), lifetime views by 2017", v: 47, color: C.teal },
  { name: "MrBeast, previous 24-hour non-music record", v: 59.4, color: C.muted },
  { name: "GTA VI trailer 1, 24h on YouTube (Guinness-audited)", v: 90.4, color: C.accent },
  { name: "GTA VI trailer 2, 24h across all platforms (Rockstar's count)", v: 475, color: C.gold },
];

export function AttentionChart() {
  var max = 475 * 1.04;
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>Views in 24 hours (millions)</div>
      <div style={{ fontFamily: "var(--gta-sans)", fontSize: 14, color: C.muted, marginBottom: 18 }}>Trailer 1's figure is YouTube-only and Guinness-audited. Trailer 2's 475M is Rockstar's own cross-platform count, so it is not a like-for-like record.</div>
      <div style={{ display: "grid", gap: 14 }}>
        {attn.map(function (d, i) {
          return <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--gta-sans)", fontSize: 14, color: C.dim, lineHeight: 1.35 }}>{d.name}</span>
              <span style={{ fontFamily: "var(--gta-mono)", fontSize: 14, color: d.color, fontWeight: 600, whiteSpace: "nowrap" }}>{d.v + "M"}</span>
            </div>
            <div style={{ height: 14, background: C.faint, borderRadius: 7, overflow: "hidden" }}>
              <div style={{ width: (d.v / max * 100) + "%", height: "100%", background: d.color, borderRadius: 7 }} />
            </div>
          </div>;
        })}
      </div>
    </div>
  </FadeIn>;
}

// ---------- Countdown ----------
export function daysToLaunch() {
  var launch = new Date(2026, 10, 19);
  var now = new Date();
  var d = Math.ceil((launch - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
  return d;
}
