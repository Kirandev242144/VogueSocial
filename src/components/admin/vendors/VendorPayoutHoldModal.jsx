"use client";
import React from 'react';
import { AdminModal } from '../index';

export default function VendorPayoutHoldModal({
  showHoldModal,
  setShowHoldModal,
  holdCategory,
  setHoldCategory,
  holdReason,
  setHoldReason,
  onConfirmHold,
  showReleaseModal,
  setShowReleaseModal,
  releaseNote,
  setReleaseNote,
  onConfirmRelease,
  loading = false
}) {
  return (
    <>
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
                onClick={onConfirmHold}
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
                onClick={onConfirmRelease}
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
    </>
  );
}
