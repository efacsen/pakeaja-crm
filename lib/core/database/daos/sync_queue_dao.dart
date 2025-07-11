import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/sync_queue_table.dart';

part 'sync_queue_dao.g.dart';

@DriftAccessor(tables: [SyncQueue])
class SyncQueueDao extends DatabaseAccessor<AppDatabase> with _$SyncQueueDaoMixin {
  SyncQueueDao(AppDatabase db) : super(db);

  // Get pending sync items
  Future<List<SyncQueueData>> getPendingSyncItems({int limit = 50}) {
    return (select(syncQueue)
          ..where((s) => s.isSynced.equals(false))
          ..orderBy([
            (s) => OrderingTerm(expression: s.retryCount, mode: OrderingMode.asc),
            (s) => OrderingTerm(expression: s.createdAt, mode: OrderingMode.asc),
          ])
          ..limit(limit))
        .get();
  }

  // Add item to sync queue
  Future<int> addToQueue({
    required String entityType,
    required String entityId,
    required String action,
    required String payload,
  }) {
    return into(syncQueue).insert(
      SyncQueueCompanion(
        entityType: Value(entityType),
        entityId: Value(entityId),
        action: Value(action),
        payload: Value(payload),
      ),
    );
  }

  // Mark as synced
  Future<bool> markAsSynced(int id) {
    return (update(syncQueue)..where((s) => s.id.equals(id))).write(
      SyncQueueCompanion(
        isSynced: const Value(true),
        syncedAt: Value(DateTime.now()),
      ),
    );
  }

  // Update retry attempt
  Future<bool> updateRetryAttempt(int id, String? error) {
    return (update(syncQueue)..where((s) => s.id.equals(id))).write(
      SyncQueueCompanion(
        retryCount: const Value.absent(),
        lastAttemptAt: Value(DateTime.now()),
        lastError: Value(error),
      ),
    );
  }

  // Get sync stats
  Future<SyncStats> getSyncStats() async {
    final pending = await (selectOnly(syncQueue)
          ..where(syncQueue.isSynced.equals(false))
          ..addColumns([syncQueue.id.count()]))
        .map((row) => row.read(syncQueue.id.count()) ?? 0)
        .getSingle();

    final synced = await (selectOnly(syncQueue)
          ..where(syncQueue.isSynced.equals(true))
          ..addColumns([syncQueue.id.count()]))
        .map((row) => row.read(syncQueue.id.count()) ?? 0)
        .getSingle();

    return SyncStats(pending: pending, synced: synced);
  }

  // Clear synced items older than days
  Future<int> clearOldSyncedItems({int daysOld = 7}) {
    final cutoffDate = DateTime.now().subtract(Duration(days: daysOld));
    return (delete(syncQueue)
          ..where((s) =>
              s.isSynced.equals(true) & s.syncedAt.isSmallerThanValue(cutoffDate)))
        .go();
  }
}

class SyncStats {
  final int pending;
  final int synced;

  SyncStats({required this.pending, required this.synced});
}