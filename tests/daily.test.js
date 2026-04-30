import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getTodayChallenge,
  updateDailyProgress,
  checkDailyCompletion,
} from '../daily.js';

const KNOWN_IDS = ['score500', 'clear20', 'reach3'];

beforeEach(() => {
  localStorage.clear();
});

describe('getTodayChallenge', () => {
  it('returns an object with date, challenge, and progress keys', () => {
    const result = getTodayChallenge();
    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('challenge');
    expect(result).toHaveProperty('progress');
  });

  it('challenge has id and desc fields', () => {
    const { challenge } = getTodayChallenge();
    expect(challenge).toHaveProperty('id');
    expect(challenge).toHaveProperty('desc');
    expect(KNOWN_IDS).toContain(challenge.id);
  });

  it('date matches today', () => {
    const today = new Date().toDateString();
    expect(getTodayChallenge().date).toBe(today);
  });

  it('returns the same challenge when called twice on the same day', () => {
    const first = getTodayChallenge();
    const second = getTodayChallenge();
    expect(second.challenge.id).toBe(first.challenge.id);
  });

  it('creates a new challenge when the stored date differs from today', () => {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    localStorage.setItem('daily', JSON.stringify({
      date: yesterday,
      challenge: { id: 'score500', desc: 'old' },
      progress: {},
    }));
    const result = getTodayChallenge();
    expect(result.date).toBe(new Date().toDateString());
  });

  it('progress is an empty object on a fresh challenge', () => {
    expect(getTodayChallenge().progress).toEqual({});
  });
});

describe('updateDailyProgress', () => {
  it('stores a progress key-value pair', () => {
    getTodayChallenge(); // seed
    updateDailyProgress('score', 300);
    const saved = JSON.parse(localStorage.getItem('daily'));
    expect(saved.progress.score).toBe(300);
  });

  it('overwrites an existing progress entry', () => {
    getTodayChallenge();
    updateDailyProgress('score', 100);
    updateDailyProgress('score', 900);
    const saved = JSON.parse(localStorage.getItem('daily'));
    expect(saved.progress.score).toBe(900);
  });

  it('can store multiple independent progress keys', () => {
    getTodayChallenge();
    updateDailyProgress('score', 500);
    updateDailyProgress('clears', 25);
    const saved = JSON.parse(localStorage.getItem('daily'));
    expect(saved.progress.score).toBe(500);
    expect(saved.progress.clears).toBe(25);
  });
});

describe('checkDailyCompletion — score500', () => {
  beforeEach(() => {
    localStorage.setItem('daily', JSON.stringify({
      date: new Date().toDateString(),
      challenge: { id: 'score500', desc: 'Score 500 points today' },
      progress: {},
    }));
  });

  it('returns true when score >= 500', () => {
    expect(checkDailyCompletion({ score: 500, level: 1, clears: 0 })).toBe(true);
  });

  it('returns true when score exceeds 500', () => {
    expect(checkDailyCompletion({ score: 999, level: 1, clears: 0 })).toBe(true);
  });

  it('returns false when score < 500', () => {
    expect(checkDailyCompletion({ score: 499, level: 1, clears: 0 })).toBe(false);
  });

  it('marks dailyComplete in localStorage on success', () => {
    checkDailyCompletion({ score: 500, level: 1, clears: 0 });
    expect(localStorage.getItem('dailyComplete')).toBe('true');
  });

  it('does not set dailyComplete in localStorage on failure', () => {
    checkDailyCompletion({ score: 100, level: 1, clears: 0 });
    expect(localStorage.getItem('dailyComplete')).toBeNull();
  });
});

describe('checkDailyCompletion — clear20', () => {
  beforeEach(() => {
    localStorage.setItem('daily', JSON.stringify({
      date: new Date().toDateString(),
      challenge: { id: 'clear20', desc: 'Clear 20 gems today' },
      progress: {},
    }));
  });

  it('returns true when clears >= 20', () => {
    expect(checkDailyCompletion({ score: 0, level: 1, clears: 20 })).toBe(true);
  });

  it('returns false when clears < 20', () => {
    expect(checkDailyCompletion({ score: 0, level: 1, clears: 19 })).toBe(false);
  });
});

describe('checkDailyCompletion — reach3', () => {
  beforeEach(() => {
    localStorage.setItem('daily', JSON.stringify({
      date: new Date().toDateString(),
      challenge: { id: 'reach3', desc: 'Reach level 3 today' },
      progress: {},
    }));
  });

  it('returns true when level >= 3', () => {
    expect(checkDailyCompletion({ score: 0, level: 3, clears: 0 })).toBe(true);
  });

  it('returns false when level < 3', () => {
    expect(checkDailyCompletion({ score: 0, level: 2, clears: 0 })).toBe(false);
  });
});

describe('checkDailyCompletion — unknown challenge id', () => {
  it('returns false for an unrecognised challenge id', () => {
    localStorage.setItem('daily', JSON.stringify({
      date: new Date().toDateString(),
      challenge: { id: 'unknown_challenge', desc: 'Do something' },
      progress: {},
    }));
    expect(checkDailyCompletion({ score: 9999, level: 99, clears: 99 })).toBe(false);
  });

  it('returns false when challenge id is missing', () => {
    localStorage.setItem('daily', JSON.stringify({
      date: new Date().toDateString(),
      challenge: {},
      progress: {},
    }));
    expect(checkDailyCompletion({ score: 9999, level: 99, clears: 99 })).toBe(false);
  });
});
