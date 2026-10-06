'use client';
import React from 'react';
import { Layers, Sparkles } from 'lucide-react';
import OutfitCard from './OutfitCard';
import WardrobeEmptyState from './WardrobeEmptyState';
import styles from './OutfitsTab.module.css';

export default function OutfitsTab({
  outfits,
  items,
  onOpenStyling,
  onTryOnOutfit,
  onScheduleOutfit,
  onDeleteOutfit
}) {
  if (outfits.length === 0) {
    return (
      <WardrobeEmptyState
        icon={Layers}
        title="No Saved Outfits Yet"
        subtitle="Combine your tops, bottoms, outerwear, and footwear into saved multi-piece looks using the Mix & Match styling studio."
        actionLabel="Open Mix & Match Styling"
        actionIcon={Sparkles}
        onAction={onOpenStyling}
      />
    );
  }

  return (
    <div className={styles.outfitsGrid}>
      <div className={styles.uploadCard} onClick={onOpenStyling}>
        <div className={styles.uploadCardIcon}>
          <Sparkles size={22} />
        </div>
        <span className={styles.uploadCardTitle}>Design New Outfit</span>
        <span className={styles.uploadCardSubtitle}>Mix & match pieces</span>
      </div>

      {outfits.map(outfit => (
        <OutfitCard
          key={outfit.id}
          outfit={outfit}
          items={items}
          onTryOn={onTryOnOutfit}
          onSchedule={onScheduleOutfit}
          onDelete={onDeleteOutfit}
        />
      ))}
    </div>
  );
}
