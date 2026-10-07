"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Layers } from 'lucide-react';
import { useMerchantTheme } from '@/app/merchant/ThemeContext';
import './MerchantModelBreakdown.css';

const MODEL_DEMOGRAPHICS = [
  { name: 'Women Presets', value: 48, count: '23,180', color: '#1e293b', darkColor: '#e2e8f0' },
  { name: 'Men Presets', value: 28, count: '13,520', color: '#64748b', darkColor: '#94a3b8' },
  { name: 'Custom Uploads', value: 24, count: '11,590', color: '#94a3b8', darkColor: '#475569' },
];

export default function MerchantModelBreakdown() {
  const navigate = useNavigate();
  const { theme } = useMerchantTheme();
  const isDark = theme === 'dark';

  return (
    <div className="merchant-model-breakdown-panel">
      <div className="merchant-model-breakdown-header">
        <div className="merchant-model-breakdown-title">
          <Layers size={17} />
          <span>Model Presets & Fit</span>
        </div>
        <button
          type="button"
          className="merchant-panel-action"
          onClick={() => navigate('/merchant/analytics')}
        >
          Insights
        </button>
      </div>

      <div className="merchant-donut-wrapper">
        <ResponsiveContainer width={170} height={170}>
          <PieChart>
            <Pie
              data={MODEL_DEMOGRAPHICS}
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={74}
              paddingAngle={4}
              dataKey="value"
            >
              {MODEL_DEMOGRAPHICS.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={isDark ? entry.darkColor : entry.color}
                  stroke="none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="merchant-donut-center">
          <div className="merchant-donut-heading">Total Fits</div>
          <div className="merchant-donut-value">48.2k</div>
        </div>
      </div>

      <div className="merchant-model-usage-list">
        <div className="merchant-model-usage-row">
          <div className="merchant-model-usage-header">
            <span>Female Preset Models</span>
            <span>48% (23.1k)</span>
          </div>
          <div className="merchant-model-usage-track">
            <div className="merchant-model-usage-fill merchant-fill-women" style={{ width: '48%' }} />
          </div>
        </div>

        <div className="merchant-model-usage-row">
          <div className="merchant-model-usage-header">
            <span>Male Preset Models</span>
            <span>28% (13.5k)</span>
          </div>
          <div className="merchant-model-usage-track">
            <div className="merchant-model-usage-fill merchant-fill-men" style={{ width: '28%' }} />
          </div>
        </div>

        <div className="merchant-model-usage-row">
          <div className="merchant-model-usage-header">
            <span>Custom Shopper Uploads</span>
            <span>24% (11.6k)</span>
          </div>
          <div className="merchant-model-usage-track">
            <div className="merchant-model-usage-fill merchant-fill-custom" style={{ width: '24%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
