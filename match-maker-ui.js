/**
 * match-maker-ui.js — Game UI Layer for Match Maker
 * Renders the 7×7 grid, handles input (click, touch, keyboard),
 * animates cascades, manages levels, and updates the HUD + Conscience bars.
 * (c) 2026 NicholaiMadias — MIT License
 */

import { GRID_SIZE, createInitialGrid, canSwap, applySwap, findMatches, clearMatches, applyGravity, clearSupernovaAt } from './matchMakerState.js';
import { onLevelComplete } from './badges.js';
import { saveGame, loadGame } from './saveSystem.js';
import { getLevelConfig, checkLevelUp, MAX_LEVEL } from './levelSystem.js';
import { updateDailyProgress, checkDailyCompletion } from './daily.js';
import { unlockStar } from './sevenStars.js';

const COLS = GRID_SIZE;
const ROWS = GRID_SIZE;
const CASCADE_DELAY = 200;
const BASE_POINTS = 50;
const CHAIN_BONUS = 25;
const SUPERNOVA_BONUS = 500;
const CONSCIENCE_KEYS = ['empathy', 'justice', 'wisdom', 'growth'];

const GEM_DISPLAY = {
  heart: { emoji: '❤️', cls: 'gem-heart', label: 'Heart' },
  star:  { emoji: '⭐', cls: 'gem-star',  label: 'Star'  },
  cross: { emoji: '✝️', cls: 'gem-cross', label: 'Cross' },
  flame: { emoji: '🔥', cls: 'gem-flame', label: 'Flame' },
  drop:  { emoji: '💧', cls: 'gem-drop',  label: 'Drop'  }
};

let grid         = [];
let score        = 0;
let moves        = 0;
let level        = 1;
let selected     = null;
let locked       = false;
let conscience   = { empathy: 0, justice: 0, wisdom: 0, growth: 0 };
let totalClears  = 0;
let combo        = 0;
let explosions   = 0;
let daysPlayed   = 1;
let slotSelect   = null;

/** FX queue for supernova visual effects */
let fxQueue  = [];
let fxActive = false;

const dom = {};

function maybePlay(soundId) {
  if (typeof window !== 'undefined' && typeof window.play === 'function') {
    window.play(soundId);
  }
}

function maybeUnlock(key) {
  if (typeof window !== 'undefined' && typeof window.unlock === 'function') {
    window.unlock(key);
  }
}

function cacheDom() {
  dom.board      = document.getElementById('match-grid');
  dom.score      = document.getElementById('match-score');
  dom.level      = document.getElementById('match-level');
  dom.moves      = document.getElementById('match-moves');
  dom.msg        = document.getElementById('match-msg');
  dom.narrative  = document.getElementById('match-narrative');
  dom.barEmpathy = document.getElementById('mc-empathy-bar');
  dom.barJustice = document.getElementById('mc-justice-bar');
  dom.barWisdom  = document.getElementById('mc-wisdom-bar');
  dom.barGrowth  = document.getElementById('mc-growth-bar');
  dom.pctEmpathy = document.getElementById('mc-empathy');
  dom.pctJustice = document.getElementById('mc-justice');
  dom.pctWisdom  = document.getElementById('mc-wisdom');
  dom.pctGrowth  = document.getElementById('mc-growth');
  slotSelect     = document.getElementById('save-slot');
}

function safeSlotValue() {
  return slotSelect?.value || 'slot1';
}

function saveState() {
  saveGame(safeSlotValue(), {
    score,
    level,
    moves,
    grid,
    totalClears,
    combo,
    explosions,
    daysPlayed
  });
}

function loadState() {
  const data = loadGame(safeSlotValue());
  if (!data) return false;

  score       = data.score ?? 0;
  level       = data.level ?? 1;
  moves       = data.moves ?? getLevelConfig(level).moves;
  grid        = data.grid ?? createInitialGrid();
  totalClears = data.totalClears ?? 0;
  combo       = data.combo ?? 0;
  explosions  = data.explosions ?? 0;
  daysPlayed  = data.daysPlayed ?? 1;

  renderBoard();
  updateHUD();
  updateConscience();
  return true;
}

