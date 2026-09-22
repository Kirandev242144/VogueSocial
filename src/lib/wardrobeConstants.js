export const COLOR_PALETTE = [
  { name: 'White', hex: '#FFFFFF', cssClass: 'paletteWhite' },
  { name: 'Black', hex: '#0F172A', cssClass: 'paletteBlack' },
  { name: 'Grey', hex: '#64748B', cssClass: 'paletteGrey' },
  { name: 'Blue', hex: '#2563EB', cssClass: 'paletteBlue' },
  { name: 'Navy', hex: '#1E3A8A', cssClass: 'paletteNavy' },
  { name: 'Beige', hex: '#E2D7C5', cssClass: 'paletteBeige' },
  { name: 'Brown', hex: '#78350F', cssClass: 'paletteBrown' },
  { name: 'Red', hex: '#DC2626', cssClass: 'paletteRed' },
  { name: 'Green', hex: '#16A34A', cssClass: 'paletteGreen' },
  { name: 'Pink', hex: '#DB2777', cssClass: 'palettePink' },
  { name: 'Lavender', hex: '#9333EA', cssClass: 'paletteLavender' },
  { name: 'Yellow', hex: '#EAB308', cssClass: 'paletteYellow' }
];

export const WARDROBE_CATEGORIES = [
  'all',
  'tops',
  'bottoms',
  'outerwear',
  'shoes',
  'dresses',
  'accessories'
];

export const OCCASIONS = ['Casual', 'Formal', 'Party', 'Work'];

export const SEASONS = ['All', 'Summer', 'Winter', 'Spring/Autumn'];

export const DESTINATION_PRESETS = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    tags: ['tokio', 'japan', 'shibuya', 'asia']
  },
  {
    id: 'paris',
    name: 'Paris',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    tags: ['france', 'europe', 'fashion']
  },
  {
    id: 'milan',
    name: 'Milan',
    imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?auto=format&fit=crop&w=800&q=80',
    tags: ['milano', 'italy', 'fashion week']
  },
  {
    id: 'newyork',
    name: 'New York',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    tags: ['nyc', 'usa', 'manhattan']
  },
  {
    id: 'london',
    name: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    tags: ['uk', 'britain', 'england']
  },
  {
    id: 'bali',
    name: 'Bali',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    tags: ['resort', 'tropical', 'beach', 'summer']
  },
  {
    id: 'dubai',
    name: 'Dubai',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    tags: ['uae', 'middle east', 'luxury']
  }
];

export function getTripCoverImage(trip) {
  if (trip?.coverImage && trip.coverImage.trim()) {
    return trip.coverImage;
  }
  const destLower = (trip?.destination || '').toLowerCase();
  for (const preset of DESTINATION_PRESETS) {
    if (destLower.includes(preset.id) || destLower.includes(preset.name.toLowerCase())) {
      return preset.imageUrl;
    }
    if (preset.tags && preset.tags.some(t => destLower.includes(t))) {
      return preset.imageUrl;
    }
  }
  if (trip?.presetImage) {
    const matched = DESTINATION_PRESETS.find(p => p.id === trip.presetImage);
    if (matched) return matched.imageUrl;
  }
  return DESTINATION_PRESETS[0].imageUrl;
}

