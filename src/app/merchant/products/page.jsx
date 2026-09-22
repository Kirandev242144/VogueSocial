"use client";
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../merchant.module.css';
import { Package, Plus, Edit2, Trash2, Search, ImagePlus, RefreshCw, Facebook, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { FacebookShopSync } from '@/components/merchant';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses & Jumpsuits', 'Casual', 'Formal', 'Ethnic', 'Streetwear', 'Luxury', 'Athleisure'];
const TARGET_AUDIENCES = ['Women', 'Men', 'Unisex', 'Kids'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];
const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COMMON_COLORS = ['Black', 'White', 'Navy', 'Beige', 'Red', 'Emerald', 'Grey', 'Brown'];
const BLANK_PRODUCT = {
    name: '',
    category: 'Tops',
    subcategory: '',
    target_audience: 'Women',
    sku: '',
    desc: '',
    image_url: '',
    back_image_url: '',
    additional_images: [],
    price: '',
    sale_price: '',
    cost_per_item: '',
    tax_rate: 0,
    currency: 'USD',
    inventory_tracking: true,
    low_stock_threshold: 5,
    allow_backorders: false,
    weight: '',
    requires_shipping: true,
    is_fragile: false,
    return_policy: '30-day returns accepted. Tags must remain attached.',
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L'],
    variants: [],
    care_instructions: 'Dry clean only. Do not tumble dry.',
    material_composition: '100% Organic Silk',
    country_of_origin: 'Italy',
    stock: 25,
    shipping_info: {
        regions: ['Domestic'],
        processing_time: '1-2 business days',
        method: 'Standard Shipping',
        fee: 0
    },
    return_policy: {
        returnable: true,
        return_window: '30 days',
        conditions: 'Unworn items in original packaging with tags attached.'
    }
};
export default function ProductsPage() {
    const { user } = useAuth();
    const location = useLocation();
    const [tab, setTab] = useState('catalog');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('tab') === 'facebook') {
            setTab('facebook');
        }
    }, [location.search]);

    const [catalogFilter, setCatalogFilter] = useState('all');
    // Catalog state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    // Multi-step Wizard modal state
    const [showWizard, setShowWizard] = useState(false);
    const [step, setStep] = useState(1);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(BLANK_PRODUCT);
    // Image inputs
    const [detailImgInput, setDetailImgInput] = useState('');
    const [colorInput, setColorInput] = useState('');
    // Selected admin notes modal
    const [notesModal, setNotesModal] = useState(null);
    // Facebook sync state
    const [fbSettings, setFbSettings] = useState({
        connected: false,
        page_name: '',
        catalog_name: '',
        auto_sync: false,
        clothing_only: true,
        logs: []
    });
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        loadProducts();
        loadFbSettings();
    }, [user?.id]);

    const getEffectiveVendorId = () => {
        if (user?.role === 'merchant' && user?.id && user.id !== 'mch_tom_01') {
            return user.id;
        }
        // If admin is testing/managing the platform flagship store
        if (user?.role === 'admin') {
            return 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';
        }
        if (user?.id && user.id !== 'mch_tom_01') {
            return user.id;
        }
        return 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';
    };

    const loadProducts = async () => {
        setLoading(true);
        try {
            const vendorId = getEffectiveVendorId();
            const res = await fetch(`/api/merchant/products?vendorId=${encodeURIComponent(vendorId)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success && Array.isArray(data.products)) {
                    const normalized = data.products.map(p => ({
                        ...p,
                        image_url: p.imageUrl || p.image_url || '',
                        back_image_url: p.backImageUrl || p.back_image_url || '',
                        sale_price: p.salePrice || p.sale_price || null,
                        target_audience: p.targetAudience || p.target_audience || 'Women',
                        desc: p.description || p.desc || '',
                        stock: p.stock !== undefined ? p.stock : 25,
                        status: p.status || 'live'
                    }));
                    setProducts(normalized);
                    return;
                }
            }
            setProducts([]);
        }
        catch (err) {
            console.error("Error loading merchant products from backend:", err);
            setProducts([]);
        }
        finally {
            setLoading(false);
        }
    };
    const loadFbSettings = async () => {
        try {
            const res = await fetch('/api/merchant/facebook/sync');
            const data = await res.json();
            if (data.success) {
                setFbSettings(data.settings);
            }
        }
        catch (err) { }
    };
    // Re-generate variant matrix when colors/sizes change
    const generateVariants = (colors, sizes, basePrice, baseSku) => {
        const list = [];
        colors.forEach(c => {
            sizes.forEach(s => {
                const vSku = `${baseSku ? baseSku.toUpperCase() : 'SKU'}-${c.substring(0, 3).toUpperCase()}-${s}`;
                list.push({
                    color: c,
                    size: s,
                    sku: vSku,
                    price: basePrice || 0,
                    stock: 10
                });
            });
        });
        return list;
    };
    const openNewWizard = () => {
        setEditingId(null);
        const initial = { ...BLANK_PRODUCT };
        initial.variants = generateVariants(initial.colors, initial.sizes, 49, 'VS-ITEM');
        setForm(initial);
        setStep(1);
        setShowWizard(true);
    };
    const openEditWizard = (p) => {
        setEditingId(p.id);
        let extra = {};
        try {
            if (p.adminNotes || p.admin_notes) {
                extra = JSON.parse(p.adminNotes || p.admin_notes);
            }
        } catch (e) {}

        const colors = extra.colors || (p.colors && p.colors.length ? p.colors : ['Black', 'White']);
        const sizes = extra.sizes || (p.sizes && p.sizes.length ? p.sizes : ['S', 'M', 'L']);
        const variants = extra.variants || (p.variants && p.variants.length ? p.variants : generateVariants(colors, sizes, Number(p.price) || 0, p.sku || 'SKU'));
        const additionalImages = extra.additional_images || (extra.images ? extra.images.filter(img => img !== (p.imageUrl || p.image_url)) : (p.additional_images || []));

        setForm({
            name: p.name || '',
            category: p.category || 'Tops',
            subcategory: p.subcategory || '',
            target_audience: p.target_audience || p.targetAudience || 'Women',
            sku: p.sku || '',
            desc: p.desc || p.description || '',
            image_url: p.image_url || p.imageUrl || '',
            back_image_url: p.back_image_url || p.backImageUrl || '',
            additional_images: additionalImages,
            price: String(p.price || ''),
            sale_price: p.sale_price || p.salePrice ? String(p.sale_price || p.salePrice) : '',
            currency: p.currency || 'USD',
            colors: colors,
            sizes: sizes,
            variants: variants,
            stock: p.stock !== undefined ? p.stock : 25,
            shipping_info: extra.shipping_info || p.shipping_info || BLANK_PRODUCT.shipping_info,
            return_policy: extra.return_policy || p.return_policy || BLANK_PRODUCT.return_policy
        });
        setStep(1);
        setShowWizard(true);
    };
    const toggleColor = (col) => {
        const nextColors = form.colors.includes(col)
            ? form.colors.filter(c => c !== col)
            : [...form.colors, col];
        const nextVariants = generateVariants(nextColors, form.sizes, Number(form.price) || 0, form.sku);
        setForm(p => ({ ...p, colors: nextColors, variants: nextVariants }));
    };
    const addCustomColor = () => {
        if (!colorInput.trim())
            return;
        const c = colorInput.trim();
        if (!form.colors.includes(c)) {
            const nextColors = [...form.colors, c];
            const nextVariants = generateVariants(nextColors, form.sizes, Number(form.price) || 0, form.sku);
            setForm(p => ({ ...p, colors: nextColors, variants: nextVariants }));
        }
        setColorInput('');
    };
    const toggleSize = (sz) => {
        const nextSizes = form.sizes.includes(sz)
            ? form.sizes.filter(s => s !== sz)
            : [...form.sizes, sz];
        const nextVariants = generateVariants(form.colors, nextSizes, Number(form.price) || 0, form.sku);
        setForm(p => ({ ...p, sizes: nextSizes, variants: nextVariants }));
    };
    const updateVariant = (index, field, value) => {
        const nextV = [...form.variants];
        nextV[index] = { ...nextV[index], [field]: value };
        setForm(p => ({ ...p, variants: nextV }));
    };
    const addDetailImage = () => {
        if (!detailImgInput.trim())
            return;
        setForm(p => ({ ...p, additional_images: [...p.additional_images, detailImgInput.trim()] }));
        setDetailImgInput('');
    };
    const removeDetailImage = (index) => {
        setForm(p => ({ ...p, additional_images: p.additional_images.filter((_, i) => i !== index) }));
    };
    // Submit product (Draft vs Live Publish)
    const submitProduct = async (targetStatus) => {
        if (!form.name || !form.name.trim() || !form.price) {
            showToast('Product Name and Price are required.', 'error');
            return;
        }
        if (!form.image_url) {
            showToast('Main Product Image is required.', 'error');
            return;
        }
        const totalStock = form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) || Number(form.stock) || 25;
        const vendorId = getEffectiveVendorId();
        const payload = {
            id: editingId || undefined,
            name: form.name.trim(),
            category: form.category,
            subcategory: form.subcategory || '',
            target_audience: form.target_audience,
            targetAudience: form.target_audience,
            sku: form.sku || `VS-${form.name.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
            desc: form.desc || '',
            description: form.desc || '',
            image_url: form.image_url,
            imageUrl: form.image_url,
            back_image_url: form.back_image_url || '',
            backImageUrl: form.back_image_url || '',
            additional_images: form.additional_images || [],
            price: Number(form.price),
            sale_price: form.sale_price ? Number(form.sale_price) : null,
            salePrice: form.sale_price ? Number(form.sale_price) : null,
            currency: form.currency || 'USD',
            colors: form.colors,
            sizes: form.sizes,
            variants: form.variants,
            stock: totalStock,
            shipping_info: form.shipping_info,
            return_policy: form.return_policy,
            status: targetStatus === 'draft' ? 'draft' : 'live',
            vendorId: vendorId,
            adminNotes: JSON.stringify({
                colors: form.colors,
                sizes: form.sizes,
                variants: form.variants,
                additional_images: form.additional_images,
                shipping_info: form.shipping_info,
                return_policy: form.return_policy
            })
        };
        try {
            const res = await fetch('/api/merchant/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                await loadProducts();
                setShowWizard(false);
                setEditingId(null);
                setForm(BLANK_PRODUCT);
                setStep(1);
                showToast(targetStatus === 'draft' ? '✓ Saved as Draft' : '🚀 Product published live! Catalog updated.', 'success');
            } else {
                showToast(`Failed to save: ${data.error || 'Server error'}`, 'error');
            }
        }
        catch (err) {
            console.error("Network error while saving product:", err);
            showToast("Network error while saving product.", 'error');
        }
    };
    const deleteProduct = async (id) => {
        if (window.confirm('Delete this product permanently from database?')) {
            try {
                const res = await fetch(`/api/merchant/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    await loadProducts();
                    showToast('Product deleted successfully.', 'info');
                } else {
                    showToast(`Failed to delete: ${data.error || 'Server error'}`, 'error');
                }
            }
            catch (e) {
                console.error("Delete failed:", e);
                showToast('Failed to delete product.', 'error');
            }
        }
    };
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = catalogFilter === 'all' || p.status === catalogFilter;
        return matchesSearch && matchesFilter;
    });
    const getStatusBadge = (status) => {
        switch (status) {
            case 'live':
                return <span className={`${styles.badge} ${styles.badgeDelivered}`}>Live</span>;
            case 'pending_approval':
                return <span className={`${styles.badge} ${styles.badgePending}`}>Pending Review</span>;
            case 'draft':
                return <span className={`${styles.badge} ${styles.badgeDraft}`}>Draft</span>;
            case 'changes_requested':
                return <span className={`${styles.badge} ${styles.badgeShipped}`}>Changes Requested</span>;
            case 'rejected':
                return <span className={`${styles.badge} ${styles.badgeCancelled}`}>Rejected</span>;
            default:
                return <span className={`${styles.badge} ${styles.badgeDraft}`}>{status}</span>;
        }
    };
    return (<div className={styles.pageContent}>
      {/* Page Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--d-t1)', margin: 0, fontFamily: 'var(--font-heading)' }}>Product Listing & Management</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--d-t3)', marginTop: 2 }}>Manage products, multi-variant listings, inventory, and Meta catalog sync</p>
        </div>
        {tab === 'catalog' && (<div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className={styles.searchBar}>
              <Search size={14} color="var(--d-t4)"/>
              <input placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <button className={styles.btnPrimary} onClick={openNewWizard}><Plus size={15}/>Add Product</button>
          </div>)}
      </div>

      {/* Main Section Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setTab('catalog')}
          className={`${styles.tab} ${tab === 'catalog' ? styles.tabActive : ''}`}
        >
          <Package size={16} />
          <span>Catalog ({products.length})</span>
        </button>
        <button
          onClick={() => setTab('facebook')}
          className={`${styles.tab} ${tab === 'facebook' ? styles.tabActive : ''}`}
        >
          <Facebook size={16} color="#1877f2" />
          <span>Facebook Shop Sync</span>
        </button>
      </div>

      {/* TAB 1: CATALOG */}
      {tab === 'catalog' && (<div className={styles.panel}>
          {/* Status Sub-filter Bar */}
          <div className={styles.panelHeader} style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
            <div className={styles.panelTitle}>Product Listings <span className={styles.panelBadge}>{filteredProducts.length}</span></div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'All Listings' },
                { key: 'live', label: 'Live Market' },
                { key: 'pending_approval', label: 'Pending Review' },
                { key: 'changes_requested', label: 'Changes Requested' },
                { key: 'draft', label: 'Drafts' },
                { key: 'rejected', label: 'Rejected' },
            ].map(f => (<button key={f.key} onClick={() => setCatalogFilter(f.key)} style={{
                    padding: '4px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600,
                    border: '1px solid var(--d-border)', cursor: 'pointer',
                    background: catalogFilter === f.key ? '#6366f1' : 'var(--d-card)',
                    color: catalogFilter === f.key ? '#ffffff' : 'var(--d-t2)'
                }}>
                  {f.label}
                </button>))}
            </div>
          </div>

          {loading ? (<div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0', color: 'var(--d-t3)' }}>
              <RefreshCw size={24} className="animate-spin" style={{ marginRight: 8 }}/> Loading listings...
            </div>) : filteredProducts.length === 0 ? (<div className={styles.empty}>
              <Package size={44} className={styles.emptyIcon} color="var(--d-t4)"/>
              <div className={styles.emptyTitle}>No products found</div>
              <div className={styles.emptyText}>Create a new product listing to submit it for Admin approval.</div>
              <button className={styles.btnPrimary} style={{ marginTop: '1.25rem' }} onClick={openNewWizard}><Plus size={15}/>Add Product</button>
            </div>) : (<div style={{ overflowX: 'auto' }}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product & SKU</th>
                    <th>Target & Category</th>
                    <th>Price</th>
                    <th>Stock & Status</th>
                    <th>Approval Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (<tr key={p.id}>
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.productIcon} style={{ width: 46, height: 46, borderRadius: 10 }}>
                            {p.image_url ? (<img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}/>) : (<Package size={18} color="var(--d-t4)"/>)}
                          </div>
                          <div>
                            <div className={styles.productName}>{p.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--d-t3)', marginTop: 1, fontFamily: 'monospace' }}>SKU: {p.sku || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--d-t1)' }}>{p.category}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--d-t3)' }}>{p.target_audience} · {p.subcategory || 'General'}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <span style={{ fontWeight: 800, color: 'var(--d-t1)', fontSize: '0.9rem' }}>${p.price}</span>
                          {p.sale_price && <span style={{ fontSize: '0.75rem', color: '#ef4444', marginLeft: 6, textDecoration: 'line-through' }}>${p.sale_price}</span>}
                        </div>
                      </td>
                      <td>
                        <div>
                          <span style={{ color: p.stock <= 0 ? '#ef4444' : 'var(--d-t1)', fontWeight: 700, fontSize: '0.84rem' }}>
                            {p.stock} units
                          </span>
                          <div style={{ fontSize: '0.7rem', color: p.stock <= 0 ? '#ef4444' : 'var(--d-t3)' }}>
                            {p.stock <= 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                          {getStatusBadge(p.status)}
                          {(p.status === 'changes_requested' || p.status === 'rejected') && p.admin_notes && (<button onClick={() => setNotesModal({ title: p.status === 'rejected' ? 'Rejection Reason' : 'Changes Requested by Admin', notes: p.admin_notes })} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                              View Feedback
                            </button>)}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className={styles.iconBtn} onClick={() => openEditWizard(p)} title="Edit Listing"><Edit2 size={14}/></button>
                          <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => deleteProduct(p.id)} title="Delete Listing"><Trash2 size={14}/></button>
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>)}
        </div>)}

      {/* TAB 2: FACEBOOK SHOP SYNC */}
      {tab === 'facebook' && <FacebookShopSync products={products} />}

      {/* ── 6-STEP PRODUCT CREATION / EDITING WIZARD MODAL ── */}
      {showWizard && (<div className={styles.overlay} onClick={() => setShowWizard(false)}>
          <div className={styles.modal} style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle}>{editingId ? 'Edit Product Listing' : 'Add New Product Listing'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--d-t3)' }}>Step {step} of 6 — {step === 1 ? 'Basic Product Information' :
                step === 2 ? 'Product Image Gallery' :
                    step === 3 ? 'Pricing & Variants Matrix' :
                        step === 4 ? 'Inventory & Stock Rules' :
                            step === 5 ? 'Shipping & Returns Policy' : 'Complete Product Review'}</div>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowWizard(false)}>✕</button>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ display: 'flex', background: 'var(--d-card)', borderBottom: '1px solid var(--d-border2)', padding: '0.65rem 1.5rem', gap: '0.5rem', overflowX: 'auto' }}>
              {['1. Basic Info', '2. Images', '3. Pricing & Variants', '4. Inventory', '5. Shipping & Returns', '6. Review & Submit'].map((label, idx) => {
                const stepNum = idx + 1;
                const active = step === stepNum;
                const completed = step > stepNum;
                return (<button key={label} onClick={() => setStep(stepNum)} style={{
                        padding: '4px 10px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700,
                        border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                        background: active ? '#6366f1' : completed ? '#e0e7ff' : 'transparent',
                        color: active ? '#ffffff' : completed ? '#4338ca' : 'var(--d-t3)'
                    }}>
                    {label}
                  </button>);
            })}
            </div>

            {/* Modal Body: STEP CONTENT */}
            <div className={styles.modalBody} style={{ minHeight: 360 }}>
              {/* STEP 1: BASIC INFORMATION */}
              {step === 1 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Product Name *</label>
                    <input className={styles.fInput} placeholder="e.g. Premium Silk Evening Gown" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}/>
                  </div>

                  <div className={styles.fRow}>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Category *</label>
                      <select className={styles.fSelect} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Subcategory</label>
                      <input className={styles.fInput} placeholder="e.g. Dresses / Jackets" value={form.subcategory} onChange={e => setForm(p => ({ ...p, subcategory: e.target.value }))}/>
                    </div>
                  </div>

                  <div className={styles.fRow}>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Target Audience / Gender *</label>
                      <select className={styles.fSelect} value={form.target_audience} onChange={e => setForm(p => ({ ...p, target_audience: e.target.value }))}>
                        {TARGET_AUDIENCES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Parent Product SKU *</label>
                      <input className={styles.fInput} placeholder="e.g. VS-DRESS-001" value={form.sku} onChange={e => setForm(p => ({ ...p, sku: e.target.value }))}/>
                    </div>
                  </div>

                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Product Description</label>
                    <textarea className={styles.fTextarea} placeholder="Detail item materials, weave, fit notes, and care instructions..." value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}/>
                  </div>
                </div>)}

              {/* STEP 2: PRODUCT IMAGES */}
              {step === 2 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className={styles.fRow}>
                    {/* Main Image */}
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Main Product Image (Front) *</label>
                      <div className={styles.uploadZone}>
                        {form.image_url ? (<div style={{ position: 'relative' }}>
                            <img src={form.image_url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}/>
                            <button onClick={() => setForm(p => ({ ...p, image_url: '' }))} style={{ position: 'absolute', top: 6, right: 6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer' }}>✕</button>
                          </div>) : (<ImagePlus size={28} color="var(--d-t4)"/>)}
                      </div>
                      <input className={styles.fInput} style={{ marginTop: 6 }} placeholder="Or paste main image URL..." value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}/>
                    </div>

                    {/* Back Image */}
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Back View Image (Optional)</label>
                      <div className={styles.uploadZone}>
                        {form.back_image_url ? (<div style={{ position: 'relative' }}>
                            <img src={form.back_image_url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}/>
                            <button onClick={() => setForm(p => ({ ...p, back_image_url: '' }))} style={{ position: 'absolute', top: 6, right: 6, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer' }}>✕</button>
                          </div>) : (<ImagePlus size={28} color="var(--d-t4)"/>)}
                      </div>
                      <input className={styles.fInput} style={{ marginTop: 6 }} placeholder="Or paste back view image URL..." value={form.back_image_url} onChange={e => setForm(p => ({ ...p, back_image_url: e.target.value }))}/>
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Additional / Detail Images Gallery</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input className={styles.fInput} placeholder="Paste detail shot URL..." value={detailImgInput} onChange={e => setDetailImgInput(e.target.value)}/>
                      <button className={styles.btnGhost} onClick={addDetailImage}>Add Image</button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {form.additional_images.map((img, idx) => (<div key={idx} style={{ position: 'relative', width: 80, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--d-border)' }}>
                          <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                          <button onClick={() => removeDetailImage(idx)} style={{ position: 'absolute', top: 2, right: 2, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: '0.65rem', cursor: 'pointer' }}>✕</button>
                        </div>))}
                    </div>
                  </div>
                </div>)}

              {/* STEP 3: PRICING & VARIANTS MATRIX */}
              {step === 3 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className={styles.fRow}>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Regular Price *</label>
                      <input className={styles.fInput} type="number" placeholder="89.00" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}/>
                    </div>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Sale Price (Optional)</label>
                      <input className={styles.fInput} type="number" placeholder="69.00" value={form.sale_price} onChange={e => setForm(p => ({ ...p, sale_price: e.target.value }))}/>
                    </div>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Currency</label>
                      <select className={styles.fSelect} value={form.currency} onChange={e => setForm(p => ({ ...p, currency: e.target.value }))}>
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Colors Selector */}
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Available Colors</label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: 6 }}>
                      {COMMON_COLORS.map(c => (<button key={c} type="button" className={`${styles.sizeBtn} ${form.colors.includes(c) ? styles.sizeBtnActive : ''}`} onClick={() => toggleColor(c)}>
                          {c}
                        </button>))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', maxWidth: 300 }}>
                      <input className={styles.fInput} placeholder="Add custom color..." value={colorInput} onChange={e => setColorInput(e.target.value)}/>
                      <button className={styles.btnGhost} onClick={addCustomColor}>Add</button>
                    </div>
                  </div>

                  {/* Sizes Selector */}
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Available Sizes</label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {COMMON_SIZES.map(s => (<button key={s} type="button" className={`${styles.sizeBtn} ${form.sizes.includes(s) ? styles.sizeBtnActive : ''}`} onClick={() => toggleSize(s)}>
                          {s}
                        </button>))}
                    </div>
                  </div>

                  {/* Generated Variant Matrix */}
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Generated Variant Matrix ({form.variants.length} Combinations)</label>
                    <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--d-border)', borderRadius: 10 }}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Variant SKU</th>
                            <th>Price ($)</th>
                            <th>Stock Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.variants.map((v, i) => (<tr key={i}>
                              <td style={{ fontWeight: 700 }}>{v.color}</td>
                              <td style={{ fontWeight: 700 }}>{v.size}</td>
                              <td>
                                <input className={styles.trackingInput} value={v.sku} onChange={e => updateVariant(i, 'sku', e.target.value)}/>
                              </td>
                              <td>
                                <input className={styles.trackingInput} type="number" style={{ width: 80 }} value={v.price} onChange={e => updateVariant(i, 'price', Number(e.target.value))}/>
                              </td>
                              <td>
                                <input className={styles.trackingInput} type="number" style={{ width: 80 }} value={v.stock} onChange={e => updateVariant(i, 'stock', Number(e.target.value))}/>
                              </td>
                            </tr>))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>)}

              {/* STEP 4: INVENTORY */}
              {step === 4 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className={styles.payoutHero} style={{ padding: '1.25rem 1.5rem' }}>
                    <div className={styles.payoutLabel}>Total Calculated Stock</div>
                    <div className={styles.payoutAmount}>
                      {form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)} Units
                    </div>
                    <div className={styles.payoutMeta}>
                      Status: {form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0) <= 0 ? '⚠️ Out of Stock (Auto-disabled)' : '✓ In Stock'}
                    </div>
                  </div>

                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Stock Distribution Summary</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className={styles.panel} style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, marginBottom: 8 }}>Stock by Color</div>
                        {form.colors.map(c => {
                    const count = form.variants.filter(v => v.color === c).reduce((sum, v) => sum + Number(v.stock), 0);
                    return (<div key={c} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '4px 0', borderBottom: '1px solid var(--d-border2)' }}>
                              <span>{c}</span>
                              <span style={{ fontWeight: 700 }}>{count} units</span>
                            </div>);
                })}
                      </div>

                      <div className={styles.panel} style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, marginBottom: 8 }}>Stock by Size</div>
                        {form.sizes.map(s => {
                    const count = form.variants.filter(v => v.size === s).reduce((sum, v) => sum + Number(v.stock), 0);
                    return (<div key={s} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '4px 0', borderBottom: '1px solid var(--d-border2)' }}>
                              <span>Size {s}</span>
                              <span style={{ fontWeight: 700 }}>{count} units</span>
                            </div>);
                })}
                      </div>
                    </div>
                  </div>
                </div>)}

              {/* STEP 5: SHIPPING & RETURNS */}
              {step === 5 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className={styles.fRow}>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Order Processing Time</label>
                      <select className={styles.fSelect} value={form.shipping_info.processing_time} onChange={e => setForm(p => ({ ...p, shipping_info: { ...p.shipping_info, processing_time: e.target.value } }))}>
                        <option value="1-2 business days">1-2 business days</option>
                        <option value="3-5 business days">3-5 business days</option>
                        <option value="1 week">1 week</option>
                      </select>
                    </div>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Shipping Fee ($)</label>
                      <input className={styles.fInput} type="number" placeholder="0.00 (Free)" value={form.shipping_info.fee} onChange={e => setForm(p => ({ ...p, shipping_info: { ...p.shipping_info, fee: Number(e.target.value) } }))}/>
                    </div>
                  </div>

                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Return Window & Conditions</label>
                    <div className={styles.fRow}>
                      <select className={styles.fSelect} value={form.return_policy.return_window} onChange={e => setForm(p => ({ ...p, return_policy: { ...p.return_policy, return_window: e.target.value } }))}>
                        <option value="14 days">14 days</option>
                        <option value="30 days">30 days</option>
                        <option value="60 days">60 days</option>
                      </select>
                      <input className={styles.fInput} placeholder="Return conditions..." value={form.return_policy.conditions} onChange={e => setForm(p => ({ ...p, return_policy: { ...p.return_policy, conditions: e.target.value } }))}/>
                    </div>
                  </div>
                </div>)}

              {/* STEP 6: COMPLETE REVIEW & SUBMISSION */}
              {step === 6 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CheckCircle2 size={24} color="#15803d"/>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#15803d' }}>Listing Checklist Complete</div>
                      <div style={{ fontSize: '0.78rem', color: '#166534' }}>Review your product listing parameters before submitting for Admin approval.</div>
                    </div>
                  </div>

                  <div className={styles.panel} style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <img src={form.image_url || '/Shop_images/1/basic2-500x750.jpeg'} alt="" style={{ width: 90, height: 110, objectFit: 'cover', borderRadius: 8 }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--d-t1)' }}>{form.name || 'Untitled Item'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--d-t3)' }}>{form.category} · {form.target_audience} · SKU: {form.sku}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#6366f1', marginTop: 4 }}>${form.price} {form.currency}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--d-t2)', marginTop: 4 }}>
                          {form.colors.length} Colors · {form.sizes.length} Sizes · {form.variants.reduce((s, v) => s + Number(v.stock), 0)} Total Stock Units
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>

            {/* Modal Footer Controls */}
            <div className={styles.modalFooter} style={{ justifyContent: 'space-between' }}>
              {step > 1 ? (<button className={styles.btnGhost} onClick={() => setStep(step - 1)}><ArrowLeft size={14}/> Back</button>) : <div />}

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button className={styles.btnGhost} onClick={() => submitProduct('draft')}>Save as Draft</button>
                {step < 6 ? (<button className={styles.btnPrimary} onClick={() => setStep(step + 1)}>Next Step <ArrowRight size={14}/></button>) : (<button className={styles.btnPrimary} style={{ background: '#16a34a' }} onClick={() => submitProduct('live')}>
                    Publish Live to Store & Catalog 🚀
                  </button>)}
              </div>
            </div>
          </div>
        </div>)}

      {/* Admin Notes Feedback Modal */}
      {notesModal && (<div className={styles.overlay} onClick={() => setNotesModal(null)}>
          <div className={styles.modal} style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>{notesModal.title}</div>
              <button className={styles.closeBtn} onClick={() => setNotesModal(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ fontSize: '0.88rem', color: 'var(--d-t2)', lineHeight: 1.5 }}>{notesModal.notes}</p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnPrimary} onClick={() => setNotesModal(null)}>Understood</button>
            </div>
          </div>
        </div>)}

      {/* Toast Notification Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 99999,
          background: toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#3b82f6' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 10,
          fontSize: '0.88rem',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          pointerEvents: 'none'
        }}>
          {toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✓'}
          <span>{toast.message}</span>
        </div>
      )}
    </div>);
}
