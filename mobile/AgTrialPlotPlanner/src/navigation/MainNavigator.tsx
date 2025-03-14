import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HomeScreen from '../features/home/HomeScreen';
import TrialsNavigator from './TrialsNavigator';
import MapNavigator from './MapNavigator';
import ObservationsNavigator from './ObservationsNavigator';
import SettingsNavigator from './SettingsNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="home" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Trials"
        component={TrialsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="list" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="map" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Observations"
        component={ObservationsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="edit" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="settings" size={26} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
});

export default MainNavigator;