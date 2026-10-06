import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import AuthRoleSelector from './AuthRoleSelector';
import AuthSizeSelector from './AuthSizeSelector';
import './SignUpForm.css';

export default function SignUpForm({ onSubmit, loading }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [size, setSize] = useState('M');
  const [storeName, setStoreName] = useState('');
  const [storeHandle, setStoreHandle] = useState('');
  const [handleManuallyEdited, setHandleManuallyEdited] = useState(false);

  const merchantSectionRef = useRef(null);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'merchant') {
      setTimeout(() => {
        merchantSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 50);
    }
  };

  const handleStoreNameChange = (e) => {
    const val = e.target.value;
    setStoreName(val);
    if (!handleManuallyEdited) {
      setStoreHandle(val.toLowerCase().replace(/[^a-z0-9-]/g, ''));
    }
  };

  const handleStoreHandleChange = (e) => {
    setHandleManuallyEdited(true);
    setStoreHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      password,
      role,
      size,
      storeName: role === 'merchant' ? storeName : undefined,
      storeHandle: role === 'merchant' ? storeHandle : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="sign-up-form">
      <div className="auth-field-group">
        <label className="auth-field-label">Full Name</label>
        <input
          type="text"
          required
          placeholder="e.g. Maya Lin"
          className="auth-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="auth-field-group">
        <label className="auth-field-label">Email Address</label>
        <input
          type="email"
          required
          placeholder="e.g. maya@example.com"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="auth-field-group">
        <label className="auth-field-label">Password (minimum 6 characters)</label>
        <input
          type="password"
          required
          minLength={6}
          placeholder="Create a secure password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      {/* Role Selection */}
      <AuthRoleSelector role={role} onRoleChange={handleRoleChange} />

      {/* Size Selection (Shopper only) */}
      {role === 'user' && (
        <AuthSizeSelector size={size} onSizeChange={setSize} />
      )}

      {/* Merchant Store Fields (Merchant only) */}
      {role === 'merchant' && (
        <div ref={merchantSectionRef} className="merchant-fields-section">
          <div className="auth-field-group">
            <label className="auth-field-label">Brand / Store Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Atelier Noir"
              className="auth-input"
              value={storeName}
              onChange={handleStoreNameChange}
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">Store Handle / Subdomain</label>
            <input
              type="text"
              required
              placeholder="ateliernoir"
              className="auth-input font-mono"
              value={storeHandle}
              onChange={handleStoreHandleChange}
            />
            <div className="subdomain-preview">
              Subdomain: <strong>https://{storeHandle || 'yourbrand'}.voguesocial.com</strong>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        <span>{loading ? 'Registering Account...' : 'Create Account & Start Fitting'}</span>
        <ArrowRight size={15} />
      </button>
    </form>
  );
}
