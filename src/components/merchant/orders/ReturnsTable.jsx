"use client";
import React, { useState } from 'react';
import { Package, RotateCcw, AlertTriangle, Eye, ShieldCheck, Check } from 'lucide-react';

const RETURN_FILTERS = [
  { key: 'all', label: 'All Returns' },
  { key: 'requested', label: 'Action Required' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'inspected', label: 'Inspected' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'declined', label: 'Declined' }
];

export default function ReturnsTable({
  returns = [],
  onReviewReturn,
  onSelectOrder
}) {
  const [filter, setFilter] = useState('all');

  const filtered = returns.filter((r) => {
    if (filter === 'requested') return r.status === 'requested';
    if (filter === 'in_transit') return r.status === 'in_transit';
    if (filter === 'inspected') return r.status === 'inspected';
    if (filter === 'refunded') return r.status === 'refunded';
    if (filter === 'declined') return r.status === 'declined';
    return true;
  });

  const getReturnBadge = (status) => {
    switch (status) {
      case 'requested':
        return (
          <span className="badge-status badge-pending">
            <span className="status-dot" />
            Action Required
          </span>
        );
      case 'in_transit':
        return (
          <span className="badge-status badge-part-refunded">
            <span className="status-dot" />
            In Transit Back
          </span>
        );
      case 'inspected':
        return (
          <span className="badge-status badge-paid">
            <span className="status-dot" />
            Inspected & Restocked
          </span>
        );
      case 'refunded':
        return (
          <span className="badge-status badge-refunded">
            <span className="status-dot" />
            Refund Issued
          </span>
        );
      case 'declined':
        return (
          <span className="badge-status badge-on-hold">
            <span className="status-dot" />
            Declined
          </span>
        );
      default:
        return (
          <span className="badge-status badge-refunded">
            <span className="status-dot" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="orders-card">
      <div className="orders-card-header">
        <div className="orders-card-title">
          <RotateCcw size={16} />
          <span>Returns & Reverse Logistics (RMA)</span>
          <span className="orders-tab-count">{filtered.length}</span>
        </div>

        <div className="orders-filter-group">
          {RETURN_FILTERS.map((pill) => {
            const count = returns.filter((r) => {
              if (pill.key === 'requested') return r.status === 'requested';
              if (pill.key === 'in_transit') return r.status === 'in_transit';
              if (pill.key === 'inspected') return r.status === 'inspected';
              if (pill.key === 'refunded') return r.status === 'refunded';
              if (pill.key === 'declined') return r.status === 'declined';
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
              <th>RMA # & Order</th>
              <th>Requested Date</th>
              <th>Customer</th>
              <th>Returned Item</th>
              <th>Return Reason</th>
              <th>Refund Amount</th>
              <th>Return Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="orders-cust-email">
                  No return requests match the selected filter.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isActionNeeded = item.status === 'requested';
                const cleanProduct = (item.product || 'Garment').replace(/Atelier\s*/gi, 'Tailored ');

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="orders-cust-cell">
                        <span className="orders-id-link" onClick={() => onReviewReturn(item)}>
                          {item.id}
                        </span>
                        <span className="orders-date-text">For {item.orderId}</span>
                      </div>
                    </td>

                    <td>
                      <span className="orders-date-text">{item.date}</span>
                    </td>

                    <td>
                      <div className="orders-cust-cell">
                        <span className="orders-cust-name">{item.customer}</span>
                        <span className="orders-cust-email">{item.email}</span>
                      </div>
                    </td>

                    <td>
                      <div className="orders-item-wrap">
                        <div className="orders-item-thumb">
                          {item.image ? (
                            <img src={item.image} alt="" />
                          ) : (
                            <Package size={16} />
                          )}
                        </div>
                        <div className="orders-item-info">
                          <span className="orders-item-title" title={cleanProduct}>
                            {cleanProduct}
                          </span>
                          <span className="orders-item-sub">Size {item.size || 'M'}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="orders-cust-name">{item.reason}</span>
                    </td>

                    <td>
                      <span className="orders-amount-text">{item.amount}</span>
                    </td>

                    <td>{getReturnBadge(item.status)}</td>

                    <td>
                      <div className="orders-actions-row">
                        {isActionNeeded ? (
                          <button
                            type="button"
                            className="orders-btn-primary"
                            onClick={() => onReviewReturn(item)}
                          >
                            <span>Review</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="orders-btn-secondary"
                            onClick={() => onReviewReturn(item)}
                          >
                            <span>Details</span>
                          </button>
                        )}
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
