"use client";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { storeService } from '@/services/storeService';
import { DEFAULT_MERCHANT_STORE, verifyDomainDNS } from '@/lib/storefrontData';
import {
  Globe, Eye, Sparkles, ExternalLink, ShieldCheck, Lock,
  Copy, Check, RefreshCw, Palette, Server, Monitor, Smartphone,
  Sliders, Loader2, ArrowRight
} from 'lucide-react';
import './MerchantWebsite.css';
import DomainSettingsTab from '@/components/merchant/storefront-editor/DomainSettingsTab';
import { TEMPLATES } from '@/components/merchant/storefront-editor/StorefrontInspector';

export default function WebsitePage() {
  const { user } = useAuth();
  const effectiveHandle = user?.storeHandle || 'studiolabel';
  const effectiveVendorId = user?.id || 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';

  const [settings, setSettings] = useState(DEFAULT_MERCHANT_STORE);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'domains' | 'theme'
  const [viewport, setViewport] = useState('desktop');
  const [copiedKey, setCopiedKey] = useState('');
  const [dnsChecking, setDnsChecking] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());

  useEffect(() => {
    async function loadWebsiteSettings() {
      setLoading(true);
      try {
        const data = await storeService.getStoreWebsite(effectiveVendorId, effectiveHandle);
        if (data && data.success && data.website) {
          setSettings({
            ...DEFAULT_MERCHANT_STORE,
            ...data.website
          });
        }
      } catch (err) {
        console.warn('Error loading website settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWebsiteSettings();
  }, [effectiveVendorId, effectiveHandle]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    });
  };

  const handleVerifyDNS = async () => {
    setDnsChecking(true);
    await new Promise(r => setTimeout(r, 1200));
    await verifyDomainDNS(settings.custom_domain || 'shop.studiolabelparis.com', settings);
    setDnsChecking(false);
  };

  const isLocalDev = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname.endsWith('.localhost') ||
    window.location.hostname === '127.0.0.1'
  );
  const portSuffix = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : ':3001';
  const cleanHandle = (settings.subdomain || settings.store_handle || 'studiolabel').toLowerCase();
  const liveUrl = isLocalDev
    ? `http://${cleanHandle}.localhost${portSuffix}`
    : `https://${cleanHandle}.voguesocial.com`;
  const storePreviewUrl = `/store/${cleanHandle}?embedded=true&t=${previewKey}`;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 10,
        color: 'var(--d-t3, #64748b)',
        fontSize: '0.85rem'
      }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading Storefront & Website Hub...</span>
      </div>
    );
  }

  return (
    <div className="merchant-website-hub">
      {/* ── 1. Top Bar ── */}
      <div className="hub-header">
        <div className="hub-header-title-wrap">
          <div className="hub-header-icon">
            <Globe size={18} />
          </div>
          <div>
            <h1 className="hub-header-title">Storefront & Website</h1>
            <div className="hub-header-subtitle">
              Manage your boutique storefront, customize your theme in full studio, and connect custom domains
            </div>
          </div>
        </div>

        <div className="hub-header-actions">
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="editor-btn-secondary"
            title="Open live storefront in new browser tab"
          >
            <ExternalLink size={13} />
            <span>Visit Live Store</span>
          </a>

          <a
            href="/merchant/website/editor"
            target="_blank"
            rel="noreferrer"
            className="hub-btn-studio-cta"
            title="Open dedicated full-screen Storefront Theme Studio in new tab"
          >
            <Sparkles size={14} />
            <span>Customize Storefront in Studio ↗</span>
          </a>
        </div>
      </div>

      {/* ── 2. Fullscreen Studio Promotion Card ── */}
      <div className="hub-studio-card">
        <div className="hub-studio-content">
          <div className="hub-studio-badge">
            <Sparkles size={12} />
            <span>DEDICATED FULLSCREEN STUDIO AVAILABLE</span>
          </div>
          <h2 className="hub-studio-title">
            Visual Theme & Section Customizer
          </h2>
          <p className="hub-studio-desc">
            Edit your announcement bar, hero typography, curated garments grid, brand narrative, and luxury color palettes with full-screen real-time preview and 0-latency feedback.
          </p>
        </div>

        <div className="hub-studio-actions">
          <a
            href="/merchant/website/editor"
            target="_blank"
            rel="noreferrer"
            className="hub-btn-studio-cta"
          >
            <Sparkles size={15} />
            <span>Open Studio in New Tab ↗</span>
          </a>

          <Link
            to="/merchant/website/editor"
            className="hub-btn-studio-outline"
          >
            <span>Open in Current Tab</span>
          </Link>
        </div>
      </div>

      {/* ── 3. Navigation Tabs ── */}
      <div className="hub-tabs">
        <button
          type="button"
          className={`hub-tab-btn ${activeTab === 'overview' ? 'hub-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Eye size={15} />
          <span>Store Overview & Live Frame</span>
        </button>

        <button
          type="button"
          className={`hub-tab-btn ${activeTab === 'domains' ? 'hub-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('domains')}
        >
          <Globe size={15} />
          <span>Domains & DNS Mapping</span>
        </button>

        <button
          type="button"
          className={`hub-tab-btn ${activeTab === 'theme' ? 'hub-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          <Palette size={15} />
          <span>Theme Presets & Styles</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: STORE OVERVIEW & LIVE FRAME
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary Row */}
          <div className="hub-panel">
            <div className="hub-summary-row">
              <div className="hub-store-brand">
                <div className="hub-avatar-initials">
                  {(settings.store_name || 'S').charAt(0).toUpperCase()}
                </div>
                <div className="hub-store-details">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 className="hub-store-name">{settings.store_name}</h3>
                    <span className="editor-status-badge">
                      <span className="editor-status-dot" />
                      <span>Live Storefront</span>
                    </span>
                  </div>

                  <div className="hub-urls-row">
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hub-url-link"
                    >
                      <Globe size={12} /> {cleanHandle}.voguesocial.com
                    </a>

                    {settings.custom_domain && (
                      <span className="hub-ssl-pill">
                        <Lock size={11} /> {settings.custom_domain} (SSL Active)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleCopy(liveUrl, 'store-url')}
                  className="editor-btn-secondary"
                >
                  {copiedKey === 'store-url' ? <><Check size={13} color="#16a34a" /> Copied</> : <><Copy size={13} /> Copy Link</>}
                </button>

                <a
                  href="/merchant/website/editor"
                  target="_blank"
                  rel="noreferrer"
                  className="editor-btn-primary"
                >
                  <Sparkles size={13} />
                  <span>Customize in Studio ↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* Live Frame Box */}
          <div className="hub-preview-box">
            <div className="hub-preview-toolbar">
              {/* Viewport switch */}
              <div className="hub-viewport-toggle">
                <button
                  type="button"
                  className={`hub-viewport-btn ${viewport === 'desktop' ? 'hub-viewport-btn-active' : ''}`}
                  onClick={() => setViewport('desktop')}
                >
                  <Monitor size={14} /> Desktop (1200px)
                </button>
                <button
                  type="button"
                  className={`hub-viewport-btn ${viewport === 'mobile' ? 'hub-viewport-btn-active' : ''}`}
                  onClick={() => setViewport('mobile')}
                >
                  <Smartphone size={14} /> Mobile (375px)
                </button>
              </div>

              {/* Center URL Pill */}
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--d-t3, #64748b)',
                display: 'flex',
                alignItems: 'center',
                gap: 5
              }}>
                <Lock size={12} color="#16a34a" />
                <span style={{ fontWeight: 600 }}>{cleanHandle}.voguesocial.com</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setPreviewKey(Date.now())}
                  className="editor-btn-secondary"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                >
                  <RefreshCw size={12} /> Refresh
                </button>

                <a
                  href="/merchant/website/editor"
                  target="_blank"
                  rel="noreferrer"
                  className="hub-btn-studio-cta"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.76rem' }}
                >
                  <Sparkles size={12} />
                  <span>Open Full Studio ↗</span>
                </a>
              </div>
            </div>

            {/* Embedded Live Frame */}
            <div className="hub-frame-container">
              <iframe
                key={`preview-${previewKey}-${viewport}`}
                src={storePreviewUrl}
                title="Storefront Live Preview"
                style={{
                  width: viewport === 'mobile' ? 375 : '100%',
                  height: 600,
                  borderRadius: viewport === 'mobile' ? 24 : 8,
                  border: viewport === 'mobile' ? '8px solid #0f172a' : '1px solid var(--d-border, #e2e8f0)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: DOMAINS & DNS MAPPING
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'domains' && (
        <DomainSettingsTab
          domainState={{
            subdomain: settings.subdomain || settings.store_handle,
            custom_domain: settings.custom_domain
          }}
          updateDomainState={async (key, value) => {
            setSettings(prev => ({ ...prev, [key]: value }));
            await storeService.saveWebsiteSettings({
              vendorId: effectiveVendorId,
              ...settings,
              [key]: value
            });
          }}
          onVerifyDNS={handleVerifyDNS}
          dnsChecking={dnsChecking}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: THEME PRESETS & STYLES
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'theme' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="hub-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--d-t1, #0f172a)' }}>
                  Active E-Shop Template
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--d-t3, #64748b)' }}>
                  Currently running: <strong>{(settings.template || 'modern').toUpperCase()}</strong>
                </span>
              </div>

              <a
                href="/merchant/website/editor"
                target="_blank"
                rel="noreferrer"
                className="hub-btn-studio-cta"
              >
                <Sparkles size={13} />
                <span>Customize in Studio ↗</span>
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {TEMPLATES.map(tpl => {
                const isSelected = (settings.template || 'modern') === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={async () => {
                      setSettings(prev => ({ ...prev, template: tpl.id }));
                      await storeService.saveWebsiteSettings({
                        vendorId: effectiveVendorId,
                        ...settings,
                        template: tpl.id
                      });
                      setPreviewKey(Date.now());
                    }}
                    style={{
                      border: isSelected ? '2px solid #0f172a' : '1px solid var(--d-border, #e2e8f0)',
                      borderRadius: 12,
                      padding: '1rem',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--d-hover, #f8fafc)' : 'var(--d-panel, #ffffff)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      height: 70,
                      borderRadius: 8,
                      background: tpl.preview,
                      color: tpl.textColor,
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem'
                    }}>
                      {tpl.name}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--d-t1, #0f172a)' }}>
                        {tpl.name}
                      </span>
                      {isSelected && (
                        <span style={{
                          fontSize: '0.62rem', fontWeight: 800, background: '#0f172a',
                          color: '#ffffff', padding: '1px 6px', borderRadius: 99
                        }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--d-t3, #64748b)', margin: 0, lineHeight: 1.35 }}>
                      {tpl.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
