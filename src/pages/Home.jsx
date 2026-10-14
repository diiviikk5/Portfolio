import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight, FileText, Sun, Moon, Home as HomeIcon, Send } from 'lucide-react';
import PixelAvatar from '@/components/PixelAvatar';
import '../home.css';

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
const building = [
  { name: 'Drift', desc: 'Windows Alternative to Screen Studio with cinematic cursor tracking and smooth zooms.', tag: 'Rust · Tauri · React', video: '/drift-showcase-1777051239342.mp4', github: 'https://github.com/diiviikk5/drift' },
  { name: 'Xeus', desc: 'A playground for Solana agents but different, faster, and easier. Making the ecosystem of AI x Solana more useful and effective using the Agent Kit and Solana.new MCP.', tag: 'TS · Solana · MCP', video: '/xeuz_demo.mp4', github: 'https://github.com/diiviikk5/Xeus' },
  { name: 'OpenLVM', desc: 'Advanced agent testing platform.', tag: 'In progress', video: '/openlvm_demo.mp4', github: 'https://github.com/diiviikk5/OpenLVM' },
  { name: 'Stellar v1k', desc: 'GNSS satellite forecasting console powered by ML predictions.', tag: 'React · Three.js · Python', video: '/ztellar_v1k.mp4', github: 'https://github.com/diiviikk5/stellar', link: 'https://stellar-wine.vercel.app/' },
  { name: 'Gladiator', desc: 'Gamified algorithm learning through interactive PvP sessions.', tag: 'React · WebSocket', video: '/gladiator_demo.mp4', github: 'https://github.com/diiviikk5/gladiator', link: 'https://gladiator-smoky.vercel.app/' },
  { name: 'Swasthya', desc: 'Holistic wellness platform with an integrated AI symptom checker.', tag: 'React · Node · MongoDB', video: '/zwazthya_arogyam_demo.mp4', github: 'https://github.com/diiviikk5/swasthya', link: 'https://swasthya-gold.vercel.app/' },
  { name: 'Nectar', desc: 'Turn Content into Agent Skills.', tag: 'Agents', github: 'https://github.com/diiviikk5/Nectar' },
  { name: 'gloader', desc: 'A generic attempt towards a game launcher, building a better one.', tag: 'Desktop', github: 'https://github.com/diiviikk5/gloader' },
  { name: 'dvkcli', desc: 'Personal Pocket GPT (Qwen!).', tag: 'CLI', github: 'https://github.com/diiviikk5/dvkcli' },
  { name: 'NextPlayGames', desc: 'I love games, so a game tracker.', tag: 'Web', github: 'https://github.com/diiviikk5/Nextplay' },
];
/* [name, simpleicons slug] */
const stackRows = [
  [['Rust', 'rust'], ['Go', 'go'], ['TypeScript', 'typescript'], ['JavaScript', 'javascript'], ['Python', 'python'], ['C++', 'cplusplus'], ['Solidity', 'solidity']],
  [['React', 'react'], ['Next.js', 'nextdotjs'], ['TailwindCSS', 'tailwindcss'], ['Node.js', 'nodedotjs'], ['Tauri', 'tauri'], ['Three.js', 'threedotjs'], ['Vite', 'vite']],
  [['Solana', 'solana'], ['MongoDB', 'mongodb'], ['Zig', 'zig'], ['Git', 'git'], ['Linux', 'linux'], ['Vercel', 'vercel'], ['Figma', 'figma']],
];
const blogs = [
  { title: 'How I think about building and shipping', date: 'Apr 24, 2026', read: 'X thread', desc: 'A thread on how I pick what to build, ship it fast, and keep going.', link: 'https://x.com/divikkk1/status/2014030171582713983?s=20' },
];

