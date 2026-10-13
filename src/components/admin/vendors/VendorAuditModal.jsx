"use client";
import React, { useState } from 'react';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { AdminModal } from '../index';
import VendorIdentityHeader from './VendorIdentityHeader';
import VendorAtelierTab from './VendorAtelierTab';
import VendorComplianceTab from './VendorComplianceTab';
import VendorFinancialsTab from './VendorFinancialsTab';
import VendorPayoutHoldModal from './VendorPayoutHoldModal';
import VendorStorefrontStatusModal from './VendorStorefrontStatusModal';
import './VendorAuditModal.css';

export default function VendorAuditModal({
  vendor,
  isOpen,
  onClose,
  onSaveBusiness,
  onUpdateDocStatus,
  onPlacePayoutHold,
  onReleasePayoutHold,
  onUpdateAgreementRate,
  onUpdateStorefrontStatus,
  // Backwards compatibility fallbacks:
  onUpdateTerms,
  onUpdateStatus,
  loading = false
}) {
  if (!vendor || !isOpen) return null;

  const [activeTab, setActiveTab] = useState('business');
  const [feedback, setFeedback] = useState(null);

  // Sub-modal states
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [holdCategory, setHoldCategory] = useState('Compliance Review');
  const [holdReason, setHoldReason] = useState('');

  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseNote, setReleaseNote] = useState('');

  const [showStorefrontStatusModal, setShowStorefrontStatusModal] = useState(false);
  const [targetStorefrontStatus, setTargetStorefrontStatus] = useState('');
  const [storefrontReason, setStorefrontReason] = useState('');

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleConfirmPayoutHold = async () => {
    if (!holdReason.trim()) {
      alert('Please provide a reason for placing a payout hold.');
      return;
    }
    if (onPlacePayoutHold) {
      await onPlacePayoutHold(vendor.id, {
        category: holdCategory,
        reason: holdReason,
        adminName: 'Platform Administrator'
      });
      setShowHoldModal(false);
      setHoldReason('');
      showFeedback('Payout hold placed. Storefront remains live.');
    } else if (onUpdateTerms) {
      await onUpdateTerms(vendor.id, { payout_hold: true });
      setShowHoldModal(false);
      showFeedback('Payout hold placed.');
    }
  };

  const handleConfirmReleasePayoutHold = async () => {
    if (onReleasePayoutHold) {
      await onReleasePayoutHold(vendor.id, {
        note: releaseNote || 'Compliance review resolved.',
        adminName: 'Platform Administrator'
      });
      setShowReleaseModal(false);
      setReleaseNote('');
      showFeedback('Payout hold released. Rolling payouts resumed.');
    } else if (onUpdateTerms) {
      await onUpdateTerms(vendor.id, { payout_hold: false });
      setShowReleaseModal(false);
      showFeedback('Payout hold released.');
    }
  };

  const handleConfirmStorefrontStatus = async () => {
    if (onUpdateStorefrontStatus) {
      await onUpdateStorefrontStatus(vendor.id, {
        status: targetStorefrontStatus,
        reason: storefrontReason,
        adminName: 'Platform Administrator'
      });
      setShowStorefrontStatusModal(false);
      setStorefrontReason('');
      showFeedback(`Storefront status updated to ${targetStorefrontStatus}.`);
    } else if (onUpdateStatus) {
      await onUpdateStatus(vendor.id, targetStorefrontStatus === 'active' ? 'approve' : 'suspend', storefrontReason);
      setShowStorefrontStatusModal(false);
      showFeedback(`Storefront status updated.`);
    }
  };

  // Status mapping
  const storefrontStatus = vendor.storefront_status || (vendor.vendor_status === 'approved' ? 'active' : (vendor.vendor_status === 'suspended' ? 'suspended' : 'under_review'));
  const kybStatus = vendor.kyb_status || vendor.kyc_status || 'verified';
  const payoutEligibility = vendor.payout_eligibility || (vendor.commercial_terms?.payout_hold || vendor.payout_hold_details?.active ? 'administrative_hold' : 'eligible');

  const docs = vendor.documents || [];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Boutique Dossier: ${vendor.store_name}`}
      maxWidth="840px"
      footer={
        <div className="vam-footer">
          <div className="vam-footer-id">
            <span>Merchant ID:</span>
            <code className="vam-footer-code">{vendor.id}</code>
          </div>

          <div className="vam-footer-actions">
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <a
              href={`/store/${vendor.store_handle}`}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              <span>Public Storefront</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      }
    >
      {/* Toast Feedback */}
      {feedback && (
        <div className={`vam-toast ${feedback.type === 'success' ? 'vam-toast-success' : 'vam-toast-error'}`}>
          {feedback.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Header Summary & Status Controls */}
      <VendorIdentityHeader
        vendor={vendor}
        storefrontStatus={storefrontStatus}
        kybStatus={kybStatus}
        payoutEligibility={payoutEligibility}
        onOpenStorefrontModal={(status) => {
          setTargetStorefrontStatus(status);
          setShowStorefrontStatusModal(true);
        }}
        onOpenHoldModal={() => setShowHoldModal(true)}
        onOpenReleaseModal={() => setShowReleaseModal(true)}
      />

      {/* Streamlined 3-Tab Navigation */}
      <div className="admin-tab-nav vam-tab-nav">
        {[
          { id: 'business', label: 'Atelier & Addresses' },
          { id: 'documents', label: 'Compliance Documents', count: docs.length },
          { id: 'financials', label: 'Financials & Commercials', alert: payoutEligibility === 'administrative_hold' }
        ].map(t => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              className={`admin-tab-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className="vam-tab-badge">{t.count}</span>
              )}
              {t.alert && (
                <span className="vam-tab-alert" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'business' && (
        <VendorAtelierTab
          vendor={vendor}
          onSaveBusiness={onSaveBusiness}
          loading={loading}
          showFeedback={showFeedback}
        />
      )}

      {activeTab === 'documents' && (
        <VendorComplianceTab
          vendor={vendor}
          onUpdateDocStatus={onUpdateDocStatus}
          showFeedback={showFeedback}
        />
      )}

      {activeTab === 'financials' && (
        <VendorFinancialsTab
          vendor={vendor}
          onUpdateAgreementRate={onUpdateAgreementRate}
          onOpenHoldModal={() => setShowHoldModal(true)}
          onOpenReleaseModal={() => setShowReleaseModal(true)}
          loading={loading}
          showFeedback={showFeedback}
        />
      )}

      {/* Subdialog: Place & Release Payout Hold */}
      <VendorPayoutHoldModal
        showHoldModal={showHoldModal}
        setShowHoldModal={setShowHoldModal}
        holdCategory={holdCategory}
        setHoldCategory={setHoldCategory}
        holdReason={holdReason}
        setHoldReason={setHoldReason}
        onConfirmHold={handleConfirmPayoutHold}
        showReleaseModal={showReleaseModal}
        setShowReleaseModal={setShowReleaseModal}
        releaseNote={releaseNote}
        setReleaseNote={setReleaseNote}
        onConfirmRelease={handleConfirmReleasePayoutHold}
        loading={loading}
      />

      {/* Subdialog: Suspend & Reactivate Storefront */}
      <VendorStorefrontStatusModal
        isOpen={showStorefrontStatusModal}
        onClose={() => setShowStorefrontStatusModal(false)}
        targetStorefrontStatus={targetStorefrontStatus}
        storefrontReason={storefrontReason}
        setStorefrontReason={setStorefrontReason}
        onConfirm={handleConfirmStorefrontStatus}
        loading={loading}
      />
    </AdminModal>
  );
}
