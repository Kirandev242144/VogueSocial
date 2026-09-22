"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Minus,
  Plus,
  ArrowLeft,
  Check,
  Lock,
  Share2,
  Heart,
  X,
  Trash2,
  Ruler,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Info
} from 'lucide-react';
import styles from '../../store.module.css';
import TryOnModal from '@/components/TryOnModal';
import { getStoreByHandle, STORE_PRODUCTS } from '@/lib/storefrontData';

const TEMPLATES = {
  minimal: `--bg: #FFFFFF; --bg2: #F9F7F4; --surface: #FFFFFF; --border: #E8E4DE; --text1: #1A1A1A; --text2: #4A4A4A; --text3: #8A8A8A; --accent: #1A1A1A; --accent-text: #FFFFFF; --btn-radius: 0px; --card-radius: 0px; --font-heading: 'Cormorant Garamond', serif; --font-body: 'Jost', sans-serif;`,
  luxury: `--bg: #1C1C1E; --bg2: #242426; --surface: #2A2A2C; --border: #3A3A3C; --text1: #C9A84C; --text2: #E8E8E8; --text3: #888888; --accent: #C9A84C; --accent-text: #1C1C1E; --btn-radius: 0px; --card-radius: 4px; --font-heading: 'Playfair Display', serif; --font-body: 'Montserrat', sans-serif;`,
  streetwear: `--bg: #0A0A0A; --bg2: #111111; --surface: #1A1A1A; --border: #2A2A2A; --text1: #FFFFFF; --text2: #CCCCCC; --text3: #666666; --accent: #CCFF00; --accent-text: #0A0A0A; --btn-radius: 0px; --card-radius: 0px; --font-heading: 'Barlow Condensed', sans-serif; --font-body: 'Barlow', sans-serif;`,
  modern: `--bg: #F8F9FF; --bg2: #FFFFFF; --surface: #FFFFFF; --border: #E8EAFF; --text1: #1E1B4B; --text2: #3730A3; --text3: #6366F1; --accent: #4F46E5; --accent-text: #FFFFFF; --btn-radius: 10px; --card-radius: 16px; --font-heading: 'Plus Jakarta Sans', sans-serif; --font-body: 'Inter', sans-serif;`,
  boutique: `--bg: #FAF7F2; --bg2: #F5EFE8; --surface: #FFFFFF; --border: #EAE0D5; --text1: #2C1810; --text2: #5C3D2E; --text3: #9B7E6E; --accent: #C47E6B; --accent-text: #FFFFFF; --btn-radius: 24px; --card-radius: 12px; --font-heading: 'Libre Baskerville', serif; --font-body: 'Nunito', sans-serif;`,
};

const COLOR_HEX_MAP = {
  'obsidian black': '#111827',
  'black': '#0a0a0a',
  'jet black': '#0f172a',
  'camel': '#c19a6b',
  'stone grey': '#9ca3af',
  'grey': '#9ca3af',
  'heather grey': '#94a3b8',
  'charcoal grey': '#374151',
  'charcoal': '#374151',
  'cream white': '#f5f5dc',
  'cream': '#fdfbf7',
  'white': '#ffffff',
  'champagne': '#f7e7ce',
  'midnight navy': '#0f172a',
  'deep navy': '#1e293b',
  'navy': '#1e3a8a',
  'emerald': '#047857',
  'green': '#15803d',
  'oatmeal': '#e6d7b9',
  'muted olive': '#556b2f',
  'olive': '#65a30d',
  'vintage cognac': '#9e4714',
  'cognac': '#a16207',
  'burgundy': '#800020',
  'rose': '#fda4af',
  'pink': '#f472b6',
  'blue': '#2563eb',
  'brown': '#78350f',
  'beige': '#f5f5dc',
  'tan': '#d2b48c',
  'khaki': '#c3b091',
};

