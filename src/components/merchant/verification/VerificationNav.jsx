"use client";
import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { step: 1, label: 'Entity Details' },
  { step: 2, label: 'Addresses' },
  { step: 3, label: 'Representative' },
  { step: 4, label: 'Documents' },
];

export default function VerificationNav({ currentStep, onSelectStep, kybStatus }) {
  return (
    <nav className="mv-nav-bar" aria-label="Verification Steps">
      {STEPS.map((s) => {
        const isActive = currentStep === s.step;
        const isDone = currentStep > s.step || kybStatus === 'verified';

        return (
          <button
            key={s.step}
            type="button"
            className={`mv-nav-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
            onClick={() => onSelectStep(s.step)}
          >
            <span className="mv-nav-badge">
              {isDone ? <Check size={12} strokeWidth={2.5} /> : s.step}
            </span>
            <span className="mv-nav-label">{s.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
