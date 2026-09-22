"use client";
import React, { useState } from 'react';
import styles from '../merchant.module.css';
import { Settings, User, Bell, Shield, Globe, ShieldCheck, Check, Loader2 } from 'lucide-react';
export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: 'Tom Jenkins',
        email: 'tom@gmail.com',
        phone: '+1 (555) 019-2834',
        storeName: 'New Flick',
        storeDescription: 'Premium vintage and modern apparel drops.',
    });
    const [notifications, setNotifications] = useState({
        orderAlerts: true,
        weeklyReport: true,
        creditWarnings: true,
        newsletter: false,
    });
    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            alert('Settings saved successfully!');
        }, 800);
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
          <div className={styles.pageSubtitle}>Manage your seller profile, notification preferences, and account security</div>
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
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Auth', icon: Shield },
            { id: 'integrations', label: 'Integrations', icon: Globe },
        ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%',
                    padding: '0.65rem 0.85rem', borderRadius: 8, border: 'none',
                    background: active ? 'var(--vs-lime-soft)' : 'transparent',
                    color: active ? 'var(--vs-green)' : 'var(--d-t3)',
                    fontWeight: active ? 700 : 600, fontSize: '0.84rem',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    marginBottom: 2
                }}>
                <Icon size={16} color={active ? 'var(--vs-green)' : 'var(--d-t4)'}/>
                {tab.label}
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
