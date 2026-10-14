"use client";
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  OrdersHeader,
  OrdersKPICards,
  AllOrdersTable,
  ReturnsTable,
  OrderTrackingTable,
  FulfillOrderModal,
  ReturnReviewModal,
  OrderDetailsModal
} from '@/components/merchant/orders';
import './MerchantOrders.css';

const DEFAULT_ORDERS = [
  {
    id: '#ORD-1841',
    product: 'Tailored Silk Blouse',
    customer: 'Aisha Malik',
    email: 'aisha@mail.com',
    amount: '$49.00',
    payment_status: 'paid',
    fulfillment_status: 'unfulfilled',
    date: 'Apr 29, 2026',
    size: 'M',
    qty: 1,
    address: '14 Green St, Dubai, UAE',
    channel: 'Online Store',
    image: '/Shop_images/5/knotted1-500x750.jpeg'
  },
  {
    id: '#ORD-1842',
    product: 'Structured Wool Signature Overshirt',
    customer: 'Priya Sharma',
    email: 'priya@mail.com',
    amount: '$129.00',
    payment_status: 'paid',
    fulfillment_status: 'fulfilled',
    trackingId: 'FX28301948IN',
    carrier: 'DHL Express',
    date: 'Apr 28, 2026',
    size: 'L',
    qty: 1,
    address: '22 MG Road, Bangalore, India',
    channel: 'Online Store',
    image: '/Shop_images/8/overshirt1-500x750.jpg'
  },
  {
    id: '#ORD-1843',
    product: 'Silk Wrap Evening Dress',
    customer: 'Sara Johnson',
    email: 'sara@mail.com',
    amount: '$89.00',
    payment_status: 'paid',
    fulfillment_status: 'delivered',
    trackingId: 'DHL928410291',
    carrier: 'DHL Express',
    date: 'Apr 27, 2026',
    size: 'S',
    qty: 2,
    address: '5 Oak Ave, London, UK',
    channel: 'Meta Facebook Shop',
    image: '/Shop_images/1/basic2-500x750.jpeg'
  },
  {
    id: '#ORD-1844',
    product: 'Wide-Leg Sartorial Pleated Trousers',
    customer: 'Riya Kapoor',
    email: 'riya@mail.com',
    amount: '$75.00',
    payment_status: 'pending',
    fulfillment_status: 'unfulfilled',
    date: 'Apr 29, 2026',
    size: 'XL',
    qty: 1,
    address: '9 Park Lane, Mumbai, India',
    channel: 'Online Store',
    image: '/Shop_images/13/wideleg1-500x750.jpg'
  },
  {
    id: '#ORD-1845',
    product: 'Structured Minimalist Tailored Suit',
    customer: 'Fatima Al-Rashid',
    email: 'fatima@mail.com',
    amount: '$95.00',
    payment_status: 'refunded',
    fulfillment_status: 'cancelled',
    date: 'Apr 26, 2026',
    size: 'M',
    qty: 1,
    address: 'Riyadh, Saudi Arabia',
    channel: 'Online Store',
    image: '/Shop_images/1/basic4-500x750.jpeg'
  }
];

const DEFAULT_RETURNS = [
  {
    id: 'RMA-9021',
    orderId: '#ORD-1843',
    customer: 'Sara Johnson',
    email: 'sara@mail.com',
    product: 'Silk Wrap Evening Dress',
    size: 'S',
    reason: 'Size Too Small (Fit Issue)',
    customerNote: 'Garment was tighter around the chest than the sizing chart indicated. Tags are intact and attached.',
    amount: '$89.00',
    status: 'requested',
    date: 'Apr 29, 2026',
    image: '/Shop_images/1/basic2-500x750.jpeg'
  },
  {
    id: 'RMA-9022',
    orderId: '#ORD-1839',
    customer: 'Elena Rostova',
    email: 'elena@mail.com',
    product: 'Knotted Asymmetric Drape Blouse',
    size: 'M',
    reason: 'Fabric Tone Mismatch',
    customerNote: 'Color tone in natural light differs from product photography. Return label printed.',
    amount: '$120.00',
    status: 'in_transit',
    date: 'Apr 27, 2026',
    image: '/Shop_images/5/knotted1-500x750.jpeg'
  },
  {
    id: 'RMA-9023',
    orderId: '#ORD-1835',
    customer: 'Marcus Vance',
    email: 'marcus@mail.com',
    product: 'Structured Wool Signature Overshirt',
    size: 'L',
    reason: 'Customer Changed Mind',
    customerNote: 'Returned in original boutique packaging with tags intact. Seams verified.',
    amount: '$140.00',
    status: 'inspected',
    date: 'Apr 25, 2026',
    image: '/Shop_images/8/overshirt1-500x750.jpg'
  }
];

