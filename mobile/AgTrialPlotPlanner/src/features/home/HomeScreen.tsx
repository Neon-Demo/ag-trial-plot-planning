import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../core/store';
import { logout } from '../../core/store/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { Trial } from '../../core/models/Types';

// Mock data
const mockTrials: Trial[] = [
  {
    id: 'trial1',
    organizationId: 'org1',
    name: 'Corn Variety Trial 2024',
    description: 'Evaluation of 10 corn varieties under standard conditions',
    location: 'North Field Station',
    cropType: 'corn',
    status: 'active',
    startDate: '2024-04-15',
    plannedEndDate: '2024-10-30',
    plotCount: 120,
    completedObservations: 54,
    totalObservations: 120,
  },
  {
    id: 'trial2',
    organizationId: 'org1',
    name: 'Soybean Drought Resistance',
    description: 'Testing drought resistance of 8 soybean varieties',
    location: 'South Field Station',
    cropType: 'soybean',
    status: 'active',
    startDate: '2024-05-01',
    plannedEndDate: '2024-09-30',
    plotCount: 80,
    completedObservations: 24,
    totalObservations: 80,
  },
  {
    id: 'trial3',
    organizationId: 'org1',
    name: 'Wheat Fertilizer Trial',
    description: 'Comparing 5 fertilizer regimes on winter wheat',
    location: 'East Field Station',
    cropType: 'wheat',
    status: 'planned',
    startDate: '2024-09-15',
    plannedEndDate: '2025-07-30',
    plotCount: 50,
    completedObservations: 0,
    totalObservations: 0,
  }
];

const mockTodayObservations = [
  {
    id: 'obs1',
    time: '9:00 AM',
    title: 'Vegetative Stage Assessment',
    trialName: 'Corn Variety Trial 2024',
    trialId: 'trial1',
    plotCount: 15,
    status: 'pending',
    type: 'weekly',
  },
  {
    id: 'obs2',
    time: '1:30 PM',
    title: 'Disease Incidence Check',
    trialName: 'Soybean Drought Resistance',
    trialId: 'trial2',
    plotCount: 8,
    status: 'pending',
    type: 'critical',
  },
  {
    id: 'obs3',
    time: '11:00 AM',
    title: 'Leaf Development Measurement',
    trialName: 'Corn Variety Trial 2024',
    trialId: 'trial1',
    plotCount: 20,
    status: 'completed',
    type: 'standard',
  },
];

const mockRecentPlots = [
  {
    id: 'plot1',
    plotNumber: 'A101',
    trialId: 'trial1',
    trialName: 'Corn Variety Trial 2024',
    lastVisited: '2024-06-14',
  },
  {
    id: 'plot2',
    plotNumber: 'B205',
    trialId: 'trial2',
    trialName: 'Soybean Drought Resistance',
    lastVisited: '2024-06-13',
  },
  {
    id: 'plot3',
    plotNumber: 'A105',
    trialId: 'trial1',
    trialName: 'Corn Variety Trial 2024',
    lastVisited: '2024-06-12',
  }
];

const mockWeather = {
  location: 'North Field Station',
  date: 'Today',
  temperature: 24,
  condition: 'Partly Cloudy',
  icon: 'partly-sunny',
  humidity: 65,
  precipitation: 20,
  windSpeed: 8,
  forecast: [
    { day: 'Today', high: 24, low: 18, icon: 'partly-sunny' },
    { day: 'Tomorrow', high: 26, low: 19, icon: 'sunny' },
    { day: 'Friday', high: 23, low: 17, icon: 'rainy' },
  ]
};

/**
 * Home Screen
 * Based on screen breakdown 1.2 - Home & Dashboard
 * - Current active trials summary
 * - Quick access to recent plots
 * - Today's observation schedule
 * - Weather conditions overlay
 * - Sync status indicator
 */
