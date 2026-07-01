import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronLeft, Trash2, AlertTriangle, Sparkles } from 'lucide-react';
import styles from './Classification.module.css';

// ═══════════════════════════════════════════════
//  HARDCODED DATA — intentionally NOT linearly separable
// ═══════════════════════════════════════════════
const DRY_WASTE = [
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 3 },
  { x: 4, y: 1 },
  { x: 2.5, y: 4 },
  { x: 6, y: 5 },   // ← Noisy: heavy dry waste
];

const WET_WASTE = [
  { x: 7, y: 8 },
  { x: 8, y: 7 },
  { x: 8, y: 9 },
  { x: 9, y: 6 },
  { x: 7.5, y: 9 },
  { x: 4, y: 6 },   // ← Noisy: light wet waste
];

// ═══════════════════════════════════════════════
//  SVG CONSTANTS
// ═══════════════════════════════════════════════
const SVG_W = 500;
const SVG_H = 500;
const PAD = 50;      // padding for axes
const GRAPH_W = SVG_W - PAD * 2;
const GRAPH_H = SVG_H - PAD * 2;
const DOMAIN = 10;   // X & Y range: 0–10

const mapX = (val) => PAD + (val / DOMAIN) * GRAPH_W;
const mapY = (val) => PAD + GRAPH_H - (val / DOMAIN) * GRAPH_H;

// ═══════════════════════════════════════════════
//  CONFETTI COMPONENT
// ═══════════════════════════════════════════════
const CONFETTI_COLORS = ['#00F0FF', '#B200FF', '#00FF88', '#FF3366', '#ffc53d', '#ff6b6b'];

