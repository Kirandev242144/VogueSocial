"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Users, AlertTriangle, ShieldAlert,
  Home, LogOut, Cpu, Package, Sun, Moon, ShoppingBag, Webhook
} from 'lucide-react';
import './AdminPanel.css';

const NAV_ITEMS = [
  { section: 'ADMINISTRATION' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Orders & Escrow Vault', icon: ShoppingBag, href: '/admin/orders' },
  { label: 'Product Approvals', icon: Package, href: '/admin/products' },
  { label: 'Vendors', icon: Users, href: '/admin/vendors' },
  { label: 'Disputes & Order Payments', icon: AlertTriangle, href: '/admin/disputes' },
  { label: 'Integrations & Gateways', icon: Webhook, href: '/admin/integrations' },
  { label: 'GPU Computing', icon: Cpu, href: '/admin/runpod' },
  { section: 'STOREFRONT' },
  { label: 'Go to Main Store', icon: Home, href: '/' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('vogue_admin_theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
    }
  }, []);

  const handleToggleTheme = (newTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('vogue_admin_theme', newTheme);
    } catch {}
  };

  return (
    <div className="admin-shell" data-theme={theme}>
      {/* ── Left Fixed Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <Link to="/admin/dashboard" className="admin-brand">
            <div className="admin-brand-icon">
              <ShieldAlert size={18} />
            </div>
            <div>
              <span className="admin-brand-title">VogueSocial</span>
              <span className="admin-brand-badge">ADMIN</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="admin-nav">
          {NAV_ITEMS.map((item, i) => {
            if ('section' in item) {
              return (
                <div key={i} className="admin-nav-section">
                  {item.section}
                </div>
              );
            }
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <button
                key={item.href}
                type="button"
                className={`admin-nav-item ${active ? 'admin-nav-item-active' : ''}`}
                onClick={() => navigate(item.href)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {active && <span className="admin-nav-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Theme Switch & User Row */}
        <div className="admin-sidebar-footer">
          {mounted && (
            <div className="admin-theme-switch">
              <button
                type="button"
                className={`admin-theme-btn ${theme === 'light' ? 'admin-theme-btn-active' : ''}`}
                onClick={() => handleToggleTheme('light')}
              >
                <Sun size={13} /> Light
              </button>
              <button
                type="button"
                className={`admin-theme-btn ${theme === 'dark' ? 'admin-theme-btn-active' : ''}`}
                onClick={() => handleToggleTheme('dark')}
              >
                <Moon size={13} /> Dark
              </button>
            </div>
          )}

          <div className="admin-user-pill">
            <div className="admin-avatar">
              {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">
                {user?.name || user?.email?.split('@')[0] || 'Super Administrator'}
              </div>
              <div className="admin-user-role">Platform Root Admin</div>
            </div>
            {logout && (
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                style={{ padding: 6, borderRadius: '50%' }}
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Sign out to store"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Viewport Content ── */}
      <main className="admin-main">
        {children || <Outlet />}
      </main>
    </div>
  );
}
