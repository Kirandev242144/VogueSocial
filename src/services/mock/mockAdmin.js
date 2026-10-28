import { storageEngine } from './storageEngine';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { APP_CONFIG } from '../../constants/config';

const delay = (ms = APP_CONFIG.SIMULATED_NETWORK_DELAY_MS) => new Promise(res => setTimeout(res, ms));

const INITIAL_RUNPOD_JOBS = [
  { id: 'job-rp-91730', category: 'tops', gpuModel: 'NVIDIA RTX 4090', executionTime: 11.8, queueTime: 0.4, cost: 0.0026, status: 'COMPLETED', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'job-rp-91729', category: 'bottoms', gpuModel: 'NVIDIA RTX 4090', executionTime: 12.5, queueTime: 1.2, cost: 0.0028, status: 'COMPLETED', timestamp: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: 'job-rp-91728', category: 'tops', gpuModel: 'NVIDIA RTX 4090', executionTime: 14.1, queueTime: 2.5, cost: 0.0031, status: 'COMPLETED', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'job-rp-91727', category: 'one-pieces', gpuModel: 'NVIDIA RTX 4090', executionTime: 0.0, queueTime: 0.8, cost: 0.0001, status: 'FAILED', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 'job-rp-91726', category: 'tops', gpuModel: 'NVIDIA RTX 4090', executionTime: 11.2, queueTime: 0.3, cost: 0.0025, status: 'COMPLETED', timestamp: new Date(Date.now() - 60 * 60000).toISOString() }
];

const INITIAL_DISPUTES = [
  {
    id: 'disp-001',
    order_id: 'ORD-8241',
    reason: 'Damaged Item on Delivery',
    description: 'The tailored blazer arrived with a torn seam on the left lapel. Customer requested a full return reimbursement.',
    evidence_url: '/Shop_images/1/basic2-500x750.jpeg',
    status: 'open',
    admin_notes: '',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    merchant_response: 'Workshop inspection certificate submitted. Atelier confirms garment passed pre-dispatch QC with intact seams. Courier transit damage suspected.',
    order: {
      id: 'ORD-8241',
      amount: 590.00,
      currency: 'USD',
      created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
      customer: {
        full_name: 'Aisha Malik',
        email: 'aisha.m@voguesocial.com',
        phone: '+971 50 123 4567',
        shipping_address: { address: '14 Green St, Villa 4', city: 'Dubai', country: 'United Arab Emirates' }
      },
      vendor: {
        store_name: 'Studio Label Paris',
        store_handle: 'studiolabel',
        country: 'France'
      },
      items: [
        { id: 'gar-001', name: 'Structured Wool Atelier Blazer', sku: 'SLP-BLZ-001', size: 'M', color: 'Charcoal Noir', price: 590.00, qty: 1, image: '/Shop_images/1/basic2-500x750.jpeg' }
      ],
      payment: {
        provider: 'Stripe Connect',
        payment_intent_id: 'pi_3M9xV2K9QxVogueSocial01',
        payment_method: 'Visa •••• 4242',
        status: 'captured_under_dispute',
        funds_held: true
      },
      tracking: {
        carrier: 'DHL Express',
        tracking_number: 'DHL-84920194',
        status: 'Delivered',
        delivered_at: new Date(Date.now() - 36 * 3600000).toISOString(),
        signed_by: 'Aisha Malik',
        verification_status: 'verified_carrier_pod',
        events: [
          { timestamp: new Date(Date.now() - 36 * 3600000).toISOString(), location: 'Dubai, UAE', status: 'Delivered — Resident signature captured' },
          { timestamp: new Date(Date.now() - 44 * 3600000).toISOString(), location: 'Dubai Hub', status: 'Out for courier delivery' },
          { timestamp: new Date(Date.now() - 56 * 3600000).toISOString(), location: 'Dubai International Gateway', status: 'Customs cleared' },
          { timestamp: new Date(Date.now() - 70 * 3600000).toISOString(), location: 'Paris CDG Airport', status: 'Dispatched by merchant' }
        ]
      }
    },
    audit_history: [
      { timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), actor: 'Aisha Malik (Buyer)', action: 'Dispute Claim Filed', note: 'Customer initiated claim for damaged lapel seam with photo evidence.' },
      { timestamp: new Date(Date.now() - 14 * 3600000).toISOString(), actor: 'Studio Label Paris (Seller)', action: 'Seller Statement Received', note: 'Merchant provided pre-dispatch inspection records.' }
    ]
  },
  {
    id: 'disp-002',
    order_id: 'ORD-8240',
    reason: 'Delayed International Transit',
    description: 'Tracking status indicates shipment in customs clearance transit beyond estimated delivery window.',
    evidence_url: '',
    status: 'under_review',
    admin_notes: 'DHL Express tracking inquiry active with courier liaison.',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    merchant_response: 'Elena Couture submitted inquiry ticket #DHL-UK-91823 with European logistics desk. Carrier confirms parcel awaiting clearance.',
    order: {
      id: 'ORD-8240',
      amount: 145.00,
      currency: 'USD',
      created_at: new Date(Date.now() - 96 * 3600000).toISOString(),
      customer: {
        full_name: 'Riya Kapoor',
        email: 'riya.k@voguesocial.com',
        phone: '+44 7911 123456',
        shipping_address: { address: '5 Oak Avenue, Kensington', city: 'London', country: 'United Kingdom' }
      },
      vendor: {
        store_name: 'Elena Couture',
        store_handle: 'elenacouture',
        country: 'Italy'
      },
      items: [
        { id: 'gar-002', name: 'Silk Slip Cami Dress', sku: 'EC-DRS-002', size: 'S', color: 'Ivory Champagne', price: 145.00, qty: 1, image: '/Shop_images/2/cup1-500x750.jpeg' }
      ],
      payment: {
        provider: 'Stripe Connect',
        payment_intent_id: 'pi_3M9xV2K9QxVogueSocial02',
        payment_method: 'Mastercard •••• 8821',
        status: 'captured_pending_resolution',
        funds_held: true
      },
      tracking: {
        carrier: 'DHL Express',
        tracking_number: 'LP-99201834FR',
        status: 'In Transit (Customs Clearance)',
        delivered_at: null,
        signed_by: null,
        verification_status: 'in_transit_delayed',
        events: [
          { timestamp: new Date(Date.now() - 16 * 3600000).toISOString(), location: 'London Heathrow Hub', status: 'Customs inspection backlog scan' },
          { timestamp: new Date(Date.now() - 40 * 3600000).toISOString(), location: 'Milan Malpensa Airport', status: 'International linehaul departure' },
          { timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), location: 'Milan Center Hub', status: 'Parcel picked up from merchant' }
        ]
      }
    },
    audit_history: [
      { timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), actor: 'Riya Kapoor (Buyer)', action: 'Transit Delay Inquiry Filed', note: 'Customer reported non-receipt 4 days past delivery estimate.' },
      { timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), actor: 'Dispute Specialist', action: 'Case Marked Under Review', note: 'Contacted carrier European liaison for scan status update.' }
    ]
  },
  {
    id: 'disp-003',
    order_id: 'ORD-8238',
    reason: 'Incorrect Garment Size Dispatched',
    description: 'Customer ordered size M (38 FR) but received size XL (42 FR).',
    evidence_url: '/Shop_images/4/graphic1-500x750.jpg',
    status: 'resolved_refunded',
    admin_notes: 'Full refund of $320.00 processed to buyer. Return shipping prepaid by merchant.',
    created_at: new Date(Date.now() - 120 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    resolved_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    merchant_response: 'Merchant acknowledged warehouse packing tag error and authorized full refund.',
    order: {
      id: 'ORD-8238',
      amount: 320.00,
      currency: 'USD',
      created_at: new Date(Date.now() - 144 * 3600000).toISOString(),
      customer: {
        full_name: 'Priya Sharma',
        email: 'priya.s@voguesocial.com',
        phone: '+91 98201 12345',
        shipping_address: { address: '9 Park Lane, Worli', city: 'Mumbai', country: 'India' }
      },
      vendor: {
        store_name: 'Elena Couture',
        store_handle: 'elenacouture',
        country: 'Italy'
      },
      items: [
        { id: 'gar-004', name: 'Embroidered Silk Palazzo Set', sku: 'EC-PLZ-004', size: 'XL', color: 'Dusty Rose', price: 320.00, qty: 1, image: '/Shop_images/4/graphic1-500x750.jpg' }
      ],
      payment: {
        provider: 'Stripe Connect',
        payment_intent_id: 'pi_3M9xV2K9QxVogueSocial03',
        payment_method: 'Amex •••• 1004',
        status: 'refunded',
        funds_held: false
      },
      tracking: {
        carrier: 'FedEx Priority',
        tracking_number: 'FDX-7718294',
        status: 'Delivered',
        delivered_at: new Date(Date.now() - 48 * 3600000).toISOString(),
        signed_by: 'P. Sharma',
        verification_status: 'verified_carrier_pod',
        events: [
          { timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), location: 'Mumbai, India', status: 'Delivered — Signature captured' },
          { timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), location: 'Dubai International Hub', status: 'Transit clearance' }
        ]
      }
    },
    audit_history: [
      { timestamp: new Date(Date.now() - 120 * 3600000).toISOString(), actor: 'Priya Sharma (Buyer)', action: 'Incorrect Item Claim Filed', note: 'Customer uploaded photo of size XL tag on dress.' },
      { timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), actor: 'Platform Dispute Specialist', action: 'Full Refund Issued ($320.00)', note: 'Seller accepted responsibility; full refund processed back to buyer original card.' }
    ]
  }
];

