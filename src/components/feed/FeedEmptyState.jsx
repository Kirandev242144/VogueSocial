import React from 'react';
import './FeedEmptyState.css';

export default function FeedEmptyState({ activeTab, searchQuery, onExplore }) {
  if (activeTab === 'following') {
    return (
      <div className="empty-feed">
        <h3>No Followed Brands Yet</h3>
        <p>Follow fashion houses like Studio Label Paris or Elena Couture in the feed to see their latest collection drops and fit checks here.</p>
        <button className="explore-btn" onClick={onExplore}>
          Explore For You
        </button>
      </div>
    );
  }

  return (
    <div className="empty-feed">
      <h3>No results found for "{searchQuery}"</h3>
      <p>Try searching for collections, silhouettes, designers, or categories.</p>
    </div>
  );
}
