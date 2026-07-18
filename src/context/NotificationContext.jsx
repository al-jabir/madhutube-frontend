import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const duration = notification.duration || 4000;
    const autoHide = notification.autoHide !== false;

    const config = {
        success: {
            icon: CheckCircleIcon,
            ring: 'ring-green-400/20',
            iconColor: 'text-green-500',
            bar: 'bg-green-500',
        },
        error: {
            icon: XCircleIcon,
            ring: 'ring-red-400/20',
            iconColor: 'text-red-500',
            bar: 'bg-red-500',
        },
        warning: {
            icon: ExclamationTriangleIcon,
            ring: 'ring-yellow-400/20',
            iconColor: 'text-yellow-500',
            bar: 'bg-yellow-500',
        },
        info: {
            icon: InformationCircleIcon,
            ring: 'ring-blue-400/20',
            iconColor: 'text-blue-500',
            bar: 'bg-blue-500',
        },
    };

    const c = config[notification.type] || config.info;
    const IconComponent = c.icon;

    const dismiss = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(notification.id), 300);
    };

    useEffect(() => {
        if (!autoHide) return;
        const interval = 50;
        const step = (interval / duration) * 100;
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    dismiss();
                    return 0;
                }
                return prev - step;
            });
        }, interval);
        return () => clearInterval(timer);
    }, [duration, autoHide]);

    return (
        <div
            className={`
                flex items-start gap-3 w-80 p-4 rounded-xl
                bg-white dark:bg-youtube-gray
                border border-gray-200 dark:border-gray-700
                shadow-lg shadow-black/10 dark:shadow-black/30
                ring-1 ${c.ring}
                transition-all duration-300 ease-out
                ${isExiting
                    ? 'opacity-0 translate-x-full scale-95'
                    : 'opacity-100 translate-x-0 scale-100'
                }
            `}
        >
            <IconComponent className={`h-5 w-5 ${c.iconColor} shrink-0 mt-0.5`} />

            <div className="flex-1 min-w-0">
                {notification.title && (
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                    </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-snug">
                    {notification.message}
                </p>
                {notification.action && (
                    <button
                        onClick={() => {
                            notification.action.onClick();
                            dismiss();
                        }}
                        className="mt-2 text-sm font-semibold text-youtube-red hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    >
                        {notification.action.label}
                    </button>
                )}
            </div>

            <button
                onClick={dismiss}
                className="shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <XMarkIcon className="h-4 w-4" />
            </button>

            {autoHide && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                        className={`h-full ${c.bar} rounded-full transition-none`}
                        style={{ width: `${progress}%`, opacity: 0.6 }}
                    />
                </div>
            )}
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
            ...notification,
        };

        setNotifications((prev) => {
            // keep max 5 toasts
            const next = prev.length >= 5 ? prev.slice(1) : prev;
            return [...next, newNotification];
        });
        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const success = useCallback(
        (message, options = {}) => addNotification({ ...options, message, type: 'success' }),
        [addNotification]
    );

    const error = useCallback(
        (message, options = {}) =>
            addNotification({ ...options, message, type: 'error', autoHide: false }),
        [addNotification]
    );

    const warning = useCallback(
        (message, options = {}) => addNotification({ ...options, message, type: 'warning' }),
        [addNotification]
    );

    const info = useCallback(
        (message, options = {}) => addNotification({ ...options, message, type: 'info' }),
        [addNotification]
    );

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, removeNotification, clearAll, success, error, warning, info }}
        >
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {notifications.map((n) => (
                    <div key={n.id} className="pointer-events-auto relative">
                        <NotificationItem notification={n} onRemove={removeNotification} />
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
