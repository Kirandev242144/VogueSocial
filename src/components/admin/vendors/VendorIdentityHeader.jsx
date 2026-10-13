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
      <div className="vam-header-main">
        <div className="vam-header-meta">
          <div className="vam-header-title-row">
            <h3 className="vam-store-title">{vendor.store_name}</h3>
            <span className="vam-store-handle">@{vendor.store_handle}</span>
          </div>
          <div className="vam-store-sub">
            <span>{vendor.legal_business_name || vendor.store_name}</span>
            <span className="vam-sep">•</span>
            <span>{vendor.country || 'Global'}</span>
            <span className="vam-sep">•</span>
            <span>{vendor.products_count ?? 0} active products</span>
          </div>
        </div>

        <div className="vam-header-actions">
          {storefrontStatus === 'active' ? (
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-subtle"
              onClick={() => onOpenStorefrontModal('suspended')}
              title="Suspend public storefront"
            >
              <ShieldAlert size={13} />
              <span>Suspend</span>
            </button>
          ) : (
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => onOpenStorefrontModal('active')}
            >
              <CheckCircle size={13} />
              <span>Reactivate</span>
            </button>
          )}

          {payoutEligibility === 'administrative_hold' ? (
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={onOpenReleaseModal}
            >
              <Unlock size={13} />
              <span>Resume Payouts</span>
            </button>
          ) : (
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-danger-subtle"
              onClick={onOpenHoldModal}
              title="Pause payout disbursements"
            >
              <Lock size={13} />
              <span>Pause Payouts</span>
            </button>
          )}
        </div>
      </div>

      {/* Minimalist Status Bar */}
      <div className="vam-status-row">
        <div className={`vam-status-pill ${storefrontStatus === 'active' ? 'active' : 'suspended'}`}>
          <span className="vam-status-dot" />
          <span>Storefront: <strong>{storefrontStatus === 'active' ? 'Live' : (storefrontStatus === 'suspended' ? 'Suspended' : 'Review')}</strong></span>
        </div>

        <div className={`vam-status-pill ${kybStatus === 'verified' ? 'active' : (kybStatus === 'rejected' ? 'suspended' : 'pending')}`}>
          <span className="vam-status-dot" />
          <span>KYB: <strong>{kybStatus === 'verified' ? 'Verified' : (kybStatus === 'rejected' ? 'Rejected' : 'Action Required')}</strong></span>
        </div>

        <div className={`vam-status-pill ${payoutEligibility === 'eligible' ? 'active' : 'hold'}`}>
          <span className="vam-status-dot" />
          <span>Payouts: <strong>{payoutEligibility === 'eligible' ? 'Active' : 'On Hold'}</strong></span>
        </div>
      </div>
    </div>
  );
}
