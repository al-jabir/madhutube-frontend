import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoList from '../components/video/VideoList.jsx';
import {
    PlayIcon,
    ArrowsRightLeftIcon,
    EllipsisVerticalIcon,
    LockClosedIcon,
    GlobeAltIcon,
    PlusIcon
} from '@heroicons/react/24/outline';

const PlaylistDetail = () => {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock playlist data - in real app this would come from API
    React.useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setPlaylist({
                _id: id,
                name: 'My Awesome Playlist',
                description: 'A collection of my favorite videos about technology and programming.',
                thumbnail: 'https://via.placeholder.com/320x180?text=Playlist',
                videoCount: 12,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                owner: {
                    _id: 'user1',
                    username: 'techcreator',
                    fullName: 'Tech Creator',
                    avatar: 'https://via.placeholder.com/40x40?text=TC'
                },
                videos: [] // This would contain video objects
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-youtube-red"></div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Playlist not found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        The playlist you're looking for doesn't exist or has been deleted.
                    </p>
                    <Link to="/" className="btn-primary">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Playlist Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-youtube-gray rounded-lg overflow-hidden shadow-sm sticky top-6">
                            {/* Playlist Thumbnail */}
                            <div className="relative aspect-video bg-gradient-to-br from-youtube-red to-red-600">
                                {playlist.thumbnail ? (
                                    <img
                                        src={playlist.thumbnail}
                                        alt={playlist.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PlayIcon className="h-16 w-16 text-white" />
                                    </div>
                                )}

                                {/* Privacy indicator */}
                                <div className="absolute top-4 left-4">
                                    {playlist.isPublic ? (
                                        <div className="flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                            <GlobeAltIcon className="h-4 w-4 mr-1" />
                                            Public
                                        </div>
                                    ) : (
                                        <div className="flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                            <LockClosedIcon className="h-4 w-4 mr-1" />
                                            Private
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Playlist Details */}
                            <div className="p-6">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {playlist.name}
                                </h1>

                                <div className="flex items-center space-x-2 mb-4">
                                    <Link
                                        to={`/channel/${playlist.owner.username}`}
                                        className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors duration-200"
                                    >
                                        <img
                                            src={playlist.owner.avatar}
                                            alt={playlist.owner.fullName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {playlist.owner.fullName}
                                        </span>
                                    </Link>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {playlist.videoCount} videos • Updated {
                                        new Date(playlist.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })
                                    }
                                </p>

                                {playlist.description && (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                                        {playlist.description}
                                    </p>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button className="btn-primary w-full flex items-center justify-center space-x-2">
                                        <PlayIcon className="h-5 w-5" />
                                        <span>Play All</span>
                                    </button>

                                    <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                                        <ArrowsRightLeftIcon className="h-5 w-5" />
                                        <span>Shuffle</span>
                                    </button>

                                    <button className="btn-secondary w-full flex items-center justify-center space-x-2">
                                        <PlusIcon className="h-5 w-5" />
                                        <span>Add Videos</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video List */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Videos in this playlist
                            </h2>
                        </div>

                        <VideoList
                            title={null}
                            emptyMessage="This playlist is empty. Add some videos to get started!"
                            // Mock empty playlist - in real app this would show playlist videos
                            apiCall={null}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistDetail;