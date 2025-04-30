# 🚀 ESP Provisioning Toolkit

> **Note**: This project is actively maintained and supports both iOS and Android platforms! 🛠️

## 🌟 Features

- **Cross-Platform Support** 📱
  - Full support for both iOS and Android
  - Consistent API across platforms
  - Unified error handling and reporting

- **Robust Error Handling** 🛡️
  - Detailed error messages and codes
  - Platform-specific error details
  - Easy error recovery mechanisms
  - Comprehensive error documentation

- **Fully Async API** 🔄
  - Wraps closures and handles multiple callback invocations
  - Clean and modern Swift-based implementation

- **Nitro Architecture** ⚡
  - Direct Swift execution without Objective-C intermediaries
  - Optimized performance and reduced overhead

- **New Architecture Compatible** 🏗️
  - Supports synchronous JS execution
  - Future-proof design

- **Layered API Design** 🎯
  - Direct native API access for maximum control
  - Separated hooks for modular usage
  - High-level hooks for quick implementation
  - Documentation coming soon

- **Multiple Provisioning Methods** 📡
  - SoftAP support
  - BLE support
  - Security levels 0, 1, and 2

- **Enhanced Stability** 🛡️
  - Patches and workarounds for Espressif library limitations
  - Improved reliability and performance

## 📦 Installation

### Prerequisites

- React Native 0.78.0 or higher
- iOS: Xcode 14.0 or higher
- Android: Android Studio with NDK support
- Node.js 16 or higher

### Adding the Package

```bash
yarn add react-native-esp-prov-toolkit
# or
npm install react-native-esp-prov-toolkit
```

### Installing Peer Dependencies

```bash
yarn add react-native-nitro-modules@^0.25.2
# or
npm install react-native-nitro-modules@^0.25.2
```

### iOS Setup

1. Run pod install:
```bash
cd ios && pod install
```

### Android Setup

1. Add the following to your `android/build.gradle`:
```gradle
allprojects {
    repositories {
        // ... other repositories
        maven { url 'https://jitpack.io' }
    }
}
```

## 🚀 Basic Usage

### SoftAP Provisioning Example

```typescript
import { useSoftapProvisioning, PTSecurity } from 'react-native-esp-prov-toolkit';

// Define your device prefix (e.g., "ESP_")
const DEVICE_PREFIX = "ESP_";

// Helper function to handle location permission denial
const alertForLocationPermissions = () => {
  Alert.alert(
    'Location Permission',
    'This app needs location services to work.',
    [
      { text: 'Settings', onPress: () => Linking.openSettings() },
      { text: 'OK', style: 'default' }
    ]
  );
};

function ProvisionScreen() {
  const {
    provState: currentState,
    provError,
    wifiList,
    provisionDevice,
  } = useSoftapProvisioning(
    10000, // scanInterval (ms)
    10000, // promptTimeoutMs
    DEVICE_PREFIX, // devicePrefix
    PTSecurity.SECURITY_0, // security level
    undefined, // username (optional)
    undefined, // proofOfPossession (optional)
    undefined, // softAPPassword (optional)
    alertForLocationPermissions // onLocationPermDenied callback
  );

  const handleProvision = async (ssid: string, password: string) => {
    try {
      await provisionDevice(ssid, password);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  // Render different states based on currentState:
  // - 'searching': Initial state, waiting for device
  // - 'connecting': Connecting to device
  // - 'connected': Connected, ready to provision
  // - 'provisioning': Currently provisioning
  // - 'success': Provisioning successful
  // - 'failure': Provisioning failed
}
```

The provisioning process follows these steps:
1. Connect to the ESP device's SoftAP network from your phone's WiFi settings
2. The library will automatically detect and connect to the device
3. Once connected, you can scan for available WiFi networks
4. Select a network and provide credentials
5. The device will be provisioned with the selected network

## 📚 API Reference

### Core Functions

#### Device Management
```typescript
// Search for ESP devices with given prefix
searchForESPDevices(
  devicePrefix: string,
  transport: PTTransport,
  security: PTSecurity
): Promise<string[]>

// Create a new ESP device instance
createESPDevice(
  deviceName: string,
  transport: PTTransport,
  security: PTSecurity,
  proofOfPossession?: string,
  softAPPassword?: string,
  username?: string
): Promise<void>

// Check if a device exists
doesESPDeviceExist(deviceName: string): boolean

// Get device information
getESPDevice(deviceName: string): PTDevice | undefined
```

