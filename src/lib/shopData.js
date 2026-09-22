// Shop Catalog Data for VogueSocial AI Stylist Experience

export const CHARACTERS = [
  {
    id: 'you',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
    description: 'Athletic build · 172cm · Size S/M',
    photo: null,
    gender: 'woman',
    weight: 60,
    height: 165,
    bodyType: 'Hourglass',
    styleDesc: 'Modern minimalist with a touch of streetwear',
    virtualTryOns: [],
    tryonPhotos: [
      '/Shop_images/3/dressblack1-1-500x750.jpeg',
      '/Shop_images/1/basic2-500x750.jpeg'
    ],
    savedOutfits: []
  },
  {
    id: 'ankita',
    name: 'Ankita',
    avatar: '/Shop_images/1/basic2-500x750.jpeg',
    description: 'Milanese aesthetic · Size S',
    photo: '/Shop_images/1/basic2-500x750.jpeg',
    gender: 'woman',
    weight: 54,
    height: 175,
    bodyType: 'Rectangle',
    styleDesc: 'Milanese avant-garde minimalism with peaked lapels and virgin wool textures',
    virtualTryOns: [
      {
        id: 'tryon-ank-1',
        name: 'Structured Wool Blazer',
        price: '$280.00',
        image: '/Shop_images/1/basic2-500x750.jpeg',
        date: 'Yesterday'
      }
    ],
    tryonPhotos: [
      '/Shop_images/1/basic2-500x750.jpeg',
      '/Shop_images/1/basic3-500x750.jpeg'
    ],
    savedOutfits: [
      {
        id: 'saved-ank-1',
        name: 'Milan Runway Suit',
        price: '$475.00',
        image: '/Shop_images/1/basic2-500x750.jpeg'
      }
    ]
  },
  {
    id: 'elena',
    name: 'Elena',
    avatar: '/Shop_images/3/dressblack2-500x750.jpeg',
    description: 'Contouring silhouette · Size S',
    photo: '/Shop_images/3/dressblack2-500x750.jpeg',
    gender: 'woman',
    weight: 52,
    height: 170,
    bodyType: 'Hourglass',
    styleDesc: 'Liquid Mulberry silk evening gowns and contouring monochrome silhouettes',
    virtualTryOns: [
      {
        id: 'tryon-ele-1',
        name: 'Midnight Silk Evening Dress',
        price: '$320.00',
        image: '/Shop_images/3/dressblack1-1-500x750.jpeg',
        date: '2 days ago'
      }
    ],
    tryonPhotos: [
      '/Shop_images/3/dressblack1-1-500x750.jpeg',
      '/Shop_images/3/dressblack2-500x750.jpeg'
    ],
    savedOutfits: [
      {
        id: 'saved-ele-1',
        name: 'Evening Gala Look',
        price: '$320.00',
        image: '/Shop_images/3/dressblack1-1-500x750.jpeg'
      }
    ]
  },
  {
    id: 'julian',
    name: 'Julian',
    avatar: '/Shop_images/8/overshirt1-500x750.jpg',
    description: 'Tailored streetwear · Size M',
    photo: '/Shop_images/8/overshirt1-500x750.jpg',
    gender: 'man',
    weight: 74,
    height: 182,
    bodyType: 'Athletic',
    styleDesc: 'Tailored urban streetwear, corduroy layering and relaxed cargo silhouettes',
    virtualTryOns: [
      {
        id: 'tryon-jul-1',
        name: 'Utility Corduroy Overshirt',
        price: '$130.00',
        image: '/Shop_images/8/overshirt1-500x750.jpg',
        date: '3 days ago'
      }
    ],
    tryonPhotos: [
      '/Shop_images/8/overshirt1-500x750.jpg',
      '/Shop_images/9/pocketmen1-500x750.jpeg'
    ],
    savedOutfits: [
      {
        id: 'saved-jul-1',
        name: 'Corduroy Fall Street Fit',
        price: '$240.00',
        image: '/Shop_images/8/overshirt1-500x750.jpg'
      }
    ]
  }
];

