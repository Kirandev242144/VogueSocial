"use client";
import React from 'react';
import { DollarSign, ShoppingBag, Sparkles, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useMerchantTheme } from '@/app/merchant/ThemeContext';
import './MerchantKPIs.css';

export default function MerchantKPIs() {
  const { theme } = useMerchantTheme();
  const isDark = theme === 'dark';

  return (
    <div className="merchant-kpi-grid">
      {/* Card 1: Total Store Sales (GMV) */}
      <div className="merchant-kpi-card">
        <div className="merchant-kpi-card-header">
          <div className="merchant-kpi-icon-wrap">
            <DollarSign size={18} color={isDark ? '#cbd5e1' : '#2563eb'} />
          </div>
          <span className="merchant-kpi-highlight-pill merchant-pill-blue">75% Try-On Driven</span>
        </div>
        <div>
          <div className="merchant-kpi-label">Total Sales (GMV)</div>
          <div className="merchant-kpi-value">$284,950</div>
          <div className="merchant-kpi-spark-row">
            <span className="merchant-kpi-trend merchant-trend-up">
              <ArrowUpRight size={13} /> +19.5%
            </span>
            <span>$214.5k direct from virtual fits</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Orders */}
      <div className="merchant-kpi-card">
        <div className="merchant-kpi-card-header">
          <div className="merchant-kpi-icon-wrap">
            <ShoppingBag size={18} color={isDark ? '#cbd5e1' : '#475569'} />
          </div>
          <span className="merchant-kpi-highlight-pill merchant-pill-amber">3 To Fulfill</span>
        </div>
        <div>
          <div className="merchant-kpi-label">Total Orders</div>
          <div className="merchant-kpi-value">1,428</div>
          <div className="merchant-kpi-spark-row">
            <span className="merchant-kpi-trend merchant-trend-up">
              <ArrowUpRight size={13} /> +12.4%
            </span>
            <span>Avg $87.40 order value</span>
          </div>
        </div>
      </div>

      {/* Card 3: Try-On Fitting Sessions */}
      <div className="merchant-kpi-card">
        <div className="merchant-kpi-card-header">
          <div className="merchant-kpi-icon-wrap">
            <Sparkles size={18} color={isDark ? '#cbd5e1' : '#7c3aed'} />
          </div>
          <span className="merchant-kpi-highlight-pill merchant-pill-purple">38.2% Conversion</span>
        </div>
        <div>
          <div className="merchant-kpi-label">Virtual Try-On Fits</div>
          <div className="merchant-kpi-value">48,290</div>
          <div className="merchant-kpi-spark-row">
            <span className="merchant-kpi-trend merchant-trend-up">
              <ArrowUpRight size={13} /> +24.6%
            </span>
            <span>3.8 fits per shopper visit</span>
          </div>
        </div>
      </div>

      {/* Card 4: Return Rate Reduction */}
      <div className="merchant-kpi-card">
        <div className="merchant-kpi-card-header">
          <div className="merchant-kpi-icon-wrap">
            <CheckCircle2 size={18} color={isDark ? '#cbd5e1' : '#16a34a'} />
          </div>
          <span className="merchant-kpi-highlight-pill merchant-pill-green">Returns Cut</span>
        </div>
        <div>
          <div className="merchant-kpi-label">Return Rate</div>
          <div className="merchant-kpi-value">12.8%</div>
          <div className="merchant-kpi-spark-row">
            <span className="merchant-kpi-trend merchant-trend-up">
              <ArrowDownRight size={13} /> -34.2%
            </span>
            <span>Est. $42.6k saved in logistics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
