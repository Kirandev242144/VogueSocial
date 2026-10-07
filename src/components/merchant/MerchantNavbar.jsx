"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import './MerchantNavbar.css';
import { Search, Bell } from 'lucide-react';

export default function MerchantNavbar({ title = 'Dashboard' }) {
  const { session } = useAuth();

  return (
    <header className="merchant-topbar">
      <div>
        <h1 className="merchant-topbar-title">{title}</h1>
      </div>

      <div className="merchant-topbar-right">
        {/* Team Avatars */}
        <div className="merchant-avatar-stack">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"
            alt="Team member"
            className="merchant-stack-avatar"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"
            alt="Team member"
            className="merchant-stack-avatar"
          />
          <div className="merchant-stack-more">+2</div>
        </div>

        {/* Notifications Bell */}
        <button className="merchant-icon-notice-btn" title="Notifications" type="button">
          <Bell size={17} />
          <span className="merchant-notice-badge">24</span>
        </button>

        {/* Search Bar */}
        <div className="merchant-search-bar">
          <Search size={15} color="var(--d-t4)" />
          <input placeholder="Search products, orders..." aria-label="Search products and orders" />
          <span className="merchant-cmd-badge">⌘K</span>
        </div>

        {/* Profile Avatar */}
        <img
          src={session?.user?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"}
          alt="Profile"
          className="merchant-topbar-profile-img"
        />
      </div>
    </header>
  );
}
