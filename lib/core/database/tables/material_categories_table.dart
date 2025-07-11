import 'package:drift/drift.dart';

class MaterialCategories extends Table {
  TextColumn get id => text()();
  TextColumn get name => text()();
  TextColumn get parentId => text().nullable()();
  IntColumn get productCount => integer()();
  TextColumn get iconName => text()();
  
  @override
  Set<Column> get primaryKey => {id};
}