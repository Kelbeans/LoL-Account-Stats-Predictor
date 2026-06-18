import { MatchPrediction } from '@/types/prediction';
import { CrystalBallPrediction, CrystalBallQuestion } from '@/types/crystal-ball';
import { Match } from '@/types/match';

const BEDROCK_BASE = process.env.ANTHROPIC_BASE_URL || 'https://rocketpartners.gateway.codevine.ai/bedrock/v1';
const API_KEY = process.env.ANTHROPIC_API_KEY!;
const MODEL_ID = 'us.anthropic.claude-sonnet-4-20250514-v1:0';

async function callBedrock(messages: { role: string; content: string }[], maxTokens = 1024): Promise<string> {
  const url = `${BEDROCK_BASE}/model/${MODEL_ID}/invoke`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: maxTokens,
      messages,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Bedrock API error (${res.status}): ${errBody}`);
  }

  const data = await res.json();

  if (data.content && Array.isArray(data.content) && data.content.length > 0) {
    const block = data.content[0];
    if (block.type === 'text') return block.text;
  }

  throw new Error(`Unexpected response shape: ${JSON.stringify(data).slice(0, 300)}`);
}

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

  const text = await callBedrock([{ role: 'user', content: prompt }]);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse prediction response from: ' + text.slice(0, 200));
  const result = JSON.parse(jsonMatch[0]);

  return {
    matchId: match.id,
    predictedWinner: result.predictedWinner,
    confidence: result.confidence,
    predictedScore: result.predictedScore,
    reasoning: result.reasoning,
    keyFactors: result.keyFactors || [],
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

  const text = await callBedrock([{ role: 'user', content: prompt }]);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse crystal ball response from: ' + text.slice(0, 200));
  const result = JSON.parse(jsonMatch[0]);

  return {
    questionId: question.id,
    answer: result.answer,
    confidence: result.confidence,
    reasoning: result.reasoning,
    generatedAt: new Date().toISOString(),
  };
}
