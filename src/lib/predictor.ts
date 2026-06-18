import Anthropic from '@anthropic-ai/sdk';
import { MatchPrediction } from '@/types/prediction';
import { CrystalBallPrediction, CrystalBallQuestion } from '@/types/crystal-ball';
import { Match } from '@/types/match';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function predictMatch(match: Match, context: string): Promise<MatchPrediction> {
  const prompt = `You are a League of Legends esports analyst. Based on the following data, predict the outcome of this match.

Match: ${match.team1.name} vs ${match.team2.name}
Tournament: ${match.tournament}
Stage: ${match.stage}

Context and recent data:
${context}

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "predictedWinner": "team name exactly as shown above",
  "confidence": 65,
  "predictedScore": "3-1",
  "reasoning": "2-3 sentence explanation",
  "keyFactors": ["factor1", "factor2", "factor3"]
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse prediction response');
  const result = JSON.parse(jsonMatch[0]);

  return {
    matchId: match.id,
    predictedWinner: result.predictedWinner,
    confidence: result.confidence,
    predictedScore: result.predictedScore,
    reasoning: result.reasoning,
    keyFactors: result.keyFactors,
    generatedAt: new Date().toISOString(),
  };
}

export async function predictCrystalBall(
  question: CrystalBallQuestion,
  tournamentContext: string
): Promise<CrystalBallPrediction> {
  const prompt = `You are a League of Legends esports analyst specializing in statistical predictions. Answer this Pick'em Crystal Ball question for MSI.

Question: ${question.question}
Category: ${question.category}
Points: ${question.points}

Tournament context:
${tournamentContext}

Consider historical MSI/Worlds data, current meta, team/player tendencies, and champion balance.

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "answer": "your specific prediction (champion name, player name, team name, or number)",
  "confidence": 65,
  "reasoning": "2-3 sentence explanation with data points"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse crystal ball response');
  const result = JSON.parse(jsonMatch[0]);

  return {
    questionId: question.id,
    answer: result.answer,
    confidence: result.confidence,
    reasoning: result.reasoning,
    generatedAt: new Date().toISOString(),
  };
}
