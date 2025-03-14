import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrialStackParamList } from '../../../navigation/types';
import { Trial, Treatment, Plot, ObservationProtocol } from '../../../core/models/Types';
import { Ionicons } from '@expo/vector-icons';

// Mock data
const mockTrials: Record<string, Trial> = {
  '1': {
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
  '2': {
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
  '3': {
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
};

const mockTreatments: Record<string, Treatment[]> = {
  '1': [
    { id: 't1', trialId: '1', name: 'Hybrid A', color: '#FF5722', factors: { hybrid: 'A', irrigation: 'standard' } },
    { id: 't2', trialId: '1', name: 'Hybrid B', color: '#3F51B5', factors: { hybrid: 'B', irrigation: 'standard' } },
    { id: 't3', trialId: '1', name: 'Hybrid C', color: '#009688', factors: { hybrid: 'C', irrigation: 'standard' } },
    { id: 't4', trialId: '1', name: 'Hybrid D', color: '#FFC107', factors: { hybrid: 'D', irrigation: 'standard' } },
    { id: 't5', trialId: '1', name: 'Hybrid E', color: '#9C27B0', factors: { hybrid: 'E', irrigation: 'standard' } },
  ]
};

const mockProtocols: Record<string, ObservationProtocol[]> = {
  '1': [
    {
      id: 'p1',
      trialId: '1',
      name: 'Emergence Count',
      description: 'Count of emerged plants per plot',
      startDate: '2024-05-25',
      endDate: '2024-06-05',
      metrics: [
        {
          id: 'm1',
          protocolId: 'p1',
          name: 'Plant Count',
          type: 'integer',
          required: true,
        }
      ]
    },
    {
      id: 'p2',
      trialId: '1',
      name: 'Growth Stage Assessment',
      description: 'Assessment of corn growth stages',
      startDate: '2024-06-15',
      endDate: '2024-08-15',
      frequency: 'Weekly',
      metrics: [
        {
          id: 'm2',
          protocolId: 'p2',
          name: 'Growth Stage',
          type: 'categorical',
          required: true,
          validationRules: {
            options: [
              { value: 'V1', label: 'V1 - First leaf' },
              { value: 'V2', label: 'V2 - Second leaf' },
              { value: 'V3', label: 'V3 - Third leaf' },
              { value: 'V4', label: 'V4 - Fourth leaf' },
              { value: 'VT', label: 'VT - Tasseling' },
              { value: 'R1', label: 'R1 - Silking' },
              { value: 'R2', label: 'R2 - Blister' },
              { value: 'R3', label: 'R3 - Milk' },
              { value: 'R4', label: 'R4 - Dough' },
              { value: 'R5', label: 'R5 - Dent' },
              { value: 'R6', label: 'R6 - Maturity' }
            ]
          }
        },
        {
          id: 'm3',
          protocolId: 'p2',
          name: 'Plant Height',
          type: 'numeric',
          unit: 'cm',
          required: true,
          validationRules: {
            min: 0,
            max: 400
          }
        }
      ]
    }
  ]
};

type TrialDetailsScreenNavigationProp = NativeStackNavigationProp<TrialStackParamList, 'TrialDetails'>;
type TrialDetailsScreenRouteProp = RouteProp<TrialStackParamList, 'TrialDetails'>;

const TrialDetailsScreen = () => {
  const [trial, setTrial] = useState<Trial | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [protocols, setProtocols] = useState<ObservationProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation<TrialDetailsScreenNavigationProp>();
  const route = useRoute<TrialDetailsScreenRouteProp>();
  const { trialId } = route.params;

  useEffect(() => {
    // In a real app, these would be API or database calls
    fetchTrialData();
  }, [trialId]);

  const fetchTrialData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        const trialData = mockTrials[trialId];
        const treatmentData = mockTreatments[trialId] || [];
        const protocolData = mockProtocols[trialId] || [];
        
        if (trialData) {
          setTrial(trialData);
          setTreatments(treatmentData);
          setProtocols(protocolData);
        }
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching trial data:', error);
      setLoading(false);
    }
  };

  const navigateToPlotsList = () => {
    if (trial) {
      navigation.navigate('PlotsList', { trialId: trial.id });
    }
  };

  const navigateToMap = () => {
    // Navigate to the map view focused on this trial
    navigation.navigate('Map' as any, {
      screen: 'MapOverview',
      params: { trialId: trialId }
    });
  };

  const navigateToObservations = () => {
    // Navigate to observations for this trial
    navigation.navigate('Observations' as any, {
      screen: 'ObservationsList',
      params: { trialId: trialId }
    });
  };

  const getStatusColor = (status: Trial['status']) => {
    switch (status) {
      case 'planned': return '#FFC107'; // Yellow
      case 'active': return '#4CAF50'; // Green
      case 'completed': return '#2196F3'; // Blue
      default: return '#9E9E9E'; // Grey
    }
  };

  const getStatusLabel = (status: Trial['status']) => {
    switch (status) {
      case 'planned': return 'Planned';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading trial details...</Text>
      </View>
    );
  }

  if (!trial) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorText}>Trial not found</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progressPercentage = trial.totalObservations 
    ? Math.round((trial.completedObservations || 0) / trial.totalObservations * 100) 
    : 0;

  return (
    <ScrollView style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{trial.name}</Text>
          <View 
            style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(trial.status) }
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(trial.status)}</Text>
          </View>
        </View>
        
        <Text style={styles.description}>{trial.description}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{trial.location || 'No location'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="leaf-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{trial.cropType || 'Unknown crop'}</Text>
          </View>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {trial.startDate?.split('T')[0] || 'No date'} - {trial.actualEndDate?.split('T')[0] || trial.plannedEndDate?.split('T')[0] || 'Ongoing'}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Progress section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Progress</Text>
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBackground} />
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%`, backgroundColor: getStatusColor(trial.status) }
              ]} 
            />
          </View>
          
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trial.completedObservations || 0}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trial.totalObservations || 0}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trial.plotCount || 0}</Text>
              <Text style={styles.statLabel}>Plots</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={navigateToPlotsList}
        >
          <Ionicons name="grid-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>View Plots</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={navigateToMap}
        >
          <Ionicons name="map-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>Open Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={navigateToObservations}
        >
          <Ionicons name="clipboard-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>Observations</Text>
        </TouchableOpacity>
      </View>
      
      {/* Treatments section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Treatments</Text>
        
        {treatments.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.treatmentsContainer}>
            {treatments.map(treatment => (
              <View 
                key={treatment.id} 
                style={[styles.treatmentItem, { borderLeftColor: treatment.color }]}
              >
                <Text style={styles.treatmentName}>{treatment.name}</Text>
                {treatment.description && (
                  <Text style={styles.treatmentDescription}>{treatment.description}</Text>
                )}
                {treatment.factors && Object.entries(treatment.factors).map(([key, value]) => (
                  <Text key={key} style={styles.treatmentFactor}>
                    <Text style={styles.factorKey}>{key}: </Text>
                    <Text>{value}</Text>
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No treatments defined for this trial</Text>
        )}
      </View>
      
      {/* Protocols section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Observation Protocols</Text>
        
        {protocols.length > 0 ? (
          <View style={styles.protocolsList}>
            {protocols.map(protocol => (
              <View key={protocol.id} style={styles.protocolItem}>
                <View style={styles.protocolHeader}>
                  <Text style={styles.protocolName}>{protocol.name}</Text>
                  {protocol.frequency && (
                    <Text style={styles.protocolFrequency}>{protocol.frequency}</Text>
                  )}
                </View>
                
                <Text style={styles.protocolDescription}>
                  {protocol.description || 'No description available'}
                </Text>
                
                <Text style={styles.protocolDates}>
                  {protocol.startDate?.split('T')[0] || 'No start date'} - {protocol.endDate?.split('T')[0] || 'No end date'}
                </Text>
                
                <View style={styles.metricsContainer}>
                  <Text style={styles.metricsTitle}>Metrics:</Text>
                  {protocol.metrics.map(metric => (
                    <View key={metric.id} style={styles.metricItem}>
                      <Text style={styles.metricName}>{metric.name}</Text>
                      <Text style={styles.metricType}>
                        {metric.type}
                        {metric.unit ? ` (${metric.unit})` : ''}
                        {metric.required ? ' *' : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No observation protocols defined</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressSection: {
    alignItems: 'center',
  },
  progressInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
  },
  progressBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EEEEEE',
  },
  progressFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionButtonText: {
    marginTop: 4,
    color: '#4CAF50',
    fontWeight: '500',
  },
  treatmentsContainer: {
    flexDirection: 'row',
  },
  treatmentItem: {
    backgroundColor: 'white',
    borderLeftWidth: 4,
    borderRadius: 4,
    padding: 12,
    marginRight: 12,
    minWidth: 150,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  treatmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  treatmentFactor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  factorKey: {
    fontWeight: '500',
    color: '#555',
  },
  protocolsList: {
    marginTop: 8,
  },
  protocolItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  protocolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  protocolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  protocolFrequency: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  protocolDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  protocolDates: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  metricsContainer: {
    marginTop: 4,
  },
  metricsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 6,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  metricName: {
    fontSize: 14,
    color: '#333',
  },
  metricType: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 16,
  },
});

export default TrialDetailsScreen;