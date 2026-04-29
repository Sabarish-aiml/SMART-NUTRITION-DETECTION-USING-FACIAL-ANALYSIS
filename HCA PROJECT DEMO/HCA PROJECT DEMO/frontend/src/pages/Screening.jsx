import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { Camera, Upload, Play, Square, Loader2, RefreshCw, CheckCircle, Activity, Heart, Droplet, Apple, Moon, AlertTriangle, Download } from 'lucide-react';
import { useAppContext } from '../AppContext';

const FacialHealthAnalyzer = () => {
  const [useCamera, setUseCamera] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [lifestyleData, setLifestyleData] = useState({
    sleep_hours: '',
    screen_time: '',
    stress_level: '',
    activity_level: '',
    water_intake: '',
    diet_quality: '',
    protein_intake: '',
    sugar_intake: '',
    bmi: '',
    skin_condition_perception: '',
    hydration_perception: ''
  });

  const { addHistory } = useAppContext();

  const webcamRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLifestyleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const captureCamera = useCallback(() => {
    if (webcamRef.current) {
      const src = webcamRef.current.getScreenshot();
      setImageSrc(src);
      setUseCamera(false);
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setUseCamera(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageSrc) {
      alert('Please capture or upload an image first.');
      return;
    }

    // Check if all lifestyle data is filled
    const requiredFields = Object.keys(lifestyleData);
    const missingFields = requiredFields.filter(field => !lifestyleData[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all lifestyle information: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      // Convert data URL to blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const file = new File([blob], 'face.jpg', { type: blob.type });

      // Convert lifestyle data to numbers
      const numericLifestyleData = {};
      for (const [key, value] of Object.entries(lifestyleData)) {
        numericLifestyleData[key] = parseFloat(value);
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('lifestyleData', JSON.stringify(numericLifestyleData));

      const res = await axios.post('http://localhost:8000/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResults(res.data);
      addHistory(res.data);

    } catch (err) {
      console.error(err);
      alert("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setImageSrc(null);
    setResults(null);
    setUseCamera(false);
    setLifestyleData({
      sleep_hours: '',
      screen_time: '',
      stress_level: '',
      activity_level: '',
      water_intake: '',
      diet_quality: '',
      protein_intake: '',
      sugar_intake: '',
      bmi: '',
      skin_condition_perception: '',
      hydration_perception: ''
    });
  };

  const getStatusPillColor = (status) => {
    if (status === 'Normal') return '#10b981';
    if (status === 'Mild Deficiency') return '#f59e0b';
    if (status === 'Moderate Deficiency') return '#f97316';
    if (status === 'Risk / Severe') return '#ef4444';
    if (status === 'Healthy') return '#10b981';
    if (status === 'Needs Improvement') return '#f59e0b';
    return '#64748b';
  };

  const downloadReport = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NutriScan_Report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const chartData = results ? [
    { subject: 'Hydration', Score: results.metrics.hydration_level, fullMark: 100 },
    { subject: 'Nutrition', Score: results.metrics.nutrition_score, fullMark: 100 },
    { subject: 'Skin Health', Score: results.metrics.skin_health_indicator, fullMark: 100 },
    { subject: 'Confidence', Score: results.metrics.confidence_score, fullMark: 100 }
  ] : [];

  return (
    <div className="facial-analyzer" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <h2>AI Analysis in Progress</h2>
          <p>Analyzing facial biomarkers for health insights...</p>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Facial Health & Wellness Analyzer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Upload a clear facial image for comprehensive health analysis using advanced AI.</p>
        <div style={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#856404' }}>
            <AlertTriangle size={20} />
            <strong>Medical Disclaimer:</strong>
          </div>
          <p style={{ margin: '0.5rem 0 0 0', color: '#856404' }}>
            This is not a medical diagnosis. Results are for informational purposes only. Consult healthcare professionals for medical advice.
          </p>
        </div>
      </div>

      {/* Lifestyle Information Form */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Heart size={20} className="text-accent" /> Lifestyle Information
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Please provide your daily lifestyle information to enhance the accuracy of your facial health analysis.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sleep Hours (per night)</label>
            <input
              type="number"
              name="sleep_hours"
              value={lifestyleData.sleep_hours}
              onChange={handleInputChange}
              placeholder="e.g., 8"
              min="0"
              max="24"
              step="0.5"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Screen Time (hours/day)</label>
            <input
              type="number"
              name="screen_time"
              value={lifestyleData.screen_time}
              onChange={handleInputChange}
              placeholder="e.g., 6"
              min="0"
              max="24"
              step="0.5"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Stress Level (1-10)</label>
            <input
              type="number"
              name="stress_level"
              value={lifestyleData.stress_level}
              onChange={handleInputChange}
              placeholder="1-10"
              min="1"
              max="10"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Activity Level (1-10)</label>
            <input
              type="number"
              name="activity_level"
              value={lifestyleData.activity_level}
              onChange={handleInputChange}
              placeholder="1-10"
              min="1"
              max="10"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Water Intake (liters/day)</label>
            <input
              type="number"
              name="water_intake"
              value={lifestyleData.water_intake}
              onChange={handleInputChange}
              placeholder="e.g., 2.5"
              min="0"
              max="10"
              step="0.1"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Diet Quality (1-10)</label>
            <input
              type="number"
              name="diet_quality"
              value={lifestyleData.diet_quality}
              onChange={handleInputChange}
              placeholder="1-10"
              min="1"
              max="10"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Protein Intake (1-10)</label>
            <input
              type="number"
              name="protein_intake"
              value={lifestyleData.protein_intake}
              onChange={handleInputChange}
              placeholder="1-10"
              min="1"
              max="10"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sugar Intake (1-10)</label>
            <input
              type="number"
              name="sugar_intake"
              value={lifestyleData.sugar_intake}
              onChange={handleInputChange}
              placeholder="1-10"
              min="1"
              max="10"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>BMI</label>
            <input
              type="number"
              name="bmi"
              value={lifestyleData.bmi}
              onChange={handleInputChange}
              placeholder="e.g., 22.5"
              min="10"
              max="50"
              step="0.1"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Skin Condition (1-10)</label>
            <input
              type="number"
              name="skin_condition_perception"
              value={lifestyleData.skin_condition_perception}
              onChange={handleInputChange}
              placeholder="1-10"
              min="1"
              max="10"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Hydration Perception (1-10)</label>
            <input
              type="number"
              name="hydration_perception"
              value={lifestyleData.hydration_perception}
              onChange={handleInputChange}
              placeholder="1-10"
              min="1"
              max="10"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-col)' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Left Column: Image Capture */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} className="text-accent" /> Facial Image Capture
          </h2>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            {!useCamera && !imageSrc && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '2px dashed var(--border-col)', borderRadius: '1rem', width: '100%' }}>
                <Camera size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>No image selected</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => setUseCamera(true)}>
                    <Camera size={18} /> Open Camera
                  </button>
                  <label className="btn btn-secondary">
                    <Upload size={18} /> Upload Image
                    <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            )}

            {useCamera && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
                  style={{ width: '100%', borderRadius: '1rem' }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" onClick={captureCamera}>
                    <Play size={18} /> Capture
                  </button>
                  <button className="btn btn-secondary" onClick={() => setUseCamera(false)}>
                    <Square size={18} /> Cancel
                  </button>
                </div>
              </div>
            )}

            {imageSrc && !useCamera && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={imageSrc}
                  alt="Captured face"
                  style={{ width: '100%', borderRadius: '1rem', maxHeight: '300px', objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}>
                    <Activity size={18} /> Analyze Health
                  </button>
                  <button className="btn btn-secondary" onClick={resetAnalysis}>
                    <RefreshCw size={18} /> Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} className="text-accent" /> Health Analysis Results
          </h2>

          {!results ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <Activity size={48} style={{ margin: '0 auto 1rem' }} />
              <p>Upload an image and click "Analyze Health" to see your facial health insights.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Final Nutrition Category</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', borderRadius: '999px', background: getStatusPillColor(results.analysis_report.nutrition_status) + '20', color: getStatusPillColor(results.analysis_report.nutrition_status), fontWeight: 700 }}>
                      {results.analysis_report.final_nutrition_category}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', width: '100%' }}>
                    <div className="report-card">
                      <span className="report-card-label">Wellness Score</span>
                      <strong>{results.analysis_report.overall_wellness_score}%</strong>
                      <span className="report-card-note">Aggregated health status</span>
                    </div>
                    <div className="report-card">
                      <span className="report-card-label">Status</span>
                      <strong>{results.analysis_report.overall_status}</strong>
                      <span className="report-card-note">Action recommendations below</span>
                    </div>
                    <button className="btn btn-primary" style={{ justifySelf: 'end', minWidth: '180px' }} onClick={downloadReport}>
                      <Download size={16} /> Download Report
                    </button>
                  </div>
                </div>

                <div className="result-overview-grid">
                  {[
                    { title: 'Hydration', value: results.metrics.hydration_level, color: '#3b82f6' },
                    { title: 'Nutrition', value: results.metrics.nutrition_score, color: '#10b981' },
                    { title: 'Skin Health', value: results.metrics.skin_health_indicator, color: '#8b5cf6' },
                    { title: 'Confidence', value: results.metrics.confidence_score, color: '#f59e0b' }
                  ].map((item) => (
                    <div key={item.title} className="metric-card" style={{ borderLeft: `4px solid ${item.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 600 }}>{item.title}</span>
                        <span style={{ fontWeight: 700 }}>{item.value}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${item.value}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="analysis-panel">
                  <h3>Detailed Results</h3>
                  {results.analysis_report.detailed_analysis.map((item) => (
                    <div key={item.title} className="result-explanation" style={{ background: 'var(--surface-col)', border: '1px solid var(--border-col)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <strong>{item.title}</strong>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item.score}%</span>
                      </div>
                      <div className="reason">{item.description}</div>
                      <div className="suggestion">{item.recommendation}</div>
                    </div>
                  ))}
                </div>

                <div className="analysis-panel">
                  <h3>Suggested Improvements</h3>
                  <ul className="recommendation-list">
                    {results.analysis_report.recommendations.map((item, index) => (
                      <li key={index} className="recommendation-item">{item}</li>
                    ))}
                  </ul>

                  <div style={{ marginTop: '1rem' }}>
                    <h4 style={{ marginBottom: '0.75rem' }}>Nutrition Status Classification</h4>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                      {results.analysis_report.category_breakdown.map((category) => (
                        <div key={category.label} style={{ padding: '0.85rem 1rem', borderRadius: '0.85rem', background: 'var(--surface-col)', border: '1px solid var(--border-col)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 600 }}>{category.label}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{category.range}</span>
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{category.details}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-col)', paddingTop: '1rem' }}>
                <div><strong>Face Detected:</strong> {results.analysis_details.face_detected ? 'Yes' : 'No'}</div>
                <div><strong>Landmarks:</strong> {results.analysis_details.landmarks_count}</div>
                <div><strong>Resolution:</strong> {results.analysis_details.image_resolution}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacialHealthAnalyzer;
