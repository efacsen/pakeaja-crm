#!/bin/bash

# Script to verify Flutter setup in all worktrees

echo "🔍 Verifying Flutter setup in all worktrees..."
echo "============================================="

# Get the current directory
CURRENT_DIR=$(pwd)

# List of worktrees to verify
WORKTREES=(
    "../mobile-app-auth"
    "../mobile-app-canvassing"
    "../mobile-app-daily-reports"
    "../mobile-app-materials"
    "../mobile-app-sync"
    "../mobile-app-ui-components"
)

# Function to verify a worktree
verify_worktree() {
    local worktree=$1
    echo ""
    echo "📁 Verifying $worktree..."
    
    if [ ! -d "$worktree" ]; then
        echo "❌ Worktree $worktree not found"
        return
    fi
    
    # Check if pubspec.yaml exists
    if [ -f "$worktree/pubspec.yaml" ]; then
        echo "  ✅ pubspec.yaml found"
    else
        echo "  ❌ pubspec.yaml not found"
    fi
    
    # Check if main.dart exists
    if [ -f "$worktree/lib/main.dart" ]; then
        echo "  ✅ lib/main.dart found"
    else
        echo "  ❌ lib/main.dart not found"
    fi
    
    # Run flutter pub get
    echo "  📦 Running flutter pub get..."
    cd "$worktree"
    if flutter pub get > /dev/null 2>&1; then
        echo "  ✅ Dependencies installed successfully"
    else
        echo "  ❌ Failed to install dependencies"
    fi
    cd "$CURRENT_DIR"
}

# Verify all worktrees
for worktree in "${WORKTREES[@]}"; do
    verify_worktree "$worktree"
done

echo ""
echo "✅ Verification complete!"