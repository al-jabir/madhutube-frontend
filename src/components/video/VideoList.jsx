import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard.jsx';
import { ExclamationTriangleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { videoAPI } from '../../services/videoService.js';

const VideoList = ({ apiCall, title, emptyMessage = "No videos found", category, refreshKey, layout = "grid" }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use provided API call or default to fetching all videos
                const response = apiCall ? await apiCall() : await videoAPI.getAllVideos();

                // Handle different response structures
                const videosData = response.data?.data || response.data || [];
                setVideos(Array.isArray(videosData) ? videosData : []);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setError(error.response?.data?.message || 'Failed to load videos');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [apiCall, category, refreshKey]);

    // Loading skeleton
    if (loading) {
        return (
            <div>
                {title && (
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 px-2 sm:px-6">{title}</h2>
                )}
                <div className={`${layout === "single-column"
                        ? "grid grid-cols-1 gap-3 px-2 sm:px-6"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-6"
                    }`}>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-xl mb-3"></div>
                            <div className="flex space-x-3">
                                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="text-center p-6 sm:p-12 mx-4 sm:mx-6">
                <ExclamationTriangleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Something went wrong</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Empty state
    if (videos.length === 0) {
        return (
            <div className="text-center p-6 sm:p-12 mx-4 sm:mx-6">
                <VideoCameraIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No videos found</h3>
                <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {title && (
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-6 px-2 sm:px-6 text-gray-900 dark:text-white">{title}</h2>
            )}
            <div className={`${layout === "single-column"
                    ? "grid grid-cols-1 gap-3 px-2 sm:px-6"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-6"
                }`}>
                {videos.map((video) => (
                    <div key={video._id} className="slide-up">
                        <VideoCard video={video} />
                    </div>
                ))}
            </div>

            {/* Load more button */}
            {videos.length > 0 && (
                <div className="text-center mt-6 sm:mt-12 px-2 sm:px-6">
                    <button className="btn-secondary hover:btn-primary transition-all duration-300 w-full sm:w-auto">
                        Load More Videos
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoList;