import React from 'react';
import {
  ArrowLeft, PlayCircle, Lock, Layers,
  Sparkles, Dog, Calculator, BarChart3, TrendingUp,
  Boxes, Gamepad2, BrainCircuit
} from 'lucide-react';
import styles from './AIFoundationsDashboard.module.css';

const AIFoundationsDashboard = ({
  onBackToDashboard,
  onNavigateToLesson1,
  onNavigateToSmartPuppy,
  onNavigateToMaths,
  onNavigateToDataAnalysis,
  onNavigateToSupervised,
  onNavigateToUnsupervised,
  onNavigateToRL,
  onNavigateToNeuralNetworks
}) => {
  const topics = [
    {
      id: 'emergence',
      lessonNum: 'Topic 01',
      title: 'Emergence of AI',
      description: 'Trace the chain reaction of mathematics — from counting stones to algebra, calculus, and the dawn of artificial intelligence.',
      icon: Sparkles,
      color: 'var(--accent-purple)',
      active: true,
      onClick: onNavigateToLesson1,
      subtopics: ['History of Math', 'Machine Learning', 'Deep Learning', 'What is AI?'],
      chapters: 5
    },
    {
      id: 'what_is_ai',
      lessonNum: 'Topic 02',
      title: 'What is AI?',
      description: 'The Smart Puppy analogy — understand how AI learns from examples instead of following strict rules.',
      icon: Dog,
      color: 'var(--accent-cyan)',
      active: true,
      onClick: onNavigateToSmartPuppy,
      subtopics: ['Smart Puppy Analogy', 'Code vs Learn', 'Training from Data'],
      chapters: 3
    },
    {
      id: 'maths',
      lessonNum: 'Topic 03',
      title: 'Maths & Statistics',
      description: 'Explore the mathematical building blocks that power every AI model — from averages to probability distributions.',
      icon: Calculator,
      color: 'var(--accent-green)',
      active: true,
      onClick: onNavigateToMaths,
      subtopics: ['Mean, Median & Mode', 'Outlier Detection', 'Probability', 'Distributions'],
      chapters: 6
    },
    {
      id: 'data_analysis',
      lessonNum: 'Topic 04',
      title: 'Data Analysis',
      description: 'Learn to collect, visualize, and interrogate data — the fuel that drives every intelligent system.',
      icon: BarChart3,
      color: 'var(--accent-purple)',
      active: true,
      onClick: onNavigateToDataAnalysis,
      subtopics: ['Data Collection', 'Charts & Patterns', 'Bias Detection', 'Preprocessing'],
      chapters: 5
    },
    {
      id: 'supervised',
      lessonNum: 'Topic 05',
      title: 'Supervised Learning',
      description: 'Teach a machine to predict outcomes by showing it labelled examples — regression, classification, and decision trees.',
      icon: TrendingUp,
      color: 'var(--accent-cyan)',
      active: false,
      onClick: onNavigateToSupervised,
      subtopics: ['Line Fitter (Regression)', 'Classification Boundary', 'Decision Trees'],
      chapters: 7
    },
    {
      id: 'unsupervised',
      lessonNum: 'Topic 06',
      title: 'Unsupervised Learning',
      description: 'Discover hidden structure in unlabelled data — watch clusters form and patterns emerge on their own.',
      icon: Boxes,
      color: 'var(--accent-green)',
      active: false,
      onClick: onNavigateToUnsupervised,
      subtopics: ['What is Clustering?', 'K-Means Algorithm', 'Real-world Applications'],
      chapters: 4
    },
    {
      id: 'reinforcement',
      lessonNum: 'Topic 07',
      title: 'Reinforcement Learning',
      description: 'Guide an AI agent through trial and error — rewards, penalties, and the maze that teaches itself.',
      icon: Gamepad2,
      color: 'var(--accent-red)',
      active: false,
      onClick: onNavigateToRL,
      subtopics: ['Agent & Environment', 'Rewards & Penalties', 'The Maze Runner'],
      chapters: 4
    },
    {
      id: 'neural_networks',
      lessonNum: 'Topic 08',
      title: 'Neural Networks',
      description: 'Build a brain-inspired network from scratch — connect neurons, adjust weights, and watch it learn.',
      icon: BrainCircuit,
      color: 'var(--accent-purple)',
      active: false,
      onClick: onNavigateToNeuralNetworks,
      subtopics: ['Neurons & Layers', 'Weights & Biases', 'Training & Backpropagation'],
      chapters: 5
    }
  ];

  const completedCount = topics.filter(t => t.active).length; // For now, only "Emergence" counts as accessible
  const totalCount = topics.length;
  const progressPercent = (completedCount / totalCount) * 100;

  return (
    <div className={styles.pageWrapper}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={onBackToDashboard}>
            <ArrowLeft size={18} /> Back
          </button>
          <div className={styles.titleBlock}>
            <h1>AI Foundations</h1>
            <p>Master the core concepts that power artificial intelligence.</p>
          </div>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>Module Progress</span>
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className={styles.progressCount}>
          {completedCount}/{totalCount} topics
        </span>
      </div>

      {/* ── Card Grid ── */}
      <div className={styles.cardGrid}>
        {topics.map((topic) => {
          const Icon = topic.icon;
          const isActive = topic.active;

          return (
            <div
              key={topic.id}
              id={`topic-card-${topic.id}`}
              className={`${styles.topicCard} ${isActive ? styles.topicCardActive : styles.topicCardLocked}`}
              onClick={isActive ? topic.onClick : undefined}
              style={{
                borderColor: isActive ? `${topic.color}44` : undefined,
              }}
              onMouseEnter={(e) => {
                if (isActive) {
                  e.currentTarget.style.borderColor = topic.color;
                  e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.4), 0 0 20px ${topic.color}22`;
                }
              }}
              onMouseLeave={(e) => {
                if (isActive) {
                  e.currentTarget.style.borderColor = `${topic.color}44`;
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {/* Top gradient bar */}
              <style>{`
                #topic-card-${topic.id}::before {
                  background: linear-gradient(90deg, ${topic.color}, transparent);
                }
              `}</style>

              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div
                  className={styles.iconBox}
                  style={{
                    background: `${topic.color}15`,
                    color: topic.color,
                    boxShadow: isActive ? `0 0 20px ${topic.color}15` : 'none'
                  }}
                >
                  <Icon size={26} />
                </div>
                <div className={styles.cardMeta}>
                  <div className={styles.lessonNumber} style={{ color: topic.color }}>
                    {topic.lessonNum}
                  </div>
                  <h2 className={styles.cardTitle}>{topic.title}</h2>
                </div>
              </div>

              {/* Description */}
              <p className={styles.cardDescription}>{topic.description}</p>

              {/* Subtopic Pills */}
              <div className={styles.pillsRow}>
                {topic.subtopics.map((sub, i) => (
                  <span
                    key={i}
                    className={styles.pill}
                    style={{
                      borderColor: isActive ? `${topic.color}25` : undefined,
                      color: isActive ? `${topic.color}cc` : undefined
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                {isActive ? (
                  <button className={styles.startBtn}>
                    <PlayCircle size={16} /> Start Topic
                  </button>
                ) : (
                  <div className={styles.lockedBadge}>
                    <Lock size={14} /> Locked
                  </div>
                )}
                <span className={styles.chaptersCount}>
                  <Layers size={14} /> {topic.chapters} chapters
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIFoundationsDashboard;
