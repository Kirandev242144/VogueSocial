"use client";
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './MerchantSidebar.css';
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
    <aside className="merchant-sidebar">
      <div className="merchant-sidebar-top">
        {/* Logo */}
        <div className="merchant-logo-mark">
          <div className="merchant-logo-left">
            <div className="merchant-logo-icon">
              <Store size={18} color="#ffffff" />
            </div>
            <span className="merchant-logo-text">VogueSocial</span>
          </div>
          <button className="merchant-sidebar-toggle" title="Collapse sidebar" type="button">
            <Sliders size={16} />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="merchant-sidebar-nav">
        {NAV.map((item, i) => {
          if ('section' in item) {
            return <div key={i} className="merchant-nav-section">{item.section}</div>;
          }
          const Icon = item.icon;
          const active = pathname === item.href;
          const hasSub = item.sub && item.sub.length > 0;
          return (
            <div key={item.label}>
              <button
                type="button"
                className={`merchant-nav-item ${active ? 'merchant-nav-item-active' : ''}`}
                onClick={() => {
                  if (hasSub) setOrdersOpen(!ordersOpen);
                  else navigate(item.href);
                }}
              >
                <Icon size={17} />
                <span>{item.label}</span>
                {hasSub ? (
                  ordersOpen ? <ChevronDown size={14} className="merchant-chevron-auto" /> : <ChevronRight size={14} className="merchant-chevron-auto" />
                ) : item.badge ? (
                  <span className="merchant-nav-badge">{item.badge}</span>
                ) : (
                  active && <span className="merchant-nav-dot" />
                )}
              </button>

              {/* Collapsible Submenu */}
              {hasSub && ordersOpen && (
                <div className="merchant-submenu">
                  {item.sub.map((sub) => {
                    const subActive = pathname === sub.href;
                    return (
                      <button
                        key={sub.label}
                        type="button"
                        className={`merchant-sub-item ${subActive ? 'merchant-sub-item-active' : ''}`}
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
      <div className="merchant-sidebar-footer">
        {/* Dark Mode Switch */}
        <div className="merchant-theme-switch-row">
          <span className="merchant-theme-label">
            {isDark ? <Moon size={15} /> : <Sun size={15} />}
            <span>Dark Mode</span>
          </span>
          <button
            type="button"
            className={`merchant-toggle-switch ${isDark ? 'merchant-toggle-active' : ''}`}
            onClick={toggle}
            title="Toggle dark/light mode"
          >
            <div className="merchant-toggle-knob" />
          </button>
        </div>

        {/* Upgrade Promo Card */}
        <div className="merchant-upgrade-card">
          <div className="merchant-upgrade-header">
            <Sparkles size={14} />
            <span>Upgrade to</span>
            <span className="merchant-upgrade-badge">Premium</span>
          </div>
          <div className="merchant-upgrade-text">
            Your Premium Account will expire in <strong>18 days</strong>.
          </div>
          <button className="merchant-upgrade-btn" onClick={() => navigate('/merchant/api-usage')} type="button">
            Upgrade Now
          </button>
        </div>

        {/* User Profile */}
        <div className="merchant-user-row">
          {session?.user?.image ? (
            <img src={session.user.image} alt="" className="merchant-user-avatar" />
          ) : (
            <div className="merchant-user-avatar merchant-user-avatar-fallback">M</div>
          )}
          <div className="merchant-user-meta">
            <div className="merchant-user-name">{session?.user?.name || 'Merchant'}</div>
            <div className="merchant-user-role">Store Owner</div>
          </div>
          <button className="merchant-sign-out-btn" onClick={() => signOut()} title="Sign out" type="button">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
