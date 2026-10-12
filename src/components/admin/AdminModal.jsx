"use client";
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '580px'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">{title}</h3>
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            style={{ padding: '4px', borderRadius: '50%' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="admin-modal-body">
          {children}
        </div>

        {footer && (
          <div className="admin-modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
