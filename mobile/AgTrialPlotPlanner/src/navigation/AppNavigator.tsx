import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from './types';
import { checkAuthStatus } from '../core/store/authSlice';
import { AppDispatch, RootState } from '../core/store';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Create stacks
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  // Check auth status on app start
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // While checking auth, show splash or loading screen
  if (isLoading) {
    // In a real app, you might want to show a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;