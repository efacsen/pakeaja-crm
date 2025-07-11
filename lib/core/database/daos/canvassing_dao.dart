import 'dart:convert';
import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../app_database.dart';
import '../tables/prospect_customers_table.dart';
import '../tables/canvassing_sessions_table.dart';
import '../tables/canvassing_photos_table.dart';
import '../../../features/canvassing/domain/entities/prospect_customer.dart';
import '../../../features/canvassing/domain/entities/canvassing_session.dart';
import '../../../features/canvassing/domain/entities/canvassing_photo.dart';
import '../../../features/canvassing/domain/entities/contact.dart';

part 'canvassing_dao.g.dart';

@DriftAccessor(tables: [ProspectCustomers, CanvassingSessions, CanvassingPhotos])
class CanvassingDao extends DatabaseAccessor<AppDatabase> with _$CanvassingDaoMixin {
  final _uuid = const Uuid();
  
  CanvassingDao(super.db);
  
  // Prospect Customer operations
  Future<ProspectCustomer> insertProspectCustomer(ProspectCustomer prospect) async {
    final id = prospect.id.isEmpty ? _uuid.v4() : prospect.id;
    final prospectWithId = ProspectCustomer(
      id: id,
      companyName: prospect.companyName,
      address: prospect.address,
      latitude: prospect.latitude,
      longitude: prospect.longitude,
      businessType: prospect.businessType,
      potentialAreaSqm: prospect.potentialAreaSqm,
      potentialValueIdr: prospect.potentialValueIdr,
      notes: prospect.notes,
      contacts: prospect.contacts,
      createdAt: prospect.createdAt ?? DateTime.now(),
      updatedAt: DateTime.now(),
      isSynced: prospect.isSynced,
    );
    
    await into(prospectCustomers).insert(
      ProspectCustomersCompanion(
        id: Value(id),
        companyName: Value(prospectWithId.companyName),
        address: Value(prospectWithId.address),
        latitude: Value(prospectWithId.latitude),
        longitude: Value(prospectWithId.longitude),
        businessType: Value(prospectWithId.businessType),
        potentialAreaSqm: Value(prospectWithId.potentialAreaSqm),
        potentialValueIdr: Value(prospectWithId.potentialValueIdr),
        notes: Value(prospectWithId.notes),
        contacts: Value(jsonEncode(prospectWithId.contacts.map((c) => c.toJson()).toList())),
        createdAt: Value(prospectWithId.createdAt!),
        updatedAt: Value(prospectWithId.updatedAt!),
        isSynced: Value(prospectWithId.isSynced),
      ),
    );
    
    return prospectWithId;
  }
  
  Future<ProspectCustomer?> getProspectCustomerById(String id) async {
    final query = select(prospectCustomers)..where((tbl) => tbl.id.equals(id));
    final row = await query.getSingleOrNull();
    return row != null ? _mapRowToProspectCustomer(row) : null;
  }
  
  Future<List<ProspectCustomer>> getAllProspectCustomers() async {
    final rows = await select(prospectCustomers).get();
    return rows.map(_mapRowToProspectCustomer).toList();
  }
  
  Future<List<ProspectCustomer>> searchProspectCustomers(String query) async {
    final searchQuery = select(prospectCustomers)
      ..where((tbl) => 
        tbl.companyName.contains(query) |
        tbl.address.contains(query) |
        tbl.businessType.contains(query) |
        tbl.notes.contains(query)
      );
    final rows = await searchQuery.get();
    return rows.map(_mapRowToProspectCustomer).toList();
  }
  
  Future<List<ProspectCustomer>> getNearbyProspectCustomers(
    double latitude,
    double longitude,
    double radiusKm,
  ) async {
    // Simple distance calculation using degrees (approximate)
    // 1 degree latitude ≈ 111 km
    final latDelta = radiusKm / 111;
    // 1 degree longitude varies by latitude, using rough approximation
    final lonDelta = radiusKm / (111 * 0.8);
    
    final query = select(prospectCustomers)
      ..where((tbl) =>
        tbl.latitude.isBetweenValues(latitude - latDelta, latitude + latDelta) &
        tbl.longitude.isBetweenValues(longitude - lonDelta, longitude + lonDelta)
      );
    
    final rows = await query.get();
    return rows.map(_mapRowToProspectCustomer).toList();
  }
  
