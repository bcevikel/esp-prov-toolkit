import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  CreateDevice: undefined;
  InspectDevice: undefined;
  ConnectDevice: undefined;
  ScanDevices: undefined;
  ProvisionDevice: undefined;
  SendData: undefined;
  SearchDevices: undefined;
  LocationPermissions: undefined;
  Utils: undefined;
  SoftapProv: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ESP Provisioning Toolkit</Text>
      <Text style={styles.sectionHeader}>Native API Calls</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchDevices')}>
        <Text style={styles.buttonText}>Search ESP Devices</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateDevice')}>
        <Text style={styles.buttonText}>Create Device</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConnectDevice')}>
        <Text style={styles.buttonText}>Connect to Device</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ScanDevices')}>
        <Text style={styles.buttonText}>Scan WiFi Networks</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InspectDevice')}>
        <Text style={styles.buttonText}>Inspect Device</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProvisionDevice')}
      >
        <Text style={styles.buttonText}>Provision Device</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SendData')}>
        <Text style={styles.buttonText}>Send Data</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Utils')}>
        <Text style={styles.buttonText}>Utils</Text>
      </TouchableOpacity>
      <Text style={styles.sectionHeader}>Provisioning Flows</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SoftapProv')}>
        <Text style={styles.buttonText}>SoftAP Provisioning</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
