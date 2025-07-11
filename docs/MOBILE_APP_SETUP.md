# 📱 PakeAja CRM Mobile App - Setup Guide

## Overview

This guide explains how to transform the existing PakeAja CRM webapp repository into a Flutter mobile app development environment using git worktrees for parallel feature development.

## Repository Transformation Process

### Step 1: Backup Current State

Before making any changes, ensure you have a backup:

```bash
# Create a backup branch
git checkout -b backup/webapp-state
git add .
git commit -m "backup: Save webapp state before mobile transformation"
git checkout main
```

### Step 2: Run Cleanup Script

The cleanup script removes all web-specific files and prepares the repository for Flutter development:

```bash
# Make script executable (if not already)
chmod +x scripts/cleanup-for-mobile.sh

# Run the cleanup script
./scripts/cleanup-for-mobile.sh
```

This script will:
- ✅ Create a backup branch automatically
- ✅ Remove all Next.js/React files and directories
- ✅ Remove web-specific configuration files
- ✅ Clean up database migrations (keeping schema reference)
- ✅ Create Flutter project structure
- ✅ Generate Flutter configuration files
- ✅ Set up mobile-specific documentation

### Step 3: Initialize Flutter Project

After cleanup, initialize the Flutter project:

```bash
# Ensure Flutter is installed
flutter --version

# Initialize Flutter project
flutter create --org com.pakeaja --project-name pakeaja_crm \
  --platforms android,ios --template app .

# Get dependencies
flutter pub get
```

### Step 4: Set Up Git Worktrees

Use the worktree setup script to create parallel development environments:

```bash
# Make script executable
chmod +x scripts/setup-worktrees.sh

# Run the setup script
./scripts/setup-worktrees.sh
```

This will create the following worktrees:
- `mobile-app-auth` - Authentication feature
- `mobile-app-daily-reports` - Daily reports feature
- `mobile-app-canvassing` - Canvassing feature
- `mobile-app-sync` - Offline sync engine
- `mobile-app-materials` - Materials database
- `mobile-app-ui-components` - Shared UI components

### Step 5: Verify Setup

```bash
# List all worktrees
git worktree list

# Check Flutter setup
flutter doctor

# Run the placeholder app
flutter run
```

## Directory Structure After Setup

```
pakeaja-crm/                    # Main mobile app
├── lib/                        # Flutter source code
│   ├── core/                   # Core functionality
│   ├── data/                   # Data layer
│   ├── domain/                 # Domain layer
│   ├── features/               # Feature modules
│   └── shared/                 # Shared components
├── assets/                     # App assets
├── test/                       # Test files
├── docs/                       # Documentation
│   ├── PRD.md                 # Product Requirements
│   ├── Implementation.md      # Technical Implementation
│   ├── Project_Structure.md   # Project Organization
│   ├── UI_UX.md              # Design Guidelines
│   └── worktree-guide.md     # Worktree Development
└── scripts/                    # Build scripts

# Parallel worktrees (separate directories)
mobile-app-auth/
mobile-app-daily-reports/
mobile-app-canvassing/
mobile-app-sync/
mobile-app-materials/
mobile-app-ui-components/
```

## Development Workflow

### 1. Choose a Feature Worktree

```bash
# Navigate to feature worktree
cd ../mobile-app-daily-reports
```

### 2. Develop the Feature

Each worktree is independent:
- Implement feature in `lib/features/[feature-name]/`
- Add tests in `test/features/[feature-name]/`
- Update documentation as needed

### 3. Share Code Between Features

```bash
# Get shared code from main
git checkout main -- lib/core
git checkout main -- lib/shared
```

### 4. Integrate Features

```bash
# Push feature branch
git push -u origin feature/mobile-daily-reports

# Create pull request
gh pr create --title "Feature: Daily Reports" \
  --body "Implements daily activity reporting"

# Merge in main worktree
cd ../pakeaja-crm
git checkout main
git pull
git merge --no-ff feature/mobile-daily-reports
```

## Environment Configuration

### 1. Create Environment Files

```bash
# .env.development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
API_BASE_URL=https://api-dev.pakeaja.com

# .env.production
SUPABASE_URL=https://your-prod.supabase.co
SUPABASE_ANON_KEY=your-prod-key
API_BASE_URL=https://api.pakeaja.com
```

### 2. Configure Feature Flags

```dart
// lib/core/config/feature_flags.dart
class FeatureFlags {
  static const bool authEnabled = true;
  static const bool dailyReportsEnabled = true;
  static const bool canvassingEnabled = false; // Still in development
}
```

## Quick Commands

### Build for Android

```bash
# Debug build
flutter build apk --debug

# Release build
flutter build apk --release \
  --dart-define=SUPABASE_URL=$SUPABASE_URL \
  --dart-define=SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
```

### Run Tests

```bash
# All tests
flutter test

# Specific feature tests
flutter test test/features/daily_reports

# With coverage
flutter test --coverage
```

### Clean Build

```bash
flutter clean
flutter pub get
flutter run
```

## Troubleshooting

### Issue: Worktree already exists

```bash
git worktree remove ../mobile-app-auth
git worktree add -b feature/mobile-auth ../mobile-app-auth
```

### Issue: Flutter not recognized

```bash
# Add Flutter to PATH
export PATH="$PATH:/path/to/flutter/bin"

# Verify installation
flutter doctor
```

### Issue: Build fails

```bash
# Clean everything
flutter clean
rm -rf .dart_tool/
rm -rf build/
flutter pub get
```

## Next Steps

1. **Review Documentation**
   - Read [PRD.md](PRD.md) for product requirements
   - Study [Implementation.md](Implementation.md) for technical details
   - Follow [UI_UX.md](UI_UX.md) for design guidelines

2. **Set Up Development Environment**
   - Install Android Studio / Xcode
   - Configure emulators/simulators
   - Set up VS Code with Flutter extensions

3. **Start Development**
   - Pick a feature from the PRD
   - Create/switch to appropriate worktree
   - Implement following clean architecture
   - Write tests alongside code
   - Create PR when ready

## Support

For questions or issues:
- Check documentation in `docs/` folder
- Review existing code examples
- Follow Flutter best practices
- Use git worktrees for parallel development

---

**Ready to build an amazing mobile app! 🚀**