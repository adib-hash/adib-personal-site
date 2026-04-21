import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";

// ============ DESIGN SYSTEM ============
const C = {
  bg: "#05070d",
  surface: "#0b0e17",
  card: "#121722",
  cardH: "#1a2131",
  accent: "#60a5fa",      // blue
  accent2: "#8b5cf6",     // purple
  emerald: "#34d399",
  gold: "#f59e0b",
  red: "#ef4444",
  rose: "#fb7185",
  text: "#e8ecf4",
  dim: "#9ca9bd",
  muted: "#6b7790",
  faint: "#1a2030",
  border: "#1e2535",
  glow: "rgba(96,165,250,0.06)",
};

// ============ CHAPTERS ============
const chapters = [
  { id: "hook", num: "", short: "Top" },
  { id: "ch1", num: "01", short: "The Number" },
  { id: "ch2", num: "02", short: "Microsoft" },
  { id: "ch3", num: "03", short: "Alphabet" },
  { id: "ch4", num: "04", short: "Meta" },
  { id: "ch5", num: "05", short: "Amazon" },
  { id: "ch6", num: "06", short: "Oracle" },
  { id: "ch7", num: "07", short: "NVIDIA" },
  { id: "ch8", num: "08", short: "Laggards" },
  { id: "ch9", num: "09", short: "China" },
  { id: "ch10", num: "10", short: "Neoclouds" },
  { id: "ch11", num: "11", short: "Verdict" },
  { id: "sources", num: "", short: "Sources" },
];

// ============ DATA ============
// Quarterly capex in $B — calendar-aligned
const quarterlyCapex = [
  { q: "Q4'22", Alphabet: 7.6, Microsoft: 6.8, Meta: 9.2, Amazon: 16.6, Oracle: 1.6 },
  { q: "Q1'23", Alphabet: 6.3, Microsoft: 7.8, Meta: 7.1, Amazon: 14.2, Oracle: 2.2 },
  { q: "Q2'23", Alphabet: 6.9, Microsoft: 10.7, Meta: 6.4, Amazon: 14.0, Oracle: 2.8 },
  { q: "Q3'23", Alphabet: 8.1, Microsoft: 11.2, Meta: 6.5, Amazon: 12.5, Oracle: 1.3 },
  { q: "Q4'23", Alphabet: 11.0, Microsoft: 11.5, Meta: 7.9, Amazon: 14.6, Oracle: 1.7 },
  { q: "Q1'24", Alphabet: 12.0, Microsoft: 14.0, Meta: 6.4, Amazon: 14.9, Oracle: 2.0 },
  { q: "Q2'24", Alphabet: 13.2, Microsoft: 19.0, Meta: 8.5, Amazon: 16.4, Oracle: 2.3 },
  { q: "Q3'24", Alphabet: 13.1, Microsoft: 20.0, Meta: 9.2, Amazon: 22.6, Oracle: 2.3 },
  { q: "Q4'24", Alphabet: 14.3, Microsoft: 22.6, Meta: 14.8, Amazon: 26.3, Oracle: 4.0 },
  { q: "Q1'25", Alphabet: 17.2, Microsoft: 21.4, Meta: 13.7, Amazon: 24.3, Oracle: 5.1 },
  { q: "Q2'25", Alphabet: 22.5, Microsoft: 24.2, Meta: 17.0, Amazon: 31.4, Oracle: 6.2 },
  { q: "Q3'25", Alphabet: 24.0, Microsoft: 34.9, Meta: 19.4, Amazon: 34.2, Oracle: 8.5 },
  { q: "Q4'25", Alphabet: 27.9, Microsoft: 37.5, Meta: 23.0, Amazon: 38.0, Oracle: 12.0 },
];

const annualCapex = [
  { year: "2022", total: 145, Alphabet: 31, Microsoft: 24, Meta: 32, Amazon: 58, Oracle: 0 },
  { year: "2023", total: 160, Alphabet: 32, Microsoft: 32, Meta: 27, Amazon: 48, Oracle: 7 },
  { year: "2024", total: 225, Alphabet: 53, Microsoft: 56, Meta: 39, Amazon: 78, Oracle: 7 },
  { year: "2025", total: 490, Alphabet: 91, Microsoft: 118, Meta: 73, Amazon: 128, Oracle: 32 },
  { year: "2026E", total: 720, Alphabet: 180, Microsoft: 150, Meta: 110, Amazon: 200, Oracle: 50 },
];

// Backlog/RPO data
const backlogData = [
  { name: "Microsoft", value: 625, color: C.accent },
  { name: "Oracle", value: 553, color: C.accent2 },
  { name: "Amazon", value: 244, color: C.gold },
  { name: "Alphabet", value: 240, color: C.emerald },
  { name: "CoreWeave", value: 66.8, color: C.rose },
];

// OpenAI concentration
const openaiExposure = [
  { counterparty: "Oracle (5yr)", value: 300 },
  { counterparty: "Microsoft (incremental)", value: 250 },
  { counterparty: "NVIDIA equity LOI", value: 100 },
  { counterparty: "Amazon (7yr)", value: 38 },
  { counterparty: "CoreWeave (total)", value: 22.4 },
];

// Timeline events
const timeline = [
  { date: "Nov 30, 2022", event: "ChatGPT launches", type: "catalyst" },
  { date: "Feb 1, 2023", event: "Zuckerberg's 'Year of Efficiency'", type: "pause" },
  { date: "Jan 18, 2024", event: "Zuckerberg commits 600K H100-equivalents", type: "accel" },
  { date: "Jul 2024", event: "Pichai: 'risk of under-investing dramatically greater'", type: "accel" },
  { date: "Sep 20, 2024", event: "Microsoft/Constellation Three Mile Island restart", type: "power" },
  { date: "Oct 14, 2024", event: "Google/Kairos multi-SMR nuclear deal", type: "power" },
  { date: "Dec 4, 2024", event: "Meta announces Hyperion: 2→5 GW campus", type: "accel" },
  { date: "Jan 20, 2025", event: "DeepSeek R1 release", type: "shock" },
  { date: "Jan 21, 2025", event: "White House Stargate: $500B, 10 GW", type: "accel" },
  { date: "Jan 27, 2025", event: "NVIDIA -17%, $600B single-day loss", type: "shock" },
  { date: "Feb 24, 2025", event: "Alibaba RMB 380B ($53B) 3-year plan", type: "accel" },
  { date: "Mar 25, 2025", event: "Joe Tsai: 'data centers on spec' bubble warning", type: "pause" },
  { date: "Sep 9, 2025", event: "Oracle RPO jumps to $455B", type: "accel" },
  { date: "Sep 22, 2025", event: "NVIDIA/OpenAI $100B LOI for 10 GW", type: "accel" },
  { date: "Oct 28, 2025", event: "OpenAI restructures; MSFT gets 27% stake (~$135B)", type: "accel" },
  { date: "Oct 30, 2025", event: "Meta ~$30B bond issuance", type: "debt" },
  { date: "Nov 3, 2025", event: "Amazon/OpenAI $38B, 7-year deal", type: "accel" },
  { date: "Feb 5, 2026", event: "Amazon $200B 2026 capex guide shocks market", type: "accel" },
  { date: "Mar 2026", event: "Oracle $50B FY26 capex; $90B FY27 revenue guide", type: "accel" },
];

// Where the dollars go
const spendBreakdown = [
  { category: "NVIDIA GPUs", pct: 45, color: C.accent, note: "H100/H200/B200/GB200/GB300/Rubin" },
  { category: "Custom Silicon", pct: 15, color: C.accent2, note: "TPU, Trainium, Maia, MTIA" },
  { category: "Data Center Shell", pct: 20, color: C.emerald, note: "Land, construction, cooling" },
  { category: "Power & Transmission", pct: 10, color: C.gold, note: "Nuclear, gas, renewables, grid" },
  { category: "Networking", pct: 6, color: C.rose, note: "Fiber, switches, interconnect" },
  { category: "Other", pct: 4, color: C.dim, note: "Servers, storage, misc." },
];

// ============ PRIMITIVES ============
function FadeIn({ children, delay }) {
  var [vis, setVis] = useState(false);
  var ref = useRef();
  useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var obs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) { setVis(true); obs.disconnect(); }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return function () { obs.disconnect(); };
  }, []);
  var d = delay || 0;
  return <div ref={ref} style={{
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(24px)",
    transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) " + d + "s, transform 0.7s cubic-bezier(0.16,1,0.3,1) " + d + "s",
  }}>{children}</div>;
}

function Ed({ children }) {
  return <FadeIn><p style={{
    fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.85,
    color: C.dim, margin: "0 0 28px", fontStyle: "italic",
    borderLeft: "2px solid " + C.gold + "50", paddingLeft: 22,
  }}>{children}</p></FadeIn>;
}

function Rf({ n }) {
  return <sup style={{
    color: C.accent, fontSize: 10, cursor: "pointer",
    fontFamily: "var(--mono)", fontWeight: 600, opacity: 0.75,
    marginLeft: 1,
  }} onClick={function () {
    var el = document.getElementById("sources");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }}>{"[" + n + "]"}</sup>;
}

function Quote({ children, by }) {
  return <FadeIn><blockquote style={{
    fontFamily: "var(--serif)", fontSize: 20, lineHeight: 1.55,
    color: C.text, margin: "30px 0", padding: "22px 26px",
    background: C.glow, borderLeft: "3px solid " + C.accent,
    borderRadius: "0 8px 8px 0", fontStyle: "italic",
  }}>
    <div>&ldquo;{children}&rdquo;</div>
    <div style={{
      fontFamily: "var(--sans)", fontSize: 11, fontStyle: "normal",
      color: C.muted, marginTop: 12, letterSpacing: 0.6, textTransform: "uppercase",
    }}>— {by}</div>
  </blockquote></FadeIn>;
}

function P({ children }) {
  return <FadeIn><p style={{
    fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.75,
    color: C.text, margin: "0 0 22px",
  }}>{children}</p></FadeIn>;
}

function H2({ children, id, num }) {
  return <div id={id} style={{ scrollMarginTop: 80, margin: "90px 0 34px" }}>
    <FadeIn>
      {num ? <div style={{
        fontFamily: "var(--mono)", fontSize: 11, color: C.accent,
        letterSpacing: 3, marginBottom: 10, fontWeight: 600,
      }}>CHAPTER {num}</div> : null}
      <h2 style={{
        fontFamily: "var(--display)", fontSize: 42, lineHeight: 1.1,
        color: C.text, margin: 0, fontWeight: 700, letterSpacing: -0.5,
      }}>{children}</h2>
    </FadeIn>
  </div>;
}

