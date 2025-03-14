import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrialStackParamList } from '../../../navigation/types';
import { Plot, Treatment, Trial, Observation, ObservationProtocol } from '../../../core/models/Types';
import { Ionicons } from '@expo/vector-icons';

// Mock data (would be fetched from API/database in real app)
const mockPlot: Plot = {
  id: 'p1',
  trialId: '1',
  plotNumber: '1',
  treatmentId: 't1',
  replication: 1,
  coordinates: {
    type: 'Polygon',
    coordinates: [
      [
        [-95.001, 38.001],
        [-94.999, 38.001],
        [-94.999, 38.003],
        [-95.001, 38.003],
        [-95.001, 38.001],
      ]
    ]
  },
  centroid: {
    type: 'Point',
    coordinates: [-95.0, 38.002]
  },
  size: {
    value: 100,
    unit: 'm²'
  },
  status: 'observed',
  plantingDate: '2024-05-15',
  emergenceDate: '2024-05-22'
};

const mockTreatment: Treatment = {
  id: 't1',
  trialId: '1',
  name: 'Hybrid A',
  color: '#FF5722',
  description: 'Standard corn hybrid with drought resistance',
  factors: { 
    hybrid: 'A', 
    irrigation: 'standard',
    seedRate: '35000/acre',
    fertilizer: 'Standard NPK'
  }
};

const mockTrial: Trial = {
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
};

const mockObservations: Observation[] = [
  {
    id: 'o1',
    plotId: 'p1',
    protocolId: 'p1',
    observerId: 'user1',
    observationTimestamp: '2024-05-28T09:30:00Z',
    blinded: false,
    isSynced: true,
    values: [
      {
        id: 'v1',
        observationId: 'o1',
        metricId: 'm1',
        value: 95
      }
    ]
  },
  {
    id: 'o2',
    plotId: 'p1',
    protocolId: 'p2',
    observerId: 'user1',
    observationTimestamp: '2024-06-15T14:20:00Z',
    blinded: false,
    isSynced: true,
    values: [
      {
        id: 'v2',
        observationId: 'o2',
        metricId: 'm2',
        value: 'V3'
      },
      {
        id: 'v3',
        observationId: 'o2',
        metricId: 'm3',
        value: 45.5,
        unit: 'cm'
      }
    ]
  },
  {
    id: 'o3',
    plotId: 'p1',
    protocolId: 'p2',
    observerId: 'user1',
    observationTimestamp: '2024-07-01T11:15:00Z',
    blinded: false,
    isSynced: true,
    values: [
      {
        id: 'v4',
        observationId: 'o3',
        metricId: 'm2',
        value: 'V6'
      },
      {
        id: 'v5',
        observationId: 'o3',
        metricId: 'm3',
        value: 98.2,
        unit: 'cm'
      }
    ]
  }
];

const mockProtocols: ObservationProtocol[] = [
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
            { value: 'V5', label: 'V5 - Fifth leaf' },
            { value: 'V6', label: 'V6 - Sixth leaf' },
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
];

type PlotDetailsScreenNavigationProp = NativeStackNavigationProp<TrialStackParamList, 'PlotDetails'>;
type PlotDetailsScreenRouteProp = RouteProp<TrialStackParamList, 'PlotDetails'>;

