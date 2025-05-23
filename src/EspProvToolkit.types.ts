// We will define the names here to avoid collisions
export enum PTSecurity {
  SECURITY_0,
  SECURITY_1,
  SECURITY_2,
}

export enum PTTransport {
  TRANSPORT_BLE,
  TRANSPORT_SOFTAP,
}

export interface PTDevice {
  name: string;
  security: PTSecurity;
  transport: PTTransport;
  connected?: boolean;
  username?: string;
  versionInfo?: string;
  capabilities?: string[];
  advertisementData?: string;
}

export interface PTDeviceResult {
  success: boolean;
  result?: PTDevice;
}

export interface PTWifiEntry {
  ssid: string;
  rssi: number;
  auth: number;
  bssid?: string;
  channel?: number;
}

export enum PTError {
  // WIFI Scan Request Errors
  WIFI_SCAN_EMPTY_CONFIG_DATA = 1,
  WIFI_SCAN_EMPTY_RESULT_COUNT = 2,
  WIFI_SCAN_REQUEST_ERROR = 3, // A general error

  // ESP Session Errors
  SESSION_INIT_ERROR = 11,
  SESSION_NOT_ESTABLISHED = 12,
  SESSION_SEND_DATA_ERROR = 13,
  SOFTAP_CONNECTION_FAILURE = 14,
  SESSION_SECURITY_MISMATCH = 15,
  SESSION_VERSION_INFO_ERROR = 16,
  BLE_FAILED_TO_CONNECT = 17,
  ENCRYPTION_ERROR = 18,
  NO_POP = 19,
  NO_USERNAME = 20,

  // Create, Scan, Search Errors - most dont apply to us.
  CAMERA_NOT_AVAILABLE = 21,
  CAMERA_ACCESS_DENIED = 22,
  AV_CAPTURE_DEVICE_INPUT_ERROR = 23,
  VIDEO_INPUT_ERROR = 24,
  VIDEO_OUTPUT_ERROR = 25,
  INVALID_QR_CODE = 26,
  BLE_SEARCH_ERROR = 46,
  ESP_DEVICE_NOT_FOUND = 27,
  AP_SEARCH_NOT_SUPPORTED = 28,

  // ESP Provision Errors
  PROV_SESSION_ERROR = 31,
  PROV_CONFIGURATION_ERROR = 32,
  PROV_WIFI_STATUS_ERROR = 33,
  PROV_WIFI_STATUS_DISCONNECTED = 34,
  PROV_WIFI_STATUS_AUTH_ERROR = 35,
  PROV_WIFI_STATUS_NETWORK_NOT_FOUND = 36,
  PROV_WIFI_STATUS_UNKNOWN_ERROR = 37,
  PROV_TIMED_OUT_ERROR = 45,
  PROV_UNKNOWN_ERROR = 38, // Actual ESP supplied errors end at 38.

  // Swift/Kotlin runtime errors
  RUNTIME_BAD_CLOSURE_ARGS = 41,
  RUNTIME_DOES_NOT_EXIST_LOCALLY = 42,
  RUNTIME_BAD_BASE64_DATA = 43,
  RUNTIME_UNKNOWN_ERROR = 44,

  // General Errors
  ESP_NATIVE_UNKNOWN_ERROR = 4,
  ESP_INSUFFICIENT_PERMISSIONS = 47,
  BLE_ADAPTER_NOT_AVAILABLE = 48, // last
}

// Return Interfaces
export enum PTSessionStatus {
  CONNECTED,
  CHECK_MANUALLY,
  DISCONNECTED,
}

export enum PTProvisionStatus {
  SUCCESS,
  CONFIG_APPLIED,
}

export enum PTLocationAccess {
  GRANTED,
  DENIED,
  NOT_DETERMINED,
}

export interface PTSearchResult {
  success: boolean;
  deviceNames?: string[];
  error?: number;
}

export interface PTResult {
  success: boolean;
  error?: number;
}

export interface PTProvisionResult {
  success: boolean;
  status?: PTProvisionStatus;
  error?: number;
}

export interface PTSessionResult {
  success: boolean;
  status?: PTSessionStatus;
  error?: number;
}

export interface PTStringResult {
  success: boolean;
  str?: string;
  error?: number;
}

export interface PTBooleanResult {
  success: boolean;
  result?: boolean;
  error?: number;
}

export interface PTWifiScanResult {
  success: boolean;
  networks?: PTWifiEntry[];
  error?: number;
}
