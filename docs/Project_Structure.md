# 📁 PakeAja CRM Mobile App - Project Structure

## Overview

This document outlines the project structure for the PakeAja CRM Mobile App, following Flutter best practices with Clean Architecture and feature-based organization optimized for git worktree development.

## Git Worktree Structure

```
pakeaja-crm/                          # Main repository
├── mobile-app/                       # Main mobile branch
├── mobile-app-auth/                  # Feature: Authentication
├── mobile-app-daily-reports/         # Feature: Daily Reports  
├── mobile-app-canvassing/            # Feature: Canvassing
├── mobile-app-sync/                  # Feature: Offline Sync
├── mobile-app-materials/             # Feature: Materials Database
└── mobile-app-ui-components/         # Shared UI Components
```

## Main Project Structure

```
mobile-app/
├── .github/                          # GitHub specific files
│   └── workflows/                    # CI/CD workflows
│       ├── mobile-build.yml
│       ├── mobile-test.yml
│       └── mobile-deploy.yml
├── android/                          # Android-specific files
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── AndroidManifest.xml
│   │   │   │   └── kotlin/
│   │   │   └── debug/
│   │   └── build.gradle
│   └── gradle.properties
├── ios/                              # iOS-specific files (future)
├── lib/                              # Main Flutter source code
│   ├── main.dart                     # Entry point
│   ├── app.dart                      # App widget
│   ├── core/                         # Core functionality
│   │   ├── config/                   # App configuration
│   │   │   ├── app_config.dart
│   │   │   ├── env_config.dart
│   │   │   └── feature_flags.dart
│   │   ├── constants/                # App constants
│   │   │   ├── app_colors.dart
│   │   │   ├── app_strings.dart
│   │   │   ├── app_dimensions.dart
│   │   │   └── api_endpoints.dart
│   │   ├── errors/                   # Error handling
│   │   │   ├── exceptions.dart
│   │   │   ├── failures.dart
│   │   │   └── error_handler.dart
│   │   ├── network/                  # Network layer
│   │   │   ├── api_client.dart
│   │   │   ├── network_info.dart
│   │   │   └── interceptors/
│   │   │       ├── auth_interceptor.dart
│   │   │       └── logging_interceptor.dart
│   │   ├── router/                   # Navigation
│   │   │   ├── app_router.dart
│   │   │   ├── route_guards.dart
│   │   │   └── route_paths.dart
│   │   ├── theme/                    # App theming
│   │   │   ├── app_theme.dart
│   │   │   ├── text_styles.dart
│   │   │   └── widget_themes/
│   │   └── utils/                    # Utilities
│   │       ├── validators.dart
│   │       ├── formatters.dart
│   │       ├── extensions.dart
│   │       └── helpers.dart
│   ├── data/                         # Data layer
│   │   ├── local/                    # Local data sources
│   │   │   ├── database/
│   │   │   │   ├── app_database.dart
│   │   │   │   ├── daos/
│   │   │   │   ├── entities/
│   │   │   │   └── converters/
│   │   │   └── preferences/
│   │   │       └── app_preferences.dart
│   │   ├── remote/                   # Remote data sources
│   │   │   ├── supabase/
│   │   │   │   ├── supabase_client.dart
│   │   │   │   └── supabase_service.dart
│   │   │   └── apis/
│   │   │       ├── auth_api.dart
│   │   │       ├── reports_api.dart
│   │   │       └── sync_api.dart
│   │   ├── repositories/             # Repository implementations
│   │   │   ├── auth_repository_impl.dart
│   │   │   ├── daily_reports_repository_impl.dart
│   │   │   ├── canvassing_repository_impl.dart
│   │   │   └── materials_repository_impl.dart
│   │   └── models/                   # Data models
│   │       ├── user_model.dart
│   │       ├── daily_report_model.dart
│   │       ├── canvassing_model.dart
│   │       └── material_model.dart
│   ├── domain/                       # Domain layer
│   │   ├── entities/                 # Business entities
│   │   │   ├── user.dart
│   │   │   ├── daily_report.dart
│   │   │   ├── canvassing_report.dart
│   │   │   └── material.dart
│   │   ├── repositories/             # Repository interfaces
│   │   │   ├── auth_repository.dart
│   │   │   ├── daily_reports_repository.dart
│   │   │   ├── canvassing_repository.dart
│   │   │   └── materials_repository.dart
│   │   ├── services/                 # Domain services
│   │   │   ├── sync_service.dart
│   │   │   ├── location_service.dart
│   │   │   └── notification_service.dart
│   │   └── use_cases/                # Business logic
│   │       ├── auth/
│   │       │   ├── sign_in_use_case.dart
│   │       │   ├── sign_out_use_case.dart
│   │       │   └── get_current_user_use_case.dart
│   │       ├── daily_reports/
│   │       │   ├── submit_daily_report_use_case.dart
│   │       │   ├── get_daily_reports_use_case.dart
│   │       │   └── save_draft_report_use_case.dart
│   │       └── canvassing/
│   │           ├── create_canvassing_report_use_case.dart
│   │           └── upload_canvassing_photos_use_case.dart
│   ├── features/                     # Feature modules
│   │   ├── auth/                     # Authentication feature
│   │   │   ├── presentation/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── login_screen.dart
│   │   │   │   │   ├── splash_screen.dart
│   │   │   │   │   └── biometric_setup_screen.dart
│   │   │   │   ├── widgets/
│   │   │   │   │   ├── login_form.dart
│   │   │   │   │   └── biometric_button.dart
│   │   │   │   └── providers/
│   │   │   │       └── auth_provider.dart
│   │   │   └── README.md
│   │   ├── daily_reports/            # Daily Reports feature
│   │   │   ├── presentation/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── daily_report_screen.dart
│   │   │   │   │   ├── report_history_screen.dart
│   │   │   │   │   └── report_detail_screen.dart
│   │   │   │   ├── widgets/
│   │   │   │   │   ├── activity_input_card.dart
│   │   │   │   │   ├── summary_section.dart
│   │   │   │   │   └── planning_section.dart
│   │   │   │   └── providers/
│   │   │   │       ├── daily_report_provider.dart
│   │   │   │       └── report_history_provider.dart
│   │   │   └── README.md
│   │   ├── canvassing/               # Canvassing feature
│   │   │   ├── presentation/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── canvassing_form_screen.dart
│   │   │   │   │   ├── canvassing_list_screen.dart
│   │   │   │   │   └── canvassing_detail_screen.dart
│   │   │   │   ├── widgets/
│   │   │   │   │   ├── company_info_form.dart
│   │   │   │   │   ├── visit_outcome_selector.dart
│   │   │   │   │   ├── photo_capture_widget.dart
│   │   │   │   │   └── location_capture_widget.dart
│   │   │   │   └── providers/
│   │   │   │       └── canvassing_provider.dart
│   │   │   └── README.md
│   │   ├── home/                     # Home/Dashboard
│   │   │   ├── presentation/
│   │   │   │   ├── screens/
│   │   │   │   │   └── home_screen.dart
│   │   │   │   ├── widgets/
│   │   │   │   │   ├── quick_actions_card.dart
│   │   │   │   │   ├── sync_status_widget.dart
│   │   │   │   │   └── stats_overview_card.dart
│   │   │   │   └── providers/
│   │   │   │       └── home_provider.dart
│   │   │   └── README.md
│   │   ├── materials/                # Materials Database
│   │   │   ├── presentation/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── materials_list_screen.dart
│   │   │   │   │   └── material_detail_screen.dart
│   │   │   │   ├── widgets/
│   │   │   │   │   ├── material_search_bar.dart
│   │   │   │   │   └── material_card.dart
│   │   │   │   └── providers/
│   │   │   │       └── materials_provider.dart
│   │   │   └── README.md
│   │   └── sync/                     # Sync Management
│   │       ├── presentation/
│   │       │   ├── screens/
│   │       │   │   └── sync_status_screen.dart
│   │       │   ├── widgets/
│   │       │   │   ├── sync_queue_list.dart
│   │       │   │   └── sync_progress_indicator.dart
│   │       │   └── providers/
│   │       │       └── sync_provider.dart
│   │       └── README.md
│   └── shared/                       # Shared components
│       ├── widgets/                  # Reusable widgets
│       │   ├── buttons/
│       │   │   ├── primary_button.dart
│       │   │   └── icon_button_custom.dart
│       │   ├── inputs/
│       │   │   ├── text_field_custom.dart
│       │   │   └── dropdown_custom.dart
│       │   ├── cards/
│       │   │   └── info_card.dart
│       │   ├── dialogs/
│       │   │   ├── confirmation_dialog.dart
│       │   │   └── loading_dialog.dart
│       │   └── indicators/
│       │       ├── loading_indicator.dart
│       │       └── empty_state_widget.dart
│       ├── providers/               # Global providers
│       │   ├── app_state_provider.dart
│       │   └── connectivity_provider.dart
│       └── services/                # Shared services
│           ├── analytics_service.dart
│           ├── logger_service.dart
│           └── permission_service.dart
├── test/                            # Test files
│   ├── unit/
│   │   ├── use_cases/
│   │   ├── repositories/
│   │   └── services/
│   ├── widget/
│   │   ├── features/
│   │   └── shared/
│   ├── integration/
│   │   ├── auth_flow_test.dart
│   │   ├── daily_report_flow_test.dart
│   │   └── sync_flow_test.dart
│   └── fixtures/                    # Test data
│       ├── daily_reports.json
│       └── canvassing_data.json
├── assets/                          # App assets
│   ├── images/
│   │   ├── logo.png
│   │   └── illustrations/
│   ├── icons/
│   └── fonts/
├── docs/                            # Documentation
│   ├── PRD.md
│   ├── Implementation.md
│   ├── Project_Structure.md
│   ├── UI_UX.md
│   ├── API_Documentation.md
│   └── worktree-guide.md
├── scripts/                         # Build & deployment scripts
│   ├── build_android.sh
│   ├── setup_worktrees.sh
│   └── sync_features.sh
├── .env.example                     # Environment variables template
├── .gitignore
├── analysis_options.yaml            # Dart linter rules
├── pubspec.yaml                     # Project dependencies
├── pubspec.lock
└── README.md                        # Project readme
```

