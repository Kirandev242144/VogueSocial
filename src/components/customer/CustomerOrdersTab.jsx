'use client';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Truck, ShieldCheck, CheckCircle2, Clock,
  AlertTriangle, RotateCcw, FileText, ExternalLink,
  ChevronRight, X, ArrowRight, Copy, Check, ShoppingBag,
  Printer
} from 'lucide-react';
import { customerOrderService } from '@/services/customerOrderService';
import { useCart } from '@/context/CartContext';
import './CustomerOrders.css';

export default function CustomerOrdersTab() {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'transit' | 'delivered' | 'returns'
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Return Form State
  const [returnReason, setReturnReason] = useState('Size Too Small (Fit Issue)');
  const [returnNote, setReturnNote] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnSuccessRma, setReturnSuccessRma] = useState(null);

  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState(null);

  const loadOrders = () => {
    const list = customerOrderService.getCustomerOrders();
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyTracking = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!selectedOrderForReturn) return;

    setReturnSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const result = customerOrderService.requestReturn(selectedOrderForReturn.id, {
      reason: returnReason,
      note: returnNote
    });

    setReturnSubmitting(false);
    setReturnSuccessRma(result.rmaId);
    loadOrders();
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Cancel this order? A full refund will be processed back to your original payment method.')) {
      customerOrderService.cancelOrder(orderId, 'Shopper requested immediate cancellation before carrier pickup');
      loadOrders();
      showToast('Order successfully cancelled. Refund processed.');
    }
  };

  const handleBuyAgain = (item) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: item.image,
        category: 'garments'
      },
      item.size || 'M',
      1
    );
    showToast(`Added ${item.name} (Size ${item.size || 'M'}) to bag`);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'transit') return order.status === 'in_transit' || order.status === 'processing';
    if (activeFilter === 'delivered') return order.status === 'delivered';
    if (activeFilter === 'returns') return order.status === 'returned' || order.status === 'disputed' || order.status === 'cancelled';
    return true;
  });

  return (
    <div className="cust-orders-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1100,
          fontSize: '0.875rem'
        }}>
          <Check size={16} color="#4ADE80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="cust-orders-header-row">
        <div className="cust-orders-title-wrap">
          <h2 className="cust-orders-title">My Orders</h2>
          <span className="cust-orders-subtitle">
            Track active shipments, view delivery receipts, and manage order returns.
          </span>
        </div>

        <div className="cust-filter-pills">
          <button
            type="button"
            className={`cust-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            className={`cust-filter-btn ${activeFilter === 'transit' ? 'active' : ''}`}
            onClick={() => setActiveFilter('transit')}
          >
            Active & In Transit ({orders.filter(o => o.status === 'in_transit' || o.status === 'processing').length})
          </button>
          <button
            type="button"
            className={`cust-filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
            onClick={() => setActiveFilter('delivered')}
          >
            Delivered ({orders.filter(o => o.status === 'delivered').length})
          </button>
          <button
            type="button"
            className={`cust-filter-btn ${activeFilter === 'returns' ? 'active' : ''}`}
            onClick={() => setActiveFilter('returns')}
          >
            Returns & Cancelled ({orders.filter(o => o.status === 'returned' || o.status === 'disputed' || o.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="cust-orders-empty">
          <div className="cust-orders-empty-icon">
            <Package size={28} />
          </div>
          <h3 className="cust-orders-empty-title">No orders in this category</h3>
          <p className="cust-orders-empty-desc">
            When you purchase designer pieces on VogueSocial, your orders and live carrier delivery milestones will appear here.
          </p>
          <Link to="/shop" className="cust-btn-primary">
            <ShoppingBag size={15} />
            <span>Discover Runway Drops</span>
          </Link>
        </div>
      ) : (
        <div className="cust-orders-list">
          {filteredOrders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isReturned = order.status === 'returned';
            const isCancelled = order.status === 'cancelled';
            const isInTransit = order.status === 'in_transit';
            const isProcessing = order.status === 'processing';

            return (
              <div key={order.id} className="cust-order-card">
                {/* Header */}
                <div className="cust-order-header">
                  <div className="cust-order-meta-left">
                    <span className="cust-order-id-badge">{order.id}</span>
                    <span className="cust-order-date">Placed on {order.date}</span>
                  </div>

                  <div className="cust-order-badges-right">
                    {/* Payment Status Badge */}
                    {isCancelled ? (
                      <span className="badge-escrow-returned" title="Refund processed to your payment card">
                        <RotateCcw size={13} />
                        Refunded
                      </span>
                    ) : (
                      <span className="badge-escrow-released" title="Payment verified and confirmed">
                        <CheckCircle2 size={13} />
                        Paid
                      </span>
                    )}

                    {/* Order Fulfillment Status */}
                    {isInTransit && (
                      <span className="badge-fulfill-status badge-fulfill-transit">
                        <Truck size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        In Transit
                      </span>
                    )}
                    {isProcessing && (
                      <span className="badge-fulfill-status badge-fulfill-processing">
                        <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        Preparing Order
                      </span>
                    )}
                    {isDelivered && (
                      <span className="badge-fulfill-status badge-fulfill-delivered">
                        <CheckCircle2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        Delivered
                      </span>
                    )}
                    {isReturned && (
                      <span className="badge-fulfill-status badge-escrow-returned">
                        <RotateCcw size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        {order.rmaId ? `Return Authorized (${order.rmaId})` : 'Returned'}
                      </span>
                    )}
                    {isCancelled && (
                      <span className="badge-fulfill-status badge-escrow-returned">
                        <X size={13} style={{ display: 'inline', marginRight: '4px' }} />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="cust-order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="cust-order-item-row">
                      <div className="cust-order-item-left">
                        <div className="cust-item-thumb">
                          <img src={item.image} alt={item.name} className="cust-item-img" />
                        </div>
                        <div className="cust-item-details">
                          <span className="cust-item-brand">{item.brand}</span>
                          <h4 className="cust-item-title">{item.name}</h4>
                          <span className="cust-item-meta">
                            Size: <strong>{item.size}</strong> · Qty: <strong>{item.quantity}</strong>
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="cust-item-price">{item.priceDisplay || `$${item.price.toFixed(2)}`}</span>
                        <button
                          type="button"
                          className="cust-btn-outline"
                          onClick={() => handleBuyAgain(item)}
                          title="Add item back to shopping bag"
                        >
                          Buy Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carrier / Escrow Info Strip */}
                <div className="cust-order-tracking-strip">
                  <div className="cust-carrier-group">
                    <Truck size={15} color="#475569" />
                    <span>Carrier: <strong>{order.carrier}</strong></span>
                    {order.trackingNumber && (
                      <span className="cust-tracking-code">{order.trackingNumber}</span>
                    )}
                  </div>

                  {isDelivered && order.proofOfDelivery ? (
                    <div className="cust-pod-badge">
                      <CheckCircle2 size={13} />
                      <span>POD: {order.proofOfDelivery.signedBy} ({order.proofOfDelivery.location})</span>
                    </div>
                  ) : (
                    <div className="cust-escrow-subnote">
                      <Clock size={13} />
                      <span>{order.estimatedDelivery || 'Estimated 2-4 Business Days'}</span>
                    </div>
                  )}
                </div>

                {/* Footer with Actions */}
                <div className="cust-order-footer">
                  <div className="cust-order-total-group">
                    <span className="cust-order-total-label">Total Paid:</span>
                    <span className="cust-order-total-val">
                      ${typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                    </span>
                  </div>

                  <div className="cust-order-actions">
                    {/* View Invoice / Receipt */}
                    <button
                      type="button"
                      className="cust-btn-outline"
                      onClick={() => setSelectedOrderForReceipt(order)}
                    >
                      <FileText size={14} />
                      <span>View Receipt</span>
                    </button>

                    {/* Track Shipment */}
                    <button
                      type="button"
                      className="cust-btn-outline cust-btn-track"
                      onClick={() => setSelectedOrderForTracking(order)}
                    >
                      <Truck size={14} />
                      <span>Track Shipment</span>
                    </button>

                    {/* Request Return (Only for delivered or eligible orders not yet returned) */}
                    {isDelivered && !order.rmaId && (
                      <button
                        type="button"
                        className="cust-btn-outline cust-btn-return"
                        onClick={() => {
                          setSelectedOrderForReturn(order);
                          setReturnSuccessRma(null);
                          setReturnNote('');
                        }}
                      >
                        <RotateCcw size={14} />
                        <span>Request Return (RMA)</span>
                      </button>
                    )}

                    {/* Cancel Order (Only if still in processing before dispatch) */}
                    {order.status === 'processing' && (
                      <button
                        type="button"
                        className="cust-btn-outline cust-btn-return"
                        onClick={() => handleCancelOrder(order.id)}
                        title="Cancel this order before it is packed and dispatched"
                      >
                        <X size={14} />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL 1: LIVE TRACKING TIMELINE ── */}
      {selectedOrderForTracking && (
        <div className="cust-modal-backdrop" onClick={() => setSelectedOrderForTracking(null)}>
          <div className="cust-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <h3 className="cust-modal-title">
                <Truck size={18} />
                <span>Live Delivery Tracking</span>
              </h3>
              <button
                type="button"
                className="cust-modal-close"
                onClick={() => setSelectedOrderForTracking(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="cust-modal-body">
              <div className="cust-track-meta-card">
                <div className="cust-track-meta-row">
                  <span style={{ color: '#64748B' }}>Order Number:</span>
                  <strong style={{ color: '#0F172A' }}>{selectedOrderForTracking.id}</strong>
                </div>
                <div className="cust-track-meta-row">
                  <span style={{ color: '#64748B' }}>Logistics Carrier:</span>
                  <strong style={{ color: '#0F172A' }}>{selectedOrderForTracking.carrier}</strong>
                </div>
                <div className="cust-track-meta-row">
                  <span style={{ color: '#64748B' }}>Air Waybill (AWB):</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>
                      {selectedOrderForTracking.trackingNumber}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyTracking(selectedOrderForTracking.trackingNumber)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
                      title="Copy tracking code"
                    >
                      {copiedTracking ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                <div className="cust-track-meta-row">
                  <span style={{ color: '#64748B' }}>Shipping Destination:</span>
                  <span style={{ color: '#0F172A', fontWeight: '500' }}>
                    {selectedOrderForTracking.shippingAddress?.street}, {selectedOrderForTracking.shippingAddress?.city}
                  </span>
                </div>
              </div>

              {/* Milestone Timeline */}
              <div className="cust-track-timeline">
                {(selectedOrderForTracking.timeline || []).map((step, idx) => (
                  <div
                    key={idx}
                    className={`cust-timeline-step ${step.completed ? 'completed' : ''}`}
                  >
                    <div className="cust-timeline-dot" />
                    <h4 className="cust-timeline-title">{step.status}</h4>
                    <span className="cust-timeline-time">{step.time}</span>
                    <p className="cust-timeline-desc">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: RETURN & RMA REQUEST ── */}
      {selectedOrderForReturn && (
        <div className="cust-modal-backdrop" onClick={() => setSelectedOrderForReturn(null)}>
          <div className="cust-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <h3 className="cust-modal-title">
                <RotateCcw size={18} />
                <span>Request Return & RMA</span>
              </h3>
              <button
                type="button"
                className="cust-modal-close"
                onClick={() => setSelectedOrderForReturn(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="cust-modal-body">
              {returnSuccessRma ? (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#DCFCE7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: '#16A34A'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.5rem' }}>
                    Return Authorization Approved
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                    Your return authorization number is <strong style={{ color: '#0F172A' }}>{returnSuccessRma}</strong>.
                    A prepaid return shipping label and package instructions have been dispatched to your email.
                  </p>
                  <div style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'left',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Next Steps:</div>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569', lineHeight: '1.6' }}>
                      <li>Attach original tags and pack in original protective dust bag.</li>
                      <li>Print the prepaid return label sent to your email.</li>
                      <li>Drop off package at any authorized DHL Express collection point.</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="cust-btn-primary"
                    onClick={() => setSelectedOrderForReturn(null)}
                  >
                    Close & View Updated Orders
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReturn}>
                  <div className="cust-rma-notice">
                    <strong>14-Day Complimentary Return Policy:</strong> Items can be returned within 14 days of delivery in unworn condition with designer tags attached.
                  </div>

                  <div className="cust-form-group">
                    <label className="cust-form-label">Return Reason</label>
                    <select
                      className="cust-form-select"
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                    >
                      <option value="Size Too Small (Fit Issue)">Size Too Small (Fit Issue)</option>
                      <option value="Size Too Large (Fit Issue)">Size Too Large (Fit Issue)</option>
                      <option value="Fabric Tone Mismatch">Fabric Tone Mismatch in Natural Light</option>
                      <option value="Item Not as Expected">Item Not as Expected from Runway Photo</option>
                      <option value="Packaging or Seam Defect">Packaging or Seam Defect</option>
                      <option value="Changed Mind">Changed Mind</option>
                    </select>
                  </div>

                  <div className="cust-form-group">
                    <label className="cust-form-label">Explanation / Notes for Designer</label>
                    <textarea
                      className="cust-form-textarea"
                      placeholder="Please describe why this garment didn't work for you (e.g. chest measurement was slightly tight)..."
                      value={returnNote}
                      onChange={(e) => setReturnNote(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className="cust-btn-outline"
                      onClick={() => setSelectedOrderForReturn(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cust-btn-primary"
                      disabled={returnSubmitting}
                    >
                      {returnSubmitting ? 'Submitting Request...' : 'Submit Return Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ORDER RECEIPT & INVOICE ── */}
      {selectedOrderForReceipt && (
        <div className="cust-modal-backdrop" onClick={() => setSelectedOrderForReceipt(null)}>
          <div className="cust-modal-box receipt-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Top Toolbar (Hidden on Print) */}
            <div className="cust-receipt-top-actions">
              <div className="cust-receipt-status-pill">
                <CheckCircle2 size={14} />
                <span>Paid in Full</span>
              </div>
              <div className="cust-receipt-action-btns">
                <button
                  type="button"
                  className="cust-btn-outline"
                  onClick={() => window.print()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  <Printer size={15} />
                  <span>Print or Save as PDF</span>
                </button>
                <button
                  type="button"
                  className="cust-modal-close"
                  onClick={() => setSelectedOrderForReceipt(null)}
                  title="Close receipt"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Document Paper */}
            <div id="printable-receipt" className="cust-receipt-paper">
              {/* Header Grid: Brand & Company info vs Meta details */}
              <div className="cust-invoice-header-grid">
                <div>
                  <h2 className="cust-invoice-brand">VOGUESOCIAL</h2>
                  <div className="cust-invoice-company-details">
                    VogueSocial Global Luxury Marketplace Inc.<br />
                    540 Madison Avenue, 14th Floor<br />
                    New York, NY 10022, United States<br />
                    VAT / Tax Registration ID: US-NY-84920194
                  </div>
                </div>
                <div className="cust-invoice-meta-col">
                  <div className="cust-invoice-type-tag">Tax Invoice / Receipt</div>
                  <div className="cust-invoice-meta-line">
                    Invoice No: <span className="cust-invoice-meta-bold">{selectedOrderForReceipt.id}</span>
                  </div>
                  <div className="cust-invoice-meta-line">
                    Issue Date: <strong>{selectedOrderForReceipt.date}</strong>
                  </div>
                  <div className="cust-invoice-meta-line">
                    Payment Status: <strong style={{ color: '#166534' }}>Settled & Paid</strong>
                  </div>
                </div>
              </div>

              {/* 2-Column Parties Grid: Billed To vs Payment/Courier */}
              <div className="cust-invoice-parties-grid">
                <div className="cust-invoice-party-box">
                  <div className="cust-invoice-party-title">Billed & Shipped To</div>
                  <div className="cust-invoice-party-name">
                    {selectedOrderForReceipt.shippingAddress?.fullName || 'John Miller'}
                  </div>
                  <div>{selectedOrderForReceipt.shippingAddress?.street || '456 Vogue Boulevard, Suite 4B'}</div>
                  <div>
                    {selectedOrderForReceipt.shippingAddress?.city || 'New York'},{' '}
                    {selectedOrderForReceipt.shippingAddress?.state || 'NY'}{' '}
                    {selectedOrderForReceipt.shippingAddress?.zip || '10012'}
                  </div>
                  <div>{selectedOrderForReceipt.shippingAddress?.country || 'United States'}</div>
                  {selectedOrderForReceipt.shippingAddress?.phone && (
                    <div style={{ color: '#64748B', marginTop: '2px' }}>
                      Tel: {selectedOrderForReceipt.shippingAddress.phone}
                    </div>
                  )}
                </div>

                <div className="cust-invoice-party-box">
                  <div className="cust-invoice-party-title">Payment & Shipping Reference</div>
                  <div>
                    <strong style={{ color: '#0F172A' }}>Payment Method:</strong>{' '}
                    {selectedOrderForReceipt.paymentMethod || 'Visa •••• 4242 (Stripe Secure)'}
                  </div>
                  <div>
                    <strong style={{ color: '#0F172A' }}>Carrier:</strong>{' '}
                    {selectedOrderForReceipt.carrier || 'DHL Express Priority'}
                  </div>
                  {selectedOrderForReceipt.trackingNumber && (
                    <div>
                      <strong style={{ color: '#0F172A' }}>Tracking / AWB:</strong>{' '}
                      <span style={{ fontFamily: 'monospace', color: '#0F172A' }}>{selectedOrderForReceipt.trackingNumber}</span>
                    </div>
                  )}
                  <div>
                    <strong style={{ color: '#0F172A' }}>Service Level:</strong> Insured International Express
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="cust-invoice-table-wrap">
                <table className="cust-invoice-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50%' }}>Item Description</th>
                      <th style={{ textAlign: 'center', width: '15%' }}>Qty</th>
                      <th style={{ textAlign: 'right', width: '15%' }}>Unit Price</th>
                      <th style={{ textAlign: 'right', width: '20%' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderForReceipt.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="cust-invoice-item-cell">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="cust-invoice-item-img"
                              />
                            )}
                            <div>
                              <div className="cust-invoice-item-name">{item.name}</div>
                              <div className="cust-invoice-item-sub">
                                Brand: <strong>{item.brand}</strong> · Size: {item.size}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right' }}>${(item.price || 0).toFixed(2)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="cust-invoice-financials-wrap">
                <div className="cust-invoice-financials">
                  <div className="cust-invoice-fin-line">
                    <span>Subtotal</span>
                    <strong>${(selectedOrderForReceipt.subtotal || 0).toFixed(2)}</strong>
                  </div>
                  <div className="cust-invoice-fin-line">
                    <span>Shipping & Handling</span>
                    <span>
                      {selectedOrderForReceipt.shippingFee === 0 || !selectedOrderForReceipt.shippingFee
                        ? 'Complimentary ($0.00)'
                        : `$${selectedOrderForReceipt.shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="cust-invoice-fin-line">
                    <span>Sales Tax / VAT (8%)</span>
                    <span>${(selectedOrderForReceipt.tax || 0).toFixed(2)}</span>
                  </div>
                  <div className="cust-invoice-fin-total">
                    <span>Total Paid</span>
                    <span>
                      ${typeof selectedOrderForReceipt.total === 'number'
                        ? selectedOrderForReceipt.total.toFixed(2)
                        : selectedOrderForReceipt.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Authenticity Guarantee Strip */}
              <div className="cust-invoice-guarantee-strip">
                <ShieldCheck size={18} style={{ color: '#0F172A', flexShrink: 0 }} />
                <span>
                  <strong>VogueSocial Authenticity Seal:</strong> This document certifies that all pieces in this shipment have passed certified luxury atelier verification with complimentary 14-day insured buyer return protection.
                </span>
              </div>

              {/* Footer Legal Notes */}
              <div className="cust-invoice-legal-footer">
                Thank you for shopping with VogueSocial. For post-purchase concierge or inquiries regarding this order, contact <a href="mailto:concierge@voguesocial.com" style={{ color: '#0F172A', textDecoration: 'underline' }}>concierge@voguesocial.com</a>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
