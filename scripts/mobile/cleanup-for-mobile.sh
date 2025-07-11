#!/bin/bash

# PakeAja CRM - Repository Cleanup Script for Mobile App Development
# This script removes web-specific files and prepares the repository for Flutter mobile development

echo "🧹 PakeAja CRM - Cleaning repository for mobile app development..."
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This doesn't appear to be the PakeAja CRM repository root."
    echo "Please run this script from the repository root directory."
    exit 1
fi

# Create backup branch
echo "📋 Creating backup branch..."
git checkout -b backup/pre-mobile-cleanup-$(date +%Y%m%d-%H%M%S)
git checkout -

# Function to remove directories
remove_dir() {
    if [ -d "$1" ]; then
        echo "  Removing $1..."
        rm -rf "$1"
    fi
}

# Function to remove files
remove_file() {
    if [ -f "$1" ]; then
        echo "  Removing $1..."
        rm -f "$1"
    fi
}

echo ""
echo "🗑️  Removing web-specific directories..."
# Remove Next.js/React specific directories
remove_dir "src"
remove_dir "public"
remove_dir "styles"
remove_dir ".next"
remove_dir "node_modules"
remove_dir "tests"
remove_dir "gitbook"
remove_dir "ui_iterations"

echo ""
echo "🗑️  Removing web-specific files..."
# Remove web framework files
remove_file "package.json"
remove_file "package-lock.json"
remove_file "next.config.ts"
remove_file "tsconfig.json"
remove_file "postcss.config.mjs"
remove_file "tailwind.config.ts"
remove_file "jest.config.js"
remove_file "jest.setup.js"
remove_file "playwright.config.ts"
remove_file "lighthouse.config.js"
remove_file "eslint.config.mjs"
remove_file "components.json"
remove_file "vercel.json"

echo ""
echo "🗑️  Removing database migration files (keeping structure reference)..."
# Keep only essential SQL files for reference
mkdir -p database/reference
if [ -d "database/migrations" ]; then
    cp database/migrations/20240107_complete_schema.sql database/reference/ 2>/dev/null || true
    remove_dir "database/migrations"
fi
remove_dir "database/scripts"

echo ""
echo "🗑️  Removing RBAC migration artifacts..."
remove_dir "RBAC Migration"

echo ""
echo "🗑️  Cleaning up scripts directory..."
# Keep only mobile-relevant scripts
if [ -d "scripts" ]; then
    mkdir -p scripts/mobile
    mv scripts/setup-worktrees.sh scripts/mobile/ 2>/dev/null || true
    mv scripts/cleanup-for-mobile.sh scripts/mobile/ 2>/dev/null || true
    # Remove all other scripts
    find scripts -type f -name "*.js" -delete
    find scripts -type f -name "*.ts" -delete
    find scripts -type f -name "*.sh" ! -path "scripts/mobile/*" -delete
    remove_dir "scripts/development"
    remove_dir "scripts/git-assistant"
fi

echo ""
echo "🗑️  Cleaning up Supabase directory..."
# Keep only essential Supabase files
if [ -d "supabase" ]; then
    mkdir -p supabase/reference
    mv supabase/*.sql supabase/reference/ 2>/dev/null || true
    remove_file "supabase/config.toml"
fi

echo ""
echo "📁 Creating Flutter mobile app structure..."
# Create Flutter project structure
mkdir -p lib/{core,data,domain,features,shared}
mkdir -p lib/core/{config,constants,errors,network,router,theme,utils}
mkdir -p lib/data/{local,remote,repositories,models}
mkdir -p lib/domain/{entities,repositories,services,use_cases}
mkdir -p lib/features/{auth,daily_reports,canvassing,home,materials,sync}
mkdir -p lib/shared/{widgets,providers,services}
mkdir -p assets/{images,icons,fonts}
mkdir -p test/{unit,widget,integration}
mkdir -p integration_test

echo ""
echo "📝 Creating Flutter configuration files..."

# Create pubspec.yaml
cat > pubspec.yaml << 'EOF'
name: pakeaja_crm
description: PakeAja CRM Mobile Application for Field Sales
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  
  # Core dependencies
  cupertino_icons: ^1.0.6
  
  # TODO: Add dependencies as per Implementation.md

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  
  # TODO: Add dev dependencies as per Implementation.md

flutter:
  uses-material-design: true
  
  assets:
    - assets/images/
    - assets/icons/
  
  # fonts:
  #   - family: Inter
  #     fonts:
  #       - asset: assets/fonts/Inter-Regular.ttf
  #       - asset: assets/fonts/Inter-Bold.ttf
  #         weight: 700
EOF

# Create analysis_options.yaml
cat > analysis_options.yaml << 'EOF'
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    prefer_single_quotes: true
    always_declare_return_types: true
    avoid_print: true
    prefer_const_constructors: true
    require_trailing_commas: true
    sort_constructors_first: true

analyzer:
  exclude:
    - "**/*.g.dart"
    - "**/*.freezed.dart"
EOF

# Create .gitignore for Flutter
cat > .gitignore << 'EOF'
# Miscellaneous
*.class
*.log
*.pyc
*.swp
.DS_Store
.atom/
.buildlog/
.history
.svn/
migrate_working_dir/

# IntelliJ related
*.iml
*.ipr
*.iws
.idea/

# VS Code related
.vscode/

# Flutter/Dart/Pub related
**/doc/api/
**/ios/Flutter/.last_build_id
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.pub-cache/
.pub/
/build/

# Symbolication related
app.*.symbols

# Obfuscation related
app.*.map.json

# Android Studio will place build artifacts here
/android/app/debug
/android/app/profile
/android/app/release

# Environment files
.env
.env.*

# Coverage
coverage/

# Exceptions to above rules.
!/packages/flutter_tools/test/data/dart_dependencies_test/**/.packages
EOF

# Create README for mobile
cat > README.md << 'EOF'
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
EOF

# Create main.dart placeholder
mkdir -p lib
cat > lib/main.dart << 'EOF'
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PakeAja CRM',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1976D2)),
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(
          child: Text(
            'PakeAja CRM Mobile App\nReady for Development',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}
EOF

echo ""
echo "🧹 Cleaning up old documentation..."
# Keep only mobile-relevant docs
if [ -d "docs/mobile" ]; then
    # Move mobile docs to root docs folder
    cp -r docs/mobile/* docs/ 2>/dev/null || true
fi
remove_dir "docs/development"
remove_dir "docs/testing"
remove_dir "docs/troubleshooting"
remove_dir "docs/mobile"

# Clean up root files
remove_file "FUNCTION_CLEANUP_STEPS.md"
remove_file "SETUP_COMPANY_FUNCTIONS.md"

echo ""
echo "✅ Repository cleanup completed!"
echo ""
echo "📋 Summary of changes:"
echo "  - Removed all web-specific files and directories"
echo "  - Created Flutter project structure"
echo "  - Added Flutter configuration files"
echo "  - Preserved mobile-relevant documentation"
echo "  - Created placeholder main.dart"
echo ""
echo "🚀 Next steps:"
echo "  1. Run 'flutter create .' to initialize Flutter project"
echo "  2. Set up git worktrees using scripts/setup-worktrees.sh"
echo "  3. Start developing features in parallel"
echo ""
echo "📝 Note: A backup branch was created before cleanup"