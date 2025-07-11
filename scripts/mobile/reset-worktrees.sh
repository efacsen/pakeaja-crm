#!/bin/bash

# Script to reset all worktrees to start fresh from mobile-app branch

echo "🔄 Resetting all worktrees to Flutter mobile app structure..."
echo "=================================================="

# Get the current directory
MOBILE_APP_DIR="$PWD"
PARENT_DIR=$(dirname "$PWD")

# Get the latest commit from mobile-app branch
MOBILE_APP_COMMIT=$(git rev-parse mobile-app)
echo "📍 Mobile app commit: $MOBILE_APP_COMMIT"

# List of feature worktrees
WORKTREES=(
    "mobile-app-auth:feature/mobile-auth"
    "mobile-app-daily-reports:feature/mobile-daily-reports"
    "mobile-app-canvassing:feature/mobile-canvassing"
    "mobile-app-sync:feature/mobile-sync"
    "mobile-app-materials:feature/mobile-materials"
    "mobile-app-ui-components:feature/mobile-ui-components"
)

echo ""
echo "⚠️  WARNING: This will reset all worktrees to the mobile-app state."
echo "Any uncommitted changes will be lost!"
echo ""
echo "Continue? (y/n)"
read -r response

if [[ "$response" != "y" ]]; then
    echo "❌ Reset cancelled."
    exit 0
fi

echo ""
echo "🔄 Resetting feature worktrees..."

for worktree_info in "${WORKTREES[@]}"; do
    IFS=':' read -r worktree branch <<< "$worktree_info"
    
    echo ""
    echo "📂 Resetting $worktree (branch: $branch)..."
    
    WORKTREE_PATH="$PARENT_DIR/$worktree"
    
    if [ -d "$WORKTREE_PATH" ]; then
        cd "$WORKTREE_PATH"
        
        # Clean up any local changes
        echo "  Cleaning working directory..."
        git clean -fd
        git checkout -- .
        
        # Reset the branch to mobile-app
        echo "  Resetting to mobile-app state..."
        git reset --hard mobile-app
        
        # Set the branch upstream
        echo "  Setting up branch tracking..."
        git branch --set-upstream-to=origin/$branch $branch 2>/dev/null || true
        
        echo "  ✅ Successfully reset $worktree"
        
        cd - > /dev/null
    else
        echo "  ❌ Worktree not found at $WORKTREE_PATH"
    fi
done

echo ""
echo "✅ All worktrees have been reset!"
echo ""
echo "📋 Each worktree now has:"
echo "  - Clean Flutter project structure"
echo "  - All documentation files"
echo "  - Mobile app configuration"
echo "  - Ready for feature development"
echo ""
echo "🚀 Next steps:"
echo "  1. cd into a worktree (e.g., cd ../mobile-app-daily-reports)"
echo "  2. Run 'flutter create .' to initialize Flutter"
echo "  3. Run 'flutter pub get'"
echo "  4. Start developing the feature"