## Feature Module Structure

Each feature module follows this consistent structure:

```
feature_name/
├── data/                            # Feature-specific data layer
│   ├── models/
│   ├── repositories/
│   └── sources/
├── domain/                          # Feature-specific domain layer
│   ├── entities/
│   ├── repositories/
│   └── use_cases/
├── presentation/                    # Feature-specific presentation
│   ├── screens/
│   ├── widgets/
│   └── providers/
└── README.md                        # Feature documentation
```

## Worktree Development Guidelines

### Feature Isolation

Each worktree contains only the relevant feature code:

```
mobile-app-auth/
└── lib/
    └── features/
        └── auth/                    # Only auth feature code
```

### Shared Code Management

Shared code remains in the main branch and is accessed via git:

```bash
# In feature worktree
git checkout main -- lib/core
git checkout main -- lib/shared
```

### Feature Flags

```dart
// lib/core/config/feature_flags.dart
class FeatureFlags {
  static const bool authEnabled = true;
  static const bool dailyReportsEnabled = true;
  static const bool canvassingEnabled = true;
  static const bool materialsEnabled = false; // In development
  static const bool syncEnabled = true;
}
```

## Build Variants

### Development
```
lib/
└── main_development.dart
```

### Staging
```
lib/
└── main_staging.dart
```

