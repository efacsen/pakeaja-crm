# PakeAja CRM Mobile App

Flutter-based mobile application for PakeAja CRM field sales operations.

## Overview

This mobile app enables field sales teams to:
- Submit daily activity reports
- Conduct canvassing activities
- Access customer and materials database offline
- Sync data automatically when online

## Documentation

- [Product Requirements Document](docs/PRD.md)
- [Implementation Guide](docs/Implementation.md)
- [Project Structure](docs/Project_Structure.md)
- [UI/UX Guidelines](docs/UI_UX.md)
- [Git Worktree Guide](docs/worktree-guide.md)

## Getting Started

### Prerequisites

- Flutter SDK 3.16+
- Android Studio / VS Code
- Git

### Setup

1. Clone the repository
2. Run `flutter pub get`
3. Set up environment variables
4. Run `flutter run`

## Development

This project uses Git worktrees for parallel feature development. See [worktree-guide.md](docs/worktree-guide.md) for details.

## Architecture

The app follows Clean Architecture with:
- Presentation Layer (UI/Widgets)
- Domain Layer (Business Logic)
- Data Layer (Repositories/APIs)

## Features

- **Authentication**: Biometric and password login
- **Daily Reports**: Activity tracking and submission
- **Canvassing**: Field data collection with offline support
- **Materials Database**: Offline product catalog
- **Sync Engine**: Automatic data synchronization

## License

Proprietary - PakeAja CRM
