import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/app_database.dart';

// Re-export existing providers
export 'auth_provider.dart';
export 'connectivity_provider.dart';
export 'database_provider.dart';
export 'dio_provider.dart';
export 'logger_provider.dart';
export 'secure_storage_provider.dart';
export 'shared_preferences_provider.dart';
export 'supabase_provider.dart';

// Core database provider - ensure single instance across all modules
final appDatabaseProvider = Provider<AppDatabase>((ref) {
  // Use the existing database provider
  return ref.watch(databaseProvider);
});

// Location service provider (will be shared by canvassing and other modules)
final locationServiceProvider = Provider<LocationService>((ref) {
  throw UnimplementedError('LocationService will be imported from canvassing module');
});

// Photo service provider (will be shared across modules)
final photoServiceProvider = Provider<PhotoService>((ref) {
  throw UnimplementedError('PhotoService will be imported from canvassing module');
});

// Placeholder for sync service (will come from sync module)
final syncServiceProvider = Provider<SyncService>((ref) {
  throw UnimplementedError('SyncService will be imported from sync module');
});