// Pre-seeded Luxury Fashion Garments with Multi-Photo Editorial Galleries
export const SEED_PRODUCTS = [
  {
    id: 'prod_sl_001',
    vendorId: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c', // Studio Label Paris
    name: 'Architectural Wool Trench Coat',
    category: 'Outerwear',
    subcategory: 'Coats',
    targetAudience: 'Women',
    sku: 'SL-TRN-001',
    price: 680,
    salePrice: 590,
    currency: 'USD',
    stock: 28,
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'
    ],
    colors: ['Camel', 'Obsidian Black', 'Cream White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Precision-tailored double-breasted trench cut from heavy Italian virgin wool. Features storm flap, horn buttons, and an architectural belted waist designed for an empowering feminine silhouette.',
    shipping_info: 'Complimentary worldwide express shipping via DHL Express (2-3 business days).',
    return_policy: 'Complimentary 30-day white-glove returns with prepaid courier pickup.',
    createdAt: '2026-09-20T10:00:00Z',
    adminNotes: JSON.stringify({
      colors: ['Camel', 'Obsidian Black', 'Cream White'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      additional_images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'
      ]
    })
  },
  {
    id: 'prod_sl_002',
    vendorId: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c', // Studio Label Paris
    name: 'Bias-Cut Mulberry Silk Slip Dress',
    category: 'Dresses',
    subcategory: 'Evening Wear',
    targetAudience: 'Women',
    sku: 'SL-DRS-002',
    price: 420,
    salePrice: null,
    currency: 'USD',
    stock: 19,
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80',
    additional_images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80'
    ],
    colors: ['Champagne', 'Midnight Noir', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: '100% 22-momme Grade 6A mulberry silk cut on the bias to drape effortlessly over contours. Features delicate French seams and adjustable micro-straps.',
    shipping_info: 'Shipped in archival gift box with garment dust cover.',
    return_policy: '30-day return policy for unworn items with tags intact.',
    createdAt: '2026-09-21T11:00:00Z',
    adminNotes: JSON.stringify({
      colors: ['Champagne', 'Midnight Noir', 'Burgundy'],
      sizes: ['XS', 'S', 'M', 'L'],
      additional_images: [
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80'
      ]
    })
  },
  {
    id: 'prod_sl_003',
    vendorId: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c', // Studio Label Paris
    name: 'Oversized Sculptural Wool Blazer',
    category: 'Outerwear',
    subcategory: 'Blazers',
    targetAudience: 'Unisex',
    sku: 'SL-BLZ-003',
    price: 540,
    salePrice: 470,
    currency: 'USD',
    stock: 14,
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    backImageUrl: '',
    additional_images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'
    ],
    colors: ['Charcoal Grey', 'Pinstripe Noir', 'Sand Dune'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Deconstructed tailored blazer with strong padded shoulders and fluid drape. Single-breasted front with horn closure and interior satin lining.',
    shipping_info: 'Complimentary shipping & express dispatch.',
    return_policy: 'Free returns within 30 days.',
    createdAt: '2026-09-22T09:30:00Z',
    adminNotes: JSON.stringify({
      colors: ['Charcoal Grey', 'Pinstripe Noir', 'Sand Dune'],
      sizes: ['S', 'M', 'L', 'XL'],
      additional_images: [
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80'
      ]
    })
  },
  {
    id: 'prod_el_001',
    vendorId: 'mch_elena_02', // Elena Couture
    name: 'Cashmere Knit Turtleneck Sweater',
    category: 'Knitwear',
    subcategory: 'Sweaters',
    targetAudience: 'Women',
    sku: 'EC-KNT-001',
    price: 360,
    salePrice: null,
    currency: 'USD',
    stock: 22,
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
    backImageUrl: '',
    additional_images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80'
    ],
    colors: ['Oatmeal', 'Espresso', 'Snow White'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Sumptuous 2-ply Mongolian cashmere spun to airy cloud perfection. Dropped shoulders, ribbed cuffs, and a cozy high collar.',
    shipping_info: 'Express courier delivery in 1-2 business days.',
    return_policy: 'Free returns within 30 days.',
    createdAt: '2026-09-22T14:00:00Z',
    adminNotes: JSON.stringify({
      colors: ['Oatmeal', 'Espresso', 'Snow White'],
      sizes: ['XS', 'S', 'M', 'L'],
      additional_images: [
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80'
      ]
    })
  },
  {
    id: 'prod_el_002',
    vendorId: 'mch_elena_02', // Elena Couture
    name: 'Pleated High-Waist Wool Trousers',
    category: 'Bottoms',
    subcategory: 'Trousers',
    targetAudience: 'Women',
    sku: 'EC-TRS-002',
    price: 380,
    salePrice: 320,
    currency: 'USD',
    stock: 16,
    status: 'live',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    backImageUrl: '',
    additional_images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80'
    ],
    colors: ['Olive Drab', 'Black', 'Taupe'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Wide-leg high-rise trousers crafted from lightweight tropical wool. Double front pleats with sharp center crease and discreet side slash pockets.',
    shipping_info: 'Worldwide express shipping.',
    return_policy: 'Free 30-day returns.',
    createdAt: '2026-09-22T15:30:00Z',
    adminNotes: JSON.stringify({
      colors: ['Olive Drab', 'Black', 'Taupe'],
      sizes: ['XS', 'S', 'M', 'L'],
      additional_images: [
        'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80'
      ]
    })
  }
];
