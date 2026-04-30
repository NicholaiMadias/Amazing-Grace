import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Shield,
  BookOpen,
  Settings,
  ArrowRight,
  Trophy,
  Brain,
  ChevronRight,
  Volume2,
  Lock,
  Ghost,
  Star,
  Activity,
  MessageSquare,
  Zap,
  Eye,
  Loader2,
  Terminal,
  AlertCircle,
  Fingerprint,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- FIREBASE IMPORTS ---
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';

// --- MANDATORY FIREBASE INITIALIZATION PATTERN ---
/**
 * __firebase_config — JSON string injected at build/runtime (e.g., by Firebase Studio or a
 * server-side template).  Expected shape: standard FirebaseOptions object.
 * Falls back gracefully to local-only mode when undefined or empty.
 */
declare const __firebase_config: string;
/**
 * __app_id — Optional string injected at runtime to namespace Firestore data.
 * Defaults to 'matrix-act-1' when undefined.
 */
declare const __app_id: string | undefined;
/**
 * __initial_auth_token — Optional Firebase custom token injected at runtime for
 * pre-authenticated sessions.  Falls back to anonymous auth when undefined.
 */
declare const __initial_auth_token: string | undefined;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let appId = 'matrix-act-1';
let firebaseReady = false;

try {
  const firebaseConfig = JSON.parse(
    typeof __firebase_config !== 'undefined' ? __firebase_config : '{}'
  );
  if (firebaseConfig && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof __app_id !== 'undefined') appId = __app_id;
    firebaseReady = true;
  }
} catch {
  // Firebase not configured — runs in local-only mode
}

// --- ASSET CONFIGURATION ---
const AUDIO_BASE = '/assets/audio';

const SOUNDS: Record<string, string> = {
  click: `${AUDIO_BASE}/get.mp3`,
  match: `${AUDIO_BASE}/get.mp3`,
  chain: `${AUDIO_BASE}/chain_reaction.mp3`,
  win: `${AUDIO_BASE}/course_clear.mp3`,
  badge: `${AUDIO_BASE}/badge.mp3`,
  storm: `${AUDIO_BASE}/storm.mp3`,
  solved: `${AUDIO_BASE}/solved.mp3`,
  mystery: `${AUDIO_BASE}/MiniGame.mp3`,
  ambient: `${AUDIO_BASE}/ending.mp3`,
  boss: `${AUDIO_BASE}/Hit_the_Floor___Linkin_Park.mp3.m4a`,
};

const IconMap: Record<string, React.ElementType> = {
  Shield,
  Ghost,
  Sparkles,
  Star,
  Activity,
  Trophy,
  Lock,
  BookOpen,
  Brain,
};

// --- DATA: CHAPTERS ---
interface Chapter {
  id: number;
  title: string;
  content: string;
  icon: string;
  color: string;
  scripture?: string;
  sound?: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'The Heavy Gravity of the Red Queen',
    content:
      "The Red Queen's entropy has distorted the fabric of the Conscience Matrix. Heavy gravitational forces pull every thought downward — toward anger, fear, and control. To resist is to begin awakening. In this first act, you will encounter the weight of sin not as guilt but as gravitational pull. Your mission: recognise the force, name it, and choose to rise.",
    icon: 'Shield',
    color: '#e11d48',
    scripture: '"For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord." — Romans 6:23',
    sound: 'storm',
  },
  {
    id: 2,
    title: 'Signals from the Deep Archive',
    content:
      "Beneath the noise of the corrupted matrix lie ancient transmissions — signals encoded in the original language of creation. The Deep Archive holds memories older than time: the moment light was spoken into existence, the breath given to dust. Your task is to tune the receiver, to quiet the interference of self and listen.",
    icon: 'Activity',
    color: '#7c3aed',
    scripture: '"In the beginning was the Word, and the Word was with God, and the Word was God." — John 1:1',
    sound: 'mystery',
  },
  {
    id: 3,
    title: 'Ghost Protocol — The Unseen Hand',
    content:
      "You will pass through corridors no eye can track and no sensor can log. The Ghost Protocol is not stealth for deception but transparency before the Infinite. Those who move in Ghost Protocol carry nothing the enemy can seize — no pride, no agenda, no secret weight. They are empty and therefore impossible to stop.",
    icon: 'Ghost',
    color: '#0ea5e9',
    scripture: '"Blessed are the pure in heart, for they will see God." — Matthew 5:8',
    sound: 'ambient',
  },
  {
    id: 4,
    title: 'The Star Cartography Room',
    content:
      "Seven stars. Seven churches. Seven promises. The cartography room maps the spiritual topology of your journey — each star a checkpoint, each checkpoint a covenant. You are not navigating alone. The One who holds the seven stars in his right hand walks among the lampstands. Your position is already known.",
    icon: 'Star',
    color: '#f59e0b',
    scripture: '"To the one who is victorious, I will give the right to sit with me on my throne." — Revelation 3:21',
    sound: 'badge',
  },
  {
    id: 5,
    title: 'The Firewall of Forgiveness',
    content:
      "Every system has a vulnerability. In the Conscience Matrix, the most powerful exploit is not an attack but a reset — total erasure of the corrupted ledger. The Firewall of Forgiveness does not merely block incoming threats; it retroactively clears the log. This is not a weakness in the architecture. It is the architecture.",
    icon: 'Sparkles',
    color: '#10b981',
    scripture: '"As far as the east is from the west, so far has he removed our transgressions from us." — Psalm 103:12',
    sound: 'solved',
  },
  {
    id: 6,
    title: 'Locked Nodes and the Master Key',
    content:
      "You will encounter nodes in the matrix that cannot be unlocked by intelligence, skill, or effort. They respond only to the Master Key — a frequency of absolute surrender. The locked nodes are not obstacles placed by an enemy; they are invitations placed by the Architect. They are asking one question: do you trust me?",
    icon: 'Lock',
    color: '#8b5cf6',
    scripture: '"Trust in the Lord with all your heart and lean not on your own understanding." — Proverbs 3:5',
    sound: 'click',
  },
  {
    id: 7,
    title: 'Act 1 Complete — The First Door Opens',
    content:
      "You have traversed the first layer of the Conscience Matrix. The Red Queen's gravity has been identified. The deep signals have been heard. Ghost Protocol has been learned. The Star Map is in your hands. The Firewall is active. The Master Key has been accepted. The first door is open. What lies beyond is not danger — it is home.",
    icon: 'Trophy',
    color: '#ffd700',
    scripture: '"I am the door. If anyone enters by me, he will be saved." — John 10:9',
    sound: 'win',
  },
];

