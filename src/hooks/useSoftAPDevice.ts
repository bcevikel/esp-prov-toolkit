import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { getCurrentNetworkSSID } from '../index';

/**
 * Custom hook to detect ESP devices in SoftAP mode by monitoring the current network SSID.
 *
 * @param scanInterval - Interval in milliseconds to poll the current network SSID
 * @param devicePrefix - Prefix to match against the current SSID
 * @returns deviceName when a matching SSID is found, the raw currentNetworkSSID, and scan controls
 *
 * @note This hook requires location permissions to work correctly. Make sure to request
 * and handle location permissions before using this hook.
 */
export function useSoftAPDevice(
  scanInterval: number,
  devicePrefix: string
): {
  deviceName: string | undefined;
  currentNetworkSSID: string | undefined;
  startScanning: () => void;
  stopScanning: () => void;
} {
  const [deviceName, setDeviceName] = useState<string | undefined>(undefined);
  const [currentNetworkSSID, setCurrentNetworkSSID] = useState<
    string | undefined
  >(undefined);
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
    if (appState !== 'active') {
      return;
    }

    const checkSSID = async () => {
      try {
        const ssid = await getCurrentNetworkSSID();
        setCurrentNetworkSSID(ssid);

        if (scanState === 'enabled') {
          if (ssid && ssid.startsWith(devicePrefix)) {
            setDeviceName(ssid);
          } else {
            setDeviceName(undefined);
          }
        }
      } catch (error) {
        console.log('Error checking SSID:', error);
        setCurrentNetworkSSID(undefined);
        if (scanState === 'enabled') {
          setDeviceName(undefined);
        }
      }

      timeoutId = setTimeout(checkSSID, scanInterval);
    };

    checkSSID();

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

  return { deviceName, currentNetworkSSID, startScanning, stopScanning };
}
