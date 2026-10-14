"use client";
import React from 'react';
import { Search, DownloadCloud, ShoppingBag, RotateCcw, Truck } from 'lucide-react';

export default function OrdersHeader({
  activeView = 'all',
  onViewChange,
  search = '',
  onSearchChange,
  counts = { all: 0, returns: 0, tracking: 0 },
  onExportCsv
}) {
  const getTitles = () => {
    switch (activeView) {
      case 'returns':
        return {
          title: 'Returns & RMA Management',
          sub: 'Process customer return requests, issue reverse labels, and restock inventory'
        };
      case 'tracking':
        return {
          title: 'Order Tracking & Logistics',
          sub: 'Monitor courier transit milestones, Proof of Delivery (POD), and escrow release countdowns'
        };
      case 'all':
      default:
        return {
          title: 'Orders',
          sub: 'Manage fulfillment, dispatch shipments, and track customer transactions'
        };
    }
  };

  const { title, sub } = getTitles();

  return (
    <>
      <div className="orders-header">
        <div className="orders-header-text">
          <h1 className="orders-title">{title}</h1>
          <p className="orders-subtitle">{sub}</p>
        </div>

        <div className="orders-header-actions">
          <div className="orders-search-box">
            <Search size={14} className="orders-search-icon" />
            <input
              type="text"
              className="orders-search-input"
              placeholder="Search by order, customer, SKU..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="orders-btn-secondary"
            onClick={onExportCsv}
            title="Export orders dataset"
          >
            <DownloadCloud size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="orders-top-tabs">
        <button
          type="button"
          className={`orders-top-tab ${activeView === 'all' ? 'orders-top-tab-active' : ''}`}
          onClick={() => onViewChange('all')}
        >
          <ShoppingBag size={15} />
          <span>All Orders</span>
          <span className="orders-tab-count">{counts.all}</span>
        </button>

        <button
          type="button"
          className={`orders-top-tab ${activeView === 'returns' ? 'orders-top-tab-active' : ''}`}
          onClick={() => onViewChange('returns')}
        >
          <RotateCcw size={15} />
          <span>Returns</span>
          <span className="orders-tab-count">{counts.returns}</span>
        </button>

        <button
          type="button"
          className={`orders-top-tab ${activeView === 'tracking' ? 'orders-top-tab-active' : ''}`}
          onClick={() => onViewChange('tracking')}
        >
          <Truck size={15} />
          <span>Order Tracking</span>
          <span className="orders-tab-count">{counts.tracking}</span>
        </button>
      </div>
    </>
  );
}
