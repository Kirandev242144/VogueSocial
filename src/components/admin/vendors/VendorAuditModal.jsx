"use client";
import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle, AlertTriangle, ShieldAlert, Building2,
  FileText, CreditCard, ShieldCheck, ExternalLink, Globe,
  Check, Clock, MapPin, User, Phone, Mail, FileCheck, Eye,
  Lock, Unlock, FileSignature, History, Info, AlertCircle, Shield
} from 'lucide-react';
import { AdminModal } from '../index';

export default function VendorAuditModal({
  vendor,
  isOpen,
  onClose,
  onSaveBusiness,
  onUpdateDocStatus,
  onPlacePayoutHold,
  onReleasePayoutHold,
  onUpdateAgreementRate,
  onUpdateStorefrontStatus,
  // Backwards compatibility fallbacks:
  onUpdateTerms,
  onUpdateStatus,
  loading = false
}) {
  if (!vendor || !isOpen) return null;

  const [activeTab, setActiveTab] = useState('business');

  // Business info form state
  const [bizForm, setBizForm] = useState({
    legal_business_name: vendor.legal_business_name || vendor.store_name || '',
    business_type: vendor.business_type || 'Corporation / LLC',
    tax_id: vendor.tax_id || '',
    registration_number: vendor.registration_number || '',
    phone: vendor.phone || '',
    country: vendor.country || 'France',
    legal_address: {
      street: vendor.legal_address?.street || '',
      city: vendor.legal_address?.city || '',
      postal_code: vendor.legal_address?.postal_code || '',
      country: vendor.legal_address?.country || vendor.country || ''
    },
    return_warehouse_address: {
      street: vendor.return_warehouse_address?.street || '',
      city: vendor.return_warehouse_address?.city || '',
      postal_code: vendor.return_warehouse_address?.postal_code || '',
      country: vendor.return_warehouse_address?.country || vendor.country || ''
    },
    representative: {
      name: vendor.representative?.name || '',
      title: vendor.representative?.title || '',
      email: vendor.representative?.email || vendor.email || '',
      phone: vendor.representative?.phone || vendor.phone || ''
    }
  });

  // Agreement Rate amendment form state
  const currentAgreement = vendor.marketplace_agreement || {
    version: 'v2.4',
    effective_date: '2026-08-15',
    accepted_by: vendor.representative?.name || 'Authorized Signer',
    accepted_at: '2026-08-15T10:14:22Z',
    commission_rate_pct: vendor.commercial_terms?.take_rate_pct || 5.0,
    protocol_fees_desc: '0.0% listing fee • Standard payment processing passed at cost',
    fulfillment_model: 'Merchant Atelier Self-Fulfill (DHL Express / Contracted Couriers)',
    return_policy: '14-Day Boutique Window • Escrow released 48h post verified delivery (POD)',
    payout_conditions: '5-step automated eligibility protocol verified'
  };

  const [rateForm, setRateForm] = useState({
    newRate: currentAgreement.commission_rate_pct || 5.0,
    reason: '',
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  // Address equivalence helper
  const isAddressesEqual = (a1, a2) => {
    if (!a1 || !a2) return false;
    const s1 = (a1.street || '').trim().toLowerCase();
    const s2 = (a2.street || '').trim().toLowerCase();
    const c1 = (a1.city || '').trim().toLowerCase();
    const c2 = (a2.city || '').trim().toLowerCase();
    return s1.length > 0 && s1 === s2 && c1 === c2;
  };

  const [sameAsRegistered, setSameAsRegistered] = useState(
    isAddressesEqual(vendor.legal_address, vendor.return_warehouse_address) || !vendor.return_warehouse_address?.street
  );

  // Sub-modal states
  const [feedback, setFeedback] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  
  // Payout Hold Sub-dialog
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdCategory, setHoldCategory] = useState('Address Proof & KYB Verification Stale');
  const [holdReason, setHoldReason] = useState('');
  
  // Release Hold Sub-dialog
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseNote, setReleaseNote] = useState('');

  // Storefront Status Confirmation dialog
  const [showStorefrontStatusModal, setShowStorefrontStatusModal] = useState(false);
  const [targetStorefrontStatus, setTargetStorefrontStatus] = useState('');
  const [storefrontReason, setStorefrontReason] = useState('');

  // General note input
  const [adHocNote, setAdHocNote] = useState('');

  useEffect(() => {
    if (vendor) {
      const areEqual = isAddressesEqual(vendor.legal_address, vendor.return_warehouse_address) || !vendor.return_warehouse_address?.street;
      setSameAsRegistered(areEqual);
      setBizForm({
        legal_business_name: vendor.legal_business_name || vendor.store_name || '',
        business_type: vendor.business_type || 'Corporation / LLC',
        tax_id: vendor.tax_id || '',
        registration_number: vendor.registration_number || '',
        phone: vendor.phone || '',
        country: vendor.country || 'France',
        legal_address: {
          street: vendor.legal_address?.street || '',
          city: vendor.legal_address?.city || '',
          postal_code: vendor.legal_address?.postal_code || '',
          country: vendor.legal_address?.country || vendor.country || ''
        },
        return_warehouse_address: {
          street: vendor.return_warehouse_address?.street || '',
          city: vendor.return_warehouse_address?.city || '',
          postal_code: vendor.return_warehouse_address?.postal_code || '',
          country: vendor.return_warehouse_address?.country || vendor.country || ''
        },
        representative: {
          name: vendor.representative?.name || '',
          title: vendor.representative?.title || '',
          email: vendor.representative?.email || vendor.email || '',
          phone: vendor.representative?.phone || vendor.phone || ''
        }
      });

      const agreedRate = vendor.marketplace_agreement?.commission_rate_pct ?? vendor.commercial_terms?.take_rate_pct ?? 5.0;
      setRateForm({
        newRate: agreedRate,
        reason: '',
        effectiveDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [vendor]);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSameAddressToggle = (e) => {
    const checked = e.target.checked;
    setSameAsRegistered(checked);
    if (checked) {
      setBizForm(prev => ({
        ...prev,
        return_warehouse_address: { ...prev.legal_address }
      }));
    }
  };

  const handleSaveBusinessInfo = async (e) => {
    e.preventDefault();
    if (onSaveBusiness) {
      const dataToSave = {
        ...bizForm,
        return_warehouse_address: sameAsRegistered ? { ...bizForm.legal_address } : bizForm.return_warehouse_address
      };
      await onSaveBusiness(vendor.id, dataToSave);
      showFeedback('Business registration & addresses saved successfully.');
    }
  };

  const handleDocAction = async (docId, status, notes = '') => {
    if (onUpdateDocStatus) {
      await onUpdateDocStatus(vendor.id, docId, status, notes);
      setRejectingDocId(null);
      setRejectReason('');
      showFeedback(`Document marked as ${status}.`);
    }
  };

  const handleConfirmPayoutHold = async () => {
    if (!holdReason.trim()) {
      alert('Please provide a justification reason for placing an administrative payout hold.');
      return;
    }
    if (onPlacePayoutHold) {
      await onPlacePayoutHold(vendor.id, {
        category: holdCategory,
        reason: holdReason,
        adminName: 'Platform Root Admin'
      });
      setShowHoldModal(false);
      setHoldReason('');
      showFeedback('Administrative payout hold placed. Storefront remains active.');
    } else if (onUpdateTerms) {
      await onUpdateTerms(vendor.id, { payout_hold: true });
      setShowHoldModal(false);
      showFeedback('Payout hold placed.');
    }
  };

  const handleConfirmReleasePayoutHold = async () => {
    if (onReleasePayoutHold) {
      await onReleasePayoutHold(vendor.id, {
        note: releaseNote || 'Compliance audit resolved. Rolling payouts resumed.',
        adminName: 'Platform Root Admin'
      });
      setShowReleaseModal(false);
      setReleaseNote('');
      showFeedback('Administrative payout hold released. Rolling payouts resumed.');
    } else if (onUpdateTerms) {
      await onUpdateTerms(vendor.id, { payout_hold: false });
      setShowReleaseModal(false);
      showFeedback('Payout hold released.');
    }
  };

  const handleConfirmStorefrontStatus = async () => {
    if (onUpdateStorefrontStatus) {
      await onUpdateStorefrontStatus(vendor.id, {
        status: targetStorefrontStatus,
        reason: storefrontReason,
        adminName: 'Platform Root Admin'
      });
      setShowStorefrontStatusModal(false);
      setStorefrontReason('');
      showFeedback(`Storefront access updated to ${targetStorefrontStatus}.`);
    } else if (onUpdateStatus) {
      await onUpdateStatus(vendor.id, targetStorefrontStatus === 'active' ? 'approve' : 'suspend', storefrontReason);
      setShowStorefrontStatusModal(false);
      showFeedback(`Status updated.`);
    }
  };

  const handleExecuteRateAmendment = async (e) => {
    e.preventDefault();
    if (onUpdateAgreementRate) {
      await onUpdateAgreementRate(vendor.id, {
        newRate: parseFloat(rateForm.newRate),
        reason: rateForm.reason || 'Negotiated contract amendment',
        effectiveDate: rateForm.effectiveDate,
        adminName: 'Commercial Director'
      });
      showFeedback(`Agreement rate amended to ${rateForm.newRate}%.`);
      setRateForm(prev => ({ ...prev, reason: '' }));
    } else if (onUpdateTerms) {
      await onUpdateTerms(vendor.id, { take_rate_pct: parseFloat(rateForm.newRate) });
      showFeedback(`Commission take-rate updated to ${rateForm.newRate}%.`);
    }
  };

  // Status mapping
  const storefrontStatus = vendor.storefront_status || (vendor.vendor_status === 'approved' ? 'active' : (vendor.vendor_status === 'suspended' ? 'suspended' : 'under_review'));
  const kybStatus = vendor.kyb_status || vendor.kyc_status || 'verified';
  const payoutEligibility = vendor.payout_eligibility || (vendor.commercial_terms?.payout_hold || vendor.payout_hold_details?.active ? 'administrative_hold' : 'eligible');

  const docs = vendor.documents || [];
  const paymentProvider = vendor.payment_provider || {
    provider: 'Stripe Connect (Custom)',
    account_id: vendor.commercial_terms?.stripe_account_id || 'acct_1N4k92A',
    onboarding_status: 'completed',
    charges_enabled: true,
    payouts_enabled: !vendor.commercial_terms?.payout_hold,
    bank_name: vendor.commercial_terms?.bank_name || 'JPMorgan Chase (Paris)',
    account_last4: vendor.commercial_terms?.account_last4 || '4192',
    currency: 'EUR',
    source: 'provider_synced'
  };

  const agreementHistory = vendor.agreement_history || [
    {
      version: currentAgreement.version || 'v2.4',
      rate_pct: currentAgreement.commission_rate_pct || 5.0,
      effective_date: currentAgreement.effective_date || '2026-08-15',
      reason: 'Standard luxury atelier marketplace terms',
      updated_by: currentAgreement.accepted_by || 'Camille Laurent',
      updated_at: currentAgreement.accepted_at || '2026-08-15T10:14:22Z'
    }
  ];

  const auditTrail = vendor.audit_trail || [
    {
      id: 'aud_init_1',
      timestamp: vendor.created_at || '2026-08-15T10:00:00Z',
      actor: 'Onboarding System',
      action: 'Boutique Account Registered',
      note: 'Application initiated via merchant portal.'
    }
  ];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Boutique Audit Dossier: ${vendor.store_name}`}
      maxWidth="860px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
            <span>Merchant ID:</span>
            <code style={{ fontFamily: 'monospace', color: 'var(--adm-text-main)' }}>{vendor.id}</code>
            <span style={{ color: 'var(--adm-border)' }}>•</span>
            <span style={{ color: '#818cf8', fontWeight: 500 }}>Fictional Demo Entity</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <a
              href={`/store/${vendor.store_handle}`}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              <span>Visit Public Storefront</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      }
    >
      {/* Toast Feedback */}
      {feedback && (
        <div
          style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            background: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: feedback.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${feedback.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}
        >
          {feedback.msg}
        </div>
      )}

      {/* Header Summary Banner with 3 Separated Governance Gates & Demo Watermark */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          padding: '0.95rem 1.1rem',
          borderRadius: '8px',
          background: 'var(--adm-panel-hover)',
          border: '1px solid var(--adm-border)',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
                background: 'var(--adm-bg)',
                border: '1px solid var(--adm-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.05rem',
                color: 'var(--adm-accent)'
              }}
            >
              {(vendor.store_name || 'V').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                  {vendor.store_name}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.12)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.25)'
                  }}
                >
                  Fictional Sandbox Record • Demo Data Only
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                @{vendor.store_handle} • {vendor.country || 'Global'} • {vendor.products_count ?? 0} active garments
              </div>
            </div>
          </div>

          <a
            href={`/store/${vendor.store_handle}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.72rem',
              color: 'var(--adm-accent)',
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            <span>Preview Boutique</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {/* 3 Separated Governance Gates */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '0.6rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid var(--adm-border-subtle)'
          }}
        >
          {/* Gate 1: Storefront Access */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--adm-bg)', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: storefrontStatus === 'active' ? '#10b981' : (storefrontStatus === 'suspended' ? '#ef4444' : '#f59e0b') }} />
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Storefront Access</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--adm-text-main)', textTransform: 'capitalize' }}>
                {storefrontStatus === 'active' ? 'Active Live' : (storefrontStatus === 'suspended' ? 'Suspended (Unlisted)' : 'Under Review')}
              </div>
            </div>
          </div>

          {/* Gate 2: Business KYB */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--adm-bg)', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: kybStatus === 'verified' ? '#10b981' : (kybStatus === 'rejected' ? '#ef4444' : '#f59e0b') }} />
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Business KYB</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--adm-text-main)', textTransform: 'capitalize' }}>
                {kybStatus === 'verified' ? 'Verified' : (kybStatus === 'rejected' ? 'Rejected / Non-Compliant' : 'Documents Required')}
              </div>
            </div>
          </div>

          {/* Gate 3: Payout Eligibility */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--adm-bg)', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid var(--adm-border)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: payoutEligibility === 'eligible' ? '#10b981' : '#ef4444' }} />
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payout Eligibility</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: payoutEligibility === 'eligible' ? 'var(--adm-text-main)' : '#ef4444' }}>
                {payoutEligibility === 'eligible' ? 'Eligible (Rolling Payouts)' : 'Administrative Payout Hold'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tab Navigation */}
      <div className="admin-tab-nav" style={{ marginBottom: '1.25rem' }}>
        {[
          { id: 'business', label: 'Business & Legal Entity' },
          { id: 'documents', label: 'Verification & Documents', count: docs.length },
          { id: 'agreement', label: 'Marketplace Agreement', tag: currentAgreement.version || 'v2.4' },
          { id: 'decision', label: 'Audit & Account Status', alert: payoutEligibility === 'administrative_hold' }
        ].map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              className={`admin-tab-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className="admin-tab-badge">{t.count}</span>
              )}
              {t.tag && (
                <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '3px', background: 'var(--adm-panel-hover)', color: 'var(--adm-text-sub)' }}>{t.tag}</span>
              )}
              {t.alert && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Business Profile & Legal Info */}
      {activeTab === 'business' && (
        <form onSubmit={handleSaveBusinessInfo}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Entity Details Card */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={13} color="#38bdf8" /> Corporate Legal Registration
                </div>
                <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 500 }}>Demo Registry Sandbox</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label className="admin-settings-title" style={{ display: 'block', marginBottom: '4px' }}>
                    Legal Entity Name
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.legal_business_name}
                    onChange={(e) => setBizForm({ ...bizForm, legal_business_name: e.target.value })}
                    placeholder="e.g. Studio Label Paris S.A.S."
                    required
                  />
                </div>

                <div>
                  <label className="admin-settings-title" style={{ display: 'block', marginBottom: '4px' }}>
                    Business Entity Type
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.business_type}
                    onChange={(e) => setBizForm({ ...bizForm, business_type: e.target.value })}
                    placeholder="e.g. SAS, LLC, S.r.l."
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="admin-settings-title" style={{ margin: 0 }}>
                      Tax / VAT Identification
                    </label>
                    <span style={{ fontSize: '0.62rem', color: 'var(--adm-text-muted)' }}>[Demo VAT ID]</span>
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.tax_id}
                    onChange={(e) => setBizForm({ ...bizForm, tax_id: e.target.value })}
                    placeholder="e.g. FR-DEMO-892938491"
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="admin-settings-title" style={{ margin: 0 }}>
                      Company Registry Number
                    </label>
                    <span style={{ fontSize: '0.62rem', color: 'var(--adm-text-muted)' }}>[Demo Registry #]</span>
                  </div>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.registration_number}
                    onChange={(e) => setBizForm({ ...bizForm, registration_number: e.target.value })}
                    placeholder="e.g. RCS Paris Demo 892 938 491"
                  />
                </div>
              </div>
            </div>

            {/* Addresses Card */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {/* Registered Business Address */}
              <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', lineHeight: 1.35 }}>
                  <MapPin size={12} color="#38bdf8" /> Registered Business Address
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>Street Address</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={bizForm.legal_address.street}
                      onChange={(e) => setBizForm({
                        ...bizForm,
                        legal_address: { ...bizForm.legal_address, street: e.target.value }
                      })}
                      placeholder="18 Rue du Faubourg..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>City</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={bizForm.legal_address.city}
                        onChange={(e) => setBizForm({
                          ...bizForm,
                          legal_address: { ...bizForm.legal_address, city: e.target.value }
                        })}
                        placeholder="Paris"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>Postal Code</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={bizForm.legal_address.postal_code}
                        onChange={(e) => setBizForm({
                          ...bizForm,
                          legal_address: { ...bizForm.legal_address, postal_code: e.target.value }
                        })}
                        placeholder="75008"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>Country</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={bizForm.legal_address.country}
                      onChange={(e) => setBizForm({
                        ...bizForm,
                        legal_address: { ...bizForm.legal_address, country: e.target.value }
                      })}
                      placeholder="France"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping & Returns Address */}
              <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: 1.35 }}>
                    <MapPin size={12} color="#10b981" /> Shipping & Returns Address
                  </div>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.68rem', color: 'var(--adm-text-sub)', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={sameAsRegistered}
                      onChange={handleSameAddressToggle}
                      style={{ accentColor: 'var(--adm-accent)', cursor: 'pointer' }}
                    />
                    <span>Same as registered address</span>
                  </label>
                </div>

                {sameAsRegistered ? (
                  <div
                    style={{
                      flex: 1,
                      padding: '0.85rem',
                      borderRadius: '6px',
                      background: 'var(--adm-panel-hover)',
                      border: '1px dashed var(--adm-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '5px',
                      fontSize: '0.72rem',
                      color: 'var(--adm-text-muted)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--adm-text-main)', fontWeight: 600 }}>
                      <CheckCircle size={13} color="#10b981" />
                      <span>Same as registered business address</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                      Customer dispatches and returns route to the corporate address on file:
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--adm-text-main)', background: 'var(--adm-bg)', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid var(--adm-border-subtle)', marginTop: '2px' }}>
                      {bizForm.legal_address.street || 'Address on file'}
                      <br />
                      {bizForm.legal_address.city || ''} {bizForm.legal_address.postal_code || ''} {bizForm.legal_address.country ? `• ${bizForm.legal_address.country}` : ''}
                    </div>
                    <div style={{ marginTop: '4px', fontSize: '0.66rem', color: 'var(--adm-text-sub)' }}>
                      Uncheck "Same as registered address" above to specify a separate dispatch facility or return warehouse.
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <div>
                      <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>Street / Unit</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={bizForm.return_warehouse_address.street}
                        onChange={(e) => setBizForm({
                          ...bizForm,
                          return_warehouse_address: { ...bizForm.return_warehouse_address, street: e.target.value }
                        })}
                        placeholder="e.g. 42 Rue de Paradis, Atelier 3B"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>City</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={bizForm.return_warehouse_address.city}
                          onChange={(e) => setBizForm({
                            ...bizForm,
                            return_warehouse_address: { ...bizForm.return_warehouse_address, city: e.target.value }
                          })}
                          placeholder="Paris"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>Postal Code</label>
                        <input
                          type="text"
                          className="admin-input"
                          value={bizForm.return_warehouse_address.postal_code}
                          onChange={(e) => setBizForm({
                            ...bizForm,
                            return_warehouse_address: { ...bizForm.return_warehouse_address, postal_code: e.target.value }
                          })}
                          placeholder="75010"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>Country</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={bizForm.return_warehouse_address.country}
                        onChange={(e) => setBizForm({
                          ...bizForm,
                          return_warehouse_address: { ...bizForm.return_warehouse_address, country: e.target.value }
                        })}
                        placeholder="France"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Representative Card */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} color="#38bdf8" /> Authorized Signer & Business Representative
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label className="admin-settings-title" style={{ display: 'block', marginBottom: '4px' }}>
                    Representative Full Name
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.representative.name}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      representative: { ...bizForm.representative, name: e.target.value }
                    })}
                    placeholder="Camille Laurent"
                  />
                </div>

                <div>
                  <label className="admin-settings-title" style={{ display: 'block', marginBottom: '4px' }}>
                    Corporate Title
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.representative.title}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      representative: { ...bizForm.representative, title: e.target.value }
                    })}
                    placeholder="Managing Director"
                  />
                </div>

                <div>
                  <label className="admin-settings-title" style={{ display: 'block', marginBottom: '4px' }}>
                    Verified Email
                  </label>
                  <input
                    type="email"
                    className="admin-input"
                    value={bizForm.representative.email}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      representative: { ...bizForm.representative, email: e.target.value }
                    })}
                    placeholder="camille@studiolabelparis.com"
                  />
                </div>

                <div>
                  <label className="admin-settings-title" style={{ display: 'block', marginBottom: '4px' }}>
                    Direct Telephone
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.representative.phone}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      representative: { ...bizForm.representative, phone: e.target.value }
                    })}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="admin-btn admin-btn-primary admin-btn-sm"
                disabled={loading}
              >
                Save Business Information
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Address Proof & Compliance Documents */}
      {activeTab === 'documents' && (
        <div>
          <div style={{ marginBottom: '1rem', fontSize: '0.74rem', color: 'var(--adm-text-sub)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span>Inspect legal incorporation extracts, address proof bills, and brand trademark authorizations.</span>
            <span style={{ fontSize: '0.64rem', color: '#818cf8', fontWeight: 500 }}>
              All documents are cryptographically simulated sandbox files
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {docs.map((doc) => {
              const isVerified = doc.status === 'verified';
              const isRejected = doc.status === 'rejected';

              let badgeBg = 'rgba(245, 158, 11, 0.12)';
              let badgeColor = '#f59e0b';
              let badgeText = 'Pending Review';

              if (isVerified) {
                badgeBg = 'rgba(16, 185, 129, 0.12)';
                badgeColor = '#10b981';
                badgeText = 'Verified';
              } else if (isRejected) {
                badgeBg = 'rgba(239, 68, 68, 0.12)';
                badgeColor = '#ef4444';
                badgeText = 'Rejected / Incomplete';
              }

              return (
                <div
                  key={doc.id}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '8px',
                    border: `1px solid ${isRejected ? 'rgba(239, 68, 68, 0.3)' : 'var(--adm-border)'}`,
                    background: 'var(--adm-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          background: 'var(--adm-panel-hover)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--adm-accent)'
                        }}
                      >
                        <FileText size={16} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--adm-text-main)' }}>
                            {doc.title}
                          </span>
                          <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '3px', background: 'var(--adm-panel-hover)', color: 'var(--adm-text-sub)' }}>
                            PDF Sandbox
                          </span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                          File: <span style={{ fontFamily: 'monospace' }}>{doc.filename}</span> • {doc.size} • Expiry: <strong>{doc.expiry_date || 'N/A'}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: badgeBg,
                          color: badgeColor
                        }}
                      >
                        {badgeText}
                      </span>

                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => setPreviewDoc(doc)}
                        style={{ padding: '2px 7px', fontSize: '0.68rem' }}
                      >
                        <Eye size={11} /> View
                      </button>

                      {!isVerified && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary admin-btn-sm"
                          onClick={() => handleDocAction(doc.id, 'verified')}
                          style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                        >
                          <Check size={11} /> Verify
                        </button>
                      )}

                      {!isRejected && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => setRejectingDocId(doc.id)}
                          style={{ padding: '2px 8px', fontSize: '0.68rem' }}
                        >
                          <X size={11} /> Reject
                        </button>
                      )}
                    </div>
                  </div>

                  {doc.notes && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: isRejected ? '#ef4444' : 'var(--adm-text-muted)', background: 'var(--adm-panel-hover)', padding: '0.4rem 0.65rem', borderRadius: '4px' }}>
                      <strong>Audit Note:</strong> {doc.notes}
                      {doc.reviewed_by && <span style={{ marginLeft: '6px', color: 'var(--adm-text-sub)' }}>— {doc.reviewed_by}</span>}
                    </div>
                  )}

                  {/* Reject Note Dialog */}
                  {rejectingDocId === doc.id && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#ef4444', marginBottom: '4px' }}>
                        Reason for rejecting {doc.title}:
                      </div>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder="e.g. Utility bill is over 90 days old or company registry is unverified..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        style={{ width: '100%', marginBottom: '6px' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => { setRejectingDocId(null); setRejectReason(''); }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDocAction(doc.id, 'rejected', rejectReason || 'Rejected by compliance auditor')}
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Document Preview Lightbox */}
          {previewDoc && (
            <AdminModal
              isOpen={Boolean(previewDoc)}
              onClose={() => setPreviewDoc(null)}
              title={`Simulated Document Inspection: ${previewDoc.title}`}
              maxWidth="520px"
              footer={
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => setPreviewDoc(null)}
                >
                  Close Preview
                </button>
              }
            >
              <div style={{ padding: '1.25rem', textAlign: 'center', background: 'var(--adm-bg)', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
                <FileCheck size={44} color="#38bdf8" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--adm-text-main)' }}>
                  {previewDoc.filename}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#818cf8', marginTop: '2px', fontWeight: 500 }}>
                  Simulated Demo Document (PDF Sandbox) • {previewDoc.size}
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', fontSize: '0.72rem', color: 'var(--adm-text-main)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div><strong>Document Title:</strong> {previewDoc.title}</div>
                  <div><strong>Type:</strong> <span style={{ fontFamily: 'monospace' }}>{previewDoc.type}</span></div>
                  <div><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{previewDoc.status}</span></div>
                  <div><strong>Expiry Date:</strong> {previewDoc.expiry_date || 'Permanent / Not Applicable'}</div>
                  <div><strong>Uploaded:</strong> {new Date(previewDoc.uploaded_at).toLocaleString()}</div>
                  {previewDoc.notes && <div style={{ marginTop: '4px', color: 'var(--adm-text-sub)' }}><strong>Audit Record:</strong> {previewDoc.notes}</div>}
                </div>
                <div style={{ marginTop: '0.85rem', fontSize: '0.66rem', color: 'var(--adm-text-muted)' }}>
                  This preview renders simulated file metadata for demonstration. In production, documents are verified via encrypted cloud storage and IDV providers.
                </div>
              </div>
            </AdminModal>
          )}
        </div>
      )}

      {/* Tab 3: Marketplace Agreement & History */}
      {activeTab === 'agreement' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Active Agreement Record */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSignature size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                  Marketplace Agreement {currentAgreement.version || 'v2.4'}
                </span>
                <span style={{ fontSize: '0.64rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', fontWeight: 600 }}>
                  Active Contract
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                Effective: <strong>{currentAgreement.effective_date || '2026-08-15'}</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', marginBottom: '0.75rem', lineHeight: 1.45 }}>
              Accepted electronically by <strong>{currentAgreement.accepted_by || vendor.representative?.name || 'Camille Laurent'}</strong> on {new Date(currentAgreement.accepted_at || '2026-08-15T10:14:22Z').toLocaleString()}. Governs merchant listing standards, escrow release conditions, and dispute arbitration.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border-subtle)' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Commission Take-Rate</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--adm-text-main)', marginTop: '2px' }}>
                  {(currentAgreement.commission_rate_pct ?? 5.0).toFixed(1)}% <span style={{ fontSize: '0.68rem', fontWeight: 400, color: 'var(--adm-text-muted)' }}>of settled GMV</span>
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                  {currentAgreement.protocol_fees_desc || '0.0% listing fee • Standard payment processing passed at cost'}
                </div>
              </div>

              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border-subtle)' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fulfillment & Logistics</div>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--adm-text-main)', marginTop: '2px' }}>
                  {currentAgreement.fulfillment_model || 'Merchant Atelier Self-Fulfill'}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                  Tracking required within 72h of order placement
                </div>
              </div>

              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border-subtle)' }}>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Escrow & Return Policy</div>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--adm-text-main)', marginTop: '2px' }}>
                  14-Day Boutique Window
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                  Escrow released 48h post verified carrier delivery (POD)
                </div>
              </div>
            </div>
          </div>

          {/* Negotiate / Amend Commission Rate */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={13} color="#38bdf8" /> Propose Commission Amendment
            </div>

            <form onSubmit={handleExecuteRateAmendment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                  New Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="30"
                  className="admin-input"
                  value={rateForm.newRate}
                  onChange={(e) => setRateForm({ ...rateForm, newRate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                  Effective Date
                </label>
                <input
                  type="date"
                  className="admin-input"
                  value={rateForm.effectiveDate}
                  onChange={(e) => setRateForm({ ...rateForm, effectiveDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                  Amendment Justification
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Negotiated volume milestone incentive..."
                  value={rateForm.reason}
                  onChange={(e) => setRateForm({ ...rateForm, reason: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn-primary admin-btn-sm"
                disabled={loading}
                style={{ height: '34px' }}
              >
                Execute Amendment
              </button>
            </form>
          </div>

          {/* Chronological Agreement History */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
              Agreement Amendment History
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {agreementHistory.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    background: 'var(--adm-panel-hover)',
                    border: '1px solid var(--adm-border-subtle)',
                    fontSize: '0.72rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <code style={{ fontWeight: 700, color: 'var(--adm-accent)' }}>{h.version}</code>
                    <span style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>{h.rate_pct}% Take-Rate</span>
                    <span style={{ color: 'var(--adm-text-sub)' }}>• {h.reason}</span>
                  </div>
                  <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-muted)' }}>
                    Effective {h.effective_date} • By {h.updated_by}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit & Account Status */}
      {activeTab === 'decision' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Executive Governance & Lifecycle Overview */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#10b981" /> Executive Governance & Decision
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)' }}>
                Decision Recorded: <strong>{new Date(vendor.created_at || '2026-08-15T10:00:00Z').toLocaleDateString()}</strong> by <strong>Platform Root Admin</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem', marginTop: '0.5rem' }}>
              <div style={{ padding: '0.65rem 0.8rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border-subtle)' }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Marketplace Lifecycle</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--adm-text-main)', marginTop: '2px', textTransform: 'capitalize' }}>
                  {storefrontStatus === 'active' ? 'Approved & Fully Authorized' : (storefrontStatus === 'suspended' ? 'Suspended (Policy Hold)' : 'Application Under Review')}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                  Reviewer: Senior Compliance Auditor #4
                </div>
              </div>

              <div style={{ padding: '0.65rem 0.8rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border-subtle)' }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Compliance & Warnings</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: kybStatus === 'rejected' || storefrontStatus === 'suspended' ? '#ef4444' : '#10b981', marginTop: '2px' }}>
                  {storefrontStatus === 'suspended' ? 'Trademark / Policy Hold Active' : (kybStatus === 'verified' ? 'Zero Policy Warnings Active' : 'Document Submission Required')}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                  {kybStatus === 'verified' ? 'Identity & address verified' : 'Auditor flagged missing items'}
                </div>
              </div>

              <div style={{ padding: '0.65rem 0.8rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border-subtle)' }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payout Governance Gate</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: payoutEligibility === 'eligible' ? '#10b981' : '#ef4444', marginTop: '2px' }}>
                  {payoutEligibility === 'eligible' ? 'Rolling Payouts Active' : 'Administrative Payout Hold'}
                </div>
                <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                  {payoutEligibility === 'eligible' ? 'Disbursements verified per order' : 'Fund transfers paused by admin'}
                </div>
              </div>
            </div>

            {/* Critical Business Detail Callout */}
            <div
              style={{
                marginTop: '0.85rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                fontSize: '0.7rem',
                color: 'var(--adm-text-main)',
                lineHeight: 1.45
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 600, marginBottom: '2px' }}>
                <Info size={13} />
                <span>Order Fund Settlement Architecture (Delivery Verification Protocol)</span>
              </div>
              <div>
                <strong>Workflow:</strong> Customer pays → Merchant ships → Carrier POD verified → 48-hour buyer inspection buffer → Payout eligible.
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                Merchant payout eligibility in this dossier grants permission for rolling automated transfers. Individual fund releases are evaluated on an order-by-order basis via tracking webhooks on the Orders Ledger, never released arbitrarily in bulk from this profile.
              </div>
            </div>
          </div>

          {/* Gate 1: Storefront Access Management */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Storefront Access & Catalog Indexing
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--adm-text-main)', marginTop: '2px' }}>
                  Status: {storefrontStatus === 'active' ? 'Active (Public Storefront Live)' : 'Suspended (Catalog Hidden)'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', marginTop: '2px', maxWidth: '520px' }}>
                  Suspension unlists the boutique from search and pauses purchases. Does not affect past order escrow releases.
                </div>
              </div>

              <div>
                {storefrontStatus === 'active' ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => {
                      setTargetStorefrontStatus('suspended');
                      setShowStorefrontStatusModal(true);
                    }}
                  >
                    <ShieldAlert size={12} /> Suspend Storefront
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => {
                      setTargetStorefrontStatus('active');
                      setShowStorefrontStatusModal(true);
                    }}
                  >
                    <CheckCircle size={12} /> Reactivate Storefront
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Gate 2: Payment Provider Account (Stripe Connect) */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={14} color="#38bdf8" />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Payment Provider Account (Stripe Connect)
                </span>
              </div>
              <span style={{ fontSize: '0.64rem', padding: '2px 6px', borderRadius: '4px', background: paymentProvider.charges_enabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: paymentProvider.charges_enabled ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {paymentProvider.charges_enabled ? 'Charges Enabled' : 'Charges Blocked'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>Connected Account ID</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    readOnly
                    className="admin-input"
                    value={paymentProvider.account_id}
                    style={{ fontFamily: 'monospace', fontSize: '0.74rem', background: 'var(--adm-panel-hover)' }}
                  />
                  <a
                    href={`https://dashboard.stripe.com/test/connect/accounts/${paymentProvider.account_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    title="Inspect in provider console"
                    style={{ padding: '4px 7px' }}
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '2px' }}>Settlement Bank Rails</label>
                <div style={{ padding: '0.5rem 0.65rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border-subtle)', fontSize: '0.72rem', color: 'var(--adm-text-main)' }}>
                  {paymentProvider.bank_name} •••• {paymentProvider.account_last4}
                  <span style={{ fontSize: '0.62rem', color: 'var(--adm-text-muted)', marginLeft: '6px' }}>(Synced from Provider Ledger)</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', marginTop: '0.6rem' }}>
              Connected account banking details are synced directly via Stripe Connect webhooks. Direct manual text edits are disallowed to prevent payment redirect exploits.
            </div>
          </div>

          {/* Gate 3: Controlled Administrative Payout Governance */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: `1px solid ${payoutEligibility === 'administrative_hold' ? 'rgba(239, 68, 68, 0.4)' : 'var(--adm-border)'}`, background: 'var(--adm-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Administrative Payout Governance
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: payoutEligibility === 'administrative_hold' ? '#ef4444' : '#10b981', marginTop: '2px' }}>
                  {payoutEligibility === 'administrative_hold' ? 'Administrative Payout Hold Active' : 'Rolling Payouts Eligible'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', marginTop: '2px', maxWidth: '520px' }}>
                  A payout hold pauses release of transfer funds without unlisting the public storefront. Each hold requires a documented category and rationale.
                </div>
              </div>

              <div>
                {payoutEligibility === 'administrative_hold' ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => setShowReleaseModal(true)}
                  >
                    <Unlock size={12} /> Release Payout Hold
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => setShowHoldModal(true)}
                  >
                    <Lock size={12} /> Place Payout Hold
                  </button>
                )}
              </div>
            </div>

            {/* Active Hold Details Box */}
            {payoutEligibility === 'administrative_hold' && (vendor.payout_hold_details || vendor.commercial_terms?.payout_hold) && (
              <div style={{ marginTop: '0.85rem', padding: '0.75rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 600, marginBottom: '3px' }}>
                  <AlertCircle size={13} />
                  <span>Category: {vendor.payout_hold_details?.category || 'Administrative Compliance Review'}</span>
                </div>
                <div style={{ color: 'var(--adm-text-main)' }}>
                  <strong>Justification:</strong> {vendor.payout_hold_details?.reason || 'Payout hold active pending compliance documentation.'}
                </div>
                <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
                  Placed by {vendor.payout_hold_details?.placed_by || 'Platform Admin'} on {new Date(vendor.payout_hold_details?.placed_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* Unified Chronological Audit Trail */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
              Immutable Compliance Audit Trail
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
              {auditTrail.map((aud) => (
                <div
                  key={aud.id}
                  style={{
                    padding: '0.55rem 0.75rem',
                    borderRadius: '6px',
                    background: 'var(--adm-panel-hover)',
                    border: '1px solid var(--adm-border-subtle)',
                    fontSize: '0.72rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>{aud.action}</span>
                    <span style={{ fontSize: '0.64rem', color: 'var(--adm-text-muted)' }}>{new Date(aud.timestamp).toLocaleString()}</span>
                  </div>
                  <div style={{ color: 'var(--adm-text-sub)' }}>{aud.note}</div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--adm-accent)', marginTop: '2px' }}>Actor: {aud.actor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Place Payout Hold Sub-Dialog */}
      {showHoldModal && (
        <AdminModal
          isOpen={showHoldModal}
          onClose={() => setShowHoldModal(false)}
          title="Place Administrative Payout Hold"
          maxWidth="500px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setShowHoldModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={handleConfirmPayoutHold}
                disabled={loading}
              >
                Confirm Payout Hold
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
              Placing an administrative payout hold freezes outgoing escrow settlements to this merchant's bank account while keeping their storefront public and available for customer purchases.
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                Hold Category
              </label>
              <select
                className="admin-input"
                value={holdCategory}
                onChange={(e) => setHoldCategory(e.target.value)}
              >
                <option value="Address Proof & KYB Verification Stale">Address Proof & KYB Verification Stale</option>
                <option value="Copyright & Trademark Dispute">Copyright & Trademark Infringement Notice</option>
                <option value="Unusually High Return / Defect Rate">Unusually High Return / Defect Rate</option>
                <option value="Buyer Claim Arbitration">Buyer Claim Arbitration Pending</option>
                <option value="Suspected Fraud / AML Review">Suspected Fraud / AML Review</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                Formal Justification / Reason *
              </label>
              <textarea
                rows={3}
                className="admin-search-input"
                style={{ width: '100%', height: 'auto', padding: '0.5rem 0.75rem' }}
                placeholder="Detail the compliance violation or trigger reason..."
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                required
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Release Payout Hold Sub-Dialog */}
      {showReleaseModal && (
        <AdminModal
          isOpen={showReleaseModal}
          onClose={() => setShowReleaseModal(false)}
          title="Release Administrative Payout Hold"
          maxWidth="500px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setShowReleaseModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={handleConfirmReleasePayoutHold}
                disabled={loading}
              >
                Release Hold & Resume Payouts
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
              Releasing this payout hold will restore rolling automated payouts for delivered orders meeting the 48-hour delivery verification window.
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                Resolution Note (Optional)
              </label>
              <textarea
                rows={3}
                className="admin-search-input"
                style={{ width: '100%', height: 'auto', padding: '0.5rem 0.75rem' }}
                placeholder="e.g. Valid address proof received and verified against commercial registry..."
                value={releaseNote}
                onChange={(e) => setReleaseNote(e.target.value)}
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Storefront Status Confirmation Dialog */}
      {showStorefrontStatusModal && (
        <AdminModal
          isOpen={showStorefrontStatusModal}
          onClose={() => setShowStorefrontStatusModal(false)}
          title={targetStorefrontStatus === 'active' ? 'Reactivate Boutique Storefront' : 'Suspend Boutique Storefront'}
          maxWidth="480px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setShowStorefrontStatusModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`admin-btn ${targetStorefrontStatus === 'active' ? 'admin-btn-primary' : 'admin-btn-danger'} admin-btn-sm`}
                onClick={handleConfirmStorefrontStatus}
                disabled={loading}
              >
                {targetStorefrontStatus === 'active' ? 'Reactivate Storefront' : 'Confirm Suspension'}
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
              {targetStorefrontStatus === 'active'
                ? 'Reactivating will make this atelier public and re-enable garment indexing in marketplace catalogs.'
                : 'Suspending will unlist this atelier from public search and disable customer checkout. Existing delivered orders remain eligible for settlement.'}
            </div>

            <div>
              <label style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', display: 'block', marginBottom: '4px' }}>
                Action Reason
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Trademark audit completed or storefront terms violation..."
                value={storefrontReason}
                onChange={(e) => setStorefrontReason(e.target.value)}
              />
            </div>
          </div>
        </AdminModal>
      )}
    </AdminModal>
  );
}
