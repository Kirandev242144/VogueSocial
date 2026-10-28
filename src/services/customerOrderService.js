/**
 * Customer Order & Address Service
 * Manages customer order history, live carrier tracking, RMA returns, and saved shipping addresses.
 * Fully synced with localStorage and interoperable with merchant and escrow systems.
 */

const CUSTOMER_ORDERS_STORAGE_KEY = 'vogue_customer_orders_v1';
const CUSTOMER_ADDRESSES_STORAGE_KEY = 'vogue_customer_addresses_v1';
const MERCHANT_ORDERS_STORAGE_KEY = 'vogue_social_orders';

// Initial realistic customer orders
const INITIAL_CUSTOMER_ORDERS = [
  {
    id: '#VS-ORD-9418',
    date: 'Apr 28, 2026',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_transit', // 'processing' | 'in_transit' | 'delivered' | 'returned' | 'disputed'
    escrowStatus: 'held', // 'held' | 'released' | 'frozen' | 'refunded'
    escrowNote: 'Secured in VogueSocial Escrow • Auto-releases 48h after delivery',
    carrier: 'DHL Express',
    trackingNumber: 'VS-DHL-89214IN',
    estimatedDelivery: 'Tomorrow by 5:00 PM',
    shippingAddress: {
      fullName: 'John Miller',
      street: '456 Vogue Boulevard, Suite 4B',
      city: 'New York',
      state: 'NY',
      zip: '10012',
      country: 'United States',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        id: 'prod_sl_001',
        name: 'Tailored Silk Blouse',
        brand: 'Studio Label Paris',
        price: 49.00,
        priceDisplay: '$49.00',
        size: 'M',
        quantity: 1,
        image: '/Shop_images/5/knotted1-500x750.jpeg'
      }
    ],
    subtotal: 49.00,
    shippingFee: 0.00,
    tax: 4.16,
    total: 53.16,
    timeline: [
      { status: 'Order Confirmed', time: 'Apr 28, 2026, 10:14 AM', completed: true, desc: 'Payment authorized and order confirmed.' },
      { status: 'Dispatched by Designer', time: 'Apr 28, 2026, 3:30 PM', completed: true, desc: 'Studio Label Paris prepared and packaged the garment.' },
      { status: 'Carrier Picked Up', time: 'Apr 28, 2026, 6:45 PM', completed: true, desc: 'DHL Express international sorting facility departure.' },
      { status: 'In Transit & Customs Cleared', time: 'Apr 29, 2026, 8:20 AM', completed: true, desc: 'Processed through local logistics gateway.' },
      { status: 'Out for Delivery', time: 'Pending', completed: false, desc: 'Local courier van dispatch scheduled.' },
      { status: 'Delivered', time: 'Pending', completed: false, desc: 'Signature confirmation required upon delivery.' }
    ]
  },
  {
    id: '#VS-ORD-8821',
    date: 'Apr 22, 2026',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    escrowStatus: 'released',
    escrowNote: 'Disbursed to Merchant • 48-hour inspection window closed without claim',
    carrier: 'FedEx Express Priority',
    trackingNumber: 'FX-28301948US',
    deliveredAt: 'Apr 24, 2026, 11:22 AM',
    proofOfDelivery: {
      signedBy: 'J. Miller',
      timestamp: 'Apr 24, 2026, 11:22 AM',
      location: 'Front Door / Concierge Reception'
    },
    shippingAddress: {
      fullName: 'John Miller',
      street: '456 Vogue Boulevard, Suite 4B',
      city: 'New York',
      state: 'NY',
      zip: '10012',
      country: 'United States',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        id: 'prod_sl_002',
        name: 'Structured Wool Signature Overshirt',
        brand: 'Studio Label Paris',
        price: 129.00,
        priceDisplay: '$129.00',
        size: 'L',
        quantity: 1,
        image: '/Shop_images/8/overshirt1-500x750.jpg'
      }
    ],
    subtotal: 129.00,
    shippingFee: 0.00,
    tax: 10.96,
    total: 139.96,
    timeline: [
      { status: 'Order Confirmed', time: 'Apr 22, 2026, 09:12 AM', completed: true, desc: 'Payment authorized and verified.' },
      { status: 'Dispatched by Designer', time: 'Apr 22, 2026, 01:45 PM', completed: true, desc: 'Custom garment packaging completed.' },
      { status: 'Carrier Picked Up', time: 'Apr 22, 2026, 04:30 PM', completed: true, desc: 'FedEx terminal scanned.' },
      { status: 'In Transit', time: 'Apr 23, 2026, 07:15 AM', completed: true, desc: 'En route to New York delivery station.' },
      { status: 'Out for Delivery', time: 'Apr 24, 2026, 08:30 AM', completed: true, desc: 'Courier van dispatched.' },
      { status: 'Delivered', time: 'Apr 24, 2026, 11:22 AM', completed: true, desc: 'Signed by J. Miller.' }
    ]
  },
  {
    id: '#VS-ORD-7712',
    date: 'Apr 14, 2026',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'returned',
    escrowStatus: 'refunded',
    escrowNote: 'Refund issued to customer card • Return inspection passed',
    rmaId: 'RMA-9021',
    returnReason: 'Size Too Small (Fit Issue)',
    returnStatus: 'Refunded',
    carrier: 'DHL Express Return',
    trackingNumber: 'DHL-RET-901842',
    shippingAddress: {
      fullName: 'John Miller',
      street: '456 Vogue Boulevard, Suite 4B',
      city: 'New York',
      state: 'NY',
      zip: '10012',
      country: 'United States',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        id: 'prod_sl_003',
        name: 'Silk Wrap Evening Dress',
        brand: 'Elena Couture',
        price: 89.00,
        priceDisplay: '$89.00',
        size: 'S',
        quantity: 1,
        image: '/Shop_images/1/basic2-500x750.jpeg'
      }
    ],
    subtotal: 89.00,
    shippingFee: 0.00,
    tax: 7.56,
    total: 96.56,
    timeline: [
      { status: 'Order Placed', time: 'Apr 14, 2026', completed: true, desc: 'Payment secured.' },
      { status: 'Delivered', time: 'Apr 16, 2026', completed: true, desc: 'Delivered to customer.' },
      { status: 'RMA Return Requested', time: 'Apr 17, 2026', completed: true, desc: 'Customer reported fit issue.' },
      { status: 'Return Received & Inspected', time: 'Apr 19, 2026', completed: true, desc: 'Tags and seams verified intact.' },
      { status: 'Full Refund Processed', time: 'Apr 20, 2026', completed: true, desc: '$96.56 credited back to original payment method.' }
    ]
  }
];

