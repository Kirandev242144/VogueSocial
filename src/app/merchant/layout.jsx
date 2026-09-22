"use client";
import React, { useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './merchant.module.css';
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
      navigate('/onboarding/merchant');
    }
  }, [status, navigate]);

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCenter}>
          <div className={styles.loadingIconWrap}>
            <Store size={22} color="#cbf382" />
          </div>
          <p className={styles.loadingText}>Loading VogueSocial portal...</p>
        </div>
      </div>
    );
  }

  // ACCESS GUARD: End users / Shoppers cannot access the Merchant portal
  if (status === 'authenticated' && !isMerchant && !isAdmin) {
    return (
      <div className={styles.restrictedContainer}>
        <div className={styles.restrictedCard}>
          <div className={styles.restrictedIconWrap}>
            <ShieldAlert size={32} color="#ef4444" />
          </div>

          <div className={styles.restrictedBadge}>
            Access Restricted · Shoppers Only
          </div>

          <h2 className={styles.restrictedTitle}>Merchant Portal Restricted</h2>

          <p className={styles.restrictedSubtitle}>
            You are currently signed in as a Shopper (
            <span className={styles.restrictedUserEmail}>{user?.email || 'shopper account'}</span>
            ). The Merchant Dashboard, catalog inventory, and payouts are exclusively reserved for verified brand boutiques and designers.
          </p>

          <div className={styles.restrictedActions}>
            <button
              type="button"
              className={styles.btnRestrictedPrimary}
              onClick={() => navigate('/shop')}
            >
              <ShoppingBag size={16} />
              <span>Return to Shop Catalog</span>
            </button>

            <button
              type="button"
              className={styles.btnRestrictedSecondary}
              onClick={() => navigate('/')}
            >
              <Home size={16} />
              <span>Explore Home Feed</span>
            </button>

            <button
              type="button"
              className={styles.btnRestrictedSecondary}
              onClick={() => navigate('/onboarding/merchant')}
            >
              <Store size={16} />
              <span>Apply to Become a Brand Seller</span>
            </button>
          </div>

          <div className={styles.restrictedSwitchRoleRow}>
            <span>Testing roles?</span>
            <button
              type="button"
              className={styles.btnSwitchRoleMini}
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
    <div className={`${styles.shell} ${isDark ? styles.shellDark : ''}`}>
      {/* Left Sidebar */}
      <MerchantSidebar />

      {/* Main Container */}
      <main className={styles.main}>
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

