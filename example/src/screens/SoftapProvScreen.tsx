import { useCallback, memo, useState } from 'react';
import {
  Linking,
  Platform,
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {
  useSoftapProvisioning,
  PTSecurity,
  type PTWifiEntry,
  getErrorDescription,
} from 'react-native-esp-prov-toolkit';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Home: undefined;
  SoftapProv: undefined;
};
const DEVICE_PREFIX = 'REACT_';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SoftapProv'>;

const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

const openWifiSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('App-Prefs:root=WIFI');
  } else {
    Linking.openSettings();
  }
};

// A helper function to alert the user for location services
const alertForLocationPermssions = () => {
  setTimeout(() => {
    Alert.alert('Location Permission', 'This app needs location services to work.', [
      { text: 'Settings', onPress: () => openAppSettings() },
      { text: 'OK', style: 'default' },
    ]);
  }, 500);
};

interface WifiListProps {
  wifiList: PTWifiEntry[];
  onWifiSelect: (wifi: PTWifiEntry) => void;
}

interface WifiItemProps {
  wifi: PTWifiEntry;
  onPress: (wifi: PTWifiEntry) => void;
}

const WifiItem = memo(({ wifi, onPress }: WifiItemProps) => (
  <TouchableOpacity style={styles.wifiItem} onPress={() => onPress(wifi)}>
    <View style={styles.wifiHeader}>
      <Text style={styles.wifiSSID}>{wifi.ssid}</Text>
      <Text style={styles.wifiRSSI}>{wifi.rssi} dBm</Text>
    </View>
    <View style={styles.wifiDetails}>
      <Text style={styles.wifiDetail}>Channel: {wifi.channel}</Text>
      <Text style={styles.wifiDetail}>Auth: {wifi.auth}</Text>
    </View>
  </TouchableOpacity>
));

function WifiList({ wifiList, onWifiSelect }: WifiListProps) {
  const renderItem = useCallback(
    ({ item }: { item: PTWifiEntry }) => <WifiItem wifi={item} onPress={onWifiSelect} />,
    [onWifiSelect]
  );

  const keyExtractor = useCallback((item: PTWifiEntry) => item.ssid, []);

  return (
    <FlatList
      data={wifiList}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.wifiList}
      contentContainerStyle={styles.wifiListContent}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
    />
  );
}

export function SoftapProvScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedWifi, setSelectedWifi] = useState<PTWifiEntry | null>(null);
  const [password, setPassword] = useState('');
  const {
    provState: currentState,
    provError,
    wifiList,
    provisionDevice,
  } = useSoftapProvisioning(
    10000, // scanInterval
    10000, // promptTimeoutMs
    DEVICE_PREFIX, // devicePrefix
    PTSecurity.SECURITY_0, // security
    undefined, // username
    undefined, // proofOfPossession
    undefined, // softAPPassword
    alertForLocationPermssions // onLocationPermDenied
  );

  const handleWifiSelect = (wifi: PTWifiEntry) => {
    setSelectedWifi(wifi);
  };

  const handleProvision = async () => {
    if (selectedWifi && password) {
      await provisionDevice(selectedWifi.ssid, password);
    }
  };

  const renderSearchingState = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="wifi" size={64} color="#007AFF" style={styles.icon} />
        <Text style={styles.title}>Connect to Device</Text>
        <Text style={styles.subtitle}>
          Please connect to a device with prefix "{DEVICE_PREFIX}" from your phone's WiFi settings
        </Text>
        <TouchableOpacity style={styles.button} onPress={openWifiSettings}>
          <Text style={styles.buttonText}>Open WiFi Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderConnectingState = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#007AFF" style={styles.icon} />
        <Text style={styles.title}>Establishing Connection</Text>
        <Text style={styles.subtitle}>Please wait while we connect to the device...</Text>
      </View>
    </View>
  );

  const renderConnectedState = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="wifi" size={64} color="#00C851" style={styles.icon} />
        <Text style={styles.title}>Connected to Device</Text>
        <Text style={styles.subtitle}>Select a WiFi network to provision</Text>
        <WifiList wifiList={wifiList} onWifiSelect={handleWifiSelect} />
      </View>
    </View>
  );

  const renderProvisioningState = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#007AFF" style={styles.icon} />
        <Text style={styles.title}>Provisioning Device</Text>
        <Text style={styles.subtitle}>Please wait while we configure your device...</Text>
      </View>
    </View>
  );

  const renderSuccessState = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="checkmark-circle" size={64} color="#00C851" style={styles.icon} />
        <Text style={styles.title}>Provisioning Successful!</Text>
        <Text style={styles.subtitle}>Your device has been successfully configured.</Text>
        <TouchableOpacity
          style={[styles.button, styles.successButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFailureState = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="alert-circle" size={64} color="#FF3B30" style={styles.icon} />
        <Text style={styles.title}>Connection Failed</Text>
        <Text style={styles.subtitle}>
          {provError ? getErrorDescription(provError) : 'An unknown error occurred'}
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.errorButton]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPasswordInput = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="wifi" size={64} color="#007AFF" style={styles.icon} />
        <Text style={styles.title}>Enter WiFi Password</Text>
        <Text style={styles.subtitle}>Please enter the password for {selectedWifi?.ssid}</Text>
        <TextInput
          style={styles.input}
          placeholder="WiFi Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={[styles.button, !password && styles.disabledButton]}
          onPress={handleProvision}
          disabled={!password}
        >
          <Text style={styles.buttonText}>Provision Device</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentState === 'searching' && renderSearchingState()}
      {currentState === 'connecting' && renderConnectingState()}
      {currentState === 'connected' && !selectedWifi && renderConnectedState()}
      {currentState === 'connected' && selectedWifi && renderPasswordInput()}
      {currentState === 'provisioning' && renderProvisioningState()}
      {currentState === 'success' && renderSuccessState()}
      {currentState === 'failure' && renderFailureState()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  errorButton: {
    backgroundColor: '#FF3B30',
  },
  successButton: {
    backgroundColor: '#00C851',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  wifiList: {
    width: '100%',
    marginTop: 16,
  },
  wifiListContent: {
    paddingBottom: 16,
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
