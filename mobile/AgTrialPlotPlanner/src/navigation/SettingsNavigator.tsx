import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from './types';
import { Text, View } from 'react-native';

// Placeholder components - these would be replaced with actual screens
const SettingsListScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Settings List Screen</Text>
  </View>
);

const AppSettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>App Settings Screen</Text>
  </View>
);

const OfflineSettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Offline Settings Screen</Text>
  </View>
);

const EquipmentSettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Equipment Settings Screen</Text>
  </View>
);

const UserProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>User Profile Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="SettingsList" 
        component={SettingsListScreen}
        options={{ title: 'Settings' }} 
      />
      <Stack.Screen 
        name="AppSettings" 
        component={AppSettingsScreen}
        options={{ title: 'App Settings' }} 
      />
      <Stack.Screen 
        name="OfflineSettings" 
        component={OfflineSettingsScreen}
        options={{ title: 'Offline Mode' }} 
      />
      <Stack.Screen 
        name="EquipmentSettings" 
        component={EquipmentSettingsScreen}
        options={{ title: 'Equipment' }} 
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{ title: 'My Profile' }} 
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;