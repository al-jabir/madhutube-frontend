import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for implementing infinite scroll functionality
 * @param {function} fetchMore - Function to fetch more data
 * @param {boolean} hasMore - Whether there's more data to load
 * @param {number} threshold - Distance from bottom to trigger load (default: 100px)
 * @returns {object} - { isFetching, error }
 */
export const useInfiniteScroll = (fetchMore, hasMore, threshold = 100) => {
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    const handleScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        if (distanceFromBottom < threshold && hasMore && !isFetching) {
            setIsFetching(true);
            setError(null);
        }
    }, [hasMore, isFetching, threshold]);

    useEffect(() => {
        if (isFetching && hasMore) {
            const loadMore = async () => {
                try {
                    await fetchMore();
                } catch (err) {
                    setError(err);
                } finally {
                    setIsFetching(false);
                }
            };

            loadMore();
        }
    }, [isFetching, hasMore, fetchMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return { isFetching, error };
};

/**
 * Custom hook for intersection observer based infinite scroll
 * @param {function} fetchMore - Function to fetch more data
 * @param {boolean} hasMore - Whether there's more data to load
 * @returns {object} - { ref, isFetching, error }
 */
export const useIntersectionObserver = (fetchMore, hasMore) => {
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);
    const [element, setElement] = useState(null);

    const observer = useCallback(
        (node) => {
            if (isFetching) return;
            if (element) element.disconnect();
            
            const newObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setIsFetching(true);
                    setError(null);
                }
            });

            if (node) newObserver.observe(node);
            setElement(newObserver);
        },
        [isFetching, hasMore]
    );

    useEffect(() => {
        if (isFetching && hasMore) {
            const loadMore = async () => {
                try {
                    await fetchMore();
                } catch (err) {
                    setError(err);
                } finally {
                    setIsFetching(false);
                }
            };

            loadMore();
        }
    }, [isFetching, hasMore, fetchMore]);

    return { ref: observer, isFetching, error };
};

export default useInfiniteScroll;