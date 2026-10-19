"use client";
import React, { useRef, useState } from 'react';
import {
  Megaphone, Layout, Image, Grid, BookOpen, Mail, Phone,
  ChevronDown, ChevronUp, Check, Sliders, UploadCloud, AlertCircle,
  CheckCircle2, Trash2
} from 'lucide-react';

export const HERO_PRESETS = [
  { name: 'Editorial Studio', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80' },
  { name: 'Runway Trench', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80' },
  { name: 'Haute Obsidian', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&q=80' },
  { name: 'Parisian Silk', url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1600&q=80' },
  { name: 'Cyber Streetwear', url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1600&q=80' },
  { name: 'Minimalist Atelier', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80' },
];

export default function SectionsInspector({
  editorState,
  updateState,
  focusedSection,
  setFocusedSection
}) {
  const toggleSection = (id) => {
    setFocusedSection(prev => prev === id ? null : id);
  };

  const fileInputRef = useRef(null);
  const [logoError, setLogoError] = useState('');
  const [showUrlFallback, setShowUrlFallback] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoError('');

    // 1. Strict PNG validation
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
    if (!isPng) {
      setLogoError('Only PNG images (.png) are supported for storefront logos.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Strict Logo file size limit (max 2MB)
    const MAX_SIZE_BYTES = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setLogoError('Logo file exceeds 2MB limit. Please upload an optimized PNG.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new window.Image();
      img.onload = () => {
        // Enforce logo size constraints: scale down huge images to crisp high-DPI logo dimensions (max 400x160)
        // while preserving transparent PNG alpha channel
        const maxLogoWidth = 400;
        const maxLogoHeight = 160;
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (targetWidth > maxLogoWidth || targetHeight > maxLogoHeight) {
          const ratio = Math.min(maxLogoWidth / targetWidth, maxLogoHeight / targetHeight);
          targetWidth = Math.round(targetWidth * ratio);
          targetHeight = Math.round(targetHeight * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const optimizedPngDataUrl = canvas.toDataURL('image/png');
          updateState('logo_url', optimizedPngDataUrl);
        } else {
          updateState('logo_url', dataUrl);
        }
      };
      img.onerror = () => {
        setLogoError('Failed to read PNG logo image.');
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      setLogoError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    updateState('logo_url', '');
    setLogoError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="editor-sections-list">
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
            {focusedSection === 'announcement' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>

        {focusedSection === 'announcement' && (
          <div className="editor-accordion-body">
            <div className="editor-field-group">
              <label className="editor-field-label">Announcement Message</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.announcement_text || ''}
                onChange={(e) => updateState('announcement_text', e.target.value)}
                placeholder="e.g. Complimentary worldwide express shipping over $200"
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Banner Background Color</label>
              <div className="editor-color-input-row">
                <input
                  type="color"
                  value={editorState.announcement_bg || '#111827'}
                  onChange={(e) => updateState('announcement_bg', e.target.value)}
                  className="editor-color-picker-dot"
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

      {/* 2. Header & Branding */}
      <div className={`editor-accordion-card ${focusedSection === 'header' ? 'editor-accordion-card-focused' : ''}`}>
        <div className="editor-accordion-header" onClick={() => toggleSection('header')}>
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Layout size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Header & Branding</div>
              <div className="editor-accordion-subtitle">{editorState.store_name}</div>
            </div>
          </div>
          <div className="editor-accordion-actions">
            {focusedSection === 'header' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>

        {focusedSection === 'header' && (
          <div className="editor-accordion-body">
            <div className="editor-field-group">
              <label className="editor-field-label">Storefront Brand Name</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.store_name || ''}
                onChange={(e) => updateState('store_name', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Atelier Tagline</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.tagline || ''}
                onChange={(e) => updateState('tagline', e.target.value)}
                placeholder="e.g. Modern Tailoring & AI Virtual Fitting Studio"
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Header Layout Alignment</label>
              <div className="editor-pill-select-group">
                <button
                  type="button"
                  className={`editor-pill-select-btn ${editorState.header_layout === 'centered' ? 'editor-pill-select-btn-active' : ''}`}
                  onClick={() => updateState('header_layout', 'centered')}
                >
                  Centered
                </button>
                <button
                  type="button"
                  className={`editor-pill-select-btn ${editorState.header_layout === 'left' ? 'editor-pill-select-btn-active' : ''}`}
                  onClick={() => updateState('header_layout', 'left')}
                >
                  Left-Aligned
                </button>
              </div>
            </div>

            <div className="editor-field-group">
              <div className="editor-switch-row">
                <label className="editor-field-label">Custom Logo Image</label>
                <span className="editor-field-badge">PNG Only</span>
              </div>

              {/* Hidden file input strictly accepting PNG */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,image/png"
                className="editor-file-input-hidden"
                onChange={handleLogoUpload}
              />

              {/* Error notification */}
              {logoError && (
                <div className="editor-logo-error-box">
                  <AlertCircle size={14} />
                  <span>{logoError}</span>
                </div>
              )}

              {editorState.logo_url ? (
                /* Logo Active Preview Card with checkerboard background */
                <div className="editor-logo-preview-card">
                  <div className="editor-logo-preview-checkerboard">
                    <img
                      src={editorState.logo_url}
                      alt="Store Logo"
                      className="editor-logo-preview-img"
                    />
                  </div>

                  <div className="editor-logo-actions-row">
                    <span className="editor-logo-status-tag">
                      <CheckCircle2 size={12} />
                      <span>PNG Logo Active</span>
                    </span>

                    <div className="editor-logo-btn-group">
                      <button
                        type="button"
                        className="editor-btn-secondary"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload a replacement PNG logo"
                      >
                        <UploadCloud size={12} />
                        <span>Replace</span>
                      </button>

                      <button
                        type="button"
                        className="editor-menu-delete-btn"
                        onClick={handleRemoveLogo}
                        title="Remove custom logo and restore typography name"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Upload Dropzone */
                <div
                  className="editor-logo-uploader-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to browse and upload your PNG logo"
                >
                  <div className="editor-logo-uploader-icon">
                    <UploadCloud size={16} />
                  </div>
                  <span className="editor-logo-uploader-title">
                    Upload Custom PNG Logo
                  </span>
                  <span className="editor-logo-uploader-hint">
                    PNG format only • Max 2MB • Transparent background recommended
                  </span>
                </div>
              )}

              {/* Optional URL toggle */}
              <div className="editor-switch-row">
                <button
                  type="button"
                  className="editor-btn-secondary"
                  onClick={() => setShowUrlFallback(prev => !prev)}
                >
                  <span>{showUrlFallback ? 'Hide URL input' : 'Or enter PNG image URL'}</span>
                </button>
              </div>

              {showUrlFallback && (
                <input
                  type="url"
                  className="editor-field-input"
                  value={editorState.logo_url || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !val.toLowerCase().includes('.png') && !val.startsWith('data:image/png')) {
                      setLogoError('Logo must be a PNG image (.png).');
                    } else {
                      setLogoError('');
                    }
                    updateState('logo_url', val);
                  }}
                  placeholder="https://.../logo.png"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Hero & Banner Section */}
      <div className={`editor-accordion-card ${focusedSection === 'hero' ? 'editor-accordion-card-focused' : ''}`}>
        <div className="editor-accordion-header" onClick={() => toggleSection('hero')}>
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Image size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Hero & Banner</div>
              <div className="editor-accordion-subtitle">{editorState.hero_headline || 'Main Cover'}</div>
            </div>
          </div>
          <div className="editor-accordion-actions">
            {focusedSection === 'hero' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>

        {focusedSection === 'hero' && (
          <div className="editor-accordion-body">
            <div className="editor-field-group">
              <label className="editor-field-label">Editorial Kicker (Sub-heading)</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.hero_kicker || ''}
                onChange={(e) => updateState('hero_kicker', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Hero Headline</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.hero_headline || ''}
                onChange={(e) => updateState('hero_headline', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Sub-Headline Tagline</label>
              <textarea
                className="editor-field-textarea"
                rows={2}
                value={editorState.hero_tagline || ''}
                onChange={(e) => updateState('hero_tagline', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Hero Background Image</label>
              <div className="editor-image-presets-grid">
                {HERO_PRESETS.map((p) => {
                  const isSelected = editorState.hero_image === p.url;
                  return (
                    <div
                      key={p.name}
                      className={`editor-image-preset-thumb ${isSelected ? 'editor-image-preset-thumb-active' : ''}`}
                      onClick={() => updateState('hero_image', p.url)}
                      title={p.name}
                    >
                      <img src={p.url} alt={p.name} />
                      {isSelected && (
                        <div className="editor-preset-check-badge">
                          <Check size={10} color="#ffffff" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <input
                type="url"
                className="editor-field-input"
                value={editorState.hero_image || ''}
                onChange={(e) => updateState('hero_image', e.target.value)}
                placeholder="Or paste custom image URL..."
              />
            </div>

            <div className="editor-field-group">
              <div className="editor-switch-row">
                <label className="editor-field-label">Dark Overlay Opacity</label>
                <span className="editor-field-badge">{Math.round((editorState.hero_overlay_opacity ?? 0.45) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.85"
                step="0.05"
                className="editor-range-slider"
                value={editorState.hero_overlay_opacity ?? 0.45}
                onChange={(e) => updateState('hero_overlay_opacity', parseFloat(e.target.value))}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Primary Call to Action Button</label>
              <div className="editor-color-input-row">
                <input
                  type="text"
                  className="editor-field-input"
                  value={editorState.hero_btn_text || 'DISCOVER COLLECTION'}
                  onChange={(e) => updateState('hero_btn_text', e.target.value)}
                  placeholder="Button Label"
                />
                <input
                  type="text"
                  className="editor-field-input"
                  value={editorState.hero_btn_link || '#collection'}
                  onChange={(e) => updateState('hero_btn_link', e.target.value)}
                  placeholder="#collection"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Catalog Grid Layout */}
      <div className={`editor-accordion-card ${focusedSection === 'catalog' ? 'editor-accordion-card-focused' : ''}`}>
        <div className="editor-accordion-header" onClick={() => toggleSection('catalog')}>
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Grid size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Catalog Grid & Lookbook</div>
              <div className="editor-accordion-subtitle">{editorState.catalog_columns || 4} Columns</div>
            </div>
          </div>
          <div className="editor-accordion-actions">
            {focusedSection === 'catalog' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>

        {focusedSection === 'catalog' && (
          <div className="editor-accordion-body">
            <div className="editor-field-group">
              <label className="editor-field-label">Desktop Column Count</label>
              <div className="editor-pill-select-group">
                {[2, 3, 4].map(cols => (
                  <button
                    key={cols}
                    type="button"
                    className={`editor-pill-select-btn ${editorState.catalog_columns === cols ? 'editor-pill-select-btn-active' : ''}`}
                    onClick={() => updateState('catalog_columns', cols)}
                  >
                    {cols} Columns
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-switch-row">
              <span className="editor-switch-label">Show "AI Virtual Try-On" Quick Hover Button</span>
              <button
                type="button"
                className={`editor-switch ${editorState.show_quick_tryon_btn !== false ? 'editor-switch-active' : ''}`}
                onClick={() => updateState('show_quick_tryon_btn', editorState.show_quick_tryon_btn === false)}
              >
                <div className="editor-switch-knob" />
              </button>
            </div>

            <div className="editor-switch-row">
              <span className="editor-switch-label">Show Color Swatches on Product Cards</span>
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

      {/* 5. Brand Story & Editorial */}
      <div className={`editor-accordion-card ${focusedSection === 'story' ? 'editor-accordion-card-focused' : ''}`}>
        <div className="editor-accordion-header" onClick={() => toggleSection('story')}>
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <BookOpen size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Brand Story & Heritage</div>
              <div className="editor-accordion-subtitle">{editorState.story_enabled ? 'Active block' : 'Hidden'}</div>
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
              title="Toggle story section"
            >
              <div className="editor-switch-knob" />
            </button>
            {focusedSection === 'story' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>

        {focusedSection === 'story' && (
          <div className="editor-accordion-body">
            <div className="editor-field-group">
              <label className="editor-field-label">Story Kicker</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.story_kicker || ''}
                onChange={(e) => updateState('story_kicker', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Headline Title</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.story_title || ''}
                onChange={(e) => updateState('story_title', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Narrative / Atelier Heritage</label>
              <textarea
                className="editor-field-textarea"
                rows={3}
                value={editorState.description || ''}
                onChange={(e) => updateState('description', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Featured Editorial Pull-Quote</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.story_quote || ''}
                onChange={(e) => updateState('story_quote', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 6. VIP Newsletter Section */}
      <div className={`editor-accordion-card ${focusedSection === 'newsletter' ? 'editor-accordion-card-focused' : ''}`}>
        <div className="editor-accordion-header" onClick={() => toggleSection('newsletter')}>
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Mail size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">VIP Capsule Newsletter</div>
              <div className="editor-accordion-subtitle">{editorState.newsletter_enabled ? 'Active block' : 'Hidden'}</div>
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
              title="Toggle newsletter section"
            >
              <div className="editor-switch-knob" />
            </button>
            {focusedSection === 'newsletter' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>

        {focusedSection === 'newsletter' && (
          <div className="editor-accordion-body">
            <div className="editor-field-group">
              <label className="editor-field-label">Headline Title</label>
              <input
                type="text"
                className="editor-field-input"
                value={editorState.newsletter_title || ''}
                onChange={(e) => updateState('newsletter_title', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Sub-Headline Offer</label>
              <textarea
                className="editor-field-textarea"
                rows={2}
                value={editorState.newsletter_subtitle || ''}
                onChange={(e) => updateState('newsletter_subtitle', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 7. Footer & Atelier Details */}
      <div className={`editor-accordion-card ${focusedSection === 'footer' ? 'editor-accordion-card-focused' : ''}`}>
        <div className="editor-accordion-header" onClick={() => toggleSection('footer')}>
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Phone size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Footer & Atelier Details</div>
              <div className="editor-accordion-subtitle">Support, Phone & Concierge</div>
            </div>
          </div>
          <div className="editor-accordion-actions">
            {focusedSection === 'footer' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>

        {focusedSection === 'footer' && (
          <div className="editor-accordion-body">
            <div className="editor-field-group">
              <label className="editor-field-label">Customer Concierge Email</label>
              <input
                type="email"
                className="editor-field-input"
                value={editorState.email || ''}
                onChange={(e) => updateState('email', e.target.value)}
              />
            </div>

            <div className="editor-field-group">
              <label className="editor-field-label">Concierge Phone / WhatsApp</label>
              <input
                type="tel"
                className="editor-field-input"
                value={editorState.phone || ''}
                onChange={(e) => updateState('phone', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
