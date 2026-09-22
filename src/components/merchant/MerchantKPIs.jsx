"use client";
import React from 'react';
import styles from '@/app/merchant/merchant.module.css';
import { Shirt, TrendingUp, ShoppingBag, CheckCircle2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useMerchantTheme } from '@/app/merchant/ThemeContext';

export default function MerchantKPIs() {
  const { theme } = useMerchantTheme();
  const isDark = theme === 'dark';

  return (
    <div className={styles.kpiGrid}>
      {/* Card 1: Try-On Sessions */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiCardHeader}>
          <div className={styles.kpiIconWrap}>
            <Shirt size={20} color={isDark ? '#cbf382' : '#02231c'} />
          </div>
          <span className={styles.kpiHighlightPill}>8.4x Engagement</span>
        </div>
        <div>
          <div className={styles.kpiLabel}>Try-On Sessions</div>
          <div className={styles.kpiValue}>48,290</div>
          <div className={styles.kpiSparkRow}>
            <span className={`${styles.kpiTrend} ${styles.trendUp}`}>
              <ArrowUpRight size={13} /> +24.6%
            </span>
            <span>3.8 fits per shopper visit</span>
          </div>
        </div>
      </div>

      {/* Card 2: Fitting Room Conversion */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiCardHeader}>
          <div className={styles.kpiIconWrap}>
            <TrendingUp size={20} color={isDark ? '#34d399' : '#10b981'} />
          </div>
          <span className={styles.kpiHighlightPill}>✦ High Lift</span>
        </div>
        <div>
          <div className={styles.kpiLabel}>Fitting Conversion</div>
          <div className={styles.kpiValue}>38.2%</div>
          <div className={styles.kpiSparkRow}>
            <span className={`${styles.kpiTrend} ${styles.trendUp}`}>
              <ArrowUpRight size={13} /> +9.4%
            </span>
            <span>vs 4.2% industry baseline</span>
          </div>
        </div>
      </div>

      {/* Card 3: Influenced GMV */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiCardHeader}>
          <div className={styles.kpiIconWrap}>
            <ShoppingBag size={20} color={isDark ? '#a5b4fc' : '#4f46e5'} />
          </div>
          <span className={styles.kpiHighlightPill}>75% Try-On Driven</span>
        </div>
        <div>
          <div className={styles.kpiLabel}>Influenced GMV</div>
          <div className={styles.kpiValue}>$284,950</div>
          <div className={styles.kpiSparkRow}>
            <span className={`${styles.kpiTrend} ${styles.trendUp}`}>
              <ArrowUpRight size={13} /> +19.5%
            </span>
            <span>$214.5k direct from virtual fits</span>
          </div>
        </div>
      </div>

      {/* Card 4: Return Rate Reduction */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiCardHeader}>
          <div className={styles.kpiIconWrap}>
            <CheckCircle2 size={20} color={isDark ? '#34d399' : '#059669'} />
          </div>
          <span className={styles.kpiHighlightPill}>Returns Cut</span>
        </div>
        <div>
          <div className={styles.kpiLabel}>Return Rate</div>
          <div className={styles.kpiValue}>12.8%</div>
          <div className={styles.kpiSparkRow}>
            <span className={`${styles.kpiTrend} ${styles.trendUp}`}>
              <ArrowDownRight size={13} /> -34.2%
            </span>
            <span>Est. $42.6k saved in logistics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
