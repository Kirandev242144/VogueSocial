import { APP_CONFIG, IS_MOCK_MODE } from '../constants/config';
import { mockFeedAdapter } from './mock/mockFeed';

/**
 * Domain Service for Lookbook Feed, Likes, Comments, and Engagement Stats
 */
export const feedService = {
  async getPostStats(userId) {
    if (IS_MOCK_MODE) {
      return mockFeedAdapter.getPostStats(userId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/posts/stats?userId=${encodeURIComponent(userId || '')}`);
    return res.json();
  },

  async getStats(userId) {
    return this.getPostStats(userId);
  },

  async getLikes(postId, userId) {
    if (IS_MOCK_MODE) {
      return mockFeedAdapter.getLikeStatus(postId, userId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/posts/${encodeURIComponent(postId)}/likes?userId=${encodeURIComponent(userId || '')}`);
    return res.json();
  },

  async toggleLike(postId, userId) {
    if (IS_MOCK_MODE) {
      return mockFeedAdapter.toggleLike(postId, userId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/posts/${encodeURIComponent(postId)}/likes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async getComments(postId) {
    if (IS_MOCK_MODE) {
      return mockFeedAdapter.getComments(postId);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/posts/${encodeURIComponent(postId)}/comments`);
    return res.json();
  },

  async addComment(postId, userId, userName, commentText) {
    if (IS_MOCK_MODE) {
      return mockFeedAdapter.addComment(postId, userId, userName, commentText);
    }
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}/posts/${encodeURIComponent(postId)}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, comment: commentText })
    });
    return res.json();
  }
};
