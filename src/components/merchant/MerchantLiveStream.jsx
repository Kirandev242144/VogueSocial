"use client";
import React from 'react';
import styles from '@/app/merchant/merchant.module.css';
import { Activity, ShoppingBag, CheckCircle2, Heart } from 'lucide-react';

const LIVE_FITTING_STREAM = [
  {
    id: 1,
    shopper: 'Customer in Milan, IT',
    time: 'Just now',
    action: 'Tried Structured Double-Breasted Trench (Size M, Preset Female 01)',
    badge: 'Added to Cart',
    badgeClass: styles.badgeCart,
    icon: ShoppingBag
  },
  {
    id: 2,
    shopper: 'Customer in New York, US',
    time: '3m ago',
    action: 'Completed Try-On for Silk Charmeuse Dress with Custom Photo Upload',
    badge: 'Checked Out · $340',
    badgeClass: styles.badgeCheckout,
    icon: CheckCircle2
  },
  {
    id: 3,
    shopper: 'Customer in London, UK',
    time: '7m ago',
    action: 'Tried Italian Wool Pleated Trouser (Size 32, Preset Male 01)',
    badge: 'Added to Cart',
    badgeClass: styles.badgeCart,
    icon: ShoppingBag
  },
  {
    id: 4,
    shopper: 'Customer in Tokyo, JP',
    time: '12m ago',
    action: 'Tried Sculpted Leather Biker Jacket (Size S, Preset Female 02)',
    badge: 'Saved to Wishlist',
    badgeClass: styles.badgeWishlist,
    icon: Heart
  },
  {
    id: 5,
    shopper: 'Customer in Paris, FR',
    time: '18m ago',
    action: 'Tried Minimalist Relaxed Cashmere Knit with Custom Photo Upload',
    badge: 'Checked Out · $290',
    badgeClass: styles.badgeCheckout,
    icon: CheckCircle2
  },
];

export default function MerchantLiveStream() {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>
          <Activity size={17} />
          <span>Live Try-On Activity</span>
        </div>
        <div className={styles.liveFeedHeader}>
          <span className={styles.liveFeedPulse} />
          <span>LIVE</span>
        </div>
      </div>

      <div className={styles.activityListWrap}>
        {LIVE_FITTING_STREAM.map((ev) => {
          const Icon = ev.icon;
          return (
            <div key={ev.id} className={styles.activityCard}>
              <div className={styles.activityAvatar}>
                <Icon size={16} />
              </div>
              <div className={styles.activityContent}>
                <div className={styles.activityTopRow}>
                  <span className={styles.activityShopper}>{ev.shopper}</span>
                  <span className={styles.activityTime}>{ev.time}</span>
                </div>
                <div className={styles.activityDesc}>{ev.action}</div>
                <span className={`${styles.activityActionBadge} ${ev.badgeClass}`}>
                  {ev.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
