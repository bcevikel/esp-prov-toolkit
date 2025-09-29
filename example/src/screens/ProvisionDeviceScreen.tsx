import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NotificationBar, type NotificationType } from '../components/NotificationBar';
import { PasswordInput } from '../components/PasswordInput';
import { provisionESPDevice } from 'react-native-esp-prov-toolkit';

export function ProvisionDeviceScreen() {
  const [deviceName, setDeviceName] = useState('');
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
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

  const handleProvision = async () => {
    try {
      setIsLoading(true);
      await provisionESPDevice(deviceName, ssid, password);

      setNotification({
        message: 'Provisioning success',
        type: 'success',
        visible: true,
      });
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to provision device',
        type: 'error',
        visible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NotificationBar
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Device Name</Text>
        <TextInput
          style={styles.input}
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder="Enter device name"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>SSID</Text>
        <TextInput
          style={styles.input}
          value={ssid}
          onChangeText={setSSID}
          placeholder="Enter WiFi SSID"
          editable={!isLoading}
        />
      </View>

      <PasswordInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter WiFi password"
        editable={!isLoading}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleProvision}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Provision Device</Text>
        )}
      </TouchableOpacity>
    </View>
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
});
