'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'vogue_social_cart_v1';

export function parsePrice(price) {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  const cleaned = String(price).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPrice(num) {
  return `$${Number(num).toFixed(2)}`;
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState(null);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  const addToCart = (product, size = 'M', quantity = 1, autoOpen = true) => {
    if (!product) return;

    const priceNum = parsePrice(product.price);
    const chosenSize = size || 'M';
    const chosenQty = Math.max(1, Number(quantity) || 1);
    const cartItemId = `${product.id || product.productName || 'item'}-${chosenSize}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + chosenQty
        };
        return next;
      }

      const newItem = {
        cartItemId,
        id: product.id || String(Date.now()),
        name: product.name || product.productName || product.title || 'Designer Garment',
        brand: product.brand || product.author || product.vendorName || 'Studio Label Paris',
        price: priceNum,
        priceDisplay: formatPrice(priceNum),
        image: product.image || product.imageUrl || (product.images && product.images[0]) || '/Shop_images/1/basic2-500x750.jpeg',
        size: chosenSize,
        quantity: chosenQty,
        category: product.category || 'tops'
      };
      return [...prev, newItem];
    });

    if (autoOpen) {
      setIsCartOpen(true);
    }

    setCartToast(`Added ${product.name || product.productName || 'Item'} (${chosenSize}) to bag`);
    setTimeout(() => setCartToast(null), 3000);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQty) => {
    const qty = Number(newQty);
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity: qty } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen(prev => !prev);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        cartToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
export default CartContext;
