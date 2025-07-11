# 🛠️ PakeAja CRM Mobile App - Implementation Guide

## Overview

This guide provides a comprehensive technical implementation plan for the PakeAja CRM Mobile App using Flutter with Clean Architecture, focusing on offline-first functionality and git worktree-based parallel development.

## Architecture Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                  Presentation Layer                  │
│        (UI, Widgets, Controllers, States)           │
├─────────────────────────────────────────────────────┤
│                   Domain Layer                       │
│      (Use Cases, Entities, Repository Interfaces)   │
├─────────────────────────────────────────────────────┤
│                    Data Layer                        │
│  (Repositories, Data Sources, Models, Mappers)      │
├─────────────────────────────────────────────────────┤
│                 Infrastructure Layer                 │
│    (Database, Network, Storage, Device APIs)        │
└─────────────────────────────────────────────────────┘
```

### Technology Stack

```yaml
Framework: Flutter 3.16+ with Dart 3.2+
State Management: Riverpod 2.4+
Local Database: Drift (SQLite) 2.14+
Network: Dio 5.4+ with Retrofit
Backend Integration: Supabase Flutter SDK 2.0+
Dependency Injection: Riverpod
Navigation: go_router 13.0+
Storage: 
  - flutter_secure_storage (sensitive data)
  - shared_preferences (user preferences)
  - path_provider (file storage)
Forms: flutter_form_builder 9.1+
Image Handling: image_picker, flutter_image_compress
Location: geolocator 10.1+
Offline Sync: custom implementation with drift
Testing: flutter_test, mockito, integration_test
```

## Git Worktree Development Strategy

### Worktree Structure

```bash
pakeaja-crm/
├── mobile-app/                    # Main branch
├── mobile-app-auth/              # Feature: Authentication
├── mobile-app-daily-reports/     # Feature: Daily Reports
├── mobile-app-canvassing/        # Feature: Canvassing
├── mobile-app-sync/              # Feature: Offline Sync
├── mobile-app-materials/         # Feature: Materials Database
└── mobile-app-ui-components/     # Shared UI Components
```

### Setting Up Worktrees

```bash
# From the main repository
git worktree add -b feature/mobile-auth ../mobile-app-auth
git worktree add -b feature/mobile-daily-reports ../mobile-app-daily-reports
git worktree add -b feature/mobile-canvassing ../mobile-app-canvassing
git worktree add -b feature/mobile-sync ../mobile-app-sync
git worktree add -b feature/mobile-materials ../mobile-app-materials
git worktree add -b feature/mobile-ui-components ../mobile-app-ui-components
```

### Development Workflow

1. **Core Setup** (mobile-app)
   - Flutter project initialization
   - Base dependencies
   - Core architecture setup
   - Shared utilities

2. **Parallel Feature Development**
   - Each feature developed in isolation
   - Regular rebasing from main
   - Feature flags for integration
   - Automated testing per worktree

3. **Integration Strategy**
   ```bash
   # In feature worktree
   git fetch origin
   git rebase origin/main
   
   # After feature completion
   git push origin feature/mobile-auth
   
   # In main worktree
   git checkout main
   git merge --no-ff feature/mobile-auth
   ```

## Project Setup

### 1. Initialize Flutter Project

```bash
# In mobile-app worktree
flutter create --org com.pakeaja --project-name pakeaja_crm \
  --platforms android,ios --template app .

