"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import {
  Users, CheckCircle, ShieldAlert, AlertTriangle,
  Search, ExternalLink, Loader2, Globe
} from 'lucide-react';
import {
  AdminTopBar, AdminKpiCard, AdminStatusBadge
} from '@/components/admin';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const loadVendors = async () => {
    setLoading(true);
    try {
      const res = await adminService.getVendors(filter, search);
      if (res && res.success) {
        setVendors(res.vendors || []);
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

  const handleToggleStatus = async (vendorId, currentStatus) => {
    const nextAction = currentStatus === 'approved' ? 'suspend' : 'approve';
    try {
      const res = await adminService.updateVendorStatus(vendorId, nextAction);
      if (res && res.success) {
        setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, vendor_status: res.vendor_status } : v));
      }
    } catch (err) {
      console.error('Failed to update vendor status:', err);
    }
  };

  const approvedCount = vendors.filter(v => v.vendor_status === 'approved').length;
  const pendingCount = vendors.filter(v => v.vendor_status === 'pending_approval').length;
  const suspendedCount = vendors.filter(v => v.vendor_status === 'suspended').length;

  return (
    <>
      <AdminTopBar
        title="Merchant Directory"
        subtitle="Manage brand storefronts, audit vendor accounts, and control marketplace access"
        onRefresh={loadVendors}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* KPI Row */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Active Storefronts"
            value={approvedCount}
            sub="Approved luxury boutiques"
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
            label="Suspended Accounts"
            value={suspendedCount}
            sub="Paused due to policy infractions"
            icon={ShieldAlert}
            iconBg="rgba(239, 68, 68, 0.12)"
            iconColor="#ef4444"
          />

          <AdminKpiCard
            label="Total Platform Brands"
            value={vendors.length}
            sub="Registered vendor profiles"
            icon={Users}
            iconBg="rgba(56, 189, 248, 0.12)"
            iconColor="#38bdf8"
          />
        </div>

        {/* Vendors Table Panel */}
        <div className="admin-panel">
          <div className="admin-filter-bar">
            <div className="admin-filter-tabs">
              {[
                { id: 'all', label: 'All Merchants' },
                { id: 'approved', label: `Active (${approvedCount})` },
                { id: 'pending_approval', label: `Pending (${pendingCount})` },
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
                placeholder="Search brand name, handle, email..."
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
                    <th>Contact Email</th>
                    <th>Active Garments</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 8, background: 'var(--adm-panel-hover)',
                            border: '1px solid var(--adm-border)', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'var(--adm-accent)'
                          }}>
                            {(v.store_name || 'V').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                              {v.store_name}
                            </div>
                            {v.custom_domain && (
                              <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                <Globe size={10} /> {v.custom_domain}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <a
                          href={`/store/${v.store_handle}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            color: 'var(--adm-accent)', textDecoration: 'none', fontWeight: 600, fontSize: '0.78rem'
                          }}
                        >
                          <span>@{v.store_handle}</span>
                          <ExternalLink size={11} />
                        </a>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)' }}>
                          {v.email}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                          {v.products_count ?? 0} pieces
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-sub)' }}>
                          {new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </td>

                      <td>
                        <AdminStatusBadge status={v.vendor_status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                          <a
                            href={`/store/${v.store_handle}`}
                            target="_blank"
                            rel="noreferrer"
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            title="Visit public storefront"
                          >
                            <ExternalLink size={12} /> Visit
                          </a>

                          <button
                            type="button"
                            className={`admin-btn admin-btn-sm ${v.vendor_status === 'approved' ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                            onClick={() => handleToggleStatus(v.id, v.vendor_status)}
                          >
                            {v.vendor_status === 'approved' ? 'Suspend' : 'Approve'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
