#!/bin/bash

# PakeAja CRM - Git Worktree Setup Script
# This script sets up all worktrees for parallel mobile app development

echo "🌳 PakeAja CRM - Setting up Git Worktrees for Mobile Development"
echo "=============================================================="

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: This is not a git repository."
    echo "Please run this script from the PakeAja CRM repository root."
    exit 1
fi

# Get the current directory name and parent path
CURRENT_DIR=$(basename "$PWD")
PARENT_DIR=$(dirname "$PWD")

echo ""
echo "📍 Current repository: $CURRENT_DIR"
echo "📁 Worktrees will be created in: $PARENT_DIR"
echo ""

# Function to create a worktree
create_worktree() {
    local feature_name=$1
    local branch_name="feature/mobile-$feature_name"
    local worktree_path="$PARENT_DIR/mobile-app-$feature_name"
    
    echo "🌿 Creating worktree for $feature_name..."
    
    # Check if worktree already exists
    if [ -d "$worktree_path" ]; then
        echo "  ⚠️  Worktree already exists at $worktree_path"
        echo "  Do you want to remove and recreate it? (y/n)"
        read -r response
        if [[ "$response" == "y" ]]; then
            git worktree remove "$worktree_path" --force 2>/dev/null || true
            git branch -D "$branch_name" 2>/dev/null || true
        else
            echo "  Skipping $feature_name..."
            return
        fi
    fi
    
    # Create the worktree
    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
        # Branch exists, use it
        git worktree add "$worktree_path" "$branch_name"
    else
        # Create new branch
        git worktree add -b "$branch_name" "$worktree_path"
    fi
    
    echo "  ✅ Created worktree at: $worktree_path"
    echo "  📌 Branch: $branch_name"
    
    # Initialize Flutter project in worktree
    echo "  🚀 Initializing Flutter project..."
    cd "$worktree_path"
    
    # Copy essential files from main
    cp "$PARENT_DIR/$CURRENT_DIR/pubspec.yaml" . 2>/dev/null || true
    cp "$PARENT_DIR/$CURRENT_DIR/analysis_options.yaml" . 2>/dev/null || true
    cp "$PARENT_DIR/$CURRENT_DIR/.gitignore" . 2>/dev/null || true
    cp -r "$PARENT_DIR/$CURRENT_DIR/docs" . 2>/dev/null || true
    
    # Create feature-specific README
    cat > README.md << EOF
# PakeAja CRM Mobile - ${feature_name^} Feature

This worktree contains the ${feature_name} feature implementation.

## Branch: $branch_name

## Development

1. Implement feature in \`lib/features/$feature_name/\`
2. Add tests in \`test/features/$feature_name/\`
3. Update feature flags if needed
4. Create pull request when ready

## Integration

After development, this feature will be merged into the main branch.
EOF
    
    # Create feature directory structure
    mkdir -p "lib/features/$feature_name"/{data,domain,presentation}
    mkdir -p "lib/features/$feature_name"/data/{models,repositories,sources}
    mkdir -p "lib/features/$feature_name"/domain/{entities,repositories,use_cases}
    mkdir -p "lib/features/$feature_name"/presentation/{screens,widgets,providers}
    mkdir -p "test/features/$feature_name"/{unit,widget,integration}
    
    # Create feature-specific main file
    cat > "lib/features/$feature_name/README.md" << EOF
# ${feature_name^} Feature

## Overview

Implementation of the ${feature_name} feature for PakeAja CRM Mobile App.

## Structure

- \`data/\` - Data layer implementation
- \`domain/\` - Business logic and entities
- \`presentation/\` - UI components and screens

## Dependencies

List feature-specific dependencies here.

## Testing

Run tests with: \`flutter test test/features/$feature_name\`
EOF
    
    cd - > /dev/null
    echo ""
}

# List of features to create worktrees for
FEATURES=(
    "auth"
    "daily-reports"
    "canvassing"
    "sync"
    "materials"
    "ui-components"
)

echo "🔧 The following worktrees will be created:"
for feature in "${FEATURES[@]}"; do
    echo "  - mobile-app-$feature"
done

echo ""
echo "Do you want to proceed? (y/n)"
read -r response

if [[ "$response" != "y" ]]; then
    echo "❌ Setup cancelled."
    exit 0
fi

echo ""
echo "🏗️  Creating worktrees..."
echo ""

# Create each worktree
for feature in "${FEATURES[@]}"; do
    create_worktree "$feature"
done

echo ""
echo "📊 Worktree Summary:"
echo "==================="
git worktree list

echo ""
echo "✅ All worktrees have been created successfully!"
echo ""
echo "🚀 Next steps for each worktree:"
echo "  1. cd into the worktree directory"
echo "  2. Run 'flutter create .' to initialize Flutter project"
echo "  3. Run 'flutter pub get' to install dependencies"
echo "  4. Start developing the feature"
echo ""
echo "💡 Tips:"
echo "  - Use 'git worktree list' to see all worktrees"
echo "  - Each worktree is independent with its own branch"
echo "  - Share code between features using the main branch"
echo "  - Create pull requests when features are ready"
echo ""
echo "📚 See docs/worktree-guide.md for detailed development workflow"