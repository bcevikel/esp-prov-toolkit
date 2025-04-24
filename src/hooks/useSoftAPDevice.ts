import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { getCurrentNetworkSSID } from '../index';

/**
 * Custom hook to detect ESP devices in SoftAP mode by monitoring the current network SSID.
 *
 * @param scanInterval - Interval in milliseconds to check for matching SSID
 * @param devicePrefix - Prefix to match against the current SSID
 * @returns The detected device name if found, undefined otherwise
 *
 * @note This hook requires location permissions to work correctly. Make sure to request
 * and handle location permissions before using this hook.
 */
export function useSoftAPDevice(
  scanInterval: number,
  devicePrefix: string
): [string | undefined, () => void, () => void] {
  const [deviceName, setDeviceName] = useState<string | undefined>(undefined);
  const [appState, setAppState] = useState(AppState.currentState);
  const [scanState, setScanState] = useState<'enabled' | 'disabled'>('enabled');

  // Register a handler for notifying us about app fg bg state
  useEffect(() => {
    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
    });
    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    // If we are not explicitly ACTIVE, the effect should not do anything (empty destructor returned).
    if (appState !== 'active') {
      return;
    }
    // If the scan state is disabled, the effect shouldnt do anything.
    if (scanState === 'disabled') {
      return;
    }

    const checkSSID = async () => {
      try {
        const currentSSID = getCurrentNetworkSSID();

        if (currentSSID && currentSSID.startsWith(devicePrefix)) {
          setDeviceName(currentSSID);
        } else {
          setDeviceName(undefined);
        }
      } catch (error) {
        console.log('Error checking SSID:', error);
        setDeviceName(undefined);
      }

      // Schedule next check
      timeoutId = setTimeout(checkSSID, scanInterval);
    };

    // Start the initial check
    checkSSID();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [scanInterval, devicePrefix, appState, scanState]);

  const stopScanning = useCallback(() => {
    setScanState('disabled');
  }, [setScanState]);

  const startScanning = useCallback(() => {
    setScanState('enabled');
  }, [setScanState]);

  return [deviceName, startScanning, stopScanning];
}
