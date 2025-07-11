# 🌳 Git Worktree Development Guide for PakeAja Mobile App

## Overview

This guide explains how to use Git worktrees for parallel feature development in the PakeAja Mobile App project. Worktrees allow multiple developers (or AI agents) to work on different features simultaneously without branch switching overhead.

## Why Git Worktrees?

### Benefits
1. **Parallel Development**: Work on multiple features simultaneously
2. **No Context Switching**: Each feature has its own working directory
3. **Faster Builds**: Separate build caches per worktree
4. **Clean History**: Features developed in isolation
5. **AI Agent Friendly**: Multiple agents can work without conflicts

### Use Cases
- Developing authentication while another agent works on daily reports
- Testing one feature while developing another
- Quick hotfixes without disrupting current work
- Comparing implementations side-by-side

## Initial Setup

### 1. Clone the Main Repository

```bash
# Clone the repository
git clone https://github.com/pakeaja/crm-mobile.git pakeaja-crm
cd pakeaja-crm

# This becomes your main worktree
pwd # Should show: /path/to/pakeaja-crm
```

### 2. Create Feature Worktrees

```bash
# Create worktree for authentication feature
git worktree add -b feature/mobile-auth ../mobile-app-auth

# Create worktree for daily reports feature
git worktree add -b feature/mobile-daily-reports ../mobile-app-daily-reports

# Create worktree for canvassing feature
git worktree add -b feature/mobile-canvassing ../mobile-app-canvassing

# Create worktree for sync engine
git worktree add -b feature/mobile-sync ../mobile-app-sync

# Create worktree for materials database
git worktree add -b feature/mobile-materials ../mobile-app-materials

# Create worktree for shared UI components
git worktree add -b feature/mobile-ui-components ../mobile-app-ui-components
```

### 3. Verify Worktree Structure

```bash
# List all worktrees
git worktree list

# Expected output:
# /path/to/pakeaja-crm                    [main]
# /path/to/mobile-app-auth                [feature/mobile-auth]
# /path/to/mobile-app-daily-reports       [feature/mobile-daily-reports]
# /path/to/mobile-app-canvassing          [feature/mobile-canvassing]
# /path/to/mobile-app-sync                [feature/mobile-sync]
# /path/to/mobile-app-materials           [feature/mobile-materials]
# /path/to/mobile-app-ui-components       [feature/mobile-ui-components]
```

## Development Workflow

### 1. Feature Development

Each worktree represents a feature branch:

```bash
# Navigate to auth worktree
cd ../mobile-app-auth

# Verify branch
git branch --show-current  # Should show: feature/mobile-auth

# Start Flutter project (first time only)
flutter create --org com.pakeaja --project-name pakeaja_crm \
  --platforms android,ios --template app .

# Develop the auth feature
# All changes are isolated to this worktree
```

### 2. Shared Code Management

When features need shared code:

```bash
# In feature worktree (e.g., mobile-app-auth)
cd ../mobile-app-auth

# Pull shared code from main
git checkout main -- lib/core
git checkout main -- lib/shared

# Or create a shared components worktree
cd ../mobile-app-ui-components
# Develop shared components here
```

### 3. Keeping Features Updated

```bash
# In feature worktree
cd ../mobile-app-daily-reports

# Fetch latest changes
git fetch origin

# Rebase on main to get latest updates
git rebase origin/main

# Or merge if preferred
git merge origin/main
```

### 4. Feature Integration

```bash
# When feature is ready, push to remote
cd ../mobile-app-auth
git push -u origin feature/mobile-auth

# Create pull request
gh pr create --title "Feature: Mobile Authentication" \
  --body "Implements biometric and password authentication"

# After PR approval, in main worktree
cd ../pakeaja-crm
git checkout main
git pull origin main
git merge --no-ff feature/mobile-auth
git push origin main
```

## Worktree-Specific Configuration

### 1. Environment Variables

Each worktree can have its own `.env` file:

```bash
# mobile-app-auth/.env.local
FEATURE_AUTH_ENABLED=true
FEATURE_DAILY_REPORTS_ENABLED=false
FEATURE_CANVASSING_ENABLED=false

# mobile-app-daily-reports/.env.local
FEATURE_AUTH_ENABLED=true
FEATURE_DAILY_REPORTS_ENABLED=true
FEATURE_CANVASSING_ENABLED=false
```

### 2. Build Configuration

```bash
# Create worktree-specific build script
# mobile-app-auth/scripts/build.sh
#!/bin/bash
flutter build apk \
  --dart-define=FEATURE_SET=auth \
  --dart-define=BUILD_VARIANT=worktree
```

### 3. IDE Configuration

For VS Code, each worktree can have its own workspace:

```json
// mobile-app-auth/.vscode/settings.json
{
  "dart.flutterSdkPath": "/path/to/flutter",
  "files.exclude": {
    "**/mobile-app-daily-reports": true,
    "**/mobile-app-canvassing": true
  },
  "workbench.colorCustomizations": {
    "activityBar.background": "#1976D2"  // Blue for auth
  }
}
```

## Parallel Development Strategies

### 1. Feature Flags

```dart
// lib/core/config/feature_flags.dart
class FeatureFlags {
  static const Map<String, bool> flags = {
    'auth': bool.fromEnvironment('FEATURE_AUTH_ENABLED', defaultValue: false),
    'daily_reports': bool.fromEnvironment('FEATURE_DAILY_REPORTS_ENABLED', defaultValue: false),
    'canvassing': bool.fromEnvironment('FEATURE_CANVASSING_ENABLED', defaultValue: false),
    'sync': bool.fromEnvironment('FEATURE_SYNC_ENABLED', defaultValue: false),
    'materials': bool.fromEnvironment('FEATURE_MATERIALS_ENABLED', defaultValue: false),
  };
  
  static bool isEnabled(String feature) => flags[feature] ?? false;
}
```

