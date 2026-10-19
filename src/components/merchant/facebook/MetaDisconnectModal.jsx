"use client";
import React from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import { AlertTriangle, X, LogOut } from 'lucide-react';

export default function MetaDisconnectModal({
  isOpen,
  onClose,
  onConfirmDisconnect,
  catalogName
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.metaModalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderBrand}>
            <div className={styles.metaIconCircle}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className={styles.modalTitle}>Disconnect Meta Account</h3>
              <p className={styles.modalSubtitle}>Revoke Commerce Manager Session</p>
            </div>
          </div>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.issueDetailBox}>
            <div className={styles.issueDetailTitle}>
              <AlertTriangle size={16} />
              <span>Are you sure you want to disconnect?</span>
            </div>
            <p className={styles.issueDetailText}>
              Disconnecting will sever the link between your Vogue store and <strong>{catalogName || 'Meta Catalog'}</strong>:
            </p>
            <ul className={styles.guidelineList}>
              <li>Hourly automatic catalog synchronization will be immediately <strong>Deactivated</strong>.</li>
              <li>New product creations and price changes will no longer update Instagram Shopping tags.</li>
              <li>Existing products already in Meta Commerce Manager will remain live until manually removed.</li>
              <li>Your OAuth system access token will be securely revoked.</li>
            </ul>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnMetaSecondary}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnMetaDanger}
            onClick={onConfirmDisconnect}
          >
            <LogOut size={14} />
            <span>Confirm Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  );
}