// --- AUDIO MANAGER ---
function playSound(name: string, volume = 0.4) {
  const src = SOUNDS[name];
  if (!src) return;
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch((err: unknown) => {
      // Suppress expected autoplay policy rejections; log other errors for debugging
      const isAutoplayError =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'AbortError');
      if (!isAutoplayError) console.warn('[Matrix Act 1] Audio playback error:', err);
    });
  } catch {
    /* ignore */
  }
}

// --- TYPES ---
interface Progress {
  currentChapter: number;
  completed: boolean;
  userId?: string;
}

// --- STARFIELD COMPONENT ---
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars: { x: number; y: number; r: number; opacity: number; speed: number }[] = [];
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
      });
    }

    let frame: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// --- MAIN APP ---
export default function App() {
  const [progress, setProgress] = useState<Progress>({ currentChapter: 0, completed: false });
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseReady);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const currentIndex = progress.currentChapter;
  const chapter = CHAPTERS[currentIndex] ?? CHAPTERS[0];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === CHAPTERS.length - 1;

  // Firebase auth
  useEffect(() => {
    if (!firebaseReady) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setAuthReady(true);
        await loadProgress(user.uid);
      } else {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch {
          setAuthReady(true);
        }
      }
    });
    return unsub;
  }, []);

  async function loadProgress(uid: string) {
    if (!firebaseReady) return;
    try {
      const ref = doc(db, `artifacts/${appId}/users/${uid}/progress/matrix-act-1`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as Progress;
        setProgress({ currentChapter: data.currentChapter ?? 0, completed: data.completed ?? false });
      }
    } catch {
      /* offline / no data */
    }
  }

  async function saveProgress(p: Progress) {
    if (!firebaseReady || !userId) {
      localStorage.setItem('matrix-act-1-progress', JSON.stringify(p));
      return;
    }
    try {
      const ref = doc(db, `artifacts/${appId}/users/${userId}/progress/matrix-act-1`);
      await setDoc(ref, p, { merge: true });
    } catch (err) {
      // Fall back to localStorage so progress is never silently lost
      console.warn('[Matrix Act 1] Firestore save failed, falling back to localStorage:', err);
      localStorage.setItem('matrix-act-1-progress', JSON.stringify(p));
    }
  }

  // Fall back to localStorage when Firebase is not configured
  useEffect(() => {
    if (!firebaseReady) {
      const saved = localStorage.getItem('matrix-act-1-progress');
      if (saved) {
        try { setProgress(JSON.parse(saved)); } catch {/* ignore */}
      }
    }
  }, []);

  function navigate(delta: number) {
    const next = Math.max(0, Math.min(CHAPTERS.length - 1, currentIndex + delta));
    const isComplete = next === CHAPTERS.length - 1 && delta > 0;
    const newProgress: Progress = {
      currentChapter: next,
      completed: isComplete || progress.completed,
      userId: userId ?? undefined,
    };
    setProgress(newProgress);
    void saveProgress(newProgress);
    if (soundEnabled) playSound(CHAPTERS[next].sound ?? 'click', 0.3);
  }

  const IconComponent = IconMap[chapter.icon] ?? Sparkles;
  const accentColor = chapter.color;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#020617 0%,#0f0524 50%,#020617 100%)',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(2,6,23,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(139,92,246,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.5rem',
              background: 'rgba(124,58,237,0.3)',
              borderRadius: '0.75rem',
              boxShadow: '0 0 20px rgba(139,92,246,0.3)',
            }}
          >
            <Terminal size={20} color="#c084fc" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Orbitron', 'Inter', sans-serif",
                fontWeight: 900,
                fontSize: '1.1rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                background: 'linear-gradient(to right,#c084fc,#fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
              }}
            >
              Matrix Act 1
            </h1>
            <p
              style={{
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#a78bfa',
                fontFamily: 'monospace',
                margin: 0,
              }}
            >
              Conscience Protocol
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => { setSoundEnabled(v => !v); }}
            aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: soundEnabled ? '#a78bfa' : '#475569',
              padding: '0.25rem',
            }}
          >
            <Volume2 size={18} />
          </button>
          <a
            href="/arcade"
            style={{
              color: '#64748b',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            ← Arcade
          </a>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          maxWidth: '42rem',
          margin: '0 auto',
          padding: '2rem 1rem',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
          >
            {/* Chapter Card */}
            <div
              style={{
                background: 'rgba(15,23,42,0.9)',
                border: `1px solid ${accentColor}33`,
                borderRadius: '1.5rem',
                overflow: 'hidden',
                boxShadow: `0 0 40px ${accentColor}22`,
              }}
            >
              {/* Banner */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16/7',
                  background: `linear-gradient(135deg,#0f0524 0%,${accentColor}22 50%,#0a0a1a 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Starfield />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textAlign: 'center',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ color: accentColor, filter: `drop-shadow(0 0 12px ${accentColor})` }}
                  >
                    <IconComponent size={56} />
                  </motion.div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: accentColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.25em',
                      opacity: 0.9,
                    }}
                  >
                    Chapter {chapter.id} of {CHAPTERS.length}
                  </span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '4rem',
                    background: 'linear-gradient(to top,#0f172a,transparent)',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: '1.75rem 2rem' }}>
                {/* Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: `${accentColor}22`,
                      border: `1px solid ${accentColor}55`,
                      borderRadius: '9999px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: accentColor,
                    }}
                  >
                    Chapter {chapter.id}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right,${accentColor}55,transparent)` }} />
                </div>

                <h2
                  style={{
                    fontFamily: "'Orbitron', 'Inter', sans-serif",
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: '#f1f5f9',
                    marginBottom: '1rem',
                    lineHeight: 1.3,
                  }}
                >
                  {chapter.title}
                </h2>

                <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                  {chapter.content}
                </p>

                {chapter.scripture && (
                  <div
                    style={{
                      background: `${accentColor}11`,
                      border: `1px solid ${accentColor}33`,
                      borderRadius: '1rem',
                      padding: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <p style={{ color: '#cbd5e1', fontSize: '0.875rem', fontStyle: 'italic', textAlign: 'center', margin: 0 }}>
                      {chapter.scripture}
                    </p>
                  </div>
                )}

                {/* Progress dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.5rem' }}>
                  {CHAPTERS.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: '0.4rem',
                        borderRadius: '9999px',
                        background: i === currentIndex ? accentColor : '#334155',
                        width: i === currentIndex ? '2rem' : '0.4rem',
                        transition: 'all 0.3s',
                      }}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(51,65,85,0.5)', paddingTop: '1.25rem' }}>
                  <button
                    onClick={() => navigate(-1)}
                    disabled={isFirst}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '9999px',
                      background: '#1e293b',
                      border: '1px solid rgba(139,92,246,0.2)',
                      color: isFirst ? '#475569' : '#e2e8f0',
                      cursor: isFirst ? 'not-allowed' : 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      opacity: isFirst ? 0.4 : 1,
                    }}
                  >
                    ← Back
                  </button>

                  <button
                    onClick={() => navigate(1)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 1.5rem',
                      borderRadius: '9999px',
                      background: accentColor,
                      border: 'none',
                      color: '#020617',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      boxShadow: `0 0 20px ${accentColor}66`,
                    }}
                  >
                    {isLast ? '🏆 Complete' : 'Continue →'}
                  </button>
                </div>
              </div>
            </div>

            {/* Completion Panel */}
            {progress.completed && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '2rem',
                  background: 'rgba(15,23,42,0.9)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  textAlign: 'center',
                  boxShadow: '0 0 40px rgba(255,215,0,0.1)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }} aria-hidden="true">🌟</div>
                <h3
                  style={{
                    fontFamily: "'Orbitron', 'Inter', sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: '#ffd700',
                    marginBottom: '0.5rem',
                  }}
                >
                  Act 1 Complete
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  You have completed the first act of the Conscience Matrix. The path continues.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                  <a
                    href="/ministry"
                    style={{
                      padding: '0.6rem 1.25rem',
                      background: '#7c3aed',
                      color: '#fff',
                      borderRadius: '9999px',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    📖 Enter the Ministry
                  </a>
                  <a
                    href="/arcade/star-matrix/"
                    style={{
                      padding: '0.6rem 1.25rem',
                      background: 'rgba(245,158,11,0.8)',
                      color: '#fff',
                      borderRadius: '9999px',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    ⭐ Play Star Matrix
                  </a>
                  <a
                    href="/arcade"
                    style={{
                      padding: '0.6rem 1.25rem',
                      background: '#1e293b',
                      border: '1px solid rgba(139,92,246,0.3)',
                      color: '#e2e8f0',
                      borderRadius: '9999px',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    ← Arcade Hub
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
