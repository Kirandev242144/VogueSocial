'use client';
import React, { useState, useEffect } from 'react';
import { User, Sparkles, Check, Save, ShieldCheck, Mail, Phone, Ruler } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './CustomerSettings.css';

export default function CustomerSettingsTab() {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || 'John Miller');
  const [email, setEmail] = useState(user?.email || 'john@voguesocial.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [image, setImage] = useState(user?.image || '');

  // Sizing Preferences
  const [preferredSize, setPreferredSize] = useState(user?.measurements?.preferred_size || 'M');
  const [bottomSize, setBottomSize] = useState(user?.measurements?.bottom_size || '32');
  const [shoeSize, setShoeSize] = useState(user?.measurements?.shoe_size || '42 EU');
  const [fitPreference, setFitPreference] = useState(user?.measurements?.fit_preference || 'Regular');

  // Body Measurements
  const [height, setHeight] = useState(user?.measurements?.height || '178 cm');
  const [weight, setWeight] = useState(user?.measurements?.weight || '68 kg');
  const [bust, setBust] = useState(user?.measurements?.bust || '94 cm');
  const [waist, setWaist] = useState(user?.measurements?.waist || '78 cm');
  const [hips, setHips] = useState(user?.measurements?.hips || '98 cm');

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || 'John Miller');
      setEmail(user.email || 'john@voguesocial.com');
      setPhone(user.phone || '+1 (555) 234-5678');
      setImage(user.image || '');
      if (user.measurements) {
        setPreferredSize(user.measurements.preferred_size || 'M');
        setBottomSize(user.measurements.bottom_size || '32');
        setShoeSize(user.measurements.shoe_size || '42 EU');
        setFitPreference(user.measurements.fit_preference || 'Regular');
        setHeight(user.measurements.height || '178 cm');
        setWeight(user.measurements.weight || '68 kg');
        setBust(user.measurements.bust || '94 cm');
        setWaist(user.measurements.waist || '78 cm');
        setHips(user.measurements.hips || '98 cm');
      }
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();

    if (updateUserProfile) {
      updateUserProfile({
        name,
        email,
        phone,
        image,
        measurements: {
          preferred_size: preferredSize,
          bottom_size: bottomSize,
          shoe_size: shoeSize,
          fit_preference: fitPreference,
          height,
          weight,
          bust,
          waist,
          hips
        }
      });
    }

    setToastMessage('Profile and silhouette measurements saved');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="cust-settings-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1100,
          fontSize: '0.875rem'
        }}>
          <Check size={16} color="#4ADE80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="cust-settings-header-row">
        <div>
          <h2 className="cust-orders-title">Account & Silhouette Profile</h2>
          <span className="cust-orders-subtitle">
            Manage your personal profile and silhouette measurements calibrated for AI Virtual Try-On.
          </span>
        </div>

        <button type="button" className="cust-btn-primary" onClick={handleSave}>
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Section 1: Personal Details */}
        <div className="cust-settings-card" style={{ marginBottom: '1.5rem' }}>
          <h3 className="cust-settings-section-title">Personal Information</h3>
          <p className="cust-settings-section-sub">
            Used on order invoices and package delivery labels.
          </p>

          <div className="cust-form-grid-2">
            <div className="cust-form-group">
              <label className="cust-form-label">Full Name</label>
              <input
                type="text"
                className="cust-form-select"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="cust-form-group">
              <label className="cust-form-label">Email Address</label>
              <input
                type="email"
                className="cust-form-select"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="cust-form-grid-2">
            <div className="cust-form-group">
              <label className="cust-form-label">Phone Number</label>
              <input
                type="tel"
                className="cust-form-select"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="cust-form-group">
              <label className="cust-form-label">Avatar Photo URL</label>
              <input
                type="text"
                className="cust-form-select"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Body Measurements for AI Try-On */}
        <div className="cust-settings-card">
          <h3 className="cust-settings-section-title">Silhouette Measurements</h3>
          <p className="cust-settings-section-sub">
            Parameters calibrated for accurate garment warping in the AI virtual fitting room.
          </p>

          <div className="cust-form-grid-3">
            <div className="cust-form-group">
              <label className="cust-form-label">Height</label>
              <input
                type="text"
                className="cust-form-select"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            <div className="cust-form-group">
              <label className="cust-form-label">Weight</label>
              <input
                type="text"
                className="cust-form-select"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="cust-form-group">
              <label className="cust-form-label">Bust / Chest</label>
              <input
                type="text"
                className="cust-form-select"
                value={bust}
                onChange={(e) => setBust(e.target.value)}
              />
            </div>
          </div>

          <div className="cust-form-grid-2">
            <div className="cust-form-group">
              <label className="cust-form-label">Waist</label>
              <input
                type="text"
                className="cust-form-select"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>
            <div className="cust-form-group">
              <label className="cust-form-label">Hips</label>
              <input
                type="text"
                className="cust-form-select"
                value={hips}
                onChange={(e) => setHips(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
