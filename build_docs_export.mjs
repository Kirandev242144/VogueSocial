import fs from 'fs';
import path from 'path';

const ROOT_DIR = 'e:/antigravity/landing page';
const VIRTUAL_TRYON_DIR = path.join(ROOT_DIR, 'virtual-try-on');
const OUTPUT_DIRS = [
  path.join(ROOT_DIR, 'documentation_html'),
  path.join(VIRTUAL_TRYON_DIR, 'documentation_html'),
  path.join(VIRTUAL_TRYON_DIR, 'public', 'documentation_html')
];

console.log('Generating perfected documentation HTML/CSS export...');

// 1. Read files
const pageJsxPath = path.join(VIRTUAL_TRYON_DIR, 'src/app/documentation_v1/page.jsx');
const cssPath = path.join(VIRTUAL_TRYON_DIR, 'src/app/documentation_v1/DocumentationPage.css');
const dataJsPath = path.join(VIRTUAL_TRYON_DIR, 'src/app/documentation_v1/documentationData.js');

const pageJsx = fs.readFileSync(pageJsxPath, 'utf8');
const originalCss = fs.readFileSync(cssPath, 'utf8');

// Read GLOSSARY_TERMS & DOC_SECTIONS
const dataModule = await import('file:///' + dataJsPath.replace(/\\/g, '/'));
const { DOC_SECTIONS, GLOSSARY_TERMS } = dataModule;

// Lucide icon helper
const ICONS = {
  BookOpen: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  ShieldCheck: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
  Truck: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="13" x="1" y="5" rx="2"/><polygon points="17 8 20 8 23 11 23 18 17 18 17 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  CreditCard: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
  Cpu: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
  Database: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
  Terminal: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
  Smartphone: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
  Search: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  ExternalLink: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`,
  Copy: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  Check: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  ArrowRight: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  Lock: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  Sparkles: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
  Layers: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  RotateCcw: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  CheckCircle2: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  HelpCircle: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  FileCode: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 13 8 15 10 17"/><polyline points="14 17 16 15 14 13"/></svg>`,
  Box: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  Globe: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  DollarSign: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  Users: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  Store: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7a2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1-2 2 2 2 0 0 1-2-2"/></svg>`,
  ShoppingBag: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  Sliders: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  FileText: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`,
  Heart: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  MessageCircle: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`,
  Share2: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  Bookmark: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>`,
  UserPlus: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
  AlertTriangle: (w = 16, c = 'currentColor') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

// Robust style parser that handles nested parentheses like repeat(auto-fit, minmax(230px, 1fr))
function convertStyleObject(str) {
  const entries = [];
  let current = '';
  let inQuote = false;
  let quoteChar = '';
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (inQuote) {
      current += ch;
      if (ch === quoteChar) {
        inQuote = false;
      }
    } else {
      if (ch === "'" || ch === '"' || ch === '`') {
        inQuote = true;
        quoteChar = ch;
        current += ch;
      } else if (ch === '(') {
        parenDepth++;
        current += ch;
      } else if (ch === ')') {
        parenDepth--;
        current += ch;
      } else if (ch === ',' && parenDepth === 0) {
        entries.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  if (current.trim()) {
    entries.push(current.trim());
  }

  const cssRules = [];
  for (const entry of entries) {
    const colonIdx = entry.indexOf(':');
    if (colonIdx === -1) continue;
    const key = entry.slice(0, colonIdx).trim();
    let val = entry.slice(colonIdx + 1).trim();
    if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
      val = val.slice(1, -1);
    }
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssRules.push(`${cssKey}: ${val}`);
  }
  return cssRules.join('; ');
}

