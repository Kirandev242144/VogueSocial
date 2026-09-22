'use client';
import React, { useState } from 'react';
import { Luggage, Plus, Trash2, Check, Sparkles, X, MapPin } from 'lucide-react';
import { getTripCoverImage } from '@/lib/wardrobeConstants';
import styles from './TripPlannerTab.module.css';

export default function TripPlannerTab({
  trips,
  items,
  onOpenCreateTrip,
  onDeleteTrip,
  onToggleChecklistItem,
  onAddChecklistItem,
  onDeleteChecklistItem,
  onOpenPackModal,
  onUnpackGarment
}) {
  const [newChecklistInputs, setNewChecklistInputs] = useState({});

  const handleInputChange = (tripId, text) => {
    setNewChecklistInputs(prev => ({ ...prev, [tripId]: text }));
  };

  const handleAddSubmit = (e, trip) => {
    e.preventDefault();
    const text = (newChecklistInputs[trip.id] || '').trim();
    if (!text) return;
    onAddChecklistItem(trip, text);
    setNewChecklistInputs(prev => ({ ...prev, [trip.id]: '' }));
  };

  return (
    <div className={styles.tripContainer}>
      <div className={styles.tripHeaderRow}>
        <div>
          <h2 className={styles.sectionHeading}>Trip Packing Planner</h2>
          <p className={styles.pageSubtitle}>Curate your destination capsule wardrobe and packing checklists</p>
        </div>
        <button className={styles.primaryBtn} onClick={onOpenCreateTrip}>
          <Plus size={15} />
          <span>Create Trip</span>
        </button>
      </div>

      {trips.length === 0 ? (
        <div className={styles.emptyScheduleBox}>
          <Luggage size={36} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No upcoming trips planned</h3>
          <p className={styles.emptySubtitle}>
            Create your first travel capsule to organize outfits, luggage pieces, and essential checklists!
          </p>
          <button className={styles.emptyActionBtn} onClick={onOpenCreateTrip}>
            <Plus size={14} /> Plan Your First Trip
          </button>
        </div>
      ) : (
        <div className={styles.tripsGrid}>
          {trips.map(trip => {
            let parsedGarments = [];
            try {
              parsedGarments = JSON.parse(trip.packedGarmentIds || '[]');
            } catch (e) {
              parsedGarments = [];
            }

            let parsedChecklist = {};
            try {
              parsedChecklist = JSON.parse(trip.checklist || '{}');
            } catch (e) {
              parsedChecklist = {};
            }

            const checklistEntries = Object.entries(parsedChecklist);
            const checkedCount = checklistEntries.filter(([_, val]) => val).length;
            const totalChecks = checklistEntries.length;
            const packedItems = parsedGarments.map(id => items.find(i => i.id === id)).filter(Boolean);

            // Compute readiness percent
            const totalTasks = totalChecks + Math.max(1, packedItems.length);
            const doneTasks = checkedCount + packedItems.length;
            const pct = Math.min(100, Math.round((doneTasks / totalTasks) * 100));

            const widthStep = Math.min(100, Math.max(0, Math.round(pct / 10) * 10));
            const widthClass = styles[`w${widthStep}`] || styles.w0;

            const coverUrl = getTripCoverImage(trip);

            return (
              <div key={trip.id} className={styles.tripCard}>
                {/* 1. Destination Thumbnail Cover */}
                <div className={styles.tripCoverThumb}>
                  <img src={coverUrl} alt={trip.destination} className={styles.tripCoverImg} />
                  <div className={styles.tripCoverGradient} />

                  {/* Overlaid Header Info */}
                  <div className={styles.coverHeaderContent}>
                    <div className={styles.destinationPillRow}>
                      <span className={styles.destinationBadge}>
                        <MapPin size={11} /> {trip.destination}
                      </span>
                      <span className={styles.datesBadge}>{trip.dates || 'Upcoming'}</span>
                    </div>
                  </div>

                  {/* Top-Right Delete Action */}
                  <button
                    className={styles.deleteCoverBtn}
                    onClick={() => onDeleteTrip(trip.id, trip.destination)}
                    title="Delete Trip"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* 2. Card Content */}
                <div className={styles.tripCardBody}>
                  {/* Progress Header */}
                  <div className={styles.progressSection}>
                    <div className={styles.tripProgressHeader}>
                      <span className={styles.progressTitle}>Packing Progress</span>
                      <span className={styles.tripProgressPct}>{pct}%</span>
                    </div>
                    <div className={styles.progressBarTrack}>
                      <div className={`${styles.progressBarFill} ${widthClass}`} />
                    </div>
                    <span className={styles.progressSubtitle}>
                      {checkedCount}/{totalChecks} essentials checked · {packedItems.length} pieces packed
                    </span>
                  </div>

                  {/* 3. Packed Wardrobe Clothes Showcase */}
                  <div className={styles.packedClothesSection}>
                    <div className={styles.sectionSubheaderRow}>
                      <span className={styles.packedClothesLabel}>
                        Packed Clothes ({packedItems.length})
                      </span>
                      <button
                        type="button"
                        className={styles.packManageBtn}
                        onClick={() => onOpenPackModal(trip)}
                      >
                        <Plus size={12} /> Pack Clothes
                      </button>
                    </div>

                    {packedItems.length > 0 ? (
                      <div className={styles.packedClothesRow}>
                        {packedItems.map((piece) => (
                          <div key={piece.id} className={styles.lookThumb} title={piece.name}>
                            <img src={piece.imageUrl} alt={piece.name} className={styles.lookThumbImg} />
                            <button
                              type="button"
                              className={styles.removePieceBtn}
                              onClick={() => onUnpackGarment(trip, piece.id)}
                              title={`Unpack ${piece.name}`}
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.noItemsBox} onClick={() => onOpenPackModal(trip)}>
                        <Luggage size={16} className={styles.noItemsIcon} />
                        <span>No clothes packed yet. Click to select from your wardrobe.</span>
                      </div>
                    )}
                  </div>

                  {/* 4. Essentials Checklist */}
                  <div className={styles.checklistSection}>
                    <span className={styles.packedClothesLabel}>Essentials Checklist:</span>
                    <div className={styles.checklistWrap}>
                      {checklistEntries.map(([title, isChecked]) => (
                        <div key={title} className={styles.checkItemRow}>
                          <div
                            className={styles.checkItem}
                            onClick={() => onToggleChecklistItem(trip, title, !isChecked)}
                          >
                            <div className={`${styles.checkCheckbox} ${isChecked ? styles.checkCheckboxActive : ''}`}>
                              {isChecked && <Check size={11} />}
                            </div>
                            <span className={`${styles.checkText} ${isChecked ? styles.checkTextChecked : ''}`}>
                              {title}
                            </span>
                          </div>
                          <button
                            type="button"
                            className={styles.deleteCheckItemBtn}
                            onClick={() => onDeleteChecklistItem(trip, title)}
                            title="Remove checklist item"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Item Input */}
                    <form className={styles.addItemForm} onSubmit={(e) => handleAddSubmit(e, trip)}>
                      <input
                        type="text"
                        className={styles.addItemInput}
                        placeholder="+ Add travel essential (e.g. Camera, Sunscreen)..."
                        value={newChecklistInputs[trip.id] || ''}
                        onChange={(e) => handleInputChange(trip.id, e.target.value)}
                      />
                      <button type="submit" className={styles.addItemBtn} title="Add to list">
                        <Plus size={13} />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
