'use client';
import React from 'react';
import { Search, Mic } from 'lucide-react';
import styles from './ShopHeaderPrompt.module.css';
import { POPULAR_PROMPTS } from '@/lib/shopData';

export default function ShopHeaderPrompt({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectPrompt
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(searchQuery);
  };

  return (
    <div className={styles.heroPromptSection}>
      <h1 className={styles.headline}>What are we styling today?</h1>

      <form className={styles.searchBarForm} onSubmit={handleSubmit}>
        <Search size={18} className={styles.searchIconLeading} />
        <input
          type="text"
          placeholder="Search for clothing, describe your style, or ask for recommendations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.promptInput}
        />
        <button
          type="button"
          className={styles.micBtn}
          title="Voice Search"
          aria-label="Voice Search"
        >
          <Mic size={18} />
        </button>
        <button
          type="submit"
          className={styles.submitSearchBtn}
          aria-label="Submit search"
        >
          <Search size={16} />
        </button>
      </form>

      <div className={styles.popularRow}>
        <span className={styles.popularLabel}>POPULAR:</span>
        {POPULAR_PROMPTS.map((prompt, idx) => (
          <button
            key={prompt}
            type="button"
            className={styles.popularTagBtn}
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
            {idx < POPULAR_PROMPTS.length - 1 && <span className={styles.comma}>,</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
