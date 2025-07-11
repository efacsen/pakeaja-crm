# Parallel Development Guide - Auth & UI Components

## Overview
This guide ensures parallel development without merge conflicts by clearly defining ownership boundaries for each worktree.

## 🔐 Terminal 1: Authentication Module

### Navigate to Directory:
```bash
cd /Users/kevinzakaria/Documents/pakeaja-crm-worktrees/mobile-app-auth
```

### Start Claude Code:
```bash
claude-code
```

### Copy-Paste This Prompt:
```
I need to implement the Authentication module for PakeAja CRM Mobile App. The core architecture is already complete in the main worktree with:
- Drift database configured
- Riverpod providers set up
- Bug tracking implemented
- Navigation with GoRouter ready

IMPORTANT BOUNDARIES - I own these files/folders exclusively:
- lib/features/auth/ (entire folder)
- lib/core/database/tables/auth_tokens_table.dart (create this)
- lib/core/database/daos/auth_tokens_dao.dart (create this)

DO NOT modify any files outside these boundaries. For shared functionality, import from core.

Please implement:

1. Domain Layer (lib/features/auth/domain/):
   - User entity with fields: id, email, name, phone, role, organizationId, profileImageUrl
   - AuthRepository interface with methods: login, logout, getCurrentUser, refreshToken
   - Use cases: LoginUseCase, LogoutUseCase, GetCurrentUserUseCase, AutoLoginUseCase

2. Data Layer (lib/features/auth/data/):
   - AuthTokens model and Drift table for storing tokens locally
   - AuthRepositoryImpl with Supabase integration
   - Handle offline scenarios by storing tokens securely
   - Implement token refresh logic

3. Presentation Layer (lib/features/auth/presentation/):
   - Enhanced login screen (replacing the placeholder)
   - Registration screen
   - Forgot password screen
   - Auth state management with Riverpod (AuthNotifier)
   - Form validation with flutter_form_builder

4. Integration:
   - Update the existing LoginScreen to use the new auth system
   - Add auth guard to router (without modifying core router file)
   - Handle auto-login on app start

Use the existing providers from core (supabaseProvider, secureStorageProvider, databaseProvider).

Update dashboard progress as you work:
node ../mobile-app/dashboard/update-progress.js status mobile-app-auth active
node ../mobile-app/dashboard/update-progress.js task mobile-app-auth "Building auth domain layer"
```

---

## 🎨 Terminal 2: UI Components Library

### Navigate to Directory:
```bash
cd /Users/kevinzakaria/Documents/pakeaja-crm-worktrees/mobile-app-ui-components
```

### Start Claude Code:
```bash
claude-code
```

### Copy-Paste This Prompt:
```
I need to create a comprehensive UI Components Library for PakeAja CRM Mobile App. The core architecture is complete with Riverpod and navigation set up.

IMPORTANT BOUNDARIES - I own these files/folders exclusively:
- lib/shared/ (entire folder for UI components)
- lib/core/theme/ (create this for theme system)
- lib/core/constants/ (create this for UI constants)

DO NOT modify any feature-specific files or core functionality. Only create reusable UI components.

Please implement:

1. Form Components (lib/shared/widgets/form/):
   - CustomTextField with validation states
   - CustomDropdown with search capability
   - CustomDatePicker with range selection
   - CustomFilePicker for images/documents
   - CustomCheckbox and CustomRadioButton
   - FormFieldWrapper with consistent styling

2. Common Widgets (lib/shared/widgets/common/):
   - LoadingIndicator (circular, linear, shimmer variants)
   - EmptyStateWidget with customizable icon/message
   - ErrorWidget with retry action
   - SuccessMessage with auto-dismiss
   - CustomAppBar with common actions
   - CustomBottomSheet base widget

3. Card Components (lib/shared/widgets/cards/):
   - BaseCard with consistent shadows/borders
   - CustomerCard for customer lists
   - ReportCard for daily reports
   - ProductCard for materials
   - SummaryCard for dashboard metrics

4. Button Components (lib/shared/widgets/buttons/):
   - PrimaryButton, SecondaryButton, TextButton
   - IconButton with labels
   - FloatingActionButton variants
   - LoadingButton with progress indicator

5. Layout Components (lib/shared/widgets/layout/):
   - ResponsiveBuilder for different screen sizes
   - CustomScaffold with common structure
   - SectionHeader with actions
   - ListItemTile with various layouts

6. Theme System (lib/core/theme/):
   - AppColors with brand colors
   - AppTextStyles with typography scale
   - AppSpacing with consistent spacing
   - AppTheme with light/dark variants
   - Component-specific themes

7. Constants (lib/core/constants/):
   - UIConstants (sizes, durations, radiuses)
   - AppStrings (common UI texts)
   - ValidationRules for forms

Each component should:
- Be fully documented with examples
- Support theming
- Be accessible
- Include loading/error states where applicable
- Be responsive

Update dashboard progress as you work:
node ../mobile-app/dashboard/update-progress.js status mobile-app-ui-components active
node ../mobile-app/dashboard/update-progress.js task mobile-app-ui-components "Creating form components"
```

---

## 📋 Ownership Matrix

### mobile-app-auth owns:
| Path | Description |
|------|-------------|
| lib/features/auth/** | All auth feature files |
| lib/core/database/tables/auth_* | Auth-related tables |
| lib/core/database/daos/auth_* | Auth-related DAOs |

### mobile-app-ui-components owns:
| Path | Description |
|------|-------------|
| lib/shared/** | All shared UI components |
| lib/core/theme/** | Theme system |
| lib/core/constants/** | UI constants |

### Shared (Read-Only):
| Path | Description |
|------|-------------|
| lib/core/providers/* | Import only, don't modify |
| lib/core/navigation/* | Import only, don't modify |
| lib/core/database/app_database.dart | Import only, don't modify |

## 🔄 Sync Strategy

After completing work in each worktree:

1. **Commit changes in your worktree**:
   ```bash
   git add .
   git commit -m "feat(auth): implement login functionality"
   ```

2. **Create a sync script** in main worktree to pull changes:
   ```bash
   cd /Users/kevinzakaria/Documents/pakeaja-crm-worktrees/mobile-app
   ./scripts/sync-from-worktrees.sh
   ```

3. **Never modify files outside your ownership** to avoid conflicts

## 🚦 Progress Tracking

Both terminals should update the dashboard regularly:

```bash
# Auth module examples
node ../mobile-app/dashboard/update-progress.js progress mobile-app-auth 25
node ../mobile-app/dashboard/update-progress.js complete mobile-app-auth "Created User entity"

# UI module examples  
node ../mobile-app/dashboard/update-progress.js progress mobile-app-ui-components 30
node ../mobile-app/dashboard/update-progress.js complete mobile-app-ui-components "Built form components"
```

## ⚠️ Important Rules

1. **Stay in your lane**: Only modify files you own
2. **Import shared code**: Don't duplicate existing functionality
3. **Document your exports**: Make it easy for others to use your code
4. **Test in isolation**: Each module should work independently
5. **Communicate via dashboard**: Use action messages for coordination