"use client";
import React from 'react';
import { CreditCard, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import { AdminKpiCard } from '../index';

export default function OrdersKpiGrid({ summary }) {
  const gmv = Number(summary?.totalGMV || 0);
  const held = Number(summary?.escrowHeld || 0);
  const released = Number(summary?.escrowReleased || 0);
  const fee = Number(summary?.platformFeesEarned || 0);

  return (
    <div className="admin-kpi-grid">
      <AdminKpiCard
        label="Total Platform GMV"
        value={`$${gmv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sub={`${summary?.totalCount || 0} gross platform orders`}
        icon={CreditCard}
        trend="up"
        trendLabel="+14.2%"
        iconBg="rgba(56, 189, 248, 0.12)"
        iconColor="#38bdf8"
      />

      <AdminKpiCard
        label="Funds in Settlement"
        value={`$${held.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sub={`${summary?.heldCount || 0} orders awaiting delivery`}
        icon={Lock}
        trend="neutral"
        trendLabel="Protected"
        iconBg="rgba(245, 158, 11, 0.12)"
        iconColor="#f59e0b"
      />

      <AdminKpiCard
        label="Disbursed to Merchants"
        value={`$${released.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sub={`${summary?.releasedCount || 0} orders settled via Stripe Connect`}
        icon={CheckCircle}
        trend="up"
        trendLabel="Disbursed"
        iconBg="rgba(16, 185, 129, 0.12)"
        iconColor="#10b981"
      />

      <AdminKpiCard
        label="Platform Commission Earned"
        value={`$${fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        sub="Marketplace take-rate retained on settlements"
        icon={ShieldCheck}
        trend="up"
        trendLabel="Retained"
        iconBg="rgba(129, 140, 248, 0.12)"
        iconColor="#818cf8"
      />
    </div>
  );
}