const INITIAL_PLATFORM_ORDERS = [
  {
    id: 'ORD-8241',
    amount: 590.00,
    status: 'shipped',
    escrow_status: 'held',
    courier: 'DHL Express',
    tracking_number: 'DHL-84920194',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    customer: {
      full_name: 'Aisha Malik',
      email: 'aisha.m@voguesocial.com',
      shipping_address: { address: '14 Green St, Villa 4', city: 'Dubai', country: 'United Arab Emirates' }
    },
    vendor: {
      store_name: 'Studio Label Paris',
      store_handle: 'studiolabel',
      vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c'
    },
    items: [
      { id: 'gar-001', name: 'Structured Wool Atelier Blazer', size: 'M', color: 'Charcoal Noir', price: 590.00, qty: 1, image: '/Shop_images/1/basic2-500x750.jpeg' }
    ]
  },
  {
    id: 'ORD-8240',
    amount: 145.00,
    status: 'pending',
    escrow_status: 'held',
    courier: 'Awaiting Pickup',
    tracking_number: '',
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    customer: {
      full_name: 'Sara Johnson',
      email: 'sara.j@voguesocial.com',
      shipping_address: { address: '5 Oak Avenue, Kensington', city: 'London', country: 'United Kingdom' }
    },
    vendor: {
      store_name: 'Studio Label Paris',
      store_handle: 'studiolabel',
      vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c'
    },
    items: [
      { id: 'gar-002', name: 'Silk Slip Cami Dress', size: 'S', color: 'Ivory Champagne', price: 145.00, qty: 1, image: '/Shop_images/2/cup1-500x750.jpeg' }
    ]
  },
  {
    id: 'ORD-8239',
    amount: 420.00,
    status: 'delivered',
    escrow_status: 'released',
    courier: 'DHL Express',
    tracking_number: 'DHL-29401824',
    created_at: new Date(Date.now() - 25 * 3600000).toISOString(),
    released_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    customer: {
      full_name: 'Priya Sharma',
      email: 'priya.s@voguesocial.com',
      shipping_address: { address: '22 MG Road, Indiranagar', city: 'Bangalore', country: 'India' }
    },
    vendor: {
      store_name: 'Studio Label Paris',
      store_handle: 'studiolabel',
      vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c'
    },
    items: [
      { id: 'gar-003', name: 'Oversized Double-Faced Cashmere Trench', size: 'L', color: 'Camel Beige', price: 420.00, qty: 1, image: '/Shop_images/3/dressblack1-1-500x750.jpeg' }
    ],
    admin_notes: 'Automated escrow settlement: Carrier confirmed delivery signatures.'
  },
  {
    id: 'ORD-8238',
    amount: 320.00,
    status: 'cancelled',
    escrow_status: 'refunded',
    courier: 'FedEx Priority',
    tracking_number: 'FDX-7718294',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    refunded_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    customer: {
      full_name: 'Riya Kapoor',
      email: 'riya.k@voguesocial.com',
      shipping_address: { address: '9 Park Lane, Worli', city: 'Mumbai', country: 'India' }
    },
    vendor: {
      store_name: 'Elena Couture',
      store_handle: 'elenacouture',
      vendor_id: 'mch_elena_02'
    },
    items: [
      { id: 'gar-004', name: 'Embroidered Silk Palazzo Set', size: 'XL', color: 'Dusty Rose', price: 320.00, qty: 1, image: '/Shop_images/4/graphic1-500x750.jpg' }
    ],
    admin_notes: 'Order cancelled by buyer prior to dispatch. Full $320.00 refunded.'
  },
  {
    id: 'ORD-8237',
    amount: 850.00,
    status: 'shipped',
    escrow_status: 'held',
    courier: 'FedEx Express',
    tracking_number: 'FDX-8392019',
    created_at: new Date(Date.now() - 52 * 3600000).toISOString(),
    customer: {
      full_name: 'Fatima Al-Rashid',
      email: 'fatima@voguesocial.com',
      shipping_address: { address: 'Al Olaya District', city: 'Riyadh', country: 'Saudi Arabia' }
    },
    vendor: {
      store_name: 'Studio Label Paris',
      store_handle: 'studiolabel',
      vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c'
    },
    items: [
      { id: 'gar-005', name: 'Handcrafted Tuxedo Silk Dinner Jacket', size: '40R', color: 'Midnight Obsidian', price: 850.00, qty: 1, image: '/Shop_images/8/overshirt1-500x750.jpg' }
    ]
  },
  {
    id: 'ORD-8236',
    amount: 280.00,
    status: 'delivered',
    escrow_status: 'released',
    courier: 'La Poste Colissimo',
    tracking_number: 'LP-99201834FR',
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
    released_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    customer: {
      full_name: 'Chloe Dupont',
      email: 'chloe.d@voguesocial.com',
      shipping_address: { address: '18 Rue de Richelieu', city: 'Paris', country: 'France' }
    },
    vendor: {
      store_name: 'Elena Couture',
      store_handle: 'elenacouture',
      vendor_id: 'mch_elena_02'
    },
    items: [
      { id: 'gar-006', name: 'Pleated Organza Evening Blouse', size: '38 FR', color: 'Pearl White', price: 280.00, qty: 1, image: '/Shop_images/5/knotted1-500x750.jpeg' }
    ],
    admin_notes: 'Settled to vendor payout balance. 5% platform protocol fee retained.'
  },
  {
    id: 'ORD-8235',
    amount: 590.00,
    status: 'shipped',
    escrow_status: 'disputed',
    courier: 'DHL Express',
    tracking_number: 'DHL-4402911',
    created_at: new Date(Date.now() - 80 * 3600000).toISOString(),
    customer: {
      full_name: 'Aisha Malik',
      email: 'aisha.m@voguesocial.com',
      shipping_address: { address: '14 Green St, Villa 4', city: 'Dubai', country: 'United Arab Emirates' }
    },
    vendor: {
      store_name: 'Studio Label Paris',
      store_handle: 'studiolabel',
      vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c'
    },
    items: [
      { id: 'gar-007', name: 'Bespoke Atelier Tailored Suit', size: '38', color: 'Noir', price: 590.00, qty: 1, image: '/Shop_images/1/basic2-500x750.jpeg' }
    ],
    admin_notes: 'Under arbitration: disp-001 filed for damaged lapel seam. Funds frozen in vault.'
  },
  {
    id: 'ORD-8234',
    amount: 210.00,
    status: 'delivered',
    escrow_status: 'released',
    courier: 'UPS Worldwide',
    tracking_number: '1Z9999999999999999',
    created_at: new Date(Date.now() - 96 * 3600000).toISOString(),
    released_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    customer: {
      full_name: 'Marcus Vance',
      email: 'marcus.v@voguesocial.com',
      shipping_address: { address: '742 Evergreen Terrace', city: 'Springfield', country: 'United States' }
    },
    vendor: {
      store_name: 'Studio Label Paris',
      store_handle: 'studiolabel',
      vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c'
    },
    items: [
      { id: 'gar-008', name: 'Raw Denim Sculptural Jacket', size: 'L', color: 'Indigo', price: 210.00, qty: 1, image: '/Shop_images/9/pocketmen1-500x750.jpeg' }
    ],
    admin_notes: 'Settled.'
  }
];

