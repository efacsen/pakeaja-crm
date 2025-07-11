import 'package:drift/drift.dart';

@DataClassName('DailyReportData')
class DailyReports extends Table {
  TextColumn get id => text()();
  TextColumn get userId => text()();
  DateTimeColumn get reportDate => dateTime()();
  TextColumn get visitSummary => text()();
  IntColumn get totalVisits => integer().withDefault(const Constant(0))();
  IntColumn get totalCalls => integer().withDefault(const Constant(0))();
  IntColumn get proposalsSent => integer().withDefault(const Constant(0))();
  TextColumn get status => text()(); // draft, submitted, approved
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  
  @override
  Set<Column> get primaryKey => {id};
  
  @override
  List<String> get customConstraints => [
    'FOREIGN KEY (user_id) REFERENCES users(id)',
  ];
}