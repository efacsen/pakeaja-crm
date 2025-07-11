import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/bug_tracker.dart';

/// Dialog for users to report bugs
class BugReportDialog extends ConsumerStatefulWidget {
  final String? prefilledFeatureArea;
  final String? prefilledError;
  
  const BugReportDialog({
    super.key,
    this.prefilledFeatureArea,
    this.prefilledError,
  });

  static Future<void> show(
    BuildContext context, {
    String? featureArea,
    String? error,
  }) async {
    return showDialog(
      context: context,
      builder: (context) => BugReportDialog(
        prefilledFeatureArea: featureArea,
        prefilledError: error,
      ),
    );
  }

  @override
  ConsumerState<BugReportDialog> createState() => _BugReportDialogState();
}

class _BugReportDialogState extends ConsumerState<BugReportDialog> {
  final _formKey = GlobalKey<FormState>();
  final _summaryController = TextEditingController();
  final _stepsController = TextEditingController();
  final _expectedController = TextEditingController();
  final _actualController = TextEditingController();
  final _additionalController = TextEditingController();
  
  BugSeverity _selectedSeverity = BugSeverity.medium;
  String _featureArea = 'General';
  bool _isSubmitting = false;

  final List<String> _featureAreas = [
    'General',
    'Auth',
    'Daily Reports',
    'Canvassing',
    'Materials',
    'Sync',
    'UI/UX',
    'Performance',
    'Other',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.prefilledFeatureArea != null) {
      _featureArea = widget.prefilledFeatureArea!;
    }
    if (widget.prefilledError != null) {
      _actualController.text = widget.prefilledError!;
    }
  }

  @override
  void dispose() {
    _summaryController.dispose();
    _stepsController.dispose();
    _expectedController.dispose();
    _actualController.dispose();
    _additionalController.dispose();
    super.dispose();
  }

  Future<void> _submitBugReport() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    try {
      // Parse steps to reproduce (split by newlines)
      final steps = _stepsController.text
          .split('\n')
          .where((s) => s.trim().isNotEmpty)
          .toList();

      await ref.read(bugTrackerProvider).reportBug(
        summary: _summaryController.text,
        severity: _selectedSeverity,
        featureArea: _featureArea,
        stepsToReproduce: steps,
        expectedBehavior: _expectedController.text,
        actualBehavior: _actualController.text,
        additionalContext: _additionalController.text.isEmpty 
            ? null 
            : _additionalController.text,
        reporter: 'User',
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Bug report submitted successfully'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to submit bug report: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Report a Bug'),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Summary
              TextFormField(
                controller: _summaryController,
                decoration: const InputDecoration(
                  labelText: 'Summary*',
                  hintText: 'Brief description of the issue',
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please provide a summary';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Severity
              DropdownButtonFormField<BugSeverity>(
                value: _selectedSeverity,
                decoration: const InputDecoration(
                  labelText: 'Severity',
                ),
                items: BugSeverity.values.map((severity) {
                  String label;
                  IconData icon;
                  Color color;
                  
                  switch (severity) {
                    case BugSeverity.critical:
                      label = 'Critical - App unusable';
                      icon = Icons.error;
                      color = Colors.red;
                      break;
                    case BugSeverity.high:
                      label = 'High - Major feature broken';
                      icon = Icons.warning;
                      color = Colors.orange;
                      break;
                    case BugSeverity.medium:
                      label = 'Medium - Minor feature issue';
                      icon = Icons.info;
                      color = Colors.yellow[700]!;
                      break;
                    case BugSeverity.low:
                      label = 'Low - Cosmetic issue';
                      icon = Icons.info_outline;
                      color = Colors.green;
                      break;
                  }
                  
                  return DropdownMenuItem(
                    value: severity,
                    child: Row(
                      children: [
                        Icon(icon, size: 20, color: color),
                        const SizedBox(width: 8),
                        Text(label),
                      ],
                    ),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _selectedSeverity = value);
                  }
                },
              ),
              const SizedBox(height: 16),

              // Feature Area
              DropdownButtonFormField<String>(
                value: _featureArea,
                decoration: const InputDecoration(
                  labelText: 'Feature Area',
                ),
                items: _featureAreas.map((area) {
                  return DropdownMenuItem(
                    value: area,
                    child: Text(area),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    setState(() => _featureArea = value);
                  }
                },
              ),
              const SizedBox(height: 16),

              // Steps to Reproduce
              TextFormField(
                controller: _stepsController,
                decoration: const InputDecoration(
                  labelText: 'Steps to Reproduce*',
                  hintText: 'Enter each step on a new line',
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please provide steps to reproduce';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Expected Behavior
              TextFormField(
                controller: _expectedController,
                decoration: const InputDecoration(
                  labelText: 'Expected Behavior*',
                  hintText: 'What should happen?',
                ),
                maxLines: 2,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please describe expected behavior';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Actual Behavior
              TextFormField(
                controller: _actualController,
                decoration: const InputDecoration(
                  labelText: 'Actual Behavior*',
                  hintText: 'What actually happens?',
                ),
                maxLines: 2,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please describe actual behavior';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Additional Context
              TextFormField(
                controller: _additionalController,
                decoration: const InputDecoration(
                  labelText: 'Additional Context (Optional)',
                  hintText: 'Any other relevant information',
                ),
                maxLines: 2,
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: _isSubmitting ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _isSubmitting ? null : _submitBugReport,
          child: _isSubmitting
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Submit'),
        ),
      ],
    );
  }
}