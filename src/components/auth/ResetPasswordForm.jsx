import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
    LockClosedIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const { resetPasswordConfirm, verifyResetToken } = useAuth();
    const { success, error } = useNotification();

    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            verifyToken();
        } else {
            setTokenValid(false);
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            await verifyResetToken(token);
            setTokenValid(true);
        } catch (err) {
            setTokenValid(false);
            error('Invalid or expired reset token');
        }
    };

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
        };
    };

    const passwordValidation = validatePassword(formData.password);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordValidation.isValid) {
            error('Please ensure your password meets all requirements');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            error('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            await resetPasswordConfirm(token, formData.password);
            success('Password reset successfully!');
            navigate('/login');
        } catch (err) {
            error(err.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (tokenValid === null) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-youtube-red"></div>
            </div>
        );
    }

    if (tokenValid === false) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-youtube-dark flex items-center justify-center px-4">
                <div className="max-w-md w-full">
                    <div className="bg-white dark:bg-youtube-gray rounded-lg shadow-lg p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Invalid Reset Link
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            This password reset link is invalid or has expired.
                        </p>
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="btn-primary w-full"
                        >
                            Request New Reset Link
                        </button>
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
                            Reset Password
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Enter your new password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Enter new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Password Requirements */}
                            <div className="mt-2 space-y-1">
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <CheckCircleIcon className={`h-3 w-3 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span>At least 8 characters</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <CheckCircleIcon className={`h-3 w-3 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span>One uppercase letter</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <CheckCircleIcon className={`h-3 w-3 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span>One lowercase letter</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <CheckCircleIcon className={`h-3 w-3 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span>One number</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <CheckCircleIcon className={`h-3 w-3 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`} />
                                    <span>One special character</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="input-field pl-10 pr-10"
                                    placeholder="Confirm new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    {showConfirmPassword ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !passwordValidation.isValid || formData.password !== formData.confirmPassword}
                            className="btn-primary w-full"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Resetting...</span>
                                </div>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;