// Initial realistic customer saved addresses
const INITIAL_CUSTOMER_ADDRESSES = [
  {
    id: 'addr_default_1',
    tag: 'Home',
    isDefault: true,
    fullName: 'John Miller',
    street: '456 Vogue Boulevard',
    apartment: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10012',
    country: 'United States',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'addr_office_2',
    tag: 'Design Studio / Office',
    isDefault: false,
    fullName: 'John Miller',
    street: '742 Broadway Avenue',
    apartment: 'Floor 8, Studio C',
    city: 'New York',
    state: 'NY',
    zip: '10003',
    country: 'United States',
    phone: '+1 (555) 987-6543'
  }
];

export const customerOrderService = {
  /**
   * Get all customer orders
   */
  getCustomerOrders: () => {
    try {
      const stored = localStorage.getItem(CUSTOMER_ORDERS_STORAGE_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitize any lingering escrow text from customer-facing timeline
          const sanitized = parsed.map(o => ({
            ...o,
            timeline: (o.timeline || []).map(t => ({
              ...t,
              status: t.status.replace(/\s*&\s*Escrow Locked/gi, '').replace(/\s*&\s*Escrow Released/gi, ''),
              desc: t.desc
                .replace(/Payment secured via Stripe escrow lockbox\./gi, 'Payment authorized and order confirmed.')
                .replace(/Stripe escrow hold active\./gi, 'Payment authorized and verified.')
                .replace(/Escrow lockbox unreserved\./gi, 'Refund issued.')
                .replace(/to trigger 48-hour inspection window/gi, 'upon delivery')
            }))
          }));
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Error reading customer orders:', e);
    }
    // Initialize with seed orders
    localStorage.setItem(CUSTOMER_ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMER_ORDERS));
    return INITIAL_CUSTOMER_ORDERS;
  },

  /**
   * Create and persist a newly placed order from Cart or Buy Now
   */
  createCustomerOrder: (orderPayload) => {
    const orders = customerOrderService.getCustomerOrders();

    const orderId = orderPayload.id || `#VS-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNum = `VS-DHL-${Math.floor(100000 + Math.random() * 900000)}US`;

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      status: 'processing',
      escrowStatus: 'held',
      escrowNote: 'Secured in VogueSocial Escrow • Auto-releases 48h after delivery',
      carrier: 'DHL Express',
      trackingNumber: trackingNum,
      estimatedDelivery: '2-4 business days (Insured Express)',
      shippingAddress: orderPayload.shippingAddress || {
        fullName: orderPayload.customerName || 'John Miller',
        street: orderPayload.address || '456 Vogue Boulevard',
        apartment: orderPayload.apartment || '',
        city: orderPayload.city || 'New York',
        state: orderPayload.state || 'NY',
        zip: orderPayload.zip || '10012',
        country: orderPayload.country || 'United States',
        phone: orderPayload.phone || '+1 (555) 234-5678'
      },
      items: orderPayload.items || [
        {
          id: orderPayload.productId || 'prod_gen',
          name: orderPayload.productName || 'Curated Fashion Garment',
          brand: orderPayload.brand || 'Vogue Verified Designer',
          price: typeof orderPayload.amount === 'number' ? orderPayload.amount : 75.00,
          priceDisplay: typeof orderPayload.amount === 'string' ? orderPayload.amount : `$${(orderPayload.amount || 75).toFixed(2)}`,
          size: orderPayload.size || 'M',
          quantity: orderPayload.quantity || 1,
          image: orderPayload.image || '/Shop_images/5/knotted1-500x750.jpeg'
        }
      ],
      subtotal: orderPayload.subtotal || orderPayload.amount || 75.00,
      shippingFee: orderPayload.shippingFee || 0.00,
      tax: parseFloat(((orderPayload.subtotal || orderPayload.amount || 75.00) * 0.08875).toFixed(2)),
      total: orderPayload.total || orderPayload.amount || 75.00,
      paymentMethod: orderPayload.paymentMethod || 'Visa •••• 4242 via Stripe',
      timeline: [
        { status: 'Order Confirmed', time: 'Just now', completed: true, desc: 'Payment authorized and order confirmed.' },
        { status: 'Dispatched by Designer', time: 'Pending', completed: false, desc: 'Designer will package your piece within 24-48 hours.' },
        { status: 'Carrier Picked Up', time: 'Pending', completed: false, desc: 'DHL Express terminal pickup and tracking scan.' },
        { status: 'In Transit', time: 'Pending', completed: false, desc: 'Fast priority domestic air transit.' },
        { status: 'Out for Delivery', time: 'Pending', completed: false, desc: 'Courier route dispatch.' },
        { status: 'Delivered', time: 'Pending', completed: false, desc: 'Physical delivery confirmation.' }
      ]
    };

    const updated = [newOrder, ...orders];
    localStorage.setItem(CUSTOMER_ORDERS_STORAGE_KEY, JSON.stringify(updated));

    // Also sync to merchant orders (vogue_social_orders)
    try {
      const merchantStored = localStorage.getItem(MERCHANT_ORDERS_STORAGE_KEY);
      const merchantList = merchantStored ? JSON.parse(merchantStored) : [];
      const merchantRecord = {
        id: orderId,
        product: newOrder.items[0]?.name || 'Fashion Garment',
        customer: newOrder.shippingAddress.fullName || 'John Miller',
        email: orderPayload.customerEmail || 'john@voguesocial.com',
        amount: `$${newOrder.total.toFixed(2)}`,
        payment_status: 'paid',
        fulfillment_status: 'unfulfilled',
        trackingId: trackingNum,
        carrier: 'DHL Express',
        date: newOrder.date,
        size: newOrder.items[0]?.size || 'M',
        qty: newOrder.items.reduce((acc, it) => acc + (it.quantity || 1), 0),
        address: `${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city}, ${newOrder.shippingAddress.country}`,
        channel: 'Online Store',
        image: newOrder.items[0]?.image || '/Shop_images/5/knotted1-500x750.jpeg'
      };
      merchantList.unshift(merchantRecord);
      localStorage.setItem(MERCHANT_ORDERS_STORAGE_KEY, JSON.stringify(merchantList));
    } catch (e) {
      console.error('Error syncing order to merchant storage:', e);
    }

    return newOrder;
  },

  /**
   * Request a return (RMA) on a customer order
   */
  requestReturn: (orderId, { reason, note }) => {
    const orders = customerOrderService.getCustomerOrders();
    const rmaCode = `RMA-${Math.floor(1000 + Math.random() * 9000)}`;

    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'returned',
          rmaId: rmaCode,
          returnReason: reason || 'Customer Fit Issue',
          returnNote: note || '',
          returnStatus: 'Return Requested',
          escrowStatus: 'held',
          escrowNote: 'Escrow release frozen pending RMA physical receipt and verification',
          timeline: [
            ...ord.timeline,
            {
              status: `Return Requested (${rmaCode})`,
              time: 'Just now',
              completed: true,
              desc: `Reason: ${reason || 'Fit Issue'}. Complimentary return shipping label generated.`
            }
          ]
        };
      }
      return ord;
    });

    localStorage.setItem(CUSTOMER_ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, rmaId: rmaCode };
  },

  /**
   * Cancel an order (for processing orders before carrier pickup)
   */
  cancelOrder: (orderId, reason = 'Cancelled by Customer') => {
    const orders = customerOrderService.getCustomerOrders();

    const updated = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: 'cancelled',
          escrowStatus: 'refunded',
          escrowNote: 'Authorization voided • Escrow hold released immediately',
          cancelReason: reason,
          timeline: [
            ...ord.timeline,
            {
              status: 'Order Cancelled',
              time: 'Just now',
              completed: true,
              desc: `Order cancelled by shopper (${reason}). Full refund issued.`
            }
          ]
        };
      }
      return ord;
    });

    localStorage.setItem(CUSTOMER_ORDERS_STORAGE_KEY, JSON.stringify(updated));

    // Also sync cancellation to merchant orders
    try {
      const merchantStored = localStorage.getItem(MERCHANT_ORDERS_STORAGE_KEY);
      if (merchantStored) {
        const merchantList = JSON.parse(merchantStored);
        const updatedMerchant = merchantList.map(o => {
          if (o.id === orderId) {
            return { ...o, fulfillment_status: 'cancelled', payment_status: 'refunded' };
          }
          return o;
        });
        localStorage.setItem(MERCHANT_ORDERS_STORAGE_KEY, JSON.stringify(updatedMerchant));
      }
    } catch (e) {
      console.error('Error syncing order cancellation to merchant storage:', e);
    }

    return { success: true };
  },

  /**
   * Get all saved shipping addresses
   */
  getCustomerAddresses: () => {
    try {
      const stored = localStorage.getItem(CUSTOMER_ADDRESSES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading saved addresses:', e);
    }
    localStorage.setItem(CUSTOMER_ADDRESSES_STORAGE_KEY, JSON.stringify(INITIAL_CUSTOMER_ADDRESSES));
    return INITIAL_CUSTOMER_ADDRESSES;
  },

  /**
   * Save a new address or update an existing one
   */
  saveCustomerAddress: (addressData) => {
    const addresses = customerOrderService.getCustomerAddresses();

    let updated;
    if (addressData.id) {
      // Edit existing
      updated = addresses.map(addr => {
        if (addr.id === addressData.id) {
          return { ...addr, ...addressData };
        }
        // If this address is set to default, unset others
        if (addressData.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });
    } else {
      // Create new
      const newAddress = {
        ...addressData,
        id: `addr_${Date.now()}`
      };
      if (newAddress.isDefault || addresses.length === 0) {
        newAddress.isDefault = true;
        updated = [newAddress, ...addresses.map(a => ({ ...a, isDefault: false }))];
      } else {
        updated = [newAddress, ...addresses];
      }
    }

    localStorage.setItem(CUSTOMER_ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Delete an address
   */
  deleteCustomerAddress: (addressId) => {
    const addresses = customerOrderService.getCustomerAddresses();
    let updated = addresses.filter(a => a.id !== addressId);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    localStorage.setItem(CUSTOMER_ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Set address as primary default
   */
  setDefaultAddress: (addressId) => {
    const addresses = customerOrderService.getCustomerAddresses();
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));
    localStorage.setItem(CUSTOMER_ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  }
};
