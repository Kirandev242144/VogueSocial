"use client";
import React from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, FileText, Sparkles } from 'lucide-react';

export default function VerificationHeader({ kybStatus, onQuickFill }) {
  const statusConfig = {
    verified: { label: 'Verified', class: 'status-verified', icon: CheckCircle2 },
    under_review: { label: 'In Review', class: 'status-review', icon: Clock },
    rejected: { label: 'Action Required', class: 'status-rejected', icon: AlertTriangle },
    unsubmitted: { label: 'Not Submitted', class: 'status-unsubmitted', icon: FileText }
  };

  const current = statusConfig[kybStatus] || statusConfig.unsubmitted;
  const StatusIcon = current.icon;

  return (
    <header className="mv-header">
      <div className="mv-header-main">
        <div className="mv-title-group">
          <div className="mv-icon-badge">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1 className="mv-title">Business Verification</h1>
            <p className="mv-subtitle">Legal entity credentials and compliance documentation</p>
          </div>
        </div>

        <div className="mv-header-actions">
          {onQuickFill && (
            <button
              type="button"
              className="mv-btn-ghost mv-btn-sm"
              onClick={onQuickFill}
              title="Autofill mock business data for testing"
            >
              <Sparkles size={13} />
              <span>Fill Demo Data</span>
            </button>
          )}

          <div className={`mv-status-tag ${current.class}`}>
            <StatusIcon size={12} />
            <span>{current.label}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
