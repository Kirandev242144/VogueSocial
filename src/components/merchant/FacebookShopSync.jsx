"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/app/merchant/merchant.module.css';
import {
  Facebook, RefreshCw, CheckCircle2, AlertTriangle,
  UploadCloud, DownloadCloud, Eye, EyeOff, ShieldCheck,
  Settings2, Package, ExternalLink, ArrowRight
} from 'lucide-react';
import {
  getFacebookSettings,
  saveFacebookSettings,
  verifyFacebookCatalog,
  getFacebookCatalogProducts,
  syncProductsToFacebook,
  postProductToFacebook
} from '@/lib/facebookService';

export default function FacebookShopSync({ products = [] }) {
  const [settings, setSettings] = useState({
    connected: false,
    page_name: 'Studio Label Official',
    page_id: '',
    catalog_id: '',
    catalog_name: '',
    access_token: '',
    auto_sync: true,
    clothing_only: true,
    last_sync_at: null,
    logs: []
  });

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'live_fb' | 'logs' | 'config'
  const [showToken, setShowToken] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [fetchingLive, setFetchingLive] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text: string }

  // Live products fetched from Facebook Catalog
  const [fbLiveProducts, setFbLiveProducts] = useState([]);
  // Selected product IDs for batch sync
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getFacebookSettings();
      setSettings(data);
    } catch (e) {
      console.error("Failed to load Facebook settings:", e);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await saveFacebookSettings(settings);
      setNotice({ type: 'success', text: 'Facebook Shop settings saved successfully.' });
    } catch (e) {
      setNotice({ type: 'error', text: 'Failed to save settings: ' + e.message });
    }
  };

  // Real API: Verify Catalog credentials
  const handleVerify = async () => {
    if (!settings.catalog_id || !settings.access_token) {
      setNotice({ type: 'error', text: 'Please provide both Catalog ID and Meta Access Token.' });
      return;
    }

    setVerifying(true);
    setNotice(null);
    try {
      const res = await verifyFacebookCatalog(settings.catalog_id, settings.access_token);
      const updated = {
        ...settings,
        connected: true,
        catalog_name: res.catalog_info?.name || settings.catalog_name
      };
      setSettings(updated);
      await saveFacebookSettings(updated);
      setNotice({
        type: 'success',
        text: `Successfully authenticated with Meta Graph API! Catalog: ${res.catalog_info?.name || settings.catalog_id}`
      });
    } catch (err) {
      setNotice({ type: 'error', text: err.message });
    } finally {
      setVerifying(false);
    }
  };

  // Real API: Fetch live products from Meta Graph API
  const handleFetchLiveProducts = async () => {
    if (!settings.catalog_id || !settings.access_token) {
      setNotice({ type: 'error', text: 'Configure Catalog ID and Access Token to pull live products.' });
      return;
    }

    setFetchingLive(true);
    setNotice(null);
    try {
      const liveItems = await getFacebookCatalogProducts(settings.catalog_id, settings.access_token);
      setFbLiveProducts(liveItems);
      setActiveTab('live_fb');
      setNotice({
        type: 'success',
        text: `Retrieved ${liveItems.length} live products directly from Meta Catalog API.`
      });
    } catch (err) {
      setNotice({ type: 'error', text: 'Failed to fetch from Facebook: ' + err.message });
    } finally {
      setFetchingLive(false);
    }
  };

  // Real API: Push selected or all products to Facebook Catalog
  const handleSyncToFacebook = async () => {
    if (!settings.catalog_id || !settings.access_token) {
      setNotice({ type: 'error', text: 'Please connect and verify your Facebook Catalog first.' });
      return;
    }

    const itemsToSync = selectedIds.length > 0
      ? products.filter(p => selectedIds.includes(p.id))
      : products;

    if (itemsToSync.length === 0) {
      setNotice({ type: 'error', text: 'No products available to sync.' });
      return;
    }

    setSyncing(true);
    setNotice(null);
    try {
      const result = await syncProductsToFacebook(settings.catalog_id, settings.access_token, itemsToSync);
      const updatedLogs = [result.log, ...(settings.logs || [])];
      const updated = {
        ...settings,
        last_sync_at: result.log.timestamp,
        logs: updatedLogs
      };
      setSettings(updated);
      await saveFacebookSettings(updated);

      setNotice({
        type: result.failed_count === 0 ? 'success' : 'error',
        text: `Sync Complete: ${result.synced_count} products posted to Facebook Catalog. (${result.failed_count} errors)`
      });
    } catch (err) {
      setNotice({ type: 'error', text: 'Sync failed: ' + err.message });
    } finally {
      setSyncing(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(products.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* ── 1. FACEBOOK HERO BANNER ── */}
      <div className={styles.fbHeroBox}>
        <div className={styles.fbHeaderLeft}>
          <div className={styles.fbIconCircle}>
            <Facebook size={26} />
          </div>
          <div>
            <div className={styles.fbTitleRow}>
              <h2 className={styles.fbTitle}>Meta Facebook & Instagram Shop Sync</h2>
              {settings.connected ? (
                <span className={styles.fbBadgeConnected}>
                  <CheckCircle2 size={13} />
                  <span>CATALOG CONNECTED</span>
                </span>
              ) : (
                <span className={styles.fbBadgeDisconnected}>
                  <AlertTriangle size={13} />
                  <span>NOT CONNECTED</span>
                </span>
              )}
            </div>
            <p className={styles.fbSubtitle}>
              Direct integration with Meta Graph API v19.0. Synchronize your high-fashion garments directly into your
              Facebook Commerce Manager Catalog and Instagram Shopping feed with instant pricing and inventory updates.
            </p>
          </div>
        </div>

        <div className={styles.dashActions}>
          <button
            className={styles.btnSecondary}
            onClick={handleFetchLiveProducts}
            disabled={fetchingLive}
          >
            <DownloadCloud size={15} />
            <span>{fetchingLive ? 'Pulling from Meta...' : 'Pull from Facebook'}</span>
          </button>

          <button
            className={styles.btnFbPrimary}
            onClick={handleSyncToFacebook}
            disabled={syncing}
          >
            <UploadCloud size={15} />
            <span>{syncing ? 'Posting to Meta...' : 'Push to Facebook Shop'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. NOTIFICATION FEEDBACK ── */}
      {notice && (
        <div
          className={`${styles.fbNoticeBanner} ${
            notice.type === 'success' ? styles.fbNoticeSuccess : styles.fbNoticeError
          }`}
        >
          {notice.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          <span>{notice.text}</span>
        </div>
      )}

      {/* ── 3. STATS OVERVIEW ── */}
      <div className={styles.fbStatsGrid}>
        <div className={styles.fbStatCard}>
          <div className={styles.fbStatLabel}>Store Products</div>
          <div className={styles.fbStatValue}>{products.length}</div>
        </div>
        <div className={styles.fbStatCard}>
          <div className={styles.fbStatLabel}>Live in FB Catalog</div>
          <div className={styles.fbStatValue}>{fbLiveProducts.length || '—'}</div>
        </div>
        <div className={styles.fbStatCard}>
          <div className={styles.fbStatLabel}>Auto-Sync Status</div>
          <div className={styles.fbStatValue}>{settings.auto_sync ? 'Active' : 'Manual'}</div>
        </div>
        <div className={styles.fbStatCard}>
          <div className={styles.fbStatLabel}>Last Synced</div>
          <div className={styles.fbStatValue}>{settings.last_sync_at ? 'Recent' : 'Never'}</div>
        </div>
      </div>

      {/* ── 4. NAVIGATION TABS ── */}
      <div className={styles.fbTabNav}>
        <button
          className={`${styles.fbTabBtn} ${activeTab === 'catalog' ? styles.fbTabBtnActive : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <Package size={15} />
          <span>Vogue Products ({products.length})</span>
        </button>

        <button
          className={`${styles.fbTabBtn} ${activeTab === 'live_fb' ? styles.fbTabBtnActive : ''}`}
          onClick={() => setActiveTab('live_fb')}
        >
          <DownloadCloud size={15} />
          <span>Meta Live Catalog ({fbLiveProducts.length})</span>
        </button>

        <button
          className={`${styles.fbTabBtn} ${activeTab === 'config' ? styles.fbTabBtnActive : ''}`}
          onClick={() => setActiveTab('config')}
        >
          <Settings2 size={15} />
          <span>API Credentials & Settings</span>
        </button>

        <button
          className={`${styles.fbTabBtn} ${activeTab === 'logs' ? styles.fbTabBtnActive : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <RefreshCw size={15} />
          <span>Sync Audit Logs ({(settings.logs || []).length})</span>
        </button>
      </div>

      {/* ── TAB 1: VOGUE PRODUCTS TO SYNC ── */}
      {activeTab === 'catalog' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Package size={16} />
              <span>Select Garments to Push to Facebook Shop</span>
            </div>
            <div>
              {selectedIds.length > 0 && (
                <button className={styles.btnFbPrimary} onClick={handleSyncToFacebook} disabled={syncing}>
                  <UploadCloud size={14} />
                  <span>Sync {selectedIds.length} Selected to Facebook</span>
                </button>
              )}
            </div>
          </div>

          <div className={styles.tableScrollWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedIds.length === products.length && products.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Garment</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Meta Category</th>
                  <th>Facebook Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.empty}>
                        <Package size={32} className={styles.emptyIcon} />
                        <div className={styles.emptyTitle}>No Products Found</div>
                        <p className={styles.emptyText}>Create products in the Products tab to sync with Facebook.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const isSelected = selectedIds.includes(p.id);
                    return (
                      <tr key={p.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(p.id)}
                          />
                        </td>
                        <td>
                          <div className={styles.garmentCell}>
                            <img
                              src={p.image_url || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&q=80'}
                              alt=""
                              className={styles.garmentThumb}
                            />
                            <div className={styles.garmentInfo}>
                              <span className={styles.garmentName}>{p.name}</span>
                              <span className={styles.garmentCategory}>{p.category || 'Clothing'}</span>
                            </div>
                          </div>
                        </td>
                        <td>{p.sku || p.id?.substring(0, 10)}</td>
                        <td>${p.price || '0.00'}</td>
                        <td>Apparel & Accessories &gt; Clothing</td>
                        <td>
                          <span className={`${styles.badge} ${styles.badgeFbSynced}`}>
                            Ready to Sync
                          </span>
                        </td>
                        <td>
                          <button
                            className={styles.tableActionBtn}
                            onClick={() => {
                              setSelectedIds([p.id]);
                              handleSyncToFacebook();
                            }}
                          >
                            <UploadCloud size={13} />
                            <span>Push</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: LIVE PRODUCTS FROM FACEBOOK ── */}
      {activeTab === 'live_fb' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Facebook size={16} />
              <span>Live Items in Meta Catalog ({fbLiveProducts.length})</span>
            </div>
            <button className={styles.btnSecondary} onClick={handleFetchLiveProducts} disabled={fetchingLive}>
              <RefreshCw size={14} />
              <span>{fetchingLive ? 'Refreshing...' : 'Refresh from Meta'}</span>
            </button>
          </div>

          <div className={styles.tableScrollWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Retailer ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Condition</th>
                  <th>Brand</th>
                  <th>Meta Product ID</th>
                </tr>
              </thead>
              <tbody>
                {fbLiveProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className={styles.empty}>
                        <DownloadCloud size={32} className={styles.emptyIcon} />
                        <div className={styles.emptyTitle}>No Live Facebook Products Loaded</div>
                        <p className={styles.emptyText}>
                          Click "Pull from Facebook" above to query your Meta Catalog API and display live products.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  fbLiveProducts.map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td>{item.retailer_id || item.id}</td>
                      <td>
                        <div className={styles.garmentCell}>
                          {item.image_url && (
                            <img src={item.image_url} alt="" className={styles.garmentThumb} />
                          )}
                          <div className={styles.garmentInfo}>
                            <span className={styles.garmentName}>{item.name}</span>
                            <span className={styles.garmentCategory}>{item.category || 'Apparel'}</span>
                          </div>
                        </div>
                      </td>
                      <td>{item.price || item.sale_price || '$0.00'}</td>
                      <td>
                        <span className={`${styles.badge} ${styles.badgeLive}`}>
                          {item.availability || 'in stock'}
                        </span>
                      </td>
                      <td>{item.condition || 'new'}</td>
                      <td>{item.brand || 'Studio Label'}</td>
                      <td>{item.id}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: API CREDENTIALS CONFIGURATION ── */}
      {activeTab === 'config' && (
        <div className={styles.fbConfigCard}>
          <div className={styles.fbConfigHeader}>
            <div className={styles.fbConfigTitle}>
              <ShieldCheck size={18} color="#1877f2" />
              <span>Meta Graph API v19.0 Configuration</span>
            </div>
            <button className={styles.btnSecondary} onClick={handleVerify} disabled={verifying}>
              <CheckCircle2 size={14} />
              <span>{verifying ? 'Verifying...' : 'Test & Verify Connection'}</span>
            </button>
          </div>

          <div className={styles.fbGridFields}>
            <div className={styles.fGroup}>
              <label className={styles.fLabel}>Meta Catalog ID *</label>
              <input
                className={styles.fInput}
                placeholder="e.g. 1492049281048291"
                value={settings.catalog_id}
                onChange={(e) => setSettings(p => ({ ...p, catalog_id: e.target.value }))}
              />
            </div>

            <div className={styles.fGroup}>
              <label className={styles.fLabel}>Facebook Page ID / Business Account</label>
              <input
                className={styles.fInput}
                placeholder="e.g. 102948291049201"
                value={settings.page_id}
                onChange={(e) => setSettings(p => ({ ...p, page_id: e.target.value }))}
              />
            </div>

            <div className={styles.fGroup}>
              <label className={styles.fLabel}>Meta System User / Page Access Token *</label>
              <div className={styles.tokenInputWrap}>
                <input
                  type={showToken ? 'text' : 'password'}
                  className={styles.fInput}
                  placeholder="EAAG..."
                  value={settings.access_token}
                  onChange={(e) => setSettings(p => ({ ...p, access_token: e.target.value }))}
                />
                <button
                  type="button"
                  className={styles.tokenEyeBtn}
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.fbActionRow}>
            <div className={styles.fGroup}>
              <label className={styles.fLabel}>Catalog Name</label>
              <input
                className={styles.fInput}
                value={settings.catalog_name || ''}
                placeholder="Studio Label Ready-to-Wear Catalog"
                onChange={(e) => setSettings(p => ({ ...p, catalog_name: e.target.value }))}
              />
            </div>

            <button className={styles.btnPrimary} onClick={handleSaveSettings}>
              Save Credentials
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 4: SYNC AUDIT LOGS ── */}
      {activeTab === 'logs' && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <RefreshCw size={16} />
              <span>Facebook Catalog Sync Audit Trail</span>
            </div>
          </div>

          <div className={styles.tableScrollWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Sync Type</th>
                  <th>Items Pushed</th>
                  <th>Failed Items</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(!settings.logs || settings.logs.length === 0) ? (
                  <tr>
                    <td colSpan={5}>
                      <div className={styles.empty}>
                        <RefreshCw size={28} className={styles.emptyIcon} />
                        <div className={styles.emptyTitle}>No Sync Logs Yet</div>
                        <p className={styles.emptyText}>Execute a push or pull to record sync transactions.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  settings.logs.map((l) => (
                    <tr key={l.id}>
                      <td>{l.timestamp}</td>
                      <td>{l.type}</td>
                      <td>{l.synced_count || 0}</td>
                      <td>{l.failed_count || 0}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            l.status === 'SUCCESS' ? styles.badgeLive : styles.badgeCancelled
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
