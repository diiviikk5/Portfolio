import React, { useEffect, useMemo, useState } from 'react';

/* A minimal, text-only portfolio that is always live: your GitHub activity, streaks and latest
 * push are fetched on load; the name and the clock run on Piixpal's split-flap board. */

const USER = 'diiviikk5';
const TZ = 'Asia/Kolkata';

const work = [
  { name: 'Drift', what: 'Screen Studio for Windows: cinematic cursor tracking and smooth auto-zoom.', stack: 'Rust · Tauri · React', href: 'https://github.com/diiviikk5/drift' },
  { name: 'Piixpal', what: 'Pixel pals and a GPU pixel UI library for the web.', stack: 'JS · WebGL', href: 'https://piixpal.dvkk.dev' },
  { name: 'Xeus', what: 'A faster, simpler playground for Solana agents, on Agent Kit and MCP.', stack: 'TS · Solana · MCP', href: 'https://github.com/diiviikk5/Xeus' },
  { name: 'OpenLVM', what: 'A testing platform for AI agents.', stack: 'Zig · Python · Next.js', href: 'https://github.com/diiviikk5/OpenLVM' },
  { name: 'Stellar v1k', what: 'GNSS satellite forecasting console, powered by ML predictions.', stack: 'React · Three.js · Python', href: 'https://stellar-wine.vercel.app/' },
  { name: 'Gladiator', what: 'Learn algorithms by fighting other people in PvP rounds.', stack: 'React · WebSocket · Node', href: 'https://gladiator-smoky.vercel.app/' },
  { name: 'Swasthya', what: 'A wellness platform with an AI symptom checker.', stack: 'React · Node · MongoDB', href: 'https://swasthya-gold.vercel.app/' },
];
const also = [
  ['Nectar', 'turn content into agent skills', 'https://github.com/diiviikk5/Nectar'],
  ['gloader', 'a better game launcher', 'https://github.com/diiviikk5/gloader'],
  ['dvkcli', 'a pocket GPT in the terminal', 'https://github.com/diiviikk5/dvkcli'],
  ['NextPlay', 'a tracker for upcoming games', 'https://www.nextplaygame.me/'],
];
const writing = [
  { title: 'How I think about building and shipping', where: 'X thread', date: 'Apr 2026', href: 'https://x.com/divikkk1/status/2014030171582713983?s=20' },
];

