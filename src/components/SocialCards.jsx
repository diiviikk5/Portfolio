import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Gamepad2 } from 'lucide-react';

const socials = [
  {
    platform: 'GitHub',
    icon: Github,
    username: '@diiviikk5',
    bio: 'Building cool things with code. Full-stack dev & open source.',
    href: 'https://github.com/diiviikk5',
    avatar: 'https://avatars.githubusercontent.com/u/104192663?v=4',
    stats: [
      { label: 'repos', value: '30+' },
      { label: 'stars', value: '15+' },
    ],
    gradient: 'from-violet-500/20 via-violet-900/10 to-transparent',
    hoverBorder: 'hover:border-violet-500/30',
  },
  {
    platform: 'X / Twitter',
    icon: Twitter,
    username: '@divikkk1',
    bio: 'tweeting about tech, web3, and whatever crosses my mind.',
    href: 'https://x.com/divikkk1',
    avatar: 'https://pbs.twimg.com/profile_images/1914393770734637056/HwOGC_ow_400x400.jpg',
    stats: null,
    gradient: 'from-sky-500/15 via-sky-900/5 to-transparent',
    hoverBorder: 'hover:border-sky-500/30',
  },
  {
    platform: 'LinkedIn',
    icon: Linkedin,
    username: 'diiviikk5',
    bio: 'professional connects, collabs, and all the serious stuff.',
    href: 'https://linkedin.com/in/diiviikk5',
    avatar: 'https://avatars.githubusercontent.com/u/104192663?v=4',
    stats: null,
    gradient: 'from-blue-500/15 via-blue-900/5 to-transparent',
    hoverBorder: 'hover:border-blue-500/30',
  },
  {
    platform: 'Email',
    icon: Mail,
    username: 'hello@divik.dev',
    bio: 'for collabs, freelance, or just saying hey.',
    href: 'mailto:hello@divik.dev',
    avatar: null,
    stats: null,
    gradient: 'from-rose-500/15 via-rose-900/5 to-transparent',
    hoverBorder: 'hover:border-rose-500/30',
  },
];

const SocialCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {socials.map((s) => (
      <SocialCard key={s.platform} social={s} />
    ))}
  </div>
);

const SocialCard = ({ social: s }) => {
  const Icon = s.icon;

  return (
    <motion.a
      href={s.href}
      target={s.href.startsWith('mailto') ? undefined : '_blank'}
      rel="noreferrer"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={`group block rounded-2xl bg-white/[0.02] border border-white/[0.06] ${s.hoverBorder} overflow-hidden transition-all card-shine`}
    >
      {/* Gradient header */}
      <div className={`h-16 bg-gradient-to-br ${s.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.04),transparent_70%)]" />
      </div>

      {/* Content */}
      <div className="p-4 pt-0 relative">
        {/* Avatar overlapping header */}
        <div className="-mt-6 mb-2.5 flex items-end gap-3">
          {s.avatar ? (
            <img src={s.avatar} alt={s.platform}
              className="w-12 h-12 rounded-full border-[3px] border-[#0B0D0E] object-cover bg-zinc-900 group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-12 h-12 rounded-full border-[3px] border-[#0B0D0E] bg-zinc-900 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Icon size={18} className="text-zinc-400" />
            </div>
          )}
          <div className="pb-0.5">
            <p className="font-pixel text-[12px] text-white uppercase">{s.platform}</p>
            <p className="text-[10px] text-zinc-500 font-mono">{s.username}</p>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 font-mono leading-relaxed line-clamp-2 mb-2">
          {s.bio}
        </p>

        {s.stats && (
          <div className="flex gap-4 text-[10px] text-zinc-500 font-mono">
            {s.stats.map((stat) => (
              <span key={stat.label}>
                <strong className="text-white font-semibold">{stat.value}</strong> {stat.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.a>
  );
};

export default SocialCards;
