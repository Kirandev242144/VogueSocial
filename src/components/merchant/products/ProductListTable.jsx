"use client";
import React from 'react';
import { Package, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';

const FILTER_TABS = [
  { key: 'all', label: 'All Listings' },
  { key: 'live', label: 'Live Market' },
  { key: 'pending_approval', label: 'Pending Review' },
  { key: 'changes_requested', label: 'Changes Requested' },
  { key: 'draft', label: 'Drafts' },
  { key: 'rejected', label: 'Rejected' }
];

export default function ProductListTable({
  products = [],
  loading = false,
  catalogFilter = 'all',
  onFilterChange,
  onOpenNew,
  onOpenEdit,
  onDelete,
  onViewNotes
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return <span className="prod-badge prod-badge-live">Live</span>;
      case 'pending_approval':
        return <span className="prod-badge prod-badge-pending">Pending Review</span>;
      case 'changes_requested':
        return <span className="prod-badge prod-badge-changes">Changes Requested</span>;
      case 'rejected':
        return <span className="prod-badge prod-badge-rejected">Rejected</span>;
      case 'draft':
      default:
        return <span className="prod-badge prod-badge-draft">Draft</span>;
    }
  };

  const getStockClass = (stock) => {
    if (stock <= 0) return 'prod-stock-out';
    if (stock <= 5) return 'prod-stock-low';
    return 'prod-stock-ok';
  };

  const getStockLabel = (stock) => {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="prod-card">
      {/* Panel Header with Sub-filters */}
      <div className="prod-card-header">
        <div className="prod-card-title">
          <span>Product Listings</span>
          <span className="prod-count-badge">{products.length}</span>
        </div>

        <div className="prod-filter-group">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`prod-filter-pill ${catalogFilter === tab.key ? 'prod-filter-pill-active' : ''}`}
              onClick={() => onFilterChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content or States */}
      {loading ? (
        <div className="prod-loading">
          <RefreshCw size={20} className="animate-spin" />
          <span>Loading catalog listings...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="prod-empty">
          <Package size={44} className="prod-empty-icon" />
          <div className="prod-empty-title">No products found</div>
          <p className="prod-empty-text">
            There are no products matching your selected filter. Create a new product listing to submit it to the marketplace.
          </p>
          <button
            type="button"
            className="prod-btn-primary"
            onClick={onOpenNew}
          >
            <Plus size={15} />
            <span>Add Product</span>
          </button>
        </div>
      ) : (
        <div className="prod-table-wrap">
          <table className="prod-table">
            <thead>
              <tr>
                <th>Product & SKU</th>
                <th>Target & Category</th>
                <th>Price</th>
                <th>Stock & Inventory</th>
                <th>Approval Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stockCount = p.stock !== undefined ? p.stock : 25;
                const cleanName = (p.name || 'Untitled').replace(/Atelier\s*/gi, 'Tailored ');

                return (
                  <tr key={p.id}>
                    {/* Product & SKU */}
                    <td>
                      <div className="prod-item-cell">
                        <div className="prod-thumb">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" />
                          ) : (
                            <Package size={20} />
                          )}
                        </div>
                        <div className="prod-item-meta">
                          <span className="prod-item-title" title={cleanName}>
                            {cleanName}
                          </span>
                          <span className="prod-item-sku">SKU: {p.sku || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Target & Category */}
                    <td>
                      <div className="prod-cat-cell">
                        <span className="prod-item-category">{p.category}</span>
                        <span className="prod-item-subcat">
                          {p.target_audience || 'Women'} · {p.subcategory || 'General'}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td>
                      <div className="prod-price-cell">
                        <span className="prod-price-main">${p.price}</span>
                        {p.sale_price && (
                          <span className="prod-price-sale">${p.sale_price}</span>
                        )}
                      </div>
                    </td>

                    {/* Stock & Status */}
                    <td>
                      <div className="prod-stock-cell">
                        <span className={`prod-stock-qty ${getStockClass(stockCount)}`}>
                          {stockCount} units
                        </span>
                        <span className={`prod-stock-label ${getStockClass(stockCount)}`}>
                          {getStockLabel(stockCount)}
                        </span>
                      </div>
                    </td>

                    {/* Approval Status */}
                    <td>
                      <div className="prod-status-cell">
                        {getStatusBadge(p.status)}
                        {(p.status === 'changes_requested' || p.status === 'rejected') && (p.admin_notes || p.merchant_feedback) && (
                          <button
                            type="button"
                            className="prod-feedback-btn"
                            onClick={() => onViewNotes({
                              title: p.status === 'rejected' ? 'Rejection Reason' : 'Changes Requested by Admin',
                              notes: p.merchant_feedback || p.admin_notes
                            })}
                          >
                            View Feedback
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="prod-actions">
                        <button
                          type="button"
                          className="prod-icon-btn"
                          onClick={() => onOpenEdit(p)}
                          title="Edit Listing"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="prod-icon-btn prod-icon-btn-danger"
                          onClick={() => onDelete(p.id)}
                          title="Delete Listing"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
