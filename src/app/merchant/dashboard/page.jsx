"use client";
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../merchant.module.css';
import { ExternalLink, Plus, Sparkles } from 'lucide-react';
import TryOnModal from '@/components/TryOnModal';
import { useAuth } from '@/context/AuthContext';
import {
  MerchantKPIs,
  MerchantSalesChart,
  MerchantModelBreakdown,
  MerchantTopGarments,
  MerchantLiveStream,
  MerchantStatusRibbon,
  TOP_GARMENTS
} from '@/components/merchant';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('30D');
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  const currentStoreName = user?.storeName || 'Studio Label Paris';
  const currentStoreHandle = user?.storeHandle || 'studiolabel';
  const initials = currentStoreName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'VS';

  const handleTestTryOn = (garment) => {
    setSelectedProductForModal({
      id: garment?.id || TOP_GARMENTS[0].id,
      name: garment?.name || TOP_GARMENTS[0].name,
      image_url: garment?.image || TOP_GARMENTS[0].image,
      category: garment?.category || TOP_GARMENTS[0].category
    });
    setTestModalOpen(true);
  };

  return (
    <div className={styles.pageContent}>
      {/* ── 1. DASHBOARD HEADER & STORE BANNER ── */}
      <div className={styles.dashHeader}>
        <div className={styles.storeBrandWrap}>
          <div className={styles.storeAvatar}>{initials}</div>
          <div className={styles.storeMeta}>
            <div className={styles.storeNameRow}>
              <h1 className={styles.storeTitle}>{currentStoreName}</h1>
              <Link to={`/store/${currentStoreHandle}`} target="_blank" className={styles.liveStoreBadge}>
                <span className={styles.liveStoreDot} />
                <span>STORE ONLINE</span>
                <ExternalLink size={12} />
              </Link>
            </div>
            <span className={styles.storeSubtitle}>
              Luxury Ready-to-Wear · OmniTry AI Virtual Fitting Engine v2.4 Active
            </span>
          </div>
        </div>

        <div className={styles.dashActions}>
          <div className={styles.timeframeGroup}>
            {['7D', '30D', '90D', 'YTD'].map((t) => (
              <button
                key={t}
                className={`${styles.timeframeBtn} ${timeframe === t ? styles.timeframeBtnActive : ''}`}
                onClick={() => setTimeframe(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button className={styles.btnSecondary} onClick={() => handleTestTryOn(TOP_GARMENTS[0])}>
            <Sparkles size={14} />
            <span>Test Try-On Studio</span>
          </button>

          <button className={styles.btnPrimary} onClick={() => navigate('/merchant/products')}>
            <Plus size={15} />
            <span>Add Garment</span>
          </button>
        </div>
      </div>

      {/* ── 2. KPI METRICS (4 CARDS) ── */}
      <MerchantKPIs />

      {/* ── 3. MIDDLE SECTION (ANALYTICS CHART & PRESETS BREAKDOWN) ── */}
      <div className={`${styles.gridRow} ${styles.grid21}`}>
        <MerchantSalesChart />
        <MerchantModelBreakdown />
      </div>

      {/* ── 4. BOTTOM SECTION (TOP GARMENTS & LIVE STREAM) ── */}
      <div className={`${styles.gridRow} ${styles.grid45}`}>
        <MerchantTopGarments onPreviewGarment={handleTestTryOn} />
        <MerchantLiveStream />
      </div>

      {/* ── 5. AI ENGINE & CLUSTER STATUS RIBBON ── */}
      <MerchantStatusRibbon />

      {/* ── 6. TRY-ON MODAL FOR QUICK PREVIEW ── */}
      {testModalOpen && (
        <TryOnModal
          isOpen={testModalOpen}
          onClose={() => setTestModalOpen(false)}
          product={selectedProductForModal}
        />
      )}
    </div>
  );
}
