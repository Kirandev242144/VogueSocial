import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Shirt } from 'lucide-react';
import Image from '../Image';
import PostCardHeader from './PostCardHeader';
import PostCardFooter from './PostCardFooter';
import './MerchantCard.css';

export default function MerchantCard({ post, isFollowing, onToggleFollow, postStat, onToggleLike }) {
  const isLiked = postStat?.isLiked ?? false;
  const hasMultipleImages = post.images && post.images.length > 1;

  return (
    <div className="merchant-card">
      <PostCardHeader
        post={post}
        isFollowing={isFollowing}
        onToggleFollow={onToggleFollow}
      />

      <Link to={`/product/${post.id}`} className="card-content-link">
        <div className={`image-grid ${!hasMultipleImages ? 'single-image-grid' : ''}`}>
          {/* Main Visual */}
          <div className="main-image-container">
            {post.type === 'video' ? (
              <>
                <video src={post.videoUrl} className="post-video" loop muted playsInline autoPlay />
                <div className="play-overlay">
                  <div className="play-button">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={(post.images && post.images[0]) || post.image || '/Shop_images/1/basic2-500x750.jpeg'}
                alt={post.productName || 'Main product'}
                fill
                className="post-image"
              />
            )}
            <div className="try-on-btn">
              <Shirt size={14} /> Try On
            </div>
          </div>

          {/* Side Thumbnail Columns */}
          {hasMultipleImages && (
            <div className="side-images-container">
              <div className="side-image-wrapper">
                {post.images[1] ? (
                  <Image src={post.images[1]} alt="Product Detail 1" fill className="post-image" />
                ) : null}
              </div>
              {post.images[2] ? (
                <div className="side-image-wrapper">
                  <Image src={post.images[2]} alt="Product Detail 2" fill className="post-image" />
                  {post.moreCount > 0 ? (
                    <div className="more-overlay">+{post.moreCount}</div>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </div>

        <PostCardFooter
          post={post}
          isLiked={isLiked}
          onToggleLike={onToggleLike}
        />
      </Link>
    </div>
  );
}
