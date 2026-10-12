"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Check, Copy } from 'lucide-react';

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
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="admin-panel" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--adm-border)' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text-main)', margin: 0 }}>
            Stripe Connect
          </h3>
          <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', margin: '3px 0 0' }}>
            Escrow custody, custom accounts, and automated seller payouts.
          </p>
        </div>

        {/* Minimal Segmented Switcher */}
        <div className="admin-segmented">
          <button
            type="button"
            className={`admin-segmented-btn ${form.environment === 'sandbox' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, environment: 'sandbox' })}
          >
            Test Mode
          </button>
          <button
            type="button"
            className={`admin-segmented-btn ${form.environment === 'production' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, environment: 'production' })}
          >
            Live Mode
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
        {/* Row 1: Publishable Key */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Publishable Key</div>
            <div className="admin-settings-desc">Client-side identifier used for checkout tokenization.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="admin-input"
                value={form.publishable_key}
                onChange={(e) => setForm({ ...form, publishable_key: e.target.value })}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.76rem', paddingRight: '2.5rem' }}
                placeholder="pk_test_..."
              />
              <button
                type="button"
                onClick={() => handleCopy(form.publishable_key)}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--adm-text-sub)', cursor: 'pointer', padding: '2px' }}
                title="Copy key"
              >
                {copiedKey ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Restricted Secret Key */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Secret Key</div>
            <div className="admin-settings-desc">Restricted server key for escrow balance transfers and refunds.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ position: 'relative' }}>
              <input
                type={showSecret ? "text" : "password"}
                className="admin-input"
                value={form.secret_key}
                onChange={(e) => setForm({ ...form, secret_key: e.target.value })}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.76rem', paddingRight: '2.5rem' }}
                placeholder="sk_test_..."
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--adm-text-sub)', cursor: 'pointer', padding: '2px' }}
              >
                {showSecret ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Webhook Signing Secret */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Signing Secret</div>
            <div className="admin-settings-desc">Verifies cryptographic signatures on inbound events.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ position: 'relative' }}>
              <input
                type={showWebhookSecret ? "text" : "password"}
                className="admin-input"
                value={form.webhook_secret}
                onChange={(e) => setForm({ ...form, webhook_secret: e.target.value })}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.76rem', paddingRight: '2.5rem' }}
                placeholder="whsec_..."
              />
              <button
                type="button"
                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--adm-text-sub)', cursor: 'pointer', padding: '2px' }}
              >
                {showWebhookSecret ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        </div>

        {/* Row 4: Platform Take-Rate */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Platform Commission</div>
            <div className="admin-settings-desc">Percentage deducted automatically upon escrow release.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                className="admin-input"
                value={form.platform_take_rate}
                onChange={(e) => setForm({ ...form, platform_take_rate: parseFloat(e.target.value) || 0 })}
                style={{ width: '90px', fontWeight: 600 }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-sub)' }}>%</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--adm-text-muted)', marginLeft: '0.5rem' }}>
                ({(100 - form.platform_take_rate).toFixed(1)}% disbursed to merchant)
              </span>
            </div>
          </div>
        </div>

        {/* Row 5: Escrow Hold Duration */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Settlement Hold Window</div>
            <div className="admin-settings-desc">Delay before unlocked funds disburse if no claim is filed.</div>
          </div>
          <div className="admin-settings-control">
            <select
              className="admin-select"
              value={form.auto_settle_hours}
              onChange={(e) => setForm({ ...form, auto_settle_hours: parseInt(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="24">24 hours post-delivery</option>
              <option value="48">48 hours post-delivery (Standard)</option>
              <option value="72">72 hours post-delivery</option>
              <option value="168">7 calendar days</option>
            </select>
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--adm-border)' }}>
          {savedSuccess && (
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={13} /> Settings saved
            </span>
          )}
          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-sm"
            disabled={saving}
            style={{ minWidth: '110px' }}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
