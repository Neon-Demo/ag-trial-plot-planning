# AG Trial Plot Planning - Android App

This directory contains the Android application for the Agricultural Trial Plot Planning system.

## Requirements

- Android Studio Flamingo or newer
- Android SDK 33 (Android 13) or newer
- Gradle 8.0+
- Kotlin 1.8+
- Java 17

## Project Structure

The project follows Clean Architecture principles with three main layers:

```
/app
  /src
    /main
      /java/com/agtrial/planner
        /core          - Core utilities, base classes, and DI
        /data          - API implementation, data sources, and repositories
        /domain        - Business logic, entities, and use cases
        /presentation  - UI components, ViewModels, and navigation
      /res             - Android resources
      /assets          - Static assets
```

## Architecture

The application uses:

- **MVVM** (Model-View-ViewModel) architecture pattern
- **Clean Architecture** for separation of concerns
- **Jetpack Compose** for modern UI development
- **Kotlin Coroutines & Flow** for asynchronous programming
- **Hilt** for dependency injection
- **Room** for local database
- **Retrofit** for networking
- **DataStore** for preferences
- **WorkManager** for background tasks

## Features

- **Offline-First Design**: Complete functionality without internet connection
- **Plot Navigation**: GPS-based guidance to agricultural plots
- **Data Collection**: Structured field observations with multiple input types
- **Synchronization**: Intelligent data synchronization when connectivity is available
- **Equipment Integration**: Connect to field measurement devices
- **Field-Optimized UI**: Glare-resistant design, large touch targets for gloved operation

## Authentication

The application supports:
- Google SSO
- Microsoft SSO
- Email/password authentication
- Offline authentication

## Setup

1. Clone the repository
2. Open the project in Android Studio
3. Sync Gradle files
4. Run the app on an emulator or physical device

## Build Variants

- **debug**: Development build with logging and debug options
- **release**: Production ready build with optimizations
- **staging**: Testing build with staging environment configuration

## Testing

The project includes:
- Unit tests with JUnit and MockK
- Instrumentation tests with Espresso
- UI tests with Compose testing libraries

Run tests with:
```
./gradlew test          # Unit tests
./gradlew connectedTest # Instrumentation tests
```

## Deployment

Build the app with:
```
./gradlew assembleRelease
```

The APK will be generated in `app/build/outputs/apk/release/`.