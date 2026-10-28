'use client';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ShieldCheck,
  Truck,
  CreditCard,
  Cpu,
  Database,
  Terminal,
  Smartphone,
  Search,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Lock,
  Sparkles,
  Layers,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  FileCode,
  Box,
  Globe,
  DollarSign,
  Users,
  Store,
  ShoppingBag,
  Eye,
  BarChart3,
  Zap,
  Sliders,
  Scissors,
  FileText,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserPlus,
  AlertTriangle
} from 'lucide-react';
import { DOC_SECTIONS, GLOSSARY_TERMS } from './documentationData';
import './DocumentationPage.css';

export default function DocumentationPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState(null);
  const [testAwb, setTestAwb] = useState('FX28301948IN');

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2200);
  };

  const detectedCarrier = useMemo(() => {
    const num = (testAwb || '').trim().replace(/[\s-]+/g, '').toUpperCase();
    if (!num) return null;
    if (/^1Z[A-Z0-9]{16}$/i.test(num) || /^1Z/i.test(num)) return 'UPS';
    if (/^(94|92|93|95)\d{18,20}$/.test(num) || /^[A-Z]{2}\d{9}US$/i.test(num)) return 'USPS Priority Mail';
    if (/^[A-Z]{2}\d{9}GB$/i.test(num)) return 'Royal Mail';
    if (/^BD\d+/i.test(num)) return 'Blue Dart';
    if (/^FX/i.test(num) || /^\d{12}$/.test(num) || /^\d{15}$/.test(num)) return 'FedEx';
    if (/^\d{10}$/.test(num) || /^J(J)?D/i.test(num)) return 'DHL Express';
    return 'Unknown Carrier (Self-Fulfill)';
  }, [testAwb]);

  const filteredGlossary = useMemo(() => {
    return GLOSSARY_TERMS.filter((item) => {
      const matchCat = glossaryCategory === 'all' || item.category.toLowerCase() === glossaryCategory.toLowerCase();
      const matchQuery =
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [glossaryCategory, searchQuery]);

  return (
    <div className="doc-wrapper">
      {/* MINIMALIST LIGHT NAVBAR */}
      <header className="doc-navbar">
        <div className="doc-nav-left">
          <div className="doc-brand-title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span>VogueSocial</span>
            <span className="doc-brand-badge">Docs</span>
          </div>
          <span className="doc-version-pill">v1.0 Architecture Blueprint</span>
        </div>

        <div className="doc-nav-search">
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search architecture, payments, APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="doc-kbd-shortcut">⌘K</span>
        </div>

        <div className="doc-nav-right">
          <button
            type="button"
            className="doc-nav-btn"
            onClick={() => setActiveSection('glossary')}
          >
            <HelpCircle size={14} />
            <span>Glossary</span>
          </button>
          <button
            type="button"
            className="doc-nav-btn"
            onClick={() => navigate('/shop')}
          >
            <span>Live Shop</span>
            <ExternalLink size={12} />
          </button>
          <button
            type="button"
            className="doc-nav-btn primary"
            onClick={() => navigate('/merchant')}
          >
            <span>Merchant Portal</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* MAIN DOCUMENTATION LAYOUT */}
      <div className="doc-layout">
        {/* LEFT CLEAN SIDEBAR */}
        <aside className="doc-sidebar">
          {['Architecture', 'Finance & Payments', 'Logistics', 'Computer Vision', 'Data Architecture', 'Developer Reference', 'Flutter Client', 'Reference'].map((cat) => {
            const items = DOC_SECTIONS.filter((s) => s.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="doc-sidebar-category">
                <div className="doc-category-title">{cat}</div>
                {items.map((sec) => (
                  <div
                    key={sec.id}
                    className={`doc-menu-item ${activeSection === sec.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(sec.id)}
                  >
                    <span>{sec.title}</span>
                    {sec.badge && (
                      <span className={`doc-item-badge ${sec.badge === 'Critical' ? 'hot' : ''}`}>
                        {sec.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </aside>

        {/* CENTER CLEAN CONTENT */}
        <main className="doc-content-area">
          {/* SECTION: SYSTEM OVERVIEW & ARCHITECTURE */}
          {activeSection === 'overview' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">Platform Foundation</span>
                  <span className="doc-tag">Executive Overview</span>
                  <span className="doc-tag">Social Commerce</span>
                  <span className="doc-tag">Creator Ecosystem</span>
                  <span className="doc-tag">Production v1.0</span>
                </div>
                <h1 className="doc-article-title">What is VogueSocial? Platform Overview & Features</h1>
                <p className="doc-article-lead">
                  VogueSocial is a next-generation luxury social commerce marketplace and creator ecosystem. It fuses interactive community engagement—double-click likes, merchant discussion threads, viral look sharing, brand following, and an interactive digital wardrobe canvas—with real-time AI virtual try-on, autonomous branded storefronts, and automated Stripe escrow custody.
                </p>
              </div>

              {/* MISSION & PARADIGM SHIFT */}
              <div className="doc-callout info">
                <ShieldCheck size={20} className="doc-callout-icon" color="#0284c7" />
                <div className="doc-callout-body">
                  <div className="doc-callout-title">The Paradigm Shift: From Middlemen to Direct Independent Brand Commerce</div>
                  Traditional luxury retail is plagued by two extremes: legacy department stores taking 40–60% margins with 90-day delayed payouts, or fragmented independent merchant websites suffering from 35%+ sizing return rates and lack of buyer trust. <strong>VogueSocial solves both</strong> by providing independent merchants and brands with instant AI virtual fitting, zero-code autonomous luxury storefronts, built-in social discovery tools, and automated escrow payouts that protect both buyer and merchant.
                </div>
              </div>

              {/* SOCIAL ASPECTS & DIGITAL WARDROBE SPOTLIGHT */}
              <div className="doc-social-showcase">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                        The "Social" in VogueSocial: Community, Engagement & Wardrobe
                      </h3>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                        Transforming high fashion from cold transactions into an interactive, creator-driven social ecosystem.
                      </p>
                    </div>
                  </div>
                  <span className="doc-tag" style={{ background: '#fdf2f8', color: '#db2777', borderColor: '#fbcfe8' }}>
                    Social Features
                  </span>
                </div>

                {/* 5 CORE SOCIAL INTERACTIONS */}
                <div className="doc-social-grid">
                  <div className="doc-social-pill-card">
                    <div className="doc-social-pill-header">
                      <Heart size={16} color="#e11d48" />
                      <span>Double-Click to Like</span>
                    </div>
                    <p className="doc-social-pill-desc">
                      Instagram-style double-tap gesture on garment visuals with heart animation. Powers real-time lookbook trend algorithms and community popularity counters (e.g. 1.2k+ likes).
                    </p>
                  </div>

                  <div className="doc-social-pill-card">
                    <div className="doc-social-pill-header">
                      <MessageCircle size={16} color="#0284c7" />
                      <span>Merchant & Product Comments</span>
                    </div>
                    <p className="doc-social-pill-desc">
                      Direct dialogue threads on garment pages. Shoppers discuss fabric drape, texture, styling advice, and sizing fit directly with the merchant brand and other buyers.
                    </p>
                  </div>

                  <div className="doc-social-pill-card">
                    <div className="doc-social-pill-header">
                      <Share2 size={16} color="#16a34a" />
                      <span>Viral Outfit Sharing</span>
                    </div>
                    <p className="doc-social-pill-desc">
                      1-click sharing of runway reels, individual pieces, and personal AI Virtual Try-On renders to Instagram, TikTok, and WhatsApp with deep-linked buy buttons.
                    </p>
                  </div>

                  <div className="doc-social-pill-card">
                    <div className="doc-social-pill-header">
                      <UserPlus size={16} color="#7c3aed" />
                      <span>Follow Merchants & Brands</span>
                    </div>
                    <p className="doc-social-pill-desc">
                      Subscribe directly to independent merchant profiles (e.g. Studio Label Paris). Shoppers receive drop alerts for seasonal runway previews and limited editions.
                    </p>
                  </div>

                  <div className="doc-social-pill-card">
                    <div className="doc-social-pill-header">
                      <Bookmark size={16} color="#d97706" />
                      <span>Save & Bookmark</span>
                    </div>
                    <p className="doc-social-pill-desc">
                      Curate personal luxury wishlists, save favorite silhouettes, and organize inspirations into custom capsule collections for upcoming events.
                    </p>
                  </div>
                </div>

                {/* DIGITAL WARDROBE DEEP-DIVE */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Layers size={18} color="#0f172a" />
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Interactive Digital Wardrobe Canvas (/wardrobe)</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '0.5rem' }}>
                        Your personal cloud closet for mixing, matching, and styling multi-brand outfits.
                      </span>
                    </div>
                  </div>

                  <div className="doc-wardrobe-showcase">
                    <div className="doc-wardrobe-box">
                      <div className="doc-wardrobe-box-title">
                        <Sliders size={15} color="#0284c7" />
                        <span>Multi-Garment Styling Canvas</span>
                      </div>
                      <p className="doc-wardrobe-box-text">
                        Layer tops, trousers, outerwear, footwear, and accessories simultaneously on a digital mannequin to test styling harmony, color palettes, and proportions before purchase.
                      </p>
                    </div>

                    <div className="doc-wardrobe-box">
                      <div className="doc-wardrobe-box-title">
                        <Sparkles size={15} color="#7c3aed" />
                        <span>Saved Virtual Try-On Looks</span>
                      </div>
                      <p className="doc-wardrobe-box-text">
                        Every AI try-on generated in the fitting room automatically archives into the user's permanent wardrobe vault, complete with personal silhouette fit scores and sizing data.
                      </p>
                    </div>

                    <div className="doc-wardrobe-box">
                      <div className="doc-wardrobe-box-title">
                        <ShoppingBag size={15} color="#16a34a" />
                        <span>Ensemble 1-Click Checkout</span>
                      </div>
                      <p className="doc-wardrobe-box-text">
                        Add an entire curated multi-item look (e.g. Silk Blouse + Pleated Trousers + Signature Coat) directly into the shopping bag with a single tap for seamless checkout.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STATS METRIC STRIP */}
              <div className="doc-stats-strip">
                <div className="doc-stat-card">
                  <div className="doc-stat-value">95%</div>
                  <div className="doc-stat-label">Net Merchant Payout</div>
                </div>
                <div className="doc-stat-card">
                  <div className="doc-stat-value">&lt; 1.8s</div>
                  <div className="doc-stat-label">WebGPU In-Browser AI</div>
                </div>
                <div className="doc-stat-card">
                  <div className="doc-stat-value">5 Themes</div>
                  <div className="doc-stat-label">Instant Storefronts</div>
                </div>
                <div className="doc-stat-card">
                  <div className="doc-stat-value">100%</div>
                  <div className="doc-stat-label">Escrow-Backed Safety</div>
                </div>
              </div>

              {/* THE THREE-PILLAR STAKEHOLDER MODEL */}
              <h2 className="doc-h2">
                <Users size={18} color="#0f172a" />
                <span>The Three-Pillar Stakeholder Ecosystem</span>
              </h2>
              <p className="doc-p">
                VogueSocial functions as a tripartite marketplace connecting shoppers, fashion merchants & brands, and an automated trust protocol:
              </p>

              <div className="doc-stakeholder-grid">
                {/* PILLAR 1: SHOPPERS */}
                <div className="doc-stakeholder-card">
                  <div className="doc-stakeholder-top">
                    <div className="doc-stakeholder-icon" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                      <ShoppingBag size={20} />
                    </div>
                    <span className="doc-tag blue">For Shoppers</span>
                  </div>
                  <h3 className="doc-stakeholder-title">Global Luxury Shoppers</h3>
                  <p className="doc-stakeholder-desc">
                    Discover exclusive runway and luxury fashion pieces, try them on virtually using personal photos & calibrated body dimensions, and buy with total escrow safety.
                  </p>
                  <ul className="doc-stakeholder-perks">
                    <li><Check size={14} color="#16a34a" /> Photorealistic AI Try-On on personal silhouette</li>
                    <li><Check size={14} color="#16a34a" /> 100% Buyer Protection (Escrow locks funds until delivery)</li>
                    <li><Check size={14} color="#16a34a" /> Social lookbook feed with 1-click try-on & shopping bag</li>
                    <li><Check size={14} color="#16a34a" /> Itemized luxury tax receipts with DHL / FedEx tracking</li>
                  </ul>
                </div>

                {/* PILLAR 2: MERCHANTS & BRANDS */}
                <div className="doc-stakeholder-card">
                  <div className="doc-stakeholder-top">
                    <div className="doc-stakeholder-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                      <Store size={20} />
                    </div>
                    <span className="doc-tag" style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}>For Merchants</span>
                  </div>
                  <h3 className="doc-stakeholder-title">Fashion Merchants & Brands</h3>
                  <p className="doc-stakeholder-desc">
                    Build an international direct-to-consumer luxury brand in minutes. Host custom-branded web storefronts with zero coding and keep 95% of revenues.
                  </p>
                  <ul className="doc-stakeholder-perks">
                    <li><Check size={14} color="#16a34a" /> 5 Luxury Themes with custom domains & branding</li>
                    <li><Check size={14} color="#16a34a" /> Direct-from-workshop fulfillment (Decentralized logistics)</li>
                    <li><Check size={14} color="#16a34a" /> Guaranteed 95% net payouts direct to connected bank</li>
                    <li><Check size={14} color="#16a34a" /> Built-in inventory matrix & dual-address RMA returns</li>
                  </ul>
                </div>

                {/* PILLAR 3: VOGUESOCIAL ENGINE */}
                <div className="doc-stakeholder-card">
                  <div className="doc-stakeholder-top">
                    <div className="doc-stakeholder-icon" style={{ background: '#faf5ff', color: '#7c3aed' }}>
                      <ShieldCheck size={20} />
                    </div>
                    <span className="doc-tag" style={{ background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }}>The Referee</span>
                  </div>
                  <h3 className="doc-stakeholder-title">VogueSocial Platform Engine</h3>
                  <p className="doc-stakeholder-desc">
                    Orchestrates multi-party trust, verifies authenticity, manages multi-carrier webhooks, and settles escrow transactions via Stripe Connect.
                  </p>
                  <ul className="doc-stakeholder-perks">
                    <li><Check size={14} color="#16a34a" /> Automated 5-Gate escrow verification before disbursement</li>
                    <li><Check size={14} color="#16a34a" /> Transparent flat 5% marketplace commission</li>
                    <li><Check size={14} color="#16a34a" /> Regex AWB Courier Auto-Detector (DHL, FedEx, UPS)</li>
                    <li><Check size={14} color="#16a34a" /> Serverless GPU cluster for ultra-low latency try-on</li>
                  </ul>
                </div>
              </div>

              {/* CORE FEATURES SUITE */}
              <h2 className="doc-h2">
                <Sparkles size={18} color="#0f172a" />
                <span>Comprehensive Feature Architecture</span>
              </h2>
              <p className="doc-p">
                Explore the 8 core pillar features that power the VogueSocial luxury fashion ecosystem:
              </p>

              <div className="doc-feature-grid">
                {/* FEATURE 1 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#faf5ff', color: '#7c3aed' }}>
                        <Sparkles size={18} />
                      </div>
                      <span className="doc-feature-tag purple">Computer Vision</span>
                    </div>
                    <span className="doc-term-cat">AI Studio</span>
                  </div>
                  <h3 className="doc-feature-title">1. AI Virtual Try-On Fitting Room</h3>
                  <p className="doc-feature-desc">
                    Eliminates fashion sizing guesswork by allowing shoppers to visualize garments draping realistically over their actual body proportions before purchasing.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> Client-side WebGPU background removal (<code>@imgly/background-removal</code>) in &lt;1.8s with zero server roundtrip.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Serverless GPU pipeline: DensePose body estimation + Thin-Plate Spline (TPS) warping + Latent Diffusion UNet.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Anthropometric silhouette calibration (Height, Weight, Bust, Waist, Hips) for accurate fabric physics.</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">WebGPU · ONNX · PyTorch · Latent Diffusion</span>
                  </div>
                </div>

                {/* FEATURE 2 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#fefce8', color: '#854d0e' }}>
                        <Store size={18} />
                      </div>
                      <span className="doc-feature-tag gold">E-Commerce Engine</span>
                    </div>
                    <span className="doc-term-cat">Storefronts</span>
                  </div>
                  <h3 className="doc-feature-title">2. Autonomous Merchant Luxury Storefronts</h3>
                  <p className="doc-feature-desc">
                    Instantly generates a dedicated, white-label e-commerce website for every onboarded merchant at <code>/store/:handle</code> or custom domains.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> 5 Curated Luxury Themes: Minimalist, Haute Luxury, Streetwear, Modernist, and Artisan Boutique.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Complete merchant customization: logos, hero imagery, taglines, accent palettes, and domain routing.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Independent shopping bag, quick-view modal, category filters, and live stock synchronization.</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">Next.js / React · Custom Domains · Dynamic CSS</span>
                  </div>
                </div>

                {/* FEATURE 3 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <ShieldCheck size={18} />
                      </div>
                      <span className="doc-feature-tag green">Financial Security</span>
                    </div>
                    <span className="doc-term-cat">Escrow Custody</span>
                  </div>
                  <h3 className="doc-feature-title">3. Stripe Connect Escrow Funds Custody</h3>
                  <p className="doc-feature-desc">
                    Protects buyers from non-delivery and merchants from chargebacks by holding customer payments in a segregated platform escrow vault until delivery.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> Separate Charges & Transfers pattern: platform charges buyer, holds balance, and transfers net on delivery.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Automated 95/5 split: 95% deposited to merchant's Stripe account; 5% retained as platform helper fee.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> 5-Gate automated payout verification + 48-hour post-delivery customer inspection window.</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">Stripe Connect · PaymentIntents · Radar 3DS</span>
                  </div>
                </div>

                {/* FEATURE 4 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                        <Truck size={18} />
                      </div>
                      <span className="doc-feature-tag blue">Logistics Automation</span>
                    </div>
                    <span className="doc-term-cat">Smart Logistics</span>
                  </div>
                  <h3 className="doc-feature-title">4. Intelligent Logistics & Carrier Auto-Detection</h3>
                  <p className="doc-feature-desc">
                    Eliminates manual courier selection by using real-time regex pattern matching on Airway Bill (AWB) tracking numbers.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> Instant carrier regex detection across DHL Express, FedEx, UPS, USPS, Blue Dart, and Royal Mail.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Automated webhook ingestion for shipping milestones (Dispatched → In Transit → Out for Delivery).</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Cryptographic Proof of Delivery (POD) collection with electronic signature and geolocation scan.</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">Regex AWB Engine · EasyPost Gateway · Webhooks</span>
                  </div>
                </div>

                {/* FEATURE 5 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
                        <Heart size={18} />
                      </div>
                      <span className="doc-feature-tag purple" style={{ background: '#fdf2f8', color: '#db2777', borderColor: '#fbcfe8' }}>Community Social</span>
                    </div>
                    <span className="doc-term-cat">Social Feed</span>
                  </div>
                  <h3 className="doc-feature-title">5. Social Community & Engagement Engine</h3>
                  <p className="doc-feature-desc">
                    Powers the high-engagement social fabric of the platform—turning garment discovery into an interactive dialogue between luxury shoppers and independent creators.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> <strong>Double-Click to Like:</strong> Micro-interaction gesture on garment media with real-time popularity ranking counters (e.g. 1.2k+ likes).</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> <strong>Product Discussion Threads:</strong> Community comments directly on product pages for styling advice, fabric feel, and merchant Q&amp;A.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> <strong>Viral Sharing &amp; Brand Follow:</strong> 1-click lookbook sharing to Instagram/TikTok/WhatsApp and following verified merchants &amp; brands (e.g. Studio Label Paris).</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">Social Domain Service · Distributed Cache · Real-time Graph Sync</span>
                  </div>
                </div>

                {/* FEATURE 6 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#faf5ff', color: '#7c3aed' }}>
                        <Layers size={18} />
                      </div>
                      <span className="doc-feature-tag purple">Wardrobe Studio</span>
                    </div>
                    <span className="doc-term-cat">Mix & Match</span>
                  </div>
                  <h3 className="doc-feature-title">6. Interactive Digital Wardrobe Canvas</h3>
                  <p className="doc-feature-desc">
                    Your personal cloud styling studio for mixing, matching, and curating multi-brand fashion capsules with live mannequin drag-and-drop.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> <strong>Multi-Garment Styling Canvas:</strong> Layer tops, trousers, outerwear, and footwear simultaneously to test styling harmony and proportion.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> <strong>Saved Virtual Try-On Archive:</strong> Every AI try-on generated in the fitting room archives permanently with personal silhouette fit scores.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> <strong>Ensemble 1-Click Checkout:</strong> Move an entire curated multi-piece outfit into your shopping bag in a single click.</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">HTML5 Canvas · Wardrobe State Engine · LocalStorage Sync</span>
                  </div>
                </div>

                {/* FEATURE 7 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                        <RotateCcw size={18} />
                      </div>
                      <span className="doc-feature-tag blue">Reverse Logistics</span>
                    </div>
                    <span className="doc-term-cat">Direct Returns</span>
                  </div>
                  <h3 className="doc-feature-title">7. Decentralized RMA & Dual-Address Routing</h3>
                  <p className="doc-feature-desc">
                    Solves the luxury marketplace returns dilemma by cleanly separating corporate headquarters registration from merchant return hubs.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> Dual-address architecture: corporate office for tax billing; direct merchant <code>return_warehouse_address</code> for physical returns.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Automated RMA return slip generator with tracking barcode and reason tracking (e.g., Fit / Sizing).</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Escrow dispute mediation: escrow funds freeze during open RMA until merchant confirms garment receipt.</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">Dual-Address Protocol · RMA State Machine</span>
                  </div>
                </div>

                {/* FEATURE 8 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                        <FileText size={18} />
                      </div>
                      <span className="doc-feature-tag green">Luxury Orders</span>
                    </div>
                    <span className="doc-term-cat">Invoicing</span>
                  </div>
                  <h3 className="doc-feature-title">8. Luxury Customer Invoices & Order Management</h3>
                  <p className="doc-feature-desc">
                    Prestigious e-commerce order management matching Farfetch, SSENSE, and Net-a-Porter standards with zero confusing internal escrow jargon.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> A4-ready printable tax invoices with corporate headquarters, VAT ID, and itemized garment rows.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Two-column party grid: Billed & Shipped To details vs Payment (Visa •••• 4242) and Carrier AWB.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Professional `@media print` rules for instant 1-click clean PDF receipt saving.</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">React · CSS @media print · Order Service</span>
                  </div>
                </div>

                {/* FEATURE 9 */}
                <div className="doc-feature-card">
                  <div className="doc-feature-header">
                    <div className="doc-feature-icon-badge">
                      <div className="doc-feature-icon-box" style={{ background: '#faf5ff', color: '#7c3aed' }}>
                        <Smartphone size={18} />
                      </div>
                      <span className="doc-feature-tag purple">Mobile Native</span>
                    </div>
                    <span className="doc-term-cat">iOS / Android</span>
                  </div>
                  <h3 className="doc-feature-title">9. Cross-Platform Native Mobile Experience</h3>
                  <p className="doc-feature-desc">
                    A high-performance Flutter 3.x native mobile client delivering buttery-smooth 60fps animations and offline luxury aesthetics.
                  </p>
                  <ul className="doc-feature-points">
                    <li><CheckCircle2 size={13} color="#16a34a" /> Swipeable full-screen runway reels with sound toggles and instant product purchase overlays.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Native AR camera integration for live selfie fitting room sessions.</li>
                    <li><CheckCircle2 size={13} color="#16a34a" /> Bundled offline cache of 72+ high-resolution luxury garment assets for instant offline browsing.</li>
                  </ul>
                  <div className="doc-feature-footer">
                    <span>Stack Integration:</span>
                    <span className="doc-feature-tech">Flutter 3.x · Dart · Provider · Video Player</span>
                  </div>
                </div>
              </div>

              {/* MASTER SYSTEM ARCHITECTURE BLUEPRINT */}
              <h2 className="doc-h2">
                <Layers size={18} color="#0f172a" />
                <span>Master System Architecture Blueprint</span>
              </h2>
              <p className="doc-p">
                End-to-end multi-tier architecture uniting client applications, edge security layers, modular domain microservices (runtime stack-agnostic), relational data persistence, and external third-party engines:
              </p>

              <div className="doc-arch-img-card">
                <div className="doc-arch-img-topbar">
                  <div className="doc-arch-img-title">
                    <Layers size={15} color="#0284c7" />
                    <span>VogueSocial – Complete Platform Topology & Core Transaction Flows</span>
                  </div>
                  <div className="doc-arch-img-actions">
                    <a
                      href="/voguesocial_system_architecture.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doc-arch-img-btn"
                    >
                      <ExternalLink size={12} />
                      <span>Open Full Size (4K)</span>
                    </a>
                  </div>
                </div>

                <div className="doc-arch-img-wrap">
                  <img
                    src="/voguesocial_system_architecture.jpg"
                    alt="VogueSocial Master System Architecture Diagram"
                    className="doc-arch-img"
                    onClick={() => window.open('/voguesocial_system_architecture.jpg', '_blank')}
                    style={{ cursor: 'zoom-in' }}
                    title="Click to expand architecture diagram in new tab"
                  />
                </div>

                <div className="doc-arch-img-caption">
                  <span>
                    <strong>Architecture Blueprint:</strong> Multi-Vendor Fashion Marketplace with AI Try-On, Escrow Payments, and Global Fulfilment.
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Tip: Click the diagram to open high-resolution 4K view
                  </span>
                </div>
              </div>

              {/* ARCHITECTURE DIAGRAM 1: MULTI-TIER SYSTEM TOPOLOGY */}
              <h3 className="doc-h3">Interactive Multi-Tier Layer Breakdown</h3>
              <p className="doc-p">
                Detailed view of the decoupled tiers connected through REST APIs, asynchronous webhooks, and client-side WebAssembly:
              </p>

              <div className="arch-diagram-canvas">
                {/* TIER 1: CLIENT APPLICATIONS */}
                <div className="arch-layer-box" style={{ borderLeft: '4px solid #0284c7' }}>
                  <div className="arch-layer-header">
                    <Globe size={14} color="#0284c7" />
                    <span>Tier 1: Client Application Layer</span>
                  </div>
                  <div className="arch-layer-grid">
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Web Application (React 18 + Vite)</div>
                      <div className="arch-pill-sub">Social Lookbook Feed, Shop Catalog, Digital Wardrobe Canvas</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Mobile App (Flutter 3.x Native)</div>
                      <div className="arch-pill-sub">iOS & Android Reels Swiper, Try-On Studio Mirror, Offline Assets</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Public Storefronts (/store/:handle)</div>
                      <div className="arch-pill-sub">5 Themed Luxury Storefronts (Minimal, Luxury, Streetwear, Modern, Boutique)</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Client Wasm AI (@imgly)</div>
                      <div className="arch-pill-sub">In-browser zero-latency garment background removal via WebGPU</div>
                    </div>
                  </div>
                </div>

                <div className="arch-connector-line">
                  <span>↓ REST API Requests & Static Asset CDN ↓</span>
                </div>

                {/* TIER 2: EDGE GATEWAY & AUTH */}
                <div className="arch-layer-box" style={{ borderLeft: '4px solid #7c3aed' }}>
                  <div className="arch-layer-header">
                    <Lock size={14} color="#7c3aed" />
                    <span>Tier 2: Edge Gateway & Security Layer</span>
                  </div>
                  <div className="arch-layer-grid">
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Edge Routing & Reverse Proxy</div>
                      <div className="arch-pill-sub">Subdomain routing (e.g. studiolabel.voguesocial.com)</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Auth & Role Guard</div>
                      <div className="arch-pill-sub">JWT sessions (Shopper, Fashion Merchant, Platform Admin)</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Webhook Receiver Dispatcher</div>
                      <div className="arch-pill-sub">HMAC verified ingestion for /webhooks/shipping & /webhooks/stripe</div>
                    </div>
                  </div>
                </div>

                <div className="arch-connector-line">
                  <span>↓ Core Business Domain Logic ↓</span>
                </div>

                {/* TIER 3: CORE DOMAIN SERVICES */}
                <div className="arch-layer-box" style={{ borderLeft: '4px solid #16a34a' }}>
                  <div className="arch-layer-header">
                    <Box size={14} color="#16a34a" />
                    <span>Tier 3: Core Domain Microservices (Runtime Agnostic)</span>
                  </div>
                  <div className="arch-layer-grid">
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Escrow Settlement Engine</div>
                      <div className="arch-pill-sub">Stripe Connect 5-Gate Payout Verifier & 95/5 Split Manager</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Order & Inventory Service</div>
                      <div className="arch-pill-sub">Multi-vendor cart grouping, variant inventory decrements</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Logistics & POD Engine</div>
                      <div className="arch-pill-sub">Regex AWB Courier Auto-Detector (DHL, FedEx, UPS, Blue Dart)</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Dispute & RMA Service</div>
                      <div className="arch-pill-sub">Dual-address return routing to merchant return_warehouse_address</div>
                    </div>
                  </div>
                </div>

                <div className="arch-connector-line">
                  <span>↓ Infrastructure & External Service Integrations ↓</span>
                </div>

                {/* TIER 4: EXTERNAL INTEGRATIONS */}
                <div className="arch-layer-box" style={{ borderLeft: '4px solid #d97706' }}>
                  <div className="arch-layer-header">
                    <Cpu size={14} color="#d97706" />
                    <span>Tier 4: GPU Inference & Financial Infrastructure</span>
                  </div>
                  <div className="arch-layer-grid">
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">RunPod Serverless GPU Cluster</div>
                      <div className="arch-pill-sub">RTX 4090 / A100: DensePose + TPS Warping + Latent Diffusion UNet</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Stripe Connect Vault</div>
                      <div className="arch-pill-sub">Separate Charges & Transfers escrow holding platform account</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">EasyPost Universal Gateway</div>
                      <div className="arch-pill-sub">Multi-carrier parcel tracking and Proof of Delivery (POD) webhooks</div>
                    </div>
                    <div className="arch-component-pill">
                      <div className="arch-pill-name">Relational Database Layer (e.g. PostgreSQL / Supabase)</div>
                      <div className="arch-pill-sub">Relational schema contract with JSON metadata &amp; RLS (Engine under evaluation)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TECH STACK TABLE */}
              <h2 className="doc-h2">
                <FileCode size={18} color="#0f172a" />
                <span>Tech Stack Matrix</span>
              </h2>

              <div className="doc-callout info">
                <Box size={20} className="doc-callout-icon" color="#0284c7" />
                <div className="doc-callout-body">
                  <div className="doc-callout-title">Backend Architecture: Contract-First &amp; Stack-Agnostic</div>
                  VogueSocial's core backend architecture is engineered contract-first around standardized OpenAPI REST interfaces, asynchronous courier/Stripe webhook ingestors, and strict relational data models. The concrete backend runtime (e.g. Node.js/TypeScript, Go, or Python) and managed database hosting provider remain under active evaluation and can be deployed to any modern cloud infrastructure without altering client or payment contracts.
                </div>
              </div>

              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Layer</th>
                      <th>Primary Technology</th>
                      <th>Core Dependencies</th>
                      <th>Scope & Function</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Web Application</strong></td>
                      <td>React 18, Vite</td>
                      <td>React Router v6, Lucide React, Recharts</td>
                      <td>Public social feed, shop catalog, merchant portal suite, super-admin console.</td>
                    </tr>
                    <tr>
                      <td><strong>Mobile Client</strong></td>
                      <td>Flutter 3.x (Dart)</td>
                      <td>Provider, http, video_player, flutter_svg</td>
                      <td>Native iOS/Android app with reels video swiper and offline lookbooks (72 images).</td>
                    </tr>
                    <tr>
                      <td><strong>Backend Service Layer</strong></td>
                      <td><span className="doc-tag" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>Under Evaluation</span></td>
                      <td>OpenAPI / REST, Webhook Receivers</td>
                      <td>Escrow settlement engine, multi-vendor cart grouping, carrier AWB detection. Designed to strict API contracts (e.g. Node.js, Go, or Python).</td>
                    </tr>
                    <tr>
                      <td><strong>Database &amp; Persistence</strong></td>
                      <td><span className="doc-tag" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}>Under Evaluation</span></td>
                      <td>Relational SQL / JSONB schema contracts</td>
                      <td>Stores profiles, products, orders, and escrow ledger records (PostgreSQL, Supabase, or AWS RDS).</td>
                    </tr>
                    <tr>
                      <td><strong>In-Browser AI</strong></td>
                      <td>WebAssembly / WebGPU</td>
                      <td>@imgly/background-removal</td>
                      <td>Runs client-side background removal in &lt;1.8s without uploading images.</td>
                    </tr>
                    <tr>
                      <td><strong>GPU Try-On</strong></td>
                      <td>Python, PyTorch</td>
                      <td>FastAPI, CUDA, DensePose, Latent Diffusion</td>
                      <td>High-fidelity virtual garment draping, photorealistic wrinkles, and skin blending.</td>
                    </tr>
                    <tr>
                      <td><strong>Payments &amp; Escrow</strong></td>
                      <td>Stripe Connect API</td>
                      <td>PaymentIntents, Transfers, Radar 3DS</td>
                      <td>Captures customer funds, holds escrow, and transfers 95% net after delivery.</td>
                    </tr>
                    <tr>
                      <td><strong>Logistics Gateway</strong></td>
                      <td>EasyPost Gateway</td>
                      <td>Regex AWB Parser, Webhook Receiver</td>
                      <td>Carrier detection, live tracking milestones, and Proof of Delivery (POD).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {/* SECTION: HOW IT WORKS - THE REFEREE & ESCROW STORY */}
          {activeSection === 'how-it-works' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">Core Concept</span>
                  <span className="doc-tag">Money Flow Blueprint</span>
                  <span className="doc-tag">Referee Model</span>
                </div>
                <h1 className="doc-article-title">How VogueSocial Works: The Escrow Referee & Money Flow</h1>
                <p className="doc-article-lead">
                  A crystal-clear, step-by-step guide explaining how customer payments work, how money is safeguarded in escrow, how merchant bank accounts connect via Stripe, and how deliveries are verified.
                </p>
              </div>

              {/* REFEREE ANALOGY CALLOUT */}
              <div className="doc-callout tip" style={{ borderLeft: '4px solid #16a34a', padding: '1.25rem 1.5rem' }}>
                <ShieldCheck size={22} className="doc-callout-icon" color="#16a34a" />
                <div className="doc-callout-body">
                  <div className="doc-callout-title" style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                    The School Referee Analogy
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', lineHeight: 1.6, fontSize: '0.92rem', color: '#166534' }}>
                    Imagine <strong>VogueSocial</strong> is like a <strong>trusted referee</strong> at a school trading fair. If a student wants to buy a handmade jacket from another student, they don't just hand over the cash directly, because what if the jacket never arrives?
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.92rem', color: '#166534' }}>
                    Instead, <strong>VogueSocial holds the money in a safe lockbox (Escrow)</strong> until the jacket is physically handed over. Only when the delivery is 100% verified does VogueSocial unlock the box, hand <strong>$95</strong> to the seller, and keep <strong>$5</strong> as a helper fee.
                  </p>
                </div>
              </div>

              {/* THE BIG PICTURE: HOW MONEY MOVES */}
              <h2 className="doc-h2">
                <DollarSign size={18} color="#0f172a" />
                <span>The Big Picture: How Every Dollar Moves</span>
              </h2>
              <p className="doc-p">
                Follow the 4-step journey of an order—from customer checkout to final bank deposit:
              </p>

              <div className="arch-diagram-canvas">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
                  {/* STEP 1 */}
                  <div className="arch-layer-box" style={{ borderTop: '4px solid #0284c7' }}>
                    <div className="doc-node-step">Step 1: The Purchase</div>
                    <div className="arch-pill-name">Customer Pays $100</div>
                    <div className="doc-p" style={{ fontSize: '0.78rem', marginTop: '6px', lineHeight: 1.5 }}>
                      John enters his card on VogueSocial. Stripe acts as the cashier, charges the card, and deposits $100 into VogueSocial's Stripe vault.
                    </div>
                    <span className="doc-tag" style={{ background: '#e0f2fe', color: '#0369a1' }}>Status: PAID</span>
                  </div>

                  {/* STEP 2 */}
                  <div className="arch-layer-box" style={{ borderTop: '4px solid #7c3aed' }}>
                    <div className="doc-node-step">Step 2: The Lockbox</div>
                    <div className="arch-pill-name">Escrow Vault (Locked)</div>
                    <div className="doc-p" style={{ fontSize: '0.78rem', marginTop: '6px', lineHeight: 1.5 }}>
                      Money sits <strong>LOCKED</strong> in VogueSocial's platform vault. The merchant sees the order is confirmed, but <strong>cannot</strong> touch the cash yet.
                    </div>
                    <span className="doc-tag" style={{ background: '#f3e8ff', color: '#7e22ce' }}>Escrow: HELD</span>
                  </div>

                  {/* STEP 3 */}
                  <div className="arch-layer-box" style={{ borderTop: '4px solid #d97706' }}>
                    <div className="doc-node-step">Step 3: Delivery Proof</div>
                    <div className="arch-pill-name">Courier Rings Doorbell</div>
                    <div className="doc-p" style={{ fontSize: '0.78rem', marginTop: '6px', lineHeight: 1.5 }}>
                      Merchant ships with DHL/FedEx. Courier collects John's signature on pad. DHL sends automatic webhook: <em>"Delivered to John at 2:15 PM!"</em>
                    </div>
                    <span className="doc-tag" style={{ background: '#fef3c7', color: '#b45309' }}>POD: VERIFIED</span>
                  </div>

                  {/* STEP 4 */}
                  <div className="arch-layer-box" style={{ borderTop: '4px solid #16a34a' }}>
                    <div className="doc-node-step">Step 4: Unlock & Split</div>
                    <div className="arch-pill-name">95% Transferred to Bank</div>
                    <div className="doc-p" style={{ fontSize: '0.78rem', marginTop: '6px', lineHeight: 1.5 }}>
                      VogueSocial referee verifies proof. <strong>$95 (95%)</strong> transferred to merchant's bank account. <strong>$5 (5%)</strong> kept by VogueSocial.
                    </div>
                    <span className="doc-tag" style={{ background: '#dcfce7', color: '#15803d' }}>Escrow: RELEASED</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', padding: '0.85rem 1.15rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CreditCard size={18} color="#0f172a" />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>Looking for the Complete Technical Selling &amp; Escrow Architecture Diagram?</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Explore the 4-tier interactive pipeline diagram mapping APIs, Stripe webhooks, and 5-gate settlement.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="doc-nav-btn primary"
                    onClick={() => setActiveSection('payment-escrow')}
                  >
                    <span>View Architecture Diagram</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* QUESTION 1 */}
              <h2 className="doc-h2">
                <CreditCard size={18} color="#0f172a" />
                <span>Question 1: How does the customer's money come to VogueSocial?</span>
              </h2>
              <div className="doc-p">
                <ol style={{ paddingLeft: '1.25rem', lineHeight: 1.7, margin: 0 }}>
                  <li><strong>The Customer clicks "Pay $100"</strong>: John enters his credit card or Apple Pay on VogueSocial's website or mobile app.</li>
                  <li><strong>Stripe acts as the Cashier</strong>: VogueSocial securely asks Stripe: <em>"Please charge John's card $100 for Order #ORD-1841."</em></li>
                  <li><strong>The Money Lands in VogueSocial's Vault</strong>: Stripe takes $100 from John's bank and deposits it directly into <strong>VogueSocial's main Stripe Platform Account</strong>.</li>
                  <li><strong>The Money is Marked as "HELD"</strong>: Even though the cash is in VogueSocial's Stripe account, software flags that money with a label: <code>STATUS: ESCROW_HELD (Do NOT spend, this belongs to Order #ORD-1841)</code>.</li>
                </ol>
              </div>

              {/* QUESTION 2 */}
              <h2 className="doc-h2">
                <Lock size={18} color="#0f172a" />
                <span>Question 2: What is "Escrow" and how is money held?</span>
              </h2>
              <div className="doc-callout info">
                <div className="doc-callout-body">
                  <strong>"Escrow" is simply a digital piggy bank with a lock on it.</strong>
                  <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                    <li>The merchant wants to make sure John actually paid before they spend hours stitching a luxury silk blouse.</li>
                    <li>John wants to make sure the seller doesn't take his money and run away.</li>
                    <li><strong>The Solution</strong>: VogueSocial holds the $100 in the middle. The merchant sees: <em>"Yes! John paid, the money is safely locked in the vault. You can now ship the garment."</em></li>
                  </ul>
                </div>
              </div>

              {/* QUESTION 3 */}
              <h2 className="doc-h2">
                <Terminal size={18} color="#0f172a" />
                <span>Question 3: How does the Merchant connect their Stripe Account?</span>
              </h2>
              <p className="doc-p">
                Before a merchant is allowed to sell on VogueSocial, they must connect their bank account using <strong>Stripe Connect</strong>:
              </p>

              <div className="arch-diagram-canvas">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="doc-flow-node" style={{ minWidth: '180px' }}>
                    <div className="doc-node-step">1. Merchant Portal</div>
                    <div className="doc-node-title">Click "Connect Stripe"</div>
                    <div className="doc-node-desc">Merchant clicks connect in their Payout Settings.</div>
                  </div>
                  <div className="doc-flow-arrow">➔</div>
                  <div className="doc-flow-node" style={{ minWidth: '180px' }}>
                    <div className="doc-node-step">2. Secure Onboarding</div>
                    <div className="doc-node-title">Stripe Hosted KYC</div>
                    <div className="doc-node-desc">Merchant enters Business Name, Tax ID & Bank Routing Number.</div>
                  </div>
                  <div className="doc-flow-arrow">➔</div>
                  <div className="doc-flow-node" style={{ minWidth: '180px' }}>
                    <div className="doc-node-step">3. Unique Mailbox ID</div>
                    <div className="doc-node-title">acct_1Ox7Y8K92A8291</div>
                    <div className="doc-node-desc">Stripe returns merchant ID. VogueSocial saves it in the database.</div>
                  </div>
                  <div className="doc-flow-arrow">➔</div>
                  <div className="doc-flow-node" style={{ minWidth: '180px' }}>
                    <div className="doc-node-step">4. Ready for Payouts</div>
                    <div className="doc-node-title">Direct Digital Pipe</div>
                    <div className="doc-node-desc">VogueSocial now knows the exact digital pipe to send money to!</div>
                  </div>
                </div>
              </div>

              {/* QUESTION 4 */}
              <h2 className="doc-h2">
                <Truck size={18} color="#0f172a" />
                <span>Question 4: How does VogueSocial know the order is ACTUALLY delivered?</span>
              </h2>
              <p className="doc-p">
                VogueSocial does <strong>not</strong> rely on the merchant saying <em>"I shipped it, believe me!"</em> and does <strong>not</strong> make the buyer manually confirm. Instead, it talks directly to the <strong>courier companies</strong> (DHL, FedEx, UPS):
              </p>

              <div className="doc-diagram-card">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
                  <div className="arch-layer-box">
                    <div className="doc-node-step">1. Merchant Ships</div>
                    <div className="arch-pill-name">Merchant Gets AWB</div>
                    <div className="doc-p" style={{ fontSize: '0.74rem', marginTop: '4px' }}>
                      Merchant boxes garment & gets Airway Bill from DHL: <code>#DHL928410291</code>. Enters it in portal.
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">2. Webhook Tracking</div>
                    <div className="arch-pill-name">Automatic Courier Scans</div>
                    <div className="doc-p" style={{ fontSize: '0.74rem', marginTop: '4px' }}>
                      VogueSocial auto-detects DHL. Scans stream: <em>Paris Hub ➔ Flight ➔ Dubai Hub ➔ Out for Delivery</em>.
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">3. Proof of Delivery</div>
                    <div className="arch-pill-name">Doorstep Signature</div>
                    <div className="doc-p" style={{ fontSize: '0.74rem', marginTop: '4px' }}>
                      DHL driver rings doorbell. John signs electronic pad. Driver collects signature.
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">4. Webhook Alert</div>
                    <div className="arch-pill-name">POD Verified ✔</div>
                    <div className="doc-p" style={{ fontSize: '0.74rem', marginTop: '4px' }}>
                      DHL server instantly pushes webhook alert: <code>status: 'delivered', signed_by: 'John Miller'</code>. Order marked <strong>POD Verified</strong>!
                    </div>
                  </div>
                </div>
              </div>

              {/* QUESTION 5 */}
              <h2 className="doc-h2">
                <RotateCcw size={18} color="#0f172a" />
                <span>Question 5: How does the money get released and split?</span>
              </h2>
              <p className="doc-p">
                Once the delivery is verified, a <strong>48-hour safety timer</strong> starts (giving John time to inspect the fabric and ensure there are no defects or ripped seams). Once the 48 hours pass with no complaints:
              </p>

              <div className="arch-diagram-canvas">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="doc-flow-node" style={{ textAlign: 'center', minWidth: '180px' }}>
                    <div className="doc-node-title">$100.00 in Vault</div>
                    <div className="doc-node-desc">Locked in VogueSocial Escrow</div>
                  </div>
                  <div className="doc-flow-arrow" style={{ fontSize: '1.2rem' }}>➔</div>
                  <div className="doc-flow-node" style={{ textAlign: 'center', minWidth: '180px', border: '1px solid #0f172a' }}>
                    <div className="doc-node-step">Automatic Split Rule</div>
                    <div className="doc-node-title">5-Gate Check Passed</div>
                    <div className="doc-node-desc">Evaluates POD & KYC</div>
                  </div>
                  <div className="doc-flow-arrow" style={{ fontSize: '1.2rem' }}>➔</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '220px' }}>
                    <div className="doc-flow-node" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                      <div className="doc-node-step" style={{ color: '#166534' }}>Merchant Gets: $95.00 (95%)</div>
                      <div className="doc-node-desc" style={{ color: '#166534' }}>Transferred to acct_... and deposited to bank (JPMorgan Chase).</div>
                    </div>
                    <div className="doc-flow-node" style={{ background: '#f8fafc' }}>
                      <div className="doc-node-step" style={{ color: '#0f172a' }}>VogueSocial Keeps: $5.00 (5%)</div>
                      <div className="doc-node-desc">Platform helper commission retained in escrow account.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUMMARY TABLE */}
              <h2 className="doc-h2">
                <CheckCircle2 size={18} color="#0f172a" />
                <span>Summary Table: Quick Recap</span>
              </h2>
              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th style={{ width: '35%' }}>Question</th>
                      <th>Simple Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Where does customer money go first?</strong></td>
                      <td>Into <strong>VogueSocial's main Stripe Platform Account</strong>, locked in an escrow holding vault.</td>
                    </tr>
                    <tr>
                      <td><strong>Why can't the merchant take money immediately?</strong></td>
                      <td>It is locked in escrow until the customer physically receives the order and Proof of Delivery (POD) clears.</td>
                    </tr>
                    <tr>
                      <td><strong>How is the merchant's account connected?</strong></td>
                      <td>Through <strong>Stripe Connect</strong>. The merchant connects their bank once, and VogueSocial saves their unique <code>acct_...</code> ID.</td>
                    </tr>
                    <tr>
                      <td><strong>How does VogueSocial know the order arrived?</strong></td>
                      <td>Via <strong>Courier Webhooks</strong> (DHL / FedEx / UPS). The moment the customer signs for the parcel, the courier sends digital Proof of Delivery (POD).</td>
                    </tr>
                    <tr>
                      <td><strong>How is the money split?</strong></td>
                      <td>Automatically: <strong>95%</strong> goes to the merchant's bank account, and <strong>5%</strong> is kept by VogueSocial.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {/* SECTION: STRIPE ESCROW & PAYMENTS */}
          {activeSection === 'payment-escrow' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">Stripe Connect</span>
                  <span className="doc-tag">Escrow Custody Vault</span>
                  <span className="doc-tag">Separate Charges & Transfers</span>
                  <span className="doc-tag">5-Gate Verification</span>
                </div>
                <h1 className="doc-article-title">Stripe Connect & Escrow Architecture</h1>
                <p className="doc-article-lead">
                  A comprehensive, real-world operational guide explaining how customer funds are collected, safely quarantined in platform escrow custody, and programmatically released to merchant bank accounts following verified physical delivery.
                </p>
              </div>

              {/* SECTION 1: THE CORE PROBLEM & REAL-WORLD MENTAL MODEL */}
              <div className="doc-callout info" style={{ borderLeft: '4px solid #7c3aed', padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
                <Lock size={22} className="doc-callout-icon" color="#7c3aed" />
                <div className="doc-callout-body">
                  <div className="doc-callout-title" style={{ fontSize: '1.05rem', color: '#581c87', marginBottom: '0.4rem' }}>
                    The Core Principle: Why Escrow Exists in Luxury Commerce
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', lineHeight: 1.6, fontSize: '0.88rem', color: '#4c1d95' }}>
                    In traditional e-commerce (like standard Shopify stores or social media boutiques), when a customer pays $100 for a luxury garment, the money lands straight into the seller's checking account immediately. If the seller vanishes, sends polyester instead of silk, or delays shipment for 3 months, the customer is left with only one painful option: filing a 90-day bank chargeback. On the other hand, small independent merchants live in constant fear of "friendly fraud" buyers who falsely claim their package never arrived.
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.88rem', color: '#4c1d95' }}>
                    <strong>VogueSocial solves this by acting as an automated digital notary:</strong> Customer money is held in an impartial, audited bank vault. The merchant can see that the customer's funds are 100% captured and guaranteed, so they can fulfill and ship with confidence. But the merchant <em>cannot touch a single penny</em> until a physical courier hands the package to the buyer and verifies Proof of Delivery.
                  </p>
                </div>
              </div>

              {/* SECTION 2: THE 3 FINANCIAL ACCOUNTS EXPLAINED */}
              <h2 className="doc-h2">
                <Store size={18} color="#0f172a" />
                <span>The 3 Financial Entities: Where Does Every Cent Sit?</span>
              </h2>
              <p className="doc-p">
                To understand how money moves, non-technical readers only need to understand 3 bank accounts in the Stripe ecosystem. At no point is money "lost in cyberspace"—it exists in one of these three regulated holding accounts:
              </p>

              <div className="doc-vault-grid">
                {/* ACCOUNT 1 */}
                <div className="doc-vault-card customer">
                  <div className="doc-vault-header">
                    <div className="doc-vault-title-wrap">
                      <CreditCard size={18} color="#0284c7" />
                      <span className="doc-vault-title">Account 1: Customer's Bank</span>
                    </div>
                    <span className="doc-money-status-pill charged">Debited $100</span>
                  </div>
                  <div className="doc-vault-account-id">Visa / Mastercard / Apple Pay</div>
                  <ul className="doc-vault-meta-list">
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Immediate Debit:</strong> Customer's card is authorized and debited $100 at the instant of order placement.</span>
                    </li>
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Fraud Protection:</strong> Stripe Radar & 3D Secure (3DS) screen for stolen cards before funds leave the buyer's account.</span>
                    </li>
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Protection Window:</strong> Buyer has a guaranteed 48-hour post-delivery window to report sizing or quality defects.</span>
                    </li>
                  </ul>
                </div>

                {/* ACCOUNT 2 */}
                <div className="doc-vault-card vault">
                  <div className="doc-vault-header">
                    <div className="doc-vault-title-wrap">
                      <Lock size={18} color="#7c3aed" />
                      <span className="doc-vault-title">Account 2: VogueSocial Platform Vault</span>
                    </div>
                    <span className="doc-money-status-pill held">Locked in Escrow</span>
                  </div>
                  <div className="doc-vault-account-id">acct_platform_vogue (FDIC-Insured Master Custody)</div>
                  <ul className="doc-vault-meta-list">
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Segregated Custody:</strong> Money sits in VogueSocial's audited master Stripe account under a unique order lock: <code>transfer_group: 'order_ORD-1841'</code>.</span>
                    </li>
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Can VogueSocial spend it?</strong> <strong>NO.</strong> It is strictly earmarked for this order and cannot be diverted to platform expenses.</span>
                    </li>
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#7c3aed" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Can the merchant withdraw it?</strong> <strong>NO.</strong> The merchant has zero access to this vault balance until delivery clears.</span>
                    </li>
                  </ul>
                </div>

                {/* ACCOUNT 3 */}
                <div className="doc-vault-card merchant">
                  <div className="doc-vault-header">
                    <div className="doc-vault-title-wrap">
                      <Store size={18} color="#16a34a" />
                      <span className="doc-vault-title">Account 3: Merchant's Connected Bank</span>
                    </div>
                    <span className="doc-money-status-pill released">Receives $95.00</span>
                  </div>
                  <div className="doc-vault-account-id">acct_1Ox7Y8K92A8291 (Merchant Connected Account)</div>
                  <ul className="doc-vault-meta-list">
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Balance at Checkout:</strong> <strong>$0.00</strong>. The merchant sees the order is confirmed and funded, but their bank balance remains untouched.</span>
                    </li>
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Automated Transfer:</strong> After delivery is verified and the 48-hour window closes, $95.00 (95%) is transferred into this account.</span>
                    </li>
                    <li className="doc-vault-meta-item">
                      <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Direct Bank Payout:</strong> Stripe automatically executes a direct ACH or SEPA deposit straight into the merchant's local checking account (Chase, Barclays, etc.).</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SECTION 3: VISUAL ARCHITECTURE CANVAS */}
              <h2 className="doc-h2">
                <CreditCard size={18} color="#0f172a" />
                <span>Merchant Selling &amp; Payment Flow Architecture Diagram</span>
              </h2>
              <p className="doc-p">
                The comprehensive multi-tier architectural diagram below maps the complete lifecycle—from merchant onboarding and autonomous storefront setup, through customer virtual try-on and checkout, to escrow custody, tracked courier delivery, 5-gate compliance validation, and direct bank settlement:
              </p>

              {/* ARCHITECTURE DIAGRAM: MERCHANT SELLING & PAYMENT FLOW */}
              <div className="doc-mflow-container">
                <div className="doc-mflow-topbar">
                  <div className="doc-mflow-title-group">
                    <div className="doc-mflow-icon-wrap">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h3 className="doc-mflow-title">End-to-End Architecture: Merchant Selling &amp; Escrow Payment Flow</h3>
                      <p className="doc-mflow-sub">Decoupled transaction pipeline connecting Merchant Operations, Buyer Discovery, Platform Vault, and Stripe Banking</p>
                    </div>
                  </div>

                  <div className="doc-mflow-legend">
                    <div className="doc-mflow-legend-item">
                      <span className="doc-mflow-dot" style={{ background: '#0284c7' }} />
                      <span>1. Merchant Selling Setup</span>
                    </div>
                    <div className="doc-mflow-legend-item">
                      <span className="doc-mflow-dot" style={{ background: '#7c3aed' }} />
                      <span>2. Buyer Order &amp; Checkout</span>
                    </div>
                    <div className="doc-mflow-legend-item">
                      <span className="doc-mflow-dot" style={{ background: '#d97706' }} />
                      <span>3. Escrow Custody &amp; Fulfillment</span>
                    </div>
                    <div className="doc-mflow-legend-item">
                      <span className="doc-mflow-dot" style={{ background: '#16a34a' }} />
                      <span>4. 5-Gate Settlement &amp; Bank Payout</span>
                    </div>
                  </div>
                </div>

                {/* 4-COLUMN ARCHITECTURE GRID */}
                <div className="doc-mflow-grid">
                  {/* COLUMN 1: MERCHANT SELLING OPERATIONS */}
                  <div className="doc-mflow-col">
                    <div className="doc-mflow-col-header" style={{ borderLeft: '3px solid #0284c7' }}>
                      <Store size={14} color="#0284c7" />
                      <span>1. Merchant Selling Setup</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 1</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>Storefront</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Autonomous Website &amp; Themes</h4>
                      <p className="doc-mflow-step-text">
                        Merchant configures branded luxury storefront (Minimal, Luxury, Streetwear, Modern, Boutique) and connects custom domain (<code>shop.brand.com</code>).
                      </p>
                      <span className="doc-mflow-endpoint-chip">POST /api/merchant/website</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 2</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>Catalog</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Garments &amp; AI Try-On Ingestion</h4>
                      <p className="doc-mflow-step-text">
                        Merchant uploads garment photography, sizes, inventory levels, and transparent cutouts into the virtual try-on fitting room index.
                      </p>
                      <span className="doc-mflow-endpoint-chip">POST /api/merchant/products</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 3</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>KYB Compliance</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Business Verification (KYC/KYB)</h4>
                      <p className="doc-mflow-step-text">
                        Merchant submits legal business name, SIREN/EIN, registered address, return warehouse address, and compliance documents (Kbis, Photo ID, Tax Cert).
                      </p>
                      <span className="doc-mflow-endpoint-chip">POST /api/merchant/verification</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 4</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>Bank Connection</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Stripe Connect Account Link</h4>
                      <p className="doc-mflow-step-text">
                        Merchant connects commercial checking account via Stripe Connect. System records payout pipe ID (e.g. <code>acct_1Ox7Y8K92A8291</code>).
                      </p>
                      <span className="doc-mflow-endpoint-chip">POST /v1/accounts (Connect)</span>
                    </div>
                  </div>

                  {/* COLUMN 2: CUSTOMER DISCOVERY & CHECKOUT */}
                  <div className="doc-mflow-col">
                    <div className="doc-mflow-col-header" style={{ borderLeft: '3px solid #7c3aed' }}>
                      <Users size={14} color="#7c3aed" />
                      <span>2. Buyer Discovery &amp; Order</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 5</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#f3e8ff', color: '#7e22ce' }}>Discovery</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Social Feed &amp; Storefront Browse</h4>
                      <p className="doc-mflow-step-text">
                        Customer discovers garment through VogueSocial Lookbook Feed or navigates directly to merchant's custom branded storefront.
                      </p>
                      <span className="doc-mflow-endpoint-chip">GET /store/:handle</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 6</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#f3e8ff', color: '#7e22ce' }}>Fitting Room</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Real-Time AI Virtual Try-On</h4>
                      <p className="doc-mflow-step-text">
                        Shopper triggers instant fitting room simulation. Client-side Wasm and GPU models warp garment onto user silhouette in under 1.8 seconds.
                      </p>
                      <span className="doc-mflow-endpoint-chip">POST /api/tryon/generate</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 7</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#f3e8ff', color: '#7e22ce' }}>Checkout</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Payment Intent Authorization</h4>
                      <p className="doc-mflow-step-text">
                        Buyer completes checkout ($100.00). Stripe authorizes card, runs 3D Secure fraud screen, and captures customer payment.
                      </p>
                      <span className="doc-mflow-endpoint-chip">POST /v1/payment_intents</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 8</span>
                        <span className="doc-mflow-money-pill" style={{ background: '#e0f2fe', color: '#0369a1' }}>-$100.00 Debited</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Buyer Bank Card Charged</h4>
                      <p className="doc-mflow-step-text">
                        Customer bank account debited $100.00. Funds transfer immediately to VogueSocial Master Cashier with 48h inspection guarantee.
                      </p>
                      <span className="doc-mflow-endpoint-chip">charge.succeeded</span>
                    </div>
                  </div>

                  {/* COLUMN 3: ESCROW CUSTODY & LOGISTICS */}
                  <div className="doc-mflow-col">
                    <div className="doc-mflow-col-header" style={{ borderLeft: '3px solid #d97706' }}>
                      <Lock size={14} color="#d97706" />
                      <span>3. Escrow Vault &amp; Logistics</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 9</span>
                        <span className="doc-mflow-money-pill" style={{ background: '#f3e8ff', color: '#7e22ce' }}>+$100 Vaulted</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Escrow Segregated Lock</h4>
                      <p className="doc-mflow-step-text">
                        Money locked in Master Vault (<code>acct_platform_vogue</code>) earmarked as <code>transfer_group: 'order_ORD-1841'</code>. Merchant cannot withdraw yet.
                      </p>
                      <span className="doc-mflow-endpoint-chip">status: 'escrow_held'</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 10</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#fef3c7', color: '#b45309' }}>Fulfillment</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Merchant Dispatches Garment</h4>
                      <p className="doc-mflow-step-text">
                        Merchant receives funded order notice, stitches &amp; packs the garment, books courier (DHL/FedEx/UPS), and enters Airway Bill tracking number.
                      </p>
                      <span className="doc-mflow-endpoint-chip">POST /api/merchant/orders/fulfill</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 11</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#fef3c7', color: '#b45309' }}>Transit Scans</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Regex Carrier Auto-Tracking</h4>
                      <p className="doc-mflow-step-text">
                        System auto-detects carrier from AWB format. Webhooks monitor package transit from regional sorting hub to flight departure to destination depot.
                      </p>
                      <span className="doc-mflow-endpoint-chip">easyPost / carrier webhooks</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 12</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#fef3c7', color: '#b45309' }}>POD Signature</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Courier Delivery &amp; POD Webhook</h4>
                      <p className="doc-mflow-step-text">
                        Courier rings doorbell, collects customer electronic signature on pad. Courier webhook pushes <code>status: 'delivered'</code> and <code>signed_by: 'John'</code>.
                      </p>
                      <span className="doc-mflow-endpoint-chip">status: 'delivered_pod_verified'</span>
                    </div>
                  </div>

                  {/* COLUMN 4: 5-GATE SETTLEMENT & BANK PAYOUT */}
                  <div className="doc-mflow-col">
                    <div className="doc-mflow-col-header" style={{ borderLeft: '3px solid #16a34a' }}>
                      <CheckCircle2 size={14} color="#16a34a" />
                      <span>4. 5-Gate Settlement</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 13</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#ecfdf5', color: '#065f46' }}>48hr Timer</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Buyer Inspection Window</h4>
                      <p className="doc-mflow-step-text">
                        48-hour inspection timer activates upon delivery signature. Customer has guaranteed window to inspect fabric quality and sizing fit.
                      </p>
                      <span className="doc-mflow-endpoint-chip">timer: 48h (zero disputes)</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 14</span>
                        <span className="doc-mflow-data-pill" style={{ background: '#ecfdf5', color: '#065f46' }}>Compliance Gates</span>
                      </div>
                      <h4 className="doc-mflow-step-name">5-Gate Automated Rule Check</h4>
                      <p className="doc-mflow-step-text">
                        Escrow referee validates: 1) POD signature authenticated; 2) Merchant KYB verified; 3) 48h expired with 0 RMAs; 4) Zero payout holds; 5) 5% fee calculated.
                      </p>
                      <span className="doc-mflow-endpoint-chip">eval(eligibility_gates) === PASS</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 15</span>
                        <span className="doc-mflow-money-pill" style={{ background: '#dcfce7', color: '#15803d' }}>+$95.00 Transfer</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Stripe Connect Transfer</h4>
                      <p className="doc-mflow-step-text">
                        VogueSocial referee tells Stripe: Transfer $95.00 (95%) from Master Vault into merchant's account (<code>acct_1Ox7Y8K92A8291</code>). Platform retains $5.00 (5%).
                      </p>
                      <span className="doc-mflow-endpoint-chip">POST /v1/transfers</span>
                    </div>

                    <div className="doc-mflow-step-card">
                      <div className="doc-mflow-step-badge-row">
                        <span className="doc-mflow-step-num">Step 16</span>
                        <span className="doc-mflow-money-pill" style={{ background: '#dcfce7', color: '#15803d' }}>Bank ACH Paid</span>
                      </div>
                      <h4 className="doc-mflow-step-name">Direct Commercial Bank Payout</h4>
                      <p className="doc-mflow-step-text">
                        Stripe executes automated daily clearing sweep (ACH / SEPA) directly depositing $95.00 into merchant's local business checking account (JPMorgan Chase).
                      </p>
                      <span className="doc-mflow-endpoint-chip">payout.paid (Chase •••• 4192)</span>
                    </div>
                  </div>
                </div>

                {/* ARCHITECTURE SUMMARY BAR */}
                <div className="doc-mflow-summary-bar">
                  <div className="doc-mflow-summary-item">
                    <CreditCard size={18} color="#0284c7" />
                    <div>
                      <div className="doc-mflow-summary-label">Order Gross (Customer Card)</div>
                      <div className="doc-mflow-summary-val" style={{ color: '#0369a1' }}>$100.00 USD</div>
                    </div>
                  </div>

                  <div className="doc-mflow-summary-item">
                    <Lock size={18} color="#7c3aed" />
                    <div>
                      <div className="doc-mflow-summary-label">Escrow Custody Vault</div>
                      <div className="doc-mflow-summary-val" style={{ color: '#7e22ce' }}>100% Segregated &amp; Locked</div>
                    </div>
                  </div>

                  <div className="doc-mflow-summary-item">
                    <Truck size={18} color="#d97706" />
                    <div>
                      <div className="doc-mflow-summary-label">Release Trigger</div>
                      <div className="doc-mflow-summary-val" style={{ color: '#b45309' }}>Courier POD Signature + 48h Window</div>
                    </div>
                  </div>

                  <div className="doc-mflow-summary-item">
                    <CheckCircle2 size={18} color="#16a34a" />
                    <div>
                      <div className="doc-mflow-summary-label">Merchant Net Bank Deposit</div>
                      <div className="doc-mflow-summary-val" style={{ color: '#15803d' }}>$95.00 USD (95%)</div>
                    </div>
                  </div>

                  <div className="doc-mflow-summary-item">
                    <ShieldCheck size={18} color="#0f172a" />
                    <div>
                      <div className="doc-mflow-summary-label">VogueSocial Helper Fee</div>
                      <div className="doc-mflow-summary-val">$5.00 USD (5%)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: REAL-WORLD STEP-BY-STEP (THE $100 ORDER) */}
              <h2 className="doc-h2">
                <DollarSign size={18} color="#0f172a" />
                <span>The Real-World Walkthrough: The Life of a $100 Garment Order</span>
              </h2>
              <p className="doc-p">
                Let's follow a real-world example from start to finish. Sarah in New York buys a <strong>$100.00 Silk Blouse</strong> from Studio Label Paris on VogueSocial. Here is exactly where the money sits and what happens at every second:
              </p>

              <div className="doc-timeline-wrap">
                {/* PHASE 1 */}
                <div className="doc-phase-card">
                  <div className="doc-phase-topbar">
                    <div className="doc-phase-badge">Phase 1: The Purchase & Vault Lock</div>
                    <div className="doc-phase-time">Timestamp: Day 1, 10:00:00 AM</div>
                  </div>
                  <div className="doc-p" style={{ margin: '0 0 0.75rem 0' }}>
                    Sarah enters her card and clicks "Pay $100". VogueSocial instructs Stripe: <em>"Charge Sarah's card $100, deposit it into VogueSocial's Master Account, and tag it with Order ID ORD-1841."</em>
                  </div>
                  <div className="doc-money-tracker-box">
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">Sarah's Card</div>
                      <div className="doc-money-tracker-value" style={{ color: '#0369a1' }}>-$100.00 (Charged)</div>
                    </div>
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">VogueSocial Escrow Vault</div>
                      <div className="doc-money-tracker-value" style={{ color: '#7c3aed' }}>+$100.00 (LOCKED)</div>
                    </div>
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">Studio Label Paris Bank</div>
                      <div className="doc-money-tracker-value" style={{ color: '#64748b' }}>$0.00 (Untouched)</div>
                    </div>
                  </div>
                  <div className="doc-p" style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                    <strong>What the Merchant sees:</strong> Studio Label Paris logs into their Merchant Dashboard. They see: <em>"New Order #ORD-1841: $100 Silk Blouse — ESCROW FUNDED & GUARANTEED"</em>. The merchant knows the buyer has paid and cannot cancel on a whim, so they can safely begin tailoring the blouse.
                  </div>
                </div>

                {/* PHASE 2 */}
                <div className="doc-phase-card">
                  <div className="doc-phase-topbar">
                    <div className="doc-phase-badge">Phase 2: Tailoring & Tracked Dispatch</div>
                    <div className="doc-phase-time">Timestamp: Day 2, 02:30:00 PM</div>
                  </div>
                  <div className="doc-p" style={{ margin: '0 0 0.75rem 0' }}>
                    Studio Label Paris finishes tailoring the blouse, wraps it in silk packaging, and hands it to DHL Express. The merchant inputs the Airway Bill into VogueSocial: <code>#DHL-8291048291</code>.
                  </div>
                  <div className="doc-money-tracker-box">
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">Where is the $100?</div>
                      <div className="doc-money-tracker-value" style={{ color: '#7c3aed' }}>Still in VogueSocial's Vault</div>
                    </div>
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">Escrow Lock Status</div>
                      <div className="doc-money-tracker-value" style={{ color: '#b45309' }}>IN_TRANSIT (Frozen)</div>
                    </div>
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">Logistics Tracking</div>
                      <div className="doc-money-tracker-value" style={{ color: '#0f172a' }}>Paris CDG ➔ JFK Airport</div>
                    </div>
                  </div>
                  <div className="doc-p" style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                    <strong>Why this matters:</strong> Even though the merchant has spent time and material shipping the garment, they still cannot withdraw the money. This completely prevents exit scams where fraudulent sellers print a fake shipping label and run off with the cash.
                  </div>
                </div>

                {/* PHASE 3 */}
                <div className="doc-phase-card">
                  <div className="doc-phase-topbar">
                    <div className="doc-phase-badge">Phase 3: The Courier Handshake (Proof of Delivery)</div>
                    <div className="doc-phase-time">Timestamp: Day 4, 11:15:22 AM</div>
                  </div>
                  <div className="doc-p" style={{ margin: '0 0 0.75rem 0' }}>
                    The DHL van arrives at Sarah's apartment in Manhattan. The courier rings the bell, Sarah opens the door, and signs her name on the electronic scanner. The courier taps <em>"DELIVERED"</em>.
                  </div>
                  <div className="doc-callout tip" style={{ padding: '0.85rem 1rem', margin: '0.75rem 0' }}>
                    <div className="doc-callout-body" style={{ fontSize: '0.82rem', color: '#166534' }}>
                      <strong>The Digital-Physical Handshake:</strong> Exactly 1.8 seconds after Sarah signs the pad, DHL's server fires an encrypted webhook notification to VogueSocial's webhook listener:
                      <div style={{ fontFamily: 'monospace', background: '#ffffff', padding: '0.5rem', borderRadius: '4px', marginTop: '0.4rem', border: '1px solid #bbf7d0', color: '#0f172a' }}>
                        POST /api/webhooks/logistics ➔ status: 'delivered', signed_by: 'Sarah Jenkins', carrier: 'DHL Express', time: '2026-10-24T15:15:22Z'
                      </div>
                    </div>
                  </div>
                  <div className="doc-p" style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                    VogueSocial's system updates Order #ORD-1841: <code>pod_verified = true</code>. The <strong>48-hour buyer protection timer</strong> starts automatically.
                  </div>
                </div>

                {/* PHASE 4 */}
                <div className="doc-phase-card">
                  <div className="doc-phase-topbar">
                    <div className="doc-phase-badge">Phase 4: The 48-Hour Inspection Window</div>
                    <div className="doc-phase-time">Timestamp: Day 4 to Day 6 (48 Hours)</div>
                  </div>
                  <div className="doc-p" style={{ margin: '0 0 0.75rem 0' }}>
                    Sarah opens the box, inspects the silk, tries on the blouse in her mirror, and checks the seams. She receives an SMS and push notification from VogueSocial:
                  </div>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.85rem 1.25rem', borderRadius: '8px', fontSize: '0.82rem', color: '#334155', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                    "Your Studio Label Paris blouse has arrived! You have 48 hours to inspect sizing and craftsmanship. If anything is wrong, click 'Report an Issue' in your order menu."
                  </div>
                  <div className="doc-p" style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                    During these 48 hours, the $100 remains in VogueSocial's escrow vault. If Sarah finds a ripped seam or fake material, she can freeze the order with one tap before the seller receives a single dime.
                  </div>
                </div>

                {/* PHASE 5 */}
                <div className="doc-phase-card" style={{ border: '2px solid #16a34a' }}>
                  <div className="doc-phase-topbar">
                    <div className="doc-phase-badge" style={{ background: '#16a34a' }}>Phase 5: Telling Stripe to Release & Split the Funds</div>
                    <div className="doc-phase-time">Timestamp: Day 6, 11:15:23 AM (48h Expired)</div>
                  </div>
                  <div className="doc-p" style={{ margin: '0 0 0.75rem 0' }}>
                    Sarah loved the blouse and did not open any dispute. Exactly 48 hours after delivery, VogueSocial's automated Escrow Engine awakens.
                  </div>
                  <div className="doc-p" style={{ margin: '0 0 0.75rem 0', fontWeight: 600, color: '#0f172a' }}>
                    Here is how VogueSocial instructs Stripe:
                  </div>
                  <ol style={{ paddingLeft: '1.25rem', margin: '0 0 1rem 0', fontSize: '0.82rem', lineHeight: 1.6, color: '#334155' }}>
                    <li><strong>Step A: Automated Gate Audit:</strong> VogueSocial verifies that Payment Succeeded, POD is Confirmed, No Dispute is Active, and Merchant KYC is Valid.</li>
                    <li><strong>Step B: The Command to Stripe:</strong> VogueSocial's server sends a cryptographic API call to Stripe saying: <em>"Take $95.00 out of our vault and transfer it into Studio Label Paris's connected account (acct_1Ox7Y8K92A8291) under group order_ORD-1841."</em></li>
                    <li><strong>Step C: Instant Split:</strong> Stripe executes the transfer within 200 milliseconds. <strong>$95.00 (95%)</strong> lands in the merchant's Stripe balance, and <strong>$5.00 (5%)</strong> remains in VogueSocial's account as the marketplace commission.</li>
                    <li><strong>Step D: Local Bank Deposit:</strong> Stripe immediately triggers an automated ACH/SEPA payout that deposits the $95.00 directly into Studio Label Paris's commercial bank account (e.g. BNP Paribas or JPMorgan Chase).</li>
                  </ol>
                  <div className="doc-money-tracker-box" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">Studio Label Paris Payout</div>
                      <div className="doc-money-tracker-value" style={{ color: '#16a34a' }}>$95.00 (95% Net to Bank)</div>
                    </div>
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">VogueSocial Platform Revenue</div>
                      <div className="doc-money-tracker-value" style={{ color: '#0f172a' }}>$5.00 (5% Commission)</div>
                    </div>
                    <div className="doc-money-tracker-item">
                      <div className="doc-money-tracker-label">Final Order Status</div>
                      <div className="doc-money-tracker-value" style={{ color: '#16a34a' }}>ESCROW_RELEASED ✔</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: THE SAFETY SHIELD - WHAT IF SOMETHING GOES WRONG? */}
              <h2 className="doc-h2">
                <ShieldCheck size={18} color="#0f172a" />
                <span>The Safety Shield: What Happens When Things Go Wrong?</span>
              </h2>
              <p className="doc-p">
                Non-technical executives and buyers always ask: <em>"Why do we need this complex escrow system? Why not just pay the merchant immediately like Shopify?"</em> Here are the 3 real-world fraud and disaster scenarios that VogueSocial's Escrow completely eliminates:
              </p>

              <div className="doc-scenario-grid">
                {/* SCENARIO 1 */}
                <div className="doc-scenario-box">
                  <div className="doc-scenario-title">
                    <AlertTriangle size={18} color="#ef4444" />
                    <span>Scenario 1: Defective / Fake Garment</span>
                  </div>
                  <div className="doc-scenario-body">
                    <strong>What happened:</strong> The merchant sent a damaged jacket or counterfeit fabric.<br /><br />
                    <strong>Traditional E-Commerce:</strong> The seller already has your $100 in their pocket. You must email them, wait for replies, argue, or beg your credit card company for a chargeback (takes 60–90 days).<br /><br />
                    <strong>With VogueSocial Escrow:</strong> Because the $100 is still sitting in VogueSocial's vault, you tap "Report Defect" within 48h. The escrow release freezes instantly. If verified, VogueSocial issues a <strong>1-click 100% refund</strong> directly back to your card. The rogue seller never touches a cent.
                  </div>
                </div>

                {/* SCENARIO 2 */}
                <div className="doc-scenario-box">
                  <div className="doc-scenario-title">
                    <AlertTriangle size={18} color="#ef4444" />
                    <span>Scenario 2: The "Ghost" Merchant</span>
                  </div>
                  <div className="doc-scenario-body">
                    <strong>What happened:</strong> A seller takes the order but never ships the package.<br /><br />
                    <strong>Traditional E-Commerce:</strong> The fraudulent seller closes their bank account, deletes their store, and disappears with the buyer's money.<br /><br />
                    <strong>With VogueSocial Escrow:</strong> If no valid tracked courier scan appears from DHL/FedEx within 5 business days, the order expires automatically. VogueSocial voids the transaction and returns 100% of the funds to the customer. Zero fraud loss.
                  </div>
                </div>

                {/* SCENARIO 3 */}
                <div className="doc-scenario-box safe">
                  <div className="doc-scenario-title">
                    <ShieldCheck size={18} color="#16a34a" />
                    <span>Scenario 3: Dishonest Buyer ("I Never Got It")</span>
                  </div>
                  <div className="doc-scenario-body">
                    <strong>What happened:</strong> A dishonest shopper receives the garment and tries to claim: <em>"The package was never delivered, give me my money back!"</em><br /><br />
                    <strong>Traditional E-Commerce:</strong> Small independent artisans get crushed by card networks who almost always side with the cardholder in disputes.<br /><br />
                    <strong>With VogueSocial Escrow:</strong> VogueSocial pulls the courier's GPS-stamped Proof of Delivery (POD) record, exact timestamp, and doorstep signature from DHL/FedEx. The false claim is immediately rebuffed, and the artisan receives their full $95 payout without penalty.
                  </div>
                </div>
              </div>

              {/* SECTION 6: COMPARISON MATRIX */}
              <h2 className="doc-h2">
                <FileText size={18} color="#0f172a" />
                <span>Side-by-Side Comparison: Traditional Marketplaces vs. VogueSocial Escrow</span>
              </h2>
              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th style={{ width: '22%' }}>Dimension</th>
                      <th style={{ width: '38%' }}>Traditional E-Commerce (Shopify / Direct / Etsy)</th>
                      <th style={{ width: '40%' }}>VogueSocial Escrow Architecture</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Where Buyer Money Goes</strong></td>
                      <td>Transferred straight into the seller's merchant bank account immediately at checkout.</td>
                      <td><strong style={{ color: '#7c3aed' }}>Quarantined in VogueSocial's Stripe Vault</strong> under an encrypted order lockbox.</td>
                    </tr>
                    <tr>
                      <td><strong>When Seller Gets Paid</strong></td>
                      <td>Day 1 (before the dress is even cut or shipped).</td>
                      <td><strong style={{ color: '#16a34a' }}>After Delivery (Day 6)</strong>, following courier Proof of Delivery + 48h inspection.</td>
                    </tr>
                    <tr>
                      <td><strong>Customer Refund Speed</strong></td>
                      <td>Weeks of back-and-forth emails, or 60–90 days for a bank chargeback dispute.</td>
                      <td><strong>Instant (1-Click)</strong> directly from the vault because the merchant never touched the funds.</td>
                    </tr>
                    <tr>
                      <td><strong>Protection for Artisans</strong></td>
                      <td>Artisans lose dispute fees ($15–$30/chargeback) when buyers file bogus claims.</td>
                      <td><strong>100% Protected:</strong> Courier signature & GPS POD automatically defends against friendly fraud.</td>
                    </tr>
                    <tr>
                      <td><strong>Platform Fee Deduction</strong></td>
                      <td>Clunky monthly invoicing or complex end-of-month reconciliations.</td>
                      <td><strong>Automated Split:</strong> 95% wired to merchant, 5% kept by platform in the exact same microsecond.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SECTION 7: 5-STEP AUDIT GATES TABLE */}
              <h2 className="doc-h2">
                <ShieldCheck size={18} color="#0f172a" />
                <span>The 5-Step Payout Verification Gates</span>
              </h2>
              <p className="doc-p">
                To guarantee zero chargeback liability and eliminate fulfillment fraud, the escrow engine evaluates 5 automated safety gates before releasing funds:
              </p>

              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Gate #</th>
                      <th>Verification Gate</th>
                      <th>Technical Condition</th>
                      <th>Operational Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Gate 1</strong></td>
                      <td>Payment Settled</td>
                      <td><code>paymentIntent.status === 'succeeded'</code></td>
                      <td>Guarantees buyer funds were captured without card settlement failure.</td>
                    </tr>
                    <tr>
                      <td><strong>Gate 2</strong></td>
                      <td>Carrier POD Confirmed</td>
                      <td><code>order.pod_verified === true && status === 'delivered'</code></td>
                      <td>Carrier webhook confirms recipient signature and geolocation match.</td>
                    </tr>
                    <tr>
                      <td><strong>Gate 3</strong></td>
                      <td>Order Active</td>
                      <td><code>status !== 'cancelled' && escrow_status !== 'refunded'</code></td>
                      <td>Verifies the order was not cancelled by the buyer or refunded early.</td>
                    </tr>
                    <tr>
                      <td><strong>Gate 4</strong></td>
                      <td>No Open Dispute</td>
                      <td><code>dispute_status !== 'open'</code></td>
                      <td>Ensures no credit card chargeback or sizing RMA claim is active during 48h window.</td>
                    </tr>
                    <tr>
                      <td><strong>Gate 5</strong></td>
                      <td>Merchant KYC Verified</td>
                      <td><code>merchant.kyc_status === 'verified'</code></td>
                      <td>Ensures merchant has valid Stripe Connected bank account credentials for direct deposit.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SECTION 8: STRIPE TRANSFER CODE CONTRACT */}
              <h2 className="doc-h2">
                <Terminal size={18} color="#0f172a" />
                <span>The Software Contract: How the Server Tells Stripe to Transfer Funds</span>
              </h2>
              <p className="doc-p">
                For developers, investors, and technical auditors, below is the reference implementation contract and API disbursement payload (illustrated in TypeScript via the Stripe SDK) executed when all 5 safety gates pass. Because the backend is designed contract-first, this domain logic translates 1:1 regardless of whether the final backend runtime is deployed on Node.js, Go, Python, or Java. Notice the <code>idempotencyKey</code>—this guarantees that even if a server restarts or a network cable glitches, <strong>the payout can never be paid twice</strong>:
              </p>

              <div className="doc-code-block">
                <div className="doc-code-header">
                  <span>POST /v1/transfers (Stripe API - Separate Charges & Transfers)</span>
                  <button
                    type="button"
                    className="doc-copy-btn"
                    onClick={() =>
                      handleCopy(
                        'stripe-transfer-code',
                        `// ============================================================================
// VOGUESOCIAL ESCROW DISBURSEMENT ENGINE
// Runs automatically after 48-hour delivery inspection window clears
// ============================================================================
const transfer = await stripe.transfers.create({
  // 1. Exactly 95% of the $100.00 order ($95.00 represented in cents)
  amount: 9500, 
  currency: 'usd',

  // 2. The Merchant's unique Stripe Connected Account ID (linked to their bank)
  destination: merchant.stripe_account_id, // e.g. 'acct_1Ox7Y8K92A8291'

  // 3. Earmark to this specific customer order (audit trail & accounting)
  transfer_group: 'order_ORD-1841',

  // 4. Source transaction that funded this transfer from our escrow vault
  source_transaction: order.stripe_charge_id,

  // 5. Merchant-facing ledger description on their bank statement
  description: 'Payout for Order #ORD-1841 - Studio Label Paris'
}, {
  // CRITICAL: Prevents double-payouts even if network retries occur
  idempotencyKey: 'release_escrow_ORD-1841'
});`
                      )
                    }
                  >
                    {copiedCode === 'stripe-transfer-code' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    <span>{copiedCode === 'stripe-transfer-code' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="doc-code-body">
{`// ============================================================================
// VOGUESOCIAL ESCROW DISBURSEMENT ENGINE
// Runs automatically after 48-hour delivery inspection window clears
// ============================================================================
const transfer = await stripe.transfers.create({
  // 1. Exactly 95% of the $100.00 order ($95.00 represented in cents)
  amount: 9500, 
  currency: 'usd',

  // 2. The Merchant's unique Stripe Connected Account ID (linked to their bank)
  destination: merchant.stripe_account_id, // e.g. 'acct_1Ox7Y8K92A8291'

  // 3. Earmark to this specific customer order (audit trail & accounting)
  transfer_group: 'order_ORD-1841',

  // 4. Source transaction that funded this transfer from our escrow vault
  source_transaction: order.stripe_charge_id,

  // 5. Merchant-facing ledger description on their bank statement
  description: 'Payout for Order #ORD-1841 - Studio Label Paris'
}, {
  // CRITICAL: Prevents double-payouts even if network retries occur
  idempotencyKey: 'release_escrow_ORD-1841'
});`}
                </pre>
              </div>
            </article>
          )}

          {/* SECTION: SHIPPING & LOGISTICS */}
          {activeSection === 'logistics-delivery' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">Logistics Architecture</span>
                  <span className="doc-tag">Proof of Delivery (POD)</span>
                  <span className="doc-tag">Carrier Auto-Detection</span>
                </div>
                <h1 className="doc-article-title">Shipping & Delivery (POD) Architecture</h1>
                <p className="doc-article-lead">
                  Multi-vendor direct merchant fulfillment, automated courier detection from Airway Bills (AWB), real-time delivery webhooks, and reverse logistics return warehouse routing.
                </p>
              </div>

              {/* ARCHITECTURE DIAGRAM 3: SHIPPING & LOGISTICS FLOW */}
              <h2 className="doc-h2">
                <Truck size={18} color="#0f172a" />
                <span>Logistics & POD Verification Architecture Diagram</span>
              </h2>

              <div className="arch-diagram-canvas">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  <div className="arch-layer-box">
                    <div className="doc-node-step">1. Merchant Packs Garment</div>
                    <div className="arch-pill-name">Fulfillment Modal</div>
                    <div className="doc-p" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      Merchant packs garment and enters tracking code (e.g. <code>FX28301948IN</code>).
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">2. Regex Auto-Detection</div>
                    <div className="arch-pill-name">Courier Identified</div>
                    <div className="doc-p" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      Regex pattern matches <strong>FedEx</strong> instantly. Tracking registered with EasyPost gateway.
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">3. In-Transit Milestone</div>
                    <div className="arch-pill-name">Hub Scans Sync</div>
                    <div className="doc-p" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      Buyer notified. Scans stream: <code>in_transit</code> ➔ <code>out_for_delivery</code>.
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">4. Doorstep Signature</div>
                    <div className="arch-pill-name">Webhook Confirms POD</div>
                    <div className="doc-p" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      Driver collects signature. Webhook pushes <code>delivered</code> status to VogueSocial.
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE CARRIER AUTO-DETECTOR */}
              <h2 className="doc-h2">
                <Search size={18} color="#0f172a" />
                <span>Live AWB Carrier Auto-Detector</span>
              </h2>
              <p className="doc-p">
                Test the live pattern detector used in the merchant fulfillment modal:
              </p>

              <div className="doc-diagram-card">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    value={testAwb}
                    onChange={(e) => setTestAwb(e.target.value)}
                    placeholder="Enter tracking number (e.g. FX28301948IN, 1Z999999, 8492019482)"
                    style={{
                      flex: 1,
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      color: '#0f172a',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem'
                    }}
                  />
                  <div
                    style={{
                      padding: '0.65rem 1.15rem',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '6px',
                      color: '#166534',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Courier: {detectedCarrier}</span>
                  </div>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Test strings: <code>1Z9999999999999999</code> (UPS), <code>9400100000000000000000</code> (USPS), <code>FX28301948IN</code> (FedEx), or <code>8492019482</code> (DHL Express).
                </span>
              </div>

              {/* DUAL ADDRESS ROUTING */}
              <h2 className="doc-h2">
                <RotateCcw size={18} color="#0f172a" />
                <span>Dual Address Routing: Legal vs. Return Warehouse</span>
              </h2>
              <div className="doc-callout info">
                <div className="doc-callout-body">
                  Each brand profile stores two distinct physical addresses in the database:
                  <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
                    <li><strong><code>legal_address</code></strong>: The corporate registered entity address used for Stripe KYC, tax filings, and legal invoicing.</li>
                    <li><strong><code>return_warehouse_address</code></strong>: The actual physical merchant/studio address where returned garments are routed for tag inspection and restock.</li>
                  </ul>
                </div>
              </div>
            </article>
          )}

          {/* SECTION: AI VIRTUAL TRY-ON */}
          {activeSection === 'ai-tryon' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">Computer Vision</span>
                  <span className="doc-tag">RunPod Serverless</span>
                  <span className="doc-tag">WebGPU / Wasm</span>
                </div>
                <h1 className="doc-article-title">AI Virtual Try-On Pipeline</h1>
                <p className="doc-article-lead">
                  End-to-end computer vision architecture: in-browser garment cutout via WebAssembly, followed by serverless GPU human parsing, TPS warping, and diffusion texture synthesis.
                </p>
              </div>

              {/* ARCHITECTURE DIAGRAM 4: AI PIPELINE */}
              <h2 className="doc-h2">
                <Cpu size={18} color="#0f172a" />
                <span>Computer Vision Pipeline Architecture Diagram</span>
              </h2>

              <div className="arch-diagram-canvas">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  <div className="arch-layer-box">
                    <div className="doc-node-step">1. Client Preprocessing</div>
                    <div className="arch-pill-name">Wasm Background Cutout</div>
                    <div className="doc-p" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      <code>@imgly/background-removal</code> runs locally via WebGPU, removing garment background in &lt;1.8s.
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">2. DensePose Parsing</div>
                    <div className="arch-pill-name">Human Keypoint Mesh</div>
                    <div className="doc-p" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      Maps user body pixels to 3D surface mesh keypoints and generates agnostic clothing mask.
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">3. TPS Warping</div>
                    <div className="arch-pill-name">Geometric Deformation</div>
                    <div className="doc-p" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      Thin-Plate Spline warps 2D clothing image to conform naturally to human torso curves and pose.
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">4. Latent Diffusion</div>
                    <div className="arch-pill-name">Photorealistic Synthesis</div>
                    <div className="doc-p" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                      UNet diffusion denoiser synthesizes natural fabric folds, cast shadows, and clean collar boundaries.
                    </div>
                  </div>
                </div>
              </div>

              {/* RUNPOD SPECIFICATION TABLE */}
              <h2 className="doc-h2">
                <Layers size={18} color="#0f172a" />
                <span>RunPod Serverless Worker Specifications</span>
              </h2>
              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Hardware / Parameter</th>
                      <th>Production Standard</th>
                      <th>Benchmark / Metric</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>GPU Hardware</strong></td>
                      <td>NVIDIA RTX 4090 / A100 (24GB VRAM)</td>
                      <td>11.2s - 14.1s execution time per inference</td>
                    </tr>
                    <tr>
                      <td><strong>API Gateway</strong></td>
                      <td>FastAPI + Uvicorn Async Workers</td>
                      <td>38ms queue latency, auto-scaling concurrency</td>
                    </tr>
                    <tr>
                      <td><strong>Inference Cost</strong></td>
                      <td>RunPod Serverless Billing</td>
                      <td>~$0.0026 per generated high-res try-on look</td>
                    </tr>
                    <tr>
                      <td><strong>Output Resolution</strong></td>
                      <td>3:4 Aspect Ratio (1024 × 1365px)</td>
                      <td>Preserves fine silk weaves and embroidery detail</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {/* SECTION: DATABASE SCHEMA & ERD */}
          {activeSection === 'database-erd' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">Relational Schema Contract</span>
                  <span className="doc-tag">Data Architecture</span>
                  <span className="doc-tag">Engine Agnostic</span>
                </div>
                <h1 className="doc-article-title">Database Schema &amp; Entity Relationships (Data Contract)</h1>
                <p className="doc-article-lead">
                  Normalized relational data model governing profiles, products, inventory variants, orders, escrow settlements, shipment events, and return claims. This schema represents the logical data contracts independent of the underlying relational database engine chosen for production (e.g. PostgreSQL, Supabase, MySQL, or cloud-managed relational DB).
                </p>
              </div>

              <div className="doc-callout info">
                <Database size={20} className="doc-callout-icon" color="#0284c7" />
                <div className="doc-callout-body">
                  <div className="doc-callout-title">Engine-Agnostic Relational Data Specification</div>
                  The tables, foreign key constraints, column types, and JSON metadata structures specified below define the authoritative domain models. While examples illustrate standard SQL conventions (compatible with PostgreSQL, Supabase, or AWS RDS), the schema is fully decoupled from the final database hosting provider.
                </div>
              </div>

              {/* ARCHITECTURE DIAGRAM 5: DATABASE ERD */}
              <h2 className="doc-h2">
                <Database size={18} color="#0f172a" />
                <span>Entity Relationship Architecture Diagram</span>
              </h2>

              <div className="arch-diagram-canvas">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="arch-layer-box">
                    <div className="doc-node-step">Table: PROFILES</div>
                    <div className="arch-pill-name">Vendors & Shoppers</div>
                    <div className="doc-p" style={{ fontSize: '0.74rem', marginTop: '4px' }}>
                      PK: <code>id (uuid)</code><br/>
                      • <code>email</code> (text)<br/>
                      • <code>role</code> (shopper | merchant | admin)<br/>
                      • <code>store_handle</code> (text)<br/>
                      • <code>legal_address</code> (jsonb)<br/>
                      • <code>return_warehouse_address</code> (jsonb)<br/>
                      • <code>kyc_status</code> (verified | pending)
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">Table: ORDERS</div>
                    <div className="arch-pill-name">Purchases & Fulfillment</div>
                    <div className="doc-p" style={{ fontSize: '0.74rem', marginTop: '4px' }}>
                      PK: <code>id (uuid)</code><br/>
                      FK: <code>vendor_id</code>, <code>customer_id</code><br/>
                      • <code>gross_amount</code> (numeric)<br/>
                      • <code>payment_status</code> (paid | pending)<br/>
                      • <code>fulfillment_status</code> (unfulfilled | fulfilled)<br/>
                      • <code>escrow_status</code> (held | in_transit | released)<br/>
                      • <code>pod_verified</code> (boolean)
                    </div>
                  </div>

                  <div className="arch-layer-box">
                    <div className="doc-node-step">Table: ESCROW_SETTLEMENTS</div>
                    <div className="arch-pill-name">Financial Splits</div>
                    <div className="doc-p" style={{ fontSize: '0.74rem', marginTop: '4px' }}>
                      PK: <code>id (uuid)</code><br/>
                      FK: <code>order_id</code><br/>
                      • <code>payment_intent_id</code> (text)<br/>
                      • <code>stripe_transfer_id</code> (text)<br/>
                      • <code>gross_amount</code> (numeric)<br/>
                      • <code>platform_commission_5</code> (numeric)<br/>
                      • <code>merchant_net_95</code> (numeric)<br/>
                      • <code>status</code> (held | released)
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* SECTION: REST API REFERENCE */}
          {activeSection === 'api-reference' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">REST API</span>
                  <span className="doc-tag">OpenAPI Specification</span>
                </div>
                <h1 className="doc-article-title">REST API Specifications &amp; Data Contracts</h1>
                <p className="doc-article-lead">
                  Production endpoint contracts, request schemas, authentication headers, and sample responses.
                </p>
              </div>

              <div className="doc-callout tip">
                <Terminal size={20} className="doc-callout-icon" color="#16a34a" />
                <div className="doc-callout-body">
                  <div className="doc-callout-title">Stack-Independent OpenAPI Protocol</div>
                  The endpoints, JSON payloads, and webhook contracts below define the external communication protocols for VogueSocial. They are strictly decoupled from internal backend language and runtime framework choices, allowing the server to be implemented with Node.js, Go, Python (FastAPI), or Java without breaking client or webhook compatibility.
                </div>
              </div>

              <h2 className="doc-h2">
                <Terminal size={18} color="#0f172a" />
                <span>1. Checkout: Create Escrow Payment Intent</span>
              </h2>
              <div className="doc-code-block">
                <div className="doc-code-header">
                  <span>POST /api/checkout/create-intent</span>
                </div>
                <pre className="doc-code-body">
{`// REQUEST BODY
{
  "cart_items": [
    {
      "product_id": "prod_tailored_silk_blouse",
      "qty": 1,
      "size": "M",
      "color": "#1A1A1A"
    }
  ],
  "shipping_address": {
    "name": "John Miller",
    "street": "14 Green St, Villa 4",
    "city": "Dubai",
    "country": "United Arab Emirates"
  }
}

// RESPONSE (200 OK)
{
  "success": true,
  "order_id": "ORD-1841",
  "client_secret": "pi_3M9xV2K9QxVogueSocial01_secret_XYZ8921",
  "gross_total": 49.00,
  "currency": "usd",
  "escrow_status": "held"
}`}
                </pre>
              </div>

              <h2 className="doc-h2">
                <Truck size={18} color="#0f172a" />
                <span>2. Inbound Carrier Tracking Webhook</span>
              </h2>
              <div className="doc-code-block">
                <div className="doc-code-header">
                  <span>POST /webhooks/shipping</span>
                </div>
                <pre className="doc-code-body">
{`// INBOUND WEBHOOK PAYLOAD (From DHL / FedEx / EasyPost)
{
  "event": "shipment.delivered",
  "awb": "DHL928410291",
  "carrier": "DHL Express",
  "timestamp": "2026-04-29T11:45:00Z",
  "proof_of_delivery": {
    "signature": "John Miller",
    "location": "Dubai, UAE",
    "status": "DELIVERED_POD"
  }
}

// SERVER RESPONSE
{
  "status": "acknowledged",
  "order_id": "ORD-1841",
  "pod_confirmed": true,
  "escrow_timer_started": "48_hours"
}`}
                </pre>
              </div>
            </article>
          )}

          {/* SECTION: MOBILE APP */}
          {activeSection === 'mobile-app' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">Flutter 3.x</span>
                  <span className="doc-tag">iOS / Android</span>
                </div>
                <h1 className="doc-article-title">Mobile App Architecture (Flutter)</h1>
                <p className="doc-article-lead">
                  Modular, atomic widget architecture featuring 72 bundled offline lookbook assets, universal image rendering, reels video swiper, and virtual try-on mirror.
                </p>
              </div>

              <div className="doc-table-wrap">
                <table className="doc-table">
                  <thead>
                    <tr>
                      <th>Module Area</th>
                      <th>File Location</th>
                      <th>Capabilities & Design Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Shop Atomic Widgets</strong></td>
                      <td><code>lib/widgets/shop/</code></td>
                      <td>Category chips, sort menu, grid/list view switcher, 3:4 product card with sparkle pill.</td>
                    </tr>
                    <tr>
                      <td><strong>Feed Atomic Widgets</strong></td>
                      <td><code>lib/widgets/feed/</code></td>
                      <td>Branding SVG header, 6 category tabs, merchant 60/40 lookbook split cards, UGC cards.</td>
                    </tr>
                    <tr>
                      <td><strong>Universal ProductImage</strong></td>
                      <td><code>lib/widgets/product_image.dart</code></td>
                      <td>Universal image renderer with instant fallback to 72 bundled offline lookbook assets.</td>
                    </tr>
                    <tr>
                      <td><strong>Brand Profile Screen</strong></td>
                      <td><code>lib/screens/brand_profile_screen.dart</code></td>
                      <td>Brand profile screen matching web <code>/store/:handle</code> with high-res cover banner.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {/* SECTION: PLATFORM GLOSSARY (A-Z) */}
          {activeSection === 'glossary' && (
            <article>
              <div className="doc-article-header">
                <div className="doc-tag-row">
                  <span className="doc-tag blue">Reference</span>
                  <span className="doc-tag">A–Z Dictionary</span>
                </div>
                <h1 className="doc-article-title">VogueSocial Platform Glossary (A–Z)</h1>
                <p className="doc-article-lead">
                  Definitions of critical commerce, payments, logistics, computer vision, and architecture terminology used throughout the platform.
                </p>
              </div>

              {/* Category Filter Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {['all', 'payments', 'logistics', 'ai / vision', 'finance', 'security'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGlossaryCategory(cat)}
                    style={{
                      background: glossaryCategory === cat ? '#0f172a' : '#ffffff',
                      color: glossaryCategory === cat ? '#ffffff' : '#475569',
                      border: '1px solid #cbd5e1',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Glossary Grid */}
              <div className="doc-glossary-grid">
                {filteredGlossary.map((term, index) => (
                  <div key={index} className="doc-glossary-card">
                    <div className="doc-term-header">
                      <span className="doc-term-name">{term.term}</span>
                      <span className="doc-term-cat">{term.category}</span>
                    </div>
                    <p className="doc-term-def">{term.definition}</p>
                  </div>
                ))}
              </div>
            </article>
          )}
        </main>

        {/* RIGHT CLEAN TOC */}
        <aside className="doc-toc-bar">
          <div className="doc-toc-title">On This Page</div>
          <div className="doc-toc-link" onClick={() => setActiveSection('overview')}>
            What is VogueSocial & Features
          </div>
          <div className="doc-toc-link" onClick={() => setActiveSection('how-it-works')}>
            The Escrow Referee & Money Flow
          </div>
          <div className="doc-toc-link" onClick={() => setActiveSection('payment-escrow')}>
            Stripe Escrow & Payouts
          </div>
          <div className="doc-toc-link" onClick={() => setActiveSection('logistics-delivery')}>
            Logistics & POD Verification
          </div>
          <div className="doc-toc-link" onClick={() => setActiveSection('ai-tryon')}>
            AI Try-On & GPU Cluster
          </div>
          <div className="doc-toc-link" onClick={() => setActiveSection('database-erd')}>
            Database Schema & ERD
          </div>
          <div className="doc-toc-link" onClick={() => setActiveSection('api-reference')}>
            REST API & Webhooks
          </div>
          <div className="doc-toc-link" onClick={() => setActiveSection('mobile-app')}>
            Mobile App Architecture
          </div>
          <div className="doc-toc-link" onClick={() => setActiveSection('glossary')}>
            A–Z Glossary Dictionary
          </div>
        </aside>
      </div>
    </div>
  );
}
