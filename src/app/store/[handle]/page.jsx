"use client";
import React, { useEffect, useState, useMemo } from 'react';
import {
  Search, ShoppingBag, ArrowRight, Sparkles, Check, X,
  Lock, Plus, Minus, Trash2, SlidersHorizontal
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './store.module.css';
import TryOnModal from '@/components/TryOnModal';
import { getStoreByHandle, STORE_PRODUCTS } from '@/lib/storefrontData';

const COLOR_HEX_MAP = {
  'obsidian black': '#111827',
  'black': '#0a0a0a',
  'jet black': '#0f172a',
  'camel': '#c19a6b',
  'stone grey': '#9ca3af',
  'grey': '#9ca3af',
  'heather grey': '#94a3b8',
  'charcoal grey': '#374151',
  'charcoal': '#374151',
  'cream white': '#f5f5dc',
  'cream': '#fdfbf7',
  'white': '#ffffff',
  'champagne': '#f7e7ce',
  'midnight navy': '#0f172a',
  'deep navy': '#1e293b',
  'navy': '#1e3a8a',
  'emerald': '#047857',
  'green': '#15803d',
  'oatmeal': '#e6d7b9',
  'muted olive': '#556b2f',
  'olive': '#65a30d',
  'vintage cognac': '#9e4714',
  'cognac': '#a16207',
  'burgundy': '#800020',
  'rose': '#fda4af',
  'pink': '#f472b6',
  'blue': '#2563eb',
  'brown': '#78350f',
  'beige': '#f5f5dc',
  'tan': '#d2b48c',
  'khaki': '#c3b091',
};

function getColorHex(colorName) {
  if (!colorName) return '#334155';
  if (colorName.startsWith('#')) return colorName;
  const lower = colorName.toLowerCase().trim();
  return COLOR_HEX_MAP[lower] || '#475569';
}

export default function StorefrontPage({ handle: propHandle } = {}) {
  const params = useParams();
  const navigate = useNavigate();
  const handle = (propHandle || params.handle || 'studiolabel').toLowerCase();

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
        if (local && local.store) {
          loadedStore = local.store;
          loadedProducts = local.products || [];
        }
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
    const price = product.sale_price || product.salePrice || product.price;

    setCart(prev => {
      const items = [...prev.items];
      const existingIdx = items.findIndex(
        it => it.productId === product.id && it.color === color && it.size === size
      );

      if (existingIdx > -1) {
        items[existingIdx].quantity += 1;
      } else {
        items.push({
          productId: product.id,
          name: product.name,
          price: Number(price),
          image: product.image_url || product.imageUrl,
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
      image_url: product.image_url || product.imageUrl,
      category: product.category,
      price: product.sale_price || product.salePrice || product.price
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
          <p className={styles.loadingText}>Opening luxury storefront...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundTitle}>Storefront Not Found</h1>
        <p className={styles.notFoundText}>
          The merchant atelier you are searching for is currently unlisted.
        </p>
        <Link to="/" className={styles.notFoundBtn}>
          Return to VogueSocial
        </Link>
      </div>
    );
  }

  const isEmbedded = typeof window !== 'undefined' && window.location.search.includes('embedded=true');

  return (
    <div
      style={{
        backgroundColor: '#FAFAF9',
        color: '#1C1917',
        fontFamily: "'Inter', sans-serif",
        minHeight: '100vh',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        /* ── Minimalist Magazine Top Announcement ── */
        .mag-topbar {
          background: #111827;
          color: #F3F4F6;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-align: center;
          padding: 0.5rem 1rem;
        }

        /* ── Magazine Header ── */
        .mag-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250, 250, 249, 0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #E7E5E4;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 1.25rem 3rem;
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .mag-header {
            padding: 1rem 1.5rem;
            grid-template-columns: auto 1fr auto;
          }
        }

        .mag-nav-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .mag-nav-left { display: none; }
        }

        .mag-nav-link {
          font-size: 0.8rem;
          font-weight: 500;
          color: #57534E;
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .mag-nav-link:hover {
          color: #0A0A0A;
        }

        /* Center Brand Logo */
        .mag-brand-title {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0A0A0A;
          text-decoration: none;
          text-align: center;
          transition: opacity 0.2s;
        }

        .mag-brand-title:hover {
          opacity: 0.85;
        }

        .mag-actions-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.25rem;
        }

        .mag-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #292524;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.15s, color 0.2s;
        }

        .mag-icon-btn:hover {
          color: #0A0A0A;
          transform: scale(1.06);
        }

        .mag-cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #0A0A0A;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* ── Search Bar Drawer ── */
        .mag-search-bar {
          background: #FFFFFF;
          border-bottom: 1px solid #E7E5E4;
          padding: 1.25rem 3rem;
          display: flex;
          justify-content: center;
        }

        .mag-search-input {
          max-width: 600px;
          width: 100%;
          border: none;
          border-bottom: 1.5px solid #0A0A0A;
          padding: 0.65rem 0;
          font-size: 1rem;
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.04em;
          outline: none;
          background: transparent;
        }

        /* ── Magazine Editorial Hero ── */
        .mag-hero {
          position: relative;
          height: 80vh;
          min-height: 540px;
          max-height: 780px;
          width: 100%;
          overflow: hidden;
          background: #1C1917;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mag-hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
          filter: contrast(105%) brightness(95%);
          transform: scale(1.02);
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mag-hero:hover .mag-hero-image {
          transform: scale(1.05);
        }

        .mag-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.65) 100%);
        }

        .mag-hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: #FFFFFF;
          max-width: 840px;
          padding: 2rem;
        }

        .mag-hero-kicker {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #E7E5E4;
          margin-bottom: 1.25rem;
          display: block;
        }

        .mag-hero-headline {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 6vw, 4.8rem);
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.01em;
          margin: 0 0 1.25rem 0;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }

        .mag-hero-tagline {
          font-size: 1.05rem;
          font-weight: 300;
          color: #E7E5E4;
          max-width: 520px;
          margin: 0 auto 2.25rem auto;
          line-height: 1.6;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-style: italic;
        }

        .mag-hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.95rem 2.5rem;
          background: #FFFFFF;
          color: #0A0A0A;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          border-radius: 0px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }

        .mag-hero-btn:hover {
          background: #0A0A0A;
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        /* ── Minimalist Editorial Strip ── */
        .mag-dispatch-strip {
          border-top: 1px solid #E7E5E4;
          border-bottom: 1px solid #E7E5E4;
          padding: 1.25rem 2rem;
          background: #FFFFFF;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #78716C;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .mag-dispatch-strip { gap: 1.25rem; font-size: 0.65rem; }
        }

        /* ── Catalog Section ── */
        .mag-catalog {
          max-width: 1400px;
          margin: 0 auto;
          padding: 5rem 3rem 8rem;
        }

        @media (max-width: 768px) {
          .mag-catalog { padding: 3rem 1.5rem 5rem; }
        }

        .mag-catalog-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3.5rem;
          border-bottom: 1px solid #E7E5E4;
          padding-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .mag-category-tabs {
          display: flex;
          gap: 2.25rem;
          overflow-x: auto;
        }

        .mag-category-tab {
          background: none;
          border: none;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #78716C;
          cursor: pointer;
          padding-bottom: 0.75rem;
          position: relative;
          transition: color 0.2s;
        }

        .mag-category-tab:hover {
          color: #0A0A0A;
        }

        .mag-category-tab-active {
          color: #0A0A0A;
          font-weight: 700;
        }

        .mag-category-tab-active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1.5px;
          background: #0A0A0A;
        }

        .mag-sort-select {
          border: none;
          background: transparent;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #44403C;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        /* ── Editorial Product Grid ── */
        .mag-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3rem 2rem;
        }

        @media (max-width: 1100px) {
          .mag-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .mag-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem 1rem; }
        }

        @media (max-width: 480px) {
          .mag-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        }

        .mag-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
        }

        .mag-image-wrap {
          position: relative;
          aspect-ratio: 3/4;
          width: 100%;
          background: #F5F5F4;
          overflow: hidden;
          margin-bottom: 1.1rem;
        }

        .mag-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mag-card:hover .mag-img {
          transform: scale(1.04);
        }

        /* Sleek Minimal Floating Hover Pill */
        .mag-tryon-pill {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          opacity: 0;
          background: rgba(10, 10, 10, 0.9);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          border: none;
          padding: 0.55rem 1.1rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
          transition: all 0.25s ease;
          white-space: nowrap;
          z-index: 5;
        }

        .mag-card:hover .mag-tryon-pill {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .mag-tryon-pill:hover {
          background: #000000;
          color: #FFFFFF;
        }

        .mag-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .mag-card-cat {
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #78716C;
          font-weight: 500;
        }

        .mag-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0;
          line-height: 1.35;
          transition: color 0.2s;
        }

        .mag-card:hover .mag-card-title {
          color: #57534E;
        }

        .mag-card-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          margin-top: 0.2rem;
        }

        .mag-price-current {
          font-size: 0.92rem;
          font-weight: 600;
          color: #0A0A0A;
        }

        .mag-price-original {
          font-size: 0.85rem;
          color: #A8A29E;
          text-decoration: line-through;
        }

        .mag-card-swatches {
          display: flex;
          gap: 0.45rem;
          margin-top: 0.5rem;
        }

        .mag-swatch-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 1px solid rgba(0,0,0,0.15);
        }

        /* ── Minimalist Magazine Footer ── */
        .mag-footer {
          border-top: 1px solid #E7E5E4;
          background: #1C1917;
          color: #D6D3D1;
          padding: 6rem 3rem 3.5rem;
        }

        .mag-footer-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 4rem;
          margin-bottom: 5rem;
        }

        @media (max-width: 900px) {
          .mag-footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 600px) {
          .mag-footer-inner {
            grid-template-columns: 1fr;
          }
        }

        .mag-footer-col-title {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin-bottom: 1.5rem;
        }

        .mag-footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-size: 0.82rem;
          color: #A8A29E;
        }

        .mag-footer-links a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s;
        }

        .mag-footer-links a:hover {
          color: #FFFFFF;
        }

        .mag-footer-brand {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin-bottom: 1rem;
        }

        .mag-footer-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          font-style: italic;
          color: #A8A29E;
          line-height: 1.6;
          max-width: 380px;
          margin: 0 0 1.5rem 0;
        }
      `,
        }}
      />

      {/* ── 1. MINIMALIST WHISPER ANNOUNCEMENT ── */}
      {!isEmbedded && (
        <div className="mag-topbar">
          Complimentary Worldwide Courier On All Orders Over $150
        </div>
      )}

      {/* ── 2. MAGAZINE EDITORIAL HEADER ── */}
      <header className="mag-header">
        {/* Left: Refined Minimal Links */}
        <div className="mag-nav-left">
          <a href="#collection" className="mag-nav-link">Collection</a>
          <a href="#about" className="mag-nav-link">Editorial</a>
          <a href="#about" className="mag-nav-link">About Atelier</a>
        </div>

        {/* Center: Brand Editorial Wordmark */}
        <Link to={`/store/${handle}`} className="mag-brand-title">
          {store.store_name}
        </Link>

        {/* Right: Search & Shopping Bag */}
        <div className="mag-actions-right">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="mag-icon-btn"
            title="Search Collection"
          >
            <Search size={19} />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="mag-icon-btn"
            title="Shopping Bag"
          >
            <ShoppingBag size={19} />
            {cartItemCount > 0 && <span className="mag-cart-badge">{cartItemCount}</span>}
          </button>
        </div>
      </header>

      {/* ── SEARCH DRAWER ── */}
      {isSearchOpen && (
        <div className="mag-search-bar">
          <input
            type="text"
            className="mag-search-input"
            placeholder="Type to search garments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      )}

      {/* ── 3. HIGH-FASHION EDITORIAL HERO ── */}
      <section className="mag-hero">
        <img
          src={store.hero_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80'}
          alt={store.store_name}
          className="mag-hero-image"
        />
        <div className="mag-hero-overlay" />

        <div className="mag-hero-content">
          <span className="mag-hero-kicker">N° 26 · Autumn / Winter Editorial</span>
          <h1 className="mag-hero-headline">{store.store_name}</h1>
          <p className="mag-hero-tagline">
            {store.tagline || 'Modern Silhouettes & Timeless Proportions'}
          </p>
          <a href="#collection" className="mag-hero-btn">
            Discover Collection <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* ── 4. REFINED DISPATCH STRIP ── */}
      <div className="mag-dispatch-strip">
        <span>Architectural Silhouettes</span>
        <span>·</span>
        <span>European Textile Heritage</span>
        <span>·</span>
        <span>Bespoke Virtual Fitting</span>
      </div>

      {/* ── 5. MAIN EDITORIAL CATALOG ── */}
      <main id="collection" className="mag-catalog">
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', maxWidth: 600, margin: '0 auto' }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#F5F5F4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#1C1917'
            }}>
              <ShoppingBag size={24} />
            </div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', color: '#0A0A0A', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
              Collection In Preparation
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#78716C', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              {store?.store_name || 'This atelier'} has not published any garments to their storefront yet. Check back soon for the upcoming capsule drop.
            </p>
            <Link to="/shop" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 28px',
              background: '#0A0A0A',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              borderRadius: 0,
              transition: 'background 0.2s'
            }}>
              Explore VogueSocial Shop
            </Link>
          </div>
        ) : (
          <>
            {/* Category & Sorting Controls */}
            <div className="mag-catalog-header">
              <div className="mag-category-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`mag-category-tab ${activeCategory === cat ? 'mag-category-tab-active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mag-sort-select"
                >
                  <option value="featured">Sort · Featured</option>
                  <option value="price-low">Price · Low to High</option>
                  <option value="price-high">Price · High to Low</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#78716C' }}>
                <ShoppingBag size={32} style={{ margin: '0 auto 1rem', opacity: 0.35 }} />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#0A0A0A', marginBottom: 6 }}>
                  No Pieces in this Filter
                </h3>
                <p style={{ fontSize: '0.88rem' }}>Please select another category or clear your search term.</p>
              </div>
            ) : (
              <div className="mag-grid">
                {filteredProducts.map((product) => {
                  const img = product.image_url || product.imageUrl || '/placeholder-product.jpg';
                  const price = product.sale_price || product.salePrice || product.price;
                  const origPrice = (product.sale_price || product.salePrice) ? product.price : null;
                  const colors = product.colors && product.colors.length > 0 ? product.colors : ['Obsidian Black', 'Camel'];

                  return (
                    <div
                      key={product.id}
                      className="mag-card"
                      onClick={() => navigate(`/store/${handle}/product/${product.id}`)}
                    >
                      <div className="mag-image-wrap">
                        <img src={img} alt={product.name} className="mag-img" />

                        <button
                          className="mag-tryon-pill"
                          onClick={(e) => handleOpenTryOn(product, e)}
                        >
                          <Sparkles size={12} />
                          <span>Virtual Try-On</span>
                        </button>
                      </div>

                      <div className="mag-card-meta">
                        <span className="mag-card-cat">{product.category || 'Collection'}</span>
                        <h3 className="mag-card-title">{product.name}</h3>

                        <div className="mag-card-price-row">
                          <span className="mag-price-current">${price}</span>
                          {origPrice && <span className="mag-price-original">${origPrice}</span>}
                        </div>

                        <div className="mag-card-swatches">
                          {colors.slice(0, 4).map((c) => (
                            <div
                              key={c}
                              className="mag-swatch-dot"
                              style={{ backgroundColor: getColorHex(c) }}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── 6. MINIMALIST LUXURY FOOTER ── */}
      <footer id="about" className="mag-footer">
        <div className="mag-footer-inner">
          {/* Brand Philosophy */}
          <div>
            <div className="mag-footer-brand">{store.store_name}</div>
            <p className="mag-footer-desc">
              {store.description ||
                'Founded on modern tailoring, clean architectural silhouettes, and zero-latency in-browser AI fitting.'}
            </p>
            <div style={{ fontSize: '0.75rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={12} color="#10B981" />
              <span>TLS 1.3 Certified Anycast Network</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="mag-footer-col-title">Atelier</div>
            <div className="mag-footer-links">
              <a href="#collection">Collection Lookbook</a>
              <a href="#collection">Seasonal Archive</a>
              <a href="#about">Bespoke Fitting</a>
            </div>
          </div>

          {/* Client Care */}
          <div>
            <div className="mag-footer-col-title">Client Care</div>
            <div className="mag-footer-links">
              <span>{store.email || 'concierge@studiolabelparis.com'}</span>
              <span>Complimentary Courier</span>
              <span>30-Day Global Returns</span>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="mag-footer-col-title">Private Dispatch</div>
            <p style={{ fontSize: '0.8rem', color: '#A8A29E', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
              Subscribe to private invitations, lookbooks, and priority AI fittings.
            </p>
            {subscribed ? (
              <div style={{ padding: '0.65rem', background: 'rgba(16,185,129,0.12)', color: '#34D399', fontSize: '0.78rem' }}>
                ✓ Subscribed to Private Client List
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="email"
                  placeholder="Enter email..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    background: '#292524',
                    border: '1px solid #44403C',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => { if (emailInput) setSubscribed(true); }}
                  style={{
                    padding: '0.55rem 1.1rem',
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid #292524', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#78716C', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            &copy; {new Date().getFullYear()} {store.store_name}. Powered by <strong>VogueSocial Storefronts</strong>.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Worldwide Delivery</span>
          </div>
        </div>
      </footer>

      {/* ── 7. SLIDE-OVER LUXURY CART DRAWER ── */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(10, 10, 10, 0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              height: '100%',
              backgroundColor: '#FFFFFF',
              borderLeft: '1px solid #E7E5E4',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                borderBottom: '1px solid #E7E5E4',
              }}
            >
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                Shopping Bag ({cartItemCount})
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {cart.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#78716C' }}>
                  <ShoppingBag size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0A0A0A', marginBottom: 6 }}>
                    Your bag is empty
                  </div>
                  <div style={{ fontSize: '0.82rem' }}>
                    Discover the editorial collection and try on silhouettes with AI.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {cart.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F5F5F4' }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 75, height: 100, objectFit: 'cover', background: '#F5F5F4' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.98rem', fontWeight: 600, color: '#0A0A0A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#78716C', marginTop: 3 }}>
                          Color: {item.color} · Size: {item.size}
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0A0A0A', marginTop: 6 }}>
                          ${item.price}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E7E5E4' }}>
                            <button
                              onClick={() => handleUpdateQuantity(idx, -1)}
                              style={{ padding: '3px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#44403C' }}
                            >
                              <Minus size={11} />
                            </button>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 6px', minWidth: 20, textAlign: 'center' }}>
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(idx, 1)}
                              style={{ padding: '3px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#44403C' }}
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveCartItem(idx)}
                            style={{ background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer', padding: 2 }}
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #E7E5E4', background: '#FAFAF9' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    placeholder="Voucher code (try VOGUE20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '0.55rem 0.85rem', border: '1px solid #D6D3D1', fontSize: '0.8rem', outline: 'none', background: '#FFFFFF' }}
                  />
                  <button
                    onClick={() => {
                      if (promoCode === 'VOGUE20') setDiscountApplied(true);
                    }}
                    style={{ padding: '0.55rem 1rem', background: '#0A0A0A', color: '#FFFFFF', border: 'none', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}
                  >
                    Apply
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#78716C' }}>
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toLocaleString()}</span>
                  </div>

                  {discountApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 600 }}>
                      <span>VIP Promo (-20%)</span>
                      <span>-${(cartSubtotal * 0.2).toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#78716C' }}>
                    <span>Express Worldwide Delivery</span>
                    <span>{cartSubtotal >= 150 ? 'FREE' : '$15.00'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#0A0A0A', paddingTop: 8, borderTop: '1px solid #E7E5E4' }}>
                    <span>Total</span>
                    <span>${(finalTotal + (cartSubtotal >= 150 ? 0 : 15)).toLocaleString()}</span>
                  </div>
                </div>

                {checkoutSuccess ? (
                  <div style={{ padding: '0.85rem', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
                    ✓ Order Dispatched! Confirmation sent to your inbox.
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setCheckoutSuccess(true);
                      setTimeout(() => {
                        setCart({ items: [] });
                        setCheckoutSuccess(false);
                        setIsCartOpen(false);
                      }, 2500);
                    }}
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      background: '#0A0A0A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Lock size={14} />
                    <span>Proceed to Checkout</span>
                  </button>
                )}

                <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.7rem', color: '#A8A29E' }}>
                  🔒 256-Bit Encrypted Edge Checkout · Powered by VogueSocial
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 8. INTEGRATED VIRTUAL TRY-ON MODAL ── */}
      {isTryOnOpen && selectedTryOnProduct && (
        <TryOnModal
          isOpen={isTryOnOpen}
          onClose={() => setIsTryOnOpen(false)}
          product={selectedTryOnProduct}
        />
      )}
    </div>
  );
}
