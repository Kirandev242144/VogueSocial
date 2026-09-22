'use client';
import React, { useState, useRef } from 'react';
import { ChevronLeft, Camera, ChevronDown, X, Plus, Sparkles, Shirt, Heart, ShoppingBag } from 'lucide-react';
import styles from './AiStylistSettings.module.css';

export default function AiStylistSettings({
  onBack,
  characterName = 'You',
  profile = {},
  onChangeProfile,
  onInitiateTryOn
}) {
  const [activeTab, setActiveTab] = useState('body'); // 'body' | 'tryons' | 'photos' | 'saved'
  const fileInputRef = useRef(null);
  const addPhotoInputRef = useRef(null);

  const {
    photo = null,
    gender = 'woman',
    weight = 60,
    height = 165,
    bodyType = 'Hourglass',
    styleDesc = 'Modern minimalist with a touch of streetwear',
    virtualTryOns = [],
    tryonPhotos = [],
    savedOutfits = []
  } = profile;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChangeProfile({ ...profile, photo: url });
    }
  };

  const handleAddTryonPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const updatedPhotos = [...tryonPhotos, url];
      onChangeProfile({ ...profile, tryonPhotos: updatedPhotos });
    }
  };

  const handleDeletePhoto = (idx) => {
    const updatedPhotos = tryonPhotos.filter((_, i) => i !== idx);
    onChangeProfile({ ...profile, tryonPhotos: updatedPhotos });
  };

  const bodyTypeOptions = [
    'Hourglass',
    'Pear',
    'Rectangle',
    'Inverted Triangle',
    'Apple',
    'Athletic'
  ];

  return (
    <div className={styles.settingsContainer}>
      {/* Title Header with Back Button & Persona Badge */}
      <div className={styles.titleRow}>
        <div className={styles.titleLeft}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={onBack}
            aria-label="Back to chat"
          >
            <ChevronLeft size={18} />
          </button>
          <h3 className={styles.sectionTitle}>My Body Type & Style</h3>
        </div>
        <span className={styles.characterBadge}>{characterName}</span>
      </div>

      {/* Tabs Bar: Body & Style | My Virtual Try-Ons (0) | My Try-On Photos (2) | Saved Outfits (0) */}
      <div className={styles.tabsBar}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'body' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('body')}
        >
          Body & Style
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'tryons' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('tryons')}
        >
          My Virtual Try-Ons ({virtualTryOns.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'photos' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          My Try-On Photos ({tryonPhotos.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'saved' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Outfits ({savedOutfits.length})
        </button>
      </div>

      {/* ── TAB 1: BODY & STYLE ── */}
      {activeTab === 'body' && (
        <>
          {/* Your Photo */}
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Your Photo</span>

            {photo ? (
              <div className={styles.photoPreviewWrap}>
                <img src={photo} alt="Body Fit Reference" className={styles.photoPreviewImg} />
                <button
                  type="button"
                  className={styles.removePhotoBtn}
                  onClick={() => onChangeProfile({ ...profile, photo: null })}
                  aria-label="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                className={styles.uploadCard}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className={styles.hiddenFileInput}
                  onChange={handlePhotoUpload}
                />
                <div className={styles.cameraIconCircle}>
                  <Camera size={18} />
                </div>
                <strong className={styles.uploadTitle}>Upload full body photo</strong>
                <span className={styles.uploadSubtitle}>Or select a character from the shop</span>
              </div>
            )}
          </div>

          {/* Gender */}
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Gender</span>
            <div className={styles.genderRow}>
              <label
                className={styles.genderOption}
                onClick={() => onChangeProfile({ ...profile, gender: 'woman' })}
              >
                <div className={`${styles.customRadio} ${gender === 'woman' ? styles.customRadioActive : ''}`}>
                  {gender === 'woman' && <div className={styles.radioDot} />}
                </div>
                <span>Woman</span>
              </label>

              <label
                className={styles.genderOption}
                onClick={() => onChangeProfile({ ...profile, gender: 'man' })}
              >
                <div className={`${styles.customRadio} ${gender === 'man' ? styles.customRadioActive : ''}`}>
                  {gender === 'man' && <div className={styles.radioDot} />}
                </div>
                <span>Man</span>
              </label>
            </div>
          </div>

          {/* Weight */}
          <div className={styles.fieldGroup}>
            <div className={styles.sliderHeaderRow}>
              <span className={styles.fieldLabel}>Weight (kg)</span>
              <span className={styles.sliderValBadge}>{weight} kg</span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              step="1"
              value={weight}
              onChange={(e) => onChangeProfile({ ...profile, weight: Number(e.target.value) })}
              className={styles.sliderInput}
            />
          </div>

          {/* Size (cm) */}
          <div className={styles.fieldGroup}>
            <div className={styles.sliderHeaderRow}>
              <span className={styles.fieldLabel}>Size (cm)</span>
              <span className={styles.sliderValBadge}>{height} cm</span>
            </div>
            <input
              type="range"
              min="130"
              max="210"
              step="1"
              value={height}
              onChange={(e) => onChangeProfile({ ...profile, height: Number(e.target.value) })}
              className={styles.sliderInput}
            />
          </div>

          {/* Body Type */}
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Body Type</span>
            <div className={styles.selectWrapper}>
              <select
                value={bodyType}
                onChange={(e) => onChangeProfile({ ...profile, bodyType: e.target.value })}
                className={styles.customSelect}
              >
                {bodyTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className={styles.selectChevron} />
            </div>
          </div>

          {/* Describe your style */}
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Describe your style</span>
            <textarea
              rows={3}
              value={styleDesc}
              onChange={(e) => onChangeProfile({ ...profile, styleDesc: e.target.value })}
              className={styles.styleTextarea}
              placeholder="Describe your style preferences..."
            />
          </div>
        </>
      )}

      {/* ── TAB 2: MY VIRTUAL TRY-ONS ── */}
      {activeTab === 'tryons' && (
        <>
          {virtualTryOns.length > 0 ? (
            <div className={styles.itemsGrid}>
              {virtualTryOns.map((item, idx) => (
                <div key={item.id || idx} className={styles.assetCard}>
                  <div className={styles.assetImgWrap}>
                    <img src={item.image} alt={item.name} className={styles.assetImg} />
                  </div>
                  <div className={styles.assetMetaRow}>
                    <h4 className={styles.assetTitle} title={item.name}>{item.name}</h4>
                    <span className={styles.assetSubtitle}>{item.price || item.date || 'Calibrated Fit'}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.assetActionBtn}
                    onClick={() => onInitiateTryOn && onInitiateTryOn({ name: item.name, image: item.image })}
                  >
                    <Sparkles size={12} />
                    <span>Try On Again</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Shirt size={28} />
              <strong className={styles.emptyStateTitle}>No Virtual Try-Ons Yet</strong>
              <p className={styles.emptyStateDesc}>
                Click "Virtual Try-On" on any shop product to calibrate it to {characterName}'s silhouette!
              </p>
            </div>
          )}
        </>
      )}

      {/* ── TAB 3: MY TRY-ON PHOTOS ── */}
      {activeTab === 'photos' && (
        <>
          <input
            ref={addPhotoInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenFileInput}
            onChange={handleAddTryonPhoto}
          />
          <div className={styles.photosGrid}>
            {tryonPhotos.map((photoUrl, idx) => (
              <div key={idx} className={styles.photoCard}>
                <img src={photoUrl} alt={`Reference ${idx + 1}`} className={styles.photoCardImg} />
                <button
                  type="button"
                  className={styles.deletePhotoBtn}
                  onClick={() => handleDeletePhoto(idx)}
                  title="Remove reference photo"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <div
              className={styles.addPhotoCard}
              onClick={() => addPhotoInputRef.current?.click()}
            >
              <Plus size={20} />
              <span>Add Photo</span>
            </div>
          </div>
        </>
      )}

      {/* ── TAB 4: SAVED OUTFITS ── */}
      {activeTab === 'saved' && (
        <>
          {savedOutfits.length > 0 ? (
            <div className={styles.itemsGrid}>
              {savedOutfits.map((outfit, idx) => (
                <div key={outfit.id || idx} className={styles.assetCard}>
                  <div className={styles.assetImgWrap}>
                    <img src={outfit.image} alt={outfit.name} className={styles.assetImg} />
                  </div>
                  <div className={styles.assetMetaRow}>
                    <h4 className={styles.assetTitle} title={outfit.name}>{outfit.name}</h4>
                    <span className={styles.assetSubtitle}>{outfit.price || 'Curated Look'}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.assetActionBtn}
                    onClick={() => onInitiateTryOn && onInitiateTryOn({ name: outfit.name, image: outfit.image })}
                  >
                    <ShoppingBag size={12} />
                    <span>Try On Look</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Heart size={28} />
              <strong className={styles.emptyStateTitle}>No Saved Outfits Yet</strong>
              <p className={styles.emptyStateDesc}>
                Save signature looks from your AI Stylist chat sessions to review them anytime!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
