import React from 'react';
import { useAppContext } from '../AppContext';
import { Moon, Sun, Trash2 } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme, clearHistory } = useAppContext();

  return (
    <div className="settings-page">
      <h1 style={{ marginBottom: '2rem' }}>Settings</h1>

      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-col)' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />} Theme Preference
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Toggle between light and dark mode</p>
          </div>
          <button className="btn btn-secondary" onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--danger)' }}>
              <Trash2 size={20} /> Data Management
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Permanently delete all past screening history</p>
          </div>
          <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }} onClick={() => {
            if(window.confirm('Are you sure you want to clear all history?')) clearHistory();
          }}>
            Clear Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
