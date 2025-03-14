# Agricultural Trial Plot Planning Mobile App

This is the mobile application component of the Agricultural Trial Plot Planning system. It enables users to manage agricultural trials, navigate field plots, collect observations, and synchronize data with the cloud backend.

## Features

- **Authentication**: Google and Microsoft SSO integration with offline access capability
- **Trial Management**: View and manage agricultural trials and plots
- **Map Navigation**: Interactive map for plot location with route optimization
- **Observation Collection**: Customizable forms for field data collection with image capture
- **Offline Mode**: Full functionality even without internet connectivity
- **Data Synchronization**: Seamless sync when connectivity is restored

## Technology Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Storage**: SQLite for local data persistence
- **Authentication**: Expo Auth Sessions for SSO
- **Maps**: React Native Maps
- **API Communication**: Axios with offline queue

## Project Structure

```
mobile/
├── AgTrialPlotPlanner/
│   ├── src/
│   │   ├── core/
│   │   │   ├── auth/          # Authentication services
│   │   │   ├── database/      # Local database services
│   │   │   ├── models/        # TypeScript interfaces and types
│   │   │   ├── networking/    # API client and network utilities
│   │   │   ├── store/         # Redux store and slices
│   │   │   └── utils/         # Utility functions
│   │   ├── features/
│   │   │   ├── authentication/ # Authentication screens
│   │   │   ├── home/          # Home screen
│   │   │   ├── plots/         # Plot management screens
│   │   │   ├── observations/  # Observation screens
│   │   │   ├── map/           # Map and navigation screens
│   │   │   └── settings/      # Settings screens
│   │   └── navigation/        # Navigation configuration
│   ├── assets/                # Images and assets
│   ├── App.tsx               # Main app component
│   └── ...
└── docs/                     # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- iOS: XCode and CocoaPods
- Android: Android Studio and Android SDK

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ag-trial-plot-planning.git
   cd ag-trial-plot-planning/mobile/AgTrialPlotPlanner
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env` and update with your configuration

4. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

5. Run on a device or emulator:
   ```
   # For iOS
   npm run ios
   # or
   yarn ios

   # For Android
   npm run android
   # or
   yarn android
   ```

## Development

### Authentication Setup

To configure the authentication:

1. Create OAuth applications in Google Cloud Console and Microsoft Azure
2. Update the client IDs in `src/core/auth/AuthService.ts`
3. Configure the redirect URIs in your OAuth providers

### Offline Mode

The app is designed to work offline:

- All data is stored locally in SQLite
- API requests are queued when offline
- Synchronization happens automatically when connectivity is restored

### Testing

Run tests with:

```
npm test
# or
yarn test
```

## App Architecture

The application follows a feature-based organization with Redux for state management:

- **Redux Slices**: Feature-specific state management
- **Services**: Core functionality implemented as services
- **Screen Components**: Presentation components for UI
- **Navigation**: Stack and tab-based navigation

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.