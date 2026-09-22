"use client";
import { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import { Package, CheckCircle, AlertTriangle, ShieldAlert, Search, RefreshCw, Check, MessageSquare, Eye } from 'lucide-react';
export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    // Selected product modal for admin inspection
    const [inspectProduct, setInspectProduct] = useState(null);
    const [adminNotesInput, setAdminNotesInput] = useState('');
    const [actionType, setActionType] = useState(null);
    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (data.success && data.products) {
                setProducts(data.products);
            }
        }
        catch (e) {
            console.error("Failed to load admin products", e);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadProducts();
    }, []);
    const handleAdminAction = async (productId, action, notes) => {
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, action, admin_notes: notes || '' })
            });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: data.status, admin_notes: notes || p.admin_notes } : p));
                setInspectProduct(null);
                setActionType(null);
                setAdminNotesInput('');
                alert(`✓ Product listing status updated to ${data.status}`);
            }
            else {
                alert(`Action failed: ${data.error}`);
            }
        }
        catch (e) {
            alert("Error processing admin decision.");
        }
    };
    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.vendor?.store_name.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || p.status === filter;
        return matchesSearch && matchesFilter;
    });
    const getStatusBadge = (status) => {
        switch (status) {
            case 'live':
                return <span className={`${styles.badge} ${styles.badgeActive}`}><CheckCircle size={10}/> Live Market</span>;
            case 'pending_approval':
                return <span className={`${styles.badge} ${styles.badgePending}`}><AlertTriangle size={10}/> Pending Review</span>;
            case 'changes_requested':
                return <span className={`${styles.badge}`} style={{ background: '#dbeafe', color: '#1d4ed8' }}><MessageSquare size={10}/> Changes Requested</span>;
            case 'rejected':
                return <span className={`${styles.badge} ${styles.badgeSuspended}`}><ShieldAlert size={10}/> Rejected</span>;
            default:
                return <span className={`${styles.badge}`}>{status}</span>;
        }
    };
    return (<>
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitle}>Product Approvals</div>
          <div className={styles.pageSubtitle}>Review and verify merchant product listings before they go live on VogueSocial</div>
        </div>
        <div className={styles.topbarRight}>
          <button className={styles.btnGhost} onClick={loadProducts} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <RefreshCw size={13}/> Refresh
          </button>
        </div>
      </div>

      <div className={styles.pageContent}>
        {/* KPI Row */}
        <div className={styles.kpiGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Pending Product Reviews</div>
            <div className={styles.kpiValue} style={{ color: 'var(--color-amber)' }}>
              {products.filter(p => p.status === 'pending_approval').length}
            </div>
            <div className={styles.kpiSub}>Awaiting compliance audit</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Live Marketplace Products</div>
            <div className={styles.kpiValue} style={{ color: 'var(--color-emerald)' }}>
              {products.filter(p => p.status === 'live').length}
            </div>
            <div className={styles.kpiSub}>Published & active listings</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Changes Requested</div>
            <div className={styles.kpiValue} style={{ color: '#3b82f6' }}>
              {products.filter(p => p.status === 'changes_requested').length}
            </div>
            <div className={styles.kpiSub}>Vendor revisions pending</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiLabel}>Rejected Listings</div>
            <div className={styles.kpiValue} style={{ color: 'var(--color-rose)' }}>
              {products.filter(p => p.status === 'rejected').length}
            </div>
            <div className={styles.kpiSub}>Non-compliant submissions</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className={styles.panel} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className={styles.searchBar}>
              <Search size={14} color="var(--d-t4)"/>
              <input placeholder="Search by product, SKU, store..." value={search} onChange={e => setSearch(e.target.value)}/>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
            { key: 'all', label: 'All Submissions' },
            { key: 'pending_approval', label: 'Pending Review' },
            { key: 'live', label: 'Live' },
            { key: 'changes_requested', label: 'Changes Requested' },
            { key: 'rejected', label: 'Rejected' },
        ].map(t => (<button key={t.key} className={`${styles.actionBtn} ${filter === t.key ? styles.actionBtnPrimary : ''}`} onClick={() => setFilter(t.key)}>
                  {t.label}
                </button>))}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Package size={16} color="#8b5cf6"/> Submitted Products List ({filtered.length})
            </span>
          </div>

          {loading ? (<div style={{ padding: '3rem', textAlign: 'center', color: 'var(--d-t3)' }}>Loading product submissions...</div>) : filtered.length === 0 ? (<div className={styles.empty}>
              <Package size={40} className={styles.emptyIcon} style={{ color: 'var(--d-t4)' }}/>
              <div className={styles.emptyTitle}>No product submissions match criteria</div>
            </div>) : (<table className={styles.table}>
              <thead>
                <tr>
                  <th>Product & SKU</th>
                  <th>Vendor Store</th>
                  <th>Price & Variants</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (<tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.image_url || '/Shop_images/1/basic2-500x750.jpeg'} alt="" style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover' }}/>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--d-t1)' }}>{p.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)', fontFamily: 'monospace' }}>SKU: {p.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--d-t2)' }}>{p.vendor?.store_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)' }}>@{p.vendor?.store_handle}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--d-t1)' }}>${p.price} {p.currency}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)' }}>{p.variants?.length || 1} variants</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: p.stock <= 0 ? '#ef4444' : 'var(--d-t1)' }}>{p.stock} units</span>
                    </td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className={styles.actionBtnPrimary} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }} onClick={() => { setInspectProduct(p); setActionType(null); setAdminNotesInput(''); }}>
                        <Eye size={12}/> Inspect Listing
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>)}
        </div>
      </div>

      {/* ADMIN INSPECTION MODAL */}
      {inspectProduct && (<div className={styles.overlay} onClick={() => setInspectProduct(null)}>
          <div className={styles.modal} style={{ maxWidth: 740 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>Product Audit — {inspectProduct.name}</div>
              <button className={styles.closeBtn} onClick={() => setInspectProduct(null)}>✕</button>
            </div>

            <div className={styles.modalBody} style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              {/* Product Gallery Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <img src={inspectProduct.image_url} alt="" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 10 }}/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--d-t1)' }}>{inspectProduct.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)' }}>
                    Category: <strong>{inspectProduct.category}</strong> · Target: <strong>{inspectProduct.target_audience}</strong>
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#6366f1' }}>
                    ${inspectProduct.price} {inspectProduct.currency}
                    {inspectProduct.sale_price && <span style={{ fontSize: '0.85rem', color: '#ef4444', textDecoration: 'line-through', marginLeft: 8 }}>${inspectProduct.sale_price}</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--d-t2)', marginTop: 4 }}>
                    Vendor: <strong>{inspectProduct.vendor?.store_name}</strong> (@{inspectProduct.vendor?.store_handle}) · {inspectProduct.vendor?.email}
                  </div>
                  <div style={{ marginTop: 6 }}>{getStatusBadge(inspectProduct.status)}</div>
                </div>
              </div>

              {/* Description & Details */}
              <div className={styles.panel} style={{ padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Product Description</div>
                <p style={{ fontSize: '0.84rem', color: 'var(--d-t2)', lineHeight: 1.5, margin: 0 }}>{inspectProduct.desc || 'No description provided.'}</p>
              </div>

              {/* Variants Matrix */}
              <div className={styles.panel} style={{ padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>Variants & Inventory ({inspectProduct.variants?.length || 0})</div>
                <div style={{ maxHeight: 140, overflowY: 'auto' }}>
                  <table className={styles.table}>
                    <thead>
                      <tr><th>Color</th><th>Size</th><th>SKU</th><th>Price</th><th>Stock</th></tr>
                    </thead>
                    <tbody>
                      {(inspectProduct.variants || []).map((v, i) => (<tr key={i}>
                          <td>{v.color}</td>
                          <td>{v.size}</td>
                          <td style={{ fontFamily: 'monospace' }}>{v.sku}</td>
                          <td>${v.price}</td>
                          <td>{v.stock} units</td>
                        </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Prompt (for changes or rejection) */}
              {actionType && (<div style={{ background: actionType === 'reject' ? '#fee2e2' : '#dbeafe', padding: '1rem', borderRadius: 10, marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: actionType === 'reject' ? '#991b1b' : '#1e40af', marginBottom: 6 }}>
                    {actionType === 'reject' ? 'Reason for Rejection *' : 'Changes Requested Notes for Merchant *'}
                  </div>
                  <textarea style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.84rem', outline: 'none' }} placeholder="Enter audit feedback..." value={adminNotesInput} onChange={e => setAdminNotesInput(e.target.value)}/>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                    <button className={styles.actionBtn} onClick={() => setActionType(null)}>Cancel</button>
                    <button className={styles.actionBtnPrimary} onClick={() => {
                    if (!adminNotesInput.trim())
                        return alert('Please enter audit feedback notes.');
                    handleAdminAction(inspectProduct.id, actionType, adminNotesInput.trim());
                }}>
                      Confirm {actionType === 'reject' ? 'Rejection' : 'Change Request'}
                    </button>
                  </div>
                </div>)}
            </div>

            {/* Admin Audit Actions */}
            <div className={styles.modalFooter} style={{ justifyContent: 'space-between' }}>
              <button className={styles.actionBtn} onClick={() => setInspectProduct(null)}>Close</button>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button className={styles.actionBtnDanger} onClick={() => setActionType('reject')}>
                  Reject Product
                </button>
                <button className={styles.actionBtn} style={{ background: '#dbeafe', color: '#1d4ed8', borderColor: '#bfdbfe' }} onClick={() => setActionType('request_changes')}>
                  Request Changes
                </button>
                <button className={styles.actionBtnPrimary} style={{ background: '#16a34a', color: '#fff' }} onClick={() => handleAdminAction(inspectProduct.id, 'approve')}>
                  <Check size={14}/> Approve & Publish Live 🚀
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </>);
}
