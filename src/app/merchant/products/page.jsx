"use client";
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, Plus, Search, Facebook } from 'lucide-react';
import { FacebookShopSync } from '@/components/merchant';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/productService';
import {
  ProductListTable,
  ProductWizardModal,
  ProductNotesModal
} from '@/components/merchant/products';
import './MerchantProducts.css';

const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses & Jumpsuits',
  'Casual',
  'Formal',
  'Ethnic',
  'Streetwear',
  'Luxury',
  'Athleisure'
];

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Multi-step Wizard modal state
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK_PRODUCT);

  // Admin review notes modal
  const [notesModal, setNotesModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    loadProducts();
  }, [user?.id]);

  const getEffectiveVendorId = () => {
    if (user?.role === 'merchant' && user?.id && user.id !== 'mch_tom_01') {
      return user.id;
    }
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
      const data = await productService.getMerchantProducts(vendorId);
      if (data && data.success && Array.isArray(data.products)) {
        const normalized = data.products.map((p) => ({
          ...p,
          name: (p.name || '').replace(/Atelier\s*/gi, 'Tailored '),
          image_url: p.imageUrl || p.image_url || '',
          back_image_url: p.backImageUrl || p.back_image_url || '',
          sale_price: p.salePrice || p.sale_price || null,
          target_audience: p.targetAudience || p.target_audience || 'Women',
          desc: (p.description || p.desc || '').replace(/Atelier\s*/gi, 'Studio '),
          stock: p.stock !== undefined ? p.stock : 25,
          status: p.status || 'live'
        }));
        setProducts(normalized);
        return;
      }
      setProducts([]);
    } catch (err) {
      console.error('Error loading merchant products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const generateVariants = (colors, sizes, basePrice, baseSku) => {
    const list = [];
    colors.forEach((c) => {
      sizes.forEach((s) => {
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
    const additionalImages = extra.additional_images || (extra.images ? extra.images.filter((img) => img !== (p.imageUrl || p.image_url)) : (p.additional_images || []));

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

  const submitProduct = async (targetStatus) => {
    if (!form.name || !form.name.trim()) {
      showToast('Product Name is required.', 'error');
      return;
    }
    if (targetStatus === 'live') {
      if (!form.price || Number(form.price) <= 0) {
        showToast('Product Regular Price is required to publish live.', 'error');
        return;
      }
      if (!form.image_url) {
        showToast('Main Product Image is required to publish live.', 'error');
        return;
      }
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
      price: form.price ? Number(form.price) : 0,
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
      const data = editingId
        ? await productService.updateProduct(editingId, payload)
        : await productService.createProduct(payload);

      if (data.success) {
        await loadProducts();
        setShowWizard(false);
        setEditingId(null);
        setForm(BLANK_PRODUCT);
        setStep(1);
        showToast(
          targetStatus === 'draft' ? 'Saved as Draft' : 'Product published live! Catalog updated.',
          'success'
        );
      } else {
        showToast(`Failed to save: ${data.error || 'Server error'}`, 'error');
      }
    } catch (err) {
      console.error('Error while saving product:', err);
      showToast('Error while saving product.', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product permanently from catalog?')) {
      try {
        const data = await productService.deleteProduct(id);
        if (data.success) {
          await loadProducts();
          showToast('Product deleted successfully.', 'info');
        } else {
          showToast(`Failed to delete: ${data.error || 'Server error'}`, 'error');
        }
      } catch (e) {
        console.error('Delete failed:', e);
        showToast('Failed to delete product.', 'error');
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = catalogFilter === 'all' || p.status === catalogFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="prod-shell">
      <div className="prod-container">
        {/* Header Bar */}
        <div className="prod-header">
          <div className="prod-header-text">
            <h1 className="prod-title">Product Listing & Management</h1>
            <p className="prod-subtitle">
              Manage products, multi-variant listings, inventory, and Meta catalog sync
            </p>
          </div>

          {tab === 'catalog' && (
            <div className="prod-header-actions">
              <div className="prod-search-box">
                <Search size={14} className="prod-search-icon" />
                <input
                  type="text"
                  className="prod-search-input"
                  placeholder="Search listings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="prod-btn-primary"
                onClick={openNewWizard}
              >
                <Plus size={15} />
                <span>Add Product</span>
              </button>
            </div>
          )}
        </div>

        {/* Section Tabs */}
        <div className="prod-tabs">
          <button
            type="button"
            onClick={() => setTab('catalog')}
            className={`prod-tab ${tab === 'catalog' ? 'prod-tab-active' : ''}`}
          >
            <Package size={16} />
            <span>Catalog ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('facebook')}
            className={`prod-tab ${tab === 'facebook' ? 'prod-tab-active' : ''}`}
          >
            <Facebook size={16} />
            <span>Facebook Shop Sync</span>
          </button>
        </div>

        {/* Tab 1: Catalog Table */}
        {tab === 'catalog' && (
          <ProductListTable
            products={filteredProducts}
            loading={loading}
            catalogFilter={catalogFilter}
            onFilterChange={setCatalogFilter}
            onOpenNew={openNewWizard}
            onOpenEdit={openEditWizard}
            onDelete={deleteProduct}
            onViewNotes={(notes) => setNotesModal(notes)}
          />
        )}

        {/* Tab 2: Facebook Shop Sync */}
        {tab === 'facebook' && (
          <FacebookShopSync products={products} />
        )}

        {/* Product Creation & Editing Wizard Modal */}
        <ProductWizardModal
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          step={step}
          setStep={setStep}
          editingId={editingId}
          form={form}
          setForm={setForm}
          onSubmit={submitProduct}
          onShowToast={showToast}
          categories={CATEGORIES}
          targetAudiences={TARGET_AUDIENCES}
          currencies={CURRENCIES}
          commonSizes={COMMON_SIZES}
          commonColors={COMMON_COLORS}
        />

        {/* Admin Feedback Notes Modal */}
        <ProductNotesModal
          isOpen={!!notesModal}
          modalData={notesModal}
          onClose={() => setNotesModal(null)}
        />

        {/* Toast Alert */}
        {toast && (
          <div className={`prod-toast prod-toast-${toast.type || 'success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✓'}</span>
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
