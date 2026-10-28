'use client';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Lock, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft, 
  Truck, 
  Store, 
  CreditCard, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Tag
} from 'lucide-react';
import { useCart, formatPrice } from '@/context/CartContext';
import { customerOrderService } from '@/services/customerOrderService';
import './CheckoutPage.css';

// SVG Badges for Stripe Card Brands
const VisaBadge = () => (
  <svg width="34" height="20" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#0A2540" />
    <path d="M14.6 16.5H12.4L13.8 8H16L14.6 16.5ZM21.9 8.2C21.4 8 20.6 7.8 19.6 7.8C17.1 7.8 15.3 9.1 15.3 11C15.3 12.4 16.6 13.2 17.5 13.7C18.5 14.2 18.8 14.5 18.8 15C18.8 15.7 17.9 16.1 17.1 16.1C16.1 16.1 15.5 15.9 14.7 15.5L14.3 15.3L13.9 17.4C14.5 17.7 15.6 18 16.8 18C19.5 18 21.2 16.6 21.2 14.7C21.2 13 20.1 12.1 18.9 11.5C18.1 11.1 17.6 10.8 17.6 10.3C17.6 9.8 18.2 9.4 19.3 9.4C20.1 9.4 20.7 9.6 21.3 9.8L21.5 9.9L21.9 8.2ZM27.4 8H25.7C25.1 8 24.7 8.2 24.4 8.8L20.8 16.5H23.3L23.8 15.1H26.8L27.1 16.5H29.3L27.4 8ZM24.4 13.4L25.6 10.1C25.6 10.1 26 8.9 26.1 8.6H26.2C26.3 8.9 26.5 9.8 26.5 9.8L27.1 13.4H24.4ZM11.7 8L9.6 13.8L9.4 12.6C9 11.2 7.7 9.7 6.3 8.9L8.2 16.5H10.8L14.7 8H11.7Z" fill="#FFFFFF"/>
  </svg>
);

const MastercardBadge = () => (
  <svg width="34" height="20" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#1F2937" />
    <circle cx="14" cy="12" r="6.5" fill="#EB001B" />
    <circle cx="22" cy="12" r="6.5" fill="#F79E1B" fillOpacity="0.9" />
  </svg>
);

