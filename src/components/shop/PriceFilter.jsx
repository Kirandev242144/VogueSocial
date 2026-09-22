'use client';
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './ShopSidebar.module.css';

export default function PriceFilter({
  priceRange = 500,
  onChangePriceRange,
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
        <span className={styles.accordionTitle}>Price Range</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className={styles.priceContainer}>
          <div className={styles.priceValueDisplay}>
            <span className={styles.priceCurrentVal}>Max: ${priceRange}</span>
          </div>
          <div className={styles.sliderWrap}>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => onChangePriceRange(Number(e.target.value))}
              className={styles.priceSlider}
            />
          </div>
          <div className={styles.priceMinMaxRow}>
            <span className={styles.priceLimit}>$0</span>
            <span className={styles.priceLimit}>$500+</span>
          </div>
        </div>
      )}
    </div>
  );
}
