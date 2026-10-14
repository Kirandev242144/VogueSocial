# VogueSocial

Frontend for VogueSocial — a fashion marketplace and e-commerce platform built with React, Vite, and client-side virtual try-on tools.

It includes a public social feed, shop catalog, personal digital wardrobe with in-browser background removal, multi-theme public brand storefronts, and a Shopify Polaris-inspired merchant management portal.

---

## Tech Stack

- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **Image Processing**: `@imgly/background-removal` (runs on client via WebAssembly / WebGPU)
- **State & Storage**: React Context + client-side persistence engine (`storageEngine.js` with `localStorage` fallback)
- **Styling**: Modular CSS with design tokens (Polaris-inspired merchant UI, zero inline styles)

---

## App Routes & Features

### 1. Shopper Experience
- `/feed` — Social lookbook feed with community outfits and direct try-on links.
- `/shop` — Product catalog with filter drawer, quick view modal, and in-chat styling recommendations.
- `/product/:id` — Product detail page with size selection, color options, and virtual fitting.

### 2. Personal Wardrobe (`/wardrobe`)
- **My Clothes**: Upload and organize garments. In-browser AI removes photo backgrounds locally using WebAssembly so images never leave the browser.
- **Outfits**: Mix-and-match mannequin canvas to assemble coordinated outfits from tops, bottoms, and outerwear.
- **Calendar**: 14-day look planner to schedule outfits and track wear frequency.
- **Trip Planner**: Packing checklist and suitcase manager with destination presets.

### 3. Merchant Portal (`/merchant`)
- `/merchant/dashboard` — Store overview with urgent action items (unfulfilled orders, return reviews), sales KPIs, order snapshot, and fitting activity.
- `/merchant/products` — Catalog inventory management with stock tracking, variant tags, and product creation wizard.
- `/merchant/orders` — Order fulfillment workflow with automatic carrier detection (DHL, FedEx, UPS, USPS), Airway Bill tracking links, and a dedicated returns (RMA) dashboard.
- `/merchant/payouts` — Stripe Connect integration, banking details, balance ledger, and automated payout tracking.
- `/merchant/website` — Visual storefront editor with template customization, domain connection, and brand assets.
- `/merchant/analytics` — Revenue breakdown, channel conversion funnel, and virtual try-on influence reports.

### 4. Public Brand Storefronts (`/store/:handle`)
- Dynamic merchant storefronts rendered with 5 distinct design templates:
  - `minimal` — Clean typography, airy layout, high-end editorial feel
  - `luxury` — Dark palette, gold accents, structured cards
  - `streetwear` — High-contrast dark theme with neon accents
  - `modern` — Soft indigo palette with rounded components
  - `boutique` — Earthy warm tones and serif headings

### 5. Admin Portal (`/admin`)
- Platform-level dashboard for vendor onboarding, dispute review, and system metrics.

---

## Project Structure

```
virtual-try-on/
├── public/
│   ├── Shop_images/             # Sample garment imagery & catalog assets
│   └── product_catalog/         # Multi-angle product photos
├── src/
│   ├── app/                     # Page components organized by route
│   │   ├── admin/               # Platform admin portal
│   │   ├── feed/                # Social lookbook feed
│   │   ├── merchant/            # Merchant admin suite (dashboard, orders, products, etc.)
│   │   ├── shop/                # Shop catalog & stylist experience
│   │   ├── store/[handle]/      # Public merchant storefront template
│   │   └── wardrobe/            # Capsule wardrobe & trip planner
│   ├── components/              # Shared & domain-specific UI components
│   │   ├── merchant/            # Merchant subcomponents (orders, tables, modals)
│   │   ├── shop/                # Product cards, stylist drawers, look modal
│   │   ├── wardrobe/            # Wardrobe tabs, outfit builder, packing list
│   │   └── TryOnModal.jsx       # Interactive virtual fitting canvas
│   ├── context/
│   │   └── AuthContext.jsx      # Session state & demo role switching
│   └── lib/
│       ├── storageEngine.js     # Client-side data engine & seed data persistence
│       ├── shopData.js          # Product catalog & category definitions
│       └── wardrobeConstants.js # Color swatches, presets, and categories
├── package.json
└── vite.config.js
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22)
- npm or yarn

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kirandev242144/VogueSocial.git
   cd VogueSocial/virtual-try-on
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3001` (or next available port).

4. **Build for production**:
   ```bash
   npm run build
   ```
   Compiles static assets into the `dist/` directory.

---

## Development Notes

- **Mock Authentication & Role Switching**: The application includes built-in demo accounts in `AuthContext.jsx`. You can freely switch between **Shopper**, **Merchant**, and **Admin** roles without requiring an external authentication service.
- **Client-Side Persistence**: `storageEngine.js` seeds initial orders, products, and boutique settings into `localStorage`. Clearing browser data or bumping the seed version resets the catalog to defaults.
- **Background Removal**: `@imgly/background-removal` downloads ONNX neural network weights on first use and caches them locally in the browser.

---

## License

Proprietary · VogueSocial
