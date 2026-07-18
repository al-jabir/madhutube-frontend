import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { authAPI } from '../services/authService.js';
import { videoAPI } from '../services/videoService.js';
import { subscriptionAPI } from '../services/subscriptionService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import VideoCard from '../components/video/VideoCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import {
    UserCircleIcon,
    CheckBadgeIcon,
    Bars3BottomLeftIcon,
    PlayIcon,
    ListBulletIcon,
    InformationCircleIcon,
    UserPlusIcon,
    UserMinusIcon,
    BellIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline';
import {
    UserPlusIcon as UserPlusSolidIcon,
    UserMinusIcon as UserMinusSolidIcon
} from '@heroicons/react/24/solid';

const Channel = () => {
    const { username } = useParams();
    const { user } = useAuth();
    const { success, error } = useNotification();

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videoLoading, setVideoLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('videos');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribing, setSubscribing] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);

    useEffect(() => {
        if (username) {
            fetchChannel();
        }
    }, [username]);

    useEffect(() => {
        if (channel) {
            fetchChannelVideos();
            if (user) {
                checkSubscription();
            }
        }
    }, [channel, user]);

    const fetchChannel = async () => {
        try {
            setLoading(true);
            const response = await authAPI.getUserChannelProfile(username);
            setChannel(response.data.data);
            setSubscriberCount(response.data.data.subscribersCount || 0);
        } catch (err) {
            console.error('Error fetching channel:', err);
            error('Failed to load channel');
        } finally {
            setLoading(false);
        }
    };

    const fetchChannelVideos = async () => {
        try {
            setVideoLoading(true);
            const response = await videoAPI.getAllVideos();
            const allVideos = response.data.data || [];
            const channelVideos = allVideos.filter(
                (v) => v.owner && v.owner._id === channel._id
            );
            setVideos(channelVideos);
        } catch (err) {
            console.error('Error fetching videos:', err);
        } finally {
            setVideoLoading(false);
        }
    };

    const checkSubscription = async () => {
        try {
            const response = await subscriptionAPI.getUserSubscriptions();
            const subs = response.data.data || [];
            const subscribed = subs.some(
                (sub) => (sub.channel || sub._id) === channel._id
            );
            setIsSubscribed(subscribed);
        } catch (err) {
            console.error('Error checking subscription:', err);
        }
    };

    const handleSubscribe = async () => {
        if (!user) {
            error('Please sign in to subscribe');
            return;
        }
        try {
            setSubscribing(true);
            if (isSubscribed) {
                await subscriptionAPI.unsubscribe(channel._id);
                setIsSubscribed(false);
                setSubscriberCount((prev) => Math.max(0, prev - 1));
                success('Unsubscribed');
            } else {
                await subscriptionAPI.subscribe(channel._id);
                setIsSubscribed(true);
                setSubscriberCount((prev) => prev + 1);
                success('Subscribed!');
            }
        } catch (err) {
            console.error('Subscription error:', err);
            error('Failed to update subscription');
        } finally {
            setSubscribing(false);
        }
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    const tabs = [
        { id: 'videos', label: 'Videos', icon: PlayIcon },
        { id: 'playlists', label: 'Playlists', icon: ListBulletIcon },
        { id: 'about', label: 'About', icon: InformationCircleIcon },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
                <LoadingSpinner size="large" text="Loading channel..." className="pt-20" />
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Channel not found</h2>
                    <p className="text-gray-600 dark:text-gray-400">This channel doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            {/* Cover Image */}
            <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden rounded-b-2xl">
                {channel.coverImage ? (
                    <img
                        src={channel.coverImage}
                        alt={`${channel.fullname} cover`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-youtube-red via-red-600 to-red-800" />
                )}
            </div>

            <div className="max-w-6xl mx-auto px-4">
                {/* Channel Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-8 sm:-mt-6 mb-6">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        {channel.avatar ? (
                            <img
                                src={channel.avatar}
                                alt={channel.fullname}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-youtube-dark object-cover bg-white dark:bg-youtube-gray"
                            />
                        ) : (
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-youtube-dark bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <UserCircleIcon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                            </div>
                        )}
                        {channel.verified && (
                            <CheckBadgeIcon className="absolute bottom-1 right-1 w-6 h-6 text-youtube-red bg-white dark:bg-youtube-dark rounded-full" />
                        )}
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1 text-center sm:text-left pb-2">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                {channel.fullname}
                            </h1>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                                @{channel.username}
                            </span>
                            <span className="text-gray-500 dark:text-gray-500">•</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {formatNumber(subscriberCount)} subscribers
                            </span>
                            <span className="text-gray-500 dark:text-gray-500">•</span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                                {videos.length} videos
                            </span>
                        </div>
                    </div>

                    {/* Subscribe Button */}
                    {user && user._id !== channel._id ? (
                        <button
                            onClick={handleSubscribe}
                            disabled={subscribing}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                                isSubscribed
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    : 'bg-youtube-red hover:bg-youtube-hover text-white'
                            } ${subscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {subscribing ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                            ) : isSubscribed ? (
                                <>
                                    <UserMinusIcon className="h-5 w-5" />
                                    <span>Subscribed</span>
                                </>
                            ) : (
                                <>
                                    <UserPlusIcon className="h-5 w-5" />
                                    <span>Subscribe</span>
                                </>
                            )}
                        </button>
                    ) : null}
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                    <div className="flex gap-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors relative ${
                                    activeTab === tab.id
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'videos' && (
                    <div>
                        {videoLoading ? (
                            <LoadingSpinner size="medium" text="Loading videos..." className="py-12" />
                        ) : videos.length === 0 ? (
                            <div className="text-center py-16">
                                <Squares2X2Icon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No videos yet</h3>
                                <p className="text-gray-500 dark:text-gray-400">This channel hasn't uploaded any videos.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {videos.map((video) => (
                                    <VideoCard key={video._id} video={video} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'playlists' && (
                    <div className="text-center py-16">
                        <ListBulletIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No playlists yet</h3>
                        <p className="text-gray-500 dark:text-gray-400">This channel has no public playlists.</p>
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="max-w-2xl space-y-6 pb-12">
                        <div className="bg-white dark:bg-youtube-gray rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {channel.description || `${channel.fullname} is a content creator on MadhuTube.`}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-youtube-gray rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <span className="text-gray-500 dark:text-gray-400 w-32">Subscribers</span>
                                    <span className="font-medium">{formatNumber(subscriberCount)}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <span className="text-gray-500 dark:text-gray-400 w-32">Videos</span>
                                    <span className="font-medium">{videos.length}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <span className="text-gray-500 dark:text-gray-400 w-32">Joined</span>
                                    <span className="font-medium">
                                        {new Date(channel.createdAt || Date.now()).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                {channel.email && user && user._id === channel._id && (
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <span className="text-gray-500 dark:text-gray-400 w-32">Email</span>
                                        <span className="font-medium">{channel.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Channel;
