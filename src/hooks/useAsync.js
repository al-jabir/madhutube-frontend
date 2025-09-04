import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for handling async operations with loading, error, and data states
 * @param {function} asyncFunction - The async function to execute
 * @param {boolean} immediate - Whether to execute immediately on mount
 * @returns {object} - { execute, loading, data, error, reset }
 */
export const useAsync = (asyncFunction, immediate = true) => {
    const [loading, setLoading] = useState(immediate);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);

            try {
                const result = await asyncFunction(...args);
                setData(result);
                return result;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [asyncFunction]
    );

    const reset = useCallback(() => {
        setLoading(false);
        setData(null);
        setError(null);
    }, []);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return {
        execute,
        loading,
        data,
        error,
        reset
    };
};

/**
 * Custom hook for API calls with automatic retry functionality
 * @param {function} apiCall - The API function to call
 * @param {object} options - Configuration options
 * @returns {object} - { execute, loading, data, error, retry }
 */
export const useAsyncWithRetry = (apiCall, options = {}) => {
    const {
        maxRetries = 3,
        retryDelay = 1000,
        immediate = true,
        onSuccess,
        onError
    } = options;

    const [loading, setLoading] = useState(immediate);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);

            const attemptCall = async (attempt = 0) => {
                try {
                    const result = await apiCall(...args);
                    setData(result);
                    setRetryCount(0);
                    
                    if (onSuccess) {
                        onSuccess(result);
                    }
                    
                    return result;
                } catch (err) {
                    if (attempt < maxRetries) {
                        setRetryCount(attempt + 1);
                        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
                        return attemptCall(attempt + 1);
                    } else {
                        setError(err);
                        
                        if (onError) {
                            onError(err);
                        }
                        
                        throw err;
                    }
                }
            };

            try {
                return await attemptCall();
            } finally {
                setLoading(false);
            }
        },
        [apiCall, maxRetries, retryDelay, onSuccess, onError]
    );

    const retry = useCallback(() => {
        execute();
    }, [execute]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return {
        execute,
        loading,
        data,
        error,
        retry,
        retryCount
    };
};

export default useAsync;