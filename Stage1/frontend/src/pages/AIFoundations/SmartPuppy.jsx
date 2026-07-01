import React, { useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Code2, BookOpen, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import styles from './SmartPuppy.module.css';

// ── Code lines for the "Traditional Programming" side ──
const CODE_LINES = [
  { text: 'function ', keyword: true, rest: 'makeDogWalk() {' },
  { text: '  moveLeg', func: true, rest: '(1);' },
  { text: '  balance', func: true, rest: '();' },
  { text: '  moveLeg', func: true, rest: '(2);' },
  { text: '  repeat', func: true, rest: '();' },
  { text: '}', plain: true },
];

const TREAT_EMOJIS = ['📚', '🦴', '🍖', '📊', '🎾'];

const SmartPuppy = ({ onBackToDashboard }) => {
  // ── State ──
  const [codeStep, setCodeStep] = useState(0);           // 0 to CODE_LINES.length
  const [trainingProgress, setTrainingProgress] = useState(0); // 0 to 100
  const [codeInteracted, setCodeInteracted] = useState(false);
  const [aiInteracted, setAiInteracted] = useState(false);
  const [treats, setTreats] = useState([]);

  const codeComplete = codeStep >= CODE_LINES.length;
  const trainingComplete = trainingProgress >= 100;
  const showTakeaway = codeInteracted && aiInteracted && trainingProgress >= 60;

  // ── Handlers ──
  const handleWriteCode = useCallback(() => {
    if (codeStep < CODE_LINES.length) {
      setCodeStep(prev => prev + 1);
      setCodeInteracted(true);
    }
  }, [codeStep]);

  const handleFeedData = useCallback(() => {
    if (trainingProgress < 100) {
      setTrainingProgress(prev => Math.min(prev + 20, 100));
      setAiInteracted(true);

      // Spawn flying treats
      const newTreats = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        emoji: TREAT_EMOJIS[Math.floor(Math.random() * TREAT_EMOJIS.length)],
        left: 30 + Math.random() * 40 + '%',
        bottom: '30%',
      }));
      setTreats(prev => [...prev, ...newTreats]);

      // Clean up after animation
      setTimeout(() => {
        setTreats(prev => prev.filter(t => !newTreats.find(nt => nt.id === t.id)));
      }, 1100);
    }
  }, [trainingProgress]);

  // ── Puppy animation class ──
  const puppyClass = useMemo(() => {
    if (trainingProgress === 0) return styles.puppyFallen;
    if (trainingProgress <= 20) return styles.puppyTrying;
    if (trainingProgress <= 40) return styles.puppyWobble;
    if (trainingProgress <= 80) return styles.puppyShaky;
    return styles.puppyWalking;
  }, [trainingProgress]);

  // ── Puppy status text ──
  const puppyStatus = useMemo(() => {
    if (trainingProgress === 0) return { text: 'Untrained — Fallen over', className: styles.statusFail };
    if (trainingProgress <= 20) return { text: 'Trying to stand...', className: styles.statusFail };
    if (trainingProgress <= 40) return { text: 'Standing but wobbling', className: styles.statusIdle };
    if (trainingProgress <= 80) return { text: 'Walking shakily!', className: styles.statusIdle };
    return { text: '✨ Walking perfectly!', className: styles.statusActive };
  }, [trainingProgress]);

  // ── Progress bar color ──
  const progressColor = useMemo(() => {
    if (trainingProgress <= 20) return 'linear-gradient(90deg, #FF3366, #ff6b6b)';
    if (trainingProgress <= 60) return 'linear-gradient(90deg, #ff6b6b, #f0c040)';
    return 'linear-gradient(90deg, #00F0FF, #00FF88)';
  }, [trainingProgress]);

  // ── Ambient particles ──
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      left: Math.random() * 100 + '%',
      bottom: -(Math.random() * 20) + '%',
      animationDuration: 8 + Math.random() * 12 + 's',
      animationDelay: -(Math.random() * 10) + 's',
      width: (1 + Math.random() * 3) + 'px',
      height: (1 + Math.random() * 3) + 'px',
    })), []);

  return (
    <div className={styles.page}>
      {/* Ambient particles */}
      <div className={styles.particles}>
        {particles.map((p, i) => (
          <div key={i} className={styles.particle} style={p} />
        ))}
      </div>

      {/* ── Top Navigation ── */}
      <nav className={styles.topNav}>
        <button className={styles.backBtn} onClick={onBackToDashboard}>
          <ArrowLeft size={16} /> Exit Lesson
        </button>
        <span className={styles.navLabel}>AI Foundations · Topic 01</span>
      </nav>

      {/* ── Main Content ── */}
      <main className={styles.content}>

        {/* ── Hero Section ── */}
        <section className={styles.hero}>
          <div className={styles.eyebrow}>The Hook</div>
          <h1 className={styles.heroTitle}>
            What is AI?<br />The <em>Smart Puppy</em> Analogy
          </h1>

          <div className={styles.storyCard}>
            <p className={styles.storyText}>
              Imagine you get a new puppy. At first, it doesn't know how to sit, stay, or fetch.
              Do you open its brain and write code that says{' '}
              <strong>"if owner says sit, bend knees"</strong>? No! You{' '}
              <span className={styles.storyHighlight}>train it using examples</span>.
              You say "Sit", push its back down gently, and give it a treat.
              Over time, it learns the pattern.
            </p>
            <br />
            <p className={styles.storyText}>
              <strong>Artificial Intelligence is exactly like that puppy.</strong>{' '}
              Instead of giving computers strict, step-by-step instructions, we give them{' '}
              <span className={styles.storyHighlight}>examples (data)</span>{' '}
              and let them learn the patterns on their own!
            </p>
          </div>
        </section>

        {/* ── Section Heading ── */}
        <div className={styles.sectionHeading}>
          <h2>⚡ Interactive Playground</h2>
          <p>Try both approaches and see the difference for yourself.</p>
        </div>

        {/* ── Split Screen ── */}
        <div className={styles.splitScreen}>

          {/* ═══ LEFT: Traditional Programming ═══ */}
          <div className={styles.panel}>
            <span className={`${styles.panelLabel} ${styles.panelLabelCode}`}>
              Traditional Programming
            </span>

            {/* Character Stage */}
            <div className={styles.characterStage}>
              <div className={`${styles.character} ${codeComplete ? styles.robotWalking : styles.robotIdle}`}>
                🤖
              </div>
            </div>

            {/* Status */}
            <div className={codeComplete ? styles.statusActive : styles.statusIdle}>
              {codeComplete ? '⚙️ Walking rigidly (hardcoded)' : '💤 Waiting for code...'}
            </div>

            {/* Code Block */}
            <div className={styles.codeBlock}>
              {codeStep === 0 && (
                <span className={styles.codePlaceholder}>// Click the button to write code...</span>
              )}
              {CODE_LINES.slice(0, codeStep).map((line, i) => (
                <div key={i} className={styles.codeLine} style={{ animationDelay: `${i * 0.05}s` }}>
                  {line.keyword && <span className={styles.codeKeyword}>{line.text}</span>}
                  {line.func && <span className={styles.codeFunc}>{line.text}</span>}
                  {line.plain && <span className={styles.codeParen}>{line.text}</span>}
                  <span className={styles.codeParen}>{line.rest || ''}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button
              className={`${styles.actionBtn} ${styles.codeBtnStyle}`}
              onClick={handleWriteCode}
              disabled={codeComplete}
            >
              <Code2 size={18} />
              {codeComplete ? 'All Code Written ✓' : `Write If/Else Code (${codeStep}/${CODE_LINES.length})`}
            </button>

            {/* Concept Note */}
            <div className={styles.conceptNote} style={{ borderColor: 'var(--accent-red, #FF3366)' }}>
              <strong>The human does all the hard work</strong> — writing exact rules for every possible situation.
              If something changes, you have to rewrite the code.
            </div>
          </div>

          {/* ═══ RIGHT: Machine Learning (AI) ═══ */}
          <div className={styles.panel}>
            <span className={`${styles.panelLabel} ${styles.panelLabelAI}`}>
              Machine Learning (AI)
            </span>

            {/* Character Stage */}
            <div className={styles.characterStage}>
              <div className={`${styles.character} ${puppyClass}`}>
                🐕
              </div>

              {/* Flying treats */}
              <div className={styles.treatContainer}>
                {treats.map(t => (
                  <span
                    key={t.id}
                    className={styles.treat}
                    style={{ left: t.left, bottom: t.bottom }}
                  >
                    {t.emoji}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className={puppyStatus.className}>
              {puppyStatus.text}
            </div>

            {/* Progress Bar */}
            <div className={styles.progressArea}>
              <div className={styles.progressHeader}>
                <span className={styles.progressTitle}>Training Progress</span>
                <span className={styles.progressPercent}>{trainingProgress}%</span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${trainingProgress}%`,
                    background: progressColor,
                  }}
                />
              </div>
            </div>

            {/* Trained Badge */}
            {trainingComplete && (
              <div className={styles.trainedBadge}>
                <CheckCircle2 size={20} /> Model Trained!
              </div>
            )}

            {/* Action Button */}
            <button
              className={`${styles.actionBtn} ${styles.aiBtnStyle}`}
              onClick={handleFeedData}
              disabled={trainingComplete}
            >
              <BookOpen size={18} />
              {trainingComplete ? 'Fully Trained ✓' : 'Feed Data (Examples)'}
            </button>

            {/* Concept Note */}
            <div className={styles.conceptNote} style={{ borderColor: 'var(--accent-cyan, #00F0FF)' }}>
              <strong>The machine figures out the rules</strong> — based on the data you provide.
              More data = better learning. No manual rules needed!
            </div>
          </div>
        </div>

        {/* ── Takeaway Banner ── */}
        {showTakeaway && (
          <section className={styles.takeaway}>
            <div className={styles.takeawayIcon}>💡</div>
            <h3>The Key Difference</h3>
            <p>
              In <strong>Traditional Programming</strong>, humans write every rule by hand — 
              the computer only follows instructions.
              In <strong className={styles.takeawayHighlight}>Machine Learning</strong>, 
              we give the computer <strong>examples</strong> and it discovers the rules on its own. 
              That's the magic of AI — <span className={styles.takeawayHighlight}>learning from data 
              instead of being told what to do.</span>
            </p>
          </section>
        )}

      </main>
    </div>
  );
};

export default SmartPuppy;
