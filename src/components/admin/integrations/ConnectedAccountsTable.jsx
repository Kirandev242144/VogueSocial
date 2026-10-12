"use client";
import React, { useState } from 'react';
import {
  Building2, CheckCircle, AlertTriangle, ShieldCheck,
  ExternalLink, Copy, Check, DollarSign, Landmark
} from 'lucide-react';

export default function ConnectedAccountsTable({ accounts = [] }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <span className="admin-panel-title">
            <Building2 size={16} color="#818cf8" />
            Merchant Stripe Connect Accounts & KYC Registry
          </span>
          <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
            Verified merchant banking destinations authorized to receive 95% net escrow disbursements
          </div>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', fontWeight: 600 }}>
          {accounts.length} Connected Ateliers
        </span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Merchant Atelier</th>
              <th>Stripe Account ID</th>
              <th>KYC Status</th>
              <th>Payouts</th>
              <th>Disbursement Bank</th>
              <th>Pending Escrow</th>
              <th style={{ textAlign: 'right' }}>Stripe Console</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => {
              const isVerified = acc.kyc_status === 'verified';
              return (
                <tr key={acc.id}>
                  {/* Atelier */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
                      {acc.store_name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                      @{acc.store_handle} • {acc.country} ({acc.currency})
                    </div>
                  </td>

                  {/* Stripe Account ID */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.76rem', color: 'var(--adm-text-main)' }}>
                        {acc.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(acc.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--adm-text-sub)', cursor: 'pointer', padding: '2px' }}
                        title="Copy Stripe Account ID"
                      >
                        {copiedId === acc.id ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </td>

                  {/* KYC Status */}
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '99px',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        background: isVerified ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: isVerified ? '#10b981' : '#f59e0b',
                        border: `1px solid ${isVerified ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`
                      }}
                    >
                      {isVerified ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                      {isVerified ? 'KYC VERIFIED' : 'PENDING REVIEW'}
                    </span>
                  </td>

                  {/* Payouts */}
                  <td>
                    <span style={{ fontWeight: 600, fontSize: '0.74rem', color: acc.payouts_enabled ? '#10b981' : '#ef4444' }}>
                      {acc.payouts_enabled ? 'Active • Automated' : 'Restricted'}
                    </span>
                    <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)' }}>
                      {acc.payout_schedule}
                    </div>
                  </td>

                  {/* Disbursement Bank */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: 'var(--adm-text-main)', fontWeight: 600 }}>
                      <Landmark size={12} color="var(--adm-text-sub)" />
                      <span>{acc.bank_name}</span>
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', marginLeft: '16px' }}>
                      Ending in •••• {acc.account_last4}
                    </div>
                  </td>

                  {/* Pending Escrow */}
                  <td>
                    <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.84rem' }}>
                      ${acc.balance_pending.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)' }}>
                      Pending delivery POD
                    </div>
                  </td>

                  {/* Stripe Console link */}
                  <td style={{ textAlign: 'right' }}>
                    <a
                      href={`https://dashboard.stripe.com/test/connect/accounts/${acc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      style={{ fontSize: '0.68rem', padding: '0.3rem 0.6rem' }}
                    >
                      <span>Inspect</span>
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
