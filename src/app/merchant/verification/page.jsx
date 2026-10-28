"use client";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { merchantService } from '@/services/merchantService';
import {
  VerificationHeader,
  VerificationNav,
  StepBusinessDetails,
  StepAddresses,
  StepRepresentative,
  StepDocuments,
  VerificationActions
} from '@/components/merchant/verification';
import './VerificationPage.css';

const INITIAL_FORM = {
  legal_business_name: '',
  business_type: 'Corporation (S.A.S., S.A., Inc.)',
  tax_id: '',
  registration_number: '',
  phone: '',
  country: 'France',
  legal_address: { street: '', city: '', postal_code: '', country: 'France' },
  return_warehouse_address: { street: '', city: '', postal_code: '', country: 'France' },
  representative: { name: '', title: 'Managing Director', email: '', phone: '', nationality: 'French', dob: '1988-06-15' }
};

export default function MerchantVerificationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [sameAsRegistered, setSameAsRegistered] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [attestationAgreed, setAttestationAgreed] = useState(false);
  const [vendorData, setVendorData] = useState(null);

  // Load merchant record
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const vendorId = user?.storeHandle || user?.id || 'studiolabel';
        const res = await merchantService.getMerchantVerification(vendorId);
        if (res?.success && res.vendor) {
          const v = res.vendor;
          setVendorData(v);
          setForm({
            legal_business_name: v.legal_business_name || v.store_name || user?.storeName || '',
            business_type: v.business_type || 'Corporation (S.A.S., S.A., Inc.)',
            tax_id: v.tax_id || '',
            registration_number: v.registration_number || '',
            phone: v.phone || '',
            country: v.country || 'France',
            legal_address: {
              street: v.legal_address?.street || '',
              city: v.legal_address?.city || '',
              postal_code: v.legal_address?.postal_code || '',
              country: v.legal_address?.country || 'France'
            },
            return_warehouse_address: {
              street: v.return_warehouse_address?.street || '',
              city: v.return_warehouse_address?.city || '',
              postal_code: v.return_warehouse_address?.postal_code || '',
              country: v.return_warehouse_address?.country || 'France'
            },
            representative: {
              name: v.representative?.name || user?.name || '',
              title: v.representative?.title || 'Managing Director',
              email: v.representative?.email || user?.email || '',
              phone: v.representative?.phone || v.phone || '',
              nationality: v.representative?.nationality || 'French',
              dob: v.representative?.dob || '1988-06-15'
            }
          });
          setDocuments(v.documents || []);

          if (v.return_warehouse_address?.street && v.legal_address?.street) {
            setSameAsRegistered(
              v.return_warehouse_address.street === v.legal_address.street &&
              v.return_warehouse_address.city === v.legal_address.city
            );
          }
        }
      } catch (err) {
        console.error('Failed to load merchant verification data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const notify = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleFieldChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  const handleLegalAddressChange = (key, val) => {
    setForm(prev => {
      const nextLegal = { ...prev.legal_address, [key]: val };
      return {
        ...prev,
        legal_address: nextLegal,
        return_warehouse_address: sameAsRegistered ? { ...nextLegal } : prev.return_warehouse_address
      };
    });
  };

  const handleReturnAddressChange = (key, val) => {
    setForm(prev => ({
      ...prev,
      return_warehouse_address: { ...prev.return_warehouse_address, [key]: val }
    }));
  };

  const handleToggleSameAddress = (checked) => {
    setSameAsRegistered(checked);
    if (checked) {
      setForm(prev => ({ ...prev, return_warehouse_address: { ...prev.legal_address } }));
    }
  };

  const handleRepChange = (key, val) => {
    setForm(prev => ({
      ...prev,
      representative: { ...prev.representative, [key]: val }
    }));
  };

  const handleUploadDoc = (docId, file) => {
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeMb > 0 ? sizeMb : '0.8'} MB`;

    setDocuments(prev => prev.map(d => (d.id === docId ? {
      ...d,
      filename: file.name,
      size: sizeStr,
      uploaded_at: new Date().toISOString(),
      status: 'pending'
    } : d)));
    notify(`Attached: ${file.name}`);
  };

  const handleRemoveDoc = (docId) => {
    setDocuments(prev => prev.map(d => (d.id === docId ? {
      ...d,
      filename: null,
      size: null,
      uploaded_at: null,
      status: 'required'
    } : d)));
    notify('Document removed');
  };

  const handleQuickFill = () => {
    const store = user?.storeName || 'Aura Label Paris';
    setForm({
      legal_business_name: `${store} S.A.S.`,
      business_type: 'Corporation (S.A.S., S.A., Inc.)',
      tax_id: 'FR-88-920194810',
      registration_number: 'RCS-PARIS-B-920194',
      phone: '+33 1 42 68 55 00',
      country: 'France',
      legal_address: { street: '14 Rue Saint-Honoré', city: 'Paris', postal_code: '75001', country: 'France' },
      return_warehouse_address: { street: '14 Rue Saint-Honoré', city: 'Paris', postal_code: '75001', country: 'France' },
      representative: {
        name: user?.name || 'Camille Laurent',
        title: 'Managing Director',
        email: user?.email || 'compliance@auralabel.com',
        phone: '+33 6 12 34 56 78',
        nationality: 'French',
        dob: '1989-04-12'
      }
    });

    setDocuments(prev => prev.map((doc, idx) => ({
      ...doc,
      filename: `${doc.id}_verified.pdf`,
      size: `${(1.2 + idx * 0.3).toFixed(1)} MB`,
      uploaded_at: new Date().toISOString(),
      status: 'pending'
    })));

    setSameAsRegistered(true);
    setAttestationAgreed(true);
    notify('Demo business details populated');
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const vendorId = user?.storeHandle || user?.id || 'studiolabel';
      const res = await merchantService.saveMerchantBusinessDetails(vendorId, { ...form, documents });
      if (res?.success) {
        setVendorData(res.vendor);
        notify('Verification draft saved');
      }
    } catch (e) {
      notify('Failed to save draft', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!attestationAgreed) {
      alert('Please check the certification box before submitting verification.');
      return;
    }

    setSubmitting(true);
    try {
      const vendorId = user?.storeHandle || user?.id || 'studiolabel';
      const res = await merchantService.submitMerchantVerification(vendorId, {
        businessData: form,
        documents
      });
      if (res?.success) {
        setVendorData(res.vendor);
        notify('Verification package submitted for review!', 'success');
        setTimeout(() => navigate('/merchant/dashboard'), 1200);
      }
    } catch (e) {
      notify('Submission failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const kybStatus = vendorData?.kyb_status || vendorData?.kyc_status || 'unsubmitted';

  if (loading) {
    return (
      <div className="mv-page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
        <Loader2 size={24} className="spin" color="var(--d-t3)" />
      </div>
    );
  }

  return (
    <div className="mv-page-wrapper">
      <VerificationHeader
        kybStatus={kybStatus}
        onQuickFill={handleQuickFill}
      />

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div className={`mv-notice ${feedback.type === 'error' ? 'mv-notice-error' : 'mv-notice-success'}`}>
          {feedback.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Stepper Navigation Bar */}
      <VerificationNav
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        kybStatus={kybStatus}
      />

      {/* Step Card Container */}
      <div className="mv-card">
        {currentStep === 1 && (
          <StepBusinessDetails
            form={form}
            onChange={handleFieldChange}
          />
        )}

        {currentStep === 2 && (
          <StepAddresses
            legalAddress={form.legal_address}
            returnAddress={form.return_warehouse_address}
            sameAsRegistered={sameAsRegistered}
            onLegalChange={handleLegalAddressChange}
            onReturnChange={handleReturnAddressChange}
            onToggleSame={handleToggleSameAddress}
          />
        )}

        {currentStep === 3 && (
          <StepRepresentative
            representative={form.representative}
            onChange={handleRepChange}
          />
        )}

        {currentStep === 4 && (
          <StepDocuments
            documents={documents}
            onUpload={handleUploadDoc}
            onRemove={handleRemoveDoc}
            attestationAgreed={attestationAgreed}
            onToggleAttestation={setAttestationAgreed}
          />
        )}

        {/* Minimal Actions Footer */}
        <VerificationActions
          currentStep={currentStep}
          maxSteps={4}
          saving={saving}
          submitting={submitting}
          onPrev={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          onNext={() => setCurrentStep(prev => Math.min(4, prev + 1))}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
