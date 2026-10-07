"use client";
import React, { useState, useMemo } from 'react';
import {
  Search, ShoppingBag, Sparkles, ArrowRight, Lock, Check
} from 'lucide-react';

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

const COLOR_HEX_MAP = {
  'obsidian black': '#0a0a0a',
  'black': '#0a0a0a',
  'jet black': '#0f172a',
  'camel': '#c19a6b',
  'camel beige': '#c19a6b',
  'stone grey': '#9ca3af',
  'grey': '#9ca3af',
  'cream white': '#f5f5dc',
  'white': '#ffffff',
  'champagne': '#f7e7ce',
  'oatmeal': '#e6d7b9',
  'oatmeal dune': '#e6d7b9',
  'ochre tan': '#a16207',
  'charcoal grey': '#374151',
  'olive drab': '#556b2f',
  'scarlet red': '#e11d48',
  'crimson ruby': '#800020',
  'emerald palm': '#047857',
  'vintage cognac': '#a16207',
  'burgundy': '#800020',
  'pinstripe noir': '#1e293b',
  'midnight noir': '#0f172a',
  'taupe': '#8b7d7b',
  'summer floral': '#d97706'
};

function resolveColorHex(c) {
  if (!c) return '#334155';
  if (c.startsWith('#')) return c;
  const key = c.toLowerCase().trim();
  return COLOR_HEX_MAP[key] || '#475569';
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
        colors: (p.colors && p.colors.length > 0 ? p.colors : ['#0a0a0a', '#c19a6b']).map(resolveColorHex)
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

  // Font family determination
  let fontHeading = "'Playfair Display', serif";
  let fontBody = "'Inter', sans-serif";
  if (editorState.font_pairing === 'cormorant-jost') {
    fontHeading = "'Cormorant Garamond', serif";
    fontBody = "'Jost', sans-serif";
  } else if (editorState.font_pairing === 'jakarta-inter') {
    fontHeading = "'Plus Jakarta Sans', sans-serif";
    fontBody = "'Inter', sans-serif";
  } else if (editorState.font_pairing === 'barlow-grotesk') {
    fontHeading = "'Barlow Condensed', sans-serif";
    fontBody = "'Space Grotesk', sans-serif";
  }

  // Border radius determination
  let btnRadius = '0px';
  if (editorState.border_radius === 'rounded') btnRadius = '8px';
  if (editorState.border_radius === 'pill') btnRadius = '99px';
  if (editorState.border_radius === 'soft') btnRadius = '4px';

  const accentColor = editorState.accent_color || '#2563eb';

  // Responsive class based on viewport
  let viewportClass = 'canvas-viewport-desktop';
  if (viewport === 'tablet') viewportClass = 'canvas-viewport-tablet';
  if (viewport === 'mobile') viewportClass = 'canvas-viewport-mobile';

  return (
    <div className="editor-canvas-wrap">
      <div
        className={`editor-canvas-container ${viewportClass}`}
        style={{
          fontFamily: fontBody,
          color: '#1C1917',
          backgroundColor: '#FAFAF9'
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

            .editor-live-card {
              display: flex;
              flex-direction: column;
              cursor: pointer;
              position: relative;
            }
            .editor-live-image-wrap {
              position: relative;
              aspect-ratio: 3/4;
              width: 100%;
              background: #F5F5F4;
              overflow: hidden;
              margin-bottom: 0.95rem;
            }
            .editor-live-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .editor-live-card:hover .editor-live-img {
              transform: scale(1.04);
            }
            .editor-live-tryon-pill {
              position: absolute;
              bottom: 12px;
              left: 50%;
              transform: translateX(-50%) translateY(8px);
              opacity: 0;
              background: rgba(10, 10, 10, 0.92);
              backdrop-filter: blur(8px);
              color: #FFFFFF;
              border: none;
              padding: 0.5rem 1.1rem;
              font-size: 0.68rem;
              font-weight: 700;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              display: flex;
              align-items: center;
              gap: 0.45rem;
              box-shadow: 0 8px 20px rgba(0,0,0,0.25);
              transition: all 0.22s ease;
              white-space: nowrap;
              z-index: 5;
            }
            .editor-live-card:hover .editor-live-tryon-pill {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          `
          }}
        />

        {viewport === 'mobile' && <div className="canvas-mobile-notch" />}

        {/* ── 1. ANNOUNCEMENT BAR ── */}
        {editorState.announcement_enabled && (
          <div
            style={{
              background: editorState.announcement_bg || '#111827',
              color: '#F3F4F6',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textAlign: 'center',
              padding: '0.5rem 1rem'
            }}
          >
            <span>{editorState.announcement_text || 'COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING OVER $200'}</span>
          </div>
        )}

        {/* ── 2. MAGAZINE EDITORIAL HEADER ── */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 35,
            background: 'rgba(250, 250, 249, 0.98)',
            borderBottom: '1px solid #E7E5E4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: viewport === 'mobile' ? '0.85rem 1.25rem' : '1.15rem 2.5rem'
          }}
        >
          {/* Left Nav */}
          {viewport !== 'mobile' && (
            <div style={{ display: 'flex', gap: '1.75rem', fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#57534E' }}>
              <span style={{ cursor: 'pointer' }}>Collection</span>
              <span style={{ cursor: 'pointer' }}>Editorial</span>
              <span style={{ cursor: 'pointer' }}>About Atelier</span>
            </div>
          )}

          {/* Center Brand Title / Logo */}
          <div style={{ textAlign: 'center' }}>
            {editorState.logo_url ? (
              <img src={editorState.logo_url} alt="" style={{ height: 28, objectFit: 'contain' }} />
            ) : (
              <h1 style={{
                fontFamily: fontHeading,
                fontSize: viewport === 'mobile' ? '1.25rem' : '1.65rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                margin: 0,
                color: '#0A0A0A'
              }}>
                {editorState.store_name || 'Studio Label Paris'}
              </h1>
            )}
          </div>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#292524' }}>
            <Search size={18} style={{ cursor: 'pointer' }} />
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <ShoppingBag size={18} />
              <span style={{
                position: 'absolute', top: -3, right: -4, background: '#0A0A0A',
                color: '#fff', fontSize: '0.58rem', fontWeight: 800, width: 14, height: 14,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                0
              </span>
            </div>
          </div>
        </header>

        {/* ── 3. EDITORIAL HERO SHOWCASE ── */}
        <section
          style={{
            position: 'relative',
            height: viewport === 'mobile' ? '360px' : '460px',
            width: '100%',
            overflow: 'hidden',
            background: '#1C1917',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Hero background image */}
          <img
            src={editorState.hero_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80'}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(105%) brightness(95%)'
            }}
          />

          {/* Overlay with dynamic darkness */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,${editorState.hero_overlay_opacity ?? 0.65}) 100%)`
            }}
          />

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#FFFFFF', padding: '1.5rem', maxWidth: 700 }}>
            {editorState.hero_kicker && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#D6D3D1',
                marginBottom: '0.85rem',
                display: 'block'
              }}>
                {editorState.hero_kicker}
              </span>
            )}

            <h2 style={{
              fontFamily: fontHeading,
              fontSize: viewport === 'mobile' ? '2.1rem' : '3.3rem',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '0.04em',
              margin: '0 0 0.85rem 0',
              textShadow: '0 2px 16px rgba(0,0,0,0.4)'
            }}>
              {editorState.hero_headline || editorState.store_name}
            </h2>

            <p style={{
              fontSize: viewport === 'mobile' ? '0.88rem' : '1.05rem',
              fontWeight: 300,
              color: '#F5F5F4',
              margin: '0 auto 1.5rem auto',
              maxWidth: 520,
              lineHeight: 1.55
            }}>
              {editorState.hero_tagline || 'Modern Tailoring & AI Virtual Fitting Studio'}
            </p>

            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 2.1rem',
                background: '#FFFFFF',
                color: '#0A0A0A',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                borderRadius: btnRadius,
                border: 'none',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                cursor: 'pointer'
              }}
            >
              <span>{editorState.hero_btn_text || 'DISCOVER COLLECTION'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </section>

        {/* ── 4. REFINED DISPATCH STRIP ── */}
        <div style={{
          borderTop: '1px solid #E7E5E4',
          borderBottom: '1px solid #E7E5E4',
          padding: '1.15rem 2rem',
          background: '#FFFFFF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: viewport === 'mobile' ? '1.25rem' : '3rem',
          fontSize: viewport === 'mobile' ? '0.65rem' : '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#78716C',
          flexWrap: 'wrap'
        }}>
          <span>Architectural Silhouettes</span>
          <span>·</span>
          <span>European Textile Heritage</span>
          <span>·</span>
          <span>Bespoke Virtual Fitting</span>
        </div>

        {/* ── 5. MAIN EDITORIAL CATALOG ── */}
        <section style={{ padding: viewport === 'mobile' ? '2rem 1.25rem 3rem' : '3.5rem 2.75rem 5rem' }}>
          {/* Header with underline category tabs & sort indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            borderBottom: '1px solid #E7E5E4',
            paddingBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Elegant Underline Category Tabs (matching public /store/[handle]) */}
            <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCat(cat)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: activeCat === cat ? 700 : 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: activeCat === cat ? '#0A0A0A' : '#78716C',
                    cursor: 'pointer',
                    position: 'relative',
                    paddingBottom: '0.75rem',
                    marginBottom: -1,
                    borderBottom: activeCat === cat ? `2px solid ${accentColor}` : '2px solid transparent',
                    transition: 'color 0.2s, border-color 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort indicator */}
            <div style={{
              fontSize: '0.76rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#57534E',
              fontWeight: 600,
              paddingBottom: '0.75rem'
            }}>
              Sort · Featured
            </div>
          </div>

          {/* Product Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile'
              ? 'repeat(2, 1fr)'
              : (viewport === 'tablet' ? 'repeat(3, 1fr)' : `repeat(${editorState.catalog_columns || 4}, 1fr)`),
            gap: viewport === 'mobile' ? '1.5rem 0.85rem' : '2.5rem 1.75rem'
          }}>
            {displayedProducts.map(product => (
              <div
                key={product.id}
                className="editor-live-card"
                onMouseEnter={() => setHoveredCardId(product.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                {/* 3:4 Aspect Ratio Editorial Image Wrap */}
                <div
                  className="editor-live-image-wrap"
                  style={{ borderRadius: btnRadius }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="editor-live-img"
                  />

                  {/* Sleek Floating Hover Try-On Pill */}
                  {editorState.show_quick_tryon_btn !== false && (
                    <button
                      type="button"
                      className="editor-live-tryon-pill"
                      style={{ borderRadius: btnRadius }}
                    >
                      <Sparkles size={12} color="#cbf382" />
                      <span>Virtual Try-On</span>
                    </button>
                  )}
                </div>

                {/* Card Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{
                    fontSize: '0.66rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#78716C',
                    fontWeight: 500
                  }}>
                    {product.category}
                  </div>

                  <h3 style={{
                    fontFamily: fontHeading,
                    fontSize: viewport === 'mobile' ? '0.92rem' : '1.05rem',
                    fontWeight: 600,
                    color: '#0A0A0A',
                    margin: '1px 0 3px',
                    lineHeight: 1.35
                  }}>
                    {product.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0A0A0A' }}>
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span style={{ fontSize: '0.8rem', color: '#A8A29E', textDecoration: 'line-through' }}>
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Swatches */}
                  {editorState.show_color_swatches !== false && product.colors && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                      {product.colors.slice(0, 4).map((c, i) => (
                        <div
                          key={i}
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            background: c,
                            border: '1px solid rgba(0,0,0,0.18)'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. BRAND STORY / ATELIER NARRATIVE ── */}
        {editorState.story_enabled && (
          <section
            style={{
              padding: viewport === 'mobile' ? '2.5rem 1.5rem' : '4.5rem 3.5rem',
              background: '#FFFFFF',
              borderTop: '1px solid #E7E5E4',
              borderBottom: '1px solid #E7E5E4'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewport === 'mobile' ? '1fr' : '1fr 1fr',
              gap: '3rem',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', color: accentColor, textTransform: 'uppercase' }}>
                  {editorState.story_kicker || 'ATELIER HERITAGE'}
                </span>
                <h3 style={{
                  fontFamily: fontHeading,
                  fontSize: viewport === 'mobile' ? '1.75rem' : '2.3rem',
                  fontWeight: 600,
                  margin: '0.5rem 0 1.15rem 0',
                  color: '#0A0A0A',
                  lineHeight: 1.2
                }}>
                  {editorState.story_title || 'Architectural Silhouettes & Sustainable Craft'}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#57534E', lineHeight: 1.65, margin: '0 0 1.5rem 0' }}>
                  {editorState.description || 'Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Every garment in our collection is precision-crafted from sustainably sourced European textiles and optimized for zero-latency in-browser virtual try-on.'}
                </p>
                <div style={{
                  borderLeft: `2px solid ${accentColor}`,
                  paddingLeft: '1rem',
                  fontFamily: fontHeading,
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  color: '#292524',
                  lineHeight: 1.5
                }}>
                  "{editorState.story_quote || 'Where haute couture precision meets browser-native neural fitting.'}"
                </div>
              </div>

              <div style={{
                height: viewport === 'mobile' ? 240 : 360,
                borderRadius: btnRadius,
                overflow: 'hidden',
                background: '#F5F5F4'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&q=80"
                  alt="Atelier"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </section>
        )}

        {/* ── 7. VIP CLUB / NEWSLETTER ── */}
        {editorState.newsletter_enabled && (
          <section
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              background: '#F5F5F4'
            }}
          >
            <h4 style={{
              fontFamily: fontHeading,
              fontSize: '1.5rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0 0 0.5rem 0',
              color: '#0A0A0A'
            }}>
              {editorState.newsletter_title || 'JOIN THE ATELIER CIRCLE'}
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#57534E', maxWidth: 460, margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
              {editorState.newsletter_subtitle || 'Receive seasonal capsule previews, private lookbooks, and priority AI fittings.'}
            </p>
            <div style={{ display: 'inline-flex', maxWidth: 380, width: '100%', gap: 6 }}>
              <input
                type="email"
                placeholder="Enter your email address"
                style={{
                  flex: 1, padding: '0.65rem 0.95rem', borderRadius: btnRadius,
                  border: '1px solid #D6D3D1', fontSize: '0.8rem', outline: 'none', background: '#FFFFFF'
                }}
                disabled
              />
              <button
                type="button"
                style={{
                  padding: '0.65rem 1.35rem', borderRadius: btnRadius, background: '#0A0A0A',
                  color: '#FFFFFF', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.12em',
                  border: 'none', cursor: 'pointer'
                }}
              >
                JOIN
              </button>
            </div>
          </section>
        )}

        {/* ── 8. LUXURY FOOTER & CONCIERGE ── */}
        <footer
          style={{
            padding: viewport === 'mobile' ? '3rem 1.5rem 2rem' : '4.5rem 3.5rem 2.5rem',
            background: '#1C1917',
            color: '#D6D3D1',
            fontSize: '0.78rem'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? '1fr' : '2fr 1fr 1fr 1.5fr',
            gap: viewport === 'mobile' ? '2rem' : '3.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid #292524'
          }}>
            {/* Brand Philosophy */}
            <div>
              <div style={{ fontFamily: fontHeading, fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {editorState.store_name}
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '1.05rem', color: '#A8A29E', lineHeight: 1.6, maxWidth: 340, margin: '0 0 1.25rem' }}>
                {editorState.description || 'Founded on modern tailoring, clean architectural silhouettes, and zero-latency in-browser AI fitting.'}
              </p>
              <div style={{ fontSize: '0.72rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={12} color="#10B981" />
                <span>TLS 1.3 Certified Anycast Network</span>
              </div>
            </div>

            {/* Atelier Nav */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Atelier
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#A8A29E' }}>
                <span>Collection Lookbook</span>
                <span>Seasonal Archive</span>
                <span>Bespoke Fitting</span>
              </div>
            </div>

            {/* Client Care */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Client Care
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#A8A29E' }}>
                <span>{editorState.email || 'concierge@studiolabelparis.com'}</span>
                <span>Complimentary Courier</span>
                <span>30-Day Global Returns</span>
              </div>
            </div>

            {/* Private Dispatch */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Private Dispatch
              </div>
              <p style={{ fontSize: '0.78rem', color: '#A8A29E', lineHeight: 1.5, margin: 0 }}>
                Direct studio invitations, capsule previews, and VIP fitting trunk shows.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#78716C',
            fontSize: '0.7rem',
            paddingTop: '2rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <span>&copy; {new Date().getFullYear()} {editorState.store_name}. All rights reserved.</span>
            <span>Powered by <strong>VogueSocial Storefronts</strong></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
