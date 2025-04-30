import type { HybridObject } from 'react-native-nitro-modules';
import type {
  PTTransport,
  PTSecurity,
  PTSearchResult,
  PTResult,
  PTWifiScanResult,
  PTSessionResult,
  PTProvisionResult,
  PTStringResult,
  PTBooleanResult,
  PTLocationAccess,
  PTDeviceResult,
} from './EspProvToolkit.types';
import type { PTError } from '../lib/typescript/src';

export interface EspProvToolkit
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  searchForESPDevices(
    devicePrefix: string,
    transport: PTTransport,
    security: PTSecurity
  ): Promise<PTSearchResult>;

  stopSearchingForESPDevices(): void;

  createESPDevice(
    deviceName: string,
    transport: PTTransport,
    security: PTSecurity,
    proofOfPossession?: string,
    softAPPassword?: string,
    username?: string
  ): Promise<PTResult>;

  getESPDevice(deviceName: string): PTDeviceResult;

  doesESPDeviceExist(deviceName: string): boolean;

  scanWifiListOfESPDevice(deviceName: string): Promise<PTWifiScanResult>;

  connectToESPDevice(deviceName: string): Promise<PTSessionResult>;

  disconnectFromESPDevice(deviceName: string): PTResult;

  createSessionWithESPDevice(deviceName: string): Promise<PTSessionResult>;

  provisionESPDevice(
    deviceName: string,
    ssid: string,
    password: string
  ): Promise<PTProvisionResult>;

  isESPDeviceSessionEstablished(deviceName: string): PTBooleanResult;

  sendDataToESPDevice(
    deviceName: string,
    path: string,
    data: string
  ): Promise<PTStringResult>;

  getIPv4AddressOfESPDevice(deviceName: string): PTStringResult;

  getCurrentNetworkSSID(): PTStringResult;

  requestLocationPermission(): void;

  registerLocationStatusCallback(
    callback: (level: PTLocationAccess) => boolean
  ): number;

  removeLocationStatusCallback(id: number): boolean;

  getCurrentLocationStatus(): PTLocationAccess;

  nativeErrorToNumber(error: PTError): number;
}
