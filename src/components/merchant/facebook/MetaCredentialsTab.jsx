"use client";
import React, { useState } from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Building,
  Facebook, Instagram, Database, Activity, ChevronDown,
  ChevronUp, Eye, EyeOff, KeyRound, LogOut, Link2
} from 'lucide-react';

export default function MetaCredentialsTab({
  settings = {},
  onUpdateSettings,
  onSaveSettings,
  onRequestConnect,
  onRequestDisconnect,
  onVerifyDeveloperCredentials,
  verifying = false
}) {
  const [showToken, setShowToken] = useState(false);
  const [developerExpanded, setDeveloperExpanded] = useState(false);

  const isConnected = !!settings.connected;

  const handleToggleAutoSync = (e) => {
    if (!isConnected) return;
    const nextVal = e.target.checked;
    onUpdateSettings?.({ ...settings, auto_sync: nextVal });
  };

  return (
    <div className={styles.metaSettingsGrid}>
      {/* ── CARD 1: META BUSINESS EXTENSION OAUTH STATUS ── */}
      <div className={styles.settingsCard}>
        <div className={styles.settingsCardHeader}>
          <div className={styles.settingsCardTitle}>
            <ShieldCheck size={18} color="#0866ff" />
            <span>Meta Business Extension (MBE) Connection</span>
          </div>

          <div>
            {isConnected ? (
              <span className={styles.badgeStatusConnected}>
                <CheckCircle2 size={12} />
                <span>CONNECTED VIA OAUTH</span>
              </span>
            ) : (
              <span className={styles.badgeStatusDisconnected}>
                <AlertTriangle size={12} />
                <span>NOT CONNECTED</span>
              </span>
            )}
          </div>
        </div>

        {isConnected ? (
          <div>
            {/* Connected Assets 2x2 Grid */}
            <div className={styles.connectedAssetsGrid}>
              <div className={styles.assetBox}>
                <Building size={20} className={styles.assetIcon} />
                <div>
                  <div className={styles.assetLabel}>Business Manager</div>
                  <div className={styles.assetName}>{settings.business_name || 'Studio Label Global Holdings'}</div>
                  <div className={styles.assetMeta}>ID: {settings.business_id || 'bm_9482019482'}</div>
                </div>
              </div>

              <div className={styles.assetBox}>
                <Facebook size={20} className={styles.assetIcon} />
                <div>
                  <div className={styles.assetLabel}>Facebook Page</div>
                  <div className={styles.assetName}>{settings.page_name || 'Studio Label Official'}</div>
                  <div className={styles.assetMeta}>ID: {settings.page_id || 'page_10492810482'}</div>
                </div>
              </div>

              <div className={styles.assetBox}>
                <Instagram size={20} className={styles.assetIcon} />
                <div>
                  <div className={styles.assetLabel}>Instagram Professional</div>
                  <div className={styles.assetName}>{settings.instagram_account || '@studiolabel.paris'}</div>
                  <div className={styles.assetMeta}>Linked Shopping Tagging Active</div>
                </div>
              </div>

              <div className={styles.assetBox}>
                <Database size={20} className={styles.assetIcon} />
                <div>
                  <div className={styles.assetLabel}>Meta Commerce Catalog</div>
                  <div className={styles.assetName}>{settings.catalog_name || 'Studio Label Ready-to-Wear'}</div>
                  <div className={styles.assetMeta}>ID: {settings.catalog_id || '1492049281048291'}</div>
                </div>
              </div>
            </div>

            {/* Auto-Sync Toggle Row */}
            <div className={styles.autoSyncRow}>
              <div className={styles.autoSyncInfo}>
                <div className={styles.autoSyncTitle}>Automatic Catalog Synchronization</div>
                <div className={styles.autoSyncDesc}>
                  Automatically sync garment catalog changes, prices, stock levels, and size variants to Meta Commerce Manager on an hourly schedule.
                </div>
              </div>

              <label className={styles.switchWrap}>
                <input
                  type="checkbox"
                  checked={!!settings.auto_sync}
                  onChange={handleToggleAutoSync}
                />
                <span className={styles.switchSlider} />
              </label>
            </div>

            {/* Disconnect Action */}
            <div className={styles.settingsCardHeader}>
              <button
                type="button"
                className={styles.btnMetaDanger}
                onClick={onRequestDisconnect}
              >
                <LogOut size={14} />
                <span>Disconnect Meta Account</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.emptyState}>
              <Link2 size={36} className={styles.emptyIcon} />
              <div className={styles.emptyTitle}>Connect with Meta Business Manager</div>
              <p className={styles.emptyText}>
                Authenticate your Facebook Page, Instagram Shopping profile, and Meta Commerce Catalog using the official Meta Business Extension flow. No manual token generation required.
              </p>
              <button
                type="button"
                className={styles.btnMetaConnectPrompt}
                onClick={onRequestConnect}
              >
                <Facebook size={16} />
                <span>Launch Meta Authorization</span>
              </button>
            </div>

            {/* Inactive Auto-Sync explanation */}
            <div className={styles.autoSyncRow}>
              <div className={styles.autoSyncInfo}>
                <div className={styles.autoSyncTitle}>Automatic Catalog Synchronization</div>
                <div className={styles.autoSyncDesc}>
                  Auto-sync is currently <strong className={styles.metaStatSubInactive}>Inactive</strong>. Connect your Meta account above to enable automatic hourly catalog updates.
                </div>
              </div>

              <label className={styles.switchWrap} title="Connect Meta account to enable auto-sync">
                <input
                  type="checkbox"
                  checked={false}
                  disabled
                  readOnly
                />
                <span className={styles.switchSlider} />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ── CARD 2: DEVELOPER & SYSTEM USER TOKEN OVERRIDES (COLLAPSIBLE) ── */}
      <div className={styles.settingsCard}>
        <button
          type="button"
          className={styles.accordionToggle}
          onClick={() => setDeveloperExpanded(!developerExpanded)}
        >
          <div className={styles.settingsCardTitle}>
            <KeyRound size={16} color="#4b5563" />
            <span>Developer / System User Token Overrides (Graph API v19.0)</span>
          </div>
          {developerExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {developerExpanded && (
          <div className={styles.accordionContent}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Meta Catalog ID</label>
              <input
                className={styles.formInput}
                placeholder="e.g. 1492049281048291"
                value={settings.catalog_id || ''}
                onChange={(e) => onUpdateSettings?.({ ...settings, catalog_id: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Facebook Page ID</label>
              <input
                className={styles.formInput}
                placeholder="e.g. 10492810482"
                value={settings.page_id || ''}
                onChange={(e) => onUpdateSettings?.({ ...settings, page_id: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>System User Access Token</label>
              <div className={styles.tokenInputWrap}>
                <input
                  type={showToken ? 'text' : 'password'}
                  className={styles.formInput}
                  placeholder="EAAG..."
                  value={settings.access_token || ''}
                  onChange={(e) => onUpdateSettings?.({ ...settings, access_token: e.target.value })}
                />
                <button
                  type="button"
                  className={styles.tokenEyeBtn}
                  onClick={() => setShowToken(!showToken)}
                  title={showToken ? 'Hide token' : 'Show token'}
                >
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className={styles.settingsCardHeader}>
              <button
                type="button"
                className={styles.btnMetaSecondary}
                onClick={onVerifyDeveloperCredentials}
                disabled={verifying}
              >
                <CheckCircle2 size={13} />
                <span>{verifying ? 'Verifying Token...' : 'Test & Verify Token'}</span>
              </button>

              <button
                type="button"
                className={styles.btnMetaPrimary}
                onClick={onSaveSettings}
              >
                <span>Save Developer Credentials</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
