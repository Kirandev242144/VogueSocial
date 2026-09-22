'use client';
import React from 'react';
import { Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from './CalendarTab.module.css';

export default function CalendarTab({
  calendarDates,
  selectedDateStr,
  onSelectDate,
  schedules,
  outfits,
  items,
  onScheduleOutfit,
  onUnscheduleDate,
  onMarkAsWorn,
  onTryOnItem
}) {
  const activeScheduledLook = schedules.find(s => s.dateStr === selectedDateStr);
  const activeScheduledOutfit = activeScheduledLook
    ? outfits.find(o => o.id === activeScheduledLook.outfitId)
    : null;

  let scheduledPieces = [];
  if (activeScheduledOutfit) {
    try {
      const ids = JSON.parse(activeScheduledOutfit.productIds || '[]');
      scheduledPieces = ids.map(id => items.find(i => i.id === id)).filter(Boolean);
    } catch (e) {
      scheduledPieces = [];
    }
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarTitleRow}>
        <div>
          <h2 className={styles.sectionHeading}>Daily Look Scheduler</h2>
          <p className={styles.pageSubtitle}>Select a date to plan and log your outfits</p>
        </div>
        {activeScheduledOutfit && (
          <button
            className={styles.primaryBtn}
            onClick={() => onMarkAsWorn(activeScheduledOutfit.id)}
          >
            <CheckCircle2 size={14} />
            <span>Mark Worn Today</span>
          </button>
        )}
      </div>

      {/* Date Selector Strip */}
      <div className={styles.calendarStrip}>
        {calendarDates.map(item => {
          const isSelected = item.dateStr === selectedDateStr;
          const isScheduled = schedules.some(s => s.dateStr === item.dateStr);
          return (
            <div
              key={item.dateStr}
              className={`${styles.datePill} ${isSelected ? styles.datePillActive : ''}`}
              onClick={() => onSelectDate(item.dateStr)}
            >
              <span className={styles.dateDayName}>{item.dayName}</span>
              <span className={styles.dateDayNum}>{item.dayNum}</span>
              {isScheduled && <span className={styles.dateStatusDot} />}
            </div>
          );
        })}
      </div>

      {/* Scheduled Details */}
      {activeScheduledOutfit ? (
        <div className={styles.scheduledLookCard}>
          <div>
            <span className={styles.scheduleDateBadge}>Planned Look for {selectedDateStr}</span>
            <h3 className={styles.scheduleOutfitHeading}>{activeScheduledOutfit.name}</h3>
          </div>

          <div className={styles.scheduledItemsGrid}>
            {scheduledPieces.map((piece, idx) => (
              <div key={idx} className={styles.scheduledPieceCard}>
                <div className={styles.scheduledPieceImgBox}>
                  <img src={piece.imageUrl} alt={piece.name} className={styles.scheduledPieceImg} />
                </div>
                <span className={styles.scheduledPieceName}>{piece.name}</span>
                <span className={styles.scheduledPieceBrand}>{piece.brand}</span>
              </div>
            ))}
          </div>

          <div className={styles.actionButtonRow}>
            <button
              className={styles.secondaryBtn}
              onClick={() => onUnscheduleDate(selectedDateStr)}
            >
              Unschedule
            </button>
            <button
              className={styles.tryOnBtn}
              onClick={() => {
                if (scheduledPieces.length > 0) onTryOnItem(scheduledPieces[0]);
              }}
            >
              <Sparkles size={13} />
              <span>Try On Scheduled Outfit</span>
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyScheduleBox}>
          <Calendar size={36} />
          <p>No outfit scheduled for {selectedDateStr}.</p>
          {outfits.length > 0 ? (
            <div className={styles.assignOutfitRow}>
              <span className={styles.assignOutfitLabel}>Assign an outfit:</span>
              <select
                className={styles.sortSelect}
                onChange={(e) => {
                  const picked = outfits.find(o => o.id === e.target.value);
                  if (picked) onScheduleOutfit(picked);
                }}
                defaultValue=""
              >
                <option value="" disabled>Choose saved outfit...</option>
                {outfits.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <p className={styles.subtextNotice}>Create an outfit in Mix & Match to assign looks to your calendar.</p>
          )}
        </div>
      )}
    </div>
  );
}
