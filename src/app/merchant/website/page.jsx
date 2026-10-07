"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storeService } from '@/services/storeService';
import { DEFAULT_MERCHANT_STORE, verifyDomainDNS } from '@/lib/storefrontData';
import {
  Globe, Eye, Sparkles, ExternalLink, ShieldCheck, Lock,
  Copy, Check, RefreshCw, Palette, Server, Monitor, Smartphone,
  Sliders, Loader2
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
      {/* ── 1. Unified Boutique Storefront Header ── */}
      <div className="hub-header">
        <div className="hub-header-brand-wrap">
          <div className="hub-avatar-initials">
            {(settings.store_name || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="hub-brand-info">
            <div className="hub-brand-title-row">
              <h1 className="hub-store-name">{settings.store_name || 'Studio Label Paris'}</h1>
              <span className="hub-ssl-pill">
                ● Live Storefront
              </span>
              <span className="hub-template-tag">
                {(settings.template || 'modern').toUpperCase()} THEME
              </span>
            </div>

            <div className="hub-urls-row">
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="hub-url-link"
                title="Open live storefront"
              >
                <Globe size={12} /> {cleanHandle}.voguesocial.com
              </a>

              {settings.custom_domain && (
                <span className="hub-custom-domain-pill">
                  <Lock size={11} /> {settings.custom_domain} (SSL Active)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="hub-header-actions">
          <button
            type="button"
            onClick={() => handleCopy(liveUrl, 'store-url')}
            className="hub-btn-secondary"
            title="Copy public storefront link"
          >
            {copiedKey === 'store-url' ? (
              <><Check size={13} color="#16a34a" /> Copied</>
            ) : (
              <><Copy size={13} /> Copy Link</>
            )}
          </button>

          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="hub-btn-secondary"
            title="Open live storefront in new browser tab"
          >
            <ExternalLink size={13} />
            <span>Visit Live Store</span>
          </a>

          <a
            href="/merchant/website/editor"
            target="_blank"
            rel="noreferrer"
            className="hub-btn-primary"
            title="Open Fullscreen Studio Customizer in new tab"
          >
            <Sparkles size={13} />
            <span>Customize Storefront ↗</span>
          </a>
        </div>
      </div>

      {/* ── 2. Navigation Tabs ── */}
      <div className="hub-tabs">
        <button
          type="button"
          className={`hub-tab-btn ${activeTab === 'overview' ? 'hub-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Eye size={15} />
          <span>Live Studio & Frame</span>
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
          TAB 1: LIVE STUDIO & FRAME (WIDE IMMERSIVE PREVIEW)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="hub-studio-wrapper">
          <div className="hub-preview-box">
            <div className="hub-preview-toolbar">
              {/* Viewport switch */}
              <div className="hub-viewport-toggle">
                <button
                  type="button"
                  className={`hub-viewport-btn ${viewport === 'desktop' ? 'hub-viewport-btn-active' : ''}`}
                  onClick={() => setViewport('desktop')}
                >
                  <Monitor size={14} /> Desktop (Full Width)
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
              <div className="hub-preview-url-pill">
                <Lock size={12} color="#16a34a" />
                <span className="hub-preview-url-text">{cleanHandle}.voguesocial.com</span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setPreviewKey(Date.now())}
                  className="hub-btn-secondary hub-btn-sm"
                  title="Reload preview iframe"
                >
                  <RefreshCw size={12} /> Refresh
                </button>

                <a
                  href="/merchant/website/editor"
                  target="_blank"
                  rel="noreferrer"
                  className="hub-btn-primary hub-btn-sm"
                  title="Open Fullscreen Studio Customizer in new tab"
                >
                  <Sparkles size={12} />
                  <span>Fullscreen Studio ↗</span>
                </a>
              </div>
            </div>

            {/* Embedded Live Frame */}
            <div className={`hub-frame-container ${viewport === 'mobile' ? 'hub-frame-container-mobile' : 'hub-frame-container-desktop'}`}>
              <iframe
                key={`preview-${previewKey}-${viewport}`}
                src={storePreviewUrl}
                title="Storefront Live Preview"
                className={`hub-preview-iframe ${viewport === 'mobile' ? 'hub-preview-iframe-mobile' : 'hub-preview-iframe-desktop'}`}
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
                className="hub-btn-primary"
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
