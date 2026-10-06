'use client';
import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import styles from './AiStylistPanel.module.css';

export default function AiStylistHeader({ isSettingsOpen = false, onToggleSettings }) {
  return (
    <div className={styles.panelHeader}>
      <div className={styles.stylistAvatarGroup}>
        <div className={styles.stylistAvatarWrap}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80"
            alt="AI Stylist"
            className={styles.stylistImg}
          />
          <span className={styles.onlineBadge} />
        </div>
        <div className={styles.stylistTitleCol}>
          <strong className={styles.stylistName}>AI Stylist</strong>
          <span className={styles.stylistRole}>PERSONAL ASSISTANT</span>
        </div>
      </div>

      <button
        type="button"
        className={styles.settingsBtn}
        onClick={onToggleSettings}
        aria-label={isSettingsOpen ? "Close Settings" : "Stylist Settings"}
      >
        {isSettingsOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
      </button>
    </div>
  );
}
