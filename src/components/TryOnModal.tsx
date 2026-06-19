"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Sparkles, CheckCircle, Info } from 'lucide-react';
import Image from 'next/image';
import styles from './TryOnModal.module.css';

interface TryOnModalProps {
    isOpen: boolean;
    onClose: () => void;
    garmentImage?: string;
    category?: string;
}

type ModalState = 'UPLOAD' | 'SCANNING' | 'RESULT';
type Category = 'tops' | 'bottoms' | 'one-pieces';

interface PlacedAccessory {
    id: string;
    type: 'sunglasses' | 'hat';
    name: string;
    svg: React.ReactNode;
    svgRaw: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
}

// Inline Vector SVGs for accessory templates
const ACCESSORIES_TEMPLATES = [
    {
        id: 'aviators',
        type: 'sunglasses' as const,
        name: 'Aviators',
        svg: (
            <svg viewBox="0 0 100 40" width="100%" height="100%">
                <ellipse cx="28" cy="20" rx="18" ry="14" fill="rgba(15, 23, 42, 0.85)" stroke="#fbbf24" strokeWidth="2"/>
                <ellipse cx="72" cy="20" rx="18" ry="14" fill="rgba(15, 23, 42, 0.85)" stroke="#fbbf24" strokeWidth="2"/>
                <path d="M 46 16 Q 50 14 54 16" fill="none" stroke="#fbbf24" strokeWidth="2"/>
                <path d="M 46 12 Q 50 10 54 12" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
                <path d="M 10 20 L 5 18" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
                <path d="M 90 20 L 95 18" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
            </svg>
        ),
        svgRaw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40" width="100" height="40">
            <ellipse cx="28" cy="20" rx="18" ry="14" fill="rgba(15, 23, 42, 0.85)" stroke="#fbbf24" strokeWidth="2"/>
            <ellipse cx="72" cy="20" rx="18" ry="14" fill="rgba(15, 23, 42, 0.85)" stroke="#fbbf24" strokeWidth="2"/>
            <path d="M 46 16 Q 50 14 54 16" fill="none" stroke="#fbbf24" strokeWidth="2"/>
            <path d="M 46 12 Q 50 10 54 12" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
            <path d="M 10 20 L 5 18" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
            <path d="M 90 20 L 95 18" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
        </svg>`
    },
    {
        id: 'wayfarers',
        type: 'sunglasses' as const,
        name: 'Wayfarers',
        svg: (
            <svg viewBox="0 0 100 35" width="100%" height="100%">
                <path d="M 10 6 L 46 6 L 43 28 C 30 32 15 28 13 22 Z" fill="rgba(15, 23, 42, 0.9)" stroke="#000000" strokeWidth="3" strokeLinejoin="round"/>
                <ellipse cx="28" cy="17" rx="13" ry="9" fill="rgba(30, 41, 59, 0.9)"/>
                <path d="M 90 6 L 54 6 L 57 28 C 70 32 85 28 87 22 Z" fill="rgba(15, 23, 42, 0.9)" stroke="#000000" strokeWidth="3" strokeLinejoin="round"/>
                <ellipse cx="72" cy="17" rx="13" ry="9" fill="rgba(30, 41, 59, 0.9)"/>
                <rect x="44" y="6" width="12" height="5" fill="#000000" rx="1"/>
                <circle cx="15" cy="10" r="1.5" fill="#f1f5f9"/>
                <circle cx="85" cy="10" r="1.5" fill="#f1f5f9"/>
            </svg>
        ),
        svgRaw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 35" width="100" height="35">
            <path d="M 10 6 L 46 6 L 43 28 C 30 32 15 28 13 22 Z" fill="rgba(15, 23, 42, 0.9)" stroke="#000000" strokeWidth="3" strokeLinejoin="round"/>
            <ellipse cx="28" cy="17" rx="13" ry="9" fill="rgba(30, 41, 59, 0.9)"/>
            <path d="M 90 6 L 54 6 L 57 28 C 70 32 85 28 87 22 Z" fill="rgba(15, 23, 42, 0.9)" stroke="#000000" strokeWidth="3" strokeLinejoin="round"/>
            <ellipse cx="72" cy="17" rx="13" ry="9" fill="rgba(30, 41, 59, 0.9)"/>
            <rect x="44" y="6" width="12" height="5" fill="#000000" rx="1"/>
            <circle cx="15" cy="10" r="1.5" fill="#f1f5f9"/>
            <circle cx="85" cy="10" r="1.5" fill="#f1f5f9"/>
        </svg>`
    },
    {
        id: 'sunhat',
        type: 'hat' as const,
        name: 'Sun Hat',
        svg: (
            <svg viewBox="0 0 120 50" width="100%" height="100%">
                <ellipse cx="60" cy="38" rx="55" ry="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1"/>
                <path d="M 28 35 C 26 20 40 10 60 10 C 80 10 94 20 92 35 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1"/>
                <path d="M 28 35 C 40 38 80 38 92 35 L 91 32 C 80 35 40 35 29 32 Z" fill="#ef4444"/>
                <path d="M 35 25 Q 60 22 85 25" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3,3"/>
                <path d="M 42 18 Q 60 15 78 18" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3,3"/>
            </svg>
        ),
        svgRaw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50" width="120" height="50">
            <ellipse cx="60" cy="38" rx="55" ry="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1"/>
            <path d="M 28 35 C 26 20 40 10 60 10 C 80 10 94 20 92 35 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1"/>
            <path d="M 28 35 C 40 38 80 38 92 35 L 91 32 C 80 35 40 35 29 32 Z" fill="#ef4444"/>
            <path d="M 35 25 Q 60 22 85 25" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3,3"/>
            <path d="M 42 18 Q 60 15 78 18" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3,3"/>
        </svg>`
    },
    {
        id: 'cap',
        type: 'hat' as const,
        name: 'Baseball Cap',
        svg: (
            <svg viewBox="0 0 100 60" width="100%" height="100%">
                <path d="M 20 42 C 18 15 82 15 80 42 Z" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1"/>
                <path d="M 12 42 Q 50 56 88 42 Q 50 38 12 42" fill="#172554"/>
                <ellipse cx="50" cy="18" rx="4" ry="2" fill="#1d4ed8"/>
                <path d="M 40 40 C 40 28 60 28 60 40" fill="none" stroke="#1d4ed8" strokeWidth="1"/>
            </svg>
        ),
        svgRaw: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" width="100" height="60">
            <path d="M 20 42 C 18 15 82 15 80 42 Z" fill="#1e3a8a" stroke="#1d4ed8" strokeWidth="1"/>
            <path d="M 12 42 Q 50 56 88 42 Q 50 38 12 42" fill="#172554"/>
            <ellipse cx="50" cy="18" rx="4" ry="2" fill="#1d4ed8"/>
            <path d="M 40 40 C 40 28 60 28 60 40" fill="none" stroke="#1d4ed8" strokeWidth="1"/>
        </svg>`
    }
];

