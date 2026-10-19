"use client";
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Activity, Layers, Filter, Globe, Instagram, ShoppingCart } from 'lucide-react';
import { useMerchantTheme } from '@/app/merchant/ThemeContext';

const REVENUE_DATA = [
  { d: 'Apr 22', rev: 14200, orders: 42, tryonRev: 10800 },
  { d: 'Apr 23', rev: 21800, orders: 68, tryonRev: 16400 },
  { d: 'Apr 24', rev: 18400, orders: 54, tryonRev: 14200 },
  { d: 'Apr 25', rev: 32600, orders: 98, tryonRev: 25800 },
  { d: 'Apr 26', rev: 28900, orders: 82, tryonRev: 22100 },
  { d: 'Apr 27', rev: 41200, orders: 124, tryonRev: 32400 },
  { d: 'Apr 28', rev: 36500, orders: 110, tryonRev: 28500 },
  { d: 'Apr 29', rev: 48200, orders: 142, tryonRev: 38200 }
];

const CATEGORIES = [
  { name: 'Tailored Suiting', value: 38, count: '$108.2k', color: '#2563eb' },
  { name: 'Eveningwear & Dresses', value: 27, count: '$76.9k', color: '#10b981' },
  { name: 'Minimalist Knitwear', value: 21, count: '$59.8k', color: '#8b5cf6' },
  { name: 'Luxury Outerwear', value: 14, count: '$39.9k', color: '#f59e0b' }
];

const FUNNEL_STAGES = [
  { stage: 'Store Visits', count: '28,400', pct: 100, class: 'analytics-w-100', note: 'Organic & social traffic' },
  { stage: 'Product Detail Views', count: '20,448', pct: 72, class: 'analytics-w-72', note: 'Engaged collection browsing' },
  { stage: 'Fitting Room Try-Ons', count: '12,496', pct: 44, class: 'analytics-w-44', note: 'AI silhouette fits generated' },
  { stage: 'Added to Bag', count: '7,952', pct: 28, class: 'analytics-w-28', note: '63% from virtual try-ons' },
  { stage: 'Initiated Checkout', count: '4,544', pct: 16, class: 'analytics-w-16', note: 'Escrow payment step' },
  { stage: 'Completed Purchase', count: '2,840', pct: 10, class: 'analytics-w-10', note: '5.0% aggregate conversion' }
];

const CHANNELS = [
  {
    name: 'Online Boutique Store',
    icon: Globe,
    revenue: '$198,400',
    orders: '984 orders',
    share: '69.6% GMV'
  },
  {
    name: 'Facebook & Instagram Sync',
    icon: Instagram,
    revenue: '$54,200',
    orders: '288 orders',
    share: '19.0% GMV'
  },
  {
    name: 'VogueSocial Community Feed',
    icon: ShoppingCart,
    revenue: '$32,350',
    orders: '156 orders',
    share: '11.4% GMV'
  }
];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="analytics-custom-tooltip">
        <div className="analytics-tooltip-label">{item.name}</div>
        <div className="analytics-tooltip-val">{item.value}% of Sales</div>
      </div>
    );
  }
  return null;
};

const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rev = payload.find((p) => p.dataKey === 'rev')?.value || 0;
    const orders = payload.find((p) => p.dataKey === 'orders')?.value || 0;
    const tryon = payload.find((p) => p.dataKey === 'tryonRev')?.value || 0;
    return (
      <div className="analytics-custom-tooltip">
        <div className="analytics-tooltip-label">{label} Performance</div>
        <div className="analytics-tooltip-val">Total Sales: ${rev.toLocaleString()}</div>
        <div className="analytics-table-muted">Virtual Try-On Sales: ${tryon.toLocaleString()}</div>
        <div className="analytics-table-muted">Orders: {orders}</div>
      </div>
    );
  }
  return null;
};

export default function SalesOverviewTab({ timeframe }) {
  const { theme } = useMerchantTheme();
  const isDark = theme === 'dark';

  return (
    <div>
      {/* 1. Main Revenue & Volume Trajectory Chart */}
      <div className="analytics-panel">
        <div className="analytics-panel-header">
          <div className="analytics-panel-title">
            <Activity size={16} />
            <span>Revenue Trajectory & Order Volume</span>
          </div>
          <span className="analytics-panel-meta">Aggregated over {timeframe}</span>
        </div>

        <div className="analytics-panel-body">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTryon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9'}
              />
              <XAxis
                dataKey="d"
                tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="rev"
                name="Gross Sales"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#colorRev)"
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="tryonRev"
                name="Try-On Driven"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorTryon)"
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="analytics-chart-legend">
            <div className="analytics-legend-item">
              <span className="analytics-legend-dot analytics-legend-dot-revenue" />
              <span>Gross Marketplace Sales</span>
            </div>
            <div className="analytics-legend-item">
              <span className="analytics-legend-dot analytics-legend-dot-orders" />
              <span>Virtual Try-On Influenced Sales (75%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Category Breakdown + Conversion Funnel */}
      <div className="analytics-grid-row analytics-grid-2-1">
        {/* Conversion Funnel */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <div className="analytics-panel-title">
              <Filter size={16} />
              <span>Customer Conversion Funnel</span>
            </div>
            <span className="analytics-panel-meta">5.0% Overall Conversion</span>
          </div>

          <div className="analytics-panel-body">
            <div className="analytics-funnel-list">
              {FUNNEL_STAGES.map((f) => (
                <div key={f.stage} className="analytics-funnel-row">
                  <div className="analytics-funnel-header">
                    <span className="analytics-funnel-stage">{f.stage}</span>
                    <span className="analytics-funnel-count">{f.count}</span>
                  </div>
                  <div className="analytics-funnel-track">
                    <div className={`analytics-funnel-fill ${f.class}`} />
                  </div>
                  <div className="analytics-funnel-sub">
                    {f.pct}% of visits · {f.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales by Category Donut */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <div className="analytics-panel-title">
              <Layers size={16} />
              <span>Sales by Category</span>
            </div>
          </div>

          <div className="analytics-panel-body">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={CATEGORIES}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CATEGORIES.map((cat, i) => (
                    <Cell key={i} fill={cat.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="analytics-category-list">
              {CATEGORIES.map((cat, i) => (
                <div key={cat.name} className="analytics-category-row">
                  <div className="analytics-category-left">
                    <span className={`analytics-legend-dot analytics-cat-${i}`} />
                    <span className="analytics-category-name">{cat.name}</span>
                  </div>
                  <span className="analytics-category-pct">
                    {cat.value}% ({cat.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sales Channel Attribution */}
      <div className="analytics-panel">
        <div className="analytics-panel-header">
          <div className="analytics-panel-title">
            <Globe size={16} />
            <span>Sales Channel Attribution</span>
          </div>
          <span className="analytics-panel-meta">Cross-channel distribution</span>
        </div>

        <div className="analytics-panel-body">
          <div className="analytics-channel-grid">
            {CHANNELS.map((ch) => {
              const Icon = ch.icon;
              return (
                <div key={ch.name} className="analytics-channel-card">
                  <div className="analytics-channel-header">
                    <Icon size={15} />
                    <span>{ch.name}</span>
                  </div>
                  <div className="analytics-channel-val">{ch.revenue}</div>
                  <div className="analytics-channel-orders">
                    {ch.orders} · <strong>{ch.share}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
