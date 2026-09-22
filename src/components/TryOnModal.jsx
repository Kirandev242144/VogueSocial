"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Download, ArrowRight } from 'lucide-react';
import Image from './Image';
import styles from './TryOnModal.module.css';
import { useAuth } from '@/context/AuthContext';
import { saveUserTryOn } from '@/lib/tryOnHistoryService';
const PRESET_MODELS = [
    // Women Presets
    {
        id: 'w1',
        name: 'Elena',
        gender: 'women',
        image: '/examples/correct-1.png',
        desc: '5′9″ · Size S'
    },
    {
        id: 'w2',
        name: 'Sophia',
        gender: 'women',
        image: '/examples/correct-3.png',
        desc: '5′8″ · Size M'
    },
    {
        id: 'w3',
        name: 'Aisha',
        gender: 'women',
        image: '/Shop_images/1/basic2-500x750.jpeg',
        desc: '5′7″ · Size L'
    },
    {
        id: 'w4',
        name: 'Maya',
        gender: 'women',
        image: '/Shop_images/3/dressblack1-1-500x750.jpeg',
        desc: '5′4″ · Size XS'
    },
    // Men Presets
    {
        id: 'm1',
        name: 'Alex',
        gender: 'men',
        image: '/examples/correct-2.png',
        desc: '6′1″ · Size M'
    },
    {
        id: 'm2',
        name: 'David',
        gender: 'men',
        image: '/Shop_images/9/pocketmen1-500x750.jpeg',
        desc: '6′0″ · Size S'
    },
    {
        id: 'm3',
        name: 'Marcus',
        gender: 'men',
        image: '/Shop_images/2/cup1-500x750.jpeg',
        desc: '5′11″ · Size L'
    },
    {
        id: 'm4',
        name: 'Leo',
        gender: 'men',
        image: '/Shop_images/10/ripped1-500x750.jpeg',
        desc: '6′3″ · Size XL'
    },
];
const TryOnModal = ({
    isOpen,
    onClose,
    garmentImage,
    product,
    category = 'tops',
    description,
    productTitle = 'Structured Garment'
}) => {
    const { user } = useAuth();
    const effectiveGarmentImage = garmentImage || product?.image_url || product?.image || product?.garmentImage;
    const effectiveTitle = (productTitle && productTitle !== 'Structured Garment') ? productTitle : (product?.name || product?.title || productTitle);
    const effectiveCategory = category || product?.category || 'tops';

    const [state, setState] = useState('UPLOAD');
    const [activeTab, setActiveTab] = useState('presets');
    const [genderFilter, setGenderFilter] = useState('women');
    const [selectedPresetId, setSelectedPresetId] = useState('w1');
    const [sourceImage, setSourceImage] = useState(PRESET_MODELS[0].image);
    const [imagePreview, setImagePreview] = useState(null);
    const [statusMessage, setStatusMessage] = useState("Processing fit simulation...");
    const [selectedCategory, setSelectedCategory] = useState(category);
    // AI Engine hidden in state (defaults to 'omnitry')
    const [selectedModel] = useState('omnitry');
    const fileInputRef = useRef(null);

    const saveResultLook = (outputImage) => {
        if (!outputImage) return;
        saveUserTryOn({
            userId: user?.id || 'usr_sarah_01',
            productId: product?.id || `prod_${Date.now()}`,
            productName: effectiveTitle,
            brand: product?.brand || 'Vogue Haute Couture',
            price: product?.price || '$890',
            garmentImage: effectiveGarmentImage || '/ui_hoodie.png',
            resultImage: outputImage,
            size: user?.measurements?.preferred_size || 'S',
            modelUsed: selectedPresetId ? PRESET_MODELS.find(m => m.id === selectedPresetId)?.name : 'Custom Fitting',
            fitScore: '98% True-Fit'
        });
    };

    // Reset state when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setState('UPLOAD');
                setActiveTab('presets');
                setGenderFilter('women');
                setSelectedPresetId('w1');
                setSourceImage(PRESET_MODELS[0].image);
                setImagePreview(null);
                setSelectedCategory(category);
            }, 300);
        }
        else {
            setSelectedCategory(category);
        }
    }, [isOpen, category]);
    const handleSelectPreset = (model) => {
        setSelectedPresetId(model.id);
        setSourceImage(model.image);
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                setSourceImage(result);
                setSelectedPresetId('');
            };
            reader.readAsDataURL(file);
        }
    };
    const startScanning = async () => {
        if (!sourceImage) {
            alert("Please select a model or upload a photo.");
            return;
        }
        setState('SCANNING');
        setStatusMessage("Analysing silhouette...");
        try {
            const response = await fetch(sourceImage);
            const blob = await response.blob();
            const file = new File([blob], "person.png", { type: "image/png" });
            const formData = new FormData();
            formData.append('person_image', file);
            if (effectiveGarmentImage) {
                try {
                    const garmentRes = await fetch(effectiveGarmentImage);
                    const garmentBlob = await garmentRes.blob();
                    formData.append('garment_image', new File([garmentBlob], "garment.png", { type: "image/png" }));
                }
                catch (e) {
                    console.error("Failed to fetch garment image", e);
                    throw new Error("Failed to load garment image");
                }
            }
            else {
                const garmentRes = await fetch("/ui_hoodie.png");
                const garmentBlob = await garmentRes.blob();
                formData.append('garment_image', new File([garmentBlob], "garment.png", { type: "image/png" }));
            }
            formData.append('category', selectedCategory);
            formData.append('model', selectedModel);
            if (description) {
                formData.append('garment_description', description);
            }
            setStatusMessage("Rendering virtual garment drape...");
            const localApiUrl = '/api/try-on';
            const apiResponse = await fetch(localApiUrl, {
                method: 'POST',
                body: formData,
            });
            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                if (errorData.error && errorData.error.includes("environment variables")) {
                    const fallbackUrl = process.env.NEXT_PUBLIC_VTON_API_URL || 'https://v7lif3hwz72hlo-8000.proxy.runpod.net/try-on';
                    setStatusMessage("Connecting to proxy renderer...");
                    const proxyResponse = await fetch(fallbackUrl, {
                        method: 'POST',
                        body: formData,
                    });
                    if (!proxyResponse.ok) {
                        const proxyError = await proxyResponse.json();
                        throw new Error(proxyError.detail || "Proxy Server Error");
                    }
                    const proxyData = await proxyResponse.json();
                    if (proxyData.image) {
                        setImagePreview(proxyData.image);
                        saveResultLook(proxyData.image);
                        setState('RESULT');
                        return;
                    }
                    else {
                        throw new Error("No image returned from proxy");
                    }
                }
                throw new Error(errorData.error || "Server Error");
            }
            const data = await apiResponse.json();
            if (data.jobId) {
                const jobId = data.jobId;
                let jobStatus = data.status || 'IN_QUEUE';
                setStatusMessage(`Simulating fit...`);
                const pollInterval = 2500;
                const maxPollAttempts = 40;
                let attempts = 0;
                while (attempts < maxPollAttempts) {
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, pollInterval));
                    const statusResponse = await fetch(`/api/try-on/status?jobId=${jobId}`);
                    if (!statusResponse.ok) {
                        const statusError = await statusResponse.json();
                        throw new Error(statusError.error || "Failed to retrieve status");
                    }
                    const statusData = await statusResponse.json();
                    jobStatus = statusData.status;
                    setStatusMessage(`Refining lighting & cloth texture...`);
                    if (jobStatus === 'COMPLETED') {
                        const output = statusData.output;
                        let outputImage = '';
                        if (typeof output === 'string') {
                            outputImage = output;
                        }
                        else if (Array.isArray(output) && output.length > 0) {
                            outputImage = output[0];
                        }
                        else if (output && typeof output === 'object') {
                            outputImage = output.image || output.img || output.url || '';
                        }
                        if (!outputImage) {
                            throw new Error("Try-on completed but produced no output image.");
                        }
                        if (outputImage.startsWith('iVBORw0KGgo')) {
                            outputImage = `data:image/png;base64,${outputImage}`;
                        }
                        setImagePreview(outputImage);
                        saveResultLook(outputImage);
                        setState('RESULT');
                        return;
                    }
                    if (jobStatus === 'FAILED' || jobStatus === 'CANCELLED') {
                        throw new Error(statusData.error || `Processing failed: ${jobStatus}`);
                    }
                }
                throw new Error("Try-On request timed out. Please try again.");
            }
            else if (data.image) {
                setImagePreview(data.image);
                saveResultLook(data.image);
                setState('RESULT');
            }
            else {
                throw new Error("No image generated.");
            }
        }
        catch (error) {
            console.error("Try-On Error", error);
            alert(`Try-On error: ${error instanceof Error ? error.message : "Unknown error"}`);
            setState('UPLOAD');
        }
    };
    const handleDownload = () => {
        if (!imagePreview)
            return;
        const link = document.createElement('a');
        link.download = `voguesocial-look.png`;
        link.href = imagePreview;
        link.click();
    };
    const filteredModels = PRESET_MODELS.filter(m => {
        if (genderFilter === 'all')
            return true;
        return m.gender === genderFilter;
    });
    if (!isOpen)
        return null;
    return (<div className={styles.overlay}>
            <div className={`${styles.modal} ${state === 'RESULT' ? styles.resultModalWide : ''}`}>
                {/* Minimal Close Button */}
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={18}/>
                </button>

                {state === 'UPLOAD' && (<div>
                        {/* Header */}
                        <div className={styles.modalHeader}>
                            <h2 className={styles.title}>VIRTUAL TRY-ON</h2>
                            <div className={styles.subTitle}>Fitting Item: <strong>{productTitle}</strong></div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className={styles.mainTabs}>
                            <button className={`${styles.tabBtn} ${activeTab === 'presets' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('presets')}>
                                Model Presets
                            </button>
                            <button className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.tabBtnActive : ''}`} onClick={() => setActiveTab('upload')}>
                                Upload Photo
                            </button>
                        </div>

                        {/* PRESETS VIEW */}
                        {activeTab === 'presets' && (<div>
                                <div className={styles.subFilterRow}>
                                    <span className={styles.sectionLabel}>Select Model</span>
                                    <div className={styles.genderLinks}>
                                        <button className={`${styles.genderLink} ${genderFilter === 'all' ? styles.genderLinkActive : ''}`} onClick={() => setGenderFilter('all')}>
                                            All
                                        </button>
                                        <button className={`${styles.genderLink} ${genderFilter === 'women' ? styles.genderLinkActive : ''}`} onClick={() => setGenderFilter('women')}>
                                            Women
                                        </button>
                                        <button className={`${styles.genderLink} ${genderFilter === 'men' ? styles.genderLinkActive : ''}`} onClick={() => setGenderFilter('men')}>
                                            Men
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.presetsGrid}>
                                    {filteredModels.map((model) => {
                    const isSelected = selectedPresetId === model.id;
                    return (<div key={model.id} className={`${styles.presetCard} ${isSelected ? styles.presetCardSelected : ''}`} onClick={() => handleSelectPreset(model)}>
                                                <div className={styles.presetImageWrap}>
                                                    <Image src={model.image} alt={model.name} fill className={styles.presetImg}/>
                                                </div>
                                                <div className={styles.presetMeta}>
                                                    <span className={styles.presetName}>{model.name}</span>
                                                    <span className={styles.presetDesc}>{model.desc}</span>
                                                </div>
                                            </div>);
                })}
                                </div>
                            </div>)}

                        {/* UPLOAD CUSTOM PHOTO VIEW */}
                        {activeTab === 'upload' && (<div>
                                <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={20} color="#111"/>
                                    <div className={styles.uploadText}>
                                        {sourceImage && !selectedPresetId ? 'Photo Selected — Click to Change' : 'Click to Upload Custom Photo'}
                                    </div>
                                    <span className={styles.uploadSubtext}>
                                        Front-facing, evenly lit photos provide optimal rendering.
                                    </span>
                                </div>
                                <input type="file" accept="image/*" ref={fileInputRef} className={styles.fileInput} onChange={handleFileChange}/>
                            </div>)}

                        {/* GARMENT CATEGORY SELECTOR */}
                        <div className={styles.categoryContainer}>
                            <span className={styles.sectionLabel}>Category</span>
                            <div className={styles.categoryButtons}>
                                {['tops', 'bottoms', 'one-pieces'].map((cat) => (<button key={cat} className={`${styles.catBtn} ${selectedCategory === cat ? styles.catBtnActive : ''}`} onClick={() => setSelectedCategory(cat)}>
                                        {cat.replace('-', ' ')}
                                    </button>))}
                            </div>
                        </div>

                        {/* PRIMARY ACTION CTA */}
                        <button className={styles.confirmBtn} onClick={startScanning}>
                            Try On
                        </button>
                    </div>)}

                {/* SCANNING STATE */}
                {state === 'SCANNING' && sourceImage && (<div className={styles.scanningContainer}>
                        <div className={styles.previewImageWrapper}>
                            <img src={sourceImage} alt="Simulating Fit" className={styles.previewImage}/>
                        </div>
                        <div className={styles.scanStatus}>
                            <div className={styles.loadingSpinner}></div>
                            <span className={styles.statusText}>{statusMessage}</span>
                        </div>
                    </div>)}

                {/* RESULT STATE */}
                {state === 'RESULT' && (<div className={styles.resultContainerWide}>
                        <h2 className={styles.resultTitle}>TRY-ON RESULT</h2>
                        
                        <div className={styles.comparisonLayout}>
                            {/* Original Model */}
                            <div className={styles.comparisonColumn}>
                                <div className={styles.columnLabel}>Original</div>
                                <div className={styles.previewImageWrapper}>
                                    {sourceImage && (<Image src={sourceImage} alt="Original" fill className={styles.resultImage}/>)}
                                </div>
                            </div>

                            {/* Arrow Indicator */}
                            <div className={styles.arrowColumn}>
                                <ArrowRight size={20} color="#111"/>
                            </div>

                            {/* Generated Result */}
                            <div className={styles.comparisonColumn}>
                                <div className={styles.columnLabel}>Virtual Look</div>
                                <div className={styles.previewImageWrapper}>
                                    {imagePreview ? (<Image src={imagePreview} alt="Result" fill className={styles.resultImage}/>) : (<div className={styles.loadingSpinner}></div>)}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={styles.resultActions}>
                            <button className={`${styles.actionBtn} ${styles.retryBtn}`} onClick={() => setState('UPLOAD')}>
                                Change Model
                            </button>
                            <button className={styles.actionBtn} onClick={handleDownload}>
                                <Download size={16}/> Download
                            </button>
                        </div>
                    </div>)}
            </div>
        </div>);
};
export default TryOnModal;
