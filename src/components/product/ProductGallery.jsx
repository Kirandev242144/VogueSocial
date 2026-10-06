'use client';
import React from 'react';
import Image from '@/components/Image';
import { Heart, Shirt } from 'lucide-react';
import ProductFloatingActions from './ProductFloatingActions';
import './ProductGallery.css';

export default function ProductGallery({
    post,
    currentImage,
    selectedImage,
    onSelectImage,
    isLiked,
    isSaved,
    likesCount,
    commentsCount,
    onToggleLike,
    onOpenComments,
    onToggleSave,
    onShare,
    onOpenTryOn,
    showHeartAnimation,
    onImageDoubleClick
}) {
    if (!post) return null;

    // 1. Community User Try-On Post Layout
    if (post.type === 'user') {
        return (
            <div className="product-visual-section">
                <div
                    className="product-main-visual"
                    onDoubleClick={onImageDoubleClick}
                    title="Double-click to like"
                >
                    <Image
                        src={post.image}
                        alt={post.author || "User Try-On"}
                        fill
                        className="product-media-contain"
                    />

                    {/* Big Double-Tap Heart Animation */}
                    {showHeartAnimation && (
                        <div className="product-double-tap-heart">
                            <Heart size={90} fill="#ef4444" color="#ef4444" />
                        </div>
                    )}

                    {/* Floating Instagram Action Buttons */}
                    <ProductFloatingActions
                        likesCount={likesCount}
                        isLiked={isLiked}
                        isSaved={isSaved}
                        commentsCount={commentsCount}
                        onToggleLike={onToggleLike}
                        onOpenComments={onOpenComments}
                        onToggleSave={onToggleSave}
                        onShare={onShare}
                    />

                    <div className="product-tried-via-badge">
                        <span className="product-sparkle-icon">✨</span>
                        <span>Tried via VogueSocial</span>
                    </div>

                    <button
                        type="button"
                        className="product-tryon-visual-btn"
                        onClick={onOpenTryOn}
                    >
                        <Shirt size={16} />
                        <span>Virtual Try-On</span>
                    </button>
                </div>
            </div>
        );
    }

    // 2. Vendor Product & Editorial Video Multi-Angle Layout
    return (
        <div className="product-visual-section">
            <div className="product-gallery-layout">
                {/* Vertical Thumbnails Column */}
                <div className="product-thumbnails-column">
                    {post.images?.map((img, i) => (img ? (
                        <div
                            key={i}
                            className={`product-thumbnail-item ${currentImage === img ? 'active' : ''}`}
                            onClick={() => onSelectImage?.(img)}
                            title={`Angle ${i + 1}`}
                        >
                            <Image
                                src={img}
                                alt={`Angle view ${i + 1}`}
                                fill
                                className="product-media-cover"
                            />
                        </div>
                    ) : null))}
                </div>

                {/* Main View Area (Image or Video) */}
                <div
                    className="product-gallery-main-display"
                    onDoubleClick={onImageDoubleClick}
                    title="Double-click to like"
                >
                    {post.type === 'video' && post.videoUrl && !selectedImage ? (
                        <video
                            src={post.videoUrl}
                            className="product-video-display"
                            loop
                            muted
                            autoPlay
                            playsInline
                            controls
                        />
                    ) : (
                        currentImage ? (
                            <Image
                                src={currentImage}
                                alt={post.productName || "Product View"}
                                fill
                                className="product-media-contain"
                            />
                        ) : null
                    )}

                    {/* Big Double-Tap Heart Animation */}
                    {showHeartAnimation && (
                        <div className="product-double-tap-heart">
                            <Heart size={90} fill="#ef4444" color="#ef4444" />
                        </div>
                    )}

                    {/* Floating Instagram Action Buttons */}
                    <ProductFloatingActions
                        likesCount={likesCount}
                        isLiked={isLiked}
                        isSaved={isSaved}
                        commentsCount={commentsCount}
                        onToggleLike={onToggleLike}
                        onOpenComments={onOpenComments}
                        onToggleSave={onToggleSave}
                        onShare={onShare}
                    />

                    {/* Top-Right Virtual Try-On Badge */}
                    <div
                        className="product-floating-tryon-badge"
                        onClick={onOpenTryOn}
                        title="Try garment with AI"
                    >
                        <Shirt size={16} />
                        <span>Virtual Try-On</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