/* ─── motion ────────────────────────────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1];
const Reveal = ({ children, delay = 0, className, as = 'div', id }) => {
  const M = motion[as];
  return <M id={id} className={className} initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.65, ease, delay }}>{children}</M>;
};
const Count = ({ to }) => {
  const ref = useRef(null), inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => { if (!inView || to == null) return; const c = animate(0, to, { duration: 1.2, ease, onUpdate: x => setV(Math.round(x)) }); return () => c.stop(); }, [inView, to]);
  return <span ref={ref}>{to == null ? '–' : v.toLocaleString()}</span>;
};
const SecHead = ({ pill, title, children }) => (
  <Reveal className="sec-head">
    <span className="pill">{pill}</span>
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </Reveal>
);

/* ─── live GitHub ───────────────────────────────────────────────────────────── */
function useGitHub() {
  const [s, set] = useState({ user: null, days: [], total: null });
  useEffect(() => {
    const j = u => fetch(u).then(r => (r.ok ? r.json() : null)).catch(() => null);
    j(`https://api.github.com/users/${USERNAME}`).then(user => set(p => ({ ...p, user })));
    j(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).then(d => d && set(p => ({ ...p, days: d.contributions || [], total: d.total?.lastYear })));
  }, []);
  return s;
}
function MiniGraph({ days }) {
  const recent = days.slice(-16 * 7);
  const nz = recent.map(d => d.count).filter(Boolean).sort((a, b) => a - b);
  const q = k => nz[Math.floor((nz.length - 1) * k)] || 1;
  const lv = c => (!c ? 0 : c <= q(.33) ? 1 : c <= q(.66) ? 2 : c <= q(.9) ? 3 : 4);
  const weeks = []; for (let i = 0; i < recent.length; i += 7) weeks.push(recent.slice(i, i + 7));
  return (
    <div className="mini-graph" aria-hidden="true">
      {weeks.map((w, i) => <div key={i}>{w.map(d => <motion.i key={d.date} className={`g${lv(d.count)}`} title={`${d.date}: ${d.count}`}
        initial={{ opacity: 0, scale: .4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.025 }} />)}</div>)}
    </div>
  );
}

/* ─── nav ───────────────────────────────────────────────────────────────────── */
const NAV = [['About', '#about'], ['Projects', '#projects'], ['Blogs', '#blogs'], ['Reach', '#reach']];
function Nav({ light, setLight }) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const els = NAV.map(([, h]) => document.querySelector(h)).filter(Boolean);
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive('#' + e.target.id)), { rootMargin: '-40% 0px -55% 0px' });
    els.forEach(e => io.observe(e)); return () => io.disconnect();
  }, []);
  return (
    <motion.nav className="nav" initial={{ y: -24, opacity: 0, x: '-50%' }} animate={{ y: 0, opacity: 1, x: '-50%' }} transition={{ duration: 0.6, ease }}>
      <a href="#top" className="nav-ic" aria-label="Top"><HomeIcon size={15} /></a>
      {NAV.map(([n, h]) => (
        <a key={h} href={h} className={`nav-a ${active === h ? 'on' : ''}`}>
          {active === h && <motion.span layoutId="navhl" className="nav-hl" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
          <span>{n}</span>
        </a>
      ))}
      <span className="nav-sep" />
      <button type="button" className="nav-ic" onClick={() => setLight(l => !l)} aria-label="Toggle theme">{light ? <Moon size={15} /> : <Sun size={15} />}</button>
    </motion.nav>
  );
}

/* ─── a row in the building list: rows with a demo open it inline ──────────── */
function Thumb({ src, playing }) {
  const ref = useRef(null), inView = useInView(ref);
  useEffect(() => { const v = ref.current; if (v) (inView && playing) ? v.play().catch(() => {}) : v.pause(); }, [inView, playing]);
  return <video ref={ref} src={src} muted loop playsInline preload="metadata" />;
}
function Row({ p, i, open, onToggle }) {
  const body = (
    <>
      <span className="mono-av">{p.name[0].toUpperCase()}</span>
      <span className="bl-main"><b>{p.name} {p.video ? <span className={`bl-chev ${open ? 'on' : ''}`}>›</span> : <ArrowUpRight size={12} />}</b><span>{p.desc}</span></span>
      <span className="bl-tag">{p.tag}</span>
      {p.video ? <span className="bl-thumb"><Thumb src={p.video} playing={!open} /><i className="bl-live">demo</i></span> : <span className="bl-thumb bl-thumb--none"><Github size={15} /></span>}
    </>
  );
  return (
    <Reveal as="li" delay={Math.min(i * 0.04, 0.3)} className={open ? 'is-open' : ''}>
      {p.video
        ? <button type="button" className="bl-row" onClick={onToggle} aria-expanded={open}>{body}</button>
        : <a className="bl-row" href={p.github} target="_blank" rel="noreferrer">{body}</a>}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="bl-open" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }}>
            <div className="bl-open-in">
              <div className="bl-video"><Thumb src={p.video} playing /></div>
              <div className="proj-btns">
                {p.github && <a href={p.github} target="_blank" rel="noreferrer"><Github size={13} />Source</a>}
                {p.link && <a href={p.link} target="_blank" rel="noreferrer"><ArrowUpRight size={13} />Website</a>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}

