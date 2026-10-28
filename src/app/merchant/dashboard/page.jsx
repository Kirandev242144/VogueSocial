"use client";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TryOnModal from '@/components/TryOnModal';
import { useAuth } from '@/context/AuthContext';
import {
  MerchantHeaderBanner,
  MerchantActionBanner,
  MerchantKPIs,
  MerchantRecentOrders,
  MerchantSalesChart,
  MerchantModelBreakdown,
  MerchantTopGarments,
  MerchantLiveStream,
  MerchantVerificationBanner,
  TOP_GARMENTS
} from '@/components/merchant';
import './MerchantDashboard.css';

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
    <div className="merchant-page-content">
      {/* ── 1. DASHBOARD HEADER & STORE BANNER ── */}
      <MerchantHeaderBanner
        currentStoreName={currentStoreName}
        currentStoreHandle={currentStoreHandle}
        initials={initials}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        onTestTryOn={() => handleTestTryOn(TOP_GARMENTS[0])}
        onAddGarment={() => navigate('/merchant/products')}
      />

      {/* ── 2. KYC / KYB VERIFICATION BANNER ── */}
      <MerchantVerificationBanner />

      {/* ── 3. URGENT ACTIONS REQUIRED (SHOPIFY-STYLE) ── */}
      <MerchantActionBanner />

      {/* ── 3. BALANCED KPI METRICS (4 CARDS) ── */}
      <MerchantKPIs />

      {/* ── 4. RECENT ORDERS & FULFILLMENTS QUICK-VIEW ── */}
      <MerchantRecentOrders />

      {/* ── 5. SALES TRAJECTORY & FIT PRESETS BREAKDOWN ── */}
      <div className="merchant-grid-row merchant-grid-2-1">
        <MerchantSalesChart />
        <MerchantModelBreakdown />
      </div>

      {/* ── 6. TOP GARMENTS & LIVE FITTING ROOM STREAM ── */}
      <div className="merchant-grid-row merchant-grid-4-5">
        <MerchantTopGarments onPreviewGarment={handleTestTryOn} />
        <MerchantLiveStream />
      </div>

      {/* ── 7. TRY-ON MODAL FOR QUICK PREVIEW ── */}
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
