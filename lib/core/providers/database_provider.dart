import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/app_database.dart';

// Database instance provider
final databaseProvider = Provider<AppDatabase>((ref) {
  final database = AppDatabase();
  
  // Ensure database is closed when the provider is disposed
  ref.onDispose(() {
    database.close();
  });
  
  return database;
});

// DAO providers
final usersDaoProvider = Provider((ref) {
  return ref.watch(databaseProvider).usersDao;
});

final syncQueueDaoProvider = Provider((ref) {
  return ref.watch(databaseProvider).syncQueueDao;
});