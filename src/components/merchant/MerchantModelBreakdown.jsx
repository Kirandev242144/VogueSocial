"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@/app/merchant/merchant.module.css';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Layers } from 'lucide-react';
import { useMerchantTheme } from '@/app/merchant/ThemeContext';

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
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <Layers size={17} />
          <span>Model Presets & Fit</span>
        </div>
        <button className={styles.panelAction} onClick={() => navigate('/merchant/analytics')}>
          Insights
        </button>
      </div>

      <div className={styles.donutWrapper}>
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

        <div className={styles.donutCenterLabel}>
          <div className={styles.donutCenterHeading}>Total Fits</div>
          <div className={styles.donutCenterValue}>48.2k</div>
        </div>
      </div>

      <div className={styles.modelUsageList}>
        <div className={styles.modelUsageRow}>
          <div className={styles.modelUsageHeader}>
            <span>Female Preset Models</span>
            <span>48% (23.1k)</span>
          </div>
          <div className={styles.modelUsageBarTrack}>
            <div className={`${styles.modelUsageBarFill} ${styles.barFillWomen} ${styles.widthPct48}`} />
          </div>
        </div>

        <div className={styles.modelUsageRow}>
          <div className={styles.modelUsageHeader}>
            <span>Male Preset Models</span>
            <span>28% (13.5k)</span>
          </div>
          <div className={styles.modelUsageBarTrack}>
            <div className={`${styles.modelUsageBarFill} ${styles.barFillMen} ${styles.widthPct28}`} />
          </div>
        </div>

        <div className={styles.modelUsageRow}>
          <div className={styles.modelUsageHeader}>
            <span>Custom Shopper Uploads</span>
            <span>24% (11.6k)</span>
          </div>
          <div className={styles.modelUsageBarTrack}>
            <div className={`${styles.modelUsageBarFill} ${styles.barFillCustom} ${styles.widthPct24}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
