// Adapted from ThreeUI Community (MIT) © 2026 Meng To — https://github.com/MengTo/threeui
// Source: src/shaders/stream-convergence/streamConvergenceShaders.ts
//
// The geometry is theirs: three diagonal wave bands, offset from each other,
// distorted along x by a slow sine, then vignetted. The color is not — the
// original splits the three bands across R/G/B for a violet-indigo look. Here
// they accumulate into one scalar intensity that tints from deep amber to pale
// gold, driven by the site's --accent token rather than by hard-coded channels.

export const STREAM_VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const BANDS = `
  vec2 p = vUv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;
  p = rotate2d(0.55) * p;

  float spread = 0.06 * (0.3 + u_fidelity * 0.7);
  float intensity = 0.0;
  float crest = 0.0;

  for (int i = 0; i < 3; i++) {
    float band = float(1 - i);
    float y = p.y + band * spread + sin(p.x * 2.5 - u_time * 1.5) * 0.12;
    float wave = smoothstep(0.85, 0.99, sin(y * 6.0 + u_time * 2.0) * 0.5 + 0.5);
    intensity += wave * (0.85 + band * 0.25);
    crest += wave * band;
  }

  vec2 v = vUv * 2.0 - 1.0;
  vec2 e = v * vec2(0.9, 1.15);
  float vignette = exp(-dot(e, e) * 0.95);
  intensity *= vignette;
`;

const PREAMBLE = `
precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform float u_fidelity;
uniform vec3  u_accent;
uniform float u_alpha;
varying vec2 vUv;

mat2 rotate2d(float a) {
  return mat2(cos(a), -sin(a), sin(a), cos(a));
}
`;

/** Gold. Bands tint from deep amber in the troughs to pale gold at the crests. */
export const STREAM_FRAGMENT_SHADER = `${PREAMBLE}
void main() {
${BANDS}
  // Whitening the crests past ~0.25 drains the chroma and the field reads as
  // brown smoke rather than gold, so the highlight stays close to the token.
  vec3 deep = u_accent * 0.62;
  vec3 pale = mix(u_accent, vec3(1.0, 0.95, 0.85), 0.25);
  vec3 color = mix(deep, pale, clamp(crest * 0.45 + intensity * 0.35, 0.0, 1.0));

  gl_FragColor = vec4(color, clamp(intensity, 0.0, 1.0) * u_alpha);
}
`;

/**
 * The control. Identical geometry, ThreeUI's original per-channel color split
 * left intact, so /motion-lab can show the warm version against the cool one
 * it came from. Never rendered in production.
 */
export const STREAM_FRAGMENT_SHADER_NATIVE = `${PREAMBLE}
void main() {
${BANDS}
  vec3 color = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float band = float(1 - i);
    float y = p.y + band * spread + sin(p.x * 2.5 - u_time * 1.5) * 0.12;
    float wave = smoothstep(0.85, 0.99, sin(y * 6.0 + u_time * 2.0) * 0.5 + 0.5);
    if (i == 0) color.r += wave * 1.2;
    if (i == 1) color.g += wave * 0.5;
    if (i == 2) color.b += wave * 1.8;
  }
  color *= vignette;

  gl_FragColor = vec4(color, clamp(intensity, 0.0, 1.0) * u_alpha);
}
`;
