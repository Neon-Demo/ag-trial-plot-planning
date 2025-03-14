// Types for the application

// User model
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  preferences?: UserPreferences;
  organizations: string[]; // Organization IDs
}

export interface UserPreferences {
  units: 'metric' | 'imperial';
  notificationPreferences: Record<string, boolean>;
  displaySettings: Record<string, any>;
}

// Organization model
export interface Organization {
  id: string;
  name: string;
  description?: string;
  contactEmail?: string;
  logoUrl?: string;
}

// Trial model
export interface Trial {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  location?: string;
  cropType?: string;
  status: 'planned' | 'active' | 'completed';
  startDate?: string;
  plannedEndDate?: string;
  actualEndDate?: string;
  plotCount?: number;
  completedObservations?: number;
  totalObservations?: number;
}

// Plot model
export interface Plot {
  id: string;
  trialId: string;
  plotNumber: string;
  treatmentId?: string;
  replication?: number;
  coordinates: GeoJSON.Polygon;
  centroid?: GeoJSON.Point;
  size?: {
    value: number;
    unit: string;
  };
  status: 'unobserved' | 'observed' | 'flagged';
  plantingDate?: string;
  emergenceDate?: string;
}

// Treatment model
export interface Treatment {
  id: string;
  trialId: string;
  name: string;
  description?: string;
  factors?: Record<string, any>;
  color?: string;
}

// Observation protocol model
export interface ObservationProtocol {
  id: string;
  trialId: string;
  name: string;
  description?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  metrics: ObservationMetric[];
}

// Observation metric model
export interface ObservationMetric {
  id: string;
  protocolId: string;
  name: string;
  type: 'numeric' | 'integer' | 'categorical' | 'text' | 'image' | 'boolean';
  unit?: string;
  validationRules?: {
    min?: number;
    max?: number;
    options?: Array<{value: any; label: string}>;
  };
  required: boolean;
  displayOrder?: number;
}

// Observation model
export interface Observation {
  id: string;
  plotId: string;
  protocolId: string;
  observerId: string;
  observationTimestamp: string;
  location?: GeoJSON.Point;
  weatherData?: Record<string, any>;
  blinded: boolean;
  isSynced: boolean;
  values: ObservationValue[];
}

// Observation value model
export interface ObservationValue {
  id: string;
  observationId: string;
  metricId: string;
  value: any;
  unit?: string;
}

// Image model
export interface Image {
  id: string;
  plotId: string;
  observationId?: string;
  metricId?: string;
  url: string;
  thumbnailUrl?: string;
  captureTimestamp: string;
  geoLocation?: GeoJSON.Point;
  width?: number;
  height?: number;
  fileType?: string;
  fileSize?: number;
  isSynced: boolean;
}

// Route plan model
export interface RoutePlan {
  id: string;
  trialId: string;
  userId: string;
  name?: string;
  plotSequence: Array<{
    plotId: string;
    plotNumber: string;
    centroid: GeoJSON.Point;
    distance?: {
      fromPrevious?: {
        value: number;
        unit: string;
      };
      fromStart?: {
        value: number;
        unit: string;
      };
    };
  }>;
  routeGeometry?: GeoJSON.LineString;
  totalDistance?: {
    value: number;
    unit: string;
  };
  estimatedDuration?: number;
  optimizationStrategy?: 'distance' | 'completion_time' | 'treatment_blocks';
}

// Weather data model
export interface WeatherData {
  id: string;
  trialId: string;
  date: string;
  location: GeoJSON.Point;
  dailySummary?: Record<string, any>;
  hourlyData?: Record<string, any>;
  precipitation?: number;
  temperatureMin?: number;
  temperatureMax?: number;
  temperatureAvg?: number;
  humidityAvg?: number;
  windSpeed?: number;
  windDirection?: number;
  gdd?: number;
}

// Authentication
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// API Response
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: string[];
}