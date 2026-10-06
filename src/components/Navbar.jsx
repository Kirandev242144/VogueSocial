'use client';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Image from './Image';
import {
  Search, Bell, ShoppingBag, Heart, Shirt, X,
  Sparkles, User, Store, ShieldCheck, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';
import TopNavbar from './TopNavbar';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const { user, signOut, switchUserRole, isMerchant, isAdmin, isAuthenticated } = useAuth();
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

  return (
    <nav className="navbar">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* 1. Standalone Top Announcement Bar */}
      <TopNavbar />

      {/* 2. Main Header */}
      <div className="main-header">
        <div className="main-header-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <Image
              src="/logo.svg"
              alt="VogueSocial Logo"
              width={140}
              height={36}
              priority
              className="nav-logo-img"
            />
          </Link>

          {/* Search Bar */}
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search designer garments, silhouettes, brands..."
              className="search-input"
              value={localQuery}
              onChange={handleSearch}
            />
            {localQuery && (
              <button onClick={clearSearch} className="clear-search-btn" aria-label="Clear search">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="nav-actions">
            <Link
              to="/shop"
              className={`nav-item ${location.pathname === '/shop' ? 'active' : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Shop</span>
            </Link>

            <Link
              to="/wardrobe"
              className={`nav-item ${location.pathname === '/wardrobe' ? 'active' : ''}`}
              title="My Wardrobe Planner"
            >
              <Shirt size={18} />
              <span>Wardrobe</span>
            </Link>

            <Link to="/profile?tab=tryons" className="nav-item" title="My Virtual Try-Ons">
              <Sparkles size={18} />
              <span>Try-Ons</span>
            </Link>

            {(isMerchant || isAdmin) && (
              <Link to="/merchant/dashboard" className="nav-item" title="Merchant Portal">
                <Store size={18} />
                <span>Merchant</span>
              </Link>
            )}

            <Link to="/profile?tab=wishlist" className="nav-icon-btn" title="Saved Wardrobe / Wishlist">
              <Heart size={20} />
            </Link>

            <button className="nav-icon-btn" title="Notifications">
              <Bell size={20} />
              <span className="cart-badge">2</span>
            </button>

            {user && isAuthenticated ? (
              <div className="user-profile">
                <div
                  className="nav-avatar"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  title={user.name || 'Account Menu'}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={34}
                      height={34}
                      className="user-avatar-img"
                    />
                  ) : (
                    user.name?.charAt(0) || 'U'
                  )}
                </div>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    {/* User Header */}
                    <div className="dropdown-header">
                      <div className="dropdown-user-name">{user.name}</div>
                      <span className="dropdown-user-email">{user.email}</span>
                      <div>
                        {user.role === 'merchant' ? (
                          <span className="dropdown-badge-merchant">Merchant Account</span>
                        ) : user.role === 'admin' ? (
                          <span className="dropdown-badge-admin">Admin Console</span>
                        ) : (
                          <span className="dropdown-badge-customer">Verified Shopper</span>
                        )}
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={15} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/profile?tab=tryons"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Sparkles size={15} />
                      <span>My Virtual Try-Ons</span>
                    </Link>

                    <Link
                      to="/profile?tab=wishlist"
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Heart size={15} />
                      <span>Saved Wardrobe</span>
                    </Link>

                    {(user.role === 'merchant' || user.role === 'admin') && (
                      <Link
                        to="/merchant/dashboard"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Store size={15} />
                        <span>Merchant Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/products"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <ShieldCheck size={15} />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="dropdown-sign-out"
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
              <button className="login-btn" onClick={() => setIsAuthModalOpen(true)}>
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
