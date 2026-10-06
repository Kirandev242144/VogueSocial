import React from 'react';
import './FeedTabs.css';

export default function FeedTabs({ tabs, activeTab, onSelectTab }) {
  return (
    <div className="feed-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`feed-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onSelectTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
