"use client";
import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';

export default function ConnectedAccountsTable({ accounts = [] }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="admin-panel" style={{ padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--adm-border)' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text-main)', margin: 0 }}>
            Connected Accounts
          </h3>
          <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', margin: '3px 0 0' }}>
            Merchant ateliers configured for automated escrow balance disbursement.
          </p>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)' }}>
          {accounts.length} active accounts
        </span>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: '0.5rem' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Merchant</th>
              <th>Stripe Account ID</th>
              <th>Verification</th>
              <th>Payout Bank</th>
              <th style={{ textAlign: 'right' }}>Pending Balance</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => {
              const isVerified = acc.kyc_status === 'verified';
              return (
                <tr key={acc.id}>
                  {/* Merchant */}
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.8rem' }}>
                      {acc.store_name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                      @{acc.store_handle} • {acc.country}
                    </div>
                  </td>

                  {/* Stripe Account ID */}
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

                  {/* Verification Status */}
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 500, color: isVerified ? '#10b981' : '#f59e0b' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isVerified ? '#10b981' : '#f59e0b' }} />
                      {isVerified ? 'Verified' : 'Under Review'}
                    </span>
                  </td>

                  {/* Payout Bank */}
                  <td>
                    <div style={{ fontSize: '0.76rem', color: 'var(--adm-text-main)' }}>
                      {acc.bank_name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                      •••• {acc.account_last4}
                    </div>
                  </td>

                  {/* Pending Balance */}
                  <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
                    ${acc.balance_pending.toFixed(2)}
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
                      <span>Dashboard</span>
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
