'use client';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '@/components/Image';
import { Star, Heart, Shirt, MessageCircle, ChevronRight } from 'lucide-react';
import { formatLikes } from './ProductFloatingActions';
import './VendorProductDetails.css';

const parseSafeCount = (val, fallback = 0) => {
    const num = Number(val);
    return (Number.isFinite(num) && !isNaN(num) && num >= 0) ? num : fallback;
};

export default function VendorProductDetails({
    post,
    commentCount = 0,
    comments = [],
    likesCount = 1240,
    isLiked = false,
    onToggleLike,
    following = false,
    onToggleFollow,
    onAddToCart,
    onBuyNow,
    onOpenTryOn,
    onOpenComments
}) {
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    if (!post) return null;

    const brandHandle = (post.author || 'vendor').toLowerCase().replace(/[^a-z0-9]/g, '');
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];

    return (
        <aside className="vendor-details-sidebar">
            <div className="vendor-details-card">
                {/* Header: Title, Stars, Price, Dynamic Like */}
                <header className="vendor-product-header">
                    <h1 className="vendor-product-title">{post.productName}</h1>
                    
                    <div className="vendor-rating-row">
                        <div className="vendor-stars-group">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={16}
                                    fill={star <= (post.rating || 5) ? "#0f172a" : "none"}
                                    color="#0f172a"
                                />
                            ))}
                        </div>
                        <span className="vendor-reviews-count">
                            ({parseSafeCount(commentCount || comments.length, 0)} reviews)
                        </span>

                        {/* Rating Row Like Button */}
                        <button
                            type="button"
                            className={`vendor-rating-like-btn ${isLiked ? 'active' : ''}`}
                            onClick={onToggleLike}
                            title={isLiked ? "Unlike" : "Like this product"}
                        >
                            <Heart
                                size={15}
                                fill={isLiked ? "#ef4444" : "none"}
                                color={isLiked ? "#ef4444" : "currentColor"}
                            />
                            <span>{formatLikes(likesCount)}</span>
                        </button>
                    </div>

                    <div className="vendor-price-row">
                        <span className="vendor-price-amount">{post.price}</span>
                    </div>
                </header>

                {/* Description */}
                <p className="vendor-description-text">
                    {post.description}
                </p>

                {/* Mini Vendor / Brand Profile */}
                <div className="vendor-profile-strip">
                    <Link to={`/brand/${brandHandle}`} className="vendor-profile-link">
                        <div className="vendor-avatar-thumb">
                            <Image
                                src={post.avatar}
                                alt={post.author}
                                fill
                                className="vendor-media-cover"
                            />
                        </div>
                        <div className="vendor-identity-text">
                            <span className="vendor-byline">Designed by</span>
                            <strong className="vendor-brand-name">{post.author}</strong>
                        </div>
                    </Link>

                    <button
                        type="button"
                        className={`vendor-follow-btn ${following ? 'following' : ''}`}
                        onClick={onToggleFollow}
                    >
                        {following ? 'Following' : 'Follow'}
                    </button>
                </div>

                {/* Interactive Purchase Actions: Size & Quantity */}
                <div className="vendor-purchase-actions">
                    <div className="vendor-size-selector">
                        <div className="vendor-size-header-row">
                            <span className="vendor-size-label">Select Size</span>
                            <button
                                type="button"
                                className="vendor-size-guide-trigger"
                                onClick={() => alert("Size Guide: Fits true to standard international sizing. Choose your normal size.")}
                            >
                                Size Guide
                            </button>
                        </div>
                        <div className="vendor-size-chips">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    className={`vendor-size-chip ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity Picker */}
                    <div className="vendor-quantity-row">
                        <span className="vendor-qty-label">Quantity</span>
                        <div className="vendor-qty-stepper">
                            <button
                                type="button"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="vendor-qty-val">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(q => q + 1)}
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="vendor-cta-group">
                        <button
                            type="button"
                            className="vendor-add-to-cart-btn"
                            onClick={() => onAddToCart?.(selectedSize, quantity)}
                        >
                            Add to Cart
                        </button>
                        <button
                            type="button"
                            className="vendor-buy-now-btn"
                            onClick={() => onBuyNow?.(selectedSize, quantity)}
                        >
                            Buy It Now
                        </button>
                    </div>
                </div>

                {/* Virtual Try-On Banner */}
                <div
                    className="vendor-tryon-callout-banner"
                    onClick={onOpenTryOn}
                    role="button"
                    tabIndex={0}
                >
                    <div className="vendor-tryon-icon-wrap">
                        <Shirt size={20} />
                    </div>
                    <div className="vendor-tryon-banner-text">
                        <span>Not sure about the fit?</span>
                        <strong>Try it on virtually with AI</strong>
                    </div>
                </div>

                {/* Instagram-Style Comments Trigger Card */}
                <button
                    type="button"
                    className="vendor-comments-trigger-card"
                    onClick={onOpenComments}
                    title="View comments & reviews"
                >
                    <div className="vendor-comments-card-left">
                        <div className="vendor-comments-icon-bubble">
                            <MessageCircle size={18} />
                        </div>
                        <div className="vendor-comments-preview-col">
                            <div className="vendor-comments-title-line">
                                <span className="vendor-comments-heading">Comments & Reviews</span>
                                <span className="vendor-comments-badge">
                                    {Array.isArray(comments) ? comments.length : 0}
                                </span>
                            </div>
                            {comments && comments.length > 0 ? (
                                <span className="vendor-comments-snippet">
                                    <strong>{comments[0].userName || comments[0].author}:</strong>{' '}
                                    {comments[0].commentText || comments[0].text}
                                </span>
                            ) : (
                                <span className="vendor-comments-snippet empty">
                                    Be the first to share your thoughts...
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="vendor-comments-card-right">
                        <span>{comments && comments.length > 0 ? `View all ${comments.length}` : 'Leave Review'}</span>
                        <ChevronRight size={16} />
                    </div>
                </button>
            </div>
        </aside>
    );
}
