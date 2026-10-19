"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { storeService } from '@/services/storeService';
import { DEFAULT_MERCHANT_STORE } from '@/lib/storefrontData';
import StorefrontEditor from '@/components/merchant/storefront-editor/StorefrontEditor';
import { Loader2 } from 'lucide-react';

export default function MerchantWebsiteEditorPage() {
  const { user } = useAuth();
  const effectiveHandle = user?.storeHandle || 'studiolabel';
  const effectiveVendorId = user?.id || 'ec9e5c47-4d4a-4998-b4b3-16d228f9615c';

  const [settings, setSettings] = useState(DEFAULT_MERCHANT_STORE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWebsiteSettings() {
      setLoading(true);
      try {
        const data = await storeService.getStoreWebsite(effectiveVendorId, effectiveHandle);
        if (data && data.success && data.website) {
          setSettings({
            ...DEFAULT_MERCHANT_STORE,
            ...data.website
          });
        }
      } catch (err) {
        console.warn('Error loading website settings for standalone editor:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWebsiteSettings();
  }, [effectiveVendorId, effectiveHandle]);

  if (loading) {
    return (
      <div className="editor-loading-screen">
        <Loader2 size={24} color="#38bdf8" className="editor-spin" />
        <span className="editor-loading-text">Loading Standalone Storefront Studio...</span>
      </div>
    );
  }

  return (
    <div className="editor-page-root">
      <StorefrontEditor
        initialSettings={settings}
        vendorId={effectiveVendorId}
        handle={effectiveHandle}
        isStandalone={true}
        onSaved={(updated) => setSettings(prev => ({ ...prev, ...updated }))}
      />
    </div>
  );
}
