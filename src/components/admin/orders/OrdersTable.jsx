"use client";
import React, { useState } from 'react';
import {
  ShoppingBag, Truck, Eye, RefreshCw,
  Building2, MapPin, Package
} from 'lucide-react';
import { AdminStatusBadge } from '../index';

const FALLBACK_GARMENT_IMAGE = '/Shop_images/1/basic2-500x750.jpeg';

function GarmentThumbnail({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_GARMENT_IMAGE);

  return (
    <div
      style={{
        width: '34px',
        height: '44px',
        borderRadius: '5px',
        overflow: 'hidden',
        border: '1px solid var(--adm-border)',
        background: 'var(--adm-panel-hover)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img
        src={imgSrc}
        alt={alt || 'Garment'}
        onError={() => setImgSrc(FALLBACK_GARMENT_IMAGE)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
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
      <div className="admin-empty-state" style={{ padding: '3.5rem 1rem' }}>
        <RefreshCw size={26} className="animate-spin admin-empty-icon" style={{ color: 'var(--adm-accent)' }} />
        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Syncing escrow records from vault ledger...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="admin-empty-state" style={{ padding: '3.5rem 1rem' }}>
        <ShoppingBag size={34} className="admin-empty-icon" style={{ color: 'var(--adm-text-sub)' }} />
        <div style={{ fontWeight: 700, color: 'var(--adm-text-main)', fontSize: '0.95rem', marginTop: '0.5rem', marginBottom: '3px' }}>
          No matching orders in vault
        </div>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--adm-text-sub)' }}>
          {search ? `No orders matched search query "${search}"` : `No orders found with status "${filter}".`}
        </p>
        {(filter !== 'all' || search) && (
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ marginTop: '1.25rem' }}
            onClick={onResetFilters}
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table" style={{ width: '100%', tableLayout: 'auto' }}>
        <thead>
          <tr>
            <th style={{ width: '130px' }}>Order & Date</th>
            <th style={{ width: '180px' }}>Customer</th>
            <th style={{ width: '160px' }}>Merchant Atelier</th>
            <th>Purchased Garments</th>
            <th style={{ width: '150px' }}>Ledger & Net</th>
            <th style={{ width: '140px' }}>Fulfillment</th>
            <th style={{ width: '130px' }}>Vault Escrow</th>
            <th style={{ width: '90px', textAlign: 'right' }}>Audit</th>
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
                  <div style={{ fontWeight: 700, color: 'var(--adm-text-main)', fontSize: '0.82rem', letterSpacing: '0.02em', fontFamily: 'monospace' }}>
                    #{cleanId}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'Recent'}
                  </div>
                </td>

                {/* 2. Customer */}
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.8rem' }}>
                    {order.customer?.full_name || 'Buyer'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                    {order.customer?.email || 'shopper@voguesocial.com'}
                  </div>
                  {(order.customer?.shipping_address?.city || order.shipping_address?.city) && (
                    <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                      <MapPin size={9} /> {order.customer?.shipping_address?.city || order.shipping_address?.city}, {order.customer?.shipping_address?.country || order.shipping_address?.country}
                    </div>
                  )}
                </td>

                {/* 3. Merchant Atelier */}
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem' }}>
                    <Building2 size={11} color="var(--adm-text-sub)" />
                    <span>{order.vendor?.store_name || 'Studio Label Paris'}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginLeft: '16px' }}>
                    @{order.vendor?.store_handle || 'studiolabel'}
                  </div>
                </td>

                {/* 4. Purchased Garments */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <GarmentThumbnail
                      src={firstItem.image}
                      alt={firstItem.name || order.productName}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--adm-text-main)',
                          fontSize: '0.78rem',
                          maxWidth: '220px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={firstItem.name || order.productName}
                      >
                        {firstItem.name || order.productName || 'Curated Atelier Piece'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '1px' }}>
                        {firstItem.size ? `Size ${firstItem.size}` : ''}
                        {firstItem.color ? ` • ${firstItem.color}` : ''}
                        {itemsCount > 1 ? ` (+${itemsCount - 1} more)` : ''}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 5. Amount & Escrow Ledger */}
                <td>
                  <div style={{ fontWeight: 800, color: 'var(--adm-text-main)', fontSize: '0.88rem' }}>
                    ${gross.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>${net95}</span> net
                    <span style={{ color: 'var(--adm-border)' }}>•</span>
                    <span style={{ color: 'var(--adm-text-muted)' }}>${fee5} fee</span>
                  </div>
                </td>

                {/* 6. Fulfillment & Courier */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        color: order.status === 'delivered' ? '#10b981' : (order.status === 'shipped' ? '#38bdf8' : (order.status === 'cancelled' ? '#ef4444' : '#f59e0b'))
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  {order.tracking_number ? (
                    <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                      <Truck size={10} /> {order.courier || 'Courier'}: {order.tracking_number}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                      Awaiting dispatch
                    </div>
                  )}
                </td>

                {/* 7. Vault Escrow Badge */}
                <td>
                  <AdminStatusBadge status={order.escrow_status} />
                </td>

                {/* 8. Audit Action */}
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => onAuditOrder(order)}
                    title="Audit Escrow Ledger & Disburse Funds"
                    style={{ padding: '0.3rem 0.65rem' }}
                  >
                    <Eye size={12} /> Audit
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
