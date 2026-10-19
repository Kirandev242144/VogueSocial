"use client";
import React from 'react';
import { DollarSign, ShieldCheck, Download, Package, RotateCcw } from 'lucide-react';

const PRODUCT_REPORTS = [
  {
    id: 'P-101',
    name: 'Tailored Silk Blouse',
    category: 'Tops & Blouses',
    units: 342,
    gross: '$16,758.00',
    returns: 14,
    net: '$16,072.00',
    image: '/Shop_images/1/basic2-500x750.jpeg'
  },
  {
    id: 'P-102',
    name: 'Structured Minimalist Tailored Suit',
    category: 'Tailored Suiting',
    units: 218,
    gross: '$20,710.00',
    returns: 8,
    net: '$19,950.00',
    image: '/Shop_images/1/basic4-500x750.jpeg'
  },
  {
    id: 'P-103',
    name: 'Silk Wrap Evening Dress',
    category: 'Eveningwear',
    units: 184,
    gross: '$16,376.00',
    returns: 11,
    net: '$15,397.00',
    image: '/Shop_images/1/basic2-500x750.jpeg'
  },
  {
    id: 'P-104',
    name: 'Italian Wool Pleated Wide-Leg Trouser',
    category: 'Trousers',
    units: 165,
    gross: '$12,375.00',
    returns: 6,
    net: '$11,925.00',
    image: '/Shop_images/13/wideleg1-500x750.jpg'
  },
  {
    id: 'P-105',
    name: 'Minimalist Relaxed Cashmere Knit',
    category: 'Knitwear',
    units: 142,
    gross: '$41,180.00',
    returns: 4,
    net: '$40,020.00',
    image: '/Shop_images/8/overshirt1-500x750.jpg'
  }
];

const REFUND_BREAKDOWN = [
  { reason: 'Size / Fit Discrepancy', cases: 28, refunded: '$2,140.00', restocked: '26 units (93%)' },
  { reason: 'Fabric Tone Natural Light Difference', cases: 14, refunded: '$1,280.00', restocked: '14 units (100%)' },
  { reason: 'Customer Changed Mind / Styling Remorse', cases: 8, refunded: '$860.00', restocked: '8 units (100%)' }
];

export default function ReportsTab({ onExportCsv }) {
  return (
    <div>
      {/* 1. Marketplace Escrow & Net Settlement Ledger */}
      <div className="analytics-panel">
        <div className="analytics-panel-header">
          <div className="analytics-panel-title">
            <ShieldCheck size={16} />
            <span>Marketplace Escrow & Fee Settlement Breakdown</span>
          </div>
          <button
            type="button"
            className="analytics-export-btn"
            onClick={onExportCsv}
          >
            <Download size={13} />
            <span>Download Settlement PDF</span>
          </button>
        </div>

        <div className="analytics-panel-body">
          <div className="analytics-ledger-summary">
            <div className="analytics-ledger-item">
              <span className="analytics-ledger-label">Gross Merchant GMV</span>
              <span className="analytics-ledger-val">$284,950.00</span>
              <span className="analytics-table-muted">All orders placed</span>
            </div>

            <div className="analytics-ledger-item">
              <span className="analytics-ledger-label">VogueSocial Fee (8%)</span>
              <span className="analytics-ledger-val analytics-val-fee">-$22,796.00</span>
              <span className="analytics-table-muted">Platform marketplace service</span>
            </div>

            <div className="analytics-ledger-item">
              <span className="analytics-ledger-label">Stripe Processing (2.9%)</span>
              <span className="analytics-ledger-val analytics-val-fee">-$8,263.55</span>
              <span className="analytics-table-muted">Card acquiring gateway cost</span>
            </div>

            <div className="analytics-ledger-item">
              <span className="analytics-ledger-label">Net Merchant Payout</span>
              <span className="analytics-ledger-val analytics-val-success">$253,890.45</span>
              <span className="analytics-table-muted">Disburses 48h after delivery POD</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Product Sales & Performance Ledger */}
      <div className="analytics-panel">
        <div className="analytics-panel-header">
          <div className="analytics-panel-title">
            <Package size={16} />
            <span>Product Sales & Performance Ledger</span>
          </div>
          <button
            type="button"
            className="analytics-export-btn"
            onClick={onExportCsv}
          >
            <Download size={13} />
            <span>Export Product CSV</span>
          </button>
        </div>

        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Garment SKU</th>
                <th>Category</th>
                <th className="analytics-table-right">Units Sold</th>
                <th className="analytics-table-right">Gross Sales</th>
                <th className="analytics-table-right">Returns</th>
                <th className="analytics-table-right">Net Realized</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCT_REPORTS.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="analytics-table-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="analytics-table-thumb"
                        onError={(e) => {
                          e.target.src = '/Shop_images/1/basic2-500x750.jpeg';
                        }}
                      />
                      <div>
                        <div className="analytics-table-strong">{item.name}</div>
                        <div className="analytics-table-muted">{item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="analytics-table-muted">{item.category}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span className="analytics-table-strong">{item.units}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span>{item.gross}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span className="analytics-val-fee">{item.returns}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span className="analytics-table-strong analytics-val-success">
                      {item.net}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Reverse Logistics & Returns Financial Ledger */}
      <div className="analytics-panel">
        <div className="analytics-panel-header">
          <div className="analytics-panel-title">
            <RotateCcw size={16} />
            <span>Reverse Logistics & Returns Financial Ledger</span>
          </div>
          <span className="analytics-panel-meta">Total Refunds: $4,280.00</span>
        </div>

        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Return Reason Justification</th>
                <th className="analytics-table-right">Total RMA Cases</th>
                <th className="analytics-table-right">Refund Amount Released</th>
                <th className="analytics-table-right">Restocked to Inventory</th>
              </tr>
            </thead>
            <tbody>
              {REFUND_BREAKDOWN.map((row) => (
                <tr key={row.reason}>
                  <td>
                    <span className="analytics-table-strong">{row.reason}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span>{row.cases}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span className="analytics-val-fee">{row.refunded}</span>
                  </td>
                  <td className="analytics-table-right">
                    <span className="analytics-val-success">{row.restocked}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
