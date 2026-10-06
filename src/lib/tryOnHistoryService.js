/**
 * User Virtual Try-On History Service
 * Stores and manages outfits tested in the Virtual Fitting Room.
 */

const STORAGE_KEY = 'vogue_user_tryons';

export const DEFAULT_USER_TRYONS = [
  {
    id: 'tryon_01',
    userId: 'usr_sarah_01',
    productId: 'dd8d7fe4-7680-4b0e-8198-67720e00045d',
    productName: 'Structured Double-Breasted Trench',
    brand: 'Studio Label Paris',
    category: 'Outerwear',
    price: '$520.00',
    size: 'S',
    fitScore: '98% Match',
    date: '18 Sep 2026, 4:15 PM',
    modelUsed: 'Preset Model · Female 01',
    garmentImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80',
    resultImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    liked: true
  },
  {
    id: 'tryon_02',
    userId: 'usr_sarah_01',
    productId: 'e01a7924-f7b5-4bfe-9831-297c8d9d20c1',
    productName: 'Silk Charmeuse Bias-Cut Slip Dress',
    brand: 'Studio Label Paris',
    category: 'Eveningwear',
    price: '$340.00',
    size: 'S',
    fitScore: '96% Match',
    date: '17 Sep 2026, 7:22 PM',
    modelUsed: 'Custom Photo Upload',
    garmentImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    resultImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
    liked: true
  },
  {
    id: 'tryon_03',
    userId: 'usr_sarah_01',
    productId: 'c89b8842-a123-4d76-b998-12e34567890a',
    productName: 'Minimalist Relaxed Cashmere Knit',
    brand: 'Studio Label Paris',
    category: 'Knitwear',
    price: '$290.00',
    size: 'M',
    fitScore: '94% Match',
    date: '15 Sep 2026, 2:40 PM',
    modelUsed: 'Preset Model · Female 02',
    garmentImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    resultImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    liked: false
  },
  {
    id: 'tryon_04',
    userId: 'usr_sarah_01',
    productId: 'b12c3456-d789-4e01-f234-567890abcdef',
    productName: 'Italian Wool Pleated Wide-Leg Trouser',
    brand: 'Studio Label Paris',
    category: 'Tailored Suiting',
    price: '$260.00',
    size: 'S (26)',
    fitScore: '97% Match',
    date: '12 Sep 2026, 6:05 PM',
    modelUsed: 'Preset Model · Female 01',
    garmentImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    resultImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    liked: true
  }
];

export function getUserTryOns(userId) {
  const stored = localStorage.getItem(STORAGE_KEY);
  let tryons = DEFAULT_USER_TRYONS;
  if (stored) {
    try {
      tryons = JSON.parse(stored);
    } catch (e) {
      tryons = DEFAULT_USER_TRYONS;
    }
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER_TRYONS));
  }

  if (userId) {
    return tryons.filter(t => t.userId === userId);
  }
  return tryons;
}

export function saveUserTryOn(tryon) {
  const tryons = getUserTryOns();
  const newEntry = {
    id: `tryon_${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    fitScore: '97% Match',
    ...tryon
  };
  const updated = [newEntry, ...tryons];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteUserTryOn(tryonId) {
  const tryons = getUserTryOns();
  const updated = tryons.filter(t => t.id !== tryonId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function toggleLikeTryOn(tryonId) {
  const tryons = getUserTryOns();
  const updated = tryons.map(t => t.id === tryonId ? { ...t, liked: !t.liked } : t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
