import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
        // Update URL with filter parameters
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (filters.sortBy !== 'relevance') params.set('sort', filters.sortBy);
        if (filters.uploadDate !== 'any') params.set('upload_date', filters.uploadDate);
        if (filters.duration !== 'any') params.set('duration', filters.duration);
        if (filters.type !== 'all') params.set('type', filters.type);

        navigate(`/search?${params.toString()}`, { replace: true });
    }, [filters, query, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Search results for "{query}"
                        </h1>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn-secondary flex items-center space-x-2"
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
                                    className="input-field"
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
                                    className="input-field"
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
                                    className="input-field"
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
                                    className="input-field"
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
                                onClick={() => {
                                    clearFilters();
                                }}
                                className="text-sm text-youtube-red hover:text-youtube-hover"
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
                            <EyeIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
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
                            // In a real app, this would pass search parameters to the API
                            apiCall={null}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;