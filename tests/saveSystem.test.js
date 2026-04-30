import { describe, it, expect, beforeEach } from 'vitest';
import { saveGame, loadGame } from '../saveSystem.js';

beforeEach(() => {
  localStorage.clear();
});

describe('saveGame / loadGame', () => {
  it('saves and loads data for a named slot', () => {
    const data = { level: 3, score: 700 };
    saveGame('slot1', data);
    expect(loadGame('slot1')).toEqual(data);
  });

  it('returns null when no save exists for a slot', () => {
    expect(loadGame('empty')).toBeNull();
  });

  it('overwrites an existing save in the same slot', () => {
    saveGame('slot1', { level: 1, score: 100 });
    saveGame('slot1', { level: 2, score: 400 });
    expect(loadGame('slot1')).toEqual({ level: 2, score: 400 });
  });

  it('keeps saves in separate slots independent', () => {
    saveGame('slot1', { level: 1 });
    saveGame('slot2', { level: 5 });
    expect(loadGame('slot1')).toEqual({ level: 1 });
    expect(loadGame('slot2')).toEqual({ level: 5 });
  });

  it('falls back to "slot1" when slot is falsy (null)', () => {
    saveGame(null, { level: 9 });
    expect(loadGame(null)).toEqual({ level: 9 });
  });

  it('falls back to "slot1" when slot is undefined', () => {
    saveGame(undefined, { score: 42 });
    expect(loadGame(undefined)).toEqual({ score: 42 });
  });

  it('persists complex nested objects', () => {
    const data = { grid: [[1, 2], [3, 4]], meta: { ts: 1234 } };
    saveGame('complex', data);
    expect(loadGame('complex')).toEqual(data);
  });

  it('returns null after localStorage is cleared', () => {
    saveGame('slot1', { level: 3 });
    localStorage.clear();
    expect(loadGame('slot1')).toBeNull();
  });

  it('handles corrupt localStorage data by returning null', () => {
    localStorage.setItem('matchmaker-saves', 'NOT_VALID_JSON{{{');
    expect(loadGame('slot1')).toBeNull();
  });
});
