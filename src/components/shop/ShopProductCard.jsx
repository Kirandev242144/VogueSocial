'use client';
import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import styles from './ShopProductCard.module.css';

export default function ShopProductCard({ product, onTryOn }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={product.image} alt={product.name} className={styles.productImg} />

        {/* Hover Quick Try-On Overlay */}
        <div className={styles.overlayHover}>
          <button
            type="button"
            className={styles.quickTryOnBtn}
            onClick={(e) => {
              e.stopPropagation();
              if (onTryOn) onTryOn(product);
            }}
          >
            <Sparkles size={14} />
            <span>Virtual Try-On</span>
          </button>
        </div>
      </div>

      <div className={styles.infoRow}>
        <div className={styles.titlePriceCol}>
          <h3 className={styles.productTitle} title={product.name}>
            {product.shortName || product.name}
          </h3>
          <span className={styles.price}>{product.priceDisplay}</span>
        </div>

        {/* Color Dots */}
        {product.colors && product.colors.length > 0 && (
          <div className={styles.colorDotsRow}>
            {product.colors.map((color, i) => (
              <span
                key={i}
                className={styles.colorDot}
                data-color={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className={styles.ratingRow}>
        <div className={styles.starsGroup}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={12}
              className={styles.starIcon}
              fill="#eab308"
              color="#eab308"
            />
          ))}
        </div>
        <span className={styles.reviewsText}>({product.reviewsCount})</span>
      </div>
    </div>
  );
}
