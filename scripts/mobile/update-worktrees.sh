#!/bin/bash

# Script to update all worktrees with the latest mobile-app changes

echo "🔄 Updating all worktrees with Flutter mobile app structure..."
echo "=================================================="

# Get the current directory
MOBILE_APP_DIR="$PWD"
PARENT_DIR=$(dirname "$PWD")

# List of feature worktrees
WORKTREES=(
    "mobile-app-auth"
    "mobile-app-daily-reports"
    "mobile-app-canvassing"
    "mobile-app-sync"
    "mobile-app-materials"
    "mobile-app-ui-components"
)

# First, make sure we have the latest changes
echo "📥 Fetching latest changes..."
git fetch --all

echo ""
echo "🔄 Updating feature worktrees..."

for worktree in "${WORKTREES[@]}"; do
    echo ""
    echo "📂 Updating $worktree..."
    
    WORKTREE_PATH="$PARENT_DIR/$worktree"
    
    if [ -d "$WORKTREE_PATH" ]; then
        cd "$WORKTREE_PATH"
        
        # Get current branch
        CURRENT_BRANCH=$(git branch --show-current)
        echo "  Current branch: $CURRENT_BRANCH"
        
        # Stash any local changes
        if ! git diff --quiet || ! git diff --cached --quiet; then
            echo "  Stashing local changes..."
            git stash push -m "Auto-stash before update"
        fi
        
        # Merge the mobile-app branch changes
        echo "  Merging mobile-app changes..."
        git merge mobile-app --no-edit
        
        if [ $? -eq 0 ]; then
            echo "  ✅ Successfully updated $worktree"
        else
            echo "  ⚠️  Merge conflicts in $worktree - manual resolution needed"
        fi
        
        # Copy essential files from mobile-app
        echo "  Copying Flutter configuration files..."
        cp "$MOBILE_APP_DIR/pubspec.yaml" .
        cp "$MOBILE_APP_DIR/analysis_options.yaml" .
        cp "$MOBILE_APP_DIR/.gitignore" .
        cp "$MOBILE_APP_DIR/.env.example" .
        cp "$MOBILE_APP_DIR/CLAUDE.md" .
        cp -r "$MOBILE_APP_DIR/docs" .
        cp -r "$MOBILE_APP_DIR/.vscode" .
        cp -r "$MOBILE_APP_DIR/lib" .
        cp -r "$MOBILE_APP_DIR/scripts" .
        
        # Create basic Flutter structure if missing
        mkdir -p assets/{images,icons,fonts}
        mkdir -p test/{unit,widget,integration}
        mkdir -p integration_test
        
        echo "  ✅ Flutter structure updated"
        
        cd - > /dev/null
    else
        echo "  ❌ Worktree not found at $WORKTREE_PATH"
    fi
done

echo ""
echo "✅ All worktrees have been updated!"
echo ""
echo "📋 Next steps for each worktree:"
echo "  1. cd into the worktree"
echo "  2. Check for any merge conflicts"
echo "  3. Run 'flutter pub get'"
echo "  4. Start developing the feature"
echo ""
echo "💡 To check the status of all worktrees:"
echo "  git worktree list"