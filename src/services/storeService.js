import { APP_CONFIG, IS_MOCK_MODE } from '../constants/config';
import { mockStoreAdapter } from './mock/mockStores';

/**
 * Domain Service for Merchant Websites & Public Storefronts
 * Handles theme configuration, branding, domains, and public store resolution.
 */
export const storeService = {
  async getStore(handle) {
    if (IS_MOCK_MODE) {
      return mockStoreAdapter.getStoreByHandle(handle);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/store/${encodeURIComponent(handle)}`);
    if (!res.ok) {
      return { success: false, error: 'Store not found' };
    }
    return res.json();
  },

  async getStoreWebsite(vendorId, handle) {
    if (IS_MOCK_MODE) {
      return mockStoreAdapter.getStoreByVendorId(vendorId, handle);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/merchant/website?vendorId=${encodeURIComponent(vendorId || '')}&handle=${encodeURIComponent(handle || '')}`);
    return res.json();
  },

  async saveWebsiteSettings(settings) {
    if (IS_MOCK_MODE) {
      return mockStoreAdapter.saveStore(settings);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/merchant/website`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  async verifyDNS(domainName, currentStore) {
    if (IS_MOCK_MODE) {
      return mockStoreAdapter.verifyDomainDNS(domainName, currentStore);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/merchant/website/verify-dns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain: domainName })
    });
    return res.json();
  }
};
