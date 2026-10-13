"use client";
import React from 'react';
import { ExternalLink, Landmark } from 'lucide-react';

export default function PaymentGatewayCard({
  account = {
    provider: 'Stripe Connect',
    accountId: 'acct_1Ox7Y8K92A8291',
    status: 'active',
    bankName: 'JPMorgan Chase',
    accountLast4: '4192',
    currency: 'USD',
    payoutSchedule: 'Automatic daily (48h post-delivery)',
    dashboardUrl: 'https://connect.stripe.com/express_login'
  }
}) {
  return (
    <div className="pg-card">
      <div className="pg-card-header">
        <div className="pg-card-header-left">
          <div className="pg-gateway-logo">
            <span className="pg-gateway-logo-icon">S</span>
            <span>{account.provider}</span>
          </div>

          <span className="pg-badge-active">
            <span className="pg-status-dot" />
            Active
          </span>

          {/* Payment Method Acceptance Chips */}
          <div className="pg-payment-chips">
            <span className="pg-chip">VISA</span>
            <span className="pg-chip">MC</span>
            <span className="pg-chip">AMEX</span>
            <span className="pg-chip">Apple Pay</span>
            <span className="pg-chip">Google Pay</span>
          </div>
        </div>

        <a
          href={account.dashboardUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pg-btn-secondary"
        >
          <span>Stripe Express Dashboard</span>
          <ExternalLink size={13} />
        </a>
      </div>

      <div className="pg-kv-grid">
        <div className="pg-kv-item">
          <span className="pg-kv-label">Connected Account ID</span>
          <div className="pg-kv-val">
            <code className="pg-code">{account.accountId}</code>
          </div>
        </div>

        <div className="pg-kv-item">
          <span className="pg-kv-label">Settlement Bank</span>
          <div className="pg-kv-val">
            <Landmark size={14} />
            <span>{account.bankName} •••• {account.accountLast4}</span>
          </div>
        </div>

        <div className="pg-kv-item">
          <span className="pg-kv-label">Payout Schedule</span>
          <div className="pg-kv-val">
            <span>{account.payoutSchedule}</span>
          </div>
        </div>

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
