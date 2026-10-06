import React from 'react';
import './TopNavbar.css';

export default function TopNavbar({ text = 'Welcome to VogueSocial — Haute Virtual Try-On & Creator Storefronts' }) {
  return (
    <div className="top-navbar" role="banner" aria-label="Announcement">
      <div className="top-navbar-content">
        {text}
      </div>
    </div>
  );
}
