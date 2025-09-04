import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} - Debounced value
 */
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer to update the debounced value after the delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if value changes before the delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Custom hook for debounced callback functions
 * @param {function} callback - The callback function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {array} deps - Dependencies array
 * @returns {function} - Debounced callback function
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
    const [debouncedCallback, setDebouncedCallback] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedCallback(() => callback);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [...deps, delay]);

    return debouncedCallback;
};

export default useDebounce;