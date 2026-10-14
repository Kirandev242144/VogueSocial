"use client";
import React, { useState } from 'react';
import { X, Truck, ShieldCheck } from 'lucide-react';

const CARRIERS = [
  'DHL Express',
  'FedEx',
  'UPS',
  'Blue Dart',
  'USPS Priority Mail',
  'Royal Mail'
];

export default function FulfillOrderModal({
  isOpen,
  order,
  onClose,
  onConfirmFulfill
}) {
  const [carrier, setCarrier] = useState('DHL Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const cleanProduct = (order.product || 'Garment').replace(/Atelier\s*/gi, 'Tailored ');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      onConfirmFulfill({
        orderId: order.id,
        carrier,
        trackingNumber: trackingNumber.trim(),
        notifyCustomer
      });
      setSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <div className="orders-modal-overlay" onClick={onClose}>
      <div className="orders-modal" onClick={(e) => e.stopPropagation()}>
        <div className="orders-modal-header">
          <div className="orders-card-title">
            <Truck size={16} />
            <span>Fulfill Order {order.id}</span>
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

        <form onSubmit={handleSubmit}>
          <div className="orders-modal-body">
            {/* Item Summary Box */}
            <div className="orders-notice-box">
              <ShieldCheck size={16} className="orders-notice-icon" />
              <span>
                Fulfilling <strong>{cleanProduct}</strong> ({order.qty}×, Size {order.size || 'M'}) for{' '}
                <strong>{order.customer}</strong>.
              </span>
            </div>

            <div className="orders-form-group">
              <label className="orders-form-label">Shipping Carrier / Courier *</label>
              <select
                className="orders-form-select"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              >
                {CARRIERS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="orders-form-group">
              <label className="orders-form-label">Tracking Number / AWB *</label>
              <input
                type="text"
                className="orders-form-input"
                placeholder="e.g. FX28301948IN"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
              />
              <span className="orders-form-hint">
                Provided on your carrier consignment receipt or airway bill label.
              </span>
            </div>

            <div className="orders-form-group">
              <label className="orders-carrier-tag">
                <input
                  type="checkbox"
                  checked={notifyCustomer}
                  onChange={(e) => setNotifyCustomer(e.target.checked)}
                />
                <span>Send shipment dispatch notice & tracking link to {order.email}</span>
              </label>
            </div>
          </div>

          <div className="orders-modal-footer">
            <button
              type="button"
              className="orders-btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="orders-btn-primary"
              disabled={submitting || !trackingNumber.trim()}
            >
              {submitting ? 'Confirming...' : 'Fulfill Items & Dispatch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
