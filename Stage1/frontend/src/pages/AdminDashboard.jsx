import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, Settings, Users, Database } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-purple)', marginBottom: '10px' }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}.</p>
        </div>
        <button className="btn-secondary" onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Placeholder Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        
        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '15px', background: 'rgba(178, 0, 255, 0.1)', borderRadius: '50%', color: 'var(--accent-purple)', marginBottom: '20px' }}>
            <Database size={32} />
          </div>
          <h2 style={{ marginBottom: '10px' }}>Manage Datasets</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>Upload custom CSV datasets for students to use in the lab.</p>
          <button className="btn-secondary" style={{ width: '100%' }}>Coming in Stage 2</button>
        </div>

        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '15px', background: 'rgba(0, 240, 255, 0.1)', borderRadius: '50%', color: 'var(--accent-cyan)', marginBottom: '20px' }}>
            <Users size={32} />
          </div>
          <h2 style={{ marginBottom: '10px' }}>Student Progress</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>Track which scenarios your students have completed.</p>
          <button className="btn-secondary" style={{ width: '100%' }}>Coming Soon</button>
        </div>

        <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            <Settings size={32} />
          </div>
          <h2 style={{ marginBottom: '10px' }}>System Settings</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>Manage API keys and global platform configurations.</p>
          <button className="btn-secondary" style={{ width: '100%' }}>Settings</button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