/* ─── page ──────────────────────────────────────────────────────────────────── */
export default function Home() {
  const gh = useGitHub();
  const [light, setLight] = useState(() => typeof window !== 'undefined' && localStorage.getItem('portfolio-mode') === 'light');
  const [time, setTime] = useState('');
  const [msg, setMsg] = useState({ name: '', text: '' });
  const [openRow, setOpenRow] = useState('Drift');
  useEffect(() => { document.documentElement.dataset.mode = light ? 'light' : 'dark'; localStorage.setItem('portfolio-mode', light ? 'light' : 'dark'); }, [light]);
  useEffect(() => { const t = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase()); t(); const id = setInterval(t, 15000); return () => clearInterval(id); }, []);
  const send = e => {
    e.preventDefault();
    location.href = `mailto:${links.email}?subject=${encodeURIComponent(`Hey Divik, it's ${msg.name || 'someone'}`)}&body=${encodeURIComponent(msg.text)}`;
  };

  return (
    <div className="site" id="top">
      <div className="beam" aria-hidden="true" />
      <Nav light={light} setLight={setLight} />

      <main className="col">
        {/* hero */}
        <section className="hero">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.7, ease, delay: 0.15 }}>
              Hi, I'm <span className="name-pix">Divik</span> <span className="wave">👋🏻</span>
            </motion.h1>
            <motion.p className="hero-sub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.3 }}>I like to build things people actually use.</motion.p>
            <motion.div className="chips" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.45 }}>
              <span className="chip"><span className="dot" />{time || 'now'}</span>
              <span className="chip">🎓 5th semester</span>
              <a className="chip chip--hi" href={links.resume} target="_blank" rel="noreferrer">✨ Resume</a>
            </motion.div>
          </div>
          <motion.a href={links.github} target="_blank" rel="noreferrer" className="avatar" initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}>
            <PixelAvatar src="/githubpfp.png" alt="Divik" size={112} />
            <span className="avatar-tag">@{USERNAME}</span>
          </motion.a>
        </section>

        {/* about */}
        <Reveal as="section" id="about" className="about">
          <h2 className="h-k">About <span>•</span> <em>約</em></h2>
          <p>Hello, my name is <b>Divik</b> and I'm currently in my 5th semester. I like developing projects in <b>AI</b>, on the web, and partially <b>Web3</b>. I am currently working on <b>AI agents</b> and I believe these days anything is possible with the tools we have at our disposal.</p>
        </Reveal>

        {/* stack */}
        <Reveal className="stack">
          {stackRows.map((row, r) => (
            <div key={r} className={`stack-row ${r % 2 ? 'rev' : ''}`}>
              <div className="stack-track" style={{ animationDuration: `${34 + r * 6}s` }}>
                {[...row, ...row, ...row].map(([n, slug], i) => (
                  <span key={i} className="tech"><img src={`https://cdn.simpleicons.org/${slug}`} alt="" loading="lazy" />{n}</span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        {/* bento */}
        <section className="bento">
          <Reveal className="b b-gh"><a href={links.github} target="_blank" rel="noreferrer">
            <img src="/githubpfp.gif" alt="" className="b-bg" />
            <div className="b-gh-left"><Github size={18} /><b>GitHub <em>実</em></b><span>@{USERNAME}</span></div>
            <div className="b-gh-right">
              <MiniGraph days={gh.days} />
              <div className="b-stats">
                <span><i className="c-r" />Repos: <b><Count to={gh.user?.public_repos} /></b></span>
                <span><i className="c-w" />Followers: <b><Count to={gh.user?.followers} /></b></span>
                <span><i className="c-b" />PRs: <b><Count to={53} /></b></span>
                <span><i className="c-g" />Commits: <b><Count to={gh.total} /></b></span>
              </div>
            </div>
          </a></Reveal>
          <Reveal delay={0.05} className="b b-x"><a href={links.twitter} target="_blank" rel="noreferrer">
            <img src="/xpfp.gif" alt="" className="b-bg" /><span className="b-cap"><Twitter size={14} />@divikkk1</span><ArrowUpRight size={14} className="b-arrow" />
          </a></Reveal>
          <Reveal delay={0.1} className="b b-li"><a href={links.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={26} /><span>(connect;)</span>
          </a></Reveal>
          <Reveal delay={0.15} className="b b-md"><a href={links.medium} target="_blank" rel="noreferrer">
            <b className="m-logo">M</b><span>(long reads)</span>
          </a></Reveal>
          <Reveal delay={0.2} className="b b-now">
            <span className="b-k"><span className="dot" />now</span><b>Building</b><span>AI agents & dApps</span>
          </Reveal>
          <Reveal delay={0.25} className="b b-exp">
            <span className="b-k">exploring</span><b>Web3 × AI</b><span>& decentralized infra</span>
          </Reveal>
        </section>

        {/* building: every project, demos inline */}
        <section className="building" id="projects">
          <Reveal as="h2" className="h-plain">stuff i'm building right now <span className="h-sub">tap one to watch the demo</span></Reveal>
          <ul>{building.map((p, i) => <Row key={p.name} p={p} i={i} open={openRow === p.name} onToggle={() => setOpenRow(o => (o === p.name ? null : p.name))} />)}</ul>
        </section>

        {/* blogs */}
        <section id="blogs">
          <SecHead pill="Fresh Drops ✍️" title="Thinking out loud about building and shipping">
            I mostly write in threads and the occasional long read. Here's the latest, and more on <a href={links.twitter} target="_blank" rel="noreferrer">X</a> and <a href={links.medium} target="_blank" rel="noreferrer">Medium</a>.
          </SecHead>
          <div className="posts">
            {blogs.map(b => (
              <Reveal key={b.title}><a className="post" href={b.link} target="_blank" rel="noreferrer">
                <span className="post-ic"><Twitter size={16} /></span>
                <span className="post-main"><b>{b.title}</b><small>{b.date}</small><span>{b.desc}</span></span>
                <span className="post-read">{b.read}</span>
              </a></Reveal>
            ))}
          </div>
        </section>

        {/* reach */}
        <section id="reach">
          <SecHead pill="Reach 📬" title="Let's build something.">
            Drop a line below, or find me on <a href={links.twitter} target="_blank" rel="noreferrer">X</a>, <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> or <a href={`mailto:${links.email}`}>email</a>.
          </SecHead>
          <Reveal as="form" className="reach" onSubmit={send}>
            <input value={msg.name} onChange={e => setMsg(m => ({ ...m, name: e.target.value }))} placeholder="ur name" aria-label="Your name" />
            <textarea value={msg.text} onChange={e => setMsg(m => ({ ...m, text: e.target.value }))} placeholder="what's up?" aria-label="Message" rows={4} required />
            <button type="submit"><Send size={14} />Send message to Divik</button>
          </Reveal>
        </section>

        <footer className="foot">
          <span>© {new Date().getFullYear()} Divik</span>
          <span className="foot-links">
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15} /></a>
            <a href={links.twitter} target="_blank" rel="noreferrer" aria-label="X"><Twitter size={15} /></a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>
            <a href={`mailto:${links.email}`} aria-label="Email"><Mail size={15} /></a>
            <a href={links.resume} target="_blank" rel="noreferrer" aria-label="Resume"><FileText size={15} /></a>
          </span>
        </footer>
      </main>
    </div>
  );
}
