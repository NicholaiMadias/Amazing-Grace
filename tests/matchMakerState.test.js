import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialGrid,
  canSwap,
  applySwap,
  findMatches,
  clearMatches,
  applyGravity,
  GRID_SIZE,
} from '../matchMakerState.js';

const GEM_TYPES = ['heart', 'star', 'cross', 'flame', 'drop'];

/** Build a 7×7 grid with no matches using a 5-cycle diagonal pattern. */
function noMatchGrid() {
  return Array.from({ length: GRID_SIZE }, (_, r) =>
    Array.from({ length: GRID_SIZE }, (_, c) => GEM_TYPES[(r + c) % GEM_TYPES.length])
  );
}

describe('GRID_SIZE', () => {
  it('is 7', () => {
    expect(GRID_SIZE).toBe(7);
  });
});

describe('createInitialGrid', () => {
  it('creates a 7×7 grid', () => {
    const grid = createInitialGrid();
    expect(grid.length).toBe(GRID_SIZE);
    grid.forEach(row => expect(row.length).toBe(GRID_SIZE));
  });

  it('contains no pre-existing matches', () => {
    const grid = createInitialGrid();
    expect(findMatches(grid)).toHaveLength(0);
  });

  it('fills every cell with a valid gem type', () => {
    const grid = createInitialGrid();
    grid.flat().forEach(gem => expect(GEM_TYPES).toContain(gem));
  });

  it('produces different grids across calls (randomness)', () => {
    const a = createInitialGrid().flat().join(',');
    const b = createInitialGrid().flat().join(',');
    // Extremely unlikely to produce identical grids; guards against constant output
    // Run a few attempts before declaring them always equal
    let allSame = true;
    for (let i = 0; i < 5; i++) {
      if (createInitialGrid().flat().join(',') !== a) { allSame = false; break; }
    }
    expect(allSame).toBe(false);
  });
});

describe('canSwap', () => {
  const grid = noMatchGrid();

  it('allows a horizontal (same-row) adjacent swap', () => {
    expect(canSwap(grid, 0, 0, 0, 1)).toBe(true);
  });

  it('allows a vertical (same-col) adjacent swap', () => {
    expect(canSwap(grid, 0, 0, 1, 0)).toBe(true);
  });

  it('disallows a diagonal swap', () => {
    expect(canSwap(grid, 0, 0, 1, 1)).toBe(false);
  });

  it('disallows swapping a cell with itself', () => {
    expect(canSwap(grid, 1, 1, 1, 1)).toBe(false);
  });

  it('disallows a 2-step horizontal gap', () => {
    expect(canSwap(grid, 0, 0, 0, 2)).toBe(false);
  });

  it('disallows a 2-step vertical gap', () => {
    expect(canSwap(grid, 0, 0, 2, 0)).toBe(false);
  });

  it('allows swap at the last row boundary', () => {
    expect(canSwap(grid, 5, 3, 6, 3)).toBe(true);
  });
});

describe('applySwap', () => {
  it('exchanges the two targeted cells', () => {
    const grid = noMatchGrid();
    const a = grid[0][0];
    const b = grid[0][1];
    const next = applySwap(grid, 0, 0, 0, 1);
    expect(next[0][0]).toBe(b);
    expect(next[0][1]).toBe(a);
  });

  it('leaves unrelated cells unchanged', () => {
    const grid = noMatchGrid();
    const orig = grid[3][3];
    const next = applySwap(grid, 0, 0, 0, 1);
    expect(next[3][3]).toBe(orig);
  });

  it('does not mutate the original grid', () => {
    const grid = noMatchGrid();
    const orig00 = grid[0][0];
    const orig01 = grid[0][1];
    applySwap(grid, 0, 0, 0, 1);
    expect(grid[0][0]).toBe(orig00);
    expect(grid[0][1]).toBe(orig01);
  });

  it('handles a vertical swap', () => {
    const grid = noMatchGrid();
    const a = grid[0][0];
    const b = grid[1][0];
    const next = applySwap(grid, 0, 0, 1, 0);
    expect(next[0][0]).toBe(b);
    expect(next[1][0]).toBe(a);
  });
});

