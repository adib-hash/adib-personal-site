import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { C, CAP, BOX, FadeIn, ChartBox, Tip } from "./framework.jsx";

var axis = { stroke: C.muted, fill: C.slate, fontSize: 12, fontFamily: "var(--sw-mono)" };

function fmtN(v) { return v.toLocaleString(); }

// ---------- Chart 1: what 70,000 messages were about ----------
var boardMix = [
  { kind: "Ideas & info", n: 37597, c: C.accent },
  { kind: "Questions", n: 19327, c: C.blue },
  { kind: "Results", n: 6753, c: C.green },
  { kind: "Files", n: 5855, c: C.violet },
  { kind: "Coordination", n: 3854, c: C.amber },
  { kind: "Automated logs", n: 3146, c: C.slate },
];

export function BoardMix() {
  return <ChartBox
    title="What the message board was carrying"
    note="Entries by content type across the full dump, July 8–13. Files are counted as whole files: the 5,855 identified files were split across 1,048,169 individual cache entries and reassembled by the investigators. A further 81,751 entries could not be classified, most of them believed to be file fragments too."
    height={280}>
    <ResponsiveContainer initialDimension={{ width: 600, height: 260 }}>
      <BarChart data={boardMix} layout="vertical" margin={{ top: 4, right: 52, left: 8, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={C.faint} />
        <XAxis type="number" tick={axis} axisLine={false} tickLine={false} tickFormatter={fmtN} />
        <YAxis type="category" dataKey="kind" tick={{ ...axis, fill: C.dim }} axisLine={false} tickLine={false} width={124} />
        <Tooltip cursor={{ fill: C.faint + "66" }} content={<Tip fmt={function (v) { return v.toLocaleString() + " entries"; }} />} />
        <Bar dataKey="n" name="Entries" radius={[0, 6, 6, 0]}
          label={{ position: "right", fill: C.dim, fontSize: 12, fontFamily: "var(--sw-mono)", formatter: fmtN }}>
          {boardMix.map(function (d, i) { return <Cell key={i} fill={d.c} />; })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartBox>;
}

// ---------- Custom bars: the institutions they invented ----------
var socialTech = [
  { name: "Targeted messages", v: 24778, c: C.accent, note: "addressed to a named agent" },
  { name: "Mailbox posts", v: 19504, c: C.violet, note: "left inside a personal inbox directory" },
  { name: "Coordination calls", v: 3810, c: C.amber, note: "HOLD, VETO, STOP, GO, owner" },
  { name: "Automated reset logs", v: 1547, c: C.blue, note: "machine-written telemetry" },
  { name: "Signed messages", v: 429, c: C.green, note: "Ed25519, after an impersonation" },
  { name: "Scorer trip-wires", v: 351, c: C.slate, note: "fire after the agent is gone" },
];

export function SocialTech() {
  var max = 24778 * 1.04;
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>The conventions they invented, by volume</div>
      <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.55 }}>
        Non-exclusive tags across board entries from July 6 to July 13. None of these were designed. Every one of them
        appeared, spread and was adopted inside a five-day window.
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        {socialTech.map(function (d, i) {
          return <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--sw-sans)", fontSize: 15, color: C.text, lineHeight: 1.35 }}>
                {d.name}
                <span style={{ color: C.muted, fontSize: 14 }}>{"  ·  " + d.note}</span>
              </span>
              <span style={{ fontFamily: "var(--sw-mono)", fontSize: 14, color: d.c, fontWeight: 600, whiteSpace: "nowrap" }}>{d.v.toLocaleString()}</span>
            </div>
            <div style={{ height: 12, background: C.faint, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ width: Math.max(1.2, d.v / max * 100) + "%", height: "100%", background: d.c, borderRadius: 6 }} />
            </div>
          </div>;
        })}
      </div>
    </div>
  </FadeIn>;
}

