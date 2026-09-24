# VogueSocial — Backend API Contracts & Integration Guide

> **Audience**: Backend Engineering Team & System Architects  
> **Frontend Version**: 2.0 (Clean Service-Adapter Architecture)  
> **Status**: Production Ready — Dual-Mode (100% Standalone Offline Mock / Live API)

---

## 1. Architecture Overview

The VogueSocial frontend is architected using the **Service Adapter Pattern** (`src/services/` and `src/constants/`). The UI layer is completely decoupled from direct HTTP calls and network implementations.

```
┌────────────────────────────────────────────────────────┐
│                    UI Components                       │
│  (Storefront, Merchant Studio, Wardrobe, Feed, Auth)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Domain Service Layer                  │
│   productService | storeService | wardrobeService      │
│            authService | feedService                   │
└─────────────┬────────────────────────────┬─────────────┘
              │ (IS_MOCK_MODE === true)    │ (IS_MOCK_MODE === false)
              ▼                            ▼
┌───────────────────────────┐  ┌─────────────────────────┐
│     Mock Adapters         │  │   Live REST API Client  │
│  (LocalStorage Engine,    │  │   (Your Backend:        │
│   Seed Constants, State)  │  │    Spring Boot / Go /   │
└───────────────────────────┘  │    Node.js / FastAPI)   │
                               └─────────────────────────┘
```

### Switching to Live Backend
To switch from frontend-only mock mode to your backend, configure your environment variables in `.env` (or `.env.production`):

```bash
# Set DATA_SOURCE to 'api' (defaults to 'mock' if omitted)
VITE_DATA_SOURCE=api

# Specify your backend API base URL
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## 2. API Endpoints Specification

All endpoints expect and return `Content-Type: application/json` unless otherwise specified.

---

### A. Authentication & User Identity

#### 1. Sign In
- **Method**: `POST`
- **Path**: `/api/auth/signin`
- **Request Body**:
```json
{
  "email": "elena@couture.com",
  "password": "Password123!"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "id": "usr_elena_couture",
    "email": "elena@couture.com",
    "name": "Elena Rostova",
    "role": "merchant",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160",
    "storeHandle": "elenacouture",
    "storeName": "Elena Couture"
  },
  "token": "jwt_token_here"
}
```

#### 2. Sign Up
- **Method**: `POST`
- **Path**: `/api/auth/signup`
- **Request Body**:
```json
{
  "email": "designer@atelier.com",
  "password": "SecurePassword123!",
  "name": "Atelier Design",
  "role": "merchant",
  "storeHandle": "atelierdesign",
  "storeName": "Atelier Design Studio"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "user": {
    "id": "usr_generated_id",
    "email": "designer@atelier.com",
    "name": "Atelier Design",
    "role": "merchant",
    "storeHandle": "atelierdesign",
    "storeName": "Atelier Design Studio"
  },
  "token": "jwt_token_here"
}
```

#### 3. Check Handle Availability
- **Method**: `GET`
- **Path**: `/api/auth/check-handle?handle={handle}`
- **Response `200 OK`**:
```json
{
  "handle": "atelierdesign",
  "available": true
}
```

---

### B. Merchant Products Catalog

#### 1. Get Merchant Products
- **Method**: `GET`
- **Path**: `/api/merchant/products?vendorId={vendorId}`
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 2,
  "products": [
    {
      "id": "prod_1",
      "name": "Atelier Silk Bias Slip Dress",
      "description": "Cut on the bias from heavyweight 32mm mulberry silk charmeuse.",
      "price": 380.00,
      "salePrice": 320.00,
      "category": "Dresses",
      "targetAudience": "Women",
      "brand": "Elena Couture",
      "vendorId": "usr_elena_couture",
      "status": "live",
      "stock": 18,
      "sizes": ["XS", "S", "M", "L"],
      "colors": ["Champagne", "Noir", "Emerald"],
      "imageUrl": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
      "additional_images": [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800"
      ],
      "is_tryon_eligible": true,
      "createdAt": "2026-03-01T00:00:00.000Z"
    }
  ]
}
```

#### 2. Create Product
- **Method**: `POST`
- **Path**: `/api/merchant/products`
- **Request Body**:
```json
{
  "name": "Cashmere Double-Breasted Blazer",
  "description": "Structured Italian wool cashmere tailoring.",
  "price": 540.00,
  "salePrice": null,
  "category": "Outerwear",
  "targetAudience": "Unisex",
  "brand": "Elena Couture",
  "vendorId": "usr_elena_couture",
  "status": "live",
  "stock": 12,
  "sizes": ["38", "40", "42"],
  "colors": ["Charcoal", "Camel"],
  "imageUrl": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
  "additional_images": [
    "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800"
  ],
  "is_tryon_eligible": true
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "product": { "id": "prod_generated_id", "name": "..." }
}
```

