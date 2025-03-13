# Agricultural Trial Plot Planning - Mobile Applications

This directory contains the native mobile applications for iOS and Android platforms, designed for agricultural field trials and plot data collection. These applications are built with offline-first capabilities to function in remote field locations.

## Features

- **Offline-First Design**: Complete functionality without internet connection
- **Plot Navigation**: GPS-based guidance to agricultural plots with turn-by-turn directions
- **Data Collection**: Structured field observations with multiple input types (numeric, categorical, text, images)
- **Synchronization**: Intelligent data synchronization when connectivity is available
- **Equipment Integration**: Connect to field measurement devices via Bluetooth
- **Field-Optimized UI**: Glare-resistant design, large touch targets for gloved operation

## Application Structure

```
/mobile
  /ios               - iOS native application (Swift)
  /android           - Android native application (Kotlin)
  /design            - Shared design assets
  /docs              - Mobile-specific documentation
```

## Architecture

Both applications follow similar clean architecture principles:

1. **Presentation Layer**: UI components and view models
2. **Domain Layer**: Business logic and use cases
3. **Data Layer**: Repositories and data sources (API and local)
4. **Core Services**: Authentication, database, networking, etc.

## Authentication

Both applications support:
- Google SSO integration
- Microsoft SSO integration
- Demo login mechanism for testing
- Offline authentication for field use

## Key Components Implemented

### iOS (Swift)
- SwiftUI-based UI implementation
- Core authentication flows
- Offline database with SQLite
- Network service with error handling
- Field mode optimizations
- JWT token management

### Android (Kotlin)
- Jetpack Compose UI implementation
- Clean architecture with MVVM pattern
- Authentication flows
- Dependency injection with Hilt
- Network connectivity monitoring
- Field mode optimizations

## Field Mode Features

Both applications include special field mode features:
- High-contrast display for direct sunlight
- Battery optimization settings
- Large touch targets for gloved operation
- Screen timeout prevention during active use
- Offline data collection and syncing

## Getting Started

See the platform-specific README files:
- [iOS README](/ios/README.md)
- [Android README](/android/README.md)

## Implementation Status

This is a starter implementation focusing on the core architecture and authentication flows. The following key components are ready for further development:

- [x] Project structure and architecture
- [x] Authentication system
- [x] Offline database design
- [x] Network connectivity handling
- [x] Field mode optimizations
- [ ] Plot navigation (partial)
- [ ] Data collection screens (partial)
- [ ] Synchronization system (framework only)
- [ ] Equipment integration (planned)