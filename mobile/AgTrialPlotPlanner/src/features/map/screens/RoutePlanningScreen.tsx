import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Switch,
  TextInput,
  Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapStackParamList } from '../../../navigation/types';
import { Plot, RoutePlan, Trial } from '../../../core/models/Types';
import { Ionicons } from '@expo/vector-icons';

// Mock data
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
  plotCount: 50,
  completedObservations: 25,
  totalObservations: 150
};

// Generate mock plots
const generateMockPlots = (count: number, trialId: string): Plot[] => {
  const plots: Plot[] = [];
  
  for (let i = 1; i <= count; i++) {
    // Simulate a grid of plots
    const row = Math.ceil(i / 10);
    const col = i % 10 === 0 ? 10 : i % 10;
    
    // Calculate coordinates based on row and column
    const centroidLat = 38.0 + (row * 0.001);
    const centroidLng = -95.0 + (col * 0.002);
    
    // Randomly determine plot status
    let status: Plot['status'];
    if (i <= 20) {
      status = 'observed';
    } else if (i <= 25) {
      status = 'flagged';
    } else {
      status = 'unobserved';
    }
    
    const plot: Plot = {
      id: `p${i}`,
      trialId,
      plotNumber: `${i}`,
      treatmentId: `t${(i % 5) + 1}`,
      replication: Math.ceil(i / 10),
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
      status
    };
    
    plots.push(plot);
  }
  
  return plots;
};

// Mock existing route plan - we'll use this as the initial state
const mockRoutePlan: RoutePlan = {
  id: 'route1',
  trialId: '1',
  userId: 'user1',
  name: 'Default Route',
  plotSequence: [
    { plotId: 'p1', plotNumber: '1', centroid: { type: 'Point', coordinates: [-95.002, 38.001] } },
    { plotId: 'p2', plotNumber: '2', centroid: { type: 'Point', coordinates: [-95.004, 38.001] } },
    { plotId: 'p3', plotNumber: '3', centroid: { type: 'Point', coordinates: [-95.006, 38.001] } },
    { plotId: 'p4', plotNumber: '4', centroid: { type: 'Point', coordinates: [-95.008, 38.001] } },
    { plotId: 'p5', plotNumber: '5', centroid: { type: 'Point', coordinates: [-95.010, 38.001] } },
  ],
  totalDistance: {
    value: 0.5,
    unit: 'km'
  },
  estimatedDuration: 15, // minutes
  optimizationStrategy: 'distance'
};

type RoutePlanningScreenNavigationProp = NativeStackNavigationProp<MapStackParamList, 'RoutePlanning'>;
type RoutePlanningScreenRouteProp = RouteProp<MapStackParamList, 'RoutePlanning'>;

