"use client";
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Sparkles, Plus } from 'lucide-react';
import './MerchantHeaderBanner.css';

export default function MerchantHeaderBanner({
  currentStoreName = 'Vogue Atelier',
  currentStoreHandle = 'vogue-atelier',
  initials = 'VA',
  timeframe = '30D',
  setTimeframe = () => {},
  onTestTryOn = () => {},
  onAddGarment
}) {
  const navigate = useNavigate();

  const handleAddGarment = () => {
    if (onAddGarment) {
      onAddGarment();
    } else {
      navigate('/merchant/products');
    }
  };

  return (
    <div className="merchant-dash-header">
      <div className="merchant-store-brand-wrap">
        <div className="merchant-store-avatar">{initials}</div>
        <div className="merchant-store-meta">
          <div className="merchant-store-name-row">
            <h1 className="merchant-store-title">{currentStoreName}</h1>
            <Link
              to={`/store/${currentStoreHandle}`}
              target="_blank"
              rel="noreferrer"
              className="merchant-live-store-badge"
            >
              <span className="merchant-live-store-dot" />
              <span>STORE ONLINE</span>
              <ExternalLink size={12} />
            </Link>
          </div>
          <span className="merchant-store-subtitle">
            Luxury Ready-to-Wear · OmniTry AI Virtual Fitting Engine v2.4 Active
          </span>
        </div>
      </div>

      <div className="merchant-dash-actions">
        <div className="merchant-timeframe-group">
          {['7D', '30D', '90D', 'YTD'].map((t) => (
            <button
              key={t}
              type="button"
              className={`merchant-timeframe-btn ${timeframe === t ? 'merchant-timeframe-btn-active' : ''}`}
              onClick={() => setTimeframe(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="merchant-btn-secondary"
          onClick={onTestTryOn}
        >
          <Sparkles size={14} />
          <span>Test Try-On Studio</span>
        </button>

        <button
          type="button"
          className="merchant-btn-primary"
          onClick={handleAddGarment}
        >
          <Plus size={15} />
          <span>Add Garment</span>
        </button>
      </div>
    </div>
  );
}
