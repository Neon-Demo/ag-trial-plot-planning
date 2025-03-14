import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ObservationStackParamList } from '../../../navigation/types';
import { Observation, ObservationProtocol, Plot, Trial } from '../../../core/models/Types';
import { Ionicons } from '@expo/vector-icons';

// Mock data for development
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
    plotId: 'p2',
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
    plotId: 'p3',
    protocolId: 'p2',
    observerId: 'user1',
    observationTimestamp: '2024-07-01T11:15:00Z',
    blinded: false,
    isSynced: false,
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
  },
  {
    id: 'o4',
    plotId: 'p10',
    protocolId: 'p3',
    observerId: 'user1',
    observationTimestamp: '2024-07-05T10:45:00Z',
    blinded: false,
    isSynced: false,
    values: [
      {
        id: 'v6',
        observationId: 'o4',
        metricId: 'm4',
        value: 'good'
      }
    ]
  }
];

const mockProtocols: Record<string, ObservationProtocol> = {
  'p1': {
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
  'p2': {
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
        required: true
      }
    ]
  },
  'p3': {
    id: 'p3',
    trialId: '1',
    name: 'Disease Assessment',
    description: 'Assessment of disease presence and severity',
    startDate: '2024-06-01',
    endDate: '2024-09-01',
    frequency: 'Bi-weekly',
    metrics: [
      {
        id: 'm4',
        protocolId: 'p3',
        name: 'Disease Rating',
        type: 'categorical',
        required: true,
        validationRules: {
          options: [
            { value: 'none', label: 'None - No disease visible' },
            { value: 'low', label: 'Low - <10% affected' },
            { value: 'moderate', label: 'Moderate - 10-30% affected' },
            { value: 'high', label: 'High - >30% affected' },
            { value: 'severe', label: 'Severe - >50% affected' }
          ]
        }
      }
    ]
  }
};

const mockPlots: Record<string, Plot> = {
  'p1': {
    id: 'p1',
    trialId: '1',
    plotNumber: '1',
    treatmentId: 't1',
    coordinates: { type: 'Polygon', coordinates: [[]] },
    status: 'observed'
  },
  'p2': {
    id: 'p2',
    trialId: '1',
    plotNumber: '2',
    treatmentId: 't1',
    coordinates: { type: 'Polygon', coordinates: [[]] },
    status: 'observed'
  },
  'p3': {
    id: 'p3',
    trialId: '1',
    plotNumber: '3',
    treatmentId: 't2',
    coordinates: { type: 'Polygon', coordinates: [[]] },
    status: 'observed'
  },
  'p10': {
    id: 'p10',
    trialId: '1',
    plotNumber: '10',
    treatmentId: 't3',
    coordinates: { type: 'Polygon', coordinates: [[]] },
    status: 'observed'
  }
};

const mockTrials: Record<string, Trial> = {
  '1': {
    id: '1',
    organizationId: 'org1',
    name: 'Corn Hybrid Trial 2024',
    status: 'active',
    cropType: 'Corn'
  }
};

type ObservationsListScreenNavigationProp = NativeStackNavigationProp<ObservationStackParamList, 'ObservationsList'>;

