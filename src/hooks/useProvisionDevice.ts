import {
  PTSecurity,
  PTTransport,
  PTSessionStatus,
  createESPDevice,
  connectToESPDevice,
  disconnectFromESPDevice,
  isESPDeviceSessionEstablished,
  scanWifiListOfESPDevice,
  provisionESPDevice,
  PTError,
} from 'react-native-esp-prov-toolkit';
import type { PTWifiEntry } from 'react-native-esp-prov-toolkit';
import { PTException } from '../utils';
import { useCallback } from 'react';

/**
 * A custom hook that provides device provisioning functionality for ESP devices.
 * This hook returns a set of functions that can be used to manage device connections,
 * scan for WiFi networks, and provision devices.
 * @param PTSecurity The security level for device provisioning
 * @param PTTransport The transport method for device communication
 * @returns Object An object containing provisioning functions
 */
export function useProvisionDevice(
  security: PTSecurity = PTSecurity.SECURITY_0,
  transport: PTTransport = PTTransport.TRANSPORT_SOFTAP
) {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Connects to an ESP device with the specified parameters.
   * @param deviceName - The name of the device to connect to
   * @param softAPPassword - Optional SoftAP password if using SoftAP transport
   * @param username - Optional username for secure connections
   * @param proofOfPossession - Optional proof of possession for secure connections
   * @returns Promise  The session status after connection attempt
   * @throws Error If the connection fails
   */
  const connect = useCallback(
    async (
      deviceName: string,
      softAPPassword?: string,
      username?: string,
      proofOfPossession?: string
    ): Promise<'connected' | 'disconnected'> => {
      // First create the device if it doesn't exist
      await createESPDevice(
        deviceName,
        transport,
        security,
        proofOfPossession,
        softAPPassword,
        username
      );
      const result = await connectToESPDevice(deviceName);
      // if we are going to need check manually, lets handle it here
      if (result === PTSessionStatus.CHECK_MANUALLY) {
        // sleep for 3 seconds to let it settle
        await sleep(3000);
        // Poll for session establishment 5 times with 1 second intervals
        for (let i = 0; i < 5; i++) {
          if (isESPDeviceSessionEstablished(deviceName)) {
            return 'connected';
          }
          await sleep(1000);
        }
        // if we still have nothing, raise sofAP error
        throw new PTException(PTError.SOFTAP_CONNECTION_FAILURE);
      } else if (result === PTSessionStatus.CONNECTED) {
        return 'connected';
      }
      // else
      return 'disconnected';
    },
    [security, transport]
  );

  /**
   * Disconnects from an ESP device.
   * @param deviceName  The name of the device to disconnect from
   * @throws If the disconnection fails
   */
  const disconnect = useCallback((deviceName: string): void => {
    disconnectFromESPDevice(deviceName);
  }, []);

  /**
   * Checks if a session is established with the specified device.
   * @param deviceName - The name of the device to check
   * @returns boolean True if a session is established, false otherwise
   * @throws If the check fails
   */
  const isConnected = useCallback((deviceName: string): boolean => {
    return isESPDeviceSessionEstablished(deviceName);
  }, []);

  /**
   * Fetches the list of available WiFi networks from the ESP device.
   * @param deviceName - The name of the device to scan from
   * @returns Promise<PTWifiEntry[]> List of available WiFi networks
   * @throws If the scan fails
   */
  const fetchWifiList = useCallback(
    async (deviceName: string): Promise<PTWifiEntry[]> => {
      return await scanWifiListOfESPDevice(deviceName);
    },
    []
  );

  /**
   * Provisions an ESP device with WiFi credentials.
   * @param deviceName - The name of the device to provision
   * @param ssid - The SSID of the WiFi network to connect to
   * @param password - The password of the WiFi network
   * @returns Promise<PTProvisionStatus> The provisioning status
   * @throws If the provisioning fails
   */
  const provision = useCallback(
    async (
      deviceName: string,
      ssid: string,
      password: string
    ): Promise<void> => {
      await provisionESPDevice(deviceName, ssid, password);
    },
    []
  );

  return {
    connect,
    disconnect,
    isConnected,
    fetchWifiList,
    provision,
  };
}
