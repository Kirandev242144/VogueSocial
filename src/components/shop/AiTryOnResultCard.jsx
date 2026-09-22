'use client';
import React from 'react';
import { Sparkles, Maximize2, Video, ShoppingBag } from 'lucide-react';
import styles from './AiStylistPanel.module.css';

export default function AiTryOnResultCard({
  msgId,
  tryOnResult,
  onSelectScene,
  onGenerateVideo,
  onViewFullLook,
  onAddToCart
}) {
  const scenes = [
    { key: 'studio', label: 'Studio', icon: '●' },
    { key: 'street', label: 'Street', icon: '●' },
    { key: 'beach', label: 'Beach', icon: '●' },
    { key: 'custom', label: 'Custom', icon: '✨' }
  ];

  return (
    <div className={styles.tryOnResultWrapper}>
      {/* Top Meta Bar */}
      <div className={styles.tryOnTopMetaRow}>
        <span className={styles.resultBadgeTag}>
          <Sparkles size={12} />
          <span>AI Stylist Result</span>
        </span>
        <button
          type="button"
          className={styles.viewFullLookLink}
          onClick={() => onViewFullLook(tryOnResult)}
        >
          <Maximize2 size={12} />
          <span>View Full Look</span>
        </button>
      </div>

      {/* High-res Rendered Model Image */}
      <div className={styles.tryOnImageCard}>
        <img
          src={tryOnResult.currentImage}
          alt={tryOnResult.productName}
          className={styles.tryOnRenderedImg}
        />
        <div className={styles.aiStylistPurpleBadge}>
          AI Stylist
        </div>
      </div>

      {/* Scene Selector Pills (Studio, Street, Beach, Custom) */}
      <div className={styles.sceneSelectorRow}>
        {scenes.map((scene) => {
          const isActive = tryOnResult.selectedScene === scene.key;
          return (
            <button
              key={scene.key}
              type="button"
              className={`${styles.scenePill} ${isActive ? styles.scenePillActive : ''}`}
              onClick={() => onSelectScene(msgId, scene.key)}
            >
              <span className={styles.sceneDot}>{scene.icon}</span>
              <span>{scene.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dual Action Buttons: Generate Video & Shop Outfit */}
      <div className={styles.tryOnActionsRow}>
        <button
          type="button"
          className={styles.generateVideoBtn}
          onClick={() => onGenerateVideo(msgId)}
          disabled={tryOnResult.isVideoGenerating}
        >
          <Video size={16} />
          <span>
            {tryOnResult.isVideoGenerating
              ? 'Generating Video...'
              : tryOnResult.isVideoReady
              ? 'Video Ready (Play)'
              : 'Generate Video'}
          </span>
        </button>

        <button
          type="button"
          className={styles.shopOutfitBtn}
          onClick={() => {
            if (onAddToCart) {
              onAddToCart({
                name: tryOnResult.productName,
                price: tryOnResult.price,
                image: tryOnResult.currentImage
              });
            } else {
              alert(`✓ ${tryOnResult.productName} added to cart!`);
            }
          }}
        >
          <ShoppingBag size={16} />
          <span>Shop Outfit</span>
        </button>
      </div>
    </div>
  );
}
