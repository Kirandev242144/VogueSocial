"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import './MerchantNavbar.css';
import {
  Search,
  Bell,
  Globe,
  ExternalLink,
  ChevronDown,
  Settings,
  CreditCard,
  Layout,
  LogOut,
  UserCheck,
  Package,
  RotateCcw,
  DollarSign
} from 'lucide-react';

export default function MerchantNavbar({ title = 'Dashboard' }) {
  const { user, signOut, switchUserRole } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasUnreadNotice, setHasUnreadNotice] = useState(true);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const storeHandle = user?.storeHandle || 'studiolabel';
  const storeName = user?.storeName || 'Studio Label Paris';

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      setShowProfileMenu(false);
    }
  };

  const handleToggleProfile = () => {
    setShowProfileMenu((prev) => !prev);
    if (!showProfileMenu) {
      setShowNotifications(false);
    }
  };

  const handleMarkAllRead = () => {
    setHasUnreadNotice(false);
  };

  const handleSwitchToShopper = () => {
    switchUserRole('user');
    setShowProfileMenu(false);
    navigate('/shop');
  };

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    await signOut();
    navigate('/merchant/login');
  };

  return (
    <header className="merchant-topbar">
      {/* Left: Clean Page Title */}
      <div className="merchant-topbar-left">
        <h1 className="merchant-topbar-title">{title}</h1>
      </div>

      {/* Right Navigation & Tools */}
      <div className="merchant-topbar-right">
        {/* Global Search Bar */}
        <div className="merchant-search-bar">
          <Search size={15} color="var(--d-t4)" />
          <input
            placeholder="Search products, orders, customers..."
            aria-label="Search products and orders"
          />
          <span className="merchant-cmd-badge">⌘K</span>
        </div>

        {/* View Online Store Quick Action */}
        <Link
          to={`/store/${storeHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="merchant-view-store-btn"
          title="Open live boutique storefront in new tab"
        >
          <Globe size={14} />
          <span>View store</span>
          <ExternalLink size={11} className="merchant-view-store-icon" />
        </Link>

        {/* Notifications Bell Dropdown */}
        <div className="merchant-dropdown-anchor" ref={notifRef}>
          <button
            className={`merchant-icon-notice-btn ${showNotifications ? 'merchant-icon-btn-active' : ''}`}
            title="Store Notifications"
            type="button"
            onClick={handleToggleNotifications}
            aria-label="Notifications"
          >
            <Bell size={16} />
            {hasUnreadNotice && <span className="merchant-notice-dot" />}
          </button>

          {showNotifications && (
            <div className="merchant-dropdown-menu merchant-notif-menu">
              <div className="merchant-notif-header">
                <span className="merchant-notif-title">Notifications</span>
                {hasUnreadNotice && (
                  <button
                    type="button"
                    className="merchant-notif-mark-read"
                    onClick={handleMarkAllRead}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="merchant-notif-list">
                <div
                  className="merchant-notif-item"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/merchant/orders');
                  }}
                >
                  <div className="merchant-notif-icon-box merchant-notif-order">
                    <Package size={14} />
                  </div>
                  <div className="merchant-notif-body">
                    <p className="merchant-notif-text">
                      <strong>New order #ORD-1845</strong> received for Tailored Silk Blouse ($95.00)
                    </p>
                    <span className="merchant-notif-time">12m ago</span>
                  </div>
                </div>

                <div
                  className="merchant-notif-item"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/merchant/orders?filter=returns');
                  }}
                >
                  <div className="merchant-notif-icon-box merchant-notif-return">
                    <RotateCcw size={14} />
                  </div>
                  <div className="merchant-notif-body">
                    <p className="merchant-notif-text">
                      <strong>Return RMA-9021</strong> requested by Sara Johnson (Size fit issue)
                    </p>
                    <span className="merchant-notif-time">1h ago</span>
                  </div>
                </div>

                <div
                  className="merchant-notif-item"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/merchant/payouts');
                  }}
                >
                  <div className="merchant-notif-icon-box merchant-notif-payout">
                    <DollarSign size={14} />
                  </div>
                  <div className="merchant-notif-body">
                    <p className="merchant-notif-text">
                      <strong>Weekly payout $4,280.00</strong> scheduled for Stripe bank deposit
                    </p>
                    <span className="merchant-notif-time">5h ago</span>
                  </div>
                </div>
              </div>

              <div className="merchant-notif-footer">
                <button
                  type="button"
                  className="merchant-notif-view-all"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/merchant/orders');
                  }}
                >
                  View All Orders & Shipments →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile & Store Dropdown */}
        <div className="merchant-dropdown-anchor" ref={profileRef}>
          <button
            type="button"
            className="merchant-profile-trigger"
            onClick={handleToggleProfile}
            aria-label="Merchant account menu"
          >
            <img
              src={user?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"}
              alt="Profile"
              className="merchant-topbar-profile-img"
            />
            <span className="merchant-profile-name">{user?.name || 'Tom Jenkins'}</span>
            <ChevronDown size={13} className="merchant-profile-chevron" />
          </button>

          {showProfileMenu && (
            <div className="merchant-dropdown-menu merchant-profile-menu">
              <div className="merchant-profile-header">
                <span className="merchant-menu-store-name">{storeName}</span>
                <span className="merchant-menu-store-email">{user?.email || 'merchant@studiolabel.com'}</span>
                <span className="merchant-menu-plan-badge">PRO MERCHANT</span>
              </div>

              <div className="merchant-profile-items">
                <button
                  type="button"
                  className="merchant-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/merchant/settings');
                  }}
                >
                  <Settings size={14} />
                  <span>Store Settings</span>
                </button>

                <button
                  type="button"
                  className="merchant-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/merchant/payouts');
                  }}
                >
                  <CreditCard size={14} />
                  <span>Payment Gateway & Banking</span>
                </button>

                <button
                  type="button"
                  className="merchant-menu-item"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/merchant/website');
                  }}
                >
                  <Layout size={14} />
                  <span>Custom Domain & Storefront</span>
                </button>

                <div className="merchant-menu-divider" />

                <button
                  type="button"
                  className="merchant-menu-item"
                  onClick={handleSwitchToShopper}
                >
                  <UserCheck size={14} />
                  <span>Switch to Shopper View</span>
                </button>

                <button
                  type="button"
                  className="merchant-menu-item merchant-menu-item-danger"
                  onClick={handleSignOut}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