### 2. Conditional Imports

```dart
// lib/app.dart
import 'package:flutter/material.dart';
import 'core/config/feature_flags.dart';

// Conditional feature imports
import 'features/home/presentation/screens/home_screen.dart';
import 'features/auth/presentation/screens/login_screen.dart' 
  if (dart.library.js) 'shared/widgets/placeholder_screen.dart';

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: FeatureFlags.isEnabled('auth') 
        ? LoginScreen() 
        : HomeScreen(),
    );
  }
}
```

### 3. Mock Implementations

For features under development:

```dart
// lib/features/daily_reports/data/repositories/mock_daily_reports_repository.dart
class MockDailyReportsRepository implements DailyReportsRepository {
  @override
  Future<List<DailyReport>> getDailyReports() async {
    // Return mock data for testing
    return [
      DailyReport(id: '1', date: DateTime.now(), visitsCount: 5),
    ];
  }
}
```

## CI/CD Integration

### 1. Worktree-Specific Workflows

```yaml
# .github/workflows/worktree-auth.yml
name: Auth Feature CI

on:
  push:
    branches: [feature/mobile-auth]
    paths:
      - 'lib/features/auth/**'
      - 'test/**/auth/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter test test/features/auth
```

### 2. Integration Testing

```yaml
# .github/workflows/integration.yml
name: Feature Integration

on:
  pull_request:
    branches: [main]

jobs:
  integrate:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        feature: [auth, daily_reports, canvassing]
    
    steps:
      - uses: actions/checkout@v3
      - name: Test feature integration
        run: |
          flutter test integration_test/${matrix.feature}_integration_test.dart
```

## Best Practices

### 1. Worktree Naming Convention

```
mobile-app-[feature-name]
```

Examples:
- `mobile-app-auth`
- `mobile-app-daily-reports`
- `mobile-app-canvassing`

### 2. Branch Protection

```bash
# Protect feature branches
git config branch.feature/mobile-auth.protect true
```

### 3. Clean Up Completed Worktrees

```bash
# After feature is merged
git worktree remove ../mobile-app-auth
git branch -d feature/mobile-auth
```

### 4. Shared Dependencies

Create a script to sync dependencies:

```bash
#!/bin/bash
# scripts/sync-dependencies.sh

# List of worktrees
WORKTREES=(
  "../mobile-app-auth"
  "../mobile-app-daily-reports"
  "../mobile-app-canvassing"
)

# Sync pubspec.yaml
for worktree in "${WORKTREES[@]}"; do
  cp pubspec.yaml "$worktree/"
  cd "$worktree"
  flutter pub get
  cd -
done
```

## Troubleshooting

### Common Issues

1. **Worktree already exists**
   ```bash
   # Remove existing worktree
   git worktree remove ../mobile-app-auth
   ```

2. **Branch already exists**
   ```bash
   # Use existing branch
   git worktree add ../mobile-app-auth feature/mobile-auth
   ```

3. **Uncommitted changes blocking worktree**
   ```bash
   # Stash changes
   git stash
   # Create worktree
   git worktree add ...
   # Apply stash if needed
   git stash pop
   ```

4. **Flutter packages out of sync**
   ```bash
   # In each worktree
   flutter clean
   flutter pub get
   ```

## Advanced Techniques

### 1. Worktree Templates

Create a template for new features:

```bash
#!/bin/bash
# scripts/create-feature-worktree.sh

FEATURE_NAME=$1
WORKTREE_PATH="../mobile-app-$FEATURE_NAME"

# Create worktree
git worktree add -b "feature/mobile-$FEATURE_NAME" "$WORKTREE_PATH"

# Copy template files
cp -r templates/feature/* "$WORKTREE_PATH/"

# Initialize Flutter
cd "$WORKTREE_PATH"
flutter create --org com.pakeaja --project-name pakeaja_crm \
  --platforms android,ios --template app .

# Set up feature structure
mkdir -p lib/features/$FEATURE_NAME/{data,domain,presentation}
```

### 2. Cross-Worktree Testing

```bash
#!/bin/bash
# scripts/test-all-worktrees.sh

for worktree in $(git worktree list --porcelain | grep worktree | cut -d' ' -f2); do
  echo "Testing $worktree"
  cd "$worktree"
  flutter test
done
```

### 3. Worktree Status Dashboard

```bash
#!/bin/bash
# scripts/worktree-status.sh

echo "Worktree Status Report"
echo "====================="

git worktree list --porcelain | while read -r line; do
  if [[ $line == worktree* ]]; then
    path=$(echo $line | cut -d' ' -f2)
    cd "$path"
    branch=$(git branch --show-current)
    status=$(git status --porcelain | wc -l)
    echo "📁 $path"
    echo "   Branch: $branch"
    echo "   Changes: $status files"
    echo ""
  fi
done
```

## Conclusion

Git worktrees provide an excellent solution for parallel development of the PakeAja Mobile App. By following this guide, multiple developers or AI agents can work on features simultaneously without conflicts, leading to faster development and cleaner code organization.

Remember:
- Each worktree is independent
- Features can be developed in isolation
- Integration happens through pull requests
- Clean up worktrees after merging
- Use feature flags for gradual rollout

Happy parallel coding! 🚀