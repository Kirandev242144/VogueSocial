"use client";
import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  RotateCcw,
  Users,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AnalyticsKPICards({ activeTab, timeframe }) {
  const getCards = () => {
    if (activeTab === 'reports') {
      return [
        {
          label: 'Net Settled Revenue',
          value: '$254,120',
          change: '+18.2%',
          up: true,
          pill: 'Bank Settled',
          pillClass: 'analytics-pill-green',
          sub: 'Disbursed to merchant Stripe bank',
          icon: DollarSign
        },
        {
          label: 'Marketplace Escrow Fees',
          value: '$22,796',
          change: '8.0%',
          up: true,
          pill: '8% Take Rate',
          pillClass: 'analytics-pill-blue',
          sub: 'VogueSocial marketplace service fee',
          icon: ShieldCheck
        },
        {
          label: 'Payment Processing Fees',
          value: '$8,263',
          change: '2.9%',
          up: true,
          pill: 'Stripe Gateway',
          pillClass: 'analytics-pill-amber',
          sub: 'Standard 2.9% + $0.30 per charge',
          icon: CreditCard
        },
        {
          label: 'Refunds & Returns Total',
          value: '$4,280',
          change: '-18.5%',
          up: false,
          pill: 'Refunded',
          pillClass: 'analytics-pill-purple',
          sub: 'Protected by 48h escrow inspection',
          icon: RotateCcw
        }
      ];
    }

    if (activeTab === 'customers') {
      return [
        {
          label: 'Total Customers',
          value: '2,840',
          change: '+31.5%',
          up: true,
          pill: '6 Top Markets',
          pillClass: 'analytics-pill-blue',
          sub: 'Active boutique shopper directory',
          icon: Users
        },
        {
          label: 'Returning Customer Rate',
          value: '34.2%',
          change: '+6.8%',
          up: true,
          pill: 'High Retention',
          pillClass: 'analytics-pill-green',
          sub: 'Average 3.8 orders per repeat user',
          icon: ShoppingBag
        },
        {
          label: 'Avg Customer Lifetime Value',
          value: '$182.50',
          change: '+14.2%',
          up: true,
          pill: 'AOV $87.40',
          pillClass: 'analytics-pill-purple',
          sub: 'Top VIP customer cohort $640+',
          icon: DollarSign
        },
        {
          label: 'Fitting Room Engagement',
          value: '48,290',
          change: '+24.6%',
          up: true,
          pill: '8.4x Lift',
          pillClass: 'analytics-pill-amber',
          sub: 'Virtual fitting sessions recorded',
          icon: Sparkles
        }
      ];
    }

    // Default: 'sales' view
    return [
      {
        label: 'Gross Sales (GMV)',
        value: '$284,950',
        change: '+19.5%',
        up: true,
        pill: '75% Try-On Driven',
        pillClass: 'analytics-pill-blue',
        sub: `$214.5k direct from virtual fits in ${timeframe}`,
        icon: DollarSign
      },
      {
        label: 'Total Orders',
        value: '1,428',
        change: '+12.4%',
        up: true,
        pill: 'Avg $87.40 AOV',
        pillClass: 'analytics-pill-green',
        sub: '142 orders processed this week',
        icon: ShoppingBag
      },
      {
        label: 'Store Conversion Rate',
        value: '5.0%',
        change: '+0.4%',
        up: true,
        pill: '38.2% Fitting Room',
        pillClass: 'analytics-pill-purple',
        sub: 'vs 2.8% fashion industry baseline',
        icon: TrendingUp
      },
      {
        label: 'Return Rate Reduction',
        value: '12.8%',
        change: '-34.2%',
        up: false,
        pill: 'Returns Cut',
        pillClass: 'analytics-pill-amber',
        sub: 'Estimated $42.6k saved in logistics',
        icon: RotateCcw
      }
    ];
  };

  const cards = getCards();

  return (
    <div className="analytics-kpi-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="analytics-kpi-card">
            <div className="analytics-kpi-header">
              <div className="analytics-kpi-icon-wrap">
                <Icon size={16} />
              </div>
              <span className={`analytics-kpi-pill ${card.pillClass}`}>
                {card.pill}
              </span>
            </div>

            <div>
              <div className="analytics-kpi-label">{card.label}</div>
              <div className="analytics-kpi-value">{card.value}</div>
              <div className="analytics-kpi-spark-row">
                <span className={card.up ? 'analytics-trend-up' : 'analytics-trend-down'}>
                  {card.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {card.change}
                </span>
                <span>{card.sub}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
