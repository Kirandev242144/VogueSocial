'use client';
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  X, 
  Lock, 
  MapPin, 
  Check, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { customerOrderService } from '@/services/customerOrderService';
import './CheckoutModal.css';

// SVG Badges for realistic Stripe card brands
const VisaLogo = () => (
  <svg width="34" height="20" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#0A2540" />
    <path d="M14.6 16.5H12.4L13.8 8H16L14.6 16.5ZM21.9 8.2C21.4 8 20.6 7.8 19.6 7.8C17.1 7.8 15.3 9.1 15.3 11C15.3 12.4 16.6 13.2 17.5 13.7C18.5 14.2 18.8 14.5 18.8 15C18.8 15.7 17.9 16.1 17.1 16.1C16.1 16.1 15.5 15.9 14.7 15.5L14.3 15.3L13.9 17.4C14.5 17.7 15.6 18 16.8 18C19.5 18 21.2 16.6 21.2 14.7C21.2 13 20.1 12.1 18.9 11.5C18.1 11.1 17.6 10.8 17.6 10.3C17.6 9.8 18.2 9.4 19.3 9.4C20.1 9.4 20.7 9.6 21.3 9.8L21.5 9.9L21.9 8.2ZM27.4 8H25.7C25.1 8 24.7 8.2 24.4 8.8L20.8 16.5H23.3L23.8 15.1H26.8L27.1 16.5H29.3L27.4 8ZM24.4 13.4L25.6 10.1C25.6 10.1 26 8.9 26.1 8.6H26.2C26.3 8.9 26.5 9.8 26.5 9.8L27.1 13.4H24.4ZM11.7 8L9.6 13.8L9.4 12.6C9 11.2 7.7 9.7 6.3 8.9L8.2 16.5H10.8L14.7 8H11.7Z" fill="#FFFFFF"/>
  </svg>
);

const MastercardLogo = () => (
  <svg width="34" height="20" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#1F2937" />
    <circle cx="14" cy="12" r="6.5" fill="#EB001B" />
    <circle cx="22" cy="12" r="6.5" fill="#F79E1B" fillOpacity="0.9" />
  </svg>
);

