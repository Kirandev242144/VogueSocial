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

  async updateVendorStatus(vendorId, action) {
    if (IS_MOCK_MODE) {
      return mockAdminAdapter.updateVendorStatus(vendorId, action);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/admin/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId, action })
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
  }
};
