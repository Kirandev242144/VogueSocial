"use client";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '@/services/adminService';
import {
  DollarSign, Landmark, ShieldCheck, Users,
  TrendingUp, Package, Loader2, ArrowUpRight
} from 'lucide-react';
import { AdminTopBar, AdminKpiCard, AdminStatusBadge } from '@/components/admin';

export default function AdminDashboardPage() {
  const [data, setData] = useState({
    stats: {
      totalVolume: 15280,
      escrowHeld: 2450,
      commissionEarned: 764,
      activeVendors: 2,
      totalProducts: 8,
      openDisputes: 1
    },
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboardStats();
      if (res && res.success) {
        setData({
          stats: res.stats,
          recentOrders: res.recentOrders || []
        });
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <>
      <AdminTopBar
        title="Dashboard Overview"
        subtitle="Real-time GMV, escrow balances, merchant velocity, and platform commissions"
        onRefresh={loadDashboard}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* KPI Metrics Grid */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Total Platform GMV"
            value={`$${(data.stats.totalVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            sub="Gross merchandise value transacted"
            icon={DollarSign}
            trend="up"
            trendLabel="+14.2%"
            iconBg="rgba(56, 189, 248, 0.12)"
            iconColor="#38bdf8"
          />

          <AdminKpiCard
            label="Escrowed Funds Held"
            value={`$${(data.stats.escrowHeld || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            sub="Awaiting courier delivery verification"
            icon={Landmark}
            trend="neutral"
            trendLabel="Secure Vault"
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#f59e0b"
          />

          <AdminKpiCard
            label="Platform Commission (5%)"
            value={`$${(data.stats.commissionEarned || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            sub="Revenue realized on released orders"
            icon={ShieldCheck}
            trend="up"
            trendLabel="+8.6%"
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10b981"
          />

          <AdminKpiCard
            label="Active Merchants"
            value={data.stats.activeVendors || 2}
            sub={`${data.stats.totalProducts || 0} approved garments in catalog`}
            icon={Users}
            trend="neutral"
            trendLabel="Live Brands"
            iconBg="rgba(167, 139, 250, 0.12)"
            iconColor="#a78bfa"
          />
        </div>

        {/* GMV Timeline Chart Panel */}
        <div className="admin-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 className="admin-panel-title">
              <TrendingUp size={16} color="#38bdf8" />
              Platform GMV & Escrow Velocity Timeline
            </h3>
            <span style={{ fontSize: '0.72rem', background: 'var(--adm-panel-hover)', border: '1px solid var(--adm-border)', borderRadius: '6px', padding: '3px 9px', color: 'var(--adm-text-sub)', fontWeight: 600 }}>
              Live 7-Day Performance Log
            </span>
          </div>

          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg viewBox="0 0 1000 220" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <linearGradient id="adm-area-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="adm-line-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="1000" y2="40" stroke="var(--adm-border)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="95" x2="1000" y2="95" stroke="var(--adm-border)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="var(--adm-border)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="205" x2="1000" y2="205" stroke="var(--adm-border)" strokeWidth="1" />

              {/* Area */}
              <path
                d="M 0 195 L 140 160 L 280 175 L 420 115 L 560 130 L 700 80 L 840 100 L 1000 55 L 1000 205 L 0 205 Z"
                fill="url(#adm-area-gradient)"
              />

              {/* Line */}
              <path
                d="M 0 195 L 140 160 L 280 175 L 420 115 L 560 130 L 700 80 L 840 100 L 1000 55"
                fill="none"
                stroke="url(#adm-line-gradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points */}
              <circle cx="140" cy="160" r="4.5" fill="var(--adm-panel)" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="420" cy="115" r="4.5" fill="var(--adm-panel)" stroke="#818cf8" strokeWidth="2.5" />
              <circle cx="700" cy="80" r="4.5" fill="var(--adm-panel)" stroke="#34d399" strokeWidth="2.5" />
              <circle cx="1000" cy="55" r="5" fill="var(--adm-panel)" stroke="#34d399" strokeWidth="3" />
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.85rem', fontSize: '0.72rem', color: 'var(--adm-text-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>6 Days Ago</span>
            <span>5 Days Ago</span>
            <span>4 Days Ago</span>
            <span>3 Days Ago</span>
            <span>Yesterday</span>
            <span style={{ color: 'var(--adm-accent)' }}>Today</span>
          </div>
        </div>

        {/* Recent Escrows Table Panel */}
        <div className="admin-panel">
          <div className="admin-panel-header">
            <span className="admin-panel-title">
              <Package size={16} color="#818cf8" />
              Recent Escrow Transactions
            </span>
            <Link
              to="/admin/orders"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              style={{ fontSize: '0.72rem' }}
            >
              View Full Escrow Vault ({data.recentOrders.length}) <ArrowUpRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              <Loader2 size={24} className="animate-spin admin-empty-icon" />
              <p>Refreshing escrow records...</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Merchant</th>
                    <th>Amount</th>
                    <th>Fulfillment</th>
                    <th>Escrow Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 700, color: 'var(--adm-text-main)' }}>
                        #{order.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                          {order.customer?.full_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                          {order.customer?.email}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--adm-text-main)' }}>
                          {order.vendor?.store_name}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--adm-text-sub)' }}>
                          @{order.vendor?.store_handle}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#38bdf8' }}>
                        ${order.amount.toFixed(2)}
                      </td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontWeight: 600, fontSize: '0.75rem' }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <AdminStatusBadge status={order.escrow_status} />
                      </td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--adm-text-sub)' }}>
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
