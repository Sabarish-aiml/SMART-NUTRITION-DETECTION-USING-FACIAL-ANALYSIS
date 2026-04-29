import React from 'react';
import { useAppContext } from '../AppContext';
import { Clock, User } from 'lucide-react';

const History = () => {
  const { history, clearHistory } = useAppContext();

  return (
    <div className="history-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Analysis History</h1>
        {history.length > 0 && (
          <button className="btn btn-secondary" onClick={clearHistory}>
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.7 }}>
          <Clock size={48} style={{ margin: '0 auto 1rem auto', color: 'var(--text-secondary)' }} />
          <h3>No History Found</h3>
          <p>Run a screening to see your past results here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {history.map((record) => (
            <div key={record.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Scan Summary</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(record.timestamp).toLocaleString()}
                  </span>
                </div>
                <div style={{ background: 'var(--accent-primary)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  CONF: {record.metrics.confidence_score}%
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <span className="status-pill" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  {record.analysis_report.final_nutrition_category}
                </span>
                <span className="status-pill" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                  Wellness {record.analysis_report.overall_wellness_score}%
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{ background: 'var(--surface-col)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-col)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Hydration</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{record.metrics.hydration_level}%</div>
                </div>
                <div style={{ background: 'var(--surface-col)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-col)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Nutrition</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{record.metrics.nutrition_score}%</div>
                </div>
                <div style={{ background: 'var(--surface-col)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-col)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Skin Health</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{record.metrics.skin_health_indicator}%</div>
                </div>
                <div style={{ background: 'var(--surface-col)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-col)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Risk</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: record.metrics.lifestyle_risk > 50 ? 'var(--danger)' : 'var(--text-primary)' }}>
                    {record.metrics.lifestyle_risk}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