export const CATEGORIES = [
  { id: 'tops', label: 'Tops', count: 6 },
  { id: 'bottoms', label: 'Bottoms', count: 4 },
  { id: 'outerwear', label: 'Outerwear', count: 3 },
  { id: 'dresses', label: 'Dresses', count: 5 },
  { id: 'shoes', label: 'Shoes', count: 1 }
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export const SHOP_PRODUCTS = [
  {
    id: 'post-1',
    name: 'Structured Wool Blazer',
    shortName: 'Structured Wool Blazer',
    price: 280.00,
    priceDisplay: '$280.00',
    brand: 'Ankita Manot',
    rating: 4.8,
    reviewsCount: 128,
    category: 'outerwear',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#e5e7eb', '#1e293b'],
    image: '/Shop_images/1/basic2-500x750.jpeg',
    secondaryImage: '/Shop_images/1/basic3-500x750.jpeg',
    isNew: true,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Milanese avant-garde silhouette crafted from virgin wool with peaked lapels.'
  },
  {
    id: 'post-2',
    name: 'Summer Breeze Set',
    shortName: 'Summer Breeze Set',
    price: 115.00,
    priceDisplay: '$115.00',
    brand: 'Style Diva',
    rating: 4.5,
    reviewsCount: 95,
    category: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#ffffff', '#cbd5e1'],
    image: '/Shop_images/2/cup1-500x750.jpeg',
    secondaryImage: '/Shop_images/2/cup2-500x750.jpeg',
    isNew: false,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Lightweight breathable cotton long sleeve with signature coastal typographic prints.'
  },
  {
    id: 'post-3',
    name: 'Midnight Silk Evening Dress',
    shortName: 'Midnight Silk Dress',
    price: 320.00,
    priceDisplay: '$320.00',
    brand: 'Urban Chic',
    rating: 4.9,
    reviewsCount: 210,
    category: 'dresses',
    sizes: ['XS', 'S', 'M'],
    colors: ['#000000', '#1e293b'],
    image: '/Shop_images/3/dressblack1-1-500x750.jpeg',
    secondaryImage: '/Shop_images/3/dressblack2-500x750.jpeg',
    isNew: false,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Pure silk evening maxi featuring subtle side slit and lustrous midnight sheen.'
  },
  {
    id: 'post-4',
    name: 'Vintage Graphic Oversized Tee',
    shortName: 'Graphic Oversized Tee',
    price: 48.00,
    priceDisplay: '$48.00',
    brand: 'Street Aura',
    rating: 4.6,
    reviewsCount: 52,
    category: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#0f172a', '#f8fafc'],
    image: '/Shop_images/4/graphic1-500x750.jpg',
    secondaryImage: '/Shop_images/4/graphic2-500x750.jpg',
    isNew: true,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Vintage washed heavy cotton with retro artwork and dropped shoulder silhouette.'
  },
  {
    id: 'post-5',
    name: 'Knotted Casual Tee',
    shortName: 'Knotted Casual Tee',
    price: 55.00,
    priceDisplay: '$55.00',
    brand: 'Trends Today',
    rating: 4.2,
    reviewsCount: 34,
    category: 'tops',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#f8fafc', '#fed7aa'],
    image: '/Shop_images/5/knotted1-500x750.jpeg',
    secondaryImage: '/Shop_images/5/knotted2-500x750.jpeg',
    isNew: false,
    isTrending: false,
    isSuggested: true,
    matchReason: 'Casual fits for everyday comfort with cinched front tie.'
  },
  {
    id: 'post-6',
    name: 'Sculpting Performance Leggings',
    shortName: 'Sculpting Leggings',
    price: 85.00,
    priceDisplay: '$85.00',
    brand: 'Fashion Forward',
    rating: 4.7,
    reviewsCount: 45,
    category: 'bottoms',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#1e293b', '#000000'],
    image: '/Shop_images/6/leggings1-500x750.jpeg',
    secondaryImage: '/Shop_images/6/leggings2-500x750.jpeg',
    isNew: false,
    isTrending: true,
    isSuggested: true,
    matchReason: 'High-waisted compression contouring with premium active stretch.'
  },
  {
    id: 'post-7',
    name: 'Tech Nylon Windbreaker Jacket',
    shortName: 'Nylon Windbreaker',
    price: 175.00,
    priceDisplay: '$175.00',
    brand: 'Urban Chic',
    rating: 4.7,
    reviewsCount: 62,
    category: 'outerwear',
    sizes: ['S', 'M', 'L'],
    colors: ['#0f172a', '#334155'],
    image: '/Shop_images/7/nylon1-500x750.jpg',
    secondaryImage: '/Shop_images/7/nylon2-500x750.jpg',
    isNew: true,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Weatherproof ripstop technical shell with concealed zip pockets.'
  },
  {
    id: 'post-8',
    name: 'Utility Corduroy Overshirt',
    shortName: 'Corduroy Overshirt',
    price: 130.00,
    priceDisplay: '$130.00',
    brand: 'Mens Edit',
    rating: 4.8,
    reviewsCount: 78,
    category: 'outerwear',
    sizes: ['M', 'L', 'XL'],
    colors: ['#78350f', '#d97706'],
    image: '/Shop_images/8/overshirt1-500x750.jpg',
    secondaryImage: '/Shop_images/8/overshirt2-500x750.jpg',
    isNew: false,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Thick wale corduroy tailored with chest flap pockets for relaxed layering.'
  },
  {
    id: 'post-9',
    name: 'Cargo Pocket Trousers',
    shortName: 'Cargo Pocket Trousers',
    price: 110.00,
    priceDisplay: '$110.00',
    brand: 'Mens Edit',
    rating: 4.6,
    reviewsCount: 67,
    category: 'bottoms',
    sizes: ['M', 'L', 'XL'],
    colors: ['#d97706', '#475569'],
    image: '/Shop_images/9/pocketmen1-500x750.jpeg',
    secondaryImage: '/Shop_images/9/pocketmen3-500x750.jpeg',
    isNew: false,
    isTrending: false,
    isSuggested: true,
    matchReason: 'Functional cargo pockets with utilitarian relaxed taper.'
  },
  {
    id: 'post-10',
    name: 'Distressed Boyfriend Jeans',
    shortName: 'Distressed Jeans',
    price: 160.00,
    priceDisplay: '$160.00',
    brand: 'Denim Cult',
    rating: 4.8,
    reviewsCount: 89,
    category: 'bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#93c5fd', '#3b82f6'],
    image: '/Shop_images/10/ripped1-500x750.jpeg',
    secondaryImage: '/Shop_images/10/ripped2-500x750.jpeg',
    isNew: false,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Authentic 90s vintage wash with subtle knee distressing.'
  },
  {
    id: 'post-11',
    name: 'Bell Sleeve Blouse',
    shortName: 'Bell Sleeve Blouse',
    price: 145.00,
    priceDisplay: '$145.00',
    brand: 'Sleeve Story',
    rating: 4.8,
    reviewsCount: 134,
    category: 'tops',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#ffffff', '#fce7f3'],
    image: '/Shop_images/11/sleev1-500x750.jpeg',
    secondaryImage: '/Shop_images/11/sleev2-500x750.jpeg',
    isNew: true,
    isTrending: false,
    isSuggested: true,
    matchReason: 'Dramatic flare bell sleeves with delicate gathers and pearl buttons.'
  },
  {
    id: 'post-12',
    name: 'Embroidered Slogan Sweatshirt',
    shortName: 'Slogan Sweatshirt',
    price: 68.00,
    priceDisplay: '$68.00',
    brand: 'Street Culture',
    rating: 4.5,
    reviewsCount: 41,
    category: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1e293b', '#cbd5e1'],
    image: '/Shop_images/12/slogan1-500x750.jpg',
    secondaryImage: '/Shop_images/12/slogan2-500x750.jpg',
    isNew: true,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Cozy French terry sweatshirt with precision tonal slogan embroidery.'
  },
  {
    id: 'post-13',
    name: 'Pleated Wide-Leg Trousers',
    shortName: 'Pleated Trousers',
    price: 195.00,
    priceDisplay: '$195.00',
    brand: 'Ankita Manot',
    rating: 4.8,
    reviewsCount: 57,
    category: 'bottoms',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#f5f5f4', '#e7e5e4'],
    image: '/Shop_images/13/wideleg1-500x750.jpg',
    secondaryImage: '/Shop_images/13/wideleg2-500x750.jpg',
    isNew: true,
    isTrending: true,
    isSuggested: true,
    matchReason: 'High-waisted pleated wide trousers tailored in Italian wool-silk blend.'
  },
  {
    id: 'post-14',
    name: 'Women Halter Neck Printed Jumpsuit',
    shortName: 'Printed Halter Jumpsuit',
    price: 65.00,
    priceDisplay: '$65.00',
    brand: 'SummerVibes',
    rating: 4.6,
    reviewsCount: 56,
    category: 'dresses',
    sizes: ['S', 'M', 'L'],
    colors: ['#f59e0b', '#10b981'],
    image: '/Shop_images/14/bTgDVAex_00915cef3b634c61a7a77980d8384727.jpg',
    secondaryImage: '/Shop_images/14/u97PsqkV_1c92d329f65c42d4a0590ecd2690b550.jpg',
    isNew: false,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Vibrant summer print with halter neck and flowy silhouette.'
  },
  {
    id: 'post-15',
    name: 'Women Solid Shirt Dress with Belt',
    shortName: 'Solid Shirt Dress',
    price: 78.00,
    priceDisplay: '$78.00',
    brand: 'ChicEssentials',
    rating: 4.7,
    reviewsCount: 42,
    category: 'dresses',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#dc2626', '#b91c1c'],
    image: '/Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg',
    secondaryImage: '/Shop_images/15/1000016314131-Red-RED-1000016314131_02-2100.jpg',
    isNew: true,
    isTrending: false,
    isSuggested: true,
    matchReason: 'Versatile belted shirt dress in crimson red for office to evening.'
  },
  {
    id: 'post-16',
    name: 'Chemistry Floral Print Midi Dress',
    shortName: 'Chemistry Midi Dress',
    price: 89.00,
    priceDisplay: '$89.00',
    brand: 'Chemistry',
    rating: 4.8,
    reviewsCount: 64,
    category: 'dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#1e40af', '#ec4899'],
    image: '/Shop_images/16/2062af47-4098-4cc2-9e3f-f36ebca76b881725273460897-Chemistry-Women-Dresses-9631725273460568-5.jpg',
    secondaryImage: '/Shop_images/16/9fe85a3b-34fb-4fc6-96f5-16fb2e2fcc501725273460948-Chemistry-Women-Dresses-9631725273460568-1.jpg',
    isNew: true,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Chic floral midi dress designed for effortless comfort and fluid drape.'
  },
  {
    id: 'post-17',
    name: 'No Human Is Illegal Barbed Wire T-Shirt',
    shortName: 'No Human Is Illegal Tee',
    price: 35.00,
    priceDisplay: '$35.00',
    brand: 'Vogue Social Impact',
    rating: 5.0,
    reviewsCount: 48,
    category: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000'],
    image: '/Shop_images/nohuman.png',
    secondaryImage: '/Shop_images/nohuman.png',
    isNew: false,
    isTrending: true,
    isSuggested: true,
    matchReason: '100% cotton charity t-shirt with signature barbed wire rainbow heart.'
  },
  {
    id: 'post-18',
    name: 'Vibrant Summer Floral Dress',
    shortName: 'Vibrant Summer Dress',
    price: 120.00,
    priceDisplay: '$120.00',
    brand: 'Summer Floral Co',
    rating: 4.9,
    reviewsCount: 89,
    category: 'dresses',
    sizes: ['S', 'M', 'L'],
    colors: ['#15803d', '#86efac'],
    image: '/Shop_images/greendress.jpg',
    secondaryImage: '/Shop_images/greendress.jpg',
    isNew: true,
    isTrending: true,
    isSuggested: true,
    matchReason: 'Green floral slip dress with delicate spaghetti straps and tiered ruffles.'
  },
  {
    id: 'prod-boots',
    name: 'Pointed Toe Leather Ankle Boots',
    shortName: 'Pointed Toe Ankle Boots',
    price: 450.00,
    priceDisplay: '$450.00',
    brand: 'Ankita Manot',
    rating: 4.9,
    reviewsCount: 38,
    category: 'shoes',
    sizes: ['S', 'M', 'L'],
    colors: ['#000000'],
    image: '/Shop_images/1/basic4-500x750.jpeg',
    secondaryImage: '/Shop_images/1/basic2-500x750.jpeg',
    isNew: false,
    isTrending: false,
    isSuggested: true,
    matchReason: 'Pointed toe sculpted leather ankle boots in smooth calfskin.'
  }
];

