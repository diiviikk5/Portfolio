import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, FileText, Sun, Moon, ArrowUpRight, ArrowRight, Star, Search, Play, Copy, X, Send, GitCommitHorizontal } from 'lucide-react';
import { loadPiixpal } from 'piixpal/load';
import '../pixel.css';

/* ─── content ───────────────────────────────────────────────────────────────── */
const USERNAME = 'diiviikk5';
const links = {
  github: `https://github.com/${USERNAME}`,
  linkedin: 'https://www.linkedin.com/in/divik-arora-2b091636b/',
  twitter: 'https://x.com/divikkk1',
  medium: 'https://medium.com/@divikstudy100',
  piixpal: 'https://piixpal.dvkk.dev',
  email: 'divikstudy100@gmail.com',
  resume: '/dvkar_resume.pdf',
};
/* hand-written notes; ones with a video are the selected work */
const curated = [
  { name: 'Drift', desc: 'Windows alternative to Screen Studio with cinematic cursor tracking and smooth zooms.', tag: 'Rust · Tauri · React', video: '/drift-showcase-1777051239342.mp4', repo: 'drift', tint: 'lime' },
  { name: 'Xeus', desc: 'A playground for Solana agents: faster and easier, built on the Agent Kit and the Solana.new MCP.', tag: 'TS · Solana · MCP', video: '/xeuz_demo.mp4', repo: 'Xeus', tint: 'lilac' },
  { name: 'OpenLVM', desc: 'Advanced agent testing platform, in progress.', tag: 'Zig · Python · Next.js', video: '/openlvm_demo.mp4', repo: 'OpenLVM', tint: 'coral' },
  { name: 'Stellar v1k', desc: 'GNSS satellite forecasting console powered by ML predictions.', tag: 'React · Three.js · Python', video: '/ztellar_v1k.mp4', repo: 'stellar', link: 'https://stellar-wine.vercel.app/', tint: 'sky' },
  { name: 'Gladiator', desc: 'Gamified algorithm learning through interactive PvP sessions.', tag: 'React · WebSocket', video: '/gladiator_demo.mp4', repo: 'gladiator', link: 'https://gladiator-smoky.vercel.app/', tint: 'lime' },
  { name: 'Swasthya', desc: 'Holistic wellness platform with an integrated AI symptom checker.', tag: 'React · Node · MongoDB', video: '/zwazthya_arogyam_demo.mp4', repo: 'swasthya', link: 'https://swasthya-gold.vercel.app/', tint: 'coral' },
  { name: 'Piixpal', desc: 'Pixel characters that live on your website. The little guys on this page are all Piixpal.', repo: 'piixpal', link: 'https://piixpal.dvkk.dev' },
  { name: 'Nectar', desc: 'Turn content into agent skills.', repo: 'Nectar' },
  { name: 'gloader', desc: 'A generic attempt towards a game launcher, building a better one.', repo: 'gloader' },
  { name: 'dvkcli', desc: 'Personal pocket GPT (Qwen!).', repo: 'dvkcli' },
  { name: 'NextPlayGames', desc: 'I love games, so a game tracker.', repo: 'Nextplay' },
];
const work = curated.filter(c => c.video);
const byRepo = Object.fromEntries(curated.map(c => [c.repo.toLowerCase(), c]));
const stack = ['Rust', 'Go', 'TypeScript', 'Python', 'C++', 'Solidity', 'Zig', 'React', 'Next.js', 'Node.js', 'Tauri', 'Three.js', 'Solana', 'MongoDB'];
const LANG = { TypeScript: '#3178c6', JavaScript: '#e8c931', Python: '#3572a5', Rust: '#dea584', Go: '#00add8', 'C++': '#f34b7d', C: '#555555', Solidity: '#aa6746', HTML: '#e34c26', CSS: '#663399', Zig: '#ec915c', Shell: '#89e051', 'Jupyter Notebook': '#da5b0b', Java: '#b07219', Svelte: '#ff3e00', Vue: '#41b883' };
const ease = [0.16, 1, 0.3, 1];
const up = (delay = 0) => ({ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: .55, ease, delay } });
const reveal = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: .55, ease } };

