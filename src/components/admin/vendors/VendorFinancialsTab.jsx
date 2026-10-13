"use client";
import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Unlock, Lock, AlertCircle } from 'lucide-react';

export default function VendorFinancialsTab({
  vendor,
  onUpdateAgreementRate,
  onOpenHoldModal,
  onOpenReleaseModal,
  loading = false,
  showFeedback
}) {
  const currentAgreement = vendor.marketplace_agreement || {
    version: 'v2.4',
    effective_date: '2026-08-15',
    accepted_by: vendor.representative?.name || 'Authorized Signer',
    accepted_at: '2026-08-15T10:14:22Z',
    commission_rate_pct: vendor.commercial_terms?.take_rate_pct || 5.0,
    protocol_fees_desc: 'Standard payment processing passed at cost',
    fulfillment_model: 'Merchant Self-Fulfill',
    return_policy: '14-Day Customer Window',
    payout_conditions: 'Automated delivery verification confirmed'
  };

  const [rateForm, setRateForm] = useState({
    newRate: currentAgreement.commission_rate_pct || 5.0,
    reason: '',
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  const paymentProvider = vendor.payment_provider || {
    provider: 'Stripe Connect',
    account_id: vendor.commercial_terms?.stripe_account_id || 'acct_1N4k92A',
    onboarding_status: 'completed',
    charges_enabled: true,
    payouts_enabled: !vendor.commercial_terms?.payout_hold,
    bank_name: vendor.commercial_terms?.bank_name || 'JPMorgan Chase (Paris)',
    account_last4: vendor.commercial_terms?.account_last4 || '4192',
    currency: 'EUR',
    source: 'provider_synced'
  };

  const payoutEligibility = vendor.payout_eligibility || (vendor.commercial_terms?.payout_hold || vendor.payout_hold_details?.active ? 'administrative_hold' : 'eligible');

  const auditTrail = vendor.audit_trail || [
    {
      id: 'aud_1',
      timestamp: vendor.created_at || '2026-08-15T10:00:00Z',
      actor: 'Platform Administrator',
      action: 'Account Approved',
      note: 'Initial merchant onboarding completed.'
    }
  ];

  const handleExecuteRateAmendment = async (e) => {
    e.preventDefault();
    if (onUpdateAgreementRate) {
      await onUpdateAgreementRate(vendor.id, {
        newRate: parseFloat(rateForm.newRate),
        reason: rateForm.reason || 'Contract rate revision',
        effectiveDate: rateForm.effectiveDate,
        adminName: 'Commercial Director'
      });
      showFeedback(`Commission rate updated to ${rateForm.newRate}%.`);
      setRateForm(prev => ({ ...prev, reason: '' }));
    }
  };

  return (
    <div className="vam-tab-body">
      {/* Payout Hold Alert if active */}
      {payoutEligibility === 'administrative_hold' && (
        <div className="vam-hold-banner">
          <div className="vam-hold-banner-left">
            <AlertCircle size={15} className="vam-icon-danger" />
            <div>
              <div className="vam-hold-banner-title">Administrative Payout Hold Active</div>
              <div className="vam-hold-banner-desc">
                {vendor.payout_hold_details?.reason || 'Compliance review in progress.'}
                {vendor.payout_hold_details?.placed_by && ` • Placed by ${vendor.payout_hold_details.placed_by}`}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={onOpenReleaseModal}
          >
            <Unlock size={12} /> Resume Payouts
          </button>
        </div>
      )}

      {/* Section 1: Payment Provider */}
      <div className="vam-section">
        <div className="vam-section-header">
          <div className="vam-section-title">Payment Provider (Stripe Connect)</div>
          <span className={`vam-status-pill ${paymentProvider.charges_enabled ? 'active' : 'suspended'}`}>
            <span className="vam-status-dot" />
            {paymentProvider.charges_enabled ? 'Charges Enabled' : 'Disabled'}
          </span>
        </div>

        <div className="vam-grid-2">
          <div className="vam-kv-item">
            <span className="vam-kv-label">Connected Account</span>
            <div className="vam-kv-val-row">
              <code className="vam-kv-code">{paymentProvider.account_id}</code>
              <a
                href={`https://dashboard.stripe.com/test/connect/accounts/${paymentProvider.account_id}`}
                target="_blank"
                rel="noreferrer"
                className="vam-link-subtle"
                title="View in Stripe Dashboard"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="vam-kv-item">
            <span className="vam-kv-label">Settlement Bank</span>
            <div className="vam-kv-val">
              {paymentProvider.bank_name} •••• {paymentProvider.account_last4}
              <span className="vam-kv-hint">({paymentProvider.currency || 'EUR'})</span>
            </div>
          </div>

          <div className="vam-kv-item">
            <span className="vam-kv-label">Payout Schedule</span>
            <div className="vam-kv-val">
              Rolling automated (48h post delivery POD)
            </div>
          </div>

          <div className="vam-kv-item">
            <span className="vam-kv-label">Disbursement Status</span>
            <div className="vam-kv-val-row">
              <span>{payoutEligibility === 'administrative_hold' ? 'Paused (Hold)' : 'Active (Disbursing)'}</span>
              {payoutEligibility !== 'administrative_hold' && (
                <button
                  type="button"
                  className="vam-text-btn-danger"
                  onClick={onOpenHoldModal}
                >
                  <Lock size={11} /> Pause
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Commercial Agreement */}
      <div className="vam-section">
        <div className="vam-section-header">
          <div className="vam-section-title">Commercial Agreement ({currentAgreement.version || 'v2.4'})</div>
          <span className="vam-kv-hint">Effective: {currentAgreement.effective_date || '2026-08-15'}</span>
        </div>

        <div className="vam-grid-2">
          <div className="vam-kv-item">
            <span className="vam-kv-label">Commission Take-Rate</span>
            <div className="vam-kv-val vam-kv-highlight">
              {(currentAgreement.commission_rate_pct ?? 5.0).toFixed(1)}%
            </div>
          </div>

          <div className="vam-kv-item">
            <span className="vam-kv-label">Fulfillment Model</span>
            <div className="vam-kv-val">
              {(currentAgreement.fulfillment_model || 'Merchant Self-Fulfill').replace(/Atelier\s*/gi, '')}
            </div>
          </div>
        </div>

        {/* Rate Amendment Inline Form */}
        <form onSubmit={handleExecuteRateAmendment} className="vam-rate-form">
          <div className="vam-rate-form-grid">
            <div>
              <label className="vam-field-label">New Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="30"
                className="admin-input"
                value={rateForm.newRate}
                onChange={(e) => setRateForm({ ...rateForm, newRate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="vam-field-label">Effective Date</label>
              <input
                type="date"
                className="admin-input"
                value={rateForm.effectiveDate}
                onChange={(e) => setRateForm({ ...rateForm, effectiveDate: e.target.value })}
                required
              />
            </div>

            <div className="vam-rate-reason-col">
              <label className="vam-field-label">Reason for Amendment</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Volume milestone incentive"
                value={rateForm.reason}
                onChange={(e) => setRateForm({ ...rateForm, reason: e.target.value })}
                required
              />
            </div>

            <div className="vam-rate-action-col">
              <button
                type="submit"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                disabled={loading}
              >
                Update Rate
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Section 3: Activity Log */}
      <div className="vam-section">
        <div className="vam-section-header">
          <div className="vam-section-title">Audit Log</div>
        </div>

        <div className="vam-audit-list">
          {auditTrail.map((aud) => (
            <div key={aud.id} className="vam-audit-row">
              <div className="vam-audit-main">
                <span className="vam-audit-action">{aud.action}</span>
                <span className="vam-audit-note">{aud.note}</span>
              </div>
              <div className="vam-audit-meta">
                <span>{aud.actor}</span>
                <span className="vam-sep">•</span>
                <span>{new Date(aud.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
