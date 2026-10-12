"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { AdminTopBar } from '@/components/admin';
import {
  OrdersKpiGrid,
  EscrowProtocolBanner,
  OrdersFilterBar,
  OrdersTable,
  OrderAuditModal
} from '@/components/admin/orders';

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
          message: `Escrow released for order #${selectedOrder.id}. 95% net transferred to merchant.`
        });
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, ...res.order } : o));
        setSelectedOrder(prev => ({ ...prev, ...res.order }));
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
        message: err.message || 'Error executing escrow release.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefundOrder = async () => {
    if (!selectedOrder) return;
    if (!window.confirm(`Cancel order #${selectedOrder.id} and issue full refund of $${Number(selectedOrder.amount).toFixed(2)} to ${selectedOrder.customer?.full_name}?`)) {
      return;
    }
    setActionLoading(true);
    setActionFeedback(null);
    try {
      const res = await adminService.refundOrder(selectedOrder.id, adminNotes);
      if (res && res.success) {
        setActionFeedback({
          type: 'success',
          message: `Order #${selectedOrder.id} cancelled. $${Number(selectedOrder.amount).toFixed(2)} refunded in full.`
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
        message: err.message || 'Error processing refund.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
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
        {/* KPI Vault Metrics Grid */}
        <OrdersKpiGrid summary={summary} />

        {/* Protocol Custody Explainer Infobar */}
        <EscrowProtocolBanner />

        {/* Main Orders & Escrow Panel */}
        <div className="admin-panel">
          <OrdersFilterBar
            filter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            tabs={tabs}
          />

          <OrdersTable
            orders={orders}
            loading={loading}
            onAuditOrder={handleOpenModal}
            onResetFilters={() => { setFilter('all'); setSearch(''); }}
            search={search}
            filter={filter}
          />
        </div>
      </div>

      {/* Order Audit & Settlement Modal */}
      <OrderAuditModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={handleCloseModal}
        onReleaseEscrow={handleReleaseEscrow}
        onRefundOrder={handleRefundOrder}
        actionLoading={actionLoading}
        actionFeedback={actionFeedback}
        adminNotes={adminNotes}
        onNotesChange={setAdminNotes}
      />
    </>
  );
}
