"use client";
import React, { useState } from 'react';
import { FileText, Eye, Check, X, FileCheck, Info, MinusCircle, RotateCcw } from 'lucide-react';
import { AdminModal } from '../index';

export default function VendorComplianceTab({
  vendor,
  onUpdateDocStatus,
  showFeedback
}) {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [exemptingDocId, setExemptingDocId] = useState(null);
  const [exemptReason, setExemptReason] = useState('');

  const docs = vendor.documents || [];
  const country = vendor.country || vendor.legal_address?.country || 'France';
  const businessType = vendor.business_type || 'Corporation';
  const isSoleProprietor = Boolean(
    businessType.toLowerCase().includes('sole') ||
    businessType.toLowerCase().includes('individual') ||
    businessType.toLowerCase().includes('auto-entrepreneur')
  );

  const handleDocAction = async (docId, status, notes = '') => {
    if (onUpdateDocStatus) {
      await onUpdateDocStatus(vendor.id, docId, status, notes);
      setRejectingDocId(null);
      setRejectReason('');
      setExemptingDocId(null);
      setExemptReason('');
      showFeedback(`Document marked as ${status === 'na' ? 'Not Applicable' : status}.`);
    }
  };

  // Helper to determine country and entity-specific guidance
  const getDocTypeGuidance = (docType) => {
    if (docType === 'incorporation' || docType === 'business_registration') {
      if (country === 'France') {
        return isSoleProprietor
          ? 'France: Not Applicable for Auto-entrepreneurs (Avis SIRENE used instead of Kbis/RNE)'
          : 'France: Extrait Kbis (Tribunal de Commerce) or Extrait RNE (Registre National des Entreprises)';
      }
      if (country === 'United States') {
        return isSoleProprietor
          ? 'United States: Not Applicable for Sole Proprietors (DBA or Local Business License)'
          : 'United States: Articles of Organization / Certificate of Formation (State DOS)';
      }
      if (country === 'United Kingdom') {
        return isSoleProprietor
          ? 'United Kingdom: Not Applicable for Sole Traders (HMRC UTR Self-Assessment)'
          : 'United Kingdom: Companies House Certificate of Incorporation';
      }
      if (country === 'Italy') {
        return 'Italy: Camera di Commercio (Visura Camerale ordinaria)';
      }
      if (country === 'Germany') {
        return 'Germany: Handelsregisterauszug (Registergericht)';
      }
      return isSoleProprietor
        ? 'Global: Not Applicable for Sole Proprietorships (No corporate charter required)'
        : 'Global: Commercial Registry Extract or Certificate of Good Standing';
    }

    if (docType === 'address_proof') {
      return 'Valid within 90 days (Commercial lease deed, utility bill, bank settlement confirmation)';
    }

    if (docType === 'owner_id') {
      return 'Government-issued passport or national ID of authorized beneficial owner / representative';
    }

    if (docType === 'trademark') {
      return 'Registered trademark filing or certified brand authorization / distribution agreement';
    }

    return null;
  };

  return (
    <div className="vam-stack">
      {/* Compliance Policy & Jurisdiction Callout */}
      <div className="vam-compliance-guidance-card">
        <div className="vam-compliance-guidance-header">
          <div className="vam-compliance-guidance-title">
            <Info size={14} className="vam-icon-info" />
            <span>Jurisdiction Policy & Verification Framework</span>
          </div>
          <span className="vam-guidance-badge">
            {country} • {businessType}
          </span>
        </div>

        <div className="vam-guidance-grid">
          <div className="vam-guidance-item">
            <div className="vam-guidance-label">Business Registration Proof</div>
            <div className="vam-guidance-val">
              {isSoleProprietor ? 'Exempt / Not Applicable (Sole Proprietor)' : 'Required (Country Commercial Register)'}
            </div>
            <div className="vam-guidance-sub">
              {country === 'France'
                ? (isSoleProprietor ? 'Avis de situation SIRENE accepted; no Kbis/RNE required' : 'Kbis or RNE excerpt valid within 90 days')
                : (isSoleProprietor ? 'Sole proprietorships do not require incorporation deeds' : 'Official state/country formation certificate')}
            </div>
          </div>

          <div className="vam-guidance-item">
            <div className="vam-guidance-label">Beneficial Owner / Rep ID</div>
            <div className="vam-guidance-val">Required (KYC Screening)</div>
            <div className="vam-guidance-sub">
              Government photo ID matching legal representative on file
            </div>
          </div>

          <div className="vam-guidance-item">
            <div className="vam-guidance-label">Physical Address Proof</div>
            <div className="vam-guidance-val">Required (Premises Verification)</div>
            <div className="vam-guidance-sub">
              Utility statement or commercial lease deed matching return hub
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="vam-docs-list">
        {docs.map((doc) => {
          const isVerified = doc.status === 'verified';
          const isRejected = doc.status === 'rejected';
          const isNA = doc.status === 'na';
          const isRequired = doc.status === 'required';

          let badgeClass = 'pending';
          let badgeText = 'Pending Review';

          if (isVerified) {
            badgeClass = 'verified';
            badgeText = 'Verified';
          } else if (isRejected) {
            badgeClass = 'rejected';
            badgeText = 'Rejected';
          } else if (isNA) {
            badgeClass = 'na';
            badgeText = 'Not Applicable';
          } else if (isRequired) {
            badgeClass = 'required';
            badgeText = 'Action Required';
          }

          const guidance = getDocTypeGuidance(doc.type);
          const isDocSoleProprietorExempt = (doc.type === 'incorporation' || doc.type === 'business_registration') && isSoleProprietor;

          return (
            <div
              key={doc.id}
              className={`vam-doc-item ${isRejected ? 'rejected' : ''} ${isNA ? 'na' : ''}`}
            >
              <div className="vam-doc-row">
                <div className="vam-doc-left">
                  <div className="vam-doc-icon">
                    <FileText size={16} />
                  </div>
                  <div className="vam-doc-info">
                    <div className="vam-doc-title-row">
                      <span className="vam-doc-title">{doc.title}</span>
                      {isDocSoleProprietorExempt && !isNA && (
                        <span className="vam-doc-pill-hint">Sole Proprietor Exempt</span>
                      )}
                    </div>
                    <div className="vam-doc-meta">
                      <span className="vam-doc-filename">{doc.filename}</span> • {doc.size} • Expiry: {doc.expiry_date || 'N/A'}
                    </div>
                    {guidance && (
                      <div className="vam-doc-guidance-text">
                        {guidance}
                      </div>
                    )}
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

                  {!isNA && (doc.type === 'incorporation' || isSoleProprietor) && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm vam-btn-compact"
                      onClick={() => setExemptingDocId(doc.id)}
                      title="Mark document as not applicable for this business structure"
                    >
                      <MinusCircle size={12} /> Mark N/A
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

                  {(isVerified || isRejected || isNA) && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-compact"
                      onClick={() => handleDocAction(doc.id, 'required', 'Reopened for merchant re-submission.')}
                      title="Reset status and request updated submission"
                    >
                      <RotateCcw size={12} /> Reopen
                    </button>
                  )}
                </div>
              </div>

              {/* Informational N/A banner for sole proprietors */}
              {isNA && (
                <div className="vam-doc-na-banner">
                  <MinusCircle size={13} className="vam-icon-muted" />
                  <span>
                    Marked Not Applicable for this merchant: {doc.notes || 'Sole proprietorship / individual merchant without incorporation requirement.'}
                  </span>
                </div>
              )}

              {doc.notes && !isNA && (
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
                    placeholder="e.g. Utility bill is older than 90 days, or document extract is unreadable..."
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

              {/* Mark as N/A dialog */}
              {exemptingDocId === doc.id && (
                <div className="vam-exempt-dialog">
                  <div className="vam-exempt-title">
                    Reason for marking {doc.title} as Not Applicable:
                  </div>
                  <input
                    type="text"
                    className="admin-input vam-exempt-input"
                    placeholder="e.g. Auto-entrepreneur / Sole proprietor: Certified via personal tax ID and photo identity."
                    value={exemptReason}
                    onChange={(e) => setExemptReason(e.target.value)}
                  />
                  <div className="vam-reject-actions">
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      onClick={() => { setExemptingDocId(null); setExemptReason(''); }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleDocAction(doc.id, 'na', exemptReason || 'Not Applicable: Sole proprietorship / individual merchant exemption.')}
                    >
                      Confirm Exemption
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Document Lightbox Preview */}
      {previewDoc && (
        <AdminModal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          title={`Document: ${previewDoc.title}`}
          maxWidth="500px"
          footer={
            <div className="vam-submodal-footer">
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setPreviewDoc(null)}
              >
                Close
              </button>
            </div>
          }
        >
          <div className="vam-preview-body">
            <FileCheck size={40} className="vam-preview-icon vam-icon-accent" />
            <div className="vam-preview-filename">
              {previewDoc.filename}
            </div>
            <div className="vam-preview-meta-list">
              <div><strong>Document:</strong> {previewDoc.title}</div>
              <div><strong>Type:</strong> <span className="vam-preview-code">{previewDoc.type}</span></div>
              <div><strong>Status:</strong> {previewDoc.status}</div>
              <div><strong>Jurisdiction:</strong> {country}</div>
              <div><strong>Expiry Date:</strong> {previewDoc.expiry_date || 'Permanent / N/A'}</div>
              <div><strong>Uploaded:</strong> {new Date(previewDoc.uploaded_at).toLocaleDateString()}</div>
              {previewDoc.notes && <div><strong>Audit Note:</strong> {previewDoc.notes}</div>}
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
