"use client";
import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle, AlertTriangle, ShieldAlert, Building2,
  FileText, CreditCard, ShieldCheck, ExternalLink, Globe,
  Check, Clock, MapPin, User, Phone, Mail, FileCheck, Eye,
  Lock, Unlock, FileSignature, History, Info, AlertCircle, Shield
} from 'lucide-react';
import { AdminModal } from '../index';
import './VendorAuditModal.css';

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
        <div className="vam-footer">
          <div className="vam-footer-id">
            <span>Merchant ID:</span>
            <code className="vam-footer-code">{vendor.id}</code>
            <span className="vam-footer-sep">•</span>
            <span className="vam-footer-demo">Fictional Demo Entity</span>
          </div>

          <div className="vam-footer-actions">
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
        <div className={`vam-toast ${feedback.type === 'success' ? 'vam-toast-success' : 'vam-toast-error'}`}>
          {feedback.msg}
        </div>
      )}

      {/* Header Summary Banner with 3 Separated Governance Gates & Demo Watermark */}
      <div className="vam-header">
        <div className="vam-header-top">
          <div className="vam-header-left">
            <div className="vam-avatar">
              {(vendor.store_name || 'V').charAt(0).toUpperCase()}
            </div>
            <div className="vam-header-info">
              <div className="vam-title-row">
                <span className="vam-store-name">
                  {vendor.store_name}
                </span>
                <span className="vam-demo-pill">
                  Fictional Sandbox Record • Demo Data Only
                </span>
              </div>
              <div className="vam-subtitle">
                @{vendor.store_handle} • {vendor.country || 'Global'} • {vendor.products_count ?? 0} active garments
              </div>
            </div>
          </div>

          <a
            href={`/store/${vendor.store_handle}`}
            target="_blank"
            rel="noreferrer"
            className="vam-preview-link"
          >
            <span>Preview Boutique</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {/* 3 Separated Governance Gates */}
        <div className="vam-gates-grid">
          {/* Gate 1: Storefront Access */}
          <div className="vam-gate-card">
            <div className={`vam-gate-dot ${storefrontStatus === 'active' ? 'status-active' : (storefrontStatus === 'suspended' ? 'status-suspended' : 'status-review')}`} />
            <div>
              <div className="vam-gate-label">Storefront Access</div>
              <div className="vam-gate-value">
                {storefrontStatus === 'active' ? 'Active Live' : (storefrontStatus === 'suspended' ? 'Suspended (Unlisted)' : 'Under Review')}
              </div>
            </div>
          </div>

          {/* Gate 2: Business KYB */}
          <div className="vam-gate-card">
            <div className={`vam-gate-dot ${kybStatus === 'verified' ? 'status-verified' : (kybStatus === 'rejected' ? 'status-rejected' : 'status-review')}`} />
            <div>
              <div className="vam-gate-label">Business KYB</div>
              <div className="vam-gate-value">
                {kybStatus === 'verified' ? 'Verified' : (kybStatus === 'rejected' ? 'Rejected / Non-Compliant' : 'Documents Required')}
              </div>
            </div>
          </div>

          {/* Gate 3: Payout Eligibility */}
          <div className="vam-gate-card">
            <div className={`vam-gate-dot ${payoutEligibility === 'eligible' ? 'status-eligible' : 'status-hold'}`} />
            <div>
              <div className="vam-gate-label">Payout Eligibility</div>
              <div className={`vam-gate-value ${payoutEligibility === 'eligible' ? '' : 'status-hold'}`}>
                {payoutEligibility === 'eligible' ? 'Eligible (Rolling Payouts)' : 'Administrative Payout Hold'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tab Navigation */}
      <div className="admin-tab-nav vam-tab-nav">
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
                <span className="vam-tab-tag">{t.tag}</span>
              )}
              {t.alert && (
                <span className="vam-tab-alert-dot" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Business Profile & Legal Info */}
      {activeTab === 'business' && (
        <form onSubmit={handleSaveBusinessInfo}>
          <div className="vam-stack">
            {/* Entity Details Card */}
            <div className="vam-card">
              <div className="vam-card-header">
                <div className="vam-card-title">
                  <Building2 size={13} color="#38bdf8" /> Corporate Legal Registration
                </div>
                <span className="vam-card-tag">Demo Registry Sandbox</span>
              </div>

              <div className="vam-grid-2">
                <div>
                  <label className="admin-settings-title vam-field-label">
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
                  <label className="admin-settings-title vam-field-label">
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
                  <div className="vam-field-label-row">
                    <label className="admin-settings-title vam-field-label-text">
                      Tax / VAT Identification
                    </label>
                    <span className="vam-field-hint">[Demo VAT ID]</span>
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
                  <div className="vam-field-label-row">
                    <label className="admin-settings-title vam-field-label-text">
                      Company Registry Number
                    </label>
                    <span className="vam-field-hint">[Demo Registry #]</span>
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
            <div className="vam-grid-addresses">
              {/* Registered Business Address */}
              <div className="vam-address-card">
                <div className="vam-address-title">
                  <MapPin size={12} color="#38bdf8" /> Registered Business Address
                </div>

                <div className="vam-address-fields">
                  <div>
                    <label className="vam-sublabel">Street Address</label>
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

                  <div className="vam-grid-city-postal">
                    <div>
                      <label className="vam-sublabel">City</label>
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
                      <label className="vam-sublabel">Postal Code</label>
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
                    <label className="vam-sublabel">Country</label>
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
              <div className="vam-address-card">
                <div className="vam-address-header">
                  <div className="vam-address-title">
                    <MapPin size={12} color="#10b981" /> Shipping & Returns Address
                  </div>

                  <label className="vam-checkbox-label">
                    <input
                      type="checkbox"
                      checked={sameAsRegistered}
                      onChange={handleSameAddressToggle}
                      className="vam-checkbox-input"
                    />
                    <span>Same as registered address</span>
                  </label>
                </div>

                {sameAsRegistered ? (
                  <div className="vam-same-address-box">
                    <div className="vam-same-address-heading">
                      <CheckCircle size={13} color="#10b981" />
                      <span>Same as registered business address</span>
                    </div>
                    <div className="vam-same-address-desc">
                      Customer dispatches and returns route to the corporate address on file:
                    </div>
                    <div className="vam-same-address-code">
                      {bizForm.legal_address.street || 'Address on file'}
                      <br />
                      {bizForm.legal_address.city || ''} {bizForm.legal_address.postal_code || ''} {bizForm.legal_address.country ? `• ${bizForm.legal_address.country}` : ''}
                    </div>
                    <div className="vam-same-address-hint">
                      Uncheck "Same as registered address" above to specify a separate dispatch facility or return warehouse.
                    </div>
                  </div>
                ) : (
                  <div className="vam-address-fields">
                    <div>
                      <label className="vam-sublabel">Street / Unit</label>
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

                    <div className="vam-grid-city-postal">
                      <div>
                        <label className="vam-sublabel">City</label>
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
                        <label className="vam-sublabel">Postal Code</label>
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
                      <label className="vam-sublabel">Country</label>
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
            <div className="vam-card">
              <div className="vam-card-header">
                <div className="vam-card-title">
                  <User size={13} color="#38bdf8" /> Authorized Signer & Business Representative
                </div>
              </div>

              <div className="vam-grid-2">
                <div>
                  <label className="admin-settings-title vam-field-label">
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
                  <label className="admin-settings-title vam-field-label">
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
                  <label className="admin-settings-title vam-field-label">
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
                  <label className="admin-settings-title vam-field-label">
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

            <div className="vam-form-actions">
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
          <div className="vam-docs-header">
            <span>Inspect legal incorporation extracts, address proof bills, and brand trademark authorizations.</span>
            <span className="vam-docs-sandbox-note">
              All documents are cryptographically simulated sandbox files
            </span>
          </div>

          <div className="vam-docs-list">
            {docs.map((doc) => {
              const isVerified = doc.status === 'verified';
              const isRejected = doc.status === 'rejected';

              let badgeClass = 'pending';
              let badgeText = 'Pending Review';

              if (isVerified) {
                badgeClass = 'verified';
                badgeText = 'Verified';
              } else if (isRejected) {
                badgeClass = 'rejected';
                badgeText = 'Rejected / Incomplete';
              }

              return (
                <div
                  key={doc.id}
                  className={`vam-doc-item ${isRejected ? 'rejected' : ''}`}
                >
                  <div className="vam-doc-row">
                    <div className="vam-doc-left">
                      <div className="vam-doc-icon">
                        <FileText size={16} />
                      </div>
                      <div className="vam-doc-info">
                        <div className="vam-doc-title-row">
                          <span className="vam-doc-title">
                            {doc.title}
                          </span>
                          <span className="vam-doc-tag">
                            PDF Sandbox
                          </span>
                        </div>
                        <div className="vam-doc-meta">
                          File: <span className="vam-doc-filename">{doc.filename}</span> • {doc.size} • Expiry: <strong>{doc.expiry_date || 'N/A'}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="vam-doc-actions">
                      <span className={`vam-doc-badge ${badgeClass}`}>
                        {badgeText}
                      </span>

                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-compact"
                        onClick={() => setPreviewDoc(doc)}
                      >
                        <Eye size={11} /> View
                      </button>

                      {!isVerified && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-primary admin-btn-sm vam-btn-compact-pad"
                          onClick={() => handleDocAction(doc.id, 'verified')}
                        >
                          <Check size={11} /> Verify
                        </button>
                      )}

                      {!isRejected && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm vam-btn-compact-pad"
                          onClick={() => setRejectingDocId(doc.id)}
                        >
                          <X size={11} /> Reject
                        </button>
                      )}
                    </div>
                  </div>

                  {doc.notes && (
                    <div className={`vam-doc-notes ${isRejected ? 'rejected' : ''}`}>
                      <strong>Audit Note:</strong> {doc.notes}
                      {doc.reviewed_by && <span className="vam-doc-reviewer">— {doc.reviewed_by}</span>}
                    </div>
                  )}

                  {/* Reject Note Dialog */}
                  {rejectingDocId === doc.id && (
                    <div className="vam-reject-dialog">
                      <div className="vam-reject-title">
                        Reason for rejecting {doc.title}:
                      </div>
                      <input
                        type="text"
                        className="admin-input vam-reject-input"
                        placeholder="e.g. Utility bill is over 90 days old or company registry is unverified..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                      <div className="vam-reject-actions">
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
              <div className="vam-preview-body">
                <FileCheck size={44} color="#38bdf8" className="vam-preview-icon" />
                <div className="vam-preview-filename">
                  {previewDoc.filename}
                </div>
                <div className="vam-preview-type">
                  Simulated Demo Document (PDF Sandbox) • {previewDoc.size}
                </div>
                <div className="vam-preview-meta-list">
                  <div><strong>Document Title:</strong> {previewDoc.title}</div>
                  <div><strong>Type:</strong> <span className="vam-preview-code">{previewDoc.type}</span></div>
                  <div><strong>Status:</strong> <span className="vam-preview-status">{previewDoc.status}</span></div>
                  <div><strong>Expiry Date:</strong> {previewDoc.expiry_date || 'Permanent / Not Applicable'}</div>
                  <div><strong>Uploaded:</strong> {new Date(previewDoc.uploaded_at).toLocaleString()}</div>
                  {previewDoc.notes && <div className="vam-preview-notes"><strong>Audit Record:</strong> {previewDoc.notes}</div>}
                </div>
                <div className="vam-preview-disclaimer">
                  This preview renders simulated file metadata for demonstration. In production, documents are verified via encrypted cloud storage and IDV providers.
                </div>
              </div>
            </AdminModal>
          )}
        </div>
      )}

      {/* Tab 3: Marketplace Agreement & History */}
      {activeTab === 'agreement' && (
        <div className="vam-stack">
          {/* Active Agreement Record */}
          <div className="vam-card">
            <div className="vam-agreement-card-header">
              <div className="vam-agreement-title-group">
                <FileSignature size={16} color="#38bdf8" />
                <span className="vam-agreement-title">
                  Marketplace Agreement {currentAgreement.version || 'v2.4'}
                </span>
                <span className="vam-agreement-badge">
                  Active Contract
                </span>
              </div>
              <div className="vam-agreement-effective">
                Effective: <strong>{currentAgreement.effective_date || '2026-08-15'}</strong>
              </div>
            </div>

            <div className="vam-agreement-desc">
              Accepted electronically by <strong>{currentAgreement.accepted_by || vendor.representative?.name || 'Camille Laurent'}</strong> on {new Date(currentAgreement.accepted_at || '2026-08-15T10:14:22Z').toLocaleString()}. Governs merchant listing standards, escrow release conditions, and dispute arbitration.
            </div>

            <div className="vam-terms-grid">
              <div className="vam-term-box">
                <div className="vam-term-label">Commission Take-Rate</div>
                <div className="vam-term-value-lg">
                  {(currentAgreement.commission_rate_pct ?? 5.0).toFixed(1)}% <span className="vam-term-unit">of settled GMV</span>
                </div>
                <div className="vam-term-sub">
                  {currentAgreement.protocol_fees_desc || '0.0% listing fee • Standard payment processing passed at cost'}
                </div>
              </div>

              <div className="vam-term-box">
                <div className="vam-term-label">Fulfillment & Logistics</div>
                <div className="vam-term-value-md">
                  {currentAgreement.fulfillment_model || 'Merchant Atelier Self-Fulfill'}
                </div>
                <div className="vam-term-sub">
                  Tracking required within 72h of order placement
                </div>
              </div>

              <div className="vam-term-box">
                <div className="vam-term-label">Escrow & Return Policy</div>
                <div className="vam-term-value-md">
                  14-Day Boutique Window
                </div>
                <div className="vam-term-sub">
                  Escrow released 48h post verified carrier delivery (POD)
                </div>
              </div>
            </div>
          </div>

          {/* Negotiate / Amend Commission Rate */}
          <div className="vam-card">
            <div className="vam-card-header">
              <div className="vam-card-title">
                <History size={13} color="#38bdf8" /> Propose Commission Amendment
              </div>
            </div>

            <form onSubmit={handleExecuteRateAmendment} className="vam-rate-form">
              <div>
                <label className="vam-rate-label">
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
                <label className="vam-rate-label">
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
                <label className="vam-rate-label">
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
                className="admin-btn admin-btn-primary admin-btn-sm vam-rate-submit-btn"
                disabled={loading}
              >
                Execute Amendment
              </button>
            </form>
          </div>

          {/* Chronological Agreement History */}
          <div className="vam-card">
            <div className="vam-history-header">
              Agreement Amendment History
            </div>

            <div className="vam-history-list">
              {agreementHistory.map((h, i) => (
                <div
                  key={i}
                  className="vam-history-item"
                >
                  <div className="vam-history-left">
                    <code className="vam-history-version">{h.version}</code>
                    <span className="vam-history-rate">{h.rate_pct}% Take-Rate</span>
                    <span className="vam-history-reason">• {h.reason}</span>
                  </div>
                  <div className="vam-history-meta">
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
        <div className="vam-stack">
          {/* Executive Governance & Lifecycle Overview */}
          <div className="vam-card">
            <div className="vam-decision-header">
              <div className="vam-decision-title">
                <ShieldCheck size={14} color="#10b981" /> Executive Governance & Decision
              </div>
              <div className="vam-decision-recorded">
                Decision Recorded: <strong>{new Date(vendor.created_at || '2026-08-15T10:00:00Z').toLocaleDateString()}</strong> by <strong>Platform Root Admin</strong>
              </div>
            </div>

            <div className="vam-decision-grid">
              <div className="vam-decision-box">
                <div className="vam-decision-box-label">Marketplace Lifecycle</div>
                <div className="vam-decision-box-val">
                  {storefrontStatus === 'active' ? 'Approved & Fully Authorized' : (storefrontStatus === 'suspended' ? 'Suspended (Policy Hold)' : 'Application Under Review')}
                </div>
                <div className="vam-decision-box-sub">
                  Reviewer: Senior Compliance Auditor #4
                </div>
              </div>

              <div className="vam-decision-box">
                <div className="vam-decision-box-label">Compliance & Warnings</div>
                <div className={`vam-decision-box-val ${kybStatus === 'rejected' || storefrontStatus === 'suspended' ? 'danger' : 'success'}`}>
                  {storefrontStatus === 'suspended' ? 'Trademark / Policy Hold Active' : (kybStatus === 'verified' ? 'Zero Policy Warnings Active' : 'Document Submission Required')}
                </div>
                <div className="vam-decision-box-sub">
                  {kybStatus === 'verified' ? 'Identity & address verified' : 'Auditor flagged missing items'}
                </div>
              </div>

              <div className="vam-decision-box">
                <div className="vam-decision-box-label">Payout Governance Gate</div>
                <div className={`vam-decision-box-val ${payoutEligibility === 'eligible' ? 'success' : 'danger'}`}>
                  {payoutEligibility === 'eligible' ? 'Rolling Payouts Active' : 'Administrative Payout Hold'}
                </div>
                <div className="vam-decision-box-sub">
                  {payoutEligibility === 'eligible' ? 'Disbursements verified per order' : 'Fund transfers paused by admin'}
                </div>
              </div>
            </div>

            {/* Critical Business Detail Callout */}
            <div className="vam-protocol-banner">
              <div className="vam-protocol-header">
                <Info size={13} />
                <span>Order Fund Settlement Architecture (Delivery Verification Protocol)</span>
              </div>
              <div>
                <strong>Workflow:</strong> Customer pays → Merchant ships → Carrier POD verified → 48-hour buyer inspection buffer → Payout eligible.
              </div>
              <div className="vam-protocol-subtext">
                Merchant payout eligibility in this dossier grants permission for rolling automated transfers. Individual fund releases are evaluated on an order-by-order basis via tracking webhooks on the Orders Ledger, never released arbitrarily in bulk from this profile.
              </div>
            </div>
          </div>

          {/* Gate 1: Storefront Access Management */}
          <div className="vam-card">
            <div className="vam-gate-row">
              <div>
                <div className="vam-gate-row-title">
                  Storefront Access & Catalog Indexing
                </div>
                <div className="vam-gate-row-status">
                  Status: {storefrontStatus === 'active' ? 'Active (Public Storefront Live)' : 'Suspended (Catalog Hidden)'}
                </div>
                <div className="vam-gate-row-desc">
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
          <div className="vam-card">
            <div className="vam-provider-header">
              <div className="vam-provider-title">
                <CreditCard size={14} color="#38bdf8" />
                <span>Payment Provider Account (Stripe Connect)</span>
              </div>
              <span className={`vam-provider-badge ${paymentProvider.charges_enabled ? 'enabled' : 'blocked'}`}>
                {paymentProvider.charges_enabled ? 'Charges Enabled' : 'Charges Blocked'}
              </span>
            </div>

            <div className="vam-provider-grid">
              <div>
                <label className="vam-field-sublabel">Connected Account ID</label>
                <div className="vam-provider-acct-row">
                  <input
                    type="text"
                    readOnly
                    className="admin-input vam-acct-input"
                    value={paymentProvider.account_id}
                  />
                  <a
                    href={`https://dashboard.stripe.com/test/connect/accounts/${paymentProvider.account_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn admin-btn-ghost admin-btn-sm vam-acct-btn"
                    title="Inspect in provider console"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div>
                <label className="vam-field-sublabel">Settlement Bank Rails</label>
                <div className="vam-bank-box">
                  {paymentProvider.bank_name} •••• {paymentProvider.account_last4}
                  <span className="vam-bank-synced">(Synced from Provider Ledger)</span>
                </div>
              </div>
            </div>

            <div className="vam-provider-notice">
              Connected account banking details are synced directly via Stripe Connect webhooks. Direct manual text edits are disallowed to prevent payment redirect exploits.
            </div>
          </div>

          {/* Gate 3: Controlled Administrative Payout Governance */}
          <div className={`vam-card ${payoutEligibility === 'administrative_hold' ? 'hold-active' : ''}`}>
            <div className="vam-gate-row">
              <div>
                <div className="vam-gate-row-title">
                  Administrative Payout Governance
                </div>
                <div className={`vam-hold-status-val ${payoutEligibility === 'administrative_hold' ? 'hold' : 'eligible'}`}>
                  {payoutEligibility === 'administrative_hold' ? 'Administrative Payout Hold Active' : 'Rolling Payouts Eligible'}
                </div>
                <div className="vam-gate-row-desc">
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
              <div className="vam-hold-alert-box">
                <div className="vam-hold-alert-header">
                  <AlertCircle size={13} />
                  <span>Category: {vendor.payout_hold_details?.category || 'Administrative Compliance Review'}</span>
                </div>
                <div className="vam-hold-alert-content">
                  <strong>Justification:</strong> {vendor.payout_hold_details?.reason || 'Payout hold active pending compliance documentation.'}
                </div>
                <div className="vam-hold-alert-placed">
                  Placed by {vendor.payout_hold_details?.placed_by || 'Platform Admin'} on {new Date(vendor.payout_hold_details?.placed_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          {/* Unified Chronological Audit Trail */}
          <div className="vam-card">
            <div className="vam-audit-header">
              Immutable Compliance Audit Trail
            </div>

            <div className="vam-audit-trail-scroll">
              {auditTrail.map((aud) => (
                <div
                  key={aud.id}
                  className="vam-audit-entry"
                >
                  <div className="vam-audit-entry-header">
                    <span className="vam-audit-entry-action">{aud.action}</span>
                    <span className="vam-audit-entry-time">{new Date(aud.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="vam-audit-entry-note">{aud.note}</div>
                  <div className="vam-audit-entry-actor">Actor: {aud.actor}</div>
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
            <div className="vam-submodal-footer">
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
          <div className="vam-submodal-stack">
            <div className="vam-submodal-desc">
              Placing an administrative payout hold freezes outgoing escrow settlements to this merchant's bank account while keeping their storefront public and available for customer purchases.
            </div>

            <div>
              <label className="vam-submodal-label">
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
              <label className="vam-submodal-label">
                Formal Justification / Reason *
              </label>
              <textarea
                rows={3}
                className="admin-search-input vam-submodal-textarea"
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
            <div className="vam-submodal-footer">
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
          <div className="vam-submodal-stack">
            <div className="vam-submodal-desc">
              Releasing this payout hold will restore rolling automated payouts for delivered orders meeting the 48-hour delivery verification window.
            </div>

            <div>
              <label className="vam-submodal-label">
                Resolution Note (Optional)
              </label>
              <textarea
                rows={3}
                className="admin-search-input vam-submodal-textarea"
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
            <div className="vam-submodal-footer">
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
          <div className="vam-submodal-stack">
            <div className="vam-submodal-desc">
              {targetStorefrontStatus === 'active'
                ? 'Reactivating will make this atelier public and re-enable garment indexing in marketplace catalogs.'
                : 'Suspending will unlist this atelier from public search and disable customer checkout. Existing delivered orders remain eligible for settlement.'}
            </div>

            <div>
              <label className="vam-submodal-label">
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
