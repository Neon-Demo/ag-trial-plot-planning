import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapStackParamList } from './types';

// Import implemented screens
import MapOverviewScreen from '../features/map/screens/MapOverviewScreen';
import RoutePlanningScreen from '../features/map/screens/RoutePlanningScreen';
import NavigationScreen from '../features/map/screens/NavigationScreen';

const Stack = createNativeStackNavigator<MapStackParamList>();

const MapNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MapOverview"
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
        name="MapOverview" 
        component={MapOverviewScreen}
        options={{ 
          title: 'Field Map',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="RoutePlanning" 
        component={RoutePlanningScreen}
        options={{ 
          title: 'Route Planning',
          headerBackTitle: 'Map'
        }} 
      />
      <Stack.Screen 
        name="Navigation" 
        component={NavigationScreen}
        options={{ 
          title: 'Navigate',
          headerShown: false // Navigation screen has its own custom header
        }} 
      />
    </Stack.Navigator>
  );
};

export default MapNavigator;