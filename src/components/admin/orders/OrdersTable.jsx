"use client";
import React, { useState } from 'react';
import {
  ShoppingBag, Truck, Eye, RefreshCw,
  Building2, MapPin
} from 'lucide-react';
import { AdminStatusBadge } from '../index';

const FALLBACK_GARMENT_IMAGE = '/Shop_images/1/basic2-500x750.jpeg';

function GarmentThumbnail({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_GARMENT_IMAGE);

  return (
    <div className="otb-thumb">
      <img
        src={imgSrc}
        alt={alt || 'Garment'}
        onError={() => setImgSrc(FALLBACK_GARMENT_IMAGE)}
        className="otb-thumb-img"
        loading="lazy"
      />
    </div>
  );
}

export default function OrdersTable({
  orders = [],
  loading = false,
  onAuditOrder,
  onResetFilters,
  search = '',
  filter = 'all'
}) {
  if (loading) {
    return (
      <div className="admin-empty-state otb-empty">
        <RefreshCw size={26} className="animate-spin admin-empty-icon" />
        <p className="otb-empty-title">Syncing orders ledger from database...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="admin-empty-state otb-empty">
        <ShoppingBag size={34} className="otb-empty-icon" />
        <div className="otb-empty-title">
          No matching orders found
        </div>
        <p className="otb-empty-desc">
          {search ? `No orders matched search query "${search}"` : `No orders found with status "${filter}".`}
        </p>
        {(filter !== 'all' || search) && (
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm otb-empty-btn"
            onClick={onResetFilters}
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="otb-wrap">
      <table className="admin-table otb-table">
        <thead>
          <tr>
            <th className="otb-th-order">Order & Date</th>
            <th className="otb-th-customer">Customer</th>
            <th className="otb-th-merchant">Merchant</th>
            <th className="otb-th-garments">Purchased Items</th>
            <th className="otb-th-amount">Amount & Payout</th>
            <th className="otb-th-fulfillment">Fulfillment</th>
            <th className="otb-th-status">Payout Status</th>
            <th className="otb-th-actions">Audit</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const firstItem = order.items?.[0] || {};
            const itemsCount = order.items?.length || 1;
            const gross = Number(order.amount || 0);
            const fee5 = (gross * 0.05).toFixed(2);
            const net95 = (gross * 0.95).toFixed(2);
            const cleanId = (order.id || '').replace(/^#/, '');

            return (
              <tr key={order.id}>
                {/* 1. Order ID & Date */}
                <td>
                  <span className="otb-order-id">#{cleanId}</span>
                  <span className="otb-order-date">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'Recent'}
                  </span>
                </td>

                {/* 2. Customer */}
                <td>
                  <span className="otb-customer-name">
                    {order.customer?.full_name || 'Buyer'}
                  </span>
                  <span className="otb-customer-email">
                    {order.customer?.email || 'shopper@voguesocial.com'}
                  </span>
                  {(order.customer?.shipping_address?.city || order.shipping_address?.city) && (
                    <span className="otb-customer-city">
                      <MapPin size={9} />
                      {order.customer?.shipping_address?.city || order.shipping_address?.city}, {order.customer?.shipping_address?.country || order.shipping_address?.country}
                    </span>
                  )}
                </td>

                {/* 3. Merchant */}
                <td>
                  <div className="otb-merchant-name">
                    <span>{order.vendor?.store_name || 'Studio Label Paris'}</span>
                  </div>
                  <span className="otb-merchant-handle">
                    @{order.vendor?.store_handle || 'studiolabel'}
                  </span>
                </td>

                {/* 4. Purchased Garments */}
                <td>
                  <div className="otb-items-cell">
                    <GarmentThumbnail
                      src={firstItem.image}
                      alt={firstItem.name || order.productName}
                    />
                    <div>
                      <span className="otb-item-name" title={firstItem.name || order.productName}>
                        {firstItem.name || order.productName || 'Curated Garment'}
                      </span>
                      <span className="otb-item-meta">
                        {firstItem.size ? `Size ${firstItem.size}` : ''}
                        {firstItem.color ? ` • ${firstItem.color}` : ''}
                        {itemsCount > 1 ? ` (+${itemsCount - 1} more)` : ''}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 5. Amount & Net Payout */}
                <td>
                  <span className="otb-amount-gross">${gross.toFixed(2)}</span>
                  <div className="otb-amount-net">
                    <span>${net95} net</span>
                    <span> • </span>
                    <span>${fee5} fee</span>
                  </div>
                </td>

                {/* 6. Fulfillment & Courier */}
                <td>
                  <span className="otb-courier">
                    {order.status}
                  </span>
                  {order.tracking_number ? (
                    <span className="otb-tracking-code">
                      <Truck size={10} /> {order.courier || 'Courier'}: {order.tracking_number}
                    </span>
                  ) : (
                    <span className="otb-item-meta">
                      Awaiting dispatch
                    </span>
                  )}
                </td>

                {/* 7. Payout Status Badge */}
                <td>
                  <AdminStatusBadge status={order.escrow_status} />
                </td>

                {/* 8. Audit Action */}
                <td className="otb-actions-cell">
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => onAuditOrder(order)}
                    title="Audit Order Settlement & Disburse Payout"
                  >
                    <Eye size={12} />
                    <span>Audit</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
