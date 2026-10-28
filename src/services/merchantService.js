import { storageEngine } from './mock/storageEngine';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { APP_CONFIG } from '../constants/config';

const delay = (ms = 180) => new Promise(res => setTimeout(res, ms));

const DEFAULT_DOC_TEMPLATES = [
  {
    id: 'doc-incorp',
    type: 'incorporation',
    title: 'Certificate of Incorporation / Business License',
    description: 'Official proof of business registration (Kbis excerpt, Articles of Organization, or Certificate of Good Standing within 90 days).',
    required: true,
    status: 'required',
    filename: null,
    size: null,
    uploaded_at: null,
    expiry_date: null,
    notes: null
  },
  {
    id: 'doc-id',
    type: 'owner_id',
    title: 'Government-Issued Photo ID of Legal Representative',
    description: 'Valid passport or national identity card of the beneficial owner or authorized signatory.',
    required: true,
    status: 'required',
    filename: null,
    size: null,
    uploaded_at: null,
    expiry_date: null,
    notes: null
  },
  {
    id: 'doc-address',
    type: 'address_proof',
    title: 'Proof of Operating Business Address',
    description: 'Commercial premises lease, municipal business tax assessment, or utility bill issued within the last 90 days.',
    required: true,
    status: 'required',
    filename: null,
    size: null,
    uploaded_at: null,
    expiry_date: null,
    notes: null
  },
  {
    id: 'doc-tax',
    type: 'tax_cert',
    title: 'Tax Identification / VAT Registration Certificate',
    description: 'Official government certificate confirming Tax Identification Number (TIN), EIN, or VAT registration.',
    required: true,
    status: 'required',
    filename: null,
    size: null,
    uploaded_at: null,
    expiry_date: null,
    notes: null
  },
  {
    id: 'doc-bank',
    type: 'bank_statement',
    title: 'Bank Account Ownership Verification',
    description: 'Voided bank check or statement showing legal business name, IBAN/Routing number, matching payout destination.',
    required: false,
    status: 'required',
    filename: null,
    size: null,
    uploaded_at: null,
    expiry_date: null,
    notes: null
  }
];

