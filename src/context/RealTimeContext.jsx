import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useNotification } from './NotificationContext.jsx';

const RealTimeContext = createContext();

export const useRealTime = () => {
    const context = useContext(RealTimeContext);
    if (!context) {
        throw new Error('useRealTime must be used within RealTimeProvider');
    }
    return context;
};

export const RealTimeProvider = ({ children }) => {
    const { user } = useAuth();
    const { info, success } = useNotification();
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [liveNotifications, setLiveNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            // In a real app, this would connect to WebSocket
            // const ws = new WebSocket(`ws://localhost:5000?userId=${user._id}`);

            // Mock WebSocket connection
            const mockSocket = {
                connected: true,
                emit: (event, data) => {
                    console.log('Mock socket emit:', event, data);
                },
                on: (event, callback) => {
                    console.log('Mock socket listener registered:', event);
                },
                disconnect: () => {
                    console.log('Mock socket disconnected');
                }
            };

            setSocket(mockSocket);

            // Simulate receiving live notifications
            const notificationInterval = setInterval(() => {
                if (Math.random() > 0.7) { // 30% chance every 10 seconds
                    const mockNotifications = [
                        {
                            type: 'new_video',
                            message: 'Tech Creator uploaded a new video: "Advanced React Patterns"',
                            channelName: 'Tech Creator',
                            timestamp: new Date()
                        },
                        {
                            type: 'new_subscriber',
                            message: 'You have a new subscriber!',
                            timestamp: new Date()
                        },
                        {
                            type: 'video_liked',
                            message: 'Someone liked your video "React Tutorial"',
                            timestamp: new Date()
                        },
                        {
                            type: 'new_comment',
                            message: 'New comment on your video "JavaScript Tips"',
                            timestamp: new Date()
                        }
                    ];

                    const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];

                    setLiveNotifications(prev => [...prev.slice(-9), randomNotification]); // Keep last 10

                    // Show notification toast
                    if (randomNotification.type === 'new_video') {
                        info(randomNotification.message, {
                            title: 'New Video',
                            duration: 8000
                        });
                    } else if (randomNotification.type === 'new_subscriber') {
                        success(randomNotification.message, {
                            title: 'New Subscriber!',
                            duration: 6000
                        });
                    }
                }
            }, 10000); // Every 10 seconds

            // Simulate online users
            const onlineInterval = setInterval(() => {
                const mockUsers = [
                    { _id: '1', username: 'user1', avatar: 'https://via.placeholder.com/32x32?text=U1' },
                    { _id: '2', username: 'user2', avatar: 'https://via.placeholder.com/32x32?text=U2' },
                    { _id: '3', username: 'user3', avatar: 'https://via.placeholder.com/32x32?text=U3' },
                    { _id: '4', username: 'user4', avatar: 'https://via.placeholder.com/32x32?text=U4' },
                    { _id: '5', username: 'user5', avatar: 'https://via.placeholder.com/32x32?text=U5' }
                ];

                // Randomly show 2-4 users as online
                const onlineCount = Math.floor(Math.random() * 3) + 2;
                const shuffled = mockUsers.sort(() => 0.5 - Math.random());
                setOnlineUsers(shuffled.slice(0, onlineCount));
            }, 15000); // Every 15 seconds

            return () => {
                clearInterval(notificationInterval);
                clearInterval(onlineInterval);
                mockSocket.disconnect();
            };
        }
    }, [user, info, success]);

    const sendLiveComment = (videoId, comment) => {
        if (socket) {
            socket.emit('live_comment', {
                videoId,
                comment,
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar
                },
                timestamp: new Date()
            });
        }
    };

    const joinVideoRoom = (videoId) => {
        if (socket) {
            socket.emit('join_video', { videoId });
        }
    };

    const leaveVideoRoom = (videoId) => {
        if (socket) {
            socket.emit('leave_video', { videoId });
        }
    };

    const value = {
        socket,
        onlineUsers,
        liveNotifications,
        sendLiveComment,
        joinVideoRoom,
        leaveVideoRoom,
        isConnected: !!socket?.connected
    };

    return (
        <RealTimeContext.Provider value={value}>
            {children}
        </RealTimeContext.Provider>
    );
};

export default RealTimeProvider;