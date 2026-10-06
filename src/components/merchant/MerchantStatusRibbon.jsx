"use client";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '@/app/merchant/merchant.module.css';
import { Cpu, CheckCircle2 } from 'lucide-react';

export default function MerchantStatusRibbon() {
  const navigate = useNavigate();

  return (
    <div className={styles.statusRibbon}>
      <div className={styles.ribbonLeft}>
        <div className={styles.engineStatus}>
          <div className={styles.engineIconWrap}>
            <Cpu size={18} />
          </div>
          <div className={styles.engineInfo}>
            <span className={styles.engineTitle}>OmniTry AI Engine v2.4</span>
            <span className={styles.engineSub}>Ultra-HD Warp & Neural Blend · 1.6s avg response</span>
          </div>
        </div>

        <span className={styles.clusterPill}>
          <CheckCircle2 size={13} />
          <span>Cluster 100% Operational</span>
        </span>
      </div>

      <div className={styles.ribbonRight}>
        <div className={styles.quotaBox}>
          <div className={styles.quotaLabels}>
            <span>Try-On Quota</span>
            <span>48,290 / 100,000 (48.3%)</span>
          </div>
          <div className={styles.quotaBarTrack}>
            <div className={`${styles.quotaBarFill} ${styles.widthPctQuota}`} />
          </div>
        </div>

        <button className={styles.btnSecondary} onClick={() => navigate('/merchant/api-usage')}>
          Manage Credits
        </button>
      </div>
    </div>
  );
}
