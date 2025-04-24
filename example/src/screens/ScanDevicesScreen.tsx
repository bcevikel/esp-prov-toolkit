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
import { scanWifiListOfESPDevice, type PTWifiEntry } from 'react-native-esp-prov-toolkit';

interface WifiListItemProps {
  wifi: PTWifiEntry;
}

function WifiListItem({ wifi }: WifiListItemProps) {
  return (
    <View style={styles.wifiItem}>
      <View style={styles.wifiHeader}>
        <Text style={styles.wifiSSID}>{wifi.ssid}</Text>
        <Text style={styles.wifiRSSI}>{wifi.rssi} dBm</Text>
      </View>
      <View style={styles.wifiDetails}>
        {wifi.bssid && <Text style={styles.wifiDetail}>BSSID: {wifi.bssid}</Text>}
        {wifi.channel && <Text style={styles.wifiDetail}>Channel: {wifi.channel}</Text>}
        <Text style={styles.wifiDetail}>Auth: {wifi.auth}</Text>
      </View>
    </View>
  );
}

export function ScanDevicesScreen() {
  const [deviceName, setDeviceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState<PTWifiEntry[]>([]);

  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false,
  });

  const handleScan = async () => {
    try {
      setIsLoading(true);
      const networks = await scanWifiListOfESPDevice(deviceName);
      setWifiNetworks(networks);

      setNotification({
        message: `Found ${networks.length} WiFi networks`,
        type: 'info',
        visible: true,
      });
    } catch (error) {
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to scan WiFi networks',
        type: 'error',
        visible: true,
      });
      setWifiNetworks([]);
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

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleScan}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Scan WiFi Networks</Text>
        )}
      </TouchableOpacity>

      <ScrollView style={styles.wifiList}>
        {wifiNetworks.map((wifi, index) => (
          <WifiListItem key={`${wifi.ssid}-${index}`} wifi={wifi} />
        ))}
      </ScrollView>
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
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  wifiList: {
    flex: 1,
  },
  wifiItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  wifiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wifiSSID: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  wifiRSSI: {
    fontSize: 14,
    color: '#666',
  },
  wifiDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wifiDetail: {
    fontSize: 14,
    color: '#666',
  },
});
