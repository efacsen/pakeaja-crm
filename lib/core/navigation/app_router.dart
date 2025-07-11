import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/home/presentation/screens/home_screen.dart';
import '../../features/daily_reports/presentation/screens/daily_reports_screen.dart';
import '../../features/canvassing/presentation/screens/canvassing_screen.dart';
import '../../features/materials/presentation/screens/materials_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../providers/auth_provider.dart';
import 'main_navigation_screen.dart';

/// Application routes
abstract class AppRoutes {
  static const splash = '/';
  static const login = '/login';
  static const home = '/home';
  static const dailyReports = '/daily-reports';
  static const canvassing = '/canvassing';
  static const materials = '/materials';
  static const profile = '/profile';
  
  // Sub-routes
  static const dailyReportDetail = '/daily-reports/:id';
  static const dailyReportCreate = '/daily-reports/create';
  static const canvassingDetail = '/canvassing/:id';
  static const canvassingCreate = '/canvassing/create';
  static const materialDetail = '/materials/:id';
}

/// Router provider
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);
  
  return GoRouter(
    initialLocation: AppRoutes.splash,
    debugLogDiagnostics: true,
    refreshListenable: authState,
    redirect: (context, state) {
      final isAuthenticated = authState.isAuthenticated;
      final isAuthRoute = state.matchedLocation == AppRoutes.login ||
                         state.matchedLocation == AppRoutes.splash;
      
      // If not authenticated and trying to access protected route
      if (!isAuthenticated && !isAuthRoute) {
        return AppRoutes.login;
      }
      
      // If authenticated and trying to access auth route
      if (isAuthenticated && isAuthRoute) {
        return AppRoutes.home;
      }
      
      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.splash,
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      ShellRoute(
        builder: (context, state, child) => MainNavigationScreen(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.home,
            name: 'home',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: HomeScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.dailyReports,
            name: 'dailyReports',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: DailyReportsScreen(),
            ),
            routes: [
              // TODO: Uncomment when screens are implemented
              // GoRoute(
              //   path: 'create',
              //   name: 'dailyReportCreate',
              //   builder: (context, state) => const DailyReportCreateScreen(),
              // ),
              // GoRoute(
              //   path: ':id',
              //   name: 'dailyReportDetail',
              //   builder: (context, state) {
              //     final id = state.pathParameters['id']!;
              //     return DailyReportDetailScreen(reportId: id);
              //   },
              // ),
            ],
          ),
          GoRoute(
            path: AppRoutes.canvassing,
            name: 'canvassing',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: CanvassingScreen(),
            ),
            routes: [
              // TODO: Uncomment when screens are implemented
              // GoRoute(
              //   path: 'create',
              //   name: 'canvassingCreate',
              //   builder: (context, state) => const CanvassingCreateScreen(),
              // ),
              // GoRoute(
              //   path: ':id',
              //   name: 'canvassingDetail',
              //   builder: (context, state) {
              //     final id = state.pathParameters['id']!;
              //     return CanvassingDetailScreen(customerId: id);
              //   },
              // ),
            ],
          ),
          GoRoute(
            path: AppRoutes.materials,
            name: 'materials',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: MaterialsScreen(),
            ),
            routes: [
              // TODO: Uncomment when screens are implemented
              // GoRoute(
              //   path: ':id',
              //   name: 'materialDetail',
              //   builder: (context, state) {
              //     final id = state.pathParameters['id']!;
              //     return MaterialDetailScreen(materialId: id);
              //   },
              // ),
            ],
          ),
          GoRoute(
            path: AppRoutes.profile,
            name: 'profile',
            pageBuilder: (context, state) => const NoTransitionPage(
              child: ProfileScreen(),
            ),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => ErrorScreen(error: state.error),
  );
});

/// Splash screen widget
class SplashScreen extends ConsumerWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Check auth state on mount
    Future.microtask(() {
      ref.read(authStateProvider.notifier).checkAuthStatus();
    });
    
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.business_center,
              size: 80,
              color: Theme.of(context).colorScheme.primary,
            ),
            const SizedBox(height: 24),
            Text(
              'PakeAja CRM',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 48),
            const CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}

/// Error screen widget
class ErrorScreen extends StatelessWidget {
  final Exception? error;
  
  const ErrorScreen({super.key, this.error});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Error'),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              Text(
                'Oops! Something went wrong',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              Text(
                error?.toString() ?? 'An unknown error occurred',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go(AppRoutes.home),
                child: const Text('Go Home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}