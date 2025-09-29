import { NitroModules } from 'react-native-nitro-modules';
import type { EspProvToolkit } from './EspProvToolkit.nitro';
import {
  PTSecurity,
  PTTransport,
  PTSessionStatus,
  PTError,
  PTLocationAccess,
} from './EspProvToolkit.types';
import type { PTDevice, PTWifiEntry } from './EspProvToolkit.types';
import { PTException } from './utils';
import { useLocationPermissions } from './hooks/useLocationPermissions';

const EspProvToolkitHybridObject =
  NitroModules.createHybridObject<EspProvToolkit>('EspProvToolkit');

async function handleError<T>(
  promise: Promise<{ success: boolean; error?: number } & T>
): Promise<T> {
  const result = await promise;
  if (!result.success && result.error) {
    throw new PTException(result.error as PTError);
  }
  return result as T;
}

export async function searchForESPDevices(
  devicePrefix: string,
  transport: PTTransport,
  security: PTSecurity
): Promise<string[]> {
  const result = await handleError(
    EspProvToolkitHybridObject.searchForESPDevices(
      devicePrefix,
      transport,
      security
    )
  );
  return result.deviceNames || [];
}

export function stopSearchingForESPDevices(): void {
  EspProvToolkitHybridObject.stopSearchingForESPDevices();
}

export async function createESPDevice(
  deviceName: string,
  transport: PTTransport,
  security: PTSecurity,
  proofOfPossession?: string,
  softAPPassword?: string,
  username?: string
): Promise<void> {
  await handleError(
    EspProvToolkitHybridObject.createESPDevice(
      deviceName,
      transport,
      security,
      proofOfPossession,
      softAPPassword,
      username
    )
  );
}

export function doesESPDeviceExist(deviceName: string): boolean {
  return EspProvToolkitHybridObject.doesESPDeviceExist(deviceName);
}

export function getESPDevice(deviceName: string): PTDevice | undefined {
  try {
    const result = EspProvToolkitHybridObject.getESPDevice(deviceName);
    return result.success ? result.result : undefined;
  } catch {
    return undefined;
  }
}

export async function scanWifiListOfESPDevice(
  deviceName: string
): Promise<PTWifiEntry[]> {
  const result = await handleError(
    EspProvToolkitHybridObject.scanWifiListOfESPDevice(deviceName)
  );
  return result.networks || [];
}

export async function connectToESPDevice(
  deviceName: string
): Promise<PTSessionStatus> {
  const result = await handleError(
    EspProvToolkitHybridObject.connectToESPDevice(deviceName)
  );
  return result.status!;
}

export function disconnectFromESPDevice(deviceName: string): void {
  const result = EspProvToolkitHybridObject.disconnectFromESPDevice(deviceName);
  if (!result.success && result.error) {
    throw new PTException(result.error);
  }
}

export async function provisionESPDevice(
  deviceName: string,
  ssid: string,
  password: string
): Promise<void> {
  await handleError(
    EspProvToolkitHybridObject.provisionESPDevice(deviceName, ssid, password)
  );
}

export function isESPDeviceSessionEstablished(deviceName: string): boolean {
  const result =
    EspProvToolkitHybridObject.isESPDeviceSessionEstablished(deviceName);
  if (!result.success && result.error) {
    throw new PTException(result.error);
  }
  return result.result!;
}

export async function sendDataToESPDevice(
  deviceName: string,
  path: string,
  data: string
): Promise<string> {
  const result = await handleError(
    EspProvToolkitHybridObject.sendDataToESPDevice(deviceName, path, data)
  );
  return result.str!;
}

export function getIPv4AddressOfESPDevice(
  deviceName: string
): string | undefined {
  const result =
    EspProvToolkitHybridObject.getIPv4AddressOfESPDevice(deviceName);
  if (!result.success && result.error) {
    throw new PTException(result.error);
  }
  return result.str;
}

export function getCurrentNetworkSSID(): string | undefined {
  const result = EspProvToolkitHybridObject.getCurrentNetworkSSID();
  if (!result.success && result.error) {
    throw new PTException(result.error);
  }
  return result.str;
}

export function requestLocationPermission(): void {
  EspProvToolkitHybridObject.requestLocationPermission();
}

export function registerLocationStatusCallback(
  callback: (access: PTLocationAccess) => boolean
): number {
  return EspProvToolkitHybridObject.registerLocationStatusCallback(callback);
}

export function removeLocationStatusCallback(id: number): boolean {
  return EspProvToolkitHybridObject.removeLocationStatusCallback(id);
}

export function getCurrentLocationStatus(): PTLocationAccess {
  return EspProvToolkitHybridObject.getCurrentLocationStatus();
}

// Export enums as values
export { PTSecurity, PTTransport, PTSessionStatus, PTLocationAccess, PTError };

// Export types
export type { PTWifiEntry, PTDevice };

// export hooks
export { useLocationPermissions };
export { useSoftAPDevice } from './hooks/useSoftAPDevice';
export { useProvisionDevice } from './hooks/useProvisionDevice';
export { useSoftapProvisioning } from './hooks/useSoftapProvisioning';
export { getErrorDescription } from './utils';
