"use client";
import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import { AdminTopBar } from '@/components/admin';
import { RefreshCw } from 'lucide-react';
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
    { id: 'stripe', label: 'Payment Gateway' },
    { id: 'carriers', label: 'Carrier Logistics' },
    { id: 'accounts', label: 'Merchant Accounts', count: config?.connected_accounts?.length },
    { id: 'webhooks', label: 'Webhooks', count: events.length },
  ];

  return (
    <>
      <AdminTopBar
        title="Integrations & Gateways"
        subtitle="Manage Stripe Connect escrow vaults, carrier logistics APIs, and webhook event streaming"
        onRefresh={loadAll}
        refreshing={loading}
      />

      <div className="admin-content" style={{ maxWidth: '1080px' }}>
        {/* Minimalist Tab Navigation */}
        <nav className="admin-tab-nav">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab-nav-btn ${isActive ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="admin-tab-badge">{tab.count}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Tab Panels */}
        {loading ? (
          <div className="admin-empty-state">
            <RefreshCw size={24} className="animate-spin admin-empty-icon" />
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
