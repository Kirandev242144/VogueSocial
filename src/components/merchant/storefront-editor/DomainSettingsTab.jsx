"use client";
import React, { useState } from 'react';
import {
  Globe, Server, ShieldCheck, RefreshCw, Copy, Check, Lock, Loader2, ExternalLink
} from 'lucide-react';

export default function DomainSettingsTab({
  domainState,
  updateDomainState,
  onVerifyDNS,
  dnsChecking
}) {
  const [copiedKey, setCopiedKey] = useState('');

  const isLocalDev = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname.endsWith('.localhost') ||
    window.location.hostname === '127.0.0.1'
  );
  const portSuffix = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : ':3001';
  const handle = domainState.subdomain || 'studiolabel';

  const liveUrl = isLocalDev
    ? `http://${handle}.localhost${portSuffix}`
    : `https://${handle}.voguesocial.com`;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    });
  };

  const dnsRecords = [
    {
      type: 'CNAME',
      host: 'shop',
      target: 'cname.voguesocial.com',
      ttl: '3600',
      status: 'Verified ✓'
    },
    {
      type: 'A',
      host: '@',
      target: '76.76.21.21',
      ttl: '3600',
      status: 'Verified ✓'
    },
    {
      type: 'TXT',
      host: '_vogue-challenge',
      target: `vogue-verification=vs_live_${handle.slice(0, 8)}`,
      ttl: '3600',
      status: 'Verified ✓'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Free VogueSocial Subdomain */}
      <div style={{ border: '1px solid var(--d-border, #e2e8f0)', borderRadius: 10, padding: '1rem', background: 'var(--d-panel, #ffffff)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Globe size={16} color="#2563eb" />
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: 'var(--d-t1, #0f172a)' }}>
            VogueSocial Managed Subdomain
          </h4>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--d-t3, #64748b)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
          Every boutique receives an instant, free SSL-secured subdomain on the global edge network.
        </p>

        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <input
            type="text"
            className="editor-field-input"
            value={domainState.subdomain || ''}
            onChange={(e) => updateDomainState('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="your-brand-slug"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
          >
            <span>{liveUrl}</span>
            <ExternalLink size={11} />
          </a>
          <button
            type="button"
            className="editor-btn-secondary"
            onClick={() => handleCopy(liveUrl, 'subdomain')}
            style={{ fontSize: '0.7rem', padding: '0.3rem 0.65rem' }}
          >
            {copiedKey === 'subdomain' ? <><Check size={12} color="#16a34a" /> Copied</> : <><Copy size={12} /> Copy URL</>}
          </button>
        </div>
      </div>

      {/* 2. Branded Custom Apex / Domain */}
      <div style={{ border: '1px solid var(--d-border, #e2e8f0)', borderRadius: 10, padding: '1rem', background: 'var(--d-panel, #ffffff)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Server size={16} color="#0f172a" />
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, color: 'var(--d-t1, #0f172a)' }}>
            Branded Custom Domain
          </h4>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--d-t3, #64748b)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
          Connect your own domain (e.g. <code>shop.studiolabelparis.com</code>) with automated TLS 1.3 certificate provisioning.
        </p>

        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <input
            type="text"
            className="editor-field-input"
            value={domainState.custom_domain || ''}
            onChange={(e) => updateDomainState('custom_domain', e.target.value.toLowerCase().trim())}
            placeholder="e.g. shop.studiolabelparis.com"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700,
            background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0',
            padding: '2px 8px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4
          }}>
            <ShieldCheck size={12} color="#16a34a" /> SSL TLS 1.3 Active
          </span>

          <button
            type="button"
            className="editor-btn-secondary"
            onClick={onVerifyDNS}
            disabled={dnsChecking}
            style={{ fontSize: '0.72rem', padding: '0.35rem 0.75rem' }}
          >
            {dnsChecking ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RefreshCw size={12} />}
            <span>{dnsChecking ? 'Verifying...' : 'Test DNS'}</span>
          </button>
        </div>
      </div>

      {/* 3. DNS Mapping Table */}
      <div style={{ border: '1px solid var(--d-border, #e2e8f0)', borderRadius: 10, padding: '1rem', background: 'var(--d-panel, #ffffff)' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--d-t1, #0f172a)' }}>
          Active DNS Records
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dnsRecords.map((rec, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.5rem 0.65rem', borderRadius: 6, background: 'var(--d-hover, #f8fafc)',
                border: '1px solid var(--d-border, #e2e8f0)', fontSize: '0.72rem'
              }}
            >
              <div>
                <span style={{ fontWeight: 800, color: '#2563eb', marginRight: 6 }}>{rec.type}</span>
                <span style={{ color: 'var(--d-t2, #334155)', fontWeight: 600 }}>{rec.host}</span>
                <span style={{ color: 'var(--d-t3, #94a3b8)', margin: '0 4px' }}>→</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--d-t1, #0f172a)' }}>{rec.target}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(rec.target, `rec-${i}`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#64748b' }}
                title="Copy Target"
              >
                {copiedKey === `rec-${i}` ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
