import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { useLocationPermissions } from './useLocationPermissions';
import { useSoftAPDevice } from './useSoftAPDevice';
import { useProvisionDevice } from './useProvisionDevice';
import {
  PTError,
  PTLocationAccess,
  PTSecurity,
  PTTransport,
  type PTWifiEntry,
} from '../EspProvToolkit.types';
import { useThrottledCallback } from './useThrottledCallback';
import { PTException } from '../utils';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useSoftapProvisioning(
  scanInterval: number,
  promptTimeoutMs: number = 10000,
  devicePrefix: string,
  security: PTSecurity,
  username?: string,
  proofOfPossession?: string,
  softAPPassword?: string,
  onLocationPermDenied?: () => void,
  autoStart: boolean = true
) {
  type ProvStateType =
    | 'idle'
    | 'searching'
    | 'connecting'
    | 'connected'
    | 'provisioning'
    | 'success'
    | 'failure';
  // React States
  const [provState, setProvState] = useState<ProvStateType>(
    autoStart ? 'searching' : 'idle'
  );
  const [appState, setAppState] = useState<'active' | 'inactive' | 'unknown'>(
    'unknown'
  );
  const [provError, setProvError] = useState<PTError>();
  const [wifiList, setWifiList] = useState<PTWifiEntry[]>([]);
  // Custom Hooks
  const { locationAccess, requestLocationPermission } =
    useLocationPermissions();
  const [deviceName, startScanning, stopScanning] = useSoftAPDevice(
    scanInterval,
    devicePrefix
  );
  const { connect, disconnect, fetchWifiList, provision } = useProvisionDevice(
    security,
    PTTransport.TRANSPORT_SOFTAP
  );
  // Throttle the callback to potentially not show the notif multiple times
  const handleOnPermCallback = useThrottledCallback(
    onLocationPermDenied ?? (() => {}),
    promptTimeoutMs
  );
  // A general error handler that handles state transitions and code extraction
  const handleErrors = useCallback(
    (error: any) => {
      // first set the state to failure
      setProvState('failure');
      // if error has a code, set it
      if (error instanceof PTException) {
        setProvError(error.code);
      }
      // if not, best we can do is warn it and set a general error
      else {
        // if it does not, the best we can do it log it as warning
        const message = error instanceof Error ? error.message : 'no message';
        console.warn(
          `An exception with no code occured with following desc : ${message}`
        );
        setProvError(PTError.RUNTIME_UNKNOWN_ERROR);
      }
    },
    [setProvError, setProvState]
  );
  // Return Callbacks
  const start = useCallback(() => {
    if (provState === 'idle') {
      setProvState('searching');
    }
  }, [provState, setProvState]);

  const provisionDevice = useCallback(
    async (ssid: string, pwd: string) => {
      try {
        if (!deviceName) {
          throw new PTException(PTError.RUNTIME_UNKNOWN_ERROR);
        }
        setProvState('provisioning');
        await provision(deviceName, ssid, pwd);
        setProvState('success');
        disconnect(deviceName);
      } catch (error) {
        handleErrors(error);
      }
    },
    [provision, handleErrors, disconnect, deviceName]
  );

  // Handle location permissions
  useEffect(() => {
    if (appState !== 'inactive') {
      // if it is not determined, try asking
      if (locationAccess === PTLocationAccess.NOT_DETERMINED) {
        // Introduce a small delay before requesting
        setTimeout(() => {
          requestLocationPermission();
        }, 500);
      }
      // if it is denied, call the callback
      if (locationAccess === PTLocationAccess.DENIED) {
        handleOnPermCallback();
      }
    }
  }, [
    locationAccess,
    requestLocationPermission,
    handleOnPermCallback,
    appState,
  ]);

  // Handle app state changes
  useEffect(() => {
    const subs = AppState.addEventListener('change', (nextAppState) => {
      // excluding unknown, we assume every non-active state to be inactive.
      if (nextAppState === 'unknown') {
        setAppState('unknown');
      } else if (nextAppState === 'active') {
        setAppState('active');
      } else {
        setAppState('inactive');
      }
    });
    // Clean-up
    return () => {
      subs.remove();
    };
  }, [setAppState]);

  // Handle toggling device name scanning
  useEffect(() => {
    // If we are in fg and in search mode, scan
    if (appState === 'active' && provState === 'searching') {
      startScanning();
    }
    // In any other case - do NOT scan.
    else {
      stopScanning();
    }
  }, [appState, provState, startScanning, stopScanning]);

  // Handle device name state transition side-effect
  useEffect(() => {
    // transition if we find a valid device name & we are searching
    if (deviceName && provState === 'searching') {
      setProvState('connecting');
    }
  }, [deviceName, provState]);

  // Handle device connection and transition side-effect
  useEffect(() => {
    const doAsyncWork = async () => {
      // try to connect if we are in connecting mode
      if (provState === 'connecting') {
        try {
          // introduce small delay since this transition happens while switching to app
          await sleep(500);
          // make sure we still have a valid device name
          if (!deviceName) {
            setProvState('failure');
            setProvError(PTError.ESP_DEVICE_NOT_FOUND);
            return;
          }
          const response = await connect(
            deviceName,
            softAPPassword,
            username,
            proofOfPossession
          );
          // if response isnt valid, fail
          if (response === 'disconnected') {
            setProvState('failure');
            setProvError(PTError.SESSION_NOT_ESTABLISHED);
            return;
          }
          // if it is valid, try to fetch wifi list.
          const res = await fetchWifiList(deviceName);
          setWifiList(res);
          // All went well - transition to connected
          setProvState('connected');
        } catch (error) {
          handleErrors(error);
        }
      }
    };
    doAsyncWork();
  }, [
    connect,
    deviceName,
    fetchWifiList,
    handleErrors,
    proofOfPossession,
    provState,
    softAPPassword,
    username,
  ]);

  // Connected state is handled through provisionDevice function

  // handle failure state  - by disconnecting
  useEffect(() => {
    if (provState === 'failure' && deviceName) {
      // best effort disconnect
      try {
        disconnect(deviceName);
      } catch (error) {}
    }
  }, [deviceName, provState, disconnect]);

  return {
    start,
    provState,
    provError,
    provisionDevice,
    deviceName,
    wifiList,
  };
}
