import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { doesESPDeviceExist, getESPDevice } from 'react-native-esp-prov-toolkit';
import { NotificationBar, type NotificationType } from '../components/NotificationBar';
import type { PTDevice } from 'react-native-esp-prov-toolkit';

export function InspectDeviceScreen() {
  const [deviceName, setDeviceName] = useState('');
  const [device, setDevice] = useState<PTDevice | undefined>();
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    visible: boolean;
  }>({ message: '', type: 'info', visible: false });

  const handleInspect = async () => {
    try {
      // Check if device exists
      const exists = doesESPDeviceExist(deviceName);
      if (!exists) {
        setNotification({
          message: 'Device does not exist',
          type: 'warning',
          visible: true,
        });
        setDevice(undefined);
        return;
      }
      // Get device details
      const deviceDetails = getESPDevice(deviceName);
      console.log(deviceDetails);
      if (!deviceDetails) {
        setNotification({
          message: 'Failed to get device details - Unknown error',
          type: 'error',
          visible: true,
        });
        setDevice(undefined);
        return;
      }

      setDevice(deviceDetails);
      setNotification({
        message: 'Device details retrieved successfully',
        type: 'success',
        visible: true,
      });
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'An error occurred',
        type: 'error',
        visible: true,
      });
      setDevice(undefined);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inspect Device</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter device name"
        value={deviceName}
        onChangeText={setDeviceName}
      />

      <TouchableOpacity style={styles.button} onPress={handleInspect}>
        <Text style={styles.buttonText}>Inspect Device</Text>
      </TouchableOpacity>

      <NotificationBar
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
      />

      {device && (
        <View style={styles.deviceDetails}>
          <Text style={styles.detailTitle}>Device Details:</Text>
          <Text>Name: {device.name}</Text>
          <Text>Security: {device.security}</Text>
          <Text>Transport: {device.transport}</Text>
          <Text>Connected: {device.connected ? 'Yes' : 'No'}</Text>
          {device.username && <Text>Username: {device.username}</Text>}
          {device.versionInfo && <Text>Version Info: {device.versionInfo}</Text>}
          {device.capabilities && <Text>Capabilities: {device.capabilities.join(', ')}</Text>}
          {device.advertisementData && <Text>Advertisement Data: {device.advertisementData}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceDetails: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});
