"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, CheckCircle2 } from 'lucide-react';
import './MerchantStatusRibbon.css';

export default function MerchantStatusRibbon() {
  const navigate = useNavigate();

  return (
    <div className="merchant-status-ribbon">
      <div className="merchant-ribbon-left">
        <div className="merchant-engine-status">
          <div className="merchant-engine-icon-wrap">
            <Cpu size={18} />
          </div>
          <div className="merchant-engine-info">
            <span className="merchant-engine-title">OmniTry AI Engine v2.4</span>
            <span className="merchant-engine-sub">Ultra-HD Warp & Neural Blend · 1.6s avg response</span>
          </div>
        </div>

        <span className="merchant-cluster-pill">
          <CheckCircle2 size={13} />
          <span>Cluster 100% Operational</span>
        </span>
      </div>

      <div className="merchant-ribbon-right">
        <div className="merchant-quota-box">
          <div className="merchant-quota-labels">
            <span>Try-On Quota</span>
            <span>48,290 / 100,000 (48.3%)</span>
          </div>
          <div className="merchant-quota-track">
            <div className="merchant-quota-fill" style={{ width: '48.3%' }} />
          </div>
        </div>

        <button
          type="button"
          className="merchant-ribbon-btn"
          onClick={() => navigate('/merchant/api-usage')}
        >
          Manage Credits
        </button>
      </div>
    </div>
  );
}
