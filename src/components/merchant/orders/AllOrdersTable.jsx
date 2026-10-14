"use client";
import React, { useState } from 'react';
import { Package, Truck, ExternalLink, Eye, CheckCircle2 } from 'lucide-react';

const FILTER_PILLS = [
  { key: 'all', label: 'All' },
  { key: 'unfulfilled', label: 'Unfulfilled' },
  { key: 'unpaid', label: 'Unpaid' },
  { key: 'fulfilled', label: 'Fulfilled' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' }
];

export default function AllOrdersTable({
  orders = [],
  onSelectOrder,
  onOpenFulfill
}) {
  const [filter, setFilter] = useState('all');

  const filtered = orders.filter((o) => {
    if (filter === 'unfulfilled') return o.fulfillment_status === 'unfulfilled';
    if (filter === 'unpaid') return o.payment_status === 'pending';
    if (filter === 'fulfilled') return o.fulfillment_status === 'fulfilled';
    if (filter === 'delivered') return o.fulfillment_status === 'delivered';
    if (filter === 'cancelled') return o.status === 'cancelled' || o.fulfillment_status === 'cancelled';
    return true;
  });

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="badge-status badge-paid">
            <span className="status-dot" />
            Paid
          </span>
        );
      case 'refunded':
        return (
          <span className="badge-status badge-refunded">
            <span className="status-dot" />
            Refunded
          </span>
        );
      case 'partially_refunded':
        return (
          <span className="badge-status badge-part-refunded">
            <span className="status-dot" />
            Partially Refunded
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="badge-status badge-pending">
            <span className="status-dot" />
            Pending Payment
          </span>
        );
    }
  };

  const getFulfillmentBadge = (status) => {
    switch (status) {
      case 'fulfilled':
        return (
          <span className="badge-status badge-fulfilled">
            <span className="status-dot" />
            Fulfilled
          </span>
        );
      case 'delivered':
        return (
          <span className="badge-status badge-delivered">
            <span className="status-dot" />
            Delivered
          </span>
        );
      case 'on_hold':
        return (
          <span className="badge-status badge-on-hold">
            <span className="status-dot" />
            On Hold
          </span>
        );
      case 'cancelled':
        return (
          <span className="badge-status badge-cancelled">
            <span className="status-dot" />
            Cancelled
          </span>
        );
      case 'unfulfilled':
      default:
        return (
          <span className="badge-status badge-unfulfilled">
            <span className="status-dot" />
            Unfulfilled
          </span>
        );
    }
  };

  return (
    <div className="orders-card">
      <div className="orders-card-header">
        <div className="orders-card-title">
          <span>Customer Orders</span>
          <span className="orders-tab-count">{filtered.length}</span>
        </div>

        <div className="orders-filter-group">
          {FILTER_PILLS.map((pill) => {
            const count = orders.filter((o) => {
              if (pill.key === 'unfulfilled') return o.fulfillment_status === 'unfulfilled';
              if (pill.key === 'unpaid') return o.payment_status === 'pending';
              if (pill.key === 'fulfilled') return o.fulfillment_status === 'fulfilled';
              if (pill.key === 'delivered') return o.fulfillment_status === 'delivered';
              if (pill.key === 'cancelled') return o.status === 'cancelled' || o.fulfillment_status === 'cancelled';
              return true;
            }).length;

            return (
              <button
                key={pill.key}
                type="button"
                className={`orders-filter-pill ${filter === pill.key ? 'orders-filter-pill-active' : ''}`}
                onClick={() => setFilter(pill.key)}
              >
                <span>{pill.label}</span>
                <span>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="orders-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items & Garment</th>
              <th>Channel</th>
              <th>Payment</th>
              <th>Fulfillment</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="orders-cust-email">
                  No orders match the selected filter.
                </td>
              </tr>
            ) : (
              filtered.map((order) => {
                const isUnfulfilled = order.fulfillment_status === 'unfulfilled';
                const cleanProduct = (order.product || 'Garment').replace(/Atelier\s*/gi, 'Tailored ');

                return (
                  <tr key={order.id}>
                    <td>
                      <span
                        className="orders-id-link"
                        onClick={() => onSelectOrder(order)}
                        title="View Order Details"
                      >
                        {order.id}
                      </span>
                    </td>

                    <td>
                      <span className="orders-date-text">{order.date}</span>
                    </td>

                    <td>
                      <div className="orders-cust-cell">
                        <span className="orders-cust-name">{order.customer}</span>
                        <span className="orders-cust-email">{order.email}</span>
                      </div>
                    </td>

                    <td>
                      <div className="orders-item-wrap">
                        <div className="orders-item-thumb">
                          {order.image ? (
                            <img src={order.image} alt="" />
                          ) : (
                            <Package size={16} />
                          )}
                        </div>
                        <div className="orders-item-info">
                          <span className="orders-item-title" title={cleanProduct}>
                            {cleanProduct}
                          </span>
                          <span className="orders-item-sub">
                            {order.qty}× · Size {order.size || 'M'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="orders-channel-badge">
                        {order.channel || 'Online Store'}
                      </span>
                    </td>

                    <td>{getPaymentBadge(order.payment_status)}</td>

                    <td>{getFulfillmentBadge(order.fulfillment_status)}</td>

                    <td>
                      <span className="orders-amount-text">{order.amount}</span>
                    </td>

                    <td>
                      <div className="orders-actions-row">
                        {isUnfulfilled && (
                          <button
                            type="button"
                            className="orders-btn-primary"
                            onClick={() => onOpenFulfill(order)}
                            title="Fulfill and dispatch item"
                          >
                            <Truck size={12} />
                            <span>Fulfill</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="orders-btn-secondary"
                          onClick={() => onSelectOrder(order)}
                          title="View order details"
                        >
                          <Eye size={12} />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
