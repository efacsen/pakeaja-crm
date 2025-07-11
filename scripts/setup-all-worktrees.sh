#!/bin/bash

# Script to ensure all worktrees are ready for development
# This script will:
# 1. Check Flutter installation
# 2. Verify each worktree has necessary files
# 3. Run flutter pub get in each worktree
# 4. Create platform support if missing
# 5. Verify everything is working

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 PakeAja CRM - Worktree Setup Script"
echo "======================================"
echo ""

# List of worktrees
WORKTREES=(
    "mobile-app"
    "mobile-app-auth"
    "mobile-app-daily-reports"
    "mobile-app-canvassing"
    "mobile-app-materials"
    "mobile-app-sync"
    "mobile-app-ui-components"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "success")
            echo -e "${GREEN}✅ ${message}${NC}"
            ;;
        "error")
            echo -e "${RED}❌ ${message}${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  ${message}${NC}"
            ;;
        "info")
            echo -e "${BLUE}ℹ️  ${message}${NC}"
            ;;
    esac
}

# Check Flutter installation
echo "1️⃣ Checking Flutter installation..."
if command -v flutter &> /dev/null; then
    FLUTTER_VERSION=$(flutter --version | head -n 1)
    print_status "success" "Flutter is installed: $FLUTTER_VERSION"
else
    print_status "error" "Flutter is not installed! Please install Flutter first."
    exit 1
fi

echo ""
echo "2️⃣ Setting up each worktree..."
echo ""

# Function to setup a single worktree
setup_worktree() {
    local worktree_name=$1
    local worktree_path=""
    
    if [ "$worktree_name" == "mobile-app" ]; then
        worktree_path="$PROJECT_ROOT"
    else
        worktree_path="$PROJECT_ROOT/../$worktree_name"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📁 Setting up: $worktree_name"
    echo "   Path: $worktree_path"
    echo ""
    
    # Check if worktree exists
    if [ ! -d "$worktree_path" ]; then
        print_status "error" "Worktree directory not found!"
        return 1
    fi
    
    cd "$worktree_path"
    
    # Check essential files
    echo "   Checking essential files..."
    
    if [ ! -f "pubspec.yaml" ]; then
        print_status "error" "pubspec.yaml not found!"
        return 1
    else
        print_status "success" "pubspec.yaml found"
    fi
    
    if [ ! -f "lib/main.dart" ]; then
        print_status "warning" "lib/main.dart not found - will need to be created"
    else
        print_status "success" "lib/main.dart found"
    fi
    
    # Check platform support
    echo ""
    echo "   Checking platform support..."
    
    PLATFORMS_MISSING=false
    
    if [ ! -d "web" ]; then
        print_status "warning" "Web platform not configured"
        PLATFORMS_MISSING=true
    else
        print_status "success" "Web platform configured"
    fi
    
    if [ ! -d "ios" ]; then
        print_status "warning" "iOS platform not configured"
        PLATFORMS_MISSING=true
    else
        print_status "success" "iOS platform configured"
    fi
    
    if [ ! -d "android" ]; then
        print_status "warning" "Android platform not configured"
        PLATFORMS_MISSING=true
    else
        print_status "success" "Android platform configured"
    fi
    
    # Add platform support if missing
    if [ "$PLATFORMS_MISSING" = true ]; then
        echo ""
        echo "   Adding missing platform support..."
        flutter create . --platforms=web,ios,android &> /dev/null
        print_status "success" "Platform support added"
    fi
    
    # Clean any existing build artifacts
    echo ""
    echo "   Cleaning build artifacts..."
    flutter clean &> /dev/null
    print_status "success" "Build artifacts cleaned"
    
    # Get dependencies
    echo ""
    echo "   Installing dependencies..."
    if flutter pub get; then
        print_status "success" "Dependencies installed successfully"
    else
        print_status "error" "Failed to install dependencies"
        return 1
    fi
    
    # Run flutter doctor for this project
    echo ""
    echo "   Running Flutter doctor..."
    if flutter doctor -v | grep -q "No issues found!"; then
        print_status "success" "Flutter doctor passed"
    else
        print_status "warning" "Flutter doctor found some issues (may not affect development)"
    fi
    
    # Analyze the code
    echo ""
    echo "   Analyzing code..."
    if flutter analyze --no-fatal-infos --no-fatal-warnings 2>&1 | grep -q "No issues found!"; then
        print_status "success" "Code analysis passed"
    else
        print_status "warning" "Code analysis found some issues"
    fi
    
    echo ""
    print_status "success" "Worktree $worktree_name is ready for development!"
    echo ""
    
    return 0
}

# Setup each worktree
FAILED_WORKTREES=()
SUCCESSFUL_WORKTREES=()

for worktree in "${WORKTREES[@]}"; do
    if setup_worktree "$worktree"; then
        SUCCESSFUL_WORKTREES+=("$worktree")
    else
        FAILED_WORKTREES+=("$worktree")
    fi
done

# Return to original directory
cd "$PROJECT_ROOT"

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Setup Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ${#SUCCESSFUL_WORKTREES[@]} -gt 0 ]; then
    echo "✅ Successfully setup (${#SUCCESSFUL_WORKTREES[@]}):"
    for worktree in "${SUCCESSFUL_WORKTREES[@]}"; do
        echo "   - $worktree"
    done
fi

if [ ${#FAILED_WORKTREES[@]} -gt 0 ]; then
    echo ""
    echo "❌ Failed setup (${#FAILED_WORKTREES[@]}):"
    for worktree in "${FAILED_WORKTREES[@]}"; do
        echo "   - $worktree"
    done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create a status report file
STATUS_FILE="$PROJECT_ROOT/worktree-setup-status.json"
echo "{" > "$STATUS_FILE"
echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\","  >> "$STATUS_FILE"
echo "  \"successful\": [" >> "$STATUS_FILE"
for i in "${!SUCCESSFUL_WORKTREES[@]}"; do
    if [ $i -ne 0 ]; then echo -n "," >> "$STATUS_FILE"; fi
    echo -n " \"${SUCCESSFUL_WORKTREES[$i]}\"" >> "$STATUS_FILE"
done
echo " ]," >> "$STATUS_FILE"
echo "  \"failed\": [" >> "$STATUS_FILE"
for i in "${!FAILED_WORKTREES[@]}"; do
    if [ $i -ne 0 ]; then echo -n "," >> "$STATUS_FILE"; fi
    echo -n " \"${FAILED_WORKTREES[$i]}\"" >> "$STATUS_FILE"
done
echo " ]" >> "$STATUS_FILE"
echo "}" >> "$STATUS_FILE"

print_status "info" "Setup status saved to: worktree-setup-status.json"

# Final message
if [ ${#FAILED_WORKTREES[@]} -eq 0 ]; then
    echo ""
    print_status "success" "🎉 All worktrees are ready for development!"
    echo ""
    echo "Next steps:"
    echo "1. Start the development dashboard: cd dashboard && ./start-dashboard.sh"
    echo "2. Open http://localhost:3000 in your browser"
    echo "3. Begin development using the tasks in dashboard/development-tasks.md"
else
    echo ""
    print_status "warning" "Some worktrees failed to setup. Please check the errors above."
fi