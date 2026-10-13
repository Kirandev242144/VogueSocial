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
    protocol_fees_desc: 'Standard payment processing passed at cost',
    fulfillment_model: 'Merchant Atelier Self-Fulfill',
    return_policy: '14-Day Boutique Window • Escrow released 48h post carrier delivery (POD)',
    payout_conditions: 'Automated delivery verification confirmed'
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
  const [holdCategory, setHoldCategory] = useState('Compliance Review');
  const [holdReason, setHoldReason] = useState('');
  
  // Release Hold Sub-dialog
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseNote, setReleaseNote] = useState('');

  // Storefront Status Confirmation dialog
  const [showStorefrontStatusModal, setShowStorefrontStatusModal] = useState(false);
  const [targetStorefrontStatus, setTargetStorefrontStatus] = useState('');
  const [storefrontReason, setStorefrontReason] = useState('');

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
    setTimeout(() => setFeedback(null), 3000);
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
      showFeedback('Business profile & addresses updated.');
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
      alert('Please provide a reason for placing a payout hold.');
      return;
    }
    if (onPlacePayoutHold) {
      await onPlacePayoutHold(vendor.id, {
        category: holdCategory,
        reason: holdReason,
        adminName: 'Platform Administrator'
      });
      setShowHoldModal(false);
      setHoldReason('');
      showFeedback('Payout hold placed. Storefront remains live.');
    } else if (onUpdateTerms) {
      await onUpdateTerms(vendor.id, { payout_hold: true });
      setShowHoldModal(false);
      showFeedback('Payout hold placed.');
    }
  };

  const handleConfirmReleasePayoutHold = async () => {
    if (onReleasePayoutHold) {
      await onReleasePayoutHold(vendor.id, {
        note: releaseNote || 'Compliance review resolved.',
        adminName: 'Platform Administrator'
      });
      setShowReleaseModal(false);
      setReleaseNote('');
      showFeedback('Payout hold released. Rolling payouts resumed.');
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
        adminName: 'Platform Administrator'
      });
      setShowStorefrontStatusModal(false);
      setStorefrontReason('');
      showFeedback(`Storefront status updated to ${targetStorefrontStatus}.`);
    } else if (onUpdateStatus) {
      await onUpdateStatus(vendor.id, targetStorefrontStatus === 'active' ? 'approve' : 'suspend', storefrontReason);
      setShowStorefrontStatusModal(false);
      showFeedback(`Storefront status updated.`);
    }
  };

  const handleExecuteRateAmendment = async (e) => {
    e.preventDefault();
    if (onUpdateAgreementRate) {
      await onUpdateAgreementRate(vendor.id, {
        newRate: parseFloat(rateForm.newRate),
        reason: rateForm.reason || 'Contract rate revision',
        effectiveDate: rateForm.effectiveDate,
        adminName: 'Commercial Director'
      });
      showFeedback(`Commission rate amended to ${rateForm.newRate}%.`);
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
    provider: 'Stripe Connect',
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
      reason: 'Standard atelier contract',
      updated_by: currentAgreement.accepted_by || 'Camille Laurent',
      updated_at: currentAgreement.accepted_at || '2026-08-15T10:14:22Z'
    }
  ];

  const auditTrail = vendor.audit_trail || [
    {
      id: 'aud_1',
      timestamp: vendor.created_at || '2026-08-15T10:00:00Z',
      actor: 'Platform Administrator',
      action: 'Account Approved',
      note: 'Initial boutique onboarding completed.'
    }
  ];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Boutique Dossier: ${vendor.store_name}`}
      maxWidth="840px"
      footer={
        <div className="vam-footer">
          <div className="vam-footer-id">
            <span>Merchant ID:</span>
            <code className="vam-footer-code">{vendor.id}</code>
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
              <span>Public Storefront</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      }
    >
      {/* Toast Feedback */}
      {feedback && (
        <div className={`vam-toast ${feedback.type === 'success' ? 'vam-toast-success' : 'vam-toast-error'}`}>
          {feedback.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Header Summary & Status Controls */}
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
              </div>
              <div className="vam-subtitle">
                @{vendor.store_handle} • {vendor.country || 'Global'} • {vendor.products_count ?? 0} active products
              </div>
            </div>
          </div>

          <div className="vam-header-actions">
            {storefrontStatus === 'active' ? (
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
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

            {payoutEligibility === 'administrative_hold' ? (
              <button
                type="button"
                className="admin-btn admin-btn-primary admin-btn-sm"
                onClick={() => setShowReleaseModal(true)}
              >
                <Unlock size={12} /> Resume Payouts
              </button>
            ) : (
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => setShowHoldModal(true)}
              >
                <Lock size={12} /> Pause Payouts
              </button>
            )}
          </div>
        </div>

        {/* Compact Operational Status Bar */}
        <div className="vam-status-bar">
          <div className="vam-status-chip">
            <span className="vam-chip-label">Storefront:</span>
            <div className={`vam-chip-dot ${storefrontStatus === 'active' ? 'active' : (storefrontStatus === 'suspended' ? 'suspended' : 'review')}`} />
            <span className="vam-chip-val">
              {storefrontStatus === 'active' ? 'Live' : (storefrontStatus === 'suspended' ? 'Suspended' : 'Under Review')}
            </span>
          </div>

          <div className="vam-status-chip">
            <span className="vam-chip-label">KYB Verification:</span>
            <div className={`vam-chip-dot ${kybStatus === 'verified' ? 'verified' : (kybStatus === 'rejected' ? 'rejected' : 'review')}`} />
            <span className="vam-chip-val">
              {kybStatus === 'verified' ? 'Verified' : (kybStatus === 'rejected' ? 'Rejected' : 'Review Required')}
            </span>
          </div>

          <div className="vam-status-chip">
            <span className="vam-chip-label">Payouts:</span>
            <div className={`vam-chip-dot ${payoutEligibility === 'eligible' ? 'eligible' : 'hold'}`} />
            <span className="vam-chip-val">
              {payoutEligibility === 'eligible' ? 'Active' : 'Paused (On Hold)'}
            </span>
          </div>
        </div>
      </div>

      {/* Streamlined 3-Tab Navigation */}
      <div className="admin-tab-nav vam-tab-nav">
        {[
          { id: 'business', label: 'Atelier & Addresses' },
          { id: 'documents', label: 'Compliance Documents', count: docs.length },
          { id: 'financials', label: 'Financials & Commercials', alert: payoutEligibility === 'administrative_hold' }
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
                <span className="vam-tab-badge">{t.count}</span>
              )}
              {t.alert && (
                <span className="vam-tab-alert" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Atelier Profile & Addresses */}
      {activeTab === 'business' && (
        <form onSubmit={handleSaveBusinessInfo}>
          <div className="vam-stack">
            {/* Legal Entity Registration */}
            <div className="vam-card">
              <div className="vam-card-header">
                <div className="vam-card-title">
                  <Building2 size={13} color="#38bdf8" /> Legal Entity Registration
                </div>
              </div>

              <div className="vam-grid-2">
                <div>
                  <label className="vam-field-label">Legal Company Name</label>
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
                  <label className="vam-field-label">Entity Type</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.business_type}
                    onChange={(e) => setBizForm({ ...bizForm, business_type: e.target.value })}
                    placeholder="e.g. S.A.S., LLC, S.r.l."
                  />
                </div>

                <div>
                  <label className="vam-field-label">Tax / VAT Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.tax_id}
                    onChange={(e) => setBizForm({ ...bizForm, tax_id: e.target.value })}
                    placeholder="e.g. FR892938491"
                  />
                </div>

                <div>
                  <label className="vam-field-label">Commercial Registry Number</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.registration_number}
                    onChange={(e) => setBizForm({ ...bizForm, registration_number: e.target.value })}
                    placeholder="e.g. RCS Paris 892 938 491"
                  />
                </div>
              </div>
            </div>

            {/* Addresses Grid */}
            <div className="vam-addresses-grid">
              {/* Registered Corporate Address */}
              <div className="vam-address-card">
                <div className="vam-address-header">
                  <div className="vam-address-title">
                    <MapPin size={12} color="#38bdf8" /> Registered Corporate Address
                  </div>
                </div>

                <div className="vam-address-fields">
                  <div>
                    <label className="vam-sublabel">Street</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={bizForm.legal_address.street}
                      onChange={(e) => setBizForm({
                        ...bizForm,
                        legal_address: { ...bizForm.legal_address, street: e.target.value }
                      })}
                      placeholder="18 Rue du Faubourg Saint-Honoré"
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
                    <span>Same as registered</span>
                  </label>
                </div>

                {sameAsRegistered ? (
                  <div className="vam-same-address-box">
                    <div className="vam-same-address-heading">
                      <CheckCircle size={13} color="#10b981" />
                      <span>Same as registered business address</span>
                    </div>
                    <div className="vam-same-address-code">
                      {bizForm.legal_address.street || 'Address on file'}
                      <br />
                      {bizForm.legal_address.city || ''} {bizForm.legal_address.postal_code || ''} {bizForm.legal_address.country ? `• ${bizForm.legal_address.country}` : ''}
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
                        placeholder="42 Rue de Paradis, Atelier 3B"
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
                  <User size={13} color="#38bdf8" /> Authorized Representative
                </div>
              </div>

              <div className="vam-grid-2">
                <div>
                  <label className="vam-field-label">Representative Name</label>
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
                  <label className="vam-field-label">Corporate Title</label>
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
                  <label className="vam-field-label">Email</label>
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
                  <label className="vam-field-label">Direct Phone</label>
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
                Save Atelier Profile
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Compliance Documents */}
      {activeTab === 'documents' && (
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
              badgeText = 'Rejected';
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
                      <div className="vam-doc-title">
                        {doc.title}
                      </div>
                      <div className="vam-doc-meta">
                        <span className="vam-doc-filename">{doc.filename}</span> • {doc.size} • Expiry: {doc.expiry_date || 'N/A'}
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
                      <Eye size={12} /> View
                    </button>

                    {!isVerified && (
                      <button
                        type="button"
                        className="admin-btn admin-btn-primary admin-btn-sm vam-btn-compact"
                        onClick={() => handleDocAction(doc.id, 'verified')}
                      >
                        <Check size={12} /> Verify
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm vam-btn-compact"
                        onClick={() => setRejectingDocId(doc.id)}
                      >
                        <X size={12} /> Reject
                      </button>
                    )}
                  </div>
                </div>

                {doc.notes && (
                  <div className={`vam-doc-notes ${isRejected ? 'rejected' : ''}`}>
                    <strong>Review Note:</strong> {doc.notes}
                    {doc.reviewed_by && <span> — {doc.reviewed_by}</span>}
                  </div>
                )}

                {/* Reject note dialog */}
                {rejectingDocId === doc.id && (
                  <div className="vam-reject-dialog">
                    <div className="vam-reject-title">
                      Reason for rejecting {doc.title}:
                    </div>
                    <input
                      type="text"
                      className="admin-input vam-reject-input"
                      placeholder="e.g. Utility bill is over 90 days old or document unreadable..."
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

          {/* Document Lightbox Preview */}
          {previewDoc && (
            <AdminModal
              isOpen={Boolean(previewDoc)}
              onClose={() => setPreviewDoc(null)}
              title={`Document: ${previewDoc.title}`}
              maxWidth="480px"
              footer={
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => setPreviewDoc(null)}
                >
                  Close
                </button>
              }
            >
              <div className="vam-preview-body">
                <FileCheck size={40} color="#38bdf8" className="vam-preview-icon" />
                <div className="vam-preview-filename">
                  {previewDoc.filename}
                </div>
                <div className="vam-preview-meta-list">
                  <div><strong>Document:</strong> {previewDoc.title}</div>
                  <div><strong>Type:</strong> <span className="vam-preview-code">{previewDoc.type}</span></div>
                  <div><strong>Status:</strong> {previewDoc.status}</div>
                  <div><strong>Expiry Date:</strong> {previewDoc.expiry_date || 'N/A'}</div>
                  <div><strong>Uploaded:</strong> {new Date(previewDoc.uploaded_at).toLocaleDateString()}</div>
                  {previewDoc.notes && <div><strong>Audit Note:</strong> {previewDoc.notes}</div>}
                </div>
              </div>
            </AdminModal>
          )}
        </div>
      )}

      {/* TAB 3: Financials & Commercials */}
      {activeTab === 'financials' && (
        <div className="vam-stack">
          {/* Payment Provider (Stripe Connect) */}
          <div className="vam-card">
            <div className="vam-card-header">
              <div className="vam-card-title">
                <CreditCard size={13} color="#38bdf8" /> Payment Provider (Stripe Connect)
              </div>
              <span className={`vam-doc-badge ${paymentProvider.charges_enabled ? 'verified' : 'rejected'}`}>
                {paymentProvider.charges_enabled ? 'Charges Enabled' : 'Charges Disabled'}
              </span>
            </div>

            <div className="vam-finance-grid">
              <div className="vam-info-box">
                <div className="vam-info-label">Connected Account ID</div>
                <div className="vam-stripe-row">
                  <input
                    type="text"
                    readOnly
                    className="admin-input vam-stripe-input"
                    value={paymentProvider.account_id}
                  />
                  <a
                    href={`https://dashboard.stripe.com/test/connect/accounts/${paymentProvider.account_id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    title="View in Stripe Dashboard"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="vam-info-box">
                <div className="vam-info-label">Settlement Bank Rails</div>
                <div className="vam-info-val-md">
                  {paymentProvider.bank_name} •••• {paymentProvider.account_last4}
                </div>
                <div className="vam-info-sub">
                  Currency: {paymentProvider.currency || 'EUR'}
                </div>
              </div>
            </div>
          </div>

          {/* Payout Governance & Settlement Status */}
          <div className={`vam-card ${payoutEligibility === 'administrative_hold' ? 'alert-border' : ''}`}>
            <div className="vam-card-header">
              <div className="vam-card-title">
                <ShieldCheck size={13} color={payoutEligibility === 'administrative_hold' ? '#ef4444' : '#10b981'} />
                <span>Payout Settlement Status</span>
              </div>

              {payoutEligibility === 'administrative_hold' ? (
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() => setShowReleaseModal(true)}
                >
                  <Unlock size={12} /> Resume Payouts
                </button>
              ) : (
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => setShowHoldModal(true)}
                >
                  <Lock size={12} /> Pause Payouts
                </button>
              )}
            </div>

            {payoutEligibility === 'administrative_hold' ? (
              <div className="vam-hold-alert">
                <div className="vam-hold-header">
                  <AlertCircle size={14} />
                  <span>Administrative Payout Hold Active — Outgoing settlements paused</span>
                </div>
                <div className="vam-hold-content">
                  <strong>Reason:</strong> {vendor.payout_hold_details?.reason || 'Compliance documentation under review.'}
                </div>
                <div className="vam-hold-meta">
                  Placed by {vendor.payout_hold_details?.placed_by || 'Platform Admin'} on {new Date(vendor.payout_hold_details?.placed_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            ) : (
              <div className="vam-info-box">
                <div className="vam-info-label">Current Payout Schedule</div>
                <div className="vam-info-val-md">
                  Rolling Automated Disbursements Active
                </div>
                <div className="vam-info-sub">
                  Orders settle 48 hours post verified delivery (POD).
                </div>
              </div>
            )}
          </div>

          {/* Commercial Terms & Commission Rate */}
          <div className="vam-card">
            <div className="vam-card-header">
              <div className="vam-card-title">
                <FileSignature size={13} color="#38bdf8" /> Commercial Agreement ({currentAgreement.version || 'v2.4'})
              </div>
              <div className="vam-info-sub">
                Effective: {currentAgreement.effective_date || '2026-08-15'}
              </div>
            </div>

            <div className="vam-finance-grid">
              <div className="vam-info-box">
                <div className="vam-info-label">Commission Take-Rate</div>
                <div className="vam-info-val-lg">
                  {(currentAgreement.commission_rate_pct ?? 5.0).toFixed(1)}%
                </div>
                <div className="vam-info-sub">
                  Applied to settled order GMV
                </div>
              </div>

              <div className="vam-info-box">
                <div className="vam-info-label">Fulfillment Model</div>
                <div className="vam-info-val-md">
                  {currentAgreement.fulfillment_model || 'Merchant Atelier Self-Fulfill'}
                </div>
                <div className="vam-info-sub">
                  Tracking required within 72h
                </div>
              </div>
            </div>

            {/* Rate Revision Form */}
            <form onSubmit={handleExecuteRateAmendment} className="vam-rate-inline-form">
              <div>
                <label className="vam-field-label">New Rate (%)</label>
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
                <label className="vam-field-label">Effective Date</label>
                <input
                  type="date"
                  className="admin-input"
                  value={rateForm.effectiveDate}
                  onChange={(e) => setRateForm({ ...rateForm, effectiveDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="vam-field-label">Revision Reason</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Volume milestone incentive..."
                  value={rateForm.reason}
                  onChange={(e) => setRateForm({ ...rateForm, reason: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn-primary admin-btn-sm vam-rate-btn"
                disabled={loading}
              >
                Update Rate
              </button>
            </form>

            {/* Agreement History */}
            {agreementHistory.length > 0 && (
              <div className="vam-history-list">
                {agreementHistory.map((h, i) => (
                  <div key={i} className="vam-history-item">
                    <div className="vam-history-left">
                      <span className="vam-history-version">{h.version}</span>
                      <span className="vam-history-rate">{h.rate_pct}% Rate</span>
                      <span>• {h.reason}</span>
                    </div>
                    <div className="vam-history-meta">
                      {h.effective_date} • {h.updated_by}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Audit Trail */}
          <div className="vam-card">
            <div className="vam-card-header">
              <div className="vam-card-title">
                <History size={13} color="#38bdf8" /> Activity Audit Trail
              </div>
            </div>

            <div className="vam-audit-scroll">
              {auditTrail.map((aud) => (
                <div key={aud.id} className="vam-audit-item">
                  <div className="vam-audit-item-top">
                    <span className="vam-audit-action">{aud.action}</span>
                    <span className="vam-audit-time">{new Date(aud.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="vam-audit-note">{aud.note}</div>
                  <div className="vam-audit-actor">{aud.actor}</div>
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
          title="Pause Merchant Payouts"
          maxWidth="460px"
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
                Confirm Pause
              </button>
            </div>
          }
        >
          <div className="vam-submodal-stack">
            <div className="vam-submodal-desc">
              Pauses outgoing disbursements to this merchant's bank account. Public storefront and checkout remain operational.
            </div>

            <div>
              <label className="vam-field-label">Hold Category</label>
              <select
                className="admin-input"
                value={holdCategory}
                onChange={(e) => setHoldCategory(e.target.value)}
              >
                <option value="Compliance Documentation Review">Compliance Documentation Review</option>
                <option value="Trademark / Copyright Dispute">Trademark / Copyright Dispute</option>
                <option value="High Return / Defect Rate">High Return / Defect Rate</option>
                <option value="Buyer Claim Arbitration">Buyer Claim Arbitration</option>
                <option value="Risk Review">Risk Review</option>
              </select>
            </div>

            <div>
              <label className="vam-field-label">Reason / Justification *</label>
              <textarea
                rows={3}
                className="admin-search-input vam-submodal-textarea"
                placeholder="State the reason for pausing payouts..."
                value={holdReason}
                onChange={(e) => setHoldReason(e.target.value)}
                required
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Resume Payout Hold Sub-Dialog */}
      {showReleaseModal && (
        <AdminModal
          isOpen={showReleaseModal}
          onClose={() => setShowReleaseModal(false)}
          title="Resume Merchant Payouts"
          maxWidth="460px"
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
                Resume Payouts
              </button>
            </div>
          }
        >
          <div className="vam-submodal-stack">
            <div className="vam-submodal-desc">
              Resumes rolling automated disbursements for delivered orders meeting the 48-hour delivery verification window.
            </div>

            <div>
              <label className="vam-field-label">Resolution Note (Optional)</label>
              <textarea
                rows={3}
                className="admin-search-input vam-submodal-textarea"
                placeholder="e.g. Valid address proof received and verified..."
                value={releaseNote}
                onChange={(e) => setReleaseNote(e.target.value)}
              />
            </div>
          </div>
        </AdminModal>
      )}

      {/* Storefront Status Dialog */}
      {showStorefrontStatusModal && (
        <AdminModal
          isOpen={showStorefrontStatusModal}
          onClose={() => setShowStorefrontStatusModal(false)}
          title={targetStorefrontStatus === 'active' ? 'Reactivate Storefront' : 'Suspend Storefront'}
          maxWidth="460px"
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
                {targetStorefrontStatus === 'active' ? 'Reactivate' : 'Confirm Suspension'}
              </button>
            </div>
          }
        >
          <div className="vam-submodal-stack">
            <div className="vam-submodal-desc">
              {targetStorefrontStatus === 'active'
                ? 'Reactivating makes this atelier live and restores its garments to marketplace search and checkout.'
                : 'Suspending unlists the atelier from public discovery and disables checkout. Existing delivered orders remain eligible for settlement.'}
            </div>

            <div>
              <label className="vam-field-label">Reason (Optional)</label>
              <input
                type="text"
                className="admin-input"
                placeholder="e.g. Policy investigation or terms compliance..."
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
