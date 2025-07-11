#!/bin/bash

# PakeAja CRM - Remove webapp-specific documentation
# This script removes remaining webapp files and consolidates mobile documentation

echo "🧹 Cleaning up webapp-specific documentation..."
echo "============================================"

# Function to remove files safely
remove_file() {
    if [ -f "$1" ]; then
        echo "  Removing: $1"
        rm -f "$1"
    else
        echo "  Already removed: $1"
    fi
}

# Function to remove directories safely
remove_dir() {
    if [ -d "$1" ]; then
        echo "  Removing directory: $1"
        rm -rf "$1"
    else
        echo "  Already removed: $1"
    fi
}

echo ""
echo "📄 Removing webapp-specific documentation..."

# Remove webapp-specific docs
remove_file "docs/MVP_STATUS.md"
remove_file "docs/TROUBLESHOOTING.md"

# Remove old mobile docs that reference React Native (we're using Flutter)
echo ""
echo "📱 Updating mobile documentation for Flutter..."

# Update the docs/README.md to reflect Flutter approach
cat > docs/README.md << 'EOF'
# 📱 PakeAja CRM Mobile Development Documentation

> **Complete Documentation Suite for Mobile Development Team**  
> Flutter | Dart | Supabase | Offline-First Architecture

---

## 🎯 Overview

Welcome to the PakeAja CRM Mobile App development documentation. This comprehensive guide provides everything needed to build a robust, offline-first field sales application for the coating industry using Flutter.

### 📋 Project Summary
- **Target Users**: Field Sales Representatives & Managers
- **Platform**: Android (iOS support in future releases)
- **Framework**: Flutter with Clean Architecture
- **Backend**: Supabase (PostgreSQL + Authentication + Storage)
- **Key Features**: Offline-first operations, real-time sync, GPS tracking, photo uploads
- **Development Approach**: Git worktrees for parallel feature development

---

## 📚 Documentation Index

### Core Documents

1. **[Product Requirements Document (PRD.md)](./PRD.md)**
   - Executive summary and business objectives
   - User personas and stories
   - Feature specifications and priorities
   - Success metrics and KPIs

2. **[Implementation Guide (Implementation.md)](./Implementation.md)**
   - Technical architecture with Clean Architecture
   - Flutter project setup and dependencies
   - Offline-first implementation details
   - Code examples and best practices

3. **[Project Structure (Project_Structure.md)](./Project_Structure.md)**
   - Detailed folder organization
   - Feature-based module structure
   - Git worktree layout
   - Naming conventions

4. **[UI/UX Guidelines (UI_UX.md)](./UI_UX.md)**
   - Material Design 3 implementation
   - Design system and components
   - Screen layouts and interactions
   - Accessibility requirements

5. **[Git Worktree Guide (worktree-guide.md)](./worktree-guide.md)**
   - Parallel development workflow
   - Worktree setup and management
   - Feature integration process
   - CI/CD integration

6. **[Bug Tracking Guide (Bug_Tracking.md)](./Bug_Tracking.md)**
   - Bug severity classifications
   - Reporting and tracking workflow
   - Prevention strategies
   - Emergency response procedures

### Setup & Configuration

7. **[Mobile App Setup (MOBILE_APP_SETUP.md)](./MOBILE_APP_SETUP.md)**
   - Repository transformation steps
   - Flutter initialization
   - Environment configuration
   - Quick command reference

### Legacy Mobile Documentation (Reference Only)

These documents were from the initial React Native planning phase but contain useful API and database information:

- [Mobile API Reference](./MOBILE_API_REFERENCE.md) - Supabase API endpoints
- [Mobile Database Schema](./MOBILE_DATABASE_SCHEMA.md) - Database structure
- [Mobile Development Spec](./MOBILE_APP_DEVELOPMENT_SPEC.md) - Original spec (React Native)
- [Mobile Setup Guide](./MOBILE_SETUP_GUIDE.md) - Original setup (React Native)

---

## 🚀 Quick Start

1. **Setup Development Environment**
   ```bash
   # Run cleanup script
   ./scripts/cleanup-for-mobile.sh
   
   # Setup worktrees
   ./scripts/setup-worktrees.sh
   
   # Initialize Flutter
   flutter create .
   ```

2. **Choose a Feature to Develop**
   ```bash
   cd ../mobile-app-daily-reports
   flutter pub get
   ```

3. **Start Development**
   - Follow the Implementation Guide
   - Use the UI/UX Guidelines
   - Track bugs using Bug_Tracking.md

---

## 🎯 Development Priorities

### Phase 1: MVP (Current Focus)
- ✅ Authentication with biometric support
- ✅ Daily activity reports
- ✅ Canvassing with offline support
- ✅ Basic sync engine
- ✅ Materials database (read-only)