function H3({ children }) {
  return <FadeIn><h3 style={{
    fontFamily: "var(--display)", fontSize: 24, lineHeight: 1.25,
    color: C.text, margin: "36px 0 14px", fontWeight: 700,
  }}>{children}</h3></FadeIn>;
}

function StatCard({ label, value, sub, color }) {
  var col = color || C.accent;
  return <div style={{
    background: C.card, border: "1px solid " + C.border,
    borderRadius: 12, padding: "18px 20px", height: 130,
    display: "flex", flexDirection: "column", justifyContent: "space-between",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: col }} />
    <div style={{
      fontFamily: "var(--sans)", fontSize: 10, color: C.muted,
      letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600,
    }}>{label}</div>
    <div>
      <div style={{
        fontFamily: "var(--display)", fontSize: 32, fontWeight: 800,
        color: col, lineHeight: 1,
      }}>{value}</div>
      {sub ? <div style={{
        fontFamily: "var(--sans)", fontSize: 11, color: C.dim,
        marginTop: 6,
      }}>{sub}</div> : null}
    </div>
  </div>;
}

// ============ TOOLTIP ============
function Tip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return <div style={{
    background: C.card, border: "1px solid " + C.border,
    borderRadius: 10, padding: "12px 14px",
    boxShadow: "0 16px 48px rgba(0,0,0,.8)",
  }}>
    <div style={{
      color: C.muted, fontSize: 10, fontFamily: "var(--mono)",
      marginBottom: 8, letterSpacing: 0.5,
    }}>{label}</div>
    {payload.map(function (p, i) {
      return <div key={i} style={{
        color: p.color, fontSize: 12, fontFamily: "var(--sans)",
        marginTop: i > 0 ? 3 : 0,
      }}>
        {p.name}: <strong>{"$" + (typeof p.value === "number" ? p.value.toFixed(1) : p.value) + "B"}</strong>
      </div>;
    })}
  </div>;
}

// ============ CHARTS ============
function QuarterlyChart() {
  var [mode, setMode] = useState("stacked");
  return <FadeIn><div style={{
    background: C.surface, border: "1px solid " + C.border,
    borderRadius: 14, padding: "20px 16px", margin: "28px 0",
  }}>
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: 18, flexWrap: "wrap", gap: 12,
    }}>
      <div>
        <div style={{
          fontFamily: "var(--sans)", fontSize: 10, color: C.accent,
          letterSpacing: 2, fontWeight: 600, marginBottom: 4,
        }}>FIGURE 1 — QUARTERLY CAPEX BY HYPERSCALER</div>
        <div style={{
          fontFamily: "var(--display)", fontSize: 20, color: C.text, fontWeight: 700,
        }}>$USD billions, ChatGPT launch → present</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {["stacked", "lines"].map(function (m) {
          return <button key={m} onClick={function () { setMode(m); }} style={{
            padding: "6px 12px", fontSize: 11, borderRadius: 6,
            fontFamily: "var(--sans)", fontWeight: 600, letterSpacing: 0.5,
            border: "1px solid " + (mode === m ? C.accent : C.border),
            background: mode === m ? C.accent + "20" : "transparent",
            color: mode === m ? C.accent : C.muted, cursor: "pointer",
            textTransform: "uppercase", transition: "all 0.15s",
          }}>{m}</button>;
        })}
      </div>
    </div>
    <div style={{ height: 340 }}>
      <ResponsiveContainer width="100%" height="100%">
        {mode === "stacked" ? (
          <AreaChart data={quarterlyCapex} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid stroke={C.faint} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="q" stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--mono)" }} />
            <YAxis stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--mono)" }} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--sans)" }} />
            <Area type="monotone" dataKey="Amazon" stackId="1" stroke={C.gold} fill={C.gold + "80"} />
            <Area type="monotone" dataKey="Microsoft" stackId="1" stroke={C.accent} fill={C.accent + "80"} />
            <Area type="monotone" dataKey="Alphabet" stackId="1" stroke={C.emerald} fill={C.emerald + "80"} />
            <Area type="monotone" dataKey="Meta" stackId="1" stroke={C.accent2} fill={C.accent2 + "80"} />
            <Area type="monotone" dataKey="Oracle" stackId="1" stroke={C.rose} fill={C.rose + "80"} />
          </AreaChart>
        ) : (
          <LineChart data={quarterlyCapex} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <CartesianGrid stroke={C.faint} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="q" stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--mono)" }} />
            <YAxis stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--mono)" }} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--sans)" }} />
            <Line type="monotone" dataKey="Amazon" stroke={C.gold} strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="Microsoft" stroke={C.accent} strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="Alphabet" stroke={C.emerald} strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="Meta" stroke={C.accent2} strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="Oracle" stroke={C.rose} strokeWidth={2.2} dot={false} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
    <div style={{
      fontFamily: "var(--sans)", fontSize: 10, color: C.muted,
      marginTop: 14, lineHeight: 1.6,
    }}>
      Source: company 10-Q/10-K filings; Microsoft shown including finance leases. Q4'25 Meta/Oracle partially estimated from management guidance.<Rf n={1} />
    </div>
  </div></FadeIn>;
}

function AnnualChart() {
  return <FadeIn><div style={{
    background: C.surface, border: "1px solid " + C.border,
    borderRadius: 14, padding: "20px 16px", margin: "28px 0",
  }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 10, color: C.accent,
        letterSpacing: 2, fontWeight: 600, marginBottom: 4,
      }}>FIGURE 2 — AGGREGATE BIG 5 CAPEX</div>
      <div style={{
        fontFamily: "var(--display)", fontSize: 20, color: C.text, fontWeight: 700,
      }}>$145B → $720B in four years</div>
    </div>
    <div style={{ height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={annualCapex} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
          <CartesianGrid stroke={C.faint} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" stroke={C.muted} tick={{ fontSize: 11, fontFamily: "var(--mono)" }} />
          <YAxis stroke={C.muted} tick={{ fontSize: 10, fontFamily: "var(--mono)" }} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="total" radius={[8, 8, 0, 0]}>
            {annualCapex.map(function (entry, idx) {
              var colorMap = [C.muted, C.muted, C.accent, C.accent2, C.gold];
              return <Cell key={idx} fill={colorMap[idx]} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: 10, marginTop: 20,
    }}>
      {annualCapex.map(function (d, i) {
        var isForecast = d.year.indexOf("E") > -1;
        return <div key={d.year} style={{
          padding: "10px 12px", borderRadius: 8,
          border: "1px solid " + (isForecast ? C.gold : C.border),
          background: isForecast ? C.gold + "10" : C.card,
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, color: C.muted,
            letterSpacing: 0.5,
          }}>{d.year}</div>
          <div style={{
            fontFamily: "var(--display)", fontSize: 22, fontWeight: 800,
            color: isForecast ? C.gold : C.text, marginTop: 4,
          }}>${d.total}B</div>
        </div>;
      })}
    </div>
  </div></FadeIn>;
}

function BacklogChart() {
  var maxV = 625;
  return <FadeIn><div style={{
    background: C.surface, border: "1px solid " + C.border,
    borderRadius: 14, padding: "20px 16px", margin: "28px 0",
  }}>
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 10, color: C.accent,
        letterSpacing: 2, fontWeight: 600, marginBottom: 4,
      }}>FIGURE 3 — CONTRACTED BACKLOG (RPO)</div>
      <div style={{
        fontFamily: "var(--display)", fontSize: 20, color: C.text, fontWeight: 700,
      }}>$1.7T of forward revenue, one customer underwrites ~20%</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {backlogData.map(function (d) {
        var pct = (d.value / maxV) * 100;
        return <div key={d.name}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: 6, fontFamily: "var(--sans)",
          }}>
            <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{d.name}</span>
            <span style={{
              color: d.color, fontSize: 14, fontWeight: 700,
              fontFamily: "var(--mono)",
            }}>${d.value}B</span>
          </div>
          <div style={{
            height: 10, background: C.faint, borderRadius: 5, overflow: "hidden",
          }}>
            <div style={{
              height: "100%", width: pct + "%",
              background: "linear-gradient(90deg, " + d.color + "80, " + d.color + ")",
              borderRadius: 5, transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
            }} />
          </div>
        </div>;
      })}
    </div>
    <div style={{
      fontFamily: "var(--sans)", fontSize: 10, color: C.muted,
      marginTop: 18, lineHeight: 1.6,
    }}>
      Source: Q4'25 / Q2 FY26 company filings. Microsoft = commercial RPO; Oracle = total RPO (Q3 FY26).<Rf n={2} />
    </div>
  </div></FadeIn>;
}

function SpendBreakdownChart() {
  return <FadeIn><div style={{
    background: C.surface, border: "1px solid " + C.border,
    borderRadius: 14, padding: "20px 16px", margin: "28px 0",
  }}>
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 10, color: C.accent,
        letterSpacing: 2, fontWeight: 600, marginBottom: 4,
      }}>FIGURE 4 — WHERE THE DOLLARS GO</div>
      <div style={{
        fontFamily: "var(--display)", fontSize: 20, color: C.text, fontWeight: 700,
      }}>Estimated mix of hyperscaler AI capex</div>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {spendBreakdown.map(function (d) {
        return <div key={d.category} style={{
          flex: "1 1 " + (d.pct * 3) + "%", minWidth: 140,
          background: d.color + "15",
          border: "1px solid " + d.color + "40",
          borderRadius: 10, padding: "16px 14px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 3, background: d.color,
          }} />
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, color: C.muted,
            letterSpacing: 0.5, marginBottom: 4,
          }}>{d.pct + "%"}</div>
          <div style={{
            fontFamily: "var(--sans)", fontSize: 14, color: C.text,
            fontWeight: 700, marginBottom: 4,
          }}>{d.category}</div>
          <div style={{
            fontFamily: "var(--sans)", fontSize: 11, color: C.dim,
            lineHeight: 1.4,
          }}>{d.note}</div>
        </div>;
      })}
    </div>
    <div style={{
      fontFamily: "var(--sans)", fontSize: 10, color: C.muted,
      marginTop: 16, lineHeight: 1.6,
    }}>Illustrative mix synthesized from company disclosures, SemiAnalysis estimates, and industry supply-chain reporting. Figures vary meaningfully by operator.<Rf n={3} /></div>
  </div></FadeIn>;
}

