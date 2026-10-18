import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, FileText, ArrowUpRight, ArrowRight, Star, Search, Play, Copy, Check, Contrast, Terminal, Fingerprint, Cpu, Clapperboard } from 'lucide-react';
import ShaderBg from '@/components/ShaderBg';
import '../iso.css';

/* ─── content ───────────────────────────────────────────────────────────────── */
const USERNAME = 'diiviikk5';
const links = {
  github: `https://github.com/${USERNAME}`,
  linkedin: 'https://www.linkedin.com/in/divik-arora-2b091636b/',
  twitter: 'https://x.com/divikkk1',
  medium: 'https://medium.com/@divikstudy100',
  email: 'divikstudy100@gmail.com',
  resume: '/dvkar_resume.pdf',
};
/* hand-written notes; ones with a video show up in Demos, ones with `fav` in About */
const curated = [
  { name: 'Drift', desc: 'Windows alternative to Screen Studio with cinematic cursor tracking and smooth zooms.', short: 'Desktop screen recorder with cursor zoom (Rust, Tauri and JS).', tag: 'Rust · Tauri · React', video: '/drift-showcase-1777051239342.mp4', repo: 'drift' },
  { name: 'Xeus', desc: 'A playground for Solana agents: faster and easier, built on the Agent Kit and the Solana.new MCP.', short: 'A faster, easier playground for Solana agents.', tag: 'TS · Solana · MCP', video: '/xeuz_demo.mp4', repo: 'Xeus' },
  { name: 'OpenLVM', desc: 'Advanced agent testing platform.', short: 'Agent testing platform (in progress).', tag: 'Zig · Python · Next.js', video: '/openlvm_demo.mp4', repo: 'OpenLVM' },
  { name: 'Stellar v1k', desc: 'GNSS satellite forecasting console powered by ML predictions.', short: 'GNSS satellite model training.', tag: 'React · Three.js · Python', video: '/ztellar_v1k.mp4', repo: 'stellar', link: 'https://stellar-wine.vercel.app/' },
  { name: 'Gladiator', desc: 'Gamified algorithm learning through interactive PvP sessions.', short: 'Browser games on DSA.', tag: 'React · WebSocket', video: '/gladiator_demo.mp4', repo: 'gladiator', link: 'https://gladiator-smoky.vercel.app/' },
  { name: 'Swasthya', desc: 'Holistic wellness platform with an integrated AI symptom checker.', short: 'Health tracker.', tag: 'React · Node · MongoDB', video: '/zwazthya_arogyam_demo.mp4', repo: 'swasthya', link: 'https://swasthya-gold.vercel.app/' },
  { name: 'Nectar', desc: 'Turn content into agent skills.', short: 'Turn content into agent skills.', repo: 'Nectar' },
  { name: 'gloader', desc: 'A generic attempt towards a game launcher, building a better one.', short: 'A game launcher, building a better one.', repo: 'gloader' },
  { name: 'dvkcli', desc: 'Personal pocket GPT (Qwen!).', short: 'Personal pocket GPT (Qwen!).', repo: 'dvkcli' },
  { name: 'NextPlayGames', desc: 'I love games, so a game tracker.', short: 'I love games, so a game tracker.', repo: 'Nextplay' },
];
const demos = curated.filter(c => c.video);
const byRepo = Object.fromEntries(curated.map(c => [c.repo.toLowerCase(), c]));
const stack = ['Rust', 'Go', 'TypeScript', 'Python', 'C++', 'Solidity', 'React', 'Next.js', 'Node.js', 'Tauri', 'Three.js', 'Solana'];
const LANG = { TypeScript: '#3178c6', JavaScript: '#e8c931', Python: '#3572a5', Rust: '#dea584', Go: '#00add8', 'C++': '#f34b7d', C: '#555555', Solidity: '#aa6746', HTML: '#e34c26', CSS: '#663399', Zig: '#ec915c', Shell: '#89e051', 'Jupyter Notebook': '#da5b0b', Java: '#b07219', Svelte: '#ff3e00', Vue: '#41b883' };
const ease = [0.16, 1, 0.3, 1];
const up = (delay = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: .5, ease, delay } });
const reveal = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: .55, ease } };

