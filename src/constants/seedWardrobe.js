// Pre-seeded Wardrobe Items, Outfits, Calendar, and Trip Plans
export const SEED_WARDROBE_ITEMS = [
  {
    id: 'wb_item_1',
    name: 'Camel Cashmere Coat',
    category: 'Outerwear',
    color: 'Camel',
    season: 'Autumn / Winter',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80',
    wearCount: 12,
    isFavorite: true,
    addedAt: '2026-01-10'
  },
  {
    id: 'wb_item_2',
    name: 'Silk Bias Slip Dress',
    category: 'Dresses',
    color: 'Champagne',
    season: 'All Seasons',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80',
    wearCount: 8,
    isFavorite: true,
    addedAt: '2026-02-14'
  },
  {
    id: 'wb_item_3',
    name: 'Double-Breasted Charcoal Blazer',
    category: 'Tops',
    color: 'Charcoal Grey',
    season: 'All Seasons',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    wearCount: 15,
    isFavorite: false,
    addedAt: '2026-02-20'
  },
  {
    id: 'wb_item_4',
    name: 'Wide-Leg Pleated Trousers',
    category: 'Bottoms',
    color: 'Black',
    season: 'All Seasons',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    wearCount: 18,
    isFavorite: true,
    addedAt: '2026-03-01'
  },
  {
    id: 'wb_item_5',
    name: 'Ribbed Knit Cashmere Sweater',
    category: 'Tops',
    color: 'Oatmeal',
    season: 'Autumn / Winter',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    wearCount: 11,
    isFavorite: false,
    addedAt: '2026-03-05'
  },
  {
    id: 'wb_item_6',
    name: 'Pointed Leather Heeled Mules',
    category: 'Shoes',
    color: 'Noir Black',
    season: 'All Seasons',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    wearCount: 9,
    isFavorite: true,
    addedAt: '2026-03-10'
  }
];

export const SEED_WARDROBE_OUTFITS = [
  {
    id: 'outfit_1',
    name: 'Gallery Opening & Dinner',
    style: 'Modern Parisian',
    occasion: 'Cocktail / Evening',
    season: 'Autumn',
    isFavorite: true,
    itemIds: ['wb_item_1', 'wb_item_2', 'wb_item_6'],
    items: [
      { id: 'wb_item_1', name: 'Camel Cashmere Coat', imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80' },
      { id: 'wb_item_2', name: 'Silk Bias Slip Dress', imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80' },
      { id: 'wb_item_6', name: 'Pointed Leather Heeled Mules', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80' }
    ]
  },
  {
    id: 'outfit_2',
    name: 'Executive Studio Presentation',
    style: 'Sharp Tailoring',
    occasion: 'Work / Editorial',
    season: 'Spring',
    isFavorite: false,
    itemIds: ['wb_item_3', 'wb_item_4', 'wb_item_6'],
    items: [
      { id: 'wb_item_3', name: 'Double-Breasted Charcoal Blazer', imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80' },
      { id: 'wb_item_4', name: 'Wide-Leg Pleated Trousers', imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80' },
      { id: 'wb_item_6', name: 'Pointed Leather Heeled Mules', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80' }
    ]
  }
];

export const SEED_WARDROBE_SCHEDULE = [
  {
    id: 'sched_1',
    dateStr: new Date().toISOString().split('T')[0], // today
    outfitId: 'outfit_1',
    outfitName: 'Gallery Opening & Dinner',
    note: 'Private view at Fondation Louis Vuitton'
  }
];

export const SEED_WARDROBE_TRIPS = [
  {
    id: 'trip_1',
    destination: 'Paris Fashion Week',
    startDate: '2026-10-02',
    endDate: '2026-10-08',
    outfits: ['outfit_1', 'outfit_2'],
    notes: 'Hotel Costes booking, presentations in Le Marais.'
  }
];
