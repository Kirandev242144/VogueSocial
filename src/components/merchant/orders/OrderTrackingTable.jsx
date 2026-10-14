"use client";
import React, { useState } from 'react';
import { Truck, ExternalLink, Eye, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { getCarrierTrackingUrl } from './carrierUtils';

const TRACKING_FILTERS = [
  { key: 'all', label: 'All Shipments' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered (POD)' },
  { key: 'exception', label: 'Exceptions' }
];

export default function OrderTrackingTable({
  shipments = [],
  onSelectOrder
}) {
  const [filter, setFilter] = useState('all');

  const filtered = shipments.filter((s) => {
    if (filter === 'in_transit') return s.status === 'in_transit';
    if (filter === 'out_for_delivery') return s.status === 'out_for_delivery';
    if (filter === 'delivered') return s.status === 'delivered';
    if (filter === 'exception') return s.status === 'exception';
    return true;
  });

  const getTrackingBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="badge-status badge-delivered">
            <span className="status-dot" />
            POD Verified
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="badge-status badge-part-refunded">
            <span className="status-dot" />
            Out for Delivery
          </span>
        );
      case 'exception':
        return (
          <span className="badge-status badge-on-hold">
            <span className="status-dot" />
            Carrier Exception
          </span>
        );
      case 'in_transit':
      default:
        return (
          <span className="badge-status badge-fulfilled">
            <span className="status-dot" />
            In Transit
          </span>
        );
    }
  };

  return (
    <div className="orders-card">
      <div className="orders-card-header">
        <div className="orders-card-title">
          <Truck size={16} />
          <span>Outbound Logistics & Tracking Milestones</span>
          <span className="orders-tab-count">{filtered.length}</span>
        </div>

        <div className="orders-filter-group">
          {TRACKING_FILTERS.map((pill) => {
            const count = shipments.filter((s) => {
              if (pill.key === 'in_transit') return s.status === 'in_transit';
              if (pill.key === 'out_for_delivery') return s.status === 'out_for_delivery';
              if (pill.key === 'delivered') return s.status === 'delivered';
              if (pill.key === 'exception') return s.status === 'exception';
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
              <th>Order #</th>
              <th>Carrier</th>
              <th>Tracking Number</th>
              <th>Customer & Destination</th>
              <th>Latest Courier Scan</th>
              <th>Estimated Delivery</th>
              <th>Escrow Settlement Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="orders-cust-email">
                  No shipments match the selected filter.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span
                      className="orders-id-link"
                      onClick={() => onSelectOrder(item)}
                      title="View Order Details"
                    >
                      {item.orderId || item.id}
                    </span>
                  </td>

                  <td>
                    <span className="orders-carrier-tag">
                      {item.carrier || 'DHL Express'}
                    </span>
                  </td>

                  <td>
                    <a
                      href={getCarrierTrackingUrl(item.carrier, item.trackingId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="orders-tracking-link"
                      title="Open courier tracking portal"
                    >
                      <span>{item.trackingId}</span>
                      <ExternalLink size={10} />
                    </a>
                  </td>

                  <td>
                    <div className="orders-cust-cell">
                      <span className="orders-cust-name">{item.customer}</span>
                      <span className="orders-cust-email">{item.destination}</span>
                    </div>
                  </td>

                  <td>
                    <div className="orders-cust-cell">
                      <span className="orders-item-title">{item.lastScan}</span>
                      <span className="orders-date-text">{item.scanTime}</span>
                    </div>
                  </td>

                  <td>
                    <span className="orders-date-text">{item.estimatedDelivery}</span>
                  </td>

                  <td>
                    <div className="orders-cust-cell">
                      {getTrackingBadge(item.status)}
                      <span className="orders-cust-email">
                        {item.escrowNote || 'Release 48h after POD'}
                      </span>
                    </div>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="orders-btn-secondary"
                      onClick={() => onSelectOrder(item)}
                      title="View order and tracking details"
                    >
                      <Eye size={12} />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
