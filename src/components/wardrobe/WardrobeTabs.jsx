'use client';
import React from 'react';
import { Shirt, Layers, Calendar, Luggage } from 'lucide-react';
import styles from './WardrobeTabs.module.css';

export default function WardrobeTabs({ activeTab, onSelectTab, clothesCount, outfitsCount }) {
  return (
    <div className={styles.tabsRow}>
      <button
        className={`${styles.tabBtn} ${activeTab === 'clothes' ? styles.tabBtnActive : ''}`}
        onClick={() => onSelectTab('clothes')}
      >
        <Shirt size={14} />
        <span>My Clothes ({clothesCount})</span>
      </button>

      <button
        className={`${styles.tabBtn} ${activeTab === 'outfits' ? styles.tabBtnActive : ''}`}
        onClick={() => onSelectTab('outfits')}
      >
        <Layers size={14} />
        <span>Outfits ({outfitsCount})</span>
      </button>

      <button
        className={`${styles.tabBtn} ${activeTab === 'calendar' ? styles.tabBtnActive : ''}`}
        onClick={() => onSelectTab('calendar')}
      >
        <Calendar size={14} />
        <span>Calendar</span>
      </button>

      <button
        className={`${styles.tabBtn} ${activeTab === 'planner' ? styles.tabBtnActive : ''}`}
        onClick={() => onSelectTab('planner')}
      >
        <Luggage size={14} />
        <span>Trip Planner</span>
      </button>
    </div>
  );
}
