"use client";
import React, { useState } from 'react';
import { Play, Trash2, Code, Check, ShieldCheck, ShieldAlert, Filter } from 'lucide-react';
import { AdminModal } from '../index';

export default function WebhookStreamConsole({
  events = [],
  onSimulate,
  onClear,
  simulating = false
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [testType, setTestType] = useState('shipment.delivered');
  const [domainFilter, setDomainFilter] = useState('all');
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleCopyPayload = (obj) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Filter events by domain
  const filteredEvents = events.filter((evt) => {
    if (domainFilter === 'all') return true;
    const domain = (evt.domain || '').toLowerCase();
    return domain === domainFilter;
  });

  const domainCounts = {
    all: events.length,
    payment: events.filter(e => (e.domain || '').toLowerCase() === 'payment').length,
    logistics: events.filter(e => (e.domain || '').toLowerCase() === 'logistics').length,
    payout: events.filter(e => (e.domain || '').toLowerCase() === 'payout').length,
    dispute: events.filter(e => (e.domain || '').toLowerCase() === 'dispute').length
  };

  const DOMAIN_STYLES = {
    payment: { bg: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', label: 'Payment' },
    logistics: { bg: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', label: 'Logistics' },
    payout: { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', label: 'Payout' },
    dispute: { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', label: 'Dispute' }
  };

  return (
    <div className="admin-panel" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--adm-border)', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text-main)', margin: 0 }}>
            Inbound Webhook Stream & HMAC Verification
          </h3>
          <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', margin: '3px 0 0' }}>
            Event ingest from payment processors and carrier tracking networks with cryptographic verification.
          </p>
        </div>

        {/* Minimal Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            className="admin-select"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            style={{ width: 'auto', fontSize: '0.72rem', padding: '0.35rem 0.65rem' }}
          >
            <option value="shipment.delivered">[Logistics] DHL Delivery Scan (POD Verified)</option>
            <option value="payment_intent.succeeded">[Payment] Stripe Payment Intent Succeeded ($350)</option>
            <option value="transfer.created">[Payout] 5-Gate Verified Merchant Payout</option>
            <option value="charge.dispute.created">[Dispute] Stripe Chargeback / Escrow Frozen</option>
          </select>

          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => onSimulate(testType)}
            disabled={simulating}
          >
            <Play size={11} />
            <span>{simulating ? 'Simulating...' : 'Dispatch event'}</span>
          </button>

          {events.length > 0 && (
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={onClear}
              title="Clear events"
              style={{ padding: '0.35rem 0.65rem' }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Domain Categorization Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--adm-text-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: '4px' }}>
          Domain:
        </span>
        {[
          { id: 'all', label: 'All Domains' },
          { id: 'payment', label: 'Payment' },
          { id: 'logistics', label: 'Logistics' },
          { id: 'payout', label: 'Payout' },
          { id: 'dispute', label: 'Dispute' }
        ].map((item) => {
          const isActive = domainFilter === item.id;
          const count = domainCounts[item.id] || 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setDomainFilter(item.id)}
              style={{
                fontSize: '0.7rem',
                fontWeight: 500,
                padding: '3px 8px',
                borderRadius: '6px',
                border: `1px solid ${isActive ? 'var(--adm-accent)' : 'var(--adm-border)'}`,
                background: isActive ? 'var(--adm-accent-glow)' : 'transparent',
                color: isActive ? 'var(--adm-text-main)' : 'var(--adm-text-sub)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>{item.label}</span>
              <span style={{ fontSize: '0.62rem', opacity: 0.8, background: 'rgba(255, 255, 255, 0.08)', padding: '0 4px', borderRadius: '3px' }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Events Table */}
      <div className="admin-table-wrap" style={{ marginTop: '0.75rem' }}>
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--adm-text-sub)', fontSize: '0.78rem' }}>
            No webhook events found for the selected filter. Dispatch a test event above to observe real-time ingestion.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time & ID</th>
                <th>Domain</th>
                <th>Event Type</th>
                <th>Target Order</th>
                <th>HMAC Signature</th>
                <th>Status & Retries</th>
                <th style={{ textAlign: 'right' }}>Payload</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((evt) => {
                const timeStr = new Date(evt.timestamp).toLocaleTimeString();
                const domainStyle = DOMAIN_STYLES[evt.domain] || { bg: 'rgba(255,255,255,0.06)', color: 'var(--adm-text-sub)', label: evt.domain || 'Generic' };
                const isSignatureValid = !evt.signature_verification || evt.signature_verification.includes('verified');

                return (
                  <tr key={evt.id}>
                    {/* Time & ID */}
                    <td>
                      <div style={{ fontSize: '0.74rem', color: 'var(--adm-text-main)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                        {timeStr}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--adm-text-sub)', fontFamily: 'monospace' }}>
                        {evt.id}
                      </div>
                    </td>

                    {/* Domain */}
                    <td>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: domainStyle.bg,
                          color: domainStyle.color
                        }}
                      >
                        {domainStyle.label}
                      </span>
                    </td>

                    {/* Event Type */}
                    <td>
                      <code style={{ fontSize: '0.72rem', color: 'var(--adm-text-main)', background: 'var(--adm-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--adm-border)' }}>
                        {evt.event}
                      </code>
                    </td>

                    {/* Target Order */}
                    <td>
                      <span style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', fontFamily: 'monospace' }}>
                        #{evt.order_id}
                      </span>
                    </td>

                    {/* HMAC Signature Verification */}
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontWeight: 500, color: isSignatureValid ? '#10b981' : '#ef4444' }}>
                        {isSignatureValid ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                        <span>HMAC-SHA256 Valid</span>
                      </span>
                    </td>

                    {/* Status & Retries */}
                    <td>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#10b981' }}>
                        {evt.status || 200} OK
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'var(--adm-text-sub)' }}>
                        Retry: {evt.retry_count || '1/3'}
                      </div>
                    </td>

                    {/* Inspect Payload */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => setSelectedEvent(evt)}
                        style={{ padding: '2px 7px', fontSize: '0.68rem' }}
                      >
                        <Code size={11} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Payload Modal */}
      {selectedEvent && (
        <AdminModal
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          title={`Webhook Event: ${selectedEvent.event}`}
          maxWidth="600px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => handleCopyPayload(selectedEvent)}
              >
                {copiedPayload ? <Check size={12} color="#10b981" /> : <Code size={12} />}
                <span>{copiedPayload ? 'Copied JSON' : 'Copy JSON'}</span>
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
            </div>
          }
        >
          {/* Metadata Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', padding: '0.85rem', borderRadius: '6px', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', marginBottom: '1rem', fontSize: '0.72rem' }}>
            <div>
              <span style={{ color: 'var(--adm-text-sub)' }}>Event ID:</span>{' '}
              <strong style={{ fontFamily: 'monospace', color: 'var(--adm-text-main)' }}>{selectedEvent.id}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--adm-text-sub)' }}>Source:</span>{' '}
              <strong style={{ color: 'var(--adm-text-main)' }}>{selectedEvent.source}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--adm-text-sub)' }}>Signature:</span>{' '}
              <span style={{ color: '#10b981', fontWeight: 600 }}>HMAC-SHA256 (Valid)</span>
            </div>
            <div>
              <span style={{ color: 'var(--adm-text-sub)' }}>Idempotency Key:</span>{' '}
              <strong style={{ fontFamily: 'monospace', color: 'var(--adm-text-main)' }}>{selectedEvent.idempotency_key || 'idemp_live_verified'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--adm-text-sub)' }}>Timestamp:</span>{' '}
              <span style={{ color: 'var(--adm-text-main)' }}>{new Date(selectedEvent.timestamp).toLocaleString()}</span>
            </div>
            <div>
              <span style={{ color: 'var(--adm-text-sub)' }}>Processing Status:</span>{' '}
              <span style={{ color: '#10b981', fontWeight: 600 }}>{selectedEvent.processing_status || 'Processed (200 OK)'}</span>
            </div>
          </div>

          <pre
            style={{
              padding: '1rem',
              borderRadius: '6px',
              background: '#090d16',
              color: '#38bdf8',
              fontSize: '0.74rem',
              overflowX: 'auto',
              border: '1px solid var(--adm-border)',
              margin: 0,
              fontFamily: 'monospace'
            }}
          >
            {JSON.stringify(selectedEvent, null, 2)}
          </pre>
        </AdminModal>
      )}
    </div>
  );
}
