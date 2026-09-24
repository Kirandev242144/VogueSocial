// Seed Demo Accounts for 3 Platform Roles (Shopper, Merchant, Admin)
export const SEED_USERS = [
  {
    id: 'usr_sarah_01',
    name: 'Sarah Lin',
    email: 'sarah@voguesocial.com',
    password: 'password123',
    role: 'user',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
    phone: '+1 (555) 234-5678',
    city: 'New York, NY',
    memberSince: 'March 2025',
    measurements: {
      height: '172 cm',
      weight: '58 kg',
      bust: '86 cm',
      waist: '66 cm',
      hips: '92 cm',
      preferred_size: 'S',
      fit_preference: 'Regular'
    },
    tryonPhotos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80'
    ]
  },
  {
    id: 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
    name: 'Tom Jenkins',
    email: 'tom@gmail.com',
    password: 'password123',
    role: 'merchant',
    storeName: 'Studio Label Paris',
    storeHandle: 'studiolabel',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80',
    memberSince: 'January 2025'
  },
  {
    id: 'mch_elena_02',
    name: 'Elena Rostova',
    email: 'elena@voguesocial.com',
    password: 'password123',
    role: 'merchant',
    storeName: 'Elena Couture',
    storeHandle: 'elenacouture',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80',
    memberSince: 'February 2025'
  },
  {
    id: 'adm_alex_01',
    name: 'Alexander Vance',
    email: 'admin@voguesocial.com',
    password: 'admin123',
    role: 'admin',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
    memberSince: 'December 2024'
  }
];
