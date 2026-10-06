import { useState, useEffect, useMemo } from 'react';
import { ALL_POSTS } from '@/lib/data';
import { useAuth } from '@/context/AuthContext';
import { feedService, productService } from '@/services';

// Curated angle mappings for studio lookbook photography
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

export const FEED_TABS = [
  { id: 'foryou', label: 'For You' },
  { id: 'following', label: 'Following' },
  { id: 'trends', label: 'Trends' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' }
];

export function useFeedPosts(searchQuery = '') {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('foryou');
  const [stats, setStats] = useState({});
  const [dbProducts, setDbProducts] = useState([]);

  // Persist followed brand handles across tabs & reloads
  const [following, setFollowing] = useState(() => {
    try {
      const saved = localStorage.getItem('vogue_following_brands');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Fetch engagement stats (likes & comment counts)
  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const userId = user?.id || 'usr_sarah_01';
        const data = await feedService.getStats(userId);
        if (isMounted) setStats(data || {});
      } catch (err) {
        console.error('Failed to load engagement stats:', err);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, [user?.id]);

  // Fetch dynamic merchant products
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const data = await productService.getPublicProducts();
        if (isMounted && data && data.success && Array.isArray(data.products)) {
          setDbProducts(data.products);
        }
      } catch (err) {
        console.warn('Could not load dynamic products:', err);
      }
    };
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  const toggleFollow = (brandHandle, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!brandHandle) return;
    setFollowing(prev => {
      const next = { ...prev, [brandHandle]: !prev[brandHandle] };
      try {
        localStorage.setItem('vogue_following_brands', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleToggleLike = async (postId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
      console.error('Failed to toggle like:', err);
    }
  };

  // Convert products into structured cards
  const dbPosts = useMemo(() => {
    const activeProducts = dbProducts.length > 0 ? dbProducts : ALL_POSTS.filter(p => p.type !== 'user');

    return activeProducts.map(prod => {
      const priceNum = typeof prod.price === 'number' ? prod.price : Number(prod.price) || 49.99;
      const isMen = prod.targetAudience === 'Men' || prod.brand === 'Mens Edit';
      const brandName = prod.vendorName || prod.storeName || (isMen ? 'Mens Edit' : 'Studio Label Paris');
      const brandAvatar = prod.vendorLogo || (isMen ? '/Shop_images/8/overshirt1-500x750.jpg' : '/Shop_images/1/basic2-500x750.jpeg');
      // Accurate store handle resolution (replaces old 'tom' fallback)
      const brandHandle = prod.storeHandle || (isMen ? 'mensedit' : 'studiolabel');
      const imgUrl = prod.imageUrl || prod.image || (prod.images && prod.images[0]) || '/Shop_images/1/basic2-500x750.jpeg';

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
        storyDesc: prod.description || 'Artisan tailored piece from our latest studio collection.'
      };
    });
  }, [dbProducts]);

  // Combine and interleave community fit checks
  const allCombinedPosts = useMemo(() => {
    const communityPosts = ALL_POSTS.filter(p => p.type === 'user');
    return [
      ...dbPosts.slice(0, 2),
      ...(communityPosts[0] ? [communityPosts[0]] : []),
      ...dbPosts.slice(2, 6),
      ...(communityPosts[1] ? [communityPosts[1]] : []),
      ...dbPosts.slice(6)
    ];
  }, [dbPosts]);

  // Filter based on active tab and search query
  const filteredPosts = useMemo(() => {
    return allCombinedPosts.filter(post => {
      if (activeTab === 'following') {
        const handle = post.type === 'user'
          ? (post.taggedBrandHandle || post.taggedProducts?.[0]?.brandHandle || 'studiolabel')
          : (post.storeHandle || post.author.toLowerCase().replace(/[^a-z0-9]/g, ''));
        if (!following[handle]) return false;
      } else if (activeTab === 'men') {
        const isMen = post.category?.toLowerCase() === 'men' || post.category?.toLowerCase() === 'streetwear' || post.author?.toLowerCase().includes('men');
        if (!isMen && post.type !== 'user') return false;
      } else if (activeTab === 'women') {
        const isWomen = post.category?.toLowerCase() === 'women' || post.category?.toLowerCase() === 'dresses' || post.category?.toLowerCase() === 'tops';
        if (!isWomen && post.type !== 'user') return false;
      }

      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase().trim();
      if (post.author?.toLowerCase().includes(query)) return true;
      if (post.triedItem?.toLowerCase().includes(query)) return true;
      if (post.storyTitle?.toLowerCase().includes(query)) return true;
      if (post.productName?.toLowerCase().includes(query)) return true;
      return false;
    });
  }, [allCombinedPosts, activeTab, searchQuery, following]);

  return {
    posts: filteredPosts,
    activeTab,
    setActiveTab,
    stats,
    following,
    toggleFollow,
    handleToggleLike,
    tabs: FEED_TABS
  };
}
