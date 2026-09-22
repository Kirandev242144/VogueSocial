'use client';
import React from 'react';
import styles from './WardrobeEmptyState.module.css';

export default function WardrobeEmptyState({
  icon: Icon,
  title,
  subtitle,
  actionLabel,
  actionIcon: ActionIcon,
  onAction
}) {
  return (
    <div className={styles.emptyStateContainer}>
      {Icon && (
        <div className={styles.emptyIconCircle}>
          <Icon size={34} />
        </div>
      )}
      <h2 className={styles.emptyStateTitle}>{title}</h2>
      <p className={styles.emptyStateSubtitle}>{subtitle}</p>
      {actionLabel && (
        <button className={styles.emptyCtaButton} onClick={onAction}>
          {ActionIcon && <ActionIcon size={16} />}
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
