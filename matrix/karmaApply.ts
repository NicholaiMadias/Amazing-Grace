// karmaApply.ts
import { applyReputationEvent } from './reputationEngine';
import { resolveKarmaAction, type KarmaAction } from './karmaEconomy';
import type { ReputationVector } from './types';

export interface MatrixState {
  karma: number;
  community: number;
  wisdom: number;
  integrity: number;
  [key: string]: number;
}

export interface TelemetryEvent {
  type: string;
  value: number;
  ts: number;
  source: string;
}

export function applyTelemetryEvent(
  matrixState: MatrixState,
  event: TelemetryEvent
): void {
  if (event.type in matrixState) {
    matrixState[event.type] += event.value;
  }
}

export function applyKarmaAction(
  matrixState: MatrixState,
  rep: ReputationVector,
  action: KarmaAction
): ReputationVector {
  const rule = resolveKarmaAction(action);

  if (rule.karmaDelta !== 0) {
    applyTelemetryEvent(matrixState, {
      type: 'karma',
      value: rule.karmaDelta,
      ts: Date.now(),
      source: 'karma-economy'
    });
  }

  if (rule.communityDelta !== 0) {
    applyTelemetryEvent(matrixState, {
      type: 'community',
      value: rule.communityDelta,
      ts: Date.now(),
      source: 'karma-economy'
    });
  }

  rep = applyReputationEvent(rep, {
    type: 'karma',
    value: rule.karmaDelta,
    ts: Date.now(),
    source: 'karma-economy'
  });

  rep = applyReputationEvent(rep, {
    type: 'community',
    value: rule.communityDelta,
    ts: Date.now(),
    source: 'karma-economy'
  });

  return rep;
}
