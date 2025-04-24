/* eslint-disable react-native/no-inline-styles */
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateDeviceScreen } from './screens/CreateDeviceScreen';
import { HomeScreen } from './screens/HomeScreen';
import { InspectDeviceScreen } from './screens/InspectDeviceScreen';
import { ConnectDeviceScreen } from './screens/ConnectDeviceScreen';
import { ScanDevicesScreen } from './screens/ScanDevicesScreen';
import { ProvisionDeviceScreen } from './screens/ProvisionDeviceScreen';
import { SendDataScreen } from './screens/SendDataScreen';
import { SearchDevicesScreen } from './screens/SearchDevicesScreen';
import { UtilsScreen } from './screens/UtilsScreen';
import { SoftapProvScreen } from './screens/SoftapProvScreen';

export type RootStackParamList = {
  Home: undefined;
  CreateDevice: undefined;
  InspectDevice: undefined;
  ConnectDevice: undefined;
  ScanDevices: undefined;
  ProvisionDevice: undefined;
  SendData: undefined;
  SearchDevices: undefined;
  Utils: undefined;
  SoftapProv: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            contentStyle: {
              paddingTop: 40,
              backgroundColor: 'transparent',
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CreateDevice" component={CreateDeviceScreen} />
          <Stack.Screen name="InspectDevice" component={InspectDeviceScreen} />
          <Stack.Screen name="ConnectDevice" component={ConnectDeviceScreen} />
          <Stack.Screen name="ScanDevices" component={ScanDevicesScreen} />
          <Stack.Screen name="ProvisionDevice" component={ProvisionDeviceScreen} />
          <Stack.Screen name="SendData" component={SendDataScreen} />
          <Stack.Screen name="SearchDevices" component={SearchDevicesScreen} />
          <Stack.Screen name="Utils" component={UtilsScreen} />
          <Stack.Screen name="SoftapProv" component={SoftapProvScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
