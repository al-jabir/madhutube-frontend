import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoAPI } from '../../services/videoService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
    CloudArrowUpIcon,
    PhotoIcon,
    VideoCameraIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const VideoUpload = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoFile: null,
        thumbnail: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploadStage, setUploadStage] = useState('idle'); // idle, uploading, processing, complete

    const videoInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.videoFile) {
            setError('Please select a video file');
            return;
        }

        if (!formData.thumbnail) {
            setError('Please select a thumbnail image');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            setUploadProgress(0);
            setUploadStage('uploading');

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        setUploadStage('processing');
                        return 90;
                    }
                    return prev + Math.random() * 10;
                });
            }, 500);

            const response = await videoAPI.createVideo(formData);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setUploadStage('complete');

            console.log('Upload response:', response);

            // Handle different response structures
            setTimeout(() => {
                // Dispatch custom event to refresh video lists
                window.dispatchEvent(new CustomEvent('videoUploaded'));

                if (response.data) {
                    // Extract video ID from response
                    const videoId = response.data._id || response.data.data?._id || response.data.id;
                    if (videoId) {
                        navigate(`/video/${videoId}`);
                    } else {
                        // If no video ID, navigate to home to see updated video list
                        navigate('/');
                    }
                } else {
                    // Fallback: navigate to home
                    navigate('/');
                }
            }, 1000);
        } catch (error) {
            clearInterval(progressInterval);
            console.error('Upload error details:', {
                error,
                response: error.response,
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });

            let errorMessage = 'Failed to upload video';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = `Network error: ${error.message}`;
            }

            setError(errorMessage);
            setUploadStage('idle');
            setUploadProgress(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            const file = e.target.files[0];
            if (file) {
                setFormData({
                    ...formData,
                    [e.target.name]: file,
                });

                if (e.target.name === 'videoFile') {
                    const url = URL.createObjectURL(file);
                    setPreviewUrl(url);
                } else if (e.target.name === 'thumbnail') {
                    const url = URL.createObjectURL(file);
                    setThumbnailPreview(url);
                }
            }
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('video/')) {
                setFormData({
                    ...formData,
                    videoFile: file,
                });
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            }
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Video</h1>
                <p className="text-gray-600 dark:text-gray-400">Share your content with the world</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                        <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Video Upload Section */}
                <div className="bg-white dark:bg-youtube-gray rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8">
                    <div className="text-center">
                        {!formData.videoFile ? (
                            <div
                                className={`relative ${dragActive ? 'border-youtube-red bg-red-50 dark:bg-red-900/20' : ''
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Drag and drop your video here
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Or click to browse files
                                </p>
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    className="btn-primary"
                                >
                                    Select Video File
                                </button>
                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    name="videoFile"
                                    accept="video/*"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                                    Supported formats: MP4, AVI, MOV, WMV. Max size: 2GB
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    <div className="text-left">
                                        <p className="font-medium text-green-800 dark:text-green-200">
                                            {formData.videoFile.name}
                                        </p>
                                        <p className="text-sm text-green-600 dark:text-green-400">
                                            {formatFileSize(formData.videoFile.size)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData({ ...formData, videoFile: null });
                                            setPreviewUrl(null);
                                        }}
                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <XCircleIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                {previewUrl && (
                                    <video
                                        src={previewUrl}
                                        controls
                                        className="w-full max-w-md mx-auto rounded-lg"
                                        style={{ maxHeight: '200px' }}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Title and Description */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            maxLength="100"
                            className="input-field"
                            placeholder="Enter video title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formData.title.length}/100 characters
                        </p>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="input-field"
                            placeholder="Tell viewers about your video"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Thumbnail Upload */}
                <div className="bg-white dark:bg-youtube-gray rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <PhotoIcon className="h-5 w-5 mr-2" />
                        Thumbnail *
                    </h3>

                    {!formData.thumbnail ? (
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Upload a custom thumbnail for your video
                            </p>
                            <button
                                type="button"
                                onClick={() => thumbnailInputRef.current?.click()}
                                className="btn-secondary"
                            >
                                Choose Thumbnail
                            </button>
                            <input
                                ref={thumbnailInputRef}
                                type="file"
                                name="thumbnail"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Recommended: 1280x720 pixels, JPG or PNG
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-start space-x-4">
                            <div className="relative">
                                <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    className="w-32 h-18 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, thumbnail: null });
                                        setThumbnailPreview(null);
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <XCircleIcon className="h-4 w-4" />
                                </button>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {formData.thumbnail.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatFileSize(formData.thumbnail.size)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {/* Upload Progress */}
                {isLoading && (
                    <div className="bg-white dark:bg-youtube-gray rounded-lg border border-gray-200 dark:border-gray-600 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {uploadStage === 'uploading' && 'Uploading video...'}
                                {uploadStage === 'processing' && 'Processing video...'}
                                {uploadStage === 'complete' && 'Upload complete!'}
                            </h3>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {Math.round(uploadProgress)}%
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                            <div
                                className="bg-youtube-red h-3 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {uploadStage === 'uploading' && 'Please don\'t close this page while uploading.'}
                            {uploadStage === 'processing' && 'Your video is being processed and will be available shortly.'}
                            {uploadStage === 'complete' && 'Redirecting to your video...'}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn-secondary"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading || !formData.videoFile || !formData.thumbnail}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        <VideoCameraIcon className="h-5 w-5" />
                        <span>{isLoading ? 'Uploading...' : 'Upload Video'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VideoUpload;