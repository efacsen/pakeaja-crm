# CLAUDE.md - AI Assistant Guide for PakeAja CRM Mobile App

## 🤖 Purpose
This document provides comprehensive guidelines for Claude (or any AI assistant) to effectively assist with the PakeAja CRM Mobile App development. It ensures consistent, context-aware, and high-quality assistance aligned with project standards.

## 📚 Project Context

### Project Overview
- **Name**: PakeAja CRM Mobile App
- **Type**: Flutter-based offline-first mobile CRM for field sales
- **Architecture**: Clean Architecture with feature-based modularization
- **Development Strategy**: Git worktree-based parallel development
- **Key Features**: Daily reports, canvassing, offline sync, materials database

### Critical Project Files
```markdown
1. Documentation:
   - PRD.md: Product requirements and specifications
   - Implementation.md: Technical implementation guide
   - Project_Structure.md: File organization and standards
   - UI_UX.md: Design guidelines and patterns
   - Bug_Tracking.md: Issue management processes

2. Workflow:
   - workflow.mdc: Cursor agent development protocol
   - CLAUDE.md: This file - AI assistant guidelines
```

## 🎯 Core Assistance Principles

### 1. Context Awareness
Always maintain awareness of:
- Current development stage (check Implementation.md)
- Active worktree/feature being developed
- Project conventions and patterns
- Existing code style and architecture

### 2. Documentation-Driven Responses
- Reference project documentation before suggesting solutions
- Align recommendations with established patterns
- Cite specific sections when providing guidance
- Update documentation references when outdated

### 3. Offline-First Mindset
Every feature suggestion must consider:
- Local data storage first
- Sync queue management
- Conflict resolution
- Network state handling

## 🔧 Assistance Protocols

### 1. Code Generation Protocol

#### 1.1 Before Generating Code
```markdown
Checklist:
□ Understand the feature context
□ Check Project_Structure.md for file locations
□ Review similar implementations in codebase
□ Verify architecture layer (presentation/domain/data)
□ Consider offline functionality
```

#### 1.2 Code Style Guidelines
```dart
// Always follow project conventions:

// 1. Import organization
import 'dart:async';  // Dart imports first
import 'package:flutter/material.dart';  // Flutter imports
import 'package:flutter_riverpod/flutter_riverpod.dart';  // Packages (alphabetical)
import '../../core/config/app_config.dart';  // Project imports by layer
import '../widgets/custom_button.dart';  // Relative imports last

// 2. Naming conventions
class DailyReportScreen {}  // PascalCase for classes
final authProvider = StateNotifierProvider();  // camelCase for providers
void submitReport() {}  // camelCase for functions
const String apiBaseUrl = '';  // camelCase for constants

// 3. File naming
// daily_report_screen.dart  // snake_case for files
```

#### 1.3 Architecture Compliance
```markdown
When generating code, ensure:
1. Separation of concerns across layers
2. Dependencies flow inward (presentation → domain → data)
3. Use cases encapsulate business logic
4. Repositories abstract data sources
5. Models vs Entities distinction maintained
```

### 2. Problem-Solving Protocol

#### 2.1 Issue Analysis Framework
```markdown
When addressing issues:
1. Gather context:
   - What feature/screen is affected?
   - What is the expected behavior?
   - What is the actual behavior?
   - Any error messages?

2. Check documentation:
   - Is this a known issue? (Bug_Tracking.md)
   - Are there similar implementations?
   - What does the architecture dictate?

3. Propose solution:
   - Align with existing patterns
   - Consider offline implications
   - Maintain backward compatibility
   - Include test considerations
```

#### 2.2 Debugging Assistance
```markdown
Guide debugging with:
1. Systematic approach:
   - Isolate the problem
   - Check logs (app and system)
   - Verify data flow
   - Test offline/online states

2. Common Flutter/Mobile issues:
   - State management problems
   - Async/await issues
   - Platform-specific bugs
   - Memory leaks
   - Performance bottlenecks
```

### 3. Feature Implementation Protocol

#### 3.1 Implementation Planning
```markdown
For new features:
1. Review requirements in PRD.md
2. Check UI/UX specifications
3. Plan architecture:
   - Required entities/models
   - Use cases needed
   - Repository methods
   - State management approach
   - UI components

4. Consider edge cases:
   - Offline behavior
   - Error scenarios
   - Data validation
   - Performance impact
```

