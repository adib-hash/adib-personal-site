// Adapted from ThreeUI Community (MIT) © 2026 Meng To — https://github.com/MengTo/threeui
//
// The render lifecycle follows theirs (IntersectionObserver pauses the loop
// offscreen, ResizeObserver drives resize, DPR clamped at 2, full GL teardown).
// Three things are ours: prefers-reduced-motion renders a single frame and
// never starts the loop, a missing WebGL context degrades to a CSS gradient
// instead of an empty box, and the palette comes from the site's design tokens
// rather than from constants baked into the shader.

import { useEffect, useRef, useState } from "react";
import { STREAM_VERTEX_SHADER } from "../shaders/streamConvergence";

const FALLBACK_ACCENT = [0.83, 0.65, 0.28]; // #d4a647, if the token can't be read

/**
 * Resolve any CSS color string — including oklch(), which the site uses — to
 * linear-ish sRGB floats, by letting the canvas 2D parser do the conversion.
 */
function resolveColor(cssColor) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.fillStyle = "#000";
    ctx.fillStyle = cssColor;
    // An unparseable color leaves fillStyle at the previous value.
    if (ctx.fillStyle === "#000000" && cssColor.trim() !== "#000000") return null;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255];
  } catch {
    return null;
  }
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn("ShaderField:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderField({
  fragmentShader,
  speed = 1,
  alpha = 0.3,
  fidelity = 0.5,
  accentVar = "--accent",
  className = "",
  style,
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  // Live-tunable knobs reach the running loop through a ref, so changing one
  // never tears down and rebuilds the GL context.
  const optionsRef = useRef({ speed, alpha, fidelity });
  useEffect(() => {
    optionsRef.current = { speed, alpha, fidelity };
  }, [speed, alpha, fidelity]);

  // Until the GL context is confirmed, assume the fallback so a failure to
  // acquire one never leaves a blank rectangle.
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return undefined;

    const vertex = compile(gl, gl.VERTEX_SHADER, STREAM_VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader);
    const program = vertex && fragment ? gl.createProgram() : null;
    if (!vertex || !fragment || !program) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return undefined;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (import.meta.env.DEV) console.warn("ShaderField:", gl.getProgramInfoLog(program));
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteProgram(program);
      return undefined;
    }
    gl.useProgram(program);
    setSupported(true);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uFidelity = gl.getUniformLocation(program, "u_fidelity");
    const uAccent = gl.getUniformLocation(program, "u_accent");
    const uAlpha = gl.getUniformLocation(program, "u_alpha");

    // Palette comes from the design tokens, resolved once against the host.
    const token = getComputedStyle(host).getPropertyValue(accentVar).trim();
    const accent = (token && resolveColor(token)) || FALLBACK_ACCENT;
    gl.uniform3f(uAccent, accent[0], accent[1], accent[2]);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    const startedAt = performance.now();

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    const draw = (elapsed) => {
      const options = optionsRef.current;
      gl.uniform1f(uTime, elapsed * 0.0003 * options.speed);
      gl.uniform1f(uFidelity, options.fidelity);
      gl.uniform1f(uAlpha, options.alpha);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const loop = (now) => {
      draw(now - startedAt);
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };

    // Reduced motion gets one composed frame and no loop at all. The site's
    // global CSS rule can't reach a requestAnimationFrame loop.
    const still = () => draw(4200);

    const start = () => {
      if (reduceMotion.matches) {
        still();
        return;
      }
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionChange = () => {
      stop();
      start();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion.matches) still();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    });

    resizeObserver.observe(host);
    intersection.observe(host);
    document.addEventListener("visibilitychange", onVisibility);
    reduceMotion.addEventListener("change", onMotionChange);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionChange);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteProgram(program);
    };
  }, [fragmentShader, accentVar]);

  return (
    <div
      ref={hostRef}
      className={`shader-field${supported ? " is-live" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