function OpenAIChart() {
  var total = openaiExposure.reduce(function (a, b) { return a + b.value; }, 0);
  return <FadeIn><div style={{
    background: "linear-gradient(135deg, " + C.red + "08, " + C.rose + "10)",
    border: "1px solid " + C.red + "40",
    borderRadius: 14, padding: "22px 20px", margin: "28px 0",
  }}>
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 10, color: C.rose,
        letterSpacing: 2, fontWeight: 600, marginBottom: 4,
      }}>FIGURE 5 — THE $710B OPENAI CONCENTRATION</div>
      <div style={{
        fontFamily: "var(--display)", fontSize: 20, color: C.text, fontWeight: 700,
      }}>One private counterparty underwrites the cycle</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {openaiExposure.map(function (d) {
        var pct = (d.value / 300) * 100;
        return <div key={d.counterparty}>
          <div style={{
            display: "flex", justifyContent: "space-between", marginBottom: 5,
          }}>
            <span style={{
              color: C.text, fontSize: 12, fontFamily: "var(--sans)", fontWeight: 500,
            }}>{d.counterparty}</span>
            <span style={{
              color: C.rose, fontSize: 13, fontWeight: 700, fontFamily: "var(--mono)",
            }}>${d.value}B</span>
          </div>
          <div style={{ height: 8, background: C.faint, borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: Math.min(pct, 100) + "%",
              background: "linear-gradient(90deg, " + C.red + "80, " + C.rose + ")",
            }} />
          </div>
        </div>;
      })}
    </div>
    <div style={{
      marginTop: 20, padding: "14px 16px",
      background: C.red + "10", borderRadius: 8,
      border: "1px dashed " + C.red + "40",
    }}>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 11, color: C.rose,
        fontWeight: 700, letterSpacing: 1, marginBottom: 6,
      }}>TOTAL EXPOSURE</div>
      <div style={{
        fontFamily: "var(--display)", fontSize: 28, fontWeight: 800, color: C.text,
      }}>~${total.toFixed(0)}B forward commitments</div>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 11, color: C.dim, marginTop: 6,
      }}>~66% of Oracle RPO · ~40% of CoreWeave RPO · ~45% of Microsoft commercial RPO.<Rf n={4} /></div>
    </div>
  </div></FadeIn>;
}

// ============ INTERACTIVE: PAYBACK CALCULATOR ============
function PaybackCalc() {
  var [capex, setCapex] = useState(200);
  var [arpc, setArpc] = useState(35);
  var [margin, setMargin] = useState(30);
  var [life, setLife] = useState(5);

  var annualRev = capex * (arpc / 100);
  var annualOpInc = annualRev * (margin / 100);
  var annualDep = capex / life;
  var paybackYears = annualOpInc > 0 ? capex / annualOpInc : 99;
  var netNPV = (annualOpInc - annualDep) * life;

  return <FadeIn><div style={{
    background: C.surface, border: "1px solid " + C.border,
    borderRadius: 14, padding: "24px 22px", margin: "28px 0",
  }}>
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 10, color: C.accent,
        letterSpacing: 2, fontWeight: 600, marginBottom: 4,
      }}>INTERACTIVE — UNIT ECONOMICS</div>
      <div style={{
        fontFamily: "var(--display)", fontSize: 20, color: C.text, fontWeight: 700,
      }}>Does the AI capex pay back?</div>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 12, color: C.dim,
        marginTop: 6, lineHeight: 1.5,
      }}>
        Adjust the assumptions. See what it takes to earn a return.
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
      <Slider label="Annual Capex ($B)" value={capex} min={50} max={250} step={10}
        onChange={setCapex} format={function (v) { return "$" + v + "B"; }} />
      <Slider label="Revenue / Capex ($1 → ?)" value={arpc} min={10} max={80} step={5}
        onChange={setArpc} format={function (v) { return "$0." + (v < 10 ? "0" + v : v).toString().slice(0, 2); }} />
      <Slider label="Operating Margin %" value={margin} min={10} max={50} step={5}
        onChange={setMargin} format={function (v) { return v + "%"; }} />
      <Slider label="Asset Useful Life (yrs)" value={life} min={3} max={8} step={1}
        onChange={setLife} format={function (v) { return v + " yrs"; }} />
    </div>

    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10,
    }}>
      <ResultCard label="Annual AI Revenue" value={"$" + annualRev.toFixed(1) + "B"} color={C.accent} />
      <ResultCard label="Annual Operating Income" value={"$" + annualOpInc.toFixed(1) + "B"} color={C.emerald} />
      <ResultCard label="Annual Depreciation" value={"$" + annualDep.toFixed(1) + "B"} color={C.gold} />
      <ResultCard label="Simple Payback"
        value={paybackYears > 20 ? ">20 yrs" : paybackYears.toFixed(1) + " yrs"}
        color={paybackYears <= life ? C.emerald : C.rose} />
      <ResultCard label={"Net Profit over " + life + "yr"}
        value={(netNPV >= 0 ? "+$" : "−$") + Math.abs(netNPV).toFixed(1) + "B"}
        color={netNPV >= 0 ? C.emerald : C.red} />
    </div>

    <div style={{
      marginTop: 18, padding: "12px 14px", borderRadius: 8,
      background: C.glow, fontFamily: "var(--serif)", fontSize: 13,
      color: C.dim, lineHeight: 1.6, fontStyle: "italic",
    }}>
      Real-world benchmarks: Azure AI exited 2025 at ~$25B ARR on ~$88B capex → 28% rev/capex. Google Cloud: $70B run rate on $91B capex → 77%. The spread is the bull/bear debate.<Rf n={5} />
    </div>
  </div></FadeIn>;
}

function Slider({ label, value, min, max, step, onChange, format }) {
  return <div>
    <div style={{
      display: "flex", justifyContent: "space-between",
      marginBottom: 6, alignItems: "baseline",
    }}>
      <span style={{
        fontFamily: "var(--sans)", fontSize: 11, color: C.muted,
        letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600,
      }}>{label}</span>
      <span style={{
        fontFamily: "var(--mono)", fontSize: 14, color: C.accent,
        fontWeight: 700,
      }}>{format(value)}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={function (e) { onChange(Number(e.target.value)); }}
      style={{
        width: "100%", accentColor: C.accent, cursor: "pointer",
      }} />
  </div>;
}

function ResultCard({ label, value, color }) {
  return <div style={{
    height: 82, background: C.card, borderRadius: 8,
    border: "1px solid " + C.border, padding: "12px 14px",
    display: "flex", flexDirection: "column", justifyContent: "center",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color }} />
    <div style={{
      fontFamily: "var(--sans)", fontSize: 9, color: C.muted,
      letterSpacing: 0.8, textTransform: "uppercase", fontWeight: 600, marginBottom: 5,
    }}>{label}</div>
    <div style={{
      fontFamily: "var(--mono)", fontSize: 17, color: color, fontWeight: 700,
    }}>{value}</div>
  </div>;
}

// ============ TIMELINE ============
function Timeline() {
  var colorFor = function (t) {
    if (t === "catalyst") return C.accent;
    if (t === "pause") return C.gold;
    if (t === "accel") return C.emerald;
    if (t === "shock") return C.red;
    if (t === "power") return C.accent2;
    if (t === "debt") return C.rose;
    return C.dim;
  };
  return <FadeIn><div style={{
    background: C.surface, border: "1px solid " + C.border,
    borderRadius: 14, padding: "24px 22px", margin: "28px 0",
  }}>
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 10, color: C.accent,
        letterSpacing: 2, fontWeight: 600, marginBottom: 4,
      }}>FIGURE 6 — INFLECTION POINTS</div>
      <div style={{
        fontFamily: "var(--display)", fontSize: 20, color: C.text, fontWeight: 700,
      }}>The key dates that bent the capex curve</div>
    </div>
    <div style={{ position: "relative", paddingLeft: 28 }}>
      <div style={{
        position: "absolute", left: 9, top: 4, bottom: 4, width: 1.5,
        background: "linear-gradient(to bottom, " + C.accent + ", " + C.gold + ", " + C.emerald + ")",
        borderRadius: 1,
      }} />
      {timeline.map(function (ev, i) {
        var col = colorFor(ev.type);
        return <div key={i} style={{
          position: "relative", paddingBottom: i === timeline.length - 1 ? 0 : 18,
        }}>
          <div style={{
            position: "absolute", left: -23, top: 5, width: 9, height: 9,
            borderRadius: "50%", background: col,
            border: "2px solid " + C.bg,
            boxShadow: "0 0 0 1px " + col,
          }} />
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, color: col,
            fontWeight: 600, letterSpacing: 0.5, marginBottom: 3,
          }}>{ev.date}</div>
          <div style={{
            fontFamily: "var(--sans)", fontSize: 13, color: C.text,
            lineHeight: 1.5,
          }}>{ev.event}</div>
        </div>;
      })}
    </div>
  </div></FadeIn>;
}

// ============ COMPANY PROFILE CARD ============
function CompanyCard({ name, ticker, capex25, capex26, accent, headline, highlight }) {
  return <FadeIn><div style={{
    background: C.surface, border: "1px solid " + C.border,
    borderRadius: 14, padding: "22px 24px", margin: "22px 0",
    position: "relative", overflow: "hidden",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accent,
    }} />
    <div style={{
      display: "flex", justifyContent: "space-between",
      alignItems: "flex-start", flexWrap: "wrap", gap: 14, marginBottom: 16,
    }}>
      <div>
        <div style={{
          fontFamily: "var(--display)", fontSize: 26, color: C.text,
          fontWeight: 800, lineHeight: 1,
        }}>{name}</div>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, color: C.muted,
          marginTop: 6, letterSpacing: 1,
        }}>{ticker}</div>
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "var(--sans)", fontSize: 9, color: C.muted,
            letterSpacing: 1, textTransform: "uppercase",
          }}>2025 Capex</div>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 18, color: C.text,
            fontWeight: 700, marginTop: 3,
          }}>${capex25}B</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "var(--sans)", fontSize: 9, color: accent,
            letterSpacing: 1, textTransform: "uppercase", fontWeight: 700,
          }}>2026E Capex</div>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 18, color: accent,
            fontWeight: 800, marginTop: 3,
          }}>{capex26}</div>
        </div>
      </div>
    </div>
    <div style={{
      fontFamily: "var(--serif)", fontSize: 16, color: C.text,
      lineHeight: 1.6, marginBottom: highlight ? 14 : 0,
    }}>{headline}</div>
    {highlight ? <div style={{
      padding: "12px 14px", borderRadius: 8,
      background: accent + "10", border: "1px solid " + accent + "30",
      fontFamily: "var(--sans)", fontSize: 13, color: C.dim,
      lineHeight: 1.6,
    }}><strong style={{ color: accent }}>Signal: </strong>{highlight}</div> : null}
  </div></FadeIn>;
}

