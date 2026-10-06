'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import TryOnModal from '@/components/TryOnModal';
import InstagramCommentsDrawer from '@/components/comments/InstagramCommentsDrawer';
import {
    ProductGallery,
    VendorProductDetails,
    CommunityProductDetails,
    CheckoutModal,
    CheckoutSuccessModal
} from '@/components/product';
import { ALL_POSTS } from '@/lib/data';
import { productService, feedService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import './ProductPage.css';

const parseSafeCount = (val, fallback = 1240) => {
    const num = Number(val);
    return (Number.isFinite(num) && !isNaN(num) && num >= 0) ? num : fallback;
};

export default function ProductPage() {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Core Data States
    const [post, setPost] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [following, setFollowing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Try-On States
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [selectedTryOnGarment, setSelectedTryOnGarment] = useState(null);

    // Engagement & Social States
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

    const [likesCount, setLikesCount] = useState(1240);
    const [isLiked, setIsLiked] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [showHeartAnimation, setShowHeartAnimation] = useState(false);

    // Checkout & Escrow States
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [selectedBuyGarment, setSelectedBuyGarment] = useState(null);
    const [address, setAddress] = useState("456 Vogue St");
    const [city, setCity] = useState("New York");
    const [country, setCountry] = useState("United States");
    const [orderResult, setOrderResult] = useState(null);

    // 1. Load Product Data (Editorial Static Drop or Dynamic Catalog Item)
    useEffect(() => {
        if (!params.id) return;

        const foundPost = ALL_POSTS.find(p => String(p.id) === String(params.id));
        if (foundPost) {
            setPost(foundPost);
            setSelectedImage(null);
            setSelectedTryOnGarment(null);
            setSelectedBuyGarment(null);
            setLikesCount(parseSafeCount(foundPost.likes, 1240));
            setCommentCount(parseSafeCount(foundPost.comments, 0));
            setNotFound(false);
            return;
        }

        productService.getProductById(params.id)
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
                        } else if (prod.backImage || prod.back_image) {
                            imagesList = [imgUrl, prod.backImage || prod.back_image];
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
                            { id: prod.id, name: prod.name, price: `$${priceNum.toFixed(2)}`, image: imgUrl }
                        ],
                        taggedProducts: [
                            { id: prod.id, name: prod.name, price: `$${priceNum.toFixed(2)}`, image: imgUrl, brand: brandName, category: prod.category || 'Tops' }
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
                console.error("Failed to load product:", err);
                setNotFound(true);
            });
    }, [params.id]);

    // 2. Fetch Dynamic Comments & Likes from Feed Service
    useEffect(() => {
        if (!params.id) return;
        const postId = String(params.id);
        const userId = user?.id || 'usr_sarah_01';

        feedService.getComments(postId)
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setComments(data);
                    setCommentCount(data.length);
                } else {
                    const initial = [
                        { id: 'cmt_init_1', userName: "Jane Doe", commentText: "Absolutely love the texture of this fabric!", userAvatar: null, createdAt: new Date().toISOString() },
                        { id: 'cmt_init_2', userName: "Alex Smith", commentText: "Is this true to size?", userAvatar: null, createdAt: new Date().toISOString() }
                    ];
                    setComments(initial);
                    setCommentCount(initial.length);
                }
            })
            .catch(err => console.error("Error fetching comments:", err));

        feedService.getLikes(postId, userId)
            .then(data => {
                if (data) {
                    setLikesCount(parseSafeCount(data.likeCount, 1240));
                    setIsLiked(Boolean(data.isLiked));
                }
            })
            .catch(err => {
                console.error("Error fetching likes:", err);
                setLikesCount(1240);
            });
    }, [params.id, user?.id]);

    // Handlers
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 2500);
    };

    const handleToggleLike = async () => {
        if (!post || isLikeLoading) return;
        setIsLikeLoading(true);

        const prevLiked = isLiked;
        const currentCount = parseSafeCount(likesCount, 1240);

        setIsLiked(!prevLiked);
        setLikesCount(prevLiked ? Math.max(0, currentCount - 1) : currentCount + 1);

        try {
            const data = await feedService.toggleLike(post.id, user?.id || 'usr_sarah_01');
            if (data) {
                setLikesCount(parseSafeCount(data.likeCount, prevLiked ? currentCount - 1 : currentCount + 1));
                setIsLiked(Boolean(data.isLiked));
            }
        } catch (e) {
            console.error("Error toggling like:", e);
            setIsLiked(prevLiked);
            setLikesCount(currentCount);
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleAddComment = async (customText) => {
        const textToPost = (typeof customText === 'string' ? customText : '').trim();
        if (!textToPost || isCommentSubmitting || !post) return;
        setIsCommentSubmitting(true);

        const userName = user?.name || 'Sarah Lin';
        const currentUserId = user?.id || 'usr_sarah_01';

        try {
            const savedComment = await feedService.addComment(post.id, currentUserId, userName, textToPost);
            if (savedComment) {
                setComments(prev => [savedComment, ...prev]);
                setCommentCount(prev => prev + 1);
            }
        } catch (e) {
            console.error("Error posting comment:", e);
        } finally {
            setIsCommentSubmitting(false);
        }
    };

    const handleToggleSave = () => {
        setIsSaved(prev => {
            const next = !prev;
            showToast(next ? "✓ Saved to your wardrobe collection!" : "Removed from saved items");
            return next;
        });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.productName || post?.title || 'VogueSocial Look',
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(window.location.href);
            showToast("✓ Link copied to clipboard!");
        }
    };

    const handleImageDoubleClick = () => {
        if (!isLiked) {
            handleToggleLike();
        }
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 900);
    };

    const handleCheckout = async () => {
        setCheckoutLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1100));

        try {
            const activeGarment = selectedBuyGarment || post?.taggedProducts?.[0] || post;
            const title = activeGarment?.name || activeGarment?.productName || activeGarment?.triedItem || 'Fashion Item';
            const price = activeGarment?.price || post?.price || "$75.00";
            const vendor = activeGarment?.brand || post?.author || "Vogue Partner";

            const newOrder = {
                id: `ord_${Date.now()}`,
                product_name: title,
                amount: typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 75.00,
                status: 'paid',
                escrow_status: 'held',
                created_at: new Date().toISOString(),
                customer: { full_name: user?.name || 'Sarah Lin', email: user?.email || 'sarah@vogue.demo' },
                vendor: {
                    store_name: vendor,
                    store_handle: vendor.toLowerCase().replace(/[^a-z0-9]/g, '')
                },
                shippingAddress: { address, city, country }
            };

            const existing = localStorage.getItem('vogue_social_orders');
            const ordersList = existing ? JSON.parse(existing) : [];
            ordersList.unshift(newOrder);
            localStorage.setItem('vogue_social_orders', JSON.stringify(ordersList));

            setOrderResult(newOrder);
            setIsCheckoutSuccess(true);
            setIsCheckoutOpen(false);
        } catch (e) {
            console.error("Checkout simulation error:", e);
            alert("Error processing checkout. Please try again.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleSimulateDispute = () => {
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
            } catch (e) {}
        }
    };

    // 404 / Loading Guard Views
    if (notFound) {
        return (
            <main className="product-page-main">
                <Navbar />
                <div className="product-not-found-state">
                    <h2 className="product-not-found-title">Product Not Found</h2>
                    <p className="product-not-found-desc">We couldn't find the product or drop you're looking for.</p>
                    <Link to="/" className="product-not-found-return-btn">
                        <ArrowLeft size={16} /> Back to Feed
                    </Link>
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="product-page-main">
                <Navbar />
                <div className="product-loading-state">
                    <div className="product-loading-spinner"></div>
                    <span>Loading curated fashion drop...</span>
                </div>
            </main>
        );
    }

    // Active Display Assets
    const currentImage = selectedImage || post?.images?.[0] || post?.image;
    const activeGarment = selectedBuyGarment || post?.taggedProducts?.[0] || post;
    const checkoutTitle = activeGarment?.name || activeGarment?.productName || activeGarment?.triedItem || 'Garment';
    const checkoutPrice = activeGarment?.price || post?.price || "$75.00";
    const checkoutVendor = activeGarment?.brand || post?.author || "Vogue Partner";

    return (
        <main className="product-page-main">
            <Navbar />

            <div className="product-page-container">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="product-back-btn"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Feed</span>
                </button>

                <div className="product-page-grid">
                    {/* LEFT COLUMN: Visual Media Gallery */}
                    <ProductGallery
                        post={post}
                        currentImage={currentImage}
                        selectedImage={selectedImage}
                        onSelectImage={setSelectedImage}
                        isLiked={isLiked}
                        isSaved={isSaved}
                        likesCount={likesCount}
                        commentsCount={comments.length}
                        onToggleLike={handleToggleLike}
                        onOpenComments={() => setIsCommentsOpen(true)}
                        onToggleSave={handleToggleSave}
                        onShare={handleShare}
                        onOpenTryOn={() => {
                            setSelectedTryOnGarment(post.taggedProducts?.[0] || null);
                            setIsTryOnOpen(true);
                        }}
                        showHeartAnimation={showHeartAnimation}
                        onImageDoubleClick={handleImageDoubleClick}
                    />

                    {/* RIGHT COLUMN: Details Sidebar (Vendor OR Community) */}
                    {post.type === 'user' ? (
                        <CommunityProductDetails
                            post={post}
                            commentCount={commentCount}
                            comments={comments}
                            likesCount={likesCount}
                            isLiked={isLiked}
                            onToggleLike={handleToggleLike}
                            following={following}
                            onToggleFollow={() => setFollowing(!following)}
                            onSelectTryOnGarment={(prod) => {
                                setSelectedTryOnGarment(prod);
                                setIsTryOnOpen(true);
                            }}
                            onSelectBuyGarment={(prod) => {
                                setSelectedBuyGarment(prod);
                                setIsCheckoutOpen(true);
                            }}
                            onOpenComments={() => setIsCommentsOpen(true)}
                        />
                    ) : (
                        <VendorProductDetails
                            post={post}
                            commentCount={commentCount}
                            comments={comments}
                            likesCount={likesCount}
                            isLiked={isLiked}
                            onToggleLike={handleToggleLike}
                            following={following}
                            onToggleFollow={() => setFollowing(!following)}
                            onAddToCart={() => alert("✓ Item added to cart!")}
                            onBuyNow={() => {
                                setSelectedBuyGarment(null);
                                setIsCheckoutOpen(true);
                            }}
                            onOpenTryOn={() => setIsTryOnOpen(true)}
                            onOpenComments={() => setIsCommentsOpen(true)}
                        />
                    )}
                </div>
            </div>

            {/* Virtual Try-On Modal */}
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

            {/* Mock Stripe Escrow Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => {
                    setIsCheckoutOpen(false);
                    setSelectedBuyGarment(null);
                }}
                itemTitle={checkoutTitle}
                itemVendor={checkoutVendor}
                itemPrice={checkoutPrice}
                address={address}
                city={city}
                country={country}
                onAddressChange={setAddress}
                onCityChange={setCity}
                onCountryChange={setCountry}
                onCheckout={handleCheckout}
                isLoading={checkoutLoading}
            />

            {/* Escrow Confirmation & Dispute Guarantee Modal */}
            <CheckoutSuccessModal
                isOpen={isCheckoutSuccess}
                onClose={() => setIsCheckoutSuccess(false)}
                orderResult={orderResult}
                itemPrice={checkoutPrice}
                onSimulateDispute={handleSimulateDispute}
            />

            {/* Instagram Sliding Comments Drawer */}
            <InstagramCommentsDrawer
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                comments={comments}
                onAddComment={handleAddComment}
                isSubmitting={isCommentSubmitting}
                product={post}
                currentUser={user}
            />

            {/* Action Feedback Toast */}
            {toastMessage && (
                <div className="ig-action-toast">
                    <Check size={16} color="#4ade80" />
                    <span>{toastMessage}</span>
                </div>
            )}
        </main>
    );
}
