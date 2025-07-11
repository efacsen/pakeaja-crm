import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Auth state notifier
class AuthStateNotifier extends ChangeNotifier {
  bool _isAuthenticated = false;
  bool _isLoading = true;
  String? _userId;
  String? _userEmail;

  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get userId => _userId;
  String? get userEmail => _userEmail;

  /// Check authentication status on app start
  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // Simulate checking stored auth token
      await Future.delayed(const Duration(seconds: 2));
      
      // TODO: Check actual auth status from secure storage
      _isAuthenticated = false;
      _userId = null;
      _userEmail = null;
    } catch (e) {
      debugPrint('Error checking auth status: $e');
      _isAuthenticated = false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Login user
  Future<void> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // TODO: Implement actual login logic
      await Future.delayed(const Duration(seconds: 1));
      
      _isAuthenticated = true;
      _userId = 'user123';
      _userEmail = email;
    } catch (e) {
      _isAuthenticated = false;
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Logout user
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // TODO: Clear stored auth token
      await Future.delayed(const Duration(milliseconds: 500));
      
      _isAuthenticated = false;
      _userId = null;
      _userEmail = null;
    } catch (e) {
      debugPrint('Error during logout: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}

/// Auth state provider
final authStateProvider = ChangeNotifierProvider<AuthStateNotifier>((ref) {
  return AuthStateNotifier();
});