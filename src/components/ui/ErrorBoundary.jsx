import React from 'react';
import {
    ExclamationTriangleIcon,
    ArrowPathIcon,
    HomeIcon
} from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo);
        }

        // In production, you might want to send this to an error reporting service
        // reportError(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            const { fallback: Fallback } = this.props;

            if (Fallback) {
                return <Fallback onRetry={this.handleRetry} error={this.state.error} />;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="bg-white dark:bg-youtube-gray rounded-lg shadow-lg p-8">
                            <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />

                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Oops! Something went wrong
                            </h1>

                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We're sorry, but something unexpected happened. Please try again.
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="mb-6 text-left">
                                    <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                                        Error Details (Development Only)
                                    </summary>
                                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-red-600 dark:text-red-400 overflow-auto max-h-32">
                                        {this.state.error.toString()}
                                        <br />
                                        {this.state.errorInfo.componentStack}
                                    </div>
                                </details>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={this.handleRetry}
                                    className="btn-primary w-full flex items-center justify-center space-x-2"
                                >
                                    <ArrowPathIcon className="h-5 w-5" />
                                    <span>Try Again</span>
                                </button>

                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                                >
                                    <HomeIcon className="h-5 w-5" />
                                    <span>Go Home</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;