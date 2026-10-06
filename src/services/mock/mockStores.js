import { storageEngine } from './storageEngine';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { APP_CONFIG } from '../../constants/config';
import { mockProductAdapter } from './mockProducts';

const delay = (ms = APP_CONFIG.SIMULATED_NETWORK_DELAY_MS) => new Promise(res => setTimeout(res, ms));

export const mockStoreAdapter = {
  async getStoreByHandle(handle) {
    await delay();
    const cleanHandle = (handle || '').toLowerCase().trim();
    if (!cleanHandle) {
      return { success: false, error: 'Storefront not found' };
    }

    // 1. Check specific handle key in storage
    const specificKey = `${STORAGE_KEYS.STORE_PREFIX}${cleanHandle}`;
    let store = storageEngine.getItem(specificKey, null);

    // 2. Check stores array registry
    if (!store) {
      const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
      store = stores.find(s => (s.store_handle || '').toLowerCase() === cleanHandle || (s.subdomain || '').toLowerCase() === cleanHandle);
    }

    // 3. Check active merchant website if handle matches
    if (!store) {
      const activeWebsite = storageEngine.getItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE, null);
      if (activeWebsite && ((activeWebsite.store_handle || '').toLowerCase() === cleanHandle || (activeWebsite.subdomain || '').toLowerCase() === cleanHandle)) {
        store = activeWebsite;
      }
    }

    if (!store) {
      return { success: false, error: 'Storefront not found' };
    }

    // Fetch live products for this store's vendor
    const vendorId = store.vendor_id || store.vendorId || 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';
    const productsRes = await mockProductAdapter.getProductsByVendor(vendorId);

    return {
      success: true,
      store: {
        ...store,
        store_name: store.store_name || store.storeName || 'Atelier Boutique',
        store_handle: store.store_handle || store.storeHandle || cleanHandle,
        subdomain: store.subdomain || cleanHandle,
        template: store.template || 'modern',
        status: store.status || 'live',
        accent_color: store.accent_color || store.accentColor || '#2563eb',
        hero_image: store.hero_image || store.heroImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
        tagline: store.tagline || 'Modern Tailoring & AI Virtual Fitting Studio',
        custom_domain: store.custom_domain || store.customDomain || `shop.${cleanHandle}.com`,
        domain_status: store.domain_status || store.domainStatus || 'ssl_active'
      },
      products: productsRes.products || []
    };
  },

  async getStoreByVendorId(vendorId, handleFallback) {
    await delay();
    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    let store = stores.find(s => s.vendor_id === vendorId || s.vendorId === vendorId);

    if (!store && handleFallback) {
      const byHandle = await this.getStoreByHandle(handleFallback);
      if (byHandle.success) store = byHandle.store;
    }

    if (!store) {
      store = storageEngine.getItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE, null);
    }

    return {
      success: true,
      website: store
    };
  },

  async saveStore(settings) {
    await delay();
    const handle = (settings.store_handle || settings.storeHandle || settings.subdomain || 'studiolabel').toLowerCase().trim();
    
    // Existing data merge
    const specificKey = `${STORAGE_KEYS.STORE_PREFIX}${handle}`;
    const existing = storageEngine.getItem(specificKey, {});
    const activeWebsite = storageEngine.getItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE, {});

    const updated = {
      ...activeWebsite,
      ...existing,
      ...settings,
      store_handle: handle,
      storeHandle: handle,
      subdomain: handle,
      updated_at: new Date().toISOString()
    };

    // Save under specific key
    storageEngine.setItem(specificKey, updated);
    // Save as active merchant website
    storageEngine.setItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE, updated);

    // Update in stores array
    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    const filteredStores = stores.filter(s => (s.store_handle || '').toLowerCase() !== handle);
    storageEngine.setItem(STORAGE_KEYS.STORES, [updated, ...filteredStores]);

    return {
      success: true,
      website: updated
    };
  },

  async verifyDomainDNS(domainName, currentStore) {
    await delay(600); // simulated network check
    const isConfigured = Boolean(domainName && domainName.includes('.'));

    const updatedRecords = [
      {
        type: 'CNAME',
        host: domainName.startsWith('www.') ? 'www' : domainName.split('.')[0] || 'shop',
        target: 'cname.voguesocial.com',
        ttl: '3600',
        status: isConfigured ? 'Verified ✓' : 'Pending Verification',
        verified: isConfigured
      },
      {
        type: 'A',
        host: '@',
        target: '76.76.21.21',
        ttl: '3600',
        status: isConfigured ? 'Verified ✓' : 'Pending Verification',
        verified: isConfigured
      },
      {
        type: 'TXT',
        host: '_vogue-challenge',
        target: `vogue-verification=vs_live_${Math.random().toString(36).substring(2, 11)}`,
        ttl: '3600',
        status: isConfigured ? 'Verified ✓' : 'Pending Verification',
        verified: isConfigured
      }
    ];

    const updatedStore = {
      ...currentStore,
      custom_domain: domainName,
      customDomain: domainName,
      domain_status: isConfigured ? 'ssl_active' : 'error',
      domainStatus: isConfigured ? 'ssl_active' : 'error',
      dns_records: updatedRecords,
      ssl_certificate: isConfigured ? {
        issuer: "Let's Encrypt / Cloudflare Edge CA",
        status: 'Active · Auto-Renewing',
        protocol: 'TLS 1.3 (HTTPS)',
        expires_at: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
      } : null
    };

    await this.saveStore(updatedStore);
    return updatedStore;
  }
};
