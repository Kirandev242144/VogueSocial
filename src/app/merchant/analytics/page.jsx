"use client";
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AnalyticsHeader,
  AnalyticsKPICards,
  SalesOverviewTab,
  ReportsTab,
  CustomersTab
} from '@/components/merchant/analytics';
import './MerchantAnalytics.css';
import { CheckCircle2 } from 'lucide-react';

export default function AnalyticsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('sales');
  const [timeframe, setTimeframe] = useState('30D');
  const [toastMessage, setToastMessage] = useState(null);

  // Bi-directional URL synchronization (?tab=sales, ?tab=reports, ?tab=customers)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'reports') {
      setActiveTab('reports');
    } else if (tabParam === 'customers') {
      setActiveTab('customers');
    } else {
      setActiveTab('sales');
    }
  }, [location.search]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    navigate(`/merchant/analytics?tab=${newTab}`);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCsv = () => {
    let filename = `VogueSocial_${activeTab}_report_${timeframe}.csv`;
    let rows = [];

    if (activeTab === 'reports') {
      rows = [
        ['Garment Name', 'Category', 'Units Sold', 'Gross Sales', 'Returns', 'Net Sales'],
        ['Tailored Silk Blouse', 'Tops & Blouses', '342', '$16,758.00', '14', '$16,072.00'],
        ['Structured Minimalist Tailored Suit', 'Tailored Suiting', '218', '$20,710.00', '8', '$19,950.00'],
        ['Silk Wrap Evening Dress', 'Eveningwear', '184', '$16,376.00', '11', '$15,397.00'],
        ['Italian Wool Pleated Wide-Leg Trouser', 'Trousers', '165', '$12,375.00', '6', '$11,925.00'],
        ['Minimalist Relaxed Cashmere Knit', 'Knitwear', '142', '$41,180.00', '4', '$40,020.00']
      ];
    } else if (activeTab === 'customers') {
      rows = [
        ['Customer Name', 'Email', 'Location', 'Total Orders', 'Lifetime Spend', 'Virtual Fits', 'Last Purchase'],
        ['Aisha Malik', 'aisha@mail.com', 'Dubai, UAE', '8', '$840.00', '26', 'Apr 29, 2026'],
        ['Sara Johnson', 'sara@mail.com', 'London, UK', '6', '$620.00', '18', 'Apr 28, 2026'],
        ['Fatima Al-Rashid', 'fatima@mail.com', 'Riyadh, SA', '5', '$510.00', '22', 'Apr 26, 2026'],
        ['Maya Lin', 'maya@mail.com', 'Singapore', '4', '$490.00', '14', 'Apr 25, 2026'],
        ['Riya Kapoor', 'riya@mail.com', 'Mumbai, IN', '4', '$385.00', '19', 'Apr 23, 2026']
      ];
    } else {
      rows = [
        ['Date', 'Gross Sales', 'Orders', 'Try-On Influenced Sales'],
        ['Apr 22', '$14,200', '42', '$10,800'],
        ['Apr 23', '$21,800', '68', '$16,400'],
        ['Apr 24', '$18,400', '54', '$14,200'],
        ['Apr 25', '$32,600', '98', '$25,800'],
        ['Apr 26', '$28,900', '82', '$22,100'],
        ['Apr 27', '$41,200', '124', '$32,400'],
        ['Apr 28', '$36,500', '110', '$28,500'],
        ['Apr 29', '$48,200', '142', '$38,200']
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${filename} successfully!`);
  };

  return (
    <div className="analytics-shell">
      {/* ── 1. Top Header, Timeframe & Tabs ── */}
      <AnalyticsHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onExportCsv={handleExportCsv}
      />

      {/* ── 2. Contextual KPI Cards ── */}
      <AnalyticsKPICards
        activeTab={activeTab}
        timeframe={timeframe}
      />

      {/* ── 3. Active Tab Content ── */}
      {activeTab === 'sales' && (
        <SalesOverviewTab timeframe={timeframe} />
      )}

      {activeTab === 'reports' && (
        <ReportsTab onExportCsv={handleExportCsv} />
      )}

      {activeTab === 'customers' && (
        <CustomersTab />
      )}

      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="orders-toast orders-toast-success">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
