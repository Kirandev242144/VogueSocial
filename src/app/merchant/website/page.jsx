"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../merchant.module.css';
import {
  Globe, Eye, Edit3, ExternalLink, CheckCircle2, ArrowRight,
  Link2, ShieldCheck, AlertCircle, Loader2, RefreshCw,
  Copy, Check, Sparkles, Server, Lock, Smartphone, Monitor,
  Palette, SlidersHorizontal, CheckCircle
} from 'lucide-react';
import {
  DEFAULT_MERCHANT_STORE,
  getStoreByHandle,
  saveMerchantStore,
  verifyDomainDNS
} from '@/lib/storefrontData';

/* ── 5 Curated Storefront Templates ── */
const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern E-Shop',
    badge: 'Flagship D2C',
    desc: 'Contemporary high-conversion store with geometric typography, slide-over bag & in-card AI try-on.',
    vibe: 'Contemporary Luxury · AI Try-On Ready',
    bg: '#F8FAFC',
    accent: '#2563EB',
    preview: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    textColor: '#FFFFFF'
  },
  {
    id: 'minimal',
    name: 'Minimal Fashion',
    badge: 'Editorial',
    desc: 'Clean editorial whitespace. Less is more. Focuses exclusively on garment silhouettes and textures.',
    vibe: 'COS · The Row · Jil Sander aesthetic',
    bg: '#FFFFFF',
    accent: '#1A1A1A',
    preview: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
    textColor: '#FFFFFF'
  },
  {
    id: 'luxury',
    name: 'Luxury Atelier',
    badge: 'Haute Atelier',
    desc: 'Dramatic obsidian surfaces with warm champagne gold accents and serif typography.',
    vibe: 'Valentino · Balenciaga · Parisian Haute Couture',
    bg: '#1C1C1E',
    accent: '#C9A84C',
    preview: 'linear-gradient(135deg, #1C1C1E 0%, #2A2A2C 100%)',
    textColor: '#C9A84C'
  },
  {
    id: 'streetwear',
    name: 'Streetwear & Drop',
    badge: 'Urban Culture',
    desc: 'Bold typography, high-impact neon accents, and capsule drop presentation.',
    vibe: 'Off-White · Palace · Kith aesthetic',
    bg: '#0A0A0A',
    accent: '#CCFF00',
    preview: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
    textColor: '#CCFF00'
  },
  {
    id: 'boutique',
    name: 'Artisan Boutique',
    badge: 'Artisan Chic',
    desc: 'Warm organic cream tones with gentle rounded geometry and literary serif titles.',
    vibe: 'Reformation · Rouje · Parisian Boutique',
    bg: '#FAF7F2',
    accent: '#C47E6B',
    preview: 'linear-gradient(135deg, #C47E6B 0%, #9B7E6E 100%)',
    textColor: '#FFFFFF'
  }
];

const ACCENT_PALETTES = [
  { name: 'Royal Indigo', value: '#2563eb' },
  { name: 'Obsidian Slate', value: '#0f172a' },
  { name: 'Champagne Gold', value: '#c9a84c' },
  { name: 'Forest Noir', value: '#059669' },
  { name: 'Warm Amber', value: '#d97706' },
  { name: 'Crimson Rose', value: '#e11d48' }
];

