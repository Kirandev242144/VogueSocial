"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { AdminTopBar, AdminKpiCard } from '@/components/admin';
import {
  CreditCard, Truck, Terminal, Building2,
  Radio, ShieldCheck, CheckCircle2, RefreshCw
} from 'lucide-react';
import {
  StripeGatewayCard,
  CarrierLogisticsCard,
  ConnectedAccountsTable,
  WebhookStreamConsole
} from '@/components/admin/integrations';

export default function AdminIntegrationsPage() {
  const [config, setConfig] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingStripe, setSavingStripe] = useState(false);
  const [savingCarriers, setSavingCarriers] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('stripe');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cfgRes, evtsRes] = await Promise.all([
        adminService.getIntegrationsConfig(),
        adminService.getWebhookEvents()
      ]);
      if (cfgRes?.success) setConfig(cfgRes.config);
      if (evtsRes?.success) setEvents(evtsRes.events || []);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSaveStripe = async (stripeData) => {
    setSavingStripe(true);
    try {
      const updated = {
        ...config,
        stripe: {
          ...config.stripe,
          ...stripeData,
          last_sync: new Date().toISOString()
        }
      };
      const res = await adminService.saveIntegrationsConfig(updated);
      if (res?.success) setConfig(res.config);
    } catch (err) {
      console.error('Failed to save Stripe config:', err);
    } finally {
      setSavingStripe(false);
    }
  };

  const handleSaveCarriers = async (carrierData) => {
    setSavingCarriers(true);
    try {
      const updated = {
        ...config,
        easypost: {
          ...config.easypost,
          ...carrierData,
          last_ping: new Date().toISOString()
        }
      };
      const res = await adminService.saveIntegrationsConfig(updated);
      if (res?.success) setConfig(res.config);
    } catch (err) {
      console.error('Failed to save Carrier config:', err);
    } finally {
      setSavingCarriers(false);
    }
  };

  const handleSimulateWebhook = async (eventType, payload) => {
    setSimulating(true);
    try {
      const res = await adminService.simulateWebhookEvent(eventType, payload);
      if (res?.success && res.event) {
        setEvents(prev => [res.event, ...prev]);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleClearWebhooks = async () => {
    try {
      await adminService.clearWebhookEvents();
      setEvents([]);
    } catch (err) {
      console.error('Clear error:', err);
    }
  };

  const TABS = [
    { id: 'stripe', label: 'Payment Gateway (Stripe)', icon: CreditCard },
    { id: 'carriers', label: 'Carrier Logistics (EasyPost)', icon: Truck },
    { id: 'accounts', label: `Merchant KYC Accounts (${config?.connected_accounts?.length || 0})`, icon: Building2 },
    { id: 'webhooks', label: `Live Webhook Stream (${events.length})`, icon: Terminal },
  ];

  return (
    <>
      <AdminTopBar
        title="Integrations & Gateways"
        subtitle="Manage Stripe Connect escrow vaults, multi-carrier logistics routing, merchant KYC banking, and real-time webhook streaming"
        onRefresh={loadAll}
        refreshing={loading}
      />

      <div className="admin-content">
        {/* KPI Platform Gateways Grid */}
        <div className="admin-kpi-grid">
          <AdminKpiCard
            label="Payment Gateway"
            value="Stripe Connect"
            sub={config?.stripe?.environment === 'production' ? '● Live Production Gateway' : '○ Sandbox Testnet Active'}
            icon={CreditCard}
            trend="up"
            trendLabel="Operational"
            iconBg="rgba(99, 102, 241, 0.12)"
            iconColor="#818cf8"
          />

          <AdminKpiCard
            label="Multi-Carrier Routing"
            value="EasyPost Gateway"
            sub="DHL, FedEx, UPS & Colissimo"
            icon={Truck}
            trend="up"
            trendLabel="4 Carriers"
            iconBg="rgba(56, 189, 248, 0.12)"
            iconColor="#38bdf8"
          />

          <AdminKpiCard
            label="Platform Take-Rate"
            value={`${config?.stripe?.platform_take_rate || 5.0}%`}
            sub="Automatic 95% merchant payout"
            icon={ShieldCheck}
            trend="neutral"
            trendLabel="Fixed Rate"
            iconBg="rgba(16, 185, 129, 0.12)"
            iconColor="#10b981"
          />

          <AdminKpiCard
            label="Webhook Listener"
            value="Active & Listening"
            sub={`${events.length} events processed this session`}
            icon={Radio}
            trend="up"
            trendLabel="99.98% Uptime"
            iconBg="rgba(245, 158, 11, 0.12)"
            iconColor="#f59e0b"
          />
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.45rem', borderBottom: '1px solid var(--adm-border)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`admin-btn ${isActive ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ fontSize: '0.74rem', padding: '0.45rem 0.9rem' }}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        {loading ? (
          <div className="admin-empty-state">
            <RefreshCw size={28} className="animate-spin admin-empty-icon" />
            <p>Loading gateway configuration...</p>
          </div>
        ) : (
          <>
            {activeTab === 'stripe' && (
              <StripeGatewayCard
                config={config?.stripe}
                onSave={handleSaveStripe}
                saving={savingStripe}
              />
            )}

            {activeTab === 'carriers' && (
              <CarrierLogisticsCard
                config={config?.easypost}
                onSave={handleSaveCarriers}
                saving={savingCarriers}
              />
            )}

            {activeTab === 'accounts' && (
              <ConnectedAccountsTable
                accounts={config?.connected_accounts || []}
              />
            )}

            {activeTab === 'webhooks' && (
              <WebhookStreamConsole
                events={events}
                onSimulate={handleSimulateWebhook}
                onClear={handleClearWebhooks}
                simulating={simulating}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
