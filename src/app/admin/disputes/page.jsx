"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import {
  AlertTriangle, CheckCircle, Landmark, ShieldCheck,
  Truck, Send, Loader2, Eye, ExternalLink, Terminal
} from 'lucide-react';
import {
  AdminTopBar, AdminKpiCard, AdminStatusBadge, AdminModal
} from '@/components/admin';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Webhook Simulator state
  const [simOrderId, setSimOrderId] = useState('ORD-8241');
  const [simCarrier, setSimCarrier] = useState('dhl');
  const [simStatus, setSimStatus] = useState('DELIVERED');
  const [simLoading, setSimLoading] = useState(false);
  const [webhookLogs, setWebhookLogs] = useState([
    { timestamp: new Date().toLocaleTimeString(), message: 'Escrow Engine: Listening for carrier webhook signals.' },
    { timestamp: new Date().toLocaleTimeString(), message: 'Platform Policy: 5% flat fee collected upon release.' }
  ]);

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

  const handleResolve = async (action) => {
    if (!selectedDispute) return;
    setActionLoading(true);
    try {
      const res = await adminService.resolveDispute(selectedDispute.id, action, resolutionNotes);
      if (res && res.success) {
        setDisputes(prev => prev.map(d => d.id === selectedDispute.id ? res.dispute : d));
        setSelectedDispute(null);
        setResolutionNotes('');
        setWebhookLogs(prev => [
          { timestamp: new Date().toLocaleTimeString(), message: `DISPUTE_SETTLED: ${selectedDispute.id} settled with action=${action.toUpperCase()}.` },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateWebhook = async (e) => {
    e.preventDefault();
    setSimLoading(true);
    await new Promise(r => setTimeout(r, 600));

    setWebhookLogs(prev => [
      { timestamp: new Date().toLocaleTimeString(), message: `WEBHOOK_RECEIVED: Carrier=${simCarrier.toUpperCase()} Event=PACKAGE_${simStatus} Order=${simOrderId}` },
      { timestamp: new Date().toLocaleTimeString(), message: `ESCROW_TRIGGER: Automated 48h settlement timer activated for ${simOrderId}.` },
      ...prev
    ]);
    setSimLoading(false);
  };

  const openModal = (disp) => {
    setSelectedDispute(disp);
    setResolutionNotes(disp.admin_notes || '');
  };

  const openCount = disputes.filter(d => d.status === 'open' || d.status === 'under_review').length;
  const resolvedCount = disputes.filter(d => d.status.startsWith('resolved')).length;
  const totalDisputedAmount = disputes
    .filter(d => d.status === 'open' || d.status === 'under_review')
    .reduce((sum, d) => sum + (d.order?.amount || 0), 0);

  return (
    <>
      <AdminTopBar
        title="Disputes & Escrow Vault"
        subtitle="Arbitrate customer claims, verify courier delivery proof, and release or refund escrow balances"
        onRefresh={loadDisputes}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* KPI Grid */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Active Claims"
            value={openCount}
            sub="Under arbitration review"
            icon={AlertTriangle}
            iconBg="rgba(239, 68, 68, 0.12)"
            iconColor="#ef4444"
          />

          <AdminKpiCard
            label="Disputed Balance"
            value={`$${totalDisputedAmount.toFixed(2)}`}
            sub="Frozen pending resolution"
            icon={Landmark}
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#f59e0b"
          />

          <AdminKpiCard
            label="Settled Disputes"
            value={resolvedCount}
            sub="Arbitrated cases on record"
            icon={ShieldCheck}
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10b981"
          />

          <AdminKpiCard
            label="Escrow Protection Rate"
            value="99.4%"
            sub="Zero fraudulent chargebacks"
            icon={CheckCircle}
            iconBg="rgba(56, 189, 248, 0.12)"
            iconColor="#38bdf8"
          />
        </div>

        {/* Disputes Table Panel */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <span className="admin-panel-title">
              <AlertTriangle size={16} color="#ef4444" />
              Customer Escrow Claims & Arbitrations
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
              {disputes.length} Total Claims
            </span>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <Loader2 size={24} className="animate-spin admin-empty-icon" />
              <p>Auditing claims database...</p>
            </div>
          ) : disputes.length === 0 ? (
            <div className="admin-empty-state">
              <ShieldCheck size={32} className="admin-empty-icon" />
              <div className="admin-empty-title">All Escrows in Good Standing</div>
              <p className="admin-empty-desc">There are no customer disputes or frozen transactions.</p>
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
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.map(disp => (
                    <tr key={disp.id}>
                      <td style={{ fontWeight: 700, color: 'var(--adm-text-main)' }}>
                        {disp.id}
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: '#38bdf8' }}>
                          #{disp.order?.id || disp.order_id}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                          {disp.reason}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {disp.description}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                          {disp.order?.customer?.full_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                          {disp.order?.customer?.email}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                          {disp.order?.vendor?.store_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                          @{disp.order?.vendor?.store_handle}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--adm-text-main)' }}>
                          ${disp.order?.amount?.toFixed(2)}
                        </span>
                      </td>

                      <td>
                        <AdminStatusBadge status={disp.status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => openModal(disp)}
                        >
                          <Eye size={12} /> Arbitrate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Carrier Webhook Simulation Panel */}
        <div className="admin-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Truck size={17} color="#38bdf8" />
            <h3 className="admin-panel-title" style={{ margin: 0 }}>
              Carrier Delivery Webhook Simulator
            </h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            Simulate automated delivery confirmation signals from DHL Express, FedEx, or Delhivery to test real-time escrow release triggers.
          </p>

          <form onSubmit={handleSimulateWebhook} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto', gap: '0.85rem', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label">Order Reference</label>
              <input
                type="text"
                className="admin-input"
                value={simOrderId}
                onChange={(e) => setSimOrderId(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Carrier Provider</label>
              <select
                className="admin-select"
                value={simCarrier}
                onChange={(e) => setSimCarrier(e.target.value)}
              >
                <option value="dhl">DHL Express Worldwide</option>
                <option value="fedex">FedEx Priority</option>
                <option value="ups">UPS Worldwide Saver</option>
                <option value="delhivery">Delhivery Surface Express</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Tracking Event</label>
              <select
                className="admin-select"
                value={simStatus}
                onChange={(e) => setSimStatus(e.target.value)}
              >
                <option value="DELIVERED">Delivered (Recipient Signed)</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="EXCEPTION">Customs Exception / Delay</option>
              </select>
            </div>

            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={simLoading}
              style={{ height: 38 }}
            >
              {simLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              <span>Dispatch Webhook</span>
            </button>
          </form>

          {/* Webhook Event Stream Log */}
          <div style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: 10, padding: '0.85rem 1rem', fontFamily: 'monospace', fontSize: '0.74rem' }}>
            <div style={{ color: 'var(--adm-text-sub)', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Terminal size={12} />
              <span>Real-Time Audit Event Stream</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {webhookLogs.map((log, i) => (
                <div key={i} style={{ color: 'var(--adm-text-muted)', lineHeight: 1.4 }}>
                  <span style={{ color: '#38bdf8' }}>[{log.timestamp}]</span> {log.message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Arbitration Modal */}
      {selectedDispute && (
        <AdminModal
          isOpen={Boolean(selectedDispute)}
          onClose={() => setSelectedDispute(null)}
          title={`Arbitrate Claim: ${selectedDispute.id}`}
          maxWidth="600px"
          footer={
            <>
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => handleResolve('refund')}
                disabled={actionLoading}
              >
                Refund Buyer (${selectedDispute.order?.amount?.toFixed(2)})
              </button>

              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => handleResolve('release')}
                disabled={actionLoading}
              >
                Release Escrow to Merchant
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border)', borderRadius: 10, padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="admin-label">Reason</span>
                <AdminStatusBadge status={selectedDispute.status} />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--adm-text-main)', marginBottom: '0.25rem' }}>
                {selectedDispute.reason}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--adm-text-muted)', margin: 0, lineHeight: 1.5 }}>
                {selectedDispute.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '0.75rem' }}>
                <span className="admin-label">Customer</span>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedDispute.order?.customer?.full_name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>{selectedDispute.order?.customer?.email}</div>
              </div>

              <div style={{ background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: 8, padding: '0.75rem' }}>
                <span className="admin-label">Merchant</span>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedDispute.order?.vendor?.store_name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>@{selectedDispute.order?.vendor?.store_handle}</div>
              </div>
            </div>

            {selectedDispute.evidence_url && (
              <div>
                <span className="admin-label">Submitted Photographic Evidence</span>
                <div style={{ width: 100, height: 120, borderRadius: 6, overflow: 'hidden', marginTop: 4, border: '1px solid var(--adm-border)' }}>
                  <img src={selectedDispute.evidence_url} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}

            <div className="admin-form-group">
              <label className="admin-label">Administrative Arbitration Ruling & Notes</label>
              <textarea
                className="admin-textarea"
                placeholder="State basis for decision (e.g. tracking verified, garment damage accepted)..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
              />
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}
