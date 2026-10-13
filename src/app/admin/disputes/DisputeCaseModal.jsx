"use client";
import React, { useState } from 'react';
import {
  ExternalLink, CheckCircle, AlertTriangle, ShieldCheck,
  Truck, ArrowRight, User, Store, CreditCard, Clock, RotateCcw, X
} from 'lucide-react';
import { AdminModal, AdminStatusBadge } from '@/components/admin';

export default function DisputeCaseModal({
  dispute,
  isOpen,
  onClose,
  onResolve,
  loading = false
}) {
  if (!dispute || !isOpen) return null;

  const order = dispute.order || {};
  const customer = order.customer || {};
  const vendor = order.vendor || {};
  const payment = order.payment || {};
  const tracking = order.tracking || {};
  const items = order.items || [];
  const auditHistory = dispute.audit_history || [];

  const isResolved = dispute.status.startsWith('resolved');

  const [activeTab, setActiveTab] = useState('case');
  const [notes, setNotes] = useState(dispute.admin_notes || '');
  const [showPartialInput, setShowPartialInput] = useState(false);
  const [partialAmount, setPartialAmount] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const handleAction = async (action) => {
    if (action === 'partial_refund' && !showPartialInput) {
      setShowPartialInput(true);
      return;
    }
    if (action === 'partial_refund' && (!partialAmount || parseFloat(partialAmount) <= 0)) {
      alert('Please specify a valid partial refund amount.');
      return;
    }

    await onResolve(action, notes, {
      partialAmount: action === 'partial_refund' ? parseFloat(partialAmount).toFixed(2) : null,
      adminName: 'Platform Dispute Specialist'
    });
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dispute Case: ${dispute.id}`}
      maxWidth="780px"
      footer={
        <div className="dcm-footer">
          <div className="dcm-footer-id">
            <span>Order Ref:</span>
            <code className="dcm-code">#{order.id || dispute.order_id}</code>
            <span className="dcm-sep">•</span>
            <span>Amount:</span>
            <strong>${(order.amount || 0).toFixed(2)}</strong>
          </div>

          <div className="dcm-footer-actions">
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
          </div>
        </div>
      }
    >
      {/* Case Header Summary */}
      <div className="dcm-header">
        <div className="dcm-header-main">
          <div>
            <div className="dcm-title-row">
              <h3 className="dcm-title">{dispute.reason}</h3>
              <AdminStatusBadge status={dispute.status} />
            </div>
            <div className="dcm-meta">
              <span>Filed {new Date(dispute.created_at).toLocaleDateString()}</span>
              <span className="dcm-sep">•</span>
              <span>Buyer: {customer.full_name || 'Customer'}</span>
              <span className="dcm-sep">•</span>
              <span>Seller: {vendor.store_name || 'Merchant'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dcm-tab-nav">
        {[
          { id: 'case', label: 'Case & Evidence' },
          { id: 'order', label: 'Order & Payment' },
          { id: 'tracking', label: 'Carrier Proof' },
          { id: 'history', label: 'Audit History', count: auditHistory.length }
        ].map(t => (
          <button
            key={t.id}
            type="button"
            className={`dcm-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.label}</span>
            {t.count !== undefined && <span className="dcm-tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Tab 1: Case & Evidence */}
      {activeTab === 'case' && (
        <div className="dcm-tab-body">
          {/* Customer Complaint */}
          <div className="dcm-card">
            <div className="dcm-card-header">
              <span className="dcm-card-title">
                <User size={13} className="dcm-icon-subtle" /> Buyer Claim
              </span>
              <span className="dcm-meta-sm">
                {customer.email}
              </span>
            </div>
            <p className="dcm-desc">
              {dispute.description}
            </p>

            {/* Photographic Evidence */}
            {dispute.evidence_url && (
              <div className="dcm-evidence-wrap">
                <span className="dcm-label">Customer Photographic Evidence</span>
                <div
                  className="dcm-evidence-thumb"
                  onClick={() => setPreviewImage(dispute.evidence_url)}
                  title="Click to enlarge"
                >
                  <img src={dispute.evidence_url} alt="Dispute evidence" />
                  <span className="dcm-evidence-zoom-hint">Enlarge</span>
                </div>
              </div>
            )}
          </div>

          {/* Seller Response */}
          <div className="dcm-card">
            <div className="dcm-card-header">
              <span className="dcm-card-title">
                <Store size={13} className="dcm-icon-subtle" /> Seller Statement
              </span>
              <span className="dcm-meta-sm">
                @{vendor.store_handle} • {vendor.country || 'Global'}
              </span>
            </div>
            <p className="dcm-desc">
              {dispute.merchant_response || 'No merchant statement on file yet. Merchant notified to respond.'}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Order & Payment */}
      {activeTab === 'order' && (
        <div className="dcm-tab-body">
          {/* Order Items */}
          <div className="dcm-card">
            <div className="dcm-card-header">
              <span className="dcm-card-title">Purchased Items ({items.length})</span>
              <span className="dcm-meta-sm">Order #{order.id || dispute.order_id}</span>
            </div>

            <div className="dcm-items-list">
              {items.map((it, idx) => (
                <div key={idx} className="dcm-item-row">
                  {it.image && (
                    <img src={it.image} alt={it.name} className="dcm-item-img" />
                  )}
                  <div className="dcm-item-info">
                    <span className="dcm-item-name">{it.name}</span>
                    <span className="dcm-item-meta">
                      SKU: {it.sku || 'N/A'} • Size: {it.size} • Color: {it.color} • Qty: {it.qty}
                    </span>
                  </div>
                  <span className="dcm-item-price">${(it.price || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status Breakdown */}
          <div className="dcm-card">
            <div className="dcm-card-header">
              <span className="dcm-card-title">
                <CreditCard size={13} className="dcm-icon-subtle" /> Payment Status (Stripe Connect)
              </span>
              <span className="dcm-status-chip">
                {payment.status || 'captured_disputed'}
              </span>
            </div>

            <div className="dcm-grid-2">
              <div className="dcm-kv">
                <span className="dcm-kv-label">Payment Intent</span>
                <code className="dcm-code">{payment.payment_intent_id || 'pi_3M9xV2K9Qx01'}</code>
              </div>

              <div className="dcm-kv">
                <span className="dcm-kv-label">Payment Method</span>
                <span className="dcm-kv-val">{payment.payment_method || 'Card on file'}</span>
              </div>

              <div className="dcm-kv">
                <span className="dcm-kv-label">Order Total</span>
                <span className="dcm-kv-val font-semibold">${(order.amount || 0).toFixed(2)}</span>
              </div>

              <div className="dcm-kv">
                <span className="dcm-kv-label">Disbursement Gate</span>
                <span className="dcm-kv-val">
                  {isResolved ? 'Resolved' : 'Funds held pending claim resolution'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Carrier Proof */}
      {activeTab === 'tracking' && (
        <div className="dcm-tab-body">
          <div className="dcm-card">
            <div className="dcm-card-header">
              <span className="dcm-card-title">
                <Truck size={13} className="dcm-icon-subtle" /> Courier Tracking & Delivery Evidence
              </span>
              <span className="dcm-status-chip green">
                {tracking.verification_status === 'verified_carrier_pod' ? 'Verified POD' : (tracking.status || 'Carrier Scanned')}
              </span>
            </div>

            <div className="dcm-grid-2">
              <div className="dcm-kv">
                <span className="dcm-kv-label">Carrier & Tracking Number</span>
                <div className="dcm-val-row">
                  <span>{tracking.carrier || 'DHL Express'} • </span>
                  <code className="dcm-code">{tracking.tracking_number || 'DHL-84920194'}</code>
                </div>
              </div>

              <div className="dcm-kv">
                <span className="dcm-kv-label">Delivery Proof</span>
                <span className="dcm-kv-val">
                  {tracking.signed_by ? `Signed by ${tracking.signed_by}` : 'Pending carrier signature scan'}
                </span>
              </div>
            </div>

            {/* Checkpoint Timeline */}
            {tracking.events && tracking.events.length > 0 && (
              <div className="dcm-timeline-wrap">
                <span className="dcm-label">Carrier Checkpoint Events</span>
                <div className="dcm-timeline">
                  {tracking.events.map((ev, i) => (
                    <div key={i} className="dcm-timeline-row">
                      <span className="dcm-timeline-dot" />
                      <div className="dcm-timeline-info">
                        <span className="dcm-timeline-status">{ev.status}</span>
                        <span className="dcm-timeline-meta">{ev.location} • {new Date(ev.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Audit History */}
      {activeTab === 'history' && (
        <div className="dcm-tab-body">
          <div className="dcm-card">
            <div className="dcm-card-header">
              <span className="dcm-card-title">
                <Clock size={13} className="dcm-icon-subtle" /> Case Activity Log
              </span>
            </div>

            <div className="dcm-audit-list">
              {auditHistory.length === 0 ? (
                <div className="dcm-empty-sub">No recorded activity yet.</div>
              ) : (
                auditHistory.map((item, i) => (
                  <div key={i} className="dcm-audit-row">
                    <div className="dcm-audit-main">
                      <span className="dcm-audit-action">{item.action}</span>
                      <span className="dcm-audit-note">{item.note}</span>
                    </div>
                    <div className="dcm-audit-meta">
                      <span>{item.actor}</span>
                      <span className="dcm-sep">•</span>
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolution Section (Always Visible at bottom) */}
      <div className="dcm-resolution-section">
        <div className="dcm-resolution-header">
          <span className="dcm-resolution-title">Administrative Ruling & Decision</span>
        </div>

        <textarea
          className="admin-textarea dcm-ruling-textarea"
          placeholder="State factual basis for resolution (e.g. carrier POD verified intact delivery, or merchant acknowledged defect)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isResolved || loading}
        />

        {/* Partial Amount Input if selected */}
        {showPartialInput && !isResolved && (
          <div className="dcm-partial-row">
            <label className="dcm-field-label">Partial Refund Amount ($)</label>
            <input
              type="number"
              step="0.01"
              max={order.amount || 0}
              min="1"
              placeholder={`Max $${(order.amount || 0).toFixed(2)}`}
              className="admin-input dcm-partial-input"
              value={partialAmount}
              onChange={(e) => setPartialAmount(e.target.value)}
            />
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => { setShowPartialInput(false); setPartialAmount(''); }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Action Controls */}
        {!isResolved ? (
          <div className="dcm-action-btn-row">
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => handleAction('refund')}
              disabled={loading}
            >
              Refund Buyer (${(order.amount || 0).toFixed(2)})
            </button>

            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => handleAction('partial_refund')}
              disabled={loading}
            >
              {showPartialInput ? 'Execute Partial Refund' : 'Partial Refund'}
            </button>

            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={() => handleAction('reject')}
              disabled={loading}
              title="Reject claim and uphold seller delivery"
            >
              Reject Claim (Seller Upheld)
            </button>

            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => handleAction('escalate')}
              disabled={loading}
            >
              Escalate Case
            </button>
          </div>
        ) : (
          <div className="dcm-resolved-banner">
            <CheckCircle size={14} className="dcm-icon-success" />
            <span>This claim has been settled with status <strong>{dispute.status}</strong>.</span>
          </div>
        )}
      </div>

      {/* Lightbox Image Preview */}
      {previewImage && (
        <div className="dcm-lightbox-overlay" onClick={() => setPreviewImage(null)}>
          <div className="dcm-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dcm-lightbox-close"
              onClick={() => setPreviewImage(null)}
            >
              <X size={18} />
            </button>
            <img src={previewImage} alt="Evidence full resolution" className="dcm-lightbox-img" />
          </div>
        </div>
      )}
    </AdminModal>
  );
}
