import 'package:drift/drift.dart';

@TableIndex(name: 'idx_material_code', columns: {#code})
@TableIndex(name: 'idx_material_name', columns: {#name})
@TableIndex(name: 'idx_material_category', columns: {#category})
@TableIndex(name: 'idx_material_active', columns: {#isActive})
@TableIndex(name: 'idx_material_last_viewed', columns: {#lastViewedAt})
class MaterialProductsIndexed extends Table {
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
  
  @override
  String get tableName => 'material_products';
}