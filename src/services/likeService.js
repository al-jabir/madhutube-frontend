import api from './api.js';

export const likeAPI = {
  // Get likes for a video
  getLikesByVideo: async (videoId) => {
    return api.get(`/likes/video/${videoId}`);
  },

  // Like a video
  likeVideo: async (videoId) => {
    return api.post('/likes/like', { videoId });
  },

  // Unlike a video
  unlikeVideo: async (videoId) => {
    return api.post('/likes/unlike', { videoId });
  },
};