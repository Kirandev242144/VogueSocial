"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, ChevronRight, Truck } from 'lucide-react';
import styles from '../../store.module.css';
import TryOnModal from '@/components/TryOnModal';
import { getStoreByHandle } from '@/lib/storefrontData';

const TEMPLATES = {
    minimal: `--bg: #FFFFFF; --bg2: #F9F7F4; --surface: #FFFFFF; --border: #E8E4DE; --text1: #1A1A1A; --text2: #4A4A4A; --text3: #8A8A8A; --accent: #1A1A1A; --accent-text: #FFFFFF; --btn-radius: 0px; --card-radius: 0px; --font-heading: 'Cormorant Garamond', serif; --font-body: 'Jost', sans-serif;`,
    luxury: `--bg: #1C1C1E; --bg2: #242426; --surface: #2A2A2C; --border: #3A3A3C; --text1: #C9A84C; --text2: #E8E8E8; --text3: #888888; --accent: #C9A84C; --accent-text: #1C1C1E; --btn-radius: 0px; --card-radius: 4px; --font-heading: 'Playfair Display', serif; --font-body: 'Montserrat', sans-serif;`,
    streetwear: `--bg: #0A0A0A; --bg2: #111111; --surface: #1A1A1A; --border: #2A2A2A; --text1: #FFFFFF; --text2: #CCCCCC; --text3: #666666; --accent: #CCFF00; --accent-text: #0A0A0A; --btn-radius: 0px; --card-radius: 0px; --font-heading: 'Barlow Condensed', sans-serif; --font-body: 'Barlow', sans-serif;`,
    modern: `--bg: #F8F9FF; --bg2: #FFFFFF; --surface: #FFFFFF; --border: #E8EAFF; --text1: #1E1B4B; --text2: #3730A3; --text3: #6366F1; --accent: #4F46E5; --accent-text: #FFFFFF; --btn-radius: 10px; --card-radius: 16px; --font-heading: 'Plus Jakarta Sans', sans-serif; --font-body: 'Inter', sans-serif;`,
    boutique: `--bg: #FAF7F2; --bg2: #F5EFE8; --surface: #FFFFFF; --border: #EAE0D5; --text1: #2C1810; --text2: #5C3D2E; --text3: #9B7E6E; --accent: #C47E6B; --accent-text: #FFFFFF; --btn-radius: 24px; --card-radius: 12px; --font-heading: 'Libre Baskerville', serif; --font-body: 'Nunito', sans-serif;`,
};
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
export default function ProductPage() {
    const routeParams = useParams();
    const handle = routeParams.handle || 'tom';
    const id = routeParams.id || '';
    const navigate = useNavigate();
    const [store, setStore] = useState(null);
    const [product, setProduct] = useState(null);
    const [otherProducts, setOtherProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    useEffect(() => {
        async function fetchData() {
            try {
                let storeData = null;
                let productList = [];
                try {
                    const res = await fetch(`/api/store/${handle}`);
                    if (res.ok) {
                        const data = await res.json();
                        storeData = data.store;
                        productList = data.products || [];
                    }
                } catch (e) {}

                if (!storeData) {
                    const local = getStoreByHandle(handle);
                    storeData = local.store;
                    productList = local.products || [];
                }

                if (storeData) {
                    setStore(storeData);
                    const p = productList.find((x) => x.id === id || x.id.toString() === id) || productList[0];
                    if (p) {
                        setProduct(p);
                        setActiveImage(p.image_url || p.main_image || p.images?.[0]);
                        if (p.colors?.length)
                            setSelectedColor(p.colors[0]);
                        if (p.sizes?.length)
                            setSelectedSize(p.sizes[0]);
                        setOtherProducts(productList.filter((x) => x.id !== p.id).slice(0, 4));
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [handle, id]);
    const handleAddToCart = () => {
        if (!product)
            return;
        const cartKey = `vogue_cart_${handle}`;
        const cartData = localStorage.getItem(cartKey);
        let cart = cartData ? JSON.parse(cartData) : { items: [] };
        const existingIndex = cart.items.findIndex((item) => item.productId === product.id && item.color === selectedColor && item.size === selectedSize);
        if (existingIndex > -1) {
            cart.items[existingIndex].quantity += quantity;
        }
        else {
            cart.items.push({
                productId: product.id,
                name: product.name,
                price: product.sale_price || product.price,
                image: product.image_url,
                color: selectedColor,
                size: selectedSize,
                quantity: quantity
            });
        }
        localStorage.setItem(cartKey, JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
    };
    if (loading) {
        return (<div className={styles.loadingContainer}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner}/>
          <p className={styles.loadingText}>Loading product details...</p>
        </div>
      </div>);
    }
    if (!product || !store) {
        return (<div className={styles.notFoundContainer}>
        <h1 className={styles.notFoundTitle}>Product Not Found</h1>
        <Link to={`/store/${handle}`} className={styles.notFoundBtn}>
          Back to Store
        </Link>
      </div>);
    }
    const templateName = store.template || 'minimal';
    let cssVars = TEMPLATES[templateName] || TEMPLATES.minimal;
    if (store.accent_color) {
        const rgb = hexToRgb(store.accent_color);
        let accentText = '#FFFFFF';
        if (rgb) {
            const lum = getLuminance(rgb.r, rgb.g, rgb.b);
            if (lum > 0.5)
                accentText = '#000000';
        }
        cssVars += ` --accent: ${store.accent_color}; --accent-text: ${accentText};`;
    }
    const images = [product.image_url, product.back_image_url, ...(product.additional_images || [])].filter(Boolean);
    return (<div style={{
            backgroundColor: 'var(--bg)',
            color: 'var(--text2)',
            fontFamily: 'var(--font-body)',
            minHeight: '100vh'
        }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;600&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Jost:wght@400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600&family=Nunito:wght@400;500;600&family=Playfair+Display:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        :root {
          ${cssVars}
        }

        .compact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2rem;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }

        .header-logo-link {
          text-decoration: none;
          color: var(--text1);
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 800;
        }

        .header-logo-link:hover {
          color: var(--accent);
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem 6rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.84rem;
          color: var(--text3);
          margin-bottom: 3rem;
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
        }

        @media (max-width: 768px) {
          .details-wrapper { flex-direction: column; gap: 2rem; }
        }

        .left-gallery {
          width: 50%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .left-gallery { width: 100%; }
        }

        .main-image-box {
          aspect-ratio: 3/4;
          width: 100%;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--card-radius);
        }

        .main-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-strip {
          display: flex;
          gap: 0.75rem;
        }

        .thumbnail-item {
          width: 70px;
          height: 90px;
          border-radius: var(--card-radius);
          border: 1px solid var(--border);
          overflow: hidden;
          cursor: pointer;
          background: var(--surface);
          opacity: 0.6;
          transition: all 0.2s;
        }

        .thumbnail-item:hover, .thumbnail-item-active {
          opacity: 1;
          border-color: var(--accent);
        }

        .thumbnail-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-info {
          width: 50%;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .right-info { width: 100%; }
        }

        .product-tag-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag-badge {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          background: var(--bg2);
          color: var(--text2);
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .product-title {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1.2;
          color: var(--text1);
          margin: 0 0 1rem;
        }

        .price-box {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
          font-size: 1.2rem;
          font-weight: 500;
        }

        .stock-indicator {
          margin-bottom: 2rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.84rem;
          font-weight: 700;
        }

        .stock-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        /* Color Choice */
        .selector-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text1);
          letter-spacing: 0.08em;
          margin-bottom: 0.75rem;
        }

        .color-selector {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .color-option-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          border: 1px solid var(--border);
          position: relative;
          transition: all 0.2s;
        }

        .color-option-btn-active {
          box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--accent);
        }

        /* Size Choice */
        .size-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
          margin-bottom: 2rem;
        }

        .size-option-btn {
          padding: 0.65rem 1.25rem;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text1);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: var(--btn-radius);
          transition: all 0.2s;
        }

        .size-option-btn:hover {
          border-color: var(--text1);
        }

        .size-option-btn-active {
          background: var(--accent);
          color: var(--accent-text);
          border-color: var(--accent);
        }

        /* Quantity controls */
        .qty-controls {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: var(--btn-radius);
          width: max-content;
          margin-bottom: 2rem;
        }

        .qty-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.65rem 1rem;
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
          width: 40px;
          text-align: center;
          font-weight: 700;
          color: var(--text1);
        }

        /* Buttons styles */
        .cart-add-btn {
          width: 100%;
          background: var(--accent);
          color: var(--accent-text);
          border: none;
          border-radius: var(--btn-radius);
          padding: 1.1rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          margin-bottom: 0.75rem;
        }

        .cart-add-btn:hover {
          opacity: 0.92;
        }

        .tryon-magic-btn {
          width: 100%;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #ffffff;
          border: none;
          border-radius: var(--btn-radius);
          padding: 1.1rem;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(99,102,241,0.25);
          transition: all 0.2s;
        }

        .tryon-magic-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.35);
        }

        /* Information accordions */
        .info-accordions {
          border-top: 1px solid var(--border);
          margin-top: 3rem;
        }

        .accordion-item {
          border-bottom: 1px solid var(--border);
          padding: 1.5rem 0;
        }

        .accordion-item h3 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text1);
          margin: 0 0 0.5rem;
        }

        .accordion-item p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text3);
          margin: 0;
        }

        /* Smart recommendation grid */
        .recom-block {
          margin-top: 6rem;
          padding-top: 4rem;
          border-top: 1px solid var(--border);
        }

        .recom-title {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 3rem;
          color: var(--text1);
        }

        .recom-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .recom-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        }

        .recom-card {
          cursor: pointer;
          display: flex;
          flex-direction: column;
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
          transition: transform 0.5s;
        }

        .recom-card:hover img {
          transform: scale(1.03);
        }

        .recom-name {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--text1);
          margin-bottom: 0.25rem;
          transition: color 0.2s;
        }

        .recom-card:hover .recom-name {
          color: var(--accent);
        }

        .recom-price {
          font-weight: 700;
          color: var(--text1);
          font-size: 0.95rem;
        }
      ` }}/>

      {/* Header */}
      <header className="compact-header">
        <Link to={`/store/${handle}`} className="header-logo-link">
          {store.store_name}
        </Link>
        <div className={styles.headerActions}>
          <ShoppingBag size={20}/>
        </div>
      </header>

      <main className="main-content">
        {/* Breadcrumbs */}
        <div className="breadcrumb">
          <Link to={`/store/${handle}`}>Store</Link>
          <ChevronRight size={13} className={styles.breadcrumbChevron}/>
          <span>{product.name}</span>
        </div>

        <div className="details-wrapper">
          {/* Left Column: Image Gallery */}
          <div className="left-gallery">
            <div className="main-image-box">
              <img src={activeImage || '/placeholder-product.jpg'} alt={product.name}/>
            </div>
            
            {images.length > 1 && (<div className="thumbnail-strip">
                {images.map((img, index) => (<div key={index} onClick={() => setActiveImage(img)} className={`thumbnail-item ${activeImage === img ? 'thumbnail-item-active' : ''}`}>
                    <img src={img} alt={`Detail view ${index + 1}`}/>
                  </div>))}
              </div>)}
          </div>

          {/* Right Column: Product details */}
          <div className="right-info">
            <div className="product-tag-row">
              <span className="tag-badge">{product.category}</span>
              <span className={`tag-badge ${styles.tagBadge}`}>Virtual Try-On</span>
            </div>

            <h1 className="product-title store-heading">{product.name}</h1>

            <div className="price-box">
              {product.sale_price ? (<>
                  <span className="price-curr-sale">${product.sale_price}</span>
                  <span className="price-old">${product.price}</span>
                </>) : (<span className="price-curr-normal">${product.price}</span>)}
            </div>

            {/* Inventory Status */}
            <div className="stock-indicator">
              <div className="stock-dot"/>
              {product.stock <= 0 ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In Stock & Ready to Ship'}
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (<div className="selector-block">
                <div className="selector-label">Color: {selectedColor}</div>
                <div className="color-selector">
                  {product.colors.map((c) => (<div key={c} onClick={() => setSelectedColor(c)} className={`color-option-btn ${selectedColor === c ? 'color-option-btn-active' : ''}`} title={c}/>))}
                </div>
              </div>)}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (<div className="selector-block">
                <div className="selector-label">Size: {selectedSize}</div>
                <div className="size-selector">
                  {product.sizes.map((s) => (<button key={s} onClick={() => setSelectedSize(s)} className={`size-option-btn ${selectedSize === s ? 'size-option-btn-active' : ''}`}>
                      {s}
                    </button>))}
                </div>
              </div>)}

            {/* Quantity */}
            <div className="selector-label">Quantity</div>
            <div className="qty-controls">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn" title="Decrease">
                <Minus size={16}/>
              </button>
              <span className="qty-val">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="qty-btn" title="Increase">
                <Plus size={16}/>
              </button>
            </div>

            {/* Buttons */}
            <button onClick={handleAddToCart} className="cart-add-btn">
              Add to Cart
            </button>
            <button onClick={() => setIsTryOnOpen(true)} className="tryon-magic-btn">
              <Sparkles size={18}/> Try On Virtually
            </button>

            <TryOnModal isOpen={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} garmentImage={product?.image_url || activeImage} category={product?.category || 'tops'} productTitle={product?.name || 'Garment'}/>

            {/* Accordions */}
            <div className="info-accordions">
              <div className="accordion-item">
                <h3>Product Description</h3>
                <p>{product.description || 'No description available.'}</p>
              </div>
              <div className={`accordion-item ${styles.accordionFlex}`}>
                <Truck size={18} className={styles.accordionIcon}/>
                <div>
                  <h3>Delivery Information</h3>
                  <p>Standard delivery within 3-5 business days. Free shipping on orders over $100.</p>
                </div>
              </div>
              <div className={`accordion-item ${styles.accordionFlex}`}>
                <RefreshCcw size={18} className={styles.accordionIcon}/>
                <div>
                  <h3>Returns & Exchange Policy</h3>
                  <p>Returns are accepted within 30 days of purchase for a full refund. Items must be unworn and in original packaging.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More from store recommendations */}
        {otherProducts.length > 0 && (<div className="recom-block">
            <h2 className="recom-title">More from {store.store_name}</h2>
            <div className="recom-grid">
              {otherProducts.map(p => (<div key={p.id} className="recom-card" onClick={() => navigate(`/store/${handle}/product/${p.id}`)}>
                  <div className="recom-image-wrap">
                    <img src={p.image_url || '/placeholder-product.jpg'} alt={p.name}/>
                  </div>
                  <h3 className="recom-name store-heading">{p.name}</h3>
                  <p className="recom-price">${p.sale_price || p.price}</p>
                </div>))}
            </div>
          </div>)}
      </main>

      <footer className={`border-t border-[var(--border)] bg-[var(--surface)] py-8 text-center text-sm text-[var(--text3)] ${styles.footerContainer}`}>
        &copy; {new Date().getFullYear()} {store.store_name}. Powered by VogueSocial
      </footer>
    </div>);
}
