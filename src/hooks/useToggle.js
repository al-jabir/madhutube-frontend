import { useState, useCallback } from 'react';

/**
 * Custom hook for managing boolean toggle state
 * @param {boolean} initialValue - Initial boolean value (default: false)
 * @returns {[boolean, function, function, function]} - [value, toggle, setTrue, setFalse]
 */
export const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);

    const setTrue = useCallback(() => {
        setValue(true);
    }, []);

    const setFalse = useCallback(() => {
        setValue(false);
    }, []);

    return [value, toggle, setTrue, setFalse];
};

/**
 * Custom hook for managing multiple boolean states
 * @param {object} initialStates - Object with initial boolean states
 * @returns {object} - Object with current states and toggle functions
 */
export const useMultipleToggle = (initialStates = {}) => {
    const [states, setStates] = useState(initialStates);

    const toggle = useCallback((key) => {
        setStates(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    }, []);

    const setTrue = useCallback((key) => {
        setStates(prev => ({
            ...prev,
            [key]: true
        }));
    }, []);

    const setFalse = useCallback((key) => {
        setStates(prev => ({
            ...prev,
            [key]: false
        }));
    }, []);

    const reset = useCallback(() => {
        setStates(initialStates);
    }, [initialStates]);

    return {
        states,
        toggle,
        setTrue,
        setFalse,
        reset
    };
};

export default useToggle;