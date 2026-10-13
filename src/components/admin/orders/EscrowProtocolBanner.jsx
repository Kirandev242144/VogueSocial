"use client";
import React, { useState } from 'react';
import { CreditCard, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';

export default function EscrowProtocolBanner() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`psb-panel ${collapsed ? 'psb-panel-collapsed' : ''}`}>
      <div className="psb-wrap">
        <div className="psb-left">
          <div className="psb-icon-box">
            <CreditCard size={18} />
          </div>
          <div>
            <div className="psb-title-row">
              <span className="psb-title">Marketplace Payment Settlement</span>
              <span className="psb-badge">
                STRIPE CONNECT ROUTING
              </span>
            </div>
            {!collapsed && (
              <div className="psb-desc">
                Customer payments are authorized and captured via Stripe. Upon verified carrier delivery (POD), net payout is disbursed to the merchant connected account (minus platform take-rate).
              </div>
            )}
          </div>
        </div>

        <div className="psb-right">
          {!collapsed && (
            <div className="psb-pipeline">
              <span className="psb-pipeline-step">
                <span className="psb-dot psb-dot-orange" />
                1. Stripe Authorization
              </span>
              <ArrowRight size={11} className="psb-arrow" />
              <span className="psb-pipeline-step">
                <span className="psb-dot psb-dot-blue" />
                2. Carrier Transit (POD)
              </span>
              <ArrowRight size={11} className="psb-arrow" />
              <span className="psb-pipeline-step">
                <span className="psb-dot psb-dot-green" />
                3. Direct Bank Payout
              </span>
            </div>
          )}

          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm psb-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand settlement info" : "Collapse info banner"}
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            <span>{collapsed ? 'Info' : 'Hide'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
