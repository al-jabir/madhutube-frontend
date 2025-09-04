import api from './api.js';

export const commentAPI = {
  // Get comments for a video
  getCommentsByVideo: async (videoId) => {
    return api.get(`/comments/video/${videoId}`);
  },

  // Create new comment
  createComment: async (commentData) => {
    return api.post('/comments', commentData);
  },

  // Delete comment
  deleteComment: async (commentId) => {
    return api.delete(`/comments/${commentId}`);
  },
};