import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { playlistAPI } from '../../services/playlistService.js';
import {
    EllipsisVerticalIcon,
    ClockIcon,
    EyeIcon,
    PlayIcon,
    CheckIcon,
    PlusIcon,
    ShareIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const getWatchLaterList = () => {
    try {
        return JSON.parse(localStorage.getItem('watchLater') || '[]');
    } catch {
        return [];
    }
};

const saveWatchLaterList = (list) => {
    localStorage.setItem('watchLater', JSON.stringify(list));
};

const VideoCard = ({ video }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isWatchLater, setIsWatchLater] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);

    const menuRef = useRef(null);
    const { user } = useAuth();
    const { success, info } = useNotification();

    const videoData = video || {
        _id: '1',
        title: 'Sample Video Title - This is a placeholder video with a longer title to test the UI',
        thumbnail: 'https://via.placeholder.com/320x180?text=Video+Thumbnail',
        duration: 125,
        views: 1234567,
        createdAt: new Date(Date.now() - 86400000),
        owner: {
            username: 'creator',
            fullName: 'Content Creator',
            avatar: 'https://via.placeholder.com/36x36?text=Avatar'
        }
    };

    useEffect(() => {
        const watchLaterList = getWatchLaterList();
        setIsWatchLater(watchLaterList.includes(videoData._id));
    }, [videoData._id]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
                setShowPlaylistModal(false);
                setShowNewPlaylistInput(false);
            }
        };
        if (showMenu || showPlaylistModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu, showPlaylistModal]);

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

    const toggleWatchLater = () => {
        const list = getWatchLaterList();
        if (isWatchLater) {
            const updated = list.filter(id => id !== videoData._id);
            saveWatchLaterList(updated);
            setIsWatchLater(false);
            success('Removed from Watch Later');
        } else {
            list.push(videoData._id);
            saveWatchLaterList(list);
            setIsWatchLater(true);
            success('Added to Watch Later');
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/video/${videoData._id}`;
        try {
            await navigator.clipboard.writeText(url);
            success('Link copied to clipboard');
        } catch {
            info('Share this video', { message: url });
        }
        setShowMenu(false);
    };

    const handleNotInterested = () => {
        setHidden(true);
        info('Video hidden', {
            message: 'Video removed from your recommendations',
            action: {
                label: 'Undo',
                onClick: () => setHidden(false)
            }
        });
    };

    const openPlaylistModal = async () => {
        if (!user) {
            info('Please log in to add to playlists');
            return;
        }
        setShowPlaylistModal(true);
        setLoadingPlaylists(true);
        try {
            const response = await playlistAPI.getUserPlaylists(user._id);
            setPlaylists(response.data.data || response.data || []);
        } catch (err) {
            setPlaylists([]);
        } finally {
            setLoadingPlaylists(false);
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await playlistAPI.addVideoToPlaylist(playlistId, videoData._id);
            const playlist = playlists.find(p => p._id === playlistId);
            success(`Added to "${playlist?.name || 'playlist'}"`);
            setShowPlaylistModal(false);
            setShowNewPlaylistInput(false);
        } catch (err) {
            info('Could not add to playlist');
        }
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        try {
            const response = await playlistAPI.createPlaylist({
                name: newPlaylistName.trim(),
                videos: [videoData._id]
            });
            success(`Created playlist "${newPlaylistName.trim()}" and added video`);
            setNewPlaylistName('');
            setShowNewPlaylistInput(false);
            setShowPlaylistModal(false);
        } catch (err) {
            info('Could not create playlist');
        }
    };

    if (hidden) return null;

    return (
        <div
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail Section */}
            <div className="relative overflow-hidden rounded-xl">
                <Link to={`/video/${videoData._id}`} className="block">
                    <div className="relative">
                        <img
                            src={videoData.thumbnail}
                            alt={videoData.title}
                            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
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

                        {/* View count on hover */}
                        {isHovered && (
                            <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                                <EyeIcon className="h-3 w-3" />
                                <span>{formatViews(videoData.views)}</span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Quick action buttons on hover */}
                {isHovered && (
                    <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                            className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-1 rounded transition-all duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWatchLater();
                            }}
                            title={isWatchLater ? 'Remove from Watch Later' : 'Watch Later'}
                        >
                            <ClockIcon className={`h-4 w-4 ${isWatchLater ? 'fill-white' : ''}`} />
                        </button>
                        <button
                            className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-1 rounded transition-all duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowMenu(!showMenu);
                            }}
                        >
                            <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Video Info Section */}
            <div className="mt-3 flex space-x-3">
                {/* Channel Avatar */}
                <Link to={`/channel/${videoData.owner?.username}`} className="flex-shrink-0">
                    <img
                        src={videoData.owner?.avatar}
                        alt={videoData.owner?.username}
                        className="w-9 h-9 rounded-full object-cover hover:scale-110 transition-transform duration-200"
                        loading="lazy"
                    />
                </Link>

                {/* Video Details */}
                <div className="flex-1 min-w-0">
                    <Link to={`/video/${videoData._id}`}>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-youtube-red transition-colors duration-200">
                            {videoData.title}
                        </h3>
                    </Link>

                    <Link
                        to={`/channel/${videoData.owner?.username}`}
                        className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mt-1 transition-colors duration-200"
                    >
                        {videoData.owner?.fullName}
                    </Link>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center space-x-1">
                        <span>{formatViews(videoData.views)}</span>
                        <span>&#183;</span>
                        <span>{formatDistanceToNow(new Date(videoData.createdAt), { addSuffix: true })}</span>
                    </div>
                </div>

                {/* Menu button for desktop */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Dropdown Menu */}
            {showMenu && (
                <div
                    ref={menuRef}
                    className="absolute top-1/3 right-0 mt-1 w-52 bg-white dark:bg-youtube-gray rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-30 py-1"
                >
                    <button
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => {
                            toggleWatchLater();
                            setShowMenu(false);
                        }}
                    >
                        <ClockIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                        {isWatchLater ? 'Remove from Watch Later' : 'Add to Watch Later'}
                    </button>
                    <button
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => {
                            setShowMenu(false);
                            openPlaylistModal();
                        }}
                    >
                        <PlusIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                        Add to Playlist
                    </button>
                    <button
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                        onClick={handleShare}
                    >
                        <ShareIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                        Share
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                    <button
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                        onClick={() => {
                            handleNotInterested();
                            setShowMenu(false);
                        }}
                    >
                        <XMarkIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                        Not interested
                    </button>
                </div>
            )}

            {/* Playlist Modal */}
            {showPlaylistModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div
                        ref={menuRef}
                        className="bg-white dark:bg-youtube-gray rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 w-80 max-h-96 overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Save to playlist
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPlaylistModal(false);
                                    setShowNewPlaylistInput(false);
                                }}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
                            >
                                <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Playlist List */}
                        <div className="overflow-y-auto max-h-64 py-1">
                            {loadingPlaylists ? (
                                <div className="px-4 py-6 text-center">
                                    <div className="w-6 h-6 border-2 border-youtube-red border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading playlists...</p>
                                </div>
                            ) : (
                                <>
                                    {playlists.map((playlist) => (
                                        <button
                                            key={playlist._id}
                                            className="flex items-center w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                                            onClick={() => handleAddToPlaylist(playlist._id)}
                                        >
                                            <div className="w-10 h-7 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0 mr-3 overflow-hidden">
                                                {playlist.thumbnail ? (
                                                    <img src={playlist.thumbnail} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <PlayIcon className="h-3 w-3 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {playlist.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {playlist.videos?.length || 0} videos
                                                </p>
                                            </div>
                                        </button>
                                    ))}

                                    {/* Create new playlist */}
                                    {showNewPlaylistInput ? (
                                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-600">
                                            <input
                                                type="text"
                                                value={newPlaylistName}
                                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                                placeholder="Playlist name"
                                                className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-youtube-red focus:border-transparent outline-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleCreatePlaylist();
                                                    if (e.key === 'Escape') setShowNewPlaylistInput(false);
                                                }}
                                                autoFocus
                                            />
                                            <div className="flex items-center justify-end space-x-2 mt-2">
                                                <button
                                                    onClick={() => {
                                                        setShowNewPlaylistInput(false);
                                                        setNewPlaylistName('');
                                                    }}
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors duration-150"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleCreatePlaylist}
                                                    disabled={!newPlaylistName.trim()}
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-youtube-red hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors duration-150"
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="flex items-center w-full text-left px-4 py-2.5 text-sm font-medium text-youtube-red hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 border-t border-gray-200 dark:border-gray-600"
                                            onClick={() => setShowNewPlaylistInput(true)}
                                        >
                                            <PlusIcon className="h-5 w-5 mr-3" />
                                            Create new playlist
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCard;
