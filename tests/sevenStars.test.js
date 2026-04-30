import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { unlockStar } from '../sevenStars.js';

beforeEach(() => {
  localStorage.clear();
  // Provide a minimal document.body so showStarToast can append without throwing
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('unlockStar', () => {
  it('stores a newly unlocked star id in localStorage', () => {
    unlockStar('gold');
    const stored = JSON.parse(localStorage.getItem('stars'));
    expect(stored).toContain('gold');
  });

  it('does not duplicate a star that is already unlocked', () => {
    unlockStar('silver');
    unlockStar('silver');
    const stored = JSON.parse(localStorage.getItem('stars'));
    const count = stored.filter(id => id === 'silver').length;
    expect(count).toBe(1);
  });

  it('can unlock multiple different stars independently', () => {
    unlockStar('gold');
    unlockStar('sapphire');
    unlockStar('emerald');
    const stored = JSON.parse(localStorage.getItem('stars'));
    expect(stored).toContain('gold');
    expect(stored).toContain('sapphire');
    expect(stored).toContain('emerald');
  });

  it('persists stars across multiple calls', () => {
    unlockStar('ruby');
    unlockStar('amethyst');
    const stored = JSON.parse(localStorage.getItem('stars'));
    expect(stored.length).toBe(2);
  });

  it('handles an unknown star id without throwing', () => {
    expect(() => unlockStar('unknown_star')).not.toThrow();
    const stored = JSON.parse(localStorage.getItem('stars'));
    expect(stored).toContain('unknown_star');
  });

  it('creates a toast element in the DOM when a star is first unlocked', () => {
    vi.useFakeTimers();
    unlockStar('obsidian');
    // Toast should be appended before auto-removal timeout fires
    expect(document.body.children.length).toBeGreaterThan(0);
    vi.runAllTimers();
    // Toast removes itself after 2500 ms
    expect(document.body.children.length).toBe(0);
    vi.useRealTimers();
  });

  it('does not create a toast element when the star is already unlocked', () => {
    vi.useFakeTimers();
    unlockStar('gold');
    vi.runAllTimers(); // clear first toast — body should now be empty
    expect(document.body.children.length).toBe(0);
    unlockStar('gold'); // already unlocked — no toast should be added
    expect(document.body.children.length).toBe(0);
    vi.useRealTimers();
  });

  it('preserves previously unlocked stars when a new star is added', () => {
    localStorage.setItem('stars', JSON.stringify(['gold', 'silver']));
    unlockStar('sapphire');
    const stored = JSON.parse(localStorage.getItem('stars'));
    expect(stored).toContain('gold');
    expect(stored).toContain('silver');
    expect(stored).toContain('sapphire');
  });
});
