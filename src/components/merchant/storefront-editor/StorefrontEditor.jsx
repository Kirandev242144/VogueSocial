"use client";
import React, { useState, useEffect } from 'react';
import {
  Monitor, Tablet, Smartphone, ExternalLink, Check, Save,
  RefreshCw, CheckCircle2, RotateCcw, Eye, Sliders, Globe, Loader2
} from 'lucide-react';
import StorefrontInspector from './StorefrontInspector';
import StorefrontLiveCanvas from './StorefrontLiveCanvas';
import './StorefrontEditor.css';
import { storeService } from '@/services/storeService';
import { DEFAULT_MERCHANT_STORE, verifyDomainDNS } from '@/lib/storefrontData';

export default function StorefrontEditor({
  initialSettings = {},
  vendorId = 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c',
  handle = 'studiolabel',
  onSaved
}) {
  // Navigation & Inspector state
  const [activeTab, setActiveTab] = useState('sections'); // 'sections' | 'theme' | 'domains'
  const [focusedSection, setFocusedSection] = useState('hero'); // 'announcement' | 'header' | 'hero' | 'catalog' | 'story' | 'newsletter' | 'footer'
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [previewMode, setPreviewMode] = useState('canvas'); // 'canvas' | 'iframe'

  // Primary Customizer State
  const [editorState, setEditorState] = useState(() => ({
    store_name: initialSettings.store_name || initialSettings.storeName || 'Studio Label Paris',
    store_handle: initialSettings.store_handle || initialSettings.storeHandle || handle,
    subdomain: initialSettings.subdomain || handle,
    custom_domain: initialSettings.custom_domain || initialSettings.customDomain || 'shop.studiolabelparis.com',
    template: initialSettings.template || 'modern',
    accent_color: initialSettings.accent_color || initialSettings.accentColor || '#2563eb',
    tagline: initialSettings.tagline || 'Modern Tailoring & AI Virtual Fitting Studio',
    description: initialSettings.description || 'Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Every garment in our collection is precision-crafted from sustainably sourced European textiles and optimized for zero-latency in-browser virtual try-on.',
    hero_image: initialSettings.hero_image || initialSettings.heroImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    hero_kicker: initialSettings.hero_kicker || 'N° 26 · AUTUMN / WINTER EDITORIAL',
    hero_headline: initialSettings.hero_headline || initialSettings.store_name || 'Studio Label Paris',
    hero_tagline: initialSettings.hero_tagline || initialSettings.tagline || 'Modern Tailoring & AI Virtual Fitting Studio',
    hero_overlay_opacity: initialSettings.hero_overlay_opacity ?? 0.45,
    hero_btn_text: initialSettings.hero_btn_text || 'DISCOVER COLLECTION',
    hero_btn_link: initialSettings.hero_btn_link || '#collection',
    announcement_enabled: initialSettings.announcement_enabled !== false,
    announcement_text: initialSettings.announcement_text || 'COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING OVER $200',
    announcement_bg: initialSettings.announcement_bg || '#111827',
    header_layout: initialSettings.header_layout || 'centered',
    catalog_columns: initialSettings.catalog_columns || 4,
    show_quick_tryon_btn: initialSettings.show_quick_tryon_btn !== false,
    show_color_swatches: initialSettings.show_color_swatches !== false,
    story_enabled: initialSettings.story_enabled !== false,
    story_kicker: initialSettings.story_kicker || 'ATELIER HERITAGE',
    story_title: initialSettings.story_title || 'Architectural Silhouettes & Sustainable Craft',
    story_quote: initialSettings.story_quote || 'Where haute couture precision meets browser-native neural fitting.',
    newsletter_enabled: initialSettings.newsletter_enabled !== false,
    newsletter_title: initialSettings.newsletter_title || 'JOIN THE ATELIER CIRCLE',
    newsletter_subtitle: initialSettings.newsletter_subtitle || 'Receive seasonal capsule previews and private fitting trunk shows.',
    font_pairing: initialSettings.font_pairing || 'playfair-montserrat',
    border_radius: initialSettings.border_radius || 'soft',
    email: initialSettings.email || 'concierge@studiolabelparis.com',
    phone: initialSettings.phone || '+33 1 42 68 55 00',
    logo_url: initialSettings.logo_url || initialSettings.logoUrl || ''
  }));

  // Sync state if initialSettings changes asynchronously
  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      setEditorState(prev => ({
        ...prev,
        ...initialSettings,
        store_name: initialSettings.store_name || initialSettings.storeName || prev.store_name,
        hero_headline: initialSettings.hero_headline || initialSettings.store_name || prev.hero_headline,
        subdomain: initialSettings.subdomain || initialSettings.store_handle || prev.subdomain,
        custom_domain: initialSettings.custom_domain || initialSettings.customDomain || prev.custom_domain
      }));
    }
  }, [initialSettings]);

  // Domain state
  const [domainState, setDomainState] = useState({
    subdomain: editorState.subdomain,
    custom_domain: editorState.custom_domain
  });

  useEffect(() => {
    setDomainState({
      subdomain: editorState.subdomain,
      custom_domain: editorState.custom_domain
    });
  }, [editorState.subdomain, editorState.custom_domain]);

  const updateDomainState = (key, value) => {
    setDomainState(prev => ({ ...prev, [key]: value }));
    setEditorState(prev => ({ ...prev, [key]: value }));
  };

  const updateState = (key, value) => {
    setEditorState(prev => ({
      ...prev,
      [key]: value,
      // If store_name changes and hero_headline matched previous store_name, sync them
      ...(key === 'store_name' && prev.hero_headline === prev.store_name ? { hero_headline: value } : {})
    }));
  };

  // Saving state & feedback
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [dnsChecking, setDnsChecking] = useState(false);

  const handleSaveAndPublish = async () => {
    setSaving(true);
    const cleanSubdomain = (domainState.subdomain || editorState.subdomain || 'studiolabel').trim().toLowerCase();

    const payload = {
      ...editorState,
      vendorId: vendorId,
      store_name: editorState.store_name,
      store_handle: cleanSubdomain,
      subdomain: cleanSubdomain,
      custom_domain: (domainState.custom_domain || editorState.custom_domain || '').trim(),
      domain_status: (domainState.custom_domain || editorState.custom_domain || '').trim() ? 'ssl_active' : 'not_connected',
      status: 'live'
    };

    try {
      await storeService.saveWebsiteSettings(payload);
      if (onSaved) onSaved(payload);
    } catch (err) {
      console.warn('Error saving website settings:', err);
    } finally {
      setSaving(false);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset storefront customization to default boutique settings?')) {
      setEditorState({
        ...DEFAULT_MERCHANT_STORE,
        hero_kicker: 'N° 26 · AUTUMN / WINTER EDITORIAL',
        hero_headline: DEFAULT_MERCHANT_STORE.store_name,
        hero_tagline: DEFAULT_MERCHANT_STORE.tagline,
        hero_overlay_opacity: 0.45,
        hero_btn_text: 'DISCOVER COLLECTION',
        hero_btn_link: '#collection',
        announcement_enabled: true,
        announcement_text: 'COMPLIMENTARY WORLDWIDE EXPRESS SHIPPING OVER $200',
        announcement_bg: '#111827',
        header_layout: 'centered',
        catalog_columns: 4,
        show_quick_tryon_btn: true,
        show_color_swatches: true,
        story_enabled: true,
        story_kicker: 'ATELIER HERITAGE',
        story_title: 'Architectural Silhouettes & Sustainable Craft',
        story_quote: 'Where haute couture precision meets browser-native neural fitting.',
        newsletter_enabled: true,
        newsletter_title: 'JOIN THE ATELIER CIRCLE',
        newsletter_subtitle: 'Receive seasonal capsule previews and private fitting trunk shows.',
        font_pairing: 'playfair-montserrat',
        border_radius: 'soft'
      });
    }
  };

  const handleVerifyDNS = async () => {
    setDnsChecking(true);
    await new Promise(r => setTimeout(r, 1200));
    await verifyDomainDNS(domainState.custom_domain || 'shop.studiolabelparis.com', editorState);
    setDnsChecking(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const isLocalDev = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname.endsWith('.localhost') ||
    window.location.hostname === '127.0.0.1'
  );
  const portSuffix = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : ':3001';
  const cleanHandle = (editorState.subdomain || 'studiolabel').toLowerCase();
  const liveUrl = isLocalDev
    ? `http://${cleanHandle}.localhost${portSuffix}`
    : `https://${cleanHandle}.voguesocial.com`;
  const storePreviewUrl = `/store/${cleanHandle}?embedded=true&t=${Date.now()}`;

  return (
    <div className="storefront-editor-root">
      {/* ── Top Bar ── */}
      <header className="editor-topbar">
        <div className="editor-topbar-left">
          <div className="editor-store-avatar">
            {(editorState.store_name || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="editor-store-info">
            <div className="editor-store-title-row">
              <h2 className="editor-store-title">{editorState.store_name}</h2>
              <span className="editor-status-badge">
                <span className="editor-status-dot" />
                <span>Live Storefront</span>
              </span>
            </div>
            <span className="editor-store-subtitle">
              {editorState.subdomain}.voguesocial.com · {editorState.template.toUpperCase()} Theme
            </span>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="editor-topbar-center">
          <div className="editor-viewport-group">
            <button
              type="button"
              className={`editor-viewport-btn ${viewport === 'desktop' ? 'editor-viewport-btn-active' : ''}`}
              onClick={() => setViewport('desktop')}
              title="Desktop View (1200px)"
            >
              <Monitor size={14} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              className={`editor-viewport-btn ${viewport === 'tablet' ? 'editor-viewport-btn-active' : ''}`}
              onClick={() => setViewport('tablet')}
              title="Tablet View (768px)"
            >
              <Tablet size={14} />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              className={`editor-viewport-btn ${viewport === 'mobile' ? 'editor-viewport-btn-active' : ''}`}
              onClick={() => setViewport('mobile')}
              title="Mobile View (375px)"
            >
              <Smartphone size={14} />
              <span>Mobile</span>
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="editor-viewport-group" style={{ marginLeft: 6 }}>
            <button
              type="button"
              className={`editor-viewport-btn ${previewMode === 'canvas' ? 'editor-viewport-btn-active' : ''}`}
              onClick={() => setPreviewMode('canvas')}
              title="Real-Time Interactive Canvas"
            >
              <Sliders size={13} />
              <span>Interactive</span>
            </button>
            <button
              type="button"
              className={`editor-viewport-btn ${previewMode === 'iframe' ? 'editor-viewport-btn-active' : ''}`}
              onClick={() => setPreviewMode('iframe')}
              title="Subdomain Iframe Preview"
            >
              <Eye size={13} />
              <span>Iframe</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="editor-topbar-right">
          <button
            type="button"
            className="editor-btn-secondary"
            onClick={handleResetDefaults}
            title="Reset theme and sections to defaults"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="editor-btn-secondary"
            title="Open live storefront in new browser tab"
          >
            <ExternalLink size={13} />
            <span>Visit Live</span>
          </a>

          <button
            type="button"
            className="editor-btn-primary"
            onClick={handleSaveAndPublish}
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </header>

      {/* ── Main Workspace: Left Inspector + Right Live Canvas ── */}
      <div className="editor-workspace">
        <StorefrontInspector
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          editorState={editorState}
          updateState={updateState}
          focusedSection={focusedSection}
          setFocusedSection={setFocusedSection}
          domainState={domainState}
          updateDomainState={updateDomainState}
          onVerifyDNS={handleVerifyDNS}
          dnsChecking={dnsChecking}
        />

        <StorefrontLiveCanvas
          editorState={editorState}
          viewport={viewport}
          onSelectSection={(secId) => {
            setActiveTab('sections');
            setFocusedSection(secId);
          }}
          focusedSection={focusedSection}
          previewMode={previewMode}
          storePreviewUrl={storePreviewUrl}
        />
      </div>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="editor-toast">
          <CheckCircle2 size={16} color="#4ade80" />
          <span>Storefront published live successfully!</span>
        </div>
      )}
    </div>
  );
}
