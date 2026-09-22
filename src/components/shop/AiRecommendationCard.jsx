'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';
import styles from './AiStylistPanel.module.css';

export default function AiRecommendationCard({ rec, onInitiateTryOn, onAddToCart }) {
  return (
    <div className={styles.recCard}>
      <h4 className={styles.recTitle}>{rec.title}</h4>

      <div className={styles.recProductRow}>
        <img src={rec.image} alt={rec.title} className={styles.recThumb} />
        <div className={styles.recDetails}>
          <span className={styles.recPrice}>{rec.price}</span>
          <span className={styles.recSizeNote}>{rec.sizeNote}</span>
        </div>
      </div>

      {/* Action Buttons: Try On & Add to Cart */}
      <div className={styles.recActions}>
        <button
          type="button"
          className={styles.tryOnBtn}
          onClick={() => {
            onInitiateTryOn({
              id: rec.id,
              name: rec.title,
              image: rec.image,
              priceDisplay: rec.price,
              category: rec.category || 'dresses'
            });
          }}
        >
          <Sparkles size={14} />
          <span>Try On</span>
        </button>

        <button
          type="button"
          className={styles.addToCartBtn}
          onClick={() => {
            if (onAddToCart) onAddToCart(rec);
            else alert("✓ Added " + rec.title + " to your cart!");
          }}
        >
          Add to Cart
        </button>
      </div>

      {/* Why it works bullet points */}
      {rec.whyItWorks && (
        <div className={styles.whyItWorksBox}>
          <span className={styles.whyHeading}>Why it works :</span>
          <ul className={styles.whyList}>
            {rec.whyItWorks.map((point, pIdx) => (
              <li key={pIdx} className={styles.whyItem}>
                • {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
