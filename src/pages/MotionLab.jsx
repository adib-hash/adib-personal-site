// Dev-only bench for judging motion candidates against the real palette.
// Mounted behind import.meta.env.DEV in App.jsx, same as /audio-lab, so it
// never reaches production. Nothing here is imported by a shipped page.

import { useState } from "react";
import ShaderField from "../components/ShaderField";
import EmberDrift from "../components/EmberDrift";
import {
  STREAM_FRAGMENT_SHADER,
  STREAM_FRAGMENT_SHADER_NATIVE,
} from "../shaders/streamConvergence";

const HOME_DEFAULTS = { alpha: 0.3, speed: 1, fidelity: 0.5 };
const EMBER_DEFAULTS = { opacity: 0.55, count: 58, speed: 1 };

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <label className="lab-slider">
      <span className="lab-slider-label">
        {label}
        <b>{value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function Stage({ title, note, narrow, children }) {
  return (
    <section className="lab-stage">
      <div className="lab-stage-head">
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </div>
      <div className={`lab-stage-frame${narrow ? " is-narrow" : ""}`}>
        <div className="lab-stage-surface">
          {children}
          <div className="lab-stage-type">
            <h3>Adib Choudhury</h3>
            <p>
              A place for sharing my thoughts and side projects while exploring
              tech, business, and spirituality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MotionLab() {
  const [alpha, setAlpha] = useState(HOME_DEFAULTS.alpha);
  const [speed, setSpeed] = useState(HOME_DEFAULTS.speed);
  const [fidelity, setFidelity] = useState(HOME_DEFAULTS.fidelity);
  const [narrow, setNarrow] = useState(false);

  const [emberOpacity, setEmberOpacity] = useState(EMBER_DEFAULTS.opacity);
  const [emberCount, setEmberCount] = useState(EMBER_DEFAULTS.count);
  const [emberSpeed, setEmberSpeed] = useState(EMBER_DEFAULTS.speed);

  return (
    <div className="lab">
      <header className="lab-header">
        <h1>Motion lab</h1>
        <p>
          Dev only. Candidates at hero scale against the real <code>--bg</code>{" "}
          and <code>--accent</code>. Toggle the 390px frame before deciding
          anything.
        </p>
        <button
          type="button"
          className="lab-toggle"
          aria-pressed={narrow}
          onClick={() => setNarrow((v) => !v)}
        >
          {narrow ? "390px frame — on" : "390px frame — off"}
        </button>
      </header>

      <div className="lab-controls">
        <Slider label="alpha" value={alpha} min={0} max={1} step={0.05} onChange={setAlpha} />
        <Slider label="speed" value={speed} min={0.1} max={3} step={0.1} onChange={setSpeed} />
        <Slider label="fidelity" value={fidelity} min={0} max={1} step={0.05} onChange={setFidelity} />
      </div>

      <Stage
        title="Stream convergence — gold"
        note="Shipping candidate. Accent read from the token, deep amber in the troughs to pale gold at the crests."
        narrow={narrow}
      >
        <ShaderField
          fragmentShader={STREAM_FRAGMENT_SHADER}
          alpha={alpha}
          speed={speed}
          fidelity={fidelity}
          style={{ inset: 0 }}
        />
      </Stage>

      <Stage
        title="Stream convergence — native (control)"
        note="ThreeUI's original per-channel violet-indigo split, same geometry. Kept for comparison; never shipped."
        narrow={narrow}
      >
        <ShaderField
          fragmentShader={STREAM_FRAGMENT_SHADER_NATIVE}
          alpha={alpha}
          speed={speed}
          fidelity={fidelity}
          style={{ inset: 0 }}
        />
      </Stage>

      <div className="lab-controls">
        <Slider label="ember opacity" value={emberOpacity} min={0} max={1} step={0.05} onChange={setEmberOpacity} />
        <Slider label="ember count" value={emberCount} min={0} max={58} step={1} onChange={setEmberCount} />
        <Slider label="ember speed" value={emberSpeed} min={0.1} max={3} step={0.1} onChange={setEmberSpeed} />
      </div>

      <Stage
        title="Ember drift"
        note="Bell Field's 2D particle layer, no WebGL. Shipping on the Research masthead."
        narrow={narrow}
      >
        <EmberDrift
          opacity={emberOpacity}
          count={emberCount}
          speed={emberSpeed}
          style={{ inset: 0 }}
        />
      </Stage>

      <Stage
        title="Both, stacked"
        note="Sanity check only — production never runs two fields on one screen."
        narrow={narrow}
      >
        <ShaderField
          fragmentShader={STREAM_FRAGMENT_SHADER}
          alpha={alpha}
          speed={speed}
          fidelity={fidelity}
          style={{ inset: 0 }}
        />
        <EmberDrift opacity={emberOpacity} count={emberCount} speed={emberSpeed} style={{ inset: 0 }} />
      </Stage>
    </div>
  );
}
