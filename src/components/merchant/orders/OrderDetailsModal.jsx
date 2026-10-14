"use client";
import React from 'react';
import { X, Package, Truck, CheckCircle2, CreditCard, Printer } from 'lucide-react';

export default function OrderDetailsModal({
  isOpen,
  order,
  onClose,
  onOpenFulfill
}) {
  if (!isOpen || !order) return null;

  const cleanProduct = (order.product || 'Garment').replace(/Atelier\s*/gi, 'Tailored ');
  const isUnfulfilled = order.fulfillment_status === 'unfulfilled';

  return (
    <div className="orders-modal-overlay" onClick={onClose}>
      <div className="orders-modal orders-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="orders-modal-header">
          <div>
            <h3 className="orders-modal-title">Order {order.id}</h3>
            <span className="orders-date-text">Placed on {order.date} · via {order.channel || 'Online Store'}</span>
          </div>
          <button
            type="button"
            className="orders-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="orders-modal-body">
          {/* Top Status Overview */}
          <div className="orders-form-row">
            <div className="orders-kpi-card">
              <span className="orders-kpi-label">Payment Status</span>
              <span className="orders-kpi-value">{order.payment_status === 'paid' ? 'Paid' : order.payment_status || 'Paid'}</span>
              <span className="orders-kpi-meta">Processed via Stripe Express</span>
            </div>

            <div className="orders-kpi-card">
              <span className="orders-kpi-label">Fulfillment Status</span>
              <span className="orders-kpi-value">
                {order.fulfillment_status === 'fulfilled' ? 'Fulfilled' : order.fulfillment_status === 'delivered' ? 'Delivered' : 'Unfulfilled'}
              </span>
              <span className="orders-kpi-meta">
                {order.trackingId ? `Carrier: ${order.trackingId}` : 'Requires merchant dispatch'}
              </span>
            </div>
          </div>

          {/* Line Item Breakdown */}
          <div className="orders-detail-section">
            <div className="orders-detail-heading">Purchased Garments</div>
            <div className="orders-detail-row">
              <div className="orders-item-wrap">
                <div className="orders-item-thumb">
                  {order.image ? (
                    <img src={order.image} alt="" />
                  ) : (
                    <Package size={16} />
                  )}
                </div>
                <div className="orders-item-info">
                  <span className="orders-item-title">{cleanProduct}</span>
                  <span className="orders-item-sub">
                    {order.qty}× · Size {order.size || 'M'} · SKU: {order.sku || order.id?.replace('#', 'VS-')}
                  </span>
                </div>
              </div>
              <span className="orders-amount-text">{order.amount}</span>
            </div>
          </div>

          {/* Customer & Shipping Destination */}
          <div className="orders-form-row">
            <div className="orders-detail-section">
              <div className="orders-detail-heading">Customer Information</div>
              <div className="orders-cust-cell">
                <span className="orders-cust-name">{order.customer}</span>
                <span className="orders-cust-email">{order.email}</span>
                <span className="orders-date-text">Verified VogueSocial Member</span>
              </div>
            </div>

            <div className="orders-detail-section">
              <div className="orders-detail-heading">Shipping Address</div>
              <div className="orders-cust-cell">
                <span className="orders-cust-name">{order.customer}</span>
                <span className="orders-cust-email">{order.address || '22 Commercial Blvd, Suite 400'}</span>
                <span className="orders-date-text">Standard Insured Courier Delivery</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Timeline */}
          <div className="orders-detail-section">
            <div className="orders-detail-heading">Order Timeline</div>
            <div className="orders-timeline">
              <div className="orders-timeline-item">
                <div className="orders-timeline-dot" />
                <span className="orders-timeline-title">Order placed by {order.customer}</span>
                <span className="orders-timeline-time">{order.date}</span>
              </div>

              <div className="orders-timeline-item">
                <div className="orders-timeline-dot" />
                <span className="orders-timeline-title">Payment authorized and captured via Stripe</span>
                <span className="orders-timeline-time">{order.amount} USD secured in escrow</span>
              </div>

              {order.trackingId && (
                <div className="orders-timeline-item">
                  <div className="orders-timeline-dot" />
                  <span className="orders-timeline-title">Dispatched with tracking ({order.trackingId})</span>
                  <span className="orders-timeline-time">Carrier linehaul sync active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="orders-modal-footer">
          {isUnfulfilled && (
            <button
              type="button"
              className="orders-btn-primary"
              onClick={() => {
                onClose();
                onOpenFulfill(order);
              }}
            >
              <Truck size={13} />
              <span>Fulfill Order Now</span>
            </button>
          )}

          <button
            type="button"
            className="orders-btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
