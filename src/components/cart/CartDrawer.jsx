'use client';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Trash2, ShieldCheck, ArrowRight, Sparkles, Check, Lock, ChevronRight, Tag } from 'lucide-react';
import { useCart, formatPrice } from '@/context/CartContext';
import Image from '@/components/Image';
import CheckoutModal from '@/components/product/CheckoutModal';
import CheckoutSuccessModal from '@/components/product/CheckoutSuccessModal';
import { customerOrderService } from '@/services/customerOrderService';
import './CartDrawer.css';

const FREE_SHIPPING_THRESHOLD = 200;

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    subtotal
  } = useCart();

  const navigate = useNavigate();

  // Escrow Checkout States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [address, setAddress] = useState('456 Vogue St');
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('United States');
  const [orderResult, setOrderResult] = useState(null);

  // Promo Code States
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState(null);

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'VOGUE10') {
      setAppliedPromo({ code: 'VOGUE10', percent: 10, label: '10% Off' });
      setPromoInput('');
    } else if (code === 'RUNWAY20') {
      setAppliedPromo({ code: 'RUNWAY20', percent: 20, label: '20% Off' });
      setPromoInput('');
    } else if (code === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', freeShipping: true, label: 'Free Shipping' });
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try VOGUE10 or RUNWAY20');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  // Close on Escape key
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || Boolean(appliedPromo?.freeShipping);
  const shippingAmount = subtotal === 0 || isFreeShipping ? 0 : 15;
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const discountAmount = appliedPromo?.percent ? (subtotal * appliedPromo.percent) / 100 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingAmount);

  const checkoutTitle = cartItems.length === 1
    ? cartItems[0].name
    : `Curated Bag (${totalCount} garments)`;
  const checkoutVendor = cartItems.length === 1
    ? cartItems[0].brand
    : 'Vogue Verified Designers';

  const handleStartCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleExecuteCheckout = async (selectedShippingAddress, paymentInfo) => {
    setCheckoutLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setCheckoutLoading(false);
    setIsCheckoutOpen(false);

    const generatedOrderId = `#VS-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = customerOrderService.createCustomerOrder({
      id: generatedOrderId,
      amount: finalTotal,
      subtotal: subtotal,
      shippingFee: shippingAmount,
      total: finalTotal,
      paymentMethod: paymentInfo?.methodLabel || 'Visa •••• 4242 via Stripe',
      shippingAddress: selectedShippingAddress || {
        fullName: 'John Miller',
        street: address,
        city: city,
        country: country
      },
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        priceDisplay: formatPrice(item.price),
        size: item.size,
        quantity: item.quantity,
        image: item.image
      }))
    });

    setOrderResult({
      id: newOrder.id,
      orderId: newOrder.id,
      trackingNumber: newOrder.trackingNumber,
      status: 'HELD_IN_ESCROW',
      amount: formatPrice(finalTotal),
      deliveryEstimate: '2-4 business days (Insured Express)'
    });

    clearCart();
    setIsCheckoutSuccess(true);
  };

  return (
    <>
      <div className="cart-drawer-overlay" onClick={closeCart}>
        <aside className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="cart-drawer-header">
            <div className="cart-header-title-wrap">
              <ShoppingBag size={20} className="cart-header-bag-icon" />
              <h2 className="cart-header-title">Shopping Bag</h2>
              <span className="cart-header-count">({totalCount})</span>
            </div>
            <button
              type="button"
              className="cart-drawer-close-btn"
              onClick={closeCart}
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="cart-shipping-banner">
            <div className="cart-shipping-text">
              {isFreeShipping ? (
                <span className="cart-shipping-unlocked">
                  <Check size={14} className="cart-check-icon" />
                  You've unlocked <strong>Complimentary Express Delivery</strong>
                </span>
              ) : (
                <span>
                  Add <strong>${amountToFreeShipping.toFixed(2)}</strong> more for <strong>Free Express Shipping</strong>
                </span>
              )}
            </div>
            <div className="cart-shipping-track">
              <div
                className={`cart-shipping-bar ${isFreeShipping ? 'unlocked' : ''}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Body */}
          <div className="cart-drawer-body">
            {cartItems.length === 0 ? (
              <div className="cart-empty-state">
                <div className="cart-empty-icon-wrap">
                  <ShoppingBag size={48} strokeWidth={1.5} />
                </div>
                <h3 className="cart-empty-title">Your Bag is Empty</h3>
                <p className="cart-empty-desc">
                  Explore curated runway drops, test silhouettes with AI virtual try-on, and add your favorite pieces.
                </p>
                <button
                  type="button"
                  className="cart-explore-btn"
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                >
                  <Sparkles size={16} />
                  <span>Discover Runway Shop</span>
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="cart-item-card">
                    {/* Item Thumbnail */}
                    <div className="cart-item-thumbnail">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="cart-item-img"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="cart-item-details">
                      <div className="cart-item-top-row">
                        <div>
                          <span className="cart-item-brand">{item.brand}</span>
                          <h4 className="cart-item-name">{item.name}</h4>
                        </div>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(item.cartItemId)}
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="cart-item-meta-row">
                        <span className="cart-item-size-badge">Size: {item.size}</span>
                        <span className="cart-item-unit-price">{item.priceDisplay}</span>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="cart-item-action-row">
                        <div className="cart-qty-stepper">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="cart-qty-val">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-item-subtotal">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="cart-drawer-footer">
              {/* Promo Code Input */}
              <div className="cart-promo-container">
                {appliedPromo ? (
                  <div className="cart-promo-applied-badge">
                    <div className="cart-promo-applied-left">
                      <Tag size={13} />
                      <span>Promo <strong>{appliedPromo.code}</strong> ({appliedPromo.label})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="cart-promo-remove-btn"
                      title="Remove promo code"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="cart-promo-input-row">
                    <input
                      type="text"
                      placeholder="Promo code (try VOGUE10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="cart-promo-input"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="cart-promo-apply-btn"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && <span className="cart-promo-error">{promoError}</span>}
              </div>

              <div className="cart-summary-breakdown">
                <div className="cart-summary-line">
                  <span>Subtotal</span>
                  <span className="cart-summary-val">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="cart-summary-line" style={{ color: '#16a34a' }}>
                    <span>Promo Discount ({appliedPromo?.code})</span>
                    <span className="cart-summary-val" style={{ color: '#16a34a', fontWeight: '700' }}>
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="cart-summary-line">
                  <span>Estimated Shipping</span>
                  <span className="cart-summary-val">
                    {shippingAmount === 0 ? 'Complimentary' : formatPrice(shippingAmount)}
                  </span>
                </div>
                <div className="cart-summary-line cart-summary-total">
                  <span>Estimated Total</span>
                  <span className="cart-total-amount">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="cart-footer-buttons">
                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={handleStartCheckout}
                >
                  <Lock size={16} />
                  <span>Proceed to Checkout</span>
                  <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  className="cart-continue-btn"
                  onClick={closeCart}
                >
                  Continue Shopping
                </button>
              </div>

              {/* Escrow Guarantee Notice */}
              <div className="cart-trust-footer">
                <div className="cart-trust-item">
                  <ShieldCheck size={14} className="cart-trust-icon" />
                  <span>Secure Checkout</span>
                </div>
                <span className="cart-trust-divider">•</span>
                <div className="cart-trust-item">
                  <span>14-Day Free Returns</span>
                </div>
                <span className="cart-trust-divider">•</span>
                <div className="cart-trust-item">
                  <span>100% Authentic</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Escrow Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        itemTitle={checkoutTitle}
        itemVendor={checkoutVendor}
        itemPrice={formatPrice(finalTotal)}
        address={address}
        city={city}
        country={country}
        onAddressChange={setAddress}
        onCityChange={setCity}
        onCountryChange={setCountry}
        onCheckout={handleExecuteCheckout}
        isLoading={checkoutLoading}
      />

      {/* Escrow Success Modal */}
      <CheckoutSuccessModal
        isOpen={isCheckoutSuccess}
        onClose={() => {
          setIsCheckoutSuccess(false);
          closeCart();
        }}
        orderResult={orderResult}
        itemPrice={formatPrice(finalTotal)}
        onSimulateDispute={() => {
          alert('Dispute simulated: Funds frozen in escrow and forwarded to VogueSocial resolution council.');
        }}
      />
    </>
  );
}
