"use client";
import React from 'react';
import { ShieldCheck, Truck, DollarSign } from 'lucide-react';

export default function PaymentSecurityCard() {
  return (
    <div className="pg-security-card">
      <div className="pg-security-title">
        <ShieldCheck size={14} />
        <span>Fraud Protection & Payment Governance</span>
      </div>

      <div className="pg-security-grid">
        <div className="pg-security-item">
          <div className="pg-security-icon-box">
            <ShieldCheck size={15} />
          </div>
          <div className="pg-security-info">
            <span className="pg-security-name">Stripe Radar 3D Secure</span>
            <span className="pg-security-desc">
              Automated fraud screening and cardholder authentication active for all high-risk checkouts.
            </span>
          </div>
        </div>

        <div className="pg-security-item">
          <div className="pg-security-icon-box">
            <Truck size={15} />
          </div>
          <div className="pg-security-info">
            <span className="pg-security-name">Carrier POD Clearance</span>
            <span className="pg-security-desc">
              Funds clear for scheduled bank deposit 48 hours following verified courier delivery signature.
            </span>
          </div>
        </div>

        <div className="pg-security-item">
          <div className="pg-security-icon-box">
            <DollarSign size={15} />
          </div>
          <div className="pg-security-info">
            <span className="pg-security-name">Multi-Currency Settlement</span>
            <span className="pg-security-desc">
              Automatic currency conversion handled at wholesale interbank rates by Stripe.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
