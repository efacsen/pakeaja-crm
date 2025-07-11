import 'package:drift/drift.dart';
import 'daily_reports_table.dart';

@DataClassName('PlanningItemData')
class DailyPlanning extends Table {
  TextColumn get id => text()();
  TextColumn get reportId => text().references(DailyReports, #id)();
  TextColumn get activity => text()();
  DateTimeColumn get scheduledDate => dateTime()();
  TextColumn get priority => text()(); // low, medium, high, urgent
  TextColumn get customerId => text().nullable()();
  TextColumn get customerName => text().nullable()();
  TextColumn get notes => text().nullable()();
  BoolColumn get isCompleted => boolean().withDefault(const Constant(false))();
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