'use client';
import React, { useState } from 'react';
import styles from './ShopSidebar.module.css';
import { CHARACTERS, CATEGORIES, SIZES } from '@/lib/shopData';
import CharacterSelector from './CharacterSelector';
import CategoryFilter from './CategoryFilter';
import SizeFilter from './SizeFilter';
import PriceFilter from './PriceFilter';

export default function ShopSidebar({
  selectedCharacter,
  onSelectCharacter,
  selectedCategories,
  onToggleCategory,
  selectedSizes,
  onToggleSize,
  priceRange,
  onChangePriceRange
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    size: true,
    price: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className={styles.sidebar}>
      {/* 1. Character Selection */}
      <CharacterSelector
        characters={CHARACTERS}
        selectedCharacter={selectedCharacter}
        onSelectCharacter={onSelectCharacter}
      />

      {/* 2. Category Filter */}
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategories={selectedCategories}
        onToggleCategory={onToggleCategory}
        isOpen={openSections.category}
        onToggleOpen={() => toggleSection('category')}
      />

      {/* 3. Size Filter */}
      <SizeFilter
        sizes={SIZES}
        selectedSizes={selectedSizes}
        onToggleSize={onToggleSize}
        isOpen={openSections.size}
        onToggleOpen={() => toggleSection('size')}
      />

      {/* 4. Price Filter */}
      <PriceFilter
        priceRange={priceRange}
        onChangePriceRange={onChangePriceRange}
        isOpen={openSections.price}
        onToggleOpen={() => toggleSection('price')}
      />
    </aside>
  );
}
