"use client";
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function AdminKpiCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  trendLabel,
  iconBg = 'rgba(56, 189, 248, 0.1)',
  iconColor = '#38bdf8'
}) {
  return (
    <div className="admin-kpi-card">
      <div className="admin-kpi-top">
        {Icon && (
          <div className="admin-kpi-icon-box" style={{ background: iconBg, color: iconColor }}>
            <Icon size={18} />
          </div>
        )}
        {trend && (
          <div className={`admin-kpi-trend ${trend === 'up' ? 'trend-up' : 'trend-neutral'}`}>
            {trend === 'up' && <ArrowUpRight size={11} />}
            <span>{trendLabel || trend}</span>
          </div>
        )}
      </div>

      <div className="admin-kpi-label">{label}</div>
      <div className="admin-kpi-val">{value}</div>
      {sub && <div className="admin-kpi-sub">{sub}</div>}
    </div>
  );
}
