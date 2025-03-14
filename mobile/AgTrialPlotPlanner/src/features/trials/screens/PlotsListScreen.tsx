import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrialStackParamList } from '../../../navigation/types';
import { Plot, Treatment, Trial } from '../../../core/models/Types';
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

// Generate mock plots data
const generateMockPlots = (trialId: string): Plot[] => {
  const treatments = mockTreatments[trialId] || [];
  const plots: Plot[] = [];
  
  // Generate 50 plots with different treatments and statuses
  for (let i = 1; i <= 50; i++) {
    const treatmentIndex = (i - 1) % treatments.length;
    const treatment = treatments[treatmentIndex];
    
    // Randomly determine plot status
    let status: Plot['status'];
    if (i <= 20) {
      status = 'observed';
    } else if (i <= 25) {
      status = 'flagged';
    } else {
      status = 'unobserved';
    }
    
    // Create fake GeoJSON polygon for the plot
    const centroidLat = 38.0 + (i * 0.001);
    const centroidLng = -95.0 + (i * 0.002);
    
    const plot: Plot = {
      id: `p${i}`,
      trialId,
      plotNumber: `${i}`,
      treatmentId: treatment?.id,
      replication: Math.ceil(i / treatments.length),
      coordinates: {
        type: 'Polygon',
        coordinates: [
          [
            [centroidLng - 0.001, centroidLat - 0.001],
            [centroidLng + 0.001, centroidLat - 0.001],
            [centroidLng + 0.001, centroidLat + 0.001],
            [centroidLng - 0.001, centroidLat + 0.001],
            [centroidLng - 0.001, centroidLat - 0.001],
          ]
        ]
      },
      centroid: {
        type: 'Point',
        coordinates: [centroidLng, centroidLat]
      },
      size: {
        value: 100,
        unit: 'm²'
      },
      status,
      plantingDate: '2024-05-15',
    };
    
    plots.push(plot);
  }
  
  return plots;
};

type PlotsListScreenNavigationProp = NativeStackNavigationProp<TrialStackParamList, 'PlotsList'>;
type PlotsListScreenRouteProp = RouteProp<TrialStackParamList, 'PlotsList'>;

