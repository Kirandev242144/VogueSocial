"use client";
import React from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import {
  Facebook, RefreshCw, DownloadCloud, AlertTriangle,
  ExternalLink, CheckCircle2, Lock
} from 'lucide-react';

export default function MetaLiveCatalogTab({
  fbLiveProducts = [],
  fetchingLive = false,
  isConnected = false,
  onRefresh,
  onConnect
}) {
  return (
    <div className={styles.metaPanel}>
      <div className={styles.metaPanelHeader}>
        <div className={styles.metaPanelTitle}>
          <Facebook size={17} />
          <span>Live Items in Meta Catalog ({isConnected ? fbLiveProducts.length : 0})</span>
        </div>

        {isConnected && (
          <button
            type="button"
            className={styles.btnMetaSecondary}
            onClick={onRefresh}
            disabled={fetchingLive}
          >
            <RefreshCw size={14} className={fetchingLive ? styles.spinning : ''} />
            <span>{fetchingLive ? 'Refreshing...' : 'Refresh from Meta'}</span>
          </button>
        )}
      </div>

      <div className={styles.tableWrap}>
        {!isConnected ? (
          <div className={styles.emptyState}>
            <Lock size={36} className={styles.emptyIcon} />
            <div className={styles.emptyTitle}>Meta Account Not Connected</div>
            <p className={styles.emptyText}>
              Authorize your Meta Business Manager and Catalog to query the live Graph API v19.0 feed and inspect products actively published on Facebook &amp; Instagram.
            </p>
            <button
              type="button"
              className={styles.btnMetaPrimary}
              onClick={() => onConnect?.()}
            >
              <span>Connect Meta Account</span>
            </button>
          </div>
        ) : fbLiveProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <DownloadCloud size={36} className={styles.emptyIcon} />
            <div className={styles.emptyTitle}>No Live Meta Catalog Items Loaded</div>
            <p className={styles.emptyText}>
              Your account is connected. Click "Refresh from Meta" to query your Meta Commerce Catalog API and display live products.
            </p>
            <button
              type="button"
              className={styles.btnMetaSecondary}
              onClick={onRefresh}
              disabled={fetchingLive}
            >
              <RefreshCw size={14} className={fetchingLive ? styles.spinning : ''} />
              <span>{fetchingLive ? 'Pulling Catalog...' : 'Pull Live Catalog'}</span>
            </button>
          </div>
        ) : (
          <table className={styles.metaTable}>
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
              {fbLiveProducts.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td>
                    <span className={styles.skuCode}>{item.retailer_id || item.id}</span>
                  </td>
                  <td>
                    <div className={styles.itemCell}>
                      {item.image_url && (
                        <img src={item.image_url} alt="" className={styles.itemThumb} />
                      )}
                      <div className={styles.itemDetails}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemSub}>{item.category || 'Apparel'}</span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.priceCol}>{item.price || item.sale_price || '$0.00'}</td>
                  <td>
                    <span className={styles.badgeMetaSynced}>
                      {item.availability || 'in stock'}
                    </span>
                  </td>
                  <td>{item.condition || 'new'}</td>
                  <td>{item.brand || 'Studio Label'}</td>
                  <td>
                    <span className={styles.metaIdSnippet}>{item.id}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
