import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Secure storage instance provider
final secureStorageProvider = Provider<FlutterSecureStorage>((ref) {
  return const FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );
});

// Secure storage keys
class SecureStorageKeys {
  static const String authToken = 'auth_token';
  static const String refreshToken = 'refresh_token';
  static const String supabaseSession = 'supabase_session';
  static const String encryptionKey = 'encryption_key';
}

// Helper methods extension
extension SecureStorageX on FlutterSecureStorage {
  Future<void> saveTokens({
    required String authToken,
    String? refreshToken,
  }) async {
    await write(key: SecureStorageKeys.authToken, value: authToken);
    if (refreshToken != null) {
      await write(key: SecureStorageKeys.refreshToken, value: refreshToken);
    }
  }

  Future<void> clearTokens() async {
    await delete(key: SecureStorageKeys.authToken);
    await delete(key: SecureStorageKeys.refreshToken);
  }

  Future<String?> getAuthToken() async {
    return read(key: SecureStorageKeys.authToken);
  }

  Future<String?> getRefreshToken() async {
    return read(key: SecureStorageKeys.refreshToken);
  }
}