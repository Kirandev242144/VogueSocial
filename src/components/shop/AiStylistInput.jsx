'use client';
import React from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';
import styles from './AiStylistPanel.module.css';

export default function AiStylistInput({
  quickPills = [],
  inputText,
  onInputChange,
  onSendMessage
}) {
  return (
    <div className={styles.bottomControls}>
      <div className={styles.quickPillsRow}>
        {quickPills.map((pill) => (
          <button
            key={pill}
            type="button"
            className={styles.pillBtn}
            onClick={() => onSendMessage(pill)}
          >
            {pill}
          </button>
        ))}
      </div>

      <div className={styles.inputContainer}>
        <button type="button" className={styles.attachBtn} aria-label="Attach photo or outfit reference">
          <Paperclip size={16} />
        </button>
        <input
          type="text"
          placeholder="Ask your stylist..."
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
          className={styles.stylistInput}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={() => onSendMessage()}
          disabled={!inputText.trim()}
          aria-label="Send message"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
