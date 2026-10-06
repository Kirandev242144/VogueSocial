import React from 'react';
import './AuthTabs.css';

export default function AuthTabs({ activeTab, onTabChange }) {
  return (
    <div className="auth-tabs">
      <button
        type="button"
        className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
        onClick={() => onTabChange('signin')}
      >
        Sign In
      </button>
      <button
        type="button"
        className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
        onClick={() => onTabChange('signup')}
      >
        Create Account
      </button>
    </div>
  );
}