export const POPULAR_PROMPTS = [
  'SUMMER DRESSES',
  'WOOL BLAZERS',
  'GRAPHIC TEES',
  'WIDE-LEG TROUSERS'
];

export const INITIAL_AI_CHAT = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Hi! I'm your personal stylist. I can browse the store for you and help you try on clothes virtually. What are you looking for today?",
    timestamp: '10:30 AM'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'show me dresses and outerwear',
    timestamp: '10:31 AM'
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: "Here are signature pieces curated directly from our designer runway collection. You can try any piece on your virtual silhouette instantly! ✨",
    timestamp: '10:31 AM',
    recommendations: [
      {
        id: 'post-3',
        title: 'Midnight Silk Evening Dress',
        price: '$320.00',
        sizeNote: 'SIZE: S (Fluid evening drape)',
        image: '/Shop_images/3/dressblack1-1-500x750.jpeg',
        category: 'dresses',
        whyItWorks: [
          'Sleek silk silhouette with side slit creates an elegant vertical line.',
          'Pairs effortlessly with the Ankita Manot virgin wool blazer.',
          'Crafted from 100% lustrous Mulberry silk.'
        ]
      },
      {
        id: 'post-1',
        title: 'Structured Wool Blazer',
        price: '$280.00',
        sizeNote: 'SIZE: M (Tailored Milanese fit)',
        image: '/Shop_images/1/basic2-500x750.jpeg',
        category: 'outerwear',
        whyItWorks: [
          'Sharp structured shoulders define your posture and silhouette.',
          'Crafted from virgin wool with luxurious cupro lining.',
          'Layers seamlessly over dresses and silk trousers.'
        ]
      }
    ]
  },
  {
    id: 'msg-4',
    sender: 'ai',
    text: 'Here is how the Midnight Silk Evening Dress looks on you!',
    timestamp: '10:32 AM',
    tryOnResult: {
      productName: 'Midnight Silk Evening Dress',
      productId: 'post-3',
      price: '$320.00',
      selectedScene: 'studio',
      scenes: {
        studio: '/Shop_images/3/dressblack1-1-500x750.jpeg',
        street: '/Shop_images/3/dressblack2-500x750.jpeg',
        beach: '/Shop_images/greendress.jpg',
        custom: '/Shop_images/3/dressblack3-500x750.jpeg'
      },
      currentImage: '/Shop_images/3/dressblack1-1-500x750.jpeg',
      isVideoGenerating: false,
      isVideoReady: false
    }
  }
];
