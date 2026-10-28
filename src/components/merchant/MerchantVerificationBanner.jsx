"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Clock, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { merchantService } from '@/services/merchantService';
import './MerchantVerificationBanner.css';

export default function MerchantVerificationBanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kybStatus, setKybStatus] = useState('verified');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const identifier = user?.storeHandle || user?.id || 'studiolabel';
        const res = await merchantService.getMerchantVerification(identifier);
        if (res?.success && res.vendor) {
          setKybStatus(res.vendor.kyb_status || res.vendor.kyc_status || 'unsubmitted');
        }
      } catch (e) {
        console.error('Failed to check verification status:', e);
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, [user]);

  if (loading || kybStatus === 'verified') {
    return null; // Don't show banner if already verified or still loading
  }

  const isUnderReview = kybStatus === 'under_review';
  const isRejected = kybStatus === 'rejected';

  return (
    <div className={`mv-banner-container mv-banner-${kybStatus}`}>
      <div className="mv-banner-left">
        <div className="mv-banner-icon">
          {isUnderReview ? <Clock size={16} /> : isRejected ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
        </div>
        <div>
          <div className="mv-banner-title">
            <span>
              {isUnderReview
                ? 'KYB Compliance Documents Under Review'
                : isRejected
                ? 'Action Required: Update Verification Documents'
                : 'Action Required: Complete Merchant Business Verification'}
            </span>
          </div>
          <p className="mv-banner-desc">
            {isUnderReview
              ? 'Your corporate registration and compliance documents have been submitted and are pending Super Admin validation.'
              : isRejected
              ? 'Our compliance specialist requested updates on your legal documents before daily Stripe escrow payouts can resume.'
              : 'Provide your legal entity registration details and upload verification documents to unlock automated Stripe escrow bank payouts.'}
          </p>
        </div>
      </div>

      <div className="mv-banner-right">
        <button
          type="button"
          className="mv-banner-btn"
          onClick={() => navigate('/merchant/verification')}
        >
          <span>{isUnderReview ? 'Check Status' : isRejected ? 'Review Issues' : 'Complete Verification'}</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
