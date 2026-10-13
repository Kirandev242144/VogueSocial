"use client";
import React from 'react';
import { ShieldAlert, CheckCircle, Lock, Unlock } from 'lucide-react';

export default function VendorIdentityHeader({
  vendor,
  storefrontStatus,
  kybStatus,
  payoutEligibility,
  onOpenStorefrontModal,
  onOpenHoldModal,
  onOpenReleaseModal
}) {
  return (
    <div className="vam-header">
      <div className="vam-header-top">
        <div className="vam-header-left">
          <div className="vam-avatar">
            {(vendor.store_name || 'V').charAt(0).toUpperCase()}
          </div>
          <div className="vam-header-info">
            <div className="vam-title-row">
              <span className="vam-store-name">
                {vendor.store_name}
              </span>
            </div>
            <div className="vam-subtitle">
              @{vendor.store_handle} • {vendor.country || 'Global'} • {vendor.products_count ?? 0} active products
            </div>
          </div>
        </div>

        <div className="vam-header-actions">
          {storefrontStatus === 'active' ? (
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => onOpenStorefrontModal('suspended')}
            >
              <ShieldAlert size={12} /> Suspend Storefront
            </button>
          ) : (
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => onOpenStorefrontModal('active')}
            >
              <CheckCircle size={12} /> Reactivate Storefront
            </button>
          )}

          {payoutEligibility === 'administrative_hold' ? (
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={onOpenReleaseModal}
            >
              <Unlock size={12} /> Resume Payouts
            </button>
          ) : (
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={onOpenHoldModal}
            >
              <Lock size={12} /> Pause Payouts
            </button>
          )}
        </div>
      </div>

      {/* Compact Operational Status Bar */}
      <div className="vam-status-bar">
        <div className="vam-status-chip">
          <span className="vam-chip-label">Storefront:</span>
          <div className={`vam-chip-dot ${storefrontStatus === 'active' ? 'active' : (storefrontStatus === 'suspended' ? 'suspended' : 'review')}`} />
          <span className="vam-chip-val">
            {storefrontStatus === 'active' ? 'Live' : (storefrontStatus === 'suspended' ? 'Suspended' : 'Under Review')}
          </span>
        </div>

        <div className="vam-status-chip">
          <span className="vam-chip-label">KYB Verification:</span>
          <div className={`vam-chip-dot ${kybStatus === 'verified' ? 'verified' : (kybStatus === 'rejected' ? 'rejected' : 'review')}`} />
          <span className="vam-chip-val">
            {kybStatus === 'verified' ? 'Verified' : (kybStatus === 'rejected' ? 'Rejected' : 'Review Required')}
          </span>
        </div>

        <div className="vam-status-chip">
          <span className="vam-chip-label">Payouts:</span>
          <div className={`vam-chip-dot ${payoutEligibility === 'eligible' ? 'eligible' : 'hold'}`} />
          <span className="vam-chip-val">
            {payoutEligibility === 'eligible' ? 'Active' : 'Paused (On Hold)'}
          </span>
        </div>
      </div>
    </div>
  );
}
