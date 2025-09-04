// Asset imports for thumbnails
import video1Thumbnail from '../assets/images/thumbnails/video-1.jpg';
import video2Thumbnail from '../assets/images/thumbnails/video-2.png';
import video3Thumbnail from '../assets/images/thumbnails/video-3.jpg';

// Asset imports for avatars
import avatar1 from '../assets/images/avatars/avatar-1.svg';
import avatar2 from '../assets/images/avatars/avatar-2.svg';

// Thumbnail mapping
export const thumbnails = {
    'video-1': video1Thumbnail,
    'video-2': video2Thumbnail,
    'video-3': video3Thumbnail,
};

// Avatar mapping
export const avatars = {
    'avatar-1': avatar1,
    'avatar-2': avatar2,
};

// Helper function to get thumbnail by key
export const getThumbnail = (key) => {
    return thumbnails[key] || thumbnails['video-1']; // fallback to video-1
};

// Helper function to get avatar by key
export const getAvatar = (key) => {
    return avatars[key] || avatars['avatar-1']; // fallback to avatar-1
};

// Export individual assets for direct use
export {
    video1Thumbnail,
    video2Thumbnail,
    video3Thumbnail,
    avatar1,
    avatar2,
};