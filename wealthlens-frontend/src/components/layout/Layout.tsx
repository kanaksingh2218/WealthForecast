import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { useSettingsStore } from '../../store/settings.store';
import axios from 'axios';


const NAV = [
  { to: '/', label: 'Dashboard', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" /></svg> },
  { to: '/transactions', label: 'Transactions', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h8M2 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg> },
  { to: '/forecast', label: 'Forecast', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 12L5 8L8 10L11 6L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { to: '/import', label: 'Import', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
];

export const Layout = () => {
  const location = useLocation();
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { currency, setCurrency } = useSettingsStore();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try { await axios.post((import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api') + '/auth/logout', {}, { withCredentials: true }); } catch { }
    clearAuth();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <aside className="wl-mobile-hide" style={{ width: collapsed ? 64 : 220, minHeight: '100vh', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3B82F6, #6366F1)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(59,130,246,0.35)' }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 13L7 9L10 12L14 7L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          {!collapsed && <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>WealthLens</span>}
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ to, label, icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: active ? '#fff' : 'var(--text-secondary)', background: active ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15))' : 'transparent', border: active ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent', textDecoration: 'none', fontSize: 13, fontWeight: active ? 500 : 400, transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                <span style={{ flexShrink: 0, color: active ? 'var(--accent-blue)' : 'inherit' }}>{icon}</span>
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, width: '100%' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }}><path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            {!collapsed && <span>Collapse</span>}
          </button>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, padding: '9px 12px', borderRadius: 10, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, width: '100%' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>


      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: 56, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'rgba(255,255,255,0.01)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <span className="lg:hidden font-bold text-sm bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">WealthLens</span>
            <span className="hidden lg:block text-xs text-gray-500 font-mono">{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: 2, borderRadius: 8, border: '1px solid var(--border)' }}>
              {(['USD', 'INR'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: currency === c ? 'var(--accent-blue)' : 'transparent',
                    color: currency === c ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>Live</span>
            </div>
          </div>
        </header>

        { }
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 p-4 animate-in slide-in-from-left duration-300">
              <div className="flex justify-between items-center mb-8 px-2">
                <span className="font-bold text-lg">WealthLens</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-white">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              <nav className="space-y-2">
                {NAV.map(({ to, label, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${location.pathname === to ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    {icon}
                    <span className="font-medium">{label}</span>
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-4 left-4 right-4 pt-4 border-t border-gray-800">
                <button onClick={handleLogout} className="flex items-center gap-3 p-3 w-full text-gray-400 hover:text-red-400 transition-colors">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="wl-main-content" style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
};