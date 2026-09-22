'use client';
import React, { useState } from 'react';
import { X, Check, Shirt, Plus } from 'lucide-react';
import styles from './PackClothesModal.module.css';

export default function PackClothesModal({
  isOpen,
  onClose,
  trip,
  items,
  onSavePackedGarments
}) {
  let initialPacked = [];
  try {
    initialPacked = JSON.parse(trip?.packedGarmentIds || '[]');
  } catch (e) {
    initialPacked = [];
  }

  const [selectedIds, setSelectedIds] = useState(initialPacked);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !trip) return null;

  const handleToggleGarment = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSavePackedGarments(trip, selectedIds);
    setIsSaving(false);
    onClose();
  };

  const filteredItems = items.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const categories = ['all', 'tops', 'bottoms', 'outerwear', 'shoes', 'dresses', 'accessories'];

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalDialog} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Pack Wardrobe for {trip.destination}</h2>
            <p className={styles.modalSubtitle}>
              Selected {selectedIds.length} piece{selectedIds.length === 1 ? '' : 's'} for this trip
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Category Pills */}
        <div className={styles.categoryPillsWrap}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`${styles.categoryPill} ${selectedCategory === cat ? styles.categoryPillActive : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Garment Grid */}
        <div className={styles.garmentGridScroll}>
          {items.length === 0 ? (
            <div className={styles.emptyStateWrap}>
              <Shirt size={32} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>No garments uploaded yet</p>
              <p className={styles.emptySubtitle}>
                Add pieces to your wardrobe from the My Clothes tab to pack them here!
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className={styles.emptyStateWrap}>
              <p className={styles.emptySubtitle}>No items found in {selectedCategory}.</p>
            </div>
          ) : (
            <div className={styles.garmentGrid}>
              {filteredItems.map(item => {
                const isPacked = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`${styles.garmentItemCard} ${isPacked ? styles.garmentItemCardActive : ''}`}
                    onClick={() => handleToggleGarment(item.id)}
                  >
                    <div className={styles.garmentThumbWrap}>
                      <img src={item.imageUrl} alt={item.name} className={styles.garmentImg} />
                      <span className={styles.categoryBadge}>{item.category}</span>
                      {isPacked && (
                        <div className={styles.packedCheckBadge}>
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    <div className={styles.garmentInfo}>
                      <span className={styles.garmentName}>{item.name}</span>
                      <span className={styles.garmentBrand}>{item.brand || 'Wardrobe'}</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.packActionBtn} ${isPacked ? styles.packActionBtnActive : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleGarment(item.id);
                      }}
                    >
                      {isPacked ? (
                        <>
                          <Check size={12} /> Packed
                        </>
                      ) : (
                        <>
                          <Plus size={12} /> Pack
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className={styles.modalFooter}>
          <span className={styles.summaryCount}>
            {selectedIds.length} item{selectedIds.length === 1 ? '' : 's'} packed
          </span>
          <div className={styles.footerBtnGroup}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Packed Pieces'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