const AmexLogo = () => (
  <svg width="34" height="20" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#006FCF" />
    <path d="M7 8H10.5L12 12.5L13.5 8H17L14.2 16H10L7 8Z" fill="#FFFFFF" fillOpacity="0.8" />
    <path d="M19 8H27V10H21V11H26V13H21V14H27V16H19V8Z" fill="#FFFFFF" />
  </svg>
);

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
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressMode, setAddressMode] = useState('saved'); // 'saved' | 'custom'
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [saveToAccount, setSaveToAccount] = useState(true);

  // Stripe Payment Details State
  const [paymentTab, setPaymentTab] = useState('card'); // 'card' | 'apple_pay'
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardName, setCardName] = useState('John Miller');
  const [cardZip, setCardZip] = useState('10012');
  const [saveCard, setSaveCard] = useState(true);

  // Interactive Stripe Gateway Simulation State
  const [simStep, setSimStep] = useState(null); // 'connecting' | 'radar' | '3ds' | 'authorized' | 'declined'
  const [gatewayError, setGatewayError] = useState(null);
  const [show3DSModal, setShow3DSModal] = useState(false);
  const [otpCode, setOtpCode] = useState('849-201');

  // Apple Pay Simulation State
  const [showApplePaySheet, setShowApplePaySheet] = useState(false);
  const [applePayStatus, setApplePayStatus] = useState('ready'); // 'ready' | 'processing' | 'done'

  // Load saved addresses when modal opens
  useEffect(() => {
    if (isOpen) {
      const list = customerOrderService.getCustomerAddresses();
      setSavedAddresses(list);
      if (list && list.length > 0) {
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr.id);
        setAddressMode('saved');

        // Sync with parent props
        if (onAddressChange) onAddressChange(defaultAddr.street + (defaultAddr.apartment ? `, ${defaultAddr.apartment}` : ''));
        if (onCityChange) onCityChange(defaultAddr.city);
        if (onCountryChange) onCountryChange(defaultAddr.country);
      } else {
        setAddressMode('custom');
      }
      setGatewayError(null);
      setSimStep(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine card brand from raw digits
  const cleanNumber = cardNumber.replace(/\D/g, '');
  const getCardBrand = () => {
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) return 'Mastercard';
    if (/^(34|37)/.test(cleanNumber)) return 'Amex';
    return 'CreditCard';
  };

  const currentBrand = getCardBrand();

  // Format Card Number (grouped in 4s)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (gatewayError) setGatewayError(null);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // Quick fill demo test cards
  const handleApplyTestCard = (type) => {
    setGatewayError(null);
    if (type === 'success_visa') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('12/28');
      setCardCvc('123');
      setCardName('John Miller');
    } else if (type === 'mastercard') {
      setCardNumber('5555 5555 5555 5555');
      setCardExpiry('10/27');
      setCardCvc('888');
      setCardName('John Miller');
    } else if (type === '3ds') {
      setCardNumber('4000 0000 0000 0002');
      setCardExpiry('09/26');
      setCardCvc('312');
      setCardName('John Miller');
    } else if (type === 'decline') {
      setCardNumber('4000 0000 0000 0005');
      setCardExpiry('05/27');
      setCardCvc('005');
      setCardName('John Miller');
    }
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    if (onAddressChange) onAddressChange(addr.street + (addr.apartment ? `, ${addr.apartment}` : ''));
    if (onCityChange) onCityChange(addr.city);
    if (onCountryChange) onCountryChange(addr.country);
  };

  const getResolvedAddress = () => {
    if (addressMode === 'saved') {
      return savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0] || {
        fullName: 'John Miller',
        street: '456 Vogue Boulevard',
        city: 'New York',
        country: 'United States'
      };
    } else {
      const customAddr = {
        fullName: 'John Miller',
        street: address || '456 Vogue Boulevard',
        city: city || 'New York',
        country: country || 'United States'
      };
      if (saveToAccount && address) {
        customerOrderService.saveCustomerAddress({
          tag: 'Saved at Checkout',
          fullName: 'John Miller',
          street: address,
          city: city || 'New York',
          country: country || 'United States',
          isDefault: false
        });
      }
      return customAddr;
    }
  };

  // Main Card Checkout Execution with realistic Stripe lifecycle
  const handleExecuteCheckout = async () => {
    setGatewayError(null);
    const resolvedAddress = getResolvedAddress();
    const last4 = cleanNumber.slice(-4) || '4242';
    const paymentDetails = {
      method: 'card',
      brand: currentBrand,
      last4: last4,
      methodLabel: `${currentBrand} •••• ${last4} via Stripe`,
      cardholder: cardName || 'John Miller',
      zip: cardZip
    };

    // Step 1: Connecting to Stripe
    setSimStep('connecting');
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Stripe Radar Analysis
    setSimStep('radar');
    await new Promise((r) => setTimeout(r, 500));

    // Simulated Decline
    if (cleanNumber.endsWith('0005')) {
      setSimStep(null);
      setGatewayError({
        title: 'Your card was declined (Stripe Test Error)',
        message: 'Stripe code: generic_decline. Test card 0005 is configured to trigger automatic fraud declines. Please select the 4242 test card above to proceed.'
      });
      return;
    }

    // Simulated 3D Secure 2.0 Challenge
    if (cleanNumber.endsWith('0002')) {
      setSimStep(null);
      setShow3DSModal(true);
      return;
    }

    // Step 3: Authorization Success
    setSimStep('authorized');
    await new Promise((r) => setTimeout(r, 400));
    setSimStep(null);

    if (onCheckout) {
      onCheckout(resolvedAddress, paymentDetails);
    }
  };

  // Confirming 3DS Challenge
  const handleConfirm3DS = async () => {
    setShow3DSModal(false);
    setSimStep('authorized');
    await new Promise((r) => setTimeout(r, 500));
    setSimStep(null);

    const resolvedAddress = getResolvedAddress();
    const paymentDetails = {
      method: 'card',
      brand: 'Visa (3DS Verified)',
      last4: '0002',
      methodLabel: 'Visa 3D Secure •••• 0002 via Stripe',
      cardholder: cardName || 'John Miller',
      zip: cardZip
    };

    if (onCheckout) {
      onCheckout(resolvedAddress, paymentDetails);
    }
  };

  // Execute Apple Pay Checkout
  const handleApplePayClick = () => {
    setShowApplePaySheet(true);
    setApplePayStatus('ready');
  };

  const handleAuthorizeApplePay = async () => {
    setApplePayStatus('processing');
    await new Promise((r) => setTimeout(r, 1200));
    setApplePayStatus('done');
    await new Promise((r) => setTimeout(r, 600));
    setShowApplePaySheet(false);

    const resolvedAddress = getResolvedAddress();
    const paymentDetails = {
      method: 'apple_pay',
      brand: 'Apple Pay',
      last4: '9284',
      methodLabel: 'Apple Pay (Mastercard •••• 9284 via Stripe)',
      cardholder: 'John Miller',
      zip: '10012'
    };

    if (onCheckout) {
      onCheckout(resolvedAddress, paymentDetails);
    }
  };

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div className="product-modal-card stripe-styled-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header with Stripe Trust Header */}
        <div className="product-modal-header">
          <div className="stripe-header-title-box">
            <h2 className="product-modal-title">
              <Lock size={17} className="stripe-lock-icon" />
              Secure Checkout
            </h2>
            <div className="stripe-powered-pill">
              <span>Powered by</span>
              <strong className="stripe-brand-text">stripe</strong>
            </div>
          </div>
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
                Curated by {itemVendor || 'Vogue Partner Atelier'}
              </span>
            </div>
            <span className="product-checkout-summary-price">
              {itemPrice || '$75.00'}
            </span>
          </div>

          {/* Shipping Address Section */}
          <div className="product-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <label className="product-form-label">Shipping Destination</label>
              {savedAddresses.length > 0 && (
                <div className="product-address-tabs-toggle">
                  <button
                    type="button"
                    className={`product-address-tab-btn ${addressMode === 'saved' ? 'active' : ''}`}
                    onClick={() => setAddressMode('saved')}
                  >
                    Saved ({savedAddresses.length})
                  </button>
                  <button
                    type="button"
                    className={`product-address-tab-btn ${addressMode === 'custom' ? 'active' : ''}`}
                    onClick={() => setAddressMode('custom')}
                  >
                    + Custom
                  </button>
                </div>
              )}
            </div>

            {/* Saved Address Cards */}
            {addressMode === 'saved' && savedAddresses.length > 0 ? (
              <div className="product-saved-addresses-list">
                {savedAddresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <div
                      key={addr.id}
                      className={`product-saved-address-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectSavedAddress(addr)}
                    >
                      <div className="product-saved-address-info">
                        <div className="product-saved-address-name">
                          <span>{addr.fullName}</span>
                          <span className="product-saved-address-tag">{addr.tag}</span>
                          {addr.isDefault && (
                            <span style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: '700' }}>
                              • Default
                            </span>
                          )}
                        </div>
                        <div>
                          {addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}, {addr.city}, {addr.country}
                        </div>
                      </div>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: isSelected ? '5px solid #0F172A' : '1.5px solid #CBD5E1',
                        background: '#FFFFFF',
                        flexShrink: 0
                      }} />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Custom Address Inputs */
              <div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => onAddressChange?.(e.target.value)}
                  placeholder="Street Address (e.g. 456 Vogue Boulevard, Apt 4B)"
                  className="product-form-input"
                  style={{ marginBottom: '8px' }}
                />
                <div className="product-form-split-row">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => onCityChange?.(e.target.value)}
                    placeholder="City (e.g. New York)"
                    className="product-form-input"
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => onCountryChange?.(e.target.value)}
                    placeholder="Country (e.g. United States)"
                    className="product-form-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Switcher (Card vs Apple Pay) */}
          <div className="stripe-payment-section">
            <div className="stripe-section-header">
              <label className="product-form-label">Payment Method</label>
              <span className="stripe-sandbox-badge">
                <Sparkles size={11} />
                Stripe Sandbox v2026
              </span>
            </div>

            <div className="stripe-method-toggle-row">
              <button
                type="button"
                className={`stripe-method-tab ${paymentTab === 'card' ? 'active' : ''}`}
                onClick={() => setPaymentTab('card')}
              >
                <CreditCard size={15} />
                <span>Credit / Debit Card</span>
              </button>
              <button
                type="button"
                className={`stripe-method-tab ${paymentTab === 'apple_pay' ? 'active' : ''}`}
                onClick={() => setPaymentTab('apple_pay')}
              >
                <span className="stripe-apple-logo"></span>
                <span>Apple Pay</span>
              </button>
            </div>

            {/* Error Banner if simulated decline */}
            {gatewayError && (
              <div className="stripe-error-banner">
                <AlertCircle size={16} className="stripe-error-icon" />
                <div className="stripe-error-content">
                  <strong>{gatewayError.title}</strong>
                  <p>{gatewayError.message}</p>
                </div>
              </div>
            )}

            {/* Quick Demo Test Card Fill Bar */}
            {paymentTab === 'card' && (
              <div className="stripe-quick-test-bar">
                <span className="stripe-quick-test-label">Demo Test Cards:</span>
                <div className="stripe-quick-chips-wrap">
                  <button
                    type="button"
                    className="stripe-test-chip success-chip"
                    onClick={() => handleApplyTestCard('success_visa')}
                    title="Visa (Always passes)"
                  >
                    Visa • 4242
                  </button>
                  <button
                    type="button"
                    className="stripe-test-chip mc-chip"
                    onClick={() => handleApplyTestCard('mastercard')}
                    title="Mastercard (Always passes)"
                  >
                    MC • 5555
                  </button>
                  <button
                    type="button"
                    className="stripe-test-chip challenge-chip"
                    onClick={() => handleApplyTestCard('3ds')}
                    title="3D Secure 2.0 Strong Customer Authentication"
                  >
                    3DS • 0002
                  </button>
                  <button
                    type="button"
                    className="stripe-test-chip decline-chip"
                    onClick={() => handleApplyTestCard('decline')}
                    title="Simulate Declined Card"
                  >
                    Decline • 0005
                  </button>
                </div>
              </div>
            )}

            {/* Card Inputs Form */}
            {paymentTab === 'card' ? (
              <div className="stripe-elements-container">
                {/* Card Number Input with Brand Detection */}
                <div className="stripe-element-field-group">
                  <div className="stripe-input-wrapper">
                    <div className="stripe-brand-icon-slot">
                      {currentBrand === 'Visa' && <VisaLogo />}
                      {currentBrand === 'Mastercard' && <MastercardLogo />}
                      {currentBrand === 'Amex' && <AmexLogo />}
                      {currentBrand === 'CreditCard' && <CreditCard size={18} color="#94A3B8" />}
                    </div>
                    <input
                      type="text"
                      className="stripe-element-input card-num-input"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                    />
                    <div className="stripe-secure-badge">
                      <Lock size={12} color="#64748B" />
                    </div>
                  </div>
                </div>

                {/* Split Row: Expiry, CVC, Postal Code */}
                <div className="stripe-split-row">
                  <div className="stripe-subfield">
                    <span className="stripe-sublabel">EXPIRY</span>
                    <input
                      type="text"
                      className="stripe-element-input"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM / YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="stripe-subfield">
                    <span className="stripe-sublabel">CVC</span>
                    <input
                      type="password"
                      className="stripe-element-input"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                  <div className="stripe-subfield">
                    <span className="stripe-sublabel">POSTAL</span>
                    <input
                      type="text"
                      className="stripe-element-input"
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value.slice(0, 8))}
                      placeholder="10012"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="stripe-subfield full-width">
                  <span className="stripe-sublabel">CARDHOLDER NAME</span>
                  <input
                    type="text"
                    className="stripe-element-input"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full name as printed on card"
                  />
                </div>

                {/* Save Card Checkbox */}
                <label className="stripe-save-card-toggle">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <span>Save information securely for 1-click checkout with Stripe Link</span>
                </label>
              </div>
            ) : (
              /* Apple Pay Tab */
              <div className="stripe-apple-pay-promo-box">
                <div className="apple-pay-card-visual">
                  <div className="apple-pay-chip" />
                  <div className="apple-pay-card-details">
                    <span className="apple-card-brand"> Apple Card</span>
                    <span className="apple-card-digits">Mastercard •••• 9284</span>
                  </div>
                </div>
                <p className="apple-pay-note">
                  Seamless express checkout using biometric verification. No card details required.
                </p>
                <button
                  type="button"
                  className="stripe-apple-pay-main-btn"
                  onClick={handleApplePayClick}
                  disabled={isLoading}
                >
                  <span className="apple-mark"></span> Pay with Apple Pay
                </button>
              </div>
            )}
          </div>

          {/* Escrow Guarantee Pill */}
          <div className="product-escrow-trust-pill">
            <ShieldCheck size={16} />
            <span>
              <strong>Vogue Buyer Guarantee:</strong> 256-bit encrypted checkout. Funds safely released post-delivery.
            </span>
          </div>

          {/* Pay Button (for Card tab) */}
          {paymentTab === 'card' && (
            <button
              type="button"
              onClick={handleExecuteCheckout}
              disabled={isLoading || simStep !== null}
              className="product-pay-submit-btn stripe-pay-button"
            >
              {simStep ? (
                <div className="stripe-spinner-row">
                  <Loader2 size={16} className="stripe-spin-icon" />
                  {simStep === 'connecting' && <span>Contacting Stripe Gateway...</span>}
                  {simStep === 'radar' && <span>Stripe Radar Fraud Analysis (0% Risk)...</span>}
                  {simStep === 'authorized' && <span>Payment Authorized! Finalizing...</span>}
                </div>
              ) : (
                <>
                  <Lock size={15} />
                  <span>Pay {itemPrice || '$75.00'} with Stripe</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 3D Secure 2.0 Authentication Modal Simulation */}
      {show3DSModal && (
        <div className="stripe-3ds-backdrop" onClick={(e) => e.stopPropagation()}>
          <div className="stripe-3ds-card">
            <div className="stripe-3ds-header">
              <div className="stripe-3ds-logos">
                <VisaLogo />
                <span className="stripe-3ds-title">3D Secure 2.0 Identity Check</span>
              </div>
              <button 
                type="button" 
                className="stripe-3ds-close"
                onClick={() => setShow3DSModal(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="stripe-3ds-body">
              <p className="stripe-3ds-prompt">
                To protect your VogueSocial purchase, your bank requires Strong Customer Authentication (SCA).
              </p>
              <div className="stripe-3ds-meta-box">
                <div className="stripe-3ds-meta-row">
                  <span>Merchant:</span>
                  <strong>VogueSocial Atelier</strong>
                </div>
                <div className="stripe-3ds-meta-row">
                  <span>Amount:</span>
                  <strong>{itemPrice || '$75.00'}</strong>
                </div>
                <div className="stripe-3ds-meta-row">
                  <span>Card:</span>
                  <strong>Visa ending in 0002</strong>
                </div>
              </div>

              <div className="stripe-3ds-otp-field">
                <label>One-Time Security Passcode (Sent to mobile)</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="stripe-3ds-input"
                />
              </div>

              <button
                type="button"
                className="stripe-3ds-submit-btn"
                onClick={handleConfirm3DS}
              >
                <CheckCircle2 size={16} />
                Authorize & Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apple Pay Sheet Simulation */}
      {showApplePaySheet && (
        <div className="apple-pay-sheet-backdrop" onClick={() => setShowApplePaySheet(false)}>
          <div className="apple-pay-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="apple-sheet-notch" />
            <div className="apple-sheet-header">
              <span className="apple-logo-badge"> Pay</span>
              <button 
                type="button" 
                className="apple-sheet-cancel-btn"
                onClick={() => setShowApplePaySheet(false)}
              >
                Cancel
              </button>
            </div>

            <div className="apple-sheet-merchant-info">
              <span className="apple-sheet-merchant-name">VogueSocial Atelier</span>
              <span className="apple-sheet-total">{itemPrice || '$75.00'}</span>
            </div>

            <div className="apple-sheet-rows">
              <div className="apple-sheet-row">
                <span className="apple-sheet-row-label">CARD</span>
                <span className="apple-sheet-row-val">Apple Card (•••• 9284)</span>
              </div>
              <div className="apple-sheet-row">
                <span className="apple-sheet-row-label">CONTACT</span>
                <span className="apple-sheet-row-val">john@voguesocial.com</span>
              </div>
              <div className="apple-sheet-row">
                <span className="apple-sheet-row-label">SHIPPING</span>
                <span className="apple-sheet-row-val">
                  {address || '456 Vogue Boulevard'}, {city || 'New York'}
                </span>
              </div>
            </div>

            <div className="apple-pay-biometric-zone">
              {applePayStatus === 'ready' && (
                <button
                  type="button"
                  className="apple-pay-confirm-trigger"
                  onClick={handleAuthorizeApplePay}
                >
                  <Smartphone size={18} />
                  <span>Double-Click or Tap to Authorize with Face ID</span>
                </button>
              )}

              {applePayStatus === 'processing' && (
                <div className="apple-pay-scanning-state">
                  <Loader2 size={24} className="apple-pay-spin" />
                  <span>Scanning Face ID / Touch ID...</span>
                </div>
              )}

              {applePayStatus === 'done' && (
                <div className="apple-pay-done-state">
                  <Check size={28} className="apple-pay-done-check" />
                  <span>Done</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

