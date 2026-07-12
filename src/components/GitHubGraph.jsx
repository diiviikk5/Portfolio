import React, { useState, useEffect } from 'react';

const GitHubGraph = ({ username = 'diiviikk5' }) => {
  const [weeks, setWeeks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(r => r.json())
      .then(data => {
        if (data.contributions) {
          // Group by week
          const grouped = [];
          let week = [];
          data.contributions.forEach((day, i) => {
            week.push(day);
            if (week.length === 7) {
              grouped.push(week);
              week = [];
            }
          });
          if (week.length) grouped.push(week);
          // Take last 30 weeks for display
          setWeeks(grouped.slice(-30));
          setTotal(data.total?.lastYear || data.contributions.reduce((a, d) => a + d.count, 0));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const levelColor = (level) => {
    if (level === 0) return 'var(--contrib-0)';
    if (level === 1) return 'var(--contrib-1)';
    if (level === 2) return 'var(--contrib-2)';
    if (level === 3) return 'var(--contrib-3)';
    return 'var(--contrib-4)';
  };

  if (loading) {
    return (
      <div className="flex gap-[3px] animate-pulse opacity-30">
        {Array.from({ length: 20 }, (_, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }, (_, d) => (
              <div key={d} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: 'var(--contrib-0)' }} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[var(--text-muted)] font-mono">
          <span className="text-[var(--text-primary)] font-semibold">{total.toLocaleString()}</span> contributions this year
        </p>
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer"
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-mono flex items-center gap-1 transition-colors">
          @{username} ↗
        </a>
      </div>
      <div className="flex gap-[3px] overflow-x-auto pb-1 scrollbar-hide">
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-[3px]">
            {week.map((day, d) => (
              <div
                key={d}
                title={`${day.date}: ${day.count} contributions`}
                style={{ backgroundColor: levelColor(day.level) }}
                className="w-[11px] h-[11px] rounded-[2px] transition-colors hover:ring-1 hover:ring-[var(--border-hover)]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GitHubGraph;
