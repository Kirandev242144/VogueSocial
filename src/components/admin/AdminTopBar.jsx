"use client";
import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function AdminTopBar({
  title,
  subtitle,
  onRefresh,
  refreshing = false,
  children
}) {
  return (
    <div className="admin-topbar">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>

      <div className="admin-topbar-actions">
        {children}
        {onRefresh && (
          <button
            type="button"
            className="admin-btn admin-btn-ghost"
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh dataset"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        )}
      </div>
    </div>
  );
}
