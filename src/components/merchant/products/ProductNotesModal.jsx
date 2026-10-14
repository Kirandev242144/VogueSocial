"use client";
import React from 'react';
import { X, MessageSquare } from 'lucide-react';

export default function ProductNotesModal({
  isOpen,
  modalData,
  onClose
}) {
  if (!isOpen || !modalData) return null;

  return (
    <div className="prod-modal-overlay" onClick={onClose}>
      <div className="prod-modal prod-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="prod-modal-header">
          <div className="prod-card-title">
            <MessageSquare size={16} />
            <span>{modalData.title || 'Admin Review Feedback'}</span>
          </div>
          <button
            type="button"
            className="prod-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="prod-modal-body">
          <p className="prod-feedback-text">{modalData.notes}</p>
        </div>

        <div className="prod-modal-footer">
          <div />
          <button
            type="button"
            className="prod-btn-primary"
            onClick={onClose}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
