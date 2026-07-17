import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail,
  Code2, Terminal, ArrowUpRight, FileText,
  ChevronRight, Layers, Fingerprint, Cpu, Newspaper, Joystick
} from 'lucide-react';



import GitHubGraph from '@/components/GitHubGraph';
import ProgressiveBlur from '@/components/ProgressiveBlur';
import OnekoCat from '@/components/OnekoCat';

// ─── Data ────────────────────────────────────────────────────────────────────
const USERNAME = 'diiviikk5';
const links = {
  github: `https://github.com/${USERNAME}`,
  linkedin: 'https://www.linkedin.com/in/divik-arora-2b091636b/',
  twitter: 'https://x.com/divikkk1',
  email: 'mailto:divikstudy100@gmail.com',
  resume: '/dvkar_resume.pdf',
};

const projects = [
  { title: 'Drift', description: 'Windows Alternative to Screen Studio with cinematic cursor tracking and smooth zooms.', tech: ['Rust', 'Tauri', 'React'], video: '/drift-showcase-1777051239342.mp4', link: 'https://github.com/diiviikk5/drift', github: 'https://github.com/diiviikk5/drift' },
  { title: 'Xeus', description: 'A playground for Solana agents but different, faster, and easier. Making the ecosystem of AI x Solana more useful and effective using the Agent Kit and Solana.new MCP.', tech: ['TypeScript', 'Solana', 'Agent Kit', 'MCP'], video: '/xeuz_demo.mp4', link: 'https://github.com/diiviikk5/Xeus', github: 'https://github.com/diiviikk5/Xeus' },
  { title: 'Stellar v1k', description: 'GNSS satellite forecasting console powered by ML predictions.', tech: ['React', 'Three.js', 'Python'], video: '/ztellar_v1k.mp4', link: 'https://stellar-wine.vercel.app/', github: 'https://github.com/diiviikk5/stellar' },
  { title: 'OpenLVM', description: 'Advanced agent testing platform.', tech: ['Zig', 'Python', 'Next.js'], video: '/openlvm_demo.mp4', link: 'https://github.com/diiviikk5/OpenLVM', github: 'https://github.com/diiviikk5/OpenLVM' },
  { title: 'Gladiator', description: 'Gamified algorithm learning through interactive PvP sessions.', tech: ['React', 'WebSocket', 'Node.js'], video: '/gladiator_demo.mp4', link: 'https://gladiator-smoky.vercel.app/', github: 'https://github.com/diiviikk5/gladiator' },
  { title: 'Swasthya', description: 'Holistic wellness platform with an integrated AI symptom checker.', tech: ['React', 'Node.js', 'MongoDB'], video: '/zwazthya_arogyam_demo.mp4', link: 'https://swasthya-gold.vercel.app/', github: 'https://github.com/diiviikk5/swasthya' },
];

const technologies = [
  'Rust', 'Go', 'TypeScript', 'JavaScript',
  'React.js', 'Next.js', 'TailwindCSS', 'Node.js',
  'Python', 'C++', 'Solidity',
];

const blogs = [
  { title: 'How I think about building and shipping (X thread)', date: 'Apr 24, 2026', read: 'Thread', tag: 'X', link: 'https://x.com/divikkk1/status/2014030171582713983?s=20' },
];

// ─── Utilities ───────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] },
});

const AnimatedSection = ({ children, className, delay = 0, id }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
      id={id}
    >
      {children}
    </motion.section>
  );
};

const SectionLabel = ({ label, right }) => (
  <div className="flex items-center gap-4 mb-10">
    <span className="text-[13px] font-mono text-[var(--accent-color)] opacity-80 tracking-wider">// {label}</span>
    <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-color)] to-transparent" />
    {right && <span className="text-[var(--text-muted)] text-[13px] font-mono">{right}</span>}
  </div>
);

// ─── Background ──────────────────────────────────────────────────────────────

const themeLabels = {
  dark: 'Dark',
  tsushima: 'Samurai',
  lofi: 'Lo-Fi',
};

const themeGifsList = {
  dark: [
    '/oreki_houtarou.gif',
    '/time_weekend_first_frame.png',
    '/oreki_houtarou_1.gif',
  ],
  tsushima: [
    '/zamurai_1.gif',
    '/zamurai_2.gif',
    '/zamurai_3.gif',
  ],
  lofi: [
    '/oreki_houtarou.gif',
    '/manga_otaku.gif',
    '/forum_describe.gif',
  ],
};

