"use client";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, CheckCircle2, AlertCircle, User, Store, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose, initialTab = 'signin' }) => {
  const { signIn, signUp, signInOAuth } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab); // 'signin' | 'signup'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState('user'); // 'user' | 'merchant'
  const [signUpSize, setSignUpSize] = useState('M');

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

  // 1. Real Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);

    try {
      const res = await signIn({ email: signInEmail, password: signInPassword });
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

  // 2. Real Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);

    try {
      const res = await signUp({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        role: signUpRole,
        preferred_size: signUpSize
      });

      if (res?.success) {
        setSuccessMsg('Account created successfully! Calibrating your virtual fitting room...');
        setTimeout(() => {
          onClose();
          if (signUpRole === 'merchant') {
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

  // 3. Social OAuth
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        {/* Left Side - Visual Editorial Presentation */}
        <div className={styles.visualSide}>
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80"
            alt="Haute Couture Editorial"
            className={styles.visualBackgroundImg}
          />
          <div className={styles.visualGradient} />

          <div className={styles.visualContent}>
            <span className={styles.visualBrandTag}>VogueSocial Haute AI</span>

            <div>
              <h2 className={styles.visualHeadline}>
                Your Personal Virtual Fitting Room.
              </h2>
              <p className={styles.visualSub}>
                Try on any runway designer piece tailored directly to your proportions with OmniTry AI neural simulation.
              </p>

              <div className={styles.visualStatsList}>
                <div className={styles.visualStatItem}>
                  <Sparkles size={14} />
                  <span>Sub-second 3D drape physics</span>
                </div>
                <div className={styles.visualStatItem}>
                  <CheckCircle2 size={14} />
                  <span>3 Multi-tier Roles: Shopper, Brand & Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Form */}
        <div className={styles.formSide}>
          {/* Navigation Tabs */}
          <div className={styles.tabNav}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'signin' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabSwitch('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'signup' ? styles.tabBtnActive : ''}`}
              onClick={() => handleTabSwitch('signup')}
            >
              Create Account
            </button>
          </div>

          {/* Header */}
          <div className={styles.headerWrap}>
            <h1 className={styles.headerTitle}>
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Your Wardrobe'}
            </h1>
            <p className={styles.headerSubtitle}>
              {activeTab === 'signin'
                ? 'Sign in to access your saved try-ons, fitting measurements, and orders.'
                : 'Join VogueSocial to test garments virtually with custom silhouette calibration.'}
            </p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className={styles.errorAlert}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className={styles.successAlert}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className={styles.authForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@voguesocial.com"
                  className={styles.inputField}
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  className={styles.inputField}
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Wardrobe'}</span>
                <ArrowRight size={15} />
              </button>

              <div className={styles.divider}>
                <span className={styles.dividerSpan}>or continue with</span>
              </div>

              {/* Social OAuth Buttons */}
              <div className={styles.oauthRow}>
                <button
                  type="button"
                  className={styles.oauthBtn}
                  onClick={() => handleOAuth('google')}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className={styles.oauthIcon}
                  />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className={styles.oauthBtn}
                  onClick={() => handleOAuth('facebook')}
                >
                  <img
                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                    alt="Facebook"
                    className={styles.oauthIcon}
                  />
                  <span>Facebook</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className={styles.authForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  className={styles.inputField}
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maya@example.com"
                  className={styles.inputField}
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Password (minimum 6 characters)</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Create a secure password"
                  className={styles.inputField}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {/* Account Role Selection */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>I am joining as a:</label>
                <div className={styles.roleSelectorRow}>
                  <button
                    type="button"
                    className={`${styles.roleChoiceBtn} ${signUpRole === 'user' ? styles.roleChoiceBtnActive : ''}`}
                    onClick={() => setSignUpRole('user')}
                  >
                    <span className={styles.roleChoiceTitle}>Shopper / Customer</span>
                    <span className={styles.roleChoiceDesc}>Try on looks, curate wardrobe</span>
                  </button>

                  <button
                    type="button"
                    className={`${styles.roleChoiceBtn} ${signUpRole === 'merchant' ? styles.roleChoiceBtnActive : ''}`}
                    onClick={() => setSignUpRole('merchant')}
                  >
                    <span className={styles.roleChoiceTitle}>Brand Merchant</span>
                    <span className={styles.roleChoiceDesc}>Manage store, sync products</span>
                  </button>
                </div>
              </div>

              {/* Size preference for Shopper */}
              {signUpRole === 'user' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Standard Fit Size</label>
                  <div className={styles.sizeRow}>
                    {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`${styles.sizeChip} ${signUpSize === s ? styles.sizeChipActive : ''}`}
                        onClick={() => setSignUpSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                <span>{loading ? 'Registering Account...' : 'Create Account & Start Fitting'}</span>
                <ArrowRight size={15} />
              </button>
            </form>
          )}

          <p className={styles.termsText}>
            By continuing, you agree to VogueSocial's{' '}
            <span className={styles.termsLink}>Terms of Service</span> and{' '}
            <span className={styles.termsLink}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
