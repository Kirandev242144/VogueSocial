"use client";
import React, { useEffect, useState, useMemo } from 'react';
import {
  Search, ShoppingBag, ArrowRight, Sparkles, Star, Check, X,
  ShieldCheck, Truck, RotateCcw, Lock, ChevronDown, Filter,
  Heart, SlidersHorizontal, Plus, Minus, Trash2, ExternalLink
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './store.module.css';
import TryOnModal from '@/components/TryOnModal';
import { getStoreByHandle, STORE_PRODUCTS } from '@/lib/storefrontData';

const TEMPLATES = {
  modern: `--bg: #F8FAFC; --bg2: #FFFFFF; --surface: #FFFFFF; --border: #E2E8F0; --text1: #0F172A; --text2: #334155; --text3: #64748B; --accent: #2563EB; --accent-text: #FFFFFF; --btn-radius: 10px; --card-radius: 14px; --font-heading: 'Plus Jakarta Sans', sans-serif; --font-body: 'Inter', sans-serif;`,
  minimal: `--bg: #FFFFFF; --bg2: #F9F7F4; --surface: #FFFFFF; --border: #E8E4DE; --text1: #1A1A1A; --text2: #4A4A4A; --text3: #8A8A8A; --accent: #1A1A1A; --accent-text: #FFFFFF; --btn-radius: 0px; --card-radius: 0px; --font-heading: 'Cormorant Garamond', serif; --font-body: 'Jost', sans-serif;`,
  luxury: `--bg: #1C1C1E; --bg2: #242426; --surface: #2A2A2C; --border: #3A3A3C; --text1: #C9A84C; --text2: #E8E8E8; --text3: #888888; --accent: #C9A84C; --accent-text: #1C1C1E; --btn-radius: 0px; --card-radius: 4px; --font-heading: 'Playfair Display', serif; --font-body: 'Montserrat', sans-serif;`,
  streetwear: `--bg: #0A0A0A; --bg2: #111111; --surface: #1A1A1A; --border: #2A2A2A; --text1: #FFFFFF; --text2: #CCCCCC; --text3: #666666; --accent: #CCFF00; --accent-text: #0A0A0A; --btn-radius: 0px; --card-radius: 0px; --font-heading: 'Barlow Condensed', sans-serif; --font-body: 'Barlow', sans-serif;`,
  boutique: `--bg: #FAF7F2; --bg2: #F5EFE8; --surface: #FFFFFF; --border: #EAE0D5; --text1: #2C1810; --text2: #5C3D2E; --text3: #9B7E6E; --accent: #C47E6B; --accent-text: #FFFFFF; --btn-radius: 24px; --card-radius: 12px; --font-heading: 'Libre Baskerville', serif; --font-body: 'Nunito', sans-serif;`,
};

function getLuminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return null;
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return { r, g, b };
}