// ============ NAV ============
function NavBar({ active, show }) {
  var navRef = useRef();
  useEffect(function () {
    if (!navRef.current || !active) return;
    var el = navRef.current.querySelector('[data-ch="' + active + '"]');
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return <nav style={{
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: C.bg + "ee", backdropFilter: "blur(18px)",
    borderBottom: "1px solid " + C.faint,
    transform: show ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
  }}>
    <div style={{
      maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center",
      paddingLeft: 8, paddingRight: 8,
    }}>
      <Link to="/research" aria-label="Back to research" style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "13px 14px 13px 10px", marginRight: 6,
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
              top: el.getBoundingClientRect().top + window.scrollY - 56,
              behavior: "smooth",
            });
          }}
          style={{
            padding: "14px 14px", fontSize: 11,
            fontWeight: isA ? 700 : 500, whiteSpace: "nowrap",
            color: isA ? C.accent : C.muted,
            borderBottom: "2px solid " + (isA ? C.accent : "transparent"),
            textDecoration: "none", fontFamily: "var(--sans)",
            transition: "color 0.15s, border-color 0.15s",
            letterSpacing: 0.3,
          }}>
          {ch.num ? ch.num + " " + ch.short : ch.short}
        </a>;
      })}
      </div>
    </div>
  </nav>;
}

// ============ SOURCES ============
var sourcesList = [
  { n: 1, title: "Company 10-K and 10-Q filings (Q4 2022–Q4 2025)", url: "https://www.sec.gov/edgar/searchedgar/companysearch" },
  { n: 2, title: "Microsoft Q2 FY26 earnings — commercial RPO $625B", url: "https://www.microsoft.com/en-us/investor/earnings" },
  { n: 3, title: "SemiAnalysis — AI capex cost breakdown", url: "https://www.semianalysis.com/" },
  { n: 4, title: "Morgan Stanley research — OpenAI counterparty concentration (Oct 2025)", url: "https://www.morganstanley.com/ideas/" },
  { n: 5, title: "Microsoft FY25 Azure AI $13B run rate disclosure", url: "https://www.microsoft.com/en-us/Investor/earnings/FY-2025-Q2/press-release-webcast" },
  { n: 6, title: "Satya Nadella on DeepSeek & Jevons Paradox (Jan 27, 2025)", url: "https://x.com/satyanadella/status/1883753899255046301" },
  { n: 7, title: "Microsoft $80B FY25 commitment (Brad Smith, Jan 3, 2025)", url: "https://blogs.microsoft.com/on-the-issues/2025/01/03/the-golden-opportunity-for-american-ai/" },
  { n: 8, title: "Three Mile Island restart / Constellation 20-yr PPA (Sep 20, 2024)", url: "https://www.constellationenergy.com/newsroom.html" },
  { n: 9, title: "Alphabet Q4 2025 capex guide $175–185B (Feb 4, 2026)", url: "https://abc.xyz/investor/" },
  { n: 10, title: "Sundar Pichai — 'under-investing' risk framing (Q2 2024 call)", url: "https://abc.xyz/investor/" },
  { n: 11, title: "Anthropic up to 1M TPU commitment (Oct 23, 2025)", url: "https://www.anthropic.com/news" },
  { n: 12, title: "Meta $30B bond issuance (Oct 2025)", url: "https://investor.atmeta.com/" },
  { n: 13, title: "Meta/Hyperion Richland Parish LA announcement (Dec 4, 2024)", url: "https://about.fb.com/news/" },
  { n: 14, title: "Meta Superintelligence Labs / Scale AI $14.3B (Jun 12, 2025)", url: "https://about.fb.com/news/" },
  { n: 15, title: "Amazon Q4 2025 earnings & $200B capex guide (Feb 5, 2026)", url: "https://ir.aboutamazon.com/" },
  { n: 16, title: "Project Rainier / Trainium2 — re:Invent Dec 2024", url: "https://aws.amazon.com/blogs/aws/" },
  { n: 17, title: "Amazon–OpenAI $38B, 7-year deal (Nov 3, 2025)", url: "https://ir.aboutamazon.com/" },
  { n: 18, title: "Anthropic $8B cumulative Amazon investment (Nov 2024)", url: "https://www.aboutamazon.com/news/" },
  { n: 19, title: "Oracle Q1 FY26 RPO $455B (Sep 9, 2025)", url: "https://investor.oracle.com/" },
  { n: 20, title: "Oracle $18B bond offering (Sep 24, 2025); Moody's negative outlook", url: "https://www.moodys.com/" },
  { n: 21, title: "Stargate announcement — White House (Jan 21, 2025)", url: "https://www.whitehouse.gov/briefings/" },
  { n: 22, title: "NVIDIA Q3 FY26 earnings — customer concentration 61%", url: "https://investor.nvidia.com/" },
  { n: 23, title: "Jensen Huang '$3-4T AI infra by end of decade' (Q2 FY26 call)", url: "https://investor.nvidia.com/" },
  { n: 24, title: "NVIDIA–OpenAI $100B LOI / 10 GW (Sep 22, 2025)", url: "https://nvidianews.nvidia.com/" },
  { n: 25, title: "Alibaba RMB 380B 3-yr AI commitment (Feb 24, 2025)", url: "https://www.alibabagroup.com/en/news/" },
  { n: 26, title: "Joe Tsai 'data centers on spec' bubble warning (Mar 25, 2025)", url: "https://www.bloomberg.com/" },
  { n: 27, title: "DeepSeek R1 release (Jan 20, 2025); NVIDIA −17% Jan 27", url: "https://www.reuters.com/" },
  { n: 28, title: "CoreWeave Q4 2025 earnings — backlog $66.8B", url: "https://investors.coreweave.com/" },
  { n: 29, title: "Microsoft–Nebius $17.4B 5-yr deal (Sep 8, 2025)", url: "https://www.nebius.com/investors" },
  { n: 30, title: "Michael Burry depreciation understatement claim (Nov 2025)", url: "https://www.ft.com/" },
  { n: 31, title: "TD Cowen Microsoft lease cancellation report (Feb 21, 2025)", url: "https://www.bloomberg.com/" },
  { n: 32, title: "FERC rejection of Amazon–Talen colocation (Nov 1, 2024)", url: "https://www.ferc.gov/" },
  { n: 33, title: "Zuckerberg '600K H100-equivalents' Instagram (Jan 18, 2024)", url: "https://about.fb.com/news/" },
  { n: 34, title: "Tencent Q3 2025 capex −24% YoY", url: "https://www.tencent.com/en-us/investors.html" },
  { n: 35, title: "OpenAI restructuring; Microsoft 27% stake (Oct 28, 2025)", url: "https://openai.com/index/" },
];

function Sources() {
  return <div id="sources" style={{
    scrollMarginTop: 80, borderTop: "1px solid " + C.border,
    padding: "70px 0 40px",
  }}>
    <H2 num="" id="sources-inner">Sources & Methodology</H2>
    <P>
      All quantitative figures cross-referenced against primary filings (10-K, 10-Q, 8-K, investor presentations) where available, supplemented by authoritative secondary reporting. Quarterly capex figures reflect reported calendar-quarter alignment; Microsoft fiscal years end June 30 and Oracle fiscal years end May 31, adjusted to calendar quarters for comparability. Where 2026 figures appear as guides, they reflect official management commentary at latest earnings call, not analyst consensus.
    </P>
    <P>
      <strong>Methodology notes:</strong> The ~$720B 2026 aggregate is the sum of company-stated guidance where available, plus consensus where not. Q4 2025 figures for Meta and Oracle include estimates bridged from half-year guidance. Chinese hyperscaler figures converted at ~7.2 RMB/USD. "AI-specific" capex is rarely broken out by companies, so our mix estimates in Figure 4 synthesize hyperscaler commentary, SemiAnalysis reporting, and NVIDIA supply-chain disclosures.
    </P>
    <div style={{ marginTop: 28 }}>
      {sourcesList.map(function (s) {
        return <div key={s.n} style={{
          display: "flex", gap: 14, padding: "10px 0",
          borderBottom: "1px solid " + C.faint,
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 10, color: C.accent,
            fontWeight: 700, minWidth: 28, paddingTop: 2,
          }}>[{s.n}]</div>
          <div style={{ flex: 1 }}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "var(--sans)", fontSize: 13, color: C.text,
              textDecoration: "none", lineHeight: 1.5, display: "block",
            }}>{s.title}</a>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 10, color: C.muted,
              marginTop: 3, wordBreak: "break-all",
            }}>{s.url}</div>
          </div>
        </div>;
      })}
    </div>
    <div style={{
      marginTop: 40, padding: "18px 20px", borderRadius: 10,
      background: C.card, border: "1px solid " + C.border,
    }}>
      <div style={{
        fontFamily: "var(--sans)", fontSize: 10, color: C.gold,
        letterSpacing: 2, fontWeight: 700, marginBottom: 8,
      }}>CORRECTIONS APPLIED</div>
      <div style={{
        fontFamily: "var(--serif)", fontSize: 14, color: C.dim,
        lineHeight: 1.7,
      }}>
        Oracle FY26 capex guide reflects March 2026 update to ~$50B (originally $25B at June 2025 investor day, raised to ~$35B in September). Meta 2026 capex guide framed as "$100–120B range" reflects management's Q4 2025 commentary rather than a specific committed number. Microsoft's cash capex and "including finance leases" figures differ materially and both are disclosed to avoid ambiguity.
      </div>
    </div>
    <div style={{
      marginTop: 30, fontFamily: "var(--sans)", fontSize: 11,
      color: C.muted, textAlign: "center", lineHeight: 1.7,
    }}>
      Report period: November 30, 2022 (ChatGPT launch) through April 20, 2026.<br />
      Prepared as an analytical reference, not investment advice.
    </div>
  </div>;
}

