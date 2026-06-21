import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, Zap, AlertTriangle } from 'lucide-react';
import api from '../../api';

const DataCanvas = ({ scenario, selectedVariant, onSelectVariant, previewData, loading, onRunModel, isTraining }) => {
  const [interpretData, setInterpretData] = useState(null);

  useEffect(() => {
    const fetchInterpret = async () => {
      if (!scenario || !selectedVariant) return;
      try {
        const response = await api.get(`/${scenario.model_type.toLowerCase()}/interpret/`, {
          params: { scenario_id: scenario.id, variant_name: selectedVariant }
        });
        setInterpretData(response.data);
      } catch (err) {
        console.error("No interpretation found", err);
        setInterpretData(null);
      }
    };
    fetchInterpret();
  }, [scenario, selectedVariant]);

  if (!scenario) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        <h2>Select an experiment from the left to begin.</h2>
      </div>
    );
  }

  // View 1: Data Variant Selection Grid
  if (!selectedVariant) {
    return (
      <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{scenario.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px' }}>
          {scenario.description}
        </p>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--accent-purple)' }}>Select a Dataset Variant</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {scenario.variants?.map((variant, index) => (
            <div 
              key={variant.name}
              className="glass-panel"
              onClick={() => onSelectVariant(variant.name)}
              style={{
                padding: '25px', cursor: 'pointer', transition: 'all 0.2s',
                borderTop: `3px solid ${index % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-green)'}`
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <Database size={20} color="var(--text-secondary)" />
                <h3 style={{ fontSize: '1.2rem' }}>{variant.label}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Load this specific data condition to see how the AI model reacts to it.
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View 2: Variant Selected (Graph + Interpretation)
  const chartData = previewData?.rows?.map((row, index) => {
    const obj = { name: `R${index + 1}` };
    previewData.columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  }) || [];

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header block with Back button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <button 
            onClick={() => onSelectVariant(null)}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', marginBottom: '10px', fontSize: '0.9rem' }}
          >
            ← Back to Datasets
          </button>
          <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>{scenario.variants.find(v => v.name === selectedVariant)?.label}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{scenario.title}</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={onRunModel}
          disabled={isTraining || loading}
          style={{ fontSize: '1.1rem', padding: '12px 30px', opacity: (isTraining || loading) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Zap size={18} /> {isTraining ? 'Training...' : 'Run Model'}
        </button>
      </div>

      {/* The Visual Chart Area */}
      {previewData && !loading && (
        <div className="glass-panel" style={{ height: '350px', padding: '20px', marginBottom: '30px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fontSize: 12}} />
              <YAxis stroke="var(--text-secondary)" tick={{fontSize: 12}} />
              <Tooltip contentStyle={{ background: 'var(--bg-panel)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }} />
              <Line type="monotone" dataKey={previewData.columns[previewData.columns.length - 1]} stroke="var(--accent-cyan)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Data Interpretation Panel */}
      {interpretData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div className="glass-panel" style={{ padding: '25px' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--accent-purple)' }}>Data Story & Preprocessing</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {interpretData.column_descriptions.slice(0, 3).map(col => (
                <div key={col.name}>
                  <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '4px' }}>{col.name}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', display: 'block' }}>{col.description}</span>
                  {col.has_anomalies && (
                    <div style={{ marginTop: '6px', color: '#ffb86c', fontSize: '0.8rem', background: 'rgba(255, 184, 108, 0.1)', padding: '8px', borderRadius: '4px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <AlertTriangle size={14} style={{ marginTop: '2px' }} />
                      <span>{col.anomaly_note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '25px', borderColor: interpretData.bias_analysis.severity !== 'None' ? 'var(--accent-red)' : 'var(--glass-border)' }}>
            <h3 style={{ marginBottom: '15px', color: interpretData.bias_analysis.severity !== 'None' ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              Bias & Ethics Check
            </h3>
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Detected Issue</span>
              <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{interpretData.bias_analysis.bias_type}</p>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {interpretData.bias_analysis.description}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default DataCanvas;
