import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard.jsx';
import { ExclamationTriangleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

const VideoList = ({ apiCall, title, emptyMessage = "No videos found", category }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError(null);

                // Simulate API call with mock data for demonstration
                if (!apiCall) {
                    // Generate mock videos for demonstration
                    const mockVideos = Array.from({ length: 12 }, (_, index) => ({
                        _id: `mock-${index + 1}`,
                        title: `Amazing Video ${index + 1} - This is a sample video title that might be quite long`,
                        thumbnail: `https://via.placeholder.com/320x180?text=Video+${index + 1}`,
                        duration: Math.floor(Math.random() * 600) + 60,
                        views: Math.floor(Math.random() * 1000000) + 1000,
                        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                        owner: {
                            username: `creator${index + 1}`,
                            fullName: `Content Creator ${index + 1}`,
                            avatar: `https://via.placeholder.com/36x36?text=C${index + 1}`
                        }
                    }));

                    // Simulate network delay
                    setTimeout(() => {
                        setVideos(mockVideos);
                        setLoading(false);
                    }, 1000);
                    return;
                }

                const response = await apiCall();
                setVideos(response.data.data || response.data);
            } catch (error) {
                console.error('Error fetching videos:', error);
                setError(error.response?.data?.message || 'Failed to load videos');
            } finally {
                if (apiCall) setLoading(false);
            }
        };

        fetchVideos();
    }, [apiCall, category]);

    // Loading skeleton
    if (loading) {
        return (
            <div>
                {title && (
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 px-2 sm:px-6">{title}</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 px-2 sm:px-6">
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