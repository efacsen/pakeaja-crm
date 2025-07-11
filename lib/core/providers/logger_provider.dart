import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:logger/logger.dart';

// Logger configuration
final loggerProvider = Provider<Logger>((ref) {
  return Logger(
    printer: PrettyPrinter(
      methodCount: 2,
      errorMethodCount: 8,
      lineLength: 120,
      colors: true,
      printEmojis: true,
      printTime: true,
    ),
    level: Level.debug, // Change to Level.warning in production
  );
});

// Extension for easy logging
extension LoggerX on WidgetRef {
  Logger get logger => read(loggerProvider);
}