  Future<void> updateProspectCustomer(ProspectCustomer prospect) async {
    await update(prospectCustomers).replace(
      ProspectCustomersCompanion(
        id: Value(prospect.id),
        companyName: Value(prospect.companyName),
        address: Value(prospect.address),
        latitude: Value(prospect.latitude),
        longitude: Value(prospect.longitude),
        businessType: Value(prospect.businessType),
        potentialAreaSqm: Value(prospect.potentialAreaSqm),
        potentialValueIdr: Value(prospect.potentialValueIdr),
        notes: Value(prospect.notes),
        contacts: Value(jsonEncode(prospect.contacts.map((c) => c.toJson()).toList())),
        createdAt: Value(prospect.createdAt ?? DateTime.now()),
        updatedAt: Value(DateTime.now()),
        isSynced: Value(prospect.isSynced),
      ),
    );
  }
  
  // Canvassing Session operations
  Future<CanvassingSession> insertCanvassingSession(CanvassingSession session) async {
    final id = session.id.isEmpty ? _uuid.v4() : session.id;
    final sessionWithId = CanvassingSession(
      id: id,
      prospectId: session.prospectId,
      visitDate: session.visitDate,
      outcome: session.outcome,
      visitNotes: session.visitNotes,
      followUpDate: session.followUpDate,
      photoIds: session.photoIds,
      visitDuration: session.visitDuration,
      isSynced: session.isSynced,
    );
    
    await into(canvassingSessions).insert(
      CanvassingSessionsCompanion(
        id: Value(id),
        prospectId: Value(sessionWithId.prospectId),
        visitDate: Value(sessionWithId.visitDate),
        outcome: Value(sessionWithId.outcome),
        visitNotes: Value(sessionWithId.visitNotes),
        followUpDate: Value(sessionWithId.followUpDate),
        photoIds: Value(jsonEncode(sessionWithId.photoIds)),
        visitDurationMs: Value(sessionWithId.visitDuration.inMilliseconds),
        isSynced: Value(sessionWithId.isSynced),
      ),
    );
    
    return sessionWithId;
  }
  
  Future<List<CanvassingSession>> getSessionsByProspectId(String prospectId) async {
    final query = select(canvassingSessions)
      ..where((tbl) => tbl.prospectId.equals(prospectId))
      ..orderBy([(tbl) => OrderingTerm.desc(tbl.visitDate)]);
    final rows = await query.get();
    return rows.map(_mapRowToCanvassingSession).toList();
  }
  
  Future<CanvassingSession?> getLatestSessionForProspect(String prospectId) async {
    final query = select(canvassingSessions)
      ..where((tbl) => tbl.prospectId.equals(prospectId))
      ..orderBy([(tbl) => OrderingTerm.desc(tbl.visitDate)])
      ..limit(1);
    final row = await query.getSingleOrNull();
    return row != null ? _mapRowToCanvassingSession(row) : null;
  }
  
  // Photo operations
  Future<CanvassingPhoto> insertCanvassingPhoto(CanvassingPhoto photo) async {
    final id = photo.id.isEmpty ? _uuid.v4() : photo.id;
    final photoWithId = CanvassingPhoto(
      id: id,
      sessionId: photo.sessionId,
      filePath: photo.filePath,
      fileSizeBytes: photo.fileSizeBytes,
      capturedAt: photo.capturedAt,
      caption: photo.caption,
      isSynced: photo.isSynced,
      syncedUrl: photo.syncedUrl,
    );
    
    await into(canvassingPhotos).insert(
      CanvassingPhotosCompanion(
        id: Value(id),
        sessionId: Value(photoWithId.sessionId),
        filePath: Value(photoWithId.filePath),
        fileSizeBytes: Value(photoWithId.fileSizeBytes),
        capturedAt: Value(photoWithId.capturedAt),
        caption: Value(photoWithId.caption),
        isSynced: Value(photoWithId.isSynced),
        syncedUrl: Value(photoWithId.syncedUrl),
      ),
    );
    
    return photoWithId;
  }
  
