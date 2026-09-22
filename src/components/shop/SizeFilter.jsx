'use client';
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './ShopSidebar.module.css';

export default function SizeFilter({
  sizes = [],
  selectedSizes = [],
  onToggleSize,
  isOpen,
  onToggleOpen
}) {
  return (
    <div className={styles.filterSection}>
      <button
        type="button"
        className={styles.accordionHeader}
        onClick={onToggleOpen}
      >
        <span className={styles.accordionTitle}>Size</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className={styles.sizesRow}>
          {sizes.map((sz) => {
            const isSelected = selectedSizes.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                className={`${styles.sizeBtn} ${isSelected ? styles.sizeBtnActive : ''}`}
                onClick={() => onToggleSize(sz)}
              >
                {sz}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
