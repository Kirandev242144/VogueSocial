"use client";
import React, { useState } from 'react';
import {
  PaymentGatewayCard,
  PayoutBalanceSummary,
  PayoutsHistoryTable,
  PaymentSecurityCard
} from '@/components/merchant/payments';
import './PaymentGateway.css';

const INITIAL_TRANSFERS = [
  {
    id: 'po_1Ox8A1K92',
    orderRef: 'ORD-8239',
    gross: 420.00,
    fee: 21.00,
    net: 399.00,
    date: 'Apr 28, 2026',
    ordersCount: 1,
    bank: 'JPMorgan Chase •••• 4192',
    status: 'paid'
  },
  {
    id: 'po_1Ox7B4L03',
    orderRef: 'ORD-8236',
    gross: 280.00,
    fee: 14.00,
    net: 266.00,
    date: 'Apr 24, 2026',
    ordersCount: 1,
    bank: 'JPMorgan Chase •••• 4192',
    status: 'paid'
  },
  {
    id: 'po_1Ox6C8M19',
    orderRef: 'ORD-8230',
    gross: 890.00,
    fee: 44.50,
    net: 845.50,
    date: 'Apr 18, 2026',
    ordersCount: 2,
    bank: 'JPMorgan Chase •••• 4192',
    status: 'paid'
  },
  {
    id: 'po_1Ox5D2N88',
    orderRef: 'ORD-8241',
    gross: 590.00,
    fee: 29.50,
    net: 560.50,
    date: 'Est. May 02, 2026',
    ordersCount: 1,
    bank: 'JPMorgan Chase •••• 4192',
    status: 'in_transit'
  }
];

export default function PaymentGatewaysPage() {
  const [transfers] = useState(INITIAL_TRANSFERS);

  const accountInfo = {
    provider: 'Stripe Connect',
    accountId: 'acct_1Ox7Y8K92A8291',
    status: 'active',
    bankName: 'JPMorgan Chase',
    accountLast4: '4192',
    currency: 'USD',
    payoutSchedule: 'Automatic daily (48h post-delivery)',
    dashboardUrl: 'https://connect.stripe.com/express_login'
  };

  return (
    <div className="pg-shell">
      <div className="pg-container">
        {/* Page Header */}
        <div className="pg-header">
          <h1 className="pg-title">Payment Gateways</h1>
          <p className="pg-subtitle">
            Manage your payment gateways, Stripe Connect settlement account, and review bank payouts.
          </p>
        </div>

        {/* 1. Primary Payment Gateway Card (Shopify Polaris style) */}
        <PaymentGatewayCard account={accountInfo} />

        {/* 2. Polaris Financial Metrics Summary */}
        <PayoutBalanceSummary
          availableAmount={641.00}
          pendingAmount={435.00}
          totalDisbursed={2831.00}
          takeRatePct={5.0}
          nextPayoutDate="May 2, 2026"
        />

        {/* 3. Payouts & Transfers Ledger Table */}
        <PayoutsHistoryTable transfers={transfers} />

        {/* 4. Payment Security & Fraud Protection */}
        <PaymentSecurityCard />
      </div>
    </div>
  );
}
