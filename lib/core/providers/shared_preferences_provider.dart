import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

// SharedPreferences instance provider
final sharedPreferencesProvider = Provider<SharedPreferences>((ref) {
  throw UnimplementedError('SharedPreferences not initialized');
});

// Initialize SharedPreferences
Future<void> initializeSharedPreferences(ProviderContainer container) async {
  final prefs = await SharedPreferences.getInstance();
  container.updateOverrides([
    sharedPreferencesProvider.overrideWithValue(prefs),
  ]);
}

// Helper providers for common preferences
final isFirstLaunchProvider = Provider<bool>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  return prefs.getBool('isFirstLaunch') ?? true;
});

final lastSyncDateProvider = Provider<DateTime?>((ref) {
  final prefs = ref.watch(sharedPreferencesProvider);
  final timestamp = prefs.getInt('lastSyncTimestamp');
  return timestamp != null ? DateTime.fromMillisecondsSinceEpoch(timestamp) : null;
});

// Preference keys
class PreferenceKeys {
  static const String isFirstLaunch = 'isFirstLaunch';
  static const String lastSyncTimestamp = 'lastSyncTimestamp';
  static const String userToken = 'userToken';
  static const String userId = 'userId';
  static const String userName = 'userName';
  static const String userEmail = 'userEmail';
  static const String userRole = 'userRole';
  static const String organizationId = 'organizationId';
  static const String selectedLanguage = 'selectedLanguage';
  static const String theme = 'theme';
}