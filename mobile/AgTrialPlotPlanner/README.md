# AgTrialPlotPlanner Mobile Application

A React Native mobile application for agricultural trial plot planning, navigation, and data collection.

## Features

- **Authentication**: Google and Microsoft SSO with demo mode
- **Offline Capability**: Full functionality without connectivity
- **Plot Navigation**: Interactive field maps with route optimization
- **Data Collection**: Customizable observation forms with image capture
- **Synchronization**: Seamless data syncing with cloud backend

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS/Android emulator or physical device

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

3. Run on iOS/Android:
   ```bash
   # iOS
   npm run ios
   # or
   yarn ios

   # Android
   npm run android
   # or
   yarn android
   ```

## Development

### Authentication Setup

1. Create OAuth applications in Google Cloud Console and Microsoft Azure
2. Update client IDs in `src/core/auth/AuthService.ts`

### Project Structure

- **src/core**: Core services and utilities
  - **auth**: Authentication services
  - **database**: SQLite database services
  - **models**: TypeScript types and interfaces
  - **networking**: API client and offline queue
  - **store**: Redux store and slices
  - **utils**: Helper functions and utilities

- **src/features**: Feature modules
  - **authentication**: Login and user management
  - **home**: Dashboard and overview
  - **plots**: Plot management and details
  - **observations**: Data collection forms
  - **map**: Mapping and navigation
  - **settings**: Application settings

- **src/navigation**: Navigation configuration

### Commands

- `npm start`: Start development server
- `npm run ios`: Run on iOS simulator
- `npm run android`: Run on Android emulator
- `npm test`: Run tests
- `npm run lint`: Lint code
- `npm run ts:check`: Type check
- `npm run clean`: Fix dependencies

## License

This project is licensed under the MIT License. See the LICENSE file for details.
