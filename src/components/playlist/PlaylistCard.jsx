import React from 'react';
import { Link } from 'react-router-dom';
import {
    PlayIcon,
    EllipsisVerticalIcon,
    LockClosedIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const PlaylistCard = ({ playlist, onEdit, onDelete }) => {
    const { _id, name, description, thumbnail, videoCount, isPublic, createdAt, owner } = playlist;

    const formatVideoCount = (count) => {
        if (count === 0) return 'No videos';
        if (count === 1) return '1 video';
        return `${count} videos`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="video-card group">
            <Link to={`/playlist/${_id}`} className="block">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-youtube-red to-red-600">
                            <PlayIcon className="h-12 w-12 text-white" />
                        </div>
                    )}

                    {/* Video count overlay */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
                        {formatVideoCount(videoCount)}
                    </div>

                    {/* Privacy indicator */}
                    <div className="absolute top-2 left-2">
                        {isPublic ? (
                            <GlobeAltIcon className="h-5 w-5 text-white drop-shadow-lg" />
                        ) : (
                            <LockClosedIcon className="h-5 w-5 text-white drop-shadow-lg" />
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-youtube-red transition-colors duration-200 line-clamp-2">
                        {name}
                    </h3>

                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {description}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                            <p>Created {formatDate(createdAt)}</p>
                            {owner && <p>by {owner.fullName || owner.username}</p>}
                        </div>

                        {/* More options button */}
                        {(onEdit || onDelete) && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Handle dropdown menu
                                }}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                                <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PlaylistCard;