"use client";
import React from 'react';

export default function StepAddresses({
  legalAddress,
  returnAddress,
  sameAsRegistered,
  onLegalChange,
  onReturnChange,
  onToggleSame
}) {
  return (
    <div className="mv-step-body">
      <div className="mv-section-intro">
        <h2 className="mv-section-heading">Operating & Fulfillment Addresses</h2>
        <p className="mv-section-sub">Official headquarters and physical return warehouse destination</p>
      </div>

      {/* Legal Registered Address */}
      <div className="mv-block">
        <h3 className="mv-block-title">Registered Legal Headquarters</h3>
        <div className="mv-grid-2">
          <div className="mv-field mv-col-full">
            <label className="mv-label">
              Street Address <span className="mv-req">*</span>
            </label>
            <input
              type="text"
              className="mv-input"
              placeholder="e.g. 18 Rue du Faubourg Saint-Honoré"
              value={legalAddress.street || ''}
              onChange={(e) => onLegalChange('street', e.target.value)}
            />
          </div>

          <div className="mv-field">
            <label className="mv-label">
              City <span className="mv-req">*</span>
            </label>
            <input
              type="text"
              className="mv-input"
              placeholder="e.g. Paris"
              value={legalAddress.city || ''}
              onChange={(e) => onLegalChange('city', e.target.value)}
            />
          </div>

          <div className="mv-field">
            <label className="mv-label">
              Postal / Zip Code <span className="mv-req">*</span>
            </label>
            <input
              type="text"
              className="mv-input"
              placeholder="e.g. 75008"
              value={legalAddress.postal_code || ''}
              onChange={(e) => onLegalChange('postal_code', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Return Warehouse Address */}
      <div className="mv-block mv-block-border">
        <label className="mv-checkbox-row">
          <input
            type="checkbox"
            className="mv-checkbox"
            checked={sameAsRegistered}
            onChange={(e) => onToggleSame(e.target.checked)}
          />
          <span className="mv-checkbox-label">
            Return warehouse address is identical to registered legal headquarters
          </span>
        </label>

        {!sameAsRegistered && (
          <div className="mv-grid-2" style={{ marginTop: '1rem' }}>
            <div className="mv-field mv-col-full">
              <label className="mv-label">
                Warehouse Street Address <span className="mv-req">*</span>
              </label>
              <input
                type="text"
                className="mv-input"
                placeholder="e.g. Logistics Park Nord, Building B"
                value={returnAddress.street || ''}
                onChange={(e) => onReturnChange('street', e.target.value)}
              />
            </div>

            <div className="mv-field">
              <label className="mv-label">
                City <span className="mv-req">*</span>
              </label>
              <input
                type="text"
                className="mv-input"
                placeholder="e.g. Roissy-en-France"
                value={returnAddress.city || ''}
                onChange={(e) => onReturnChange('city', e.target.value)}
              />
            </div>

            <div className="mv-field">
              <label className="mv-label">
                Postal / Zip Code <span className="mv-req">*</span>
              </label>
              <input
                type="text"
                className="mv-input"
                placeholder="e.g. 95700"
                value={returnAddress.postal_code || ''}
                onChange={(e) => onReturnChange('postal_code', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
