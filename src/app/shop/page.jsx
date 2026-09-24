'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ShopSidebar from '@/components/shop/ShopSidebar';
import ShopHeaderPrompt from '@/components/shop/ShopHeaderPrompt';
import ShopProductGrid from '@/components/shop/ShopProductGrid';
import AiStylistPanel from '@/components/shop/AiStylistPanel';
import styles from './page.module.css';
import { SHOP_PRODUCTS } from '@/lib/shopData';
import { productService } from '@/services';

export default function ShopPage() {
  const [selectedCharacter, setSelectedCharacter] = useState('you');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState(500);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('suggested'); // 'suggested' | 'trending' | 'new_arrivals'
  const [sortBy, setSortBy] = useState('featured');
  const [dbProducts, setDbProducts] = useState([]);

  // In-chat Try-On Request State (No popup modal!)
  const [tryOnRequest, setTryOnRequest] = useState(null);

  // Fetch dynamic products on load
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getPublicProducts();
        if (data && data.success && Array.isArray(data.products)) {
          setDbProducts(data.products);
        }
      } catch (err) {
        console.warn('Could not load dynamic shop products:', err);
      }
    };
    loadProducts();
  }, []);

  // Format dynamic DB products to match Shop Product schema
  const formattedDbProducts = useMemo(() => {
    return dbProducts.map(p => {
      const priceNum = typeof p.price === 'number' ? p.price : Number(p.price) || 59.99;
      const rawCat = (p.category || 'tops').toLowerCase();
      let cat = 'tops';
      if (rawCat.includes('dress')) cat = 'dresses';
      else if (rawCat.includes('bottom') || rawCat.includes('pant') || rawCat.includes('trouser') || rawCat.includes('skirt')) cat = 'bottoms';
      else if (rawCat.includes('outer') || rawCat.includes('coat') || rawCat.includes('jacket') || rawCat.includes('trench')) cat = 'outerwear';
      else if (rawCat.includes('shoe') || rawCat.includes('heel') || rawCat.includes('boot')) cat = 'shoes';
      else if (rawCat.includes('bag') || rawCat.includes('access')) cat = 'accessories';

      return {
        id: p.id,
        name: p.name,
        brand: p.vendorName || p.storeName || (p.targetAudience === 'Men' ? 'Mens Edit' : 'Studio Label Paris'),
        category: cat,
        price: priceNum,
        priceDisplay: `$${priceNum.toFixed(2)}`,
        rating: 4.9,
        reviewsCount: 24,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        image: p.imageUrl || p.image_url || '/Shop_images/1/basic2-500x750.jpeg',
        secondaryImage: p.backImageUrl || p.back_image_url || p.imageUrl || '/Shop_images/1/basic3-500x750.jpeg',
        colors: ['#1e293b', '#e2e8f0'],
        isTrending: true,
        isNew: true,
        fitNote: 'Verified fit · True to size',
        badge: 'NEW DROP'
      };
    });
  }, [dbProducts]);

  // Synchronized catalog products from MySQL (fallback to static SHOP_PRODUCTS)
  const allShopProducts = useMemo(() => {
    if (formattedDbProducts.length > 0) {
      return formattedDbProducts;
    }
    return SHOP_PRODUCTS;
  }, [formattedDbProducts]);

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
        />
      </main>
    </div>
  );
}
