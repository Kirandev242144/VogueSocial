'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';
import styles from './AiStylistPanel.module.css';

export default function AiGeneratingCard({ product }) {
  return (
    <div className={styles.tryOnLoadingCard}>
      <div className={styles.loadingSpinnerRing}>
        <Sparkles size={22} className={styles.spinningSparkle} />
      </div>
      <strong className={styles.loadingTitle}>
        Generating Virtual Fit...
      </strong>
      <p className={styles.loadingSubtitle}>
        Fitting {product?.name || 'outfit'} to your silhouette in Studio lighting...
      </p>
      <div className={styles.loadingProgressBar}>
        <div className={styles.loadingProgressShimmer} />
      </div>
    </div>
  );
}
