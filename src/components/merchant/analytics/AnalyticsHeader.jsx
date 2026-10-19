"use client";
import React from 'react';
import { BarChart2, FileText, Users, Download } from 'lucide-react';

const TIMEFRAMES = [
  { key: '7D', label: '7D' },
  { key: '30D', label: '30D' },
  { key: '90D', label: '90D' },
  { key: '1Y', label: '1Y' }
];

const TABS = [
  { key: 'sales', label: 'Sales & Overview', icon: BarChart2 },
  { key: 'reports', label: 'Financial Reports', icon: FileText },
  { key: 'customers', label: 'Customer Insights', icon: Users }
];

export default function AnalyticsHeader({
  activeTab,
  onTabChange,
  timeframe,
  onTimeframeChange,
  onExportCsv
}) {
  return (
    <div>
      <div className="analytics-header">
        <div className="analytics-title-group">
          <h1 className="analytics-page-title">Analytics & Reports</h1>
          <p className="analytics-page-subtitle">
            Track revenue performance, escrow settlements, and customer purchase cohorts
          </p>
        </div>

        <div className="analytics-actions">
          {/* Timeframe Selector */}
          <div className="analytics-timeframe-group">
            {TIMEFRAMES.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`analytics-timeframe-btn ${timeframe === t.key ? 'analytics-timeframe-active' : ''}`}
                onClick={() => onTimeframeChange(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Export Action */}
          <button
            type="button"
            className="analytics-export-btn"
            onClick={onExportCsv}
            title="Download CSV report"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="analytics-tabs-row">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`analytics-tab-btn ${isActive ? 'analytics-tab-active' : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
