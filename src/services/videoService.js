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
  createVideo: async (videoData, onUploadProgress) => {
    const formData = new FormData();

    // Log the input data
    console.log('Input videoData:', videoData);

    // Append each field to FormData
    Object.keys(videoData).forEach(key => {
      if (videoData[key] !== null && videoData[key] !== undefined) {
        formData.append(key, videoData[key]);
      }
    });

    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Log the FormData as an object for better visibility
    const formDataObj = {};
    for (let [key, value] of formData.entries()) {
      formDataObj[key] = value instanceof File ?
        `${value.name} (${value.type}, ${value.size} bytes)` :
        value;
    }
    console.log('FormData as object:', formDataObj);

    // Also log the keys to see what fields we're sending
    console.log('FormData keys:', Object.keys(formDataObj));

    // Try to detect if we're missing common required fields
    const requiredFields = ['title', 'videoFile', 'thumbnail'];
    const missingFields = requiredFields.filter(field => !formDataObj[field]);

    if (missingFields.length > 0) {
      console.warn('Potentially missing required fields:', missingFields);
    }

    // When sending FormData, let the browser set the Content-Type header automatically
    // by not specifying it explicitly, which allows for proper boundary generation
    return api.post('/videos', formData, {
      onUploadProgress: onUploadProgress
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