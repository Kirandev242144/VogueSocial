import React from 'react';
import './SocialAuthButtons.css';

export default function SocialAuthButtons({ onOAuth, disabled = false }) {
  return (
    <div className="social-auth-section">
      <div className="social-auth-divider">
        <span>or continue with</span>
      </div>

      <div className="social-auth-row">
        <button
          type="button"
          className="social-auth-btn"
          onClick={() => onOAuth('google')}
          disabled={disabled}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="social-auth-icon"
          />
          <span>Google</span>
        </button>

        <button
          type="button"
          className="social-auth-btn"
          onClick={() => onOAuth('facebook')}
          disabled={disabled}
        >
          <img
            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
            alt="Facebook"
            className="social-auth-icon"
          />
          <span>Facebook</span>
        </button>
      </div>
    </div>
  );
}