const PlotsListScreen = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [filteredPlots, setFilteredPlots] = useState<Plot[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Plot['status'] | 'all'>('all');
  const [filterTreatment, setFilterTreatment] = useState<string | 'all'>('all');
  
  const navigation = useNavigation<PlotsListScreenNavigationProp>();
  const route = useRoute<PlotsListScreenRouteProp>();
  const { trialId } = route.params;

  useEffect(() => {
    // In a real app, these would be API or database calls
    fetchData();
  }, [trialId]);

  useEffect(() => {
    // Apply filters whenever filter criteria change
    applyFilters();
  }, [plots, searchQuery, filterStatus, filterTreatment]);

  const fetchData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        const trialData = mockTrials[trialId];
        const treatmentData = mockTreatments[trialId] || [];
        const plotsData = generateMockPlots(trialId);
        
        setTrial(trialData);
        setTreatments(treatmentData);
        setPlots(plotsData);
        setFilteredPlots(plotsData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching plots data:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...plots];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(plot => plot.status === filterStatus);
    }
    
    // Apply treatment filter
    if (filterTreatment !== 'all') {
      filtered = filtered.filter(plot => plot.treatmentId === filterTreatment);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plot => 
        plot.plotNumber.toLowerCase().includes(query)
      );
    }
    
    setFilteredPlots(filtered);
  };

  const navigateToPlotDetails = (plotId: string) => {
    navigation.navigate('PlotDetails', { plotId, trialId });
  };

  const navigateToObservationForm = (plotId: string) => {
    // Navigate to the observation form for this plot
    // In a real app, you would need to determine the correct protocol
    navigation.navigate('Observations' as any, {
      screen: 'ObservationForm',
      params: { 
        plotId, 
        protocolId: 'p1' // Using a mock protocol ID
      }
    });
  };

  const navigateToMap = (plotId: string) => {
    // Navigate to the map focused on this specific plot
    navigation.navigate('Map' as any, {
      screen: 'MapOverview',
      params: { trialId, focusedPlotId: plotId }
    });
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

  const getTreatmentColor = (treatmentId?: string) => {
    if (!treatmentId) return '#CCCCCC';
    const treatment = treatments.find(t => t.id === treatmentId);
    return treatment?.color || '#CCCCCC';
  };

  const getTreatmentName = (treatmentId?: string) => {
    if (!treatmentId) return 'No Treatment';
    const treatment = treatments.find(t => t.id === treatmentId);
    return treatment?.name || 'Unknown Treatment';
  };

  const renderPlotItem = ({ item }: { item: Plot }) => {
    const statusColor = getStatusColor(item.status);
    const treatmentColor = getTreatmentColor(item.treatmentId);
    
    return (
      <TouchableOpacity 
        style={styles.plotCard} 
        onPress={() => navigateToPlotDetails(item.id)}
      >
        <View style={styles.plotHeader}>
          <View style={styles.plotNumberContainer}>
            <View 
              style={[styles.treatmentIndicator, { backgroundColor: treatmentColor }]} 
            />
            <Text style={styles.plotNumber}>Plot {item.plotNumber}</Text>
          </View>
          
          <View 
            style={[styles.statusBadge, { backgroundColor: statusColor }]}
          >
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>
        
        <View style={styles.plotDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Treatment:</Text>
            <Text style={styles.detailValue}>{getTreatmentName(item.treatmentId)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Replication:</Text>
            <Text style={styles.detailValue}>{item.replication || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Size:</Text>
            <Text style={styles.detailValue}>
              {item.size ? `${item.size.value} ${item.size.unit}` : 'Unknown'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Planting Date:</Text>
            <Text style={styles.detailValue}>{item.plantingDate?.split('T')[0] || 'Not planted'}</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateToObservationForm(item.id)}
          >
            <Ionicons name="create-outline" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Observe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateToMap(item.id)}
          >
            <Ionicons name="map-outline" size={20} color="#4CAF50" />
            <Text style={styles.actionButtonText}>Map</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading plots...</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{trial.name}</Text>
        <Text style={styles.headerSubtitle}>{filteredPlots.length} of {plots.length} plots</Text>
      </View>
      
      {/* Search and filter section */}
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search plots..."
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
        
        <View style={styles.filterButtonsContainer}>
          <Text style={styles.filterLabel}>Status:</Text>
          <ScrollHorizontalButtons 
            options={[
              { value: 'all', label: 'All' },
              { value: 'unobserved', label: 'Unobserved' },
              { value: 'observed', label: 'Observed' },
              { value: 'flagged', label: 'Flagged' }
            ]}
            selectedValue={filterStatus}
            onSelect={(value) => setFilterStatus(value as any)}
          />
        </View>
        
        {treatments.length > 0 && (
          <View style={styles.filterButtonsContainer}>
            <Text style={styles.filterLabel}>Treatment:</Text>
            <ScrollHorizontalButtons 
              options={[
                { value: 'all', label: 'All Treatments' },
                ...treatments.map(t => ({ value: t.id, label: t.name }))
              ]}
              selectedValue={filterTreatment}
              onSelect={setFilterTreatment}
            />
          </View>
        )}
      </View>
      
      {/* Plots list */}
      <FlatList
        data={filteredPlots}
        renderItem={renderPlotItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="grid-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>No plots match your filters</Text>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterTreatment('all');
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

// Helper component for horizontal scrollable filter buttons
type Option = { value: string; label: string };

const ScrollHorizontalButtons = ({ 
  options, 
  selectedValue, 
  onSelect 
}: { 
  options: Option[]; 
  selectedValue: string; 
  onSelect: (value: string) => void;
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.buttonScrollContainer}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
    paddingTop: 8, 
    paddingBottom: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterContainer: {
    backgroundColor: 'white',
    padding: 12,
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
  filterButtonsContainer: {
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  buttonScrollContainer: {
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
  listContainer: {
    padding: 16,
  },
  plotCard: {
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
  plotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  plotNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  treatmentIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  plotNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  plotDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionButtonText: {
    marginLeft: 4,
    color: '#4CAF50',
    fontWeight: '500',
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

export default PlotsListScreen;