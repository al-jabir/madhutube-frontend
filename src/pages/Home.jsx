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
            <div className="sticky top-16 z-10 bg-white dark:bg-youtube-dark border-b border-gray-200 dark:border-gray-700 py-3">
                <div className="flex space-x-3 px-6 overflow-x-auto scrollbar-hide">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all duration-200 whitespace-nowrap ${selectedCategory === category.id
                                        ? 'bg-youtube-red text-white border-youtube-red shadow-md'
                                        : 'bg-gray-100 dark:bg-youtube-gray text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {IconComponent && (
                                    <IconComponent className="h-4 w-4" />
                                )}
                                <span className="font-medium">{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-6">
                {/* Hero Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-youtube-red to-red-600 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold mb-2">Welcome to MadhuTube</h1>
                            <p className="text-xl opacity-90 mb-6">Discover amazing videos from creators around the world</p>
                            <div className="flex space-x-4">
                                <button className="bg-white text-youtube-red px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
                                    Explore Now
                                </button>
                                <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-youtube-red transition-all duration-200">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
                        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                    </div>
                </div>

                {/* Video Grid */}
                <div className="fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedCategory === 'all' ? 'Recommended for you' : `${categories.find(c => c.id === selectedCategory)?.name} Videos`}
                        </h2>
                        <button className="text-youtube-red hover:text-youtube-hover font-medium transition-colors duration-200">
                            View all
                        </button>
                    </div>

                    <VideoList category={selectedCategory} />
                </div>

                {/* Featured Creators Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Creators</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* Creator cards will be populated dynamically */}
                        {[1, 2, 3, 4, 5, 6].map((index) => (
                            <div key={index} className="text-center group cursor-pointer">
                                <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 dark:bg-gray-700 rounded-full skeleton"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 skeleton"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto skeleton"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;