const ago = d => {
  const s = Math.max(1, (Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${Math.floor(s)}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};
const short = r => r.replace(`${USER}/`, '');

/* ─── live data ─────────────────────────────────────────────────────────────── */
function useGitHub() {
  const [s, set] = useState({ user: null, events: [], days: [], total: null, commit: null });
  useEffect(() => {
    const j = u => fetch(u).then(r => (r.ok ? r.json() : null)).catch(() => null);
    j(`https://api.github.com/users/${USER}`).then(user => set(p => ({ ...p, user })));
    j(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`).then(d => d && set(p => ({ ...p, days: d.contributions || [], total: d.total?.lastYear })));
    j(`https://api.github.com/users/${USER}/events/public?per_page=40`).then(ev => {
      if (!Array.isArray(ev)) return;
      ev.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      set(p => ({ ...p, events: ev }));
      const push = ev.find(e => e.type === 'PushEvent');
      if (push) j(`https://api.github.com/repos/${push.repo.name}/commits?per_page=1`).then(c => Array.isArray(c) && c[0] && set(p => ({ ...p, commit: { repo: push.repo.name, msg: c[0].commit.message.split('\n')[0], at: c[0].commit.author.date, url: c[0].html_url } })));
    });
  }, []);
  return s;
}

/* ─── pieces ────────────────────────────────────────────────────────────────── */
const Label = ({ children }) => <h2 className="m-label">{children}</h2>;

const Clock = () => {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return <piix-flap text={t} theme="dark" stagger="0" class="m-clock" aria-label={`My local time: ${t}`}></piix-flap>;
};

/* the contribution graph, drawn in type */
const GLYPH = ['·', '•', '•', '●', '●'];
function TypeGraph({ days, total }) {
  const [hover, setHover] = useState(null);
  const lv = useMemo(() => {
    const nz = days.map(d => d.count).filter(Boolean).sort((a, b) => a - b);
    const q = k => nz[Math.floor((nz.length - 1) * k)] || 1;
    const t = [q(.25), q(.5), q(.8)];
    return c => (!c ? 0 : c <= t[0] ? 1 : c <= t[1] ? 2 : c <= t[2] ? 3 : 4);
  }, [days]);
  const weeks = useMemo(() => {
    if (!days.length) return [];
    const out = []; let w = [];
    const first = new Date(days[0].date).getDay();
    for (let i = 0; i < first; i++) w.push(null);
    days.forEach(d => { w.push(d); if (w.length === 7) { out.push(w); w = []; } });
    if (w.length) out.push(w);
    return out.slice(-53);
  }, [days]);
  const stats = useMemo(() => {
    if (!days.length) return null;
    let cur = 0, best = 0, run = 0, top = days[0];
    days.forEach(d => { run = d.count ? run + 1 : 0; best = Math.max(best, run); if (d.count > top.count) top = d; });
    for (let i = days.length - 1; i >= 0; i--) { if (days[i].count) cur++; else if (i < days.length - 1) break; }
    const active = days.filter(d => d.count).length;
    return { cur, best, top, active };
  }, [days]);
  /* weekly totals as block characters, ranked so one huge week doesn't flatten the rest */
  const spark = useMemo(() => {
    const bars = '▁▂▃▄▅▆▇█';
    const sums = weeks.map(w => w.reduce((a, d) => a + (d ? d.count : 0), 0));
    const sorted = [...sums].sort((a, b) => a - b);
    return sums.map(s => (s ? bars[Math.min(7, 1 + Math.floor(sorted.indexOf(s) / sorted.length * 7))] : bars[0]));
  }, [weeks]);
  const months = useMemo(() => weeks.map((w, i) => { const d = w.find(Boolean); if (!d) return ''; const m = new Date(d.date).getMonth(); const p = weeks[i - 1] && weeks[i - 1].find(Boolean); return !p || new Date(p.date).getMonth() !== m ? new Date(d.date).toLocaleString('en', { month: 'short' }) : ''; }), [weeks]);

  if (!days.length) return <p className="m-dim">loading the year…</p>;
  return (
    <div className="m-graph">
      <div className="m-grid" role="img" aria-label={`${total} contributions in the last year`} onMouseLeave={() => setHover(null)}>
        <div className="m-row m-months" aria-hidden="true">{months.map((m, i) => <span key={i}>{m}</span>)}</div>
        {[0, 1, 2, 3, 4, 5, 6].map(r => (
          <div className="m-row" key={r} aria-hidden="true">
            {weeks.map((w, c) => { const d = w[r]; return d
              ? <span key={c} className={`l${lv(d.count)}`} onMouseEnter={() => setHover(d)}>{GLYPH[lv(d.count)]}</span>
              : <span key={c}> </span>; })}
          </div>
        ))}
        <div className="m-row m-spark" aria-hidden="true">{spark.map((b, i) => <span key={i}>{b}</span>)}</div>
      </div>
      <p className="m-status">{hover
        ? <>{new Date(hover.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} — <b>{hover.count}</b> contribution{hover.count === 1 ? '' : 's'}</>
        : <><b>{(total ?? 0).toLocaleString()}</b> contributions · <b>{stats.cur}</b> day streak · longest <b>{stats.best}</b> · best day <b>{stats.top.count}</b> · active <b>{stats.active}</b> of {days.length} days</>}</p>
    </div>
  );
}

const verb = e => {
  const p = e.payload || {};
  switch (e.type) {
    case 'PushEvent': return ['pushed to', short(e.repo.name)];
    case 'CreateEvent': return [p.ref_type === 'repository' ? 'created' : `created ${p.ref_type} in`, short(e.repo.name)];
    case 'WatchEvent': return ['starred', e.repo.name];
    case 'ForkEvent': return ['forked', e.repo.name];
    case 'PullRequestEvent': return [`${p.action} a pull request in`, e.repo.name];
    case 'IssuesEvent': return [`${p.action} an issue in`, e.repo.name];
    case 'ReleaseEvent': return ['released', short(e.repo.name)];
    case 'PublicEvent': return ['open-sourced', short(e.repo.name)];
    default: return [e.type.replace('Event', '').toLowerCase(), e.repo.name];
  }
};
/* consecutive pushes to the same repo collapse into one line */
function Log({ events }) {
  const rows = [];
  for (const e of events) {
    const [v, r] = verb(e), last = rows[rows.length - 1];
    if (last && last.v === v && last.r === r) { last.n++; continue; }
    rows.push({ v, r, n: 1, at: e.created_at, id: e.id });
  }
  if (!rows.length) return <p className="m-dim">fetching activity…</p>;
  return (
    <ol className="m-log">
      {rows.slice(0, 7).map(x => (
        <li key={x.id}><span className="m-dim m-when">{ago(x.at)}</span><span>{x.v} <a href={`https://github.com/${x.r.includes('/') ? x.r : `${USER}/${x.r}`}`} target="_blank" rel="noreferrer">{x.r}</a>{x.n > 1 && <span className="m-dim"> ×{x.n}</span>}</span></li>
      ))}
    </ol>
  );
}

/* ─── page ──────────────────────────────────────────────────────────────────── */
const THEMES = [['dark', 'dark'], ['tsushima', 'samurai'], ['lofi', 'lo-fi']];

export default function Minimal() {
  const gh = useGitHub();
  const [name, setName] = useState('');
  const [theme, setTheme] = useState(() => (typeof window !== 'undefined' && ['dark', 'tsushima', 'lofi'].includes(localStorage.getItem('portfolio-theme')) ? localStorage.getItem('portfolio-theme') : 'dark'));
  useEffect(() => { const t = setTimeout(() => setName('DIVIK ARORA'), 250); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('tsushima-theme', 'lofi-theme');
    if (theme !== 'dark') root.classList.add(`${theme}-theme`);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const socials = [
    ['github', `@${USER}`, gh.user ? `${gh.user.public_repos} repos · ${gh.user.followers} followers` : 'code', `https://github.com/${USER}`],
    ['x', '@divikkk1', 'thoughts, threads', 'https://x.com/divikkk1'],
    ['linkedin', 'divik arora', 'connect', 'https://www.linkedin.com/in/divik-arora-2b091636b/'],
    ['medium', '@divikstudy100', 'long reads', 'https://medium.com/@divikstudy100'],
    ['email', 'divikstudy100@gmail.com', 'say hi', 'mailto:divikstudy100@gmail.com'],
    ['résumé', 'pdf', 'one page', '/dvkar_resume.pdf'],
  ];

  return (
    <main className="m-page">
      <header className="m-head">
        <h1 className="m-name"><piix-flap text={name} length="11" stagger="45" aria-label="Divik Arora"></piix-flap></h1>
        <p className="m-lede">I build things people actually use — AI agents, developer tools, and the occasional web3 experiment. Fourth semester, shipping every day.</p>
        <dl className="m-now">
          <div><dt>now</dt><dd>building <a href="https://github.com/diiviikk5/OpenLVM" target="_blank" rel="noreferrer">OpenLVM</a> and <a href="https://piixpal.dvkk.dev" target="_blank" rel="noreferrer">Piixpal</a></dd></div>
          <div><dt>last push</dt><dd>{gh.commit
            ? <><span className="m-live" aria-hidden="true" />{ago(gh.commit.at)} ago · <a href={gh.commit.url} target="_blank" rel="noreferrer">{short(gh.commit.repo)}</a> · <span className="m-dim">{gh.commit.msg}</span></>
            : <span className="m-dim">checking…</span>}</dd></div>
          <div><dt>local time</dt><dd className="m-clockwrap"><Clock /><span className="m-dim">IST</span></dd></div>
        </dl>
      </header>

      <section><Label>activity</Label><TypeGraph days={gh.days} total={gh.total} /></section>

      <section>
        <Label>work</Label>
        <ol className="m-work">
          {work.map((w, i) => (
            <li key={w.name}>
              <a href={w.href} target="_blank" rel="noreferrer">
                <span className="m-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="m-title">{w.name}</span>
                <span className="m-what">{w.what}</span>
                <span className="m-stack">{w.stack}</span>
                <span className="m-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="m-also"><span className="m-dim">also</span> {also.map(([n, d, h], i) => <React.Fragment key={n}>{i > 0 && <span className="m-dim"> / </span>}<a href={h} target="_blank" rel="noreferrer" title={d}>{n}</a></React.Fragment>)}</p>
      </section>

      <section><Label>log</Label><Log events={gh.events} /></section>

      <section>
        <Label>elsewhere</Label>
        <ul className="m-social">
          {socials.map(([k, h, note, href]) => (
            <li key={k}><a href={href} target={href.startsWith('mailto') || href.startsWith('/') ? undefined : '_blank'} rel="noreferrer">
              <span className="m-key">{k}</span><span className="m-handle">{h}</span><span className="m-dim m-note">{note}</span><span className="m-arrow" aria-hidden="true">↗</span>
            </a></li>
          ))}
        </ul>
      </section>

      <section>
        <Label>writing</Label>
        <ul className="m-social">
          {writing.map(w => <li key={w.title}><a href={w.href} target="_blank" rel="noreferrer"><span className="m-key">{w.date}</span><span className="m-handle">{w.title}</span><span className="m-dim m-note">{w.where}</span><span className="m-arrow" aria-hidden="true">↗</span></a></li>)}
        </ul>
      </section>

      <footer className="m-foot">
        <p className="m-cta">Let's build something. <a href="mailto:divikstudy100@gmail.com">divikstudy100@gmail.com</a></p>
        <div className="m-footrow">
          <span className="m-dim">© {new Date().getFullYear()} divik</span>
          <span className="m-themes" role="group" aria-label="Theme">{THEMES.map(([t, l]) => <button key={t} type="button" aria-pressed={theme === t} onClick={() => setTheme(t)}>{l}</button>)}</span>
        </div>
      </footer>
    </main>
  );
}
