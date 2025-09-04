import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
    EllipsisVerticalIcon,
    ClockIcon,
    EyeIcon,
    PlayIcon
} from '@heroicons/react/24/outline';
import { getThumbnail, getAvatar } from '../../services/assetService.js';

const VideoCard = ({ video }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`;
        }
        return `${views} views`;
    };

    const formatDuration = (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle image loading errors
    const handleImageError = () => {
        setImageError(true);
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };

    // Fallback data for demonstration with local images
    const videoData = video || {
        _id: '1',
        title: 'Sample Video Title - This is a placeholder video with a longer title to test the UI',
        thumbnail: getThumbnail('video-1'),
        duration: 125,
        views: 1234567,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        owner: {
            username: 'creator',
            fullName: 'Content Creator',
            avatar: getAvatar('avatar-1')
        }
    };

    // Get the thumbnail source with fallback
    const getThumbnailSrc = () => {
        if (imageError) {
            return 'https://via.placeholder.com/320x180?text=Video+Thumbnail';
        }
        // If it's already an imported asset (string URL), use it directly
        // If it's a path, try to get it from assets
        if (typeof videoData.thumbnail === 'string' && videoData.thumbnail.startsWith('/images/')) {
            return getThumbnail('video-1'); // fallback to local asset
        }
        return videoData.thumbnail || getThumbnail('video-1');
    };

    // Get the avatar source with fallback
    const getAvatarSrc = () => {
        if (avatarError) {
            return 'https://via.placeholder.com/36x36?text=Avatar';
        }
        // If it's already an imported asset (string URL), use it directly
        // If it's a path, try to get it from assets
        if (typeof videoData.owner?.avatar === 'string' && videoData.owner?.avatar.startsWith('/images/')) {
            return getAvatar('avatar-1'); // fallback to local asset
        }
        return videoData.owner?.avatar || getAvatar('avatar-1');
    };

    return (
        <div
            className="video-card group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail Section */}
            <div className="relative overflow-hidden rounded-xl">
                <Link to={`/video/${videoData._id}`} className="block">
                    <div className="relative">
                        <img
                            src={getThumbnailSrc()}
                            alt={videoData.title}
                            className="video-thumbnail group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={handleImageError}
                        />

                        {/* Hover overlay */}
                        {isHovered && (
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300">
                                <div className="bg-black bg-opacity-60 rounded-full p-3">
                                    <PlayIcon className="h-8 w-8 text-white" />
                                </div>
                            </div>
                        )}

                        {/* Duration badge */}
                        {videoData.duration && (
                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded font-medium">
                                {formatDuration(videoData.duration)}
                            </span>
                        )}

                        {/* View count - always visible on mobile, hover on desktop */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                            <EyeIcon className="h-3 w-3" />
                            <span>{formatViews(videoData.views)}</span>
                        </div>
                    </div>
                </Link>

                {/* Quick action buttons on hover */}
                {isHovered && (
                    <div className="absolute top-2 right-2 flex space-x-1">
                        <button className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-1 rounded transition-all duration-200">
                            <ClockIcon className="h-4 w-4" />
                        </button>
                        <button
                            className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-1 rounded transition-all duration-200"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Video Info Section */}
            <div className="mt-2 sm:mt-3 flex space-x-2 sm:space-x-3">
                {/* Channel Avatar */}
                <Link to={`/channel/${videoData.owner?.username}`} className="flex-shrink-0">
                    <img
                        src={getAvatarSrc()}
                        alt={videoData.owner?.username}
                        className="channel-avatar hover:scale-110 transition-transform duration-200"
                        loading="lazy"
                        onError={handleAvatarError}
                    />
                </Link>

                {/* Video Details */}
                <div className="flex-1 min-w-0">
                    <Link to={`/video/${videoData._id}`}>
                        <h3 className="video-title group-hover:text-youtube-red">
                            {videoData.title}
                        </h3>
                    </Link>

                    <Link
                        to={`/channel/${videoData.owner?.username}`}
                        className="block text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-1 transition-colors duration-200"
                    >
                        {videoData.owner?.fullName}
                    </Link>

                    <div className="video-meta mt-1 flex items-center space-x-1 text-xs sm:text-sm">
                        <span>{formatViews(videoData.views)}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(videoData.createdAt), { addSuffix: true })}</span>
                    </div>
                </div>

                {/* Menu button for desktop */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 sm:block hidden transition-opacity duration-200">
                    <button
                        className="btn-icon"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Menu button for mobile - always visible */}
                <div className="flex-shrink-0 sm:hidden block">
                    <button
                        className="btn-icon p-1"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
                <div className="absolute top-0 right-0 mt-8 mr-2 w-40 sm:w-48 bg-white dark:bg-youtube-gray rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-20">
                    <div className="py-1">
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            Add to Watch Later
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            Add to Playlist
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            Share
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                            Not interested
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCard;