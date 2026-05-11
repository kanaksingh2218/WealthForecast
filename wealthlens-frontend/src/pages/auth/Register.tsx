import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import axios from 'axios';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  useEffect(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#10B981', '#3B82F6'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/auth/register`,
        { email, password, displayName: name },
        { withCredentials: true }
      );
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .wr-root { min-height: 100vh; background: #080B14; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; padding: 2rem 1rem; }
        .wr-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        .wr-orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); top: -150px; right: -100px; animation: orbf 9s ease-in-out infinite; }
        .wr-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%); bottom: -100px; left: -80px; animation: orbf 7s ease-in-out infinite reverse; }
        @keyframes orbf { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-25px) scale(1.04); } }
        .wr-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 60px 60px; pointer-events: none; }
        .wr-layout { position: relative; display: grid; grid-template-columns: 1fr 1fr; max-width: 900px; width: 100%; border-radius: 28px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 32px 80px rgba(0,0,0,0.7); opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .wr-layout.mounted { opacity: 1; transform: translateY(0); }
        @media (max-width: 680px) { .wr-layout { grid-template-columns: 1fr; } .wr-left { display: none; } }
        .wr-left { background: linear-gradient(160deg, #0F1629 0%, #0A0F1E 100%); padding: 48px 40px; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
        .wr-left::before { content: ''; position: absolute; top: 0; right: 0; width: 1px; height: 100%; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent); }
        .wr-right { background: rgba(255,255,255,0.025); padding: 48px 40px; backdrop-filter: blur(20px); }
        .wr-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
        .wr-logo-icon { width: 34px; height: 34px; background: linear-gradient(135deg, #3B82F6, #6366F1); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(59,130,246,0.4); }
        .wr-logo-text { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #fff; }
        .wr-heading { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 6px; letter-spacing: -0.3px; line-height: 1.2; }
        .wr-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 28px; font-weight: 300; }
        .wr-error { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: #FCA5A5; padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .wr-field { margin-bottom: 16px; }
        .wr-label { display: block; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.4); margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.8px; }
        .wr-input-wrap { position: relative; }
        .wr-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 14px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s ease; }
        .wr-input::placeholder { color: rgba(255,255,255,0.18); }
        .wr-input:focus { border-color: rgba(59,130,246,0.5); background: rgba(59,130,246,0.04); box-shadow: 0 0 0 3px rgba(59,130,246,0.08); }
        .wr-input-pr { padding-right: 44px; }
        .wr-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255,255,255,0.25); cursor: pointer; padding: 4px; display: flex; align-items: center; transition: color 0.2s; }
        .wr-eye:hover { color: rgba(255,255,255,0.5); }
        .wr-strength { display: flex; gap: 4px; margin-top: 8px; align-items: center; }
        .wr-sbar { flex: 1; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.08); transition: background 0.3s ease; }
        .wr-slabel { font-size: 11px; margin-left: 6px; font-weight: 500; min-width: 36px; transition: color 0.3s; }
        .wr-btn { width: 100%; background: linear-gradient(135deg, #3B82F6, #6366F1); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; padding: 13px; border: none; border-radius: 10px; cursor: pointer; margin-top: 4px; position: relative; overflow: hidden; transition: all 0.2s ease; box-shadow: 0 4px 20px rgba(59,130,246,0.3); }
        .wr-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(59,130,246,0.45); }
        .wr-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .wr-shimmer { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); animation: shim 2s infinite; }
        @keyframes shim { 0% { left: -100%; } 100% { left: 100%; } }
        .wr-footer { text-align: center; font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 20px; }
        .wr-link { color: #60A5FA; text-decoration: none; font-weight: 500; }
        .wr-link:hover { color: #93C5FD; }
        .wr-spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 7px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .wr-feat { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
        .wr-feat-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .wr-feat strong { display: block; color: #fff; font-size: 13px; font-weight: 500; margin-bottom: 2px; }
        .wr-feat span { color: rgba(255,255,255,0.35); font-size: 12px; line-height: 1.4; font-weight: 300; }
      `}</style>

      <div className="wr-root">
        <div className="wr-grid" />
        <div className="wr-orb wr-orb-1" />
        <div className="wr-orb wr-orb-2" />

        <div className={`wr-layout ${mounted ? 'mounted' : ''}`}>
          <div className="wr-left">
            <div>
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>Your wealth,<br/>clearly seen.</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 300, lineHeight: 1.6 }}>Import transactions, forecast your future, and make every rupee count.</div>
              </div>
              <svg viewBox="0 0 260 80" fill="none" style={{ width: '100%', marginBottom: 32 }}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0 60 L30 55 L60 45 L90 50 L120 35 L150 30 L180 20 L210 15 L240 8 L260 5" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none"/>
                <path d="M0 60 L30 55 L60 45 L90 50 L120 35 L150 30 L180 20 L210 15 L240 8 L260 5 L260 80 L0 80Z" fill="url(#cg)"/>
                <circle cx="260" cy="5" r="4" fill="#3B82F6"/>
                <circle cx="260" cy="5" r="8" fill="#3B82F6" fillOpacity="0.2"/>
              </svg>
              <div className="wr-feat">
                <div className="wr-feat-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div><strong>Smart Import</strong><span>CSV, OFX & QIF from any bank</span></div>
              </div>
              <div className="wr-feat">
                <div className="wr-feat-icon" style={{ background: 'rgba(99,102,241,0.12)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 10l4-8 4 8" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div><strong>10-Year Forecast</strong><span>Compound interest projections</span></div>
              </div>
              <div className="wr-feat">
                <div className="wr-feat-icon" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="#10B981" strokeWidth="1.6"/><path d="M7 4v3l2 2" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </div>
                <div><strong>Auto-Categorize</strong><span>ML-assisted merchant tagging</span></div>
              </div>
            </div>
          </div>

          <div className="wr-right">
            <div className="wr-logo">
              <div className="wr-logo-icon">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 13L7 9L10 12L14 7L17 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className="wr-logo-text">WealthLens</span>
            </div>

            <h1 className="wr-heading">Create account.</h1>
            <p className="wr-sub">Start your financial clarity journey today.</p>

            {error && <div className="wr-error"><svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#FCA5A5" strokeWidth="1.5"/><path d="M7 4v3M7 9.5v.5" stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round"/></svg>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="wr-field">
                <label className="wr-label">Full Name</label>
                <input type="text" className="wr-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="wr-field">
                <label className="wr-label">Email Address</label>
                <input type="email" required className="wr-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="wr-field">
                <label className="wr-label">Password</label>
                <div className="wr-input-wrap">
                  <input type={showPassword ? 'text' : 'password'} required minLength={8} className="wr-input wr-input-pr" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button" className="wr-eye" onClick={() => setShowPassword(!showPassword)}>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M2 8s2.5-5 6-5 6 5 6 5-2.5 5-6 5-6-5-6-5z" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="wr-strength">
                    {[1,2,3,4].map(i => <div key={i} className="wr-sbar" style={{ background: i <= strength ? strengthColor[strength] : undefined }} />)}
                    <span className="wr-slabel" style={{ color: strengthColor[strength] }}>{strengthLabel[strength]}</span>
                  </div>
                )}
              </div>
              <button type="submit" className="wr-btn" disabled={isLoading}>
                <div className="wr-shimmer" />
                {isLoading ? <><span className="wr-spinner" />Creating account...</> : 'Create Account'}
              </button>
            </form>

            <div className="wr-footer">Already have an account? <Link to="/login" className="wr-link">Sign in →</Link></div>
          </div>
        </div>
      </div>
    </>
  );
};