const RoutePlanningScreen = () => {
  const [trial, setTrial] = useState<Trial | null>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [routePlan, setRoutePlan] = useState<RoutePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [routeName, setRouteName] = useState('');
  const [selectedPlots, setSelectedPlots] = useState<string[]>([]);
  const [routeStrategy, setRouteStrategy] = useState<RoutePlan['optimizationStrategy']>('distance');
  const [includeObserved, setIncludeObserved] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  
  const navigation = useNavigation<RoutePlanningScreenNavigationProp>();
  const route = useRoute<RoutePlanningScreenRouteProp>();
  const { trialId } = route.params;

  useEffect(() => {
    // In a real app, these would be API or database calls
    fetchData();
  }, [trialId]);

  // Calculate estimated time and distance when selected plots change
  useEffect(() => {
    if (selectedPlots.length > 1) {
      // Simple mockup calculation - would be more sophisticated in a real app
      // Assuming average walking speed of 5km/h between plots
      const plotDistance = 0.1; // km between plots on average
      const newTotalDistance = (selectedPlots.length - 1) * plotDistance;
      const walkingTimePerKm = 12; // minutes per km
      const timePerPlot = 2; // minutes spent at each plot
      const newEstimatedTime = Math.round(
        (newTotalDistance * walkingTimePerKm) + (selectedPlots.length * timePerPlot)
      );
      
      setTotalDistance(newTotalDistance);
      setEstimatedTime(newEstimatedTime);
    } else {
      setTotalDistance(0);
      setEstimatedTime(0);
    }
  }, [selectedPlots]);

  const fetchData = async () => {
    try {
      // Simulate API calls
      setTimeout(() => {
        setTrial(mockTrial);
        setPlots(generateMockPlots(50, trialId));
        
        // Use the mock route plan as starting point
        if (mockRoutePlan) {
          setRoutePlan(mockRoutePlan);
          setRouteName(mockRoutePlan.name || 'New Route');
          setSelectedPlots(mockRoutePlan.plotSequence.map(p => p.plotId));
          setRouteStrategy(mockRoutePlan.optimizationStrategy || 'distance');
        } else {
          setRouteName('New Route');
        }
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const generateOptimizedRoute = () => {
    // This would contain a complex algorithm in a real app
    // For now, we'll just simulate a loading state and return a basic route
    setLoading(true);
    
    setTimeout(() => {
      // Get available plots based on filters
      const availablePlots = plots.filter(plot => {
        if (!includeObserved && plot.status === 'observed') {
          return false;
        }
        return true;
      });
      
      // Sort plots based on strategy
      let sortedPlots: Plot[];
      if (routeStrategy === 'distance') {
        // Sort by row and column (simulate optimizing for distance)
        sortedPlots = [...availablePlots].sort((a, b) => {
          const aNum = parseInt(a.plotNumber);
          const bNum = parseInt(b.plotNumber);
          return aNum - bNum;
        });
      } else if (routeStrategy === 'treatment_blocks') {
        // Sort by treatment (to visit same treatments together)
        sortedPlots = [...availablePlots].sort((a, b) => {
          if (a.treatmentId === b.treatmentId) {
            return parseInt(a.plotNumber) - parseInt(b.plotNumber);
          }
          return (a.treatmentId || '').localeCompare(b.treatmentId || '');
        });
      } else {
        // Default sorting by plot number
        sortedPlots = [...availablePlots].sort((a, b) => {
          return parseInt(a.plotNumber) - parseInt(b.plotNumber);
        });
      }
      
      // Take the first 15 plots or all if less than 15
      const selectedSortedPlots = sortedPlots.slice(0, 15);
      setSelectedPlots(selectedSortedPlots.map(p => p.id));
      
      setLoading(false);
    }, 1500);
  };

  const saveRoute = () => {
    // This would send data to backend in a real app
    setLoading(true);
    
    setTimeout(() => {
      // Create updated route plan object
      const updatedRoutePlan: RoutePlan = {
        id: routePlan?.id || `route_${Date.now()}`,
        trialId,
        userId: 'user1',
        name: routeName,
        plotSequence: selectedPlots.map(plotId => {
          const plot = plots.find(p => p.id === plotId);
          return {
            plotId,
            plotNumber: plot?.plotNumber || '',
            centroid: plot?.centroid || { type: 'Point', coordinates: [0, 0] }
          };
        }),
        totalDistance: {
          value: totalDistance,
          unit: 'km'
        },
        estimatedDuration: estimatedTime,
        optimizationStrategy: routeStrategy
      };
      
      setRoutePlan(updatedRoutePlan);
      setLoading(false);
      
      // Show success message
      Alert.alert(
        'Route Saved',
        `Your route "${routeName}" has been saved successfully.`,
        [{ text: 'OK' }]
      );
    }, 1000);
  };

  const startNavigation = () => {
    if (selectedPlots.length === 0) {
      Alert.alert(
        'No Plots Selected',
        'Please select at least one plot to navigate to.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Navigate to the navigation screen with the route
    navigation.navigate('Navigation', {
      trialId,
      routeId: routePlan?.id
    });
  };

  const togglePlotSelection = (plotId: string) => {
    if (selectedPlots.includes(plotId)) {
      setSelectedPlots(selectedPlots.filter(id => id !== plotId));
    } else {
      setSelectedPlots([...selectedPlots, plotId]);
    }
  };

  const isPlotSelected = (plotId: string) => {
    return selectedPlots.includes(plotId);
  };

  const getPlotSequence = (plotId: string) => {
    const index = selectedPlots.indexOf(plotId);
    return index >= 0 ? index + 1 : null;
  };

  const getPlotStatusColor = (status: Plot['status']) => {
    switch (status) {
      case 'unobserved': return '#9E9E9E';  // Grey
      case 'observed': return '#4CAF50';    // Green
      case 'flagged': return '#F44336';     // Red
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          {routePlan ? 'Updating route...' : 'Generating route plan...'}
        </Text>
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
      <ScrollView style={styles.scrollContainer}>
        {/* Route information section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Route Name</Text>
            <TextInput
              style={styles.textInput}
              value={routeName}
              onChangeText={setRouteName}
              placeholder="Enter route name"
            />
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Plots Selected</Text>
              <Text style={styles.statValue}>{selectedPlots.length}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Distance</Text>
              <Text style={styles.statValue}>
                {totalDistance.toFixed(1)} km
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Estimated Time</Text>
              <Text style={styles.statValue}>
                {estimatedTime} min
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={saveRoute}
            >
              <Ionicons name="save-outline" size={18} color="white" />
              <Text style={styles.primaryButtonText}>Save Route</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={startNavigation}
            >
              <Ionicons name="navigate-outline" size={18} color="#4CAF50" />
              <Text style={styles.secondaryButtonText}>Start Navigation</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Route optimization section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route Optimization</Text>
          
          <View style={styles.optionContainer}>
            <Text style={styles.optionLabel}>Optimization Strategy</Text>
            <View style={styles.optionButtons}>
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  routeStrategy === 'distance' && styles.optionButtonSelected
                ]}
                onPress={() => setRouteStrategy('distance')}
              >
                <Text style={[
                  styles.optionButtonText,
                  routeStrategy === 'distance' && styles.optionButtonTextSelected
                ]}>
                  Shortest Distance
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.optionButton, 
                  routeStrategy === 'treatment_blocks' && styles.optionButtonSelected
                ]}
                onPress={() => setRouteStrategy('treatment_blocks')}
              >
                <Text style={[
                  styles.optionButtonText,
                  routeStrategy === 'treatment_blocks' && styles.optionButtonTextSelected
                ]}>
                  Treatment Blocks
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Include Already Observed Plots</Text>
            <Switch
              value={includeObserved}
              onValueChange={setIncludeObserved}
              trackColor={{ false: '#D1D1D1', true: '#A5D6A7' }}
              thumbColor={includeObserved ? '#4CAF50' : '#F5F5F5'}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={generateOptimizedRoute}
          >
            <Ionicons name="refresh-outline" size={18} color="white" />
            <Text style={styles.generateButtonText}>Generate Optimized Route</Text>
          </TouchableOpacity>
        </View>
        
        {/* Plot selection section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Selected Plots</Text>
            <Text style={styles.plotCount}>
              {selectedPlots.length} / {plots.length} plots
            </Text>
          </View>
          
          <View style={styles.plotGrid}>
            {plots.map(plot => {
              const isSelected = isPlotSelected(plot.id);
              const sequence = getPlotSequence(plot.id);
              const statusColor = getPlotStatusColor(plot.status);
              
              return (
                <TouchableOpacity 
                  key={plot.id}
                  style={[
                    styles.plotItem,
                    isSelected && styles.plotItemSelected,
                    plot.status === 'observed' && !includeObserved && styles.plotItemDisabled
                  ]}
                  onPress={() => togglePlotSelection(plot.id)}
                  disabled={plot.status === 'observed' && !includeObserved}
                >
                  {isSelected && (
                    <View style={styles.sequenceIndicator}>
                      <Text style={styles.sequenceText}>{sequence}</Text>
                    </View>
                  )}
                  <Text style={[
                    styles.plotNumber,
                    isSelected && styles.plotNumberSelected
                  ]}>
                    {plot.plotNumber}
                  </Text>
                  <View 
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: statusColor }
                    ]} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Observed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#9E9E9E' }]} />
              <Text style={styles.legendText}>Unobserved</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>Flagged</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginRight: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  optionButtons: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#666',
  },
  optionButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  switchLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  plotCount: {
    fontSize: 14,
    color: '#666',
  },
  plotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  plotItem: {
    width: '18%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    position: 'relative',
  },
  plotItemSelected: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    backgroundColor: '#E8F5E9',
  },
  plotItemDisabled: {
    opacity: 0.5,
  },
  plotNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  plotNumberSelected: {
    color: '#4CAF50',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sequenceIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  sequenceText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
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

export default RoutePlanningScreen;