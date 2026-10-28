import { storageEngine } from './storageEngine';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { SEED_USERS } from '../../constants/seedUsers';
import { APP_CONFIG } from '../../constants/config';

const delay = (ms = APP_CONFIG.SIMULATED_NETWORK_DELAY_MS) => new Promise(res => setTimeout(res, ms));

export const mockAuthAdapter = {
  async signIn(email, password) {
    await delay();
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = storageEngine.getItem(STORAGE_KEYS.REGISTERED_USERS, SEED_USERS);

    const matched = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!matched) {
      return { success: false, error: 'No account found with this email.' };
    }

    if (matched.password && matched.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const sessionUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: matched.role || 'user',
      storeName: matched.storeName,
      storeHandle: matched.storeHandle,
      image: matched.image,
      memberSince: matched.memberSince || 'March 2025',
      measurements: matched.measurements,
      tryonCreditsTotal: matched.tryonCreditsTotal || 2000,
      tryonCreditsUsed: matched.tryonCreditsUsed || 0
    };

    storageEngine.setItem(STORAGE_KEYS.AUTH_USER, sessionUser);
    return { success: true, user: sessionUser };
  },

  async signUp(userData) {
    await delay();
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const users = storageEngine.getItem(STORAGE_KEYS.REGISTERED_USERS, SEED_USERS);

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const cleanHandle = userData.storeHandle
      ? userData.storeHandle.toLowerCase().replace(/[^a-z0-9-]/g, '')
      : (userData.storeName || userData.name || '').toLowerCase().replace(/[^a-z0-9-]/g, '');

    if (userData.role === 'merchant' && cleanHandle) {
      if (users.some(u => (u.storeHandle || '').toLowerCase() === cleanHandle)) {
        return { success: false, error: `The store handle '${cleanHandle}' is already taken.` };
      }
    }

    const newUser = {
      id: `usr_${Date.now().toString(36)}`,
      name: userData.name.trim(),
      email: cleanEmail,
      password: userData.password,
      role: userData.role || (userData.storeName || userData.storeHandle ? 'merchant' : 'user'),
      storeName: userData.storeName || (userData.role === 'merchant' ? `${userData.name.trim()} Studio` : undefined),
      storeHandle: userData.role === 'merchant' || userData.storeName ? cleanHandle : undefined,
      image: userData.role === 'merchant'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      measurements: userData.measurements || {
        height: '170 cm',
        weight: '60 kg',
        bust: '88 cm',
        waist: '68 cm',
        hips: '94 cm',
        preferred_size: userData.preferred_size || 'M',
        fit_preference: 'Regular'
      },
      tryonCreditsTotal: 2000,
      tryonCreditsUsed: 0
    };

    storageEngine.setItem(STORAGE_KEYS.REGISTERED_USERS, [newUser, ...users]);
    storageEngine.setItem(STORAGE_KEYS.AUTH_USER, newUser);

    // If merchant, initialize their store settings
    if (newUser.role === 'merchant' && cleanHandle) {
      const storeKey = `${STORAGE_KEYS.STORE_PREFIX}${cleanHandle}`;
      if (!storageEngine.getItem(storeKey)) {
        const newStore = {
          id: newUser.id,
          vendor_id: newUser.id,
          vendorId: newUser.id,
          status: 'live',
          storefront_status: 'active',
          vendor_status: 'approved',
          kyb_status: 'unsubmitted',
          kyc_status: 'unsubmitted',
          payout_eligibility: 'administrative_hold',
          legal_business_name: newUser.storeName || `${newUser.name} Studio`,
          business_type: 'Corporation (Inc., Ltd., S.A.S.)',
          tax_id: '',
          registration_number: '',
          phone: '',
          country: 'France',
          legal_address: { street: '', city: '', postal_code: '', country: 'France' },
          return_warehouse_address: { street: '', city: '', postal_code: '', country: 'France' },
          representative: { name: newUser.name, title: 'Founder & Director', email: newUser.email, phone: '' },
          documents: [
            { id: 'doc-incorp', type: 'incorporation', title: 'Certificate of Incorporation / Business License', filename: null, size: null, uploaded_at: null, status: 'required', notes: null },
            { id: 'doc-id', type: 'owner_id', title: 'Government-Issued Photo ID of Legal Representative', filename: null, size: null, uploaded_at: null, status: 'required', notes: null },
            { id: 'doc-address', type: 'address_proof', title: 'Proof of Operating Business Address', filename: null, size: null, uploaded_at: null, status: 'required', notes: null },
            { id: 'doc-tax', type: 'tax_cert', title: 'Tax Identification / VAT Registration Certificate', filename: null, size: null, uploaded_at: null, status: 'required', notes: null },
            { id: 'doc-bank', type: 'bank_statement', title: 'Bank Account Ownership Verification', filename: null, size: null, uploaded_at: null, status: 'required', notes: null }
          ],
          template: 'modern',
          store_name: newUser.storeName || `${newUser.name} Studio`,
          store_handle: cleanHandle,
          subdomain: cleanHandle,
          custom_domain: `shop.${cleanHandle}.com`,
          domain_status: 'ssl_active',
          tagline: 'Modern Tailoring & AI Virtual Fitting Studio',
          description: `Welcome to ${newUser.storeName || newUser.name}. Precision-crafted luxury fashion designed for effortless online shopping.`,
          hero_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
          logo_url: '',
          accent_color: '#2563eb',
          email: newUser.email,
          created_at: new Date().toISOString()
        };
        storageEngine.setItem(storeKey, newStore);

        const allStores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
        storageEngine.setItem(STORAGE_KEYS.STORES, [newStore, ...allStores]);
      }
    }

    return { success: true, user: newUser };
  },

  async checkHandleAvailable(handle) {
    await delay(100);
    const clean = (handle || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!clean) return { available: false, error: 'Invalid handle' };

    const reserved = ['admin', 'api', 'www', 'app', 'shop', 'auth', 'system', 'root'];
    if (reserved.includes(clean)) return { available: false, error: 'Reserved handle' };

    const users = storageEngine.getItem(STORAGE_KEYS.REGISTERED_USERS, SEED_USERS);
    const isTaken = users.some(u => (u.storeHandle || '').toLowerCase() === clean);

    return { available: !isTaken, handle: clean };
  },

  getCurrentUser() {
    return storageEngine.getItem(STORAGE_KEYS.AUTH_USER, null);
  },

  signOut() {
    storageEngine.removeItem(STORAGE_KEYS.AUTH_USER);
    return { success: true };
  }
};
