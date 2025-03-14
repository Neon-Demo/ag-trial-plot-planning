import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/core/store';
import AppNavigator from './src/navigation/AppNavigator';
import { setupDatabase } from './src/core/database/DatabaseService';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  // Initialize the database when the app starts
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await setupDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initializeDatabase();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}