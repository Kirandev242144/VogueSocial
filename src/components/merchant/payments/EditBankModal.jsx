"use client";
import React, { useState } from 'react';
import { X, Landmark, Lock, Check } from 'lucide-react';

export default function EditBankModal({
  isOpen,
  onClose,
  currentBank,
  onSaveBank
}) {
  const [bankName, setBankName] = useState(currentBank?.bankName || 'JPMorgan Chase');
  const [accountHolder, setAccountHolder] = useState(currentBank?.accountHolder || 'Studio Label Paris LLC');
  const [routingNumber, setRoutingNumber] = useState(currentBank?.routingNumber || '021000021');
  const [accountNumber, setAccountNumber] = useState(currentBank?.accountLast4 ? `•••• •••• ${currentBank.accountLast4}` : '');
  const [currency, setCurrency] = useState(currentBank?.currency || 'USD');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const cleanAccount = accountNumber.replace(/\D/g, '');
    const last4 = cleanAccount.length >= 4 ? cleanAccount.slice(-4) : (currentBank?.accountLast4 || '4192');

    setTimeout(() => {
      onSaveBank({
        bankName: bankName.trim() || 'JPMorgan Chase',
        accountHolder: accountHolder.trim(),
        routingNumber: routingNumber.trim(),
        accountLast4: last4,
        currency
      });
      setSaving(false);
      onClose();
    }, 400);
  };

  return (
    <div className="pg-modal-overlay" onClick={onClose}>
      <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pg-modal-header">
          <h3 className="pg-modal-title">Edit Payout Bank Account</h3>
          <button type="button" className="pg-modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pg-modal-body">
            <div className="pg-notice-box">
              <Lock size={15} className="pg-notice-icon" />
              <span>
                Banking credentials are encrypted and securely synchronized with Stripe Connect. Payouts are routed directly to this verified checking account.
              </span>
            </div>

            <div className="pg-form-group">
              <label className="pg-form-label">Bank Name</label>
              <input
                type="text"
                className="pg-form-input"
                placeholder="e.g. JPMorgan Chase, Bank of America, Citibank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>

            <div className="pg-form-group">
              <label className="pg-form-label">Account Holder Name</label>
              <input
                type="text"
                className="pg-form-input"
                placeholder="Legal business or individual name"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
              />
            </div>

            <div className="pg-form-grid-2">
              <div className="pg-form-group">
                <label className="pg-form-label">Routing / Transit Number</label>
                <input
                  type="text"
                  className="pg-form-input"
                  placeholder="9-digit routing"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  required
                />
              </div>

              <div className="pg-form-group">
                <label className="pg-form-label">Settlement Currency</label>
                <select
                  className="pg-form-input"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>

            <div className="pg-form-group">
              <label className="pg-form-label">Account Number / IBAN</label>
              <input
                type="text"
                className="pg-form-input"
                placeholder="Enter checking account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
              <span className="pg-form-hint">
                Only the last 4 digits will remain visible for identification purposes.
              </span>
            </div>
          </div>

          <div className="pg-modal-footer">
            <button
              type="button"
              className="pg-btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pg-btn-primary"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Save Bank Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
