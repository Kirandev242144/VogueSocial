"use client";
import React, { useState } from 'react';
import { FileText, Eye, Check, X, FileCheck, MinusCircle, RotateCcw } from 'lucide-react';
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

  return (
    <div className="vam-tab-body">
      {/* Sole Proprietor Quiet Notice */}
      {isSoleProprietor && (
        <div className="vam-notice-subtle">
          <span>Sole Proprietorship ({country})</span>
          <span className="vam-sep">•</span>
          <span>Corporate charters and certificates of incorporation are not applicable for this entity.</span>
        </div>
      )}

      {/* Clean Document Rows */}
      <div className="vam-doc-list">
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

          return (
            <div key={doc.id} className="vam-doc-item">
              <div className="vam-doc-main">
                <div className="vam-doc-icon">
                  <FileText size={15} />
                </div>

                <div className="vam-doc-content">
                  <div className="vam-doc-title-line">
                    <span className="vam-doc-title">{doc.title}</span>
                    <span className={`vam-doc-pill ${badgeClass}`}>{badgeText}</span>
                  </div>

                  <div className="vam-doc-meta">
                    <span className="vam-doc-filename">{doc.filename}</span>
                    <span className="vam-sep">•</span>
                    <span>{doc.size}</span>
                    <span className="vam-sep">•</span>
                    <span>Expiry: {doc.expiry_date || 'N/A'}</span>
                  </div>

                  {doc.notes && (
                    <div className="vam-doc-note">
                      {doc.notes}
                    </div>
                  )}
                </div>

                <div className="vam-doc-actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-subtle"
                    onClick={() => setPreviewDoc(doc)}
                    title="Inspect document"
                  >
                    <Eye size={12} /> View
                  </button>

                  {!isVerified && !isNA && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-success-subtle"
                      onClick={() => handleDocAction(doc.id, 'verified')}
                    >
                      <Check size={12} /> Verify
                    </button>
                  )}

                  {!isNA && (doc.type === 'incorporation' || isSoleProprietor) && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-subtle"
                      onClick={() => setExemptingDocId(doc.id)}
                      title="Exempt this requirement"
                    >
                      <MinusCircle size={12} /> N/A
                    </button>
                  )}

                  {!isRejected && !isNA && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-danger-subtle"
                      onClick={() => setRejectingDocId(doc.id)}
                    >
                      <X size={12} /> Reject
                    </button>
                  )}

                  {(isVerified || isRejected || isNA) && (
                    <button
                      type="button"
                      className="admin-btn admin-btn-ghost admin-btn-sm vam-btn-subtle"
                      onClick={() => handleDocAction(doc.id, 'required', 'Reopened for resubmission.')}
                      title="Reset requirement"
                    >
                      <RotateCcw size={12} /> Reopen
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Reject Form */}
              {rejectingDocId === doc.id && (
                <div className="vam-inline-form-box">
                  <label className="vam-field-label">Reason for Rejection</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Utility bill dated over 90 days ago or document illegible..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                  <div className="vam-inline-form-actions">
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
                      onClick={() => handleDocAction(doc.id, 'rejected', rejectReason || 'Document rejected.')}
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

              {/* Inline Exemption (N/A) Form */}
              {exemptingDocId === doc.id && (
                <div className="vam-inline-form-box">
                  <label className="vam-field-label">Exemption Note</label>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Sole proprietorship / Individual artisan exemption..."
                    value={exemptReason}
                    onChange={(e) => setExemptReason(e.target.value)}
                  />
                  <div className="vam-inline-form-actions">
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
                      onClick={() => handleDocAction(doc.id, 'na', exemptReason || 'Exempt for sole proprietorship.')}
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
          maxWidth="460px"
          footer={
            <div className="vam-preview-footer">
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setPreviewDoc(null)}
              >
                Done
              </button>
            </div>
          }
        >
          <div className="vam-preview-body">
            <FileCheck size={36} className="vam-preview-icon" />
            <div className="vam-preview-filename">{previewDoc.filename}</div>

            <div className="vam-preview-table">
              <div className="vam-preview-row">
                <span className="vam-preview-lbl">Document</span>
                <span>{previewDoc.title}</span>
              </div>
              <div className="vam-preview-row">
                <span className="vam-preview-lbl">Type</span>
                <code>{previewDoc.type}</code>
              </div>
              <div className="vam-preview-row">
                <span className="vam-preview-lbl">Status</span>
                <span className="vam-capitalize">{previewDoc.status}</span>
              </div>
              <div className="vam-preview-row">
                <span className="vam-preview-lbl">Jurisdiction</span>
                <span>{country}</span>
              </div>
              <div className="vam-preview-row">
                <span className="vam-preview-lbl">Expiry Date</span>
                <span>{previewDoc.expiry_date || 'N/A'}</span>
              </div>
              <div className="vam-preview-row">
                <span className="vam-preview-lbl">Uploaded</span>
                <span>{new Date(previewDoc.uploaded_at).toLocaleDateString()}</span>
              </div>
              {previewDoc.notes && (
                <div className="vam-preview-row">
                  <span className="vam-preview-lbl">Review Note</span>
                  <span>{previewDoc.notes}</span>
                </div>
              )}
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}
