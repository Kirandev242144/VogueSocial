"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import {
  Users, CheckCircle, ShieldAlert, AlertTriangle,
  Search, ExternalLink, Loader2, Globe, Sliders, ShieldCheck,
  Lock, Unlock, FileText, ArrowRight
} from 'lucide-react';
import {
  AdminTopBar, AdminKpiCard, VendorAuditModal
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
      const res = await adminService.getVendors('all', '');
      if (res && res.success) {
        setVendors(res.vendors || []);
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
  }, []);

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

  const handlePlacePayoutHold = async (vendorId, holdData) => {
    setActionLoading(true);
    try {
      const res = await adminService.placeVendorPayoutHold(vendorId, holdData);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...res.vendor } : v));
        setSelectedVendor(prev => prev && prev.id === vendorId ? { ...prev, ...res.vendor } : prev);
      }
    } catch (err) {
      console.error('Failed to place payout hold:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReleasePayoutHold = async (vendorId, releaseData) => {
    setActionLoading(true);
    try {
      const res = await adminService.releaseVendorPayoutHold(vendorId, releaseData);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...res.vendor } : v));
        setSelectedVendor(prev => prev && prev.id === vendorId ? { ...prev, ...res.vendor } : prev);
      }
    } catch (err) {
      console.error('Failed to release payout hold:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateAgreementRate = async (vendorId, rateData) => {
    setActionLoading(true);
    try {
      const res = await adminService.updateVendorAgreementRate(vendorId, rateData);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...res.vendor } : v));
        setSelectedVendor(prev => prev && prev.id === vendorId ? { ...prev, ...res.vendor } : prev);
      }
    } catch (err) {
      console.error('Failed to update agreement rate:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStorefrontStatus = async (vendorId, statusData) => {
    setActionLoading(true);
    try {
      const res = await adminService.updateVendorStorefrontStatus(vendorId, statusData);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, ...res.vendor } : v));
        setSelectedVendor(prev => prev && prev.id === vendorId ? { ...prev, ...res.vendor } : prev);
      }
    } catch (err) {
      console.error('Failed to update storefront status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  // Status counters
  const liveCount = vendors.filter(v => (v.storefront_status === 'active' || (v.vendor_status === 'approved' && !v.storefront_status))).length;
  const kybPendingCount = vendors.filter(v => (v.kyb_status === 'pending_documents' || v.kyb_status === 'under_review' || (v.documents || []).some(d => d.status === 'pending'))).length;
  const payoutHoldCount = vendors.filter(v => (v.payout_eligibility === 'administrative_hold' || v.commercial_terms?.payout_hold || v.payout_hold_details?.active)).length;
  const suspendedCount = vendors.filter(v => (v.storefront_status === 'suspended' || v.vendor_status === 'suspended')).length;

  // Filtered merchants
  const filteredVendors = vendors.filter(v => {
    const name = (v.store_name || '').toLowerCase();
    const legal = (v.legal_business_name || '').toLowerCase();
    const email = (v.email || '').toLowerCase();
    const handle = (v.store_handle || '').toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = !q || name.includes(q) || legal.includes(q) || email.includes(q) || handle.includes(q);

    let matchesFilter = true;
    if (filter === 'all') matchesFilter = true;
    else if (filter === 'active') matchesFilter = (v.storefront_status === 'active' || (v.vendor_status === 'approved' && !v.storefront_status));
    else if (filter === 'kyb_pending') matchesFilter = (v.kyb_status === 'pending_documents' || v.kyb_status === 'under_review' || (v.documents || []).some(d => d.status === 'pending'));
    else if (filter === 'payout_hold') matchesFilter = (v.payout_eligibility === 'administrative_hold' || v.commercial_terms?.payout_hold || v.payout_hold_details?.active);
    else if (filter === 'suspended') matchesFilter = (v.storefront_status === 'suspended' || v.vendor_status === 'suspended');

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <AdminTopBar
        title="Merchant Governance & Directory"
        subtitle="Three separated governance gates: Storefront Access, Business KYB, and Administrative Payout Eligibility"
        onRefresh={loadVendors}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* Governance KPI Row */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Live Storefronts"
            value={liveCount}
            sub="Public catalog live & shopping active"
            icon={CheckCircle}
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10b981"
          />

          <AdminKpiCard
            label="KYB Verification Queue"
            value={kybPendingCount}
            sub="Pending incorporation or address proof"
            icon={AlertTriangle}
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#f59e0b"
          />

          <AdminKpiCard
            label="Administrative Payout Holds"
            value={payoutHoldCount}
            sub="Frozen transfers • Storefronts remain live"
            icon={Lock}
            iconBg="rgba(239, 68, 68, 0.12)"
            iconColor="#ef4444"
          />

          <AdminKpiCard
            label="Suspended Accounts"
            value={suspendedCount}
            sub="Unlisted due to trademark/policy issues"
            icon={ShieldAlert}
            iconBg="rgba(100, 116, 139, 0.12)"
            iconColor="#94a3b8"
          />
        </div>

        {/* Vendors Directory Panel */}
        <div className="admin-panel">
          <div className="admin-filter-bar">
            <div className="admin-filter-tabs">
              {[
                { id: 'all', label: `All Boutiques (${vendors.length})` },
                { id: 'active', label: `Storefronts Live (${liveCount})` },
                { id: 'kyb_pending', label: `KYB Review (${kybPendingCount})` },
                { id: 'payout_hold', label: `Payout Holds (${payoutHoldCount})` },
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
                placeholder="Search atelier name, legal entity, handle, email..."
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
          ) : filteredVendors.length === 0 ? (
            <div className="admin-empty-state">
              <Users size={32} className="admin-empty-icon" />
              <div className="admin-empty-title">No Boutiques Found</div>
              <p className="admin-empty-desc">
                {search ? 'Try adjusting your search criteria.' : 'No vendors currently match this governance filter.'}
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Merchant Atelier</th>
                    <th>Storefront Access</th>
                    <th>Business KYB</th>
                    <th>Payout Eligibility</th>
                    <th>Contract Rate</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map(v => {
                    const sfStatus = v.storefront_status || (v.vendor_status === 'approved' ? 'active' : (v.vendor_status === 'suspended' ? 'suspended' : 'under_review'));
                    const kyb = v.kyb_status || v.kyc_status || 'verified';
                    const isPayoutHold = (v.payout_eligibility === 'administrative_hold' || v.commercial_terms?.payout_hold || v.payout_hold_details?.active);
                    const agreement = v.marketplace_agreement || { version: 'v2.4', commission_rate_pct: v.commercial_terms?.take_rate_pct || 5.0 };

                    // Storefront badge styling
                    let sfBadge = { text: 'Active Live', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
                    if (sfStatus === 'suspended') {
                      sfBadge = { text: 'Suspended', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' };
                    } else if (sfStatus === 'under_review' || sfStatus === 'pending_approval') {
                      sfBadge = { text: 'Under Review', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
                    }

                    // KYB badge styling
                    let kybBadge = { text: 'Verified', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
                    if (kyb === 'rejected') {
                      kybBadge = { text: 'Rejected', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' };
                    } else if (kyb === 'pending_documents' || kyb === 'documents_required' || kyb === 'under_review') {
                      kybBadge = { text: 'Docs Required', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' };
                    }

                    // Payout badge styling
                    let payoutBadge = isPayoutHold
                      ? { text: 'Administrative Hold', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' }
                      : { text: 'Eligible', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };

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
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.82rem' }}>
                                  {v.store_name}
                                </span>
                                <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 500 }}>
                                  [Demo]
                                </span>
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '1px' }}>
                                {v.legal_business_name || v.store_name} • {v.country || 'Global'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Storefront Access Gate */}
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: sfBadge.bg,
                              color: sfBadge.color
                            }}
                          >
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: sfBadge.color }} />
                            {sfBadge.text}
                          </span>
                        </td>

                        {/* Business KYB Gate */}
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: kybBadge.bg,
                              color: kybBadge.color
                            }}
                          >
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: kybBadge.color }} />
                            {kybBadge.text}
                          </span>
                        </td>

                        {/* Payout Eligibility Gate */}
                        <td>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.66rem',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              background: payoutBadge.bg,
                              color: payoutBadge.color
                            }}
                          >
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: payoutBadge.color }} />
                            {payoutBadge.text}
                          </span>
                        </td>

                        {/* Agreement Take-Rate */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--adm-text-main)', fontSize: '0.78rem' }}>
                              {(agreement.commission_rate_pct ?? 5.0).toFixed(1)}%
                            </span>
                            <span style={{ fontSize: '0.64rem', padding: '1px 5px', borderRadius: '3px', background: 'var(--adm-panel-hover)', color: 'var(--adm-text-sub)', fontFamily: 'monospace' }}>
                              {agreement.version || 'v2.4'}
                            </span>
                          </div>
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

      {/* Vendor Audit & Governance Modal */}
      {selectedVendor && (
        <VendorAuditModal
          vendor={selectedVendor}
          isOpen={Boolean(selectedVendor)}
          onClose={handleCloseAudit}
          onSaveBusiness={handleSaveBusiness}
          onUpdateDocStatus={handleUpdateDocStatus}
          onPlacePayoutHold={handlePlacePayoutHold}
          onReleasePayoutHold={handleReleasePayoutHold}
          onUpdateAgreementRate={handleUpdateAgreementRate}
          onUpdateStorefrontStatus={handleUpdateStorefrontStatus}
          loading={actionLoading}
        />
      )}
    </>
  );
}
