"use client";
import React, { useState } from 'react';
import { CreditCard, ExternalLink, ShieldCheck, Unlock, Lock, AlertCircle, FileSignature, History } from 'lucide-react';

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
    fulfillment_model: 'Merchant Atelier Self-Fulfill',
    return_policy: '14-Day Boutique Window • Escrow released 48h post carrier delivery (POD)',
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

  const agreementHistory = vendor.agreement_history || [
    {
      version: currentAgreement.version || 'v2.4',
      rate_pct: currentAgreement.commission_rate_pct || 5.0,
      effective_date: currentAgreement.effective_date || '2026-08-15',
      reason: 'Standard atelier contract',
      updated_by: currentAgreement.accepted_by || 'Camille Laurent',
      updated_at: currentAgreement.accepted_at || '2026-08-15T10:14:22Z'
    }
  ];

  const auditTrail = vendor.audit_trail || [
    {
      id: 'aud_1',
      timestamp: vendor.created_at || '2026-08-15T10:00:00Z',
      actor: 'Platform Administrator',
      action: 'Account Approved',
      note: 'Initial boutique onboarding completed.'
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
      showFeedback(`Commission rate amended to ${rateForm.newRate}%.`);
      setRateForm(prev => ({ ...prev, reason: '' }));
    }
  };

  return (
    <div className="vam-stack">
      {/* Payment Provider (Stripe Connect) */}
      <div className="vam-card">
        <div className="vam-card-header">
          <div className="vam-card-title">
            <CreditCard size={13} color="#38bdf8" /> Payment Provider (Stripe Connect)
          </div>
          <span className={`vam-doc-badge ${paymentProvider.charges_enabled ? 'verified' : 'rejected'}`}>
            {paymentProvider.charges_enabled ? 'Charges Enabled' : 'Charges Disabled'}
          </span>
        </div>

        <div className="vam-finance-grid">
          <div className="vam-info-box">
            <div className="vam-info-label">Connected Account ID</div>
            <div className="vam-stripe-row">
              <input
                type="text"
                readOnly
                className="admin-input vam-stripe-input"
                value={paymentProvider.account_id}
              />
              <a
                href={`https://dashboard.stripe.com/test/connect/accounts/${paymentProvider.account_id}`}
                target="_blank"
                rel="noreferrer"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                title="View in Stripe Dashboard"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="vam-info-box">
            <div className="vam-info-label">Settlement Bank Rails</div>
            <div className="vam-info-val-md">
              {paymentProvider.bank_name} •••• {paymentProvider.account_last4}
            </div>
            <div className="vam-info-sub">
              Currency: {paymentProvider.currency || 'EUR'}
            </div>
          </div>
        </div>
      </div>

      {/* Payout Governance & Settlement Status */}
      <div className={`vam-card ${payoutEligibility === 'administrative_hold' ? 'alert-border' : ''}`}>
        <div className="vam-card-header">
          <div className="vam-card-title">
            <ShieldCheck size={13} color={payoutEligibility === 'administrative_hold' ? '#ef4444' : '#10b981'} />
            <span>Payout Settlement Status</span>
          </div>

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

        {payoutEligibility === 'administrative_hold' ? (
          <div className="vam-hold-alert">
            <div className="vam-hold-header">
              <AlertCircle size={14} />
              <span>Administrative Payout Hold Active — Outgoing settlements paused</span>
            </div>
            <div className="vam-hold-content">
              <strong>Reason:</strong> {vendor.payout_hold_details?.reason || 'Compliance documentation under review.'}
            </div>
            <div className="vam-hold-meta">
              Placed by {vendor.payout_hold_details?.placed_by || 'Platform Admin'} on {new Date(vendor.payout_hold_details?.placed_at || Date.now()).toLocaleDateString()}
            </div>
          </div>
        ) : (
          <div className="vam-info-box">
            <div className="vam-info-label">Current Payout Schedule</div>
            <div className="vam-info-val-md">
              Rolling Automated Disbursements Active
            </div>
            <div className="vam-info-sub">
              Orders settle 48 hours post verified delivery (POD).
            </div>
          </div>
        )}
      </div>

      {/* Commercial Terms & Commission Rate */}
      <div className="vam-card">
        <div className="vam-card-header">
          <div className="vam-card-title">
            <FileSignature size={13} color="#38bdf8" /> Commercial Agreement ({currentAgreement.version || 'v2.4'})
          </div>
          <div className="vam-info-sub">
            Effective: {currentAgreement.effective_date || '2026-08-15'}
          </div>
        </div>

        <div className="vam-finance-grid">
          <div className="vam-info-box">
            <div className="vam-info-label">Commission Take-Rate</div>
            <div className="vam-info-val-lg">
              {(currentAgreement.commission_rate_pct ?? 5.0).toFixed(1)}%
            </div>
            <div className="vam-info-sub">
              Applied to settled order GMV
            </div>
          </div>

          <div className="vam-info-box">
            <div className="vam-info-label">Fulfillment Model</div>
            <div className="vam-info-val-md">
              {currentAgreement.fulfillment_model || 'Merchant Atelier Self-Fulfill'}
            </div>
            <div className="vam-info-sub">
              Tracking required within 72h
            </div>
          </div>
        </div>

        {/* Rate Revision Form */}
        <form onSubmit={handleExecuteRateAmendment} className="vam-rate-inline-form">
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

          <div>
            <label className="vam-field-label">Revision Reason</label>
            <input
              type="text"
              className="admin-input"
              placeholder="e.g. Volume milestone incentive..."
              value={rateForm.reason}
              onChange={(e) => setRateForm({ ...rateForm, reason: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-sm vam-rate-btn"
            disabled={loading}
          >
            Update Rate
          </button>
        </form>

        {/* Agreement History */}
        {agreementHistory.length > 0 && (
          <div className="vam-history-list">
            {agreementHistory.map((h, i) => (
              <div key={i} className="vam-history-item">
                <div className="vam-history-left">
                  <span className="vam-history-version">{h.version}</span>
                  <span className="vam-history-rate">{h.rate_pct}% Rate</span>
                  <span>• {h.reason}</span>
                </div>
                <div className="vam-history-meta">
                  {h.effective_date} • {h.updated_by}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Audit Trail */}
      <div className="vam-card">
        <div className="vam-card-header">
          <div className="vam-card-title">
            <History size={13} color="#38bdf8" /> Activity Audit Trail
          </div>
        </div>

        <div className="vam-audit-scroll">
          {auditTrail.map((aud) => (
            <div key={aud.id} className="vam-audit-item">
              <div className="vam-audit-item-top">
                <span className="vam-audit-action">{aud.action}</span>
                <span className="vam-audit-time">{new Date(aud.timestamp).toLocaleString()}</span>
              </div>
              <div className="vam-audit-note">{aud.note}</div>
              <div className="vam-audit-actor">{aud.actor}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
