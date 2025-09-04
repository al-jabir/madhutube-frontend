import api from './api.js';

export const videoAPI = {
  // Get all videos
  getAllVideos: async (params = {}) => {
    return api.get('/videos', { params });
  },

  // Get single video
  getVideo: async (id) => {
    return api.get(`/videos/${id}`);
  },

  // Create new video
  createVideo: async (videoData) => {
    const formData = new FormData();
    Object.keys(videoData).forEach(key => {
      if (videoData[key]) {
        formData.append(key, videoData[key]);
      }
    });
    return api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update video
  updateVideo: async (id, updateData) => {
    return api.patch(`/videos/${id}`, updateData);
  },

  // Delete video
  deleteVideo: async (id) => {
    return api.delete(`/videos/${id}`);
  },
};