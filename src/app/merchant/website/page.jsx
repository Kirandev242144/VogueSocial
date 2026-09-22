"use client";
import { useState, useEffect } from 'react';
import styles from '../merchant.module.css';
import { Globe, Eye, Edit3, ExternalLink, CheckCircle2, ArrowRight, ArrowLeft, Link2, ShieldCheck, AlertCircle, Loader2, RefreshCw, ShoppingCart, Users, DollarSign, Copy, Check, Sparkles, Package } from 'lucide-react';
/* ── Template definitions ── */
const TEMPLATES = [
    {
        id: 'minimal',
        name: 'Minimal Fashion',
        desc: 'Clean editorial whitespace. Less is more.',
        vibe: 'COS · The Row · Jil Sander',
        bg: '#FFFFFF',
        accent: '#1A1A1A',
        preview: 'linear-gradient(135deg,#FFFFFF 0%,#F9F7F4 100%)',
        textColor: '#1A1A1A',
        badge: 'Popular',
    },
    {
        id: 'luxury',
        name: 'Luxury',
        desc: 'Dramatic dark tones with rich gold accents.',
        vibe: 'Valentino · Balenciaga · Versace',
        bg: '#1C1C1E',
        accent: '#C9A84C',
        preview: 'linear-gradient(135deg,#1C1C1E 0%,#2A2A2C 100%)',
        textColor: '#C9A84C',
        badge: 'Premium',
    },
    {
        id: 'streetwear',
        name: 'Streetwear',
        desc: 'Bold. Raw. High-contrast neon energy.',
        vibe: 'Supreme · Off-White · Palace',
        bg: '#0A0A0A',
        accent: '#CCFF00',
        preview: 'linear-gradient(135deg,#0A0A0A 0%,#1A1A1A 100%)',
        textColor: '#CCFF00',
        badge: 'Bold',
    },
    {
        id: 'modern',
        name: 'Modern',
        desc: 'Tech-forward with indigo gradients & glass.',
        vibe: 'D2C Startup · Shopify Plus',
        bg: '#4F46E5',
        accent: '#FFFFFF',
        preview: 'linear-gradient(135deg,#4F46E5 0%,#7C3AED 100%)',
        textColor: '#FFFFFF',
        badge: 'Trending',
    },
    {
        id: 'boutique',
        name: 'Boutique',
        desc: 'Warm cream tones with artisan elegance.',
        vibe: 'Reformation · Parisian Boutique',
        bg: '#FAF7F2',
        accent: '#C47E6B',
        preview: 'linear-gradient(135deg,#FAF7F2 0%,#F5EFE8 100%)',
        textColor: '#2C1810',
        badge: 'Feminine',
    },
];
const DOMAIN_STATUS_CONFIG = {
    not_connected: { label: 'Not Connected', color: '#6b7280', bg: '#f3f4f6', icon: Link2 },
    verifying: { label: 'Verification Pending', color: '#d97706', bg: '#fef3c7', icon: Loader2 },
    configuring: { label: 'Configuring DNS', color: '#2563eb', bg: '#dbeafe', icon: RefreshCw },
    connected: { label: 'Connected', color: '#059669', bg: '#d1fae5', icon: CheckCircle2 },
    ssl_active: { label: 'SSL Active ✓', color: '#059669', bg: '#d1fae5', icon: ShieldCheck },
    error: { label: 'Config Error', color: '#dc2626', bg: '#fee2e2', icon: AlertCircle },
};
const DEFAULT_SETTINGS = {
    status: 'not_created',
    template: 'minimal',
    store_handle: '',
    custom_domain: '',
    domain_status: 'not_connected',
    branding: { logo_url: '', store_name: '', tagline: '', description: '', hero_image: '', accent_color: '#02231c' },
    analytics: { visitors_7d: 0, product_views: 0, add_to_cart: 0, orders: 0, revenue: 0 },
};
export default function WebsitePage() {
    const router = useRouter();
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    /* Wizard state */
    const [showWizard, setShowWizard] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState('minimal');
    const [branding, setBranding] = useState({ logo_url: '', store_name: '', tagline: 'Discover your style.', description: '', hero_image: '', accent_color: '#02231c' });
    const [subdomain, setSubdomain] = useState('');
    const [customDomain, setCustomDomain] = useState('');
    const [copied, setCopied] = useState('');
    /* Domain settings panel */
    const [showDomainPanel, setShowDomainPanel] = useState(false);
    const [checkingDomain, setCheckingDomain] = useState(false);
    useEffect(() => { loadSettings(); }, []);
    const loadSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/merchant/website');
            const data = await res.json();
            if (data.success && data.website) {
                setSettings(data.website);
                setBranding(data.website.branding || branding);
                setSubdomain(data.website.store_handle || '');
                setCustomDomain(data.website.custom_domain || '');
            }
        }
        catch (e) { }
        setLoading(false);
    };
    const doAction = async (action, extra = {}) => {
        setSaving(true);
        try {
            const res = await fetch('/api/merchant/website', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...extra }),
            });
            const data = await res.json();
            if (data.success && data.website)
                setSettings(data.website);
            return data;
        }
        catch (e) {
            return { success: false };
        }
        finally {
            setSaving(false);
        }
    };
    const handlePublish = async () => {
        /* Step through wizard actions */
        await doAction('update_template', { template: selectedTemplate });
        await doAction('update_branding', { branding: { ...branding, store_name: branding.store_name || subdomain } });
        await doAction('update_subdomain', { store_handle: subdomain });
        if (customDomain)
            await doAction('update_domain', { custom_domain: customDomain, domain_status: 'verifying' });
        await doAction('publish');
        setShowWizard(false);
        loadSettings();
    };
    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(key);
            setTimeout(() => setCopied(''), 2000);
        });
    };
    const storeUrl = settings.store_handle
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/store/${settings.store_handle}`
        : '';
    const isLive = settings.status === 'live';
    if (loading) {
        return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 12, color: 'var(--d-t3)' }}>
        <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }}/>
        Loading website settings...
      </div>);
    }
    return (<>
      {/* ── TOP BAR ── */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--vs-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2,35,28,0.2)' }}>
              <Globe size={16} color="var(--vs-lime)"/>
            </div>
            My Website
          </div>
          <div className={styles.pageSubtitle}>
            Your one-click VogueSocial storefront — powered by your existing products
          </div>
        </div>
        {isLive && (<div className={styles.topbarRight}>
            <a href={storeUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1.1rem', borderRadius: 9, background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', border: '1px solid #bbf7d0' }}>
              <ExternalLink size={14}/> Visit Store
            </a>
            <button className={styles.btnPrimary} onClick={() => { setShowWizard(true); setWizardStep(1); }}>
              <Edit3 size={14}/> Edit Website
            </button>
          </div>)}
      </div>

      <div className={styles.pageContent}>

        {/* ── NOT CREATED STATE ── */}
        {settings.status === 'not_created' && (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', gap: '2rem' }}>
            <div style={{ maxWidth: 560, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

              {/* Illustration */}
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--vs-lime-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(2,35,28,0.1)' }}>
                <Globe size={44} color="var(--vs-green)"/>
              </div>

              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--d-t1)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                  Your store deserves its own website
                </div>
                <div style={{ fontSize: '0.92rem', color: 'var(--d-t3)', lineHeight: 1.6 }}>
                  Launch a beautiful, professional storefront in minutes — no coding, no hosting, no configuration required.
                  Your products sync automatically.
                </div>
              </div>

              {/* Feature chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {['5 Designer Templates', 'Auto Product Sync', 'Free Subdomain', 'Custom Domain', 'Virtual Try-On', 'SSL Included'].map(f => (<span key={f} style={{ padding: '0.3rem 0.85rem', background: 'var(--vs-lime-soft)', color: 'var(--vs-green)', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(203,243,130,0.3)' }}>
                    ✓ {f}
                  </span>))}
              </div>

              <button onClick={() => { setShowWizard(true); setWizardStep(1); }} style={{ padding: '0.9rem 2.5rem', background: 'var(--vs-green)', color: 'var(--vs-lime)', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(2,35,28,0.2)', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}>
                <Sparkles size={20}/> Create My Website
              </button>

              <div style={{ fontSize: '0.78rem', color: 'var(--d-t4)' }}>Takes less than 2 minutes · No technical skills needed</div>
            </div>

            {/* Template previews */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 800, marginTop: '1rem' }}>
              {TEMPLATES.map(t => (<div key={t.id} style={{ width: 140, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--d-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'transform 0.15s', flexShrink: 0 }} onClick={() => { setSelectedTemplate(t.id); setShowWizard(true); setWizardStep(1); }}>
                  <div style={{ height: 70, background: t.preview, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: t.textColor, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.name}</span>
                  </div>
                  <div style={{ background: 'var(--d-panel)', padding: '0.5rem 0.65rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--d-t1)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--d-t4)', marginTop: 1 }}>{t.badge}</div>
                  </div>
                </div>))}
            </div>
          </div>)}

        {/* ── LIVE DASHBOARD ── */}
        {isLive && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Status Banner */}
            <div style={{ background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', border: '1px solid #6ee7b7', borderRadius: 16, padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 0 3px rgba(34,197,94,0.25)', animation: 'pulse 2s infinite' }}/>
                <div>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1rem' }}>Website: LIVE</div>
                  <a href={storeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    {storeUrl} <ExternalLink size={11}/>
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button onClick={() => handleCopy(storeUrl, 'url')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.45rem 0.9rem', background: '#ffffff', border: '1px solid #6ee7b7', borderRadius: 8, fontSize: '0.78rem', fontWeight: 700, color: '#059669', cursor: 'pointer' }}>
                  {copied === 'url' ? <><Check size={12}/> Copied!</> : <><Copy size={12}/> Copy URL</>}
                </button>
                <button onClick={() => setShowWizard(true)} className={styles.actionBtn}>
                  <Edit3 size={13}/> Edit Website
                </button>
                <button onClick={() => setShowDomainPanel(true)} className={styles.actionBtn}>
                  <Link2 size={13}/> Domain Settings
                </button>
                <a href={storeUrl} target="_blank" rel="noreferrer" className={styles.actionBtnPrimary} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <Eye size={13}/> Preview
                </a>
              </div>
            </div>

            {/* Analytics KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1rem' }}>
              {[
                { label: 'Visitors (7d)', value: settings.analytics?.visitors_7d?.toLocaleString() || '—', icon: Users, bg: '#eff6ff', color: '#1d4ed8', trend: '+12%' },
                { label: 'Product Views', value: settings.analytics?.product_views?.toLocaleString() || '—', icon: Eye, bg: '#f5f3ff', color: '#6d28d9', trend: '+8%' },
                { label: 'Add to Cart', value: settings.analytics?.add_to_cart?.toLocaleString() || '—', icon: ShoppingCart, bg: '#fef3c7', color: '#d97706', trend: '+21%' },
                { label: 'Website Orders', value: settings.analytics?.orders?.toLocaleString() || '—', icon: Package, bg: '#dcfce7', color: '#16a34a', trend: '+5%' },
                { label: 'Revenue', value: settings.analytics?.revenue ? `$${settings.analytics.revenue.toLocaleString()}` : '—', icon: DollarSign, bg: '#fce7f3', color: '#be185d', trend: '+15%' },
            ].map(s => (<div key={s.label} className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <div className={styles.kpiIconWrap} style={{ background: s.bg }}>
                      <s.icon size={17} color={s.color}/>
                    </div>
                    <span className={`${styles.kpiTrend} ${styles.trendUp}`}>{s.trend}</span>
                  </div>
                  <div className={styles.kpiLabel}>{s.label}</div>
                  <div className={styles.kpiValue}>{s.value}</div>
                </div>))}
            </div>

            {/* Info Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              {/* Template info */}
              <div className={styles.panel} style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--d-t4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Active Template</div>
                    {(() => {
                const t = TEMPLATES.find(t => t.id === settings.template) || TEMPLATES[0];
                return (<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 9, background: t.preview, flexShrink: 0 }}/>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--d-t1)' }}>{t.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--d-t4)' }}>{t.vibe}</div>
                          </div>
                        </div>);
            })()}
                  </div>
                  <button onClick={() => { setShowWizard(true); setWizardStep(1); }} className={styles.actionBtn} style={{ fontSize: '0.72rem' }}>
                    Change
                  </button>
                </div>
              </div>

              {/* Domain info */}
              <div className={styles.panel} style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--d-t4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Domains</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>{storeUrl.replace('http://localhost:3000', '').replace('https://', '')}</span>
                        <span style={{ fontSize: '0.62rem', fontWeight: 700, background: '#d1fae5', color: '#15803d', padding: '1px 6px', borderRadius: 99 }}>Active</span>
                      </div>
                      {settings.custom_domain ? (<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--d-t2)', fontWeight: 600 }}>{settings.custom_domain}</span>
                          {(() => {
                    const cfg = DOMAIN_STATUS_CONFIG[settings.domain_status] || DOMAIN_STATUS_CONFIG.not_connected;
                    return <span style={{ fontSize: '0.62rem', fontWeight: 700, background: cfg.bg, color: cfg.color, padding: '1px 6px', borderRadius: 99 }}>{cfg.label}</span>;
                })()}
                        </div>) : (<button onClick={() => setShowDomainPanel(true)} style={{ background: 'none', border: 'none', color: 'var(--vs-green)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                          + Connect custom domain
                        </button>)}
                    </div>
                  </div>
                  <button onClick={() => setShowDomainPanel(true)} className={styles.actionBtn} style={{ fontSize: '0.72rem' }}>
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Unpublish */}
            <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
              <button onClick={() => doAction('unpublish')} style={{ background: 'none', border: 'none', color: 'var(--d-t4)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}>
                Unpublish website
              </button>
            </div>
          </div>)}

        {/* Unpublished state */}
        {settings.status === 'unpublished' && (<div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--d-t2)', marginBottom: '0.5rem' }}>Website Unpublished</div>
            <div style={{ fontSize: '0.84rem', color: 'var(--d-t4)', marginBottom: '1.5rem' }}>Your store is not publicly visible. Republish to go live again.</div>
            <button className={styles.btnPrimary} onClick={() => doAction('publish')}>
              <Globe size={15}/> Republish Website
            </button>
          </div>)}
      </div>

      {/* ══════════════════════════════════════
            5-STEP CREATION / EDIT WIZARD MODAL
        ══════════════════════════════════════ */}
      {showWizard && (<div className={styles.overlay} onClick={() => setShowWizard(false)}>
          <div className={styles.modal} style={{ maxWidth: 820 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalTitle}>
                  {isLive ? 'Edit Your Website' : 'Create Your Website'}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--d-t4)', marginTop: 2 }}>
                  Step {wizardStep} of 5 — {['Choose Template', 'Brand Your Store', 'Your Subdomain', 'Custom Domain (Optional)', 'Preview & Publish'][wizardStep - 1]}
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowWizard(false)}>✕</button>
            </div>

            {/* Step pills */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--d-border2)', padding: '0 1.5rem', overflow: 'auto' }}>
              {['Template', 'Branding', 'Subdomain', 'Domain', 'Publish'].map((label, i) => {
                const n = i + 1;
                const active = wizardStep === n;
                const done = wizardStep > n;
                return (<button key={label} onClick={() => setWizardStep(n)} style={{
                        padding: '0.75rem 1rem', background: 'none', border: 'none',
                        fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                        borderBottom: active ? '2.5px solid var(--vs-lime)' : '2.5px solid transparent',
                        color: active ? 'var(--vs-green)' : done ? '#10b981' : 'var(--d-t4)',
                        display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                    <span style={{
                        width: 18, height: 18, borderRadius: '50%', fontSize: '0.65rem', fontWeight: 800,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: done ? '#10b981' : active ? 'var(--vs-green)' : 'var(--d-border)',
                        color: done || active ? 'var(--vs-lime)' : 'var(--d-t3)',
                    }}>{done ? '✓' : n}</span>
                    {label}
                  </button>);
            })}
            </div>

            <div className={styles.modalBody} style={{ minHeight: 400 }}>

              {/* STEP 1: TEMPLATE */}
              {wizardStep === 1 && (<div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)', marginBottom: '1.25rem' }}>
                    Choose a template that matches your brand. You can always change it later.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.85rem' }}>
                    {TEMPLATES.map(t => (<div key={t.id} onClick={() => setSelectedTemplate(t.id)} style={{
                        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                        border: selectedTemplate === t.id ? '2.5px solid var(--vs-lime)' : '2px solid var(--d-border)',
                        boxShadow: selectedTemplate === t.id ? '0 0 0 3px var(--vs-lime-soft)' : 'none',
                        transition: 'all 0.2s', position: 'relative',
                    }}>
                        {selectedTemplate === t.id && (<div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: 'var(--vs-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                            <Check size={12} color="var(--vs-lime)"/>
                          </div>)}
                        {/* Preview */}
                        <div style={{ height: 100, background: t.preview, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '0.5rem 0.75rem', position: 'relative' }}>
                          <span style={{ fontSize: '0.55rem', fontWeight: 900, color: t.textColor, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7 }}>{t.name.toUpperCase()}</span>
                          <div style={{ width: '60%', height: 2, background: t.accent, marginTop: 3 }}/>
                          <span style={{ fontSize: '0.65rem', fontWeight: 400, color: t.textColor, opacity: 0.5, marginTop: 2 }}>Collection</span>
                        </div>
                        <div style={{ padding: '0.75rem', background: 'var(--d-panel)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--d-t1)' }}>{t.name}</span>
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, background: 'var(--vs-lime-soft)', color: 'var(--vs-green)', padding: '1px 6px', borderRadius: 99 }}>{t.badge}</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--d-t3)' }}>{t.desc}</div>
                          <div style={{ fontSize: '0.66rem', color: 'var(--d-t4)', marginTop: 3 }}>{t.vibe}</div>
                        </div>
                      </div>))}
                  </div>
                </div>)}

              {/* STEP 2: BRANDING */}
              {wizardStep === 2 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)', marginBottom: '0.25rem' }}>
                    Customize your store's identity. These details appear on your public storefront.
                  </div>
                  <div className={styles.fRow}>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Store Name *</label>
                      <input className={styles.fInput} placeholder="e.g. Urban Threads" value={branding.store_name} onChange={e => setBranding(p => ({ ...p, store_name: e.target.value }))}/>
                    </div>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Brand Accent Color</label>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="color" value={branding.accent_color} onChange={e => setBranding(p => ({ ...p, accent_color: e.target.value }))} style={{ width: 44, height: 40, border: '1px solid var(--d-border)', borderRadius: 8, cursor: 'pointer', padding: 2 }}/>
                        <input className={styles.fInput} value={branding.accent_color} onChange={e => setBranding(p => ({ ...p, accent_color: e.target.value }))} style={{ flex: 1 }}/>
                      </div>
                    </div>
                  </div>
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Store Tagline</label>
                    <input className={styles.fInput} placeholder="e.g. Discover your style." value={branding.tagline} onChange={e => setBranding(p => ({ ...p, tagline: e.target.value }))}/>
                  </div>
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Store Description</label>
                    <textarea className={styles.fTextarea} placeholder="Tell your brand story — what makes your store unique?" value={branding.description} onChange={e => setBranding(p => ({ ...p, description: e.target.value }))} style={{ minHeight: 80 }}/>
                  </div>
                  <div className={styles.fRow}>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Logo URL (optional)</label>
                      <input className={styles.fInput} placeholder="https://..." value={branding.logo_url} onChange={e => setBranding(p => ({ ...p, logo_url: e.target.value }))}/>
                    </div>
                    <div className={styles.fGroup}>
                      <label className={styles.fLabel}>Hero Banner Image URL (optional)</label>
                      <input className={styles.fInput} placeholder="https://..." value={branding.hero_image} onChange={e => setBranding(p => ({ ...p, hero_image: e.target.value }))}/>
                    </div>
                  </div>
                  {/* Live preview strip */}
                  {branding.store_name && (<div style={{ marginTop: '0.5rem', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--d-border)' }}>
                      <div style={{ background: branding.accent_color, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', color: '#fff' }}>
                          {branding.store_name.substring(0, 1).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{branding.store_name}</span>
                      </div>
                      <div style={{ background: '#f8f9ff', padding: '0.65rem 1rem', fontSize: '0.75rem', color: '#64748b' }}>
                        {branding.tagline || 'Your tagline appears here'}
                      </div>
                    </div>)}
                </div>)}

              {/* STEP 3: SUBDOMAIN */}
              {wizardStep === 3 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)' }}>
                    Choose your VogueSocial subdomain. This is the free URL your customers will use to visit your store.
                  </div>
                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Your Subdomain</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid var(--d-border)', borderRadius: 10, overflow: 'hidden' }}>
                      <input style={{ flex: 1, padding: '0.65rem 0.85rem', border: 'none', outline: 'none', background: 'var(--d-input)', fontSize: '0.9rem', color: 'var(--d-t1)', fontWeight: 700 }} placeholder="urbanthreads" value={subdomain} onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/\s/g, '-'))}/>
                      <span style={{ padding: '0 1rem', background: 'var(--d-card)', color: 'var(--d-t3)', fontSize: '0.82rem', fontWeight: 600, borderLeft: '1px solid var(--d-border)', height: '100%', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                        .voguesocial.com
                      </span>
                    </div>
                  </div>
                  {subdomain && (<div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={16} color="#16a34a"/>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#15803d' }}>
                          /store/{subdomain} is available
                        </span>
                      </div>
                      <button onClick={() => handleCopy(`/store/${subdomain}`, 'sub')} style={{ background: 'none', border: 'none', color: '#059669', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {copied === 'sub' ? <><Check size={11}/> Copied</> : <><Copy size={11}/> Copy</>}
                      </button>
                    </div>)}
                  <div style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 10, padding: '0.85rem 1.1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Tips for a great subdomain</div>
                    {['Use your brand or store name', 'Keep it short and memorable', 'Only lowercase letters, numbers, and hyphens', 'Avoid generic words like "store" or "shop"'].map(tip => (<div key={tip} style={{ fontSize: '0.78rem', color: 'var(--d-t2)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ color: 'var(--vs-green)' }}>→</span> {tip}
                      </div>))}
                  </div>
                </div>)}

              {/* STEP 4: CUSTOM DOMAIN */}
              {wizardStep === 4 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--d-t3)', flex: 1 }}>
                      Connect your own domain (e.g. <code style={{ background: 'var(--d-card)', padding: '1px 6px', borderRadius: 4 }}>www.urbanthreads.com</code>). This step is optional — you can skip and use your free subdomain.
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap' }}>Optional</span>
                  </div>

                  <div className={styles.fGroup}>
                    <label className={styles.fLabel}>Your Domain</label>
                    <input className={styles.fInput} placeholder="www.yourdomain.com" value={customDomain} onChange={e => setCustomDomain(e.target.value)}/>
                  </div>

                  {customDomain && (<div style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 14, padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--d-t1)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldCheck size={15} color="var(--vs-green)"/> DNS Records to Add
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                          <thead>
                            <tr style={{ background: 'var(--d-hover)' }}>
                              {['Type', 'Host', 'Value', 'TTL'].map(h => (<th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left', fontWeight: 700, color: 'var(--d-t3)', borderBottom: '1px solid var(--d-border)' }}>{h}</th>))}
                            </tr>
                          </thead>
                          <tbody>
                            {[
                        { type: 'CNAME', host: 'www', value: 'stores.voguesocial.com', ttl: '3600' },
                        { type: 'A', host: '@', value: '76.76.21.21', ttl: '3600' },
                    ].map((r, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--d-border2)' }}>
                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 800, color: 'var(--vs-green)' }}>{r.type}</td>
                                <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', color: 'var(--d-t1)' }}>{r.host}</td>
                                <td style={{ padding: '0.6rem 0.75rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <code style={{ background: 'var(--d-input)', padding: '2px 8px', borderRadius: 5, fontSize: '0.75rem', color: 'var(--d-t1)' }}>{r.value}</code>
                                    <button onClick={() => handleCopy(r.value, `dns-${i}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--d-t4)', display: 'flex', alignItems: 'center' }}>
                                      {copied === `dns-${i}` ? <Check size={11} color="#16a34a"/> : <Copy size={11}/>}
                                    </button>
                                  </div>
                                </td>
                                <td style={{ padding: '0.6rem 0.75rem', color: 'var(--d-t4)' }}>{r.ttl}s</td>
                              </tr>))}
                          </tbody>
                        </table>
                      </div>
                      <div style={{ marginTop: '0.85rem', fontSize: '0.74rem', color: 'var(--d-t4)', lineHeight: 1.5 }}>
                        ⏱ DNS changes can take 24–48 hours to propagate. SSL is automatically provisioned once your domain is verified.
                      </div>
                    </div>)}

                  {/* Domain status */}
                  {settings.custom_domain && (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: DOMAIN_STATUS_CONFIG[settings.domain_status]?.bg || '#f3f4f6', borderRadius: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 700, color: DOMAIN_STATUS_CONFIG[settings.domain_status]?.color }}>
                        Status: {DOMAIN_STATUS_CONFIG[settings.domain_status]?.label}
                      </div>
                      <button onClick={async () => {
                        setCheckingDomain(true);
                        await doAction('check_domain');
                        setCheckingDomain(false);
                    }} className={styles.actionBtn} style={{ fontSize: '0.72rem' }}>
                        {checkingDomain ? <Loader2 size={11}/> : <RefreshCw size={11}/>} Check Status
                      </button>
                    </div>)}
                </div>)}

              {/* STEP 5: PREVIEW & PUBLISH */}
              {wizardStep === 5 && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Summary card */}
                  <div style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 14, padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--vs-green)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.85rem' }}>
                      Your Website Summary
                    </div>
                    {[
                    { label: 'Template', value: TEMPLATES.find(t => t.id === selectedTemplate)?.name || selectedTemplate },
                    { label: 'Store Name', value: branding.store_name || '—' },
                    { label: 'Tagline', value: branding.tagline || '—' },
                    { label: 'Subdomain', value: subdomain ? `/store/${subdomain}` : '—' },
                    { label: 'Custom Domain', value: customDomain || 'Not set' },
                ].map(r => (<div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0', borderBottom: '1px solid rgba(2,35,28,0.1)', fontSize: '0.82rem' }}>
                        <span style={{ color: 'var(--vs-green)', fontWeight: 600 }}>{r.label}</span>
                        <span style={{ color: 'var(--vs-green)', fontWeight: 700 }}>{r.value}</span>
                      </div>))}
                  </div>

                  {/* Mini browser mockup */}
                  {(() => {
                    const t = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];
                    return (<div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--d-border)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
                        {/* Browser chrome */}
                        <div style={{ background: '#f1f5f9', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {['#ef4444', '#f59e0b', '#22c55e'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }}/>)}
                          </div>
                          <div style={{ flex: 1, background: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: '0.68rem', color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                            voguesocial.com/store/{subdomain || 'your-store'}
                          </div>
                        </div>
                        {/* Store preview */}
                        <div style={{ height: 140, background: t.preview, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: t.textColor, letterSpacing: '0.05em' }}>{(branding.store_name || 'YOUR STORE').toUpperCase()}</div>
                          <div style={{ fontSize: '0.72rem', color: t.textColor, opacity: 0.7 }}>{branding.tagline || 'Discover your style'}</div>
                          <div style={{ padding: '0.3rem 1rem', background: t.accent, color: t.bg, borderRadius: 4, fontSize: '0.65rem', fontWeight: 800, marginTop: 4 }}>SHOP COLLECTION</div>
                        </div>
                      </div>);
                })()}

                  <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={16}/> Your products are automatically synced — no manual setup needed.
                  </div>
                </div>)}
            </div>

            {/* Footer nav */}
            <div className={styles.modalFooter} style={{ justifyContent: 'space-between' }}>
              {wizardStep > 1
                ? <button className={styles.btnGhost} onClick={() => setWizardStep(wizardStep - 1)}><ArrowLeft size={14}/> Back</button>
                : <div />}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {wizardStep === 4 && (<button className={styles.btnGhost} onClick={() => setWizardStep(5)}>Skip for now</button>)}
                {wizardStep < 5 ? (<button className={styles.btnPrimary} onClick={() => setWizardStep(wizardStep + 1)}>
                    Next <ArrowRight size={14}/>
                  </button>) : (<button onClick={handlePublish} disabled={saving || !subdomain || !branding.store_name} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '0.65rem 1.75rem',
                    background: 'linear-gradient(135deg,#16a34a,#15803d)',
                    color: '#fff', border: 'none', borderRadius: 10,
                    fontWeight: 800, fontSize: '0.9rem', cursor: saving ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
                    opacity: (!subdomain || !branding.store_name) ? 0.6 : 1
                }}>
                    {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }}/> : <Globe size={16}/>}
                    {saving ? 'Publishing...' : isLive ? 'Save Changes' : '🚀 Publish Website'}
                  </button>)}
              </div>
            </div>
          </div>
        </div>)}

      {/* DOMAIN SETTINGS PANEL */}
      {showDomainPanel && (<div className={styles.overlay} onClick={() => setShowDomainPanel(false)}>
          <div className={styles.modal} style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}><Link2 size={16} style={{ display: 'inline', marginRight: 6 }}/>Domain Settings</div>
              <button className={styles.closeBtn} onClick={() => setShowDomainPanel(false)}>✕</button>
            </div>
            <div className={styles.modalBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Subdomain */}
              <div style={{ padding: '0.85rem 1rem', background: '#dcfce7', borderRadius: 10, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', marginBottom: 4 }}>Free Subdomain</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#15803d' }}>/store/{settings.store_handle}</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, background: '#16a34a', color: '#fff', padding: '1px 8px', borderRadius: 99 }}>ACTIVE</span>
                </div>
              </div>

              {/* Custom domain */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--d-t3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Custom Domain</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className={styles.fInput} placeholder="www.yourdomain.com" value={customDomain} onChange={e => setCustomDomain(e.target.value)} style={{ flex: 1 }}/>
                  <button className={styles.actionBtnPrimary} onClick={() => doAction('update_domain', { custom_domain: customDomain, domain_status: 'verifying' })}>Connect</button>
                </div>
              </div>

              {settings.custom_domain && (<>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.7rem 1rem', background: DOMAIN_STATUS_CONFIG[settings.domain_status]?.bg, borderRadius: 9 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: DOMAIN_STATUS_CONFIG[settings.domain_status]?.color }}>
                      {settings.custom_domain} — {DOMAIN_STATUS_CONFIG[settings.domain_status]?.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--d-t3)' }}>Add these DNS records at your domain registrar:</div>
                  {[
                    { type: 'CNAME', host: 'www', value: 'stores.voguesocial.com' },
                    { type: 'A', host: '@', value: '76.76.21.21' },
                ].map((r, i) => (<div key={i} style={{ display: 'flex', gap: 8, background: 'var(--d-card)', padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: '0.78rem', fontFamily: 'monospace', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: 'var(--vs-green)', width: 50 }}>{r.type}</span>
                      <span style={{ color: 'var(--d-t3)', width: 30 }}>{r.host}</span>
                      <span style={{ flex: 1, color: 'var(--d-t1)' }}>{r.value}</span>
                      <button onClick={() => handleCopy(r.value, `dp-${i}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--d-t4)' }}>
                        {copied === `dp-${i}` ? <Check size={11} color="#16a34a"/> : <Copy size={11}/>}
                      </button>
                    </div>))}
                </>)}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnGhost} onClick={() => setShowDomainPanel(false)}>Close</button>
            </div>
          </div>
        </div>)}

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
      `}</style>
    </>);
}
