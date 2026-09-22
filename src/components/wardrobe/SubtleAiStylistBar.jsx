'use client';
import React from 'react';
import { Sun, Sparkles } from 'lucide-react';
import styles from './SubtleAiStylistBar.module.css';

export default function SubtleAiStylistBar({ suggestedTop, suggestedBottom, onTryOn }) {
  if (!suggestedTop || !suggestedBottom) return null;

  return (
    <div className={styles.subtleAiBar}>
      <div className={styles.subtleAiLeft}>
        <span className={styles.subtleAiBadge}>AI Stylist</span>
        <Sun size={15} className={styles.sunIcon} />
        <span>
          Today&apos;s Match: Pair your <strong>{suggestedTop.name}</strong> with <strong>{suggestedBottom.name}</strong>
        </span>
      </div>
      <div className={styles.subtleAiRight}>
        <button
          className={styles.quickTryOnPill}
          onClick={() => onTryOn(suggestedTop)}
        >
          <Sparkles size={11} />
          <span>Try On</span>
        </button>
      </div>
    </div>
  );
}