/* ─── data ──────────────────────────────────────────────────────────────────── */
function useGitHub() {
  const [s, set] = useState({ user: null, repos: null, days: [], pushes: null });
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
    get('px-user', `https://api.github.com/users/${USERNAME}`).then(user => set(p => ({ ...p, user })));
    get('px-days', `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`).then(d => set(p => ({ ...p, days: d?.contributions || [] })));
    get('px-repos', `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`).then(async repos => {
      repos = Array.isArray(repos) ? repos : [];
      set(p => ({ ...p, repos }));
      // the events feed no longer carries commit messages, so read the newest commit of the latest-pushed repos
      const top = ownRepos(repos).slice(0, 4);
      const heads = await Promise.all(top.map(r => get(`px-c-${r.name}`, `https://api.github.com/repos/${USERNAME}/${r.name}/commits?per_page=1`)));
      const pushes = heads.map((c, i) => c?.[0] && { repo: top[i].name, msg: c[0].commit.message.split('\n')[0], at: c[0].commit.author?.date || top[i].pushed_at, sha: c[0].sha }).filter(Boolean);
      set(p => ({ ...p, pushes }));
    });
  }, []);
  return s;
}
const ownRepos = repos => (repos || []).filter(r => !r.fork && r.name.toLowerCase() !== USERNAME);
const ago = iso => {
  const m = (Date.now() - new Date(iso)) / 6e4;
  if (m < 60) return `${Math.max(1, Math.floor(m))}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  const d = m / 1440;
  if (d < 30) return `${Math.floor(d)}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
};

/* Piixpal loads in the browser only */
function usePiixpal() {
  const [P, setP] = useState(null);
  useEffect(() => { loadPiixpal().then(setP); }, []);
  return P;
}

/* Piixpal elements read plain attributes when they connect. React 19 would try to set some of
   them as properties (piix-type's `text` is a getter), so make the element ourselves and slot
   it in right where this component sits, inside the real parent. */
function Piix({ tag = 'piix-pal', elRef, ...attrs }) {
  const ph = useRef(null);
  const key = JSON.stringify(attrs);
  useLayoutEffect(() => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => v != null && v !== false && el.setAttribute(k === 'className' ? 'class' : k, v === true ? '' : String(v)));
    ph.current.parentNode.insertBefore(el, ph.current);
    if (elRef) elRef.current = el;
    return () => { el.remove(); if (elRef) elRef.current = null; };
  }, [tag, key]);
  return <span ref={ph} hidden />;
}

/* ─── bits ──────────────────────────────────────────────────────────────────── */
const Label = ({ n, children, right }) => (
  <div className="label"><span className="label-n">{n}</span><h2>{children}</h2><i />{right && <span className="label-r">{right}</span>}</div>
);

