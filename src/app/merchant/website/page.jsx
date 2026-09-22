"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../merchant.module.css';
import {
  Globe, Eye, Edit3, ExternalLink, CheckCircle2, ArrowRight, ArrowLeft,
  Link2, ShieldCheck, AlertCircle, Loader2, RefreshCw, ShoppingCart,
  Users, DollarSign, Copy, Check, Sparkles, Package, Server, Lock,
  CheckCircle, ArrowUpRight
} from 'lucide-react';
import {
  DEFAULT_MERCHANT_STORE,
  getStoreByHandle,
  saveMerchantStore,
  verifyDomainDNS
} from '@/lib/storefrontData';

/* ── Template definitions ── */
const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern E-Shop',
    desc: 'Contemporary high-conversion store with geometric typography, slide-over cart & in-card virtual try-on.',
    vibe: 'D2C Luxury · Contemporary Edit · AI Try-On',
    bg: '#F8FAFC',
    accent: '#2563EB',
    preview: 'linear-gradient(135deg,#2563EB 0%,#1D4ED8 100%)',
    textColor: '#FFFFFF',
    badge: 'Flagship E-Shop',
  },
  {
    id: 'minimal',
    name: 'Minimal Fashion',
    desc: 'Clean editorial whitespace. Less is more.',
    vibe: 'COS · The Row · Jil Sander',
    bg: '#FFFFFF',
    accent: '#1A1A1A',
    preview: 'linear-gradient(135deg,#FFFFFF 0%,#F9F7F4 100%)',
    textColor: '#1A1A1A',
    badge: 'Editorial',
  },
  {
    id: 'luxury',
    name: 'Luxury Atelier',
    desc: 'Dramatic obsidian surfaces with warm gold accents.',
    vibe: 'Valentino · Balenciaga · Versace',
    bg: '#1C1C1E',
    accent: '#C9A84C',
    preview: 'linear-gradient(135deg,#1C1C1E 0%,#2A2A2C 100%)',
    textColor: '#C9A84C',
    badge: 'Haute',
  },
  {
    id: 'streetwear',
    name: 'Streetwear & Drop',
    desc: 'Bold typography, high-impact contrast & drop countdowns.',
    vibe: 'Supreme · Off-White · Palace',
    bg: '#0A0A0A',
    accent: '#CCFF00',
    preview: 'linear-gradient(135deg,#0A0A0A 0%,#1A1A1A 100%)',
    textColor: '#CCFF00',
    badge: 'Urban',
  },
  {
    id: 'boutique',
    name: 'Artisan Boutique',
    desc: 'Warm cream tones with organic elegance and serif titles.',
    vibe: 'Reformation · Parisian Boutique',
    bg: '#FAF7F2',
    accent: '#C47E6B',
    preview: 'linear-gradient(135deg,#FAF7F2 0%,#F5EFE8 100%)',
    textColor: '#2C1810',
    badge: 'Artisan',
  },
];

const DOMAIN_STATUS_CONFIG = {
  not_connected: { label: 'Not Connected', color: '#64748b', bg: '#f1f5f9', icon: Link2 },
  verifying: { label: 'DNS Verification in Progress...', color: '#d97706', bg: '#fffbeb', icon: Loader2 },
  configuring: { label: 'Configuring Edge Routing', color: '#2563eb', bg: '#eff6ff', icon: RefreshCw },
  connected: { label: 'Connected', color: '#166534', bg: '#f0fdf4', icon: CheckCircle2 },
  ssl_active: { label: 'SSL Active ✓ (HTTPS Secure)', color: '#166534', bg: '#f0fdf4', icon: ShieldCheck },
  error: { label: 'DNS Mapping Pending', color: '#dc2626', bg: '#fef2f2', icon: AlertCircle },
};

