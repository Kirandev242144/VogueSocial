"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from '@/app/merchant/merchant.module.css';
import { Search, Bell } from 'lucide-react';

export default function MerchantNavbar({ title = 'Dashboard' }) {
  const { session } = useAuth();

  return (
    <div className={styles.topbar}>
      <div>
        <div className={styles.pageTitle}>{title}</div>
      </div>

      <div className={styles.topbarRight}>
        {/* Team Avatars */}
        <div className={styles.avatarStack}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"
            alt="Team member"
            className={styles.stackAvatar}
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80"
            alt="Team member"
            className={styles.stackAvatar}
          />
          <div className={styles.stackMore}>+2</div>
        </div>

        {/* Notifications Bell */}
        <button className={styles.iconNoticeBtn} title="Notifications">
          <Bell size={17} />
          <span className={styles.noticeBadge}>24</span>
        </button>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <Search size={15} color="var(--d-t4)" />
          <input placeholder="Search products, orders..." />
          <span className={styles.cmdBadge}>⌘K</span>
        </div>

        {/* Profile Avatar */}
        <img
          src={session?.user?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"}
          alt="Profile"
          className={styles.topbarProfileImg}
        />
      </div>
    </div>
  );
}