const TryOnModal = ({ isOpen, onClose, garmentImage, category = 'tops' }: TryOnModalProps) => {
    const [state, setState] = useState<ModalState>('UPLOAD');
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'original' | 'generated'>('generated');
    const [statusMessage, setStatusMessage] = useState("Initializing...");
    const [selectedCategory, setSelectedCategory] = useState<Category>(category as Category);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Accessory States
    const [placedAccessories, setPlacedAccessories] = useState<PlacedAccessory[]>([]);
    const [selectedAccessoryId, setSelectedAccessoryId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sunglasses' | 'hat'>('sunglasses');
    const [isMerging, setIsMerging] = useState(false);
    const resultContainerRef = useRef<HTMLDivElement>(null);

    // Reset state when opening/closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setState('UPLOAD');
                setImagePreview(null);
                setSourceImage(null);
                setViewMode('generated');
                setSelectedCategory(category as Category);
                setPlacedAccessories([]);
                setSelectedAccessoryId(null);
            }, 300);
        } else {
            setSelectedCategory(category as Category);
        }
    }, [isOpen, category]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setSourceImage(result);
                setImagePreview(result);
                startScanning(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const startScanning = async (uploadedImage?: string) => {
        const imgToUse = uploadedImage || sourceImage;
        if (!imgToUse) {
            alert("No image to scan!");
            return;
        }

        setState('SCANNING');
        setStatusMessage("Uploading and analysing...");

        try {
            const response = await fetch(imgToUse);
            const blob = await response.blob();
            const file = new File([blob], "person.png", { type: "image/png" });

            const formData = new FormData();
            formData.append('person_image', file);

            if (garmentImage) {
                try {
                    const garmentRes = await fetch(garmentImage);
                    const garmentBlob = await garmentRes.blob();
                    formData.append('garment_image', new File([garmentBlob], "garment.png", { type: "image/png" }));
                } catch (e) {
                    console.error("Failed to fetch garment image", e);
                    throw new Error("Failed to load garment image");
                }
            } else {
                const garmentRes = await fetch("/ui_hoodie.png");
                if (!garmentRes.ok) {
                    alert("Fallback garment failed!");
                    setState('UPLOAD');
                    return;
                }
                const garmentBlob = await garmentRes.blob();
                formData.append('garment_image', new File([garmentBlob], "garment.png", { type: "image/png" }));
            }

            formData.append('category', selectedCategory);
            setStatusMessage("Submitting try-on job to RunPod serverless...");

            const localApiUrl = '/api/try-on';
            const apiResponse = await fetch(localApiUrl, {
                method: 'POST',
                body: formData,
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                
                if (errorData.error && errorData.error.includes("environment variables")) {
                    const fallbackUrl = process.env.NEXT_PUBLIC_VTON_API_URL || 'https://v7lif3hwz72hlo-8000.proxy.runpod.net/try-on';
                    console.warn(`[RunPod] Server keys missing. Falling back to direct proxy: ${fallbackUrl}`);
                    setStatusMessage("Using proxy endpoint fallback...");

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
                        setViewMode('generated');
                        setState('RESULT');
                        return;
                    } else {
                        throw new Error("No image returned from proxy");
                    }
                }

                throw new Error(errorData.error || "Server Error");
            }

            const data = await apiResponse.json();

            if (data.jobId) {
                const jobId = data.jobId;
                let jobStatus = data.status || 'IN_QUEUE';
                setStatusMessage(`Job created (ID: ${jobId}). Waiting for worker...`);

                const pollInterval = 3000;
                const maxPollAttempts = 40;
                let attempts = 0;

                while (attempts < maxPollAttempts) {
                    attempts++;
                    await new Promise(resolve => setTimeout(resolve, pollInterval));

                    const statusResponse = await fetch(`/api/try-on/status?jobId=${jobId}`);
                    if (!statusResponse.ok) {
                        const statusError = await statusResponse.json();
                        throw new Error(statusError.error || "Failed to retrieve job status");
                    }

                    const statusData = await statusResponse.json();
                    jobStatus = statusData.status;
                    setStatusMessage(`Job status: ${jobStatus.replace('_', ' ')} (Attempt ${attempts})...`);

                    if (jobStatus === 'COMPLETED') {
                        const output = statusData.output;
                        let outputImage = '';

                        if (typeof output === 'string') {
                            outputImage = output;
                        } else if (Array.isArray(output) && output.length > 0) {
                            outputImage = output[0];
                        } else if (output && typeof output === 'object') {
                            outputImage = output.image || output.img || output.url || '';
                        }

                        if (!outputImage) {
                            throw new Error("RunPod job completed but returned no output image");
                        }

                        if (outputImage.startsWith('iVBORw0KGgo')) {
                            outputImage = `data:image/png;base64,${outputImage}`;
                        }

                        setImagePreview(outputImage);
                        setViewMode('generated');
                        setState('RESULT');
                        return;
                    }

                    if (jobStatus === 'FAILED' || jobStatus === 'CANCELLED') {
                        throw new Error(statusData.error || `RunPod job failed with status: ${jobStatus}`);
                    }
                }

                throw new Error("Try-On generation timed out. Please try again.");
            } else if (data.image) {
                setImagePreview(data.image);
                setViewMode('generated');
                setState('RESULT');
            } else {
                throw new Error("No jobId or output image received from server");
            }
        } catch (error) {
            console.error("Try-On Error", error);
            alert(`Try-On failed: ${error instanceof Error ? error.message : "Unknown error"}`);
            setState('UPLOAD');
        }
    };

    // Accessory Pointer Event handlers
    const handleAccessoryPointerDown = (e: React.PointerEvent, item: PlacedAccessory) => {
        e.stopPropagation();
        setSelectedAccessoryId(item.id);
        
        const container = resultContainerRef.current;
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const startLeft = (item.x / 100) * rect.width;
        const startTop = (item.y / 100) * rect.height;
        
        const handlePointerMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            const newLeftPx = startLeft + deltaX;
            const newTopPx = startTop + deltaY;
            
            // Convert to percentages relative to container bounds
            const newX = Math.max(0, Math.min(100, (newLeftPx / rect.width) * 100));
            const newY = Math.max(0, Math.min(100, (newTopPx / rect.height) * 100));
            
            setPlacedAccessories(prev => prev.map(acc => 
                acc.id === item.id ? { ...acc, x: newX, y: newY } : acc
            ));
        };
        
        const handlePointerUp = () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };
        
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    };

    const handleTransformPointerDown = (e: React.PointerEvent, item: PlacedAccessory) => {
        e.stopPropagation();
        e.preventDefault();
        
        const handleEl = e.currentTarget as HTMLElement;
        const parentEl = handleEl.parentElement;
        if (!parentEl) return;
        
        const parentRect = parentEl.getBoundingClientRect();
        const centerX = parentRect.left + parentRect.width / 2;
        const centerY = parentRect.top + parentRect.height / 2;
        
        const startX = e.clientX;
        const startY = e.clientY;
        const dx = startX - centerX;
        const dy = startY - centerY;
        const startDist = Math.sqrt(dx*dx + dy*dy);
        const startAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        const startScale = item.scale;
        const startRotation = item.rotation;
        
        const handlePointerMove = (moveEvent: PointerEvent) => {
            const curX = moveEvent.clientX - centerX;
            const curY = moveEvent.clientY - centerY;
            
            const curDist = Math.sqrt(curX*curX + curY*curY);
            const curAngle = Math.atan2(curY, curX) * (180 / Math.PI);
            
            const scaleMultiplier = curDist / startDist;
            const newScale = Math.max(0.3, Math.min(3.0, startScale * scaleMultiplier));
            const newRotation = startRotation + (curAngle - startAngle);
            
            setPlacedAccessories(prev => prev.map(acc => 
                acc.id === item.id ? { ...acc, scale: newScale, rotation: newRotation } : acc
            ));
        };
        
        const handlePointerUp = () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };
        
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    };

    // Canvas merging function
    const handleMergeAndSave = async () => {
        if (placedAccessories.length === 0) {
            onClose();
            return;
        }
        
        setIsMerging(true);
        setStatusMessage("Merging accessories into photo...");
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not create 2D canvas context");
            
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.src = imagePreview || '';
            
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error("Failed to load background try-on image"));
            });
            
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            // Draw background image
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Draw each placed accessory
            for (const acc of placedAccessories) {
                const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(acc.svgRaw)}`;
                const svgImg = new window.Image();
                
                await new Promise((resolve, reject) => {
                    svgImg.onload = resolve;
                    svgImg.onerror = () => reject(new Error("Failed to load SVG accessory image"));
                    svgImg.src = svgDataUrl;
                });
                
                // Map percentages to actual canvas dimensions
                const pxX = (acc.x / 100) * canvas.width;
                const pxY = (acc.y / 100) * canvas.height;
                
                const baseWidth = canvas.width * 0.22; // accessory is roughly 22% of image width by default
                const aspectRatio = acc.type === 'sunglasses' ? 40/100 : 50/120;
                const accWidth = baseWidth * acc.scale;
                const accHeight = accWidth * aspectRatio;
                
                ctx.save();
                ctx.translate(pxX, pxY);
                ctx.rotate((acc.rotation * Math.PI) / 180);
                ctx.drawImage(svgImg, -accWidth / 2, -accHeight / 2, accWidth, accHeight);
                ctx.restore();
            }
            
            const mergedBase64 = canvas.toDataURL('image/png');
            setImagePreview(mergedBase64);
            
            // Allow state propagation to show up inside storefront
            const downloadLink = document.createElement('a');
            downloadLink.href = mergedBase64;
            downloadLink.download = 'voguesocial-tryon-styled.png';
            
            onClose();
        } catch (err) {
            console.error("Failed to merge canvas layers:", err);
            alert("Failed to save accessories onto image.");
        } finally {
            setIsMerging(false);
        }
    };

    const handleDownload = () => {
        if (!imagePreview) return;
        const link = document.createElement('a');
        link.download = 'voguesocial-tryon-look.png';
        link.href = imagePreview;
        link.click();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} ${state === 'RESULT' ? styles.resultModalWide : ''}`}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>

                {state === 'UPLOAD' && (
                    <div className={styles.uploadContainer}>
                        <h2 className={styles.title}>Virtual Tryon</h2>

                        {/* Training Image Section */}
                        <div className={styles.sectionHeader}>Upload Image</div>
                        <div
                            className={styles.uploadArea}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <button className={styles.uploadBtnSecondary}>
                                <Upload size={16} /> Upload image
                            </button>
                            <p className={styles.uploadText}>
                                Drag and drop file here or upload here<br />
                                <span className={styles.uploadSubtext}>Size should not exceed 20MB, and GIF format is not supported</span>
                            </p>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className={styles.fileInput}
                            onChange={handleFileChange}
                        />

                        {/* Category Selector */}
                        <div className={styles.categorySelectorContainer} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                            <label className={styles.sectionHeader} style={{ display: 'block', marginBottom: '0.5rem' }}>Garment Category</label>
                            <div className={styles.categoryButtons} style={{ display: 'flex', gap: '0.5rem' }}>
                                {(['tops', 'bottoms', 'one-pieces'] as Category[]).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            border: '1px solid #ccc',
                                            background: selectedCategory === cat ? '#000' : '#fff',
                                            color: selectedCategory === cat ? '#fff' : '#000',
                                            cursor: 'pointer',
                                            textTransform: 'capitalize',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {cat.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Examples Section */}
                        <div className={styles.examplesHeaderRow}>
                            <div className={styles.sectionHeader} style={{ marginBottom: 0 }}>Image Examples</div>
                            <span className={styles.purpleLink}>Following these requirements for optimal results</span>
                        </div>

                        <div className={styles.newExamplesGrid}>
                            {/* Correct Examples Block */}
                            <div className={styles.exampleBlock}>
                                <div className={styles.thumbsRow}>
                                    <div className={styles.thumbWrapper}>
                                        <Image src="/examples/correct-1.png" alt="Correct 1" fill className={styles.thumbImg} />
                                        <div className={styles.checkBadge}>✓</div>
                                    </div>
                                    <div className={styles.thumbWrapper}>
                                        <Image src="/examples/correct-2.png" alt="Correct 2" fill className={styles.thumbImg} />
                                        <div className={styles.checkBadge}>✓</div>
                                    </div>
                                    <div className={styles.thumbWrapper}>
                                        <Image src="/examples/correct-3.png" alt="Correct 3" fill className={styles.thumbImg} />
                                        <div className={styles.checkBadge}>✓</div>
                                    </div>
                                </div>
                                <div className={styles.exampleCaption}>
                                    <strong>Correct examples</strong>
                                    <p>Front-facing, evenly lit, full-body or half-body shot</p>
                                </div>
                            </div>

                            {/* Incorrect Examples Block */}
                            <div className={styles.exampleBlock}>
                                <div className={styles.thumbsRow}>
                                    <div className={styles.thumbWrapper}>
                                        <Image src="/examples/incorrect-1.png" alt="Incorrect 1" fill className={styles.thumbImg} />
                                        <div className={styles.crossBadge}>✕</div>
                                    </div>
                                    <div className={styles.thumbWrapper}>
                                        <Image src="/examples/incorrect-2.png" alt="Incorrect 2" fill className={styles.thumbImg} />
                                        <div className={styles.crossBadge}>✕</div>
                                    </div>
                                    <div className={styles.thumbWrapper}>
                                        <Image src="/examples/incorrect-3.png" alt="Incorrect 3" fill className={styles.thumbImg} />
                                        <div className={styles.crossBadge}>✕</div>
                                    </div>
                                </div>
                                <div className={styles.exampleCaption}>
                                    <strong>Incorrect examples</strong>
                                    <p>Close-up shots, incomplete face display, clothing covering the face, overly complex background</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Terms */}
                        <button className={styles.confirmBtn} onClick={() => fileInputRef.current?.click()}>
                            Confirm
                        </button>
                    </div>
                )}

                {state === 'SCANNING' && sourceImage && (
                    <div className={styles.scanningContainer}>
                        <div className={styles.previewImageWrapper}>
                            <img src={sourceImage} alt="Scanning" className={styles.previewImage} />
                            <div className={styles.scanLine}></div>
                        </div>
                        <div className={styles.scanStatus}>
                            <div className={styles.loadingSpinner}></div>
                            <span className={styles.statusText}>{statusMessage}</span>
                        </div>
                    </div>
                )}

                {state === 'RESULT' && (
                    <div className={styles.resultLayout}>
                        {/* Left Column: Try-On Image & Interactive Layers */}
                        <div className={styles.previewColumn}>
                            <div className={styles.toggleContainer}>
                                <button
                                    className={`${styles.toggleBtn} ${viewMode === 'original' ? styles.active : ''}`}
                                    onClick={() => setViewMode('original')}
                                >
                                    Original
                                </button>
                                <button
                                    className={`${styles.toggleBtn} ${viewMode === 'generated' ? styles.active : ''}`}
                                    onClick={() => setViewMode('generated')}
                                >
                                    Generated
                                </button>
                            </div>

                            <div 
                                className={styles.previewImageWrapper} 
                                ref={resultContainerRef}
                                onClick={() => setSelectedAccessoryId(null)} // click off to deselect
                            >
                                {viewMode === 'original' && sourceImage ? (
                                    <Image src={sourceImage} alt="Original" fill style={{ objectFit: 'cover' }} />
                                ) : imagePreview ? (
                                    <>
                                        <Image src={imagePreview} alt="Generated Result" fill style={{ objectFit: 'cover' }} />
                                        
                                        {/* Overlay placed accessories */}
                                        {viewMode === 'generated' && placedAccessories.map((item) => {
                                            const isSelected = selectedAccessoryId === item.id;
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`${styles.placedAccessory} ${isSelected ? styles.selectedAccessory : ''}`}
                                                    style={{
                                                        left: `${item.x}%`,
                                                        top: `${item.y}%`,
                                                        transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
                                                        width: item.type === 'sunglasses' ? '120px' : '150px',
                                                        height: item.type === 'sunglasses' ? '48px' : '65px',
                                                    }}
                                                    onPointerDown={(e) => handleAccessoryPointerDown(e, item)}
                                                >
                                                    {item.svg}

                                                    {isSelected && (
                                                        <>
                                                            <button
                                                                className={styles.deleteHandle}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setPlacedAccessories(prev => prev.filter(acc => acc.id !== item.id));
                                                                    setSelectedAccessoryId(null);
                                                                }}
                                                                onPointerDown={(e) => e.stopPropagation()}
                                                            >
                                                                ✕
                                                            </button>
                                                            <div
                                                                className={styles.transformHandle}
                                                                onPointerDown={(e) => handleTransformPointerDown(e, item)}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </>
                                ) : (
                                    <div className={styles.loadingSpinner}></div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Accessory Drawer & Tabs */}
                        <div className={styles.accessoriesColumn}>
                            <h3 className={styles.columnTitle}>Style Accessories</h3>
                            <p className={styles.columnSubtitle}>Add accessories to personalize your virtual outfit look</p>
                            
                            <div className={styles.accessoryTabs}>
                                <button
                                    className={`${styles.accessoryTab} ${activeTab === 'sunglasses' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('sunglasses')}
                                >
                                    Sunglasses
                                </button>
                                <button
                                    className={`${styles.accessoryTab} ${activeTab === 'hat' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('hat')}
                                >
                                    Hats & Caps
                                </button>
                            </div>

                            <div className={styles.accessoryGrid}>
                                {ACCESSORIES_TEMPLATES.filter(acc => acc.type === activeTab).map((acc) => (
                                    <div
                                        key={acc.id}
                                        className={styles.accessoryCard}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newId = `placed_${Date.now()}`;
                                            const newAccessory = {
                                                id: newId,
                                                type: acc.type,
                                                name: acc.name,
                                                svg: acc.svg,
                                                svgRaw: acc.svgRaw,
                                                x: 50,
                                                y: acc.type === 'sunglasses' ? 38 : 20,
                                                scale: 1.0,
                                                rotation: 0
                                            };
                                            setPlacedAccessories(prev => [...prev, newAccessory]);
                                            setSelectedAccessoryId(newId);
                                        }}
                                    >
                                        <div className={styles.cardVisual}>
                                            {acc.svg}
                                        </div>
                                        <div className={styles.cardName}>{acc.name}</div>
                                    </div>
                                ))}
                            </div>

                            {placedAccessories.length > 0 && (
                                <button
                                    className={styles.clearAllBtn}
                                    onClick={() => {
                                        setPlacedAccessories([]);
                                        setSelectedAccessoryId(null);
                                    }}
                                >
                                    Clear Placed Accessories
                                </button>
                            )}

                            {/* Actions Footer */}
                            <div className={styles.resultActions}>
                                <button className={`${styles.actionBtn} ${styles.retryBtn}`} onClick={() => setState('UPLOAD')}>
                                    Try Another
                                </button>
                                <button className={`${styles.actionBtn} ${styles.retryBtn}`} onClick={handleDownload} title="Download look to your device">
                                    Download
                                </button>
                                <button className={styles.actionBtn} onClick={handleMergeAndSave} disabled={isMerging}>
                                    {isMerging ? 'Saving...' : 'Save Look'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TryOnModal;

