# PakeAja CRM Mobile App - Architecture

This Flutter application follows Clean Architecture principles with feature-based modularization.

## Directory Structure

```
lib/
├── core/                  # Core functionality shared across features
│   ├── config/           # App configuration (themes, env, etc.)
│   ├── constants/        # App-wide constants
│   ├── database/         # Drift database setup
│   ├── errors/           # Error handling and exceptions
│   ├── extensions/       # Dart extensions
│   ├── navigation/       # GoRouter navigation setup
│   ├── network/          # Dio HTTP client setup
│   ├── providers/        # Global Riverpod providers
│   └── utils/            # Utility functions
│
├── features/             # Feature modules
│   ├── auth/            # Authentication feature
│   ├── daily_reports/   # Daily reporting feature
│   ├── canvassing/      # Field canvassing feature
│   ├── materials/       # Materials/products catalog
│   ├── profile/         # User profile management
│   └── home/            # Home dashboard
│
├── shared/              # Shared components
│   ├── widgets/         # Reusable UI widgets
│   ├── models/          # Shared data models
│   └── services/        # Shared services
│
└── main.dart            # App entry point
```

## Feature Structure

Each feature follows Clean Architecture layers:

```
feature/
├── data/                 # Data Layer
│   ├── datasources/      # Remote/Local data sources
│   ├── models/          # Data models (JSON serialization)
│   └── repositories/    # Repository implementations
│
├── domain/              # Domain Layer
│   ├── entities/        # Business entities
│   ├── repositories/    # Repository interfaces
│   └── usecases/        # Business logic use cases
│
└── presentation/        # Presentation Layer
    ├── screens/         # UI screens
    ├── widgets/         # Feature-specific widgets
    └── providers/       # State management (Riverpod)
```

## Key Principles

1. **Dependency Rule**: Dependencies only point inwards (Presentation → Domain → Data)
2. **Feature Independence**: Each feature is self-contained
3. **Offline First**: All features work offline with sync capabilities
4. **Type Safety**: Strong typing throughout the application
5. **Testability**: Each layer is independently testable