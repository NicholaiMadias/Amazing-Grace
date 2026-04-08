// reputationEngine.ts
import type { ReputationVector } from './types';

export type ReputationEventType =
  | 'karma'
  | 'community'
  | 'wisdom'
  | 'integrity';

export interface ReputationEvent {
  type: ReputationEventType;
  value: number; // positive or negative
  ts: number;
  source: string;
}

export function applyReputationEvent(
  rep: ReputationVector,
  event: ReputationEvent
): ReputationVector {
  const next = { ...rep };

  switch (event.type) {
    case 'karma':
      next.karma += event.value;
      break;
    case 'community':
      next.community += event.value;
      break;
    case 'wisdom':
      next.wisdom += event.value;
      break;
    case 'integrity':
      next.integrity += event.value;
      break;
  }

  // Clamp base dimensions
  (['karma', 'community', 'wisdom', 'integrity'] as const).forEach(k => {
    next[k] = Math.max(-1000, Math.min(1000, next[k]));
  });

  // Derive credit & trust
  next.creditScore = Math.round(
    0.4 * normalize(next.integrity) +
    0.3 * normalize(next.karma) +
    0.3 * normalize(next.wisdom)
  );

  next.trustScore = Math.round(
    0.5 * normalize(next.community) +
    0.3 * normalize(next.integrity) +
    0.2 * normalize(next.karma)
  );

  return next;
}

function normalize(v: number): number {
  // Map [-1000, 1000] → [0, 100]
  return ((v + 1000) / 2000) * 100;
}
