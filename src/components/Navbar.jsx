'use client';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Image from './Image';
import {
  Search, Bell, ShoppingBag, Heart, Shirt, X,
  Sparkles, User, Store, ShieldCheck, LogOut
} from 'lucide-react';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

const Navbar = ({ onSearch }) => {
  const { user, signOut, switchUserRole, isShopper, isMerchant, isAdmin, isAuthenticated } = useAuth();
  const [localQuery, setLocalQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    const query = e.target.value;
    setLocalQuery(query);
    if (onSearch) onSearch(query);
  };

  const clearSearch = () => {
    setLocalQuery('');
    if (onSearch) onSearch('');
  };

  const handleRoleSwitch = (targetRole) => {
    switchUserRole(targetRole);
    setIsDropdownOpen(false);
    if (targetRole === 'merchant') {
      navigate('/merchant/dashboard');
    } else if (targetRole === 'admin') {
      navigate('/admin/products');
    } else {
      navigate('/profile');
    }
  };

  return (
    <nav className={styles.navbar}>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* 1. Top Announcement Bar */}
      <div className={styles.topBar}>
        Welcome to VogueSocial — Haute Virtual Try-On & Creator Storefronts
      </div>

      {/* 2. Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.mainHeaderContainer}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="VogueSocial Logo"
              width={140}
              height={36}
              priority
              className={styles.logoImg}
            />
          </Link>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search designer garments, silhouettes, brands..."
              className={styles.searchInput}
              value={localQuery}
              onChange={handleSearch}
            />
            {localQuery && (
              <button onClick={clearSearch} className={styles.clearSearchBtn} aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className={styles.actions}>
            <Link
              to="/shop"
              className={`${styles.navItem} ${location.pathname === '/shop' ? styles.navItemActive : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Shop</span>
            </Link>

            <Link
              to="/wardrobe"
              className={`${styles.navItem} ${location.pathname === '/wardrobe' ? styles.navItemActive : ''}`}
              title="My Wardrobe Planner"
            >
              <Shirt size={18} />
              <span>Wardrobe</span>
            </Link>

            <Link to="/profile?tab=tryons" className={styles.navItem} title="My Virtual Try-Ons">
              <Sparkles size={18} />
              <span>Try-Ons</span>
            </Link>

            {(isMerchant || isAdmin) && (
              <Link to="/merchant/dashboard" className={styles.navItem} title="Merchant Portal">
                <Store size={18} />
                <span>Merchant</span>
              </Link>
            )}

            <Link to="/profile?tab=wishlist" className={styles.iconBtn} title="Saved Wardrobe / Wishlist">
              <Heart size={20} />
            </Link>

            <button className={styles.iconBtn} title="Notifications">
              <Bell size={20} />
              <span className={styles.cartBadge}>2</span>
            </button>

            {user && isAuthenticated ? (
              <div className={styles.userProfile}>
                <div
                  className={styles.avatar}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  title={user.name || 'Account Menu'}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={34}
                      height={34}
                      className={styles.userAvatarImg}
                    />
                  ) : (
                    user.name?.charAt(0) || 'U'
                  )}
                </div>

                {isDropdownOpen && (
                  <div className={styles.dropdown}>
                    {/* User Header */}
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownUserName}>{user.name}</div>
                      <span className={styles.dropdownUserEmail}>{user.email}</span>
                      <div>
                        {user.role === 'merchant' ? (
                          <span className={styles.dropdownUserBadgeMerchant}>Merchant Account</span>
                        ) : user.role === 'admin' ? (
                          <span className={styles.dropdownUserBadgeAdmin}>Admin Console</span>
                        ) : (
                          <span className={styles.dropdownUserBadgeCustomer}>Verified Shopper</span>
                        )}
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <Link
                      to="/profile"
                      className={styles.dropdownItem}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={15} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/profile?tab=tryons"
                      className={styles.dropdownItem}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Sparkles size={15} />
                      <span>My Virtual Try-Ons</span>
                    </Link>

                    <Link
                      to="/profile?tab=wishlist"
                      className={styles.dropdownItem}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Heart size={15} />
                      <span>Saved Wardrobe</span>
                    </Link>

                    {(user.role === 'merchant' || user.role === 'admin') && (
                      <Link
                        to="/merchant/dashboard"
                        className={styles.dropdownItem}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Store size={15} />
                        <span>Merchant Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/products"
                        className={styles.dropdownItem}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <ShieldCheck size={15} />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className={styles.dropdownDivider} />

                    <button
                      type="button"
                      className={styles.dropdownSignOut}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut();
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => setIsAuthModalOpen(true)}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
