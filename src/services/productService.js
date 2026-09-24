import { APP_CONFIG, IS_MOCK_MODE } from '../constants/config';
import { mockProductAdapter } from './mock/mockProducts';

/**
 * Domain Service for Products & Catalog
 * Automatically delegates to Mock Adapter (offline/frontend-only)
 * or Real REST API (when client plugs in backend).
 */
export const productService = {
  async getMerchantProducts(vendorId) {
    if (IS_MOCK_MODE) {
      return mockProductAdapter.getProductsByVendor(vendorId);
    }
    // Future API Adapter
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/merchant/products?vendorId=${encodeURIComponent(vendorId || '')}`);
    return res.json();
  },

  async getAllProducts() {
    if (IS_MOCK_MODE) {
      return mockProductAdapter.getAllProducts();
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/products`);
    return res.json();
  },

  async getPublicProducts() {
    return this.getAllProducts();
  },

  async getProductById(id) {
    if (IS_MOCK_MODE) {
      return mockProductAdapter.getProductById(id);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/products/${encodeURIComponent(id)}`);
    return res.json();
  },

  async createProduct(productData) {
    if (IS_MOCK_MODE) {
      return mockProductAdapter.createProduct(productData);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/merchant/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  async updateProduct(id, productData) {
    if (IS_MOCK_MODE) {
      return mockProductAdapter.updateProduct(id, productData);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/merchant/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  async deleteProduct(id) {
    if (IS_MOCK_MODE) {
      return mockProductAdapter.deleteProduct(id);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/merchant/products?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
