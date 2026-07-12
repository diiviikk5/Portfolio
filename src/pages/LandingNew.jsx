import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, Clock,
  Code2, Terminal, ArrowUpRight, FileText, Blocks, Moon
} from 'lucide-react';

// Import project images
import nextplayImg from '../assets/nextplay-hero.png';
import swasthyaImg from '../assets/swasthya-hero.png';
import stellarImg from '../assets/stellar-hero.png';
import gladiatorImg from '../assets/gladiator-hero.png';
import inceptionImg from '../assets/inception-hero.jpg';

// ============================================================================
// DATA Constants
// ============================================================================
const USERNAME = 'diiviikk5';

const projects = [
  {
    name: 'nextplay',
    title: 'NextPlay',
    description: 'Game release tracker and countdown for 2026 releases including GTA 6',
    tech: ['React', 'Vite', 'IGDB API', 'Vercel'],
    image: nextplayImg,
    link: 'https://www.nextplaygame.me/',
    github: 'https://github.com/diiviikk5/Nextplay',
  },
  {
    name: 'swasthya',
    title: 'Swasthya',
    description: 'Holistic wellness platform with AI symptom checker',
    tech: ['React', 'Node.js', 'MongoDB', 'AI/ML'],
    image: swasthyaImg,
    link: 'https://swasthya-gold.vercel.app/',
    github: 'https://github.com/diiviikk5/swasthya',
  },
  {
    name: 'stellar',
    title: 'Stellar',
    description: 'GNSS satellite forecasting console with AI-powered predictions',
    tech: ['React', 'Three.js', 'Python'],
    image: stellarImg,
    link: 'https://stellar-wine.vercel.app/',
    github: 'https://github.com/diiviikk5/stellar',
  },
  {
    name: 'gladiator',
    title: 'Gladiator',
    description: 'Learn algorithms through interactive gameplay',
    tech: ['React', 'WebSocket', 'Node.js'],
    image: gladiatorImg,
    link: 'https://gladiator-smoky.vercel.app/',
    github: 'https://github.com/diiviikk5/gladiator',
  }
];

const technologies = [
  "JavaScript", "TypeScript", "React.js", "Next.js", 
  "TailwindCSS", "Node.js", "Express", "MongoDB", 
  "Python", "C++", "Vite", "Solidity"
];

// ============================================================================
// COMPONENTS
// ============================================================================

const FloatingNav = () => (
  <motion.nav 
    initial={{ y: -100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-white/10 bg-zinc-900/60 backdrop-blur-xl"
  >
    <div className="flex items-center px-6 py-3 gap-6 text-sm font-medium text-zinc-300">
      <a href="#about" className="hover:text-white transition-colors">About</a>
      <a href="#projects" className="hover:text-white transition-colors">Projects</a>
      <a href="#blogs" className="hover:text-white transition-colors">Blogs</a>
      <a href="#reach" className="hover:text-white transition-colors">Reach</a>
      <div className="w-px h-4 bg-white/20" />
      <button className="hover:text-white transition-colors">
        <Moon size={16} />
      </button>
    </div>
  </motion.nav>
);

const HeroNode = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col-reverse md:flex-row gap-8 justify-between items-start pt-32 pb-16"
      id="about"
    >
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-4">
          Hi, I'm Divik
        </h1>
        <p className="text-xl text-zinc-400 mb-6 tracking-wide">
          I write code.
        </p>
        
        <div className="flex flex-wrap gap-3 mb-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
            <MapPin size={12} className="text-rose-400" />
            <span>Earth, Universe</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
            <Clock size={12} className="text-emerald-400" />
            <span suppressHydrationWarning>{time}</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-zinc-100 hover:bg-white/15 transition-colors cursor-pointer">
            ✨ Resume
          </button>
        </div>

        <div className="prose prose-invert prose-zinc">
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2 mb-4">
            About <span className="text-zinc-600">•</span> <span className="text-zinc-500 text-sm font-normal">約</span>
          </h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            hello , my name is divik and i like developing projects in ai , on the web and partially web3 , i am currently working on ai agents and i believe these days anything is possible with the tools we have at our disposals 
          </p>
          <p className="text-zinc-400 leading-relaxed text-sm mt-4">
            When I'm not deep in the code, I'm usually reading, scrolling the web, or gaming.
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 mt-8">
          {technologies.map((tech) => (
            <div key={tech} className="px-4 py-2 rounded-full bg-zinc-900 border border-white/5 text-xs text-zinc-400 flex items-center gap-2 hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-default">
              <Code2 size={12} className="opacity-50" />
              {tech}
            </div>
          ))}
        </div>
      </div>
      
      {/* Profile Image Node */}
      <motion.div 
        whileHover={{ scale: 1.02, rotate: 2 }}
        className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border border-white/10 mt-2 bg-zinc-800"
      >
        <img 
          src="https://avatars.githubusercontent.com/u/104192663?v=4" // GitHub Avatar
          alt="Divik"
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
        />
      </motion.div>
    </motion.section>
  );
};

