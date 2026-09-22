"use client";
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/merchant/merchant.module.css';
import {
  LayoutDashboard, ShoppingBag, Package, BarChart2,
  Settings, Store, LogOut, Sun, Moon, ChevronDown,
  ChevronRight, Sparkles, Users, RefreshCw, CreditCard,
  Layers, Sliders, Globe, Facebook
} from 'lucide-react';
import { useMerchantTheme } from '@/app/merchant/ThemeContext';

const NAV = [
  { section: 'MAIN' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/merchant/dashboard' },
  { label: 'My Website', icon: Globe, href: '/merchant/website', badge: 'NEW' },
  { label: 'Products', icon: Package, href: '/merchant/products' },
  {
    label: 'Orders', icon: ShoppingBag, href: '/merchant/orders',
    sub: [
      { label: 'All Orders', href: '/merchant/orders' },
      { label: 'Returns', href: '/merchant/orders?filter=returns' },
      { label: 'Order Tracking', href: '/merchant/orders?filter=tracking' }
    ]
  },
  { label: 'Sales', icon: BarChart2, href: '/merchant/analytics' },
  { label: 'Customers', icon: Users, href: '/merchant/analytics' },
  { label: 'Reports', icon: Layers, href: '/merchant/analytics' },
  { section: 'SETTINGS' },
  { label: 'Facebook Shop Sync', icon: Facebook, href: '/merchant/products?tab=facebook', badge: 'LIVE' },
  { label: 'Payment Gateways', icon: CreditCard, href: '/merchant/payouts' },
  { label: 'Try-On Credits & Usage', icon: Sparkles, href: '/merchant/api-usage', badge: 'NEW' },
  { label: 'Settings', icon: Settings, href: '/merchant/settings' },
];

export default function MerchantSidebar() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { theme, toggle } = useMerchantTheme();
  const isDark = theme === 'dark';
  const [ordersOpen, setOrdersOpen] = useState(true);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        {/* Logo */}
        <div className={styles.logoMark}>
          <div className={styles.logoLeft}>
            <div className={styles.logoIcon}>
              <Store size={18} color="#ffffff" />
            </div>
            <span className={styles.logoText}>VogueSocial</span>
          </div>
          <button className={styles.sidebarToggle} title="Collapse sidebar">
            <Sliders size={16} />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className={styles.workspaceSelect}>
          <div className={styles.wsInner}>
            <div className={styles.wsIcon}>V</div>
            <span className={styles.wsTitle}>Vogue Merchant</span>
          </div>
          <ChevronDown size={14} color="var(--d-t4)" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={styles.sidebarNav}>
        {NAV.map((item, i) => {
          if ('section' in item) {
            return <div key={i} className={styles.navSection}>{item.section}</div>;
          }
          const Icon = item.icon;
          const active = pathname === item.href;
          const hasSub = item.sub && item.sub.length > 0;
          return (
            <div key={item.label}>
              <button
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                onClick={() => {
                  if (hasSub) setOrdersOpen(!ordersOpen);
                  else navigate(item.href);
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {hasSub ? (
                  ordersOpen ? <ChevronDown size={14} className={styles.chevronAuto} /> : <ChevronRight size={14} className={styles.chevronAuto} />
                ) : item.badge ? (
                  <span className={styles.navBadge}>{item.badge}</span>
                ) : (
                  active && <span className={styles.navDot} />
                )}
              </button>

              {/* Collapsible Submenu */}
              {hasSub && ordersOpen && (
                <div className={styles.submenu}>
                  {item.sub.map((sub) => {
                    const subActive = pathname === sub.href;
                    return (
                      <button
                        key={sub.label}
                        className={`${styles.subItem} ${subActive ? styles.subItemActive : ''}`}
                        onClick={() => navigate(sub.href)}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        {/* Dark Mode Switch */}
        <div className={styles.themeSwitchRow}>
          <span className={styles.themeLabel}>
            {isDark ? <Moon size={15} /> : <Sun size={15} />}
            <span>Dark Mode</span>
          </span>
          <button
            className={`${styles.toggleSwitch} ${isDark ? styles.toggleActive : ''}`}
            onClick={toggle}
            title="Toggle dark/light mode"
          >
            <div className={styles.toggleKnob} />
          </button>
        </div>

        {/* Upgrade Promo Card */}
        <div className={styles.upgradeCard}>
          <div className={styles.upgradeHeader}>
            <Sparkles size={14} />
            <span>Upgrade to</span>
            <span className={styles.upgradeBadge}>Premium</span>
          </div>
          <div className={styles.upgradeText}>
            Your Premium Account will expire in <strong>18 days</strong>.
          </div>
          <button className={styles.upgradeBtn} onClick={() => navigate('/merchant/api-usage')}>
            Upgrade Now
          </button>
        </div>

        {/* User Profile */}
        <div className={styles.userRow}>
          {session?.user?.image ? (
            <img src={session.user.image} alt="" className={styles.userAvatar} />
          ) : (
            <div className={`${styles.userAvatar} ${styles.userAvatarFallback}`}>M</div>
          )}
          <div className={styles.userMeta}>
            <div className={styles.userName}>{session?.user?.name || 'Merchant'}</div>
            <div className={styles.userRole}>Store Owner</div>
          </div>
          <button className={styles.signOutBtn} onClick={() => signOut()} title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