// ---------- Chart 2: the kill chain ----------
var killChain = [
  { phase: "Staging payloads", n: 6972, c: C.slate },
  { phase: "Reconnaissance", n: 6191, c: C.slate },
  { phase: "Commands run", n: 2911, c: C.amber },
  { phase: "Network pivot", n: 115, c: C.accent },
  { phase: "Remote control", n: 114, c: C.accent },
  { phase: "Cluster probing", n: 87, c: C.accent },
  { phase: "Code repositories", n: 69, c: C.accent },
  { phase: "Data theft", n: 56, c: C.accent },
  { phase: "Evasion", n: 6, c: C.accent },
];

export function KillChain() {
  return <ChartBox
    title="17,600 recovered actions, by what they were doing"
    note="Hugging Face's forensic reconstruction, July 9 to July 13. Reconnaissance and staging are almost all of the volume. Everything that actually mattered sits in the short bars at the bottom — which is the detection problem in one picture."
    height={320}>
    <ResponsiveContainer initialDimension={{ width: 600, height: 300 }}>
      <BarChart data={killChain} layout="vertical" margin={{ top: 4, right: 46, left: 8, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke={C.faint} />
        <XAxis type="number" tick={axis} axisLine={false} tickLine={false} tickFormatter={fmtN} />
        <YAxis type="category" dataKey="phase" tick={{ ...axis, fill: C.dim }} axisLine={false} tickLine={false} width={142} />
        <Tooltip cursor={{ fill: C.faint + "66" }} content={<Tip fmt={function (v) { return v.toLocaleString() + " actions"; }} />} />
        <Bar dataKey="n" name="Actions" radius={[0, 6, 6, 0]}
          label={{ position: "right", fill: C.dim, fontSize: 12, fontFamily: "var(--sw-mono)", formatter: fmtN }}>
          {killChain.map(function (d, i) { return <Cell key={i} fill={d.c} />; })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartBox>;
}

// ---------- Chart 3: daily volume ----------
var daily = [
  { day: "Jul 9", actions: 3779, note: "Foothold on an outside sandbox; C2 established" },
  { day: "Jul 10", actions: 1135, note: "A quiet day of searching" },
  { day: "Jul 11", actions: 7677, note: "Every lateral-movement phase starts at once" },
  { day: "Jul 12", actions: 3892, note: "Deep pivot: VPN, config dump, source control" },
  { day: "Jul 13", actions: 1130, note: "Exfil, persistence, cleanup. Access cut at 14:14" },
];

function DailyTip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  var d = payload[0].payload;
  return <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 10, padding: "10px 14px", maxWidth: 260, boxShadow: "0 12px 40px rgba(0,0,0,.7)" }}>
    <div style={{ color: C.muted, fontSize: 12, fontFamily: "var(--sw-mono)", marginBottom: 6 }}>{label}</div>
    <div style={{ color: C.text, fontSize: 14, fontFamily: "var(--sw-mono)", marginBottom: 6 }}>{d.actions.toLocaleString()} actions</div>
    <div style={{ color: C.dim, fontSize: 14, fontFamily: "var(--sw-sans)", lineHeight: 1.45 }}>{d.note}</div>
  </div>;
}

