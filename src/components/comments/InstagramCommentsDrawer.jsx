'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Heart, Send, Sparkles, CornerDownRight } from 'lucide-react';
import './InstagramCommentsDrawer.css';

const QUICK_EMOJIS = ['❤️', '🔥', '😍', '👏', '✨', '👗', '🤍', '🛍️'];

export default function InstagramCommentsDrawer({
  isOpen,
  onClose,
  comments = [],
  onAddComment,
  isSubmitting = false,
  product = null,
  currentUser = null,
}) {
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [likedCommentIds, setLikedCommentIds] = useState({});
  const inputRef = useRef(null);
  const listEndRef = useRef(null);

  // Close on Escape key and prevent background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Focus input when opened
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentUserName = currentUser?.name || 'Sarah Lin';
  const currentUserAvatar = currentUser?.avatar || null;
  const currentUserInitials = currentUserName.slice(0, 2).toUpperCase();

  const handlePost = async () => {
    if (!inputText.trim() || isSubmitting) return;
    const textToSend = inputText.trim();
    setInputText('');
    setReplyingTo(null);
    await onAddComment(textToSend);
    setTimeout(() => {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEmojiClick = (emoji) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleReplyClick = (authorName) => {
    setReplyingTo(authorName);
    setInputText(`@${authorName} `);
    inputRef.current?.focus();
  };

  const handleToggleCommentLike = (commentId) => {
    setLikedCommentIds((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const productTitle = product?.title || product?.name || 'VogueGarment';
  const productImage = product?.images?.[0] || product?.image || product?.imageUrl || null;
  const productPrice = product?.price ? `$${product.price}` : null;
  const productBrand = product?.brand || product?.author || 'VogueSocial Atelier';

  return createPortal(
    <div className="ig-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="ig-drawer-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="ig-drawer-handle" />

        {/* Drawer Header */}
        <div className="ig-drawer-header">
          <div className="ig-drawer-title-group">
            <h3 className="ig-drawer-title">Comments</h3>
            <span className="ig-drawer-count-badge">{comments.length}</span>
          </div>
          <button
            type="button"
            className="ig-drawer-close-btn"
            onClick={onClose}
            aria-label="Close comments"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mini Product Context Bar */}
        <div className="ig-drawer-context-bar">
          {productImage && (
            <img
              src={productImage}
              alt={productTitle}
              className="ig-drawer-context-thumb"
            />
          )}
          <div className="ig-drawer-context-info">
            <h4 className="ig-drawer-context-title">{productTitle}</h4>
            <span className="ig-drawer-context-meta">
              {productBrand} {productPrice && `· ${productPrice}`}
            </span>
          </div>
        </div>

        {/* Scrollable Comments List */}
        <div className="ig-drawer-comments-list">
          {comments.length === 0 ? (
            <div className="ig-drawer-empty-state">
              <div className="ig-drawer-empty-icon">
                <MessageCircle size={32} />
              </div>
              <h4 className="ig-drawer-empty-title">No comments yet</h4>
              <p className="ig-drawer-empty-subtitle">
                Be the first to share your thoughts, fit questions, or style tips on this look.
              </p>
            </div>
          ) : (
            comments.map((comment, idx) => {
              const id = comment.id || `cmt_${idx}`;
              const name = comment.userName || comment.author || 'Fashionista';
              const text = comment.commentText || comment.text || '';
              const avatar = comment.userAvatar;
              const initials = name.slice(0, 2).toUpperCase();
              const isLiked = !!likedCommentIds[id];
              const dateStr = comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Just now';

              return (
                <div key={id} className="ig-comment-row">
                  {avatar ? (
                    <img src={avatar} alt={name} className="ig-comment-avatar" />
                  ) : (
                    <div className="ig-comment-avatar-fallback">{initials}</div>
                  )}

                  <div className="ig-comment-content">
                    <div className="ig-comment-bubble">
                      <div className="ig-comment-header-line">
                        <span className="ig-comment-username">{name}</span>
                        <span className="ig-comment-time">{dateStr}</span>
                      </div>
                      <p className="ig-comment-text">{text}</p>
                    </div>

                    <div className="ig-comment-actions">
                      <button
                        type="button"
                        className="ig-comment-reply-btn"
                        onClick={() => handleReplyClick(name)}
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`ig-comment-heart-btn ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleToggleCommentLike(id)}
                    title={isLiked ? 'Unlike comment' : 'Like comment'}
                  >
                    <Heart
                      size={15}
                      fill={isLiked ? '#ef4444' : 'none'}
                      color={isLiked ? '#ef4444' : '#94a3b8'}
                    />
                  </button>
                </div>
              );
            })
          )}
          <div ref={listEndRef} />
        </div>

        {/* Pinned Bottom Input Bar */}
        <div className="ig-drawer-footer">
          {/* Quick Reaction Emojis Bar */}
          <div className="ig-emoji-bar">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="ig-emoji-pill"
                onClick={() => handleEmojiClick(emoji)}
                title={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Replying indicator */}
          {replyingTo && (
            <div className="ig-replying-bar">
              <CornerDownRight size={13} color="#8b5cf6" />
              <span>Replying to <strong>@{replyingTo}</strong></span>
              <button
                type="button"
                className="ig-reply-cancel-btn"
                onClick={() => {
                  setReplyingTo(null);
                  setInputText('');
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input Row */}
          <div className="ig-input-row">
            {currentUserAvatar ? (
              <img src={currentUserAvatar} alt={currentUserName} className="ig-current-user-avatar" />
            ) : (
              <div className="ig-current-user-fallback">{currentUserInitials}</div>
            )}

            <div className="ig-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                className="ig-comment-input"
                placeholder={`Add a comment as ${currentUserName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePost();
                  }
                }}
              />
              <button
                type="button"
                className="ig-post-btn"
                disabled={!inputText.trim() || isSubmitting}
                onClick={handlePost}
              >
                {isSubmitting ? (
                  <span className="ig-post-spinner" />
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
