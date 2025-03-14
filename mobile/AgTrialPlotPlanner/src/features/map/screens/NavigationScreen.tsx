import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Alert,
  Animated,
  Platform
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapStackParamList } from '../../../navigation/types';
import { Plot, RoutePlan } from '../../../core/models/Types';
import { Ionicons } from '@expo/vector-icons';

// Mock data for navigation
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
  optimizationStrategy: 'distance',
  routeGeometry: {
    type: 'LineString',
    coordinates: [
      [-95.002, 38.001],
      [-95.004, 38.001],
      [-95.006, 38.001],
      [-95.008, 38.001],
      [-95.010, 38.001]
    ]
  }
};

const mockPlots: Record<string, Plot> = {
  'p1': {
    id: 'p1',
    trialId: '1',
    plotNumber: '1',
    treatmentId: 't1',
    coordinates: { 
      type: 'Polygon', 
      coordinates: [[
        [-95.002, 38.000],
        [-95.001, 38.000],
        [-95.001, 38.002],
        [-95.002, 38.002],
        [-95.002, 38.000]
      ]] 
    },
    centroid: { type: 'Point', coordinates: [-95.002, 38.001] },
    status: 'unobserved'
  },
  'p2': {
    id: 'p2',
    trialId: '1',
    plotNumber: '2',
    treatmentId: 't1',
    coordinates: { 
      type: 'Polygon', 
      coordinates: [[
        [-95.004, 38.000],
        [-95.003, 38.000],
        [-95.003, 38.002],
        [-95.004, 38.002],
        [-95.004, 38.000]
      ]] 
    },
    centroid: { type: 'Point', coordinates: [-95.004, 38.001] },
    status: 'unobserved'
  },
  'p3': {
    id: 'p3',
    trialId: '1',
    plotNumber: '3',
    treatmentId: 't2',
    coordinates: { 
      type: 'Polygon', 
      coordinates: [[
        [-95.006, 38.000],
        [-95.005, 38.000],
        [-95.005, 38.002],
        [-95.006, 38.002],
        [-95.006, 38.000]
      ]] 
    },
    centroid: { type: 'Point', coordinates: [-95.006, 38.001] },
    status: 'unobserved'
  },
  'p4': {
    id: 'p4',
    trialId: '1',
    plotNumber: '4',
    treatmentId: 't2',
    coordinates: { 
      type: 'Polygon', 
      coordinates: [[
        [-95.008, 38.000],
        [-95.007, 38.000],
        [-95.007, 38.002],
        [-95.008, 38.002],
        [-95.008, 38.000]
      ]] 
    },
    centroid: { type: 'Point', coordinates: [-95.008, 38.001] },
    status: 'unobserved'
  },
  'p5': {
    id: 'p5',
    trialId: '1',
    plotNumber: '5', 
    treatmentId: 't3',
    coordinates: { 
      type: 'Polygon', 
      coordinates: [[
        [-95.010, 38.000],
        [-95.009, 38.000],
        [-95.009, 38.002],
        [-95.010, 38.002],
        [-95.010, 38.000]
      ]] 
    },
    centroid: { type: 'Point', coordinates: [-95.010, 38.001] },
    status: 'unobserved'
  }
};

// In a real app, this would come from the device's GPS/location services
const mockCurrentLocation = {
  latitude: 38.001,
  longitude: -95.003, // Near plot p2
  accuracy: 5, // meters
  heading: 90, // degrees (east)
  speed: 1.2, // m/s
};

type NavigationScreenNavigationProp = NativeStackNavigationProp<MapStackParamList, 'Navigation'>;
type NavigationScreenRouteProp = RouteProp<MapStackParamList, 'Navigation'>;

