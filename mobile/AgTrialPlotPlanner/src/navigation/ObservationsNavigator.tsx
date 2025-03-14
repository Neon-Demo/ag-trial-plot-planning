import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ObservationStackParamList } from './types';
import { Text, View } from 'react-native';

// Import the implemented screens
import ObservationsListScreen from '../features/observations/screens/ObservationsListScreen';

// Placeholder components - these will be implemented next
const ObservationFormScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Observation Form Screen</Text>
  </View>
);

const ImageCaptureScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Image Capture Screen</Text>
  </View>
);

const BatchObservationScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Batch Observation Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator<ObservationStackParamList>();

const ObservationsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ObservationsList"
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
        name="ObservationsList" 
        component={ObservationsListScreen}
        options={{ title: 'Observations' }} 
      />
      <Stack.Screen 
        name="ObservationForm" 
        component={ObservationFormScreen}
        options={({ route }) => ({ 
          title: route.params.observationId ? 'Edit Observation' : 'New Observation',
          headerBackTitle: 'Back'
        })} 
      />
      <Stack.Screen 
        name="ImageCapture" 
        component={ImageCaptureScreen}
        options={{ 
          title: 'Capture Image',
          headerBackTitle: 'Cancel'
        }} 
      />
      <Stack.Screen 
        name="BatchObservation" 
        component={BatchObservationScreen}
        options={{ 
          title: 'Batch Observations',
          headerBackTitle: 'Back'
        }} 
      />
    </Stack.Navigator>
  );
};

export default ObservationsNavigator;