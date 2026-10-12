"use client";
import React, { useState } from 'react';
import {
  CreditCard, ShieldCheck, Eye, EyeOff, Check,
  Save, AlertCircle, RefreshCw, Lock
} from 'lucide-react';

export default function StripeGatewayCard({
  config = {},
  onSave,
  saving = false
}) {
  const [form, setForm] = useState({
    environment: config.environment || 'sandbox',
    publishable_key: config.publishable_key || '',
    secret_key: config.secret_key || '',
    webhook_secret: config.webhook_secret || '',
    platform_take_rate: config.platform_take_rate || 5.0,
    auto_settle_hours: config.auto_settle_hours || 48
  });

  const [showSecret, setShowSecret] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="admin-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CreditCard size={20} />
          </div>
          <div>
            <h3 className="admin-panel-title" style={{ margin: 0 }}>
              Stripe Connect & Escrow Gateway
            </h3>
            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
              Custom Marketplace Accounts • Automated Separate Charges & Transfers (95% Net / 5% Protocol Fee)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '99px',
              background: form.environment === 'production' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: form.environment === 'production' ? '#10b981' : '#f59e0b',
              border: `1px solid ${form.environment === 'production' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}
          >
            {form.environment === 'production' ? '● LIVE PRODUCTION' : '○ SANDBOX TESTNET'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Environment Mode Switch */}
        <div style={{ marginBottom: '1.25rem', padding: '0.85rem', borderRadius: '8px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                Gateway Environment Mode
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                Test keys process simulated charges. Live keys connect actual merchant bank accounts.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className={`admin-btn admin-btn-sm ${form.environment === 'sandbox' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setForm({ ...form, environment: 'sandbox' })}
              >
                Sandbox Mode
              </button>
              <button
                type="button"
                className={`admin-btn admin-btn-sm ${form.environment === 'production' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                onClick={() => setForm({ ...form, environment: 'production' })}
              >
                Production Mode
              </button>
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--adm-text-sub)', marginBottom: '0.35rem' }}>
              Publishable Key
            </label>
            <input
              type="text"
              className="admin-search-input"
              value={form.publishable_key}
              onChange={(e) => setForm({ ...form, publishable_key: e.target.value })}
              style={{ width: '100%', paddingLeft: '0.85rem', fontFamily: 'monospace', fontSize: '0.76rem' }}
              placeholder="pk_test_..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--adm-text-sub)', marginBottom: '0.35rem' }}>
              Restricted Secret Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showSecret ? "text" : "password"}
                className="admin-search-input"
                value={form.secret_key}
                onChange={(e) => setForm({ ...form, secret_key: e.target.value })}
                style={{ width: '100%', paddingLeft: '0.85rem', paddingRight: '2.5rem', fontFamily: 'monospace', fontSize: '0.76rem' }}
                placeholder="sk_test_..."
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--adm-text-sub)', cursor: 'pointer' }}
              >
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--adm-text-sub)', marginBottom: '0.35rem' }}>
              Webhook Endpoint Secret
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showWebhookSecret ? "text" : "password"}
                className="admin-search-input"
                value={form.webhook_secret}
                onChange={(e) => setForm({ ...form, webhook_secret: e.target.value })}
                style={{ width: '100%', paddingLeft: '0.85rem', paddingRight: '2.5rem', fontFamily: 'monospace', fontSize: '0.76rem' }}
                placeholder="whsec_..."
              />
              <button
                type="button"
                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--adm-text-sub)', cursor: 'pointer' }}
              >
                {showWebhookSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Platform Take-Rate & Hold Window */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', borderRadius: '8px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-main)' }}>
                VogueSocial Protocol Fee (Take-Rate)
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#818cf8' }}>
                {form.platform_take_rate}%
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={form.platform_take_rate}
              onChange={(e) => setForm({ ...form, platform_take_rate: parseFloat(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#818cf8' }}
            />
            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
              Upon delivery verification, 95% net transfers to merchant bank and 5% is retained.
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--adm-text-main)', marginBottom: '0.35rem' }}>
              Automated Escrow Inspection Window
            </div>
            <select
              className="admin-search-input"
              value={form.auto_settle_hours}
              onChange={(e) => setForm({ ...form, auto_settle_hours: parseInt(e.target.value) })}
              style={{ width: '100%', paddingLeft: '0.85rem', fontSize: '0.76rem', cursor: 'pointer' }}
            >
              <option value="24">24 Hours Post-Delivery</option>
              <option value="48">48 Hours Post-Delivery (Recommended Luxury Standard)</option>
              <option value="72">72 Hours Post-Delivery</option>
              <option value="168">7 Calendar Days</option>
            </select>
            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
              Funds automatically disburse if the buyer raises zero dispute claims before this timer expires.
            </div>
          </div>
        </div>

        {/* Actions & Feedback */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
            <Lock size={12} color="#10b981" />
            <span>End-to-end encrypted AES-256 vault credentials</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {savedSuccess && (
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> Configuration saved & verified!
              </span>
            )}
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={saving}
              style={{ minWidth: '150px' }}
            >
              {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{saving ? 'Validating...' : 'Save Stripe Config'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
