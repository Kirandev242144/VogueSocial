"use client";
import React, { useState, useEffect } from 'react';
import {
  PaymentGatewayCard,
  PayoutBalanceSummary,
  PayoutsHistoryTable,
  PaymentSecurityCard,
  EditBankModal,
  ConnectStripeModal
} from '@/components/merchant/payments';
import { CheckCircle2, X } from 'lucide-react';
import './PaymentGateway.css';

const STORAGE_KEY = 'vogue_merchant_payout_settings';

const DEFAULT_ACCOUNT = {
  provider: 'Stripe Connect',
  accountId: 'acct_1Ox7Y8K92A8291',
  status: 'active',
  bankName: 'JPMorgan Chase',
  accountHolder: 'Studio Label Paris LLC',
  accountLast4: '4192',
  routingNumber: '021000021',
  currency: 'USD',
  payoutSchedule: 'Automatic daily (48h post-delivery)',
  dashboardUrl: 'https://connect.stripe.com/express_login'
};

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
  const [account, setAccount] = useState(DEFAULT_ACCOUNT);
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
  const [isEditBankOpen, setIsEditBankOpen] = useState(false);
  const [isConnectStripeOpen, setIsConnectStripeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Hydrate from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAccount(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error('Failed to load payout settings from localStorage', e);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const handleSaveBank = (newBankData) => {
    const updated = {
      ...account,
      bankName: newBankData.bankName,
      accountHolder: newBankData.accountHolder,
      routingNumber: newBankData.routingNumber,
      accountLast4: newBankData.accountLast4,
      currency: newBankData.currency
    };
    setAccount(updated);

    // Update transfers bank column to match new bank
    setTransfers(prev => prev.map(t => ({
      ...t,
      bank: `${newBankData.bankName} •••• ${newBankData.accountLast4}`
    })));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }

    showToast(`Settlement bank account updated to ${newBankData.bankName} •••• ${newBankData.accountLast4}`);
  };

  const handleSaveStripe = (newStripeData) => {
    const updated = {
      ...account,
      accountId: newStripeData.accountId,
      payoutSchedule: newStripeData.payoutSchedule,
      status: newStripeData.status
    };
    setAccount(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }

    showToast(`Stripe Connect configuration updated (${newStripeData.accountId})`);
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

        {/* Success Toast */}
        {toastMessage && (
          <div className="pg-toast-success">
            <div className="pg-toast-left">
              <CheckCircle2 size={16} />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              className="pg-modal-close"
              onClick={() => setToastMessage('')}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* 1. Primary Payment Gateway Card (Shopify Polaris style) */}
        <PaymentGatewayCard
          account={account}
          onOpenEditBank={() => setIsEditBankOpen(true)}
          onOpenConnectStripe={() => setIsConnectStripeOpen(true)}
        />

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

      {/* 5. Modals for Bank & Stripe Entry */}
      <EditBankModal
        isOpen={isEditBankOpen}
        onClose={() => setIsEditBankOpen(false)}
        currentBank={account}
        onSaveBank={handleSaveBank}
      />

      <ConnectStripeModal
        isOpen={isConnectStripeOpen}
        onClose={() => setIsConnectStripeOpen(false)}
        currentAccount={account}
        onSaveStripe={handleSaveStripe}
      />
    </div>
  );
}
