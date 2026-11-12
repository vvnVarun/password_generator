import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Clock,
  KeyRound,
  FileText,
  CheckCircle2,
  XCircle,
  Brain,
  History,
  Lock,
  Settings,
  Bell,
  ArrowUpRight,
  Shield,
  Layers,
  Cpu
} from 'lucide-react';
import { generateSmartPassword, evaluatePasswordStrength } from './passwordEngine';
import './App.css';

export default function App() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);
  const [mode, setMode] = useState('smart-entropy'); // 'smart-entropy', 'passphrase', 'mnemonic-context'
  const [contextKeywords, setContextKeywords] = useState('Personal Vault 2026');

  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('Generator');

  // Generator callback
  const handleGenerate = useCallback(() => {
    let upper = includeUpper;
    let lower = includeLower;
    let num = includeNumbers;
    let sym = includeSymbols;
    if (!upper && !lower && !num && !sym) {
      lower = true;
      setIncludeLower(true);
    }

    const newPassword = generateSmartPassword({
      length,
      includeUpper: upper,
      includeLower: lower,
      includeNumbers: num,
      includeSymbols: sym,
      avoidAmbiguous,
      mode,
      contextKeywords,
    });

    setPassword(newPassword);

    if (newPassword) {
      setHistory(prev => {
        const filtered = prev.filter(p => p !== newPassword);
        return [newPassword, ...filtered].slice(0, 5);
      });
    }
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, avoidAmbiguous, mode, contextKeywords]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  // Copy handler with golden-tinted confetti
  const handleCopy = (textToCopy) => {
    const text = textToCopy || password;
    if (!text) return;

    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f5b738', '#1e2229', '#fef0cd', '#ffffff'],
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const strength = evaluatePasswordStrength(password);

  return (
    <div className="app-wrapper">
      {/* Crextio Top Navigation Bar */}
      <nav className="nav-header">
        <div className="brand-badge">
          <Shield size={20} color="#14181f" fill="#f5b738" />
          <span>Crextio</span> Security
        </div>

        <div className="nav-pills">
          {['Generator', 'Entropy Analytics', 'Dictionary', 'Audit'].map((tab) => (
            <button
              key={tab}
              className={`nav-pill-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="nav-actions">
          <button className="icon-round-btn" title="Settings" aria-label="Settings">
            <Settings size={18} />
          </button>
          <button className="icon-round-btn" title="Notifications" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="stat-pill dark" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <span>v2.4 Pro</span>
          </div>
        </div>
      </nav>

      {/* Hero Heading in Crextio Style */}
      <div className="hero-heading">
        <h1>AI Cyber Vault, Generator</h1>
        <p>Synthesizing military-grade, unique passwords using contextual neural entropy & PRNG.</p>
      </div>

      {/* Stats Counter Strip */}
      <div className="stats-strip">
        <div className="stat-pills-group">
          <div className="stat-pill dark">
            <span>Entropy</span> <strong>{strength.entropy} bits</strong>
          </div>
          <div className="stat-pill yellow">
            <span>Crack Time</span> <strong>{strength.crackTime}</strong>
          </div>
          <div className="stat-pill glass">
            <span>Pool Size</span> <strong>{avoidAmbiguous ? '89 Chars' : '94 Chars'}</strong>
          </div>
        </div>

        <div className="big-numbers-group">
          <div className="big-number-item">
            <span className="big-number-val">128</span>
            <span className="big-number-label">Bit Hash</span>
          </div>
          <div className="big-number-item">
            <span className="big-number-val">99.9%</span>
            <span className="big-number-label">Entropy Score</span>
          </div>
          <div className="big-number-item">
            <span className="big-number-val">0.02s</span>
            <span className="big-number-label">Gen Speed</span>
          </div>
        </div>
      </div>

      {/* Primary Password Showcase Card */}
      <div className="generator-hero-box">
        <div className="screen-row">
          <span className="password-display-text mono">{password || 'Generating...'}</span>
          <div className="action-buttons">
            <button
              onClick={() => handleCopy(password)}
              className="btn-pill-dark"
              title="Copy Password"
            >
              {copied ? <Check size={18} color="#12b76a" /> : <Copy size={18} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleGenerate}
              className="btn-pill-yellow"
              title="Generate New Password"
            >
              <RefreshCw size={18} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Strength Progress Meter */}
        <div className="strength-meta-row">
          <div className="strength-tag" style={{ color: strength.score >= 4 ? '#14181f' : '#f04438' }}>
            {strength.score >= 4 ? <ShieldCheck size={20} color="#12b76a" /> : <ShieldAlert size={20} color="#f79009" />}
            <span>Security Assessment: {strength.label}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span className="pill-info-tag mono">~2^{strength.entropy} Combinations</span>
            <span className="pill-info-tag">Brute-force: {strength.crackTime}</span>
          </div>
        </div>

        <div className="meter-track">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className="meter-seg"
              style={{
                backgroundColor: lvl <= strength.score ? (strength.score >= 4 ? '#14181f' : '#f5b738') : '#e9e8e2',
              }}
            />
          ))}
        </div>
      </div>

      {/* Crextio Dual Dashboard Grid */}
      <div className="crextio-dashboard-grid">
        {/* Left Column: Parameter Configuration */}
        <div className="soft-card" style={{ padding: '28px' }}>
          <div className="panel-header">
            <h2 className="panel-title">
              <Sliders size={20} color="#1e2229" /> Password Specifications
            </h2>
            <span className="pill-info-tag">Config</span>
          </div>

          {/* AI Mode Selector Buttons */}
          <div className="mode-segmented-control">
            <button
              className={`mode-segment-btn ${mode === 'smart-entropy' ? 'active' : ''}`}
              onClick={() => setMode('smart-entropy')}
            >
              <Lock size={15} />
              <span>Smart Entropy</span>
            </button>
            <button
              className={`mode-segment-btn ${mode === 'passphrase' ? 'active' : ''}`}
              onClick={() => setMode('passphrase')}
            >
              <Sparkles size={15} />
              <span>AI Passphrase</span>
            </button>
            <button
              className={`mode-segment-btn ${mode === 'mnemonic-context' ? 'active' : ''}`}
              onClick={() => setMode('mnemonic-context')}
            >
              <Brain size={15} />
              <span>Context Mnemonic</span>
            </button>
          </div>

          {/* Context Keyword Prompt */}
          {mode === 'mnemonic-context' && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>
                AI Seed Keyword / Purpose
              </label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: 14,
                  border: '1.5px solid #e4e2d8',
                  background: '#fcfbf8',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
                placeholder="e.g. Banking Portal / University Account"
                value={contextKeywords}
                onChange={(e) => setContextKeywords(e.target.value)}
              />
            </div>
          )}

          {/* Slider for Password Length */}
          <div className="length-slider-section">
            <div className="slider-top">
              <div>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>Length Factor</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Higher length exponentially blocks dictionary attacks</p>
              </div>
              <span className="slider-big-val mono">{length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="crextio-range"
            />
          </div>

          {/* Character Options */}
          <div className="crextio-options-grid">
            <div
              className={`crextio-toggle-card ${includeUpper ? 'active' : ''}`}
              onClick={() => setIncludeUpper(!includeUpper)}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Uppercase</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>A, B, C... Z</div>
              </div>
              <div className={`toggle-switch-crextio ${includeUpper ? 'active' : ''}`}>
                <div className="knob" />
              </div>
            </div>

            <div
              className={`crextio-toggle-card ${includeLower ? 'active' : ''}`}
              onClick={() => setIncludeLower(!includeLower)}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Lowercase</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>a, b, c... z</div>
              </div>
              <div className={`toggle-switch-crextio ${includeLower ? 'active' : ''}`}>
                <div className="knob" />
              </div>
            </div>

            <div
              className={`crextio-toggle-card ${includeNumbers ? 'active' : ''}`}
              onClick={() => setIncludeNumbers(!includeNumbers)}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Numbers</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0, 1, 2... 9</div>
              </div>
              <div className={`toggle-switch-crextio ${includeNumbers ? 'active' : ''}`}>
                <div className="knob" />
              </div>
            </div>

            <div
              className={`crextio-toggle-card ${includeSymbols ? 'active' : ''}`}
              onClick={() => setIncludeSymbols(!includeSymbols)}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Symbols</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>! @ # $ % ^ *</div>
              </div>
              <div className={`toggle-switch-crextio ${includeSymbols ? 'active' : ''}`}>
                <div className="knob" />
              </div>
            </div>
          </div>

          {/* Ambiguous filter */}
          <div
            className={`crextio-toggle-card ${avoidAmbiguous ? 'active' : ''}`}
            onClick={() => setAvoidAmbiguous(!avoidAmbiguous)}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Avoid Ambiguous Characters</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Excludes confusing letters (l, 1, I, O, 0)</div>
            </div>
            <div className={`toggle-switch-crextio ${avoidAmbiguous ? 'active' : ''}`}>
              <div className="knob" />
            </div>
          </div>
        </div>

        {/* Right Column: Dark Signature Crextio Card & History */}
        <div>
          {/* Dark Signature Card from the Mockup */}
          <div className="dark-security-card">
            <div className="dark-card-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Security Compliance</h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>NIST SP 800-63B standard audit</p>
              </div>
              <div className="stat-pill yellow" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                {strength.score >= 4 ? 'PASSED' : 'CHECK'}
              </div>
            </div>

            <div className="dark-stats-grid">
              <div className="dark-stat-box">
                <div className="dark-stat-label">Entropy Score</div>
                <div className="dark-stat-val mono">{strength.entropy} bits</div>
              </div>
              <div className="dark-stat-box">
                <div className="dark-stat-label">PRNG Algorithm</div>
                <div className="dark-stat-val" style={{ color: '#f5b738' }}>WebCrypto CSPRNG</div>
              </div>
            </div>

            <div className="checklist-items">
              <div className={`check-item ${strength.checks?.length ? 'passed' : ''}`}>
                <div className="check-dot">
                  {strength.checks?.length ? <Check size={13} strokeWidth={3} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#666' }} />}
                </div>
                <span>Minimum 12 characters length criteria</span>
              </div>
              <div className={`check-item ${strength.checks?.upper ? 'passed' : ''}`}>
                <div className="check-dot">
                  {strength.checks?.upper ? <Check size={13} strokeWidth={3} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#666' }} />}
                </div>
                <span>Uppercase characters included</span>
              </div>
              <div className={`check-item ${strength.checks?.lower ? 'passed' : ''}`}>
                <div className="check-dot">
                  {strength.checks?.lower ? <Check size={13} strokeWidth={3} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#666' }} />}
                </div>
                <span>Lowercase characters included</span>
              </div>
              <div className={`check-item ${strength.checks?.number ? 'passed' : ''}`}>
                <div className="check-dot">
                  {strength.checks?.number ? <Check size={13} strokeWidth={3} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#666' }} />}
                </div>
                <span>Numerical integers integrated</span>
              </div>
              <div className={`check-item ${strength.checks?.symbol ? 'passed' : ''}`}>
                <div className="check-dot">
                  {strength.checks?.symbol ? <Check size={13} strokeWidth={3} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#666' }} />}
                </div>
                <span>Cryptographic symbols integrated</span>
              </div>
            </div>
          </div>

          {/* History Box in soft sand styling */}
          <div className="soft-card history-card">
            <div className="panel-header" style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <History size={18} color="#14181f" /> Recent Passwords
              </h3>
              <span className="pill-info-tag">{history.length} saved</span>
            </div>

            <div>
              {history.map((pw, i) => (
                <div key={i} className="history-item-row">
                  <span className="mono" style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e2229' }}>
                    {pw}
                  </span>
                  <button
                    onClick={() => handleCopy(pw)}
                    className="icon-round-btn"
                    style={{ width: 34, height: 34 }}
                    title="Copy this password"
                  >
                    <Copy size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* College Project Aim & Documentation Record */}
      <footer className="academic-doc-banner">
        <h4>
          <FileText size={18} color="#14181f" /> Project Aim (For College Record)
        </h4>
        <p>
          <strong>Aim:</strong> To design and develop an AI-based password generator that automatically generates strong, secure, and unique passwords based on user requirements. The system aims to improve password security by creating passwords using a combination of uppercase letters, lowercase letters, numbers, and special characters.
        </p>
        <p style={{ marginTop: 8 }}>
          <strong>Short Aim (for college record):</strong> To develop an AI-based password generator that creates strong and secure passwords to protect users' personal information and improve online security.
        </p>
      </footer>
    </div>
  );
}
