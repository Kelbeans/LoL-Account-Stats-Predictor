export interface MatchPrediction {
  matchId: string;
  predictedWinner: string;
  confidence: number;
  predictedScore: string;
  reasoning: string;
  keyFactors: string[];
  generatedAt: string;
}