const DEFAULT_SHIPMENTS = [
  {
    id: 'SHP-101',
    orderId: '#ORD-1842',
    carrier: 'DHL Express',
    trackingId: 'FX28301948IN',
    customer: 'Priya Sharma',
    destination: 'Bangalore, India',
    lastScan: 'Out for delivery • Local courier van dispatch',
    scanTime: 'Apr 30, 2026 at 09:15 AM',
    estimatedDelivery: 'Today by 6:00 PM',
    status: 'out_for_delivery',
    escrowNote: 'Escrow releases 48h after POD'
  },
  {
    id: 'SHP-102',
    orderId: '#ORD-1840',
    carrier: 'FedEx International',
    trackingId: '784910294821',
    customer: 'David Chen',
    destination: 'Singapore',
    lastScan: 'Customs clearance completed • En route to distribution hub',
    scanTime: 'Apr 29, 2026 at 14:30 PM',
    estimatedDelivery: 'May 02, 2026',
    status: 'in_transit',
    escrowNote: 'Escrow releases 48h after POD'
  },
  {
    id: 'SHP-103',
    orderId: '#ORD-1843',
    carrier: 'DHL Express',
    trackingId: 'DHL928410291',
    customer: 'Sara Johnson',
    destination: 'London, UK',
    lastScan: 'Delivered - Proof of delivery signed by S. Johnson',
    scanTime: 'Apr 27, 2026 at 11:42 AM',
    estimatedDelivery: 'Delivered on Apr 27',
    status: 'delivered',
    escrowNote: 'Disbursed to JPMorgan Chase (•••• 4192)'
  }
];

