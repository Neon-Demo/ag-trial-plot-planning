import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';

// Constants
const API_URL = 'https://api.agroplot.com/v1'; // Will need to be updated for actual API
const AUTH_TOKEN_KEY = 'auth_token';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected && !config.headers?.['offline-allowed']) {
        throw new Error('No internet connection');
      }

      // Add authorization header if token exists
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      // If this is an offline-allowed request, let it continue
      if (config.headers?.['offline-allowed']) {
        return config;
      }
      return Promise.reject(error);
    }
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle token expiration (401 errors)
    if (error.response?.status === 401) {
      // Clear stored token
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      
      // Trigger authentication flow again
      // You might want to dispatch a logout action here or redirect to login
    }
    
    // Handle offline mode
    if (!error.response && error.message === 'Network Error') {
      // Store request in offline queue for later sync
      // This would be handled by a sync service
    }
    
    return Promise.reject(error);
  }
);

// Offline queue storage key
const OFFLINE_QUEUE_KEY = 'offline_request_queue';

// Function to queue a request for offline handling
export const queueOfflineRequest = async (request: AxiosRequestConfig): Promise<void> => {
  try {
    // Get existing queue
    const queueString = await SecureStore.getItemAsync(OFFLINE_QUEUE_KEY);
    const queue = queueString ? JSON.parse(queueString) : [];
    
    // Add new request to queue
    queue.push({
      ...request,
      timestamp: Date.now(),
    });
    
    // Save updated queue
    await SecureStore.setItemAsync(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error queuing offline request:', error);
  }
};

// Function to process offline queue when back online
export const processOfflineQueue = async (): Promise<void> => {
  try {
    // Get queue
    const queueString = await SecureStore.getItemAsync(OFFLINE_QUEUE_KEY);
    if (!queueString) return;
    
    const queue = JSON.parse(queueString);
    if (queue.length === 0) return;
    
    // Process each request
    const results = await Promise.allSettled(
      queue.map((request: AxiosRequestConfig) => apiClient(request))
    );
    
    // Filter out successful requests
    const remainingRequests = queue.filter((_, index) => {
      return results[index].status === 'rejected';
    });
    
    // Update queue with remaining failed requests
    await SecureStore.setItemAsync(OFFLINE_QUEUE_KEY, JSON.stringify(remainingRequests));
    
    // Return success/failure stats
    return {
      processed: queue.length,
      succeeded: queue.length - remainingRequests.length,
      failed: remainingRequests.length,
    };
  } catch (error) {
    console.error('Error processing offline queue:', error);
    throw error;
  }
};

// Export networkStatus utility
export const networkStatus = {
  isConnected: async (): Promise<boolean> => {
    const netInfo = await NetInfo.fetch();
    return !!netInfo.isConnected;
  },
  
  addConnectivityListener: (callback: (isConnected: boolean) => void): (() => void) => {
    // Add listener and return unsubscribe function
    return NetInfo.addEventListener(state => {
      callback(!!state.isConnected);
    });
  },
};