"use client";
import React from 'react';
import { Users, Globe, Award, Sparkles, ShoppingBag } from 'lucide-react';

const TOP_MARKETS = [
  { country: 'India', pct: 42, orders: 599, revenue: '$119,679', class: 'analytics-geo-india' },
  { country: 'United Arab Emirates', pct: 24, orders: 342, revenue: '$68,388', class: 'analytics-geo-uae' },
  { country: 'United Kingdom', pct: 18, orders: 257, revenue: '$51,291', class: 'analytics-geo-uk' },
  { country: 'United States', pct: 10, orders: 143, revenue: '$28,495', class: 'analytics-geo-usa' },
  { country: 'European Union & Others', pct: 6, orders: 87, revenue: '$17,097', class: 'analytics-geo-others' }
];

const VIP_CUSTOMERS = [
  {
    name: 'Aisha Malik',
    email: 'aisha@mail.com',
    location: 'Dubai, UAE',
    orders: 8,
    spent: '$840.00',
    fits: 26,
    lastOrder: 'Apr 29, 2026',
    tier: 'VIP Spender',
    tierClass: 'analytics-badge-vip'
  },
  {
    name: 'Sara Johnson',
    email: 'sara@mail.com',
    location: 'London, UK',
    orders: 6,
    spent: '$620.00',
    fits: 18,
    lastOrder: 'Apr 28, 2026',
    tier: 'Repeat Buyer',
    tierClass: 'analytics-badge-returning'
  },
  {
    name: 'Fatima Al-Rashid',
    email: 'fatima@mail.com',
    location: 'Riyadh, SA',
    orders: 5,
    spent: '$510.00',
    fits: 22,
    lastOrder: 'Apr 26, 2026',
    tier: 'Repeat Buyer',
    tierClass: 'analytics-badge-returning'
  },
  {
    name: 'Maya Lin',
    email: 'maya@mail.com',
    location: 'Singapore',
    orders: 4,
    spent: '$490.00',
    fits: 14,
    lastOrder: 'Apr 25, 2026',
    tier: 'Repeat Buyer',
    tierClass: 'analytics-badge-returning'
  },
  {
    name: 'Riya Kapoor',
    email: 'riya@mail.com',
    location: 'Mumbai, IN',
    orders: 4,
    spent: '$385.00',
    fits: 19,
    lastOrder: 'Apr 23, 2026',
    tier: 'Repeat Buyer',
    tierClass: 'analytics-badge-returning'
  }
];

export default function CustomersTab() {
  return (
    <div>
      {/* 1. Top Geographic Markets & Cohort Summary */}
      <div className="analytics-grid-row analytics-grid-2-1">
        {/* Markets Progress */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <div className="analytics-panel-title">
              <Globe size={16} />
              <span>Top International Markets</span>
            </div>
            <span className="analytics-panel-meta">Global customer reach</span>
          </div>

          <div className="analytics-panel-body">
            <div className="analytics-funnel-list">
              {TOP_MARKETS.map((m) => (
                <div key={m.country} className="analytics-funnel-row">
                  <div className="analytics-funnel-header">
                    <span className="analytics-funnel-stage">{m.country}</span>
                    <span className="analytics-funnel-count">
                      {m.pct}% ({m.revenue})
                    </span>
                  </div>
                  <div className="analytics-funnel-track">
                    <div className={`analytics-funnel-fill ${m.class}`} />
                  </div>
                  <div className="analytics-funnel-sub">
                    {m.orders} orders processed · Average delivery 3-4 days
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Retention & Behavior Insights */}
        <div className="analytics-panel">
          <div className="analytics-panel-header">
            <div className="analytics-panel-title">
              <Award size={16} />
              <span>Shopper Retention Metrics</span>
            </div>
          </div>

          <div className="analytics-panel-body">
            <div className="analytics-funnel-list">
              <div className="analytics-funnel-row">
                <div className="analytics-funnel-header">
                  <span className="analytics-funnel-stage">Repeat Purchase Rate</span>
                  <span className="analytics-funnel-count analytics-val-success">34.2%</span>
                </div>
                <div className="analytics-funnel-sub">
                  Customers who place a second order within 45 days
                </div>
              </div>

              <div className="analytics-funnel-row">
                <div className="analytics-funnel-header">
                  <span className="analytics-funnel-stage">Try-On Assistance Frequency</span>
                  <span className="analytics-funnel-count">1.6 fits / item</span>
                </div>
                <div className="analytics-funnel-sub">
                  Shoppers try 1.6 virtual outfits before completing checkout
                </div>
              </div>

              <div className="analytics-funnel-row">
                <div className="analytics-funnel-header">
                  <span className="analytics-funnel-stage">Average Order Interval</span>
                  <span className="analytics-funnel-count">24 Days</span>
                </div>
                <div className="analytics-funnel-sub">
                  Typical turnaround between customer visits
                </div>
              </div>

              <div className="analytics-funnel-row">
                <div className="analytics-funnel-header">
                  <span className="analytics-funnel-stage">Fit Satisfaction Score</span>
                  <span className="analytics-funnel-count analytics-val-success">98.4%</span>
                </div>
                <div className="analytics-funnel-sub">
                  Post-delivery satisfaction rating from customer feedback
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. VIP Repeat Customers Directory Table */}
      <div className="analytics-panel">
        <div className="analytics-panel-header">
          <div className="analytics-panel-title">
            <Users size={16} />
            <span>Top High-Value & Repeat Shoppers</span>
          </div>
          <span className="analytics-panel-meta">Ranked by lifetime spending</span>
        </div>

        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Location</th>
                <th>Customer Tier</th>
                <th className="analytics-table-right">Total Orders</th>
                <th className="analytics-table-right">Lifetime Spend</th>
                <th className="analytics-table-right">Try-On Fits</th>
                <th className="analytics-table-right">Latest Purchase</th>
              </tr>
            </thead>
            <tbody>
              {VIP_CUSTOMERS.map((cust) => (
                <tr key={cust.email}>
                  <td>
                    <div>
                      <div className="analytics-table-strong">{cust.name}</div>
                      <div className="analytics-table-muted">{cust.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className="analytics-table-muted">{cust.location}</span>
                  </td>
                  <td>
                    <span className={cust.tierClass}>{cust.tier}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span className="analytics-table-strong">{cust.orders}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span className="analytics-table-strong analytics-val-success">
                      {cust.spent}
                    </span>
                  </td>
                  <td className="analytics-table-right">
                    <span>{cust.fits} fits</span>
                  </td>
                  <td className="analytics-table-right">
                    <span className="analytics-table-sub">{cust.lastOrder}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
