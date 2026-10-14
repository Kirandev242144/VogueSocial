"use client";
import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReturnReviewModal({
  isOpen,
  returnItem,
  onClose,
  onApproveReturn,
  onDeclineReturn,
  onRefundReturn
}) {
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [restockInventory, setRestockInventory] = useState(true);

  if (!isOpen || !returnItem) return null;

  const isPending = returnItem.status === 'requested';
  const isInTransit = returnItem.status === 'in_transit';
  const cleanProduct = (returnItem.product || 'Garment').replace(/Atelier\s*/gi, 'Tailored ');

  const handleDeclineSubmit = () => {
    if (!declineReason.trim()) return;
    onDeclineReturn(returnItem.id, declineReason.trim());
    onClose();
  };

  return (
    <div className="orders-modal-overlay" onClick={onClose}>
      <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
        <div className="orders-modal-header">
          <div className="orders-card-title">
            <RotateCcw size={16} />
            <span>Return Request {returnItem.id}</span>
          </div>
          <button
            type="button"
            className="orders-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="orders-modal-body">
          {/* Status Box */}
          <div className="orders-notice-box">
            <AlertTriangle size={16} className="orders-notice-icon" />
            <span>
              Customer <strong>{returnItem.customer}</strong> requested a return for order{' '}
              <strong>{returnItem.orderId}</strong>.
            </span>
          </div>

          {/* Details list */}
          <div className="orders-detail-section">
            <div className="orders-detail-heading">Return Parameters</div>

            <div className="orders-detail-row">
              <span className="orders-form-hint">Garment Item:</span>
              <span className="orders-detail-val">{cleanProduct} (Size {returnItem.size || 'M'})</span>
            </div>

            <div className="orders-detail-row">
              <span className="orders-form-hint">Return Reason:</span>
              <span className="orders-detail-val">{returnItem.reason}</span>
            </div>

            <div className="orders-detail-row">
              <span className="orders-form-hint">Customer Note:</span>
              <span className="orders-detail-val">
                {returnItem.customerNote || 'Item fit was smaller than expected around the shoulders.'}
              </span>
            </div>

            <div className="orders-detail-row">
              <span className="orders-form-hint">Refund Amount:</span>
              <span className="orders-detail-total">{returnItem.amount}</span>
            </div>

            <div className="orders-detail-row">
              <span className="orders-form-hint">Policy Window:</span>
              <span className="orders-detail-val">Within 30-Day Window (Tags attached verified)</span>
            </div>
          </div>

          {showDeclineInput && (
            <div className="orders-form-group">
              <label className="orders-form-label">Decline Justification Reason *</label>
              <textarea
                className="orders-form-textarea"
                placeholder="State policy reason (e.g. Return window expired, tags removed, worn garment)..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
            </div>
          )}

          {isInTransit && (
            <div className="orders-form-group">
              <label className="orders-carrier-tag">
                <input
                  type="checkbox"
                  checked={restockInventory}
                  onChange={(e) => setRestockInventory(e.target.checked)}
                />
                <span>Automatically restock {cleanProduct} into catalog inventory upon refund</span>
              </label>
            </div>
          )}
        </div>

        <div className="orders-modal-footer">
          {isPending && !showDeclineInput && (
            <>
              <button
                type="button"
                className="orders-btn-danger"
                onClick={() => setShowDeclineInput(true)}
              >
                Decline Return
              </button>
              <button
                type="button"
                className="orders-btn-primary"
                onClick={() => {
                  onApproveReturn(returnItem.id);
                  onClose();
                }}
              >
                Approve & Issue Prepaid Label
              </button>
            </>
          )}

          {isPending && showDeclineInput && (
            <>
              <button
                type="button"
                className="orders-btn-secondary"
                onClick={() => setShowDeclineInput(false)}
              >
                Back
              </button>
              <button
                type="button"
                className="orders-btn-danger"
                disabled={!declineReason.trim()}
                onClick={handleDeclineSubmit}
              >
                Confirm Decline
              </button>
            </>
          )}

          {isInTransit && (
            <>
              <button
                type="button"
                className="orders-btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="orders-btn-primary"
                onClick={() => {
                  onRefundReturn(returnItem.id, restockInventory);
                  onClose();
                }}
              >
                Inspect & Release Refund (${returnItem.amount})
              </button>
            </>
          )}

          {!isPending && !isInTransit && (
            <button
              type="button"
              className="orders-btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
