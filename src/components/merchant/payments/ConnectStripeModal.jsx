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
  const [payoutSchedule, setPayoutSchedule] = useState(currentAccount?.payoutSchedule || 'Automatic daily (48h post-delivery)');
  const [status, setStatus] = useState(currentAccount?.status || 'active');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      onSaveStripe({
        accountId: accountId.trim() || 'acct_1Ox7Y8K92A8291',
        payoutSchedule,
        status
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
              <label className="pg-form-label">Automated Payout Schedule</label>
              <select
                className="pg-form-input"
                value={payoutSchedule}
                onChange={(e) => setPayoutSchedule(e.target.value)}
              >
                <option value="Automatic daily (48h post-delivery)">Automatic daily (48h post carrier delivery POD)</option>
                <option value="Weekly on Fridays">Weekly settlement (Every Friday)</option>
                <option value="Monthly (1st of month)">Monthly settlement (1st of each month)</option>
                <option value="Manual on request">Manual on demand</option>
              </select>
            </div>

            <div className="pg-form-group">
              <label className="pg-form-label">Gateway Connection Status</label>
              <select
                className="pg-form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active & Verified (Ready for Payouts)</option>
                <option value="pending">Pending Onboarding Verification</option>
              </select>
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
