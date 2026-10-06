'use client';
import React from 'react';
import { Sparkles, Calendar, Trash2 } from 'lucide-react';
import styles from './OutfitCard.module.css';

export default function OutfitCard({ outfit, items, onTryOn, onSchedule, onDelete }) {
  let parsedIds = [];
  try {
    parsedIds = JSON.parse(outfit.productIds || '[]');
  } catch (e) {
    parsedIds = [];
  }
  const outfitGarments = parsedIds.map(id => items.find(i => i.id === id)).filter(Boolean);

  return (
    <div className={styles.outfitCard}>
      <div className={styles.outfitCollage}>
        {outfitGarments.slice(0, 4).map((g, idx) => (
          <div key={idx} className={styles.outfitCollageImgBox}>
            <img src={g.imageUrl} alt={g.name} className={styles.outfitCollageImg} />
          </div>
        ))}
      </div>

      <div className={styles.outfitDetails}>
        <h3 className={styles.outfitTitle}>{outfit.name}</h3>
        <span className={styles.outfitItemCount}>{outfitGarments.length} Wardrobe Pieces</span>

        <div className={styles.cardActions}>
          <button
            className={styles.tryOnBtn}
            onClick={() => onTryOn(outfitGarments[0])}
            disabled={outfitGarments.length === 0}
          >
            <Sparkles size={12} />
            <span>Try On Look</span>
          </button>
          <button
            className={styles.scheduleBtn}
            onClick={() => onSchedule(outfit)}
            title="Schedule for selected date"
          >
            <Calendar size={12} />
            <span>Schedule</span>
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(outfit)}
            title="Delete outfit"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
