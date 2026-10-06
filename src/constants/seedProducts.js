// Pre-seeded Luxury Fashion Garments with Multi-Photo Editorial Galleries from local /Shop_images/
export const SEED_PRODUCTS = [
  {
    id: 'prod_sl_001',
    vendorId: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c', // Studio Label Paris
    name: 'Structured Minimalist Atelier Suit',
    category: 'Outerwear',
    subcategory: 'Suits & Tailoring',
    targetAudience: 'Women',
    sku: 'SL-TRN-001',
    price: 680,
    salePrice: 590,
    currency: 'USD',
    stock: 28,
    status: 'live',
    imageUrl: '/Shop_images/1/basic2-500x750.jpeg',
    backImageUrl: '/Shop_images/1/basic3-500x750.jpeg',
    additional_images: [
      '/Shop_images/1/basic3-500x750.jpeg',
      '/Shop_images/1/basic4-500x750.jpeg',
      '/Shop_images/1/basic5-500x750.jpeg'
    ],
    colors: ['Camel Beige', 'Obsidian Black', 'Cream White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Precision-tailored minimalist atelier suit cut from premium European virgin wool blend. Features clean architectural lines and an empowering modern silhouette.',
    shipping_info: 'Complimentary worldwide express shipping via DHL Express (2-3 business days).',
    return_policy: 'Complimentary 30-day white-glove returns with prepaid courier pickup.',
    createdAt: '2026-09-20T10:00:00Z',
    adminNotes: JSON.stringify({
      colors: ['Camel Beige', 'Obsidian Black', 'Cream White'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      additional_images: [
        '/Shop_images/1/basic3-500x750.jpeg',
        '/Shop_images/1/basic4-500x750.jpeg',
        '/Shop_images/1/basic5-500x750.jpeg'
      ]
    })
  },
  {
    id: 'prod_sl_002',
    vendorId: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c', // Studio Label Paris
    name: 'Knotted Asymmetric Drape Blouse',
    category: 'Tops',
    subcategory: 'Blouses',
    targetAudience: 'Women',
    sku: 'SL-DRS-002',
    price: 420,
    salePrice: null,
    currency: 'USD',
    stock: 19,
    status: 'live',
    imageUrl: '/Shop_images/5/knotted1-500x750.jpeg',
    backImageUrl: '/Shop_images/5/knotted2-500x750.jpeg',
    additional_images: [
      '/Shop_images/5/knotted2-500x750.jpeg',
      '/Shop_images/5/knotted3-500x750.jpeg',
      '/Shop_images/5/knotted4-500x750.jpeg'
    ],
    colors: ['Oatmeal Dune', 'Midnight Noir', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Sculptural luxury blouse featuring an artisanal twist-knot drape over fluid contours. Tailored with French seams and breathable lightweight weave.',
    shipping_info: 'Shipped in archival gift box with garment dust cover.',
    return_policy: '30-day return policy for unworn items with tags intact.',
    createdAt: '2026-09-21T11:00:00Z',
    adminNotes: JSON.stringify({
      colors: ['Oatmeal Dune', 'Midnight Noir', 'Burgundy'],
      sizes: ['XS', 'S', 'M', 'L'],
      additional_images: [
        '/Shop_images/5/knotted2-500x750.jpeg',
        '/Shop_images/5/knotted3-500x750.jpeg',
        '/Shop_images/5/knotted4-500x750.jpeg'
      ]
    })
  },
  {
    id: 'prod_sl_003',
    vendorId: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c', // Studio Label Paris
    name: 'Structured Wool Atelier Overshirt',
    category: 'Outerwear',
    subcategory: 'Jackets',
    targetAudience: 'Unisex',
    sku: 'SL-BLZ-003',
    price: 540,
    salePrice: 470,
    currency: 'USD',
    stock: 14,
    status: 'live',
    imageUrl: '/Shop_images/8/overshirt1-500x750.jpg',
    backImageUrl: '/Shop_images/8/overshirt2-500x750.jpg',
    additional_images: [
      '/Shop_images/8/overshirt2-500x750.jpg',
      '/Shop_images/8/overshirt3-500x750.jpg',
      '/Shop_images/8/overshirt4-500x750.jpg'
    ],
    colors: ['Ochre Tan', 'Charcoal Grey', 'Pinstripe Noir'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Contemporary structured overshirt with horn button placket and fluid drape. Single-breasted front with double chest patch pockets.',
    shipping_info: 'Complimentary shipping & express dispatch.',
    return_policy: 'Free returns within 30 days.',
    createdAt: '2026-09-22T09:30:00Z',
    adminNotes: JSON.stringify({
      colors: ['Ochre Tan', 'Charcoal Grey', 'Pinstripe Noir'],
      sizes: ['S', 'M', 'L', 'XL'],
      additional_images: [
        '/Shop_images/8/overshirt2-500x750.jpg',
        '/Shop_images/8/overshirt3-500x750.jpg',
        '/Shop_images/8/overshirt4-500x750.jpg'
      ]
    })
  },
  {
    id: 'prod_el_001',
    vendorId: 'mch_elena_02', // Elena Couture
    name: 'Scarlet Silk Flounce Evening Gown',
    category: 'Dresses',
    subcategory: 'Evening Wear',
    targetAudience: 'Women',
    sku: 'EC-KNT-001',
    price: 680,
    salePrice: 595,
    currency: 'USD',
    stock: 22,
    status: 'live',
    imageUrl: '/Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg',
    backImageUrl: '/Shop_images/15/1000016314131-Red-RED-1000016314131_02-2100.jpg',
    additional_images: [
      '/Shop_images/15/1000016314131-Red-RED-1000016314131_02-2100.jpg',
      '/Shop_images/15/1000016314131-Red-RED-1000016314131_03-2100.jpg',
      '/Shop_images/15/1000016314131-Red-RED-1000016314131_05-2100.jpg'
    ],
    colors: ['Scarlet Red', 'Crimson Ruby'],
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Statement scarlet flounce gown cut from fluid silk satin. Dramatic tiered silhouette designed for galas and evening red carpets.',
    shipping_info: 'Express courier delivery in 1-2 business days.',
    return_policy: 'Free returns within 30 days.',
    createdAt: '2026-09-22T14:00:00Z',
    adminNotes: JSON.stringify({
      colors: ['Scarlet Red', 'Crimson Ruby'],
      sizes: ['XS', 'S', 'M', 'L'],
      additional_images: [
        '/Shop_images/15/1000016314131-Red-RED-1000016314131_02-2100.jpg',
        '/Shop_images/15/1000016314131-Red-RED-1000016314131_03-2100.jpg',
        '/Shop_images/15/1000016314131-Red-RED-1000016314131_05-2100.jpg'
      ]
    })
  },
  {
    id: 'prod_el_002',
    vendorId: 'mch_elena_02', // Elena Couture
    name: 'Wide-Leg Sartorial Atelier Trousers',
    category: 'Bottoms',
    subcategory: 'Trousers',
    targetAudience: 'Women',
    sku: 'EC-TRS-002',
    price: 380,
    salePrice: 320,
    currency: 'USD',
    stock: 16,
    status: 'live',
    imageUrl: '/Shop_images/13/wideleg1-500x750.jpg',
    backImageUrl: '/Shop_images/13/wideleg2-500x750.jpg',
    additional_images: [
      '/Shop_images/13/wideleg2-500x750.jpg',
      '/Shop_images/13/wideleg3-500x750.jpg'
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
        '/Shop_images/13/wideleg2-500x750.jpg',
        '/Shop_images/13/wideleg3-500x750.jpg'
      ]
    })
  }
];
