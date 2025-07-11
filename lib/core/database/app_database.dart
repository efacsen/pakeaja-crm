import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;
import 'package:sqlite3/sqlite3.dart';
import 'package:sqlite3_flutter_libs/sqlite3_flutter_libs.dart';

// Core tables
import 'tables/users_table.dart';
import 'tables/sync_queue_table.dart';

// Daily Reports tables
import 'tables/daily_reports_table.dart';
import 'tables/customer_visits_table.dart';
import 'tables/daily_planning_table.dart';

// Canvassing tables
import 'tables/prospect_customers_table.dart';
import 'tables/canvassing_sessions_table.dart';
import 'tables/canvassing_photos_table.dart';

// Materials tables
import 'tables/material_products_table.dart';
import 'tables/material_categories_table.dart';

// DAOs
import 'daos/users_dao.dart';
import 'daos/sync_queue_dao.dart';
import 'daos/daily_reports_dao.dart';
import 'daos/canvassing_dao.dart';
import 'daos/materials_dao.dart';

part 'app_database.g.dart';

@DriftDatabase(
  tables: [
    // Core tables
    Users,
    SyncQueue,
    // Daily Reports tables
    DailyReports,
    CustomerVisits,
    DailyPlanning,
    // Canvassing tables
    ProspectCustomers,
    CanvassingSessions,
    CanvassingPhotos,
    // Materials tables
    MaterialProducts,
    MaterialCategories,
  ],
  daos: [
    UsersDao,
    SyncQueueDao,
    DailyReportsDao,
    CanvassingDao,
    MaterialsDao,
  ],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 2; // Increment version for new tables

  @override
  MigrationStrategy get migration {
    return MigrationStrategy(
      onCreate: (Migrator m) async {
        await m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
        if (from < 2) {
          // Add new tables from feature modules
          await m.createTable(dailyReports);
          await m.createTable(customerVisits);
          await m.createTable(dailyPlanning);
          await m.createTable(prospectCustomers);
          await m.createTable(canvassingSessions);
          await m.createTable(canvassingPhotos);
          await m.createTable(materialProducts);
          await m.createTable(materialCategories);
        }
      },
    );
  }

  // Helper method to clear all tables (useful for logout)
  Future<void> clearAllTables() async {
    await transaction(() async {
      for (final table in allTables) {
        await delete(table).go();
      }
    });
  }

  static LazyDatabase _openConnection() {
    return LazyDatabase(() async {
      final dbFolder = await getApplicationDocumentsDirectory();
      final file = File(p.join(dbFolder.path, 'pakeaja_crm.db'));

      // Also work around limitations on old Android versions
      if (Platform.isAndroid) {
        await applyWorkaroundToOpenSqlite3OnOldAndroidVersions();
      }

      // Make sqlite3 pick a more suitable location for temporary files - the
      // one from the system may be inaccessible due to sandboxing.
      final cachebase = (await getTemporaryDirectory()).path;
      sqlite3.tempDirectory = cachebase;

      return NativeDatabase.createInBackground(file);
    });
  }
}