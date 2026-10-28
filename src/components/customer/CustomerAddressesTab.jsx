'use client';
import React, { useState, useEffect } from 'react';
import {
  MapPin, Plus, Check, Edit2, Trash2, Phone,
  X, ShieldCheck, Home, Briefcase
} from 'lucide-react';
import { customerOrderService } from '@/services/customerOrderService';
import './CustomerAddresses.css';

const EMPTY_FORM = {
  id: null,
  tag: 'Home',
  fullName: '',
  street: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  phone: '',
  isDefault: false
};

export default function CustomerAddressesTab() {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [toastMessage, setToastMessage] = useState(null);

  const loadAddresses = () => {
    const list = customerOrderService.getCustomerAddresses();
    setAddresses(list);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenAddModal = () => {
    setFormData({
      ...EMPTY_FORM,
      isDefault: addresses.length === 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr) => {
    setFormData({ ...addr });
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      const updated = customerOrderService.deleteCustomerAddress(id);
      setAddresses(updated);
      showToast('Address removed');
    }
  };

  const handleSetDefault = (id) => {
    const updated = customerOrderService.setDefaultAddress(id);
    setAddresses(updated);
    showToast('Default shipping address updated');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.street || !formData.city || !formData.country) {
      alert('Please fill out all required fields.');
      return;
    }

    const updated = customerOrderService.saveCustomerAddress(formData);
    setAddresses(updated);
    setIsModalOpen(false);
    showToast(formData.id ? 'Address updated successfully' : 'New shipping address saved');
  };

  return (
    <div className="cust-addr-container">
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
      <div className="cust-addr-header-row">
        <div className="cust-addr-title-wrap">
          <h2 className="cust-addr-title">Saved Shipping Addresses</h2>
          <span className="cust-addr-subtitle">
            Manage your delivery destinations for fast, 1-click checkout.
          </span>
        </div>

        <button
          type="button"
          className="cust-btn-primary"
          onClick={handleOpenAddModal}
        >
          <Plus size={16} />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Grid of Addresses */}
      <div className="cust-addr-grid">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`cust-addr-card ${addr.isDefault ? 'is-default' : ''}`}
          >
            <div>
              <div className="cust-addr-top-bar">
                <span className="cust-addr-tag-pill">{addr.tag || 'Address'}</span>
                {addr.isDefault && (
                  <span className="cust-addr-default-badge">
                    <Check size={12} /> Default Shipping
                  </span>
                )}
              </div>

              <h4 className="cust-addr-recipient">{addr.fullName}</h4>
              <div className="cust-addr-lines">
                {addr.street}
                {addr.apartment ? `, ${addr.apartment}` : ''}
                <br />
                {addr.city}, {addr.state} {addr.zip}
                <br />
                {addr.country}
              </div>

              {addr.phone && (
                <div className="cust-addr-phone">
                  <Phone size={13} />
                  <span>{addr.phone}</span>
                </div>
              )}
            </div>

            <div className="cust-addr-actions-bar">
              <div>
                {!addr.isDefault ? (
                  <button
                    type="button"
                    className="cust-addr-btn-default"
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    Set as Default
                  </button>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: '600' }}>
                    Primary Address
                  </span>
                )}
              </div>

              <div className="cust-addr-btn-actions">
                <button
                  type="button"
                  className="cust-icon-btn"
                  onClick={() => handleOpenEditModal(addr)}
                  title="Edit address"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  className="cust-icon-btn danger"
                  onClick={() => handleDeleteAddress(addr.id)}
                  title="Remove address"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ADD / EDIT ADDRESS MODAL ── */}
      {isModalOpen && (
        <div className="cust-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="cust-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <h3 className="cust-modal-title">
                <MapPin size={18} />
                <span>{formData.id ? 'Edit Shipping Address' : 'Add New Shipping Address'}</span>
              </h3>
              <button
                type="button"
                className="cust-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="cust-modal-body">
              <form onSubmit={handleSubmit}>
                <div className="cust-form-grid-2">
                  <div className="cust-form-group">
                    <label className="cust-form-label">Address Tag / Label</label>
                    <select
                      className="cust-form-select"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office / Studio</option>
                      <option value="Vacation">Vacation / Temporary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="cust-form-group">
                    <label className="cust-form-label">Recipient Full Name *</label>
                    <input
                      type="text"
                      className="cust-form-select"
                      placeholder="e.g. John Miller"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="cust-form-group">
                  <label className="cust-form-label">Street Address *</label>
                  <input
                    type="text"
                    className="cust-form-select"
                    placeholder="e.g. 456 Vogue Boulevard"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                  />
                </div>

                <div className="cust-form-group">
                  <label className="cust-form-label">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    className="cust-form-select"
                    placeholder="e.g. Apt 4B, Floor 8"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  />
                </div>

                <div className="cust-form-grid-3">
                  <div className="cust-form-group">
                    <label className="cust-form-label">City *</label>
                    <input
                      type="text"
                      className="cust-form-select"
                      placeholder="e.g. New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="cust-form-group">
                    <label className="cust-form-label">State / Prov</label>
                    <input
                      type="text"
                      className="cust-form-select"
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="cust-form-group">
                    <label className="cust-form-label">ZIP / Postal</label>
                    <input
                      type="text"
                      className="cust-form-select"
                      placeholder="10012"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    />
                  </div>
                </div>

                <div className="cust-form-grid-2">
                  <div className="cust-form-group">
                    <label className="cust-form-label">Country / Region *</label>
                    <select
                      className="cust-form-select"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="India">India</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Germany">Germany</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>

                  <div className="cust-form-group">
                    <label className="cust-form-label">Contact Phone</label>
                    <input
                      type="tel"
                      className="cust-form-select"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <label className="cust-form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  />
                  <span>Set as default shipping address for fast 1-click checkout</span>
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="cust-btn-outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="cust-btn-primary">
                    {formData.id ? 'Save Address Changes' : 'Save Shipping Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
