'use client';
import React from 'react';
import { Shirt, Plus, Sparkles, Trash2 } from 'lucide-react';
import { COLOR_PALETTE } from '@/lib/wardrobeConstants';
import styles from './GarmentCard.module.css';

export default function GarmentCard({ item, onWear, onTryOn, onDelete }) {
  const getColorClass = (colName) => {
    const match = COLOR_PALETTE.find(c => c.name.toLowerCase() === colName.trim().toLowerCase());
    return match ? styles[match.cssClass] : styles.paletteWhite;
  };

  return (
    <div className={styles.itemCard}>
      <div className={styles.imageWrapper}>
        <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
        <span className={styles.categoryBadge}>{item.category}</span>
        <div className={styles.wearBadge} title="Times worn">
          <Shirt size={9} />
          <span>{item.wearCount || 0}x</span>
        </div>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.itemName} title={item.name}>{item.name}</h3>
        <div className={styles.cardMetaRow}>
          <span className={styles.itemBrand}>{item.brand || 'Custom'}</span>
          <div className={styles.colorDots}>
            {(item.colors ? item.colors.split(',') : ['White']).slice(0, 3).map((colName, idx) => (
              <div
                key={idx}
                className={`${styles.colorDot} ${getColorClass(colName)}`}
                title={colName}
              />
            ))}
          </div>
        </div>

        <div className={styles.cardActions}>
          <button
            className={styles.wearBtn}
            onClick={(e) => onWear(item.id, e)}
            title="Log item as worn today"
          >
            <Plus size={11} />
            <span>Wear</span>
          </button>
          <button
            className={styles.tryOnBtn}
            onClick={() => onTryOn(item)}
            title="Virtual Try-On"
          >
            <Sparkles size={11} />
            <span>Try On</span>
          </button>
          <button
            className={styles.deleteBtn}
            onClick={(e) => onDelete(item.id, item.name, e)}
            title="Delete garment"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
