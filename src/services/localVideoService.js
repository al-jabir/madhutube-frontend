// Local video data service for demonstration with local images
import { getThumbnail, getAvatar } from './assetService.js';

export const localVideoData = [
    {
        _id: 'local-1',
        title: 'Getting Started with React Development - Complete Beginner Guide',
        thumbnail: getThumbnail('video-1'),
        duration: 1245, // 20:45
        views: 125430,
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
        owner: {
            username: 'techguru',
            fullName: 'Tech Guru Channel',
            avatar: getAvatar('avatar-1')
        }
    },
    {
        _id: 'local-2',
        title: 'Advanced JavaScript Concepts You Need to Know in 2024',
        thumbnail: getThumbnail('video-2'),
        duration: 892, // 14:52
        views: 89234,
        createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
        owner: {
            username: 'jsmaster',
            fullName: 'JavaScript Master',
            avatar: getAvatar('avatar-2')
        }
    },
    {
        _id: 'local-3',
        title: 'Building Modern Web Applications with Vite and React',
        thumbnail: getThumbnail('video-3'),
        duration: 1567, // 26:07
        views: 234567,
        createdAt: new Date(Date.now() - 86400000 * 1), // 1 day ago
        owner: {
            username: 'webdev',
            fullName: 'Web Development Pro',
            avatar: getAvatar('avatar-1')
        }
    },
    {
        _id: 'local-4',
        title: 'CSS Grid and Flexbox - Complete Layout Guide',
        thumbnail: getThumbnail('video-1'), // Reusing for demo
        duration: 734, // 12:14
        views: 45632,
        createdAt: new Date(Date.now() - 86400000 * 7), // 1 week ago
        owner: {
            username: 'csswizard',
            fullName: 'CSS Wizard',
            avatar: getAvatar('avatar-2')
        }
    },
    {
        _id: 'local-5',
        title: 'Responsive Design Best Practices for Modern Websites',
        thumbnail: getThumbnail('video-2'), // Reusing for demo
        duration: 923, // 15:23
        views: 76543,
        createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
        owner: {
            username: 'designpro',
            fullName: 'Design Professional',
            avatar: getAvatar('avatar-1')
        }
    },
    {
        _id: 'local-6',
        title: 'State Management in React - Context API vs Redux',
        thumbnail: getThumbnail('video-3'), // Reusing for demo
        duration: 1456, // 24:16
        views: 198765,
        createdAt: new Date(Date.now() - 86400000 * 4), // 4 days ago
        owner: {
            username: 'reactdev',
            fullName: 'React Developer',
            avatar: getAvatar('avatar-2')
        }
    }
];

// Function to get video by ID
export const getVideoById = (id) => {
    return localVideoData.find(video => video._id === id);
};

// Function to get random videos
export const getRandomVideos = (count = 6) => {
    const shuffled = [...localVideoData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Function to search videos by title
export const searchVideos = (query) => {
    if (!query) return localVideoData;
    return localVideoData.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.owner.fullName.toLowerCase().includes(query.toLowerCase())
    );
};

// Function to get videos by channel
export const getVideosByChannel = (username) => {
    return localVideoData.filter(video => video.owner.username === username);
};

export default localVideoData;