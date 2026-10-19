"use client";
import React, { useState } from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import {
  Package, UploadCloud, RefreshCw, CheckCircle2,
  AlertTriangle, AlertCircle, ShieldAlert, Sparkles,
  ExternalLink, Filter
} from 'lucide-react';

export default function MetaProductCatalogTab({
  products = [],
  productStatuses = {},
  selectedIds = [],
  onSelectAll,
  onToggleSelect,
  onSyncProducts,
  onSyncSingleProduct,
  onViewPolicyIssue,
  onFixAttributes,
  syncing = false,
  isConnected = false,
  onConnectPrompt
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'READY' | 'SYNCED' | 'ACTION_REQUIRED' | 'REJECTED' | 'FAILED'

  // Helper to get product status object
  const getProductStatus = (productId) => {
    return productStatuses[productId] || {
      status: 'ready',
      label: 'Ready to sync',
      reason: 'Garment validated. Ready to push to Meta Commerce Manager.',
      metaId: null
    };
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    if (filter === 'ALL') return true;
    const st = getProductStatus(p.id).status;
    if (filter === 'READY') return st === 'ready';
    if (filter === 'SYNCED') return st === 'synced';
    if (filter === 'ACTION_REQUIRED') return st === 'action_required';
    if (filter === 'REJECTED') return st === 'rejected';
    if (filter === 'FAILED') return st === 'failed';
    return true;
  });

  // Calculate counts for filter pills
  const counts = {
    all: products.length,
    ready: products.filter(p => getProductStatus(p.id).status === 'ready').length,
    synced: products.filter(p => getProductStatus(p.id).status === 'synced').length,
    action_required: products.filter(p => getProductStatus(p.id).status === 'action_required').length,
    rejected: products.filter(p => getProductStatus(p.id).status === 'rejected').length,
    failed: products.filter(p => getProductStatus(p.id).status === 'failed').length
  };

  const handleBulkSyncClick = () => {
    if (!isConnected) {
      onConnectPrompt?.('Connect your Meta account before syncing products to Meta Catalog.');
      return;
    }
    onSyncProducts?.();
  };

  const handleSingleSyncClick = (product) => {
    if (!isConnected) {
      onConnectPrompt?.('Connect your Meta account before syncing products to Meta Catalog.');
      return;
    }
    onSyncSingleProduct?.(product);
  };

  // Render status badge with rich tooltip
  const renderStatusBadge = (p) => {
    const st = getProductStatus(p.id);

    switch (st.status) {
      case 'syncing':
        return (
          <div className={styles.statusWrapper}>
            <span className={styles.badgeMetaSyncing} title="Currently transmitting to Meta Graph API v19.0">
              <RefreshCw size={11} className={styles.spinning} />
              <span>Syncing</span>
            </span>
          </div>
        );

      case 'synced':
        return (
          <div className={styles.statusWrapper}>
            <span className={styles.badgeMetaSynced} title={st.reason || 'Live on Meta Commerce Manager & Instagram Shopping'}>
              <CheckCircle2 size={11} />
              <span>Synced</span>
            </span>
            {st.metaId && (
              <span className={styles.metaIdSnippet} title={`Meta ID: ${st.metaId}`}>
                ID: {st.metaId.slice(-8)}
              </span>
            )}
          </div>
        );

      case 'failed':
        return (
          <div className={styles.statusWrapper}>
            <span className={styles.badgeMetaFailed} title={st.reason || 'Sync failed: API timeout or network error'}>
              <AlertCircle size={11} />
              <span>Sync failed</span>
            </span>
          </div>
        );

      case 'rejected':
        return (
          <div className={styles.statusWrapper}>
            <span className={styles.badgeMetaRejected} title={st.reason || 'Rejected by Meta Commerce Policy'}>
              <ShieldAlert size={11} />
              <span>Rejected by Meta</span>
            </span>
          </div>
        );

      case 'action_required':
        return (
          <div className={styles.statusWrapper}>
            <span className={styles.badgeMetaActionRequired} title={st.reason || 'Missing required Meta catalog attributes'}>
              <AlertTriangle size={11} />
              <span>Action required</span>
            </span>
          </div>
        );

      case 'ready':
      default:
        return (
          <div className={styles.statusWrapper}>
            <span className={styles.badgeMetaReady} title={st.reason || 'All required catalog fields valid. Ready to sync.'}>
              <CheckCircle2 size={11} />
              <span>Ready to sync</span>
            </span>
          </div>
        );
    }
  };

  // Render contextual row action
  const renderRowAction = (p) => {
    const st = getProductStatus(p.id);

    if (st.status === 'syncing') {
      return (
        <button type="button" className={styles.btnRowAction} disabled>
          <RefreshCw size={12} className={styles.spinning} />
          <span>Syncing...</span>
        </button>
      );
    }

    if (st.status === 'rejected') {
      return (
        <button
          type="button"
          className={`${styles.btnRowAction} ${styles.btnRowActionDanger}`}
          onClick={() => onViewPolicyIssue?.(p, st)}
          title="Review Commerce Policy violation details"
        >
          <ShieldAlert size={12} />
          <span>View Policy Issue</span>
        </button>
      );
    }

    if (st.status === 'action_required') {
      return (
        <button
          type="button"
          className={`${styles.btnRowAction} ${styles.btnRowActionWarning}`}
          onClick={() => onFixAttributes?.(p, st)}
          title="Resolve missing catalog attributes"
        >
          <AlertTriangle size={12} />
          <span>Fix Attributes</span>
        </button>
      );
    }

    if (st.status === 'failed') {
      return (
        <button
          type="button"
          className={styles.btnRowAction}
          onClick={() => handleSingleSyncClick(p)}
          disabled={syncing}
          title="Retry push to Meta Catalog"
        >
          <RefreshCw size={12} />
          <span>Retry</span>
        </button>
      );
    }

    if (st.status === 'synced') {
      return (
        <button
          type="button"
          className={styles.btnRowAction}
          onClick={() => handleSingleSyncClick(p)}
          disabled={syncing}
          title="Re-synchronize pricing & inventory updates"
        >
          <RefreshCw size={12} />
          <span>Re-sync</span>
        </button>
      );
    }

    // Default 'ready'
    return (
      <button
        type="button"
        className={`${styles.btnRowAction} ${styles.btnRowActionPrimary}`}
        onClick={() => handleSingleSyncClick(p)}
        disabled={syncing}
        title="Sync to Meta Commerce Catalog"
      >
        <UploadCloud size={12} />
        <span>Sync</span>
      </button>
    );
  };

  return (
    <div className={styles.metaPanel}>
      <div className={styles.metaPanelHeader}>
        <div className={styles.metaPanelTitle}>
          <Package size={17} />
          <span>Select Garments to Sync to Meta Catalog</span>
        </div>

        <div className={styles.metaHeaderActions}>
          {selectedIds.length > 0 && (
            <button
              type="button"
              className={styles.btnMetaPrimary}
              onClick={handleBulkSyncClick}
              disabled={syncing}
            >
              <UploadCloud size={14} />
              <span>Sync {selectedIds.length} Selected to Meta Catalog</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className={styles.metaPanelHeader}>
        <div className={styles.metaFilterBar}>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'ALL' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All ({counts.all})
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'SYNCED' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('SYNCED')}
          >
            Synced ({counts.synced})
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'READY' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('READY')}
          >
            Ready to sync ({counts.ready})
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'ACTION_REQUIRED' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('ACTION_REQUIRED')}
          >
            Action required ({counts.action_required})
          </button>
          <button
            type="button"
            className={`${styles.filterPill} ${filter === 'REJECTED' ? styles.filterPillActive : ''}`}
            onClick={() => setFilter('REJECTED')}
          >
            Rejected by Meta ({counts.rejected})
          </button>
          {counts.failed > 0 && (
            <button
              type="button"
              className={`${styles.filterPill} ${filter === 'FAILED' ? styles.filterPillActive : ''}`}
              onClick={() => setFilter('FAILED')}
            >
              Sync failed ({counts.failed})
            </button>
          )}
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.metaTable}>
          <thead>
            <tr>
              <th className={styles.thCheck}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                  onChange={onSelectAll}
                />
              </th>
              <th>Garment</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Meta Category</th>
              <th>Meta Catalog Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className={styles.emptyState}>
                    <Package size={34} className={styles.emptyIcon} />
                    <div className={styles.emptyTitle}>No Products Matching Filter</div>
                    <p className={styles.emptyText}>
                      No garments found with the selected status filter. Select "All" to view all available products.
                    </p>
                    <button
                      type="button"
                      className={styles.btnMetaSecondary}
                      onClick={() => setFilter('ALL')}
                    >
                      Show All Products
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr key={p.id}>
                    <td className={styles.thCheck}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(p.id)}
                      />
                    </td>
                    <td>
                      <div className={styles.itemCell}>
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&q=80'}
                          alt=""
                          className={styles.itemThumb}
                        />
                        <div className={styles.itemDetails}>
                          <span className={styles.itemName}>
                            {(p.name || 'Untitled Garment').replace(/Atelier\s*/gi, 'Tailored ')}
                          </span>
                          <span className={styles.itemSub}>{p.category || 'Clothing'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.skuCode}>{p.sku || p.id?.substring(0, 10)}</span>
                    </td>
                    <td className={styles.priceCol}>
                      ${typeof p.price === 'number' ? p.price.toFixed(2) : (p.price || '0.00')}
                    </td>
                    <td>
                      <span className={styles.categoryTag}>
                        Apparel &gt; {p.category || 'Clothing'}
                      </span>
                    </td>
                    <td>{renderStatusBadge(p)}</td>
                    <td>{renderRowAction(p)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
