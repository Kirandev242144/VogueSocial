"use client";
import React, { useState, useMemo } from 'react';
import {
  Search, ShoppingBag, Sparkles, ArrowRight
} from 'lucide-react';
import './StorefrontCanvas.css';

// Authentic luxury garments featured in VogueSocial feeds & virtual try-on lookbooks
const FEED_STORE_PRODUCTS = [
  {
    id: 'prod_sl_001',
    name: 'Structured Minimalist Atelier Suit',
    category: 'Outerwear',
    price: 680,
    sale_price: 590,
    image: '/Shop_images/1/basic2-500x750.jpeg',
    colors: ['#c19a6b', '#0a0a0a', '#ffffff']
  },
  {
    id: 'prod_sl_004',
    name: 'Classic Ribbed Knit Black Mini Dress',
    category: 'Dresses',
    price: 185,
    sale_price: 145,
    image: '/Shop_images/3/dressblack1-1-500x750.jpeg',
    colors: ['#0a0a0a', '#9ca3af', '#f7e7ce']
  },
  {
    id: 'prod_sl_002',
    name: 'Knotted Asymmetric Drape Blouse',
    category: 'Tops',
    price: 420,
    sale_price: null,
    image: '/Shop_images/5/knotted1-500x750.jpeg',
    colors: ['#e6d7b9', '#0a0a0a', '#800020']
  },
  {
    id: 'prod_sl_003',
    name: 'Structured Wool Atelier Overshirt',
    category: 'Outerwear',
    price: 540,
    sale_price: 470,
    image: '/Shop_images/8/overshirt1-500x750.jpg',
    colors: ['#a16207', '#374151', '#0a0a0a']
  },
  {
    id: 'prod_sl_005',
    name: 'Wide-Leg Sartorial Atelier Trousers',
    category: 'Bottoms',
    price: 380,
    sale_price: 320,
    image: '/Shop_images/13/wideleg1-500x750.jpg',
    colors: ['#556b2f', '#0a0a0a', '#9ca3af']
  },
  {
    id: 'prod_sl_008',
    name: 'Scarlet Silk Flounce Gala Gown',
    category: 'Dresses',
    price: 680,
    sale_price: 595,
    image: '/Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg',
    colors: ['#e11d48', '#800020']
  },
  {
    id: 'prod_sl_006',
    name: 'Pointed Toe Atelier Ankle Boots',
    category: 'Footwear',
    price: 490,
    sale_price: 420,
    image: '/Shop_images/1/basic4-500x750.jpeg',
    colors: ['#0a0a0a', '#a16207']
  },
  {
    id: 'prod_sl_007',
    name: 'Vibrant Summer Silk Floral Gown',
    category: 'Dresses',
    price: 340,
    sale_price: 290,
    image: '/Shop_images/greendress.jpg',
    colors: ['#047857', '#d97706']
  }
];

function getSwatchDotClass(c) {
  if (!c) return 'swatch-dot-charcoal';
  const clean = c.toLowerCase().trim();
  if (clean.includes('black') || clean === '#0a0a0a' || clean === '#000000' || clean === '#0f172a') return 'swatch-dot-black';
  if (clean.includes('white') || clean === '#ffffff') return 'swatch-dot-white';
  if (clean.includes('camel') || clean === '#c19a6b') return 'swatch-dot-camel';
  if (clean.includes('grey') || clean.includes('gray') || clean === '#9ca3af') return 'swatch-dot-grey';
  if (clean.includes('champagne') || clean === '#f7e7ce') return 'swatch-dot-champagne';
  if (clean.includes('oatmeal') || clean.includes('dune') || clean === '#e6d7b9') return 'swatch-dot-oatmeal';
  if (clean.includes('ochre') || clean.includes('tan') || clean === '#a16207') return 'swatch-dot-ochre';
  if (clean.includes('olive') || clean === '#556b2f') return 'swatch-dot-olive';
  if (clean.includes('rose') || clean.includes('scarlet') || clean === '#e11d48') return 'swatch-dot-scarlet';
  if (clean.includes('burgundy') || clean.includes('crimson') || clean === '#800020') return 'swatch-dot-crimson';
  if (clean.includes('emerald') || clean.includes('green') || clean === '#047857') return 'swatch-dot-emerald';
  if (clean.includes('amber') || clean.includes('floral') || clean === '#d97706') return 'swatch-dot-amber';
  if (clean.includes('indigo') || clean.includes('blue') || clean === '#2563eb') return 'swatch-dot-indigo';
  return 'swatch-dot-charcoal';
}

