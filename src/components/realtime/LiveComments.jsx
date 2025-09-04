import React, { useState } from 'react';
import { useRealTime } from '../../context/RealTimeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    ChatBubbleLeftIcon,
    UserCircleIcon,
    PaperAirplaneIcon
} from '@heroicons/react/24/outline';

const LiveComments = ({ videoId }) => {
    const { user } = useAuth();
    const { sendLiveComment, joinVideoRoom, leaveVideoRoom } = useRealTime();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    React.useEffect(() => {
        joinVideoRoom(videoId);

        // Mock some initial comments
        setComments([
            {
                _id: '1',
                text: 'Great tutorial! Really helpful.',
                user: {
                    username: 'viewer1',
                    avatar: 'https://via.placeholder.com/32x32?text=V1'
                },
                timestamp: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
            },
            {
                _id: '2',
                text: 'Can you make a video about TypeScript next?',
                user: {
                    username: 'coder_dev',
                    avatar: 'https://via.placeholder.com/32x32?text=CD'
                },
                timestamp: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
            }
        ]);

        return () => {
            leaveVideoRoom(videoId);
        };
    }, [videoId, joinVideoRoom, leaveVideoRoom]);

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        const comment = {
            _id: Date.now().toString(),
            text: newComment,
            user: {
                username: user.username,
                avatar: user.avatar || 'https://via.placeholder.com/32x32?text=' + user.username[0].toUpperCase()
            },
            timestamp: new Date()
        };

        setComments(prev => [...prev, comment]);
        sendLiveComment(videoId, comment);
        setNewComment('');
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(timestamp)) / 1000);

        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 bg-youtube-red hover:bg-youtube-hover text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
            >
                <ChatBubbleLeftIcon className="h-6 w-6" />
                {comments.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-youtube-red text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                        {comments.length}
                    </span>
                )}
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-youtube-gray rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>Live Chat</span>
                </h3>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    ×
                </button>
            </div>

            {/* Comments List */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
                {comments.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <ChatBubbleLeftIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No comments yet. Start the conversation!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex space-x-2">
                            <img
                                src={comment.user.avatar}
                                alt={comment.user.username}
                                className="w-8 h-8 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                        {comment.user.username}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatTime(comment.timestamp)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                                    {comment.text}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Comment Input */}
            {user ? (
                <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-2">
                        <img
                            src={user.avatar || 'https://via.placeholder.com/32x32?text=' + user.username[0].toUpperCase()}
                            alt={user.username}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 flex space-x-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-youtube-red"
                                maxLength={500}
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="p-2 bg-youtube-red hover:bg-youtube-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200"
                            >
                                <PaperAirplaneIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="p-4 border-t border-gray-200 dark:border-gray-600 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Sign in to join the conversation
                    </p>
                </div>
            )}
        </div>
    );
};

export default LiveComments;