import { storageEngine } from './storageEngine';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { APP_CONFIG } from '../../constants/config';

const delay = (ms = 50) => new Promise(res => setTimeout(res, ms));

export const mockFeedAdapter = {
  async getPostStats(userId) {
    await delay();
    const likesMap = storageEngine.getItem(STORAGE_KEYS.POST_LIKES, {});
    const commentsMap = storageEngine.getItem(STORAGE_KEYS.POST_COMMENTS, {});

    const stats = {};
    // Generate baseline counts
    for (let i = 1; i <= 20; i++) {
      const pid = String(i);
      const postLikes = likesMap[pid] || [];
      const postComments = commentsMap[pid] || [];
      const baseLikes = 24 + (i * 17) % 85;
      const baseComments = 4 + (i * 7) % 23;

      stats[pid] = {
        likeCount: baseLikes + postLikes.length,
        isLiked: postLikes.includes(userId),
        commentCount: baseComments + postComments.length
      };
    }
    return stats;
  },

  async toggleLike(postId, userId) {
    await delay();
    const pid = String(postId);
    const likesMap = storageEngine.getItem(STORAGE_KEYS.POST_LIKES, {});
    let postLikes = likesMap[pid] || [];

    const isLiked = postLikes.includes(userId);
    if (isLiked) {
      postLikes = postLikes.filter(u => u !== userId);
    } else {
      postLikes = [...postLikes, userId];
    }
    likesMap[pid] = postLikes;
    storageEngine.setItem(STORAGE_KEYS.POST_LIKES, likesMap);

    const baseLikes = 24 + (Number(postId) * 17) % 85;
    return {
      likeCount: baseLikes + postLikes.length,
      isLiked: !isLiked
    };
  },

  async getLikeStatus(postId, userId) {
    await delay();
    const pid = String(postId);
    const likesMap = storageEngine.getItem(STORAGE_KEYS.POST_LIKES, {});
    const postLikes = likesMap[pid] || [];
    const baseLikes = 24 + (Number(postId) * 17) % 85;
    return {
      likeCount: baseLikes + postLikes.length,
      isLiked: postLikes.includes(userId)
    };
  },

  async getComments(postId) {
    await delay();
    const pid = String(postId);
    const commentsMap = storageEngine.getItem(STORAGE_KEYS.POST_COMMENTS, {});
    return commentsMap[pid] || [];
  },

  async addComment(postId, userId, userName, commentText) {
    await delay();
    const pid = String(postId);
    const commentsMap = storageEngine.getItem(STORAGE_KEYS.POST_COMMENTS, {});
    const existing = commentsMap[pid] || [];

    const newComment = {
      id: `cmt_${Date.now()}`,
      postId: pid,
      userId,
      userName: userName || 'Fashion Enthusiast',
      commentText,
      createdAt: new Date().toISOString()
    };

    commentsMap[pid] = [newComment, ...existing];
    storageEngine.setItem(STORAGE_KEYS.POST_COMMENTS, commentsMap);
    return newComment;
  }
};
