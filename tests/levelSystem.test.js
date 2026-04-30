import { describe, it, expect } from 'vitest';
import { getLevelConfig, checkLevelUp, MAX_LEVEL } from '../levelSystem.js';

describe('MAX_LEVEL', () => {
  it('equals the number of defined levels (5)', () => {
    expect(MAX_LEVEL).toBe(5);
  });
});

describe('getLevelConfig', () => {
  it('returns the correct config for level 1', () => {
    expect(getLevelConfig(1)).toEqual({ level: 1, target: 200, moves: 20 });
  });

  it('returns the correct config for level 3', () => {
    expect(getLevelConfig(3)).toEqual({ level: 3, target: 700, moves: 24 });
  });

  it('returns the correct config for level 5 (last)', () => {
    expect(getLevelConfig(5)).toEqual({ level: 5, target: 1600, moves: 28 });
  });

  it('falls back to the last level config for an out-of-range level', () => {
    const fallback = getLevelConfig(99);
    expect(fallback).toEqual({ level: 5, target: 1600, moves: 28 });
  });

  it('falls back to the last level config for level 0', () => {
    const fallback = getLevelConfig(0);
    expect(fallback.level).toBe(5);
  });

  it('falls back for a negative level', () => {
    const fallback = getLevelConfig(-1);
    expect(fallback.level).toBe(5);
  });
});

describe('checkLevelUp', () => {
  it('returns true when score exactly meets the target', () => {
    expect(checkLevelUp(200, 1)).toBe(true);
  });

  it('returns true when score exceeds the target', () => {
    expect(checkLevelUp(999, 1)).toBe(true);
  });

  it('returns false when score is one below the target', () => {
    expect(checkLevelUp(199, 1)).toBe(false);
  });

  it('returns false for score 0 on level 2', () => {
    expect(checkLevelUp(0, 2)).toBe(false);
  });

  it('returns true when score meets level 5 target', () => {
    expect(checkLevelUp(1600, 5)).toBe(true);
  });

  it('returns false when score is below level 5 target', () => {
    expect(checkLevelUp(1599, 5)).toBe(false);
  });
});
