import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Parameters
export type AuthStackParamList = {
  Login: undefined;
  OrganizationSelection: { userId: string };
  UserProfileSetup: { userId: string; organizationId: string };
};

// Main Tab Navigation Parameters
export type MainTabParamList = {
  Home: undefined;
  Trials: undefined;
  Map: undefined;
  Observations: undefined;
  Settings: undefined;
};

// Trial Stack Parameters
export type TrialStackParamList = {
  TrialsList: undefined;
  TrialDetails: { trialId: string };
  PlotsList: { trialId: string };
  PlotDetails: { plotId: string; trialId: string };
};

// Map Stack Parameters
export type MapStackParamList = {
  MapOverview: undefined;
  RoutePlanning: { trialId: string };
  Navigation: { 
    trialId: string;
    plotId?: string;
    routeId?: string;
  };
};

// Observation Stack Parameters
export type ObservationStackParamList = {
  ObservationsList: undefined;
  ObservationForm: { 
    plotId: string; 
    protocolId: string; 
    observationId?: string 
  };
  ImageCapture: { 
    plotId: string; 
    observationId?: string; 
    metricId?: string 
  };
  BatchObservation: { trialId: string; protocolId: string };
};

// Settings Stack Parameters
export type SettingsStackParamList = {
  SettingsList: undefined;
  AppSettings: undefined;
  OfflineSettings: undefined;
  EquipmentSettings: undefined;
  UserProfile: undefined;
};

// Root Stack Parameters
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};