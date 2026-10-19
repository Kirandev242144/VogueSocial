"use client";
import React from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import { Package, Globe, RefreshCw, Clock } from 'lucide-react';

export default function FacebookSyncStats({
  productsCount = 0,
  fbLiveCount = 0,
  settings = {},
  syncing = false
}) {
  const isConnected = !!settings.connected;

  // Compute Auto-sync status text and class
  let autoSyncLabel = 'Inactive';
  let autoSyncSub = 'Meta authorization required';
  let autoSyncSubClass = styles.metaStatSubInactive;

  if (isConnected) {
    if (syncing) {
      autoSyncLabel = 'Syncing...';
      autoSyncSub = 'Transferring catalog batch';
      autoSyncSubClass = styles.metaStatSubActive;
    } else if (settings.auto_sync) {
      autoSyncLabel = 'Active';
      autoSyncSub = 'Hourly catalog auto-sync';
      autoSyncSubClass = styles.metaStatSubActive;
    } else {
      autoSyncLabel = 'Paused';
      autoSyncSub = 'Manual sync only';
      autoSyncSubClass = styles.metaStatSubInactive;
    }
  }

  // Live items count
  const liveDisplay = isConnected ? (fbLiveCount > 0 ? fbLiveCount : '0 items') : '—';
  const liveSub = isConnected
    ? (settings.catalog_name ? settings.catalog_name.substring(0, 22) + '...' : 'Meta Catalog')
    : 'Not connected';

  // Last synced display
  const lastSyncDisplay = isConnected && settings.last_sync_at ? 'Recent' : 'Never';
  const lastSyncSub = isConnected && settings.last_sync_at
    ? settings.last_sync_at
    : (isConnected ? 'Pending initial sync' : 'No syncs executed');

  return (
    <div className={styles.metaStatsGrid}>
      {/* 1. Store Garments */}
      <div className={styles.metaStatCard}>
        <div className={styles.metaStatLabel}>
          <span>Store Products</span>
          <Package size={14} />
        </div>
        <div className={styles.metaStatValue}>{productsCount}</div>
        <div className={styles.metaStatSub}>Available in Vogue catalog</div>
      </div>

      {/* 2. Live in Meta Catalog */}
      <div className={styles.metaStatCard}>
        <div className={styles.metaStatLabel}>
          <span>Live in Meta Catalog</span>
          <Globe size={14} />
        </div>
        <div className={styles.metaStatValue}>{liveDisplay}</div>
        <div className={styles.metaStatSub}>{liveSub}</div>
      </div>

      {/* 3. Auto-Sync Status */}
      <div className={styles.metaStatCard}>
        <div className={styles.metaStatLabel}>
          <span>Auto-Sync Status</span>
          <RefreshCw size={14} />
        </div>
        <div className={styles.metaStatValue}>{autoSyncLabel}</div>
        <div className={`${styles.metaStatSub} ${autoSyncSubClass}`}>{autoSyncSub}</div>
      </div>

      {/* 4. Last Synced */}
      <div className={styles.metaStatCard}>
        <div className={styles.metaStatLabel}>
          <span>Last Synced</span>
          <Clock size={14} />
        </div>
        <div className={styles.metaStatValue}>{lastSyncDisplay}</div>
        <div className={styles.metaStatSub}>{lastSyncSub}</div>
      </div>
    </div>
  );
}
