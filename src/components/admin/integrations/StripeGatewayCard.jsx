"use client";
import React, { useState } from 'react';
import { Check, Copy, Shield, AlertCircle, Lock } from 'lucide-react';

export default function StripeGatewayCard({
  config = {},
  onSave,
  saving = false
}) {
  const [form, setForm] = useState({
    provider: config.provider || 'Stripe Connect (Marketplace)',
    environment: config.environment || 'sandbox',
    publishable_key: config.publishable_key || 'pk_test_51Mz9V2K9QxVogueSocialAtelierKey001',
    platform_take_rate: config.platform_take_rate || 5.0,
    settlement_buffer_hours: config.settlement_buffer_hours || 48
  });

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--adm-border)', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text-main)', margin: 0 }}>
              Marketplace Payments & Payouts
            </h3>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: '4px',
                background: form.environment === 'production' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.12)',
                color: form.environment === 'production' ? '#10b981' : '#38bdf8'
              }}
            >
              {form.environment === 'production' ? 'Live Production' : 'Sandbox Simulation'}
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', margin: '3px 0 0' }}>
            Payment processor connectivity, commission take-rate, and automated payout criteria.
          </p>
        </div>

        {/* Minimal Segmented Switcher */}
        <div className="admin-segmented">
          <button
            type="button"
            className={`admin-segmented-btn ${form.environment === 'sandbox' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, environment: 'sandbox' })}
          >
            Sandbox Mode
          </button>
          <button
            type="button"
            className={`admin-segmented-btn ${form.environment === 'production' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, environment: 'production' })}
          >
            Production Mode
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
        {/* Row 1: Payment Provider Status */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Configured Provider</div>
            <div className="admin-settings-desc">Underlying marketplace payment processor and payout engine.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', borderRadius: '6px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--adm-text-main)' }}>
                  {form.provider}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)' }}>
                  Separate Charges & Transfers • Custom Connected Accounts
                </div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                Operational
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Publishable Key */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Publishable Key</div>
            <div className="admin-settings-desc">Client-side public identifier used for checkout tokenization.</div>
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

        {/* Row 3: Server Secret Key (Masked & Protected) */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Restricted Secret Key</div>
            <div className="admin-settings-desc">Server-only credential for transfers, refunds, and balance moves.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value="•••••••••••••••••••••••••••••••• (Configured via server environment)"
                className="admin-input"
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.74rem', color: 'var(--adm-text-sub)', background: 'var(--adm-bg)' }}
              />
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={10} color="#10b981" />
              <span>Loaded from <code>STRIPE_SECRET_KEY</code> server environment variable. Never exposed to browser.</span>
            </div>
          </div>
        </div>

        {/* Row 4: Webhook Signing Secret (Masked & Protected) */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Webhook Signing Secret</div>
            <div className="admin-settings-desc">Cryptographically verifies the authenticity of inbound gateway events.</div>
          </div>
          <div className="admin-settings-control">
            <input
              type="text"
              readOnly
              value="•••••••••••••••••••••••••••••••• (Configured via server environment)"
              className="admin-input"
              style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.74rem', color: 'var(--adm-text-sub)', background: 'var(--adm-bg)' }}
            />
            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={10} color="#10b981" />
              <span>Loaded from <code>STRIPE_WEBHOOK_SECRET</code>. HMAC-SHA256 signatures validated on server.</span>
            </div>
          </div>
        </div>

        {/* Row 5: Platform Take-Rate */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Platform Take-Rate (Commission)</div>
            <div className="admin-settings-desc">Percentage retained by VogueSocial upon verified order settlement.</div>
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

        {/* Row 6: Settlement Hold Buffer */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Settlement Inspection Buffer</div>
            <div className="admin-settings-desc">Post-delivery holding window before automated payout triggers.</div>
          </div>
          <div className="admin-settings-control">
            <select
              className="admin-select"
              value={form.settlement_buffer_hours}
              onChange={(e) => setForm({ ...form, settlement_buffer_hours: parseInt(e.target.value) })}
              style={{ width: '100%', cursor: 'pointer' }}
            >
              <option value="24">24 hours post-delivery verification</option>
              <option value="48">48 hours post-delivery verification (Recommended Luxury Standard)</option>
              <option value="72">72 hours post-delivery verification</option>
              <option value="168">7 calendar days post-delivery verification</option>
            </select>
          </div>
        </div>

        {/* 5-Step Payout Verification Safety Protocol */}
        <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '8px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--adm-text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={13} color="#38bdf8" />
            <span>5-Step Automated Payout Eligibility Protocol</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', margin: '0 0 0.75rem', lineHeight: 1.45 }}>
            A payout is never executed purely by timer expiration. The backend enforces all 5 safety conditions before requesting provider fund movement:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--adm-text-main)' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> 1. Payment confirmed & settled
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--adm-text-main)' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> 2. Carrier delivery verified (POD)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--adm-text-main)' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> 3. Order not cancelled / refunded
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--adm-text-main)' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> 4. No active claim or dispute hold
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--adm-text-main)' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span> 5. Merchant KYC & account eligible
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--adm-border)', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)' }}>
            Demo Mode • Fund movement is simulated until payment provider agreement is contractually finalized.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
        </div>
      </form>
    </div>
  );
}
