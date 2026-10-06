import React from 'react';
import { X, Check, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import './LookShopSidebar.css';

export default function LookShopSidebar({
  matchedItems,
  addedItems,
  selectedSizes,
  onSelectSize,
  onAddToCart,
  onAddAllToCart,
  isAllAdded,
  onClose,
  activeItem,
  onTryOnItem
}) {
  const totalPrice = matchedItems
    .reduce((sum, item) => sum + item.price, 0)
    .toFixed(2);

  return (
    <aside className="look-shop-sidebar">
      {/* Header */}
      <div className="look-shop-header">
        <div className="look-header-titles">
          <h2 className="look-shop-title">Shop this Look</h2>
          <p className="look-shop-subtitle">Items matched to your AI generation</p>
        </div>
        <button
          type="button"
          className="look-sidebar-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>
      </div>

      {/* Drag & Drop Hint */}
      <div className="look-drag-hint-banner">
        <Sparkles size={13} className="look-drag-hint-icon" />
        <span>Drag & drop any item onto canvas to try on</span>
      </div>

      {/* Matched Product Items */}
      <div className="look-items-list">
        {matchedItems.map((item) => {
          const isAdded = addedItems[item.id];
          const isFitted = activeItem?.id === item.id;
          const currentSize = selectedSizes[item.id] || item.defaultSize;

          return (
            <div
              key={item.id}
              className={`look-item-card ${isFitted ? 'active-fitted' : ''}`}
              draggable="true"
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(item));
                e.dataTransfer.setData('text/plain', JSON.stringify(item));
                e.dataTransfer.effectAllowed = 'copy';
              }}
              title="Drag onto model or click Try On"
            >
              <div className="look-thumb-wrap">
                <img src={item.image} alt={item.title} className="look-item-thumb" />
              </div>

              <div className="look-item-info">
                <span className="look-item-name">{item.title}</span>
                <span className="look-item-price">{item.priceDisplay}</span>

                {/* Size Selector Chips */}
                <div className="look-size-picker">
                  <span className="look-size-label">Size:</span>
                  <div className="look-size-chips">
                    {(item.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((sz) => {
                      const isSelected = currentSize === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          className={`look-size-chip ${isSelected ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSize(item.id, sz);
                          }}
                          title={`Select size ${sz}`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="look-card-actions">
                  <button
                    type="button"
                    className={`look-tryon-btn ${isFitted ? 'active' : ''}`}
                    onClick={() => onTryOnItem(item)}
                    title="Fit this piece on model"
                  >
                    {isFitted ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Fitted</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        <span>Try On</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className={`look-add-item-btn ${isAdded ? 'added' : ''}`}
                    onClick={() => onAddToCart(item)}
                  >
                    {isAdded ? (
                      <>
                        <Check size={12} />
                        <span>In Cart ({currentSize})</span>
                      </>
                    ) : (
                      <span>Add to Cart ({currentSize})</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Checkout Summary */}
      <div className="look-summary-footer">
        <div className="look-total-row">
          <span className="look-total-label">Total ({matchedItems.length} items)</span>
          <span className="look-total-amount">${totalPrice}</span>
        </div>

        <button
          type="button"
          className={`look-add-all-btn ${isAllAdded ? 'success' : ''}`}
          onClick={onAddAllToCart}
        >
          {isAllAdded ? (
            <>
              <Check size={18} />
              <span>All 3 Items Added with Sizes!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={18} />
              <span>Add All to Cart</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
