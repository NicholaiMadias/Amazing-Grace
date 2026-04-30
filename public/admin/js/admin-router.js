/**
 * admin-router.js
 * Role-based routing guard for the Sovereign Matrix Admin Dashboard.
 *
 * Security model:
 *   When Firebase is configured (window.__FIREBASE_CONFIG is set), roles are
 *   derived exclusively from a Firestore profile document — removing the
 *   localStorage self-elevation vulnerability.
 *   Falls back to localStorage demo credentials on local / preview hosts.
 *
 * Usage:
 *   import { requireRole, initFirebaseAuth, injectMasterKeyModal } from './admin-router.js';
 *   await initFirebaseAuth(role => { ... });   // call before requireRole on Firebase hosts
 *   requireRole(['admin', 'superAdmin', 'owner']);
 */

// ── Firebase live-role state ──────────────────────────────────────────────
let _firestoreRole  = null;  // null = not yet loaded from Firestore
let _firestoreReady = false; // true once the first snapshot arrives
let _profileRef     = null;  // Firestore DocumentReference for the current user
let _unsubSnap      = null;  // unsubscribe handle for the onSnapshot listener

/**
 * Return the currently authenticated user from localStorage.
 * (Used as the demo/fallback credential store.)
 * @returns {{ uid: string, email: string, role: string }|null}
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('adminUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Persist a user session to localStorage.
 * @param {{ uid: string, email: string, role: string }} user
 */
export function setCurrentUser(user) {
  try {
    localStorage.setItem('adminUser', JSON.stringify(user));
  } catch { /* storage blocked */ }
}

/**
 * Clear the current user session and redirect to login.
 */
export function logout() {
  try { localStorage.removeItem('adminUser'); } catch { /* ignored */ }
  _firestoreRole  = null;
  _firestoreReady = false;
  if (_unsubSnap) { _unsubSnap(); _unsubSnap = null; }
  window.location.href = '/admin/login.html';
}

/**
 * Guard the current page by required roles.
 * When Firebase is configured and ready, the role is derived from Firestore.
 * Otherwise falls back to the localStorage demo session.
 *
 * @param {string[]} allowedRoles
 * @returns {{ uid: string, email: string, role: string }|null}
 */
export function requireRole(allowedRoles) {
  // If Firestore has loaded a role, trust that over localStorage.
  if (_firestoreReady) {
    if (!_firestoreRole) {
      window.location.href = '/admin/login.html';
      return null;
    }
    if (!allowedRoles.includes(_firestoreRole)) {
      window.location.href = '/admin/forbidden.html';
      return null;
    }
    return { role: _firestoreRole };
  }

  // Demo / localStorage fallback
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/admin/login.html';
    return null;
  }
  if (!allowedRoles.includes(user.role)) {
    window.location.href = '/admin/forbidden.html';
    return null;
  }
  return user;
}

// ── Firebase Auth + Firestore integration ────────────────────────────────
/**
 * Initialise Firebase Auth (anonymous or custom-token) and set up a real-time
 * Firestore listener on the user's private profile document.
 *
 * Role is derived **exclusively** from Firestore — eliminating the
 * localStorage self-elevation attack surface.
 *
 * To enable: set window.__FIREBASE_CONFIG to your Firebase project config
 * object (e.g. via a server-rendered <script> block).
 *
 * @param {Function} [onRoleChange] - Optional callback(role: string|null)
 *   fired every time the Firestore role changes.
 * @returns {Promise<void>}
 */
export async function initFirebaseAuth(onRoleChange) {
  const config = window.__FIREBASE_CONFIG;
  if (!config) return; // not configured — demo localStorage path stays active

  try {
    const [{ initializeApp }, { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged },
           { getFirestore, doc, onSnapshot, setDoc, updateDoc, getDoc }] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js'),
    ]);

    const app    = initializeApp(config);
    const auth   = getAuth(app);
    const db     = getFirestore(app);
    const appId  = config.appId || 'amazinggracehl';

    // Sign in with a server-provided custom token when available, else anonymous.
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
      await signInWithCustomToken(auth, __initial_auth_token);
    } else {
      await signInAnonymously(auth);
    }

    onAuthStateChanged(auth, async (firebaseUser) => {
      if (_unsubSnap) { _unsubSnap(); _unsubSnap = null; }

      if (!firebaseUser) {
        _firestoreRole  = null;
        _firestoreReady = true;
        onRoleChange?.(null);
        return;
      }

      const profRef = doc(db, `artifacts/${appId}/users/${firebaseUser.uid}/profile`);
      _profileRef   = profRef;

      // Seed profile doc if it doesn't exist yet.
      const snap = await getDoc(profRef);
      if (!snap.exists()) {
        await setDoc(profRef, { uid: firebaseUser.uid, role: 'user', createdAt: Date.now() });
      }

      // Real-time listener — role changes are reflected immediately without reload.
      _unsubSnap = onSnapshot(profRef, (s) => {
        const profile   = s.exists() ? s.data() : {};
        _firestoreRole  = profile.role ?? 'user';
        _firestoreReady = true;
        onRoleChange?.(_firestoreRole);
      });
    });
  } catch (err) {
    console.warn('[admin-router] Firebase init failed — demo path active.', err);
  }
}

