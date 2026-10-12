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
    <div className="admin-filter-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
      {/* Status Segmented Tabs */}
      <div className="admin-filter-tabs">
        {tabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`admin-filter-tab ${isActive ? 'admin-filter-tab-active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: isActive ? 700 : 500
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '1px 6px',
                  borderRadius: '99px',
                  background: isActive ? 'var(--adm-border)' : 'var(--adm-panel-hover)',
                  color: isActive ? 'var(--adm-text-main)' : 'var(--adm-text-sub)',
                  fontWeight: 700
                }}
              >
                {tab.count ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Spacious Search Input with Clear Button */}
      <div className="admin-search-box" style={{ minWidth: '280px', flex: '0 1 320px', position: 'relative' }}>
        <Search size={14} className="admin-search-icon" />
        <input
          type="text"
          placeholder="Search by order #, customer, boutique, or courier..."
          className="admin-search-input"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ paddingRight: search ? '2rem' : '0.85rem' }}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{
              position: 'absolute',
              right: '0.65rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: 'var(--adm-text-sub)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
            title="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
