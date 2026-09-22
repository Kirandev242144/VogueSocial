// Storefront Data Store & DNS Engine for VogueSocial
// Handles subdomains (*.voguesocial.com), Custom Domains & DNS Mapping, and Modern E-Shop Catalog

export const STORE_PRODUCTS = [
  {
    id: 'prod-modern-1',
    name: 'Structured Double-Breasted Trench Coat',
    category: 'Outerwear',
    price: 520,
    sale_price: 460,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80'
    ],
    description: 'Precision-cut from weather-resistant Italian cotton gabardine. Features epaulets, storm flap, horn buttons, and a belted waist for a modern cinematic silhouette.',
    colors: ['Camel', 'Obsidian Black', 'Stone Grey'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    in_stock: true,
    stock_count: 24,
    badge: 'Trending · Try-On Ready',
    rating: 4.9,
    reviews_count: 88,
  },
  {
    id: 'prod-modern-2',
    name: 'Silk Charmeuse Bias-Cut Slip Dress',
    category: 'Dresses',
    price: 340,
    sale_price: 290,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'
    ],
    description: '100% 19-momme Mulberry silk cut on the bias to drape naturally around contours. Finished with delicate French seams and adjustable micro-spaghetti straps.',
    colors: ['Champagne', 'Midnight Navy', 'Emerald'],
    sizes: ['XS', 'S', 'M', 'L'],
    in_stock: true,
    stock_count: 18,
    badge: 'Best Seller',
    rating: 5.0,
    reviews_count: 142,
  },
  {
    id: 'prod-modern-3',
    name: 'Minimalist Relaxed Cashmere Knit',
    category: 'Knitwear',
    price: 290,
    sale_price: null,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'
    ],
    description: 'Pure Grade-A Mongolian cashmere spun into a 12-gauge jersey knit. Cloud-like softness with ribbed trim and dropped shoulders for effortless day-to-evening dressing.',
    colors: ['Oatmeal', 'Heather Grey', 'Cream White'],
    sizes: ['S', 'M', 'L', 'XL'],
    in_stock: true,
    stock_count: 32,
    badge: 'Essential',
    rating: 4.8,
    reviews_count: 74,
  },
  {
    id: 'prod-modern-4',
    name: 'Italian Wool Pleated Wide-Leg Trouser',
    category: 'Tailored Suiting',
    price: 260,
    sale_price: null,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'
    ],
    description: 'Tailored from virgin worsted wool woven in Biella, Italy. High-rise double front pleats flow down into an elongated wide-leg hem with sharp creases.',
    colors: ['Charcoal Grey', 'Deep Navy', 'Muted Olive'],
    sizes: ['28', '30', '32', '34', '36'],
    in_stock: true,
    stock_count: 15,
    badge: 'Editor Pick',
    rating: 4.9,
    reviews_count: 61,
  },
  {
    id: 'prod-modern-5',
    name: 'Sculpted Nappa Leather Biker Jacket',
    category: 'Outerwear',
    price: 780,
    sale_price: 690,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'
    ],
    description: 'Full-grain lambskin nappa with custom brushed silver hardware. Clean asymmetrical zip fastening and satin interior lining with internal card pocket.',
    colors: ['Jet Black', 'Vintage Cognac'],
    sizes: ['XS', 'S', 'M', 'L'],
    in_stock: true,
    stock_count: 8,
    badge: 'Limited Run',
    rating: 5.0,
    reviews_count: 39,
  },
  {
    id: 'prod-modern-6',
    name: 'Oversized Peaked-Lapel Virgin Wool Blazer',
    category: 'Tailored Suiting',
    price: 440,
    sale_price: null,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&q=80'
    ],
    description: 'Architectural boyfriend tailoring with pronounced shoulder pads, peaked satin lapels, and horn buttons. Perfect for layering over slip dresses or denim.',
    colors: ['Pure Black', 'Camel Houndstooth'],
    sizes: ['XS', 'S', 'M', 'L'],
    in_stock: true,
    stock_count: 19,
    badge: 'New Season',
    rating: 4.9,
    reviews_count: 53,
  },
  {
    id: 'prod-modern-7',
    name: 'Ribbed Seamless Contour Bodysuit',
    category: 'Tops',
    price: 120,
    sale_price: 95,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'
    ],
    description: 'Micro-ribbed compression knit that sculpts without pinching. Breathable moisture-wicking blend with thong back and snap closure.',
    colors: ['Ivory', 'Espresso', 'Black'],
    sizes: ['XS', 'S', 'M', 'L'],
    in_stock: true,
    stock_count: 45,
    badge: 'Try-On Ready',
    rating: 4.7,
    reviews_count: 110,
  },
  {
    id: 'prod-modern-8',
    name: 'Pleated High-Waisted A-Line Midi Skirt',
    category: 'Dresses',
    price: 220,
    sale_price: null,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80'
    ],
    description: 'Knife-pleated Japanese crepe that holds sharp geometric definition with movement. Elasticized grosgrain waistband with hidden side zipper.',
    colors: ['Champagne Pearl', 'Midnight Slate'],
    sizes: ['XS', 'S', 'M', 'L'],
    in_stock: true,
    stock_count: 22,
    badge: 'Popular',
    rating: 4.8,
    reviews_count: 45,
  }
];

