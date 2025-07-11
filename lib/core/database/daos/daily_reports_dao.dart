import 'package:drift/drift.dart';
import '../app_database.dart';
import '../tables/daily_reports_table.dart';
import '../tables/customer_visits_table.dart';
import '../tables/daily_planning_table.dart';

part 'daily_reports_dao.g.dart';

@DriftAccessor(tables: [DailyReports, CustomerVisits, DailyPlanning])
class DailyReportsDao extends DatabaseAccessor<AppDatabase> with _$DailyReportsDaoMixin {
  DailyReportsDao(AppDatabase db) : super(db);

  // Daily Reports CRUD operations
  Future<List<DailyReportData>> getAllDailyReports() {
    return select(dailyReports).get();
  }

  Future<List<DailyReportData>> getDailyReportsByUserId(String userId) {
    return (select(dailyReports)..where((r) => r.userId.equals(userId))).get();
  }

  Future<DailyReportData?> getDailyReportById(String id) {
    return (select(dailyReports)..where((r) => r.id.equals(id))).getSingleOrNull();
  }

  Future<List<DailyReportData>> getDailyReportsByDateRange(String userId, DateTime startDate, DateTime endDate) {
    return (select(dailyReports)
          ..where((r) => r.userId.equals(userId))
          ..where((r) => r.reportDate.isBetweenValues(startDate, endDate))
          ..orderBy([(r) => OrderingTerm.desc(r.reportDate)]))
        .get();
  }

  Future<DailyReportData?> getDailyReportByDate(String userId, DateTime date) {
    final startOfDay = DateTime(date.year, date.month, date.day);
    final endOfDay = startOfDay.add(const Duration(days: 1));
    
    return (select(dailyReports)
          ..where((r) => r.userId.equals(userId))
          ..where((r) => r.reportDate.isBetweenValues(startOfDay, endOfDay)))
        .getSingleOrNull();
  }

  Future<List<DailyReportData>> getUnsyncedReports() {
    return (select(dailyReports)..where((r) => r.isSynced.equals(false))).get();
  }

  Future<List<DailyReportData>> getDraftReports(String userId) {
    return (select(dailyReports)
          ..where((r) => r.userId.equals(userId))
          ..where((r) => r.status.equals('draft'))
          ..orderBy([(r) => OrderingTerm.desc(r.updatedAt)]))
        .get();
  }

  Future<int> insertDailyReport(DailyReportData report) {
    return into(dailyReports).insert(report);
  }

  Future<bool> updateDailyReport(DailyReportData report) {
    return update(dailyReports).replace(report);
  }

  Future<int> deleteDailyReport(String id) {
    return (delete(dailyReports)..where((r) => r.id.equals(id))).go();
  }

  Future<int> markReportAsSynced(String id) {
    return (update(dailyReports)..where((r) => r.id.equals(id)))
        .write(DailyReportsCompanion(
          isSynced: const Value(true),
          updatedAt: Value(DateTime.now()),
        ));
  }

  // Customer Visits CRUD operations
  Future<List<CustomerVisitData>> getCustomerVisitsByReportId(String reportId) {
    return (select(customerVisits)
          ..where((v) => v.reportId.equals(reportId))
          ..orderBy([(v) => OrderingTerm.asc(v.visitTime)]))
        .get();
  }

  Future<CustomerVisitData?> getCustomerVisitById(String id) {
    return (select(customerVisits)..where((v) => v.id.equals(id))).getSingleOrNull();
  }

  Future<List<CustomerVisitData>> getUnsyncedCustomerVisits() {
    return (select(customerVisits)..where((v) => v.isSynced.equals(false))).get();
  }

  Future<List<CustomerVisitData>> getCustomerVisitsByCustomerId(String customerId) {
    return (select(customerVisits)
          ..where((v) => v.customerId.equals(customerId))
          ..orderBy([(v) => OrderingTerm.desc(v.visitTime)]))
        .get();
  }

  Future<int> insertCustomerVisit(CustomerVisitData visit) {
    return into(customerVisits).insert(visit);
  }

  Future<bool> updateCustomerVisit(CustomerVisitData visit) {
    return update(customerVisits).replace(visit);
  }

  Future<int> deleteCustomerVisit(String id) {
    return (delete(customerVisits)..where((v) => v.id.equals(id))).go();
  }

  Future<int> markCustomerVisitAsSynced(String id) {
    return (update(customerVisits)..where((v) => v.id.equals(id)))
        .write(CustomerVisitsCompanion(
          isSynced: const Value(true),
          updatedAt: Value(DateTime.now()),
        ));
  }

