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
import { NotificationBar, type NotificationType } from '../components/NotificationBar';
import { sendDataToESPDevice } from 'react-native-esp-prov-toolkit';

export function SendDataScreen() {
  const [deviceName, setDeviceName] = useState('');
  const [path, setPath] = useState('');
  const [data, setData] = useState('');
  const [response, setResponse] = useState('');
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

  const handleSendData = async () => {
    try {
      setIsLoading(true);
      const result = await sendDataToESPDevice(deviceName, path, data);
      setResponse(result);
      setNotification({
        message: 'Data sent successfully',
        type: 'success',
        visible: true,
      });
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to send data',
        type: 'error',
        visible: true,
      });
    } finally {
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
        <Text style={styles.label}>Path</Text>
        <TextInput
          style={styles.input}
          value={path}
          onChangeText={setPath}
          placeholder="Enter path"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Base64 Data</Text>
        <TextInput
          style={[styles.input, styles.largeInput]}
          value={data}
          onChangeText={setData}
          placeholder="Enter base64 data"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSendData}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Send Data</Text>
        )}
      </TouchableOpacity>

      {response ? (
        <View style={styles.responseContainer}>
          <Text style={styles.label}>Response</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}
            value={response}
            placeholder="Response will appear here"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={false}
          />
        </View>
      ) : null}
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
  largeInput: {
    height: 120,
    textAlignVertical: 'top',
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
  responseContainer: {
    marginTop: 24,
  },
});
