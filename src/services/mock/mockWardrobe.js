import { storageEngine } from './storageEngine';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { APP_CONFIG } from '../../constants/config';

const delay = (ms = APP_CONFIG.SIMULATED_NETWORK_DELAY_MS) => new Promise(res => setTimeout(res, ms));

export const mockWardrobeAdapter = {
  async getWardrobeData(userId) {
    await delay();
    return {
      items: storageEngine.getItem(STORAGE_KEYS.WARDROBE_ITEMS, []),
      outfits: storageEngine.getItem(STORAGE_KEYS.WARDROBE_OUTFITS, []),
      schedule: storageEngine.getItem(STORAGE_KEYS.WARDROBE_SCHEDULE, []),
      trips: storageEngine.getItem(STORAGE_KEYS.WARDROBE_TRIPS, [])
    };
  },

  async addItem(item) {
    await delay();
    const items = storageEngine.getItem(STORAGE_KEYS.WARDROBE_ITEMS, []);
    const newItem = {
      ...item,
      id: item.id || `wb_item_${Date.now()}`,
      wearCount: item.wearCount || 0,
      isFavorite: item.isFavorite || false,
      addedAt: new Date().toISOString()
    };
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_ITEMS, [newItem, ...items]);
    return newItem;
  },

  async incrementWear(itemId) {
    await delay();
    const items = storageEngine.getItem(STORAGE_KEYS.WARDROBE_ITEMS, []);
    const updated = items.map(item => {
      if (item.id === itemId) {
        return { ...item, wearCount: (item.wearCount || 0) + 1, lastWorn: new Date().toISOString() };
      }
      return item;
    });
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_ITEMS, updated);
    return { success: true };
  },

  async deleteItem(itemId) {
    await delay();
    const items = storageEngine.getItem(STORAGE_KEYS.WARDROBE_ITEMS, []);
    const filtered = items.filter(item => item.id !== itemId);
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_ITEMS, filtered);
    return { success: true };
  },

  async addOutfit(outfit) {
    await delay();
    const outfits = storageEngine.getItem(STORAGE_KEYS.WARDROBE_OUTFITS, []);
    const newOutfit = {
      ...outfit,
      id: outfit.id || `outfit_${Date.now()}`,
      isFavorite: outfit.isFavorite || false,
      createdAt: new Date().toISOString()
    };
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_OUTFITS, [newOutfit, ...outfits]);
    return newOutfit;
  },

  async deleteOutfit(outfitId) {
    await delay();
    const outfits = storageEngine.getItem(STORAGE_KEYS.WARDROBE_OUTFITS, []);
    const filtered = outfits.filter(o => o.id !== outfitId);
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_OUTFITS, filtered);
    return { success: true };
  },

  async saveSchedule(scheduleEntry) {
    await delay();
    const schedules = storageEngine.getItem(STORAGE_KEYS.WARDROBE_SCHEDULE, []);
    // Replace if exists for date, or add
    const filtered = schedules.filter(s => s.dateStr !== scheduleEntry.dateStr);
    const newEntry = {
      ...scheduleEntry,
      id: scheduleEntry.id || `sched_${Date.now()}`
    };
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_SCHEDULE, [...filtered, newEntry]);
    return newEntry;
  },

  async deleteSchedule(userId, dateStr) {
    await delay();
    const schedules = storageEngine.getItem(STORAGE_KEYS.WARDROBE_SCHEDULE, []);
    const filtered = schedules.filter(s => s.dateStr !== dateStr);
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_SCHEDULE, filtered);
    return { success: true };
  },

  async saveTrip(trip) {
    await delay();
    const trips = storageEngine.getItem(STORAGE_KEYS.WARDROBE_TRIPS, []);
    const id = trip.id || `trip_${Date.now()}`;
    const newTrip = { ...trip, id };
    const filtered = trips.filter(t => t.id !== id);
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_TRIPS, [newTrip, ...filtered]);
    return newTrip;
  },

  async deleteTrip(tripId) {
    await delay();
    const trips = storageEngine.getItem(STORAGE_KEYS.WARDROBE_TRIPS, []);
    const filtered = trips.filter(t => t.id !== tripId);
    storageEngine.setItem(STORAGE_KEYS.WARDROBE_TRIPS, filtered);
    return { success: true };
  }
};
