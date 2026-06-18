import { MatchPrediction } from '@/types/prediction';
import { CrystalBallPrediction, CrystalBallQuestion } from '@/types/crystal-ball';
import { Match } from '@/types/match';

const BEDROCK_BASE = process.env.ANTHROPIC_BASE_URL || 'https://rocketpartners.gateway.codevine.ai/bedrock/v1';
const API_KEY = process.env.ANTHROPIC_API_KEY!;
const MODEL_ID = 'zai.glm-5';

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

  if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
    const choice = data.choices[0];
    if (choice.message && typeof choice.message.content === 'string') {
      return choice.message.content;
    }
  }

  throw new Error(`Unexpected response shape: ${JSON.stringify(data).slice(0, 300)}`);
}

function parseJsonResponse(text: string): Record<string, unknown> {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response: ' + text.slice(0, 200));

  let jsonStr = jsonMatch[0];

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Try fixing common issues: unescaped single quotes, trailing commas
    jsonStr = jsonStr
      .replace(/(?<=:\s*"[^"]*)'(?=[^"]*")/g, "\\'")
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    try {
      return JSON.parse(jsonStr);
    } catch {
      // Last resort: extract fields manually
      const winner = text.match(/"predictedWinner"\s*:\s*"([^"]+)"/)?.[1];
      const confidence = text.match(/"confidence"\s*:\s*(\d+)/)?.[1];
      const score = text.match(/"predictedScore"\s*:\s*"([^"]+)"/)?.[1];
      const reasoning = text.match(/"reasoning"\s*:\s*"([^"]*?)"/)?.[1];
      const answer = text.match(/"answer"\s*:\s*"([^"]+)"/)?.[1];

      return {
        predictedWinner: winner || '',
        confidence: confidence ? parseInt(confidence) : 50,
        predictedScore: score || '3-2',
        reasoning: reasoning || 'Prediction generated based on available data.',
        keyFactors: [],
        answer: answer || '',
      };
    }
  }
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
  const result = parseJsonResponse(text);

  return {
    matchId: match.id,
    predictedWinner: String(result.predictedWinner || match.team1.name),
    confidence: Number(result.confidence) || 50,
    predictedScore: String(result.predictedScore || '3-2'),
    reasoning: String(result.reasoning || 'Prediction generated.'),
    keyFactors: Array.isArray(result.keyFactors) ? result.keyFactors.map(String) : [],
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
  const result = parseJsonResponse(text);

  return {
    questionId: question.id,
    answer: String(result.answer || 'Unknown'),
    confidence: Number(result.confidence) || 50,
    reasoning: String(result.reasoning || 'Prediction generated.'),
    generatedAt: new Date().toISOString(),
  };
}