function updateDayStreak() {
  try {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('mm-streak') || '{}');
    let streak = 1;
    if (saved.date === today) {
      streak = saved.streak || 1;
    } else if (saved.date) {
      const last = new Date(saved.date);
      const diff = (new Date(today) - last) / (1000 * 60 * 60 * 24);
      streak = diff <= 1.5 ? (saved.streak || 1) + 1 : 1;
    }
    daysPlayed = streak;
    localStorage.setItem('mm-streak', JSON.stringify({ date: today, streak }));
  } catch (e) {
    daysPlayed = 1;
  }
}

function updateHUD() {
  if (dom.score) dom.score.textContent = score;
  if (dom.level) dom.level.textContent = level;
  if (dom.moves) dom.moves.textContent = moves;
}

function showMsg(text) {
  if (dom.msg) dom.msg.textContent = text;
}

/** Displays a contextual message in the narrative panel with a fade-out. */
function pushNarrative(text) {
  if (!dom.narrative) return;
  dom.narrative.textContent = text;
  dom.narrative.classList.add('narrative-visible');
  setTimeout(() => {
    if (dom.narrative) dom.narrative.classList.remove('narrative-visible');
  }, 2200);
}

/** Adds an FX event to the queue and starts processing if idle. */
function queueFx(type, cells) {
  fxQueue.push({ type, cells });
  if (!fxActive) processNextFx();
}

/** Processes one FX event: flashes the affected cells, then continues the queue. */
function processNextFx() {
  if (fxQueue.length === 0) { fxActive = false; return; }
  fxActive = true;
  const fx = fxQueue.shift();
  if (fx.type === 'supernova') {
    const cellEls = dom.board?.querySelectorAll('.gem-cell') || [];
    fx.cells.forEach(({ r, c }) => {
      const el = cellEls[r * COLS + c];
      if (el) el.classList.add('fx-supernova-flash');
    });
    setTimeout(() => {
      const cellEls2 = dom.board?.querySelectorAll('.gem-cell') || [];
      fx.cells.forEach(({ r, c }) => {
        const el = cellEls2[r * COLS + c];
        if (el) el.classList.remove('fx-supernova-flash');
      });
      processNextFx();
    }, 420);
  } else {
    processNextFx();
  }
}

function updateConscience() {
  CONSCIENCE_KEYS.forEach(key => {
    const val  = Math.min(conscience[key], 100);
    const bar  = dom['bar' + key.charAt(0).toUpperCase() + key.slice(1)];
    const pct  = dom['pct' + key.charAt(0).toUpperCase() + key.slice(1)];
    if (bar) bar.style.width = val + '%';
    if (pct) pct.textContent = val;
  });
}

function bumpConscience(matchCount) {
  const boost = Math.ceil(matchCount * 1.5);
  conscience.empathy = Math.min(100, conscience.empathy + boost + Math.floor(Math.random() * 3));
  conscience.justice = Math.min(100, conscience.justice + boost + Math.floor(Math.random() * 2));
  conscience.wisdom  = Math.min(100, conscience.wisdom  + Math.floor(boost * 0.8));
  conscience.growth  = Math.min(100, conscience.growth  + Math.floor(boost * 1.2));
  updateConscience();
}

