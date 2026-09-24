import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

import { authService } from '../services/authService';
import { SEED_USERS } from '../constants/seedUsers';
import { STORAGE_KEYS } from '../constants/storageKeys';

// Pre-registered system users for the 3 roles: User (Shopper), Merchant, Admin
export const SYSTEM_ACCOUNTS = SEED_USERS;

const LOCAL_STORAGE_SESSION_KEY = STORAGE_KEYS.AUTH_USER;
const LOCAL_STORAGE_REGISTRY_KEY = STORAGE_KEYS.REGISTERED_USERS;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'
  const [registeredUsers, setRegisteredUsers] = useState(SYSTEM_ACCOUNTS);

  // Initialize registry and active session
  useEffect(() => {
    // 1. Load registered users
    const storedUsers = localStorage.getItem(LOCAL_STORAGE_REGISTRY_KEY);
    let allUsers = SYSTEM_ACCOUNTS;
    if (storedUsers) {
      try {
        const parsed = JSON.parse(storedUsers);
        // Merge system accounts with any newly signed up users
        const customUsers = parsed.filter(u => !SYSTEM_ACCOUNTS.some(s => s.email.toLowerCase() === u.email.toLowerCase()));
        allUsers = [...SYSTEM_ACCOUNTS, ...customUsers];
      } catch (e) {
        allUsers = SYSTEM_ACCOUNTS;
      }
    }
    setRegisteredUsers(allUsers);
    localStorage.setItem(LOCAL_STORAGE_REGISTRY_KEY, JSON.stringify(allUsers));

    // 2. Load active session
    const savedUser = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed?.id === 'mch_tom_01') {
          parsed.id = 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';
          localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(parsed));
        }
        setUser(parsed);
        setStatus('authenticated');
      } catch (e) {
        setUser(null);
        setStatus('unauthenticated');
      }
    } else {
      // Default to guest / unauthenticated
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  /**
   * Real Sign Up for User (or Merchant)
   */
  const signUp = async ({ name, email, password, role = 'user', preferred_size = 'M', gender = 'Women', storeName, storeHandle }) => {
    const res = await authService.signUp({ name, email, password, role, preferred_size, gender, storeName, storeHandle });
    if (!res.success) {
      throw new Error(res.error || 'Failed to create account.');
    }

    setUser(res.user);
    setStatus('authenticated');
    setRegisteredUsers(prev => [...prev.filter(u => u.email.toLowerCase() !== res.user.email.toLowerCase()), res.user]);
    return res;
  };

  /**
   * Real Sign In with Email & Password
   */
  const signIn = async (credentials) => {
    if (typeof credentials === 'string') {
      return signInOAuth(credentials);
    }

    const { email, password } = credentials || {};
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const res = await authService.signIn({ email, password });
    if (!res.success) {
      throw new Error(res.error || 'Authentication failed. Please check your credentials.');
    }

    setUser(res.user);
    setStatus('authenticated');
    return res;
  };

  /**
   * OAuth Social Sign In (Google, Facebook, Apple)
   */
  const signInOAuth = async (provider = 'google') => {
    let oauthUser;
    if (provider === 'google') {
      oauthUser = {
        id: `usr_google_${Date.now()}`,
        name: 'Sarah Lin',
        email: 'sarah.lin@gmail.com',
        role: 'user',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
        provider: 'google',
        memberSince: 'March 2025',
        measurements: {
          height: '172 cm',
          weight: '58 kg',
          bust: '86 cm',
          waist: '66 cm',
          hips: '92 cm',
          preferred_size: 'S',
          fit_preference: 'Regular'
        }
      };
    } else if (provider === 'facebook') {
      oauthUser = {
        id: `usr_fb_${Date.now()}`,
        name: 'Elena Rostova',
        email: 'elena.rostova@facebook.com',
        role: 'user',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&q=80',
        provider: 'facebook',
        memberSince: 'March 2025',
        measurements: {
          height: '168 cm',
          weight: '55 kg',
          bust: '84 cm',
          waist: '64 cm',
          hips: '90 cm',
          preferred_size: 'S',
          fit_preference: 'Regular'
        }
      };
    } else {
      oauthUser = SYSTEM_ACCOUNTS[0];
    }

    setUser(oauthUser);
    setStatus('authenticated');
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(oauthUser));
    return { success: true, user: oauthUser };
  };

  /**
   * Switch active user role (User, Merchant, Admin)
   */
  const switchUserRole = (targetRole) => {
    const targetAccount = SYSTEM_ACCOUNTS.find(a => a.role === targetRole) || SYSTEM_ACCOUNTS[0];
    setUser(targetAccount);
    setStatus('authenticated');
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(targetAccount));
    return targetAccount;
  };

  /**
   * Update Profile & Measurements
   */
  const updateUserProfile = (updates) => {
    if (!user) return;
    const updated = {
      ...user,
      ...updates,
      measurements: {
        ...(user.measurements || {}),
        ...(updates.measurements || {})
      }
    };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updated));

    // Update in registered users
    const updatedList = registeredUsers.map(u => u.id === user.id ? updated : u);
    setRegisteredUsers(updatedList);
    localStorage.setItem(LOCAL_STORAGE_REGISTRY_KEY, JSON.stringify(updatedList));

    return updated;
  };

  /**
   * Sign Out
   */
  const signOut = async () => {
    setUser(null);
    setStatus('unauthenticated');
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user ? { user } : null,
        status,
        signIn,
        signUp,
        signInOAuth,
        signOut,
        switchUserRole,
        updateUserProfile,
        registeredUsers,
        isAuthenticated: status === 'authenticated',
        isShopper: user?.role === 'user',
        isMerchant: user?.role === 'merchant',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useSession() {
  const { session, status } = useAuth();
  return { data: session, status };
}
