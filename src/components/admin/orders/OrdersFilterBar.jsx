"use client";
import React from 'react';
import { Search, X } from 'lucide-react';

export default function OrdersFilterBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  tabs = []
}) {
  return (
    <div className="ofb-bar">
      {/* Status Segmented Tabs */}
      <div className="ofb-tabs">
        {tabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`ofb-tab ${isActive ? 'ofb-tab-active' : ''}`}
            >
              <span>{tab.label}</span>
              <span className="ofb-tab-count">
                {tab.count ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input with Clear Button */}
      <div className="ofb-search-box">
        <Search size={14} className="ofb-search-icon" />
        <input
          type="text"
          placeholder="Search by order #, customer, merchant, or courier..."
          className="admin-input ofb-search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="ofb-search-clear"
            title="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
