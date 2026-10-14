export type RiskLevel = 'low' | 'medium' | 'high';

export type Reason = { code: string; text: string; weight: number };

export type ScoreResult = {
  risk_score: number;
  level: RiskLevel;
  reasons: Reason[];
};