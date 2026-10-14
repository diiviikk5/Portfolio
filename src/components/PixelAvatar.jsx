import React, { useEffect, useRef } from 'react';

/* An image that starts as big pixels and resolves into focus; hovering pixelates it a little again. */
export default function PixelAvatar({ src, alt, size = 112 }) {
  const cv = useRef(null), img = useRef(null), lvl = useRef(4), want = useRef(1), raf = useRef(0);
  useEffect(() => {
    const c = cv.current, g = c.getContext('2d'), im = new Image();
    im.src = src; img.current = im;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const draw = () => {
      const W = c.width, H = c.height, k = Math.max(1, Math.round(lvl.current));
      const small = Math.max(2, Math.round(W / k));
      g.imageSmoothingEnabled = false; g.clearRect(0, 0, W, H);
      g.drawImage(im, 0, 0, small, small);
      g.drawImage(c, 0, 0, small, small, 0, 0, W, H);
    };
    const tick = () => {
      lvl.current += (want.current - lvl.current) * 0.12;
      draw();
      if (Math.abs(want.current - lvl.current) > 0.05) raf.current = requestAnimationFrame(tick);
      else { lvl.current = want.current; draw(); }
    };
    const go = to => { want.current = to; cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(tick); };
    im.onload = () => { const d = Math.min(2, devicePixelRatio || 1); c.width = c.height = size * d; lvl.current = reduce ? 1 : 28; go(1); };
    c._pixelate = go;
    return () => cancelAnimationFrame(raf.current);
  }, [src, size]);
  return (
    <canvas ref={cv} role="img" aria-label={alt} className="pix-avatar" style={{ width: size, height: size }}
      onMouseEnter={() => cv.current._pixelate && cv.current._pixelate(10)} onMouseLeave={() => cv.current._pixelate && cv.current._pixelate(1)} />
  );
}
