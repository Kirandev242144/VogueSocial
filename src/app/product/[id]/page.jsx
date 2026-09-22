'use client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Image from '@/components/Image';
import { ArrowLeft, Heart, MessageCircle, Share2, Shirt, ShoppingBag, Star, X, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import TryOnModal from '@/components/TryOnModal';
import { ALL_POSTS } from '@/lib/data';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function ProductPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [post, setPost] = useState(null);
    const [following, setFollowing] = useState(false);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTryOnGarment, setSelectedTryOnGarment] = useState(null);
    const [selectedBuyGarment, setSelectedBuyGarment] = useState(null);

    // Dynamic MySQL Comments State
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

    // Dynamic MySQL Likes State
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    // Checkout / Escrow States
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [address, setAddress] = useState("456 Vogue St");
    const [city, setCity] = useState("New York");
    const [country, setCountry] = useState("United States");
    const [orderResult, setOrderResult] = useState(null);
    const [notFound, setNotFound] = useState(false);

    // Load Post Data
    useEffect(() => {
        if (!params.id) return;

        // 1. Check static editorial posts (matching string representation)
        const foundPost = ALL_POSTS.find(p => String(p.id) === String(params.id));
        if (foundPost) {
            setPost(foundPost);
            setSelectedImage(null);
            setSelectedTryOnGarment(null);
            setSelectedBuyGarment(null);
            setLikesCount(foundPost.likes || 0);
            setCommentCount(foundPost.comments || 0);
            setNotFound(false);
            return;
        }

        // 2. Fetch dynamic merchant product from MySQL
        fetch(`/api/products/${params.id}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.success && data.product) {
                    const prod = data.product;
                    const priceNum = typeof prod.price === 'number' ? prod.price : Number(prod.price) || 49.99;
                    const brandName = data.vendor?.storeName || (prod.targetAudience === 'Men' ? 'Mens Edit' : 'Studio Label Paris');
                    const imgUrl = prod.imageUrl || prod.image_url || '/Shop_images/1/basic2-500x750.jpeg';
                    const folderMatch = imgUrl.match(/\/Shop_images\/(\d+)\//);
                    const folderNum = folderMatch ? folderMatch[1] : null;

                    const SHOP_ANGLES = {
                        '1': ['/Shop_images/1/basic2-500x750.jpeg', '/Shop_images/1/basic3-500x750.jpeg', '/Shop_images/1/basic4-500x750.jpeg', '/Shop_images/1/basic5-500x750.jpeg'],
                        '2': ['/Shop_images/2/cup1-500x750.jpeg', '/Shop_images/2/cup2-500x750.jpeg', '/Shop_images/2/cup3-500x750.jpeg', '/Shop_images/2/cup4-500x750.jpeg'],
                        '3': ['/Shop_images/3/dressblack1-1-500x750.jpeg', '/Shop_images/3/dressblack2-500x750.jpeg', '/Shop_images/3/dressblack3-500x750.jpeg', '/Shop_images/3/dressblack4-500x750.jpeg'],
                        '4': ['/Shop_images/4/graphic1-500x750.jpg', '/Shop_images/4/graphic2-500x750.jpg', '/Shop_images/4/graphic3-500x750.jpg', '/Shop_images/4/graphic4-500x750.jpg'],
                        '5': ['/Shop_images/5/knotted1-500x750.jpeg', '/Shop_images/5/knotted2-500x750.jpeg', '/Shop_images/5/knotted3-500x750.jpeg', '/Shop_images/5/knotted4-500x750.jpeg'],
                        '6': ['/Shop_images/6/leggings1-500x750.jpeg', '/Shop_images/6/leggings2-500x750.jpeg', '/Shop_images/6/leggings3-500x750.jpeg', '/Shop_images/6/leggings4-500x750.jpeg'],
                        '7': ['/Shop_images/7/nylon1-500x750.jpg', '/Shop_images/7/nylon2-500x750.jpg', '/Shop_images/7/nylon3-500x750.jpg', '/Shop_images/7/nylon4-500x750.jpg'],
                        '8': ['/Shop_images/8/overshirt1-500x750.jpg', '/Shop_images/8/overshirt2-500x750.jpg', '/Shop_images/8/overshirt3-500x750.jpg', '/Shop_images/8/overshirt4-500x750.jpg'],
                        '9': ['/Shop_images/9/pocketmen1-500x750.jpeg', '/Shop_images/9/pocketmen2-500x750.jpeg', '/Shop_images/9/pocketmen3-500x750.jpeg', '/Shop_images/9/pocketmen4-500x750.jpeg'],
                        '10': ['/Shop_images/10/ripped1-500x750.jpeg', '/Shop_images/10/ripped2-500x750.jpeg', '/Shop_images/10/ripped3-500x750.jpeg', '/Shop_images/10/ripped4-scaled-1-500x750.jpeg'],
                        '11': ['/Shop_images/11/sleev1-500x750.jpeg', '/Shop_images/11/sleev2-500x750.jpeg', '/Shop_images/11/sleev3-500x750.jpeg', '/Shop_images/11/sleev4-500x750.jpeg'],
                        '12': ['/Shop_images/12/slogan1-500x750.jpg', '/Shop_images/12/slogan2-500x750.jpg', '/Shop_images/12/slogan3-500x750.jpg', '/Shop_images/12/slogan4-500x750.jpg'],
                        '13': ['/Shop_images/13/wideleg1-500x750.jpg', '/Shop_images/13/wideleg2-500x750.jpg', '/Shop_images/13/wideleg3-500x750.jpg', '/Shop_images/13/wideleg4-500x750.jpg'],
                        '14': ['/Shop_images/14/bTgDVAex_00915cef3b634c61a7a77980d8384727.jpg', '/Shop_images/14/u97PsqkV_1c92d329f65c42d4a0590ecd2690b550.jpg'],
                        '15': ['/Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg', '/Shop_images/15/1000016314131-Red-RED-1000016314131_02-2100.jpg', '/Shop_images/15/1000016314131-Red-RED-1000016314131_03-2100.jpg'],
                        '16': ['/Shop_images/16/2062af47-4098-4cc2-9e3f-f36ebca76b881725273460897-Chemistry-Women-Dresses-9631725273460568-5.jpg', '/Shop_images/16/9fe85a3b-34fb-4fc6-96f5-16fb2e2fcc501725273460948-Chemistry-Women-Dresses-9631725273460568-1.jpg']
                    };

                    let imagesList = folderNum && SHOP_ANGLES[folderNum] ? SHOP_ANGLES[folderNum] : null;
                    if (!imagesList) {
                        if (prod.id === 'prod-boots' || (prod.name && prod.name.includes('Boots'))) {
                            imagesList = ['/Shop_images/1/basic4-500x750.jpeg', '/Shop_images/1/basic2-500x750.jpeg', '/Shop_images/1/basic3-500x750.jpeg'];
                        } else if (backImg) {
                            imagesList = [imgUrl, backImg];
                        } else {
                            imagesList = [imgUrl];
                        }
                    }

                    const isVideo = folderNum === '2';
                    const videoUrl = isVideo ? '/Shop_images/2/u1858448214_httpss.mj.run_rdUyXdL2Eo_add_a_motion_to_this_guy_ec878c06-ea1d-4d38-b9e4-fbd2a1112ae4_1.mp4' : null;

                    const formattedPost = {
                        id: prod.id,
                        type: isVideo ? 'video' : 'vendor',
                        author: brandName,
                        avatar: data.vendor?.logoUrl || (prod.targetAudience === 'Men' ? '/Shop_images/8/overshirt1-500x750.jpg' : '/Shop_images/1/basic2-500x750.jpeg'),
                        time: 'Curated Drop',
                        videoUrl: videoUrl,
                        isVerified: true,
                        likes: 1240,
                        comments: 38,
                        shares: 15,
                        image: imgUrl,
                        images: imagesList,
                        moreCount: imagesList.length >= 3 ? 12 : 0,
                        productName: prod.name,
                        price: `$${priceNum.toFixed(2)}`,
                        category: prod.category || 'Tops',
                        description: prod.description || 'Artisan tailored piece from our latest studio collection.',
                        storyTitle: prod.name,
                        storyDesc: prod.description || 'Artisan tailored piece from our latest studio collection.',
                        productsTagged: [
                            {
                                id: prod.id,
                                name: prod.name,
                                price: `$${priceNum.toFixed(2)}`,
                                image: imgUrl
                            }
                        ],
                        taggedProducts: [
                            {
                                id: prod.id,
                                name: prod.name,
                                price: `$${priceNum.toFixed(2)}`,
                                image: imgUrl,
                                brand: brandName,
                                category: prod.category || 'Tops'
                            }
                        ]
                    };
                    setPost(formattedPost);
                    setSelectedImage(null);
                    setSelectedTryOnGarment(null);
                    setSelectedBuyGarment(null);
                    setLikesCount(formattedPost.likes);
                    setCommentCount(formattedPost.comments);
                    setNotFound(false);
                } else {
                    setNotFound(true);
                }
            })
            .catch(err => {
                console.error("Failed to load product from backend:", err);
                setNotFound(true);
            });
    }, [params.id]);

    // Fetch dynamic comments and likes from MySQL
    useEffect(() => {
        if (!params.id) return;
        const postId = String(params.id);
        const userId = user?.id || 'usr_sarah_01';

        // 1. Fetch Comments
        fetch(`/api/posts/${postId}/comments`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setComments(data);
                    setCommentCount(data.length);
                } else {
                    // Fallback initial demo comments if DB is empty
                    const initial = [
                        { id: 'cmt_init_1', userName: "Jane Doe", commentText: "Absolutely love the texture of this fabric!", userAvatar: null, createdAt: new Date().toISOString() },
                        { id: 'cmt_init_2', userName: "Alex Smith", commentText: "Is this true to size?", userAvatar: null, createdAt: new Date().toISOString() }
                    ];
                    setComments(initial);
                    setCommentCount(initial.length);
                }
            })
            .catch(err => console.error("Error fetching comments:", err));

        // 2. Fetch Likes
        fetch(`/api/posts/${postId}/likes?userId=${encodeURIComponent(userId)}`)
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) {
                    setLikesCount(data.likeCount);
                    setIsLiked(data.isLiked);
                }
            })
            .catch(err => console.error("Error fetching likes:", err));
    }, [params.id, user?.id]);

    // Add dynamic comment to MySQL
    const handleAddComment = async () => {
        if (!newComment.trim() || isCommentSubmitting || !post) return;
        setIsCommentSubmitting(true);

        const commentText = newComment.trim();
        const userName = user?.name || 'Sarah Lin';
        const userAvatar = user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&q=80';

        try {
            const res = await fetch(`/api/posts/${post.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: commentText,
                    userName,
                    userAvatar
                })
            });

            if (res.ok) {
                const savedComment = await res.json();
                setComments(prev => [savedComment, ...prev]);
                setCommentCount(prev => prev + 1);
                setNewComment("");
            } else {
                alert("Failed to submit comment. Please ensure MySQL backend is running.");
            }
        } catch (e) {
            console.error("Error posting comment:", e);
        } finally {
            setIsCommentSubmitting(false);
        }
    };

    // Toggle dynamic like in MySQL
    const handleToggleLike = async () => {
        if (!post || isLikeLoading) return;
        setIsLikeLoading(true);

        const prevLiked = isLiked;
        const prevCount = likesCount;

        // Optimistic UI update
        setIsLiked(!prevLiked);
        setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

        try {
            const res = await fetch(`/api/posts/${post.id}/likes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id || 'usr_sarah_01'
                })
            });

            if (res.ok) {
                const data = await res.json();
                setLikesCount(data.likeCount);
                setIsLiked(data.isLiked);
            } else {
                // Revert on failure
                setIsLiked(prevLiked);
                setLikesCount(prevCount);
            }
        } catch (e) {
            console.error("Error toggling like:", e);
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        // Simulate card authorization delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        try {
            const activeGarment = selectedBuyGarment || post?.taggedProducts?.[0] || post;
            const title = activeGarment?.name || activeGarment?.productName || activeGarment?.triedItem || 'Fashion Item';
            const price = activeGarment?.price || post?.price || "$75.00";
            const vendor = activeGarment?.brand || post?.author || "Vogue Partner";

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName: title,
                    priceString: price,
                    author: vendor,
                    shippingAddress: {
                        address: address,
                        city: city,
                        country: country
                    }
                })
            });
            const data = await response.json();
            if (data.success) {
                // Save to local storage mock database for immediate cross-tab sync
                const newOrder = {
                    id: data.order.id,
                    amount: data.order.amount || parseFloat(price.replace(/[^0-9.]/g, '')),
                    status: data.order.status || 'pending',
                    escrow_status: data.order.escrow_status || 'held',
                    created_at: data.order.created_at || new Date().toISOString(),
                    customer: { full_name: user?.name || 'You (Buyer)', email: user?.email || 'buyer@mail.com' },
                    vendor: {
                        store_name: vendor,
                        store_handle: vendor.toLowerCase().replace(/[^a-z0-9]/g, '')
                    }
                };
                const existing = localStorage.getItem('vogue_social_orders');
                const ordersList = existing ? JSON.parse(existing) : [];
                ordersList.push(newOrder);
                localStorage.setItem('vogue_social_orders', JSON.stringify(ordersList));
                setOrderResult(data.order);
                setIsCheckoutSuccess(true);
                setIsCheckoutOpen(false);
            } else {
                alert("Payment failed: " + (data.error || "Please try again."));
            }
        } catch (e) {
            console.error(e);
            alert("Error connecting to payment gateway.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (notFound) {
        return (
            <main className={styles.main}>
                <Navbar />
                <div className={styles.notFoundContainer}>
                    <h2 className={styles.notFoundTitle}>Product Not Found</h2>
                    <p className={styles.notFoundText}>We couldn't find the product or drop you're looking for.</p>
                    <Link to="/" className={styles.notFoundBtn}>
                        <ArrowLeft size={16} /> Back to Feed
                    </Link>
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main className={styles.main}>
                <Navbar />
                <div className={styles.loadingContainer}>Loading product...</div>
            </main>
        );
    }

    // Determine current main image and checkout item details
    const currentImage = selectedImage || post?.images?.[0] || post?.image;
    const activeGarment = selectedBuyGarment || post?.taggedProducts?.[0] || post;
    const checkoutTitle = activeGarment?.name || activeGarment?.productName || activeGarment?.triedItem || 'Garment';
    const checkoutPrice = activeGarment?.price || post?.price || "$75.00";
    const checkoutVendor = activeGarment?.brand || post?.author || "Vogue Partner";

    return (
        <main className={styles.main}>
            <Navbar />

            <TryOnModal
                isOpen={isTryOnOpen}
                onClose={() => {
                    setIsTryOnOpen(false);
                    setSelectedTryOnGarment(null);
                }}
                garmentImage={selectedTryOnGarment?.image || post?.taggedProducts?.[0]?.image || post?.images?.[0] || post?.image}
                category={selectedTryOnGarment?.category || post?.taggedProducts?.[0]?.category || post?.category || 'tops'}
                productTitle={selectedTryOnGarment?.name || post?.taggedProducts?.[0]?.name || post?.productName || post?.triedItem || 'Selected Garment'}
            />

            {/* Mock Stripe Checkout Modal */}
            {isCheckoutOpen && (
                <div className={styles.modalOverlay} onClick={() => { setIsCheckoutOpen(false); setSelectedBuyGarment(null); }}>
                    <div className={styles.modalDialog} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                <CreditCard size={18} />
                                Pay with Stripe (Escrow)
                            </h2>
                            <button className={styles.modalCloseBtn} onClick={() => { setIsCheckoutOpen(false); setSelectedBuyGarment(null); }}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.productSummaryCard}>
                                <div className={styles.productSummaryDetails}>
                                    <strong className={styles.productSummaryTitle}>{checkoutTitle}</strong>
                                    <span className={styles.productSummaryVendor}>Vendor: {checkoutVendor}</span>
                                </div>
                                <span className={styles.productSummaryPrice}>{checkoutPrice}</span>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Shipping Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    placeholder="Address"
                                    className={styles.formInput}
                                />
                                <div className={styles.formRow}>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={e => setCity(e.target.value)}
                                        placeholder="City"
                                        className={styles.formInputHalf}
                                    />
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={e => setCountry(e.target.value)}
                                        placeholder="Country"
                                        className={styles.formInputHalf}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Card Details (Mocked)</label>
                                <div className={styles.cardInputContainer}>
                                    <CreditCard size={16} color="#666" />
                                    <input
                                        type="text"
                                        disabled
                                        value="4242 •••• •••• 4242"
                                        className={styles.cardNumberInput}
                                    />
                                    <span className={styles.cardExpiry}>12/28</span>
                                    <Lock size={12} color="#999" />
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={checkoutLoading}
                                className={styles.payBtn}
                            >
                                <Lock size={14} />
                                {checkoutLoading ? 'Authorizing Payment...' : `Pay ${checkoutPrice}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mock Checkout Success / Escrow Details Modal */}
            {isCheckoutSuccess && (
                <div className={styles.modalOverlay} onClick={() => setIsCheckoutSuccess(false)}>
                    <div className={styles.modalDialog} onClick={e => e.stopPropagation()}>
                        <div className={styles.successModalBody}>
                            <div className={styles.successIconCircle}>
                                <ShieldCheck size={26} color="#16a34a" />
                            </div>
                            <h2 className={styles.successTitle}>Payment Securely Locked</h2>
                            <p className={styles.successText}>
                                Your payment of <strong>{checkoutPrice}</strong> has been successfully authorized and held in escrow by VogueSocial.
                            </p>

                            <div className={styles.escrowInfoBox}>
                                <div className={styles.escrowInfoRow}>
                                    <span className={styles.escrowLabel}>Order ID:</span>
                                    <span className={styles.escrowVal}>{orderResult?.id || 'ORD-9824'}</span>
                                </div>
                                <div className={styles.escrowInfoRow}>
                                    <span className={styles.escrowLabel}>Split Payout:</span>
                                    <span className={styles.escrowValMuted}>95% Vendor · 5% Platform</span>
                                </div>
                                <div className={styles.escrowInfoRow}>
                                    <span className={styles.escrowLabel}>Shipping Carrier:</span>
                                    <span className={styles.escrowVal}>Simulated DHL/USPS</span>
                                </div>
                                <div className={styles.escrowInfoRow}>
                                    <span className={styles.escrowLabel}>Escrow Status:</span>
                                    <span className={styles.escrowStatusTag}>HELD IN ESCROW</span>
                                </div>
                            </div>

                            <p className={styles.escrowDisclaimer}>
                                *Note: Payout will be auto-released to the vendor connect account once delivery is confirmed via carrier tracking webhook, and the 48-hour dispute window expires.*
                            </p>

                            <div className={styles.modalActions}>
                                <button
                                    onClick={() => {
                                        const localOrdersStr = localStorage.getItem('vogue_social_orders');
                                        if (localOrdersStr && orderResult) {
                                            try {
                                                const localOrders = JSON.parse(localOrdersStr);
                                                const updated = localOrders.map((o) => {
                                                    if (o.id === orderResult.id) {
                                                        return { ...o, escrow_status: 'disputed' };
                                                    }
                                                    return o;
                                                });
                                                localStorage.setItem('vogue_social_orders', JSON.stringify(updated));
                                                alert("⚠️ Simulated Claim Filed: Dispute opened. Escrow funds frozen. Go to Admin Board / disputes to resolve!");
                                                setIsCheckoutSuccess(false);
                                            } catch (e) { }
                                        }
                                    }}
                                    className={styles.disputeBtn}
                                >
                                    ⚠️ Simulate Dispute (File Claim)
                                </button>
                                <button onClick={() => setIsCheckoutSuccess(false)} className={styles.continueBtn}>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                {/* Back Link */}
                <button onClick={() => navigate(-1)} className={styles.backLink}>
                    <ArrowLeft size={18} />
                    <span>Back to Feed</span>
                </button>

                <div className={styles.contentGrid}>
                    {/* LEFT: VISUAL (Gallery) */}
                    <div className={styles.visualSection}>
                        {post.type === 'user' ? (
                            <div className={styles.mainVisual}>
                                <Image src={post.image} alt={post.author || "User Try-On"} fill className={styles.mediaContain} />
                                <div className={styles.triedViaBadge}>
                                    <span className={styles.sparkleIcon}>✨</span>
                                    <span>Tried via VogueSocial</span>
                                </div>
                                <button
                                    type="button"
                                    className={styles.tryOnVisualBtn}
                                    onClick={() => {
                                        setSelectedTryOnGarment(post.taggedProducts?.[0] || null);
                                        setIsTryOnOpen(true);
                                    }}
                                >
                                    <Shirt size={16} />
                                    <span>Virtual Try-On</span>
                                </button>
                            </div>
                        ) : (
                            <div className={styles.galleryLayout}>
                                {/* Vertical Thumbnails */}
                                <div className={styles.thumbnailsColumn}>
                                    {post.images?.map((img, i) => (img ? (
                                        <div
                                            key={i}
                                            className={`${styles.thumbnailWrapper} ${currentImage === img ? styles.thumbnailActive : styles.thumbnailInactive}`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <Image src={img} alt={`View ${i}`} fill className={styles.mediaCover} />
                                        </div>
                                    ) : null))}
                                </div>
                                {/* Main Image OR Video */}
                                <div className={styles.galleryMainImage}>
                                    {post.type === 'video' && post.videoUrl && !selectedImage ? (
                                        <video
                                            src={post.videoUrl}
                                            className={styles.videoVisual}
                                            loop
                                            muted
                                            autoPlay
                                            playsInline
                                            controls
                                        />
                                    ) : (
                                        currentImage ? (
                                            <Image src={currentImage} alt={post.productName || "Main Image"} fill className={styles.mediaContain} />
                                        ) : null
                                    )}
                                    <div className={styles.tryOnBadge} onClick={() => setIsTryOnOpen(true)}>
                                        <Shirt size={16} /> Virtual Try-On
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: DETAILS SIDEBAR */}
                    <div className={styles.detailsSidebar}>

                        {/* VENDOR & VIDEO: Product Details */}
                        {post.type === 'vendor' || post.type === 'video' ? (
                            <div className={styles.productDetails}>
                                <div className={styles.productHeader}>
                                    <h1 className={styles.productTitle}>{post.productName}</h1>
                                    <div className={styles.productRating}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} size={16} fill={star <= (post.rating || 5) ? "#000" : "none"} color="#000" />
                                        ))}
                                        <span>({commentCount} reviews)</span>

                                        {/* Dynamic Like Button */}
                                        <button
                                            type="button"
                                            className={`${styles.likeActionBtn} ${isLiked ? styles.likeActionBtnActive : ''}`}
                                            onClick={handleToggleLike}
                                            title="Like this product"
                                        >
                                            <Heart size={16} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "currentColor"} />
                                            <span>{likesCount > 1000 ? (likesCount / 1000).toFixed(1) + 'k' : likesCount}</span>
                                        </button>
                                    </div>
                                    <div className={styles.productPriceRow}>
                                        <span className={styles.productPrice}>{post.price}</span>
                                    </div>
                                </div>

                                <p className={styles.productDescription}>
                                    {post.description}
                                </p>

                                {/* Vendor Profile Small */}
                                <div className={styles.vendorMiniProfile}>
                                    <Link to={`/brand/${post.author.toLowerCase().replace(/[^a-z0-9]/g, '')}`} className={styles.vendorLinkMini}>
                                        <div className={styles.avatarMini}>
                                            <Image src={post.avatar} alt={post.author} fill className={styles.mediaCover} />
                                        </div>
                                        <div className={styles.vendorInfoMini}>
                                            <span>Designed by</span>
                                            <strong>{post.author}</strong>
                                        </div>
                                    </Link>
                                    <button
                                        className={`${styles.followBtnSmall} ${following ? styles.following : ''} ${styles.followBtnMini}`}
                                        onClick={() => setFollowing(!following)}
                                    >
                                        {following ? 'Following' : 'Follow'}
                                    </button>
                                </div>

                                {/* Actions */}
                                <div className={styles.productActions}>
                                    <div className={styles.sizeSelector}>
                                        <span>Size</span>
                                        <div className={styles.sizeOptions}>
                                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                                <button key={size} className={styles.sizeBtn}>{size}</button>
                                            ))}
                                            <button className={styles.sizeGuideBtn}>Size Guide</button>
                                        </div>
                                    </div>

                                    <div className={styles.qtyRow}>
                                        <div className={styles.qtySelector}>
                                            <button>-</button>
                                            <span>1</span>
                                            <button>+</button>
                                        </div>
                                    </div>

                                    <div className={styles.ctaButtons}>
                                        <button className={styles.addToCartBtn} onClick={() => alert("✓ Item added to cart!")}>Add to Cart</button>
                                        <button className={styles.buyNowBtn} onClick={() => setIsCheckoutOpen(true)}>Buy It Now</button>
                                    </div>
                                </div>

                                {/* Virtual Try On CTA - Integrated */}
                                <div className={styles.tryOnInline} onClick={() => setIsTryOnOpen(true)}>
                                    <Shirt size={20} />
                                    <span>Not sure about the fit? <strong>Try it on virtually</strong></span>
                                </div>

                                {/* Dynamic MySQL Comments Section */}
                                <div className={styles.commentsSection}>
                                    <h4 className={styles.commentsHeading}>
                                        <MessageCircle size={18} />
                                        Comments & Reviews ({comments.length})
                                    </h4>

                                    {/* Input Area */}
                                    <div className={styles.commentInputArea}>
                                        <input
                                            type="text"
                                            placeholder="Ask a question or share your thoughts..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                            className={styles.commentInput}
                                        />
                                        <button
                                            onClick={handleAddComment}
                                            className={styles.postCommentBtn}
                                            disabled={!newComment.trim() || isCommentSubmitting}
                                        >
                                            {isCommentSubmitting ? 'Posting...' : 'Post'}
                                        </button>
                                    </div>

                                    {/* Comments List */}
                                    <div className={styles.commentsList}>
                                        {comments.map((comment, idx) => {
                                            const name = comment.userName || comment.author || 'Fashionista';
                                            const text = comment.commentText || comment.text;
                                            const avatar = comment.userAvatar;
                                            const initials = name.slice(0, 2).toUpperCase();
                                            const dateStr = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Recent';

                                            return (
                                                <div key={comment.id || idx} className={styles.commentCard}>
                                                    {avatar ? (
                                                        <img src={avatar} alt={name} className={styles.commentAvatarImg} />
                                                    ) : (
                                                        <div className={styles.commentAvatarFallback}>{initials}</div>
                                                    )}
                                                    <div className={styles.commentBody}>
                                                        <div className={styles.commentAuthorRow}>
                                                            <span className={styles.commentAuthor}>{name}</span>
                                                            <span className={styles.commentDate}>{dateStr}</span>
                                                        </div>
                                                        <p className={styles.commentText}>{text}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // USER POSTS (Community)
                            <>
                                <div className={styles.profileCard}>
                                    <div className={styles.profileHeader}>
                                        <div className={styles.avatar}>
                                            {post.avatar ? (
                                                <Image src={post.avatar} alt={post.author} fill className={styles.mediaCover} />
                                            ) : null}
                                        </div>
                                        <div className={styles.profileInfo}>
                                            <h3 className={styles.communityAuthorTitle}>{post.author}</h3>
                                            <span className={styles.communityBadge}>
                                                ✨ Verified Try-On Creator
                                            </span>
                                        </div>
                                        <button
                                            className={`${styles.followBtn} ${following ? styles.following : ''}`}
                                            onClick={() => setFollowing(!following)}
                                        >
                                            {following ? 'Following' : 'Follow'}
                                        </button>
                                    </div>
                                    <p className={styles.description}>"{post.description}"</p>
                                    <div className={styles.stats}>
                                        <button
                                            type="button"
                                            className={styles.statItemClickable}
                                            onClick={handleToggleLike}
                                            title="Like"
                                        >
                                            <Heart
                                                size={18}
                                                className={styles.statIcon}
                                                fill={isLiked ? "#ef4444" : "none"}
                                                color={isLiked ? "#ef4444" : "currentColor"}
                                            />
                                            <span>{likesCount > 1000 ? (likesCount / 1000).toFixed(1) + 'k' : likesCount}</span>
                                        </button>
                                        <div className={styles.statItem}>
                                            <MessageCircle size={18} className={styles.statIcon} />
                                            <span>{commentCount}</span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <Share2 size={18} className={styles.statIcon} />
                                        </div>
                                    </div>
                                </div>

                                {/* GARMENT IN THIS TRY-ON SHOWCASE */}
                                {post.taggedProducts && post.taggedProducts.length > 0 && (
                                    <div className={styles.shopLookSection}>
                                        <div className={styles.shopLookHeader}>
                                            <div>
                                                <span className={styles.shopLookOverline}>FEATURED GARMENT</span>
                                                <h4 className={styles.shopLookHeading}>Garment in this Try-On</h4>
                                            </div>
                                            <span className={styles.verifiedFitBadge}>
                                                ✓ Verified Fit
                                            </span>
                                        </div>

                                        {post.taggedProducts.map((prod) => (
                                            <div key={prod.id || prod.name} className={styles.featuredProductCard}>
                                                <div className={styles.featuredProductThumbWrap}>
                                                    <Image
                                                        src={prod.image}
                                                        alt={prod.name}
                                                        fill
                                                        className={styles.mediaCover}
                                                    />
                                                    {prod.category && (
                                                        <span className={styles.itemCategoryBadge}>
                                                            {prod.category}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className={styles.featuredProductDetails}>
                                                    <div className={styles.prodBrandRow}>
                                                        <span className={styles.prodBrandName}>{prod.brand || "Vogue Collection"}</span>
                                                        <div className={styles.miniRating}>
                                                            <Star size={12} fill="#eab308" color="#eab308" />
                                                            <span>{prod.rating || 4.9}</span>
                                                        </div>
                                                    </div>

                                                    <h5 className={styles.featuredProductName}>{prod.name}</h5>

                                                    <div className={styles.featuredProductPrice}>{prod.price}</div>

                                                    <div className={styles.fitNoteRow}>
                                                        <span className={styles.fitNoteDot}></span>
                                                        <span className={styles.fitNoteText}>
                                                            {post.fitNote || 'Tried in Size M · True-to-size'}
                                                        </span>
                                                    </div>

                                                    <div className={styles.featuredProductActions}>
                                                        <button
                                                            type="button"
                                                            className={styles.tryOnFeaturedBtn}
                                                            onClick={() => {
                                                                setSelectedTryOnGarment(prod);
                                                                setIsTryOnOpen(true);
                                                            }}
                                                        >
                                                            <Shirt size={14} />
                                                            <span>Try It On You</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={styles.buyFeaturedBtn}
                                                            onClick={() => {
                                                                setSelectedBuyGarment(prod);
                                                                setIsCheckoutOpen(true);
                                                            }}
                                                        >
                                                            <ShoppingBag size={14} />
                                                            <span>Buy It Now</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Dynamic MySQL Comments Section for User Posts */}
                                <div className={styles.commentsSection}>
                                    <h4 className={styles.commentsHeading}>
                                        <MessageCircle size={18} />
                                        Comments ({comments.length})
                                    </h4>

                                    {/* Input Area */}
                                    <div className={styles.commentInputArea}>
                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                            className={styles.commentInput}
                                        />
                                        <button
                                            onClick={handleAddComment}
                                            className={styles.postCommentBtn}
                                            disabled={!newComment.trim() || isCommentSubmitting}
                                        >
                                            {isCommentSubmitting ? 'Posting...' : 'Post'}
                                        </button>
                                    </div>

                                    <div className={styles.commentsList}>
                                        {comments.map((comment, idx) => {
                                            const name = comment.userName || comment.author || 'Fashionista';
                                            const text = comment.commentText || comment.text;
                                            const avatar = comment.userAvatar;
                                            const initials = name.slice(0, 2).toUpperCase();
                                            const dateStr = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Recent';

                                            return (
                                                <div key={comment.id || idx} className={styles.commentCard}>
                                                    {avatar ? (
                                                        <img src={avatar} alt={name} className={styles.commentAvatarImg} />
                                                    ) : (
                                                        <div className={styles.commentAvatarFallback}>{initials}</div>
                                                    )}
                                                    <div className={styles.commentBody}>
                                                        <div className={styles.commentAuthorRow}>
                                                            <span className={styles.commentAuthor}>{name}</span>
                                                            <span className={styles.commentDate}>{dateStr}</span>
                                                        </div>
                                                        <p className={styles.commentText}>{text}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
