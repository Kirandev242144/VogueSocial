'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './AiStylistPanel.module.css';
import { CHARACTERS, INITIAL_AI_CHAT } from '@/lib/shopData';
import ViewFullLookModal from './ViewFullLookModal';
import AiStylistHeader from './AiStylistHeader';
import AiStylistSettings from './AiStylistSettings';
import AiRecommendationCard from './AiRecommendationCard';
import AiTryOnResultCard from './AiTryOnResultCard';
import AiGeneratingCard from './AiGeneratingCard';
import AiStylistInput from './AiStylistInput';

const LOCAL_STORAGE_PROFILES_KEY = 'vogue_stylist_character_profiles';

export default function AiStylistPanel({ tryOnRequest, selectedCharacter = 'you', onAddToCart }) {
  const [messages, setMessages] = useState(INITIAL_AI_CHAT);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState(false);
  const [generatingProduct, setGeneratingProduct] = useState(null);
  const [fullLookData, setFullLookData] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize Per-Character Profiles
  const [characterProfiles, setCharacterProfiles] = useState(() => {
    // Try loading from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_PROFILES_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }

    // Default profiles mapped from CHARACTERS
    const defaults = {};
    CHARACTERS.forEach(c => {
      defaults[c.id] = {
        photo: c.photo || null,
        gender: c.gender || 'woman',
        weight: c.weight || 60,
        height: c.height || 165,
        bodyType: c.bodyType || 'Hourglass',
        styleDesc: c.styleDesc || 'Modern minimalist with a touch of streetwear',
        virtualTryOns: c.virtualTryOns || [],
        tryonPhotos: c.tryonPhotos || [],
        savedOutfits: c.savedOutfits || []
      };
    });
    return defaults;
  });

  // Current active character profile
  const activeChar = CHARACTERS.find(c => c.id === selectedCharacter) || CHARACTERS[0];
  const activeProfile = characterProfiles[selectedCharacter] || {
    photo: null,
    gender: 'woman',
    weight: 60,
    height: 165,
    bodyType: 'Hourglass',
    styleDesc: 'Modern minimalist with a touch of streetwear',
    virtualTryOns: [],
    tryonPhotos: [],
    savedOutfits: []
  };

  const handleUpdateProfile = (newProfile) => {
    setCharacterProfiles(prev => {
      const updated = {
        ...prev,
        [selectedCharacter]: newProfile
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_PROFILES_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const messagesEndRef = useRef(null);
  const quickPills = ['Formal Wear', 'Casual', 'Evening', 'Work'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isSettingsOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isGeneratingTryOn, isSettingsOpen]);

  // Listen for incoming Try-On triggers from product cards
  useEffect(() => {
    if (tryOnRequest && tryOnRequest.name) {
      setIsSettingsOpen(false); // Return to chat to show try-on rendering
      handleInitiateTryOn(tryOnRequest);
    }
  }, [tryOnRequest]);

  // In-chat Virtual Try-On trigger
  const handleInitiateTryOn = (product) => {
    const userMsg = {
      id: 'msg-tryon-' + Date.now(),
      sender: 'user',
      text: `Try on ${product.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setGeneratingProduct(product);
    setIsGeneratingTryOn(true);

    setTimeout(() => {
      setIsGeneratingTryOn(false);

      const sceneImages = {
        studio: product.image || '/Shop_images/3/dressblack1-1-500x750.jpeg',
        street: product.secondaryImage || '/Shop_images/1/basic2-500x750.jpeg',
        beach: '/Shop_images/greendress.jpg',
        custom: product.image || '/Shop_images/3/dressblack3-500x750.jpeg'
      };

      const tryOnMsg = {
        id: 'msg-res-' + Date.now(),
        sender: 'ai',
        text: `Here is how the ${product.name} looks on ${activeChar.name}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tryOnResult: {
          productName: product.name,
          productId: product.id,
          price: product.priceDisplay || (typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price) || '$59.99',
          selectedScene: 'studio',
          scenes: sceneImages,
          currentImage: sceneImages.studio,
          isVideoGenerating: false,
          isVideoReady: false
        }
      };

      setMessages(prev => [...prev, tryOnMsg]);

      // Automatically save to current character's virtual try-ons list!
      const newTryonItem = {
        id: 'tryon-' + Date.now(),
        name: product.name,
        price: product.priceDisplay || '$59.99',
        image: product.image || sceneImages.studio,
        date: 'Just now'
      };

      const updatedTryOns = [newTryonItem, ...(activeProfile.virtualTryOns || []).filter(t => t.name !== product.name)];
      handleUpdateProfile({
        ...activeProfile,
        virtualTryOns: updatedTryOns
      });
    }, 1400);
  };

  // Change environment scene
  const handleSelectScene = (msgId, sceneKey) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === msgId && msg.tryOnResult) {
          const newImg = msg.tryOnResult.scenes[sceneKey] || msg.tryOnResult.currentImage;
          return {
            ...msg,
            tryOnResult: {
              ...msg.tryOnResult,
              selectedScene: sceneKey,
              currentImage: newImg
            }
          };
        }
        return msg;
      })
    );
  };

  // Generate Runway Video
  const handleGenerateVideo = (msgId) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === msgId && msg.tryOnResult) {
          return {
            ...msg,
            tryOnResult: { ...msg.tryOnResult, isVideoGenerating: true }
          };
        }
        return msg;
      })
    );

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => {
          if (msg.id === msgId && msg.tryOnResult) {
            return {
              ...msg,
              tryOnResult: {
                ...msg.tryOnResult,
                isVideoGenerating: false,
                isVideoReady: true
              }
            };
          }
          return msg;
        })
      );
    }, 1800);
  };

  // Chat message send handler
  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiText = '';
      let recommendations = [];
      const query = text.toLowerCase();

      if (query.includes('formal') || query.includes('work')) {
        aiText = "For formal and work settings, I recommend tailored Milanese silhouettes crafted from virgin wool and silk blends.";
        recommendations = [
          {
            id: 'post-1',
            title: 'Structured Wool Blazer',
            price: '$280.00',
            sizeNote: 'Size: S/M (Tailored fit)',
            image: '/Shop_images/1/basic2-500x750.jpeg',
            category: 'outerwear',
            whyItWorks: [
              'Virgin wool construction offers structure and warmth.',
              'Sharp peaked lapels elevate business or formal attire.',
              'Layers seamlessly over pleated silk trousers.'
            ]
          }
        ];
      } else if (query.includes('evening')) {
        aiText = "For evening glam, liquid Mulberry silk and minimal contouring create an effortlessly captivating aura.";
        recommendations = [
          {
            id: 'post-3',
            title: 'Midnight Silk Evening Dress',
            price: '$320.00',
            sizeNote: 'Size: S (Fluid evening drape)',
            image: '/Shop_images/3/dressblack1-1-500x750.jpeg',
            category: 'dresses',
            whyItWorks: [
              '100% Mulberry silk hugs curves comfortably.',
              'Subtle side slit adds fluid movement.',
              'Pairs elegantly with pointed toe ankle boots.'
            ]
          }
        ];
      } else if (query.includes('casual')) {
        aiText = "For effortless casual styling, high-density cotton and relaxed cuts ensure comfort without sacrificing edge.";
        recommendations = [
          {
            id: 'post-4',
            title: 'Vintage Graphic Oversized Tee',
            price: '$48.00',
            sizeNote: 'Size: M (Relaxed drape)',
            image: '/Shop_images/4/graphic1-500x750.jpg',
            category: 'tops',
            whyItWorks: [
              'Vintage washed heavyweight cotton.',
              'Dropped shoulder silhouette.',
              'Pairs cleanly with boyfriend jeans or cargo trousers.'
            ]
          }
        ];
      } else {
        aiText = "Here are signature pieces handpicked from our latest runway catalog curated for " + activeChar.name + "'s silhouette:";
        recommendations = [
          {
            id: 'post-15',
            title: 'Women Solid Shirt Dress with Belt',
            price: '$78.00',
            sizeNote: 'Size: S/M (Belted contour)',
            image: '/Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg',
            category: 'dresses',
            whyItWorks: [
              'Flattering cinched waist with matching belt.',
              'Vibrant crimson shade for day-to-night versatility.'
            ]
          }
        ];
      }

      const aiMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <section className={styles.stylistPanel}>
      {/* 1. Panel Header */}
      <AiStylistHeader
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => setIsSettingsOpen(prev => !prev)}
      />

      {/* 2. Content Area: Settings View OR Chat Messages */}
      {isSettingsOpen ? (
        <AiStylistSettings
          onBack={() => setIsSettingsOpen(false)}
          characterName={activeChar.name}
          profile={activeProfile}
          onChangeProfile={handleUpdateProfile}
          onInitiateTryOn={(item) => {
            setIsSettingsOpen(false);
            handleInitiateTryOn(item);
          }}
        />
      ) : (
        <div className={styles.chatThread}>
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className={styles.userMsgRow}>
                  <div className={styles.userBubble}>{msg.text}</div>
                  <div className={styles.userAvatarPlaceholder}>U</div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={styles.aiMsgBlock}>
                {/* Message text bubble */}
                <div className={styles.aiMessageBubble}>
                  <div className={styles.aiAvatarSmall}>
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80"
                      alt="AI"
                      className={styles.aiImgSmall}
                    />
                  </div>
                  <div className={styles.aiTextContent}>
                    <p className={styles.aiTextParagraph}>{msg.text}</p>
                  </div>
                </div>

                {/* In-Chat Try-On Result Card */}
                {msg.tryOnResult && (
                  <AiTryOnResultCard
                    msgId={msg.id}
                    tryOnResult={msg.tryOnResult}
                    onSelectScene={handleSelectScene}
                    onGenerateVideo={handleGenerateVideo}
                    onViewFullLook={setFullLookData}
                    onAddToCart={onAddToCart}
                  />
                )}

                {/* In-Chat Recommendation Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className={styles.recsContainer}>
                    {msg.recommendations.map((rec) => (
                      <AiRecommendationCard
                        key={rec.id}
                        rec={rec}
                        onInitiateTryOn={handleInitiateTryOn}
                        onAddToCart={onAddToCart}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Try-On Generating Shimmer Card */}
          {isGeneratingTryOn && (
            <AiGeneratingCard product={generatingProduct} />
          )}

          {/* General Typing Indicator */}
          {isTyping && (
            <div className={styles.typingIndicator}>
              <div className={styles.typingDot} />
              <div className={styles.typingDot} />
              <div className={styles.typingDot} />
              <span className={styles.typingText}>Stylist is curating...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* 3. Bottom Controls & Chat Input */}
      <AiStylistInput
        quickPills={quickPills}
        inputText={inputText}
        onInputChange={setInputText}
        onSendMessage={(text) => {
          setIsSettingsOpen(false); // return to chat if sending a message
          handleSendMessage(text);
        }}
      />

      {/* 4. Full Look Modal */}
      <ViewFullLookModal
        isOpen={Boolean(fullLookData)}
        onClose={() => setFullLookData(null)}
        lookData={fullLookData}
        onAddToCart={onAddToCart}
      />
    </section>
  );
}
