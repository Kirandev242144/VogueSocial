"use client";
import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function VerificationActions({
  currentStep,
  maxSteps = 4,
  saving,
  submitting,
  onPrev,
  onNext,
  onSaveDraft,
  onSubmit
}) {
  return (
    <footer className="mv-actions-footer">
      <div className="mv-actions-left">
        {currentStep > 1 && (
          <button
            type="button"
            className="mv-btn-ghost"
            onClick={onPrev}
            disabled={saving || submitting}
          >
            <ArrowLeft size={14} />
            <span>Previous</span>
          </button>
        )}
      </div>

      <div className="mv-actions-right">
        <button
          type="button"
          className="mv-btn-outline"
          onClick={onSaveDraft}
          disabled={saving || submitting}
        >
          {saving && <Loader2 size={13} className="spin" />}
          <span>{saving ? 'Saving...' : 'Save Draft'}</span>
        </button>

        {currentStep < maxSteps ? (
          <button
            type="button"
            className="mv-btn-primary"
            onClick={onNext}
            disabled={saving || submitting}
          >
            <span>Continue</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            className="mv-btn-primary"
            onClick={onSubmit}
            disabled={saving || submitting}
          >
            {submitting ? <Loader2 size={14} className="spin" /> : <ShieldCheck size={15} />}
            <span>{submitting ? 'Submitting...' : 'Submit Verification'}</span>
          </button>
        )}
      </div>
    </footer>
  );
}
