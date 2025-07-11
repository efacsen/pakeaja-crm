import 'package:drift/drift.dart';

class ProspectCustomers extends Table {
  TextColumn get id => text()();
  TextColumn get companyName => text().withLength(min: 1, max: 200)();
  TextColumn get address => text()();
  RealColumn get latitude => real()();
  RealColumn get longitude => real()();
  TextColumn get businessType => text().withLength(min: 1, max: 50)();
  RealColumn get potentialAreaSqm => real()();
  RealColumn get potentialValueIdr => real()();
  TextColumn get notes => text().nullable()();
  TextColumn get contacts => text()(); // JSON array of contacts
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  DateTimeColumn get updatedAt => dateTime().withDefault(currentDateAndTime)();
  BoolColumn get isSynced => boolean().withDefault(const Constant(false))();
  
  @override
  Set<Column> get primaryKey => {id};
  
  @override
  List<Set<Column>> get uniqueKeys => [
    {companyName, latitude, longitude}, // Prevent duplicate companies at same location
  ];
}