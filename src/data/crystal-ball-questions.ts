import { CrystalBallQuestion } from '@/types/crystal-ball';

export const MSI_2025_QUESTIONS: CrystalBallQuestion[] = [
  // Champions
  { id: 'champ-most-picked', category: 'champions', question: 'For MSI Play-ins: which champion will be picked the most?', points: 50 },
  { id: 'champ-highest-wr', category: 'champions', question: 'Which champion will have the highest winrate? (minimum 5 games played)', points: 50 },
  { id: 'champ-lowest-wr', category: 'champions', question: 'Which champion will have the lowest winrate? (minimum 5 games played)', points: 50 },
  { id: 'champ-most-kills', category: 'champions', question: 'Which champion will have the most kills?', points: 50 },
  { id: 'champ-most-banned', category: 'champions', question: 'Which champion will be banned the most?', points: 50 },
  // Players
  { id: 'player-highest-kda', category: 'players', question: 'For MSI Play-ins: which pro will have the highest KDA?', points: 50 },
  { id: 'player-highest-cs', category: 'players', question: 'Which pro will earn the highest CS in a single game?', points: 100 },
  { id: 'player-most-fb', category: 'players', question: 'Which pro will get the most First Bloods?', points: 50 },
  { id: 'player-highest-dmg', category: 'players', question: 'Which pro will finish with the highest average damage per game?', points: 50 },
  // Teams
  { id: 'team-shortest-game', category: 'teams', question: 'For MSI Play-ins: which team will win the shortest game (duration)?', points: 100 },
  { id: 'team-most-elders', category: 'teams', question: 'Which team will kill the most Elder Dragons?', points: 50 },
  { id: 'team-least-kills', category: 'teams', question: 'Which team will get the least kills in a single game?', points: 50 },
  { id: 'team-most-unique-champs', category: 'teams', question: 'Which team will play the most unique Champions (largest champion pool)?', points: 50 },
  // Other
  { id: 'other-highest-kills', category: 'other', question: 'For MSI Play-ins: what will be the highest number of kills in a single game?', points: 50 },
  { id: 'other-unique-champs', category: 'other', question: 'How many unique champions will be picked?', points: 50 },
  { id: 'other-teemo', category: 'other', question: 'Will Teemo be picked?', points: 100 },
];
