import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrialStackParamList } from './types';

// Import the trial screens
import TrialsListScreen from '../features/trials/screens/TrialsListScreen';
import TrialDetailsScreen from '../features/trials/screens/TrialDetailsScreen';
import PlotsListScreen from '../features/trials/screens/PlotsListScreen';
import PlotDetailsScreen from '../features/trials/screens/PlotDetailsScreen';

const Stack = createNativeStackNavigator<TrialStackParamList>();

const TrialsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="TrialsList"
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
        name="TrialsList" 
        component={TrialsListScreen}
        options={{ title: 'Trials' }} 
      />
      <Stack.Screen 
        name="TrialDetails" 
        component={TrialDetailsScreen}
        options={({ route }) => ({ 
          title: 'Trial Details' 
        })} 
      />
      <Stack.Screen 
        name="PlotsList" 
        component={PlotsListScreen}
        options={({ route }) => ({ 
          title: 'Plots'
        })} 
      />
      <Stack.Screen 
        name="PlotDetails" 
        component={PlotDetailsScreen}
        options={({ route }) => ({ 
          title: `Plot ${route.params?.plotId.replace('p', '')}`,
          headerBackTitle: 'Back'
        })} 
      />
    </Stack.Navigator>
  );
};

export default TrialsNavigator;