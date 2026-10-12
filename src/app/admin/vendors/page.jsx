"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import {
  Users, CheckCircle, ShieldAlert, AlertTriangle,
  Search, ExternalLink, Loader2, Globe, Sliders, ShieldCheck, MapPin
} from 'lucide-react';
import {
  AdminTopBar, AdminKpiCard, AdminStatusBadge, VendorAuditModal
} from '@/components/admin';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadVendors = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVendors(filter, search);
      if (res && res.success) {
        setVendors(res.vendors || []);
        // If modal is open, refresh selected vendor
        if (selectedVendor) {
          const updatedSelected = (res.vendors || []).find(v => v.id === selectedVendor.id);
          if (updatedSelected) setSelectedVendor(updatedSelected);
        }
      }
    } catch (err) {
      console.error('Failed to load vendors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, [filter, search]);

  const handleOpenAudit = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleCloseAudit = () => {
    setSelectedVendor(null);
  };

  const handleSaveBusiness = async (vendorId, businessData) => {
    setActionLoading(true);
    try {
      const res = await adminService.updateVendorBusinessInfo(vendorId, businessData);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...res.vendor } : v));
        setSelectedVendor(prev => prev && prev.id === vendorId ? { ...prev, ...res.vendor } : prev);
      }
    } catch (err) {
      console.error('Failed to save business info:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateDocStatus = async (vendorId, docId, status, notes) => {
    setActionLoading(true);
    try {
      const res = await adminService.updateVendorDocumentStatus(vendorId, docId, status, notes);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...res.vendor } : v));
        setSelectedVendor(prev => prev && prev.id === vendorId ? { ...prev, ...res.vendor } : prev);
      }
    } catch (err) {
      console.error('Failed to update document status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateTerms = async (vendorId, terms) => {
    setActionLoading(true);
    try {
      const res = await adminService.updateVendorCommercialTerms(vendorId, terms);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...res.vendor } : v));
        setSelectedVendor(prev => prev && prev.id === vendorId ? { ...prev, ...res.vendor } : prev);
      }
    } catch (err) {
      console.error('Failed to update commercial terms:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (vendorId, action, notes) => {
    setActionLoading(true);
    try {
      const res = await adminService.updateVendorStatus(vendorId, action, notes);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...(res.vendor || { vendor_status: res.vendor_status }) } : v));
        if (selectedVendor && selectedVendor.id === vendorId) {
          setSelectedVendor(prev => ({ ...prev, ...(res.vendor || { vendor_status: res.vendor_status }) }));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const approvedCount = vendors.filter(v => v.vendor_status === 'approved').length;
  const pendingCount = vendors.filter(v => v.vendor_status === 'pending_approval').length;
  const changesCount = vendors.filter(v => v.vendor_status === 'changes_requested').length;
  const suspendedCount = vendors.filter(v => v.vendor_status === 'suspended').length;

  return (
    <>
      <AdminTopBar
        title="Merchant Directory & Governance"
        subtitle="Audit legal registration, verify proof of business address, inspect KYB documents, and manage marketplace access"
        onRefresh={loadVendors}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* KPI Row */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Active Storefronts"
            value={approvedCount}
            sub="Approved luxury ateliers"
            icon={CheckCircle}
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10b981"
          />

          <AdminKpiCard
            label="Pending Applications"
            value={pendingCount}
            sub="Awaiting identity & catalog audit"
            icon={AlertTriangle}
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#f59e0b"
          />

          <AdminKpiCard
            label="Action Needed"
            value={changesCount}
            sub="Missing address proof or docs"
            icon={Sliders}
            iconBg="rgba(56, 189, 248, 0.12)"
            iconColor="#38bdf8"
          />

          <AdminKpiCard
            label="Suspended Accounts"
            value={suspendedCount}
            sub="Paused due to policy infractions"
            icon={ShieldAlert}
            iconBg="rgba(239, 68, 68, 0.12)"
            iconColor="#ef4444"
          />
        </div>

        {/* Vendors Table Panel */}
        <div className="admin-panel">
          <div className="admin-filter-bar">
            <div className="admin-filter-tabs">
              {[
                { id: 'all', label: `All Merchants (${vendors.length})` },
                { id: 'approved', label: `Active (${approvedCount})` },
                { id: 'pending_approval', label: `Pending Review (${pendingCount})` },
                { id: 'changes_requested', label: `Action Needed (${changesCount})` },
                { id: 'suspended', label: `Suspended (${suspendedCount})` }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`admin-filter-tab ${filter === t.id ? 'admin-filter-tab-active' : ''}`}
                  onClick={() => setFilter(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="admin-search-box">
              <Search size={14} className="admin-search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search brand, legal entity, handle, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <Loader2 size={24} className="animate-spin admin-empty-icon" />
              <p>Loading merchant directory...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="admin-empty-state">
              <Users size={32} className="admin-empty-icon" />
              <div className="admin-empty-title">No Merchants Found</div>
              <p className="admin-empty-desc">
                {search ? 'Try clearing your search query.' : 'No vendors currently match this status filter.'}
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Merchant Atelier</th>
                    <th>Subdomain & Handle</th>
                    <th>Compliance / KYB</th>
                    <th>Active Garments</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(v => {
                    const kyc = v.kyc_status || 'under_review';
                    const hasPendingDocs = (v.documents || []).some(d => d.status === 'pending');
                    const hasRejectedDocs = (v.documents || []).some(d => d.status === 'rejected');

                    let kycPill = { text: 'KYC Verified', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
                    if (kyc === 'documents_required' || hasRejectedDocs) {
                      kycPill = { text: 'Address Proof Needed', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' };
                    } else if (kyc === 'under_review' || hasPendingDocs) {
                      kycPill = { text: 'Docs Under Review', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
                    } else if (kyc === 'suspended') {
                      kycPill = { text: 'Suspended', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' };
                    }

                    return (
                      <tr key={v.id}>
                        {/* Merchant Atelier */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 8, background: 'var(--adm-panel-hover)',
                              border: '1px solid var(--adm-border)', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--adm-accent)'
                            }}>
                              {(v.store_name || 'V').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
                                {v.store_name}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                                {v.legal_business_name || v.store_name} • {v.country || 'Global'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Subdomain & Handle */}
                        <td>
                          <div>
                            <a
                              href={`/store/${v.store_handle}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                color: 'var(--adm-accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.76rem'
                              }}
                            >
                              <span>@{v.store_handle}</span>
                              <ExternalLink size={11} />
                            </a>
                            <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)' }}>
                              {v.email}
                            </div>
                          </div>
                        </td>

                        {/* Compliance / KYB */}
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: kycPill.bg,
                              color: kycPill.color
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: kycPill.color }} />
                            {kycPill.text}
                          </span>
                        </td>

                        {/* Active Garments */}
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.78rem' }}>
                            {v.products_count ?? 0} pieces
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td>
                          <span style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)' }}>
                            {new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        </td>

                        {/* Status */}
                        <td>
                          <AdminStatusBadge status={v.vendor_status} />
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.45rem', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              onClick={() => handleOpenAudit(v)}
                            >
                              Audit & Manage
                            </button>

                            <a
                              href={`/store/${v.store_handle}`}
                              target="_blank"
                              rel="noreferrer"
                              className="admin-btn admin-btn-ghost admin-btn-sm"
                              title="Visit public storefront"
                              style={{ padding: '3px 7px' }}
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
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

      {/* Vendor Audit & Management Modal */}
      {selectedVendor && (
        <VendorAuditModal
          vendor={selectedVendor}
          isOpen={Boolean(selectedVendor)}
          onClose={handleCloseAudit}
          onSaveBusiness={handleSaveBusiness}
          onUpdateDocStatus={handleUpdateDocStatus}
          onUpdateTerms={handleUpdateTerms}
          onUpdateStatus={handleUpdateStatus}
          loading={actionLoading}
        />
      )}
    </>
  );
}