  Future<List<CanvassingPhoto>> getPhotosBySessionId(String sessionId) async {
    final query = select(canvassingPhotos)
      ..where((tbl) => tbl.sessionId.equals(sessionId))
      ..orderBy([(tbl) => OrderingTerm.asc(tbl.capturedAt)]);
    final rows = await query.get();
    return rows.map(_mapRowToCanvassingPhoto).toList();
  }
  
  Future<bool> deleteCanvassingPhoto(String photoId) async {
    final deletedRows = await (delete(canvassingPhotos)
      ..where((tbl) => tbl.id.equals(photoId))
    ).go();
    return deletedRows > 0;
  }
  
  // Sync operations
  Future<int> countUnsyncedProspects() async {
    final query = selectOnly(prospectCustomers)
      ..addColumns([prospectCustomers.id.count()])
      ..where(prospectCustomers.isSynced.equals(false));
    final result = await query.getSingle();
    return result.read(prospectCustomers.id.count()) ?? 0;
  }
  
  Future<int> countUnsyncedSessions() async {
    final query = selectOnly(canvassingSessions)
      ..addColumns([canvassingSessions.id.count()])
      ..where(canvassingSessions.isSynced.equals(false));
    final result = await query.getSingle();
    return result.read(canvassingSessions.id.count()) ?? 0;
  }
  
  Future<int> countUnsyncedPhotos() async {
    final query = selectOnly(canvassingPhotos)
      ..addColumns([canvassingPhotos.id.count()])
      ..where(canvassingPhotos.isSynced.equals(false));
    final result = await query.getSingle();
    return result.read(canvassingPhotos.id.count()) ?? 0;
  }
  
  Future<void> markProspectAsSynced(String id) async {
    await (update(prospectCustomers)..where((tbl) => tbl.id.equals(id)))
      .write(const ProspectCustomersCompanion(isSynced: Value(true)));
  }
  
  Future<void> markSessionAsSynced(String id) async {
    await (update(canvassingSessions)..where((tbl) => tbl.id.equals(id)))
      .write(const CanvassingSessionsCompanion(isSynced: Value(true)));
  }
  
  Future<void> markPhotoAsSynced(String id, String syncedUrl) async {
    await (update(canvassingPhotos)..where((tbl) => tbl.id.equals(id)))
      .write(CanvassingPhotosCompanion(
        isSynced: const Value(true),
        syncedUrl: Value(syncedUrl),
      ));
  }
  
  // Helper methods
  ProspectCustomer _mapRowToProspectCustomer(ProspectCustomersData row) {
    final contactsJson = jsonDecode(row.contacts) as List<dynamic>;
    final contacts = contactsJson
        .map((c) => Contact.fromJson(c as Map<String, dynamic>))
        .toList();
    
    return ProspectCustomer(
      id: row.id,
      companyName: row.companyName,
      address: row.address,
      latitude: row.latitude,
      longitude: row.longitude,
      businessType: row.businessType,
      potentialAreaSqm: row.potentialAreaSqm,
      potentialValueIdr: row.potentialValueIdr,
      notes: row.notes,
      contacts: contacts,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      isSynced: row.isSynced,
    );
  }
  
  CanvassingSession _mapRowToCanvassingSession(CanvassingSessionsData row) {
    final photoIdsJson = jsonDecode(row.photoIds) as List<dynamic>;
    final photoIds = photoIdsJson.map((id) => id as String).toList();
    
    return CanvassingSession(
      id: row.id,
      prospectId: row.prospectId,
      visitDate: row.visitDate,
      outcome: row.outcome,
      visitNotes: row.visitNotes,
      followUpDate: row.followUpDate,
      photoIds: photoIds,
      visitDuration: Duration(milliseconds: row.visitDurationMs),
      isSynced: row.isSynced,
    );
  }
  
  CanvassingPhoto _mapRowToCanvassingPhoto(CanvassingPhotosData row) {
    return CanvassingPhoto(
      id: row.id,
      sessionId: row.sessionId,
      filePath: row.filePath,
      fileSizeBytes: row.fileSizeBytes,
      capturedAt: row.capturedAt,
      caption: row.caption,
      isSynced: row.isSynced,
      syncedUrl: row.syncedUrl,
    );
  }
}