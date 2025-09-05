import React, { useState, useRef, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

const VideoPlayer = ({ src, poster, title }) => {
  const videoRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBuffering, setIsBuffering] = useState(false);

  // Validate video source
  const isValidVideoSource = (source) => {
    if (!source) return false;

    // Check if it's a valid URL
    try {
      new URL(source);
      return true;
    } catch {
      // Check if it's a relative path that might be valid
      return source.includes('.');
    }
  };

  // Get video source with fallback
  const getVideoSource = () => {
    if (isValidVideoSource(src)) {
      return src;
    }
    // Return a fallback or null
    return null;
  };

  const validSrc = getVideoSource();

  useEffect(() => {
    // Reset states when source changes
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    // Check if source is valid
    if (!validSrc) {
      setError('Invalid video source or video not available.');
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handlePlay = () => {
      setIsPlaying(true);
      setError(null);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => {
      setIsBuffering(false);
      setIsLoading(false);
    };
    const handleError = (e) => {
      console.error('Video error:', e);
      const errorMessage = video.error ?
        `Video error (${video.error.code}): ${getErrorMessage(video.error.code)}` :
        'Video failed to load. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      setIsBuffering(false);
    };
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [src, validSrc]);

  // Get human-readable error message
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 1: return 'Video loading was aborted';
      case 2: return 'Network error occurred';
      case 3: return 'Video format not supported';
      case 4: return 'Video source not found';
      default: return 'Unknown error occurred';
    }
  };

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video || error) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Failed to play video. Please try again.');
    }
  };

  const retryVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setIsLoading(true);
    video.load();
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || error) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    if (newTime >= 0 && newTime <= duration) {
      video.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimeoutRef.current);
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  return (
    <div
      className="relative bg-black group aspect-video w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={validSrc}
        poster={poster}
        className="w-full h-full"
        onClick={togglePlay}
        preload="metadata"
        crossOrigin="anonymous"
      >
        {validSrc && (
          <>
            <source src={validSrc} type="video/mp4" />
            <source src={validSrc} type="video/webm" />
            <source src={validSrc} type="video/ogg" />
          </>
        )}
        Your browser does not support the video tag.
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner size="large" text="Loading video..." />
        </div>
      )}

      {/* Buffering Overlay */}
      {isBuffering && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-black bg-opacity-70 rounded-full p-3">
            <ArrowPathIcon className="h-8 w-8 text-white animate-spin" />
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="text-center text-white p-6">
            <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-semibold mb-2">Video Error</h3>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={retryVideo}
              className="bg-youtube-red hover:bg-youtube-hover text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Play/Pause overlay */}
      {!error && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {!isPlaying && !isBuffering && (
            <div className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all duration-200">
              <PlayIcon className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      {!error && !isLoading && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {/* Progress bar */}
          <div
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-4"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-youtube-red rounded-full transition-all duration-150"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors duration-200"
                disabled={error}
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors duration-200"
                >
                  {isMuted ? (
                    <SpeakerXMarkIcon className="h-5 w-5" />
                  ) : (
                    <SpeakerWaveIcon className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {isBuffering && (
              <div className="flex items-center space-x-2 text-white text-sm">
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                <span>Buffering...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;