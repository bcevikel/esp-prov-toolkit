import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NotificationBar, type NotificationType } from '../components/NotificationBar';
import {
  connectToESPDevice,
  isESPDeviceSessionEstablished,
  PTSessionStatus,
  disconnectFromESPDevice,
} from 'react-native-esp-prov-toolkit';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function ConnectDeviceScreen() {
  const [deviceName, setDeviceName] = useState('');
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

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const status = await connectToESPDevice(deviceName);

      if (status === PTSessionStatus.CONNECTED) {
        setNotification({
          message: `Successfully connected to device ${deviceName}`,
          type: 'success',
          visible: true,
        });
      } else if (status === PTSessionStatus.DISCONNECTED) {
        setNotification({
          message: 'Connection failed for unknown reason',
          type: 'error',
          visible: true,
        });
      } else if (status === PTSessionStatus.CHECK_MANUALLY) {
        // Wait 3 seconds before starting the polling
        await sleep(3000);

        // Poll for session establishment 5 times with 1 second intervals
        for (let i = 0; i < 5; i++) {
          const isEstablished = isESPDeviceSessionEstablished(deviceName);
          if (isEstablished) {
            setNotification({
              message: `Successfully connected to device ${deviceName}`,
              type: 'success',
              visible: true,
            });
            return;
          }
          await sleep(1000);
        }

        // If we get here, the session was never established
        setNotification({
          message: 'Failed to establish session after multiple attempts',
          type: 'error',
          visible: true,
        });
      }
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to connect to device',
        type: 'error',
        visible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectFromESPDevice(deviceName);
      setNotification({
        message: `Successfully disconnected from device ${deviceName}`,
        type: 'success',
        visible: true,
      });
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to disconnect from device',
        type: 'error',
        visible: true,
      });
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

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Connect to Device</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.disconnectButton]}
        onPress={handleDisconnect}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Disconnect from Device</Text>
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
  disconnectButton: {
    backgroundColor: '#FF3B30',
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
