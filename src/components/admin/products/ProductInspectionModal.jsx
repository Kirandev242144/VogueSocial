"use client";
import React, { useState, useEffect } from 'react';
import {
  X, Check, AlertTriangle, ShieldAlert, CheckCircle, ExternalLink,
  ZoomIn, Eye, Sparkles, Building2, Package, Tag, Layers,
  ShieldCheck, Truck, RotateCcw, AlertCircle, MessageSquare,
  Lock, ArrowRight, Info, FileCheck, Sliders
} from 'lucide-react';
import { AdminModal, AdminStatusBadge } from '../index';

export default function ProductInspectionModal({
  product,
  isOpen,
  onClose,
  onDecision,
  loading = false
}) {
  if (!product || !isOpen) return null;

  // Active review section tab
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'compliance' | 'logistics'

  // Extract all photos submitted by merchant
  const allImages = React.useMemo(() => {
    const list = [];
    if (product.imageUrl || product.image_url || product.image) {
      list.push({ url: product.imageUrl || product.image_url || product.image, label: 'Front Editorial' });
    }
    if (product.backImageUrl || product.back_image_url) {
      list.push({ url: product.backImageUrl || product.back_image_url, label: 'Back Tailoring' });
    }
    if (Array.isArray(product.additional_images)) {
      product.additional_images.forEach((img, idx) => {
        if (img && !list.some(item => item.url === img)) {
          list.push({ url: img, label: `Detail View #${idx + 1}` });
        }
      });
    }
    // Fallback if none provided
    if (list.length === 0) {
      list.push({ url: '/Shop_images/1/basic2-500x750.jpeg', label: 'Primary Silhouette' });
    }
    return list;
  }, [product]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Review checklist state (5 quality gates)
  const [checklist, setChecklist] = useState({
    imagery_quality: false,
    spec_completeness: false,
    policy_compliance: false,
    claim_veracity: false,
    ip_clearance: false
  });

  // Two-tier notes
  const [internalNotes, setInternalNotes] = useState(product.internal_notes || product.admin_notes || '');
  const [merchantFeedback, setMerchantFeedback] = useState(product.merchant_feedback || '');
  const [activeNoteTab, setActiveNoteTab] = useState('internal'); // 'internal' | 'merchant'

  // Sub-dialogs for actions
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectCategory, setRejectCategory] = useState('Listing Incomplete / Low-Res Photos');
  const [rejectReason, setRejectReason] = useState('');

  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changesRequestedText, setChangesRequestedText] = useState('');

  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setInternalNotes(product.internal_notes || product.admin_notes || '');
      setMerchantFeedback(product.merchant_feedback || '');
      // If already live, mark checklist complete by default
      if (product.status === 'live') {
        setChecklist({
          imagery_quality: true,
          spec_completeness: true,
          policy_compliance: true,
          claim_veracity: true,
          ip_clearance: true
        });
      } else {
        setChecklist({
          imagery_quality: Boolean(product.checklist_results?.imagery_quality),
          spec_completeness: Boolean(product.checklist_results?.spec_completeness),
          policy_compliance: Boolean(product.checklist_results?.policy_compliance),
          claim_veracity: Boolean(product.checklist_results?.claim_veracity),
          ip_clearance: Boolean(product.checklist_results?.ip_clearance)
        });
      }
    }
  }, [product]);

  const showToast = (msg, type = 'success') => {
    setFeedbackToast({ msg, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleToggleCheck = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePassAllChecks = () => {
    const allPassed = Object.values(checklist).every(Boolean);
    const newVal = !allPassed;
    setChecklist({
      imagery_quality: newVal,
      spec_completeness: newVal,
      policy_compliance: newVal,
      claim_veracity: newVal,
      ip_clearance: newVal
    });
  };

  const totalChecks = 5;
  const passedChecksCount = Object.values(checklist).filter(Boolean).length;
  const allChecksPassed = passedChecksCount === totalChecks;

  // Merchant binding with robust fallbacks
  const vendorName = product.vendor?.store_name || product.vendorName || (product.vendorId === 'mch_elena_02' ? 'Elena Couture' : 'Studio Label Paris');
  const vendorHandle = product.vendor?.store_handle || product.vendorHandle || (product.vendorId === 'mch_elena_02' ? 'elenacouture' : 'studiolabel');
  const vendorCountry = product.vendor?.country || 'France';
  const vendorId = product.vendorId || product.vendor?.vendor_id || product.vendor?.id || 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';

  // Action handlers
  const handleApprove = async () => {
    if (!allChecksPassed) {
      alert('Please complete all 5 quality audit checks before publishing this garment live to the marketplace.');
      return;
    }
    if (onDecision) {
      await onDecision('approve', {
        internalNotes,
        merchantFeedback,
        checklist,
        reviewerName: 'Platform Root Admin'
      });
      setShowApproveConfirm(false);
      showToast('Garment approved and published live to VogueSocial catalog!');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please specify the exact reason for rejecting this listing.');
      return;
    }
    if (onDecision) {
      await onDecision('reject', {
        rejectionReason: `${rejectCategory}: ${rejectReason}`,
        internalNotes: `Rejected by compliance auditor (${rejectCategory}). Reason: ${rejectReason}. Internal Note: ${internalNotes}`,
        merchantFeedback: rejectReason,
        checklist,
        reviewerName: 'Platform Root Admin'
      });
      setShowRejectModal(false);
      setRejectReason('');
      showToast('Listing rejected and compliance feedback sent to merchant.', 'error');
    }
  };

  const handleRequestChanges = async () => {
    if (!changesRequestedText.trim()) {
      alert('Please describe the specific corrections requested from the merchant.');
      return;
    }
    if (onDecision) {
      await onDecision('request_changes', {
        merchantFeedback: changesRequestedText,
        internalNotes,
        checklist,
        reviewerName: 'Platform Root Admin'
      });
      setShowChangesModal(false);
      setChangesRequestedText('');
      showToast('Changes requested. Merchant notified with revision checklist.');
    }
  };

  const price = product.salePrice || product.price || 590;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : null;
  const discountPct = originalPrice ? Math.round(((originalPrice - product.salePrice) / originalPrice) * 100) : null;
  const colors = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors
    : ['Camel Beige', 'Obsidian Black', 'Cream White'];
  const sizes = Array.isArray(product.sizes) && product.sizes.length > 0
    ? product.sizes
    : ['XS', 'S', 'M', 'L', 'XL'];
  const stock = product.stock ?? 28;
  const materials = product.materials || '98% European Virgin Wool, 2% Elastane (Lining: 100% Cupro)';
  const currentStatus = product.status || 'pending_approval';

  return (
    <>
      <AdminModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Inspect Garment: ${product.name}`}
        maxWidth="920px"
        footer={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
              <span>SKU:</span>
              <code style={{ fontFamily: 'monospace', color: 'var(--adm-text-main)', fontWeight: 600 }}>{product.sku || 'SL-TRN-001'}</code>
              <span style={{ color: 'var(--adm-border)' }}>•</span>
              <span>Auditing:</span>
              <strong style={{ color: 'var(--adm-text-main)' }}>{vendorName}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={onClose}
                disabled={loading}
              >
                Close
              </button>

              {currentStatus !== 'rejected' && (
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => setShowRejectModal(true)}
                  disabled={loading}
                >
                  <ShieldAlert size={12} /> Reject Listing
                </button>
              )}

              {currentStatus !== 'changes_requested' && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowChangesModal(true)}
                  disabled={loading}
                >
                  <MessageSquare size={12} /> Request Changes
                </button>
              )}

              {currentStatus === 'live' ? (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setShowChangesModal(true)}
                  disabled={loading}
                >
                  <Sliders size={12} /> Delist / Require Edits
                </button>
              ) : (
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => setShowApproveConfirm(true)}
                  disabled={loading || !allChecksPassed}
                  title={!allChecksPassed ? 'Complete the 5 review checks above to enable approval' : 'Approve garment for live marketplace listing'}
                  style={{ opacity: allChecksPassed ? 1 : 0.65 }}
                >
                  <Check size={12} /> Approve & Publish Live
                </button>
              )}
            </div>
          </div>
        }
      >
        {/* Toast Notification */}
        {feedbackToast && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              background: feedbackToast.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: feedbackToast.type === 'success' ? '#10b981' : '#ef4444',
              border: `1px solid ${feedbackToast.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}
          >
            {feedbackToast.msg}
          </div>
        )}

        {/* Merchant & Garment Executive Header Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            background: 'var(--adm-panel-hover)',
            border: '1px solid var(--adm-border)',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Merchant Identity Block (Resolves the '(@)' Bug) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'var(--adm-bg)',
                border: '1px solid var(--adm-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'var(--adm-accent)'
              }}
            >
              {vendorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                  {vendorName}
                </span>
                <a
                  href={`/store/${vendorHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--adm-accent)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  @{vendorHandle}
                  <ExternalLink size={10} />
                </a>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '1px' }}>
                Atelier: {vendorCountry} • <a href="/admin/vendors" style={{ color: 'var(--adm-text-main)', textDecoration: 'underline' }}>View Merchant Audit Dossier</a>
              </div>
            </div>
          </div>

          {/* Product Lifecycle Badge & Price */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                ${price}
                {originalPrice && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                    ${originalPrice}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)' }}>
                SKU: {product.sku || 'SL-TRN-001'}
              </div>
            </div>
            <AdminStatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Two-Column Inspection Workspace */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
          
          {/* Left Column: Multi-Photo Editorial Gallery with Zoom */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Main Active Photo View */}
            <div
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'var(--adm-panel-hover)',
                border: '1px solid var(--adm-border)',
                aspectRatio: '3/4'
              }}
            >
              <img
                src={allImages[activeImageIdx]?.url}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }}
                onClick={() => setIsZoomOpen(true)}
              />

              {/* Photo View Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 600
                }}
              >
                {allImages[activeImageIdx]?.label} ({activeImageIdx + 1}/{allImages.length})
              </div>

              {/* Zoom Trigger Button */}
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setIsZoomOpen(true)}
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  padding: '4px 8px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '0.68rem',
                  gap: '4px'
                }}
              >
                <ZoomIn size={12} /> Zoom & Inspect
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Submitted Imagery ({allImages.length} photos)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(allImages.length, 5)}, 1fr)`, gap: '6px' }}>
                {allImages.map((img, idx) => {
                  const isActive = idx === activeImageIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      style={{
                        padding: 0,
                        border: `2px solid ${isActive ? 'var(--adm-accent)' : 'var(--adm-border)'}`,
                        borderRadius: '6px',
                        overflow: 'hidden',
                        aspectRatio: '1/1',
                        background: 'var(--adm-bg)',
                        cursor: 'pointer',
                        opacity: isActive ? 1 : 0.7,
                        transition: 'opacity 0.15s, border-color 0.15s'
                      }}
                      title={img.label}
                    >
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Garment Authenticity Badge Card */}
            <div style={{ padding: '0.65rem 0.8rem', borderRadius: '6px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', fontSize: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600, marginBottom: '2px' }}>
                <ShieldCheck size={13} />
                <span>Atelier Direct Certified</span>
              </div>
              <div style={{ color: 'var(--adm-text-sub)', fontSize: '0.66rem' }}>
                {product.authenticity_certificate || 'Authenticity verified directly by registered atelier owner.'}
              </div>
            </div>
          </div>

          {/* Right Column: Garment Specs, Checklist & Two-Tier Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Segmented Section Navigation */}
            <div className="admin-tab-nav" style={{ margin: 0 }}>
              {[
                { id: 'overview', label: 'Specs & Variants' },
                { id: 'compliance', label: 'Review Checklist', badge: `${passedChecksCount}/5` },
                { id: 'notes', label: 'Audit Notes & Feedback' }
              ].map(tab => {
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={`admin-tab-nav-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveSection(tab.id)}
                    style={{ fontSize: '0.74rem', padding: '6px 10px' }}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className="admin-tab-badge"
                        style={{
                          background: allChecksPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: allChecksPassed ? '#10b981' : '#f59e0b'
                        }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Section 1: Specs & Variants */}
            {activeSection === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Categorization & Department */}
                <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department</div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--adm-text-main)', marginTop: '2px' }}>
                        {product.targetAudience || 'Women'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--adm-text-main)', marginTop: '2px' }}>
                        {product.category}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Subcategory</div>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--adm-text-main)', marginTop: '2px' }}>
                        {product.subcategory || 'Tailoring & Outerwear'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sizing & Color Variants */}
                <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                    Garment Variants & Inventory
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {/* Sizes */}
                    <div>
                      <span style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '3px' }}>Available Sizes:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {sizes.map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'var(--adm-panel-hover)',
                              border: '1px solid var(--adm-border-subtle)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: 'var(--adm-text-main)'
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <span style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '3px' }}>Submitted Colorways:</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {colors.map((c, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'var(--adm-panel-hover)',
                              border: '1px solid var(--adm-border-subtle)',
                              fontSize: '0.72rem',
                              fontWeight: 500,
                              color: 'var(--adm-text-main)'
                            }}
                          >
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: c.toLowerCase().includes('black') || c.toLowerCase().includes('obsidian') ? '#1e293b' : (c.toLowerCase().includes('white') || c.toLowerCase().includes('cream') ? '#f8fafc' : '#d97706'), border: '1px solid #94a3b8' }} />
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stock level */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px dashed var(--adm-border-subtle)', fontSize: '0.72rem' }}>
                      <span style={{ color: 'var(--adm-text-sub)' }}>Atelier Reserve Inventory:</span>
                      <span style={{ fontWeight: 700, color: stock > 0 ? '#10b981' : '#ef4444' }}>
                        {stock} units in stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Textile Material Composition & Care */}
                <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                    Materials & Fabric Specification
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--adm-text-main)' }}>
                    {materials}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
                    Care: Dry clean only by luxury garment specialist • Tested for in-browser virtual try-on physics.
                  </div>
                </div>

                {/* Description Text */}
                <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                    Public Catalog Description
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-muted)', margin: 0, lineHeight: 1.5 }}>
                    {product.description || 'No description provided by merchant.'}
                  </p>
                </div>

                {/* Shipping & Escrow Terms */}
                <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Truck size={12} color="#38bdf8" /> Logistics & Returns Governance
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-main)' }}>
                    <strong>Shipping:</strong> {product.shipping_info || 'Complimentary worldwide express shipping via DHL Express (2-3 business days).'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-main)', marginTop: '3px' }}>
                    <strong>Returns:</strong> {product.return_policy || '14-Day Boutique Window • Escrow released 48h post verified carrier delivery (POD).'}
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Review Checklist */}
            {activeSection === 'compliance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                        Quality Curation Checklist
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                        Verify every luxury quality gate before approving this garment.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={handlePassAllChecks}
                      style={{ fontSize: '0.68rem', padding: '3px 8px' }}
                    >
                      {allChecksPassed ? 'Uncheck All' : 'Pass All Checks ✓'}
                    </button>
                  </div>

                  {/* Checklist Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      {
                        key: 'imagery_quality',
                        title: '1. High-Resolution Imagery',
                        desc: 'Front, back, and detail images meet high-resolution and editorial lighting standards.'
                      },
                      {
                        key: 'spec_completeness',
                        title: '2. Specification Completeness',
                        desc: 'Accurate sizing chart, SKU, fiber composition, and garment care instructions provided.'
                      },
                      {
                        key: 'policy_compliance',
                        title: '3. Marketplace Policy Compliance',
                        desc: 'Free of prohibited goods, safety infractions, or unauthorized replica aesthetics.'
                      },
                      {
                        key: 'claim_veracity',
                        title: '4. Truth in Advertising',
                        desc: 'Fabric claims, European origin, and luxury material specifications substantiated.'
                      },
                      {
                        key: 'ip_clearance',
                        title: '5. Intellectual Property Clearance',
                        desc: 'Brand trademark authorization and designer copyright confirmed.'
                      }
                    ].map(item => {
                      const isChecked = checklist[item.key];
                      return (
                        <label
                          key={item.key}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '6px',
                            background: isChecked ? 'rgba(16, 185, 129, 0.06)' : 'var(--adm-panel-hover)',
                            border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.25)' : 'var(--adm-border-subtle)'}`,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleCheck(item.key)}
                            style={{ accentColor: 'var(--adm-accent)', marginTop: '2px', cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{ fontSize: '0.74rem', fontWeight: 600, color: isChecked ? '#10b981' : 'var(--adm-text-main)' }}>
                              {item.title}
                            </div>
                            <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', marginTop: '1px' }}>
                              {item.desc}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* Progress Meter */}
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid var(--adm-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                    <span style={{ color: 'var(--adm-text-sub)' }}>Audit Progress:</span>
                    <span style={{ fontWeight: 700, color: allChecksPassed ? '#10b981' : '#f59e0b' }}>
                      {passedChecksCount} of {totalChecks} Criteria Satisfied
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Two-Tier Review Notes */}
            {activeSection === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Note Type Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveNoteTab('internal')}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: `1px solid ${activeNoteTab === 'internal' ? 'var(--adm-accent)' : 'var(--adm-border)'}`,
                      background: activeNoteTab === 'internal' ? 'var(--adm-panel-hover)' : 'var(--adm-bg)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                      <Lock size={11} color="#f59e0b" /> Internal Notes
                    </div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)' }}>
                      Confidential audit trail (Platform only)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNoteTab('merchant')}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: `1px solid ${activeNoteTab === 'merchant' ? 'var(--adm-accent)' : 'var(--adm-border)'}`,
                      background: activeNoteTab === 'merchant' ? 'var(--adm-panel-hover)' : 'var(--adm-bg)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                      <MessageSquare size={11} color="#38bdf8" /> Merchant Feedback
                    </div>
                    <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)' }}>
                      Sent directly to boutique upon changes/rejection
                    </div>
                  </button>
                </div>

                {/* Internal Notes Panel */}
                {activeNoteTab === 'internal' && (
                  <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                      Private Platform Compliance Log
                    </label>
                    <textarea
                      rows={4}
                      className="admin-search-input"
                      style={{ width: '100%', height: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.74rem' }}
                      placeholder="e.g. Verified European virgin wool swatch against Paris atelier certificate. Sizing aligned with standard European sizing..."
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                    />
                    <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
                      Never disclosed to the merchant. Preserved for legal and intellectual-property auditing.
                    </div>
                  </div>
                )}

                {/* Merchant Feedback Panel */}
                {activeNoteTab === 'merchant' && (
                  <div style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
                      Merchant Revision Guidance
                    </label>
                    <textarea
                      rows={4}
                      className="admin-search-input"
                      style={{ width: '100%', height: 'auto', padding: '0.55rem 0.75rem', fontSize: '0.74rem' }}
                      placeholder="e.g. Please re-upload the lapel stitching photo with neutral white background lighting and clarify fabric blend percentage..."
                      value={merchantFeedback}
                      onChange={(e) => setMerchantFeedback(e.target.value)}
                    />
                    <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
                      This message is transmitted to the atelier's merchant dashboard when requesting changes.
                    </div>
                  </div>
                )}

                {/* Previous Review History Log if exists */}
                {product.reviewed_at && (
                  <div style={{ padding: '0.75rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border-subtle)', fontSize: '0.7rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                      Prior Review: {new Date(product.reviewed_at).toLocaleString()}
                    </div>
                    <div style={{ color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                      Reviewer: {product.reviewed_by || 'Senior Catalog Auditor'}
                    </div>
                    {product.admin_notes && (
                      <div style={{ marginTop: '4px', fontStyle: 'italic', color: 'var(--adm-text-muted)' }}>
                        "{product.admin_notes}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </AdminModal>

      {/* Full-Resolution Zoom & Lightbox Inspection Modal */}
      {isZoomOpen && (
        <AdminModal
          isOpen={isZoomOpen}
          onClose={() => setIsZoomOpen(false)}
          title={`High-Resolution Inspection: ${allImages[activeImageIdx]?.label}`}
          maxWidth="720px"
          footer={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
                Viewing photo {activeImageIdx + 1} of {allImages.length}
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setIsZoomOpen(false)}
              >
                Close Zoom
              </button>
            </div>
          }
        >
          <div style={{ textAlign: 'center', background: '#000', borderRadius: '8px', overflow: 'hidden', maxHeight: '70vh' }}>
            <img
              src={allImages[activeImageIdx]?.url}
              alt=""
              style={{ maxHeight: '68vh', maxWidth: '100%', objectFit: 'contain', margin: '0 auto', display: 'block' }}
            />
          </div>
        </AdminModal>
      )}

      {/* Reject Listing Safeguard Dialog */}
      {showRejectModal && (
        <AdminModal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Garment Listing"
          maxWidth="500px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={handleReject}
                disabled={loading}
              >
                Confirm Rejection
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
              Rejecting will hide this garment from marketplace approval queues and notify the atelier. A specific compliance reason is required.
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                Rejection Category *
              </label>
              <select
                className="admin-input"
                value={rejectCategory}
                onChange={(e) => setRejectCategory(e.target.value)}
              >
                <option value="Listing Incomplete / Low-Res Photos">Listing Incomplete / Low-Resolution Photos</option>
                <option value="Intellectual Property / Trademark Infringement">Intellectual Property / Trademark Infringement</option>
                <option value="Unsubstantiated Material Claims">Unsubstantiated Material Claims</option>
                <option value="Prohibited Marketplace Item">Prohibited Marketplace Item</option>
                <option value="Misleading Sizing or Stock Information">Misleading Sizing or Stock Information</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                Merchant-Facing Reason *
              </label>
              <textarea
                rows={3}
                className="admin-search-input"
                style={{ width: '100%', height: 'auto', padding: '0.55rem 0.75rem' }}
                placeholder="Explain why the listing does not meet VogueSocial standards..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                required
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Request Changes Safeguard Dialog */}
      {showChangesModal && (
        <AdminModal
          isOpen={showChangesModal}
          onClose={() => setShowChangesModal(false)}
          title="Request Revisions from Merchant"
          maxWidth="500px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setShowChangesModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={handleRequestChanges}
                disabled={loading}
              >
                Send Revision Request
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
              Specify the exact adjustments required (e.g. additional photos, fabric composition details, or sizing chart update). The merchant will receive these instructions in their portal.
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                Required Actions / Revision Checklist *
              </label>
              <textarea
                rows={4}
                className="admin-search-input"
                style={{ width: '100%', height: 'auto', padding: '0.55rem 0.75rem' }}
                placeholder="1. Re-upload high-resolution lapel close-up photo&#10;2. Provide fabric weight (GSM) in description&#10;3. Confirm European size conversions..."
                value={changesRequestedText}
                onChange={(e) => setChangesRequestedText(e.target.value)}
                required
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Approve & Publish Confirmation Dialog */}
      {showApproveConfirm && (
        <AdminModal
          isOpen={showApproveConfirm}
          onClose={() => setShowApproveConfirm(false)}
          title="Confirm Garment Publication"
          maxWidth="460px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setShowApproveConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={handleApprove}
                disabled={loading}
              >
                Publish Live to Market
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--adm-text-main)', lineHeight: 1.45 }}>
              You are about to approve <strong>{product.name}</strong> from <strong>{vendorName}</strong>.
            </div>
            <div style={{ padding: '0.65rem 0.8rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.7rem', color: '#10b981' }}>
              ✓ All 5 quality curation checks have been certified by Platform Root Admin.
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
              This garment will be immediately indexed in consumer search, enabled for virtual try-on fitting, and available for shopper checkout.
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}
