"use client";
import React from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import {
  Facebook, RefreshCw, CheckCircle2, AlertTriangle,
  UploadCloud, DownloadCloud, AlertCircle, Link2
} from 'lucide-react';

export default function FacebookSyncHeader({
  settings = {},
  syncing = false,
  fetchingLive = false,
  onPull,
  onSync,
  onConnect
}) {
  const isConnected = !!settings.connected;
  const lastLog = (settings.logs && settings.logs.length > 0) ? settings.logs[0] : null;
  const hasSyncError = isConnected && lastLog && lastLog.status === 'FAILED';

  // Render authentic status badge
  const renderStatusBadge = () => {
    if (syncing) {
      return (
        <span className={styles.badgeStatusSyncing} title="Sync operation actively processing">
          <RefreshCw size={13} className={styles.spinning} />
          <span>SYNCING WITH META...</span>
        </span>
      );
    }

    if (!isConnected) {
      return (
        <span className={styles.badgeStatusDisconnected} title="Authorization required. Connect your Meta Business Manager.">
          <AlertTriangle size={13} />
          <span>NOT CONNECTED</span>
        </span>
      );
    }

    if (hasSyncError) {
      return (
        <span className={styles.badgeStatusError} title="Last catalog sync encountered an error. Check audit logs.">
          <AlertCircle size={13} />
          <span>ATTENTION REQUIRED</span>
        </span>
      );
    }

    if (settings.last_sync_at) {
      return (
        <span className={styles.badgeStatusConnected} title="Connected to Meta Commerce Manager and actively syncing.">
          <CheckCircle2 size={13} />
          <span>CATALOG CONNECTED &amp; LIVE</span>
        </span>
      );
    }

    return (
      <span className={styles.badgeStatusConnected} title="Meta account authorized. Queued for initial catalog sync.">
        <CheckCircle2 size={13} />
        <span>CONNECTED (READY TO SYNC)</span>
      </span>
    );
  };

  const handlePullClick = () => {
    if (!isConnected) {
      onConnect?.('Connect your Meta account to pull live products from Meta Commerce Manager.');
      return;
    }
    onPull?.();
  };

  const handleSyncClick = () => {
    if (!isConnected) {
      onConnect?.('Connect your Meta account to sync garments with Meta Commerce Catalog.');
      return;
    }
    onSync?.();
  };

  return (
    <div className={styles.metaHeroBox}>
      <div className={styles.metaHeaderLeft}>
        <div className={styles.metaIconCircle}>
          <Facebook size={26} />
        </div>
        <div>
          <div className={styles.metaTitleRow}>
            <h2 className={styles.metaTitle}>Meta Facebook &amp; Instagram Shop Sync</h2>
            {renderStatusBadge()}
          </div>
          <p className={styles.metaSubtitle}>
            Direct integration with Meta Graph API v19.0. Synchronize your high-fashion garments directly into your
            Facebook Commerce Manager Catalog and Instagram Shopping feed with instant pricing and inventory updates.
          </p>
        </div>
      </div>

      <div className={styles.metaHeaderActions}>
        {!isConnected ? (
          <button
            type="button"
            className={styles.btnMetaConnectPrompt}
            onClick={() => onConnect?.()}
          >
            <Link2 size={15} />
            <span>Connect Meta Account</span>
          </button>
        ) : null}

        <button
          type="button"
          className={styles.btnMetaSecondary}
          onClick={handlePullClick}
          disabled={fetchingLive}
          title={!isConnected ? 'Connect Meta Account to pull live catalog' : 'Pull catalog from Meta'}
        >
          <DownloadCloud size={15} />
          <span>{fetchingLive ? 'Pulling from Meta...' : 'Pull from Meta'}</span>
        </button>

        <button
          type="button"
          className={styles.btnMetaPrimary}
          onClick={handleSyncClick}
          disabled={syncing}
          title={!isConnected ? 'Connect Meta Account to sync products' : 'Sync products to Meta Catalog'}
        >
          <UploadCloud size={15} />
          <span>{syncing ? 'Posting to Meta...' : 'Sync to Meta Catalog'}</span>
        </button>
      </div>
    </div>
  );
}
