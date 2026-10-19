"use client";
import React, { useMemo } from 'react';
import { Plus, Trash2, RotateCcw, Compass, Tags, Info } from 'lucide-react';
import { DEFAULT_NAV_MENU } from '@/lib/storefrontData';

export default function NavigationInspector({
  editorState,
  updateState,
  products = []
}) {
  const currentNavMenu = editorState.nav_menu || DEFAULT_NAV_MENU;

  const handleAddMenuItem = () => {
    updateState('nav_menu', [
      ...currentNavMenu,
      { id: `menu_${Date.now()}`, label: 'New Link', url: '#collection', type: 'anchor' }
    ]);
  };

  const handleUpdateMenuItem = (index, field, value) => {
    const updated = [...currentNavMenu];
    updated[index] = { ...updated[index], [field]: value };
    updateState('nav_menu', updated);
  };

  const handleRemoveMenuItem = (index) => {
    const updated = [...currentNavMenu];
    updated.splice(index, 1);
    updateState('nav_menu', updated);
  };

  const handleResetMenu = () => {
    updateState('nav_menu', DEFAULT_NAV_MENU);
  };

  // Detected Product Categories for Category Strip
  const detectedCategories = useMemo(() => {
    const cats = new Set();
    if (products && products.length > 0) {
      products.forEach(p => { if (p.category) cats.add(p.category); });
    }
    if (cats.size === 0) {
      ['Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Footwear'].forEach(c => cats.add(c));
    }
    return Array.from(cats);
  }, [products]);

  return (
    <div className="editor-sections-list">
      {/* 1. Header Navigation Menu Links Manager */}
      <div className="editor-accordion-card editor-accordion-card-focused">
        <div className="editor-accordion-header">
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Compass size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Header Navigation Links</div>
              <div className="editor-accordion-subtitle">{currentNavMenu.length} active menu links</div>
            </div>
          </div>
          <button
            type="button"
            className="editor-btn-secondary"
            onClick={handleResetMenu}
            title="Reset to default Atelier menu links"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        <div className="editor-accordion-body">
          <p className="editor-accordion-subtitle">
            Customize header navigation links. Target section anchors (e.g. <code>#collection</code>, <code>#about</code>) or external URLs.
          </p>

          <div className="editor-sections-list">
            {currentNavMenu.map((item, idx) => (
              <div key={item.id || idx} className="editor-menu-item-row">
                <input
                  type="text"
                  className="editor-menu-item-input"
                  value={item.label}
                  onChange={(e) => handleUpdateMenuItem(idx, 'label', e.target.value)}
                  placeholder="Link label"
                  title="Menu Item Label"
                />

                <select
                  className="editor-menu-item-select"
                  value={item.url}
                  onChange={(e) => handleUpdateMenuItem(idx, 'url', e.target.value)}
                  title="Destination Anchor or URL"
                >
                  <option value="#collection">Collection (#collection)</option>
                  <option value="#about">About Atelier (#about)</option>
                  <option value="#newsletter">VIP Newsletter (#newsletter)</option>
                  <option value="#footer">Footer / Contact (#footer)</option>
                  <option value="https://instagram.com">Instagram</option>
                  <option value="/merchant/contact">Custom URL</option>
                </select>

                <button
                  type="button"
                  className="editor-menu-delete-btn"
                  onClick={() => handleRemoveMenuItem(idx)}
                  title="Remove this link"
                  disabled={currentNavMenu.length <= 1}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="editor-menu-add-btn"
            onClick={handleAddMenuItem}
          >
            <Plus size={13} />
            <span>Add Navigation Link</span>
          </button>
        </div>
      </div>

      {/* 2. Dynamic Categories Filter Controls */}
      <div className="editor-accordion-card">
        <div className="editor-accordion-header">
          <div className="editor-accordion-title-wrap">
            <div className="editor-accordion-icon">
              <Tags size={14} />
            </div>
            <div>
              <div className="editor-accordion-label">Dynamic Categories Navigation</div>
              <div className="editor-accordion-subtitle">
                {editorState.show_category_tabs !== false ? 'Enabled on storefront' : 'Hidden'}
              </div>
            </div>
          </div>
          <div className="editor-accordion-actions">
            <button
              type="button"
              className={`editor-switch ${editorState.show_category_tabs !== false ? 'editor-switch-active' : ''}`}
              onClick={() => updateState('show_category_tabs', editorState.show_category_tabs === false)}
              title="Toggle category filter bar"
            >
              <div className="editor-switch-knob" />
            </button>
          </div>
        </div>

        <div className="editor-accordion-body">
          <div className="editor-field-group">
            <div className="editor-switch-row">
              <span className="editor-switch-label">Show Category Filter Pills</span>
              <span className="editor-field-badge">{detectedCategories.length} Categories Detected</span>
            </div>
            <p className="editor-accordion-subtitle">
              Categories are dynamically discovered from your live products catalog. Clicking any category tab on the storefront instantly filters the product grid.
            </p>
          </div>

          <div className="editor-field-group">
            <label className="editor-field-label">Discovered Store Categories</label>
            <div className="editor-category-chips-wrap">
              <span className="editor-cat-chip">All</span>
              {detectedCategories.map((cat) => (
                <span key={cat} className="editor-cat-chip">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
