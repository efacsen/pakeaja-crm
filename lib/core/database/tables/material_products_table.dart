import 'package:drift/drift.dart';

class MaterialProducts extends Table {
  TextColumn get id => text()();
  TextColumn get code => text()();
  TextColumn get name => text()();
  TextColumn get category => text()();
  TextColumn get unit => text()();
  RealColumn get basePrice => real()();
  TextColumn get priceTiers => text()(); // JSON
  TextColumn get description => text()();
  TextColumn get specifications => text()(); // JSON
  TextColumn get imageUrls => text()(); // JSON array
  BoolColumn get isActive => boolean().withDefault(const Constant(true))();
  IntColumn get stockLevel => integer().withDefault(const Constant(0))();
  DateTimeColumn get lastSyncedAt => dateTime()();
  DateTimeColumn get lastViewedAt => dateTime().nullable()();
  
  @override
  Set<Column> get primaryKey => {id};
}