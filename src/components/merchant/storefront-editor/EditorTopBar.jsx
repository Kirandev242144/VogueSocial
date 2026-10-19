"use client";
import React from 'react';
import {
  Monitor, Tablet, Smartphone, ExternalLink, Save, RotateCcw, Loader2
} from 'lucide-react';

export default function EditorTopBar({
  editorState,
  viewport,
  setViewport,
  saving,
  liveUrl,
  onReset,
  onSave,
  isStandalone = false
}) {
  const storeInitial = (editorState.store_name || 'S').charAt(0).toUpperCase();
  const themeName = (editorState.template || 'modern').toUpperCase();
  const subdomain = editorState.subdomain || 'studiolabel';

  return (
    <header className="editor-topbar">
      {/* Brand & Store Identity */}
      <div className="editor-topbar-left">
        {isStandalone && (
          <a
            href="/merchant/website"
            className="editor-btn-secondary"
            title="Return to Merchant Portal"
          >
            ← Portal Hub
          </a>
        )}
        <div className="editor-store-avatar">
          {storeInitial}
        </div>
        <div className="editor-store-info">
          <div className="editor-store-title-row">
            <h2 className="editor-store-title">{editorState.store_name}</h2>
            <span className="editor-status-badge">
              <span className="editor-status-dot" />
              <span>Live Storefront</span>
            </span>
          </div>
          <span className="editor-store-subtitle">
            {subdomain}.voguesocial.com · {themeName} Theme
          </span>
        </div>
      </div>

      {/* Viewport Simulation Controls */}
      <div className="editor-topbar-center">
        <div className="editor-viewport-group">
          <button
            type="button"
            className={`editor-viewport-btn ${viewport === 'desktop' ? 'editor-viewport-btn-active' : ''}`}
            onClick={() => setViewport('desktop')}
            title="Desktop View (1200px)"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            className={`editor-viewport-btn ${viewport === 'tablet' ? 'editor-viewport-btn-active' : ''}`}
            onClick={() => setViewport('tablet')}
            title="Tablet View (768px)"
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>
          <button
            type="button"
            className={`editor-viewport-btn ${viewport === 'mobile' ? 'editor-viewport-btn-active' : ''}`}
            onClick={() => setViewport('mobile')}
            title="Mobile View (375px)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Editor Action Buttons */}
      <div className="editor-topbar-right">
        <button
          type="button"
          className="editor-btn-secondary"
          onClick={onReset}
          title="Reset theme and sections to defaults"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>

        <a
          href={liveUrl}
          target="_blank"
          rel="noreferrer"
          className="editor-btn-secondary"
          title="Open live storefront in new browser tab"
        >
          <ExternalLink size={13} />
          <span>Visit Live</span>
        </a>

        <button
          type="button"
          className="editor-btn-primary"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <Loader2 size={14} className="editor-spin" />
          ) : (
            <Save size={14} />
          )}
          <span>{saving ? 'Publishing...' : 'Save & Publish'}</span>
        </button>
      </div>
    </header>
  );
}