const ObservationsListScreen = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [filteredObservations, setFilteredObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSync, setFilterSync] = useState<'all' | 'synced' | 'unsynced'>('all');
  const [filterProtocol, setFilterProtocol] = useState<string>('all');
  
  const navigation = useNavigation<ObservationsListScreenNavigationProp>();

  useEffect(() => {
    // In a real app, this would fetch from an API or local database
    fetchObservations();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter criteria change
    applyFilters();
  }, [observations, searchQuery, filterSync, filterProtocol]);

  const fetchObservations = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setObservations(mockObservations);
        setFilteredObservations(mockObservations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching observations:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...observations];
    
    // Apply sync filter
    if (filterSync !== 'all') {
      const isSynced = filterSync === 'synced';
      filtered = filtered.filter(obs => obs.isSynced === isSynced);
    }
    
    // Apply protocol filter
    if (filterProtocol !== 'all') {
      filtered = filtered.filter(obs => obs.protocolId === filterProtocol);
    }
    
    // Apply search query to plot number
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(obs => {
        const plot = mockPlots[obs.plotId];
        return plot?.plotNumber.toLowerCase().includes(query);
      });
    }
    
    setFilteredObservations(filtered);
  };

  const handleObservationPress = (observation: Observation) => {
    navigation.navigate('ObservationForm', {
      plotId: observation.plotId,
      protocolId: observation.protocolId,
      observationId: observation.id
    });
  };

  const navigateToNewObservation = () => {
    // This would typically prompt the user to select a plot and protocol first
    navigation.navigate('ObservationForm', {
      plotId: 'p1',  // In a real app, this would be selected by the user
      protocolId: 'p2'  // In a real app, this would be selected by the user
    });
  };

  const navigateToBatchObservation = () => {
    navigation.navigate('BatchObservation', {
      trialId: '1',  // In a real app, this would be selected by the user
      protocolId: 'p2'  // In a real app, this would be selected by the user
    });
  };

  const getProtocolName = (protocolId: string) => {
    return mockProtocols[protocolId]?.name || 'Unknown Protocol';
  };

  const getPlotNumber = (plotId: string) => {
    return mockPlots[plotId]?.plotNumber || 'Unknown Plot';
  };

  const getTrialName = (trialId: string) => {
    return mockTrials[trialId]?.name || 'Unknown Trial';
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatMetricValues = (observation: Observation) => {
    if (!observation.values.length) return 'No data';
    
    return observation.values.map(value => {
      const protocol = mockProtocols[observation.protocolId];
      if (!protocol) return `${value.metricId}: ${value.value}`;
      
      const metric = protocol.metrics.find(m => m.id === value.metricId);
      if (!metric) return `${value.metricId}: ${value.value}`;
      
      let displayValue = value.value;
      if (metric.type === 'categorical' && metric.validationRules?.options) {
        const option = metric.validationRules.options.find(opt => opt.value === value.value);
        if (option) displayValue = option.label;
      }
      
      return `${metric.name}: ${displayValue}${value.unit ? ` ${value.unit}` : metric.unit ? ` ${metric.unit}` : ''}`;
    }).join(', ');
  };

  const renderObservationItem = ({ item }: { item: Observation }) => {
    const plotNumber = getPlotNumber(item.plotId);
    const protocolName = getProtocolName(item.protocolId);
    const trialId = mockPlots[item.plotId]?.trialId || '';
    const trialName = getTrialName(trialId);
    
    return (
      <TouchableOpacity 
        style={styles.observationCard} 
        onPress={() => handleObservationPress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.plotTitle}>Plot {plotNumber}</Text>
            <Text style={styles.protocolName}>{protocolName}</Text>
          </View>
          <View style={[
            styles.syncIndicator, 
            { backgroundColor: item.isSynced ? '#4CAF50' : '#FFC107' }
          ]}>
            <Ionicons 
              name={item.isSynced ? 'cloud-done-outline' : 'cloud-offline-outline'} 
              size={14} 
              color="white" 
            />
          </View>
        </View>
        
        <View style={styles.trialContainer}>
          <Ionicons name="flask-outline" size={16} color="#666" />
          <Text style={styles.trialName}>{trialName}</Text>
        </View>
        
        <Text style={styles.observationValues} numberOfLines={2}>
          {formatMetricValues(item)}
        </Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.timestamp}>
            <Ionicons name="time-outline" size={14} color="#888" /> {formatDateTime(item.observationTimestamp)}
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#666" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading observations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and filter section */}
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by plot number..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filterButtonsRow}>
          <ScrollableFilter
            label="Sync Status"
            options={[
              { value: 'all', label: 'All' },
              { value: 'synced', label: 'Synced' },
              { value: 'unsynced', label: 'Unsynced' }
            ]}
            selectedValue={filterSync}
            onSelect={(value) => setFilterSync(value as any)}
          />
          
          <ScrollableFilter
            label="Protocol"
            options={[
              { value: 'all', label: 'All Protocols' },
              ...Object.values(mockProtocols).map(protocol => ({
                value: protocol.id,
                label: protocol.name
              }))
            ]}
            selectedValue={filterProtocol}
            onSelect={setFilterProtocol}
          />
        </View>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigateToNewObservation}
        >
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>New Observation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.batchButton}
          onPress={navigateToBatchObservation}
        >
          <Ionicons name="layers-outline" size={20} color="#4CAF50" />
          <Text style={styles.batchButtonText}>Batch Mode</Text>
        </TouchableOpacity>
      </View>
      
      {/* Observations list */}
      <FlatList
        data={filteredObservations}
        renderItem={renderObservationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>No observations match your filters</Text>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={() => {
                setSearchQuery('');
                setFilterSync('all');
                setFilterProtocol('all');
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

// Helper component for scrollable filters
type FilterOption = { value: string; label: string };

const ScrollableFilter = ({ 
  label, 
  options, 
  selectedValue, 
  onSelect 
}: { 
  label: string;
  options: FilterOption[]; 
  selectedValue: string; 
  onSelect: (value: string) => void;
}) => {
  return (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}:</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterButtonsContainer}
      >
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterButton,
              selectedValue === option.value && styles.filterButtonSelected
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text 
              style={[
                styles.filterButtonText,
                selectedValue === option.value && styles.filterButtonTextSelected
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: '#333',
  },
  filterButtonsRow: {
    marginTop: 8,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  filterButtonsContainer: {
    paddingRight: 16,
  },
  filterButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  batchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  batchButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding at the bottom
  },
  observationCard: {
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  plotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  protocolName: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  syncIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  trialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trialName: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  observationValues: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
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
    marginBottom: 16,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ObservationsListScreen;