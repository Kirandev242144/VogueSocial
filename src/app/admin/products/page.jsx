"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import {
  Package, Search, Eye, CheckCircle, ShieldAlert,
  AlertTriangle, MessageSquare, Loader2, Sparkles
} from 'lucide-react';
import {
  AdminTopBar, AdminKpiCard, AdminStatusBadge, AdminModal
} from '@/components/admin';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Inspection modal state
  const [inspectProduct, setInspectProduct] = useState(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await adminService.getProducts(filter, search);
      if (res && res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error('Failed to load products for approval:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [filter, search]);

  const handleAdminDecision = async (action) => {
    if (!inspectProduct) return;
    setActionLoading(true);
    try {
      const res = await adminService.updateProductStatus(inspectProduct.id, action, adminNotesInput);
      if (res && res.success) {
        setProducts(prev => prev.map(p => p.id === inspectProduct.id ? res.product : p));
        setInspectProduct(null);
        setAdminNotesInput('');
      }
    } catch (err) {
      console.error('Failed to update product decision:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const openInspection = (prod) => {
    setInspectProduct(prod);
    setAdminNotesInput(prod.admin_notes || '');
  };

  const pendingCount = products.filter(p => p.status === 'pending_approval').length;
  const liveCount = products.filter(p => p.status === 'live').length;
  const changesCount = products.filter(p => p.status === 'changes_requested').length;
  const rejectedCount = products.filter(p => p.status === 'rejected').length;

  return (
    <>
      <AdminTopBar
        title="Product Approvals"
        subtitle="Review, audit, and approve luxury merchant garments before they go live on VogueSocial"
        onRefresh={loadProducts}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* KPI Row */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Pending Review"
            value={pendingCount}
            sub="Awaiting catalog compliance check"
            icon={AlertTriangle}
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#f59e0b"
          />

          <AdminKpiCard
            label="Live on Marketplace"
            value={liveCount}
            sub="Visible to shoppers and feed"
            icon={CheckCircle}
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10b981"
          />

          <AdminKpiCard
            label="Changes Requested"
            value={changesCount}
            sub="Returned to merchant for edit"
            icon={MessageSquare}
            iconBg="rgba(56, 189, 248, 0.12)"
            iconColor="#38bdf8"
          />

          <AdminKpiCard
            label="Rejected Listings"
            value={rejectedCount}
            sub="Policy or trademark violations"
            icon={ShieldAlert}
            iconBg="rgba(239, 68, 68, 0.12)"
            iconColor="#ef4444"
          />
        </div>

        {/* Catalog Table Panel */}
        <div className="admin-panel">
          {/* Filter Bar */}
          <div className="admin-filter-bar">
            <div className="admin-filter-tabs">
              {[
                { id: 'all', label: 'All Garments' },
                { id: 'pending_approval', label: `Pending (${pendingCount})` },
                { id: 'live', label: `Live (${liveCount})` },
                { id: 'changes_requested', label: `Changes (${changesCount})` },
                { id: 'rejected', label: `Rejected (${rejectedCount})` }
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
                placeholder="Search garment name, SKU, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <Loader2 size={24} className="animate-spin admin-empty-icon" />
              <p>Auditing product catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="admin-empty-state">
              <Package size={32} className="admin-empty-icon" />
              <div className="admin-empty-title">No Garments Found</div>
              <p className="admin-empty-desc">
                {search ? 'Try clearing your search query.' : 'There are no products in this approval state.'}
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Garment</th>
                    <th>Merchant Atelier</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(prod => {
                    const img = prod.imageUrl || prod.image_url || prod.image || '/Shop_images/1/basic2-500x750.jpeg';
                    const price = prod.salePrice || prod.sale_price || prod.price;

                    return (
                      <tr key={prod.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{ width: 44, height: 56, borderRadius: 6, overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                                {prod.name}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                                SKU: {prod.sku || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                            {prod.vendor?.store_name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                            @{prod.vendor?.store_handle}
                          </div>
                        </td>

                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)' }}>
                            {prod.category}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--adm-text-main)' }}>
                            ${price}
                          </span>
                        </td>

                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--adm-text-sub)' }}>
                            {prod.stock ?? 25} units
                          </span>
                        </td>

                        <td>
                          <AdminStatusBadge status={prod.status} />
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() => openInspection(prod)}
                          >
                            <Eye size={12} /> Inspect
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

      {/* Product Detail Inspection Modal */}
      {inspectProduct && (
        <AdminModal
          isOpen={Boolean(inspectProduct)}
          onClose={() => setInspectProduct(null)}
          title={`Inspect Garment: ${inspectProduct.name}`}
          maxWidth="640px"
          footer={
            <>
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => handleAdminDecision('reject')}
                disabled={actionLoading}
              >
                Reject Listing
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => handleAdminDecision('request_changes')}
                disabled={actionLoading}
              >
                Request Changes
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => handleAdminDecision('approve')}
                disabled={actionLoading}
              >
                ✓ Approve Live Market
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.25rem' }}>
            <div style={{ aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', background: '#f1f5f9' }}>
              <img
                src={inspectProduct.imageUrl || inspectProduct.image_url || inspectProduct.image || '/Shop_images/1/basic2-500x750.jpeg'}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div>
                <span className="admin-label">Product Name</span>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--adm-text-main)' }}>
                  {inspectProduct.name}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <span className="admin-label">Price</span>
                  <div style={{ fontWeight: 600 }}>${inspectProduct.salePrice || inspectProduct.price}</div>
                </div>
                <div>
                  <span className="admin-label">Category</span>
                  <div style={{ fontWeight: 600 }}>{inspectProduct.category}</div>
                </div>
              </div>

              <div>
                <span className="admin-label">Merchant Atelier</span>
                <div style={{ fontWeight: 600 }}>
                  {inspectProduct.vendor?.store_name} (@{inspectProduct.vendor?.store_handle})
                </div>
              </div>

              <div>
                <span className="admin-label">Description</span>
                <p style={{ fontSize: '0.78rem', color: 'var(--adm-text-muted)', margin: '2px 0 0', lineHeight: 1.5 }}>
                  {inspectProduct.description || 'No description provided by merchant.'}
                </p>
              </div>
            </div>
          </div>

          <div className="admin-form-group" style={{ marginTop: '1rem' }}>
            <label className="admin-label">Administrative Review Notes</label>
            <textarea
              className="admin-textarea"
              placeholder="Add internal feedback or specify changes requested from the merchant..."
              value={adminNotesInput}
              onChange={(e) => setAdminNotesInput(e.target.value)}
            />
          </div>
        </AdminModal>
      )}
    </>
  );
}
