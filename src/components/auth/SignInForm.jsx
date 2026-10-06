import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import SocialAuthButtons from './SocialAuthButtons';
import './SignInForm.css';

export default function SignInForm({ onSubmit, onOAuth, onMerchantLoginRedirect, loading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="sign-in-form">
      <div className="auth-field-group">
        <label className="auth-field-label">Email Address</label>
        <input
          type="email"
          required
          placeholder="e.g. sarah@voguesocial.com"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="auth-field-group">
        <label className="auth-field-label">Password</label>
        <input
          type="password"
          required
          placeholder="Enter your password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        <span>{loading ? 'Authenticating...' : 'Sign In to Wardrobe'}</span>
        <ArrowRight size={15} />
      </button>

      <SocialAuthButtons onOAuth={onOAuth} disabled={loading} />

      <div className="merchant-portal-link-wrap">
        <button
          type="button"
          onClick={onMerchantLoginRedirect}
          className="merchant-portal-link"
        >
          Are you a Brand Merchant? Go to Atelier Portal →
        </button>
      </div>
    </form>
  );
}
