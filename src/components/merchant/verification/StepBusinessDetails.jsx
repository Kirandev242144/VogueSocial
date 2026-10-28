"use client";
import React from 'react';

export default function StepBusinessDetails({ form, onChange }) {
  return (
    <div className="mv-step-body">
      <div className="mv-section-intro">
        <h2 className="mv-section-heading">Legal Entity Information</h2>
        <p className="mv-section-sub">Details matching your company registry or tax documentation</p>
      </div>

      <div className="mv-grid-2">
        <div className="mv-field">
          <label className="mv-label">
            Legal Business Name <span className="mv-req">*</span>
          </label>
          <input
            type="text"
            className="mv-input"
            placeholder="e.g. Studio Label Paris S.A.S."
            value={form.legal_business_name}
            onChange={(e) => onChange('legal_business_name', e.target.value)}
          />
        </div>

        <div className="mv-field">
          <label className="mv-label">
            Entity Structure <span className="mv-req">*</span>
          </label>
          <select
            className="mv-select"
            value={form.business_type}
            onChange={(e) => onChange('business_type', e.target.value)}
          >
            <option value="Corporation (S.A.S., S.A., Inc.)">Corporation (S.A.S., S.A., Inc.)</option>
            <option value="Limited Liability Company (LLC / SARL / GmbH)">Limited Liability Company (LLC / SARL / GmbH)</option>
            <option value="Sole Proprietorship / Auto-Entrepreneur">Sole Proprietorship / Auto-Entrepreneur</option>
            <option value="Partnership (General / Limited)">Partnership (General / Limited)</option>
          </select>
        </div>

        <div className="mv-field">
          <label className="mv-label">
            Company Registration Number <span className="mv-req">*</span>
          </label>
          <input
            type="text"
            className="mv-input"
            placeholder="e.g. RCS-PARIS-892938491"
            value={form.registration_number}
            onChange={(e) => onChange('registration_number', e.target.value)}
          />
        </div>

        <div className="mv-field">
          <label className="mv-label">
            Tax ID / VAT Registration <span className="mv-req">*</span>
          </label>
          <input
            type="text"
            className="mv-input"
            placeholder="e.g. FR-89-293849102"
            value={form.tax_id}
            onChange={(e) => onChange('tax_id', e.target.value)}
          />
        </div>

        <div className="mv-field">
          <label className="mv-label">
            Country of Registration <span className="mv-req">*</span>
          </label>
          <select
            className="mv-select"
            value={form.country}
            onChange={(e) => onChange('country', e.target.value)}
          >
            <option value="France">France</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
            <option value="Italy">Italy</option>
            <option value="Germany">Germany</option>
            <option value="Spain">Spain</option>
            <option value="Japan">Japan</option>
          </select>
        </div>

        <div className="mv-field">
          <label className="mv-label">
            Business Phone <span className="mv-req">*</span>
          </label>
          <input
            type="tel"
            className="mv-input"
            placeholder="e.g. +33 1 42 68 55 00"
            value={form.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
