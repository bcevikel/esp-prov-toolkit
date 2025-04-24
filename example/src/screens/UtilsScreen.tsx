import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocationPermissions, PTLocationAccess } from 'react-native-esp-prov-toolkit';
import { getCurrentNetworkSSID, getIPv4AddressOfESPDevice } from 'react-native-esp-prov-toolkit';

export function UtilsScreen() {
  const { locationAccess, requestLocationPermission } = useLocationPermissions();
  const [deviceName, setDeviceName] = useState('');
  const [SSIDText, setSSIDText] = useState<string>('No data to show.');
  const [ipAddress, setIpAddress] = useState<string>('No data to show');

  const onRequestIP = (name: string) => {
    try {
      const ipv4 = getIPv4AddressOfESPDevice(name);
      setIpAddress(ipv4 ? ipv4 : 'Unknown');
    } catch (error) {
      setIpAddress(error instanceof Error ? error.message : 'Failed to get SSID.');
    }
  };

  const onRequestSSID = () => {
    try {
      const ssid = getCurrentNetworkSSID();
      setSSIDText(ssid ? ssid : 'Unknown');
    } catch (error) {
      setSSIDText(error instanceof Error ? error.message : 'Failed to get SSID.');
    }
  };

  const getStatusText = () => {
    switch (locationAccess) {
      case PTLocationAccess.GRANTED:
        return 'Location permissions are granted';
      case PTLocationAccess.DENIED:
        return 'Location permissions are denied';
      case PTLocationAccess.NOT_DETERMINED:
        return 'Location permissions are not determined';
      default:
        return 'Unknown location permission status';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Permissions</Text>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        <TouchableOpacity style={styles.button} onPress={requestLocationPermission}>
          <Text style={styles.buttonText}>Request Location Permission</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Information</Text>
        <Text style={styles.statusText}>{SSIDText}</Text>
        <TouchableOpacity style={styles.button} onPress={onRequestSSID}>
          <Text style={styles.buttonText}>Request SSID</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        <TextInput
          style={styles.input}
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder="Enter device name"
        />
        <Text style={styles.statusText}>{ipAddress}</Text>
        <TouchableOpacity style={styles.button} onPress={() => onRequestIP(deviceName)}>
          <Text style={styles.buttonText}>Request IP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});
