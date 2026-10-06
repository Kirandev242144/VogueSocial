'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import LookCanvas from './look/LookCanvas';
import LookShopSidebar from './look/LookShopSidebar';
import './ViewFullLookModal.css';

const MATCHED_ITEMS = [
  {
    id: 'match-1',
    title: 'Midnight Silk Evening Dress',
    price: 320.00,
    priceDisplay: '$320',
    image: '/Shop_images/3/dressblack1-1-500x750.jpeg',
    tag: 'FEATURED',
    category: 'Dress',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    defaultSize: 'M',
    modelImage: '/Shop_images/3/dressblack1-1-500x750.jpeg',
    scenes: {
      studio: '/Shop_images/3/dressblack1-1-500x750.jpeg',
      street: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=85',
      beach: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=85',
      custom: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85'
    }
  },
  {
    id: 'match-2',
    title: 'Structured Wool Blazer',
    price: 280.00,
    priceDisplay: '$280',
    image: '/Shop_images/1/basic2-500x750.jpeg',
    tag: 'OUTERWEAR',
    category: 'Blazer',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    defaultSize: 'M',
    modelImage: '/Shop_images/1/basic2-500x750.jpeg',
    scenes: {
      studio: '/Shop_images/1/basic2-500x750.jpeg',
      street: '/Shop_images/1/basic3-500x750.jpeg',
      beach: '/Shop_images/1/basic4-500x750.jpeg',
      custom: '/Shop_images/1/basic5-500x750.jpeg'
    }
  },
  {
    id: 'match-3',
    title: 'Pointed Toe Leather Ankle Boots',
    price: 450.00,
    priceDisplay: '$450',
    image: '/Shop_images/1/basic4-500x750.jpeg',
    tag: 'SHOES',
    category: 'Footwear',
    sizes: ['36', '37', '38', '39', '40', '41'],
    defaultSize: '38',
    modelImage: '/Shop_images/1/basic4-500x750.jpeg',
    scenes: {
      studio: '/Shop_images/1/basic4-500x750.jpeg',
      street: '/Shop_images/1/basic3-500x750.jpeg',
      beach: '/Shop_images/1/basic5-500x750.jpeg',
      custom: '/Shop_images/1/basic2-500x750.jpeg'
    }
  }
];