function renderBoard() {
  if (!dom.board) return;
  dom.board.innerHTML = '';

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const gemValue    = grid[r]?.[c];
      const gemType     = typeof gemValue === 'string' ? gemValue : gemValue?.kind;
      const isSupernova = typeof gemValue === 'object' && gemValue?.special === 'supernova';
      const info        = GEM_DISPLAY[gemType] || { emoji: '?', cls: '', label: String(gemType) };
      const cell        = document.createElement('button');
      const idx         = r * COLS + c;

      cell.className = 'gem-cell ' + info.cls;
      if (isSupernova) cell.classList.add('gem-supernova');
      cell.textContent = info.emoji;
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', (isSupernova ? 'Supernova ' : '') + info.label + ', row ' + (r + 1) + ' column ' + (c + 1));
      cell.setAttribute('tabindex', idx === 0 ? '0' : '-1');

      if (selected && selected.row === r && selected.col === c) {
        cell.classList.add('selected');
      }

      cell.addEventListener('click', () => onCellClick(r, c));
      cell.addEventListener('keydown', (e) => onCellKey(e, r, c));
      dom.board.appendChild(cell);
    }
  }
}

function onCellClick(row, col) {
  if (locked) return;
  if (!selected) {
    selected = { row, col };
    renderBoard();
  } else if (selected.row === row && selected.col === col) {
    selected = null;
    renderBoard();
  } else if (canSwap(grid, selected.row, selected.col, row, col)) {
    attemptSwap(selected.row, selected.col, row, col);
  } else {
    selected = { row, col };
    renderBoard();
  }
}

function onCellKey(e, row, col) {
  let targetR = row;
  let targetC = col;

  switch (e.key) {
    case 'ArrowUp':    targetR = Math.max(0, row - 1); break;
    case 'ArrowDown':  targetR = Math.min(ROWS - 1, row + 1); break;
    case 'ArrowLeft':  targetC = Math.max(0, col - 1); break;
    case 'ArrowRight': targetC = Math.min(COLS - 1, col + 1); break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      onCellClick(row, col);
      return;
    case 'Escape':
      selected = null;
      renderBoard();
      return;
    default:
      return;
  }

  e.preventDefault();
  const idx = targetR * COLS + targetC;
  const cells = dom.board.querySelectorAll('.gem-cell');
  if (cells[idx]) cells[idx].focus();
}

function attemptSwap(r1, c1, r2, c2) {
  if (moves <= 0) {
    showMsg('No moves left');
    return;
  }

  locked = true;
  selected = null;
  grid = applySwap(grid, r1, c1, r2, c2);
  moves = Math.max(0, moves - 1);
  updateHUD();
  renderBoard();

  const matches = findMatches(grid);
  if (matches.length === 0) {
    setTimeout(() => {
      grid = applySwap(grid, r1, c1, r2, c2);
      showMsg('No match — try again');
      renderBoard();
      setTimeout(() => showMsg(''), 1200);
      locked = false;
      finalizeMove();
    }, CASCADE_DELAY);
  } else {
    processCascade(1);
  }
}

