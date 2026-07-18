import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { videoAPI } from '../services/videoService.js';
import VideoList from '../components/video/VideoList.jsx';
import {
    FunnelIcon,
    EyeIcon,
    CalendarIcon,
    ClockIcon,
    VideoCameraIcon
} from '@heroicons/react/24/outline';

const Search = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        sortBy: 'relevance',
        uploadDate: 'any',
        duration: 'any',
        type: 'all'
    });

    const sortOptions = [
        { value: 'relevance', label: 'Relevance' },
        { value: 'upload_date', label: 'Upload date' },
        { value: 'view_count', label: 'View count' },
        { value: 'rating', label: 'Rating' }
    ];

    const uploadDateOptions = [
        { value: 'any', label: 'Any time' },
        { value: 'hour', label: 'Last hour' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This week' },
        { value: 'month', label: 'This month' },
        { value: 'year', label: 'This year' }
    ];

    const durationOptions = [
        { value: 'any', label: 'Any duration' },
        { value: 'short', label: 'Under 4 minutes' },
        { value: 'medium', label: '4-20 minutes' },
        { value: 'long', label: 'Over 20 minutes' }
    ];

    const typeOptions = [
        { value: 'all', label: 'All' },
        { value: 'video', label: 'Video' },
        { value: 'channel', label: 'Channel' },
        { value: 'playlist', label: 'Playlist' }
    ];

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            sortBy: 'relevance',
            uploadDate: 'any',
            duration: 'any',
            type: 'all'
        });
    };

    useEffect(() => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
        if (filters.uploadDate !== 'any') params.set('upload_date', filters.uploadDate);
        if (filters.duration !== 'any') params.set('duration', filters.duration);
        if (filters.type !== 'all') params.set('type', filters.type);

        navigate(`/search?${params.toString()}`, { replace: true });
    }, [filters, query, navigate]);

    const fetchSearchResults = useCallback(async () => {
        const params = {};
        if (query) params.query = query;
        return videoAPI.getAllVideos(params);
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {query ? (
                                <>Results for "<span className="text-youtube-red">{query}</span>"</>
                            ) : (
                                'All Videos'
                            )}
                        </h1>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-youtube-gray text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                            <FunnelIcon className="h-5 w-5" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="bg-white dark:bg-youtube-gray rounded-lg border border-gray-200 dark:border-gray-600 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sort by
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-youtube-red focus:border-transparent outline-none"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Upload Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    Upload date
                                </label>
                                <select
                                    value={filters.uploadDate}
                                    onChange={(e) => handleFilterChange('uploadDate', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-youtube-red focus:border-transparent outline-none"
                                >
                                    {uploadDateOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    Duration
                                </label>
                                <select
                                    value={filters.duration}
                                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-youtube-red focus:border-transparent outline-none"
                                >
                                    {durationOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                    <VideoCameraIcon className="h-4 w-4 mr-1" />
                                    Type
                                </label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-youtube-red focus:border-transparent outline-none"
                                >
                                    {typeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-youtube-red hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors duration-200"
                            >
                                Clear all filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div className="space-y-6">
                    {!query ? (
                        <div className="text-center py-12">
                            <EyeIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Start searching
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enter a search term to find videos, channels, and playlists
                            </p>
                        </div>
                    ) : (
                        <VideoList
                            title={null}
                            emptyMessage={`No results found for "${query}"`}
                            apiCall={fetchSearchResults}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