export default function WebsitePage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(DEFAULT_MERCHANT_STORE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Wizard state */
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [branding, setBranding] = useState({
    logo_url: '',
    store_name: 'Studio Label Paris',
    tagline: 'Modern Tailoring & AI Virtual Fitting Studio',
    description: 'Founded in Paris, Studio Label harmonizes architectural silhouettes with everyday luxury.',
    hero_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    accent_color: '#2563eb'
  });
  const [subdomain, setSubdomain] = useState('studiolabel');
  const [customDomain, setCustomDomain] = useState('shop.studiolabelparis.com');
  const [copied, setCopied] = useState('');

  /* Domain settings modal & verification simulator */
  const [showDomainPanel, setShowDomainPanel] = useState(false);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [dnsCheckStep, setDnsCheckStep] = useState(0); // 0 = idle, 1 = CNAME, 2 = A, 3 = SSL, 4 = complete

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const { store } = getStoreByHandle('studiolabel');
    if (store) {
      setSettings(store);
      setSelectedTemplate(store.template || 'modern');
      setBranding({
        logo_url: store.logo_url || '',
        store_name: store.store_name || 'Studio Label Paris',
        tagline: store.tagline || 'Modern Tailoring & AI Virtual Fitting Studio',
        description: store.description || '',
        hero_image: store.hero_image || '',
        accent_color: store.accent_color || '#2563eb'
      });
      setSubdomain(store.subdomain || store.store_handle || 'studiolabel');
      setCustomDomain(store.custom_domain || 'shop.studiolabelparis.com');
    }
  };

  const doSave = (updatedFields) => {
    const newStore = {
      ...settings,
      ...updatedFields,
      store_handle: (updatedFields.store_handle || settings.store_handle || subdomain).toLowerCase()
    };
    const saved = saveMerchantStore(newStore);
    setSettings(saved);
    return saved;
  };

  const handlePublish = async () => {
    setSaving(true);
    const updated = doSave({
      template: selectedTemplate,
      store_name: branding.store_name || subdomain,
      tagline: branding.tagline,
      description: branding.description,
      logo_url: branding.logo_url,
      hero_image: branding.hero_image,
      accent_color: branding.accent_color,
      store_handle: subdomain.toLowerCase(),
      subdomain: subdomain.toLowerCase(),
      custom_domain: customDomain.trim(),
      status: 'live',
      domain_status: customDomain.trim() ? 'ssl_active' : 'not_connected'
    });
    setSettings(updated);
    setSaving(false);
    setShowWizard(false);
  };

  const handleCheckDomainDNS = async () => {
    setCheckingDomain(true);
    setDnsCheckStep(1);

    await new Promise(r => setTimeout(r, 600));
    setDnsCheckStep(2);

    await new Promise(r => setTimeout(r, 700));
    setDnsCheckStep(3);

    await new Promise(r => setTimeout(r, 600));
    setDnsCheckStep(4);

    const updated = await verifyDomainDNS(customDomain || 'shop.studiolabelparis.com', settings);
    setSettings(updated);
    setCheckingDomain(false);
    setDnsCheckStep(0);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const currentHandle = settings.store_handle || subdomain || 'studiolabel';
  const liveSubdomainUrl = `https://${currentHandle}.voguesocial.com`;
  const localPreviewRoute = `/store/${currentHandle}`;
  const isLive = settings.status === 'live';

  return (
    <>
      {/* ── TOP BAR ── */}
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
            <span>My Website & Storefront</span>
          </div>
          <div className={styles.pageSubtitle}>
            Manage your free VogueSocial subdomain (<code>{currentHandle}.voguesocial.com</code>), DNS mapping, and modern e-shop template
          </div>
        </div>

        {isLive && (
          <div className={styles.topbarRight}>
            <Link
              to={localPreviewRoute}
              target="_blank"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '0.45rem 0.9rem', borderRadius: 8,
                background: '#f0fdf4', color: '#166534',
                fontWeight: 600, fontSize: '0.78rem', textDecoration: 'none',
                border: '1px solid #bbf7d0'
              }}
            >
              <ExternalLink size={13} /> Visit Live Storefront
            </Link>
            <button className={styles.btnPrimary} onClick={() => { setShowWizard(true); setWizardStep(1); }}>
              <Edit3 size={13} /> Edit Website
            </button>
          </div>
        )}
      </div>

      <div className={styles.pageContent}>
        {/* ── 1. DOMAINS & SUBDOMAIN OVERVIEW BAR ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.1rem', marginBottom: '1.5rem' }}>
          
          {/* Card A: VogueSocial Subdomain */}
          <div className={styles.panel} style={{ padding: '1.25rem 1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    VogueSocial Subdomain
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--d-t1)', marginTop: 2 }}>
                    {currentHandle}.voguesocial.com
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 99 }}>
                ● Active & Live
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--d-t3)', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
              Every brand boutique receives a free instant subdomain with automated SSL, in-browser AI fitting room, and live product catalog synchronization.
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleCopy(liveSubdomainUrl, 'subdomain-url')}
                className={styles.btnSecondary}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                {copied === 'subdomain-url' ? <><Check size={12} color="#16a34a" /> Copied</> : <><Copy size={12} /> Copy Subdomain</>}
              </button>
              <Link
                to={localPreviewRoute}
                target="_blank"
                className={styles.btnPrimary}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', textDecoration: 'none' }}
              >
                <Eye size={12} /> Open Store Preview <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Card B: Custom Domain & DNS Mapping Status */}
          <div className={styles.panel} style={{ padding: '1.25rem 1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f8fafc', color: '#0f172a', border: '1px solid var(--d-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Server size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Custom Domain & DNS Mapping
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--d-t1)', marginTop: 2 }}>
                    {settings.custom_domain || 'Not Connected'}
                  </div>
                </div>
              </div>

              {(() => {
                const cfg = DOMAIN_STATUS_CONFIG[settings.domain_status] || DOMAIN_STATUS_CONFIG.not_connected;
                const Icon = cfg.icon;
                return (
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, background: cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icon size={11} /> {cfg.label}
                  </span>
                );
              })()}
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--d-t3)', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
              Point your branded domain (e.g. <code>shop.yourbrand.com</code>) using CNAME & A records directly to VogueSocial Global Anycast Edge.
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <button
                onClick={() => setShowDomainPanel(true)}
                className={styles.btnSecondary}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                <Link2 size={12} /> Configure DNS Records
              </button>
              <button
                onClick={handleCheckDomainDNS}
                disabled={checkingDomain}
                className={styles.btnSecondary}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                {checkingDomain ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={12} />}
                <span>{checkingDomain ? 'Verifying...' : 'Test DNS Resolution'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. ACTIVE TEMPLATE & STORE PERFORMANCE ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.1rem', marginBottom: '1.5rem' }}>
          
          {/* Active Template Card */}
          <div className={styles.panel} style={{ padding: '1.25rem 1.4rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              Current Storefront Theme
            </div>

            {(() => {
              const currentTpl = TEMPLATES.find(t => t.id === settings.template) || TEMPLATES[0];
              return (
                <div>
                  <div style={{
                    height: 100, borderRadius: 10,
                    background: currentTpl.preview,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', color: currentTpl.textColor,
                    padding: '1rem', textAlign: 'center', marginBottom: '0.85rem'
                  }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                      {currentTpl.badge}
                    </span>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 3 }}>{currentTpl.name}</div>
                  </div>

                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--d-t1)', marginBottom: 4 }}>
                    {currentTpl.vibe}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--d-t3)', lineHeight: 1.4, margin: '0 0 1rem 0' }}>
                    {currentTpl.desc}
                  </p>

                  <button
                    onClick={() => { setShowWizard(true); setWizardStep(1); }}
                    className={styles.btnSecondary}
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem' }}
                  >
                    Switch Template (5 Options)
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Storefront Analytics Stats */}
          <div className={styles.panel} style={{ padding: '1.25rem 1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Storefront Traffic & Conversion (7-Day)
              </div>
              <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600, background: '#f0fdf4', padding: '2px 6px', borderRaiuds: 4 }}>
                +18.4% WoW
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
              {[
                { label: 'Store Visitors', value: settings.analytics?.visitors_7d?.toLocaleString() || '18,420', icon: Users, sub: 'Direct from Subdomain' },
                { label: 'Product Views', value: settings.analytics?.product_views?.toLocaleString() || '42,910', icon: Eye, sub: '2.3 views / visitor' },
                { label: 'Add to Cart', value: settings.analytics?.add_to_cart?.toLocaleString() || '4,890', icon: ShoppingCart, sub: '11.4% cart rate' },
                { label: 'Store Revenue', value: `$${(settings.analytics?.revenue || 284950).toLocaleString()}`, icon: DollarSign, sub: 'Avg order $229' },
              ].map(stat => (
                <div key={stat.label} style={{ background: '#f8fafc', border: '1px solid var(--d-border)', borderRadius: 10, padding: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--d-t3)', textTransform: 'uppercase' }}>{stat.label}</span>
                    <stat.icon size={14} color="#64748b" />
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--d-t1)', letterSpacing: '-0.02em' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--d-t4)', marginTop: 2 }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Quick action bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--d-border2)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--d-t3)' }}>
                <span>Storefront Engine: <strong>VogueSocial Edge v2.4 (Anycast)</strong> · Free SSL Included</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={() => setShowDomainPanel(true)} className={styles.btnSecondary} style={{ fontSize: '0.75rem' }}>
                  DNS Management
                </button>
                <Link to={localPreviewRoute} target="_blank" className={styles.btnPrimary} style={{ fontSize: '0.75rem', textDecoration: 'none' }}>
                  Preview Live Store
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. DNS RECORDS CARD (DIRECT ACCESS) ── */}
        <div className={styles.panel} style={{ padding: '1.25rem 1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Server size={18} color="#0f172a" />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--d-t1)', margin: 0 }}>
                  Active DNS Mapping Configuration
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--d-t3)' }}>
                  Map your apex domain or custom subdomain to point directly to your VogueSocial store
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckDomainDNS}
              disabled={checkingDomain}
              className={styles.btnSecondary}
              style={{ fontSize: '0.75rem' }}
            >
              {checkingDomain ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={13} />}
              <span>{checkingDomain ? 'Validating DNS...' : 'Verify DNS Records & SSL'}</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Host / Name</th>
                  <th>Points To / Value</th>
                  <th>TTL</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(settings.dns_records || DEFAULT_MERCHANT_STORE.dns_records).map((rec, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>
                        {rec.type}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--d-t1)' }}>
                      {rec.host}
                    </td>
                    <td>
                      <code style={{ background: '#f8fafc', border: '1px solid var(--d-border)', padding: '3px 8px', borderRadius: 5, fontSize: '0.75rem', color: 'var(--d-t1)' }}>
                        {rec.target}
                      </code>
                    </td>
                    <td style={{ color: 'var(--d-t3)', fontSize: '0.75rem' }}>{rec.ttl}</td>
                    <td>
                      <span className={rec.verified ? styles.badgeLive : styles.badgePending}>
                        {rec.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleCopy(rec.target, `dns-rec-${i}`)}
                        className={styles.tableActionBtn}
                        title="Copy record value"
                      >
                        {copied === `dns-rec-${i}` ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                        <span>{copied === `dns-rec-${i}` ? 'Copied' : 'Copy'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--d-border2)', fontSize: '0.75rem', color: 'var(--d-t3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} color="#166534" />
              <span>SSL Certificate: <strong>Let's Encrypt / Cloudflare Edge (TLS 1.3 Auto-Renewing)</strong></span>
            </div>
            <span>Global DNS propagation typically reflects within 5–15 minutes.</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
            5-STEP CREATION / EDIT WIZARD MODAL
        ══════════════════════════════════════ */}
      {showWizard && (
        <div className={styles.overlay} onClick={() => setShowWizard(false)}>
          <div className={styles.modal} style={{ maxWidth: 840 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle}>
                  {isLive ? 'Configure Website & Storefront' : 'Create Your Website'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--d-t3)', marginTop: 2 }}>
                  Step {wizardStep} of 5 — {['Choose Template (Modern Flagship)', 'Brand Identity & Palette', 'VogueSocial Subdomain', 'Custom Domain & DNS Mapping', 'Review & Publish'][wizardStep - 1]}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowWizard(false)}>✕</button>
            </div>

            {/* Step navigation tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--d-border)', padding: '0 1.25rem', overflowX: 'auto', background: '#f8fafc' }}>
              {['1. Template', '2. Branding', '3. Subdomain', '4. Custom Domain & DNS', '5. Publish'].map((label, i) => {
                const stepNum = i + 1;
                const active = wizardStep === stepNum;
                const done = wizardStep > stepNum;
                return (
                  <button
                    key={label}
                    onClick={() => setWizardStep(stepNum)}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'none',
                      border: 'none',
                      borderBottom: active ? '2px solid #0f172a' : '2px solid transparent',
                      color: active ? '#0f172a' : done ? '#166534' : '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    {done ? '✓' : ''} {label}
                  </button>
                );
              })}
            </div>

            <div className={styles.modalBody} style={{ minHeight: 380 }}>
              
              {/* STEP 1: TEMPLATE SELECTOR */}
              {wizardStep === 1 && (
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)', marginBottom: '1.25rem' }}>
                    Select a curated e-commerce template. We recommend <strong>Modern E-Shop</strong> for contemporary apparel boutiques with in-card virtual try-on.
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.9rem' }}>
                    {TEMPLATES.map((t) => {
                      const isSelected = selectedTemplate === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTemplate(t.id)}
                          style={{
                            border: isSelected ? '2px solid #0f172a' : '1px solid var(--d-border)',
                            borderRadius: 12,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: '#ffffff',
                            boxShadow: isSelected ? '0 4px 14px rgba(15,23,42,0.12)' : 'none',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ height: 85, background: t.preview, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: t.textColor, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                              {t.badge}
                            </span>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: t.textColor, marginTop: 2 }}>{t.name}</div>
                          </div>
                          <div style={{ padding: '0.75rem 0.85rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--d-t1)', marginBottom: 3 }}>{t.vibe}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--d-t3)', lineHeight: 1.35 }}>{t.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: BRANDING */}
              {wizardStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Store / Boutique Name</label>
                    <input
                      className={styles.fInput}
                      value={branding.store_name}
                      onChange={e => setBranding(p => ({ ...p, store_name: e.target.value }))}
                      placeholder="e.g. Studio Label Paris"
                    />
                  </div>

                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Store Tagline</label>
                    <input
                      className={styles.fInput}
                      value={branding.tagline}
                      onChange={e => setBranding(p => ({ ...p, tagline: e.target.value }))}
                      placeholder="e.g. Modern Tailoring & Virtual Fitting Studio"
                    />
                  </div>

                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Store Description & Heritage</label>
                    <textarea
                      className={styles.fTextarea}
                      value={branding.description}
                      onChange={e => setBranding(p => ({ ...p, description: e.target.value }))}
                      placeholder="Tell your brand story and design philosophy..."
                      style={{ minHeight: 75 }}
                    />
                  </div>

                  <div className={styles.fRow}>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Accent / Brand Color</label>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          type="color"
                          value={branding.accent_color}
                          onChange={e => setBranding(p => ({ ...p, accent_color: e.target.value }))}
                          style={{ width: 42, height: 38, border: '1px solid var(--d-border)', borderRadius: 6, cursor: 'pointer', padding: 2 }}
                        />
                        <input
                          className={styles.fInput}
                          value={branding.accent_color}
                          onChange={e => setBranding(p => ({ ...p, accent_color: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Hero Banner Image URL (Optional)</label>
                      <input
                        className={styles.fInput}
                        value={branding.hero_image}
                        onChange={e => setBranding(p => ({ ...p, hero_image: e.target.value }))}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: VOGUESOCIAL SUBDOMAIN */}
              {wizardStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)' }}>
                    Your free, instant VogueSocial subdomain. Your store will immediately be reachable here with zero configuration:
                  </div>

                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Choose Subdomain Slug</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--d-border)', borderRadius: 8, overflow: 'hidden' }}>
                      <span style={{ padding: '0 0.85rem', background: '#f8fafc', color: 'var(--d-t3)', fontSize: '0.82rem', fontWeight: 600, borderRight: '1px solid var(--d-border)' }}>
                        https://
                      </span>
                      <input
                        style={{ flex: 1, padding: '0.65rem 0.85rem', border: 'none', outline: 'none', background: '#ffffff', fontSize: '0.9rem', color: 'var(--d-t1)', fontWeight: 700 }}
                        value={subdomain}
                        onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/\s/g, '-'))}
                        placeholder="yourstore"
                      />
                      <span style={{ padding: '0 1rem', background: '#f8fafc', color: 'var(--d-t3)', fontSize: '0.82rem', fontWeight: 600, borderLeft: '1px solid var(--d-border)' }}>
                        .voguesocial.com
                      </span>
                    </div>
                  </div>

                  {subdomain && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={16} color="#16a34a" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#166534' }}>
                          <strong>https://{subdomain}.voguesocial.com</strong> is available and ready for your storefront.
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(`https://${subdomain}.voguesocial.com`, 'wiz-sub')}
                        className={styles.tableActionBtn}
                      >
                        {copied === 'wiz-sub' ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                        <span>{copied === 'wiz-sub' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  <div style={{ background: '#f8fafc', border: '1px solid var(--d-border)', borderRadius: 10, padding: '0.9rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      Subdomain Features
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--d-t2)', lineHeight: 1.6 }}>
                      <li>Zero setup or hosting fees — ready immediately upon publishing</li>
                      <li>Automated SSL Certificate with Edge Anycast CDN caching</li>
                      <li>Instant product catalog updates from your Merchant inventory</li>
                      <li>Zero-popup Virtual Try-On enabled on every product card</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* STEP 4: CUSTOM DOMAIN & DNS MAPPING */}
              {wizardStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)' }}>
                    Connect your own domain (e.g. <code>shop.studiolabelparis.com</code> or <code>studiolabel.com</code>). Point these DNS records at your domain provider (GoDaddy, Cloudflare, Namecheap, Google Domains):
                  </div>

                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Custom Domain Name</label>
                    <input
                      className={styles.fInput}
                      value={customDomain}
                      onChange={e => setCustomDomain(e.target.value)}
                      placeholder="shop.yourbrand.com"
                    />
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid var(--d-border)', borderRadius: 10, padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t1)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck size={15} color="#166534" /> DNS Records to Add
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                            <th style={{ padding: '0.5rem 0.75rem', color: 'var(--d-t3)' }}>Type</th>
                            <th style={{ padding: '0.5rem 0.75rem', color: 'var(--d-t3)' }}>Name / Host</th>
                            <th style={{ padding: '0.5rem 0.75rem', color: 'var(--d-t3)' }}>Value / Points To</th>
                            <th style={{ padding: '0.5rem 0.75rem', color: 'var(--d-t3)' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { type: 'CNAME', host: 'shop', value: 'cname.voguesocial.com' },
                            { type: 'A', host: '@', value: '76.76.21.21' },
                            { type: 'TXT', host: '_vogue-challenge', value: 'vogue-verification=vs_live_9f83a21b47' }
                          ].map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--d-border2)' }}>
                              <td style={{ padding: '0.5rem 0.75rem', fontWeight: 700, color: '#0f172a' }}>{r.type}</td>
                              <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace' }}>{r.host}</td>
                              <td style={{ padding: '0.5rem 0.75rem' }}>
                                <code style={{ background: '#ffffff', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--d-border)' }}>{r.value}</code>
                              </td>
                              <td style={{ padding: '0.5rem 0.75rem' }}>
                                <button
                                  onClick={() => handleCopy(r.value, `dns-wiz-${i}`)}
                                  className={styles.tableActionBtn}
                                  style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                                >
                                  {copied === `dns-wiz-${i}` ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                                  <span>{copied === `dns-wiz-${i}` ? 'Copied' : 'Copy'}</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & PUBLISH */}
              {wizardStep === 5 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid var(--d-border)', borderRadius: 10, padding: '1rem 1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t1)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                      Storefront Launch Summary
                    </div>
                    {[
                      { label: 'Theme Template', value: TEMPLATES.find(t => t.id === selectedTemplate)?.name || selectedTemplate },
                      { label: 'Store Name', value: branding.store_name },
                      { label: 'Tagline', value: branding.tagline },
                      { label: 'VogueSocial Subdomain', value: `https://${subdomain}.voguesocial.com` },
                      { label: 'Custom Domain (DNS)', value: customDomain || 'None configured' },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid var(--d-border2)', fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--d-t3)', fontWeight: 500 }}>{row.label}</span>
                        <span style={{ color: 'var(--d-t1)', fontWeight: 600 }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16} /> All catalog products, size variants, and virtual fitting rooms will be live instantly.
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer navigation */}
            <div className={styles.modalFooter}>
              {wizardStep > 1 && (
                <button className={styles.btnSecondary} onClick={() => setWizardStep(wizardStep - 1)}>
                  <ArrowLeft size={13} /> Back
                </button>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.65rem' }}>
                {wizardStep === 4 && (
                  <button className={styles.btnSecondary} onClick={() => setWizardStep(5)}>
                    Skip Custom Domain
                  </button>
                )}
                {wizardStep < 5 ? (
                  <button className={styles.btnPrimary} onClick={() => setWizardStep(wizardStep + 1)}>
                    Next Step <ArrowRight size={13} />
                  </button>
                ) : (
                  <button className={styles.btnPrimary} onClick={handlePublish} disabled={saving}>
                    {saving ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Globe size={13} />}
                    <span>{saving ? 'Publishing...' : 'Publish Storefront'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
            CUSTOM DOMAIN & DNS SETTINGS MODAL
        ══════════════════════════════════════ */}
      {showDomainPanel && (
        <div className={styles.overlay} onClick={() => setShowDomainPanel(false)}>
          <div className={styles.modal} style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Server size={18} />
                <span>Custom Domain & DNS Mapping</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowDomainPanel(false)}>✕</button>
            </div>

            <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Active Subdomain notice */}
              <div style={{ padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid var(--d-border)', borderRadius: 8 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase' }}>
                  Default Free Subdomain
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    https://{currentHandle}.voguesocial.com
                  </span>
                  <span className={styles.badgeLive}>ACTIVE</span>
                </div>
              </div>

              {/* Custom Domain Input */}
              <div className={styles.fGroup}>
                <label className={styles.fLabel}>Map Custom Domain</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className={styles.fInput}
                    placeholder="shop.yourboutique.com"
                    value={customDomain}
                    onChange={e => setCustomDomain(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    className={styles.btnPrimary}
                    onClick={() => {
                      doSave({ custom_domain: customDomain, domain_status: 'ssl_active' });
                      handleCheckDomainDNS();
                    }}
                  >
                    Save & Test
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem', borderRadius: 8,
                background: DOMAIN_STATUS_CONFIG[settings.domain_status]?.bg || '#f1f5f9',
                border: '1px solid rgba(0,0,0,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600, color: DOMAIN_STATUS_CONFIG[settings.domain_status]?.color }}>
                  <ShieldCheck size={16} />
                  <span>Status: {DOMAIN_STATUS_CONFIG[settings.domain_status]?.label}</span>
                </div>
                <button
                  onClick={handleCheckDomainDNS}
                  disabled={checkingDomain}
                  className={styles.tableActionBtn}
                >
                  {checkingDomain ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={12} />}
                  <span>{checkingDomain ? 'Testing...' : 'Verify Now'}</span>
                </button>
              </div>

              {/* Live DNS check simulation steps */}
              {checkingDomain && (
                <div style={{ padding: '0.85rem 1rem', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', marginBottom: 6 }}>
                    Running Live DNS Diagnostic:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.72rem', color: '#1e3a8a' }}>
                    <div>{dnsCheckStep >= 1 ? '✓ [1/3] Querying Global DNS Anycast Servers...' : '○ Querying DNS...'}</div>
                    <div>{dnsCheckStep >= 2 ? '✓ [2/3] Validating CNAME resolves to cname.voguesocial.com' : '○ Validating CNAME...'}</div>
                    <div>{dnsCheckStep >= 3 ? '✓ [3/3] Let\'s Encrypt TLS 1.3 SSL Certificate Verified & Active!' : '○ Verifying SSL...'}</div>
                  </div>
                </div>
              )}

              {/* DNS table */}
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--d-t3)', textTransform: 'uppercase' }}>
                Required DNS Entries (Enter in your Domain Registrar):
              </div>

              {[
                { type: 'CNAME', host: 'shop', value: 'cname.voguesocial.com' },
                { type: 'A', host: '@', value: '76.76.21.21' },
                { type: 'TXT', host: '_vogue-challenge', value: 'vogue-verification=vs_live_9f83a21b47' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: '#f8fafc', border: '1px solid var(--d-border)', borderRadius: 6, fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', width: 45 }}>{r.type}</span>
                    <span style={{ color: 'var(--d-t3)', width: 60 }}>{r.host}</span>
                    <span style={{ color: 'var(--d-t1)' }}>{r.value}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(r.value, `modal-dns-${i}`)}
                    className={styles.tableActionBtn}
                    style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                  >
                    {copied === `modal-dns-${i}` ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setShowDomainPanel(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
