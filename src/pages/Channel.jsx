import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { subscriptionAPI } from '../services/subscriptionService.js';
import { videoAPI } from '../services/videoService.js';
import VideoList from '../components/video/VideoList.jsx';
import SubscriptionButton from '../components/subscription/SubscriptionButton.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import {
  UserCircleIcon,
  PlayIcon,
  EyeIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { getAvatar } from '../services/assetService.js';

const Channel = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [channelVideos, setChannelVideos] = useState([]);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [videoCount, setVideoCount] = useState(0);

  const tabs = [
    { id: 'videos', name: 'Videos', icon: PlayIcon },
    { id: 'playlists', name: 'Playlists', icon: PlayIcon },
    { id: 'about', name: 'About', icon: UserCircleIcon }
  ];

  useEffect(() => {
    if (username) {
      loadChannelData();
    }
  }, [username]);

  const loadChannelData = async () => {
    try {
      setLoading(true);

      // Mock channel data for now - in real app would fetch from API
      const mockChannel = {
        _id: 'channel-' + username,
        username: username,
        fullName: username.charAt(0).toUpperCase() + username.slice(1) + ' Channel',
        email: `${username}@example.com`,
        avatar: getAvatar('avatar-1'),
        coverImage: 'https://via.placeholder.com/1200x300/FF0000/FFFFFF?text=Channel+Cover',
        description: `Welcome to ${username}'s channel! Here you'll find amazing content about technology, tutorials, and much more. Subscribe to stay updated with the latest videos.`,
        subscribersCount: Math.floor(Math.random() * 100000) + 1000,
        videosCount: Math.floor(Math.random() * 50) + 10,
        viewsCount: Math.floor(Math.random() * 1000000) + 50000,
        joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        isVerified: Math.random() > 0.5,
        location: 'Creator Studio',
        website: `https://${username}.com`
      };

      setChannel(mockChannel);
      setSubscriptionCount(mockChannel.subscribersCount);
      setVideoCount(mockChannel.videosCount);

      // Check if current user is subscribed (if authenticated)
      if (user && user.username !== username) {
        // Mock subscription status
        setIsSubscribed(Math.random() > 0.5);
      }

    } catch (err) {
      console.error('Error loading channel:', err);
      error('Failed to load channel data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionChange = (channelId, subscribed) => {
    setIsSubscribed(subscribed);
    setSubscriptionCount(prev => subscribed ? prev + 1 : prev - 1);
    success(subscribed ? 'Subscribed successfully!' : 'Unsubscribed successfully!');
  };

  const formatNumber = (num) => {
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <p className="text-gray-600 dark:text-gray-400">The channel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
      {/* Cover Image */}
      <div className="relative h-32 sm:h-48 lg:h-64 w-full overflow-hidden">
        <img
          src={channel.coverImage}
          alt={`${channel.fullName} cover`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x300/374151/FFFFFF?text=Channel+Cover';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Channel Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 lg:-mt-24 relative z-10">
        <div className="bg-white dark:bg-youtube-gray rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={channel.avatar}
                alt={channel.fullName}
                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white dark:border-youtube-gray object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/128x128/6B7280/FFFFFF?text=Avatar';
                }}
              />
              {channel.isVerified && (
                <CheckBadgeIcon className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-8 sm:w-8 text-blue-500 bg-white dark:bg-youtube-gray rounded-full" />
              )}
            </div>

            {/* Channel Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{channel.fullName}</span>
                    {channel.isVerified && (
                      <CheckBadgeIcon className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" />
                    )}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                    @{channel.username}
                  </p>
                  <div className="flex flex-wrap items-center space-x-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatNumber(subscriptionCount)} subscribers</span>
                    <span>•</span>
                    <span>{formatNumber(videoCount)} videos</span>
                    <span>•</span>
                    <span>{formatNumber(channel.viewsCount)} views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {user && user.username === username ? (
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                    >
                      <Cog6ToothIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Manage channel</span>
                      <span className="sm:hidden">Manage</span>
                    </Link>
                  ) : (
                    <SubscriptionButton
                      channel={channel}
                      onSubscriptionChange={handleSubscriptionChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                      ? 'border-youtube-red text-youtube-red'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'videos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Videos</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatNumber(videoCount)} videos
              </span>
            </div>
            <VideoList
              title={null}
              emptyMessage={`${channel.fullName} hasn't uploaded any videos yet.`}
              // Mock empty for now - in real app would pass channel videos API call
              apiCall={null}
            />
          </div>
        )}

        {activeTab === 'playlists' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Playlists</h2>
            </div>
            <div className="text-center py-12">
              <PlayIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No playlists yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {channel.fullName} hasn't created any playlists yet.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <div className="bg-white dark:bg-youtube-gray rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">About</h2>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {channel.description}
                </p>
              </div>

              {/* Channel Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <EyeIcon className="h-8 w-8 text-youtube-red mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(channel.viewsCount)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total views</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <UserCircleIcon className="h-8 w-8 text-youtube-red mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(subscriptionCount)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Subscribers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <PlayIcon className="h-8 w-8 text-youtube-red mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(videoCount)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Videos</div>
                </div>
              </div>

              {/* Channel Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">Joined</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatDate(channel.joinedDate)}
                    </span>
                  </div>
                  {channel.location && (
                    <div className="flex items-center space-x-3 text-sm">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">Location</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {channel.location}
                      </span>
                    </div>
                  )}
                  {channel.website && (
                    <div className="flex items-center space-x-3 text-sm">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-400">Website</span>
                      <a
                        href={channel.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-youtube-red hover:text-youtube-hover font-medium transition-colors duration-200"
                      >
                        {channel.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;