import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polygon, MapEvent, Region } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MapStackParamList } from '../../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Mock data for plots
const mockPlots = [
  {
    id: 'plot1',
    plotNumber: 'A101',
    trialId: 'trial1',
    trialName: 'Corn Variety Trial 2024',
    status: 'completed',
    coordinates: [
      { latitude: 37.7825, longitude: -122.4324 },
      { latitude: 37.7825, longitude: -122.4314 },
      { latitude: 37.7815, longitude: -122.4314 },
      { latitude: 37.7815, longitude: -122.4324 },
    ],
    color: '#4CAF50',
  },
  {
    id: 'plot2',
    plotNumber: 'A102',
    trialId: 'trial1',
    trialName: 'Corn Variety Trial 2024',
    status: 'pending',
    coordinates: [
      { latitude: 37.7825, longitude: -122.4314 },
      { latitude: 37.7825, longitude: -122.4304 },
      { latitude: 37.7815, longitude: -122.4304 },
      { latitude: 37.7815, longitude: -122.4314 },
    ],
    color: '#FF9800',
  },
  {
    id: 'plot3',
    plotNumber: 'B101',
    trialId: 'trial2',
    trialName: 'Soybean Drought Resistance',
    status: 'pending',
    coordinates: [
      { latitude: 37.7815, longitude: -122.4324 },
      { latitude: 37.7815, longitude: -122.4314 },
      { latitude: 37.7805, longitude: -122.4314 },
      { latitude: 37.7805, longitude: -122.4324 },
    ],
    color: '#2196F3',
  },
  {
    id: 'plot4',
    plotNumber: 'B102',
    trialId: 'trial2',
    trialName: 'Soybean Drought Resistance',
    status: 'pending',
    coordinates: [
      { latitude: 37.7815, longitude: -122.4314 },
      { latitude: 37.7815, longitude: -122.4304 },
      { latitude: 37.7805, longitude: -122.4304 },
      { latitude: 37.7805, longitude: -122.4314 },
    ],
    color: '#2196F3',
  },
];

// Marker for user's location
const initialRegion = {
  latitude: 37.7815,
  longitude: -122.4314,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};

/**
 * Map Overview Screen
 * Based on screen breakdown 1.3 - Plot Navigation
 * - Interactive map with all plots
 * - Color-coded plot status indicators
 * - Current location indicator
 * - Planned route visualization
 * - Alternative route options
 * - Layer toggles (satellite, topographic)
 */
const MapOverviewScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [region, setRegion] = useState(initialRegion);
  const [selectedPlot, setSelectedPlot] = useState<typeof mockPlots[0] | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [activeLayers, setActiveLayers] = useState({
    plots: true,
    routes: true,
    weather: false,
    boundaries: true,
  });

  // Request location permissions and get user location
  useEffect(() => {
    const getUserLocation = async () => {
      setIsLoadingLocation(true);
      
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Allow location access to see your position on the map');
          setIsLoadingLocation(false);
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        // Center map on user location
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Location Error', 'Could not get your current location');
      } finally {
        setIsLoadingLocation(false);
      }
    };
    
    getUserLocation();
  }, []);

  const onRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleMapTypeChange = (type: 'standard' | 'satellite' | 'hybrid') => {
    setMapType(type);
  };

  const handlePlotPress = (plot: typeof mockPlots[0]) => {
    setSelectedPlot(plot);
  };

  const handleNavigateToPlot = () => {
    if (selectedPlot) {
      navigation.navigate('Navigation', {
        trialId: selectedPlot.trialId,
        plotId: selectedPlot.id,
      });
    }
  };

  const handlePlanRoute = () => {
    if (selectedPlot) {
      navigation.navigate('RoutePlanning', {
        trialId: selectedPlot.trialId,
      });
    } else {
      // Navigate to route planning with no plot pre-selected
      navigation.navigate('RoutePlanning', {
        trialId: mockPlots[0].trialId, // Default to first trial
      });
    }
  };

  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    } else {
      Alert.alert('Location Unavailable', 'Your current location is not available');
    }
  };

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'flagged': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          region={region}
          onRegionChangeComplete={onRegionChange}
          mapType={mapType}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={true}
          showsScale={true}
          loadingEnabled={true}
        >
          {/* Plots */}
          {activeLayers.plots && mockPlots.map(plot => (
            <Polygon
              key={plot.id}
              coordinates={plot.coordinates}
              strokeWidth={2}
              strokeColor={plot.color}
              fillColor={selectedPlot?.id === plot.id ? `${plot.color}99` : `${plot.color}33`}
              onPress={() => handlePlotPress(plot)}
            />
          ))}
          
          {/* Plot Markers */}
          {activeLayers.plots && mockPlots.map(plot => {
            // Calculate centroid of the plot
            const centerLat = plot.coordinates.reduce((sum, coord) => sum + coord.latitude, 0) / plot.coordinates.length;
            const centerLng = plot.coordinates.reduce((sum, coord) => sum + coord.longitude, 0) / plot.coordinates.length;
            
            return (
              <Marker
                key={`marker-${plot.id}`}
                coordinate={{ latitude: centerLat, longitude: centerLng }}
                title={plot.plotNumber}
                description={plot.trialName}
                onPress={() => handlePlotPress(plot)}
              >
                <View style={[styles.plotMarker, { backgroundColor: getStatusColor(plot.status) }]}>
                  <Text style={styles.plotMarkerText}>{plot.plotNumber}</Text>
                </View>
              </Marker>
            );
          })}
        </MapView>
        
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={centerOnUserLocation}
          >
            <Ionicons name="locate" size={24} color="#4CAF50" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.mapControlButton}
            onPress={() => handleMapTypeChange(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <Ionicons 
              name={mapType === 'standard' ? 'map' : 'earth'} 
              size={24} 
              color="#4CAF50" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.mapControlButton, styles.routeButton]}
            onPress={handlePlanRoute}
          >
            <Ionicons name="map-outline" size={24} color="white" />
            <Text style={styles.routeButtonText}>Plan Route</Text>
          </TouchableOpacity>
        </View>
        
        {/* Layer Controls */}
        <View style={styles.layerControls}>
          <TouchableOpacity
            style={[styles.layerButton, activeLayers.plots && styles.layerButtonActive]}
            onPress={() => toggleLayer('plots')}
          >
            <Ionicons name="apps" size={16} color={activeLayers.plots ? '#FFFFFF' : '#4CAF50'} />
            <Text style={[styles.layerButtonText, activeLayers.plots && styles.layerButtonTextActive]}>Plots</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.layerButton, activeLayers.routes && styles.layerButtonActive]}
            onPress={() => toggleLayer('routes')}
          >
            <Ionicons name="git-network" size={16} color={activeLayers.routes ? '#FFFFFF' : '#4CAF50'} />
            <Text style={[styles.layerButtonText, activeLayers.routes && styles.layerButtonTextActive]}>Routes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.layerButton, activeLayers.weather && styles.layerButtonActive]}
            onPress={() => toggleLayer('weather')}
          >
            <Ionicons name="partly-sunny" size={16} color={activeLayers.weather ? '#FFFFFF' : '#4CAF50'} />
            <Text style={[styles.layerButtonText, activeLayers.weather && styles.layerButtonTextActive]}>Weather</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.layerButton, activeLayers.boundaries && styles.layerButtonActive]}
            onPress={() => toggleLayer('boundaries')}
          >
            <Ionicons name="crop" size={16} color={activeLayers.boundaries ? '#FFFFFF' : '#4CAF50'} />
            <Text style={[styles.layerButtonText, activeLayers.boundaries && styles.layerButtonTextActive]}>Boundaries</Text>
          </TouchableOpacity>
        </View>
        
        {/* Loading Indicator */}
        {isLoadingLocation && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Getting location...</Text>
          </View>
        )}
        
        {/* Information Panel */}
        {selectedPlot && (
          <View style={styles.infoPanel}>
            <View style={styles.infoPanelHeader}>
              <Text style={styles.plotNumber}>{selectedPlot.plotNumber}</Text>
              <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(selectedPlot.status) }]}>
                <Text style={styles.statusText}>
                  {selectedPlot.status.charAt(0).toUpperCase() + selectedPlot.status.slice(1)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.trialName}>{selectedPlot.trialName}</Text>
            
            <View style={styles.infoActions}>
              <TouchableOpacity style={styles.infoButton} onPress={handleNavigateToPlot}>
                <Ionicons name="navigate" size={20} color="#4CAF50" />
                <Text style={styles.infoButtonText}>Navigate</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoButton} onPress={handlePlanRoute}>
                <Ionicons name="map-outline" size={20} color="#4CAF50" />
                <Text style={styles.infoButtonText}>Plan Route</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.infoButton}>
                <Ionicons name="create" size={20} color="#4CAF50" />
                <Text style={styles.infoButtonText}>Observe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedPlot(null)}
              >
                <Ionicons name="close" size={20} color="#757575" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Floating Route Planning Button */}
        <TouchableOpacity 
          style={styles.floatingActionButton}
          onPress={handlePlanRoute}
        >
          <Ionicons name="map-outline" size={24} color="white" />
          <Text style={styles.fabText}>Plan Route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  mapControlButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  mapControlText: {
    fontSize: 10,
    color: '#4CAF50',
    marginTop: 2,
  },
  routeButton: {
    backgroundColor: '#4CAF50',
    borderBottomColor: '#4CAF50',
  },
  routeButtonText: {
    fontSize: 10,
    color: 'white',
    marginTop: 2,
    fontWeight: 'bold',
  },
  layerControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  layerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  layerButtonActive: {
    backgroundColor: '#4CAF50',
  },
  layerButtonText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  layerButtonTextActive: {
    color: '#FFFFFF',
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  plotNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  trialName: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  infoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  infoButtonText: {
    fontSize: 11,
    marginLeft: 4,
    color: '#4CAF50',
  },
  closeButton: {
    padding: 8,
  },
  plotMarker: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  plotMarkerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#4CAF50',
    fontSize: 16,
  },
  floatingActionButton: {
    position: 'absolute',
    bottom: 90, // Positioned above the info panel
    right: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default MapOverviewScreen;