function getFontClass(pairing) {
  if (pairing === 'cormorant-jost') return 'canvas-font-cormorant';
  if (pairing === 'jakarta-inter') return 'canvas-font-jakarta';
  if (pairing === 'barlow-grotesk') return 'canvas-font-barlow';
  return 'canvas-font-playfair';
}

function getRadiusClass(radius) {
  if (radius === 'sharp') return 'canvas-radius-sharp';
  if (radius === 'rounded') return 'canvas-radius-rounded';
  if (radius === 'pill') return 'canvas-radius-pill';
  return 'canvas-radius-soft';
}

function getAccentClass(accent) {
  if (!accent) return 'canvas-accent-indigo';
  const a = accent.toLowerCase();
  if (a === '#0f172a' || a.includes('slate')) return 'canvas-accent-slate';
  if (a === '#c9a84c' || a.includes('gold')) return 'canvas-accent-gold';
  if (a === '#059669' || a.includes('forest')) return 'canvas-accent-forest';
  if (a === '#d97706' || a.includes('amber')) return 'canvas-accent-amber';
  if (a === '#e11d48' || a.includes('rose')) return 'canvas-accent-rose';
  return 'canvas-accent-indigo';
}

function getOverlayClass(opacity) {
  if (opacity <= 0.15) return 'canvas-overlay-10';
  if (opacity <= 0.25) return 'canvas-overlay-20';
  if (opacity <= 0.35) return 'canvas-overlay-30';
  if (opacity <= 0.55) return 'canvas-overlay-45';
  if (opacity <= 0.65) return 'canvas-overlay-60';
  return 'canvas-overlay-75';
}

function getAnnouncementBgClass(bg) {
  if (!bg) return 'canvas-announcement-dark';
  const b = bg.toLowerCase();
  if (b.includes('1e3a8a') || b.includes('blue')) return 'canvas-announcement-indigo';
  if (b.includes('0a0a0a') || b.includes('000000')) return 'canvas-announcement-black';
  if (b.includes('854d0e') || b.includes('gold')) return 'canvas-announcement-gold';
  if (b.includes('9f1239') || b.includes('rose')) return 'canvas-announcement-rose';
  if (b.includes('064e3b') || b.includes('forest')) return 'canvas-announcement-forest';
  return 'canvas-announcement-dark';
}