# Configure Flutter
flutter config --enable-android
flutter pub global activate flutterfire_cli
```

### 2. Core Dependencies

```yaml
# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  flutter_riverpod: ^2.4.9
  riverpod_annotation: ^2.3.3
  
  # Navigation
  go_router: ^13.0.1
  
  # Database
  drift: ^2.14.1
  sqlite3_flutter_libs: ^0.5.18
  path_provider: ^2.1.1
  path: ^1.8.3
  
  # Network
  dio: ^5.4.0
  retrofit: ^4.0.3
  supabase_flutter: ^2.3.0
  connectivity_plus: ^5.0.2
  
  # Storage
  flutter_secure_storage: ^9.0.0
  shared_preferences: ^2.2.2
  
  # UI Components
  flutter_form_builder: ^9.1.1
  form_builder_validators: ^9.1.0
  cached_network_image: ^3.3.1
  shimmer: ^3.0.0
  
  # Utilities
  intl: ^0.18.1
  equatable: ^2.0.5
  json_annotation: ^4.8.1
  freezed_annotation: ^2.4.1
  uuid: ^4.3.1
  
  # Device Features
  image_picker: ^1.0.7
  flutter_image_compress: ^2.1.0
  geolocator: ^10.1.0
  permission_handler: ^11.2.0
  
  # Development
  logger: ^2.0.2
  flutter_dotenv: ^5.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
  build_runner: ^2.4.7
  drift_dev: ^2.14.1
  retrofit_generator: ^8.0.6
  riverpod_generator: ^2.3.9
  freezed: ^2.4.6
  json_serializable: ^6.7.1
  mockito: ^5.4.4
  integration_test:
    sdk: flutter
```

### 3. Project Configuration

```dart
// lib/core/config/app_config.dart
class AppConfig {
  static const String appName = 'PakeAja CRM';
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://your-project.supabase.co',
  );
  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'your-anon-key',
  );
  
  // Sync Configuration
  static const Duration syncInterval = Duration(minutes: 5);
  static const int maxRetryAttempts = 3;
  static const Duration retryDelay = Duration(seconds: 30);
  
  // Storage Limits
  static const int maxPhotoSizeMB = 5;
  static const int maxPhotosPerReport = 5;
  static const int offlineDataRetentionDays = 7;
  
  // Performance
  static const int cacheSize = 100; // MB
  static const int dbConnectionPoolSize = 5;
}
```

## Core Implementation

### 1. Database Schema (Drift)

```dart
// lib/data/local/database/app_database.dart
import 'package:drift/drift.dart';
import 'package:drift/native.dart';

part 'app_database.g.dart';

// Daily Reports Table
class DailyReports extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get localId => text().clientDefault(() => Uuid().v4())();
  TextColumn get salesRepId => text()();
  DateTimeColumn get reportDate => dateTime()();
  IntColumn get visitsCount => integer().withDefault(const Constant(0))();
  IntColumn get callsCount => integer().withDefault(const Constant(0))();
  IntColumn get proposalsCount => integer().withDefault(const Constant(0))();
  TextColumn get summary => text().nullable()();
  TextColumn get planning => text().nullable()();
  TextColumn get status => text().withDefault(const Constant('draft'))();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
  TextColumn get syncError => text().nullable()();
  DateTimeColumn get createdAt => dateTime().clientDefault(() => DateTime.now())();
  DateTimeColumn get updatedAt => dateTime().clientDefault(() => DateTime.now())();
}

// Canvassing Reports Table
class CanvassingReports extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get localId => text().clientDefault(() => Uuid().v4())();
  TextColumn get salesRepId => text()();
  
  // Company Information
  TextColumn get companyName => text()();
  TextColumn get companyAddress => text().nullable()();
  TextColumn get contactPerson => text()();
  TextColumn get contactPosition => text()();
  TextColumn get contactPhone => text().nullable()();
  TextColumn get contactEmail => text().nullable()();
  
  // Visit Details
  DateTimeColumn get visitDate => dateTime()();
  TextColumn get visitOutcome => text()();
  TextColumn get priority => text().withDefault(const Constant('medium'))();
  
  // Potential
  TextColumn get potentialType => text()();
  RealColumn get potentialArea => real().nullable()();
  TextColumn get potentialMaterials => text().nullable()();
  RealColumn get potentialValue => real().nullable()();
  TextColumn get projectSegment => text()();
  
  // Follow-up
  TextColumn get nextAction => text().nullable()();
  DateTimeColumn get nextActionDate => dateTime().nullable()();
  TextColumn get notes => text().nullable()();
  
  // Location
  RealColumn get latitude => real().nullable()();
  RealColumn get longitude => real().nullable()();
  
  // Sync Status
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
  TextColumn get syncError => text().nullable()();
  DateTimeColumn get createdAt => dateTime().clientDefault(() => DateTime.now())();
}

