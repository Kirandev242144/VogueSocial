"use client";
import React, { useState } from 'react';
import styles from '../merchant.module.css';
import './MerchantPayouts.css';
import {
  CheckCircle, DollarSign, TrendingUp, ArrowRight,
  ExternalLink, Building2, ShieldCheck, Clock, Landmark
} from 'lucide-react';

const TRANSFERS_HISTORY = [
  {
    id: 'tr_1Ox8A1K92',
    orderRef: 'ORD-8239',
    gross: 420.00,
    fee: 21.00,
    net: 399.00,
    date: 'Apr 28, 2026',
    ordersCount: 1,
    bank: 'JPMorgan Chase •••• 4192',
    status: 'paid'
  },
  {
    id: 'tr_1Ox7B4L03',
    orderRef: 'ORD-8236',
    gross: 280.00,
    fee: 14.00,
    net: 266.00,
    date: 'Apr 24, 2026',
    ordersCount: 1,
    bank: 'JPMorgan Chase •••• 4192',
    status: 'paid'
  },
  {
    id: 'tr_1Ox6C8M19',
    orderRef: 'ORD-8230',
    gross: 890.00,
    fee: 44.50,
    net: 845.50,
    date: 'Apr 18, 2026',
    ordersCount: 2,
    bank: 'JPMorgan Chase •••• 4192',
    status: 'paid'
  },
  {
    id: 'tr_1Ox5D2N88',
    orderRef: 'ORD-8241',
    gross: 590.00,
    fee: 29.50,
    net: 560.50,
    date: 'Est. May 02, 2026',
    ordersCount: 1,
    bank: 'JPMorgan Chase •••• 4192',
    status: 'in_transit'
  }
];

