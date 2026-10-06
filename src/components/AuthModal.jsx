'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthEditorialBanner from './auth/AuthEditorialBanner';
import AuthTabs from './auth/AuthTabs';
import SignInForm from './auth/SignInForm';
import SignUpForm from './auth/SignUpForm';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialTab = 'signin' }) => {
  const { signIn, signUp, signInOAuth } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab); // 'signin' | 'signup'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(false);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetState();
  };

  // Sign In Handler
  const handleSignIn = async ({ email, password }) => {
    resetState();
    setLoading(true);

    try {
      const res = await signIn({ email, password });
      if (res?.success) {
        setSuccessMsg('Welcome back! Loading your personal wardrobe...');
        setTimeout(() => {
          onClose();
          if (res.user.role === 'merchant') {
            navigate('/merchant/dashboard');
          } else if (res.user.role === 'admin') {
            navigate('/admin/products');
          }
        }, 600);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (formData) => {
    resetState();
    setLoading(true);

    try {
      const res = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        preferred_size: formData.size,
        storeName: formData.storeName,
        storeHandle: formData.storeHandle
      });

      if (res?.success) {
        setSuccessMsg('Account created successfully! Calibrating your virtual fitting room...');
        setTimeout(() => {
          onClose();
          if (formData.role === 'merchant') {
            navigate('/merchant/dashboard');
          } else {
            navigate('/profile');
          }
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  // Social OAuth Handler
  const handleOAuth = async (provider) => {
    resetState();
    setLoading(true);
    try {
      await signInOAuth(provider);
      setSuccessMsg(`Authenticated via ${provider.charAt(0).toUpperCase() + provider.slice(1)}. Redirecting...`);
      setTimeout(() => {
        onClose();
        navigate('/profile');
      }, 600);
    } catch (err) {
      setErrorMsg(`Failed to connect with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        {/* 1. Left Editorial Visual Banner */}
        <AuthEditorialBanner />

        {/* 2. Right Interactive Form Area */}
        <div className="auth-form-side">
          <AuthTabs activeTab={activeTab} onTabChange={handleTabSwitch} />

          <div className="auth-header-wrap">
            <h1 className="auth-header-title">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Your Wardrobe'}
            </h1>
            <p className="auth-header-subtitle">
              {activeTab === 'signin'
                ? 'Sign in to access your saved try-ons, fitting measurements, and orders.'
                : 'Join VogueSocial to test garments virtually with custom silhouette calibration.'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="auth-error-alert">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-success-alert">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Forms */}
          {activeTab === 'signin' ? (
            <SignInForm
              onSubmit={handleSignIn}
              onOAuth={handleOAuth}
              onMerchantLoginRedirect={() => {
                onClose();
                navigate('/merchant/login');
              }}
              loading={loading}
            />
          ) : (
            <SignUpForm
              onSubmit={handleSignUp}
              loading={loading}
            />
          )}

          <p className="auth-terms-text">
            By continuing, you agree to VogueSocial's{' '}
            <span className="auth-terms-link">Terms of Service</span> and{' '}
            <span className="auth-terms-link">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