// Sync Queue Table
class SyncQueue extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get entityType => text()(); // 'daily_report', 'canvassing', etc.
  TextColumn get entityId => text()(); // Local ID of the entity
  TextColumn get operation => text()(); // 'create', 'update', 'delete'
  TextColumn get payload => text()(); // JSON payload
  IntColumn get retryCount => integer().withDefault(const Constant(0))();
  TextColumn get status => text().withDefault(const Constant('pending'))();
  TextColumn get error => text().nullable()();
  DateTimeColumn get createdAt => dateTime().clientDefault(() => DateTime.now())();
  DateTimeColumn get scheduledAt => dateTime().clientDefault(() => DateTime.now())();
}

// Materials Table (Cached)
class Materials extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get materialId => text().unique()();
  TextColumn get name => text()();
  TextColumn get category => text()();
  TextColumn get segment => text()();
  TextColumn get unit => text()();
  RealColumn get coverage => real().nullable()();
  TextColumn get technicalSpecs => text().nullable()(); // JSON
  RealColumn get priceGuideline => real().nullable()();
  BoolColumn get isFavorite => boolean().withDefault(const Constant(false))();
  DateTimeColumn get lastUpdated => dateTime()();
}

@DriftDatabase(tables: [
  DailyReports,
  CanvassingReports,
  SyncQueue,
  Materials,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  static LazyDatabase _openConnection() {
    return LazyDatabase(() async {
      final dbFolder = await getApplicationDocumentsDirectory();
      final file = File(p.join(dbFolder.path, 'pakeaja_crm.sqlite'));
      return NativeDatabase.createInBackground(file);
    });
  }
}
```

### 2. Offline Sync Implementation

```dart
// lib/domain/services/sync_service.dart
abstract class SyncService {
  Stream<SyncStatus> get syncStatusStream;
  Future<void> syncAll();
  Future<void> syncDailyReports();
  Future<void> syncCanvassingReports();
  Future<void> syncMaterials();
  void pauseSync();
  void resumeSync();
}

// lib/data/services/sync_service_impl.dart
class SyncServiceImpl implements SyncService {
  final AppDatabase _database;
  final SupabaseClient _supabase;
  final ConnectivityService _connectivity;
  final Logger _logger;
  
  final _syncStatusController = StreamController<SyncStatus>.broadcast();
  Timer? _syncTimer;
  bool _isSyncing = false;
  
  @override
  Stream<SyncStatus> get syncStatusStream => _syncStatusController.stream;
  
  @override
  Future<void> syncAll() async {
    if (_isSyncing) return;
    
    try {
      _isSyncing = true;
      _syncStatusController.add(SyncStatus.syncing);
      
      // Check connectivity
      if (!await _connectivity.hasConnection) {
        _syncStatusController.add(SyncStatus.offline);
        return;
      }
      
      // Process sync queue
      await _processSyncQueue();
      
      // Download updates
      await _downloadUpdates();
      
      _syncStatusController.add(SyncStatus.completed);
    } catch (e) {
      _logger.e('Sync error', e);
      _syncStatusController.add(SyncStatus.error);
    } finally {
      _isSyncing = false;
    }
  }
  
  Future<void> _processSyncQueue() async {
    final queue = await _database.select(_database.syncQueue)
      .where((tbl) => tbl.status.equals('pending'))
      .orderBy([(tbl) => OrderingTerm.asc(tbl.createdAt)])
      .get();
    
    for (final item in queue) {
      try {
        await _processQueueItem(item);
        
        // Mark as completed
        await _database.update(_database.syncQueue).replace(
          item.copyWith(status: 'completed'),
        );
      } catch (e) {
        // Increment retry count
        final newRetryCount = item.retryCount + 1;
        
        if (newRetryCount >= AppConfig.maxRetryAttempts) {
          // Mark as failed
          await _database.update(_database.syncQueue).replace(
            item.copyWith(
              status: 'failed',
              error: e.toString(),
            ),
          );
        } else {
          // Schedule retry
          await _database.update(_database.syncQueue).replace(
            item.copyWith(
              retryCount: newRetryCount,
              scheduledAt: DateTime.now().add(
                AppConfig.retryDelay * newRetryCount,
              ),
            ),
          );
        }
      }
    }
  }
  
  Future<void> _processQueueItem(SyncQueueData item) async {
    final payload = json.decode(item.payload);
    
    switch (item.entityType) {
      case 'daily_report':
        await _syncDailyReport(item.entityId, payload);
        break;
      case 'canvassing':
        await _syncCanvassingReport(item.entityId, payload);
        break;
      default:
        throw Exception('Unknown entity type: ${item.entityType}');
    }
  }
}
```

### 3. Authentication Implementation

```dart
// lib/domain/repositories/auth_repository.dart
abstract class AuthRepository {
  Stream<AuthState> get authStateStream;
  Future<User?> getCurrentUser();
  Future<void> signIn(String email, String password);
  Future<void> signOut();
  Future<void> refreshToken();
  Future<bool> hasValidSession();
}

// lib/data/repositories/auth_repository_impl.dart
class AuthRepositoryImpl implements AuthRepository {
  final SupabaseClient _supabase;
  final FlutterSecureStorage _secureStorage;
  final StreamController<AuthState> _authStateController;
  
  static const _tokenKey = 'auth_token';
  static const _refreshTokenKey = 'refresh_token';
  
  @override
  Future<void> signIn(String email, String password) async {
    try {
      final response = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );
      
      if (response.session != null) {
        // Store tokens securely
        await _secureStorage.write(
          key: _tokenKey,
          value: response.session!.accessToken,
        );
        await _secureStorage.write(
          key: _refreshTokenKey,
          value: response.session!.refreshToken,
        );
        
        _authStateController.add(AuthState.authenticated(response.user!));
      }
    } on AuthException catch (e) {
      throw SignInException(e.message);
    }
  }
  
  @override
  Future<bool> hasValidSession() async {
    final token = await _secureStorage.read(key: _tokenKey);
    if (token == null) return false;
    
    try {
      final user = await _supabase.auth.getUser(token);
      return user != null;
    } catch (_) {
      return false;
    }
  }
}
```

### 4. Daily Reports Feature

```dart
// lib/features/daily_reports/presentation/screens/daily_report_screen.dart
class DailyReportScreen extends ConsumerStatefulWidget {
  @override
  ConsumerState<DailyReportScreen> createState() => _DailyReportScreenState();
}

