/**
 * daily.js — daily challenge tracking.
 * Challenge data is inlined to avoid JSON import-assertion browser compatibility issues.
 */

const list = [
  { "id": "score500", "desc": "Score 500 points today",  "check": "score >= 500" },
  { "id": "clear20",  "desc": "Clear 20 gems today",     "check": "clears >= 20" },
  { "id": "reach3",   "desc": "Reach level 3 today",     "check": "level >= 3"   }
];

export function getTodayChallenge() {
  const today = new Date().toDateString();
  const saved = JSON.parse(localStorage.getItem('daily') || '{}');

  if (saved.date === today) return saved;

  const challenge = list[Math.floor(Math.random() * list.length)];

  const newData = { date: today, challenge, progress: {} };
  localStorage.setItem('daily', JSON.stringify(newData));
  return newData;
}

export function updateDailyProgress(key, value) {
  const data = getTodayChallenge();
  data.progress[key] = value;
  localStorage.setItem('daily', JSON.stringify(data));
}

export function checkDailyCompletion(state) {
  const data = getTodayChallenge();
  const expr = data.challenge?.check;
  if (!expr) return false;

  try {
    // Destructure state so that `score`, `level`, `clears` are in scope
    const { score, level, clears } = state;
    const fn = new Function('score', 'level', 'clears', `return ${expr}`);
    if (fn(score, level, clears)) {
      localStorage.setItem('dailyComplete', 'true');
      return true;
    }
  } catch (e) {
    console.warn('Daily challenge check failed:', e);
  }
  return false;
}
