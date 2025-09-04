import React, { useState, useEffect } from 'react';
import { subscriptionAPI } from '../services/subscriptionService.js';
import { useAuth } from '../context/AuthContext.jsx';
import VideoCard from '../components/video/VideoCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import {
    UserGroupIcon,
    VideoCameraIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const SubscriptionFeed = () => {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (user) {
            loadSubscriptionData();
        }
    }, [user]);

    const loadSubscriptionData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Load both subscriptions and subscription feed
            const [subscriptionsResponse, feedResponse] = await Promise.all([
                subscriptionAPI.getUserSubscriptions(),
                subscriptionAPI.getSubscriptionFeed()
            ]);

            setSubscriptions(subscriptionsResponse.data.subscriptions || []);
            setVideos(feedResponse.data.videos || []);
        } catch (error) {
            console.error('Error loading subscription data:', error);
            setError('Failed to load subscription feed');
        } finally {
            setLoading(false);
        }
    };

    const handleSubscriptionChange = (channelId, isSubscribed) => {
        if (!isSubscribed) {
            // Remove videos from this channel from the feed
            setVideos(prev => prev.filter(video => video.owner._id !== channelId));
            setSubscriptions(prev => prev.filter(sub => sub._id !== channelId));
        } else {
            // Reload the feed to include new subscription
            loadSubscriptionData();
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center">
                <div className="text-center">
                    <UserGroupIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Sign in to see your subscriptions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Subscribe to channels to see their latest videos here
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center">
                <div className="text-center">
                    <ExclamationCircleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Error loading subscriptions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <button onClick={loadSubscriptionData} className="btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Subscriptions
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Latest videos from channels you follow
                    </p>
                </div>

                {/* Subscription Channels */}
                {subscriptions.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Your Subscriptions
                        </h2>
                        <div className="flex overflow-x-auto space-x-4 pb-4">
                            {subscriptions.map((channel) => (
                                <div
                                    key={channel._id}
                                    className="flex-shrink-0 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-gray-200 dark:bg-gray-700">
                                        {channel.avatar ? (
                                            <img
                                                src={channel.avatar}
                                                alt={channel.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <UserGroupIcon className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 max-w-16 truncate">
                                        {channel.fullName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Video Feed */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Latest Videos
                        </h2>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeTab === 'all'
                                    ? 'bg-youtube-red text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setActiveTab('today')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeTab === 'today'
                                    ? 'bg-youtube-red text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Today
                            </button>
                        </div>
                    </div>

                    {videos.length === 0 ? (
                        <div className="text-center py-12">
                            <VideoCameraIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No videos yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {subscriptions.length === 0
                                    ? "Subscribe to channels to see their videos here"
                                    : "Your subscribed channels haven't uploaded any videos recently"
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {videos
                                .filter(video => {
                                    if (activeTab === 'today') {
                                        const today = new Date();
                                        const videoDate = new Date(video.createdAt);
                                        return videoDate.toDateString() === today.toDateString();
                                    }
                                    return true;
                                })
                                .map((video) => (
                                    <VideoCard
                                        key={video._id}
                                        video={video}
                                        onSubscriptionChange={handleSubscriptionChange}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionFeed;