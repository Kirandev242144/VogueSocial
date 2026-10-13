"use client";
import React, { useState } from 'react';
import { FileText, Eye, Check, X, FileCheck } from 'lucide-react';
import { AdminModal } from '../index';

export default function VendorComplianceTab({
  vendor,
  onUpdateDocStatus,
  showFeedback
}) {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const docs = vendor.documents || [];

  const handleDocAction = async (docId, status, notes = '') => {
    if (onUpdateDocStatus) {
      await onUpdateDocStatus(vendor.id, docId, status, notes);
      setRejectingDocId(null);
      setRejectReason('');
      showFeedback(`Document marked as ${status}.`);
    }
  };

  return (
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
  );
}