function Nav({ onPlay, dark, onToggle }) {
  const items = [['About', '#about'], ['Work', '#work'], ['Activity', '#activity'], ['Contact', '#contact']];
  const [active, setActive] = useState('');
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive('#' + e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    items.forEach(([, h]) => { const el = document.querySelector(h); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <motion.nav className="nav" initial={{ opacity: 0, y: -12, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} transition={{ duration: .5, ease, delay: .1 }}>
      <a href="#top" className="nav-logo" aria-label="Back to top">dvk</a>
      <span className="nav-links">
        {items.map(([n, h]) => (
          <a key={h} href={h} className={active === h ? 'on' : ''}>
            {active === h && <motion.span layoutId="nav-hl" className="nav-hl" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span>{n}</span>
          </a>
        ))}
      </span>
      <button type="button" className="mode-btn" onClick={onToggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>{dark ? <Sun size={15} /> : <Moon size={15} />}</button>
      <button type="button" className="nav-play" onClick={onPlay} title="Play this page as a platformer"><Play size={12} fill="currentColor" /><span>Play</span></button>
    </motion.nav>
  );
}

/* the usual GitHub grid, in green pixels */
function Contributions({ days }) {
  const [hot, setHot] = useState(null);
  const scroller = useRef(null);
  const { weeks, total, best, active } = useMemo(() => {
    if (!days.length) return { weeks: [], total: 0, best: 0, active: 0 };
    const nz = days.map(d => d.count).filter(Boolean).sort((a, b) => a - b);
    const q = k => nz[Math.floor((nz.length - 1) * k)] || 1;
    const lv = c => (!c ? 0 : c <= q(.33) ? 1 : c <= q(.66) ? 2 : c <= q(.9) ? 3 : 4);
    const pad = new Date(days[0].date + 'T00:00:00Z').getUTCDay();
    const cells = [...Array(pad).fill(null), ...days.map(d => ({ ...d, lv: lv(d.count) }))];
    const weeks = []; for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    let best = 0, run = 0; days.forEach(d => { run = d.count ? run + 1 : 0; best = Math.max(best, run); });
    return { weeks, total: days.reduce((a, d) => a + d.count, 0), best, active: nz.length };
  }, [days]);
  useEffect(() => { const s = scroller.current; if (s) s.scrollLeft = s.scrollWidth; }, [weeks]);
  const when = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="px-card contrib">
      <div className="contrib-head">
        <span>{hot ? <><b>{hot.count}</b> on {when(hot.date)}</> : days.length ? <><b>{total.toLocaleString()}</b> contributions in the last year</> : 'loading contributions…'}</span>
        <a href={links.github} target="_blank" rel="noreferrer">@{USERNAME} ↗</a>
      </div>
      <div className="contrib-scroll" ref={scroller} onPointerLeave={() => setHot(null)}>
        <div className="cells">
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
      <div className="contrib-foot">
        <span className="contrib-stats"><span><b>{active || '–'}</b> active days</span><span><b>{best || '–'}</b> day streak</span></span>
        <span className="legend">less {[0, 1, 2, 3, 4].map(l => <i key={l} className={`g${l}`} />)} more</span>
      </div>
    </div>
  );
}

/* selected work: video cards that play when hovered, and open in a player */
function WorkCard({ p, onOpen }) {
  const ref = useRef(null);
  return (
    <motion.button type="button" className={`px-card work t-${p.tint}`} onClick={onOpen} {...reveal}
      onPointerEnter={() => ref.current?.play().catch(() => {})} onPointerLeave={() => ref.current?.pause()}>
      <span className="work-shot"><video ref={ref} src={p.video} muted loop playsInline preload="metadata" /><span className="work-play"><Play size={14} fill="currentColor" /></span></span>
      <span className="work-body"><b>{p.name}</b><span>{p.desc}</span><small>{p.tag}</small></span>
    </motion.button>
  );
}
function Player({ index, setIndex }) {
  const p = index == null ? null : work[index];
  useEffect(() => {
    if (index == null) return;
    const k = e => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') setIndex((index + 1) % work.length);
      if (e.key === 'ArrowLeft') setIndex((index - 1 + work.length) % work.length);
    };
    addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [index, setIndex]);
  return (
    <AnimatePresence>
      {p && (
        <motion.div className="player" role="dialog" aria-modal="true" aria-label={`${p.name} demo`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIndex(null)}>
          <motion.div className="px-card player-in" initial={{ y: 24, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, opacity: 0 }} transition={{ duration: .35, ease }} onClick={e => e.stopPropagation()}>
            <div className="player-bar">
              <span className="player-tabs">{work.map((w, j) => <button key={w.name} type="button" className={j === index ? 'on' : ''} onClick={() => setIndex(j)}>{w.name}</button>)}</span>
              <button type="button" className="icon-btn" onClick={() => setIndex(null)} aria-label="Close"><X size={16} /></button>
            </div>
            <div className="player-screen"><video key={p.video} src={p.video} autoPlay muted controls playsInline /></div>
            <div className="player-meta">
              <p><b>{p.name}</b> — {p.desc} <span className="dim">{p.tag}</span></p>
              <span className="btns">
                <a className="btn" href={`${links.github}/${p.repo}`} target="_blank" rel="noreferrer"><Github size={13} />Source</a>
                {p.link && <a className="btn btn--ink" href={p.link} target="_blank" rel="noreferrer">Live<ArrowUpRight size={13} /></a>}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* every public repo, as a compact filterable list */
function Repos({ repos }) {
  const [lang, setLang] = useState('All');
  const [q, setQ] = useState('');
  const [all, setAll] = useState(false);
  const list = useMemo(() => {
    const src = repos?.length ? ownRepos(repos)
      : repos ? curated.map(c => ({ name: c.repo, html_url: `${links.github}/${c.repo}`, stargazers_count: 0 })) : [];
    return src.map(r => {
      const c = byRepo[r.name.toLowerCase()];
      return { name: c?.name || r.name, url: r.html_url, desc: c?.desc || r.description, lang: r.language, stars: r.stargazers_count, pushed: r.pushed_at };
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
  const visible = all || q ? shown : shown.slice(0, 10);

  return (
    <div className="px-card repos">
      <div className="filters">
        <div className="chips">
          {langs.map(l => (
            <button key={l} type="button" className={`chip ${lang === l ? 'on' : ''}`} onClick={() => setLang(l)}>
              {l !== 'All' && <i className="sq" style={{ background: LANG[l] || 'var(--muted)' }} />}{l}
            </button>
          ))}
        </div>
        <label className="search"><Search size={13} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="search repos" aria-label="Search repositories" /></label>
      </div>
      <ul className="repo-list">
        {!repos && Array.from({ length: 5 }, (_, i) => <li key={i} className="ghost" />)}
        {visible.map(r => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noreferrer">
              <i className="sq" style={{ background: LANG[r.lang] || 'var(--line-2)' }} />
              <b>{r.name}</b>
              <span className="repo-desc">{r.desc || 'No description yet.'}</span>
              <span className="repo-meta">{r.stars > 0 && <span><Star size={11} />{r.stars}</span>}{r.pushed && <span>{ago(r.pushed)}</span>}</span>
              <ArrowUpRight size={13} className="repo-go" />
            </a>
          </li>
        ))}
        {repos && !visible.length && <li className="empty">nothing matches “{q}”.</li>}
      </ul>
      {!all && !q && shown.length > 10 && <button type="button" className="btn more" onClick={() => setAll(true)}>all {shown.length} repos<ArrowRight size={13} /></button>}
    </div>
  );
}

/* ─── page ──────────────────────────────────────────────────────────────────── */
export default function Pixel() {
  const gh = useGitHub();
  const P = usePiixpal();
  const [open, setOpen] = useState(null);
  const [msg, setMsg] = useState({ name: '', text: '' });
  const pix = useRef(null);
  const own = ownRepos(gh.repos);
  const stars = own.reduce((a, r) => a + r.stargazers_count, 0);

  useEffect(() => { document.documentElement.dataset.px = ''; document.title = 'Divik Arora'; }, []);
  // <html class="dark"> is the source of truth: the bulb's pull-chain and the nav button both flip it
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const html = document.documentElement;
    const mo = new MutationObserver(() => { const d = html.classList.contains('dark'); setDark(d); localStorage.setItem('px-dark', d ? '1' : '0'); });
    mo.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => mo.disconnect();
  }, []);
  const toggleDark = () => document.documentElement.classList.toggle('dark');
  const toast = t => (P?.toast ? P.toast(t) : null);
  const copy = () => navigator.clipboard?.writeText(links.email).then(() => toast('Email copied!'), () => toast(links.email));
  const play = () => { pix.current?.poke?.(); };
  const send = e => {
    e.preventDefault();
    toast('Opening your mail app…');
    location.href = `mailto:${links.email}?subject=${encodeURIComponent(`Hey Divik, it's ${msg.name || 'someone'}`)}&body=${encodeURIComponent(msg.text)}`;
  };

  return (
    <div className="px">
      <Nav onPlay={play} dark={dark} onToggle={toggleDark} />

      <main className="col" id="top">
        {/* hero */}
        <section className="hero">
          <motion.p className="hey" {...up(0)}>
            Hey, I'm
          </motion.p>
          <h1 className="name" aria-label="Divik">
            {P ? <Piix tag="piix-type" text="DIVIK" rows="16" cell="9" color={dark ? '#f3efe6' : '#1d1b18'} shade={dark ? '#3a3631' : '#d9d4c9'} depth="2" gap="0.12" weight="800" /> : <span className="name-fallback">DIVIK</span>}
            {P && <Piix pal="bitbug" on="piix-type" box=".name" />}
          </h1>
          <motion.p className="tagline" {...up(.15)}>I like to build things people actually use</motion.p>
          <motion.div className="btns" {...up(.3)}>
            <a className="btn btn--ink" href="#work">See my work<ArrowRight size={13} /></a>
            <a className="btn" href={links.resume} target="_blank" rel="noreferrer"><FileText size={13} />Resume</a>
            <button type="button" className="btn play-perch" onClick={play}><Play size={12} fill="currentColor" />Play this page</button>
          </motion.div>
          {P && <Piix elRef={pix} pal="pix" on=".play-perch" />}
          {/* pull the chain for dark mode; it has to live inside the hero, not point at it with `on` */}
          {P && <Piix pal="bulb" at="0.96" length="110" />}
        </section>

        {/* about */}
        <motion.section id="about" {...reveal}>
          <Label n="01">About me</Label>
          <div className="about">
            <div className="about-text">
              <h3 className="about-h">Hello there</h3>
              <p>I'm <b>Divik</b>, a full-stack developer in my 5th semester. I like building in <b>AI</b>, on the web, and partially <b>Web3</b>. Right now that means <b>AI agents</b>, and I believe these days anything is possible with the tools we have at our disposal.</p>
              <p>I also made <a href={links.piixpal} target="_blank" rel="noreferrer">Piixpal</a>, so everything that moves on this page is mine too. Off the clock I play a lot of games, which is why half my side projects are launchers and trackers.</p>
              <div className="stack">{stack.map(s => <span key={s} className="chip chip--static">{s}</span>)}</div>
            </div>
            <div className="socials">
              <a className="px-card soc soc-img" href={links.github} target="_blank" rel="noreferrer"><img src="/githubpfp.gif" alt="" /><span className="soc-cap"><Github size={13} />github</span></a>
              <a className="px-card soc soc-img" href={links.twitter} target="_blank" rel="noreferrer"><img src="/xpfp.gif" alt="" /><span className="soc-cap"><Twitter size={13} />@divikkk1</span></a>
              <a className="px-card soc" href={links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={20} strokeWidth={1.6} /><span>linkedin</span></a>
              <a className="px-card soc" href={links.medium} target="_blank" rel="noreferrer"><b className="m-logo">M</b><span>medium</span></a>
            </div>
          </div>
        </motion.section>

        {/* now */}
        <motion.section className="now" {...reveal}>
          <div className="px-card now-term">
            <span className="now-k"><i className="dot" />right now</span>
            <p>Building <b>OpenLVM</b> and shipping <b>Xeus</b>. Taking internships, collabs and interesting problems.</p>
          </div>
          <div className="px-card now-push">
            <span className="now-k"><GitCommitHorizontal size={13} />latest pushes</span>
            <ul>
              {!gh.pushes && <li className="dim">loading…</li>}
              {gh.pushes?.length === 0 && <li className="dim">nothing public this week</li>}
              {gh.pushes?.map(c => (
                <li key={c.sha}><a href={`${links.github}/${c.repo}/commit/${c.sha}`} target="_blank" rel="noreferrer"><b>{c.repo}</b><span>{c.msg}</span><small>{ago(c.at)}</small></a></li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* selected work */}
        <section id="work">
          <Label n="02" right="tap to watch">Selected work</Label>
          <div className="work-grid">{work.map((p, i) => <WorkCard key={p.name} p={p} onOpen={() => setOpen(i)} />)}</div>
          {P && <Piix pal="lurk" on=".work-grid .work:nth-child(2)" />}
        </section>

        {/* activity */}
        <motion.section id="activity" {...reveal}>
          <Label n="03" right={gh.repos ? `${own.length} repos · ${stars} stars` : null}>Activity</Label>
          <Contributions days={gh.days} />
          <Repos repos={gh.repos} />
        </motion.section>

        {/* contact */}
        <motion.section id="contact" {...reveal}>
          <Label n="04">Say hi</Label>
          <div className="contact">
            <div className="contact-text">
              <h3>Let's build something.</h3>
              <p>Drop a line here, or grab my email. I usually reply within a day.</p>
              <button type="button" className="btn" onClick={copy}><Copy size={13} />{links.email}</button>
            </div>
            <form className="px-card form" onSubmit={send}>
              <label>name<input value={msg.name} onChange={e => setMsg(m => ({ ...m, name: e.target.value }))} placeholder="your name" /></label>
              <label>message<textarea id="msg" value={msg.text} onChange={e => setMsg(m => ({ ...m, text: e.target.value }))} placeholder="what's up?" rows={4} required /></label>
              <button type="submit" className="btn btn--ink"><Send size={13} />Send to Divik</button>
              {P && <Piix pal="peeper" on="#msg" />}
            </form>
          </div>
        </motion.section>

        <footer className="foot" id="foot">
          <span>© {new Date().getFullYear()} Divik Arora · pals by <a href={links.piixpal} target="_blank" rel="noreferrer">piixpal</a></span>
          <span className="foot-links">
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={15} /></a>
            <a href={links.twitter} target="_blank" rel="noreferrer" aria-label="X"><Twitter size={15} /></a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={15} /></a>
            <a href={`mailto:${links.email}`} aria-label="Email"><Mail size={15} /></a>
          </span>
          {P && <Piix pal="boing" />}
        </footer>
      </main>

      {P && <>
        <Piix pal="tabby" />
      </>}
      <Player index={open} setIndex={setOpen} />
    </div>
  );
}
