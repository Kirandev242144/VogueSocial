// Centralized LocalStorage Storage Keys for Standalone Frontend
export const STORAGE_KEYS = {
  // Authentication & Session
  AUTH_USER: 'vogue_auth_user',
  REGISTERED_USERS: 'vogue_registered_users',

  // Merchant Stores & Website Configurations
  STORES: 'vogue_stores_registry',
  ACTIVE_MERCHANT_WEBSITE: 'vogue_merchant_website',
  STORE_PREFIX: 'vogue_website_', // e.g. vogue_website_studiolabel

  // Products & Catalogs
  PRODUCTS: 'vogue_products_catalog',

  // Wardrobe & Styling Studio
  WARDROBE_ITEMS: 'vogue_wardrobe_items',
  WARDROBE_OUTFITS: 'vogue_wardrobe_outfits',
  WARDROBE_SCHEDULE: 'vogue_wardrobe_schedule',
  WARDROBE_TRIPS: 'vogue_wardrobe_trips',

  // Social Community & Lookbook Feed
  FEED_POSTS: 'vogue_feed_posts',
  POST_LIKES: 'vogue_post_likes',
  POST_COMMENTS: 'vogue_post_comments',

  // Shopper Carts & Orders
  CART_PREFIX: 'vogue_cart_', // e.g. vogue_cart_studiolabel
  ORDERS: 'vogue_orders',

  // System Flags
  SEEDED_INITIALIZED: 'vogue_data_seeded_v1',
};
