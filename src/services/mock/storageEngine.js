import { STORAGE_KEYS } from '../../constants/storageKeys';
import { SEED_PRODUCTS } from '../../constants/seedProducts';
import { SEED_STORES } from '../../constants/seedStores';
import { SEED_USERS } from '../../constants/seedUsers';
import {
  SEED_WARDROBE_ITEMS,
  SEED_WARDROBE_OUTFITS,
  SEED_WARDROBE_SCHEDULE,
  SEED_WARDROBE_TRIPS
} from '../../constants/seedWardrobe';

const SEED_VERSION = 'v5_curated_shop_images';

/**
 * Robust LocalStorage Wrapper with Automatic Seed Data Hydration & Versioning
 */
class StorageEngine {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    if (typeof window === 'undefined') return;

    try {
      const currentVersion = localStorage.getItem(STORAGE_KEYS.SEEDED_INITIALIZED);
      if (currentVersion !== SEED_VERSION) {
        // Upgrade seed data to modern local Shop_images catalog
        this.hydrateDefaults(true);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable or disabled:', e);
    }
  }

  hydrateDefaults(force = false) {
    if (typeof window === 'undefined') return;

    try {
      // 1. Products Catalog (force refresh seed to update product image sets)
      if (force || !localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      }

      // 2. Stores & Website Settings
      if (force || !localStorage.getItem(STORAGE_KEYS.STORES)) {
        localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(SEED_STORES));
      }

      // Seed individual website settings for each store handle
      SEED_STORES.forEach(store => {
        const key = `${STORAGE_KEYS.STORE_PREFIX}${store.store_handle.toLowerCase()}`;
        if (force || !localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify(store));
        }
      });

      // Default merchant website (Studio Label)
      if (force || !localStorage.getItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE)) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE, JSON.stringify(SEED_STORES[0]));
      }

      // 3. User Accounts Registry
      if (!localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS)) {
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(SEED_USERS));
      }

      // 4. Wardrobe Studio Data
      if (!localStorage.getItem(STORAGE_KEYS.WARDROBE_ITEMS)) {
        localStorage.setItem(STORAGE_KEYS.WARDROBE_ITEMS, JSON.stringify(SEED_WARDROBE_ITEMS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.WARDROBE_OUTFITS)) {
        localStorage.setItem(STORAGE_KEYS.WARDROBE_OUTFITS, JSON.stringify(SEED_WARDROBE_OUTFITS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.WARDROBE_SCHEDULE)) {
        localStorage.setItem(STORAGE_KEYS.WARDROBE_SCHEDULE, JSON.stringify(SEED_WARDROBE_SCHEDULE));
      }
      if (!localStorage.getItem(STORAGE_KEYS.WARDROBE_TRIPS)) {
        localStorage.setItem(STORAGE_KEYS.WARDROBE_TRIPS, JSON.stringify(SEED_WARDROBE_TRIPS));
      }

      // Mark initialized with version
      localStorage.setItem(STORAGE_KEYS.SEEDED_INITIALIZED, SEED_VERSION);
    } catch (e) {
      console.error('Failed to hydrate storage defaults:', e);
    }
  }

  getItem(key, defaultValue = null) {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  setItem(key, value) {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
      return false;
    }
  }

  removeItem(key) {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing ${key} from storage:`, e);
      return false;
    }
  }

  resetAllToSeedDefaults() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEYS.SEEDED_INITIALIZED);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.STORES);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE);
      localStorage.removeItem(STORAGE_KEYS.WARDROBE_ITEMS);
      localStorage.removeItem(STORAGE_KEYS.WARDROBE_OUTFITS);
      localStorage.removeItem(STORAGE_KEYS.WARDROBE_SCHEDULE);
      localStorage.removeItem(STORAGE_KEYS.WARDROBE_TRIPS);
      this.hydrateDefaults(true);
    } catch (e) {
      console.error('Error resetting storage defaults:', e);
    }
  }
}

export const storageEngine = new StorageEngine();
