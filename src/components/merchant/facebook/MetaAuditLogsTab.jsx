"use client";
import React from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import { RefreshCw, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function MetaAuditLogsTab({ logs = [] }) {
  const renderLogBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className={styles.badgeMetaSynced}>
            <CheckCircle2 size={11} />
            <span>SUCCESS</span>
          </span>
        );
      case 'PARTIAL':
        return (
          <span className={styles.badgeMetaActionRequired}>
            <AlertTriangle size={11} />
            <span>PARTIAL</span>
          </span>
        );
      case 'DISCONNECTED':
        return (
          <span className={styles.badgeMetaReady}>
            <span>DISCONNECTED</span>
          </span>
        );
      case 'FAILED':
      default:
        return (
          <span className={styles.badgeMetaFailed}>
            <AlertCircle size={11} />
            <span>FAILED</span>
          </span>
        );
    }
  };

  return (
    <div className={styles.metaPanel}>
      <div className={styles.metaPanelHeader}>
        <div className={styles.metaPanelTitle}>
          <RefreshCw size={17} />
          <span>Meta Catalog Sync Audit Trail ({logs.length})</span>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.metaTable}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Operation Type</th>
              <th>Items Pushed</th>
              <th>Failed Items</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(!logs || logs.length === 0) ? (
              <tr>
                <td colSpan={5}>
                  <div className={styles.emptyState}>
                    <RefreshCw size={34} className={styles.emptyIcon} />
                    <div className={styles.emptyTitle}>No Sync Logs Recorded</div>
                    <p className={styles.emptyText}>
                      Execute a catalog sync or pull operation to log transaction history and Meta Graph API response codes.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.timestamp}</td>
                  <td>
                    <span className={styles.skuCode}>{l.type}</span>
                  </td>
                  <td>{l.synced_count ?? 0}</td>
                  <td>{l.failed_count ?? 0}</td>
                  <td>{renderLogBadge(l.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
