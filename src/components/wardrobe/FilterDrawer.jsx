'use client';
import React from 'react';
import { Check } from 'lucide-react';
import { COLOR_PALETTE, OCCASIONS, SEASONS } from '@/lib/wardrobeConstants';
import styles from './FilterDrawer.module.css';

export default function FilterDrawer({
  availableBrands,
  filterBrand,
  onSelectBrand,
  filterSeason,
  onSelectSeason,
  filterOccasion,
  onSelectOccasion,
  filterColor,
  onSelectColor,
  onResetFilters
}) {
  return (
    <div className={styles.filterDrawer}>
      <div className={styles.filterDrawerHeader}>
        <span className={styles.filterDrawerTitle}>Filter Wardrobe</span>
        <button className={styles.filterResetBtn} onClick={onResetFilters}>
          Reset All
        </button>
      </div>

      <div className={styles.filterGrid}>
        {/* Brand */}
        <div>
          <div className={styles.filterGroupTitle}>Brand</div>
          <div className={styles.filterOptionsWrap}>
            {availableBrands.map(b => (
              <button
                key={b}
                className={`${styles.filterOptionPill} ${filterBrand === b ? styles.filterOptionPillActive : ''}`}
                onClick={() => onSelectBrand(b)}
              >
                {b === 'all' ? 'All Brands' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion */}
        <div>
          <div className={styles.filterGroupTitle}>Occasion</div>
          <div className={styles.filterOptionsWrap}>
            {['all', ...OCCASIONS].map(occ => (
              <button
                key={occ}
                className={`${styles.filterOptionPill} ${filterOccasion === occ ? styles.filterOptionPillActive : ''}`}
                onClick={() => onSelectOccasion(occ)}
              >
                {occ === 'all' ? 'All Occasions' : occ}
              </button>
            ))}
          </div>
        </div>

        {/* Season */}
        <div>
          <div className={styles.filterGroupTitle}>Season</div>
          <div className={styles.filterOptionsWrap}>
            {['all', ...SEASONS].map(s => (
              <button
                key={s}
                className={`${styles.filterOptionPill} ${filterSeason === s ? styles.filterOptionPillActive : ''}`}
                onClick={() => onSelectSeason(s)}
              >
                {s === 'all' ? 'All Seasons' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <div className={styles.filterGroupTitle}>Color</div>
          <div className={styles.colorSwatchesRow}>
            <button
              className={`${styles.filterOptionPill} ${filterColor === 'all' ? styles.filterOptionPillActive : ''}`}
              onClick={() => onSelectColor('all')}
            >
              All
            </button>
            {COLOR_PALETTE.map(c => {
              const isSelected = filterColor.toLowerCase() === c.name.toLowerCase();
              return (
                <button
                  key={c.name}
                  className={`${styles.colorSwatchBtn} ${styles[c.cssClass]} ${isSelected ? styles.colorSwatchActive : ''}`}
                  onClick={() => onSelectColor(isSelected ? 'all' : c.name)}
                  title={c.name}
                >
                  {isSelected && <Check size={11} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
