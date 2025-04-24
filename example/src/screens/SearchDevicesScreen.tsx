import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { NotificationBar, type NotificationType } from '../components/NotificationBar';
import { HorizontalSelector } from '../components/HorizontalSelector';
import {
  searchForESPDevices,
  stopSearchingForESPDevices,
  PTSecurity,
  PTTransport,
} from 'react-native-esp-prov-toolkit';

const transportOptions = [
  { label: 'Bluetooth LE', value: PTTransport.TRANSPORT_BLE },
  { label: 'SoftAP', value: PTTransport.TRANSPORT_SOFTAP },
];

const securityOptions = [
  { label: 'Unsecure(0)', value: PTSecurity.SECURITY_0 },
  { label: 'Secure(1)', value: PTSecurity.SECURITY_1 },
  { label: 'Secure(2)', value: PTSecurity.SECURITY_2 },
];

export function SearchDevicesScreen() {
  const [devicePrefix, setDevicePrefix] = useState('');
  const [transport, setTransport] = useState<PTTransport>(PTTransport.TRANSPORT_BLE);
  const [security, setSecurity] = useState<PTSecurity>(PTSecurity.SECURITY_0);
  const [searchTimeout, setSearchTimeout] = useState(30);
  const [devices, setDevices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false,
  });

  const handleSearch = async () => {
    try {
      setIsLoading(true);

      // Start the search
      const searchPromise = searchForESPDevices(devicePrefix, transport, security);

      // Set up timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          stopSearchingForESPDevices();
          reject(new Error('Search timed out'));
        }, searchTimeout * 1000);
      });

      // Race between search and timeout
      const foundDevices = (await Promise.race([searchPromise, timeoutPromise])) as string[];

      setDevices(foundDevices);
      setNotification({
        message: `Found ${foundDevices.length} devices`,
        type: 'success',
        visible: true,
      });
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to search for devices',
        type: 'error',
        visible: true,
      });
      setDevices([]);
    } finally {
      stopSearchingForESPDevices();
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <NotificationBar
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Device Prefix</Text>
        <TextInput
          style={styles.input}
          value={devicePrefix}
          onChangeText={setDevicePrefix}
          placeholder="Enter device prefix"
          editable={!isLoading}
        />
      </View>

      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Transport</Text>
        <HorizontalSelector
          options={transportOptions}
          selectedValue={transport}
          onSelect={setTransport}
          disabled={isLoading}
        />
      </View>

      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Security</Text>
        <HorizontalSelector
          options={securityOptions}
          selectedValue={security}
          onSelect={setSecurity}
          disabled={isLoading}
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Scan Timeout: {searchTimeout} seconds</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={60}
          step={1}
          value={searchTimeout}
          onValueChange={setSearchTimeout}
          disabled={isLoading}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#007AFF"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Scan Devices</Text>
        )}
      </TouchableOpacity>

      {devices.length > 0 && (
        <View style={styles.devicesContainer}>
          <Text style={styles.label}>Found Devices</Text>
          {devices.map((device, index) => (
            <View key={index} style={styles.deviceItem}>
              <Text style={styles.deviceText}>{device}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  selectorContainer: {
    marginBottom: 24,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  devicesContainer: {
    marginTop: 24,
  },
  deviceItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  deviceText: {
    fontSize: 16,
    color: '#333',
  },
});
