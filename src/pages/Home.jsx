import React, { useState } from 'react';
import VideoList from '../components/video/VideoList.jsx';
import {
    FireIcon,
    MusicalNoteIcon,
    PlayCircleIcon,
    TvIcon,
    NewspaperIcon,
    TrophyIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All', icon: null },
        { id: 'trending', name: 'Trending', icon: FireIcon },
        { id: 'music', name: 'Music', icon: MusicalNoteIcon },
        { id: 'gaming', name: 'Gaming', icon: PlayCircleIcon },
        { id: 'movies', name: 'Movies', icon: TvIcon },
        { id: 'news', name: 'News', icon: NewspaperIcon },
        { id: 'sports', name: 'Sports', icon: TrophyIcon },
        { id: 'education', name: 'Education', icon: AcademicCapIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            {/* Category Filter Bar */}
            <div className="sticky top-14 sm:top-16 z-10 bg-white dark:bg-youtube-dark border-b border-gray-200 dark:border-gray-700 py-2 sm:py-3">
                <div className="flex space-x-2 sm:space-x-3 px-2 sm:px-6 overflow-x-auto scrollbar-hide">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all duration-200 whitespace-nowrap text-xs sm:text-base min-h-[36px] sm:min-h-auto ${selectedCategory === category.id
                                    ? 'bg-youtube-red text-white border-youtube-red shadow-md'
                                    : 'bg-gray-100 dark:bg-youtube-gray text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {IconComponent && (
                                    <IconComponent className="h-3 w-3 sm:h-4 sm:w-4" />
                                )}
                                <span className="font-medium">{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-2 sm:px-6 py-3 sm:py-6">
                {/* Hero Section */}
                <div className="mb-4 sm:mb-8">
                    <div className="bg-gradient-to-r from-youtube-red to-red-600 rounded-lg sm:rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-2">Welcome to MadhuTube</h1>
                            <p className="text-sm sm:text-lg lg:text-xl opacity-90 mb-3 sm:mb-6">Discover amazing videos from creators around the world</p>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <button className="bg-white text-youtube-red px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto min-h-[44px] flex items-center justify-center">
                                    Explore Now
                                </button>
                                <button className="border-2 border-white text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:bg-white hover:text-youtube-red transition-all duration-200 text-sm sm:text-base w-full sm:w-auto min-h-[44px] flex items-center justify-center">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-20 h-20 sm:w-64 sm:h-64 bg-white opacity-10 rounded-full transform translate-x-5 sm:translate-x-20 -translate-y-5 sm:-translate-y-20"></div>
                        <div className="absolute bottom-0 right-5 sm:right-20 w-10 h-10 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full"></div>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-6 space-y-2 sm:space-y-0">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedCategory === 'all' ? 'Recommended for you' : `${categories.find(c => c.id === selectedCategory)?.name} Videos`}
                        </h2>
                        <button className="text-youtube-red hover:text-youtube-hover font-medium transition-colors duration-200 text-sm sm:text-base self-start sm:self-auto">
                            View all
                        </button>
                    </div>

                    <VideoList category={selectedCategory} />
                </div>

                {/* Featured Creators Section */}
                <div className="mt-8 sm:mt-16">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6">Featured Creators</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                        {/* Creator cards will be populated dynamically */}
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                            <div key={index} className="text-center group cursor-pointer p-2">
                                <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-1 sm:mb-3 bg-gray-200 dark:bg-gray-700 rounded-full skeleton"></div>
                                <div className="h-2 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1 skeleton"></div>
                                <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto skeleton"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;