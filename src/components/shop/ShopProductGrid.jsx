'use client';
import React, { useState } from 'react';
import styles from './ShopProductGrid.module.css';
import ShopProductToolbar from './ShopProductToolbar';
import ShopProductCard from './ShopProductCard';

export default function ShopProductGrid({
  products = [],
  activeTab,
  onTabChange,
  sortBy,
  onSortChange,
  onTryOn
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  return (
    <div className={styles.gridContainer}>
      {/* 1. Tabs & Controls Toolbar */}
      <ShopProductToolbar
        activeTab={activeTab}
        onTabChange={onTabChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 2. Products Grid */}
      {products.length > 0 ? (
        <div className={viewMode === 'grid' ? styles.cardsGrid : styles.cardsList}>
          {products.map((prod) => (
            <ShopProductCard
              key={prod.id}
              product={prod}
              onTryOn={onTryOn}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No matching outfits found</p>
          <p className={styles.emptyDesc}>Try adjusting your filter categories, size, or price range.</p>
        </div>
      )}
    </div>
  );
}
