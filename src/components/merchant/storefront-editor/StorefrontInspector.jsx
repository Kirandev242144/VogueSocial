"use client";
import React from 'react';
import { Layout, Palette, Globe, Compass } from 'lucide-react';
import {
  SectionsInspector,
  NavigationInspector,
  ThemeInspector,
  DomainsInspector,
  HERO_PRESETS,
  TEMPLATES,
  ACCENT_PALETTES,
  FONT_PAIRINGS
} from './inspectors';

// Re-export constants for backward compatibility
export { HERO_PRESETS, TEMPLATES, ACCENT_PALETTES, FONT_PAIRINGS };

export default function StorefrontInspector({
  activeTab = 'sections',
  setActiveTab,
  editorState,
  updateState,
  focusedSection,
  setFocusedSection,
  domainState,
  updateDomainState,
  onVerifyDNS,
  dnsChecking,
  products = []
}) {
  return (
    <aside className="editor-inspector">
      {/* 4 Clean, Logical Inspector Navigation Tabs */}
      <div className="editor-inspector-tabs">
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'sections' ? 'editor-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('sections')}
          title="Section blocks: Header, Hero, Catalog, Story, Newsletter, Footer"
        >
          <Layout size={14} />
          <span>Sections</span>
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'navigation' ? 'editor-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('navigation')}
          title="Navigation links and dynamic category filtering"
        >
          <Compass size={14} />
          <span>Navigation</span>
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'theme' ? 'editor-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('theme')}
          title="Theme templates, brand palette, typography, and corner radius"
        >
          <Palette size={14} />
          <span>Themes</span>
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'domains' ? 'editor-tab-btn-active' : ''}`}
          onClick={() => setActiveTab('domains')}
          title="Managed subdomain, custom domain, and DNS verification"
        >
          <Globe size={14} />
          <span>Domains</span>
        </button>
      </div>

      {/* Inspector Panel Body */}
      <div className="editor-inspector-content">
        {activeTab === 'sections' && (
          <SectionsInspector
            editorState={editorState}
            updateState={updateState}
            focusedSection={focusedSection}
            setFocusedSection={setFocusedSection}
          />
        )}

        {activeTab === 'navigation' && (
          <NavigationInspector
            editorState={editorState}
            updateState={updateState}
            products={products}
          />
        )}

        {activeTab === 'theme' && (
          <ThemeInspector
            editorState={editorState}
            updateState={updateState}
          />
        )}

        {activeTab === 'domains' && (
          <DomainsInspector
            domainState={domainState}
            updateDomainState={updateDomainState}
            onVerifyDNS={onVerifyDNS}
            dnsChecking={dnsChecking}
          />
        )}
      </div>
    </aside>
  );
}
