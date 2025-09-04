import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
    UserCircleIcon,
    PencilIcon,
    CameraIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckIcon,
    XMarkIcon,
    PhotoIcon,
    UserIcon,
    EnvelopeIcon,
    KeyIcon,
    BellIcon,
    ShieldCheckIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        username: user?.username || '',
        email: user?.email || '',
        bio: user?.bio || '',
        location: user?.location || '',
        website: user?.website || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const tabs = [
        { id: 'general', name: 'General', icon: UserIcon },
        { id: 'account', name: 'Account & Privacy', icon: ShieldCheckIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'privacy', name: 'Privacy', icon: EyeIcon },
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        // API call to update user profile
        updateUser(formData);
        setEditMode(false);
    };

    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || '',
            username: user?.username || '',
            email: user?.email || '',
            bio: user?.bio || '',
            location: user?.location || '',
            website: user?.website || '',
        });
        setEditMode(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Handle avatar upload
            console.log('Avatar file:', file);
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Handle cover image upload
            console.log('Cover file:', file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            {/* Profile Header */}
            <div className="relative">
                {/* Cover Image */}
                <div className="h-48 lg:h-64 bg-gradient-to-r from-youtube-red to-red-600 relative overflow-hidden">
                    {user?.coverImage ? (
                        <img
                            src={user.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-youtube-red to-red-600"></div>
                    )}

                    {/* Cover Image Upload Button */}
                    <button className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200">
                        <label htmlFor="cover-upload" className="cursor-pointer flex items-center space-x-2">
                            <CameraIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Change Cover</span>
                        </label>
                        <input
                            id="cover-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverChange}
                        />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="relative px-6 pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:space-x-6 -mt-20 lg:-mt-16">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white dark:border-youtube-dark bg-white dark:bg-youtube-dark overflow-hidden">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <UserCircleIcon className="h-20 w-20 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Avatar Upload Button */}
                            <button className="absolute bottom-2 right-2 bg-youtube-red hover:bg-youtube-hover text-white p-2 rounded-full shadow-lg transition-all duration-200">
                                <label htmlFor="avatar-upload" className="cursor-pointer">
                                    <CameraIcon className="h-4 w-4" />
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 mt-4 lg:mt-0">
                            <div className="bg-white dark:bg-youtube-gray rounded-lg p-6 shadow-sm">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                            {user?.fullName}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">@{user?.username}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                            Member since {
                                                new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long'
                                                })
                                            }
                                        </p>
                                    </div>

                                    {!editMode && (
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="btn-secondary flex items-center space-x-2"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                            <span>Edit Profile</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
                        <nav className="flex space-x-8">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                                ? 'border-youtube-red text-youtube-red'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                        <span>{tab.name}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white dark:bg-youtube-gray rounded-lg shadow-sm">
                        {activeTab === 'general' && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    General Information
                                </h2>

                                <div className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Full Name
                                            </label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    className="input-field"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white py-2">{user?.fullName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Username
                                            </label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className="input-field"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white py-2">@{user?.username}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email
                                            </label>
                                            {editMode ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="input-field"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white py-2">{user?.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Location
                                            </label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    className="input-field"
                                                    placeholder="Your location"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white py-2">{formData.location || 'Not specified'}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Bio
                                        </label>
                                        {editMode ? (
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="input-field"
                                                placeholder="Tell us about yourself..."
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white py-2">{formData.bio || 'No bio added yet.'}</p>
                                        )}
                                    </div>

                                    {/* Website */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Website
                                        </label>
                                        {editMode ? (
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white py-2">
                                                {formData.website ? (
                                                    <a
                                                        href={formData.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-youtube-red hover:text-youtube-hover"
                                                    >
                                                        {formData.website}
                                                    </a>
                                                ) : (
                                                    'No website added'
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    {editMode && (
                                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                            <button
                                                onClick={handleCancel}
                                                className="btn-secondary flex items-center space-x-2"
                                            >
                                                <XMarkIcon className="h-4 w-4" />
                                                <span>Cancel</span>
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="btn-primary flex items-center space-x-2"
                                            >
                                                <CheckIcon className="h-4 w-4" />
                                                <span>Save Changes</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    Account & Privacy
                                </h2>

                                <div className="space-y-8">
                                    {/* Change Password */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                            Change Password
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        className="input-field pr-10"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showPassword ? (
                                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        className="input-field"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        className="input-field"
                                                    />
                                                </div>
                                            </div>

                                            <button className="btn-primary">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>

                                    {/* Account Security */}
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-8">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                            Account Security
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-youtube-dark rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                                                </div>
                                                <button className="btn-secondary">Enable</button>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-youtube-dark rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">Login Sessions</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage your active login sessions</p>
                                                </div>
                                                <button className="btn-secondary">Manage</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    Notification Preferences
                                </h2>

                                <div className="space-y-6">
                                    {[
                                        { title: 'New Subscribers', description: 'Get notified when someone subscribes to your channel' },
                                        { title: 'Video Comments', description: 'Receive notifications for new comments on your videos' },
                                        { title: 'Video Likes', description: 'Get notified when someone likes your videos' },
                                        { title: 'New Videos from Subscriptions', description: 'Be alerted when channels you follow upload new content' },
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-youtube-dark rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-youtube-red/25 dark:peer-focus:ring-youtube-red/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-youtube-red"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'privacy' && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                    Privacy Settings
                                </h2>

                                <div className="space-y-6">
                                    {[
                                        { icon: EyeIcon, title: 'Profile Visibility', description: 'Control who can see your profile information' },
                                        { icon: EnvelopeIcon, title: 'Email Privacy', description: 'Choose who can contact you via email' },
                                        { icon: UserIcon, title: 'Activity Status', description: 'Show when you\'re online or last active' },
                                        { icon: PhotoIcon, title: 'Video Privacy', description: 'Default privacy setting for new videos' },
                                    ].map((item, index) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-youtube-dark rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <IconComponent className="h-5 w-5 text-gray-400" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-youtube-red/25 dark:peer-focus:ring-youtube-red/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-youtube-red"></div>
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;