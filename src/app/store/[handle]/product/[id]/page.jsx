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
  Info
} from 'lucide-react';
import styles from '../../store.module.css';
import TryOnModal from '@/components/TryOnModal';
import { getStoreByHandle, STORE_PRODUCTS } from '@/lib/storefrontData';

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
    comment: 'Tested the AI fitting room before ordering. The waist and shoulder fit rendered identically in real life. The fabric weight and finishing are pure couture quality.'
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

export default function ProductPage({ handle: propHandle } = {}) {
  const routeParams = useParams();
  const handle = (propHandle || routeParams.handle || 'studiolabel').toLowerCase();
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
  const [sizeGuideUnit, setSizeGuideUnit] = useState('cm');
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

    showToast(`Added ${quantity}x ${product.name} to your bag`);
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
        showToast('Removed from private wishlist');
      } else {
        saved.push(product.id);
        setIsWishlisted(true);
        showToast('Saved to private atelier wishlist');
      }
      localStorage.setItem('vogue_wishlist', JSON.stringify(saved));
    } catch (e) {}
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Piece URL copied to clipboard');
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
      location: 'Verified Client',
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
    showToast('Verified client review published.');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Opening luxury atelier piece...</p>
        </div>
      </div>
    );
  }

  if (!product || !store) {
    return (
      <div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundTitle}>Piece Not Found</h1>
        <p className={styles.notFoundText}>
          The requested garment is currently unavailable or has been archived.
        </p>
        <Link to={`/store/${handle}`} className={styles.notFoundBtn}>
          Return to Collection
        </Link>
      </div>
    );
  }

  const mainImg = product.image_url || product.imageUrl || product.main_image || '/placeholder-product.jpg';
  const backImg = product.back_image_url || product.backImageUrl;
  const extraImgs = product.additional_images || product.images || [];
  const images = Array.from(new Set([mainImg, backImg, ...extraImgs].filter(Boolean)));

  const productPrice = product.sale_price || product.salePrice || product.price;
  const originalPrice = (product.sale_price || product.salePrice) ? product.price : null;
  const productColors = product.colors && product.colors.length > 0 ? product.colors : ['Obsidian Black', 'Camel'];
  const productSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['XS', 'S', 'M', 'L', 'XL'];
  const stockCount = product.stock_count || product.stock || 24;

  return (
    <div
      style={{
        backgroundColor: '#FAFAF9',
        color: '#1C1917',
        fontFamily: "'Inter', sans-serif",
        minHeight: '100vh',
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        /* ── Magazine Header ── */
        .mag-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250, 250, 249, 0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid #E7E5E4;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 1.25rem 3rem;
        }

        @media (max-width: 768px) {
          .mag-header {
            padding: 1rem 1.5rem;
            grid-template-columns: auto 1fr auto;
          }
        }

        .mag-nav-left {
          display: flex;
          align-items: center;
        }

        .mag-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #57534E;
          text-decoration: none;
          transition: color 0.2s;
        }

        .mag-back-link:hover {
          color: #0A0A0A;
        }

        .mag-brand-title {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-size: 1.65rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #0A0A0A;
          text-decoration: none;
          text-align: center;
          transition: opacity 0.2s;
        }

        .mag-brand-title:hover {
          opacity: 0.85;
        }

        .mag-actions-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.25rem;
        }

        .mag-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #292524;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: transform 0.15s, color 0.2s;
        }

        .mag-icon-btn:hover {
          color: #0A0A0A;
          transform: scale(1.06);
        }

        .mag-cart-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #0A0A0A;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* ── Main Container ── */
        .mag-main {
          max-width: 1360px;
          margin: 0 auto;
          padding: 3rem 3rem 6rem;
        }

        @media (max-width: 768px) {
          .mag-main {
            padding: 1.5rem 1.5rem 4rem;
          }
        }

        /* Breadcrumbs */
        .mag-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #A8A29E;
          margin-bottom: 2.5rem;
        }

        .mag-breadcrumb a {
          text-decoration: none;
          color: #78716C;
          transition: color 0.2s;
        }

        .mag-breadcrumb a:hover {
          color: #0A0A0A;
        }

        .mag-breadcrumb .current {
          color: #0A0A0A;
        }

        /* Layout Grid */
        .mag-details-wrapper {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 5rem;
          align-items: flex-start;
        }

        @media (max-width: 960px) {
          .mag-details-wrapper {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        /* ── Gallery Left ── */
        .mag-gallery {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mag-main-image-box {
          position: relative;
          aspect-ratio: 3/4;
          width: 100%;
          overflow: hidden;
          background: #F5F5F4;
          border: 1px solid #E7E5E4;
        }

        .mag-main-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mag-main-image-box:hover img {
          transform: scale(1.03);
        }

        /* Discreet in-image Try-On Button */
        .mag-image-tryon-btn {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          background: rgba(10, 10, 10, 0.88);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.6rem 1.25rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }

        .mag-image-tryon-btn:hover {
          background: #000000;
          transform: translateY(-2px);
        }

        .mag-thumbnails {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .mag-thumb {
          width: 76px;
          height: 100px;
          border: 1px solid #E7E5E4;
          cursor: pointer;
          background: #F5F5F4;
          opacity: 0.6;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .mag-thumb:hover, .mag-thumb-active {
          opacity: 1;
          border-color: #0A0A0A;
        }

        .mag-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ── Right Info Column ── */
        .mag-info {
          display: flex;
          flex-direction: column;
        }

        .mag-prod-kicker {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #78716C;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .mag-prod-title {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.2vw, 2.75rem);
          font-weight: 500;
          line-height: 1.15;
          letter-spacing: -0.01em;
          color: #0A0A0A;
          margin: 0 0 1.25rem 0;
        }

        .mag-rating-line {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.8rem;
          color: #78716C;
          margin-bottom: 1.75rem;
        }

        .mag-stars {
          display: flex;
          gap: 2px;
        }

        .mag-price-box {
          display: flex;
          align-items: baseline;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #E7E5E4;
        }

        .mag-price-current {
          font-size: 1.85rem;
          font-weight: 600;
          color: #0A0A0A;
          font-family: 'Playfair Display', serif;
        }

        .mag-price-old {
          font-size: 1.25rem;
          color: #A8A29E;
          text-decoration: line-through;
          font-weight: 400;
        }

        .mag-stock-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          letter-spacing: 0.04em;
          color: #57534E;
          margin-bottom: 2rem;
        }

        .mag-stock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #16A34A;
        }

        /* Selectors */
        .mag-selector-block {
          margin-bottom: 1.75rem;
        }

        .mag-selector-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.85rem;
        }

        .mag-selector-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0A0A0A;
        }

        .mag-selector-val {
          font-weight: 400;
          color: #78716C;
          margin-left: 6px;
        }

        .mag-size-guide-btn {
          background: none;
          border: none;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #78716C;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .mag-size-guide-btn:hover {
          color: #0A0A0A;
        }

        /* Swatches */
        .mag-swatches-grid {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .mag-swatch-item {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
          transition: transform 0.2s;
          border: 1px solid rgba(0,0,0,0.12);
        }

        .mag-swatch-item:hover {
          transform: scale(1.1);
        }

        .mag-swatch-active {
          box-shadow: 0 0 0 2px #FAFAF9, 0 0 0 3.5px #0A0A0A;
        }

        /* Size buttons */
        .mag-sizes-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
        }

        .mag-size-btn {
          padding: 0.75rem 1.35rem;
          border: 1px solid #D6D3D1;
          background: #FFFFFF;
          color: #0A0A0A;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 50px;
          text-align: center;
        }

        .mag-size-btn:hover {
          border-color: #0A0A0A;
        }

        .mag-size-btn-active {
          background: #0A0A0A !important;
          color: #FFFFFF !important;
          border-color: #0A0A0A !important;
        }

        /* Stepper & Action buttons */
        .mag-action-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          margin-top: 1rem;
        }

        .mag-qty-stepper {
          display: flex;
          align-items: center;
          border: 1px solid #D6D3D1;
          background: #FFFFFF;
        }

        .mag-qty-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.85rem 0.95rem;
          color: #0A0A0A;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .mag-qty-btn:hover {
          background: #F5F5F4;
        }

        .mag-qty-num {
          min-width: 32px;
          text-align: center;
          font-weight: 700;
          font-size: 0.88rem;
          color: #0A0A0A;
        }

        .mag-btn-bag {
          flex: 1;
          background: #0A0A0A;
          color: #FFFFFF;
          border: none;
          padding: 1.1rem 1.5rem;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.25s ease;
        }

        .mag-btn-bag:hover {
          background: #262626;
          transform: translateY(-1px);
        }

        .mag-btn-tryon {
          width: 100%;
          background: #1C1917;
          color: #FFFFFF;
          border: 1px solid #44403C;
          padding: 1.1rem;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: all 0.25s ease;
        }

        .mag-btn-tryon:hover {
          background: #000000;
          border-color: #000000;
          transform: translateY(-1px);
        }

        .mag-secondary-links {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 2rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #E7E5E4;
        }

        .mag-sub-action {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #78716C;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .mag-sub-action:hover {
          color: #0A0A0A;
        }

        /* Dispatch Promise Note */
        .mag-promise-box {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 1.25rem 1.5rem;
          background: #F5F5F4;
          border: 1px solid #E7E5E4;
          margin-bottom: 2.5rem;
          font-size: 0.78rem;
          color: #57534E;
          letter-spacing: 0.04em;
        }

        /* Editorial Accordions */
        .mag-accordion {
          border-top: 1px solid #E7E5E4;
        }

        .mag-acc-item {
          border-bottom: 1px solid #E7E5E4;
        }

        .mag-acc-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 1.25rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0A0A0A;
          text-align: left;
          transition: color 0.2s;
        }

        .mag-acc-btn:hover {
          color: #57534E;
        }

        .mag-acc-content {
          padding-bottom: 1.5rem;
          font-size: 0.88rem;
          line-height: 1.7;
          color: #57534E;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
        }

        /* ── Reviews Editorial Section ── */
        .mag-reviews-section {
          margin-top: 6rem;
          padding-top: 4.5rem;
          border-top: 1px solid #E7E5E4;
        }

        .mag-reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .mag-reviews-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 500;
          color: #0A0A0A;
          margin: 0 0 0.5rem 0;
        }

        .mag-reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .mag-reviews-grid { grid-template-columns: 1fr; }
        }

        .mag-review-card {
          background: #FFFFFF;
          border: 1px solid #E7E5E4;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mag-review-quote {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #0A0A0A;
          line-height: 1.35;
        }

        .mag-review-body {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          line-height: 1.65;
          color: #57534E;
          margin: 0;
          font-style: italic;
        }

        .mag-review-meta {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid #F5F5F4;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: #78716C;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* ── Recommendations Grid ── */
        .mag-recom-section {
          margin-top: 6rem;
          padding-top: 4.5rem;
          border-top: 1px solid #E7E5E4;
        }

        .mag-recom-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 500;
          text-align: center;
          color: #0A0A0A;
          margin-bottom: 3rem;
        }

        .mag-recom-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .mag-recom-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .mag-recom-card {
          text-decoration: none;
          color: inherit;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .mag-recom-img-box {
          aspect-ratio: 3/4;
          width: 100%;
          background: #F5F5F4;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .mag-recom-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mag-recom-card:hover img {
          transform: scale(1.04);
        }

        .mag-recom-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 600;
          color: #0A0A0A;
          margin: 0 0 0.25rem 0;
          transition: color 0.2s;
        }

        .mag-recom-card:hover .mag-recom-name {
          color: #57534E;
        }

        .mag-recom-price {
          font-size: 0.92rem;
          font-weight: 600;
          color: #0A0A0A;
        }

        /* ── Minimalist Magazine Footer ── */
        .mag-footer {
          border-top: 1px solid #E7E5E4;
          background: #1C1917;
          color: #D6D3D1;
          padding: 5rem 3rem 3rem;
          margin-top: 6rem;
        }

        .mag-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
          background: #0A0A0A;
          color: #FFFFFF;
          padding: 0.85rem 1.4rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
      `,
        }}
      />

      {/* ── 1. MAGAZINE EDITORIAL HEADER ── */}
      <header className="mag-header">
        <div className="mag-nav-left">
          <Link to={`/store/${handle}`} className="mag-back-link">
            <ArrowLeft size={14} /> Collection
          </Link>
        </div>

        <Link to={`/store/${handle}`} className="mag-brand-title">
          {store.store_name}
        </Link>

        <div className="mag-actions-right">
          <button
            onClick={() => setIsCartOpen(true)}
            className="mag-icon-btn"
            title="Shopping Bag"
          >
            <ShoppingBag size={19} />
            {cartItemCount > 0 && <span className="mag-cart-badge">{cartItemCount}</span>}
          </button>
        </div>
      </header>

      {/* ── 2. MAIN PRODUCT CONTENT ── */}
      <main className="mag-main">
        {/* Subtle Editorial Breadcrumbs */}
        <div className="mag-breadcrumb">
          <Link to={`/store/${handle}`}>COLLECTION</Link>
          <span>/</span>
          <span>{product.category?.toUpperCase() || 'APPAREL'}</span>
          <span>/</span>
          <span className="current">{product.name?.toUpperCase()}</span>
        </div>

        <div className="mag-details-wrapper">
          {/* Left: Magazine Gallery */}
          <div className="mag-gallery">
            <div className="mag-main-image-box">
              <img src={activeImage || mainImg} alt={product.name} />

              <button
                onClick={() => setIsTryOnOpen(true)}
                className="mag-image-tryon-btn"
                title="Launch Fitting Room"
              >
                <Sparkles size={13} />
                <span>Virtual Fitting Room</span>
              </button>
            </div>

            {images.length > 1 && (
              <div className="mag-thumbnails">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveImage(img)}
                    className={`mag-thumb ${activeImage === img ? 'mag-thumb-active' : ''}`}
                  >
                    <img src={img} alt={`Angle ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Atelier Info & Actions */}
          <div className="mag-info">
            <div className="mag-prod-kicker">
              <span>{product.category?.toUpperCase() || 'SILHOUETTE'}</span>
              <span>·</span>
              <span>BESPOKE FIT READY</span>
            </div>

            <h1 className="mag-prod-title">{product.name}</h1>

            {/* Rating */}
            <div className="mag-rating-line">
              <div className="mag-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#1C1917" color="#1C1917" />
                ))}
              </div>
              <span style={{ fontWeight: 600, color: '#0A0A0A' }}>4.9</span>
              <span>·</span>
              <a href="#reviews" style={{ color: '#78716C', textDecoration: 'none' }}>
                {reviews.length} Client Reviews
              </a>
            </div>

            {/* Price Box */}
            <div className="mag-price-box">
              <span className="mag-price-current">${productPrice} USD</span>
              {originalPrice && <span className="mag-price-old">${originalPrice}</span>}
            </div>

            {/* Dispatch Note */}
            <div className="mag-stock-note">
              <span className="mag-stock-dot" />
              <span>
                Complimentary Worldwide Courier · {stockCount <= 3 ? `Only ${stockCount} pieces remaining` : 'In stock for immediate dispatch'}
              </span>
            </div>

            {/* Color Choice */}
            <div className="mag-selector-block">
              <div className="mag-selector-header">
                <span className="mag-selector-label">
                  Color <span className="mag-selector-val">/ {selectedColor}</span>
                </span>
              </div>
              <div className="mag-swatches-grid">
                {productColors.map((colorName) => {
                  const hex = getColorHex(colorName);
                  const isSelected = selectedColor === colorName;
                  return (
                    <div
                      key={colorName}
                      onClick={() => setSelectedColor(colorName)}
                      className={`mag-swatch-item ${isSelected ? 'mag-swatch-active' : ''}`}
                      style={{ backgroundColor: hex }}
                      title={colorName}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Choice */}
            <div className="mag-selector-block">
              <div className="mag-selector-header">
                <span className="mag-selector-label">
                  Size <span className="mag-selector-val">/ {selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="mag-size-guide-btn"
                >
                  Size & Sizing Guide
                </button>
              </div>

              <div className="mag-sizes-grid">
                {productSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`mag-size-btn ${selectedSize === s ? 'mag-size-btn-active' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepper & Primary Add to Bag */}
            <div className="mag-action-row">
              <div className="mag-qty-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="mag-qty-btn"
                  title="Decrease"
                >
                  <Minus size={13} />
                </button>
                <span className="mag-qty-num">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="mag-qty-btn"
                  title="Increase"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button onClick={handleAddToCart} className="mag-btn-bag">
                <ShoppingBag size={15} />
                <span>ADD TO BAG · ${(productPrice * quantity).toLocaleString()}</span>
              </button>
            </div>

            {/* Virtual Try-On Magic Button */}
            <button onClick={() => setIsTryOnOpen(true)} className="mag-btn-tryon">
              <Sparkles size={14} />
              <span>VIRTUAL FITTING ROOM · TRY ON WITH AI</span>
            </button>

            {/* Wishlist & Share */}
            <div className="mag-secondary-links">
              <button onClick={handleToggleWishlist} className="mag-sub-action">
                <Heart size={14} fill={isWishlisted ? '#0A0A0A' : 'none'} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
              </button>

              <button onClick={handleShare} className="mag-sub-action">
                <Share2 size={14} />
                <span>Share Piece</span>
              </button>
            </div>

            {/* Editorial Dispatch Promises */}
            <div className="mag-promise-box">
              <div>• Certified European Textile Craftsmanship</div>
              <div>• 100% In-Browser Virtual Drape Fitting</div>
              <div>• 30-Day Complimentary Doorstep Courier Returns</div>
            </div>

            {/* Editorial Accordions */}
            <div className="mag-accordion">
              <div className="mag-acc-item">
                <button
                  type="button"
                  className="mag-acc-btn"
                  onClick={() => setActiveAccordion(activeAccordion === 'desc' ? '' : 'desc')}
                >
                  <span>Editorial Notes & Silhouette</span>
                  <span>{activeAccordion === 'desc' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'desc' && (
                  <div className="mag-acc-content">
                    {product.description ||
                      'An exquisitely tailored silhouette balancing modern architectural lines with supreme everyday drape.'}
                  </div>
                )}
              </div>

              <div className="mag-acc-item">
                <button
                  type="button"
                  className="mag-acc-btn"
                  onClick={() => setActiveAccordion(activeAccordion === 'care' ? '' : 'care')}
                >
                  <span>Fabric Composition & Care</span>
                  <span>{activeAccordion === 'care' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'care' && (
                  <div className="mag-acc-content">
                    Crafted from sustainably milled heritage textiles with hand-finished interior seams. Specialized delicate dry clean or gentle cold wash recommended. Steam on reverse.
                  </div>
                )}
              </div>

              <div className="mag-acc-item">
                <button
                  type="button"
                  className="mag-acc-btn"
                  onClick={() => setActiveAccordion(activeAccordion === 'ship' ? '' : 'ship')}
                >
                  <span>Complimentary Courier & Returns</span>
                  <span>{activeAccordion === 'ship' ? '−' : '+'}</span>
                </button>
                {activeAccordion === 'ship' && (
                  <div className="mag-acc-content">
                    Delivered via express carbon-neutral courier in 2–4 business days with archival dust garment bag. Free 30-day returns with prepaid return packaging included.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. CLIENT REVIEWS SECTION ── */}
        <section id="reviews" className="mag-reviews-section">
          <div className="mag-reviews-header">
            <div>
              <h2 className="mag-reviews-title">Client Notes & Fit Testimonials</h2>
              <p style={{ margin: 0, color: '#78716C', fontSize: '0.88rem' }}>
                Verified observations on silhouette, drape, and virtual try-on fidelity.
              </p>
            </div>

            <button
              onClick={() => setIsWriteReviewOpen(true)}
              style={{
                padding: '0.75rem 1.75rem',
                background: '#0A0A0A',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Write a Review
            </button>
          </div>

          <div className="mag-reviews-grid">
            {reviews.map((rev) => (
              <div key={rev.id} className="mag-review-card">
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={12} fill="#0A0A0A" color="#0A0A0A" />
                  ))}
                </div>

                <div className="mag-review-quote">
                  "{rev.title}"
                </div>

                <p className="mag-review-body">
                  "{rev.comment}"
                </p>

                <div className="mag-review-meta">
                  <span>{rev.author} · {rev.location}</span>
                  <span>{rev.size}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. COMPLETE THE ATELIER LOOK ── */}
        {otherProducts.length > 0 && (
          <section className="mag-recom-section">
            <h2 className="mag-recom-title">Complete The Look</h2>
            <div className="mag-recom-grid">
              {otherProducts.map((p) => {
                const img = p.image_url || p.imageUrl || '/placeholder-product.jpg';
                const pPrice = p.sale_price || p.salePrice || p.price;
                return (
                  <div
                    key={p.id}
                    className="mag-recom-card"
                    onClick={() => {
                      navigate(`/store/${handle}/product/${p.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="mag-recom-img-box">
                      <img src={img} alt={p.name} />
                    </div>
                    <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#78716C', marginBottom: 4 }}>
                      {p.category || 'Atelier Piece'}
                    </span>
                    <h3 className="mag-recom-name">{p.name}</h3>
                    <div className="mag-recom-price">${pPrice}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* ── 5. MAGAZINE FOOTER ── */}
      <footer className="mag-footer">
        <div style={{ maxWidth: 1360, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.78rem', color: '#A8A29E' }}>
          <div>
            &copy; {new Date().getFullYear()} {store.store_name}. Powered by <strong>VogueSocial Storefronts</strong>.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Atelier</span>
            <span>Global Courier Delivery</span>
          </div>
        </div>
      </footer>

      {/* ── 6. SLIDE-OVER CART DRAWER ── */}
      {isCartOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(10, 10, 10, 0.65)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsCartOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 440,
              height: '100%',
              backgroundColor: '#FFFFFF',
              borderLeft: '1px solid #E7E5E4',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                borderBottom: '1px solid #E7E5E4',
              }}
            >
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.04em' }}>
                Shopping Bag ({cartItemCount})
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {cart.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#78716C' }}>
                  <ShoppingBag size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#0A0A0A', marginBottom: 6 }}>
                    Your bag is empty
                  </div>
                  <div style={{ fontSize: '0.82rem' }}>
                    Explore the collection and try on silhouettes with AI.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {cart.items.map((item, idx) => (
                    <div
                      key={`${item.productId}-${idx}`}
                      style={{ display: 'flex', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F5F5F4' }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 75, height: 100, objectFit: 'cover', background: '#F5F5F4' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.98rem', fontWeight: 600, color: '#0A0A0A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#78716C', marginTop: 3 }}>
                          Color: {item.color} · Size: {item.size}
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0A0A0A', marginTop: 6 }}>
                          ${item.price}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E7E5E4' }}>
                            <button
                              onClick={() => handleUpdateCartQty(idx, -1)}
                              style={{ padding: '3px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#44403C' }}
                            >
                              <Minus size={11} />
                            </button>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 6px', minWidth: 20, textAlign: 'center' }}>
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleUpdateCartQty(idx, 1)}
                              style={{ padding: '3px 8px', background: 'none', border: 'none', cursor: 'pointer', color: '#44403C' }}
                            >
                              <Plus size={11} />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveCartItem(idx)}
                            style={{ background: 'none', border: 'none', color: '#A8A29E', cursor: 'pointer', padding: 2 }}
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #E7E5E4', background: '#FAFAF9' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    placeholder="Voucher code (try VOGUE20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '0.55rem 0.85rem', border: '1px solid #D6D3D1', fontSize: '0.8rem', outline: 'none', background: '#FFFFFF' }}
                  />
                  <button
                    onClick={() => {
                      if (promoCode === 'VOGUE20') setDiscountApplied(true);
                    }}
                    style={{ padding: '0.55rem 1rem', background: '#0A0A0A', color: '#FFFFFF', border: 'none', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}
                  >
                    Apply
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#78716C' }}>
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toLocaleString()}</span>
                  </div>

                  {discountApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: 600 }}>
                      <span>VIP Promo (-20%)</span>
                      <span>-${(cartSubtotal * 0.2).toFixed(2)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#78716C' }}>
                    <span>Express Worldwide Delivery</span>
                    <span>{cartSubtotal >= 150 ? 'FREE' : '$15.00'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#0A0A0A', paddingTop: 8, borderTop: '1px solid #E7E5E4' }}>
                    <span>Total</span>
                    <span>${(finalTotal + (cartSubtotal >= 150 ? 0 : 15)).toLocaleString()}</span>
                  </div>
                </div>

                {checkoutSuccess ? (
                  <div style={{ padding: '0.85rem', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
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
                      background: '#0A0A0A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Lock size={14} />
                    <span>Proceed to Checkout</span>
                  </button>
                )}

                <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.7rem', color: '#A8A29E' }}>
                  🔒 256-Bit Encrypted Edge Checkout · Powered by VogueSocial
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 7. SIZE GUIDE MODAL ── */}
      {isSizeGuideOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(10, 10, 10, 0.65)',
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              maxWidth: 560,
              width: '100%',
              padding: '2.5rem',
              color: '#0A0A0A',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 600 }}>Atelier Sizing Guide</h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', border: '1px solid #E7E5E4' }}>
                <button
                  onClick={() => setSizeGuideUnit('cm')}
                  style={{
                    padding: '4px 12px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    background: sizeGuideUnit === 'cm' ? '#0A0A0A' : '#FFFFFF',
                    color: sizeGuideUnit === 'cm' ? '#FFFFFF' : '#78716C',
                  }}
                >
                  CM
                </button>
                <button
                  onClick={() => setSizeGuideUnit('in')}
                  style={{
                    padding: '4px 12px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    background: sizeGuideUnit === 'in' ? '#0A0A0A' : '#FFFFFF',
                    color: sizeGuideUnit === 'in' ? '#FFFFFF' : '#78716C',
                  }}
                >
                  IN
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#F5F5F4', textAlign: 'left', borderBottom: '1px solid #E7E5E4' }}>
                  <th style={{ padding: '0.65rem' }}>Size</th>
                  <th style={{ padding: '0.65rem' }}>Bust / Chest</th>
                  <th style={{ padding: '0.65rem' }}>Waist</th>
                  <th style={{ padding: '0.65rem' }}>Hips</th>
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
                  <tr key={row.size} style={{ borderBottom: '1px solid #F5F5F4' }}>
                    <td style={{ padding: '0.65rem', fontWeight: 700 }}>{row.size}</td>
                    <td style={{ padding: '0.65rem', color: '#57534E' }}>
                      {sizeGuideUnit === 'cm' ? `${row.bustCm} cm` : `${row.bustIn} in`}
                    </td>
                    <td style={{ padding: '0.65rem', color: '#57534E' }}>
                      {sizeGuideUnit === 'cm' ? `${row.waistCm} cm` : `${row.waistIn} in`}
                    </td>
                    <td style={{ padding: '0.65rem', color: '#57534E' }}>
                      {sizeGuideUnit === 'cm' ? `${row.hipCm} cm` : `${row.hipIn} in`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 8. WRITE REVIEW MODAL ── */}
      {isWriteReviewOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(10, 10, 10, 0.65)',
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
          onClick={() => setIsWriteReviewOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              maxWidth: 500,
              width: '100%',
              padding: '2.5rem',
              color: '#0A0A0A',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 600 }}>Client Testimonial</h3>
              <button
                onClick={() => setIsWriteReviewOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#78716C' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newReviewForm.author}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, author: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #D6D3D1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Magnificent silhouette and drape"
                  value={newReviewForm.title}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #D6D3D1', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Fit & Observations
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the fabric weight, shoulder silhouette, and virtual fitting experience..."
                  value={newReviewForm.comment}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #D6D3D1', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '1rem',
                  background: '#0A0A0A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  marginTop: 6,
                }}
              >
                Publish Testimonial
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── 9. VIRTUAL TRY-ON MODAL ── */}
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

      {/* ── 10. FLOATING TOAST ── */}
      {toastMessage && (
        <div className="mag-toast">
          <CheckCircle2 size={16} color="#FFFFFF" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
