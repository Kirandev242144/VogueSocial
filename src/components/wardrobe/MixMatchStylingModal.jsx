'use client';
import React, { useState } from 'react';
import { X, RefreshCw, Sparkles, Shirt } from 'lucide-react';
import styles from './MixMatchStylingModal.module.css';

export default function MixMatchStylingModal({
  isOpen,
  onClose,
  items,
  onSaveOutfit,
  onTryOn
}) {
  const [stylingJacket, setStylingJacket] = useState(null);
  const [stylingTop, setStylingTop] = useState(null);
  const [stylingBottom, setStylingBottom] = useState(null);
  const [stylingShoes, setStylingShoes] = useState(null);
  const [activeSlotToSelect, setActiveSlotToSelect] = useState('top');
  const [outfitNamePrompt, setOutfitNamePrompt] = useState('');

  if (!isOpen) return null;

  const handleRandomize = () => {
    const tops = items.filter(i => i.category === 'tops');
    const bottoms = items.filter(i => i.category === 'bottoms');
    const shoes = items.filter(i => i.category === 'shoes');
    const outerwear = items.filter(i => i.category === 'outerwear');

    if (tops.length > 0) setStylingTop(tops[Math.floor(Math.random() * tops.length)]);
    if (bottoms.length > 0) setStylingBottom(bottoms[Math.floor(Math.random() * bottoms.length)]);
    if (shoes.length > 0) setStylingShoes(shoes[Math.floor(Math.random() * shoes.length)]);
    if (outerwear.length > 0) setStylingJacket(outerwear[Math.floor(Math.random() * outerwear.length)]);
  };

  const handleSave = () => {
    const selectedGarments = [stylingJacket, stylingTop, stylingBottom, stylingShoes].filter(Boolean);
    if (selectedGarments.length === 0) {
      alert('Please select at least one garment to create an outfit.');
      return;
    }
    onSaveOutfit({
      name: outfitNamePrompt.trim() || 'Custom Look',
      productIds: JSON.stringify(selectedGarments.map(g => g.id)),
      canvasLayout: JSON.stringify({
        jacketId: stylingJacket?.id || null,
        topId: stylingTop?.id || null,
        bottomId: stylingBottom?.id || null,
        shoesId: stylingShoes?.id || null
      })
    });
    setOutfitNamePrompt('');
    onClose();
  };

  const drawerItems = items.filter(item => {
    if (activeSlotToSelect === 'jacket') return item.category === 'outerwear';
    if (activeSlotToSelect === 'top') return item.category === 'tops';
    if (activeSlotToSelect === 'bottom') return item.category === 'bottoms';
    if (activeSlotToSelect === 'shoes') return item.category === 'shoes';
    return true;
  });

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={`${styles.modalDialog} ${styles.modalLargeDialog}`} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Mix &amp; Match Styling Studio</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.stylingCanvasGrid}>
          {/* Mannequin Stacks */}
          <div className={styles.mannequinStack}>
            {/* Outerwear Slot */}
            <div
              className={`${styles.mannequinSlot} ${stylingJacket ? styles.mannequinSlotFilled : ''} ${activeSlotToSelect === 'jacket' ? styles.mannequinSlotActive : ''}`}
              onClick={() => setActiveSlotToSelect('jacket')}
            >
              {stylingJacket ? (
                <>
                  <img src={stylingJacket.imageUrl} alt={stylingJacket.name} className={styles.slotImg} />
                  <button
                    className={styles.slotClearBtn}
                    onClick={(e) => { e.stopPropagation(); setStylingJacket(null); }}
                  >
                    <X size={11} />
                  </button>
                </>
              ) : (
                <div className={styles.slotPlaceholder}>
                  <Shirt size={14} />
                  <span>+ Select Outerwear</span>
                </div>
              )}
            </div>

            {/* Top Slot */}
            <div
              className={`${styles.mannequinSlot} ${stylingTop ? styles.mannequinSlotFilled : ''} ${activeSlotToSelect === 'top' ? styles.mannequinSlotActive : ''}`}
              onClick={() => setActiveSlotToSelect('top')}
            >
              {stylingTop ? (
                <>
                  <img src={stylingTop.imageUrl} alt={stylingTop.name} className={styles.slotImg} />
                  <button
                    className={styles.slotClearBtn}
                    onClick={(e) => { e.stopPropagation(); setStylingTop(null); }}
                  >
                    <X size={11} />
                  </button>
                </>
              ) : (
                <div className={styles.slotPlaceholder}>
                  <Shirt size={14} />
                  <span>+ Select Top</span>
                </div>
              )}
            </div>

            {/* Bottom Slot */}
            <div
              className={`${styles.mannequinSlot} ${stylingBottom ? styles.mannequinSlotFilled : ''} ${activeSlotToSelect === 'bottom' ? styles.mannequinSlotActive : ''}`}
              onClick={() => setActiveSlotToSelect('bottom')}
            >
              {stylingBottom ? (
                <>
                  <img src={stylingBottom.imageUrl} alt={stylingBottom.name} className={styles.slotImg} />
                  <button
                    className={styles.slotClearBtn}
                    onClick={(e) => { e.stopPropagation(); setStylingBottom(null); }}
                  >
                    <X size={11} />
                  </button>
                </>
              ) : (
                <div className={styles.slotPlaceholder}>
                  <Shirt size={14} />
                  <span>+ Select Bottom</span>
                </div>
              )}
            </div>

            {/* Shoes Slot */}
            <div
              className={`${styles.mannequinSlot} ${stylingShoes ? styles.mannequinSlotFilled : ''} ${activeSlotToSelect === 'shoes' ? styles.mannequinSlotActive : ''}`}
              onClick={() => setActiveSlotToSelect('shoes')}
            >
              {stylingShoes ? (
                <>
                  <img src={stylingShoes.imageUrl} alt={stylingShoes.name} className={styles.slotImg} />
                  <button
                    className={styles.slotClearBtn}
                    onClick={(e) => { e.stopPropagation(); setStylingShoes(null); }}
                  >
                    <X size={11} />
                  </button>
                </>
              ) : (
                <div className={styles.slotPlaceholder}>
                  <Shirt size={14} />
                  <span>+ Select Shoes</span>
                </div>
              )}
            </div>

            <div className={styles.stylingBtnRow}>
              <button
                className={styles.secondaryBtn}
                onClick={handleRandomize}
                disabled={items.length === 0}
              >
                <RefreshCw size={13} />
                <span>Randomize</span>
              </button>
              <button
                className={styles.tryOnBtn}
                onClick={() => {
                  const first = stylingTop || stylingJacket || stylingBottom || stylingShoes;
                  if (first) onTryOn(first);
                }}
                disabled={!stylingTop && !stylingJacket && !stylingBottom && !stylingShoes}
              >
                <Sparkles size={13} />
                <span>Try On</span>
              </button>
            </div>

            <div className={styles.saveOutfitInputRow}>
              <input
                type="text"
                placeholder="Name this look (e.g. Minimal Casual)"
                className={styles.formInput}
                value={outfitNamePrompt}
                onChange={e => setOutfitNamePrompt(e.target.value)}
              />
              <button className={styles.primaryBtn} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>

          {/* Piece Selector Drawer */}
          <div className={styles.selectorDrawer}>
            <h4 className={styles.selectorDrawerTitle}>
              Select {activeSlotToSelect.toUpperCase()} from Your Closet
            </h4>

            {drawerItems.length === 0 ? (
              <div className={styles.emptyDrawerNotice}>
                <p>No {activeSlotToSelect} pieces found in your wardrobe.</p>
                <p className={styles.subNotice}>Upload garments to use them in styling combinations.</p>
              </div>
            ) : (
              <div className={styles.selectorItemsGrid}>
                {drawerItems.map(garment => (
                  <div
                    key={garment.id}
                    className={styles.selectorItemCard}
                    onClick={() => {
                      if (activeSlotToSelect === 'jacket') setStylingJacket(garment);
                      if (activeSlotToSelect === 'top') setStylingTop(garment);
                      if (activeSlotToSelect === 'bottom') setStylingBottom(garment);
                      if (activeSlotToSelect === 'shoes') setStylingShoes(garment);
                    }}
                  >
                    <div className={styles.selectorItemImgBox}>
                      <img src={garment.imageUrl} alt={garment.name} className={styles.selectorItemImg} />
                    </div>
                    <span className={styles.selectorItemName}>{garment.name}</span>
                    <span className={styles.brandSubtext}>{garment.brand}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
