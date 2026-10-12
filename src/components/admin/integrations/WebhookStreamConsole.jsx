"use client";
import React, { useState } from 'react';
import {
  Terminal, Play, Trash2, CheckCircle, RefreshCw,
  Code, Eye, Zap, ShieldAlert, Truck, CreditCard
} from 'lucide-react';
import { AdminModal } from '../index';

export default function WebhookStreamConsole({
  events = [],
  onSimulate,
  onClear,
  simulating = false
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeSimulationType, setActiveSimulationType] = useState('shipment.delivered');
  const [orderTarget, setOrderTarget] = useState('ORD-8241');

  const handleRunSimulation = async (type) => {
    setActiveSimulationType(type);
    await onSimulate(type, { order_id: orderTarget });
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
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Terminal size={20} />
          </div>
          <div>
            <h3 className="admin-panel-title" style={{ margin: 0 }}>
              Live Inbound Webhook Event Stream
            </h3>
            <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', marginTop: '2px' }}>
              Real-time HTTP payload ingestion from Stripe Connect & EasyPost carrier scanners
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={onClear}
            title="Clear event stream"
          >
            <Trash2 size={12} />
            <span>Clear Stream</span>
          </button>
        </div>
      </div>

      {/* Interactive Inbound Event Simulator Controls */}
      <div
        style={{
          padding: '1rem',
          borderRadius: '8px',
          background: 'var(--adm-bg)',
          border: '1px solid var(--adm-border)',
          marginBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--adm-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} color="#f59e0b" />
            <span>Interactive Webhook Simulator (Test Inbound Satellite Events)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--adm-text-sub)' }}>
            <span>Target Order:</span>
            <select
              className="admin-search-input"
              value={orderTarget}
              onChange={(e) => setOrderTarget(e.target.value)}
              style={{ width: '130px', padding: '2px 8px', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              <option value="ORD-8241">#ORD-8241 (Aisha M.)</option>
              <option value="ORD-8240">#ORD-8240 (Sara J.)</option>
              <option value="ORD-8237">#ORD-8237 (Fatima A.)</option>
              <option value="ORD-8235">#ORD-8235 (Disputed)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => handleRunSimulation('shipment.delivered')}
            disabled={simulating}
            style={{ fontSize: '0.72rem' }}
          >
            {simulating && activeSimulationType === 'shipment.delivered' ? <RefreshCw size={12} className="animate-spin" /> : <Truck size={12} color="#10b981" />}
            <span>Simulate DHL Delivery Scan (Triggers Escrow)</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => handleRunSimulation('payment_intent.succeeded')}
            disabled={simulating}
            style={{ fontSize: '0.72rem' }}
          >
            {simulating && activeSimulationType === 'payment_intent.succeeded' ? <RefreshCw size={12} className="animate-spin" /> : <CreditCard size={12} color="#818cf8" />}
            <span>Simulate Stripe Checkout Deposit ($350)</span>
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => handleRunSimulation('charge.dispute.created')}
            disabled={simulating}
            style={{ fontSize: '0.72rem' }}
          >
            {simulating && activeSimulationType === 'charge.dispute.created' ? <RefreshCw size={12} className="animate-spin" /> : <ShieldAlert size={12} color="#ef4444" />}
            <span>Simulate Buyer Dispute (Freezes Vault)</span>
          </button>
        </div>
      </div>

      {/* Terminal Console View */}
      <div
        style={{
          borderRadius: '8px',
          background: '#090d16',
          border: '1px solid #1e293b',
          overflow: 'hidden',
          fontFamily: 'monospace'
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            padding: '0.5rem 0.85rem',
            background: '#0f172a',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.68rem',
            color: '#94a3b8'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ marginLeft: '6px', fontWeight: 600 }}>gateway_listener.sh • 0.0.0.0:8080/webhooks</span>
          </div>
          <div>
            <span style={{ color: '#10b981', fontWeight: 700 }}>● LISTENING (200 OK)</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '0.75rem' }}>
          {events.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '0.74rem', padding: '1rem', textAlign: 'center' }}>
              No webhook events captured in current session. Trigger a simulation above.
            </div>
          ) : (
            events.map((evt) => {
              const timeStr = new Date(evt.timestamp).toLocaleTimeString();
              const isDelivered = evt.event === 'shipment.delivered';
              const isDispute = evt.event.includes('dispute');
              const isPayment = evt.event.includes('payment') || evt.event.includes('transfer');

              const color = isDelivered ? '#34d399' : (isDispute ? '#f87171' : '#818cf8');

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  style={{
                    padding: '0.45rem 0.65rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    borderRadius: '4px',
                    transition: 'background 0.12s ease'
                  }}
                  className="admin-terminal-row"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                    <span style={{ color: '#64748b', fontSize: '0.68rem' }}>[{timeStr}]</span>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>{evt.source}</span>
                    <span style={{ color, fontWeight: 700 }}>{evt.event}</span>
                    <span style={{ color: '#e2e8f0', fontSize: '0.7rem' }}>target={evt.order_id}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span style={{ color: '#34d399', fontSize: '0.66rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.15)' }}>
                      HTTP {evt.status}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Code size={11} /> Inspect
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Payload Inspector Modal */}
      {selectedEvent && (
        <AdminModal
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          title={`Webhook Payload: ${selectedEvent.event}`}
          maxWidth="560px"
          footer={
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => setSelectedEvent(null)}
            >
              Close Inspector
            </button>
          }
        >
          <div style={{ marginBottom: '1rem', fontSize: '0.74rem', color: 'var(--adm-text-sub)' }}>
            Captured at <strong>{new Date(selectedEvent.timestamp).toLocaleString()}</strong> from <strong>{selectedEvent.source}</strong> for Order <strong>#{selectedEvent.order_id}</strong>.
          </div>

          <pre
            style={{
              padding: '1rem',
              borderRadius: '8px',
              background: '#090d16',
              color: '#38bdf8',
              fontSize: '0.74rem',
              overflowX: 'auto',
              border: '1px solid #1e293b',
              margin: 0
            }}
          >
            {JSON.stringify(selectedEvent, null, 2)}
          </pre>
        </AdminModal>
      )}
    </div>
  );
}