export default function StorefrontPage() {
  const params = useParams();
  const navigate = useNavigate();
  const handle = (params.handle || 'studiolabel').toLowerCase();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Selected product color map { [productId]: selectedColorName }
  const [selectedColors, setSelectedColors] = useState({});

  // Slide-over cart state
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(`vogue_cart_${handle}`);
      return stored ? JSON.parse(stored) : { items: [] };
    } catch (e) {
      return { items: [] };
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Virtual Try-On Modal state
  const [selectedTryOnProduct, setSelectedTryOnProduct] = useState(null);
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  // Newsletter state
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function loadStorefront() {
      setLoading(true);
      let loadedStore = null;
      let loadedProducts = [];

      try {
        const res = await fetch(`/api/store/${handle}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.store) {
            loadedStore = data.store;
            loadedProducts = data.products || [];
          }
        }
      } catch (err) {
        // Fall back to local store
      }

      if (!loadedStore) {
        const local = getStoreByHandle(handle);
        loadedStore = local.store;
        loadedProducts = local.products;
      }

      setStore(loadedStore);
      setProducts(loadedProducts);
      setLoading(false);
    }

    loadStorefront();
  }, [handle]);

  // Persist cart to localStorage
  useEffect(() => {
    if (store) {
      localStorage.setItem(`vogue_cart_${handle}`, JSON.stringify(cart));
    }
  }, [cart, handle, store]);

  const cartItemCount = useMemo(() => {
    return (cart.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return (cart.items || []).reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  }, [cart]);

  const finalTotal = useMemo(() => {
    const discount = discountApplied ? cartSubtotal * 0.20 : 0;
    return Math.max(0, cartSubtotal - discount);
  }, [cartSubtotal, discountApplied]);

  const handleAddToCart = (product, colorChoice = null) => {
    const color = colorChoice || selectedColors[product.id] || product.colors?.[0] || 'Default';
    const size = product.sizes?.[0] || 'M';
    const price = product.sale_price || product.price;

    setCart(prev => {
      const items = [...prev.items];
      const existingIdx = items.findIndex(
        it => it.productId === product.id && it.color === color && it.size === size
      );

      if (existingIdx > -1) {
        items[existingIdx].quantity = (items[existingIdx].quantity || 1) + 1;
      } else {
        items.push({
          productId: product.id,
          name: product.name,
          price: price,
          image: product.image_url,
          color: color,
          size: size,
          quantity: 1
        });
      }
      return { items };
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index, delta) => {
    setCart(prev => {
      const items = [...prev.items];
      const newQty = (items[index].quantity || 1) + delta;
      if (newQty <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = newQty;
      }
      return { items };
    });
  };

  const handleRemoveCartItem = (index) => {
    setCart(prev => {
      const items = [...prev.items];
      items.splice(index, 1);
      return { items };
    });
  };

  const handleOpenTryOn = (product, e) => {
    if (e) e.stopPropagation();
    setSelectedTryOnProduct({
      id: product.id,
      name: product.name,
      image_url: product.image_url,
      category: product.category,
      price: product.sale_price || product.price
    });
    setIsTryOnOpen(true);
  };

  const categories = useMemo(() => {
    const cats = new Set();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchesCat = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    }
    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading storefront...</p>
        </div>
      </div>
    );
  }

  const templateName = store.template || 'modern';
  let cssVars = TEMPLATES[templateName] || TEMPLATES.modern;
  if (store.accent_color) {
    const rgb = hexToRgb(store.accent_color);
    let accentText = '#FFFFFF';
    if (rgb) {
      const lum = getLuminance(rgb.r, rgb.g, rgb.b);
      if (lum > 0.5) accentText = '#000000';
    }
    cssVars += ` --accent: ${store.accent_color}; --accent-text: ${accentText};`;
  }

  const effectiveSubdomain = `${handle}.voguesocial.com`;
  const effectiveCustomDomain = store.custom_domain;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text2)',
        fontFamily: 'var(--font-body)',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease'
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Jost:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600&family=Nunito:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
          ${cssVars}
        }

        /* ── Modern Top Announcement Bar ── */
        .modern-announcement {
          background: #0f172a;
          color: #f8fafc;
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          letter-spacing: 0.02em;
        }

        /* ── Store Header (Glass / Sticky) ── */
        .store-header {
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2.5rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .header-logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .store-logo-fallback {
          height: 38px;
          width: 38px;
          background: #0f172a;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
          border-radius: var(--btn-radius);
        }

        .store-domain-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 3px 9px;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
        }

        .header-nav {
          display: flex;
          gap: 1.75rem;
        }

        @media (max-width: 900px) {
          .header-nav { display: none; }
          .store-domain-pill { display: none; }
        }

        .header-nav a {
          text-decoration: none;
          color: var(--text2);
          font-weight: 600;
          font-size: 0.88rem;
          transition: color 0.15s;
        }

        .header-nav a:hover {
          color: var(--text1);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .action-icon-btn {
          background: none;
          border: 1px solid transparent;
          cursor: pointer;
          color: var(--text2);
          padding: 0.45rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          position: relative;
        }

        .action-icon-btn:hover {
          background: var(--bg);
          color: var(--text1);
          border-color: var(--border);
        }

        .cart-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--accent-text);
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Search Drawer ── */
        .search-drawer {
          padding: 1rem 2.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .search-input-box {
          max-width: 650px;
          margin: 0 auto;
          position: relative;
        }

        .search-input-box input {
          width: 100%;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: var(--btn-radius);
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          color: var(--text1);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input-box input:focus {
          border-color: var(--accent);
        }

        .search-icon-pos {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text3);
        }

        /* ── Modern Hero Section ── */
        .modern-hero {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0f172a;
          color: #ffffff;
        }

        .modern-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.45;
          filter: brightness(0.85);
        }

        .modern-hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 820px;
          padding: 3rem 1.5rem;
        }

        .modern-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .modern-hero-title {
          font-family: var(--font-heading);
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin: 0 0 1rem 0;
        }

        @media (max-width: 768px) {
          .modern-hero-title { font-size: 2.3rem; }
        }

        .modern-hero-desc {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.6;
          margin: 0 auto 2rem auto;
          max-width: 620px;
        }

        .modern-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          color: #0f172a;
          padding: 0.85rem 1.75rem;
          border-radius: var(--btn-radius);
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 0.85rem 1.75rem;
          border-radius: var(--btn-radius);
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.2s;
        }

        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        /* ── Modern USP Perks Bar ── */
        .perks-bar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1.5rem 2.5rem;
        }

        .perks-grid {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .perks-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 550px) {
          .perks-grid { grid-template-columns: 1fr; }
        }

        .perk-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .perk-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .perk-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text1);
        }

        .perk-sub {
          font-size: 0.72rem;
          color: var(--text3);
          margin-top: 1px;
        }

        /* ── Main Catalog Section ── */
        .catalog-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
        }

        .catalog-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .category-pill-group {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .category-pill {
          white-space: nowrap;
          padding: 0.45rem 1.15rem;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text2);
          border-radius: 99px;
          cursor: pointer;
          font-size: 0.82rem;
          font-weight: 600;
          transition: all 0.15s;
        }

        .category-pill:hover {
          border-color: var(--text1);
          color: var(--text1);
        }

        .category-pill-active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .sort-select {
          padding: 0.45rem 0.85rem;
          border: 1px solid var(--border);
          border-radius: var(--btn-radius);
          background: var(--surface);
          color: var(--text1);
          font-size: 0.82rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        /* ── Products Grid ── */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem 1.5rem;
        }

        @media (max-width: 1100px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem 0.85rem; }
        }

        .product-card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--card-radius);
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
        }

        .product-image-box {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: #f1f5f9;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        .badge-pill-top {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(6px);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 99px;
          letter-spacing: 0.04em;
          z-index: 10;
        }

        .quick-actions-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.35);
          backdrop-filter: blur(2px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
          padding: 1rem;
          z-index: 10;
        }

        .product-card:hover .quick-actions-overlay {
          opacity: 1;
        }

        .btn-quick-tryon {
          width: 100%;
          padding: 0.6rem 1rem;
          background: #ffffff;
          color: #0f172a;
          border: none;
          border-radius: var(--btn-radius);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: transform 0.15s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .btn-quick-tryon:hover {
          transform: scale(1.02);
        }

        .btn-quick-view {
          width: 100%;
          padding: 0.55rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          color: #0f172a;
          border: none;
          border-radius: var(--btn-radius);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }

        .product-details {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-category {
          font-size: 0.68rem;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
          margin-bottom: 0.2rem;
        }

        .product-title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text1);
          line-height: 1.3;
          margin: 0 0 0.4rem 0;
        }

        .product-price-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: auto;
          padding-top: 0.4rem;
        }

        .price-curr {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text1);
        }

        .price-strike {
          text-decoration: line-through;
          color: var(--text3);
          font-size: 0.82rem;
        }

        .swatch-dots {
          display: flex;
          gap: 5px;
          margin-top: 0.6rem;
        }

        .swatch-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          cursor: pointer;
        }

        .btn-add-cart-card {
          margin-top: 0.75rem;
          width: 100%;
          padding: 0.5rem;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: var(--btn-radius);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background 0.15s;
        }

        .btn-add-cart-card:hover {
          background: #1e293b;
        }

        /* ── Slide-Over Cart Drawer ── */
        .cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease;
        }

        .cart-drawer {
          width: 100%;
          max-width: 420px;
          height: 100%;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 32px rgba(0,0,0,0.15);
          animation: slideInRight 0.25s ease-out;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .cart-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cart-items-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item-row {
          display: flex;
          gap: 0.85rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .cart-item-img {
          width: 60px;
          height: 75px;
          border-radius: 8px;
          object-fit: cover;
          background: #f1f5f9;
        }

        .cart-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .btn-checkout {
          width: 100%;
          padding: 0.85rem;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-checkout:hover {
          background: #1e293b;
        }
      `}} />

      {/* ── 1. MODERN TOP ANNOUNCEMENT BAR ── */}
      <div className="modern-announcement">
        <span>⚡ VOGUESOCIAL LIVE STORE · Free Global Shipping Over $150 · 100% In-Browser AI Virtual Try-On</span>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 8px', borderRadius: 99, fontSize: '0.68rem' }}>
          Code: VOGUE20 (-20%)
        </span>
      </div>

      {/* ── 2. STICKY MODERN GLASS HEADER ── */}
      <header className="store-header">
        <div className="header-left">
          <Link to={`/store/${handle}`} className="header-logo-container">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.store_name} style={{ height: 36, objectFit: 'contain' }} />
            ) : (
              <div className="store-logo-fallback">
                {store.store_name?.charAt(0).toUpperCase() || 'S'}
              </div>
            )}
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text1)', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
              {store.store_name}
            </span>
          </Link>

          {/* Subdomain & Custom Domain Live Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="store-domain-pill" title="VogueSocial Subdomain">
              <Globe size={11} color="#2563eb" /> {effectiveSubdomain}
            </span>

            {effectiveCustomDomain && (
              <span className="store-domain-pill" style={{ color: '#166534', background: '#f0fdf4', borderColor: '#bbf7d0' }} title="Custom Domain SSL Active">
                <Lock size={10} color="#16a34a" /> {effectiveCustomDomain}
              </span>
            )}
          </div>
        </div>

        <nav className="header-nav">
          <a href="#shop">Shop All</a>
          <a href="#shop" onClick={() => setActiveCategory('Outerwear')}>Outerwear</a>
          <a href="#shop" onClick={() => setActiveCategory('Dresses')}>Dresses</a>
          <a href="#shop" onClick={() => setActiveCategory('Tailored Suiting')}>Tailored Suiting</a>
          <button
            onClick={() => handleOpenTryOn(products[0])}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#2563eb', fontWeight: 700, fontSize: '0.88rem' }}
          >
            <Sparkles size={14} /> AI Fitting Studio
          </button>
        </nav>

        <div className="header-actions">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="action-icon-btn"
            title="Search Products"
          >
            <Search size={18} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="action-icon-btn"
            title="View Shopping Cart"
          >
            <ShoppingBag size={18} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>
        </div>
      </header>

      {/* ── SEARCH DRAWER ── */}
      {isSearchOpen && (
        <div className="search-drawer">
          <div className="search-input-box">
            <Search size={16} className="search-icon-pos" />
            <input
              type="text"
              placeholder="Search modern apparel, silk dresses, cashmere, trench coats..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}

      {/* ── 3. MODERN FLAGSHIP HERO SECTION ── */}
      <section className="modern-hero">
        <img
          src={store.hero_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80'}
          alt="Store collection preview"
          className="modern-hero-img"
        />

        <div className="modern-hero-content">
          <div className="modern-hero-badge">
            <Sparkles size={12} color="#60a5fa" />
            <span>2026 Collection · OmniTry AI Virtual Fitting Ready</span>
          </div>

          <h1 className="modern-hero-title">
            {store.store_name}
          </h1>

          <p className="modern-hero-desc">
            {store.tagline || 'Modern Tailoring & In-Browser AI Virtual Fitting Studio'}
          </p>

          <div className="modern-hero-actions">
            <a href="#shop" className="hero-btn-primary">
              Explore Collection <ArrowRight size={15} />
            </a>

            {products.length > 0 && (
              <button onClick={() => handleOpenTryOn(products[0])} className="hero-btn-secondary">
                <Sparkles size={15} color="#93c5fd" /> Test AI Virtual Try-On
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. MODERN TRUST & USP GUARANTEE BAR ── */}
      <div className="perks-bar">
        <div className="perks-grid">
          <div className="perk-card">
            <div className="perk-icon-wrap"><Sparkles size={18} /></div>
            <div>
              <div className="perk-title">Instant Virtual Fitting</div>
              <div className="perk-sub">Fit onto your body silhouette in-browser</div>
            </div>
          </div>

          <div className="perk-card">
            <div className="perk-icon-wrap"><Truck size={18} /></div>
            <div>
              <div className="perk-title">Express Global Dispatch</div>
              <div className="perk-sub">Shipped within 24-48 hours from Milan</div>
            </div>
          </div>

          <div className="perk-card">
            <div className="perk-icon-wrap"><ShieldCheck size={18} /></div>
            <div>
              <div className="perk-title">Haute Certified Quality</div>
              <div className="perk-sub">100% sustainable European textiles</div>
            </div>
          </div>

          <div className="perk-card">
            <div className="perk-icon-wrap"><RotateCcw size={18} /></div>
            <div>
              <div className="perk-title">30-Day Free Returns</div>
              <div className="perk-sub">Prepaid return shipping included</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. MAIN CATALOG & PRODUCTS ── */}
      <main id="shop" className="catalog-container">
        
        {/* Filter and Sorting Header */}
        <div className="catalog-top-bar">
          <div className="category-pill-group">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-pill ${activeCategory === cat ? 'category-pill-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
            <ShoppingBag size={40} color="var(--text3)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>No garments found</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>Try selecting a different category or clearing your search term.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const activeColor = selectedColors[product.id] || product.colors?.[0] || 'Default';
              const isSale = Boolean(product.sale_price);

              return (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => navigate(`/store/${handle}/product/${product.id}`)}
                >
                  <div className="product-image-box">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-img"
                    />

                    {product.badge && (
                      <div className="badge-pill-top">{product.badge}</div>
                    )}

                    {/* Hover Quick Actions */}
                    <div className="quick-actions-overlay" onClick={e => e.stopPropagation()}>
                      <button
                        className="btn-quick-tryon"
                        onClick={(e) => handleOpenTryOn(product, e)}
                      >
                        <Sparkles size={14} color="#2563eb" />
                        <span>Try On Virtually</span>
                      </button>

                      <button
                        className="btn-quick-view"
                        onClick={() => navigate(`/store/${handle}/product/${product.id}`)}
                      >
                        Quick Details
                      </button>
                    </div>
                  </div>

                  <div className="product-details">
                    <div className="product-category">{product.category}</div>
                    <h3 className="product-title">{product.name}</h3>

                    <div className="product-price-box">
                      <span className="price-curr">
                        ${product.sale_price || product.price}
                      </span>
                      {isSale && (
                        <span className="price-strike">${product.price}</span>
                      )}
                    </div>

                    {/* Color swatches */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="swatch-dots" onClick={e => e.stopPropagation()}>
                        {product.colors.map(c => (
                          <div
                            key={c}
                            className="swatch-dot"
                            title={c}
                            style={{
                              background: c.toLowerCase().includes('black') ? '#1e293b' :
                                c.toLowerCase().includes('camel') ? '#c29a6b' :
                                c.toLowerCase().includes('white') || c.toLowerCase().includes('cream') ? '#f8fafc' :
                                c.toLowerCase().includes('navy') ? '#1e3a8a' :
                                c.toLowerCase().includes('grey') || c.toLowerCase().includes('slate') ? '#94a3b8' :
                                c.toLowerCase().includes('emerald') || c.toLowerCase().includes('olive') ? '#15803d' : '#cbd5e1',
                              boxShadow: activeColor === c ? '0 0 0 2px #0f172a' : 'none'
                            }}
                            onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: c }))}
                          />
                        ))}
                      </div>
                    )}

                    {/* Direct Add to Cart button */}
                    <button
                      className="btn-add-cart-card"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product, activeColor);
                      }}
                    >
                      <ShoppingBag size={13} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── 6. SLIDE-OVER CART DRAWER ── */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingBag size={18} />
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  Shopping Bag ({cartItemCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-body">
              {cart.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                  <ShoppingBag size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a', marginBottom: 4 }}>Your bag is empty</div>
                  <div style={{ fontSize: '0.78rem' }}>Explore our catalog and try on garments with AI!</div>
                </div>
              ) : (
                cart.items.map((item, idx) => (
                  <div key={`${item.productId}-${idx}`} className="cart-item-row">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                        Color: {item.color} · Size: {item.size}
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: 4 }}>
                        ${item.price}
                      </div>

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc' }}>
                          <button
                            onClick={() => handleUpdateQuantity(idx, -1)}
                            style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
                          >
                            <Minus size={11} />
                          </button>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, padding: '0 4px', minWidth: 16, textAlign: 'center' }}>
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(idx, 1)}
                            style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveCartItem(idx)}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2 }}
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.items.length > 0 && (
              <div className="cart-footer">
                {/* Promo Voucher Box */}
                <div style={{ display: 'flex', gap: 6, marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Promo code (try VOGUE20)"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '0.45rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '0.78rem', outline: 'none' }}
                  />
                  <button
                    onClick={() => {
                      if (promoCode === 'VOGUE20') setDiscountApplied(true);
                      else alert('Invalid coupon code. Try VOGUE20 for 20% off!');
                    }}
                    style={{ padding: '0.45rem 0.85rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Apply
                  </button>
                </div>

                {/* Pricing summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toLocaleString()}</span>
                  </div>

                  {discountApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
                      <span>Vogue Promo (-20%)</span>
                      <span>-${(cartSubtotal * 0.20).toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Global Express Shipping</span>
                    <span>{cartSubtotal > 150 ? 'FREE' : '$15.00'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', paddingTop: 6, borderTop: '1px solid #e2e8f0' }}>
                    <span>Total</span>
                    <span>${finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {checkoutSuccess ? (
                  <div style={{ padding: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, color: '#166534', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
                    ✓ Order Placed! Confirmation sent to your email.
                  </div>
                ) : (
                  <button
                    className="btn-checkout"
                    onClick={() => {
                      setCheckoutSuccess(true);
                      setTimeout(() => {
                        setCart({ items: [] });
                        setCheckoutSuccess(false);
                        setIsCartOpen(false);
                      }, 2500);
                    }}
                  >
                    <Lock size={14} />
                    <span>Proceed to Secure Checkout</span>
                  </button>
                )}

                <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.68rem', color: '#94a3b8' }}>
                  🔒 256-Bit Encrypted Edge Checkout · Powered by VogueSocial
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 7. INTEGRATED VIRTUAL TRY-ON MODAL ── */}
      {isTryOnOpen && selectedTryOnProduct && (
        <TryOnModal
          isOpen={isTryOnOpen}
          onClose={() => setIsTryOnOpen(false)}
          product={selectedTryOnProduct}
        />
      )}

      {/* ── 8. MODERN EDITORIAL FOOTER ── */}
      <footer style={{ background: '#0f172a', color: '#f8fafc', padding: '4rem 2rem 2.5rem' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '3rem', marginBottom: '3.5rem' }}>
          
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '0.85rem' }}>
              {store.store_name}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: 360, margin: '0 0 1.25rem 0' }}>
              {store.description || 'Modern tailoring, clean silhouettes, and zero-latency in-browser AI fitting rooms.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#cbd5e1' }}>
              <Lock size={12} color="#4ade80" />
              <span>TLS 1.3 Active · Verified by VogueSocial Anycast DNS</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', color: '#ffffff' }}>
              Collections
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>Outerwear & Trench</a>
              <a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>Silk Eveningwear</a>
              <a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>Mongolian Cashmere</a>
              <a href="#shop" style={{ color: 'inherit', textDecoration: 'none' }}>Tailored Suiting</a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', color: '#ffffff' }}>
              Customer Care
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>{store.email || 'concierge@studiolabelparis.com'}</span>
              <span>{store.phone || '+33 1 42 68 55 00'}</span>
              <span>Complimentary 30-Day Returns</span>
              <span>Global Sizing Guide</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', color: '#ffffff' }}>
              Private Client Dispatch
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
              Join our private list for seasonal lookbooks, priority virtual try-on releases, and private sales.
            </p>
            {subscribed ? (
              <div style={{ padding: '0.5rem', background: 'rgba(34,197,94,0.15)', color: '#4ade80', borderRadius: 6, fontSize: '0.78rem' }}>
                ✓ Subscribed to Private Client List
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem 0.75rem', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#fff', fontSize: '0.78rem', outline: 'none' }}
                />
                <button
                  onClick={() => { if (emailInput) setSubscribed(true); }}
                  style={{ padding: '0.5rem 0.85rem', background: '#ffffff', color: '#0f172a', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1240, margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            &copy; {new Date().getFullYear()} {store.store_name}. Powered by <strong>VogueSocial Storefronts</strong>.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>DNS Mapping Status: {store.domain_status === 'ssl_active' ? 'Secured (TLS 1.3)' : 'Anycast Active'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
