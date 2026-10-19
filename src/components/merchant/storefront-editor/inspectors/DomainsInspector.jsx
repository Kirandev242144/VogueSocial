"use client";
import React, { useState } from 'react';
import {
  Globe, Server, ShieldCheck, RefreshCw, Copy, Check, ExternalLink, Loader2
} from 'lucide-react';
import '../StorefrontEditor.css';

export default function DomainsInspector({
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
    <div className="editor-domains-container">
      {/* 1. Free VogueSocial Subdomain */}
      <div className="editor-domain-card">
        <div className="editor-domain-card-header">
          <Globe size={16} color="#2563eb" />
          <h4 className="editor-domain-card-title">
            VogueSocial Managed Subdomain
          </h4>
        </div>
        <p className="editor-domain-card-desc">
          Every boutique receives an instant, free SSL-secured subdomain on the global edge network.
        </p>

        <input
          type="text"
          className="editor-field-input"
          value={domainState.subdomain || ''}
          onChange={(e) => updateDomainState('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          placeholder="your-brand-slug"
        />

        <div className="editor-domain-url-row">
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="editor-domain-live-link"
          >
            <span>{liveUrl}</span>
            <ExternalLink size={11} />
          </a>
          <button
            type="button"
            className="editor-btn-secondary"
            onClick={() => handleCopy(liveUrl, 'subdomain')}
          >
            {copiedKey === 'subdomain' ? (
              <>
                <Check size={12} color="#16a34a" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Branded Custom Domain */}
      <div className="editor-domain-card">
        <div className="editor-domain-card-header">
          <Server size={16} color="#0f172a" />
          <h4 className="editor-domain-card-title">
            Branded Custom Domain
          </h4>
        </div>
        <p className="editor-domain-card-desc">
          Connect your own domain (e.g. <code>shop.studiolabelparis.com</code>) with automated TLS 1.3 certificate provisioning.
        </p>

        <input
          type="text"
          className="editor-field-input"
          value={domainState.custom_domain || ''}
          onChange={(e) => updateDomainState('custom_domain', e.target.value.toLowerCase().trim())}
          placeholder="e.g. shop.studiolabelparis.com"
        />

        <div className="editor-domain-action-row">
          <span className="editor-ssl-badge">
            <ShieldCheck size={12} color="#16a34a" />
            <span>SSL TLS 1.3 Active</span>
          </span>

          <button
            type="button"
            className="editor-btn-secondary"
            onClick={onVerifyDNS}
            disabled={dnsChecking}
          >
            {dnsChecking ? <Loader2 size={12} className="editor-spin" /> : <RefreshCw size={12} />}
            <span>{dnsChecking ? 'Verifying...' : 'Test DNS'}</span>
          </button>
        </div>
      </div>

      {/* 3. DNS Mapping Table */}
      <div className="editor-domain-card">
        <h4 className="editor-domain-card-title">
          Active DNS Records
        </h4>
        <div className="editor-sections-list">
          {dnsRecords.map((rec, i) => (
            <div key={i} className="editor-dns-record-item">
              <div>
                <span className="editor-dns-type-tag">{rec.type}</span>
                <span className="editor-dns-host">{rec.host}</span>
                <span className="editor-dns-arrow">→</span>
                <span className="editor-dns-target">{rec.target}</span>
              </div>
              <button
                type="button"
                className="editor-icon-copy-btn"
                onClick={() => handleCopy(rec.target, `rec-${i}`)}
                title="Copy Target Record"
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
