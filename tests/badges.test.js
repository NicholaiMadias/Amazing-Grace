import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadBadges,
  resetBadges,
  onLevelComplete,
  BADGE_TIERS,
} from '../public/badges.js';

beforeEach(() => {
  localStorage.clear();
  resetBadges();
});

describe('BADGE_TIERS', () => {
  it('contains 6 tiers', () => {
    expect(BADGE_TIERS).toHaveLength(6);
  });

  it('each tier has level, name, emoji, and desc properties', () => {
    BADGE_TIERS.forEach(tier => {
      expect(tier).toHaveProperty('level');
      expect(tier).toHaveProperty('name');
      expect(tier).toHaveProperty('emoji');
      expect(tier).toHaveProperty('desc');
    });
  });

  it('tiers are ordered by ascending level', () => {
    for (let i = 1; i < BADGE_TIERS.length; i++) {
      expect(BADGE_TIERS[i].level).toBeGreaterThan(BADGE_TIERS[i - 1].level);
    }
  });

  it('first tier is Seedling at level 1', () => {
    expect(BADGE_TIERS[0]).toMatchObject({ level: 1, name: 'Seedling' });
  });

  it('last tier is Supernova at level 15', () => {
    const last = BADGE_TIERS[BADGE_TIERS.length - 1];
    expect(last).toMatchObject({ level: 15, name: 'Supernova' });
  });
});

describe('loadBadges', () => {
  it('returns an empty array when nothing is stored', () => {
    expect(loadBadges()).toEqual([]);
  });

  it('returns the previously stored badge names', () => {
    localStorage.setItem('glm-badges', JSON.stringify(['Seedling', 'Charged']));
    expect(loadBadges()).toEqual(['Seedling', 'Charged']);
  });

  it('returns an empty array for corrupt JSON', () => {
    localStorage.setItem('glm-badges', '{{BAD}}');
    expect(loadBadges()).toEqual([]);
  });

  it('filters out non-string entries from stored data', () => {
    localStorage.setItem('glm-badges', JSON.stringify(['Seedling', 42, null, 'Charged']));
    expect(loadBadges()).toEqual(['Seedling', 'Charged']);
  });

  it('returns an empty array when stored value is not an array', () => {
    localStorage.setItem('glm-badges', JSON.stringify({ badge: 'Seedling' }));
    expect(loadBadges()).toEqual([]);
  });
});

describe('resetBadges', () => {
  it('clears all earned badges', () => {
    localStorage.setItem('glm-badges', JSON.stringify(['Seedling']));
    loadBadges(); // populate in-memory state
    resetBadges();
    expect(loadBadges()).toEqual([]);
  });

  it('removes the glm-badges key from localStorage', () => {
    localStorage.setItem('glm-badges', JSON.stringify(['Seedling']));
    resetBadges();
    expect(localStorage.getItem('glm-badges')).toBeNull();
  });
});

describe('onLevelComplete', () => {
  it('unlocks the Seedling badge when level 1 is completed', () => {
    onLevelComplete(1, 0, null, null);
    expect(loadBadges()).toContain('Seedling');
  });

  it('unlocks Seedling and Charged when level 3 is completed', () => {
    onLevelComplete(3, 700, null, null);
    const badges = loadBadges();
    expect(badges).toContain('Seedling');
    expect(badges).toContain('Charged');
  });

  it('unlocks all tiers up to and including the completed level', () => {
    onLevelComplete(5, 1600, null, null);
    const badges = loadBadges();
    // Tiers with level <= 5: Seedling(1), Charged(3), On Fire(5)
    expect(badges).toContain('Seedling');
    expect(badges).toContain('Charged');
    expect(badges).toContain('On Fire');
  });

  it('does not unlock tiers above the completed level', () => {
    onLevelComplete(3, 700, null, null);
    const badges = loadBadges();
    expect(badges).not.toContain('On Fire');
    expect(badges).not.toContain('Diamond');
    expect(badges).not.toContain('Champion');
    expect(badges).not.toContain('Supernova');
  });

  it('does not award the same badge twice on repeated completions', () => {
    onLevelComplete(1, 0, null, null);
    onLevelComplete(1, 0, null, null);
    const badges = loadBadges();
    const seedlingCount = badges.filter(b => b === 'Seedling').length;
    expect(seedlingCount).toBe(1);
  });

  it('persists earned badges to localStorage', () => {
    onLevelComplete(1, 0, null, null);
    const raw = JSON.parse(localStorage.getItem('glm-badges'));
    expect(Array.isArray(raw)).toBe(true);
    expect(raw).toContain('Seedling');
  });

  it('accumulates badges across multiple level completions', () => {
    onLevelComplete(1, 200, null, null);
    onLevelComplete(3, 700, null, null);
    const badges = loadBadges();
    expect(badges).toContain('Seedling');
    expect(badges).toContain('Charged');
  });
});
