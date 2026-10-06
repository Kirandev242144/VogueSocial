import React from 'react';
import MerchantCard from './MerchantCard';
import CommunityTryOnCard from './CommunityTryOnCard';
import './FeedGrid.css';

export default function FeedGrid({ posts, stats, following, onToggleFollow, onToggleLike }) {
  return (
    <div className="feed-grid">
      {posts.map(post => {
        const isUserPost = post.type === 'user';
        const targetHandle = isUserPost
          ? (post.taggedBrandHandle || post.taggedProducts?.[0]?.brandHandle || 'studiolabel')
          : (post.storeHandle || post.author.toLowerCase().replace(/[^a-z0-9]/g, ''));

        const isFollowing = !!following[targetHandle];
        const postStat = stats[String(post.id)];

        if (isUserPost) {
          return (
            <CommunityTryOnCard
              key={post.id}
              post={post}
              isFollowing={isFollowing}
              onToggleFollow={onToggleFollow}
              postStat={postStat}
              onToggleLike={onToggleLike}
            />
          );
        }

        return (
          <MerchantCard
            key={post.id}
            post={post}
            isFollowing={isFollowing}
            onToggleFollow={onToggleFollow}
            postStat={postStat}
            onToggleLike={onToggleLike}
          />
        );
      })}
    </div>
  );
}