export default function PayoutsPage() {
  const [transfers] = useState(TRANSFERS_HISTORY);

  return (
    <>
      <div className={styles.topbar}>
        <div>
          <div className={styles.pageTitle}>Payouts & Payments</div>
          <div className={styles.pageSubtitle}>
            Manage your Stripe Connect settlement account, track earnings, and review bank disbursements
          </div>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className="mp-container">
          {/* ── Stripe Connect Express Account Card ── */}
          <div className="mp-stripe-card">
            <div className="mp-stripe-header">
              <div className="mp-stripe-brand">
                <div className="mp-stripe-icon-box">S</div>
                <div>
                  <div className="mp-stripe-title-row">
                    <h3 className="mp-stripe-title">Stripe Connect Account</h3>
                    <span className="mp-status-pill">
                      <span className="mp-status-dot" />
                      Active & Connected
                    </span>
                  </div>
                  <div className="mp-stripe-subtitle">
                    Express account configured for automated payouts and tax reporting
                  </div>
                </div>
              </div>

              <a
                href="https://connect.stripe.com/express_login"
                target="_blank"
                rel="noopener noreferrer"
                className="mp-btn-stripe"
              >
                <span>Open Stripe Express Dashboard</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="mp-stripe-grid">
              <div className="mp-kv-item">
                <span className="mp-kv-label">Connected Account ID</span>
                <div className="mp-kv-val">
                  <code className="mp-code">acct_1Ox7Y8K92A8291</code>
                </div>
              </div>

              <div className="mp-kv-item">
                <span className="mp-kv-label">Settlement Bank</span>
                <div className="mp-kv-val">
                  <Landmark size={14} />
                  <span>JPMorgan Chase •••• 4192</span>
                  <span className="mp-kv-hint">(USD)</span>
                </div>
              </div>

              <div className="mp-kv-item">
                <span className="mp-kv-label">Payout Schedule</span>
                <div className="mp-kv-val">
                  <span>Rolling automated (48h post-delivery)</span>
                </div>
              </div>

              <div className="mp-kv-item">
                <span className="mp-kv-label">Tax Documents (1099-K)</span>
                <div className="mp-kv-val">
                  <span>Managed directly via Stripe</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Balance KPI Grid ── */}
          <div className="mp-kpi-grid">
            <div className="mp-kpi-card">
              <span className="mp-kpi-label">Available for Payout</span>
              <div className="mp-kpi-amount mp-kpi-highlight">$641.00</div>
              <span className="mp-kpi-meta">Cleared orders ready for scheduled bank transfer</span>
            </div>

            <div className="mp-kpi-card">
              <span className="mp-kpi-label">Pending Delivery Clearance</span>
              <div className="mp-kpi-amount">$435.00</div>
              <span className="mp-kpi-meta">Disburses 48h after courier delivery verification (POD)</span>
            </div>

            <div className="mp-kpi-card">
              <span className="mp-kpi-label">Total Disbursed (All Time)</span>
              <div className="mp-kpi-amount">$2,831.00</div>
              <span className="mp-kpi-meta">Lifetime net earnings received in your bank account</span>
            </div>

            <div className="mp-kpi-card">
              <span className="mp-kpi-label">Platform Take-Rate</span>
              <div className="mp-kpi-amount">5.0%</div>
              <span className="mp-kpi-meta">Agreed marketplace commission deducted on checkout</span>
            </div>
          </div>

          {/* ── Settlement Process Steps ── */}
          <div className="mp-steps-panel">
            <div className="mp-steps-header">
              <span className="mp-steps-title">How Stripe Connect Payouts Work</span>
            </div>

            <div className="mp-steps-grid">
              <div className="mp-step-item">
                <div className="mp-step-badge-row">
                  <div className="mp-step-icon-wrap">
                    <DollarSign size={16} color="var(--vs-lime, #cbf382)" />
                  </div>
                  <span className="mp-step-num">STEP 01</span>
                </div>
                <div className="mp-step-name">Customer Checkout</div>
                <p className="mp-step-desc">
                  When a customer purchases your garment, Stripe authorizes the charge. Funds are held securely in platform settlement.
                </p>
              </div>

              <div className="mp-step-item">
                <div className="mp-step-badge-row">
                  <div className="mp-step-icon-wrap">
                    <TrendingUp size={16} color="#38bdf8" />
                  </div>
                  <span className="mp-step-num">STEP 02</span>
                </div>
                <div className="mp-step-name">Fulfill & Track</div>
                <p className="mp-step-desc">
                  Pack and dispatch your item with your chosen courier. Enter the tracking reference in your Orders dashboard to initiate clearance.
                </p>
              </div>

              <div className="mp-step-item">
                <div className="mp-step-badge-row">
                  <div className="mp-step-icon-wrap">
                    <CheckCircle size={16} color="#10b981" />
                  </div>
                  <span className="mp-step-num">STEP 03</span>
                </div>
                <div className="mp-step-name">Direct Bank Deposit</div>
                <p className="mp-step-desc">
                  Upon verified carrier delivery, Stripe automatically routes your net earnings (minus 5%) directly to your registered bank account.
                </p>
              </div>
            </div>
          </div>

          {/* ── Payout Transfers Table ── */}
          <div className="mp-table-panel">
            <div className="mp-table-header">
              <span className="mp-table-title">Recent Payout Transfers</span>
              <span className="mp-table-count">{transfers.length} Transfers Recorded</span>
            </div>

            <div className="mp-table-wrap">
              <table className="mp-table">
                <thead>
                  <tr>
                    <th>Transfer ID</th>
                    <th>Order Ref</th>
                    <th>Gross Sale</th>
                    <th>VogueSocial Fee</th>
                    <th>Net Disbursed</th>
                    <th>Settlement Bank</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map(p => (
                    <tr key={p.id}>
                      <td>
                        <span className="mp-td-transfer-id">{p.id}</span>
                      </td>
                      <td>
                        <span className="mp-td-order-ref">#{p.orderRef}</span>
                      </td>
                      <td>
                        <span className="mp-td-gross">${p.gross.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className="mp-td-fee">-${p.fee.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className="mp-td-net">${p.net.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className="mp-td-bank">
                          <Building2 size={12} />
                          {p.bank}
                        </span>
                      </td>
                      <td>
                        <span className="mp-td-date">{p.date}</span>
                      </td>
                      <td>
                        {p.status === 'paid' ? (
                          <span className="mp-badge-paid">
                            <CheckCircle size={10} />
                            Paid
                          </span>
                        ) : (
                          <span className="mp-badge-transit">
                            <Clock size={10} />
                            In Transit
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