function processCascade(chain) {
  const matches = findMatches(grid);
  if (matches.length === 0) {
    locked = false;
    finalizeMove();
    return;
  }

  const flatMatches  = matches.flat();
  const clearedCells = flatMatches.length;
  const points = clearedCells * (BASE_POINTS + CHAIN_BONUS * (chain - 1));
  score += points;
  totalClears += clearedCells;
  combo = Math.max(combo, ...matches.map(g => g.length));
  if (matches.some(g => g.length >= 4)) explosions += 1;

  // Identify supernova tiles among matched cells
  const supernovaHits = flatMatches.filter(({ r, c }) => {
    const gem = grid[r]?.[c];
    return typeof gem === 'object' && gem?.special === 'supernova';
  });

  // Score and FX for supernova hits (computed before board clears)
  if (supernovaHits.length > 0) {
    const supernovaScore = supernovaHits.length * SUPERNOVA_BONUS;
    score += supernovaScore;

    // Collect full row+col preview for flash FX
    const previewCells = [];
    supernovaHits.forEach(({ r, c }) => {
      for (let col = 0; col < COLS; col++) {
        if (!previewCells.some(x => x.r === r && x.c === col)) previewCells.push({ r, c: col });
      }
      for (let row = 0; row < ROWS; row++) {
        if (!previewCells.some(x => x.r === row && x.c === c)) previewCells.push({ r: row, c });
      }
    });
    queueFx('supernova', previewCells);
    pushNarrative('⭐ Supernova' + (supernovaHits.length > 1 ? ' ×' + supernovaHits.length : '') + '! Row & column cleared! +' + supernovaScore);
  } else if (chain > 1) {
    showMsg('Chain x' + chain + '! +' + points);
    pushNarrative('🔗 Chain x' + chain + '! +' + points);
  } else if (combo >= 4) {
    pushNarrative('💥 Combo x' + combo + '! +' + points);
  } else {
    pushNarrative('✨ Match! +' + points);
  }

  bumpConscience(clearedCells);
  highlightMatched(matches);
  afterScoring();
  updateHUD();

  setTimeout(() => {
    // Apply supernova row+column clearances first
    if (supernovaHits.length > 0) {
      supernovaHits.forEach(({ r, c }) => {
        const result = clearSupernovaAt(grid, r, c);
        grid = result.next;
      });
    }
    grid = clearMatches(grid, flatMatches);
    grid = applyGravity(grid);
    renderBoard();
    setTimeout(() => processCascade(chain + 1), CASCADE_DELAY);
  }, CASCADE_DELAY);
}

function highlightMatched(matches) {
  const cells = dom.board?.querySelectorAll('.gem-cell') || [];
  matches.forEach(group => {
    group.forEach(({ r, c }) => {
      const idx = r * COLS + c;
      if (cells[idx]) cells[idx].classList.add('matched');
    });
  });
}

function initLevel() {
  const cfg = getLevelConfig(level);
  moves = cfg.moves;
  updateHUD();
}

function afterScoring() {
  if (level >= MAX_LEVEL) return;
  if (checkLevelUp(score, level)) {
    const completedLevel = level;
    level = Math.min(level + 1, MAX_LEVEL);
    initLevel();
    maybePlay('levelup');
    maybeUnlock('level_' + level);
    onLevelComplete(completedLevel, score, null, null);

    if (completedLevel === MAX_LEVEL) {
      document.dispatchEvent(new CustomEvent('matchmakerComplete', {
        detail: { score, level: completedLevel }
      }));
    }
  }
}

function finalizeMove() {
  updateDailyProgress('score', score);
  updateDailyProgress('level', level);
  updateDailyProgress('clears', totalClears);

  const dailyDone = checkDailyCompletion({ score, level, clears: totalClears });
  if (dailyDone) {
    maybeUnlock('daily_complete');
    unlockStar('silver');
  }

  if (level >= 3) unlockStar('gold');
  if (score >= 1000) unlockStar('sapphire');
  if (totalClears >= 50) unlockStar('emerald');
  if (combo >= 5) unlockStar('ruby');
  if (explosions >= 10) unlockStar('amethyst');
  if (daysPlayed >= 7) unlockStar('obsidian');

  saveState();
}

export function initMatchMaker(db, user) {
  cacheDom();
  updateDayStreak();

  // Use built-in fallback grid if createInitialGrid fails (e.g. API/config unavailable)
  try {
    grid = createInitialGrid();
  } catch (e) {
    const types = Object.keys(GEM_DISPLAY);
    grid = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => types[(r * COLS + c) % types.length])
    );
  }

  score        = 0;
  level        = 1;
  totalClears  = 0;
  combo        = 0;
  explosions   = 0;
  selected     = null;
  locked       = false;
  fxQueue      = [];
  fxActive     = false;
  conscience   = { empathy: 0, justice: 0, wisdom: 0, growth: 0 };

  initLevel();
  if (!loadState()) {
    renderBoard();
    updateConscience();
    showMsg('Match the gems — align your conscience');
    saveState();
  } else {
    renderBoard();
    showMsg('Loaded your save slot');
  }
}