class _DailyReportScreenState extends ConsumerState<DailyReportScreen> {
  final _formKey = GlobalKey<FormBuilderState>();
  
  @override
  Widget build(BuildContext context) {
    final reportState = ref.watch(dailyReportProvider);
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Daily Report'),
        actions: [
          IconButton(
            icon: Icon(Icons.drafts),
            onPressed: _showDrafts,
          ),
        ],
      ),
      body: FormBuilder(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16),
          children: [
            _buildDateSelector(),
            _buildActivitySection(),
            _buildSummarySection(),
            _buildPlanningSection(),
            SizedBox(height: 24),
            _buildActionButtons(),
          ],
        ),
      ),
    );
  }
  
  Widget _buildActivitySection() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Today\'s Activities',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            SizedBox(height: 16),
            FormBuilderTextField(
              name: 'visits_count',
              decoration: InputDecoration(
                labelText: 'Customer Visits',
                prefixIcon: Icon(Icons.business),
              ),
              keyboardType: TextInputType.number,
              validator: FormBuilderValidators.compose([
                FormBuilderValidators.required(),
                FormBuilderValidators.numeric(),
                FormBuilderValidators.min(0),
              ]),
            ),
            SizedBox(height: 12),
            FormBuilderTextField(
              name: 'calls_count',
              decoration: InputDecoration(
                labelText: 'Phone Calls',
                prefixIcon: Icon(Icons.phone),
              ),
              keyboardType: TextInputType.number,
              validator: FormBuilderValidators.compose([
                FormBuilderValidators.required(),
                FormBuilderValidators.numeric(),
                FormBuilderValidators.min(0),
              ]),
            ),
            SizedBox(height: 12),
            FormBuilderTextField(
              name: 'proposals_count',
              decoration: InputDecoration(
                labelText: 'Proposals Sent',
                prefixIcon: Icon(Icons.description),
              ),
              keyboardType: TextInputType.number,
              validator: FormBuilderValidators.compose([
                FormBuilderValidators.required(),
                FormBuilderValidators.numeric(),
                FormBuilderValidators.min(0),
              ]),
            ),
          ],
        ),
      ),
    );
  }
}

