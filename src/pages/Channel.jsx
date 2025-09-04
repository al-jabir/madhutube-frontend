import React from 'react';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const { username } = useParams();
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Channel Page</h1>
        <p className="text-gray-600 dark:text-gray-400">
          This page will show the channel for user: @{username}
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Channel videos, playlists, about section, and subscription features will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default Channel;