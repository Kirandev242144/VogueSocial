import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">VogueSocial</div>
          <p className="footer-tagline">
            Haute Virtual Try-On, Independent Merchant Storefronts & Fashion Creator Community.
          </p>
          <p className="footer-copyright">© 2026 VogueSocial Inc. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Experience</h4>
            <Link to="/shop">Shop All Collections</Link>
            <Link to="/wardrobe">Digital Wardrobe</Link>
            <Link to="/profile?tab=tryons">Virtual Try-On Studio</Link>
          </div>
          <div className="footer-column">
            <h4>Merchants</h4>
            <Link to="/merchant/dashboard">Atelier Dashboard</Link>
            <Link to="/merchant/website">Website Customizer</Link>
            <Link to="/merchant/signup">Open an Atelier</Link>
          </div>
          <div className="footer-column">
            <h4>Platform</h4>
            <Link to="/brand/studiolabel">Studio Label Paris</Link>
            <Link to="/brand/elenacouture">Elena Couture</Link>
            <Link to="/admin/products">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