/* ─── live GitHub (cached for the tab session) ─────────────────────────────── */
function useGitHub() {
  const [s, set] = useState({ user: null, repos: null, days: [] });
  useEffect(() => {
    const get = async (key, url) => {
      const hit = sessionStorage.getItem(key);
      if (hit) return JSON.parse(hit);
      const r = await fetch(url).catch(() => null);
      if (!r?.ok) return null;
      const j = await r.json();
      sessionStorage.setItem(key, JSON.stringify(j));
      return j;
    };
    get('iso-user', `https://api.github.com/users/${USERNAME}`).then(user => set(p => ({ ...p, user })));
    get('iso-repos', `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`).then(repos => set(p => ({ ...p, repos: Array.isArray(repos) ? repos : [] })));
    get('iso-days', `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).then(d => set(p => ({ ...p, days: d?.contributions || [] })));
  }, []);
  return s;
}
const ownRepos = repos => (repos || []).filter(r => !r.fork && r.name.toLowerCase() !== USERNAME);
const ago = iso => {
  const d = (Date.now() - new Date(iso)) / 864e5;
  if (d < 1) return 'today';
  if (d < 30) return `${Math.floor(d)}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
};

/* ─── isometric line-art props ─────────────────────────────────────────────── */
const C30 = Math.cos(Math.PI / 6);
const P = (x, y, z) => `${((x - y) * C30).toFixed(1)},${((x + y) / 2 - z).toFixed(1)}`;
const quad = (...pts) => pts.map(p => P(...p)).join(' ');
/* a box at (x,y,z) sized w×d×h: the left face is hatched, the others are paper */
const Box = ({ x = 0, y = 0, z = 0, w, d, h, className = '' }) => (
  <g className={`box ${className}`}>
    <polygon className="l" points={quad([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])} />
    <polygon className="r" points={quad([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])} />
    <polygon className="t" points={quad([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])} />
  </g>
);
const Hatch = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
    <defs>
      <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect className="hatch-bg" width="5" height="5" /><line className="hatch-ln" x1="0" y1="0" x2="0" y2="5" />
      </pattern>
    </defs>
  </svg>
);

/* the hero desk: every object lifts on hover; the block stack pops when clicked */
function DeskScene() {
  const [pops, setPops] = useState(0);
  const lines = [40, 26, 48, 18, 34, 42];
  return (
    <svg className="scene" viewBox="-130 -50 300 200" role="img" aria-label="Isometric line drawing of a desk with a laptop, a block stack, a keycap and a mug">
      <Box className="base" w={190} d={140} h={6} />
      <g className="prop">
        <Box x={26} y={30} z={6} w={78} d={52} h={4} />
        {Array.from({ length: 3 }, (_, r) => Array.from({ length: 6 }, (_, c) => (
          <polygon key={`${r}${c}`} className="key" points={quad([33 + c * 11, 52 + r * 8, 10], [41 + c * 11, 52 + r * 8, 10], [41 + c * 11, 58 + r * 8, 10], [33 + c * 11, 58 + r * 8, 10])} />
        )))}
        <Box x={26} y={27} z={10} w={78} d={3} h={50} />
        <polygon className="screen" points={quad([30, 30, 14], [100, 30, 14], [100, 30, 56], [30, 30, 56])} />
        {lines.map((len, i) => {
          const x0 = 35 + (i % 3 === 1 ? 7 : 0), z = 50 - i * 6;
          return <polyline key={i} className="code" style={{ '--d': `${i * .4}s` }} points={`${P(x0, 30, z)} ${P(x0 + len, 30, z)}`} />;
        })}
      </g>
      <g className="prop prop--click" onClick={() => setPops(n => n + 1)}>
        <Box x={128} y={16} z={6} w={34} d={34} h={20} />
        <Box x={132} y={20} z={26} w={26} d={26} h={18} />
        <g key={pops} className="pop"><Box className="solid" x={136} y={24} z={44} w={18} d={18} h={16} /></g>
      </g>
      <g className="prop">
        <Box x={40} y={104} z={6} w={24} d={24} h={8} />
        <Box x={43} y={107} z={14} w={18} d={18} h={3} />
        <text className="cap-t" transform={`matrix(${C30},.5,${-C30},.5,${((47 - 110) * C30).toFixed(1)},${((47 + 110) / 2 - 17).toFixed(1)})`} y="11" x="2">D</text>
      </g>
      <g className="prop">
        <Box x={134} y={92} z={6} w={20} d={20} h={24} />
        <polygon className="coffee" points={quad([137, 95, 30], [151, 95, 30], [151, 109, 30], [137, 109, 30])} />
        <Box x={154} y={98} z={12} w={6} d={7} h={12} />
      </g>
    </svg>
  );
}
/* little props that sit at the end of each // label */
const MINI = {
  glance: <><Box className="base" w={38} d={20} h={3} /><Box x={4} y={5} z={3} w={8} d={10} h={8} /><Box x={15} y={5} z={3} w={8} d={10} h={16} /><Box className="solid" x={26} y={5} z={3} w={8} d={10} h={26} /></>,
  demos: <><Box className="base" w={36} d={24} h={3} /><Box x={6} y={8} z={3} w={24} d={3} h={22} /><polygon className="solid-face" points={quad([15, 11, 19], [15, 11, 10], [22, 11, 14.5])} /></>,
  work: <><Box x={0} y={0} w={14} d={14} h={14} /><Box x={16} y={0} w={14} d={14} h={8} /><Box className="solid" x={0} y={16} w={14} d={14} h={22} /><Box x={16} y={16} w={14} d={14} h={12} /></>,
  reach: <><Box className="base" w={36} d={26} h={3} /><Box x={5} y={5} z={3} w={26} d={16} h={6} /><polyline className="fold" points={`${P(5, 5, 9)} ${P(18, 14, 9)} ${P(31, 5, 9)}`} /></>,
};
const Mini = ({ name }) => <svg className="mini" viewBox="-36 -40 76 66" aria-hidden="true">{MINI[name]}</svg>;
const Label = ({ children, right, prop }) => (
  <div className="label">
    <span className="label-t">// {children}</span><i />{right && <span className="label-r">{right}</span>}{prop && <Mini name={prop} />}
  </div>
);

/* ─── nav: a floating pill ─────────────────────────────────────────────────── */
const NAV = [['Home', '#home', Terminal], ['About', '#about', Fingerprint], ['Demos', '#demos', Clapperboard], ['Work', '#work', Cpu]];
function Nav({ mode, setMode }) {
  const [active, setActive] = useState('#home');
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive('#' + e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(([, h]) => { const el = document.querySelector(h); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <motion.nav className="pill" initial={{ opacity: 0, y: -12, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} transition={{ duration: .5, ease, delay: .1 }}>
      {NAV.map(([n, h, I]) => (
        <a key={h} href={h} className={active === h ? 'on' : ''}>
          {active === h && <motion.span layoutId="pill-hl" className="pill-hl" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
          <I size={15} strokeWidth={1.6} /><span>{n}</span>
        </a>
      ))}
      <i className="pill-sep" />
      <a href={links.resume} target="_blank" rel="noreferrer"><FileText size={15} strokeWidth={1.6} /><span>Resume</span></a>
      <i className="pill-sep" />
      <button type="button" onClick={() => setMode(m => (m === 'light' ? 'grey' : 'light'))} aria-label={`Switch to ${mode === 'light' ? 'grey' : 'light'} mode`}>
        <Contrast size={15} strokeWidth={1.6} /><span>{mode === 'light' ? 'Light' : 'Grey'}</span>
      </button>
    </motion.nav>
  );
}

/* ─── contributions: the usual GitHub grid ─────────────────────────────────── */
function Contributions({ days }) {
  const [hot, setHot] = useState(null);
  const scroller = useRef(null);
  const { weeks, total } = useMemo(() => {
    if (!days.length) return { weeks: [], total: 0 };
    const nz = days.map(d => d.count).filter(Boolean).sort((a, b) => a - b);
    const q = k => nz[Math.floor((nz.length - 1) * k)] || 1;
    const lv = c => (!c ? 0 : c <= q(.33) ? 1 : c <= q(.66) ? 2 : c <= q(.9) ? 3 : 4);
    const pad = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
    const cells = [...Array(pad).fill(null), ...days.map(d => ({ ...d, lv: lv(d.count) }))];
    const weeks = []; for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return { weeks, total: days.reduce((a, d) => a + d.count, 0) };
  }, [days]);
  useEffect(() => { const s = scroller.current; if (s) s.scrollLeft = s.scrollWidth; }, [weeks]);
  const when = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="contrib">
      <div className="contrib-head">
        <span>{hot ? <><b>{hot.count}</b> on {when(hot.date)}</> : days.length ? <><b>{total.toLocaleString()}</b> contributions this year</> : 'loading contributions…'}</span>
        <a href={links.github} target="_blank" rel="noreferrer">@{USERNAME} ↗</a>
      </div>
      <div className="contrib-scroll" ref={scroller} onPointerLeave={() => setHot(null)}>
        <div className="c-cells">
          {(weeks.length ? weeks : Array.from({ length: 53 }, () => Array(7).fill(undefined))).map((w, i) => (
            <div key={i}>{Array.from({ length: 7 }, (_, j) => {
              const d = w[j];
              if (d === undefined) return <i key={j} className="g0 wait" />;
              if (d === null) return <i key={j} className="none" />;
              return <i key={j} className={`g${d.lv}`} onPointerEnter={() => setHot(d)} />;
            })}</div>
          ))}
        </div>
      </div>
      <div className="legend">less {[0, 1, 2, 3, 4].map(l => <i key={l} className={`g${l}`} />)} more</div>
    </div>
  );
}

/* ─── at a glance: the bento ───────────────────────────────────────────────── */
function Glance({ gh }) {
  const own = ownRepos(gh.repos);
  const stars = own.reduce((a, r) => a + r.stargazers_count, 0);
  return (
    <div className="bento">
      <a className="b b-gh" href={links.github} target="_blank" rel="noreferrer">
        <img src="/githubpfp.gif" alt="" />
        <span className="b-cap"><Github size={14} />github <ArrowUpRight size={12} /></span>
      </a>
      <div className="b b-stat"><span className="b-k">&gt;_ pull requests</span><b>53</b></div>
      <a className="b b-md" href={links.medium} target="_blank" rel="noreferrer"><b className="m-logo">M</b><span>medium</span><ArrowUpRight size={12} className="b-arrow" /></a>
      <a className="b b-x" href={links.twitter} target="_blank" rel="noreferrer">
        <img src="/xpfp.gif" alt="" />
        <span className="b-cap"><Twitter size={14} />@divikkk1</span>
      </a>
      <a className="b b-li" href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={24} strokeWidth={1.5} /><span>connect</span><ArrowUpRight size={12} className="b-arrow" /></a>
      <div className="b b-nums">
        <span><b>{gh.user?.public_repos ?? '–'}</b>repos</span>
        <span><b>{gh.user?.followers ?? '–'}</b>followers</span>
        <span><b>{gh.repos ? stars : '–'}</b>stars</span>
      </div>
      <div className="b b-stack"><span className="b-k">stack</span><div>{stack.map(s => <span key={s}>{s}</span>)}</div></div>
      <div className="b b-now"><span className="b-k"><i className="dot" />now</span><b>building AI agents</b><span>OpenLVM + Xeus</span></div>
    </div>
  );
}

/* ─── demos: pick one, it plays, then moves on to the next ─────────────────── */
function Demos({ active, setActive }) {
  const ref = useRef(null);
  const [prog, setProg] = useState(0);
  const p = demos[active];
  useEffect(() => { setProg(0); ref.current?.play().catch(() => {}); }, [active]);
  return (
    <div className="demos">
      <div className="tabs" role="tablist">
        {demos.map((d, j) => (
          <button key={d.name} type="button" role="tab" aria-selected={j === active} className={`tab ${j === active ? 'on' : ''}`} onClick={() => setActive(j)}>
            {d.name}
            {j === active && <i className="tab-bar" style={{ transform: `scaleX(${prog})` }} />}
          </button>
        ))}
      </div>
      <div className="screen">
        <AnimatePresence mode="wait">
          <motion.video key={p.video} ref={ref} src={p.video} muted playsInline autoPlay preload="metadata"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}
            onTimeUpdate={e => setProg(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
            onEnded={() => setActive((active + 1) % demos.length)} />
        </AnimatePresence>
      </div>
      <div className="demo-meta">
        <p><b>{p.name}</b> — {p.desc} <span className="dim">{p.tag}</span></p>
        <span className="demo-links">
          <a className="btn" href={`${links.github}/${p.repo}`} target="_blank" rel="noreferrer"><Github size={13} />source</a>
          {p.link && <a className="btn" href={p.link} target="_blank" rel="noreferrer">live<ArrowUpRight size={13} /></a>}
        </span>
      </div>
    </div>
  );
}

/* ─── every public repo, filterable ────────────────────────────────────────── */
function Projects({ repos, onDemo }) {
  const [lang, setLang] = useState('All');
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);
  // GitHub is the source; if it's rate-limited, fall back to the hand-written list
  const list = useMemo(() => {
    const src = repos?.length ? ownRepos(repos)
      : repos ? curated.map(c => ({ name: c.repo, html_url: `${links.github}/${c.repo}`, stargazers_count: 0 })) : [];
    return src.map(r => {
      const c = byRepo[r.name.toLowerCase()];
      return { name: c?.name || r.name, url: r.html_url, desc: c?.desc || r.description, lang: r.language, stars: r.stargazers_count, pushed: r.pushed_at, demo: c?.video ? demos.indexOf(c) : -1 };
    });
  }, [repos]);
  const langs = useMemo(() => {
    const n = {}; list.forEach(r => r.lang && (n[r.lang] = (n[r.lang] || 0) + 1));
    return ['All', ...Object.keys(n).sort((a, b) => n[b] - n[a]).slice(0, 5)];
  }, [list]);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.filter(r => (lang === 'All' || r.lang === lang) && (!s || `${r.name} ${r.desc || ''}`.toLowerCase().includes(s)));
  }, [list, lang, q]);
  const visible = all || q ? shown : shown.slice(0, 8);

  return (
    <>
      <div className="filters">
        <div className="chips">
          {langs.map(l => (
            <button key={l} type="button" className={`chip ${lang === l ? 'on' : ''}`} onClick={() => setLang(l)}>
              {l !== 'All' && <i className="lang-dot" style={{ background: LANG[l] || 'var(--muted)' }} />}{l}
            </button>
          ))}
        </div>
        <label className="search"><Search size={13} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="search repos" aria-label="Search repositories" /></label>
      </div>
      <div className="repos">
        {(!repos ? Array.from({ length: 4 }, (_, i) => ({ ghost: i })) : visible).map(r => r.ghost != null ? <div key={r.ghost} className="repo ghost" /> : (
          <article key={r.url} className="repo">
            <svg className="repo-ic" viewBox="-14 -16 28 26" aria-hidden="true"><Box className={r.demo >= 0 ? 'solid' : ''} w={14} d={14} h={12} /></svg>
            <div className="repo-main">
              <a className="repo-name" href={r.url} target="_blank" rel="noreferrer">{r.name}<ArrowUpRight size={12} /></a>
              <p>{r.desc || 'No description yet.'}</p>
              <div className="repo-meta">
                {r.lang && <span><i className="lang-dot" style={{ background: LANG[r.lang] || 'var(--muted)' }} />{r.lang}</span>}
                {r.stars > 0 && <span><Star size={11} />{r.stars}</span>}
                {r.pushed && <span>{ago(r.pushed)}</span>}
                {r.demo >= 0 && <button type="button" className="repo-demo" onClick={() => onDemo(r.demo)}><Play size={10} />demo</button>}
              </div>
            </div>
          </article>
        ))}
        {repos && !visible.length && <p className="empty">nothing matches “{q}”.</p>}
      </div>
      {!all && !q && shown.length > 8 && (
        <button type="button" className="btn more" onClick={() => setAll(true)}>all {shown.length} repos<ArrowRight size={13} /></button>
      )}
    </>
  );
}

/* ─── page ──────────────────────────────────────────────────────────────────── */
export default function Iso() {
  const gh = useGitHub();
  const [mode, setMode] = useState(() => localStorage.getItem('iso-mode') || 'light');
  const [demo, setDemo] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => { document.documentElement.dataset.iso = mode; localStorage.setItem('iso-mode', mode); }, [mode]);
  const openDemo = j => { setDemo(j); document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' }); };
  const copy = () => { navigator.clipboard?.writeText(links.email); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  const own = ownRepos(gh.repos);

  return (
    <div className="iso">
      <ShaderBg mode={mode} />
      <Hatch />
      <Nav mode={mode} setMode={setMode} />

      <main className="col">
        <section id="home" className="hero">
          <div className="hero-copy">
            <motion.p className="hey" {...up(0)}>Hey, I'm <span className="wave">👋🏻</span></motion.p>
            <motion.h1 {...up(.08)}>Divik</motion.h1>
            <motion.p className="tagline" {...up(.16)}>I like to build things people actually use</motion.p>
          </div>
          <motion.div className="hero-art" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, ease, delay: .2 }}>
            <DeskScene />
          </motion.div>
        </section>

        <motion.section id="about" className="about" {...up(.24)}>
          <h2>About me</h2>
          <p>Hello, my name is <b>Divik</b> and I'm currently in my 5th semester. I like developing projects in <b>AI</b>, on the web, and partially <b>Web3</b>. I am currently working on <b>AI agents</b> and I believe these days anything is possible with the tools we have at our disposal.</p>
          <p className="fav-k">Some of my favorite current projects are:</p>
          <ul className="favs">
            {curated.map(c => <li key={c.repo}><a href={`${links.github}/${c.repo}`} target="_blank" rel="noreferrer">{c.name}</a> — {c.short}</li>)}
          </ul>
        </motion.section>

        <motion.section className="activity" {...reveal}>
          <Contributions days={gh.days} />
        </motion.section>

        <motion.section {...reveal}>
          <Label prop="glance">at a glance</Label>
          <Glance gh={gh} />
        </motion.section>

        <motion.section id="demos" {...reveal}>
          <Label prop="demos" right={`${demos.length} recorded`}>demos</Label>
          <Demos active={demo} setActive={setDemo} />
        </motion.section>

        <motion.section id="work" {...reveal}>
          <Label prop="work" right={gh.repos ? `${own.length} repos` : null}>work</Label>
          <Projects repos={gh.repos} onDemo={openDemo} />
        </motion.section>

        <motion.section id="reach" {...reveal}>
          <Label prop="reach">reach</Label>
          <h2 className="reach-h">Let's build something.</h2>
          <p className="reach-p">Open to internships, collabs and interesting problems.</p>
          <div className="reach-btns">
            <button type="button" className="btn btn--ink" onClick={copy}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'copied' : links.email}</button>
            <a className="btn" href={`mailto:${links.email}`}><Mail size={13} />write an email</a>
          </div>
        </motion.section>

        <footer className="foot">
          <span>© {new Date().getFullYear()} divik</span>
          <span className="foot-links">
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15} /></a>
            <a href={links.twitter} target="_blank" rel="noreferrer" aria-label="X"><Twitter size={15} /></a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>
            <a href={links.resume} target="_blank" rel="noreferrer" aria-label="Resume"><FileText size={15} /></a>
          </span>
        </footer>
      </main>
    </div>
  );
}