#### Connection Management
```typescript
// Connect to an ESP device
connectToESPDevice(deviceName: string): Promise<PTSessionStatus>

// Disconnect from an ESP device
disconnectFromESPDevice(deviceName: string): void

// Check if session is established
isESPDeviceSessionEstablished(deviceName: string): boolean
```

#### WiFi Operations
```typescript
// Scan for available WiFi networks
scanWifiListOfESPDevice(deviceName: string): Promise<PTWifiEntry[]>

// Provision device with WiFi credentials
provisionESPDevice(
  deviceName: string,
  ssid: string,
  password: string
): Promise<PTProvisionStatus>

// Get current network SSID
getCurrentNetworkSSID(): string | undefined

// Get device's IPv4 address
getIPv4AddressOfESPDevice(deviceName: string): string | undefined
```

#### Location Permissions
```typescript
// Request location permission
requestLocationPermission(): void

// Get current location permission status
getCurrentLocationStatus(): PTLocationAccess

// Register callback for location status changes
registerLocationStatusCallback(
  callback: (access: PTLocationAccess) => boolean
): number

// Remove location status callback
removeLocationStatusCallback(id: number): boolean
```

### Enums and Types

```typescript
enum PTSecurity {
  SECURITY_0 = 0,
  SECURITY_1 = 1,
  SECURITY_2 = 2
}

enum PTTransport {
  TRANSPORT_SOFTAP = 0,
  TRANSPORT_BLE = 1
}

enum PTSessionStatus {
  CONNECTED = 0,
  DISCONNECTED = 1,
  CHECK_MANUALLY = 2
}

enum PTProvisionStatus {
  SUCCESS = 0,
  CONFIG_APPLIED = 1
}

enum PTLocationAccess {
  DENIED = 0,
  GRANTED = 1,
  LIMITED = 2
}
```

### Error Handling

All API functions throw `PTException` with specific error codes that can be translated to human-readable messages using `getErrorDescription(error: PTError): string`.

## 🚧 Current Status

- ✅ iOS support available
- ✅ Android support available
- 🔄 Active maintenance and updates

## 🤔 Why Workarounds Instead of Fixes?

The Espressif libraries present some architectural challenges:
- Limited access to internal components (private/fileprivate)
- Architectural limitations that prevent direct fixes
- No ability to extend certain critical components

We've implemented workarounds to ensure stability and functionality. However, if there's community interest, we're open to creating a new branch where we can:
- Rewrite the iOS/Android libraries from scratch
- Implement proper fixes at the root level
- Create a more maintainable and extensible solution

## ⚠️ Known Problems

- **Bluetooth Adapter Issues** 📱
  - Hangs when Bluetooth adapter is killed from settings during operation (both iOS and Android)
  - iOS: Prompts and hangs if Bluetooth is off in settings
  - Android: Fails with native error if Bluetooth is off in settings
  - Connect → Disconnect → Connect cycles can cause failures due to Bluetooth adapter object reuse

### Solutions and Best Practices

1. **Prevent Hangs** ⏱️
   - Race every operation's promise with a timeout to prevent hanging
   - Example:
   ```typescript
   const timeout = new Promise((_, reject) => 
     setTimeout(() => reject(new Error('Operation timed out')), 5000)
   );
   await Promise.race([operation, timeout]);
   ```

2. **Device Instance Management** 🔄
   - Create new device instances for each provisioning cycle
   - Follow this pattern: Create → Connect → Scan → Provision
   - Do not reuse device instances after completing operations
   - Always include the create step in each cycle

## 📋 TODO

- **CI/CD Improvements** 🔄
  - Fix iOS CI pipeline
  - Add CI jobs for example project testing
    - Install and run example project on iOS
    - Install and run example project on Android

- **Bluetooth Enhancements** 📱
  - Add BLE adapter status check
    - Raise appropriate exceptions when adapter is off
  - Improve BLE permission error handling in iOS
  - Fix permission annotations on Android 

## 🔮 Future Plans

- Community-driven improvements
- Potential ground-up rewrite based on community interest

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*This project is actively maintained and developed. Stay tuned for updates!* 🎉