/**
 * Elevate the current Firestore user to admin by presenting the correct
 * Master Key. The key must be pre-configured via window.__ADMIN_MASTER_KEY
 * (set server-side; never hard-code in source).
 *
 * @param {string} enteredKey
 * @returns {Promise<boolean>} true on success
 */
export async function elevateToAdmin(enteredKey) {
  const masterKey = window.__ADMIN_MASTER_KEY;
  if (!masterKey || enteredKey !== masterKey) return false;
  if (!_profileRef) return false;

  try {
    const { updateDoc } =
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    await updateDoc(_profileRef, { role: 'admin' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Inject a hidden "System Override" trigger and Master Key modal into the page.
 * Clicking the tiny footer dot opens the modal; correct key elevates Firestore role.
 */
export function injectMasterKeyModal() {
  if (document.getElementById('master-key-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'master-key-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'mk-title');
  modal.style.cssText =
    'display:none;position:fixed;inset:0;background:rgba(0,0,0,.72);' +
    'z-index:9999;align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:#161628;border:1px solid rgba(255,255,255,.12);border-radius:10px;
                padding:2rem;min-width:300px;max-width:90vw;text-align:center;color:#fff;">
      <h3 id="mk-title" style="margin:0 0 1rem;font-size:1rem;color:#ffd700;">⚙️ System Override</h3>
      <input id="mk-input" type="password" autocomplete="off" placeholder="Enter master key"
        style="width:100%;padding:.5rem .75rem;border-radius:4px;border:1px solid #444;
               background:#0a0a14;color:#fff;box-sizing:border-box;font-size:.9rem;" />
      <div style="margin-top:.9rem;display:flex;gap:.5rem;justify-content:center;">
        <button id="mk-submit"
          style="padding:.4rem 1.2rem;background:#1e90ff;color:#fff;border:none;
                 border-radius:4px;cursor:pointer;font-size:.85rem;">Activate</button>
        <button id="mk-cancel"
          style="padding:.4rem 1.2rem;background:#333;color:#fff;border:none;
                 border-radius:4px;cursor:pointer;font-size:.85rem;">Cancel</button>
      </div>
      <p id="mk-msg" style="margin:.75rem 0 0;font-size:.78rem;color:#e0115f;min-height:1em;"></p>
    </div>`;
  document.body.appendChild(modal);

  const trigger = document.createElement('span');
  trigger.id = 'mk-trigger';
  trigger.textContent = '·';
  trigger.title = 'System Override';
  trigger.setAttribute('aria-label', 'Open system override');
  trigger.style.cssText =
    'position:fixed;bottom:4px;right:8px;cursor:pointer;opacity:.15;' +
    'font-size:1.4rem;color:#fff;user-select:none;z-index:100;transition:opacity .2s;';
  trigger.addEventListener('mouseenter', () => { trigger.style.opacity = '.5'; });
  trigger.addEventListener('mouseleave', () => { trigger.style.opacity = '.15'; });
  document.body.appendChild(trigger);

  const open  = () => { modal.style.display = 'flex'; document.getElementById('mk-input').focus(); };
  const close = () => { modal.style.display = 'none'; document.getElementById('mk-msg').textContent = ''; };

  trigger.addEventListener('click', open);
  document.getElementById('mk-cancel').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.getElementById('mk-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('mk-submit').click();
    if (e.key === 'Escape') close();
  });

  document.getElementById('mk-submit').addEventListener('click', async () => {
    const key = document.getElementById('mk-input').value;
    const msg = document.getElementById('mk-msg');
    msg.style.color = '#aaa';
    msg.textContent = 'Verifying…';

    const ok = await elevateToAdmin(key);
    if (ok) {
      msg.style.color = '#50c878';
      msg.textContent = '✓ Role elevated to admin.';
      setTimeout(() => { close(); window.location.reload(); }, 1400);
    } else {
      msg.style.color = '#e0115f';
      msg.textContent = 'Invalid key or Firebase not configured.';
    }
  });
}

/**
 * Convenience helpers for specific role checks.
 */
export const ROLES = {
  ALL_ADMIN:  ['admin', 'superAdmin', 'owner'],
  SUPER_PLUS: ['superAdmin', 'owner'],
  OWNER_ONLY: ['owner'],
};