export default function StorefrontLiveCanvas({
  editorState,
  viewport,
  products = []
}) {
  const [activeCat, setActiveCat] = useState('All');
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Normalize products catalog: prioritize live store products if provided, else use authentic feed garments
  const normalizedProducts = useMemo(() => {
    if (products && products.length > 0) {
      return products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category || 'Collection',
        price: p.salePrice || p.sale_price || p.price,
        originalPrice: (p.salePrice || p.sale_price) ? p.price : null,
        image: p.imageUrl || p.image_url || p.image || '/Shop_images/1/basic2-500x750.jpeg',
        colors: (p.colors && p.colors.length > 0 ? p.colors : ['#0a0a0a', '#c19a6b'])
      }));
    }
    return FEED_STORE_PRODUCTS.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.sale_price || p.price,
      originalPrice: p.sale_price ? p.price : null,
      image: p.image,
      colors: p.colors
    }));
  }, [products]);

  // Dynamic Category Pills
  const categories = useMemo(() => {
    const cats = new Set();
    normalizedProducts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return ['All', ...Array.from(cats)];
  }, [normalizedProducts]);

  const displayedProducts = useMemo(() => {
    if (activeCat === 'All') return normalizedProducts;
    return normalizedProducts.filter(p => p.category === activeCat);
  }, [normalizedProducts, activeCat]);

  // Viewport Class
  let viewportClass = 'canvas-viewport-desktop';
  if (viewport === 'tablet') viewportClass = 'canvas-viewport-tablet';
  if (viewport === 'mobile') viewportClass = 'canvas-viewport-mobile';

  const isMobile = viewport === 'mobile';
  const fontClass = getFontClass(editorState.font_pairing);
  const radiusClass = getRadiusClass(editorState.border_radius);
  const accentClass = getAccentClass(editorState.accent_color);
  const overlayClass = getOverlayClass(editorState.hero_overlay_opacity ?? 0.45);
  const announcementBgClass = getAnnouncementBgClass(editorState.announcement_bg);

  return (
    <div className="editor-canvas-wrap">
      <div
        className={`editor-canvas-container ${viewportClass} ${fontClass} ${radiusClass} ${accentClass} ${overlayClass}`}
        data-template={editorState.template || 'modern'}
      >
        {isMobile && <div className="canvas-mobile-notch" />}

        <div className="canvas-store-wrap">
          {/* ── 1. ANNOUNCEMENT BAR ── */}
          {editorState.announcement_enabled && (
            <div className={`canvas-announcement-bar ${announcementBgClass}`}>
              <span>{editorState.announcement_text || 'COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING OVER $200'}</span>
            </div>
          )}

          {/* ── 2. MAGAZINE EDITORIAL HEADER ── */}
          <header className={`canvas-header ${isMobile ? 'canvas-header-mobile' : ''} ${editorState.header_layout === 'left' ? 'canvas-header-left' : ''}`}>
            {/* Left Nav (Dynamic Navigation Menu) */}
            {!isMobile && (
              <div className="canvas-nav-left">
                {(editorState.nav_menu && editorState.nav_menu.length > 0 ? editorState.nav_menu : [
                  { id: '1', label: 'Collection', url: '#collection' },
                  { id: '2', label: 'Editorial', url: '#about' },
                  { id: '3', label: 'About Atelier', url: '#about' }
                ]).map((item) => (
                  <span
                    key={item.id || item.label}
                    className="canvas-nav-item"
                    title={item.url}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            )}

            {/* Center Brand Title / Logo */}
            <div className="canvas-brand-wrap">
              {editorState.logo_url ? (
                <img src={editorState.logo_url} alt="" className="canvas-brand-logo" />
              ) : (
                <h1 className={`canvas-brand-title ${isMobile ? 'canvas-brand-title-mobile' : ''}`}>
                  {editorState.store_name}
                </h1>
              )}
            </div>

            {/* Right Quick Header Actions */}
            <div className="canvas-header-actions">
              <button type="button" className="canvas-icon-btn" title="Search catalog">
                <Search size={18} />
              </button>
              <button type="button" className="canvas-icon-btn" title="Shopping Bag (2 items)">
                <ShoppingBag size={18} />
                <span className="canvas-cart-badge">2</span>
              </button>
            </div>
          </header>

          {/* ── 3. HIGH-FASHION HERO BANNER ── */}
          <section className={`canvas-hero ${isMobile ? 'canvas-hero-mobile' : ''}`}>
            <img
              src={editorState.hero_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80'}
              alt=""
              className="canvas-hero-img"
            />
            <div className="canvas-hero-overlay" />

            <div className="canvas-hero-content">
              <span className="canvas-hero-kicker">
                {editorState.hero_kicker || 'N° 26 · AUTUMN / WINTER EDITORIAL'}
              </span>

              <h2 className={`canvas-hero-headline ${isMobile ? 'canvas-hero-headline-mobile' : ''}`}>
                {editorState.hero_headline || editorState.store_name}
              </h2>

              <p className={`canvas-hero-tagline ${isMobile ? 'canvas-hero-tagline-mobile' : ''}`}>
                {editorState.hero_tagline || editorState.tagline}
              </p>

              <button type="button" className="canvas-hero-btn">
                <span>{editorState.hero_btn_text || 'DISCOVER COLLECTION'}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </section>

          {/* ── 4. REFINED DISPATCH STRIP ── */}
          <div className={`canvas-dispatch-strip ${isMobile ? 'canvas-dispatch-strip-mobile' : ''}`}>
            <span>Instant Virtual Try-On Enabled</span>
            <span>•</span>
            <span>Bespoke Couture Craftsmanship</span>
            <span>•</span>
            <span>Complimentary Global Shipping</span>
          </div>

          {/* ── 5. MAIN CATALOG LOOKBOOK GRID ── */}
          <section className={`canvas-catalog-section ${isMobile ? 'canvas-catalog-section-mobile' : ''}`} id="collection">
            <div className="canvas-catalog-header">
              {editorState.show_category_tabs !== false && (
                <div className="canvas-category-tabs">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`canvas-category-btn ${activeCat === cat ? 'canvas-category-btn-active' : ''}`}
                      onClick={() => setActiveCat(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              <div className="canvas-sort-indicator">
                Showing {displayedProducts.length} Atelier Silhouettes
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className={`canvas-product-grid ${isMobile ? 'canvas-product-grid-mobile' : `canvas-product-grid-cols-${editorState.catalog_columns || 4}`}`}>
              {displayedProducts.map((p) => (
                <div
                  key={p.id}
                  className="canvas-product-card"
                  onMouseEnter={() => setHoveredCardId(p.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                >
                  <div className="canvas-product-img-wrap">
                    <img src={p.image} alt={p.name} className="canvas-product-img" />
                    {editorState.show_quick_tryon_btn !== false && (
                      <button type="button" className="canvas-tryon-pill">
                        <Sparkles size={11} />
                        <span>Virtual Try-On</span>
                      </button>
                    )}
                  </div>

                  <div className="canvas-product-info">
                    <span className="canvas-product-cat">{p.category}</span>
                    <h3 className="canvas-product-name">{p.name}</h3>
                    <div className="canvas-product-price-row">
                      <span className="canvas-price-current">${p.price}</span>
                      {p.originalPrice && (
                        <span className="canvas-price-original">${p.originalPrice}</span>
                      )}
                    </div>

                    {editorState.show_color_swatches !== false && p.colors && p.colors.length > 0 && (
                      <div className="canvas-swatches-row">
                        {p.colors.map((c, i) => (
                          <span
                            key={i}
                            className={`canvas-swatch-dot ${getSwatchDotClass(c)}`}
                            title={c}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 6. BRAND STORY & HERITAGE ── */}
          {editorState.story_enabled && (
            <section className={`canvas-story-section ${isMobile ? 'canvas-story-section-mobile' : ''}`} id="about">
              <div className={`canvas-story-inner ${isMobile ? 'canvas-story-inner-mobile' : ''}`}>
                <div>
                  <span className="canvas-story-kicker">
                    {editorState.story_kicker || 'ATELIER HERITAGE'}
                  </span>
                  <h3 className={`canvas-story-title ${isMobile ? 'canvas-story-title-mobile' : ''}`}>
                    {editorState.story_title || 'Architectural Silhouettes & Sustainable Craft'}
                  </h3>
                  <p className="canvas-story-desc">
                    {editorState.description || 'Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Every garment in our collection is precision-crafted from sustainably sourced European textiles.'}
                  </p>

                  <div className="canvas-story-quote-box">
                    <p className="canvas-story-quote">
                      "{editorState.story_quote || 'Where haute couture precision meets browser-native neural fitting.'}"
                    </p>
                    <span className="canvas-story-author">
                      — Atelier Master Tailor, Paris
                    </span>
                  </div>
                </div>

                <div className="canvas-story-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&q=80"
                    alt="Atelier Craftsman"
                    className="canvas-story-img"
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── 7. VIP NEWSLETTER SECTION ── */}
          {editorState.newsletter_enabled && (
            <section className={`canvas-newsletter-section ${isMobile ? 'canvas-newsletter-section-mobile' : ''}`} id="newsletter">
              <div className="canvas-newsletter-box">
                <h4 className={`canvas-newsletter-title ${isMobile ? 'canvas-newsletter-title-mobile' : ''}`}>
                  {editorState.newsletter_title || 'JOIN THE ATELIER CIRCLE'}
                </h4>
                <p className="canvas-newsletter-subtitle">
                  {editorState.newsletter_subtitle || 'Receive seasonal capsule previews and private fitting trunk shows.'}
                </p>
                <form className="canvas-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    className="canvas-newsletter-input"
                  />
                  <button type="submit" className="canvas-newsletter-btn">
                    Join Circle
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* ── 8. MAGAZINE EDITORIAL FOOTER ── */}
          <footer className={`canvas-footer ${isMobile ? 'canvas-footer-mobile' : ''}`} id="footer">
            <div className={`canvas-footer-inner ${isMobile ? 'canvas-footer-inner-mobile' : ''}`}>
              <div>
                <h4 className="canvas-footer-brand">{editorState.store_name}</h4>
                <p className="canvas-footer-desc">
                  {editorState.tagline || 'Modern Tailoring & AI Virtual Fitting Studio'}
                </p>
                <div className="canvas-footer-links">
                  <span>{editorState.email || 'concierge@studiolabelparis.com'}</span>
                  <span>{editorState.phone || '+33 1 42 68 55 00'}</span>
                </div>
              </div>

              <div>
                <div className="canvas-footer-col-title">Capsules</div>
                <div className="canvas-footer-links">
                  <a href="#collection" className="canvas-footer-link">Autumn / Winter</a>
                  <a href="#collection" className="canvas-footer-link">Sartorial Suiting</a>
                  <a href="#collection" className="canvas-footer-link">Neural Try-On</a>
                </div>
              </div>

              <div>
                <div className="canvas-footer-col-title">Atelier</div>
                <div className="canvas-footer-links">
                  <a href="#about" className="canvas-footer-link">Our Heritage</a>
                  <a href="#about" className="canvas-footer-link">Sustainability</a>
                  <a href="#footer" className="canvas-footer-link">Client Services</a>
                </div>
              </div>

              <div>
                <div className="canvas-footer-col-title">Concierge</div>
                <div className="canvas-footer-links">
                  <span>Bespoke Fitting Consultations</span>
                  <span>Worldwide Express Air Delivery</span>
                  <span>Complimentary Exchanges</span>
                </div>
              </div>
            </div>

            <div className="canvas-footer-bottom">
              <div>
                © {new Date().getFullYear()} {editorState.store_name}. Powered by VogueSocial Studio.
              </div>
              <div className="canvas-footer-legal">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Security</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
