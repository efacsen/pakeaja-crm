import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';
import '../utils/bug_tracker.dart';
import '../utils/error_handler.dart';
import 'bug_report_dialog.dart';

/// Debug menu for development and testing
class DebugMenu extends ConsumerWidget {
  const DebugMenu({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => const DebugMenu(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.bug_report, size: 24),
              const SizedBox(width: 8),
              Text(
                'Debug Menu',
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ],
          ),
          const Divider(),
          
          // Report Bug
          ListTile(
            leading: const Icon(Icons.report_problem),
            title: const Text('Report a Bug'),
            subtitle: const Text('Submit a bug report'),
            onTap: () {
              Navigator.pop(context);
              BugReportDialog.show(context);
            },
          ),
          
          // View Bug Log
          ListTile(
            leading: const Icon(Icons.description),
            title: const Text('View Bug Log'),
            subtitle: const Text('See all logged bugs'),
            onTap: () async {
              Navigator.pop(context);
              final bugLog = await ref.read(bugTrackerProvider).getBugLog();
              if (context.mounted) {
                _showBugLog(context, bugLog);
              }
            },
          ),
          
          // Export Bug Log
          ListTile(
            leading: const Icon(Icons.share),
            title: const Text('Export Bug Log'),
            subtitle: const Text('Share bug log file'),
            onTap: () async {
              Navigator.pop(context);
              final file = await ref.read(bugTrackerProvider).exportBugLog();
              if (file != null && context.mounted) {
                await Share.shareXFiles(
                  [XFile(file.path)],
                  subject: 'PakeAja CRM Bug Log',
                );
              }
            },
          ),
          
          // Clear Bug Log
          ListTile(
            leading: const Icon(Icons.delete_outline, color: Colors.red),
            title: const Text('Clear Bug Log'),
            subtitle: const Text('Delete all bug reports'),
            onTap: () async {
              Navigator.pop(context);
              final confirm = await _showConfirmDialog(context);
              if (confirm == true && context.mounted) {
                await ref.read(bugTrackerProvider).clearBugLog();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Bug log cleared')),
                );
              }
            },
          ),
          
          // Trigger Test Error
          ListTile(
            leading: const Icon(Icons.warning, color: Colors.orange),
            title: const Text('Trigger Test Error'),
            subtitle: const Text('Generate a test bug report'),
            onTap: () async {
              Navigator.pop(context);
              try {
                throw Exception('This is a test error for bug tracking');
              } catch (e, stack) {
                ref.read(errorHandlerProvider).handleFeatureError(
                  feature: 'Debug Menu',
                  operation: 'Test Error',
                  error: e,
                  stack: stack,
                  context: {'source': 'manual_trigger'},
                );
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Test error logged to bug tracker'),
                      backgroundColor: Colors.orange,
                    ),
                  );
                }
              }
            },
          ),
          
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  void _showBugLog(BuildContext context, String? bugLog) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            const Text('Bug Log'),
            const Spacer(),
            IconButton(
              icon: const Icon(Icons.copy),
              onPressed: () {
                if (bugLog != null) {
                  Clipboard.setData(ClipboardData(text: bugLog));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Bug log copied to clipboard')),
                  );
                }
              },
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Text(
            bugLog ?? 'No bugs logged yet',
            style: const TextStyle(fontSize: 12, fontFamily: 'monospace'),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Future<bool?> _showConfirmDialog(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Bug Log?'),
        content: const Text(
          'This will permanently delete all bug reports. This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }
}