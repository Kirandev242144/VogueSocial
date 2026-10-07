"use client";
import React, { useState } from 'react';
import {
  Search, ShoppingBag, Sparkles, ArrowRight, Heart, ExternalLink
} from 'lucide-react';

const SAMPLE_STORE_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Structured Double-Breasted Trench',
    category: 'Outerwear',
    price: 520,
    sale_price: 460,
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80',
    colors: ['#0f172a', '#c19a6b', '#9ca3af']
  },
  {
    id: 'prod-2',
    name: 'Silk Charmeuse Bias-Cut Slip Dress',
    category: 'Eveningwear',
    price: 340,
    sale_price: null,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80',
    colors: ['#f7e7ce', '#0f172a', '#fda4af']
  },
  {
    id: 'prod-3',
    name: 'Minimalist Relaxed Cashmere Knit',
    category: 'Knitwear',
    price: 290,
    sale_price: 245,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
    colors: ['#f5f5dc', '#374151', '#c19a6b']
  },
  {
    id: 'prod-4',
    name: 'Italian Wool Pleated Wide-Leg Trouser',
    category: 'Tailored Suiting',
    price: 260,
    sale_price: null,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&q=80',
    colors: ['#0a0a0a', '#9ca3af']
  }
];

export default function StorefrontLiveCanvas({
  editorState,
  viewport
}) {
  const [activeCat, setActiveCat] = useState('All');

  // Font family determination
  let fontHeading = "'Playfair Display', serif";
  let fontBody = "'Montserrat', sans-serif";
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
  let btnRadius = '6px';
  if (editorState.border_radius === 'sharp') btnRadius = '0px';
  if (editorState.border_radius === 'rounded') btnRadius = '12px';
  if (editorState.border_radius === 'pill') btnRadius = '99px';

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
        {viewport === 'mobile' && <div className="canvas-mobile-notch" />}

        {/* ── 1. ANNOUNCEMENT BAR ── */}
        {editorState.announcement_enabled && (
          <div
            style={{
              background: editorState.announcement_bg || '#111827',
              color: '#F3F4F6',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              textAlign: 'center',
              padding: '0.5rem 1rem'
            }}
          >
            <span>{editorState.announcement_text || 'COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING OVER $200'}</span>
          </div>
        )}

        {/* ── 2. HEADER & NAVIGATION ── */}
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
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#57534E' }}>
              <span>Collection</span>
              <span>Editorial</span>
              <span>About Atelier</span>
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
                letterSpacing: '0.16em',
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
            <Search size={17} />
            <div style={{ position: 'relative' }}>
              <ShoppingBag size={17} />
              <span style={{
                position: 'absolute', top: -3, right: -4, background: '#0A0A0A',
                color: '#fff', fontSize: '0.58rem', fontWeight: 800, width: 14, height: 14,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                2
              </span>
            </div>
          </div>
        </header>

        {/* ── 3. HERO SHOWCASE ── */}
        <section
          style={{
            position: 'relative',
            height: viewport === 'mobile' ? '380px' : '480px',
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
              objectFit: 'cover'
            }}
          />

          {/* Overlay with dynamic darkness */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `rgba(10, 10, 10, ${editorState.hero_overlay_opacity ?? 0.45})`
            }}
          />

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#FFFFFF', padding: '1.5rem', maxWidth: 700 }}>
            {editorState.hero_kicker && (
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#E7E5E4',
                marginBottom: '0.85rem',
                display: 'block'
              }}>
                {editorState.hero_kicker}
              </span>
            )}

            <h2 style={{
              fontFamily: fontHeading,
              fontSize: viewport === 'mobile' ? '2.1rem' : '3.2rem',
              fontWeight: 500,
              lineHeight: 1.1,
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
              maxWidth: 500,
              lineHeight: 1.5
            }}>
              {editorState.hero_tagline || 'Modern Tailoring & AI Virtual Fitting Studio'}
            </p>

            <button
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.85rem',
                background: '#FFFFFF',
                color: '#0A0A0A',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
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

        {/* ── 4. CATEGORY FILTER PILLS ── */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '1.25rem 1rem 0.5rem',
          flexWrap: 'wrap'
        }}>
          {['All', 'Outerwear', 'Eveningwear', 'Knitwear', 'Tailored Suiting'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: btnRadius,
                fontSize: '0.72rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: activeCat === cat ? accentColor : '#E7E5E4',
                background: activeCat === cat ? accentColor : '#FFFFFF',
                color: activeCat === cat ? '#FFFFFF' : '#57534E',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── 5. PRODUCT CATALOG GRID ── */}
        <section style={{ padding: '1.5rem 2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: viewport === 'mobile' ? 'repeat(2, 1fr)' : `repeat(${editorState.catalog_columns || 4}, 1fr)`,
            gap: viewport === 'mobile' ? '1rem' : '1.5rem'
          }}>
            {SAMPLE_STORE_PRODUCTS.map(product => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  border: '1px solid #E7E5E4',
                  borderRadius: btnRadius,
                  overflow: 'hidden'
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: 260, overflow: 'hidden', background: '#F5F5F4' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {editorState.show_quick_tryon_btn !== false && (
                    <div style={{
                      position: 'absolute', bottom: 8, left: 8, right: 8,
                      background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
                      color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 700,
                      padding: '0.35rem', borderRadius: 6, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', gap: 4
                    }}>
                      <Sparkles size={11} color="#cbf382" /> Try-On Studio
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.65rem', color: '#78716C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {product.category}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1C1917', margin: '3px 0 6px', lineHeight: 1.3 }}>
                    {product.name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0A0A0A' }}>
                      ${product.price}
                    </div>

                    {editorState.show_color_swatches !== false && (
                      <div style={{ display: 'flex', gap: 3 }}>
                        {product.colors.map((c, i) => (
                          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, border: '1px solid #d6d3d1' }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. BRAND STORY / ATELIER NARRATIVE ── */}
        {editorState.story_enabled && (
          <section
            style={{
              padding: viewport === 'mobile' ? '2rem 1.5rem' : '3.5rem 3rem',
              background: '#FFFFFF',
              borderTop: '1px solid #E7E5E4',
              borderBottom: '1px solid #E7E5E4'
            }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewport === 'mobile' ? '1fr' : '1fr 1fr',
              gap: '2.5rem',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', color: accentColor, textTransform: 'uppercase' }}>
                  {editorState.story_kicker || 'ATELIER HERITAGE'}
                </span>
                <h3 style={{
                  fontFamily: fontHeading,
                  fontSize: viewport === 'mobile' ? '1.6rem' : '2.1rem',
                  fontWeight: 600,
                  margin: '0.5rem 0 1rem 0',
                  color: '#0A0A0A',
                  lineHeight: 1.2
                }}>
                  {editorState.story_title || 'Architectural Silhouettes & Sustainable Craft'}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#57534E', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                  {editorState.description || 'Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Every garment in our collection is precision-crafted from sustainably sourced European textiles.'}
                </p>
                <div style={{
                  borderLeft: `2px solid ${accentColor}`,
                  paddingLeft: '0.85rem',
                  fontStyle: 'italic',
                  fontSize: '0.85rem',
                  color: '#292524'
                }}>
                  "{editorState.story_quote || 'Where haute couture precision meets browser-native neural fitting.'}"
                </div>
              </div>

              <div style={{ height: viewport === 'mobile' ? 220 : 320, borderRadius: btnRadius, overflow: 'hidden' }}>
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
              padding: '2.5rem 2rem',
              textAlign: 'center',
              background: '#F5F5F4'
            }}
          >
            <h4 style={{
              fontFamily: fontHeading,
              fontSize: '1.4rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: '0 0 0.5rem 0',
              color: '#0A0A0A'
            }}>
              {editorState.newsletter_title || 'JOIN THE ATELIER CIRCLE'}
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#57534E', maxWidth: 440, margin: '0 auto 1.25rem auto' }}>
              {editorState.newsletter_subtitle || 'Receive seasonal capsule previews and private fitting trunk shows.'}
            </p>
            <div style={{ display: 'inline-flex', maxWidth: 360, width: '100%', gap: 6 }}>
              <input
                type="email"
                placeholder="Enter your email address"
                style={{
                  flex: 1, padding: '0.55rem 0.85rem', borderRadius: btnRadius,
                  border: '1px solid #D6D3D1', fontSize: '0.78rem', outline: 'none'
                }}
                disabled
              />
              <button
                type="button"
                style={{
                  padding: '0.55rem 1.15rem', borderRadius: btnRadius, background: '#0A0A0A',
                  color: '#FFFFFF', fontSize: '0.72rem', fontWeight: 700, border: 'none', cursor: 'pointer'
                }}
              >
                JOIN
              </button>
            </div>
          </section>
        )}

        {/* ── 8. FOOTER & CONCIERGE ── */}
        <footer
          style={{
            padding: '2rem 2.5rem',
            background: '#1C1917',
            color: '#A8A29E',
            fontSize: '0.72rem'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid #292524',
            paddingBottom: '1.25rem',
            marginBottom: '1rem'
          }}>
            <div>
              <div style={{ fontFamily: fontHeading, fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 600, letterSpacing: '0.12em' }}>
                {editorState.store_name}
              </div>
              <div style={{ marginTop: 4, color: '#78716C' }}>
                Concierge: {editorState.email || 'concierge@studiolabelparis.com'} · {editorState.phone || '+33 1 42 68 55 00'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', color: '#E7E5E4', textTransform: 'uppercase', fontWeight: 600 }}>
              <span>Instagram</span>
              <span>Vogue Editorial</span>
              <span>Fitting Room</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#78716C', fontSize: '0.68rem' }}>
            <span>&copy; {new Date().getFullYear()} {editorState.store_name}. All rights reserved.</span>
            <span>Powered by <strong>VogueSocial Storefronts</strong></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
