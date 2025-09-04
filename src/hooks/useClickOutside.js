import { useEffect, useRef } from 'react';

/**
 * Custom hook for detecting clicks outside of a component
 * @param {function} handler - Function to call when clicking outside
 * @param {boolean} enabled - Whether the hook is enabled (default: true)
 * @returns {object} - ref object to attach to the component
 */
export const useClickOutside = (handler, enabled = true) => {
    const ref = useRef();

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handler(event);
            }
        };

        // Add event listeners for both mouse and touch events
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [handler, enabled]);

    return ref;
};

/**
 * Custom hook for detecting clicks outside with escape key support
 * @param {function} handler - Function to call when clicking outside or pressing escape
 * @param {boolean} enabled - Whether the hook is enabled (default: true)
 * @returns {object} - ref object to attach to the component
 */
export const useClickOutsideWithEscape = (handler, enabled = true) => {
    const ref = useRef();

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                handler(event);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                handler(event);
            }
        };

        // Add event listeners
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [handler, enabled]);

    return ref;
};

export default useClickOutside;