// lib/features/daily_reports/domain/use_cases/submit_daily_report.dart
class SubmitDailyReport {
  final DailyReportRepository _repository;
  final SyncService _syncService;
  
  Future<void> execute(DailyReportEntity report) async {
    // Save to local database
    final localId = await _repository.saveDailyReport(report);
    
    // Add to sync queue
    await _syncService.queueForSync(
      entityType: 'daily_report',
      entityId: localId,
      operation: 'create',
      payload: report.toJson(),
    );
    
    // Trigger sync if online
    _syncService.syncAll();
  }
}
```

### 5. Canvassing Feature

```dart
// lib/features/canvassing/presentation/screens/canvassing_form_screen.dart
class CanvassingFormScreen extends ConsumerStatefulWidget {
  @override
  ConsumerState<CanvassingFormScreen> createState() => _CanvassingFormScreenState();
}

class _CanvassingFormScreenState extends ConsumerState<CanvassingFormScreen> {
  final _formKey = GlobalKey<FormBuilderState>();
  final List<File> _photos = [];
  Position? _currentPosition;
  
  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }
  
  Future<void> _getCurrentLocation() async {
    final permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      await Geolocator.requestPermission();
    }
    
    try {
      _currentPosition = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      setState(() {});
    } catch (e) {
      // Handle error
    }
  }
  
  Future<void> _pickPhoto() async {
    if (_photos.length >= AppConfig.maxPhotosPerReport) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Maximum ${AppConfig.maxPhotosPerReport} photos allowed')),
      );
      return;
    }
    
    final ImagePicker picker = ImagePicker();
    final XFile? photo = await picker.pickImage(
      source: ImageSource.camera,
      imageQuality: 80,
    );
    
    if (photo != null) {
      final compressedFile = await _compressImage(File(photo.path));
      setState(() {
        _photos.add(compressedFile);
      });
    }
  }
  
  Future<File> _compressImage(File file) async {
    final result = await FlutterImageCompress.compressAndGetFile(
      file.absolute.path,
      '${file.path}_compressed.jpg',
      quality: 70,
      minWidth: 1024,
      minHeight: 1024,
    );
    
    return File(result!.path);
  }
}
```

## Testing Strategy

### 1. Unit Tests

```dart
// test/features/sync/sync_service_test.dart
void main() {
  late SyncService syncService;
  late MockAppDatabase mockDatabase;
  late MockSupabaseClient mockSupabase;
  
  setUp(() {
    mockDatabase = MockAppDatabase();
    mockSupabase = MockSupabaseClient();
    syncService = SyncServiceImpl(mockDatabase, mockSupabase);
  });
  
  group('SyncService', () {
    test('should process queue items in order', () async {
      // Arrange
      when(mockDatabase.getPendingQueueItems()).thenAnswer(
        (_) async => [
          QueueItem(id: '1', createdAt: DateTime(2024, 1, 1)),
          QueueItem(id: '2', createdAt: DateTime(2024, 1, 2)),
        ],
      );
      
      // Act
      await syncService.syncAll();
      
      // Assert
      verifyInOrder([
        mockDatabase.processQueueItem('1'),
        mockDatabase.processQueueItem('2'),
      ]);
    });
  });
}
```

### 2. Integration Tests

```dart
// integration_test/daily_report_flow_test.dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  
  testWidgets('Complete daily report submission flow', (WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();
    
    // Login
    await tester.enterText(find.byKey(Key('email_field')), 'test@example.com');
    await tester.enterText(find.byKey(Key('password_field')), 'password123');
    await tester.tap(find.byKey(Key('login_button')));
    await tester.pumpAndSettle();
    
    // Navigate to daily report
    await tester.tap(find.byIcon(Icons.add));
    await tester.pumpAndSettle();
    
    // Fill form
    await tester.enterText(find.byKey(Key('visits_count')), '5');
    await tester.enterText(find.byKey(Key('calls_count')), '10');
    await tester.enterText(find.byKey(Key('proposals_count')), '2');
    
    // Submit
    await tester.tap(find.byKey(Key('submit_button')));
    await tester.pumpAndSettle();
    
    // Verify success
    expect(find.text('Report submitted successfully'), findsOneWidget);
  });
}
```

## Performance Optimization

### 1. Image Optimization

```dart
class ImageOptimizer {
  static Future<File> optimizeForUpload(File image) async {
    final fileSize = await image.length();
    
    // Skip if already small
    if (fileSize < 1024 * 1024) return image; // < 1MB
    
    // Calculate quality based on file size
    int quality = 85;
    if (fileSize > 5 * 1024 * 1024) quality = 60;
    else if (fileSize > 3 * 1024 * 1024) quality = 70;
    
    final result = await FlutterImageCompress.compressAndGetFile(
      image.absolute.path,
      '${image.path}_optimized.jpg',
      quality: quality,
      minWidth: 1920,
      minHeight: 1080,
      rotate: 0,
    );
    
    return File(result!.path);
  }
}
```

### 2. Database Optimization

```dart
class DatabaseOptimizer {
  final AppDatabase database;
  
