# Migration Checklist - Moving to Parent Directory

## 📋 Pre-Migration Checklist

### 1. Context to Preserve:
- ✅ All conversation history (automatic)
- ✅ Understanding of project structure
- ✅ Knowledge of completed work
- ✅ Issues found (auth module incomplete, platform bugs)
- ✅ Integration verification results

### 2. Files to Reference After Move:
```
mobile-app/SESSION_STATE.md
mobile-app/INTEGRATION_VERIFICATION_REPORT.md
mobile-app/LEADER_ACTION_PLAN.md
mobile-app/PARALLEL_DEVELOPMENT_GUIDE.md
mobile-app/docs/Bug_Tracking.md
```

### 3. Current State Summary:
- **Core Architecture**: 100% complete ✅
- **Auth Module**: ~5% (falsely reported as 100%) ❌
- **UI Components**: 100% complete ✅
- **Bug Found**: Platform detection fails on web
- **Dashboard**: Running on port 3000

## 🚀 Migration Steps

### Step 1: Prepare Dashboard Move
```bash
# In mobile-app directory
cd /Users/kevinzakaria/Documents/pakeaja-crm-worktrees/mobile-app

# Stop dashboard if running
# Ctrl+C in dashboard terminal

# Create parent-level scripts directory
mkdir -p ../scripts
```

### Step 2: Move Dashboard
```bash
# Move dashboard to parent
mv dashboard ../

# Update dashboard paths
cd ../dashboard
sed -i '' 's|mobile-app/dashboard|dashboard|g' *.js *.md
```

### Step 3: Create Monitoring Scripts
```bash
cd /Users/kevinzakaria/Documents/pakeaja-crm-worktrees
mkdir -p scripts

# Create monitor-all script
cat > scripts/monitor-all.sh << 'EOF'
#!/bin/bash
echo "🔍 Monitoring All Worktrees"
echo "=========================="

for dir in mobile-app*; do
    if [ -d "$dir" ]; then
        echo ""
        echo "📁 $dir:"
        echo "-------------------"
        
        # Check git status
        cd "$dir"
        echo "Git Status:"
        git status -s | head -5
        
        # Count files
        echo "Dart files: $(find lib -name "*.dart" 2>/dev/null | wc -l)"
        
        # Check last commit
        echo "Last commit: $(git log -1 --oneline 2>/dev/null || echo "No commits")"
        
        # Check for implementation
        if [ -d "lib/features" ]; then
            for feature in lib/features/*; do
                if [ -d "$feature" ]; then
                    count=$(find "$feature" -name "*.dart" | wc -l)
                    echo "  - $(basename $feature): $count files"
                fi
            done
        fi
        
        cd ..
    fi
done

echo ""
echo "📊 Dashboard Status:"
if [ -f "dashboard/progress.json" ]; then
    echo "Progress tracking available"
else
    echo "⚠️  Dashboard not found"
fi
EOF

chmod +x scripts/monitor-all.sh
```

### Step 4: Create Verification Script
```bash
cat > scripts/verify-module.sh << 'EOF'
#!/bin/bash
MODULE=$1

if [ -z "$MODULE" ]; then
    echo "Usage: ./verify-module.sh <module-name>"
    echo "Example: ./verify-module.sh mobile-app-auth"
    exit 1
fi

echo "🔍 Verifying $MODULE"
echo "==================="

if [ ! -d "$MODULE" ]; then
    echo "❌ Module directory not found"
    exit 1
fi

cd "$MODULE"

# Check structure
echo "📁 Directory Structure:"
find lib -type d | head -20

# Check implementation
echo ""
echo "📝 Implementation Check:"
echo "Total Dart files: $(find lib -name "*.dart" | wc -l)"
echo "Test files: $(find test -name "*_test.dart" 2>/dev/null | wc -l || echo 0)"

# Check for specific patterns
echo ""
echo "🔎 Code Analysis:"
echo "Classes found: $(grep -r "^class " lib --include="*.dart" | wc -l)"
echo "TODO comments: $(grep -r "TODO" lib --include="*.dart" | wc -l)"
echo "Placeholder text: $(grep -r "Under Development\|Coming Soon" lib --include="*.dart" | wc -l)"

# Run tests if available
echo ""
echo "🧪 Running Tests:"
if [ -f "pubspec.yaml" ]; then
    flutter test --no-pub 2>/dev/null || echo "⚠️  Tests failed or not found"
else
    echo "⚠️  No pubspec.yaml found"
fi

cd ..
EOF

chmod +x scripts/verify-module.sh
```

### Step 5: Create Integration Script
```bash
cat > scripts/integrate-module.sh << 'EOF'
#!/bin/bash
MODULE=$1

if [ -z "$MODULE" ]; then
    echo "Usage: ./integrate-module.sh <module-name>"
    exit 1
fi

echo "🔄 Integrating $MODULE into mobile-app"
echo "====================================="

# Run verification first
./scripts/verify-module.sh "$MODULE"

echo ""
echo "📦 Syncing files..."
cd mobile-app
./scripts/sync-from-worktrees-simple.sh

echo ""
echo "🔨 Rebuilding..."
flutter pub run build_runner build --delete-conflicting-outputs

echo ""
echo "✅ Integration complete. Run 'flutter run' to test."
EOF

chmod +x scripts/integrate-module.sh
```

## 📍 After Migration

### Your New Workflow:
```bash
# 1. Start Claude from parent directory
cd /Users/kevinzakaria/Documents/pakeaja-crm-worktrees
claude-code

# 2. Tell Claude: "I'm now in the parent directory with access to all worktrees"

# 3. Claude can now:
./scripts/monitor-all.sh              # See everything
./scripts/verify-module.sh mobile-app-auth  # Verify specific module
./scripts/integrate-module.sh mobile-app-ui # Integrate modules
```

### First Commands to Run:
```bash
# 1. Check what auth agent actually built
find mobile-app-auth -name "*.dart" | wc -l

# 2. Monitor all worktrees
./scripts/monitor-all.sh

# 3. Start dashboard from new location
cd dashboard && npm start
```

## 🎯 Context Preservation

I will remember:
1. **Auth module is incomplete** - Only 2 files despite 100% claim
2. **UI Components are complete** - 29 files properly implemented  
3. **Platform detection bug** - Needs fixing for web
4. **Integration issues** - Zone mismatch, logger API changes
5. **Our goal** - Better monitoring to prevent false completions

## ✅ Ready to Migrate!

**Next Steps:**
1. Run the migration steps above
2. Start new Claude session from parent directory
3. Tell me "Migration complete, you now have access to all worktrees"
4. I'll immediately verify what each agent actually built

This will give us the visibility we need to properly lead this project!