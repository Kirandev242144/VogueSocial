import React from 'react';
import './AuthSizeSelector.css';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function AuthSizeSelector({ size, onSizeChange }) {
  return (
    <div className="auth-field-group">
      <label className="auth-field-label">Standard Fit Size</label>
      <div className="size-selector-row">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            className={`size-chip-btn ${size === s ? 'active' : ''}`}
            onClick={() => onSizeChange(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
