import api from './api.js';

export const authAPI = {
  // Register user
  register: async (userData) => {
    const formData = new FormData();
    // Handle field name mapping
    const mappedData = {
      ...userData,
      fullname: userData.fullName // Map fullName to fullname for backend
    };
    delete mappedData.fullName; // Remove the original fullName field
    
    Object.keys(mappedData).forEach(key => {
      if (mappedData[key]) {
        formData.append(key, mappedData[key]);
      }
    });
    return api.post('/users/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Login user
  login: async (credentials) => {
    // Handle the usernameOrEmail field from the frontend
    const { usernameOrEmail, password } = credentials;
    const loginData = {
      password,
      // Try to determine if it's an email or username
      ...(usernameOrEmail.includes('@') 
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
      )
    };
    return api.post('/users/login', loginData);
  },

  // Logout user
  logout: async () => {
    return api.post('/users/logout');
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get('/users/current-user');
  },

  // Refresh access token
  refreshToken: async () => {
    return api.post('/users/refresh-token');
  },

  // Change password
  changePassword: async (passwords) => {
    return api.post('/users/change-password', passwords);
  },

  // Update account details
  updateAccount: async (details) => {
    return api.patch('/users/update-account', details);
  },

  // Update avatar
  updateAvatar: async (avatar) => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return api.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Update cover image
  updateCoverImage: async (coverImage) => {
    const formData = new FormData();
    formData.append('coverImage', coverImage);
    return api.patch('/users/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get user channel profile
  getUserChannelProfile: async (username) => {
    return api.get(`/users/c/${username}`);
  },

  // Get watch history
  getWatchHistory: async () => {
    return api.get('/users/history');
  },
};