"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { adminService } from '@/services/adminService';
import {
  ShoppingBag, Lock, CheckCircle, XCircle, AlertTriangle,
  Search, Truck, Eye, RefreshCw, Building2, User,
  MapPin, CreditCard, ShieldCheck, Clock, ArrowRight,
  ExternalLink, DollarSign, Package
} from 'lucide-react';
import {
  AdminTopBar, AdminKpiCard, AdminStatusBadge, AdminModal
} from '@/components/admin';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalGMV: 0,
    escrowHeld: 0,
    escrowReleased: 0,
    escrowRefunded: 0,
    escrowDisputed: 0,
    platformFeesEarned: 0,
    totalCount: 0,
    heldCount: 0,
    releasedCount: 0,
    refundedCount: 0,
    disputedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders(filter, search);
      if (res && res.success) {
        setOrders(res.orders || []);
        if (res.summary) {
          setSummary(res.summary);
        }
      }
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filter, search]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setAdminNotes(order.admin_notes || '');
    setActionFeedback(null);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setAdminNotes('');
    setActionFeedback(null);
  };

  const handleReleaseEscrow = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    setActionFeedback(null);
    try {
      const res = await adminService.releaseOrderEscrow(selectedOrder.id, adminNotes);
      if (res && res.success) {
        setActionFeedback({
          type: 'success',
          message: `Escrow released successfully for order #${selectedOrder.id}. 95% net transferred to merchant.`
        });
        // Update local state
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, ...res.order } : o));
        setSelectedOrder(prev => ({ ...prev, ...res.order }));
        // Refresh summary
        adminService.getOrders(filter, search).then(r => {
          if (r?.summary) setSummary(r.summary);
        });
      } else {
        setActionFeedback({
          type: 'error',
          message: res?.error || 'Failed to release escrow funds.'
        });
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Network error executing escrow release.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundOrder = async () => {
    if (!selectedOrder) return;
    if (!window.confirm(`Are you sure you want to cancel order #${selectedOrder.id} and issue a 100% refund of $${selectedOrder.amount.toFixed(2)} to ${selectedOrder.customer?.full_name}?`)) {
      return;
    }
    setActionLoading(true);
    setActionFeedback(null);
    try {
      const res = await adminService.refundOrder(selectedOrder.id, adminNotes);
      if (res && res.success) {
        setActionFeedback({
          type: 'success',
          message: `Order #${selectedOrder.id} cancelled. $${selectedOrder.amount.toFixed(2)} refunded in full to customer.`
        });
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, ...res.order } : o));
        setSelectedOrder(prev => ({ ...prev, ...res.order }));
        adminService.getOrders(filter, search).then(r => {
          if (r?.summary) setSummary(r.summary);
        });
      } else {
        setActionFeedback({
          type: 'error',
          message: res?.error || 'Failed to refund order.'
        });
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        message: err.message || 'Network error processing refund.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const TABS = [
    { id: 'all', label: 'All Orders', count: summary.totalCount },
    { id: 'held', label: 'Held in Vault', count: summary.heldCount },
    { id: 'released', label: 'Escrow Released', count: summary.releasedCount },
    { id: 'refunded', label: 'Refunded', count: summary.refundedCount },
    { id: 'disputed', label: 'Disputed', count: summary.disputedCount },
  ];

  return (
    <>
      <AdminTopBar
        title="Orders & Escrow Vault"
        subtitle="Supervise platform sales, monitor escrow custody balances across merchant ateliers, and administer payouts or refunds"
        onRefresh={loadOrders}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* KPI Vault Metrics */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Total Platform GMV"
            value={`$${summary.totalGMV.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            sub={`${summary.totalCount} gross platform orders`}
            icon={CreditCard}
            trend="up"
            trendLabel="+14.2%"
            iconBg="rgba(56, 189, 248, 0.12)"
            iconColor="#38bdf8"
          />

          <AdminKpiCard
            label="Escrow Held in Vault"
            value={`$${summary.escrowHeld.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            sub={`${summary.heldCount} pending fulfillment & transit`}
            icon={Lock}
            trend="neutral"
            trendLabel="Protected"
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#f59e0b"
          />

          <AdminKpiCard
            label="Escrow Released to Ateliers"
            value={`$${summary.escrowReleased.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            sub={`${summary.releasedCount} orders settled (95% net merchant payout)`}
            icon={CheckCircle}
            trend="up"
            trendLabel="Disbursed"
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10b981"
          />

          <AdminKpiCard
            label="Platform Commission (5%)"
            value={`$${summary.platformFeesEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            sub="Protocol take-rate retained on settled sales"
            icon={ShieldCheck}
            trend="up"
            trendLabel="Retained"
            iconBg="rgba(129, 140, 248, 0.12)"
            iconColor="#818cf8"
          />
        </div>

        {/* Escrow Custody Explainer Banner */}
        <div
          className="admin-panel"
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(129, 140, 248, 0.05) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '320px', flex: 1 }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                flexShrink: 0
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--adm-text-main)', marginBottom: '3px' }}>
                Automated Tripartite Escrow Protocol
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', lineHeight: 1.45 }}>
                Buyer payments are locked in VogueSocial Escrow custody upon checkout. Funds release to the merchant (95%) with platform take-rate (5%) once delivery tracking verifies successful handover.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--adm-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              1. Vault Held
            </span>
            <ArrowRight size={12} color="var(--adm-text-sub)" />
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
              2. Tracked Transit
            </span>
            <ArrowRight size={12} color="var(--adm-text-sub)" />
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              3. 95% Merchant / 5% Vogue
            </span>
          </div>
        </div>

        {/* Main Orders Panel */}
        <div className="admin-panel">
          {/* Header & Filter Bar */}
          <div className="admin-filter-bar">
            <div className="admin-filter-tabs">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`admin-filter-tab ${filter === tab.id ? 'admin-filter-tab-active' : ''}`}
                >
                  {tab.label} ({tab.count ?? 0})
                </button>
              ))}
            </div>

            <div className="admin-search-box">
              <Search size={14} className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search order #, customer, brand, tracking..."
                className="admin-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <div className="admin-empty-state">
              <RefreshCw size={28} className="animate-spin admin-empty-icon" />
              <p>Loading escrow records from ledger...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="admin-empty-state">
              <ShoppingBag size={32} className="admin-empty-icon" />
              <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', marginBottom: '4px' }}>
                No matching orders found
              </div>
              <p style={{ margin: 0 }}>
                {search ? `No orders matched query "${search}"` : `No orders currently in "${filter}" status.`}
              </p>
              {(filter !== 'all' || search) && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ marginTop: '1rem' }}
                  onClick={() => { setFilter('all'); setSearch(''); }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order & Date</th>
                    <th>Customer</th>
                    <th>Merchant Atelier</th>
                    <th>Purchased Garments</th>
                    <th>Amount & Breakdown</th>
                    <th>Logistics & Carrier</th>
                    <th>Escrow Vault</th>
                    <th style={{ textAlign: 'right' }}>Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const firstItem = order.items?.[0];
                    const itemsCount = order.items?.length || 1;
                    const fee5 = (order.amount * 0.05).toFixed(2);
                    const net95 = (order.amount * 0.95).toFixed(2);

                    return (
                      <tr key={order.id}>
                        {/* Order & Date */}
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--adm-text-main)', fontSize: '0.84rem' }}>
                            #{order.id.replace(/^#/, '')}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>

                        {/* Customer */}
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                            {order.customer?.full_name || 'Buyer'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                            {order.customer?.email || 'shopper@voguesocial.com'}
                          </div>
                          {order.customer?.shipping_address?.city && (
                            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              <MapPin size={10} /> {order.customer.shipping_address.city}, {order.customer.shipping_address.country}
                            </div>
                          )}
                        </td>

                        {/* Merchant */}
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Building2 size={12} color="var(--adm-text-sub)" />
                            {order.vendor?.store_name || 'Studio Label Paris'}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', marginLeft: '16px' }}>
                            @{order.vendor?.store_handle || 'studiolabel'}
                          </div>
                        </td>

                        {/* Items */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {firstItem?.image && (
                              <img
                                src={firstItem.image}
                                alt={firstItem.name || 'Garment'}
                                style={{
                                  width: '32px',
                                  height: '42px',
                                  objectFit: 'cover',
                                  borderRadius: '4px',
                                  border: '1px solid var(--adm-border)',
                                  flexShrink: 0
                                }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.78rem', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {firstItem?.name || order.productName || 'Atelier Collection'}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                                {firstItem?.size ? `Size ${firstItem.size}` : ''}
                                {firstItem?.color ? ` • ${firstItem.color}` : ''}
                                {itemsCount > 1 ? ` (+${itemsCount - 1} more)` : ''}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Financial Amount */}
                        <td>
                          <div style={{ fontWeight: 800, color: 'var(--adm-text-main)', fontSize: '0.88rem' }}>
                            ${order.amount.toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                            <span style={{ color: '#10b981', fontWeight: 600 }}>${net95}</span> net to brand
                          </div>
                          <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)' }}>
                            <span style={{ color: '#818cf8' }}>${fee5}</span> 5% Vogue fee
                          </div>
                        </td>

                        {/* Fulfillment */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              <Truck size={10} /> {order.courier || 'Courier'}: {order.tracking_number}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                              No tracking yet
                            </div>
                          )}
                        </td>

                        {/* Escrow Status */}
                        <td>
                          <AdminStatusBadge status={order.escrow_status} />
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => handleOpenModal(order)}
                            title="Audit Escrow & Resolve Payout"
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
          )}
        </div>
      </div>

      {/* Order Audit & Escrow Settlement Modal */}
      {selectedOrder && (
        <AdminModal
          isOpen={Boolean(selectedOrder)}
          onClose={handleCloseModal}
          title={`Escrow Audit: Order #${selectedOrder.id.replace(/^#/, '')}`}
          maxWidth="640px"
          footer={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={handleCloseModal}
                disabled={actionLoading}
              >
                Close
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedOrder.escrow_status === 'held' && (
                  <>
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={handleRefundOrder}
                      disabled={actionLoading}
                    >
                      <XCircle size={13} />
                      {actionLoading ? 'Processing...' : 'Refund Buyer ($' + selectedOrder.amount.toFixed(2) + ')'}
                    </button>

                    <button
                      type="button"
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={handleReleaseEscrow}
                      disabled={actionLoading}
                    >
                      <CheckCircle size={13} />
                      {actionLoading ? 'Processing...' : 'Force Release Escrow (Transfer 95%)'}
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

          {/* Quick Header Summary */}
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
                Order Lifecycle
              </div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--adm-text-main)', marginTop: '2px', textTransform: 'capitalize' }}>
                {selectedOrder.status} Fulfillment
              </div>
            </div>
            <div>
              <AdminStatusBadge status={selectedOrder.escrow_status} />
            </div>
          </div>

          {/* 2-Column Parties Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Customer Box */}
            <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={12} /> Customer Information
              </div>
              <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
                {selectedOrder.customer?.full_name || 'Buyer'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
                {selectedOrder.customer?.email || 'buyer@voguesocial.com'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                {selectedOrder.customer?.shipping_address?.address || selectedOrder.shipping_address?.address || 'Shipping address on file'}
                <br />
                {selectedOrder.customer?.shipping_address?.city || selectedOrder.shipping_address?.city || ''} {selectedOrder.customer?.shipping_address?.country || selectedOrder.shipping_address?.country || ''}
              </div>
            </div>

            {/* Merchant Box */}
            <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={12} /> Merchant Atelier
              </div>
              <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
                {selectedOrder.vendor?.store_name || 'Studio Label Paris'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
                @{selectedOrder.vendor?.store_handle || 'studiolabel'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', marginTop: '4px' }}>
                Courier: <strong>{selectedOrder.courier || 'Standard Courier'}</strong>
                <br />
                Tracking: <strong>{selectedOrder.tracking_number || 'Pending Dispatch'}</strong>
              </div>
            </div>
          </div>

          {/* Garments Breakdown */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              Purchased Garments
            </div>
            <div style={{ border: '1px solid var(--adm-border)', borderRadius: '8px', overflow: 'hidden' }}>
              {(selectedOrder.items || [{ name: selectedOrder.productName || 'Garment', price: selectedOrder.amount, qty: 1 }]).map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderBottom: idx < (selectedOrder.items?.length || 1) - 1 ? '1px solid var(--adm-border)' : 'none',
                    background: 'var(--adm-panel)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '28px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
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
                    ${(item.price || selectedOrder.amount).toFixed(2)}
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
                <span style={{ fontWeight: 700, color: 'var(--adm-text-main)' }}>${selectedOrder.amount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--adm-text-muted)' }}>VogueSocial Protocol Fee (5% retained):</span>
                <span style={{ fontWeight: 700, color: '#818cf8' }}>-${(selectedOrder.amount * 0.05).toFixed(2)}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--adm-border)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--adm-text-main)', fontWeight: 600 }}>Merchant Net Balance (95% disbursement):</span>
                <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.88rem' }}>${(selectedOrder.amount * 0.95).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Admin Resolution Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
              Administrative Audit Log & Internal Notes
            </label>
            <textarea
              rows={2}
              className="admin-search-input"
              style={{ width: '100%', height: 'auto', padding: '0.65rem 0.85rem' }}
              placeholder="e.g. Verified delivery tracking signatures with DHL. Merchant payout cleared."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
            />
          </div>
        </AdminModal>
      )}
    </>
  );
}
