#!/bin/bash

# Script to sync bug tracking implementation to all worktrees

echo "🐛 Syncing Bug Tracking Implementation to All Worktrees"
echo "=================================================="

# Get the current directory (mobile-app)
MAIN_WORKTREE=$(pwd)

# List of worktrees to sync to
WORKTREES=(
  "mobile-app-auth"
  "mobile-app-daily-reports"
  "mobile-app-canvassing"
  "mobile-app-materials"
  "mobile-app-sync"
  "mobile-app-ui-components"
)

# Files to sync
BUG_TRACKING_FILES=(
  "lib/core/utils/bug_tracker.dart"
  "lib/core/utils/error_handler.dart"
  "lib/core/widgets/bug_report_dialog.dart"
  "lib/core/widgets/debug_menu.dart"
)

# Count successful syncs
SUCCESS_COUNT=0
TOTAL_COUNT=${#WORKTREES[@]}

for worktree in "${WORKTREES[@]}"; do
  echo ""
  echo "📁 Syncing to $worktree..."
  
  WORKTREE_PATH="../$worktree"
  
  if [ -d "$WORKTREE_PATH" ]; then
    # Create directories if they don't exist
    mkdir -p "$WORKTREE_PATH/lib/core/utils"
    mkdir -p "$WORKTREE_PATH/lib/core/widgets"
    
    # Copy bug tracking files
    for file in "${BUG_TRACKING_FILES[@]}"; do
      if [ -f "$file" ]; then
        cp "$file" "$WORKTREE_PATH/$file"
        echo "  ✓ Copied $file"
      else
        echo "  ⚠️  Source file not found: $file"
      fi
    done
    
    # Update main.dart to include error handling
    if [ -f "$WORKTREE_PATH/lib/main.dart" ]; then
      # Check if error handling is already added
      if ! grep -q "import 'core/utils/error_handler.dart';" "$WORKTREE_PATH/lib/main.dart"; then
        echo "  📝 Updating main.dart with error handling..."
        
        # Create a backup
        cp "$WORKTREE_PATH/lib/main.dart" "$WORKTREE_PATH/lib/main.dart.backup"
        
        # Add import at the top after other imports
        sed -i '' "/import 'core\/providers\/shared_preferences_provider.dart';/a\\
import 'core/utils/error_handler.dart';" "$WORKTREE_PATH/lib/main.dart"
        
        # Add error handling setup (this is more complex, so we'll just note it)
        echo "  ⚠️  Note: Please manually add error handling setup to main.dart"
        echo "     See mobile-app/lib/main.dart for reference"
      else
        echo "  ✓ Error handling already imported in main.dart"
      fi
    fi
    
    # Update profile_screen.dart to include debug menu
    PROFILE_SCREEN="$WORKTREE_PATH/lib/features/profile/presentation/screens/profile_screen.dart"
    if [ -f "$PROFILE_SCREEN" ]; then
      if ! grep -q "import '../../../../core/widgets/debug_menu.dart';" "$PROFILE_SCREEN"; then
        echo "  📝 Updating profile_screen.dart with debug menu..."
        cp "$PROFILE_SCREEN" "$PROFILE_SCREEN.backup"
        
        # Copy our updated profile screen
        cp "lib/features/profile/presentation/screens/profile_screen.dart" "$PROFILE_SCREEN"
        echo "  ✓ Updated profile_screen.dart"
      else
        echo "  ✓ Debug menu already added to profile_screen.dart"
      fi
    fi
    
    # Check if share_plus is in pubspec.yaml
    if ! grep -q "share_plus:" "$WORKTREE_PATH/pubspec.yaml"; then
      echo "  📝 Adding share_plus to pubspec.yaml..."
      sed -i '' '/uuid: \^4.3.1/a\
  share_plus: ^11.0.0' "$WORKTREE_PATH/pubspec.yaml"
      echo "  ✓ Added share_plus dependency"
      
      # Run pub get
      echo "  📦 Running flutter pub get..."
      cd "$WORKTREE_PATH"
      flutter pub get > /dev/null 2>&1
      cd "$MAIN_WORKTREE"
      echo "  ✓ Dependencies updated"
    fi
    
    echo "✅ Successfully synced bug tracking to $worktree"
    ((SUCCESS_COUNT++))
  else
    echo "❌ Worktree not found: $worktree"
  fi
done

echo ""
echo "=================================================="
echo "🎉 Bug Tracking Sync Complete!"
echo "   Synced to $SUCCESS_COUNT out of $TOTAL_COUNT worktrees"
echo ""
echo "📋 Next Steps:"
echo "1. Review the manual updates needed for main.dart error handling"
echo "2. Test bug reporting in each worktree"
echo "3. Proceed with feature development"