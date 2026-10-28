"use client";
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../merchant.module.css';
import {
  Settings, User, Bell, Shield, Globe, ShieldCheck, Check,
  Loader2, ExternalLink, FileText, CheckCircle2, Clock, AlertTriangle, Building2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { merchantService } from '@/services/merchantService';

export default function SettingsPage() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['profile', 'verification', 'notifications', 'security', 'integrations'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const [profile, setProfile] = useState({
        name: 'Tom Jenkins',
        email: 'tom@gmail.com',
        phone: '+1 (555) 019-2834',
        storeName: 'New Flick',
        storeDescription: 'Premium vintage and modern apparel drops.',
    });

    const [bizInfo, setBizInfo] = useState({
        legal_business_name: '',
        business_type: 'Corporation (S.A.S., S.A., Inc.)',
        tax_id: '',
        registration_number: '',
        phone: '',
        country: 'France',
        kyb_status: 'unsubmitted',
        documents: []
    });

    useEffect(() => {
        async function fetchBiz() {
            try {
                const identifier = user?.storeHandle || user?.id || 'studiolabel';
                const res = await merchantService.getMerchantVerification(identifier);
                if (res?.success && res.vendor) {
                    const v = res.vendor;
                    setBizInfo({
                        legal_business_name: v.legal_business_name || v.store_name || user?.storeName || '',
                        business_type: v.business_type || 'Corporation (S.A.S., S.A., Inc.)',
                        tax_id: v.tax_id || '',
                        registration_number: v.registration_number || '',
                        phone: v.phone || '',
                        country: v.country || 'France',
                        kyb_status: v.kyb_status || v.kyc_status || 'unsubmitted',
                        documents: v.documents || []
                    });
                }
            } catch (err) {
                console.error('Failed to load merchant biz info in settings:', err);
            }
        }
        fetchBiz();
    }, [user]);

    const [notifications, setNotifications] = useState({
        orderAlerts: true,
        weeklyReport: true,
        creditWarnings: true,
        newsletter: false,
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            if (activeTab === 'verification') {
                const identifier = user?.storeHandle || user?.id || 'studiolabel';
                await merchantService.saveMerchantBusinessDetails(identifier, bizInfo);
            }
            setTimeout(() => {
                setSaving(false);
                alert('Settings saved successfully!');
            }, 600);
        } catch (err) {
            setSaving(false);
            alert('Failed to save settings.');
        }
    };
    return (<>
      {/* Top Bar */}
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--vs-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2,35,28,0.2)' }}>
              <Settings size={16} color="var(--vs-lime)"/>
            </div>
            Settings
          </div>
          <div className={styles.pageSubtitle}>Manage your seller profile, business verification, notifications, and security</div>
        </div>
        <div className={styles.topbarRight}>
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> : <Check size={14}/>}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className={styles.pageContent} style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
        
        {/* Settings Navigation Sidebar */}
        <div className={styles.panel} style={{ padding: '0.75rem', height: 'max-content' }}>
          {[
            { id: 'profile', label: 'Profile Details', icon: User },
            { id: 'verification', label: 'Business & KYC', icon: ShieldCheck, badge: bizInfo.kyb_status === 'verified' ? '✓' : 'REQUIRED' },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Auth', icon: Shield },
            { id: 'integrations', label: 'Integrations', icon: Globe },
        ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                    padding: '0.65rem 0.85rem', borderRadius: 8, border: 'none',
                    background: active ? 'var(--vs-lime-soft)' : 'transparent',
                    color: active ? 'var(--vs-green)' : 'var(--d-t3)',
                    fontWeight: active ? 700 : 600, fontSize: '0.84rem',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    marginBottom: 2
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={16} color={active ? 'var(--vs-green)' : 'var(--d-t4)'}/>
                  <span>{tab.label}</span>
                </div>
                {tab.badge && (
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: tab.badge === '✓' ? 'rgba(22,163,74,0.15)' : 'rgba(239,68,68,0.12)',
                    color: tab.badge === '✓' ? '#16a34a' : '#dc2626'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>);
        })}
        </div>

        {/* Settings Body panel */}
        <div className={styles.panel} style={{ padding: '1.5rem' }}>
          {activeTab === 'profile' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid var(--d-border2)', paddingBottom: '0.5rem', color: 'var(--d-t1)' }}>Store & Seller Details</div>
              
              <div className={styles.fGroup}>
                <label className={styles.fLabel}>Store Name</label>
                <input className={styles.fInput} value={profile.storeName} onChange={e => setProfile({ ...profile, storeName: e.target.value })}/>
              </div>

              <div className={styles.fGroup}>
                <label className={styles.fLabel}>Store Description</label>
                <textarea className={styles.fTextarea} style={{ minHeight: 80 }} value={profile.storeDescription} onChange={e => setProfile({ ...profile, storeDescription: e.target.value })}/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Account Manager Name</label>
                  <input className={styles.fInput} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}/>
                </div>
                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Support Email Address</label>
                  <input className={styles.fInput} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}/>
                </div>
              </div>

              <div className={styles.fGroup}>
                <label className={styles.fLabel}>Business Phone Number</label>
                <input className={styles.fInput} value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })}/>
              </div>
            </div>)}

          {activeTab === 'verification' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--d-border2)', paddingBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--d-t1)' }}>Merchant Business & KYB Verification</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--d-t3)', marginTop: 2 }}>Official legal entity and compliance documentation for marketplace payouts</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 9999, fontSize: '0.74rem', fontWeight: 700,
                    textTransform: 'uppercase',
                    background: bizInfo.kyb_status === 'verified' ? 'rgba(22,163,74,0.12)' : bizInfo.kyb_status === 'under_review' ? 'rgba(217,119,6,0.12)' : 'rgba(113,113,122,0.12)',
                    color: bizInfo.kyb_status === 'verified' ? '#16a34a' : bizInfo.kyb_status === 'under_review' ? '#d97706' : '#71717a'
                  }}>
                    {bizInfo.kyb_status === 'verified' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                    {bizInfo.kyb_status === 'under_review' ? 'Pending Review' : bizInfo.kyb_status.replace('_', ' ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/merchant/verification')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'var(--vs-green)', color: 'var(--vs-lime)',
                      border: 'none', borderRadius: 8, padding: '5px 12px',
                      fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    <span>Full Verification Flow</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              <div style={{
                background: bizInfo.kyb_status === 'verified' ? 'rgba(22,163,74,0.06)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${bizInfo.kyb_status === 'verified' ? 'rgba(22,163,74,0.2)' : 'rgba(245,158,11,0.25)'}`,
                borderRadius: 10, padding: '0.85rem 1rem', fontSize: '0.82rem',
                color: bizInfo.kyb_status === 'verified' ? '#15803d' : '#92400e',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                {bizInfo.kyb_status === 'verified' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                <span>
                  {bizInfo.kyb_status === 'verified'
                    ? 'Verified Merchant: Your business entity is fully approved. Stripe escrow transfers release 48h after carrier delivery.'
                    : 'Verification Incomplete: Please upload required corporate documents to enable daily Stripe bank deposits.'}
                </span>
              </div>

              {/* Legal Entity Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Legal Registered Business Name</label>
                  <input className={styles.fInput} value={bizInfo.legal_business_name} onChange={e => setBizInfo({ ...bizInfo, legal_business_name: e.target.value })} placeholder="e.g. Studio Label Paris S.A.S." />
                </div>
                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Business Structure</label>
                  <select className={styles.fInput} value={bizInfo.business_type} onChange={e => setBizInfo({ ...bizInfo, business_type: e.target.value })}>
                    <option value="Corporation (S.A.S., S.A., Inc.)">Corporation (S.A.S., S.A., Inc.)</option>
                    <option value="Limited Liability Company (LLC / SARL / GmbH)">Limited Liability Company (LLC / SARL / GmbH)</option>
                    <option value="Sole Proprietorship / Auto-Entrepreneur">Sole Proprietorship / Auto-Entrepreneur</option>
                    <option value="Partnership (General / Limited)">Partnership (General / Limited)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Commercial Registry Number (SIREN / Co ID)</label>
                  <input className={styles.fInput} value={bizInfo.registration_number} onChange={e => setBizInfo({ ...bizInfo, registration_number: e.target.value })} placeholder="e.g. RCS-PARIS-892938491" />
                </div>
                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Tax ID / VAT Registration</label>
                  <input className={styles.fInput} value={bizInfo.tax_id} onChange={e => setBizInfo({ ...bizInfo, tax_id: e.target.value })} placeholder="e.g. FR-89-293849102" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Country of Registration</label>
                  <input className={styles.fInput} value={bizInfo.country} onChange={e => setBizInfo({ ...bizInfo, country: e.target.value })} />
                </div>
                <div className={styles.fGroup}>
                  <label className={styles.fLabel}>Official Contact Phone</label>
                  <input className={styles.fInput} value={bizInfo.phone} onChange={e => setBizInfo({ ...bizInfo, phone: e.target.value })} placeholder="+33 1 42 68 55 00" />
                </div>
              </div>

              {/* Compliance Documents Summary */}
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--d-t1)', marginBottom: 8 }}>
                  Uploaded Compliance Documents
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(bizInfo.documents || []).map((doc) => (
                    <div key={doc.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem', borderRadius: 8,
                      border: '1px solid var(--d-border)', background: 'var(--d-bg2)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText size={16} color={doc.filename ? '#16a34a' : 'var(--d-t4)'} />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--d-t1)' }}>{doc.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--d-t3)' }}>
                            {doc.filename ? `${doc.filename} • ${doc.size || '1.2 MB'}` : 'Not yet uploaded'}
                          </div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                        background: doc.status === 'verified' ? 'rgba(22,163,74,0.12)' : doc.status === 'pending' ? 'rgba(217,119,6,0.12)' : 'rgba(239,68,68,0.1)',
                        color: doc.status === 'verified' ? '#16a34a' : doc.status === 'pending' ? '#d97706' : '#dc2626'
                      }}>
                        {doc.status === 'verified' ? 'Verified ✓' : doc.status === 'pending' ? 'Pending Review' : 'Upload Required'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>)}

          {activeTab === 'notifications' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid var(--d-border2)', paddingBottom: '0.5rem', color: 'var(--d-t1)' }}>Alert Preferences</div>

              {[
                { id: 'orderAlerts', label: 'Instant Order Alerts', desc: 'Notify me immediately when a customer purchases products.' },
                { id: 'weeklyReport', label: 'Weekly Dashboard Summary', desc: 'Receive weekly views, sales, and try-on credits consumption summaries.' },
                { id: 'creditWarnings', label: 'Low Credits Alerts', desc: 'Warn me via email when try-on credits fall below 20% remaining.' },
                { id: 'newsletter', label: 'VogueSocial Product Updates', desc: 'Occasional emails about new features, design templates, and marketplace trends.' },
            ].map(opt => (<div key={opt.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', padding: '0.5rem 0' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--d-t1)' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--d-t3)', marginTop: 2 }}>{opt.desc}</div>
                  </div>
                  <input type="checkbox" checked={notifications[opt.id]} onChange={e => setNotifications({ ...notifications, [opt.id]: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--vs-green)' }}/>
                </div>))}
            </div>)}

          {activeTab === 'security' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid var(--d-border2)', paddingBottom: '0.5rem', color: 'var(--d-t1)' }}>Change Password</div>

              <div className={styles.fGroup}>
                <label className={styles.fLabel}>Current Password</label>
                <input className={styles.fInput} type="password" placeholder="••••••••"/>
              </div>

              <div className={styles.fGroup}>
                <label className={styles.fLabel}>New Password</label>
                <input className={styles.fInput} type="password" placeholder="••••••••"/>
              </div>

              <div className={styles.fGroup}>
                <label className={styles.fLabel}>Confirm New Password</label>
                <input className={styles.fInput} type="password" placeholder="••••••••"/>
              </div>

              <div style={{ background: 'var(--d-card)', border: '1px solid var(--d-border)', borderRadius: 10, padding: '1rem', marginTop: '1rem', display: 'flex', gap: 10, alignItems: 'center' }}>
                <ShieldCheck size={20} color="#16a34a"/>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--d-t1)' }}>Two-Factor Authentication is active</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--d-t3)', marginTop: 1 }}>Protects your store earnings and payouts details from unauthorized access.</div>
                </div>
              </div>
            </div>)}

          {activeTab === 'integrations' && (<div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '1px solid var(--d-border2)', paddingBottom: '0.5rem', color: 'var(--d-t1)' }}>Third-Party Connections</div>

              {[
                { name: 'Instagram Shopping Feed', desc: 'Sync custom catalog items directly to your brand Instagram profile.', active: true },
                { name: 'TikTok Catalog Sync', desc: 'Auto-sync catalog items to TikTok Shop inventory feeds.', active: false },
                { name: 'Shopify Store Connector', desc: 'Auto-sync Shopify products catalog to VogueSocial dashboard.', active: false },
            ].map((conn, idx) => (<div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--d-border)', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--d-t1)' }}>{conn.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--d-t3)', marginTop: 2 }}>{conn.desc}</div>
                  </div>
                  <button className={conn.active ? styles.btnGhost : styles.btnPrimary} style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}>
                    {conn.active ? 'Connected ✓' : 'Connect'}
                  </button>
                </div>))}
            </div>)}
        </div>
      </div>
    </>);
}
