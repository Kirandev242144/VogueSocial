'use client';
import React from 'react';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import styles from './ShopProductGrid.module.css';

export default function ShopProductToolbar({
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}) {
  const tabs = [
    { id: 'suggested', label: 'SUGGESTED FOR YOU' },
    { id: 'trending', label: 'TRENDING' },
    { id: 'new_arrivals', label: 'NEW ARRIVALS' }
  ];

  return (
    <div className={styles.toolbarRow}>
      {/* Subtabs */}
      <div className={styles.subtabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && <span className={styles.tabActiveBar} />}
          </button>
        ))}
      </div>

      {/* View Controls & Sort Dropdown */}
      <div className={styles.viewControls}>
        <div className={styles.sortDropdownWrap}>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="featured">FEATURED</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <ChevronDown size={14} className={styles.sortArrow} />
        </div>

        <div className={styles.viewModeToggle}>
          <button
            type="button"
            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid View"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
            onClick={() => onViewModeChange('list')}
            aria-label="List View"
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