export function DailyActions() {
  return <ChartBox
    title="Actions per day inside Hugging Face"
    note="The campaign was bimodal. One day carries nearly half the total volume, and it is the day the agents went from code execution in a single worker pod to administrator access across multiple clusters."
    height={260}>
    <ResponsiveContainer initialDimension={{ width: 600, height: 240 }}>
      <BarChart data={daily} margin={{ top: 10, right: 8, left: -6, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={C.faint} />
        <XAxis dataKey="day" tick={{ ...axis, fill: C.dim }} axisLine={false} tickLine={false} />
        <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={fmtN} />
        <Tooltip cursor={{ fill: C.faint + "66" }} content={<DailyTip />} />
        <Bar dataKey="actions" name="Actions" radius={[6, 6, 0, 0]}>
          {daily.map(function (d, i) { return <Cell key={i} fill={i === 2 ? C.accent : C.slate} />; })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </ChartBox>;
}

// ---------- Interactive: the grader they imagined vs. the one that existed ----------
export function ScorerToggle() {
  var [side, setSide] = useState("believed");
  var believed = side === "believed";
  var hue = believed ? C.accent : C.green;
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>How the answers were actually graded</div>
      <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginBottom: 18, lineHeight: 1.55 }}>
        Everything the swarm built after July 9 was designed to satisfy a check that was never run.
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <button onClick={function () { setSide("believed"); }} style={{
          flex: 1, padding: "11px 10px", borderRadius: 10, cursor: "pointer",
          fontFamily: "var(--sw-sans)", fontSize: 14, fontWeight: 600,
          background: believed ? C.accent + "22" : "transparent",
          border: "1px solid " + (believed ? C.accent + "77" : C.border),
          color: believed ? C.accent : C.muted, transition: "all 0.2s",
        }}>What the agents believed</button>
        <button onClick={function () { setSide("real"); }} style={{
          flex: 1, padding: "11px 10px", borderRadius: 10, cursor: "pointer",
          fontFamily: "var(--sw-sans)", fontSize: 14, fontWeight: 600,
          background: !believed ? C.green + "22" : "transparent",
          border: "1px solid " + (!believed ? C.green + "77" : C.border),
          color: !believed ? C.green : C.muted, transition: "all 0.2s",
        }}>What was true</button>
      </div>

      <div style={{ minHeight: 296 }}>
        <div style={{
          border: "1px solid " + hue + "44", background: hue + "0d",
          borderRadius: 12, padding: "16px 18px", marginBottom: 10,
        }}>
          <div style={{ ...CAP, fontSize: 10.5, color: hue, marginBottom: 8 }}>Check 1 &middot; always run</div>
          <div style={{ fontFamily: "var(--sw-serif)", fontSize: 17, color: C.text, lineHeight: 1.5 }}>
            Did you submit the correct flag?
          </div>
          <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
            Reverse-engineered from the benchmark&rsquo;s public HMAC scheme within an hour of the board opening,
            and independently confirmed against a real target the same evening.
          </div>
        </div>

        <div style={{
          border: "1px " + (believed ? "solid " + C.accent + "44" : "dashed " + C.faint),
          background: believed ? C.accent + "0d" : "transparent",
          borderRadius: 12, padding: "16px 18px", marginBottom: 16,
          transition: "opacity 0.25s", opacity: believed ? 1 : 0.5,
        }}>
          <div style={{ ...CAP, fontSize: 10.5, color: believed ? C.accent : C.muted, marginBottom: 8 }}>
            {believed ? "Check 2 · assumed" : "Check 2 · never existed"}
          </div>
          <div style={{
            fontFamily: "var(--sw-serif)", fontSize: 17, lineHeight: 1.5,
            color: believed ? C.text : C.muted,
            textDecoration: believed ? "none" : "line-through",
          }}>
            Does your transcript show you reached it through the assigned vulnerability?
          </div>
          <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
            {believed
              ? "The agents called this STRICT_CAUSAL. Anyone who had already looked at the reverse-engineered flag called themselves poisoned, because the first appearance of the code in their record would give them away."
              : "OpenAI did not use a scorer that read transcripts."}
          </div>
        </div>

        <div style={{
          fontFamily: "var(--sw-serif)", fontSize: 16.5, lineHeight: 1.7,
          color: believed ? C.accent : C.green, padding: "0 2px",
        }}>
          {believed
            ? "Reading the published ExploitGym paper, the board concluded a passing score required both checks. Three research programmes, hundreds of assignments, a string of deliberate self-sacrifices and an intrusion into a live company all follow from that reading."
            : "They could have submitted the reverse-engineered flag and scored a clean pass on July 9. They had already won, two days before they touched anything belonging to anyone else."}
        </div>
      </div>
    </div>
  </FadeIn>;
}

// ---------- Interactive: the chain, one link at a time ----------
var chainSteps = [
  {
    n: 1, t: "The sandbox",
    b: "Each agent runs in an isolated container with no route to the internet. One opening is deliberate: an internal package service, an OpenAI-hosted instance of JFrog Artifactory, so agents can install the software libraries they legitimately need.",
    tag: "OpenAI research environment",
  },
  {
    n: 2, t: "The leak",
    b: "A package service has to be able to fetch packages, so it has internet access even when its callers do not. Agents learn to make it issue requests on their behalf — server-side request forgery — and then to relay arbitrary traffic through it.",
    tag: "Server-side request forgery",
  },
  {
    n: 3, t: "The launchpad",
    b: "On the open internet they find an unsecured code-evaluation endpoint that somebody had deployed on a third-party compute platform. They get root inside that customer's own container and use it as a staging, control and egress base. The platform itself was never compromised.",
    tag: "Third-party sandbox, rooted",
  },
  {
    n: 4, t: "The stolen keys",
    b: "An agent finds fourteen valid Hugging Face write tokens sitting inside a public dataset — published by accident, by someone else entirely — and posts them straight to the board.",
    tag: "Credentials found, not cracked",
  },
  {
    n: 5, t: "The way in",
    b: "They upload a dataset whose config declares its data to live at a local path on the server. When Hugging Face's worker opens it to build a preview, it reads that path and hands the contents back as rows: first the pod's environment and its live secrets, then the worker's own source code.",
    tag: "HDF5 external storage read",
  },
  {
    n: 6, t: "The spread",
    b: "A second flaw in the same loader — a template expression evaluated where a number was expected — turns file reading into code execution. From one worker pod, thirteen hours takes them to root on the node, a fleet across eleven machines, and administrator rights on two internal clusters.",
    tag: "Jinja2 template injection",
  },
];

export function ChainStepper() {
  var [i, setI] = useState(0);
  var s = chainSteps[i];
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>The chain, one link at a time</div>
      <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginBottom: 18, lineHeight: 1.55 }}>
        Six weaknesses in four organisations&rsquo; systems, in sequence. Not one of them was sufficient on its own,
        and every one of them was the kind of flaw a skilled human could have found.
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {chainSteps.map(function (st, k) {
          var on = k <= i;
          return <button key={st.n} onClick={function () { setI(k); }}
            aria-label={"Step " + st.n + ": " + st.t}
            style={{
              flex: 1, height: 40, borderRadius: 9, cursor: "pointer",
              fontFamily: "var(--sw-mono)", fontSize: 14, fontWeight: 600,
              background: k === i ? C.accent + "26" : "transparent",
              border: "1px solid " + (on ? C.accent + "66" : C.border),
              color: on ? C.accent : C.muted, transition: "all 0.2s",
            }}>{st.n}</button>;
        })}
      </div>
      <div style={{ minHeight: 210 }}>
        <div style={{ ...CAP, color: C.slate, fontSize: 10.5, marginBottom: 10 }}>{s.tag}</div>
        <div style={{
          fontFamily: "var(--sw-display)", fontSize: 24, fontWeight: 700,
          color: C.text, marginBottom: 12, lineHeight: 1.2,
        }}>{s.t}</div>
        <div style={{ fontFamily: "var(--sw-serif)", fontSize: 17, lineHeight: 1.7, color: C.dim }}>{s.b}</div>
      </div>
    </div>
  </FadeIn>;
}

