#!/bin/bash

# Script to sync changes from feature worktrees to main worktree
# This ensures clean merging without conflicts

echo "🔄 Syncing Changes from Feature Worktrees"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to sync a specific worktree
sync_worktree() {
    local worktree_name=$1
    local ownership_paths=$2
    
    echo -e "\n${YELLOW}📁 Syncing from $worktree_name...${NC}"
    
    WORKTREE_PATH="../$worktree_name"
    
    if [ ! -d "$WORKTREE_PATH" ]; then
        echo -e "${RED}❌ Worktree not found: $worktree_name${NC}"
        return 1
    fi
    
    # Check if worktree has uncommitted changes
    cd "$WORKTREE_PATH"
    if ! git diff-index --quiet HEAD --; then
        echo -e "${RED}⚠️  Warning: $worktree_name has uncommitted changes${NC}"
        echo "  Please commit changes in $worktree_name first"
        cd - > /dev/null
        return 1
    fi
    cd - > /dev/null
    
    # Sync only the files that belong to this worktree
    IFS=',' read -ra PATHS <<< "$ownership_paths"
    for path in "${PATHS[@]}"; do
        path=$(echo $path | xargs) # Trim whitespace
        
        if [ -e "$WORKTREE_PATH/$path" ]; then
            # Create parent directory if it doesn't exist
            mkdir -p "$(dirname "$path")"
            
            # Use rsync to copy while preserving structure
            rsync -av --relative "$WORKTREE_PATH/./$path" .
            echo -e "${GREEN}  ✓ Synced $path${NC}"
        fi
    done
    
    return 0
}

# Define ownership for each worktree
declare -A WORKTREE_OWNERSHIP=(
    ["mobile-app-auth"]="lib/features/auth,lib/core/database/tables/auth_tokens_table.dart,lib/core/database/daos/auth_tokens_dao.dart"
    ["mobile-app-ui-components"]="lib/shared,lib/core/theme,lib/core/constants"
    ["mobile-app-daily-reports"]="lib/features/daily_reports,lib/core/database/tables/daily_reports_table.dart,lib/core/database/daos/daily_reports_dao.dart"
    ["mobile-app-canvassing"]="lib/features/canvassing,lib/core/database/tables/customers_table.dart,lib/core/database/daos/customers_dao.dart"
    ["mobile-app-materials"]="lib/features/materials,lib/core/database/tables/materials_table.dart,lib/core/database/daos/materials_dao.dart"
    ["mobile-app-sync"]="lib/core/services/sync,lib/core/services/background"
)

# Track results
SUCCESS_COUNT=0
TOTAL_COUNT=${#WORKTREE_OWNERSHIP[@]}

# Sync each worktree
for worktree in "${!WORKTREE_OWNERSHIP[@]}"; do
    if sync_worktree "$worktree" "${WORKTREE_OWNERSHIP[$worktree]}"; then
        ((SUCCESS_COUNT++))
    fi
done

echo -e "\n========================================"
echo -e "${GREEN}✅ Sync Complete!${NC}"
echo "   Successfully synced $SUCCESS_COUNT out of $TOTAL_COUNT worktrees"

# If any files were synced, regenerate Drift files
if [ $SUCCESS_COUNT -gt 0 ]; then
    echo -e "\n${YELLOW}🔨 Regenerating Drift files...${NC}"
    flutter pub run build_runner build --delete-conflicting-outputs
fi

echo -e "\n${YELLOW}📝 Next Steps:${NC}"
echo "1. Review the synced changes"
echo "2. Run 'flutter analyze' to check for issues"
echo "3. Test the app to ensure everything works"
echo "4. Commit the merged changes"

# Show git status
echo -e "\n${YELLOW}📊 Git Status:${NC}"
git status --short