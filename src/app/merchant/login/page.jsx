"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Store, Sparkles, CheckCircle2, AlertCircle, ArrowRight,
  ShieldCheck, Globe, Lock, Mail, Key, User, ExternalLink, Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MerchantLoginPage({ initialTab = 'signin' }) {
  const { signIn, signUp, user, switchUserRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState(initialTab);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'signup') {
      setTab('signup');
    } else if (params.get('tab') === 'signin') {
      setTab('signin');
    }
  }, [location.search]);

  useEffect(() => {
    if (user && (user.role === 'merchant' || user.role === 'admin')) {
      navigate('/merchant/dashboard');
    }
  }, [user, navigate]);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeHandle, setStoreHandle] = useState('');
  const [handleManuallyEdited, setHandleManuallyEdited] = useState(false);

  const [handleChecking, setHandleChecking] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState(null);
  const [handleError, setHandleError] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleStoreNameChange = (val) => {
    setStoreName(val);
    if (!handleManuallyEdited) {
      const generated = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setStoreHandle(generated);
    }
  };

  useEffect(() => {
    const clean = storeHandle.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!clean || clean.length < 3) {
      setHandleAvailable(null);
      setHandleError(clean.length > 0 ? 'Handle must be at least 3 characters' : '');
      return;
    }

    const timer = setTimeout(async () => {
      setHandleChecking(true);
      try {
        const res = await fetch(`/api/auth/check-handle?handle=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const data = await res.json();
          setHandleAvailable(data.available);
          setHandleError(data.available ? '' : 'This handle is already registered by another atelier.');
        } else {
          setHandleAvailable(null);
        }
      } catch (err) {
        setHandleAvailable(null);
      } finally {
        setHandleChecking(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [storeHandle]);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await signIn({ email: signInEmail, password: signInPassword });
      if (res?.success) {
        if (res.user.role !== 'merchant' && res.user.role !== 'admin') {
          setErrorMsg('This account is registered as a Shopper. Please sign in with a brand merchant account or sign up below.');
          setLoading(false);
          return;
        }
        setSuccessMsg('Welcome back! Opening your merchant atelier...');
        setTimeout(() => {
          navigate('/merchant/dashboard');
        }, 500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (handleAvailable === false) {
      setErrorMsg('Please choose an available store handle before proceeding.');
      return;
    }

    setLoading(true);

    try {
      const cleanHandle = storeHandle.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      const res = await signUp({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'merchant',
        storeName: storeName.trim(),
        storeHandle: cleanHandle
      });

      if (res?.success) {
        setSuccessMsg(`Atelier ${cleanHandle} launched! Calibrating digital storefront...`);
        setTimeout(() => {
          navigate('/merchant/dashboard');
        }, 700);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create boutique account. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    switchUserRole('merchant');
    navigate('/merchant/dashboard');
  };

  const previewHandle = storeHandle.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') || 'yourbrand';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#FAF9F6',
      color: '#1C1917',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        flex: '1 1 45%',
        position: 'relative',
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3.5rem',
        background: 'linear-gradient(180deg, #0A0A0A 0%, #171717 100%)',
        color: '#FFFFFF',
        overflow: 'hidden'
      }} className="desktop-editorial">
        <style>{`
          @media (min-width: 960px) {
            .desktop-editorial { display: flex !important; }
          }
        `}</style>

        <div style={{
          position: 'absolute',
          top: '-15%',
          left: '-20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(203,243,130,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#FFFFFF'
          }}>
            <div style={{
              width: 38,
              height: 38,
              background: '#FFFFFF',
              color: '#0A0A0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '-0.05em'
            }}>
              VS
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', letterSpacing: '0.06em', fontWeight: 600 }}>
                VogueSocial
              </div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#A8A29E' }}>
                Atelier & Merchant Network
              </div>
            </div>
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 480, margin: '4rem 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#cbf382',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={13} />
            <span>Digital Haute Couture Portal</span>
          </div>

          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.5rem',
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            marginBottom: '1.5rem',
            color: '#F5F5F4'
          }}>
            The architecture of modern commerce.
          </h2>

          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            color: '#D6D3D1',
            fontFamily: 'Cormorant Garamond, serif'
          }}>
            Equip your fashion house with zero-latency in-browser AI fitting, multi-tenant luxury storefronts, dynamic Anycast subdomains, and instant catalog synchronization.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#E7E5E4' }}>
              <CheckCircle2 size={16} color="#cbf382" />
              <span>Instant subdomains on <code>[yourbrand].voguesocial.com</code></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#E7E5E4' }}>
              <CheckCircle2 size={16} color="#cbf382" />
              <span>Automated 100% database-driven storefront provisioning</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#E7E5E4' }}>
              <CheckCircle2 size={16} color="#cbf382" />
              <span>Full custom domain & SSL Anycast integration</span>
            </div>
          </div>
        </div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '0.75rem',
          color: '#78716C',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>© 2026 VogueSocial Atelier Edition</span>
          <span>TLS 1.3 Certified Platform</span>
        </div>
      </div>

      <div style={{
        flex: '1 1 55%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2.5rem 1.5rem'
      }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#78716C', fontWeight: 600 }}>
                Merchant Access
              </span>
              <Link to="/" style={{ fontSize: '0.78rem', color: '#0A0A0A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <span>Back to Home</span>
                <ArrowRight size={13} />
              </Link>
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.1rem', fontWeight: 500, margin: '0 0 0.5rem 0', color: '#0A0A0A' }}>
              {tab === 'signin' ? 'Sign in to your Atelier' : 'Open a Brand Storefront'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#78716C', margin: 0, lineHeight: 1.5 }}>
              {tab === 'signin'
                ? 'Manage your digital boutique, view sales orders, and edit your live storefront.'
                : 'Claim your exclusive brand subdomain and launch your AI-powered storefront in seconds.'}
            </p>
          </div>

          <div style={{
            display: 'flex',
            background: '#F5F5F4',
            padding: '4px',
            marginBottom: '1.75rem',
            border: '1px solid #E7E5E4'
          }}>
            <button
              type="button"
              onClick={() => { setTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                background: tab === 'signin' ? '#FFFFFF' : 'transparent',
                color: tab === 'signin' ? '#0A0A0A' : '#78716C',
                border: 'none',
                boxShadow: tab === 'signin' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign In to Atelier
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
              style={{
                flex: 1,
                padding: '10px 0',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                background: tab === 'signup' ? '#FFFFFF' : 'transparent',
                color: tab === 'signup' ? '#0A0A0A' : '#78716C',
                border: 'none',
                boxShadow: tab === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Register New Brand
            </button>
          </div>

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0.85rem 1rem',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '0.82rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '0.85rem 1rem',
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              color: '#166534',
              fontSize: '0.82rem',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {tab === 'signin' && (
            <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem', color: '#44403C' }}>
                  Work / Merchant Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tom@gmail.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      fontSize: '0.9rem',
                      border: '1px solid #D6D3D1',
                      borderRadius: 0,
                      backgroundColor: '#FFFFFF',
                      color: '#0A0A0A',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: 13, color: '#A8A29E' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem', color: '#44403C' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      fontSize: '0.9rem',
                      border: '1px solid #D6D3D1',
                      borderRadius: 0,
                      backgroundColor: '#FFFFFF',
                      color: '#0A0A0A',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Key size={16} style={{ position: 'absolute', left: 12, top: 13, color: '#A8A29E' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '13px',
                  background: '#0A0A0A',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 0,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  transition: 'background 0.2s'
                }}
              >
                {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowRight size={16} />}
                <span>{loading ? 'Authenticating Atelier...' : 'Sign In to Merchant Dashboard'}</span>
              </button>

              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #E7E5E4' }}>
                <div style={{ fontSize: '0.75rem', color: '#78716C', marginBottom: '0.6rem', textAlign: 'center' }}>
                  Testing or evaluating platform?
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '10px',
                    background: '#F5F5F4',
                    color: '#1C1917',
                    border: '1px dashed #A8A29E',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Store size={14} color="#059669" />
                  <span>1-Click Demo Login · Studio Label Paris (Tom Jenkins)</span>
                </button>
              </div>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem', color: '#44403C' }}>
                    Founder / Designer Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Thorne"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 34px',
                        fontSize: '0.88rem',
                        border: '1px solid #D6D3D1',
                        backgroundColor: '#FFFFFF',
                        color: '#0A0A0A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <User size={15} style={{ position: 'absolute', left: 11, top: 13, color: '#A8A29E' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem', color: '#44403C' }}>
                    Brand / Store Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Urban Vibe Studio"
                      value={storeName}
                      onChange={(e) => handleStoreNameChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 34px',
                        fontSize: '0.88rem',
                        border: '1px solid #D6D3D1',
                        backgroundColor: '#FFFFFF',
                        color: '#0A0A0A',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <Store size={15} style={{ position: 'absolute', left: 11, top: 13, color: '#A8A29E' }} />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#44403C' }}>
                    Store Handle (Subdomain)
                  </label>
                  {handleChecking ? (
                    <span style={{ fontSize: '0.72rem', color: '#78716C', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Checking...
                    </span>
                  ) : handleAvailable === true ? (
                    <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} /> Available
                    </span>
                  ) : handleAvailable === false ? (
                    <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlertCircle size={12} /> Taken
                    </span>
                  ) : null}
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    position: 'absolute',
                    left: 12,
                    fontSize: '0.9rem',
                    color: '#78716C',
                    fontWeight: 500,
                    pointerEvents: 'none'
                  }}>
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="urbanvibe"
                    value={storeHandle}
                    onChange={(e) => {
                      setHandleManuallyEdited(true);
                      setStoreHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    }}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 32px',
                      fontSize: '0.9rem',
                      border: `1px solid ${handleAvailable === false ? '#EF4444' : handleAvailable === true ? '#10B981' : '#D6D3D1'}`,
                      backgroundColor: '#FFFFFF',
                      color: '#0A0A0A',
                      outline: 'none',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{
                  marginTop: '0.45rem',
                  padding: '7px 10px',
                  background: '#F5F5F4',
                  border: '1px solid #E7E5E4',
                  fontSize: '0.74rem',
                  color: '#57534E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Globe size={13} color="#059669" />
                    <span>Store URL: <strong>https://{previewHandle}.voguesocial.com</strong></span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#A8A29E', letterSpacing: '0.08em' }}>SSL ACTIVE</span>
                </div>
                {handleError && (
                  <div style={{ fontSize: '0.72rem', color: '#DC2626', marginTop: '0.3rem' }}>
                    {handleError}
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem', color: '#44403C' }}>
                  Business Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    required
                    placeholder="e.g. designer@brand.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      fontSize: '0.9rem',
                      border: '1px solid #D6D3D1',
                      backgroundColor: '#FFFFFF',
                      color: '#0A0A0A',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: 12, top: 13, color: '#A8A29E' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.4rem', color: '#44403C' }}>
                  Password (minimum 6 characters)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      fontSize: '0.9rem',
                      border: '1px solid #D6D3D1',
                      backgroundColor: '#FFFFFF',
                      color: '#0A0A0A',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: 12, top: 13, color: '#A8A29E' }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || handleAvailable === false}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '13px',
                  background: handleAvailable === false ? '#78716C' : '#0A0A0A',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: 0,
                  cursor: (loading || handleAvailable === false) ? 'not-allowed' : 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  transition: 'background 0.2s'
                }}
              >
                {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
                <span>{loading ? 'Provisioning Digital Atelier...' : 'Launch Boutique & Open Atelier'}</span>
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.72rem', color: '#A8A29E', lineHeight: 1.5 }}>
            By continuing, you agree to VogueSocial's{' '}
            <span style={{ textDecoration: 'underline', color: '#78716C' }}>Seller Protocol</span> and{' '}
            <span style={{ textDecoration: 'underline', color: '#78716C' }}>Virtual Fitting Terms</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
