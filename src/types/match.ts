import { Team } from './team';

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  tournament: string;
  stage: string;
  date?: string;
  result?: {
    winner: string;
    score: string;
  };
}

export interface TournamentBracket {
  tournament: string;
  stages: {
    name: string;
    matches: Match[];
  }[];
}
