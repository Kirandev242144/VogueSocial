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
  }
};
