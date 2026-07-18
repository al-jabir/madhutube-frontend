import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../../services/subscriptionService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
    UserPlusIcon,
    UserMinusIcon,
    BellIcon,
} from '@heroicons/react/24/outline';

const SubscriptionButton = ({ channel, onSubscriptionChange }) => {
    const { user } = useAuth();
    const { error } = useNotification();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(channel?.subscribersCount || 0);

    useEffect(() => {
        if (user && channel?._id) {
            checkSubscriptionStatus();
        }
    }, [user, channel?._id]);

    const checkSubscriptionStatus = async () => {
        try {
            const res = await subscriptionAPI.getSubscriptionStatus(channel._id);
            setIsSubscribed(res.data.data.isSubscribed);
            setSubscriberCount(res.data.data.subscriberCount || 0);
        } catch (err) {
            // 401 means not logged in, ignore
            if (err.response?.status !== 401) {
                console.error('Error checking subscription status:', err);
            }
        }
    };

    const handleSubscribe = async () => {
        if (!user) {
            error('Please sign in to subscribe');
            return;
        }

        try {
            setIsLoading(true);
            if (isSubscribed) {
                await subscriptionAPI.unsubscribe(channel._id);
                setIsSubscribed(false);
                setSubscriberCount((prev) => Math.max(0, prev - 1));
            } else {
                await subscriptionAPI.subscribe(channel._id);
                setIsSubscribed(true);
                setSubscriberCount((prev) => prev + 1);
            }
            if (onSubscriptionChange) {
                onSubscriptionChange(channel._id, !isSubscribed);
            }
        } catch (err) {
            console.error('Error updating subscription:', err);
            error(err.response?.data?.message || 'Failed to update subscription');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user || user._id === channel?._id) {
        return null;
    }

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-5 py-2 rounded-full font-medium transition-all duration-200 ${
                    isSubscribed
                        ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                        : 'bg-youtube-red hover:bg-youtube-hover text-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                ) : isSubscribed ? (
                    <UserMinusIcon className="h-4 w-4" />
                ) : (
                    <UserPlusIcon className="h-4 w-4" />
                )}
                <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
            </button>

            {isSubscribed && (
                <button
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition-colors duration-200"
                    title="Notification settings"
                >
                    <BellIcon className="h-4 w-4" />
                </button>
            )}

            <span className="text-sm text-gray-600 dark:text-gray-400">
                {subscriberCount.toLocaleString()} subscriber{subscriberCount !== 1 ? 's' : ''}
            </span>
        </div>
    );
};

export default SubscriptionButton;
