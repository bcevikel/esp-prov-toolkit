import { useState, useEffect, useRef, useCallback } from 'react';
import {
  PTLocationAccess,
  getCurrentLocationStatus,
  requestLocationPermission,
  registerLocationStatusCallback,
  removeLocationStatusCallback,
} from '../index';

/**
 * Custom hook to manage location permissions state and provide functionality to request permissions.
 *
 * @returns An object containing:
 * - locationAccess: The current state of location permissions
 * - requestLocationPermission: A function to request location permissions
 *
 * @example
 * ```typescript
 * const { locationAccess, requestLocationPermission } = useLocationPermissions();
 *
 * // Check current permission status
 * if (locationAccess === PTLocationAccess.DENIED) {
 *   // Handle denied case
 * }
 *
 * // Request permissions
 * const handleRequestPermissions = async () => {
 *   await requestLocationPermission();
 * };
 * ```
 *
 * @note This hook manages the lifecycle of location permission callbacks automatically.
 * It will properly clean up any registered callbacks when the component unmounts.
 */
export function useLocationPermissions() {
  const [locationAccess, setLocationAccess] = useState<PTLocationAccess>(
    getCurrentLocationStatus()
  );
  const callbackIdRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      // Register callback for location permission changes
      const callbackId = registerLocationStatusCallback(
        (access: PTLocationAccess) => {
          setLocationAccess(access);
          return true; // Keep the callback active
        }
      );

      callbackIdRef.current = callbackId;

      // Cleanup function
      return () => {
        if (callbackIdRef.current !== null) {
          removeLocationStatusCallback(callbackIdRef.current);
        }
      };
    } catch (error) {
      console.error('Error setting up location permissions hook:', error);
      return () => {};
    }
  }, []);

  /**
   * Wrapper function to request location permissions.
   * Handles any potential errors that might occur during the request.
   */
  const requestLocationPermissions = useCallback(() => {
    try {
      requestLocationPermission();
    } catch (error) {
      console.error('Error requesting location permissions:', error);
    }
  }, []);

  return {
    locationAccess,
    requestLocationPermission: requestLocationPermissions,
  };
}