export default function OrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('all');
  const [orders, setOrders] = useState(DEFAULT_ORDERS);
  const [returns, setReturns] = useState(DEFAULT_RETURNS);
  const [shipments, setShipments] = useState(DEFAULT_SHIPMENTS);
  const [search, setSearch] = useState('');

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fulfillOrder, setFulfillOrder] = useState(null);
  const [reviewReturn, setReviewReturn] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync with URL query parameter (?filter=returns, ?filter=tracking)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam === 'returns') {
      setActiveView('returns');
    } else if (filterParam === 'tracking') {
      setActiveView('tracking');
    } else {
      setActiveView('all');
    }
  }, [location.search]);

  // Load orders from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vogue_social_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = parsed.map((o) => ({
            id: o.id?.startsWith('#') ? o.id : `#${o.id || 'ORD-1001'}`,
            product: (o.productName || o.product || 'Tailored Silk Blouse').replace(/Atelier\s*/gi, 'Tailored '),
            customer: o.customer?.full_name || o.customer || 'Customer',
            email: o.customer?.email || o.email || 'customer@mail.com',
            amount: o.amount ? (String(o.amount).startsWith('$') ? o.amount : `$${parseFloat(o.amount).toFixed(2)}`) : '$49.00',
            payment_status: o.payment_status || 'paid',
            fulfillment_status: o.fulfillment_status || o.status || 'unfulfilled',
            trackingId: o.tracking_number || o.trackingId || '',
            carrier: o.courier || o.carrier || 'DHL Express',
            date: o.created_at
              ? new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : (o.date || 'Apr 29, 2026'),
            size: o.size || 'M',
            qty: o.qty || 1,
            address: o.shipping_address?.address || o.address || '14 Green St, Dubai, UAE',
            channel: o.channel || 'Online Store',
            image: o.image || '/Shop_images/1/basic2-500x750.jpeg'
          }));
          setOrders(merged);
        }
      }
    } catch (e) {
      console.warn('Could not load orders from localStorage:', e);
    }
  }, []);

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'returns') {
      navigate('/merchant/orders?filter=returns');
    } else if (view === 'tracking') {
      navigate('/merchant/orders?filter=tracking');
    } else {
      navigate('/merchant/orders');
    }
  };

  const handleConfirmFulfill = ({ orderId, carrier, trackingNumber, notifyCustomer }) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          fulfillment_status: 'fulfilled',
          trackingId: trackingNumber,
          carrier
        };
      }
      return o;
    });

    setOrders(updated);
    try {
      localStorage.setItem('vogue_social_orders', JSON.stringify(updated));
    } catch (e) {}

    // Add to outbound shipments
    const newShipment = {
      id: `SHP-${Date.now().toString().slice(-4)}`,
      orderId,
      carrier,
      trackingId: trackingNumber,
      customer: orders.find((o) => o.id === orderId)?.customer || 'Customer',
      destination: orders.find((o) => o.id === orderId)?.address || 'Express Dispatch',
      lastScan: 'Package received by carrier • Dispatch scan',
      scanTime: 'Just now',
      estimatedDelivery: 'In 2-3 business days',
      status: 'in_transit',
      escrowNote: 'Escrow releases 48h after delivery scan'
    };

    setShipments((prev) => [newShipment, ...prev]);
    showToast(`Order ${orderId} marked as fulfilled via ${carrier}. Tracking saved!`, 'success');
  };

  const handleApproveReturn = (rmaId) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === rmaId ? { ...r, status: 'in_transit' } : r))
    );
    showToast(`Return ${rmaId} approved! Prepaid shipping label sent to customer.`, 'success');
  };

  const handleDeclineReturn = (rmaId, reason) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === rmaId ? { ...r, status: 'declined', declineReason: reason } : r))
    );
    showToast(`Return ${rmaId} declined. Customer notified of policy justification.`, 'info');
  };

  const handleRefundReturn = (rmaId, restock) => {
    setReturns((prev) =>
      prev.map((r) => (r.id === rmaId ? { ...r, status: 'refunded' } : r))
    );
    showToast(`Return ${rmaId} finalized. Refund released & inventory ${restock ? 'restocked' : 'archived'}.`, 'success');
  };

  const handleExportCsv = () => {
    let rows = [];
    if (activeView === 'returns') {
      rows = [
        ['RMA ID', 'Order ID', 'Customer', 'Product', 'Reason', 'Amount', 'Status'],
        ...returns.map((r) => [r.id, r.orderId, r.customer, r.product, r.reason, r.amount, r.status])
      ];
    } else if (activeView === 'tracking') {
      rows = [
        ['Order ID', 'Carrier', 'Tracking ID', 'Customer', 'Destination', 'Status'],
        ...shipments.map((s) => [s.orderId, s.carrier, s.trackingId, s.customer, s.destination, s.status])
      ];
    } else {
      rows = [
        ['Order ID', 'Date', 'Customer', 'Email', 'Product', 'Total', 'Payment', 'Fulfillment'],
        ...orders.map((o) => [o.id, o.date, o.customer, o.email, o.product, o.amount, o.payment_status, o.fulfillment_status])
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `voguesocial_${activeView}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${activeView} data to CSV.`, 'info');
  };

  // Search filtering
  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q)
    );
  });

  const filteredReturns = returns.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.orderId.toLowerCase().includes(q) ||
      r.customer.toLowerCase().includes(q) ||
      r.product.toLowerCase().includes(q) ||
      r.reason.toLowerCase().includes(q)
    );
  });

  const filteredShipments = shipments.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.orderId.toLowerCase().includes(q) ||
      s.trackingId.toLowerCase().includes(q) ||
      s.customer.toLowerCase().includes(q) ||
      s.carrier.toLowerCase().includes(q)
    );
  });

  return (
    <div className="orders-shell">
      <div className="orders-container">
        {/* Header with Title, Search, and View Tabs */}
        <OrdersHeader
          activeView={activeView}
          onViewChange={handleViewChange}
          search={search}
          onSearchChange={setSearch}
          counts={{
            all: orders.length,
            returns: returns.length,
            tracking: shipments.length
          }}
          onExportCsv={handleExportCsv}
        />

        {/* 4 Contextual Metric Cards */}
        <OrdersKPICards
          activeView={activeView}
          orders={orders}
          returns={returns}
          shipments={shipments}
        />

        {/* Dynamic Table View */}
        {activeView === 'all' && (
          <AllOrdersTable
            orders={filteredOrders}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
            onOpenFulfill={(ord) => setFulfillOrder(ord)}
          />
        )}

        {activeView === 'returns' && (
          <ReturnsTable
            returns={filteredReturns}
            onReviewReturn={(ret) => setReviewReturn(ret)}
            onSelectOrder={(ord) => setSelectedOrder(ord)}
          />
        )}

        {activeView === 'tracking' && (
          <OrderTrackingTable
            shipments={filteredShipments}
            onSelectOrder={(shp) => {
              const matchedOrder = orders.find((o) => o.id === shp.orderId);
              setSelectedOrder(matchedOrder || {
                id: shp.orderId,
                customer: shp.customer,
                date: 'Apr 28, 2026',
                amount: '$129.00',
                product: 'Structured Wool Signature Overshirt',
                payment_status: 'paid',
                fulfillment_status: 'fulfilled',
                trackingId: shp.trackingId,
                carrier: shp.carrier,
                address: shp.destination
              });
            }}
          />
        )}

        {/* Modals */}
        <FulfillOrderModal
          isOpen={!!fulfillOrder}
          order={fulfillOrder}
          onClose={() => setFulfillOrder(null)}
          onConfirmFulfill={handleConfirmFulfill}
        />

        <ReturnReviewModal
          isOpen={!!reviewReturn}
          returnItem={reviewReturn}
          onClose={() => setReviewReturn(null)}
          onApproveReturn={handleApproveReturn}
          onDeclineReturn={handleDeclineReturn}
          onRefundReturn={handleRefundReturn}
        />

        <OrderDetailsModal
          isOpen={!!selectedOrder}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOpenFulfill={(ord) => setFulfillOrder(ord)}
        />

        {/* Toast Alert */}
        {toast && (
          <div className={`orders-toast orders-toast-${toast.type || 'success'}`}>
            <span>{toast.type === 'error' ? '⚠️' : toast.type === 'info' ? 'ℹ️' : '✓'}</span>
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
