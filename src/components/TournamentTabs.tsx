'use client';

import { useState } from 'react';

type TabKey = 'bracket' | 'crystal-ball' | 'teams';

interface TournamentTabsProps {
  children: [React.ReactNode, React.ReactNode, React.ReactNode];
}

const tabs: { key: TabKey; label: string; icon: string; activeColor: string }[] = [
  {
    key: 'bracket',
    label: 'Bracket',
    icon: 'M4 6h16M4 12h8m-8 6h16',
    activeColor: 'bg-[var(--accent-cyan)] text-black shadow-[0_0_15px_var(--accent-cyan-dim)]',
  },
  {
    key: 'crystal-ball',
    label: 'Crystal Ball',
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z',
    activeColor: 'bg-[var(--accent-gold)] text-black shadow-[0_0_15px_var(--accent-gold-dim)]',
  },
  {
    key: 'teams',
    label: 'Teams',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    activeColor: 'bg-[var(--accent-green)] text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]',
  },
];

export default function TournamentTabs({ children }: TournamentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('bracket');

  const activeIndex = tabs.findIndex((t) => t.key === activeTab);

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <div className="flex bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1.5 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? tab.activeColor
                  : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg-hover)]'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-[var(--card-border)] to-transparent" />
      </div>
      <div>{children[activeIndex]}</div>
    </div>
  );
}
