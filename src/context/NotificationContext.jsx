import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

const NotificationItem = ({ notification, onRemove }) => {
    const icons = {
        success: CheckCircleIcon,
        error: XCircleIcon,
        warning: ExclamationTriangleIcon,
        info: InformationCircleIcon
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
        error: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
        warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
        info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
    };

    const textColors = {
        success: 'text-green-800 dark:text-green-400',
        error: 'text-red-800 dark:text-red-400',
        warning: 'text-yellow-800 dark:text-yellow-400',
        info: 'text-blue-800 dark:text-blue-400'
    };

    const IconComponent = icons[notification.type];

    React.useEffect(() => {
        if (notification.autoHide !== false) {
            const timer = setTimeout(() => {
                onRemove(notification.id);
            }, notification.duration || 5000);

            return () => clearTimeout(timer);
        }
    }, [notification, onRemove]);

    return (
        <div
            className={`${bgColors[notification.type]} ${textColors[notification.type]} border rounded-lg p-4 shadow-lg max-w-md w-full transition-all duration-300 transform translate-x-0 opacity-100 animate-fade-in-up`}
        >
            <div className="flex items-start">
                <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="ml-3 flex-1">
                    {notification.title && (
                        <h4 className="font-medium mb-1">{notification.title}</h4>
                    )}
                    <p className="text-sm">{notification.message}</p>
                    {notification.action && (
                        <div className="mt-2">
                            <button
                                onClick={notification.action.onClick}
                                className="text-sm font-medium underline hover:no-underline"
                            >
                                {notification.action.label}
                            </button>
                        </div>
                    )}
                </div>
                <button
                    onClick={() => onRemove(notification.id)}
                    className="ml-4 flex-shrink-0 hover:opacity-70 transition-opacity duration-200"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: 'info',
            autoHide: true,
            duration: 5000,
            ...notification
        };

        setNotifications(prev => [...prev, newNotification]);
        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    // Convenience methods
    const success = useCallback((message, options = {}) => {
        return addNotification({ ...options, message, type: 'success' });
    }, [addNotification]);

    const error = useCallback((message, options = {}) => {
        return addNotification({ ...options, message, type: 'error', autoHide: false });
    }, [addNotification]);

    const warning = useCallback((message, options = {}) => {
        return addNotification({ ...options, message, type: 'warning' });
    }, [addNotification]);

    const info = useCallback((message, options = {}) => {
        return addNotification({ ...options, message, type: 'info' });
    }, [addNotification]);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        success,
        error,
        warning,
        info
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}

            {/* Notification Portal */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRemove={removeNotification}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;