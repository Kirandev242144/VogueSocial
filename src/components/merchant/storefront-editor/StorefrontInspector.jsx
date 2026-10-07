"use client";
import React from 'react';
import {
  Megaphone, Layout, Image, Grid, BookOpen, Mail,
  Phone, Palette, Globe, ChevronDown, ChevronUp, Sliders, Check, Sparkles
} from 'lucide-react';
import DomainSettingsTab from './DomainSettingsTab';

export const HERO_PRESETS = [
  { name: 'Editorial Studio', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80' },
  { name: 'Runway Trench', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80' },
  { name: 'Haute Obsidian', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80' },
  { name: 'Parisian Silk', url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1600&q=80' },
  { name: 'Cyber Streetwear', url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1600&q=80' },
  { name: 'Minimalist Atelier', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80' },
];

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern E-Shop',
    badge: 'Flagship D2C',
    desc: 'Contemporary high-conversion store with geometric typography, slide-over bag & in-card AI try-on.',
    preview: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    textColor: '#FFFFFF'
  },
  {
    id: 'minimal',
    name: 'Minimal Fashion',
    badge: 'Editorial',
    desc: 'Clean editorial whitespace. Less is more. Focuses exclusively on garment silhouettes and textures.',
    preview: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
    textColor: '#FFFFFF'
  },
  {
    id: 'luxury',
    name: 'Luxury Atelier',
    badge: 'Haute Atelier',
    desc: 'Dramatic obsidian surfaces with warm champagne gold accents and serif typography.',
    preview: 'linear-gradient(135deg, #1C1C1E 0%, #2A2A2C 100%)',
    textColor: '#C9A84C'
  },
  {
    id: 'streetwear',
    name: 'Streetwear & Drop',
    badge: 'Urban Culture',
    desc: 'Bold typography, high-impact neon accents, and capsule drop presentation.',
    preview: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
    textColor: '#CCFF00'
  },
  {
    id: 'boutique',
    name: 'Artisan Boutique',
    badge: 'Artisan Chic',
    desc: 'Warm organic cream tones with gentle rounded geometry and literary serif titles.',
    preview: 'linear-gradient(135deg, #C47E6B 0%, #9B7E6E 100%)',
    textColor: '#FFFFFF'
  }
];

export const ACCENT_PALETTES = [
  { name: 'Royal Indigo', value: '#2563eb' },
  { name: 'Obsidian Slate', value: '#0f172a' },
  { name: 'Champagne Gold', value: '#c9a84c' },
  { name: 'Forest Noir', value: '#059669' },
  { name: 'Warm Amber', value: '#d97706' },
  { name: 'Crimson Rose', value: '#e11d48' }
];

export const FONT_PAIRINGS = [
  { id: 'playfair-montserrat', name: 'Playfair Display + Montserrat', vibe: 'Classic Parisian Luxury' },
  { id: 'cormorant-jost', name: 'Cormorant Garamond + Jost', vibe: 'High Editorial Fashion' },
  { id: 'jakarta-inter', name: 'Plus Jakarta + Inter', vibe: 'Contemporary Clean' },
  { id: 'barlow-grotesk', name: 'Barlow + Space Grotesk', vibe: 'Streetwear Cyber' },
];

export default function StorefrontInspector({
  activeTab,
  setActiveTab,
  editorState,
  updateState,
  focusedSection,
  setFocusedSection,
  domainState,
  updateDomainState,
  onVerifyDNS,
  dnsChecking
}) {
  const toggleSection = (id) => {
    setFocusedSection(prev => prev === id ? null : id);
  };

  return (
    <aside className="editor-inspector">
      {/* Inspector Tabs */}
      <div className="editor-inspector-tabs">
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'sections' ? 'editor-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('sections')}
        >
          <Layout size={14} />
          <span>Sections</span>
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'theme' ? 'editor-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          <Palette size={14} />
          <span>Theme & Styles</span>
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'domains' ? 'editor-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('domains')}
        >
          <Globe size={14} />
          <span>Domains & DNS</span>
        </button>
      </div>

      <div className="editor-inspector-content">
        {/* ====================================================================
            TAB 1: SECTIONS & BLOCKS ACCORDION
            ==================================================================== */}
        {activeTab === 'sections' && (
          <>
            {/* 1. Announcement Bar */}
            <div className={`editor-accordion-card ${focusedSection === 'announcement' ? 'editor-accordion-card-focused' : ''}`}>
              <div className="editor-accordion-header" onClick={() => toggleSection('announcement')}>
                <div className="editor-accordion-title-wrap">
                  <div className="editor-accordion-icon">
                    <Megaphone size={14} />
                  </div>
                  <div>
                    <div className="editor-accordion-label">Announcement Bar</div>
                    <div className="editor-accordion-subtitle">{editorState.announcement_enabled ? 'Active banner' : 'Hidden'}</div>
                  </div>
                </div>
                <div className="editor-accordion-actions">
                  <button
                    type="button"
                    className={`editor-switch ${editorState.announcement_enabled ? 'editor-switch-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateState('announcement_enabled', !editorState.announcement_enabled);
                    }}
                    title="Toggle announcement bar visibility"
                  >
                    <div className="editor-switch-knob" />
                  </button>
                  {focusedSection === 'announcement' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {focusedSection === 'announcement' && (
                <div className="editor-accordion-body">
                  <div className="editor-field-group">
                    <label className="editor-field-label">Announcement Text</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.announcement_text || ''}
                      onChange={(e) => updateState('announcement_text', e.target.value)}
                      placeholder="e.g. COMPLIMENTARY EXPRESS SHIPPING OVER $200"
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Banner Background Color</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="color"
                        value={editorState.announcement_bg || '#111827'}
                        onChange={(e) => updateState('announcement_bg', e.target.value)}
                        style={{ width: 34, height: 34, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }}
                      />
                      <input
                        type="text"
                        className="editor-field-input"
                        value={editorState.announcement_bg || '#111827'}
                        onChange={(e) => updateState('announcement_bg', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Header & Navigation */}
            <div className={`editor-accordion-card ${focusedSection === 'header' ? 'editor-accordion-card-focused' : ''}`}>
              <div className="editor-accordion-header" onClick={() => toggleSection('header')}>
                <div className="editor-accordion-title-wrap">
                  <div className="editor-accordion-icon">
                    <Layout size={14} />
                  </div>
                  <div>
                    <div className="editor-accordion-label">Header & Navigation</div>
                    <div className="editor-accordion-subtitle">{editorState.store_name}</div>
                  </div>
                </div>
                {focusedSection === 'header' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {focusedSection === 'header' && (
                <div className="editor-accordion-body">
                  <div className="editor-field-group">
                    <label className="editor-field-label">Brand Title / Atelier Name</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.store_name || ''}
                      onChange={(e) => updateState('store_name', e.target.value)}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Custom Logo Image URL</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.logo_url || ''}
                      onChange={(e) => updateState('logo_url', e.target.value)}
                      placeholder="https://... (leave blank to use typography logo)"
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Header Layout</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['centered', 'left', 'split'].map(layout => (
                        <button
                          key={layout}
                          type="button"
                          onClick={() => updateState('header_layout', layout)}
                          className="editor-btn-secondary"
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            textTransform: 'capitalize',
                            borderColor: (editorState.header_layout || 'centered') === layout ? '#2563eb' : undefined,
                            background: (editorState.header_layout || 'centered') === layout ? '#eff6ff' : undefined,
                            color: (editorState.header_layout || 'centered') === layout ? '#1e40af' : undefined
                          }}
                        >
                          {layout}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Hero Editorial Showcase */}
            <div className={`editor-accordion-card ${focusedSection === 'hero' ? 'editor-accordion-card-focused' : ''}`}>
              <div className="editor-accordion-header" onClick={() => toggleSection('hero')}>
                <div className="editor-accordion-title-wrap">
                  <div className="editor-accordion-icon">
                    <Image size={14} />
                  </div>
                  <div>
                    <div className="editor-accordion-label">Hero Editorial Showcase</div>
                    <div className="editor-accordion-subtitle">{editorState.hero_headline || 'Main billboard'}</div>
                  </div>
                </div>
                {focusedSection === 'hero' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {focusedSection === 'hero' && (
                <div className="editor-accordion-body">
                  <div className="editor-field-group">
                    <label className="editor-field-label">Kicker / Badge Note</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.hero_kicker || ''}
                      onChange={(e) => updateState('hero_kicker', e.target.value)}
                      placeholder="e.g. N° 26 · AUTUMN / WINTER EDITORIAL"
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Hero Headline</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.hero_headline || ''}
                      onChange={(e) => updateState('hero_headline', e.target.value)}
                      placeholder="Studio Label Paris"
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Tagline / Subheadline</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.hero_tagline || ''}
                      onChange={(e) => updateState('hero_tagline', e.target.value)}
                      placeholder="Modern Tailoring & AI Virtual Fitting Studio"
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Curated Fashion Hero Presets</label>
                    <div className="editor-image-presets-grid">
                      {HERO_PRESETS.map((preset, idx) => (
                        <div
                          key={idx}
                          className={`editor-image-preset-thumb ${editorState.hero_image === preset.url ? 'editor-image-preset-thumb-active' : ''}`}
                          onClick={() => updateState('hero_image', preset.url)}
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Custom Hero Image URL</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.hero_image || ''}
                      onChange={(e) => updateState('hero_image', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="editor-field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="editor-field-label">Overlay Darkness</label>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                        {Math.round((editorState.hero_overlay_opacity ?? 0.45) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.8"
                      step="0.05"
                      value={editorState.hero_overlay_opacity ?? 0.45}
                      onChange={(e) => updateState('hero_overlay_opacity', parseFloat(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                    <div className="editor-field-group">
                      <label className="editor-field-label">CTA Button Label</label>
                      <input
                        type="text"
                        className="editor-field-input"
                        value={editorState.hero_btn_text || 'DISCOVER COLLECTION'}
                        onChange={(e) => updateState('hero_btn_text', e.target.value)}
                      />
                    </div>
                    <div className="editor-field-group">
                      <label className="editor-field-label">CTA Target Link</label>
                      <input
                        type="text"
                        className="editor-field-input"
                        value={editorState.hero_btn_link || '#collection'}
                        onChange={(e) => updateState('hero_btn_link', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Product Catalog Grid */}
            <div className={`editor-accordion-card ${focusedSection === 'catalog' ? 'editor-accordion-card-focused' : ''}`}>
              <div className="editor-accordion-header" onClick={() => toggleSection('catalog')}>
                <div className="editor-accordion-title-wrap">
                  <div className="editor-accordion-icon">
                    <Grid size={14} />
                  </div>
                  <div>
                    <div className="editor-accordion-label">Product Catalog Grid</div>
                    <div className="editor-accordion-subtitle">{editorState.catalog_columns || 4} Columns · Try-On Enabled</div>
                  </div>
                </div>
                {focusedSection === 'catalog' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {focusedSection === 'catalog' && (
                <div className="editor-accordion-body">
                  <div className="editor-field-group">
                    <label className="editor-field-label">Grid Columns</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[2, 3, 4].map(cols => (
                        <button
                          key={cols}
                          type="button"
                          onClick={() => updateState('catalog_columns', cols)}
                          className="editor-btn-secondary"
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            borderColor: (editorState.catalog_columns || 4) === cols ? '#2563eb' : undefined,
                            background: (editorState.catalog_columns || 4) === cols ? '#eff6ff' : undefined,
                            color: (editorState.catalog_columns || 4) === cols ? '#1e40af' : undefined
                          }}
                        >
                          {cols} Cols
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="editor-switch-row">
                    <span className="editor-switch-label">Show "AI Try-On" Quick Action</span>
                    <button
                      type="button"
                      className={`editor-switch ${editorState.show_quick_tryon_btn !== false ? 'editor-switch-active' : ''}`}
                      onClick={() => updateState('show_quick_tryon_btn', editorState.show_quick_tryon_btn === false)}
                    >
                      <div className="editor-switch-knob" />
                    </button>
                  </div>

                  <div className="editor-switch-row">
                    <span className="editor-switch-label">Show Color Swatches</span>
                    <button
                      type="button"
                      className={`editor-switch ${editorState.show_color_swatches !== false ? 'editor-switch-active' : ''}`}
                      onClick={() => updateState('show_color_swatches', editorState.show_color_swatches === false)}
                    >
                      <div className="editor-switch-knob" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Brand Story / Atelier Narrative */}
            <div className={`editor-accordion-card ${focusedSection === 'story' ? 'editor-accordion-card-focused' : ''}`}>
              <div className="editor-accordion-header" onClick={() => toggleSection('story')}>
                <div className="editor-accordion-title-wrap">
                  <div className="editor-accordion-icon">
                    <BookOpen size={14} />
                  </div>
                  <div>
                    <div className="editor-accordion-label">Brand Story & Narrative</div>
                    <div className="editor-accordion-subtitle">{editorState.story_enabled ? 'Section Visible' : 'Hidden'}</div>
                  </div>
                </div>
                <div className="editor-accordion-actions">
                  <button
                    type="button"
                    className={`editor-switch ${editorState.story_enabled ? 'editor-switch-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateState('story_enabled', !editorState.story_enabled);
                    }}
                  >
                    <div className="editor-switch-knob" />
                  </button>
                  {focusedSection === 'story' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {focusedSection === 'story' && (
                <div className="editor-accordion-body">
                  <div className="editor-field-group">
                    <label className="editor-field-label">Story Kicker</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.story_kicker || 'ATELIER HERITAGE'}
                      onChange={(e) => updateState('story_kicker', e.target.value)}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Story Title</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.story_title || 'Architectural Silhouettes & Sustainable Craft'}
                      onChange={(e) => updateState('story_title', e.target.value)}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Narrative Text</label>
                    <textarea
                      rows={4}
                      className="editor-field-textarea"
                      value={editorState.description || ''}
                      onChange={(e) => updateState('description', e.target.value)}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Atelier Philosophy Quote</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.story_quote || 'Where haute couture precision meets browser-native neural fitting.'}
                      onChange={(e) => updateState('story_quote', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 6. VIP Club / Newsletter */}
            <div className={`editor-accordion-card ${focusedSection === 'newsletter' ? 'editor-accordion-card-focused' : ''}`}>
              <div className="editor-accordion-header" onClick={() => toggleSection('newsletter')}>
                <div className="editor-accordion-title-wrap">
                  <div className="editor-accordion-icon">
                    <Mail size={14} />
                  </div>
                  <div>
                    <div className="editor-accordion-label">VIP Club & Newsletter</div>
                    <div className="editor-accordion-subtitle">{editorState.newsletter_enabled ? 'Subscription active' : 'Hidden'}</div>
                  </div>
                </div>
                <div className="editor-accordion-actions">
                  <button
                    type="button"
                    className={`editor-switch ${editorState.newsletter_enabled ? 'editor-switch-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateState('newsletter_enabled', !editorState.newsletter_enabled);
                    }}
                  >
                    <div className="editor-switch-knob" />
                  </button>
                  {focusedSection === 'newsletter' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {focusedSection === 'newsletter' && (
                <div className="editor-accordion-body">
                  <div className="editor-field-group">
                    <label className="editor-field-label">Newsletter Title</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.newsletter_title || 'JOIN THE ATELIER CIRCLE'}
                      onChange={(e) => updateState('newsletter_title', e.target.value)}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Incentive Subtitle</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.newsletter_subtitle || 'Receive seasonal capsule previews and private fitting trunk shows.'}
                      onChange={(e) => updateState('newsletter_subtitle', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 7. Footer & Concierge */}
            <div className={`editor-accordion-card ${focusedSection === 'footer' ? 'editor-accordion-card-focused' : ''}`}>
              <div className="editor-accordion-header" onClick={() => toggleSection('footer')}>
                <div className="editor-accordion-title-wrap">
                  <div className="editor-accordion-icon">
                    <Phone size={14} />
                  </div>
                  <div>
                    <div className="editor-accordion-label">Footer & Concierge</div>
                    <div className="editor-accordion-subtitle">{editorState.email || 'Contact info'}</div>
                  </div>
                </div>
                {focusedSection === 'footer' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>

              {focusedSection === 'footer' && (
                <div className="editor-accordion-body">
                  <div className="editor-field-group">
                    <label className="editor-field-label">Concierge Email</label>
                    <input
                      type="email"
                      className="editor-field-input"
                      value={editorState.email || ''}
                      onChange={(e) => updateState('email', e.target.value)}
                    />
                  </div>

                  <div className="editor-field-group">
                    <label className="editor-field-label">Concierge Phone</label>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={editorState.phone || ''}
                      onChange={(e) => updateState('phone', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ====================================================================
            TAB 2: THEME STYLES & PRESETS
            ==================================================================== */}
        {activeTab === 'theme' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 5 Templates */}
            <div>
              <label className="editor-field-label" style={{ marginBottom: 8, display: 'block' }}>
                Select Storefront Aesthetic
              </label>
              <div className="editor-template-cards">
                {TEMPLATES.map(tpl => {
                  const isSelected = (editorState.template || 'modern') === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      className={`editor-template-card ${isSelected ? 'editor-template-card-active' : ''}`}
                      onClick={() => updateState('template', tpl.id)}
                    >
                      <div className="editor-template-swatch" style={{ background: tpl.preview, color: tpl.textColor }}>
                        {tpl.name.slice(0, 2)}
                      </div>
                      <div className="editor-template-meta">
                        <div className="editor-template-name-row">
                          <span className="editor-template-name">{tpl.name}</span>
                          {isSelected && <span className="editor-template-badge">ACTIVE</span>}
                        </div>
                        <div className="editor-template-desc">{tpl.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div>
              <label className="editor-field-label" style={{ marginBottom: 8, display: 'block' }}>
                Brand Accent Palette
              </label>
              <div className="editor-palette-row">
                {ACCENT_PALETTES.map(p => (
                  <div
                    key={p.value}
                    className={`editor-color-swatch ${editorState.accent_color === p.value ? 'editor-color-swatch-active' : ''}`}
                    style={{ background: p.value }}
                    onClick={() => updateState('accent_color', p.value)}
                    title={p.name}
                  />
                ))}
                <input
                  type="color"
                  value={editorState.accent_color || '#2563eb'}
                  onChange={(e) => updateState('accent_color', e.target.value)}
                  style={{ width: 28, height: 28, border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'transparent' }}
                  title="Custom Color"
                />
              </div>
            </div>

            {/* Typography Pairings */}
            <div>
              <label className="editor-field-label" style={{ marginBottom: 8, display: 'block' }}>
                Typography Pairings
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {FONT_PAIRINGS.map(font => {
                  const isSelected = (editorState.font_pairing || 'playfair-montserrat') === font.id;
                  return (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => updateState('font_pairing', font.id)}
                      className="editor-btn-secondary"
                      style={{
                        justifyContent: 'space-between',
                        borderColor: isSelected ? '#2563eb' : undefined,
                        background: isSelected ? '#eff6ff' : undefined,
                        color: isSelected ? '#1e40af' : undefined,
                        padding: '0.65rem 0.85rem'
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{font.name}</div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{font.vibe}</div>
                      </div>
                      {isSelected && <Check size={14} color="#2563eb" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Corner Radius */}
            <div>
              <label className="editor-field-label" style={{ marginBottom: 8, display: 'block' }}>
                Button & Card Geometry
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {[
                  { id: 'sharp', label: 'Sharp 0px' },
                  { id: 'soft', label: 'Soft 6px' },
                  { id: 'rounded', label: 'Round 12px' },
                  { id: 'pill', label: 'Pill 99px' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => updateState('border_radius', r.id)}
                    className="editor-btn-secondary"
                    style={{
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      borderColor: (editorState.border_radius || 'soft') === r.id ? '#2563eb' : undefined,
                      background: (editorState.border_radius || 'soft') === r.id ? '#eff6ff' : undefined,
                      color: (editorState.border_radius || 'soft') === r.id ? '#1e40af' : undefined
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB 3: DOMAINS & DNS SETTINGS
            ==================================================================== */}
        {activeTab === 'domains' && (
          <DomainSettingsTab
            domainState={domainState}
            updateDomainState={updateDomainState}
            onVerifyDNS={onVerifyDNS}
            dnsChecking={dnsChecking}
          />
        )}
      </div>
    </aside>
  );
}
