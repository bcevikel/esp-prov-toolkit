import { PTError } from './EspProvToolkit.types';

export function getErrorDescription(errorCode: PTError): string {
  switch (errorCode) {
    case PTError.WIFI_SCAN_EMPTY_CONFIG_DATA:
      return 'WiFi scan configuration data is empty';
    case PTError.WIFI_SCAN_EMPTY_RESULT_COUNT:
      return 'WiFi scan returned empty results';
    case PTError.WIFI_SCAN_REQUEST_ERROR:
      return 'WiFi scan request failed';
    case PTError.ESP_NATIVE_UNKNOWN_ERROR:
      return 'Unknown native error occurred';
    case PTError.SESSION_INIT_ERROR:
      return 'Failed to initialize session';
    case PTError.SESSION_NOT_ESTABLISHED:
      return 'Session is not established';
    case PTError.SESSION_SEND_DATA_ERROR:
      return 'Failed to send data in session';
    case PTError.SOFTAP_CONNECTION_FAILURE:
      return 'Failed to connect to SoftAP';
    case PTError.SESSION_SECURITY_MISMATCH:
      return 'Security mismatch in session';
    case PTError.SESSION_VERSION_INFO_ERROR:
      return 'Error getting version information';
    case PTError.BLE_FAILED_TO_CONNECT:
      return 'Failed to connect via BLE';
    case PTError.ENCRYPTION_ERROR:
      return 'Encryption error occurred';
    case PTError.NO_POP:
      return 'Proof of possession not provided';
    case PTError.NO_USERNAME:
      return 'Username not provided';
    case PTError.CAMERA_NOT_AVAILABLE:
      return 'Camera is not available';
    case PTError.CAMERA_ACCESS_DENIED:
      return 'Camera access denied';
    case PTError.AV_CAPTURE_DEVICE_INPUT_ERROR:
      return 'AV capture device input error';
    case PTError.VIDEO_INPUT_ERROR:
      return 'Video input error';
    case PTError.VIDEO_OUTPUT_ERROR:
      return 'Video output error';
    case PTError.INVALID_QR_CODE:
      return 'Invalid QR code';
    case PTError.ESP_DEVICE_NOT_FOUND:
      return 'ESP device not found';
    case PTError.AP_SEARCH_NOT_SUPPORTED:
      return 'AP search not supported';
    case PTError.PROV_SESSION_ERROR:
      return 'Provisioning session error';
    case PTError.PROV_CONFIGURATION_ERROR:
      return 'Provisioning configuration error';
    case PTError.PROV_WIFI_STATUS_ERROR:
      return 'WiFi status error during provisioning';
    case PTError.PROV_WIFI_STATUS_DISCONNECTED:
      return 'WiFi disconnected during provisioning';
    case PTError.PROV_WIFI_STATUS_AUTH_ERROR:
      return 'WiFi authentication error during provisioning';
    case PTError.PROV_WIFI_STATUS_NETWORK_NOT_FOUND:
      return 'WiFi network not found during provisioning';
    case PTError.PROV_WIFI_STATUS_UNKNOWN_ERROR:
      return 'Unknown WiFi error during provisioning';
    case PTError.PROV_UNKNOWN_ERROR:
      return 'Unknown provisioning error';
    case PTError.RUNTIME_BAD_CLOSURE_ARGS:
      return 'Bad closure arguments';
    case PTError.RUNTIME_DOES_NOT_EXIST_LOCALLY:
      return 'This object does not exist in the local runtime.';
    case PTError.RUNTIME_BAD_BASE64_DATA:
      return 'Bad base64 data';
    case PTError.RUNTIME_UNKNOWN_ERROR:
      return 'Unknown runtime error';
    case PTError.PROV_TIMED_OUT_ERROR:
      return 'Timed out while waiting for response.';
    default:
      return 'Unknown error';
  }
}

export class PTException extends Error {
  code: PTError;
  description: string;

  constructor(errorCode: PTError) {
    const description = getErrorDescription(errorCode);
    super(
      `Native PT call failed with code ${errorCode} and with following desc: ${description}`
    );
    this.code = errorCode;
    this.description = description;
    this.name = 'PTException';
    Object.setPrototypeOf(this, PTException.prototype);
  }
}
