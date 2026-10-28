"use client";
import React from 'react';

export default function StepRepresentative({ representative, onChange }) {
  return (
    <div className="mv-step-body">
      <div className="mv-section-intro">
        <h2 className="mv-section-heading">Authorized Legal Representative</h2>
        <p className="mv-section-sub">Authorized signatory or beneficial owner representing this merchant account</p>
      </div>

      <div className="mv-grid-2">
        <div className="mv-field">
          <label className="mv-label">
            Full Legal Name <span className="mv-req">*</span>
          </label>
          <input
            type="text"
            className="mv-input"
            placeholder="e.g. Camille Laurent"
            value={representative.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </div>

        <div className="mv-field">
          <label className="mv-label">
            Official Designation / Role <span className="mv-req">*</span>
          </label>
          <input
            type="text"
            className="mv-input"
            placeholder="e.g. Managing Director / CEO"
            value={representative.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
          />
        </div>

        <div className="mv-field">
          <label className="mv-label">
            Direct Email Address <span className="mv-req">*</span>
          </label>
          <input
            type="email"
            className="mv-input"
            placeholder="e.g. camille@studiolabelparis.com"
            value={representative.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
          />
        </div>

        <div className="mv-field">
          <label className="mv-label">
            Direct Contact Phone <span className="mv-req">*</span>
          </label>
          <input
            type="tel"
            className="mv-input"
            placeholder="e.g. +33 6 12 34 56 78"
            value={representative.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>

        <div className="mv-field">
          <label className="mv-label">Nationality</label>
          <input
            type="text"
            className="mv-input"
            placeholder="e.g. French"
            value={representative.nationality || ''}
            onChange={(e) => onChange('nationality', e.target.value)}
          />
        </div>

        <div className="mv-field">
          <label className="mv-label">Date of Birth</label>
          <input
            type="date"
            className="mv-input"
            value={representative.dob || ''}
            onChange={(e) => onChange('dob', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
