'use client';
import React, { useState } from 'react';
import {
  X,
  Plus,
  Wand2,
  Video,
  ShoppingBag,
  Check
} from 'lucide-react';
import styles from './ViewFullLookModal.module.css';

export default function ViewFullLookModal({ isOpen, onClose, lookData, onAddToCart }) {
  const [selectedScene, setSelectedScene] = useState(lookData?.selectedScene || 'studio');
  const [addedItems, setAddedItems] = useState({});
  const [isAllAdded, setIsAllAdded] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Sync scene when lookData changes
  React.useEffect(() => {
    if (lookData?.selectedScene) {
      setSelectedScene(lookData.selectedScene);
    }
  }, [lookData]);

  // Handle ESC key to close
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lookData) return null;

  // Scene images mapped to Studio, Street, Beach, Custom
  const scenes = lookData.scenes || {
    studio: lookData.currentImage || 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85',
    street: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=85',
    beach: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=85',
    custom: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85'
  };

  const activeImage = scenes[selectedScene] || scenes.studio;

  // Matched items corresponding to the curated runway look
  const matchedItems = [
    {
      id: 'match-1',
      title: 'Midnight Silk Evening Dress',
      price: 320.00,
      priceDisplay: '$320',
      image: '/Shop_images/3/dressblack1-1-500x750.jpeg',
      tag: 'FEATURED'
    },
    {
      id: 'match-2',
      title: 'Structured Wool Blazer',
      price: 280.00,
      priceDisplay: '$280',
      image: '/Shop_images/1/basic2-500x750.jpeg',
      tag: 'OUTERWEAR'
    },
    {
      id: 'match-3',
      title: 'Pointed Toe Leather Ankle Boots',
      price: 450.00,
      priceDisplay: '$450',
      image: '/Shop_images/1/basic4-500x750.jpeg',
      tag: 'SHOES'
    }
  ];

  const handleAddToCart = (item) => {
    setAddedItems(prev => {
      const nextState = !prev[item.id];
      if (nextState && onAddToCart) {
        onAddToCart(item);
      }
      return {
        ...prev,
        [item.id]: nextState
      };
    });
  };

  const handleAddAllToCart = () => {
    const all = {};
    matchedItems.forEach(item => {
      all[item.id] = true;
      if (onAddToCart) onAddToCart(item);
    });
    setAddedItems(all);
    setIsAllAdded(true);
    setTimeout(() => setIsAllAdded(false), 3000);
  };

  const handleGenerateVideo = () => {
    setIsVideoGenerating(true);
    setTimeout(() => {
      setIsVideoGenerating(false);
      setIsVideoReady(true);
    }, 1800);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
        {/* LEFT COLUMN: Large Interactive Visual Canvas */}
        <div className={styles.visualCanvas}>
          <div className={styles.modelWrapper}>
            <img src={activeImage} alt="Full Look Visual" className={styles.renderedModelImg} />

            {/* Interactive Garment Hotspots */}
            <div className={styles.hotspotDotChest} title="Bodice & neckline fit" />
            <div className={styles.hotspotDotWaist} title="Cinched waist seam" />
            <div className={styles.hotspotDotHem} title="A-line cascading skirt hem" />
          </div>

          {/* Top-Left Floating Tools */}
          <div className={styles.floatingTopTools}>
            <button
              type="button"
              className={styles.glassBtn}
              onClick={() => alert("Add Items palette: layer jewelry, jackets, or accessories.")}
            >
              <Plus size={14} />
              <span>Add Items</span>
            </button>

            <button
              type="button"
              className={styles.glassBtn}
              onClick={() => alert("Refine Fit: adjusting waist drape and shoulder calibration.")}
            >
              <Wand2 size={14} />
              <span>Refine Fit</span>
            </button>
          </div>

          {/* Bottom Floating Background Scene Bar */}
          <div className={styles.floatingBottomBar}>
            <span className={styles.backgroundLabel}>BACKGROUND</span>

            <div className={styles.scenesPillsGroup}>
              {[
                { key: 'studio', label: 'Studio', icon: '●' },
                { key: 'street', label: 'Street', icon: '●' },
                { key: 'beach', label: 'Beach', icon: '●' },
                { key: 'custom', label: 'Custom', icon: '✨' }
              ].map(scene => {
                const isActive = selectedScene === scene.key;
                return (
                  <button
                    key={scene.key}
                    type="button"
                    className={`${styles.sceneBarPill} ${isActive ? styles.sceneBarPillActive : ''}`}
                    onClick={() => setSelectedScene(scene.key)}
                  >
                    <span className={styles.sceneBarDot}>{scene.icon}</span>
                    <span>{scene.label}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.barDivider} />

            <button
              type="button"
              className={styles.generateVideoBarBtn}
              onClick={handleGenerateVideo}
              disabled={isVideoGenerating}
            >
              <Video size={14} />
              <span>
                {isVideoGenerating
                  ? 'Generating Video...'
                  : isVideoReady
                  ? 'Video Ready (Play)'
                  : 'Generate Video'}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Shop this Look Sidebar */}
        <aside className={styles.shopSidebar}>
          {/* Header */}
          <div className={styles.shopHeaderRow}>
            <div className={styles.headerTextCol}>
              <h2 className={styles.shopTitle}>Shop this Look</h2>
              <p className={styles.shopSubtitle}>Items matched to your AI generation</p>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Matched Product Items */}
          <div className={styles.itemsList}>
            {matchedItems.map(item => {
              const isAdded = addedItems[item.id];
              return (
                <div key={item.id} className={styles.itemCard}>
                  <div className={styles.thumbWrapper}>
                    <img src={item.image} alt={item.title} className={styles.itemThumb} />
                    <span className={styles.aiGenBadge}>{item.tag}</span>
                  </div>

                  <div className={styles.itemDetails}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemPrice}>{item.priceDisplay}</span>

                    <button
                      type="button"
                      className={`${styles.itemAddToCartBtn} ${isAdded ? styles.itemAddedBtn : ''}`}
                      onClick={() => handleAddToCart(item)}
                    >
                      {isAdded ? (
                        <>
                          <Check size={13} />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <span>Add to Cart</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Checkout Summary */}
          <div className={styles.summaryFooter}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total ({matchedItems.length} items)</span>
              <span className={styles.totalAmount}>
                ${matchedItems.reduce((sum, it) => sum + it.price, 0).toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className={`${styles.addAllBtn} ${isAllAdded ? styles.addAllSuccessBtn : ''}`}
              onClick={handleAddAllToCart}
            >
              {isAllAdded ? (
                <>
                  <Check size={18} />
                  <span>All 3 Items Added to Cart!</span>
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
      </div>
    </div>
  );
}
