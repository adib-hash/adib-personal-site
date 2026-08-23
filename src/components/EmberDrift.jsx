// Adapted from ThreeUI Community (MIT) © 2026 Meng To — https://github.com/MengTo/threeui
// Source: the 2D ember layer inside src/shaders/bell-field/BellFieldBackground.tsx
//
// Only the particle layer is lifted — the WebGL bell shader it sat on top of is
// not used here. Their ember color is rgba(231, 193, 101), which is #E7C165, a
// hair off this site's #d4a647, so the layer arrived on palette. The cool
// second color in the original is dropped and both classes now sample the gold
// token. No GPU, one 2D context.

import { useEffect, useRef } from "react";

const COUNT = 58;

export default function EmberDrift({
  count = COUNT,
  speed = 1,
  opacity = 0.5,
  accentVar = "--accent",
  className = "",
  style,
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  // Live-tunable knobs reach the running loop through a ref, so changing one
  // never tears down and rebuilds the canvas.
  const optionsRef = useRef({ count, speed, opacity });
  useEffect(() => {
    optionsRef.current = { count, speed, opacity };
  }, [count, speed, opacity]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const token = getComputedStyle(host).getPropertyValue(accentVar).trim() || "#d4a647";

    let width = 1;
    let height = 1;
    let frame = 0;
    let visible = true;
    const startedAt = performance.now();

    const embers = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.4,
      vy: -(0.1 + Math.random() * 0.26),
      vx: (Math.random() - 0.5) * 0.08,
      phase: Math.random() * Math.PI * 2,
      rate: 0.5 + Math.random() * 1.4,
      hot: Math.random() < 0.36,
      placed: false,
    }));

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const ember of embers) {
        if (!ember.placed) {
          ember.x *= width;
          ember.y *= height;
          ember.placed = true;
        }
      }
    };

    const paint = (t, advance) => {
      const options = optionsRef.current;
      ctx.clearRect(0, 0, width, height);
      const active = Math.max(0, Math.min(COUNT, options.count));
      for (let i = 0; i < active; i += 1) {
        const ember = embers[i];
        if (advance) {
          ember.y += ember.vy * options.speed;
          ember.x += (ember.vx + Math.sin(t * ember.rate * 0.5 + ember.phase) * 0.13) * options.speed;
          if (ember.y < -4) {
            ember.y = height + 4;
            ember.x = Math.random() * width;
          }
          if (ember.x < -4) ember.x = width + 4;
          if (ember.x > width + 4) ember.x = -4;
        }
        const twinkle = 0.5 + 0.5 * Math.sin(t * ember.rate + ember.phase);
        const a = (ember.hot ? 0.06 + twinkle * 0.34 : 0.04 + twinkle * 0.2) * options.opacity;
        ctx.globalAlpha = a;
        ctx.fillStyle = token;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, ember.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const loop = (now) => {
      paint((now - startedAt) * 0.001 * optionsRef.current.speed, true);
      frame = visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };

    const still = () => paint(3.1, false);

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
    };
  }, [accentVar]);

  return (
    <div ref={hostRef} className={`ember-drift${className ? ` ${className}` : ""}`} style={style} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
