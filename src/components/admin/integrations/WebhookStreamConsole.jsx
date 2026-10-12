"use client";
import React, { useState } from 'react';
import { Play, Trash2, Code, Check } from 'lucide-react';
import { AdminModal } from '../index';

export default function WebhookStreamConsole({
  events = [],
  onSimulate,
  onClear,
  simulating = false
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [testType, setTestType] = useState('shipment.delivered');
  const [copiedPayload, setCopiedPayload] = useState(false);

  const handleCopyPayload = (obj) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="admin-panel" style={{ padding: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1.25rem', borderBottom: '1px solid var(--adm-border)', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text-main)', margin: 0 }}>
            Webhook Stream
          </h3>
          <p style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', margin: '3px 0 0' }}>
            Inbound delivery scans, checkout intents, and dispute notifications.
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
            <option value="shipment.delivered">DHL Delivery Scan (Auto-settle)</option>
            <option value="payment_intent.succeeded">Stripe Payment Succeeded ($350)</option>
            <option value="charge.dispute.created">Stripe Dispute (Freeze Escrow)</option>
          </select>

          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => onSimulate(testType)}
            disabled={simulating}
          >
            <Play size={11} />
            <span>{simulating ? 'Sending...' : 'Send test event'}</span>
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

      {/* Events Table */}
      <div className="admin-table-wrap" style={{ marginTop: '0.5rem' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--adm-text-sub)', fontSize: '0.78rem' }}>
            No webhook events recorded in this session. Send a test event above to inspect payloads.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Source</th>
                <th>Event Type</th>
                <th>Target Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Payload</th>
              </tr>
            </thead>
            <tbody>
              {events.map((evt) => {
                const timeStr = new Date(evt.timestamp).toLocaleTimeString();
                return (
                  <tr key={evt.id}>
                    <td style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', fontVariantNumeric: 'tabular-nums' }}>
                      {timeStr}
                    </td>
                    <td style={{ fontSize: '0.76rem', color: 'var(--adm-text-main)', fontWeight: 500 }}>
                      {evt.source}
                    </td>
                    <td>
                      <code style={{ fontSize: '0.72rem', color: 'var(--adm-accent)', background: 'var(--adm-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--adm-border)' }}>
                        {evt.event}
                      </code>
                    </td>
                    <td style={{ fontSize: '0.74rem', color: 'var(--adm-text-sub)', fontFamily: 'monospace' }}>
                      #{evt.order_id}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#10b981' }}>
                        {evt.status} OK
                      </span>
                    </td>
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
          title={`Event: ${selectedEvent.event}`}
          maxWidth="560px"
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
          <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', marginBottom: '0.75rem' }}>
            Received at {new Date(selectedEvent.timestamp).toLocaleString()} from {selectedEvent.source}.
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
