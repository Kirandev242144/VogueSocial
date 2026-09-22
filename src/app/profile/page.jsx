"use client";
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import styles from './profile.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TryOnModal from '@/components/TryOnModal';
import {
  getUserTryOns,
  deleteUserTryOn,
  toggleLikeTryOn
} from '@/lib/tryOnHistoryService';
import {
  Shirt, Sparkles, Heart, Camera,
  ShoppingBag, Trash2, UploadCloud
} from 'lucide-react';

export default function UserProfilePage() {
  const { user } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('tryons'); // 'tryons' | 'photos' | 'wishlist'
  const [tryons, setTryons] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && (tabParam === 'tryons' || tabParam === 'photos' || tabParam === 'wishlist')) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (user) {
      setTryons(getUserTryOns(user.id));
    }
  }, [user]);

  const handleDeleteTryOn = (id) => {
    const updated = deleteUserTryOn(id);
    setTryons(updated.filter(t => !user || t.userId === user.id));
  };

  const handleToggleLike = (id) => {
    const updated = toggleLikeTryOn(id);
    setTryons(updated.filter(t => !user || t.userId === user.id));
  };

  const handleOpenTryOn = (item) => {
    setSelectedProductForModal({
      id: item.productId || item.id,
      name: item.productName,
      image_url: item.garmentImage || item.resultImage,
      category: item.category || 'tops'
    });
    setModalOpen(true);
  };

  return (
    <div>
      <Navbar />

      <main className={styles.page}>
        {/* ── 1. USER PROFILE HEADER ── */}
        <div className={styles.headerCard}>
          <div className={styles.userBioWrap}>
            <div className={styles.avatarWrapper}>
              {user?.image ? (
                <img src={user.image} alt={user.name} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarFallback}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>

            <div className={styles.userDetails}>
              <div className={styles.nameRow}>
                <h1 className={styles.userName}>{user?.name || 'Sarah Lin'}</h1>
                <span className={styles.badgeShopper}>
                  {user?.role === 'merchant' ? 'Merchant' : user?.role === 'admin' ? 'Admin' : 'Verified Shopper'}
                </span>
              </div>
              <span className={styles.userMetaText}>
                {user?.email || 'sarah@voguesocial.com'} · Member since {user?.memberSince || 'March 2025'}
              </span>
            </div>
          </div>

          <div className={styles.userStatsGroup}>
            <div className={styles.statPill}>
              <span className={styles.statNumber}>{tryons.length}</span>
              <span className={styles.statLabel}>Try-On Fits</span>
            </div>

            <div className={styles.statPill}>
              <span className={styles.statNumber}>
                {tryons.filter(t => t.liked).length}
              </span>
              <span className={styles.statLabel}>Saved Looks</span>
            </div>
          </div>
        </div>

        {/* ── 2. PROFILE TABS NAVIGATION (Clean Minimalist) ── */}
        <nav className={styles.tabsNav}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'tryons' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('tryons')}
          >
            <Shirt size={16} />
            <span>My Virtual Try-Ons ({tryons.length})</span>
          </button>

          <button
            className={`${styles.tabBtn} ${activeTab === 'photos' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            <Camera size={16} />
            <span>My Try-On Photos ({(user?.tryonPhotos || []).length || 2})</span>
          </button>

          <button
            className={`${styles.tabBtn} ${activeTab === 'wishlist' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <Heart size={16} />
            <span>Saved Outfits ({tryons.filter(t => t.liked).length})</span>
          </button>
        </nav>

        {/* ── TAB 1: MY VIRTUAL TRY-ONS ── */}
        {activeTab === 'tryons' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Virtual Fitting Room Looks</h2>
                <span className={styles.userMetaText}>
                  Garments and outfits generated by OmniTry AI tailored to your silhouette.
                </span>
              </div>

              <Link to="/" className={styles.btnActionPrimary}>
                <ShoppingBag size={14} />
                <span>Explore New Garments to Try On</span>
              </Link>
            </div>

            {tryons.length === 0 ? (
              <div className={styles.emptyBox}>
                <Shirt size={36} color="#a1a1aa" />
                <h3 className={styles.emptyTitle}>No Try-On Fits Yet</h3>
                <p className={styles.emptyDesc}>
                  Browse luxury garments on VogueSocial and click "Try On Virtually" to preview how they look on you.
                </p>
                <Link to="/" className={styles.btnActionPrimary}>
                  Browse Collection
                </Link>
              </div>
            ) : (
              <div className={styles.tryonsGrid}>
                {tryons.map((item) => (
                  <div key={item.id} className={styles.tryonCard}>
                    <div className={styles.cardMedia}>
                      <img
                        src={item.resultImage || item.garmentImage}
                        alt={item.productName}
                        className={styles.tryonImg}
                      />
                      <span className={styles.fitBadge}>
                        {item.fitScore || '98% Match'}
                      </span>

                      <button
                        className={`${styles.likeBtn} ${item.liked ? styles.likeBtnActive : ''}`}
                        onClick={() => handleToggleLike(item.id)}
                        title="Save to Wishlist"
                      >
                        <Heart size={16} fill={item.liked ? '#ef4444' : 'none'} color={item.liked ? '#ef4444' : 'currentColor'} />
                      </button>
                    </div>

                    <div className={styles.cardBody}>
                      <span className={styles.cardBrand}>{item.brand}</span>
                      <h3 className={styles.cardTitle}>{item.productName}</h3>

                      <div className={styles.cardMetaRow}>
                        <span>Size {item.size} · {item.modelUsed}</span>
                        <span className={styles.cardPrice}>{item.price}</span>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          className={styles.btnActionPrimary}
                          onClick={() => handleOpenTryOn(item)}
                        >
                          <Sparkles size={13} />
                          <span>Try On Again</span>
                        </button>

                        <button
                          className={styles.btnActionSecondary}
                          onClick={() => handleDeleteTryOn(item.id)}
                          title="Remove look"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: MY PHOTOS FOR AI TRY-ON ── */}
        {activeTab === 'photos' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Full-Body Fitting Photos</h2>
                <span className={styles.userMetaText}>
                  High-res reference photos used when testing garments with "Custom Upload".
                </span>
              </div>
            </div>

            <div className={styles.photosGrid}>
              {(user?.tryonPhotos && user.tryonPhotos.length > 0 ? user.tryonPhotos : [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80'
              ]).map((photoUrl, idx) => (
                <div key={idx} className={styles.photoCard}>
                  <img src={photoUrl} alt="User body reference" className={styles.photoImg} />
                  <span className={styles.primaryPhotoTag}>
                    {idx === 0 ? 'Primary Reference' : `Reference Photo ${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.uploadDropzone}>
              <div className={styles.uploadIconWrap}>
                <UploadCloud size={20} />
              </div>
              <p className={styles.uploadText}>Upload a New Full-Body Fitting Photo</p>
              <p className={styles.uploadSub}>
                For optimal results, stand against a neutral background in well-lit room. PNG or JPG up to 15MB.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 3: SAVED WISHLIST ── */}
        {activeTab === 'wishlist' && (
          <div>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Saved Luxury Outfits</h2>
                <span className={styles.userMetaText}>
                  Your curated wardrobe looks and favorite try-on styles.
                </span>
              </div>
            </div>

            {tryons.filter(t => t.liked).length === 0 ? (
              <div className={styles.emptyBox}>
                <Heart size={36} color="#a1a1aa" />
                <h3 className={styles.emptyTitle}>Your Wishlist is Empty</h3>
                <p className={styles.emptyDesc}>
                  Heart any try-on look to save it to your curated wardrobe for future checkout.
                </p>
              </div>
            ) : (
              <div className={styles.tryonsGrid}>
                {tryons.filter(t => t.liked).map((item) => (
                  <div key={item.id} className={styles.tryonCard}>
                    <div className={styles.cardMedia}>
                      <img
                        src={item.resultImage || item.garmentImage}
                        alt={item.productName}
                        className={styles.tryonImg}
                      />
                      <span className={styles.fitBadge}>
                        {item.fitScore || '98% Match'}
                      </span>
                    </div>

                    <div className={styles.cardBody}>
                      <span className={styles.cardBrand}>{item.brand}</span>
                      <h3 className={styles.cardTitle}>{item.productName}</h3>

                      <div className={styles.cardMetaRow}>
                        <span>Size {item.size}</span>
                        <span className={styles.cardPrice}>{item.price}</span>
                      </div>

                      <div className={styles.cardActions}>
                        <button
                          className={styles.btnActionPrimary}
                          onClick={() => handleOpenTryOn(item)}
                        >
                          <Sparkles size={13} />
                          <span>Try On Again</span>
                        </button>

                        <button
                          className={styles.btnActionSecondary}
                          onClick={() => handleToggleLike(item.id)}
                          title="Remove from wishlist"
                        >
                          <Heart size={14} fill="#ef4444" color="#ef4444" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── TRY-ON MODAL ── */}
      {modalOpen && (
        <TryOnModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            if (user) {
              setTryons(getUserTryOns(user.id));
            }
          }}
          product={selectedProductForModal}
          garmentImage={selectedProductForModal?.image_url}
          productTitle={selectedProductForModal?.name}
        />
      )}

      <Footer />
    </div>
  );
}
