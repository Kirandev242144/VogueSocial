"use client";
import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle, AlertTriangle, ShieldAlert, Building2,
  FileText, CreditCard, ShieldCheck, ExternalLink, Globe,
  Check, Clock, MapPin, User, Phone, Mail, FileCheck, Eye
} from 'lucide-react';
import { AdminModal, AdminStatusBadge } from '../index';

export default function VendorAuditModal({
  vendor,
  isOpen,
  onClose,
  onSaveBusiness,
  onUpdateDocStatus,
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

  // Commercial terms form state
  const [termsForm, setTermsForm] = useState({
    take_rate_pct: vendor.commercial_terms?.take_rate_pct || 5.0,
    payout_hold: Boolean(vendor.commercial_terms?.payout_hold)
  });

  // Action notes state
  const [auditNote, setAuditNote] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (vendor) {
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

      setTermsForm({
        take_rate_pct: vendor.commercial_terms?.take_rate_pct || 5.0,
        payout_hold: Boolean(vendor.commercial_terms?.payout_hold)
      });
    }
  }, [vendor]);

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveBusinessInfo = async (e) => {
    e.preventDefault();
    if (onSaveBusiness) {
      await onSaveBusiness(vendor.id, bizForm);
      showFeedback('Business profile & addresses saved successfully.');
    }
  };

  const handleSaveTerms = async (e) => {
    e.preventDefault();
    if (onUpdateTerms) {
      await onUpdateTerms(vendor.id, termsForm);
      showFeedback('Commercial take-rate & payout hold updated.');
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

  const handleStatusChange = async (action) => {
    if (onUpdateStatus) {
      await onUpdateStatus(vendor.id, action, auditNote);
      setAuditNote('');
      showFeedback(`Boutique status updated to ${action}.`);
    }
  };

  const docs = vendor.documents || [];
  const status = vendor.vendor_status || 'approved';

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Boutique Audit Dossier: ${vendor.store_name}`}
      maxWidth="780px"
      footer={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
            <span>Merchant ID:</span>
            <code style={{ fontFamily: 'monospace', color: 'var(--adm-text-main)' }}>{vendor.id}</code>
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
              <span>Visit Storefront</span>
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

      {/* Header Summary Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          background: 'var(--adm-panel-hover)',
          border: '1px solid var(--adm-border)',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
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
              fontSize: '1rem',
              color: 'var(--adm-accent)'
            }}
          >
            {(vendor.store_name || 'V').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
              {vendor.store_name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
              @{vendor.store_handle} • {vendor.country || 'Global'} • {vendor.products_count ?? 0} active garments
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AdminStatusBadge status={status} />
        </div>
      </div>

      {/* Modal Tab Navigation */}
      <div className="admin-tab-nav" style={{ marginBottom: '1.25rem' }}>
        {[
          { id: 'business', label: 'Business & Legal Entity' },
          { id: 'documents', label: 'Address Proof & Documents', count: docs.length },
          { id: 'commercials', label: 'Marketplace Terms' },
          { id: 'decision', label: 'Audit & Decision' }
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
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={13} color="#38bdf8" /> Corporate Legal Registration
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
                  <label className="admin-settings-title" style={{ display: 'block', marginBottom: '4px' }}>
                    Tax / VAT Identification
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.tax_id}
                    onChange={(e) => setBizForm({ ...bizForm, tax_id: e.target.value })}
                    placeholder="e.g. FR 89 293849102"
                  />
                </div>

                <div>
                  <label className="admin-settings-title" style={{ display: 'block', marginBottom: '4px' }}>
                    Company Registry Number
                  </label>
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

            {/* Addresses Card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Registered Legal Corporate Address */}
              <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={12} color="#38bdf8" /> Registered Corporate Address
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

              {/* Physical Dispatch & Return Warehouse Address */}
              <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={12} color="#10b981" /> Atelier Dispatch / Return Hub
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                      placeholder="42 Rue de Paradis, Atelier 3B"
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
              </div>
            </div>

            {/* Representative Card */}
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={13} color="#38bdf8" /> Primary Business Representative
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
                    Official Corporate Title
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
                    Direct Email
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
          <div style={{ marginBottom: '1rem', fontSize: '0.74rem', color: 'var(--adm-text-sub)' }}>
            Inspect legal incorporation extracts, address proof bills, and brand trademark authorizations. Every boutique requires verified address proof before payout disbursement.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {docs.map((doc) => {
              const isVerified = doc.status === 'verified';
              const isRejected = doc.status === 'rejected';
              const isPending = doc.status === 'pending' || !doc.status;

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
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--adm-text-main)' }}>
                          {doc.title}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                          File: <span style={{ fontFamily: 'monospace' }}>{doc.filename}</span> • {doc.size} • Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
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
                          <Check size={11} /> Approve
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
                        placeholder="e.g. Utility bill is over 90 days old or address does not match incorporation..."
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
              title={`Document Inspection: ${previewDoc.title}`}
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
              <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--adm-bg)', borderRadius: '8px', border: '1px solid var(--adm-border)' }}>
                <FileCheck size={48} color="#38bdf8" style={{ margin: '0 auto 1rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--adm-text-main)' }}>
                  {previewDoc.filename}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
                  Cryptographically hashed sandbox PDF • {previewDoc.size}
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '6px', background: 'var(--adm-panel-hover)', fontSize: '0.72rem', color: 'var(--adm-text-main)', textAlign: 'left' }}>
                  <div><strong>Document Type:</strong> {previewDoc.type}</div>
                  <div><strong>Status:</strong> {previewDoc.status}</div>
                  <div><strong>Uploaded:</strong> {new Date(previewDoc.uploaded_at).toLocaleString()}</div>
                  {previewDoc.notes && <div style={{ marginTop: '4px' }}><strong>Note:</strong> {previewDoc.notes}</div>}
                </div>
              </div>
            </AdminModal>
          )}
        </div>
      )}

      {/* Tab 3: Marketplace & Financial Terms */}
      {activeTab === 'commercials' && (
        <form onSubmit={handleSaveTerms}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="admin-settings-row">
              <div className="admin-settings-info">
                <div className="admin-settings-title">Negotiated Commission Take-Rate</div>
                <div className="admin-settings-desc">Percentage deducted from gross merchandise value on settled orders.</div>
              </div>
              <div className="admin-settings-control">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    step="0.5"
                    className="admin-input"
                    value={termsForm.take_rate_pct}
                    onChange={(e) => setTermsForm({ ...termsForm, take_rate_pct: parseFloat(e.target.value) || 0 })}
                    style={{ width: '90px', fontWeight: 600 }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>%</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', marginLeft: '0.5rem' }}>
                    (Standard marketplace rate is 5.0%)
                  </span>
                </div>
              </div>
            </div>

            <div className="admin-settings-row">
              <div className="admin-settings-info">
                <div className="admin-settings-title">Administrative Payout Hold</div>
                <div className="admin-settings-desc">Freeze escrow disbursement without unlisting the storefront.</div>
              </div>
              <div className="admin-settings-control">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={termsForm.payout_hold}
                    onChange={(e) => setTermsForm({ ...termsForm, payout_hold: e.target.checked })}
                    style={{ accentColor: 'var(--adm-accent)', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.78rem', fontWeight: 500, color: termsForm.payout_hold ? '#ef4444' : 'var(--adm-text-main)' }}>
                    {termsForm.payout_hold ? 'Payouts Currently Frozen (Administrative Hold)' : 'Rolling Payouts Active'}
                  </span>
                </label>
              </div>
            </div>

            <div className="admin-settings-row">
              <div className="admin-settings-info">
                <div className="admin-settings-title">Connected Payment Vault ID</div>
                <div className="admin-settings-desc">Provider connected account receiving automated transfer splits.</div>
              </div>
              <div className="admin-settings-control">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    readOnly
                    className="admin-input"
                    value={vendor.commercial_terms?.stripe_account_id || 'acct_unconnected'}
                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.74rem', background: 'var(--adm-bg)' }}
                  />
                  {vendor.commercial_terms?.stripe_account_id && (
                    <a
                      href={`https://dashboard.stripe.com/test/connect/accounts/${vendor.commercial_terms.stripe_account_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      style={{ padding: '4px 8px' }}
                      title="Open in provider console"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
                  Destination: {vendor.commercial_terms?.bank_name || 'Commercial Bank'} •••• {vendor.commercial_terms?.account_last4 || '0000'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                className="admin-btn admin-btn-primary admin-btn-sm"
                disabled={loading}
              >
                Save Commercial Terms
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Audit & Decision */}
      {activeTab === 'decision' && (
        <div>
          {/* Current Decision Box */}
          <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Boutique Governance Status
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--adm-text-main)', textTransform: 'capitalize' }}>
                  Current Status: {status.replace('_', ' ')}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                  {status === 'approved' && 'Storefront is publicly accessible, products are indexed, and payouts are operational.'}
                  {status === 'pending_approval' && 'Application submitted. Catalog is hidden from public market until approved.'}
                  {status === 'changes_requested' && 'Application paused. Merchant has been requested to submit missing documentation.'}
                  {status === 'suspended' && 'Storefront unlisted and checkouts paused due to policy infraction or copyright review.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(status === 'pending_approval' || status === 'changes_requested') && (
                  <>
                    <button
                      type="button"
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={() => handleStatusChange('approve')}
                    >
                      <CheckCircle size={13} /> Approve Boutique
                    </button>

                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleStatusChange('request_changes')}
                    >
                      <AlertTriangle size={13} /> Request Missing Docs
                    </button>

                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleStatusChange('reject')}
                    >
                      <X size={13} /> Reject
                    </button>
                  </>
                )}

                {status === 'approved' && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => handleStatusChange('suspend')}
                  >
                    <ShieldAlert size={13} /> Suspend Storefront
                  </button>
                )}

                {status === 'suspended' && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => handleStatusChange('reactivate')}
                  >
                    <CheckCircle size={13} /> Reactivate Boutique
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Audit Notes & Log */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
              Add Compliance Note / Reason
            </label>
            <textarea
              rows={2}
              className="admin-search-input"
              style={{ width: '100%', height: 'auto', padding: '0.65rem 0.85rem', marginBottom: '0.75rem' }}
              placeholder="e.g. Verified Charonne commercial lease and Paris company registration. Approved for autumn launch."
              value={auditNote}
              onChange={(e) => setAuditNote(e.target.value)}
            />

            {vendor.admin_notes && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--adm-text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
                  Audit History Log
                </div>
                <pre
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: 'var(--adm-bg)',
                    border: '1px solid var(--adm-border)',
                    fontSize: '0.72rem',
                    color: 'var(--adm-text-main)',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    margin: 0
                  }}
                >
                  {vendor.admin_notes}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminModal>
  );
}
