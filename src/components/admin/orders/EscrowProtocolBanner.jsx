"use client";
import React, { useState } from 'react';
import { Lock, ArrowRight, ChevronUp, ChevronDown, Info } from 'lucide-react';

export default function EscrowProtocolBanner() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="admin-panel"
      style={{
        padding: collapsed ? '0.75rem 1.25rem' : '1.15rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05) 0%, rgba(129, 140, 248, 0.05) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '280px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}
          >
            <Lock size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--adm-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Tripartite Escrow Protocol</span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                ACTIVE GUARANTEE
              </span>
            </div>
            {!collapsed && (
              <div style={{ fontSize: '0.72rem', color: 'var(--adm-text-sub)', lineHeight: 1.4, marginTop: '2px' }}>
                Buyer funds are secured in the platform Vault upon checkout. Once tracked delivery is verified, 95% net is unlocked to merchant balance and 5% is retained as protocol fee.
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {!collapsed && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.7rem',
                color: 'var(--adm-text-muted)',
                background: 'var(--adm-panel)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--adm-border)'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} />
                1. Vault Custody
              </span>
              <ArrowRight size={11} color="var(--adm-text-sub)" />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#38bdf8' }} />
                2. Tracked Transit
              </span>
              <ArrowRight size={11} color="var(--adm-text-sub)" />
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
                3. 95% Brand / 5% Vogue
              </span>
            </div>
          )}

          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand escrow info" : "Collapse info banner"}
            style={{ padding: '4px 8px', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            <span>{collapsed ? 'Info' : 'Hide'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
