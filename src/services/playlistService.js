import api from './api.js';

export const playlistAPI = {
  // Create a new playlist
  createPlaylist: async (playlistData) => {
    return api.post('/playlists', playlistData);
  },

  // Get user's playlists
  getUserPlaylists: async (userId) => {
    return api.get(`/playlists/user/${userId}`);
  },

  // Get playlist by ID
  getPlaylistById: async (playlistId) => {
    return api.get(`/playlists/${playlistId}`);
  },

  // Update playlist
  updatePlaylist: async (playlistId, updateData) => {
    return api.patch(`/playlists/${playlistId}`, updateData);
  },

  // Delete playlist
  deletePlaylist: async (playlistId) => {
    return api.delete(`/playlists/${playlistId}`);
  },

  // Add video to playlist
  addVideoToPlaylist: async (playlistId, videoId) => {
    return api.patch(`/playlists/add/${videoId}/${playlistId}`);
  },

  // Remove video from playlist
  removeVideoFromPlaylist: async (playlistId, videoId) => {
    return api.patch(`/playlists/remove/${videoId}/${playlistId}`);
  },

  // Get all public playlists
  getPublicPlaylists: async () => {
    return api.get('/playlists/public');
  },

  // Search playlists
  searchPlaylists: async (query) => {
    return api.get(`/playlists/search?q=${encodeURIComponent(query)}`);
  }
};
