import api from './api.js';

export const subscriptionAPI = {
    // Subscribe to a channel
    subscribe: async (channelId) => {
        return api.post(`/subscriptions/c/${channelId}`);
    },

    // Unsubscribe from a channel
    unsubscribe: async (channelId) => {
        return api.delete(`/subscriptions/c/${channelId}`);
    },

    // Get user's subscriptions
    getUserSubscriptions: async (subscriberId) => {
        return api.get(`/subscriptions/u/${subscriberId || 'me'}`);
    },

    // Get channel's subscribers
    getChannelSubscribers: async (channelId) => {
        return api.get(`/subscriptions/c/${channelId}`);
    },

    // Check if user is subscribed to a channel / Get subscription status
    getSubscriptionStatus: async (channelId) => {
        return api.get(`/subscriptions/check/${channelId}`);
    },

    // Get subscription feed (videos from subscribed channels)
    getSubscriptionFeed: async (page = 1, limit = 20) => {
        return api.get(`/subscriptions/feed?page=${page}&limit=${limit}`);
    },

    // Get subscription stats
    getSubscriptionStats: async () => {
        return api.get('/subscriptions/stats');
    }
};