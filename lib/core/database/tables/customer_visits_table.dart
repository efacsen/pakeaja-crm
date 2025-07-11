import 'package:drift/drift.dart';
import 'daily_reports_table.dart';

@DataClassName('CustomerVisitData')
class CustomerVisits extends Table {
  TextColumn get id => text()();
  TextColumn get reportId => text().references(DailyReports, #id)();
  TextColumn get customerId => text()();
  TextColumn get customerName => text()();
  DateTimeColumn get visitTime => dateTime()();
  TextColumn get visitOutcome => text()(); // successful, unsuccessful, follow_up_required, etc.
  TextColumn get notes => text().nullable()();
  TextColumn get nextAction => text().nullable()();
  DateTimeColumn get followUpDate => dateTime().nullable()();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  
  @override
  Set<Column> get primaryKey => {id};
  
  @override
  List<String> get customConstraints => [
    'FOREIGN KEY (report_id) REFERENCES daily_reports(id) ON DELETE CASCADE',
  ];
}