#### 3.2 Code Examples
Always provide complete, contextual examples:

```dart
// BAD: Incomplete example
onPressed: () => submitReport(),

// GOOD: Complete with context and error handling
ElevatedButton(
  onPressed: () async {
    try {
      // Show loading
      ref.read(loadingProvider.notifier).state = true;
      
      // Submit report
      await ref.read(dailyReportProvider.notifier).submitReport();
      
      // Show success
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Report submitted successfully')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      // Handle error
      if (mounted) {
        showDialog(
          context: context,
          builder: (_) => AlertDialog(
            title: Text('Submission Failed'),
            content: Text('Failed to submit report. It will be synced when online.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('OK'),
              ),
            ],
          ),
        );
      }
    } finally {
      ref.read(loadingProvider.notifier).state = false;
    }
  },
  child: Text('SUBMIT REPORT'),
)
```

### 4. Testing Guidance Protocol

#### 4.1 Test Suggestions
```markdown
For each implementation, suggest tests:
1. Unit tests for:
   - Use cases
   - Repositories
   - Utilities
   - State management

2. Widget tests for:
   - UI components
   - User interactions
   - State changes

3. Integration tests for:
   - Complete flows
   - Offline/online transitions
   - Data persistence
```

#### 4.2 Test Code Structure
```dart
// Always provide structured test examples:
void main() {
  group('DailyReportSubmission', () {
    late MockDailyReportRepository mockRepository;
    late SubmitDailyReportUseCase useCase;
    
    setUp(() {
      mockRepository = MockDailyReportRepository();
      useCase = SubmitDailyReportUseCase(mockRepository);
    });
    
    test('should save report locally when offline', () async {
      // Arrange
      when(mockRepository.isOnline()).thenAnswer((_) async => false);
      final report = DailyReport(/* ... */);
      
      // Act
      final result = await useCase.execute(report);
      
      // Assert
      expect(result.isSuccess, true);
      verify(mockRepository.saveLocal(report)).called(1);
      verifyNever(mockRepository.syncToServer(any));
    });
  });
}
```

### 5. Documentation Protocol

#### 5.1 Code Documentation
```dart
/// Submits a daily report to the server or queues it for sync.
/// 
/// This method will:
/// 1. Validate the report data
/// 2. Save to local database
/// 3. Attempt sync if online
/// 4. Queue for later sync if offline
/// 
/// Throws:
/// - [ValidationException] if report data is invalid
/// - [StorageException] if local save fails
Future<void> submitDailyReport(DailyReport report) async {
  // Implementation
}
```

#### 5.2 README Updates
When implementing features, suggest README content:
```markdown
# Feature: [Feature Name]

## Overview
[Brief description of the feature]

## Architecture
- **Use Cases**: List of use cases
- **Repositories**: Data access methods
- **State Management**: How state is managed

## Offline Behavior
[How the feature works offline]

## Testing
- Unit test coverage: X%
- Integration tests: [List key tests]

## Known Issues
[Any limitations or pending items]
```

### 6. State Management Protocol

#### 6.1 Riverpod Best Practices
```dart
// Suggest proper provider patterns:

// 1. Feature-specific providers
final dailyReportProvider = StateNotifierProvider<DailyReportNotifier, DailyReportState>((ref) {
  return DailyReportNotifier(
    repository: ref.watch(dailyReportRepositoryProvider),
    syncService: ref.watch(syncServiceProvider),
  );
});

// 2. Computed providers
final pendingReportsCountProvider = Provider<int>((ref) {
  final reports = ref.watch(dailyReportProvider);
  return reports.where((r) => !r.isSynced).length;
});

// 3. Family providers for parameters
final reportByIdProvider = Provider.family<DailyReport?, String>((ref, id) {
  final reports = ref.watch(dailyReportProvider);
  return reports.firstWhereOrNull((r) => r.id == id);
});
```

### 7. Performance Optimization Protocol

