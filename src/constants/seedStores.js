// Pre-seeded Boutique Storefront Configurations & Domains
export const SEED_STORES = [
  {
    vendor_id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
    status: 'live',
    template: 'modern',
    store_name: 'Studio Label Paris',
    store_handle: 'studiolabel',
    subdomain: 'studiolabel',
    custom_domain: 'shop.studiolabelparis.com',
    domain_status: 'ssl_active',
    tagline: 'Modern Tailoring & AI Virtual Fitting Studio',
    description: 'Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Every garment in our collection is precision-crafted from European textiles and optimized for zero-latency in-browser virtual try-on.',
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
      { type: 'CNAME', host: 'shop', target: 'cname.voguesocial.com', ttl: '3600', status: 'Verified ✓', verified: true },
      { type: 'A', host: '@', target: '76.76.21.21', ttl: '3600', status: 'Verified ✓', verified: true },
      { type: 'TXT', host: '_vogue-challenge', target: 'vogue-verification=vs_live_9f83a21b47', ttl: '3600', status: 'Verified ✓', verified: true }
    ],
    ssl_certificate: {
      issuer: "Let's Encrypt / Cloudflare Edge CA",
      status: 'Active · Auto-Renewing',
      protocol: 'TLS 1.3 (HTTPS Strict Transport Security)',
      expires_at: '2027-03-24'
    }
  },
  {
    vendor_id: 'mch_elena_02',
    status: 'live',
    template: 'minimal',
    store_name: 'Elena Couture',
    store_handle: 'elenacouture',
    subdomain: 'elenacouture',
    custom_domain: 'shop.elenacouture.com',
    domain_status: 'ssl_active',
    tagline: 'Atelier Tailoring & Contemporary Evening Wear',
    description: 'Bespoke tailoring, fine Italian silks, and sculptural outerwear curated for timeless modern elegance.',
    hero_image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
    logo_url: '',
    accent_color: '#0f172a',
    email: 'elena@voguesocial.com',
    phone: '+1 212 555 0192',
    analytics: {
      visitors_7d: 9140,
      product_views: 21400,
      add_to_cart: 2180,
      orders: 640,
      revenue: 142800
    },
    dns_records: [
      { type: 'CNAME', host: 'shop', target: 'cname.voguesocial.com', ttl: '3600', status: 'Verified ✓', verified: true },
      { type: 'A', host: '@', target: '76.76.21.21', ttl: '3600', status: 'Verified ✓', verified: true }
    ],
    ssl_certificate: {
      issuer: "Let's Encrypt / Cloudflare Edge CA",
      status: 'Active · Auto-Renewing',
      protocol: 'TLS 1.3 (HTTPS)',
      expires_at: '2027-04-15'
    }
  }
];
