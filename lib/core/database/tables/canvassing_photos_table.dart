import 'package:drift/drift.dart';
import 'canvassing_sessions_table.dart';

class CanvassingPhotos extends Table {
  TextColumn get id => text()();
  TextColumn get sessionId => text().references(CanvassingSessions, #id)();
  TextColumn get filePath => text()();
  IntColumn get fileSizeBytes => integer()();
  DateTimeColumn get capturedAt => dateTime()();
  TextColumn get caption => text().nullable()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
  TextColumn get syncedUrl => text().nullable()();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  
  @override
  Set<Column> get primaryKey => {id};
  
  @override
  List<Index> get indexes => [
    Index('idx_canvassing_photos_session_id', [sessionId]),
    Index('idx_canvassing_photos_sync_status', [isSynced]),
  ];
}