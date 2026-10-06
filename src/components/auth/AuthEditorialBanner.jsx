import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import './AuthEditorialBanner.css';

export default function AuthEditorialBanner() {
  return (
    <div className="auth-editorial-banner">
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80"
        alt="Haute Couture Editorial"
        className="auth-editorial-bg"
      />
      <div className="auth-editorial-gradient" />

      <div className="auth-editorial-content">
        <span className="auth-editorial-tag">VogueSocial Haute AI</span>

        <div className="auth-editorial-body">
          <h2 className="auth-editorial-headline">
            Your Personal Virtual Fitting Room.
          </h2>
          <p className="auth-editorial-sub">
            Try on any runway designer piece tailored directly to your proportions with OmniTry AI neural simulation.
          </p>

          <div className="auth-editorial-features">
            <div className="auth-editorial-feature-item">
              <Sparkles size={14} />
              <span>Sub-second 3D drape physics</span>
            </div>
            <div className="auth-editorial-feature-item">
              <CheckCircle2 size={14} />
              <span>3 Multi-tier Roles: Shopper, Brand & Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
