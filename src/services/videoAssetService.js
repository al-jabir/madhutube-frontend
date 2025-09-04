// Video asset management service
// This service will handle video file imports and management

// Note: Video files are typically large and should be handled differently than images
// For production, consider using:
// 1. Video streaming services (like AWS S3 + CloudFront)
// 2. Video processing APIs (like Cloudinary, Mux)
// 3. Progressive loading and adaptive bitrate streaming

// Sample video imports (when you have actual video files)
// import sampleVideo1 from '../assets/videos/sample-video-1.mp4';
// import sampleVideo2 from '../assets/videos/sample-video-2.mp4';

// For now, using placeholder URLs
const videos = {
    'sample-video-1': '/api/placeholder-video-1', // This would be actual video URLs
    'sample-video-2': '/api/placeholder-video-2',
    'sample-video-3': '/api/placeholder-video-3',
};

// Helper function to get video URL by key
export const getVideoUrl = (key) => {
    return videos[key] || null;
};

// Helper function to check if video exists
export const hasVideo = (key) => {
    return key in videos;
};

// Helper function to add new video
export const addVideo = (key, url) => {
    videos[key] = url;
};

// Helper function to get all available videos
export const getAllVideos = () => {
    return Object.keys(videos);
};

// Video file type validation
export const isValidVideoType = (file) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
    return validTypes.includes(file.type);
};

// Video file size validation (in bytes)
export const isValidVideoSize = (file, maxSizeMB = 100) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

// Video upload handler (placeholder - you'll need to implement actual upload logic)
export const uploadVideo = async (file, onProgress = null) => {
    if (!isValidVideoType(file)) {
        throw new Error('Invalid video file type');
    }

    if (!isValidVideoSize(file)) {
        throw new Error('Video file too large');
    }

    // Simulate upload progress
    return new Promise((resolve, reject) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (onProgress) onProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);
                // Return a mock video URL
                resolve({
                    url: `https://example.com/videos/${file.name}`,
                    filename: file.name,
                    size: file.size,
                    duration: 0, // Would be calculated after processing
                });
            }
        }, 200);
    });
};

// Export default object with all functions
export default {
    getVideoUrl,
    hasVideo,
    addVideo,
    getAllVideos,
    isValidVideoType,
    isValidVideoSize,
    uploadVideo,
};