#### 3. Update Product
- **Method**: `PUT`
- **Path**: `/api/merchant/products/{id}`
- **Response `200 OK`**: `{ "success": true, "product": { ... } }`

#### 4. Delete Product
- **Method**: `DELETE`
- **Path**: `/api/merchant/products?id={id}` (or `DELETE /api/merchant/products/{id}`)
- **Response `200 OK`**: `{ "success": true, "message": "Product deleted successfully" }`

---

### C. Public Storefront & Website Customizer

#### 1. Public Storefront by Handle or Subdomain
- **Method**: `GET`
- **Path**: `/api/store/{handle}`
- **Example**: `GET /api/store/elenacouture`
- **Response `200 OK`**:
```json
{
  "success": true,
  "store": {
    "store_id": "usr_elena_couture",
    "store_name": "Elena Couture",
    "store_handle": "elenacouture",
    "tagline": "Architectural Silhouettes & Haute Couture",
    "description": "Bespoke Parisian couture with architectural silhouettes and pure mulberry silk fabrication.",
    "template": "luxury",
    "accent_color": "#C9A84C",
    "custom_domain": "elenacouture.com",
    "domain_status": "connected",
    "status": "live",
    "logo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160",
    "hero_image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600",
    "email": "atelier@elenacouture.com"
  },
  "products": [ ... ]
}
```

#### 2. Get Merchant Website Settings
- **Method**: `GET`
- **Path**: `/api/merchant/website?vendorId={vendorId}&handle={handle}`
- **Response `200 OK`**: Same store configuration object as above.

#### 3. Update Website Settings & Branding
- **Method**: `POST`
- **Path**: `/api/merchant/website`
- **Response `200 OK`**: `{ "success": true, "settings": { ... } }`

#### 4. Verify Custom DNS Configuration
- **Method**: `POST`
- **Path**: `/api/merchant/website/verify-dns`
- **Response `200 OK`**: `{ "success": true, "domain_status": "connected", "ssl_active": true, "cname_target": "custom.voguesocial.com" }`

---

### D. Digital Wardrobe, Styling & Trip Planner

#### 1. Get User Wardrobe
- **Method**: `GET`
- **Path**: `/api/wardrobe/items?userId={userId}`
- **Response `200 OK`**: Array of wardrobe garments.

#### 2. Add Wardrobe Garment
- **Method**: `POST`
- **Path**: `/api/wardrobe/items`
- **Response `201 Created`**: Saved garment object with generated `id`.

#### 3. Log Wear Count
- **Method**: `POST`
- **Path**: `/api/wardrobe/items/{id}/wear`
- **Response `200 OK`**: `{ "success": true, "wearCount": 9 }`

#### 4. Outfits & Mix-and-Match
- **Get**: `GET /api/wardrobe/outfits?userId={userId}`
- **Create**: `POST /api/wardrobe/outfits`
- **Delete**: `DELETE /api/wardrobe/outfits/{id}`

#### 5. Outfit Calendar Scheduling
- **Get**: `GET /api/wardrobe/schedule?userId={userId}`
- **Schedule**: `POST /api/wardrobe/schedule`
- **Unschedule**: `DELETE /api/wardrobe/schedule?userId={userId}&dateStr={dateStr}`

#### 6. Packing & Trip Planner
- **Get**: `GET /api/wardrobe/trips?userId={userId}`
- **Create/Update**: `POST /api/wardrobe/trips`
- **Delete**: `DELETE /api/wardrobe/trips/{id}`

---

### E. Social Lookbook & Engagement

#### 1. Engagement Stats for Lookbook Posts
- **Method**: `GET`
- **Path**: `/api/posts/stats?userId={userId}`
- **Response `200 OK`**: `{ "1": { "likeCount": 124, "isLiked": false, "commentCount": 12 } }`

#### 2. Toggle Post Like
- **Method**: `POST`
- **Path**: `/api/posts/{id}/likes`
- **Response `200 OK`**: `{ "likeCount": 125, "isLiked": true }`

#### 3. Post Comments
- **Get**: `GET /api/posts/{id}/comments`
- **Post**: `POST /api/posts/{id}/comments`

---

## 3. Standard Error Format

```json
{
  "success": false,
  "error": "Human readable error description",
  "code": "RESOURCE_NOT_FOUND",
  "details": {}
}
```
