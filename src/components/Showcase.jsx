import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Play } from 'lucide-react';

/* Every project with a demo on one stage. The active one sits centred and plays; its neighbours fan out
   behind it on springs. Drag, swipe, arrow keys, click a neighbour, or let it play through. */

const AUTOPLAY_MS = 7000;
const spring = { type: 'spring', stiffness: 260, damping: 30, mass: .9 };
const ease = [0.16, 1, 0.3, 1];

/* shortest signed distance from the active card around the ring */
const ringOffset = (i, active, n) => {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
};

function useCardWidth(ref) {
  const [w, setW] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.min(660, Math.max(260, e.contentRect.width * 0.72))));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

function Card({ p, d, w, onPick, onWatch }) {
  const video = useRef(null);
  const active = d === 0;
  const far = Math.abs(d);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (active) { v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
  }, [active]);

  return (
    <motion.div
      className={`show-card t-${p.tint || 'lime'} ${active ? 'is-active' : ''}`}
      style={{ width: w, zIndex: 20 - far, pointerEvents: far > 2 ? 'none' : 'auto' }}
      initial={false}
      animate={{
        x: d * w * 0.8,
        scale: active ? 1 : 0.82 - (far - 1) * 0.06,
        rotateY: Math.max(-1, Math.min(1, d)) * -14,
        opacity: far > 2 ? 0 : active ? 1 : 0.55 - (far - 1) * 0.25,
        filter: active ? 'grayscale(0)' : 'grayscale(.6)',
      }}
      transition={spring}
      onClick={() => (active ? onWatch(p) : onPick())}
      aria-hidden={!active}
    >
      <div className="show-media">
        <video ref={video} src={p.video} muted loop playsInline preload="metadata" />
        {active && (
          <motion.span className="show-hint" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .4, ease }}>
            <Play size={12} fill="currentColor" />watch the demo
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

/* the name types itself in, one pixel letter at a time */
const Letters = ({ text }) => (
  <span className="show-name" aria-label={text}>
    {[...text].map((ch, i) => (
      <motion.span key={i} aria-hidden="true" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.035, duration: .45, ease }}>
        {ch === ' ' ? ' ' : ch}
      </motion.span>
    ))}
  </span>
);

export default function Showcase({ projects, onWatch, github }) {
  const n = projects.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const stage = useRef(null);
  const root = useRef(null);
  const w = useCardWidth(stage);
  const reduce = useReducedMotion();
  const go = useCallback(i => setActive(((i % n) + n) % n), [n]);
  const p = projects[active];

  // only autoplay once the showcase has been on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: .35 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);
  const playing = seen && !paused && !reduce;

  const onKey = e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };

  return (
    <div className="showcase" ref={root} tabIndex={0} onKeyDown={onKey} aria-roledescription="carousel" aria-label="Projects"
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <motion.div className="show-stage" ref={stage}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} dragMomentum={false}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.x < -60 || velocity.x < -450) go(active + 1);
          else if (offset.x > 60 || velocity.x > 450) go(active - 1);
        }}>
        {projects.map((proj, i) => (
          <Card key={proj.name} p={proj} d={ringOffset(i, active, n)} w={w} onPick={() => go(i)} onWatch={onWatch} />
        ))}
      </motion.div>

      <div className="show-info col-w">
        <div className="show-text" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={p.name} initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8, transition: { duration: .18 } }}>
              <Letters text={p.name} />
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .45, ease }}>{p.desc}</motion.p>
              <motion.div className="show-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .28, duration: .4 }}>
                {p.tag && <span className="dim">{p.tag}</span>}
                <span className="show-btns">
                  <button type="button" className="btn btn--ink" onClick={() => onWatch(p)}><Play size={12} fill="currentColor" />Watch</button>
                  <a className="btn" href={`${github}/${p.repo}`} target="_blank" rel="noreferrer"><Github size={13} />Source</a>
                  {p.link && <a className="btn" href={p.link} target="_blank" rel="noreferrer">Live<ArrowUpRight size={13} /></a>}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="show-ctrl">
          <span className="show-count" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b key={active} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: .35, ease }}>
                {String(active + 1).padStart(2, '0')}
              </motion.b>
            </AnimatePresence>
            <i>/ {String(n).padStart(2, '0')}</i>
          </span>
          <button type="button" className="btn btn--icon" onClick={() => go(active - 1)} aria-label="Previous project"><ArrowLeft size={15} /></button>
          <button type="button" className="btn btn--icon" onClick={() => go(active + 1)} aria-label="Next project"><ArrowRight size={15} /></button>
        </div>
      </div>

      <div className="show-strip col-w" role="tablist" aria-label="Choose a project">
        {projects.map((proj, i) => (
          <button key={proj.name} type="button" role="tab" aria-selected={i === active} className={i === active ? 'on' : ''} onClick={() => go(i)}>
            <span>{proj.name}</span>
            {i === active && (
              <i key={active} className="show-bar" style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: playing ? 'running' : 'paused' }}
                onAnimationEnd={() => go(active + 1)} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
