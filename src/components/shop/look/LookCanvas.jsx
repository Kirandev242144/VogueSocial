import React, { useState } from 'react';
import { Plus, Wand2, Video, Sparkles } from 'lucide-react';
import './LookCanvas.css';

const SCENES = [
  { key: 'studio', label: 'Studio', icon: '●' },
  { key: 'street', label: 'Street', icon: '●' },
  { key: 'beach', label: 'Beach', icon: '●' },
  { key: 'custom', label: 'Custom', icon: '✨' }
];

export default function LookCanvas({
  activeImage,
  selectedScene,
  onSelectScene,
  onGenerateVideo,
  isVideoGenerating,
  isVideoReady,
  onAddItems,
  onRefineFit,
  isGeneratingTryOn,
  generatingItem,
  toastMessage,
  onDropItem
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData('application/json') || e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const item = JSON.parse(dataStr);
        if (item && onDropItem) {
          onDropItem(item);
        }
      }
    } catch (err) {
      console.warn('Could not parse dropped item:', err);
    }
  };

  return (
    <div
      className="look-visual-canvas"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="look-model-wrapper">
        <img
          src={activeImage}
          alt="Full Look Virtual Try-On Model"
          className={`look-model-img ${isGeneratingTryOn ? 'generating' : ''}`}
        />
      </div>

      {/* Drag Over Drop Zone Target Indicator */}
      {isDragOver && (
        <div className="look-drop-zone-overlay">
          <div className="look-drop-zone-box">
            <Sparkles className="look-drop-zone-icon" size={32} />
            <span className="look-drop-zone-title">Drop garment here to try on</span>
            <span className="look-drop-zone-sub">OmniTry AI will re-simulate this piece on the model</span>
          </div>
        </div>
      )}

      {/* AI Re-generation State Overlay */}
      {isGeneratingTryOn && (
        <div className="look-generating-overlay">
          <div className="look-scan-laser" />
          <div className="look-generating-card">
            <div className="look-generating-spinner">
              <Sparkles size={20} className="spinning-sparkle" />
            </div>
            <div className="look-generating-text">
              <div className="look-generating-title">Simulating 3D Drape...</div>
              <div className="look-generating-sub">
                Fitting {generatingItem?.title || 'Garment'} onto model
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="look-canvas-toast">
          <Sparkles size={14} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top-Left Floating Tools */}
      <div className="look-floating-top-tools">
        <button
          type="button"
          className="look-glass-btn"
          onClick={onAddItems}
        >
          <Plus size={14} />
          <span>Add Items</span>
        </button>

        <button
          type="button"
          className="look-glass-btn"
          onClick={onRefineFit}
        >
          <Wand2 size={14} />
          <span>Refine Fit</span>
        </button>
      </div>

      {/* Bottom Floating Background Scene Bar */}
      <div className="look-floating-bottom-bar">
        <span className="look-bg-label">BACKGROUND</span>

        <div className="look-scenes-pills">
          {SCENES.map((scene) => {
            const isActive = selectedScene === scene.key;
            return (
              <button
                key={scene.key}
                type="button"
                className={`look-scene-pill ${isActive ? 'active' : ''}`}
                onClick={() => onSelectScene(scene.key)}
              >
                <span className="look-scene-dot">{scene.icon}</span>
                <span>{scene.label}</span>
              </button>
            );
          })}
        </div>

        <div className="look-bar-divider" />

        <button
          type="button"
          className="look-gen-video-btn"
          onClick={onGenerateVideo}
          disabled={isVideoGenerating}
        >
          <Video size={14} />
          <span>
            {isVideoGenerating
              ? 'Generating Video...'
              : isVideoReady
              ? 'Video Ready (Play)'
              : 'Generate Video'}
          </span>
        </button>
      </div>
    </div>
  );
}
