import React, { useEffect, useRef } from 'react';

/* A full-page WebGL background: slow flowing noise, a faint isometric grid that bends
   around the cursor like a lens, and a soft ripple on click. Colours come from the
   page's CSS variables and ease over when the theme changes. */

const VERT = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uDpr;
uniform vec2 uMouse; uniform vec3 uClick;
uniform vec3 uBg; uniform vec3 uInk; uniform vec3 uTint;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return v;
}
float gridLine(vec2 gp, vec2 dir, float w) {
  float d = abs(fract(dot(gp, dir)) - 0.5);
  return 1.0 - smoothstep(0.5 - w * 1.6, 0.5 - w * 0.4, d);
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.035;

  // domain-warped noise for the slow flow
  vec2 q = vec2(fbm(p * 1.3 + vec2(t, -t)), fbm(p * 1.3 + vec2(3.1 - t, 1.7 + t)));
  float f = fbm(p * 1.1 + q * 1.8 + vec2(t * 0.6, -t * 0.4));

  // cursor lens and click ripple
  vec2 d = p - m; float r = length(d);
  float lens = exp(-r * r * 7.0);
  vec2 dc = p - (uClick.xy - 0.5 * uRes) / uRes.y;
  float age = uTime - uClick.z, rc = length(dc);
  float ring = exp(-pow((rc - age * 0.55) * 12.0, 2.0)) * exp(-age * 1.6) * step(0.0, age);

  // isometric grid, pushed out by the lens and the ripple, wobbling with the flow
  vec2 g = p - d * lens * 0.09 - normalize(dc + 1e-5) * ring * 0.012 + (q - 0.5) * 0.012;
  float spacing = 30.0 * uDpr / uRes.y;
  vec2 gp = g / spacing;
  float w = 0.6 / 30.0; // ~0.6px half-width, in grid cells
  float lines = max(gridLine(gp, vec2(0.5, 0.8660254), w), gridLine(gp, vec2(-0.5, 0.8660254), w));

  vec3 col = uBg;
  col = mix(col, uInk, 0.045 * smoothstep(0.38, 0.9, f));
  col = mix(col, uTint, 0.08 * lens + 0.05 * ring);
  col = mix(col, uInk, lines * (0.028 + 0.075 * lens + 0.06 * ring));
  // a hint of grain so the gradients never band
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.006;
  gl_FragColor = vec4(col, 1.0);
}`;

const hex = h => {
  const s = h.trim().replace('#', '');
  const n = parseInt(s.length === 3 ? s.split('').map(c => c + c).join('') : s, 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
};

export default function ShaderBg({ mode }) {
  const ref = useRef(null);
  const target = useRef(null);

  // read the palette a tick after the theme flips, once the CSS variables have changed
  useEffect(() => {
    const id = setTimeout(() => {
      const cs = getComputedStyle(document.documentElement);
      target.current = ['--bg', '--ink', '--accent'].map(v => hex(cs.getPropertyValue(v) || '#ffffff'));
    }, 0);
    return () => clearTimeout(id);
  }, [mode]);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl || gl.isContextLost()) { canvas.style.display = 'none'; return; }
    canvas.style.display = '';
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = Object.fromEntries(['uRes', 'uTime', 'uDpr', 'uMouse', 'uClick', 'uBg', 'uInk', 'uTint'].map(n => [n, gl.getUniformLocation(prog, n)]));

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    // the cursor is followed with a lag, which is what makes it feel smooth
    const want = { x: innerWidth * 0.7, y: innerHeight * 0.3 }, cur = { ...want };
    const click = [-9999, -9999, -99];
    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;
    const onMove = e => { want.x = e.clientX; want.y = e.clientY; };
    const onDown = e => { click[0] = e.clientX * dpr; click[1] = (innerHeight - e.clientY) * dpr; click[2] = now(); };
    let cols = null, raf = 0;

    const frame = () => {
      if (target.current) {
        if (!cols) cols = target.current.map(c => [...c]);
        cols.forEach((c, i) => c.forEach((v, j) => { c[j] = v + (target.current[i][j] - v) * 0.08; }));
      }
      cur.x += (want.x - cur.x) * 0.05; cur.y += (want.y - cur.y) * 0.05;
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uTime, reduce ? 0 : now());
      gl.uniform1f(U.uDpr, dpr);
      gl.uniform2f(U.uMouse, cur.x * dpr, (innerHeight - cur.y) * dpr);
      gl.uniform3f(U.uClick, click[0], click[1], click[2]);
      const [bg, ink, tint] = cols || [[1, 1, 1], [0, 0, 0], [.2, .4, 1]];
      gl.uniform3fv(U.uBg, bg); gl.uniform3fv(U.uInk, ink); gl.uniform3fv(U.uTint, tint);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); };

    addEventListener('resize', resize);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="shader-bg" aria-hidden="true" />;
}
