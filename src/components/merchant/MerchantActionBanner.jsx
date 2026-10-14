"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import './MerchantActionBanner.css';

export default function MerchantActionBanner() {
  const navigate = useNavigate();

  return (
    <div className="merchant-action-banner">
      <div className="merchant-action-card merchant-action-orders" onClick={() => navigate('/merchant/orders')}>
        <div className="merchant-action-icon-wrap">
          <Package size={16} />
        </div>
        <div className="merchant-action-content">
          <div className="merchant-action-title-row">
            <span className="merchant-action-count">3</span>
            <span className="merchant-action-title">Orders awaiting fulfillment</span>
          </div>
          <p className="merchant-action-desc">Ready for courier dispatch and tracking generation</p>
        </div>
        <span className="merchant-action-link">
          <span>Fulfill</span>
          <ArrowRight size={13} />
        </span>
      </div>

      <div className="merchant-action-card merchant-action-returns" onClick={() => navigate('/merchant/orders?filter=returns')}>
        <div className="merchant-action-icon-wrap">
          <RotateCcw size={16} />
        </div>
        <div className="merchant-action-content">
          <div className="merchant-action-title-row">
            <span className="merchant-action-count">1</span>
            <span className="merchant-action-title">Return request pending review</span>
          </div>
          <p className="merchant-action-desc">RMA-9021 from Sara Johnson awaiting label authorization</p>
        </div>
        <span className="merchant-action-link">
          <span>Review</span>
          <ArrowRight size={13} />
        </span>
      </div>

      <div className="merchant-action-card merchant-action-stock" onClick={() => navigate('/merchant/products')}>
        <div className="merchant-action-icon-wrap">
          <AlertTriangle size={16} />
        </div>
        <div className="merchant-action-content">
          <div className="merchant-action-title-row">
            <span className="merchant-action-count">1</span>
            <span className="merchant-action-title">Garment running low in stock</span>
          </div>
          <p className="merchant-action-desc">Wool Pleated Trouser has 2 units remaining</p>
        </div>
        <span className="merchant-action-link">
          <span>Restock</span>
          <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}