export const DEFAULT_MERCHANT_STORE = {
  status: 'live',
  template: 'modern',
  store_name: 'Studio Label Paris',
  store_handle: 'studiolabel',
  subdomain: 'studiolabel',
  custom_domain: 'shop.studiolabelparis.com',
  domain_status: 'ssl_active',
  tagline: 'Modern Tailoring & AI Virtual Fitting Studio',
  description: 'Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Every garment in our collection is precision-crafted from sustainably sourced European textiles and optimized for zero-latency in-browser virtual try-on.',
  hero_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
  logo_url: '',
  accent_color: '#2563eb',
  email: 'concierge@studiolabelparis.com',
  phone: '+33 1 42 68 55 00',
  analytics: {
    visitors_7d: 18420,
    product_views: 42910,
    add_to_cart: 4890,
    orders: 1240,
    revenue: 284950
  },
  dns_records: [
    {
      type: 'CNAME',
      host: 'shop',
      target: 'cname.voguesocial.com',
      ttl: '3600',
      status: 'Verified ✓',
      verified: true
    },
    {
      type: 'A',
      host: '@',
      target: '76.76.21.21',
      ttl: '3600',
      status: 'Verified ✓',
      verified: true
    },
    {
      type: 'TXT',
      host: '_vogue-challenge',
      target: 'vogue-verification=vs_live_9f83a21b47',
      ttl: '3600',
      status: 'Verified ✓',
      verified: true
    }
  ],
  ssl_certificate: {
    issuer: "Let's Encrypt / Cloudflare Edge CA",
    status: 'Active · Auto-Renewing',
    protocol: 'TLS 1.3 (HTTPS Strict Transport Security)',
    expires_at: '2027-03-24'
  }
};

// Retrieve store by handle from localStorage or default
export function getStoreByHandle(handle) {
  if (typeof window === 'undefined') return { store: DEFAULT_MERCHANT_STORE, products: STORE_PRODUCTS };

  const cleanHandle = (handle || '').toLowerCase().trim();

  // Check specific handle in localStorage
  const specificKey = `vogue_website_${cleanHandle}`;
  const specificData = localStorage.getItem(specificKey);
  if (specificData) {
    try {
      const parsed = JSON.parse(specificData);
      return { store: parsed, products: STORE_PRODUCTS };
    } catch (e) {
      console.error('Failed to parse specific store data', e);
    }
  }

  // Check generic merchant website in localStorage
  const merchantData = localStorage.getItem('vogue_merchant_website');
  if (merchantData) {
    try {
      const parsed = JSON.parse(merchantData);
      if (parsed.store_handle === cleanHandle || !cleanHandle || cleanHandle === 'studiolabel') {
        return { store: parsed, products: STORE_PRODUCTS };
      }
    } catch (e) {
      console.error('Failed to parse merchant store data', e);
    }
  }

  // Return default store matching or fallback
  return {
    store: {
      ...DEFAULT_MERCHANT_STORE,
      store_handle: cleanHandle || DEFAULT_MERCHANT_STORE.store_handle,
      subdomain: cleanHandle || DEFAULT_MERCHANT_STORE.subdomain,
    },
    products: STORE_PRODUCTS
  };
}

// Save store settings to localStorage
export function saveMerchantStore(settings) {
  if (typeof window === 'undefined') return settings;
  const data = {
    ...DEFAULT_MERCHANT_STORE,
    ...settings,
    updated_at: new Date().toISOString()
  };
  localStorage.setItem('vogue_merchant_website', JSON.stringify(data));
  if (data.store_handle) {
    localStorage.setItem(`vogue_website_${data.store_handle.toLowerCase()}`, JSON.stringify(data));
  }
  return data;
}

// Simulate DNS resolution check
export async function verifyDomainDNS(domainName, currentStore) {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));

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
    domain_status: isConfigured ? 'ssl_active' : 'error',
    dns_records: updatedRecords,
    ssl_certificate: isConfigured ? {
      issuer: "Let's Encrypt / Cloudflare Edge CA",
      status: 'Active · Auto-Renewing',
      protocol: 'TLS 1.3 (HTTPS)',
      expires_at: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]
    } : null
  };

  saveMerchantStore(updatedStore);
  return updatedStore;
}
