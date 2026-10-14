import { ScoreResult } from './types';

const USE_MOCK = true; // switch to false when the real backend is ready
const BASE_URL = 'http://192.168.0.10:8000'; // later: your laptop's IP address

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function levelFor(score: number): ScoreResult['level'] {
  if (score >= 70) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

function mockResult(body: object): ScoreResult {
  const text = JSON.stringify(body).toLowerCase();
  const risky = ['kyc', 'urgent', 'click', 'http', 'collect', 'lottery'].some((w) =>
    text.includes(w)
  );
  const score = risky ? 87 : 12;
  return {
    risk_score: score,
    level: levelFor(score),
    reasons: risky
      ? [
          { code: 'LOOKALIKE_DOMAIN', text: "Link imitates a bank's website", weight: 0.45 },
          { code: 'URGENT_LANGUAGE', text: "Uses urgent wording like 'act now'", weight: 0.31 },
        ]
      : [{ code: 'NO_SIGNALS', text: 'No suspicious patterns found', weight: 0.1 }],
  };
}

async function post(path: string, body: object): Promise<ScoreResult> {
  if (USE_MOCK) {
    await sleep(800); // pretend the server is thinking
    return mockResult(body);
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? 'Request failed');
  }
  return res.json();
}

export const scoreMessage = (text: string) =>
  post('/score/message', { text, language: 'auto' });

export const scorePayee = (
  upi_id: string,
  payee_name: string,
  request_type: 'pay' | 'collect'
) => post('/score/payee', { upi_id, payee_name, request_type });

export const scoreTransaction = (
  amount: number,
  hour_of_day: number,
  is_new_payee: boolean,
  payee_upi_id: string
) => post('/score/transaction', { amount, hour_of_day, is_new_payee, payee_upi_id });