"use client";
import React from 'react';
import { AdminModal } from '../index';

export default function VendorStorefrontStatusModal({
  isOpen,
  onClose,
  targetStorefrontStatus,
  storefrontReason,
  setStorefrontReason,
  onConfirm,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={targetStorefrontStatus === 'active' ? 'Reactivate Storefront' : 'Suspend Storefront'}
      maxWidth="460px"
      footer={
        <div className="vam-submodal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`admin-btn ${targetStorefrontStatus === 'active' ? 'admin-btn-primary' : 'admin-btn-danger'} admin-btn-sm`}
            onClick={onConfirm}
            disabled={loading}
          >
            {targetStorefrontStatus === 'active' ? 'Reactivate' : 'Confirm Suspension'}
          </button>
        </div>
      }
    >
      <div className="vam-submodal-stack">
        <div className="vam-submodal-desc">
          {targetStorefrontStatus === 'active'
            ? 'Reactivating makes this atelier live and restores its garments to marketplace search and checkout.'
            : 'Suspending unlists the atelier from public discovery and disables checkout. Existing delivered orders remain eligible for settlement.'}
        </div>

        <div>
          <label className="vam-field-label">Reason (Optional)</label>
          <input
            type="text"
            className="admin-input"
            placeholder="e.g. Policy investigation or terms compliance..."
            value={storefrontReason}
            onChange={(e) => setStorefrontReason(e.target.value)}
          />
        </div>
      </div>
    </AdminModal>
  );
}
