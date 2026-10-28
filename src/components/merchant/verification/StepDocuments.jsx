"use client";
import React from 'react';
import { FileText, CheckCircle2, Clock, Upload, X } from 'lucide-react';

export default function StepDocuments({
  documents = [],
  onUpload,
  onRemove,
  attestationAgreed,
  onToggleAttestation
}) {
  return (
    <div className="mv-step-body">
      <div className="mv-section-intro">
        <h2 className="mv-section-heading">Required Compliance Documents</h2>
        <p className="mv-section-sub">Encrypted verification uploads for regulatory compliance and bank payouts</p>
      </div>

      <div className="mv-doc-list">
        {documents.map((doc) => {
          const hasFile = Boolean(doc.filename);
          const isVerified = doc.status === 'verified';
          const isPending = doc.status === 'pending';

          return (
            <div key={doc.id} className={`mv-doc-row ${hasFile ? 'is-uploaded' : ''}`}>
              <div className="mv-doc-meta">
                <div className="mv-doc-title-row">
                  <span className="mv-doc-title">{doc.title}</span>
                  <span className={`mv-pill ${isVerified ? 'pill-green' : isPending ? 'pill-amber' : 'pill-gray'}`}>
                    {isVerified ? 'Verified' : isPending ? 'Pending' : 'Required'}
                  </span>
                </div>
                <p className="mv-doc-desc">{doc.description}</p>

                {hasFile && (
                  <div className="mv-doc-attached">
                    <FileText size={14} className="mv-doc-attached-icon" />
                    <span className="mv-doc-filename">{doc.filename}</span>
                    <span className="mv-doc-filesize">• {doc.size || '1.2 MB'}</span>
                  </div>
                )}
              </div>

              <div className="mv-doc-action">
                {hasFile ? (
                  <button
                    type="button"
                    className="mv-btn-ghost mv-btn-sm"
                    onClick={() => onRemove(doc.id)}
                    title="Remove or replace document"
                  >
                    <X size={13} />
                    <span>Replace</span>
                  </button>
                ) : (
                  <label className="mv-btn-outline mv-btn-sm">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      style={{ display: 'none' }}
                      onChange={(e) => onUpload(doc.id, e.target.files?.[0])}
                    />
                    <Upload size={13} />
                    <span>Upload File</span>
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Attestation declaration */}
      <div className="mv-attestation-box">
        <label className="mv-checkbox-row">
          <input
            type="checkbox"
            className="mv-checkbox"
            checked={attestationAgreed}
            onChange={(e) => onToggleAttestation(e.target.checked)}
          />
          <span className="mv-checkbox-label">
            I certify under penalty of perjury that I am authorized to bind this merchant business, and all provided details and documents are authentic and unmodified.
          </span>
        </label>
      </div>
    </div>
  );
}
