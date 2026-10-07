"use client";
import React from 'react';
import { Shirt, TrendingUp, ShoppingBag, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useMerchantTheme } from '@/app/merchant/ThemeContext';
import './MerchantKPIs.css';

export default function MerchantKPIs() {
  const { theme } = useMerchantTheme();
  const isDark = theme === 'dark';

  return (
    <div className="merchant-kpi-grid">
      {/* Card 1: Try-On Sessions */}
      <div className="merchant-kpi-card">
        <div className="merchant-kpi-card-header">
          <div className="merchant-kpi-icon-wrap">
            <Shirt size={20} color={isDark ? '#cbd5e1' : '#475569'} />
          </div>
          <span className="merchant-kpi-highlight-pill">8.4x Engagement</span>
        </div>
        <div>
          <div className="merchant-kpi-label">Try-On Sessions</div>
          <div className="merchant-kpi-value">48,290</div>
          <div className="merchant-kpi-spark-row">
            <span className="merchant-kpi-trend merchant-trend-up">
              <ArrowUpRight size={13} /> +24.6%
            </span>
            <span>3.8 fits per shopper visit</span>
          </div>
        </div>
      </div>

      {/* Card 2: Fitting Room Conversion */}
      <div className="merchant-kpi-card">
        <div className="merchant-kpi-card-header">
          <div className="merchant-kpi-icon-wrap">
            <TrendingUp size={20} color={isDark ? '#cbd5e1' : '#475569'} />
          </div>
          <span className="merchant-kpi-highlight-pill">✦ High Lift</span>
        </div>
        <div>
          <div className="merchant-kpi-label">Fitting Conversion</div>
          <div className="merchant-kpi-value">38.2%</div>
          <div className="merchant-kpi-spark-row">
            <span className="merchant-kpi-trend merchant-trend-up">
              <ArrowUpRight size={13} /> +9.4%
            </span>
            <span>vs 4.2% industry baseline</span>
          </div>
        </div>
      </div>

      {/* Card 3: Influenced GMV */}
      <div className="merchant-kpi-card">
        <div className="merchant-kpi-card-header">
          <div className="merchant-kpi-icon-wrap">
            <ShoppingBag size={20} color={isDark ? '#cbd5e1' : '#475569'} />
          </div>
          <span className="merchant-kpi-highlight-pill">75% Try-On Driven</span>
        </div>
        <div>
          <div className="merchant-kpi-label">Influenced GMV</div>
          <div className="merchant-kpi-value">$284,950</div>
          <div className="merchant-kpi-spark-row">
            <span className="merchant-kpi-trend merchant-trend-up">
              <ArrowUpRight size={13} /> +19.5%
            </span>
            <span>$214.5k direct from virtual fits</span>
          </div>
        </div>
      </div>

      {/* Card 4: Return Rate Reduction */}
      <div className="merchant-kpi-card">
        <div className="merchant-kpi-card-header">
          <div className="merchant-kpi-icon-wrap">
            <CheckCircle2 size={20} color={isDark ? '#cbd5e1' : '#475569'} />
          </div>
          <span className="merchant-kpi-highlight-pill">Returns Cut</span>
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
