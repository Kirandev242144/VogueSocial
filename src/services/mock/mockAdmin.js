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
    description: 'The bespoke atelier suit arrived with a damaged seam on the left lapel. Replacement or partial escrow refund requested.',
    evidence_url: '/Shop_images/1/basic2-500x750.jpeg',
    status: 'open',
    admin_notes: '',
    created_at: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    order: {
      id: 'ORD-8241',
      amount: 590.00,
      customer: { full_name: 'Aisha Malik', email: 'aisha.m@voguesocial.com' },
      vendor: { store_name: 'Studio Label Paris', store_handle: 'studiolabel' }
    }
  },
  {
    id: 'disp-002',
    order_id: 'ORD-8240',
    reason: 'Delayed International Transit',
    description: 'Tracking status indicates parcel in customs transit beyond estimated delivery window.',
    evidence_url: '',
    status: 'under_review',
    admin_notes: 'DHL Express courier tracking check pending with logistics liaison.',
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    order: {
      id: 'ORD-8240',
      amount: 145.00,
      customer: { full_name: 'Riya Kapoor', email: 'riya.k@voguesocial.com' },
      vendor: { store_name: 'Elena Couture', store_handle: 'elenacouture' }
    }
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
    const allProducts = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);

    const vendorMap = {};
    stores.forEach(s => {
      vendorMap[s.vendor_id || s.vendorId] = s;
    });

    const enriched = allProducts.map(p => {
      const v = vendorMap[p.vendorId || p.vendor_id] || {
        store_name: 'Studio Label Paris',
        store_handle: 'studiolabel'
      };
      return {
        ...p,
        status: p.status || 'live',
        vendor: {
          store_name: v.store_name || v.storeName || 'Studio Label Paris',
          store_handle: v.store_handle || v.storeHandle || 'studiolabel'
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

  async updateProductStatus(productId, action, notes = '') {
    await delay();
    const allProducts = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const idx = allProducts.findIndex(p => p.id === productId);

    if (idx === -1) {
      return { success: false, error: 'Product not found' };
    }

    let nextStatus = 'live';
    if (action === 'approve') nextStatus = 'live';
    else if (action === 'reject') nextStatus = 'rejected';
    else if (action === 'request_changes') nextStatus = 'changes_requested';
    else if (action === 'pending') nextStatus = 'pending_approval';

    allProducts[idx] = {
      ...allProducts[idx],
      status: nextStatus,
      admin_notes: notes || allProducts[idx].admin_notes,
      reviewed_at: new Date().toISOString()
    };

    storageEngine.setItem(STORAGE_KEYS.PRODUCTS, allProducts);

    return {
      success: true,
      status: nextStatus,
      product: allProducts[idx]
    };
  },

  async getVendors(filter = 'all', search = '') {
    await delay();
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    const products = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);

    // Ensure fallback stores exist if empty
    if (!stores || stores.length === 0) {
      stores = [
        {
          id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
          vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
          store_name: 'Studio Label Paris',
          store_handle: 'studiolabel',
          email: 'concierge@studiolabelparis.com',
          vendor_status: 'approved',
          created_at: '2026-08-15T10:00:00Z',
          custom_domain: 'shop.studiolabelparis.com'
        },
        {
          id: 'mch_elena_02',
          vendor_id: 'mch_elena_02',
          store_name: 'Elena Couture',
          store_handle: 'elenacouture',
          email: 'elena@elenacouture.com',
          vendor_status: 'approved',
          created_at: '2026-09-01T14:30:00Z',
          custom_domain: 'shop.elenacouture.com'
        }
      ];
    }

    const enriched = stores.map(s => {
      const vid = s.vendor_id || s.vendorId || s.id;
      const count = products.filter(p => (p.vendorId === vid || p.vendor_id === vid)).length;
      return {
        ...s,
        id: vid,
        store_name: s.store_name || s.storeName || 'Atelier Storefront',
        store_handle: s.store_handle || s.storeHandle || 'studiolabel',
        email: s.email || 'vendor@voguesocial.com',
        vendor_status: s.vendor_status || 'approved',
        products_count: count,
        created_at: s.created_at || '2026-08-01T00:00:00Z'
      };
    });

    const filtered = enriched.filter(v => {
      const name = (v.store_name || '').toLowerCase();
      const email = (v.email || '').toLowerCase();
      const handle = (v.store_handle || '').toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || email.includes(q) || handle.includes(q);
      const matchesFilter = filter === 'all' || v.vendor_status === filter;
      return matchesSearch && matchesFilter;
    });

    return {
      success: true,
      count: filtered.length,
      vendors: filtered
    };
  },

  async updateVendorStatus(vendorId, action) {
    await delay();
    let stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    const idx = stores.findIndex(s => (s.vendor_id === vendorId || s.id === vendorId || s.vendorId === vendorId));

    const nextStatus = action === 'approve' ? 'approved' : (action === 'suspend' ? 'suspended' : 'pending_approval');

    if (idx !== -1) {
      stores[idx] = {
        ...stores[idx],
        vendor_status: nextStatus,
        status_updated_at: new Date().toISOString()
      };
      storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    }

    return {
      success: true,
      vendor_status: nextStatus
    };
  },

  async getDisputes() {
    await delay();
    let disputes = storageEngine.getItem(STORAGE_KEYS.ADMIN_DISPUTES, null);
    if (!disputes) {
      disputes = INITIAL_DISPUTES;
      storageEngine.setItem(STORAGE_KEYS.ADMIN_DISPUTES, disputes);
    }
    return {
      success: true,
      disputes
    };
  },

  async resolveDispute(disputeId, action, notes = '') {
    await delay();
    let disputes = storageEngine.getItem(STORAGE_KEYS.ADMIN_DISPUTES, INITIAL_DISPUTES);
    const idx = disputes.findIndex(d => d.id === disputeId);

    if (idx === -1) {
      return { success: false, error: 'Dispute record not found' };
    }

    const nextStatus = action === 'release' ? 'resolved_released' : 'resolved_refunded';
    disputes[idx] = {
      ...disputes[idx],
      status: nextStatus,
      admin_notes: notes || disputes[idx].admin_notes,
      resolved_at: new Date().toISOString()
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