function getColorHex(colorName) {
  if (!colorName) return '#334155';
  if (colorName.startsWith('#')) return colorName;
  const lower = colorName.toLowerCase().trim();
  return COLOR_HEX_MAP[lower] || '#475569';
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

const DEFAULT_REVIEWS = [
  {
    id: 1,
    author: 'Camille Laurent',
    location: 'Paris, FR',
    rating: 5,
    date: '3 days ago',
    size: 'Size S',
    fit: 'True to size',
    title: 'Virtual try-on was 100% accurate, magnificent drape',
    comment: 'I tested the AI fitting room before ordering. The waist and shoulder fit rendered identically in real life. The fabric weight and finishing are pure couture quality.'
  },
  {
    id: 2,
    author: 'Julian Vance',
    location: 'London, UK',
    rating: 5,
    date: '1 week ago',
    size: 'Size M',
    fit: 'True to size',
    title: 'Exquisite tailoring & lightning fast shipping',
    comment: 'Arrived beautifully presented in an archival dust bag. Clean proportions and sharp architectural drape. Will definitely order again.'
  },
  {
    id: 3,
    author: 'Elena Rostova',
    location: 'Milan, IT',
    rating: 5,
    date: '2 weeks ago',
    size: 'Size S',
    fit: 'True to size',
    title: 'Sublime material and luxurious feel',
    comment: 'The textile feels incredibly soft yet structured. Perfect piece for day-to-evening transitions.'
  }
];

export default function ProductPage() {
  const routeParams = useParams();
  const handle = routeParams.handle || 'studiolabel';
  const id = routeParams.id || '';
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  // Modals & Drawers
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideUnit, setSizeGuideUnit] = useState('cm'); // 'cm' or 'in'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // Cart state persisted
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(`vogue_cart_${handle}`);
      return stored ? JSON.parse(stored) : { items: [] };
    } catch (e) {
      return { items: [] };
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Wishlist & Share state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Reviews state
  const [reviews, setReviews] = useState(DEFAULT_REVIEWS);
  const [newReviewForm, setNewReviewForm] = useState({
    author: '',
    rating: 5,
    fit: 'True to size',
    size: 'Size M',
    title: '',
    comment: ''
  });

  // Active accordion tabs
  const [activeAccordion, setActiveAccordion] = useState('desc');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync cart to localStorage
  useEffect(() => {
    if (handle) {
      try {
        localStorage.setItem(`vogue_cart_${handle}`, JSON.stringify(cart));
      } catch (e) {}
    }
  }, [cart, handle]);

  // Check wishlist initial state
  useEffect(() => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem('vogue_wishlist') || '[]');
      if (product && savedWishlist.includes(product.id)) {
        setIsWishlisted(true);
      } else {
        setIsWishlisted(false);
      }
    } catch (e) {}
  }, [product]);

  // Fetch store and product
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let storeData = null;
        let productList = [];

        try {
          const res = await fetch(`/api/store/${handle}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.store) {
              storeData = data.store;
              productList = data.products || [];
            }
          }
        } catch (e) {
          console.warn('Backend storefront fetch failed, falling back to local data', e);
        }

        if (!storeData) {
          const local = getStoreByHandle(handle);
          storeData = local.store;
          productList = local.products || STORE_PRODUCTS;
        }

        if (storeData) {
          setStore(storeData);
          
          // Match product by id or fallback to first product
          const found = productList.find(
            (x) => String(x.id).toLowerCase() === String(id).toLowerCase() || x.id == id
          ) || productList[0];

          if (found) {
            setProduct(found);
            const initialImg = found.image_url || found.imageUrl || found.main_image || found.images?.[0];
            setActiveImage(initialImg);

            const colors = found.colors || ['Obsidian Black', 'Camel', 'Cream White'];
            if (colors.length) setSelectedColor(colors[0]);

            const sizes = found.sizes || ['XS', 'S', 'M', 'L', 'XL'];
            if (sizes.length) setSelectedSize(sizes[0]);

            setOtherProducts(productList.filter((x) => String(x.id) !== String(found.id)).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Error in ProductPage fetchData:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [handle, id]);

  const cartItemCount = useMemo(() => {
    return (cart.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return (cart.items || []).reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  }, [cart]);

  const finalTotal = useMemo(() => {
    const discount = discountApplied ? cartSubtotal * 0.20 : 0;
    return Math.max(0, cartSubtotal - discount);
  }, [cartSubtotal, discountApplied]);

  const handleAddToCart = () => {
    if (!product) return;
    const price = product.sale_price || product.salePrice || product.price;
    const img = product.image_url || product.imageUrl || activeImage;

    setCart((prev) => {
      const items = [...(prev.items || [])];
      const existingIndex = items.findIndex(
        (item) => item.productId === product.id && item.color === selectedColor && item.size === selectedSize
      );

      if (existingIndex > -1) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({
          productId: product.id,
          name: product.name,
          price: Number(price),
          image: img,
          color: selectedColor || 'Default',
          size: selectedSize || 'M',
          quantity: quantity,
        });
      }
      return { items };
    });

    showToast(`Added ${quantity}x ${product.name} (${selectedSize} / ${selectedColor}) to your bag`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (index, delta) => {
    setCart((prev) => {
      const items = [...prev.items];
      const newQty = (items[index].quantity || 1) + delta;
      if (newQty <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = newQty;
      }
      return { items };
    });
  };

  const handleRemoveCartItem = (index) => {
    setCart((prev) => {
      const items = [...prev.items];
      items.splice(index, 1);
      return { items };
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    try {
      let saved = JSON.parse(localStorage.getItem('vogue_wishlist') || '[]');
      if (saved.includes(product.id)) {
        saved = saved.filter((x) => x !== product.id);
        setIsWishlisted(false);
        showToast('Removed from your saved pieces');
      } else {
        saved.push(product.id);
        setIsWishlisted(true);
        showToast('Saved to your private wishlist');
      }
      localStorage.setItem('vogue_wishlist', JSON.stringify(saved));
    } catch (e) {}
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product URL copied to clipboard');
    } else {
      showToast('Link ready to share');
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewForm.author || !newReviewForm.comment) return;
    const newEntry = {
      id: Date.now(),
      author: newReviewForm.author,
      location: 'Verified Buyer',
      rating: Number(newReviewForm.rating),
      date: 'Just now',
      size: newReviewForm.size,
      fit: newReviewForm.fit,
      title: newReviewForm.title || 'Exceptional craftsmanship',
      comment: newReviewForm.comment
    };
    setReviews([newEntry, ...reviews]);
    setIsWriteReviewOpen(false);
    setNewReviewForm({
      author: '',
      rating: 5,
      fit: 'True to size',
      size: 'Size M',
      title: '',
      comment: ''
    });
    showToast('Thank you! Your verified review has been published.');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading garment & fitting room...</p>
        </div>
      </div>
    );
  }

  if (!product || !store) {
    return (
      <div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundTitle}>Product Not Found</h1>
        <p className={styles.notFoundText}>
          The requested garment is currently unavailable or has been archived.
        </p>
        <Link to={`/store/${handle}`} className={styles.notFoundBtn}>
          Return to Storefront
        </Link>
      </div>
    );
  }

  const templateName = store.template || 'modern';
  let cssVars = TEMPLATES[templateName] || TEMPLATES.modern;
  if (store.accent_color) {
    const rgb = hexToRgb(store.accent_color);
    let accentText = '#FFFFFF';
    if (rgb) {
      const lum = getLuminance(rgb.r, rgb.g, rgb.b);
      if (lum > 0.5) accentText = '#000000';
    }
    cssVars += ` --accent: ${store.accent_color}; --accent-text: ${accentText};`;
  }

  const mainImg = product.image_url || product.imageUrl || product.main_image || '/placeholder-product.jpg';
  const backImg = product.back_image_url || product.backImageUrl;
  const extraImgs = product.additional_images || product.images || [];
  const images = Array.from(new Set([mainImg, backImg, ...extraImgs].filter(Boolean)));

  const productPrice = product.sale_price || product.salePrice || product.price;
  const originalPrice = (product.sale_price || product.salePrice) ? product.price : null;
  const productColors = product.colors && product.colors.length > 0 ? product.colors : ['Obsidian Black', 'Camel', 'Cream White'];
  const productSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL'];
  const stockCount = product.stock_count || product.stock || 24;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg)',
        color: 'var(--text2)',
        fontFamily: 'var(--font-body)',
        minHeight: '100vh',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Jost:wght@400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
          ${cssVars}
        }

        .compact-header {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.1rem 2.5rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }

        .header-logo-link {
          text-decoration: none;
          color: var(--text1);
          font-family: var(--font-heading);
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-logo-link:hover {
          color: var(--accent);
        }

        .header-nav-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .header-icon-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text1);
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.15s;
        }

        .header-icon-btn:hover {
          background: var(--bg2);
          transform: scale(1.05);
        }

        .cart-count-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: var(--accent);
          color: var(--accent-text);
          font-size: 0.7rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        .main-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 2.5rem 6rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text3);
          margin-bottom: 2.25rem;
        }

        .breadcrumb a {
          text-decoration: none;
          color: var(--text3);
          transition: color 0.2s;
        }

        .breadcrumb a:hover {
          color: var(--accent);
        }

        .details-wrapper {
          display: flex;
          gap: 4rem;
          align-items: flex-start;
        }

        @media (max-width: 900px) {
          .details-wrapper {
            flex-direction: column;
            gap: 2.5rem;
          }
        }

        .left-gallery {
          width: 52%;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        @media (max-width: 900px) {
          .left-gallery {
            width: 100%;
          }
        }

        .main-image-box {
          position: relative;
          aspect-ratio: 3/4;
          width: 100%;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--card-radius);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .main-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .main-image-box:hover img {
          transform: scale(1.03);
        }

        .image-tryon-overlay {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 99px;
          padding: 0.5rem 1.1rem;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }

        .image-tryon-overlay:hover {
          background: #4f46e5;
          transform: translateY(-2px);
        }

        .thumbnail-strip {
          display: flex;
          gap: 0.85rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .thumbnail-item {
          width: 76px;
          height: 98px;
          border-radius: var(--card-radius);
          border: 1.5px solid var(--border);
          overflow: hidden;
          cursor: pointer;
          background: var(--surface);
          opacity: 0.7;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .thumbnail-item:hover, .thumbnail-item-active {
          opacity: 1;
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .thumbnail-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-info {
          width: 48%;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 900px) {
          .right-info {
            width: 100%;
          }
        }

        .product-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .tag-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.3rem 0.75rem;
          background: var(--bg2);
          color: var(--text1);
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .tag-badge-highlight {
          background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(168,85,247,0.12) 100%);
          color: #6366f1;
          border: 1px solid rgba(99,102,241,0.25);
        }

        .product-title {
          font-family: var(--font-heading);
          font-size: 2.35rem;
          font-weight: 800;
          line-height: 1.18;
          color: var(--text1);
          margin: 0.5rem 0 1rem;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.86rem;
          color: var(--text2);
          margin-bottom: 1.5rem;
        }

        .stars-gold {
          display: flex;
          align-items: center;
          gap: 2px;
          color: #f59e0b;
        }

        .price-box {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: baseline;
          gap: 0.85rem;
        }

        .price-curr-sale {
          color: var(--accent);
        }

        .price-curr-normal {
          color: var(--text1);
        }

        .price-old {
          text-decoration: line-through;
          color: var(--text3);
          font-size: 1.25rem;
          font-weight: 500;
        }

        .savings-pill {
          font-size: 0.72rem;
          font-weight: 800;
          background: #dcfce7;
          color: #166534;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
        }

        .stock-indicator {
          margin-bottom: 1.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #166534;
          background: #f0fdf4;
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          width: max-content;
        }

        .stock-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
        }

        .selector-block {
          margin-bottom: 1.75rem;
        }

        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .selector-label {
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text1);
          letter-spacing: 0.08em;
        }

        .size-guide-btn {
          background: none;
          border: none;
          color: var(--text2);
          font-size: 0.78rem;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .size-guide-btn:hover {
          color: var(--accent);
        }

        .color-selector {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .color-swatch-wrapper {
          position: relative;
          cursor: pointer;
        }

        .color-swatch {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 2px solid rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-swatch-active {
          box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent);
        }

        .size-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .size-btn {
          padding: 0.75rem 1.4rem;
          border: 1.5px solid var(--border);
          background: transparent;
          color: var(--text1);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: var(--btn-radius);
          transition: all 0.2s;
          min-width: 52px;
          text-align: center;
        }

        .size-btn:hover {
          border-color: var(--text1);
          background: var(--bg2);
        }

        .size-btn-active {
          background: var(--accent) !important;
          color: var(--accent-text) !important;
          border-color: var(--accent) !important;
        }

        .qty-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--border);
          border-radius: var(--btn-radius);
          background: var(--surface);
        }

        .qty-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.65rem 1.1rem;
          color: var(--text1);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .qty-btn:hover {
          background: var(--bg2);
        }

        .qty-val {
          width: 44px;
          text-align: center;
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--text1);
        }

        .action-button-grid {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 2rem;
        }

        .cart-add-btn {
          width: 100%;
          background: var(--accent);
          color: var(--accent-text);
          border: none;
          border-radius: var(--btn-radius);
          padding: 1.15rem;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }

        .cart-add-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .tryon-magic-btn {
          width: 100%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
          color: #ffffff;
          border: none;
          border-radius: var(--btn-radius);
          padding: 1.15rem;
          font-size: 1.02rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
          transition: all 0.2s;
        }

        .tryon-magic-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.45);
        }

        .secondary-actions-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .secondary-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8rem;
          border: 1px solid var(--border);
          border-radius: var(--btn-radius);
          background: transparent;
          color: var(--text2);
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-btn:hover {
          background: var(--bg2);
          color: var(--text1);
        }

        .secondary-btn-active {
          color: #e11d48;
          border-color: #fecdd3;
          background: #fff1f2;
        }

        /* Value props pill row */
        .value-props-box {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          padding: 1.25rem;
          background: var(--bg2);
          border-radius: var(--card-radius);
          margin-top: 1.5rem;
          border: 1px solid var(--border);
        }

        .prop-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.35rem;
        }

        .prop-item-title {
          font-size: 0.76rem;
          font-weight: 800;
          color: var(--text1);
        }

        .prop-item-sub {
          font-size: 0.68rem;
          color: var(--text3);
        }

        /* Accordions */
        .info-accordions {
          margin-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .accordion-tab {
          border-bottom: 1px solid var(--border);
        }

        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 0;
          cursor: pointer;
          color: var(--text1);
          font-weight: 800;
          font-size: 0.95rem;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
        }

        .accordion-header:hover {
          color: var(--accent);
        }

        .accordion-body {
          padding-bottom: 1.25rem;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--text2);
        }

        /* Reviews Section */
        .reviews-section {
          margin-top: 5rem;
          padding-top: 4rem;
          border-top: 1px solid var(--border);
        }

        .reviews-header-block {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .reviews-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          color: var(--text1);
          margin: 0 0 0.5rem;
        }

        .reviews-stats-summary {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: var(--bg2);
          padding: 1.5rem 2rem;
          border-radius: var(--card-radius);
          border: 1px solid var(--border);
          margin-bottom: 3rem;
        }

        @media (max-width: 640px) {
          .reviews-stats-summary {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
        }

        .big-rating-score {
          font-size: 3rem;
          font-weight: 900;
          color: var(--text1);
          line-height: 1;
        }

        .write-review-btn {
          padding: 0.75rem 1.5rem;
          background: var(--text1);
          color: var(--bg);
          border: none;
          border-radius: var(--btn-radius);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .write-review-btn:hover {
          opacity: 0.85;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .reviews-grid {
            grid-template-columns: 1fr;
          }
        }

        .review-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--card-radius);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .review-author-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .review-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--bg2);
          color: var(--text1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.88rem;
          border: 1px solid var(--border);
        }

        /* Related Products Section */
        .recom-block {
          margin-top: 5rem;
          padding-top: 4rem;
          border-top: 1px solid var(--border);
        }

        .recom-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 2.5rem;
          color: var(--text1);
        }

        .recom-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .recom-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        .recom-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }

        .recom-image-wrap {
          aspect-ratio: 3/4;
          width: 100%;
          border-radius: var(--card-radius);
          border: 1px solid var(--border);
          overflow: hidden;
          background: var(--surface);
          margin-bottom: 0.75rem;
        }

        .recom-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .recom-card:hover img {
          transform: scale(1.04);
        }

        .recom-name {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text1);
          margin-bottom: 0.25rem;
          transition: color 0.2s;
        }

        .recom-card:hover .recom-name {
          color: var(--accent);
        }

        .recom-price {
          font-weight: 800;
          color: var(--text1);
          font-size: 0.95rem;
        }

        /* Floating Toast */
        .floating-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
          background: #0f172a;
          color: #ffffff;
          padding: 0.85rem 1.35rem;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          font-size: 0.88rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />

      {/* ── HEADER ── */}
      <header className="compact-header">
        <Link to={`/store/${handle}`} className="header-logo-link">
          {store.logo_url && (
            <img
              src={store.logo_url}
              alt={store.store_name}
              style={{ height: 28, width: 'auto', objectFit: 'contain' }}
            />
          )}
          <span>{store.store_name}</span>
        </Link>

        <div className="header-nav-actions">
          <Link
            to={`/store/${handle}`}
            style={{
              fontSize: '0.86rem',
              fontWeight: 700,
              color: 'var(--text2)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ArrowLeft size={16} /> Catalog
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="header-icon-btn"
            title="View Bag"
          >
            <ShoppingBag size={21} />
            {cartItemCount > 0 && <span className="cart-count-badge">{cartItemCount}</span>}
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">
        {/* Breadcrumbs */}
        <div className="breadcrumb">
          <Link to={`/store/${handle}`}>Store</Link>
          <ChevronRight size={13} />
          <Link to={`/store/${handle}`}>{product.category || 'Collection'}</Link>
          <ChevronRight size={13} />
          <span>{product.name}</span>
        </div>

        <div className="details-wrapper">
          {/* LEFT: IMAGE GALLERY */}
          <div className="left-gallery">
            <div className="main-image-box">
              <img src={activeImage || mainImg} alt={product.name} />

              <button
                onClick={() => setIsTryOnOpen(true)}
                className="image-tryon-overlay"
                title="Launch Virtual AI Fitting Room"
              >
                <Sparkles size={16} color="#a855f7" />
                <span>Try On Virtually</span>
              </button>
            </div>

            {images.length > 1 && (
              <div className="thumbnail-strip">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`thumbnail-item ${activeImage === img ? 'thumbnail-item-active' : ''}`}
                  >
                    <img src={img} alt={`View ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS & ACTIONS */}
          <div className="right-info">
            <div className="product-meta-row">
              <span className="tag-badge">{product.category || 'Apparel'}</span>
              <span className="tag-badge tag-badge-highlight">
                <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                AI Try-On Ready
              </span>
            </div>

            <h1 className="product-title">{product.name}</h1>

            {/* Rating */}
            <div className="rating-row">
              <div className="stars-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" />
                ))}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text1)' }}>4.9</span>
              <span>·</span>
              <a
                href="#reviews-section"
                style={{ color: 'var(--text3)', textDecoration: 'underline' }}
              >
                {reviews.length} Customer Reviews
              </a>
            </div>

            {/* Price Box */}
            <div className="price-box">
              {originalPrice ? (
                <>
                  <span className="price-curr-sale">${productPrice}</span>
                  <span className="price-old">${originalPrice}</span>
                  <span className="savings-pill">
                    Save ${(originalPrice - productPrice).toFixed(0)}
                  </span>
                </>
              ) : (
                <span className="price-curr-normal">${productPrice}</span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="stock-indicator">
              <div className="stock-dot" />
              <span>
                {stockCount <= 3
                  ? `Only ${stockCount} pieces remaining`
                  : 'In Stock · Ships within 24 hours'}
              </span>
            </div>

            {/* Color Swatches */}
            <div className="selector-block">
              <div className="selector-header">
                <span className="selector-label">
                  Color: <strong style={{ color: 'var(--text1)' }}>{selectedColor}</strong>
                </span>
              </div>
              <div className="color-selector">
                {productColors.map((colorName) => {
                  const hex = getColorHex(colorName);
                  const isSelected = selectedColor === colorName;
                  return (
                    <div
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      className="color-swatch-wrapper"
                      title={colorName}
                    >
                      <div
                        className={`color-swatch ${isSelected ? 'color-swatch-active' : ''}`}
                        style={{ backgroundColor: hex }}
                      >
                        {isSelected && (
                          <Check
                            size={14}
                            color={hex.toLowerCase() === '#ffffff' || hex === '#fdfbf7' || hex === '#f5f5dc' ? '#000000' : '#ffffff'}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="selector-block">
              <div className="selector-header">
                <span className="selector-label">
                  Size: <strong style={{ color: 'var(--text1)' }}>{selectedSize}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="size-guide-btn"
                >
                  <Ruler size={13} /> Size Guide
                </button>
              </div>

              <div className="size-selector">
                {productSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`size-btn ${selectedSize === s ? 'size-btn-active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="qty-row">
              <div>
                <div className="selector-label" style={{ marginBottom: '0.4rem' }}>
                  Quantity
                </div>
                <div className="qty-controls">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="qty-btn"
                    title="Decrease Quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="qty-val">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="qty-btn"
                    title="Increase Quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="action-button-grid">
              <button onClick={handleAddToCart} className="cart-add-btn">
                <ShoppingBag size={18} />
                <span>Add to Bag · ${(productPrice * quantity).toLocaleString()}</span>
              </button>

              <button onClick={() => setIsTryOnOpen(true)} className="tryon-magic-btn">
                <Sparkles size={19} />
                <span>Try On Virtually in Fitting Room</span>
              </button>
            </div>

            {/* Secondary Actions: Wishlist & Share */}
            <div className="secondary-actions-row">
              <button
                onClick={handleToggleWishlist}
                className={`secondary-btn ${isWishlisted ? 'secondary-btn-active' : ''}`}
              >
                <Heart size={16} fill={isWishlisted ? '#e11d48' : 'none'} />
                <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button onClick={handleShare} className="secondary-btn">
                <Share2 size={16} />
                <span>Share Garment</span>
              </button>
            </div>

            {/* Value Props */}
            <div className="value-props-box">
              <div className="prop-item">
                <Truck size={20} color="var(--accent)" />
                <span className="prop-item-title">Global Express</span>
                <span className="prop-item-sub">2-4 days worldwide</span>
              </div>
              <div className="prop-item">
                <RotateCcw size={20} color="var(--accent)" />
                <span className="prop-item-title">30-Day Returns</span>
                <span className="prop-item-sub">Complimentary pickup</span>
              </div>
              <div className="prop-item">
                <ShieldCheck size={20} color="var(--accent)" />
                <span className="prop-item-title">Authentic Textile</span>
                <span className="prop-item-sub">Guaranteed origin</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="info-accordions">
              <div className="accordion-tab">
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => setActiveAccordion(activeAccordion === 'desc' ? '' : 'desc')}
                >
                  <span>Description & Editorial Notes</span>
                  <span>{activeAccordion === 'desc' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'desc' && (
                  <div className="accordion-body">
                    {product.description ||
                      'Expertly tailored piece designed to harmonize modern proportions with timeless architectural simplicity.'}
                  </div>
                )}
              </div>

              <div className="accordion-tab">
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => setActiveAccordion(activeAccordion === 'materials' ? '' : 'materials')}
                >
                  <span>Fabric & Garment Care</span>
                  <span>{activeAccordion === 'materials' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'materials' && (
                  <div className="accordion-body">
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      • 100% Sustainably milled European textile with premium soft-touch finish.
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      • Reinforced internal seams and custom tonal hardware.
                    </p>
                    <p style={{ margin: 0 }}>
                      • Specialized dry clean recommended. Steam on reverse.
                    </p>
                  </div>
                )}
              </div>

              <div className="accordion-tab">
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                >
                  <span>Delivery & Complimentary Returns</span>
                  <span>{activeAccordion === 'shipping' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="accordion-body">
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      • Complimentary worldwide express shipping on orders over $150.
                    </p>
                    <p style={{ margin: 0 }}>
                      • Hassle-free 30-day returns and exchanges. Prepaid return label included in the box.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── CUSTOMER REVIEWS SECTION ── */}
        <section id="reviews-section" className="reviews-section">
          <div className="reviews-header-block">
            <div>
              <h2 className="reviews-title">Verified Customer Reviews</h2>
              <p style={{ margin: 0, color: 'var(--text3)', fontSize: '0.9rem' }}>
                Real feedback from shoppers who tested and wore this piece.
              </p>
            </div>

            <button
              onClick={() => setIsWriteReviewOpen(true)}
              className="write-review-btn"
            >
              Write a Review
            </button>
          </div>

          <div className="reviews-stats-summary">
            <div>
              <div className="big-rating-score">4.9</div>
              <div className="stars-gold" style={{ marginTop: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" />
                ))}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 4 }}>
                Based on {reviews.length} verified ratings
              </div>
            </div>

            <div style={{ height: 48, width: 1, background: 'var(--border)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem' }}>
                <span style={{ minWidth: 44 }}>5 Stars</span>
                <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', background: 'var(--accent)' }} />
                </div>
                <span style={{ minWidth: 32, color: 'var(--text3)' }}>92%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem' }}>
                <span style={{ minWidth: 44 }}>4 Stars</span>
                <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: '8%', height: '100%', background: 'var(--accent)' }} />
                </div>
                <span style={{ minWidth: 32, color: 'var(--text3)' }}>8%</span>
              </div>
            </div>

            <div style={{ height: 48, width: 1, background: 'var(--border)' }} />

            <div style={{ minWidth: 160 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text1)', marginBottom: 4 }}>
                Fit Rating
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>
                98% True to Size
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                Based on virtual try-on feedback
              </div>
            </div>
          </div>

          <div className="reviews-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div className="review-author-row">
                  <div className="review-avatar">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text1)' }}>
                      {rev.author}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text3)' }}>
                      {rev.location} · {rev.date}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="stars-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                    {rev.size} · {rev.fit}
                  </span>
                </div>

                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text1)' }}>
                  "{rev.title}"
                </div>

                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text2)' }}>
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RELATED RECOMMENDATIONS ── */}
        {otherProducts.length > 0 && (
          <section className="recom-block">
            <h2 className="recom-title">Complete The Look</h2>
            <div className="recom-grid">
              {otherProducts.map((p) => {
                const img = p.image_url || p.imageUrl || p.main_image || '/placeholder-product.jpg';
                const pPrice = p.sale_price || p.salePrice || p.price;
                return (
                  <div
                    key={p.id}
                    className="recom-card"
                    onClick={() => {
                      navigate(`/store/${handle}/product/${p.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="recom-image-wrap">
                      <img src={img} alt={p.name} />
                    </div>
                    <h3 className="recom-name">{p.name}</h3>
                    <p className="recom-price">${pPrice}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
          padding: '3rem 2rem',
          textAlign: 'center',
          fontSize: '0.86rem',
          color: 'var(--text3)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text1)', marginBottom: 8 }}>
            {store.store_name}
          </div>
          <div style={{ marginBottom: 16 }}>
            {store.tagline || 'Modern Tailoring & AI Virtual Fitting Studio'}
          </div>
          <div>
            &copy; {new Date().getFullYear()} {store.store_name}. Powered by VogueSocial Anycast Storefronts.
          </div>
        </div>
      </footer>

      {/* ── SLIDE-OVER CART DRAWER ── */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              height: '100%',
              backgroundColor: 'var(--bg)',
              borderLeft: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShoppingBag size={20} color="var(--text1)" />
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text1)', fontFamily: 'var(--font-heading)' }}>
                  Shopping Bag ({cartItemCount})
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div style={{ padding: '0.85rem 1.5rem', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', fontSize: '0.78rem' }}>
              {cartSubtotal >= 150 ? (
                <div style={{ color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} /> You unlocked Free Worldwide Express Shipping!
                </div>
              ) : (
                <div style={{ color: 'var(--text2)' }}>
                  Add <strong>${(150 - cartSubtotal).toFixed(2)}</strong> more for <strong>Free Express Shipping</strong>
                </div>
              )}
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {cart.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text3)' }}>
                  <ShoppingBag size={42} style={{ margin: '0 auto 1rem', opacity: 0.35 }} />
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text1)', marginBottom: 6 }}>
                    Your shopping bag is empty
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    Explore the catalog and try on luxury silhouettes with AI!
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {cart.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        paddingBottom: '1.25rem',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 72,
                          height: 94,
                          objectFit: 'cover',
                          borderRadius: 6,
                          border: '1px solid var(--border)',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text3)', marginTop: 2 }}>
                          Color: {item.color} · Size: {item.size}
                        </div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text1)', marginTop: 4 }}>
                          ${item.price}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg2)' }}>
                            <button
                              onClick={() => handleUpdateCartQty(idx, -1)}
                              style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text1)' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0 6px', minWidth: 20, textAlign: 'center' }}>
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleUpdateCartQty(idx, 1)}
                              style={{ padding: '2px 8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text1)' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveCartItem(idx)}
                            style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 2 }}
                            title="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.items.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                {/* Promo Voucher */}
                <div style={{ display: 'flex', gap: 6, marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Promo code (try VOGUE20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.85rem',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--btn-radius)',
                      fontSize: '0.82rem',
                      outline: 'none',
                      background: 'var(--bg)',
                      color: 'var(--text1)'
                    }}
                  />
                  <button
                    onClick={() => {
                      if (promoCode === 'VOGUE20') {
                        setDiscountApplied(true);
                        showToast('20% Vogue discount applied!');
                      } else {
                        showToast('Invalid coupon. Try VOGUE20');
                      }
                    }}
                    style={{
                      padding: '0.55rem 1rem',
                      background: 'var(--text1)',
                      color: 'var(--bg)',
                      border: 'none',
                      borderRadius: 'var(--btn-radius)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Apply
                  </button>
                </div>

                {/* Calculation breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text3)' }}>
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toLocaleString()}</span>
                  </div>

                  {discountApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700 }}>
                      <span>VIP Promo (-20%)</span>
                      <span>-${(cartSubtotal * 0.2).toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text3)' }}>
                    <span>Express Shipping</span>
                    <span>{cartSubtotal >= 150 ? 'FREE' : '$15.00'}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: 'var(--text1)',
                      paddingTop: 8,
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span>Total</span>
                    <span>${(finalTotal + (cartSubtotal >= 150 ? 0 : 15)).toLocaleString()}</span>
                  </div>
                </div>

                {checkoutSuccess ? (
                  <div
                    style={{
                      padding: '0.85rem',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: 'var(--btn-radius)',
                      color: '#166534',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    ✓ Order Dispatched! Confirmation sent to your inbox.
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setCheckoutSuccess(true);
                      setTimeout(() => {
                        setCart({ items: [] });
                        setCheckoutSuccess(false);
                        setIsCartOpen(false);
                      }, 2500);
                    }}
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      background: 'var(--accent)',
                      color: 'var(--accent-text)',
                      border: 'none',
                      borderRadius: 'var(--btn-radius)',
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Lock size={15} />
                    <span>Proceed to Secure Checkout</span>
                  </button>
                )}

                <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.72rem', color: 'var(--text3)' }}>
                  🔒 256-Bit Encrypted Edge Checkout · Powered by VogueSocial
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SIZE GUIDE MODAL ── */}
      {isSizeGuideOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              maxWidth: 580,
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              color: '#0f172a',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Ruler size={20} color="#4f46e5" />
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Garment Size Guide</h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Unit switch */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 8, padding: 3 }}>
                <button
                  onClick={() => setSizeGuideUnit('cm')}
                  style={{
                    padding: '4px 12px',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: sizeGuideUnit === 'cm' ? '#ffffff' : 'transparent',
                    boxShadow: sizeGuideUnit === 'cm' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Centimeters (cm)
                </button>
                <button
                  onClick={() => setSizeGuideUnit('in')}
                  style={{
                    padding: '4px 12px',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: sizeGuideUnit === 'in' ? '#ffffff' : 'transparent',
                    boxShadow: sizeGuideUnit === 'in' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  Inches (in)
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>Size</th>
                  <th style={{ padding: '0.75rem' }}>Bust / Chest</th>
                  <th style={{ padding: '0.75rem' }}>Waist</th>
                  <th style={{ padding: '0.75rem' }}>Hips</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: 'XS', bustCm: '82-85', bustIn: '32-33.5', waistCm: '62-65', waistIn: '24-25.5', hipCm: '88-91', hipIn: '34.5-36' },
                  { size: 'S', bustCm: '86-89', bustIn: '34-35', waistCm: '66-69', waistIn: '26-27', hipCm: '92-95', hipIn: '36-37.5' },
                  { size: 'M', bustCm: '90-94', bustIn: '35.5-37', waistCm: '70-74', waistIn: '27.5-29', hipCm: '96-100', hipIn: '38-39.5' },
                  { size: 'L', bustCm: '95-100', bustIn: '37.5-39.5', waistCm: '75-80', waistIn: '29.5-31.5', hipCm: '101-106', hipIn: '40-42' },
                  { size: 'XL', bustCm: '101-106', bustIn: '40-42', waistCm: '81-86', waistIn: '32-34', hipCm: '107-112', hipIn: '42-44' },
                ].map((row) => (
                  <tr key={row.size} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 800 }}>{row.size}</td>
                    <td style={{ padding: '0.75rem', color: '#475569' }}>
                      {sizeGuideUnit === 'cm' ? `${row.bustCm} cm` : `${row.bustIn} in`}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#475569' }}>
                      {sizeGuideUnit === 'cm' ? `${row.waistCm} cm` : `${row.waistIn} in`}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#475569' }}>
                      {sizeGuideUnit === 'cm' ? `${row.hipCm} cm` : `${row.hipIn} in`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '1.5rem', background: '#eff6ff', padding: '0.85rem', borderRadius: 8, fontSize: '0.78rem', color: '#1e40af', display: 'flex', gap: 8 }}>
              <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Pro-fit recommendation:</strong> Try our AI Fitting Room with your uploaded photo or preset model to observe real-time silhouette drape and collar fit before ordering.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WRITE REVIEW MODAL ── */}
      {isWriteReviewOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
          onClick={() => setIsWriteReviewOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              maxWidth: 500,
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              color: '#0f172a',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Write a Verified Review</h3>
              <button
                onClick={() => setIsWriteReviewOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newReviewForm.author}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, author: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                    Overall Rating
                  </label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.85rem', outline: 'none', background: '#fff' }}
                  >
                    <option value={5}>5 Stars - Perfect</option>
                    <option value={4}>4 Stars - Great</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                    Fit Experience
                  </label>
                  <select
                    value={newReviewForm.fit}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, fit: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.85rem', outline: 'none', background: '#fff' }}
                  >
                    <option value="True to size">True to size</option>
                    <option value="Runs slightly small">Runs slightly small</option>
                    <option value="Runs slightly large">Runs slightly large</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stunning texture, AI try-on matched perfectly"
                  value={newReviewForm.title}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}>
                  Detailed Experience
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details on garment fit, textile feel, and your experience with virtual fitting..."
                  value={newReviewForm.comment}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '0.85rem',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginTop: 6,
                }}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── VIRTUAL TRY-ON MODAL ── */}
      {isTryOnOpen && (
        <TryOnModal
          isOpen={isTryOnOpen}
          onClose={() => setIsTryOnOpen(false)}
          product={product}
          garmentImage={activeImage || mainImg}
          category={product.category || 'tops'}
          productTitle={product.name}
        />
      )}

      {/* ── FLOATING TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="floating-toast">
          <CheckCircle2 size={18} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
