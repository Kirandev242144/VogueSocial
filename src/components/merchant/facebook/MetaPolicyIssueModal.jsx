"use client";
import React from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import { ShieldAlert, AlertTriangle, X, Check, ExternalLink } from 'lucide-react';

export default function MetaPolicyIssueModal({
  isOpen,
  onClose,
  product,
  statusObj,
  onResolve
}) {
  if (!isOpen || !product) return null;

  const isPolicyRejection = statusObj?.status === 'rejected';

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.metaModalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderBrand}>
            <div className={styles.metaIconCircle}>
              {isPolicyRejection ? <ShieldAlert size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <h3 className={styles.modalTitle}>
                {isPolicyRejection ? 'Meta Commerce Policy Review' : 'Catalog Attributes Required'}
              </h3>
              <p className={styles.modalSubtitle}>
                {product.name || 'Garment Item'} • SKU: {product.sku || product.id?.substring(0, 8)}
              </p>
            </div>
          </div>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.issueDetailBox}>
            <div className={styles.issueDetailTitle}>
              {isPolicyRejection ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
              <span>{isPolicyRejection ? 'Meta Policy Flag Reason' : 'Missing Required Attributes'}</span>
            </div>
            <p className={styles.issueDetailText}>
              {statusObj?.reason || 'This product requires merchant review before it can be listed on Facebook & Instagram Shops.'}
            </p>
          </div>

          <div>
            <div className={styles.settingsCardTitle}>
              <span>Requirements Checklist for Meta Commerce:</span>
            </div>
            <ul className={styles.guidelineList}>
              {isPolicyRejection ? (
                <>
                  <li>Ensure product images do not contain misleading overlay banners or watermark logos.</li>
                  <li>Verify compliance with Meta's Advertising Standards regarding apparel and model depictions.</li>
                  <li>Check that product title and description contain accurate material and sizing specifications.</li>
                </>
              ) : (
                <>
                  <li>Unique Global Trade Item Number (GTIN) or Manufacturer Part Number (MPN).</li>
                  <li>Clear high-resolution primary photo with minimum 500x500px dimensions.</li>
                  <li>Defined retail pricing in your store's primary currency (USD/EUR).</li>
                  <li>Accurate inventory availability status (in stock / backorder).</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnMetaSecondary}
            onClick={onClose}
          >
            Dismiss
          </button>
          <button
            type="button"
            className={styles.btnMetaPrimary}
            onClick={() => {
              onResolve?.(product);
              onClose();
            }}
          >
            <Check size={14} />
            <span>{isPolicyRejection ? 'Request Meta Re-Review' : 'Mark as Resolved & Ready'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
