'use client';
import React from 'react';
import { Shirt, Plus, Filter, X } from 'lucide-react';
import { WARDROBE_CATEGORIES } from '@/lib/wardrobeConstants';
import GarmentCard from './GarmentCard';
import FilterDrawer from './FilterDrawer';
import WardrobeEmptyState from './WardrobeEmptyState';
import styles from './ClothesTab.module.css';

export default function ClothesTab({
  items,
  totalItemsCount,
  filteredGarments,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  isFilterDrawerOpen,
  onToggleFilterDrawer,
  filterBrand,
  onSelectBrand,
  filterSeason,
  onSelectSeason,
  filterOccasion,
  onSelectOccasion,
  filterColor,
  onSelectColor,
  onResetFilters,
  availableBrands,
  onOpenUpload,
  onWearItem,
  onTryOnItem,
  onDeleteItem
}) {
  if (totalItemsCount === 0) {
    return (
      <WardrobeEmptyState
        icon={Shirt}
        title="Your Wardrobe is Empty"
        subtitle="Your digital wardrobe has no items yet. Upload photos of your personal garments to build your personal capsule collection and try them on with AI."
        actionLabel="Upload First Garment"
        actionIcon={Plus}
        onAction={onOpenUpload}
      />
    );
  }

  return (
    <>
      <div className={styles.filterSection}>
        <div className={styles.filterTopBar}>
          <div className={styles.categoryChips}>
            {WARDROBE_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.categoryChip} ${selectedCategory === cat ? styles.categoryChipActive : ''}`}
                onClick={() => onSelectCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.filterControls}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search wardrobe..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <X size={13} className={styles.clearSearchIcon} onClick={() => onSearchChange('')} />
              )}
            </div>

            <select
              value={sortBy}
              onChange={e => onSortChange(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="newest">Newest Added</option>
              <option value="most_worn">Most Worn</option>
              <option value="least_worn">Least Worn</option>
            </select>

            <button
              className={styles.filterToggleBtn}
              onClick={onToggleFilterDrawer}
            >
              <Filter size={13} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {isFilterDrawerOpen && (
          <FilterDrawer
            availableBrands={availableBrands}
            filterBrand={filterBrand}
            onSelectBrand={onSelectBrand}
            filterSeason={filterSeason}
            onSelectSeason={onSelectSeason}
            filterOccasion={filterOccasion}
            onSelectOccasion={onSelectOccasion}
            filterColor={filterColor}
            onSelectColor={onSelectColor}
            onResetFilters={onResetFilters}
          />
        )}
      </div>

      <div className={styles.clothesGrid}>
        {/* Upload Card CTA */}
        <div className={styles.uploadCard} onClick={onOpenUpload}>
          <div className={styles.uploadCardIcon}>
            <Plus size={22} />
          </div>
          <span className={styles.uploadCardTitle}>Upload Clothes</span>
          <span className={styles.uploadCardSubtitle}>Add photo & details to wardrobe</span>
        </div>

        {/* Garment Cards */}
        {filteredGarments.map(item => (
          <GarmentCard
            key={item.id}
            item={item}
            onWear={onWearItem}
            onTryOn={onTryOnItem}
            onDelete={onDeleteItem}
          />
        ))}
      </div>
    </>
  );
}
