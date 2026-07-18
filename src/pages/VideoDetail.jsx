import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { videoAPI } from '../services/videoService.js';
import { likeAPI } from '../services/likeService.js';
import { commentAPI } from '../services/commentService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import SubscriptionButton from '../components/subscription/SubscriptionButton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import {
    HandThumbUpIcon,
    ShareIcon,
    UserCircleIcon,
    CalendarIcon,
    EyeIcon,
    ChatBubbleLeftIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
};

const formatDuration = (seconds) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};

/* ─── Comment Section ─── */
const CommentSection = ({ videoId, currentUser }) => {
    const { success, error } = useNotification();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [posting, setPosting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true);
            const res = await commentAPI.getCommentsByVideo(videoId);
            setComments(res.data.data || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    }, [videoId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        try {
            setPosting(true);
            const res = await commentAPI.createComment({
                content: newComment.trim(),
                videoId,
            });
            const created = res.data.data;
            // populate owner manually from current user
            created.owner = {
                _id: currentUser._id,
                username: currentUser.username,
                avatar: currentUser.avatar,
            };
            setComments((prev) => [created, ...prev]);
            setNewComment('');
            success('Comment posted');
        } catch (err) {
            console.error('Error posting comment:', err);
            error('Failed to post comment');
        } finally {
            setPosting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            setDeletingId(commentId);
            await commentAPI.deleteComment(commentId);
            setComments((prev) => prev.filter((c) => c._id !== commentId));
            success('Comment deleted');
        } catch (err) {
            console.error('Error deleting comment:', err);
            error('Failed to delete comment');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="bg-white dark:bg-youtube-gray rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <ChatBubbleLeftIcon className="h-5 w-5" />
                Comments
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({comments.length})
                </span>
            </h3>

            {currentUser ? (
                <div className="flex gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full shrink-0 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {currentUser.avatar ? (
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={2}
                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 py-2 resize-none focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setNewComment('')}
                                className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePostComment}
                                disabled={!newComment.trim() || posting}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                    newComment.trim()
                                        ? 'bg-youtube-red text-white hover:bg-youtube-hover'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {posting ? 'Posting...' : 'Comment'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-6 mb-6 border-b border-gray-200 dark:border-gray-700">
                    <Link
                        to="/login"
                        className="text-youtube-red hover:underline font-medium text-sm"
                    >
                        Sign in
                    </Link>
                    <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                        to comment on this video
                    </span>
                </div>
            )}

            {loading ? (
                <LoadingSpinner size="small" text="" showText={false} className="py-8" />
            ) : comments.length === 0 ? (
                <div className="text-center py-8">
                    <ChatBubbleLeftIcon className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        No comments yet. Be the first to comment!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3 group">
                            <div className="w-10 h-10 rounded-full shrink-0 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                {comment.owner?.avatar ? (
                                    <img
                                        src={comment.owner.avatar}
                                        alt={comment.owner.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {comment.owner?.username || 'Unknown'}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {timeAgo(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                            {currentUser && currentUser._id === comment.owner?._id && (
                                <button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    disabled={deletingId === comment._id}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all shrink-0 disabled:opacity-50"
                                    title="Delete comment"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Video Detail Page ─── */
const VideoDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { success, error } = useNotification();

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showDescription, setShowDescription] = useState(false);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);

    const loadVideo = useCallback(async () => {
        try {
            setLoading(true);
            const res = await videoAPI.getVideo(id);
            setVideo(res.data.data);
            setLikeCount(res.data.data.likesCount || 0);
        } catch (err) {
            console.error('Error loading video:', err);
            error('Failed to load video');
        } finally {
            setLoading(false);
        }
    }, [id, error]);

    const checkLikeStatus = useCallback(async () => {
        if (!user) return;
        try {
            const res = await likeAPI.getLikesByVideo(id);
            const likes = res.data.data || [];
            const userLiked = likes.some(
                (like) => (like.likedBy?._id || like.likedBy) === user._id
            );
            setIsLiked(userLiked);
            setLikeCount(likes.length);
        } catch (err) {
            console.error('Error checking like status:', err);
        }
    }, [id, user]);

    const fetchRelatedVideos = useCallback(async () => {
        try {
            setRelatedLoading(true);
            const res = await videoAPI.getAllVideos();
            const all = res.data.data || [];
            setRelatedVideos(all.filter((v) => v._id !== id).slice(0, 10));
        } catch (err) {
            console.error('Error fetching related videos:', err);
        } finally {
            setRelatedLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadVideo();
            fetchRelatedVideos();
            window.scrollTo(0, 0);
        }
    }, [id, loadVideo, fetchRelatedVideos]);

    useEffect(() => {
        if (video && user) {
            checkLikeStatus();
        }
    }, [video, user, checkLikeStatus]);

    const handleLike = async () => {
        if (!user) {
            error('Please sign in to like videos');
            return;
        }
        try {
            if (isLiked) {
                await likeAPI.unlikeVideo(id);
                setIsLiked(false);
                setLikeCount((prev) => Math.max(0, prev - 1));
                success('Like removed');
            } else {
                await likeAPI.likeVideo(id);
                setIsLiked(true);
                setLikeCount((prev) => prev + 1);
                success('Video liked!');
            }
        } catch (err) {
            console.error('Error updating like:', err);
            error('Failed to update like');
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        success('Video link copied to clipboard!');
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
                <div className="text-center px-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Video not found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The video you're looking for doesn't exist or has been removed.
                    </p>
                    <Link to="/" className="btn-primary inline-block">
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
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="bg-black rounded-xl overflow-hidden mb-6 aspect-video">
                            <video
                                src={video.videoFile}
                                poster={video.thumbnail}
                                controls
                                className="w-full h-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        {/* Video Info */}
                        <div className="bg-white dark:bg-youtube-gray rounded-xl p-6 mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {video.title}
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center space-x-1">
                                        <EyeIcon className="h-4 w-4" />
                                        <span>{formatNumber(video.views)} views</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{formatDate(video.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center space-x-2 px-5 py-2 rounded-full transition-colors duration-200 ${
                                            isLiked
                                                ? 'bg-youtube-red text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {isLiked ? (
                                            <HandThumbUpSolidIcon className="h-5 w-5" />
                                        ) : (
                                            <HandThumbUpIcon className="h-5 w-5" />
                                        )}
                                        <span>{formatNumber(likeCount)}</span>
                                    </button>

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center space-x-2 px-5 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        <ShareIcon className="h-5 w-5" />
                                        <span className="hidden sm:inline">Share</span>
                                    </button>
                                </div>
                            </div>

                            {/* Channel Info + Subscribe */}
                            <div className="flex items-center justify-between mb-6">
                                <Link
                                    to={`/channel/${video.owner?.username}`}
                                    className="flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors duration-200"
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shrink-0">
                                        {video.owner?.avatar ? (
                                            <img
                                                src={video.owner.avatar}
                                                alt={video.owner.username}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {video.owner?.username}
                                        </h3>
                                    </div>
                                </Link>

                                <SubscriptionButton
                                    channel={video.owner}
                                    onSubscriptionChange={(channelId, isSubscribed) => {
                                        success(isSubscribed ? 'Subscribed!' : 'Unsubscribed!');
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                <div className="bg-gray-50 dark:bg-youtube-dark rounded-lg p-4">
                                    <p
                                        className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed ${
                                            showDescription ? '' : 'line-clamp-3'
                                        }`}
                                    >
                                        {video.description}
                                    </p>
                                    {video.description && video.description.length > 200 && (
                                        <button
                                            onClick={() => setShowDescription(!showDescription)}
                                            className="text-youtube-red hover:text-youtube-hover font-medium text-sm mt-2"
                                        >
                                            {showDescription ? 'Show less' : '...more'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comments */}
                        <CommentSection videoId={id} currentUser={user} />
                    </div>

                    {/* Sidebar - Related Videos */}
                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Related Videos
                        </h3>
                        {relatedLoading ? (
                            <LoadingSpinner size="medium" text="" showText={false} className="py-8" />
                        ) : relatedVideos.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                                No related videos found.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {relatedVideos.map((rv) => (
                                    <Link
                                        key={rv._id}
                                        to={`/video/${rv._id}`}
                                        className="flex gap-3 group hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                                    >
                                        <div className="relative shrink-0 w-40 aspect-video rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                                            <img
                                                src={rv.thumbnail}
                                                alt={rv.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                            {rv.duration && (
                                                <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                                                    {formatDuration(rv.duration)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-youtube-red transition-colors">
                                                {rv.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {rv.owner?.username || 'Unknown'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatNumber(rv.views)} views • {timeAgo(rv.createdAt)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoDetail;
