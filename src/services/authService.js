import { APP_CONFIG, IS_MOCK_MODE } from '../constants/config';
import { mockAuthAdapter } from './mock/mockAuth';

/**
 * Domain Service for Authentication & User Accounts
 */
export const authService = {
  async signIn(credentials) {
    if (IS_MOCK_MODE) {
      return mockAuthAdapter.signIn(credentials.email, credentials.password);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  async signUp(userData) {
    if (IS_MOCK_MODE) {
      return mockAuthAdapter.signUp(userData);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  async checkHandleAvailable(handle) {
    if (IS_MOCK_MODE) {
      return mockAuthAdapter.checkHandleAvailable(handle);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/check-handle?handle=${encodeURIComponent(handle)}`);
    return res.json();
  },

  getCurrentUser() {
    return mockAuthAdapter.getCurrentUser();
  },

  signOut() {
    return mockAuthAdapter.signOut();
  }
};
