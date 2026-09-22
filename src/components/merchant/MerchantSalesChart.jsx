"use client";
import React, { useState } from 'react';
import styles from '@/app/merchant/merchant.module.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Activity } from 'lucide-react';
import { useMerchantTheme } from '@/app/merchant/ThemeContext';

const REVENUE_DATA = [
  { month: 'Jan', tryonRevenue: 48000, standardRevenue: 28000, sessions: 7400 },
  { month: 'Feb', tryonRevenue: 62000, standardRevenue: 24000, sessions: 8900 },
  { month: 'Mar', tryonRevenue: 78000, standardRevenue: 31000, sessions: 11200 },
  { month: 'Apr', tryonRevenue: 95000, standardRevenue: 35000, sessions: 14600 },
  { month: 'May', tryonRevenue: 124000, standardRevenue: 42000, sessions: 18200 },
  { month: 'Jun', tryonRevenue: 158000, standardRevenue: 46000, sessions: 22800 },
  { month: 'Jul', tryonRevenue: 182000, standardRevenue: 51000, sessions: 26400 },
  { month: 'Aug', tryonRevenue: 214500, standardRevenue: 70450, sessions: 32100 },
];

const CustomRevenueTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const tryonVal = payload.find((p) => p.dataKey === 'tryonRevenue')?.value || 0;
    const standardVal = payload.find((p) => p.dataKey === 'standardRevenue')?.value || 0;
    const total = tryonVal + standardVal;
    return (
      <div className={styles.customTooltipBox}>
        <div className={styles.tooltipLabel}>{label} Performance</div>
        <div className={styles.tooltipItem}>
          <span className={styles.tooltipDotTryon}>• Try-On Influenced:</span>
          <span>${tryonVal.toLocaleString()}</span>
        </div>
        <div className={styles.tooltipItem}>
          <span className={styles.tooltipDotStandard}>• Standard Orders:</span>
          <span>${standardVal.toLocaleString()}</span>
        </div>
        <div className={styles.tooltipItem}>
          <span>Total GMV:</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function MerchantSalesChart() {
  const { theme } = useMerchantTheme();
  const isDark = theme === 'dark';
  const [metricView, setMetricView] = useState('revenue');

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <Activity size={17} />
          <span>Try-On Sales & Volume Trajectory</span>
        </div>
        <div className={styles.chartTabsWrap}>
          <button
            className={`${styles.chartTabItem} ${metricView === 'revenue' ? styles.chartTabItemActive : ''}`}
            onClick={() => setMetricView('revenue')}
          >
            Revenue ($)
          </button>
          <button
            className={`${styles.chartTabItem} ${metricView === 'sessions' ? styles.chartTabItemActive : ''}`}
            onClick={() => setMetricView('sessions')}
          >
            Try-On Volume (#)
          </button>
        </div>
      </div>

      <div className={styles.chartLegendRow}>
        <span>
          <span className={styles.legendDot} /> Try-On Influenced Orders
        </span>
        <span>
          <span className={styles.legendDot} /> Standard Store Orders
        </span>
      </div>

      <div className={styles.chartContainerBox}>
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? 'rgba(203,243,130,0.06)' : '#e8ece6'}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: isDark ? 'rgba(240,250,242,0.5)' : '#5e7d6f' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => (metricView === 'revenue' ? `$${v / 1000}k` : `${v / 1000}k`)}
              tick={{ fontSize: 11, fill: isDark ? 'rgba(240,250,242,0.5)' : '#5e7d6f' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomRevenueTooltip />}
              cursor={{ fill: isDark ? 'rgba(203,243,130,0.04)' : '#f1f5ef' }}
            />
            {metricView === 'revenue' ? (
              <>
                <Bar
                  dataKey="standardRevenue"
                  stackId="a"
                  fill={isDark ? 'rgba(203,243,130,0.2)' : '#02231c'}
                  radius={[0, 0, 0, 0]}
                  barSize={26}
                />
                <Bar
                  dataKey="tryonRevenue"
                  stackId="a"
                  fill={isDark ? '#cbf382' : '#10b981'}
                  radius={[6, 6, 0, 0]}
                  barSize={26}
                />
              </>
            ) : (
              <Bar
                dataKey="sessions"
                fill={isDark ? '#cbf382' : '#02231c'}
                radius={[6, 6, 0, 0]}
                barSize={28}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
