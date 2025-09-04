import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import {
    MagnifyingGlassIcon,
    Bars3Icon,
    UserCircleIcon,
    VideoCameraIcon,
    BellIcon
} from '@heroicons/react/24/outline';

const Header = ({ onMenuToggle }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 header-glass border-b border-gray-200 dark:border-gray-700 z-50">
            <div className="flex items-center justify-between px-4 py-3">
                {/* Left section */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuToggle}
                        className="btn-icon"
                        aria-label="Toggle menu"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="text-youtube-red font-bold text-2xl group-hover:scale-105 transition-transform duration-200">
                            MadhuTube
                        </div>
                    </Link>
                </div>

                {/* Center section - Search */}
                <div className="flex-1 max-w-2xl mx-4">
                    <form onSubmit={handleSearch} className="flex">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
                            aria-label="Search"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                    </form>
                </div>

                {/* Right section */}
                <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/upload"
                                className="btn-icon group"
                                title="Create"
                            >
                                <VideoCameraIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                            </Link>
                            <button className="btn-icon group relative">
                                <BellIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                                {/* Notification badge */}
                                <span className="absolute top-1 right-1 w-2 h-2 bg-youtube-red rounded-full"></span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                >
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="h-8 w-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                        />
                                    ) : (
                                        <UserCircleIcon className="h-8 w-8" />
                                    )}
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-youtube-gray rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 slide-up">
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
                                        </div>
                                        <Link
                                            to={`/channel/${user?.username}`}
                                            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <UserCircleIcon className="h-5 w-5 mr-3" />
                                            Your channel
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </Link>
                                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-red-600 dark:text-red-400"
                                        >
                                            <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="btn-primary flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
                        >
                            <UserCircleIcon className="h-5 w-5" />
                            <span>Sign in</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;