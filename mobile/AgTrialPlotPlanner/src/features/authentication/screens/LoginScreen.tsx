import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import Logo from '../components/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../core/store';
import {
  loginWithGoogle,
  loginWithMicrosoft,
  loginWithDemo,
  clearError,
} from '../../../core/store/authSlice';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Clear any existing errors on component mount
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Show error alert if any error occurs
  React.useEffect(() => {
    if (error) {
      Alert.alert('Authentication Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle Google login
  const handleGoogleLogin = async () => {
    dispatch(loginWithGoogle());
  };

  // Handle Microsoft login
  const handleMicrosoftLogin = async () => {
    dispatch(loginWithMicrosoft());
  };

  // Handle Demo login
  const handleDemoLogin = async () => {
    dispatch(loginWithDemo());
  };

  // Toggle remember me
  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Logo size={100} />
            <Text style={styles.appTitle}>Ag Trial Plot Planner</Text>
            <Text style={styles.appSubtitle}>Optimize your field research</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.loginTitle}>Sign In</Text>
            
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <Ionicons name="logo-google" size={24} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Sign in with Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, styles.microsoftButton]}
                onPress={handleMicrosoftLogin}
                disabled={isLoading}
              >
                <Ionicons name="logo-microsoft" size={24} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Sign in with Microsoft</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, styles.demoButton]}
                onPress={handleDemoLogin}
                disabled={isLoading}
              >
                <Ionicons name="person" size={24} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Demo Mode</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.additionalOptionsContainer}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={toggleRememberMe}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
                <Text style={styles.rememberMeText}>Keep me signed in</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.offlineLoginContainer}>
                <Text style={styles.offlineLoginText}>Offline login</Text>
                <Ionicons name="chevron-forward" size={18} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
          
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Signing in...</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By logging in, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#757575',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212121',
    textAlign: 'center',
  },
  socialButtonsContainer: {
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  microsoftButton: {
    backgroundColor: '#0078D4',
  },
  demoButton: {
    backgroundColor: '#4CAF50',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  additionalOptionsContainer: {
    marginTop: 10,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  rememberMeText: {
    color: '#616161',
    fontSize: 14,
  },
  offlineLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  offlineLoginText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
  },
});

export default LoginScreen;