export const merchantService = {
  /**
   * Fetch merchant verification and compliance record
   */
  async getMerchantVerification(vendorIdOrHandle) {
    await delay();
    const cleanId = (vendorIdOrHandle || '').trim().toLowerCase();
    
    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    let vendor = stores.find(s => 
      (s.vendor_id || '').toLowerCase() === cleanId ||
      (s.id || '').toLowerCase() === cleanId ||
      (s.store_handle || '').toLowerCase() === cleanId ||
      (s.vendorId || '').toLowerCase() === cleanId
    );

    if (!vendor) {
      const activeWebsite = storageEngine.getItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE, null);
      if (activeWebsite && (
        (activeWebsite.store_handle || '').toLowerCase() === cleanId ||
        (activeWebsite.vendor_id || '').toLowerCase() === cleanId
      )) {
        vendor = activeWebsite;
      }
    }

    if (!vendor && cleanId) {
      const specificKey = `${STORAGE_KEYS.STORE_PREFIX}${cleanId}`;
      vendor = storageEngine.getItem(specificKey, null);
    }

    // Default fallback skeleton if merchant is brand new
    if (!vendor) {
      vendor = {
        id: vendorIdOrHandle || 'mch_new',
        vendor_id: vendorIdOrHandle || 'mch_new',
        store_name: 'Merchant Store',
        store_handle: vendorIdOrHandle || 'merchant',
        kyb_status: 'unsubmitted',
        kyc_status: 'unsubmitted',
        legal_business_name: '',
        business_type: 'Corporation (Inc., Ltd., S.A.S.)',
        tax_id: '',
        registration_number: '',
        phone: '',
        country: 'France',
        legal_address: { street: '', city: '', postal_code: '', country: 'France' },
        return_warehouse_address: { street: '', city: '', postal_code: '', country: 'France' },
        representative: { name: '', title: '', email: '', phone: '', nationality: '', dob: '' },
        documents: DEFAULT_DOC_TEMPLATES
      };
    } else {
      // Ensure documents array has the required templates
      const existingDocs = vendor.documents || [];
      const mergedDocs = DEFAULT_DOC_TEMPLATES.map(tmpl => {
        const match = existingDocs.find(d => d.type === tmpl.type || d.id === tmpl.id);
        return match ? { ...tmpl, ...match } : tmpl;
      });
      // Include any extra documents
      existingDocs.forEach(d => {
        if (!mergedDocs.find(m => m.id === d.id || m.type === d.type)) {
          mergedDocs.push(d);
        }
      });
      vendor.documents = mergedDocs;
    }

    return {
      success: true,
      vendor
    };
  },

  /**
   * Update legal business and representative information
   */
  async saveMerchantBusinessDetails(vendorIdOrHandle, businessData) {
    await delay();
    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    const cleanId = (vendorIdOrHandle || '').trim().toLowerCase();

    let idx = stores.findIndex(s => 
      (s.vendor_id || '').toLowerCase() === cleanId ||
      (s.id || '').toLowerCase() === cleanId ||
      (s.store_handle || '').toLowerCase() === cleanId ||
      (s.vendorId || '').toLowerCase() === cleanId
    );

    let updatedStore;
    if (idx !== -1) {
      updatedStore = {
        ...stores[idx],
        legal_business_name: businessData.legal_business_name || stores[idx].legal_business_name,
        business_type: businessData.business_type || stores[idx].business_type,
        tax_id: businessData.tax_id || stores[idx].tax_id,
        registration_number: businessData.registration_number || stores[idx].registration_number,
        phone: businessData.phone || stores[idx].phone,
        country: businessData.country || stores[idx].country,
        legal_address: {
          ...(stores[idx].legal_address || {}),
          ...(businessData.legal_address || {})
        },
        return_warehouse_address: {
          ...(stores[idx].return_warehouse_address || {}),
          ...(businessData.return_warehouse_address || {})
        },
        representative: {
          ...(stores[idx].representative || {}),
          ...(businessData.representative || {})
        },
        documents: businessData.documents || stores[idx].documents || DEFAULT_DOC_TEMPLATES,
        updated_at: new Date().toISOString()
      };
      stores[idx] = updatedStore;
      storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    } else {
      updatedStore = {
        id: vendorIdOrHandle,
        vendor_id: vendorIdOrHandle,
        store_name: businessData.legal_business_name || 'Merchant Store',
        store_handle: cleanId,
        kyb_status: 'unsubmitted',
        kyc_status: 'unsubmitted',
        ...businessData,
        documents: businessData.documents || DEFAULT_DOC_TEMPLATES,
        updated_at: new Date().toISOString()
      };
      stores.unshift(updatedStore);
      storageEngine.setItem(STORAGE_KEYS.STORES, stores);
    }

    // Mirror to active website and handle specific key
    storageEngine.setItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE, updatedStore);
    if (updatedStore.store_handle) {
      storageEngine.setItem(`${STORAGE_KEYS.STORE_PREFIX}${updatedStore.store_handle.toLowerCase()}`, updatedStore);
    }

    return {
      success: true,
      vendor: updatedStore
    };
  },

  /**
   * Upload or replace a verification document
   */
  async uploadMerchantDocument(vendorIdOrHandle, { docId, docType, title, filename, size, fileDataUrl, expiryDate }) {
    await delay(250);
    const { vendor } = await this.getMerchantVerification(vendorIdOrHandle);
    if (!vendor) return { success: false, error: 'Merchant not found' };

    const docs = vendor.documents || [...DEFAULT_DOC_TEMPLATES];
    const docIdx = docs.findIndex(d => d.id === docId || d.type === docType);

    const newDocRecord = {
      id: docId || `doc_${Date.now()}`,
      type: docType || 'other',
      title: title || 'Compliance Document',
      filename: filename || 'document.pdf',
      size: size || '1.4 MB',
      file_url: fileDataUrl || null,
      uploaded_at: new Date().toISOString(),
      expiry_date: expiryDate || null,
      status: 'pending',
      notes: null
    };

    if (docIdx !== -1) {
      docs[docIdx] = {
        ...docs[docIdx],
        ...newDocRecord,
        status: 'pending' // uploaded docs go into pending review
      };
    } else {
      docs.push(newDocRecord);
    }

    vendor.documents = docs;
    return this.saveMerchantBusinessDetails(vendorIdOrHandle, { documents: docs });
  },

  /**
   * Remove an uploaded document
   */
  async removeMerchantDocument(vendorIdOrHandle, docId) {
    await delay(150);
    const { vendor } = await this.getMerchantVerification(vendorIdOrHandle);
    if (!vendor) return { success: false, error: 'Merchant not found' };

    const docs = (vendor.documents || []).map(d => {
      if (d.id === docId) {
        return {
          ...d,
          filename: null,
          size: null,
          uploaded_at: null,
          status: 'required',
          notes: null
        };
      }
      return d;
    });

    vendor.documents = docs;
    return this.saveMerchantBusinessDetails(vendorIdOrHandle, { documents: docs });
  },

  /**
   * Submit complete verification package for Super Admin Review
   */
  async submitMerchantVerification(vendorIdOrHandle, { businessData = {}, documents = [] }) {
    await delay(350);
    const { vendor } = await this.getMerchantVerification(vendorIdOrHandle);
    if (!vendor) return { success: false, error: 'Merchant not found' };

    const stores = storageEngine.getItem(STORAGE_KEYS.STORES, []);
    const cleanId = (vendorIdOrHandle || '').trim().toLowerCase();
    const idx = stores.findIndex(s => 
      (s.vendor_id || '').toLowerCase() === cleanId ||
      (s.id || '').toLowerCase() === cleanId ||
      (s.store_handle || '').toLowerCase() === cleanId
    );

    const mergedDocs = documents.length > 0 ? documents : (vendor.documents || []);

    const updatedStore = {
      ...vendor,
      ...businessData,
      documents: mergedDocs,
      kyb_status: 'under_review',
      kyc_status: 'under_review',
      verification_submitted_at: new Date().toISOString(),
      audit_trail: [
        {
          id: `aud_${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: `${businessData.representative?.name || vendor.representative?.name || vendor.store_name || 'Seller'} (Merchant)`,
          action: 'Verification Submitted',
          note: 'Legal business entity data and compliance documents submitted for KYB compliance review.'
        },
        ...(vendor.audit_trail || [])
      ],
      updated_at: new Date().toISOString()
    };

    if (idx !== -1) {
      stores[idx] = updatedStore;
    } else {
      stores.unshift(updatedStore);
    }
    storageEngine.setItem(STORAGE_KEYS.STORES, stores);

    storageEngine.setItem(STORAGE_KEYS.ACTIVE_MERCHANT_WEBSITE, updatedStore);
    if (updatedStore.store_handle) {
      storageEngine.setItem(`${STORAGE_KEYS.STORE_PREFIX}${updatedStore.store_handle.toLowerCase()}`, updatedStore);
    }

    return {
      success: true,
      vendor: updatedStore
    };
  }
};
