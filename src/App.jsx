import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MerchantLayout from './app/merchant/layout';
import AdminLayout from './app/admin/layout';

// Pages
import Home from './app/page';
import MerchantDashboard from './app/merchant/dashboard/page';
import MerchantWebsite from './app/merchant/website/page';
import MerchantProducts from './app/merchant/products/page';
import MerchantOrders from './app/merchant/orders/page';
import MerchantAnalytics from './app/merchant/analytics/page';
import MerchantApiUsage from './app/merchant/api-usage/page';
import MerchantPayouts from './app/merchant/payouts/page';
import MerchantSettings from './app/merchant/settings/page';

import StorefrontPage from './app/store/[handle]/page';
import ProductPage from './app/store/[handle]/product/[id]/page';
import FeedProductPage from './app/product/[id]/page';
import BrandProfilePage from './app/brand/[handle]/page';

import AdminProductsPage from './app/admin/products/page';
import AdminVendorsPage from './app/admin/vendors/page';
import AdminDisputesPage from './app/admin/disputes/page';

import MerchantOnboarding from './app/onboarding/merchant/page';
import Onboarding from './app/onboarding/page';
import UserProfilePage from './app/profile/page';
import ShopPage from './app/shop/page';
import WardrobePage from './app/wardrobe/page';

function detectStoreSubdomain() {
  if (typeof window === 'undefined') return null;
  const hostname = window.location.hostname.toLowerCase();

  // Exclude bare localhost and standard root domains
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === 'voguesocial.com' || hostname === 'www.voguesocial.com') {
    return null;
  }

  // 1. Support local dev subdomain: e.g. studiolabel.localhost
  if (hostname.endsWith('.localhost')) {
    const parts = hostname.split('.');
    if (parts.length >= 2 && parts[0] && parts[0] !== 'localhost') {
      return parts[0];
    }
  }

  // 2. Support production subdomains: e.g. studiolabel.voguesocial.com
  if (hostname.endsWith('.voguesocial.com')) {
    const sub = hostname.replace('.voguesocial.com', '');
    if (sub && sub !== 'www' && sub !== 'api' && sub !== 'admin') {
      return sub;
    }
  }

  // 3. Dynamic Custom Domains: if it's an external custom domain (e.g. shop.luxuryatelier.com)
  return hostname;
}

export default function App() {
  const storeSubdomain = detectStoreSubdomain();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* If accessed via merchant subdomain (e.g. studiolabel.localhost:3001 or studiolabel.voguesocial.com), route root to storefront */}
          {storeSubdomain ? (
            <>
              <Route path="/" element={<StorefrontPage handle={storeSubdomain} />} />
              <Route path="/product/:id" element={<ProductPage handle={storeSubdomain} />} />
            </>
          ) : (
            <Route path="/" element={<Home />} />
          )}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/wardrobe" element={<WardrobePage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/product/:id" element={<FeedProductPage />} />
          <Route path="/brand/:handle" element={<BrandProfilePage />} />
          
          {/* Onboarding */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/merchant" element={<MerchantOnboarding />} />

          {/* Merchant Dashboard Routes Wrapped with Persistent Sidebar & Navbar Layout */}
          <Route element={<MerchantLayout />}>
            <Route path="/merchant" element={<Navigate to="/merchant/dashboard" replace />} />
            <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
            <Route path="/merchant/website" element={<MerchantWebsite />} />
            <Route path="/merchant/products" element={<MerchantProducts />} />
            <Route path="/merchant/orders" element={<MerchantOrders />} />
            <Route path="/merchant/analytics" element={<MerchantAnalytics />} />
            <Route path="/merchant/api-usage" element={<MerchantApiUsage />} />
            <Route path="/merchant/payouts" element={<MerchantPayouts />} />
            <Route path="/merchant/settings" element={<MerchantSettings />} />
          </Route>

          {/* Public Storefront Routes */}
          <Route path="/store/:handle" element={<StorefrontPage />} />
          <Route path="/store/:handle/product/:id" element={<ProductPage />} />

          {/* Admin Console Routes Wrapped with Admin Layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/vendors" element={<AdminVendorsPage />} />
            <Route path="/admin/disputes" element={<AdminDisputesPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
