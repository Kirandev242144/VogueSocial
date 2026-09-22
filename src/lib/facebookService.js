/**
 * Facebook Graph API Real Integration Service
 * Meta Graph API v19.0
 * Handles authenticating, fetching catalog products, and posting products to Facebook & Instagram Shops.
 */

const META_GRAPH_VERSION = 'v19.0';
const META_GRAPH_BASE = `https://graph.facebook.com/${META_GRAPH_VERSION}`;
const LOCAL_STORAGE_KEY = 'vogue_facebook_shop_settings';

export const DEFAULT_FB_SETTINGS = {
  connected: false,
  page_name: 'Studio Label Official',
  page_id: '',
  catalog_id: '',
  catalog_name: 'Studio Label Ready-to-Wear Catalog',
  access_token: '',
  auto_sync: true,
  clothing_only: true,
  last_sync_at: null,
  logs: []
};

/**
 * Get current Facebook Shop settings
 */
export async function getFacebookSettings() {
  try {
    const res = await fetch('/api/merchant/facebook/sync');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.settings) {
        return data.settings;
      }
    }
  } catch (e) {
    console.warn("Backend not reachable, loading from local state", e);
  }

  // Local fallback
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  return DEFAULT_FB_SETTINGS;
}

/**
 * Save Facebook Catalog Settings
 */
export async function saveFacebookSettings(newSettings) {
  try {
    await fetch('/api/merchant/facebook/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
  } catch (e) {
    console.warn("Failed to save settings on backend, persisting locally:", e);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSettings));
  return newSettings;
}

/**
 * Real Meta Graph API: Verify Catalog ID & Page Access Token
 * Endpoint: GET https://graph.facebook.com/v19.0/{catalog_id}
 */
export async function verifyFacebookCatalog(catalogId, accessToken) {
  if (!catalogId || !accessToken) {
    throw new Error('Catalog ID and Page Access Token are required.');
  }

  const cleanCatId = catalogId.trim();
  const cleanToken = accessToken.trim();

  // 1. Try via backend verify endpoint first
  try {
    const res = await fetch('/api/merchant/facebook/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catalog_id: cleanCatId, access_token: cleanToken })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data;
      }
    }
  } catch (e) {
    console.warn("Backend verification endpoint unavailable, trying direct Meta Graph API call...");
  }

  // 2. Direct Meta Graph API call
  const url = `${META_GRAPH_BASE}/${cleanCatId}?fields=id,name,business,product_count&access_token=${cleanToken}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.error) {
    const errMsg = data.error?.message || 'Failed to authenticate with Facebook Graph API.';
    throw new Error(errMsg);
  }

  return {
    success: true,
    connected: true,
    catalog_info: data,
    message: `Connected to Meta Catalog: ${data.name || cleanCatId}`
  };
}

/**
 * Real Meta Graph API: Get Products from Facebook Catalog
 * Endpoint: GET https://graph.facebook.com/v19.0/{catalog_id}/products
 */
export async function getFacebookCatalogProducts(catalogId, accessToken) {
  if (!catalogId || !accessToken) {
    throw new Error('Catalog ID and Access Token are required to fetch Facebook products.');
  }

  const cleanCatId = catalogId.trim();
  const cleanToken = accessToken.trim();

  // Try backend proxy first
  try {
    const res = await fetch(`/api/merchant/facebook/products?catalogId=${cleanCatId}&accessToken=${cleanToken}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.products) {
        return data.products;
      }
    }
  } catch (e) {
    console.warn("Backend proxy failed, fetching directly from Meta Graph API...");
  }

  // Direct Meta Graph API call
  const fields = 'id,retailer_id,name,description,availability,condition,price,sale_price,currency,image_url,url,brand,category';
  const url = `${META_GRAPH_BASE}/${cleanCatId}/products?fields=${fields}&access_token=${cleanToken}&limit=100`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || 'Failed to fetch products from Meta Catalog.');
  }

  return data.data || [];
}

/**
 * Real Meta Graph API: Post a Single Product to Facebook Catalog
 * Endpoint: POST https://graph.facebook.com/v19.0/{catalog_id}/products
 */
export async function postProductToFacebook(catalogId, accessToken, product) {
  if (!catalogId || !accessToken) {
    throw new Error('Catalog ID and Access Token required.');
  }

  const cleanCatId = catalogId.trim();
  const cleanToken = accessToken.trim();

  // Format price in cents (e.g., $340.00 -> 34000)
  const numericPrice = typeof product.price === 'number'
    ? product.price
    : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 49.00;
  const priceInCents = Math.round(numericPrice * 100);

  const payload = new URLSearchParams({
    access_token: cleanToken,
    retailer_id: product.sku || product.id || `VS-${Date.now()}`,
    name: product.name,
    description: product.description || product.name || 'High fashion apparel listing.',
    availability: 'in stock',
    condition: 'new',
    price: String(priceInCents),
    currency: product.currency || 'USD',
    brand: product.brand || 'Studio Label Paris',
    category: `Apparel & Accessories > Clothing > ${product.category || 'Outerwear'}`,
    url: product.url || `https://vogue-social.com/store/studiolabel/product/${product.id}`,
    image_url: product.image_url || product.image || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80'
  });

  const response = await fetch(`${META_GRAPH_BASE}/${cleanCatId}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: payload.toString()
  });

  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error?.message || `Failed to post ${product.name} to Facebook.`);
  }

  return data;
}

/**
 * Sync Multiple Products to Facebook Catalog
 */
export async function syncProductsToFacebook(catalogId, accessToken, products) {
  if (!products || products.length === 0) {
    throw new Error('No products selected for sync.');
  }

  let successCount = 0;
  let failureCount = 0;
  const results = [];

  for (const p of products) {
    try {
      const res = await postProductToFacebook(catalogId, accessToken, p);
      successCount++;
      results.push({ id: p.id, name: p.name, status: 'SUCCESS', fb_id: res.id });
    } catch (err) {
      failureCount++;
      results.push({ id: p.id, name: p.name, status: 'FAILED', error: err.message });
    }
  }

  const logEntry = {
    id: `sync_${Date.now()}`,
    timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    type: 'PUSH_TO_FACEBOOK',
    synced_count: successCount,
    failed_count: failureCount,
    status: failureCount === 0 ? 'SUCCESS' : (successCount > 0 ? 'PARTIAL' : 'FAILED')
  };

  return {
    success: true,
    synced_count: successCount,
    failed_count: failureCount,
    results,
    log: logEntry
  };
}
