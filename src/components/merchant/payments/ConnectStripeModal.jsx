"use client";
import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, Check } from 'lucide-react';

export default function ConnectStripeModal({
  isOpen,
  onClose,
  currentAccount,
  onSaveStripe
}) {
  const [accountId, setAccountId] = useState(currentAccount?.accountId || 'acct_1Ox7Y8K92A8291');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      onSaveStripe({
        accountId: accountId.trim() || 'acct_1Ox7Y8K92A8291',
        payoutSchedule: currentAccount?.payoutSchedule || 'Automatic daily (48h post-delivery)',
        status: currentAccount?.status || 'active'
      });
      setSaving(false);
      onClose();
    }, 400);
  };

  return (
    <div className="pg-modal-overlay" onClick={onClose}>
      <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pg-modal-header">
          <h3 className="pg-modal-title">Stripe Connect Settings</h3>
          <button type="button" className="pg-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pg-modal-body">
            <div className="pg-notice-box">
              <ShieldCheck size={16} className="pg-notice-icon" />
              <span>
                VogueSocial uses Stripe Connect Express to automate card processing, tax compliance (1099-K), and direct payouts.
              </span>
            </div>

            <div className="pg-form-group">
              <label className="pg-form-label">Stripe Express Onboarding Link</label>
              <a
                href="https://connect.stripe.com/express_login"
                target="_blank"
                rel="noopener noreferrer"
                className="pg-btn-secondary"
              >
                <span>Complete Stripe Express Verification</span>
                <ExternalLink size={13} />
              </a>
              <span className="pg-form-hint">
                Opens Stripe's hosted flow to verify business identity, tax numbers, and personal credentials.
              </span>
            </div>

            <div className="pg-form-group">
              <label className="pg-form-label">Connected Account ID (acct_...)</label>
              <input
                type="text"
                className="pg-form-input"
                placeholder="e.g. acct_1Ox7Y8K92A8291"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
              />
              <span className="pg-form-hint">
                Provided automatically by Stripe upon onboarding completion.
              </span>
            </div>

            <div className="pg-form-group">
              <label className="pg-form-label">Gateway Compliance Status</label>
              <div className="pg-readonly-field">
                <span className="pg-badge-active">
                  <span className="pg-status-dot" />
                  Active & Verified via Stripe
                </span>
              </div>
              <span className="pg-form-hint">
                Regulated by Stripe identity/AML checks. Status updates automatically upon KYC review.
              </span>
            </div>

            <div className="pg-form-group">
              <label className="pg-form-label">Settlement Release Policy</label>
              <div className="pg-readonly-field">
                <span>Automatic Daily (48h post carrier delivery POD)</span>
              </div>
              <span className="pg-form-hint">
                Platform standard payout release rule. Protects merchant orders against disputes and chargebacks.
              </span>
            </div>
          </div>

          <div className="pg-modal-footer">
            <button
              type="button"
              className="pg-btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pg-btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
