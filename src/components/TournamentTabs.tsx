'use client';

import { useState } from 'react';

interface TournamentTabsProps {
  children: [React.ReactNode, React.ReactNode];
}

export default function TournamentTabs({ children }: TournamentTabsProps) {
  const [activeTab, setActiveTab] = useState<'bracket' | 'crystal-ball'>('bracket');

  return (
    <div>
      <div className="flex items-center gap-2 mb-8">
        <div className="flex bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('bracket')}
            className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'bracket'
                ? 'bg-[var(--accent-cyan)] text-black shadow-[0_0_15px_var(--accent-cyan-dim)]'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg-hover)]'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              Bracket
            </span>
          </button>
          <button
            onClick={() => setActiveTab('crystal-ball')}
            className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'crystal-ball'
                ? 'bg-[var(--accent-gold)] text-black shadow-[0_0_15px_var(--accent-gold-dim)]'
                : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg-hover)]'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Crystal Ball
            </span>
          </button>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-[var(--card-border)] to-transparent" />
      </div>
      <div>{activeTab === 'bracket' ? children[0] : children[1]}</div>
    </div>
  );
}
