"use client";
import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Star,
  CheckCircle2,
  Package
} from 'lucide-react';

const STEP_ITEMS = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Images' },
  { num: 3, label: 'Pricing & Variants' },
  { num: 4, label: 'Inventory' },
  { num: 5, label: 'Shipping & Returns' },
  { num: 6, label: 'Review & Submit' }
];

export default function ProductWizardModal({
  isOpen,
  onClose,
  step,
  setStep,
  editingId,
  form,
  setForm,
  onSubmit,
  onShowToast,
  categories = [],
  targetAudiences = [],
  currencies = [],
  commonSizes = [],
  commonColors = []
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [detailImgInput, setDetailImgInput] = useState('');
  const [colorInput, setColorInput] = useState('');

  if (!isOpen) return null;

  // ── VARIANT GENERATION ──
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

  const toggleColor = (col) => {
    const nextColors = form.colors.includes(col)
      ? form.colors.filter((c) => c !== col)
      : [...form.colors, col];
    const nextVariants = generateVariants(nextColors, form.sizes, Number(form.price) || 0, form.sku);
    setForm((p) => ({ ...p, colors: nextColors, variants: nextVariants }));
  };

  const addCustomColor = () => {
    if (!colorInput.trim()) return;
    const c = colorInput.trim();
    if (!form.colors.includes(c)) {
      const nextColors = [...form.colors, c];
      const nextVariants = generateVariants(nextColors, form.sizes, Number(form.price) || 0, form.sku);
      setForm((p) => ({ ...p, colors: nextColors, variants: nextVariants }));
    }
    setColorInput('');
  };

  const toggleSize = (sz) => {
    const nextSizes = form.sizes.includes(sz)
      ? form.sizes.filter((s) => s !== sz)
      : [...form.sizes, sz];
    const nextVariants = generateVariants(form.colors, nextSizes, Number(form.price) || 0, form.sku);
    setForm((p) => ({ ...p, sizes: nextSizes, variants: nextVariants }));
  };

  const updateVariant = (index, field, value) => {
    const nextV = [...form.variants];
    nextV[index] = { ...nextV[index], [field]: value };
    setForm((p) => ({ ...p, variants: nextV }));
  };

  // ── IMAGE GALLERY HELPERS ──
  const getAllImages = () => {
    return [form.image_url, ...(form.additional_images || [])].filter(Boolean);
  };

  const updateAllImages = (imgs) => {
    const unique = Array.from(new Set(imgs.filter(Boolean)));
    const main = unique[0] || '';
    const extras = unique.slice(1);
    setForm((p) => ({
      ...p,
      image_url: main,
      additional_images: extras,
      back_image_url: unique[1] || ''
    }));
  };

  const processImageFile = (file) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1000;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(null);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleMultipleFilesUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    onShowToast?.(`Processing ${files.length} photo${files.length > 1 ? 's' : ''}...`, 'info');
    const results = await Promise.all(files.map((f) => processImageFile(f)));
    const valid = results.filter(Boolean);
    if (valid.length === 0) {
      onShowToast?.('Please select valid image files (JPG, PNG, WEBP).', 'error');
      return;
    }
    const current = getAllImages();
    updateAllImages([...current, ...valid]);
    onShowToast?.(`Added ${valid.length} photo${valid.length > 1 ? 's' : ''} to gallery!`, 'success');
  };

  const handleAddImageUrl = () => {
    if (!detailImgInput.trim()) return;
    const url = detailImgInput.trim();
    const current = getAllImages();
    updateAllImages([...current, url]);
    setDetailImgInput('');
    onShowToast?.('Image URL added to gallery.', 'success');
  };

  const handleRemoveImage = (index) => {
    const current = getAllImages();
    const next = current.filter((_, i) => i !== index);
    updateAllImages(next);
    onShowToast?.('Photo removed from gallery.', 'info');
  };

  const handleSetCover = (index) => {
    const current = getAllImages();
    if (index <= 0 || index >= current.length) return;
    const chosen = current[index];
    const rest = current.filter((_, i) => i !== index);
    updateAllImages([chosen, ...rest]);
    onShowToast?.('Set as main storefront cover!', 'success');
  };

  const handleMoveImage = (fromIdx, toIdx) => {
    const current = getAllImages();
    if (toIdx < 0 || toIdx >= current.length) return;
    const moved = [...current];
    const [target] = moved.splice(fromIdx, 1);
    moved.splice(toIdx, 0, target);
    updateAllImages(moved);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!form.name || !form.name.trim()) {
        onShowToast?.('Please enter a product name before proceeding.', 'error');
        return;
      }
    }
    if (step === 2) {
      const imgs = getAllImages();
      if (imgs.length === 0) {
        onShowToast?.('Please upload at least one product photo for your listing.', 'error');
        return;
      }
    }
    if (step === 3) {
      if (!form.price || Number(form.price) <= 0) {
        onShowToast?.('Please enter a regular price for the item.', 'error');
        return;
      }
    }
    setStep((s) => Math.min(6, s + 1));
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1: return 'Basic Product Information';
      case 2: return 'Product Image Gallery';
      case 3: return 'Pricing & Variants Matrix';
      case 4: return 'Inventory & Stock Rules';
      case 5: return 'Shipping & Returns Policy';
      case 6: return 'Complete Product Review';
      default: return '';
    }
  };

  const totalCalculatedStock = form.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  const images = getAllImages();

  return (
    <div className="prod-modal-overlay" onClick={onClose}>
      <div className="prod-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="prod-modal-header">
          <div>
            <h3 className="prod-modal-title">
              {editingId ? 'Edit Product Listing' : 'Add New Product Listing'}
            </h3>
            <div className="prod-modal-subtitle">
              Step {step} of 6 — {getStepSubtitle()}
            </div>
          </div>
          <button
            type="button"
            className="prod-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="prod-stepper-bar">
          {STEP_ITEMS.map((item) => {
            const active = step === item.num;
            const completed = step > item.num;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => setStep(item.num)}
                className={`prod-step-pill ${
                  active ? 'prod-step-pill-active' : completed ? 'prod-step-pill-completed' : ''
                }`}
              >
                <span className="prod-step-num">
                  {completed ? '✓' : item.num}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="prod-modal-body">
          {/* STEP 1: BASIC INFORMATION */}
          {step === 1 && (
            <>
              <div className="prod-form-group">
                <label className="prod-form-label">Product Name *</label>
                <input
                  type="text"
                  className="prod-form-input"
                  placeholder="e.g. Silk Evening Gown"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="prod-form-row">
                <div className="prod-form-group">
                  <label className="prod-form-label">Category *</label>
                  <select
                    className="prod-form-select"
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">Subcategory</label>
                  <input
                    type="text"
                    className="prod-form-input"
                    placeholder="e.g. Dresses / Jackets"
                    value={form.subcategory}
                    onChange={(e) => setForm((p) => ({ ...p, subcategory: e.target.value }))}
                  />
                </div>
              </div>

              <div className="prod-form-row">
                <div className="prod-form-group">
                  <label className="prod-form-label">Target Audience / Gender *</label>
                  <select
                    className="prod-form-select"
                    value={form.target_audience}
                    onChange={(e) => setForm((p) => ({ ...p, target_audience: e.target.value }))}
                  >
                    {targetAudiences.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">Parent Product SKU *</label>
                  <input
                    type="text"
                    className="prod-form-input"
                    placeholder="e.g. VS-DRESS-001"
                    value={form.sku}
                    onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                  />
                </div>
              </div>

              <div className="prod-form-group">
                <label className="prod-form-label">Product Description</label>
                <textarea
                  className="prod-form-textarea"
                  placeholder="Detail item materials, weave, fit notes, and care instructions..."
                  value={form.desc}
                  onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
                />
              </div>
            </>
          )}

          {/* STEP 2: MULTI-IMAGE GALLERY */}
          {step === 2 && (
            <>
              <div className="prod-gallery-top">
                <div>
                  <div className="prod-gallery-title">
                    Product Media Gallery ({images.length} Photos)
                  </div>
                  <div className="prod-gallery-sub">
                    Upload multiple angles of this garment. The first photo is your <strong>Main Storefront Cover</strong>.
                  </div>
                </div>
                {images.length > 0 && (
                  <span className="prod-count-pill">
                    ✓ {images.length} Photo{images.length > 1 ? 's' : ''} Uploaded
                  </span>
                )}
              </div>

              {/* Multi-file Drag & Drop Area */}
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                className="prod-hidden-file-input"
                onChange={(e) => {
                  if (e.target.files) handleMultipleFilesUpload(e.target.files);
                }}
              />
              <div
                className={`prod-dropzone ${isDragging ? 'prod-dropzone-active' : ''}`}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                  if (e.dataTransfer.files) handleMultipleFilesUpload(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="prod-dropzone-icon-wrap">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <div className="prod-dropzone-title">
                    Click to browse or drag & drop multiple photos
                  </div>
                  <div className="prod-dropzone-sub">
                    Supports PNG, JPG, WEBP • Select multiple images simultaneously
                  </div>
                </div>
                <button
                  type="button"
                  className="prod-btn-secondary"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  <Plus size={14} />
                  <span>Choose Files from Device</span>
                </button>
              </div>

              {/* URL fallback bar */}
              <div className="prod-url-bar">
                <input
                  type="text"
                  className="prod-form-input"
                  placeholder="Or paste an image URL (https://...)"
                  value={detailImgInput}
                  onChange={(e) => setDetailImgInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  className="prod-btn-secondary"
                  onClick={handleAddImageUrl}
                >
                  Add URL
                </button>
              </div>

              {/* Gallery Grid */}
              {images.length === 0 ? (
                <div className="prod-empty">
                  <div className="prod-empty-text">
                    No photos uploaded yet. Upload front, back, and lookbook angles of your piece.
                  </div>
                </div>
              ) : (
                <div className="prod-gallery-grid">
                  {images.map((img, idx) => {
                    const isCover = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`prod-gallery-item ${isCover ? 'prod-gallery-item-cover' : ''}`}
                      >
                        <img
                          src={img}
                          alt={`Product view ${idx + 1}`}
                          className="prod-gallery-img"
                        />

                        {isCover ? (
                          <div className="prod-gallery-cover-badge">
                            <Star size={10} fill="#ffffff" />
                            <span>Cover</span>
                          </div>
                        ) : (
                          <div className="prod-gallery-num-badge">
                            #{idx + 1}
                          </div>
                        )}

                        <button
                          type="button"
                          className="prod-gallery-delete-btn"
                          onClick={() => handleRemoveImage(idx)}
                          title="Remove photo"
                        >
                          ✕
                        </button>

                        <div className="prod-gallery-actions">
                          {!isCover && (
                            <button
                              type="button"
                              className="prod-gallery-btn-cover"
                              onClick={() => handleSetCover(idx)}
                              title="Make cover image"
                            >
                              <Star size={10} />
                              <span>Make Cover</span>
                            </button>
                          )}
                          {idx > 0 && (
                            <button
                              type="button"
                              className="prod-gallery-btn-arrow"
                              onClick={() => handleMoveImage(idx, idx - 1)}
                              title="Move left"
                            >
                              ←
                            </button>
                          )}
                          {idx < images.length - 1 && (
                            <button
                              type="button"
                              className="prod-gallery-btn-arrow"
                              onClick={() => handleMoveImage(idx, idx + 1)}
                              title="Move right"
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* STEP 3: PRICING & VARIANTS */}
          {step === 3 && (
            <>
              <div className="prod-form-row-3">
                <div className="prod-form-group">
                  <label className="prod-form-label">Regular Price *</label>
                  <input
                    type="number"
                    className="prod-form-input"
                    placeholder="89.00"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">Sale Price (Optional)</label>
                  <input
                    type="number"
                    className="prod-form-input"
                    placeholder="69.00"
                    value={form.sale_price}
                    onChange={(e) => setForm((p) => ({ ...p, sale_price: e.target.value }))}
                  />
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">Currency</label>
                  <select
                    className="prod-form-select"
                    value={form.currency}
                    onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                  >
                    {currencies.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Colors */}
              <div className="prod-form-group">
                <label className="prod-form-label">Available Colors</label>
                <div className="prod-chip-wrap">
                  {commonColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`prod-chip ${form.colors.includes(c) ? 'prod-chip-active' : ''}`}
                      onClick={() => toggleColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="prod-custom-chip-row">
                  <input
                    type="text"
                    className="prod-form-input"
                    placeholder="Add custom color..."
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="prod-btn-secondary"
                    onClick={addCustomColor}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Sizes */}
              <div className="prod-form-group">
                <label className="prod-form-label">Available Sizes</label>
                <div className="prod-chip-wrap">
                  {commonSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`prod-chip ${form.sizes.includes(s) ? 'prod-chip-active' : ''}`}
                      onClick={() => toggleSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variant Matrix */}
              <div className="prod-form-group">
                <label className="prod-form-label">
                  Generated Variant Matrix ({form.variants.length} Combinations)
                </label>
                <div className="prod-matrix-table-wrap">
                  <table className="prod-matrix-table">
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
                      {form.variants.map((v, i) => (
                        <tr key={i}>
                          <td><strong>{v.color}</strong></td>
                          <td><strong>{v.size}</strong></td>
                          <td>
                            <input
                              type="text"
                              className="prod-matrix-input"
                              value={v.sku}
                              onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="prod-matrix-input prod-matrix-input-sm"
                              value={v.price}
                              onChange={(e) => updateVariant(i, 'price', Number(e.target.value))}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="prod-matrix-input prod-matrix-input-sm"
                              value={v.stock}
                              onChange={(e) => updateVariant(i, 'stock', Number(e.target.value))}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* STEP 4: INVENTORY */}
          {step === 4 && (
            <>
              <div className="prod-inventory-hero">
                <div className="prod-inventory-label">Total Calculated Stock</div>
                <div className="prod-inventory-val">
                  {totalCalculatedStock} Units
                </div>
                <div className="prod-inventory-status">
                  Status: {totalCalculatedStock <= 0 ? 'Out of Stock (Auto-disabled)' : '✓ In Stock'}
                </div>
              </div>

              <div className="prod-form-group">
                <label className="prod-form-label">Stock Distribution Summary</label>
                <div className="prod-summary-grid">
                  <div className="prod-summary-panel">
                    <div className="prod-summary-title">Stock by Color</div>
                    {form.colors.map((c) => {
                      const count = form.variants
                        .filter((v) => v.color === c)
                        .reduce((sum, v) => sum + Number(v.stock), 0);
                      return (
                        <div key={c} className="prod-summary-row">
                          <span>{c}</span>
                          <strong>{count} units</strong>
                        </div>
                      );
                    })}
                  </div>

                  <div className="prod-summary-panel">
                    <div className="prod-summary-title">Stock by Size</div>
                    {form.sizes.map((s) => {
                      const count = form.variants
                        .filter((v) => v.size === s)
                        .reduce((sum, v) => sum + Number(v.stock), 0);
                      return (
                        <div key={s} className="prod-summary-row">
                          <span>Size {s}</span>
                          <strong>{count} units</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 5: SHIPPING & RETURNS */}
          {step === 5 && (
            <>
              <div className="prod-form-row">
                <div className="prod-form-group">
                  <label className="prod-form-label">Order Processing Time</label>
                  <select
                    className="prod-form-select"
                    value={form.shipping_info?.processing_time || '1-2 business days'}
                    onChange={(e) => setForm((p) => ({
                      ...p,
                      shipping_info: { ...p.shipping_info, processing_time: e.target.value }
                    }))}
                  >
                    <option value="1-2 business days">1-2 business days</option>
                    <option value="3-5 business days">3-5 business days</option>
                    <option value="1 week">1 week</option>
                  </select>
                </div>

                <div className="prod-form-group">
                  <label className="prod-form-label">Shipping Fee ($)</label>
                  <input
                    type="number"
                    className="prod-form-input"
                    placeholder="0.00 (Free)"
                    value={form.shipping_info?.fee || 0}
                    onChange={(e) => setForm((p) => ({
                      ...p,
                      shipping_info: { ...p.shipping_info, fee: Number(e.target.value) }
                    }))}
                  />
                </div>
              </div>

              <div className="prod-form-group">
                <label className="prod-form-label">Return Window & Conditions</label>
                <div className="prod-form-row">
                  <select
                    className="prod-form-select"
                    value={form.return_policy?.return_window || '30 days'}
                    onChange={(e) => setForm((p) => ({
                      ...p,
                      return_policy: { ...p.return_policy, return_window: e.target.value }
                    }))}
                  >
                    <option value="14 days">14 days</option>
                    <option value="30 days">30 days</option>
                    <option value="60 days">60 days</option>
                  </select>
                  <input
                    type="text"
                    className="prod-form-input"
                    placeholder="Return conditions..."
                    value={form.return_policy?.conditions || ''}
                    onChange={(e) => setForm((p) => ({
                      ...p,
                      return_policy: { ...p.return_policy, conditions: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </>
          )}

          {/* STEP 6: COMPLETE REVIEW */}
          {step === 6 && (
            <>
              <div className="prod-review-banner">
                <CheckCircle2 size={22} className="prod-review-banner-icon" />
                <div>
                  <div className="prod-review-banner-title">Listing Checklist Complete</div>
                  <div className="prod-review-banner-sub">
                    Review your product parameters before submitting for Admin approval.
                  </div>
                </div>
              </div>

              <div className="prod-review-card">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt=""
                    className="prod-review-thumb"
                  />
                ) : (
                  <div className="prod-thumb">
                    <Package size={28} />
                  </div>
                )}
                <div className="prod-review-info">
                  <div className="prod-review-title">{form.name || 'Untitled Item'}</div>
                  <div className="prod-review-meta">
                    {form.category} · {form.target_audience} · SKU: {form.sku}
                  </div>
                  <div className="prod-review-price">
                    ${form.price} {form.currency}
                  </div>
                  <div className="prod-review-stats">
                    {images.length} Photos · {form.colors.length} Colors · {form.sizes.length} Sizes · {totalCalculatedStock} Total Stock Units
                  </div>
                  {images.length > 1 && (
                    <div className="prod-review-extra-thumbs">
                      {images.slice(1).map((extraImg, i) => (
                        <img
                          key={i}
                          src={extraImg}
                          alt=""
                          className="prod-review-extra-thumb"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="prod-modal-footer">
          {step > 1 ? (
            <button
              type="button"
              className="prod-btn-secondary"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="prod-header-actions">
            <button
              type="button"
              className="prod-btn-secondary"
              onClick={() => onSubmit('draft')}
            >
              Save as Draft
            </button>

            {step < 6 ? (
              <button
                type="button"
                className="prod-btn-primary"
                onClick={handleNextStep}
              >
                <span>Next Step</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="prod-btn-success"
                onClick={() => onSubmit('live')}
              >
                <span>Publish Live to Store</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
