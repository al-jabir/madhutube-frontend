import api from './api.js';

export const subscriptionAPI = {
    // Subscribe to a channel
    subscribe: async (channelId) => {
        return api.post('/subscriptions/subscribe', { channelId });
    },

    // Unsubscribe from a channel
    unsubscribe: async (channelId) => {
        return api.post('/subscriptions/unsubscribe', { channelId });
    },

    // Get user's subscriptions
    getUserSubscriptions: async () => {
        return api.get('/subscriptions/');
    },

    // Check if user is subscribed to a channel
    getSubscriptionStatus: async (channelId) => {
        return api.get(`/subscriptions/check/${channelId}`);
    },
};
