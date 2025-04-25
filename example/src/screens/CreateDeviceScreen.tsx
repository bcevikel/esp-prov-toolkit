import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { HorizontalSelector } from '../components/HorizontalSelector';
import { NotificationBar, type NotificationType } from '../components/NotificationBar';
import { createESPDevice, PTSecurity, PTTransport } from 'react-native-esp-prov-toolkit';

const transportOptions = [
  { label: 'Bluetooth LE', value: PTTransport.TRANSPORT_BLE },
  { label: 'SoftAP', value: PTTransport.TRANSPORT_SOFTAP },
];

const securityOptions = [
  { label: 'Unsecure(0)', value: PTSecurity.SECURITY_0 },
  { label: 'Secure(1)', value: PTSecurity.SECURITY_1 },
  { label: 'Secure(2)', value: PTSecurity.SECURITY_2 },
];

export function CreateDeviceScreen() {
  const [deviceName, setDeviceName] = useState('');
  const [transport, setTransport] = useState<PTTransport>(PTTransport.TRANSPORT_BLE);
  const [security, setSecurity] = useState<PTSecurity>(PTSecurity.SECURITY_0);
  const [softAPPassword, setSoftAPPassword] = useState('');
  const [pop, setPop] = useState('');
  const [username, setUsername] = useState('');
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

  const handleCreateDevice = async () => {
    try {
      setIsLoading(true);
      await createESPDevice(
        deviceName,
        transport,
        security,
        security > PTSecurity.SECURITY_0 ? pop : undefined,
        transport === PTTransport.TRANSPORT_SOFTAP ? softAPPassword : undefined,
        security === PTSecurity.SECURITY_2 ? username : undefined
      );

      setNotification({
        message: `Device ${deviceName} created successfully!`,
        type: 'success',
        visible: true,
      });
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to create device',
        type: 'error',
        visible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showSoftAPPassword = transport === PTTransport.TRANSPORT_SOFTAP;
  const showPop = security > PTSecurity.SECURITY_0;
  const showUsername = security === PTSecurity.SECURITY_2;

  return (
    <ScrollView style={styles.container}>
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

      {showSoftAPPassword && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>SoftAP Password</Text>
          <TextInput
            style={styles.input}
            value={softAPPassword}
            onChangeText={setSoftAPPassword}
            placeholder="Enter SoftAP password"
            secureTextEntry
            textContentType="none"
            editable={!isLoading}
          />
        </View>
      )}

      {showPop && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            {security === PTSecurity.SECURITY_2 ? 'Password' : 'Proof of Possession'}
          </Text>
          <TextInput
            style={styles.input}
            value={pop}
            onChangeText={setPop}
            placeholder={
              security === PTSecurity.SECURITY_2 ? 'Enter password' : 'Enter proof of possession'
            }
            secureTextEntry
            textContentType="none"
            editable={!isLoading}
          />
        </View>
      )}

      {showUsername && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            editable={!isLoading}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleCreateDevice}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Device</Text>
        )}
      </TouchableOpacity>
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
