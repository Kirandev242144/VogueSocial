import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle } from 'lucide-react';
import Image from '../Image';
import PostCardHeader from './PostCardHeader';
import './CommunityTryOnCard.css';

export default function CommunityTryOnCard({ post, isFollowing, onToggleFollow, postStat, onToggleLike }) {
  const isLiked = postStat?.isLiked ?? false;
  const likeCount = postStat?.likeCount ?? post.likes ?? 0;
  const commentCount = postStat?.commentCount ?? post.comments ?? 0;

  return (
    <div className="user-card">
      <PostCardHeader
        post={post}
        isFollowing={isFollowing}
        onToggleFollow={onToggleFollow}
      />

      <Link to={`/product/${post.id}`} className="card-content-link">
        <div className="user-content">
          <div className="user-image-container">
            {post.image ? (
              <Image
                src={post.image}
                alt={`Tried by ${post.author}`}
                fill
                className="user-image"
              />
            ) : null}
            <div className="tried-badge">
              ✨ Tried via VogueSocial
            </div>
          </div>

          <div className="user-actions">
            <div className="user-metrics">
              <button
                type="button"
                className={`metric-btn ${isLiked ? 'metric-btn-active' : ''}`}
                onClick={(e) => onToggleLike(post.id, e)}
              >
                <Heart size={18} className={isLiked ? 'heart-liked' : ''} />
                <span>{likeCount > 1000 ? (likeCount / 1000).toFixed(1) + 'k' : likeCount}</span>
              </button>
              <div className="metric-btn">
                <MessageCircle size={18} />
                <span>{commentCount}</span>
              </div>
            </div>
            <div className="try-similar-btn">Try Similar</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