#### 7.1 Performance Considerations
Always consider:
```markdown
1. Image optimization:
   - Compress before upload
   - Lazy load images
   - Cache appropriately

2. List performance:
   - Use ListView.builder for long lists
   - Implement pagination
   - Optimize item widgets

3. State updates:
   - Minimize rebuilds
   - Use selective watching
   - Implement proper disposal

4. Memory management:
   - Dispose controllers
   - Clear caches when needed
   - Monitor memory usage
```

### 8. Error Handling Protocol

#### 8.1 Comprehensive Error Handling
```dart
// Suggest robust error handling:
class ReportService {
  Future<Result<DailyReport>> submitReport(DailyReport report) async {
    try {
      // Validate
      final validation = _validateReport(report);
      if (validation.hasErrors) {
        return Result.failure(ValidationFailure(validation.errors));
      }
      
      // Save locally
      final localSave = await _saveLocally(report);
      if (localSave.isFailure) {
        return Result.failure(StorageFailure('Failed to save locally'));
      }
      
      // Try sync
      if (await _isOnline()) {
        final syncResult = await _syncToServer(report);
        if (syncResult.isFailure) {
          // Queue for later sync
          await _queueForSync(report);
          return Result.success(
            report.copyWith(
              syncStatus: SyncStatus.pending,
              syncError: syncResult.error,
            ),
          );
        }
      } else {
        await _queueForSync(report);
      }
      
      return Result.success(report);
      
    } catch (e, stack) {
      // Log error
      logger.e('Failed to submit report', e, stack);
      return Result.failure(UnknownFailure(e.toString()));
    }
  }
}
```

## 🚀 Quick Reference

### Common Tasks Quick Helpers

#### 1. Creating a New Screen
```markdown
1. Check UI_UX.md for design specs
2. Create in features/[feature]/presentation/screens/
3. Follow existing screen patterns
4. Include proper error and loading states
5. Implement offline support
6. Add navigation in app_router.dart
7. Write widget tests
```

#### 2. Adding a New API Endpoint
```markdown
1. Add to data/remote/apis/
2. Create corresponding repository method
3. Implement offline fallback
4. Add to sync queue if needed
5. Update error handling
6. Document in API_Documentation.md
```

#### 3. Implementing Offline Feature
```markdown
1. Design local database schema
2. Create Drift table/DAO
3. Implement local repository
4. Add sync queue logic
5. Handle conflict resolution
6. Test offline/online transitions
```

## 📋 Response Templates

### For Code Reviews
```markdown
## Code Review Feedback

### ✅ Strengths
- [Positive aspects]

### 🔧 Suggestions
1. **[Category]**: [Specific suggestion with example]
2. **[Category]**: [Specific suggestion with example]

### ⚠️ Concerns
- [Any architectural or performance concerns]

### 📚 References
- [Link to relevant documentation]
```

### For Implementation Guidance
```markdown
## Implementation Guide: [Feature Name]

### 📋 Requirements Review
Based on PRD.md, this feature requires:
- [List key requirements]

### 🏗️ Architecture Plan
1. **Domain Layer**:
   - Entities: [List]
   - Use Cases: [List]

2. **Data Layer**:
   - Models: [List]
   - Repository Implementation

3. **Presentation Layer**:
   - Screens: [List]
   - State Management: [Approach]

### 💻 Implementation Steps
1. [Step with code example]
2. [Step with code example]

### 🧪 Testing Strategy
- Unit tests for: [List]
- Widget tests for: [List]
- Integration test scenarios: [List]

### ⚡ Performance Considerations
- [Specific optimizations needed]

### 📱 Offline Behavior
- [How feature works offline]
```

## 🔄 Continuous Learning

### Stay Updated With
1. Project documentation changes
2. New patterns introduced
3. Bug reports and solutions
4. Performance metrics
5. User feedback

### Improve Responses By
1. Learning from past interactions
2. Noting recurring issues
3. Refining code examples
4. Updating outdated references
5. Suggesting process improvements

## 🎯 Success Metrics

Good assistance is measured by:
1. **Accuracy**: Solutions work first time
2. **Consistency**: Follows project patterns
3. **Completeness**: Includes error handling, tests, docs
4. **Performance**: Suggests optimized solutions
5. **Maintainability**: Code is clear and documented

---

Remember: Always prioritize **project consistency** and **offline-first functionality** in all suggestions and implementations.