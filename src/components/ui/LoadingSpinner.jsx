import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const LoadingSpinner = ({
    size = 'medium',
    text = 'Loading...',
    showText = true,
    className = ''
}) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12',
        xlarge: 'h-16 w-16'
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-youtube-red ${sizeClasses[size]}`}></div>
            {showText && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {text}
                </p>
            )}
        </div>
    );
};

export const LoadingPage = ({ text = 'Loading page...' }) => (
    <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center">
        <LoadingSpinner size="large" text={text} />
    </div>
);

export const LoadingButton = ({
    isLoading,
    children,
    loadingText = 'Loading...',
    ...props
}) => (
    <button
        {...props}
        disabled={isLoading || props.disabled}
        className={`${props.className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {isLoading ? (
            <div className="flex items-center space-x-2">
                <LoadingSpinner size="small" showText={false} />
                <span>{loadingText}</span>
            </div>
        ) : (
            children
        )}
    </button>
);

export const LoadingCard = () => (
    <div className="bg-white dark:bg-youtube-gray rounded-lg p-6 shadow-sm animate-pulse">
        <div className="aspect-video bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
    </div>
);

export const LoadingGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }, (_, i) => (
            <LoadingCard key={i} />
        ))}
    </div>
);

export default LoadingSpinner;