describe('findMatches', () => {
  it('returns an empty array when there are no matches', () => {
    const grid = noMatchGrid();
    expect(findMatches(grid)).toHaveLength(0);
  });

  it('detects a horizontal 3-match in row 0', () => {
    const grid = noMatchGrid();
    grid[0][0] = 'flame';
    grid[0][1] = 'flame';
    grid[0][2] = 'flame';
    const matches = findMatches(grid);
    const row0 = matches.find(g => g.some(c => c.r === 0 && c.c === 0));
    expect(row0).toBeDefined();
    expect(row0.length).toBeGreaterThanOrEqual(3);
  });

  it('detects a vertical 3-match in column 6', () => {
    const grid = noMatchGrid();
    grid[0][6] = 'heart';
    grid[1][6] = 'heart';
    grid[2][6] = 'heart';
    const matches = findMatches(grid);
    const col6 = matches.find(g => g.some(c => c.c === 6 && c.r === 0));
    expect(col6).toBeDefined();
    expect(col6.length).toBeGreaterThanOrEqual(3);
  });

  it('detects a 4-gem horizontal match', () => {
    const grid = noMatchGrid();
    grid[3][0] = grid[3][1] = grid[3][2] = grid[3][3] = 'cross';
    const matches = findMatches(grid);
    const big = matches.find(g => g.length >= 4 && g.every(c => c.r === 3));
    expect(big).toBeDefined();
  });

  it('detects a 5-gem horizontal match', () => {
    const grid = noMatchGrid();
    for (let c = 0; c < 5; c++) grid[4][c] = 'star';
    const matches = findMatches(grid);
    const five = matches.find(g => g.length >= 5 && g.every(c => c.r === 4));
    expect(five).toBeDefined();
  });

  it('reports each match as an array of {r, c} objects', () => {
    const grid = noMatchGrid();
    grid[0][0] = grid[0][1] = grid[0][2] = 'drop';
    const matches = findMatches(grid);
    matches.forEach(group => {
      group.forEach(cell => {
        expect(cell).toHaveProperty('r');
        expect(cell).toHaveProperty('c');
      });
    });
  });
});

describe('clearMatches', () => {
  it('sets matched cells to null', () => {
    const grid = noMatchGrid();
    const cells = [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }];
    const next = clearMatches(grid, cells);
    cells.forEach(({ r, c }) => expect(next[r][c]).toBeNull());
  });

  it('leaves non-matched cells unchanged', () => {
    const grid = noMatchGrid();
    const orig = grid[3][3];
    const next = clearMatches(grid, [{ r: 0, c: 0 }]);
    expect(next[3][3]).toBe(orig);
  });

  it('does not mutate the original grid', () => {
    const grid = noMatchGrid();
    const orig = grid[0][0];
    clearMatches(grid, [{ r: 0, c: 0 }]);
    expect(grid[0][0]).toBe(orig);
  });

  it('places a plain string replacement at the specified position', () => {
    const grid = noMatchGrid();
    const next = clearMatches(grid, [{ r: 1, c: 1 }], [{ r: 1, c: 1, kind: 'star' }]);
    expect(next[1][1]).toBe('star');
  });

  it('places a special gem object replacement when special flag is set', () => {
    const grid = noMatchGrid();
    const next = clearMatches(grid, [{ r: 2, c: 2 }], [{ r: 2, c: 2, kind: 'flame', special: 'bomb' }]);
    expect(next[2][2]).toEqual({ kind: 'flame', special: 'bomb' });
  });

  it('handles an empty matchCells array without error', () => {
    const grid = noMatchGrid();
    const next = clearMatches(grid, []);
    expect(next).toEqual(grid);
  });
});

describe('applyGravity', () => {
  it('fills any null cell so no cell remains null', () => {
    const grid = noMatchGrid();
    grid[0][0] = null;
    grid[3][4] = null;
    const next = applyGravity(grid);
    next.flat().forEach(cell => expect(cell).not.toBeNull());
  });

  it('drops existing gems toward the bottom of each column', () => {
    // Column 0: top cell null, rest are 'cross'
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('cross'));
    grid[0][0] = null;
    const next = applyGravity(grid);
    // All 6 cross gems should remain in rows 1-6
    for (let r = 1; r < GRID_SIZE; r++) {
      expect(next[r][0]).toBe('cross');
    }
    // Top row is now filled with a new random gem (not null)
    expect(next[0][0]).not.toBeNull();
  });

  it('preserves the relative order of surviving gems in a column', () => {
    // Set column 2 to a known sequence with one null in the middle
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('drop'));
    // column 2 top-to-bottom: heart, null, star, cross, flame, drop, drop
    grid[0][2] = 'heart';
    grid[1][2] = null;
    grid[2][2] = 'star';
    grid[3][2] = 'cross';
    grid[4][2] = 'flame';
    grid[5][2] = 'drop';
    grid[6][2] = 'drop';

    const next = applyGravity(grid);
    // Surviving gems from bottom up: drop, drop, flame, cross, star, heart (6 gems)
    // After gravity they occupy rows 6-1; row 0 gets a new random gem
    expect(next[6][2]).toBe('drop');
    expect(next[5][2]).toBe('drop');
    expect(next[4][2]).toBe('flame');
    expect(next[3][2]).toBe('cross');
    expect(next[2][2]).toBe('star');
    expect(next[1][2]).toBe('heart');
    expect(next[0][2]).not.toBeNull(); // new random fill
  });

  it('does not mutate the original grid', () => {
    const grid = noMatchGrid();
    grid[0][0] = null;
    applyGravity(grid);
    expect(grid[0][0]).toBeNull();
  });

  it('handles a fully null column by filling it with valid gems', () => {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('heart'));
    for (let r = 0; r < GRID_SIZE; r++) grid[r][0] = null;
    const next = applyGravity(grid);
    for (let r = 0; r < GRID_SIZE; r++) {
      expect(next[r][0]).not.toBeNull();
      expect(GEM_TYPES).toContain(next[r][0]);
    }
  });
});