function getUnifiedOrders() {
  let stored = storageEngine.getItem(STORAGE_KEYS.ORDERS, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    stored = [...INITIAL_PLATFORM_ORDERS];
    storageEngine.setItem(STORAGE_KEYS.ORDERS, stored);
  }

  // Auto-heal any stale or broken image paths in previously cached orders
  const IMAGE_FIX_MAP = {
    '/Shop_images/2/basic3-500x750.jpeg': '/Shop_images/2/cup1-500x750.jpeg',
    '/Shop_images/3/basic-500x750.jpeg': '/Shop_images/3/dressblack1-1-500x750.jpeg',
    '/Shop_images/4/basic2-500x750.jpeg': '/Shop_images/4/graphic1-500x750.jpg',
  };
  let healedAny = false;
  stored = stored.map(o => {
    if (!Array.isArray(o.items)) return o;
    const healedItems = o.items.map(it => {
      if (IMAGE_FIX_MAP[it.image]) {
        healedAny = true;
        return { ...it, image: IMAGE_FIX_MAP[it.image] };
      }
      return it;
    });
    return { ...o, items: healedItems };
  });

  if (healedAny) {
    storageEngine.setItem(STORAGE_KEYS.ORDERS, stored);
  }

  // Sync any customer checkout orders from localStorage key 'vogue_social_orders'
  try {
    const rawSocial = localStorage.getItem('vogue_social_orders');
    if (rawSocial) {
      const socialOrders = JSON.parse(rawSocial);
      if (Array.isArray(socialOrders)) {
        socialOrders.forEach(so => {
          const cleanId = (so.id || '').replace(/^#/, '');
          const existingIdx = stored.findIndex(o => o.id === cleanId || o.id === so.id);
          if (existingIdx === -1) {
            stored.unshift({
              id: cleanId.startsWith('ORD-') ? cleanId : `ORD-${cleanId}`,
              amount: parseFloat(so.amount) || 290.00,
              status: so.status || 'pending',
              escrow_status: so.escrow_status || 'held',
              courier: so.courier || 'DHL Express',
              tracking_number: so.tracking_number || '',
              created_at: so.created_at || new Date().toISOString(),
              customer: so.customer || { full_name: 'Shopper', email: 'shopper@voguesocial.com' },
              vendor: so.vendor || { store_name: 'Studio Label Paris', store_handle: 'studiolabel' },
              items: so.items || [
                {
                  id: so.productId || 'item-new',
                  name: so.productName || 'Curated Atelier Garment',
                  size: so.size || 'M',
                  color: so.color || 'Noir',
                  price: parseFloat(so.amount) || 290.00,
                  qty: so.qty || 1,
                  image: so.image || '/Shop_images/1/basic2-500x750.jpeg'
                }
              ],
              shipping_address: so.shippingAddress || { address: '12 Boulevard Saint-Germain', city: 'Paris', country: 'France' },
              admin_notes: so.admin_notes || ''
            });
          }
        });
        storageEngine.setItem(STORAGE_KEYS.ORDERS, stored);
      }
    }
  } catch (e) {
    console.error('Error syncing vogue_social_orders:', e);
  }

  return stored;
}

export const mockAdminAdapter = {
  async getDashboardStats() {
    await delay();
    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    const products = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const disputes = storageEngine.getItem(STORAGE_KEYS.ADMIN_DISPUTES, INITIAL_DISPUTES);
    const allOrders = getUnifiedOrders();

    let totalVolume = 0;
    let escrowHeld = 0;
    let commissionEarned = 0;

    allOrders.forEach(o => {
      totalVolume += o.amount;
      if (o.escrow_status === 'held') escrowHeld += o.amount;
      if (o.escrow_status === 'released') commissionEarned += (o.amount * 0.05);
    });

    return {
      success: true,
      stats: {
        totalVolume: parseFloat(totalVolume.toFixed(2)),
        escrowHeld: parseFloat(escrowHeld.toFixed(2)),
        commissionEarned: parseFloat(commissionEarned.toFixed(2)),
        activeVendors: Math.max(stores.length, 2),
        totalProducts: products.length,
        openDisputes: disputes.filter(d => d.status === 'open' || d.status === 'under_review').length
      },
      recentOrders: allOrders.slice(0, 5)
    };
  },

  async getProducts(filter = 'all', search = '') {
    await delay();
    let allProducts = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);

    if (!stores || stores.length === 0 || !stores[0]?.store_name) {
      stores = INITIAL_VENDORS_DATA;
    }

    if (!allProducts || allProducts.length === 0) {
      allProducts = SEED_PRODUCTS;
      storageEngine.setItem(STORAGE_KEYS.PRODUCTS, allProducts);
    }

    const vendorMap = {};
    stores.forEach(s => {
      const vid = s.vendor_id || s.vendorId || s.id;
      if (vid) vendorMap[vid] = s;
      if (s.id) vendorMap[s.id] = s;
      if (s.store_handle) vendorMap[s.store_handle] = s;
    });

    const enriched = allProducts.map(p => {
      const rawVendor = p.vendor || {};
      const foundVendor = vendorMap[p.vendorId || p.vendor_id || p.vendor?.vendor_id || p.vendor?.id] || {};
      
      const storeName = foundVendor.store_name || foundVendor.storeName || rawVendor.store_name || (p.vendorId === 'mch_elena_02' ? 'Elena Couture' : 'Studio Label Paris');
      const storeHandle = foundVendor.store_handle || foundVendor.storeHandle || rawVendor.store_handle || (p.vendorId === 'mch_elena_02' ? 'elenacouture' : 'studiolabel');
      const vendorId = foundVendor.vendor_id || foundVendor.id || p.vendorId || 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';
      const country = foundVendor.country || 'France';

      return {
        ...p,
        status: p.status || 'live',
        vendorId,
        vendor: {
          id: vendorId,
          vendor_id: vendorId,
          store_name: storeName,
          store_handle: storeHandle,
          country
        }
      };
    });

    const filtered = enriched.filter(p => {
      const name = (p.name || '').toLowerCase();
      const sku = (p.sku || '').toLowerCase();
      const vendorName = (p.vendor?.store_name || '').toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || sku.includes(q) || vendorName.includes(q);
      const matchesFilter = filter === 'all' || p.status === filter;
      return matchesSearch && matchesFilter;
    });

    return {
      success: true,
      count: filtered.length,
      products: filtered
    };
  },

  async updateProductStatus(productId, action, decisionData = '') {
    await delay();
    const allProducts = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const idx = allProducts.findIndex(p => p.id === productId);

    if (idx === -1) {
      return { success: false, error: 'Product not found' };
    }

    const isString = typeof decisionData === 'string';
    const internalNotes = isString ? decisionData : (decisionData.internalNotes || decisionData.admin_notes || '');
    const merchantFeedback = !isString ? (decisionData.merchantFeedback || '') : '';
    const rejectionReason = !isString ? (decisionData.rejectionReason || '') : '';
    const checklistResults = !isString ? (decisionData.checklist || null) : null;
    const reviewerName = !isString ? (decisionData.reviewerName || 'Senior Catalog Auditor') : 'Senior Catalog Auditor';

    let nextStatus = 'live';
    if (action === 'approve') nextStatus = 'live';
    else if (action === 'reject') nextStatus = 'rejected';
    else if (action === 'request_changes') nextStatus = 'changes_requested';
    else if (action === 'pending') nextStatus = 'pending_approval';
    else if (action === 'delist') nextStatus = 'changes_requested';

    allProducts[idx] = {
      ...allProducts[idx],
      status: nextStatus,
      admin_notes: internalNotes || allProducts[idx].admin_notes,
      internal_notes: internalNotes || allProducts[idx].internal_notes,
      merchant_feedback: merchantFeedback || allProducts[idx].merchant_feedback,
      rejection_reason: rejectionReason || allProducts[idx].rejection_reason,
      checklist_results: checklistResults || allProducts[idx].checklist_results,
      reviewed_by: reviewerName,
      reviewed_at: new Date().toISOString()
    };

    storageEngine.setItem(STORAGE_KEYS.PRODUCTS, allProducts);

    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const store = (stores || []).find(s => (s.vendor_id === allProducts[idx].vendorId || s.id === allProducts[idx].vendorId)) || {};
    const enrichedProduct = {
      ...allProducts[idx],
      vendor: {
        id: allProducts[idx].vendorId,
        vendor_id: allProducts[idx].vendorId,
        store_name: store.store_name || allProducts[idx].vendor?.store_name || 'Studio Label Paris',
        store_handle: store.store_handle || allProducts[idx].vendor?.store_handle || 'studiolabel',
        country: store.country || 'France'
      }
    };

    return {
      success: true,
      status: nextStatus,
      product: enrichedProduct
    };
  },

  async getVendors(filter = 'all', search = '') {
    await delay();
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    const products = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);

    // Ensure initial vendors exist without erasing newly registered merchants
    if (!stores || stores.length === 0) {
      stores = INITIAL_VENDORS_DATA;
      storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    } else {
      const existingIds = new Set(stores.map(s => s.vendor_id || s.vendorId || s.id));
      const missingInitial = INITIAL_VENDORS_DATA.filter(init => !existingIds.has(init.id));
      if (missingInitial.length > 0) {
        stores = [...stores, ...missingInitial];
        storageEngine.setItem(STORAGE_KEYS.STORES, stores);
      }
    }

    const enriched = stores.map(s => {
      const vid = s.vendor_id || s.vendorId || s.id;
      const count = products.filter(p => (p.vendorId === vid || p.vendor_id === vid)).length;
      return {
        ...s,
        id: vid,
        store_name: s.store_name || s.storeName || 'Merchant Storefront',
        store_handle: s.store_handle || s.storeHandle || 'studiolabel',
        email: s.email || 'vendor@voguesocial.com',
        vendor_status: s.vendor_status || 'approved',
        products_count: s.products_count !== undefined ? s.products_count : count,
        created_at: s.created_at || '2026-08-01T00:00:00Z'
      };
    });

    const filtered = enriched.filter(v => {
      const name = (v.store_name || '').toLowerCase();
      const legal = (v.legal_business_name || '').toLowerCase();
      const email = (v.email || '').toLowerCase();
      const handle = (v.store_handle || '').toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || legal.includes(q) || email.includes(q) || handle.includes(q);
      
      let matchesFilter = true;
      if (filter === 'all') matchesFilter = true;
      else if (filter === 'approved') matchesFilter = v.vendor_status === 'approved';
      else if (filter === 'pending_approval') matchesFilter = v.vendor_status === 'pending_approval';
      else if (filter === 'changes_requested') matchesFilter = v.vendor_status === 'changes_requested';
      else if (filter === 'suspended') matchesFilter = v.vendor_status === 'suspended';
      else matchesFilter = v.vendor_status === filter;

      return matchesSearch && matchesFilter;
    });

    return {
      success: true,
      count: filtered.length,
      vendors: filtered
    };
  },

  async getVendorById(vendorId) {
    await delay();
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    if (!stores || stores.length < 6 || !stores[0]?.marketplace_agreement) {
      stores = INITIAL_VENDORS_DATA;
      storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    }
    const vendor = stores.find(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));
    if (!vendor) {
      return { success: false, error: 'Merchant not found' };
    }
    return {
      success: true,
      vendor
    };
  },

  async updateVendorBusinessInfo(vendorId, businessData) {
    await delay(300);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));
    if (idx === -1) {
      return { success: false, error: 'Vendor not found' };
    }

    const isNowSoleProprietor = Boolean(
      (businessData.business_type || '').toLowerCase().includes('sole') ||
      (businessData.business_type || '').toLowerCase().includes('individual') ||
      (businessData.business_type || '').toLowerCase().includes('auto-entrepreneur')
    );

    let docs = stores[idx].documents || [];
    if (isNowSoleProprietor) {
      docs = docs.map(d => {
        if (d.type === 'incorporation' && d.status !== 'verified') {
          return {
            ...d,
            status: 'na',
            notes: 'Not Applicable: Merchant operates as Sole Proprietorship / Individual entity (Exempt from corporate charter).'
          };
        }
        return d;
      });
    }

    stores[idx] = {
      ...stores[idx],
      legal_business_name: businessData.legal_business_name || stores[idx].legal_business_name,
      business_type: businessData.business_type || stores[idx].business_type,
      tax_id: businessData.tax_id || stores[idx].tax_id,
      registration_number: businessData.registration_number || stores[idx].registration_number,
      phone: businessData.phone || stores[idx].phone,
      country: businessData.country || stores[idx].country,
      documents: docs,
      legal_address: {
        ...(stores[idx].legal_address || {}),
        ...(businessData.legal_address || {})
      },
      return_warehouse_address: {
        ...(stores[idx].return_warehouse_address || {}),
        ...(businessData.return_warehouse_address || {})
      },
      representative: {
        ...(stores[idx].representative || {}),
        ...(businessData.representative || {})
      },
      updated_at: new Date().toISOString()
    };

    storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    return {
      success: true,
      vendor: stores[idx]
    };
  },

  async updateVendorDocumentStatus(vendorId, docId, status, notes = '', adminName = 'Compliance Reviewer') {
    await delay(250);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));
    if (idx === -1) return { success: false, error: 'Vendor not found' };

    const docs = stores[idx].documents || [];
    const dIdx = docs.findIndex(d => d.id === docId);
    if (dIdx !== -1) {
      const docTitle = docs[dIdx].title;
      docs[dIdx] = {
        ...docs[dIdx],
        status,
        notes: notes || docs[dIdx].notes,
        verified_at: status === 'verified' ? new Date().toISOString() : docs[dIdx].verified_at,
        reviewed_by: adminName
      };

      let actionLabel = `Document Status Updated: ${docTitle} (${status})`;
      if (status === 'verified') actionLabel = `Document Approved: ${docTitle}`;
      else if (status === 'rejected') actionLabel = `Document Rejected: ${docTitle}`;
      else if (status === 'na') actionLabel = `Document Marked N/A: ${docTitle}`;
      else if (status === 'required') actionLabel = `Document Action Requested: ${docTitle}`;

      const auditEntry = {
        id: 'aud_' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toISOString(),
        actor: adminName,
        action: actionLabel,
        note: notes || (status === 'verified' ? 'Document verified against compliance standards.' : (status === 'na' ? 'Marked Not Applicable for this business entity structure.' : 'Document updated.'))
      };

      const allVerified = docs.every(d => d.status === 'verified' || d.status === 'na');
      const anyRejected = docs.some(d => d.status === 'rejected');
      let nextKyb = 'verified';
      if (anyRejected) nextKyb = 'documents_required';
      else if (!allVerified) nextKyb = 'pending_documents';

      stores[idx] = {
        ...stores[idx],
        documents: docs,
        kyb_status: nextKyb,
        audit_trail: [auditEntry, ...(stores[idx].audit_trail || [])],
        updated_at: new Date().toISOString()
      };
      storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    }

    return {
      success: true,
      vendor: stores[idx]
    };
  },

  async placeVendorPayoutHold(vendorId, { category, reason, adminName = 'Platform Root Admin' }) {
    await delay(300);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));
    if (idx === -1) return { success: false, error: 'Vendor not found' };

    const holdObj = {
      active: true,
      category: category || 'Administrative Compliance Review',
      reason: reason || 'Payout hold placed pending review.',
      placed_by: adminName,
      placed_at: new Date().toISOString()
    };

    const auditEntry = {
      id: 'aud_' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      actor: adminName,
      action: 'Administrative Payout Hold Placed',
      note: `Category: ${holdObj.category} • Reason: ${holdObj.reason}`
    };

    stores[idx] = {
      ...stores[idx],
      payout_eligibility: 'administrative_hold',
      payout_hold_details: holdObj,
      audit_trail: [auditEntry, ...(stores[idx].audit_trail || [])],
      updated_at: new Date().toISOString()
    };
    storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    return { success: true, vendor: stores[idx] };
  },

  async releaseVendorPayoutHold(vendorId, { note = '', adminName = 'Platform Root Admin' }) {
    await delay(300);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));
    if (idx === -1) return { success: false, error: 'Vendor not found' };

    const auditEntry = {
      id: 'aud_' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      actor: adminName,
      action: 'Administrative Payout Hold Released',
      note: note || 'Compliance audit resolved. Rolling payouts resumed.'
    };

    stores[idx] = {
      ...stores[idx],
      payout_eligibility: 'eligible',
      payout_hold_details: null,
      audit_trail: [auditEntry, ...(stores[idx].audit_trail || [])],
      updated_at: new Date().toISOString()
    };
    storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    return { success: true, vendor: stores[idx] };
  },

  async updateVendorAgreementRate(vendorId, { newRate, reason, effectiveDate, adminName = 'Commercial Director' }) {
    await delay(300);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));
    if (idx === -1) return { success: false, error: 'Vendor not found' };

    const rateNum = parseFloat(newRate) || 5.0;
    const currentAgreement = stores[idx].marketplace_agreement || {};
    const oldVerNum = parseFloat((currentAgreement.version || 'v2.4').replace('v', '')) || 2.4;
    const newVersion = 'v' + (oldVerNum + 0.1).toFixed(1);

    const historyEntry = {
      version: newVersion,
      rate_pct: rateNum,
      effective_date: effectiveDate || new Date().toISOString().split('T')[0],
      reason: reason || 'Contract amendment negotiated',
      updated_by: adminName,
      updated_at: new Date().toISOString()
    };

    const auditEntry = {
      id: 'aud_' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      actor: adminName,
      action: `Agreement Rate Amendment (${newVersion})`,
      note: `Take-rate adjusted to ${rateNum.toFixed(1)}%. Reason: ${historyEntry.reason}. Effective: ${historyEntry.effective_date}.`
    };

    stores[idx] = {
      ...stores[idx],
      marketplace_agreement: {
        ...currentAgreement,
        version: newVersion,
        effective_date: historyEntry.effective_date,
        commission_rate_pct: rateNum
      },
      agreement_history: [historyEntry, ...(stores[idx].agreement_history || [])],
      audit_trail: [auditEntry, ...(stores[idx].audit_trail || [])],
      updated_at: new Date().toISOString()
    };
    storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    return { success: true, vendor: stores[idx] };
  },

  async updateVendorStorefrontStatus(vendorId, { status, reason = '', adminName = 'Platform Root Admin' }) {
    await delay(300);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));
    if (idx === -1) return { success: false, error: 'Vendor not found' };

    const isLive = status === 'active';
    const auditEntry = {
      id: 'aud_' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      actor: adminName,
      action: isLive ? 'Storefront Access Reactivated' : 'Storefront Access Suspended',
      note: reason || (isLive ? 'Public storefront listing restored.' : 'Storefront unlisted and checkouts paused.')
    };

    stores[idx] = {
      ...stores[idx],
      storefront_status: status,
      vendor_status: isLive ? 'approved' : status,
      audit_trail: [auditEntry, ...(stores[idx].audit_trail || [])],
      updated_at: new Date().toISOString()
    };
    storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    return { success: true, vendor: stores[idx] };
  },

  async updateVendorCommercialTerms(vendorId, terms) {
    await delay(250);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));
    if (idx === -1) {
      return { success: false, error: 'Vendor not found' };
    }

    stores[idx] = {
      ...stores[idx],
      commercial_terms: {
        ...(stores[idx].commercial_terms || {}),
        ...terms
      },
      updated_at: new Date().toISOString()
    };
    storageEngine.setItem(STORAGE_KEYS.STORES, stores);

    return {
      success: true,
      vendor: stores[idx]
    };
  },

  async updateVendorStatus(vendorId, action, notes = '') {
    await delay(300);
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, INITIAL_VENDORS_DATA);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));

    let nextStatus = 'approved';
    if (action === 'approve' || action === 'reactivate') nextStatus = 'approved';
    else if (action === 'suspend') nextStatus = 'suspended';
    else if (action === 'request_changes') nextStatus = 'changes_requested';
    else if (action === 'reject') nextStatus = 'rejected';
    else if (action === 'pending') nextStatus = 'pending_approval';

    if (idx !== -1) {
      const existingNotes = stores[idx].admin_notes || '';
      const auditEntry = notes ? `[${new Date().toLocaleDateString()}] ${notes}` : '';
      const newNotes = auditEntry ? (existingNotes ? `${existingNotes}\n${auditEntry}` : auditEntry) : existingNotes;

      stores[idx] = {
        ...stores[idx],
        vendor_status: nextStatus,
        storefront_status: nextStatus === 'approved' ? 'active' : (nextStatus === 'suspended' ? 'suspended' : 'under_review'),
        admin_notes: newNotes,
        status_updated_at: new Date().toISOString()
      };
      storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    }

    return {
      success: true,
      vendor_status: nextStatus,
      vendor: idx !== -1 ? stores[idx] : null
    };
  },

  async getDisputes() {
    await delay();
    let disputes = storageEngine.getItem(STORAGE_KEYS.ADMIN_DISPUTES, null);
    if (!disputes || disputes.length < 3 || !disputes[0]?.order?.tracking) {
      disputes = INITIAL_DISPUTES;
      storageEngine.setItem(STORAGE_KEYS.ADMIN_DISPUTES, disputes);
    }
    return {
      success: true,
      disputes
    };
  },

  async resolveDispute(disputeId, action, notes = '', extraData = {}) {
    await delay(300);
    let disputes = storageEngine.getItem(STORAGE_KEYS.ADMIN_DISPUTES, INITIAL_DISPUTES);
    const idx = disputes.findIndex(d => d.id === disputeId);

    if (idx === -1) {
      return { success: false, error: 'Dispute record not found' };
    }

    let nextStatus = 'resolved_refunded';
    let actionLabel = 'Full Refund Issued';
    if (action === 'refund' || action === 'full_refund') {
      nextStatus = 'resolved_refunded';
      actionLabel = 'Full Refund Issued to Buyer';
    } else if (action === 'partial_refund') {
      nextStatus = 'resolved_partial_refund';
      actionLabel = `Partial Refund Issued ($${extraData.partialAmount || '0.00'})`;
    } else if (action === 'reject' || action === 'reject_claim' || action === 'release') {
      nextStatus = 'resolved_rejected';
      actionLabel = 'Claim Rejected (Seller Upheld)';
    } else if (action === 'escalate') {
      nextStatus = 'escalated';
      actionLabel = 'Case Escalated for Senior Review';
    }

    const auditEntry = {
      timestamp: new Date().toISOString(),
      actor: extraData.adminName || 'Platform Dispute Specialist',
      action: actionLabel,
      note: notes || actionLabel
    };

    disputes[idx] = {
      ...disputes[idx],
      status: nextStatus,
      admin_notes: notes || disputes[idx].admin_notes,
      resolved_at: nextStatus.startsWith('resolved') ? new Date().toISOString() : disputes[idx].resolved_at,
      partial_amount: extraData.partialAmount || disputes[idx].partial_amount || null,
      updated_at: new Date().toISOString(),
      audit_history: [auditEntry, ...(disputes[idx].audit_history || [])]
    };

    storageEngine.setItem(STORAGE_KEYS.ADMIN_DISPUTES, disputes);

    return {
      success: true,
      dispute: disputes[idx]
    };
  },

  async getRunPodMetrics() {
    await delay();
    let jobs = storageEngine.getItem(STORAGE_KEYS.RUNPOD_JOBS, null);
    if (!jobs) {
      jobs = INITIAL_RUNPOD_JOBS;
      storageEngine.setItem(STORAGE_KEYS.RUNPOD_JOBS, jobs);
    }

    return {
      success: true,
      telemetry: {
        totalRequests: 2840 + jobs.length,
        activeWorkers: 3,
        avgLatency: 12.4,
        totalCost: parseFloat((3.36 + jobs.length * 0.0028).toFixed(2)),
        queueSize: 0,
        maxWorkers: 10,
        scaleUpThreshold: 80
      },
      jobs
    };
  },

  async triggerRunPodJob(category = 'tops') {
    await delay(300);
    let jobs = storageEngine.getItem(STORAGE_KEYS.RUNPOD_JOBS, INITIAL_RUNPOD_JOBS);
    const jobId = 'job-rp-' + Math.floor(92000 + Math.random() * 8000);
    const execTime = parseFloat((10 + Math.random() * 4).toFixed(1));
    const cost = parseFloat(((execTime * 0.74) / 3600).toFixed(4));

    const newJob = {
      id: jobId,
      category,
      gpuModel: 'NVIDIA RTX 4090',
      executionTime: execTime,
      queueTime: 0.4,
      cost,
      status: 'COMPLETED',
      timestamp: new Date().toISOString()
    };

    const updated = [newJob, ...jobs.slice(0, 19)];
    storageEngine.setItem(STORAGE_KEYS.RUNPOD_JOBS, updated);

    return {
      success: true,
      job: newJob
    };
  },

  async getOrders(filter = 'all', search = '') {
    await delay();
    const allOrders = getUnifiedOrders();

    const enriched = allOrders.map(o => ({
      ...o,
      platform_fee: parseFloat((o.amount * 0.05).toFixed(2)),
      merchant_net: parseFloat((o.amount * 0.95).toFixed(2))
    }));

    // Calculate vault metrics
    let totalGMV = 0;
    let escrowHeld = 0;
    let escrowReleased = 0;
    let escrowRefunded = 0;
    let escrowDisputed = 0;

    enriched.forEach(o => {
      totalGMV += o.amount;
      if (o.escrow_status === 'held') escrowHeld += o.amount;
      else if (o.escrow_status === 'released') escrowReleased += o.amount;
      else if (o.escrow_status === 'refunded') escrowRefunded += o.amount;
      else if (o.escrow_status === 'disputed') escrowDisputed += o.amount;
    });

    const summary = {
      totalGMV: parseFloat(totalGMV.toFixed(2)),
      escrowHeld: parseFloat(escrowHeld.toFixed(2)),
      escrowReleased: parseFloat(escrowReleased.toFixed(2)),
      escrowRefunded: parseFloat(escrowRefunded.toFixed(2)),
      escrowDisputed: parseFloat(escrowDisputed.toFixed(2)),
      platformFeesEarned: parseFloat((escrowReleased * 0.05).toFixed(2)),
      totalCount: enriched.length,
      heldCount: enriched.filter(o => o.escrow_status === 'held').length,
      releasedCount: enriched.filter(o => o.escrow_status === 'released').length,
      refundedCount: enriched.filter(o => o.escrow_status === 'refunded').length,
      disputedCount: enriched.filter(o => o.escrow_status === 'disputed').length,
    };

    const q = search.trim().toLowerCase();
    const filtered = enriched.filter(o => {
      const matchFilter = filter === 'all' || o.escrow_status === filter;
      if (!matchFilter) return false;
      if (!q) return true;

      const idMatch = (o.id || '').toLowerCase().includes(q);
      const custName = (o.customer?.full_name || '').toLowerCase().includes(q);
      const custMail = (o.customer?.email || '').toLowerCase().includes(q);
      const vendName = (o.vendor?.store_name || '').toLowerCase().includes(q);
      const vendHand = (o.vendor?.store_handle || '').toLowerCase().includes(q);
      const trackMatch = (o.tracking_number || '').toLowerCase().includes(q);
      const itemMatch = (o.items || []).some(it => (it.name || '').toLowerCase().includes(q));

      return idMatch || custName || custMail || vendName || vendHand || trackMatch || itemMatch;
    });

    return {
      success: true,
      orders: filtered,
      summary,
      count: filtered.length
    };
  },

  async releaseOrderEscrow(orderId, adminNotes = '') {
    await delay();
    const allOrders = getUnifiedOrders();
    const cleanId = orderId.replace(/^#/, '');
    const idx = allOrders.findIndex(o => o.id === cleanId || o.id === orderId);

    if (idx === -1) {
      return { success: false, error: 'Order not found in escrow vault' };
    }

    const note = adminNotes || 'Admin manual escrow release approved. 95% net transferred to merchant.';
    allOrders[idx] = {
      ...allOrders[idx],
      escrow_status: 'released',
      status: allOrders[idx].status === 'cancelled' ? allOrders[idx].status : 'delivered',
      released_at: new Date().toISOString(),
      admin_notes: allOrders[idx].admin_notes ? `${allOrders[idx].admin_notes} | ${note}` : note
    };

    storageEngine.setItem(STORAGE_KEYS.ORDERS, allOrders);

    // Sync to vogue_social_orders if present
    try {
      const rawSocial = localStorage.getItem('vogue_social_orders');
      if (rawSocial) {
        const socialList = JSON.parse(rawSocial);
        const sIdx = socialList.findIndex(o => o.id === cleanId || o.id === orderId);
        if (sIdx !== -1) {
          socialList[sIdx] = {
            ...socialList[sIdx],
            escrow_status: 'released',
            status: 'delivered'
          };
          localStorage.setItem('vogue_social_orders', JSON.stringify(socialList));
        }
      }
    } catch {}

    return {
      success: true,
      order: allOrders[idx]
    };
  },

  async refundOrder(orderId, adminNotes = '') {
    await delay();
    const allOrders = getUnifiedOrders();
    const cleanId = orderId.replace(/^#/, '');
    const idx = allOrders.findIndex(o => o.id === cleanId || o.id === orderId);

    if (idx === -1) {
      return { success: false, error: 'Order not found in escrow vault' };
    }

    const note = adminNotes || 'Admin issued full refund to buyer. Escrow returned to buyer account.';
    allOrders[idx] = {
      ...allOrders[idx],
      escrow_status: 'refunded',
      status: 'cancelled',
      refunded_at: new Date().toISOString(),
      admin_notes: allOrders[idx].admin_notes ? `${allOrders[idx].admin_notes} | ${note}` : note
    };

    storageEngine.setItem(STORAGE_KEYS.ORDERS, allOrders);

    // Sync to vogue_social_orders if present
    try {
      const rawSocial = localStorage.getItem('vogue_social_orders');
      if (rawSocial) {
        const socialList = JSON.parse(rawSocial);
        const sIdx = socialList.findIndex(o => o.id === cleanId || o.id === orderId);
        if (sIdx !== -1) {
          socialList[sIdx] = {
            ...socialList[sIdx],
            escrow_status: 'refunded',
            status: 'cancelled'
          };
          localStorage.setItem('vogue_social_orders', JSON.stringify(socialList));
        }
      }
    } catch {}

    return {
      success: true,
      order: allOrders[idx]
    };
  },

  async getIntegrationsConfig() {
    await delay();
    let config = storageEngine.getItem(STORAGE_KEYS.ADMIN_INTEGRATIONS, null);
    if (!config) {
      config = INITIAL_INTEGRATIONS_CONFIG;
      storageEngine.setItem(STORAGE_KEYS.ADMIN_INTEGRATIONS, config);
    }
    // Ensure payment and logistics aliases exist for compatibility
    if (config.payment && !config.stripe) config.stripe = config.payment;
    if (config.logistics && !config.easypost) config.easypost = config.logistics;
    if (config.stripe && !config.payment) config.payment = config.stripe;
    if (config.easypost && !config.logistics) config.logistics = config.easypost;
    return {
      success: true,
      config
    };
  },

  async saveIntegrationsConfig(updatedConfig) {
    await delay(300);
    storageEngine.setItem(STORAGE_KEYS.ADMIN_INTEGRATIONS, updatedConfig);
    return {
      success: true,
      config: updatedConfig
    };
  },

  async getWebhookEvents() {
    await delay();
    let events = storageEngine.getItem(STORAGE_KEYS.ADMIN_WEBHOOK_EVENTS, null);
    if (!events) {
      events = INITIAL_WEBHOOK_EVENTS;
      storageEngine.setItem(STORAGE_KEYS.ADMIN_WEBHOOK_EVENTS, events);
    }
    return {
      success: true,
      events
    };
  },

  async simulateWebhookEvent(eventType, customPayload = {}) {
    await delay(400);
    let events = storageEngine.getItem(STORAGE_KEYS.ADMIN_WEBHOOK_EVENTS, INITIAL_WEBHOOK_EVENTS);
    const eventId = 'evt_wh_' + Math.floor(10000 + Math.random() * 90000);
    const timestamp = new Date().toISOString();

    let newEvent;
    const idempotencyKey = 'idemp_' + Math.random().toString(36).substring(2, 11);

    if (eventType === 'shipment.delivered') {
      const targetOrderId = customPayload.order_id || 'ORD-8241';
      newEvent = {
        id: eventId,
        domain: 'logistics',
        source: 'Carrier Webhook (DHL)',
        event: 'shipment.delivered',
        order_id: targetOrderId,
        status: 200,
        signature_verification: 'verified_hmac_sha256',
        processing_status: 'processed',
        retry_count: '1/3',
        failure_reason: null,
        idempotency_key: idempotencyKey,
        timestamp,
        payload: {
          tracking_code: customPayload.tracking_code || 'DHL-84920194',
          status: 'DELIVERED',
          signed_by: customPayload.signed_by || 'Aisha Malik',
          location: 'Dubai, UAE',
          message: 'Package handed to resident. Signature captured.',
          verification_gates_passed: true
        }
      };

      // Also update order status in storage if present
      const allOrders = getUnifiedOrders();
      const oIdx = allOrders.findIndex(o => o.id === targetOrderId || o.id === `#${targetOrderId}`);
      if (oIdx !== -1) {
        allOrders[oIdx] = {
          ...allOrders[oIdx],
          status: 'delivered',
          admin_notes: (allOrders[oIdx].admin_notes ? allOrders[oIdx].admin_notes + ' | ' : '') + 'Carrier delivery confirmed via webhook ' + eventId
        };
        storageEngine.setItem(STORAGE_KEYS.ORDERS, allOrders);
      }
    } else if (eventType === 'payment_intent.succeeded') {
      newEvent = {
        id: eventId,
        domain: 'payment',
        source: 'Payment Provider (Stripe)',
        event: 'payment_intent.succeeded',
        order_id: customPayload.order_id || 'ORD-8242',
        status: 200,
        signature_verification: 'verified_hmac_sha256',
        processing_status: 'processed',
        retry_count: '1/3',
        failure_reason: null,
        idempotency_key: idempotencyKey,
        timestamp,
        payload: {
          payment_intent: 'pi_live_' + Math.random().toString(36).substring(2, 10),
          amount: customPayload.amount || 35000,
          currency: 'usd',
          funds_status: 'captured_pending_delivery',
          destination_account: 'acct_1N4k92A',
          customer_email: 'buyer@voguesocial.com'
        }
      };
    } else if (eventType === 'transfer.created' || eventType === 'payout.paid') {
      const targetOrderId = customPayload.order_id || 'ORD-8239';
      newEvent = {
        id: eventId,
        domain: 'payout',
        source: 'Payment Provider (Stripe)',
        event: 'transfer.created',
        order_id: targetOrderId,
        status: 200,
        signature_verification: 'verified_hmac_sha256',
        processing_status: 'processed',
        retry_count: '1/3',
        failure_reason: null,
        idempotency_key: idempotencyKey,
        timestamp,
        payload: {
          transfer_id: 'tr_' + Math.random().toString(36).substring(2, 10),
          destination_account: 'acct_1N4k92A',
          amount: 39900,
          fee_retained: 2100,
          verification_gates_checked: ['payment_settled', 'delivery_verified', 'no_dispute', 'kyc_eligible'],
          result: 'disbursement_completed'
        }
      };
    } else if (eventType === 'charge.dispute.created') {
      const targetOrderId = customPayload.order_id || 'ORD-8237';
      newEvent = {
        id: eventId,
        domain: 'dispute',
        source: 'Payment Provider (Stripe)',
        event: 'charge.dispute.created',
        order_id: targetOrderId,
        status: 200,
        signature_verification: 'verified_hmac_sha256',
        processing_status: 'processed',
        retry_count: '1/3',
        failure_reason: 'escrow_hold_frozen_pending_evidence',
        idempotency_key: idempotencyKey,
        timestamp,
        payload: {
          dispute_id: 'dp_' + Math.random().toString(36).substring(2, 8),
          reason: customPayload.reason || 'damaged_merchandise',
          amount: 85000,
          payout_blocked: true,
          evidence_due_by: new Date(Date.now() + 7 * 86400000).toISOString()
        }
      };

      // Freeze escrow in orders if present
      const allOrders = getUnifiedOrders();
      const oIdx = allOrders.findIndex(o => o.id === targetOrderId || o.id === `#${targetOrderId}`);
      if (oIdx !== -1) {
        allOrders[oIdx] = {
          ...allOrders[oIdx],
          escrow_status: 'disputed',
          admin_notes: (allOrders[oIdx].admin_notes ? allOrders[oIdx].admin_notes + ' | ' : '') + 'Dispute filed via Stripe webhook ' + eventId
        };
        storageEngine.setItem(STORAGE_KEYS.ORDERS, allOrders);
      }
    } else {
      newEvent = {
        id: eventId,
        domain: 'logistics',
        source: 'EasyPost Gateway',
        event: eventType || 'shipment.in_transit',
        order_id: 'ORD-8240',
        status: 200,
        signature_verification: 'verified_hmac_sha256',
        processing_status: 'processed',
        retry_count: '1/3',
        failure_reason: null,
        idempotency_key: idempotencyKey,
        timestamp,
        payload: {
          tracking_code: 'DHL-GENERIC',
          status: 'IN_TRANSIT',
          checkpoint: 'Regional Logistics Center'
        }
      };
    }

    const updatedEvents = [newEvent, ...events.slice(0, 49)];
    storageEngine.setItem(STORAGE_KEYS.ADMIN_WEBHOOK_EVENTS, updatedEvents);

    return {
      success: true,
      event: newEvent
    };
  },

  async clearWebhookEvents() {
    await delay(150);
    storageEngine.setItem(STORAGE_KEYS.ADMIN_WEBHOOK_EVENTS, []);
    return {
      success: true
    };
  }
};

const INITIAL_INTEGRATIONS_CONFIG = {
  payment: {
    provider: 'Stripe Connect (Marketplace)',
    environment: 'sandbox', // 'sandbox' | 'production'
    publishable_key: 'pk_test_51Mz9V2K9QxVogueSocialAtelierKey001',
    secret_key_configured: true,
    secret_key_ref: 'ENV: STRIPE_SECRET_KEY',
    webhook_secret_configured: true,
    webhook_secret_ref: 'ENV: STRIPE_WEBHOOK_SECRET',
    platform_take_rate: 5.0,
    settlement_buffer_hours: 48,
    provider_status: 'operational_testnet',
    is_simulated_demo: true,
    last_sync: new Date().toISOString()
  },
  logistics: {
    default_model: 'merchant_fulfilled', // 'merchant_fulfilled' | 'platform_labels'
    platform_labels_active: false,
    provider: 'EasyPost Universal Gateway',
    webhook_endpoint: 'https://api.voguesocial.com/webhooks/shipping',
    api_key_configured: true,
    api_key_ref: 'ENV: EASYPOST_API_KEY',
    carriers: {
      dhl_express: { enabled: true, name: 'DHL Express', status: 'connected', region: 'Global (220+ Countries)', model: 'Platform Account & Merchant Self-Ship' },
      fedex_priority: { enabled: false, name: 'FedEx International Priority', status: 'merchant_account_required', region: 'North America & Europe', model: 'Merchant Own Account' },
      ups_worldwide: { enabled: false, name: 'UPS Worldwide Expedited', status: 'merchant_account_required', region: 'Global', model: 'Merchant Own Account' },
      boutique_couriers: { enabled: true, name: 'Merchant Self-Fulfill (Local Courier)', status: 'supported', region: 'Worldwide Domestic', model: 'Merchant Direct Tracking' }
    },
    status: 'operational',
    last_ping: new Date().toISOString()
  },
  get stripe() { return this.payment; },
  get easypost() { return this.logistics; },
  connected_accounts: [
    {
      id: 'acct_1N4k92A',
      vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
      store_name: 'Studio Label Paris',
      store_handle: 'studiolabel',
      email: 'concierge@studiolabelparis.com',
      country: 'FR',
      currency: 'EUR',
      kyc_stage: 'complete',
      payout_eligibility: 'eligible',
      restrictions: 'None',
      bank_name: 'JPMorgan Chase (Paris)',
      account_last4: '4192',
      payout_schedule: 'Daily rolling (48h inspection buffer)',
      pending_balance: 1585.00,
      balance_source: 'simulated_provider',
      last_synced_at: new Date(Date.now() - 8 * 60000).toISOString()
    },
    {
      id: 'acct_1N8m10B',
      vendor_id: 'mch_elena_02',
      store_name: 'Elena Couture',
      store_handle: 'elenacouture',
      email: 'elena@elenacouture.com',
      country: 'IT',
      currency: 'EUR',
      kyc_stage: 'complete',
      payout_eligibility: 'eligible',
      restrictions: 'None',
      bank_name: 'BNP Paribas Private',
      account_last4: '8821',
      payout_schedule: 'Weekly automated',
      pending_balance: 600.00,
      balance_source: 'simulated_provider',
      last_synced_at: new Date(Date.now() - 22 * 60000).toISOString()
    },
    {
      id: 'acct_1N9p77C',
      vendor_id: 'mch_noir_03',
      store_name: 'Atelier Noir',
      store_handle: 'ateliernoir',
      email: 'contact@ateliernoir.com',
      country: 'US',
      currency: 'USD',
      kyc_stage: 'documents_required',
      payout_eligibility: 'restricted',
      restrictions: 'Tax Form W-8BEN & Owner ID Required',
      bank_name: 'Silicon Valley Bank',
      account_last4: '3049',
      payout_schedule: 'Manual administrative hold',
      pending_balance: 210.00,
      balance_source: 'simulated_provider',
      last_synced_at: new Date(Date.now() - 45 * 60000).toISOString()
    }
  ]
};

const INITIAL_WEBHOOK_EVENTS = [
  {
    id: 'evt_wh_9012',
    domain: 'logistics',
    source: 'Carrier Webhook (DHL)',
    event: 'shipment.delivered',
    order_id: 'ORD-8239',
    status: 200,
    signature_verification: 'verified_hmac_sha256',
    processing_status: 'processed',
    retry_count: '1/3',
    failure_reason: null,
    idempotency_key: 'idemp_8921a4f001',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    payload: {
      tracking_code: 'DHL-29401824',
      status: 'DELIVERED',
      signed_by: 'P. Sharma',
      location: 'Bangalore, India',
      message: 'Package handed to resident. Signature captured.',
      verification_gates_passed: true
    }
  },
  {
    id: 'evt_wh_9011',
    domain: 'payment',
    source: 'Payment Provider (Stripe)',
    event: 'payment_intent.succeeded',
    order_id: 'ORD-8241',
    status: 200,
    signature_verification: 'verified_hmac_sha256',
    processing_status: 'processed',
    retry_count: '1/3',
    failure_reason: null,
    idempotency_key: 'idemp_8921a4f002',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    payload: {
      payment_intent: 'pi_3M9xV2K9QxVogueSocial01',
      amount: 59000,
      currency: 'usd',
      funds_status: 'captured_pending_delivery',
      destination_account: 'acct_1N4k92A'
    }
  },
  {
    id: 'evt_wh_9010',
    domain: 'logistics',
    source: 'Carrier Webhook (FedEx)',
    event: 'shipment.in_transit',
    order_id: 'ORD-8237',
    status: 200,
    signature_verification: 'verified_hmac_sha256',
    processing_status: 'processed',
    retry_count: '1/3',
    failure_reason: null,
    idempotency_key: 'idemp_8921a4f003',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    payload: {
      tracking_code: 'FDX-8392019',
      status: 'IN_TRANSIT',
      checkpoint: 'Riyadh Logistics Facility',
      message: 'International shipment scanned at customs gateway.'
    }
  },
  {
    id: 'evt_wh_9009',
    domain: 'payout',
    source: 'Payment Provider (Stripe)',
    event: 'transfer.created',
    order_id: 'ORD-8236',
    status: 200,
    signature_verification: 'verified_hmac_sha256',
    processing_status: 'processed',
    retry_count: '1/3',
    failure_reason: null,
    idempotency_key: 'idemp_8921a4f004',
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    payload: {
      transfer_id: 'tr_1N8m10B_99201',
      destination: 'acct_1N8m10B',
      net_amount: 26600,
      fee_collected: 1400,
      rule: '5_step_verification_passed'
    }
  }
];

const INITIAL_VENDORS_DATA = [
  {
    id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
    vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
    store_name: 'Studio Label Paris',
    store_handle: 'studiolabel',
    is_demo_sandbox: true,
    email: 'concierge@studiolabelparis.com',
    phone: '+33 1 42 68 55 00',
    custom_domain: 'shop.studiolabelparis.com',
    vendor_status: 'approved',
    storefront_status: 'active',
    kyb_status: 'verified',
    payout_eligibility: 'eligible',
    payout_hold_details: null,
    legal_business_name: 'Studio Label Paris S.A.S. (Demo)',
    business_type: 'Société par Actions Simplifiée (SAS)',
    tax_id: 'FR-DEMO-89293849102',
    registration_number: 'RCS-PARIS-DEMO-892938',
    country: 'France',
    products_count: 8,
    created_at: '2026-08-15T10:00:00Z',
    legal_address: {
      street: '18 Rue du Faubourg Saint-Honoré',
      city: 'Paris',
      postal_code: '75008',
      country: 'France'
    },
    return_warehouse_address: {
      street: '18 Rue du Faubourg Saint-Honoré',
      city: 'Paris',
      postal_code: '75008',
      country: 'France'
    },
    representative: {
      name: 'Camille Laurent',
      title: 'Managing Director',
      email: 'camille@studiolabelparis.com',
      phone: '+33 6 12 34 56 78'
    },
    documents: [
      { id: 'doc_101', type: 'address_proof', title: 'Proof of Business Address', filename: 'commercial_lease_faubourg.pdf', size: '2.4 MB', uploaded_at: '2026-08-10T12:00:00Z', expiry_date: '2027-08-10', status: 'verified', notes: 'Verified against Paris commercial property registry.' },
      { id: 'doc_102', type: 'incorporation', title: 'Business Registration Certificate (Extrait Kbis / RNE)', filename: 'kbis_extract_2026.pdf', size: '1.1 MB', uploaded_at: '2026-08-10T12:00:00Z', expiry_date: '2026-11-10', status: 'verified', notes: 'Active in Paris Registry of Commerce & RNE (within 90-day validity window).' },
      { id: 'doc_103', type: 'owner_id', title: 'Beneficial Owner Government ID', filename: 'passport_c_laurent.pdf', size: '3.8 MB', uploaded_at: '2026-08-10T12:00:00Z', expiry_date: '2031-06-15', status: 'verified', notes: 'Passport identity confirmed.' },
      { id: 'doc_104', type: 'trademark', title: 'Brand Trademark Registration', filename: 'euipo_trademark_01829.pdf', size: '940 KB', uploaded_at: '2026-08-10T12:00:00Z', expiry_date: '2034-01-20', status: 'verified', notes: 'EUIPO registered brand owner in fashion classes 25 & 35.' }
    ],
    payment_provider: {
      provider: 'Stripe Connect (Custom)',
      account_id: 'acct_1N4k92A',
      onboarding_status: 'completed',
      charges_enabled: true,
      payouts_enabled: true,
      bank_name: 'JPMorgan Chase (Paris)',
      account_last4: '4192',
      currency: 'EUR',
      source: 'provider_synced'
    },
    marketplace_agreement: {
      version: 'v2.4',
      effective_date: '2026-08-15',
      accepted_by: 'Camille Laurent',
      accepted_at: '2026-08-15T10:14:22Z',
      commission_rate_pct: 5.0,
      protocol_fees_desc: '0.0% listing fee • Standard payment processing passed at cost',
      fulfillment_model: 'Merchant Self-Fulfill (DHL Express / Negotiated Couriers)',
      return_policy: '14-Day Boutique Window • Escrow released 48h post verified delivery (POD)',
      payout_conditions: '5-step automated eligibility verification passed'
    },
    agreement_history: [
      { version: 'v2.4', rate_pct: 5.0, effective_date: '2026-08-15', reason: 'Initial boutique onboarding agreement', updated_by: 'Platform Root Admin', updated_at: '2026-08-15T10:14:22Z' }
    ],
    audit_trail: [
      { id: 'aud_101', timestamp: '2026-08-15T10:14:22Z', actor: 'Platform Root Admin', action: 'Boutique Onboarding Approved', note: 'All 4 KYB documents verified. Agreement v2.4 accepted.' },
      { id: 'aud_102', timestamp: '2026-08-10T14:30:00Z', actor: 'Compliance Reviewer', action: 'KYB Identity Verification Completed', note: 'Address proof and Kbis excerpt authenticated.' }
    ],
    admin_notes: 'Merchant verified during Paris intake.'
  },
  {
    id: 'mch_elena_02',
    vendor_id: 'mch_elena_02',
    store_name: 'Elena Couture',
    store_handle: 'elenacouture',
    is_demo_sandbox: true,
    email: 'elena@elenacouture.com',
    phone: '+39 02 7600 1234',
    custom_domain: 'shop.elenacouture.com',
    vendor_status: 'approved',
    storefront_status: 'active',
    kyb_status: 'verified',
    payout_eligibility: 'eligible',
    payout_hold_details: null,
    legal_business_name: 'Elena Couture S.r.l. (Demo)',
    business_type: 'Società a Responsabilità Limitata (S.r.l.)',
    tax_id: 'IT-DEMO-08192840152',
    registration_number: 'REA-MILANO-DEMO-2091823',
    country: 'Italy',
    products_count: 2,
    created_at: '2026-09-01T14:30:00Z',
    legal_address: {
      street: 'Via Montenapoleone 12',
      city: 'Milano',
      postal_code: '20121',
      country: 'Italy'
    },
    return_warehouse_address: {
      street: 'Via della Spiga 8, Cortile Interno',
      city: 'Milano',
      postal_code: '20121',
      country: 'Italy'
    },
    representative: {
      name: 'Elena Rossi',
      title: 'Founder & Head Designer',
      email: 'elena@elenacouture.com',
      phone: '+39 340 1234567'
    },
    documents: [
      { id: 'doc_201', type: 'address_proof', title: 'Proof of Business Address', filename: 'telecom_italia_utility_bill.pdf', size: '1.8 MB', uploaded_at: '2026-08-28T09:30:00Z', expiry_date: '2026-11-28', status: 'verified', notes: 'Matches Montenapoleone commercial registry.' },
      { id: 'doc_202', type: 'incorporation', title: 'Business Registration Certificate (Visura Camerale)', filename: 'camera_commercio_milano.pdf', size: '2.1 MB', uploaded_at: '2026-08-28T09:30:00Z', expiry_date: '2026-11-28', status: 'verified', notes: 'Milan Chamber of Commerce (Visura Camerale) certified.' },
      { id: 'doc_203', type: 'owner_id', title: 'Beneficial Owner Government ID', filename: 'carta_identita_rossi.pdf', size: '2.9 MB', uploaded_at: '2026-08-28T09:30:00Z', expiry_date: '2030-04-12', status: 'verified', notes: 'Italian national identity verified.' },
      { id: 'doc_204', type: 'trademark', title: 'Brand Trademark Registration', filename: 'uibm_marchio_elena.pdf', size: '1.2 MB', uploaded_at: '2026-08-28T09:30:00Z', expiry_date: '2035-09-01', status: 'verified', notes: 'Italian Patent and Trademark Office registered.' }
    ],
    payment_provider: {
      provider: 'Stripe Connect (Custom)',
      account_id: 'acct_1N8m10B',
      onboarding_status: 'completed',
      charges_enabled: true,
      payouts_enabled: true,
      bank_name: 'BNP Paribas Private',
      account_last4: '8821',
      currency: 'EUR',
      source: 'provider_synced'
    },
    marketplace_agreement: {
      version: 'v2.4',
      effective_date: '2026-09-01',
      accepted_by: 'Elena Rossi',
      accepted_at: '2026-09-01T14:30:00Z',
      commission_rate_pct: 4.5,
      protocol_fees_desc: '0.0% listing fee • Standard payment processing passed at cost',
      fulfillment_model: 'Merchant Self-Fulfill (FedEx International)',
      return_policy: '14-Day Boutique Window • Escrow released 48h post verified delivery (POD)',
      payout_conditions: '5-step automated eligibility verification passed'
    },
    agreement_history: [
      { version: 'v2.4', rate_pct: 4.5, effective_date: '2026-09-01', reason: 'Negotiated high-volume bridal wear tier', updated_by: 'Platform Root Admin', updated_at: '2026-09-01T14:30:00Z' }
    ],
    audit_trail: [
      { id: 'aud_201', timestamp: '2026-09-01T14:30:00Z', actor: 'Platform Root Admin', action: 'Boutique Onboarding Approved', note: 'Direct contract negotiated at 4.5% platform commission.' }
    ],
    admin_notes: 'Direct contract negotiated at 4.5% platform commission.'
  },
  {
    id: 'mch_ombre_03',
    vendor_id: 'mch_ombre_03',
    store_name: "Maison de L'Ombre",
    store_handle: 'maisondelombre',
    is_demo_sandbox: true,
    email: 'contact@maisondelombre.fr',
    phone: '+33 1 48 05 99 11',
    custom_domain: 'boutique.maisondelombre.fr',
    vendor_status: 'pending_approval',
    storefront_status: 'under_review',
    kyb_status: 'pending_documents',
    payout_eligibility: 'restricted',
    payout_hold_details: null,
    legal_business_name: "Maison de L'Ombre Créations SARL (Demo)",
    business_type: 'Société à Responsabilité Limitée (SARL)',
    tax_id: 'FR-DEMO-41908123456',
    registration_number: 'RCS-PARIS-DEMO-908123',
    country: 'France',
    products_count: 4,
    created_at: '2026-10-08T15:20:00Z',
    legal_address: {
      street: '7 Rue de Charonne',
      city: 'Paris',
      postal_code: '75011',
      country: 'France'
    },
    return_warehouse_address: {
      street: '7 Rue de Charonne',
      city: 'Paris',
      postal_code: '75011',
      country: 'France'
    },
    representative: {
      name: 'Mathieu Vaneau',
      title: 'Creative Director',
      email: 'm.vaneau@maisondelombre.fr',
      phone: '+33 6 77 88 99 00'
    },
    documents: [
      { id: 'doc_301', type: 'address_proof', title: 'Proof of Business Address', filename: 'edf_electricity_bill_july2026.pdf', size: '1.4 MB', uploaded_at: '2026-10-08T15:20:00Z', expiry_date: '2026-10-31', status: 'pending', notes: 'Awaiting admin verification against Charonne commercial lease.' },
      { id: 'doc_302', type: 'incorporation', title: 'Business Registration Certificate (Extrait RNE / Kbis)', filename: 'rne_extrait_ombre.pdf', size: '890 KB', uploaded_at: '2026-10-08T15:20:00Z', expiry_date: '2027-01-08', status: 'verified', notes: 'Validated with Registre National des Entreprises (RNE) database.' },
      { id: 'doc_303', type: 'owner_id', title: 'Beneficial Owner Government ID', filename: 'passeport_vaneau.pdf', size: '3.1 MB', uploaded_at: '2026-10-08T15:20:00Z', expiry_date: '2032-11-20', status: 'verified', notes: 'Passport verified via Stripe Identity check.' },
      { id: 'doc_304', type: 'trademark', title: 'Brand Trademark Registration', filename: 'inpi_marque_depot_ombre.pdf', size: '1.5 MB', uploaded_at: '2026-10-08T15:20:00Z', expiry_date: '2036-10-01', status: 'pending', notes: 'French INPI application pending final publication review.' }
    ],
    payment_provider: {
      provider: 'Stripe Connect (Custom)',
      account_id: 'acct_1N9p77C',
      onboarding_status: 'requirements_pending',
      charges_enabled: false,
      payouts_enabled: false,
      bank_name: 'Société Générale (Bastille)',
      account_last4: '1092',
      currency: 'EUR',
      source: 'provider_synced'
    },
    marketplace_agreement: {
      version: 'v2.4',
      effective_date: '2026-10-08',
      accepted_by: 'Mathieu Vaneau',
      accepted_at: '2026-10-08T15:20:00Z',
      commission_rate_pct: 5.0,
      protocol_fees_desc: '0.0% listing fee • Standard payment processing passed at cost',
      fulfillment_model: 'Merchant Self-Fulfill (DHL Express)',
      return_policy: '14-Day Boutique Window • Escrow released 48h post verified delivery (POD)',
      payout_conditions: '5-step automated eligibility protocol verified'
    },
    agreement_history: [
      { version: 'v2.4', rate_pct: 5.0, effective_date: '2026-10-08', reason: 'Initial application terms accepted by applicant', updated_by: 'Mathieu Vaneau', updated_at: '2026-10-08T15:20:00Z' }
    ],
    audit_trail: [
      { id: 'aud_301', timestamp: '2026-10-08T15:20:00Z', actor: 'Automated Onboarding Ingest', action: 'Application Registered', note: 'Initial application submitted with 4 haute couture evening pieces. Address proof and trademark pending verification.' }
    ],
    admin_notes: 'Initial application received. Catalog contains 4 haute couture evening pieces. Address proof and trademark pending approval.'
  },
  {
    id: 'mch_noir_04',
    vendor_id: 'mch_noir_04',
    store_name: 'Atelier Noir Studio',
    store_handle: 'ateliernoir',
    is_demo_sandbox: true,
    email: 'contact@ateliernoir.com',
    phone: '+1 (212) 555-0184',
    custom_domain: 'ateliernoir.com',
    vendor_status: 'changes_requested',
    storefront_status: 'active',
    kyb_status: 'documents_required',
    payout_eligibility: 'administrative_hold',
    payout_hold_details: {
      active: true,
      category: 'Compliance Documentation Review',
      reason: 'Proof of address utility bill rejected (exceeded 90-day threshold). Updated commercial lease deed required.',
      placed_by: 'Senior Compliance Auditor #4',
      placed_at: '2026-10-01T11:00:00Z'
    },
    legal_business_name: 'Noir Studio LLC (Demo)',
    business_type: 'Limited Liability Company (LLC)',
    tax_id: 'US-DEMO-139824018',
    registration_number: 'NY-DOS-DEMO-6920194',
    country: 'United States',
    products_count: 5,
    created_at: '2026-09-20T11:00:00Z',
    legal_address: {
      street: '520 Broadway, Suite 800',
      city: 'New York',
      postal_code: '10012',
      country: 'United States'
    },
    return_warehouse_address: {
      street: '145 Industrial Pkwy, Dock 4',
      city: 'Jersey City',
      postal_code: '07305',
      country: 'United States'
    },
    representative: {
      name: 'Julian Vance',
      title: 'Principal Operator',
      email: 'jvance@ateliernoir.com',
      phone: '+1 (917) 555-0199'
    },
    documents: [
      { id: 'doc_401', type: 'address_proof', title: 'Proof of Business Address', filename: 'conedison_bill_unclear.pdf', size: '720 KB', uploaded_at: '2026-09-20T11:00:00Z', expiry_date: '2026-03-15', status: 'rejected', notes: 'Rejected: Bill is dated over 6 months ago. Upload utility bill from last 90 days or signed Soho lease.' },
      { id: 'doc_402', type: 'incorporation', title: 'Business Registration Certificate (Articles of Organization)', filename: 'ny_articles_of_organization.pdf', size: '1.3 MB', uploaded_at: '2026-09-20T11:00:00Z', expiry_date: 'Permanent', status: 'verified', notes: 'New York Department of State (Division of Corporations) verified.' },
      { id: 'doc_403', type: 'owner_id', title: 'Beneficial Owner Government ID', filename: 'ny_driver_license_vance.pdf', size: '2.5 MB', uploaded_at: '2026-09-20T11:00:00Z', expiry_date: '2028-10-14', status: 'verified', notes: 'Driver license valid through 2028.' },
      { id: 'doc_404', type: 'trademark', title: 'USPTO Trademark Filing', filename: 'uspto_sn_97812903.pdf', size: '1.1 MB', uploaded_at: '2026-09-20T11:00:00Z', expiry_date: '2033-05-22', status: 'verified', notes: 'USPTO Principal Register active.' }
    ],
    payment_provider: {
      provider: 'Stripe Connect (Custom)',
      account_id: 'acct_1N9x55D',
      onboarding_status: 'restricted',
      charges_enabled: true,
      payouts_enabled: false,
      bank_name: 'Silicon Valley Bank / First Citizens',
      account_last4: '3049',
      currency: 'USD',
      source: 'provider_synced'
    },
    marketplace_agreement: {
      version: 'v2.4',
      effective_date: '2026-09-20',
      accepted_by: 'Julian Vance',
      accepted_at: '2026-09-20T11:00:00Z',
      commission_rate_pct: 5.0,
      protocol_fees_desc: '0.0% listing fee • Standard payment processing passed at cost',
      fulfillment_model: 'Merchant Self-Fulfill (UPS Worldwide)',
      return_policy: '14-Day Boutique Window • Escrow released 48h post verified delivery (POD)',
      payout_conditions: '5-step automated eligibility protocol verified'
    },
    agreement_history: [
      { version: 'v2.4', rate_pct: 5.0, effective_date: '2026-09-20', reason: 'Initial boutique terms', updated_by: 'Julian Vance', updated_at: '2026-09-20T11:00:00Z' }
    ],
    audit_trail: [
      { id: 'aud_401', timestamp: '2026-10-01T11:00:00Z', actor: 'Senior Compliance Auditor #4', action: 'Administrative Payout Hold Placed', note: 'Utility bill rejected as stale. Payout hold placed without unlisting storefront.' },
      { id: 'aud_402', timestamp: '2026-09-20T11:00:00Z', actor: 'Onboarding System', action: 'Application Accepted into Staging', note: 'Articles of organization and photo ID approved.' }
    ],
    admin_notes: 'Address proof was rejected on Oct 1st. Notified applicant to supply valid utility bill or Soho commercial lease.'
  },
  {
    id: 'mch_vanguard_05',
    vendor_id: 'mch_vanguard_05',
    store_name: 'Vanguard Streetwear Co.',
    store_handle: 'vanguardstreet',
    is_demo_sandbox: true,
    email: 'legal@vanguardstreet.co.uk',
    phone: '+44 20 7946 0912',
    custom_domain: 'shop.vanguardstreet.co.uk',
    vendor_status: 'suspended',
    storefront_status: 'suspended',
    kyb_status: 'rejected',
    payout_eligibility: 'administrative_hold',
    payout_hold_details: {
      active: true,
      category: 'Copyright & Trademark Infringement',
      reason: 'Active trademark dispute filed by third-party rights holder. Full IP audit required before access restoration.',
      placed_by: 'Senior Legal Admin',
      placed_at: '2026-10-02T09:15:00Z'
    },
    legal_business_name: 'Vanguard Streetwear Limited (Demo)',
    business_type: 'Private Limited Company (Ltd)',
    tax_id: 'GB-DEMO-992019284',
    registration_number: 'UK-CH-DEMO-12904812',
    country: 'United Kingdom',
    products_count: 6,
    created_at: '2026-07-15T08:00:00Z',
    legal_address: {
      street: '14 Shoreditch High Street',
      city: 'London',
      postal_code: 'E1 6PG',
      country: 'United Kingdom'
    },
    return_warehouse_address: {
      street: 'Unit 4, Hackney Downs Studios',
      city: 'London',
      postal_code: 'E8 2BT',
      country: 'United Kingdom'
    },
    representative: {
      name: 'Liam Sterling',
      title: 'Operations Director',
      email: 'l.sterling@vanguardstreet.co.uk',
      phone: '+44 7700 900123'
    },
    documents: [
      { id: 'doc_501', type: 'address_proof', title: 'Proof of Business Address', filename: 'shoreditch_lease_deed.pdf', size: '3.1 MB', uploaded_at: '2026-07-15T08:00:00Z', expiry_date: '2028-06-30', status: 'verified', notes: 'Verified commercial lease.' },
      { id: 'doc_502', type: 'incorporation', title: 'Business Registration Certificate (Companies House Extract)', filename: 'companies_house_extract.pdf', size: '1.4 MB', uploaded_at: '2026-07-15T08:00:00Z', expiry_date: 'Permanent', status: 'verified', notes: 'Companies House Registrar of Companies certified.' },
      { id: 'doc_503', type: 'owner_id', title: 'Beneficial Owner Government ID', filename: 'uk_passport_sterling.pdf', size: '2.8 MB', uploaded_at: '2026-07-15T08:00:00Z', expiry_date: '2029-02-18', status: 'verified', notes: 'UK passport verified.' },
      { id: 'doc_504', type: 'trademark', title: 'Brand Trademark Registration', filename: 'uk_ipo_trademark.pdf', size: '1.0 MB', uploaded_at: '2026-07-15T08:00:00Z', expiry_date: 'Disputed', status: 'rejected', notes: 'Flagged: Active trademark dispute filed by third party rights holder.' }
    ],
    payment_provider: {
      provider: 'Stripe Connect (Custom)',
      account_id: 'acct_1N7k19E',
      onboarding_status: 'restricted',
      charges_enabled: false,
      payouts_enabled: false,
      bank_name: 'Barclays Commercial UK',
      account_last4: '9901',
      currency: 'GBP',
      source: 'provider_synced'
    },
    marketplace_agreement: {
      version: 'v2.3',
      effective_date: '2026-07-15',
      accepted_by: 'Liam Sterling',
      accepted_at: '2026-07-15T08:00:00Z',
      commission_rate_pct: 6.0,
      protocol_fees_desc: '0.0% listing fee • Standard payment processing passed at cost',
      fulfillment_model: 'Merchant Self-Fulfill (Royal Mail Special Delivery)',
      return_policy: '14-Day Boutique Window • Escrow released 48h post verified delivery (POD)',
      payout_conditions: '5-step automated eligibility protocol verified'
    },
    agreement_history: [
      { version: 'v2.3', rate_pct: 6.0, effective_date: '2026-07-15', reason: 'High-risk streetwear category terms', updated_by: 'Platform Root Admin', updated_at: '2026-07-15T08:00:00Z' }
    ],
    audit_trail: [
      { id: 'aud_501', timestamp: '2026-10-02T09:15:00Z', actor: 'Senior Legal Admin', action: 'Storefront Suspended & Payout Hold Placed', note: 'Third-party rights holder filed trademark claim on logo graphic. Storefront unlisted.' },
      { id: 'aud_502', timestamp: '2026-07-15T08:00:00Z', actor: 'Onboarding System', action: 'Boutique Onboarded', note: 'Initial agreement v2.3 executed.' }
    ],
    admin_notes: 'Account suspended on Oct 2nd following trademark infringement notice. Storefront unlisted and payouts locked.'
  },
  {
    id: 'mch_claire_06',
    vendor_id: 'mch_claire_06',
    store_name: 'Claire Delacroix Studio',
    store_handle: 'clairedelacroix',
    is_demo_sandbox: true,
    email: 'claire@delacroix-studio.fr',
    phone: '+33 6 44 55 66 77',
    custom_domain: 'delacroix-studio.fr',
    vendor_status: 'approved',
    storefront_status: 'active',
    kyb_status: 'verified',
    payout_eligibility: 'eligible',
    payout_hold_details: null,
    legal_business_name: 'Claire Delacroix (Entreprise Individuelle)',
    business_type: 'Sole Proprietorship / Auto-entrepreneur',
    tax_id: 'FR-DEMO-5592810394',
    registration_number: 'SIREN-DEMO-982173921',
    country: 'France',
    products_count: 3,
    created_at: '2026-09-10T12:00:00Z',
    legal_address: {
      street: '24 Rue Vieille-du-Temple',
      city: 'Paris',
      postal_code: '75004',
      country: 'France'
    },
    return_warehouse_address: {
      street: '24 Rue Vieille-du-Temple',
      city: 'Paris',
      postal_code: '75004',
      country: 'France'
    },
    representative: {
      name: 'Claire Delacroix',
      title: 'Proprietor & Master Tailor',
      email: 'claire@delacroix-studio.fr',
      phone: '+33 6 44 55 66 77'
    },
    documents: [
      { id: 'doc_601', type: 'address_proof', title: 'Proof of Business Address', filename: 'quittance_loyer_marais.pdf', size: '1.2 MB', uploaded_at: '2026-09-10T12:00:00Z', expiry_date: '2026-12-10', status: 'verified', notes: 'Residential-studio lease receipt authenticated.' },
      { id: 'doc_602', type: 'incorporation', title: 'Business Registration (Corporate Extract)', filename: 'exempt_sole_proprietor.pdf', size: '120 KB', uploaded_at: '2026-09-10T12:00:00Z', expiry_date: 'N/A', status: 'na', notes: 'Not Applicable: French Auto-entrepreneur / Individual artisan without incorporation charter. Verified via SIRENE certificate.' },
      { id: 'doc_603', type: 'owner_id', title: 'Beneficial Owner Government ID', filename: 'passeport_delacroix.pdf', size: '2.4 MB', uploaded_at: '2026-09-10T12:00:00Z', expiry_date: '2033-04-18', status: 'verified', notes: 'French national passport identity confirmed.' },
      { id: 'doc_604', type: 'trademark', title: 'Brand Trademark Registration', filename: 'inpi_delacroix_couture.pdf', size: '890 KB', uploaded_at: '2026-09-10T12:00:00Z', expiry_date: '2036-08-15', status: 'verified', notes: 'INPI registered brand class 25.' }
    ],
    payment_provider: {
      provider: 'Stripe Connect (Custom)',
      account_id: 'acct_1N9z88F',
      onboarding_status: 'completed',
      charges_enabled: true,
      payouts_enabled: true,
      bank_name: 'Crédit Mutuel (Marais)',
      account_last4: '6721',
      currency: 'EUR',
      source: 'provider_synced'
    },
    marketplace_agreement: {
      version: 'v2.4',
      effective_date: '2026-09-10',
      accepted_by: 'Claire Delacroix',
      accepted_at: '2026-09-10T12:00:00Z',
      commission_rate_pct: 5.0,
      protocol_fees_desc: '0.0% listing fee • Standard payment processing passed at cost',
      fulfillment_model: 'Merchant Self-Fulfill (La Poste Colissimo)',
      return_policy: '14-Day Boutique Window • Escrow released 48h post verified delivery (POD)',
      payout_conditions: '5-step automated eligibility protocol verified'
    },
    agreement_history: [
      { version: 'v2.4', rate_pct: 5.0, effective_date: '2026-09-10', reason: 'Artisan boutique standard terms', updated_by: 'Platform Root Admin', updated_at: '2026-09-10T12:00:00Z' }
    ],
    audit_trail: [
      { id: 'aud_601', timestamp: '2026-09-10T12:00:00Z', actor: 'Platform Root Admin', action: 'Boutique Onboarding Approved', note: 'Sole proprietorship verified with SIRENE notice and passport. Corporate charter marked Not Applicable.' }
    ],
    admin_notes: 'Artisan sole proprietor approved via SIRENE registry and ID verification.'
  }
];