### Phase 2: Enhanced Features
- 📊 Analytics dashboard
- 📈 Sales pipeline integration
- 📅 Visit planning
- 🔔 Push notifications

### Phase 3: Advanced Features
- 🤖 AI-powered insights
- 📸 OCR document scanning
- 🗺️ Territory management
- 🏆 Gamification

---

## 📞 Support

For questions or clarifications:
1. Check the relevant documentation
2. Review the Implementation Guide
3. Consult the Git Worktree Guide for workflow questions
4. Use Bug_Tracking.md for issue reporting

---

**Last Updated**: January 2025  
**Framework**: Flutter  
**Architecture**: Clean Architecture with Offline-First Design
EOF

echo ""
echo "🔍 Checking for other webapp-specific files..."

# Remove any remaining package.json related files (already done by cleanup-for-mobile.sh)
remove_file "package.json"
remove_file "package-lock.json"
remove_file "yarn.lock"

# Remove webapp config files (already done by cleanup-for-mobile.sh)
remove_file "next.config.js"
remove_file "next.config.ts"
remove_file "tsconfig.json"
remove_file "tailwind.config.js"
remove_file "tailwind.config.ts"

# Remove .cursorrules.md if it's webapp-specific
if [ -f ".cursorrules.md" ]; then
    if grep -q "Next.js\|React\|Tailwind" ".cursorrules.md" 2>/dev/null; then
        echo "  .cursorrules.md contains webapp references"
        
        # Create mobile-specific cursor rules
        cat > .cursorrules.md << 'EOF'
# PakeAja CRM Mobile App - Flutter Development

## Project Context
- **Framework**: Flutter with Dart
- **Architecture**: Clean Architecture
- **State Management**: Riverpod
- **Local Database**: Drift (SQLite)
- **Backend**: Supabase
- **Platform**: Android first, iOS later

## Development Guidelines
1. Follow Clean Architecture principles
2. Implement offline-first functionality
3. Use Material Design 3
4. Write tests for critical features
5. Document complex business logic

## Code Standards
- Use strong typing everywhere
- Follow Dart naming conventions
- Implement proper error handling
- Add meaningful comments
- Keep widgets small and focused

## Git Workflow
- Use git worktrees for features
- Create descriptive commit messages
- Follow PR template
- Ensure tests pass before merging
EOF
        echo "  Created mobile-specific .cursorrules.md"
    fi
fi

# Check for any stray webapp files in root
echo ""
echo "🔍 Checking for stray webapp files..."
for file in *.js *.jsx *.ts *.tsx; do
    if [ -f "$file" ] && [ "$file" != "*.js" ] && [ "$file" != "*.jsx" ] && [ "$file" != "*.ts" ] && [ "$file" != "*.tsx" ]; then
        echo "  Found webapp file: $file"
        remove_file "$file"
    fi
done

# Final consolidation of mobile docs
echo ""
echo "📚 Consolidating mobile documentation..."

# Create a mobile-specific index
cat > docs/INDEX.md << 'EOF'
# 📱 PakeAja CRM Mobile Documentation Index

## Essential Documents (Start Here)

1. **[PRD.md](./PRD.md)** - Product Requirements
2. **[Implementation.md](./Implementation.md)** - Technical Implementation
3. **[worktree-guide.md](./worktree-guide.md)** - Development Workflow

## Development Guides

- **[Project_Structure.md](./Project_Structure.md)** - Code Organization
- **[UI_UX.md](./UI_UX.md)** - Design Guidelines
- **[Bug_Tracking.md](./Bug_Tracking.md)** - Issue Management
- **[MOBILE_APP_SETUP.md](./MOBILE_APP_SETUP.md)** - Setup Instructions

## API & Database Reference

- **[MOBILE_API_REFERENCE.md](./MOBILE_API_REFERENCE.md)** - Supabase APIs
- **[MOBILE_DATABASE_SCHEMA.md](./MOBILE_DATABASE_SCHEMA.md)** - Database Schema

## Legacy Documentation

- **[MOBILE_APP_DEVELOPMENT_SPEC.md](./MOBILE_APP_DEVELOPMENT_SPEC.md)** - Original React Native spec
- **[MOBILE_SETUP_GUIDE.md](./MOBILE_SETUP_GUIDE.md)** - Original setup guide

---

**Quick Links:**
- [Flutter Documentation](https://docs.flutter.dev/)
- [Supabase Flutter SDK](https://supabase.com/docs/reference/dart/introduction)
- [Material Design 3](https://m3.material.io/)
EOF

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📋 Summary:"
echo "  - Removed webapp-specific documentation"
echo "  - Updated docs/README.md for Flutter"
echo "  - Created mobile-specific cursor rules"
echo "  - Added documentation index"
echo ""
echo "📱 The repository now contains only mobile-relevant documentation!"