'use client';
import React from 'react';
import { Link } from 'react-router-dom';
import Image from '@/components/Image';
import { Heart, MessageCircle, Share2, Star, Shirt, ShoppingBag, ChevronRight } from 'lucide-react';
import { formatLikes } from './ProductFloatingActions';
import './CommunityProductDetails.css';

const parseSafeCount = (val, fallback = 0) => {
    const num = Number(val);
    return (Number.isFinite(num) && !isNaN(num) && num >= 0) ? num : fallback;
};

export default function CommunityProductDetails({
    post,
    commentCount = 0,
    comments = [],
    likesCount = 1240,
    isLiked = false,
    onToggleLike,
    following = false,
    onToggleFollow,
    onSelectTryOnGarment,
    onSelectBuyGarment,
    onOpenComments
}) {
    if (!post) return null;

    const brandHandle = post.taggedBrandHandle || post.taggedProducts?.[0]?.brandHandle || 'studiolabel';
    const brandDisplay = post.taggedBrandDisplay || (post.taggedProducts?.[0]?.brand?.includes('Elena') ? 'ElenaCouture' : 'StudioLabel');

    return (
        <aside className="community-details-sidebar">
            {/* User Profile Header Card */}
            <div className="community-profile-card">
                <div className="community-profile-header">
                    <div className="community-avatar-wrap">
                        {post.avatar ? (
                            <Image
                                src={post.avatar}
                                alt={post.author}
                                fill
                                className="community-media-cover"
                            />
                        ) : null}
                    </div>

                    <div className="community-profile-info">
                        <h3 className="community-author-name">{post.author}</h3>
                        <div className="community-wearing-tag-row">
                            <span className="community-wearing-label">wearing</span>
                            <Link
                                to={`/store/${brandHandle}`}
                                className="community-brand-pill-link"
                            >
                                @{brandDisplay}
                            </Link>
                        </div>
                    </div>

                    <button
                        type="button"
                        className={`community-follow-btn ${following ? 'following' : ''}`}
                        onClick={onToggleFollow}
                    >
                        {following ? 'Following' : 'Follow'}
                    </button>
                </div>

                <p className="community-caption-text">
                    "{post.description}"
                </p>

                {/* Engagement Bar */}
                <div className="community-stats-bar">
                    <button
                        type="button"
                        className={`community-stat-clickable ${isLiked ? 'liked' : ''}`}
                        onClick={onToggleLike}
                        title="Like"
                    >
                        <Heart
                            size={18}
                            fill={isLiked ? "#ef4444" : "none"}
                            color={isLiked ? "#ef4444" : "currentColor"}
                        />
                        <span>{formatLikes(likesCount)}</span>
                    </button>

                    <button
                        type="button"
                        className="community-stat-clickable"
                        onClick={onOpenComments}
                        title="View comments"
                    >
                        <MessageCircle size={18} />
                        <span>{parseSafeCount(commentCount || comments.length, 0)}</span>
                    </button>

                    <div className="community-stat-item">
                        <Share2 size={18} />
                    </div>
                </div>
            </div>

            {/* Featured Garment in this Try-On Showcase */}
            {post.taggedProducts && post.taggedProducts.length > 0 && (
                <section className="community-featured-garments-section">
                    <div className="community-garments-header">
                        <div>
                            <span className="community-overline">FEATURED GARMENT</span>
                            <h4 className="community-garments-heading">Garment in this Try-On</h4>
                        </div>
                        <span className="community-verified-badge">
                            ✓ Verified Fit
                        </span>
                    </div>

                    <div className="community-garments-list">
                        {post.taggedProducts.map((prod) => (
                            <div key={prod.id || prod.name} className="community-garment-card">
                                <div className="community-garment-thumb">
                                    <Image
                                        src={prod.image}
                                        alt={prod.name}
                                        fill
                                        className="community-media-cover"
                                    />
                                    {prod.category && (
                                        <span className="community-category-tag">
                                            {prod.category}
                                        </span>
                                    )}
                                </div>

                                <div className="community-garment-details">
                                    <div className="community-garment-brand-row">
                                        <span className="community-garment-brand">
                                            {prod.brand || "Vogue Collection"}
                                        </span>
                                        <div className="community-garment-rating">
                                            <Star size={12} fill="#eab308" color="#eab308" />
                                            <span>{prod.rating || 4.9}</span>
                                        </div>
                                    </div>

                                    <h5 className="community-garment-title">{prod.name}</h5>
                                    <div className="community-garment-price">{prod.price}</div>

                                    <div className="community-fit-note-row">
                                        <span className="community-fit-dot"></span>
                                        <span className="community-fit-text">
                                            {post.fitNote || 'Tried in Size M · True-to-size'}
                                        </span>
                                    </div>

                                    <div className="community-garment-actions">
                                        <button
                                            type="button"
                                            className="community-try-on-btn"
                                            onClick={() => onSelectTryOnGarment?.(prod)}
                                        >
                                            <Shirt size={14} />
                                            <span>Try It On You</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="community-buy-btn"
                                            onClick={() => onSelectBuyGarment?.(prod)}
                                        >
                                            <ShoppingBag size={14} />
                                            <span>Buy It Now</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Instagram-Style Comments Trigger Card */}
            <button
                type="button"
                className="community-comments-trigger-card"
                onClick={onOpenComments}
                title="View comments"
            >
                <div className="community-comments-left">
                    <div className="community-comments-bubble">
                        <MessageCircle size={18} />
                    </div>
                    <div className="community-comments-text-col">
                        <div className="community-comments-title-row">
                            <span className="community-comments-title">Comments</span>
                            <span className="community-comments-count-pill">
                                {Array.isArray(comments) ? comments.length : 0}
                            </span>
                        </div>
                        {comments && comments.length > 0 ? (
                            <span className="community-comments-snippet">
                                <strong>{comments[0].userName || comments[0].author}:</strong>{' '}
                                {comments[0].commentText || comments[0].text}
                            </span>
                        ) : (
                            <span className="community-comments-snippet empty">
                                Leave a comment on this fit...
                            </span>
                        )}
                    </div>
                </div>
                <div className="community-comments-right">
                    <span>{comments && comments.length > 0 ? `View all ${comments.length}` : 'Comment'}</span>
                    <ChevronRight size={16} />
                </div>
            </button>
        </aside>
    );
}
