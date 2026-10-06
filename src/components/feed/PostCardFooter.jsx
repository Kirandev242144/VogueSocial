import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import './PostCardFooter.css';

export default function PostCardFooter({ post, isLiked, onToggleLike }) {
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const title = post.storyTitle || post.productName || 'VogueSocial Fashion Look';
    const url = `${window.location.origin}/product/${post.id}`;

    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="card-footer">
      <span className="story-label" title={post.storyTitle || post.productName}>
        {post.storyTitle || post.productName}
      </span>
      <div className="card-actions">
        <button
          type="button"
          className={`card-action-btn ${isLiked ? 'action-btn-active' : ''}`}
          onClick={(e) => onToggleLike(post.id, e)}
          title="Like"
          aria-label="Like post"
        >
          <Heart size={18} className={isLiked ? 'heart-liked' : ''} />
        </button>
        <button
          type="button"
          className="card-action-btn"
          onClick={handleShare}
          title="Share"
          aria-label="Share post"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