const Confetti = () => {
  const pieces = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 6,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className={styles.celebrationOverlay}>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className={styles.confettiPiece}
          style={{
            left: `${p.x}%`,
            top: '-5%',
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.id % 3 === 0 ? '50%' : '2px',
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: [0, SVG_H + 200],
            opacity: [1, 1, 0],
            rotate: [0, p.rotation + 360],
            x: [0, (Math.random() - 0.5) * 120],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════
//  MAIN CLASSIFICATION COMPONENT
// ═══════════════════════════════════════════════
const Classification = ({ onBackToDashboard }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 2;

  // Decision boundary: y = slope * x + intercept
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);

  const handleNext = () => { if (currentStep < totalSteps - 1) setCurrentStep((p) => p + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep((p) => p - 1); };

  // ── Accuracy calculation ──────────────────────
  const { accuracy, correctCount, totalCount } = useMemo(() => {
    let correct = 0;
    const total = DRY_WASTE.length + WET_WASTE.length;

    // Dry waste should be BELOW the line → y < slope*x + intercept
    DRY_WASTE.forEach((pt) => {
      if (pt.y < slope * pt.x + intercept) correct++;
    });
    // Wet waste should be ABOVE the line → y >= slope*x + intercept
    WET_WASTE.forEach((pt) => {
      if (pt.y >= slope * pt.x + intercept) correct++;
    });

    return {
      accuracy: Math.round((correct / total) * 100),
      correctCount: correct,
      totalCount: total,
    };
  }, [slope, intercept]);

  const isGood = accuracy >= 80;

  // ── Decision boundary line endpoints (clipped to graph) ──
  const linePoints = useMemo(() => {
    // y = slope * x + intercept
    // We compute the line across the full 0–10 domain and clip
    const pts = [];
    for (let xVal = 0; xVal <= DOMAIN; xVal += 0.1) {
      const yVal = slope * xVal + intercept;
      pts.push({ x: xVal, y: yVal });
    }
    return pts.filter((p) => p.y >= 0 && p.y <= DOMAIN);
  }, [slope, intercept]);

  // SVG line start/end
  const lineStart = linePoints.length > 0 ? linePoints[0] : { x: 0, y: intercept };
  const lineEnd = linePoints.length > 0 ? linePoints[linePoints.length - 1] : { x: DOMAIN, y: slope * DOMAIN + intercept };

  // ── Zone polygons (area above line = wet/green, area below = dry/blue) ──
  const { wetZonePath, dryZonePath } = useMemo(() => {
    // Build the intersection points of the line with the graph boundary (0,0)–(10,10)
    const graphCorners = [
      { x: 0, y: 0 }, { x: DOMAIN, y: 0 },
      { x: DOMAIN, y: DOMAIN }, { x: 0, y: DOMAIN },
    ];

    // Line: y = slope * x + intercept
    // Find where the line intersects the rectangle edges
    const intersections = [];

    // Bottom edge: y = 0 → x = -intercept / slope
    if (slope !== 0) {
      const xb = -intercept / slope;
      if (xb >= 0 && xb <= DOMAIN) intersections.push({ x: xb, y: 0, edge: 'bottom' });
    } else if (intercept === 0) {
      intersections.push({ x: 0, y: 0, edge: 'bottom' });
    }

    // Top edge: y = DOMAIN → x = (DOMAIN - intercept) / slope
    if (slope !== 0) {
      const xt = (DOMAIN - intercept) / slope;
      if (xt >= 0 && xt <= DOMAIN) intersections.push({ x: xt, y: DOMAIN, edge: 'top' });
    } else if (intercept === DOMAIN) {
      intersections.push({ x: 0, y: DOMAIN, edge: 'top' });
    }

    // Left edge: x = 0 → y = intercept
    if (intercept >= 0 && intercept <= DOMAIN) {
      intersections.push({ x: 0, y: intercept, edge: 'left' });
    }

    // Right edge: x = DOMAIN → y = slope * DOMAIN + intercept
    const yr = slope * DOMAIN + intercept;
    if (yr >= 0 && yr <= DOMAIN) {
      intersections.push({ x: DOMAIN, y: yr, edge: 'right' });
    }

    // Deduplicate (corner points)
    const uniqueInts = [];
    intersections.forEach((pt) => {
      const dup = uniqueInts.find((u) => Math.abs(u.x - pt.x) < 0.01 && Math.abs(u.y - pt.y) < 0.01);
      if (!dup) uniqueInts.push(pt);
    });

    // If line doesn't intersect at all (entirely above/below), fill accordingly
    if (uniqueInts.length < 2) {
      // Check if entire graph is above or below
      const mid = slope * 5 + intercept;
      if (mid > DOMAIN) {
        // All below line → all dry
        const allCorners = graphCorners.map((c) => `${mapX(c.x)},${mapY(c.y)}`).join(' ');
        return { wetZonePath: '', dryZonePath: allCorners };
      } else {
        // All above line → all wet
        const allCorners = graphCorners.map((c) => `${mapX(c.x)},${mapY(c.y)}`).join(' ');
        return { wetZonePath: allCorners, dryZonePath: '' };
      }
    }

    // Build wet zone (above line) and dry zone (below line) polygons
    // Approach: walk the graph boundary and categorize corners
    const edgeOrder = ['bottom', 'right', 'top', 'left'];
    const cornerByEdge = {
      bottom: [{ x: 0, y: 0 }, { x: DOMAIN, y: 0 }],
      right: [{ x: DOMAIN, y: 0 }, { x: DOMAIN, y: DOMAIN }],
      top: [{ x: DOMAIN, y: DOMAIN }, { x: 0, y: DOMAIN }],
      left: [{ x: 0, y: DOMAIN }, { x: 0, y: 0 }],
    };

    // Classify each corner as above or below line
    const isAbove = (pt) => pt.y >= slope * pt.x + intercept;

    // Build polygons by walking the boundary
    const abovePoints = [];
    const belowPoints = [];

    // Add all intersection points and corners, sorted along the boundary
    const boundaryWalk = [];
    edgeOrder.forEach((edge) => {
      cornerByEdge[edge].forEach((corner, ci) => {
        if (ci === 0) { // only add start corner of each edge
          boundaryWalk.push({ ...corner, type: 'corner', above: isAbove(corner) });
        }
        // Check for intersections on this edge
        uniqueInts.forEach((int) => {
          if (int.edge === edge) {
            // Order within edge
            let t;
            if (edge === 'bottom') t = int.x;
            else if (edge === 'right') t = int.y;
            else if (edge === 'top') t = DOMAIN - int.x;
            else t = DOMAIN - int.y;
            boundaryWalk.push({ ...int, type: 'intersection', t, above: true /* on line */ });
          }
        });
      });
    });

    // Sort intersections within their edges
    // (the walk already adds corners in order, intersections need ordering within edge)
    // Simpler approach: just build the two polygons directly using intersection + above/below corners

    // Wet zone (above line): intersection points + all corners above the line (in boundary order)
    // Dry zone (below line): intersection points + all corners below the line (in boundary order)
    const allBoundary = [];
    const cornersInOrder = [
      { x: 0, y: 0 },
      { x: DOMAIN, y: 0 },
      { x: DOMAIN, y: DOMAIN },
      { x: 0, y: DOMAIN },
    ];

    // Walk each edge, inserting intersection points in order
    for (let i = 0; i < 4; i++) {
      const c1 = cornersInOrder[i];
      const c2 = cornersInOrder[(i + 1) % 4];
      allBoundary.push({ ...c1, type: 'corner' });

      // Find intersections on this edge
      const edgeName = edgeOrder[i];
      const edgeInts = uniqueInts.filter((pt) => pt.edge === edgeName);
      // Sort by position along edge
      edgeInts.sort((a, b) => {
        if (edgeName === 'bottom') return a.x - b.x;
        if (edgeName === 'right') return a.y - b.y;
        if (edgeName === 'top') return b.x - a.x;
        return b.y - a.y;
      });
      edgeInts.forEach((pt) => allBoundary.push({ ...pt, type: 'intersection' }));
    }

    // Now split into above/below polygons
    const abovePoly = [];
    const belowPoly = [];
    let currentSide = isAbove(allBoundary[0]) ? 'above' : 'below';

    allBoundary.forEach((pt) => {
      if (pt.type === 'intersection') {
        // Intersection goes to BOTH polygons (it's on the line)
        abovePoly.push(pt);
        belowPoly.push(pt);
        // Side switches
        currentSide = currentSide === 'above' ? 'below' : 'above';
      } else {
        if (isAbove(pt)) {
          abovePoly.push(pt);
        } else {
          belowPoly.push(pt);
        }
      }
    });

    const toSvgPoints = (poly) => poly.map((p) => `${mapX(p.x)},${mapY(p.y)}`).join(' ');

    return {
      wetZonePath: toSvgPoints(abovePoly),
      dryZonePath: toSvgPoints(belowPoly),
    };
  }, [slope, intercept]);

  // ── Accuracy color ──
  const accColor = accuracy >= 80 ? '#00FF88' : accuracy >= 50 ? '#ffc53d' : '#FF3366';

  return (
    <div className={styles.flashcardContainer}>
      {/* ── Top Nav ── */}
      <nav className={styles.topNav}>
        <button className={styles.backBtn} onClick={onBackToDashboard}>
          <ArrowLeft size={16} /> Exit Lesson
        </button>
        <span className={styles.pageTitle}>Classification: Sorting the World</span>
        <span className={styles.progressText}>Section {currentStep + 1} of {totalSteps}</span>
      </nav>

      <AnimatePresence mode="wait">

        {/* ═══════════════════════════════════════
            STEP 0: THEORY
            ═══════════════════════════════════════ */}
        {currentStep === 0 && (
          <motion.div
            key="theory"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className={styles.flashcard}
          >
            <div className={styles.sectionEyebrow} style={{ color: '#00F0FF' }}>
              Section 01 · Theory
            </div>
            <h1 className={styles.sectionTitle}>
              Superpower 2:{' '}
              <em style={{ backgroundImage: 'linear-gradient(135deg, #00F0FF, #00FF88)' }}>
                Classification
              </em>
              <br />
              <span style={{ fontSize: '1.3rem', color: '#c4c0d4', fontWeight: 500 }}>
                (Sorting the World)
              </span>
            </h1>

            {/* Part A */}
            <div className={styles.narrative}>
              <p>
                <strong>Drawing the line between different categories.</strong>
              </p>
              <p>
                Classification is an AI technique used to sort things into buckets.
                Is this email <strong>Spam</strong> or <strong>Not Spam</strong>?
                Is this a <strong>Cat</strong> or a <strong>Dog</strong>?
                The AI looks at the data and decides which bucket each item falls into.
              </p>
            </div>

            {/* Part B — The CBSE Analogy */}
            <div className={styles.narrative}>
              <p style={{ color: '#00FF88', fontWeight: 600, fontSize: '1.1rem' }}>
                🏫 The CBSE Analogy: Waste Sorting & Noisy Data
              </p>
              <p>
                Think of your school's dustbins. You have a{' '}
                <strong style={{ color: '#00FF88' }}>Green Bin for Wet Waste</strong> (like banana peels) and a{' '}
                <strong style={{ color: '#60A5FA' }}>Blue Bin for Dry Waste</strong> (like plastic bottles).
              </p>
              <p>
                If you map this trash on a graph based on <strong>Weight</strong> and{' '}
                <strong>Sogginess</strong>, AI draws a "<strong>Decision Boundary</strong>"—a straight
                line to sort them.
              </p>
            </div>

            {/* Bin Icons */}
            <div className={styles.binRow}>
              <div
                className={styles.binCard}
                style={{ background: 'rgba(0, 255, 136, 0.06)', borderColor: 'rgba(0, 255, 136, 0.2)' }}
              >
                <Trash2 size={36} color="#00FF88" />
                <span className={styles.binLabel} style={{ color: '#00FF88' }}>
                  🟢 Wet Waste
                </span>
                <span className={styles.binExample}>Banana peels, food scraps</span>
              </div>
              <div
                className={styles.binCard}
                style={{ background: 'rgba(96, 165, 250, 0.06)', borderColor: 'rgba(96, 165, 250, 0.2)' }}
              >
                <Trash2 size={36} color="#60A5FA" />
                <span className={styles.binLabel} style={{ color: '#60A5FA' }}>
                  🔵 Dry Waste
                </span>
                <span className={styles.binExample}>Plastic bottles, paper</span>
              </div>
            </div>

            {/* Noisy Data Callout */}
            <div className={styles.noisyCallout}>
              <AlertTriangle size={22} color="#ffc53d" style={{ flexShrink: 0, marginTop: 2 }} />
              <p>
                <strong>BUT, real life is messy!</strong> What if a piece of paper got dropped in a
                puddle? It becomes wet and heavy, blurring the lines. AI does its best to find the{' '}
                <strong>optimal boundary</strong>, even if it can't be 100% perfect!
              </p>
            </div>

            <div className={styles.navControls}>
              <button className={styles.navButton} onClick={handlePrev} disabled={currentStep === 0}>
                <ChevronLeft size={18} /> Previous
              </button>
              <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={currentStep === totalSteps - 1}
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                Next: The Trash Sorter Game <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════
            STEP 1: INTERACTIVE DEMONSTRATION
            ═══════════════════════════════════════ */}
        {currentStep === 1 && (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className={styles.flashcard}
          >
            {/* Celebration confetti */}
            <AnimatePresence>{isGood && <Confetti key="confetti" />}</AnimatePresence>

            <div className={styles.sectionEyebrow} style={{ color: '#B200FF' }}>
              Section 02 · Interactive Demo
            </div>
            <h1 className={styles.sectionTitle}>
              The{' '}
              <em style={{ backgroundImage: 'linear-gradient(135deg, #B200FF, #00F0FF)' }}>
                Trash Sorter
              </em>{' '}
              Game
            </h1>

            <div className={styles.narrative}>
              <p>
                Separate <strong style={{ color: '#60A5FA' }}>Dry Waste</strong> from{' '}
                <strong style={{ color: '#00FF88' }}>Wet Waste</strong> by adjusting the{' '}
                <strong>Decision Boundary</strong> line below. Use the sliders to move and tilt the
                line until as many dots as possible are in the right zone!
              </p>
            </div>

            {/* Legend */}
            <div className={styles.legendRow}>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#60A5FA', boxShadow: '0 0 8px #60A5FA' }} />
                Dry Waste (Blue Zone = below line)
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: '#00FF88', boxShadow: '0 0 8px #00FF88' }} />
                Wet Waste (Green Zone = above line)
              </div>
            </div>

            {/* ── SVG GRAPH ── */}
            <div className={styles.svgContainer}>
              <svg className={styles.scatterSvg} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
                <defs>
                  {/* Glow filters */}
                  <filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid lines */}
                {Array.from({ length: 11 }, (_, i) => (
                  <React.Fragment key={`grid-${i}`}>
                    <line
                      x1={mapX(i)} y1={mapY(0)} x2={mapX(i)} y2={mapY(DOMAIN)}
                      stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                    />
                    <line
                      x1={mapX(0)} y1={mapY(i)} x2={mapX(DOMAIN)} y2={mapY(i)}
                      stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                    />
                  </React.Fragment>
                ))}

                {/* ── COLORED ZONES (behind everything) ── */}
                {wetZonePath && (
                  <motion.polygon
                    points={wetZonePath}
                    fill="rgba(0, 255, 136, 0.08)"
                    stroke="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {dryZonePath && (
                  <motion.polygon
                    points={dryZonePath}
                    fill="rgba(96, 165, 250, 0.08)"
                    stroke="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Axes */}
                <line
                  x1={mapX(0)} y1={mapY(0)} x2={mapX(DOMAIN)} y2={mapY(0)}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="2"
                />
                <line
                  x1={mapX(0)} y1={mapY(0)} x2={mapX(0)} y2={mapY(DOMAIN)}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="2"
                />

                {/* Axis ticks + labels */}
                {Array.from({ length: 11 }, (_, i) => (
                  <React.Fragment key={`tick-${i}`}>
                    {/* X-axis ticks */}
                    <line
                      x1={mapX(i)} y1={mapY(0)} x2={mapX(i)} y2={mapY(0) + 6}
                      stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                    />
                    <text
                      x={mapX(i)} y={mapY(0) + 20}
                      fill="#8B949E" fontSize="11" textAnchor="middle"
                      fontFamily="Inter, sans-serif"
                    >
                      {i}
                    </text>
                    {/* Y-axis ticks */}
                    <line
                      x1={mapX(0) - 6} y1={mapY(i)} x2={mapX(0)} y2={mapY(i)}
                      stroke="rgba(255,255,255,0.3)" strokeWidth="1"
                    />
                    <text
                      x={mapX(0) - 12} y={mapY(i) + 4}
                      fill="#8B949E" fontSize="11" textAnchor="end"
                      fontFamily="Inter, sans-serif"
                    >
                      {i}
                    </text>
                  </React.Fragment>
                ))}

                {/* Axis titles */}
                <text
                  x={mapX(DOMAIN / 2)} y={mapY(0) + 42}
                  fill="#c4c0d4" fontSize="13" textAnchor="middle"
                  fontFamily="Outfit, sans-serif" fontWeight="600"
                >
                  Weight →
                </text>
                <text
                  x={mapX(0) - 38} y={mapY(DOMAIN / 2)}
                  fill="#c4c0d4" fontSize="13" textAnchor="middle"
                  fontFamily="Outfit, sans-serif" fontWeight="600"
                  transform={`rotate(-90, ${mapX(0) - 38}, ${mapY(DOMAIN / 2)})`}
                >
                  Sogginess →
                </text>

                {/* ── DECISION BOUNDARY LINE ── */}
                <motion.line
                  x1={mapX(lineStart.x)}
                  y1={mapY(lineStart.y)}
                  x2={mapX(lineEnd.x)}
                  y2={mapY(lineEnd.y)}
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeDasharray="10 6"
                  strokeLinecap="round"
                  initial={false}
                  animate={{
                    x1: mapX(lineStart.x),
                    y1: mapY(lineStart.y),
                    x2: mapX(lineEnd.x),
                    y2: mapY(lineEnd.y),
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />

                {/* Zone labels */}
                {wetZonePath && (
                  <text
                    x={mapX(1.5)} y={mapY(9)}
                    fill="rgba(0, 255, 136, 0.5)" fontSize="12"
                    fontFamily="Outfit, sans-serif" fontWeight="700"
                  >
                    WET ZONE
                  </text>
                )}
                {dryZonePath && (
                  <text
                    x={mapX(7.2)} y={mapY(0.8)}
                    fill="rgba(96, 165, 250, 0.5)" fontSize="12"
                    fontFamily="Outfit, sans-serif" fontWeight="700"
                  >
                    DRY ZONE
                  </text>
                )}

                {/* ── DATA POINTS ── */}
                {/* Dry Waste — Blue */}
                {DRY_WASTE.map((pt, i) => {
                  const isCorrect = pt.y < slope * pt.x + intercept;
                  return (
                    <g key={`dry-${i}`}>
                      {/* Outer glow ring */}
                      <circle
                        cx={mapX(pt.x)} cy={mapY(pt.y)} r="12"
                        fill="none" stroke="#60A5FA" strokeWidth="1"
                        opacity="0.3"
                        className={styles.glowDot}
                      />
                      <circle
                        cx={mapX(pt.x)} cy={mapY(pt.y)} r="7"
                        fill="#60A5FA"
                        filter="url(#glowBlue)"
                        opacity="0.9"
                        stroke={isCorrect ? '#ffffff' : '#FF3366'}
                        strokeWidth={isCorrect ? 0 : 2}
                      />
                    </g>
                  );
                })}

                {/* Wet Waste — Green */}
                {WET_WASTE.map((pt, i) => {
                  const isCorrect = pt.y >= slope * pt.x + intercept;
                  return (
                    <g key={`wet-${i}`}>
                      <circle
                        cx={mapX(pt.x)} cy={mapY(pt.y)} r="12"
                        fill="none" stroke="#00FF88" strokeWidth="1"
                        opacity="0.3"
                        className={styles.glowDot}
                      />
                      <circle
                        cx={mapX(pt.x)} cy={mapY(pt.y)} r="7"
                        fill="#00FF88"
                        filter="url(#glowGreen)"
                        opacity="0.9"
                        stroke={isCorrect ? '#ffffff' : '#FF3366'}
                        strokeWidth={isCorrect ? 0 : 2}
                      />
                    </g>
                  );
                })}

                {/* Noisy point labels */}
                <text
                  x={mapX(6) + 12} y={mapY(5) - 4}
                  fill="#ffc53d" fontSize="10" fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  NOISY!
                </text>
                <text
                  x={mapX(4) + 12} y={mapY(6) - 4}
                  fill="#ffc53d" fontSize="10" fontWeight="700"
                  fontFamily="Inter, sans-serif"
                >
                  NOISY!
                </text>
              </svg>
            </div>

            {/* ── SLIDER CONTROLS ── */}
            <div className={styles.controlsSection}>
              <div className={styles.sliderGroup}>
                <label className={styles.sliderLabel}>
                  <span>⬆️ Shift Boundary (Y-Intercept)</span>
                  <span className={styles.sliderValue}>{intercept.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  className={styles.slider}
                  min="-5"
                  max="10"
                  step="0.1"
                  value={intercept}
                  onChange={(e) => setIntercept(parseFloat(e.target.value))}
                />
              </div>
              <div className={styles.sliderGroup}>
                <label className={styles.sliderLabel}>
                  <span>🔄 Tilt Boundary (Slope)</span>
                  <span className={styles.sliderValue}>{slope.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  className={styles.slider}
                  min="-3"
                  max="3"
                  step="0.1"
                  value={slope}
                  onChange={(e) => setSlope(parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* ── ACCURACY METER ── */}
            <div className={styles.accuracyContainer}>
              <span className={styles.accuracyLabel}>Classification Accuracy</span>
              <div className={styles.accuracyBarTrack}>
                <motion.div
                  className={styles.accuracyBarFill}
                  style={{ background: accColor }}
                  initial={false}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                />
              </div>
              <motion.span
                className={styles.accuracyScore}
                style={{ color: accColor }}
                initial={false}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                key={accuracy}
              >
                {accuracy}%
              </motion.span>
              <span className={styles.accuracyHint} style={{ color: isGood ? '#c4c0d4' : accColor }}>
                {accuracy < 50
                  ? '😬 Way off! Try adjusting both sliders.'
                  : accuracy < 80
                  ? '🤔 Keep adjusting the line! You\'re getting closer.'
                  : null
                }
              </span>

              {/* SUCCESS STATE */}
              <AnimatePresence>
                {isGood && (
                  <motion.div
                    className={styles.successBanner}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                  >
                    <Sparkles size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                    Great job! (Accuracy: {accuracy}%). Real-world data is messy, so the AI found the
                    best possible line even if it's not 100% perfect!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Equation display */}
            <div style={{
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              color: '#8B949E',
              letterSpacing: '0.02em',
            }}>
              Decision Boundary: <strong style={{ color: '#f4f1ea' }}>y = {slope.toFixed(1)}x + {intercept.toFixed(1)}</strong>
              &nbsp; · &nbsp; Sorted: <strong style={{ color: accColor }}>{correctCount}/{totalCount}</strong> dots correct
            </div>

            <div className={styles.navControls}>
              <button className={styles.navButton} onClick={handlePrev} disabled={currentStep === 0}>
                <ChevronLeft size={18} /> Previous
              </button>
              <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={currentStep === totalSteps - 1}
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                Next Section <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Classification;