### Production
```
lib/
└── main_production.dart
```

## Asset Organization

```
assets/
├── images/
│   ├── 1.0x/                        # Default resolution
│   ├── 2.0x/                        # 2x resolution
│   └── 3.0x/                        # 3x resolution
├── icons/
│   ├── app_icon.png
│   └── feature_icons/
└── animations/
    └── lottie/
```

## Configuration Files

### pubspec.yaml Structure
```yaml
name: pakeaja_crm
description: PakeAja CRM Mobile Application

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  # Core
  flutter:
    sdk: flutter
  
  # State Management
  flutter_riverpod: ^2.4.9
  
  # Add other dependencies...

dev_dependencies:
  # Testing
  flutter_test:
    sdk: flutter
  
  # Code Generation
  build_runner: ^2.4.7
  
  # Add other dev dependencies...

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/icons/
  
  fonts:
    - family: Inter
      fonts:
        - asset: assets/fonts/Inter-Regular.ttf
        - asset: assets/fonts/Inter-Bold.ttf
          weight: 700
```

### Analysis Options
```yaml
# analysis_options.yaml
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    - always_declare_return_types
    - avoid_print
    - prefer_single_quotes
    - require_trailing_commas
    - sort_constructors_first

analyzer:
  exclude:
    - "**/*.g.dart"
    - "**/*.freezed.dart"
```

