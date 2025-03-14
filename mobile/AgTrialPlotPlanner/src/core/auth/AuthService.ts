import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { User, ApiResponse } from '../models/Types';
import { apiClient } from '../networking/ApiClient';

// Register for redirect
WebBrowser.maybeCompleteAuthSession();

// Constants
const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Demo user for testing without real auth
const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  organizations: ['demo-org-id'],
  preferences: {
    units: 'metric',
    notificationPreferences: {},
    displaySettings: {}
  }
};

// Google auth configuration
const googleAuthConfig = {
  clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'agtrialplanner'
  }),
  scopes: ['profile', 'email']
};

// Microsoft auth configuration
const microsoftAuthConfig = {
  clientId: 'YOUR_MICROSOFT_CLIENT_ID', // Replace with your actual client ID
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'agtrialplanner'
  }),
  scopes: ['profile', 'email', 'openid']
};

export class AuthService {
  // Check if user is logged in
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      return !!token; // If token exists, user is authenticated
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Get auth token
  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Login with demo account
  static async loginWithDemo(): Promise<{ user: User; token: string }> {
    try {
      // Create a demo token (in real app, this would come from server)
      const demoToken = 'demo-token-' + Date.now();
      
      // Store user and token in secure storage
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(DEMO_USER));
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, demoToken);
      
      return { user: DEMO_USER, token: demoToken };
    } catch (error) {
      console.error('Error logging in with demo account:', error);
      throw new Error('Failed to login with demo account');
    }
  }

  // Login with Google
  static async loginWithGoogle(): Promise<{ user: User; token: string }> {
    try {
      // Create Google auth request
      const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
      const request = new AuthSession.AuthRequest({
        clientId: googleAuthConfig.clientId,
        scopes: googleAuthConfig.scopes,
        redirectUri: googleAuthConfig.redirectUri,
      });

      // Start auth flow
      const result = await request.promptAsync(discovery);
      
      if (result.type === 'success') {
        // Exchange auth code for token on your backend
        const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/google/callback', { 
          code: result.params.code 
        });
        
        if (response.data.status === 'success' && response.data.data) {
          const { token, user } = response.data.data;
          
          // Store user and token
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
          
          return { user, token };
        }
        
        throw new Error('Failed to authenticate with Google');
      } else {
        throw new Error('Google authentication was cancelled or failed');
      }
    } catch (error) {
      console.error('Error logging in with Google:', error);
      throw error;
    }
  }

  // Login with Microsoft
  static async loginWithMicrosoft(): Promise<{ user: User; token: string }> {
    try {
      // Create Microsoft auth request
      const discovery = await AuthSession.fetchDiscoveryAsync('https://login.microsoftonline.com/common/v2.0');
      const request = new AuthSession.AuthRequest({
        clientId: microsoftAuthConfig.clientId,
        scopes: microsoftAuthConfig.scopes,
        redirectUri: microsoftAuthConfig.redirectUri,
      });

      // Start auth flow
      const result = await request.promptAsync(discovery);
      
      if (result.type === 'success') {
        // Exchange auth code for token on your backend
        const response = await apiClient.post<ApiResponse<{ token: string; user: User }>>('/auth/microsoft/callback', { 
          code: result.params.code 
        });
        
        if (response.data.status === 'success' && response.data.data) {
          const { token, user } = response.data.data;
          
          // Store user and token
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
          
          return { user, token };
        }
        
        throw new Error('Failed to authenticate with Microsoft');
      } else {
        throw new Error('Microsoft authentication was cancelled or failed');
      }
    } catch (error) {
      console.error('Error logging in with Microsoft:', error);
      throw error;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(AUTH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY)
      ]);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }
}