"use client";
import React, { useState } from 'react';
import {
  X, CheckCircle, XCircle, User, Building2,
  MapPin, CreditCard, Truck, AlertTriangle
} from 'lucide-react';
import { AdminModal, AdminStatusBadge } from '../index';

const FALLBACK_GARMENT_IMAGE = '/Shop_images/1/basic2-500x750.jpeg';

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

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Escrow Audit: Order #${cleanId}`}
      maxWidth="640px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={onClose}
            disabled={actionLoading}
          >
            Close
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                  {actionLoading ? 'Processing...' : `Force Release Escrow ($${net95})`}
                </button>
              </>
            )}
          </div>
        </div>
      }
    >
      {actionFeedback && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            background: actionFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: actionFeedback.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${actionFeedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          {actionFeedback.message}
        </div>
      )}

      {/* Status Summary Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          background: 'var(--adm-panel-hover)',
          border: '1px solid var(--adm-border)',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Order Fulfillment
          </div>
          <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--adm-text-main)', marginTop: '2px', textTransform: 'capitalize' }}>
            {order.status} Lifecycle
          </div>
        </div>
        <div>
          <AdminStatusBadge status={order.escrow_status} />
        </div>
      </div>

      {/* 2-Column Parties Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Customer Box */}
        <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={12} /> Customer Information
          </div>
          <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
            {order.customer?.full_name || 'Buyer'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
            {order.customer?.email || 'buyer@voguesocial.com'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', marginTop: '5px', lineHeight: 1.4 }}>
            {order.customer?.shipping_address?.address || order.shipping_address?.address || 'Shipping address on file'}
            <br />
            {order.customer?.shipping_address?.city || order.shipping_address?.city || ''} {order.customer?.shipping_address?.country || order.shipping_address?.country || ''}
          </div>
        </div>

        {/* Merchant Box */}
        <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Building2 size={12} /> Merchant Atelier
          </div>
          <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
            {order.vendor?.store_name || 'Studio Label Paris'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
            @{order.vendor?.store_handle || 'studiolabel'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', marginTop: '5px', lineHeight: 1.4 }}>
            Courier: <strong>{order.courier || 'Standard Logistics'}</strong>
            <br />
            Tracking: <strong>{order.tracking_number || 'Awaiting Dispatch'}</strong>
          </div>
        </div>
      </div>

      {/* Garments Breakdown */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
          Purchased Garments
        </div>
        <div style={{ border: '1px solid var(--adm-border)', borderRadius: '8px', overflow: 'hidden' }}>
          {(order.items || [{ name: order.productName || 'Garment', price: gross, qty: 1 }]).map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderBottom: idx < (order.items?.length || 1) - 1 ? '1px solid var(--adm-border)' : 'none',
                background: 'var(--adm-panel)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={item.image || FALLBACK_GARMENT_IMAGE}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_GARMENT_IMAGE;
                  }}
                  style={{ width: '30px', height: '38px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--adm-border)' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--adm-text-main)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                    {item.size ? `Size: ${item.size} • ` : ''}{item.color ? `Color: ${item.color} • ` : ''}Qty: {item.qty || 1}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--adm-text-main)' }}>
                ${Number(item.price || gross).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Escrow Ledger */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '8px',
          background: 'var(--adm-bg)',
          border: '1px solid var(--adm-border)',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <CreditCard size={13} /> Escrow Financial Ledger Breakdown
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--adm-text-muted)' }}>Customer Gross Payment (GMV):</span>
            <span style={{ fontWeight: 700, color: 'var(--adm-text-main)' }}>${gross.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--adm-text-muted)' }}>VogueSocial Protocol Fee (5% retained):</span>
            <span style={{ fontWeight: 700, color: '#818cf8' }}>-${fee5}</span>
          </div>
          <div style={{ height: '1px', background: 'var(--adm-border)', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--adm-text-main)', fontWeight: 600 }}>Merchant Net Balance (95% disbursement):</span>
            <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.88rem' }}>${net95}</span>
          </div>
        </div>

        {isReleased && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={13} /> Escrow funds released to merchant bank balance.
          </div>
        )}

        {isRefunded && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <XCircle size={13} /> Order cancelled. 100% of escrow returned to customer card.
          </div>
        )}

        {isDisputed && (
          <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '0.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={13} /> Active claim filed. Funds frozen pending arbitration.
          </div>
        )}
      </div>

      {/* Admin Audit Notes */}
      <div>
        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
          Administrative Audit Log & Compliance Notes
        </label>
        <textarea
          rows={2}
          className="admin-search-input"
          style={{ width: '100%', height: 'auto', padding: '0.65rem 0.85rem' }}
          placeholder="e.g. Courier confirmed delivery signatures. Escrow disbursement approved."
          value={adminNotes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>
    </AdminModal>
  );
}
