import React from 'react';
import { useFeedPosts } from '@/hooks/useFeedPosts';
import FeedTabs from './FeedTabs';
import FeedGrid from './FeedGrid';
import FeedEmptyState from './FeedEmptyState';
import './Feed.css';

export default function Feed({ searchQuery = '' }) {
  const {
    posts,
    activeTab,
    setActiveTab,
    stats,
    following,
    toggleFollow,
    handleToggleLike,
    tabs
  } = useFeedPosts(searchQuery);

  return (
    <div className="feed-container">
      <div className="container">
        {/* Tab Controls */}
        <FeedTabs
          tabs={tabs}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Dynamic Card Grid or Empty State */}
        {posts.length > 0 ? (
          <FeedGrid
            posts={posts}
            stats={stats}
            following={following}
            onToggleFollow={toggleFollow}
            onToggleLike={handleToggleLike}
          />
        ) : (
          <FeedEmptyState
            activeTab={activeTab}
            searchQuery={searchQuery}
            onExplore={() => setActiveTab('foryou')}
          />
        )}
      </div>
    </div>
  );
}