// ============ MAIN APP ============
export default function AiCapex() {
  var [activeChapter, setActiveChapter] = useState("hook");
  var [showNav, setShowNav] = useState(false);
  var rafRef = useRef(null);
  var lastRef = useRef("hook");

  useEffect(function () {
    var onScroll = function () {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(function () {
        rafRef.current = null;
        setShowNav(window.scrollY > window.innerHeight * 0.6);
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

  return <div style={{
    background: C.bg, minHeight: "100vh",
    color: C.text, fontFamily: "var(--serif)",
  }}>
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');"}</style>
    <style>{":root{--display:'Playfair Display',Georgia,serif;--serif:'Source Serif 4',Georgia,serif;--sans:'Outfit',sans-serif;--mono:'IBM Plex Mono',monospace}body{margin:0;background:" + C.bg + "}*{box-sizing:border-box}a{color:" + C.accent + "}input[type=range]{-webkit-appearance:none;height:6px;background:" + C.faint + ";border-radius:3px;outline:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;background:" + C.accent + ";border-radius:50%;cursor:pointer;box-shadow:0 0 8px " + C.accent + "80}"}</style>

    <Link to="/research" aria-label="Back to research" className="aicx-floating-back" style={{
      position: "fixed",
      top: "max(14px, env(safe-area-inset-top))",
      left: 14, zIndex: 200,
      opacity: showNav ? 0 : 1,
      pointerEvents: showNav ? "none" : "auto",
      transform: showNav ? "translateY(-8px)" : "translateY(0)",
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "9px 14px",
      background: "rgba(5,7,13,0.82)",
      backdropFilter: "blur(14px) saturate(1.6)",
      WebkitBackdropFilter: "blur(14px) saturate(1.6)",
      border: "1px solid " + C.faint,
      borderRadius: 999,
      color: C.dim, fontFamily: "var(--mono)", fontSize: 11,
      fontWeight: 500, textDecoration: "none", letterSpacing: "0.04em",
      textTransform: "uppercase",
      transition: "color 0.2s, border-color 0.2s, background 0.2s, opacity 0.3s, transform 0.3s",
      boxShadow: "0 4px 16px rgba(0,0,0,0.45)",
    }} onMouseEnter={function (e) { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accent + "80"; }}
      onMouseLeave={function (e) { e.currentTarget.style.color = C.dim; e.currentTarget.style.borderColor = C.faint; }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>{"\u2190"}</span>
      <span className="aicx-back-label">Back</span>
    </Link>
    <style>{`@media (min-width:1024px){a[aria-label="Back to research"].aicx-floating-back{top:24px!important;left:24px!important;padding:10px 16px!important;font-size:12px!important;gap:8px!important}.aicx-back-label::after{content:" to research"}}`}</style>

    <NavBar active={activeChapter} show={showNav} />

    {/* HERO */}
    <section id="hook" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", padding: "60px 24px 80px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "10%", right: "-5%", width: 500, height: 500,
        background: "radial-gradient(circle, " + C.accent + "25 0%, transparent 60%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "-5%", width: 400, height: 400,
        background: "radial-gradient(circle, " + C.accent2 + "25 0%, transparent 60%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{ maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <FadeIn>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, color: C.accent,
            letterSpacing: 3, fontWeight: 600, marginBottom: 24,
          }}>A DEEP RESEARCH REPORT · APRIL 2026</div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 style={{
            fontFamily: "var(--display)", fontSize: "min(72px, 9vw)",
            lineHeight: 0.95, margin: "0 0 28px",
            fontWeight: 800, letterSpacing: -2,
            color: C.text,
          }}>
            The <span style={{
              background: "linear-gradient(135deg, " + C.accent + ", " + C.accent2 + ")",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>$2 trillion</span> AI buildout
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div style={{
            fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1.45,
            color: C.dim, margin: "0 0 40px", maxWidth: 700,
          }}>
            In 41 months since ChatGPT launched, Big Tech has committed north of $1.6 trillion in AI capex, with another $720 billion guided for 2026 alone. This is the largest, fastest industrial build-out in corporate history.
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14, marginTop: 40,
          }}>
            <StatCard label="2022 Capex" value="$145B" sub="Pre-ChatGPT baseline" color={C.dim} />
            <StatCard label="2025 Capex" value="$490B" sub="+238% vs. 2022" color={C.accent} />
            <StatCard label="2026 Guide" value="$720B" sub="+47% vs. 2025" color={C.accent2} />
            <StatCard label="Forward RPO" value="$1.7T" sub="Contracted backlog" color={C.gold} />
          </div>
        </FadeIn>
        <FadeIn delay={0.45}>
          <div style={{
            marginTop: 60, fontFamily: "var(--sans)", fontSize: 11,
            color: C.muted, letterSpacing: 1.5,
          }}>SCROLL TO BEGIN ↓</div>
        </FadeIn>
      </div>
    </section>

    {/* MAIN CONTENT */}
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "40px 24px 100px" }}>

      {/* CHAPTER 1 — THE NUMBER */}
      <H2 id="ch1" num="01">The Number That Broke the Spreadsheets</H2>

      <P>
        On February 5, 2026, Andy Jassy announced Amazon would spend <strong style={{ color: C.accent }}>$200 billion</strong> on capex in a single year.<Rf n={15} /> The stock fell 11% after hours — not because the number disappointed but because it was too big. Too big to fund from operating cash flow. Too big to depreciate gracefully. Too big to fit any traditional framework for the company that built its name on capital efficiency.
      </P>

      <P>
        Amazon was not an outlier. The day before, Alphabet guided $175–185B for 2026, doubling 2025.<Rf n={9} /> Meta's $30B October bond was the largest corporate issuance of the year. Oracle's RPO jumped $317B in one quarter on one contract with one customer. Microsoft had 45% of its $625B commercial RPO tied to that same private company.
      </P>

      <Ed>
        Two readings of what happened since November 30, 2022. The first: ChatGPT opened a demand firehose and hyperscalers are responsibly racing to serve it. The second: five companies have wagered half a trillion dollars annually on a product most of their enterprise customers have not yet monetized. Both are partly right. The next four quarters will tell us which dominates.
      </Ed>

      <QuarterlyChart />
      <AnnualChart />

      <P>
        The aggregate is staggering. Big 5 US hyperscaler capex went from <strong>$145B in 2022</strong> to a projected <strong>$720B in 2026</strong>. Layer in neoclouds, miner pivots, and Chinese hyperscalers, and global 2026 clears $1 trillion.
      </P>

      <P>
        Where it goes: roughly half to NVIDIA, 15% to custom silicon (TPU, Trainium, Maia, MTIA), 20% to data center shells, 10% to power, balance to networking and storage. One vendor captures the largest share of the largest-ever capex cycle.
      </P>

      <SpendBreakdownChart />

      <H3>The two numbers that make or break the bull case</H3>
      <P>
        The capex only pays back if two things happen simultaneously: AI revenue grows fast enough to offset depreciation, and the depreciation schedule reflects actual asset useful lives. A GPU assumed to last 6 years that obsoletes in 3 creates a structural earnings pothole invisible until too late.
      </P>

      <PaybackCalc />

      <Ed>
        Play with the calculator. The canonical bull case requires ~$0.40 of annual revenue per $1 of capex at 30% operating margins to clear a 5-year payback. Azure AI hits it. Google Cloud clears it. AWS is close. Oracle <strong>is not close</strong>. That is the most important fact in this report.
      </Ed>

      {/* CHAPTER 2 — MICROSOFT */}
      <H2 id="ch2" num="02">Microsoft: The Disciplined Colossus</H2>

      <CompanyCard
        name="Microsoft"
        ticker="NASDAQ: MSFT"
        capex25={88}
        capex26="~$150B"
        accent={C.accent}
        headline="The only hyperscaler funding the buildout from operating cash flow without material bond issuance — a distinction CFO Amy Hood has turned into a strategic talking point."
        highlight="Capex/revenue reached 46% in H1 FY26, a utility-like intensity unprecedented for the world's most profitable software company."
      />

      <P>
        Satya Nadella's framing evolved in stages. Early 2024: AI "applied at scale." Mid-2024: demand exceeds supply. Then the DeepSeek shock of January 27, 2025 — and the same-day response that became Big Tech's unified counter-narrative.
      </P>

      <Quote by="Satya Nadella, January 27, 2025">
        Jevons paradox strikes again! As AI gets more efficient and accessible, we will see its use skyrocket.
      </Quote>

      <P>
        Two days earlier, responding to Musk's public critiques of Microsoft's Stargate role, Nadella delivered the line that may define the era: <em>"All I know is, I'm good for my $80 billion."</em><Rf n={7} /> Microsoft's subsequent Q1 FY26 capex hit $34.9B, up 74% YoY, and Hood explicitly reversed her prior "FY26 growth lower than FY25" guide with three words: <strong>supply still constrained.</strong>
      </P>

      <H3>Where the dollars go at Microsoft</H3>
      <P>
        The flagship is <strong>Fairwater</strong>, the Mt. Pleasant, Wisconsin campus that grew from $3.3B to $7.3B in September 2025 to a potential $13B after the village approved 15 more buildings in January 2026.<Rf n={1} /> Brad Smith has described "Fairwater-identical" sites under construction across the US and Europe. Silicon: lead launch customer for NVIDIA H100/H200/GB200/GB300 and AMD MI300X, with custom <strong>Maia 100</strong> (5nm TSMC, co-designed with OpenAI) deployed since late 2024.
      </P>

      <P>
        Power is the deepest moat. The 20-year <strong>Three Mile Island restart PPA with Constellation</strong> (Sep 20, 2024) was the first corporate nuclear-restart contract in history, 835 MW targeting 2028.<Rf n={8} /> The Brookfield renewable framework (May 2024) covers &gt;10.5 GW — the largest corporate renewable PPA ever. A Helion fusion PPA (50 MW by 2028) is the first commercial fusion contract.
      </P>

      <Ed>
        Nobody has Microsoft's power story. When Jassy says power is AWS's biggest constraint, remember Microsoft was locking up multi-decade nuclear and fusion contracts in early 2024 while competitors were still arguing about transmission queues. That 18-month head start is why Nadella can say "I'm good for my $80 billion" with a straight face.
      </Ed>

      <P>
        The October 28, 2025 OpenAI restructuring converted Microsoft's ~$13.8B investment into a <strong>27% stake in OpenAI Group PBC valued ~$135B</strong>.<Rf n={35} /> Microsoft relinquished exclusive cloud status (now right-of-first-refusal) but captured an incremental $250B Azure spend commitment. This single commitment drives ~45% of the $625B commercial RPO — the largest software backlog in history, and the sharpest single-counterparty concentration at any hyperscaler.
      </P>

      {/* CHAPTER 3 — ALPHABET */}
      <H2 id="ch3" num="03">Alphabet: From Digestion Year to $185 Billion</H2>

      <CompanyCard
        name="Alphabet"
        ticker="NASDAQ: GOOGL"
        capex25={91}
        capex26="$175–185B"
        accent={C.emerald}
        headline="Pichai declared in 2024 that the risk of under-investing was 'dramatically greater' than over-investing. The 2026 guide doubles 2025 and is funded in part by Alphabet's first-ever century bond."
        highlight="Anthropic's October 2025 commitment to up to 1 million TPUs is the largest external validation of custom silicon economics in the cycle."
      />

      <P>
        Alphabet's 2023 was a deliberate "digestion year" — capex nearly flat at $32.3B. In hindsight, the bottom. By Q4 2025 it was $27.85B in a single quarter, +95% YoY. CFO Anat Ashkenazi's February 4, 2026 call guided 2026 capex to <strong>$175–185B</strong>, essentially doubling 2025.
      </P>

      <Quote by="Sundar Pichai, Q2 2024 earnings call">
        The risk of under-investing is dramatically greater than the risk of over-investing.
      </Quote>

      <P>
        Pichai later warned investors to expect a <em>"supply-constrained year"</em> in 2025. Alphabet raised its capex guide three times — $75B → $85B → $91–93B, eventual print $91.45B. Gemini serving unit costs fell <strong>78% across 2025</strong>. Token volumes exploded from 480 trillion/month in May 2025 to 7 billion/minute by Q3.
      </P>

      <H3>The TPU advantage becomes a cash engine</H3>
      <P>
        TPU v6 Trillium shipped in volume through 2025. TPU v7 <strong>Ironwood</strong> was unveiled at Google Cloud Next on April 9, 2025 — 9,216 chips/pod, 4,614 TFLOPs FP8, 192 GB HBM3e/chip, 2x perf/watt vs. Trillium. GA in November 2025.
      </P>

      <P>
        Then the single most consequential announcement for TPU economics. On October 23, 2025, <strong>Anthropic committed to up to 1M TPUs with &gt;1 GW online in 2026</strong>.<Rf n={11} /> Reports described the deal as "worth tens of billions." A parallel Broadcom SEC filing in December disclosed a multi-year agreement through 2031 for Anthropic to access ~3.5 GW of TPU compute via Broadcom from 2027. Most strikingly: Meta itself was reportedly in multi-billion-dollar TPU negotiations in late 2025, breaking an all-NVIDIA posture.
      </P>

      <Ed>
        Do not underestimate the signal. Anthropic and potentially Meta — the two companies most aggressively training frontier models — are hedging away from NVIDIA toward Google silicon. The last time a challenger silicon program poached marquee customers from the incumbent (AMD from Intel, 2017–2020), it ended with a tripling of market cap. The TPU story is not priced in.
      </Ed>

      <P>
        Google Cloud operating margin expanded from 5.2% in FY23 to <strong>23.7% in Q3 2025</strong>. Q4 2025 segment revenue grew 48% to $17.66B, exiting at &gt;$70B run rate. Cloud backlog hit <strong>$240B in Q4 2025</strong> — 2x+ YoY. Billion-dollar deals in 2025 exceeded the prior three years combined. New debt funded the growth: $17.5B USD + €6.5B euro in November 2025, then a multi-currency February 2026 raise including Alphabet's first 100-year bond — the first century bond from a tech company since Motorola in 1997. Orders exceeded $100B.
      </P>

      <BacklogChart />

      {/* CHAPTER 4 — META */}
      <H2 id="ch4" num="04">Meta: From Efficiency Year to the $30 Billion Bond</H2>

      <CompanyCard
        name="Meta Platforms"
        ticker="NASDAQ: META"
        capex25={73}
        capex26="$100–120B"
        accent={C.accent2}
        headline="No company's capex messaging has swung more violently. From 'Year of Efficiency' to 600K H100-equivalents to Hyperion's 5 GW to the largest corporate bond of 2025."
        highlight="Combined $30B bond and $27–29B PIMCO/Blue Owl Hyperion financing moves ~$50–60B of infrastructure off Meta's capex line."
      />

      <P>
        On February 1, 2023, Zuckerberg announced his <em>"Year of Efficiency."</em> Capex dropped to $27.3B. Less than a year later, on January 18, 2024, an Instagram Reel quietly committed Meta to <strong>350,000 H100s by year-end 2024 and 600,000 H100-equivalents total</strong>.<Rf n={33} /> The market was unprepared. The Q1 2024 call, where Zuckerberg emphasized a multi-year investment horizon, triggered a <strong>−15% single-day stock drop</strong>.
      </P>

      <P>
        Then the Q2 2024 call and the line every hyperscaler CEO subsequently echoed.
      </P>

      <Quote by="Mark Zuckerberg, Q2 2024 earnings call">
        The risk of under-investing is dramatically greater than the risk of over-investing.
      </Quote>

      <P>
        By end-2025, Meta was the most financially creative hyperscaler. In October the company priced a <strong>~$30B investment-grade bond</strong> across six tranches, 5 to 40-year maturities — one of the largest corporate bond deals in US history.<Rf n={12} /> Concurrently Meta structured a <strong>~$27–29B off-balance-sheet financing with PIMCO and Blue Owl Capital</strong> for Hyperion: PIMCO leading ~$26B of debt, Blue Owl ~$3B equity. Largest private data-center financing ever.
      </P>

      <Ed>
        Combined, Meta moved ~$50–60B of infrastructure off its capex line. Reported capex understates true spend by tens of billions. If you're benchmarking Meta vs. Microsoft on capex/revenue, you're benchmarking wrong.
      </Ed>

      <H3>Hyperion, Prometheus, and the Louisiana gamble</H3>
      <P>
        <strong>Hyperion at Richland Parish, Louisiana</strong> (Dec 4, 2024) was initially 2 GW scaling to 5 GW — the largest single corporate AI campus on earth.<Rf n={13} /> Related: <strong>Prometheus in New Albany, Ohio</strong> (1 GW, online 2026), plus expansions at Eagle Mountain UT, Temple TX, DeKalb IL, Kansas City MO, Cheyenne WY, Los Lunas NM. Entergy Louisiana will supply Hyperion with ~2.3 GW including 1.5 GW of new combined-cycle gas turbines. A June 2025 Constellation deal layered on 1.1 GW of nuclear (Clinton IL, 20-year PPA from 2027).
      </P>

      <P>
        Custom silicon: MTIA v2 "Artemis" (TSMC 5nm) at scale in 2024 for ads/recommendations. MTIA v3, with Broadcom, targets training on 3nm. The striking shift is Meta's reported late-2025 TPU negotiations with Google — a strategic hedge unthinkable 18 months earlier.
      </P>

      <H3>Superintelligence Labs</H3>
      <P>
        On June 12, 2025 Meta invested <strong>$14.3B for a 49% non-voting stake in Scale AI</strong> at a ~$29B valuation, installing Alexandr Wang as Chief AI Officer of Meta Superintelligence Labs.<Rf n={14} /> Reported compensation for poached researchers: <strong>$100M+ signing bonuses, some up to $300M over four years</strong>. Sam Altman publicly accused Meta of "distorting the market." The mixed reception of Llama 4 (April 5, 2025) was the catalyst.
      </P>

      {/* CHAPTER 5 — AMAZON */}
      <H2 id="ch5" num="05">Amazon: The $200 Billion Guide and the FCF Collapse</H2>

      <CompanyCard
        name="Amazon / AWS"
        ticker="NASDAQ: AMZN"
        capex25={128}
        capex26="~$200B"
        accent={C.gold}
        headline="AWS's share of Amazon capex rose from ~53% in 2023 to ~78% in Q3 2025. The $200B 2026 guide came in $50B above consensus."
        highlight="TTM free cash flow collapsed from $38.2B (Q4 2024) to $11.2B (Q4 2025) — a 71% year-over-year compression that only OpenAI backlog can justify."
      />

      <P>
        Jassy's shareholder letters escalated from <em>"may be the largest technology transformation since the cloud"</em> (April 2024) to <em>"we're not investing approximately $200 billion in capex in 2026 on a hunch"</em> (April 2026). The Q3 2024 call stated it plainly.
      </P>

      <Quote by="Andy Jassy, Q3 2024 earnings call">
        We have more demand than we could fulfill if we had even more capacity today. Everyone today has less capacity than they have demand.
      </Quote>

      <P>
        Jassy's own comparison is striking: AWS took 3 years post-launch to reach $58M run rate. <strong>Amazon's AI business hit $15B run rate by Q1 2026 — 260× that trajectory.</strong>
      </P>

      <H3>Project Rainier and the Trainium ecosystem</H3>
      <P>
        <strong>Project Rainier</strong>, activated November 2025 in under 12 months, spreads ~500,000 Trainium2 chips across multiple US data centers — primarily Indiana — scaling to &gt;1M Trainium2 by end-2025 for Anthropic.<Rf n={16} /> Trainium2 launched at re:Invent December 2024 at ~30% better price-performance than comparable GPUs. 1.4M chips landed by Q4 2025. <strong>Trainium3</strong> started shipping early 2026, "30–40% more price-performant than Trainium2 and nearly fully subscribed."
      </P>

      <P>
        Amazon's chips business (Graviton + Trainium + Nitro) exited 2025 at <strong>&gt;$20B annualized run rate</strong>, doubled from $10B in Q4 2024. Anthropic: $8B cumulative Amazon investment.<Rf n={18} /> Q1 2025 partial conversion to nonvoting preferred booked a $3.3B gain. The November 3, 2025 <strong>OpenAI $38B, 7-year contract</strong> was the shock — OpenAI's first AWS deal, GB200/GB300 clusters, all capacity by end-2026.<Rf n={17} /> Amazon hit record highs same day.
      </P>

      <Ed>
        The FERC rejection of Amazon–Talen colocation on November 1, 2024 was the most consequential AI infrastructure ruling of the cycle. Upheld April 2025. Amazon restructured in June 2025 as a front-of-meter 1,920 MW deal worth ~$18B, sidestepping the issue. The lesson: hyperscale power procurement is now a regulatory-rate design problem.
      </Ed>

      {/* CHAPTER 6 — ORACLE */}
      <H2 id="ch6" num="06">Oracle: The Capex Story of the Cycle</H2>

      <CompanyCard
        name="Oracle"
        ticker="NYSE: ORCL"
        capex25={32}
        capex26="~$50B"
        accent={C.rose}
        headline="Capex went from $7B in FY24 to a guided $50B in FY26 — a capex/revenue ratio of ~75%, extreme even by AI-cycle standards. RPO went from $99B to $553B in 24 months."
        highlight="Moody's cut outlook to negative in September 2025. OpenAI is projected to account for ~1/3 of Oracle revenue by 2028 — unprecedented concentration for a Fortune 100 company."
      />

      <P>
        Oracle's transformation from cloud also-ran to credible fourth hyperscaler is the single most dramatic corporate narrative in the buildout. RPO leapt from $99B (Q1 FY25) to <strong>$455B on September 9, 2025</strong> after OpenAI signed a $300B, 5-year contract starting FY28.<Rf n={19} /> Then $523B. Then $553B.
      </P>

      <Quote by="Larry Ellison, on chip procurement from Jensen Huang">
        Please take our money. You're not taking enough.
      </Quote>

      <P>
        Safra Catz initially guided FY26 capex at "$25B, may turn out to be understated" in June 2025. Raised to ~$35B in September. By March 2026, <strong>~$50B</strong>, with a FY27 revenue target of $90B. Catz projected OCI revenue at <em>"$18B, $32B, $73B, $114B, $144B"</em> over five years — a trajectory requiring flawless OpenAI execution.
      </P>

      <H3>Stargate</H3>
      <P>
        Oracle is the flagship operator of <strong>Stargate</strong> — $500B, 10 GW with SoftBank, OpenAI, MGX announced at the White House on January 21, 2025.<Rf n={21} /> The Abilene, TX Crusoe-built campus (initially 1.2 GW, scaling to 4.5 GW) took its first NVIDIA GB200 racks in June 2025. Five additional Stargate sites on September 24, 2025 — Shackelford TX, Doña Ana NM, Lordstown OH, Milam TX, Wisconsin — added ~5.5 GW.
      </P>

      <H3>Credit warnings</H3>
      <P>
        Oracle sold <strong>$18B in investment-grade bonds September 24, 2025</strong>, including a rare 40-year tranche with $88B peak demand.<Rf n={20} /> Outstanding debt reached ~$108B by November. An additional ~$38B loan + $18B bond package was in preparation.
      </P>

      <P>
        <strong>Moody's cut the outlook to negative (Baa2)</strong> in September 2025, citing "counterparty risk" from the "staggering" OpenAI concentration. S&P followed to BBB negative. Oracle CDS hit 155.27 bps in December 2025 — highest since 2009. Moody's projected FY26 FCF after dividends of <strong>negative ~$6B or worse</strong>. Bondholders sued in late 2025 alleging concealment of additional borrowing.
      </P>

      <Ed>
        Oracle is the most interesting stock in the world right now. Either OpenAI delivers exactly the revenue trajectory Altman has promised — and Oracle's $90B FY27 guide becomes the greatest corporate pivot since Nadella rebuilt Microsoft around Azure — or OpenAI misses by 20% and Oracle becomes the cautionary tale about single-customer concentration in a Fortune 100. No middle path.
      </Ed>

      <OpenAIChart />

      {/* CHAPTER 7 — NVIDIA */}
      <H2 id="ch7" num="07">NVIDIA: The $100 Billion Circular Backstop</H2>

      <CompanyCard
        name="NVIDIA"
        ticker="NASDAQ: NVDA"
        capex25={3}
        capex26="~$6B"
        accent={C.emerald}
        headline="Not a major capex spender itself (~$6B FY26), but anchor of every capex story — chip supplier, equity investor in its customers, and increasingly the capacity backstop."
        highlight="Q3 FY26 customer concentration: 4 direct customers at 61% of revenue, up from 36% a year prior. Purchase obligations: ~$95B by early 2026 (vs. $16B a year earlier)."
      />

      <P>
        NVIDIA revenue hit <strong>$215.9B in FY26</strong>, up 65% YoY. Jensen Huang's framing anchors the industry's TAM.
      </P>

      <Quote by="Jensen Huang, Q2 FY26 earnings call">
        We see $3 trillion to $4 trillion in AI infrastructure spend by the end of the decade.
      </Quote>

      <P>
        His math: 1 GW costs ~$50–60B, "$35B of that is NVIDIA chips." At GTC March 2025: <em>"I expect data center build-out to reach a trillion dollars. Very soon."</em> At Davos January 2026: <em>"The largest infrastructure build-out in human history."</em>
      </P>

      <H3>The circular financing map</H3>
      <P>
        The September 22, 2025 LOI for <strong>NVIDIA to invest up to $100B in OpenAI</strong> in exchange for ≥10 GW of NVIDIA systems epitomizes circular-financing concerns.<Rf n={24} /> CFO Colette Kress clarified December 2, 2025 the deal remains at LOI. NVIDIA's CoreWeave stake moved from ~6% to <strong>13% with a $2B add-on in January 2026</strong> (~$4.7B value on ~$2.3B invested). Add up to $10B Anthropic (Nov 2025), $5B Intel equity, ~$2B xAI, plus Lambda/Nebius/Crusoe/Nscale/Firmus.
      </P>

      <P>
        NVIDIA's $6.3B unsold-capacity agreement with CoreWeave through 2032 explicitly backstops demand. Purchase obligations: ~$95.2B by early 2026, up from $16.1B a year earlier.
      </P>

      <Ed>
        The Cisco-in-1999 comparison is inevitable. Cisco did vendor financing through a different mechanism (seller financing), but the structural shape is the same: chip seller props up customer, who buys more chips, which props up the chip seller. Counterargument: NVIDIA's contracts are with investment-grade counterparties, not dot-com startups. Bear rejoinder: one counterparty (OpenAI) is effectively a startup with a $500B valuation and no proven path to profitability. Which view is correct will be answered, not argued.
      </Ed>

      <H3>Product roadmap cadence</H3>
      <P>
        H100 (2023) → H200 (2024) → B100/B200/GB200 (Blackwell, 2024–25) → <strong>GB300 Blackwell Ultra</strong> (H2 2025) → <strong>Vera Rubin</strong> (H2 2026, OpenAI first) → Rubin Ultra / Feynman (2027+). The 9-month cadence is faster than the prior annual rhythm.
      </P>

      <P>
        The April 9, 2025 H20 export license requirement forced a $4.5B Q1 FY26 charge (later $5.5B). A July 2025 partial resumption under a novel <strong>15% US-government revenue-share</strong> arrangement followed a full halt. August 21, 2025 reports had NVIDIA ordering suppliers to halt H20 production outright.
      </P>

      {/* CHAPTER 8 — LAGGARDS */}
      <H2 id="ch8" num="08">Apple and Tesla: Conspicuous Laggards</H2>

      <P>
        <strong>Apple</strong> is the structural outlier — ~$100B in annual operating cash flow but just $12.72B FY25 capex (+35% YoY), ~3% of revenue, an order of magnitude below hyperscalers. FY25 marks Apple's first meaningful AI acceleration, tied to Apple Intelligence and <strong>Private Cloud Compute</strong> on custom Apple Silicon M-series servers.
      </P>

      <Quote by="Tim Cook, Q3 FY25 earnings call">
        We see AI as one of the most profound technologies of our lifetime. Significantly growing our investments.
      </Quote>

      <P>
        A reported $1B NVIDIA order for ~250 GB300 NVL72 systems (March 2025, Loop Capital) partially contradicts Apple's "all Apple Silicon" narrative — likely for internal training. Bulls call the strategy efficient; bears call it structurally behind, with Siri's overhaul delayed and Apple selectively partnering (OpenAI in iPhone, Gemini reportedly under discussion).
      </P>

      <P>
        <strong>Tesla</strong> is mixed. Total capex reached $11.34B in FY24, with AI infrastructure ~$5B cumulative by end-2024. FY25: ~$8.5B flattish. FY26 outlook: &gt;$20B with significant AI uplift. CFO Taneja disclosed on the Q4 2024 call that <strong>Cortex (Giga Texas) completed at 50,000 H100s</strong>, enabling FSD V13. By Q2 2025: 67,000 H100-equivalents with 16,000 H200s added.
      </P>

      <P>
        Musk reversed course in August 2025: <em>"Once it became clear all paths converged to AI6, I had to shut down Dojo. Dojo 2 was now an evolutionary dead end."</em> The Dojo team disbanded; ~20 engineers formed DensityAI. A January 2026 Dojo restart followed. The July 2025 $16.5B Samsung foundry contract for AI6 (car/Optimus/datacenter) completed the pivot.
      </P>

      <Ed>
        The Musk-xAI entanglement matters for Tesla shareholders. Colossus in Memphis (100K H100 July 2024 → 200K mixed GPUs February 2025, Colossus 2 targeting 1M) competes for NVIDIA supply with Tesla. A CNBC investigation documented Musk diverting Tesla-ordered chips to xAI. Not a trivial governance issue.
      </Ed>

      {/* CHAPTER 9 — CHINA */}
      <H2 id="ch9" num="09">China: The $53 Billion Bet and the DeepSeek Inflection</H2>

      <P>
        China's AI capex trajectory rhymes with the US version but on a smaller scale, constrained by GPU export controls and reshaped by DeepSeek's January 20, 2025 efficiency breakthrough.
      </P>

      <H3>Alibaba: the biggest private Chinese bet</H3>
      <P>
        On February 24, 2025, Alibaba announced the <strong>largest private compute commitment in Chinese history: RMB 380B (~$53B) over three years</strong> — more than its entire prior decade of AI+cloud spend.<Rf n={25} /> CEO Eddie Wu framed AI as "once-in-a-generation" with AGI as the goal. Quarterly capex accelerated from ~RMB 5B in 2023 to RMB 38.6B (~$5.4B) in Q2 FY26. Wu suggested in November 2025 that 380B "might be on the small side," with LatePost reporting consideration of RMB 480B (~$69B).
      </P>

      <P>
        Cloud Intelligence AI revenue maintained triple-digit YoY growth for ten consecutive quarters. Qwen surpassed 1B Hugging Face downloads by January 2026; app MAU &gt;300M. But Alibaba chairman Joe Tsai delivered one of the cycle's most-quoted bear calls.
      </P>

      <Quote by="Joe Tsai, HSBC Global Investment Summit, March 25, 2025">
        I start to see the beginning of some kind of bubble. I start to get worried when people are building data centers on spec.
      </Quote>

      <P>
        FCF turned deeply negative: −RMB 21.8B in Q2 FY26, −RMB 29.3B for nine months of FY26.<Rf n={26} /> Stock fell 7% on March 19, 2026 after a 42% EPS miss.
      </P>

      <H3>Tencent: capex discipline over spend-max</H3>
      <P>
        Tencent FY2024 capex: RMB 76.8B ($10.7B, +221% YoY). But <strong>FY2025 came in at only RMB 79.2B (+3%)</strong>, missing management's own "low teens % of revenue" guidance. Q3 2025 capex dropped <strong>−24% YoY to RMB 13B</strong>, explicitly attributed to "AI chip availability, not a change in strategy."<Rf n={34} />
      </P>

      <Quote by="James Mitchell, Tencent Strategy Officer, Q4 2024 call">
        There was a period last year when there was a belief that every new generation of LLM required an order of magnitude more GPUs. That period ended with DeepSeek.
      </Quote>

      <P>
        Tencent integrated DeepSeek R1 into Weixin Search February 16, 2025 alongside its own Hunyuan. Q3 2025 marketing services +21% on AI-powered targeting; Weixin Search ads +~60% YoY in Q2; operating margin expanded to 38% non-IFRS.
      </P>

      <H3>Baidu: smallest, most cash-stressed, most strategically coherent</H3>
      <P>
        Baidu capex: ~RMB 10.7B FY25. Robin Li at Baidu World April 2025: <em>"There are many models, but it's apps that rule the world."</em> Baidu deployed a 30,000-chip <strong>Kunlun P800 cluster</strong> for DeepSeek-scale training — proprietary 7nm, SMIC-fabbed, ~A100-class. AI Cloud +42% in Q1 2025; AI-native marketing +110% YoY in Q4 2025 to RMB 11B (43% of Baidu General Business revenue). Kunlunxin filed for spin-off and Hong Kong listing Q4 2025. But Q3 2025 took a RMB 16.2B impairment with a reported 61% operating loss margin — the most cash-stressed of the three.
      </P>

      <Ed>
        DeepSeek R1 had global consequences. NVIDIA fell −17% on January 27, 2025, a single-day loss of ~$600B — the largest in corporate history. Nadella's Jevons tweet that afternoon became Big Tech's unified counter-narrative. Within days, Meta raised 2025 capex to $60–65B, Alphabet to $75B, Amazon toward $100B+. Efficiency expands TAM. They are probably right. They might be wrong.
      </Ed>

      {/* CHAPTER 10 — NEOCLOUDS */}
      <H2 id="ch10" num="10">Neoclouds: Leverage, Concentration, and Circularity</H2>

      <P>
        The specialist AI cloud sector scaled from zero to ~$30–40B of 2025 capex in 30 months, tracking to ~$70–100B in 2026.
      </P>

      <H3>CoreWeave: the bellwether</H3>
      <P>
        Revenue went from $229M in 2023 to <strong>$5.13B in 2025</strong>, up 168%. Capex: $8.7B → $14.9B → guided $30–35B for 2026. Backlog ballooned to <strong>$66.8B by Q4 2025</strong>, +342% YoY.<Rf n={28} />
      </P>

      <P>
        Composition tells the concentration story: $22.4B total OpenAI contracts (Mar/May/Sep 2025), $14.2B Meta (June 2025), NVIDIA's $6.3B unsold-capacity agreement through 2032. Debt: <strong>$21.4B total</strong>, multiple Blackstone-led tranches + $2.5B revolver + ~$2.6B convertibles. Q4 2025 interest expense hit $388M, 2.6x prior year. The Core Scientific merger failed October 30, 2025 when CORZ shareholders rejected the all-stock exchange, leaving CoreWeave reliant on leases rather than ownership of 840 MW hosted. NVIDIA's stake rose to 13% after a $2B add-on at $87.20/share in January 2026.
      </P>

      <H3>Nebius: Microsoft's anchored alternative</H3>
      <P>
        Reborn from a Yandex spin-out, relisted NASDAQ October 2024. Raised $5B+ of total financing. 2025 capex guided up from $2B to ~$5B. The <strong>Microsoft $17.4B, 5-year deal September 8, 2025</strong> (upsizable to $19.4B) triggered a +53% same-day move.<Rf n={29} /> A Meta ~$3B 5-year followed in Q3. ARR exited Q3 2025 at $551M, guided to $7–9B by end-2026.
      </P>

      <H3>Bitcoin miner pivots</H3>
      <P>
        The sector's surprise story. <strong>TeraWulf</strong>: $12.8B of Fluidstack/Google-backstopped contracts. <strong>Cipher Mining</strong>: $3B at Barber Lake TX (Fluidstack) plus ~$5.5B AWS 15-year Texas lease. <strong>Hut 8</strong>: $7B 15-year River Bend LA lease. <strong>Applied Digital</strong>: ~$11B of lease contracts at Ellendale ND with CoreWeave (69% of pipeline). <strong>IREN</strong>: $9.7B 5-year Microsoft deal Nov 3, 2025 (GB300 at Childress TX, 200 MW), plus $5.8B Dell GPU purchase.
      </P>

      <H3>Crusoe: the Stargate builder</H3>
      <P>
        Private but consequential. Valuation leapt from $2.8B (Dec 2024 Series D) to &gt;$10B (Oct 2025 Series E, $1.375B raise). Revenue: ~$276M (2024) → ~$1B (2025) → &gt;$2B (2026). Abilene secured $9.6B JPMorgan debt + $5B equity (May 2025). A March 2026 announcement added a 900 MW Microsoft-dedicated Abilene campus with onsite power — Abilene ~2.1 GW combined.
      </P>

      <Ed>
        The concentration picture across neoclouds is starker than at hyperscalers. Morgan Stanley's October 2025 analysis: OpenAI accounts for ~$330B of $880B total future RPO across Microsoft/Oracle/CoreWeave. Fluidstack underwrites TeraWulf, Cipher, Hut 8 — all traceable to one Google-backed ecosystem. Bulls point to investment-grade contracts and locked-in power. Bears point to Cisco's vendor-financing collapse in 2001. Both are partly right.
      </Ed>

      <Timeline />

      {/* CHAPTER 11 — VERDICT */}
      <H2 id="ch11" num="11">The Verdict: Disciplined Mania</H2>

      <P>
        Evidence supports a <strong>"disciplined mania"</strong> reading over a pure bubble call — with three specific failure modes to monitor over the next four to eight quarters.
      </P>

      <H3>Pro-bubble evidence</H3>
      <P>
        Capex/revenue ratios of 45–75% at Microsoft and Oracle are unprecedented for mature businesses. FCF has collapsed at Amazon (−71% YoY), Microsoft (7.3% FCF margin vs. historical 30%+), and Alphabet (flat despite +74% capex). OpenAI underwrites ~$330B of $880B combined RPO — the largest single-counterparty exposure in public-market history. NVIDIA's $100B OpenAI investment, $6.3B CoreWeave backstop, and stakes in Intel/Anthropic/xAI create dot-com-style vendor financing loops.<Rf n={30} /> Depreciation policies diverge: Amazon shortened to 5 years, Meta selectively shortened, Microsoft kept 6. Michael Burry argued in November 2025 that hyperscalers understate depreciation by ~$176B across 2026–28.
      </P>

      <H3>Anti-bubble evidence</H3>
      <P>
        The backlog is real and large. Microsoft $625B, Oracle $553B, Amazon $244B, Alphabet $240B, CoreWeave $66.8B — roughly <strong>$1.7T of contracted forward revenue</strong>. Customers are investment-grade except OpenAI. AI revenue is materializing: Microsoft $13B → ~$25B target; AWS $15B run rate (260x AWS's own early history); Alphabet Cloud exiting &gt;$70B with 48% growth; Google Cloud op margin 23.7%. Unit costs falling fast (Gemini −78% in 2025) expand demand rather than compress it. Power and land — the binding scarce resources — are being locked up at attractive long-duration prices.
      </P>

      <H3>Three failure modes to watch</H3>

      <FadeIn>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr", gap: 16,
          margin: "28px 0",
        }}>
          {[
            {
              n: "01",
              title: "OpenAI execution",
              body: "If OpenAI revenue growth stalls short of what's needed to service $330B+ in forward commitments, the ripple spans Oracle (33% revenue concentration by 2028 per Moody's), Microsoft (45% of RPO), CoreWeave (40% of RPO), NVIDIA ($100B equity), and Stargate. Bloomberg reported Stargate raised zero funds seven months post-announcement. The Information reported in December 2025 that Stargate had hired no staff.",
              color: C.red,
            },
            {
              n: "02",
              title: "Depreciation reset",
              body: "If GPU economic life proves closer to 3 years than 6, hyperscalers collectively under-accrue ~$176B over 2026–2028 (Burry). Amazon already moved. Meta partially moved. Microsoft and Alphabet have not — and have the most to lose.",
              color: C.gold,
            },
            {
              n: "03",
              title: "Power/grid constraints force build-cost inflation",
              body: "Every hyperscaler has flagged power as the binding constraint; Jassy calls it \"single biggest.\" If power unit costs escalate materially, the $50B/GW build-cost doubles — and the current 2026 guides understate true 2027–28 needs.",
              color: C.accent2,
            },
          ].map(function (m) {
            return <div key={m.n} style={{
              background: C.card, border: "1px solid " + m.color + "50",
              borderRadius: 12, padding: "20px 22px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, width: 4, bottom: 0,
                background: m.color,
              }} />
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11, color: m.color,
                fontWeight: 700, letterSpacing: 2, marginBottom: 6,
              }}>FAILURE MODE {m.n}</div>
              <div style={{
                fontFamily: "var(--display)", fontSize: 22, color: C.text,
                fontWeight: 700, marginBottom: 10,
              }}>{m.title}</div>
              <div style={{
                fontFamily: "var(--serif)", fontSize: 15, color: C.dim,
                lineHeight: 1.7,
              }}>{m.body}</div>
            </div>;
          })}
        </div>
      </FadeIn>

      <H3>Closing thoughts</H3>
      <P>
        The ChatGPT era has reshaped how we should read tech-company financials. The line between software economics and utility economics has blurred — Oracle at 75% capex/revenue, Microsoft/Meta/Alphabet converging on 40–50%. The aggregate Big 5 trajectory — <strong>~$145B (2022) → ~$490B (2025) → ~$720B (2026)</strong> — is the fastest scaling of productive capital investment in industrial history. Larger than US railroads. Larger than the Interstate Highway System in inflation-adjusted annualized terms.
      </P>

      <P>
        Demand has kept pace so far: $1.7T of contracted RPO, triple-digit AI revenue growth at every hyperscaler, unit-cost declines expanding rather than cannibalizing demand. But the system has concentrated risk in one private company — OpenAI — to a degree unprecedented in public markets. That structure either ratifies the bull case spectacularly in 2027 or becomes the defining cautionary tale.
      </P>

      <P>
        The question the next four quarters will answer is not whether 2026 capex prints at $720B. It will. The question is whether attached revenue materializes on the promised 4-year backlog duration. If yes, skeptics will have to concede this was the rarest thing: a mania that was also right. If no, the corporate debt issued in 2025 — Meta's $30B, Oracle's $18B, Alphabet's century bond — will stand as artifacts of the moment when sophisticated operators convinced themselves the only real risk was building too slowly.
      </P>

      <Ed>
        What we know: the world is getting a trillion-dollar AI infrastructure fabric much faster than anyone imagined in November 2022. What we don't know is who will own it when the dust settles. That is the next chapter. And it has not been written yet.
      </Ed>

      <Sources />
    </main>

    <footer style={{
      borderTop: "1px solid " + C.faint, padding: "40px 24px",
      textAlign: "center", fontFamily: "var(--sans)",
      fontSize: 11, color: C.muted, letterSpacing: 1,
    }}>
      THE $2 TRILLION AI BUILDOUT · APRIL 2026 · NOT INVESTMENT ADVICE
    </footer>
  </div>;
}