const BackgroundGlow = ({ theme }) => {
  const [gifIndex, setGifIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGifIndex((prev) => (prev + 1) % 3);
    }, 4000); // Cycle every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const getOpacity = () => {
    if (theme === 'dark') return 0.22;
    if (theme === 'tsushima' || theme === 'lofi') return 0.28;
    return 0;
  };

  const activeGifs = themeGifsList[theme] || themeGifsList['dark'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Looping background GIFs for the active theme */}
      {activeGifs.map((gif, index) => (
        <div 
          key={gif}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 hidden md:block" 
          style={{ 
            backgroundImage: `url(${gif})`,
            opacity: gifIndex === index ? getOpacity() : 0,
            imageRendering: 'pixelated'
          }} 
        />
      ))}

      {/* Deep dark gradient overlay to ensure text visibility and legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-color)]/70 via-[var(--bg-color)]/85 to-[var(--bg-color)] transition-all duration-500 hidden md:block" />
      
      {/* Glow Circles */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[var(--glow-1)] rounded-full blur-[120px] opacity-60" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-[var(--glow-2)] rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-0 left-1/3 w-[700px] h-[400px] bg-[var(--glow-3)] rounded-full blur-[150px] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,var(--grid-dots)_1px,transparent_1px)] bg-[size:24px_24px] opacity-70" />
    </div>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────────────

const navLinksItems = [
  { name: 'Home', path: '#hero', icon: Terminal },
  { name: 'About', path: '#about', icon: Fingerprint },
  { name: 'Work', path: '#work', icon: Cpu },
  { name: 'Blog', path: '#blog', icon: Newspaper },
];

const Navbar = ({ theme, setTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('#hero');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const themesList = ['dark', 'tsushima', 'lofi'];

  return (
    <motion.nav
      initial={{ opacity: 0, scale: 0.95, x: "-50%" }}
      animate={{ opacity: 1, scale: 1, x: "-50%" }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      className="fixed bottom-6 md:bottom-auto md:top-6 left-1/2 z-50 w-max max-w-[95vw]"
    >
      <div className={`flex items-center rounded-full border px-1 py-1 backdrop-blur-xl transition-all duration-500 overflow-visible md:px-2 ${
        scrolled ? 'bg-[var(--nav-bg)] border-[var(--border-color)]' : 'bg-[var(--nav-bg)]/80 border-[var(--border-color)]'
      }`}>
        <div className="flex items-center relative overflow-x-auto scrollbar-hide max-w-[55vw] md:max-w-none">
          {navLinksItems.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setActiveTab(link.path)}
                className={`relative flex flex-col items-center gap-0.5 rounded-full px-3.5 py-1.5 transition-colors duration-200 md:flex-row md:gap-2 md:px-5 md:py-2 z-10 ${
                  isActive ? 'text-[var(--text-primary)] font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-highlight"
                    className="absolute inset-0 z-[-1] rounded-full bg-[var(--nav-highlight)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-[18px] w-[18px] md:h-[18px] md:w-[18px]" strokeWidth={1.5} />
                <span className="text-[9px] font-medium tracking-wide md:text-[11px] font-mono">
                  {link.name}
                </span>
              </a>
            );
          })}
        </div>

        <div className="mx-0.5 h-8 w-px bg-[var(--border-color)] md:mx-1 shrink-0" />

        <a
          href={links.resume}
          target="_blank"
          rel="noreferrer"
          className="relative flex flex-col items-center gap-0.5 rounded-full px-3.5 py-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 md:flex-row md:gap-2 md:px-5 md:py-2 shrink-0"
        >
          <FileText className="h-[18px] w-[18px]" strokeWidth={1.5} />
          <span className="text-[9px] font-medium tracking-wide md:text-[11px] font-mono">
            Resume
          </span>
        </a>

        <div className="mx-0.5 h-8 w-px bg-[var(--border-color)] md:mx-1 shrink-0" />

        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative flex flex-col items-center gap-0.5 rounded-full px-3.5 py-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-200 md:flex-row md:gap-2 md:px-5 md:py-2 shrink-0 cursor-pointer"
            title="Select theme"
          >
            <Joystick className="h-[18px] w-[18px]" strokeWidth={1.5} />
            <span className="text-[9px] font-medium tracking-wide md:text-[11px] font-mono">
              {themeLabels[theme]}
            </span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 md:bottom-auto md:top-full md:mt-2 right-0 bg-[var(--surface-overlay)] border border-[var(--border-color)] rounded-2xl py-1.5 w-32 shadow-xl z-50 flex flex-col gap-0.5"
              >
                {themesList.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      setDropdownOpen(false);
                    }}
                    className={`px-4 py-1.5 text-left text-[11px] font-mono transition-colors w-full cursor-pointer hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] ${
                      theme === t ? 'text-[var(--text-primary)] font-semibold bg-[var(--surface-raised)]/50' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {themeLabels[t]}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

// ─── Wave Emoji ──────────────────────────────────────────────────────────────

const WaveEmoji = () => {
  const [waving, setWaving] = useState(true);
  useEffect(() => { const t = setTimeout(() => setWaving(false), 1500); return () => clearTimeout(t); }, []);
  return (
    <span
      className={`inline-block origin-[70%_70%] cursor-default transition-all duration-500 ${waving ? 'animate-wave' : 'grayscale'}`}
      onMouseEnter={(e) => { e.target.classList.remove('grayscale'); e.target.classList.add('animate-wave'); }}
      onMouseLeave={(e) => { e.target.classList.add('grayscale'); }}
    >👋🏻</span>
  );
};

// ─── Hero + About (reference-aligned) ────────────────────────────────────────

const HeroAboutSection = () => (
  <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="pt-32 md:pt-40 pb-10"
    id="hero"
  >
    <div className="flex flex-col gap-10">
      {/* Hero block */}
      <motion.div className="flex flex-col gap-6" {...fadeUp(0)}>
        <div>
          <p className="mb-3 font-mono text-xs text-[var(--text-muted)] md:text-sm">
            Hey, I'm <WaveEmoji />
          </p>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-pixel text-3xl md:text-5xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
              Divik
            </h1>
          </div>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)] md:text-sm font-mono">
            I like to build things people actually use
          </p>
        </div>
      </motion.div>

      {/* About Me */}
      <motion.div {...fadeUp(0.15)} id="about">
        <h2 className="font-pixel text-xl md:text-2xl uppercase tracking-tight text-[var(--text-primary)] mb-4">
          About Me
        </h2>
        <div className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-mono space-y-4">
          <p>
            Hello, my name is <strong className="font-semibold text-[var(--text-primary)]">Divik</strong> and I'm currently in my 4th semester. I like developing projects in <strong className="font-semibold text-[var(--text-primary)]">AI</strong>, on the web, and partially <strong className="font-semibold text-[var(--text-primary)]">Web3</strong>. I am currently working on AI agents and I believe these days anything is possible with the tools we have at our disposal.
          </p>
          <div>
            <p className="mb-2 text-[var(--text-secondary)] opacity-90">Some of my favorite current projects are:</p>
            <ul className="space-y-1.5 ml-2 text-[11px] md:text-xs border-l border-[var(--border-color)] pl-3">
              <li><a href="https://github.com/diiviikk5/Drift" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">Drift</a> — Desktop Screen Recorder with Cursor Zoom (Rust, Tauri and JS).</li>
              <li><a href="https://github.com/diiviikk5/Nectar" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">Nectar</a> — Turn Content into Agent Skills.</li>
              <li><a href="https://github.com/diiviikk5/OpenLVM" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">OpenLVM</a> — Agent testing Platform (In progress).</li>
              <li><a href="https://github.com/diiviikk5/gloader" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">gloader</a> — A generic attempt towards a game launcher, building a better one.</li>
              <li><a href="https://github.com/diiviikk5/dvkcli" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">dvkcli</a> — Personal Pocket GPT (Qwen!).</li>
              <li><a href="https://github.com/diiviikk5/Swasthya" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">Swasthya</a> — Health tracker.</li>
              <li><a href="https://github.com/diiviikk5/Nextplay" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">NextPlayGames</a> — I love games, so a game tracker.</li>
              <li><a href="https://github.com/diiviikk5/Stellar-v1k" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">Stellar-v1k</a> — GNSS satellite Model Training.</li>
              <li><a href="https://github.com/diiviikk5/gladiator" target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold underline decoration-[var(--border-color)] underline-offset-2 transition-colors">gladiator</a> — Browser games on DSA.</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Contribution Graph */}
      <motion.div {...fadeUp(0.25)}>
        <GitHubGraph username={USERNAME} />
      </motion.div>
    </div>
  </motion.section>
);

// ─── Bento Grid ──────────────────────────────────────────────────────────────

const BentoSection = () => (
  <AnimatedSection className="pb-20" id="grid">
    <SectionLabel label="at a glance" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

      {/* GitHub — large card with image */}
      <a href={links.github} target="_blank" rel="noreferrer"
        className="col-span-2 row-span-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden relative group hover:border-[var(--border-hover)] transition-all min-h-[280px]">
        <img src="/githubpfp.gif" alt="GitHub" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <ProgressiveBlur direction="bottom" blurLayers={6} blurIntensity={0.6} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/30 to-transparent transition-all duration-300" />
        <div className="absolute top-4 left-4">
          <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
        </div>
        <div className="absolute bottom-0 inset-x-0 p-5">
          <div className="flex items-center gap-2 mb-1">
            <Github size={16} className="text-[var(--text-primary)]" />
            <span className="font-pixel text-base text-[var(--text-primary)] uppercase">GitHub</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] font-mono">@{USERNAME}</p>
        </div>
      </a>

      {/* PRs */}
      <div className="col-span-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 flex flex-col items-center justify-center text-center group hover:border-[var(--border-hover)] transition-all">
        <Terminal size={22} className="text-[var(--text-muted)] mb-3 group-hover:text-[var(--accent-color)] transition-colors" />
        <p className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] font-pixel">53</p>
        <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">Pull Requests</p>
      </div>

      {/* Medium */}
      <a href="https://medium.com/@divikstudy100" target="_blank" rel="noreferrer"
        className="col-span-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--border-hover)] p-6 flex flex-col items-center justify-center text-center group transition-all relative">
        <ArrowUpRight size={14} className="absolute top-3 right-3 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
        <span className="text-4xl font-bold text-[var(--text-primary)] group-hover:scale-110 transition-transform duration-300 font-serif">M</span>
        <p className="text-[11px] text-[var(--text-muted)] mt-2 font-mono">Medium</p>
      </a>

      {/* X / Twitter card with image */}
      <a href={links.twitter} target="_blank" rel="noreferrer"
        className="col-span-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden relative group hover:border-[var(--border-hover)] transition-all min-h-[160px]">
        <img src="/xpfp.gif" alt="X" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <ProgressiveBlur direction="bottom" blurLayers={5} blurIntensity={0.5} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/30 to-transparent transition-all duration-300" />
        <ArrowUpRight size={12} className="absolute top-3 right-3 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
        <div className="absolute bottom-0 inset-x-0 p-4">
          <div className="flex items-center gap-2">
            <Twitter size={14} className="text-[var(--accent-color)]" />
            <span className="font-pixel text-[12px] text-[var(--text-primary)] uppercase">X / Twitter</span>
          </div>
          <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-mono">@divikkk1</p>
        </div>
      </a>

      {/* LinkedIn */}
      <a href={links.linkedin} target="_blank" rel="noreferrer"
        className="col-span-1 rounded-2xl bg-[var(--linkedin-bg)] border border-[var(--linkedin-border)] hover:border-[var(--linkedin-border-hover)] p-6 flex flex-col items-center justify-center text-center group transition-all relative">
        <ArrowUpRight size={14} className="absolute top-3 right-3 text-[var(--linkedin-text)] opacity-70 group-hover:opacity-100 transition-opacity" />
        <Linkedin size={28} className="text-[var(--linkedin-text)] mb-2 group-hover:scale-110 transition-transform duration-300" />
        <p className="text-[11px] text-[var(--linkedin-text-muted)] font-mono">(connect;)</p>
      </a>

      {/* Stack */}
      <div className="col-span-2 md:col-span-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-5 hover:border-[var(--border-hover)] transition-all">
        <h3 className="font-pixel text-sm text-[var(--text-primary)] uppercase mb-3">Stack</h3>
        <div className="flex flex-wrap gap-2">
          {technologies.map(tech => (
            <span key={tech} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--surface-overlay)] border border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] font-mono hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] transition-all cursor-default">
              <Code2 size={9} className="opacity-40" /> {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Exploring */}
      <div className="col-span-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 flex flex-col justify-between group hover:border-[var(--border-hover)] transition-all">
        <Layers size={18} className="text-[var(--accent-color)]/80 mb-3" />
        <div>
          <p className="text-[10px] text-[var(--text-muted)] mb-1.5 uppercase tracking-wider font-mono">Exploring</p>
          <p className="text-sm text-[var(--text-primary)] font-pixel uppercase">Web3 × AI</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">& decentralized infra</p>
        </div>
      </div>

      {/* Currently building */}
      <div className="col-span-1 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] p-6 flex flex-col justify-between group hover:border-[var(--border-hover)] transition-all">
        <div className="flex items-center gap-2 text-emerald-400/80">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative rounded-full h-2 w-2 bg-emerald-500" /></span>
          <span className="text-[10px] uppercase tracking-wider font-mono">Now</span>
        </div>
        <div className="mt-3">
          <p className="text-sm text-[var(--text-primary)] font-pixel uppercase">Building</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">AI agents & dApps</p>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

// ─── Projects ────────────────────────────────────────────────────────────────

const ProjectsSection = () => (
  <AnimatedSection className="pb-20" id="work">
    <SectionLabel label="projects" right="featured" />
    <div className="flex flex-col gap-6">
      {projects.map((project, i) => (
        <motion.div key={i} whileHover={{ y: -3 }} transition={{ duration: 0.25 }}
          className="group rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] overflow-hidden hover:border-[var(--border-hover)] transition-colors">
          <a href={project.link || project.github} target="_blank" rel="noreferrer" className="block relative h-60 md:h-96 overflow-hidden bg-[var(--surface-overlay)]">
            <ProgressiveBlur direction="bottom" blurLayers={4} blurIntensity={0.5} className="absolute inset-0 z-10" />
            {project.video ? (
              <video src={project.video} autoPlay loop muted playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            ) : (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            )}
          </a>
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-pixel text-base text-[var(--text-primary)] uppercase">{project.title}</h3>
              <div className="flex gap-1">
                {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded hover:bg-[var(--surface-overlay)]"><Github size={13} /></a>}
                {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded hover:bg-[var(--surface-overlay)]"><ArrowUpRight size={13} /></a>}
              </div>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed mb-3 font-mono">{project.description}</p>
            <div className="flex gap-2 flex-wrap">
              {project.tech.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-overlay)] text-[var(--text-muted)] border border-[var(--border-color)] font-mono">{t}</span>)}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </AnimatedSection>
);

// ─── Blog ────────────────────────────────────────────────────────────────────

const BlogSection = () => (
  <AnimatedSection className="pb-20" id="blog">
    <SectionLabel label="articles" right="recent" />
    <div className="space-y-1">
      {blogs.map((blog, i) => (
        <a key={i} href={blog.link} target="_blank" rel="noreferrer" className="group flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 rounded-lg hover:bg-[var(--surface-raised)] transition-all border border-transparent hover:border-[var(--border-color)]">
          <div className="space-y-1">
            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-2 font-mono"><FileText size={10} /> {blog.date} <span className="opacity-40">•</span> {blog.read}</p>
            <h3 className="text-[13px] md:text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors font-mono">{blog.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--surface-overlay)] text-[var(--text-muted)] border border-[var(--border-color)] font-mono uppercase tracking-wider">{blog.tag}</span>
            <ChevronRight size={13} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:translate-x-1 transition-all hidden md:block" />
          </div>
        </a>
      ))}
    </div>
  </AnimatedSection>
);

// ─── Footer ──────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="pt-8 pb-12">
    <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mb-10" />
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div>
        <h3 className="font-pixel text-base text-[var(--text-primary)] uppercase mb-2">Let's build something.</h3>
        <p className="text-[12px] text-[var(--text-muted)] font-mono">
          Drop a line via{' '}
          <a href={links.email} className="text-[var(--text-primary)] hover:text-[var(--accent-color)] hover:underline underline-offset-2 transition-colors">email</a>
          {' '}or{' '}
          <a href={links.twitter} target="_blank" rel="noreferrer" className="text-[var(--text-primary)] hover:text-[var(--accent-color)] hover:underline underline-offset-2 transition-colors">X</a>.
        </p>
      </div>
    </div>
    <p className="text-[var(--text-muted)] text-[11px] mt-8 font-mono opacity-60">© {new Date().getFullYear()} Divik.</p>
  </footer>
);

// ─── Main ────────────────────────────────────────────────────────────────────

export default function Landing() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme');
      const validThemes = ['dark', 'tsushima', 'lofi'];
      return validThemes.includes(saved) ? saved : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Clear other theme classes
    root.classList.remove('tsushima-theme', 'lofi-theme');
    
    if (theme !== 'dark') {
      root.classList.add(`${theme}-theme`);
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themesList = ['dark', 'tsushima', 'lofi'];
    setTheme(prev => {
      const idx = themesList.indexOf(prev);
      const nextIdx = (idx + 1) % themesList.length;
      return themesList[nextIdx];
    });
  };

  return (
    <div className="min-h-screen selection:bg-[var(--selection-bg)] selection:text-[var(--selection-text)] font-sans relative overflow-x-hidden transition-colors duration-300">
      <BackgroundGlow theme={theme} />
      <OnekoCat />
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 lg:px-0">
        <HeroAboutSection />
        <BentoSection />
        <ProjectsSection />
        <BlogSection />
        <Footer />
      </div>
    </div>
  );
}
