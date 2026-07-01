import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronLeft, BarChart2, LineChart, PieChart, ScatterChart } from 'lucide-react';
import styles from './DataAnalysis.module.css';

const DataAnalysis = ({ onBackToDashboard }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 2;

  // State for Outlier Smasher
  const [outlierSmashed, setOutlierSmashed] = useState(false);

  // Navigation handlers
  const handleNext = () => { if (currentStep < totalSteps - 1) setCurrentStep(p => p + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(p => p - 1); };

  // Data for the scatter plot
  const normalPoints = [
    { x: 5, y: 80 }, { x: 12, y: 150 }, { x: 18, y: 200 },
    { x: 22, y: 230 }, { x: 28, y: 270 }, { x: 30, y: 300 },
    { x: 35, y: 340 }, { x: 38, y: 360 }, { x: 42, y: 390 },
    { x: 45, y: 410 }, { x: 48, y: 440 }, { x: 50, y: 450 }
  ];

  const outlierPoint = { x: 10, y: 480 };

  // SVG coordinate mapping
  // SVG ViewBox: 0 0 600 400
  // X (Temp 0-50): mapped from 50 to 550
  // Y (Sales 0-500): mapped from 350 to 50
  const mapX = (val) => 50 + (val / 50) * 500;
  const mapY = (val) => 350 - (val / 500) * 300;

  return (
    <div className={styles.flashcardContainer}>
      <nav className={styles.topNav}>
        <button className={styles.backBtn} onClick={onBackToDashboard}>
          <ArrowLeft size={16} /> Exit Lesson
        </button>
        <span className={styles.pageTitle}>Data Analysis: Reading the Clues</span>
        <span className={styles.progressText}>Section {currentStep + 1} of {totalSteps}</span>
      </nav>

      <AnimatePresence mode="wait">
        
        {/* ═══════════════════════════════
            STEP 0: THEORY - GRAPHS
            ═══════════════════════════════ */}
        {currentStep === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35 }} className={styles.flashcard}>
            <div className={styles.sectionEyebrow} style={{ color: '#00F0FF' }}>Section 01 · Theory</div>
            <h1 className={styles.sectionTitle}>
              The Language of <em style={{ backgroundImage: 'linear-gradient(135deg, #00F0FF, #00FF88)' }}>Data</em>
            </h1>

            <div className={styles.narrative}>
              <p>Before an AI can read data, we need to know how to organize it. Think of a <strong>Dataset</strong> as a giant spreadsheet, and <strong>Variables</strong> as the specific columns we care about.</p>
              <p>We use different graphs to speak this language:</p>
            </div>

            <div className={styles.cardsGrid}>
              <div className={styles.graphCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper} style={{ background: 'rgba(0, 240, 255, 0.1)' }}>
                    <BarChart2 color="#00F0FF" />
                  </div>
                  Bar Chart
                </div>
                <div className={styles.cardDemo}>
                  <svg viewBox="0 0 100 60" style={{ width: '100%', height: '60px' }}>
                    <rect x="15" y="20" width="15" height="40" fill="#00F0FF" opacity="0.8" rx="2" />
                    <rect x="42.5" y="10" width="15" height="50" fill="#00F0FF" opacity="0.8" rx="2" />
                    <rect x="70" y="30" width="15" height="30" fill="#00F0FF" opacity="0.8" rx="2" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  </svg>
                </div>
                <div className={styles.cardBody}>
                  Best for comparing different categories (e.g., Favorite sports in class).
                </div>
              </div>
              
              <div className={styles.graphCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper} style={{ background: 'rgba(178, 0, 255, 0.1)' }}>
                    <LineChart color="#B200FF" />
                  </div>
                  Line Chart
                </div>
                <div className={styles.cardDemo}>
                  <svg viewBox="0 0 100 60" style={{ width: '100%', height: '60px' }}>
                    <path d="M10,50 L35,20 L60,35 L90,10" fill="none" stroke="#B200FF" strokeWidth="3" />
                    <circle cx="10" cy="50" r="4" fill="#B200FF" />
                    <circle cx="35" cy="20" r="4" fill="#B200FF" />
                    <circle cx="60" cy="35" r="4" fill="#B200FF" />
                    <circle cx="90" cy="10" r="4" fill="#B200FF" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  </svg>
                </div>
                <div className={styles.cardBody}>
                  Best for showing trends over time (e.g., Temperature over a week).
                </div>
              </div>

              <div className={styles.graphCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper} style={{ background: 'rgba(0, 255, 136, 0.1)' }}>
                    <PieChart color="#00FF88" />
                  </div>
                  Pie Chart
                </div>
                <div className={styles.cardDemo}>
                  <svg viewBox="0 0 100 60" style={{ width: '100%', height: '60px' }}>
                    <circle cx="50" cy="30" r="25" fill="#00FF88" opacity="0.3" />
                    <path d="M50,30 L50,5 A25,25 0 0,1 75,30 Z" fill="#00FF88" opacity="1" />
                    <path d="M50,30 L75,30 A25,25 0 0,1 32,47 Z" fill="#00FF88" opacity="0.6" />
                  </svg>
                </div>
                <div className={styles.cardBody}>
                  Best for showing parts of a whole (e.g., Percentage of time spent sleeping).
                </div>
              </div>

              <div className={styles.graphCard} style={{ borderColor: 'rgba(255, 51, 102, 0.3)', background: 'rgba(255, 51, 102, 0.05)' }}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper} style={{ background: 'rgba(255, 51, 102, 0.2)' }}>
                    <ScatterChart color="#FF3366" />
                  </div>
                  Scatter Plot
                </div>
                <div className={styles.cardDemo}>
                  <svg viewBox="0 0 100 60" style={{ width: '100%', height: '60px' }}>
                    <circle cx="15" cy="50" r="3" fill="#FF3366" opacity="0.9" />
                    <circle cx="25" cy="45" r="3" fill="#FF3366" opacity="0.9" />
                    <circle cx="45" cy="35" r="3" fill="#FF3366" opacity="0.9" />
                    <circle cx="60" cy="25" r="3" fill="#FF3366" opacity="0.9" />
                    <circle cx="70" cy="30" r="3" fill="#FF3366" opacity="0.9" />
                    <circle cx="85" cy="10" r="3" fill="#FF3366" opacity="0.9" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                    <line x1="0" y1="60" x2="0" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  </svg>
                </div>
                <div className={styles.cardBody}>
                  Best for finding relationships between two variables. <strong style={{color: '#FF3366'}}>This is the AI's favorite!</strong>
                </div>
              </div>
            </div>

            <div className={styles.navControls}>
              <button className={styles.navButton} onClick={handlePrev} disabled={currentStep === 0}>
                <ChevronLeft size={18} /> Previous
              </button>
              <button className={styles.navButton} onClick={handleNext} disabled={currentStep === totalSteps - 1} style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                Next Section <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════
            STEP 1: OUTLIER SMASHER
            ═══════════════════════════════ */}
        {currentStep === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35 }} className={styles.flashcard}>
            <div className={styles.sectionEyebrow} style={{ color: '#FF3366' }}>Section 02 · Demonstration</div>
            <h1 className={styles.sectionTitle}>
              The <em style={{ backgroundImage: 'linear-gradient(135deg, #FF3366, #FF9933)' }}>Outlier Smasher</em>
            </h1>

            <div className={styles.narrative}>
              <p>Let's look at a scatter plot of <strong>Kulfi Sales vs. Temperature</strong>. Generally, as it gets hotter, sales go up. But look at that weird dot! High sales on a freezing 10°C day? That's an <strong>OUTLIER</strong>.</p>
              <p>It confuses the AI's prediction line. <strong style={{ color: '#FF3366'}}>Smash it to fix the AI!</strong></p>
            </div>

            <div className={styles.svgContainer}>
              <svg className={styles.scatterSvg} viewBox="0 0 600 400">
                {/* Axes */}
                <line x1="50" y1="350" x2="570" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <line x1="50" y1="350" x2="50" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                
                {/* Labels */}
                <text x="310" y="390" fill="#c4c0d4" fontSize="14" textAnchor="middle">Temperature (°C)</text>
                <text x="20" y="190" fill="#c4c0d4" fontSize="14" textAnchor="middle" transform="rotate(-90, 20, 190)">Kulfi Sales</text>

                {/* Normal Points */}
                {normalPoints.map((p, i) => (
                  <circle key={i} cx={mapX(p.x)} cy={mapY(p.y)} r="5" fill="#00F0FF" opacity="0.8" />
                ))}

                {/* Prediction Line Animation via motion.line */}
                {/* 
                  Bad line: heavily influenced by the outlier (y = 5x + 150 roughly)
                  Good line: fits normal points perfectly (y = 8x + 50 roughly)
                */}
                <motion.line
                  x1={mapX(0)}
                  y1={outlierSmashed ? mapY(50) : mapY(150)}
                  x2={mapX(50)}
                  y2={outlierSmashed ? mapY(450) : mapY(400)}
                  stroke="#00FF88"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  initial={false}
                  animate={{
                    y1: outlierSmashed ? mapY(50) : mapY(150),
                    y2: outlierSmashed ? mapY(450) : mapY(400)
                  }}
                  transition={{ type: 'spring', stiffness: 60, damping: 10 }}
                />

                {/* The Outlier */}
                <AnimatePresence>
                  {!outlierSmashed && (
                    <motion.circle
                      cx={mapX(outlierPoint.x)}
                      cy={mapY(outlierPoint.y)}
                      r="8"
                      fill="#FF3366"
                      className={`${styles.outlierPoint} ${styles.pulsating}`}
                      onClick={() => setOutlierSmashed(true)}
                      exit={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>
                
                {/* Outlier Label */}
                <AnimatePresence>
                  {!outlierSmashed && (
                    <motion.text
                      x={mapX(outlierPoint.x) + 15}
                      y={mapY(outlierPoint.y) + 5}
                      fill="#FF3366"
                      fontSize="12"
                      fontWeight="bold"
                      exit={{ opacity: 0 }}
                    >
                      OUTLIER
                    </motion.text>
                  )}
                </AnimatePresence>
              </svg>
            </div>

            <AnimatePresence>
              {outlierSmashed && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.successBanner}
                >
                  🎉 Great job! The AI's prediction line is now accurate!
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.navControls}>
              <button className={styles.navButton} onClick={handlePrev} disabled={currentStep === 0}>
                <ChevronLeft size={18} /> Previous
              </button>
              <button className={styles.navButton} onClick={handleNext} disabled={currentStep === totalSteps - 1} style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                Next Section <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DataAnalysis;