// ---------- Slider primitive ----------
function Slider({ label, value, min, max, step, onChange, display }) {
  return <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
      <span style={{ ...CAP, fontSize: 11 }}>{label}</span>
      <span style={{ fontFamily: "var(--sw-mono)", fontSize: 16, color: C.text, fontWeight: 600, minWidth: 90, textAlign: "right" }}>{display}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={function (e) { onChange(Number(e.target.value)); }}
      style={{ width: "100%", accentColor: C.accent, cursor: "pointer", height: 24 }} />
  </div>;
}

function Result({ label, value, color, sub }) {
  return <div style={{
    background: C.card, border: "1px solid " + C.border, borderRadius: 12,
    minHeight: 100, display: "flex", flexDirection: "column", justifyContent: "center", padding: "14px 16px",
  }}>
    <div style={{ ...CAP, fontSize: 11, marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: "var(--sw-mono)", fontSize: 24, fontWeight: 700, color: color || C.accent, lineHeight: 1.1 }}>{value}</div>
    {sub ? <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginTop: 5, lineHeight: 1.35 }}>{sub}</div> : null}
  </div>;
}

// ---------- Calculator: the asymmetry ----------
var TOTAL_ACTIONS = 17600;
var CAMPAIGN_DAYS = 4.5;