const AmexBadge = () => (
  <svg width="34" height="20" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="24" rx="4" fill="#006FCF" />
    <path d="M7 8H10.5L12 12.5L13.5 8H17L14.2 16H10L7 8Z" fill="#FFFFFF" fillOpacity="0.8" />
    <path d="M19 8H27V10H21V11H26V13H21V14H27V16H19V8Z" fill="#FFFFFF" />
  </svg>
);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, subtotal, openCart } = useCart();

  // If cart is empty, provide a sample garment fallback so user can test immediately
  const activeItems = cartItems.length > 0 ? cartItems : [
    {
      cartItemId: 'sample-garment-1',
      id: 'prod-dress-1',
      name: 'Knotted Silk Evening Gown',
      brand: 'Studio Label Paris',
      price: 140.00,
      priceDisplay: '$140.00',
      image: '/Shop_images/5/knotted1-500x750.jpeg',
      size: 'M',
      quantity: 1,
      color: 'Noir Black'
    }
  ];

  // Contact Details
  const [email, setEmail] = useState('sarah.lin@voguesocial.com');
  const [newsOptIn, setNewsOptIn] = useState(true);

  // Fulfillment Mode: 'delivery' | 'pickup'
  const [fulfillment, setFulfillment] = useState('delivery');

  // Delivery Address Form
  const [country, setCountry] = useState('United States');
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Lin');
  const [streetAddress, setStreetAddress] = useState('456 Vogue Boulevard');
  const [apartment, setApartment] = useState('Suite 4B');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('New York');
  const [postalCode, setPostalCode] = useState('10012');

  // Shipping Method: 'standard' | 'priority'
  const [shippingMethod, setShippingMethod] = useState('standard');

  // Payment Method: 'stripe_card' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('stripe_card');

  // Billing Address Mode: 'same' | 'different'
  const [billingMode, setBillingMode] = useState('same');

  // Stripe Elements Input States
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardholderName, setCardholderName] = useState('Sarah Lin');
  const [saveCardStripe, setSaveCardStripe] = useState(true);

  // Promo Code States
  const [couponInput, setCouponInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [couponError, setCouponError] = useState(null);

  // Submission & Stripe Simulation States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stripeStage, setStripeStage] = useState(null); // 'connecting' | 'radar' | 'authorized' | 'declined'
  const [gatewayError, setGatewayError] = useState(null);
  const [show3DSModal, setShow3DSModal] = useState(false);
  const [otpCode, setOtpCode] = useState('849-201');
  const [completedOrder, setCompletedOrder] = useState(null);

  // Calculate Subtotal & Totals
  const currentSubtotal = activeItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shippingFee = fulfillment === 'pickup' ? 0 : (shippingMethod === 'priority' ? 25.00 : 0.00);
  const discountAmount = appliedPromo?.percent ? (currentSubtotal * appliedPromo.percent) / 100 : 0;
  const estimatedTax = (currentSubtotal * 0.10); // 10% estimated tax
  const finalTotal = Math.max(0, currentSubtotal - discountAmount + shippingFee + estimatedTax);

  // Brand Detection
  const cleanNumber = cardNumber.replace(/\D/g, '');
  const getCardBrand = () => {
    if (cleanNumber.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) return 'Mastercard';
    if (/^(34|37)/.test(cleanNumber)) return 'Amex';
    return 'CreditCard';
  };
  const currentBrand = getCardBrand();

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    if (gatewayError) setGatewayError(null);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const handleApplyTestCard = (type) => {
    setGatewayError(null);
    if (type === 'visa_4242') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('12/28');
      setCardCvc('123');
      setCardholderName('Sarah Lin');
    } else if (type === 'mc_5555') {
      setCardNumber('5555 5555 5555 5555');
      setCardExpiry('10/27');
      setCardCvc('888');
      setCardholderName('Sarah Lin');
    } else if (type === '3ds') {
      setCardNumber('4000 0000 0000 0002');
      setCardExpiry('09/26');
      setCardCvc('312');
      setCardholderName('Sarah Lin');
    } else if (type === 'decline') {
      setCardNumber('4000 0000 0000 0005');
      setCardExpiry('05/27');
      setCardCvc('005');
      setCardholderName('Sarah Lin');
    }
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === 'VOGUE10') {
      setAppliedPromo({ code: 'VOGUE10', percent: 10, label: '10% Off' });
      setCouponInput('');
    } else if (code === 'RUNWAY20') {
      setAppliedPromo({ code: 'RUNWAY20', percent: 20, label: '20% Off' });
      setCouponInput('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', percent: 0, label: 'Free Shipping' });
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try VOGUE10 or RUNWAY20');
    }
  };

  // Complete Order Flow
  const handleCompleteOrder = async () => {
    setGatewayError(null);
    setIsSubmitting(true);

    if (paymentMethod === 'stripe_card') {
      // Step 1: Connecting to Stripe
      setStripeStage('connecting');
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Stripe Radar Analysis
      setStripeStage('radar');
      await new Promise((r) => setTimeout(r, 600));

      // Simulate Decline
      if (cleanNumber.endsWith('0005')) {
        setIsSubmitting(false);
        setStripeStage(null);
        setGatewayError({
          title: 'Card Declined by Stripe Gateway',
          message: 'Error code: generic_decline. Test card 0005 simulates an automatic fraud block. Please click "Visa • 4242" above to test successful checkout.'
        });
        return;
      }

      // Simulate 3D Secure
      if (cleanNumber.endsWith('0002')) {
        setIsSubmitting(false);
        setStripeStage(null);
        setShow3DSModal(true);
        return;
      }

      // Step 3: Payment Authorized
      setStripeStage('authorized');
      await new Promise((r) => setTimeout(r, 500));
    }

    finalizeOrderSubmission(
      paymentMethod === 'stripe_card'
        ? `${currentBrand} •••• ${cleanNumber.slice(-4) || '4242'} via Stripe`
        : 'Cash on Delivery (COD)'
    );
  };

  const handleConfirm3DS = async () => {
    setShow3DSModal(false);
    setIsSubmitting(true);
    setStripeStage('authorized');
    await new Promise((r) => setTimeout(r, 500));
    finalizeOrderSubmission('Visa 3D Secure •••• 0002 via Stripe');
  };

  const finalizeOrderSubmission = (resolvedPaymentLabel) => {
    const generatedId = `#VS-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullStreet = streetAddress + (apartment ? `, ${apartment}` : '');

    const newOrder = customerOrderService.createCustomerOrder({
      id: generatedId,
      amount: finalTotal,
      subtotal: currentSubtotal,
      shippingFee: shippingFee,
      total: finalTotal,
      customerName: `${firstName} ${lastName}`.trim() || 'Sarah Lin',
      customerEmail: email || 'sarah.lin@voguesocial.com',
      paymentMethod: resolvedPaymentLabel,
      shippingAddress: {
        fullName: `${firstName} ${lastName}`.trim() || 'Sarah Lin',
        street: fullStreet,
        city: city,
        country: country,
        state: state,
        zip: postalCode
      },
      items: activeItems.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        priceDisplay: formatPrice(item.price),
        size: item.size || 'M',
        quantity: item.quantity || 1,
        image: item.image,
        color: item.color || 'Noir Black'
      }))
    });

    clearCart();
    setIsSubmitting(false);
    setStripeStage(null);
    setCompletedOrder(newOrder);
  };

  // If Order Was Placed Successfully:
  if (completedOrder) {
    return (
      <div className="vs-checkout-page-root">
        <header className="vs-checkout-navbar">
          <div className="vs-checkout-nav-inner">
            <Link to="/" className="vs-checkout-brand">
              <div className="vs-checkout-logo-mark">V</div>
              <span className="vs-checkout-brand-title">VogueSocial</span>
            </Link>
            <div className="vs-checkout-nav-trust">
              <ShieldCheck size={16} />
              <span>Order Confirmed & Secured</span>
            </div>
          </div>
        </header>

        <div className="vs-checkout-success-view">
          <div className="vs-success-check-badge">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h1 className="vs-success-title">Thank you for your order!</h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              A confirmation receipt and order updates have been sent to <strong>{completedOrder.customerEmail}</strong>.
            </p>
          </div>

          <div className="vs-success-order-id-pill">
            Order Reference: {completedOrder.id}
          </div>

          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.2rem',
            width: '100%',
            textAlign: 'left',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Delivery To:</span>
              <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>
                {completedOrder.shippingAddress?.fullName} ({completedOrder.shippingAddress?.city}, {completedOrder.shippingAddress?.country})
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Payment Method:</span>
              <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>{completedOrder.paymentMethod}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0F172A' }}>Total Paid:</span>
              <strong style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>{formatPrice(completedOrder.total)}</strong>
            </div>
          </div>

          <div className="vs-success-actions-row">
            <Link to="/profile?tab=orders" className="vs-success-btn-primary">
              View Tax Invoice & Receipt
            </Link>
            <Link to="/shop" className="vs-success-btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vs-checkout-page-root">
      {/* Top Banner Strip */}
      <div className="vs-checkout-top-strip">
        Free express delivery on orders over $150 • 256-Bit SSL Encrypted Checkout
      </div>

      {/* Main Top Navigation */}
      <header className="vs-checkout-navbar">
        <div className="vs-checkout-nav-inner">
          <Link to="/" className="vs-checkout-brand">
            <div className="vs-checkout-logo-mark">V</div>
            <span className="vs-checkout-brand-title">VogueSocial</span>
          </Link>

          <Link to="/shop" className="vs-checkout-back-link">
            <ArrowLeft size={16} />
            <span>Return to Shopping</span>
          </Link>

          <div className="vs-checkout-nav-trust">
            <Lock size={14} />
            <span>256-Bit Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* 2-Column Checkout Layout */}
      <main className="vs-checkout-container">
        <div className="vs-checkout-grid">

          {/* Left Column: Form Details */}
          <div className="vs-checkout-main">

            {/* 1. Contact Details */}
            <section className="vs-checkout-section">
                  <div className="vs-section-header-row">
                    <h2 className="vs-section-title">Contact details</h2>
                <button
                  type="button"
                  className="vs-section-action-link"
                  onClick={() => setEmail('sarah.lin@voguesocial.com')}
                >
                  Log in for faster checkout
                </button>
              </div>
              <div className="vs-input-group">
                <input
                  type="text"
                  className="vs-input-field"
                  placeholder="Email or mobile phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="vs-section-subtitle">
                  Enter an email or a phone number — we'll send order updates there.
                </span>
              </div>
              <label className="vs-checkbox-label">
                <input
                  type="checkbox"
                  checked={newsOptIn}
                  onChange={(e) => setNewsOptIn(e.target.checked)}
                />
                <span>Email me with news and runway offers</span>
              </label>
            </section>

            {/* 2. Fulfillment */}
            <section className="vs-checkout-section">
              <h2 className="vs-section-title">Fulfillment</h2>
              <div className="vs-radio-cards-row">
                <div
                  className={`vs-radio-card ${fulfillment === 'delivery' ? 'active' : ''}`}
                  onClick={() => setFulfillment('delivery')}
                >
                  <div className="vs-custom-radio-circle" />
                  <div className="vs-radio-card-content">
                    <span className="vs-radio-card-title">Delivery</span>
                    <span className="vs-radio-card-desc">Shipped to your address</span>
                  </div>
                </div>

                <div
                  className={`vs-radio-card ${fulfillment === 'pickup' ? 'active' : ''}`}
                  onClick={() => setFulfillment('pickup')}
                >
                  <div className="vs-custom-radio-circle" />
                  <div className="vs-radio-card-content">
                    <span className="vs-radio-card-title">Local pickup</span>
                    <span className="vs-radio-card-desc">Collect from the boutique, no shipping fee</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Delivery Details */}
            {fulfillment === 'delivery' && (
              <section className="vs-checkout-section">
                <h2 className="vs-section-title">Delivery</h2>
                
                <div className="vs-input-group">
                  <span className="vs-input-label">Country / Region</span>
                  <select
                    className="vs-input-field"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Germany">Germany</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>

                <div className="vs-input-split-2">
                  <div className="vs-input-group">
                    <span className="vs-input-label">First Name</span>
                    <input
                      type="text"
                      className="vs-input-field"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="vs-input-group">
                    <span className="vs-input-label">Last Name</span>
                    <input
                      type="text"
                      className="vs-input-field"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="vs-input-group">
                  <span className="vs-input-label">Street Address</span>
                  <input
                    type="text"
                    className="vs-input-field"
                    placeholder="Street Address (e.g. 456 Vogue Boulevard)"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                  />
                </div>

                <div className="vs-input-group">
                  <span className="vs-input-label">Apartment, suite, etc. (optional)</span>
                  <input
                    type="text"
                    className="vs-input-field"
                    placeholder="Apartment, suite, unit, floor (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                  />
                </div>

                <div className="vs-input-split-2">
                  <div className="vs-input-group">
                    <span className="vs-input-label">City</span>
                    <input
                      type="text"
                      className="vs-input-field"
                      placeholder="City (e.g. New York)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="vs-input-group">
                    <span className="vs-input-label">Postal Code</span>
                    <input
                      type="text"
                      className="vs-input-field"
                      placeholder="Postal Code (e.g. 10012)"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="vs-input-group">
                  <span className="vs-input-label">State / Province</span>
                  <select
                    className="vs-input-field"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option value="New York">New York</option>
                    <option value="California">California</option>
                    <option value="Texas">Texas</option>
                    <option value="Florida">Florida</option>
                    <option value="Illinois">Illinois</option>
                    <option value="Washington">Washington</option>
                  </select>
                </div>
              </section>
            )}

            {/* 4. Shipping Method */}
            {fulfillment === 'delivery' && (
              <section className="vs-checkout-section">
                <h2 className="vs-section-title">Shipping method</h2>
                <div className="vs-selectable-list">
                  <div
                    className={`vs-selectable-item ${shippingMethod === 'standard' ? 'active' : ''}`}
                    onClick={() => setShippingMethod('standard')}
                  >
                    <div className="vs-selectable-left">
                      <div className="vs-custom-radio-circle" />
                      <div>
                        <div className="vs-selectable-title">Standard Insured Delivery</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          2-4 business days (Insured tracking)
                        </div>
                      </div>
                    </div>
                    <span className="vs-selectable-price" style={{ color: '#16A34A' }}>Free</span>
                  </div>

                  <div
                    className={`vs-selectable-item ${shippingMethod === 'priority' ? 'active' : ''}`}
                    onClick={() => setShippingMethod('priority')}
                  >
                    <div className="vs-selectable-left">
                      <div className="vs-custom-radio-circle" />
                      <div>
                        <div className="vs-selectable-title">Priority White-Glove Runway Courier</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          Next-day guaranteed delivery with signature confirmation
                        </div>
                      </div>
                    </div>
                    <span className="vs-selectable-price">$25.00</span>
                  </div>
                </div>
              </section>
            )}

            {/* 5. Payment Method */}
            <section className="vs-checkout-section">
              <h2 className="vs-section-title">Payment Method</h2>
              <p className="vs-section-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={13} color="#64748b" />
                All transactions are secure and encrypted.
              </p>

              {/* Error Alert Banner */}
              {gatewayError && (
                <div className="stripe-error-banner">
                  <AlertCircle size={16} className="stripe-error-icon" />
                  <div className="stripe-error-content">
                    <strong>{gatewayError.title}</strong>
                    <p>{gatewayError.message}</p>
                  </div>
                </div>
              )}

              {/* Payment Accordion: Card vs COD */}
              <div className="vs-payment-accordion">
                
                {/* Option 1: Card */}
                <div className={`vs-payment-option ${paymentMethod === 'stripe_card' ? 'active' : ''}`}>
                  <div
                    className="vs-payment-option-header"
                    onClick={() => setPaymentMethod('stripe_card')}
                  >
                    <div className="vs-payment-option-title-group">
                      <div className="vs-custom-radio-circle" />
                      <span className="vs-payment-name">Card</span>
                    </div>
                    <div className="vs-payment-badges-slot">
                      <VisaBadge />
                      <MastercardBadge />
                      <AmexBadge />
                    </div>
                  </div>

                  {/* Expanded Stripe Elements Fields */}
                  {paymentMethod === 'stripe_card' && (
                    <div className="vs-payment-body-expanded">

                      {/* Card Number Input with SVG detection */}
                      <div className="stripe-elements-container" style={{ margin: 0, padding: 0, border: 'none', boxShadow: 'none' }}>
                        <div className="stripe-element-field-group">
                          <div className="stripe-input-wrapper">
                            <div className="stripe-brand-icon-slot">
                              {currentBrand === 'Visa' && <VisaBadge />}
                              {currentBrand === 'Mastercard' && <MastercardBadge />}
                              {currentBrand === 'Amex' && <AmexBadge />}
                              {currentBrand === 'CreditCard' && <CreditCard size={18} color="#94A3B8" />}
                            </div>
                            <input
                              type="text"
                              className="stripe-element-input card-num-input"
                              placeholder="4242 4242 4242 4242"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              maxLength={19}
                            />
                            <Lock size={12} color="#64748B" />
                          </div>
                        </div>

                        {/* Split Row: Expiry, CVC, Postal */}
                        <div className="stripe-split-row" style={{ marginTop: '8px' }}>
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
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              placeholder="10012"
                            />
                          </div>
                        </div>

                        {/* Cardholder Name */}
                        <div className="stripe-subfield full-width" style={{ marginTop: '8px' }}>
                          <span className="stripe-sublabel">NAME ON CARD</span>
                          <input
                            type="text"
                            className="stripe-element-input"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Full name as printed on card"
                          />
                        </div>

                        {/* Save Card Toggle */}
                        <label className="stripe-save-card-toggle" style={{ marginTop: '10px' }}>
                          <input
                            type="checkbox"
                            checked={saveCardStripe}
                            onChange={(e) => setSaveCardStripe(e.target.checked)}
                          />
                          <span>Save my payment details for 1-click checkout with Stripe Link</span>
                        </label>
                      </div>

                    </div>
                  )}
                </div>

                {/* Option 2: Cash on Delivery (COD) */}
                <div className={`vs-payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <div
                    className="vs-payment-option-header"
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="vs-payment-option-title-group">
                      <div className="vs-custom-radio-circle" />
                      <span className="vs-payment-name">Cash on Delivery (COD)</span>
                    </div>
                    <Truck size={18} color="#64748B" />
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="vs-payment-body-expanded">
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
                        Pay in cash upon delivery of your order. Our white-glove courier will present the garment package and collect payment.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </section>

            {/* 6. Billing Address */}
            <section className="vs-checkout-section">
              <h2 className="vs-section-title">Billing Address</h2>
              <div className="vs-selectable-list">
                <div
                  className={`vs-selectable-item ${billingMode === 'same' ? 'active' : ''}`}
                  onClick={() => setBillingMode('same')}
                >
                  <div className="vs-selectable-left">
                    <div className="vs-custom-radio-circle" />
                    <span className="vs-selectable-title">Same as shipping address</span>
                  </div>
                </div>

                <div
                  className={`vs-selectable-item ${billingMode === 'different' ? 'active' : ''}`}
                  onClick={() => setBillingMode('different')}
                >
                  <div className="vs-selectable-left">
                    <div className="vs-custom-radio-circle" />
                    <span className="vs-selectable-title">Use a different billing address</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Submit Action Button */}
            <button
              type="button"
              className="vs-complete-order-btn"
              onClick={handleCompleteOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={18} className="stripe-spin-icon" />
                  <span>Processing order...</span>
                </div>
              ) : (
                <span>Complete order</span>
              )}
            </button>

            {/* Footer Policy Links */}
            <div className="vs-checkout-policies">
              <a href="#refund">Refund policy</a>
              <span>•</span>
              <a href="#privacy">Privacy policy</a>
              <span>•</span>
              <a href="#terms">Terms of service</a>
            </div>

          </div>

          {/* Right Column: Order Summary Card */}
          <aside className="vs-order-summary-sidebar">
            <div className="vs-summary-header">
              <h3 className="vs-summary-title">Order summary</h3>
              <button
                type="button"
                className="vs-edit-cart-link"
                onClick={openCart}
              >
                Edit cart
              </button>
            </div>

            {/* Item Breakdown */}
            <div className="vs-summary-items-list">
              {activeItems.map((item) => (
                <div key={item.cartItemId || item.id} className="vs-summary-item-row">
                  <div className="vs-summary-item-thumb-box">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="vs-summary-item-img"
                    />
                    <div className="vs-summary-item-qty-badge">
                      {item.quantity || 1}
                    </div>
                  </div>
                  <div className="vs-summary-item-info">
                    <span className="vs-summary-item-name">{item.name}</span>
                    <span className="vs-summary-item-meta">
                      Color: {item.color || 'Noir Black'} • Size: {item.size || 'M'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      Vendor: {item.brand || 'Vogue Atelier'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span className="vs-summary-item-price">
                      {formatPrice(item.price * (item.quantity || 1))}
                    </span>
                    {activeItems.length > 1 && (
                      <button
                        type="button"
                        className="vs-summary-item-trash-btn"
                        onClick={() => removeFromCart(item.cartItemId)}
                        title="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="vs-coupon-box">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="vs-coupon-input"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button
                  type="button"
                  className="vs-coupon-apply-btn"
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: '600' }}>
                  ✓ Promo applied: {appliedPromo.label} ({appliedPromo.code})
                </div>
              )}
              {couponError && (
                <div style={{ fontSize: '0.78rem', color: '#DC2626' }}>
                  {couponError}
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="vs-pricing-rows">
              <div className="vs-pricing-row">
                <span>Subtotal</span>
                <strong>{formatPrice(currentSubtotal)}</strong>
              </div>

              {discountAmount > 0 && (
                <div className="vs-pricing-row" style={{ color: '#16A34A' }}>
                  <span>Discount ({appliedPromo.code})</span>
                  <strong>-{formatPrice(discountAmount)}</strong>
                </div>
              )}

              <div className="vs-pricing-row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span>
              </div>

              <div className="vs-pricing-row">
                <span>Estimated Tax (10%)</span>
                <span>{formatPrice(estimatedTax)}</span>
              </div>

              <div className="vs-pricing-row total-row">
                <span>Total</span>
                <div>
                  <span className="vs-total-currency-code">USD</span>
                  <span className="vs-pricing-total-val">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* 3D Secure 2.0 Challenge Modal */}
      {show3DSModal && (
        <div className="stripe-3ds-backdrop" onClick={(e) => e.stopPropagation()}>
          <div className="stripe-3ds-card">
            <div className="stripe-3ds-header">
              <div className="stripe-3ds-logos">
                <VisaBadge />
                <span className="stripe-3ds-title">3D Secure 2.0 Identity Check</span>
              </div>
            </div>
            <div className="stripe-3ds-body">
              <p className="stripe-3ds-prompt">
                Your bank requires Strong Customer Authentication (SCA) to authorize this VogueSocial payment.
              </p>
              <div className="stripe-3ds-meta-box">
                <div className="stripe-3ds-meta-row">
                  <span>Merchant:</span>
                  <strong>VogueSocial Atelier</strong>
                </div>
                <div className="stripe-3ds-meta-row">
                  <span>Amount:</span>
                  <strong>{formatPrice(finalTotal)}</strong>
                </div>
                <div className="stripe-3ds-meta-row">
                  <span>Card:</span>
                  <strong>Visa ending in 0002</strong>
                </div>
              </div>

              <div className="stripe-3ds-otp-field">
                <label>One-Time Security Passcode</label>
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

    </div>
  );
}