const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'pending'>('synced');
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [activeTrials, setActiveTrials] = useState(mockTrials.filter(trial => trial.status === 'active'));
  const [recentPlots, setRecentPlots] = useState(mockRecentPlots);
  const [todayObservations, setTodayObservations] = useState(mockTodayObservations);
  const [weather, setWeather] = useState(mockWeather);

  // Simulated data fetch
  useEffect(() => {
    // This would be replaced with actual API calls in the real app
    const simulateInitialDataFetch = async () => {
      // In a real app, we would call API endpoints here
    };
    
    simulateInitialDataFetch();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Simulate data refresh
    setTimeout(() => {
      // This would be real data fetching in the actual app
      
      // Simulate sync status changes
      const syncStates = ['synced', 'pending', 'syncing', 'offline'] as const;
      const randomState = syncStates[Math.floor(Math.random() * syncStates.length)];
      setSyncStatus(randomState);
      setPendingSyncs(randomState === 'pending' ? Math.floor(Math.random() * 10) + 1 : 0);
      
      setRefreshing(false);
    }, 1500);
  }, []);

  const navigateToTrial = (trialId: string) => {
    // Would navigate to trial details in the real app
    console.log('Navigate to trial:', trialId);
  };

  const navigateToPlot = (plotId: string) => {
    // Would navigate to plot details in the real app
    console.log('Navigate to plot:', plotId);
  };

  const navigateToObservation = (obsId: string) => {
    // Would navigate to observation form in the real app
    console.log('Navigate to observation:', obsId);
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'synced': return '#4CAF50';
      case 'syncing': return '#2196F3';
      case 'pending': return '#FF9800';
      case 'offline': return '#F44336';
      default: return '#757575';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'synced': return 'All data synced';
      case 'syncing': return 'Syncing data...';
      case 'pending': return `${pendingSyncs} item${pendingSyncs > 1 ? 's' : ''} pending sync`;
      case 'offline': return 'Working offline';
      default: return 'Unknown status';
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'synced': return 'checkmark-circle';
      case 'syncing': return 'sync';
      case 'pending': return 'cloud-upload';
      case 'offline': return 'cloud-offline';
      default: return 'help-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.firstName || 'User'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.syncButton}>
            <Ionicons name={getSyncStatusIcon()} size={20} color={getSyncStatusColor()} />
            <Text style={[styles.syncText, { color: getSyncStatusColor() }]}>
              {getSyncStatusText()}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Weather Banner */}
        <View style={styles.weatherBanner}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1489&q=80' }}
            style={styles.weatherBackground}
            imageStyle={{ borderRadius: 8 }}
          >
            <View style={styles.weatherOverlay}>
              <View style={styles.weatherHeader}>
                <View>
                  <Text style={styles.weatherLocation}>{weather.location}</Text>
                  <Text style={styles.weatherDate}>{weather.date}</Text>
                </View>
                <View style={styles.weatherTempContainer}>
                  <Ionicons name={weather.icon as any} size={28} color="#FFFFFF" />
                  <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
                </View>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherItem}>
                  <Ionicons name="water-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.weatherItemText}>Humidity: {weather.humidity}%</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Ionicons name="umbrella-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.weatherItemText}>Precipitation: {weather.precipitation}%</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Ionicons name="leaf-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.weatherItemText}>Wind: {weather.windSpeed} km/h</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="create-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>New Observation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="map-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Plan Route</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="sync-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Sync Data</Text>
          </TouchableOpacity>
        </View>
        
        {/* Active Trials Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Trials</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllButtonText}>See All</Text>
              <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          
          {activeTrials.map(trial => (
            <TouchableOpacity 
              key={trial.id} 
              style={styles.trialCard}
              onPress={() => navigateToTrial(trial.id)}
            >
              <View style={styles.trialCardHeader}>
                <View style={styles.trialIconContainer}>
                  <Ionicons 
                    name={trial.cropType === 'corn' ? 'leaf' : trial.cropType === 'soybean' ? 'nutrition' : 'flower'}
                    size={24} 
                    color="#4CAF50" 
                  />
                </View>
                <View style={styles.trialHeaderContent}>
                  <Text style={styles.trialName}>{trial.name}</Text>
                  <Text style={styles.trialLocation}>{trial.location}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
              
              <View style={styles.trialMetrics}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>{trial.plotCount}</Text>
                  <Text style={styles.metricLabel}>Plots</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>
                    {trial.completedObservations && trial.totalObservations 
                      ? Math.round((trial.completedObservations / trial.totalObservations) * 100) 
                      : 0}%
                  </Text>
                  <Text style={styles.metricLabel}>Completed</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>
                    {trial.totalObservations ? trial.totalObservations - (trial.completedObservations || 0) : 0}
                  </Text>
                  <Text style={styles.metricLabel}>Remaining</Text>
                </View>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${trial.completedObservations && trial.totalObservations 
                        ? Math.round((trial.completedObservations / trial.totalObservations) * 100) 
                        : 0}%` 
                    }
                  ]} 
                />
              </View>
              
              <View style={styles.trialCardActions}>
                <TouchableOpacity style={styles.trialActionButton}>
                  <Ionicons name="create-outline" size={16} color="#4CAF50" />
                  <Text style={styles.trialActionText}>Observe</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trialActionButton}>
                  <Ionicons name="map-outline" size={16} color="#4CAF50" />
                  <Text style={styles.trialActionText}>Navigate</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.trialActionButton}>
                  <Ionicons name="analytics-outline" size={16} color="#4CAF50" />
                  <Text style={styles.trialActionText}>Analytics</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Today's Observations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Observations</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllButtonText}>Schedule</Text>
              <Ionicons name="calendar-outline" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.observationSchedule}>
            {todayObservations.map(obs => (
              <TouchableOpacity 
                key={obs.id}
                style={[
                  styles.scheduleItem,
                  obs.status === 'completed' && styles.scheduleItemCompleted
                ]}
                onPress={() => navigateToObservation(obs.id)}
              >
                <View style={styles.scheduleTimeContainer}>
                  <Text style={styles.scheduleTime}>{obs.time}</Text>
                  {obs.type === 'critical' && (
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>Priority</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.scheduleContentContainer}>
                  <Text style={styles.scheduleTitle}>{obs.title}</Text>
                  <Text style={styles.scheduleSubtitle}>{obs.trialName} - {obs.plotCount} plots</Text>
                  
                  <View style={styles.scheduleStatus}>
                    {obs.status === 'pending' ? (
                      <>
                        <Ionicons name="time-outline" size={16} color="#FF9800" />
                        <Text style={styles.scheduleStatusText}>Pending</Text>
                      </>
                    ) : obs.status === 'completed' ? (
                      <>
                        <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                        <Text style={[styles.scheduleStatusText, { color: '#4CAF50' }]}>Completed</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="alert-circle" size={16} color="#F44336" />
                        <Text style={[styles.scheduleStatusText, { color: '#F44336' }]}>Late</Text>
                      </>
                    )}
                  </View>
                </View>
                
                <Ionicons 
                  name={obs.status === 'completed' ? 'checkmark-circle' : 'chevron-forward'} 
                  size={24} 
                  color={obs.status === 'completed' ? '#4CAF50' : '#BBBBBB'} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Recent Plots Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Plots</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllButtonText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.recentPlotsContainer}>
            {recentPlots.map(plot => (
              <TouchableOpacity 
                key={plot.id}
                style={styles.recentPlotCard}
                onPress={() => navigateToPlot(plot.id)}
              >
                <View style={styles.recentPlotHeader}>
                  <Text style={styles.recentPlotNumber}>{plot.plotNumber}</Text>
                </View>
                <Text style={styles.recentPlotTrial}>{plot.trialName}</Text>
                <View style={styles.recentPlotFooter}>
                  <Ionicons name="time-outline" size={12} color="#757575" />
                  <Text style={styles.recentPlotDate}>Last visited: {plot.lastVisited}</Text>
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.viewAllPlotsCard}>
              <Ionicons name="grid" size={24} color="#4CAF50" />
              <Text style={styles.viewAllPlotsText}>View All Plots</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* Weather Forecast Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weather Forecast</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllButtonText}>7-Day</Text>
              <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.forecastContainer}>
            {weather.forecast.map((day, index) => (
              <View key={index} style={styles.forecastDay}>
                <Text style={styles.forecastDayText}>{day.day}</Text>
                <Ionicons name={day.icon as any} size={24} color="#757575" />
                <View style={styles.forecastTemp}>
                  <Text style={styles.forecastHighTemp}>{day.high}°</Text>
                  <Text style={styles.forecastLowTemp}>{day.low}°</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  welcomeText: {
    fontSize: 14,
    color: '#757575',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  syncText: {
    fontSize: 12,
    marginLeft: 4,
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  weatherBanner: {
    margin: 16,
    height: 150,
    borderRadius: 8,
  },
  weatherBackground: {
    flex: 1,
    overflow: 'hidden',
  },
  weatherOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 16,
    justifyContent: 'space-between',
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  weatherDate: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  weatherTempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherItemText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: 4,
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 4,
  },
  trialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  trialCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trialHeaderContent: {
    flex: 1,
  },
  trialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  trialLocation: {
    fontSize: 14,
    color: '#757575',
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  trialMetrics: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  metricLabel: {
    fontSize: 12,
    color: '#757575',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  trialCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trialActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  trialActionText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  observationSchedule: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  scheduleItemCompleted: {
    opacity: 0.6,
  },
  scheduleTimeContainer: {
    width: 75,
    marginRight: 12,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4CAF50',
  },
  priorityBadge: {
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 4,
  },
  priorityText: {
    fontSize: 10,
    color: '#F44336',
    fontWeight: '500',
  },
  scheduleContentContainer: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212121',
    marginBottom: 4,
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  scheduleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleStatusText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
  },
  recentPlotsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recentPlotCard: {
    width: 150,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    justifyContent: 'space-between',
  },
  recentPlotHeader: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recentPlotNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  recentPlotTrial: {
    fontSize: 12,
    color: '#424242',
  },
  recentPlotFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentPlotDate: {
    fontSize: 10,
    color: '#757575',
    marginLeft: 4,
  },
  viewAllPlotsCard: {
    width: 150,
    height: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  viewAllPlotsText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
  },
  forecastContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  forecastDay: {
    flex: 1,
    alignItems: 'center',
  },
  forecastDayText: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 8,
  },
  forecastTemp: {
    flexDirection: 'row',
    marginTop: 8,
  },
  forecastHighTemp: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    marginRight: 4,
  },
  forecastLowTemp: {
    fontSize: 14,
    color: '#2196F3',
  },
});

export default HomeScreen;