const BentoGrid = () => {
  return (
    <section className="py-12" id="grid">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* GitHub Stats Card (Col Span 2) */}
        <motion.a 
          href={`https://github.com/${USERNAME}`}
          target="_blank" rel="noreferrer"
          whileHover={{ y: -5 }}
          className="md:col-span-2 rounded-3xl bg-zinc-900/50 border border-white/10 p-6 relative overflow-hidden group flex flex-col justify-between min-h-[160px]"
        >
          <div className="z-10">
            <Github size={24} className="text-zinc-100 mb-2" />
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              GitHub <span className="text-xs font-normal text-zinc-500">実</span>
            </h3>
            <p className="text-xs text-zinc-400">My onchain playground 🛸</p>
          </div>
          
          <div className="z-10 flex gap-4 mt-6 text-sm">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> <span className="text-zinc-300">Stars: <span className="text-white font-medium">15</span></span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-zinc-300">PRs: <span className="text-white font-medium">23</span></span></div>
          </div>

          {/* Faint green dots matrix representing contributions background */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', backgroundSize: '16px 16px', maskImage: 'linear-gradient(to right, transparent, black)' }} />
        </motion.a>

        {/* Coding Stats / WakaTime Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="rounded-3xl bg-zinc-900/50 border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden text-center"
        >
          <Terminal size={20} className="text-blue-400 mb-2" />
          <h3 className="text-2xl font-bold text-zinc-100 mb-1">1,240h</h3>
          <p className="text-xs text-zinc-500">coding stats<br/>(wakatime)</p>
        </motion.div>

        {/* LinkedIn Connection */}
        <motion.a 
          href="https://linkedin.com" target="_blank" rel="noreferrer"
          whileHover={{ y: -5 }}
          className="rounded-3xl bg-[#0077B5]/20 border border-[#0077B5]/30 p-6 flex flex-col items-center justify-center group relative overflow-hidden"
        >
          <ArrowUpRight size={16} className="absolute top-4 right-4 text-[#0077b5] opacity-50 group-hover:opacity-100 transition-opacity" />
          <Linkedin size={32} className="text-[#0077b5] mb-2" />
          <span className="text-xs text-[#0077B5] font-medium">(connect;)</span>
        </motion.a>

        {/* Twitter / X */}
        <motion.a 
          href="https://twitter.com" target="_blank" rel="noreferrer"
          whileHover={{ y: -5 }}
          className="rounded-3xl bg-zinc-900/50 border border-white/10 p-6 flex flex-col items-center justify-center group relative overflow-hidden"
        >
          <ArrowUpRight size={16} className="absolute top-4 right-4 text-zinc-500 group-hover:opacity-100 transition-opacity" />
          <Twitter size={32} className="text-zinc-300 mb-2" />
          <span className="text-xs text-zinc-500 font-medium">(serious stuff 🤯)</span>
        </motion.a>

        {/* Contact/Reach Block */}
        <motion.a 
          href="mailto:hello@example.com"
          whileHover={{ y: -5 }}
          className="rounded-3xl bg-zinc-900/50 border border-white/10 p-6 flex items-center justify-center group relative md:col-span-1 overflow-hidden"
        >
          <div className="text-center z-10">
            <Mail size={32} className="text-rose-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-zinc-200 font-medium">Get in touch</h4>
            <p className="text-xs text-zinc-500">hello @ network</p>
          </div>
        </motion.a>

      </div>
    </section>
  );
};

const ProjectsSection = () => {
  return (
    <section className="py-16" id="projects">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
            Projects <span className="text-zinc-600">•</span> <span className="text-zinc-500 text-sm font-normal">案</span>
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Some of my recent work & playground concepts.</p>
        </div>
        <a href="https://github.com/diiviikk5" target="_blank" rel="noreferrer" className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
          View all <ArrowUpRight size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <motion.a
            href={project.link || project.github}
            target="_blank" rel="noreferrer"
            key={i}
            whileHover={{ y: -5 }}
            className="group rounded-3xl bg-zinc-900/40 border border-white/5 overflow-hidden flex flex-col hover:border-white/10 transition-colors"
          >
            <div className="h-40 overflow-hidden relative">
              <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors z-10" />
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-zinc-200">{project.title}</h3>
                <ArrowUpRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex gap-2 flex-wrap">
                {project.tech.slice(0, 3).map(tech => (
                  <span key={tech} className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

const BlogSection = () => {
  return (
    <section className="py-16 border-t border-white/5" id="blogs">
      <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2 mb-8">
        Blogs <span className="text-zinc-600">•</span> <span className="text-zinc-500 text-sm font-normal">文</span>
      </h2>
      <div className="space-y-4">
        {[
          { title: "Building a satellite tracker with Three.js", date: "April 02, 2026", read: "5 min read" },
          { title: "Gamifying Algorithms: The Engineering behind Gladiator", date: "March 15, 2026", read: "8 min read" },
        ].map((blog, i) => (
          <motion.a 
            key={i}
            href="#"
            whileHover={{ x: 5 }}
            className="block p-4 rounded-2xl bg-transparent hover:bg-zinc-900/50 border border-transparent hover:border-white/5 transition-colors group"
          >
            <div className="flex justify-between items-center text-sm mb-1">
              <div className="flex items-center gap-2 text-zinc-500">
                <FileText size={14} />
                <span>{blog.date}</span>
              </div>
              <span className="text-zinc-600 text-xs">{blog.read}</span>
            </div>
            <h3 className="text-zinc-200 font-medium group-hover:text-blue-400 transition-colors">
              {blog.title}
            </h3>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="py-8 text-center border-t border-white/5" id="reach">
    <p className="text-zinc-500 text-sm">
      © {new Date().getFullYear()} Divik. Built with React & Tailwind.
    </p>
  </footer>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Background radial gradient overlay */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/20 via-[#09090b] to-[#09090b] pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <FloatingNav />
        <HeroNode />
        <BentoGrid />
        <ProjectsSection />
        <BlogSection />
        <Footer />
      </div>
    </div>
  );
}
