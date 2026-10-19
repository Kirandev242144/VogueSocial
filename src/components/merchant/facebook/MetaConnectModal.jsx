"use client";
import React, { useState } from 'react';
import styles from '@/app/merchant/facebook/MetaShopSync.module.css';
import {
  Facebook, CheckCircle2, X, Building, ShieldCheck,
  Instagram, Database, Activity, ArrowRight, Check
} from 'lucide-react';

export default function MetaConnectModal({
  isOpen,
  onClose,
  onConfirmConnect,
  reasonNotice
}) {
  const [step, setStep] = useState(1); // 1: Login, 2: Select Assets, 3: Permissions
  const [connecting, setConnecting] = useState(false);

  // Form states
  const [selectedBM, setSelectedBM] = useState('bm_9482019482');
  const [selectedPage, setSelectedPage] = useState('page_10492810482');
  const [selectedIG, setSelectedIG] = useState('@studiolabel.paris');
  const [selectedCatalog, setSelectedCatalog] = useState('1492049281048291');
  const [selectedPixel, setSelectedPixel] = useState('892019482019');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete authorization
      setConnecting(true);
      setTimeout(() => {
        setConnecting(false);
        onConfirmConnect?.({
          business_name: 'Studio Label Global Holdings',
          business_id: selectedBM,
          page_name: 'Studio Label Official',
          page_id: selectedPage,
          instagram_account: selectedIG,
          catalog_id: selectedCatalog,
          catalog_name: 'Studio Label Ready-to-Wear Catalog',
          pixel_id: selectedPixel,
          access_token: 'EAAG_mbe_tok_' + Math.random().toString(36).substring(2, 10)
        });
      }, 700);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.metaModalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderBrand}>
            <div className={styles.modalMetaBadge}>
              <Facebook size={18} />
            </div>
            <div>
              <h3 className={styles.modalTitle}>Connect Meta Facebook &amp; Instagram</h3>
              <p className={styles.modalSubtitle}>Meta Business Extension (MBE) OAuth v19.0</p>
            </div>
          </div>
          <button type="button" className={styles.modalCloseBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Reason banner if triggered from gated action */}
        {reasonNotice && (
          <div className={`${styles.metaNoticeBanner} ${styles.metaNoticeWarning}`}>
            <span>{reasonNotice}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className={styles.modalBody}>
          {/* Stepper Progress */}
          <div className={styles.oauthStepIndicator}>
            <div className={`${styles.oauthStepPill} ${step >= 1 ? styles.oauthStepPillActive : ''}`}>
              <div className={`${styles.oauthStepDot} ${step >= 1 ? styles.oauthStepDotActive : ''}`}>1</div>
              <span>Meta Account</span>
            </div>
            <div className={`${styles.oauthStepPill} ${step >= 2 ? styles.oauthStepPillActive : ''}`}>
              <div className={`${styles.oauthStepDot} ${step >= 2 ? styles.oauthStepDotActive : ''}`}>2</div>
              <span>Commerce Assets</span>
            </div>
            <div className={`${styles.oauthStepPill} ${step >= 3 ? styles.oauthStepPillActive : ''}`}>
              <div className={`${styles.oauthStepDot} ${step >= 3 ? styles.oauthStepDotActive : ''}`}>3</div>
              <span>Permissions</span>
            </div>
          </div>

          {/* STEP 1: LOGIN */}
          {step === 1 && (
            <div>
              <div className={styles.loginPromptBox}>
                <p className={styles.emptyText}>
                  Connect your Meta Business Manager to synchronize garments with Facebook Shops and enable product tagging in Instagram reels and posts.
                </p>
              </div>

              <div className={styles.loginUserCard}>
                <div className={styles.loginUserAvatar}>AW</div>
                <div>
                  <div className={styles.loginUserName}>Alexander Wright</div>
                  <div className={styles.loginUserRole}>Studio Label Brand Administrator • Verified Business</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT ASSETS */}
          {step === 2 && (
            <div className={styles.assetFormGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Meta Business Manager</label>
                <select
                  className={styles.selectInput}
                  value={selectedBM}
                  onChange={(e) => setSelectedBM(e.target.value)}
                >
                  <option value="bm_9482019482">Studio Label Global Holdings (ID: 9482019482)</option>
                  <option value="bm_4810294812">Atelier Mode Partners Europe (ID: 4810294812)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Facebook Page</label>
                <select
                  className={styles.selectInput}
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                >
                  <option value="page_10492810482">Studio Label Official (10492810482)</option>
                  <option value="page_1092847192">Studio Label NYC Flagship (1092847192)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Instagram Professional Profile</label>
                <select
                  className={styles.selectInput}
                  value={selectedIG}
                  onChange={(e) => setSelectedIG(e.target.value)}
                >
                  <option value="@studiolabel.paris">@studiolabel.paris (Verified Business)</option>
                  <option value="@studiolabel.nyc">@studiolabel.nyc</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Meta Commerce Manager Catalog</label>
                <select
                  className={styles.selectInput}
                  value={selectedCatalog}
                  onChange={(e) => setSelectedCatalog(e.target.value)}
                >
                  <option value="1492049281048291">Studio Label Ready-to-Wear (1492049281048291)</option>
                  <option value="1892048102938491">Studio Label Haute Couture &amp; Footwear (1892048102938491)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Meta Pixel / Conversions API</label>
                <select
                  className={styles.selectInput}
                  value={selectedPixel}
                  onChange={(e) => setSelectedPixel(e.target.value)}
                >
                  <option value="892019482019">Studio Label Web Pixel (892019482019)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: PERMISSIONS */}
          {step === 3 && (
            <div>
              <div className={styles.permissionsList}>
                <div className={styles.permissionItem}>
                  <Check size={16} className={styles.permissionIcon} />
                  <span><strong>catalog_management</strong>: Create, update, and remove catalog items</span>
                </div>
                <div className={styles.permissionItem}>
                  <Check size={16} className={styles.permissionIcon} />
                  <span><strong>commerce_account_read_settings</strong>: Read shop settings and currency</span>
                </div>
                <div className={styles.permissionItem}>
                  <Check size={16} className={styles.permissionIcon} />
                  <span><strong>instagram_shopping_tag_products</strong>: Enable product tagging in posts</span>
                </div>
                <div className={styles.permissionItem}>
                  <Check size={16} className={styles.permissionIcon} />
                  <span><strong>ads_management</strong>: Synchronize dynamic product ads catalog</span>
                </div>
              </div>

              <div className={styles.emptyText}>
                By clicking "Authorize &amp; Connect Meta Shop", you agree to Meta's Commerce Product Merchant Agreement and grant VogueSocial access to manage your Commerce Catalog.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          {step > 1 && (
            <button
              type="button"
              className={styles.btnMetaSecondary}
              onClick={() => setStep(step - 1)}
              disabled={connecting}
            >
              Back
            </button>
          )}

          <button
            type="button"
            className={styles.btnMetaPrimary}
            onClick={handleNext}
            disabled={connecting}
          >
            {connecting ? (
              <span>Connecting with Meta...</span>
            ) : step === 3 ? (
              <span>Authorize &amp; Connect Meta Shop</span>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