const PlotDetailsScreen = () => {
  const [plot, setPlot] = useState<Plot | null>(null);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [protocols, setProtocols] = useState<ObservationProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation<PlotDetailsScreenNavigationProp>();
  const route = useRoute<PlotDetailsScreenRouteProp>();
  const { plotId, trialId } = route.params;

  useEffect(() => {
    // In a real app, these would be API or database calls
    fetchData();
  }, [plotId, trialId]);

  const fetchData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        // In a real app, these would be fetched based on the IDs
        setPlot(mockPlot);
        setTrial(mockTrial);
        setTreatment(mockTreatment);
        setObservations(mockObservations);
        setProtocols(mockProtocols);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching plot data:', error);
      setLoading(false);
    }
  };

  const navigateToObservationForm = (protocolId: string, observationId?: string) => {
    if (plot) {
      navigation.navigate('Observations' as any, {
        screen: 'ObservationForm',
        params: { plotId: plot.id, protocolId, observationId }
      });
    }
  };

  const navigateToMap = () => {
    if (plot) {
      navigation.navigate('Map' as any, {
        screen: 'MapOverview',
        params: { trialId, focusedPlotId: plot.id }
      });
    }
  };

  const getStatusColor = (status: Plot['status']) => {
    switch (status) {
      case 'unobserved': return '#9E9E9E'; // Grey
      case 'observed': return '#4CAF50'; // Green
      case 'flagged': return '#F44336'; // Red
      default: return '#9E9E9E';
    }
  };

  const getStatusLabel = (status: Plot['status']) => {
    switch (status) {
      case 'unobserved': return 'Not Observed';
      case 'observed': return 'Observed';
      case 'flagged': return 'Flagged';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return dateString.split('T')[0];
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getProtocolName = (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId);
    return protocol?.name || 'Unknown Protocol';
  };

  const getMetricName = (metricId: string) => {
    for (const protocol of protocols) {
      const metric = protocol.metrics.find(m => m.id === metricId);
      if (metric) return metric.name;
    }
    return 'Unknown Metric';
  };

  const formatMetricValue = (metricId: string, value: any, unit?: string) => {
    for (const protocol of protocols) {
      const metric = protocol.metrics.find(m => m.id === metricId);
      if (metric) {
        if (metric.type === 'categorical') {
          // Try to find the label for the value
          const option = metric.validationRules?.options?.find(opt => opt.value === value);
          return option ? option.label : value;
        } else {
          return `${value}${unit ? ` ${unit}` : metric.unit ? ` ${metric.unit}` : ''}`;
        }
      }
    }
    return value;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading plot details...</Text>
      </View>
    );
  }

  if (!plot || !trial) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#f44336" />
        <Text style={styles.errorText}>Plot not found</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <View style={styles.plotNumberContainer}>
          <Text style={styles.plotNumber}>Plot {plot.plotNumber}</Text>
          <View 
            style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(plot.status) }
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(plot.status)}</Text>
          </View>
        </View>
        
        <Text style={styles.trialName}>{trial.name}</Text>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => navigateToObservationForm('p2')}
        >
          <Ionicons name="create-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>New Observation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={navigateToMap}
        >
          <Ionicons name="map-outline" size={24} color="#4CAF50" />
          <Text style={styles.actionButtonText}>View on Map</Text>
        </TouchableOpacity>
      </View>
      
      {/* Plot details section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Plot Details</Text>
        
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Plot Number</Text>
            <Text style={styles.detailValue}>{plot.plotNumber}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Size</Text>
            <Text style={styles.detailValue}>
              {plot.size ? `${plot.size.value} ${plot.size.unit}` : 'Unknown'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.detailValue}>
              {getStatusLabel(plot.status)}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Replication</Text>
            <Text style={styles.detailValue}>{plot.replication || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Planting Date</Text>
            <Text style={styles.detailValue}>{formatDate(plot.plantingDate)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Emergence Date</Text>
            <Text style={styles.detailValue}>{formatDate(plot.emergenceDate)}</Text>
          </View>
          
          <View style={[styles.detailItem, styles.fullWidth]}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>
              {plot.centroid?.coordinates[1].toFixed(6)}, {plot.centroid?.coordinates[0].toFixed(6)}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Treatment section */}
      {treatment && (
        <View style={[styles.card, styles.treatmentCard]}>
          <View style={styles.treatmentHeader}>
            <View style={[styles.treatmentColorIndicator, { backgroundColor: treatment.color }]} />
            <Text style={styles.cardTitle}>Treatment: {treatment.name}</Text>
          </View>
          
          {treatment.description && (
            <Text style={styles.treatmentDescription}>{treatment.description}</Text>
          )}
          
          <View style={styles.factorsContainer}>
            <Text style={styles.factorsTitle}>Treatment Factors:</Text>
            {treatment.factors && Object.entries(treatment.factors).map(([key, value]) => (
              <View key={key} style={styles.factorItem}>
                <Text style={styles.factorKey}>{key}:</Text>
                <Text style={styles.factorValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Map preview */}
      <View style={styles.card}>
        <View style={styles.mapHeaderContainer}>
          <Text style={styles.cardTitle}>Map</Text>
          <TouchableOpacity 
            style={styles.viewFullMapButton}
            onPress={navigateToMap}
          >
            <Text style={styles.viewFullMapText}>Full Map</Text>
            <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.mapPreviewContainer}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={64} color="#CCCCCC" />
            <Text style={styles.mapPlaceholderText}>Map Preview</Text>
          </View>
        </View>
      </View>
      
      {/* Observations section */}
      <View style={styles.card}>
        <View style={styles.observationsHeaderContainer}>
          <Text style={styles.cardTitle}>Observations</Text>
          <TouchableOpacity 
            style={styles.addObservationButton}
            onPress={() => navigateToObservationForm('p2')}
          >
            <Ionicons name="add-circle-outline" size={18} color="#4CAF50" />
            <Text style={styles.addObservationText}>Add</Text>
          </TouchableOpacity>
        </View>
        
        {observations.length > 0 ? (
          <View style={styles.observationsList}>
            {observations.map(observation => (
              <TouchableOpacity 
                key={observation.id}
                style={styles.observationItem}
                onPress={() => navigateToObservationForm(observation.protocolId, observation.id)}
              >
                <View style={styles.observationHeader}>
                  <Text style={styles.observationProtocol}>
                    {getProtocolName(observation.protocolId)}
                  </Text>
                  <Text style={styles.observationDate}>
                    {formatTimestamp(observation.observationTimestamp)}
                  </Text>
                </View>
                
                <View style={styles.observationValues}>
                  {observation.values.map(value => (
                    <View key={value.id} style={styles.valueItem}>
                      <Text style={styles.metricName}>{getMetricName(value.metricId)}:</Text>
                      <Text style={styles.metricValue}>
                        {formatMetricValue(value.metricId, value.value, value.unit)}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <View style={styles.observationFooter}>
                  <View style={styles.observationStatus}>
                    <Ionicons 
                      name={observation.isSynced ? "cloud-done-outline" : "cloud-offline-outline"} 
                      size={16} 
                      color={observation.isSynced ? "#4CAF50" : "#FFC107"} 
                    />
                    <Text style={[
                      styles.syncStatus, 
                      { color: observation.isSynced ? "#4CAF50" : "#FFC107" }
                    ]}>
                      {observation.isSynced ? "Synced" : "Not Synced"}
                    </Text>
                  </View>
                  
                  <Ionicons name="chevron-forward" size={18} color="#999" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyObservations}>
            <Ionicons name="clipboard-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyObservationsText}>No observations recorded yet</Text>
            <TouchableOpacity 
              style={styles.addFirstObservationButton}
              onPress={() => navigateToObservationForm('p2')}
            >
              <Text style={styles.addFirstObservationText}>Add First Observation</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
  },
  plotNumberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  plotNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  trialName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 32,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
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
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  treatmentCard: {
    borderLeftWidth: 6,
    borderLeftColor: '#FF5722',
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  treatmentColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  treatmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  factorsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  factorItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  factorKey: {
    width: 100,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  factorValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  mapHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewFullMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewFullMapText: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 4,
  },
  mapPreviewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999',
  },
  observationsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addObservationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addObservationText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  observationsList: {
    marginTop: 8,
  },
  observationItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  observationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  observationProtocol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  observationDate: {
    fontSize: 12,
    color: '#666',
  },
  observationValues: {
    marginBottom: 12,
  },
  valueItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metricName: {
    width: 120,
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  observationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  observationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncStatus: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyObservations: {
    alignItems: 'center',
    padding: 24,
  },
  emptyObservationsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 16,
  },
  addFirstObservationButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addFirstObservationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
});

export default PlotDetailsScreen;