export default function ViewFullLookModal({ isOpen, onClose, lookData, onAddToCart }) {
  const [mounted, setMounted] = useState(false);
  const [selectedScene, setSelectedScene] = useState(lookData?.selectedScene || 'studio');
  const [addedItems, setAddedItems] = useState({});
  const [isAllAdded, setIsAllAdded] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Active fitted item state
  const [activeItem, setActiveItem] = useState(MATCHED_ITEMS[0]);
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState(false);
  const [generatingItem, setGeneratingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Selected sizes for each matched product (defaults to M / 38)
  const [selectedSizes, setSelectedSizes] = useState({
    'match-1': 'M',
    'match-2': 'M',
    'match-3': '38'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Sync scene when lookData changes
  useEffect(() => {
    if (lookData?.selectedScene) {
      setSelectedScene(lookData.selectedScene);
    }
    if (lookData?.currentImage) {
      const match = MATCHED_ITEMS.find(m => m.modelImage === lookData.currentImage);
      if (match) setActiveItem(match);
    }
  }, [lookData]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !lookData || !mounted || typeof document === 'undefined') return null;

  // Active scene image resolution
  const currentSceneImages = activeItem?.scenes || {
    studio: activeItem?.modelImage || lookData.currentImage,
    street: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=85',
    beach: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&q=85',
    custom: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85'
  };

  const activeImage = currentSceneImages[selectedScene] || currentSceneImages.studio;

  // Handle User Selecting a Size
  const handleSelectSize = (itemId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }));

    const item = MATCHED_ITEMS.find(it => it.id === itemId);
    if (item) {
      setToastMessage(`Selected Size ${size} for ${item.title}`);
      setTimeout(() => setToastMessage(''), 2200);

      // If already in cart, update cart item
      if (addedItems[itemId] && onAddToCart) {
        onAddToCart({ ...item, selectedSize: size });
      }
    }
  };

  // Handler for Dropping or Clicking Try-On for a Garment
  const handleTryOnGarment = (item) => {
    if (isGeneratingTryOn) return;
    if (activeItem.id === item.id) {
      setToastMessage(`Already wearing ${item.title}`);
      setTimeout(() => setToastMessage(''), 2200);
      return;
    }

    setGeneratingItem(item);
    setIsGeneratingTryOn(true);
    setToastMessage(`Fitting ${item.title} onto model with OmniTry AI...`);

    setTimeout(() => {
      setActiveItem(item);
      setIsGeneratingTryOn(false);
      setGeneratingItem(null);
      setToastMessage(`✓ ${item.title} draped successfully onto model!`);
      setTimeout(() => setToastMessage(''), 3000);
    }, 1300);
  };

  // Add Item to Cart with Selected Size
  const handleAddToCart = (item) => {
    const chosenSize = selectedSizes[item.id] || item.defaultSize;
    const itemWithSize = { ...item, selectedSize: chosenSize };

    setAddedItems((prev) => {
      const nextState = !prev[item.id];
      if (nextState && onAddToCart) {
        onAddToCart(itemWithSize);
        setToastMessage(`✓ Added ${item.title} (Size ${chosenSize}) to cart!`);
        setTimeout(() => setToastMessage(''), 3000);
      }
      return {
        ...prev,
        [item.id]: nextState
      };
    });
  };

  // Add All Items to Cart with Their Respective Selected Sizes
  const handleAddAllToCart = () => {
    const all = {};
    MATCHED_ITEMS.forEach((item) => {
      all[item.id] = true;
      const chosenSize = selectedSizes[item.id] || item.defaultSize;
      if (onAddToCart) {
        onAddToCart({ ...item, selectedSize: chosenSize });
      }
    });
    setAddedItems(all);
    setIsAllAdded(true);
    setToastMessage('✓ All 3 items added to cart with your selected sizes!');
    setTimeout(() => {
      setIsAllAdded(false);
      setToastMessage('');
    }, 3500);
  };

  const handleGenerateVideo = () => {
    setIsVideoGenerating(true);
    setTimeout(() => {
      setIsVideoGenerating(false);
      setIsVideoReady(true);
    }, 1800);
  };

  return createPortal(
    <div className="full-look-overlay" onClick={onClose}>
      <div className="full-look-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Left Column: Interactive Visual Model Canvas with Drag & Drop */}
        <LookCanvas
          activeImage={activeImage}
          selectedScene={selectedScene}
          onSelectScene={setSelectedScene}
          onGenerateVideo={handleGenerateVideo}
          isVideoGenerating={isVideoGenerating}
          isVideoReady={isVideoReady}
          onAddItems={() => alert("Add Items palette: layer jewelry, jackets, or accessories.")}
          onRefineFit={() => alert("Refine Fit: adjusting waist drape and shoulder calibration.")}
          isGeneratingTryOn={isGeneratingTryOn}
          generatingItem={generatingItem}
          toastMessage={toastMessage}
          onDropItem={handleTryOnGarment}
        />

        {/* Right Column: Shop this Look Sidebar with Size Selection */}
        <LookShopSidebar
          matchedItems={MATCHED_ITEMS}
          addedItems={addedItems}
          selectedSizes={selectedSizes}
          onSelectSize={handleSelectSize}
          onAddToCart={handleAddToCart}
          onAddAllToCart={handleAddAllToCart}
          isAllAdded={isAllAdded}
          onClose={onClose}
          activeItem={activeItem}
          onTryOnItem={handleTryOnGarment}
        />
      </div>
    </div>,
    document.body
  );
}
