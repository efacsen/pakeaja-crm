import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// Auth screens
import '../../features/auth/presentation/screens/login_screen.dart';

// Home screen
import '../../features/home/presentation/screens/home_screen.dart';

// Daily Reports screens
import '../../features/daily_reports/presentation/screens/daily_reports_list_screen.dart';
import '../../features/daily_reports/presentation/screens/create_report_screen.dart';

// Canvassing screens
import '../../features/canvassing/presentation/screens/quick_canvassing_screen.dart';

// Materials screens
import '../../features/materials/presentation/screens/materials_search_screen.dart';
import '../../features/materials/presentation/screens/material_detail_screen.dart';

// Profile screen
import '../../features/profile/presentation/screens/profile_screen.dart';

import '../providers/auth_provider.dart';
import 'main_navigation_screen.dart';

/// Application routes
abstract class AppRoutes {
  static const splash = '/';
  static const login = '/login';
  static const home = '/home';
  static const dailyReports = '/daily-reports';
  static const dailyReportsCreate = '/daily-reports/create';
  static const canvassing = '/canvassing';
  static const canvassingQuick = '/canvassing/quick-capture';
  static const materials = '/materials';
  static const materialDetail = '/materials/:id';
  static const profile = '/profile';
}

/// Global router configuration
final appRouterProvider = Provider<GoRouter>((ref) {
  final authNotifier = ref.read(authProvider.notifier);
  
  return GoRouter(
    initialLocation: AppRoutes.login,
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final isLoggedIn = authState.isAuthenticated;
      final isLoggingIn = state.location == AppRoutes.login;

      // If not logged in and not on login page, redirect to login
      if (!isLoggedIn && !isLoggingIn) {
        return AppRoutes.login;
      }

      // If logged in and on login page, redirect to home
      if (isLoggedIn && isLoggingIn) {
        return AppRoutes.home;
      }

      return null;
    },
    routes: [
      // Auth routes
      GoRoute(
        path: AppRoutes.login,
        builder: (context, state) => const LoginScreen(),
      ),

      // Main app with bottom navigation
      ShellRoute(
        builder: (context, state, child) => MainNavigationScreen(child: child),
        routes: [
          // Home
          GoRoute(
            path: AppRoutes.home,
            builder: (context, state) => const HomeScreen(),
          ),

          // Daily Reports
          GoRoute(
            path: AppRoutes.dailyReports,
            builder: (context, state) => const DailyReportsListScreen(),
            routes: [
              GoRoute(
                path: 'create',
                builder: (context, state) => const CreateReportScreen(),
              ),
            ],
          ),

          // Canvassing
          GoRoute(
            path: AppRoutes.canvassing,
            builder: (context, state) => const QuickCanvassingScreen(),
            routes: [
              GoRoute(
                path: 'quick-capture',
                builder: (context, state) => const QuickCanvassingScreen(),
              ),
            ],
          ),

          // Materials
          GoRoute(
            path: AppRoutes.materials,
            builder: (context, state) => const MaterialsSearchScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (context, state) {
                  final materialId = state.pathParameters['id']!;
                  return MaterialDetailScreen(materialId: materialId);
                },
              ),
            ],
          ),

          // Profile
          GoRoute(
            path: AppRoutes.profile,
            builder: (context, state) => const ProfileScreen(),
          ),
        ],
      ),
    ],
  );
});

/// Convenience provider for accessing the router
final routerProvider = Provider<GoRouter>((ref) => ref.watch(appRouterProvider));