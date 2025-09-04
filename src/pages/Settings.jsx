import React, { useState } from 'react';
import {
    CogIcon,
    BellIcon,
    ShieldCheckIcon,
    ComputerDesktopIcon,
    ArrowDownTrayIcon,
    TrashIcon,
    MoonIcon,
    SunIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
    const [settings, setSettings] = useState({
        theme: 'system',
        language: 'en',
        autoplay: true,
        notifications: true,
        emailUpdates: true,
        dataCollection: false,
        autoQuality: true,
        closedCaptions: false,
        keyboardShortcuts: true,
        restrictedMode: false,
        location: 'auto',
        downloadQuality: 'high'
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const settingsCategories = [
        {
            id: 'appearance',
            title: 'Appearance',
            icon: CogIcon,
            settings: [
                {
                    key: 'theme',
                    label: 'Theme',
                    description: 'Choose your preferred color theme',
                    type: 'select',
                    options: [
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'system', label: 'System Default' }
                    ]
                },
                {
                    key: 'language',
                    label: 'Language',
                    description: 'Select your preferred language',
                    type: 'select',
                    options: [
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Español' },
                        { value: 'fr', label: 'Français' },
                        { value: 'de', label: 'Deutsch' }
                    ]
                },
                {
                    key: 'location',
                    label: 'Location',
                    description: 'Set your location for personalized content',
                    type: 'select',
                    options: [
                        { value: 'auto', label: 'Auto-detect' },
                        { value: 'us', label: 'United States' },
                        { value: 'ca', label: 'Canada' },
                        { value: 'uk', label: 'United Kingdom' },
                        { value: 'de', label: 'Germany' },
                        { value: 'fr', label: 'France' }
                    ]
                }
            ]
        },
        {
            id: 'general',
            title: 'General',
            icon: CogIcon,
            settings: [
                {
                    key: 'autoplay',
                    label: 'Autoplay',
                    description: 'Automatically play the next video',
                    type: 'toggle'
                },
                {
                    key: 'autoQuality',
                    label: 'Auto Quality',
                    description: 'Automatically adjust video quality based on connection',
                    type: 'toggle'
                },
                {
                    key: 'closedCaptions',
                    label: 'Closed Captions',
                    description: 'Show subtitles when available',
                    type: 'toggle'
                },
                {
                    key: 'keyboardShortcuts',
                    label: 'Keyboard Shortcuts',
                    description: 'Enable keyboard shortcuts for video control',
                    type: 'toggle'
                }
            ]
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: BellIcon,
            settings: [
                {
                    key: 'notifications',
                    label: 'Push Notifications',
                    description: 'Receive notifications about new videos and updates',
                    type: 'toggle'
                },
                {
                    key: 'emailUpdates',
                    label: 'Email Updates',
                    description: 'Get email notifications for important updates',
                    type: 'toggle'
                }
            ]
        },
        {
            id: 'privacy',
            title: 'Privacy & Data',
            icon: ShieldCheckIcon,
            settings: [
                {
                    key: 'dataCollection',
                    label: 'Data Collection',
                    description: 'Allow collection of usage data to improve the service',
                    type: 'toggle'
                },
                {
                    key: 'restrictedMode',
                    label: 'Restricted Mode',
                    description: 'Hide potentially mature content',
                    type: 'toggle'
                }
            ]
        },
        {
            id: 'downloads',
            title: 'Downloads',
            icon: ArrowDownTrayIcon,
            settings: [
                {
                    key: 'downloadQuality',
                    label: 'Download Quality',
                    description: 'Default quality for downloaded videos',
                    type: 'select',
                    options: [
                        { value: 'low', label: 'Low (360p)' },
                        { value: 'medium', label: 'Medium (720p)' },
                        { value: 'high', label: 'High (1080p)' },
                        { value: 'highest', label: 'Highest Available' }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account preferences and application settings
                    </p>
                </div>

                {/* Settings Categories */}
                <div className="space-y-8">
                    {settingsCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <div key={category.id} className="bg-white dark:bg-youtube-gray rounded-lg shadow-sm">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center space-x-3">
                                        <IconComponent className="h-6 w-6 text-youtube-red" />
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {category.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {category.settings.map((setting) => (
                                        <div key={setting.key} className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {setting.label}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {setting.description}
                                                </p>
                                            </div>

                                            <div className="ml-4">
                                                {setting.type === 'toggle' ? (
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={settings[setting.key]}
                                                            onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-youtube-red/25 dark:peer-focus:ring-youtube-red/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-youtube-red"></div>
                                                    </label>
                                                ) : (
                                                    <select
                                                        value={settings[setting.key]}
                                                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                                                        className="input-field w-48"
                                                    >
                                                        {setting.options.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Data Management Section */}
                    <div className="bg-white dark:bg-youtube-gray rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center space-x-3">
                                <ComputerDesktopIcon className="h-6 w-6 text-youtube-red" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Data Management
                                </h2>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-youtube-dark rounded-lg">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Export Data</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Download a copy of your data
                                    </p>
                                </div>
                                <button
                                    onClick={() => console.log('Export data')}
                                    className="btn-secondary flex items-center space-x-2"
                                >
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                    <span>Export</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                <div>
                                    <h3 className="font-medium text-red-900 dark:text-red-400">Clear All Data</h3>
                                    <p className="text-sm text-red-700 dark:text-red-500">
                                        Permanently delete all your data. This action cannot be undone.
                                    </p>
                                </div>
                                <button
                                    onClick={() => console.log('Clear data - would show confirmation dialog')}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span>Clear Data</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white dark:bg-youtube-gray rounded-lg shadow-sm">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                About MadhuTube
                            </h2>

                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>Version:</span>
                                    <span className="font-medium">1.0.0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Last Updated:</span>
                                    <span className="font-medium">December 2024</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Build:</span>
                                    <span className="font-medium">Production</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex space-x-4 text-sm">
                                    <a href="#" className="text-youtube-red hover:text-youtube-hover">
                                        Privacy Policy
                                    </a>
                                    <a href="#" className="text-youtube-red hover:text-youtube-hover">
                                        Terms of Service
                                    </a>
                                    <a href="#" className="text-youtube-red hover:text-youtube-hover">
                                        Help & Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;