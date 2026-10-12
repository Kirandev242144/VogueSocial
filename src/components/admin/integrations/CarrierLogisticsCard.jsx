"use client";
import React, { useState } from 'react';
import { Check, Copy, Lock, Shield, Truck, AlertCircle } from 'lucide-react';

export default function CarrierLogisticsCard({
  config = {},
  onSave,
  saving = false
}) {
  const [form, setForm] = useState({
    default_model: config.default_model || 'merchant_fulfilled', // 'merchant_fulfilled' | 'platform_labels'
    provider: config.provider || 'EasyPost Universal Gateway',
    webhook_endpoint: config.webhook_endpoint || 'https://api.voguesocial.com/webhooks/shipping',
    carriers: config.carriers || {
      dhl_express: {
        enabled: true,
        name: 'DHL Express',
        status: 'connected',
        region: 'Global (220+ Countries)',
        model: 'Platform Account & Merchant Self-Ship'
      },
      fedex_priority: {
        enabled: false,
        name: 'FedEx International Priority',
        status: 'merchant_account_required',
        region: 'North America & Europe',
        model: 'Merchant Own Account'
      },
      ups_worldwide: {
        enabled: false,
        name: 'UPS Worldwide Expedited',
        status: 'merchant_account_required',
        region: 'Global',
        model: 'Merchant Own Account'
      },
      boutique_couriers: {
        enabled: true,
        name: 'Merchant Self-Fulfill (Local Courier)',
        status: 'supported',
        region: 'Worldwide Domestic',
        model: 'Merchant Direct Tracking'
      }
    }
  });

  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [pingStatus, setPingStatus] = useState(null);
  const [pingLoading, setPingLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  const handlePing = async () => {
    setPingLoading(true);
    setPingStatus(null);
    await new Promise(r => setTimeout(r, 450));
    setPingLoading(false);
    setPingStatus('Carrier tracking webhook receiver operational (38ms)');
    setTimeout(() => setPingStatus(null), 3500);
  };

  const handleToggle = (key) => {
    setForm({
      ...form,
      carriers: {
        ...form.carriers,
        [key]: {
          ...form.carriers[key],
          enabled: !form.carriers[key].enabled
        }
      }
    });
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
              Shipping & Logistics
            </h3>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981'
              }}
            >
              Universal Tracking Gateway
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', margin: '3px 0 0' }}>
            Multi-carrier parcel routing, merchant self-fulfillment, and delivery milestone webhooks.
          </p>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-ghost admin-btn-sm"
          onClick={handlePing}
          disabled={pingLoading}
        >
          {pingLoading ? 'Testing...' : 'Test connection'}
        </button>
      </div>

      {pingStatus && (
        <div style={{ margin: '1rem 0 0', padding: '0.5rem 0.75rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Check size={12} /> {pingStatus}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
        {/* Row 1: Fulfillment Operating Model */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Marketplace Fulfillment Model</div>
            <div className="admin-settings-desc">Operating mechanism for order dispatch and label issuance.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Option A: Merchant's Own Shipping (Active Default) */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '6px',
                  border: `1px solid ${form.default_model === 'merchant_fulfilled' ? 'var(--adm-accent)' : 'var(--adm-border)'}`,
                  background: form.default_model === 'merchant_fulfilled' ? 'var(--adm-panel-hover)' : 'var(--adm-bg)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <input
                  type="radio"
                  name="fulfillment_model"
                  value="merchant_fulfilled"
                  checked={form.default_model === 'merchant_fulfilled'}
                  onChange={() => setForm({ ...form, default_model: 'merchant_fulfilled' })}
                  style={{ marginTop: '2px', accentColor: 'var(--adm-accent)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--adm-text-main)' }}>
                      Merchant's Own Shipping
                    </span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(56, 189, 248, 0.12)', color: 'var(--adm-accent)' }}>
                      Active Default
                    </span>
                  </div>
                  <div style={{ fontSize: '0.69rem', color: 'var(--adm-text-sub)', marginTop: '2px', lineHeight: 1.4 }}>
                    Merchants dispatch from ateliers using their own carrier accounts. Tracking numbers entered by merchants sync milestones via webhook to verify Proof of Delivery (POD).
                  </div>
                </div>
              </label>

              {/* Option B: Platform-Integrated Labels */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '6px',
                  border: `1px solid ${form.default_model === 'platform_labels' ? 'var(--adm-accent)' : 'var(--adm-border)'}`,
                  background: form.default_model === 'platform_labels' ? 'var(--adm-panel-hover)' : 'var(--adm-bg)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <input
                  type="radio"
                  name="fulfillment_model"
                  value="platform_labels"
                  checked={form.default_model === 'platform_labels'}
                  onChange={() => setForm({ ...form, default_model: 'platform_labels' })}
                  style={{ marginTop: '2px', accentColor: 'var(--adm-accent)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--adm-text-main)' }}>
                      Platform-Integrated Labels
                    </span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--adm-text-sub)' }}>
                      Optional Add-on
                    </span>
                  </div>
                  <div style={{ fontSize: '0.69rem', color: 'var(--adm-text-sub)', marginTop: '2px', lineHeight: 1.4 }}>
                    VogueSocial generates printable shipping labels on behalf of merchants using master volume billing. Requires pre-funded carrier account balance.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Row 2: Universal Tracking API Key */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Carrier Gateway API Key</div>
            <div className="admin-settings-desc">Master API key for parcel tracking and milestone webhooks.</div>
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
              <span>Loaded from <code>EASYPOST_API_KEY</code> server environment variable. Never exposed to browser.</span>
            </div>
          </div>
        </div>

        {/* Row 3: Inbound Webhook Endpoint */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Inbound Webhook Receiver</div>
            <div className="admin-settings-desc">Registered endpoint for real-time delivery and tracking scans.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                readOnly
                className="admin-input"
                value={form.webhook_endpoint}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.74rem', background: 'var(--adm-bg)', paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => handleCopy(form.webhook_endpoint)}
                style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--adm-text-sub)', cursor: 'pointer', padding: '2px' }}
                title="Copy webhook URL"
              >
                {copiedEndpoint ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
              </button>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '4px' }}>
              Receives carrier push notifications: <code>in_transit</code>, <code>out_for_delivery</code>, and <code>delivered</code>.
            </div>
          </div>
        </div>

        {/* Row 4: Carrier Connection Status & Routing */}
        <div className="admin-settings-row">
          <div className="admin-settings-info">
            <div className="admin-settings-title">Carrier Connections & Status</div>
            <div className="admin-settings-desc">Operational readiness across major logistics networks.</div>
          </div>
          <div className="admin-settings-control">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(form.carriers).map(([key, carrier]) => {
                const isConnected = carrier.status === 'connected';
                const isSupported = carrier.status === 'supported';
                const isReq = carrier.status === 'merchant_account_required';

                let badgeColor = '#64748b';
                let badgeBg = 'rgba(255, 255, 255, 0.06)';
                let badgeLabel = 'Inactive';

                if (isConnected) {
                  badgeColor = '#10b981';
                  badgeBg = 'rgba(16, 185, 129, 0.12)';
                  badgeLabel = 'Connected';
                } else if (isSupported) {
                  badgeColor = '#38bdf8';
                  badgeBg = 'rgba(56, 189, 248, 0.12)';
                  badgeLabel = 'Supported';
                } else if (isReq) {
                  badgeColor = '#f59e0b';
                  badgeBg = 'rgba(245, 158, 11, 0.12)';
                  badgeLabel = 'Merchant Account Required';
                }

                return (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid var(--adm-border)',
                      background: 'var(--adm-bg)',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--adm-text-main)' }}>
                          {carrier.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.62rem',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '3px',
                            background: badgeBg,
                            color: badgeColor
                          }}
                        >
                          {badgeLabel}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
                        {carrier.region} • {carrier.model}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={carrier.enabled}
                      onChange={() => handleToggle(key)}
                      style={{ cursor: 'pointer', accentColor: 'var(--adm-accent)' }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Operational Safeguard Note */}
        <div style={{ marginTop: '1.25rem', padding: '1rem', borderRadius: '8px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--adm-text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Truck size={13} color="#38bdf8" />
            <span>Multi-Vendor Logistics Architecture</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)', margin: 0, lineHeight: 1.45 }}>
            In high-end fashion marketplaces, ateliers ship with their contracted international couriers. VogueSocial captures the merchant's tracking number and queries carrier APIs to verify physical Proof of Delivery (POD) before releasing escrow balances.
          </p>
        </div>

        {/* Action Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--adm-border)', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-muted)' }}>
            Demo Mode • Carrier webhooks and tracking events are simulated in testnet.
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