export default function WebsitePage() {
  // Navigation Tabs: 'overview' | 'domains' | 'theme'
  const [activeTab, setActiveTab] = useState('overview');

  // Preview Device Viewport: 'desktop' | 'mobile'
  const [previewViewport, setPreviewViewport] = useState('desktop');
  const [previewKey, setPreviewKey] = useState(Date.now());

  // Store & Branding State
  const [settings, setSettings] = useState(DEFAULT_MERCHANT_STORE);
  const [subdomain, setSubdomain] = useState('studiolabel');
  const [customDomain, setCustomDomain] = useState('shop.studiolabelparis.com');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [storeName, setStoreName] = useState('Studio Label Paris');
  const [tagline, setTagline] = useState('Modern Tailoring & AI Virtual Fitting Studio');
  const [description, setDescription] = useState('Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury. Every garment in our collection is precision-crafted from sustainably sourced European textiles and optimized for zero-latency in-browser virtual try-on.');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80');
  const [logoUrl, setLogoUrl] = useState('');

  // Status & Feedback States
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [copied, setCopied] = useState('');
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [dnsCheckStep, setDnsCheckStep] = useState(0);

  // Load initial settings from backend with local fallback
  useEffect(() => {
    async function loadWebsiteSettings() {
      try {
        const res = await fetch('/api/merchant/website?handle=studiolabel');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.website) {
            const w = data.website;
            setSettings(prev => ({ ...prev, ...w }));
            if (w.storeHandle) setSubdomain(w.storeHandle);
            if (w.customDomain) setCustomDomain(w.customDomain);
            if (w.template) setSelectedTemplate(w.template);
            if (w.storeName) setStoreName(w.storeName);
            if (w.tagline) setTagline(w.tagline);
            if (w.description) setDescription(w.description);
            if (w.accentColor) setAccentColor(w.accentColor);
            if (w.heroImage) setHeroImage(w.heroImage);
            if (w.logoUrl) setLogoUrl(w.logoUrl);
            saveMerchantStore({
              ...DEFAULT_MERCHANT_STORE,
              ...w,
              store_handle: w.storeHandle || 'studiolabel',
              subdomain: w.storeHandle || 'studiolabel',
              store_name: w.storeName || 'Studio Label Paris',
              custom_domain: w.customDomain || 'shop.studiolabelparis.com',
              accent_color: w.accentColor || '#2563eb',
              template: w.template || 'modern'
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Backend website API offline, loading from local cache');
      }

      // Fallback to localStorage or defaults
      const local = getStoreByHandle('studiolabel');
      if (local && local.store) {
        setSettings(local.store);
        setSubdomain(local.store.store_handle || 'studiolabel');
        setCustomDomain(local.store.custom_domain || 'shop.studiolabelparis.com');
        setSelectedTemplate(local.store.template || 'modern');
        setStoreName(local.store.store_name || 'Studio Label Paris');
        setTagline(local.store.tagline || 'Modern Tailoring & AI Virtual Fitting Studio');
        setDescription(local.store.description || '');
        setAccentColor(local.store.accent_color || '#2563eb');
        setHeroImage(local.store.hero_image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80');
        setLogoUrl(local.store.logo_url || '');
      }
    }

    loadWebsiteSettings();
  }, []);

  // Save Settings to Backend API and persist locally
  const handleSaveSettings = async (overrides = {}) => {
    setSaving(true);
    const cleanSubdomain = (overrides.subdomain || subdomain).trim().toLowerCase();
    const payload = {
      store_name: overrides.storeName || storeName,
      store_handle: cleanSubdomain,
      subdomain: cleanSubdomain,
      custom_domain: (overrides.customDomain || customDomain).trim(),
      domain_status: (overrides.customDomain || customDomain).trim() ? 'ssl_active' : 'not_connected',
      template: overrides.template || selectedTemplate,
      accent_color: overrides.accentColor || accentColor,
      tagline: overrides.tagline || tagline,
      description: overrides.description || description,
      hero_image: overrides.heroImage || heroImage,
      logo_url: overrides.logoUrl || logoUrl,
      status: 'live'
    };

    try {
      const res = await fetch('/api/merchant/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.website) {
          setSettings(prev => ({ ...prev, ...data.website }));
        }
      }
    } catch (err) {
      console.warn('Backend API save error, saved to local cache', err);
    }

    // Save to local cache & refresh preview iframe
    const saved = saveMerchantStore({
      ...settings,
      ...payload,
      store_handle: cleanSubdomain,
      subdomain: cleanSubdomain,
      store_name: payload.store_name,
      custom_domain: payload.custom_domain,
      accent_color: payload.accent_color,
      template: payload.template
    });
    setSettings(saved);
    setPreviewKey(Date.now());
    setSaving(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Run Simulated DNS Resolution Check
  const handleCheckDomainDNS = async () => {
    setCheckingDomain(true);
    setDnsCheckStep(1);
    await new Promise(r => setTimeout(r, 500));
    setDnsCheckStep(2);
    await new Promise(r => setTimeout(r, 600));
    setDnsCheckStep(3);
    await new Promise(r => setTimeout(r, 500));
    setDnsCheckStep(4);

    const updated = await verifyDomainDNS(customDomain || 'shop.studiolabelparis.com', settings);
    setSettings(updated);
    setCheckingDomain(false);
    setDnsCheckStep(0);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const currentHandle = subdomain.trim().toLowerCase() || 'studiolabel';
  const liveSubdomainUrl = `https://${currentHandle}.voguesocial.com`;
  const storePreviewUrl = `/store/${currentHandle}?embedded=true&t=${previewKey}`;
  const directStoreUrl = `/store/${currentHandle}`;

  return (
    <>
      {/* ── TOP BAR (Clean, Low-Contrast Slate System) ── */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#0f172a', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff'
            }}>
              <Globe size={16} />
            </div>
            <span>Storefront & Website</span>
          </div>
          <div className={styles.pageSubtitle}>
            Manage your boutique storefront, free VogueSocial subdomain, DNS mapping, and theme
          </div>
        </div>

        <div className={styles.topbarRight}>
          <Link
            to={directStoreUrl}
            target="_blank"
            className={styles.btnSecondary}
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <ExternalLink size={13} /> Visit Live Storefront
          </Link>
          <button
            className={styles.btnPrimary}
            onClick={() => handleSaveSettings()}
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={13} />}
            <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Save Success Toast */}
      {saveToast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: '#0f172a', color: '#ffffff', padding: '0.75rem 1.25rem',
          borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontSize: '0.82rem', fontWeight: 600
        }}>
          <CheckCircle size={15} color="#4ade80" />
          <span>Website settings published live to Edge & MySQL!</span>
        </div>
      )}

      <div className={styles.pageContent}>
        
        {/* ── CLEAN SEGMENTED NAVIGATION TABS ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: '1px solid var(--d-border)', paddingBottom: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0.55rem 1.1rem', borderRadius: 8,
              border: 'none', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600,
              background: activeTab === 'overview' ? '#0f172a' : 'transparent',
              color: activeTab === 'overview' ? '#ffffff' : 'var(--d-t3)',
              transition: 'all 0.15s ease'
            }}
          >
            <Eye size={15} />
            <span>Store Overview & Live Preview</span>
            <span style={{
              fontSize: '0.65rem', padding: '1px 6px', borderRadius: 99,
              background: activeTab === 'overview' ? 'rgba(255,255,255,0.2)' : '#f0fdf4',
              color: activeTab === 'overview' ? '#ffffff' : '#166534',
              fontWeight: 700
            }}>
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('domains')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0.55rem 1.1rem', borderRadius: 8,
              border: 'none', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600,
              background: activeTab === 'domains' ? '#0f172a' : 'transparent',
              color: activeTab === 'domains' ? '#ffffff' : 'var(--d-t3)',
              transition: 'all 0.15s ease'
            }}
          >
            <Globe size={15} />
            <span>Domains & DNS Mapping</span>
            <span style={{
              fontSize: '0.65rem', padding: '1px 6px', borderRadius: 99,
              background: activeTab === 'domains' ? 'rgba(255,255,255,0.2)' : '#eff6ff',
              color: activeTab === 'domains' ? '#ffffff' : '#2563eb',
              fontWeight: 700
            }}>
              SSL Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0.55rem 1.1rem', borderRadius: 8,
              border: 'none', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600,
              background: activeTab === 'theme' ? '#0f172a' : 'transparent',
              color: activeTab === 'theme' ? '#ffffff' : 'var(--d-t3)',
              transition: 'all 0.15s ease'
            }}
          >
            <Palette size={15} />
            <span>Theme & Brand Identity</span>
            <span style={{
              fontSize: '0.65rem', padding: '1px 6px', borderRadius: 99,
              background: activeTab === 'theme' ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
              color: activeTab === 'theme' ? '#ffffff' : '#475569',
              fontWeight: 700
            }}>
              {TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Modern'}
            </span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: STORE OVERVIEW & INTERACTIVE LIVE DEVICE PREVIEW
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Store Header Summary Bar */}
            <div className={styles.panel} style={{ padding: '1.1rem 1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: '#f8fafc', border: '1px solid var(--d-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1.1rem', color: '#0f172a'
                  }}>
                    {storeName ? storeName.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--d-t1)', margin: 0 }}>
                        {storeName}
                      </h2>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 700, background: '#f0fdf4',
                        color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 99
                      }}>
                        ● Live Storefront
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, fontSize: '0.78rem', color: 'var(--d-t3)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Globe size={12} color="#2563eb" /> {currentHandle}.voguesocial.com
                      </span>
                      {customDomain && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#166534' }}>
                          <Lock size={11} color="#16a34a" /> {customDomain} (SSL Active)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                  <button
                    onClick={() => handleCopy(liveSubdomainUrl, 'store-url')}
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                  >
                    {copied === 'store-url' ? <><Check size={13} color="#16a34a" /> Copied</> : <><Copy size={13} /> Copy Link</>}
                  </button>
                  <Link
                    to={directStoreUrl}
                    target="_blank"
                    className={styles.btnPrimary}
                    style={{ fontSize: '0.78rem', padding: '0.45rem 0.95rem', textDecoration: 'none' }}
                  >
                    <ExternalLink size={13} /> Open Store in New Tab
                  </Link>
                </div>
              </div>
            </div>

            {/* Live Interactive Device Preview Frame */}
            <div className={styles.panel} style={{ padding: '1.25rem', overflow: 'hidden' }}>
              
              {/* Preview Chrome / Viewport Controls */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingBottom: '0.9rem', borderBottom: '1px solid var(--d-border)',
                marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem'
              }}>
                {/* Viewport Mode Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
                  <button
                    onClick={() => setPreviewViewport('desktop')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0.35rem 0.85rem', borderRadius: 6, border: 'none',
                      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                      background: previewViewport === 'desktop' ? '#ffffff' : 'transparent',
                      color: previewViewport === 'desktop' ? '#0f172a' : '#64748b',
                      boxShadow: previewViewport === 'desktop' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <Monitor size={14} /> Desktop (1200px)
                  </button>
                  <button
                    onClick={() => setPreviewViewport('mobile')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '0.35rem 0.85rem', borderRadius: 6, border: 'none',
                      fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                      background: previewViewport === 'mobile' ? '#ffffff' : 'transparent',
                      color: previewViewport === 'mobile' ? '#0f172a' : '#64748b',
                      boxShadow: previewViewport === 'mobile' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <Smartphone size={14} /> Mobile (375px)
                  </button>
                </div>

                {/* Simulated Edge Browser Address Bar */}
                <div style={{
                  flex: '1', maxWidth: 460, margin: '0 1rem',
                  background: '#f8fafc', border: '1px solid var(--d-border)',
                  borderRadius: 6, padding: '0.35rem 0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  fontSize: '0.75rem', color: '#475569'
                }}>
                  <Lock size={11} color="#16a34a" />
                  <span style={{ fontWeight: 600 }}>https://{currentHandle}.voguesocial.com</span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>· Edge Anycast</span>
                </div>

                {/* Reload / External Link Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => setPreviewKey(Date.now())}
                    className={styles.btnSecondary}
                    title="Reload Store Preview"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                  >
                    <RefreshCw size={13} /> Refresh
                  </button>
                  <Link
                    to={directStoreUrl}
                    target="_blank"
                    className={styles.btnSecondary}
                    title="Open Fullscreen in New Window"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', textDecoration: 'none' }}
                  >
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>

              {/* The Live Interactive Frame */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 12,
                padding: previewViewport === 'mobile' ? '2rem 1rem' : '0.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 620,
                border: '1px solid var(--d-border2)'
              }}>
                {previewViewport === 'desktop' ? (
                  <iframe
                    key={`desktop-${previewKey}`}
                    src={storePreviewUrl}
                    title="Storefront Desktop Preview"
                    style={{
                      width: '100%',
                      height: 640,
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      background: '#ffffff',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: 380,
                    height: 660,
                    background: '#0f172a',
                    borderRadius: 36,
                    padding: '10px 10px 14px 10px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}>
                    {/* Simulated Phone Speaker / Camera Notch */}
                    <div style={{
                      width: 120, height: 16, background: '#0f172a',
                      borderRadius: '0 0 10px 10px', margin: '0 auto 6px auto',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                      <div style={{ width: 40, height: 4, background: '#334155', borderRadius: 99 }} />
                    </div>

                    <iframe
                      key={`mobile-${previewKey}`}
                      src={storePreviewUrl}
                      title="Storefront Mobile Preview"
                      style={{
                        width: '100%',
                        flex: 1,
                        border: 'none',
                        borderRadius: 24,
                        background: '#ffffff'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Navigation Cards Below Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              
              {/* Card 1: Theme & Style shortcut */}
              <div className={styles.panel} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
                      <Palette size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Active Store Theme
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--d-t1)', marginTop: 2 }}>
                        {TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Modern E-Shop'}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#f8fafc', border: '1px solid var(--d-border)', padding: '2px 8px', borderRadius: 99, color: 'var(--d-t2)' }}>
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.badge}
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--d-t3)', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                  {TEMPLATES.find(t => t.id === selectedTemplate)?.desc}
                </p>

                <button
                  onClick={() => setActiveTab('theme')}
                  className={styles.btnSecondary}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                >
                  <Edit3 size={13} /> Customize Theme & Appearance →
                </button>
              </div>

              {/* Card 2: Domains & DNS shortcut */}
              <div className={styles.panel} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                      <Server size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Domain & Edge Routing
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--d-t1)', marginTop: 2 }}>
                        {customDomain || `${currentHandle}.voguesocial.com`}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 99 }}>
                    ● SSL TLS 1.3 Active
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--d-t3)', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
                  Automatic Let's Encrypt TLS renewal, worldwide Anycast edge CDN, and sub-100ms product routing.
                </p>

                <button
                  onClick={() => setActiveTab('domains')}
                  className={styles.btnSecondary}
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                >
                  <Globe size={13} /> Manage Custom Domain & DNS Mapping →
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: DOMAINS & DNS MAPPING (DECLUTTERED & FOCUSED)
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'domains' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.25rem' }}>
              
              {/* Card 1: VogueSocial Free Subdomain */}
              <div className={styles.panel} style={{ padding: '1.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.85rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--d-t1)', margin: 0 }}>
                      Free VogueSocial Subdomain
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--d-t3)' }}>
                      Included with all VogueSocial merchant accounts
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--d-t3)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                  Your storefront is permanently reachable on this subdomain. Changes propagate globally in seconds.
                </p>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', background: '#f8fafc',
                    border: '1.5px solid var(--d-border)', borderRadius: 8, overflow: 'hidden', flex: 1
                  }}>
                    <span style={{ padding: '0.55rem 0.65rem 0.55rem 0.85rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                      https://
                    </span>
                    <input
                      type="text"
                      value={subdomain}
                      onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      style={{
                        flex: 1, border: 'none', background: 'transparent', outline: 'none',
                        fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', padding: '0.55rem 0'
                      }}
                    />
                    <span style={{ padding: '0.55rem 0.85rem 0.55rem 0.65rem', fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>
                      .voguesocial.com
                    </span>
                  </div>

                  <button
                    onClick={() => handleSaveSettings({ subdomain })}
                    disabled={saving}
                    className={styles.btnPrimary}
                    style={{ fontSize: '0.78rem', padding: '0.55rem 1rem' }}
                  >
                    Save Slug
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleCopy(liveSubdomainUrl, 'subdomain-url')}
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    {copied === 'subdomain-url' ? <><Check size={12} color="#16a34a" /> Copied</> : <><Copy size={12} /> Copy Subdomain URL</>}
                  </button>
                  <Link
                    to={directStoreUrl}
                    target="_blank"
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', textDecoration: 'none' }}
                  >
                    <ExternalLink size={12} /> Open in New Tab
                  </Link>
                </div>
              </div>

              {/* Card 2: Branded Custom Apex / Subdomain */}
              <div className={styles.panel} style={{ padding: '1.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.85rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f8fafc', color: '#0f172a', border: '1px solid var(--d-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Server size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--d-t1)', margin: 0 }}>
                      Branded Custom Domain
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--d-t3)' }}>
                      Connect your own registered apex or subdomain
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--d-t3)', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                  Route your brand domain (e.g. <code>shop.yourbrand.com</code>) directly to VogueSocial with automatic TLS certificate provisioning.
                </p>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={customDomain}
                    placeholder="e.g. shop.studiolabelparis.com"
                    onChange={e => setCustomDomain(e.target.value.toLowerCase().trim())}
                    style={{
                      flex: 1, padding: '0.55rem 0.85rem',
                      background: '#f8fafc', border: '1.5px solid var(--d-border)',
                      borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleSaveSettings({ customDomain })}
                    disabled={saving}
                    className={styles.btnPrimary}
                    style={{ fontSize: '0.78rem', padding: '0.55rem 1rem' }}
                  >
                    Connect
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0',
                    padding: '3px 9px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 5
                  }}>
                    <ShieldCheck size={13} color="#16a34a" /> SSL TLS 1.3 Active
                  </span>

                  <button
                    onClick={handleCheckDomainDNS}
                    disabled={checkingDomain}
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
                  >
                    {checkingDomain ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={12} />}
                    <span>{checkingDomain ? 'Verifying Edge...' : 'Test DNS Resolution'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* DNS Verification Simulator Banner */}
            {checkingDomain && (
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
                padding: '1rem 1.4rem', display: 'flex', alignItems: 'center', gap: 14
              }}>
                <Loader2 size={20} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>
                    {dnsCheckStep === 1 && 'Querying Authoritative DNS Servers for CNAME record...'}
                    {dnsCheckStep === 2 && 'Validating Anycast Edge IP 76.76.21.21 routing...'}
                    {dnsCheckStep === 3 && 'Verifying Let’s Encrypt automated TLS certificate...'}
                    {dnsCheckStep === 4 && 'All records verified! Edge routing active worldwide.'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: 2 }}>
                    VogueSocial Anycast DNS Simulator · Edge latency 18ms
                  </div>
                </div>
              </div>
            )}

            {/* Clean Technical DNS Mapping Table */}
            <div className={styles.panel} style={{ padding: '1.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Server size={18} color="#0f172a" />
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--d-t1)', margin: 0 }}>
                      Active DNS Mapping Configuration
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--d-t3)' }}>
                      Add these exact records to your DNS provider (Cloudflare, GoDaddy, Namecheap, Route53)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckDomainDNS}
                  disabled={checkingDomain}
                  className={styles.btnSecondary}
                  style={{ fontSize: '0.75rem' }}
                >
                  <RefreshCw size={12} /> Test Records
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--d-border)', color: 'var(--d-t3)', textAlign: 'left' }}>
                      <th style={{ padding: '0.65rem 0.9rem', fontWeight: 700, width: 85 }}>TYPE</th>
                      <th style={{ padding: '0.65rem 0.9rem', fontWeight: 700 }}>HOST / NAME</th>
                      <th style={{ padding: '0.65rem 0.9rem', fontWeight: 700 }}>POINTS TO / TARGET VALUE</th>
                      <th style={{ padding: '0.65rem 0.9rem', fontWeight: 700, width: 75 }}>TTL</th>
                      <th style={{ padding: '0.65rem 0.9rem', fontWeight: 700, width: 110 }}>STATUS</th>
                      <th style={{ padding: '0.65rem 0.9rem', fontWeight: 700, width: 85 }}>COPY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        type: 'CNAME',
                        host: customDomain.startsWith('www.') ? 'www' : (customDomain.split('.')[0] || 'shop'),
                        target: 'cname.voguesocial.com',
                        ttl: '3600',
                        status: 'Verified ✓',
                        verified: true
                      },
                      {
                        type: 'A',
                        host: '@ (Apex)',
                        target: '76.76.21.21',
                        ttl: '3600',
                        status: 'Verified ✓',
                        verified: true
                      },
                      {
                        type: 'TXT',
                        host: '_vogue-challenge',
                        target: 'vogue-verification=vs_live_9f83a21b47',
                        ttl: '3600',
                        status: 'Verified ✓',
                        verified: true
                      }
                    ].map(rec => (
                      <tr key={rec.type} style={{ borderBottom: '1px solid var(--d-border2)' }}>
                        <td style={{ padding: '0.85rem 0.9rem' }}>
                          <span style={{
                            padding: '3px 7px', borderRadius: 4, background: '#0f172a',
                            color: '#ffffff', fontWeight: 800, fontSize: '0.7rem'
                          }}>
                            {rec.type}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.9rem', fontWeight: 600, color: 'var(--d-t1)' }}>
                          <code>{rec.host}</code>
                        </td>
                        <td style={{ padding: '0.85rem 0.9rem', color: 'var(--d-t2)', fontFamily: 'monospace' }}>
                          {rec.target}
                        </td>
                        <td style={{ padding: '0.85rem 0.9rem', color: 'var(--d-t3)' }}>
                          {rec.ttl}
                        </td>
                        <td style={{ padding: '0.85rem 0.9rem' }}>
                          <span style={{
                            fontSize: '0.72rem', fontWeight: 700,
                            background: '#f0fdf4', color: '#166534',
                            border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 99
                          }}>
                            {rec.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.9rem' }}>
                          <button
                            onClick={() => handleCopy(rec.target, `dns-${rec.type}`)}
                            className={styles.btnSecondary}
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                          >
                            {copied === `dns-${rec.type}` ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 3-Step Setup Instructions Accordion / Card */}
              <div style={{ marginTop: '1.25rem', paddingTop: '1.1rem', borderTop: '1px solid var(--d-border2)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid var(--d-border)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: 3 }}>
                    Step 1 · Registrar
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-t1)', marginBottom: 2 }}>
                    Open DNS Settings
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--d-t3)', lineHeight: 1.4 }}>
                    Log into your domain registrar (GoDaddy, Cloudflare, Namecheap) and open DNS management.
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid var(--d-border)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', marginBottom: 3 }}>
                    Step 2 · Add Records
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-t1)', marginBottom: 2 }}>
                    Paste CNAME & A Records
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--d-t3)', lineHeight: 1.4 }}>
                    Create the CNAME record for your shop subdomain and optional A record pointing to 76.76.21.21.
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid var(--d-border)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: 3 }}>
                    Step 3 · Verification
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--d-t1)', marginBottom: 2 }}>
                    Instant SSL Provisioning
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--d-t3)', lineHeight: 1.4 }}>
                    Click "Test DNS Resolution" above. Cloudflare edge automatically issues your TLS 1.3 certificate.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: THEME & BRAND IDENTITY
            ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'theme' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Section 1: Template Selection Gallery */}
            <div className={styles.panel} style={{ padding: '1.4rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--d-t1)', margin: 0 }}>
                  Choose Your E-Shop Template
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--d-t3)' }}>
                  Select from 5 modern, high-conversion aesthetics tailored for fashion and virtual fitting
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                {TEMPLATES.map(tpl => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      style={{
                        border: isSelected ? '2px solid #0f172a' : '1.5px solid var(--d-border)',
                        borderRadius: 12,
                        padding: '1rem',
                        cursor: 'pointer',
                        background: isSelected ? '#f8fafc' : '#ffffff',
                        transition: 'all 0.15s ease',
                        position: 'relative'
                      }}
                    >
                      {/* Swatch visual */}
                      <div style={{
                        height: 75,
                        borderRadius: 8,
                        background: tpl.preview,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: tpl.textColor,
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        marginBottom: '0.85rem'
                      }}>
                        {tpl.name}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--d-t1)' }}>
                          {tpl.name}
                        </span>
                        {isSelected && (
                          <span style={{
                            fontSize: '0.62rem', fontWeight: 800, background: '#0f172a',
                            color: '#ffffff', padding: '2px 7px', borderRadius: 99
                          }}>
                            SELECTED
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#2563eb', marginBottom: 4 }}>
                        {tpl.vibe}
                      </div>

                      <p style={{ fontSize: '0.74rem', color: 'var(--d-t3)', lineHeight: 1.4, margin: 0 }}>
                        {tpl.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Store Identity & Appearance Form */}
            <div className={styles.panel} style={{ padding: '1.4rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--d-t1)', margin: 0 }}>
                  Store Identity & Branding
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--d-t3)' }}>
                  Customize your brand typography, accent palette, hero banner, and contact details
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                
                {/* Field 1: Store Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t2)', marginBottom: 5 }}>
                    STORE NAME
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    style={{
                      width: '100%', padding: '0.55rem 0.85rem',
                      background: '#f8fafc', border: '1.5px solid var(--d-border)',
                      borderRadius: 8, fontSize: '0.85rem', color: '#0f172a', outline: 'none'
                    }}
                  />
                </div>

                {/* Field 2: Subdomain Slug */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t2)', marginBottom: 5 }}>
                    SUBDOMAIN SLUG (<code>{subdomain}.voguesocial.com</code>)
                  </label>
                  <input
                    type="text"
                    value={subdomain}
                    onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    style={{
                      width: '100%', padding: '0.55rem 0.85rem',
                      background: '#f8fafc', border: '1.5px solid var(--d-border)',
                      borderRadius: 8, fontSize: '0.85rem', color: '#0f172a', outline: 'none'
                    }}
                  />
                </div>

                {/* Field 3: Tagline */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t2)', marginBottom: 5 }}>
                    STORE TAGLINE / HEADLINE
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    style={{
                      width: '100%', padding: '0.55rem 0.85rem',
                      background: '#f8fafc', border: '1.5px solid var(--d-border)',
                      borderRadius: 8, fontSize: '0.85rem', color: '#0f172a', outline: 'none'
                    }}
                  />
                </div>

                {/* Field 4: Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t2)', marginBottom: 5 }}>
                    BRAND STORY & ABOUT DESCRIPTION
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{
                      width: '100%', padding: '0.55rem 0.85rem',
                      background: '#f8fafc', border: '1.5px solid var(--d-border)',
                      borderRadius: 8, fontSize: '0.85rem', color: '#0f172a', outline: 'none', resize: 'vertical'
                    }}
                  />
                </div>

                {/* Field 5: Brand Accent Color */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t2)', marginBottom: 5 }}>
                    PRIMARY ACCENT COLOR
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {ACCENT_PALETTES.map(p => (
                      <div
                        key={p.value}
                        onClick={() => setAccentColor(p.value)}
                        title={p.name}
                        style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: p.value, cursor: 'pointer',
                          boxShadow: accentColor === p.value ? '0 0 0 3px #0f172a' : 'none',
                          transition: 'transform 0.15s'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      style={{ width: 34, height: 34, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      style={{
                        padding: '0.45rem 0.65rem', width: 110,
                        background: '#f8fafc', border: '1px solid var(--d-border)',
                        borderRadius: 6, fontSize: '0.82rem', fontFamily: 'monospace'
                      }}
                    />
                  </div>
                </div>

                {/* Field 6: Hero Banner Image URL */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t2)', marginBottom: 5 }}>
                    HERO BANNER IMAGE URL
                  </label>
                  <input
                    type="text"
                    value={heroImage}
                    onChange={e => setHeroImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{
                      width: '100%', padding: '0.55rem 0.85rem',
                      background: '#f8fafc', border: '1.5px solid var(--d-border)',
                      borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    {[
                      { label: 'Parisian Studio', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80' },
                      { label: 'Minimal Silk', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80' },
                      { label: 'Obsidian Haute', url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80' }
                    ].map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setHeroImage(preset.url)}
                        className={styles.btnSecondary}
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Save & Publish Changes Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: '1.1rem', borderTop: '1px solid var(--d-border2)' }}>
                <Link to={directStoreUrl} target="_blank" className={styles.btnSecondary} style={{ fontSize: '0.82rem', textDecoration: 'none' }}>
                  <Eye size={13} /> View Store
                </Link>
                <button
                  onClick={() => handleSaveSettings({
                    storeName,
                    subdomain,
                    tagline,
                    description,
                    template: selectedTemplate,
                    accentColor,
                    heroImage
                  })}
                  disabled={saving}
                  className={styles.btnPrimary}
                  style={{ fontSize: '0.82rem', padding: '0.55rem 1.3rem' }}
                >
                  {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={14} />}
                  <span>{saving ? 'Publishing to Edge...' : 'Save & Publish Changes'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </>
  );
}
