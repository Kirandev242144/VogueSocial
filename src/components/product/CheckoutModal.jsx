'use client';
import React from 'react';
import { CreditCard, X, Lock } from 'lucide-react';
import './CheckoutModal.css';

export default function CheckoutModal({
    isOpen,
    onClose,
    itemTitle,
    itemVendor,
    itemPrice,
    address,
    city,
    country,
    onAddressChange,
    onCityChange,
    onCountryChange,
    onCheckout,
    isLoading
}) {
    if (!isOpen) return null;

    return (
        <div className="product-modal-backdrop" onClick={onClose}>
            <div className="product-modal-card" onClick={e => e.stopPropagation()}>
                <div className="product-modal-header">
                    <h2 className="product-modal-title">
                        <CreditCard size={18} />
                        Pay with Stripe (Escrow)
                    </h2>
                    <button
                        type="button"
                        className="product-modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="product-modal-body">
                    {/* Item Summary Card */}
                    <div className="product-checkout-summary-card">
                        <div className="product-checkout-summary-details">
                            <strong className="product-checkout-summary-title">
                                {itemTitle || 'Selected Garment'}
                            </strong>
                            <span className="product-checkout-summary-vendor">
                                Vendor: {itemVendor || 'Vogue Partner'}
                            </span>
                        </div>
                        <span className="product-checkout-summary-price">
                            {itemPrice || '$75.00'}
                        </span>
                    </div>

                    {/* Shipping Address Inputs */}
                    <div className="product-form-group">
                        <label className="product-form-label">Shipping Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={e => onAddressChange?.(e.target.value)}
                            placeholder="Street Address"
                            className="product-form-input"
                        />
                        <div className="product-form-split-row">
                            <input
                                type="text"
                                value={city}
                                onChange={e => onCityChange?.(e.target.value)}
                                placeholder="City"
                                className="product-form-input"
                            />
                            <input
                                type="text"
                                value={country}
                                onChange={e => onCountryChange?.(e.target.value)}
                                placeholder="Country"
                                className="product-form-input"
                            />
                        </div>
                    </div>

                    {/* Card Details (Mocked Stripe Input) */}
                    <div className="product-form-group">
                        <label className="product-form-label">Card Details (Secured by Stripe)</label>
                        <div className="product-card-mockup-input">
                            <CreditCard size={16} color="#64748b" />
                            <input
                                type="text"
                                disabled
                                value="4242 •••• •••• 4242"
                                className="product-card-number-field"
                            />
                            <span className="product-card-expiry-badge">12/28</span>
                            <Lock size={13} color="#94a3b8" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={onCheckout}
                        disabled={isLoading}
                        className="product-pay-submit-btn"
                    >
                        <Lock size={15} />
                        <span>{isLoading ? 'Authorizing Payment...' : `Pay ${itemPrice || '$75.00'}`}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
