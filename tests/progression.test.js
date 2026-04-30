import { describe, it, expect, beforeEach } from 'vitest';
import { getProgress, recordLevelComplete } from '../public/progression.js';

beforeEach(() => {
  localStorage.clear();
});

describe('getProgress', () => {
  it('returns { total: 0 } when nothing is stored', () => {
    expect(getProgress()).toEqual({ total: 0 });
  });

  it('returns persisted progress after a save', () => {
    localStorage.setItem('glm-progress', JSON.stringify({ total: 4 }));
    expect(getProgress()).toEqual({ total: 4 });
  });

  it('returns { total: 0 } for corrupt JSON', () => {
    localStorage.setItem('glm-progress', '{{BAD}}');
    expect(getProgress()).toEqual({ total: 0 });
  });

  it('returns { total: 0 } when stored value is not a finite number', () => {
    localStorage.setItem('glm-progress', JSON.stringify({ total: 'high' }));
    expect(getProgress()).toEqual({ total: 0 });
  });

  it('returns { total: 0 } when stored value is an array', () => {
    localStorage.setItem('glm-progress', JSON.stringify([1, 2, 3]));
    expect(getProgress()).toEqual({ total: 0 });
  });

  it('returns { total: 0 } when stored value is null', () => {
    localStorage.setItem('glm-progress', 'null');
    expect(getProgress()).toEqual({ total: 0 });
  });
});

describe('recordLevelComplete', () => {
  it('updates total when the new level is higher', () => {
    recordLevelComplete(3);
    expect(getProgress().total).toBe(3);
  });

  it('does not decrease total when a lower level is reported', () => {
    recordLevelComplete(5);
    recordLevelComplete(2);
    expect(getProgress().total).toBe(5);
  });

  it('does not change total when the same level is reported again', () => {
    recordLevelComplete(4);
    recordLevelComplete(4);
    expect(getProgress().total).toBe(4);
  });

  it('advances total monotonically across multiple calls', () => {
    recordLevelComplete(1);
    expect(getProgress().total).toBe(1);
    recordLevelComplete(3);
    expect(getProgress().total).toBe(3);
    recordLevelComplete(2);
    expect(getProgress().total).toBe(3);
    recordLevelComplete(5);
    expect(getProgress().total).toBe(5);
  });

  it('persists the updated total in localStorage', () => {
    recordLevelComplete(7);
    const raw = JSON.parse(localStorage.getItem('glm-progress'));
    expect(raw).toEqual({ total: 7 });
  });
});
