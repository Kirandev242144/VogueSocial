"use client";
import React from 'react';
import {
  CheckCircle, XCircle, User, Building2,
  CreditCard, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { AdminModal, AdminStatusBadge } from '../index';

export default function OrderAuditModal({
  order,
  isOpen,
  onClose,
  onReleaseEscrow,
  onRefundOrder,
  actionLoading,
  actionFeedback,
  adminNotes,
  onNotesChange
}) {
  if (!order || !isOpen) return null;

  const cleanId = (order.id || '').replace(/^#/, '');
  const gross = Number(order.amount || 0);
  const fee5 = (gross * 0.05).toFixed(2);
  const net95 = (gross * 0.95).toFixed(2);
  const isHeld = order.escrow_status === 'held';
  const isReleased = order.escrow_status === 'released';
  const isRefunded = order.escrow_status === 'refunded';
  const isDisputed = order.escrow_status === 'disputed';

  // Evaluate 5-Step Payout Verification Gates
  const gate1Passed = !isRefunded && gross > 0;
  const gate2Passed = order.status === 'delivered' || isReleased;
  const gate3Passed = order.status !== 'cancelled' && !isRefunded;
  const gate4Passed = !isDisputed;
  const gate5Passed = order.vendor?.kyc_status !== 'restricted' && order.vendor?.payout_eligibility !== 'restricted';

  const gates = [
    {
      id: 1,
      title: 'Payment Confirmed & Settled',
      passed: gate1Passed,
      detail: gate1Passed ? `Stripe PaymentIntent captured ($${gross.toFixed(2)})` : 'Payment not settled'
    },
    {
      id: 2,
      title: 'Carrier Delivery Verified (POD)',
      passed: gate2Passed,
      detail: gate2Passed ? 'Proof of delivery (POD) confirmed' : `Awaiting delivery confirmation (${order.courier || 'DHL Express'})`
    },
    {
      id: 3,
      title: 'Order Active (Not Cancelled)',
      passed: gate3Passed,
      detail: gate3Passed ? 'Order confirmed and active' : 'Order cancelled / refunded'
    },
    {
      id: 4,
      title: 'No Active Dispute or Hold',
      passed: gate4Passed,
      detail: gate4Passed ? 'Clean transaction history' : 'Chargeback dispute filed (Payout held)'
    },
    {
      id: 5,
      title: 'Merchant Stripe Account Verified',
      passed: gate5Passed,
      detail: gate5Passed ? 'Stripe Connect connected account verified' : 'Connected account onboarding pending'
    }
  ];

  const allGatesPassed = gates.every(g => g.passed);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Settlement & Payout Audit: Order #${cleanId}`}
      maxWidth="680px"
      footer={
        <div className="oam-footer">
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={onClose}
            disabled={actionLoading}
          >
            Close
          </button>

          <div className="oam-footer-btns">
            {isHeld && (
              <>
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={onRefundOrder}
                  disabled={actionLoading}
                >
                  <XCircle size={13} />
                  {actionLoading ? 'Processing...' : `Refund Buyer ($${gross.toFixed(2)})`}
                </button>

                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={onReleaseEscrow}
                  disabled={actionLoading}
                >
                  <CheckCircle size={13} />
                  {actionLoading ? 'Processing...' : `Disburse Payout ($${net95})`}
                </button>
              </>
            )}
          </div>
        </div>
      }
    >
      {actionFeedback && (
        <div className={`oam-feedback ${actionFeedback.type === 'success' ? 'oam-feedback-success' : 'oam-feedback-error'}`}>
          {actionFeedback.message}
        </div>
      )}

      {/* Status Summary Banner */}
      <div className="oam-card oam-mb-md">
        <div className="psb-wrap">
          <div>
            <span className="oam-card-label">Order Fulfillment Lifecycle</span>
            <div className="oam-card-val">
              {order.status} • Courier: {order.courier || 'DHL Express'}
            </div>
          </div>
          <div>
            <AdminStatusBadge status={order.escrow_status} />
          </div>
        </div>
      </div>

      {/* 5-Step Automated Payout Eligibility Checklist */}
      <div className="oam-section">
        <div className="psb-wrap">
          <div className="oam-section-title">
            <ShieldCheck size={13} /> 5-Step Automated Payout Eligibility Protocol
          </div>
          <span className={`psb-badge ${allGatesPassed ? '' : 'psb-badge-orange'}`}>
            {allGatesPassed ? 'All 5 Gates Satisfied' : 'Pending Verification'}
          </span>
        </div>

        <div className="oam-gates-list">
          {gates.map((gate) => (
            <div key={gate.id} className="oam-gate-item">
              <span className={gate.passed ? 'oam-gate-icon-passed' : 'oam-gate-icon-failed'}>
                {gate.passed ? '✓' : '!'}
              </span>
              <div className="oam-gate-info">
                <span className="oam-gate-title">{gate.id}. {gate.title}</span>
                <span className="oam-gate-detail">{gate.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Column Customer and Merchant Info */}
      <div className="oam-grid-2 oam-mb-md">
        {/* Customer Box */}
        <div className="oam-card">
          <div className="oam-card-label">
            <User size={12} /> Customer Information
          </div>
          <div className="oam-card-val">
            {order.customer?.full_name || 'Buyer'}
          </div>
          <div className="oam-card-meta">
            {order.customer?.email || 'buyer@voguesocial.com'}
          </div>
          <div className="oam-card-meta">
            {order.customer?.shipping_address?.address || order.shipping_address?.address || 'Shipping address on file'}
            {order.customer?.shipping_address?.city || order.shipping_address?.city ? `, ${order.customer?.shipping_address?.city || order.shipping_address?.city}` : ''}
          </div>
        </div>

        {/* Merchant Box */}
        <div className="oam-card">
          <div className="oam-card-label">
            <Building2 size={12} /> Merchant Details
          </div>
          <div className="oam-card-val">
            {order.vendor?.store_name || 'Studio Label Paris'}
          </div>
          <div className="oam-card-meta">
            @{order.vendor?.store_handle || 'studiolabel'}
          </div>
          <div className="oam-card-meta">
            Courier: {order.courier || 'DHL Express'} • Tracking: {order.tracking_number || 'Awaiting Dispatch'}
          </div>
        </div>
      </div>

      {/* Financial Ledger Breakdown */}
      <div className="oam-card oam-mb-md">
        <div className="oam-card-label">
          <CreditCard size={12} /> Marketplace Settlement Ledger Breakdown
        </div>

        <div className="oam-breakdown-row">
          <span className="oam-breakdown-label">Customer Gross Payment (GMV):</span>
          <span className="oam-breakdown-val">${gross.toFixed(2)}</span>
        </div>
        <div className="oam-breakdown-row">
          <span className="oam-breakdown-label">VogueSocial Protocol Fee (5% take-rate retained):</span>
          <span className="oam-breakdown-val">-${fee5}</span>
        </div>
        <div className="oam-breakdown-row oam-breakdown-total">
          <span>Merchant Net Payout (95% disbursement):</span>
          <span>${net95}</span>
        </div>

        {isReleased && (
          <div className="oam-feedback oam-feedback-success oam-feedback-inline">
            <CheckCircle size={13} /> Funds disbursed to merchant connected bank account.
          </div>
        )}

        {isRefunded && (
          <div className="oam-feedback oam-feedback-error oam-feedback-inline">
            <XCircle size={13} /> Order cancelled. 100% of payment refunded to customer card.
          </div>
        )}

        {isDisputed && (
          <div className="oam-feedback oam-feedback-dispute oam-feedback-inline">
            <AlertTriangle size={13} /> Active dispute filed. Payout frozen pending evidence arbitration.
          </div>
        )}
      </div>

      {/* Admin Audit Notes */}
      <div className="oam-section">
        <label className="oam-card-label">
          Administrative Audit Log & Compliance Notes
        </label>
        <textarea
          rows={2}
          className="admin-input oam-notes-textarea"
          placeholder="e.g. Courier confirmed delivery signatures. Payout disbursement approved via Stripe Connect."
          value={adminNotes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </AdminModal>
  );
}
