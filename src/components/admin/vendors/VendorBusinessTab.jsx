"use client";
import React, { useState, useEffect } from 'react';

export default function VendorBusinessTab({
  vendor,
  onSaveBusiness,
  loading = false,
  showFeedback
}) {
  const isAddressesEqual = (a1, a2) => {
    if (!a1 || !a2) return false;
    const s1 = (a1.street || '').trim().toLowerCase();
    const s2 = (a2.street || '').trim().toLowerCase();
    const c1 = (a1.city || '').trim().toLowerCase();
    const c2 = (a2.city || '').trim().toLowerCase();
    return s1.length > 0 && s1 === s2 && c1 === c2;
  };

  const [bizForm, setBizForm] = useState({
    legal_business_name: vendor.legal_business_name || vendor.store_name || '',
    business_type: vendor.business_type || 'Corporation (S.A.S., S.A., Inc.)',
    tax_id: vendor.tax_id || '',
    registration_number: vendor.registration_number || '',
    phone: vendor.phone || '',
    country: vendor.country || 'France',
    legal_address: {
      street: vendor.legal_address?.street || '',
      city: vendor.legal_address?.city || '',
      postal_code: vendor.legal_address?.postal_code || '',
      country: vendor.legal_address?.country || vendor.country || 'France'
    },
    return_warehouse_address: {
      street: vendor.return_warehouse_address?.street || '',
      city: vendor.return_warehouse_address?.city || '',
      postal_code: vendor.return_warehouse_address?.postal_code || '',
      country: vendor.return_warehouse_address?.country || vendor.country || 'France'
    },
    representative: {
      name: vendor.representative?.name || '',
      title: vendor.representative?.title || '',
      email: vendor.representative?.email || vendor.email || '',
      phone: vendor.representative?.phone || vendor.phone || ''
    }
  });

  const [sameAsRegistered, setSameAsRegistered] = useState(
    isAddressesEqual(vendor.legal_address, vendor.return_warehouse_address) || !vendor.return_warehouse_address?.street
  );

  useEffect(() => {
    if (vendor) {
      const areEqual = isAddressesEqual(vendor.legal_address, vendor.return_warehouse_address) || !vendor.return_warehouse_address?.street;
      setSameAsRegistered(areEqual);
      setBizForm({
        legal_business_name: vendor.legal_business_name || vendor.store_name || '',
        business_type: vendor.business_type || 'Corporation (S.A.S., S.A., Inc.)',
        tax_id: vendor.tax_id || '',
        registration_number: vendor.registration_number || '',
        phone: vendor.phone || '',
        country: vendor.country || 'France',
        legal_address: {
          street: vendor.legal_address?.street || '',
          city: vendor.legal_address?.city || '',
          postal_code: vendor.legal_address?.postal_code || '',
          country: vendor.legal_address?.country || vendor.country || 'France'
        },
        return_warehouse_address: {
          street: vendor.return_warehouse_address?.street || '',
          city: vendor.return_warehouse_address?.city || '',
          postal_code: vendor.return_warehouse_address?.postal_code || '',
          country: vendor.return_warehouse_address?.country || vendor.country || 'France'
        },
        representative: {
          name: vendor.representative?.name || '',
          title: vendor.representative?.title || '',
          email: vendor.representative?.email || vendor.email || '',
          phone: vendor.representative?.phone || vendor.phone || ''
        }
      });
    }
  }, [vendor]);

  const handleSameAddressToggle = (e) => {
    const checked = e.target.checked;
    setSameAsRegistered(checked);
    if (checked) {
      setBizForm(prev => ({
        ...prev,
        return_warehouse_address: { ...prev.legal_address }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSaveBusiness) {
      const dataToSave = {
        ...bizForm,
        return_warehouse_address: sameAsRegistered ? { ...bizForm.legal_address } : bizForm.return_warehouse_address
      };
      await onSaveBusiness(vendor.id, dataToSave);
      showFeedback('Business information saved.');
    }
  };

  const isSoleProp = (bizForm.business_type || '').toLowerCase().includes('sole');

  return (
    <form onSubmit={handleSubmit} className="vam-tab-body">
      {/* Company Details */}
      <div className="vam-section">
        <div className="vam-section-header">
          <div className="vam-section-title">Legal Entity</div>
        </div>

        <div className="vam-grid-2">
          <div>
            <label className="vam-field-label">Legal Name</label>
            <input
              type="text"
              className="admin-input"
              value={bizForm.legal_business_name}
              onChange={(e) => setBizForm({ ...bizForm, legal_business_name: e.target.value })}
              placeholder="e.g. Studio Label Paris S.A.S."
              required
            />
          </div>

          <div>
            <label className="vam-field-label">Country of Registration</label>
            <select
              className="admin-input"
              value={bizForm.country}
              onChange={(e) => {
                const val = e.target.value;
                setBizForm(prev => ({
                  ...prev,
                  country: val,
                  legal_address: { ...prev.legal_address, country: val },
                  return_warehouse_address: sameAsRegistered ? { ...prev.return_warehouse_address, country: val } : prev.return_warehouse_address
                }));
              }}
            >
              <option value="France">France</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Italy">Italy</option>
              <option value="Germany">Germany</option>
              <option value="Spain">Spain</option>
              <option value="Other / Global">Other / Global</option>
            </select>
          </div>

          <div>
            <label className="vam-field-label">Entity Structure</label>
            <select
              className="admin-input"
              value={bizForm.business_type}
              onChange={(e) => setBizForm({ ...bizForm, business_type: e.target.value })}
            >
              <option value="Corporation (S.A.S., S.A., Inc.)">Corporation (S.A.S., S.A., Inc.)</option>
              <option value="Limited Liability Company (LLC / SARL / S.r.l.)">Limited Liability Company (LLC, SARL, S.r.l.)</option>
              <option value="Sole Proprietorship / Auto-entrepreneur">Sole Proprietorship / Auto-entrepreneur</option>
              <option value="Partnership">Partnership</option>
            </select>
          </div>

          <div>
            <label className="vam-field-label">Tax / VAT ID</label>
            <input
              type="text"
              className="admin-input"
              value={bizForm.tax_id}
              onChange={(e) => setBizForm({ ...bizForm, tax_id: e.target.value })}
              placeholder="e.g. FR892938491 / US EIN"
            />
          </div>

          <div>
            <label className="vam-field-label">Registration / Registry Number</label>
            <input
              type="text"
              className="admin-input"
              value={bizForm.registration_number}
              onChange={(e) => setBizForm({ ...bizForm, registration_number: e.target.value })}
              placeholder="e.g. RCS Paris 892 938 491 / NY DOS"
            />
          </div>

          <div>
            <label className="vam-field-label">Business Phone</label>
            <input
              type="text"
              className="admin-input"
              value={bizForm.phone}
              onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
              placeholder="+33 1 42 68 55 00"
            />
          </div>
        </div>

        {isSoleProp && (
          <div className="vam-notice-subtle">
            Sole Proprietorship — Corporate charter documents are exempt. Verification uses individual identity and tax/business registration.
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="vam-section">
        <div className="vam-section-header">
          <div className="vam-section-title">Addresses</div>
          <label className="vam-checkbox-label">
            <input
              type="checkbox"
              checked={sameAsRegistered}
              onChange={handleSameAddressToggle}
              className="vam-checkbox-input"
            />
            <span>Same shipping & returns address</span>
          </label>
        </div>

        <div className="vam-grid-2">
          {/* Registered Address */}
          <div className="vam-subgroup">
            <div className="vam-subgroup-title">Registered Corporate Address</div>
            <div className="vam-subgroup-fields">
              <input
                type="text"
                className="admin-input"
                placeholder="Street address"
                value={bizForm.legal_address.street}
                onChange={(e) => setBizForm({
                  ...bizForm,
                  legal_address: { ...bizForm.legal_address, street: e.target.value }
                })}
              />
              <div className="vam-grid-2">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="City"
                  value={bizForm.legal_address.city}
                  onChange={(e) => setBizForm({
                    ...bizForm,
                    legal_address: { ...bizForm.legal_address, city: e.target.value }
                  })}
                />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Postal Code"
                  value={bizForm.legal_address.postal_code}
                  onChange={(e) => setBizForm({
                    ...bizForm,
                    legal_address: { ...bizForm.legal_address, postal_code: e.target.value }
                  })}
                />
              </div>
              <input
                type="text"
                className="admin-input"
                placeholder="Country"
                value={bizForm.legal_address.country}
                onChange={(e) => setBizForm({
                  ...bizForm,
                  legal_address: { ...bizForm.legal_address, country: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Shipping & Returns Address */}
          <div className="vam-subgroup">
            <div className="vam-subgroup-title">Shipping & Returns Address</div>
            {sameAsRegistered ? (
              <div className="vam-same-addr-msg">
                <span>Same as registered business address</span>
                <span className="vam-same-addr-preview">
                  {bizForm.legal_address.street || 'Address on file'}, {bizForm.legal_address.city} {bizForm.legal_address.postal_code}
                </span>
              </div>
            ) : (
              <div className="vam-subgroup-fields">
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Street / Unit"
                  value={bizForm.return_warehouse_address.street}
                  onChange={(e) => setBizForm({
                    ...bizForm,
                    return_warehouse_address: { ...bizForm.return_warehouse_address, street: e.target.value }
                  })}
                />
                <div className="vam-grid-2">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="City"
                    value={bizForm.return_warehouse_address.city}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      return_warehouse_address: { ...bizForm.return_warehouse_address, city: e.target.value }
                    })}
                  />
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Postal Code"
                    value={bizForm.return_warehouse_address.postal_code}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      return_warehouse_address: { ...bizForm.return_warehouse_address, postal_code: e.target.value }
                    })}
                  />
                </div>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Country"
                  value={bizForm.return_warehouse_address.country}
                  onChange={(e) => setBizForm({
                    ...bizForm,
                    return_warehouse_address: { ...bizForm.return_warehouse_address, country: e.target.value }
                  })}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authorized Representative */}
      <div className="vam-section">
        <div className="vam-section-header">
          <div className="vam-section-title">Authorized Representative</div>
        </div>

        <div className="vam-grid-2">
          <div>
            <label className="vam-field-label">Representative Full Name</label>
            <input
              type="text"
              className="admin-input"
              value={bizForm.representative.name}
              onChange={(e) => setBizForm({
                ...bizForm,
                representative: { ...bizForm.representative, name: e.target.value }
              })}
              placeholder="e.g. Camille Laurent"
            />
          </div>

          <div>
            <label className="vam-field-label">Title / Role</label>
            <input
              type="text"
              className="admin-input"
              value={bizForm.representative.title}
              onChange={(e) => setBizForm({
                ...bizForm,
                representative: { ...bizForm.representative, title: e.target.value }
              })}
              placeholder="e.g. Managing Director"
            />
          </div>

          <div>
            <label className="vam-field-label">Direct Email</label>
            <input
              type="email"
              className="admin-input"
              value={bizForm.representative.email}
              onChange={(e) => setBizForm({
                ...bizForm,
                representative: { ...bizForm.representative, email: e.target.value }
              })}
              placeholder="camille@domain.com"
            />
          </div>

          <div>
            <label className="vam-field-label">Direct Phone</label>
            <input
              type="text"
              className="admin-input"
              value={bizForm.representative.phone}
              onChange={(e) => setBizForm({
                ...bizForm,
                representative: { ...bizForm.representative, phone: e.target.value }
              })}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="vam-footer-btn-row">
        <button
          type="submit"
          className="admin-btn admin-btn-primary admin-btn-sm"
          disabled={loading}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
