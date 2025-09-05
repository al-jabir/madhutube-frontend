import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoAPI } from '../services/videoService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import SubscriptionButton from '../components/subscription/SubscriptionButton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import VideoList from '../components/video/VideoList.jsx';
import LiveComments from '../components/realtime/LiveComments.jsx';
import VideoPlayer from '../components/video/VideoPlayer.jsx';
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ShareIcon,
    EllipsisHorizontalIcon,
    UserCircleIcon,
    CalendarIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import {
    HandThumbUpIcon as HandThumbUpSolidIcon,
    HandThumbDownIcon as HandThumbDownSolidIcon
} from '@heroicons/react/24/solid';

const VideoDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { success, error } = useNotification();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        if (id) {
            loadVideo();
        }
    }, [id]);

    const loadVideo = async () => {
        try {
            setLoading(true);
            const response = await videoAPI.getVideo(id);

            // Handle different response structures
            const videoData = response.data?.data || response.data;

            if (videoData) {
                // Ensure all required fields have default values to prevent undefined errors
                const processedVideo = {
                    _id: videoData._id || videoData.id || 'unknown',
                    title: videoData.title || 'Untitled Video',
                    description: videoData.description || '',
                    videoFile: videoData.videoFile || videoData.video || '',
                    thumbnail: videoData.thumbnail || videoData.thumbnailUrl || '',
                    views: videoData.views || 0,
                    likes: videoData.likes || 0,
                    dislikes: videoData.dislikes || 0,
                    createdAt: videoData.createdAt || new Date().toISOString(),
                    owner: {
                        _id: videoData.owner?._id || videoData.owner?.id || 'unknown',
                        username: videoData.owner?.username || 'unknown',
                        fullName: videoData.owner?.fullName || videoData.owner?.name || 'Unknown User',
                        avatar: videoData.owner?.avatar || '',
                        subscribersCount: videoData.owner?.subscribersCount || videoData.owner?.subscribers || 0
                    },
                    tags: videoData.tags || []
                };

                setVideo(processedVideo);
                setLikeCount(processedVideo.likes);
            } else {
                error('Video not found');
            }
        } catch (err) {
            console.error('Error loading video:', err);
            error('Failed to load video');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) {
            error('Please sign in to like videos');
            return;
        }

        try {
            if (isLiked) {
                setIsLiked(false);
                setLikeCount(prev => prev - 1);
                success('Like removed');
            } else {
                setIsLiked(true);
                setIsDisliked(false);
                setLikeCount(prev => prev + 1);
                success('Video liked!');
            }
        } catch (err) {
            error('Failed to update like');
        }
    };

    const handleDislike = async () => {
        if (!user) {
            error('Please sign in to dislike videos');
            return;
        }

        try {
            if (isDisliked) {
                setIsDisliked(false);
            } else {
                setIsDisliked(true);
                setIsLiked(false);
                if (isLiked) {
                    setLikeCount(prev => prev - 1);
                }
            }
            success('Feedback recorded');
        } catch (err) {
            error('Failed to update dislike');
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        success('Video link copied to clipboard!');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatNumber = (num) => {
        // Handle undefined, null, or invalid numbers
        if (num === undefined || num === null || isNaN(num)) {
            return '0';
        }

        const numValue = Number(num);
        if (numValue >= 1000000) {
            return (numValue / 1000000).toFixed(1) + 'M';
        } else if (numValue >= 1000) {
            return (numValue / 1000).toFixed(1) + 'K';
        }
        return numValue.toString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
                <LoadingSpinner size="large" text="Loading video..." className="pt-20" />
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Video not found</h2>
                    <p className="text-gray-600 dark:text-gray-400">The video you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="bg-black rounded-lg overflow-hidden mb-6">
                            <VideoPlayer
                                src={video?.videoFile || ''}
                                poster={video?.thumbnail || ''}
                                title={video?.title || 'Video'}
                            />
                        </div>

                        {/* Video Info */}
                        <div className="bg-white dark:bg-youtube-gray rounded-lg p-3 mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {video?.title || 'Video Title'}
                            </h1>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center space-x-1">
                                        <EyeIcon className="h-4 w-4" />
                                        <span>{formatNumber(video?.views || 0)} views</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{formatDate(video?.createdAt || new Date())}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${isLiked
                                            ? 'bg-youtube-red text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {isLiked ? (
                                            <HandThumbUpSolidIcon className="h-5 w-5" />
                                        ) : (
                                            <HandThumbUpIcon className="h-5 w-5" />
                                        )}
                                        <span>{formatNumber(likeCount || 0)}</span>
                                    </button>

                                    <button
                                        onClick={handleDislike}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${isDisliked
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        {isDisliked ? (
                                            <HandThumbDownSolidIcon className="h-5 w-5" />
                                        ) : (
                                            <HandThumbDownIcon className="h-5 w-5" />
                                        )}
                                    </button>

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        <ShareIcon className="h-5 w-5" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>

                            {/* Channel Info */}
                            <div className="flex items-center justify-between mb-6">
                                <Link
                                    to={`/channel/${video?.owner?.username || 'unknown'}`}
                                    className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors duration-200"
                                >
                                    {video?.owner?.avatar ? (
                                        <img
                                            src={video.owner.avatar}
                                            alt={video?.owner?.fullName || 'User'}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    ) : (
                                        <UserCircleIcon className="w-12 h-12 text-gray-400" />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {video?.owner?.fullName || 'Unknown User'}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatNumber(video?.owner?.subscribersCount || 0)} subscribers
                                        </p>
                                    </div>
                                </Link>

                                <SubscriptionButton
                                    channel={video?.owner}
                                    onSubscriptionChange={(channelId, isSubscribed) => {
                                        success(isSubscribed ? 'Subscribed!' : 'Unsubscribed!');
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                                <div className="relative">
                                    <p className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${showDescription ? '' : 'line-clamp-3'
                                        }`}>
                                        {video?.description || 'No description available.'}
                                    </p>
                                    {video?.description && video.description.length > 200 && (
                                        <button
                                            onClick={() => setShowDescription(!showDescription)}
                                            className="text-youtube-red hover:text-youtube-hover font-medium text-sm mt-2"
                                        >
                                            {showDescription ? 'Show less' : 'Show more'}
                                        </button>
                                    )}
                                </div>

                                {video?.tags && video.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {video.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments Section (Placeholder) */}
                        <div className="bg-white dark:bg-youtube-gray rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Comments (Coming Soon)
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Comment functionality will be implemented in the next phase.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar - Related Videos */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Related Videos
                            </h3>
                            <VideoList
                                title={null}
                                emptyMessage="No related videos found"
                                layout="single-column"
                                // Mock empty for now - in real app this would show related videos
                                apiCall={null}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Comments Component */}
            <LiveComments videoId={id} />
        </div>
    );
};

export default VideoDetail;