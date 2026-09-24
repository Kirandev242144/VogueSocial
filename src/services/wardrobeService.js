import { APP_CONFIG, IS_MOCK_MODE } from '../constants/config';
import { mockWardrobeAdapter } from './mock/mockWardrobe';

/**
 * Domain Service for Wardrobe, Styling Studio, Calendar, and Trips
 */
export const wardrobeService = {
  async getWardrobe(userId) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.getWardrobeData(userId);
    }
    const [resItems, resOutfits, resSchedule, resTrips] = await Promise.all([
      fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/items?userId=${encodeURIComponent(userId)}`),
      fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/outfits?userId=${encodeURIComponent(userId)}`),
      fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/schedule?userId=${encodeURIComponent(userId)}`),
      fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/trips?userId=${encodeURIComponent(userId)}`)
    ]);

    return {
      items: resItems.ok ? await resItems.json() : [],
      outfits: resOutfits.ok ? await resOutfits.json() : [],
      schedule: resSchedule.ok ? await resSchedule.json() : [],
      trips: resTrips.ok ? await resTrips.json() : []
    };
  },

  async addItem(item) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.addItem(item);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },

  async wearItem(itemId) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.incrementWear(itemId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/items/${encodeURIComponent(itemId)}/wear`, {
      method: 'POST'
    });
    return res.json();
  },

  async deleteItem(itemId) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.deleteItem(itemId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async addOutfit(outfit) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.addOutfit(outfit);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/outfits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(outfit)
    });
    return res.json();
  },

  async deleteOutfit(outfitId) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.deleteOutfit(outfitId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/outfits/${encodeURIComponent(outfitId)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async saveSchedule(scheduleEntry) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.saveSchedule(scheduleEntry);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scheduleEntry)
    });
    return res.json();
  },

  async deleteSchedule(userId, dateStr) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.deleteSchedule(userId, dateStr);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/schedule?userId=${encodeURIComponent(userId)}&dateStr=${encodeURIComponent(dateStr)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async saveTrip(trip) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.saveTrip(trip);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip)
    });
    return res.json();
  },

  async deleteTrip(tripId) {
    if (IS_MOCK_MODE) {
      return mockWardrobeAdapter.deleteTrip(tripId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/wardrobe/trips/${encodeURIComponent(tripId)}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