// Clean JSX conversion function
function jsxToHtml(rawJsx) {
  let html = rawJsx;

  // Replace className with class
  html = html.replace(/className=/g, 'class=');

  // Replace style={{ ... }} objects with inline styles
  html = html.replace(/style=\{\{\s*([\s\S]*?)\s*\}\}/g, (match, body) => {
    return `style="${convertStyleObject(body)}"`;
  });

  // Replace JSX comments {/* ... */}
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Replace Lucide Icon tags
  for (const [iconName, svgFn] of Object.entries(ICONS)) {
    const iconRegex = new RegExp(`<${iconName}\\s*([^>]*?)\\s*\\/>`, 'g');
    html = html.replace(iconRegex, (match, attrs) => {
      let size = 16;
      let color = 'currentColor';
      const sizeMatch = attrs.match(/size=\{?(\d+)\}?/);
      if (sizeMatch) size = parseInt(sizeMatch[1], 10);
      const colorMatch = attrs.match(/color=["']([^"']+)["']/);
      if (colorMatch) color = colorMatch[1];
      return svgFn(size, color);
    });
  }

  // Replace image paths from root to relative
  html = html.replace(/src="\/voguesocial_system_architecture\.jpg"/g, 'src="./assets/voguesocial_system_architecture.jpg"');
  html = html.replace(/href="\/voguesocial_system_architecture\.jpg"/g, 'href="./assets/voguesocial_system_architecture.jpg"');
  html = html.replace(/onClick=\{\(\)\s*=>\s*window\.open\([^)]*\)\}/g, 'onclick="window.open(\'./assets/voguesocial_system_architecture.jpg\', \'_blank\')"');

  // Clean template literals in pre tags: {` ... `} -> ...
  html = html.replace(/<pre([^>]*)>\s*\{\`([\s\S]*?)\`\}\s*<\/pre>/g, '<pre$1>$2</pre>');

  return html;
}

// Extract sections from page.jsx
const sectionIds = [
  'overview',
  'how-it-works',
  'payment-escrow',
  'logistics-delivery',
  'ai-tryon',
  'database-erd',
  'api-reference',
  'mobile-app',
  'glossary'
];

const articles = {};

for (const secId of sectionIds) {
  if (secId === 'glossary') {
    let glossaryHtml = `
      <article id="sec-glossary" class="doc-section">
        <div class="doc-article-header">
          <div class="doc-tag-row">
            <span class="doc-tag blue">Reference</span>
            <span class="doc-tag">A–Z Dictionary</span>
          </div>
          <h1 class="doc-article-title">VogueSocial Platform Glossary (A–Z)</h1>
          <p class="doc-article-lead">
            Definitions of critical commerce, payments, logistics, computer vision, and architecture terminology used throughout the platform.
          </p>
        </div>

        <div class="doc-glossary-filter-bar">
          <button type="button" class="doc-glossary-filter-btn active" data-cat="all">ALL</button>
          <button type="button" class="doc-glossary-filter-btn" data-cat="payments">PAYMENTS</button>
          <button type="button" class="doc-glossary-filter-btn" data-cat="logistics">LOGISTICS</button>
          <button type="button" class="doc-glossary-filter-btn" data-cat="ai / vision">AI / VISION</button>
          <button type="button" class="doc-glossary-filter-btn" data-cat="finance">FINANCE</button>
          <button type="button" class="doc-glossary-filter-btn" data-cat="security">SECURITY</button>
        </div>

        <div class="doc-glossary-grid">
    `;

    for (const term of GLOSSARY_TERMS) {
      glossaryHtml += `
        <div class="doc-glossary-card" data-category="${term.category.toLowerCase()}">
          <div class="doc-term-header">
            <span class="doc-term-name">${term.term}</span>
            <span class="doc-term-cat">${term.category}</span>
          </div>
          <p class="doc-term-def">${term.definition}</p>
        </div>
      `;
    }

    glossaryHtml += `
        </div>
      </article>
    `;

    articles[secId] = glossaryHtml;
    continue;
  }

  // Extract from pageJsx
  const secStartPattern = `{activeSection === '${secId}' && (`;
  const secStartIdx = pageJsx.indexOf(secStartPattern);
  if (secStartIdx !== -1) {
    const startOfArticle = pageJsx.indexOf('<article>', secStartIdx);
    const endOfArticle = pageJsx.indexOf('</article>', startOfArticle);
    if (startOfArticle !== -1 && endOfArticle !== -1) {
      let rawArticle = pageJsx.slice(startOfArticle, endOfArticle + '</article>'.length);
      rawArticle = rawArticle.replace(/<article>/, `<article id="sec-${secId}" class="doc-section ${secId === 'overview' ? 'active' : ''}">`);
      
      // Handle testAwb input & badge in logistics-delivery
      if (secId === 'logistics-delivery') {
        rawArticle = rawArticle.replace(/value=\{testAwb\}[^>]*onChange=\{[^}]*\}/g, 'id="test-awb-input" value="FX28301948IN"');
        rawArticle = rawArticle.replace(/Courier:\s*\{detectedCarrier\}/g, 'Courier: <span id="carrier-result-text">FedEx</span>');
      }

      // Handle copy button in code blocks
      rawArticle = rawArticle.replace(/<button[^>]*class(?:Name)?="doc-copy-btn"[\s\S]*?<\/button>/g, `<button type="button" class="doc-copy-btn" onclick="copyCodeBlock(this)">${ICONS.Copy(12)}<span>Copy</span></button>`);

      articles[secId] = jsxToHtml(rawArticle);
    }
  }
}

// Build Sidebar HTML
const categories = ['Architecture', 'Finance & Payments', 'Logistics', 'Computer Vision', 'Data Architecture', 'Developer Reference', 'Flutter Client', 'Reference'];
let sidebarHtml = '';

for (const cat of categories) {
  const items = DOC_SECTIONS.filter(s => s.category === cat);
  if (!items.length) continue;
  sidebarHtml += `<div class="doc-sidebar-category">\n  <div class="doc-category-title">${cat}</div>\n`;
  for (const sec of items) {
    const isActive = sec.id === 'overview' ? 'active' : '';
    const badgeClass = sec.badge === 'Critical' ? 'hot' : '';
    const badgeHtml = sec.badge ? `<span class="doc-item-badge ${badgeClass}">${sec.badge}</span>` : '';
    sidebarHtml += `  <div class="doc-menu-item ${isActive}" data-section="${sec.id}">\n    <span>${sec.title}</span>\n    ${badgeHtml}\n  </div>\n`;
  }
  sidebarHtml += `</div>\n`;
}

// Build TOC HTML
let tocHtml = `
  <div class="doc-toc-title">On This Page</div>
  <div class="doc-toc-link active" data-section="overview">What is VogueSocial & Features</div>
  <div class="doc-toc-link" data-section="how-it-works">The Escrow Referee & Money Flow</div>
  <div class="doc-toc-link" data-section="payment-escrow">Stripe Escrow & Payouts</div>
  <div class="doc-toc-link" data-section="logistics-delivery">Logistics & POD Verification</div>
  <div class="doc-toc-link" data-section="ai-tryon">AI Try-On & GPU Cluster</div>
  <div class="doc-toc-link" data-section="database-erd">Database Schema & ERD</div>
  <div class="doc-toc-link" data-section="api-reference">REST API & Webhooks</div>
  <div class="doc-toc-link" data-section="mobile-app">Mobile App Architecture</div>
  <div class="doc-toc-link" data-section="glossary">A–Z Glossary Dictionary</div>
`;

// Construct full index.html
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VogueSocial Engineering & Platform Architecture Documentation</title>
  <meta name="description" content="Technical documentation and architecture blueprint for VogueSocial - The decentralized luxury fashion social marketplace with AI Virtual Try-On and Stripe Connect Escrow.">
  <link rel="stylesheet" href="./style.css">
</head>
<body>
  <div class="doc-wrapper">
    <!-- TOP NAVBAR -->
    <header class="doc-navbar">
      <div class="doc-nav-left">
        <a href="#overview" class="doc-brand-title" style="text-decoration: none; color: inherit;">
          <span>VogueSocial</span>
          <span class="doc-brand-badge">Docs</span>
        </a>
        <span class="doc-version-pill">v1.0 Architecture Blueprint</span>
      </div>

      <div class="doc-nav-search">
        ${ICONS.Search(14, '#94a3b8')}
        <input
          type="text"
          id="doc-search-input"
          placeholder="Search architecture, payments, APIs..."
        />
        <span class="doc-kbd-shortcut">⌘K</span>
      </div>

      <div class="doc-nav-right">
        <button type="button" class="doc-nav-btn" onclick="switchSection('glossary')">
          ${ICONS.HelpCircle(14)}
          <span>Glossary</span>
        </button>
        <a href="../shop" class="doc-nav-btn" target="_blank" style="text-decoration: none;">
          <span>Live Shop</span>
          ${ICONS.ExternalLink(12)}
        </a>
        <a href="../merchant" class="doc-nav-btn primary" target="_blank" style="text-decoration: none;">
          <span>Merchant Portal</span>
          ${ICONS.ArrowRight(13)}
        </a>
      </div>
    </header>

    <!-- MAIN LAYOUT -->
    <div class="doc-layout">
      <!-- LEFT SIDEBAR -->
      <aside class="doc-sidebar" id="doc-sidebar">
        ${sidebarHtml}
      </aside>

      <!-- CENTER CONTENT -->
      <main class="doc-content-area" id="doc-content-area">
        ${sectionIds.map(id => articles[id] || '').join('\n\n')}
      </main>

      <!-- RIGHT TOC -->
      <aside class="doc-toc-bar">
        ${tocHtml}
      </aside>
    </div>
  </div>

  <script src="./app.js"></script>
</body>
</html>
`;

// Additional standalone CSS overrides to make static tabs work flawlessly
const extraCss = `
/* ==========================================================================
   MINIMALIST POLISH & OVERRIDES
   ========================================================================== */
svg {
  flex-shrink: 0;
}

.doc-section {
  display: none;
}
.doc-section.active {
  display: block;
  animation: docFadeIn 0.18s ease-in-out;
}
@keyframes docFadeIn {
  from { opacity: 0; transform: translateY(3px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Subtle, refined tag pills */
.doc-tag {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: 4px;
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}
.doc-tag.blue {
  background: #f0f9ff;
  color: #0284c7;
  border-color: #bae6fd;
}

/* Clean minimalist article typography */
.doc-article-title {
  font-size: 1.85rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #0f172a;
  line-height: 1.25;
  margin: 0.5rem 0 0.75rem;
}

.doc-article-lead {
  font-size: 0.95rem;
  line-height: 1.65;
  color: #475569;
  margin: 0;
  font-weight: 400;
}

/* Sidebar item badge protection */
.doc-item-badge {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--doc-surface-hover);
  color: var(--doc-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.2;
}

.doc-item-badge.hot {
  background: var(--doc-accent-blue-bg);
  color: var(--doc-accent-blue);
  border: 1px solid rgba(2, 132, 199, 0.2);
}

/* Clean Minimalist Callouts */
.doc-callout {
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  border: 1px solid #e2e8f0;
}
.doc-callout.info {
  background: #f8fafc;
  border-left: 3.5px solid #0284c7;
}
.doc-callout.tip {
  background: #f0fdf4;
  border-left: 3.5px solid #16a34a;
  border-color: #bbf7d0;
}
.doc-callout-icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.doc-callout-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: #0f172a;
}
.doc-callout-body {
  font-size: 0.84rem;
  line-height: 1.6;
  color: #334155;
}

/* Glossary filter buttons */
.doc-glossary-filter-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.doc-glossary-filter-btn {
  background: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s ease;
}

.doc-glossary-filter-btn:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #0f172a;
}

.doc-glossary-filter-btn.active {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}
`;

const finalCss = originalCss + '\n\n' + extraCss;

// Full App.js
const appJs = `// VogueSocial Documentation Portal - Client App
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.doc-section');
  const menuItems = document.querySelectorAll('.doc-menu-item');
  const tocLinks = document.querySelectorAll('.doc-toc-link');
  const searchInput = document.getElementById('doc-search-input');
  const awbInput = document.getElementById('test-awb-input');
  const carrierBadge = document.getElementById('carrier-result-text');

  // 1. SECTION SWITCHER
  window.switchSection = function(sectionId) {
    if (!sectionId) sectionId = 'overview';
    const targetArticle = document.getElementById('sec-' + sectionId);
    if (!targetArticle) return;

    sections.forEach(sec => sec.classList.remove('active'));
    targetArticle.classList.add('active');

    menuItems.forEach(item => {
      if (item.getAttribute('data-section') === sectionId) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });

    tocLinks.forEach(link => {
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    window.location.hash = sectionId;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Click handlers on sidebar items
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const secId = item.getAttribute('data-section');
      switchSection(secId);
    });
  });

  // Click handlers on TOC links
  tocLinks.forEach(link => {
    link.addEventListener('click', () => {
      const secId = link.getAttribute('data-section');
      switchSection(secId);
    });
  });

  // Initialize from hash
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById('sec-' + initialHash)) {
    switchSection(initialHash);
  } else {
    switchSection('overview');
  }

  window.addEventListener('hashchange', () => {
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && document.getElementById('sec-' + currentHash)) {
      switchSection(currentHash);
    }
  });

  // 2. LIVE AWB CARRIER AUTO-DETECTOR
  if (awbInput && carrierBadge) {
    function detectCarrier(num) {
      num = (num || '').trim().replace(/[\\s-]+/g, '').toUpperCase();
      if (!num) return 'Unknown Carrier (Self-Fulfill)';
      if (/^1Z[A-Z0-9]{16}$/i.test(num) || /^1Z/i.test(num)) return 'UPS';
      if (/^(94|92|93|95)\\d{18,20}$/.test(num) || /^[A-Z]{2}\\d{9}US$/.test(num)) return 'USPS Priority Mail';
      if (/^[A-Z]{2}\\d{9}GB$/.test(num)) return 'Royal Mail';
      if (/^BD\\d+/.test(num)) return 'Blue Dart';
      if (/^FX/.test(num) || /^\\d{12}$/.test(num) || /^\\d{15}$/.test(num)) return 'FedEx';
      if (/^\\d{10}$/.test(num) || /^J(J)?D/.test(num)) return 'DHL Express';
      return 'Unknown Carrier (Self-Fulfill)';
    }

    awbInput.addEventListener('input', (e) => {
      carrierBadge.textContent = detectCarrier(e.target.value);
    });
  }

  // 3. COPY CODE SNIPPET
  window.copyCodeBlock = function(btn) {
    const codeBlock = btn.closest('.doc-code-block');
    if (!codeBlock) return;
    const pre = codeBlock.querySelector('pre');
    if (!pre) return;

    navigator.clipboard.writeText(pre.innerText).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span style="color:#16a34a;font-weight:700;">Copied!</span>';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    });
  };

  // 4. SEARCH FILTER
  if (searchInput) {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
      }
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (!query) {
        menuItems.forEach(item => item.style.display = 'flex');
        return;
      }

      menuItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 5. GLOSSARY CATEGORY FILTER
  const filterBtns = document.querySelectorAll('.doc-glossary-filter-btn');
  const glossaryCards = document.querySelectorAll('.doc-glossary-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');

      glossaryCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});
`;

// Copy Architecture Image
const sourceImg = path.join(VIRTUAL_TRYON_DIR, 'public', 'voguesocial_system_architecture.jpg');

// Write to all output dirs
for (const outDir of OUTPUT_DIRS) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const assetsDir = path.join(outDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'index.html'), indexHtml, 'utf8');
  fs.writeFileSync(path.join(outDir, 'style.css'), finalCss, 'utf8');
  fs.writeFileSync(path.join(outDir, 'app.js'), appJs, 'utf8');

  // Copy diagram
  if (fs.existsSync(sourceImg)) {
    fs.copyFileSync(sourceImg, path.join(assetsDir, 'voguesocial_system_architecture.jpg'));
  }

  console.log(`✓ Output saved to: ${outDir}`);
}

console.log('Build completed successfully!');
