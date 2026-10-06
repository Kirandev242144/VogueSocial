import React from 'react';
import './AuthRoleSelector.css';

export default function AuthRoleSelector({ role, onRoleChange }) {
  return (
    <div className="auth-field-group">
      <label className="auth-field-label">I am joining as a:</label>
      <div className="role-selector-grid">
        <button
          type="button"
          className={`role-choice-card ${role === 'user' ? 'active' : ''}`}
          onClick={() => onRoleChange('user')}
        >
          <span className="role-choice-title">Shopper / Customer</span>
          <span className="role-choice-desc">Try on looks, curate wardrobe</span>
        </button>

        <button
          type="button"
          className={`role-choice-card ${role === 'merchant' ? 'active' : ''}`}
          onClick={() => onRoleChange('merchant')}
        >
          <span className="role-choice-title">Brand Merchant</span>
          <span className="role-choice-desc">Manage store, sync products</span>
        </button>
      </div>
    </div>
  );
}
