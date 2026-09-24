'use client';
import { useState, useEffect } from 'react';
import Image from './Image';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Shirt, Play } from 'lucide-react';
import styles from './Feed.module.css';
import { ALL_POSTS } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { feedService, productService } from '@/services';

const Feed = ({ searchQuery = '' }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('foryou');
    const [stats, setStats] = useState({});
    // Simple state to track following status by post ID for demo purposes
    const [following, setFollowing] = useState({});

    // Fetch dynamic likes & comment counts from service
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userId = user?.id || 'usr_sarah_01';
                const data = await feedService.getStats(userId);
                setStats(data || {});
            } catch (err) {
                console.error("Failed to load engagement stats:", err);
            }
        };
        fetchStats();
    }, [user?.id]);

    const toggleFollow = (id, e) => {
        e.preventDefault(); // Prevent navigation when clicking follow
        e.stopPropagation();
        setFollowing(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleToggleLike = async (postId, e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = String(postId);
        const current = stats[pid] || { likeCount: 0, isLiked: false, commentCount: 0 };
        const newIsLiked = !current.isLiked;
        const newCount = Math.max(0, (current.likeCount || 0) + (newIsLiked ? 1 : -1));

        // Optimistic UI update
        setStats(prev => ({
            ...prev,
            [pid]: {
                ...(prev[pid] || {}),
                likeCount: newCount,
                isLiked: newIsLiked
            }
        }));

        try {
            const data = await feedService.toggleLike(postId, user?.id || 'usr_sarah_01');
            if (data) {
                setStats(prev => ({
                    ...prev,
                    [pid]: {
                        ...(prev[pid] || {}),
                        likeCount: data.likeCount,
                        isLiked: data.isLiked
                    }
                }));
            }
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    const [dbProducts, setDbProducts] = useState([]);

    // Fetch dynamic products on load
    useEffect(() => {
        const fetchDbProducts = async () => {
            try {
                const data = await productService.getPublicProducts();
                if (data && data.success && Array.isArray(data.products)) {
                    setDbProducts(data.products);
                }
            } catch (err) {
                console.warn("Could not load dynamic products:", err);
            }
        };
        fetchDbProducts();
    }, []);

    const tabs = [
        { id: 'foryou', label: 'For You' },
        { id: 'following', label: 'Following' },
        { id: 'trends', label: 'Trends' },
        { id: 'men', label: 'Men' },
        { id: 'women', label: 'Women' },
    ];

    // Multi-angle photography mapping for Shop_images collections
    const SHOP_IMAGES_ANGLES = {
        '1': ['/Shop_images/1/basic2-500x750.jpeg', '/Shop_images/1/basic3-500x750.jpeg', '/Shop_images/1/basic4-500x750.jpeg'],
        '2': ['/Shop_images/2/cup1-500x750.jpeg', '/Shop_images/2/cup2-500x750.jpeg', '/Shop_images/2/cup3-500x750.jpeg'],
        '3': ['/Shop_images/3/dressblack1-1-500x750.jpeg', '/Shop_images/3/dressblack2-500x750.jpeg', '/Shop_images/3/dressblack3-500x750.jpeg'],
        '4': ['/Shop_images/4/graphic1-500x750.jpg', '/Shop_images/4/graphic2-500x750.jpg', '/Shop_images/4/graphic3-500x750.jpg'],
        '5': ['/Shop_images/5/knotted1-500x750.jpeg', '/Shop_images/5/knotted2-500x750.jpeg', '/Shop_images/5/knotted3-500x750.jpeg'],
        '6': ['/Shop_images/6/leggings1-500x750.jpeg', '/Shop_images/6/leggings2-500x750.jpeg', '/Shop_images/6/leggings3-500x750.jpeg'],
        '7': ['/Shop_images/7/nylon1-500x750.jpg', '/Shop_images/7/nylon2-500x750.jpg', '/Shop_images/7/nylon3-500x750.jpg'],
        '8': ['/Shop_images/8/overshirt1-500x750.jpg', '/Shop_images/8/overshirt2-500x750.jpg', '/Shop_images/8/overshirt3-500x750.jpg'],
        '9': ['/Shop_images/9/pocketmen1-500x750.jpeg', '/Shop_images/9/pocketmen2-500x750.jpeg', '/Shop_images/9/pocketmen3-500x750.jpeg'],
        '10': ['/Shop_images/10/ripped1-500x750.jpeg', '/Shop_images/10/ripped2-500x750.jpeg', '/Shop_images/10/ripped3-500x750.jpeg'],
        '11': ['/Shop_images/11/sleev1-500x750.jpeg', '/Shop_images/11/sleev2-500x750.jpeg', '/Shop_images/11/sleev3-500x750.jpeg'],
        '12': ['/Shop_images/12/slogan1-500x750.jpg', '/Shop_images/12/slogan2-500x750.jpg', '/Shop_images/12/slogan3-500x750.jpg'],
        '13': ['/Shop_images/13/wideleg1-500x750.jpg', '/Shop_images/13/wideleg2-500x750.jpg', '/Shop_images/13/wideleg3-500x750.jpg'],
        '14': ['/Shop_images/14/bTgDVAex_00915cef3b634c61a7a77980d8384727.jpg', '/Shop_images/14/u97PsqkV_1c92d329f65c42d4a0590ecd2690b550.jpg'],
        '15': ['/Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg', '/Shop_images/15/1000016314131-Red-RED-1000016314131_02-2100.jpg', '/Shop_images/15/1000016314131-Red-RED-1000016314131_03-2100.jpg'],
        '16': ['/Shop_images/16/2062af47-4098-4cc2-9e3f-f36ebca76b881725273460897-Chemistry-Women-Dresses-9631725273460568-5.jpg', '/Shop_images/16/9fe85a3b-34fb-4fc6-96f5-16fb2e2fcc501725273460948-Chemistry-Women-Dresses-9631725273460568-1.jpg']
    };

    // Use dynamic products from MySQL (fallback to static products if empty)
    const activeProducts = dbProducts.length > 0 ? dbProducts : ALL_POSTS.filter(p => p.type !== 'user');

    // Convert products into Feed post cards
    const dbPosts = activeProducts.map(prod => {
        const priceNum = typeof prod.price === 'number' ? prod.price : Number(prod.price) || 49.99;
        const isMen = prod.targetAudience === 'Men' || prod.brand === 'Mens Edit';
        const brandName = prod.vendorName || prod.storeName || (isMen ? 'Mens Edit' : 'Studio Label Paris');
        const brandAvatar = prod.vendorLogo || (isMen ? '/Shop_images/8/overshirt1-500x750.jpg' : '/Shop_images/1/basic2-500x750.jpeg');
        const brandHandle = prod.storeHandle || (isMen ? 'mensedit' : 'tom');
        const imgUrl = prod.imageUrl || prod.image || (prod.images && prod.images[0]) || '/Shop_images/1/basic2-500x750.jpeg';

        // Match folder for multi-angle gallery
        const folderMatch = imgUrl.match(/\/Shop_images\/(\d+)\//);
        const folderNum = folderMatch ? folderMatch[1] : null;
        let imagesList = folderNum && SHOP_IMAGES_ANGLES[folderNum] ? SHOP_IMAGES_ANGLES[folderNum] : null;

        if (!imagesList) {
            if (prod.id === 'prod-boots' || (prod.name && prod.name.includes('Boots'))) {
                imagesList = ['/Shop_images/1/basic4-500x750.jpeg', '/Shop_images/1/basic2-500x750.jpeg', '/Shop_images/1/basic3-500x750.jpeg'];
            } else if (prod.backImageUrl || prod.secondaryImage) {
                imagesList = [imgUrl, prod.backImageUrl || prod.secondaryImage, imgUrl];
            } else if (prod.images && prod.images.length > 0) {
                imagesList = prod.images;
            } else {
                imagesList = [imgUrl];
            }
        }

        const isVideo = folderNum === '2';
        const videoUrl = isVideo ? '/Shop_images/2/u1858448214_httpss.mj.run_rdUyXdL2Eo_add_a_motion_to_this_guy_ec878c06-ea1d-4d38-b9e4-fbd2a1112ae4_1.mp4' : null;

        return {
            id: prod.id,
            type: isVideo ? 'video' : 'vendor',
            author: brandName,
            avatar: brandAvatar,
            storeHandle: brandHandle,
            videoUrl: videoUrl,
            time: 'Curated Drop',
            isVerified: true,
            likes: 1200 + ((String(prod.id).charCodeAt(0) * 17) % 1500),
            comments: 32 + ((String(prod.id).charCodeAt(1) * 7) % 90),
            shares: 19,
            image: imgUrl,
            images: imagesList,
            moreCount: imagesList.length >= 3 ? 12 : (imagesList.length > 1 ? 2 : 0),
            productName: prod.name,
            price: `$${priceNum.toFixed(2)}`,
            category: prod.category || 'Tops',
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
    });

    // Interleave community creator try-on posts (Sarah Jen & Mike Ross) for social proof
    const communityPosts = ALL_POSTS.filter(p => p.type === 'user');
    const allCombinedPosts = [
        ...dbPosts.slice(0, 2),
        ...(communityPosts[0] ? [communityPosts[0]] : []),
        ...dbPosts.slice(2, 6),
        ...(communityPosts[1] ? [communityPosts[1]] : []),
        ...dbPosts.slice(6)
    ];

    // Filter Logic
    const filteredPosts = allCombinedPosts.filter(post => {
        if (activeTab === 'men') {
            const isMen = post.category?.toLowerCase() === 'men' || post.category?.toLowerCase() === 'streetwear' || post.author?.toLowerCase().includes('men');
            if (!isMen && post.type !== 'user') return false;
        } else if (activeTab === 'women') {
            const isWomen = post.category?.toLowerCase() === 'women' || post.category?.toLowerCase() === 'dresses' || post.category?.toLowerCase() === 'tops';
            if (!isWomen && post.type !== 'user') return false;
        }

        if (!searchQuery)
            return true;
        const query = searchQuery.toLowerCase();
        // Search by author
        if (post.author.toLowerCase().includes(query))
            return true;
        // Search by tried item (User posts)
        if ('triedItem' in post && post.triedItem && post.triedItem.toLowerCase().includes(query))
            return true;
        // Search by story title (Vendor posts)
        if ('storyTitle' in post && post.storyTitle && post.storyTitle.toLowerCase().includes(query))
            return true;
        // Search by product name
        if ('productName' in post && post.productName && post.productName.toLowerCase().includes(query))
            return true;
        return false;
    });

    return (<div className={styles.feedContainer}>
            <div className={`container`}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    {tabs.map(tab => (<button key={tab.id} className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`} onClick={() => setActiveTab(tab.id)}>
                            {tab.label}
                        </button>))}
                </div>

                {/* Grid */}
                {filteredPosts.length > 0 ? (<div className={styles.grid}>
                        {filteredPosts.map((post) => {
                const brandHandle = post.storeHandle || post.author.toLowerCase().replace(/[^a-z0-9]/g, '');
                const pid = String(post.id);
                const postStat = stats[pid];
                const isLiked = postStat ? postStat.isLiked : false;
                const likeCount = (postStat && postStat.likeCount !== undefined) ? postStat.likeCount : post.likes;
                const commentCount = (postStat && postStat.commentCount !== undefined) ? postStat.commentCount : post.comments;

                return (<div key={post.id} className={post.type === 'user' ? styles.userCard : styles.postCard}>
                                    {/* Header */}
                                    <div className={styles.cardHeader}>
                                        <Link to={`/brand/${brandHandle}`} className={styles.authorLink}>
                                            <div className={styles.authorAvatar}>
                                                {post.avatar ? (<Image src={post.avatar} alt={post.author} fill/>) : null}
                                            </div>
                                            <div className={styles.authorInfo}>
                                                <span className={styles.authorLabel}>{post.type === 'user' ? 'Tried by' : 'By'}</span>
                                                <span className={styles.authorName}>{post.author}</span>
                                            </div>
                                        </Link>
                                        <button className={`${styles.followBtn} ${following[post.id] ? styles.following : ''}`} onClick={(e) => toggleFollow(post.id, e)}>
                                            {following[post.id] ? 'Following' : 'Follow'}
                                        </button>
                                    </div>

                                    {/* Link for Content */}
                                    <Link to={`/product/${post.id}`} className={styles.cardContentLink}>
                                        {/* Content based on Type */}
                                        {post.type === 'user' ? (
                                            // USER CARD CONTENT
                                            <div className={styles.userContent}>
                                                <div className={styles.userImageContainer}>
                                                    {post.image ? (<Image src={post.image} alt={`Tried by ${post.author}`} fill className={styles.userImage}/>) : null}
                                                    <div className={styles.triedBadge}>
                                                        Tried via VogueSocial
                                                    </div>
                                                </div>
                                                <div className={styles.userActions}>
                                                    <div className={styles.userMetrics}>
                                                        <button 
                                                            type="button"
                                                            className={`${styles.metricBtn} ${isLiked ? styles.metricBtnActive : ''}`}
                                                            onClick={(e) => handleToggleLike(post.id, e)}
                                                        >
                                                            <Heart size={18} className={isLiked ? styles.heartLiked : ''}/> {likeCount > 1000 ? (likeCount / 1000).toFixed(1) + 'k' : likeCount}
                                                        </button>
                                                        <div className={styles.metricBtn}>
                                                            <MessageCircle size={18}/> {commentCount}
                                                        </div>
                                                    </div>
                                                    <div className={styles.trySimilarBtn}>Try Similar</div>
                                                </div>
                                            </div>
                                        ) : (
                                            // VENDOR CARD CONTENT
                                            <>
                                                <div className={`${styles.imageGrid} ${(!post.images || post.images.length <= 1) ? styles.singleImageGrid : ''}`}>
                                                    {/* Main Image (Left) */}
                                                    <div className={styles.mainImageContainer}>
                                                        {post.type === 'video' ? (
                                                            <>
                                                                <video src={post.videoUrl} className={styles.postVideo} loop muted playsInline autoPlay />
                                                                <div className={styles.playOverlay}>
                                                                    <div className={styles.playButton}>
                                                                        <Play size={24} fill="currentColor"/>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <Image 
                                                                src={(post.images && post.images[0]) || post.image || '/Shop_images/1/basic2-500x750.jpeg'} 
                                                                alt={post.productName || "Main product"} 
                                                                fill 
                                                                className={styles.postImage}
                                                            />
                                                        )}
                                                        <div className={styles.tryOnBtn}>
                                                            <Shirt size={14}/> Try On
                                                        </div>
                                                    </div>

                                                    {/* Side Images (Right) */}
                                                    {post.images && post.images.length > 1 && (
                                                        <div className={styles.sideImagesContainer}>
                                                            <div className={styles.sideImageWrapper}>
                                                                {post.images[1] ? (<Image src={post.images[1]} alt="Product Detail" fill className={styles.postImage}/>) : null}
                                                            </div>
                                                            {post.images[2] ? (
                                                                <div className={styles.sideImageWrapper}>
                                                                    <Image src={post.images[2]} alt="Product Detail" fill className={styles.postImage}/>
                                                                    {post.moreCount > 0 ? (
                                                                        <div className={styles.moreOverlay}>
                                                                            +{post.moreCount}
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                <div className={styles.cardFooter}>
                                                    <span className={styles.storyLabel} title={post.storyTitle || post.productName}>
                                                        {post.storyTitle || post.productName}
                                                    </span>
                                                    <div className={styles.actions}>
                                                        <button 
                                                            type="button"
                                                            className={`${styles.actionBtn} ${isLiked ? styles.actionBtnActive : ''}`}
                                                            onClick={(e) => handleToggleLike(post.id, e)}
                                                            title="Like"
                                                            aria-label="Like post"
                                                        >
                                                            <Heart size={18} className={isLiked ? styles.heartLiked : ''}/>
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            className={styles.actionBtn}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (navigator.share) {
                                                                    navigator.share({ title: post.storyTitle || post.productName, url: window.location.href });
                                                                } else {
                                                                    navigator.clipboard?.writeText(window.location.origin + `/product/${post.id}`);
                                                                    alert('Link copied to clipboard!');
                                                                }
                                                            }}
                                                            title="Share"
                                                            aria-label="Share post"
                                                        >
                                                            <Share2 size={18}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Link>
                                </div>);
            })}
                    </div>) : (<div className={styles.emptyFeed}>
                        <h3>No results found for "{searchQuery}"</h3>
                        <p>Try searching for collections, authors, or items.</p>
                    </div>)}
            </div>
        </div>);
};
export default Feed;
