import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
    EnvelopeIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

const ForgotPasswordForm = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { resetPassword } = useAuth();
    const { success, error } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            error('Please enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            await resetPassword(email);
            setEmailSent(true);
            success('Password reset email sent! Check your inbox.');
        } catch (err) {
            error(err.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-youtube-gray rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <EnvelopeIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Check Your Email
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <button
                                onClick={onBackToLogin}
                                className="btn-secondary w-full flex items-center justify-center space-x-2"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                <span>Back to Login</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-youtube-gray rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Forgot Password?
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Sending...</span>
                                </div>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onBackToLogin}
                            className="btn-secondary w-full flex items-center justify-center space-x-2"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            <span>Back to Login</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;