"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import styles from './store.module.css';
const TEMPLATES = {
    minimal: `--bg: #FFFFFF; --bg2: #F9F7F4; --surface: #FFFFFF; --border: #E8E4DE; --text1: #1A1A1A; --text2: #4A4A4A; --text3: #8A8A8A; --accent: #1A1A1A; --accent-text: #FFFFFF; --btn-radius: 0px; --card-radius: 0px; --font-heading: 'Cormorant Garamond', serif; --font-body: 'Jost', sans-serif;`,
    luxury: `--bg: #1C1C1E; --bg2: #242426; --surface: #2A2A2C; --border: #3A3A3C; --text1: #C9A84C; --text2: #E8E8E8; --text3: #888888; --accent: #C9A84C; --accent-text: #1C1C1E; --btn-radius: 0px; --card-radius: 4px; --font-heading: 'Playfair Display', serif; --font-body: 'Montserrat', sans-serif;`,
    streetwear: `--bg: #0A0A0A; --bg2: #111111; --surface: #1A1A1A; --border: #2A2A2A; --text1: #FFFFFF; --text2: #CCCCCC; --text3: #666666; --accent: #CCFF00; --accent-text: #0A0A0A; --btn-radius: 0px; --card-radius: 0px; --font-heading: 'Barlow Condensed', sans-serif; --font-body: 'Barlow', sans-serif;`,
    modern: `--bg: #F8F9FF; --bg2: #FFFFFF; --surface: #FFFFFF; --border: #E8EAFF; --text1: #1E1B4B; --text2: #3730A3; --text3: #6366F1; --accent: #4F46E5; --accent-text: #FFFFFF; --btn-radius: 10px; --card-radius: 16px; --font-heading: 'Plus Jakarta Sans', sans-serif; --font-body: 'Inter', sans-serif;`,
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
    if (cleanHex.length !== 6)
        return null;
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return { r, g, b };
}
export default function StorefrontPage() {
    const params = useParams();
    const handle = params.handle || '';
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
        if (!handle)
            return;
        async function fetchStoreData() {
            try {
                setLoading(true);
                const res = await fetch(`/api/store/${handle}`);
                if (!res.ok) {
                    setError(true);
                    return;
                }
                const data = await res.json();
                if (data.success && data.store) {
                    setStore(data.store);
                    setProducts(data.products || []);
                }
                else {
                    setError(true);
                }
            }
            catch (err) {
                console.error('Failed to fetch store data', err);
                setError(true);
            }
            finally {
                setLoading(false);
            }
        }
        fetchStoreData();
        try {
            const storedCart = localStorage.getItem(`vogue_cart_${handle}`);
            if (storedCart) {
                const parsed = JSON.parse(storedCart);
                if (parsed.items && Array.isArray(parsed.items)) {
                    const totalQty = parsed.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                    setCartCount(totalQty);
                }
            }
        }
        catch (e) {
            console.error('Failed to parse cart', e);
        }
    }, [handle]);
    const categories = useMemo(() => {
        const cats = new Set();
        products.forEach((p) => {
            if (p.category)
                cats.add(p.category);
        });
        return ['All', ...Array.from(cats)];
    }, [products]);
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            const matchesSearch = !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, activeCategory, searchQuery]);
    if (loading) {
        return (<div className={styles.loadingContainer}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner}/>
          <p className={styles.loadingText}>Loading storefront...</p>
        </div>
      </div>);
    }
    if (error || !store) {
        return (<div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundTitle}>Store Not Found</h1>
        <p className={styles.notFoundText}>The store you are looking for does not exist or has been removed.</p>
        <Link to="/" className={styles.notFoundBtn}>
          Return to VogueSocial
        </Link>
      </div>);
    }
    const templateName = store.template || 'minimal';
    let cssVars = TEMPLATES[templateName] || TEMPLATES.minimal;
    if (store.accent_color) {
        const rgb = hexToRgb(store.accent_color);
        let accentText = '#FFFFFF';
        if (rgb) {
            const lum = getLuminance(rgb.r, rgb.g, rgb.b);
            if (lum > 0.5)
                accentText = '#000000';
        }
        cssVars += ` --accent: ${store.accent_color}; --accent-text: ${accentText};`;
    }
    return (<div style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text2)',
            fontFamily: 'var(--font-body)',
            minHeight: '100vh',
            transition: 'colors 0.3s ease'
        }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Jost:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600&family=Nunito:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        :root {
          ${cssVars}
        }

        /* Utility resets & layout */
        .store-header {
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .store-logo-fallback {
          height: 40px;
          width: 40px;
          background: var(--accent);
          color: var(--accent-text);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
          border-radius: var(--btn-radius);
        }
        
        .store-heading {
          font-family: var(--font-heading);
          color: var(--text1);
        }

        .header-nav {
          display: flex;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .header-nav { display: none; }
        }

        .header-nav a {
          text-decoration: none;
          color: var(--text2);
          font-weight: 500;
          font-size: 0.95rem;
          transition: color 0.2s;
        }

        .header-nav a:hover {
          color: var(--text1);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .action-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text2);
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          position: relative;
        }

        .action-icon-btn:hover {
          color: var(--text1);
        }

        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--accent-text);
          font-size: 0.65rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Search Bar */
        .search-drawer {
          padding: 1.25rem 2rem;
          border-bottom: 1px solid var(--border);
          background: var(--bg2);
          animation: slideDown 0.25s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .search-drawer input {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          display: block;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--btn-radius);
          padding: 0.75rem 1.25rem;
          color: var(--text1);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-drawer input:focus {
          border-color: var(--accent);
        }

        /* Hero */
        .hero-banner {
          position: relative;
          height: 55vh;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--bg2);
        }

        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.35);
        }

        .hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 720px;
          padding: 0 1.5rem;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2.5rem; }
        }

        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .store-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--accent);
          color: var(--accent-text);
          border-radius: var(--btn-radius);
          padding: 0.9rem 2.25rem;
          font-weight: 700;
          text-decoration: none;
          font-size: 1rem;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .store-btn:hover {
          opacity: 0.92;
          transform: translateY(-2px);
        }

        /* Main Store Body */
        .catalog-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .category-scroll {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.85rem;
          margin-bottom: 3rem;
          scrollbar-width: none; /* Firefox */
        }
        .category-scroll::-webkit-scrollbar { display: none; } /* Chrome/Safari */

        .category-pill {
          white-space: nowrap;
          padding: 0.55rem 1.25rem;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text2);
          border-radius: var(--btn-radius);
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .category-pill:hover {
          border-color: var(--text1);
        }

        .category-pill-active {
          background: var(--accent);
          color: var(--accent-text);
          border-color: var(--accent);
        }

        /* Product Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem 1.5rem;
        }

        @media (max-width: 992px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem 1rem; }
        }

        .product-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
        }

        .product-image-wrap {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--card-radius);
          margin-bottom: 1rem;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .product-card:hover .product-img {
          transform: scale(1.04);
        }

        .sale-tag {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: var(--accent);
          color: var(--accent-text);
          font-size: 0.68rem;
          font-weight: 900;
          padding: 0.25rem 0.5rem;
          border-radius: var(--btn-radius);
          letter-spacing: 0.05em;
          z-index: 10;
        }

        .quick-view-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 10;
        }

        .product-card:hover .quick-view-overlay {
          opacity: 1;
        }

        .quick-view-btn {
          background: var(--surface);
          color: var(--text1);
          border: none;
          padding: 0.6rem 1.25rem;
          font-size: 0.84rem;
          font-weight: 700;
          border-radius: var(--btn-radius);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .quick-view-btn:hover {
          transform: scale(1.05);
        }

        .product-cat {
          font-size: 0.72rem;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.25rem;
        }

        .product-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.3;
          color: var(--text1);
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }

        .product-card:hover .product-title {
          color: var(--accent);
        }

        .product-price-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-current {
          font-weight: 700;
          color: var(--text1);
        }

        .price-current-sale {
          color: var(--accent);
          font-weight: 800;
        }

        .price-strike {
          text-decoration: line-through;
          color: var(--text3);
          font-size: 0.88rem;
        }

        .color-palette-dots {
          display: flex;
          gap: 0.35rem;
          margin-top: 0.65rem;
        }

        .color-dot-node {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid var(--border);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
        }

        /* Empty State */
        .empty-grid-state {
          text-align: center;
          padding: 5rem 2rem;
        }

        /* About & Info */
        .about-block {
          background: var(--bg2);
          padding: 6rem 2rem;
          border-top: 1px solid var(--border);
        }

        .about-inner {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }

        .about-inner h2 {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: var(--text1);
        }

        .about-inner p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text2);
          margin-bottom: 3rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          text-align: left;
          border-top: 1px solid var(--border);
          padding-top: 3rem;
        }

        @media (max-width: 768px) {
          .info-grid { grid-template-columns: 1fr; gap: 2rem; }
        }

        .info-grid h4 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text1);
          margin-bottom: 0.5rem;
        }

        .info-grid p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text3);
          margin: 0;
        }

        /* Footer */
        .footer-block {
          background: var(--bg);
          border-top: 1px solid var(--border);
          padding: 4rem 2rem 2rem;
        }

        .footer-main {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 4rem;
        }

        @media (max-width: 768px) {
          .footer-main { flex-direction: column; text-align: center; align-items: center; }
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-links a {
          text-decoration: none;
          color: var(--text2);
          font-weight: 600;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: var(--accent);
        }

        .footer-copyright {
          max-width: 1200px;
          margin: 0 auto;
          border-top: 1px solid var(--border);
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.78rem;
          color: var(--text3);
        }

        @media (max-width: 768px) {
          .footer-copyright { flex-direction: column; gap: 1rem; }
        }
      ` }}/>

      {/* Header */}
      <header className="store-header">
        <Link to={`/store/${handle}`} className="header-logo-container">
          {store.logo_url ? (<img src={store.logo_url} alt={store.store_name} className={styles.storeLogoImg}/>) : (<div className="store-logo-fallback">
              {store.store_name?.charAt(0).toUpperCase() || 'S'}
            </div>)}
          <span className={`store-heading ${styles.storeNameText}`}>{store.store_name}</span>
        </Link>
        
        <nav className="header-nav">
          <a href="#shop">Shop</a>
          <a href="#about">About</a>
          <a href="#about">Contact</a>
        </nav>
        
        <div className="header-actions">
          <button onClick={() => setShowSearch(!showSearch)} className="action-icon-btn" title="Search catalog">
            <Search size={19}/>
          </button>
          <div className="action-icon-btn" title="Shopping Cart">
            <ShoppingBag size={19}/>
            {cartItemCount > 0 && (<span className="cart-badge">{cartItemCount}</span>)}
          </div>
        </div>
      </header>

      {/* Search Bar Drawer */}
      {showSearch && (<div className="search-drawer">
          <input type="text" placeholder="Search our catalog..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        </div>)}

      {/* Hero Banner */}
      <section className="hero-banner">
        {store.hero_image ? (<>
            <img src={store.hero_image} alt="Hero Banner" className="hero-image"/>
            <div className="hero-overlay"></div>
          </>) : (<div className={styles.heroOverlay}/>)}
        
        <div className="hero-content">
          <h1 className="store-heading">
            {store.store_name}
          </h1>
          <p>
            {store.tagline || 'Welcome to our premium storefront.'}
          </p>
          <a href="#shop" className="store-btn">
            Shop Collection <ArrowRight size={18}/>
          </a>
        </div>
      </section>

      {/* Main Catalog */}
      <main id="shop" className="catalog-container">
        
        {/* Categories Bar */}
        {categories.length > 1 && (<div className="category-scroll">
            {categories.map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`category-pill ${activeCategory === cat ? 'category-pill-active' : ''}`}>
                {cat}
              </button>))}
          </div>)}

        {/* Product Grid Listings */}
        {filteredProducts.length === 0 ? (<div className={styles.emptyStateBox}>
            <ShoppingBag className={styles.emptyIcon}/>
            <h3 className={`store-heading ${styles.emptyTitle}`}>No items found</h3>
            <p className={styles.emptyText}>
              {products.length === 0 ? 'Store catalog is empty. Check back soon!' : 'Try checking a different category or search term.'}
            </p>
          </div>) : (<div className="products-grid">
            {filteredProducts.map(product => (<div key={product.id} className="product-card" onClick={() => navigate(`/store/${handle}/product/${product.id}`)}>
                <div className="product-image-wrap">
                  <img src={product.image_url || '/placeholder-product.jpg'} alt={product.name} className="product-img"/>
                  
                  {product.sale_price && (<div className="sale-tag">SALE</div>)}

                  <div className="quick-view-overlay">
                    <button className="quick-view-btn">Quick View</button>
                  </div>
                </div>
                
                <div>
                  <div className="product-cat">{product.category}</div>
                  <h3 className="product-title store-heading">
                    {product.name}
                  </h3>
                  
                  <div className="product-price-row">
                    {product.sale_price ? (<>
                        <span className="price-current-sale">${product.sale_price}</span>
                        <span className="price-strike">${product.price}</span>
                      </>) : (<span className="price-current">${product.price}</span>)}
                  </div>
                  
                  {product.colors && product.colors.length > 0 && (<div className="color-palette-dots">
                      {product.colors.slice(0, 4).map((color, i) => (<div key={i} className="color-dot-node" title={color}/>))}
                      {product.colors.length > 4 && <span className={styles.colorMoreCount}>+{product.colors.length - 4}</span>}
                    </div>)}
                </div>
              </div>))}
          </div>)}
      </main>

      {/* About Section */}
      <section id="about" className="about-block">
        <div className="about-inner">
          <h2 className="store-heading">About {store.store_name}</h2>
          <p>
            {store.description || 'Welcome to our store. We provide unique high-quality pieces designed to fit your unique lifestyle. Curated with care, shipped with speed.'}
          </p>
          
          <div className="info-grid">
            <div>
              <h4>Store Support</h4>
              <p>{store.email || 'support@voguesocial.com'}</p>
            </div>
            <div>
              <h4>Shipping & Returns</h4>
              <p>Enjoy free standard shipping on orders over $100. Easy 30-day hassle-free returns on all unworn items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-block">
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} {store.store_name}. All rights reserved.</p>
          <p className={styles.poweredRow}>
            Powered by <span className={styles.poweredBrand}>VogueSocial</span>
          </p>
        </div>
      </footer>
    </div>);
}
