import { APP_CONFIG, IS_MOCK_MODE } from '../constants/config';
import { mockAdminAdapter } from './mock/mockAdmin';

/**
 * Domain Service for VogueSocial Super Admin Console
 * Manages marketplace compliance, product approvals, merchant verification, escrows, and GPU compute.
 */
export const adminService = {
  async getDashboardStats() {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getDashboardStats();
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/dashboard`);
    return res.json();
  },

  async getProducts(filter = 'all', search = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getProducts(filter, search);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/products?filter=${encodeURIComponent(filter)}&q=${encodeURIComponent(search)}`);
    return res.json();
  },

  async updateProductStatus(productId, action, notes = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.updateProductStatus(productId, action, notes);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, action, admin_notes: notes })
    });
    return res.json();
  },

  async getVendors(filter = 'all', search = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getVendors(filter, search);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/vendors?filter=${encodeURIComponent(filter)}&q=${encodeURIComponent(search)}`);
    return res.json();
  },

  async getVendorById(vendorId) {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getVendorById(vendorId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/vendors/${vendorId}`);
    return res.json();
  },

  async updateVendorStatus(vendorId, action, notes = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.updateVendorStatus(vendorId, action, notes);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId, action, admin_notes: notes })
    });
    return res.json();
  },

  async updateVendorBusinessInfo(vendorId, businessData) {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.updateVendorBusinessInfo(vendorId, businessData);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/vendors/${vendorId}/business`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessData)
    });
    return res.json();
  },

  async updateVendorDocumentStatus(vendorId, docId, status, notes = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.updateVendorDocumentStatus(vendorId, docId, status, notes);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/vendors/${vendorId}/documents/${docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    return res.json();
  },

  async updateVendorCommercialTerms(vendorId, terms) {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.updateVendorCommercialTerms(vendorId, terms);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/vendors/${vendorId}/commercials`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(terms)
    });
    return res.json();
  },

  async getDisputes() {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getDisputes();
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/disputes`);
    return res.json();
  },

  async resolveDispute(disputeId, action, notes = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.resolveDispute(disputeId, action, notes);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/disputes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disputeId, action, admin_notes: notes })
    });
    return res.json();
  },

  async getRunPodMetrics() {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getRunPodMetrics();
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/runpod`);
    return res.json();
  },

  async triggerRunPodJob(category = 'tops') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.triggerRunPodJob(category);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/runpod/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category })
    });
    return res.json();
  },

  async getOrders(filter = 'all', search = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getOrders(filter, search);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/orders?filter=${encodeURIComponent(filter)}&q=${encodeURIComponent(search)}`);
    return res.json();
  },

  async releaseOrderEscrow(orderId, notes = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.releaseOrderEscrow(orderId, notes);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/orders/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, notes })
    });
    return res.json();
  },

  async refundOrder(orderId, notes = '') {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.refundOrder(orderId, notes);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/orders/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, notes })
    });
    return res.json();
  },

  async getIntegrationsConfig() {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getIntegrationsConfig();
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/integrations`);
    return res.json();
  },

  async saveIntegrationsConfig(config) {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.saveIntegrationsConfig(config);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/integrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return res.json();
  },

  async getWebhookEvents() {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.getWebhookEvents();
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/integrations/webhooks`);
    return res.json();
  },

  async simulateWebhookEvent(eventType, payload = {}) {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.simulateWebhookEvent(eventType, payload);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/integrations/webhooks/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, payload })
    });
    return res.json();
  },

  async clearWebhookEvents() {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.clearWebhookEvents();
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/integrations/webhooks/clear`, {
      method: 'POST'
    });
    return res.json();
  }
};
