import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

// Mock data for organizations - Per screen breakdown 1.1 "Organization Selection Screen"
const organizations = [
  {
    id: 'org1',
    name: 'AgriResearch Inc.',
    description: 'Leading agricultural research organization',
    logoUrl: null,
    lastAccessed: new Date(2024, 2, 10),
  },
  {
    id: 'org2',
    name: 'University Ag Extension',
    description: 'University research department',
    logoUrl: null,
    lastAccessed: new Date(2024, 3, 1),
  },
  {
    id: 'org3',
    name: 'FarmTech Solutions',
    description: 'Innovative farming technologies',
    logoUrl: null,
    lastAccessed: null,
  },
  {
    id: 'org4',
    name: 'Agricultural Innovation Center',
    description: 'Advancing sustainable agricultural practices',
    logoUrl: null,
    lastAccessed: new Date(2024, 1, 15),
  },
];

type OrganizationSelectionScreenProps = {
  route: {
    params: {
      userId: string;
    };
  };
};

/**
 * Organization Selection Screen
 * Based on screen breakdown 1.1 - Authentication & Onboarding
 * - List of organizations user belongs to
 * - Organization details (logo, description)
 * - Last accessed indicator
 */
const OrganizationSelectionScreen = ({ route }: OrganizationSelectionScreenProps) => {
  const { userId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleSelectOrganization = (organizationId: string) => {
    navigation.navigate('UserProfileSetup', { userId, organizationId });
  };

  const renderOrganizationItem = ({ item }: { item: typeof organizations[0] }) => {
    const isRecentlyAccessed = item.lastAccessed && 
      (new Date().getTime() - item.lastAccessed.getTime()) / (1000 * 60 * 60 * 24) < 7;

    return (
      <TouchableOpacity 
        style={styles.organizationItem}
        onPress={() => handleSelectOrganization(item.id)}
      >
        <View style={styles.logoContainer}>
          {item.logoUrl ? (
            <Image source={{ uri: item.logoUrl }} style={styles.logo} />
          ) : (
            <View style={styles.placeholderLogo}>
              <Text style={styles.placeholderText}>{item.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.organizationDetails}>
          <Text style={styles.organizationName}>{item.name}</Text>
          <Text style={styles.organizationDescription}>{item.description}</Text>
          
          {isRecentlyAccessed && (
            <View style={styles.lastAccessedBadge}>
              <Ionicons name="time-outline" size={12} color="#4CAF50" />
              <Text style={styles.lastAccessedText}>Recently accessed</Text>
            </View>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={24} color="#BBBBBB" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Organization</Text>
      </View>
      
      <Text style={styles.subtitle}>
        Choose the organization you want to access
      </Text>
      
      <FlatList
        data={organizations}
        renderItem={renderOrganizationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createOrgButton}>
          <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
          <Text style={styles.createOrgText}>Create new organization</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  listContainer: {
    padding: 16,
  },
  organizationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  organizationDetails: {
    flex: 1,
  },
  organizationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  organizationDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  lastAccessedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  lastAccessedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  createOrgButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  createOrgText: {
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default OrganizationSelectionScreen;