import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const ResultsOverlay = ({ result, onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
      padding: '40px'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', maxWidth: '600px', 
        background: 'rgba(25, 28, 41, 0.95)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        position: 'relative',
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{ padding: '25px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {result.success ? (
              <CheckCircle size={28} color="var(--accent-green)" />
            ) : (
              <X size={28} color="var(--accent-red)" />
            )}
            <h2 style={{ fontSize: '1.5rem', color: result.success ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {result.success ? 'Experiment Successful' : 'Experiment Failed'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '25px', overflowY: 'auto', maxHeight: '60vh' }}>
          
          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--accent-cyan)' }}>AI Explanation</h3>
          <div style={{ 
            background: 'rgba(0, 240, 255, 0.05)', 
            border: '1px solid rgba(0, 240, 255, 0.2)',
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '25px',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: 'var(--text-primary)'
          }}>
            {result.explanation || "No explanation provided."}
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Console Output</h3>
          <pre style={{
            background: '#0d1117',
            padding: '15px',
            borderRadius: '8px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.85rem',
            color: '#c9d1d9',
            overflowX: 'auto',
            marginBottom: '15px',
            border: '1px solid #30363d'
          }}>
            {result.stdout || "No output."}
          </pre>

          {result.stderr && (
            <pre style={{
              background: 'rgba(255, 51, 102, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              color: 'var(--accent-red)',
              overflowX: 'auto',
              border: '1px solid rgba(255, 51, 102, 0.3)'
            }}>
              {result.stderr}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 25px', borderTop: '1px solid var(--glass-border)', textAlign: 'right' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close & Continue
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultsOverlay;
