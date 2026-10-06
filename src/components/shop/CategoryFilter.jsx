'use client';
import React from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import styles from './ShopSidebar.module.css';

export default function CategoryFilter({
  categories = [],
  selectedCategories = [],
  onToggleCategory,
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
        <span className={styles.accordionTitle}>Category</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className={styles.categoryList}>
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat.id);
            return (
              <label key={cat.id} className={styles.categoryRow}>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleCategory(cat.id)}
                    className={styles.hiddenCheckbox}
                  />
                  <div className={`${styles.customCheckbox} ${isChecked ? styles.checkboxChecked : ''}`}>
                    {isChecked && <Check size={12} className={styles.checkIcon} />}
                  </div>
                  <span className={styles.categoryLabel}>{cat.label}</span>
                </div>
                <span className={styles.categoryCount}>{cat.count}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
