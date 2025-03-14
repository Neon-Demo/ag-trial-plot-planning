import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../core/store';
import { setUser } from '../../../core/store/authSlice';

type UserProfileSetupScreenProps = {
  route: {
    params: {
      userId: string;
      organizationId: string;
    };
  };
};

/**
 * User Profile Setup Screen
 * Based on screen breakdown 1.1 - Authentication & Onboarding
 * - Profile information input
 * - Preference settings
 * - Notification preferences
 */
const UserProfileSetupScreen = ({ route }: UserProfileSetupScreenProps) => {
  const { userId, organizationId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('user@example.com'); // This would come from SSO provider
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Preferences
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [dataCollectionMode, setDataCollectionMode] = useState<'standard' | 'advanced'>('standard');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [dailySummaries, setDailySummaries] = useState(false);
  
  const handleCompleteSetup = () => {
    // Validate form
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Required Fields', 'Please enter your first and last name to continue.');
      return;
    }
    
    // In a real app, you would send this data to the server
    // Here we'll just update the local state
    dispatch(setUser({
      id: userId,
      email: email,
      firstName,
      lastName,
      organizations: [organizationId],
      preferences: {
        units,
        notificationPreferences: {
          enableNotifications,
          emailNotifications,
          pushNotifications,
          dailySummaries,
        },
        displaySettings: {
          highContrastMode,
          dataCollectionMode,
        },
      },
    }));
    
    // Navigate to main app
    // In a real app this would be handled by the auth state change
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile Setup</Text>
          </View>
          
          <Text style={styles.subtitle}>
            Complete your profile to get started
          </Text>
          
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#FFFFFF" />
              </View>
              <TouchableOpacity style={styles.editProfileImageButton}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Personal Information Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Job Title</Text>
              <TextInput
                style={styles.input}
                value={jobTitle}
                onChangeText={setJobTitle}
                placeholder="Enter your job title"
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: '#F5F5F5' }]}
                value={email}
                editable={false}
                selectTextOnFocus={false}
              />
              <Text style={styles.inputNote}>Email provided by SSO provider</Text>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          {/* Preferences Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>App Preferences</Text>
            
            <View style={styles.settingContainer}>
              <Text style={styles.settingLabel}>Measurement Units</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    units === 'metric' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setUnits('metric')}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      units === 'metric' && styles.segmentButtonTextActive,
                    ]}
                  >
                    Metric
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    units === 'imperial' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setUnits('imperial')}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      units === 'imperial' && styles.segmentButtonTextActive,
                    ]}
                  >
                    Imperial
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.settingContainer}>
              <Text style={styles.settingLabel}>Data Collection Mode</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    dataCollectionMode === 'standard' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setDataCollectionMode('standard')}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      dataCollectionMode === 'standard' && styles.segmentButtonTextActive,
                    ]}
                  >
                    Standard
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    dataCollectionMode === 'advanced' && styles.segmentButtonActive,
                  ]}
                  onPress={() => setDataCollectionMode('advanced')}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      dataCollectionMode === 'advanced' && styles.segmentButtonTextActive,
                    ]}
                  >
                    Advanced
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.switchLabel}>High Contrast Mode</Text>
                <Text style={styles.switchDescription}>
                  Improve visibility in bright field conditions
                </Text>
              </View>
              <Switch
                value={highContrastMode}
                onValueChange={setHighContrastMode}
                trackColor={{ false: '#D1D1D1', true: '#81C784' }}
                thumbColor={highContrastMode ? '#4CAF50' : '#F5F5F5'}
              />
            </View>
          </View>
          
          {/* Notification Preferences */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            
            <View style={styles.switchContainer}>
              <View>
                <Text style={styles.switchLabel}>Enable Notifications</Text>
                <Text style={styles.switchDescription}>
                  Receive updates about your trials and observations
                </Text>
              </View>
              <Switch
                value={enableNotifications}
                onValueChange={setEnableNotifications}
                trackColor={{ false: '#D1D1D1', true: '#81C784' }}
                thumbColor={enableNotifications ? '#4CAF50' : '#F5F5F5'}
              />
            </View>
            
            {enableNotifications && (
              <>
                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.switchLabel}>Email Notifications</Text>
                    <Text style={styles.switchDescription}>
                      Receive notifications via email
                    </Text>
                  </View>
                  <Switch
                    value={emailNotifications}
                    onValueChange={setEmailNotifications}
                    trackColor={{ false: '#D1D1D1', true: '#81C784' }}
                    thumbColor={emailNotifications ? '#4CAF50' : '#F5F5F5'}
                  />
                </View>
                
                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.switchLabel}>Push Notifications</Text>
                    <Text style={styles.switchDescription}>
                      Receive push notifications on this device
                    </Text>
                  </View>
                  <Switch
                    value={pushNotifications}
                    onValueChange={setPushNotifications}
                    trackColor={{ false: '#D1D1D1', true: '#81C784' }}
                    thumbColor={pushNotifications ? '#4CAF50' : '#F5F5F5'}
                  />
                </View>
                
                <View style={styles.switchContainer}>
                  <View>
                    <Text style={styles.switchLabel}>Daily Summaries</Text>
                    <Text style={styles.switchDescription}>
                      Receive a daily summary of all activities
                    </Text>
                  </View>
                  <Switch
                    value={dailySummaries}
                    onValueChange={setDailySummaries}
                    trackColor={{ false: '#D1D1D1', true: '#81C784' }}
                    thumbColor={dailySummaries ? '#4CAF50' : '#F5F5F5'}
                  />
                </View>
              </>
            )}
          </View>
          
          {/* Complete Button */}
          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleCompleteSetup}
          >
            <Text style={styles.completeButtonText}>Complete Setup</Text>
          </TouchableOpacity>
          
          <Text style={styles.termsText}>
            By completing setup, you agree to our Terms of Service and Privacy Policy
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
  },
  // Profile image styles
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  // Form styles
  formSection: {
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4CAF50',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#424242',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  inputNote: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  settingContainer: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#424242',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#4CAF50',
  },
  segmentButtonText: {
    color: '#424242',
    fontWeight: '500',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
  switchDescription: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
    maxWidth: '80%',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#757575',
    marginBottom: 24,
  }
});

export default UserProfileSetupScreen;