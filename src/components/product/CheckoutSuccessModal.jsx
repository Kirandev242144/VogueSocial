'use client';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react';
import './CheckoutSuccessModal.css';

export default function CheckoutSuccessModal({
  isOpen,
  onClose,
  orderResult,
  itemPrice
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToOrders = () => {
    if (onClose) onClose();
    navigate('/profile?tab=orders');
  };

  const orderIdDisplay = orderResult?.id || orderResult?.orderId || '#VS-ORD-9824';
  const trackingNumberDisplay = orderResult?.trackingNumber || 'VS-DHL-89214US';

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="product-escrow-success-body">
          <div className="product-escrow-shield-circle">
            <CheckCircle2 size={34} color="#16a34a" />
          </div>

          <h2 className="product-escrow-success-title">
            Order Confirmed!
          </h2>

          <p className="product-escrow-success-text">
            Thank you for your order. Your purchase of <strong>{itemPrice || '$75.00'}</strong> has been successfully authorized.
          </p>

          {/* Order Summary Card */}
          <div className="product-escrow-info-card">
            <div className="product-escrow-info-row">
              <span className="product-escrow-label">Order Reference:</span>
              <span className="product-escrow-val-bold">{orderIdDisplay}</span>
            </div>
            <div className="product-escrow-info-row">
              <span className="product-escrow-label">Logistics Carrier:</span>
              <span className="product-escrow-val">DHL Express Priority</span>
            </div>
            <div className="product-escrow-info-row">
              <span className="product-escrow-label">Tracking Number:</span>
              <span className="product-escrow-val" style={{ fontFamily: 'monospace' }}>
                {trackingNumberDisplay}
              </span>
            </div>
            <div className="product-escrow-info-row">
              <span className="product-escrow-label">Order Status:</span>
              <span className="product-escrow-status-tag" style={{ background: '#DCFCE7', color: '#166534' }}>
                CONFIRMED
              </span>
            </div>
          </div>

          <p className="product-escrow-disclaimer">
            *We've sent an order confirmation and itemized invoice to your email. You will receive real-time notifications once your package is dispatched.*
          </p>

          <div className="product-escrow-actions-group">
            {/* View in My Orders Button */}
            <button
              type="button"
              className="product-escrow-orders-btn"
              onClick={handleGoToOrders}
            >
              <Package size={16} />
              <span>Track in My Orders</span>
              <ArrowRight size={15} />
            </button>

            {/* Continue Shopping */}
            <button
              type="button"
              className="product-escrow-continue-btn"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
