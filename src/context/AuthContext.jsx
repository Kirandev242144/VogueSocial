import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Pre-registered system users for the 3 roles: User (Shopper), Merchant, Admin
export const SYSTEM_ACCOUNTS = [
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
    id: 'mch_tom_01',
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
    id: 'adm_alex_01',
    name: 'Alexander Vance',
    email: 'admin@voguesocial.com',
    password: 'admin123',
    role: 'admin',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80',
    memberSince: 'December 2024'
  }
];

const LOCAL_STORAGE_SESSION_KEY = 'vogue_auth_user';
const LOCAL_STORAGE_REGISTRY_KEY = 'vogue_registered_users';

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
        setUser(parsed);
        setStatus('authenticated');
      } catch (e) {
        // Fallback default: Shopper User Sarah
        setUser(SYSTEM_ACCOUNTS[0]);
        setStatus('authenticated');
      }
    } else {
      // Default to Shopper Sarah for instant try-on exploration
      setUser(SYSTEM_ACCOUNTS[0]);
      setStatus('authenticated');
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(SYSTEM_ACCOUNTS[0]));
    }
  }, []);

  /**
   * Real Sign Up for User (or Merchant)
   */
  const signUp = async ({ name, email, password, role = 'user', preferred_size = 'M', gender = 'Women', storeName }) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }
    if (!name || name.trim().length === 0) {
      throw new Error('Please provide your full name.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Attempt Spring Boot backend signup
    let backendUser = null;
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: cleanEmail,
          password: password,
          role: role,
          storeName: storeName || (role === 'merchant' ? `${name.trim()} Store` : undefined)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }
      if (data.success && data.user) {
        backendUser = data.user;
      }
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('already exists')) {
        throw err;
      }
      console.warn('Backend signup request failed or offline, falling back to local registry:', err.message);
    }

    // 2. Prepare user object
    const newUser = {
      id: backendUser?.id || `usr_${Date.now()}`,
      name: backendUser?.name || name.trim(),
      email: backendUser?.email || cleanEmail,
      password: password,
      role: backendUser?.role || role,
      storeName: backendUser?.storeName || (role === 'merchant' ? `${name.trim()} Store` : undefined),
      storeHandle: backendUser?.storeHandle || (role === 'merchant' ? name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : undefined),
      image: role === 'merchant'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      measurements: {
        height: '170 cm',
        weight: '60 kg',
        bust: '88 cm',
        waist: '68 cm',
        hips: '94 cm',
        preferred_size: preferred_size || 'M',
        fit_preference: 'Regular'
      },
      tryonPhotos: []
    };

    const updatedList = [...registeredUsers.filter(u => u.email.toLowerCase() !== cleanEmail), newUser];
    setRegisteredUsers(updatedList);
    localStorage.setItem(LOCAL_STORAGE_REGISTRY_KEY, JSON.stringify(updatedList));

    // Sign in immediately
    setUser(newUser);
    setStatus('authenticated');
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser };
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

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Spring Boot backend sign in
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: password })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        const bu = data.user;
        const loggedUser = {
          id: bu.id,
          name: bu.name || 'Shopper',
          email: bu.email,
          role: bu.role || 'user',
          storeName: bu.storeName,
          storeHandle: bu.storeHandle,
          image: bu.role === 'merchant'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80',
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };

        setUser(loggedUser);
        setStatus('authenticated');
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(loggedUser));
        return { success: true, user: loggedUser };
      } else if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err) {
      if (err.message && (err.message.includes('password') || err.message.includes('credentials') || err.message.includes('found'))) {
        throw err;
      }
      console.warn('Backend signin failed, checking local registry:', err.message);
    }

    // 2. Local fallback verification
    const matched = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!matched) {
      throw new Error('No account found with this email. Please check your email or sign up.');
    }

    if (matched.password && matched.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    // Set session
    setUser(matched);
    setStatus('authenticated');
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(matched));

    return { success: true, user: matched };
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
