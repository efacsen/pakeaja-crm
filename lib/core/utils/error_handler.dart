import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'bug_tracker.dart';
import '../providers/logger_provider.dart';

/// Global error handler for the app
class ErrorHandler {
  final Ref ref;
  
  ErrorHandler(this.ref);

  /// Handle Flutter errors
  void handleFlutterError(FlutterErrorDetails details) {
    final logger = ref.read(loggerProvider);
    logger.e('Flutter Error: ${details.exception}', error: details.exception, stackTrace: details.stack);
    
    // Log critical bugs automatically
    ref.read(bugTrackerProvider).reportBug(
      summary: 'Flutter Error: ${details.exception}',
      severity: BugSeverity.critical,
      featureArea: 'Framework',
      stepsToReproduce: ['Error occurred during runtime'],
      expectedBehavior: 'App should run without errors',
      actualBehavior: details.exception.toString(),
      additionalContext: details.context?.toString(),
      error: details.exception,
      stackTrace: details.stack,
    );

    // In debug mode, use Flutter's error handling
    if (kDebugMode) {
      FlutterError.presentError(details);
    }
  }

  /// Handle async errors
  void handleAsyncError(Object error, StackTrace stack) {
    final logger = ref.read(loggerProvider);
    logger.e('Async Error: $error', error: error, stackTrace: stack);
    
    // Determine severity based on error type
    BugSeverity severity = BugSeverity.high;
    String featureArea = 'General';
    
    if (error.toString().contains('NetworkException')) {
      severity = BugSeverity.medium;
      featureArea = 'Network';
    } else if (error.toString().contains('FormatException')) {
      severity = BugSeverity.medium;
      featureArea = 'Data Processing';
    } else if (error.toString().contains('DatabaseException')) {
      severity = BugSeverity.critical;
      featureArea = 'Database';
    }
    
    // Log bug automatically for critical errors
    if (severity == BugSeverity.critical || severity == BugSeverity.high) {
      ref.read(bugTrackerProvider).reportBug(
        summary: 'Async Error: ${error.runtimeType}',
        severity: severity,
        featureArea: featureArea,
        stepsToReproduce: ['Error occurred during async operation'],
        expectedBehavior: 'Operation should complete successfully',
        actualBehavior: error.toString(),
        error: error,
        stackTrace: stack,
      );
    }
  }

  /// Handle specific feature errors with context
  void handleFeatureError({
    required String feature,
    required String operation,
    required Object error,
    StackTrace? stack,
    String? userId,
    Map<String, dynamic>? context,
  }) {
    final logger = ref.read(loggerProvider);
    logger.e('Feature Error in $feature: $error', error: error, stackTrace: stack);
    
    // Determine severity
    BugSeverity severity = BugSeverity.medium;
    if (operation.contains('save') || operation.contains('sync')) {
      severity = BugSeverity.high;
    }
    
    ref.read(bugTrackerProvider).reportBug(
      summary: '$feature: $operation failed',
      severity: severity,
      featureArea: feature,
      stepsToReproduce: [
        'User performed: $operation',
        'Error occurred: ${error.runtimeType}',
      ],
      expectedBehavior: '$operation should complete successfully',
      actualBehavior: error.toString(),
      additionalContext: 'User: ${userId ?? "Unknown"}\nContext: ${context?.toString() ?? "None"}',
      error: error,
      stackTrace: stack,
    );
  }

  /// Log non-critical issues for monitoring
  void logIssue({
    required String summary,
    required String featureArea,
    String? details,
    Map<String, dynamic>? metrics,
  }) {
    final logger = ref.read(loggerProvider);
    logger.w('Issue: $summary - ${details ?? "No details"}');
    
    // Only log to bug tracker if it's recurring or significant
    if (metrics != null && (metrics['occurrences'] ?? 0) > 5) {
      ref.read(bugTrackerProvider).reportBug(
        summary: summary,
        severity: BugSeverity.low,
        featureArea: featureArea,
        stepsToReproduce: ['Issue detected through monitoring'],
        expectedBehavior: 'System should operate normally',
        actualBehavior: details ?? summary,
        additionalContext: 'Metrics: ${metrics.toString()}',
      );
    }
  }
}

/// Error handler provider
final errorHandlerProvider = Provider<ErrorHandler>((ref) {
  return ErrorHandler(ref);
});

/// Extension for easy error handling
extension ErrorHandlerX on WidgetRef {
  ErrorHandler get errorHandler => read(errorHandlerProvider);
}