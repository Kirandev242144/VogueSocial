"use client";
import React from 'react';
import { ExternalLink, Landmark, Settings2, Edit2 } from 'lucide-react';

export default function PaymentGatewayCard({
  account = {},
  onOpenEditBank,
  onOpenConnectStripe
}) {
  const isConnected = account.status === 'active';

  return (
    <div className="pg-card">
      <div className="pg-card-header">
        <div className="pg-card-header-left">
          <div className="pg-gateway-logo">
            <span className="pg-gateway-logo-icon">S</span>
            <span>{account.provider || 'Stripe Connect'}</span>
          </div>

          {isConnected ? (
            <span className="pg-badge-active">
              <span className="pg-status-dot" />
              Active
            </span>
          ) : (
            <span className="pg-badge-pending">
              <span className="pg-status-dot pg-status-dot-amber" />
              Action Required
            </span>
          )}

          {/* Payment Method Acceptance Chips */}
          <div className="pg-payment-chips">
            <span className="pg-chip">VISA</span>
            <span className="pg-chip">MC</span>
            <span className="pg-chip">AMEX</span>
            <span className="pg-chip">Apple Pay</span>
            <span className="pg-chip">Google Pay</span>
          </div>
        </div>

        <div className="pg-card-header-actions">
          <button
            type="button"
            className="pg-btn-secondary"
            onClick={onOpenConnectStripe}
            title="Configure Stripe Connected Account"
          >
            <Settings2 size={13} />
            <span>Manage Stripe</span>
          </button>

          <a
            href={account.dashboardUrl || 'https://connect.stripe.com/express_login'}
            target="_blank"
            rel="noopener noreferrer"
            className="pg-btn-secondary"
          >
            <span>Stripe Express Dashboard</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="pg-kv-grid">
        {/* Connected Account */}
        <div className="pg-kv-item">
          <div className="pg-kv-header-row">
            <span className="pg-kv-label">Connected Account ID</span>
            <button
              type="button"
              className="pg-btn-text"
              onClick={onOpenConnectStripe}
            >
              Change
            </button>
          </div>
          <div className="pg-kv-val">
            <code className="pg-code">{account.accountId || 'acct_1Ox7Y8K92A8291'}</code>
          </div>
        </div>

        {/* Settlement Bank */}
        <div className="pg-kv-item">
          <div className="pg-kv-header-row">
            <span className="pg-kv-label">Settlement Bank</span>
            <button
              type="button"
              className="pg-btn-text"
              onClick={onOpenEditBank}
            >
              Update bank
            </button>
          </div>
          <div className="pg-kv-val">
            <Landmark size={14} />
            <span>{account.bankName || 'JPMorgan Chase'} •••• {account.accountLast4 || '4192'}</span>
          </div>
        </div>

        {/* Payout Schedule */}
        <div className="pg-kv-item">
          <div className="pg-kv-header-row">
            <span className="pg-kv-label">Payout Schedule</span>
          </div>
          <div className="pg-kv-val">
            <span>{account.payoutSchedule || 'Automatic daily (48h post-delivery)'}</span>
          </div>
        </div>

        {/* Tax Documents */}
        <div className="pg-kv-item">
          <span className="pg-kv-label">Tax Documents</span>
          <div className="pg-kv-val">
            <span>1099-K managed via Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
