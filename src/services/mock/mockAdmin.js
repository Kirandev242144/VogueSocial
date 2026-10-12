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

export const mockAdminAdapter = {
  async getDashboardStats() {
    await delay();
    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    const products = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const disputes = storageEngine.getItem(STORAGE_KEYS.ADMIN_DISPUTES, INITIAL_DISPUTES);

    const baseOrders = [
      { id: 'ORD-8241', amount: 590.00, status: 'shipped', escrow_status: 'held', created_at: new Date(Date.now() - 4 * 3600000).toISOString(), customer: { full_name: 'Aisha Malik', email: 'aisha.m@voguesocial.com' }, vendor: { store_name: 'Studio Label Paris', store_handle: 'studiolabel' } },
      { id: 'ORD-8240', amount: 145.00, status: 'pending', escrow_status: 'held', created_at: new Date(Date.now() - 10 * 3600000).toISOString(), customer: { full_name: 'Sara Johnson', email: 'sara.j@voguesocial.com' }, vendor: { store_name: 'Studio Label Paris', store_handle: 'studiolabel' } },
      { id: 'ORD-8239', amount: 420.00, status: 'delivered', escrow_status: 'released', created_at: new Date(Date.now() - 25 * 3600000).toISOString(), customer: { full_name: 'Priya Sharma', email: 'priya.s@voguesocial.com' }, vendor: { store_name: 'Studio Label Paris', store_handle: 'studiolabel' } },
      { id: 'ORD-8238', amount: 320.00, status: 'cancelled', escrow_status: 'refunded', created_at: new Date(Date.now() - 48 * 3600000).toISOString(), customer: { full_name: 'Riya Kapoor', email: 'riya.k@voguesocial.com' }, vendor: { store_name: 'Elena Couture', store_handle: 'elenacouture' } }
    ];

    let totalVolume = 14850.00;
    let escrowHeld = 2450.00;
    let commissionEarned = 742.50;

    baseOrders.forEach(o => {
      totalVolume += o.amount;
      if (o.escrow_status === 'held') escrowHeld += o.amount;
      if (o.escrow_status === 'released') commissionEarned += (o.amount * 0.05);
    });

    return {
      success: true,
      stats: {
        totalVolume,
        escrowHeld,
        commissionEarned,
        activeVendors: Math.max(stores.length, 2),
        totalProducts: products.length,
        openDisputes: disputes.filter(d => d.status === 'open' || d.status === 'under_review').length
      },
      recentOrders: baseOrders
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
  }
};
