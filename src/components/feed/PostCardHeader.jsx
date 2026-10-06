import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../Image';
import './PostCardHeader.css';

export default function PostCardHeader({ post, isFollowing, onToggleFollow }) {
  const isUserPost = post.type === 'user';
  const brandHandle = post.storeHandle || post.author.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Tagged brand info for Community Try-On cards
  const taggedBrandName = post.taggedBrand || post.taggedProducts?.[0]?.brand || 'Studio Label Paris';
  const taggedBrandHandle = post.taggedBrandHandle || post.taggedProducts?.[0]?.brandHandle || (taggedBrandName.toLowerCase().includes('elena') ? 'elenacouture' : 'studiolabel');
  const taggedBrandDisplay = post.taggedBrandDisplay || (taggedBrandHandle === 'elenacouture' ? 'ElenaCouture' : 'StudioLabel');

  if (isUserPost) {
    return (
      <div className="post-card-header">
        <div className="user-header-left">
          <div className="author-avatar">
            {post.avatar ? <Image src={post.avatar} alt={post.author} fill /> : null}
          </div>
          <div className="author-info">
            <span className="author-name">{post.author}</span>
            <div className="wearing-attribution">
              <span className="wearing-label">wearing</span>
              <Link
                to={`/store/${taggedBrandHandle}`}
                className="tagged-brand-link"
                onClick={(e) => e.stopPropagation()}
                title={`Visit ${taggedBrandName} Storefront`}
              >
                @{taggedBrandDisplay}
              </Link>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`follow-btn ${isFollowing ? 'following' : ''}`}
          onClick={(e) => onToggleFollow(taggedBrandHandle, e)}
          title={`Follow @${taggedBrandDisplay}`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    );
  }

  // Merchant Brand Header
  return (
    <div className="post-card-header">
      <Link to={`/store/${brandHandle}`} className="author-link">
        <div className="author-avatar">
          {post.avatar ? <Image src={post.avatar} alt={post.author} fill /> : null}
        </div>
        <div className="author-info">
          <div className="brand-title-row">
            <span className="author-name">{post.author}</span>
            <span className="brand-badge">Brand</span>
          </div>
          <span className="brand-handle-sub">@{brandHandle}</span>
        </div>
      </Link>
      <button
        type="button"
        className={`follow-btn ${isFollowing ? 'following' : ''}`}
        onClick={(e) => onToggleFollow(brandHandle, e)}
        title={`Follow @${brandHandle}`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}
