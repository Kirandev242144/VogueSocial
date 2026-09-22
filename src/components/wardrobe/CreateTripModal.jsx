'use client';
import React, { useState } from 'react';
import { X, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import { DESTINATION_PRESETS } from '@/lib/wardrobeConstants';
import styles from './CreateTripModal.module.css';

export default function CreateTripModal({ isOpen, onClose, onSaveTrip }) {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(DESTINATION_PRESETS[0].id);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset.id);
    setCustomCoverUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination.trim()) {
      alert('Please enter a trip destination (e.g. Tokyo, Paris).');
      return;
    }

    setIsSubmitting(true);
    const chosenPreset = DESTINATION_PRESETS.find(p => p.id === selectedPreset);
    const coverImage = customCoverUrl.trim() || chosenPreset?.imageUrl || DESTINATION_PRESETS[0].imageUrl;

    const initialChecklist = {
      'Passport & Travel Documents': true,
      'Power Bank & International Adapter': true,
      'Designer Sunglasses': false,
      'Signature Fragrance': false
    };

    await onSaveTrip({
      destination: destination.trim(),
      dates: dates.trim() || 'Upcoming',
      coverImage,
      presetImage: selectedPreset,
      packedGarmentIds: JSON.stringify([]),
      checklist: JSON.stringify(initialChecklist)
    });

    setIsSubmitting(false);
    setDestination('');
    setDates('');
    setCustomCoverUrl('');
    onClose();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalDialog} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Plan a New Trip</h2>
            <p className={styles.modalSubtitle}>Curate your destination lookbook and packing list</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Destination */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <MapPin size={13} className={styles.labelIcon} />
              Destination
            </label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Tokyo Autumn, Paris Fashion Week, Milan"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              required
            />
          </div>

          {/* Dates */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Calendar size={13} className={styles.labelIcon} />
              Travel Dates
            </label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="e.g. Oct 15 - 22, 2026 or Spring 2027"
              value={dates}
              onChange={e => setDates(e.target.value)}
            />
          </div>

          {/* Destination Cover Thumbnail Selector */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <ImageIcon size={13} className={styles.labelIcon} />
              Destination Thumbnail Cover
            </label>
            <div className={styles.presetGrid}>
              {DESTINATION_PRESETS.map(preset => {
                const isSelected = !customCoverUrl && selectedPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`${styles.presetCard} ${isSelected ? styles.presetCardActive : ''}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    <img src={preset.imageUrl} alt={preset.name} className={styles.presetImg} />
                    <span className={styles.presetName}>{preset.name}</span>
                    {isSelected && <div className={styles.presetActiveRing} />}
                  </div>
                );
              })}
            </div>

            <input
              type="url"
              className={styles.formInput}
              placeholder="Or enter custom cover image URL (https://...)"
              value={customCoverUrl}
              onChange={e => setCustomCoverUrl(e.target.value)}
            />
          </div>

          <div className={styles.modalBtnRow}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
