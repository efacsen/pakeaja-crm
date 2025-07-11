#!/bin/bash

# Script to synchronize Flutter initialization across all worktrees

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔄 Synchronizing Flutter initialization across all worktrees..."
echo "=================================================="

# Get current branch for reference
CURRENT_BRANCH=$(cd "$PROJECT_ROOT" && git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# List of worktrees to update
WORKTREES=(
  "mobile-app-daily-reports"
  "mobile-app-canvassing"
  "mobile-app-materials"
  "mobile-app-sync"
  "mobile-app-auth"
  "mobile-app-ui-components"
)

# Create necessary directories in main worktree first
echo -e "\n📁 Creating necessary directories in main worktree..."
mkdir -p "$PROJECT_ROOT/lib"
mkdir -p "$PROJECT_ROOT/test"
mkdir -p "$PROJECT_ROOT/assets/images"
mkdir -p "$PROJECT_ROOT/assets/icons"
mkdir -p "$PROJECT_ROOT/assets/fonts"

# Files to sync
echo -e "\n📋 Files to synchronize:"
echo "  - pubspec.yaml (Flutter configuration)"
echo "  - lib/main.dart (Main application file)"
echo "  - test/widget_test.dart (Basic widget test)"
echo "  - .gitignore (Updated for Flutter)"

# Update .gitignore for Flutter if needed
if ! grep -q "# Flutter/Dart/Pub related" "$PROJECT_ROOT/.gitignore" 2>/dev/null; then
  echo -e "\n📝 Updating .gitignore for Flutter..."
  cat >> "$PROJECT_ROOT/.gitignore" << 'EOF'

# Flutter/Dart/Pub related
**/doc/api/
**/ios/Flutter/.last_build_id
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
.packages
.pub-cache/
.pub/
/build/

# Android related
**/android/**/gradle-wrapper.jar
**/android/.gradle
**/android/captures/
**/android/gradlew
**/android/gradlew.bat
**/android/local.properties
**/android/**/GeneratedPluginRegistrant.java

# iOS/XCode related
**/ios/**/*.mode1v3
**/ios/**/*.mode2v3
**/ios/**/*.moved-aside
**/ios/**/*.pbxuser
**/ios/**/*.perspectivev3
**/ios/**/*sync/
**/ios/**/.sconsign.dblite
**/ios/**/.tags*
**/ios/**/.vagrant/
**/ios/**/DerivedData/
**/ios/**/Icon?
**/ios/**/Pods/
**/ios/**/.symlinks/
**/ios/**/profile
**/ios/**/xcuserdata
**/ios/.generated/
**/ios/Flutter/App.framework
**/ios/Flutter/Flutter.framework
**/ios/Flutter/Flutter.podspec
**/ios/Flutter/Generated.xcconfig
**/ios/Flutter/app.flx
**/ios/Flutter/app.zip
**/ios/Flutter/flutter_assets/
**/ios/Flutter/flutter_export_environment.sh
**/ios/ServiceDefinitions.json
**/ios/Runner/GeneratedPluginRegistrant.*

# Web related
lib/generated_plugin_registrant.dart

# Symbolication related
app.*.symbols

# Obfuscation related
app.*.map.json

# Test related
coverage/

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

# Flutter environment
.env
EOF
fi

# Sync to each worktree
for worktree in "${WORKTREES[@]}"; do
  WORKTREE_PATH="$PROJECT_ROOT/../$worktree"
  
  if [ -d "$WORKTREE_PATH" ]; then
    echo -e "\n🔄 Updating worktree: $worktree"
    echo "   Path: $WORKTREE_PATH"
    
    # Create necessary directories
    mkdir -p "$WORKTREE_PATH/lib"
    mkdir -p "$WORKTREE_PATH/test"
    mkdir -p "$WORKTREE_PATH/assets/images"
    mkdir -p "$WORKTREE_PATH/assets/icons"
    mkdir -p "$WORKTREE_PATH/assets/fonts"
    
    # Copy Flutter files
    echo "   📄 Copying pubspec.yaml..."
    cp "$PROJECT_ROOT/pubspec.yaml" "$WORKTREE_PATH/pubspec.yaml"
    
    echo "   📄 Copying lib/main.dart..."
    cp "$PROJECT_ROOT/lib/main.dart" "$WORKTREE_PATH/lib/main.dart"
    
    echo "   📄 Copying test/widget_test.dart..."
    cp "$PROJECT_ROOT/test/widget_test.dart" "$WORKTREE_PATH/test/widget_test.dart"
    
    echo "   📄 Copying .gitignore..."
    cp "$PROJECT_ROOT/.gitignore" "$WORKTREE_PATH/.gitignore"
    
    # Stage the changes
    echo "   📦 Staging changes..."
    cd "$WORKTREE_PATH"
    git add pubspec.yaml lib/main.dart test/widget_test.dart .gitignore
    
    # Check if there are changes to commit
    if ! git diff --cached --quiet; then
      echo "   💾 Committing Flutter initialization..."
      git commit -m "feat: Initialize Flutter project structure

- Add pubspec.yaml with all dependencies
- Create main.dart with Riverpod setup
- Add basic widget test
- Update .gitignore for Flutter

This brings the worktree in sync with the main mobile-app branch."
      echo "   ✅ Worktree updated successfully!"
    else
      echo "   ℹ️  No changes to commit (already up to date)"
    fi
  else
    echo -e "\n⚠️  Worktree not found: $worktree"
    echo "   Expected path: $WORKTREE_PATH"
  fi
done

echo -e "\n✅ Flutter initialization sync complete!"
echo -e "\n📋 Next steps for each worktree:"
echo "1. Navigate to the worktree directory"
echo "2. Run: flutter pub get"
echo "3. Run: flutter run"
echo -e "\n💡 Note: Make sure Flutter SDK is installed and in your PATH"