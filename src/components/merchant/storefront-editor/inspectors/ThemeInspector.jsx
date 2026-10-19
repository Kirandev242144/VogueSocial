"use client";
import React from 'react';
import { Palette, Sparkles, Check } from 'lucide-react';

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern E-Shop',
    badge: 'Flagship D2C',
    desc: 'Contemporary high-conversion store with geometric typography, slide-over bag & in-card AI try-on.',
    swatchClass: 'editor-template-swatch-modern',
    tag: 'MODERN'
  },
  {
    id: 'minimal',
    name: 'Minimal Fashion',
    badge: 'Editorial',
    desc: 'Clean editorial whitespace. Less is more. Focuses exclusively on garment silhouettes and textures.',
    swatchClass: 'editor-template-swatch-minimal',
    tag: 'MINIMAL'
  },
  {
    id: 'luxury',
    name: 'Luxury Atelier',
    badge: 'Haute Atelier',
    desc: 'Dramatic obsidian surfaces with warm champagne gold accents and serif typography.',
    swatchClass: 'editor-template-swatch-luxury',
    tag: 'LUXURY'
  },
  {
    id: 'streetwear',
    name: 'Streetwear & Drop',
    badge: 'Urban Culture',
    desc: 'Bold typography, high-impact neon accents, and capsule drop presentation.',
    swatchClass: 'editor-template-swatch-streetwear',
    tag: 'STREET'
  },
  {
    id: 'boutique',
    name: 'Artisan Boutique',
    badge: 'Artisan Chic',
    desc: 'Warm organic cream tones with gentle rounded geometry and literary serif titles.',
    swatchClass: 'editor-template-swatch-boutique',
    tag: 'BOUTIQUE'
  }
];

export const ACCENT_PALETTES = [
  { name: 'Royal Indigo', value: '#2563eb', className: 'editor-color-swatch-indigo' },
  { name: 'Obsidian Slate', value: '#0f172a', className: 'editor-color-swatch-slate' },
  { name: 'Champagne Gold', value: '#c9a84c', className: 'editor-color-swatch-gold' },
  { name: 'Forest Noir', value: '#059669', className: 'editor-color-swatch-forest' },
  { name: 'Warm Amber', value: '#d97706', className: 'editor-color-swatch-amber' },
  { name: 'Crimson Rose', value: '#e11d48', className: 'editor-color-swatch-rose' }
];

export const FONT_PAIRINGS = [
  { id: 'playfair-montserrat', name: 'Playfair Display + Montserrat', vibe: 'Classic Parisian Luxury' },
  { id: 'cormorant-jost', name: 'Cormorant Garamond + Jost', vibe: 'High Editorial Fashion' },
  { id: 'jakarta-inter', name: 'Plus Jakarta + Inter', vibe: 'Contemporary Clean' },
  { id: 'barlow-grotesk', name: 'Barlow + Space Grotesk', vibe: 'Streetwear Cyber' },
];

export default function ThemeInspector({ editorState, updateState }) {
  return (
    <div className="editor-sections-list">
      {/* 1. Theme Templates */}
      <div className="editor-accordion-card editor-accordion-card-focused">
        <div className="editor-accordion-header">
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Sparkles size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Storefront Themes</div>
              <div className="editor-accordion-subtitle">{TEMPLATES.find(t => t.id === editorState.template)?.name || 'Modern E-Shop'}</div>
            </div>
          </div>
        </div>

        <div className="editor-accordion-body">
          <div className="editor-template-cards">
            {TEMPLATES.map((t) => {
              const isSelected = editorState.template === t.id;
              return (
                <div
                  key={t.id}
                  className={`editor-template-card ${isSelected ? 'editor-template-card-active' : ''}`}
                  onClick={() => updateState('template', t.id)}
                >
                  <div className={`editor-template-swatch ${t.swatchClass}`}>
                    {t.tag}
                  </div>
                  <div className="editor-template-meta">
                    <div className="editor-template-name-row">
                      <span className="editor-template-name">{t.name}</span>
                      <span className="editor-template-badge">{t.badge}</span>
                    </div>
                    <div className="editor-template-desc">{t.desc}</div>
                  </div>
                  {isSelected && <Check size={16} color="#0f172a" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Brand Accent Color */}
      <div className="editor-accordion-card">
        <div className="editor-accordion-header">
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Palette size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Brand Accent Color</div>
              <div className="editor-accordion-subtitle">{editorState.accent_color || '#2563eb'}</div>
            </div>
          </div>
        </div>

        <div className="editor-accordion-body">
          <div className="editor-palette-row">
            {ACCENT_PALETTES.map((p) => {
              const isSelected = (editorState.accent_color || '').toLowerCase() === p.value.toLowerCase();
              return (
                <div
                  key={p.name}
                  className={`editor-color-swatch ${p.className} ${isSelected ? 'editor-color-swatch-active' : ''}`}
                  onClick={() => updateState('accent_color', p.value)}
                  title={`${p.name} (${p.value})`}
                >
                  {isSelected && <Check size={12} color="#ffffff" />}
                </div>
              );
            })}
          </div>

          <div className="editor-field-group">
            <label className="editor-field-label">Custom Hex Code</label>
            <div className="editor-color-input-row">
              <input
                type="color"
                value={editorState.accent_color || '#2563eb'}
                onChange={(e) => updateState('accent_color', e.target.value)}
                className="editor-color-picker-dot"
              />
              <input
                type="text"
                className="editor-field-input"
                value={editorState.accent_color || '#2563eb'}
                onChange={(e) => updateState('accent_color', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Typography Pairings */}
      <div className="editor-accordion-card">
        <div className="editor-accordion-header">
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <span className="editor-field-label">Aa</span>
            </div>
            <div>
              <div className="editor-accordion-label">Typography Pairings</div>
              <div className="editor-accordion-subtitle">Headings & Body Font Stack</div>
            </div>
          </div>
        </div>

        <div className="editor-accordion-body">
          <div className="editor-sections-list">
            {FONT_PAIRINGS.map((fp) => {
              const isSelected = (editorState.font_pairing || 'playfair-montserrat') === fp.id;
              return (
                <button
                  key={fp.id}
                  type="button"
                  className={`editor-font-pair-btn ${isSelected ? 'editor-font-pair-btn-active' : ''}`}
                  onClick={() => updateState('font_pairing', fp.id)}
                >
                  <div>
                    <div className="editor-accordion-label">{fp.name}</div>
                    <div className="editor-accordion-subtitle">{fp.vibe}</div>
                  </div>
                  {isSelected && <Check size={14} color="#0f172a" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Container & Button Corner Radii */}
      <div className="editor-accordion-card">
        <div className="editor-accordion-header">
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <span className="editor-field-label">▢</span>
            </div>
            <div>
              <div className="editor-accordion-label">Geometry & Corner Radius</div>
              <div className="editor-accordion-subtitle">{editorState.border_radius || 'soft'}</div>
            </div>
          </div>
        </div>

        <div className="editor-accordion-body">
          <div className="editor-pill-select-group">
            {[
              { id: 'sharp', label: 'Sharp (0px)' },
              { id: 'soft', label: 'Soft (4px)' },
              { id: 'rounded', label: 'Rounded (8px)' },
              { id: 'pill', label: 'Pill (99px)' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                className={`editor-pill-select-btn ${(editorState.border_radius || 'soft') === r.id ? 'editor-pill-select-btn-active' : ''}`}
                onClick={() => updateState('border_radius', r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