  // Planning Items CRUD operations
  Future<List<PlanningItemData>> getPlanningItemsByReportId(String reportId) {
    return (select(planningItems)
          ..where((p) => p.reportId.equals(reportId))
          ..orderBy([(p) => OrderingTerm.asc(p.scheduledDate)]))
        .get();
  }

  Future<PlanningItemData?> getPlanningItemById(String id) {
    return (select(planningItems)..where((p) => p.id.equals(id))).getSingleOrNull();
  }

  Future<List<PlanningItemData>> getUnsyncedPlanningItems() {
    return (select(planningItems)..where((p) => p.isSynced.equals(false))).get();
  }

  Future<List<PlanningItemData>> getPlanningItemsByDateRange(DateTime startDate, DateTime endDate) {
    return (select(planningItems)
          ..where((p) => p.scheduledDate.isBetweenValues(startDate, endDate))
          ..orderBy([(p) => OrderingTerm.asc(p.scheduledDate)]))
        .get();
  }

  Future<List<PlanningItemData>> getTodaysPlanningItems() {
    final today = DateTime.now();
    final startOfDay = DateTime(today.year, today.month, today.day);
    final endOfDay = startOfDay.add(const Duration(days: 1));
    
    return (select(planningItems)
          ..where((p) => p.scheduledDate.isBetweenValues(startOfDay, endOfDay))
          ..where((p) => p.isCompleted.equals(false))
          ..orderBy([(p) => OrderingTerm.asc(p.scheduledDate)]))
        .get();
  }

  Future<int> insertPlanningItem(PlanningItemData item) {
    return into(planningItems).insert(item);
  }

  Future<bool> updatePlanningItem(PlanningItemData item) {
    return update(planningItems).replace(item);
  }

  Future<int> deletePlanningItem(String id) {
    return (delete(planningItems)..where((p) => p.id.equals(id))).go();
  }

  Future<int> markPlanningItemAsSynced(String id) {
    return (update(planningItems)..where((p) => p.id.equals(id)))
        .write(PlanningItemsCompanion(
          isSynced: const Value(true),
          updatedAt: Value(DateTime.now()),
        ));
  }

  Future<int> markPlanningItemAsCompleted(String id) {
    return (update(planningItems)..where((p) => p.id.equals(id)))
        .write(PlanningItemsCompanion(
          isCompleted: const Value(true),
          updatedAt: Value(DateTime.now()),
        ));
  }

  // Complex queries
  Stream<List<DailyReportData>> watchDailyReportsByUserId(String userId) {
    return (select(dailyReports)
          ..where((r) => r.userId.equals(userId))
          ..orderBy([(r) => OrderingTerm.desc(r.reportDate)]))
        .watch();
  }

  Stream<List<CustomerVisitData>> watchCustomerVisitsByReportId(String reportId) {
    return (select(customerVisits)
          ..where((v) => v.reportId.equals(reportId))
          ..orderBy([(v) => OrderingTerm.asc(v.visitTime)]))
        .watch();
  }

  Stream<List<PlanningItemData>> watchPlanningItemsByReportId(String reportId) {
    return (select(planningItems)
          ..where((p) => p.reportId.equals(reportId))
          ..orderBy([(p) => OrderingTerm.asc(p.scheduledDate)]))
        .watch();
  }

  // Statistics queries
  Future<Map<String, int>> getDailyReportStats(String userId, DateTime date) async {
    final report = await getDailyReportByDate(userId, date);
    if (report == null) {
      return {
        'totalReports': 0,
        'totalVisits': 0,
        'totalCalls': 0,
        'proposalsSent': 0,
      };
    }

    return {
      'totalReports': 1,
      'totalVisits': report.totalVisits,
      'totalCalls': report.totalCalls,
      'proposalsSent': report.proposalsSent,
    };
  }

  Future<Map<String, int>> getMonthlyStats(String userId, DateTime month) async {
    final startOfMonth = DateTime(month.year, month.month, 1);
    final endOfMonth = DateTime(month.year, month.month + 1, 1);
    
    final reports = await getDailyReportsByDateRange(userId, startOfMonth, endOfMonth);
    
    return {
      'totalReports': reports.length,
      'totalVisits': reports.fold(0, (sum, r) => sum + r.totalVisits),
      'totalCalls': reports.fold(0, (sum, r) => sum + r.totalCalls),
      'proposalsSent': reports.fold(0, (sum, r) => sum + r.proposalsSent),
    };
  }
}