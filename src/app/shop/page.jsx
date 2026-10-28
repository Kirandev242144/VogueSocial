'use client';
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ShopSidebar from '@/components/shop/ShopSidebar';
import ShopHeaderPrompt from '@/components/shop/ShopHeaderPrompt';
import ShopProductGrid from '@/components/shop/ShopProductGrid';
import AiStylistPanel from '@/components/shop/AiStylistPanel';
import styles from './page.module.css';
import { SHOP_PRODUCTS } from '@/lib/shopData';
import { useCart } from '@/context/CartContext';

export default function ShopPage() {
  const { addToCart } = useCart();
  const [selectedCharacter, setSelectedCharacter] = useState('you');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState(500);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('suggested'); // 'suggested' | 'trending' | 'new_arrivals'
  const [sortBy, setSortBy] = useState('featured');

  // In-chat Try-On Request State (No popup modal!)
  const [tryOnRequest, setTryOnRequest] = useState(null);

  // Synchronized catalog products directly from curated shop dataset (zero database latency)
  const allShopProducts = SHOP_PRODUCTS;

  const handleToggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleToggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Direct in-chat Try-On trigger (replaces popup modal)
  const handleTriggerInChatTryOn = (product) => {
    setTryOnRequest({
      ...product,
      triggerTime: Date.now()
    });
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return allShopProducts.filter((prod) => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prod.name.toLowerCase().includes(q);
        const matchCat = prod.category.toLowerCase().includes(q);
        if (!matchTitle && !matchCat) return false;
      }

      // 2. Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(prod.category)) return false;
      }

      // 3. Size filter
      if (selectedSizes.length > 0) {
        const hasSize = prod.sizes.some(s => selectedSizes.includes(s));
        if (!hasSize) return false;
      }

      // 4. Price filter
      if (prod.price > priceRange) return false;

      // 5. Tab filter
      if (activeTab === 'trending' && !prod.isTrending) return false;
      if (activeTab === 'new_arrivals' && !prod.isNew) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [allShopProducts, searchQuery, selectedCategories, selectedSizes, priceRange, activeTab, sortBy]);

  return (
    <div className={styles.shopWrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        {/* LEFT COLUMN: Sidebar Filters & Character Selection */}
        <ShopSidebar
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
          selectedSizes={selectedSizes}
          onToggleSize={handleToggleSize}
          priceRange={priceRange}
          onChangePriceRange={setPriceRange}
        />

        {/* CENTER COLUMN: Styling Search Hero + Product Catalog */}
        <section className={styles.centerColumn}>
          <ShopHeaderPrompt
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={(query) => setSearchQuery(query)}
            onSelectPrompt={(prompt) => setSearchQuery(prompt)}
          />

          <ShopProductGrid
            products={filteredProducts}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onTryOn={handleTriggerInChatTryOn}
          />
        </section>

        {/* RIGHT COLUMN: Interactive AI Stylist Personal Assistant */}
        <AiStylistPanel
          tryOnRequest={tryOnRequest}
          selectedCharacter={selectedCharacter}
          onAddToCart={addToCart}
        />
      </main>
    </div>
  );
}