## Import Organization

Standard import order:
```dart
// Dart imports
import 'dart:async';
import 'dart:convert';

// Flutter imports
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// Package imports (alphabetical)
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Project imports (by layer)
import '../../core/config/app_config.dart';
import '../../domain/entities/user.dart';
import '../../data/models/user_model.dart';

// Relative imports
import '../widgets/custom_button.dart';
import 'login_form.dart';
```

## Naming Conventions

### Files
- **snake_case** for all Dart files
- **PascalCase** for class names
- **camelCase** for variables and functions

### Folders
- **snake_case** for all folders
- Feature names should be singular (e.g., `auth` not `authentication`)

### Classes
```dart
// Models
class UserModel {}

// Entities
class User {}

// Screens
class LoginScreen {}

// Widgets
class CustomButton {}

// Providers
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>();

// Use Cases
class SignInUseCase {}
```

## Testing Structure

### Unit Tests
```
test/unit/features/auth/domain/use_cases/sign_in_use_case_test.dart
```

### Widget Tests
```
test/widget/features/auth/presentation/widgets/login_form_test.dart
```

### Integration Tests
```
integration_test/auth_flow_test.dart
```

## Documentation Standards

Each feature should have a README.md:

```markdown
# Feature: Authentication

## Overview
Handles user authentication including login, biometric auth, and session management.

## Dependencies
- Supabase Auth
- Flutter Secure Storage
- Local Authentication

## State Management
Uses Riverpod for state management with the following providers:
- `authProvider`: Main authentication state
- `currentUserProvider`: Current user data

## Key Components
- `LoginScreen`: Main login interface
- `BiometricSetupScreen`: Biometric authentication setup
- `AuthRepository`: Handles auth operations

## Testing
- Unit tests: 95% coverage
- Integration tests: Complete auth flow
```

## Build & Release

### Android
```
android/
├── app/
│   ├── build.gradle
│   └── src/
│       ├── main/
│       │   └── AndroidManifest.xml
│       └── release/
│           └── key.properties
```

### Environment Configuration
```
.env.development
.env.staging
.env.production
```

## Continuous Integration

Each worktree has its own CI workflow:

```yaml
# .github/workflows/feature-auth.yml
name: Auth Feature CI

on:
  push:
    branches: [feature/mobile-auth]
    paths:
      - 'lib/features/auth/**'
      - 'test/**/auth/**'
```

This structure ensures clean separation of concerns, enables parallel development through git worktrees, and maintains consistency across the entire mobile application.