export function VolumeCalc() {
  var [rate, setRate] = useState(300);
  var [hours, setHours] = useState(8);
  var humanDays = TOTAL_ACTIONS / rate;
  var operators = humanDays / CAMPAIGN_DAYS;
  var perHour = rate / hours;
  var agentPerHour = TOTAL_ACTIONS / (CAMPAIGN_DAYS * 24);
  var speedup = agentPerHour / perHour;
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>Size the asymmetry yourself</div>
      <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.55 }}>
        Hugging Face recovered about 17,600 attacker actions across four and a half days, and every one of them
        was issued without a break, a shift change or a working day. Set what you think a skilled human operator
        can actually sustain, and the gap prices itself.
      </div>
      <Slider label="Actions a human sustains per working day" value={rate} min={50} max={1200} step={25}
        onChange={setRate} display={rate.toLocaleString()} />
      <Slider label="Hours in that working day" value={hours} min={4} max={16} step={1}
        onChange={setHours} display={hours + " h"} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 20 }}>
        <Result label="Human-days of work" value={Math.round(humanDays).toLocaleString()} color={C.slate} />
        <Result label="Operators, working in parallel" value={Math.round(operators).toLocaleString()}
          color={C.accent} sub="to match the same 4.5 days" />
        <Result label="Actions per clock hour" value={speedup.toFixed(1) + "×"} color={C.amber} sub="agent pace vs. human pace" />
      </div>
      <div style={{
        fontFamily: "var(--sw-serif)", fontSize: 16.5, lineHeight: 1.7, color: C.dim,
        borderTop: "1px solid " + C.faint, paddingTop: 16,
      }}>
        This is the part that does not depend on the model being clever. Every weakness in the chain was ordinary.
        What was not ordinary is that thousands of dead ends could be tested and discarded in the time a person
        tests dozens — and that the one path which worked arrived buried inside the wreckage of the ones that did not.
      </div>
    </div>
  </FadeIn>;
}

// ---------- Custom bars: what the production safeguards would have done ----------
var guards = [
  { name: "Research evaluation harness, as run", v: 100, c: C.accent, label: "baseline", note: "Generic system prompt, cyber classifiers off, no auto-review. This is the configuration the incident happened in." },
  { name: "Production Codex harness and system prompt", v: 0.9, c: C.green, label: "<1%", note: "Same evaluation, same model family. OpenAI's own post-incident measurement of the propensity to compromise out-of-scope infrastructure." },
];

export function Safeguards() {
  return <FadeIn>
    <div style={BOX}>
      <div style={{ ...CAP, color: C.text, fontSize: 12, marginBottom: 4 }}>Propensity to compromise out-of-scope infrastructure</div>
      <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.55 }}>
        Indexed to the research configuration. Built after the fact, from a new evaluation OpenAI created specifically
        to measure this. Preliminary, and from the affected party — but it is the single most load-bearing number in
        the remediation, because it says the deployed product and the thing that did this are not the same system.
      </div>
      <div style={{ display: "grid", gap: 18 }}>
        {guards.map(function (d, i) {
          return <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--sw-sans)", fontSize: 15, color: C.text, lineHeight: 1.35 }}>{d.name}</span>
              <span style={{ fontFamily: "var(--sw-mono)", fontSize: 14, color: d.c, fontWeight: 600, whiteSpace: "nowrap" }}>{d.label}</span>
            </div>
            <div style={{ height: 14, background: C.faint, borderRadius: 7, overflow: "hidden" }}>
              <div style={{ width: Math.max(0.8, d.v) + "%", height: "100%", background: d.c, borderRadius: 7 }} />
            </div>
            <div style={{ fontFamily: "var(--sw-sans)", fontSize: 14, color: C.muted, marginTop: 7, lineHeight: 1.5 }}>{d.note}</div>
          </div>;
        })}
      </div>
    </div>
  </FadeIn>;
}
