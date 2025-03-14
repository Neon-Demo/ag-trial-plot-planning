import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrialStackParamList } from '../../../navigation/types';
import { Trial } from '../../../core/models/Types';
import { Ionicons } from '@expo/vector-icons';

// Mock data for development
const mockTrials: Trial[] = [
  {
    id: '1',
    organizationId: 'org1',
    name: 'Corn Hybrid Trial 2024',
    description: 'Evaluating performance of 5 corn hybrids under different irrigation regimes',
    location: 'North Field',
    cropType: 'Corn',
    status: 'active',
    startDate: '2024-05-15',
    plannedEndDate: '2024-09-30',
    plotCount: 120,
    completedObservations: 45,
    totalObservations: 240
  },
  {
    id: '2',
    organizationId: 'org1',
    name: 'Soybean Variety Trial',
    description: 'Comparing 8 soybean varieties for yield and disease resistance',
    location: 'South Field',
    cropType: 'Soybean',
    status: 'planned',
    startDate: '2024-06-01',
    plannedEndDate: '2024-10-15',
    plotCount: 96,
    completedObservations: 0,
    totalObservations: 192
  },
  {
    id: '3',
    organizationId: 'org1',
    name: 'Wheat Fertilizer Test',
    description: 'Testing nitrogen application rates on winter wheat',
    location: 'East Field',
    cropType: 'Wheat',
    status: 'completed',
    startDate: '2023-09-15',
    plannedEndDate: '2024-06-15',
    actualEndDate: '2024-06-10',
    plotCount: 60,
    completedObservations: 180,
    totalObservations: 180
  }
];

type TrialsListScreenNavigationProp = NativeStackNavigationProp<TrialStackParamList, 'TrialsList'>;

const TrialsListScreen = () => {
  const [trials, setTrials] = useState<Trial[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<TrialsListScreenNavigationProp>();

  useEffect(() => {
    // In a real app, this would fetch from an API or local database
    fetchTrials();
  }, []);

  const fetchTrials = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setTrials(mockTrials);
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching trials:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrials();
  };

  const navigateToTrialDetails = (trialId: string) => {
    navigation.navigate('TrialDetails', { trialId });
  };

  const getStatusColor = (status: Trial['status']) => {
    switch (status) {
      case 'planned':
        return '#FFC107'; // Yellow
      case 'active':
        return '#4CAF50'; // Green
      case 'completed':
        return '#2196F3'; // Blue
      default:
        return '#9E9E9E'; // Grey
    }
  };

  const getStatusIcon = (status: Trial['status']) => {
    switch (status) {
      case 'planned':
        return 'calendar-outline';
      case 'active':
        return 'play-circle-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const renderTrialItem = ({ item }: { item: Trial }) => {
    const statusColor = getStatusColor(item.status);
    const progressPercentage = item.totalObservations 
      ? Math.round((item.completedObservations || 0) / item.totalObservations * 100) 
      : 0;
    
    return (
      <TouchableOpacity 
        style={styles.trialCard} 
        onPress={() => navigateToTrialDetails(item.id)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]}>
            <Ionicons name={getStatusIcon(item.status)} size={16} color="white" />
          </View>
          <Text style={styles.trialName}>{item.name}</Text>
        </View>
        
        <Text style={styles.trialDescription} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>
        
        <View style={styles.trialDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.location || 'No location'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="leaf-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.cropType || 'Unknown crop'}</Text>
          </View>
        </View>
        
        <View style={styles.trialStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Plots</Text>
            <Text style={styles.statValue}>{item.plotCount || 0}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progress</Text>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${progressPercentage}%`, backgroundColor: statusColor }
                ]} 
              />
              <Text style={styles.progressText}>
                {progressPercentage}% ({item.completedObservations || 0}/{item.totalObservations || 0})
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>
            {item.status === 'completed' 
              ? `Completed: ${item.actualEndDate?.split('T')[0] || 'Unknown'}`
              : `Started: ${item.startDate?.split('T')[0] || 'Not started'}`}
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading trials...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={trials}
        renderItem={renderTrialItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="flask-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>No trials available</Text>
            <Text style={styles.emptySubText}>
              Pull down to refresh or contact your administrator to set up trials
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  trialCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  trialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  trialDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  trialDetails: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  trialStats: {
    marginBottom: 12,
  },
  statItem: {
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default TrialsListScreen;