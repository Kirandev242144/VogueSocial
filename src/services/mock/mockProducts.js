import { storageEngine } from './storageEngine';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { APP_CONFIG } from '../../constants/config';

// Simulate slight async network delay
const delay = (ms = APP_CONFIG.SIMULATED_NETWORK_DELAY_MS) => new Promise(res => setTimeout(res, ms));

export const mockProductAdapter = {
  async getProductsByVendor(vendorId) {
    await delay();
    const all = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const targetVendor = vendorId || 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';
    const filtered = all.filter(p => p.vendorId === targetVendor || p.vendor_id === targetVendor);
    return {
      success: true,
      count: filtered.length,
      products: filtered
    };
  },

  async getAllProducts() {
    await delay();
    const all = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    return {
      success: true,
      count: all.length,
      products: all
    };
  },

  async getProductById(id) {
    await delay();
    const all = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const found = all.find(p => p.id === id);
    if (!found) {
      return { success: false, error: 'Product not found' };
    }
    return { success: true, product: found };
  },

  async createProduct(productData) {
    await delay();
    const all = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);

    const id = productData.id || `prod_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const newProduct = {
      ...productData,
      id,
      vendorId: productData.vendorId || productData.vendor_id || 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
      status: productData.status || 'live',
      createdAt: productData.createdAt || new Date().toISOString(),
      stock: productData.stock || 25,
      additional_images: productData.additional_images || []
    };

    const updated = [newProduct, ...all.filter(p => p.id !== id)];
    storageEngine.setItem(STORAGE_KEYS.PRODUCTS, updated);

    return {
      success: true,
      product: newProduct
    };
  },

  async updateProduct(id, productData) {
    await delay();
    const all = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const index = all.findIndex(p => p.id === id);
    if (index === -1) {
      return { success: false, error: 'Product not found to update' };
    }

    const updatedProduct = {
      ...all[index],
      ...productData,
      id,
      updatedAt: new Date().toISOString()
    };

    all[index] = updatedProduct;
    storageEngine.setItem(STORAGE_KEYS.PRODUCTS, all);

    return {
      success: true,
      product: updatedProduct
    };
  },

  async deleteProduct(id) {
    await delay();
    const all = storageEngine.getItem(STORAGE_KEYS.PRODUCTS, []);
    const filtered = all.filter(p => p.id !== id);
    storageEngine.setItem(STORAGE_KEYS.PRODUCTS, filtered);

    return {
      success: true,
      message: 'Product deleted successfully'
    };
  }
};
