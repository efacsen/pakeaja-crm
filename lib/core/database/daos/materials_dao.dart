import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/material_products_indexed_table.dart';
import '../tables/material_categories_table.dart';
import '../../features/materials/domain/entities/material_product.dart';
import '../../features/materials/domain/entities/material_category.dart';
import 'dart:convert';

part 'materials_dao.g.dart';

@DriftAccessor(tables: [MaterialProductsIndexed, MaterialCategories])
class MaterialsDao extends DatabaseAccessor<AppDatabase> with _$MaterialsDaoMixin {
  MaterialsDao(AppDatabase db) : super(db);
  
  // Optimized search with FTS
  Future<List<MaterialProduct>> searchMaterials({
    String? query,
    String? category,
    double? minPrice,
    double? maxPrice,
    bool? inStockOnly,
    int limit = 50,
  }) async {
    if (query != null && query.isNotEmpty) {
      // Use FTS for text search
      final ftsResults = await customSelect(
        '''
        SELECT p.* FROM material_products p
        INNER JOIN material_products_fts f ON p.id = f.id
        WHERE material_products_fts MATCH ?
        ${category != null ? 'AND p.category = ?' : ''}
        ${minPrice != null ? 'AND p.base_price >= ?' : ''}
        ${maxPrice != null ? 'AND p.base_price <= ?' : ''}
        ${inStockOnly == true ? 'AND p.stock_level > 0' : ''}
        ORDER BY rank, p.last_viewed_at DESC NULLS LAST
        LIMIT ?
        ''',
        variables: [
          Variable.withString(_buildFtsQuery(query)),
          if (category != null) Variable.withString(category),
          if (minPrice != null) Variable.withReal(minPrice),
          if (maxPrice != null) Variable.withReal(maxPrice),
          Variable.withInt(limit),
        ],
        readsFrom: {materialProductsIndexed},
      ).map(_mapToMaterialProduct).get();
      
      return ftsResults;
    } else {
      // Regular query without text search
      final queryBuilder = select(materialProductsIndexed);
      
      if (category != null) {
        queryBuilder.where((t) => t.category.equals(category));
      }
      
      if (minPrice != null) {
        queryBuilder.where((t) => t.basePrice.isBiggerOrEqualValue(minPrice));
      }
      
      if (maxPrice != null) {
        queryBuilder.where((t) => t.basePrice.isSmallerOrEqualValue(maxPrice));
      }
      
      if (inStockOnly == true) {
        queryBuilder.where((t) => t.stockLevel.isBiggerThanValue(0));
      }
      
      queryBuilder
        ..orderBy([
          (t) => OrderingTerm(expression: t.lastViewedAt, mode: OrderingMode.desc),
        ])
        ..limit(limit);
      
      final results = await queryBuilder.get();
      return results.map(_convertToMaterialProduct).toList();
    }
  }
  
  // Get recently viewed materials
  Stream<List<MaterialProduct>> watchRecentlyViewed({int limit = 10}) {
    final query = select(materialProductsIndexed)
      ..where((t) => t.lastViewedAt.isNotNull())
      ..orderBy([(t) => OrderingTerm.desc(t.lastViewedAt)])
      ..limit(limit);
    
    return query.watch().map((rows) => 
      rows.map(_convertToMaterialProduct).toList()
    );
  }
  
  // Get material by ID
  Future<MaterialProduct?> getMaterialById(String id) async {
    final query = select(materialProductsIndexed)
      ..where((t) => t.id.equals(id));
    
    final result = await query.getSingleOrNull();
    return result != null ? _convertToMaterialProduct(result) : null;
  }
  
  // Track material view
  Future<void> trackMaterialView(String materialId) async {
    await (update(materialProductsIndexed)
      ..where((t) => t.id.equals(materialId)))
      .write(MaterialProductsIndexedCompanion(
        lastViewedAt: Value(DateTime.now()),
      ));
  }
  
  // Get all categories
  Future<List<MaterialCategory>> getCategories() async {
    final results = await select(materialCategories).get();
    return results.map((row) => MaterialCategory(
      id: row.id,
      name: row.name,
      parentId: row.parentId,
      productCount: row.productCount,
      iconName: row.iconName,
    )).toList();
  }
  
  // Bulk insert for initial sync
  Future<void> bulkInsertMaterials(List<MaterialProduct> materials) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(
        materialProductsIndexed,
        materials.map((m) => MaterialProductsIndexedCompanion(
          id: Value(m.id),
          code: Value(m.code),
          name: Value(m.name),
          category: Value(m.category),
          unit: Value(m.unit),
          basePrice: Value(m.basePrice),
          priceTiers: Value(jsonEncode(m.priceTiers)),
          description: Value(m.description),
          specifications: Value(jsonEncode(m.specifications)),
          imageUrls: Value(jsonEncode(m.imageUrls)),
          isActive: Value(m.isActive),
          stockLevel: Value(m.stockLevel),
          lastSyncedAt: Value(m.lastSyncedAt),
          lastViewedAt: Value(m.lastViewedAt),
        )).toList(),
      );
    });
  }
  
  // Helper to build FTS query
  String _buildFtsQuery(String query) {
    // Escape special characters and add prefix matching
    final escaped = query.replaceAll(RegExp(r'["]'), '""');
    // Search in all indexed fields with prefix matching
    return '"$escaped"* OR code:"$escaped"* OR name:"$escaped"*';
  }
  
  // Convert database row to domain entity
  MaterialProduct _convertToMaterialProduct(MaterialProductsIndexedData row) {
    return MaterialProduct(
      id: row.id,
      code: row.code,
      name: row.name,
      category: row.category,
      unit: row.unit,
      basePrice: row.basePrice,
      priceTiers: Map<String, double>.from(jsonDecode(row.priceTiers)),
      description: row.description,
      specifications: Map<String, String>.from(jsonDecode(row.specifications)),
      imageUrls: List<String>.from(jsonDecode(row.imageUrls)),
      isActive: row.isActive,
      stockLevel: row.stockLevel,
      lastSyncedAt: row.lastSyncedAt,
      lastViewedAt: row.lastViewedAt,
    );
  }
  
  // Map custom query result to MaterialProduct
  MaterialProduct _mapToMaterialProduct(QueryRow row) {
    return MaterialProduct(
      id: row.read<String>('id'),
      code: row.read<String>('code'),
      name: row.read<String>('name'),
      category: row.read<String>('category'),
      unit: row.read<String>('unit'),
      basePrice: row.read<double>('base_price'),
      priceTiers: Map<String, double>.from(jsonDecode(row.read<String>('price_tiers'))),
      description: row.read<String>('description'),
      specifications: Map<String, String>.from(jsonDecode(row.read<String>('specifications'))),
      imageUrls: List<String>.from(jsonDecode(row.read<String>('image_urls'))),
      isActive: row.read<bool>('is_active'),
      stockLevel: row.read<int>('stock_level'),
      lastSyncedAt: row.read<DateTime>('last_synced_at'),
      lastViewedAt: row.readNullable<DateTime>('last_viewed_at'),
    );
  }
}