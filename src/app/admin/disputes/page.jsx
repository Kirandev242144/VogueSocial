"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { adminService } from '@/services/adminService';
import {
  AlertTriangle, ShieldCheck, Clock, DollarSign,
  Loader2, Eye, Search
} from 'lucide-react';
import {
  AdminTopBar, AdminKpiCard, AdminStatusBadge
} from '@/components/admin';
import DisputeCaseModal from './DisputeCaseModal';
import './DisputesPage.css';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadDisputes = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDisputes();
      if (res && res.success) {
        setDisputes(res.disputes || []);
      }
    } catch (err) {
      console.error('Failed to load disputes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const handleResolveDispute = async (action, notes, extraData) => {
    if (!selectedDispute) return;
    setActionLoading(true);
    try {
      const res = await adminService.resolveDispute(selectedDispute.id, action, notes, extraData);
      if (res && res.success) {
        setDisputes(prev => prev.map(d => d.id === selectedDispute.id ? res.dispute : d));
        setSelectedDispute(null);
      }
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // KPI Calculations
  const openCount = disputes.filter(d => d.status === 'open').length;
  const underReviewCount = disputes.filter(d => d.status === 'under_review').length;
  const resolvedCount = disputes.filter(d => d.status.startsWith('resolved')).length;
  const totalOpenValue = disputes
    .filter(d => d.status === 'open' || d.status === 'under_review')
    .reduce((sum, d) => sum + (d.order?.amount || 0), 0);

  // Filtered Disputes
  const filteredDisputes = useMemo(() => {
    return disputes.filter(d => {
      // Filter tab
      if (statusFilter === 'open' && d.status !== 'open') return false;
      if (statusFilter === 'under_review' && d.status !== 'under_review') return false;
      if (statusFilter === 'resolved' && !d.status.startsWith('resolved')) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = d.id?.toLowerCase().includes(q);
        const matchesOrder = (d.order?.id || d.order_id)?.toLowerCase().includes(q);
        const matchesReason = d.reason?.toLowerCase().includes(q);
        const matchesCustomer = d.order?.customer?.full_name?.toLowerCase().includes(q) ||
          d.order?.customer?.email?.toLowerCase().includes(q);
        const matchesVendor = d.order?.vendor?.store_name?.toLowerCase().includes(q) ||
          d.order?.vendor?.store_handle?.toLowerCase().includes(q);

        return matchesId || matchesOrder || matchesReason || matchesCustomer || matchesVendor;
      }

      return true;
    });
  }, [disputes, statusFilter, searchQuery]);

  return (
    <>
      <AdminTopBar
        title="Disputes & Order Payments"
        subtitle="Review customer claims, inspect carrier tracking, and manage dispute resolutions"
        onRefresh={loadDisputes}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* KPI Grid */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Open Claims"
            value={openCount}
            sub="Awaiting investigation"
            icon={AlertTriangle}
            iconBg="rgba(239, 68, 68, 0.12)"
            iconColor="#ef4444"
          />

          <AdminKpiCard
            label="Value of Open Claims"
            value={`$${totalOpenValue.toFixed(2)}`}
            sub="Disputed order balances"
            icon={DollarSign}
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#f59e0b"
          />

          <AdminKpiCard
            label="Awaiting Review"
            value={underReviewCount}
            sub="Merchant or courier evidence"
            icon={Clock}
            iconBg="rgba(56, 189, 248, 0.12)"
            iconColor="#38bdf8"
          />

          <AdminKpiCard
            label="Resolved Claims"
            value={resolvedCount}
            sub="Settled cases on record"
            icon={ShieldCheck}
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10b981"
          />
        </div>

        {/* Customer Claims & Disputes Panel */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <span className="admin-panel-title">
              <AlertTriangle size={16} color="#ef4444" />
              Customer Claims & Disputes
            </span>
            <span className="dsp-panel-count">
              {filteredDisputes.length} of {disputes.length} Claims
            </span>
          </div>

          {/* Filter Toolbar & Search */}
          <div className="dsp-toolbar">
            <div className="dsp-tabs">
              {[
                { id: 'all', label: 'All Claims', count: disputes.length },
                { id: 'open', label: 'Open', count: openCount },
                { id: 'under_review', label: 'Under Review', count: underReviewCount },
                { id: 'resolved', label: 'Resolved', count: resolvedCount }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`dsp-tab-btn ${statusFilter === tab.id ? 'active' : ''}`}
                  onClick={() => setStatusFilter(tab.id)}
                >
                  <span>{tab.label}</span>
                  <span className="dsp-tab-count">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="dsp-search-wrap">
              <Search size={14} className="dsp-search-icon" />
              <input
                type="text"
                placeholder="Search claim, order, buyer, seller..."
                className="admin-input dsp-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <Loader2 size={24} className="animate-spin admin-empty-icon" />
              <p>Auditing claims database...</p>
            </div>
          ) : filteredDisputes.length === 0 ? (
            <div className="admin-empty-state">
              <ShieldCheck size={32} className="admin-empty-icon" />
              <div className="admin-empty-title">No Claims Found</div>
              <p className="admin-empty-desc">
                {searchQuery || statusFilter !== 'all'
                  ? 'No claims match your filter criteria.'
                  : 'All transactions are currently in good standing with zero active claims.'}
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Order Ref</th>
                    <th>Reason</th>
                    <th>Customer</th>
                    <th>Merchant</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="dsp-actions-cell">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisputes.map(disp => (
                    <tr key={disp.id}>
                      <td>
                        <span className="dsp-claim-id">{disp.id}</span>
                      </td>

                      <td>
                        <span className="dsp-order-ref">
                          #{disp.order?.id || disp.order_id}
                        </span>
                      </td>

                      <td>
                        <div className="dsp-reason-wrap">
                          <span className="dsp-reason-title">{disp.reason}</span>
                          <span className="dsp-reason-desc">{disp.description}</span>
                        </div>
                      </td>

                      <td>
                        <div className="dsp-entity-wrap">
                          <span className="dsp-entity-name">
                            {disp.order?.customer?.full_name || 'Customer'}
                          </span>
                          <span className="dsp-entity-sub">
                            {disp.order?.customer?.email}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="dsp-entity-wrap">
                          <span className="dsp-entity-name">
                            {disp.order?.vendor?.store_name || 'Merchant'}
                          </span>
                          <span className="dsp-entity-sub">
                            @{disp.order?.vendor?.store_handle}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="dsp-amount">
                          ${(disp.order?.amount || 0).toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <AdminStatusBadge status={disp.status} />
                      </td>

                      <td className="dsp-actions-cell">
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => setSelectedDispute(disp)}
                        >
                          <Eye size={12} />
                          <span>Review case</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Case Detail Modal */}
      {selectedDispute && (
        <DisputeCaseModal
          dispute={selectedDispute}
          isOpen={Boolean(selectedDispute)}
          onClose={() => setSelectedDispute(null)}
          onResolve={handleResolveDispute}
          loading={actionLoading}
        />
      )}
    </>
  );
}
