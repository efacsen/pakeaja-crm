#!/bin/bash

# Simple sync script for macOS compatibility

echo "🔄 Syncing Changes from Feature Worktrees"
echo "========================================"

# Function to sync a specific worktree
sync_auth() {
    echo "📁 Syncing mobile-app-auth..."
    if [ -d "../mobile-app-auth" ]; then
        # Sync auth feature files
        rsync -av --relative ../mobile-app-auth/./lib/features/auth ./ 2>/dev/null || echo "  No auth features found"
        
        # Sync auth database files
        rsync -av ../mobile-app-auth/lib/core/database/tables/auth_*.dart ./lib/core/database/tables/ 2>/dev/null || echo "  No auth tables found"
        rsync -av ../mobile-app-auth/lib/core/database/daos/auth_*.dart ./lib/core/database/daos/ 2>/dev/null || echo "  No auth DAOs found"
        
        echo "✅ Auth module synced"
    else
        echo "❌ Auth worktree not found"
    fi
}

sync_ui() {
    echo ""
    echo "📁 Syncing mobile-app-ui-components..."
    if [ -d "../mobile-app-ui-components" ]; then
        # Create directories if needed
        mkdir -p lib/shared lib/core/theme lib/core/constants
        
        # Sync UI components
        rsync -av ../mobile-app-ui-components/lib/shared/ ./lib/shared/ 2>/dev/null || echo "  No shared components found"
        rsync -av ../mobile-app-ui-components/lib/core/theme/ ./lib/core/theme/ 2>/dev/null || echo "  No theme found"
        rsync -av ../mobile-app-ui-components/lib/core/constants/ ./lib/core/constants/ 2>/dev/null || echo "  No constants found"
        
        echo "✅ UI Components synced"
    else
        echo "❌ UI Components worktree not found"
    fi
}

# Run syncs
sync_auth
sync_ui

echo ""
echo "========================================"
echo "✅ Sync Complete!"

# Check what was synced
echo ""
echo "📊 Checking synced files..."
echo ""
echo "Auth features:"
find lib/features/auth -type f 2>/dev/null | head -5 || echo "  None found"
echo ""
echo "UI Components:"
find lib/shared -type f 2>/dev/null | head -5 || echo "  None found"
echo ""
echo "Theme files:"
find lib/core/theme -type f 2>/dev/null | head -5 || echo "  None found"