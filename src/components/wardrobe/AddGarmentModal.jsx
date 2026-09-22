'use client';
import React, { useState } from 'react';
import { X, Upload, Sparkles, Check, RotateCcw, Loader2 } from 'lucide-react';
import { COLOR_PALETTE, OCCASIONS, SEASONS } from '@/lib/wardrobeConstants';
import styles from './AddGarmentModal.module.css';

export default function AddGarmentModal({ isOpen, onClose, onSaveGarment }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('tops');
  const [brand, setBrand] = useState('');
  const [occasion, setOccasion] = useState('Casual');
  const [season, setSeason] = useState('All');
  const [colors, setColors] = useState(['Black']);
  const [imageUrl, setImageUrl] = useState('');
  const [originalImageUrl, setOriginalImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In-browser AI background removal state (@imgly/background-removal)
  const [isCuttingOut, setIsCuttingOut] = useState(false);
  const [cutoutProgress, setCutoutProgress] = useState('');
  const [cutoutPercent, setCutoutPercent] = useState(0);
  const [isCutout, setIsCutout] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setName('');
    setCategory('tops');
    setBrand('');
    setOccasion('Casual');
    setSeason('All');
    setColors(['Black']);
    setImageUrl('');
    setOriginalImageUrl('');
    setIsCutout(false);
    setIsCuttingOut(false);
    onClose();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setOriginalImageUrl(reader.result);
        setIsCutout(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleColor = (colName) => {
    setColors(prev =>
      prev.includes(colName) ? prev.filter(c => c !== colName) : [...prev, colName]
    );
  };

  // Run in-browser AI Background Removal via @imgly/background-removal
  const handleAutoCutout = async () => {
    if (!imageUrl) return;

    try {
      setIsCuttingOut(true);
      setCutoutProgress('Loading AI cutout model...');
      setCutoutPercent(15);

      const { removeBackground } = await import('@imgly/background-removal');

      const blob = await removeBackground(imageUrl, {
        progress: (key, current, total) => {
          if (total > 0) {
            const pct = Math.min(99, Math.round((current / total) * 100));
            setCutoutPercent(pct);
            const stage = key.includes('fetch') ? 'Loading model' : 'Isolating garment';
            setCutoutProgress(`${stage}... ${pct}%`);
          } else {
            setCutoutProgress('Isolating garment...');
          }
        }
      });

      setCutoutPercent(100);
      setCutoutProgress('Finalizing transparent PNG...');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setIsCutout(true);
        setIsCuttingOut(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Background removal failed:', err);
      alert('Could not isolate garment background: ' + (err?.message || 'Please ensure photo is uploaded directly from your device.'));
      setIsCuttingOut(false);
    }
  };

  const handleRevertOriginal = () => {
    if (originalImageUrl) {
      setImageUrl(originalImageUrl);
      setIsCutout(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please provide a garment name.');
      return;
    }
    if (!imageUrl.trim()) {
      alert('Please upload a photo of your garment.');
      return;
    }
    setIsSubmitting(true);
    await onSaveGarment({
      name: name.trim(),
      category: category.toLowerCase(),
      brand: brand.trim() || 'Custom',
      occasion,
      season,
      colors: colors.join(','),
      imageUrl: imageUrl.trim()
    });
    setIsSubmitting(false);
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleClose}>
      <div className={styles.modalDialog} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Upload Clothes to Wardrobe</h2>
          <button className={styles.closeBtn} onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Garment Photo */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Garment Photo</label>
            <label className={styles.uploadDropzone}>
              {imageUrl ? (
                <div className={`${styles.dropzonePreview} ${isCutout ? styles.transparentCheckerboard : ''}`}>
                  <img src={imageUrl} alt="Garment preview" className={styles.dropzonePreviewImg} />
                </div>
              ) : (
                <div className={styles.dropzonePlaceholder}>
                  <Upload size={28} className={styles.uploadIcon} />
                  <span className={styles.uploadPromptTitle}>Click to upload garment photo</span>
                  <span className={styles.uploadPromptSubtitle}>PNG, JPG, or WEBP from your device</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className={styles.fileInput}
              />
            </label>

            {/* Cutout Controls & Progress */}
            {imageUrl && (
              <div className={styles.cutoutControlRow}>
                {isCuttingOut ? (
                  <div className={styles.cutoutProgressWrap}>
                    <div className={styles.cutoutProgressHeader}>
                      <span className={styles.cutoutProgressText}>
                        <Loader2 size={13} className={styles.spinnerIcon} />
                        {cutoutProgress || 'Removing background...'}
                      </span>
                      <span className={styles.cutoutPercentText}>{cutoutPercent}%</span>
                    </div>
                    <div className={styles.cutoutProgressBarBg}>
                      <div className={styles.cutoutProgressBarFill} />
                    </div>
                  </div>
                ) : isCutout ? (
                  <div className={styles.cutoutSuccessBanner}>
                    <span className={styles.cutoutSuccessBadge}>
                      <Check size={14} /> Background Removed · Transparent PNG
                    </span>
                    <button
                      type="button"
                      className={styles.revertBtn}
                      onClick={handleRevertOriginal}
                      title="Revert back to original photo"
                    >
                      <RotateCcw size={12} /> Revert
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.cutoutBtn}
                    onClick={handleAutoCutout}
                  >
                    <Sparkles size={14} className={styles.cutoutSparkleIcon} />
                    <span>Auto Cutout (Remove Background)</span>
                  </button>
                )}
              </div>
            )}

            <div className={styles.urlInputRow}>
              <input
                type="url"
                className={styles.formInput}
                placeholder="Or enter photo URL (https://...)"
                value={imageUrl}
                onChange={e => {
                  setImageUrl(e.target.value);
                  setOriginalImageUrl(e.target.value);
                  setIsCutout(false);
                }}
              />
            </div>
          </div>

          {/* Garment Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Garment Name</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Oversized Structured Wool Blazer"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Category</label>
            <div className={styles.filterOptionsWrap}>
              {['tops', 'bottoms', 'outerwear', 'shoes', 'dresses', 'accessories'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.filterOptionPill} ${category === cat ? styles.filterOptionPillActive : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Brand & Occasion */}
          <div className={styles.twoColGrid}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Brand / Designer</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Studio Label, COS, Zara"
                value={brand}
                onChange={e => setBrand(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Occasion</label>
              <select
                className={styles.formInput}
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
              >
                {OCCASIONS.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Season */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Season</label>
            <div className={styles.filterOptionsWrap}>
              {SEASONS.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.filterOptionPill} ${season === s ? styles.filterOptionPillActive : ''}`}
                  onClick={() => setSeason(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Garment Color(s)</label>
            <div className={styles.colorSwatchesRow}>
              {COLOR_PALETTE.map(c => {
                const isSelected = colors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    className={`${styles.colorSwatchBtn} ${styles[c.cssClass]} ${isSelected ? styles.colorSwatchActive : ''}`}
                    onClick={() => handleToggleColor(c.name)}
                    title={c.name}
                  >
                    {isSelected && <span className={styles.swatchDot}>•</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.modalBtnRow}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isSubmitting || isCuttingOut}
            >
              {isSubmitting ? 'Saving...' : 'Add to Wardrobe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