const NavigationScreen = () => {
  const [loading, setLoading] = useState(true);
  const [routePlan, setRoutePlan] = useState<RoutePlan | null>(null);
  const [currentPlotIndex, setCurrentPlotIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(mockCurrentLocation);
  const [destinationReached, setDestinationReached] = useState(false);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [navigationActive, setNavigationActive] = useState(true);
  
  const navigation = useNavigation<NavigationScreenNavigationProp>();
  const route = useRoute<NavigationScreenRouteProp>();
  const { trialId, routeId, plotId } = route.params;

  // Animation for the arrow
  const arrowRotation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Load route data
    fetchRouteData();
    
    // Setup location tracking (simulated here)
    const locationInterval = setInterval(updateCurrentLocation, 2000);
    
    // Navigation instructions animation
    startArrowAnimation();
    startPulseAnimation();
    
    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  // Update navigation data when current location or destination changes
  useEffect(() => {
    if (routePlan && routePlan.plotSequence.length > 0) {
      updateNavigationData();
    }
  }, [currentLocation, currentPlotIndex, routePlan]);

  const fetchRouteData = async () => {
    try {
      // In a real app, this would fetch from an API or database
      setTimeout(() => {
        setRoutePlan(mockRoutePlan);
        
        // If a specific plot ID was provided, find its index in the route
        if (plotId) {
          const index = mockRoutePlan.plotSequence.findIndex(p => p.plotId === plotId);
          if (index >= 0) {
            setCurrentPlotIndex(index);
          }
        }
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading route:', error);
      setLoading(false);
    }
  };

  const updateCurrentLocation = () => {
    // In a real app, this would get location from device GPS services
    // Here we'll simulate movement toward the current destination
    if (!routePlan || !navigationActive) return;
    
    const currentTarget = routePlan.plotSequence[currentPlotIndex];
    if (!currentTarget) return;
    
    const targetLat = currentTarget.centroid.coordinates[1];
    const targetLon = currentTarget.centroid.coordinates[0];
    
    // Move slightly toward target (simulated)
    const moveSpeed = 0.0002; // degrees per update
    const latDiff = targetLat - currentLocation.latitude;
    const lonDiff = targetLon - currentLocation.longitude;
    const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    
    if (distance < 0.0003) {
      // We've reached the destination
      if (!destinationReached) {
        setDestinationReached(true);
        Alert.alert(
          'Destination Reached', 
          `You have arrived at Plot ${currentTarget.plotNumber}`,
          [
            { 
              text: 'Record Observation', 
              onPress: () => navigateToObservationForm(currentTarget.plotId) 
            },
            { text: 'Continue', onPress: () => moveToNextPlot() }
          ]
        );
      }
      return;
    }
    
    // Calculate movement and heading
    const newLat = currentLocation.latitude + (latDiff / distance) * moveSpeed;
    const newLon = currentLocation.longitude + (lonDiff / distance) * moveSpeed;
    const newHeading = Math.atan2(lonDiff, latDiff) * (180 / Math.PI);
    
    setCurrentLocation({
      latitude: newLat,
      longitude: newLon,
      accuracy: 5,
      heading: newHeading,
      speed: 1.2,
    });
    
    setDestinationReached(false);
  };

  const updateNavigationData = () => {
    if (!routePlan || currentPlotIndex >= routePlan.plotSequence.length) return;
    
    const currentTarget = routePlan.plotSequence[currentPlotIndex];
    const targetLat = currentTarget.centroid.coordinates[1];
    const targetLon = currentTarget.centroid.coordinates[0];
    
    // Calculate remaining distance (simplified - would use Haversine in a real app)
    const latDiff = targetLat - currentLocation.latitude;
    const lonDiff = targetLon - currentLocation.longitude;
    const distanceInDegrees = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    
    // Very rough conversion from degrees to km (this would be more precise in a real app)
    const distanceInKm = distanceInDegrees * 111;
    
    // Calculate bearing (direction to target)
    const bearing = Math.atan2(lonDiff, latDiff) * (180 / Math.PI);
    
    // Animate the direction arrow
    Animated.timing(arrowRotation, {
      toValue: bearing - currentLocation.heading,
      duration: 500,
      useNativeDriver: true
    }).start();
    
    // Set remaining distance and time
    setRemainingDistance(distanceInKm);
    
    // Estimate time based on average walking speed (4 km/h)
    const estimatedMinutes = Math.round((distanceInKm / 4) * 60);
    setRemainingTime(estimatedMinutes);
  };

  const startArrowAnimation = () => {
    // No additional animation needed, we're updating it based on bearing
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const moveToNextPlot = () => {
    if (!routePlan || currentPlotIndex >= routePlan.plotSequence.length - 1) {
      // End of route
      Alert.alert(
        'Navigation Complete',
        'You have reached the end of your planned route.',
        [
          { text: 'Return to Map', onPress: () => navigation.goBack() }
        ]
      );
      return;
    }
    
    setDestinationReached(false);
    setCurrentPlotIndex(currentPlotIndex + 1);
  };

  const moveToPreviousPlot = () => {
    if (currentPlotIndex <= 0) return;
    
    setDestinationReached(false);
    setCurrentPlotIndex(currentPlotIndex - 1);
  };

  const navigateToObservationForm = (plotId: string) => {
    // In a real app, navigate to the observation form for this plot
    // Typically you would also determine the correct protocol to use
    navigation.navigate('Observations' as any, {
      screen: 'ObservationForm',
      params: { 
        plotId, 
        protocolId: 'p1' // This would be determined based on the trial
      }
    });
  };

  const toggleNavigation = () => {
    setNavigationActive(!navigationActive);
  };

  const endNavigation = () => {
    Alert.alert(
      'End Navigation',
      'Are you sure you want to end navigation and return to the map?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Navigation', onPress: () => navigation.goBack() }
      ]
    );
  };

  const getCurrentPlot = () => {
    if (!routePlan || currentPlotIndex >= routePlan.plotSequence.length) return null;
    
    const plotId = routePlan.plotSequence[currentPlotIndex].plotId;
    return mockPlots[plotId];
  };

  const getDirectionInstruction = () => {
    if (destinationReached) {
      return 'You have arrived';
    }
    
    // This would be more sophisticated in a real app, using actual
    // directions and streets, but we'll keep it simple for demo
    const angleDegrees = (arrowRotation._value + 360) % 360;
    
    if (angleDegrees >= 315 || angleDegrees < 45) {
      return 'Continue straight ahead';
    } else if (angleDegrees >= 45 && angleDegrees < 135) {
      return 'Turn right';
    } else if (angleDegrees >= 135 && angleDegrees < 225) {
      return 'Turn around';
    } else {
      return 'Turn left';
    }
  };

  const getDistanceText = () => {
    if (remainingDistance < 0.1) {
      return `${Math.round(remainingDistance * 1000)} m`;
    }
    return `${remainingDistance.toFixed(1)} km`;
  };

  const getStatusColor = (status: Plot['status']) => {
    switch (status) {
      case 'unobserved': return '#9E9E9E'; // Grey
      case 'observed': return '#4CAF50'; // Green
      case 'flagged': return '#F44336'; // Red
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading navigation...</Text>
      </View>
    );
  }

  const currentPlot = getCurrentPlot();
  if (!currentPlot || !routePlan) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Navigation data not available. Please try again.
        </Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Return to Map</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Top navigation bar */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={endNavigation}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.destinationInfo}>
          <Text style={styles.destinationTitle}>
            Plot {currentPlot.plotNumber}
          </Text>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {currentPlotIndex + 1}/{routePlan.plotSequence.length}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.navToggle,
            navigationActive ? styles.navActive : styles.navInactive
          ]}
          onPress={toggleNavigation}
        >
          <Ionicons 
            name={navigationActive ? "navigate" : "navigate-outline"} 
            size={20} 
            color={navigationActive ? "white" : "#4CAF50"} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Map area (this would be an actual map in a real app) */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>
            Map View
          </Text>
          <Text style={styles.mapSubtext}>
            (This would be an interactive map with your position and route)
          </Text>
          
          {/* Simulated current location marker */}
          <View style={styles.currentLocationMarker}>
            <View style={styles.accuracyCircle} />
            <View style={styles.locationDot} />
          </View>
          
          {/* Destination marker */}
          <View style={styles.destinationMarker}>
            <View style={[
              styles.plotMarker,
              { borderColor: getStatusColor(currentPlot.status) }
            ]}>
              <Text style={styles.plotMarkerText}>{currentPlot.plotNumber}</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Direction instructions */}
      <View style={styles.directionsContainer}>
        <View style={styles.directionCard}>
          <View style={styles.directionHeader}>
            <Text style={styles.directionText}>
              {getDirectionInstruction()}
            </Text>
            <Text style={styles.distanceText}>
              {getDistanceText()}
            </Text>
          </View>
          
          <View style={styles.directionArrowContainer}>
            <Animated.View 
              style={[
                styles.directionArrow,
                { 
                  transform: [
                    { rotate: arrowRotation.interpolate({
                        inputRange: [-180, 180],
                        outputRange: ['-180deg', '180deg']
                    })},
                    { scale: destinationReached ? 1 : pulseAnimation }
                  ] 
                }
              ]}
            >
              <Ionicons 
                name="arrow-up" 
                size={48} 
                color={destinationReached ? "#4CAF50" : "#007AFF"} 
              />
            </Animated.View>
            <Text style={styles.etaText}>
              {remainingTime < 1 ? 'Less than a minute' : `~${remainingTime} min`}
            </Text>
          </View>
        </View>
        
        {/* Navigation controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[
              styles.controlButton,
              currentPlotIndex <= 0 && styles.controlButtonDisabled
            ]}
            onPress={moveToPreviousPlot}
            disabled={currentPlotIndex <= 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentPlotIndex <= 0 ? "#999" : "#4CAF50"} 
            />
            <Text style={[
              styles.controlText,
              currentPlotIndex <= 0 && styles.controlTextDisabled
            ]}>
              Previous
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.observeButton}
            onPress={() => navigateToObservationForm(currentPlot.id)}
          >
            <Ionicons name="clipboard-outline" size={22} color="white" />
            <Text style={styles.observeButtonText}>Record Observation</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.controlButton,
              currentPlotIndex >= (routePlan.plotSequence.length - 1) && styles.controlButtonDisabled
            ]}
            onPress={moveToNextPlot}
            disabled={currentPlotIndex >= (routePlan.plotSequence.length - 1)}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentPlotIndex >= (routePlan.plotSequence.length - 1) ? "#999" : "#4CAF50"} 
            />
            <Text style={[
              styles.controlText,
              currentPlotIndex >= (routePlan.plotSequence.length - 1) && styles.controlTextDisabled
            ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 4,
  },
  destinationInfo: {
    alignItems: 'center',
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  progressInfo: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  navToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navActive: {
    backgroundColor: '#388E3C',
  },
  navInactive: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  currentLocationMarker: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accuracyCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: 'white',
  },
  destinationMarker: {
    position: 'absolute',
    top: '30%',
    right: '30%',
  },
  plotMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  plotMarkerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  directionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16, // Extra padding for iOS
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  directionCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  directionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  directionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  distanceText: {
    fontSize: 16,
    color: '#666',
  },
  directionArrowContainer: {
    alignItems: 'center',
  },
  directionArrow: {
    marginBottom: 12,
  },
  etaText: {
    fontSize: 14,
    color: '#666',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
    padding: 8,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  controlText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  controlTextDisabled: {
    color: '#999',
  },
  observeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
  },
  observeButtonText: {
    marginLeft: 8,
    color: 'white',
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
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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

export default NavigationScreen;