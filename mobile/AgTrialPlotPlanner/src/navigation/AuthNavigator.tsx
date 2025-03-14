import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import LoginScreen from '../features/authentication/screens/LoginScreen';
import OrganizationSelectionScreen from '../features/authentication/screens/OrganizationSelectionScreen';
import UserProfileSetupScreen from '../features/authentication/screens/UserProfileSetupScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OrganizationSelection" component={OrganizationSelectionScreen} />
      <Stack.Screen name="UserProfileSetup" component={UserProfileSetupScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;