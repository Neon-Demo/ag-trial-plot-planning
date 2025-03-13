# Mobile Architecture

This document outlines the architecture of the AG Trial Plot Planning mobile applications.

## Overview

The mobile applications follow a modular, clean architecture approach with separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     Presentation Layer                   │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │      Views      │ │   ViewModels    │ │  Composites │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────┤
│                     Domain Layer                         │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │    Use Cases    │ │     Entities    │ │  Interfaces │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────┤
│                     Data Layer                           │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│ │  Repositories   │ │  Data Sources   │ │    Models   │ │
│ └─────────────────┘ └─────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────┤
│                     Core Services                        │
│ ┌─────────────┐ ┌─────────────┐ ┌──────────────────────┐│
│ │  Networking │ │  Database   │ │ Hardware Integration ││
│ └─────────────┘ └─────────────┘ └──────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## Layers

### Presentation Layer
- **Views**: UI components (Activities, Fragments in Android; ViewControllers in iOS)
- **ViewModels**: Manage UI state and handle user interactions
- **Composites**: Reusable UI components

### Domain Layer
- **Use Cases**: Business logic
- **Entities**: Business models
- **Interfaces**: Abstractions for repositories and services

### Data Layer
- **Repositories**: Implement domain interfaces
- **Data Sources**: Remote (API) and local (Database) data sources
- **Models**: Data transfer objects

### Core Services
- **Networking**: API client, connectivity monitoring
- **Database**: Local persistence with SQLite
- **Hardware Integration**: GPS, camera, sensors, Bluetooth

## Key Components

### Authentication
- JWT-based authentication
- Token storage and refresh
- SSO providers integration
- Offline authentication

### Synchronization
- Offline-first data management
- Conflict resolution strategies
- Background sync service
- Sync prioritization

### Navigation
- GPS and location services
- Route calculation
- Turn-by-turn guidance
- Map rendering

### Observation Collection
- Dynamic form generation
- Input validation
- Image processing
- Offline storage

### Equipment Integration
- Bluetooth connectivity
- Device discovery
- Data parsing
- Calibration utilities

## Platform-Specific Implementations

While maintaining the same architecture, the implementations differ based on platform conventions:

### iOS (Swift)
- SwiftUI for modern UI components
- Combine for reactive programming
- Core Data for local persistence
- MVVM pattern with Coordinators

### Android (Kotlin)
- Jetpack Compose for modern UI
- Kotlin Coroutines and Flow for async operations
- Room for local persistence
- MVVM pattern with Navigation Components

## Offline Support Architecture

```
┌───────────────────┐     ┌───────────────────┐
│   Online Source   │     │  Offline Source   │
└────────┬──────────┘     └──────────┬────────┘
         │                           │
         ▼                           ▼
┌────────────────────────────────────────────┐
│                Repository                   │
│  (with synchronization and conflict logic)  │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────┐
│                Use Cases                    │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────┐
│             ViewModels/Presenters          │
└────────────────────┬───────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────┐
│                   Views                     │
└────────────────────────────────────────────┘
```

The repository layer determines data source priority based on connectivity and data freshness.