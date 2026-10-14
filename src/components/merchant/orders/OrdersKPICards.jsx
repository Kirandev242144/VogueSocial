"use client";
import React from 'react';

export default function OrdersKPICards({
  activeView = 'all',
  orders = [],
  returns = [],
  shipments = []
}) {
  if (activeView === 'returns') {
    const requested = returns.filter((r) => r.status === 'requested').length;
    const inTransit = returns.filter((r) => r.status === 'in_transit').length;
    const inspected = returns.filter((r) => r.status === 'inspected' || r.status === 'refunded').length;
    const totalRefunded = returns
      .filter((r) => r.status === 'refunded')
      .reduce((sum, r) => sum + (parseFloat(r.amount?.replace(/[^0-9.]/g, '') || 0)), 0);

    return (
      <div className="orders-kpi-grid">
        <div className="orders-kpi-card">
          <div className="orders-kpi-label">Return Requests</div>
          <div className="orders-kpi-value">{requested}</div>
          <div className="orders-kpi-meta orders-kpi-meta-alert">Awaiting merchant action</div>
        </div>

        <div className="orders-kpi-card">
          <div className="orders-kpi-label">In Transit Back</div>
          <div className="orders-kpi-value">{inTransit}</div>
          <div className="orders-kpi-meta">En route to warehouse</div>
        </div>

        <div className="orders-kpi-card">
          <div className="orders-kpi-label">Inspected & Restocked</div>
          <div className="orders-kpi-value">{inspected}</div>
          <div className="orders-kpi-meta orders-kpi-meta-good">Inventory restored</div>
        </div>

        <div className="orders-kpi-card">
          <div className="orders-kpi-label">Total Refunded</div>
          <div className="orders-kpi-value">${totalRefunded.toFixed(2)}</div>
          <div className="orders-kpi-meta">Escrow adjustments</div>
        </div>
      </div>
    );
  }

  if (activeView === 'tracking') {
    const inTransit = shipments.filter((s) => s.status === 'in_transit').length;
    const outForDelivery = shipments.filter((s) => s.status === 'out_for_delivery').length;
    const delivered = shipments.filter((s) => s.status === 'delivered').length;
    const exceptions = shipments.filter((s) => s.status === 'exception').length;

    return (
      <div className="orders-kpi-grid">
        <div className="orders-kpi-card">
          <div className="orders-kpi-label">Active In-Transit</div>
          <div className="orders-kpi-value">{inTransit}</div>
          <div className="orders-kpi-meta">Carrier linehaul scans</div>
        </div>

        <div className="orders-kpi-card">
          <div className="orders-kpi-label">Out for Delivery</div>
          <div className="orders-kpi-value">{outForDelivery}</div>
          <div className="orders-kpi-meta orders-kpi-meta-good">Expected today</div>
        </div>

        <div className="orders-kpi-card">
          <div className="orders-kpi-label">Delivered (POD Verified)</div>
          <div className="orders-kpi-value">{delivered}</div>
          <div className="orders-kpi-meta orders-kpi-meta-good">Escrow release eligible</div>
        </div>

        <div className="orders-kpi-card">
          <div className="orders-kpi-label">Delivery Exceptions</div>
          <div className="orders-kpi-value">{exceptions}</div>
          <div className="orders-kpi-meta orders-kpi-meta-alert">Requires customer contact</div>
        </div>
      </div>
    );
  }

  // Default: All Orders View
  const unfulfilled = orders.filter((o) => o.fulfillment_status === 'unfulfilled').length;
  const totalRev = orders.reduce((sum, o) => sum + (parseFloat(o.amount?.replace(/[^0-9.]/g, '') || 0)), 0);
  const avgOrder = orders.length > 0 ? (totalRev / orders.length) : 0;

  return (
    <div className="orders-kpi-grid">
      <div className="orders-kpi-card">
        <div className="orders-kpi-label">Total Orders</div>
        <div className="orders-kpi-value">{orders.length}</div>
        <div className="orders-kpi-meta orders-kpi-meta-good">+12% vs last month</div>
      </div>

      <div className="orders-kpi-card">
        <div className="orders-kpi-label">Unfulfilled Orders</div>
        <div className="orders-kpi-value">{unfulfilled}</div>
        <div className="orders-kpi-meta orders-kpi-meta-alert">Ready to pack & dispatch</div>
      </div>

      <div className="orders-kpi-card">
        <div className="orders-kpi-label">Gross Order Value</div>
        <div className="orders-kpi-value">${totalRev.toFixed(2)}</div>
        <div className="orders-kpi-meta">Settlement via Stripe</div>
      </div>

      <div className="orders-kpi-card">
        <div className="orders-kpi-label">Average Order Value</div>
        <div className="orders-kpi-value">${avgOrder.toFixed(2)}</div>
        <div className="orders-kpi-meta">Units per order: 1.4</div>
      </div>
    </div>
  );
}