  Future<void> cleanupOldData() async {
    final cutoffDate = DateTime.now().subtract(
      Duration(days: AppConfig.offlineDataRetentionDays),
    );
    
    // Delete old synced reports
    await database.delete(database.dailyReports).where(
      (tbl) => tbl.isSynced.equals(true) & tbl.createdAt.isSmallerThan(cutoffDate),
    ).go();
    
    // Delete completed sync queue items
    await database.delete(database.syncQueue).where(
      (tbl) => tbl.status.equals('completed') & tbl.createdAt.isSmallerThan(cutoffDate),
    ).go();
  }
  
  Future<void> vacuum() async {
    await database.customStatement('VACUUM');
  }
}
```

## Deployment

### 1. Build Configuration

```bash
# Android build
flutter build apk --release --dart-define=SUPABASE_URL=$SUPABASE_URL \
  --dart-define=SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Bundle for Play Store
flutter build appbundle --release --dart-define=SUPABASE_URL=$SUPABASE_URL \
  --dart-define=SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
```

### 2. CI/CD Pipeline

```yaml
# .github/workflows/mobile-build.yml
name: Mobile Build

on:
  push:
    branches: [main, 'feature/mobile-*']
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - uses: subosito/flutter-action@v2
      with:
        flutter-version: '3.16.0'
        channel: 'stable'
    
    - name: Install dependencies
      run: flutter pub get
    
    - name: Run tests
      run: flutter test
    
    - name: Build APK
      run: flutter build apk --debug
      
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: build/app/outputs/flutter-apk/app-debug.apk
```

## Development Timeline

### Week 1-2: Foundation
- Flutter project setup
- Core architecture implementation
- Authentication module
- Basic navigation

### Week 3-4: Core Features
- Daily reports implementation
- Local database setup
- Offline storage

### Week 5-6: Field Operations
- Canvassing form
- Photo capture and compression
- GPS integration
- Basic sync

### Week 7-8: Sync & Polish
- Complete sync implementation
- Error handling
- UI polish
- Performance optimization

### Week 9-10: Testing & Deployment
- Comprehensive testing
- Bug fixes
- Play Store preparation
- Beta release

## Monitoring & Analytics

```dart
// lib/core/services/analytics_service.dart
class AnalyticsService {
  static void trackEvent(String name, Map<String, dynamic>? parameters) {
    // Firebase Analytics or custom implementation
  }
  
  static void trackScreen(String screenName) {
    // Screen view tracking
  }
  
  static void trackError(dynamic error, StackTrace? stack) {
    // Error tracking to Sentry or similar
  }
}
```

## Security Considerations

1. **Data Encryption**: All local data encrypted using SQLCipher
2. **Secure Storage**: Sensitive data in platform secure storage
3. **Certificate Pinning**: For production API calls
4. **Biometric Auth**: Optional for app access
5. **Session Management**: Automatic timeout and refresh

## Conclusion

This implementation guide provides a comprehensive roadmap for building the PakeAja CRM Mobile App with Flutter. The architecture ensures scalability, maintainability, and excellent offline capabilities while the git worktree approach enables efficient parallel development.