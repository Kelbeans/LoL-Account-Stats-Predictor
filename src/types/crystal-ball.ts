export type CrystalBallCategory = 'champions' | 'players' | 'teams' | 'other';

export interface CrystalBallQuestion {
  id: string;
  category: CrystalBallCategory;
  question: string;
  points: number;
}

export interface CrystalBallPrediction {
  questionId: string;
  answer: string;
  confidence: number;
  reasoning: string;
  generatedAt: string;
}
