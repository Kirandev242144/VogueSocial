'use client';
import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import styles from './WardrobeHeader.module.css';

export default function WardrobeHeader({ itemCount, onOpenStyling, onOpenUpload }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInfo}>
        <h1 className={styles.pageTitle}>
          <span>Wardrobe</span>
          <span className={styles.itemCountBadge}>{itemCount} Items</span>
        </h1>
        <p className={styles.pageSubtitle}>
          Your digital clothing catalog, mix-and-match styling, and look scheduling
        </p>
      </div>
      <div className={styles.headerActions}>
        <button className={styles.secondaryBtn} onClick={onOpenStyling}>
          <Sparkles size={14} />
          <span>Mix & Match</span>
        </button>
        <button className={styles.primaryBtn} onClick={onOpenUpload}>
          <Plus size={16} />
          <span>Upload Clothes</span>
        </button>
      </div>
    </header>
  );
}
