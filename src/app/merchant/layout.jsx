"use client";
import React, { useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './MerchantLayout.css';
import { Store, ShieldAlert, ShoppingBag, Home, Sparkles } from 'lucide-react';
import { MerchantThemeProvider, useMerchantTheme } from './ThemeContext';
import MerchantSidebar from '@/components/merchant/MerchantSidebar';
import MerchantNavbar from '@/components/merchant/MerchantNavbar';

function MerchantShell({ children }) {
  const { status, user, isMerchant, isAdmin, switchUserRole } = useAuth();
  const navigate = useNavigate();
  const { theme } = useMerchantTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (status === 'unauthenticated') {
      navigate('/merchant/login');
    }
  }, [status, navigate]);

  if (status === 'loading') {
    return (
      <div className="merchant-loading-container">
        <div className="merchant-loading-center">
          <div className="merchant-loading-icon-wrap">
            <Store size={22} color="#cbf382" />
          </div>
          <p className="merchant-loading-text">Loading VogueSocial portal...</p>
        </div>
      </div>
    );
  }

  // ACCESS GUARD: End users / Shoppers cannot access the Merchant portal
  if (status === 'authenticated' && !isMerchant && !isAdmin) {
    return (
      <div className="merchant-restricted-container">
        <div className="merchant-restricted-card">
          <div className="merchant-restricted-icon-wrap">
            <ShieldAlert size={32} color="#ef4444" />
          </div>

          <div className="merchant-restricted-badge">
            Access Restricted · Shoppers Only
          </div>

          <h2 className="merchant-restricted-title">Merchant Portal Restricted</h2>

          <p className="merchant-restricted-subtitle">
            You are currently signed in as a Shopper (
            <span className="merchant-restricted-user-email">{user?.email || 'shopper account'}</span>
            ). The Merchant Dashboard, catalog inventory, and payouts are exclusively reserved for verified brand boutiques and designers.
          </p>

          <div className="merchant-restricted-actions">
            <button
              type="button"
              className="btn-restricted-primary"
              onClick={() => navigate('/shop')}
            >
              <ShoppingBag size={16} />
              <span>Return to Shop Catalog</span>
            </button>

            <button
              type="button"
              className="btn-restricted-secondary"
              onClick={() => navigate('/')}
            >
              <Home size={16} />
              <span>Explore Home Feed</span>
            </button>

            <button
              type="button"
              className="btn-restricted-secondary"
              onClick={() => navigate('/merchant/login')}
            >
              <Store size={16} />
              <span>Merchant Sign In & Brand Registration</span>
            </button>
          </div>

          <div className="merchant-restricted-switch-role-row">
            <span>Testing roles?</span>
            <button
              type="button"
              className="btn-switch-role-mini"
              onClick={() => {
                switchUserRole('merchant');
                navigate('/merchant/dashboard');
              }}
            >
              Switch to Demo Merchant (Tom Jenkins) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`merchant-shell ${isDark ? 'merchant-shell-dark' : ''}`}>
      {/* Left Sidebar */}
      <MerchantSidebar />

      {/* Main Container */}
      <main className="merchant-main">
        {/* Topbar Header */}
        <MerchantNavbar />

        {/* Content */}
        {children || <Outlet />}
      </main>
    </div>
  );
}

export default function MerchantLayout({ children }) {
  return (
    <MerchantThemeProvider>
      <MerchantShell>{children}</MerchantShell>
    </MerchantThemeProvider>
  );
}

