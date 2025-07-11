import 'package:drift/drift.dart';
import 'prospect_customers_table.dart';

class CanvassingSessions extends Table {
  TextColumn get id => text()();
  TextColumn get prospectId => text().references(ProspectCustomers, #id)();
  DateTimeColumn get visitDate => dateTime()();
  TextColumn get outcome => text().withLength(min: 1, max: 50)();
  TextColumn get visitNotes => text()();
  DateTimeColumn get followUpDate => dateTime().nullable()();
  TextColumn get photoIds => text().withDefault(const Constant('[]'))(); // JSON array
  IntColumn get visitDurationMs => integer()(); // Duration in milliseconds
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  
  @override
  Set<Column> get primaryKey => {id};
  
  @override
  List<Index> get indexes => [
    Index('idx_canvassing_sessions_prospect_id', [prospectId]),
    Index('idx_canvassing_sessions_visit_date', [visitDate]),
    Index('idx_canvassing_sessions_sync_status', [isSynced]),
  ];
}