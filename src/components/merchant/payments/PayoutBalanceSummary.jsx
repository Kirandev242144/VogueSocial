"use client";
import React from 'react';

export default function PayoutBalanceSummary({
  availableAmount = 641.00,
  pendingAmount = 435.00,
  totalDisbursed = 2831.00,
  takeRatePct = 5.0,
  nextPayoutDate = 'May 2, 2026'
}) {
  return (
    <div className="pg-metrics-card">
      <div className="pg-metric-cell">
        <span className="pg-metric-label">Next Estimated Payout</span>
        <div className="pg-metric-value">${availableAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <span className="pg-metric-sub">Scheduled transfer on {nextPayoutDate}</span>
      </div>

      <div className="pg-metric-cell">
        <span className="pg-metric-label">Pending Delivery Clearance</span>
        <div className="pg-metric-value">${pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <span className="pg-metric-sub">Disburses 48h after courier delivery (POD)</span>
      </div>

      <div className="pg-metric-cell">
        <span className="pg-metric-label">Total Paid Out (Lifetime)</span>
        <div className="pg-metric-value">${totalDisbursed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <span className="pg-metric-sub">Net earnings deposited to bank account</span>
      </div>

      <div className="pg-metric-cell">
        <span className="pg-metric-label">Marketplace Commission</span>
        <div className="pg-metric-value">{takeRatePct.toFixed(1)}%</div>
        <span className="pg-metric-sub">VogueSocial take-rate deducted on checkout</span>
      </div>
    </div>
  );
}
