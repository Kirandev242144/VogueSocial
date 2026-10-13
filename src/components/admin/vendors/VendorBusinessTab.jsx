"use client";
import React, { useState, useEffect } from 'react';
import { Building2, MapPin, CheckCircle, User } from 'lucide-react';

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
    business_type: vendor.business_type || 'Corporation / LLC',
    tax_id: vendor.tax_id || '',
    registration_number: vendor.registration_number || '',
    phone: vendor.phone || '',
    country: vendor.country || 'France',
    legal_address: {
      street: vendor.legal_address?.street || '',
      city: vendor.legal_address?.city || '',
      postal_code: vendor.legal_address?.postal_code || '',
      country: vendor.legal_address?.country || vendor.country || ''
    },
    return_warehouse_address: {
      street: vendor.return_warehouse_address?.street || '',
      city: vendor.return_warehouse_address?.city || '',
      postal_code: vendor.return_warehouse_address?.postal_code || '',
      country: vendor.return_warehouse_address?.country || vendor.country || ''
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
        business_type: vendor.business_type || 'Corporation / LLC',
        tax_id: vendor.tax_id || '',
        registration_number: vendor.registration_number || '',
        phone: vendor.phone || '',
        country: vendor.country || 'France',
        legal_address: {
          street: vendor.legal_address?.street || '',
          city: vendor.legal_address?.city || '',
          postal_code: vendor.legal_address?.postal_code || '',
          country: vendor.legal_address?.country || vendor.country || ''
        },
        return_warehouse_address: {
          street: vendor.return_warehouse_address?.street || '',
          city: vendor.return_warehouse_address?.city || '',
          postal_code: vendor.return_warehouse_address?.postal_code || '',
          country: vendor.return_warehouse_address?.country || vendor.country || ''
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
      showFeedback('Business profile & addresses updated.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="vam-stack">
        {/* Legal Entity Registration */}
        <div className="vam-card">
          <div className="vam-card-header">
            <div className="vam-card-title">
              <Building2 size={13} color="#38bdf8" /> Legal Entity Registration
            </div>
          </div>

          <div className="vam-grid-2">
            <div>
              <label className="vam-field-label">Legal Company Name</label>
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
                    legal_address: {
                      ...prev.legal_address,
                      country: prev.legal_address.country ? val : prev.legal_address.country
                    }
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
                <option value="Corporation / S.A.S. / Inc.">Corporation (S.A.S., S.A., Inc.)</option>
                <option value="Limited Liability Company (LLC / SARL / S.r.l.)">Limited Liability Company (LLC / SARL / S.r.l.)</option>
                <option value="Sole Proprietorship / Auto-entrepreneur">Sole Proprietorship / Auto-entrepreneur (Individual)</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>

            <div>
              <label className="vam-field-label">Tax / VAT Number</label>
              <input
                type="text"
                className="admin-input"
                value={bizForm.tax_id}
                onChange={(e) => setBizForm({ ...bizForm, tax_id: e.target.value })}
                placeholder="e.g. FR892938491 / US EIN / GB VAT"
              />
            </div>

            <div>
              <label className="vam-field-label">Commercial Registry / Identifier</label>
              <input
                type="text"
                className="admin-input"
                value={bizForm.registration_number}
                onChange={(e) => setBizForm({ ...bizForm, registration_number: e.target.value })}
                placeholder="e.g. RCS Paris 892 938 491 / NY DOS / CRN"
              />
            </div>

            <div>
              <label className="vam-field-label">Business Contact Phone</label>
              <input
                type="text"
                className="admin-input"
                value={bizForm.phone}
                onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                placeholder="+33 1 42 68 55 00"
              />
            </div>
          </div>

          {bizForm.business_type.toLowerCase().includes('sole') && (
            <div className="vam-sole-proprietor-notice">
              <span className="vam-notice-title">Sole Proprietorship / Individual Merchant:</span>
              <span className="vam-notice-text">
                Commercial incorporation certificates are not applicable for this entity type. Business verification uses national identity and individual tax/registration proof.
              </span>
            </div>
          )}
        </div>

        {/* Addresses Grid */}
        <div className="vam-addresses-grid">
          {/* Registered Corporate Address */}
          <div className="vam-address-card">
            <div className="vam-address-header">
              <div className="vam-address-title">
                <MapPin size={12} color="#38bdf8" /> Registered Corporate Address
              </div>
            </div>

            <div className="vam-address-fields">
              <div>
                <label className="vam-sublabel">Street</label>
                <input
                  type="text"
                  className="admin-input"
                  value={bizForm.legal_address.street}
                  onChange={(e) => setBizForm({
                    ...bizForm,
                    legal_address: { ...bizForm.legal_address, street: e.target.value }
                  })}
                  placeholder="18 Rue du Faubourg Saint-Honoré"
                />
              </div>

              <div className="vam-grid-city-postal">
                <div>
                  <label className="vam-sublabel">City</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.legal_address.city}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      legal_address: { ...bizForm.legal_address, city: e.target.value }
                    })}
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="vam-sublabel">Postal Code</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.legal_address.postal_code}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      legal_address: { ...bizForm.legal_address, postal_code: e.target.value }
                    })}
                    placeholder="75008"
                  />
                </div>
              </div>

              <div>
                <label className="vam-sublabel">Country</label>
                <input
                  type="text"
                  className="admin-input"
                  value={bizForm.legal_address.country}
                  onChange={(e) => setBizForm({
                    ...bizForm,
                    legal_address: { ...bizForm.legal_address, country: e.target.value }
                  })}
                  placeholder="France"
                />
              </div>
            </div>
          </div>

          {/* Shipping & Returns Address */}
          <div className="vam-address-card">
            <div className="vam-address-header">
              <div className="vam-address-title">
                <MapPin size={12} color="#10b981" /> Shipping & Returns Address
              </div>

              <label className="vam-checkbox-label">
                <input
                  type="checkbox"
                  checked={sameAsRegistered}
                  onChange={handleSameAddressToggle}
                  className="vam-checkbox-input"
                />
                <span>Same as registered</span>
              </label>
            </div>

            {sameAsRegistered ? (
              <div className="vam-same-address-box">
                <div className="vam-same-address-heading">
                  <CheckCircle size={13} color="#10b981" />
                  <span>Same as registered business address</span>
                </div>
                <div className="vam-same-address-code">
                  {bizForm.legal_address.street || 'Address on file'}
                  <br />
                  {bizForm.legal_address.city || ''} {bizForm.legal_address.postal_code || ''} {bizForm.legal_address.country ? `• ${bizForm.legal_address.country}` : ''}
                </div>
              </div>
            ) : (
              <div className="vam-address-fields">
                <div>
                  <label className="vam-sublabel">Street / Unit</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.return_warehouse_address.street}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      return_warehouse_address: { ...bizForm.return_warehouse_address, street: e.target.value }
                    })}
                    placeholder="42 Rue de Paradis, Suite 3B"
                  />
                </div>

                <div className="vam-grid-city-postal">
                  <div>
                    <label className="vam-sublabel">City</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={bizForm.return_warehouse_address.city}
                      onChange={(e) => setBizForm({
                        ...bizForm,
                        return_warehouse_address: { ...bizForm.return_warehouse_address, city: e.target.value }
                      })}
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <label className="vam-sublabel">Postal Code</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={bizForm.return_warehouse_address.postal_code}
                      onChange={(e) => setBizForm({
                        ...bizForm,
                        return_warehouse_address: { ...bizForm.return_warehouse_address, postal_code: e.target.value }
                      })}
                      placeholder="75010"
                    />
                  </div>
                </div>

                <div>
                  <label className="vam-sublabel">Country</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={bizForm.return_warehouse_address.country}
                    onChange={(e) => setBizForm({
                      ...bizForm,
                      return_warehouse_address: { ...bizForm.return_warehouse_address, country: e.target.value }
                    })}
                    placeholder="France"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Representative Card */}
        <div className="vam-card">
          <div className="vam-card-header">
            <div className="vam-card-title">
              <User size={13} color="#38bdf8" /> Authorized Representative
            </div>
          </div>

          <div className="vam-grid-2">
            <div>
              <label className="vam-field-label">Representative Name</label>
              <input
                type="text"
                className="admin-input"
                value={bizForm.representative.name}
                onChange={(e) => setBizForm({
                  ...bizForm,
                  representative: { ...bizForm.representative, name: e.target.value }
                })}
                placeholder="Camille Laurent"
              />
            </div>

            <div>
              <label className="vam-field-label">Corporate Title</label>
              <input
                type="text"
                className="admin-input"
                value={bizForm.representative.title}
                onChange={(e) => setBizForm({
                  ...bizForm,
                  representative: { ...bizForm.representative, title: e.target.value }
                })}
                placeholder="Managing Director"
              />
            </div>

            <div>
              <label className="vam-field-label">Email</label>
              <input
                type="email"
                className="admin-input"
                value={bizForm.representative.email}
                onChange={(e) => setBizForm({
                  ...bizForm,
                  representative: { ...bizForm.representative, email: e.target.value }
                })}
                placeholder="camille@studiolabelparis.com"
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

        <div className="vam-form-actions">
          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-sm"
            disabled={loading}
          >
            Save Business Profile
          </button>
        </div>
      </div>
    </form>
  );
}
