"use client";
import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

function formatRelativeTime(dateStr) {
  if (!dateStr) return 'Recently';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function ConnectedAccountsTable({ accounts = [] }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="admin-panel" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--adm-border)', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text-main)', margin: 0 }}>
            Connected Merchant Accounts
          </h3>
          <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', margin: '3px 0 0' }}>
            Merchant ateliers configured with payment provider accounts for automated escrow disbursement.
          </p>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)' }}>
          {accounts.length} onboarded accounts
        </span>
      </div>

      {/* Real-World Operational Disclaimer Banner */}
      <div style={{ marginTop: '1rem', padding: '0.75rem 0.95rem', borderRadius: '6px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <ShieldCheck size={14} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', lineHeight: 1.45 }}>
          <strong style={{ color: 'var(--adm-text-main)' }}>Simulated Provider Balances:</strong> In sandbox mode, balances reflect simulated merchant escrow ledgers. In production, transfers execute via <code>stripe.transfers.create</code> directly to merchant bank accounts upon satisfying the 5-step verification checklist.
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap" style={{ marginTop: '1rem' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Merchant Atelier</th>
              <th>Provider Account ID</th>
              <th>KYC Onboarding</th>
              <th>Payout Eligibility</th>
              <th>Payout Bank Rails</th>
              <th style={{ textAlign: 'right' }}>Pending Balance</th>
              <th style={{ textAlign: 'right' }}>Last Synced</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => {
              const kycStage = acc.kyc_stage || (acc.kyc_status === 'verified' ? 'complete' : 'under_review');
              const isEligible = acc.payout_eligibility === 'eligible' || acc.payouts_enabled === true;
              const hasRestrictions = acc.restrictions && acc.restrictions !== 'None';
              const balance = acc.pending_balance !== undefined ? acc.pending_balance : (acc.balance_pending || 0);

              let kycLabel = 'Under Review';
              let kycColor = '#f59e0b';
              if (kycStage === 'complete' || kycStage === 'verified') {
                kycLabel = 'Complete (Verified)';
                kycColor = '#10b981';
              } else if (kycStage === 'documents_required') {
                kycLabel = 'Docs Required';
                kycColor = '#f59e0b';
              }

              return (
                <tr key={acc.id}>
                  {/* Merchant Atelier */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.8rem' }}>
                      {acc.store_name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                      @{acc.store_handle} • {acc.country}
                    </div>
                  </td>

                  {/* Provider Account ID */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.74rem', color: 'var(--adm-text-main)' }}>
                        {acc.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--adm-text-sub)', cursor: 'pointer', padding: '2px' }}
                        title="Copy account ID"
                      >
                        {copiedId === acc.id ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </td>

                  {/* KYC Stage */}
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 500, color: kycColor }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: kycColor }} />
                      {kycLabel}
                    </span>
                  </td>

                  {/* Payout Eligibility & Restrictions */}
                  <td>
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '3px',
                          background: isEligible ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: isEligible ? '#10b981' : '#ef4444'
                        }}
                      >
                        {isEligible ? 'Eligible' : 'Restricted'}
                      </span>
                      {hasRestrictions && (
                        <div style={{ fontSize: '0.66rem', color: '#f59e0b', marginTop: '2px', lineHeight: 1.3 }}>
                          {acc.restrictions}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Payout Bank Rails */}
                  <td>
                    <div style={{ fontSize: '0.76rem', color: 'var(--adm-text-main)' }}>
                      {acc.bank_name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                      •••• {acc.account_last4} • {acc.payout_schedule || 'Rolling'}
                    </div>
                  </td>

                  {/* Pending Balance */}
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
                      ${Number(balance).toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)' }}>
                      Simulated Provider
                    </div>
                  </td>

                  {/* Last Synced */}
                  <td style={{ textAlign: 'right', fontSize: '0.72rem', color: 'var(--adm-text-sub)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatRelativeTime(acc.last_synced_at)}
                  </td>

                  {/* Action */}
                  <td style={{ textAlign: 'right' }}>
                    <a
                      href={`https://dashboard.stripe.com/test/connect/accounts/${acc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.68rem' }}
                    >
                      <span>Provider</span>
                      <ExternalLink size={10} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
