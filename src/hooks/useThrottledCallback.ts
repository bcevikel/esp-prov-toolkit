import { useCallback, useRef, useEffect } from 'react';

/**
 * A hook that wraps a callback function and prevents it from being called
 * more than once within the specified timeout period.
 *
 * @param callback The function to throttle
 * @param timeout The timeout in milliseconds
 * @returns A throttled version of the callback
 */
export function useThrottledCallback(
  callback: (...args: any[]) => void,
  timeout: number
): (...args: any[]) => void {
  // Use a ref to store the timeout ID
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use a ref to track if the callback is currently blocked
  const isBlockedRef = useRef<boolean>(false);

  // Cleanup function to clear any pending timeouts
  useEffect(() => {
    // Return cleanup function that runs when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Create and memoize the throttled callback
  const throttledCallback = useCallback(
    (...args: any[]) => {
      // If the callback is currently blocked, do nothing
      if (isBlockedRef.current) {
        return;
      }

      // Set the blocked state to true
      isBlockedRef.current = true;

      // Execute the callback with the provided arguments
      callback(...args);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a timeout to unblock the callback after the specified duration
      timeoutRef.current = setTimeout(() => {
        isBlockedRef.current = false;
        timeoutRef.current = null;
      }, timeout);
    },
    [callback, timeout]
  );

  return throttledCallback;
}
