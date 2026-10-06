'use client';
import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import './ProductFloatingActions.css';

export const formatLikes = (val) => {
    const num = Number(val);
    if (!Number.isFinite(num) || isNaN(num) || num <= 0) return '1.2k';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return String(Math.floor(num));
};

export default function ProductFloatingActions({
    likesCount = 1240,
    isLiked = false,
    isSaved = false,
    commentsCount = 0,
    onToggleLike,
    onOpenComments,
    onToggleSave,
    onShare
}) {
    return (
        <div className="product-floating-rail">
            <div className="product-action-unit">
                <button
                    type="button"
                    className={`product-action-circle-btn ${isLiked ? 'liked' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike?.();
                    }}
                    title={isLiked ? "Unlike" : "Like"}
                    aria-label="Like item"
                >
                    <Heart
                        size={22}
                        fill={isLiked ? "#ef4444" : "none"}
                        color={isLiked ? "#ef4444" : "#0f172a"}
                        className={isLiked ? "product-heart-pulse" : ""}
                    />
                </button>
                <span className="product-action-pill-label">
                    {formatLikes(likesCount)}
                </span>
            </div>

            <div className="product-action-unit">
                <button
                    type="button"
                    className="product-action-circle-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenComments?.();
                    }}
                    title="View comments & reviews"
                    aria-label="View comments"
                >
                    <MessageCircle size={22} color="#0f172a" />
                </button>
                <span className="product-action-pill-label">
                    {Number.isFinite(Number(commentsCount)) ? commentsCount : 0}
                </span>
            </div>

            <div className="product-action-unit">
                <button
                    type="button"
                    className="product-action-circle-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onShare?.();
                    }}
                    title="Share look"
                    aria-label="Share"
                >
                    <Share2 size={21} color="#0f172a" />
                </button>
                <span className="product-action-pill-label">Share</span>
            </div>

            <div className="product-action-unit">
                <button
                    type="button"
                    className={`product-action-circle-btn ${isSaved ? 'saved' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave?.();
                    }}
                    title={isSaved ? "Saved to Wardrobe" : "Save item"}
                    aria-label="Save item"
                >
                    <Bookmark
                        size={21}
                        fill={isSaved ? "#8b5cf6" : "none"}
                        color={isSaved ? "#8b5cf6" : "#0f172a"}
                    />
                </button>
                <span className="product-action-pill-label">
                    {isSaved ? "Saved" : "Save"}
                </span>
            </div>
        </div>
    );
}
