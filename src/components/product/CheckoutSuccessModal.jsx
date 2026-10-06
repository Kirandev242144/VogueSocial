'use client';
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import './CheckoutSuccessModal.css';

export default function CheckoutSuccessModal({
    isOpen,
    onClose,
    orderResult,
    itemPrice,
    onSimulateDispute
}) {
    if (!isOpen) return null;

    return (
        <div className="product-modal-backdrop" onClick={onClose}>
            <div className="product-modal-card" onClick={e => e.stopPropagation()}>
                <div className="product-escrow-success-body">
                    <div className="product-escrow-shield-circle">
                        <ShieldCheck size={30} color="#16a34a" />
                    </div>

                    <h2 className="product-escrow-success-title">
                        Payment Securely Locked
                    </h2>

                    <p className="product-escrow-success-text">
                        Your payment of <strong>{itemPrice || '$75.00'}</strong> has been successfully authorized and held in escrow by VogueSocial.
                    </p>

                    {/* Escrow Status Summary Card */}
                    <div className="product-escrow-info-card">
                        <div className="product-escrow-info-row">
                            <span className="product-escrow-label">Order ID:</span>
                            <span className="product-escrow-val-bold">{orderResult?.id || 'ORD-9824'}</span>
                        </div>
                        <div className="product-escrow-info-row">
                            <span className="product-escrow-label">Split Payout:</span>
                            <span className="product-escrow-val-muted">95% Vendor · 5% Platform</span>
                        </div>
                        <div className="product-escrow-info-row">
                            <span className="product-escrow-label">Shipping Carrier:</span>
                            <span className="product-escrow-val">Simulated DHL / USPS</span>
                        </div>
                        <div className="product-escrow-info-row">
                            <span className="product-escrow-label">Escrow Status:</span>
                            <span className="product-escrow-status-tag">HELD IN ESCROW</span>
                        </div>
                    </div>

                    <p className="product-escrow-disclaimer">
                        *Note: Payout will be auto-released to the vendor connect account once delivery is confirmed via carrier tracking webhook, and the 48-hour dispute window expires.*
                    </p>

                    <div className="product-escrow-actions-group">
                        <button
                            type="button"
                            className="product-escrow-dispute-btn"
                            onClick={onSimulateDispute}
                        >
                            ⚠️ Simulate Dispute (File Claim)
                        </button>
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
