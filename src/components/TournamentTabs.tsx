'use client';

import { useState } from 'react';

interface TournamentTabsProps {
  children: [React.ReactNode, React.ReactNode];
}

export default function TournamentTabs({ children }: TournamentTabsProps) {
  const [activeTab, setActiveTab] = useState<'bracket' | 'crystal-ball'>('bracket');

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-[var(--card-bg)] p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('bracket')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bracket'
              ? 'bg-[var(--accent-cyan)] text-black'
              : 'text-[var(--foreground)] hover:text-[var(--accent-cyan)]'
          }`}
        >
          Bracket
        </button>
        <button
          onClick={() => setActiveTab('crystal-ball')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'crystal-ball'
              ? 'bg-[var(--accent-cyan)] text-black'
              : 'text-[var(--foreground)] hover:text-[var(--accent-cyan)]'
          }`}
        >
          Crystal Ball
        </button>
      </div>
      <div>{activeTab === 'bracket' ? children[0] : children[1]}</div>
    </div>
  );
}
