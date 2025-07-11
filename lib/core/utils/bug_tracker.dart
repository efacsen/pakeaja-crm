import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:intl/intl.dart';
import '../providers/logger_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Bug severity levels as defined in Bug_Tracking.md
enum BugSeverity {
  critical, // P0 - Immediate response
  high,     // P1 - Within 4 hours
  medium,   // P2 - Within 1 business day
  low       // P3 - Within 3 business days
}

/// Bug report model
class BugReport {
  final String id;
  final DateTime reportedDate;
  final String reporter;
  final BugSeverity severity;
  final String featureArea;
  final String deviceInfo;
  final String appVersion;
  final String summary;
  final List<String> stepsToReproduce;
  final String expectedBehavior;
  final String actualBehavior;
  final String? additionalContext;
  final String? errorMessage;
  final String? stackTrace;

  BugReport({
    required this.id,
    required this.reportedDate,
    required this.reporter,
    required this.severity,
    required this.featureArea,
    required this.deviceInfo,
    required this.appVersion,
    required this.summary,
    required this.stepsToReproduce,
    required this.expectedBehavior,
    required this.actualBehavior,
    this.additionalContext,
    this.errorMessage,
    this.stackTrace,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'reportedDate': reportedDate.toIso8601String(),
    'reporter': reporter,
    'severity': severity.name,
    'featureArea': featureArea,
    'deviceInfo': deviceInfo,
    'appVersion': appVersion,
    'summary': summary,
    'stepsToReproduce': stepsToReproduce,
    'expectedBehavior': expectedBehavior,
    'actualBehavior': actualBehavior,
    'additionalContext': additionalContext,
    'errorMessage': errorMessage,
    'stackTrace': stackTrace,
  };

  String toMarkdown() {
    final formatter = DateFormat('yyyy-MM-dd');
    return '''
### Bug Report #$id

**Date Reported**: ${formatter.format(reportedDate)}
**Reporter**: $reporter
**Severity**: ${severity.name.toUpperCase()}
**Feature Area**: $featureArea
**Device**: $deviceInfo
**App Version**: $appVersion

#### Summary
$summary

#### Steps to Reproduce
${stepsToReproduce.asMap().entries.map((e) => '${e.key + 1}. ${e.value}').join('\n')}

#### Expected Behavior
$expectedBehavior

#### Actual Behavior
$actualBehavior

${additionalContext != null ? '''
#### Additional Context
$additionalContext
''' : ''}

${errorMessage != null ? '''
#### Error Message
```
$errorMessage
```
''' : ''}

${stackTrace != null ? '''
#### Stack Trace
```
$stackTrace
```
''' : ''}
---
''';
  }
}

/// Bug tracker service
class BugTracker {
  final Ref ref;
  static const String _bugLogFileName = 'bug_log.md';
  
  BugTracker(this.ref);

  /// Get the bug log file path
  Future<String> get _bugLogPath async {
    final directory = await getApplicationDocumentsDirectory();
    return '${directory.path}/$_bugLogFileName';
  }

  /// Log a bug report
  Future<void> logBug(BugReport report) async {
    final logger = ref.read(loggerProvider);
    
    try {
      // Log to console
      logger.e('Bug Report: ${report.summary}', error: report.errorMessage);
      
      // Write to bug log file
      final file = File(await _bugLogPath);
      final exists = await file.exists();
      
      if (!exists) {
        // Create file with header
        await file.writeAsString('''
# PakeAja CRM Mobile App - Bug Log

This file contains all bug reports logged during app runtime.
For bug tracking workflow and severity classifications, see docs/Bug_Tracking.md

---

''');
      }
      
      // Append bug report
      await file.writeAsString(
        report.toMarkdown(),
        mode: FileMode.append,
      );
      
      // In debug mode, also print to console
      if (kDebugMode) {
        print('Bug logged: ${report.summary}');
        print('Severity: ${report.severity.name}');
        print('Log file: ${await _bugLogPath}');
      }
      
    } catch (e) {
      logger.e('Failed to log bug report', error: e);
    }
  }

  /// Report a bug with builder pattern
  Future<void> reportBug({
    required String summary,
    required BugSeverity severity,
    required String featureArea,
    required List<String> stepsToReproduce,
    required String expectedBehavior,
    required String actualBehavior,
    String? reporter,
    String? additionalContext,
    dynamic error,
    StackTrace? stackTrace,
  }) async {
    final report = BugReport(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      reportedDate: DateTime.now(),
      reporter: reporter ?? 'System',
      severity: severity,
      featureArea: featureArea,
      deviceInfo: _getDeviceInfo(),
      appVersion: _getAppVersion(),
      summary: summary,
      stepsToReproduce: stepsToReproduce,
      expectedBehavior: expectedBehavior,
      actualBehavior: actualBehavior,
      additionalContext: additionalContext,
      errorMessage: error?.toString(),
      stackTrace: stackTrace?.toString(),
    );
    
    await logBug(report);
  }

  /// Get device information
  String _getDeviceInfo() {
    if (kIsWeb) {
      return 'Web Browser';
    } else if (Platform.isAndroid) {
      return 'Android ${Platform.operatingSystemVersion}';
    } else if (Platform.isIOS) {
      return 'iOS ${Platform.operatingSystemVersion}';
    } else {
      return '${Platform.operatingSystem} ${Platform.operatingSystemVersion}';
    }
  }

  /// Get app version (should be replaced with actual version)
  String _getAppVersion() {
    // TODO: Get from package_info_plus
    return '1.0.0';
  }

  /// Get all logged bugs
  Future<String?> getBugLog() async {
    try {
      final file = File(await _bugLogPath);
      if (await file.exists()) {
        return await file.readAsString();
      }
    } catch (e) {
      ref.read(loggerProvider).e('Failed to read bug log', error: e);
    }
    return null;
  }

  /// Clear bug log (use with caution)
  Future<void> clearBugLog() async {
    try {
      final file = File(await _bugLogPath);
      if (await file.exists()) {
        await file.delete();
      }
    } catch (e) {
      ref.read(loggerProvider).e('Failed to clear bug log', error: e);
    }
  }

  /// Export bug log to share
  Future<File?> exportBugLog() async {
    try {
      final sourceFile = File(await _bugLogPath);
      if (await sourceFile.exists()) {
        final directory = await getTemporaryDirectory();
        final timestamp = DateFormat('yyyyMMdd_HHmmss').format(DateTime.now());
        final exportPath = '${directory.path}/bug_log_export_$timestamp.md';
        return await sourceFile.copy(exportPath);
      }
    } catch (e) {
      ref.read(loggerProvider).e('Failed to export bug log', error: e);
    }
    return null;
  }
}

/// Bug tracker provider
final bugTrackerProvider = Provider<BugTracker>((ref) {
  return BugTracker(ref);
});

/// Extension for easy bug reporting
extension BugTrackerX on WidgetRef {
  BugTracker get bugTracker => read(bugTrackerProvider);
}